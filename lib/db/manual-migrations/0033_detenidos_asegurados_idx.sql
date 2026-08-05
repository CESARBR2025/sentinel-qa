-- Detenidos asegurados: índice sobre reporte_campo_id (join constante con ofi_reportes_campo).
-- ofi_detalles_asegurados solo tenía el índice de PK.

CREATE INDEX IF NOT EXISTS idx_ofi_da_reporte ON ofi_detalles_asegurados (reporte_campo_id);
