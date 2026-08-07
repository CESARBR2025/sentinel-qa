-- incidente_alarma_escolar.direccion queda huérfana: la ubicación de una alarma escolar es la
-- misma que la del incidente (Step 3 del formulario, ya captura calle/número/colonia/referencia
-- con mapa y coordenadas reales) — no tiene sentido pedirla dos veces como texto libre aparte.
-- El reporte ahora construye "Dirección" desde incidentes.calle/numero_exterior/colonia/
-- referencia_ubicacion en vez de este campo.

BEGIN;

ALTER TABLE incidente_alarma_escolar
  DROP COLUMN IF EXISTS direccion;

COMMIT;
