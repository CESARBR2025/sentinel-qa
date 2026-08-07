# Etapa 1 — Queries y tipos nuevos en `lib/911`

No depende de ninguna otra etapa. Leer `00-contexto.md` primero (modelo de datos y piezas reutilizables).

## Objetivo

Agregar a `lib/911/repository.ts` y `lib/911/types.ts` las queries y tipos que faltan para armar el panel de KPIs. **No tocar** `obtenerKpiIncidencias` en `lib/incidentes/repository.ts` — se reusa tal cual en la Etapa 2, no se duplica aquí.

## Archivo: `lib/911/types.ts`

Agregar (no borrar nada existente):

```ts
export interface Resumen911 {
  total: number
  porTipo: { tipoReporte: string; total: number }[]
  porCanal: { canal: string; total: number }[]
  canalizadosADespacho: number
  sinCanalizacion: number
  sinDespacharAhora: number
}

export interface TiemposRespuesta911 {
  capturaDespachoMin: number | null
  despachoLlegadaMin: number | null
  capturaLlegadaMin: number | null
  muestras: number
}

export interface KpiAlarmaEscolar {
  total: number
  falsas: number
  porcentajeFalsas: number
  activacionesTotales: number
  tiempoArriboPromedioMin: number | null
  topEstablecimientos: { establecimiento: string; total: number }[]
}

export interface KpiExtorsion {
  total: number
  tendenciaDiaria: { dia: string; total: number }[]
  topGruposDelictivos: { grupoDelictivo: string; total: number }[]
  canalizadosADespacho: number
  porcentajeCanalizados: number
}
```

## Archivo: `lib/911/repository.ts`

Agregar 4 funciones nuevas (no tocar las existentes). Todas reciben `desde: string, hasta: string` (ISO), consistente con el resto del repo.

### 1. `obtenerResumenPorTipoYCanal(desde, hasta): Promise<Resumen911>`

```ts
export async function obtenerResumenPorTipoYCanal(desde: string, hasta: string): Promise<Resumen911> {
  const [porTipoCanal, sinDespacharAhora] = await Promise.all([
    query<{ tipo_reporte: string; canal: string; requiere_despacho: boolean; total: number }>(
      `SELECT COALESCE(tipo_reporte, 'normal') AS tipo_reporte, canal,
              COALESCE(requiere_despacho, false) AS requiere_despacho,
              count(*)::int AS total
       FROM incidentes
       WHERE fecha_hora_inicio >= $1 AND fecha_hora_inicio <= $2
       GROUP BY 1, 2, 3`,
      [desde, hasta],
    ),
    // Independiente del rango: cuántos están sin despachar AHORA MISMO.
    // Misma query que ya usa obtenerStats (línea ~50), sin filtro de fecha.
    query<{ count: number }>(
      `SELECT count(*)::int AS count FROM incidentes WHERE estatus = $1 AND requiere_despacho = $2`,
      ['sin_despachar', true],
    ),
  ])

  const porTipoMap = new Map<string, number>()
  const porCanalMap = new Map<string, number>()
  let total = 0, canalizadosADespacho = 0, sinCanalizacion = 0

  for (const r of porTipoCanal.rows) {
    porTipoMap.set(r.tipo_reporte, (porTipoMap.get(r.tipo_reporte) ?? 0) + r.total)
    porCanalMap.set(r.canal, (porCanalMap.get(r.canal) ?? 0) + r.total)
    total += r.total
    if (r.requiere_despacho) canalizadosADespacho += r.total
    else sinCanalizacion += r.total
  }

  return {
    total,
    porTipo: [...porTipoMap].map(([tipoReporte, total]) => ({ tipoReporte, total })),
    porCanal: [...porCanalMap].map(([canal, total]) => ({ canal, total })),
    canalizadosADespacho,
    sinCanalizacion,
    sinDespacharAhora: sinDespacharAhora.rows[0]?.count ?? 0,
  }
}
```

