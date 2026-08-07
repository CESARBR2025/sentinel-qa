# Etapa 16 — `AsignacionMapa.tsx` + `MapaSeguimientoOficial.tsx` + `SeleccionarUnidadesModal.tsx`

No depende de otras etapas. Leer `00-contexto.md` primero.

## ⚠️ Cuidado especial

`AsignacionMapa.tsx` y `MapaSeguimientoOficial.tsx` tienen lógica de negocio real sensible: Google Maps (`@react-google-maps/api`), marcadores SVG generados dinámicamente (`buildUnidadSvgIcon`/`buildOficialSvgIcon`), `fitBounds`, y en el caso de seguimiento, cálculo de "frescura" de la ubicación reportada. **No tocar esas funciones bajo ninguna circunstancia** — el restyle se limita a contenedores, estados de carga/error, y cualquier leyenda/badge de texto alrededor del mapa.

## Objetivo

Migrar el chrome visual de los dos mapas de despacho y el modal de selección de unidades que embebe `AsignacionMapa`.

## Archivos

- `components/911/despacho/AsignacionMapa.tsx` — mapa para elegir unidades por proximidad. Migrar contenedores/loading/error (`DESIGN.md §3`/§6). No tocar `fitBounds`, el cálculo de "más cercana", ni `buildUnidadSvgIcon`.
- `components/911/despacho/MapaSeguimientoOficial.tsx` — mapa de seguimiento en vivo. Mismo criterio: solo chrome. No tocar la lógica de `fresco` (frescura de ubicación) ni `buildOficialSvgIcon`.
- `components/911/despacho/SeleccionarUnidadesModal.tsx` — modal (portal) con **polling de 18s**, embebe `AsignacionMapa`. Migrar el overlay/header (Barlow Condensed hoy) a glass modal (`DESIGN.md §6`), inputs de búsqueda a FormKit. **No tocar**: `createPortal`, el lock de scroll body/html, el polling, `useResponsive` (el layout responsive del modal ya usa ese hook, no reimplementarlo).

No tocar: ningún cálculo de distancia/proximidad, ninguna llamada a las APIs de despacho.

## Criterios de aceptación

1. `npx tsc --noEmit` sin errores.
2. **Prueba manual obligatoria**: abrir el modal de selección de unidades, confirmar que el mapa `AsignacionMapa` muestra las unidades correctamente con sus marcadores, seleccionar una unidad, confirmar la asignación; abrir una vista con `MapaSeguimientoOficial` y confirmar que la posición se sigue actualizando.
3. Responsive en los 3 breakpoints — atención especial al modal en móvil/tablet (usa `useResponsive` para su layout).

Detenerse aquí y esperar confirmación antes de pasar a Etapa 17.
