'use client';
import { useEffect, useRef, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, MarkerF } from '@react-google-maps/api';
import type { UnidadParaDespacho } from '@/lib/flota/types';
import { formatAntiguedad } from './UnidadCards';

const containerStyle: React.CSSProperties = {
  width: '100%',
  height: '500px',
  borderRadius: '2px',
  border: '1px solid #e2e8f0',
};

const INCIDENTE_SVG = `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36">
  <circle cx="18" cy="14" r="14" fill="#dc2626" stroke="#fff" stroke-width="2"/>
  <polygon points="18,36 10,24 26,24" fill="#dc2626" stroke="#fff" stroke-width="2" stroke-linejoin="round"/>
  <line x1="18" y1="8" x2="18" y2="16" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/>
  <circle cx="18" cy="20" r="1.5" fill="#fff"/>
</svg>`)}`;

const MAX_UNIDADES_CERCANAS = 10;

const LOADING_STYLE: React.CSSProperties = {
  ...containerStyle,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: '#f1f5f9',
  fontFamily: 'Inter,sans-serif',
  fontSize: 12,
  color: '#94a3b8',
};

const ERROR_STYLE: React.CSSProperties = {
  ...containerStyle,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 8,
  padding: 24,
  boxSizing: 'border-box',
  background: '#fef2f2',
  color: '#dc2626',
  fontFamily: 'Inter,sans-serif',
  fontSize: 12,
  textAlign: 'center',
};

interface AsignacionMapaProps {
  unidades: UnidadParaDespacho[];
  incidenteLat: number | null;
  incidenteLng: number | null;
  seleccionadas: string[];
  onToggleUnidad: (id: string) => void;
}

export default function AsignacionMapa({
  unidades,
  incidenteLat,
  incidenteLng,
  seleccionadas,
  onToggleUnidad,
}: AsignacionMapaProps) {
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
  });

  const mapRef = useRef<google.maps.Map | null>(null);
  const boundsSetRef = useRef(false);

  const unidadesConUbicacion = unidades.filter(
    (u) => u.ultimaLat != null && u.ultimaLng != null
  );

  const onMapLoad = useCallback(
    (map: google.maps.Map) => {
      mapRef.current = map;
    },
    []
  );

  useEffect(() => {
    if (!isLoaded || !mapRef.current || boundsSetRef.current) return;
    if (incidenteLat == null || incidenteLng == null) return;

    const bounds = new google.maps.LatLngBounds();
    bounds.extend({ lat: incidenteLat, lng: incidenteLng });

    for (const u of unidadesConUbicacion) {
      bounds.extend({ lat: u.ultimaLat!, lng: u.ultimaLng! });
    }

    if (!bounds.isEmpty()) {
      mapRef.current.fitBounds(bounds, { left: 40, right: 40, top: 40, bottom: 40 });
      boundsSetRef.current = true;
    }
  }, [isLoaded, incidenteLat, incidenteLng, unidadesConUbicacion]);

  useEffect(() => {
    boundsSetRef.current = false;
  }, [incidenteLat, incidenteLng, unidades]);

  const masCercanaId = unidades.find(u => u.distanciaKm != null)?.id;
  const idsCercanas = new Set(
    unidades
      .filter(u => u.distanciaKm != null)
      .slice(0, MAX_UNIDADES_CERCANAS)
      .map(u => u.id)
  );

  function buildUnidadSvgIcon(u: UnidadParaDespacho): { url: string } {
    const esMasCercana = u.id === masCercanaId;
    const esCercana = idsCercanas.has(u.id);
    const fresco = u.ultimaUbicacionEn ? formatAntiguedad(u.ultimaUbicacionEn).fresco : false;
    const seleccionada = seleccionadas.includes(u.id);

    let fill: string;
    if (esMasCercana) {
      fill = '#16a34a';
    } else if (esCercana) {
      fill = '#1f355a';
    } else {
      fill = '#94a3b8';
    }

    const opacityAttr = esCercana ? '' : ' fill-opacity="0.55" stroke-opacity="0.55"';
    const dashAttr = fresco ? '' : ' stroke-dasharray="3 3"';

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="34" height="42" viewBox="0 0 34 42">
  <circle cx="17" cy="15" r="13" fill="${fill}"${opacityAttr} stroke="#fff" stroke-width="2"${dashAttr}/>
  <polygon points="17,40 9,25 25,25" fill="${fill}"${opacityAttr} stroke="#fff" stroke-width="2" stroke-linejoin="round"${dashAttr}/>
  <text x="17" y="19" text-anchor="middle" fill="#fff" font-family="Arial,sans-serif" font-size="10" font-weight="bold">P</text>
${seleccionada ? `  <circle cx="29" cy="8" r="7" fill="#1f355a" stroke="#fff" stroke-width="1.5"/>
  <polyline points="25,8 28,11 32,5" fill="none" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>` : ''}
</svg>`;

    return { url: `data:image/svg+xml,${encodeURIComponent(svg)}` };
  }

  if (loadError) {
    return (
      <div style={ERROR_STYLE}>
        <span style={{ fontWeight: 600 }}>Error de Google Maps</span>
        <span>Cuota de API excedida. Verifique su plan de facturación en la consola de Google Cloud.</span>
      </div>
    );
  }

  if (!isLoaded) {
    return <div style={LOADING_STYLE}>Cargando mapa...</div>;
  }

  if (incidenteLat == null || incidenteLng == null) {
    return (
      <div style={LOADING_STYLE}>
        Sin ubicación del incidente para mostrar en el mapa.
      </div>
    );
  }

  const center = { lat: incidenteLat, lng: incidenteLng };

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={14}
      onLoad={onMapLoad}
      options={{
        disableDefaultUI: true,
        zoomControl: true,
      }}
    >
      <MarkerF
        position={{ lat: incidenteLat, lng: incidenteLng }}
        icon={{ url: INCIDENTE_SVG }}
        clickable={false}
      />

      {unidadesConUbicacion.map((u) => (
        <MarkerF
          key={u.id}
          position={{ lat: u.ultimaLat!, lng: u.ultimaLng! }}
          icon={buildUnidadSvgIcon(u)}
          onClick={() => onToggleUnidad(u.id)}
        />
      ))}
    </GoogleMap>
  );
}
