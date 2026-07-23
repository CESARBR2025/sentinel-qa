'use client'

import { useState, useEffect } from 'react'
import { Shield, CheckCircle2, Loader2, User, Truck, Calendar, X, AlertCircle } from 'lucide-react'
import { obtenerDetalleInfraccionInfracciones, liberarGarantiaInfraccionesAction } from '@/lib/agente_infracciones/actions'
import type { ViaInfraccionDetalle } from '@/lib/agente_infracciones/types'

interface Props {
  infraccionId: string
  onSuccess: () => void
  onClose: () => void
}

function getGarantiaInfo(g: string | null | undefined, placa: string | undefined): { label: string; desc: string; entregada: boolean } {
  if (!g || g === 'NO_DATA') return { label: 'No especificada', desc: 'No se retuvo ninguna garantía', entregada: false }
  if (g === 'true') return { label: 'Garantía entregada', desc: 'La garantía fue entregada previamente', entregada: true }
  if (g === 'PLACA') return { label: 'Placa del vehículo', desc: `Placa ${placa || 'no registrada'}`, entregada: false }
  if (g === 'TRJ_CIRCULACION') return { label: 'Tarjeta de circulación', desc: 'Tarjeta de circulación retenida', entregada: false }
  return { label: g, desc: '', entregada: false }
}

