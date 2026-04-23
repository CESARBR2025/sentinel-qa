/**
 * Crea el primer usuario administrador del sistema.
 * Ejecutar: npm run db:create-admin
 */
import { loadEnvConfig } from '@next/env'
import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import { eq } from 'drizzle-orm'
import * as schema from './schema'
import { hashPassword } from 'better-auth/crypto'
import { generateId } from 'better-auth'

loadEnvConfig(process.cwd())

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const db   = drizzle(pool, { schema })

const ADMIN = {
  nombre:   'CARLOS ADRIAN',
  apellido: 'TREJO RAMIREZ',
  email:    'triniummx@gmail.com',
  password: 'Admin@SSPM2025!',  // Cambia esto en el primer login
}

async function main() {
  // Verificar si ya existe
  const existing = await db.query.users.findFirst({
    where: eq(schema.users.email, ADMIN.email),
  })
  if (existing) {
    console.log('⚠  El usuario ya existe:', ADMIN.email)
    await pool.end()
    return
  }

  // Obtener rol Administrador
  const rol = await db.query.roles.findFirst({
    where: eq(schema.roles.nombre, 'Administrador'),
  })
  if (!rol) {
    console.error('✗ No se encontró el rol Administrador. Ejecuta npm run db:seed primero.')
    await pool.end()
    process.exit(1)
  }

  const userId       = generateId()
  const accountId    = generateId()
  const passwordHash = await hashPassword(ADMIN.password)

  // Insertar usuario
  await db.insert(schema.users).values({
    id:        userId,
    name:      ADMIN.nombre,
    apellido:  ADMIN.apellido,
    email:     ADMIN.email,
    emailVerified: true,
    rolId:     rol.id,
    activo:    true,
    twoFactorEnabled: false,
  })

  // Insertar cuenta (credenciales email/password)
  await db.insert(schema.accounts).values({
    id:         accountId,
    accountId:  userId,
    providerId: 'credential',
    userId:     userId,
    password:   passwordHash,
  })

  console.log('✓ Usuario administrador creado:')
  console.log('  Nombre:     ', ADMIN.nombre, ADMIN.apellido)
  console.log('  Email:      ', ADMIN.email)
  console.log('  Contraseña: ', ADMIN.password)
  console.log('  Rol:        ', rol.nombre)
  console.log('')
  console.log('  ⚠  Cambia la contraseña después del primer login.')

  await pool.end()
}

main().catch(e => { console.error(e); process.exit(1) })
