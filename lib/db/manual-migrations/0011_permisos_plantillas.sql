-- Plantilla de permisos por rol: al asignarle un rol a un usuario (alta o edición),
-- se copian estos valores default a su fila en "permisos" — evita configurar
-- manualmente cada usuario nuevo con el mismo rol.
CREATE TABLE "permisos_plantillas" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"rol_id" integer NOT NULL REFERENCES "roles"("id") ON DELETE CASCADE,
	"seccion" varchar(30) NOT NULL,
	"puede_ver" boolean DEFAULT true NOT NULL,
	"puede_crear" boolean DEFAULT true NOT NULL,
	"puede_editar" boolean DEFAULT true NOT NULL,
	"creado_en" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "permisos_plantillas_rol_seccion_uq" UNIQUE (rol_id, seccion)
);
