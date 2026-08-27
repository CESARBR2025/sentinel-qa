"use client"
import { useState } from 'react'
import { 
    Bike, Car, Search, Gavel, FileText, 
    UserCheck, Droplet, Crosshair, Beaker 
} from 'lucide-react'
import { OperationalTable } from './ReportTables'
import { styles } from './styles'

type TableRow = Record<string, string | number | boolean | null | undefined>

export function ReportesTabs({ data }: { data: Record<string, TableRow[]> }) {
    const [activeTab, setActiveTab] = useState('MOTOS')

    return (
        <>
            {/* SELECTOR DE PESTAÑAS - pills con scroll horizontal */}
            <div style={{ 
                display: 'flex', 
                gap: '6px', 
                marginBottom: '24px', 
                overflowX: 'auto',
                whiteSpace: 'nowrap',
                paddingBottom: '4px'
            }} className="scrollbar-hide">
                <button onClick={() => setActiveTab('MOTOS')} style={styles.tabButton(activeTab === 'MOTOS')}><Bike size={14}/> Motos</button>
                <button onClick={() => setActiveTab('VEHICULOS')} style={styles.tabButton(activeTab === 'VEHICULOS')}><Car size={14}/> Vehículos</button>
                <button onClick={() => setActiveTab('CATEOS')} style={styles.tabButton(activeTab === 'CATEOS')}><Search size={14}/> Cateos</button>
                <button onClick={() => setActiveTab('DETENIDOS')} style={styles.tabButton(activeTab === 'DETENIDOS')}><Gavel size={14}/> Detenidos</button>
                <button onClick={() => setActiveTab('FALTAS')} style={styles.tabButton(activeTab === 'FALTAS')}><FileText size={14}/> Faltas adm.</button>
                <button onClick={() => setActiveTab('ORDENES')} style={styles.tabButton(activeTab === 'ORDENES')}><UserCheck size={14}/> Órdenes apreh.</button>
                <button onClick={() => setActiveTab('HIDROCARBURO')} style={styles.tabButton(activeTab === 'HIDROCARBURO')}><Droplet size={14}/> Hidrocarburo</button>
                <button onClick={() => setActiveTab('ARMAS')} style={styles.tabButton(activeTab === 'ARMAS')}><Crosshair size={14}/> Armas</button>
                <button onClick={() => setActiveTab('DROGA')} style={styles.tabButton(activeTab === 'DROGA')}><Beaker size={14}/> Dosis droga</button>
            </div>

            {/* TABLAS FILTRADAS POR PESTAÑA */}
            
            {activeTab === 'MOTOS' && (
                <OperationalTable title="Motos robadas y recuperadas" columns={['Fecha', 'Folio', 'Datos', 'Estatus', 'Carpeta', 'Seguimiento']} data={data.motos || []} />
            )}

            {activeTab === 'VEHICULOS' && (
                <OperationalTable title="Vehículos robados y recuperados" columns={['Fecha', 'Folio', 'Datos', 'Estatus', 'Carpeta', 'Seguimiento']} data={data.vehiculos || []} />
            )}

            {activeTab === 'CATEOS' && (
                <OperationalTable title="Cateos FGE-FGR" columns={['Fecha', 'Folio', 'Ubicación', 'Dependencia', 'Seguimiento']} data={data.cateos || []} />
            )}

            {activeTab === 'DETENIDOS' && (
                <OperationalTable title="Detenidos a fiscalía" columns={['Fecha', 'Folio', 'Nombre detenido', 'Observaciones', 'Fiscalía', 'Seguimiento']} data={data.detenidos || []} />
            )}

            {activeTab === 'FALTAS' && (
                <OperationalTable title="Faltas administrativas" columns={['Fecha', 'Folio', 'Infractor', 'Observaciones', 'Seguimiento', 'Ficha', 'Novedades']} data={data.faltas || []} />
            )}

            {activeTab === 'ORDENES' && (
                <OperationalTable title="Órdenes de aprehensión" columns={['Fecha', 'Folio', 'Nombre', 'Observaciones', 'Estatus', 'Seguimiento']} data={data.ordenes || []} />
            )}

            {activeTab === 'HIDROCARBURO' && (
                <OperationalTable title="Detenciones delito hidrocarburo" columns={['Fecha', 'Folio', 'Nombre', 'Vehículo', 'Litros', 'Toma clandestina', 'Observaciones', 'Seguimiento']} data={data.hidrocarburo || []} />
            )}

            {activeTab === 'ARMAS' && (
                <OperationalTable title="Aseguramiento de armas de fuego" columns={['Fecha', 'Folio', 'Datos arma', 'Cartuchos', 'Observaciones', 'Seguimiento']} data={data.armas || []} />
            )}

            {activeTab === 'DROGA' && (
                <OperationalTable title="Aseguramiento de dosis de droga" columns={['Fecha', 'Folio', 'Cantidad', 'Nombre/tipo', 'Observaciones', 'Seguimiento']} data={data.droga || []} />
            )}
        </>
    )
}