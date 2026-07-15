'use client'

import JuzgadoDashboard from './JuzgadoDashboard'

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

interface JuzgadoTableProps {
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

export function JuzgadoTable({ respuestaServidor }: JuzgadoTableProps) {
    const listaDatos = respuestaServidor?.data ?? []
    console.log(listaDatos)
    return (
        <JuzgadoDashboard
            data={listaDatos}
            visibleColumns={columns}
        />
    )
}
