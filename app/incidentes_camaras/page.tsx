import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { FileDown, Download, UserCheck, Car, Shield, Camera, Flame } from 'lucide-react'

// Componentes locales
import { DashboardHeader } from '@/components/partials/Header'
import { ReportStat } from '@/components/reportes/deteccion_camara/ReportStat'
import { ReportFilters } from '@/components/reportes/deteccion_camara/ReportFilters'
import { ReportTable } from '@/components/reportes/deteccion_camara/ReportTables'
import { styles } from '@/components/reportes/deteccion_camara/styles'
import { db } from '@/lib/db/index'
import { users, roles } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

async function getReportData(from?: string, to?: string) {
    return {
        persSinNovedad: 1200,
        persConAntecedentes: 50,
        vehMandadosARevisar: 85,
        vehRepuve: 430,
        persecuciones: 5,
        asegurados: 14,
        vehRecuperados: 8,
        incendios: 12,
        hechosTransito: 22,
        motosRevisadas: 156,
        totalPersonas: 1250
    }
}

export default async function ReportesCamarasPage({
    searchParams
}: {
    searchParams: Promise<{ from?: string, to?: string }> | { from?: string, to?: string }
}) {
    // 1. VALIDACIÓN DE SESIÓN (Tal cual como en tu código del 911)
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session) redirect('/login')

    const [userRole] = await db
        .select({ rolNombre: roles.nombre })
        .from(users)
        .leftJoin(roles, eq(users.rolId, roles.id))
        .where(eq(users.id, session.user.id))
        .limit(1)

    if (!['Administrador', 'Reportante'].includes(userRole?.rolNombre ?? '')) redirect('/dashboard')

    // 2. CASTING DEL USER PARA EVITAR EL ERROR EN ROJO
    const user = session.user as { name: string; email: string; image?: string }

    // Resolvemos params por si usas Next.js 15
    const params = await searchParams
    const stats = await getReportData(params.from, params.to)

    return (
        <div style={styles.container}>
            <style>{`@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&family=Barlow+Condensed:wght@700;800&family=Inter:wght@400;500;600;700&display=swap');`}</style>

            {/* 3. PASAMOS EL USER AL HEADER */}
            <DashboardHeader user={user} />

            <main style={styles.main}>

                {/* TITULOS */}
                <div style={styles.headerContainer}>
                    <div>
                        <span style={styles.tag}>SSPM · INTELIGENCIA OPERATIVA</span>
                        <h1 style={styles.title}>CONCENTRADO <span style={{ color: '#2563EB' }}>MENSUAL TOTAL</span></h1>
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button style={{ ...styles.primaryButton, background: 'white', color: '#0F172A', border: '1px solid #CBD5E1' }}>
                            <FileDown size={16} /> PDF
                        </button>
                        <button style={styles.primaryButton}>
                            <Download size={16} /> EXCEL
                        </button>
                    </div>
                </div>

                <ReportFilters />

                {/* RESUMEN DE STATS */}
                <div style={styles.statsGrid}>
                    <ReportStat label="Total Personas" value={stats.totalPersonas} icon={<UserCheck size={20} />} />
                    <ReportStat label="Vehíc. REPUVE" value={stats.vehRepuve} icon={<Car size={20} />} />
                    <ReportStat label="Asegurados" value={stats.asegurados} icon={<Shield size={20} />} />
                    <ReportStat label="Recuperados" value={stats.vehRecuperados} icon={<Camera size={20} />} />
                    <ReportStat label="Motos" value={stats.motosRevisadas} icon={<Car size={20} />} />
                    <ReportStat label="Incendios" value={stats.incendios} icon={<Flame size={20} />} />
                </div>

                <ReportTable data={stats} />

            </main>
        </div>
    )
}