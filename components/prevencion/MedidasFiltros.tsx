'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'

const ESTADOS = [
  { key: '',          label: 'Todas'      },
  { key: 'vigentes',  label: 'Vigentes'   },
  { key: 'por_vencer',label: 'Por vencer' },
  { key: 'vencidas',  label: 'Vencidas'   },
  { key: 'sin_fecha', label: 'Sin fecha'  },
]

const AUTORIDADES = [
  { value: '',          label: 'Todas las autoridades' },
  { value: 'FISCALIA',  label: 'Fiscalía'              },
  { value: 'UMECA',     label: 'UMECA'                 },
  { value: 'JUZGADOS',  label: 'Juzgados'              },
  { value: 'SEC_MUJER', label: 'Sec. de la Mujer'      },
]

export function MedidasFiltros() {
  const router       = useRouter()
  const searchParams = useSearchParams()

  const estado      = searchParams.get('estado')      ?? ''
  const autoridad   = searchParams.get('autoridad')   ?? ''
  const sinVisita   = searchParams.get('sinVisita')   === '1'
  const prorrogadas = searchParams.get('prorrogadas') === '1'

  const set = useCallback((key: string, value: string) => {
    const p = new URLSearchParams(searchParams.toString())
    if (value) p.set(key, value)
    else p.delete(key)
    router.push(`/prevencion/medidas?${p.toString()}`)
  }, [router, searchParams])

  const toggle = useCallback((key: string, active: boolean) => {
    set(key, active ? '' : '1')
  }, [set])

  return (
    <div style={{ marginBottom: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* Fila 1: estado semáforo */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {ESTADOS.map(e => {
          const active = estado === e.key
          return (
            <button
              key={e.key}
              onClick={() => set('estado', e.key)}
              style={{
                padding: '5px 14px',
                background: active ? '#1b2742' : 'transparent',
                border: `1px solid ${active ? '#d4a43a' : '#1b2742'}`,
                color: active ? '#d4a43a' : '#4a5878',
                fontFamily: 'JetBrains Mono,monospace', fontSize: 10,
                letterSpacing: '0.14em', textTransform: 'uppercase',
                cursor: 'pointer',
              }}
            >
              {e.label}
            </button>
          )
        })}
      </div>

      {/* Fila 2: autoridad + toggles */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
        <select
          value={autoridad}
          onChange={e => set('autoridad', e.target.value)}
          style={{
            padding: '5px 12px', background: '#0b1220',
            border: '1px solid #1b2742', color: autoridad ? '#d8e0f0' : '#4a5878',
            fontFamily: 'JetBrains Mono,monospace', fontSize: 10,
            letterSpacing: '0.1em', textTransform: 'uppercase',
            cursor: 'pointer', outline: 'none',
          }}
        >
          {AUTORIDADES.map(a => (
            <option key={a.value} value={a.value}>{a.label}</option>
          ))}
        </select>

        <button
          onClick={() => toggle('sinVisita', sinVisita)}
          style={{
            padding: '5px 14px',
            background: sinVisita ? 'rgba(192,34,58,0.15)' : 'transparent',
            border: `1px solid ${sinVisita ? '#c0223a' : '#1b2742'}`,
            color: sinVisita ? '#c0223a' : '#4a5878',
            fontFamily: 'JetBrains Mono,monospace', fontSize: 10,
            letterSpacing: '0.14em', textTransform: 'uppercase',
            cursor: 'pointer',
          }}
        >
          Sin visita
        </button>

        <button
          onClick={() => toggle('prorrogadas', prorrogadas)}
          style={{
            padding: '5px 14px',
            background: prorrogadas ? 'rgba(212,164,58,0.12)' : 'transparent',
            border: `1px solid ${prorrogadas ? '#d4a43a' : '#1b2742'}`,
            color: prorrogadas ? '#d4a43a' : '#4a5878',
            fontFamily: 'JetBrains Mono,monospace', fontSize: 10,
            letterSpacing: '0.14em', textTransform: 'uppercase',
            cursor: 'pointer',
          }}
        >
          Prorrogadas
        </button>

        {(estado || autoridad || sinVisita || prorrogadas) && (
          <button
            onClick={() => router.push('/prevencion/medidas')}
            style={{
              padding: '5px 14px', background: 'transparent',
              border: '1px solid #1b2742', color: '#4a5878',
              fontFamily: 'JetBrains Mono,monospace', fontSize: 10,
              letterSpacing: '0.14em', textTransform: 'uppercase',
              cursor: 'pointer',
            }}
          >
            ✕ Limpiar filtros
          </button>
        )}
      </div>
    </div>
  )
}
