-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE "usuario_modulos" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"modulo_id" integer NOT NULL,
	"puede_ver" boolean DEFAULT true NOT NULL,
	CONSTRAINT "usuario_modulos_user_id_modulo_id_unique" UNIQUE("user_id","modulo_id")
);
--> statement-breakpoint
CREATE TABLE "modulos" (
	"id" serial PRIMARY KEY NOT NULL,
	"clave" varchar(80) NOT NULL,
	"nombre" varchar(100) NOT NULL,
	"ruta" varchar(255),
	"icono" varchar(60),
	"padre_id" integer,
	"orden" integer DEFAULT 0 NOT NULL,
	"activo" boolean DEFAULT true NOT NULL,
	CONSTRAINT "modulos_clave_unique" UNIQUE("clave")
);
--> statement-breakpoint
CREATE TABLE "roles" (
	"id" serial PRIMARY KEY NOT NULL,
	"nombre" varchar(60) NOT NULL,
	"descripcion" text,
	"activo" boolean DEFAULT true NOT NULL,
	"creado_en" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "roles_nombre_unique" UNIQUE("nombre")
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	CONSTRAINT "sessions_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"apellido" varchar(100) DEFAULT '' NOT NULL,
	"email" varchar(255) NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"rol_id" integer,
	"activo" boolean DEFAULT true NOT NULL,
	"two_factor_enabled" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"dependencia_id" integer,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "two_factors" (
	"id" text PRIMARY KEY NOT NULL,
	"secret" text NOT NULL,
	"backup_codes" text NOT NULL,
	"user_id" text NOT NULL,
	"verified" boolean DEFAULT false,
	CONSTRAINT "two_factors_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "verifications" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "accounts" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
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
CREATE TABLE "cat_turnos" (
	"id" serial PRIMARY KEY NOT NULL,
	"nombre" varchar(40) NOT NULL,
	"hora_inicio" time NOT NULL,
	"hora_fin" time NOT NULL,
	"activo" boolean DEFAULT true NOT NULL,
	CONSTRAINT "cat_turnos_nombre_uq" UNIQUE("nombre")
);
--> statement-breakpoint
CREATE TABLE "contestaciones" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"solicitud_id" uuid NOT NULL,
	"fecha_contestacion" date NOT NULL,
	"archivo_pdf_url" varchar(500),
	"fecha_entrega" date,
	"hora_entrega" varchar(10),
	"nombre_quien_recibio" varchar(200),
	"creado_por" text,
	"creado_en" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "contestaciones_solicitud_id_unique" UNIQUE("solicitud_id")
);
--> statement-breakpoint
CREATE TABLE "solicitudes_c4_internas" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"solicitud_id" uuid NOT NULL,
	"descripcion_evidencias" text NOT NULL,
	"status" varchar(50) DEFAULT 'pendiente' NOT NULL,
	"creado_por" text,
	"creado_en" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "visitas_domiciliarias" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"medida_id" uuid NOT NULL,
	"fecha_visita" date NOT NULL,
	"hora_visita" varchar(10) NOT NULL,
	"resultado" text,
	"apercibimiento_aplicado" boolean DEFAULT false,
	"registrado_por" text,
	"creado_en" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "seguimientos_busqueda" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"ficha_id" uuid NOT NULL,
	"tipo" varchar(50) NOT NULL,
	"fecha_hora_envio" timestamp NOT NULL,
	"registrado_por" text,
	"creado_en" timestamp DEFAULT now() NOT NULL,
	"archivo_url" varchar(500)
);
--> statement-breakpoint
CREATE TABLE "solicitudes_informacion" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"enlace" varchar(200),
	"oficio" varchar(200) NOT NULL,
	"fecha_activacion" timestamp NOT NULL,
	"autoridad" varchar(50) NOT NULL,
	"fiscal_solicita" varchar(200),
	"delito" varchar(300),
	"carpeta_investigacion" varchar(200),
	"solicitud_texto" text,
	"fecha_aceptacion" timestamp,
	"status" varchar(50) DEFAULT 'nuevo' NOT NULL,
	"creado_por" text,
	"creado_en" timestamp DEFAULT now() NOT NULL,
	"actualizado_en" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "fichas_busqueda" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tipo" varchar(50) NOT NULL,
	"folio" varchar(100),
	"enlace" varchar(200),
	"fecha_activacion" timestamp NOT NULL,
	"carpeta_investigacion" varchar(200),
	"nombre_desaparecida" varchar(300) NOT NULL,
	"edad" integer,
	"fecha_aceptacion" timestamp,
	"rt_atiende" varchar(200),
	"elemento_novedades" varchar(200),
	"status" varchar(50) DEFAULT 'activa' NOT NULL,
	"fecha_cancelacion" timestamp,
	"fiscal_cancela" varchar(200),
	"motivo_cancelacion" text,
	"creado_por" text,
	"creado_en" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "medidas_proteccion" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"expediente" varchar(100) NOT NULL,
	"n_oficio" varchar(100) NOT NULL,
	"fecha_oficio" date NOT NULL,
	"fecha_recepcion" date NOT NULL,
	"persona_recepciona" varchar(200) NOT NULL,
	"autoridad" varchar(50) NOT NULL,
	"nombre_autoridad" varchar(200),
	"delitos" text,
	"victima" varchar(300) NOT NULL,
	"demandado" varchar(300),
	"tipo_medida" varchar(300),
	"domicilio_proteccion" text NOT NULL,
	"colonia" varchar(200),
	"telefono" varchar(20),
	"tiempo_medida" varchar(200),
	"fecha_vencimiento" date,
	"tipo_apercibimiento" varchar(200),
	"enlace" varchar(200),
	"observaciones" text,
	"status" varchar(50) DEFAULT 'activa' NOT NULL,
	"creado_por" text,
	"creado_en" timestamp DEFAULT now() NOT NULL,
	"actualizado_en" timestamp DEFAULT now() NOT NULL,
	"prorrogada" boolean DEFAULT false NOT NULL,
	"archivo_prorroga_url" varchar(500)
);
--> statement-breakpoint
CREATE TABLE "medida_autoridades_adicionales" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"medida_id" uuid NOT NULL,
	"autoridad" varchar(50) NOT NULL,
	"n_oficio" varchar(100),
	"fecha_oficio" date,
	"creado_por" text,
	"creado_en" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notificaciones" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"tipo" varchar(100) NOT NULL,
	"titulo" varchar(300) NOT NULL,
	"mensaje" text NOT NULL,
	"href" varchar(500),
	"leida" boolean DEFAULT false NOT NULL,
	"ficha_id" uuid,
	"hito" varchar(50),
	"creado_en" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "notificaciones_user_id_ficha_id_hito_unique" UNIQUE("user_id","ficha_id","hito")
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
CREATE TABLE "cat_origenes_evento" (
	"id" serial PRIMARY KEY NOT NULL,
	"clave" varchar(30) NOT NULL,
	"nombre" varchar(80) NOT NULL,
	"activo" boolean DEFAULT true NOT NULL,
	CONSTRAINT "cat_origenes_evento_clave_uq" UNIQUE("clave")
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
ALTER TABLE "usuario_modulos" ADD CONSTRAINT "usuario_modulos_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "usuario_modulos" ADD CONSTRAINT "usuario_modulos_modulo_id_modulos_id_fk" FOREIGN KEY ("modulo_id") REFERENCES "public"."modulos"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_rol_id_roles_id_fk" FOREIGN KEY ("rol_id") REFERENCES "public"."roles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_dependencia_id_fk" FOREIGN KEY ("dependencia_id") REFERENCES "public"."cat_dependencias"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "two_factors" ADD CONSTRAINT "two_factors_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contestaciones" ADD CONSTRAINT "contestaciones_solicitud_id_solicitudes_informacion_id_fk" FOREIGN KEY ("solicitud_id") REFERENCES "public"."solicitudes_informacion"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contestaciones" ADD CONSTRAINT "contestaciones_creado_por_users_id_fk" FOREIGN KEY ("creado_por") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "solicitudes_c4_internas" ADD CONSTRAINT "solicitudes_c4_internas_creado_por_users_id_fk" FOREIGN KEY ("creado_por") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "solicitudes_c4_internas" ADD CONSTRAINT "solicitudes_c4_internas_solicitud_id_solicitudes_informacion_id" FOREIGN KEY ("solicitud_id") REFERENCES "public"."solicitudes_informacion"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "visitas_domiciliarias" ADD CONSTRAINT "visitas_domiciliarias_medida_id_medidas_proteccion_id_fk" FOREIGN KEY ("medida_id") REFERENCES "public"."medidas_proteccion"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "visitas_domiciliarias" ADD CONSTRAINT "visitas_domiciliarias_registrado_por_users_id_fk" FOREIGN KEY ("registrado_por") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "seguimientos_busqueda" ADD CONSTRAINT "seguimientos_busqueda_ficha_id_fichas_busqueda_id_fk" FOREIGN KEY ("ficha_id") REFERENCES "public"."fichas_busqueda"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "seguimientos_busqueda" ADD CONSTRAINT "seguimientos_busqueda_registrado_por_users_id_fk" FOREIGN KEY ("registrado_por") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "solicitudes_informacion" ADD CONSTRAINT "solicitudes_informacion_creado_por_users_id_fk" FOREIGN KEY ("creado_por") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fichas_busqueda" ADD CONSTRAINT "fichas_busqueda_creado_por_users_id_fk" FOREIGN KEY ("creado_por") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "medidas_proteccion" ADD CONSTRAINT "medidas_proteccion_creado_por_users_id_fk" FOREIGN KEY ("creado_por") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "medida_autoridades_adicionales" ADD CONSTRAINT "medida_autoridades_adicionales_creado_por_users_id_fk" FOREIGN KEY ("creado_por") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "medida_autoridades_adicionales" ADD CONSTRAINT "medida_autoridades_adicionales_medida_id_medidas_proteccion_id_" FOREIGN KEY ("medida_id") REFERENCES "public"."medidas_proteccion"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notificaciones" ADD CONSTRAINT "notificaciones_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notificaciones" ADD CONSTRAINT "notificaciones_ficha_id_fichas_busqueda_id_fk" FOREIGN KEY ("ficha_id") REFERENCES "public"."fichas_busqueda"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "permisos" ADD CONSTRAINT "permisos_rol_id_fk" FOREIGN KEY ("rol_id") REFERENCES "public"."roles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "permisos" ADD CONSTRAINT "permisos_modulo_id_fk" FOREIGN KEY ("modulo_id") REFERENCES "public"."modulos"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "eventos" ADD CONSTRAINT "eventos_origen_id_fk" FOREIGN KEY ("origen_id") REFERENCES "public"."cat_origenes_evento"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "eventos" ADD CONSTRAINT "eventos_tipo_incidente_id_fk" FOREIGN KEY ("tipo_incidente_id") REFERENCES "public"."cat_tipos_incidente"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "eventos" ADD CONSTRAINT "eventos_prioridad_id_fk" FOREIGN KEY ("prioridad_id") REFERENCES "public"."cat_prioridades"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "eventos" ADD CONSTRAINT "eventos_estatus_id_fk" FOREIGN KEY ("estatus_id") REFERENCES "public"."cat_estatus_evento"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "eventos" ADD CONSTRAINT "eventos_turno_id_fk" FOREIGN KEY ("turno_id") REFERENCES "public"."cat_turnos"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "eventos" ADD CONSTRAINT "eventos_creado_por_fk" FOREIGN KEY ("creado_por") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
*/