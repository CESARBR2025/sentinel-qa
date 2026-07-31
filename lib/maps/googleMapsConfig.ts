import type { Libraries } from '@react-google-maps/api'

// useJsApiLoader/useLoadScript comparten un loader singleton por `id`.
// Si dos componentes montan con el mismo id pero distinto `libraries`,
// el segundo monta con error "Loader must not be called again with
// different options". Por eso TODO el proyecto debe usar este mismo
// id + array de libraries (misma referencia, nunca uno nuevo por archivo).
export const GOOGLE_MAPS_LOADER_ID = 'google-map-script'

export const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? ''

export const GOOGLE_MAPS_LIBRARIES: Libraries = ['places', 'visualization', 'geometry']

// Map ID vectorial (Google Cloud Console → Map Management → Create Map ID,
// estilo "Vector"). Habilita tilt/heading/edificios 3D en el modo navegación
// de NavegacionDespacho.tsx. Sin esta variable, tilt/heading se ignoran en
// silencio (comportamiento normal de un mapa raster) — el componente avisa
// al usuario si intenta activar el modo navegación sin Map ID configurado.
export const GOOGLE_MAPS_MAP_ID = process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID ?? ''
