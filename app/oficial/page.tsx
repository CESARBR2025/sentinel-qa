import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ClipboardList, History, AlertTriangle, FileBadge2, Settings, Shield, Radio } from 'lucide-react'
import { ProfileDropdown } from '@/components/oficial/ProfileDropdown'
import { ToastExito } from '@/components/oficial/ToastExito'
import { verificarRolOficial, contarDenunciasPendientesOficial, contarDespachosAsignadosOficial } from '@/lib/oficial/service'

export default async function OficialDashboardPage({ searchParams }: { searchParams: Promise<{ exito?: string; folio?: string }> }) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')

  const esOficial = await verificarRolOficial(session.user.id)
  if (!esOficial) redirect('/dashboard')

  const user = session.user as { name: string; apellido?: string; email: string }

  const [denunciasPendientes, despachosAsignados] = await Promise.all([
    contarDenunciasPendientesOficial(session.user.id),
    contarDespachosAsignadosOficial(session.user.id),
  ])

  const params = await searchParams

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#1e293b', fontFamily: 'Inter,sans-serif' }}>
      <ToastExito show={params.exito === '1'} folio={params.folio} />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Barlow+Condensed:wght@700;800&family=Inter:wght@400;500;600&display=swap');
        .card-o {
          background: #ffffff; border: 1px solid #e2e8f0; padding: 32px;
          text-decoration: none; transition: all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
          display: flex; flex-direction: column; min-height: 280px;
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); cursor: pointer;
          position: relative; overflow: hidden; width: 100%; max-width: 520px;
        }
        .card-o:hover { border-color: #1f355a; transform: translateY(-5px); box-shadow: 0 20px 40px -12px rgba(31, 53, 90,0.15); }
        .card-o:hover .co-top { width: 100%; }
        .card-o:hover .co-left { height: 100%; }
        .card-o:hover .co-icon { color: #1f355a; transform: scale(1.1); }
      `}</style>

      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '40px 64px', display: 'flex', flexDirection: 'column', gap: 48, minHeight: '100vh' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingBottom: 24, borderBottom: '1px solid #e2e8f0', position: 'relative' }}>
          <div style={{ position: 'absolute', bottom: -1, left: 0, width: 64, height: 3, background: '#1f355a' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <img src="/chaleco.png" alt="S" style={{ height: 56, objectFit: 'contain' }} />
            <div>
              <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, letterSpacing: '0.3em', color: '#1f355a', textTransform: 'uppercase', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 8, height: 8, background: '#1f355a', display: 'inline-block' }} />
                Oficial en Campo
              </div>
              <h1 style={{ fontFamily: 'Barlow Condensed,sans-serif', fontWeight: 800, fontSize: 42, letterSpacing: '0.06em', textTransform: 'uppercase', margin: 0, color: '#0f172a', lineHeight: 1 }}>
                SENTINEL · OFICIAL
              </h1>
            </div>
          </div>
          <ProfileDropdown name={user.name} apellido={user.apellido} email={user.email} />
        </div>

        {/* Cards */}
        <div style={{ flex: 1, display: 'flex', gap: 32, justifyContent: 'center', flexWrap: 'wrap', alignItems: 'flex-start', paddingTop: 40 }}>

          {/* Card: Mis Despachos */}
          <Link href="/oficial/despachos" className="card-o" style={{ textDecoration: 'none' }}>
            <div className="co-top" style={{ position: 'absolute', top: 0, left: 0, height: 2, background: '#1f355a', transition: 'width 0.4s ease', width: 32 }} />
            <div className="co-left" style={{ position: 'absolute', top: 0, left: 0, width: 2, background: '#1f355a', transition: 'height 0.4s ease', height: 32 }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
              <div className="co-icon" style={{ color: '#64748b', transition: 'all 0.3s ease' }}>
                <Shield size={32} />
              </div>
              <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: '#94a3b8', letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#1f355a' }} />
                DESPACHO
              </div>
            </div>
            <div style={{ flexGrow: 1 }}>
              <h3 style={{ fontFamily: 'Barlow Condensed,sans-serif', fontSize: 28, fontWeight: 800, textTransform: 'uppercase', margin: '0 0 8px 0', color: '#0f172a' }}>
                Mis Despachos
              </h3>
              <p style={{ fontFamily: 'Inter,sans-serif', fontSize: 13, color: '#64748b', lineHeight: 1.5, margin: 0 }}>
                Solicitudes de despacho asignadas a ti — atiende y captura el reporte de campo para cerrarlas
              </p>
            </div>
            {despachosAsignados > 0 && (
              <div style={{ marginTop: 16 }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontFamily: 'JetBrains Mono,monospace', fontSize: 10, fontWeight: 700, padding: '3px 10px', background: '#eff1f3', color: '#1c3051', border: '1px solid #c3c8d2', borderRadius: 2 }}>
                  <AlertTriangle size={11} />
                  {despachosAsignados} ASIGNACIÓN{despachosAsignados !== 1 ? 'ES' : ''} ACTIVA{despachosAsignados !== 1 ? 'S' : ''}
                </span>
              </div>
            )}
          </Link>

          {/* Card: Rondín */}
          <Link href="/oficial/rondin" className="card-o" style={{ textDecoration: 'none' }}>
            <div className="co-top" style={{ position: 'absolute', top: 0, left: 0, height: 2, background: '#1f355a', transition: 'width 0.4s ease', width: 32 }} />
            <div className="co-left" style={{ position: 'absolute', top: 0, left: 0, width: 2, background: '#1f355a', transition: 'height 0.4s ease', height: 32 }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
              <div className="co-icon" style={{ color: '#64748b', transition: 'all 0.3s ease' }}>
                <Radio size={32} />
              </div>
              <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: '#94a3b8', letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#1f355a' }} />
                ESCALA A DESPACHO
              </div>
            </div>
            <div style={{ flexGrow: 1 }}>
              <h3 style={{ fontFamily: 'Barlow Condensed,sans-serif', fontSize: 28, fontWeight: 800, textTransform: 'uppercase', margin: '0 0 8px 0', color: '#0f172a' }}>
                Reporte de Rondín
              </h3>
              <p style={{ fontFamily: 'Inter,sans-serif', fontSize: 13, color: '#64748b', lineHeight: 1.5, margin: 0 }}>
                Registra un avistamiento en rondín — genera solicitud de despacho para asignación de unidades
              </p>
            </div>
          </Link>

          {/* Card: Reporte en Campo */}
          <Link href="/oficial/nuevo" className="card-o" style={{ textDecoration: 'none' }}>
            <div className="co-top" style={{ position: 'absolute', top: 0, left: 0, height: 2, background: '#1f355a', transition: 'width 0.4s ease', width: 32 }} />
            <div className="co-left" style={{ position: 'absolute', top: 0, left: 0, width: 2, background: '#1f355a', transition: 'height 0.4s ease', height: 32 }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
              <div className="co-icon" style={{ color: '#64748b', transition: 'all 0.3s ease' }}>
                <ClipboardList size={32} />
              </div>
              <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: '#94a3b8', letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#1f355a' }} />
                ACCIÓN RÁPIDA
              </div>
            </div>
            <div style={{ flexGrow: 1 }}>
              <h3 style={{ fontFamily: 'Barlow Condensed,sans-serif', fontSize: 28, fontWeight: 800, textTransform: 'uppercase', margin: '0 0 8px 0', color: '#0f172a' }}>
                Reporte en Campo
              </h3>
              <p style={{ fontFamily: 'Inter,sans-serif', fontSize: 13, color: '#64748b', lineHeight: 1.5, margin: 0 }}>
                Genera alta de reporte de incidencia en recorrido
              </p>
            </div>
          </Link>

          {/* Card: Mis Reportes */}
          <Link href="/oficial/reportes" className="card-o" style={{ textDecoration: 'none' }}>
            <div className="co-top" style={{ position: 'absolute', top: 0, left: 0, height: 2, background: '#1f355a', transition: 'width 0.4s ease', width: 32 }} />
            <div className="co-left" style={{ position: 'absolute', top: 0, left: 0, width: 2, background: '#1f355a', transition: 'height 0.4s ease', height: 32 }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
              <div className="co-icon" style={{ color: '#64748b', transition: 'all 0.3s ease' }}>
                <History size={32} />
              </div>
              <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: '#94a3b8', letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#1f355a' }} />
                HISTORIAL
              </div>
            </div>
            <div style={{ flexGrow: 1 }}>
              <h3 style={{ fontFamily: 'Barlow Condensed,sans-serif', fontSize: 28, fontWeight: 800, textTransform: 'uppercase', margin: '0 0 8px 0', color: '#0f172a' }}>
                Mis Reportes
              </h3>
              <p style={{ fontFamily: 'Inter,sans-serif', fontSize: 13, color: '#64748b', lineHeight: 1.5, margin: 0 }}>
                Consulta tus reportes y completa denuncias pendientes
              </p>
            </div>
            {denunciasPendientes > 0 && (
              <div style={{ marginTop: 16 }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontFamily: 'JetBrains Mono,monospace', fontSize: 10, fontWeight: 700, padding: '3px 10px', background: '#fef3c7', color: '#b45309', border: '1px solid #fde68a', borderRadius: 2 }}>
                  <AlertTriangle size={11} />
                  {denunciasPendientes} DENUNCIA{denunciasPendientes !== 1 ? 'S' : ''} PENDIENTE{denunciasPendientes !== 1 ? 'S' : ''}
                </span>
              </div>
            )}
          </Link>

          {/* Card: Captura de Infracciones */}
          <Link href="/infracciones/captura" className="card-o" style={{ textDecoration: 'none' }}>
            <div className="co-top" style={{ position: 'absolute', top: 0, left: 0, height: 2, background: '#1f355a', transition: 'width 0.4s ease', width: 32 }} />
            <div className="co-left" style={{ position: 'absolute', top: 0, left: 0, width: 2, background: '#1f355a', transition: 'height 0.4s ease', height: 32 }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
              <div className="co-icon" style={{ color: '#64748b', transition: 'all 0.3s ease' }}>
                <FileBadge2 size={32} />
              </div>
              <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: '#94a3b8', letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#1f355a' }} />
                VÍA · MÓDULO
              </div>
            </div>
            <div style={{ flexGrow: 1 }}>
              <h3 style={{ fontFamily: 'Barlow Condensed,sans-serif', fontSize: 28, fontWeight: 800, textTransform: 'uppercase', margin: '0 0 8px 0', color: '#0f172a' }}>
                Captura de Infracciones
              </h3>
              <p style={{ fontFamily: 'Inter,sans-serif', fontSize: 13, color: '#64748b', lineHeight: 1.5, margin: 0 }}>
                Registra una nueva infracción de tránsito con datos del vehículo, infractor y ubicación
              </p>
            </div>
          </Link>

          {/* Card: Configuración de mi Perfil */}
          <Link href="/oficial/configuracion" className="card-o" style={{ textDecoration: 'none' }}>
            <div className="co-top" style={{ position: 'absolute', top: 0, left: 0, height: 2, background: '#1f355a', transition: 'width 0.4s ease', width: 32 }} />
            <div className="co-left" style={{ position: 'absolute', top: 0, left: 0, width: 2, background: '#1f355a', transition: 'height 0.4s ease', height: 32 }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
              <div className="co-icon" style={{ color: '#64748b', transition: 'all 0.3s ease' }}>
                <Settings size={32} />
              </div>
              <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: '#94a3b8', letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#1f355a' }} />
                CONFIGURACIÓN
              </div>
            </div>
            <div style={{ flexGrow: 1 }}>
              <h3 style={{ fontFamily: 'Barlow Condensed,sans-serif', fontSize: 28, fontWeight: 800, textTransform: 'uppercase', margin: '0 0 8px 0', color: '#0f172a' }}>
                Configuración de mi Perfil
              </h3>
              <p style={{ fontFamily: 'Inter,sans-serif', fontSize: 13, color: '#64748b', lineHeight: 1.5, margin: 0 }}>
                Actualiza tus datos personales, unidad asignada y más
              </p>
            </div>
          </Link>

        </div>

        {/* Footer */}
        <div style={{ marginTop: 'auto', paddingTop: 24, borderTop: '1px solid #e2e8f0', fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#94a3b8', letterSpacing: '0.18em', textTransform: 'uppercase', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>SSPM · SAN JUAN DEL RÍO · QRO</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span>SENTINEL v0.1 · OFICIAL</span>
            <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#1f355a' }} />
          </div>
        </div>

      </div>
    </div>
  )
}