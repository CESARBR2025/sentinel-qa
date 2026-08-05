-- ofi_detalles_asegurados: campos biográficos del detenido para la Ficha UDAI
-- (FORMATO FICHA DE DETENIDOS.pptx) que hoy no se capturan. Los captura Fiscalía
-- en el mismo formulario donde ya captura domicilio (FormularioAsegurado.tsx).

ALTER TABLE ofi_detalles_asegurados
  ADD COLUMN IF NOT EXISTS apodo character varying,
  ADD COLUMN IF NOT EXISTS curp character varying(18),
  ADD COLUMN IF NOT EXISTS fecha_nacimiento date,
  ADD COLUMN IF NOT EXISTS genero character varying,
  ADD COLUMN IF NOT EXISTS originario character varying,
  ADD COLUMN IF NOT EXISTS estado_civil character varying,
  ADD COLUMN IF NOT EXISTS escolaridad character varying,
  ADD COLUMN IF NOT EXISTS ocupacion character varying,
  ADD COLUMN IF NOT EXISTS rasgos_particulares text;

CREATE INDEX IF NOT EXISTS idx_detalles_asegurados_curp ON ofi_detalles_asegurados (curp) WHERE curp IS NOT NULL;
