import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import {
  Camera, Zap, ShieldAlert, Globe, FolderClock, PackageX,
  Send, User, FileText,
} from 'lucide-react'
import { OptionSquare } from '@/components/reportes/menuOption'
import { DashboardHeader } from '@/components/partials/Header'
import { PageHeader } from '@/components/partials/PageHeader'
import { DashboardFooter } from '@/components/partials/Footer'
import { obtenerPermisosUsuario } from '@/lib/permisos/core'
import { getIncidentesCount, getEnvioFormatosCount } from '@/lib/reportes/repository'
import { getUserWithRole, obtenerHubRol } from '@/lib/auth/helpers'

type Stat = { label: string; value: string }

interface CardDef {
  titulo: string
  subtitulo: string
  icono: React.ReactNode
  enlace: string
  seccion: string
  estadisticas: Stat[]
}

interface SeccionUI {
  titulo: string
  cards: CardDef[]
}

export default async function AgenteReportesPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')

  const permisos = await obtenerPermisosUsuario(session.user.id, ['reportes_ciudadano', 'incidentes_camaras', 'modulo_incidentes', 'formato_n_coordinacion', 'reporte_detenidos', 'formatos_udai', 'parte_novedades_c4'] as const)
  if (!permisos.reportes_ciudadano.puede_ver) redirect('/dashboard')

  const userWithRole = await getUserWithRole(session.user.id)
  const hub = userWithRole?.esAdmin ? null : obtenerHubRol(userWithRole?.rolNombre)
  const backHref = hub === '/agente_reportes' ? undefined : (hub ?? '/dashboard')

  const user = session.user as { name: string; apellido?: string; email: string }

  const puede = (seccion: string) => {
    const p = permisos[seccion as keyof typeof permisos]
    return p?.puede_ver ?? false
  }

  const stats = { total: await getIncidentesCount() }
  const envioFormatosCount = await getEnvioFormatosCount()

  const secciones: SeccionUI[] = [
    {
      titulo: 'Incidentes',
      cards: [
        {
          titulo: 'Registros por Turno',
          subtitulo: 'Monitoreo y detección de anomalías mediante sistemas de videovigilancia y analíticos.',
          icono: <Camera size={28} />,
          enlace: '/incidentes_camaras',
          seccion: 'incidentes_camaras',
          estadisticas: [{ label: 'Alertas', value: '24' }, { label: 'Cámaras', value: '156' }],
        },
        {
          titulo: 'Reporte de Incidentes',
          subtitulo: 'Registro operativo de sucesos captados por unidades en campo y reportes de cabina.',
          icono: <Zap size={28} />,
          enlace: '/reportes_incidentes',
          seccion: 'reportes_ciudadano',
          estadisticas: [{ label: 'Hoy', value: String(stats.total) }, { label: 'Prioridad', value: 'Alta' }],
        },
        {
          titulo: 'Reportes Operativos',
          subtitulo: 'Clasificación y seguimiento detallado: Motos, Vehículos, Cateos, Hidrocarburos y más.',
          icono: <ShieldAlert size={28} />,
          enlace: '/modulo_incidentes',
          seccion: 'modulo_incidentes',
          estadisticas: [{ label: 'Categorías', value: '9' }, { label: 'Estatus', value: 'Seguimiento' }],
        },
      ],
    },
    {
      titulo: 'Carpetas y Cosmos',
      cards: [
        {
          titulo: 'Registro de Reportes D1',
          subtitulo: 'Integración y seguimiento de carpetas de investigación con fiscalía y justicia penal.',
          icono: <Globe size={28} />,
          enlace: '/d1',
          seccion: 'reportes_ciudadano',
          estadisticas: [{ label: 'Sincro', value: 'Activa' }, { label: 'Folios', value: '412' }],
        },
        {
          titulo: 'Reportes Sin D1 Iniciada',
          subtitulo: 'Control de registros pendientes de inicio de carpeta o seguimiento administrativo.',
          icono: <FolderClock size={28} />,
          enlace: '/d1_noiniciada',
          seccion: 'reportes_ciudadano',
          estadisticas: [{ label: 'Pendientes', value: '12' }, { label: 'Vencidas', value: '0' }],
        },
      ],
    },
    {
      titulo: 'Validación',
      cards: [
        {
          titulo: 'Reportes Sin Novedad',
          subtitulo: 'Análisis de eventos descartados o con falta de indicios de robo en el lugar.',
          icono: <PackageX size={28} />,
          enlace: '/sin_robos',
          seccion: 'reportes_ciudadano',
          estadisticas: [{ label: 'Descartes', value: '45' }, { label: 'Falsos', value: '8' }],
        },
      ],
    },
    {
      titulo: 'Estadísticas',
      cards: [
        {
          titulo: 'Reporte de Detenidos',
          subtitulo: 'Presentación con fotografías, evento, delitos, falta administrativa y modus operandi — diario, semanal y mensual.',
          icono: <User size={28} />,
          enlace: '/reporte-detenidos',
          seccion: 'reporte_detenidos',
          estadisticas: [],
        },
      ],
    },
    {
      titulo: 'Coordinación (Formato N)',
      cards: [
        {
          titulo: 'Reporte Diario Coordinación',
          subtitulo: 'Genera el reporte diario de Coordinación: eventos, FGE/FGR, RND, medios alternativos, atención a víctimas, armas aseguradas y observaciones, con descarga del documento oficial.',
          icono: <Send size={28} />,
          enlace: '/envio-de-formatos/consolidar',
          seccion: 'formato_n_coordinacion',
          estadisticas: [{ label: 'Registros', value: String(envioFormatosCount) }],
        },
        {
          titulo: 'Parte de Novedades C-4',
          subtitulo: 'El reporte diario más grande del sistema (34 tablas, ventana 06:00 a 06:00): 911, cámaras, subsecretaría, tránsito, prevención, delictivos, operativos y estado de fuerza.',
          icono: <FileText size={28} />,
          enlace: '/envio-de-formatos/novedades',
          seccion: 'parte_novedades_c4',
          estadisticas: [],
        },
      ],
    },
    {
      titulo: 'Formatos UDAI',
      cards: [
        {
          titulo: 'Formatos UDAI',
          subtitulo: 'Formatos oficiales UDAI generados a partir de los registros IPH capturados en el sistema.',
          icono: <FolderClock size={28} />,
          enlace: '/formatos-udai',
          seccion: 'formatos_udai',
          estadisticas: [],
        },
      ],
    },
  ]

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f1f5f9', color: '#1e293b', fontFamily: 'var(--apple-font-display)' }}>
      <DashboardHeader user={user} roleLabel="Agente Reportes" backHref={backHref} />

      <main className="pad-dashboard" style={{ width: '100%', flex: 1, display: 'flex', flexDirection: 'column', gap: 40 }}>
        <PageHeader
          title="Panel"
          accent="Reportes"
          subtitle={`${user.name} ${user.apellido ?? ''} · reportes y formatos de coordinación`}
        />

        {secciones.map((seccion) => {
          const cards = seccion.cards.filter(c => puede(c.seccion))
          if (cards.length === 0) return null
          return (
            <section key={seccion.titulo} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
                <span style={{ width: 4, height: 16, background: '#1f355a', borderRadius: 'var(--radius-full)' }} />
                <h2 style={{ fontFamily: 'var(--apple-font-display)', fontWeight: 600, fontSize: 22, letterSpacing: 'normal', textTransform: 'none', color: '#0f172a', margin: 0 }}>
                  {seccion.titulo}
                </h2>
                <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
              </div>
              <div className="cat-cards-grid">
                {cards.map((card, idx) => (
                  <OptionSquare
                    key={idx}
                    titulo={card.titulo}
                    subtitulo={card.subtitulo}
                    icono={card.icono}
                    enlace={card.enlace}
                    estadisticas={card.estadisticas}
                  />
                ))}
              </div>
            </section>
          )
        })}
      </main>

      <DashboardFooter />
    </div>
  )
}
