import { OptionSquare } from '@/components/reportes/menuOption'
import {
  Activity, Building2, Landmark, Fingerprint, Handshake, HeartPulse, Crosshair, FileText,
} from 'lucide-react'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { DashboardHeader } from '@/components/partials/Header'
import { PageHeader } from '@/components/partials/PageHeader'
import { DashboardFooter } from '@/components/partials/Footer'
import { getFormatoNStats } from '@/lib/reportes/repository'
import { tienePermiso } from '@/lib/reportes/permisos'

export default async function EnvioDeFormatosPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')
  if (!(await tienePermiso(session.user.id, 'formato_n_coordinacion', 'ver'))) redirect('/dashboard')

  const user = session.user as { name: string; apellido?: string; email: string }
  const fn = await getFormatoNStats()

  const opciones = [
    {
      titulo: 'Consolidado Formato N',
      subtitulo: 'Vista única de las 7 secciones con datos auto-jalados y captura manual.',
      icono: <FileText size={28} />,
      enlace: '/envio-de-formatos/consolidar',
      estadisticas: [{ label: 'Vista completa', value: 'N' }]
    },
    {
      titulo: 'Eventos Informados',
      subtitulo: 'Bitácora de eventos reportados a Coordinación: hora, región, evento y atenciones.',
      icono: <Activity size={28} />,
      enlace: '/formato-n-eventos',
      estadisticas: [{ label: 'Registrados', value: String(fn.eventos) }]
    },
    {
      titulo: 'Fiscalía General del Estado',
      subtitulo: 'Conteos periódicos informados por la FGE: carpetas, cateos, aprehensiones y audiencias.',
      icono: <Building2 size={28} />,
      enlace: '/formato-n-fge',
      estadisticas: [{ label: 'Reportes', value: String(fn.fge) }]
    },
    {
      titulo: 'Fiscalía General de la República',
      subtitulo: 'Conteos periódicos informados por la FGR: carpetas, cateos, aprehensiones y audiencias.',
      icono: <Landmark size={28} />,
      enlace: '/formato-n-fgr',
      estadisticas: [{ label: 'Reportes', value: String(fn.fgr) }]
    },
    {
      titulo: 'Registro Nacional de Detenciones',
      subtitulo: 'Inscripciones al RND: hora de detención, delito, autoridad y folio.',
      icono: <Fingerprint size={28} />,
      enlace: '/formato-n-rnd',
      estadisticas: [{ label: 'Inscripciones', value: String(fn.rnd) }]
    },
    {
      titulo: 'Medios Alternativos',
      subtitulo: 'Asuntos canalizados por fiscalía, acuerdos alcanzados y monto de reparación de daños.',
      icono: <Handshake size={28} />,
      enlace: '/formato-n-medios-alternativos',
      estadisticas: [{ label: 'Reportes', value: String(fn.medios) }]
    },
    {
      titulo: 'Atención a Víctimas',
      subtitulo: 'Atenciones médicas, psicológicas y asesorías jurídicas brindadas a víctimas.',
      icono: <HeartPulse size={28} />,
      enlace: '/formato-n-atencion-victimas',
      estadisticas: [{ label: 'Reportes', value: String(fn.victimas) }]
    },
    {
      titulo: 'Armas de Fuego Aseguradas',
      subtitulo: 'Registro de armas aseguradas: carpeta, tipo, matrícula y calibre.',
      icono: <Crosshair size={28} />,
      enlace: '/formato-n-armas-aseguradas',
      estadisticas: [{ label: 'Registradas', value: String(fn.armas) }]
    },
  ]

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f8fafc', color: '#1e293b', fontFamily: 'Inter, sans-serif' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Barlow+Condensed:wght@700;800&family=Inter:wght@400;500;600&display=swap');`}</style>

      <DashboardHeader user={user} roleLabel="Envío de Formatos" backHref="/agente_reportes" backLabel="Panel de Reportes" />

      <main className="pad-pagina" style={{ width: '100%', flex: 1, display: 'flex', flexDirection: 'column', gap: 24 }}>
        <PageHeader
          title="Envío de"
          accent="Formatos"
          subtitle="Formato N · Coordinación"
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

      <DashboardFooter />
    </div>
  )
}
