CREATE TABLE "cat_body_cams" (
	"id" serial PRIMARY KEY NOT NULL,
	"codigo" varchar(30) NOT NULL,
	"estado" varchar(20) DEFAULT 'operativo' NOT NULL,
	"activo" boolean DEFAULT true NOT NULL,
	"creado_en" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "cat_body_cams_codigo_uq" UNIQUE("codigo")
);
--> statement-breakpoint
CREATE TABLE "cat_dependencias" (
	"id" serial PRIMARY KEY NOT NULL,
	"clave" varchar(30) NOT NULL,
	"nombre" varchar(150) NOT NULL,
	"tipo" varchar(20) NOT NULL,
	"activo" boolean DEFAULT true NOT NULL,
	"creado_en" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "cat_dependencias_clave_uq" UNIQUE("clave"),
	CONSTRAINT "cat_dependencias_tipo_ck" CHECK ((tipo)::text = ANY ((ARRAY['interna'::character varying, 'externa'::character varying])::text[]))
);
--> statement-breakpoint
CREATE TABLE "cat_estado_fuerza_conceptos" (
	"id" serial PRIMARY KEY NOT NULL,
	"nombre" varchar(100) NOT NULL,
	"codigo" varchar(40) NOT NULL,
	"grupo" varchar(40),
	"orden" integer DEFAULT 0 NOT NULL,
	"activo" boolean DEFAULT true NOT NULL,
	"creado_en" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "cat_estado_fuerza_conceptos_codigo_uq" UNIQUE("codigo")
);
--> statement-breakpoint
CREATE TABLE "cat_estatus_evento" (
	"id" serial PRIMARY KEY NOT NULL,
	"clave" varchar(30) NOT NULL,
	"nombre" varchar(60) NOT NULL,
	"descripcion" text,
	"area_responsable" varchar(80),
	"orden" integer NOT NULL,
	"es_estado_final" boolean DEFAULT false NOT NULL,
	"activo" boolean DEFAULT true NOT NULL,
	CONSTRAINT "cat_estatus_evento_clave_uq" UNIQUE("clave")
);
--> statement-breakpoint
CREATE TABLE "cat_origenes_evento" (
	"id" serial PRIMARY KEY NOT NULL,
	"clave" varchar(30) NOT NULL,
	"nombre" varchar(80) NOT NULL,
	"activo" boolean DEFAULT true NOT NULL,
	CONSTRAINT "cat_origenes_evento_clave_uq" UNIQUE("clave")
);
--> statement-breakpoint
CREATE TABLE "cat_prioridades" (
	"id" serial PRIMARY KEY NOT NULL,
	"clave" varchar(20) NOT NULL,
	"nombre" varchar(40) NOT NULL,
	"orden" integer NOT NULL,
	"activo" boolean DEFAULT true NOT NULL,
	CONSTRAINT "cat_prioridades_clave_uq" UNIQUE("clave")
);
--> statement-breakpoint
CREATE TABLE "cat_radios" (
	"id" serial PRIMARY KEY NOT NULL,
	"codigo" varchar(30) NOT NULL,
	"tipo" varchar(40),
	"estado" varchar(20) DEFAULT 'operativo' NOT NULL,
	"activo" boolean DEFAULT true NOT NULL,
	"creado_en" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "cat_radios_codigo_uq" UNIQUE("codigo")
);
--> statement-breakpoint
CREATE TABLE "cat_sectores" (
	"id" serial PRIMARY KEY NOT NULL,
	"nombre" varchar(100) NOT NULL,
	"clave" varchar(30) NOT NULL,
	"activo" boolean DEFAULT true NOT NULL,
	"creado_en" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "cat_sectores_clave_uq" UNIQUE("clave")
);
--> statement-breakpoint
CREATE TABLE "cat_tipos_incidente" (
	"id" serial PRIMARY KEY NOT NULL,
	"clave" varchar(30) NOT NULL,
	"nombre" varchar(150) NOT NULL,
	"clasificacion_cad" varchar(100),
	"activo" boolean DEFAULT true NOT NULL,
	"creado_en" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "cat_tipos_incidente_clave_uq" UNIQUE("clave")
);
--> statement-breakpoint
CREATE TABLE "cat_tipos_observacion" (
	"id" serial PRIMARY KEY NOT NULL,
	"nombre" varchar(100) NOT NULL,
	"codigo" varchar(40) NOT NULL,
	"activo" boolean DEFAULT true NOT NULL,
	"creado_en" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "cat_tipos_observacion_codigo_uq" UNIQUE("codigo")
);
--> statement-breakpoint
CREATE TABLE "cat_turnos" (
	"id" serial PRIMARY KEY NOT NULL,
	"nombre" varchar(40) NOT NULL,
	"hora_inicio" time NOT NULL,
	"hora_fin" time NOT NULL,
	"activo" boolean DEFAULT true NOT NULL,
	CONSTRAINT "cat_turnos_nombre_uq" UNIQUE("nombre")
);
--> statement-breakpoint
CREATE TABLE "eventos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"folio_cad" varchar(60) NOT NULL,
	"origen_id" integer NOT NULL,
	"tipo_incidente_id" integer NOT NULL,
	"prioridad_id" integer NOT NULL,
	"estatus_id" integer DEFAULT 1 NOT NULL,
	"turno_id" integer,
	"descripcion_inicial" text NOT NULL,
	"nombre_reportante" varchar(200),
	"telefono_reportante" varchar(20),
	"calle" varchar(200) NOT NULL,
	"numero_ext" varchar(20),
	"colonia" varchar(150),
	"municipio" varchar(100) DEFAULT 'San Juan del Río' NOT NULL,
	"referencias" text,
	"fecha_hora_reporte" timestamp with time zone DEFAULT now() NOT NULL,
	"fecha_hora_cierre" timestamp with time zone,
	"creado_por" text NOT NULL,
	"creado_en" timestamp with time zone DEFAULT now() NOT NULL,
	"actualizado_en" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "eventos_folio_cad_uq" UNIQUE("folio_cad")
);
--> statement-breakpoint
CREATE TABLE "permisos" (
	"id" serial PRIMARY KEY NOT NULL,
	"rol_id" integer NOT NULL,
	"modulo_id" integer NOT NULL,
	"puede_ver" boolean DEFAULT false NOT NULL,
	"puede_crear" boolean DEFAULT false NOT NULL,
	"puede_editar" boolean DEFAULT false NOT NULL,
	"puede_eliminar" boolean DEFAULT false NOT NULL,
	CONSTRAINT "permisos_rol_modulo_uq" UNIQUE("rol_id","modulo_id")
);
--> statement-breakpoint
CREATE TABLE "rol_asignaciones" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"rol_id" uuid NOT NULL,
	"seccion" varchar(20) NOT NULL,
	"unidad_ext_id" varchar(100),
	"unidad_placa" varchar(30),
	"elemento_ext_id" varchar(100),
	"elemento_nomina" varchar(40),
	"elemento_nombre" varchar(200),
	"zona" varchar(200),
	"servicio" varchar(200),
	"radio_id" integer,
	"body_cam_id" integer,
	"orden" integer DEFAULT 0 NOT NULL,
	"creado_en" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "rol_estado_fuerza" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"rol_id" uuid NOT NULL,
	"concepto_id" integer NOT NULL,
	"cantidad" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "rol_estado_fuerza_rol_concepto_uq" UNIQUE("rol_id","concepto_id")
);
--> statement-breakpoint
CREATE TABLE "rol_observaciones" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"rol_id" uuid NOT NULL,
	"tipo_id" integer NOT NULL,
	"descripcion" text,
	"creado_en" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "roles_servicio" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"folio" varchar(100) NOT NULL,
	"folio_consecutivo" integer NOT NULL,
	"turno" varchar(20) NOT NULL,
	"horario_inicio" time,
	"horario_fin" time,
	"responsable_turno" varchar(200),
	"sector_id" integer,
	"fecha" date NOT NULL,
	"fundamento_legal" text,
	"status" varchar(20) DEFAULT 'borrador' NOT NULL,
	"firma_responsable_url" varchar(500),
	"firma_jefe_sectorial_url" varchar(500),
	"firmado_por" text,
	"firmado_en" timestamp,
	"creado_por" text,
	"creado_en" timestamp DEFAULT now() NOT NULL,
	"actualizado_en" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "roles_servicio_folio_uq" UNIQUE("folio")
);
--> statement-breakpoint
ALTER TABLE "medida_autoridades_adicionales" DROP CONSTRAINT "medida_autoridades_adicionales_medida_id_medidas_proteccion_id_fk";
--> statement-breakpoint
ALTER TABLE "solicitudes_c4_internas" DROP CONSTRAINT "solicitudes_c4_internas_solicitud_id_solicitudes_informacion_id_fk";
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "dependencia_id" integer;--> statement-breakpoint
ALTER TABLE "eventos" ADD CONSTRAINT "eventos_origen_id_fk" FOREIGN KEY ("origen_id") REFERENCES "public"."cat_origenes_evento"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "eventos" ADD CONSTRAINT "eventos_tipo_incidente_id_fk" FOREIGN KEY ("tipo_incidente_id") REFERENCES "public"."cat_tipos_incidente"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "eventos" ADD CONSTRAINT "eventos_prioridad_id_fk" FOREIGN KEY ("prioridad_id") REFERENCES "public"."cat_prioridades"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "eventos" ADD CONSTRAINT "eventos_estatus_id_fk" FOREIGN KEY ("estatus_id") REFERENCES "public"."cat_estatus_evento"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "eventos" ADD CONSTRAINT "eventos_turno_id_fk" FOREIGN KEY ("turno_id") REFERENCES "public"."cat_turnos"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "eventos" ADD CONSTRAINT "eventos_creado_por_fk" FOREIGN KEY ("creado_por") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "permisos" ADD CONSTRAINT "permisos_rol_id_fk" FOREIGN KEY ("rol_id") REFERENCES "public"."roles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "permisos" ADD CONSTRAINT "permisos_modulo_id_fk" FOREIGN KEY ("modulo_id") REFERENCES "public"."modulos"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rol_asignaciones" ADD CONSTRAINT "rol_asignaciones_rol_id_fk" FOREIGN KEY ("rol_id") REFERENCES "public"."roles_servicio"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rol_asignaciones" ADD CONSTRAINT "rol_asignaciones_radio_id_fk" FOREIGN KEY ("radio_id") REFERENCES "public"."cat_radios"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rol_asignaciones" ADD CONSTRAINT "rol_asignaciones_body_cam_id_fk" FOREIGN KEY ("body_cam_id") REFERENCES "public"."cat_body_cams"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rol_estado_fuerza" ADD CONSTRAINT "rol_estado_fuerza_rol_id_fk" FOREIGN KEY ("rol_id") REFERENCES "public"."roles_servicio"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rol_estado_fuerza" ADD CONSTRAINT "rol_estado_fuerza_concepto_id_fk" FOREIGN KEY ("concepto_id") REFERENCES "public"."cat_estado_fuerza_conceptos"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rol_observaciones" ADD CONSTRAINT "rol_observaciones_rol_id_fk" FOREIGN KEY ("rol_id") REFERENCES "public"."roles_servicio"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rol_observaciones" ADD CONSTRAINT "rol_observaciones_tipo_id_fk" FOREIGN KEY ("tipo_id") REFERENCES "public"."cat_tipos_observacion"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "roles_servicio" ADD CONSTRAINT "roles_servicio_sector_id_fk" FOREIGN KEY ("sector_id") REFERENCES "public"."cat_sectores"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "roles_servicio" ADD CONSTRAINT "roles_servicio_firmado_por_fk" FOREIGN KEY ("firmado_por") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "roles_servicio" ADD CONSTRAINT "roles_servicio_creado_por_fk" FOREIGN KEY ("creado_por") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "medida_autoridades_adicionales" ADD CONSTRAINT "medida_autoridades_adicionales_medida_id_medidas_proteccion_id_" FOREIGN KEY ("medida_id") REFERENCES "public"."medidas_proteccion"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "solicitudes_c4_internas" ADD CONSTRAINT "solicitudes_c4_internas_solicitud_id_solicitudes_informacion_id" FOREIGN KEY ("solicitud_id") REFERENCES "public"."solicitudes_informacion"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_dependencia_id_fk" FOREIGN KEY ("dependencia_id") REFERENCES "public"."cat_dependencias"("id") ON DELETE no action ON UPDATE no action;