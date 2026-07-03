import { OptionSquare } from '@/components/reportes/menuOption'
import { SentinelHero } from '@/components/reportes/welcomeBanner'
import {
  Settings, ShieldCheck, Database, FileText, Users,
  Camera, Zap, BarChart3, Globe, FolderClock, PackageX,
  ShieldAlert, Send
} from 'lucide-react'
import { db } from '@/lib/db/index'
import { incidentes } from '@/lib/db/schema'
import { sql } from 'drizzle-orm'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { DashboardHeader } from '@/components/partials/Header'
import { query } from '@/lib/db'

async function getStats() {
  // Ejecutamos la consulta
  const result = await db.select({ count: sql<number>`count(*)::int` }).from(incidentes)
  // Retornamos el valor de forma segura
  return {
    total: result[0]?.count ?? 0
  }
}

async function getEnvioFormatosCount() {
  const tablas = ['formato_n_eventos', 'formato_n_fge', 'formato_n_fgr', 'formato_n_rnd', 'formato_n_medios_alternativos', 'formato_n_atencion_victimas', 'formato_n_armas_aseguradas']
  const counts = await Promise.all(tablas.map(t => query<{ c: number }>(`SELECT count(*)::int as c FROM ${t}`)))
  return counts.reduce((sum, r) => sum + (r.rows[0]?.c ?? 0), 0)
}

export default async function GestionPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')

  const user = session.user as { name: string; apellido?: string; email: string }

  // Obtenemos las estadísticas
  const stats = await getStats()
  const envioFormatosCount = await getEnvioFormatosCount()

  const opciones = [
    {
      titulo: 'Incidentes captados en cámara',
      subtitulo: 'Monitoreo y detección de anomalías mediante sistemas de videovigilancia y analíticos.',
      icono: <Camera size={28} />,
      enlace: '/incidentes_camaras', // Ajusta a tu ruta real
      estadisticas: [{ label: 'Alertas', value: '24' }, { label: 'Cámaras', value: '156' }]
    },
    {
      titulo: 'Reporte de incidentes',
      subtitulo: 'Registro operativo de sucesos captados por unidades en campo y reportes de cabina.',
      icono: <Zap size={28} />,
      enlace: '/reportes_incidentes',
      estadisticas: [{ label: 'Hoy', value: String(stats.total) }, { label: 'Prioridad', value: 'Alta' }]
    },
    {
      titulo: 'Módulo de resumen de incidentes',
      subtitulo: 'Clasificación y seguimiento detallado: Motos, Vehículos, Cateos, Hidrocarburos y más.',
      icono: <ShieldAlert size={28} style={{ color: '#2563EB' }} />, // Icono destacado
      enlace: '/modulo_incidentes', // Aquí es donde hicimos las pestañas
      estadisticas: [{ label: 'Categorías', value: '9' }, { label: 'Estatus', value: 'Seguimiento' }]
    },
    {
      titulo: 'Análisis Estadístico',
      subtitulo: 'Generación automática de concentrados diarios, semanales y mensuales para mando.',
      icono: <BarChart3 size={28} />,
      enlace: '/estadisticos',
      estadisticas: [{ label: 'Corte', value: 'Semanal' }, { label: 'Eficiencia', value: '92%' }]
    },
    {
      titulo: 'Sistema Cosmos',
      subtitulo: 'Integración y seguimiento de carpetas de investigación con fiscalía y justicia penal.',
      icono: <Globe size={28} />,
      enlace: '/d1',
      estadisticas: [{ label: 'Sincro', value: 'Activa' }, { label: 'Folios', value: '412' }]
    },
    {
      titulo: 'D1 no iniciada',
      subtitulo: 'Control de registros pendientes de inicio de carpeta o seguimiento administrativo.',
      icono: <FolderClock size={28} />,
      enlace: '/d1_noiniciada',
      estadisticas: [{ label: 'Pendientes', value: '12' }, { label: 'Vencidas', value: '0' }]
    },
    {
      titulo: 'Sin robos confirmados',
      subtitulo: 'Análisis de eventos descartados o con falta de indicios de robo en el lugar.',
      icono: <PackageX size={28} />,
      enlace: '/sin_robos',
      estadisticas: [{ label: 'Descartes', value: '45' }, { label: 'Falsos', value: '8' }]
    },
    {
      titulo: 'Envío de Formatos',
      subtitulo: 'Formato N a Coordinación: eventos, FGE/FGR, RND, medios alternativos, atención a víctimas y armas aseguradas.',
      icono: <Send size={28} />,
      enlace: '/envio-de-formatos',
      estadisticas: [{ label: 'Registros', value: String(envioFormatosCount) }]
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