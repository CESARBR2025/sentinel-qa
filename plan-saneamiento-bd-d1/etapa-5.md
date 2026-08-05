# Etapa 5 — Romper FK circular IPH ↔ Fichas de Inteligencia + fix join por folio

Leer primero `00-contexto.md` de esta misma carpeta.

## Objetivo

`ofi_fichas_inteligencia.iph_id → iph_detenidos.id` (constraint `fk_ficha_iph`) e `iph_detenidos.ficha_inteligencia_id → ofi_fichas_inteligencia.id` (constraint `fk_iph_vinculo_inteligencia`) se referencian mutuamente — confirmado en BD real. Se deja una sola dirección: `ofi_fichas_inteligencia.iph_id → iph_detenidos`. Además, `lib/monitorista/repository.ts` resuelve el D1 asociado a un IPH por `folio_denuncia = iph.folio_911` (join frágil por texto) cuando `iph_detenidos` ya tiene la columna `reporte_denuncia_id` con FK real a `ofi_reporte_denuncia(id)` (constraint `fk_iph_denuncia`, ya existe, no hay que crearla).

## Archivos

- Create: `lib/db/manual-migrations/0034_iph_romper_circular.sql`
- Modify: `lib/monitorista/repository.ts` (función `obtenerPrellenadoCompleto`, línea ~277)

## Migración

```sql
ALTER TABLE iph_detenidos DROP CONSTRAINT IF EXISTS fk_iph_vinculo_inteligencia;
```

No hace falta recrear `fk_ficha_iph` (`ofi_fichas_inteligencia.iph_id → iph_detenidos.id`) — ya existe y es la dirección que se conserva. Solo se elimina el lado inverso.

**Antes de aplicar**: confirmar que ningún código depende de `iph_detenidos.ficha_inteligencia_id` para lectura (`grep -rn "ficha_inteligencia_id" lib app`). Si existe la columna y algún código la lee, la migración solo quita la constraint FK, no la columna — el dato (si lo hay) sigue existiendo, solo deja de estar validado a nivel BD. Si no hay lectores, considerar si además conviene dropear la columna (fuera de alcance de este plan si no está claro; si se decide dropear, documentarlo explícitamente en el ADR de la Etapa 9).

## Cambio en `lib/monitorista/repository.ts`

Función `obtenerPrellenadoCompleto` (línea ~277):

```sql
-- ANTES
FROM iph_detenidos iph
LEFT JOIN ofi_reporte_denuncia rd ON rd.folio_denuncia = iph.folio_911
LEFT JOIN ofi_reportes_campo rc ON rc.id = rd.reporte_campo_id
LEFT JOIN ofi_detalles_asegurados da ON da.reporte_campo_id = rc.id

-- DESPUÉS
FROM iph_detenidos iph
LEFT JOIN ofi_reporte_denuncia rd ON rd.id = iph.reporte_denuncia_id
LEFT JOIN ofi_reportes_campo rc ON rc.id = rd.reporte_campo_id
LEFT JOIN ofi_detalles_asegurados da ON da.reporte_campo_id = rc.id
```

Nota: `lib/n-coordinacion/repository.ts:65` también tiene un `FROM iph_detenidos` pero **no** usa el join por folio (verificado, no requiere cambio en esta etapa).

## Criterios de aceptación

1. Verificar en `information_schema.table_constraints` que solo queda una FK entre las dos tablas (de `ofi_fichas_inteligencia.iph_id` hacia `iph_detenidos`).
2. `npx tsc --noEmit` y `npm run build` sin errores.
3. `npm run db:schema` + `boveda/📦 Datos/Esquema BD.md` actualizado.
4. Verificación funcional: pantalla que usa `obtenerPrellenadoCompleto` (prellenado de ficha de inteligencia desde un IPH) sigue trayendo los mismos datos que antes (probar con un IPH que tenga `reporte_denuncia_id` asignado, aunque en desarrollo `iph_detenidos` tiene 0 filas hoy — si no hay datos para probar en vivo, dejarlo documentado y que el usuario lo valide cuando haya datos).
5. No modificar otros archivos.

**Detenerse aquí y esperar confirmación del usuario antes de pasar a `etapa-6.md`.**
