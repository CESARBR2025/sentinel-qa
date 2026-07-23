-- Agrega columna folio_cad a incidentes para almacenar el folio del CAD externo
-- que el operador captura manualmente (generado por la plataforma CAD).
ALTER TABLE incidentes ADD COLUMN IF NOT EXISTS folio_cad varchar;
