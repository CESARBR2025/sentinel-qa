import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect, notFound } from 'next/navigation'
import { verificarRolFiscalia } from '@/lib/fiscalia/service'
import { resolverToken } from '@/lib/recursos/token-recurso'
import { obtenerExpedienteCompleto, obtenerDetenidosGuardados, obtenerFotosDetenidos, obtenerEvidenciasMonitorista } from '@/lib/fiscalia/repository'
import { ExpedienteView } from '@/components/fiscalia/ExpedienteView'
import { PrintButton } from '@/components/fiscalia/PrintButton'
import { DashboardHeader } from '@/components/partials/Header'
import { DashboardFooter } from '@/components/partials/Footer'
import { PageHeader, PageHeaderLink } from '@/components/partials/PageHeader'

export default async function ExpedientePage({ params }: { params: Promise<{ solicitudId: string }> }) {
  const { solicitudId } = await params

  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')

  const esValido = await verificarRolFiscalia(session.user.id)
  if (!esValido) redirect('/dashboard')

  // El segmento de la URL es un token opaco persistente, no el id interno.
  const idReal = await resolverToken('expediente', solicitudId)
  if (!idReal) notFound()

  const raw = await obtenerExpedienteCompleto(idReal)
  if (!raw) notFound()

  const rcId = raw.rc_id ? String(raw.rc_id) : null
  const [detenidosDireccionesRaw, fotosRaw, evidenciasRaw] = await Promise.all([
    rcId ? obtenerDetenidosGuardados(rcId) : Promise.resolve([]),
    rcId ? obtenerFotosDetenidos(rcId) : Promise.resolve([]),
    obtenerEvidenciasMonitorista(idReal),
  ])

  const detenidosDirecciones = detenidosDireccionesRaw.map((d) => ({
    id: String(d.id ?? ''),
    nombreDetenido: d.nombreDetenido ?? null,
    apPaterno: d.apPaterno ?? null,
    apMaterno: d.apMaterno ?? null,
    calle: d.calle ?? null,
    colonia: d.colonia ?? null,
    numero: d.numero ?? null,
    codPostal: d.codPostal ?? null,
    latitud: d.latitud ?? null,
    longitud: d.longitud ?? null,
  }))

  const fotos = fotosRaw.map((f) => ({ id: Number(f.id), url: f.url_archivo, tipoFoto: f.tipo_foto, detenidoIndex: null }))
  const evidencias = evidenciasRaw.map((e) => ({ id: e.id, urlArchivo: e.urlArchivo, nombreArchivo: e.nombreArchivo }))

  const data = { raw, detenidosDirecciones, fotos, evidencias }

  const folioDenuncia = String(raw.d1_folio_denuncia ?? '')
  const user = session.user as { name: string; apellido?: string; email?: string }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f8fafc', color: '#1e293b', fontFamily: 'Inter, sans-serif' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Barlow+Condensed:wght@700;800&family=Inter:wght@400;500;600&display=swap');`}</style>

      <DashboardHeader
        user={{ name: user.name, apellido: user.apellido, email: user.email || '' }}
        roleLabel="Expediente Digital"
      />

      <main className="pad-pagina" style={{ width: '100%', flex: 1, display: 'flex', flexDirection: 'column', gap: 24 }}>
        <PageHeader
          title={folioDenuncia || 'Expediente'}
          accentColor="#7c3aed"
          subtitle="Expediente digital completo del reporte"
          actions={<>
            <PageHeaderLink href="/fiscalia/solicitudes" variant="secondary">← Solicitudes</PageHeaderLink>
            <PrintButton />
          </>}
        />

        <ExpedienteView data={data} />

        <DashboardFooter />
      </main>
    </div>
  )
}
