import { query }  from '@/lib/db'
import { headers } from 'next/headers'

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

  query(
    `INSERT INTO audit_log (user_id, accion, entidad, entidad_id, payload, ip, user_agent)
     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    [userId, accion, entidad, entidadId, payload ? JSON.stringify(payload) : null, ip, userAgent],
  ).catch(err => console.error('[audit]', err))
}