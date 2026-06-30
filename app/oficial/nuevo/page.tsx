import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { verificarRolOficial, obtenerCatalogos } from '@/lib/oficial/service'
import { FormularioRecorrido } from '@/components/oficial/FormularioRecorrido'

export default async function NuevoReporteOficialPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')

  const esOficial = await verificarRolOficial(session.user.id)
  if (!esOficial) redirect('/dashboard')

  const catalogos = await obtenerCatalogos()

  return (
    <FormularioRecorrido
      user={session.user}
      catalogos={catalogos}
    />
  )
}
