'use client'
import { useState, useCallback } from 'react'

export interface ReporteCampoDetalle {
  incidente: { id: string; folio: string; estatus: string }
  reporte: {
    id: string; incidenteId: string
    contenidoReporte:        string | null
    lugarCalle:              string | null
    lugarColonia:            string | null
    lugarEntreCalles:        string | null
    lugarReferencia:         string | null
    datosPositivosNegativos: string | null
    accionesRealizadas:      string | null
    hayDetencion:            boolean
    nombreDetenidos:         string | null
    autoridadRecibe:         string | null
    expedienteCi:            string | null
    delitoFalta:             string | null
    montoRobo:               number | null
    objetosRecuperados:      string | null
    vehiculosRecuperados:    string | null
    tipoVehiculo:            string | null
    destinoVehiculo:         string | null
    hayCateo:                boolean
    domicilioCateado:        string | null
    resultadoCateo:          string | null
    policiaCargo:            string | null
    personalIngresoCi:       string | null
    capturadoPorNombre:      string | null
    creadoEn:                string
  }
}

export function useReporteCampo() {
  const [data,     setData]     = useState<ReporteCampoDetalle | null>(null)
  const [cargando, setCargando] = useState(false)
  const [error,    setError]    = useState<string | null>(null)

  const cargar = useCallback(async (incidenteId: string) => {
    setCargando(true); setError(null); setData(null)
    try {
      const res = await fetch(`/api/incidentes/${incidenteId}/reporte`)
      if (res.status === 404) { setError((await res.json()).error); return }
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