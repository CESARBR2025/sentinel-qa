import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { FileDown, Download, Bike, Car, ShieldAlert, Gavel, Search } from 'lucide-react'
import { DashboardHeader } from '@/components/partials/Header'
import { PageHeader } from '@/components/partials/PageHeader'
import { ReportStat } from '@/components/reportes/deteccion_camara/ReportStat'
import { ReportFilters } from '@/components/reportes/modulo_incidentes/ReportFilters'
import { ReportesTabs } from '@/components/reportes/modulo_incidentes/ReportesTabs'
import { styles } from '@/components/reportes/modulo_incidentes/styles'
import { obtenerDatosOperativos } from '@/lib/reportes-operativos/service'
import { tienePermiso } from '@/lib/incidentes/permisos'

export default async function ReportesOperativosPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; to?: string }>
}) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')

  if (!(await tienePermiso(session.user.id, 'modulo_incidentes', 'ver'))) redirect('/dashboard')

  const user = session.user as { name: string; email: string; image?: string }
  const sp = await searchParams
  const data = await obtenerDatosOperativos(sp.from, sp.to)

  // Construir params para el botón de Excel
  const excelParams = new URLSearchParams()
  if (sp.from) excelParams.set('from', sp.from)
  if (sp.to) excelParams.set('to', sp.to)
  const excelHref = `/api/reportes-operativos/exportar-excel?${excelParams}`

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f1f5f9', color: '#0f172a', fontFamily: 'Inter,sans-serif' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&family=Barlow+Condensed:wght@700;800&family=Inter:wght@400;500;600;700&display=swap');`}</style>

      <DashboardHeader user={user} roleLabel="Resumen de Incidentes" backHref="/agente_reportes" backLabel="Panel de Reportes" />

      <main className="pad-pagina" style={{ width: '100%', flex: 1, display: 'flex', flexDirection: 'column', gap: 24 }}>
        <PageHeader
          title="Reportes"
          accent="Operativos"
          subtitle="SSPM · Inteligencia Operativa"
          actions={<>
            <button style={{ ...styles.primaryButton, background: 'white', color: '#0F172A', border: '1px solid #CBD5E1' }}>
              <FileDown size={16} /> PDF
            </button>
            <a
              href={excelHref}
              style={{
                ...styles.primaryButton,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <Download size={16} /> EXCEL
            </a>
          </>}
        />

        <ReportFilters />

        <div style={styles.statsGrid}>
          <ReportStat label="Motos Recup." value={data.motos.length} icon={<Bike size={20} />} />
          <ReportStat label="Vehíc. Recup." value={data.vehiculos.length} icon={<Car size={20} />} />
          <ReportStat label="Cateos Totales" value={data.cateos.length} icon={<Search size={20} />} />
          <ReportStat label="Detenidos" value={data.detenidos.length} icon={<Gavel size={20} />} />
          <ReportStat label="Órdenes Apreh." value={data.ordenes.length} icon={<ShieldAlert size={20} />} />
        </div>

        <ReportesTabs data={data} />
      </main>
    </div>
  )
}