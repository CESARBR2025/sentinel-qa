'use client'

import { BotonVerDetalle } from '@/features/compartido/components/ButtonVerDetalles'
import CapturarDatosInfractorModal from './CapturarDatosInfractorModal'
import ModalEntregarGarantia from './ModalEntregarGarantia'
import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Clock, CheckCircle2, AlertCircle, Search, User, ArrowUpDown, ArrowUp, ArrowDown, Download, Calendar, X, Shield } from 'lucide-react'

const AVATAR_COLORS = [
    { bg: '#EFF6FF', text: '#2563EB' },
    { bg: '#FEF3C7', text: '#D97706' },
    { bg: '#DCFCE7', text: '#16A34A' },
    { bg: '#FEE2E2', text: '#DC2626' },
    { bg: '#F3E8FF', text: '#9333EA' },
    { bg: '#FCE7F3', text: '#DB2777' },
    { bg: '#E0F2FE', text: '#0284C7' },
    { bg: '#F0FDFA', text: '#0F766E' },
]

function getInitials(name: string): string {
    const parts = name.trim().split(/\s+/)
    if (parts.length === 0 || !name.trim()) return '?'
    if (parts.length === 1) return (parts[0][0] ?? '?').toUpperCase()
    return ((parts[0][0] ?? '') + (parts[parts.length - 1][0] ?? '')).toUpperCase()
}

function hashColor(str: string, palette: typeof AVATAR_COLORS) {
    let hash = 0
    for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash)
    return palette[Math.abs(hash) % palette.length]
}

interface Props {
    data: any[]
    visibleColumns: any[]
    loading?: boolean
}

type EstatusInfracciones =
    | 'PENDIENTE_DATOS_INFRACTOR'
    | 'PENDIENTE_PAGO'
    | 'PENDIENTE_DEVOLUCION_GARANTIA'
    | 'LIBERADA_POR_INFRACCION'
    | 'LIBERADO_INFRACCIONES_INSTANTE'

const STATUS_TABS: { key: EstatusInfracciones; label: string; icon: typeof Clock; color: string }[] = [
    { key: 'PENDIENTE_DATOS_INFRACTOR', label: 'Pendiente datos', icon: Clock, color: '#F59E0B' },
    { key: 'PENDIENTE_PAGO', label: 'Pendiente pago', icon: Clock, color: '#F97316' },
    { key: 'PENDIENTE_DEVOLUCION_GARANTIA', label: 'Pendiente devolución', icon: Clock, color: '#EC4899' },
    { key: 'LIBERADA_POR_INFRACCION', label: 'Liberadas', icon: CheckCircle2, color: '#22C55E' },
    { key: 'LIBERADO_INFRACCIONES_INSTANTE', label: 'Pagadas instante', icon: CheckCircle2, color: '#10B981' },
]

const STATUS_BADGE: Record<string, { bg: string; text: string; dot: string; label: string }> = {
    PENDIENTE_DATOS_INFRACTOR: { bg: '#FEF3C7', text: '#78350F', dot: '#F59E0B', label: 'Pendiente datos' },
    LIBERADO_POR_INFRACCIONES: { bg: '#DCFCE7', text: '#166534', dot: '#22C55E', label: 'Liberada' },
    LIBERADO_INFRACCIONES_INSTANTE: { bg: '#D1FAE5', text: '#065F46', dot: '#10B981', label: 'Pagada instante' },
    PENDIENTE_PAGO_LIBERACION: { bg: '#FED7AA', text: '#7C2D12', dot: '#F97316', label: 'Pendiente pago' },
    PENDIENTE_PAGO_INFRACCION: { bg: '#FED7AA', text: '#7C2D12', dot: '#F97316', label: 'Pendiente pago' },
    PENDIENTE_DEVOLUCION_GARANTIA: { bg: '#FCE7F3', text: '#9D174D', dot: '#EC4899', label: 'Pendiente devolución' },
    LIBERADA_POR_INFRACCION: { bg: '#DCFCE7', text: '#166534', dot: '#22C55E', label: 'Liberada' },
    LIBERADA_POR_DELITO: { bg: '#DCFCE7', text: '#166534', dot: '#22C55E', label: 'Liberada' },
    LIBERADA_POR_ACCIDENTE: { bg: '#DCFCE7', text: '#166534', dot: '#22C55E', label: 'Liberada' },
    FINALIZADA_ACCIDENTE: { bg: '#DCFCE7', text: '#166534', dot: '#22C55E', label: 'Finalizada' },
    FINALIZADA_INFRACCION: { bg: '#DCFCE7', text: '#166534', dot: '#22C55E', label: 'Finalizada' },
    FINALIZADA_DELITO: { bg: '#DCFCE7', text: '#166534', dot: '#22C55E', label: 'Finalizada' },
}

