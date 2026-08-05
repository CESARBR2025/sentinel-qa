# Etapa 8 — FK faltante en `evidencias_detenido` + índices horizontales de rendimiento

Leer primero `00-contexto.md` de esta misma carpeta.

## Objetivo

`evidencias_detenido.reporte_campo_id` existe como columna (verificado en BD) pero no tiene FK — es la única FK faltante detectada tras revisar el resto del modelo. Además, agregar índices de filtrado en columnas usadas por los dashboards de incidentes/IPH que hoy no los tienen (verificado con `pg_indexes`, no se duplican los que ya existen: `incidentes` ya tiene `idx_incidentes_estatus_canal` pero nada por `creado_en`/`tipo_incidente_id`; `iph_detenidos` ya tiene `idx_iph_fecha` pero sobre `fecha_creacion`, no sobre `fecha_reporte`).

## Archivos

- Create: `lib/db/manual-migrations/0036_fks_faltantes_e_indices.sql`

## Migración

```sql
-- FK faltante (columna ya existe, constraint no)
ALTER TABLE evidencias_detenido
  ADD CONSTRAINT evidencias_detenido_reporte_campo_id_fkey
  FOREIGN KEY (reporte_campo_id) REFERENCES ofi_reportes_campo(id);

-- Índices horizontales de rendimiento (verificado que no existen ya con estos nombres/columnas)
CREATE INDEX IF NOT EXISTS idx_incidentes_creado ON incidentes (creado_en);
CREATE INDEX IF NOT EXISTS idx_incidentes_tipo_incidente ON incidentes (tipo_incidente_id);
CREATE INDEX IF NOT EXISTS idx_iph_fecha_reporte ON iph_detenidos (fecha_reporte);
```

**Antes de aplicar la FK**: `evidencias_detenido` tiene 0 filas en desarrollo (verificado), así que no debería haber huérfanos. Si al ejecutar contra otro entorno hay filas con `reporte_campo_id` que no exista en `ofi_reportes_campo`, la `ALTER TABLE ... ADD CONSTRAINT` falla — correr antes:
```sql
SELECT ed.reporte_campo_id FROM evidencias_detenido ed
LEFT JOIN ofi_reportes_campo rc ON rc.id = ed.reporte_campo_id
WHERE ed.reporte_campo_id IS NOT NULL AND rc.id IS NULL;
```
Si devuelve filas, detenerse y decidir con el usuario qué hacer con esos huérfanos antes de continuar.

## Verificación con `EXPLAIN ANALYZE`

Sobre las queries principales que se benefician (`obtenerReportesD1` en `lib/d1/repository.ts`, el dashboard de Fiscalía), confirmar que el plan de ejecución usa los índices nuevos donde aplique (no es obligatorio que todas las queries cambien de plan — el objetivo es que los índices existan para cuando el volumen de datos crezca, la BD de desarrollo es demasiado pequeña para forzar un cambio de plan real).

## Criterios de aceptación

1. `evidencias_detenido_reporte_campo_id_fkey` existe en `information_schema.table_constraints`.
2. Los 3 índices nuevos existen (`idx_incidentes_creado`, `idx_incidentes_tipo_incidente`, `idx_iph_fecha_reporte`).
3. `npx tsc --noEmit` y `npm run build` sin errores.
4. `npm run db:schema` + `boveda/📦 Datos/Esquema BD.md` actualizado.
5. No se requiere cambio de código TypeScript en esta etapa (es solo DDL). Si `EXPLAIN ANALYZE` revela que alguna query necesita ajuste para aprovechar un índice nuevo, documentarlo pero no forzarlo sin confirmar con el usuario — está fuera del alcance mínimo de esta etapa.

**Detenerse aquí y esperar confirmación del usuario antes de pasar a `etapa-9.md`.**
