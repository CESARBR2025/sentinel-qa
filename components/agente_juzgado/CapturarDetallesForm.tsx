'use client'

import { useState, useMemo, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Hash, FileText, Fingerprint, Calendar, Clock, BookOpen, User, Shield, BadgeCheck, UserCheck, ScrollText, Gavel, MapPin, Map, Plus, X, Camera } from 'lucide-react'
import { DireccionGoogleMaps } from '@/components/shared/DireccionGoogleMaps'
import { guardarDetallesAseguradoAction } from '@/lib/agente_juzgado/actions'
import type { DetalleAsegurado } from '@/lib/agente_juzgado/types'
import type { Direccion } from '@/components/shared/DireccionGoogleMaps'

const labelSx: React.CSSProperties = {
  display: 'block',
  fontFamily: 'JetBrains Mono,monospace',
  fontSize: 9,
  color: '#64748b',
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  marginBottom: 4,
}

const inputSx: React.CSSProperties = {
  width: '100%',
  padding: '8px 10px',
  border: '1px solid #e2e8f0',
  borderLeft: '3px solid #059669',
  fontFamily: 'Inter,sans-serif',
  fontSize: 12,
  color: '#334155',
  outline: 'none',
  boxSizing: 'border-box',
}

const disabledSx: React.CSSProperties = {
  width: '100%',
  padding: '8px 10px',
  border: '1px solid #f1f5f9',
  borderLeft: '3px solid #059669',
  fontFamily: 'Inter,sans-serif',
  fontSize: 12,
  color: '#64748b',
  background: '#f8fafc',
  boxSizing: 'border-box',
}

interface EvidenciaItem {
  colonia: string
  calle: string
  numero: string
  horaInicio: string
  horaFin: string
}

function emptyItem(): EvidenciaItem {
  return { colonia: '', calle: '', numero: '', horaInicio: '', horaFin: '' }
}

interface Props {
  solicitudId: string
  data: DetalleAsegurado
}

