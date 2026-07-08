'use server'

import { auth }           from '@/lib/auth'
import { headers }        from 'next/headers'
import { redirect }       from 'next/navigation'
import { query }          from '@/lib/db'
import { guardarChecklist } from './service'
import { tienePermiso, Accion } from '@/lib/auxiliar/permisos'

async function requireAuxiliar(accion: Accion = 'crear') {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')
  const u = await query<{ rolnombre: string }>(
    `SELECT r.nombre AS rolnombre
     FROM users u
     LEFT JOIN roles r ON u.rol_id = r.id
     WHERE u.id = $1
     LIMIT 1`,
    [session.user.id],
  )
  const permitidos = ['Administrador', 'Auxiliar de Novedades', 'Auxiliar']
  if (!u.rows[0]?.rolnombre || !permitidos.includes(u.rows[0].rolnombre)) redirect('/dashboard')
  if (!(await tienePermiso(session.user.id, 'auxiliar_checklist', accion))) redirect('/dashboard')
  return session
}

const bool = (fd: FormData, k: string) => fd.get(k) === 'true' || fd.get(k) === 'on'
const str  = (fd: FormData, k: string) => (fd.get(k) as string | null)?.trim() || null

export async function upsertChecklistAction(formData: FormData) {
  const session = await requireAuxiliar()

  const reporteCampoId = formData.get('reporteCampoId') as string
  const reporteD1Id    = formData.get('reporteD1Id')    as string

  await guardarChecklist({
    reporteCampoId,
    reporteD1Id,
    denunciaCuD1:         bool(formData, 'denunciaCuD1'),
    denunciaCuD1Duracion: str(formData,  'denunciaCuD1Duracion'),
    detenidoFge:          bool(formData, 'detenidoFge'),
    detenidoFgr:          bool(formData, 'detenidoFgr'),
    detenidoJc:           bool(formData, 'detenidoJc'),
    convenios:            bool(formData, 'convenios'),
    trabajosComunidad:    bool(formData, 'trabajosComunidad'),
    coincideGps:          bool(formData, 'coincideGps'),
    visualizoCamara:      bool(formData, 'visualizoCamara'),
    tiPi:                 bool(formData, 'tiPi'),
    observaciones:        str(formData,  'observaciones'),
    capturadoPor:         session.user.id,
  })

  redirect(`/auxiliar/checklist/${reporteCampoId}?d1=${reporteD1Id}&exito=1`)
}