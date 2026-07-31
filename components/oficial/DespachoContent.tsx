'use client'

import { useState } from 'react'
import { HistorialIncidente } from '@/components/incidentes/HistorialIncidente'
import { MarcarEnCaminoButton } from '@/components/oficial/MarcarEnCaminoButton'
import { MarcarEnSitioButton } from '@/components/oficial/MarcarEnSitioButton'
import { FormularioRecorrido } from '@/components/oficial/FormularioRecorrido'
import { NavegacionDespacho } from '@/components/oficial/navegacion/NavegacionDespacho'

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
  historial: any
  estatusInicial: string
  incidenteId: string
  asignacion: Asignacion
  catalogos: any
  user: any
}

export function DespachoContent({ historial, estatusInicial, incidenteId, asignacion, catalogos, user }: Props) {
  const [enSitio, setEnSitio] = useState(estatusInicial === 'en_sitio')
  const unidadesDespacho: { horaSalida?: string | null }[] = historial?.despacho?.unidades ?? []
  const [yaSalio, setYaSalio] = useState(unidadesDespacho.some(u => u.horaSalida))

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

  const tieneCoordenadas = asignacion.latitud != null && asignacion.longitud != null

  return (
    <div style={{ marginBottom: 24, marginTop: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <HistorialIncidente historial={historial} />

      {tieneCoordenadas ? (
        <div style={{ flex: 1, minHeight: 480, border: '1px solid #e2e8f0', borderRadius: 2, overflow: 'hidden' }}>
          <NavegacionDespacho
            incidenteId={incidenteId}
            destino={{ lat: asignacion.latitud as number, lng: asignacion.longitud as number }}
            folio={asignacion.folio}
            direccion={[asignacion.calle, asignacion.colonia].filter(Boolean).join(', ') || null}
            prioridad={asignacion.prioridad}
            onLlegada={() => setEnSitio(true)}
          />
        </div>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{
            fontFamily: 'JetBrains Mono,monospace', fontSize: 11, fontWeight: 700,
            padding: '4px 12px', borderRadius: 2,
            background: '#eff1f3', color: '#1c3051', border: '1px solid #c3c8d2',
          }}>
            SIN COORDENADAS — REGISTRO MANUAL
          </span>
          <MarcarEnCaminoButton incidenteId={incidenteId} estatusActual={estatusInicial} yaSalio={yaSalio} onMarcado={() => setYaSalio(true)} />
          <MarcarEnSitioButton incidenteId={incidenteId} estatusActual={estatusInicial} onMarcado={() => setEnSitio(true)} />
        </div>
      )}
    </div>
  )
}
