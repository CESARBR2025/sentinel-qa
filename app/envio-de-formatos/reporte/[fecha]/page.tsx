'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle2, ChevronLeft, ChevronRight, Download } from 'lucide-react'
import { inputStyle, btnPrimario, Label, sectionCard, sectionHeader, sectionTitleStyle, sectionBody, pageWrap } from '@/components/reportes/form-styles'
import { StepIndicator } from '@/components/partials/StepIndicator'
import { DashboardHeader } from '@/components/partials/Header'
import { PageHeader } from '@/components/partials/PageHeader'
import { useFormatoNStore, SECCIONES, FIELD_LABELS, type SeccionKey } from '@/lib/reportes/formato-n-store'

const infoBanner: React.CSSProperties = {
  padding: 12, background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 'var(--radius-lg)',
  fontFamily: 'var(--apple-font-display)', fontSize: 12, color: '#92400e',
}

const FGE_AUTOMATICOS = ['carpetas_iniciadas', 'numero_cateos', 'vehiculos_asegurados', 'domicilios_cateados', 'personas_aseguradas', 'aprehensiones'] as const
const FGE_MANUALES = ['audiencias_iniciales', 'abreviados', 'audiencias_intermedias'] as const

export default function ReporteFormatoNPage({ params }: { params: Promise<{ fecha: string }> }) {
  const router = useRouter()
  const fecha = useFormatoNStore(s => s.fecha)
  const consolidado = useFormatoNStore(s => s.consolidado)
  const paso = useFormatoNStore(s => s.paso)
  const loading = useFormatoNStore(s => s.loading)
  const guardando = useFormatoNStore(s => s.guardando)
  const error = useFormatoNStore(s => s.error)
  const msg = useFormatoNStore(s => s.msg)
  const cargar = useFormatoNStore(s => s.cargar)
  const setPaso = useFormatoNStore(s => s.setPaso)
  const setError = useFormatoNStore(s => s.setError)
  const confirmada = useFormatoNStore(s => s.confirmada)
  const avanzar = useFormatoNStore(s => s.avanzar)
  const guardarFiscalia = useFormatoNStore(s => s.guardarFiscalia)
  const guardarMetricas = useFormatoNStore(s => s.guardarMetricas)
  const guardarArmas = useFormatoNStore(s => s.guardarArmas)
  const guardarObservaciones = useFormatoNStore(s => s.guardarObservaciones)

  useEffect(() => {
    ;(async () => {
      const { fecha: f } = await params
      cargar(f)
    })()
  }, [params, cargar])

  if (loading) return <Cargando />
  if (error) return <Cargando msg={error} />

  const seccion = SECCIONES[paso]

  const guardarDe = (s: SeccionKey): (() => Promise<void>) | undefined => {
    switch (s) {
      case 'fge': return () => guardarFiscalia('fge')
      case 'fgr': return () => guardarFiscalia('fgr')
      case 'medios': return () => guardarMetricas('medios')
      case 'victimas': return () => guardarMetricas('victimas')
      case 'armas': return guardarArmas
      case 'observaciones': return guardarObservaciones
      default: return undefined
    }
  }

  const esUltimo = paso === SECCIONES.length - 1

  return (
    <div style={{ ...pageWrap, display: 'flex', flexDirection: 'column' }}>
      <DashboardHeader roleLabel={`Reporte ${fecha}`} backHref="/envio-de-formatos/consolidar" backLabel="Consolidado" />

      <main className="pad-pagina" style={{ width: '100%', flex: 1, display: 'flex', flexDirection: 'column', gap: 24 }}>
        <PageHeader
          title="Reporte"
          accent={fecha}
          subtitle={`Formato N a Coordinación`}
        />

        <StepIndicator paso={paso + 1} total={SECCIONES.length} nombre={seccion.titulo} />

        {msg && (
          <div style={{ padding: 12, background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 'var(--radius-lg)', fontFamily: 'var(--apple-font-display)', fontSize: 13, color: '#047857', display: 'flex', alignItems: 'center', gap: 8 }}>
            <CheckCircle2 size={16} /> {msg}
          </div>
        )}

        {error && (
          <div style={{ padding: 12, background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 'var(--radius-lg)', fontFamily: 'var(--apple-font-display)', fontSize: 12, color: '#dc2626' }}>
            {error}
          </div>
        )}

        <PasoView key={seccion.key} seccion={seccion.key} />

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
          <button
            type="button"
            disabled={paso === 0 || guardando}
            onClick={() => setPaso(paso - 1)}
            style={{ ...btnPrimario(paso === 0), background: paso === 0 ? '#94a3b8' : '#f1f5f9', color: paso === 0 ? '#fff' : '#0f172a', border: paso === 0 ? 'none' : '1px solid #e2e8f0' }}
          >
            <ChevronLeft size={14} /> Anterior
          </button>
          {!esUltimo ? (
            <button type="button" disabled={guardando} onClick={() => { setError(''); avanzar(seccion.key, guardarDe(seccion.key)) }} style={btnPrimario(guardando)}>
              {guardando ? 'Guardando...' : <>Siguiente <ChevronRight size={14} /></>}
            </button>
          ) : (
            <button type="button" disabled={guardando} onClick={() => { setError(''); avanzar('observaciones', guardarObservaciones) }} style={btnPrimario(guardando)}>
              {guardando ? 'Guardando...' : 'Finalizar reporte'}
            </button>
          )}
        </div>

        {esUltimo && confirmada('observaciones') && consolidado && (
          <div style={{ padding: 20, background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ fontFamily: 'var(--apple-font-display)', fontSize: 18, fontWeight: 600, color: '#047857', letterSpacing: 'normal', textTransform: 'none' }}>Reporte completo</div>
              <div style={{ fontFamily: 'var(--apple-font-display)', fontSize: 13, color: '#166534' }}>Las 8 secciones están confirmadas. Puedes descargar el documento oficial.</div>
            </div>
            <a href={`/api/nCoordinacion/generar?fecha=${fecha}`} style={{ ...btnPrimario(false), textDecoration: 'none' }}>
              <Download size={14} /> Descargar reporte
            </a>
            <button type="button" onClick={() => router.push('/envio-de-formatos/consolidar')} style={{ ...btnPrimario(false), background: '#f1f5f9', color: '#0f172a', border: '1px solid #e2e8f0' }}>
              Ir al consolidado
            </button>
          </div>
        )}
      </main>
    </div>
  )
}

