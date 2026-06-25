import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db/index'
import { users, roles, catTiposEmergencia, catTiposIncidente, catPrioridades, catMediosCanalizacion } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { FormularioRecorrido } from '@/components/oficial/FormularioRecorrido'

export default async function NuevoReporteOficialPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')

  const [userRole] = await db
    .select({ rolNombre: roles.nombre })
    .from(users)
    .leftJoin(roles, eq(users.rolId, roles.id))
    .where(eq(users.id, session.user.id))
    .limit(1)

  if (userRole?.rolNombre !== 'Oficial de Campo') redirect('/dashboard')

  const [emergencias, tiposIncidente, prioridades, canalizaciones] = await Promise.all([
    db.select().from(catTiposEmergencia).where(eq(catTiposEmergencia.activo, true)),
    db.select().from(catTiposIncidente).where(eq(catTiposIncidente.activo, true)),
    db.select().from(catPrioridades).where(eq(catPrioridades.activo, true)),
    db.select().from(catMediosCanalizacion).where(eq(catMediosCanalizacion.activo, true)),
  ])

  return (
    <FormularioRecorrido
      user={session.user}
      catalogos={{ emergencias, incidentes: tiposIncidente, prioridades, canalizaciones }}
    />
  )
}
