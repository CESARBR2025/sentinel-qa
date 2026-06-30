import { db }       from '@/lib/db/index'
import { auditLog } from '@/lib/db/schema'
import { headers }  from 'next/headers'

type Accion = 'CREATE' | 'UPDATE' | 'DELETE' | 'VIEW'

export async function registrarAudit({
  userId,
  accion,
  entidad,
  entidadId,
  payload,
}: {
  userId:    string
  accion:    Accion
  entidad:   string
  entidadId: string
  payload?:  object
}) {
  const hdrs      = await headers()
  const ip        = hdrs.get('x-forwarded-for')?.split(',')[0]?.trim()
               ?? hdrs.get('x-real-ip')
               ?? null
  const userAgent = hdrs.get('user-agent') ?? null

  // Fire-and-forget — no bloqueamos la operación principal si el audit falla
  db.insert(auditLog).values({
    userId,
    accion,
    entidad,
    entidadId,
    payload:   payload ? JSON.stringify(payload) : null,
    ip,
    userAgent,
  }).catch(err => console.error('[audit]', err))
}