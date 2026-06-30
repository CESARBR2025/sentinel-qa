"use client"
import { useState } from 'react'
import { Bike, Car, Search, Gavel } from 'lucide-react'
import { OperationalTable } from './ReportTables'
import { styles } from './styles'

export function ReportesTabs({ data }: { data: any }) {
    const [activeTab, setActiveTab] = useState('MOTOS')

    return (
        <>
            {/* SELECTOR DE PESTAÑAS */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '25px', borderBottom: '2px solid #E2E8F0' }}>
                <button onClick={() => setActiveTab('MOTOS')} style={styles.tabButton(activeTab === 'MOTOS')}>
                    <Bike size={18}/> MOTOS
                </button>
                <button onClick={() => setActiveTab('VEHICULOS')} style={styles.tabButton(activeTab === 'VEHICULOS')}>
                    <Car size={18}/> VEHÍCULOS
                </button>
                <button onClick={() => setActiveTab('CATEOS')} style={styles.tabButton(activeTab === 'CATEOS')}>
                    <Search size={18}/> CATEOS
                </button>
                <button onClick={() => setActiveTab('DETENIDOS')} style={styles.tabButton(activeTab === 'DETENIDOS')}>
                    <Gavel size={18}/> DETENIDOS
                </button>
            </div>

            {/* TABLAS FILTRADAS POR PESTAÑA */}
            {activeTab === 'MOTOS' && (
                <OperationalTable title="MOTOS ROBADAS Y RECUPERADAS" columns={['FECHA', 'FOLIO', 'DATOS', 'ESTATUS', 'CARPETA', 'SEGUIMIENTO']} data={data.motos} />
            )}
            {activeTab === 'VEHICULOS' && (
                <OperationalTable title="VEHÍCULOS ROBADOS Y RECUPERADOS" columns={['FECHA', 'FOLIO', 'DATOS', 'ESTATUS', 'CARPETA', 'SEGUIMIENTO']} data={data.vehiculos} />
            )}
            {activeTab === 'CATEOS' && (
                <OperationalTable title="CATEOS FGE-FGR" columns={['FECHA', 'FOLIO', 'UBICACIÓN', 'DEPENDENCIA', 'SEGUIMIENTO']} data={data.cateos} />
            )}
            {activeTab === 'DETENIDOS' && (
                <OperationalTable title="DETENIDOS A FISCALÍA" columns={['FECHA', 'FOLIO', 'NOMBRE', 'OBSERVACIONES', 'FISCALÍA', 'SEGUIMIENTO']} data={data.detenidos} />
            )}
        </>
    )
}