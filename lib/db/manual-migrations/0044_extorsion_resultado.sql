-- Reporte de Llamadas de Extorsión (formato C4): agrega el campo "resultado"
-- (texto libre, disposición de la llamada: orientación, reportante cuelga, etc.)
-- y elimina 3 columnas muertas de incidente_extorsion (0 filas con valor en
-- producción, ninguna UI las llenaba): unidad_resultado, folio_reporte, fecha.
-- FOLIO DE REPORTE del reporte C4 se resuelve desde incidentes.folio_cad;
-- FECHA/HORA desde incidentes.fecha_hora_inicio; UNIDAD desde el despacho
-- real (incidente_despacho_unidades) o 'C4' por default.

ALTER TABLE incidente_extorsion ADD COLUMN IF NOT EXISTS resultado text;
ALTER TABLE incidente_extorsion DROP COLUMN IF EXISTS unidad_resultado;
ALTER TABLE incidente_extorsion DROP COLUMN IF EXISTS folio_reporte;
ALTER TABLE incidente_extorsion DROP COLUMN IF EXISTS fecha;
