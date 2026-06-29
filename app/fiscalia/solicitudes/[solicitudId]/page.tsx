import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { verificarRolFiscalia, obtenerDatosAsegurado } from '@/lib/fiscalia/service'
import { obtenerEvidenciasMonitorista } from '@/lib/fiscalia/repository'
import { CapturarDetallesForm } from '@/components/fiscalia/CapturarDetallesForm'
import { DetallesAseguradoView } from '@/components/fiscalia/DetallesAseguradoView'

export default async function AseguradosFiscaliaPage({ params }: { params: Promise<{ solicitudId: string }> }) {
  const { solicitudId } = await params
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')

  const esValido = await verificarRolFiscalia(session.user.id)
  if (!esValido) redirect('/dashboard')

  const data = await obtenerDatosAsegurado(solicitudId)
  if (!data) notFound()

  const evidencias = await obtenerEvidenciasMonitorista(solicitudId)

  const datosCapturados = data.folioSija !== null

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#1e293b', fontFamily: 'Inter,sans-serif' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Barlow+Condensed:wght@700;800&family=Inter:wght@400;500;600&display=swap');
      `}</style>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 48px', display: 'flex', flexDirection: 'column', gap: 32, minHeight: '100vh' }}>

        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
          paddingBottom: 20, borderBottom: '1px solid #e2e8f0',
          position: 'relative',
        }}>
          <div style={{ position: 'absolute', bottom: -1, left: 0, width: 64, height: 3, background: '#7c3aed' }}></div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <img src="/logo_sentinel.png" alt="S" style={{ height: 48, objectFit: 'contain' }} />
            <div>
              <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, letterSpacing: '0.3em', color: '#7c3aed', textTransform: 'uppercase', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 8, height: 8, background: '#7c3aed', display: 'inline-block' }}></span>
                Asegurados · Fiscalía
              </div>
              <h1 style={{ fontFamily: 'Barlow Condensed,sans-serif', fontWeight: 800, fontSize: 28, letterSpacing: '0.06em', textTransform: 'uppercase', margin: 0, color: '#0f172a', lineHeight: 1 }}>
                {datosCapturados ? 'DETALLES DEL EXPEDIENTE' : 'CAPTURAR DETALLES'}
              </h1>
            </div>
          </div>
        </div>

        <Link href="/fiscalia/solicitudes" style={{
          display: 'inline-flex', alignItems: 'center', gap: 8, color: '#64748b',
          fontFamily: 'JetBrains Mono,monospace', fontSize: 10, textDecoration: 'none',
          textTransform: 'uppercase', letterSpacing: '0.08em', width: 'fit-content',
        }}>
          <ArrowLeft size={14} /> Regresar a solicitudes
        </Link>

        {datosCapturados ? (
          <DetallesAseguradoView solicitudId={solicitudId} data={data} evidencias={evidencias} />
        ) : (
          <CapturarDetallesForm solicitudId={solicitudId} data={data} />
        )}

        <div style={{
          marginTop: 'auto', paddingTop: 20,
          borderTop: '1px solid #e2e8f0',
          fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#94a3b8',
          letterSpacing: '0.18em', textTransform: 'uppercase',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <div>SSPM · SAN JUAN DEL RÍO · QRO</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span>SENTINEL v0.1 · FISCALÍA · ASEGURADOS</span>
            <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#7c3aed' }}></span>
          </div>
        </div>

      </div>
    </div>
  )
}
