'use client'

import { useState, useEffect, useTransition } from 'react'
import { Plus, Trash2, Crosshair } from 'lucide-react'
import {
  listarArmasAseguradasAction,
  agregarArmaAseguradaAction,
  eliminarArmaAseguradaAction,
} from '@/lib/fiscalia/actions'
import type { ArmaAsegurada } from '@/lib/fiscalia/types'

interface Props {
  reporteCampoId: string
  readOnly?: boolean
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
  borderLeft: '3px solid #7c3aed',
  fontFamily: 'Inter,sans-serif',
  fontSize: 12,
  color: '#334155',
  outline: 'none',
  boxSizing: 'border-box',
}

export function ArmasAseguradas({ reporteCampoId, readOnly = false }: Props) {
  const [items, setItems] = useState<ArmaAsegurada[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [mostrarForm, setMostrarForm] = useState(false)
  const [tipoArma, setTipoArma] = useState('')
  const [marca, setMarca] = useState('')
  const [matricula, setMatricula] = useState('')
  const [calibre, setCalibre] = useState('')
  const [carpeta, setCarpeta] = useState('')
  const [observaciones, setObservaciones] = useState('')
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    listarArmasAseguradasAction(reporteCampoId).then(res => {
      if (res.error) setError(res.error)
      if (res.data) {
        setItems(res.data.items)
        setCarpeta(res.data.carpetaInvestigacionSugerida ?? '')
      }
      setCargando(false)
    })
  }, [reporteCampoId])

  const agregar = () => {
    if (!tipoArma.trim()) return
    startTransition(async () => {
      const res = await agregarArmaAseguradaAction(reporteCampoId, {
        tipoArma,
        marca: marca.trim() || null,
        matricula: matricula.trim() || null,
        calibre: calibre.trim() || null,
        observaciones: observaciones.trim() || null,
      })
      if (res.error) {
        setError(res.error)
        return
      }
      const actualizado = await listarArmasAseguradasAction(reporteCampoId)
      if (actualizado.data) setItems(actualizado.data.items)
      setTipoArma(''); setMarca(''); setMatricula(''); setCalibre(''); setObservaciones(''); setMostrarForm(false)
    })
  }

  const eliminar = (id: string) => {
    startTransition(async () => {
      await eliminarArmaAseguradaAction(id)
      setItems(prev => prev.filter(i => i.id !== id))
    })
  }

  return (
    <div style={{
      padding: '16px 20px',
      border: '1px solid #e2e8f0',
      borderLeft: '3px solid #7c3aed',
      background: '#fafafa',
      marginBottom: 24,
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
      }}>
        <div style={{
          fontFamily: 'Barlow Condensed,sans-serif',
          fontSize: 15,
          fontWeight: 700,
          textTransform: 'uppercase',
          color: '#1e293b',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}>
          <Crosshair size={16} color="#7c3aed" />
          Armas Aseguradas
        </div>
        {!readOnly && !mostrarForm && (
          <button
            type="button"
            onClick={() => setMostrarForm(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontFamily: 'Inter,sans-serif',
              fontSize: 11,
              fontWeight: 600,
              padding: '6px 14px',
              border: '1px solid #7c3aed',
              background: '#7c3aed',
              color: '#fff',
              cursor: 'pointer',
            }}
          >
            <Plus size={13} />
            Agregar arma
          </button>
        )}
      </div>

      {cargando ? (
        <div style={{ fontFamily: 'Inter,sans-serif', fontSize: 12, color: '#64748b' }}>Cargando...</div>
      ) : (
        <div>
          {items.length === 0 ? (
            <div style={{ fontFamily: 'Inter,sans-serif', fontSize: 12, color: '#94a3b8', padding: '6px 0' }}>
              — Sin registros
            </div>
          ) : (
            items.map(item => (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 8,
                  padding: '8px 0',
                  borderBottom: '1px solid #e2e8f0',
                  fontFamily: 'Inter,sans-serif',
                  fontSize: 12,
                  color: '#334155',
                }}
              >
                <div style={{ flex: 1 }}>
                  <div>
                    <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#7c3aed' }}>{item.tipoArma} </span>
                    {[item.marca, item.matricula, item.calibre].filter(Boolean).join(' · ')}
                    {item.observaciones ? <span style={{ color: '#64748b' }}> — {item.observaciones}</span> : null}
                  </div>
                  {item.capturadoPorNombre && (
                    <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 2 }}>
                      Capturado por {item.capturadoPorNombre}
                    </div>
                  )}
                </div>
                {!readOnly && (
                  <button
                    type="button"
                    onClick={() => eliminar(item.id)}
                    style={{
                      border: 'none',
                      background: 'transparent',
                      color: '#dc2626',
                      cursor: 'pointer',
                      padding: 2,
                    }}
                    aria-label="Eliminar arma"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {mostrarForm && !readOnly && (
        <div style={{
          marginTop: 16,
          padding: '12px 14px',
          border: '1px solid #e2e8f0',
          background: '#fff',
        }}>
          <div className="grid-3">
            <div>
              <label style={labelSx}>Tipo de Arma *</label>
              <input
                value={tipoArma}
                onChange={e => setTipoArma(e.target.value)}
                style={inputSx}
                placeholder="Ej. Pistola 9mm"
              />
            </div>
            <div>
              <label style={labelSx}>Marca</label>
              <input
                value={marca}
                onChange={e => setMarca(e.target.value)}
                style={inputSx}
                placeholder="Ej. Glock"
              />
            </div>
            <div>
              <label style={labelSx}>Matrícula</label>
              <input
                value={matricula}
                onChange={e => setMatricula(e.target.value)}
                style={inputSx}
                placeholder="Número de serie / matrícula"
              />
            </div>
          </div>
          <div className="grid-3" style={{ marginTop: 12 }}>
            <div>
              <label style={labelSx}>Calibre</label>
              <input
                value={calibre}
                onChange={e => setCalibre(e.target.value)}
                style={inputSx}
                placeholder="Ej. 9mm"
              />
            </div>
            <div>
              <label style={labelSx}>Carpeta de Investigación</label>
              <input
                value={carpeta}
                onChange={e => setCarpeta(e.target.value)}
                style={inputSx}
                placeholder="Sugerida desde D1, editable"
              />
            </div>
          </div>
          <div style={{ marginTop: 12 }}>
            <label style={labelSx}>Observaciones</label>
            <textarea
              value={observaciones}
              onChange={e => setObservaciones(e.target.value)}
              style={{ ...inputSx, minHeight: 60, resize: 'vertical' }}
              placeholder="Descripción del arma asegurada"
            />
          </div>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 12 }}>
            <button
              type="button"
              onClick={() => { setMostrarForm(false); setTipoArma(''); setMarca(''); setMatricula(''); setCalibre(''); setObservaciones('') }}
              style={{
                fontFamily: 'Inter,sans-serif',
                fontSize: 12,
                padding: '6px 16px',
                border: '1px solid #e2e8f0',
                background: '#fff',
                color: '#64748b',
                cursor: 'pointer',
              }}
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={agregar}
              disabled={isPending || !tipoArma.trim()}
              style={{
                fontFamily: 'Inter,sans-serif',
                fontSize: 12,
                fontWeight: 600,
                padding: '6px 16px',
                border: 'none',
                background: isPending || !tipoArma.trim() ? '#a78bfa' : '#7c3aed',
                color: '#fff',
                cursor: isPending || !tipoArma.trim() ? 'not-allowed' : 'pointer',
              }}
            >
              {isPending ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </div>
      )}

      {error && (
        <div style={{
          fontFamily: 'Inter,sans-serif',
          fontSize: 12,
          color: '#dc2626',
          padding: '8px 12px',
          background: '#fef2f2',
          border: '1px solid #fecaca',
          marginTop: 12,
        }}>
          {error}
        </div>
      )}

      <div style={{
        fontFamily: 'Inter,sans-serif',
        fontSize: 10,
        color: '#94a3b8',
        lineHeight: 1.5,
        marginTop: 16,
        paddingTop: 12,
        borderTop: '1px solid #e2e8f0',
      }}>
        Registro estructurado de armas de fuego aseguradas — se sincroniza automáticamente al paso 7 de Formato N. La carpeta de investigación es una referencia sugerida desde el D1.
      </div>
    </div>
  )
}
