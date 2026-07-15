'use client'
import { Search, Download } from 'lucide-react'
import { styles } from '../deteccion_camara/styles'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function ReportFilters() {
    const router = useRouter()
    const [from, setFrom] = useState('')
    const [to, setTo] = useState('')
    const [semana, setSemana] = useState('')
    const [mes, setMes] = useState('')
    const [dia, setDia] = useState('')

    const handleGenerar = () => {
        const params = new URLSearchParams()
        if (from) params.set('from', from)
        if (to) params.set('to', to)
        router.push(`?${params}`)
    }

    const exportarEspecifico = (tipo: 'semana' | 'mes' | 'dia') => {
        const params = new URLSearchParams()
        if (tipo === 'semana' && semana) params.set('semana', semana)
        if (tipo === 'mes' && mes) params.set('mes', mes)
        if (tipo === 'dia' && dia) params.set('dia', dia)
        window.location.href = `/api/reportes-telefonicos/exportar?tipo=${tipo}&${params}`
    }

    return (
        <section style={styles.filterCard}>
            {/* Filtro de fechas */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '20px', alignItems: 'flex-end' }}>
                <div>
                    <label style={styles.label}>Fecha Inicial</label>
                    <input type="date" style={styles.input} value={from} onChange={e => setFrom(e.target.value)} />
                </div>
                <div>
                    <label style={styles.label}>Fecha Final</label>
                    <input type="date" style={styles.input} value={to} onChange={e => setTo(e.target.value)} />
                </div>
                <button style={{ ...styles.primaryButton, background: '#1f355a', padding: '12px 24px' }} onClick={handleGenerar}>
                    <Search size={18} /> GENERAR REPORTE
                </button>
            </div>

            {/* Exportación rápida */}
            <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <span style={{ fontFamily: 'JetBrains Mono', fontSize: '10px', fontWeight: 700, color: '#64748B', letterSpacing: '0.1em' }}>
                    EXPORTAR RÁPIDO:
                </span>
                <a href="/api/reportes-telefonicos/exportar?tipo=diario"
                    style={{ ...styles.primaryButton, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 16px', fontSize: '10px' }}>
                    <Download size={13} /> HOY
                </a>
                <a href="/api/reportes-telefonicos/exportar?tipo=semanal"
                    style={{ ...styles.primaryButton, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 16px', fontSize: '10px' }}>
                    <Download size={13} /> SEMANA ACTUAL
                </a>
                <a href="/api/reportes-telefonicos/exportar?tipo=mensual"
                    style={{ ...styles.primaryButton, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 16px', fontSize: '10px' }}>
                    <Download size={13} /> MES ACTUAL
                </a>
            </div>

            {/* Exportación por periodo específico */}
            <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #E2E8F0' }}>
                <span style={{ fontFamily: 'JetBrains Mono', fontSize: '10px', fontWeight: 700, color: '#64748B', letterSpacing: '0.1em', display: 'block', marginBottom: '12px' }}>
                    EXPORTAR PERIODO ESPECÍFICO:
                </span>


                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
                    {/* Día específico */}
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px' }}>
                        <div>
                            <label style={styles.label}>Día</label>
                            <input type="date" style={{ ...styles.input, width: '180px' }}
                                value={dia} onChange={e => setDia(e.target.value)} />
                        </div>
                        <button
                            onClick={() => exportarEspecifico('dia')}
                            disabled={!dia}
                            style={{ ...styles.primaryButton, padding: '10px 16px', fontSize: '10px', opacity: dia ? 1 : 0.4, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                            <Download size={13} /> EXPORTAR
                        </button>
                    </div>

                    <div style={{ width: '1px', height: '36px', background: '#E2E8F0', alignSelf: 'center' }} />

                    {/* Semana específica */}
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px' }}>
                        <div>
                            <label style={styles.label}>Semana</label>
                            <input type="week" style={{ ...styles.input, width: '200px' }}
                                value={semana} onChange={e => setSemana(e.target.value)} />
                        </div>
                        <button
                            onClick={() => exportarEspecifico('semana')}
                            disabled={!semana}
                            style={{ ...styles.primaryButton, padding: '10px 16px', fontSize: '10px', opacity: semana ? 1 : 0.4, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                            <Download size={13} /> EXPORTAR
                        </button>
                    </div>

                    <div style={{ width: '1px', height: '36px', background: '#E2E8F0', alignSelf: 'center' }} />

                    {/* Mes específico */}
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px' }}>
                        <div>
                            <label style={styles.label}>Mes</label>
                            <input type="month" style={{ ...styles.input, width: '180px' }}
                                value={mes} onChange={e => setMes(e.target.value)} />
                        </div>
                        <button
                            onClick={() => exportarEspecifico('mes')}
                            disabled={!mes}
                            style={{ ...styles.primaryButton, padding: '10px 16px', fontSize: '10px', opacity: mes ? 1 : 0.4, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                            <Download size={13} /> EXPORTAR
                        </button>
                    </div>
                </div>
            </div>
        </section>
    )
}