import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { verificarRolOficial, obtenerMiPerfil } from '@/lib/oficial/service'
import { UnidadAsignadaSection } from '@/components/oficial/UnidadAsignadaSection'
import { MiUbicacionSection } from '@/components/oficial/MiUbicacionSection'
import { listarPatrullasParaAsignacion, obtenerPatrullaPorId } from '@/lib/flota/service'
import { DashboardHeader } from '@/components/partials/Header'
import { PageHeader } from '@/components/partials/PageHeader'
import { APP_VERSION } from "@/lib/constants"
import { EditarTelefono } from './EditarTelefono'
import { SegmentControl } from '@/components/oficial/SegmentControl'

export default async function ConfiguracionPerfilPage({ searchParams }: { searchParams: Promise<{ seccion?: string }> }) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')

  const esOficial = await verificarRolOficial(session.user.id)
  if (!esOficial) redirect('/dashboard')

  const user = session.user as { name: string; apellido?: string; email: string }
  const { seccion = 'perfil' } = await searchParams

  let perfil = null
  let error = null
  try {
    perfil = await obtenerMiPerfil(session.user.id)
  } catch (e) {
    error = e instanceof Error ? e.message : 'Error al cargar perfil'
  }

  const patrullaActual = await obtenerPatrullaPorId(
    perfil?.patrullaId ?? null,
  )
  const patrullas = await listarPatrullasParaAsignacion()

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f8fafc', color: '#1e293b', fontFamily: 'var(--apple-font-display)', paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <style>{`
        /* Avatar */
        .pf-avatar { width: 56px; height: 56px; border-radius: 50%; background: linear-gradient(135deg,#1f355a 0%,#274268 100%); display: flex; align-items: center; justify-content: center; flex-shrink: 0; box-shadow: 0 4px 12px rgba(31,53,90,0.25); position: relative; }
        .pf-avatar-in { font-family: var(--apple-font-display); font-size: 18px; font-weight: 600; color: #fff; text-transform: none; letter-spacing: normal; }
        .pf-avatar-dot { width: 14px; height: 14px; border-radius: 50%; border: 3px solid #fff; position: absolute; bottom: -2px; right: -2px; }

        /* Badge estatus */
        .pf-badge { display: inline-flex; align-items: center; gap: 5px; padding: 3px 10px; border-radius: var(--radius-full); font-family: var(--apple-font-display); font-size: 12px; font-weight: 500; letter-spacing: normal; text-transform: none; }
        .pf-badge-activo { background: #dcfce7; color: #16a34a; }
        .pf-badge-inactivo { background: #fee2e2; color: #dc2626; }

        /* Panel y filas etiqueta/valor — ficha profesional */
        .pf-panel { background: #fff; border: 1px solid #e2e8f0; border-radius: var(--radius-lg); box-shadow: var(--shadow-card); padding: 28px 32px; }
        .pf-head { display: flex; align-items: center; gap: 18px; padding-bottom: 24px; margin-bottom: 8px; border-bottom: 1px solid #f1f5f9; }
        .pf-row { display: flex; align-items: center; justify-content: space-between; gap: 20px; padding: 15px 0; border-bottom: 1px solid #f1f5f9; }
        .pf-row:last-of-type { border-bottom: none; }
        .pf-label { font-family: var(--apple-font-display); font-size: 13px; font-weight: 500; color: #94a3b8; letter-spacing: normal; text-transform: none; flex-shrink: 0; }
        .pf-value { font-family: var(--apple-font-display); font-size: 14px; font-weight: 500; color: #0f172a; text-align: right; }
        .pf-actions { display: flex; justify-content: flex-end; gap: 10px; padding-top: 20px; margin-top: 4px; border-top: 1px solid #f1f5f9; }

        /* Botones */
        .up-btn-primary { display: inline-flex; align-items: center; gap: 8px; padding: 11px 22px; border: none; background: #1f355a; color: #fff; cursor: pointer; font-family: var(--apple-font-display); font-weight: 600; font-size: 14px; letter-spacing: normal; text-transform: none; border-radius: var(--radius-lg); transition: all .15s; box-shadow: 0 3px 10px rgba(31,53,90,0.2); }
        .up-btn-primary:hover { background: #274268; }
        .up-btn-primary:active { transform: scale(0.97); }
        .up-btn-secondary { display: inline-flex; align-items: center; gap: 8px; padding: 9px 18px; border: 1px solid #e2e8f0; background: #fff; color: #475569; cursor: pointer; font-family: var(--apple-font-display); font-size: 13px; font-weight: 500; letter-spacing: normal; text-transform: none; border-radius: var(--radius-lg); transition: all .15s; }
        .up-btn-secondary:hover { border-color: #1f355a; color: #1f355a; }
        .up-btn-secondary:active { transform: scale(0.97); }

        /* Telefono edit */
        .te-wrap { display: flex; align-items: center; gap: 8px; }
        .te-value { font-family: var(--apple-font-display); font-size: 14px; color: #0f172a; font-weight: 500; }
        .te-btn { display: inline-flex; align-items: center; gap: 4px; padding: 4px 10px; border: 1px solid #e2e8f0; background: #fff; cursor: pointer; font-family: var(--apple-font-display); font-size: 12px; font-weight: 500; color: #64748b; letter-spacing: normal; text-transform: none; border-radius: var(--radius-lg); transition: all .15s; }
        .te-btn:hover { border-color: #1f355a; color: #1f355a; background: #f8fafc; }

        .te-edit-wrap { display: flex; align-items: center; gap: 6px; }
        .te-input { padding: 9px 12px; border: 1px solid #1f355a; border-radius: var(--radius-lg); font-family: var(--apple-font-display); font-size: 14px; color: #0f172a; background: #f8fafc; outline: none; width: 170px; box-shadow: 0 0 0 3px rgba(31,53,90,0.12); }
        .te-save { padding: 9px 14px; border: none; background: #1f355a; color: #fff; cursor: pointer; font-family: var(--apple-font-display); font-size: 13px; font-weight: 600; letter-spacing: normal; text-transform: none; border-radius: var(--radius-lg); }
        .te-save:hover { background: #274268; }
        .te-save:disabled { background: #94a3b8; cursor: not-allowed; }
        .te-cancel { padding: 9px 11px; border: 1px solid #e2e8f0; background: #fff; color: #64748b; cursor: pointer; font-family: var(--apple-font-display); font-size: 13px; font-weight: 500; letter-spacing: normal; text-transform: none; border-radius: var(--radius-lg); }
        .te-cancel:hover { border-color: #cbd5e1; color: #475569; }
        .te-error { margin-top: 6px; font-family: var(--apple-font-display); font-size: 12px; color: #dc2626; }

        @media (max-width: 720px) {
          .pf-panel { padding: 20px 16px; }
          .pf-head { gap: 14px; }
          .pf-label { font-size: 12px; }
        }
      `}</style>

      <DashboardHeader user={user} roleLabel="Configuración" variant="apple" backHref="/oficial" backLabel="Panel" />

      <div className="pad-dashboard" style={{ flex: 1, maxWidth: 1400, margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', gap: 24 }}>

        <PageHeader
          title="Configuración"
          accent="de mi Perfil"
          subtitle="Datos personales, unidad asignada y ubicación"
        />

        <SegmentControl
          tabs={[
            { id: 'perfil', label: 'Perfil' },
            { id: 'unidad', label: 'Unidad Asignada' },
            { id: 'ubicacion', label: 'Mi Ubicación' },
          ]}
          activeTab={seccion}
          paramName="seccion"
        />

        {error ? (
          <div className="pf-panel" style={{ textAlign: 'center', padding: 64 }}>
            <p style={{ color: '#dc2626', fontFamily: 'var(--apple-font-display)', fontSize: 14 }}>{error}</p>
            <Link href="/oficial" style={{ color: '#1f355a', fontSize: 13 }}>Volver al dashboard</Link>
          </div>
        ) : perfil ? (
          <div className="pf-panel">
            {seccion === 'perfil' && (
              <>
                {/* Header — Avatar + Nombre + Estatus */}
                <div className="pf-head">
                  <div className="pf-avatar">
                    <span className="pf-avatar-in">
                      {(perfil.ofiNombre?.charAt(0) ?? '') + (perfil.ofiApPaterno?.charAt(0) ?? '')}
                    </span>
                    <span className="pf-avatar-dot" style={{ background: perfil.ofiEstatus === 'activo' ? '#16a34a' : '#dc2626' }} />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <h2 style={{ fontFamily: 'var(--apple-font-display)', fontSize: 22, fontWeight: 600, margin: 0, color: '#0f172a', textTransform: 'none', letterSpacing: 'normal' }}>
                      {perfil.ofiNombre} {perfil.ofiApPaterno}{perfil.ofiApMaterno ? ` ${perfil.ofiApMaterno}` : ''}
                    </h2>
                    <p style={{ fontFamily: 'var(--apple-font-display)', fontSize: 13, fontWeight: 500, color: '#64748b', letterSpacing: 'normal', textTransform: 'none', margin: '2px 0 8px' }}>
                      {perfil.departamentoNombre || 'Sin departamento'}
                    </p>
                    <span className={`pf-badge ${perfil.ofiEstatus === 'activo' ? 'pf-badge-activo' : 'pf-badge-inactivo'}`}>
                      <span style={{ width: 5, height: 5, borderRadius: '50%', background: perfil.ofiEstatus === 'activo' ? '#16a34a' : '#dc2626' }} />
                      {perfil.ofiEstatus === 'activo' ? 'Activo' : perfil.ofiEstatus || 'Inactivo'}
                    </span>
                  </div>
                </div>

                {/* Ficha de datos */}
                <div>
                  <div className="pf-row">
                    <span className="pf-label">No. de Empleado</span>
                    <span className="pf-value">{perfil.numeroEmpleado || '—'}</span>
                  </div>
                  <div className="pf-row">
                    <span className="pf-label">No. de Nómina</span>
                    <span className="pf-value">{perfil.noNomina || '—'}</span>
                  </div>
                  <div className="pf-row">
                    <span className="pf-label">Teléfono</span>
                    <span className="pf-value"><EditarTelefono telefono={perfil.telefono} /></span>
                  </div>
                  <div className="pf-row">
                    <span className="pf-label">Miembro desde</span>
                    <span className="pf-value">{perfil.createdAt ? new Date(perfil.createdAt).toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' }) : '—'}</span>
                  </div>
                </div>
              </>
            )}

            {seccion === 'unidad' && (
              <UnidadAsignadaSection
                patrullaActual={patrullaActual}
                patrullas={patrullas}
              />
            )}

            {seccion === 'ubicacion' && (
              <MiUbicacionSection />
            )}
          </div>
        ) : (
          <div className="pf-panel" style={{ textAlign: 'center', padding: 64 }}>
            <p style={{ color: '#64748b', fontFamily: 'var(--apple-font-display)', fontSize: 14 }}>No se encontró información del perfil</p>
            <Link href="/oficial" style={{ color: '#1f355a', fontSize: 13 }}>Volver al dashboard</Link>
          </div>
        )}

        {/* Footer */}
        <div style={{ marginTop: 'auto', paddingTop: 24, borderTop: '1px solid #e2e8f0', fontFamily: 'var(--apple-font-display)', fontSize: 12, fontWeight: 500, color: '#94a3b8', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>SSPM · San Juan del Río · Qro</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span>Centinela {APP_VERSION} · Oficial</span>
          </div>
        </div>

      </div>
    </div>
  )
}
