-- Migration: v2_patrullas — simplificar columnas de identidad
--
-- Se elimina numero_unidad (era duplicada de placas) y descripcion (se calcula
-- una etiqueta en el mapper desde caracteristicas/marca/modelo), y placas se
-- renombra a placa. num_serie (VIN) sigue siendo la llave de negocio única y
-- id uuid la PK interna; las FKs y el UNIQUE no cambian.

ALTER TABLE via.v2_patrullas DROP COLUMN numero_unidad;
ALTER TABLE via.v2_patrullas RENAME COLUMN placas TO placa;
ALTER TABLE via.v2_patrullas DROP COLUMN descripcion;
