/**
 * Crea el primer usuario administrador del sistema.
 * Ejecutar: npm run db:create-admin
 */
import { loadEnvConfig } from '@next/env'
import { Pool } from 'pg'
import { hashPassword } from 'better-auth/crypto'
import { generateId } from 'better-auth'

loadEnvConfig(process.cwd())

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

const ADMIN = {
  nombre:   'CARLOS ADRIAN',
  apellido: 'TREJO RAMIREZ',
  email:    'triniummx@gmail.com',
  password: 'Admin@SSPM2025!',
}

async function main() {
  const existing = (await pool.query(
    `SELECT id FROM users WHERE email = $1 LIMIT 1`,
    [ADMIN.email],
  )).rows[0]

  if (existing) {
    console.log('⚠  El usuario ya existe:', ADMIN.email)
    await pool.end()
    return
  }

  const rol = (await pool.query<{ id: number; nombre: string }>(
    `SELECT id, nombre FROM roles WHERE nombre = $1 LIMIT 1`,
    ['Administrador'],
  )).rows[0]

  if (!rol) {
    console.error('✗ No se encontró el rol Administrador. Ejecuta npm run db:seed primero.')
    await pool.end()
    process.exit(1)
  }

  const userId       = generateId()
  const accountId    = generateId()
  const passwordHash = await hashPassword(ADMIN.password)

  await pool.query(
    `INSERT INTO users (id, name, apellido, email, email_verified, rol_id, activo, two_factor_enabled)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
    [userId, ADMIN.nombre, ADMIN.apellido, ADMIN.email, true, rol.id, true, false],
  )

  await pool.query(
    `INSERT INTO accounts (id, account_id, provider_id, user_id, password)
     VALUES ($1, $2, $3, $4, $5)`,
    [accountId, userId, 'credential', userId, passwordHash],
  )

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
