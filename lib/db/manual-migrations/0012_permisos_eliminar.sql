-- 4ta acción universal (además de ver/crear/editar). Default true = nadie pierde
-- acceso hasta que un admin explícitamente lo desmarque.
ALTER TABLE "permisos" ADD COLUMN IF NOT EXISTS "puede_eliminar" boolean DEFAULT true NOT NULL;
--> statement-breakpoint
ALTER TABLE "permisos_plantillas" ADD COLUMN IF NOT EXISTS "puede_eliminar" boolean DEFAULT true NOT NULL;
