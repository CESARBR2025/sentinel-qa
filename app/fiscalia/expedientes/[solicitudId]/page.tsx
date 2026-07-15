import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { verificarRolFiscalia } from '@/lib/fiscalia/service'
import { obtenerExpedienteCompleto, obtenerDetenidosGuardados, obtenerFotosDetenidos, obtenerEvidenciasMonitorista } from '@/lib/fiscalia/repository'
import { ExpedienteView } from '@/components/fiscalia/ExpedienteView'
import { PrintButton } from '@/components/fiscalia/PrintButton'

export default async function ExpedientePage({ params }: { params: Promise<{ solicitudId: string }> }) {
  const { solicitudId } = await params

  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')

  const esValido = await verificarRolFiscalia(session.user.id)
  if (!esValido) redirect('/dashboard')

  const raw = await obtenerExpedienteCompleto(solicitudId)
  if (!raw) notFound()

  const rcId = raw.rc_id ? String(raw.rc_id) : null
  const [detenidosDireccionesRaw, fotosRaw, evidenciasRaw] = await Promise.all([
    rcId ? obtenerDetenidosGuardados(rcId) : Promise.resolve([]),
    rcId ? obtenerFotosDetenidos(rcId) : Promise.resolve([]),
    obtenerEvidenciasMonitorista(solicitudId),
  ])

  const detenidosDirecciones = detenidosDireccionesRaw.map((d: any) => ({
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

  const fotos = fotosRaw.map((f: any) => ({ id: f.id, url: f.url_archivo, tipoFoto: f.tipo_foto, detenidoIndex: null }))
  const evidencias = evidenciasRaw.map((e: any) => ({ id: e.id, urlArchivo: e.urlArchivo, nombreArchivo: e.nombreArchivo }))

  const data = { raw, detenidosDirecciones, fotos, evidencias }

  const folioDenuncia = String(raw.d1_folio_denuncia ?? '')

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#1e293b', fontFamily: 'Inter,sans-serif' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Barlow+Condensed:wght@700;800&family=Inter:wght@400;500;600&display=swap');`}</style>

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '32px 48px', display: 'flex', flexDirection: 'column', gap: 24, minHeight: '100vh' }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
          paddingBottom: 20, borderBottom: '1px solid #e2e8f0', position: 'relative',
        }}>
          <div style={{ position: 'absolute', bottom: -1, left: 0, width: 64, height: 3, background: '#7c3aed' }} />
          <div>
            <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, letterSpacing: '0.3em', color: '#7c3aed', textTransform: 'uppercase', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 8, height: 8, background: '#7c3aed', display: 'inline-block' }} />
              Expediente Digital
            </div>
            <h1 style={{ fontFamily: 'Barlow Condensed,sans-serif', fontWeight: 800, fontSize: 32, letterSpacing: '0.06em', textTransform: 'uppercase', margin: '4px 0 0', color: '#0f172a', lineHeight: 1 }}>
              {folioDenuncia || 'Expediente'}
            </h1>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <PrintButton />
          </div>
        </div>

        <Link href="/fiscalia/solicitudes" style={{
          display: 'inline-flex', alignItems: 'center', gap: 8, color: '#64748b',
          fontFamily: 'JetBrains Mono,monospace', fontSize: 10, textDecoration: 'none',
          textTransform: 'uppercase', letterSpacing: '0.08em', width: 'fit-content',
        }}>
          <ArrowLeft size={14} /> Regresar a solicitudes
        </Link>

        <ExpedienteView data={data} />

        <div style={{
          marginTop: 'auto', paddingTop: 20, borderTop: '1px solid #e2e8f0',
          fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#94a3b8',
          letterSpacing: '0.18em', textTransform: 'uppercase',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <div>SSPM · SAN JUAN DEL RÍO · QRO</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span>CENTINELA v1.2 · FISCALÍA · EXPEDIENTE</span>
            <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#7c3aed' }} />
          </div>
        </div>
      </div>
    </div>
  )
}
