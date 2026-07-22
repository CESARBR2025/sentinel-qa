-- Elimina tablas legacy: eventos, cat_estatus_evento y cat_origenes_evento
-- 
-- eventos: tabla paralela a incidentes, sin registros (0 filas), sin código de
--   aplicación que la use. Tenía FKs a catálogos pero ninguna tabla la referenciaba.
-- cat_estatus_evento: catálogo de 11 estados, solo referenciado por eventos.
-- cat_origenes_evento: catálogo de orígenes, solo referenciado por eventos.
--
-- El DROP de eventos elimina automáticamente sus 6 constraints FK:
--   eventos.origen_id → cat_origenes_evento
--   eventos.tipo_incidente_id → cat_tipos_incidente
--   eventos.prioridad_id → cat_prioridades
--   eventos.estatus_id → cat_estatus_evento
--   eventos.turno_id → cat_turnos
--   eventos.creado_por → users

BEGIN;

DROP TABLE IF EXISTS eventos;
DROP TABLE IF EXISTS cat_estatus_evento;
DROP TABLE IF EXISTS cat_origenes_evento;

COMMIT;
