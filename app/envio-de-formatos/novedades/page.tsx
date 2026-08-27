'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Calendar, CheckCircle2, CircleDot, FileDown, Edit3, ChevronRight } from 'lucide-react'
import { pageWrap, inputStyle } from '@/components/reportes/form-styles'
import { DashboardHeader } from '@/components/partials/Header'
import { PageHeader } from '@/components/partials/PageHeader'

interface EstatusNovedades {
  fecha: string
  periodo_confirmado: boolean
  resumen_confirmado: boolean
  subsecretaria_confirmado: boolean
  analisis_confirmado: boolean
  c4_confirmado: boolean
  transito_confirmado: boolean
  prevencion_confirmado: boolean
  delictivos_confirmado: boolean
  operativos_confirmado: boolean
  resumen_nov_confirmado: boolean
  fuerza_confirmado: boolean
  completado_en: string | null
}

interface DiaResumen { fecha: string; estatus: EstatusNovedades | null }

const cardStyle: React.CSSProperties = {
  background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 'var(--radius-lg)',
  boxShadow: 'var(--shadow-card)', padding: '20px 22px', marginBottom: 16,
}

const tagBase: React.CSSProperties = {
  fontFamily: 'var(--apple-font-display)', fontSize: 12, fontWeight: 600, letterSpacing: 'normal', textTransform: 'none',
  padding: '5px 12px', borderRadius: 'var(--radius-full)', display: 'inline-flex', alignItems: 'center', gap: 6,
}

const tagListo: React.CSSProperties = { ...tagBase, color: '#16a34a', background: '#dcfce7' }
const tagPendiente: React.CSSProperties = { ...tagBase, color: '#b45309', background: '#fef3c7' }

const btnBase: React.CSSProperties = {
  fontFamily: 'var(--apple-font-display)', fontSize: 14, fontWeight: 600, letterSpacing: 'normal', textTransform: 'none',
  textDecoration: 'none', borderRadius: 'var(--radius-lg)', display: 'inline-flex', alignItems: 'center', gap: 8,
  cursor: 'pointer', border: 'none',
}

const linkBtn: React.CSSProperties = { ...btnBase, background: '#0f172a', color: '#fff', padding: '10px 20px' }
const linkBtnSecondary: React.CSSProperties = { ...btnBase, background: '#f1f5f9', color: '#475569', padding: '10px 18px', border: '1px solid #e2e8f0' }

const labelStyle: React.CSSProperties = {
  fontFamily: 'var(--apple-font-display)', fontSize: 12, fontWeight: 500, color: '#64748b',
  letterSpacing: 'normal', textTransform: 'none', display: 'block', marginBottom: 6,
}

const CAMPOS_ESTATUS = ['periodo_confirmado', 'resumen_confirmado', 'subsecretaria_confirmado', 'analisis_confirmado', 'c4_confirmado', 'transito_confirmado', 'prevencion_confirmado', 'delictivos_confirmado', 'operativos_confirmado', 'resumen_nov_confirmado', 'fuerza_confirmado'] as const

