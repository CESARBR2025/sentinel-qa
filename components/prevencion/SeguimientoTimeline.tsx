'use client'

import { useState, useTransition } from 'react'
import { format, isPast }          from 'date-fns'
import { createSeguimiento }       from '@/lib/prevencion/actions'
import { TIPOS_SEGUIMIENTO, getLabelSeguimiento, calcularFechaEsperada } from '@/lib/prevencion/timeline'

interface Props {
  fichaId:                  string
  fechaActivacionISO:       string
  seguimientosRegistrados:  { tipo: string; fechaHoraEnvioISO: string }[]
  fichaActiva:              boolean
}

export function SeguimientoTimeline({ fichaId, fechaActivacionISO, seguimientosRegistrados, fichaActiva }: Props) {
  const [pendingTipo, setPendingTipo] = useState<string | null>(null)
  const [, startTransition]           = useTransition()

  const fechaActivacion = new Date(fechaActivacionISO)
  const registradosMap  = new Map(seguimientosRegistrados.map(s => [s.tipo, s.fechaHoraEnvioISO]))

  function handleRegistrar(tipo: string) {
    setPendingTipo(tipo)
    const fd = new FormData()
    fd.set('fichaId', fichaId)
    fd.set('tipo', tipo)
    startTransition(async () => {
      await createSeguimiento(fd)
      setPendingTipo(null)
    })
  }

  return (
    <div>
      {/* Encabezado de columnas */}
      <div style={{ display: 'grid', gridTemplateColumns: '150px 150px 1fr 100px', gap: 12, padding: '6px 16px', borderBottom: '1px solid #1b2742' }}>
        {['Hito', 'Esperado', 'Registrado', ''].map(h => (
          <span key={h} style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: '#4a5878', letterSpacing: '0.18em', textTransform: 'uppercase' }}>{h}</span>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: 4 }}>
        {TIPOS_SEGUIMIENTO.map(tipo => {
          const esperada  = calcularFechaEsperada(fechaActivacion, tipo)
          const registrado = registradosMap.get(tipo)
          const vencido   = !registrado && tipo !== 'CONTESTACION_INICIAL' && isPast(esperada)

          const rowColor = registrado
            ? 'rgba(74,158,106,0.06)'
            : vencido
              ? 'rgba(192,34,58,0.06)'
              : 'transparent'

          const borderColor = registrado ? '#4a9e6a30'
            : vencido ? '#c0223a30'
            : '#1b274220'

          return (
            <div key={tipo} style={{
              display:     'grid',
              gridTemplateColumns: '150px 150px 1fr 100px',
              alignItems:  'center',
              gap:         12,
              padding:     '9px 16px',
              background:  rowColor,
              border:      `1px solid ${borderColor}`,
            }}>
              {/* Hito */}
              <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, letterSpacing: '0.08em', color: registrado ? '#4a9e6a' : vencido ? '#c0223a' : '#d8e0f0' }}>
                {getLabelSeguimiento(tipo)}
              </span>

              {/* Fecha esperada */}
              <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: '#4a5878', letterSpacing: '0.06em' }}>
                {format(esperada, 'dd/MM/yy HH:mm')}
              </span>

              {/* Fecha real */}
              {registrado ? (
                <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: '#4a9e6a', letterSpacing: '0.06em' }}>
                  ✓ {format(new Date(registrado), 'dd/MM/yy HH:mm')}
                </span>
              ) : (
                <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: vencido ? '#c0223a' : '#2a3a5e', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  {vencido ? '⚠ Vencido' : '—'}
                </span>
              )}

              {/* Botón */}
              {!registrado && fichaActiva && (
                <button
                  onClick={() => handleRegistrar(tipo)}
                  disabled={pendingTipo !== null}
                  style={{
                    padding:       '4px 10px',
                    background:    'transparent',
                    color:         pendingTipo === tipo ? '#4a5878' : '#d4a43a',
                    border:        `1px solid ${pendingTipo === tipo ? '#2a3a5e' : '#d4a43a50'}`,
                    fontFamily:    'JetBrains Mono,monospace',
                    fontSize:      9,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    cursor:        pendingTipo !== null ? 'wait' : 'pointer',
                    whiteSpace:    'nowrap',
                  }}
                >
                  {pendingTipo === tipo ? '…' : 'Registrar'}
                </button>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
