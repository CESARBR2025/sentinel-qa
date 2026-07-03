import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import {
    FileDown, Download, Lock, Gavel, Users, Car,
    Search, ShieldAlert, Zap, Sword, Pill, Tent
} from 'lucide-react'
import { DashboardHeader } from '@/components/partials/Header'

import { styles } from '@/components/reportes/incidentes/styles'
import { FiltrosIncidencias } from '@/components/reportes/incidentes/FiltrosIncidencias'
import { IncidenteStat } from '@/components/reportes/incidentes/StatIncidencia'
import { TablaIncidentes } from '@/components/reportes/incidentes/TablaIncidentes'
import { Pagination } from '@/components/reportes/incidentes/Paginacion'
import { db } from '@/lib/db/index'
import { users, roles } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export default async function ReportesIncidentesPage({
    searchParams,
}: {
    // AGREGAMOS 'page?: string' AQUÍ PARA QUITAR EL ROJO
    searchParams: Promise<{ from?: string; to?: string; tipo?: string; page?: string }>
}) {
    // 1. Autenticación y sesión
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session) redirect('/login')

    const [userRole] = await db
        .select({ rolNombre: roles.nombre })
        .from(users)
        .leftJoin(roles, eq(users.rolId, roles.id))
        .where(eq(users.id, session.user.id))
        .limit(1)

    if (!['Administrador', 'Reportante'].includes(userRole?.rolNombre ?? '')) redirect('/dashboard')


    // 2. Preparación de datos de usuario y filtros
    const user = session.user as { name: string; email: string; image?: string }
    const sp = await searchParams
    const tipo = sp.tipo || 'diario'

    // 3. Lógica de Paginación
    const currentPage = Number(sp.page) || 1;
    const itemsPerPage = 10;
    const totalRecords = 45; // Simulado
    const totalPages = Math.ceil(totalRecords / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;

    // 4. Datos simulados para las Stats
    const statsData = {
        carcel: 85,
        fiscalia: 24,
        fgr: 8,
        vehiculos: 12,
        cateos: 5,
        operativos: 20,
        armas: 3,
        drogas: 200,
        fiestas: 2
    }

    // 5. Datos simulados para la Tabla
    const tablaData = [
        {
            fecha: '2024-05-20', carcel: 15, fiscalia: 4, fgr: 1,
            vehiculos: 2, cateo_fge: 1, operativos: 5, cateo_fgr: 0,
            armas_fuego: 1, armas_blancas: 2, drogas: 45, fiestas: 0
        },
        {
            fecha: '2024-05-19', carcel: 12, fiscalia: 2, fgr: 0,
            vehiculos: 1, cateo_fge: 0, operativos: 3, cateo_fgr: 1,
            armas_fuego: 0, armas_blancas: 1, drogas: 12, fiestas: 1
        }
    ]

    return (
        <div style={styles.container}>
            <style>{`@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&family=Barlow+Condensed:wght@700;800&family=Inter:wght@400;500;600;700&display=swap');`}</style>

            <DashboardHeader user={user} />

            <main style={styles.main}>
                <div style={styles.headerContainer}>
                    <div>
                        <span style={styles.tag}>SSPM · INTELIGENCIA OPERATIVA</span>
                        <h1 style={styles.title}>
                            REPORTES DE <span style={{ color: '#2563EB' }}>INCIDENTES</span>
                        </h1>
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

                <FiltrosIncidencias />

                <div style={styles.statsGrid}>
                    <IncidenteStat label="Cárcel Municipal" value={statsData.carcel} icon={<Lock size={20} />} />
                    <IncidenteStat label="Detenidos Fiscalía" value={statsData.fiscalia} icon={<Gavel size={20} />} />
                    <IncidenteStat label="Detenidos FGR" value={statsData.fgr} icon={<Users size={20} />} />

                    {tipo === 'semanal' && (
                        <>
                            <IncidenteStat label="Vehíc. Recup." value={statsData.vehiculos} icon={<Car size={20} />} />
                            <IncidenteStat label="Apoyos Cateo FGE" value={statsData.cateos} icon={<Search size={20} />} />
                            <IncidenteStat label="Operativos Totales" value={statsData.operativos} icon={<ShieldAlert size={20} />} />
                            <IncidenteStat label="Armas de Fuego" value={statsData.armas} icon={<Zap size={20} />} />
                            <IncidenteStat label="Dosis de Droga" value={statsData.drogas} icon={<Pill size={20} />} />
                            <IncidenteStat label="Fiestas Patronales" value={statsData.fiestas} icon={<Tent size={20} />} />
                        </>
                    )}
                </div>

                <div key={tipo} style={{ marginTop: '40px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                        <div style={{ width: '4px', height: '24px', background: '#2563EB' }} />
                        <h2 style={{
                            fontFamily: 'Barlow Condensed, sans-serif',
                            fontSize: '24px',
                            fontWeight: 700,
                            color: '#0F172A',
                            textTransform: 'uppercase',
                            margin: 0
                        }}>
                            Desglose detallado de incidencias ({tipo})
                        </h2>
                    </div>

                    <TablaIncidentes tipo={tipo} data={tablaData} />

                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        totalRecords={totalRecords}
                        startIndex={startIndex}
                        itemsPerPage={itemsPerPage}
                    />
                </div>

                <footer style={{
                    marginTop: '48px',
                    paddingTop: '24px',
                    borderTop: '1px solid #E2E8F0',
                    textAlign: 'center'
                }}>
                    <p style={{
                        fontFamily: 'JetBrains Mono, monospace',
                        fontSize: '11px',
                        color: '#94A3B8',
                        margin: 0
                    }}>
                        SISTEMA DE INTELIGENCIA OPERATIVA SSPM © {new Date().getFullYear()} — CONFIDENCIAL
                    </p>
                </footer>
            </main>
        </div>
    )
}