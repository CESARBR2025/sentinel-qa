# Etapa 1 — `SegmentControl.tsx` (tabs de despachos)

No depende de ninguna otra etapa, pero la Etapa 3 depende de esta (usa este componente). Leer `00-contexto.md` primero, especialmente la sección sobre `SegmentControl` vs `SegmentPage`.

## Objetivo

Restylear `components/oficial/SegmentControl.tsx` para que se vea como la pill de `SegmentPage` (`DESIGN.md §4`), **sin tocar su lógica de navegación** (sigue manipulando `URLSearchParams`/`router.push`, no se convierte en `SegmentPage`). Es el único archivo de esta etapa.

## Archivo: `components/oficial/SegmentControl.tsx`

Aplicar `DESIGN.md §4` "SegmentPage — segmentos/tabs de estado": contenedor pill con gap 6, botones `var(--apple-font-display)` 600 14px sentence-case, radio `var(--radius-full)`, activo `background: accent; color: #fff`, inactivo `background: #f1f5f9; color: #64748b`. Usar el acento por defecto del módulo Oficial (`#1f355a`, no hay acento propio documentado para Oficial en `DESIGN.md §2` — usar el default).

No tocar: los `useRouter`/`useSearchParams`, la función que arma la URL con el nuevo valor de query param, ni las props del componente (mismo API hacia `app/oficial/despachos/page.tsx`).

## Criterios de aceptación

1. `npx tsc --noEmit` sin errores.
2. El componente exporta exactamente la misma interfaz de props que antes (no cambia la firma).
3. Verificación manual: cambiar de tab en `/oficial/despachos` sigue actualizando la URL y filtrando la lista igual que antes — solo cambia el aspecto visual (de tabs con borde a pills).
4. Responsive: el contenedor sigue funcionando en los 3 breakpoints de `DESIGN.md §8`.

Detenerse aquí y esperar confirmación antes de pasar a Etapa 2.
