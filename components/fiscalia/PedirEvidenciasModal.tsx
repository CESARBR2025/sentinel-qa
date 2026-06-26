'use client'

import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { accionPedirEvidencias } from '@/lib/fiscalia/actions'

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

export function PedirEvidenciasBoton({ solicitudId }: { solicitudId: string }) {
  const [open, setOpen] = useState(false)
  const [items, setItems] = useState<EvidenciaItem[]>([emptyItem()])
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function update(i: number, field: keyof EvidenciaItem, value: string) {
    setItems(prev => prev.map((it, idx) => idx === i ? { ...it, [field]: value } : it))
  }

  function addItem() {
    setItems(prev => [...prev, emptyItem()])
  }

  function removeItem(i: number) {
    setItems(prev => prev.filter((_, idx) => idx !== i))
  }

  function reset() {
    setItems([emptyItem()])
    setError(null)
    setPending(false)
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)

    const validos = items.filter(it => it.colonia.trim() && it.calle.trim() && it.numero.trim() && it.horaInicio.trim() && it.horaFin.trim())
    if (validos.length === 0) {
      setError('Complete al menos una ubicación con todos los campos')
      return
    }

    const ahora = new Date().toISOString()
    const payload = validos.map((it, idx) => ({
      solicitud_id: idx + 1,
      fecha_peticion: ahora,
      colonia: it.colonia.trim(),
      calle: it.calle.trim(),
      numero: it.numero.trim(),
      hora_inicio: it.horaInicio.trim(),
      hora_fin: it.horaFin.trim(),
      atendida: false,
    }))

    setPending(true)

    const form = e.currentTarget
    const fd = new FormData(form)
    fd.set('evidencias', JSON.stringify(payload))

    const res = await accionPedirEvidencias(fd)
    setPending(false)

    if (!res.success) {
      setError(res.error ?? 'Error desconocido')
      return
    }

    setOpen(false)
    reset()
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        style={{
          fontFamily: 'JetBrains Mono,monospace',
          fontSize: 9,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          padding: '5px 14px',
          border: '1px solid #059669',
          background: '#ffffff',
          color: '#059669',
          cursor: 'pointer',
          transition: 'all 0.15s ease',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = '#059669'; e.currentTarget.style.color = '#ffffff'; }}
        onMouseLeave={e => { e.currentTarget.style.background = '#ffffff'; e.currentTarget.style.color = '#059669'; }}
      >
        Pedir Evidencias
      </button>

      {open && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(15,23,42,0.5)',
          }}
          onClick={() => { if (!pending) { setOpen(false); reset() } }}
        >
          <div
            style={{
              background: '#ffffff',
              width: 640,
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: 32,
              position: 'relative',
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ position: 'absolute', top: 0, left: 0, width: 48, height: 3, background: '#059669' }}></div>

            {error && (
              <div style={{
                marginBottom: 16,
                padding: '10px 14px',
                background: '#fef2f2',
                borderLeft: '3px solid #dc2626',
                fontFamily: 'Inter,sans-serif',
                fontSize: 12,
                color: '#991b1b',
                lineHeight: 1.4,
              }}>
                {error}
              </div>
            )}

            <div style={{ marginBottom: 24 }}>
              <h3 style={{
                fontFamily: 'Barlow Condensed,sans-serif',
                fontSize: 22,
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                margin: '0 0 4px 0',
                color: '#0f172a',
              }}>
                Pedir Evidencias
              </h3>
              <p style={{
                fontFamily: 'Inter,sans-serif',
                fontSize: 12,
                color: '#64748b',
                margin: 0,
                lineHeight: 1.5,
              }}>
                Especifique las ubicaciones y horarios donde el monitorista debe tomar las fotografías.
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <input type="hidden" name="id" value={solicitudId} />

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 24 }}>
                {items.map((it, i) => (
                  <div
                    key={i}
                    style={{
                      border: '1px solid #e2e8f0',
                      padding: 20,
                      position: 'relative',
                    }}
                  >
                    {items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItem(i)}
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
                      color: '#059669',
                      marginBottom: 12,
                    }}>
                      Ubicación {i + 1}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 12 }}>
                      <div>
                        <label style={{
                          display: 'block',
                          fontFamily: 'JetBrains Mono,monospace',
                          fontSize: 9,
                          color: '#64748b',
                          letterSpacing: '0.06em',
                          textTransform: 'uppercase',
                          marginBottom: 4,
                        }}>
                          Colonia
                        </label>
                        <input
                          value={it.colonia}
                          onChange={e => update(i, 'colonia', e.target.value)}
                          placeholder="Ej. Centro"
                          style={inputSx}
                          onFocus={e => e.currentTarget.style.borderColor = '#059669'}
                          onBlur={e => e.currentTarget.style.borderColor = '#e2e8f0'}
                        />
                      </div>
                      <div>
                        <label style={{
                          display: 'block',
                          fontFamily: 'JetBrains Mono,monospace',
                          fontSize: 9,
                          color: '#64748b',
                          letterSpacing: '0.06em',
                          textTransform: 'uppercase',
                          marginBottom: 4,
                        }}>
                          Calle
                        </label>
                        <input
                          value={it.calle}
                          onChange={e => update(i, 'calle', e.target.value)}
                          placeholder="Ej. Av. Juárez"
                          style={inputSx}
                          onFocus={e => e.currentTarget.style.borderColor = '#059669'}
                          onBlur={e => e.currentTarget.style.borderColor = '#e2e8f0'}
                        />
                      </div>
                      <div>
                        <label style={{
                          display: 'block',
                          fontFamily: 'JetBrains Mono,monospace',
                          fontSize: 9,
                          color: '#64748b',
                          letterSpacing: '0.06em',
                          textTransform: 'uppercase',
                          marginBottom: 4,
                        }}>
                          Número
                        </label>
                        <input
                          value={it.numero}
                          onChange={e => update(i, 'numero', e.target.value)}
                          placeholder="Ej. 123"
                          style={inputSx}
                          onFocus={e => e.currentTarget.style.borderColor = '#059669'}
                          onBlur={e => e.currentTarget.style.borderColor = '#e2e8f0'}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                      <div>
                        <label style={{
                          display: 'block',
                          fontFamily: 'JetBrains Mono,monospace',
                          fontSize: 9,
                          color: '#64748b',
                          letterSpacing: '0.06em',
                          textTransform: 'uppercase',
                          marginBottom: 4,
                        }}>
                          Hora Inicio
                        </label>
                        <input
                          type="time"
                          value={it.horaInicio}
                          onChange={e => update(i, 'horaInicio', e.target.value)}
                          style={inputSx}
                          onFocus={e => e.currentTarget.style.borderColor = '#059669'}
                          onBlur={e => e.currentTarget.style.borderColor = '#e2e8f0'}
                        />
                      </div>
                      <div>
                        <label style={{
                          display: 'block',
                          fontFamily: 'JetBrains Mono,monospace',
                          fontSize: 9,
                          color: '#64748b',
                          letterSpacing: '0.06em',
                          textTransform: 'uppercase',
                          marginBottom: 4,
                        }}>
                          Hora Fin
                        </label>
                        <input
                          type="time"
                          value={it.horaFin}
                          onChange={e => update(i, 'horaFin', e.target.value)}
                          style={inputSx}
                          onFocus={e => e.currentTarget.style.borderColor = '#059669'}
                          onBlur={e => e.currentTarget.style.borderColor = '#e2e8f0'}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={addItem}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  fontFamily: 'JetBrains Mono,monospace',
                  fontSize: 10,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  padding: '8px 16px',
                  border: '1px dashed #cbd5e1',
                  background: 'transparent',
                  color: '#64748b',
                  cursor: 'pointer',
                  width: '100%',
                  justifyContent: 'center',
                  marginBottom: 24,
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#059669'; e.currentTarget.style.color = '#059669'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.color = '#64748b'; }}
              >
                <Plus size={14} />
                Agregar otra ubicación
              </button>

              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  disabled={pending}
                  onClick={() => { setOpen(false); reset() }}
                  style={{
                    fontFamily: 'Inter,sans-serif',
                    fontSize: 12,
                    padding: '8px 20px',
                    border: '1px solid #e2e8f0',
                    background: '#ffffff',
                    color: '#64748b',
                    cursor: 'pointer',
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={pending}
                  style={{
                    fontFamily: 'Inter,sans-serif',
                    fontSize: 12,
                    fontWeight: 600,
                    padding: '8px 20px',
                    border: 'none',
                    background: pending ? '#34d399' : '#059669',
                    color: '#ffffff',
                    cursor: pending ? 'not-allowed' : 'pointer',
                  }}
                >
                  {pending ? 'Enviando...' : 'Enviar a Monitorista'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
