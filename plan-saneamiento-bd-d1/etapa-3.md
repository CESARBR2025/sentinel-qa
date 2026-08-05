# Etapa 3 — DDL: índices en `ofi_reportes_campo` + drop de `incidente_reporte_campo`

Leer primero `00-contexto.md` de esta misma carpeta.

**Precondición dura: la Etapa 2 debe estar cerrada y confirmada por el usuario.** Esta etapa asume que ya no queda ninguna referencia a `incidente_reporte_campo` en `lib/**`/`app/**`. Verificar de nuevo antes de escribir el `DROP TABLE`:

```bash
grep -rn "incidente_reporte_campo" lib app --include="*.ts" --include="*.tsx"
```

Si esto devuelve algo, **detenerse** — no continuar con el `DROP TABLE` hasta que la Etapa 2 esté realmente completa.

## Objetivo

Agregar los índices que hoy faltan en `ofi_reportes_campo` (usados por filtros de dashboard por oficial y por fecha) y eliminar `incidente_reporte_campo` (0 filas, sin FKs entrantes de otras tablas, sin lectores de código tras la Etapa 2).

## Archivos

- Create: `lib/db/manual-migrations/0032_reportes_campo_integridad.sql`
- Modify: `boveda/📦 Datos/Esquema BD.md` (regenerar con `npm run db:schema`)

## Migración

```sql
CREATE INDEX IF NOT EXISTS idx_ofi_rc_oficial ON ofi_reportes_campo (ofi_oficial_id);
CREATE INDEX IF NOT EXISTS idx_ofi_rc_creado ON ofi_reportes_campo (created_at);

DROP TABLE IF EXISTS incidente_reporte_campo;
```

Nota: `ofi_reportes_campo` ya tiene `ofi_reportes_campo_pkey` (PK) y `uq_ofi_rc_incidente` (único parcial en `incidente_id`) — verificado en BD, no duplicar esos.

## Pasos

1. Aplicar la migración contra la BD de desarrollo.
2. Verificar que el `DROP TABLE` no falla y que los índices nuevos existen:
   ```sql
   SELECT indexname FROM pg_indexes WHERE tablename = 'ofi_reportes_campo';
   SELECT to_regclass('incidente_reporte_campo'); -- debe devolver NULL
   ```
3. `npm run db:schema` para regenerar `boveda/📦 Datos/Esquema BD.md`.

## Criterios de aceptación

1. `SELECT to_regclass('incidente_reporte_campo')` devuelve `NULL`.
2. `pg_indexes` muestra `idx_ofi_rc_oficial` e `idx_ofi_rc_creado` en `ofi_reportes_campo`.
3. `npx tsc --noEmit` y `npm run build` sin errores (no debería haber cambiado nada de TS en esta etapa, es solo DDL).
4. Verificación funcional: repetir la navegación de la Etapa 2 (detalle de incidente, reportes operativos, reportes de incidentes, coordinación, formato N RND, 911) y confirmar que sigue funcionando igual con la tabla ya eliminada.
5. `boveda/📦 Datos/Esquema BD.md` actualizado.
6. No modificar código de `lib/**`/`app/**` en esta etapa — solo la migración SQL y la bóveda.

**Detenerse aquí y esperar confirmación del usuario antes de pasar a `etapa-4.md`.**
