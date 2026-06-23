import { pgTable, foreignKey, unique, serial, text, integer, boolean, varchar, timestamp, time, uuid, date, check } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const usuarioModulos = pgTable("usuario_modulos", {
	id: serial().primaryKey().notNull(),
	userId: text("user_id").notNull(),
	moduloId: integer("modulo_id").notNull(),
	puedeVer: boolean("puede_ver").default(true).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "usuario_modulos_user_id_users_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.moduloId],
			foreignColumns: [modulos.id],
			name: "usuario_modulos_modulo_id_modulos_id_fk"
		}).onDelete("cascade"),
	unique("usuario_modulos_user_id_modulo_id_unique").on(table.userId, table.moduloId),
]);

export const modulos = pgTable("modulos", {
	id: serial().primaryKey().notNull(),
	clave: varchar({ length: 80 }).notNull(),
	nombre: varchar({ length: 100 }).notNull(),
	ruta: varchar({ length: 255 }),
	icono: varchar({ length: 60 }),
	padreId: integer("padre_id"),
	orden: integer().default(0).notNull(),
	activo: boolean().default(true).notNull(),
}, (table) => [
	unique("modulos_clave_unique").on(table.clave),
]);

export const roles = pgTable("roles", {
	id: serial().primaryKey().notNull(),
	nombre: varchar({ length: 60 }).notNull(),
	descripcion: text(),
	activo: boolean().default(true).notNull(),
	creadoEn: timestamp("creado_en", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	unique("roles_nombre_unique").on(table.nombre),
]);

export const sessions = pgTable("sessions", {
	id: text().primaryKey().notNull(),
	expiresAt: timestamp("expires_at", { mode: 'string' }).notNull(),
	token: text().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
	ipAddress: text("ip_address"),
	userAgent: text("user_agent"),
	userId: text("user_id").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "sessions_user_id_users_id_fk"
		}).onDelete("cascade"),
	unique("sessions_token_unique").on(table.token),
]);

export const users = pgTable("users", {
	id: text().primaryKey().notNull(),
	name: varchar({ length: 100 }).notNull(),
	apellido: varchar({ length: 100 }).default('').notNull(),
	email: varchar({ length: 255 }).notNull(),
	emailVerified: boolean("email_verified").default(false).notNull(),
	image: text(),
	rolId: integer("rol_id"),
	activo: boolean().default(true).notNull(),
	twoFactorEnabled: boolean("two_factor_enabled").default(false),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
	dependenciaId: integer("dependencia_id"),
}, (table) => [
	foreignKey({
			columns: [table.rolId],
			foreignColumns: [roles.id],
			name: "users_rol_id_roles_id_fk"
		}),
	foreignKey({
			columns: [table.dependenciaId],
			foreignColumns: [catDependencias.id],
			name: "users_dependencia_id_fk"
		}),
	unique("users_email_unique").on(table.email),
]);

export const twoFactors = pgTable("two_factors", {
	id: text().primaryKey().notNull(),
	secret: text().notNull(),
	backupCodes: text("backup_codes").notNull(),
	userId: text("user_id").notNull(),
	verified: boolean().default(false),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "two_factors_user_id_users_id_fk"
		}).onDelete("cascade"),
	unique("two_factors_user_id_unique").on(table.userId),
]);

export const verifications = pgTable("verifications", {
	id: text().primaryKey().notNull(),
	identifier: text().notNull(),
	value: text().notNull(),
	expiresAt: timestamp("expires_at", { mode: 'string' }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
});

export const accounts = pgTable("accounts", {
	id: text().primaryKey().notNull(),
	accountId: text("account_id").notNull(),
	providerId: text("provider_id").notNull(),
	userId: text("user_id").notNull(),
	accessToken: text("access_token"),
	refreshToken: text("refresh_token"),
	idToken: text("id_token"),
	accessTokenExpiresAt: timestamp("access_token_expires_at", { mode: 'string' }),
	refreshTokenExpiresAt: timestamp("refresh_token_expires_at", { mode: 'string' }),
	scope: text(),
	password: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "accounts_user_id_users_id_fk"
		}).onDelete("cascade"),
]);

