import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { DashboardHeader } from '@/components/partials/Header'
import { DashboardFooter } from '@/components/partials/Footer'
import { LayoutGrid, FileText, ClipboardList, ChevronRight, ShieldCheck, Activity } from 'lucide-react'
import Link from 'next/link'

export default async function MenuAnalisisPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')

  const user = session.user as { name: string; apellido?: string; email: string }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#1e293b' }}>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Barlow+Condensed:wght@700;800&family=Inter:wght@400;500;600&display=swap');
        
        .menu-card {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
          text-decoration: none;
          position: relative;
          overflow: hidden;
        }

        .menu-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          border-color: #1f355a !important;
        }

        .menu-card:hover .icon-container {
          background: #1f355a !important;
          color: white !important;
        }

        .menu-card:hover .arrow-icon {
          transform: translateX(5px);
          color: #1f355a;
        }

        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }

        .animate-in {
          animation: slideIn 0.4s ease-out forwards;
        }
      `}} />

      <DashboardHeader user={user} />

      <main style={{ maxWidth: '1000px', margin: '0 auto', padding: '60px 40px' }}>
        
        {/* ENCABEZADO TÁCTICO */}
        <div style={{ marginBottom: '48px' }} className="animate-in">
          <span style={topLabelStyle}>ÁREA DE INTELIGENCIA OPERATIVA</span>
          <h1 style={titleStyle}>CENTRO DE <span style={{ color: '#1f355a' }}>ANÁLISIS Y REGISTRO</span></h1>
          <p style={{ margin: '12px 0 0 0', fontFamily: 'Inter', color: '#64748b', fontSize: '16px', maxWidth: '600px' }}>
            Seleccione el módulo de trabajo para la gestión de reportes de campo o la generación de informes policiales homologados.
          </p>
        </div>

        {/* REJILLA DE OPCIONES */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
          
          {/* OPCIÓN 1: PENDIENTES DE ANÁLISIS */}
          <Link href="/analisis/pendiente-analisis" className="menu-card" style={cardStyle}>
            <div style={cardContentStyle}>
              <div className="icon-container" style={iconBoxStyle}>
                <ClipboardList size={32} />
              </div>
              <div style={{ flex: 1 }}>
                <h2 style={cardTitleStyle}>Pendientes de Análisis</h2>
                <p style={cardDescStyle}>
                  Visualice la matriz de reportes de campo (Rondín) que requieren validación y prellenado de datos.
                </p>
                <div style={actionTextStyle}>
                  ACCEDER A BITÁCORA <ChevronRight size={14} className="arrow-icon" style={{ transition: 'transform 0.2s' }} />
                </div>
              </div>
            </div>
            <div style={{ ...decoratorLine, background: '#1f355a' }} />
          </Link>

          {/* OPCIÓN 2: GENERAR REPORTE IPH */}
          <Link href="/analisis/iph" className="menu-card" style={cardStyle}>
            <div style={cardContentStyle}>
              <div className="icon-container" style={{ ...iconBoxStyle, color: '#059669' }}>
                <FileText size={32} />
              </div>
              <div style={{ flex: 1 }}>
                <h2 style={cardTitleStyle}>Generar Reporte IPH</h2>
                <p style={cardDescStyle}>
                  Registro directo de Informe Policial Homologado, uso de la fuerza y datos nacionales de detención.
                </p>
                <div style={{ ...actionTextStyle, color: '#059669' }}>
                  INICIAR REGISTRO NUEVO <ChevronRight size={14} className="arrow-icon" style={{ transition: 'transform 0.2s' }} />
                </div>
              </div>
            </div>
            <div style={{ ...decoratorLine, background: '#059669' }} />
          </Link>

        </div>

        {/* ESTADO DEL SISTEMA (FOOTER INTERNO) */}
        <div style={systemStatusStyle} className="animate-in">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Activity size={14} color="#059669" />
                <span>NÚCLEO DE DATOS CONECTADO</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldCheck size={14} color="#1f355a" />
                <span>SESIÓN CIFRADA: {user.email}</span>
            </div>
        </div>

        <div style={{ marginTop: 80 }}>
          <DashboardFooter />
        </div>
      </main>
    </div>
  )
}

// --- ESTILOS TÁCTICOS ---

const topLabelStyle = { fontFamily: 'JetBrains Mono', fontSize: 11, color: '#1f355a', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase' as const };
const titleStyle = { fontFamily: 'Barlow Condensed', fontWeight: 800, fontSize: '48px', margin: 0, color: '#0f172a', textTransform: 'uppercase' as const, lineHeight: 1 };

const cardStyle: React.CSSProperties = {
  background: 'white',
  border: '1px solid #e2e8f0',
  borderRadius: '4px',
  padding: '40px',
  display: 'block',
  position: 'relative'
};

const cardContentStyle = { display: 'flex', gap: '32px', alignItems: 'flex-start' };

const iconBoxStyle: React.CSSProperties = {
  width: '80px',
  height: '80px',
  background: '#f8fafc',
  borderRadius: '4px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#1f355a',
  transition: 'all 0.3s'
};

const cardTitleStyle = { fontFamily: 'Barlow Condensed', fontSize: '24px', fontWeight: 700, color: '#0f172a', margin: '0 0 12px 0', textTransform: 'uppercase' as const };
const cardDescStyle = { fontFamily: 'Inter', fontSize: '14px', color: '#64748b', lineHeight: '1.6', margin: '0 0 24px 0' };

const actionTextStyle: React.CSSProperties = {
  fontFamily: 'JetBrains Mono',
  fontSize: '11px',
  fontWeight: 700,
  color: '#1f355a',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  letterSpacing: '0.05em'
};

const decoratorLine = { position: 'absolute' as const, bottom: 0, left: 0, width: '100%', height: '4px' };

const systemStatusStyle: React.CSSProperties = {
    marginTop: '48px',
    padding: '20px',
    borderTop: '1px solid #e2e8f0',
    display: 'flex',
    justifyContent: 'space-between',
    fontFamily: 'JetBrains Mono',
    fontSize: '10px',
    color: '#94a3b8',
    fontWeight: 600
};