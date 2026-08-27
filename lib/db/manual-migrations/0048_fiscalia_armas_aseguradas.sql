CREATE TABLE IF NOT EXISTS "fiscalia_armas_aseguradas" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"reporte_campo_id" uuid NOT NULL,
	"tipo_arma" varchar(120) NOT NULL,
	"marca" varchar(120),
	"matricula" varchar(80),
	"calibre" varchar(40),
	"observaciones" text,
	"capturado_por" text NOT NULL,
	"creado_en" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "faa_reporte_campo_fk" FOREIGN KEY ("reporte_campo_id") REFERENCES "public"."ofi_reportes_campo"("id"),
	CONSTRAINT "faa_capturado_por_fk" FOREIGN KEY ("capturado_por") REFERENCES "public"."users"("id")
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "faa_reporte_campo_idx" ON "fiscalia_armas_aseguradas" ("reporte_campo_id");
--> statement-breakpoint
ALTER TABLE "formato_n_armas_aseguradas" ADD COLUMN IF NOT EXISTS "origen_fiscalia_arma_id" uuid;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "fnaa_origen_fiscalia_arma_uq" ON "formato_n_armas_aseguradas" ("origen_fiscalia_arma_id") WHERE "origen_fiscalia_arma_id" IS NOT NULL;
