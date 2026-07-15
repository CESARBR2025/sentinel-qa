'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Hash, FileText, Fingerprint, Calendar, Clock, BookOpen, User, Shield, BadgeCheck, UserCheck, ScrollText, Gavel, MapPin, Map } from 'lucide-react'
import { DireccionGoogleMaps } from '@/components/shared/DireccionGoogleMaps'
import { guardarDetallesAseguradoAction } from '@/lib/fiscalia/actions'
import type { DetalleAsegurado } from '@/lib/fiscalia/types'
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

  const handleGuardar = async () => {
    setGuardando(true)
    setErrorGuardar(null)

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
    )

    setGuardando(false)
    if (res.error) {
      setErrorGuardar(res.error)
      return
    }
    router.push('/fiscalia/solicitudes')
  }

  const handleDireccionChange = (d: Direccion) => {
    setCalle(d.calle)
    setNumero(d.numero)
    setColonia(d.colonia)
    setMunicipio(d.municipio)
  }

  const displayVal = (val: string | null | undefined): string => val ?? '—'

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <div style={{
          fontFamily: 'JetBrains Mono,monospace',
          fontSize: 9,
          letterSpacing: '0.3em',
          color: '#7c3aed',
          textTransform: 'uppercase',
          marginBottom: 4,
        }}>
          OL DE: Fiscalía
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
          Asegurados · <span style={{ color: '#7c3aed' }}>Fiscalía</span>
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

      {/* SECCIÓN 2: Datos por Capturar */}
      <div style={{ padding: '16px 20px', border: '1px solid #e2e8f0', borderLeft: '3px solid #dc2626', marginBottom: 24 }}>
        <div style={{ fontFamily: 'Barlow Condensed,sans-serif', fontSize: 15, fontWeight: 700, textTransform: 'uppercase', color: '#1e293b', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
          <BookOpen size={16} color="#dc2626" /> Datos por Capturar
          <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 8, color: '#dc2626', letterSpacing: '0.1em', fontWeight: 400, marginLeft: 8 }}>(REQUERIDOS)</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          <div>
            <label style={labelSx}><BookOpen size={10} style={{ marginRight: 4 }} /> Folio SIJA <span style={{ color: '#dc2626' }}>*</span></label>
            <input value={folioSija} onChange={e => setFolioSija(e.target.value)} required placeholder="Capturar folio SIJA..." style={inputSx} />
          </div>
          <div style={{ gridColumn: 'span 2' }}>
            <label style={labelSx}><MapPin size={10} style={{ marginRight: 4 }} /> Domicilio del Detenido <span style={{ color: '#dc2626' }}>*</span></label>
            <DireccionGoogleMaps value={dir} onChange={handleDireccionChange} />
          </div>
          <div>
            <label style={labelSx}><Map size={10} style={{ marginRight: 4 }} /> Calle <span style={{ color: '#dc2626' }}>*</span></label>
            <input value={calle} onChange={e => setCalle(e.target.value)} required placeholder="Calle..." style={inputSx} />
          </div>
          <div>
            <label style={labelSx}><Map size={10} style={{ marginRight: 4 }} /> Número <span style={{ color: '#dc2626' }}>*</span></label>
            <input value={numero} onChange={e => setNumero(e.target.value)} required placeholder="Número..." style={inputSx} />
          </div>
          <div>
            <label style={labelSx}><Map size={10} style={{ marginRight: 4 }} /> Colonia <span style={{ color: '#dc2626' }}>*</span></label>
            <input value={colonia} onChange={e => setColonia(e.target.value)} required placeholder="Colonia..." style={inputSx} />
          </div>
          <div>
            <label style={labelSx}><ScrollText size={10} style={{ marginRight: 4 }} /> Folio Remisión <span style={{ color: '#dc2626' }}>*</span></label>
            <input value={folioRemision} onChange={e => setFolioRemision(e.target.value)} required placeholder="Capturar folio..." style={inputSx} />
          </div>
          <div>
            <label style={labelSx}><Gavel size={10} style={{ marginRight: 4 }} /> Marco Legal <span style={{ color: '#dc2626' }}>*</span></label>
            <input value={marcoLegal} onChange={e => setMarcoLegal(e.target.value)} required placeholder="Capturar marco legal..." style={inputSx} />
          </div>
          <div>
            <label style={labelSx}><Map size={10} style={{ marginRight: 4 }} /> Municipio <span style={{ color: '#dc2626' }}>*</span></label>
            <input value={municipio} onChange={e => setMunicipio(e.target.value)} required placeholder="Municipio..." style={inputSx} />
          </div>
        </div>
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
          onClick={() => router.push('/fiscalia/solicitudes')}
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
          {guardando ? 'Guardando...' : 'Guardar Datos'}
        </button>
      </div>
    </div>
  )
}
