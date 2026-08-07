'use client'

import { useMemo, useRef, useState } from 'react'
import { Flame, Home, MapPin, Activity } from 'lucide-react'
import type { IncidenteGeo } from '@/lib/incidentes/types'
import { COLOR_ESTATUS, BG_ESTATUS } from './formato'
import { useCountUp } from './KpiResumen'

const TOP_TABLA = 5
const TOP_DONUT = 5

// Colores de la columna Estatus de la tabla (formato.ts), en orden de "calor":
// la colonia con más reportes se pinta con el más cálido (rojo) y baja hasta el
// teal. Sus variantes claras viven en BG_ESTATUS (formato.ts) para fondos.
const CLAVES_DONUT = ['sin_despachar', 'en_despacho', 'en_sitio', 'atendido', 'cerrado_detencion'] as const
const COLORES_DONUT = CLAVES_DONUT.map(clave => COLOR_ESTATUS[clave])
const COLOR_RESTO = '#cbd5e1'

const thCol: React.CSSProperties = {
  textAlign: 'left', padding: '9px 10px', fontFamily: 'var(--apple-font-display)',
  fontSize: 11, fontWeight: 600, color: '#64748b',
  borderBottom: '1px solid #e2e8f0', whiteSpace: 'nowrap',
}

const tdCol: React.CSSProperties = {
  padding: '10px', fontFamily: 'var(--apple-font-display)', fontSize: 13,
  color: '#334155', borderBottom: '1px solid #f1f5f9',
}

interface HoverInfo {
  etiqueta: string
  valor: number
  pct: number
  color: string
  x: number
  y: number
}

