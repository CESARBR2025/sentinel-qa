'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Calendar, CheckCircle2, CircleDot, Download } from 'lucide-react'
import { pageWrap, fontsImport } from '@/components/reportes/form-styles'
import { SubHeader } from '@/components/partials/SubHeader'

type Periodo = 'diario' | 'semanal' | 'mensual'

interface Evento {
  id: string
  hora: string
  region: string
  evento: string
  ubicacion: string | null
  descripcion: string | null
  atenciones: string | null
}

interface PeriodoMetricas {
  id: string
  periodo: Periodo
  carpetas_iniciadas: number
  numero_cateos: number
  vehiculos_asegurados: number
  domicilios_cateados: number
  personas_aseguradas: number
  aprehensiones: number
  audiencias_iniciales: number
  abreviados: number
  audiencias_intermedias: number
}

type Fge = PeriodoMetricas
type Fgr = PeriodoMetricas

interface Rnd {
  id: string
  hora_detencion: string
  delito: string
  autoridad_que_realizo_detencion: string
  folio: string
}

interface Medios {
  id: string
  periodo: Periodo
  asuntos_canalizados_por_fiscalia: number
  acuerdos: number
  monto_reparacion_danos: number
}

interface Victimas {
  id: string
  periodo: Periodo
  numero_atenciones: number
  atenciones_medicas: number
  atenciones_psicologicas: number
  asesorias_juridicas: number
  observaciones: string | null
}

interface Arma {
  id: string
  carpeta_investigacion: string | null
  tipo_arma: string
  matricula: string | null
  calibre: string | null
  observaciones: string | null
}

interface Consolidado {
  fecha: string
  eventos: Evento[]
  fge: Fge[]
  fgr: Fgr[]
  rnd: Rnd[]
  medios: Medios[]
  victimas: Victimas[]
  armas: Arma[]
}

const cardStyle: React.CSSProperties = {
  background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 2, padding: 20, marginBottom: 16,
}

const tagCapturado: React.CSSProperties = {
  fontFamily: 'JetBrains Mono', fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em',
  color: '#047857', background: '#d1fae5', padding: '4px 8px', borderRadius: 2, display: 'inline-flex', alignItems: 'center', gap: 4,
}

const tagSinCapturar: React.CSSProperties = {
  fontFamily: 'JetBrains Mono', fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em',
  color: '#b45309', background: '#fef3c7', padding: '4px 8px', borderRadius: 2, display: 'inline-flex', alignItems: 'center', gap: 4,
}

