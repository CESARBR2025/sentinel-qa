CREATE TABLE "audit_log" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"accion" varchar(50) NOT NULL,
	"entidad" varchar(80) NOT NULL,
	"entidad_id" text NOT NULL,
	"payload" text,
	"ip" varchar(45),
	"user_agent" text,
	"creado_en" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cat_medios_canalizacion" (
	"id" serial PRIMARY KEY NOT NULL,
	"clave" varchar(30) NOT NULL,
	"nombre" varchar(150) NOT NULL,
	"activo" boolean DEFAULT true NOT NULL,
	"creado_en" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "cat_medios_canalizacion_clave_uq" UNIQUE("clave")
);
--> statement-breakpoint
CREATE TABLE "cat_tipos_emergencia" (
	"id" serial PRIMARY KEY NOT NULL,
	"clave" varchar(30) NOT NULL,
	"nombre" varchar(150) NOT NULL,
	"activo" boolean DEFAULT true NOT NULL,
	"creado_en" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "cat_tipos_emergencia_clave_uq" UNIQUE("clave")
);
--> statement-breakpoint
CREATE TABLE "incidente_alarma_escolar" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"incidente_id" uuid NOT NULL,
	"establecimiento" varchar(200),
	"direccion" varchar(300),
	"inmueble" varchar(200),
	"responsable" varchar(200),
	"reporte_descripcion" text,
	"hora_canalizacion" varchar(10),
	"unidad_arribo" varchar(100),
	"hora_arribo" varchar(10),
	"nombre_responsable" varchar(200),
	"nombre_verificador" varchar(200),
	"activaciones" integer DEFAULT 0 NOT NULL,
	"creado_en" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "incidente_alarma_escolar_incidente_uq" UNIQUE("incidente_id")
);
--> statement-breakpoint
CREATE TABLE "incidente_despacho" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"incidente_id" uuid NOT NULL,
	"fecha_hora_despacho" timestamp with time zone DEFAULT now() NOT NULL,
	"despachado_por" text NOT NULL,
	"creado_en" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "incidente_despacho_incidente_uq" UNIQUE("incidente_id")
);
--> statement-breakpoint
CREATE TABLE "incidente_despacho_elementos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"despacho_id" uuid NOT NULL,
	"elemento_ext_id" varchar(100),
	"elemento_nomina" varchar(40),
	"elemento_nombre" varchar(200),
	"creado_en" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "incidente_despacho_unidades" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"despacho_id" uuid NOT NULL,
	"unidad_ext_id" varchar(100),
	"unidad_placa" varchar(30),
	"creado_en" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "incidente_extorsion" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"incidente_id" uuid NOT NULL,
	"telefono_extorsion" varchar(30),
	"grupo_delictivo" varchar(200),
	"modus_operandi" text,
	"unidad_resultado" varchar(100),
	"folio_reporte" varchar(100),
	"fecha" date,
	"creado_en" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "incidente_extorsion_incidente_uq" UNIQUE("incidente_id")
);
--> statement-breakpoint
CREATE TABLE "incidente_personas_afectadas" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"incidente_id" uuid NOT NULL,
	"nombre" varchar(300),
	"sexo" varchar(10),
	"edad" integer,
	"creado_en" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "ipa_sexo_ck" CHECK (sexo IN ('M','F','NE') OR sexo IS NULL)
);
--> statement-breakpoint
CREATE TABLE "incidente_reporte_campo" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"incidente_id" uuid NOT NULL,
	"contenido_reporte" text,
	"lugar_calle" varchar(200),
	"lugar_colonia" varchar(150),
	"lugar_entre_calles" varchar(200),
	"lugar_referencia" varchar(300),
	"datos_positivos_negativos" text,
	"acciones_realizadas" text,
	"hay_detencion" boolean DEFAULT false NOT NULL,
	"nombre_detenidos" text,
	"autoridad_recibe" varchar(200),
	"expediente_ci" varchar(100),
	"delito_falta" varchar(300),
	"monto_robo" integer,
	"objetos_recuperados" text,
	"vehiculos_recuperados" text,
	"tipo_vehiculo" varchar(100),
	"destino_vehiculo" varchar(200),
	"hay_cateo" boolean DEFAULT false NOT NULL,
	"domicilio_cateado" varchar(300),
	"resultado_cateo" text,
	"policia_a_cargo" varchar(200),
	"personal_ingreso_ci" varchar(200),
	"capturado_por" text NOT NULL,
	"creado_en" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "incidente_reporte_campo_incidente_uq" UNIQUE("incidente_id")
);
--> statement-breakpoint
CREATE TABLE "incidentes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"folio" varchar(60) NOT NULL,
	"folio_consecutivo" integer NOT NULL,
	"canal" varchar(20) NOT NULL,
	"tipo_reporte" varchar(30) NOT NULL,
	"nombre_reportante" varchar(300),
	"anonimo" boolean DEFAULT false NOT NULL,
	"sexo" varchar(10),
	"edad" integer,
	"es_usuario_frecuente" boolean DEFAULT false NOT NULL,
	"es_persona_afectada" boolean DEFAULT false NOT NULL,
	"es_migrante" boolean DEFAULT false NOT NULL,
	"calle" varchar(200),
	"colonia" varchar(150),
	"entre_calles" varchar(200),
	"referencia_ubicacion" varchar(300),
	"municipio" varchar(100) DEFAULT 'San Juan del Río' NOT NULL,
	"tipo_emergencia_id" integer,
	"tipo_incidente_id" integer,
	"prioridad_id" integer,
	"descripcion" text,
	"observaciones" text,
	"fecha_hora_inicio" timestamp with time zone NOT NULL,
	"fecha_hora_fin" timestamp with time zone,
	"grupo_whatsapp" varchar(200),
	"nombre_oficial" varchar(200),
	"medio_canalizacion_id" integer,
	"requiere_despacho" boolean DEFAULT false NOT NULL,
	"estatus" varchar(20) DEFAULT 'sin_despachar' NOT NULL,
	"capturado_por" text NOT NULL,
	"creado_en" timestamp with time zone DEFAULT now() NOT NULL,
	"actualizado_en" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "incidentes_folio_uq" UNIQUE("folio"),
	CONSTRAINT "incidentes_canal_ck" CHECK (canal IN ('911','whatsapp','radio')),
	CONSTRAINT "incidentes_tipo_reporte_ck" CHECK (tipo_reporte IN ('normal','extorsion','alarma_escolar')),
	CONSTRAINT "incidentes_estatus_ck" CHECK (estatus IN ('sin_despachar','en_despacho','atendido')),
	CONSTRAINT "incidentes_sexo_ck" CHECK (sexo IN ('M','F','NE') OR sexo IS NULL)
);
--> statement-breakpoint
CREATE TABLE "reportes_d1" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"folio_denuncia" varchar(50) NOT NULL,
	"iph" varchar(100),
	"folio_cu" varchar(100),
	"corporacion" varchar(100) DEFAULT 'SSPM',
	"sector" varchar(50),
	"grupo_adscripcion" varchar(100),
	"fecha_reporte" date NOT NULL,
	"hora_reporte" time NOT NULL,
	"fecha_avistamiento" date,
	"hora_avistamiento" time,
	"fecha_despacho" date,
	"hora_despacho" time,
	"fecha_confirmacion" date,
	"hora_confirmacion" time,
	"fecha_llegada" date,
	"hora_llegada" time,
	"hora_inicio_denuncia" time,
	"hora_fin_denuncia" time,
	"hora_termino_atencion" time,
	"hora_cuestionario" time,
	"lugar_hecho" text,
	"lugar_apoyo" text,
	"municipio" varchar(100) DEFAULT 'San Juan del Río',
	"colonia" varchar(100),
	"referencias" text,
	"latitud" numeric(10, 8),
	"longitud" numeric(11, 8),
	"tipo_evento" varchar(10) NOT NULL,
	"delito" varchar(255) NOT NULL,
	"violencia" boolean DEFAULT false,
	"crp" varchar(50),
	"policia_denuncia" varchar(255),
	"policia_firma_d1" varchar(255),
	"policia_ingresa_cu" varchar(255),
	"requirio_tablet" boolean DEFAULT false,
	"funcionaba_tablet" boolean DEFAULT false,
	"ofendido_hombre" integer DEFAULT 0,
	"ofendido_mujer" integer DEFAULT 0,
	"num_cuestionarios" integer DEFAULT 0,
	"intervino_gs" boolean DEFAULT false,
	"se_genero_d1" boolean DEFAULT false,
	"se_va_a_generar_d1" boolean DEFAULT false,
	"observaciones" text,
	"capturado_por" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "reportes_d1_folio_denuncia_unique" UNIQUE("folio_denuncia")
);
--> statement-breakpoint
ALTER TABLE "audit_log" ADD CONSTRAINT "audit_log_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "incidente_alarma_escolar" ADD CONSTRAINT "iae_incidente_fk" FOREIGN KEY ("incidente_id") REFERENCES "public"."incidentes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "incidente_despacho" ADD CONSTRAINT "id_incidente_fk" FOREIGN KEY ("incidente_id") REFERENCES "public"."incidentes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "incidente_despacho" ADD CONSTRAINT "id_despachado_por_fk" FOREIGN KEY ("despachado_por") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "incidente_despacho_elementos" ADD CONSTRAINT "ide_despacho_fk" FOREIGN KEY ("despacho_id") REFERENCES "public"."incidente_despacho"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "incidente_despacho_unidades" ADD CONSTRAINT "idu_despacho_fk" FOREIGN KEY ("despacho_id") REFERENCES "public"."incidente_despacho"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "incidente_extorsion" ADD CONSTRAINT "iext_incidente_fk" FOREIGN KEY ("incidente_id") REFERENCES "public"."incidentes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "incidente_personas_afectadas" ADD CONSTRAINT "ipa_incidente_fk" FOREIGN KEY ("incidente_id") REFERENCES "public"."incidentes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "incidente_reporte_campo" ADD CONSTRAINT "irc_incidente_fk" FOREIGN KEY ("incidente_id") REFERENCES "public"."incidentes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "incidente_reporte_campo" ADD CONSTRAINT "irc_capturado_por_fk" FOREIGN KEY ("capturado_por") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "incidentes" ADD CONSTRAINT "inc_tipo_emergencia_fk" FOREIGN KEY ("tipo_emergencia_id") REFERENCES "public"."cat_tipos_emergencia"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "incidentes" ADD CONSTRAINT "inc_tipo_incidente_fk" FOREIGN KEY ("tipo_incidente_id") REFERENCES "public"."cat_tipos_incidente"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "incidentes" ADD CONSTRAINT "inc_prioridad_fk" FOREIGN KEY ("prioridad_id") REFERENCES "public"."cat_prioridades"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "incidentes" ADD CONSTRAINT "inc_medio_canalizacion_fk" FOREIGN KEY ("medio_canalizacion_id") REFERENCES "public"."cat_medios_canalizacion"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "incidentes" ADD CONSTRAINT "inc_capturado_por_fk" FOREIGN KEY ("capturado_por") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reportes_d1" ADD CONSTRAINT "reportes_d1_capturado_por_users_id_fk" FOREIGN KEY ("capturado_por") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;