/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useState, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, MarkerF } from '@react-google-maps/api';

const containerStyle = { width: '100%', height: '350px', borderRadius: '2px', border: '1px solid #e2e8f0' };
const center = { lat: 20.3889, lng: -99.9895 }; // San Juan del Río

export default function GoogleMapPicker({ onLocationSelect }: any) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""
  });

  const [markerPos, setMarkerPos] = useState<any>(null);

  const onMapClick = useCallback((e: google.maps.MapMouseEvent) => {
    if (!e.latLng) return;
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    
    setMarkerPos({ lat, lng });

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
      onClick={onMapClick}
      options={{ 
        disableDefaultUI: true, 
        zoomControl: true,
        // Para quitar el error de deprecación en el futuro se necesita un MapID de la consola de Google
        // mapId: "TU_MAP_ID_AQUI" 
      }}
    >
      {markerPos && <MarkerF position={markerPos} />}
    </GoogleMap>
  );
}