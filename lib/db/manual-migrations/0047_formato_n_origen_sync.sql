ALTER TABLE "formato_n_eventos" ADD COLUMN IF NOT EXISTS "origen_incidente_id" uuid;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "fne_origen_incidente_uq" ON "formato_n_eventos" ("origen_incidente_id") WHERE "origen_incidente_id" IS NOT NULL;
--> statement-breakpoint
ALTER TABLE "formato_n_rnd" ADD COLUMN IF NOT EXISTS "origen_reporte_campo_id" uuid;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "fnrnd_origen_reporte_campo_uq" ON "formato_n_rnd" ("origen_reporte_campo_id") WHERE "origen_reporte_campo_id" IS NOT NULL;
