-- La tabla "permisos" vieja (rol_id+modulo_id) nunca se usó en runtime (0 filas, sin
-- referencias en el código). Se libera el nombre para el sistema nuevo, que arranca
-- scoped a monitorista (usuario_id+seccion) pero está pensado para crecer a todas las
-- secciones del sistema más adelante.
DROP TABLE IF EXISTS "permisos";
--> statement-breakpoint
ALTER TABLE "monitorista_permisos" RENAME TO "permisos";
--> statement-breakpoint
ALTER TABLE "permisos" RENAME CONSTRAINT "mp_seccion_ck" TO "permisos_seccion_ck";
--> statement-breakpoint
ALTER TABLE "permisos" RENAME CONSTRAINT "mp_usuario_seccion_uq" TO "permisos_usuario_seccion_uq";
--> statement-breakpoint
ALTER TABLE "permisos" RENAME CONSTRAINT "monitorista_permisos_pkey" TO "permisos_pkey";
--> statement-breakpoint
ALTER TABLE "permisos" RENAME CONSTRAINT "monitorista_permisos_usuario_id_fkey" TO "permisos_usuario_id_fkey";