function Cargando({ msg }: { msg?: string }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--apple-font-display)', fontSize: 13, color: '#64748b' }}>
      {msg ?? 'Cargando reporte...'}
    </div>
  )
}

function PasoView({ seccion }: { seccion: SeccionKey }) {
  switch (seccion) {
    case 'eventos': return <PasoEventos />
    case 'fge': return <PasoFiscalia tipo="fge" />
    case 'fgr': return <PasoFiscalia tipo="fgr" />
    case 'rnd': return <PasoRnd />
    case 'medios': return <PasoMetricas seccion="medios" />
    case 'victimas': return <PasoMetricas seccion="victimas" />
    case 'armas': return <PasoArmas />
    case 'observaciones': return <PasoObservaciones />
  }
}

function PasoEventos() {
  const consolidado = useFormatoNStore(s => s.consolidado)

  const eventos = consolidado?.eventos ?? []

  const thStyle: React.CSSProperties = {
    fontFamily: 'var(--apple-font-display)', fontSize: 12, fontWeight: 600, color: '#64748b',
    letterSpacing: 'normal', textTransform: 'none', textAlign: 'left', padding: '10px 14px', whiteSpace: 'nowrap',
  }
  const tdStyle: React.CSSProperties = {
    fontFamily: 'var(--apple-font-display)', fontSize: 13, color: '#334155', padding: '10px 14px',
    verticalAlign: 'top',
  }

  return (
    <div style={sectionCard}>
      <div style={sectionHeader}><div style={sectionTitleStyle}>Eventos Informados</div></div>
      <div style={sectionBody}>
        {eventos.length === 0 ? (
          <div style={{ padding: '28px 22px', textAlign: 'center', fontFamily: 'var(--apple-font-display)', fontSize: 13, color: '#94a3b8' }}>
            Sin eventos registrados para esta fecha.
          </div>
        ) : (
          <div className="tabla-wrap" style={{ border: '1px solid #e2e8f0', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-card)', overflowX: 'auto', overflowY: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 760 }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                  <th style={thStyle}>Hora</th>
                  <th style={thStyle}>Evento</th>
                  <th style={thStyle}>Región</th>
                  <th style={thStyle}>Ubicación</th>
                  <th style={thStyle}>Descripción</th>
                  <th style={thStyle}>Atenciones</th>
                </tr>
              </thead>
              <tbody>
                {eventos.map(e => (
                  <tr key={String(e.id)} style={{ borderBottom: '1px solid #eef2f7' }}>
                    <td style={{ ...tdStyle, whiteSpace: 'nowrap', fontWeight: 600, color: '#0f172a' }}>{String(e.hora).slice(0, 5)}</td>
                    <td style={{ ...tdStyle, fontWeight: 500, color: '#0f172a' }}>{String(e.evento ?? '—')}</td>
                    <td style={tdStyle}>{String(e.region ?? '—')}</td>
                    <td style={tdStyle}>{String(e.ubicacion ?? '—')}</td>
                    <td style={tdStyle}>{String(e.descripcion ?? '—')}</td>
                    <td style={tdStyle}>{String(e.atenciones ?? '—')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

function PasoFiscalia({ tipo }: { tipo: 'fge' | 'fgr' }) {
  const fgeVals = useFormatoNStore(s => s.fgeVals)
  const fgrVals = useFormatoNStore(s => s.fgrVals)
  const setFgeVals = useFormatoNStore(s => s.setFgeVals)
  const setFgrVals = useFormatoNStore(s => s.setFgrVals)

  const vals = tipo === 'fge' ? fgeVals : fgrVals
  const setVals = tipo === 'fge' ? setFgeVals : setFgrVals

  const thStyle: React.CSSProperties = {
    fontFamily: 'var(--apple-font-display)', fontSize: 12, fontWeight: 600, color: '#64748b',
    letterSpacing: 'normal', textTransform: 'none', textAlign: 'left', padding: '10px 14px', whiteSpace: 'nowrap',
  }
  const tdStyle: React.CSSProperties = {
    fontFamily: 'var(--apple-font-display)', fontSize: 13, color: '#334155', padding: '10px 14px',
    verticalAlign: 'top',
  }

  const automaticos = FGE_AUTOMATICOS.map(name => ({ name, label: FIELD_LABELS[tipo].find(c => c.name === name)?.label ?? name }))
  const manuales = FGE_MANUALES.map(name => ({ name, label: FIELD_LABELS[tipo].find(c => c.name === name)?.label ?? name }))

  return (
    <div style={sectionCard}>
      <div style={sectionHeader}><div style={sectionTitleStyle}>{tipo === 'fge' ? 'Fiscalía General del Estado (FGE)' : 'Fiscalía General de la República (FGR)'}</div></div>
      <div style={sectionBody}>
        <div style={{ fontFamily: 'var(--apple-font-display)', fontSize: 13, color: '#64748b' }}>
          {tipo === 'fge'
            ? 'Conteos calculados automáticamente de denuncias, cateos, vehículos y detenciones del día.'
            : 'Conteos calculados automáticamente de detenciones canalizadas a Fiscalía Federal del día.'}
        </div>
        <div className="tabla-wrap" style={{ border: '1px solid #e2e8f0', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-card)', overflowX: 'auto', overflowY: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 640 }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                {automaticos.map(a => (
                  <th key={a.name} style={thStyle}>{a.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid #eef2f7' }}>
                {automaticos.map(a => (
                  <td key={a.name} style={{ ...tdStyle, fontWeight: 600, color: '#0f172a' }}>{vals[a.name] ?? '0'}</td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
        <div>
          <div style={{ fontFamily: 'var(--apple-font-display)', fontSize: 14, fontWeight: 600, color: '#0f172a', marginBottom: 16 }}>Captura manual — no hay fuente de datos</div>
          <div className="grid-2">
            {manuales.map(c => (
              <div key={c.name}>
                <Label>{c.label}</Label>
                <input type="number" min={0} style={inputStyle} value={vals[c.name] ?? '0'} onChange={e => setVals({ ...vals, [c.name]: e.target.value })} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function PasoRnd() {
  const consolidado = useFormatoNStore(s => s.consolidado)

  const detenciones = consolidado?.rnd ?? []

  const thStyle: React.CSSProperties = {
    fontFamily: 'var(--apple-font-display)', fontSize: 12, fontWeight: 600, color: '#64748b',
    letterSpacing: 'normal', textTransform: 'none', textAlign: 'left', padding: '10px 14px', whiteSpace: 'nowrap',
  }
  const tdStyle: React.CSSProperties = {
    fontFamily: 'var(--apple-font-display)', fontSize: 13, color: '#334155', padding: '10px 14px',
    verticalAlign: 'top',
  }

  return (
    <div style={sectionCard}>
      <div style={sectionHeader}><div style={sectionTitleStyle}>Registro Nacional de Detenciones</div></div>
      <div style={sectionBody}>
        {detenciones.length === 0 ? (
          <div style={{ padding: '28px 22px', textAlign: 'center', fontFamily: 'var(--apple-font-display)', fontSize: 13, color: '#94a3b8' }}>
            Sin detenciones registradas para esta fecha.
          </div>
        ) : (
          <div className="tabla-wrap" style={{ border: '1px solid #e2e8f0', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-card)', overflowX: 'auto', overflowY: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 640 }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                  <th style={thStyle}>Hora de detención</th>
                  <th style={thStyle}>Delito</th>
                  <th style={thStyle}>Autoridad que realizó la detención</th>
                  <th style={thStyle}>Folio</th>
                </tr>
              </thead>
              <tbody>
                {detenciones.map(d => (
                  <tr key={String(d.id)} style={{ borderBottom: '1px solid #eef2f7' }}>
                    <td style={{ ...tdStyle, whiteSpace: 'nowrap', fontWeight: 600, color: '#0f172a' }}>{String(d.hora_detencion).slice(0, 5)}</td>
                    <td style={{ ...tdStyle, fontWeight: 500, color: '#0f172a' }}>{String(d.delito ?? '—')}</td>
                    <td style={tdStyle}>{String(d.autoridad_que_realizo_detencion ?? '—')}</td>
                    <td style={tdStyle}>{String(d.folio ?? '—')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

function PasoMetricas({ seccion }: { seccion: 'medios' | 'victimas' }) {
  const mediosVals = useFormatoNStore(s => s.mediosVals)
  const victimasVals = useFormatoNStore(s => s.victimasVals)
  const victimasObs = useFormatoNStore(s => s.victimasObs)
  const setMediosVals = useFormatoNStore(s => s.setMediosVals)
  const setVictimasVals = useFormatoNStore(s => s.setVictimasVals)
  const setVictimasObs = useFormatoNStore(s => s.setVictimasObs)

  const campos = FIELD_LABELS[seccion]
  const vals = seccion === 'medios' ? mediosVals : victimasVals
  const setVals = seccion === 'medios' ? setMediosVals : setVictimasVals

  return (
    <div style={sectionCard}>
      <div style={sectionHeader}><div style={sectionTitleStyle}>{seccion === 'medios' ? 'Medios Alternativos de Solución de Conflictos' : 'Atención a Víctimas'}</div></div>
      <div style={sectionBody}>
        <div style={infoBanner}>
          Sin fuente automática — captura 100% manual.
        </div>
        <div className="grid-2">
          {campos.map(c => (
            <div key={c.name}>
              <Label>{c.label}</Label>
              <input type="number" min={0} step={seccion === 'medios' && c.name === 'monto_reparacion_danos' ? '0.01' : undefined} style={inputStyle} value={vals[c.name] ?? '0'} onChange={e => setVals({ ...vals, [c.name]: e.target.value })} />
            </div>
          ))}
        </div>
        {seccion === 'victimas' && (
          <div><Label>Observaciones</Label><textarea style={{ ...inputStyle, minHeight: 60 }} value={victimasObs} onChange={e => setVictimasObs(e.target.value)} /></div>
        )}
      </div>
    </div>
  )
}

function PasoArmas() {
  const armasForm = useFormatoNStore(s => s.armasForm)
  const consolidado = useFormatoNStore(s => s.consolidado)
  const setArmasForm = useFormatoNStore(s => s.setArmasForm)

  const armas = consolidado?.armas ?? []
  const sincronizadas = armas.filter(a => a.origen_fiscalia_arma_id != null)
  const manuales = armas.filter(a => a.origen_fiscalia_arma_id == null)

  const thStyle: React.CSSProperties = {
    fontFamily: 'var(--apple-font-display)', fontSize: 12, fontWeight: 600, color: '#64748b',
    letterSpacing: 'normal', textTransform: 'none', textAlign: 'left', padding: '10px 14px', whiteSpace: 'nowrap',
  }
  const tdStyle: React.CSSProperties = {
    fontFamily: 'var(--apple-font-display)', fontSize: 13, color: '#334155', padding: '10px 14px',
    verticalAlign: 'top',
  }

  return (
    <div style={sectionCard}>
      <div style={sectionHeader}><div style={sectionTitleStyle}>Armas de Fuego Aseguradas</div></div>
      <div style={sectionBody}>
        <div style={infoBanner}>
          Las armas capturadas en Fiscalía (con foto de evidencia) se sincronizan automáticamente. Usa el formulario de abajo solo para casos que Fiscalía todavía no haya procesado.
        </div>

        {sincronizadas.length > 0 ? (
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontFamily: 'var(--apple-font-display)', fontSize: 14, fontWeight: 600, color: '#0f172a', marginBottom: 10 }}>Sincronizadas desde Fiscalía</div>
            <div className="tabla-wrap" style={{ border: '1px solid #e2e8f0', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-card)', overflowX: 'auto', overflowY: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 760 }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                    <th style={thStyle}>Tipo de Arma</th>
                    <th style={thStyle}>Marca</th>
                    <th style={thStyle}>Matrícula</th>
                    <th style={thStyle}>Calibre</th>
                    <th style={thStyle}>Carpeta de Investigación</th>
                    <th style={thStyle}>Observaciones</th>
                  </tr>
                </thead>
                <tbody>
                  {sincronizadas.map(a => (
                    <tr key={String(a.id)} style={{ borderBottom: '1px solid #eef2f7' }}>
                      <td style={{ ...tdStyle, fontWeight: 500, color: '#0f172a' }}>{String(a.tipo_arma ?? '—')}</td>
                      <td style={tdStyle}>{String(a.marca ?? '—')}</td>
                      <td style={tdStyle}>{String(a.matricula ?? '—')}</td>
                      <td style={tdStyle}>{String(a.calibre ?? '—')}</td>
                      <td style={tdStyle}>{String(a.carpeta_investigacion ?? '—')}</td>
                      <td style={tdStyle}>{String(a.observaciones ?? '—')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div style={{ padding: '28px 22px', textAlign: 'center', fontFamily: 'var(--apple-font-display)', fontSize: 13, color: '#94a3b8' }}>
            Sin armas sincronizadas desde Fiscalía para esta fecha.
          </div>
        )}

        <div style={{ fontFamily: 'var(--apple-font-display)', fontSize: 13, color: '#64748b' }}>
          Registradas: {armas.length} {manuales.length > 0 && `(${manuales.length} manuales)`}
        </div>
        <div className="grid-2">
          <div><Label>Carpeta de Investigación</Label><input style={inputStyle} value={armasForm.carpeta_investigacion} onChange={e => setArmasForm({ carpeta_investigacion: e.target.value })} /></div>
          <div><Label>Tipo de Arma</Label><input style={inputStyle} value={armasForm.tipo_arma} onChange={e => setArmasForm({ tipo_arma: e.target.value })} /></div>
          <div><Label>Matrícula</Label><input style={inputStyle} value={armasForm.matricula} onChange={e => setArmasForm({ matricula: e.target.value })} /></div>
          <div><Label>Calibre</Label><input style={inputStyle} value={armasForm.calibre} onChange={e => setArmasForm({ calibre: e.target.value })} /></div>
          <div style={{ gridColumn: '1 / -1' }}><Label>Observaciones</Label><textarea style={{ ...inputStyle, minHeight: 50 }} value={armasForm.observaciones} onChange={e => setArmasForm({ observaciones: e.target.value })} /></div>
        </div>
      </div>
    </div>
  )
}

function PasoObservaciones() {
  const observacionesTexto = useFormatoNStore(s => s.observacionesTexto)
  const setObservacionesTexto = useFormatoNStore(s => s.setObservacionesTexto)

  return (
    <div style={sectionCard}>
      <div style={sectionHeader}><div style={sectionTitleStyle}>Observaciones</div></div>
      <div style={sectionBody}>
        <div><Label>Observaciones del día</Label><textarea style={{ ...inputStyle, minHeight: 120 }} value={observacionesTexto} onChange={e => setObservacionesTexto(e.target.value)} placeholder="Sin Novedad" /></div>
      </div>
    </div>
  )
}