export default function ConsolidarFormatoNPage() {
  const [fechaInicio, setFechaInicio] = useState('')
  const [fechaFin, setFechaFin] = useState('')
  const [data, setData] = useState<Consolidado[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const cargar = async () => {
    if (!fechaInicio || !fechaFin) { setError('Selecciona el rango de fechas'); return }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/reportes/formato-n-consolidado', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ fecha_inicio: fechaInicio, fecha_fin: fechaFin }),
      })
      if (!res.ok) { const e = await res.json(); throw new Error(e.error) }
      setData(await res.json())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error')
    } finally { setLoading(false) }
  }

  return (
    <div style={pageWrap}>
      <style>{fontsImport}</style>
      <SubHeader backHref="/envio-de-formatos" backLabel="Envío de Formatos" title="Envío de Formato N" />

      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 48px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 32 }}>
          <div>
            <span style={{ fontFamily: 'JetBrains Mono', fontSize: 10, letterSpacing: '0.3em', color: '#2563eb', textTransform: 'uppercase', fontWeight: 700 }}>Formato N a Coordinación</span>
            <h1 style={{ fontFamily: 'Barlow Condensed', fontSize: 36, fontWeight: 800, color: '#0f172a', margin: '4px 0 0 0', textTransform: 'uppercase' }}>Consolidado</h1>
            <div style={{ width: 64, height: 3, background: '#2563eb', marginTop: 12 }} />
          </div>
          <Link href="/envio-de-formatos" style={{ fontFamily: 'JetBrains Mono', fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.15em', background: '#0f172a', color: '#ffffff', padding: '12px 24px', textDecoration: 'none', borderRadius: 2, display: 'flex', alignItems: 'center', gap: 8 }}>
            <ArrowLeft size={14} /> VOLVER
          </Link>
        </div>

        <div style={{ ...cardStyle, display: 'flex', gap: 16, alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 160 }}>
            <label style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600, display: 'block', marginBottom: 4 }}>Desde</label>
            <input type="date" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} style={{ width: '100%', padding: '10px 12px', border: '1px solid #e2e8f0', borderRadius: 2, fontFamily: 'Inter', fontSize: 14, color: '#1e293b', outline: 'none' }} />
          </div>
          <div style={{ flex: 1, minWidth: 160 }}>
            <label style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600, display: 'block', marginBottom: 4 }}>Hasta</label>
            <input type="date" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} style={{ width: '100%', padding: '10px 12px', border: '1px solid #e2e8f0', borderRadius: 2, fontFamily: 'Inter', fontSize: 14, color: '#1e293b', outline: 'none' }} />
          </div>
          <button onClick={cargar} disabled={loading} style={{ fontFamily: 'JetBrains Mono', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', background: loading ? '#94a3b8' : '#0f172a', color: '#fff', border: 'none', borderRadius: 2, padding: '12px 28px', cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Calendar size={14} /> {loading ? 'CARGANDO...' : 'CARGAR DATOS'}
          </button>
        </div>

        {error && <div style={{ ...cardStyle, borderColor: '#fca5a5', background: '#fef2f2', color: '#dc2626', fontFamily: 'JetBrains Mono', fontSize: 12 }}>{error}</div>}

        {data && (
          <>
            {data.map((dia) => (
              <div key={dia.fecha} style={{ marginBottom: 40 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                  <div style={{ width: 4, height: 24, background: '#0f172a' }} />
                  <h2 style={{ fontFamily: 'Barlow Condensed', fontSize: 26, fontWeight: 800, color: '#0f172a', margin: 0, textTransform: 'uppercase' }}>{dia.fecha}</h2>
                </div>
                <DiaConsolidado dia={dia} />
              </div>
            ))}

            <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
              <button onClick={() => window.print()} style={{ fontFamily: 'JetBrains Mono', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 2, padding: '14px 28px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Download size={14} /> IMPRIMIR / GUARDAR PDF
              </button>
              <Link href="/envio-de-formatos" style={{ ...linkBtn, padding: '14px 28px', display: 'inline-flex', alignItems: 'center' }}>IR A SECCIONES INDIVIDUALES</Link>
            </div>
          </>
        )}
      </main>
    </div>
  )
}

function DiaConsolidado({ dia }: { dia: Consolidado }) {
  return (
    <>
      {/* 1. Eventos Informados */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h3 style={{ fontFamily: 'Barlow Condensed', fontSize: 22, fontWeight: 800, margin: 0, color: '#0f172a' }}>1. Eventos Informados</h3>
          {dia.eventos.length > 0
            ? <span style={tagCapturado}><CheckCircle2 size={11} /> CAPTURADO</span>
            : <span style={tagSinCapturar}><CircleDot size={11} /> SIN CAPTURAR</span>}
        </div>
        <p style={{ fontFamily: 'Inter', fontSize: 12, color: '#64748b', margin: '0 0 12px 0' }}>Registros guardados en Formato N para esta fecha.</p>
        {dia.eventos.length === 0 ? (
          <>
            <p style={{ fontFamily: 'Inter', fontSize: 13, color: '#94a3b8', fontStyle: 'italic' }}>Sin registro capturado para esta fecha.</p>
            <Link href="/formato-n-eventos/nuevo" style={{ ...linkBtn, marginTop: 12, display: 'inline-flex' }}>CAPTURAR AHORA</Link>
          </>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '1px solid #e2e8f0' }}>
                <th style={thStyle}>Hora</th><th style={thStyle}>Región</th><th style={thStyle}>Evento</th><th style={thStyle}>Ubicación</th><th style={thStyle}>Descripción</th><th style={thStyle}>Atenciones</th>
              </tr>
            </thead>
            <tbody>
              {dia.eventos.map((e) => (
                <tr key={e.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={tdStyle}>{e.hora}</td>
                  <td style={tdStyle}>{e.region}</td>
                  <td style={tdStyle}>{e.evento}</td>
                  <td style={tdStyle}>{e.ubicacion || '—'}</td>
                  <td style={tdStyle}>{e.descripcion || '—'}</td>
                  <td style={tdStyle}>{e.atenciones || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* 2. FGE */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h3 style={{ fontFamily: 'Barlow Condensed', fontSize: 22, fontWeight: 800, margin: 0, color: '#0f172a' }}>2. Eventos FGE</h3>
          {dia.fge.length > 0
            ? <span style={tagCapturado}><CheckCircle2 size={11} /> CAPTURADO</span>
            : <span style={tagSinCapturar}><CircleDot size={11} /> SIN CAPTURAR</span>}
        </div>
        <p style={{ fontFamily: 'Inter', fontSize: 12, color: '#64748b', margin: '0 0 12px 0' }}>Registros guardados en Formato N para esta fecha.</p>
        {dia.fge.length === 0 ? (
          <>
            <p style={{ fontFamily: 'Inter', fontSize: 13, color: '#94a3b8', fontStyle: 'italic' }}>Sin registro capturado para esta fecha.</p>
            <Link href="/formato-n-fge/nuevo" style={{ ...linkBtn, marginTop: 12, display: 'inline-flex' }}>CAPTURAR AHORA</Link>
          </>
        ) : (
          <PeriodoMetricasBlocks rows={dia.fge} />
        )}
      </div>

      {/* 3. FGR */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h3 style={{ fontFamily: 'Barlow Condensed', fontSize: 22, fontWeight: 800, margin: 0, color: '#0f172a' }}>3. Eventos FGR</h3>
          {dia.fgr.length > 0
            ? <span style={tagCapturado}><CheckCircle2 size={11} /> CAPTURADO</span>
            : <span style={tagSinCapturar}><CircleDot size={11} /> SIN CAPTURAR</span>}
        </div>
        <p style={{ fontFamily: 'Inter', fontSize: 12, color: '#64748b', margin: '0 0 12px 0' }}>Datos de la Fiscalía General de la República (dependencia externa) — captura 100% manual.</p>
        {dia.fgr.length === 0 ? (
          <>
            <p style={{ fontFamily: 'Inter', fontSize: 13, color: '#94a3b8', fontStyle: 'italic' }}>Sin registro capturado para esta fecha.</p>
            <Link href="/formato-n-fgr/nuevo" style={{ ...linkBtn, marginTop: 12, display: 'inline-flex' }}>CAPTURAR AHORA</Link>
          </>
        ) : (
          <PeriodoMetricasBlocks rows={dia.fgr} />
        )}
      </div>

      {/* 4. RND */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h3 style={{ fontFamily: 'Barlow Condensed', fontSize: 22, fontWeight: 800, margin: 0, color: '#0f172a' }}>4. Registro Nacional de Detenciones</h3>
          {dia.rnd.length > 0
            ? <span style={tagCapturado}><CheckCircle2 size={11} /> CAPTURADO</span>
            : <span style={tagSinCapturar}><CircleDot size={11} /> SIN CAPTURAR</span>}
        </div>
        <p style={{ fontFamily: 'Inter', fontSize: 12, color: '#64748b', margin: '0 0 12px 0' }}>Registros guardados en Formato N para esta fecha.</p>
        {dia.rnd.length === 0 ? (
          <>
            <p style={{ fontFamily: 'Inter', fontSize: 13, color: '#94a3b8', fontStyle: 'italic' }}>Sin registro capturado para esta fecha.</p>
            <Link href="/formato-n-rnd/nuevo" style={{ ...linkBtn, marginTop: 12, display: 'inline-flex' }}>CAPTURAR AHORA</Link>
          </>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '1px solid #e2e8f0' }}>
                <th style={thStyle}>Hora</th><th style={thStyle}>Delito</th><th style={thStyle}>Autoridad</th><th style={thStyle}>Folio</th>
              </tr>
            </thead>
            <tbody>
              {dia.rnd.map((r) => (
                <tr key={r.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={tdStyle}>{r.hora_detencion}</td>
                  <td style={tdStyle}>{r.delito}</td>
                  <td style={tdStyle}>{r.autoridad_que_realizo_detencion}</td>
                  <td style={tdStyle}>{r.folio}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* 5. Medios Alternativos */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h3 style={{ fontFamily: 'Barlow Condensed', fontSize: 22, fontWeight: 800, margin: 0, color: '#0f172a' }}>5. Medios Alternativos</h3>
          {dia.medios.length > 0
            ? <span style={tagCapturado}><CheckCircle2 size={11} /> CAPTURADO</span>
            : <span style={tagSinCapturar}><CircleDot size={11} /> SIN CAPTURAR</span>}
        </div>
        <p style={{ fontFamily: 'Inter', fontSize: 12, color: '#64748b', margin: '0 0 12px 0' }}>Asuntos canalizados por Fiscalía, acuerdos y montos — captura 100% manual.</p>
        {dia.medios.length === 0 ? (
          <>
            <p style={{ fontFamily: 'Inter', fontSize: 13, color: '#94a3b8', fontStyle: 'italic' }}>Sin registro capturado para esta fecha.</p>
            <Link href="/formato-n-medios-alternativos/nuevo" style={{ ...linkBtn, marginTop: 12, display: 'inline-flex' }}>CAPTURAR AHORA</Link>
          </>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '1px solid #e2e8f0' }}>
                <th style={thStyle}>Periodo</th><th style={thStyle}>Asuntos canalizados</th><th style={thStyle}>Acuerdos</th><th style={thStyle}>Monto reparación de daños</th>
              </tr>
            </thead>
            <tbody>
              {dia.medios.map((m) => (
                <tr key={m.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={tdStyle}>{m.periodo.toUpperCase()}</td>
                  <td style={tdStyle}>{m.asuntos_canalizados_por_fiscalia}</td>
                  <td style={tdStyle}>{m.acuerdos}</td>
                  <td style={tdStyle}>${Number(m.monto_reparacion_danos).toLocaleString('es-MX', { minimumFractionDigits: 2 })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* 6. Atención a Víctimas */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h3 style={{ fontFamily: 'Barlow Condensed', fontSize: 22, fontWeight: 800, margin: 0, color: '#0f172a' }}>6. Atención a Víctimas</h3>
          {dia.victimas.length > 0
            ? <span style={tagCapturado}><CheckCircle2 size={11} /> CAPTURADO</span>
            : <span style={tagSinCapturar}><CircleDot size={11} /> SIN CAPTURAR</span>}
        </div>
        <p style={{ fontFamily: 'Inter', fontSize: 12, color: '#64748b', margin: '0 0 12px 0' }}>Atenciones médicas, psicológicas y jurídicas — captura 100% manual.</p>
        {dia.victimas.length === 0 ? (
          <>
            <p style={{ fontFamily: 'Inter', fontSize: 13, color: '#94a3b8', fontStyle: 'italic' }}>Sin registro capturado para esta fecha.</p>
            <Link href="/formato-n-atencion-victimas/nuevo" style={{ ...linkBtn, marginTop: 12, display: 'inline-flex' }}>CAPTURAR AHORA</Link>
          </>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '1px solid #e2e8f0' }}>
                <th style={thStyle}>Periodo</th><th style={thStyle}>Nº atenciones</th><th style={thStyle}>Médicas</th><th style={thStyle}>Psicológicas</th><th style={thStyle}>Asesorías jurídicas</th><th style={thStyle}>Observaciones</th>
              </tr>
            </thead>
            <tbody>
              {dia.victimas.map((v) => (
                <tr key={v.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={tdStyle}>{v.periodo.toUpperCase()}</td>
                  <td style={tdStyle}>{v.numero_atenciones}</td>
                  <td style={tdStyle}>{v.atenciones_medicas}</td>
                  <td style={tdStyle}>{v.atenciones_psicologicas}</td>
                  <td style={tdStyle}>{v.asesorias_juridicas}</td>
                  <td style={tdStyle}>{v.observaciones || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* 7. Armas Aseguradas */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h3 style={{ fontFamily: 'Barlow Condensed', fontSize: 22, fontWeight: 800, margin: 0, color: '#0f172a' }}>7. Armas de Fuego Aseguradas</h3>
          {dia.armas.length > 0
            ? <span style={tagCapturado}><CheckCircle2 size={11} /> CAPTURADO</span>
            : <span style={tagSinCapturar}><CircleDot size={11} /> SIN CAPTURAR</span>}
        </div>
        <p style={{ fontFamily: 'Inter', fontSize: 12, color: '#64748b', margin: '0 0 12px 0' }}>Registros guardados en Formato N para esta fecha.</p>
        {dia.armas.length === 0 ? (
          <p style={{ fontFamily: 'Inter', fontSize: 13, color: '#94a3b8', fontStyle: 'italic' }}>Sin armas registradas para esta fecha.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '1px solid #e2e8f0' }}>
                <th style={thStyle}>Carpeta de investigación</th><th style={thStyle}>Tipo de arma</th><th style={thStyle}>Matrícula</th><th style={thStyle}>Calibre</th><th style={thStyle}>Observaciones</th>
              </tr>
            </thead>
            <tbody>
              {dia.armas.map((a) => (
                <tr key={a.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={tdStyle}>{a.carpeta_investigacion || '—'}</td>
                  <td style={tdStyle}>{a.tipo_arma}</td>
                  <td style={tdStyle}>{a.matricula || '—'}</td>
                  <td style={tdStyle}>{a.calibre || '—'}</td>
                  <td style={tdStyle}>{a.observaciones || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <Link href="/formato-n-armas-aseguradas/nuevo" style={{ ...linkBtn, marginTop: 12, display: 'inline-flex' }}>{dia.armas.length === 0 ? 'CAPTURAR AHORA' : 'AGREGAR OTRA'}</Link>
      </div>
    </>
  )
}

const thStyle: React.CSSProperties = { fontFamily: 'JetBrains Mono', fontSize: 9, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em', padding: '8px 10px', fontWeight: 600 }
const tdStyle: React.CSSProperties = { fontFamily: 'Inter', fontSize: 13, color: '#1e293b', padding: '8px 10px' }

const linkBtn: React.CSSProperties = {
  fontFamily: 'JetBrains Mono', fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em',
  background: '#f1f5f9', color: '#0f172a', padding: '10px 18px', textDecoration: 'none', borderRadius: 2, border: '1px solid #e2e8f0',
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 2, padding: 12 }}>
      <div style={{ fontFamily: 'Barlow Condensed', fontSize: 28, fontWeight: 800, color: '#0f172a' }}>{value}</div>
      <div style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
    </div>
  )
}

function PeriodoMetricasBlocks({ rows }: { rows: PeriodoMetricas[] }) {
  return (
    <>
      {rows.map((row, idx) => (
        <div key={row.id} style={{ marginBottom: idx < rows.length - 1 ? 20 : 0 }}>
          <div style={{ fontFamily: 'JetBrains Mono', fontSize: 10, fontWeight: 700, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>{row.periodo}</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12 }}>
            <Metric label="Carpetas iniciadas" value={row.carpetas_iniciadas} />
            <Metric label="Cateos" value={row.numero_cateos} />
            <Metric label="Vehículos asegurados" value={row.vehiculos_asegurados} />
            <Metric label="Domicilios cateados" value={row.domicilios_cateados} />
            <Metric label="Personas aseguradas" value={row.personas_aseguradas} />
            <Metric label="Aprehensiones" value={row.aprehensiones} />
            <Metric label="Audiencias iniciales" value={row.audiencias_iniciales} />
            <Metric label="Abreviados" value={row.abreviados} />
            <Metric label="Audiencias intermedias" value={row.audiencias_intermedias} />
          </div>
        </div>
      ))}
    </>
  )
}
