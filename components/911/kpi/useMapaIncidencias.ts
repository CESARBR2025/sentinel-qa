'use client'

import { useJsApiLoader } from '@react-google-maps/api'
import { GOOGLE_MAPS_LOADER_ID, GOOGLE_MAPS_API_KEY, GOOGLE_MAPS_LIBRARIES } from '@/lib/maps/googleMapsConfig'

export const MAPS_API_KEY = GOOGLE_MAPS_API_KEY

export const CENTRO_SJR = { lat: 20.3889, lng: -99.9895 }

export function useMapaIncidencias() {
  return useJsApiLoader({
    id: GOOGLE_MAPS_LOADER_ID,
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: GOOGLE_MAPS_LIBRARIES,
  })
}

// Basemap atenuado, compartido por el mapa de puntos y el de calor: sin el
// ruido de POIs comerciales y con el terreno desaturado, para que lo único
// saturado en pantalla sean los datos de incidencias. Al ser el mismo estilo en
// ambas vistas, el panel no cambia de aspecto al alternar Puntos/Calor.
export const ESTILOS_MAPA: google.maps.MapTypeStyle[] = [
  { elementType: 'geometry', stylers: [{ color: '#eef2f6' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#64748b' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#ffffff' }, { weight: 2 }] },
  { elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
  { featureType: 'administrative', elementType: 'geometry.stroke', stylers: [{ color: '#cbd5e1' }] },
  { featureType: 'administrative.land_parcel', stylers: [{ visibility: 'off' }] },
  { featureType: 'landscape.natural', elementType: 'geometry', stylers: [{ color: '#e6ece9' }] },
  { featureType: 'poi', stylers: [{ visibility: 'off' }] },
  { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#dfeade' }, { visibility: 'on' }] },
  { featureType: 'road', elementType: 'geometry.fill', stylers: [{ color: '#ffffff' }] },
  { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#e2e8f0' }] },
  { featureType: 'road.arterial', elementType: 'geometry.fill', stylers: [{ color: '#fbfcfd' }] },
  { featureType: 'road.highway', elementType: 'geometry.fill', stylers: [{ color: '#fde9d3' }] },
  { featureType: 'road.highway', elementType: 'geometry.stroke', stylers: [{ color: '#f5cfa6' }] },
  { featureType: 'road.local', elementType: 'labels', stylers: [{ visibility: 'off' }] },
  { featureType: 'transit', stylers: [{ visibility: 'off' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#cfe0ef' }] },
  { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#8aa7bf' }] },
]

export function colorPrioridad(orden: number | null): string {
  switch (orden) {
    case 4:  return '#dc2626'
    case 3:  return '#ea580c'
    case 2:  return '#ca8a04'
    case 1:  return '#0284c7'
    default: return '#64748b'
  }
}
