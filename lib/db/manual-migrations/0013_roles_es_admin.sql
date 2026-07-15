-- Marca en BD qué rol tiene acceso total al sistema, en vez de comparar el
-- nombre del rol ("Administrador") en el código en cada chequeo de permisos.
ALTER TABLE "roles" ADD COLUMN IF NOT EXISTS "es_admin" boolean DEFAULT false NOT NULL;
--> statement-breakpoint
UPDATE "roles" SET "es_admin" = true WHERE "nombre" = 'Administrador';
