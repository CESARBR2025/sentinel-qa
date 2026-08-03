-- Migration: v2_patrullas pasa a parque vehicular (datos desde Excel)
--
-- El catálogo de unidades deja de sincronizarse con la API externa de flota
-- (proyecto-flota.vercel.app) y pasa a cargarse desde el Excel del parque
-- vehicular. num_serie (VIN) es la llave de negocio única: las placas pueden
-- faltar o repetirse (bicicletas, S/P), por eso numero_unidad/placas pasan a
-- NULLable y se agregan las columnas descriptivas del Excel. El id uuid se
-- conserva como PK interna para no tocar los joins existentes.

ALTER TABLE via.v2_patrullas
  ADD COLUMN IF NOT EXISTS num_serie text,
  ADD COLUMN IF NOT EXISTS departamento text,
  ADD COLUMN IF NOT EXISTS caracteristicas text,
  ADD COLUMN IF NOT EXISTS marca text,
  ADD COLUMN IF NOT EXISTS modelo text,
  ADD COLUMN IF NOT EXISTS gps text,
  ADD COLUMN IF NOT EXISTS radio text,
  ADD COLUMN IF NOT EXISTS camaras text;

-- Poblar num_serie con la placa actual para crear el UNIQUE sin nulos.
UPDATE via.v2_patrullas SET num_serie = numero_unidad WHERE num_serie IS NULL;

ALTER TABLE via.v2_patrullas ALTER COLUMN num_serie SET NOT NULL;
ALTER TABLE via.v2_patrullas
  ADD CONSTRAINT v2_patrullas_num_serie_key UNIQUE (num_serie);

-- numero_unidad (placa) deja de ser obligatoria y única.
ALTER TABLE via.v2_patrullas DROP CONSTRAINT IF EXISTS v2_patrullas_numero_unidad_key;
ALTER TABLE via.v2_patrullas ALTER COLUMN numero_unidad DROP NOT NULL;
ALTER TABLE via.v2_patrullas ALTER COLUMN placas DROP NOT NULL;

-- Limpiar el catálogo viejo y desasignar patrullas (se repobla desde el Excel).
-- Se usa DELETE (no TRUNCATE): TRUNCATE se bloquea por la existencia de la FK
-- ofi_oficiales_patrulla_id_fkey aunque esté vacía, mientras que DELETE respeta
-- su ON DELETE SET NULL. El UPDATE explícito es defensa extra.
UPDATE ofi_oficiales SET patrulla_id = NULL;
DELETE FROM via.v2_patrullas;
