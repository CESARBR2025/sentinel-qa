-- Migration: última ubicación conocida de cada oficial
--
-- Permite al despachador ver qué tan cerca está una unidad del incidente al
-- momento de asignar. Se guarda SOLO la última posición (no un historial de
-- recorrido): el objetivo es "¿dónde está la unidad ahora?", no reconstruir
-- una ruta. Actualizada por el propio oficial mientras tiene la sesión
-- abierta (heartbeat de navegador, ver reportarUbicacionOficial).

ALTER TABLE ofi_oficiales
  ADD COLUMN IF NOT EXISTS ultima_lat numeric,
  ADD COLUMN IF NOT EXISTS ultima_lng numeric,
  ADD COLUMN IF NOT EXISTS ultima_ubicacion_en timestamp with time zone;
