-- Migration: re-asignar oficiales a patrullas (datos de prueba)
--
-- La migration 0027 (migración del parque vehicular) limpió patrulla_id en
-- ofi_oficiales y el re-import generó ids uuid nuevos en v2_patrullas, por lo
-- que ningún oficial quedó vinculado a una patrulla. Esto es DATOS DE PRUEBA
-- (aún no producción): se ligan 4 oficiales a cada una de 2 patrullas para
-- reproducir el ejercicio del modal "Unidades cercanas al hecho".

UPDATE ofi_oficiales SET patrulla_id = (SELECT id FROM via.v2_patrullas WHERE placa = 'ER-721-A1' LIMIT 1) WHERE no_nomina = '123-123';
UPDATE ofi_oficiales SET patrulla_id = (SELECT id FROM via.v2_patrullas WHERE placa = 'ER-721-A1' LIMIT 1) WHERE no_nomina = '201-201';
UPDATE ofi_oficiales SET patrulla_id = (SELECT id FROM via.v2_patrullas WHERE placa = 'ER-721-A1' LIMIT 1) WHERE no_nomina = '202-202';
UPDATE ofi_oficiales SET patrulla_id = (SELECT id FROM via.v2_patrullas WHERE placa = 'ER-721-A1' LIMIT 1) WHERE no_nomina = '204-204';

UPDATE ofi_oficiales SET patrulla_id = (SELECT id FROM via.v2_patrullas WHERE placa = 'ER-643-A1' LIMIT 1) WHERE no_nomina = '203-203';
UPDATE ofi_oficiales SET patrulla_id = (SELECT id FROM via.v2_patrullas WHERE placa = 'ER-643-A1' LIMIT 1) WHERE no_nomina = '205-205';
UPDATE ofi_oficiales SET patrulla_id = (SELECT id FROM via.v2_patrullas WHERE placa = 'ER-643-A1' LIMIT 1) WHERE no_nomina = '206-206';
UPDATE ofi_oficiales SET patrulla_id = (SELECT id FROM via.v2_patrullas WHERE placa = 'ER-643-A1' LIMIT 1) WHERE no_nomina = '123123';
