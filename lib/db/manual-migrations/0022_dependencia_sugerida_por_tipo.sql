-- Migration: dependencia sugerida por tipo de emergencia (nivel 1 de la jerarquía)
--
-- Alinea con la tabla "Regla de sugerencia de dependencia por tipo" del estándar
-- SEGOB/CNI (form-002 Canalización a Despacho). Solo agrega el dato de sugerencia
-- al catálogo; NO desbloquea el selector de dependencia en el formulario, que
-- sigue fijo a SEGURIDAD_PUBLICA hasta que se decida abrir multi-dependencia.

BEGIN;

ALTER TABLE cat_tipos_emergencia
  ADD COLUMN IF NOT EXISTS dependencia_sugerida_id integer REFERENCES cat_dependencias(id);

UPDATE cat_tipos_emergencia SET dependencia_sugerida_id = (SELECT id FROM cat_dependencias WHERE clave = 'CRUZ_ROJA')      WHERE codigo = '1'; -- Médico
UPDATE cat_tipos_emergencia SET dependencia_sugerida_id = (SELECT id FROM cat_dependencias WHERE clave = 'BOMBEROS')      WHERE codigo = '2'; -- Protección Civil
UPDATE cat_tipos_emergencia SET dependencia_sugerida_id = (SELECT id FROM cat_dependencias WHERE clave = 'SEGURIDAD_PUBLICA') WHERE codigo = '3'; -- Seguridad
UPDATE cat_tipos_emergencia SET dependencia_sugerida_id = (SELECT id FROM cat_dependencias WHERE clave = 'SERV_PUBLICOS') WHERE codigo = '4'; -- Servicios Públicos
UPDATE cat_tipos_emergencia SET dependencia_sugerida_id = (SELECT id FROM cat_dependencias WHERE clave = 'DIF')          WHERE codigo = '5'; -- Asistencia
UPDATE cat_tipos_emergencia SET dependencia_sugerida_id = (SELECT id FROM cat_dependencias WHERE clave = 'SERV_PUBLICOS') WHERE codigo = '6'; -- Otros Servicios
-- codigo = '7' (Improcedentes) se deja NULL a propósito: no aplica dependencia, no se canaliza.

COMMIT;
