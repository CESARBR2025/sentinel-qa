'use client'

import { useState } from 'react'
import { HistorialIncidente } from '@/components/incidentes/HistorialIncidente'
import { MarcarEnSitioButton } from '@/components/oficial/MarcarEnSitioButton'
import { FormularioRecorrido } from '@/components/oficial/FormularioRecorrido'

interface Asignacion {
  folio: string
  descripcion?: string | null
  calle?: string | null
  colonia?: string | null
  tipoIncidente?: string | null
  prioridad?: string | null
}

interface Props {
  historial: any
  estatusInicial: string
  incidenteId: string
  asignacion: Asignacion
  catalogos: any
  user: any
}

export function DespachoContent({ historial, estatusInicial, incidenteId, asignacion, catalogos, user }: Props) {
  const [enSitio, setEnSitio] = useState(estatusInicial === 'en_sitio')

  if (enSitio) {
    return (
      <FormularioRecorrido
        embedded
        user={user}
        catalogos={catalogos}
        incidenteId={incidenteId}
        prefill={{
          folioCad: asignacion.folio,
          descripcion: asignacion.descripcion ?? undefined,
          calle: asignacion.calle ?? undefined,
          colonia: asignacion.colonia ?? undefined,
          tipoIncidente: asignacion.tipoIncidente ?? undefined,
          prioridad: asignacion.prioridad ?? undefined,
        }}
      />
    )
  }

  return (
    <div style={{ marginBottom: 24, marginTop: 24 }}>
      <HistorialIncidente historial={historial} />

      <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 16 }}>
        <span style={{
          fontFamily: 'JetBrains Mono,monospace', fontSize: 11, fontWeight: 700,
          padding: '4px 12px', borderRadius: 2,
          ...(estatusInicial === 'en_despacho'
            ? { background: '#eff1f3', color: '#1c3051', border: '1px solid #c3c8d2' }
            : { background: '#f8fafc', color: '#64748b', border: '1px solid #e2e8f0' }),
        }}>
          {estatusInicial === 'en_despacho' ? 'UNIDADES ASIGNADAS' : estatusInicial.toUpperCase()}
        </span>

        <MarcarEnSitioButton
          incidenteId={incidenteId}
          estatusActual={estatusInicial}
          onMarcado={() => setEnSitio(true)}
        />
      </div>
    </div>
  )
}
