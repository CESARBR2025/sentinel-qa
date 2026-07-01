'use client'

interface CapturarInfractorSectionProps {
  infraccionId: string
  onSuccess: () => void
}

export default function CapturarInfractorSection({ infraccionId, onSuccess }: CapturarInfractorSectionProps) {
  return (
    <div className="text-sm text-slate-600">
      <p>Captura de datos del infractor — ID: {infraccionId}</p>
      <button
        onClick={onSuccess}
        className="mt-3 inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-white bg-orange-500 hover:bg-orange-600 transition-colors"
      >
        Marcar como completado
      </button>
    </div>
  )
}