export const catPrioridades = pgTable("cat_prioridades", {
	id: serial().primaryKey().notNull(),
	clave: varchar({ length: 20 }).notNull(),
	nombre: varchar({ length: 40 }).notNull(),
	orden: integer().notNull(),
	activo: boolean().default(true).notNull(),
}, (table) => [
	unique("cat_prioridades_clave_uq").on(table.clave),
]);

export const catEstatusEvento = pgTable("cat_estatus_evento", {
	id: serial().primaryKey().notNull(),
	clave: varchar({ length: 30 }).notNull(),
	nombre: varchar({ length: 60 }).notNull(),
	descripcion: text(),
	areaResponsable: varchar("area_responsable", { length: 80 }),
	orden: integer().notNull(),
	esEstadoFinal: boolean("es_estado_final").default(false).notNull(),
	activo: boolean().default(true).notNull(),
}, (table) => [
	unique("cat_estatus_evento_clave_uq").on(table.clave),
]);

export const catTurnos = pgTable("cat_turnos", {
	id: serial().primaryKey().notNull(),
	nombre: varchar({ length: 40 }).notNull(),
	horaInicio: time("hora_inicio").notNull(),
	horaFin: time("hora_fin").notNull(),
	activo: boolean().default(true).notNull(),
}, (table) => [
	unique("cat_turnos_nombre_uq").on(table.nombre),
]);

export const contestaciones = pgTable("contestaciones", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	solicitudId: uuid("solicitud_id").notNull(),
	fechaContestacion: date("fecha_contestacion").notNull(),
	archivoPdfUrl: varchar("archivo_pdf_url", { length: 500 }),
	fechaEntrega: date("fecha_entrega"),
	horaEntrega: varchar("hora_entrega", { length: 10 }),
	nombreQuienRecibio: varchar("nombre_quien_recibio", { length: 200 }),
	creadoPor: text("creado_por"),
	creadoEn: timestamp("creado_en", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.solicitudId],
			foreignColumns: [solicitudesInformacion.id],
			name: "contestaciones_solicitud_id_solicitudes_informacion_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.creadoPor],
			foreignColumns: [users.id],
			name: "contestaciones_creado_por_users_id_fk"
		}),
	unique("contestaciones_solicitud_id_unique").on(table.solicitudId),
]);

export const solicitudesC4Internas = pgTable("solicitudes_c4_internas", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	solicitudId: uuid("solicitud_id").notNull(),
	descripcionEvidencias: text("descripcion_evidencias").notNull(),
	status: varchar({ length: 50 }).default('pendiente').notNull(),
	creadoPor: text("creado_por"),
	creadoEn: timestamp("creado_en", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.creadoPor],
			foreignColumns: [users.id],
			name: "solicitudes_c4_internas_creado_por_users_id_fk"
		}),
	foreignKey({
			columns: [table.solicitudId],
			foreignColumns: [solicitudesInformacion.id],
			name: "solicitudes_c4_internas_solicitud_id_solicitudes_informacion_id"
		}).onDelete("cascade"),
]);

export const visitasDomiciliarias = pgTable("visitas_domiciliarias", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	medidaId: uuid("medida_id").notNull(),
	fechaVisita: date("fecha_visita").notNull(),
	horaVisita: varchar("hora_visita", { length: 10 }).notNull(),
	resultado: text(),
	apercibimientoAplicado: boolean("apercibimiento_aplicado").default(false),
	registradoPor: text("registrado_por"),
	creadoEn: timestamp("creado_en", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.medidaId],
			foreignColumns: [medidasProteccion.id],
			name: "visitas_domiciliarias_medida_id_medidas_proteccion_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.registradoPor],
			foreignColumns: [users.id],
			name: "visitas_domiciliarias_registrado_por_users_id_fk"
		}),
]);

export const seguimientosBusqueda = pgTable("seguimientos_busqueda", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	fichaId: uuid("ficha_id").notNull(),
	tipo: varchar({ length: 50 }).notNull(),
	fechaHoraEnvio: timestamp("fecha_hora_envio", { mode: 'string' }).notNull(),
	registradoPor: text("registrado_por"),
	creadoEn: timestamp("creado_en", { mode: 'string' }).defaultNow().notNull(),
	archivoUrl: varchar("archivo_url", { length: 500 }),
}, (table) => [
	foreignKey({
			columns: [table.fichaId],
			foreignColumns: [fichasBusqueda.id],
			name: "seguimientos_busqueda_ficha_id_fichas_busqueda_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.registradoPor],
			foreignColumns: [users.id],
			name: "seguimientos_busqueda_registrado_por_users_id_fk"
		}),
]);

