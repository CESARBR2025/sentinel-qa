import { auth }    from '@/lib/auth'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { query }   from '@/lib/db'
import { generarAlertasBusquedas } from '@/lib/notificaciones/checker'

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  await generarAlertasBusquedas(session.user.id)

  const notifs = await query(
    `SELECT id, user_id AS "userId", tipo, titulo, mensaje, href, leida, ficha_id AS "fichaId", hito, creado_en AS "creadoEn" FROM notificaciones WHERE user_id = $1 AND leida = false ORDER BY creado_en DESC`,
    [session.user.id],
  )
  return NextResponse.json(notifs.rows)
}
