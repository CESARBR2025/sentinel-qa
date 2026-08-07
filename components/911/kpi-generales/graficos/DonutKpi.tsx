'use client'

import { Cell, Label, Pie, PieChart } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart'

// Donut — part-to-whole a simple vistazo (≤6 segmentos). Usado para "por tipo de
// reporte" y "por estatus": ambos son una sola cifra (total) repartida en pocas
// categorías, el caso legítimo de dona (skill dataviz: "part-to-whole at a glance
// only, ≤6 segments" — no se usa para comparar valores parecidos entre sí).
export interface ItemDonut {
  label: string
  valor: number
  color: string
}

export function DonutKpi({ datos, etiquetaCentro = 'Total', formatoValor }: {
  datos: ItemDonut[]
  etiquetaCentro?: string
  formatoValor?: (v: number) => string
}) {
  const formato = formatoValor ?? ((v: number) => v.toLocaleString('es-MX'))
  const total = datos.reduce((acc, d) => acc + d.valor, 0)

  const config: ChartConfig = Object.fromEntries(
    datos.map(d => [d.label, { label: d.label, color: d.color }]),
  )

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 24 }}>
      <ChartContainer config={config} className="mx-auto aspect-square max-h-[250px] w-full max-w-[250px]" style={{ flexShrink: 0 }}>
        <PieChart>
          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent
                hideLabel
                formatter={(valor, _nombre, item) => {
                  const color = (item?.payload as { color?: string })?.color ?? '#94a3b8'
                  const etiqueta = (item?.payload as { label?: string })?.label ?? ''
                  const pct = total > 0 ? Math.round((Number(valor) / total) * 100) : 0
                  return (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', fontFamily: 'var(--apple-font-display)' }}>
                      <span style={{ width: 8, height: 8, borderRadius: 2, background: color, flexShrink: 0 }} />
                      <span style={{ color: 'var(--muted-foreground)', flex: 1 }}>{etiqueta}</span>
                      <span style={{ fontWeight: 600, color: 'var(--foreground)' }}>{formato(Number(valor))}</span>
                      <span style={{ color: 'var(--muted-foreground)', fontSize: 11 }}>{pct}%</span>
                    </div>
                  )
                }}
              />
            }
          />
          <Pie
            data={datos}
            dataKey="valor"
            nameKey="label"
            innerRadius={60}
            strokeWidth={5}
            isAnimationActive={false}
          >
            {datos.map((d, i) => (
              <Cell key={i} fill={d.color} />
            ))}
            <Label
              content={({ viewBox }) => {
                if (!viewBox || !('cx' in viewBox) || !('cy' in viewBox)) return null
                const { cx, cy } = viewBox
                return (
                  <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle" fontFamily="var(--apple-font-display)">
                    <tspan x={cx} y={cy} className="fill-foreground text-3xl font-bold">
                      {formato(total)}
                    </tspan>
                    <tspan x={cx} y={(cy ?? 0) + 24} className="fill-muted-foreground text-sm">
                      {etiquetaCentro}
                    </tspan>
                  </text>
                )
              }}
            />
          </Pie>
        </PieChart>
      </ChartContainer>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, minWidth: 160, flex: 1 }}>
        {datos.map(d => {
          const pct = total > 0 ? Math.round((d.valor / total) * 100) : 0
          return (
            <div key={d.label} style={{ display: 'flex', alignItems: 'center', gap: 10, fontFamily: 'var(--apple-font-display)' }}>
              <span style={{ width: 10, height: 10, borderRadius: 3, background: d.color, flexShrink: 0 }} />
              <span style={{ fontSize: 13, color: 'var(--muted-foreground)', flex: 1 }}>{d.label}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--foreground)' }}>{formato(d.valor)}</span>
              <span style={{ fontSize: 12, color: 'var(--muted-foreground)', width: 34, textAlign: 'right' }}>{pct}%</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
