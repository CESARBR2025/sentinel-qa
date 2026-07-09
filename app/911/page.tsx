import { ModuleCard } from '@/components/911/ModuleCard'
import { Users, MessageSquare, MapPin, Shield, ClipboardList } from 'lucide-react'
import { getStats } from '@/lib/911/service'

// --- NUEVOS IMPORTS PARA SESIÓN ---
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { DashboardHeader } from '@/components/partials/Header'
// ----------------------------------
import { tieneAccesoHub } from '@/lib/911/permisos'

export default async function SeleccionAtencionPage() {
  // 1. VALIDACIÓN DE SESIÓN (Igual que en Despacho)
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')
  if (!(await tieneAccesoHub(session.user.id))) redirect('/dashboard')

  const user = session.user as { name: string; apellido?: string; email: string }

  const hoy = new Date()
  hoy.setHours(0, 0, 0, 0)
  const hoyISO = hoy.toISOString()
  const stats = await getStats(hoyISO)
  const hoyTotal = stats.hoy
  const pendientes = stats.sinDespachar
  const hoy911 = stats.channels.find(c => c.canal === '911')?.count ?? 0
  const hoyWA = stats.channels.find(c => c.canal === 'whatsapp')?.count ?? 0
  const hoyRadio = stats.channels.find(c => c.canal === 'radio')?.count ?? 0

  const modulos = [
    {
      id: 'ciudadano',
      label: 'Ciudadano',
      sub: 'Base de datos de atención, registros de identidad y antecedentes de contacto.',
      icon: <Users size={28} />,
      href: '/911/ciudadano/incidentes',
      stats: [{ label: 'Canal 911 hoy', value: String(hoy911) }, { label: 'Total', value: String(stats.total) }]
    },
    {
      id: 'whatsapp',
      label: 'WhatsApp',
      sub: 'Gestión de reportes entrantes vía mensajería instantánea y despacho digital.',
      icon: <MessageSquare size={28} />,
      href: '/911/whatsapp/incidentes',
      stats: [{ label: 'WhatsApp hoy', value: String(hoyWA) }, { label: 'Total', value: String(stats.total) }]
    },
    {
      id: 'rondin',
      label: 'Rondín',
      sub: 'Control de patrullaje preventivo, puntos de firma y geolocalización de unidades.',
      icon: <MapPin size={28} />,
      href: '/911/rondin/incidentes',
      stats: [{ label: 'Radio hoy', value: String(hoyRadio) }, { label: 'Total', value: String(stats.total) }]
    },
    {
      id: 'despacho',
      label: 'Despacho',
      sub: 'Tablón de incidentes pendientes, asignación de unidades y elementos por turno.',
      icon: <Shield size={28} />,
      href: '/911/despacho',
      stats: [{ label: 'Pendientes', value: String(pendientes) }, { label: 'En campo', value: String(stats.enDespacho) }]
    },
    {
      id: 'bitacora',
      label: 'Bitácora',
      sub: 'Registro general de todos los incidentes capturados, filtros por canal, estatus y fecha.',
      icon: <ClipboardList size={28} />,
      href: '/incidentes',
      stats: [{ label: 'Total', value: String(stats.total) }, { label: 'Hoy', value: String(hoyTotal) }]
    },
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#1e293b', fontFamily: 'Inter, sans-serif' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Barlow+Condensed:wght@700;800&family=Inter:wght@400;500;600&display=swap');`}</style>

      {/* 2. INSERTAR EL HEADER PASANDO EL USER */}
      <DashboardHeader user={user} />

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

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
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
