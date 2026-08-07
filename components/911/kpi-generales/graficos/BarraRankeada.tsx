'use client'

import { Bar, BarChart, CartesianGrid, Cell, LabelList, XAxis } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart'

// Barra vertical con label arriba — adaptado del patrón shadcn "bar chart with
// label" (ver DESIGN.md §6 y boveda/🧩 Features/KPIs Generales.md). Colores por
// item cuando el dato trae semántica propia (estatus → COLOR_ESTATUS, prioridad
// → colorPrioridad, tipo → paleta de 3 slots, tiempos → rampa ordinal); un solo
// hue (var(--chart-1), token shadcn) cuando la serie es única.
const CHART_BLUE = 'var(--chart-1)'

export interface ItemBarraRankeada {
  label: string
  valor: number
  color?: string
}

const CONFIG: ChartConfig = {
  valor: { label: 'Total', color: CHART_BLUE },
}

// Trunca labels largos en el eje X (establecimientos, grupos delictivos) —
// el nombre completo vive en el tooltip. 20 chars deja intactos los labels de
// tiempos ("Captura → Despacho" = 17).
function truncarEtiqueta(v: unknown): string {
  const s = String(v)
  return s.length > 20 ? `${s.slice(0, 19)}…` : s
}

export function BarraRankeada({ datos, formatoValor, alto, llenarAltura }: {
  datos: ItemBarraRankeada[]
  formatoValor?: (v: number) => string
  alto?: number
  // Cuando el contenedor padre es flex column, la gráfica crece para llenar el
  // alto restante de la card (responsive via flex, no tamaños fijos).
  llenarAltura?: boolean
}) {
  const altura = alto ?? 200
  const formato = formatoValor ?? ((v: number) => v.toLocaleString('es-MX'))

  return (
    <ChartContainer
      config={CONFIG}
      className="aspect-auto"
      style={llenarAltura
        ? { flex: 1, minHeight: 0, width: '100%', height: '100%' }
        : { height: altura, width: '100%' }}
    >
      <BarChart
        accessibilityLayer
        data={datos}
        margin={{ top: 20 }}
        barCategoryGap="20%"
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="label"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          interval={0}
          tickFormatter={truncarEtiqueta}
          tick={{ fontFamily: 'var(--apple-font-display)', fontSize: 11, fill: 'var(--muted-foreground)' }}
        />
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              hideLabel
              formatter={(valor, _nombre, item) => {
                const color = (item?.payload as { color?: string })?.color ?? CHART_BLUE
                const etiqueta = (item?.payload as { label?: string })?.label ?? ''
                return (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', fontFamily: 'var(--apple-font-display)' }}>
                    <span style={{ width: 8, height: 8, borderRadius: 2, background: color, flexShrink: 0 }} />
                    <span style={{ color: 'var(--muted-foreground)', flex: 1 }}>{etiqueta}</span>
                    <span style={{ fontWeight: 600, color: 'var(--foreground)' }}>{formato(Number(valor))}</span>
                  </div>
                )
              }}
            />
          }
        />
        <Bar dataKey="valor" fill={CHART_BLUE} radius={8} maxBarSize={48} isAnimationActive={false}>
          {datos.map((d, i) => (
            <Cell key={i} fill={d.color ?? CHART_BLUE} />
          ))}
          <LabelList
            dataKey="valor"
            position="top"
            offset={12}
            formatter={(v: unknown) => formato(Number(v))}
            style={{ fontFamily: 'var(--apple-font-display)', fontSize: 12, fontWeight: 600, fill: 'var(--foreground)' }}
          />
        </Bar>
      </BarChart>
    </ChartContainer>
  )
}
