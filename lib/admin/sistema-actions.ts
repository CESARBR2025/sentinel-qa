'use server'

import { auth }            from '@/lib/auth'
import { headers }         from 'next/headers'
import { redirect }        from 'next/navigation'
import { revalidatePath }  from 'next/cache'
import { getUserWithRole } from '@/lib/auth/helpers'
import pool, { query }     from '@/lib/db'
import { tryActionRaw, ValidationError } from '@/lib/error-handler'
import { FRASE_CONFIRMACION_RESET, TABLAS_RESET_SISTEMA } from './sistema-constants'

async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')

  const user = await getUserWithRole(session.user.id)
  if (!user?.esAdmin) redirect('/dashboard')
  return session
}

export async function resetearSistema(formData: FormData) {
  const session = await requireAdmin()

  const frase = String(formData.get('frase') ?? '').trim()
  if (frase !== FRASE_CONFIRMACION_RESET) {
    throw new ValidationError(`Frase de confirmación incorrecta. Debes escribir exactamente: ${FRASE_CONFIRMACION_RESET}`)
  }

  await tryActionRaw(async () => {
    const cliente = await pool.connect()
    try {
      await cliente.query('BEGIN')
      const lista = TABLAS_RESET_SISTEMA.map(t => `"${t}"`).join(', ')
      await cliente.query(`TRUNCATE TABLE ${lista} RESTART IDENTITY CASCADE`)
      await cliente.query('COMMIT')
    } catch (err) {
      await cliente.query('ROLLBACK')
      throw err
    } finally {
      cliente.release()
    }
  })

  // El reset vació audit_log también — esta es la primera fila que queda,
  // así el reset en sí no desaparece sin dejar rastro de quién lo hizo.
  await query(
    `INSERT INTO audit_log (user_id, accion, entidad, entidad_id, payload)
     VALUES ($1, 'DELETE', 'sistema', 'reset', $2)`,
    [session.user.id, JSON.stringify({ tablasVaciadas: TABLAS_RESET_SISTEMA.length, tablas: TABLAS_RESET_SISTEMA })],
  ).catch(err => console.error('[reset-sistema] no se pudo registrar el audit_log post-reset:', err))

  console.log(`[reset-sistema] Ejecutado por ${session.user.email ?? session.user.id} — ${TABLAS_RESET_SISTEMA.length} tablas vaciadas.`)

  revalidatePath('/', 'layout')
}
