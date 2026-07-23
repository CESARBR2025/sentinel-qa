-- Migration: reemplaza el texto libre de clasificación en ofi_reportes_campo por
-- referencias reales al catálogo (regla: ningún dato de catálogo/formulario debe
-- ser genérico o texto libre — la fuente de verdad es el estándar SEGOB-CNI).
--
-- Las columnas de texto (ofi_tipo_incidente, ofi_tipo_emergencia, ofi_prioridad) se
-- conservan para lectura histórica y para no romper el código que aún las muestra,
-- pero a partir de esta migración se pueblan en el servidor a partir del catálogo
-- real (nunca del texto que capture el cliente).

ALTER TABLE ofi_reportes_campo
  ADD COLUMN IF NOT EXISTS tipo_emergencia_id integer REFERENCES cat_tipos_emergencia(id),
  ADD COLUMN IF NOT EXISTS tipo_incidente_id integer REFERENCES cat_tipos_incidente(id),
  ADD COLUMN IF NOT EXISTS prioridad_id integer REFERENCES cat_prioridades(id);
