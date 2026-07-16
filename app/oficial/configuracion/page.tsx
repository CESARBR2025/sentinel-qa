import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Fingerprint, BadgeCheck, Phone, Calendar } from 'lucide-react'
import { verificarRolOficial, obtenerMiPerfil } from '@/lib/oficial/service'
import { UnidadAsignadaSection } from '@/components/oficial/UnidadAsignadaSection'
import { listarPatrullasParaAsignacion, obtenerPatrullaPorId } from '@/lib/flota/service'
import { DashboardHeader } from '@/components/partials/Header'
import { APP_VERSION } from "@/lib/constants"
import { EditarTelefono } from './EditarTelefono'

export default async function ConfiguracionPerfilPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')

  const esOficial = await verificarRolOficial(session.user.id)
  if (!esOficial) redirect('/dashboard')

  const user = session.user as { name: string; apellido?: string; email: string }

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
    <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#1e293b', fontFamily: 'Inter,sans-serif' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Barlow+Condensed:wght@700;800&family=Inter:wght@400;500;600&display=swap');

        /* Avatar */
        .pf-avatar { width: 60px; height: 60px; border-radius: 50%; background: linear-gradient(135deg,#1f355a 0%,#274268 100%); display: flex; align-items: center; justify-content: center; flex-shrink: 0; box-shadow: 0 4px 12px rgba(31,53,90,0.25); position: relative; }
        .pf-avatar-in { font-family: 'Barlow Condensed',sans-serif; font-size: 22px; font-weight: 800; color: #fff; text-transform: uppercase; letter-spacing: 0.04em; }
        .pf-avatar-dot { width: 14px; height: 14px; border-radius: 50%; border: 3px solid #fff; position: absolute; bottom: -2px; right: -2px; }

        /* Badge estatus */
        .pf-badge { display: inline-flex; align-items: center; gap: 5px; padding: 3px 10px; border-radius: 9999px; font-family: 'JetBrains Mono',monospace; font-size: 8px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; }
        .pf-badge-activo { background: #dcfce7; color: #16a34a; }
        .pf-badge-inactivo { background: #fee2e2; color: #dc2626; }

        /* Groups */
        .pf-group { padding: 18px 0; }
        .pf-group + .pf-group { border-top: 1px solid #f1f5f9; }
        .pf-group:first-of-type { padding-top: 0; }
        .pf-group-label { display: flex; align-items: center; gap: 8px; margin-bottom: 12px; }
        .pf-group-label span { font-family: 'JetBrains Mono',monospace; font-size: 9px; color: #94a3b8; letter-spacing: 0.15em; text-transform: uppercase; font-weight: 600; }
        .pf-group-label::after { content: ''; flex: 1; height: 1px; background: #f1f5f9; }

        /* Field rows */
        .pf-row { display: flex; align-items: center; gap: 12px; padding: 8px 0; }
        .pf-label { font-family: 'JetBrains Mono',monospace; font-size: 9px; color: #94a3b8; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 2px; }
        .pf-value { font-family: 'Inter',sans-serif; font-size: 14px; color: #0f172a; font-weight: 500; }

        /* Telefono edit */
        .te-wrap { display: flex; align-items: center; gap: 8px; }
        .te-value { font-family: 'JetBrains Mono',monospace; font-size: 13px; color: #0f172a; font-weight: 500; }
        .te-btn { display: inline-flex; align-items: center; gap: 4px; padding: 4px 10px; border: 1px solid #e2e8f0; background: #fff; cursor: pointer; font-family: 'JetBrains Mono',monospace; font-size: 9px; color: #64748b; letter-spacing: 0.1em; text-transform: uppercase; border-radius: 4px; transition: all .15s; }
        .te-btn:hover { border-color: #1f355a; color: #1f355a; background: #f8fafc; }

        .te-edit-wrap { display: flex; align-items: center; gap: 6px; }
        .te-input { padding: 7px 11px; border: 1px solid #1f355a; border-radius: 4px; font-family: 'JetBrains Mono',monospace; font-size: 13px; color: #0f172a; background: #f8fafc; outline: none; width: 170px; box-shadow: 0 0 0 3px rgba(31,53,90,0.12); }
        .te-save { padding: 7px 14px; border: none; background: #1f355a; color: #fff; cursor: pointer; font-family: 'JetBrains Mono',monospace; font-size: 9px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; border-radius: 4px; }
        .te-save:hover { background: #274268; }
        .te-save:disabled { background: #94a3b8; cursor: not-allowed; }
        .te-cancel { padding: 7px 11px; border: 1px solid #e2e8f0; background: #fff; color: #64748b; cursor: pointer; font-family: 'JetBrains Mono',monospace; font-size: 9px; letter-spacing: 0.1em; text-transform: uppercase; border-radius: 4px; }
        .te-cancel:hover { border-color: #cbd5e1; color: #475569; }
        .te-error { margin-top: 6px; font-family: 'Inter',sans-serif; font-size: 11px; color: #dc2626; }

        /* Unidad card — placa vehicular */
        .up-placa-box { border: 2px solid #1f355a; border-radius: 6px; background: #fff; padding: 14px 20px; text-align: center; box-shadow: 0 2px 8px rgba(31,53,90,0.08); }
        .up-placa-box-empty { border: 2px dashed #cbd5e1; background: #f8fafc; }
        .up-placa-header { font-family: 'JetBrains Mono',monospace; font-size: 7px; color: #64748b; letter-spacing: 0.22em; text-transform: uppercase; display: flex; justify-content: space-between; margin-bottom: 6px; }
        .up-placa-numero { font-family: 'JetBrains Mono',monospace; font-size: 28px; font-weight: 700; color: #0f172a; letter-spacing: 0.15em; text-align: center; line-height: 1.2; }
        .up-placa-numero-empty { color: #cbd5e1; letter-spacing: 0.3em; }
        .up-placa-footer { font-family: 'JetBrains Mono',monospace; font-size: 7px; color: #94a3b8; letter-spacing: 0.15em; text-transform: uppercase; text-align: center; margin-top: 6px; }
        .up-modelo { font-family: 'Inter',sans-serif; font-size: 13px; color: #64748b; text-align: center; margin-top: 12px; }
        .up-modelo-empty { color: #94a3b8; }
        .up-badge { display: inline-flex; align-items: center; gap: 5px; padding: 3px 10px; border-radius: 9999px; font-family: 'JetBrains Mono',monospace; font-size: 8px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; }
        .up-badge-asignada { background: #dcfce7; color: #16a34a; }
        .up-badge-sin { background: #f1f5f9; color: #94a3b8; }
        .up-footer { padding-top: 18px; border-top: 1px solid #f1f5f9; margin-top: 18px; }
        .up-btn-primary { display: inline-flex; align-items: center; gap: 8px; padding: 11px 22px; border: 1px solid #1f355a; background: #1f355a; color: #fff; cursor: pointer; font-family: 'Barlow Condensed',sans-serif; font-weight: 700; font-size: 13px; letter-spacing: 0.15em; text-transform: uppercase; border-radius: 4px; transition: all .15s; box-shadow: 0 3px 10px rgba(31,53,90,0.2); }
        .up-btn-primary:hover { background: #274268; box-shadow: 0 4px 14px rgba(31,53,90,0.3); }
        .up-btn-secondary { display: inline-flex; align-items: center; gap: 8px; padding: 9px 18px; border: 1px solid #e2e8f0; background: #fff; color: #475569; cursor: pointer; font-family: 'JetBrains Mono',monospace; font-size: 10px; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; border-radius: 4px; transition: all .15s; }
        .up-btn-secondary:hover { border-color: #1f355a; color: #1f355a; }
      `}</style>

      <DashboardHeader user={user} roleLabel="Configuración" backHref="/oficial" />

      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '40px 64px', display: 'flex', flexDirection: 'column', gap: 48 }}>

        {error ? (
          <div style={{ textAlign: 'center', padding: 64, background: '#fff', border: '1px solid #e2e8f0' }}>
            <p style={{ color: '#dc2626', fontFamily: 'Inter,sans-serif', fontSize: 14 }}>{error}</p>
            <Link href="/oficial" style={{ color: '#1f355a', fontSize: 13 }}>Volver al dashboard</Link>
          </div>
        ) : perfil ? (
          <>
            {/* Profile card */}
            <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
              <div style={{ flex: '1 1 500px', background: '#fff', border: '1px solid #e2e8f0', padding: 32, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>

                {/* Profile Header — Avatar + Name + Status */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 24, paddingBottom: 24, borderBottom: '1px solid #f1f5f9' }}>
                  <div className="pf-avatar">
                    <span className="pf-avatar-in">
                      {(perfil.ofiNombre?.charAt(0) ?? '') + (perfil.ofiApPaterno?.charAt(0) ?? '')}
                    </span>
                    <span className="pf-avatar-dot" style={{ background: perfil.ofiEstatus === 'activo' ? '#16a34a' : '#dc2626' }} />
                  </div>
                  <div>
                    <h2 style={{ fontFamily: 'Barlow Condensed,sans-serif', fontSize: 22, fontWeight: 700, margin: 0, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      {perfil.ofiNombre} {perfil.ofiApPaterno}{perfil.ofiApMaterno ? ` ${perfil.ofiApMaterno}` : ''}
                    </h2>
                    <p style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#64748b', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '2px 0 8px' }}>
                      {perfil.departamentoNombre || 'Sin departamento'}
                    </p>
                    <span className={`pf-badge ${perfil.ofiEstatus === 'activo' ? 'pf-badge-activo' : 'pf-badge-inactivo'}`}>
                      <span style={{ width: 5, height: 5, borderRadius: '50%', background: perfil.ofiEstatus === 'activo' ? '#16a34a' : '#dc2626' }} />
                      {perfil.ofiEstatus === 'activo' ? 'Activo' : perfil.ofiEstatus || 'Inactivo'}
                    </span>
                  </div>
                </div>

                {/* Grupo: Identificación */}
                <div className="pf-group">
                  <div className="pf-group-label"><Fingerprint size={12} color="#94a3b8" /><span>Identificación</span></div>
                  <div className="pf-row">
                    <BadgeCheck size={14} color="#94a3b8" style={{ flexShrink: 0 }} />
                    <div><div className="pf-label">No. de Empleado</div><div className="pf-value">{perfil.numeroEmpleado || '—'}</div></div>
                  </div>
                  <div className="pf-row">
                    <BadgeCheck size={14} color="#94a3b8" style={{ flexShrink: 0 }} />
                    <div><div className="pf-label">No. de Nómina</div><div className="pf-value">{perfil.noNomina || '—'}</div></div>
                  </div>
                </div>

                {/* Grupo: Contacto */}
                <div className="pf-group">
                  <div className="pf-group-label"><Phone size={12} color="#94a3b8" /><span>Contacto</span></div>
                  <div className="pf-row">
                    <Phone size={14} color="#94a3b8" style={{ flexShrink: 0 }} />
                    <div>
                      <div className="pf-label">Teléfono</div>
                      <EditarTelefono telefono={perfil.telefono} />
                    </div>
                  </div>
                </div>

                {/* Grupo: Registro */}
                <div className="pf-group">
                  <div className="pf-group-label"><Calendar size={12} color="#94a3b8" /><span>Registro</span></div>
                  <div className="pf-row">
                    <Calendar size={14} color="#94a3b8" style={{ flexShrink: 0 }} />
                    <div><div className="pf-label">Miembro desde</div><div className="pf-value">{perfil.createdAt ? new Date(perfil.createdAt).toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' }) : '—'}</div></div>
                  </div>
                </div>

              </div>

              <UnidadAsignadaSection
                patrullaActual={patrullaActual}
                patrullas={patrullas}
              />
            </div>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: 64, background: '#fff', border: '1px solid #e2e8f0' }}>
            <p style={{ color: '#64748b', fontFamily: 'Inter,sans-serif', fontSize: 14 }}>No se encontró información del perfil</p>
            <Link href="/oficial" style={{ color: '#1f355a', fontSize: 13 }}>Volver al dashboard</Link>
          </div>
        )}

        {/* Footer */}
        <div style={{ marginTop: 'auto', paddingTop: 24, borderTop: '1px solid #e2e8f0', fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#94a3b8', letterSpacing: '0.18em', textTransform: 'uppercase', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>SSPM · SAN JUAN DEL RÍO · QRO</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span>CENTINELA {APP_VERSION} · OFICIAL</span>
            <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#1f355a' }} />
          </div>
        </div>

      </div>
    </div>
  )
}
