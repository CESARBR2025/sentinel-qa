-- D1 (ofi_reporte_denuncia): índices de dashboard + oficial_id text→uuid con FK
-- real a ofi_oficiales(id) (NO a users — ver 00-contexto.md, Corrección 1) + dedupe
-- de las 3 FKs sobre incidente_id (se conserva solo fk_d1_incidente).

-- Índices de dashboard
CREATE INDEX IF NOT EXISTS idx_d1_fecha ON ofi_reporte_denuncia (fecha_reporte DESC, hora_reporte DESC);
CREATE INDEX IF NOT EXISTS idx_d1_reporte_campo ON ofi_reporte_denuncia (reporte_campo_id);
CREATE INDEX IF NOT EXISTS idx_d1_oficial ON ofi_reporte_denuncia (oficial_id);

-- oficial_id: convertir a uuid y agregar FK real a ofi_oficiales
ALTER TABLE ofi_reporte_denuncia
  ALTER COLUMN oficial_id TYPE uuid USING oficial_id::uuid;

ALTER TABLE ofi_reporte_denuncia
  ADD CONSTRAINT ofi_reporte_denuncia_oficial_id_fkey
  FOREIGN KEY (oficial_id) REFERENCES ofi_oficiales(id);

-- Limpieza de FKs duplicadas sobre incidente_id (las 3 apuntan a incidentes.id)
ALTER TABLE ofi_reporte_denuncia DROP CONSTRAINT IF EXISTS fk_denuncia_incidente;
ALTER TABLE ofi_reporte_denuncia DROP CONSTRAINT IF EXISTS ord_incidente_fk;
-- se conserva fk_d1_incidente, no se toca
