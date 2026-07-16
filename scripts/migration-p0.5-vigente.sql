-- P0.5: Agregar columna vigente + índice único parcial en v2_ordenes_pago_sa7
-- Ejecutar: psql "$DATABASE_URL" -f scripts/migration-p0.5-vigente.sql

ALTER TABLE via.v2_ordenes_pago_sa7
  ADD COLUMN IF NOT EXISTS vigente boolean NOT NULL DEFAULT true;

-- Índice único parcial: solo una orden vigente por infracción
CREATE UNIQUE INDEX IF NOT EXISTS idx_orden_pago_vigente_unico
  ON via.v2_ordenes_pago_sa7 (infraccion_id)
  WHERE vigente = true;

-- Backfill: marcar como no vigente órdenes vencidas o con una más reciente
UPDATE via.v2_ordenes_pago_sa7 o1
SET vigente = false
WHERE EXISTS (
  SELECT 1 FROM via.v2_ordenes_pago_sa7 o2
  WHERE o2.infraccion_id = o1.infraccion_id
    AND (
      (o2.created_at > o1.created_at AND o2.id != o1.id)
      OR (o1.fecha_vencimiento IS NOT NULL AND o1.fecha_vencimiento < NOW())
    )
);
