import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { notFound } from 'next/navigation'
import { ProfileDropdown } from '@/components/fiscalia/ProfileDropdown'
import { obtenerDetenidoParaRol } from '@/lib/detenidos-compartido'
import { SubirFotoDetenido } from '@/components/fiscalia/SubirFotoDetenido'
import Link from 'next/link'
import { ArrowLeft, User, Camera, Clock, Shield } from 'lucide-react'

export default async function DetenidoFiscaliaDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')

  const { id } = await params
  const detenido = await obtenerDetenidoParaRol(id, 'FISCALIA')
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

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 48px', display: 'flex', flexDirection: 'column', gap: 32, minHeight: '100vh' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingBottom: 20, borderBottom: '1px solid #e2e8f0', position: 'relative' }}>
          <div style={{ position: 'absolute', bottom: -1, left: 0, width: 64, height: 3, background: '#7c3aed' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <img src="/chaleco.png" alt="S" style={{ height: 48, objectFit: 'contain' }} />
            <div>
              <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, letterSpacing: '0.3em', color: '#7c3aed', textTransform: 'uppercase', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 8, height: 8, background: '#7c3aed', display: 'inline-block' }} />
                Detenido · Fiscalía
              </div>
              <h1 style={{ fontFamily: 'Barlow Condensed,sans-serif', fontWeight: 800, fontSize: 28, letterSpacing: '0.06em', textTransform: 'uppercase', margin: 0, color: '#0f172a', lineHeight: 1 }}>
                {detenido.nombre_detenido}
              </h1>
            </div>
          </div>
          <ProfileDropdown name={user.name} apellido={user.apellido} email={user.email || ''} />
        </div>

        <Link href="/fiscalia/detenidos" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#64748b', fontFamily: 'JetBrains Mono,monospace', fontSize: 10, textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.08em', width: 'fit-content' }}>
          <ArrowLeft size={14} /> Regresar a detenidos
        </Link>
        <Link href="/fiscalia" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#94a3b8', fontFamily: 'JetBrains Mono,monospace', fontSize: 9, textDecoration: 'none', marginLeft: 16 }}>
          ← Menú Fiscalía
        </Link>

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
            <span>SENTINEL v0.1 · FISCALÍA · DETENIDO</span>
            <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#7c3aed' }} />
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
