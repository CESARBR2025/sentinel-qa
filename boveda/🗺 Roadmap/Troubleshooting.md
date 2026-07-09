# Troubleshooting

**Propósito**: Errores conocidos y sus soluciones.

---

## Error TS2305: Module has no exported member 'X'

**Síntoma**: `Module '"@/lib/monitorista/detenido-service"' has no exported member 'crearSolicitudFotos'`

**Causa raíz**: Una función fue movida de un archivo a otro durante refactorización (ej: de `detenido-service.ts` a `repository.ts` o `service.ts`).

**Fix**:
1. Encontrar dónde está ahora la función:
   ```bash
   grep -rn "export.*function crearSolicitudFotos\|export.*crearSolicitudFotos" lib/
   ```
2. Actualizar el import en el caller

---

## Error TS2551: Property 'snake_case' does not exist on type 'CamelCase'

**Síntoma**: `Property 'tipo_foto' does not exist on type 'EvidenciaDetenido'. Did you mean 'tipoFoto'?`

**Causa raíz**: El JSX usa `item.tipo_foto` (snake_case de BD) pero el tipo ahora es `item.tipoFoto` (camelCase de TS) después de agregar mapper.

**Fix**: Reemplazar la referencia en JSX:
```diff
- item.tipo_foto
+ item.tipoFoto
```

---

## Error TS2322: Type 'Record<string, unknown>[]' not assignable to 'SomeType[]'

**Síntoma**: `Type 'Record<string, unknown>[]' is not assignable to type 'IncidenteCamara[]'`

**Causa raíz**: El repository devuelve `result.rows` sin mapper. Necesita pasar por `rowTo*()`.

**Fix** en el repository:
```diff
- return result.rows
+ return result.rows.map(rowToIncidenteCamara)
```

---

## Error de INSERT: "INSERT tiene más columnas de destino que expresiones"

**Síntoma**: PostgreSQL error `INSERT has more target columns than expressions`

**Causa raíz**: La query tiene N columnas listadas pero M placeholders (`$1`...`$M`) donde M < N.

**Ejemplo**:
```sql
INSERT INTO tabla (col1, col2, col3) VALUES ($1)  -- 3 columnas, 1 placeholder
```

**Fix**: Contar columnas vs placeholders. Cada columna necesita su `$N`:
```sql
INSERT INTO tabla (col1, col2, col3) VALUES ($1, $2, $3)
```

---

## Google Maps: `useJsApiLoader` crash en React 19 Strict Mode

**Síntoma**: Error de carga del mapa o "Invalid DOM property" al cargar Google Maps.

**Causa raíz**: `useJsApiLoader` recibe un objeto de config que cambia en cada render en Strict Mode (React 19 renderiza dos veces).

**Fix**: Envolver la config en `useMemo`:
```tsx
const config = useMemo(() => ({
  googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY ?? '',
  libraries: ['places'] as Libraries[],
}), [])
const { isLoaded } = useJsApiLoader(config)
```

---

## Error: Cannot find module '@/lib/db/index' (o confusión db.ts vs db/index.ts)

**Síntoma**: Error de import de módulo.

**Causa raíz**: Existen dos archivos:
- `lib/db.ts` → exporta `pool` (default) y `query()`
- `lib/db/index.ts` → exporta instancia de Drizzle para better-auth

**Fix**: 
- App code → importar de `@/lib/db` (el `db.ts`)
- Auth → importar de `@/lib/db/index` (solo `lib/auth.ts`)

```diff
- import { query } from '@/lib/db/index'
+ import { query } from '@/lib/db'
```

---

## Error: build falla con "Module not found: Can't resolve 'drizzle-orm'"

**Síntoma**: Build error al no encontrar drizzle-orm.

**Causa raíz**: `drizzle-orm` debe estar en dependencies porque `better-auth` lo requiere como adapter. Nunca removerlo de package.json.

**Fix**:
```bash
npm install drizzle-orm
```

---

## Error: redirect() called from server action throws error