export function CapturarDetallesForm({ solicitudId, data }: Props) {
  const router = useRouter()
  const r = useMemo(() => Math.random().toString(36).slice(2, 6), [])
  const [folioSija, setFolioSija] = useState(`SIJA-${r}`)
  const [calle, setCalle] = useState(`Calle ${Math.random().toString(36).slice(2, 6)}`)
  const [numero, setNumero] = useState(`${Math.floor(Math.random() * 999)}`)
  const [colonia, setColonia] = useState('Centro')
  const [municipio, setMunicipio] = useState('San Juan del Río')
  const dir: Direccion = { calle, numero, colonia, municipio }
  const [folioRemision, setFolioRemision] = useState(`REM-${Math.random().toString(36).slice(2, 8).toUpperCase()}`)
  const [marcoLegal, setMarcoLegal] = useState('Arts. 25, 26 y 27 Fracc. II Ley de Justicia Cívica')
  const [registroTableta] = useState('true')
  const [guardando, setGuardando] = useState(false)
  const [errorGuardar, setErrorGuardar] = useState<string | null>(null)

  const [requiereEvidencias, setRequiereEvidencias] = useState(false)
  const [evidenciaItems, setEvidenciaItems] = useState<EvidenciaItem[]>([emptyItem()])

  const handleGuardar = async () => {
    setGuardando(true)
    setErrorGuardar(null)

    const evidencias = requiereEvidencias
      ? evidenciaItems.filter(it => it.colonia.trim() && it.calle.trim() && it.numero.trim() && it.horaInicio.trim() && it.horaFin.trim())
      : undefined

    const res = await guardarDetallesAseguradoAction(
      solicitudId,
      {
        folioSija,
        calle,
        numero,
        colonia,
        municipio,
        folioRemision,
        marcoLegal,
        registroTableta,
      },
      evidencias && evidencias.length > 0 ? evidencias : undefined,
    )

    setGuardando(false)
    if (res.error) {
      setErrorGuardar(res.error)
      return
    }
    router.push('/agente_juzgado/solicitudes')
  }

  const handleDireccionChange = (d: Direccion) => {
    setCalle(d.calle)
    setNumero(d.numero)
    setColonia(d.colonia)
    setMunicipio(d.municipio)
  }

  function updateEvItem(i: number, field: keyof EvidenciaItem, value: string) {
    setEvidenciaItems(prev => prev.map((it, idx) => idx === i ? { ...it, [field]: value } : it))
  }

  function addEvItem() {
    setEvidenciaItems(prev => [...prev, emptyItem()])
  }

  function removeEvItem(i: number) {
    setEvidenciaItems(prev => prev.filter((_, idx) => idx !== i))
  }

  const displayVal = (val: string | null | undefined): string => val ?? '—'

  return (
    <>
      <div style={{ marginBottom: 24 }}>
        <div style={{
          fontFamily: 'JetBrains Mono,monospace',
          fontSize: 9,
          letterSpacing: '0.3em',
          color: '#7c3aed',
          textTransform: 'uppercase',
          marginBottom: 4,
        }}>
          OL DE: Juzgado Cívico
        </div>
        <h3 style={{
          fontFamily: 'Barlow Condensed,sans-serif',
          fontSize: 24,
          fontWeight: 800,
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
          margin: '0 0 4px 0',
          color: '#0f172a',
        }}>
          Asegurados · <span style={{ color: '#7c3aed' }}>Juzgado Cívico</span>
        </h3>
        <p style={{
          fontFamily: 'Inter,sans-serif',
          fontSize: 12,
          color: '#64748b',
          margin: 0,
          lineHeight: 1.5,
        }}>
          Captura los datos del asegurado para la solicitud <strong>#{solicitudId}</strong>
        </p>
      </div>

      {/* SECCIÓN 1: Datos existentes (readonly) */}
      <div style={{
        padding: '16px 20px',
        border: '1px solid #e2e8f0',
        borderLeft: '3px solid #7c3aed',
        background: '#fafafa',
        marginBottom: 24,
      }}>
        <div style={{
          fontFamily: 'Barlow Condensed,sans-serif',
          fontSize: 15,
          fontWeight: 700,
          textTransform: 'uppercase',
          color: '#1e293b',
          marginBottom: 16,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}>
          <FileText size={16} color="#7c3aed" />
          Datos de la Solicitud
          <span style={{
            fontFamily: 'JetBrains Mono,monospace',
            fontSize: 8,
            color: '#94a3b8',
            letterSpacing: '0.1em',
            fontWeight: 400,
            marginLeft: 8,
          }}>
            (AUTO-CARGADOS)
          </span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          <div>
            <label style={labelSx}><Hash size={10} style={{ marginRight: 4 }} /> Folio del Incidente</label>
            <div style={disabledSx}>{displayVal(data.folioDenuncia)}</div>
          </div>
          <div>
            <label style={labelSx}><FileText size={10} style={{ marginRight: 4 }} /> Folio del Reporte</label>
            <div style={disabledSx}>{displayVal(data.folioReporteCampo)}</div>
          </div>
          <div>
            <label style={labelSx}><Fingerprint size={10} style={{ marginRight: 4 }} /> IPH</label>
            <div style={disabledSx}>{displayVal(data.iph)}</div>
          </div>
          <div>
            <label style={labelSx}><Calendar size={10} style={{ marginRight: 4 }} /> Fecha</label>
            <div style={disabledSx}>{displayVal(data.fechaReporte)}</div>
          </div>
          <div>
            <label style={labelSx}><Clock size={10} style={{ marginRight: 4 }} /> Hora</label>
            <div style={disabledSx}>{displayVal(data.horaReporte)}</div>
          </div>
          <div>
            <label style={labelSx}><User size={10} style={{ marginRight: 4 }} /> Nombre del Detenido</label>
            <div style={disabledSx}>{displayVal(data.nombreDetenido)}</div>
          </div>
          <div>
            <label style={labelSx}><Shield size={10} style={{ marginRight: 4 }} /> Placa Unidad Policial</label>
            <div style={disabledSx}>{displayVal(data.placaUnidad)}</div>
          </div>
          <div>
            <label style={labelSx}><BadgeCheck size={10} style={{ marginRight: 4 }} /> Nombre del Policía</label>
            <div style={disabledSx}>{displayVal(data.nombrePolicia)}</div>
          </div>
          <div>
            <label style={labelSx}><UserCheck size={10} style={{ marginRight: 4 }} /> Nómina del Policía</label>
            <div style={disabledSx}>{displayVal(data.nominaPolicia)}</div>
          </div>
          <div style={{ gridColumn: 'span 2' }}>
            <label style={labelSx}><MapPin size={10} style={{ marginRight: 4 }} /> Lugar de la Detención</label>
            <div style={disabledSx}>{displayVal(data.lugarDetencion)}</div>
          </div>
          <div>
            <label style={labelSx}><User size={10} style={{ marginRight: 4 }} /> Quien ingresó el registro</label>
            <div style={disabledSx}>{displayVal(data.capturadoPorNombre)}</div>
          </div>
        </div>
      </div>

      {/* SECCIÓN 2: Datos por capturar (required) */}
      <div style={{
        padding: '16px 20px',
        border: '1px solid #e2e8f0',
        borderLeft: '3px solid #dc2626',
        marginBottom: 24,
      }}>
        <div style={{
          fontFamily: 'Barlow Condensed,sans-serif',
          fontSize: 15,
          fontWeight: 700,
          textTransform: 'uppercase',
          color: '#1e293b',
          marginBottom: 16,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}>
          <BookOpen size={16} color="#dc2626" />
          Datos por Capturar
          <span style={{
            fontFamily: 'JetBrains Mono,monospace',
            fontSize: 8,
            color: '#dc2626',
            letterSpacing: '0.1em',
            fontWeight: 400,
            marginLeft: 8,
          }}>
            (REQUERIDOS)
          </span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          <div>
            <label style={labelSx}>
              <BookOpen size={10} style={{ marginRight: 4 }} /> Folio SIJA <span style={{ color: '#dc2626' }}>*</span>
            </label>
            <input value={folioSija} onChange={e => setFolioSija(e.target.value)} required placeholder="Capturar folio SIJA..." style={inputSx} onFocus={e => e.currentTarget.style.borderColor = '#7c3aed'} onBlur={e => e.currentTarget.style.borderColor = '#e2e8f0'} />
          </div>
          <div style={{ gridColumn: 'span 2' }}>
            <label style={labelSx}>
              <MapPin size={10} style={{ marginRight: 4 }} /> Domicilio del Detenido <span style={{ color: '#dc2626' }}>*</span>
            </label>
            <DireccionGoogleMaps value={dir} onChange={handleDireccionChange} />
          </div>
          <div>
            <label style={labelSx}>
              <Map size={10} style={{ marginRight: 4 }} /> Calle <span style={{ color: '#dc2626' }}>*</span>
            </label>
            <input value={calle} onChange={e => setCalle(e.target.value)} required placeholder="Calle..." style={inputSx} onFocus={e => e.currentTarget.style.borderColor = '#7c3aed'} onBlur={e => e.currentTarget.style.borderColor = '#e2e8f0'} />
          </div>
          <div>
            <label style={labelSx}>
              <Map size={10} style={{ marginRight: 4 }} /> Número <span style={{ color: '#dc2626' }}>*</span>
            </label>
            <input value={numero} onChange={e => setNumero(e.target.value)} required placeholder="Número..." style={inputSx} onFocus={e => e.currentTarget.style.borderColor = '#7c3aed'} onBlur={e => e.currentTarget.style.borderColor = '#e2e8f0'} />
          </div>
          <div>
            <label style={labelSx}>
              <Map size={10} style={{ marginRight: 4 }} /> Colonia <span style={{ color: '#dc2626' }}>*</span>
            </label>
            <input value={colonia} onChange={e => setColonia(e.target.value)} required placeholder="Colonia..." style={inputSx} onFocus={e => e.currentTarget.style.borderColor = '#7c3aed'} onBlur={e => e.currentTarget.style.borderColor = '#e2e8f0'} />
          </div>
          <div>
            <label style={labelSx}>
              <ScrollText size={10} style={{ marginRight: 4 }} /> Folio Remisión <span style={{ color: '#dc2626' }}>*</span>
            </label>
            <input value={folioRemision} onChange={e => setFolioRemision(e.target.value)} required placeholder="Capturar folio..." style={inputSx} onFocus={e => e.currentTarget.style.borderColor = '#7c3aed'} onBlur={e => e.currentTarget.style.borderColor = '#e2e8f0'} />
          </div>
          <div>
            <label style={labelSx}>
              <Gavel size={10} style={{ marginRight: 4 }} /> Marco Legal <span style={{ color: '#dc2626' }}>*</span>
            </label>
            <input value={marcoLegal} onChange={e => setMarcoLegal(e.target.value)} required placeholder="Capturar marco legal..." style={inputSx} onFocus={e => e.currentTarget.style.borderColor = '#7c3aed'} onBlur={e => e.currentTarget.style.borderColor = '#e2e8f0'} />
          </div>
          <div>
            <label style={labelSx}>
              <Map size={10} style={{ marginRight: 4 }} /> Municipio <span style={{ color: '#dc2626' }}>*</span>
            </label>
            <input value={municipio} onChange={e => setMunicipio(e.target.value)} required placeholder="Municipio..." style={inputSx} onFocus={e => e.currentTarget.style.borderColor = '#7c3aed'} onBlur={e => e.currentTarget.style.borderColor = '#e2e8f0'} />
          </div>
        </div>
      </div>

      {/* SECCIÓN 3: Evidencias Fotográficas */}
      <div style={{
        padding: '16px 20px',
        border: '1px solid #e2e8f0',
        borderLeft: '3px solid #0891b2',
        marginBottom: 24,
      }}>
        <div style={{
          fontFamily: 'Barlow Condensed,sans-serif',
          fontSize: 15,
          fontWeight: 700,
          textTransform: 'uppercase',
          color: '#1e293b',
          marginBottom: 16,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}>
          <Camera size={16} color="#0891b2" />
          Evidencias Fotográficas
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: requiereEvidencias ? 20 : 0,
        }}>
          <span style={{
            fontFamily: 'Inter,sans-serif',
            fontSize: 12,
            color: '#334155',
          }}>
            ¿Requiere evidencias fotográficas?
          </span>
          <div style={{ display: 'flex' }}>
            <button
              type="button"
              onClick={() => setRequiereEvidencias(true)}
              style={{
                fontFamily: 'JetBrains Mono,monospace',
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                padding: '6px 20px',
                border: `1px solid ${requiereEvidencias ? '#0891b2' : '#e2e8f0'}`,
                background: requiereEvidencias ? '#0891b2' : '#ffffff',
                color: requiereEvidencias ? '#ffffff' : '#94a3b8',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              SÍ
            </button>
            <div style={{ width: 1, background: '#e2e8f0' }}></div>
            <button
              type="button"
              onClick={() => setRequiereEvidencias(false)}
              style={{
                fontFamily: 'JetBrains Mono,monospace',
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                padding: '6px 20px',
                border: `1px solid ${!requiereEvidencias ? '#0891b2' : '#e2e8f0'}`,
                background: !requiereEvidencias ? '#0891b2' : '#ffffff',
                color: !requiereEvidencias ? '#ffffff' : '#94a3b8',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              NO
            </button>
          </div>
        </div>

        {requiereEvidencias && (
          <div>
            <p style={{
              fontFamily: 'Inter,sans-serif',
              fontSize: 11,
              color: '#64748b',
              margin: '0 0 16px 0',
              lineHeight: 1.5,
            }}>
              Especifique las ubicaciones y horarios donde el monitorista debe tomar las fotografías.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 16 }}>
              {evidenciaItems.map((it, i) => (
                <div
                  key={i}
                  style={{
                    border: '1px solid #e2e8f0',
                    padding: 20,
                    position: 'relative',
                  }}
                >
                  {evidenciaItems.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeEvItem(i)}
                      style={{
                        position: 'absolute', top: 8, right: 8,
                        background: 'none', border: 'none',
                        cursor: 'pointer', color: '#94a3b8',
                        padding: 4,
                      }}
                    >
                      <X size={14} />
                    </button>
                  )}

                  <div style={{
                    fontFamily: 'JetBrains Mono,monospace',
                    fontSize: 9,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: '#0891b2',
                    marginBottom: 12,
                  }}>
                    Ubicación {i + 1}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 12 }}>
                    <div>
                      <label style={{ display: 'block', fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: '#64748b', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 4 }}>Colonia</label>
                      <input value={it.colonia} onChange={e => updateEvItem(i, 'colonia', e.target.value)} placeholder="Ej. Centro" style={{ width: '100%', padding: '8px 10px', border: '1px solid #e2e8f0', fontFamily: 'Inter,sans-serif', fontSize: 12, color: '#334155', outline: 'none', boxSizing: 'border-box' }} onFocus={e => e.currentTarget.style.borderColor = '#0891b2'} onBlur={e => e.currentTarget.style.borderColor = '#e2e8f0'} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: '#64748b', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 4 }}>Calle</label>
                      <input value={it.calle} onChange={e => updateEvItem(i, 'calle', e.target.value)} placeholder="Ej. Av. Juárez" style={{ width: '100%', padding: '8px 10px', border: '1px solid #e2e8f0', fontFamily: 'Inter,sans-serif', fontSize: 12, color: '#334155', outline: 'none', boxSizing: 'border-box' }} onFocus={e => e.currentTarget.style.borderColor = '#0891b2'} onBlur={e => e.currentTarget.style.borderColor = '#e2e8f0'} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: '#64748b', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 4 }}>Número</label>
                      <input value={it.numero} onChange={e => updateEvItem(i, 'numero', e.target.value)} placeholder="Ej. 123" style={{ width: '100%', padding: '8px 10px', border: '1px solid #e2e8f0', fontFamily: 'Inter,sans-serif', fontSize: 12, color: '#334155', outline: 'none', boxSizing: 'border-box' }} onFocus={e => e.currentTarget.style.borderColor = '#0891b2'} onBlur={e => e.currentTarget.style.borderColor = '#e2e8f0'} />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div>
                      <label style={{ display: 'block', fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: '#64748b', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 4 }}>Hora Inicio</label>
                      <input type="time" value={it.horaInicio} onChange={e => updateEvItem(i, 'horaInicio', e.target.value)} style={{ width: '100%', padding: '8px 10px', border: '1px solid #e2e8f0', fontFamily: 'Inter,sans-serif', fontSize: 12, color: '#334155', outline: 'none', boxSizing: 'border-box' }} onFocus={e => e.currentTarget.style.borderColor = '#0891b2'} onBlur={e => e.currentTarget.style.borderColor = '#e2e8f0'} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: '#64748b', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 4 }}>Hora Fin</label>
                      <input type="time" value={it.horaFin} onChange={e => updateEvItem(i, 'horaFin', e.target.value)} style={{ width: '100%', padding: '8px 10px', border: '1px solid #e2e8f0', fontFamily: 'Inter,sans-serif', fontSize: 12, color: '#334155', outline: 'none', boxSizing: 'border-box' }} onFocus={e => e.currentTarget.style.borderColor = '#0891b2'} onBlur={e => e.currentTarget.style.borderColor = '#e2e8f0'} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={addEvItem}
              style={{
                display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'JetBrains Mono,monospace',
                fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase',
                padding: '8px 16px', border: '1px dashed #cbd5e1', background: 'transparent',
                color: '#64748b', cursor: 'pointer', width: '100%', justifyContent: 'center', marginBottom: 0,
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#0891b2'; e.currentTarget.style.color = '#0891b2'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.color = '#64748b'; }}
            >
              <Plus size={14} />
              Agregar otra ubicación
            </button>
          </div>
        )}
      </div>

      {errorGuardar && (
        <div style={{
          fontFamily: 'Inter,sans-serif', fontSize: 12, color: '#dc2626',
          padding: '8px 12px', background: '#fef2f2', border: '1px solid #fecaca',
          marginBottom: 12,
        }}>
          {errorGuardar}
        </div>
      )}

      <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
        <button
          type="button"
          onClick={() => router.push('/agente_juzgado/solicitudes')}
          disabled={guardando}
          style={{
            fontFamily: 'Inter,sans-serif',
            fontSize: 12,
            padding: '8px 20px',
            border: '1px solid #e2e8f0',
            background: '#ffffff',
            color: '#64748b',
            cursor: guardando ? 'not-allowed' : 'pointer',
            opacity: guardando ? 0.5 : 1,
          }}
        >
          Regresar
        </button>
        <button
          type="button"
          onClick={handleGuardar}
          disabled={guardando}
          style={{
            fontFamily: 'Inter,sans-serif',
            fontSize: 12,
            fontWeight: 600,
            padding: '8px 20px',
            border: 'none',
            background: guardando ? '#a78bfa' : '#7c3aed',
            color: '#ffffff',
            cursor: guardando ? 'not-allowed' : 'pointer',
          }}
        >
          {guardando ? 'Guardando...' : 'Guardar Detalles'}
        </button>
      </div>
    </>
  )
}
