import {
  pgTable,
  serial,
  varchar,
  text,
  boolean,
  integer,
  timestamp,
  unique,
  uuid,
  date,
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

// ─── Roles (negocio) ──────────────────────────────────────────────────────────
export const roles = pgTable('roles', {
  id:          serial('id').primaryKey(),
  nombre:      varchar('nombre', { length: 60 }).notNull().unique(),
  descripcion: text('descripcion'),
  activo:      boolean('activo').notNull().default(true),
  creadoEn:    timestamp('creado_en').notNull().defaultNow(),
})

// ─── Tablas de better-auth ────────────────────────────────────────────────────
// better-auth gestiona estas tablas. Los campos extras (apellido, rolId, activo)
// se declaran también en auth.ts como additionalFields.

export const users = pgTable('users', {
  id:               text('id').primaryKey(),
  name:             varchar('name',     { length: 100 }).notNull(),
  apellido:         varchar('apellido', { length: 100 }).notNull().default(''),
  email:            varchar('email',    { length: 255 }).notNull().unique(),
  emailVerified:    boolean('email_verified').notNull().default(false),
  image:            text('image'),
  rolId:            integer('rol_id').references(() => roles.id),
  activo:           boolean('activo').notNull().default(true),
  twoFactorEnabled: boolean('two_factor_enabled').default(false),
  createdAt:        timestamp('created_at').notNull().defaultNow(),
  updatedAt:        timestamp('updated_at').notNull().defaultNow(),
})

export const sessions = pgTable('sessions', {
  id:        text('id').primaryKey(),
  expiresAt: timestamp('expires_at').notNull(),
  token:     text('token').notNull().unique(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId:    text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
})

export const accounts = pgTable('accounts', {
  id:                     text('id').primaryKey(),
  accountId:              text('account_id').notNull(),
  providerId:             text('provider_id').notNull(),
  userId:                 text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  accessToken:            text('access_token'),
  refreshToken:           text('refresh_token'),
  idToken:                text('id_token'),
  accessTokenExpiresAt:   timestamp('access_token_expires_at'),
  refreshTokenExpiresAt:  timestamp('refresh_token_expires_at'),
  scope:                  text('scope'),
  password:               text('password'),
  createdAt:              timestamp('created_at').notNull().defaultNow(),
  updatedAt:              timestamp('updated_at').notNull().defaultNow(),
})

export const verifications = pgTable('verifications', {
  id:         text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value:      text('value').notNull(),
  expiresAt:  timestamp('expires_at').notNull(),
  createdAt:  timestamp('created_at').notNull().defaultNow(),
  updatedAt:  timestamp('updated_at').notNull().defaultNow(),
})

// Tabla del plugin twoFactor
export const twoFactors = pgTable('two_factors', {
  id:          text('id').primaryKey(),
  secret:      text('secret').notNull(),
  backupCodes: text('backup_codes').notNull(),
  userId:      text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }).unique(),
  verified:    boolean('verified').default(false),
})

// ─── Módulos del sidebar ──────────────────────────────────────────────────────
export const modulos = pgTable('modulos', {
  id:      serial('id').primaryKey(),
  clave:   varchar('clave',   { length: 80 }).notNull().unique(),
  nombre:  varchar('nombre',  { length: 100 }).notNull(),
  ruta:    varchar('ruta',    { length: 255 }),
  icono:   varchar('icono',   { length: 60 }),
  padreId: integer('padre_id'),
  orden:   integer('orden').notNull().default(0),
  activo:  boolean('activo').notNull().default(true),
})

// ─── Permisos por usuario ─────────────────────────────────────────────────────
export const usuarioModulos = pgTable(
  'usuario_modulos',
  {
    id:        serial('id').primaryKey(),
    userId:    text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    moduloId:  integer('modulo_id').notNull().references(() => modulos.id, { onDelete: 'cascade' }),
    puedeVer:  boolean('puede_ver').notNull().default(true),
  },
  (t) => [unique().on(t.userId, t.moduloId)]
)

// ─── Relations ────────────────────────────────────────────────────────────────
export const rolesRelations = relations(roles, ({ many }) => ({
  users: many(users),
}))

