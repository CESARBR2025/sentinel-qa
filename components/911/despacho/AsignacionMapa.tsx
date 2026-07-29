'use client';
import { useEffect, useRef, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, MarkerF } from '@react-google-maps/api';
import type { UnidadParaDespacho } from '@/lib/flota/types';
import { formatAntiguedad } from './UnidadCards';
import { colorPorPrioridad } from '@/lib/incidentes/prioridad-colores';

const containerStyle: React.CSSProperties = {
  width: '100%',
  height: '500px',
  borderRadius: '2px',
  border: '1px solid #e2e8f0',
};

function buildIncidenteSvgIcon(color: string): { url: string } {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="54" height="54" viewBox="0 0 54 54">
  <circle cx="27" cy="21" r="24" fill="#fff" fill-opacity="0.55"/>
  <circle cx="27" cy="21" r="21" fill="${color}" stroke="#fff" stroke-width="3"/>
  <polygon points="27,54 15,36 39,36" fill="${color}" stroke="#fff" stroke-width="3" stroke-linejoin="round"/>
  <polygon points="28,9 18,21 27,21 26,29 36,17 27,17 28,9" fill="#fff"/>
</svg>`;
  return { url: `data:image/svg+xml,${encodeURIComponent(svg)}` };
}

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
  prioritarioPatrullaId?: string | null;
  prioridad?: string | null;
}

export default function AsignacionMapa({
  unidades,
  incidenteLat,
  incidenteLng,
  seleccionadas,
  onToggleUnidad,
  prioritarioPatrullaId,
  prioridad,
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

  const esPrioritario = (id: string) => prioritarioPatrullaId != null && id === prioritarioPatrullaId;

  function buildUnidadSvgIcon(u: UnidadParaDespacho): { url: string } {
    const ocupada = u.ocupada;
    const prioritario = esPrioritario(u.id);
    if (ocupada) {
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="34" height="42" viewBox="0 0 34 42">
  <circle cx="17" cy="15" r="13" fill="#b91c1c" fill-opacity="0.55" stroke="#fff" stroke-width="2"/>
  <polygon points="17,40 9,25 25,25" fill="#b91c1c" fill-opacity="0.55" stroke="#fff" stroke-width="2" stroke-linejoin="round"/>
  <text x="17" y="19" text-anchor="middle" fill="#fff" font-family="Arial,sans-serif" font-size="10" font-weight="bold">P</text>
${prioritario ? `  <circle cx="7" cy="3" r="5" fill="#7c3aed" stroke="#fff" stroke-width="1.2"/>
  <text x="7" y="5" text-anchor="middle" fill="#fff" font-family="Arial,sans-serif" font-size="6" font-weight="bold">P</text>` : ''}
</svg>`;
      return { url: `data:image/svg+xml,${encodeURIComponent(svg)}` };
    }

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
${prioritario ? `  <circle cx="7" cy="3" r="5" fill="#7c3aed" stroke="#fff" stroke-width="1.2"/>
  <text x="7" y="5" text-anchor="middle" fill="#fff" font-family="Arial,sans-serif" font-size="6" font-weight="bold">P</text>` : ''}
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
        icon={buildIncidenteSvgIcon(colorPorPrioridad(prioridad).principal)}
        clickable={false}
      />

      {unidadesConUbicacion.map((u) => (
        <MarkerF
          key={u.id}
          position={{ lat: u.ultimaLat!, lng: u.ultimaLng! }}
          icon={buildUnidadSvgIcon(u)}
          onClick={u.ocupada ? undefined : () => onToggleUnidad(u.id)}
        />
      ))}
    </GoogleMap>
  );
}
