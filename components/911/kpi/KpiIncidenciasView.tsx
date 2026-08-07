'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { AlertTriangle, MapPin, Flame } from 'lucide-react'
type VistaMapa = 'puntos' | 'calor'
import type { KpiGeoResponse, IncidenteGeo, KpiIncidencias } from '@/lib/incidentes/types'
import { FiltrosRangoKpi, type FiltrosKpi, type CatalogoSimple } from './FiltrosRangoKpi'
import { MapaPuntosIncidencias } from './MapaPuntosIncidencias'
import { MapaCalorIncidencias } from './MapaCalorIncidencias'
import { TablaIncidencias } from './TablaIncidencias'
import { ModalDetalleIncidencia } from './ModalDetalleIncidencia'
import { KpiResumen } from './KpiResumen'
import { ColoniasCalientes } from './ColoniasCalientes'
import { Skeletons, EstadoVacio } from './EstadosVista'

const RANGO_DEFAULT_MS = 24 * 60 * 60 * 1000
const RANGO_SIETE_DIAS_MS = 7 * 24 * 60 * 60 * 1000
const ALTURA_MAPA = 520

function filtrosIniciales(): FiltrosKpi {
  const hasta = new Date()
  return {
    desde: new Date(hasta.getTime() - RANGO_DEFAULT_MS).toISOString(),
    hasta: hasta.toISOString(),
    estatus: '',
    canal: '',
    prioridadId: '',
    tipoIncidenteId: '',
  }
}

export function KpiIncidenciasView({ tiposIncidente, prioridades }: {
  tiposIncidente: CatalogoSimple[]
  prioridades: CatalogoSimple[]
}) {
  const [filtros, setFiltros] = useState<FiltrosKpi>(filtrosIniciales)
  const [incidentes, setIncidentes] = useState<IncidenteGeo[]>([])
  const [kpi, setKpi] = useState<KpiIncidencias | null>(null)
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [previewId, setPreviewId] = useState<string | null>(null)
  const [detalleId, setDetalleId] = useState<string | null>(null)
  const [vistaMapa, setVistaMapa] = useState<VistaMapa>('calor')

  const resultadosCache = useRef<Map<string, KpiGeoResponse>>(new Map())

  function claveCache(f: FiltrosKpi): string {
    return `${f.desde}|${f.hasta}|${f.estatus}|${f.canal}|${f.prioridadId}|${f.tipoIncidenteId}`
  }

  const recargar = useCallback((f: FiltrosKpi) => {
    const clave = claveCache(f)
    const cache = resultadosCache.current.get(clave)
    if (cache) {
      setIncidentes(cache.incidentes)
      setKpi(cache.kpi)
      setPreviewId(null)
      setError(null)
      return
    }
    setCargando(true)
    setError(null)
    const p = new URLSearchParams({ desde: f.desde, hasta: f.hasta })
    if (f.estatus) p.set('estatus', f.estatus)
    if (f.canal) p.set('canal', f.canal)
    if (f.prioridadId) p.set('prioridadId', f.prioridadId)
    if (f.tipoIncidenteId) p.set('tipoIncidenteId', f.tipoIncidenteId)

    fetch(`/api/incidentes/kpi-geo?${p.toString()}`)
      .then(async r => {
        if (!r.ok) throw new Error(r.status === 403 ? 'Sin permiso para consultar incidencias' : 'No se pudieron cargar las incidencias')
        return r.json() as Promise<KpiGeoResponse>
      })
      .then(data => {
        resultadosCache.current.set(clave, data)
        setIncidentes(data.incidentes)
        setKpi(data.kpi)
        setPreviewId(null)
      })
      .catch(e => {
        setError(e instanceof Error ? e.message : 'Error inesperado')
        setIncidentes([])
        setKpi(null)
      })
      .finally(() => setCargando(false))
  }, [])

  // Carga inicial: el rango por defecto (últimas 24 h) debe consultarse apenas
  // se abre la vista.
  useEffect(() => { recargar(filtrosIniciales()) }, [recargar])

  const ampliarRango = () => {
    const hasta = new Date()
    const desde = new Date(hasta.getTime() - RANGO_SIETE_DIAS_MS)
    const nuevos = { ...filtros, desde: desde.toISOString(), hasta: hasta.toISOString() }
    setFiltros(nuevos)
    recargar(nuevos)
  }

  const sinUbicacion = kpi ? kpi.total - kpi.conUbicacion : 0
  const mostrandoEsqueleto = cargando && !kpi && !error
  const sinResultados = !cargando && kpi !== null && kpi.total === 0 && !error

  return (
    <div className="kpi-main">
      <style dangerouslySetInnerHTML={{ __html: `
        .kpi-main { display: flex; flex-direction: column; gap: 24px; }
        @media (max-width: 720px) { .kpi-main { gap: 16px; } }
        @keyframes kpi-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .kpi-grid-mapa { display: grid; grid-template-columns: minmax(0, 2fr) minmax(280px, 1fr); gap: 18px; align-items: stretch; }
        @media (max-width: 1000px) { .kpi-grid-mapa { grid-template-columns: minmax(0, 1fr); } }
        .kpi-toggle { display: inline-flex; align-items: center; gap: 6px; padding: 8px 14px; border: 1px solid transparent; border-radius: var(--radius-full); background: #f1f5f9; color: #64748b; cursor: pointer; font-family: var(--apple-font-display); font-weight: 600; font-size: 13px; transition: all 0.3s ease-out; }
        .kpi-toggle:hover { background-color: #e2e8f0; color: #475569; }
        .kpi-toggle--activo { background: #1f355a; color: #fff; }
        .kpi-toggle--activo:hover { background-color: #132138; color: #fff; }
        .kpi-toggle:active { transform: scale(0.97); transition: transform 0.12s ease-out, background-color 0.12s ease-out; }
        @media (prefers-reduced-motion: reduce) { .kpi-toggle:active { transform: none; } }
        .kpi-map-btn:hover { background-color: #132138; }
        .kpi-map-btn:active { transform: scale(0.97); transition: transform 0.12s ease-out, background-color 0.12s ease-out; }
        @media (prefers-reduced-motion: reduce) { .kpi-map-btn:active { transform: none; } }
        .kpi-callout-cerrar:hover { color: #475569; background: #f1f5f9; }
        .kpi-callout-cerrar:active { transform: scale(0.9); transition: transform 0.12s ease-out, background-color 0.12s ease-out; }
        @media (prefers-reduced-motion: reduce) { .kpi-callout-cerrar:active { transform: none; } }
      `}} />

      <FiltrosRangoKpi
        filtros={filtros}
        onChange={setFiltros}
        onAplicar={recargar}
        cargando={cargando}
        tiposIncidente={tiposIncidente}
        prioridades={prioridades}
      />

      {error && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px',
          background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c',
          borderRadius: 'var(--radius-lg)', fontFamily: 'var(--apple-font-display)', fontSize: 13,
        }}>
          <AlertTriangle size={16} /> {error}
        </div>
      )}

      {mostrandoEsqueleto && <Skeletons />}

      {!mostrandoEsqueleto && !sinResultados && kpi && kpi.total > 0 && (
        <>
          <KpiResumen kpi={kpi} />

          <section className="kpi-grid-mapa">
            <PanelMapa
              titulo={vistaMapa === 'puntos' ? 'Ubicación de incidencias' : 'Concentración por zona'}
              icono={vistaMapa === 'puntos' ? <MapPin size={14} /> : <Flame size={14} />}
              nota={sinUbicacion > 0 ? `${sinUbicacion} sin coordenadas no aparecen en el mapa · ${kpi.conUbicacionReporteCampo} desde reporte de campo` : undefined}
              toggle={
                <div style={{ display: 'flex', gap: 6 }}>
                  <BotonToggle activo={vistaMapa === 'puntos'} onClick={() => setVistaMapa('puntos')} icono={<MapPin size={12} />} etiqueta="Puntos" />
                  <BotonToggle activo={vistaMapa === 'calor'} onClick={() => setVistaMapa('calor')} icono={<Flame size={12} />} etiqueta="Calor" />
                </div>
              }
            >
              {vistaMapa === 'puntos'
                ? <MapaPuntosIncidencias incidentes={incidentes} previewId={previewId} onPreviewChange={setPreviewId} onVerDetalle={setDetalleId} altura={ALTURA_MAPA} />
                : <MapaCalorIncidencias incidentes={incidentes} previewId={previewId} onPreviewChange={setPreviewId} onVerDetalle={setDetalleId} altura={ALTURA_MAPA} />}
            </PanelMapa>

            <ColoniasCalientes incidentes={incidentes} />
          </section>

          <TablaIncidencias incidentes={incidentes} previewId={previewId} onSeleccionar={setPreviewId} onVerDetalle={setDetalleId} />
        </>
      )}

      {sinResultados && <EstadoVacio onAmpliar={ampliarRango} />}

      {detalleId && <ModalDetalleIncidencia key={detalleId} incidenteId={detalleId} onClose={() => setDetalleId(null)} />}
    </div>
  )
}

