'use client'

import { useState } from 'react'
import { FormularioRecorrido } from '@/components/oficial/FormularioRecorrido'
import { AsignacionCard } from '@/components/oficial/navegacion/AsignacionCard'
import { NavegacionModal } from '@/components/oficial/navegacion/NavegacionModal'

interface Asignacion {
  folio: string
  descripcion?: string | null
  calle?: string | null
  colonia?: string | null
  tipoIncidente?: string | null
  prioridad?: string | null
  tipoEmergenciaId?: number | null
  tipoIncidenteId?: number | null
  prioridadId?: number | null
  latitud?: number | null
  longitud?: number | null
}

interface Props {
  estatusInicial: string
  incidenteId: string
  asignacion: Asignacion
  catalogos: any
  user: any
}

export function DespachoContent({ estatusInicial, incidenteId, asignacion, catalogos, user }: Props) {
  const [enSitio, setEnSitio] = useState(estatusInicial === 'en_sitio')
  const [modalAbierto, setModalAbierto] = useState(false)

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
          tipoEmergenciaId: asignacion.tipoEmergenciaId ?? undefined,
          tipoIncidenteId: asignacion.tipoIncidenteId ?? undefined,
          prioridadId: asignacion.prioridadId ?? undefined,
          latitud: asignacion.latitud ?? undefined,
          longitud: asignacion.longitud ?? undefined,
        }}
      />
    )
  }

  const direccion = [asignacion.calle, asignacion.colonia].filter(Boolean).join(', ') || null

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      <AsignacionCard
        folio={asignacion.folio}
        direccion={direccion}
        prioridad={asignacion.prioridad}
        onIniciar={() => setModalAbierto(true)}
      />

      {modalAbierto && (
        <NavegacionModal
          incidenteId={incidenteId}
          destino={{ lat: asignacion.latitud as number, lng: asignacion.longitud as number }}
          folio={asignacion.folio}
          direccion={direccion}
          prioridad={asignacion.prioridad}
          onAtender={() => {
            setModalAbierto(false)
            setEnSitio(true)
          }}
        />
      )}
    </div>
  )
}
