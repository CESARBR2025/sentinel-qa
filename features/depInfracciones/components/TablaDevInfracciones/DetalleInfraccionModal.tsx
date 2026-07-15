'use client'

export interface InfraccionDetalle {
  id: string
  folio: string
  estatus: string
  placa: string
  nombre_infractor: string
  [key: string]: unknown
}

interface DetalleInfraccionModalProps {
  isOpen: boolean
  onClose: () => void
  loading: boolean
  detalle: InfraccionDetalle | null
}

export function DetalleInfraccionModal({ isOpen, onClose, loading, detalle }: DetalleInfraccionModalProps) {
  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="w-full max-w-2xl bg-white rounded-xl border border-slate-200 shadow-xl">
        <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50 rounded-t-xl">
          <h3 className="text-sm font-medium tracking-wider uppercase text-slate-700">
            Detalle de infracción
          </h3>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors bg-slate-100 text-slate-500 hover:text-slate-600"
          >
            ✕
          </button>
        </div>
        <div className="p-5">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-6 h-6 border-2 border-slate-300 border-t-blue-700 rounded-full animate-spin" />
            </div>
          ) : detalle ? (
            <pre className="text-sm text-slate-700 whitespace-pre-wrap font-mono">
              {JSON.stringify(detalle, null, 2)}
            </pre>
          ) : (
            <p className="text-sm text-slate-400 text-center py-4">Sin datos</p>
          )}
        </div>
      </div>
    </div>
  )
}
