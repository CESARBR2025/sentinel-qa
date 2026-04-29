import { auth }    from '@/lib/auth'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { db }       from '@/lib/db/index'
import { notificaciones } from '@/lib/db/schema'
import { eq, and, desc } from 'drizzle-orm'
import { generarAlertasBusquedas } from '@/lib/notificaciones/checker'

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  // Generate any new alerts (idempotent — unique constraint prevents duplicates)
  await generarAlertasBusquedas(session.user.id)

  const notifs = await db
    .select()
    .from(notificaciones)
    .where(and(
      eq(notificaciones.userId, session.user.id),
      eq(notificaciones.leida, false),
    ))
    .orderBy(desc(notificaciones.creadoEn))

  return NextResponse.json(notifs)
}
