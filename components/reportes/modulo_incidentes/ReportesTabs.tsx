"use client"
import { useState } from 'react'
import { 
    Bike, Car, Search, Gavel, FileText, 
    UserCheck, Droplet, Crosshair, Beaker 
} from 'lucide-react'
import { OperationalTable } from './ReportTables'
import { styles } from './styles'

export function ReportesTabs({ data }: { data: any }) {
    const [activeTab, setActiveTab] = useState('MOTOS')

    return (
        <>
            {/* SELECTOR DE PESTAÑAS - Ahora con scroll horizontal por si crecen más */}
            <div style={{ 
                display: 'flex', 
                gap: '5px', 
                marginBottom: '25px', 
                borderBottom: '2px solid #E2E8F0',
                overflowX: 'auto',
                whiteSpace: 'nowrap',
                paddingBottom: '5px'
            }}>
                <button onClick={() => setActiveTab('MOTOS')} style={styles.tabButton(activeTab === 'MOTOS')}><Bike size={18}/> MOTOS</button>
                <button onClick={() => setActiveTab('VEHICULOS')} style={styles.tabButton(activeTab === 'VEHICULOS')}><Car size={18}/> VEHÍCULOS</button>
                <button onClick={() => setActiveTab('CATEOS')} style={styles.tabButton(activeTab === 'CATEOS')}><Search size={18}/> CATEOS</button>
                <button onClick={() => setActiveTab('DETENIDOS')} style={styles.tabButton(activeTab === 'DETENIDOS')}><Gavel size={18}/> DETENIDOS</button>
                <button onClick={() => setActiveTab('FALTAS')} style={styles.tabButton(activeTab === 'FALTAS')}><FileText size={18}/> FALTAS ADM.</button>
                <button onClick={() => setActiveTab('ORDENES')} style={styles.tabButton(activeTab === 'ORDENES')}><UserCheck size={18}/> ÓRDENES APREH.</button>
                <button onClick={() => setActiveTab('HIDROCARBURO')} style={styles.tabButton(activeTab === 'HIDROCARBURO')}><Droplet size={18}/> HIDROCARBURO</button>
                <button onClick={() => setActiveTab('ARMAS')} style={styles.tabButton(activeTab === 'ARMAS')}><Crosshair size={18}/> ARMAS</button>
                <button onClick={() => setActiveTab('DROGA')} style={styles.tabButton(activeTab === 'DROGA')}><Beaker size={18}/> DOSIS DROGA</button>
            </div>

            {/* TABLAS FILTRADAS POR PESTAÑA */}
            
            {activeTab === 'MOTOS' && (
                <OperationalTable title="MOTOS ROBADAS Y RECUPERADAS" columns={['FECHA', 'FOLIO', 'DATOS', 'ESTATUS', 'CARPETA', 'SEGUIMIENTO']} data={data.motos || []} />
            )}

            {activeTab === 'VEHICULOS' && (
                <OperationalTable title="VEHÍCULOS ROBADOS Y RECUPERADOS" columns={['FECHA', 'FOLIO', 'DATOS', 'ESTATUS', 'CARPETA', 'SEGUIMIENTO']} data={data.vehiculos || []} />
            )}

            {activeTab === 'CATEOS' && (
                <OperationalTable title="CATEOS FGE-FGR" columns={['FECHA', 'FOLIO', 'UBICACIÓN', 'DEPENDENCIA', 'SEGUIMIENTO']} data={data.cateos || []} />
            )}

            {activeTab === 'DETENIDOS' && (
                <OperationalTable title="DETENIDOS A FISCALÍA" columns={['FECHA', 'FOLIO', 'NOMBRE DETENIDO', 'OBSERVACIONES', 'FISCALÍA', 'SEGUIMIENTO']} data={data.detenidos || []} />
            )}

            {activeTab === 'FALTAS' && (
                <OperationalTable title="FALTAS ADMINISTRATIVAS" columns={['FECHA', 'FOLIO', 'INFRACTOR', 'OBSERVACIONES', 'SEGUIMIENTO', 'FICHA', 'NOVEDADES']} data={data.faltas || []} />
            )}

            {activeTab === 'ORDENES' && (
                <OperationalTable title="ÓRDENES DE APREHENSIÓN" columns={['FECHA', 'FOLIO', 'NOMBRE', 'OBSERVACIONES', 'ESTATUS', 'SEGUIMIENTO']} data={data.ordenes || []} />
            )}

            {activeTab === 'HIDROCARBURO' && (
                <OperationalTable title="DETENCIONES DELITO HIDROCARBURO" columns={['FECHA', 'FOLIO', 'NOMBRE', 'VEHÍCULO', 'LITROS', 'TOMA CLANDESTINA', 'OBSERVACIONES', 'SEGUIMIENTO']} data={data.hidrocarburo || []} />
            )}

            {activeTab === 'ARMAS' && (
                <OperationalTable title="ASEGURAMIENTO DE ARMAS DE FUEGO" columns={['FECHA', 'FOLIO', 'DATOS ARMA', 'CARTUCHOS', 'OBSERVACIONES', 'SEGUIMIENTO']} data={data.armas || []} />
            )}

            {activeTab === 'DROGA' && (
                <OperationalTable title="ASEGURAMIENTO DE DOSIS DE DROGA" columns={['FECHA', 'FOLIO', 'CANTIDAD', 'NOMBRE/TIPO', 'OBSERVACIONES', 'SEGUIMIENTO']} data={data.droga || []} />
            )}
        </>
    )
}