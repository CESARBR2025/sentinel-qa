'use client'
import { useState, useCallback } from 'react'

export interface IncidenteResumen {
  id: string; folio: string; canal: string; tipoReporte: string
  estatus: string; fechaHoraInicio: string; colonia: string | null
  tipoIncidente: string | null; prioridad: string | null; capturadoPor: string | null
}

interface Filtros {
  canal?: string; estatus?: string; desde?: string; hasta?: string; folio?: string
}

export function useIncidentes() {
  const [data,     setData]     = useState<IncidenteResumen[]>([])
  const [cargando, setCargando] = useState(false)
  const [error,    setError]    = useState<string | null>(null)

  const buscar = useCallback(async (filtros: Filtros = {}) => {
    setCargando(true); setError(null)
    try {
      const params = new URLSearchParams()
      Object.entries(filtros).forEach(([k, v]) => { if (v) params.set(k, v) })
      const res = await fetch(`/api/incidentes?${params}`)
      if (!res.ok) throw new Error((await res.json()).error ?? 'Error al cargar')
      setData(await res.json())
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error desconocido')
    } finally {
      setCargando(false)
    }
  }, [])

  return { data, cargando, error, buscar }
}