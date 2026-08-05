# Etapa 6 — D1: índices + FK real de `oficial_id` + limpieza de FKs duplicadas

Leer primero `00-contexto.md` de esta misma carpeta — en particular la sección "Corrección 1" (por qué `oficial_id` referencia `ofi_oficiales.id` y no `users.id`) y "Corrección 3" (FKs duplicadas).

Esta es la etapa más delicada del plan porque cambia el tipo de una columna (`oficial_id`: `text` → `uuid`). Verificado en BD antes de escribir esto: 0 filas con `NULL`, 0 filas con formato no-UUID — el cast es seguro **hoy** (BD de desarrollo con 1 sola fila). Volver a correr la verificación de la Step 1 inmediatamente antes de aplicar, por si la BD cambió entre el diseño de este plan y su ejecución.

## Objetivo

1. Agregar índices que hoy faltan en `ofi_reporte_denuncia` para los dashboards (fecha, reporte de campo, oficial).
2. Convertir `oficial_id` a `uuid` y agregarle la FK real hacia `ofi_oficiales(id)` (no `users(id)` — ver corrección en `00-contexto.md`).
3. Eliminar las 2 FKs duplicadas sobre `incidente_id` (`fk_denuncia_incidente`, `ord_incidente_fk`), dejar solo `fk_d1_incidente`.

## Archivos

- Create: `lib/db/manual-migrations/0035_d1_integridad.sql`

No se toca código TypeScript en esta etapa: `oficial_id` ya se maneja como string en TS (los UUID de Postgres se leen como string vía el driver `pg`), así que el cambio de tipo de columna en BD no debería requerir cambios en `lib/d1/**` — verificar igual con `npx tsc --noEmit` al final.

## Pasos

### 1. Verificar antes de migrar (repetir contra la BD real al momento de ejecutar, no confiar en los números de cuando se diseñó el plan)

```sql
SELECT count(*) FROM ofi_reporte_denuncia WHERE oficial_id IS NULL;
SELECT oficial_id FROM ofi_reporte_denuncia
WHERE oficial_id IS NOT NULL
  AND oficial_id !~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$';
```

Si cualquiera de las dos devuelve filas (NULLs o valores no-UUID), **detenerse** y decidir con el usuario qué hacer con esas filas antes de continuar (no hay `ON DELETE`/limpieza automática de datos sin confirmación).

### 2. Migración

```sql
-- Índices de dashboard
CREATE INDEX IF NOT EXISTS idx_d1_fecha ON ofi_reporte_denuncia (fecha_reporte DESC, hora_reporte DESC);
CREATE INDEX IF NOT EXISTS idx_d1_reporte_campo ON ofi_reporte_denuncia (reporte_campo_id);
CREATE INDEX IF NOT EXISTS idx_d1_oficial ON ofi_reporte_denuncia (oficial_id);

-- oficial_id: convertir a uuid y agregar FK real a ofi_oficiales (NO a users — ver 00-contexto.md)
ALTER TABLE ofi_reporte_denuncia
  ALTER COLUMN oficial_id TYPE uuid USING oficial_id::uuid;

ALTER TABLE ofi_reporte_denuncia
  ADD CONSTRAINT ofi_reporte_denuncia_oficial_id_fkey
  FOREIGN KEY (oficial_id) REFERENCES ofi_oficiales(id);

-- Limpieza de FKs duplicadas sobre incidente_id (las 3 apuntan a incidentes.id, se deja solo una)
ALTER TABLE ofi_reporte_denuncia DROP CONSTRAINT IF EXISTS fk_denuncia_incidente;
ALTER TABLE ofi_reporte_denuncia DROP CONSTRAINT IF EXISTS ord_incidente_fk;
-- se conserva fk_d1_incidente, no se toca
```

Nota: el índice `idx_d1_oficial` debe crearse **después** de la conversión de tipo si se quiere que quede sobre `uuid` (más compacto/rápido que sobre `text`) — el orden de arriba ya lo respeta.

### 3. Verificar después de migrar

```sql
SELECT data_type FROM information_schema.columns WHERE table_name='ofi_reporte_denuncia' AND column_name='oficial_id'; -- debe ser 'uuid'

SELECT constraint_name FROM information_schema.table_constraints
WHERE table_name='ofi_reporte_denuncia' AND constraint_type='FOREIGN KEY';
-- debe listar: ofi_reporte_denuncia_oficial_id_fkey, fk_d1_incidente, reportes_d1_reporte_campo_id_fkey, fk_reportes_d1_usuario
-- NO debe listar: fk_denuncia_incidente, ord_incidente_fk
```

### 4. `npm run db:schema`

Regenerar `boveda/📦 Datos/Esquema BD.md`.

## Criterios de aceptación

1. `oficial_id` es `uuid` con FK a `ofi_oficiales(id)`.
2. Solo queda una FK sobre `incidente_id` (`fk_d1_incidente`).
3. Los 3 índices nuevos existen (`idx_d1_fecha`, `idx_d1_reporte_campo`, `idx_d1_oficial`).
4. `npx tsc --noEmit` y `npm run build` sin errores.
5. Verificación funcional: crear o consultar un D1 desde `/denuncia/nuevo` y confirmar que el insert/lectura de `oficialId` sigue funcionando (el valor que manda el formulario ya es `oficial.id` de `ofi_oficiales`, ver `00-contexto.md` — no debería fallar, pero probarlo).
6. `boveda/📦 Datos/Esquema BD.md` actualizado.
7. No modificar código de `lib/**`/`app/**` en esta etapa — solo la migración SQL y la bóveda, salvo que la verificación funcional del punto 5 revele un caso que sí requiera un ajuste de código (documentarlo si pasa, no forzar el criterio).

**Detenerse aquí y esperar confirmación del usuario antes de pasar a `etapa-7.md`.**
