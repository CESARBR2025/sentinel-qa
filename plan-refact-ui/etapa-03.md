# Etapa 3 — `app/oficial/despachos/page.tsx` (lista + tabs)

Depende de la Etapa 1 (`SegmentControl` ya restyleado). Leer `00-contexto.md` primero.

## Objetivo

Migrar la lista de despachos activos/atendidos: badges, cards de la lista, y el uso de `SegmentControl` (que ya trae su nuevo look de la Etapa 1, aquí solo se verifica que encaje).

## Archivo: `app/oficial/despachos/page.tsx`

- Badges de estado (pendiente/en curso/atendido): usar la pareja `bg`+color semántico de `DESIGN.md §2` ("Roles de badge"), no colores tácticos sueltos.
- Cards de la lista: aplicar el mismo tratamiento que `.card-o` (`DESIGN.md §4`) si son cards de navegación, o el patrón de superficie plana (`DESIGN.md §4` "Tablas — superficie plana") si son filas de lista densa — usar criterio según cuál se vea más parecido a lo que hay hoy (si son pocas cards grandes → glass; si es una lista densa de muchos ítems → plana). Reportar cuál se usó.
- Quitar el `<style>` con `@import` de Google Fonts si ya no se usa ninguna familia táctica.
- `PageHeader`/`PageHeaderLink`/`DashboardHeader` ya son compartidos — no reimplementar, aplicar `variant="apple"` a `DashboardHeader`.

No tocar: el fetch de datos server-side, la lógica de filtrado por tab (eso vive en `SegmentControl`, ya migrado).

## Criterios de aceptación

1. `npx tsc --noEmit` sin errores.
2. Verificación manual: los 3 tabs (o los que existan) siguen filtrando correctamente la lista.
3. Responsive en los 3 breakpoints — cuidado particular con listas largas en móvil.

Detenerse aquí y esperar confirmación antes de pasar a Etapa 4.
