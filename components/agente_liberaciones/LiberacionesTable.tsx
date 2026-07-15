'use client'

import LiberacionesDashboard from "./LiberacionesDashboard"

interface DataRow {
    id: string
    nombre_infractor?: string
    correo_infractor?: string
    folio?: string
    estatus?: string
    placa?: string
    created_at?: string
    [key: string]: any
}

interface LiberacionesTableProps {
    respuestaServidor: {
        data: DataRow[]
        total: number
    }
}

const columns = [
    { key: "folio", label: "Folio" },
    { key: "nombre_infractor", label: "Nombre Infractor" },
    { key: "placa", label: "Placa" },
    { key: "estatus", label: "Estatus" },
    { key: "acciones", label: "Acciones" },
]

export default function LiberacionesTable({ respuestaServidor }: LiberacionesTableProps) {
    const listaDatos = respuestaServidor?.data ?? []

    return (
        <LiberacionesDashboard
            data={listaDatos}
            visibleColumns={columns}
        />
    )
}
