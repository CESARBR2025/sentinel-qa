/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useState, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, MarkerF } from '@react-google-maps/api';
import type { Library } from '@googlemaps/js-api-loader';

const containerStyle = { width: '100%', height: '350px', borderRadius: '2px', border: '1px solid #e2e8f0' };
const center = { lat: 20.3889, lng: -99.9895 }; // San Juan del Río

interface Props {
  onLocationSelect: (loc: { lat: number; lng: number; calle: string; colonia: string; numero: string }) => void
  markerPosition?: { lat: number; lng: number } | null
  libraries?: Library[]
  readOnly?: boolean
  onError?: (error: string) => void
}

export default function GoogleMapPicker({ onLocationSelect, markerPosition: externalMarker, libraries, readOnly, onError }: Props) {
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries,
  });

  React.useEffect(() => {
    if (loadError) {
      onError?.('Error de cuota excedida de Google Maps. Verifique su plan de facturación.');
    }
  }, [loadError, onError]);

  const [internalMarker, setInternalMarker] = useState<{ lat: number; lng: number } | null>(null);
  const markerPos = externalMarker ?? internalMarker;

  if (loadError) {
    return (
      <div style={{
        ...containerStyle,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        gap: 8, padding: 24, boxSizing: 'border-box',
        background: '#fef2f2', color: '#dc2626',
        fontFamily: 'Inter,sans-serif', fontSize: 12, textAlign: 'center',
      }}>
        <span style={{ fontWeight: 600 }}>Error de Google Maps</span>
        <span>Cuota de API excedida. Verifique su plan de facturación en la consola de Google Cloud.</span>
      </div>
    );
  }

  const onMapClick = useCallback((e: google.maps.MapMouseEvent) => {
    if (!e.latLng) return;
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    
    setInternalMarker({ lat, lng });

    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === "OK" && results?.[0]) {
        const addr = results[0].address_components;
        const getComp = (type: string) => addr.find(c => c.types.includes(type))?.long_name || "";

        // Enviamos los datos al padre
        onLocationSelect({
          lat,
          lng,
          calle: getComp("route"),
          colonia: getComp("sublocality_level_1") || getComp("neighborhood") || getComp("locality"),
          numero: getComp("street_number")
        });
      }
    });
  }, [onLocationSelect]);

  if (!isLoaded) return <div style={{...containerStyle, background: '#f1f5f9'}}>CARGANDO MAPA...</div>;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={15}
      onClick={readOnly ? undefined : onMapClick}
      options={{ 
        disableDefaultUI: true, 
        zoomControl: true,
        // Para quitar el error de deprecación en el futuro se necesita un MapID de la consola de Google
        // mapId: "TU_MAP_ID_AQUI" 
      }}
    >
      {markerPos && (
        <MarkerF
          position={markerPos}
          draggable={!readOnly}
          onClick={() => {}}
          onDragEnd={readOnly ? undefined : (e) => {
            if (!e.latLng) return;
            const lat = e.latLng.lat();
            const lng = e.latLng.lng();
            setInternalMarker({ lat, lng });
            const geocoder = new google.maps.Geocoder();
            geocoder.geocode({ location: { lat, lng } }, (results, status) => {
              if (status === 'OK' && results?.[0]) {
                const addr = results[0].address_components;
                const getComp = (type: string) => addr.find(c => c.types.includes(type))?.long_name || '';
                onLocationSelect({
                  lat, lng,
                  calle: getComp('route'),
                  colonia: getComp('sublocality_level_1') || getComp('neighborhood') || getComp('locality'),
                  numero: getComp('street_number'),
                });
              }
            });
          }}
        />
      )}
    </GoogleMap>
  );
}