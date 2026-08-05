-- Antecedentes de un detenido capturados manualmente por Fiscalía desde una
-- fuente externa (plataforma estatal/nacional de otra entidad) a la que este
-- sistema no tiene acceso. Complementa (no reemplaza) los antecedentes
-- calculados automáticamente contra la BD local (ver lib/reporte-detenidos).

CREATE TABLE IF NOT EXISTS antecedentes_externos_detenido (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reporte_campo_id uuid NOT NULL REFERENCES ofi_reportes_campo(id),
  tipo character varying NOT NULL CHECK (tipo IN ('DELITO', 'FALTA_ADMINISTRATIVA')),
  descripcion text NOT NULL,
  fecha date,
  lugar character varying,
  capturado_por text REFERENCES users(id),
  created_at timestamptz NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_antecedentes_externos_reporte ON antecedentes_externos_detenido (reporte_campo_id);
