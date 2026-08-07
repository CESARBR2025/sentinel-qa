import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { FileText, ClipboardList, LayoutGrid, FileSpreadsheet } from 'lucide-react'
import { DashboardHeader } from '@/components/partials/Header'
import { DashboardFooter } from '@/components/partials/Footer'
import { PageHeader } from '@/components/partials/PageHeader'
import { getUserWithRole, obtenerHubRol } from '@/lib/auth/helpers'
import { tieneAccesoAnalisis } from '@/lib/analisis/permisos'

export default async function AnalisisHubPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')
  if (!(await tieneAccesoAnalisis(session.user.id))) redirect('/dashboard')

  const userWithRole = await getUserWithRole(session.user.id)
  const hub = userWithRole?.esAdmin ? null : obtenerHubRol(userWithRole?.rolNombre)
  const backHref = hub === '/analisis' ? undefined : (hub ?? '/dashboard')

  const user = session.user as { name: string; apellido?: string; email: string }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f8fafc', color: '#1e293b', fontFamily: 'Inter,sans-serif' }}>
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

      <DashboardHeader user={user} roleLabel="Análisis" backHref={backHref} />

      <div className="pad-dashboard" style={{ maxWidth: 1400, margin: '0 auto', flex: 1, display: 'flex', flexDirection: 'column', gap: 48 }}>

        <PageHeader
          title="Panel"
          accent="Análisis"
          subtitle={`${user.name} ${user.apellido ?? ''} · análisis, registros IPH y georreferenciación`}
        />

        {/* Cards */}
        <div style={{ flex: 1, display: 'flex', gap: 32, justifyContent: 'center', flexWrap: 'wrap', alignItems: 'flex-start', paddingTop: 40 }}>

          {/* Card: Reporte IPH */}
          <Link href="/analisis/formulario-ingreso" className="card-o" style={{ textDecoration: 'none' }}>
            <div className="co-top" style={{ position: 'absolute', top: 0, left: 0, height: 2, background: '#1f355a', transition: 'width 0.4s ease', width: 32 }} />
            <div className="co-left" style={{ position: 'absolute', top: 0, left: 0, width: 2, background: '#1f355a', transition: 'height 0.4s ease', height: 32 }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
              <div className="co-icon" style={{ color: '#64748b', transition: 'all 0.3s ease' }}>
                <FileText size={32} />
              </div>
              <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: '#94a3b8', letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#1f355a' }} />
                IPH · RND
              </div>
            </div>
            <div style={{ flexGrow: 1 }}>
              <h3 style={{ fontFamily: 'Barlow Condensed,sans-serif', fontSize: 28, fontWeight: 800, textTransform: 'uppercase', margin: '0 0 8px 0', color: '#0f172a' }}>
                Reporte IPH
              </h3>
              <p style={{ fontFamily: 'Inter,sans-serif', fontSize: 13, color: '#64748b', lineHeight: 1.5, margin: 0 }}>
                Registro del Informe Policial Homologado: datos del detenido, uso de la fuerza y datos nacionales de detención
              </p>
            </div>
          </Link>

          {/* Card: Pendientes de Análisis */}
          <Link href="/analisis/pendiente-analisis" className="card-o" style={{ textDecoration: 'none' }}>
            <div className="co-top" style={{ position: 'absolute', top: 0, left: 0, height: 2, background: '#1f355a', transition: 'width 0.4s ease', width: 32 }} />
            <div className="co-left" style={{ position: 'absolute', top: 0, left: 0, width: 2, background: '#1f355a', transition: 'height 0.4s ease', height: 32 }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
              <div className="co-icon" style={{ color: '#64748b', transition: 'all 0.3s ease' }}>
                <ClipboardList size={32} />
              </div>
              <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: '#94a3b8', letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#1f355a' }} />
                MATRIZ
              </div>
            </div>
            <div style={{ flexGrow: 1 }}>
              <h3 style={{ fontFamily: 'Barlow Condensed,sans-serif', fontSize: 28, fontWeight: 800, textTransform: 'uppercase', margin: '0 0 8px 0', color: '#0f172a' }}>
                Pendientes de Análisis
              </h3>
              <p style={{ fontFamily: 'Inter,sans-serif', fontSize: 13, color: '#64748b', lineHeight: 1.5, margin: 0 }}>
                Matriz de reportes de campo que requieren validación y prellenado de datos
              </p>
            </div>
          </Link>

          {/* Card: Bitácora IPH */}
          <Link href="/analisis/iph" className="card-o" style={{ textDecoration: 'none' }}>
            <div className="co-top" style={{ position: 'absolute', top: 0, left: 0, height: 2, background: '#1f355a', transition: 'width 0.4s ease', width: 32 }} />
            <div className="co-left" style={{ position: 'absolute', top: 0, left: 0, width: 2, background: '#1f355a', transition: 'height 0.4s ease', height: 32 }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
              <div className="co-icon" style={{ color: '#64748b', transition: 'all 0.3s ease' }}>
                <LayoutGrid size={32} />
              </div>
              <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: '#94a3b8', letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#1f355a' }} />
                BITÁCORA
              </div>
            </div>
            <div style={{ flexGrow: 1 }}>
              <h3 style={{ fontFamily: 'Barlow Condensed,sans-serif', fontSize: 28, fontWeight: 800, textTransform: 'uppercase', margin: '0 0 8px 0', color: '#0f172a' }}>
                Bitácora IPH
              </h3>
              <p style={{ fontFamily: 'Inter,sans-serif', fontSize: 13, color: '#64748b', lineHeight: 1.5, margin: 0 }}>
                Registro Nacional de Detenciones — consulta de los IPH registrados y generación de presentaciones
              </p>
            </div>
          </Link>

          {/* Card: Formatos UDAI */}
          <Link href="/formatos-udai" className="card-o" style={{ textDecoration: 'none' }}>
            <div className="co-top" style={{ position: 'absolute', top: 0, left: 0, height: 2, background: '#1f355a', transition: 'width 0.4s ease', width: 32 }} />
            <div className="co-left" style={{ position: 'absolute', top: 0, left: 0, width: 2, background: '#1f355a', transition: 'height 0.4s ease', height: 32 }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
              <div className="co-icon" style={{ color: '#64748b', transition: 'all 0.3s ease' }}>
                <FileSpreadsheet size={32} />
              </div>
              <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: '#94a3b8', letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#1f355a' }} />
                UDAI
              </div>
            </div>
            <div style={{ flexGrow: 1 }}>
              <h3 style={{ fontFamily: 'Barlow Condensed,sans-serif', fontSize: 28, fontWeight: 800, textTransform: 'uppercase', margin: '0 0 8px 0', color: '#0f172a' }}>
                Formatos UDAI
              </h3>
              <p style={{ fontFamily: 'Inter,sans-serif', fontSize: 13, color: '#64748b', lineHeight: 1.5, margin: 0 }}>
                Formatos oficiales UDAI generados a partir de los registros IPH capturados en el sistema
              </p>
            </div>
          </Link>

        </div>

        {/* Footer */}
        <DashboardFooter />
      </div>
    </div>
  )
}