export const solicitudesInformacion = pgTable("solicitudes_informacion", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	enlace: varchar({ length: 200 }),
	oficio: varchar({ length: 200 }).notNull(),
	fechaActivacion: timestamp("fecha_activacion", { mode: 'string' }).notNull(),
	autoridad: varchar({ length: 50 }).notNull(),
	fiscalSolicita: varchar("fiscal_solicita", { length: 200 }),
	delito: varchar({ length: 300 }),
	carpetaInvestigacion: varchar("carpeta_investigacion", { length: 200 }),
	solicitudTexto: text("solicitud_texto"),
	fechaAceptacion: timestamp("fecha_aceptacion", { mode: 'string' }),
	status: varchar({ length: 50 }).default('nuevo').notNull(),
	creadoPor: text("creado_por"),
	creadoEn: timestamp("creado_en", { mode: 'string' }).defaultNow().notNull(),
	actualizadoEn: timestamp("actualizado_en", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.creadoPor],
			foreignColumns: [users.id],
			name: "solicitudes_informacion_creado_por_users_id_fk"
		}),
]);

export const fichasBusqueda = pgTable("fichas_busqueda", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	tipo: varchar({ length: 50 }).notNull(),
	folio: varchar({ length: 100 }),
	enlace: varchar({ length: 200 }),
	fechaActivacion: timestamp("fecha_activacion", { mode: 'string' }).notNull(),
	carpetaInvestigacion: varchar("carpeta_investigacion", { length: 200 }),
	nombreDesaparecida: varchar("nombre_desaparecida", { length: 300 }).notNull(),
	edad: integer(),
	fechaAceptacion: timestamp("fecha_aceptacion", { mode: 'string' }),
	rtAtiende: varchar("rt_atiende", { length: 200 }),
	elementoNovedades: varchar("elemento_novedades", { length: 200 }),
	status: varchar({ length: 50 }).default('activa').notNull(),
	fechaCancelacion: timestamp("fecha_cancelacion", { mode: 'string' }),
	fiscalCancela: varchar("fiscal_cancela", { length: 200 }),
	motivoCancelacion: text("motivo_cancelacion"),
	creadoPor: text("creado_por"),
	creadoEn: timestamp("creado_en", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.creadoPor],
			foreignColumns: [users.id],
			name: "fichas_busqueda_creado_por_users_id_fk"
		}),
]);

export const medidasProteccion = pgTable("medidas_proteccion", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	expediente: varchar({ length: 100 }).notNull(),
	nOficio: varchar("n_oficio", { length: 100 }).notNull(),
	fechaOficio: date("fecha_oficio").notNull(),
	fechaRecepcion: date("fecha_recepcion").notNull(),
	personaRecepciona: varchar("persona_recepciona", { length: 200 }).notNull(),
	autoridad: varchar({ length: 50 }).notNull(),
	nombreAutoridad: varchar("nombre_autoridad", { length: 200 }),
	delitos: text(),
	victima: varchar({ length: 300 }).notNull(),
	demandado: varchar({ length: 300 }),
	tipoMedida: varchar("tipo_medida", { length: 300 }),
	domicilioProteccion: text("domicilio_proteccion").notNull(),
	colonia: varchar({ length: 200 }),
	telefono: varchar({ length: 20 }),
	tiempoMedida: varchar("tiempo_medida", { length: 200 }),
	fechaVencimiento: date("fecha_vencimiento"),
	tipoApercibimiento: varchar("tipo_apercibimiento", { length: 200 }),
	enlace: varchar({ length: 200 }),
	observaciones: text(),
	status: varchar({ length: 50 }).default('activa').notNull(),
	creadoPor: text("creado_por"),
	creadoEn: timestamp("creado_en", { mode: 'string' }).defaultNow().notNull(),
	actualizadoEn: timestamp("actualizado_en", { mode: 'string' }).defaultNow().notNull(),
	prorrogada: boolean().default(false).notNull(),
	archivoProrrogaUrl: varchar("archivo_prorroga_url", { length: 500 }),
}, (table) => [
	foreignKey({
			columns: [table.creadoPor],
			foreignColumns: [users.id],
			name: "medidas_proteccion_creado_por_users_id_fk"
		}),
]);

