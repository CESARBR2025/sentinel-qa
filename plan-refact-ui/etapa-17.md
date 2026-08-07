# Etapa 17 — `Bitacora911.tsx` + `FiltrosIncidentes.tsx` + `Pagination.tsx`

No depende de otras etapas. Leer `00-contexto.md` primero.

## Objetivo

Migrar la bitácora paginada de incidentes, su barra de filtros, y el componente de paginación reutilizable (usado también en otras partes del sistema, aunque aquí solo se toca su definición si vive en este módulo — verificar si `Pagination.tsx` es compartido más ampliamente antes de asumir que solo lo usa Bitácora).

## Archivos

- `components/911/Bitacora911.tsx` — tabla/bitácora con tabs por estatus y **polling cada 20s**. Aplicar `DESIGN.md §4` "SegmentPage" a los tabs y "Tablas — superficie plana" al cuerpo de la tabla (headers en `var(--apple-font-display)` 600 sentence-case, no JetBrains Mono). Badges de estatus → paleta semántica de `DESIGN.md §2`. No tocar el polling.
- `components/911/FiltrosIncidentes.tsx` — barra de filtros (folio, canal, estatus, tipo, prioridad, fechas) sincronizada con `useSearchParams`/`router.push`. Migrar constantes de estilo (`wrapperStyle`, `fieldStyle`, etc.) a `DESIGN.md §4` FormKit — labels de `var(--apple-font-display)` 500 sentence-case en vez de JetBrains Mono uppercase, radios `var(--radius-lg)`. No tocar la sincronización con la URL.
- `components/911/Pagination.tsx` — ya mezcla inline + clases CSS (`.pg-btn`, `.pg-btn-active`) — coincide casi exactamente con `DESIGN.md §4` "Paginación (`.pg-*`)", que ya está especificado ahí (radio `var(--radius-md)`, activo con acento). Aplicar esa sección directamente.

No tocar: ninguna lógica de paginación, filtrado o polling.

## Criterios de aceptación

1. `npx tsc --noEmit` sin errores.
2. Verificación manual: aplicar varios filtros combinados, cambiar de página, cambiar de tab en la bitácora — todo debe seguir funcionando igual, con la vista refrescándose vía polling.
3. Responsive en los 3 breakpoints.

Detenerse aquí y esperar confirmación antes de pasar a Etapa 18.