**Síntoma**: `Error: NEXT_REDIRECT` atrapado por tryAction/tryActionRaw.

**Causa raíz**: `redirect()` lanza un error especial que Next.js intercepta, pero `tryAction/tryActionRaw` lo captura como error normal.

**Fix**: Usar `tryActionRaw` (que re-lanza) en vez de `tryAction` (que captura) cuando la acción hace redirect:
```ts
export async function crearAlgo(formData: FormData) {
  return tryActionRaw(async () => {
    await guardar(formData)
    redirect('/exito')  // ✓ funciona porque tryActionRaw re-lanza NEXT_REDIRECT
  })
}
```

---

## Error: Componente cliente no recibe props correctas de server component

**Síntoma**: Una prop pasada de server component a client component tiene undefined o tipo incorrecto.

**Causa raíz**: El server component usa snake_case en el objeto que pasa, pero el client component espera camelCase.

**Fix**: Verificar que el mapper convierta correctamente. Debug temporal:
```ts
console.log('row raw:', row)
console.log('row mapped:', rowToAlgo(row))
```

---

## Flota: null `placaVehiculo` viola NOT NULL en `numero_unidad`

**Síntoma**: `el valor nulo en la columna «numero_unidad» de la relación «v2_patrullas» viola la restricción de no nulo`

**Causa raíz**: La API externa de flota devuelve campos en snake_case (`placa_vehiculo`), pero `upsertPatrullas` accede a `v.placaVehiculo` (camelCase) obteniendo `undefined`. Ese `undefined` se pasa como NULL al INSERT, violando `NOT NULL` en `numero_unidad`.

**Fix**:
1. Agregar mapper `apiRowToFlotaVehiculo` en `lib/flota/service.ts` que convierta snake_case → camelCase y filtre vehículos sin placa
2. Filtrar vehículos sin `placaVehiculo` en `upsertPatrullas` (`lib/flota/repository.ts`)

```ts
function apiRowToFlotaVehiculo(raw: Record<string, unknown>): FlotaVehiculoRaw | null {
  const placaVehiculo = String(raw.placa_vehiculo ?? raw.placaVehiculo ?? '').trim()
  if (!placaVehiculo) return null
  return {
    placaVehiculo,
    numSerie: String(raw.num_serie ?? raw.numSerie ?? ''),
    marca: String(raw.marca ?? ''),
    modelo: String(raw.modelo ?? ''),
    color: String(raw.color ?? ''),
    tipoVehiculo: String(raw.tipo_vehiculo ?? raw.tipoVehiculo ?? ''),
    secretaria: String(raw.secretaria ?? ''),
    idVehiculo: Number(raw.id_vehiculo ?? raw.idVehiculo ?? 0),
  }
}
```

---

## Google Maps: `useJsApiLoader` con `id` inconsistente entre componentes

**Síntoma**: `Loader must not be called again with different options. {"id":"script-loader",...} !== {"id":"google-map-script",...}`

**Causa raíz**: Algunos componentes usan `id: 'google-map-script'` explícito en `useJsApiLoader`, mientras que otros omiten el `id` y obtienen el default `script-loader`. `@react-google-maps/api` lanza error si el loader se inicializa con opciones diferentes.

**Fix**: Unificar el `id` en todos los llamados a `useJsApiLoader`:
```tsx
const { isLoaded } = useJsApiLoader({
  id: 'google-map-script',
  googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? '',
  libraries: ['places'],
})
```

**Archivos afectados** (8 componentes):
- `features/via/oficiales/components/MapaDireccionRegistro.tsx`
- `features/via/infracciones/components/MapSectionCiudadano.tsx`
- `components/shared/DetalleInfraccionView.tsx`
- `components/denuncias/FormularioD1.tsx`
- `components/911/radio/FormSection.tsx`
- `components/maps/GoogleMapPicker.tsx`
- `components/911/whatsapp/RegistroIncidenteForm.tsx`
- `app/911/ciudadano/Formulario911.tsx`
