# Etapa 2 — Backend Fiscalía (captura)

## Objetivo

Dar de alta la capa de datos para que el agente de Fiscalía pueda listar,
agregar y eliminar armas aseguradas de un `reporte_campo_id`, calcando el
patrón exacto de `AntecedenteExterno` (ver `00-contexto.md`).

**No crear un módulo nuevo** — extender los archivos existentes de
`lib/fiscalia/`, igual que `AntecedenteExterno` vive en los mismos archivos
que todo lo demás de fiscalía.

## Archivos a tocar

`lib/fiscalia/types.ts`, `lib/fiscalia/mapper.ts`, `lib/fiscalia/repository.ts`,
`lib/fiscalia/service.ts`, `lib/fiscalia/actions.ts`.

## 1. Tipos — `lib/fiscalia/types.ts`

Agregar junto a `AntecedenteExterno`/`AntecedenteExternoInput` (línea ~149-166):

```ts
export interface ArmaAsegurada {
  id: string
  tipoArma: string
  marca: string | null
  matricula: string | null
  calibre: string | null
  observaciones: string | null
  createdAt: string
  capturadoPorNombre: string | null
}

export interface ArmaAseguradaInput {
  tipoArma: string
  marca: string | null
  matricula: string | null
  calibre: string | null
  observaciones: string | null
}

export interface ListaArmasAseguradas {
  items: ArmaAsegurada[]
  carpetaInvestigacionSugerida: string | null
}
```

`carpetaInvestigacionSugerida` es el `num_carpeta_investigacion` del D1
(`ofi_reporte_denuncia`), si ya existe — la UI la usa para prellenar el campo
"Carpeta de Investigación" del form, editable.

## 2. Mapper — `lib/fiscalia/mapper.ts`

Junto a `rowToAntecedenteExterno`, agregar `rowToArmaAsegurada` (mismo estilo):

```ts
export function rowToArmaAsegurada(row: Record<string, unknown>): ArmaAsegurada {
  return {
    id: String(row.id),
    tipoArma: String(row.tipo_arma),
    marca: row.marca != null ? String(row.marca) : null,
    matricula: row.matricula != null ? String(row.matricula) : null,
    calibre: row.calibre != null ? String(row.calibre) : null,
    observaciones: row.observaciones != null ? String(row.observaciones) : null,
    createdAt: String(row.created_at),
    capturadoPorNombre: row.capturado_por_nombre != null ? String(row.capturado_por_nombre) : null,
  }
}
```

## 3. Repository — `lib/fiscalia/repository.ts`

Calcar `listarAntecedentesExternos`/`insertarAntecedenteExterno`/`eliminarAntecedenteExterno`
(líneas 668-695) línea por línea, con la tabla nueva. La consulta de listado
debe traer también, en la misma llamada, la carpeta sugerida del D1 (una sola
query extra, no un join que multiplique filas del listado):

```ts
export async function listarArmasAseguradasFiscalia(reporteCampoId: string): Promise<ListaArmasAseguradas> {
  const [items, carpeta] = await Promise.all([
    query<Record<string, unknown>>(
      `SELECT a.id, a.tipo_arma, a.marca, a.matricula, a.calibre, a.observaciones, a.created_en AS created_at,
              CONCAT(u.name, ' ', COALESCE(u.apellido, '')) AS capturado_por_nombre
       FROM fiscalia_armas_aseguradas a
       LEFT JOIN users u ON u.id = a.capturado_por
       WHERE a.reporte_campo_id = $1
       ORDER BY a.creado_en ASC`,
      [reporteCampoId],
    ),
    query<{ num_carpeta_investigacion: string | null }>(
      `SELECT num_carpeta_investigacion FROM ofi_reporte_denuncia WHERE reporte_campo_id = $1 LIMIT 1`,
      [reporteCampoId],
    ),
  ])
  return {
    items: items.rows.map(rowToArmaAsegurada),
    carpetaInvestigacionSugerida: carpeta.rows[0]?.num_carpeta_investigacion ?? null,
  }
}

export async function insertarArmaAsegurada(
  reporteCampoId: string,
  input: ArmaAseguradaInput,
  capturadoPor: string,
): Promise<void> {
  await query(
    `INSERT INTO fiscalia_armas_aseguradas (reporte_campo_id, tipo_arma, marca, matricula, calibre, observaciones, capturado_por)
     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    [reporteCampoId, input.tipoArma, input.marca, input.matricula, input.calibre, input.observaciones, capturadoPor],
  )
}

