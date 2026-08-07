'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { AlertTriangle, MapPin } from 'lucide-react'
import { FiltroRango911, type RangoFechas } from './FiltroRango911'
import type { KpisGenerales911 } from '@/lib/911/types'
import { StatBloque } from './StatBloque'
import { SkeletonKpi } from './SkeletonKpi'
import { formatearMinutos } from './formatos'
import { SeccionResumen } from './secciones/SeccionResumen'
import { SeccionAtencion } from './secciones/SeccionAtencion'
import { SeccionTiempos } from './secciones/SeccionTiempos'
import { SeccionAlarmasEscolares } from './secciones/SeccionAlarmasEscolares'
import { SeccionExtorsion } from './secciones/SeccionExtorsion'

const RANGO_DEFAULT_MS = 24 * 60 * 60 * 1000

function rangoInicial(): RangoFechas {
  const hasta = new Date()
  return {
    desde: new Date(hasta.getTime() - RANGO_DEFAULT_MS).toISOString(),
    hasta: hasta.toISOString(),
  }
}

export function Panel911() {
  const [rango, setRango] = useState<RangoFechas>(rangoInicial)
  const [data, setData] = useState<KpisGenerales911 | null>(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Sin setState síncrono en el body (regla react-hooks/set-state-in-effect):
  // todos los cambios de estado ocurren dentro de los callbacks del fetch.
  const cargar = useCallback((r: RangoFechas) => {
    const p = new URLSearchParams({ desde: r.desde, hasta: r.hasta })
    return fetch(`/api/incidentes/kpi-911-generales?${p.toString()}`)
      .then(async res => {
        if (!res.ok) throw new Error(res.status === 403 ? 'Sin permiso para consultar los KPIs' : 'No se pudieron cargar los KPIs')
        return res.json() as Promise<KpisGenerales911>
      })
      .then(d => { setData(d); setError(null) })
      .catch(e => { setError(e instanceof Error ? e.message : 'Error inesperado'); setData(null) })
      .finally(() => setCargando(false))
  }, [])

  useEffect(() => {
    cargar(rango)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const aplicar = (r: RangoFechas) => {
    setRango(r)
    setCargando(true)
    setError(null)
    cargar(r)
  }

  return (
    <div aria-busy={cargando} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <style>{`
        /* Hero strip — tarjeta plana con divisores entre stats (§6, patrón stat-bloque) */
        .kpi-hero { display: flex; flex-wrap: wrap; background: #fff; border: 1px solid #e2e8f0; border-radius: var(--radius-lg); box-shadow: var(--shadow-card); }
        .kpi-hero-stat { flex: 1 1 180px; min-width: 0; padding: 20px 24px; }
        .kpi-hero-stat + .kpi-hero-stat { border-left: 1px solid #f1f5f9; }
        .kpi-hero-stat-label { font-family: var(--apple-font-display); font-size: 12px; font-weight: 500; color: #64748b; margin-bottom: 8px; }
        .kpi-hero-stat-value { font-family: var(--apple-font-display); font-size: 36px; font-weight: 600; line-height: 1; color: #0f172a; font-variant-numeric: tabular-nums; }

        /* Grid de secciones — 2 columnas desktop, 1 móvil */
        .kpi-grid { display: grid; grid-template-columns: 1fr; gap: 24px; }
        @media (min-width: 900px) { .kpi-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
        .kpi-grid-full { grid-column: 1 / -1; }

        /* Sección — superficie plana para contenido denso (§6); flex column
           para que las gráficas puedan crecer (llenarAltura) */
        .kpi-seccion { display: flex; flex-direction: column; background: #fff; border: 1px solid #e2e8f0; border-radius: var(--radius-lg); box-shadow: var(--shadow-card); padding: 24px 28px; }
        .kpi-seccion-head { display: flex; align-items: center; gap: 14px; margin-bottom: 20px; }
        .kpi-seccion-bar { width: 4px; height: 16px; background: #1f355a; border-radius: var(--radius-full); }
        .kpi-seccion-title { font-family: var(--apple-font-display); font-size: 18px; font-weight: 600; color: #0f172a; margin: 0; }
        .kpi-seccion-grafica { margin-top: 20px; }

        /* Stats internos — grid auto; ≥4 tiles con wrap en móvil */
        .kpi-stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 16px 24px; }
        .kpi-stat { min-width: 0; }
        .kpi-stat-label { font-family: var(--apple-font-display); font-size: 12px; font-weight: 500; color: #64748b; margin-bottom: 8px; }
        .kpi-stat-value { font-family: var(--apple-font-display); font-size: 28px; font-weight: 600; line-height: 1; color: #0f172a; font-variant-numeric: tabular-nums; }
        .kpi-stat-value--danger { color: #dc2626; }

        /* Textos auxiliares */
        .kpi-subtitulo { font-family: var(--apple-font-display); font-size: 12px; font-weight: 600; color: #64748b; margin-bottom: 10px; }
        .kpi-vacio { padding: 24px 0; color: #64748b; font-family: var(--apple-font-display); font-size: 13px; }
        .kpi-meta { margin: 16px 0 0; font-family: var(--apple-font-display); font-size: 12px; color: #94a3b8; }

        /* Mini cards de etapas (Tiempos de respuesta) — número arriba, label debajo */
        .kpi-tiempos { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 14px; }
        .kpi-tiempos-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: var(--radius-lg); padding: 18px; display: flex; flex-direction: column; align-items: center; gap: 6px; text-align: center; }
        .kpi-tiempos-valor { font-family: var(--apple-font-display); font-size: 28px; font-weight: 600; line-height: 1; font-variant-numeric: tabular-nums; }
        .kpi-tiempos-label { font-family: var(--apple-font-display); font-size: 12px; font-weight: 500; color: #64748b; }
        @media (max-width: 720px) {
          .kpi-tiempos { grid-template-columns: 1fr; }
        }

        @media (max-width: 720px) {
          .kpi-hero-stat { flex: 1 1 50%; padding: 14px 12px; }
          .kpi-hero-stat + .kpi-hero-stat { border-left: none; }
          .kpi-hero-stat:nth-child(odd) { border-right: 1px solid #f1f5f9; }
          .kpi-hero-stat:nth-child(-n+2) { border-bottom: 1px solid #f1f5f9; }
          .kpi-hero-stat-label { font-size: 10px; margin-bottom: 4px; }
          .kpi-hero-stat-value { font-size: 24px; }
          .kpi-seccion { padding: 20px 18px; }
          .kpi-stat-label { font-size: 10px; margin-bottom: 4px; }
          .kpi-stat-value { font-size: 22px; }
          .kpi-stats { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }
      `}</style>

      <FiltroRango911
        rango={rango}
        onChange={setRango}
        onAplicar={aplicar}
        cargando={cargando}
        acciones={
          <Link
            href="/agente_despacho/kpi-incidencias"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              fontFamily: 'var(--apple-font-display)', fontWeight: 600, fontSize: 13,
              color: '#1f355a', textDecoration: 'none',
            }}
          >
            <MapPin size={14} /> Ver mapa de incidencias →
          </Link>
        }
      />

      {error && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px',
          background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c',
          fontFamily: 'var(--apple-font-display)', fontSize: 13, borderRadius: 'var(--radius-lg)',
        }}>
          <AlertTriangle size={16} /> {error}
        </div>
      )}

      {cargando && !data && <SkeletonKpi />}

      {data && (
        <>
          <div className="kpi-hero">
            <StatBloque variante="hero" etiqueta="Total de reportes" valor={data.resumen.total} />
            <StatBloque variante="hero" etiqueta="Canalizados a despacho" valor={data.resumen.canalizadosADespacho} />
            <StatBloque
              variante="hero"
              etiqueta="Sin despachar ahora"
              valor={data.resumen.sinDespacharAhora}
              tono={data.resumen.sinDespacharAhora > 0 ? 'danger' : undefined}
            />
            <StatBloque variante="hero" etiqueta="Tiempo prom. captura→llegada" valor={formatearMinutos(data.tiempos.capturaLlegadaMin)} />
          </div>

          <div className="kpi-grid">
            <SeccionResumen resumen={data.resumen} />
            <SeccionAtencion resumen={data.resumen} atencion={data.atencion} />
            <SeccionTiempos tiempos={data.tiempos} />
            <SeccionAlarmasEscolares alarmaEscolar={data.alarmaEscolar} />
            <div className="kpi-grid-full">
              <SeccionExtorsion extorsion={data.extorsion} />
            </div>
          </div>
        </>
      )}
    </div>
  )
}
