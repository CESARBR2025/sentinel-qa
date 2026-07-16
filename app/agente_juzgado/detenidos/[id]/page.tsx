import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { notFound } from 'next/navigation'
import { obtenerDetenidoParaRol } from '@/lib/detenidos-compartido'
import { SubirFotoDetenido } from '@/components/agente_juzgado/SubirFotoDetenido'
import { User, Camera, Clock, Shield } from 'lucide-react'
import { DashboardHeader } from '@/components/partials/Header'
import { APP_VERSION } from "@/lib/constants"

export default async function DetenidoJuzgadoDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')

  const { id } = await params
  const detenido = await obtenerDetenidoParaRol(id, 'JUZGADO_CIVICO')
  if (!detenido) notFound()

  const user = session.user as { name: string; apellido?: string; email?: string }

  const labelFoto: Record<string, string> = {
    frontal: 'Frontal',
    derecho: 'Lado Derecho',
    izquierdo: 'Lado Izquierdo',
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#1e293b', fontFamily: 'Inter,sans-serif' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Barlow+Condensed:wght@700;800&family=Inter:wght@400;500;600&display=swap');
      `}</style>

      <DashboardHeader
        user={{ name: user.name, apellido: user.apellido, email: user.email || '' }}
        roleLabel="Detenido · Juzgado"
        backHref="/agente_juzgado/detenidos"
        backLabel="Detenidos"
      />

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 48px', display: 'flex', flexDirection: 'column', gap: 32, minHeight: '100vh' }}>
        <h1 style={{ fontFamily: 'Barlow Condensed,sans-serif', fontWeight: 800, fontSize: 28, letterSpacing: '0.06em', textTransform: 'uppercase', margin: 0, color: '#0f172a', lineHeight: 1 }}>
          {detenido.nombre_detenido}
        </h1>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: 24, borderRadius: 2 }}>
              <div style={{ fontFamily: 'Barlow Condensed,sans-serif', fontSize: 18, fontWeight: 700, textTransform: 'uppercase', color: '#0f172a', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10, letterSpacing: '0.05em' }}>
                <Camera size={18} /> FOTOS SOLICITADAS
              </div>
              <div style={{ fontFamily: 'Inter,sans-serif', fontSize: 12, color: '#64748b', marginBottom: 16, lineHeight: 1.5 }}>
                El Monitorista solicitó estas fotos. Toma las fotografías y súbelas aquí.
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {detenido.fotos.map(f => (
                  <SubirFotoDetenido
                    key={f.tipo_foto}
                    reporteCampoId={detenido.id}
                    tipoFoto={f.tipo_foto}
                    label={labelFoto[f.tipo_foto] || f.tipo_foto}
                    estado={f.estado}
                    enviadoA={f.enviado_a}
                    urlArchivo={f.url_archivo}
                    nombreArchivo={f.nombre_archivo}
                  />
                ))}
              </div>
            </div>

            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: 24, borderRadius: 2 }}>
              <div style={{ fontFamily: 'Barlow Condensed,sans-serif', fontSize: 18, fontWeight: 700, textTransform: 'uppercase', color: '#0f172a', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10, letterSpacing: '0.05em' }}>
                <User size={18} /> DATOS DEL DETENIDO
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                {detenido.tipo_incidente && <Campo label="Evento/Incidente" value={detenido.tipo_incidente} />}
                {detenido.delito && <Campo label="Delito" value={detenido.delito} />}
                {detenido.marco_legal && <Campo label="Marco Legal" value={detenido.marco_legal} />}
                {detenido.falta_administrativa && <Campo label="Falta Administrativa" value={detenido.falta_administrativa} />}
                {detenido.modus_operandi && <Campo label="Modus Operandi" value={detenido.modus_operandi} />}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: 24, borderRadius: 2 }}>
              <div style={{ fontFamily: 'Barlow Condensed,sans-serif', fontSize: 16, fontWeight: 700, textTransform: 'uppercase', color: '#0f172a', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10, letterSpacing: '0.05em' }}>
                <Clock size={18} /> FECHA
              </div>
              <Campo label="Reporte" value={new Date(detenido.created_at).toLocaleString('es-MX', { day: '2-digit', month: '2-digit', year: 'numeric' })} />
            </div>
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: 24, borderRadius: 2 }}>
              <div style={{ fontFamily: 'Barlow Condensed,sans-serif', fontSize: 16, fontWeight: 700, textTransform: 'uppercase', color: '#0f172a', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10, letterSpacing: '0.05em' }}>
                <Shield size={18} /> MARCAS
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {detenido.hay_detencion && <span style={marcaStyle}>✅ Detención</span>}
                {detenido.hay_vehiculo && <span style={marcaStyle}>✅ Vehículo Involucrado</span>}
                {detenido.hay_cateo && <span style={marcaStyle}>✅ Cateo Realizado</span>}
                {!detenido.hay_detencion && !detenido.hay_vehiculo && !detenido.hay_cateo && (
                  <span style={{ fontFamily: 'Inter,sans-serif', fontSize: 12, color: '#94a3b8' }}>Sin marcas</span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 'auto', paddingTop: 20, borderTop: '1px solid #e2e8f0', fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#94a3b8', letterSpacing: '0.18em', textTransform: 'uppercase', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>SSPM · SAN JUAN DEL RÍO · QRO</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span>CENTINELA {APP_VERSION} · JUZGADO · DETENIDO</span>
            <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#059669' }} />
          </div>
        </div>
      </div>
    </div>
  )
}

function Campo({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600, marginBottom: 4 }}>{label}</div>
      <div style={{ fontFamily: 'Inter,sans-serif', fontSize: 13, color: '#1e293b' }}>{value}</div>
    </div>
  )
}

const marcaStyle: React.CSSProperties = { fontFamily: 'JetBrains Mono,monospace', fontSize: 10, padding: '4px 10px', background: '#f0fdf4', color: '#15803d', border: '1px solid #bbf7d0', borderRadius: 2, display: 'inline-block' }
