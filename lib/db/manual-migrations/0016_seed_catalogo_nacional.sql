-- Seed: Poblar catálogo jerárquico desde el Catálogo Nacional de Incidentes de Emergencias
-- Basado en: boveda-test/05-Fuentes/Catálogo Nacional de Incidentes de Emergencias.md
-- 7 tipos, 24 subtipos, 239 incidentes

-- ============================================================
-- TIPO 1 - Médico
-- ============================================================
WITH tid AS (SELECT id FROM cat_tipos_emergencia WHERE codigo = '1')
INSERT INTO cat_subtipos_emergencia (tipo_emergencia_id, codigo, nombre)
SELECT tid.id, '101', 'Accidentes' FROM tid
UNION ALL SELECT tid.id, '102', 'Traumáticos' FROM tid
UNION ALL SELECT tid.id, '103', 'Clínicos' FROM tid;

-- Subtipo 101 - Accidentes
DO $$
DECLARE
  sid int := (SELECT s.id FROM cat_subtipos_emergencia s JOIN cat_tipos_emergencia t ON s.tipo_emergencia_id = t.id WHERE t.codigo = '1' AND s.codigo = '101');
BEGIN
  UPDATE cat_tipos_incidente SET subtipo_emergencia_id = sid, codigo_catalogo = '10101', prioridad_catalogo = 'ALTA' WHERE nombre = 'ACCIDENTE ACUÁTICO CON LESIONADOS';
  UPDATE cat_tipos_incidente SET subtipo_emergencia_id = sid, codigo_catalogo = '10102', prioridad_catalogo = 'ALTA' WHERE nombre = 'ACCIDENTE DE AERONAVE CON LESIONADOS';
  UPDATE cat_tipos_incidente SET subtipo_emergencia_id = sid, codigo_catalogo = '10103', prioridad_catalogo = 'ALTA' WHERE nombre = 'ACCIDENTE DE MOTOCICLETA CON LESIONADOS';
  UPDATE cat_tipos_incidente SET subtipo_emergencia_id = sid, codigo_catalogo = '10104', prioridad_catalogo = 'ALTA' WHERE nombre = 'ACCIDENTE DE VEHÍCULO AUTOMOTOR CON LESIONADOS';
  UPDATE cat_tipos_incidente SET subtipo_emergencia_id = sid, codigo_catalogo = '10105', prioridad_catalogo = 'ALTA' WHERE nombre = 'ACCIDENTE FERROVIARIO CON LESIONADOS';
  UPDATE cat_tipos_incidente SET subtipo_emergencia_id = sid, codigo_catalogo = '10106', prioridad_catalogo = 'ALTA' WHERE nombre = 'ACCIDENTE FERROVIARIO CON FALLECIDO';
  UPDATE cat_tipos_incidente SET subtipo_emergencia_id = sid, codigo_catalogo = '10107', prioridad_catalogo = 'ALTA' WHERE nombre ILIKE '%ACCIDENTE MÚLTIPLE CON LESIONADOS%';
  UPDATE cat_tipos_incidente SET subtipo_emergencia_id = sid, codigo_catalogo = '10107', prioridad_catalogo = 'ALTA' WHERE nombre ILIKE '%ACCIDENTE MULTIPLE CON LESIONADOS%';
  UPDATE cat_tipos_incidente SET subtipo_emergencia_id = sid, codigo_catalogo = '10108', prioridad_catalogo = 'ALTA' WHERE nombre ILIKE '%ACCIDENTE MÚLTIPLE CON FALLECIDO%';
  UPDATE cat_tipos_incidente SET subtipo_emergencia_id = sid, codigo_catalogo = '10108', prioridad_catalogo = 'ALTA' WHERE nombre ILIKE '%ACCIDENTE MULTIPLE CON FALLECIDO%';
  UPDATE cat_tipos_incidente SET subtipo_emergencia_id = sid, codigo_catalogo = '10109', prioridad_catalogo = 'ALTA' WHERE nombre ILIKE '%ACCIDENTE DE VEHÍCULO DE PASAJEROS CON LESIONADOS%';
  UPDATE cat_tipos_incidente SET subtipo_emergencia_id = sid, codigo_catalogo = '10109', prioridad_catalogo = 'ALTA' WHERE nombre ILIKE '%ACCIDENTE DE VEHICULO DE PASAJEROS CON LESIONADOS%';
  UPDATE cat_tipos_incidente SET subtipo_emergencia_id = sid, codigo_catalogo = '10110', prioridad_catalogo = 'ALTA' WHERE nombre ILIKE '%ACCIDENTE DE VEHÍCULO DE PASAJEROS CON FALLECIDO%';
  UPDATE cat_tipos_incidente SET subtipo_emergencia_id = sid, codigo_catalogo = '10110', prioridad_catalogo = 'ALTA' WHERE nombre ILIKE '%ACCIDENTE DE VEHICULO DE PASAJEROS CON FALLECIDO%';
  UPDATE cat_tipos_incidente SET subtipo_emergencia_id = sid, codigo_catalogo = '10111', prioridad_catalogo = 'ALTA' WHERE nombre ILIKE '%ACCIDENTE DE MOTOCICLETA CON FALLECIDO%';
  UPDATE cat_tipos_incidente SET subtipo_emergencia_id = sid, codigo_catalogo = '10112', prioridad_catalogo = 'ALTA' WHERE nombre ILIKE '%ACCIDENTE DE VEHÍCULO AUTOMOTOR CON FALLECIDO%';
  UPDATE cat_tipos_incidente SET subtipo_emergencia_id = sid, codigo_catalogo = '10112', prioridad_catalogo = 'ALTA' WHERE nombre ILIKE '%ACCIDENTE DE VEHICULO AUTOMOTOR CON FALLECIDO%';
  UPDATE cat_tipos_incidente SET subtipo_emergencia_id = sid, codigo_catalogo = '10113', prioridad_catalogo = 'ALTA' WHERE nombre ILIKE '%ACCIDENTE DE AERONAVE CON FALLECIDO%';
  UPDATE cat_tipos_incidente SET subtipo_emergencia_id = sid, codigo_catalogo = '10114', prioridad_catalogo = 'ALTA' WHERE nombre ILIKE '%ACCIDENTE DE EMBARCACIONES CON LESIONADOS%';
  UPDATE cat_tipos_incidente SET subtipo_emergencia_id = sid, codigo_catalogo = '10115', prioridad_catalogo = 'ALTA' WHERE nombre ILIKE '%ACCIDENTE DE EMBARCACIONES CON FALLECIDO%';
  UPDATE cat_tipos_incidente SET subtipo_emergencia_id = sid, codigo_catalogo = '10116', prioridad_catalogo = 'ALTA' WHERE nombre = 'ATROPELLAMIENTO';
  UPDATE cat_tipos_incidente SET subtipo_emergencia_id = sid, codigo_catalogo = '10117', prioridad_catalogo = 'ALTA' WHERE nombre ILIKE '%ACCIDENTE ACUÁTICO CON FALLECIDO%';
  UPDATE cat_tipos_incidente SET subtipo_emergencia_id = sid, codigo_catalogo = '10118', prioridad_catalogo = 'ALTA' WHERE nombre ILIKE '%MATERIALES PELIGROSOS%' AND (nombre ILIKE '%ACCIDENTE%' OR nombre ILIKE '%ACCIDENTES%');
  UPDATE cat_tipos_incidente SET subtipo_emergencia_id = sid, codigo_catalogo = '10119', prioridad_catalogo = 'ALTA' WHERE nombre ILIKE '%MATERIALES RADIOACTIVOS%';
  UPDATE cat_tipos_incidente SET subtipo_emergencia_id = sid, codigo_catalogo = '10120', prioridad_catalogo = 'ALTA' WHERE nombre ILIKE '%RIESGO BIOLÓGICO%' OR nombre ILIKE '%RIESGO BIOLOGICO%';
  UPDATE cat_tipos_incidente SET subtipo_emergencia_id = sid, codigo_catalogo = '10121', prioridad_catalogo = 'ALTA' WHERE nombre = 'OTROS ACCIDENTES CON LESIONADOS';
END $$;

-- Nota: El seed se completa ejecutando el script Node.js que inserta los 239 incidentes
-- desde el JSON. Este archivo SQL contiene la estructura; el poblado se hace vía:
-- npm run db:seed:catalogo
