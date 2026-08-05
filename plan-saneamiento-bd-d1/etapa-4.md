# Etapa 4 — `ofi_detalles_asegurados` como fuente canónica de detenidos

Leer primero `00-contexto.md` de esta misma carpeta.

## Objetivo

Hoy `lib/detenidos-compartido.ts` (usado por los módulos Fiscalía/Juzgado Cívico para listar detenidos con fotos pendientes) lee el nombre del detenido parseando la columna JSONB `ofi_reportes_campo.ofi_detenidos`. La tabla relacional `ofi_detalles_asegurados` es la que **siempre** se llena al crear el reporte de campo (`lib/oficial/service.ts:209`, `insertarDetallesAsegurados`) y ya es la fuente que usa `lib/fiscalia/repository.ts`. Esta etapa unifica: `detenidos-compartido.ts` pasa a leer de `ofi_detalles_asegurados`.

**No se toca** el formulario de captura ni la columna `ofi_reportes_campo.ofi_detenidos` — sigue existiendo, solo deja de ser la fuente de lectura de este módulo específico.

## Archivos

- Create: `lib/db/manual-migrations/0033_detenidos_asegurados_idx.sql`
- Modify: `lib/detenidos-compartido.ts`

## Migración

```sql
CREATE INDEX IF NOT EXISTS idx_ofi_da_reporte ON ofi_detalles_asegurados (reporte_campo_id);
```

`ofi_detalles_asegurados` hoy solo tiene el índice de PK (verificado en BD) — esta columna se usa en JOINs constantes con `ofi_reportes_campo`, necesita índice.

## Cambios en `lib/detenidos-compartido.ts`

Columnas reales de `ofi_detalles_asegurados` (verificadas en BD): `id, reporte_campo_id, nombre_detenido, ap_paterno_detenido, ap_materno_detenido, calle, colonia, numero, cod_postal, latitud, longitud, created_at, updated_at`.

### 1. `listarDetenidosParaRol` (líneas 47-109)

Reemplazar el filtro `WHERE rc.ofi_detenidos IS NOT NULL AND rc.ofi_detenidos::text NOT IN ('[]', '1')` (aparece en el `count` y en el `SELECT` principal) por un `EXISTS`/`INNER JOIN` contra `ofi_detalles_asegurados`:

```sql
-- antes (count):
FROM ofi_reportes_campo rc
INNER JOIN solicitud_fotos sf ON sf.reporte_campo_id = rc.id
WHERE rc.ofi_detenidos IS NOT NULL
  AND rc.ofi_detenidos::text NOT IN ('[]', '1')
  AND rc.id IN (...)

-- después:
FROM ofi_reportes_campo rc
INNER JOIN solicitud_fotos sf ON sf.reporte_campo_id = rc.id
WHERE EXISTS (SELECT 1 FROM ofi_detalles_asegurados da WHERE da.reporte_campo_id = rc.id)
  AND rc.id IN (...)
```

En el `SELECT` principal, agregar `da.nombre_detenido, da.ap_paterno_detenido, da.ap_materno_detenido` al `SELECT` (vía `INNER JOIN ofi_detalles_asegurados da ON da.reporte_campo_id = rc.id` — si un reporte puede tener más de un detenido, decidir si se agrupa por detenido o se mantiene el comportamiento actual de "un registro por reporte" tomando el primero; revisar cuántos detenidos por reporte hay hoy en la práctica antes de decidir, no asumir 1:1 sin verificar). Quitar `rc.ofi_detenidos` del `SELECT` si ya no se usa.

Reemplazar en la construcción del objeto (línea 89):
```ts
// antes
nombre_detenido: nombreDetenido(row.ofi_detenidos),
// después
nombre_detenido: [row.nombre_detenido, row.ap_paterno_detenido, row.ap_materno_detenido].filter(Boolean).join(' ') || 'Sin nombre',
```

### 2. `obtenerDetenidoParaRol` (líneas 111-158)

Agregar `LEFT JOIN ofi_detalles_asegurados da ON da.reporte_campo_id = rc.id` a la query de `rcResult` (línea 119-121), seleccionar `da.nombre_detenido, da.ap_paterno_detenido, da.ap_materno_detenido`, quitar `rc.ofi_detenidos` del `SELECT` si ya no se usa. Actualizar línea 139 igual que el punto anterior.

### 3. Función `nombreDetenido` (líneas 39-45)

Si ya no queda ningún llamador tras los cambios de arriba, eliminarla (no dejar código muerto). Si algún otro archivo la importa desde este módulo, verificar antes de borrar (`grep -rn "nombreDetenido" lib app`).

## Criterios de aceptación

1. `npx tsc --noEmit` y `npm run build` sin errores.
2. Consulta de control: confirmar que `ofi_detalles_asegurados` sí contiene los detenidos de los reportes de campo actuales y que la query nueva de `detenidos-compartido.ts` los resuelve igual (mismo `total` y mismos `nombre_detenido` que antes del cambio, para los datos actuales de desarrollo).
3. `grep -rn "nombreDetenido" lib app` — si la función se eliminó, no debe quedar ninguna referencia rota.
4. `npm run db:schema` + `boveda/📦 Datos/Esquema BD.md` actualizado con el índice nuevo.
5. No modificar el formulario de captura del reporte de campo ni `lib/oficial/**`.

**Detenerse aquí y esperar confirmación del usuario antes de pasar a `etapa-5.md`.**