export const usersRelations = relations(users, ({ one, many }) => ({
  rol:     one(roles, { fields: [users.rolId], references: [roles.id] }),
  modulos: many(usuarioModulos),
}))

export const modulosRelations = relations(modulos, ({ one, many }) => ({
  padre:    one(modulos,       { fields: [modulos.padreId], references: [modulos.id] }),
  hijos:    many(modulos),
  usuarios: many(usuarioModulos),
}))

export const usuarioModulosRelations = relations(usuarioModulos, ({ one }) => ({
  user:   one(users,   { fields: [usuarioModulos.userId],   references: [users.id] }),
  modulo: one(modulos, { fields: [usuarioModulos.moduloId], references: [modulos.id] }),
}))

// ─── Prevención del Delito — Atención a Víctimas ─────────────────────────────

// Consolida ADJ 2 (Fiscalía), ADJ 6 (UMECA), ADJ 7 (Juzgados), ADJ 8 (Sec. Mujer)
export const medidasProteccion = pgTable('medidas_proteccion', {
  id:                   uuid('id').primaryKey().defaultRandom(),
  expediente:           varchar('expediente',             { length: 100 }).notNull(),
  nOficio:              varchar('n_oficio',               { length: 100 }).notNull(),
  fechaOficio:          date('fecha_oficio').notNull(),
  fechaRecepcion:       date('fecha_recepcion').notNull(),
  personaRecepciona:    varchar('persona_recepciona',     { length: 200 }).notNull(),
  // 'FISCALIA' | 'UMECA' | 'JUZGADOS' | 'SEC_MUJER'
  autoridad:            varchar('autoridad',              { length: 50  }).notNull(),
  nombreAutoridad:      varchar('nombre_autoridad',       { length: 200 }),
  delitos:              text('delitos'),
  victima:              varchar('victima',                { length: 300 }).notNull(),
  demandado:            varchar('demandado',              { length: 300 }),
  tipoMedida:           varchar('tipo_medida',            { length: 300 }),
  domicilioProteccion:  text('domicilio_proteccion').notNull(),
  colonia:              varchar('colonia',                { length: 200 }),
  telefono:             varchar('telefono',               { length: 20  }),
  tiempoMedida:         varchar('tiempo_medida',          { length: 200 }),
  fechaVencimiento:     date('fecha_vencimiento'),
  tipoApercibimiento:   varchar('tipo_apercibimiento',    { length: 200 }),
  enlace:               varchar('enlace',                 { length: 200 }),
  observaciones:        text('observaciones'),
  // 'activa' | 'por_vencer' | 'vencida' | 'cerrada'
  status:               varchar('status', { length: 50 }).notNull().default('activa'),
  creadoPor:            text('creado_por').references(() => users.id),
  creadoEn:             timestamp('creado_en').notNull().defaultNow(),
  actualizadoEn:        timestamp('actualizado_en').notNull().defaultNow(),
})

// Reemplaza las 46 columnas de fecha fija del Excel — relación 1:N con medidas
export const visitasDomiciliarias = pgTable('visitas_domiciliarias', {
  id:                     uuid('id').primaryKey().defaultRandom(),
  medidaId:               uuid('medida_id').notNull()
                            .references(() => medidasProteccion.id, { onDelete: 'cascade' }),
  fechaVisita:            date('fecha_visita').notNull(),
  horaVisita:             varchar('hora_visita', { length: 10 }).notNull(),
  resultado:              text('resultado'),
  apercibimientoAplicado: boolean('apercibimiento_aplicado').default(false),
  registradoPor:          text('registrado_por').references(() => users.id),
  creadoEn:               timestamp('creado_en').notNull().defaultNow(),
})