export function ColoniasCalientes({ incidentes }: { incidentes: IncidenteGeo[] }) {
  const { filas, top5, resto, max, sinColonia, conColonia } = useMemo(() => {
    const conteo = new Map<string, number>()
    let sinColonia = 0
    for (const inc of incidentes) {
      const c = (inc.colonia ?? '').trim()
      if (!c) { sinColonia++; continue }
      conteo.set(c, (conteo.get(c) ?? 0) + 1)
    }
    const filas = [...conteo.entries()]
      .map(([colonia, total]) => ({ colonia, total }))
      .sort((a, b) => b.total - a.total || a.colonia.localeCompare(b.colonia))
      .slice(0, TOP_TABLA)
    const top5 = filas.slice(0, TOP_DONUT)
    const sumaTop5 = top5.reduce((s, f) => s + f.total, 0)
    const conColonia = incidentes.length - sinColonia
    const resto = Math.max(conColonia - sumaTop5, 0)
    return { filas, top5, resto, max: filas[0]?.total ?? 1, sinColonia, conColonia }
  }, [incidentes])

  const segmentos = top5.map((f, i) => ({
    etiqueta: f.colonia,
    valor: f.total,
    color: COLORES_DONUT[i % COLORES_DONUT.length],
  }))
  if (resto > 0) {
    segmentos.push({ etiqueta: 'Otras colonias', valor: resto, color: COLOR_RESTO })
  }

  return (
    <aside className="kpi-colonias" aria-label="Colonias con más reportes del periodo" style={{
      background: '#fff', border: '1px solid #e2e8f0', borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-card)', overflow: 'clip', display: 'flex', flexDirection: 'column',
    }}>
      <style dangerouslySetInnerHTML={{ __html: `
        .kpi-col-tabla tbody tr { transition: background-color 0.15s; }
        .kpi-col-tabla tbody tr:hover { background-color: #f8fafc; }
      `}} />

      <header style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
        padding: '16px 18px', borderBottom: '1px solid #e2e8f0',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
          <span style={{
            width: 34, height: 34, borderRadius: 'var(--radius-lg)',
            background: 'rgba(31,53,90,0.08)', color: '#1f355a',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <Flame size={17} strokeWidth={1.75} />
          </span>
          <div style={{ minWidth: 0 }}>
            <div style={{
              fontFamily: 'var(--apple-font-display)', fontWeight: 600, fontSize: 16,
              color: '#0f172a', whiteSpace: 'nowrap', overflow: 'clip', textOverflow: 'ellipsis',
            }}>
              Colonias con más reportes
            </div>
            <div style={{
              fontFamily: 'var(--apple-font-display)', fontWeight: 500, fontSize: 12,
              color: '#64748b',
            }}>
              Áreas calientes del periodo
            </div>
          </div>
        </div>
        {filas.length > 0 && (
          <span style={{
            fontFamily: 'var(--apple-font-display)', fontWeight: 600, fontSize: 11,
            color: '#1f355a', background: 'rgba(31,53,90,0.08)', padding: '4px 12px',
            borderRadius: 'var(--radius-full)', whiteSpace: 'nowrap',
          }}>
            Top {TOP_DONUT}
          </span>
        )}
      </header>

      {filas.length === 0 ? (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
          padding: '28px 18px', color: '#94a3b8', textAlign: 'center', flex: 1,
        }}>
          <Home size={22} strokeWidth={1.5} />
          <span style={{ fontFamily: 'var(--apple-font-display)', fontSize: 13, lineHeight: 1.5 }}>
            Sin colonias con reportes en el rango
          </span>
        </div>
      ) : (
        <>
          {/* Donut: top 5 colonias más calientes, centrada */}
          <div style={{
            padding: '22px 18px 18px', borderBottom: '1px solid #eef2f7',
            display: 'flex', justifyContent: 'center',
          }}>
            <DonutTop5 segmentos={segmentos} total={conColonia} />
          </div>

          {/* Tabla: ranking completo, envuelta en una sub-targeta */}
          <div style={{ padding: '0 18px 18px', flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div style={{
              border: '1px solid #e2e8f0', borderRadius: 'var(--radius-lg)',
              background: '#f8fafc', overflow: 'clip', display: 'flex', flexDirection: 'column',
            }}>
              <div style={{
                padding: '10px 14px', borderBottom: '1px solid #e2e8f0',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
              }}>
                <span style={{
                  fontFamily: 'var(--apple-font-display)', fontWeight: 600, fontSize: 13,
                  color: '#334155',
                }}>
                  Ranking por colonia
                </span>
                <span style={{
                  fontFamily: 'var(--apple-font-display)', fontWeight: 500, fontSize: 11,
                  color: '#94a3b8', whiteSpace: 'nowrap',
                }}>
                  {filas.length} colonias principales
                </span>
              </div>
              <div className="tabla-wrap">
                <table className="kpi-col-tabla" style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th style={thCol}>
                        <CabeceraIcono etiqueta="Colonia" icono={<MapPin size={11} strokeWidth={2} />} />
                      </th>
                      <th style={{ ...thCol, textAlign: 'right' }}>
                        <CabeceraIcono etiqueta="Incidentes" icono={<Activity size={11} strokeWidth={2} />} />
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filas.map((f, i) => (
                      <FilaTabla
                        key={f.colonia}
                        colonia={f.colonia}
                        total={f.total}
                        max={max}
                        ranking={i + 1}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}

      {filas.length > 0 && (
        <div style={{
          padding: '10px 18px', borderTop: '1px solid #e2e8f0', background: '#f8fafc',
          fontFamily: 'var(--apple-font-display)', fontSize: 12, color: '#64748b',
        }}>
          {conColonia} de {incidentes.length} incidencias con colonia
          {sinColonia > 0 && ` · ${sinColonia} sin registrar`}
        </div>
      )}
    </aside>
  )
}

function DonutTop5({ segmentos, total }: {
  segmentos: { etiqueta: string; valor: number; color: string }[]
  total: number
}) {
  const R = 36
  const C = 2 * Math.PI * R
  const contRef = useRef<HTMLDivElement | null>(null)
  const [hover, setHover] = useState<HoverInfo | null>(null)

  // Offsets acumulados sin mutación en render: cada segmento inicia donde
  // termina el anterior (suma de dash + offset previos).
  const conOffsets = segmentos.reduce<Array<{ etiqueta: string; valor: number; color: string; dash: number; offset: number }>>((acc, s) => {
    const fraccion = total > 0 ? s.valor / total : 0
    const dash = fraccion * C
    const previo = acc.length ? acc[acc.length - 1] : null
    const offset = previo ? previo.offset + previo.dash : 0
    acc.push({ ...s, dash, offset })
    return acc
  }, [])

  const capturar = (s: { etiqueta: string; valor: number; color: string }, e: React.MouseEvent) => {
    const rect = contRef.current?.getBoundingClientRect()
    if (!rect) return
    const pct = total > 0 ? Math.round((s.valor / total) * 100) : 0
    setHover({
      etiqueta: s.etiqueta,
      valor: s.valor,
      pct,
      color: s.color,
      x: Math.min(Math.max(e.clientX - rect.left, 72), rect.width - 72),
      y: e.clientY - rect.top,
    })
  }

  return (
    <div
      ref={contRef}
      style={{ position: 'relative', width: 180, height: 180 }}
      onMouseLeave={() => setHover(null)}
    >
      <svg width={180} height={180} viewBox="0 0 100 100" role="img" aria-label="Distribución de colonias más calientes">
        <circle cx={50} cy={50} r={R} fill="none" stroke="#eef2f7" strokeWidth={12} />
        {conOffsets.map(s => (
          <g key={s.etiqueta}>
            {/* Target de hover invisible y más ancho: acertar el arco es difícil */}
            <circle
              cx={50} cy={50} r={R} fill="none"
              stroke="transparent" strokeWidth={26}
              strokeDasharray={`${s.dash} ${C - s.dash}`}
              strokeDashoffset={-s.offset}
              transform="rotate(-90 50 50)"
              onMouseEnter={e => capturar(s, e)}
              onMouseMove={e => capturar(s, e)}
            />
            <circle
              cx={50} cy={50} r={R} fill="none"
              stroke={s.color} strokeWidth={12}
              strokeDasharray={`${s.dash} ${C - s.dash}`}
              strokeDashoffset={-s.offset}
              transform="rotate(-90 50 50)"
              style={{ pointerEvents: 'none' }}
            />
          </g>
        ))}
      </svg>

      {hover && (
        <div style={{
          position: 'absolute', left: hover.x, top: hover.y,
          transform: 'translate(-50%, calc(-100% - 14px))', zIndex: 10, pointerEvents: 'none',
          background: '#fff', border: '1px solid #e2e8f0', borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-elevated)', padding: '9px 12px', minWidth: 130,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 4 }}>
            <span style={{ width: 9, height: 9, borderRadius: '50%', background: hover.color, flexShrink: 0 }} />
            <span style={{
              fontFamily: 'var(--apple-font-display)', fontWeight: 600, fontSize: 12,
              color: '#0f172a', whiteSpace: 'nowrap',
            }}>
              {hover.etiqueta}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12 }}>
            <span style={{
              fontFamily: 'var(--apple-font-display)', fontSize: 11, color: '#64748b',
              fontVariantNumeric: 'tabular-nums',
            }}>
              {hover.valor} incidente{hover.valor === 1 ? '' : 's'}
            </span>
            <span style={{
              fontFamily: 'var(--apple-font-display)', fontWeight: 600, fontSize: 12,
              color: '#1f355a', fontVariantNumeric: 'tabular-nums',
            }}>
              {hover.pct}%
            </span>
          </div>
        </div>
      )}

      <div style={{
        position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', pointerEvents: 'none',
      }}>
        <span style={{
          fontFamily: 'var(--apple-font-display)', fontWeight: 600, fontSize: 26,
          color: '#0f172a', lineHeight: 1.1, fontVariantNumeric: 'tabular-nums',
        }}>
          {total}
        </span>
        <span style={{ fontFamily: 'var(--apple-font-display)', fontSize: 10, color: '#94a3b8' }}>
          con colonia
        </span>
      </div>
    </div>
  )
}

function CabeceraIcono({ etiqueta, icono }: { etiqueta: string; icono: React.ReactNode }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
      <span style={{ display: 'flex', color: '#94a3b8' }}>{icono}</span>
      {etiqueta}
    </span>
  )
}

function FilaTabla({ colonia, total, max, ranking }: {
  colonia: string
  total: number
  max: number
  ranking: number
}) {
  const n = useCountUp(total)
  const idx = ranking - 1
  // Color de estatus del ranking (y su variante clara) si está en el top 5;
  // fuera de ahí, gris neutro.
  const color = idx < CLAVES_DONUT.length ? COLOR_ESTATUS[CLAVES_DONUT[idx]] : '#64748b'
  const track = idx < CLAVES_DONUT.length ? BG_ESTATUS[CLAVES_DONUT[idx]] : '#eef2f7'

  return (
    <tr>
      <td style={tdCol}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 9, minWidth: 0 }}>
          <span style={{
            width: 24, height: 24, borderRadius: 'var(--radius-md)', flexShrink: 0,
            background: track, color,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <MapPin size={12} strokeWidth={2} />
          </span>
          <span style={{
            overflow: 'clip', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            fontWeight: 500,
          }}>
            {colonia}
          </span>
        </span>
      </td>
      <td style={{ ...tdCol, textAlign: 'right' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 5 }}>
          <span style={{
            fontFamily: 'var(--apple-font-display)', fontWeight: 600, fontSize: 15,
            color: '#0f172a', lineHeight: 1, fontVariantNumeric: 'tabular-nums',
          }}>
            {n}
          </span>
          <div style={{ width: 56, height: 4, borderRadius: 'var(--radius-full)', background: track, overflow: 'clip' }}>
            <div style={{
              height: '100%', borderRadius: 'var(--radius-full)', background: color,
              width: `${Math.min(Math.max((total / max) * 100, total > 0 ? 12 : 0), 100)}%`,
            }} />
          </div>
        </div>
      </td>
    </tr>
  )
}
