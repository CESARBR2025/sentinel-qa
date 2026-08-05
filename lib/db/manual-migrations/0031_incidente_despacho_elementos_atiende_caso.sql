-- Migration: separar "quién levantó el reporte" de "quién atiende el caso"
--
-- es_prioritario (ya existe) es un hecho histórico inmutable: el oficial cuyo
-- rondín escaló a este incidente. atiende_caso es editable: si el despachador
-- deselecciona la unidad de ese oficial en el picker de asignación, se marca
-- en false — sin borrar el registro histórico de que fue quien reportó.

ALTER TABLE incidente_despacho_elementos
  ADD COLUMN IF NOT EXISTS atiende_caso boolean NOT NULL DEFAULT true;