### 2. `obtenerTiemposRespuesta911(desde, hasta): Promise<TiemposRespuesta911>`

Usa la **primera unidad en llegar** por despacho (evita inflar el promedio cuando hay refuerzos). Verificar antes de correr que `incidente_despacho_unidades.despacho_id` y `.hora_llegada` son los nombres reales (confirmado por lectura de código en `lib/incidentes/repository.ts:263`, pero validar contra la BD real por la regla de AGENTS.md).

```ts
export async function obtenerTiemposRespuesta911(desde: string, hasta: string): Promise<TiemposRespuesta911> {
  const result = await query<{ captura_despacho_min: number | null; despacho_llegada_min: number | null; captura_llegada_min: number | null; muestras: number }>(
    `WITH primeras_llegadas AS (
       SELECT despacho_id, MIN(hora_llegada) AS hora_llegada
       FROM incidente_despacho_unidades
       WHERE hora_llegada IS NOT NULL
       GROUP BY despacho_id
     )
     SELECT
       AVG(EXTRACT(EPOCH FROM (d.fecha_hora_despacho - i.fecha_hora_inicio)) / 60) AS captura_despacho_min,
       AVG(EXTRACT(EPOCH FROM (pl.hora_llegada - d.fecha_hora_despacho)) / 60) AS despacho_llegada_min,
       AVG(EXTRACT(EPOCH FROM (pl.hora_llegada - i.fecha_hora_inicio)) / 60) AS captura_llegada_min,
       count(pl.hora_llegada)::int AS muestras
     FROM incidentes i
     JOIN incidente_despacho d ON d.incidente_id = i.id
     LEFT JOIN primeras_llegadas pl ON pl.despacho_id = d.id
     WHERE i.fecha_hora_inicio >= $1 AND i.fecha_hora_inicio <= $2`,
    [desde, hasta],
  )
  const r = result.rows[0]
  return {
    capturaDespachoMin: r?.captura_despacho_min != null ? Number(r.captura_despacho_min) : null,
    despachoLlegadaMin: r?.despacho_llegada_min != null ? Number(r.despacho_llegada_min) : null,
    capturaLlegadaMin: r?.captura_llegada_min != null ? Number(r.captura_llegada_min) : null,
    muestras: r?.muestras ?? 0,
  }
}
```

### 3. `obtenerKpiAlarmaEscolar(desde, hasta): Promise<KpiAlarmaEscolar>`

```ts
export async function obtenerKpiAlarmaEscolar(desde: string, hasta: string): Promise<KpiAlarmaEscolar> {
  const [totales, top] = await Promise.all([
    query<{ total: number; falsas: number; activaciones_totales: number; tiempo_arribo_min: number | null }>(
      `SELECT
         count(*)::int AS total,
         count(*) FILTER (WHERE a.es_falso = true)::int AS falsas,
         COALESCE(SUM(a.activaciones), 0)::int AS activaciones_totales,
         AVG(EXTRACT(EPOCH FROM (a.hora_arribo - a.hora_canalizacion)) / 60)
           FILTER (WHERE a.hora_arribo IS NOT NULL AND a.hora_canalizacion IS NOT NULL) AS tiempo_arribo_min
       FROM incidentes i
       JOIN incidente_alarma_escolar a ON a.incidente_id = i.id
       WHERE i.fecha_hora_inicio >= $1 AND i.fecha_hora_inicio <= $2`,
      [desde, hasta],
    ),
    query<{ establecimiento: string; total: number }>(
      `SELECT a.establecimiento, count(*)::int AS total
       FROM incidentes i
       JOIN incidente_alarma_escolar a ON a.incidente_id = i.id
       WHERE i.fecha_hora_inicio >= $1 AND i.fecha_hora_inicio <= $2 AND a.establecimiento IS NOT NULL
       GROUP BY a.establecimiento
       ORDER BY total DESC
       LIMIT 5`,
      [desde, hasta],
    ),
  ])
  const t = totales.rows[0]
  const total = t?.total ?? 0
  const falsas = t?.falsas ?? 0
  return {
    total,
    falsas,
    porcentajeFalsas: total > 0 ? Math.round((falsas / total) * 1000) / 10 : 0,
    activacionesTotales: t?.activaciones_totales ?? 0,
    tiempoArriboPromedioMin: t?.tiempo_arribo_min != null ? Number(t.tiempo_arribo_min) : null,
    topEstablecimientos: top.rows.map(r => ({ establecimiento: r.establecimiento, total: r.total })),
  }
}
```

