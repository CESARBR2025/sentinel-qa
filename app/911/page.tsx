import { ModuleCard } from '@/components/911/ModuleCard'
import { Users, MessageSquare, MapPin, ArrowLeft, UserCircle } from 'lucide-react'
import Link from 'next/link'

export default function SeleccionAtencionPage() {
  const modulos = [
    {
      id: 'ciudadano',
      label: 'Ciudadano',
      sub: 'Base de datos de atención, registros de identidad y antecedentes de contacto.',
      icon: <Users size={28} />,
      href: '/911/ciudadano',
      stats: [{ label: 'Registros', value: '8.4k' }, { label: 'Hoy', value: '+12' }]
    },
    {
      id: 'whatsapp',
      label: 'WhatsApp',
      sub: 'Gestión de reportes entrantes vía mensajería instantánea y despacho digital.',
      icon: <MessageSquare size={28} />,
      href: '/911/whatsapp',
      stats: [{ label: 'Mensajes', value: '142' }, { label: 'Pendientes', value: '5' }]
    },
    {
      id: 'rondin',
      label: 'Rondín',
      sub: 'Control de patrullaje preventivo, puntos de firma y geolocalización de unidades.',
      icon: <MapPin size={28} />,
      href: '/rondin',
      stats: [{ label: 'Rutas', value: '24' }, { label: 'Activas', value: '18' }]
    }
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#1e293b', fontFamily: 'Inter, sans-serif' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Barlow+Condensed:wght@700;800&family=Inter:wght@400;500;600&display=swap');`}</style>

      {/* NAVBAR */}
      <header style={{ 
        borderBottom: '1px solid #e2e8f0', padding: '0 48px', height: 64, 
        display: 'flex', alignItems: 'center', gap: 24, background: '#ffffff',
        position: 'sticky', top: 0, zIndex: 100
      }}>
        <Link href="/dashboard" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: '0.25em', color: '#64748b', textTransform: 'uppercase', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
          <ArrowLeft size={14} /> Dashboard
        </Link>
        <div style={{ width: 1, height: 20, background: '#e2e8f0' }} />
        <div style={{ flexGrow: 1 }}>
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: '0.3em', color: '#2563eb', textTransform: 'uppercase', fontWeight: 600 }}>
            SSPM PREVENCIÓN
          </span>
          <span style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 800, fontSize: 22, letterSpacing: '0.05em', textTransform: 'uppercase', marginLeft: 12, color: '#0f172a' }}>
            SISTEMA DE <span style={{ color: '#3b82f6' }}>OPERACIONES</span>
          </span>
        </div>
      </header>

      {/* CONTENIDO */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '80px 48px' }}>
        <section style={{ marginBottom: '64px' }}>
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', letterSpacing: '0.4em', color: '#3b82f6', textTransform: 'uppercase', fontWeight: 600 }}>
            Panel de Selección
          </span>
          <h1 style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: '56px', fontWeight: 800, color: '#0f172a', margin: '12px 0', textTransform: 'uppercase', lineHeight: 1 }}>
            Módulos de <span style={{ color: '#2563eb' }}>Atención</span>
          </h1>
          <div style={{ width: '80px', height: '4px', background: '#2563eb', marginTop: '16px' }} />
        </section>

        {/* GRID DE LAS 3 TARJETAS REQUERIDAS */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
          gap: '32px' 
        }}>
          {modulos.map((modulo) => (
            <ModuleCard key={modulo.id} {...modulo} />
          ))}
        </div>
      </main>

      <footer style={{ padding: '48px', textAlign: 'center', fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#94a3b8', letterSpacing: '0.2em', borderTop: '1px solid #e2e8f0', marginTop: '80px', background: '#ffffff' }}>
        SSPM · SAN JUAN DEL RÍO · SENTINEL v0.1
      </footer>
    </div>
  )
}