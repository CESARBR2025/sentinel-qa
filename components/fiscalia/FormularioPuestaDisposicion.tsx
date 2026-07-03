'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Clock, Save, ArrowLeft } from 'lucide-react'
import { guardarPuestaDisposicionAction } from '@/lib/fiscalia/actions'
import type { DetalleAseguradoCompleto, PuestaDisposicionRow, PuestaDisposicionInput } from '@/lib/fiscalia/types'
import { ACTAS_CHECKLIST } from '@/lib/fiscalia/types'

interface Props {
  reporteCampoId: string
  data: DetalleAseguradoCompleto
  puestaDisposicion: PuestaDisposicionRow | null
  onGuardar?: (reporteCampoId: string, datos: PuestaDisposicionInput) => Promise<{ success: boolean; error?: string }>
}

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
  fontFamily: 'Inter,sans-serif',
  fontSize: 12,
  color: '#334155',
  outline: 'none',
  boxSizing: 'border-box',
}

const disabledSx: React.CSSProperties = {
  ...inputSx,
  borderLeft: '3px solid #059669',
  background: '#fafafa',
  color: '#64748b',
}

export function FormularioPuestaDisposicion({ reporteCampoId, data, puestaDisposicion, onGuardar }: Props) {
  const router = useRouter()
  const readOnly = !!puestaDisposicion

  const [gestionInterna, setGestionInterna] = useState(puestaDisposicion?.gestionInterna ?? true)
  const [dependenciaExterna, setDependenciaExterna] = useState(puestaDisposicion?.dependenciaExterna ?? '')
  const [actas, setActas] = useState<Record<string, boolean>>(puestaDisposicion?.actas ?? {})
  const [otrosActos, setOtrosActos] = useState(puestaDisposicion?.otrosActos ?? '')
  const [horaInicio, setHoraInicio] = useState(puestaDisposicion?.horaInicioTraslado ?? '')
  const [horaLlegada, setHoraLlegada] = useState(puestaDisposicion?.horaLlegadaSede ?? '')
  const [horaDisposicion, setHoraDisposicion] = useState(puestaDisposicion?.horaPuestaDisposicion ?? '')
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [exito, setExito] = useState<string | null>(null)

  const calcTiempo = (): string => {
    if (!horaInicio || !horaDisposicion) return ''
    const [ih, im] = horaInicio.split(':').map(Number)
    const [fh, fm] = horaDisposicion.split(':').map(Number)
    const inicioMin = ih * 60 + im
    const finMin = fh * 60 + fm
    if (finMin <= inicioMin) return ''
    const total = finMin - inicioMin
    const h = Math.floor(total / 60)
    const m = total % 60
    return `${h}h ${m}m (${total} min)`
  }

  const tiempoTotal = (): number => {
    if (!horaInicio || !horaDisposicion) return 0
    const [ih, im] = horaInicio.split(':').map(Number)
    const [fh, fm] = horaDisposicion.split(':').map(Number)
    const total = (fh * 60 + fm) - (ih * 60 + im)
    return total > 0 ? total : 0
  }

  async function handleGuardar() {
    if (!horaInicio || !horaLlegada || !horaDisposicion) {
      setError('Capture todas las horas de traslado')
      return
    }
    if (!gestionInterna && !dependenciaExterna) {
      setError('Seleccione la dependencia externa')
      return
    }
    setGuardando(true)
    setError(null)

    const save = onGuardar ?? guardarPuestaDisposicionAction
    const result = await save(reporteCampoId, {
      gestionInterna,
      dependenciaExterna: gestionInterna ? null : dependenciaExterna,
      actas,
      otrosActos: otrosActos || null,
      horaInicioTraslado: horaInicio,
      horaLlegadaSede: horaLlegada,
      tiempoTrasladoTotal: tiempoTotal(),
      horaPuestaDisposicion: horaDisposicion,
    })

    setGuardando(false)
    if (result.error) {
      setError(result.error)
    } else {
      setExito('Puesta a disposición guardada correctamente')
      setTimeout(() => router.push('/fiscalia/asegurados'), 1500)
    }
  }

  function toggleActa(key: string) {
    setActas(prev => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <>
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
          <Clock size={16} color="#7c3aed" />
          Puesta a Disposición
          <span style={{
            fontFamily: 'JetBrains Mono,monospace',
            fontSize: 8,
            color: '#94a3b8',
            letterSpacing: '0.1em',
            fontWeight: 400,
            marginLeft: 8,
          }}>
            (CIERRE DEL TRÁMITE)
          </span>
        </div>
      </div>

      {/* Gestión */}
      <div style={{ marginBottom: 24, border: '1px solid #e2e8f0', padding: 16, borderLeft: '3px solid #7c3aed' }}>
        <label style={{ ...labelSx, color: '#7c3aed', marginBottom: 12, fontSize: 11 }}>Gestión</label>
        <div style={{ display: 'flex', gap: 24, marginBottom: 12 }}>
          <label style={{ fontFamily: 'Inter,sans-serif', fontSize: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
            <input type="radio" name="gestion" checked={gestionInterna} onChange={() => setGestionInterna(true)} disabled={readOnly} />
            Interna (Fiscalía)
          </label>
          <label style={{ fontFamily: 'Inter,sans-serif', fontSize: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
            <input type="radio" name="gestion" checked={!gestionInterna} onChange={() => setGestionInterna(false)} disabled={readOnly} />
            Externa
          </label>
        </div>
        {!gestionInterna && (
          <div>
            <label style={labelSx}>Dependencia Externa</label>
            <select
              value={dependenciaExterna}
              onChange={e => setDependenciaExterna(e.target.value)}
              disabled={readOnly}
              style={inputSx}
            >
              <option value="">Seleccionar...</option>
              <option value="fiscalia">Fiscalía</option>
              <option value="juzgado">Juzgado</option>
            </select>
          </div>
        )}
      </div>

      {/* Actas de investigación */}
      <div style={{ marginBottom: 24, border: '1px solid #e2e8f0', padding: 16, borderLeft: '3px solid #7c3aed' }}>
        <label style={{ ...labelSx, color: '#7c3aed', marginBottom: 12, fontSize: 11 }}>Actos de Investigación</label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
          {ACTAS_CHECKLIST.map(a => (
            <label key={a.key} style={{
              fontFamily: 'Inter,sans-serif', fontSize: 12,
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '6px 8px', background: actas[a.key] ? '#f5f3ff' : '#f8fafc',
              border: `1px solid ${actas[a.key] ? '#c4b5fd' : '#e2e8f0'}`,
              cursor: readOnly ? 'default' : 'pointer',
            }}>
              <input
                type="checkbox"
                checked={!!actas[a.key]}
                onChange={() => toggleActa(a.key)}
                disabled={readOnly}
              />
              {a.label}
            </label>
          ))}
        </div>
        <div style={{ marginTop: 12 }}>
          <label style={labelSx}>Otros actos de investigación</label>
          <input
            value={otrosActos}
            onChange={e => setOtrosActos(e.target.value)}
            placeholder="Señale cuál..."
            style={inputSx}
            readOnly={readOnly}
          />
        </div>
      </div>

      {/* Tiempos de traslado */}
      <div style={{ marginBottom: 24, border: '1px solid #e2e8f0', padding: 16, borderLeft: '3px solid #7c3aed' }}>
        <label style={{ ...labelSx, color: '#7c3aed', marginBottom: 12, fontSize: 11 }}>
          <Clock size={12} style={{ marginRight: 4 }} /> Tiempos de Traslado
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          <div>
            <label style={labelSx}>Hora de inicio de traslado</label>
            <input
              type="time"
              value={horaInicio}
              onChange={e => setHoraInicio(e.target.value)}
              style={inputSx}
              readOnly={readOnly}
            />
          </div>
          <div>
            <label style={labelSx}>Hora de llegada a sede ministerial</label>
            <input
              type="time"
              value={horaLlegada}
              onChange={e => setHoraLlegada(e.target.value)}
              style={inputSx}
              readOnly={readOnly}
            />
          </div>
          <div>
            <label style={labelSx}>Hora de puesta a disposición</label>
            <input
              type="time"
              value={horaDisposicion}
              onChange={e => setHoraDisposicion(e.target.value)}
              style={inputSx}
              readOnly={readOnly}
            />
          </div>
        </div>
        {calcTiempo() && (
          <div style={{
            marginTop: 12, padding: '8px 12px',
            background: '#f0fdf4', border: '1px solid #bbf7d0',
            fontFamily: 'JetBrains Mono,monospace', fontSize: 11, color: '#166534',
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <Clock size={12} />
            Tiempo de Traslado Total: {calcTiempo()}
          </div>
        )}
      </div>

      {error && (
        <div style={{
          fontFamily: 'Inter,sans-serif', fontSize: 12, color: '#dc2626',
          padding: '8px 12px', background: '#fef2f2', border: '1px solid #fecaca',
          marginBottom: 12,
        }}>
          {error}
        </div>
      )}

      {exito && (
        <div style={{
          fontFamily: 'Inter,sans-serif', fontSize: 12, color: '#059669',
          padding: '8px 12px', background: '#f0fdf4', border: '1px solid #bbf7d0',
          marginBottom: 12,
        }}>
          {exito}
        </div>
      )}

      <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
        <button
          type="button"
          onClick={() => router.push('/fiscalia/asegurados')}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            fontFamily: 'Inter,sans-serif', fontSize: 12,
            padding: '8px 20px', border: '1px solid #e2e8f0',
            background: '#ffffff', color: '#64748b', cursor: 'pointer',
          }}
        >
          <ArrowLeft size={14} />
          Regresar
        </button>
        {!readOnly && (
          <button
            type="button"
            onClick={handleGuardar}
            disabled={guardando}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              fontFamily: 'Inter,sans-serif', fontSize: 12, fontWeight: 600,
              padding: '8px 20px', border: 'none',
              background: guardando ? '#a78bfa' : '#7c3aed',
              color: '#ffffff', cursor: guardando ? 'not-allowed' : 'pointer',
            }}
          >
            <Save size={14} />
            {guardando ? 'Guardando...' : 'Finalizar Puesta a Disposición'}
          </button>
        )}
      </div>
    </>
  )
}
