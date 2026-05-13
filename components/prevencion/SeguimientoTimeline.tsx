'use client'

import { useState, useTransition, useRef } from 'react'
import { format, isPast }          from 'date-fns'
import { createSeguimiento }       from '@/lib/prevencion/actions'
import { TIPOS_SEGUIMIENTO, getLabelSeguimiento, calcularFechaEsperada } from '@/lib/prevencion/timeline'

interface Props {
  fichaId:                  string
  fechaActivacionISO:       string
  seguimientosRegistrados:  { tipo: string; fechaHoraEnvioISO: string; archivoUrl?: string | null; nombreUsuario?: string | null }[]
  fichaActiva:              boolean
}

export function SeguimientoTimeline({ fichaId, fechaActivacionISO, seguimientosRegistrados, fichaActiva }: Props) {
  const [pendingTipo, setPendingTipo]   = useState<string | null>(null)
  const [modalOpen, setModalOpen]       = useState(false)
  const [tipoEnModal, setTipoEnModal]   = useState<string | null>(null)
  const [evidencia, setEvidencia]       = useState<{ url: string; label: string } | null>(null)
  const [, startTransition]             = useTransition()
  const formRef = useRef<HTMLFormElement>(null)

  function getExt(url: string) {
    return url.split('.').pop()?.toLowerCase() ?? ''
  }

  const fechaActivacion = new Date(fechaActivacionISO)
  const registradosMap  = new Map(seguimientosRegistrados.map(s => [s.tipo, s]))

  function handleRegistrar(tipo: string) {
    setTipoEnModal(tipo)
    setModalOpen(true)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const fd = new FormData(formRef.current!)
    fd.set('fichaId', fichaId)
    fd.set('tipo', tipoEnModal ?? '')
    setPendingTipo(tipoEnModal)
    setModalOpen(false)
    startTransition(async () => {
      await createSeguimiento(fd)
      setPendingTipo(null)
      setTipoEnModal(null)
    })
  }

  return (
    <div>
      {/* Modal de evidencia */}
      {evidencia && (
        <div
          onClick={e => e.target === e.currentTarget && setEvidencia(null)}
          style={{
            position: 'fixed', inset: 0, zIndex: 1100,
            background: 'rgba(7,11,22,0.92)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 24,
          }}
        >
          <div style={{
            background: '#0b1220', border: '1px solid #1b2742',
            display: 'flex', flexDirection: 'column',
            width: '90vw', maxWidth: 900, maxHeight: '90vh',
            boxShadow: '0 0 0 1px rgba(212,164,58,0.12), 0 24px 64px rgba(0,0,0,0.7)',
          }}>
            {/* Header */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '12px 20px', borderBottom: '1px solid #1b2742', flexShrink: 0,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 2, height: 16, background: '#d4a43a', boxShadow: '0 0 6px #d4a43a' }} />
                <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#4a5878' }}>
                  Evidencia —
                </span>
                <span style={{ fontFamily: 'Barlow Condensed,sans-serif', fontWeight: 800, fontSize: 15, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#d4a43a' }}>
                  {evidencia.label}
                </span>
              </div>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <a
                  href={evidencia.url}
                  target="_blank"
                  rel="noreferrer"
                  style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: '#8a9bc0', letterSpacing: '0.12em', textTransform: 'uppercase', textDecoration: 'none' }}
                >
                  Abrir en nueva pestaña ↗
                </a>
                <button
                  onClick={() => setEvidencia(null)}
                  style={{ background: 'transparent', border: '1px solid #1b2742', color: '#4a5878', cursor: 'pointer', padding: '4px 10px', fontFamily: 'JetBrains Mono,monospace', fontSize: 11 }}
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Contenido */}
            <div style={{ flex: 1, overflow: 'auto', minHeight: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#070b16' }}>
              {['jpg', 'jpeg', 'png'].includes(getExt(evidencia.url)) ? (
                <img
                  src={evidencia.url}
                  alt="Evidencia"
                  style={{ maxWidth: '100%', maxHeight: '75vh', objectFit: 'contain', display: 'block' }}
                />
              ) : (
                <iframe
                  src={evidencia.url}
                  style={{ width: '100%', height: '75vh', border: 'none' }}
                  title="Evidencia PDF"
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal de carga de archivo */}
      {modalOpen && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 1000,
          background: 'rgba(7,11,22,0.85)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }} onClick={(e) => e.target === e.currentTarget && setModalOpen(false)}>
          <div style={{
            background: '#0b1220', border: '1px solid #1b2742',
            padding: 32, width: 420, maxWidth: '90vw',
          }}>
            <div style={{ fontFamily: 'Barlow Condensed,sans-serif', fontWeight: 800, fontSize: 18, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#d8e0f0', marginBottom: 6 }}>
              Registrar <span style={{ color: '#d4a43a' }}>{tipoEnModal ? getLabelSeguimiento(tipoEnModal) : ''}</span>
            </div>
            <form ref={formRef} onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#4a5878', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 6 }}>
                  Evidencia (PDF o Imagen)
                </label>
                <input
                  name="archivo"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  style={{ width: '100%', padding: '9px 12px', background: '#070b16', border: '1px solid #2a3a5e', color: '#d8e0f0', fontFamily: 'Inter,sans-serif', fontSize: 13, outline: 'none', boxSizing: 'border-box' }}
                />
                <p style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: '#2a3a5e', letterSpacing: '0.1em', margin: '4px 0 0' }}>
                  Opcional — PDF, JPG o PNG
                </p>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  type="submit"
                  disabled={pendingTipo !== null}
                  style={{ flex: 1, padding: '10px 0', background: pendingTipo ? '#1b2742' : '#d4a43a', color: pendingTipo ? '#4a5878' : '#070b16', fontFamily: 'Barlow Condensed,sans-serif', fontWeight: 700, fontSize: 13, letterSpacing: '0.15em', textTransform: 'uppercase', border: 'none', cursor: pendingTipo ? 'not-allowed' : 'pointer' }}
                >
                  {pendingTipo ? 'Guardando…' : 'Confirmar'}
                </button>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  style={{ padding: '10px 20px', background: 'transparent', border: '1px solid #1b2742', color: '#8a9bc0', fontFamily: 'Barlow Condensed,sans-serif', fontWeight: 700, fontSize: 13, letterSpacing: '0.15em', textTransform: 'uppercase', cursor: 'pointer' }}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Encabezado de columnas */}
      <div style={{ display: 'grid', gridTemplateColumns: '150px 150px 1fr 100px', gap: 12, padding: '6px 16px', borderBottom: '1px solid #1b2742' }}>
        {['Hito', 'Esperado', 'Registrado', ''].map(h => (
          <span key={h} style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: '#4a5878', letterSpacing: '0.18em', textTransform: 'uppercase' }}>{h}</span>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: 4 }}>
        {TIPOS_SEGUIMIENTO.map(tipo => {
          const registro    = registradosMap.get(tipo)
          const esperada    = calcularFechaEsperada(fechaActivacion, tipo)
          const registrado = !!registro
          const vencido    = !registrado && tipo !== 'CONTESTACION_INICIAL' && isPast(esperada)

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
                <div>
                  <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: '#4a9e6a', letterSpacing: '0.06em' }}>
                    ✓ {format(new Date(registro.fechaHoraEnvioISO), 'dd/MM/yy HH:mm')}
                  </span>
                  {registro.nombreUsuario && (
                    <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 8, color: '#4a5878', letterSpacing: '0.06em', marginTop: 2 }}>
                      por {registro.nombreUsuario}
                    </div>
                  )}
                  {registro.archivoUrl && (
                    <button
                      onClick={() => setEvidencia({
                        url:   `/api/uploads/${registro.archivoUrl!.replace(/^uploads\//, '')}`,
                        label: getLabelSeguimiento(tipo),
                      })}
                      style={{ display: 'inline-block', marginTop: 3, fontSize: 10, color: '#d4a43a', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'inherit' }}
                    >
                      📎 Ver evidencia
                    </button>
                  )}
                </div>
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