// Consolida ADJ 4 (Protocolo Alba) y ADJ 5 (Búsqueda de Personas)
export const fichasBusqueda = pgTable('fichas_busqueda', {
  id:                   uuid('id').primaryKey().defaultRandom(),
  // 'PROTOCOLO_ALBA' | 'BUSQUEDA_PERSONA'
  tipo:                 varchar('tipo', { length: 50 }).notNull(),
  folio:                varchar('folio',                  { length: 100 }),
  enlace:               varchar('enlace',                 { length: 200 }),
  fechaActivacion:      timestamp('fecha_activacion').notNull(),
  carpetaInvestigacion: varchar('carpeta_investigacion',  { length: 200 }),
  nombreDesaparecida:   varchar('nombre_desaparecida',    { length: 300 }).notNull(),
  edad:                 integer('edad'),
  fechaAceptacion:      timestamp('fecha_aceptacion'),
  rtAtiende:            varchar('rt_atiende',             { length: 200 }),
  elementoNovedades:    varchar('elemento_novedades',     { length: 200 }),
  // 'activa' | 'cancelada'
  status:               varchar('status', { length: 50 }).notNull().default('activa'),
  fechaCancelacion:     timestamp('fecha_cancelacion'),
  fiscalCancela:        varchar('fiscal_cancela',         { length: 200 }),
  motivoCancelacion:    text('motivo_cancelacion'),
  creadoPor:            text('creado_por').references(() => users.id),
  creadoEn:             timestamp('creado_en').notNull().defaultNow(),
})

// Timeline de plazos reglamentarios por ficha
// tipos: 'CONTESTACION_INICIAL' | '24H' | '48H' | '72H' | 'MENSUAL_1' ... 'MENSUAL_20'
export const seguimientosBusqueda = pgTable('seguimientos_busqueda', {
  id:             uuid('id').primaryKey().defaultRandom(),
  fichaId:        uuid('ficha_id').notNull()
                    .references(() => fichasBusqueda.id, { onDelete: 'cascade' }),
  tipo:           varchar('tipo', { length: 50 }).notNull(),
  fechaHoraEnvio: timestamp('fecha_hora_envio').notNull(),
  registradoPor:  text('registrado_por').references(() => users.id),
  creadoEn:       timestamp('creado_en').notNull().defaultNow(),
})

// ─── Prevención del Delito — Área Jurídica ────────────────────────────────────

// Reemplaza ADJ 1 (Solicitud de Información Fiscalía)
export const solicitudesInformacion = pgTable('solicitudes_informacion', {
  id:                   uuid('id').primaryKey().defaultRandom(),
  enlace:               varchar('enlace',                 { length: 200 }),
  oficio:               varchar('oficio',                 { length: 200 }).notNull(),
  fechaActivacion:      timestamp('fecha_activacion').notNull(),
  // 'FISCALIA' | 'UMECA' | 'JUZGADOS' | 'SEC_MUJER'
  autoridad:            varchar('autoridad',              { length: 50  }).notNull(),
  fiscalSolicita:       varchar('fiscal_solicita',        { length: 200 }),
  delito:               varchar('delito',                 { length: 300 }),
  carpetaInvestigacion: varchar('carpeta_investigacion',  { length: 200 }),
  solicitudTexto:       text('solicitud_texto'),
  fechaAceptacion:      timestamp('fecha_aceptacion'),
  // 'nuevo' | 'en_juridico' | 'completado'
  status:               varchar('status', { length: 50 }).notNull().default('nuevo'),
  creadoPor:            text('creado_por').references(() => users.id),
  creadoEn:             timestamp('creado_en').notNull().defaultNow(),
  actualizadoEn:        timestamp('actualizado_en').notNull().defaultNow(),
})

// Rastro auditable de qué pidieron los abogados al C4
export const solicitudesC4Internas = pgTable('solicitudes_c4_internas', {
  id:                    uuid('id').primaryKey().defaultRandom(),
  solicitudId:           uuid('solicitud_id').notNull()
                           .references(() => solicitudesInformacion.id, { onDelete: 'cascade' }),
  descripcionEvidencias: text('descripcion_evidencias').notNull(),
  // 'pendiente' | 'completada'
  status:                varchar('status', { length: 50 }).notNull().default('pendiente'),
  creadoPor:             text('creado_por').references(() => users.id),
  creadoEn:              timestamp('creado_en').notNull().defaultNow(),
})

