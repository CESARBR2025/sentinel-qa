'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { X, Search, ShieldCheck } from 'lucide-react'
import type { UnidadParaDespacho } from '@/lib/flota/types'
import { UnidadCard, UnidadCardsStyles } from './UnidadCards'
import AsignacionMapa from './AsignacionMapa'
import { useResponsive } from '@/hooks/useResponsive'

// Modal de selección de unidades cercanas. Se monta vía createPortal directo en
// document.body (buena práctica general para modales: lo saca del árbol del acordeón
// del tablón, sin depender del posicionamiento de ancestros).
export function SeleccionarUnidadesModal({ unidades, seleccionadas, prioritarioNomina, incidenteLat, incidenteLng, prioritarioPatrullaId, incidenteId, incidentePrioridad, onConfirmar, onClose }: {
  unidades: UnidadParaDespacho[]
  seleccionadas: UnidadParaDespacho[]
  prioritarioNomina?: string | null
  incidenteLat?: number | null
  incidenteLng?: number | null
  prioritarioPatrullaId?: string | null
  incidenteId?: string | null
  incidentePrioridad?: string | null
  onConfirmar: (unidades: UnidadParaDespacho[]) => void
  onClose: () => void
}) {
  const [busqueda, setBusqueda] = useState('')
  const [seleccionLocal, setSeleccionLocal] = useState<UnidadParaDespacho[]>(seleccionadas)
  const [unidadesActuales, setUnidadesActuales] = useState(unidades)
  const overlayRef = useRef<HTMLDivElement>(null)

  const mostrarMapa = incidenteLat != null && incidenteLng != null
  const { esMovil } = useResponsive()

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)

    // Bloquea el scroll de la página de fondo mientras el modal está montado. Se toca
    // tanto <html> como <body> porque según el navegador el elemento que realmente
    // scrollea puede ser cualquiera de los dos — bloquear solo uno deja al otro libre.
    // overscrollBehavior además evita el "rebote" elástico (Safari/trackpad) que puede
    // sentirse como que la página de fondo se mueve aunque su scroll esté bloqueado.
    const htmlPrevio = { overflow: document.documentElement.style.overflow, overscrollBehavior: document.documentElement.style.overscrollBehavior }
    const bodyPrevio  = { overflow: document.body.style.overflow, overscrollBehavior: document.body.style.overscrollBehavior }
    document.documentElement.style.overflow = 'hidden'
    document.documentElement.style.overscrollBehavior = 'none'
    document.body.style.overflow = 'hidden'
    document.body.style.overscrollBehavior = 'none'

    return () => {
      document.removeEventListener('keydown', handler)
      document.documentElement.style.overflow = htmlPrevio.overflow
      document.documentElement.style.overscrollBehavior = htmlPrevio.overscrollBehavior
      document.body.style.overflow = bodyPrevio.overflow
      document.body.style.overscrollBehavior = bodyPrevio.overscrollBehavior
    }
  }, [onClose])

  useEffect(() => {
    if (!mostrarMapa) return;

    const params = new URLSearchParams()
    if (incidenteLat != null) params.set('lat', String(incidenteLat))
    if (incidenteLng != null) params.set('lng', String(incidenteLng))
    if (prioritarioPatrullaId) params.set('prioritarioPatrullaId', prioritarioPatrullaId)
    if (incidenteId) params.set('incidenteId', incidenteId)

    const fetchUnidades = () => {
      fetch(`/api/despacho/unidades-cercanas?${params.toString()}`)
        .then(res => res.json())
        .then((data: UnidadParaDespacho[]) => {
          setUnidadesActuales(data)
        })
        .catch(() => {})
    }

    fetchUnidades() // refresco inmediato al abrir el modal — no esperar el primer tick del interval

    const id = setInterval(fetchUnidades, 18_000)

    return () => clearInterval(id)
  }, [mostrarMapa, incidenteLat, incidenteLng, prioritarioPatrullaId, incidenteId])

  const filtradas = unidadesActuales.filter(u =>
    u.etiqueta.toLowerCase().includes(busqueda.toLowerCase()),
  )

  const masCercanaId = unidadesActuales.find(u => u.distanciaKm != null)?.id

  const toggle = (u: UnidadParaDespacho) => {
    if (u.ocupada) return
    setSeleccionLocal(prev => prev.find(x => x.id === u.id) ? prev.filter(x => x.id !== u.id) : [...prev, u])
  }

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose()
  }

  return createPortal(
    <div ref={overlayRef} onClick={handleOverlayClick} style={{
      position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.6)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000, padding: 16, backdropFilter: 'blur(2px)',
      overscrollBehavior: 'contain', overflow: 'hidden',
    }}>
      <div style={{
        background: '#fff', width: '100%', maxWidth: mostrarMapa ? 'min(1040px, 94vw)' : 640, maxHeight: '88vh',
        display: 'flex', flexDirection: 'column', borderRadius: 10, overflow: 'hidden',
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontFamily: 'Barlow Condensed,sans-serif', fontSize: 20, fontWeight: 700, textTransform: 'uppercase', color: '#0f172a' }}>
            <ShieldCheck size={20} color="#1f355a" />
            Unidades cercanas al hecho
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: 4, display: 'flex' }}>
            <X size={20} />
          </button>
        </div>

        {mostrarMapa ? (
          <div style={{ display: 'flex', flexDirection: esMovil ? 'column' : 'row', flex: 1, minHeight: 0 }}>
            <div style={esMovil ? { flexShrink: 0 } : { flex: '0 0 55%', minWidth: 0 }}>
              <AsignacionMapa
                unidades={unidadesActuales}
                incidenteLat={incidenteLat}
                incidenteLng={incidenteLng}
                seleccionadas={seleccionLocal.map(u => u.id)}
                onToggleUnidad={(id) => { const u = unidadesActuales.find(x => x.id === id); if (u) toggle(u) }}
                prioritarioPatrullaId={prioritarioPatrullaId}
                prioridad={incidentePrioridad}
                altura={esMovil ? 220 : 500}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', minHeight: 0, flex: 1 }}>
              <div style={{ padding: '16px 24px', borderBottom: '1px solid #f1f5f9' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 14px', border: '1px solid #e2e8f0', borderRadius: 6, background: '#f8fafc' }}>
                  <Search size={16} color="#94a3b8" />
                  <input
                    type="text"
                    placeholder="Buscar por número de unidad o placa..."
                    value={busqueda}
                    onChange={e => setBusqueda(e.target.value)}
                    autoFocus
                    style={{ border: 'none', background: 'transparent', outline: 'none', flex: 1, fontFamily: 'Inter,sans-serif', fontSize: 13, color: '#0f172a' }}
                  />
                  <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: '#94a3b8' }}>
                    {filtradas.length} de {unidadesActuales.length}
                  </span>
                </div>
              </div>
              <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', overscrollBehavior: 'contain', padding: '14px 24px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {filtradas.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: 40, fontFamily: 'Inter,sans-serif', fontSize: 13, color: '#94a3b8' }}>
                    No se encontraron unidades
                  </div>
                ) : (
                  filtradas.map(u => (
                    <UnidadCard
                      key={u.id}
                      unidad={u}
                      seleccionada={!!seleccionLocal.find(x => x.id === u.id)}
                      esMasCercana={u.id === masCercanaId}
                      prioritarioNomina={prioritarioNomina}
                      esPrioritaria={u.id === prioritarioPatrullaId}
                      onToggle={() => toggle(u)}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
        ) : (
          <>
            <div style={{ padding: '16px 24px', borderBottom: '1px solid #f1f5f9' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 14px', border: '1px solid #e2e8f0', borderRadius: 6, background: '#f8fafc' }}>
                <Search size={16} color="#94a3b8" />
                <input
                  type="text"
                  placeholder="Buscar por número de unidad o placa..."
                  value={busqueda}
                  onChange={e => setBusqueda(e.target.value)}
                  autoFocus
                  style={{ border: 'none', background: 'transparent', outline: 'none', flex: 1, fontFamily: 'Inter,sans-serif', fontSize: 13, color: '#0f172a' }}
                />
                <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: '#94a3b8' }}>
                  {filtradas.length} de {unidadesActuales.length}
                </span>
              </div>
            </div>
            <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', overscrollBehavior: 'contain', padding: '14px 24px', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {filtradas.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 40, fontFamily: 'Inter,sans-serif', fontSize: 13, color: '#94a3b8' }}>
                  No se encontraron unidades
                </div>
              ) : (
                filtradas.map(u => (
                  <UnidadCard
                    key={u.id}
                    unidad={u}
                    seleccionada={!!seleccionLocal.find(x => x.id === u.id)}
                    esMasCercana={u.id === masCercanaId}
                    prioritarioNomina={prioritarioNomina}
                    onToggle={() => toggle(u)}
                  />
                ))
              )}
            </div>
          </>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 10, padding: '16px 24px', borderTop: '1px solid #e2e8f0' }}>
          <span style={{ fontFamily: 'Inter,sans-serif', fontSize: 12, color: '#64748b' }}>
            {seleccionLocal.length} unidad{seleccionLocal.length !== 1 ? 'es' : ''} seleccionada{seleccionLocal.length !== 1 ? 's' : ''}
          </span>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={onClose} style={{ padding: '10px 20px', border: '1px solid #e2e8f0', borderRadius: 6, background: '#fff', cursor: 'pointer', fontFamily: 'Inter,sans-serif', fontSize: 13, color: '#475569' }}>
              Cancelar
            </button>
            <button onClick={() => onConfirmar(seleccionLocal)} style={{ padding: '10px 24px', border: 'none', borderRadius: 6, background: '#1f355a', color: '#fff', cursor: 'pointer', fontFamily: 'Inter,sans-serif', fontSize: 13, fontWeight: 600 }}>
              Confirmar selección
            </button>
          </div>
        </div>
      </div>

      <UnidadCardsStyles />
    </div>,
    document.body,
  )
}
