-- Migration: Agrega columna dependencia_id a incidentes para registrar
-- la dependencia responsable (Policía, Bomberos, Cruz Roja, etc.)
ALTER TABLE incidentes ADD COLUMN IF NOT EXISTS dependencia_id integer REFERENCES cat_dependencias(id);
