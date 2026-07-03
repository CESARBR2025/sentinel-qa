import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { notFound, redirect } from 'next/navigation'
import { query } from '@/lib/db'
import { ArrowLeft, Clock, User, FileText } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { GaleriaEvidencias } from '@/components/monitorista/GaleriaEvidencias'
import { tienePermiso } from '@/lib/monitorista/permisos'

export default async function DetalleSolicitudPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')
  if (!(await tienePermiso(session.user.id, 'solicitudes', 'ver'))) redirect('/monitorista')

  const solResult = await query<Record<string, unknown>>(
    `SELECT id, incidente_id AS "incidenteId", folio_incidente AS "folioIncidente",
            solicitado_nombre AS "solicitadoNombre", descripcion, status,
            creado_en AS "creadoEn", completado_en AS "completadoEn"
     FROM solicitudes_evidencia WHERE id = $1 LIMIT 1`,
    [id],
  )
  const sol = solResult.rows[0] as Record<string, unknown> | undefined

  if (!sol) notFound()

  const evsResult = await query<Record<string, unknown>>(
    `SELECT e.id, e.tipo, e.nombre_original AS "nombreOriginal", e.url_expediente AS "urlExpediente",
            u.name AS "subidoPorNombre", e.creado_en AS "creadoEn"
     FROM evidencias e
     LEFT JOIN users u ON e.subido_por = u.id
     WHERE e.solicitud_id = $1
     ORDER BY e.creado_en`,
    [id],
  )
  const evs = evsResult.rows

  const statusBadge = getStatusBadge(sol.status)

  return (
    <div style={{ minHeight: '100vh', background: '#050810', color: '#d8e0f0', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Barlow+Condensed:wght@700;800&family=Inter:wght@400;500;600&display=swap');
      `}</style>

      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 64px' }}>
        <Link href="/monitorista/solicitudes" style={{
          display: 'inline-flex', alignItems: 'center', gap: 8, color: '#5c74a1',
          fontFamily: 'JetBrains Mono', fontSize: 11, textDecoration: 'none',
          marginBottom: 32, textTransform: 'uppercase', letterSpacing: '0.1em',
        }}>
          <ArrowLeft size={14} /> Bandeja
        </Link>

        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
          marginBottom: 32, paddingBottom: 24, borderBottom: '1px solid rgba(27,39,66,0.8)',
        }}>
          <div>
            <div style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: '#4a5878', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 8 }}>
              Solicitud de Evidencias
            </div>
            <h1 style={{ fontFamily: 'Barlow Condensed', fontSize: 36, fontWeight: 700, color: '#ffffff', margin: 0 }}>
              {sol.folioIncidente || sol.incidenteId.substring(0, 12)}
            </h1>
          </div>
          <span style={statusBadge.style}>{statusBadge.label}</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: 32 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <section style={cardStyle}>
              <h2 style={sectionTitle}><FileText size={18} /> DESCRIPCIÓN DE LA SOLICITUD</h2>
              <p style={{ fontSize: 14, lineHeight: 1.7, color: '#8f9fbf', whiteSpace: 'pre-wrap', margin: 0 }}>{sol.descripcion}</p>
            </section>

            <GaleriaEvidencias evidencias={evs as any} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={cardStyle}>
              <h2 style={sectionTitle}><User size={18} /> SOLICITANTE</h2>
              <div style={{ fontFamily: 'JetBrains Mono', fontSize: 14, color: '#d8e0f0' }}>{sol.solicitadoNombre}</div>
            </div>
            <div style={cardStyle}>
              <h2 style={sectionTitle}><Clock size={18} /> FECHAS</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div>
                  <div style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: '#4a5878', textTransform: 'uppercase' }}>Creada</div>
                  <div style={{ fontFamily: 'JetBrains Mono', fontSize: 12, color: '#d8e0f0' }}>
                    {new Date(sol.creadoEn).toLocaleString('es-MX', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                {sol.completadoEn && (
                  <div>
                    <div style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: '#4a5878', textTransform: 'uppercase' }}>Completada</div>
                    <div style={{ fontFamily: 'JetBrains Mono', fontSize: 12, color: '#d8e0f0' }}>
                      {new Date(sol.completadoEn).toLocaleString('es-MX', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

const cardStyle: React.CSSProperties = {
  background: 'rgba(11,18,32,0.6)', backdropFilter: 'blur(10px)',
  border: '1px solid rgba(27,39,66,0.8)', padding: 32, borderRadius: 2,
}
const sectionTitle: React.CSSProperties = {
  fontFamily: 'Barlow Condensed', fontSize: 16, fontWeight: 700,
  textTransform: 'uppercase', color: '#ffffff', marginBottom: 20,
  display: 'flex', alignItems: 'center', gap: 10, letterSpacing: '0.05em',
}

function getStatusBadge(status: string): { label: string; style: React.CSSProperties } {
  const base: React.CSSProperties = { padding: '6px 14px', borderRadius: 2, fontSize: 11, fontWeight: 700, fontFamily: 'JetBrains Mono', textTransform: 'uppercase', border: '1px solid' }
  switch (status) {
    case 'pendiente': return { label: 'Pendiente', style: { ...base, background: 'rgba(212,164,58,0.1)', color: '#d4a43a', borderColor: 'rgba(212,164,58,0.3)' } }
    case 'completada': return { label: 'Completada', style: { ...base, background: 'rgba(74,158,106,0.1)', color: '#4a9e6a', borderColor: 'rgba(74,158,106,0.3)' } }
    case 'cancelada': return { label: 'Cancelada', style: { ...base, background: 'rgba(192,34,58,0.1)', color: '#c0223a', borderColor: 'rgba(192,34,58,0.3)' } }
    default: return { label: status, style: { ...base } }
  }
}
