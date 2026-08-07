# Etapa 12 — Hubs: `app/agente_911/page.tsx` + `app/agente_despacho/page.tsx`

No depende de otras etapas. Primera etapa del módulo Despacho/911. Leer `00-contexto.md` primero.

## Objetivo

Migrar los dos hubs de navegación (Panel 911, Panel Despacho) — según la investigación, **son casi idénticos entre sí** (mismo patrón `.card-911`, mismo `StatBloque` interno en el segundo). Migrar ambos en la misma etapa aprovechando esa similitud, pero **sin extraer un componente compartido** — eso sería una refactorización estructural fuera del alcance de esta migración visual, solo se documenta como oportunidad futura si se quiere.

## Archivos

- `app/agente_911/page.tsx` — hub "Panel 911", 100% inline, Barlow Condensed/JetBrains Mono/`#1f355a`. Migrar a `DESIGN.md §4` "Cards hub" (glass, igual que `app/dashboard/module-cards.tsx` y `app/oficial/page.tsx` de la Etapa 2 — usar esos dos como referencia directa de cómo quedó el mismo patrón).
- `app/agente_despacho/page.tsx` — hub "Panel Despacho", mismo patrón + `StatBloque` interno (bloques de KPI resumen del día). Migrar igual que el anterior; los `StatBloque` de números grandes siguen el patrón de "Contadores" ya usado en `app/dashboard/module-cards.tsx` (número grande + label pequeño debajo).

No tocar: ninguna lógica (ambos son hubs de navegación + KPI de solo lectura, sin fetch complejo más allá de traer los números del resumen).

## Criterios de aceptación

1. `npx tsc --noEmit` sin errores.
2. Verificación manual: todos los links de ambos hubs navegan a los mismos destinos, los números de KPI se siguen mostrando correctamente.
3. Responsive en los 3 breakpoints.

Detenerse aquí y esperar confirmación antes de pasar a Etapa 13.
