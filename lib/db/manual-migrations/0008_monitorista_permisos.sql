CREATE TABLE "monitorista_permisos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"usuario_id" text NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
	"seccion" varchar(30) NOT NULL,
	"puede_ver" boolean DEFAULT true NOT NULL,
	"puede_crear" boolean DEFAULT true NOT NULL,
	"puede_editar" boolean DEFAULT true NOT NULL,
	"creado_en" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "mp_seccion_ck" CHECK (seccion IN ('solicitudes','detenidos','incidentes_camara','historial')),
	CONSTRAINT "mp_usuario_seccion_uq" UNIQUE (usuario_id, seccion)
);
