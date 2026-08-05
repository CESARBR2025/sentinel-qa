# Etapa 7 — Eliminar el patrón `COALESCE(incidente_id)`

Leer primero `00-contexto.md` de esta misma carpeta.

## Objetivo

`lib/fiscalia/repository.ts:637` usa `COALESCE(rd.incidente_id, rc.incidente_id)` como fallback. Verificado en código real que ya no hace falta: `lib/d1/repository.ts:44-51` (`insertarReporteDenuncia`) **ya hereda** `incidente_id` de `ofi_reportes_campo` en el momento del insert cuando el D1 viene de un reporte de campo (`if (!params.incidenteId && params.reporteCampoId) { ... params.incidenteId = rc.rows[0]?.incidente_id ... }`). Esto significa que `rd.incidente_id` y `rc.incidente_id` ya están sincronizados al momento de leer — el `COALESCE` es redundante en ambos casos posibles:
- Si el D1 viene de un reporte de campo: `rd.incidente_id` ya fue heredado de `rc.incidente_id` en el insert.
- Si el D1 no tiene reporte de campo asociado: `rc` es `NULL` (por el `LEFT JOIN`), así que `rc.incidente_id` también es `NULL` y el `COALESCE` no aporta nada.

## Archivos

- Modify: `lib/fiscalia/repository.ts` (línea 637, única ocurrencia de este patrón en el repo — verificado con `grep -rn "COALESCE.*incidente_id" lib app`)

## Cambio

```sql
-- ANTES
LEFT JOIN incidentes i ON i.id = COALESCE(rd.incidente_id, rc.incidente_id)

-- DESPUÉS
LEFT JOIN incidentes i ON i.id = rd.incidente_id
```

## Criterios de aceptación

1. `grep -rn "COALESCE.*incidente_id" lib app` no devuelve resultados.
2. `npx tsc --noEmit` y `npm run build` sin errores.
3. Verificación funcional: la pantalla de detalle de solicitud en Fiscalía (`app/fiscalia/solicitudes/[solicitudId]/page.tsx`, que usa esta query) sigue mostrando el mismo incidente asociado que antes del cambio, para los D1 existentes en desarrollo (creados con y sin reporte de campo, si hay ambos casos).
4. No modificar otros archivos.

**Detenerse aquí y esperar confirmación del usuario antes de pasar a `etapa-8.md`.**