// Cierre legal + acuse de entrega (una por solicitud)
export const contestaciones = pgTable('contestaciones', {
  id:                 uuid('id').primaryKey().defaultRandom(),
  solicitudId:        uuid('solicitud_id').notNull().unique()
                        .references(() => solicitudesInformacion.id, { onDelete: 'cascade' }),
  fechaContestacion:  date('fecha_contestacion').notNull(),
  archivoPdfUrl:      varchar('archivo_pdf_url',      { length: 500 }),
  fechaEntrega:       date('fecha_entrega'),
  horaEntrega:        varchar('hora_entrega',          { length: 10  }),
  nombreQuienRecibio: varchar('nombre_quien_recibio',  { length: 200 }),
  creadoPor:          text('creado_por').references(() => users.id),
  creadoEn:           timestamp('creado_en').notNull().defaultNow(),
})

// ─── Relations — Prevención ───────────────────────────────────────────────────
export const medidasProteccionRelations = relations(medidasProteccion, ({ one, many }) => ({
  creadoPorUser: one(users, { fields: [medidasProteccion.creadoPor], references: [users.id] }),
  visitas:       many(visitasDomiciliarias),
}))

export const visitasDomiciliariasRelations = relations(visitasDomiciliarias, ({ one }) => ({
  medida:        one(medidasProteccion, { fields: [visitasDomiciliarias.medidaId], references: [medidasProteccion.id] }),
  registradoPorUser: one(users, { fields: [visitasDomiciliarias.registradoPor], references: [users.id] }),
}))

export const fichasBusquedaRelations = relations(fichasBusqueda, ({ one, many }) => ({
  creadoPorUser: one(users, { fields: [fichasBusqueda.creadoPor], references: [users.id] }),
  seguimientos:  many(seguimientosBusqueda),
}))

export const seguimientosBusquedaRelations = relations(seguimientosBusqueda, ({ one }) => ({
  ficha:             one(fichasBusqueda, { fields: [seguimientosBusqueda.fichaId], references: [fichasBusqueda.id] }),
  registradoPorUser: one(users, { fields: [seguimientosBusqueda.registradoPor], references: [users.id] }),
}))

export const solicitudesInformacionRelations = relations(solicitudesInformacion, ({ one, many }) => ({
  creadoPorUser:    one(users, { fields: [solicitudesInformacion.creadoPor], references: [users.id] }),
  solicitudesC4:    many(solicitudesC4Internas),
  contestacion:     one(contestaciones, { fields: [solicitudesInformacion.id], references: [contestaciones.solicitudId] }),
}))

export const solicitudesC4InternasRelations = relations(solicitudesC4Internas, ({ one }) => ({
  solicitud:     one(solicitudesInformacion, { fields: [solicitudesC4Internas.solicitudId], references: [solicitudesInformacion.id] }),
  creadoPorUser: one(users, { fields: [solicitudesC4Internas.creadoPor], references: [users.id] }),
}))

export const contestacionesRelations = relations(contestaciones, ({ one }) => ({
  solicitud:     one(solicitudesInformacion, { fields: [contestaciones.solicitudId], references: [solicitudesInformacion.id] }),
  creadoPorUser: one(users, { fields: [contestaciones.creadoPor], references: [users.id] }),
}))

// ─── Tipos ────────────────────────────────────────────────────────────────────
export type Rol                    = typeof roles.$inferSelect
export type User                   = typeof users.$inferSelect
export type Modulo                 = typeof modulos.$inferSelect
export type UsuarioModulo          = typeof usuarioModulos.$inferSelect
export type MedidaProteccion       = typeof medidasProteccion.$inferSelect
export type VisitaDomiciliaria     = typeof visitasDomiciliarias.$inferSelect
export type FichaBusqueda          = typeof fichasBusqueda.$inferSelect
export type SeguimientoBusqueda    = typeof seguimientosBusqueda.$inferSelect
export type SolicitudInformacion   = typeof solicitudesInformacion.$inferSelect
export type SolicitudC4Interna     = typeof solicitudesC4Internas.$inferSelect
export type Contestacion           = typeof contestaciones.$inferSelect
