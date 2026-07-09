import { auth }    from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { Download, Users, Car, ShieldAlert, Flame } from 'lucide-react'
import { DashboardHeader } from '@/components/partials/Header'
import { ReportStat }      from '@/components/reportes/deteccion_camara/ReportStat'
import { ReportFilters }   from '@/components/reportes/deteccion_camara/ReportFilters'
import { ReportTable }     from '@/components/reportes/deteccion_camara/ReportTables'
import { styles }          from '@/components/reportes/deteccion_camara/styles'
import { listarIncidentesCamara } from '@/lib/camara/service'
import { getUserWithRole } from '@/lib/auth/helpers'
import { tienePermiso } from '@/lib/incidentes/permisos'

export default async function ReportesDeteccionCamaraPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; to?: string }>
}) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')

  const userWithRole = await getUserWithRole(session.user.id)

  if (!userWithRole || !['Administrador', 'Reportante'].includes(userWithRole.rolNombre ?? '')) redirect('/dashboard')
  if (!(await tienePermiso(session.user.id, 'incidentes_camaras', 'ver'))) redirect('/dashboard')

  const user = session.user as { name: string; email: string; image?: string }
  const sp   = await searchParams
  const { registros, totales } = await listarIncidentesCamara(sp.from || undefined, sp.to || undefined)

  const excelParams = new URLSearchParams()
  if (sp.from) excelParams.set('from', sp.from)
  if (sp.to)   excelParams.set('to',   sp.to)

  return (
    <div style={styles.container}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&family=Barlow+Condensed:wght@700;800&family=Inter:wght@400;500;600;700&display=swap');`}</style>
      <DashboardHeader user={user} />
      <main style={styles.main}>
        <div style={styles.headerContainer}>
          <div>
            <span style={styles.tag}>SSPM · DETECCIÓN POR CÁMARA</span>
            <h1 style={styles.title}>REGISTROS <span style={{ color: '#2563EB' }}>POR TURNO</span></h1>
          </div>
          <a href={`/api/camara/exportar?${excelParams}`}
            style={{ ...styles.primaryButton, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <Download size={16} /> EXCEL
          </a>
        </div>

        <ReportFilters />

        <div style={styles.statsGrid}>
          <ReportStat label="Total Personas"     value={totales.totalPersonas}   icon={<Users size={20} />} />
          <ReportStat label="Con Antecedentes"   value={totales.conAntecedentes} icon={<ShieldAlert size={20} />} />
          <ReportStat label="Vehículos Revisados" value={totales.vehiculos}      icon={<Car size={20} />} />
          <ReportStat label="Asegurados"         value={totales.asegurados}      icon={<ShieldAlert size={20} />} />
          <ReportStat label="Recuperados"        value={totales.recuperados}     icon={<Car size={20} />} />
          <ReportStat label="Incendios"          value={registros.reduce((a, r) => a + r.incendios, 0)} icon={<Flame size={20} />} />
        </div>

        <ReportTable data={registros} />
      </main>
    </div>
  )
}