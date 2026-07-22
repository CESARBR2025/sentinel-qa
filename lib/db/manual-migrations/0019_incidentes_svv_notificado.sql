-- Agrega columna svv_notificado a incidentes para indicar si se notificó
-- al área de monitoristas (SVV) para revisar cámaras cercanas.
ALTER TABLE incidentes ADD COLUMN IF NOT EXISTS svv_notificado boolean DEFAULT false;