export default function ConsolidarNovedadesPage() {
  const router = useRouter()
  const hoy = new Date().toISOString().slice(0, 10)
  const [fechaInicio, setFechaInicio] = useState(hoy)
  const [fechaFin, setFechaFin] = useState(hoy)
  const [data, setData] = useState<DiaResumen[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const cargar = async (inicio: string, fin: string) => {
    try {
      const res = await fetch(`/api/novedades/estatus?desde=${inicio}&hasta=${fin}`)
      if (!res.ok) { const e = await res.json(); throw new Error(e.error) }
      const rows: EstatusNovedades[] = await res.json()
      const fechas: DiaResumen[] = []
      let cursor = new Date(inicio + 'T00:00:00')
      const hasta = new Date(fin + 'T00:00:00')
      while (cursor <= hasta) {
        const f = cursor.toISOString().slice(0, 10)
        const estatus = rows.find(r => r.fecha === f) ?? null
        fechas.push({ fecha: f, estatus })
        cursor = new Date(cursor.getTime() + 86400000)
      }
      setData(fechas)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error')
    } finally { setLoading(false) }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    cargar(hoy, hoy)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const confirmadas = (e: EstatusNovedades | null) => e ? CAMPOS_ESTATUS.filter(c => e[c]).length : 0
  const esListo = (e: EstatusNovedades | null) => confirmadas(e) === 11

  return (
    <div style={{ ...pageWrap, display: 'flex', flexDirection: 'column' }}>
      <style>{`
        .enf-btn:active { transform: scale(0.97); box-shadow: var(--apple-shadow-glass); transition: transform .12s ease-out, box-shadow .12s ease-out; }
        .enf-btn:hover { transform: translateY(-2px); box-shadow: var(--apple-shadow-glass-hover); }
        @media (prefers-reduced-motion: reduce) {
          .enf-btn, .enf-btn:hover, .enf-btn:active { transform: none; transition: box-shadow .15s ease, border-color .15s ease; }
        }
      `}</style>
      <DashboardHeader roleLabel="Consolidado Novedades" backHref="/envio-de-formatos" backLabel="Envío de Formatos" onBack={() => router.push('/envio-de-formatos')} />

      <main className="pad-pagina" style={{ width: '100%', flex: 1, display: 'flex', flexDirection: 'column', gap: 24 }}>
        <PageHeader title="Consolidado" accent="Novedades" subtitle="Parte de Novedades del C-4 · ventana 06:00 a 06:00" />

        <div style={{ ...cardStyle, display: 'flex', gap: 16, alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 160 }}>
            <label style={labelStyle}>Desde</label>
            <input type="date" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} style={inputStyle} />
          </div>
          <div style={{ flex: 1, minWidth: 160 }}>
            <label style={labelStyle}>Hasta</label>
            <input type="date" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} style={inputStyle} />
          </div>
          <button onClick={() => { setError(''); setLoading(true); cargar(fechaInicio, fechaFin); }} disabled={loading} className="enf-btn" style={{ ...linkBtn, background: loading ? '#94a3b8' : '#0f172a', cursor: loading ? 'not-allowed' : 'pointer' }}>
            <Calendar size={14} /> {loading ? 'Cargando...' : 'Cargar datos'}
          </button>
        </div>

        {error && <div style={{ ...cardStyle, borderColor: '#fca5a5', background: '#fef2f2', color: '#dc2626', fontFamily: 'var(--apple-font-display)', fontSize: 13 }}>{error}</div>}

        {data && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {data.map((dia) => {
              const listo = esListo(dia.estatus)
              const n = confirmadas(dia.estatus)
              return (
                <div key={dia.fecha} style={cardStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                    <div style={{ width: 4, height: 28, borderRadius: 'var(--radius-full)', background: listo ? '#16a34a' : '#94a3b8' }} />
                    <div style={{ flex: 1, minWidth: 140 }}>
                      <div style={{ fontFamily: 'var(--apple-font-display)', fontSize: 20, fontWeight: 600, color: '#0f172a', letterSpacing: 'normal', textTransform: 'none' }}>{dia.fecha}</div>
                      <div style={{ fontFamily: 'var(--apple-font-display)', fontSize: 13, color: '#64748b', marginTop: 2 }}>
                        {listo
                          ? (dia.estatus?.completado_en ? `Completado a las ${new Date(dia.estatus.completado_en).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}` : 'Completado')
                          : `Reporte del día · ${n}/11 secciones completas`}
                      </div>
                    </div>
                    <div>
                      {listo
                        ? <span style={tagListo}><CheckCircle2 size={12} /> Listo</span>
                        : <span style={tagPendiente}><CircleDot size={12} /> Pendiente</span>}
                    </div>
                    <div style={{ display: 'flex', gap: 10 }}>
                      {listo ? (
                        <>
                          <Link href={`/api/novedades/generar?fecha=${dia.fecha}`} className="enf-btn" style={linkBtn}>
                            <FileDown size={14} /> Descargar Word
                          </Link>
                          <Link href={`/envio-de-formatos/novedades/${dia.fecha}`} className="enf-btn" style={linkBtnSecondary}>
                            <Edit3 size={14} /> Editar
                          </Link>
                        </>
                      ) : (
                        <Link href={`/envio-de-formatos/novedades/${dia.fecha}`} className="enf-btn" style={linkBtn}>
                          Completar reporte <ChevronRight size={14} />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
