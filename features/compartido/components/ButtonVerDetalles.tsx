'use client'

import { Eye } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface BotonVerDetalleProps {
  idInfraccion: string
  basePath?: string
}

export function BotonVerDetalle({ idInfraccion, basePath = '/agente_liberaciones/revision-documental' }: BotonVerDetalleProps) {
  const router = useRouter()

  return (
    <button
      onClick={() => router.push(`${basePath}/${idInfraccion}`)}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-md hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm"
    >
      <Eye size={14} className="text-slate-400" />
      Ver detalle
    </button>
  )
}
