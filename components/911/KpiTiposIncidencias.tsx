'use client'

import { useState } from 'react'
import type { StatsPorTipo } from '@/lib/911/types'

interface KpiTiposIncidenciasProps {
  stats: StatsPorTipo[]
}

type Periodo = 'dia' | 'semana' | 'mes'

const PERIODOS: { key: Periodo; label: string }[] = [
  { key: 'dia', label: 'Día' },
  { key: 'semana', label: 'Semana' },
  { key: 'mes', label: 'Mes' },
]

const TIPOS: { key: string; label: string }[] = [
  { key: 'normal', label: 'Normales' },
  { key: 'alarma_escolar', label: 'Alarmas escolares' },
  { key: 'extorsion', label: 'Extorsiones' },
]

export function KpiTiposIncidencias({ stats }: KpiTiposIncidenciasProps) {
  const [periodo, setPeriodo] = useState<Periodo>('dia')

  const conteos = new Map(stats.map(s => [s.tipoReporte, s]))

  return (
    <>
      <div className="desp-kpi-head">
        <span className="desp-kpi-title">Incidencias por tipo</span>
        <div style={{ display: 'flex', gap: 4 }}>
          {PERIODOS.map(p => {
            const activo = p.key === periodo
            return (
              <button
                key={p.key}
                type="button"
                onClick={() => setPeriodo(p.key)}
                style={{
                  cursor: 'pointer',
                  fontFamily: 'var(--apple-font-display)',
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: '0.01em',
                  whiteSpace: 'nowrap',
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-full)',
                  border: 'none',
                  background: activo ? '#1f355a' : '#f1f5f9',
                  color: activo ? '#ffffff' : '#64748b',
                  transition: 'all 0.15s ease',
                }}
              >
                {p.label}
              </button>
            )
          })}
        </div>
      </div>
      <div className="desp-kpi-stats">
        {TIPOS.map(t => {
          const valor = conteos.get(t.key)?.[periodo] ?? 0
          return (
            <StatBloque key={t.key} etiqueta={t.label} valor={valor} />
          )
        })}
      </div>
    </>
  )
}

function StatBloque({ etiqueta, valor }: { etiqueta: string; valor: number }) {
  return (
    <div className="stat-bloque">
      <div className="stat-bloque-label">{etiqueta}</div>
      <div className="stat-bloque-value">{valor}</div>
    </div>
  )
}
