import { Phone, AlertOctagon, ShieldAlert, CalendarSearch } from 'lucide-react'
import { ReportStat } from '@/components/reportes/deteccion_camara/ReportStat'
import { styles } from '@/components/reportes/modulo_incidentes/styles'

export function PhoneStatsCards({ total, criticos }: { total: number, criticos: number }) {
    return (
        <div style={styles.statsGrid}>
            <ReportStat label="Números Reportados" value={total} icon={<Phone size={20} />} />
            <ReportStat label="Alertas Críticas" value={criticos} icon={<ShieldAlert size={20} />} />
            <ReportStat label="Incidencias Hoy" value={2} icon={<AlertOctagon size={20} />} />
            <ReportStat label="Consultas Sistema" value={142} icon={<CalendarSearch size={20} />} />
        </div>
    )
}