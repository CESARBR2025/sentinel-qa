# Etapa 7 — `MapaUbicacion.tsx` + `MapaPinFijo.tsx` + `ModalSeleccionarUnidad.tsx`

No depende de otras etapas. Leer `00-contexto.md` primero.

## Objetivo

Migrar el chrome visual de los dos componentes de mapa (sin tocar su lógica de Google Maps/GPS) y el modal de selección de unidad.

## Archivos

- `components/oficial/MapaUbicacion.tsx` — selector de ubicación interactivo (click/drag/geolocalización + geocoding inverso). Migrar la clase `.of-map-btn` y los estados de carga/error a `DESIGN.md §3`/§6. **No tocar**: la integración con Google Maps, el `Geocoder`, `navigator.geolocation`.
- `components/oficial/MapaPinFijo.tsx` — mapa de solo lectura con pin fijo. Solo tiene estados de carga/error con inline styles simples — migrar esos, el marcador estático no se toca.
- `components/oficial/ModalSeleccionarUnidad.tsx` — modal (overlay + búsqueda + lista seleccionable, ~320 líneas 100% inline). Aplicar `DESIGN.md §4`/§6: overlay con blur si corresponde a un modal glass, radio `var(--radius-xl)`, inputs de búsqueda per `DESIGN.md §4` FormKit. **No tocar**: la server action `asignarPatrulla`, la lógica de búsqueda/filtrado de la lista.

## Criterios de aceptación

1. `npx tsc --noEmit` sin errores.
2. Verificación manual: seleccionar una ubicación en el mapa interactivo (click, drag, botón de geolocalización) sigue funcionando igual; abrir el modal de selección de unidad, buscar y asignar una patrulla sigue funcionando igual.
3. Responsive en los 3 breakpoints, con atención especial al modal en móvil (`maxWidth: 90vw` / `maxHeight: 90vh` + scroll, por `DESIGN.md §7`).

Detenerse aquí y esperar confirmación antes de pasar a Etapa 8.