### 4. `obtenerKpiExtorsion(desde, hasta): Promise<KpiExtorsion>`

Para el % de canalización real, **leer primero** `obtenerExtorsionesDetalle` en `lib/reportes-operativos/repository.ts` y copiar exactamente su JOIN para resolver la unidad real (default `'C4'` si no hubo despacho) — no inventar una lógica distinta.

```ts
export async function obtenerKpiExtorsion(desde: string, hasta: string): Promise<KpiExtorsion> {
  const [totales, tendencia, gruposTop] = await Promise.all([
    // total + canalizadosADespacho: reusar el mismo JOIN de unidad real que
    // obtenerExtorsionesDetalle (lib/reportes-operativos/repository.ts) —
    // completar aquí replicando ese JOIN, contando unidad != 'C4' como canalizado.
    query<{ total: number; canalizados: number }>(
      `/* completar con el mismo JOIN de obtenerExtorsionesDetalle */`,
      [desde, hasta],
    ),
    query<{ dia: string; total: number }>(
      `SELECT i.fecha_hora_inicio::date AS dia, count(*)::int AS total
       FROM incidentes i
       JOIN incidente_extorsion e ON e.incidente_id = i.id
       WHERE i.fecha_hora_inicio >= $1 AND i.fecha_hora_inicio <= $2
       GROUP BY 1 ORDER BY 1`,
      [desde, hasta],
    ),
    query<{ grupo_delictivo: string; total: number }>(
      `SELECT e.grupo_delictivo, count(*)::int AS total
       FROM incidentes i
       JOIN incidente_extorsion e ON e.incidente_id = i.id
       WHERE i.fecha_hora_inicio >= $1 AND i.fecha_hora_inicio <= $2
         AND e.grupo_delictivo IS NOT NULL AND e.grupo_delictivo <> ''
       GROUP BY e.grupo_delictivo ORDER BY total DESC LIMIT 5`,
      [desde, hasta],
    ),
  ])
  const t = totales.rows[0]
  const total = t?.total ?? 0
  const canalizados = t?.canalizados ?? 0
  return {
    total,
    tendenciaDiaria: tendencia.rows.map(r => ({
      dia: r.dia instanceof Date ? r.dia.toISOString().slice(0, 10) : String(r.dia),
      total: r.total,
    })),
    topGruposDelictivos: gruposTop.rows.map(r => ({ grupoDelictivo: r.grupo_delictivo, total: r.total })),
    canalizadosADespacho: canalizados,
    porcentajeCanalizados: total > 0 ? Math.round((canalizados / total) * 1000) / 10 : 0,
  }
}
```

**Nota explícita para quien construye**: el primer query de esta función queda a propósito sin resolver — es la única pieza que depende de leer código de otro módulo (`obtenerExtorsionesDetalle`) antes de escribir el SQL final. No adivinar el JOIN, copiarlo de ahí.

## Criterios de aceptación

1. `npx tsc --noEmit` sin errores en `lib/911/`.
2. Las 4 funciones nuevas no rompen ninguna función existente de `repository.ts` (diff solo agrega código).
3. Ejecutar cada query manualmente contra la BD (o un script puntual) y confirmar que no truena por nombre de columna — si algún nombre no coincide con lo asumido aquí, corregir con el nombre real y anotarlo al reportar la etapa.

Detenerse aquí y esperar confirmación antes de pasar a Etapa 2.
