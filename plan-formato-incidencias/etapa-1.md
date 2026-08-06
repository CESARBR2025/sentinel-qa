# Etapa 1 — Migración: tabla de complemento manual

Leer primero `00-contexto.md` completo. Esta etapa solo toca BD, no código de aplicación.

## Archivo a crear

`lib/db/manual-migrations/0039_formato_incidencia_complemento.sql`

Verificar antes que `0039` sigue siendo el siguiente número libre: `ls lib/db/manual-migrations | sed -E 's/^([0-9]+)_.*/\1/' | sort -n | tail -1`.

```sql
-- Datos de "FORMATO INCIDENCIA.xlsx" (hojas INCIDENCIA y PUESTAS A DISPOSICION)
-- que no tienen ninguna columna equivalente en incidentes/ofi_reportes_campo/
-- ofi_reporte_denuncia/ofi_detalles_asegurados. Se capturan a mano desde
-- /formatos-udai/reportes-incidencias cuando el registro se marca como
-- "completo" y queda listo para exportar. La llave es incidente_id (no
-- iph_detenidos: ese módulo quedó fuera de la cadena de este reporte, ver
-- 00-contexto.md — el ancla real es 911 -> reporte de campo -> denuncia).

CREATE TABLE IF NOT EXISTS formato_incidencia_complemento (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  incidente_id uuid NOT NULL UNIQUE REFERENCES incidentes(id),

  rt character varying,
  turno character varying,
  articulos_objetos text,
  ap_nuc character varying,
  calle_afec character varying,
  numero_afec character varying,
  colonia_afec character varying,
  fuero_override character varying,

  agrupamiento character varying,
  folio_rnd character varying,
  originario character varying,
  nuc_cu character varying,
  edad integer,
  fecha_nacimiento date,
  sexo character varying,
  calle_det character varying,
  numero_det character varying,
  colonia_det character varying,
  marca character varying,
  submarca character varying,
  tipo_vehiculo character varying,
  color character varying,
  placas character varying,
  estado_vehiculo character varying,
  niv character varying,
  motor character varying,
  modelo character varying,
  fecha_ingreso timestamptz,
  fecha_salida timestamptz,
  otro_delito text,
  masc text,
  umecas text,

  completado_en timestamptz,
  completado_por text REFERENCES users(id),
  creado_en timestamptz NOT NULL DEFAULT NOW(),
  actualizado_en timestamptz
);

CREATE INDEX IF NOT EXISTS idx_formato_incidencia_complemento_incidente ON formato_incidencia_complemento (incidente_id);
```

## Cómo aplicarla

Seguir el mismo procedimiento que las migraciones anteriores en `lib/db/manual-migrations/` (ver `README.md` de esa carpeta). Ejecutar el `.sql` contra la BD real con el mismo patrón de conexión que `lib/db.ts` (`pg` + `DATABASE_URL` de `.env`).

## Después de aplicar

Correr `npm run db:schema` para regenerar `boveda/📦 Datos/Esquema BD.md` con la tabla nueva.

## Criterios de aceptación

1. La tabla `formato_incidencia_complemento` existe en la BD real con `incidente_id UNIQUE REFERENCES incidentes(id)`.
2. `npm run db:schema` corrió sin error y refleja la tabla nueva.
3. No se modificó ninguna migración existente (`0001`...`0038`).

Detenerse aquí y esperar confirmación antes de pasar a Etapa 2.
