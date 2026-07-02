import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { FileStack, Plus, FileDown } from 'lucide-react';

import { DashboardHeader } from '@/components/partials/Header';
import { styles } from '@/components/reportes/sin_robos/styles';
import { TablaReportesLimpios } from '@/components/reportes/sin_robos/ReporteSinRobos';
import { ReportFilters } from '@/components/reportes/sin_robos/ReportFilters';

export default async function ReportesLimpiosPage() {
    // ESTO ES LO DEL USUARIO
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) redirect('/login');

    const user = session.user as { name: string; email: string; image?: string };

    const data = [
        { folio: 'SR-102', fecha: '2024-05-25', nombreReportante: 'Juan Pérez', telefono: '811-222-3344', conclusion: 'Zona revisada sin hallazgos de robo confirmado.' },
        { folio: 'SR-103', fecha: '2024-05-26', nombreReportante: 'Maria Silva', telefono: '811-555-6677', conclusion: 'Patrullaje preventivo finalizado con éxito.' }
    ];

    return (
        <div style={styles.container}>
            <style>{`@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&family=Barlow+Condensed:wght@700;800&family=Inter:wght@400;500;600;700&display=swap');`}</style>
            
            {/* PASAMOS EL USER REAL AQUI */}
            <DashboardHeader user={user} />

            <main style={styles.main}>
                <div style={styles.headerContainer}>
                    <div>
                        <span style={styles.tag}>SSPM · SISTEMA SENTINEL</span>
                        <h1 style={styles.title}>REPORTES <span style={{ color: '#2563EB' }}>SIN NOVEDAD</span></h1>
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button style={{ ...styles.primaryButton, background: 'white', color: '#0F172A', border: '1px solid #CBD5E1' }}>
                            <FileDown size={16} /> PDF
                        </button>
                        <button style={{ ...styles.primaryButton, background: '#2563EB' }}>
                            <FileStack size={16} /> EXPORTAR EXCEL
                        </button>
                    </div>
                </div>
                
                <ReportFilters />
                
                <TablaReportesLimpios data={data} />
            </main>
        </div>
    );
}