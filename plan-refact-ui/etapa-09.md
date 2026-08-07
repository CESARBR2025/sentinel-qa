# Etapa 9 — Rondín: `rondin/page.tsx` + `RondinPageClient.tsx` + `RondinTabla.tsx`

No depende de otras etapas. Leer `00-contexto.md` primero.

## Objetivo

Migrar el flujo completo de Rondín: la página server wrapper, la vista cliente (lista + formulario de nuevo avistamiento), y la tabla de rondines enviados.

## Archivos

- `app/oficial/rondin/page.tsx` — server wrapper, sin JSX propio salvo `ToastExito` (que se migra en la Etapa 11 — aquí solo verificar que siga funcionando con su nuevo estilo).
- `components/oficial/rondin/RondinPageClient.tsx` — usa helpers locales (`Seccion`, `Campo`, `inputStyle`) que replican el patrón táctico — migrar esos helpers, un único punto de apalancamiento para todo el formulario de avistamiento. **Importante**: el "segmented control" de esta vista (línea ~313-336 según la investigación) está hardcodeado inline, ni siquiera usa `SegmentControl`/`SegmentPage` — aplicar el mismo estilo pill de `DESIGN.md §4` directamente aquí (no hace falta extraer un componente, solo igualar el resultado visual). **No tocar**: `useRondinFormStore` (Zustand), `GoogleMapPicker`, `navigator.geolocation.getCurrentPosition`, geocoding inverso.
- `components/oficial/rondin/RondinTabla.tsx` — tabla de rondines con badges de estatus, 100% inline con hover manual (`onMouseEnter/Leave`). Aplicar `DESIGN.md §4` "Tablas — superficie plana" — el hover puede pasar a CSS `:hover` si se introduce una clase, o mantenerse manual si el patrón lo requiere (reportar cuál se usó).

## Criterios de aceptación

1. `npx tsc --noEmit` sin errores.
2. Verificación manual: completar un rondín nuevo de principio a fin (incluyendo selección de ubicación en el mapa), confirmar que aparece en la tabla con el estatus correcto.
3. Responsive en los 3 breakpoints.

Detenerse aquí y esperar confirmación antes de pasar a Etapa 10.
