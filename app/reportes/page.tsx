import { OptionSquare } from '@/components/reportes/menuOption'
import { SentinelHero } from '@/components/reportes/welcomeBanner'
import { Settings, ShieldCheck, Database, FileText, Users } from 'lucide-react'
import { db } from '@/lib/db/index'
import { incidentes } from '@/lib/db/schema'
import { sql } from 'drizzle-orm'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { DashboardHeader } from '@/components/partials/Header'

async function getStats() {
  // Ejecutamos la consulta
  const result = await db.select({ count: sql<number>`count(*)::int` }).from(incidentes)
  // Retornamos el valor de forma segura
  return { 
    total: result[0]?.count ?? 0 
  }
}

export default async function GestionPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')

  const user = session.user as { name: string; apellido?: string; email: string }
  
  // Obtenemos las estadísticas
  const stats = await getStats()

  const opciones = [
    {
      titulo: 'Incidentes captados en cámara',
      subtitulo: 'Reporte de incidentes por turno, de forma diaria, semanal y mensual.',
      icono: <Users size={28} />,
      enlace: '/911/gestion/usuarios',
      estadisticas: [{ label: 'Total', value: '24' }, { label: 'Activos', value: '8' }]
    },
    {
      titulo: 'Incidentes diarios',
      subtitulo: 'Concentrado diario de total de incidentes.',
      icono: <Database size={28} />,
      enlace: '/911/gestion/catalogos',
      estadisticas: [{ label: 'Versión', value: '1.0.4' }, { label: 'Tablas', value: '12' }]
    },
    {
      titulo: 'Incidentes semanal',
      subtitulo: 'Concentrado semanal de total de incidentes.',
      icono: <FileText size={28} />,
      enlace: '/911/gestion/reportes',
      // AQUÍ USAMOS EL TOTAL CORREGIDO
      estadisticas: [{ label: 'Incidentes', value: String(stats.total) }, { label: 'Corte', value: 'Hoy' }]
    },
    {
      titulo: 'Módulo de resumen de incidentes',
      subtitulo: 'Registro detallado de incidentes, separado por clasifiaciones.',
      icono: <ShieldCheck size={28} />,
      enlace: '/911/gestion/auditoria',
      estadisticas: [{ label: 'Logs hoy', value: '156' }, { label: 'Alertas', value: '0' }]
    }
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#1e293b', fontFamily: 'Inter, sans-serif' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Barlow+Condensed:wght@700;800&family=Inter:wght@400;500;600&display=swap');`}</style>

      <DashboardHeader user={user} />

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '80px 48px' }}>
        <SentinelHero 
          tag="Módulo de Administración"
          principal="Panel de"
          secundario="Gestión"
        />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
          {opciones.map((opt, idx) => (
            <OptionSquare 
              key={idx}
              titulo={opt.titulo}
              subtitulo={opt.subtitulo}
              icono={opt.icono}
              enlace={opt.enlace}
              estadisticas={opt.estadisticas}
            />
          ))}
        </div>
      </main>

      <footer style={{ padding: '48px', textAlign: 'center', fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#94a3b8', letterSpacing: '0.2em', borderTop: '1px solid #e2e8f0', marginTop: '80px', background: '#ffffff' }}>
        SSPM · SAN JUAN DEL RÍO · ADMIN CORE v0.1
      </footer>
    </div>
  )
}