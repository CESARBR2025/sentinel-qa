CREATE TABLE IF NOT EXISTS "formato_n_reportes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"fecha" date NOT NULL,
	"periodo" varchar(10) NOT NULL,
	"capturado_por" text NOT NULL,
	"observaciones_generales" text,
	"creado_en" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "fnr_periodo_ck" CHECK (periodo IN ('diario','semanal','mensual')),
	CONSTRAINT "fnr_fecha_periodo_uq" UNIQUE (fecha, periodo)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "formato_n_eventos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"reporte_id" uuid NOT NULL,
	"hora" time NOT NULL,
	"region" varchar(120) NOT NULL,
	"evento" varchar(200) NOT NULL,
	"ubicacion" varchar(300),
	"descripcion" text,
	"atenciones" varchar(300)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "formato_n_fge" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"reporte_id" uuid NOT NULL UNIQUE,
	"carpetas_iniciadas" integer DEFAULT 0 NOT NULL,
	"numero_cateos" integer DEFAULT 0 NOT NULL,
	"vehiculos_asegurados" integer DEFAULT 0 NOT NULL,
	"domicilios_cateados" integer DEFAULT 0 NOT NULL,
	"personas_aseguradas" integer DEFAULT 0 NOT NULL,
	"aprehensiones" integer DEFAULT 0 NOT NULL,
	"audiencias_iniciales" integer DEFAULT 0 NOT NULL,
	"abreviados" integer DEFAULT 0 NOT NULL,
	"audiencias_intermedias" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "formato_n_fgr" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"reporte_id" uuid NOT NULL UNIQUE,
	"carpetas_iniciadas" integer DEFAULT 0 NOT NULL,
	"numero_cateos" integer DEFAULT 0 NOT NULL,
	"vehiculos_asegurados" integer DEFAULT 0 NOT NULL,
	"domicilios_cateados" integer DEFAULT 0 NOT NULL,
	"personas_aseguradas" integer DEFAULT 0 NOT NULL,
	"aprehensiones" integer DEFAULT 0 NOT NULL,
	"audiencias_iniciales" integer DEFAULT 0 NOT NULL,
	"abreviados" integer DEFAULT 0 NOT NULL,
	"audiencias_intermedias" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "formato_n_rnd" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"reporte_id" uuid NOT NULL,
	"hora_detencion" time NOT NULL,
	"delito" varchar(200) NOT NULL,
	"autoridad_que_realizo_detencion" varchar(200) NOT NULL,
	"folio" varchar(80) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "formato_n_medios_alternativos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"reporte_id" uuid NOT NULL UNIQUE,
	"asuntos_canalizados_por_fiscalia" integer DEFAULT 0 NOT NULL,
	"acuerdos" integer DEFAULT 0 NOT NULL,
	"monto_reparacion_danos" numeric(14,2) DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "formato_n_atencion_victimas" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"reporte_id" uuid NOT NULL UNIQUE,
	"numero_atenciones" integer DEFAULT 0 NOT NULL,
	"atenciones_medicas" integer DEFAULT 0 NOT NULL,
	"atenciones_psicologicas" integer DEFAULT 0 NOT NULL,
	"asesorias_juridicas" integer DEFAULT 0 NOT NULL,
	"observaciones" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "formato_n_armas_aseguradas" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"reporte_id" uuid NOT NULL,
	"carpeta_investigacion" varchar(120),
	"tipo_arma" varchar(120) NOT NULL,
	"matricula" varchar(80),
	"calibre" varchar(40),
	"observaciones" text
);
--> statement-breakpoint
ALTER TABLE "formato_n_eventos" ADD CONSTRAINT "fne_reporte_fk" FOREIGN KEY ("reporte_id") REFERENCES "public"."formato_n_reportes"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "formato_n_fge" ADD CONSTRAINT "fnf_reporte_fk" FOREIGN KEY ("reporte_id") REFERENCES "public"."formato_n_reportes"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "formato_n_fgr" ADD CONSTRAINT "fng_reporte_fk" FOREIGN KEY ("reporte_id") REFERENCES "public"."formato_n_reportes"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "formato_n_rnd" ADD CONSTRAINT "fnrnd_reporte_fk" FOREIGN KEY ("reporte_id") REFERENCES "public"."formato_n_reportes"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "formato_n_medios_alternativos" ADD CONSTRAINT "fnma_reporte_fk" FOREIGN KEY ("reporte_id") REFERENCES "public"."formato_n_reportes"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "formato_n_atencion_victimas" ADD CONSTRAINT "fnav_reporte_fk" FOREIGN KEY ("reporte_id") REFERENCES "public"."formato_n_reportes"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "formato_n_armas_aseguradas" ADD CONSTRAINT "fnaa_reporte_fk" FOREIGN KEY ("reporte_id") REFERENCES "public"."formato_n_reportes"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "monitorista_historial" DROP CONSTRAINT IF EXISTS "mh_accion_ck";
--> statement-breakpoint
ALTER TABLE "monitorista_historial" ADD CONSTRAINT "mh_accion_ck"
  CHECK (accion IN ('solicitud_vista','evidencia_subida','solicitud_completada','solicitud_cancelada',
                     'incidente_creado','incidente_editado','campo_editado','ppt_generado',
                     'formato_n_creado','formato_n_editado'));
