-- Migration: Catálogo jerárquico de 3 niveles (Tipo → Subtipo → Incidente)
-- Basado en el Catálogo Nacional de Incidentes de Emergencias (SEGOB/CNI)
-- 
-- Nota: Los datos se pueblan via seed script (seed-catalogo-nacional.ts).
-- Esta migration solo crea la estructura.

BEGIN;

-- 1. Agregar código de 1 dígito a cat_tipos_emergencia (nullable; el seed lo puebla)
ALTER TABLE cat_tipos_emergencia ADD COLUMN IF NOT EXISTS codigo varchar(1);
ALTER TABLE cat_tipos_emergencia ADD CONSTRAINT cat_tipos_emergencia_codigo_key UNIQUE (codigo);

-- 2. Crear tabla de subtipos de emergencia (nivel 2 de la jerarquía)
CREATE TABLE IF NOT EXISTS cat_subtipos_emergencia (
  id          serial PRIMARY KEY,
  tipo_emergencia_id integer NOT NULL REFERENCES cat_tipos_emergencia(id),
  codigo      varchar(3) NOT NULL,
  nombre      varchar(200) NOT NULL,
  activo      boolean NOT NULL DEFAULT true,
  creado_en   timestamp NOT NULL DEFAULT now(),
  CONSTRAINT cat_subtipos_emergencia_tipo_codigo_key UNIQUE (tipo_emergencia_id, codigo)
);

-- 3. Agregar columnas jerárquicas a cat_tipos_incidente
ALTER TABLE cat_tipos_incidente ADD COLUMN IF NOT EXISTS subtipo_emergencia_id integer REFERENCES cat_subtipos_emergencia(id);
ALTER TABLE cat_tipos_incidente ADD COLUMN IF NOT EXISTS codigo_catalogo varchar(5);
ALTER TABLE cat_tipos_incidente ADD COLUMN IF NOT EXISTS prioridad_catalogo varchar(5) CHECK (prioridad_catalogo IN ('ALTA', 'MEDIA', 'BAJA'));

COMMIT;
