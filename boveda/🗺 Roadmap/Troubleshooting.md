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