function PanelMapa({ titulo, icono, nota, toggle, children }: {
  titulo: string
  icono: React.ReactNode
  nota?: string
  toggle?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div style={{
      background: '#fff', border: '1px solid #e2e8f0', borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-card)', overflow: 'clip', display: 'flex', flexDirection: 'column',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, padding: '14px 18px',
        borderBottom: '1px solid #e2e8f0', flexWrap: 'wrap',
      }}>
        <span style={{
          display: 'flex', alignItems: 'center', gap: 8,
          fontFamily: 'var(--apple-font-display)', fontWeight: 600, fontSize: 14, color: '#0f172a',
        }}>
          <span style={{ display: 'flex', color: '#64748b' }}>{icono}</span> {titulo}
        </span>
        {toggle}
      </div>
      <div style={{ flex: 1 }}>{children}</div>
      {nota && (
        <div style={{
          padding: '10px 18px', borderTop: '1px solid #e2e8f0', background: '#f8fafc',
          fontFamily: 'var(--apple-font-display)', fontSize: 12, color: '#64748b',
        }}>
          {nota}
        </div>
      )}
    </div>
  )
}

function BotonToggle({ activo, onClick, icono, etiqueta }: { activo: boolean; onClick: () => void; icono: React.ReactNode; etiqueta: string }) {
  return (
    <button
      type="button" onClick={onClick} aria-pressed={activo}
      className={`kpi-toggle${activo ? ' kpi-toggle--activo' : ''}`}
    >
      {icono} {etiqueta}
    </button>
  )
}
