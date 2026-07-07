'use client'

import { useState, useRef, useEffect } from 'react'
import { X, Search, Car, Check } from 'lucide-react'
import type { PatrullaAsignacion } from '@/lib/flota/types'

interface Props {
  patrullas: PatrullaAsignacion[]
  defaultValue?: string
}

export default function PatrullaSelector({ patrullas, defaultValue }: Props) {
  const [selectedId, setSelectedId] = useState(defaultValue ?? '')
  const [selectedLabel, setSelectedLabel] = useState(() => {
    if (!defaultValue) return ''
    const found = patrullas.find((p) => p.id === defaultValue)
    return found ? `${found.numero_unidad} — ${found.descripcion}` : ''
  })
  const [modalOpen, setModalOpen] = useState(false)
  const [busqueda, setBusqueda] = useState('')
  const [tempId, setTempId] = useState(selectedId)
  const overlayRef = useRef<HTMLDivElement>(null)

  const filtradas = patrullas.filter(
    (p) =>
      p.numero_unidad.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.descripcion.toLowerCase().includes(busqueda.toLowerCase()),
  )

  useEffect(() => {
    if (!modalOpen) {
      setBusqueda('')
      setTempId(selectedId)
    }
  }, [modalOpen, selectedId])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setModalOpen(false)
    }
    if (!modalOpen) return
    document.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
    }
  }, [modalOpen])

  function handleOverlayClick(e: React.MouseEvent) {
    if (e.target === overlayRef.current) setModalOpen(false)
  }

  function handleConfirm() {
    if (!tempId) return
    const found = patrullas.find((p) => p.id === tempId)
    setSelectedId(tempId)
    setSelectedLabel(found ? `${found.numero_unidad} — ${found.descripcion}` : '')
    setModalOpen(false)
  }

  return (
    <>
      <input type="hidden" name="patrullaId" value={selectedId} />

      <button
        type="button"
        onClick={() => setModalOpen(true)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          padding: '10px 14px',
          background: selectedLabel ? '#eff6ff' : '#ffffff',
          border: selectedLabel ? '1px solid #bfdbfe' : '1px solid #e2e8f0',
          color: selectedLabel ? '#1e40af' : '#94a3b8',
          fontFamily: 'Inter,sans-serif',
          fontSize: 13,
          cursor: 'pointer',
          outline: 'none',
          boxSizing: 'border-box',
          textAlign: 'left',
          transition: 'all 0.15s ease',
        }}
        onMouseEnter={(e) => {
          if (!selectedLabel) e.currentTarget.style.borderColor = '#2563eb'
        }}
        onMouseLeave={(e) => {
          if (!selectedLabel) e.currentTarget.style.borderColor = '#e2e8f0'
        }}
      >
        <span>{selectedLabel || '— Sin asignar —'}</span>
        <Car size={14} color={selectedLabel ? '#2563eb' : '#94a3b8'} />
      </button>

      {modalOpen && (
        <div
          ref={overlayRef}
          onClick={handleOverlayClick}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15,23,42,0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: 16,
            backdropFilter: 'blur(2px)',
          }}
        >
          <div
            style={{
              background: '#fff',
              width: '100%',
              maxWidth: 560,
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
            }}
          >
            {/* Header */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '20px 24px',
                borderBottom: '1px solid #e2e8f0',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  fontFamily: 'Barlow Condensed,sans-serif',
                  fontSize: 20,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  color: '#0f172a',
                }}
              >
                <Car size={20} color="#2563eb" />
                Seleccionar Unidad
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#94a3b8',
                  padding: 4,
                  display: 'flex',
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Search */}
            <div style={{ padding: '16px 24px', borderBottom: '1px solid #f1f5f9' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '8px 14px',
                  border: '1px solid #e2e8f0',
                  background: '#f8fafc',
                }}
              >
                <Search size={16} color="#94a3b8" />
                <input
                  type="text"
                  placeholder="Buscar por placa, marca o modelo..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  autoFocus
                  style={{
                    border: 'none',
                    background: 'transparent',
                    outline: 'none',
                    flex: 1,
                    fontFamily: 'Inter,sans-serif',
                    fontSize: 13,
                    color: '#0f172a',
                  }}
                />
                <span
                  style={{
                    fontFamily: 'JetBrains Mono,monospace',
                    fontSize: 9,
                    color: '#94a3b8',
                  }}
                >
                  {filtradas.length} de {patrullas.length}
                </span>
              </div>
            </div>

            {/* List */}
            <div style={{ flex: 1, overflow: 'auto', padding: '8px 16px' }}>
              {filtradas.length === 0 ? (
                <div
                  style={{
                    textAlign: 'center',
                    padding: 40,
                    fontFamily: 'Inter,sans-serif',
                    fontSize: 13,
                    color: '#94a3b8',
                  }}
                >
                  No se encontraron unidades
                </div>
              ) : (
                filtradas.map((p) => {
                  const esSeleccionada = tempId === p.id
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setTempId(p.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 14,
                        width: '100%',
                        padding: '14px 16px',
                        border: esSeleccionada
                          ? '1px solid #2563eb'
                          : '1px solid transparent',
                        background: esSeleccionada ? '#eff6ff' : 'transparent',
                        cursor: 'pointer',
                        textAlign: 'left',
                        borderRadius: 4,
                        marginBottom: 4,
                        transition: 'all 0.15s ease',
                      }}
                      onMouseEnter={(e) => {
                        if (!esSeleccionada)
                          e.currentTarget.style.background = '#f8fafc'
                      }}
                      onMouseLeave={(e) => {
                        if (!esSeleccionada)
                          e.currentTarget.style.background = 'transparent'
                      }}
                    >
                      <div
                        style={{
                          width: 18,
                          height: 18,
                          borderRadius: '50%',
                          border: esSeleccionada
                            ? '5px solid #2563eb'
                            : '2px solid #cbd5e1',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          transition: 'all 0.15s ease',
                        }}
                      >
                        {esSeleccionada && <Check size={10} color="#fff" />}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            fontFamily: 'JetBrains Mono,monospace',
                            fontSize: 12,
                            fontWeight: 600,
                            color: '#0f172a',
                            marginBottom: 2,
                          }}
                        >
                          {p.numero_unidad}
                        </div>
                        <div
                          style={{
                            fontFamily: 'Inter,sans-serif',
                            fontSize: 12,
                            color: '#64748b',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {p.descripcion}
                        </div>
                      </div>
                      {esSeleccionada && (
                        <span
                          style={{
                            fontFamily: 'JetBrains Mono,monospace',
                            fontSize: 8,
                            color: '#2563eb',
                            letterSpacing: '0.1em',
                            fontWeight: 600,
                          }}
                        >
                          SELECCIONADA
                        </span>
                      )}
                    </button>
                  )
                })
              )}
            </div>

            {/* Actions */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: 10,
                padding: '16px 24px',
                borderTop: '1px solid #e2e8f0',
              }}
            >
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                style={{
                  padding: '10px 20px',
                  border: '1px solid #e2e8f0',
                  background: '#fff',
                  cursor: 'pointer',
                  fontFamily: 'Inter,sans-serif',
                  fontSize: 13,
                  color: '#475569',
                }}
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                disabled={!tempId}
                style={{
                  padding: '10px 24px',
                  border: 'none',
                  background: !tempId ? '#94a3b8' : '#2563eb',
                  color: '#fff',
                  cursor: !tempId ? 'not-allowed' : 'pointer',
                  fontFamily: 'Inter,sans-serif',
                  fontSize: 13,
                  fontWeight: 600,
                  opacity: !tempId ? 0.6 : 1,
                }}
              >
                Seleccionar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
