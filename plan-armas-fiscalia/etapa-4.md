# Etapa 4 — Sync a Formato N

## Objetivo

Que las armas capturadas en Fiscalía (Etapa 2/3) aparezcan automáticamente en
`formato_n_armas_aseguradas` para el día correcto, con el mismo patrón
`origen_*_id` + `UPSERT` + limpieza de huérfanos que ya corre para Eventos y
RND — **incluyendo el orden correcto de la limpieza** (ver `00-contexto.md`,
es un bug real que ya pasó en esta sesión).

## Archivos a tocar

- `lib/reportes/formato-n-armas-aseguradas-service.ts` (reescribir)
- Nuevo: `app/api/reportes/formato-n-armas-aseguradas/sincronizar/route.ts`
- `lib/reportes/formato-n-store.ts` (`cargar`, agregar la tercera sincronización)

## 1. Reescribir `lib/reportes/formato-n-armas-aseguradas-service.ts`

**Eliminar** `obtenerArmasParaFormatoN` y la interfaz `ArmaFuente` (líneas 1-35
del archivo actual) — es código muerto que este plan supera (ver
`00-contexto.md`).

**Conservar tal cual** `FormatoNArmaAsegurada`, `rowTo`, `listarArmasAseguradas`,
`obtenerArmaAsegurada`, `obtenerArmasAseguradasPorFecha`,
`FormatoNArmaAseguradaInput`, `crearArmaAsegurada`, `actualizarArmaAsegurada`
— estas siguen sirviendo tanto al form manual del paso 7 como al sync nuevo.
Agregar `origen_fiscalia_arma_id: string | null` a la interfaz
`FormatoNArmaAsegurada` y a `rowTo` (mismo patrón que se hizo para
`FormatoNEvento`/`FormatoNRnd` en la sesión anterior — ver
`lib/reportes/formato-n-eventos-service.ts:3-15` y `:23-37` como referencia
exacta de qué tocar).

**Agregar**, siguiendo el patrón de `lib/reportes/formato-n-rnd-service.ts`
(`buscarDetencionesPorRango`, `upsertRndDesdeReporteCampo`,
`eliminarDuplicadosRndDelDia`, `sincronizarDetencionesDelDia`) casi línea por
línea:

```ts
export interface FuenteArma {
  id: string
  fecha: string
  tipo_arma: string
  marca: string | null
  matricula: string | null
  calibre: string | null
  observaciones: string | null
}

export async function buscarArmasFiscaliaPorRango(fechaInicio: string, fechaFin: string): Promise<FuenteArma[]> {
  const r = await query<Record<string, unknown>>(
    `SELECT a.id, i.fecha_hora_inicio::date AS fecha,
            a.tipo_arma, a.marca, a.matricula, a.calibre, a.observaciones
     FROM fiscalia_armas_aseguradas a
     JOIN ofi_reportes_campo rc ON rc.id = a.reporte_campo_id
     JOIN incidentes i ON i.id = rc.incidente_id
     WHERE i.fecha_hora_inicio::date BETWEEN $1 AND $2
     ORDER BY i.fecha_hora_inicio DESC`,
    [fechaInicio, fechaFin],
  )
  return r.rows.map(row => ({
    id: String(row.id),
    fecha: String(row.fecha).slice(0, 10),
    tipo_arma: String(row.tipo_arma),
    marca: row.marca != null ? String(row.marca) : null,
    matricula: row.matricula != null ? String(row.matricula) : null,
    calibre: row.calibre != null ? String(row.calibre) : null,
    observaciones: row.observaciones != null ? String(row.observaciones) : null,
  }))
}

export interface ArmaOrigenInput extends FormatoNArmaAseguradaInput {
  origen_fiscalia_arma_id: string
}

async function upsertArmaDesdeFiscalia(data: ArmaOrigenInput): Promise<void> {
  await query(
    `INSERT INTO formato_n_armas_aseguradas (fecha, carpeta_investigacion, tipo_arma, matricula, calibre, observaciones, capturado_por, origen_fiscalia_arma_id)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
     ON CONFLICT (origen_fiscalia_arma_id) WHERE origen_fiscalia_arma_id IS NOT NULL
     DO UPDATE SET tipo_arma = EXCLUDED.tipo_arma, matricula = EXCLUDED.matricula,
       calibre = EXCLUDED.calibre, observaciones = EXCLUDED.observaciones`,
    [data.fecha, data.carpeta_investigacion ?? null, data.tipo_arma, data.matricula ?? null, data.calibre ?? null, data.observaciones ?? null, data.capturado_por, data.origen_fiscalia_arma_id],
  )
}

export async function eliminarDuplicadosArmasDelDia(fecha: string): Promise<void> {
  // Huérfanos previos al upsert por origen_fiscalia_arma_id: debe correr ANTES
  // del match por campos exactos, o ese match puede quedarse con el huérfano
  // en vez del enlazado (bug real, ver boveda/🗺 Roadmap/Troubleshooting.md).
  await query(`
    DELETE FROM formato_n_armas_aseguradas a
    USING formato_n_armas_aseguradas b
    WHERE a.fecha = $1
      AND b.fecha = $1
      AND a.origen_fiscalia_arma_id IS NULL
      AND b.origen_fiscalia_arma_id IS NOT NULL
      AND a.tipo_arma = b.tipo_arma
      AND COALESCE(a.matricula, '') = COALESCE(b.matricula, '')
  `, [fecha])
  await query(`
    DELETE FROM formato_n_armas_aseguradas a
    USING formato_n_armas_aseguradas b
    WHERE a.fecha = $1
      AND b.fecha = $1
      AND a.tipo_arma = b.tipo_arma
      AND COALESCE(a.matricula, '') = COALESCE(b.matricula, '')
      AND COALESCE(a.calibre, '') = COALESCE(b.calibre, '')
      AND (b.creado_en < a.creado_en OR (b.creado_en = a.creado_en AND b.id::text < a.id::text))
  `, [fecha])
}

export async function sincronizarArmasDelDia(fecha: string, capturadoPor: string): Promise<FormatoNArmaAsegurada[]> {
  const armas = await buscarArmasFiscaliaPorRango(fecha, fecha)
  await eliminarDuplicadosArmasDelDia(fecha)
  for (const a of armas) {
    await upsertArmaDesdeFiscalia({
      fecha,
      tipo_arma: a.tipo_arma,
      matricula: a.matricula,
      calibre: a.calibre,
      observaciones: a.observaciones,
      capturado_por: capturadoPor,
      origen_fiscalia_arma_id: a.id,
    })
  }
  return obtenerArmasAseguradasPorFecha(fecha)
}
```

