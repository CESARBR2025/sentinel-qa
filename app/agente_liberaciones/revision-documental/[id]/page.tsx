import { obtenerDetalleInfraccionLiberaciones } from '@/lib/agente_liberaciones/actions'
import { DetalleInfraccionView } from '@/components/shared/DetalleInfraccionView'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default async function DetalleInfraccionPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const result = await obtenerDetalleInfraccionLiberaciones(id)

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#1e293b', fontFamily: 'Inter,sans-serif' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Barlow+Condensed:wght@700;800&family=Inter:wght@400;500;600&display=swap');
      `}</style>

      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '32px 48px', display: 'flex', flexDirection: 'column', gap: 32, minHeight: '100vh' }}>

        {/* Header */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
          paddingBottom: 20, borderBottom: '1px solid #e2e8f0',
          position: 'relative',
        }}>
          <div style={{ position: 'absolute', bottom: -1, left: 0, width: 64, height: 3, background: '#0891b2' }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <img src="/chaleco.png" alt="S" style={{ height: 48, objectFit: 'contain' }} />
            <div>
              <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, letterSpacing: '0.3em', color: '#0891b2', textTransform: 'uppercase', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 8, height: 8, background: '#0891b2', display: 'inline-block' }} />
                Detalle de Infracción
              </div>
              <h1 style={{ fontFamily: 'Barlow Condensed,sans-serif', fontWeight: 800, fontSize: 36, letterSpacing: '0.06em', textTransform: 'uppercase', margin: 0, color: '#0f172a', lineHeight: 1 }}>
                LIBERACIONES · REVISIÓN · DETALLE
              </h1>
            </div>
          </div>

          <Link
            href="/agente_liberaciones"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '10px 20px', borderRadius: 8,
              background: '#ffffff', color: '#475569',
              border: '1px solid #e2e8f0', fontSize: 13, fontWeight: 500,
              textDecoration: 'none', transition: 'all 0.15s',
            }}
          >
            <ArrowLeft size={16} />
            Volver a Liberaciones
          </Link>
        </div>

        {/* Content */}
        <DetalleInfraccionView
          detalle={result.data}
          error={result.error}
        />

        {/* Footer */}
        <div style={{
          marginTop: 'auto', paddingTop: 20,
          borderTop: '1px solid #e2e8f0',
          fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#94a3b8',
          letterSpacing: '0.18em', textTransform: 'uppercase',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <div>SSPM · SAN JUAN DEL RÍO · QRO</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span>SENTINEL v0.1 · LIBERACIONES · DETALLE</span>
            <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#0891b2' }} />
          </div>
        </div>

      </div>
    </div>
  )
}
