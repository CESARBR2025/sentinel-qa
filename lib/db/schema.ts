import {
  pgTable,
  serial,
  varchar,
  text,
  boolean,
  integer,
  timestamp,
  unique,
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

// ─── Tipos ────────────────────────────────────────────────────────────────────
export type Rol           = typeof roles.$inferSelect
export type User          = typeof users.$inferSelect
export type Modulo        = typeof modulos.$inferSelect
export type UsuarioModulo = typeof usuarioModulos.$inferSelect
