# Etapa 4 — Detalle de despacho: `[id]/page.tsx` + `DespachoContent` + `AsignacionCard` + `NavegacionModal`

No depende de otras etapas. Leer `00-contexto.md` primero. **No incluye `NavegacionDespacho.tsx`** (ese es el contenido real del modal — va en la Etapa 5, separado por su complejidad GPS).

## Objetivo

Migrar la página de detalle de un despacho asignado y los componentes que orquestan la transición a "modo navegación", sin tocar `NavegacionDespacho.tsx` en sí (solo su wrapper modal).

## Archivos

- `app/oficial/despachos/[id]/page.tsx` — header/footer inline tácticos → Apple. Server component, delega el grueso a `DespachoContent`.
- `components/oficial/DespachoContent.tsx` — orquestador cliente sin estilos propios significativos (layout flex mínimo); revisar que el layout siga funcionando tras migrar sus hijos, no necesita restyle propio salvo ajustes de spacing si aplica.
- `components/oficial/navegacion/AsignacionCard.tsx` — card de folio/dirección/prioridad: aplicar `DESIGN.md §4` "Cards hub" o superficie plana según corresponda (es una card única, no una lista — usar glass). El badge de prioridad usa `colorPorPrioridad` (lógica existente) — **no tocar esa función**, solo el contenedor visual del badge (pill, `var(--radius-full)`).
- `components/oficial/navegacion/NavegacionModal.tsx` — es un wrapper de portal (`createPortal`) + overlay fullscreen. Solo migrar el overlay (fondo, posible blur) — el contenido real es `NavegacionDespacho`, que se migra en la Etapa 5.

No tocar: `createPortal`, gestión de `body.overflow`, la lógica de `colorPorPrioridad`.

## Criterios de aceptación

1. `npx tsc --noEmit` sin errores.
2. Verificación manual: abrir un despacho asignado, ver la `AsignacionCard`, abrir el modal de navegación (aunque su contenido interno siga en el look táctico hasta la Etapa 5 — el overlay/wrapper ya debe verse Apple-style).
3. Responsive en los 3 breakpoints.

Detenerse aquí y esperar confirmación antes de pasar a Etapa 5.
