# Etapa 14 — `components/911/despacho/TablonDespacho.tsx` (núcleo)

No depende de otras etapas, pero es más fácil de verificar visualmente si la Etapa 13 (su wrapper) ya está migrada. Leer `00-contexto.md` primero.

## ⚠️ Cuidado especial

Es el componente más grande de todo el plan (503 líneas) y el corazón operativo del despacho: tablón con tabs (pendientes/en_despacho/atendidos), cards expandibles, cálculo de SLA por tiempo, y **polling cada 20 segundos** (`INTERVALO_MS`) que mantiene la vista actualizada en vivo mientras el despachador trabaja. Orquesta `DespachoForm` (Etapa 15) y `MapaSeguimientoOficial` (Etapa 16).

## Objetivo

Migrar la estructura visual completa: tabs, cards expandibles, badges de prioridad/canal, indicadores de SLA — sin tocar el polling ni el cálculo de tiempos.

## Archivo: `components/911/despacho/TablonDespacho.tsx`

- Tabs (pendientes/en_despacho/atendidos): aplicar `DESIGN.md §4` "SegmentPage" (pill, un acento) — hoy están en Barlow Condensed uppercase.
- Cards expandibles: `DESIGN.md §4` "Cards hub" si son pocas y expandibles con detalle (glass), o "Tablas — superficie plana" si el volumen es alto (reportar cuál criterio se usó y por qué).
- Colores tácticos por prioridad/canal: mapear a la paleta semántica de `DESIGN.md §2` (`success`/`warning`/`danger` según corresponda a la urgencia real, no inventar colores nuevos).
- Indicadores de SLA: el **cálculo** de SLA (tiempo transcurrido vs. umbral) no se toca — solo su presentación visual (badge/texto).

No tocar: `INTERVALO_MS` y el `useEffect` de polling, el cálculo de SLA, cualquier lógica que decida qué incidentes van en qué tab.

## Criterios de aceptación

1. `npx tsc --noEmit` sin errores.
2. **Prueba manual con datos reales o de prueba**: dejar la vista abierta al menos 25 segundos y confirmar que el polling sigue refrescando la lista (sin errores en consola); expandir una card, confirmar que el detalle se muestra correctamente; cambiar de tab.
3. Responsive en los 3 breakpoints — el despachador puede trabajar en tablet, verificar ese breakpoint con cuidado.

Detenerse aquí y esperar confirmación antes de pasar a Etapa 15.
