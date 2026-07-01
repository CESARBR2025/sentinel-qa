import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { Plus } from 'lucide-react';

import { DashboardHeader } from '@/components/partials/Header';
import { styles } from '@/components/reportes/d1/styles';
import { D1Filters } from '@/components/reportes/d1/D1Filters';
import { D1ReportsTable } from '@/components/reportes/d1/D1ReportsTable';

async function getD1Data() {
    return [
        {
            folio_denuncia: 'D1-2024-001',
            fecha_reporte: '2024-05-25',
            hora_reporte: '14:20',
            delito: 'ROBO A TRANSEUNTE',
            violencia: 'SI',
            colonia: 'CENTRO',
            municipio: 'MONTERREY',
            crp: 'PM-402',
            nombre_policia: 'JUAN PÉREZ RODRÍGUEZ',
            genero_d1: 'SI',
            folio_cu: 'CU-88291'
        }
    ];
}

export default async function ReportesD1Page() {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) redirect('/login');

    const user = session.user as { name: string; email: string; image?: string };
    const data = await getD1Data();

    return (
        <div style={styles.container}>
            <style>{`@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&family=Barlow+Condensed:wght@700;800&family=Inter:wght@400;500;600;700&display=swap');`}</style>

            <DashboardHeader user={user} />

            <main style={styles.main}>
                <div style={styles.headerContainer}>
                    <div>
                        <span style={styles.tag}>SSPM · SISTEMA DE DENUNCIA D1</span>
                        <h1 style={styles.title}>REGISTRO DE <span style={{ color: '#2563EB' }}>REPORTES D1</span></h1>
                    </div>
                    <button style={styles.primaryButton}>
                        <Plus size={16} /> NUEVO REPORTE
                    </button>
                </div>

                <D1Filters />

                {/* SOLO LLAMAS A LA TABLA, ella hace todo el desmadre de paginación sola */}
                <D1ReportsTable data={data} />
                
            </main>
        </div>
    );
}