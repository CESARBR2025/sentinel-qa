'use server'

import { auth }           from '@/lib/auth'
import { headers }        from 'next/headers'
import { redirect }       from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { db }             from '@/lib/db/index'
import { users, roles }   from '@/lib/db/schema'
import { eq }             from 'drizzle-orm'
import { guardarChecklist } from './service'

async function requireAuxiliar() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')
  const [u] = await db
    .select({ rolNombre: roles.nombre })
    .from(users)
    .leftJoin(roles, eq(users.rolId, roles.id))
    .where(eq(users.id, session.user.id))
    .limit(1)
  const permitidos = ['Administrador', 'Auxiliar de Novedades', 'Auxiliar']
  if (!u?.rolNombre || !permitidos.includes(u.rolNombre)) redirect('/dashboard')
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