**Ojo**: `carpeta_investigacion` no viene de `fiscalia_armas_aseguradas` (esa
tabla no la tiene, Etapa 1). Si se quiere sincronizarla también, resolver
aquí mismo con un `LEFT JOIN ofi_reporte_denuncia d ON d.reporte_campo_id =
rc.id` agregado a `buscarArmasFiscaliaPorRango`, trayendo `d.num_carpeta_investigacion
AS carpeta_investigacion` y pasándolo en el `upsert`. Recomendado incluirlo —
es el mismo dato que ya se sugiere en la UI de la Etapa 3, aquí simplemente
se persiste.

## 2. Endpoint nuevo — `app/api/reportes/formato-n-armas-aseguradas/sincronizar/route.ts`

Copiar `app/api/reportes/formato-n-eventos/sincronizar/route.ts` completo,
cambiando `sincronizarEventosDelDia` por `sincronizarArmasDelDia`:

```ts
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { sincronizarArmasDelDia } from '@/lib/reportes/formato-n-armas-aseguradas-service'
import { verificarAccesoFormatoNApi } from '@/lib/reportes/permisos'

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  const chequeo = await verificarAccesoFormatoNApi(session.user.id, 'crear')
  if (chequeo) return chequeo

  const body = await req.json()
  const fecha = body.fecha as string
  if (!fecha) return NextResponse.json({ error: 'Fecha requerida' }, { status: 400 })

  const armas = await sincronizarArmasDelDia(fecha, session.user.id)
  return NextResponse.json(armas)
}
```

## 3. Store — `lib/reportes/formato-n-store.ts`

En `cargar` (línea ~184), el `Promise.all` inicial hoy dispara eventos y RND:

```ts
await Promise.all([
  fetch('/api/reportes/formato-n-eventos/sincronizar', { ... }),
  fetch('/api/reportes/formato-n-rnd/sincronizar', { ... }),
])
```

Agregar una tercera llamada al mismo array, mismo shape (`POST`,
`{ fecha }`), apuntando a `/api/reportes/formato-n-armas-aseguradas/sincronizar`.

## Criterios de aceptación

1. `npx tsc --noEmit` sin errores nuevos.
2. Con un arma ya capturada en Fiscalía (Etapa 2/3) para un
   `reporte_campo_id` cuyo incidente sea de una fecha conocida: llamar
   `sincronizarArmasDelDia(fecha, userId)` (script tsx temporal) y confirmar
   que aparece en `formato_n_armas_aseguradas` con `origen_fiscalia_arma_id`
   igual al id de `fiscalia_armas_aseguradas`.
3. **Prueba de idempotencia (la que falló para Eventos/RND la sesión
   pasada)**: correr la sincronización dos veces seguidas. Confirmar que NO
   se duplica — debe seguir habiendo exactamente 1 fila para esa arma.
4. Editar el `tipo_arma` en `fiscalia_armas_aseguradas` directamente y volver
   a sincronizar: confirmar que la fila en `formato_n_armas_aseguradas` se
   actualiza (no se duplica).
5. El endpoint `POST /api/reportes/formato-n-armas-aseguradas/sincronizar`
   responde 200 con la lista de armas del día.
