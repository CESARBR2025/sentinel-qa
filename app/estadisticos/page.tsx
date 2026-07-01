import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { FileDown, Download } from 'lucide-react'

import { DashboardHeader } from '@/components/partials/Header'
import { ReportFilters } from '@/components/reportes/deteccion_camara/ReportFilters'
import { styles } from '@/components/reportes/modulo_incidentes/styles'
import { PhoneStatsCards } from '@/components/reportes/estadisticos/PhoneStatsCards'
import { PhoneReportsTable } from '@/components/reportes/estadisticos/PhoneReportsTable'

async function getPhoneData() {
    // Simulación de datos
    return [
        { folio: 'TEL-9021', telefono: '55-1234-5678', fecha: '2024-05-24 10:30', incidencia: 'EXTORSIÓN TELEFÓNICA', estatus: 'CRÍTICO' },
        { folio: 'TEL-8822', telefono: '33-9876-5432', fecha: '2024-05-24 09:15', incidencia: 'FRAUDE BANCARIO', estatus: 'PENDIENTE' },
        { folio: 'TEL-1044', telefono: '81-1122-3344', fecha: '2024-05-23 14:00', incidencia: 'SPAM PUBLICITARIO', estatus: 'ACTIVA' },
    ]
}

export default async function ReportesTelefonicosPage() {
    const session = await auth.api.getSession({ headers: await headers() })
    
    // 1. El redirect ayuda, pero TypeScript a veces necesita una validación extra
    if (!session) redirect('/login')

    // 2. Definimos 'user' y le decimos a TS qué campos tiene (Casteo)
    // Esto quita el error en rojo del componente DashboardHeader
    const user = session.user as { name: string; email: string; image?: string }

    const data = await getPhoneData()
    const criticos = data.filter(d => d.estatus === 'CRÍTICO').length

    return (
        <div style={styles.container}>
            <style>{`@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&family=Barlow+Condensed:wght@700;800&family=Inter:wght@400;500;600;700&display=swap');`}</style>
            
            {/* 3. Ahora pasamos la constante 'user' que ya está validada */}
            <DashboardHeader user={user} />

            <main style={styles.main}>
                <div style={styles.headerContainer}>
                    <div>
                        <span style={styles.tag}>SSPM · INTELIGENCIA DE COMUNICACIONES</span>
                        <h1 style={styles.title}>REPORTES <span style={{ color: '#2563EB' }}>TELEFÓNICOS</span></h1>
                    </div>
                </div>

                <ReportFilters />
                <PhoneStatsCards total={data.length} criticos={criticos} />
                <PhoneReportsTable data={data} />
            </main>
        </div>
    )
}