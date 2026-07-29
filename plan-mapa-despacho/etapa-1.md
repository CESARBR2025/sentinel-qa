# Etapa 1 — Componente de mapa base (sin integrar aún)

> Repo: `seguridad_publica` (Next.js 16.2.4, React 19, TypeScript). Parte 1 de 5 del plan "Mapa tipo Uber en Asignar Unidades". Ver `00-contexto.md` en esta misma carpeta para trasfondo completo si algo aquí no queda claro.

## Objetivo

Crear el componente de mapa como pieza aislada, renderizando el marcador del lugar del hecho (incidente) y un marcador por cada unidad/patrulla, **sin estilos diferenciados todavía** y **sin tocar ningún componente existente**. El propósito de esta etapa es verificar que el mapa carga y pinta correctamente antes de tocar la UI que ya está en producción (`SeleccionarUnidadesModal.tsx`).

## Archivos

- **Crear (único archivo a tocar):** `components/911/despacho/AsignacionMapa.tsx`

No modificar ningún otro archivo en esta etapa.

## Contexto técnico necesario

- El proyecto ya tiene `@react-google-maps/api` v2.20.8 instalado y `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` configurada en `.env`. No hay que instalar nada ni gestionar la key.
- Patrón de referencia a replicar (léelo antes de escribir código): `components/maps/GoogleMapPicker.tsx`. Usa:
  ```ts
  import { GoogleMap, useJsApiLoader, MarkerF } from '@react-google-maps/api';
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });
  ```
- Tipo de las unidades, desde `@/lib/flota/types`:
  ```ts
  export interface UnidadConTripulacion {
    id: string; numeroUnidad: string; placas: string
    oficiales: OficialTripulacion[]
    ultimaLat: number | null; ultimaLng: number | null; ultimaUbicacionEn: string | null
  }
  export interface UnidadParaDespacho extends UnidadConTripulacion { distanciaKm: number | null }
  ```

## Instrucciones

1. Componente cliente: primera línea `'use client'`.
2. Firma de props:
   ```ts
   interface AsignacionMapaProps {
     unidades: UnidadParaDespacho[]
     incidenteLat: number | null
     incidenteLng: number | null
     seleccionadas: string[] // ids de UnidadParaDespacho
     onToggleUnidad: (id: string) => void
   }
   ```
3. Usar `useJsApiLoader` igual que `GoogleMapPicker.tsx` (mismo `id: 'google-map-script'` para reutilizar cache de carga del script si conviven en la misma página).
4. Si `incidenteLat` o `incidenteLng` son `null`, el componente puede simplemente no renderizar nada útil (devolver `null` o un placeholder) — quien lo use decide si lo monta o no (eso se resuelve en la Etapa 3, aquí no hace falta lógica especial más allá de no crashear).
5. Renderizar `<GoogleMap>` centrado inicialmente en `{ lat: incidenteLat, lng: incidenteLng }`, zoom razonable (ej. 14).
6. Un `MarkerF` para el incidente, con un ícono visualmente distinto al de las unidades (ej. color rojo). No debe ser clickeable/arrastrable.
7. Un `MarkerF` por cada unidad de `unidades` que tenga `ultimaLat` y `ultimaLng` no nulos (filtrar las que no tienen ubicación — no intentar plotearlas). Todas iguales visualmente en esta etapa (la diferenciación por cercanía/selección es la Etapa 4).
8. Cada `MarkerF` de unidad debe tener `onClick={() => onToggleUnidad(u.id)}`.
9. Al cargar el mapa (`onLoad` del `GoogleMap`, o un `useEffect` cuando `isLoaded` es true y hay datos), usar `google.maps.LatLngBounds` + `map.fitBounds(bounds)` incluyendo el incidente y todas las unidades ploteadas, para que el zoom inicial encuadre todo automáticamente (como hace un mapa tipo Uber al abrir).
10. Manejar `loadError` con un mensaje simple (mismo patrón que `GoogleMapPicker.tsx`: mensaje de "cuota excedida" si falla la carga).
11. Mientras `!isLoaded`, mostrar un placeholder simple tipo "Cargando mapa..." (mismo patrón que `GoogleMapPicker.tsx`).
12. Altura del contenedor: usa un alto fijo razonable por ahora (ej. `500px` o `100%` si el padre define altura) — se ajustará si hace falta en la Etapa 3 al integrarlo al layout del modal.

## Qué NO hacer en esta etapa

- No tocar `SeleccionarUnidadesModal.tsx`, `DespachoForm.tsx`, `UnidadCards.tsx` ni ningún archivo de backend.
- No implementar diferenciación visual por cercanía/selección/antigüedad (Etapa 4).
- No implementar polling (Etapa 5).
- No crear imágenes nuevas en `/public` — si necesitas íconos personalizados, usa SVG inline o data-URI.

## Criterios de aceptación (verificar antes de pasar a Etapa 2)

1. `npx tsc --noEmit` corre sin errores nuevos.
2. El componente se puede montar de forma aislada (por ejemplo, agregándolo temporalmente a cualquier página cliente existente, o creando una página de prueba temporal que luego se descarta) pasándole datos hardcodeados: un incidente con lat/lng real de San Juan del Río, Querétaro (ej. `{ lat: 20.3889, lng: -99.9895 }`) y 3-5 unidades con coordenadas cercanas variadas.
3. Al montarlo, el mapa carga, se centra, y se ven todos los marcadores (1 de incidente + N de unidades) dentro del viewport gracias a `fitBounds`.
4. Click en un marcador de unidad dispara `onToggleUnidad` con el `id` correcto — verificable con un `console.log(id)` temporal dentro del callback de prueba (no dejar el `console.log` en el componente final).
5. No se tocó ningún archivo fuera de `components/911/despacho/AsignacionMapa.tsx`.
6. Si usaste una página de prueba temporal para verificar, elimínala antes de dar la etapa por terminada (no debe quedar código de prueba en el repo).

Cuando estos criterios pasen, detente y espera confirmación antes de continuar con `etapa-2.md`.
