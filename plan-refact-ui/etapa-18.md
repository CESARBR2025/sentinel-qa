# Etapa 18 — `components/911/ModuleCard.tsx`

No depende de otras etapas. Cierra el plan. Leer `00-contexto.md` primero.

## Objetivo

Migrar la card de navegación genérica del patrón "co-top/co-left" táctico (barras decorativas que crecen al hover) — mismo tipo de componente que `.card-o` de `DESIGN.md §4`, pero con su propia implementación local en este módulo.

## Archivo: `components/911/ModuleCard.tsx`

Aplicar `DESIGN.md §4` "Cards hub — `.card-o`": superficie glass, radio `var(--radius-xl)`, hover `translateY(-2px)` + `var(--apple-shadow-glass-hover)` en vez de las barras `co-top`/`co-left` que crecen. Badge "SISTEMA ACTIVO" con punto de color → mismo patrón "En línea" ya usado en `app/dashboard/module-cards.tsx` (referencia directa).

No tocar: el manejo de `hover` vía `useState` (puede quedarse igual, solo cambian los valores de estilo que produce), ningún prop del componente.

## Criterios de aceptación

1. `npx tsc --noEmit` sin errores.
2. `npm run build` sin errores — verificación final de todo el plan.
3. Verificación manual: donde sea que se use `ModuleCard`, confirmar que se ve y navega igual que antes.
4. **Esta es la última etapa del plan** — al terminar, correr el checklist general completo de `README.md` (build, verificación de los 3 flujos críticos, sanity check, ADR, actualizar `DESIGN.md §10`).