export const medidaAutoridadesAdicionales = pgTable("medida_autoridades_adicionales", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	medidaId: uuid("medida_id").notNull(),
	autoridad: varchar({ length: 50 }).notNull(),
	nOficio: varchar("n_oficio", { length: 100 }),
	fechaOficio: date("fecha_oficio"),
	creadoPor: text("creado_por"),
	creadoEn: timestamp("creado_en", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.creadoPor],
			foreignColumns: [users.id],
			name: "medida_autoridades_adicionales_creado_por_users_id_fk"
		}),
	foreignKey({
			columns: [table.medidaId],
			foreignColumns: [medidasProteccion.id],
			name: "medida_autoridades_adicionales_medida_id_medidas_proteccion_id_"
		}).onDelete("cascade"),
]);

export const notificaciones = pgTable("notificaciones", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: text("user_id").notNull(),
	tipo: varchar({ length: 100 }).notNull(),
	titulo: varchar({ length: 300 }).notNull(),
	mensaje: text().notNull(),
	href: varchar({ length: 500 }),
	leida: boolean().default(false).notNull(),
	fichaId: uuid("ficha_id"),
	hito: varchar({ length: 50 }),
	creadoEn: timestamp("creado_en", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "notificaciones_user_id_users_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.fichaId],
			foreignColumns: [fichasBusqueda.id],
			name: "notificaciones_ficha_id_fichas_busqueda_id_fk"
		}).onDelete("cascade"),
	unique("notificaciones_user_id_ficha_id_hito_unique").on(table.userId, table.fichaId, table.hito),
]);

export const catDependencias = pgTable("cat_dependencias", {
	id: serial().primaryKey().notNull(),
	clave: varchar({ length: 30 }).notNull(),
	nombre: varchar({ length: 150 }).notNull(),
	tipo: varchar({ length: 20 }).notNull(),
	activo: boolean().default(true).notNull(),
	creadoEn: timestamp("creado_en", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	unique("cat_dependencias_clave_uq").on(table.clave),
	check("cat_dependencias_tipo_ck", sql`(tipo)::text = ANY ((ARRAY['interna'::character varying, 'externa'::character varying])::text[])`),
]);

export const permisos = pgTable("permisos", {
	id: serial().primaryKey().notNull(),
	rolId: integer("rol_id").notNull(),
	moduloId: integer("modulo_id").notNull(),
	puedeVer: boolean("puede_ver").default(false).notNull(),
	puedeCrear: boolean("puede_crear").default(false).notNull(),
	puedeEditar: boolean("puede_editar").default(false).notNull(),
	puedeEliminar: boolean("puede_eliminar").default(false).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.rolId],
			foreignColumns: [roles.id],
			name: "permisos_rol_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.moduloId],
			foreignColumns: [modulos.id],
			name: "permisos_modulo_id_fk"
		}).onDelete("cascade"),
	unique("permisos_rol_modulo_uq").on(table.rolId, table.moduloId),
]);

export const catOrigenesEvento = pgTable("cat_origenes_evento", {
	id: serial().primaryKey().notNull(),
	clave: varchar({ length: 30 }).notNull(),
	nombre: varchar({ length: 80 }).notNull(),
	activo: boolean().default(true).notNull(),
}, (table) => [
	unique("cat_origenes_evento_clave_uq").on(table.clave),
]);

