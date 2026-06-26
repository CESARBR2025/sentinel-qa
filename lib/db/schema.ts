import { pgTable, foreignKey, unique, serial, text, integer, boolean, varchar, timestamp, time, uuid, date, check, numeric } from "drizzle-orm/pg-core"
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

// Agregar al final de lib/db/schema.ts (después de las tablas de Rol de Servicios)

// ─── Auditoría ────────────────────────────────────────────────────────────────
// Registro inmutable de toda operación sobre datos sensibles
export const auditLog = pgTable("audit_log", {
  id:          uuid().defaultRandom().primaryKey().notNull(),
  userId:      text("user_id").notNull(),
  accion:      varchar({ length: 50 }).notNull(),  // CREATE | UPDATE | DELETE | VIEW
  entidad:     varchar({ length: 80 }).notNull(),  // nombre de la tabla afectada
  entidadId:   text("entidad_id").notNull(),       // id del registro afectado
  payload:     text(),                             // JSON del estado anterior (para UPDATE/DELETE)
  ip:          varchar({ length: 45 }),            // IPv4 o IPv6
  userAgent:   text("user_agent"),
  creadoEn:    timestamp("creado_en", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
  foreignKey({
    columns: [table.userId],
    foreignColumns: [users.id],
    name: "audit_log_user_id_fk"
  }),
])

// ─── Incidentes — Catálogos ───────────────────────────────────────────────────
export const catTiposEmergencia = pgTable("cat_tipos_emergencia", {
  id:       serial().primaryKey().notNull(),
  clave:    varchar({ length: 30 }).notNull(),
  nombre:   varchar({ length: 150 }).notNull(),
  activo:   boolean().default(true).notNull(),
  creadoEn: timestamp("creado_en", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
  unique("cat_tipos_emergencia_clave_uq").on(table.clave),
])

export const catMediosCanalizacion = pgTable("cat_medios_canalizacion", {
  id:       serial().primaryKey().notNull(),
  clave:    varchar({ length: 30 }).notNull(),
  nombre:   varchar({ length: 150 }).notNull(),
  activo:   boolean().default(true).notNull(),
  creadoEn: timestamp("creado_en", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
  unique("cat_medios_canalizacion_clave_uq").on(table.clave),
])

// ─── Incidentes — Tabla central ───────────────────────────────────────────────
export const incidentes = pgTable("incidentes", {
  id:                  uuid().defaultRandom().primaryKey().notNull(),
  folio:               varchar({ length: 60 }).notNull(),
  folioConsecutivo:    integer("folio_consecutivo").notNull(),
  // Canal y tipo
  canal:               varchar({ length: 20 }).notNull(),      // '911' | 'whatsapp' | 'radio'
  tipoReporte:         varchar("tipo_reporte", { length: 30 }).notNull(), // 'normal' | 'extorsion' | 'alarma_escolar'
  // Reportante
  nombreReportante:    varchar("nombre_reportante", { length: 300 }),
  anonimo:             boolean().default(false).notNull(),
  sexo:                varchar({ length: 10 }),                // 'M' | 'F' | 'NE'
  edad:                integer(),
  esUsuarioFrecuente:  boolean("es_usuario_frecuente").default(false).notNull(),
  esPersonaAfectada:   boolean("es_persona_afectada").default(false).notNull(),
  esMigrante:          boolean("es_migrante").default(false).notNull(),
  // Ubicación
  calle:               varchar({ length: 200 }),
  colonia:             varchar({ length: 150 }),
  entreCalles:         varchar("entre_calles", { length: 200 }),
  referenciaUbicacion: varchar("referencia_ubicacion", { length: 300 }),
  municipio:           varchar({ length: 100 }).default('San Juan del Río').notNull(),
  // Clasificación
  tipoEmergenciaId:    integer("tipo_emergencia_id"),
  tipoIncidenteId:     integer("tipo_incidente_id"),
  prioridadId:         integer("prioridad_id"),
  // Contenido
  descripcion:         text(),
  observaciones:       text(),
  // Tiempos
  fechaHoraInicio:     timestamp("fecha_hora_inicio", { withTimezone: true, mode: 'string' }).notNull(),
  fechaHoraFin:        timestamp("fecha_hora_fin",    { withTimezone: true, mode: 'string' }),
  // Campos específicos por canal
  grupoWhatsapp:       varchar("grupo_whatsapp", { length: 200 }), // libre, solo whatsapp
  nombreOficial:       varchar("nombre_oficial",  { length: 200 }), // solo radio
  // Canalización
  medioCanalizacionId: integer("medio_canalizacion_id"),
  requiereDespacho:    boolean("requiere_despacho").default(false).notNull(),
  // Estatus
  estatus:             varchar({ length: 20 }).default('sin_despachar').notNull(),
  // Control
  capturadoPor:        text("capturado_por").notNull(),
  creadoEn:            timestamp("creado_en",    { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
  actualizadoEn:       timestamp("actualizado_en", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
  foreignKey({ columns: [table.tipoEmergenciaId],    foreignColumns: [catTiposEmergencia.id],    name: "inc_tipo_emergencia_fk" }),
  foreignKey({ columns: [table.tipoIncidenteId],     foreignColumns: [catTiposIncidente.id],     name: "inc_tipo_incidente_fk" }),
  foreignKey({ columns: [table.prioridadId],         foreignColumns: [catPrioridades.id],        name: "inc_prioridad_fk" }),
  foreignKey({ columns: [table.medioCanalizacionId], foreignColumns: [catMediosCanalizacion.id], name: "inc_medio_canalizacion_fk" }),
  foreignKey({ columns: [table.capturadoPor],        foreignColumns: [users.id],                 name: "inc_capturado_por_fk" }),
  unique("incidentes_folio_uq").on(table.folio),
  check("incidentes_canal_ck",        sql`canal IN ('911','whatsapp','radio')`),
  check("incidentes_tipo_reporte_ck", sql`tipo_reporte IN ('normal','extorsion','alarma_escolar')`),
  check("incidentes_estatus_ck",      sql`estatus IN ('sin_despachar','en_despacho','atendido')`),
  check("incidentes_sexo_ck",         sql`sexo IN ('M','F','NE') OR sexo IS NULL`),
])

// ─── Personas afectadas adicionales ──────────────────────────────────────────
export const incidentePersonasAfectadas = pgTable("incidente_personas_afectadas", {
  id:           uuid().defaultRandom().primaryKey().notNull(),
  incidenteId:  uuid("incidente_id").notNull(),
  nombre:       varchar({ length: 300 }),
  sexo:         varchar({ length: 10 }),
  edad:         integer(),
  creadoEn:     timestamp("creado_en", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
  foreignKey({ columns: [table.incidenteId], foreignColumns: [incidentes.id], name: "ipa_incidente_fk" }).onDelete("cascade"),
  check("ipa_sexo_ck", sql`sexo IN ('M','F','NE') OR sexo IS NULL`),
])

// ─── Despacho ─────────────────────────────────────────────────────────────────
export const incidenteDespacho = pgTable("incidente_despacho", {
  id:                uuid().defaultRandom().primaryKey().notNull(),
  incidenteId:       uuid("incidente_id").notNull(),
  fechaHoraDespacho: timestamp("fecha_hora_despacho", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
  despachadorPor:    text("despachado_por").notNull(),
  creadoEn:          timestamp("creado_en", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
  foreignKey({ columns: [table.incidenteId],    foreignColumns: [incidentes.id], name: "id_incidente_fk" }).onDelete("cascade"),
  foreignKey({ columns: [table.despachadorPor], foreignColumns: [users.id],      name: "id_despachado_por_fk" }),
  unique("incidente_despacho_incidente_uq").on(table.incidenteId),
])

export const incidenteDespachoUnidades = pgTable("incidente_despacho_unidades", {
  id:          uuid().defaultRandom().primaryKey().notNull(),
  despachoId:  uuid("despacho_id").notNull(),
  unidadExtId: varchar("unidad_ext_id", { length: 100 }),
  unidadPlaca: varchar("unidad_placa",  { length: 30  }),
  creadoEn:    timestamp("creado_en", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
  foreignKey({ columns: [table.despachoId], foreignColumns: [incidenteDespacho.id], name: "idu_despacho_fk" }).onDelete("cascade"),
])

export const incidenteDespachoElementos = pgTable("incidente_despacho_elementos", {
  id:             uuid().defaultRandom().primaryKey().notNull(),
  despachoId:     uuid("despacho_id").notNull(),
  elementoExtId:  varchar("elemento_ext_id", { length: 100 }),
  elementoNomina: varchar("elemento_nomina",  { length: 40  }),
  elementoNombre: varchar("elemento_nombre",  { length: 200 }),
  creadoEn:       timestamp("creado_en", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
  foreignKey({ columns: [table.despachoId], foreignColumns: [incidenteDespacho.id], name: "ide_despacho_fk" }).onDelete("cascade"),
])

// ─── Reporte de campo ─────────────────────────────────────────────────────────
export const incidenteReporteCampo = pgTable("incidente_reporte_campo", {
  id:                    uuid().defaultRandom().primaryKey().notNull(),
  incidenteId:           uuid("incidente_id").notNull(),
  contenidoReporte:      text("contenido_reporte"),
  // Lugar de hechos
  lugarCalle:            varchar("lugar_calle",    { length: 200 }),
  lugarColonia:          varchar("lugar_colonia",  { length: 150 }),
  lugarEntreCalles:      varchar("lugar_entre_calles", { length: 200 }),
  lugarReferencia:       varchar("lugar_referencia",   { length: 300 }),
  datosPositivosNegativos: text("datos_positivos_negativos"),
  accionesRealizadas:    text("acciones_realizadas"),
  // Detención
  hayDetencion:          boolean("hay_detencion").default(false).notNull(),
  nombreDetenidos:       text("nombre_detenidos"),
  autoridadRecibe:       varchar("autoridad_recibe",  { length: 200 }),
  expedienteCi:          varchar("expediente_ci",     { length: 100 }),
  delitoFalta:           varchar("delito_falta",      { length: 300 }),
  montoRobo:             integer("monto_robo"),        // en pesos, evitar decimal para no perder precisión
  objetosRecuperados:    text("objetos_recuperados"),
  vehiculosRecuperados:  text("vehiculos_recuperados"),
  tipoVehiculo:          varchar("tipo_vehiculo",     { length: 100 }),
  destinoVehiculo:       varchar("destino_vehiculo",  { length: 200 }),
  // Cateo
  hayCateo:              boolean("hay_cateo").default(false).notNull(),
  domicilioCateado:      varchar("domicilio_cateado", { length: 300 }),
  resultadoCateo:        text("resultado_cateo"),
  // Personal
  policiaCargo:          varchar("policia_a_cargo",   { length: 200 }),
  personalIngresoCi:     varchar("personal_ingreso_ci", { length: 200 }),
  capturadoPor:          text("capturado_por").notNull(),
  creadoEn:              timestamp("creado_en", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
  foreignKey({ columns: [table.incidenteId], foreignColumns: [incidentes.id], name: "irc_incidente_fk" }).onDelete("cascade"),
  foreignKey({ columns: [table.capturadoPor], foreignColumns: [users.id],     name: "irc_capturado_por_fk" }),
  unique("incidente_reporte_campo_incidente_uq").on(table.incidenteId), // 1:1
])

// ─── Extorsión ────────────────────────────────────────────────────────────────
export const incidenteExtorsion = pgTable("incidente_extorsion", {
  id:               uuid().defaultRandom().primaryKey().notNull(),
  incidenteId:      uuid("incidente_id").notNull(),
  telefonoExtorsion: varchar("telefono_extorsion", { length: 30 }),
  grupoDelictivo:   varchar("grupo_delictivo",    { length: 200 }),
  modusOperandi:    text("modus_operandi"),
  unidadResultado:  varchar("unidad_resultado",   { length: 100 }),
  folioReporte:     varchar("folio_reporte",      { length: 100 }),
  fecha:            date(),
  creadoEn:         timestamp("creado_en", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
  foreignKey({ columns: [table.incidenteId], foreignColumns: [incidentes.id], name: "iext_incidente_fk" }).onDelete("cascade"),
  unique("incidente_extorsion_incidente_uq").on(table.incidenteId), // 1:1
])

// ─── Alarma escolar ───────────────────────────────────────────────────────────
export const incidenteAlarmaEscolar = pgTable("incidente_alarma_escolar", {
  id:                  uuid().defaultRandom().primaryKey().notNull(),
  incidenteId:         uuid("incidente_id").notNull(),
  establecimiento:     varchar({ length: 200 }),
  direccion:           varchar({ length: 300 }),
  inmueble:            varchar({ length: 200 }),
  responsable:         varchar({ length: 200 }),
  reporteDescripcion:  text("reporte_descripcion"),
  horaCanalizacion:    varchar("hora_canalizacion", { length: 10 }),
  unidadArribo:        varchar("unidad_arribo",     { length: 100 }),
  horaArribo:          varchar("hora_arribo",       { length: 10 }),
  nombreResponsable:   varchar("nombre_responsable",  { length: 200 }),
  nombreVerificador:   varchar("nombre_verificador",  { length: 200 }),
  activaciones:        integer().default(0).notNull(), // contador
  creadoEn:            timestamp("creado_en", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
  foreignKey({ columns: [table.incidenteId], foreignColumns: [incidentes.id], name: "iae_incidente_fk" }).onDelete("cascade"),
  unique("incidente_alarma_escolar_incidente_uq").on(table.incidenteId), // 1:1
])


export const reportesD1 = pgTable("reportes_d1", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	// --- IDENTIFICACIÓN LEGAL ---
	folioDenuncia: varchar("folio_denuncia", { length: 50 }).notNull(),
	iph: varchar("iph", { length: 100 }),
	folioCu: varchar("folio_cu", { length: 100 }),
	corporacion: varchar("corporacion", { length: 100 }).default("SSPM"),
	sector: varchar("sector", { length: 50 }),
	grupoAdscripcion: varchar("grupo_adscripcion", { length: 100 }),

	// --- CRONOMETRÍA ---
	fechaReporte: date("fecha_reporte").notNull(),
	horaReporte: time("hora_reporte").notNull(),
	fechaAvistamiento: date("fecha_avistamiento"),
	horaAvistamiento: time("hora_avistamiento"),
	fechaDespacho: date("fecha_despacho"),
	horaDespacho: time("hora_despacho"),
	fechaConfirmacion: date("fecha_confirmacion"),
	horaConfirmacion: time("hora_confirmacion"),
	fechaLlegada: date("fecha_llegada"),
	horaLlegada: time("hora_llegada"),
	horaInicioDenuncia: time("hora_inicio_denuncia"),
	horaFinDenuncia: time("hora_fin_denuncia"),
	horaTerminoAtencion: time("hora_termino_atencion"),
	horaCuestionario: time("hora_cuestionario"),

	// --- UBICACIÓN ---
	lugarHecho: text("lugar_hecho"),
	lugarApoyo: text("lugar_apoyo"),
	municipio: varchar("municipio", { length: 100 }).default("San Juan del Río"),
	colonia: varchar("colonia", { length: 100 }),
	referencias: text("referencias"),
	latitud: numeric("latitud", { precision: 10, scale: 8 }),
	longitud: numeric("longitud", { precision: 11, scale: 8 }),

	  nominaMando: varchar("nomina_mando", { length: 50 }),
  policiaCargo: varchar("policia_a_cargo", { length: 255 }),

	// --- DETALLES ---
	tipoEvento: varchar("tipo_evento", { length: 10 }).notNull(),
	delito: varchar("delito", { length: 255 }).notNull(),
	violencia: boolean().default(false),

	// --- PERSONAL Y EQUIPO ---
	crp: varchar("crp", { length: 50 }),
	policiaDenuncia: varchar("policia_denuncia", { length: 255 }),
	policiaFirmaD1: varchar("policia_firma_d1", { length: 255 }),
	policiaIngresaCu: varchar("policia_ingresa_cu", { length: 255 }),
	requirioTablet: boolean("requirio_tablet").default(false),
	funcionabaTablet: boolean("funcionaba_tablet").default(false),

	// --- VICTIMOLOGÍA ---
	ofendidoHombre: integer("ofendido_hombre").default(0),
	ofendidoMujer: integer("ofendido_mujer").default(0),
	numCuestionarios: integer("num_cuestionarios").default(0),
	intervinoGs: boolean("intervino_gs").default(false),

	// --- ESTATUS ---
	seGeneroD1: boolean("se_genero_d1").default(false),
	seVaAGenerarD1: boolean("se_va_a_generar_d1").default(false),
	observaciones: text(),

	// --- CONTROL (Siguiendo tu estilo de accounts) ---
	capturadoPor: text("capturado_por").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	// LLAVE FORÁNEA EXPLÍCITA (Igual que en tu tabla accounts)
	foreignKey({
		columns: [table.capturadoPor],
		foreignColumns: [users.id],
		name: "reportes_d1_capturado_por_users_id_fk"
	}).onDelete("restrict"),
	
	// UNICIDAD DEL FOLIO
	unique("reportes_d1_folio_denuncia_unique").on(table.folioDenuncia),
]);