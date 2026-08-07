'use client'

import { useEffect, useState } from 'react'
import { ClipboardList, MapPin, FileCheck, MapPinOff } from 'lucide-react'
import type { KpiIncidencias } from '@/lib/incidentes/types'

// Animación de conteo ascendente para los valores (respeta
// prefers-reduced-motion: con reducción salta directo al valor). Sin
// librerías: rAF + easing cúbico. El setState corre dentro del rAF, nunca
// síncrono en el cuerpo del effect.
export function useCountUp(valor: number, duracion = 600): number {
  const [mostrado, setMostrado] = useState(0)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const reducir = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const dur = reducir ? 0 : duracion
    let raf = 0
    const inicio = performance.now()
    const paso = (t: number) => {
      const p = dur === 0 ? 1 : Math.min((t - inicio) / dur, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setMostrado(Math.round(valor * eased))
      if (p < 1) raf = requestAnimationFrame(paso)
    }
    raf = requestAnimationFrame(paso)
    return () => cancelAnimationFrame(raf)
  }, [valor, duracion])

  return mostrado
}

export function KpiResumen({ kpi }: { kpi: KpiIncidencias }) {
  const total = kpi.total
  const conUbicacion = kpi.conUbicacion
  const conReporte = kpi.conUbicacionReporteCampo
  const sinCoordenadas = Math.max(total - conUbicacion, 0)
  const pctUbicacion = total > 0 ? Math.round((conUbicacion / total) * 100) : 0

  return (
    <section className="kpi-resumen" aria-label="Resumen del periodo">
      <style dangerouslySetInnerHTML={{ __html: `
        .kpi-resumen { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 16px; }
        @media (max-width: 900px) { .kpi-resumen { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
        @media (max-width: 520px) { .kpi-resumen { gap: 10px; } }
        .kpi-r-cnt { transition: all 0.3s ease-out; }
        .kpi-r-cnt:hover { transform: translateY(-2px); box-shadow: var(--shadow-elevated); }
        @media (prefers-reduced-motion: reduce) { .kpi-r-cnt:hover { transform: none; } }
      `}} />

      <CardResumen
        etiqueta="Total del periodo"
        valor={total}
        icono={<ClipboardList size={18} strokeWidth={1.5} />}
        hero
      />
      <CardResumen
        etiqueta="Con ubicación"
        valor={conUbicacion}
        acento="#16a34a"
        icono={<MapPin size={18} strokeWidth={1.5} />}
        barraPct={pctUbicacion}
        detalle={`${pctUbicacion}%`}
      />
      <CardResumen
        etiqueta="Desde reporte de campo"
        valor={conReporte}
        acento="#0f766e"
        icono={<FileCheck size={18} strokeWidth={1.5} />}
      />
      <CardResumen
        etiqueta="Sin coordenadas"
        valor={sinCoordenadas}
        acento="#94a3b8"
        icono={<MapPinOff size={18} strokeWidth={1.5} />}
        detalle={sinCoordenadas > 0 ? 'no aparecen en mapas' : undefined}
      />
    </section>
  )
}

function CardResumen({ etiqueta, valor, acento = '#1f355a', icono, detalle, hero = false, barraPct }: {
  etiqueta: string
  valor: number
  acento?: string
  icono?: React.ReactNode
  detalle?: string
  hero?: boolean
  barraPct?: number
}) {
  const n = useCountUp(valor)

  return (
    <div className="kpi-r-cnt" style={{
      background: '#fff', border: '1px solid #e2e8f0', borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-card)', padding: hero ? '20px 22px' : '16px 18px',
      display: 'flex', flexDirection: 'column', gap: 8, minWidth: 0,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <span style={{
          fontFamily: 'var(--apple-font-display)', fontWeight: 500, fontSize: 12,
          color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>
          {etiqueta}
        </span>
        <span style={{ display: 'flex', color: '#94a3b8', flexShrink: 0 }}>{icono}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, minWidth: 0 }}>
        <span style={{
          fontFamily: 'var(--apple-font-display)', fontWeight: 600,
          fontSize: hero ? 40 : 30, lineHeight: 1,
          color: hero ? '#1f355a' : '#0f172a',
        }}>
          {n}
        </span>
        {detalle && (
          <span style={{
            fontFamily: 'var(--apple-font-display)', fontWeight: 600, fontSize: 11,
            color: '#94a3b8', whiteSpace: 'nowrap',
          }}>
            {detalle}
          </span>
        )}
      </div>
      {typeof barraPct === 'number' && (
        <div style={{ height: 6, borderRadius: 'var(--radius-full)', background: '#eef2f7', overflow: 'hidden' }}>
          <div style={{
            height: '100%', borderRadius: 'var(--radius-full)', background: acento,
            width: `${Math.min(Math.max(barraPct, barraPct > 0 ? 4 : 0), 100)}%`,
            transition: 'width 0.4s ease-out',
          }} />
        </div>
      )}
    </div>
  )
}