export const eventos = pgTable("eventos", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	folioCad: varchar("folio_cad", { length: 60 }).notNull(),
	origenId: integer("origen_id").notNull(),
	tipoIncidenteId: integer("tipo_incidente_id").notNull(),
	prioridadId: integer("prioridad_id").notNull(),
	estatusId: integer("estatus_id").default(1).notNull(),
	turnoId: integer("turno_id"),
	descripcionInicial: text("descripcion_inicial").notNull(),
	nombreReportante: varchar("nombre_reportante", { length: 200 }),
	telefonoReportante: varchar("telefono_reportante", { length: 20 }),
	calle: varchar({ length: 200 }).notNull(),
	numeroExt: varchar("numero_ext", { length: 20 }),
	colonia: varchar({ length: 150 }),
	municipio: varchar({ length: 100 }).default('San Juan del Río').notNull(),
	referencias: text(),
	fechaHoraReporte: timestamp("fecha_hora_reporte", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	fechaHoraCierre: timestamp("fecha_hora_cierre", { withTimezone: true, mode: 'string' }),
	creadoPor: text("creado_por").notNull(),
	creadoEn: timestamp("creado_en", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	actualizadoEn: timestamp("actualizado_en", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.origenId],
			foreignColumns: [catOrigenesEvento.id],
			name: "eventos_origen_id_fk"
		}),
	foreignKey({
			columns: [table.tipoIncidenteId],
			foreignColumns: [catTiposIncidente.id],
			name: "eventos_tipo_incidente_id_fk"
		}),
	foreignKey({
			columns: [table.prioridadId],
			foreignColumns: [catPrioridades.id],
			name: "eventos_prioridad_id_fk"
		}),
	foreignKey({
			columns: [table.estatusId],
			foreignColumns: [catEstatusEvento.id],
			name: "eventos_estatus_id_fk"
		}),
	foreignKey({
			columns: [table.turnoId],
			foreignColumns: [catTurnos.id],
			name: "eventos_turno_id_fk"
		}),
	foreignKey({
			columns: [table.creadoPor],
			foreignColumns: [users.id],
			name: "eventos_creado_por_fk"
		}),
	unique("eventos_folio_cad_uq").on(table.folioCad),
]);

