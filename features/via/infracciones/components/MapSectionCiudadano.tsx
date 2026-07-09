'use client';

import { useCallback, useRef, useState } from 'react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { Map as MapIcon, Satellite } from 'lucide-react';

const containerStyle = { width: '100%', height: '100%', borderRadius: '12px' };

interface Props {
  lat: number;
  lng: number;
}

export default function MapSectionCiudadano({ lat, lng }: Props) {
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? '',
    libraries: ['places'],
  });

  const mapRef = useRef<google.maps.Map | null>(null);
  const [modo, setModo] = useState<'mapa' | 'satelite'>('mapa');
  const svRef = useRef<google.maps.StreetViewPanorama | null>(null);
  const [svDisponible, setSvDisponible] = useState(true);

  const pos = { lat, lng };

  const onLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
    const sv = map.getStreetView();
    svRef.current = sv;
    sv.addListener('status_changed', () => {
      setSvDisponible(sv.getStatus() !== 'ZERO_RESULTS');
    });
  }, []);

  const toggleStreetView = () => {
    const sv = svRef.current;
    if (!sv) return;
    if (sv.getVisible()) {
      sv.setVisible(false);
    } else {
      sv.setPosition(pos);
      sv.setVisible(true);
    }
  };

  if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
    return <p className="text-xs text-red-600">Falta configurar Google Maps API Key</p>;
  }

  if (loadError) {
    return <p className="text-xs text-red-600">No se pudo cargar el mapa</p>;
  }

  if (!isLoaded) {
    return <div className="w-full h-64 rounded-xl bg-slate-100 animate-pulse flex items-center justify-center">
      <span className="text-xs text-slate-400">Cargando mapa…</span>
    </div>;
  }

  return (
    <div className="relative w-full h-64 rounded-xl overflow-hidden border border-slate-200">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={pos}
        zoom={16}
        onLoad={onLoad}
        options={{
          fullscreenControl: false,
          mapTypeControl: false,
          streetViewControl: false,
          zoomControl: true,
          mapTypeId: modo === 'satelite' ? 'satellite' : 'roadmap',
        }}
      >
        <Marker position={pos} />
      </GoogleMap>

      <div className="absolute top-3 left-3 z-10 inline-flex bg-white/90 backdrop-blur-sm rounded-lg shadow-sm border border-slate-200 overflow-hidden text-[11px] font-medium">
        <button
          type="button"
          onClick={() => setModo('mapa')}
          className={`inline-flex items-center gap-1 px-3 py-1.5 transition-all ${modo === 'mapa' ? 'bg-blue-700 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
        >
          <MapIcon size={13} /> Mapa
        </button>
        <button
          type="button"
          onClick={() => setModo('satelite')}
          className={`inline-flex items-center gap-1 px-3 py-1.5 transition-all ${modo === 'satelite' ? 'bg-blue-700 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
        >
          <Satellite size={13} /> Satélite
        </button>
      </div>

      <button
        type="button"
        onClick={toggleStreetView}
        disabled={!svDisponible}
        className="absolute top-3 right-3 z-10 px-3 py-1.5 text-[11px] font-medium bg-white/90 backdrop-blur-sm rounded-lg shadow-sm border border-slate-200 text-slate-700 hover:bg-slate-50 transition-all disabled:opacity-50"
      >
        Street View
      </button>
    </div>
  );
}
