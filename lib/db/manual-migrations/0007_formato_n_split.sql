DROP TABLE IF EXISTS "formato_n_eventos";
--> statement-breakpoint
DROP TABLE IF EXISTS "formato_n_fge";
--> statement-breakpoint
DROP TABLE IF EXISTS "formato_n_fgr";
--> statement-breakpoint
DROP TABLE IF EXISTS "formato_n_rnd";
--> statement-breakpoint
DROP TABLE IF EXISTS "formato_n_medios_alternativos";
--> statement-breakpoint
DROP TABLE IF EXISTS "formato_n_atencion_victimas";
--> statement-breakpoint
DROP TABLE IF EXISTS "formato_n_armas_aseguradas";
--> statement-breakpoint
DROP TABLE IF EXISTS "formato_n_reportes";
--> statement-breakpoint
ALTER TABLE "monitorista_historial" DROP CONSTRAINT IF EXISTS "mh_accion_ck";
--> statement-breakpoint
ALTER TABLE "monitorista_historial" ADD CONSTRAINT "mh_accion_ck"
  CHECK (accion IN ('solicitud_vista','evidencia_subida','solicitud_completada','solicitud_cancelada',
                     'incidente_creado','incidente_editado','campo_editado','ppt_generado'));
--> statement-breakpoint
CREATE TABLE "formato_n_eventos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"fecha" date NOT NULL,
	"hora" time NOT NULL,
	"region" varchar(120) NOT NULL,
	"evento" varchar(200) NOT NULL,
	"ubicacion" varchar(300),
	"descripcion" text,
	"atenciones" varchar(300),
	"capturado_por" text NOT NULL,
	"creado_en" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "formato_n_fge" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"fecha" date NOT NULL,
	"periodo" varchar(10) NOT NULL,
	"capturado_por" text NOT NULL,
	"carpetas_iniciadas" integer DEFAULT 0 NOT NULL,
	"numero_cateos" integer DEFAULT 0 NOT NULL,
	"vehiculos_asegurados" integer DEFAULT 0 NOT NULL,
	"domicilios_cateados" integer DEFAULT 0 NOT NULL,
	"personas_aseguradas" integer DEFAULT 0 NOT NULL,
	"aprehensiones" integer DEFAULT 0 NOT NULL,
	"audiencias_iniciales" integer DEFAULT 0 NOT NULL,
	"abreviados" integer DEFAULT 0 NOT NULL,
	"audiencias_intermedias" integer DEFAULT 0 NOT NULL,
	"creado_en" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "fnf_periodo_ck" CHECK (periodo IN ('diario','semanal','mensual')),
	CONSTRAINT "fnf_fecha_periodo_uq" UNIQUE (fecha, periodo)
);
--> statement-breakpoint
CREATE TABLE "formato_n_fgr" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"fecha" date NOT NULL,
	"periodo" varchar(10) NOT NULL,
	"capturado_por" text NOT NULL,
	"carpetas_iniciadas" integer DEFAULT 0 NOT NULL,
	"numero_cateos" integer DEFAULT 0 NOT NULL,
	"vehiculos_asegurados" integer DEFAULT 0 NOT NULL,
	"domicilios_cateados" integer DEFAULT 0 NOT NULL,
	"personas_aseguradas" integer DEFAULT 0 NOT NULL,
	"aprehensiones" integer DEFAULT 0 NOT NULL,
	"audiencias_iniciales" integer DEFAULT 0 NOT NULL,
	"abreviados" integer DEFAULT 0 NOT NULL,
	"audiencias_intermedias" integer DEFAULT 0 NOT NULL,
	"creado_en" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "fng_periodo_ck" CHECK (periodo IN ('diario','semanal','mensual')),
	CONSTRAINT "fng_fecha_periodo_uq" UNIQUE (fecha, periodo)
);
--> statement-breakpoint
CREATE TABLE "formato_n_rnd" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"fecha" date NOT NULL,
	"hora_detencion" time NOT NULL,
	"delito" varchar(200) NOT NULL,
	"autoridad_que_realizo_detencion" varchar(200) NOT NULL,
	"folio" varchar(80) NOT NULL,
	"capturado_por" text NOT NULL,
	"creado_en" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "formato_n_medios_alternativos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"fecha" date NOT NULL,
	"periodo" varchar(10) NOT NULL,
	"capturado_por" text NOT NULL,
	"asuntos_canalizados_por_fiscalia" integer DEFAULT 0 NOT NULL,
	"acuerdos" integer DEFAULT 0 NOT NULL,
	"monto_reparacion_danos" numeric(14,2) DEFAULT 0 NOT NULL,
	"creado_en" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "fnma_periodo_ck" CHECK (periodo IN ('diario','semanal','mensual')),
	CONSTRAINT "fnma_fecha_periodo_uq" UNIQUE (fecha, periodo)
);
--> statement-breakpoint
CREATE TABLE "formato_n_atencion_victimas" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"fecha" date NOT NULL,
	"periodo" varchar(10) NOT NULL,
	"capturado_por" text NOT NULL,
	"numero_atenciones" integer DEFAULT 0 NOT NULL,
	"atenciones_medicas" integer DEFAULT 0 NOT NULL,
	"atenciones_psicologicas" integer DEFAULT 0 NOT NULL,
	"asesorias_juridicas" integer DEFAULT 0 NOT NULL,
	"observaciones" text,
	"creado_en" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "fnav_periodo_ck" CHECK (periodo IN ('diario','semanal','mensual')),
	CONSTRAINT "fnav_fecha_periodo_uq" UNIQUE (fecha, periodo)
);
--> statement-breakpoint
CREATE TABLE "formato_n_armas_aseguradas" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"fecha" date NOT NULL,
	"carpeta_investigacion" varchar(120),
	"tipo_arma" varchar(120) NOT NULL,
	"matricula" varchar(80),
	"calibre" varchar(40),
	"observaciones" text,
	"capturado_por" text NOT NULL,
	"creado_en" timestamp with time zone DEFAULT now() NOT NULL
);