export const catTiposIncidente = pgTable("cat_tipos_incidente", {
	id: serial().primaryKey().notNull(),
	clave: varchar({ length: 30 }).notNull(),
	nombre: varchar({ length: 150 }).notNull(),
	clasificacionCad: varchar("clasificacion_cad", { length: 100 }),
	activo: boolean().default(true).notNull(),
	creadoEn: timestamp("creado_en", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	unique("cat_tipos_incidente_clave_uq").on(table.clave),
]);

// ─── Rol de Servicios — Catálogos ─────────────────────────────────────────────
export const catSectores = pgTable("cat_sectores", {
	id: serial().primaryKey().notNull(),
	nombre: varchar({ length: 100 }).notNull(),
	clave: varchar({ length: 30 }).notNull(),
	activo: boolean().default(true).notNull(),
	creadoEn: timestamp("creado_en", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	unique("cat_sectores_clave_uq").on(table.clave),
]);

export const catRadios = pgTable("cat_radios", {
	id: serial().primaryKey().notNull(),
	codigo: varchar({ length: 30 }).notNull(),
	tipo: varchar({ length: 40 }),
	estado: varchar({ length: 20 }).default('operativo').notNull(),
	activo: boolean().default(true).notNull(),
	creadoEn: timestamp("creado_en", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	unique("cat_radios_codigo_uq").on(table.codigo),
]);

export const catBodyCams = pgTable("cat_body_cams", {
	id: serial().primaryKey().notNull(),
	codigo: varchar({ length: 30 }).notNull(),
	estado: varchar({ length: 20 }).default('operativo').notNull(),
	activo: boolean().default(true).notNull(),
	creadoEn: timestamp("creado_en", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	unique("cat_body_cams_codigo_uq").on(table.codigo),
]);

export const catEstadoFuerzaConceptos = pgTable("cat_estado_fuerza_conceptos", {
	id: serial().primaryKey().notNull(),
	nombre: varchar({ length: 100 }).notNull(),
	codigo: varchar({ length: 40 }).notNull(),
	grupo: varchar({ length: 40 }),
	orden: integer().default(0).notNull(),
	activo: boolean().default(true).notNull(),
	creadoEn: timestamp("creado_en", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	unique("cat_estado_fuerza_conceptos_codigo_uq").on(table.codigo),
]);

export const catTiposObservacion = pgTable("cat_tipos_observacion", {
	id: serial().primaryKey().notNull(),
	nombre: varchar({ length: 100 }).notNull(),
	codigo: varchar({ length: 40 }).notNull(),
	activo: boolean().default(true).notNull(),
	creadoEn: timestamp("creado_en", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	unique("cat_tipos_observacion_codigo_uq").on(table.codigo),
]);

// ─── Rol de Servicios — Operativas ────────────────────────────────────────────
export const rolesServicio = pgTable("roles_servicio", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	folio: varchar({ length: 100 }).notNull(),
	folioConsecutivo: integer("folio_consecutivo").notNull(),
	turno: varchar({ length: 20 }).notNull(),
	horarioInicio: time("horario_inicio"),
	horarioFin: time("horario_fin"),
	responsableTurno: varchar("responsable_turno", { length: 200 }),
	sectorId: integer("sector_id"),
	fecha: date().notNull(),
	fundamentoLegal: text("fundamento_legal"),
	status: varchar({ length: 20 }).default('borrador').notNull(),
	firmaResponsableUrl: varchar("firma_responsable_url", { length: 500 }),
	firmaJefeSectorialUrl: varchar("firma_jefe_sectorial_url", { length: 500 }),
	firmadoPor: text("firmado_por"),
	firmadoEn: timestamp("firmado_en", { mode: 'string' }),
	creadoPor: text("creado_por"),
	creadoEn: timestamp("creado_en", { mode: 'string' }).defaultNow().notNull(),
	actualizadoEn: timestamp("actualizado_en", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.sectorId],
			foreignColumns: [catSectores.id],
			name: "roles_servicio_sector_id_fk"
		}),
	foreignKey({
			columns: [table.firmadoPor],
			foreignColumns: [users.id],
			name: "roles_servicio_firmado_por_fk"
		}),
	foreignKey({
			columns: [table.creadoPor],
			foreignColumns: [users.id],
			name: "roles_servicio_creado_por_fk"
		}),
	unique("roles_servicio_folio_uq").on(table.folio),
]);

export const rolAsignaciones = pgTable("rol_asignaciones", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	rolId: uuid("rol_id").notNull(),
	seccion: varchar({ length: 20 }).notNull(),
	unidadExtId: varchar("unidad_ext_id", { length: 100 }),
	unidadPlaca: varchar("unidad_placa", { length: 30 }),
	elementoExtId: varchar("elemento_ext_id", { length: 100 }),
	elementoNomina: varchar("elemento_nomina", { length: 40 }),
	elementoNombre: varchar("elemento_nombre", { length: 200 }),
	zona: varchar({ length: 200 }),
	servicio: varchar({ length: 200 }),
	radioId: integer("radio_id"),
	bodyCamId: integer("body_cam_id"),
	orden: integer().default(0).notNull(),
	creadoEn: timestamp("creado_en", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.rolId],
			foreignColumns: [rolesServicio.id],
			name: "rol_asignaciones_rol_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.radioId],
			foreignColumns: [catRadios.id],
			name: "rol_asignaciones_radio_id_fk"
		}),
	foreignKey({
			columns: [table.bodyCamId],
			foreignColumns: [catBodyCams.id],
			name: "rol_asignaciones_body_cam_id_fk"
		}),
]);

export const rolEstadoFuerza = pgTable("rol_estado_fuerza", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	rolId: uuid("rol_id").notNull(),
	conceptoId: integer("concepto_id").notNull(),
	cantidad: integer().default(0).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.rolId],
			foreignColumns: [rolesServicio.id],
			name: "rol_estado_fuerza_rol_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.conceptoId],
			foreignColumns: [catEstadoFuerzaConceptos.id],
			name: "rol_estado_fuerza_concepto_id_fk"
		}),
	unique("rol_estado_fuerza_rol_concepto_uq").on(table.rolId, table.conceptoId),
]);

export const rolObservaciones = pgTable("rol_observaciones", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	rolId: uuid("rol_id").notNull(),
	tipoId: integer("tipo_id").notNull(),
	descripcion: text(),
	creadoEn: timestamp("creado_en", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.rolId],
			foreignColumns: [rolesServicio.id],
			name: "rol_observaciones_rol_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.tipoId],
			foreignColumns: [catTiposObservacion.id],
			name: "rol_observaciones_tipo_id_fk"
		}),
]);