export async function eliminarArmaAsegurada(id: string): Promise<void> {
  await query(`DELETE FROM fiscalia_armas_aseguradas WHERE id = $1`, [id])
}
```

**Ojo con el nombre de columna**: la tabla `fiscalia_armas_aseguradas` usa
`creado_en` (igual que el resto del proyecto, ver `formato_n_*`), no
`created_at` como usa `antecedentes_externos_detenido` — confirmar el nombre
real de columna contra el `CREATE TABLE` de la Etapa 1 antes de escribir el
SELECT (evitar copiar el nombre de columna de `AntecedenteExterno` sin
verificar, son tablas con convenciones de nombre distintas en este repo).

## 4. Service — `lib/fiscalia/service.ts`

Mismo wrapper delgado que las funciones de antecedentes (líneas 157-171):

```ts
export async function listarArmasAseguradasService(reporteCampoId: string): Promise<ListaArmasAseguradas> {
  return listarArmasAseguradasFiscalia(reporteCampoId)
}

export async function agregarArmaAseguradaService(
  reporteCampoId: string,
  input: ArmaAseguradaInput,
  capturadoPor: string,
): Promise<void> {
  await insertarArmaAsegurada(reporteCampoId, input, capturadoPor)
}

export async function eliminarArmaAseguradaService(id: string): Promise<void> {
  await eliminarArmaAsegurada(id)
}
```

## 5. Actions — `lib/fiscalia/actions.ts`

Calcar `listarAntecedentesExternosAction`/`agregarAntecedenteExternoAction`/`eliminarAntecedenteExternoAction`
(líneas 542-602) exactamente — mismo try/catch, mismo `verificarRolFiscalia`,
mismo `revalidatePath('/fiscalia/asegurados')`:

```ts
export async function listarArmasAseguradasAction(
  reporteCampoId: string,
): Promise<{ data: ListaArmasAseguradas | null; error?: string }> {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session) return { data: null, error: 'Sesión no válida' }
    const esValido = await verificarRolFiscalia(session.user.id)
    if (!esValido) return { data: null, error: 'Acceso no autorizado' }
    const data = await listarArmasAseguradasService(reporteCampoId)
    return { data }
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Error desconocido'
    console.error('[listarArmasAseguradasAction]', msg)
    return { data: null, error: msg }
  }
}

export async function agregarArmaAseguradaAction(
  reporteCampoId: string,
  input: ArmaAseguradaInput,
): Promise<{ success: boolean; error?: string }> {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session) return { success: false, error: 'Sesión no válida' }
    const esValido = await verificarRolFiscalia(session.user.id)
    if (!esValido) return { success: false, error: 'Acceso no autorizado' }
    await agregarArmaAseguradaService(reporteCampoId, input, session.user.id)
    revalidatePath('/fiscalia/asegurados')
    return { success: true }
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Error desconocido'
    console.error('[agregarArmaAseguradaAction]', msg)
    return { success: false, error: msg }
  }
}

export async function eliminarArmaAseguradaAction(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session) return { success: false, error: 'Sesión no válida' }
    const esValido = await verificarRolFiscalia(session.user.id)
    if (!esValido) return { success: false, error: 'Acceso no autorizado' }
    await eliminarArmaAseguradaService(id)
    revalidatePath('/fiscalia/asegurados')
    return { success: true }
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Error desconocido'
    console.error('[eliminarArmaAseguradaAction]', msg)
    return { success: false, error: msg }
  }
}
```

No olvidar agregar los tipos nuevos (`ArmaAsegurada`, `ArmaAseguradaInput`,
`ListaArmasAseguradas`) al `import type {...} from './types'` al inicio de
`actions.ts`, y las funciones de `service.ts` al import de `'./service'`.

## Criterios de aceptación

1. `npx tsc --noEmit` sin errores nuevos.
2. Probar `listarArmasAseguradasAction`/`agregarArmaAseguradaAction`/`eliminarArmaAseguradaAction`
   con un script tsx temporal (mismo patrón de `loadEnvConfig` + import
   dinámico usado en la Etapa 1) contra un `reporte_campo_id` real de la BD:
   agregar un arma, listarla, confirmar que `carpetaInvestigacionSugerida`
   trae el valor correcto si ese reporte ya tiene D1 con carpeta, eliminarla.
3. No se tocó ningún archivo de `lib/fiscalia` fuera de los 5 listados arriba.
