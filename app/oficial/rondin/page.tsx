import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { verificarRolOficial, obtenerMiPerfil, listarRondinesOficial } from '@/lib/oficial/service'
import { getCatalogos } from '@/lib/911/service'
import { generarFolioIncidente } from '@/lib/incidentes/folio'
import { ToastExito } from '@/components/oficial/ToastExito'
import { RondinPageClient } from '@/components/oficial/rondin/RondinPageClient'

export default async function RondinOficialPage({ searchParams }: { searchParams: Promise<{ exito?: string; folio?: string }> }) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')

  const esOficial = await verificarRolOficial(session.user.id)
  if (!esOficial) redirect('/dashboard')

  const [catalogos, perfil, folioData, rondines] = await Promise.all([
    getCatalogos(),
    obtenerMiPerfil(session.user.id),
    generarFolioIncidente(),
    listarRondinesOficial(session.user.id),
  ])

  const nombreOficial = perfil
    ? `${perfil.ofiNombre} ${perfil.ofiApPaterno}`.trim()
    : (session.user as { name: string }).name

  const params = await searchParams

  return (
    <>
      <ToastExito show={params.exito === '1'} folio={params.folio} />
      <RondinPageClient
        rondines={rondines}
        catalogos={{ emergencias: catalogos.emergencias, subtipos: catalogos.subtipos, incidentes: catalogos.incidentes, prioridades: catalogos.prioridades }}
        nombreOficial={nombreOficial}
        folio={folioData.folio}
        folioConsecutivo={folioData.consecutivo}
        folioNuevo={params.exito === '1' ? params.folio : undefined}
      />
    </>
  )
}
