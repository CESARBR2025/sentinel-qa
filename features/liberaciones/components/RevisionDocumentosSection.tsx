'use client'

interface RevisionDocumentosSectionProps {
  infraccionId: string
  onValidated: () => void
}

export default function RevisionDocumentosSection({ infraccionId, onValidated }: RevisionDocumentosSectionProps) {
  return (
    <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-card">
      <h3 className="text-sm font-medium tracking-wider uppercase text-slate-600 mb-4">
        Revisión de documentos — {infraccionId}
      </h3>
      <button
        onClick={onValidated}
        className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-white bg-blue-700 hover:bg-blue-800 transition-colors"
      >
        Validar documentos
      </button>
    </div>
  )
}