function getBadge(status: string) {
    return STATUS_BADGE[status] ?? { bg: '#F1F5F9', text: '#475569', dot: '#94A3B8', label: status }
}

const SORTABLE_KEYS = new Set(['folio', 'nombre_infractor', 'correo_infractor', 'placa'])

export default function InfraccionesDashboard({
    data,
    visibleColumns,
    loading = false,
}: Props) {
    const router = useRouter()
    const [filtro, setFiltro] = useState<EstatusInfracciones>('PENDIENTE_DATOS_INFRACTOR')
    const [busqueda, setBusqueda] = useState('')
    const [pagina, setPagina] = useState(1)
    const limite = 10
    const [sortField, setSortField] = useState<string | null>(null)
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
    const [fechaInicio, setFechaInicio] = useState('')
    const [fechaFin, setFechaFin] = useState('')
    const [capturarDatosId, setCapturarDatosId] = useState<string | null>(null)
    const [garantiaId, setGarantiaId] = useState<string | null>(null)

    function handleFiltroChange(key: EstatusInfracciones) {
        setFiltro(key)
        setPagina(1)
    }

    const estadisticas = useMemo(() => {
        const capturarDatos = data.filter(x => x.estatusInfraccion === 'REGISTRADA' && x.estatusDependencia === 'PENDIENTE_DATOS_INFRACTOR').length
        const pendientesPago = data.filter(x => x.estatusInfraccion === 'PENDIENTE_PAGO' && x.estatusDependencia === 'PENDIENTE_PAGO_INFRACCION').length
        const pendientesDevolucion = data.filter(x => x.estatusInfraccion === 'PAGADA' && x.estatusDependencia === 'PENDIENTE_DEVOLUCION_GARANTIA').length
        const liberadas = data.filter(x => x.estatusInfraccion === 'CERRADA' && x.estatusDependencia === 'LIBERADO_POR_INFRACCIONES').length
        const pagadasInstante = data.filter(x => x.estatusInfraccion === 'CERRADA' && x.estatusDependencia === 'LIBERADO_INFRACCIONES_INSTANTE').length
    return { capturarDatos, pendientesPago, pendientesDevolucion, liberadas, pagadasInstante }
  }, [data])

    const registrosFiltrados = useMemo(
        () => data.filter(x => {
            switch (filtro) {
                case 'PENDIENTE_DATOS_INFRACTOR':
                    return x.estatusInfraccion === 'REGISTRADA' && x.estatusDependencia === 'PENDIENTE_DATOS_INFRACTOR'
                case 'PENDIENTE_PAGO':
                    return x.estatusInfraccion === 'PENDIENTE_PAGO' && x.estatusDependencia === 'PENDIENTE_PAGO_INFRACCION'
                case 'PENDIENTE_DEVOLUCION_GARANTIA':
                    return x.estatusInfraccion === 'PAGADA' && x.estatusDependencia === 'PENDIENTE_DEVOLUCION_GARANTIA'
                case 'LIBERADA_POR_INFRACCION':
                    return x.estatusInfraccion === 'CERRADA' && x.estatusDependencia === 'LIBERADO_POR_INFRACCIONES'
                case 'LIBERADO_INFRACCIONES_INSTANTE':
                    return x.estatusInfraccion === 'CERRADA' && x.estatusDependencia === 'LIBERADO_INFRACCIONES_INSTANTE'
                default:
                    return false
            }
        }),
        [data, filtro],
    )

    const busquedaLower = busqueda.toLowerCase().trim()
    const registrosVisibles = busqueda
        ? registrosFiltrados.filter(row => {
            const folio = String(row.folio ?? '').toLowerCase()
            return folio.includes(busquedaLower)
        })
        : registrosFiltrados

    const registrosFiltradosFecha = useMemo(() => {
        if (!fechaInicio && !fechaFin) return registrosVisibles
        return registrosVisibles.filter(row => {
            const fecha = new Date(row.created_at)
            if (fechaInicio && fecha < new Date(fechaInicio)) return false
            if (fechaFin) {
                const endDate = new Date(fechaFin)
                endDate.setHours(23, 59, 59, 999)
                if (fecha > endDate) return false
            }
            return true
        })
    }, [registrosVisibles, fechaInicio, fechaFin])

    const registrosOrdenados = useMemo(() => {
        if (!sortField) return registrosFiltradosFecha
        return [...registrosFiltradosFecha].sort((a, b) => {
            const aVal = a[sortField] ?? ''
            const bVal = b[sortField] ?? ''
            const cmp = String(aVal).localeCompare(String(bVal), 'es', { numeric: true })
            return sortDirection === 'asc' ? cmp : -cmp
        })
    }, [registrosFiltradosFecha, sortField, sortDirection])

    const totalPaginas = Math.max(1, Math.ceil(registrosOrdenados.length / limite))
    const paginaSegura = Math.min(pagina, totalPaginas)
    const registrosPaginados = registrosOrdenados.slice((paginaSegura - 1) * limite, paginaSegura * limite)

    const STATS_KEY: Record<EstatusInfracciones, keyof typeof estadisticas> = {
        PENDIENTE_DATOS_INFRACTOR: 'capturarDatos',
        PENDIENTE_PAGO: 'pendientesPago',
        PENDIENTE_DEVOLUCION_GARANTIA: 'pendientesDevolucion',
        LIBERADA_POR_INFRACCION: 'liberadas',
        LIBERADO_INFRACCIONES_INSTANTE: 'pagadasInstante',
    }

    function handleSort(key: string) {
        if (sortField === key) {
            setSortDirection(d => d === 'asc' ? 'desc' : 'asc')
        } else {
            setSortField(key)
            setSortDirection('asc')
        }
        setPagina(1)
    }

    function exportarCSV() {
        const headers = visibleColumns.filter(c => c.key !== 'acciones').map(c => c.label)
        const rows = registrosOrdenados.map(row => {
            return visibleColumns.filter(c => c.key !== 'acciones').map(c => {
                if (c.key === 'estatus') {
                    return getBadge(row.estatusDependencia ?? row.estatusInfraccion).label
                }
                return row[c.key] ?? ''
            })
        })
        const bom = '\uFEFF'
        const csv = [headers.join(','), ...rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(','))].join('\n')
        const blob = new Blob([bom + csv], { type: 'text/csv;charset=utf-8;' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `infracciones-${filtro}-${new Date().toISOString().split('T')[0]}.csv`
        a.click()
        URL.revokeObjectURL(url)
    }

    return (
        <>
            {loading ? (
                <div className="rounded-xl border border-slate-200 bg-white shadow-card overflow-hidden animate-pulse">
                    <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50">
                        <div className="h-5 w-48 rounded bg-slate-200" />
                    </div>
                    <div className="divide-y divide-slate-100">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="flex items-center gap-4 px-5 py-3.5">
                                <div className="h-3.5 w-16 rounded bg-slate-200" />
                                <div className="h-3.5 w-32 rounded bg-slate-200" />
                                <div className="h-3.5 w-28 rounded bg-slate-200" />
                                <div className="h-5 w-14 rounded-full bg-slate-200" />
                                <div className="h-7 w-20 rounded-md bg-slate-200 ml-auto" />
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="rounded-xl border overflow-hidden bg-white border-slate-200 shadow-card">
                    {/* ─── Segmented control + CSV ─── */}
                    <div className="px-5 py-3 border-b flex items-center justify-between border-slate-100 bg-slate-50">
                        <div className="flex items-center gap-1.5 p-0.5 rounded-lg bg-slate-200/60">
                            {STATUS_TABS.map(tab => {
                                const count = estadisticas[STATS_KEY[tab.key]]
                                const activo = filtro === tab.key
                                return (
                                    <button
                                        key={tab.key}
                                        onClick={() => handleFiltroChange(tab.key)}
                                        className={`relative flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-200 ${activo
                                                ? 'bg-white text-slate-900 shadow-sm'
                                                : 'text-slate-500 hover:text-slate-700'
                                            }`}
                                        style={{ fontFamily: "'JetBrains Mono',monospace" }}
                                    >
                                        <span
                                            className={`w-1.5 h-1.5 rounded-full ${activo ? '' : 'opacity-40'}`}
                                            style={{ background: tab.color }}
                                        />
                                        {tab.label}
                                        <span className={`tabular-nums ${activo ? 'text-slate-900' : 'text-slate-400'}`}>
                                            {count}
                                        </span>
                                    </button>
                                )
                            })}
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={exportarCSV}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium text-cyan-700 bg-cyan-50 border border-cyan-200 hover:bg-cyan-100 transition-colors"
                            >
                                <Download size={12} strokeWidth={1.5} />
                                CSV
                            </button>
                            <span className="text-xs font-medium text-slate-400">
                                {registrosOrdenados.length} registro{registrosOrdenados.length !== 1 ? 's' : ''}
                            </span>
                        </div>
                    </div>

                    {/* ─── Search + Date filter ─── */}
                    <div className="px-5 py-2.5 border-b flex items-center gap-3 border-slate-100 bg-white flex-wrap">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                            <Search size={13} strokeWidth={1.8} className="text-slate-400 shrink-0" />
                            <input
                                type="text"
                                value={busqueda}
                                onChange={e => { setBusqueda(e.target.value); setPagina(1) }}
                                placeholder="Buscar por folio..."
                                className="w-full border-none bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                            />
                            {busqueda && (
                                <button
                                    onClick={() => { setBusqueda(''); setPagina(1) }}
                                    className="text-[10px] font-medium uppercase tracking-wider text-cyan-700 hover:text-cyan-800 transition-colors shrink-0"
                                >
                                    Limpiar
                                </button>
                            )}
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                            <Calendar size={13} strokeWidth={1.5} className="text-slate-400" />
                            <input
                                type="date"
                                value={fechaInicio}
                                onChange={e => { setFechaInicio(e.target.value); setPagina(1) }}
                                className="w-[130px] rounded-md border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-900 outline-none focus:border-cyan-700 focus:ring-2 focus:ring-cyan-700/10"
                            />
                            <span className="text-xs text-slate-300">—</span>
                            <input
                                type="date"
                                value={fechaFin}
                                onChange={e => { setFechaFin(e.target.value); setPagina(1) }}
                                className="w-[130px] rounded-md border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-900 outline-none focus:border-cyan-700 focus:ring-2 focus:ring-cyan-700/10"
                            />
                            {(fechaInicio || fechaFin) && (
                                <button
                                    onClick={() => { setFechaInicio(''); setFechaFin(''); setPagina(1) }}
                                    className="text-[10px] font-medium uppercase tracking-wider text-cyan-700 hover:text-cyan-800 transition-colors shrink-0"
                                >
                                    Limpiar
                                </button>
                            )}
                        </div>
                    </div>

                    {/* ─── Table ─── */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr>
                                    {visibleColumns.map(column => (
                                        <th
                                            key={column.key}
                                            className={`px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-widest ${SORTABLE_KEYS.has(column.key) ? 'cursor-pointer select-none hover:text-slate-700' : ''} text-slate-500 bg-slate-50 border-b border-slate-100`}
                                            style={{ fontFamily: "'JetBrains Mono',monospace" }}
                                            onClick={SORTABLE_KEYS.has(column.key) ? () => handleSort(column.key) : undefined}
                                        >
                                            <span className="inline-flex items-center gap-1">
                                                {column.label}
                                                {SORTABLE_KEYS.has(column.key) && (
                                                    sortField === column.key ? (
                                                        sortDirection === 'asc' ? <ArrowUp size={11} strokeWidth={2} /> : <ArrowDown size={11} strokeWidth={2} />
                                                    ) : (
                                                        <ArrowUpDown size={11} strokeWidth={1.5} className="text-slate-300" />
                                                    )
                                                )}
                                            </span>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {registrosOrdenados.length === 0 ? (
                                    <tr>
                                        <td colSpan={visibleColumns.length} className="py-12 text-center">
                                            <div className="flex flex-col items-center gap-2">
                                                <AlertCircle size={22} strokeWidth={1.5} className="text-slate-300" />
                                                <p className="text-sm font-medium text-slate-400">No hay registros</p>
                                                <p className="text-xs text-slate-300">No existen solicitudes con este estatus.</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    registrosPaginados.map((row) => (
                                        <tr
                                            key={row.id}
                                            className="transition-colors hover:bg-slate-50 border-b border-slate-100"
                                        >
                                            {visibleColumns.map(column => {
                                                if (column.key === 'acciones') {
                                                    return (
                                                        <td key={column.key} className="px-4 py-2.5">
                                                            <div className="flex items-center gap-2">
                                                                <BotonVerDetalle
                                                                    idInfraccion={row.id}
                                                                    basePath="/agente_infracciones/revision-documental"
                                                                />
                                                                {row.estatusDependencia === 'PENDIENTE_DATOS_INFRACTOR' && (
                                                                    <button
                                                                        onClick={() => setCapturarDatosId(row.id)}
                                                                        className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-white transition-colors duration-150 active:scale-[0.99]"
                                                                        style={{ background: '#0891b2' }}
                                                                        onMouseEnter={e => { e.currentTarget.style.background = '#0e7490' }}
                                                                        onMouseLeave={e => { e.currentTarget.style.background = '#0891b2' }}
                                                                    >
                                                                        <User size={11} strokeWidth={2.5} />
                                                                        Capturar datos
                                                                    </button>
                                                                )}
                                                                {row.estatusDependencia === 'PENDIENTE_DEVOLUCION_GARANTIA' && (
                                                                    <button
                                                                        onClick={() => setGarantiaId(row.id)}
                                                                        className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-white transition-colors duration-150 active:scale-[0.99]"
                                                                        style={{ background: '#22c55e' }}
                                                                        onMouseEnter={e => { e.currentTarget.style.background = '#16a34a' }}
                                                                        onMouseLeave={e => { e.currentTarget.style.background = '#22c55e' }}
                                                                    >
                                                                        <Shield size={11} strokeWidth={2.5} />
                                                                        Devolver garantía
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </td>
                                                    )
                                                }

                                                if (column.key === 'estatus') {
                                                    const badge = getBadge(row.estatusDependencia ?? row.estatusInfraccion)
                                                    return (
                                                        <td key={column.key} className="px-4 py-2.5">
                                                            <span
                                                                className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold"
                                                                style={{ background: badge.bg, color: badge.text, fontFamily: "'JetBrains Mono',monospace" }}
                                                            >
                                                                <span className="w-1.5 h-1.5 rounded-full" style={{ background: badge.dot }} />
                                                                {badge.label}
                                                            </span>
                                                        </td>
                                                    )
                                                }

                                                if (column.key === 'nombre_infractor') {
                                                    const name = row['nombre_infractor'] ?? ''
                                                    const initials = getInitials(name)
                                                    const color = hashColor(name, AVATAR_COLORS)
                                                    return (
                                                        <td key={column.key} className="px-4 py-2.5">
                                                            <div className="flex items-center gap-3">
                                                                <div
                                                                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium shrink-0"
                                                                    style={{ background: color.bg, color: color.text }}
                                                                >
                                                                    {initials || <User size={13} strokeWidth={2.5} />}
                                                                </div>
                                                                <span className="font-medium text-sm text-slate-900">
                                                                    {name || '—'}
                                                                </span>
                                                            </div>
                                                        </td>
                                                    )
                                                }

                                                return (
                                                    <td key={column.key} className="px-4 py-2.5 font-medium text-slate-900">
                                                        {row[column.key] ?? '—'}
                                                    </td>
                                                )
                                            })}
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* ─── Pagination ─── */}
                    {totalPaginas > 1 && (
                        <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100 bg-white">
                            <span className="text-xs text-slate-400">
                                {registrosOrdenados.length} registros — Página {paginaSegura} de {totalPaginas}
                            </span>
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => setPagina(p => Math.max(1, p - 1))}
                                    disabled={paginaSegura <= 1}
                                    className="inline-flex items-center justify-center w-8 h-8 text-xs font-medium rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                >
                                    ‹
                                </button>
                                {(() => {
                                    const pages: (number | '...')[] = []
                                    const delta = 1
                                    const start = Math.max(2, paginaSegura - delta)
                                    const end = Math.min(totalPaginas - 1, paginaSegura + delta)
                                    pages.push(1)
                                    if (start > 2) pages.push('...')
                                    for (let i = start; i <= end; i++) pages.push(i)
                                    if (end < totalPaginas - 1) pages.push('...')
                                    if (totalPaginas > 1) pages.push(totalPaginas)
                                    return pages.map((p, i) =>
                                        p === '...' ? (
                                            <span key={`e${i}`} className="w-7 h-7 flex items-center justify-center text-xs text-slate-300">···</span>
                                        ) : (
                                            <button
                                                key={p}
                                                onClick={() => setPagina(p)}
                                                className={`w-7 h-7 text-xs font-medium rounded-md transition-colors ${p === paginaSegura ? 'bg-cyan-700 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
                                            >
                                                {p}
                                            </button>
                                        )
                                    )
                                })()}
                                <button
                                    onClick={() => setPagina(p => Math.min(totalPaginas, p + 1))}
                                    disabled={paginaSegura >= totalPaginas}
                                    className="inline-flex items-center justify-center w-8 h-8 text-xs font-medium rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                >
                                    ›
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* ─── Capturar Datos Infractor Modal ─── */}
            {capturarDatosId && (
                <CapturarDatosInfractorModal
                    infraccionId={capturarDatosId}
                    onSuccess={() => { setCapturarDatosId(null); router.refresh() }}
                    onClose={() => setCapturarDatosId(null)}
                />
            )}

            {/* ─── Entregar Garantía Modal ─── */}
            {garantiaId && (
                <ModalEntregarGarantia
                    infraccionId={garantiaId}
                    onSuccess={() => { setGarantiaId(null); router.refresh() }}
                    onClose={() => setGarantiaId(null)}
                />
            )}
        </>
    )
}
