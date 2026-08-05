-- Reportes de campo: integridad + drop de la tabla muerta incidente_reporte_campo.
-- ofi_reportes_campo ya tiene PK (ofi_reportes_campo_pkey) y único parcial
-- uq_ofi_rc_incidente (incidente_id) — no se duplican aquí.

CREATE INDEX IF NOT EXISTS idx_ofi_rc_oficial ON ofi_reportes_campo (ofi_oficial_id);
CREATE INDEX IF NOT EXISTS idx_ofi_rc_creado ON ofi_reportes_campo (created_at);

DROP TABLE IF EXISTS incidente_reporte_campo;
