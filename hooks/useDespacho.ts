'use client'
import { useState, useCallback } from 'react'

export interface VehiculoOption {
  id: number; placa: string; marca: string
  modelo: string; color: string; tipo: string; label: string
}

export interface EmpleadoResult {
  trabajadorId: string; nombre: string; puesto: string
  dependencia: string; estatus: string
}

export interface IncidentePendiente {
  id: string; folio: string; canal: string
  fechaHoraInicio: string; calle: string | null; colonia: string | null
  entreCalles: string | null; referenciaUbicacion: string | null
  descripcion: string | null; tipoIncidente: string | null
  prioridad: string | null; prioridadOrden: number | null
  capturadoPor: string | null
}

export interface DespachoDetalle {
  incidente: { id: string; folio: string; estatus: string }
  despacho: {
    id: string; incidenteId: string
    fechaHoraDespacho: string; despachadorNombre: string | null; creadoEn: string
    unidades:  { id: string; unidadExtId: string | null; unidadPlaca: string | null }[]
    elementos: { id: string; elementoExtId: string | null; elementoNomina: string | null; elementoNombre: string | null }[]
  }
}

export function useDespacho() {
  const [pendientes, setPendientes] = useState<IncidentePendiente[]>([])
  const [detalle,    setDetalle]    = useState<DespachoDetalle | null>(null)
  const [cargando,   setCargando]   = useState(false)
  const [error,      setError]      = useState<string | null>(null)

  const cargarPendientes = useCallback(async () => {
    setCargando(true); setError(null)
    try {
      const res = await fetch('/api/incidentes/pendientes-despacho')
      if (!res.ok) throw new Error((await res.json()).error ?? 'Error al cargar')
      setPendientes(await res.json())
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error desconocido')
    } finally {
      setCargando(false)
    }
  }, [])

  const cargarDespacho = useCallback(async (incidenteId: string) => {
    setCargando(true); setError(null); setDetalle(null)
    try {
      const res = await fetch(`/api/incidentes/${incidenteId}/despacho`)
      if (res.status === 404) { setError((await res.json()).error); return }
      if (!res.ok) throw new Error((await res.json()).error ?? 'Error al cargar')
      setDetalle(await res.json())
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error desconocido')
    } finally {
      setCargando(false)
    }
  }, [])

  const limpiar = useCallback(() => {
    setPendientes([]); setDetalle(null); setError(null)
  }, [])

  return { pendientes, detalle, cargando, error, cargarPendientes, cargarDespacho, limpiar }
}