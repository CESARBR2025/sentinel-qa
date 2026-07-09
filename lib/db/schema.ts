import { pgTable, foreignKey, unique, serial, text, integer, boolean, varchar, timestamp } from "drizzle-orm/pg-core"

// ═══════════════════════════════════════════════════════════════════════════════
// ÚNICAMENTE tablas necesarias para better-auth.
// El resto del schema se gestiona con raw SQL vía `query()`.
// ═══════════════════════════════════════════════════════════════════════════════

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
  unique("users_email_unique").on(table.email),
])

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
])

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
])

export const verifications = pgTable("verifications", {
  id: text().primaryKey().notNull(),
  identifier: text().notNull(),
  value: text().notNull(),
  expiresAt: timestamp("expires_at", { mode: 'string' }).notNull(),
  createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
})

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
])
