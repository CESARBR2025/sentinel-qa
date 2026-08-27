-- Etapa 2 — Parte de Novedades C-4 · Esquema de persistencia
-- 3 tablas genéricas por forma de dato (no una por sección) + retiro de novedades_captura.

-- Semáforo del stepper. Clon estructural de formato_n_estatus_dia con las 11 secciones.
CREATE TABLE IF NOT EXISTS novedades_estatus_dia (
  fecha                     date PRIMARY KEY,
  periodo_confirmado        boolean NOT NULL DEFAULT false,
  resumen_confirmado        boolean NOT NULL DEFAULT false,
  subsecretaria_confirmado  boolean NOT NULL DEFAULT false,
  analisis_confirmado       boolean NOT NULL DEFAULT false,
  c4_confirmado             boolean NOT NULL DEFAULT false,
  transito_confirmado       boolean NOT NULL DEFAULT false,
  prevencion_confirmado     boolean NOT NULL DEFAULT false,
  delictivos_confirmado     boolean NOT NULL DEFAULT false,
  operativos_confirmado     boolean NOT NULL DEFAULT false,
  resumen_nov_confirmado    boolean NOT NULL DEFAULT false,
  fuerza_confirmado         boolean NOT NULL DEFAULT false,
  completado_en             timestamp with time zone,
  actualizado_por           text REFERENCES users(id),
  actualizado_en            timestamp with time zone NOT NULL DEFAULT now()
);
--> statement-breakpoint

-- Matrices de contadores: un renglón por (fecha, sección).
CREATE TABLE IF NOT EXISTS novedades_seccion (
  fecha           date NOT NULL,
  seccion         text NOT NULL,
  datos           jsonb NOT NULL DEFAULT '{}'::jsonb,
  capturado_por   text REFERENCES users(id),
  actualizado_en  timestamp with time zone NOT NULL DEFAULT now(),
  PRIMARY KEY (fecha, seccion)
);
--> statement-breakpoint

-- Listados capturados: N renglones por (fecha, sección).
CREATE TABLE IF NOT EXISTS novedades_filas (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  fecha           date NOT NULL,
  seccion         text NOT NULL,
  orden           integer NOT NULL DEFAULT 0,
  datos           jsonb NOT NULL DEFAULT '{}'::jsonb,
  capturado_por   text REFERENCES users(id),
  creado_en       timestamp with time zone NOT NULL DEFAULT now(),
  actualizado_en  timestamp with time zone NOT NULL DEFAULT now()
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS idx_novedades_filas_fecha_seccion
  ON novedades_filas (fecha, seccion, orden);
--> statement-breakpoint

-- Retiro de novedades_captura: intento previo abandonado (0 filas, 0 refs en código
-- salvo el nombre en lib/admin/sistema-constants.ts). Se confirma count(*)=0 antes
-- del DROP en la migración de auditoría de la Etapa 10.
