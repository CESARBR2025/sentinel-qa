'use client'

import { useState, useEffect, useTransition } from 'react'
import { Plus, Trash2, ScrollText } from 'lucide-react'
import {
  listarAntecedentesExternosAction,
  agregarAntecedenteExternoAction,
  eliminarAntecedenteExternoAction,
} from '@/lib/fiscalia/actions'
import type { AntecedenteExterno } from '@/lib/fiscalia/types'

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

const selectSx: React.CSSProperties = {
  ...inputSx,
  background: '#fff',
}

export function AntecedentesExternos({ reporteCampoId, readOnly = false }: Props) {
  const [items, setItems] = useState<AntecedenteExterno[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [mostrarForm, setMostrarForm] = useState(false)
  const [tipo, setTipo] = useState<'DELITO' | 'FALTA_ADMINISTRATIVA'>('DELITO')
  const [descripcion, setDescripcion] = useState('')
  const [fecha, setFecha] = useState('')
  const [lugar, setLugar] = useState('')
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    listarAntecedentesExternosAction(reporteCampoId).then(res => {
      if (res.error) setError(res.error)
      if (res.data) setItems(res.data)
      setCargando(false)
    })
  }, [reporteCampoId])

  const agregar = () => {
    if (!descripcion.trim()) return
    startTransition(async () => {
      const res = await agregarAntecedenteExternoAction(reporteCampoId, {
        tipo, descripcion, fecha: fecha || null, lugar: lugar || null,
      })
      if (res.error) {
        setError(res.error)
        return
      }
      const actualizado = await listarAntecedentesExternosAction(reporteCampoId)
      if (actualizado.data) setItems(actualizado.data)
      setDescripcion(''); setFecha(''); setLugar(''); setMostrarForm(false)
    })
  }

  const eliminar = (id: string) => {
    startTransition(async () => {
      await eliminarAntecedenteExternoAction(id)
      setItems(prev => prev.filter(i => i.id !== id))
    })
  }

  const delitos = items.filter(i => i.tipo === 'DELITO')
  const faltas = items.filter(i => i.tipo === 'FALTA_ADMINISTRATIVA')

  const renderLista = (lista: AntecedenteExterno[]) => {
    if (lista.length === 0) {
      return (
        <div style={{ fontFamily: 'Inter,sans-serif', fontSize: 12, color: '#94a3b8', padding: '6px 0' }}>
          — Sin registros
        </div>
      )
    }
    return lista.map(item => (
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
            {item.fecha && <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#7c3aed' }}>{item.fecha} </span>}
            {item.descripcion}
            {item.lugar ? <span style={{ color: '#64748b' }}> — {item.lugar}</span> : null}
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
            aria-label="Eliminar antecedente"
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>
    ))
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
          <ScrollText size={16} color="#7c3aed" />
          Antecedentes Externos
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
            Agregar antecedente externo
          </button>
        )}
      </div>

      {cargando ? (
        <div style={{ fontFamily: 'Inter,sans-serif', fontSize: 12, color: '#64748b' }}>Cargando...</div>
      ) : (
        <div className="grid-2">
          <div>
            <div style={{ ...labelSx, color: '#7c3aed' }}>DELITOS</div>
            {renderLista(delitos)}
          </div>
          <div>
            <div style={{ ...labelSx, color: '#7c3aed' }}>FALTAS ADMINISTRATIVAS</div>
            {renderLista(faltas)}
          </div>
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
              <label style={labelSx}>Tipo</label>
              <select
                value={tipo}
                onChange={e => setTipo(e.target.value as 'DELITO' | 'FALTA_ADMINISTRATIVA')}
                style={selectSx}
              >
                <option value="DELITO">Delito</option>
                <option value="FALTA_ADMINISTRATIVA">Falta Administrativa</option>
              </select>
            </div>
            <div>
              <label style={labelSx}>Fecha</label>
              <input
                type="date"
                value={fecha}
                onChange={e => setFecha(e.target.value)}
                style={inputSx}
              />
            </div>
            <div>
              <label style={labelSx}>Lugar</label>
              <input
                value={lugar}
                onChange={e => setLugar(e.target.value)}
                style={inputSx}
                placeholder="Ej. Guanajuato"
              />
            </div>
          </div>
          <div style={{ marginTop: 12 }}>
            <label style={labelSx}>Descripción</label>
            <textarea
              value={descripcion}
              onChange={e => setDescripcion(e.target.value)}
              style={{ ...inputSx, minHeight: 60, resize: 'vertical' }}
              placeholder="Descripción del delito o falta administrativa previa"
            />
          </div>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 12 }}>
            <button
              type="button"
              onClick={() => { setMostrarForm(false); setDescripcion(''); setFecha(''); setLugar('') }}
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
              disabled={isPending || !descripcion.trim()}
              style={{
                fontFamily: 'Inter,sans-serif',
                fontSize: 12,
                fontWeight: 600,
                padding: '6px 16px',
                border: 'none',
                background: isPending || !descripcion.trim() ? '#a78bfa' : '#7c3aed',
                color: '#fff',
                cursor: isPending || !descripcion.trim() ? 'not-allowed' : 'pointer',
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
        Antecedentes calculados dentro de esta base de datos + registros manuales de otras fuentes — no sustituye una consulta a Plataforma México/RNPP.
      </div>
    </div>
  )
}
