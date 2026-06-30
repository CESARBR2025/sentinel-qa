import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { FileDown, Download, Bike, Car, ShieldAlert, Gavel, Search } from 'lucide-react'

import { DashboardHeader } from '@/components/partials/Header'
import { ReportStat } from '@/components/reportes/deteccion_camara/ReportStat'
import { ReportFilters } from '@/components/reportes/deteccion_camara/ReportFilters'
import { OperationalTable } from '@/components/reportes/modulo_incidentes/ReportTables'
import { styles } from '@/components/reportes/modulo_incidentes/styles'
import { ReportesTabs } from '@/components/reportes/modulo_incidentes/ReportesTabs'

async function getOperationalData() {
    // Simulación de datos según tus campos solicitados
    return {
        motos: [
            { fecha: '2024-05-24', folio: 'INC-9021', datos: 'Italika 250Z Negra', estatus: 'RECUPERADO', carpeta: 'FGE-001/24', seguimiento: 'Oficial Pérez' },
        ],
        vehiculos: [
            { fecha: '2024-05-24', folio: 'INC-8822', datos: 'Nissan March Gris', estatus: 'ROBADO', carpeta: 'FGE-102/24', seguimiento: 'Oficial Gómez' },
        ],
        cateos: [
            { fecha: '2024-05-23', folio: 'CAT-004', ubicacion: 'Col. Centro, Av. 5', dependencia: 'FGE', seguimiento: 'Cmdte. Rivas' }
        ],
        detenidos: [
            { fecha: '2024-05-24', folio: 'DET-552', nombre: 'Juan "N"', observaciones: 'Posesión de narcóticos', fiscalia: 'Narcomenudeo', seguimiento: 'Oficial Sosa' }
        ]
    }
}

export default async function ReportesOperativosPage({ 
    searchParams 
}: { 
    searchParams: Promise<{ from?: string, to?: string }> | { from?: string, to?: string } 
}) {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session) redirect('/login')

    const user = session.user as { name: string; email: string; image?: string }
    const data = await getOperationalData()

    return (
        <div style={styles.container}>
            <style>{`@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&family=Barlow+Condensed:wght@700;800&family=Inter:wght@400;500;600;700&display=swap');`}</style>
            
            <DashboardHeader user={user} />

            <main style={styles.main}>
                
                <div style={styles.headerContainer}>
                    <div>
                        <span style={styles.tag}>SSPM · INTELIGENCIA OPERATIVA</span>
                        <h1 style={styles.title}>REPORTES <span style={{ color: '#2563EB' }}>OPERATIVOS</span></h1>
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button style={{...styles.primaryButton, background: 'white', color: '#0F172A', border: '1px solid #CBD5E1'}}>
                            <FileDown size={16} /> PDF
                        </button>
                        <button style={styles.primaryButton}>
                            <Download size={16} /> EXCEL
                        </button>
                    </div>
                </div>

                <ReportFilters />

                {/* RESUMEN RÁPIDO */}
                <div style={styles.statsGrid}>
                    <ReportStat label="Motos Recup." value={data.motos.length} icon={<Bike size={20} />} />
                    <ReportStat label="Vehíc. Recup." value={data.vehiculos.length} icon={<Car size={20} />} />
                    <ReportStat label="Cateos Totales" value={data.cateos.length} icon={<Search size={20} />} />
                    <ReportStat label="Detenidos" value={data.detenidos.length} icon={<Gavel size={20} />} />
                </div>

                {/* TABLAS POR CLASIFICACIÓN */}
                
                  <ReportesTabs data={data} />
            </main>
        </div>
    )
}