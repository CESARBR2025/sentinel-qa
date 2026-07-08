'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { reactivarOficialConDatos } from '@/lib/admin-transito/actions'
import { CheckCircle, Search, Car, X } from 'lucide-react'

import type { PatrullaAsignacion } from '@/lib/flota/types'

interface Departamento {
  id: string
  clave: string
  nombre: string
}

interface Props {
  oficialId: string
  userId: string
  oficialNombre: string
  noNomina: string | null
  telefono: string | null
  departamentoId: string | null
  patrullaId: string | null
  deptos: Departamento[]
  patrullas: PatrullaAsignacion[]
  onClose: () => void
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontFamily: 'JetBrains Mono,monospace',
  fontSize: 10,
  color: '#64748b',
  letterSpacing: '0.15em',
  textTransform: 'uppercase',
  marginBottom: 8,
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 14px',
  background: '#ffffff',
  border: '1px solid #e2e8f0',
  color: '#1e293b',
  fontFamily: 'Inter,sans-serif',
  fontSize: 13,
  outline: 'none',
  boxSizing: 'border-box',
}

const selectStyle: React.CSSProperties = {
  ...inputStyle,
  cursor: 'pointer',
}

function PatrullaSelect({ patrullas, defaultValue }: { patrullas: PatrullaAsignacion[]; defaultValue?: string }) {
  const [tempId, setTempId] = useState(defaultValue ?? '')
  const [modalOpen, setModalOpen] = useState(false)
  const [busqueda, setBusqueda] = useState('')
  const overlayRef = useRef<HTMLDivElement>(null)

  const filtradas = patrullas.filter(
    (p) =>
      p.numero_unidad.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.descripcion.toLowerCase().includes(busqueda.toLowerCase()),
  )

  const selected = patrullas.find((p) => p.id === tempId)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setModalOpen(false)
    }
    if (!modalOpen) return
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [modalOpen])

  function handleOverlayClick(e: React.MouseEvent) {
    if (e.target === overlayRef.current) setModalOpen(false)
  }

  return (
    <>
      <input type="hidden" name="patrullaId" value={tempId} />
      <button
        type="button"
        onClick={() => setModalOpen(true)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          padding: '10px 14px',
          background: tempId ? '#eff6ff' : '#ffffff',
          border: tempId ? '1px solid #bfdbfe' : '1px solid #e2e8f0',
          color: tempId ? '#1e40af' : '#94a3b8',
          fontFamily: 'Inter,sans-serif',
          fontSize: 13,
          cursor: 'pointer',
          outline: 'none',
          boxSizing: 'border-box',
          textAlign: 'left',
          transition: 'all 0.15s ease',
        }}
      >
        <span>{selected ? `${selected.numero_unidad} — ${selected.descripcion}` : '— Sin asignar —'}</span>
        <Car size={14} color={tempId ? '#2563eb' : '#94a3b8'} />
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
            zIndex: 10000,
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
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: 4, display: 'flex' }}
              >
                <X size={20} />
              </button>
            </div>

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
                <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: '#94a3b8' }}>
                  {filtradas.length} de {patrullas.length}
                </span>
              </div>
            </div>

            <div style={{ flex: 1, overflow: 'auto', padding: '8px 16px' }}>
              {filtradas.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 40, fontFamily: 'Inter,sans-serif', fontSize: 13, color: '#94a3b8' }}>
                  No se encontraron unidades
                </div>
              ) : (
                filtradas.map((p) => {
                  const esSeleccionada = tempId === p.id
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => { setTempId(p.id); setModalOpen(false) }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 14,
                        width: '100%',
                        padding: '14px 16px',
                        border: esSeleccionada ? '1px solid #2563eb' : '1px solid transparent',
                        background: esSeleccionada ? '#eff6ff' : 'transparent',
                        cursor: 'pointer',
                        textAlign: 'left',
                        borderRadius: 4,
                        marginBottom: 4,
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <div
                        style={{
                          width: 18,
                          height: 18,
                          borderRadius: '50%',
                          border: esSeleccionada ? '5px solid #2563eb' : '2px solid #cbd5e1',
                          flexShrink: 0,
                          transition: 'all 0.15s ease',
                        }}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 12, fontWeight: 600, color: '#0f172a', marginBottom: 2 }}>
                          {p.numero_unidad}
                        </div>
                        <div style={{ fontFamily: 'Inter,sans-serif', fontSize: 12, color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {p.descripcion}
                        </div>
                      </div>
                    </button>
                  )
                })
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default function ModalReactivarOficial({
  oficialId,
  userId,
  oficialNombre,
  noNomina,
  telefono,
  departamentoId,
  patrullaId,
  deptos,
  patrullas,
  onClose,
}: Props) {
  const overlayRef = useRef<HTMLDivElement>(null)

  const handleOverlayClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === overlayRef.current) onClose()
    },
    [onClose],
  )

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(15,23,42,0.6)',
        backdropFilter: 'blur(2px)',
        padding: 16,
      }}
    >
      <div
        style={{
          background: '#fff',
          width: 520,
          maxWidth: '100%',
          maxHeight: '90vh',
          overflow: 'auto',
          border: '1px solid #e2e8f0',
          position: 'relative',
        }}
      >
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: '#16a34a' }} />

        <form action={reactivarOficialConDatos} style={{ padding: 32 }}>
          <input type="hidden" name="oficialId" value={oficialId} />
          <input type="hidden" name="userId" value={userId} />

          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              background: '#f0fdf4',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 20,
            }}
          >
            <CheckCircle size={24} color="#16a34a" strokeWidth={1.5} />
          </div>

          <h3
            style={{
              fontFamily: 'Barlow Condensed,sans-serif',
              fontSize: 22,
              fontWeight: 800,
              textTransform: 'uppercase',
              color: '#0f172a',
              margin: '0 0 4px 0',
            }}
          >
            Reactivar: {oficialNombre}
          </h3>
          <p
            style={{
              fontFamily: 'Inter,sans-serif',
              fontSize: 12,
              color: '#64748b',
              margin: '0 0 24px 0',
            }}
          >
            Revise y actualice los datos antes de reactivar al oficial.
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 16,
              marginBottom: 16,
            }}
          >
            <div>
              <label style={labelStyle}>No. Nómina</label>
              <input
                name="noNomina"
                defaultValue={noNomina ?? ''}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Teléfono</label>
              <input
                name="telefono"
                defaultValue={telefono ?? ''}
                style={inputStyle}
              />
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 16,
              marginBottom: 24,
            }}
          >
            <div>
              <label style={labelStyle}>Departamento</label>
              <select
                name="departamentoId"
                style={selectStyle}
                defaultValue={departamentoId ?? ''}
              >
                <option value="">— Seleccionar —</option>
                {deptos.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.nombre}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Unidad / Patrulla</label>
              <PatrullaSelect
                patrullas={patrullas}
                defaultValue={patrullaId ?? undefined}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '10px 20px',
                background: '#f1f5f9',
                color: '#475569',
                fontFamily: 'Barlow Condensed,sans-serif',
                fontWeight: 700,
                fontSize: 13,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                border: '1px solid #e2e8f0',
                cursor: 'pointer',
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              style={{
                padding: '10px 24px',
                background: '#16a34a',
                color: '#fff',
                fontFamily: 'Barlow Condensed,sans-serif',
                fontWeight: 700,
                fontSize: 13,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Reactivar Oficial
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
