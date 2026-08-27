-- Etapa 0 — Parte de Novedades C-4 · Prerrequisitos de datos
-- 0.1 cat_sectores canónico + 0.2 ofi_oficiales.sector_id
-- 0.4 cat_clasificacion_delitos + 0.5 siembra cat_estado_fuerza_conceptos

-- 0.1 Consolidar catálogo de sectores.
-- public.cat_sectores es el canónico (tiene FK real: roles_servicio.sector_id).
-- via.sectores queda como catálogo del subsistema VIA, mapeado por clave = nombre_sector.
INSERT INTO cat_sectores (nombre, clave, activo) VALUES
  ('ORIENTE',  'ORIENTE',  true),
  ('PONIENTE', 'PONIENTE', true),
  ('CENTRO',   'CENTRO',   true)
ON CONFLICT (clave) DO NOTHING;
--> statement-breakpoint

-- 0.2 Sector del oficial.
-- Los oficiales existentes quedan en NULL hasta que Administración los asigne.
ALTER TABLE ofi_oficiales
  ADD COLUMN IF NOT EXISTS sector_id integer REFERENCES cat_sectores(id);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS idx_ofi_oficiales_sector ON ofi_oficiales(sector_id);
--> statement-breakpoint

-- 0.4 Catálogo de clasificación de delitos para la tabla T25.
-- Las 4 familias del formato: PATRIMONIALES_CU | SOCIEDAD | PERSONAS | OTROS.
-- Siembra inicial con los delitos presentes en BD (ofi_reporte_denuncia UNION iph_detenidos),
-- clasificados con criterio del área de Análisis. Los que aparezcan después y no estén
-- aquí caen en OTROS y se listan en el paso 8 para clasificación manual.
CREATE TABLE IF NOT EXISTS cat_clasificacion_delitos (
  id            serial PRIMARY KEY,
  delito        text NOT NULL UNIQUE,
  familia       text NOT NULL,   -- PATRIMONIALES_CU | SOCIEDAD | PERSONAS | OTROS
  activo        boolean NOT NULL DEFAULT true,
  creado_en     timestamp NOT NULL DEFAULT now()
);
--> statement-breakpoint
INSERT INTO cat_clasificacion_delitos (delito, familia) VALUES
  ('VIOLENCIA FAMILIAR',          'PERSONAS'),
  ('FALTAS A LA PAZ',             'SOCIEDAD'),
  ('FALTAS A LA MORAL',           'SOCIEDAD'),
  ('RESISTENCIA A LA AUTORIDAD',  'SOCIEDAD'),
  ('PORTACION DE ARMA BLANCA',    'SOCIEDAD'),
  ('DETONACIÓN DE ARMA DE FUEGO', 'SOCIEDAD'),
  ('DETONACIÓN DE EXPLOSIVOS',    'SOCIEDAD'),
  ('USO DE SUSTANCIAS',           'SOCIEDAD'),
  ('CONSUMO DE ALCOHOL',          'SOCIEDAD'),
  ('OBSTRUCCION DE VIA',          'OTROS'),
  ('INVASION DE VIA PUBLICA',     'OTROS'),
  ('DISCAPACIDAD MENTAL (DETENCION)', 'OTROS')
ON CONFLICT (delito) DO NOTHING;
--> statement-breakpoint

-- 0.5 Sembrar cat_estado_fuerza_conceptos — los 12 conceptos de la tabla T32.
INSERT INTO cat_estado_fuerza_conceptos (nombre, codigo, grupo, orden, activo) VALUES
  ('Servicio',                   'SERVICIO',     'PERSONAL', 1,  true),
  ('Vacaciones',                 'VACACIONES',   'PERSONAL', 2,  true),
  ('Incapacidades',              'INCAPACIDADES','PERSONAL', 3,  true),
  ('Descansos',                  'DESCANSOS',    'PERSONAL', 4,  true),
  ('Comisionados',               'COMISIONADOS', 'PERSONAL', 5,  true),
  ('Arrestados',                 'ARRESTADOS',   'PERSONAL', 6,  true),
  ('Unidades',                   'UNIDADES',     'PARQUE',   7,  true),
  ('Motocicletas',               'MOTOCICLETAS', 'PARQUE',   8,  true),
  ('Cuatrimotos',                'CUATRIMOTOS',  'PARQUE',   9,  true),
  ('Bicicletas',                 'BICICLETAS',   'PARQUE',   10, true),
  ('Operativos/administrativos', 'OPER_ADMIN',   'PARQUE',   11, true),
  ('Subestaciones',              'SUBESTACIONES','PARQUE',   12, true)
ON CONFLICT (codigo) DO NOTHING;
