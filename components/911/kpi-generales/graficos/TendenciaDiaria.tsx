'use client'

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart'

const CHART_BLUE = 'var(--chart-1)'

const CONFIG: ChartConfig = {
  total: { label: 'Reportes', color: CHART_BLUE },
}

function formatearDia(diaISO: string): string {
  const fecha = new Date(`${diaISO}T00:00:00`)
  if (Number.isNaN(fecha.getTime())) return diaISO
  return fecha.toLocaleDateString('es-MX', { day: '2-digit', month: 'short' })
}

// Tendencia en el tiempo → área con degradado (skill dataviz: "trend over time:
// line; area for a single series"). El relleno es el hue de la serie al ~10%,
// nunca un bloque saturado — ver marks-and-anatomy.md.
export function TendenciaDiaria({ datos }: { datos: { dia: string; total: number }[] }) {
  const puntos = datos.map(d => ({ ...d, label: formatearDia(d.dia) }))

  return (
    <ChartContainer config={CONFIG} className="aspect-auto" style={{ height: 220, width: '100%' }}>
      <AreaChart data={puntos} margin={{ top: 12, right: 8, bottom: 4, left: 4 }}>
        <defs>
          <linearGradient id="fillTendencia911" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={CHART_BLUE} stopOpacity={0.35} />
            <stop offset="95%" stopColor={CHART_BLUE} stopOpacity={0.03} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke="var(--border)" />
        <XAxis
          dataKey="label"
          tickLine={false}
          axisLine={false}
          tick={{ fontFamily: 'var(--apple-font-display)', fontSize: 11, fill: 'var(--muted-foreground)' }}
          interval={puntos.length > 15 ? 'preserveStartEnd' : 0}
        />
        <YAxis hide />
        <ChartTooltip
          cursor={{ stroke: 'var(--border)', strokeWidth: 1 }}
          content={
            <ChartTooltipContent
              hideIndicator
              formatter={valor => (
                <span style={{ fontWeight: 600, color: 'var(--foreground)', fontFamily: 'var(--apple-font-display)' }}>
                  {Number(valor).toLocaleString('es-MX')} reportes
                </span>
              )}
            />
          }
        />
        <Area
          dataKey="total"
          type="monotone"
          stroke={CHART_BLUE}
          strokeWidth={2}
          fill="url(#fillTendencia911)"
          dot={{ r: 3, fill: CHART_BLUE, strokeWidth: 2, stroke: 'var(--card)' }}
          activeDot={{ r: 5, fill: CHART_BLUE, strokeWidth: 2, stroke: 'var(--card)' }}
          isAnimationActive={false}
        />
      </AreaChart>
    </ChartContainer>
  )
}
