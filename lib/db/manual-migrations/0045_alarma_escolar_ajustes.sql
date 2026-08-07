-- incidente_alarma_escolar: hora_canalizacion, unidad_arribo y hora_arribo quedan huérfanas —
-- ese dato ya vive en incidente_despacho / incidente_despacho_unidades, que es la fuente real
-- (se llena al cerrar con reporte de campo, ver lib/oficial/repository.ts). El reporte de
-- alarma escolar debe leer esos campos por join, no capturarlos como texto libre duplicado.
--
-- es_falso: dato nuevo (¿se confirmó que la alarma era falsa?), no existía en ningún lado.
--
-- Tablas huérfanas eliminadas: 0 filas y 0 referencias en código (lib/ app/ components/).
-- cat_turnos quedó huérfana desde 0018_drop_eventos_cat_estatus_evento.sql (eliminó
-- eventos.turno_id, su único referente). usuario_modulos nunca llegó a usarse.

BEGIN;

ALTER TABLE incidente_alarma_escolar
  DROP COLUMN IF EXISTS hora_canalizacion,
  DROP COLUMN IF EXISTS unidad_arribo,
  DROP COLUMN IF EXISTS hora_arribo,
  ADD COLUMN IF NOT EXISTS es_falso boolean;

DROP TABLE IF EXISTS cat_turnos;
DROP TABLE IF EXISTS usuario_modulos;

COMMIT;
