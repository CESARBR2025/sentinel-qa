# Etapa 13 — Wrappers livianos: `agente_911/despacho/page.tsx` + `agente_despacho/kpi-incidencias/page.tsx`

No depende de otras etapas. Leer `00-contexto.md` primero.

## Objetivo

Migrar los dos wrappers server-side más livianos del módulo — ya usan `PageHeader`/`PageHeaderLink`, el diff es pequeño.

## Archivos

- `app/agente_911/despacho/page.tsx` — wrapper del tablón de despacho (contenido real en `TablonDespacho.tsx`, Etapa 14). Migrar el `style={{}}` del wrapper raíz y quitar el `<style>` con `@import` de Barlow Condensed + `@keyframes spin` si ese spinner se reemplaza por uno del lenguaje Apple (o mantener el keyframe si sigue usándose para un loading spinner neutro — reportar cuál).
- `app/agente_despacho/kpi-incidencias/page.tsx` — wrapper de la vista KPI (mapa de calor/puntos). Migrar solo el wrapper — `KpiIncidenciasView` (el contenido real con mapas) **está fuera de alcance de este plan** (ver `README.md` "Fuera de alcance"), no tocarlo.

No tocar: `DashboardFooter`, la lógica de auth/redirect de ambas páginas, `KpiIncidenciasView`.

## Criterios de aceptación

1. `npx tsc --noEmit` sin errores.
2. Verificación manual: ambas páginas cargan correctamente y su contenido interno (aún no migrado en el caso de `TablonDespacho`/`KpiIncidenciasView`) se sigue viendo sin roturas de layout.
3. Responsive en los 3 breakpoints.

Detenerse aquí y esperar confirmación antes de pasar a Etapa 14.
