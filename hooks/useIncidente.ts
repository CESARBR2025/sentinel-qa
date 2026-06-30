'use client'
import { useState, useCallback } from 'react'

export interface IncidenteDetalle {
  id: string; folio: string; canal: string; tipoReporte: string; estatus: string
  nombreReportante: string | null; anonimo: boolean; sexo: string | null; edad: number | null
  esUsuarioFrecuente: boolean; esPersonaAfectada: boolean; esMigrante: boolean
  calle: string | null; colonia: string | null; entreCalles: string | null
  referenciaUbicacion: string | null; municipio: string
  descripcion: string | null; observaciones: string | null
  fechaHoraInicio: string; fechaHoraFin: string | null
  grupoWhatsapp: string | null; nombreOficial: string | null; requiereDespacho: boolean
  tipoIncidente: string | null; tipoEmergencia: string | null
  prioridad: string | null; medioCanalizacion: string | null
  capturadoPorNombre: string | null; creadoEn: string
  personasAfectadas: { id: string; nombre: string | null; sexo: string | null; edad: number | null }[]
  despacho:      Record<string, unknown> | null
  reporteCampo:  Record<string, unknown> | null
  extorsion:     Record<string, unknown> | null
  alarmaEscolar: Record<string, unknown> | null
}

export function useIncidente() {
  const [data,     setData]     = useState<IncidenteDetalle | null>(null)
  const [cargando, setCargando] = useState(false)
  const [error,    setError]    = useState<string | null>(null)

  const cargar = useCallback(async (id: string) => {
    setCargando(true); setError(null); setData(null)
    try {
      const res = await fetch(`/api/incidentes/${id}`)
      if (res.status === 404) { setError('Incidente no encontrado'); return }
      if (!res.ok) throw new Error((await res.json()).error ?? 'Error al cargar')
      setData(await res.json())
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error desconocido')
    } finally {
      setCargando(false)
    }
  }, [])

  const limpiar = useCallback(() => { setData(null); setError(null) }, [])

  return { data, cargando, error, cargar, limpiar }
}