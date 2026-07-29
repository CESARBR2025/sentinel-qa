'use client'

import { useCallback, useRef, useState } from 'react'
import { AlertTriangle, MapPin, Flame } from 'lucide-react'
type VistaMapa = 'puntos' | 'calor'
import type { KpiGeoResponse, IncidenteGeo, KpiIncidencias } from '@/lib/incidentes/types'
import { FiltrosRangoKpi, type FiltrosKpi, type CatalogoSimple } from './FiltrosRangoKpi'
import { MapaPuntosIncidencias } from './MapaPuntosIncidencias'
import { MapaCalorIncidencias } from './MapaCalorIncidencias'
import { TablaIncidencias } from './TablaIncidencias'
import { ModalDetalleIncidencia } from './ModalDetalleIncidencia'
import { ETIQUETA_ESTATUS, COLOR_ESTATUS } from './formato'
import { colorPrioridad } from './useMapaIncidencias'

const RANGO_DEFAULT_MS = 24 * 60 * 60 * 1000

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
  const [vistaMapa, setVistaMapa] = useState<VistaMapa>('puntos')

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

  const sinUbicacion = kpi ? kpi.total - kpi.conUbicacion : 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes kpi-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @media (max-width: 900px) { .kpi-cabecera { grid-template-columns: minmax(0, 1fr) !important; } }
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
          fontFamily: 'Inter, sans-serif', fontSize: 13,
        }}>
          <AlertTriangle size={16} /> {error}
        </div>
      )}

      {kpi && (
        <section style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(200px, 260px) 1fr', gap: 18, alignItems: 'stretch' }} className="kpi-cabecera">
            <TarjetaKpi etiqueta="Total del periodo" valor={kpi.total} acento="#1f355a" destacada />

            <GrupoKpi titulo="Por estatus">
              {kpi.porEstatus.map(e => (
                <TarjetaKpi
                  key={e.estatus}
                  etiqueta={ETIQUETA_ESTATUS[e.estatus] ?? e.estatus}
                  valor={e.total}
                  acento={COLOR_ESTATUS[e.estatus] ?? '#64748b'}
                />
              ))}
            </GrupoKpi>
          </div>

          {kpi.porPrioridad.length > 0 && (
            <GrupoKpi titulo="Por prioridad">
              {kpi.porPrioridad.map(p => (
                <TarjetaKpi
                  key={p.prioridad}
                  // El backend ya devuelve "Sin prioridad" para los nulos: anteponer
                  // "Prioridad" daría "Prioridad Sin prioridad".
                  etiqueta={p.orden == null ? p.prioridad : `Prioridad ${p.prioridad}`}
                  valor={p.total}
                  acento={colorPrioridad(p.orden)}
                />
              ))}
            </GrupoKpi>
          )}
        </section>
      )}

      {kpi && sinUbicacion > 0 && (
        <p style={{
          margin: 0, fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: '0.08em',
          textTransform: 'uppercase', color: '#94a3b8', lineHeight: 1.6,
        }}>
          {kpi.conUbicacion} de {kpi.total} con ubicación ({kpi.conUbicacionReporteCampo} desde reporte de campo) ·{' '}
          {sinUbicacion} sin coordenadas no aparecen en los mapas
        </p>
      )}

      <PanelMapa
        titulo={vistaMapa === 'puntos' ? 'Ubicación de incidencias' : 'Concentración por zona'}
        icono={vistaMapa === 'puntos' ? <MapPin size={14} /> : <Flame size={14} />}
        toggle={
          <div style={{ display: 'flex', gap: 4 }}>
            <BotonToggle activo={vistaMapa === 'puntos'} onClick={() => setVistaMapa('puntos')} icono={<MapPin size={12} />} etiqueta="Puntos" />
            <BotonToggle activo={vistaMapa === 'calor'} onClick={() => setVistaMapa('calor')} icono={<Flame size={12} />} etiqueta="Calor" />
          </div>
        }
      >
        {vistaMapa === 'puntos'
          ? <MapaPuntosIncidencias incidentes={incidentes} previewId={previewId} onPreviewChange={setPreviewId} onVerDetalle={setDetalleId} />
          : <MapaCalorIncidencias incidentes={incidentes} previewId={previewId} onPreviewChange={setPreviewId} onVerDetalle={setDetalleId} />}
      </PanelMapa>

      <TablaIncidencias incidentes={incidentes} previewId={previewId} onSeleccionar={setPreviewId} onVerDetalle={setDetalleId} />

      {detalleId && <ModalDetalleIncidencia key={detalleId} incidenteId={detalleId} onClose={() => setDetalleId(null)} />}
    </div>
  )
}

function PanelMapa({ titulo, icono, toggle, children }: { titulo: string; icono: React.ReactNode; toggle?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #e2e8f0' }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, padding: '12px 16px',
        borderBottom: '1px solid #e2e8f0', flexWrap: 'wrap',
      }}>
        <span style={{
          display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'JetBrains Mono, monospace', fontSize: 10,
          letterSpacing: '0.14em', textTransform: 'uppercase', color: '#1f355a',
        }}>
          {icono} {titulo}
        </span>
        {toggle}
      </div>
      {children}
    </div>
  )
}

function BotonToggle({ activo, onClick, icono, etiqueta }: { activo: boolean; onClick: () => void; icono: React.ReactNode; etiqueta: string }) {
  return (
    <button
      type="button" onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', border: '1px solid #cbd5e1',
        background: activo ? '#1f355a' : '#fff', color: activo ? '#fff' : '#475569', cursor: 'pointer',
        fontFamily: 'JetBrains Mono, monospace', fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase',
      }}
    >
      {icono} {etiqueta}
    </button>
  )
}

function GrupoKpi({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minWidth: 0 }}>
      <span style={{
        fontFamily: 'JetBrains Mono, monospace', fontSize: 9, letterSpacing: '0.16em',
        textTransform: 'uppercase', color: '#94a3b8',
      }}>
        {titulo}
      </span>
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(148px, 1fr))',
        gap: 12, flexGrow: 1,
      }}>
        {children}
      </div>
    </div>
  )
}

function TarjetaKpi({ etiqueta, valor, acento, destacada = false }: {
  etiqueta: string
  valor: number
  acento: string
  destacada?: boolean
}) {
  return (
    <div style={{
      background: '#fff', border: '1px solid #e2e8f0', borderTop: `3px solid ${acento}`,
      padding: destacada ? '18px 20px' : '14px 18px',
      // La tarjeta destacada ocupa su columna completa para alinearse con los
      // grupos de la derecha; el resto se ajusta a su contenido.
      display: 'flex', flexDirection: 'column', justifyContent: destacada ? 'center' : 'flex-start',
      minWidth: 0,
    }}>
      <div style={{
        fontFamily: 'JetBrains Mono, monospace', fontSize: 9, letterSpacing: '0.12em',
        textTransform: 'uppercase', color: '#64748b', marginBottom: 6,
      }}>
        {etiqueta}
      </div>
      <div style={{
        fontFamily: 'Barlow Condensed, sans-serif', fontSize: destacada ? 38 : 30,
        fontWeight: 800, lineHeight: 1, color: '#0f172a',
      }}>
        {valor}
      </div>
    </div>
  )
}