export default function ModalEntregarGarantia({ infraccionId, onSuccess, onClose }: Props) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [detalle, setDetalle] = useState<ViaInfraccionDetalle | null>(null)

  useEffect(() => {
    obtenerDetalleInfraccionInfracciones(infraccionId).then(res => {
      if (res.error || !res.data) {
        setError(res.error || 'No se encontró la infracción')
      } else {
        setDetalle(res.data)
      }
    }).catch(() => setError('Error al cargar datos')).finally(() => setLoading(false))
  }, [infraccionId])

  const [liberando, setLiberando] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const handleLiberar = async () => {
    setLiberando(true)
    setSubmitError('')
    try {
      const result = await liberarGarantiaInfraccionesAction(infraccionId)
      if (!result.success) throw new Error(result.error || 'Error al liberar garantía')
      onSuccess()
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error al liberar garantía'
      setSubmitError(msg)
    } finally {
      setLiberando(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="w-full max-w-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="bg-white rounded-lg shadow-2xl border border-slate-200 overflow-hidden">
          {/* ─── Header ─── */}
          <div className="bg-primary-muted px-5 py-3.5 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-md flex items-center justify-center bg-primary">
                <Shield size={13} strokeWidth={2.5} className="text-white" />
              </div>
              <div>
                <h3 className="text-sm text-primary tracking-wider uppercase font-semibold" style={{ fontFamily: "'Barlow Condensed',sans-serif" }}>
                  Devolver garantía
                </h3>
                <p className="text-[10px] text-slate-500 mt-0.5" style={{ fontFamily: "'JetBrains Mono',monospace" }}>
                  {detalle ? `Folio ${detalle.Header.folio_de_infraccion}` : 'Cargando...'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              disabled={liberando}
              className="w-7 h-7 rounded-md flex items-center justify-center transition-colors bg-white border border-slate-200 text-slate-400 hover:text-slate-600 disabled:opacity-50"
            >
              <X size={14} strokeWidth={2.5} />
            </button>
          </div>

          {/* ─── Body ─── */}
          <div className="p-5" style={{ fontFamily: "'Inter',sans-serif" }}>
            {loading ? (
              <div className="flex flex-col items-center gap-4 py-8 text-center">
                <Loader2 size={24} className="animate-spin text-primary" />
                <p className="text-sm font-medium text-slate-500">Cargando datos de la infracción…</p>
              </div>
            ) : error && !detalle ? (
              <div className="flex flex-col items-center gap-3 py-8 text-center">
                <AlertCircle size={22} strokeWidth={1.5} className="text-red-400" />
                <p className="text-sm font-medium text-red-600">{error}</p>
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-md text-[13px] font-medium text-slate-600 border border-slate-200 hover:bg-slate-50 transition-colors"
                >
                  Cerrar
                </button>
              </div>
            ) : detalle ? (
              <div className="space-y-4">
                {/* Garantía */}
                {(() => {
                  const info = getGarantiaInfo(detalle.garantia?.garantia_retenida, detalle.vehiculo?.placa)
                  const isDelivered = info.entregada
                  return (
                    <div
                      className={`rounded-lg p-4 border-2 ${isDelivered ? 'bg-slate-50 border-slate-200' : 'bg-green-50 border-green-200'}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="min-w-0">
                          <p className="text-[11px] font-semibold tracking-wider uppercase text-primary mb-1" style={{ fontFamily: "'JetBrains Mono',monospace" }}>
                            {isDelivered ? 'Garantía entregada' : 'Garantía retenida'}
                          </p>
                          <p className="text-base font-semibold text-slate-900 break-words">{info.label}</p>
                          {info.desc && (
                            <p className="text-xs text-slate-500 mt-0.5">{info.desc}</p>
                          )}
                        </div>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ml-3 ${isDelivered ? 'bg-slate-100' : 'bg-green-100'}`}>
                          <CheckCircle2 size={20} strokeWidth={2} className={isDelivered ? 'text-slate-400' : 'text-green-500'} />
                        </div>
                      </div>
                    </div>
                  )
                })()}

                {/* Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg p-3.5 border border-slate-200 bg-primary-muted">
                    <div className="flex items-center gap-2 mb-1.5">
                      <User size={12} strokeWidth={2} className="text-primary" />
                      <span className="text-[10px] font-semibold tracking-wider uppercase text-slate-500" style={{ fontFamily: "'JetBrains Mono',monospace" }}>Infractor</span>
                    </div>
                    <p className="text-sm font-medium text-slate-900">{detalle.datos_infractor.nombre_infractor || '—'}</p>
                    {detalle.datos_infractor.curp_infractor && (
                      <p className="text-[11px] text-slate-500 font-mono mt-0.5">{detalle.datos_infractor.curp_infractor}</p>
                    )}
                  </div>

                  <div className="rounded-lg p-3.5 border border-slate-200 bg-primary-muted">
                    <div className="flex items-center gap-2 mb-1.5">
                      <Truck size={12} strokeWidth={2} className="text-primary" />
                      <span className="text-[10px] font-semibold tracking-wider uppercase text-slate-500" style={{ fontFamily: "'JetBrains Mono',monospace" }}>Vehículo</span>
                    </div>
                    <p className="text-sm font-medium text-slate-900">{detalle.vehiculo?.placa || '—'}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {detalle.vehiculo?.marca} {detalle.vehiculo?.modelo} {detalle.vehiculo?.anio}
                    </p>
                  </div>

                  <div className="rounded-lg p-3.5 border border-slate-200 bg-primary-muted">
                    <div className="flex items-center gap-2 mb-1.5">
                      <Calendar size={12} strokeWidth={2} className="text-primary" />
                      <span className="text-[10px] font-semibold tracking-wider uppercase text-slate-500" style={{ fontFamily: "'JetBrains Mono',monospace" }}>Fecha infracción</span>
                    </div>
                    <p className="text-sm font-medium text-slate-900">
                      {new Date(detalle.Header.fecha_de_registro_de_infraccion).toLocaleDateString('es-MX', {
                        day: 'numeric', month: 'long', year: 'numeric',
                      })}
                    </p>
                  </div>

                  <div className="rounded-lg p-3.5 border border-slate-200 bg-primary-muted">
                    <div className="flex items-center gap-2 mb-1.5">
                      <Shield size={12} strokeWidth={2} className="text-primary" />
                      <span className="text-[10px] font-semibold tracking-wider uppercase text-slate-500" style={{ fontFamily: "'JetBrains Mono',monospace" }}>Estatus</span>
                    </div>
                    <p className="text-sm font-medium text-slate-900">{detalle.Header.estatus_de_infraccion}</p>
                  </div>
                </div>

                {/* Error */}
                {submitError && (
                  <div className="flex items-start gap-2 p-2.5 rounded-md bg-red-50 border border-red-200" role="alert">
                    <AlertCircle size={12} className="text-red-600 shrink-0 mt-0.5" />
                    <p className="text-[11px] font-medium text-red-600">{submitError}</p>
                  </div>
                )}

                <p className="text-xs text-slate-500 leading-relaxed">
                  Al confirmar, la garantía será liberada y la infracción pasará a estatus{' '}
                  <strong className="text-slate-900 font-medium">Finalizada</strong>. Este proceso es irreversible.
                </p>
              </div>
            ) : null}
          </div>

          {/* ─── Footer ─── */}
          {detalle && (
            <div className="bg-primary-muted px-5 py-3.5 border-t border-slate-200 flex items-center justify-between">
              <span className="text-[10px] text-slate-400 font-mono">ID: {detalle.Header.id_infraccion}</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={onClose}
                  disabled={liberando}
                  className="px-4 py-2 rounded-md text-[13px] font-medium border border-slate-200 text-slate-600 bg-white hover:bg-slate-50 transition-colors duration-150 disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleLiberar}
                  disabled={liberando}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-md text-[13px] font-medium text-white bg-green-500 hover:bg-green-600 active:bg-green-700 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                >
                  {liberando ? (
                    <><Loader2 size={14} className="animate-spin" /><span>Liberando…</span></>
                  ) : (
                    <><CheckCircle2 size={14} strokeWidth={2.5} /><span>Confirmar devolución</span></>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
