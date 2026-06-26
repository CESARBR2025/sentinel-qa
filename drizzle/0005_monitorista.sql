CREATE TABLE IF NOT EXISTS "solicitudes_evidencia" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"incidente_id" uuid NOT NULL,
	"folio_incidente" varchar(60),
	"solicitado_por" text NOT NULL,
	"solicitado_nombre" varchar(200),
	"descripcion" text NOT NULL,
	"status" varchar(20) DEFAULT 'pendiente' NOT NULL,
	"creado_en" timestamp with time zone DEFAULT now() NOT NULL,
	"completado_en" timestamp with time zone,
	CONSTRAINT "se_status_ck" CHECK (status IN ('pendiente','completada','cancelada'))
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "evidencias" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"solicitud_id" uuid NOT NULL,
	"incidente_id" uuid NOT NULL,
	"tipo" varchar(20) NOT NULL,
	"nombre_original" varchar(300),
	"url_expediente" varchar(500) NOT NULL,
	"subido_por" text NOT NULL,
	"creado_en" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "ev_tipo_ck" CHECK (tipo IN ('foto','video','documento'))
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "monitorista_historial" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"monitorista_id" text NOT NULL,
	"accion" varchar(50) NOT NULL,
	"solicitud_id" uuid,
	"incidente_id" uuid,
	"creado_en" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "mh_accion_ck" CHECK (accion IN ('solicitud_vista','evidencia_subida','solicitud_completada','solicitud_cancelada'))
);
--> statement-breakpoint
ALTER TABLE "evidencias" ADD CONSTRAINT "ev_solicitud_fk" FOREIGN KEY ("solicitud_id") REFERENCES "public"."solicitudes_evidencia"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "evidencias" ADD CONSTRAINT "ev_subido_por_fk" FOREIGN KEY ("subido_por") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "monitorista_historial" ADD CONSTRAINT "mh_monitorista_fk" FOREIGN KEY ("monitorista_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "monitorista_historial" ADD CONSTRAINT "mh_solicitud_fk" FOREIGN KEY ("solicitud_id") REFERENCES "public"."solicitudes_evidencia"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "solicitudes_evidencia" ADD CONSTRAINT "se_solicitado_por_fk" FOREIGN KEY ("solicitado_por") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
