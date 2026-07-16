import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { User, BadgeCheck, Building2, Phone, Calendar, Shield, Fingerprint } from 'lucide-react'
import { verificarRolOficial, obtenerMiPerfil } from '@/lib/oficial/service'
import { UnidadAsignadaSection } from '@/components/oficial/UnidadAsignadaSection'
import { listarPatrullasParaAsignacion, obtenerPatrullaPorId } from '@/lib/flota/service'
import { DashboardHeader } from '@/components/partials/Header'
import { APP_VERSION } from "@/lib/constants"

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
        .profile-field {
          display: flex; align-items: center; gap: 12px;
          padding: 14px 0; border-bottom: 1px solid #f1f5f9;
        }
        .profile-field:last-child { border-bottom: none; }
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
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
                  <User size={18} color="#1f355a" />
                  <h2 style={{ fontFamily: 'Barlow Condensed,sans-serif', fontSize: 20, fontWeight: 700, textTransform: 'uppercase', margin: 0, color: '#0f172a', letterSpacing: '0.04em' }}>
                    Datos Generales
                  </h2>
                </div>

                <div className="profile-field">
                  <Fingerprint size={16} color="#94a3b8" style={{ flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: '#94a3b8', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Número de Empleado</div>
                    <div style={{ fontFamily: 'Inter,sans-serif', fontSize: 14, color: '#0f172a', fontWeight: 500 }}>{perfil.numeroEmpleado || '—'}</div>
                  </div>
                </div>

                <div className="profile-field">
                  <BadgeCheck size={16} color="#94a3b8" style={{ flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: '#94a3b8', letterSpacing: '0.1em', textTransform: 'uppercase' }}>No. Nómina</div>
                    <div style={{ fontFamily: 'Inter,sans-serif', fontSize: 14, color: '#0f172a', fontWeight: 500 }}>{perfil.noNomina || '—'}</div>
                  </div>
                </div>

                <div className="profile-field">
                  <User size={16} color="#94a3b8" style={{ flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: '#94a3b8', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Nombre Completo</div>
                    <div style={{ fontFamily: 'Inter,sans-serif', fontSize: 14, color: '#0f172a', fontWeight: 500 }}>
                      {perfil.ofiNombre} {perfil.ofiApPaterno}{perfil.ofiApMaterno ? ` ${perfil.ofiApMaterno}` : ''}
                    </div>
                  </div>
                </div>

                <div className="profile-field">
                  <Building2 size={16} color="#94a3b8" style={{ flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: '#94a3b8', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Departamento</div>
                    <div style={{ fontFamily: 'Inter,sans-serif', fontSize: 14, color: '#0f172a', fontWeight: 500 }}>{perfil.departamentoNombre || '—'}</div>
                  </div>
                </div>

                <div className="profile-field">
                  <Phone size={16} color="#94a3b8" style={{ flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: '#94a3b8', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Teléfono</div>
                    <div style={{ fontFamily: 'Inter,sans-serif', fontSize: 14, color: '#0f172a', fontWeight: 500 }}>{perfil.telefono || '—'}</div>
                  </div>
                </div>

                <div className="profile-field">
                  <Shield size={16} color="#94a3b8" style={{ flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: '#94a3b8', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Estatus</div>
                    <div style={{ fontFamily: 'Inter,sans-serif', fontSize: 14, color: '#0f172a', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: perfil.ofiEstatus === 'activo' ? '#16a34a' : '#dc2626' }} />
                      {perfil.ofiEstatus === 'activo' ? 'Activo' : perfil.ofiEstatus || '—'}
                    </div>
                  </div>
                </div>

                <div className="profile-field">
                  <Calendar size={16} color="#94a3b8" style={{ flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: '#94a3b8', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Registrado desde</div>
                    <div style={{ fontFamily: 'Inter,sans-serif', fontSize: 14, color: '#0f172a', fontWeight: 500 }}>
                      {perfil.createdAt ? new Date(perfil.createdAt).toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' }) : '—'}
                    </div>
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
