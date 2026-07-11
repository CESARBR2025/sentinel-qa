import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { verificarRolOficial, obtenerCatalogos, obtenerMiPerfil } from '@/lib/oficial/service'
import { FormRondinEscalado } from '@/components/911/radio/FormRondinEscalado'

export default async function RondinOficialPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')

  const esOficial = await verificarRolOficial(session.user.id)
  if (!esOficial) redirect('/dashboard')

  const [catalogos, perfil] = await Promise.all([
    obtenerCatalogos(),
    obtenerMiPerfil(session.user.id),
  ])

  const nombreOficial = perfil
    ? `${perfil.ofiNombre} ${perfil.ofiApPaterno}`.trim()
    : (session.user as { name: string }).name

  return (
    <FormRondinEscalado
      catalogos={{ emergencias: catalogos.emergencias, incidentes: catalogos.incidentes, prioridades: catalogos.prioridades }}
      backHref="/oficial"
      nombreOficialDefault={nombreOficial}
    />
  )
}
