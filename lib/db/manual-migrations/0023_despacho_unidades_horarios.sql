-- Migration: hora de salida y hora de llegada por unidad despachada
--
-- Alinea con form-003 (Despacho y Seguimiento) del estándar SEGOB-CNI: cada
-- unidad asignada a un incidente debe registrar su propia hora de salida y
-- de llegada al sitio (hoy el sistema solo registraba el cambio de estatus
-- del incidente completo, no el seguimiento por unidad individual).

ALTER TABLE incidente_despacho_unidades
  ADD COLUMN IF NOT EXISTS hora_salida timestamp with time zone,
  ADD COLUMN IF NOT EXISTS hora_llegada timestamp with time zone;
