# Etapa 7 — IPH / Folio CU: generación y verificación de unicidad en servidor

Leer primero `00-contexto.md` de esta misma carpeta.

## Objetivo

`iph` y `folioCu` se generan hoy en el cliente con `Math.random()` sin verificar unicidad. `folioDenuncia` sí tiene el patrón correcto: generación + reintento en servidor validando contra la BD. Replicar ese mismo patrón para `iph` y `folioCu`.

## Archivos a modificar

- `lib/d1/repository.ts` — agregar `verificarIphUnico`, `verificarFolioCuUnico` (junto a `verificarFolioDenunciaUnico`, línea 5)
- `app/api/reportes-d1/route.ts` — agregar `generarIphUnico`/`generarFolioCuUnico` (junto a `generarFolioDenunciaUnico`, línea 24) y usarlos antes del `insertarReporteDenuncia`

## Cambios

### 1. `lib/d1/repository.ts`

Patrón existente a replicar (línea 5):
```ts
export async function verificarFolioDenunciaUnico(folio: string): Promise<boolean> {
  const result = await query<{ count: number }>(
    `SELECT COUNT(*)::int AS count FROM ofi_reporte_denuncia WHERE folio_denuncia = $1`,
    [folio],
  )
  return Number(result.rows[0]?.count ?? 1) === 0
}
```

Agregar, confirmando primero los nombres reales de columna en `ofi_reporte_denuncia` para IPH y Folio CU (revisar `lib/d1/types.ts::ReporteD1` — campos `iph` y `folioCu` — y el esquema real vía `npm run db:schema` o consulta directa, no asumir):
```ts
export async function verificarIphUnico(iph: string): Promise<boolean> {
  const result = await query<{ count: number }>(
    `SELECT COUNT(*)::int AS count FROM ofi_reporte_denuncia WHERE iph = $1`,
    [iph],
  )
  return Number(result.rows[0]?.count ?? 1) === 0
}

export async function verificarFolioCuUnico(folioCu: string): Promise<boolean> {
  const result = await query<{ count: number }>(
    `SELECT COUNT(*)::int AS count FROM ofi_reporte_denuncia WHERE folio_cu = $1`,
    [folioCu],
  )
  return Number(result.rows[0]?.count ?? 1) === 0
}
```

### 2. `app/api/reportes-d1/route.ts`

Patrón existente a replicar (líneas 10-31):
```ts
function generarFolioDenuncia(): string { ... }
async function generarFolioDenunciaUnico(): Promise<string> {
  for (let i = 0; i < 10; i++) {
    const folio = generarFolioDenuncia()
    const disponible = await verificarFolioDenunciaUnico(folio)
    if (disponible) return folio
  }
  throw new Error('No se pudo generar un folio único después de 10 intentos')
}
```

Agregar generadores análogos para IPH y Folio CU (mismo formato que ya usa el cliente en `FormularioD1.tsx`: `IPH-{año}-{5 dígitos}` y `CU-{año}-{5 dígitos}`, para no romper el formato que el usuario ya conoce visualmente):
```ts
function generarIph(): string {
  const y = new Date().getFullYear()
  const rand = String(Math.floor(Math.random() * 90000) + 10000)
  return `IPH-${y}-${rand}`
}
async function generarIphUnico(): Promise<string> {
  for (let i = 0; i < 10; i++) {
    const iph = generarIph()
    if (await verificarIphUnico(iph)) return iph
  }
  throw new Error('No se pudo generar un IPH único después de 10 intentos')
}

function generarFolioCu(): string {
  const y = new Date().getFullYear()
  const rand = String(Math.floor(Math.random() * 90000) + 10000)
  return `CU-${y}-${rand}`
}
async function generarFolioCuUnico(): Promise<string> {
  for (let i = 0; i < 10; i++) {
    const folioCu = generarFolioCu()
    if (await verificarFolioCuUnico(folioCu)) return folioCu
  }
  throw new Error('No se pudo generar un Folio CU único después de 10 intentos')
}
```

Importar `verificarIphUnico`, `verificarFolioCuUnico` desde `@/lib/d1/repository` junto a `verificarFolioDenunciaUnico` (línea 6).

En el handler `POST` (línea 42 en adelante), donde hoy solo se sobreescribe `folioDenuncia`:
```ts
body.folioDenuncia = await generarFolioDenunciaUnico()
```
Agregar, respetando lo que el cliente haya mandado como sugerencia visual pero decidiendo el valor final en servidor — mismo criterio que `folioDenuncia` (el servidor manda, el cliente solo sugiere):
```ts
body.iph = await generarIphUnico()
body.folioCu = await generarFolioCuUnico()
```

Estas líneas van antes de construir el objeto que se pasa a `insertarReporteDenuncia`, para que `clean(body.iph)` y `clean(body.folioCu)` (líneas 57-58) ya reciban el valor generado en servidor, no el que mandó el cliente.

## Criterios de aceptación

1. `npx tsc --noEmit` sin errores.
2. Confirmar contra el esquema real de `ofi_reporte_denuncia` los nombres de columna `iph` y `folio_cu` (o el nombre real si difiere) antes de dar por buena la query — ajustar si no coincide.
3. Crear dos D1 en la misma sesión de prueba y confirmar que `iph`/`folioCu` no colisionan (si se fuerza una colisión con datos de prueba, el reintento debe resolverla sin error visible al usuario).
4. El flujo completo del formulario (etapas 1 y 5) sigue funcionando sin cambios visibles para el usuario — el fix es puramente de integridad de datos en servidor.

**Detenerse aquí y esperar confirmación del usuario antes de pasar a `etapa-8.md`.**
