-- FK faltante en evidencias_detenido.reporte_campo_id (la columna existe, la constraint no)
-- + índices horizontales de rendimiento en columnas de dashboard.

ALTER TABLE evidencias_detenido
  ADD CONSTRAINT evidencias_detenido_reporte_campo_id_fkey
  FOREIGN KEY (reporte_campo_id) REFERENCES ofi_reportes_campo(id);

CREATE INDEX IF NOT EXISTS idx_incidentes_creado ON incidentes (creado_en);
CREATE INDEX IF NOT EXISTS idx_incidentes_tipo_incidente ON incidentes (tipo_incidente_id);
CREATE INDEX IF NOT EXISTS idx_iph_fecha_reporte ON iph_detenidos (fecha_reporte);
