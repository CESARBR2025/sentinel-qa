import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { DashboardHeader } from '@/components/partials/Header'
import { PageHeader } from '@/components/partials/PageHeader'
import { FiltroRangoFechas } from '@/components/911/reportes/FiltroRangoFechas'
import { TablaExtorsion } from '@/components/911/reportes/TablaExtorsion'
import { BotonExportarExcel } from '@/components/911/reportes/BotonExportarExcel'
import { obtenerDatosExtorsion } from '@/lib/reportes-operativos/service'
import { tieneAccesoSeccion } from '@/lib/911/permisos'

export default async function ExtorsionReportPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; to?: string }>
}) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')

  if (!(await tieneAccesoSeccion(session.user.id, '911_ciudadano'))) redirect('/dashboard')

  const user = session.user as { name: string; apellido?: string; email: string }
  const sp = await searchParams
  const data = await obtenerDatosExtorsion(sp.from || undefined, sp.to || undefined)

  const fechaReporte = new Date().toLocaleDateString('es-MX', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })

  const exportHref = `/api/reportes/extorsion/exportar?from=${sp.from ?? ''}&to=${sp.to ?? ''}`

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f8fafc', color: '#1e293b', fontFamily: 'var(--apple-font-display)', paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <DashboardHeader user={user} roleLabel="Agente 911" backHref="/agente_911/reportes" backLabel="Reportes" variant="apple" />

      <main className="pad-pagina" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 24, width: '100%' }}>
        <PageHeader
          title="Reporte de Llamadas de"
          accent="Extorsión"
          subtitle={fechaReporte}
          actions={<BotonExportarExcel href={exportHref} nombreArchivo={`llamadas_extorsion_${new Date().toISOString().split('T')[0]}.xlsx`} />}
        />

        <FiltroRangoFechas basePath="/agente_911/reportes/extorsion" />

        <TablaExtorsion data={data} />

        <div style={{ fontFamily: 'var(--apple-font-display)', fontSize: 12, fontWeight: 500, color: '#94a3b8' }}>
          {data.length} registro{data.length === 1 ? '' : 's'} en el rango seleccionado
        </div>
      </main>
    </div>
  )
}
