import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, MapPin, Clock, Shield, ChevronRight } from 'lucide-react'
import { verificarRolOficial, listarDespachosAsignados } from '@/lib/oficial/service'
import React from 'react'

export default async function MisDespachosPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')

  const esOficial = await verificarRolOficial(session.user.id)
  if (!esOficial) redirect('/dashboard')

  const despachos = await listarDespachosAsignados(session.user.id)

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#1e293b' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Barlow+Condensed:wght@700;800&family=Inter:wght@400;500;600&display=swap');`}</style>

      <main style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 48px' }}>

        <div style={{ marginBottom: 32 }}>
          <Link href="/oficial" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#64748b', fontFamily: 'JetBrains Mono,monospace', fontSize: 11, textDecoration: 'none', marginBottom: 16 }}>
            <ArrowLeft size={14} /> Volver al panel
          </Link>
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: '0.3em', color: '#1f355a', textTransform: 'uppercase', fontWeight: 600, display: 'block' }}>
            Oficial en Campo
          </span>
          <h1 style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 800, fontSize: 32, textTransform: 'uppercase', margin: '4px 0 0 0', color: '#0f172a' }}>
            MIS <span style={{ color: '#1f355a' }}>DESPACHOS</span>
          </h1>
          <p style={{ fontFamily: 'Inter', fontSize: 13, color: '#64748b', margin: '8px 0 0 0' }}>
            Solicitudes de despacho asignadas a ti. Al capturar el reporte de campo, la solicitud se cierra automáticamente.
          </p>
        </div>

        {despachos.length === 0 && (
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 4, padding: '64px 32px', textAlign: 'center' }}>
            <Shield size={32} color="#cbd5e1" style={{ marginBottom: 12 }} />
            <div style={{ fontFamily: 'Barlow Condensed', fontSize: 22, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: 8 }}>Sin asignaciones activas</div>
            <p style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: '#94a3b8', letterSpacing: '0.1em', margin: 0 }}>NO TIENES SOLICITUDES DE DESPACHO PENDIENTES</p>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {despachos.map(d => (
            <Link key={d.incidenteId} href={`/oficial/despachos/${d.incidenteId}`}
              style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 4, padding: '20px 24px', textDecoration: 'none', color: 'inherit', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                  <span style={{ fontFamily: 'JetBrains Mono', fontSize: 12, fontWeight: 700, color: '#0f172a' }}>{d.folio}</span>
                  {d.estatus === 'en_sitio' && (
                    <span style={{ fontFamily: 'JetBrains Mono', fontSize: 10, fontWeight: 700, padding: '2px 8px', background: '#f0fdfa', color: '#0f766e', border: '1px solid #ccfbf1', borderRadius: 2 }}>
                      EN SITIO
                    </span>
                  )}
                  {d.prioridad && (
                    <span style={{ fontFamily: 'JetBrains Mono', fontSize: 10, fontWeight: 700, padding: '2px 8px', background: '#fef3c7', color: '#b45309', border: '1px solid #fde68a', borderRadius: 2 }}>
                      {d.prioridad.toUpperCase()}
                    </span>
                  )}
                  <span style={{ fontFamily: 'Inter', fontSize: 12, color: '#64748b' }}>{d.tipoIncidente || 'Sin clasificar'}</span>
                  {d.canal === 'radio' && (
                    <span style={{ fontFamily: 'JetBrains Mono', fontSize: 10, fontWeight: 700, padding: '2px 8px', background: '#eff1f3', color: '#1c3051', border: '1px solid #c3c8d2', borderRadius: 2 }}>
                      RONDÍN
                    </span>
                  )}
                </div>
                {(d.calle || d.colonia) && (
                  <span style={{ fontFamily: 'Inter', fontSize: 12, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <MapPin size={11} />{[d.calle, d.colonia].filter(Boolean).join(', ')}
                  </span>
                )}
                {d.descripcion && (
                  <span style={{ fontFamily: 'Inter', fontSize: 12, color: '#475569', lineHeight: 1.5 }}>{d.descripcion}</span>
                )}
                <div style={{ display: 'flex', gap: 16, fontFamily: 'JetBrains Mono', fontSize: 10, color: '#94a3b8' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Clock size={10} /> DESPACHADO: {d.fechaHoraDespacho ? new Date(d.fechaHoraDespacho).toLocaleString('es-MX', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }) : '—'}
                  </span>
                  {d.unidades.length > 0 && <span>UNIDADES: {d.unidades.join(' · ')}</span>}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'JetBrains Mono', fontSize: 10, fontWeight: 700, color: '#1f355a', flexShrink: 0 }}>
                ATENDER <ChevronRight size={14} />
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}
