import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { FileDown } from 'lucide-react';

import { DashboardHeader } from '@/components/partials/Header';
import { styles } from '@/components/reportes/d1_noiniciada/styles';
import { DescargaFilters } from '@/components/reportes/d1_noiniciada/DescargaFilters';
import { DescargaTable } from '@/components/reportes/d1_noiniciada/DescargaTable';

async function getPendientesData() {
    // Simulación de datos con los campos solicitados
    return [
        {
            folio: 'PEND-88229',
            fecha: '2024-05-28',
            nombre_afectado: 'CARLOS RODRÍGUEZ MONSIVÁIS',
            telefono: '812-445-9901',
            documentacion: 'INE VIGENTE (ORIGINAL Y COPIA)',
        },
        {
            folio: 'PEND-88235',
            fecha: '2024-05-28',
            nombre_afectado: 'ANA PATRICIA SOTO',
            telefono: '811-002-3344',
            documentacion: 'PASAPORTE / COMPROBANTE DE DOMICILIO',
        }
    ];
}

export default async function DescargasPage() {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) redirect('/login');

    const user = session.user as { name: string; email: string; image?: string };
    const data = await getPendientesData();

    return (
        <div style={styles.container}>
            <style>{`@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&family=Barlow+Condensed:wght@700;800&family=Inter:wght@400;500;600;700&display=swap');`}</style>

            <DashboardHeader user={user} />

            <main style={styles.main}>
                <div style={styles.headerContainer}>
                    <div>
                        <span style={styles.tag}>SSPM · MÓDULO DE TRÁMITE INICIAL</span>
                        <h1 style={styles.title}>REPORTES <span style={{ color: '#2563EB' }}>SIN D1 INICIADA</span></h1>
                    </div>
                </div>

                <DescargaFilters />
                <DescargaTable data={data} />
            </main>
        </div>
    );
}