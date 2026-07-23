-- Agrega el campo de narrativa de hechos (auto-redactada por IA, editable
-- por el oficial) a la boleta de infracción. Nullable: no afecta filas
-- existentes ni las hace requerir el campo.
ALTER TABLE via.v2_infracciones ADD COLUMN IF NOT EXISTS narrativa_hechos text;
