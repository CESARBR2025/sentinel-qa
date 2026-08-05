import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { FileSpreadsheet } from 'lucide-react'
import { OptionSquare } from '@/components/reportes/menuOption'
import { DashboardHeader } from '@/components/partials/Header'
import { PageHeader } from '@/components/partials/PageHeader'
import { DashboardFooter } from '@/components/partials/Footer'
import { tienePermiso } from '@/lib/formatos-udai/permisos'

export default async function FormatosUdaiPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')
  if (!(await tienePermiso(session.user.id, 'formatos_udai', 'ver'))) redirect('/agente_reportes')

  const user = session.user as { name: string; apellido?: string; email: string }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f8fafc', color: '#1e293b', fontFamily: 'Inter,sans-serif' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Barlow+Condensed:wght@700;800&family=Inter:wght@400;500;600&display=swap');
      `}</style>

      <DashboardHeader user={user} roleLabel="Formatos UDAI" backHref="/agente_reportes" />

      <main className="pad-dashboard" style={{ width: '100%', flex: 1, display: 'flex', flexDirection: 'column', gap: 40 }}>
        <PageHeader
          title="Formatos"
          accent="UDAI"
          subtitle="Formatos oficiales generados a partir de los registros capturados en el sistema"
        />

        <div className="cat-cards-grid">
          <OptionSquare
            titulo="Formato Faltas Administrativas"
            subtitulo="Bitácora de detenidos por falta administrativa, en el formato oficial UDAI, exportable a Excel."
            icono={<FileSpreadsheet size={28} />}
            enlace="/formatos-udai/faltas-administrativas"
            estadisticas={[]}
          />
        </div>
      </main>

      <DashboardFooter />
    </div>
  )
}
