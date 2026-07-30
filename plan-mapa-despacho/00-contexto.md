# Contexto general — Mapa "tipo Uber" en Asignar Unidades

> Leer antes de empezar cualquier etapa. Este archivo no tiene tareas propias — es el trasfondo que explica el "por qué" detrás de las etapas 1-5.

## Problema

Repo: `seguridad_publica` (Next.js 16.2.4, React 19, TypeScript). Módulo de despacho 911.

Hoy, dentro de `TablonDespacho` → sección "Asignar unidades" (`components/911/despacho/DespachoForm.tsx` → `components/911/despacho/SeleccionarUnidadesModal.tsx`), el despachador elige patrullas de una lista con buscador de texto y tarjetas (`UnidadCard`). La cercanía se calcula con Haversine (línea recta) en el backend y se muestra como texto ("2.3 km", badge "Más cercana"), pero no hay ninguna representación espacial: no se ve dónde está el lugar del hecho ni dónde están las patrullas entre sí.

**Objetivo:** dar una vista tipo mapa (estilo Uber) que muestre el lugar del hecho, todas las patrullas, y resalte visualmente las cercanas — para que la decisión de a quién despachar sea más rápida e intuitiva.

## Estado actual del código (relevante para todas las etapas)

**Componentes de despacho** (`components/911/despacho/`):
- `TablonDespacho.tsx` — orquestador con tabs pendientes/en_despacho/atendidos, polling de 20s solo para "pendientes" (patrón de referencia para el polling de la Etapa 5, ver líneas ~134-141 para el cleanup del `setInterval`).
- `DespachoForm.tsx` — al expandir una tarjeta de incidente, hace `fetch('/api/despacho/unidades-cercanas?lat=..&lng=..&prioritarioPatrullaId=..')` UNA SOLA VEZ (sin polling), guarda `unidadesDisponibles: UnidadParaDespacho[]`, abre `SeleccionarUnidadesModal` con un botón. Ya tiene disponibles `incidenteLat`/`incidenteLng` como props propias.
- `SeleccionarUnidadesModal.tsx` — modal (`createPortal` a `document.body`, `maxWidth: 640`) con buscador por número/placa y lista scrolleable de `UnidadCard`. Selección múltiple con `toggle(u)` que opera sobre el objeto `UnidadParaDespacho` completo (no solo el id). `masCercanaId` ya se deriva ahí como `unidades.find(u => u.distanciaKm != null)?.id`.
- `UnidadCards.tsx` — exporta `UnidadCard`, `UnidadResumenCard`, `TripulacionList`, `UnidadCardSkeleton`, `UnidadCardsStyles`, y las funciones `formatDistancia(km)` y `formatAntiguedad(iso)` (esta última devuelve `{ texto, fresco: boolean }`, `fresco = true` si <5 min).

**Backend**:
- `app/api/despacho/unidades-cercanas/route.ts` — GET, requiere sesión, llama `listarUnidadesParaDespacho(lat, lng, prioritarioPatrullaId)`.
- `lib/flota/service.ts` — `listarUnidadesParaDespacho`: calcula `distanciaKm` con Haversine (`lib/shared/geo.ts::distanciaHaversineKm`), descarta unidades sin lat/lng, ordena ascendente por distancia, y **actualmente trunca a `TOP_UNIDADES_CERCANAS = 10`** (esto se ajusta en Etapa 2). La unidad "prioritaria" (oficial ya en sitio) se antepone sin aplicar el filtro/tope.

**Tipos** (`lib/flota/types.ts`):
```ts
export interface OficialTripulacion { id: string; nombre: string; noNomina: string | null }
export interface UnidadConTripulacion {
  id: string; numeroUnidad: string; placas: string
  oficiales: OficialTripulacion[]
  ultimaLat: number | null; ultimaLng: number | null; ultimaUbicacionEn: string | null
}
export interface UnidadParaDespacho extends UnidadConTripulacion { distanciaKm: number | null }
```

**Cómo se actualiza la posición de una unidad**: NO hay websockets. Heartbeat foreground: `components/oficial/OficialUbicacionTracker.tsx` usa `navigator.geolocation.watchPosition`, cada 30s llama server action que hace `UPDATE ofi_oficiales SET ultima_lat, ultima_lng, ultima_ubicacion_en=NOW()`. Solo corre mientras el oficial tiene su navegador/app abierta. **No tocar este archivo** — está fuera de alcance.

**Mapas ya usados en el proyecto** (Google Maps es el único proveedor, no hay Leaflet/Mapbox):
- `@react-google-maps/api` v2.20.8 ya instalado en `package.json`. Patrón idiomático de referencia: `components/maps/GoogleMapPicker.tsx` — usa `useJsApiLoader({ id: 'google-map-script', googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY })` + `<GoogleMap>` + `<MarkerF>`. **Este es el patrón a seguir.**
- También existe `lib/maps/loadGoogleMaps.ts`, un loader imperativo de bajo nivel usado por `components/oficial/MapaUbicacion.tsx`/`MapaPinFijo.tsx` con API imperativa `google.maps.Marker`. **NO usar este patrón** — no escala bien con una lista dinámica de marcadores.
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` ya configurada en `.env` con valor real. No hace falta gestionarla.

## Decisiones ya tomadas (no reabrir estas discusiones)

- **Layout**: split-view — mapa y lista conviven lado a lado dentro del modal (no un toggle que oculte uno u otro).
<!-- - **Alcance**: solo lo descrito en las etapas 1-5 de este plan (mapa visual + polling ligero). Fuera de alcance: Distance Matrix/Directions API (se mantiene Haversine), WebSockets/SSE, cambios al heartbeat del oficial. -->
- **Librería de mapas**: `@react-google-maps/api`, siguiendo el patrón de `GoogleMapPicker.tsx`. No introducir ninguna librería nueva (nada de `react-leaflet`, `mapbox-gl`, etc.).

## Convenciones del proyecto a respetar

- TypeScript estricto, componentes cliente marcados `'use client'`.
- Estilos inline con objetos `React.CSSProperties` (no CSS-in-JS de terceros, no Tailwind en estos componentes) — seguir el mismo estilo que ya usan `UnidadCards.tsx`/`SeleccionarUnidadesModal.tsx` (paleta: azul institucional `#1f355a`, verde éxito `#16a34a`, grises `#94a3b8`/`#e2e8f0`, fuente `Inter` para texto, `Barlow Condensed` para números/títulos, `JetBrains Mono` para badges/etiquetas técnicas).
- Al final de cada etapa, correr `npx tsc --noEmit` como mínimo.
