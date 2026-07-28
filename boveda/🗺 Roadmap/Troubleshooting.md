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

---

## TypeError: dateString.split is not a function

**Síntoma**: `TypeError: dateString.split is not a function` en `calcularSemaforoVigencia` al llamar a `parseISO(fechaVencimiento)`.

**Causa raíz**: El valor obtenido de la base de datos (e.g. `fecha_vencimiento`) es devuelto por el driver `pg` como un objeto `Date` de JavaScript. Al no pasar por un mapper (o cuando la función espera una fecha sin procesar), `parseISO` de `date-fns` recibe el objeto `Date` directamente y falla al intentar llamar a `split` (método de string).

**Fix**:
1. Modificar `calcularSemaforoVigencia` (`lib/prevencion/semaforo.ts`) para aceptar tanto `string` como `Date` (y `null`/`undefined`), y usar `parseISO` solo cuando sea de tipo `string`.
2. Actualizar la función auxiliar `toStr` en `lib/prevencion/mapper.ts` para que convierta las instancias de `Date` a string usando `val.toISOString()` en lugar del comportamiento por defecto `String(val)`.

---

## Error: Objects are not valid as a React child (found: [object Date])

**Síntoma**: `Error: Objects are not valid as a React child (found: [object Date])` al intentar renderizar `/prevencion/medidas`.

**Causa raíz**: Las funciones `getMedidas` y `getMedidasStats` en `lib/prevencion/repository.ts` devolvían las filas resultantes de la consulta PostgreSQL directamente (`result.rows`) sin mapear. Dado que `node-postgres` devuelve las columnas de tipo `DATE` como objetos `Date` nativos, el motor de React fallaba al intentar renderizar `{r.fecha_vencimiento}` directamente en el JSX de la tabla de la página.

**Fix**:
1. Actualizar `getMedidas` y `getMedidasStats` en `lib/prevencion/repository.ts` para mapear el campo `fecha_vencimiento` explícitamente a un string ISO (`YYYY-MM-DD`) cuando es una instancia de `Date`, asegurando que no se entreguen objetos `Date` a los componentes de presentación de la página.

---

## Sonner toast desaparece al navegar entre rutas (App Router)

**Síntoma**: `toast.success()` se ejecuta correctamente (console.log confirma), pero el toast no se muestra visualmente después de una navegación con `router.push()`.

**Causa raíz**: El componente `<Toaster />` de sonner se renderiza en el root layout (`app/layout.tsx`). Durante la navegación cliente con `router.push()`, el layout se re-renderiza con nuevos `children`. En ciertas condiciones (especialmente con un `LoadingProvider` que condiciona `{children}`), el `<Toaster />` se remonta y pierde el estado global de sonner, descartando cualquier toast añadido durante la transición.

**Fix**: No usar sonner para notificaciones que deben persistir a través de navegaciones. En su lugar, inyectar un elemento DOM directamente en `<body>`:

```tsx
const el = document.createElement('div')
el.textContent = `✓ Reporte generado: ${folio}`
Object.assign(el.style, {
  position: 'fixed', top: '20px', right: '20px', zIndex: '2147483647',
  background: '#16a34a', color: '#fff', padding: '16px 24px',
  borderRadius: '4px', fontFamily: 'JetBrains Mono, monospace',
  fontSize: '13px', fontWeight: '600',
  boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
})
document.body.appendChild(el)
setTimeout(() => el.remove(), 5000)
```

---

## `app/reportes_incidentes/page.tsx` solo exigía sesión, sin permiso de sección (2026-07-15)

**Síntoma**: cualquier usuario autenticado (de cualquier rol) podía entrar a `/reportes_incidentes`
directamente por URL, aunque no tuviera el permiso `reportes_ciudadano` que sí protege a sus
páginas hermanas (`d1`, `estadisticos`, `sin_robos`, etc., todas hijas de `/reportes`).

**Causa raíz**: la página nunca tuvo el `tienePermiso(...)` que sus hermanas sí tienen — se coló
al crearla por copiarla de una plantilla incompleta, no una regresión de este refactor.

**Fix**: agregado `if (!(await tienePermiso(session.user.id, 'reportes_ciudadano', 'ver')))
redirect('/dashboard')` en `app/reportes_incidentes/page.tsx`, igual que sus hermanas. Se encontró
auditando las rutas API sin permiso (`app/api/reportes-incidentes/exportar/route.ts` tenía el
mismo hueco) — al revisar la página que consume esa API se vio que tampoco estaba protegida.

**Archivo**: `app/agente_911/ciudadano/incidentes/ToastOnLoad.tsx`

**Alternativas fallidas**: `router.replace` (remonta el componente, pierde `useRef`), `window.history.replaceState` (no remonta pero sonner igual no muestra la toast).

---

## Login se queda cargando eternamente y no redirige al dashboard/rol

**Síntoma**: Al hacer login exitoso (`POST /api/auth/sign-in/email 200`), el navegador se queda congelado mostrando "Cargando tablero..." o el overlay de éxito, y nunca llega a cargar la página de destino. El servidor **nunca recibe** `GET /dashboard`. Afecta a todos los perfiles.

**Causa raíz**: Dos capas independientes que bloquean la navegación post-login:

1. **`app/dashboard/loading.tsx` crea un Suspense boundary** que envuelve `page.tsx`. Cuando el server component ejecuta `redirect('/agente_911')` (u otro rol), el `NEXT_REDIRECT` lanzado dentro del Suspense boundary no se propaga correctamente en algunos escenarios, dejando la página en loading perpetuo.

2. **`window.__showLoader()` desde el login** — el `useEffect` del login llama a `window.__showLoader('Cargando tablero...', 99999)` (definido por `LoadingProvider`). El `setInterval` interno del `LoadingProvider` para animar la barra de progreso causa re-renders del árbol completo, interfiriendo con los `setTimeout` de navegación del login.

**Fix**:

1. Eliminar `app/dashboard/loading.tsx` si existe (no es parte del código base original — nunca fue commiteado).

2. En `app/(auth)/login/page.tsx`, reemplazar el `useEffect` de éxito que usa `__showLoader` por una navegación directa con delay simple:

```tsx
// Antes (roto):
useEffect(() => {
    if (phase !== 'success') return
    const t1 = setTimeout(() => {
      window.__showLoader?.('Cargando tablero...', 99999)
    }, 2800)
    const t2 = setTimeout(() => { window.location.href = fromPath }, 4000)
    return () => { clearTimeout(t1); clearTimeout(t2) }
}, [phase, fromPath])

// Después (funciona):
useEffect(() => {
    if (phase !== 'success') return
    const t = setTimeout(() => { window.location.href = fromPath }, 1200)
    return () => clearTimeout(t)
}, [phase, fromPath])
```

El overlay de éxito cyberpunk del propio login ("Acceso concedido") ya da suficiente feedback visual durante el 1.2s de transición. No se necesita un loader externo.

---

## Ciudadano no puede subir/ver estatus de documentos de liberación — 401 silencioso (2026-07-28)

**Síntoma**: en `/infracciones/[id]` (público, `InfraccionCiudadanoPage`), la sección `SeccionLiberacion` no muestra el estatus de revisión de documentos (`GET /api/via/liberaciones/documentos/[infraccionId]` falla en un `.catch(() => {})` mudo) y `POST /api/via/ciudadano/subir-archivo` regresa 401 al intentar subir/reenviar un documento.

**Causa raíz**: dos endpoints consumidos desde la página pública del ciudadano (sin sesión de staff, solo el JWT de `infraccion_access` emitido tras verificar el PIN) fueron modificados en commits no relacionados a exigir `auth.api.getSession()` de staff:
- `app/api/via/liberaciones/documentos/[infraccionId]/route.ts` — commit `3ec7484` ("Header y Footer Fix", 2026-07-15) le agregó sesión + `verificarRolLiberaciones`.
- `app/api/via/ciudadano/subir-archivo/route.ts` — commit `f35a38e` ("Migración Expediente SSMP", 2026-07-27) le agregó sesión de staff.

Un ciudadano anónimo nunca tiene esa sesión, así que ambos siempre regresaban 401/403 para tráfico real de ciudadanos.

**Fix**: reemplazar la guarda de sesión de staff por `verificarCookieCiudadano(infraccionId)` (`lib/via/auth-ciudadano.ts`), la misma que ya protege la página:
- En `documentos/[infraccionId]/route.ts`: verificar contra el `infraccionId` de la ruta.
- En `subir-archivo/route.ts`: el body solo trae `solicitudId`, así que primero se resuelve el `infraccionId` con la nueva función `obtenerInfraccionIdDeSolicitud(solicitudId)` (`lib/agente_infracciones/repository.ts`) y luego se valida la cookie contra ese id.

---

## Modal "Liberación por infracción" → Guardar y generar orden de pago: null value in column "orden_pago_id" (2026-07-28)

**Síntoma**: al hacer clic en "Guardar y generar orden de pago" en el modal de liberación por infracción, la acción falla con:
```
el valor nulo en la columna «orden_pago_id» de la relación «v2_ordenes_pago_sa7» viola la restricción de no nulo
```

**Causa raíz (síntoma inmediato)**: `generarOrdenPagoAction` (`lib/agente_liberaciones/actions.ts`) llama al servicio externo SA7 (`https://sanjuandelrio.sytes.net:3044/api/sasiete/generar-orden-completa`) y lee el resultado de los headers de la respuesta (`x-orden-pago-id`, `x-estatus`, etc.), pero **nunca validaba `responseSA7.ok`**. Cuando SA7 responde con error, esos headers vienen vacíos y el código igual ejecutaba el `INSERT INTO via.v2_ordenes_pago_sa7` con `orden_pago_id = null`, que es `NOT NULL`.

**Causa raíz real (por qué SA7 devolvía 500)**: en `generarOrdenPagoAction` el default de `descuento` era **0**:
```ts
let descuento = 0
const descuentoNum = Number(descuentoAplicado)
if (descuentoNum) {
  if (descuentoNum === 70) descuento = 0.3
  else if (descuentoNum === 50) descuento = 0.5
  if (cantidad) descuento = cantidad
}
```
Si el usuario no aplicaba 50%/70% de descuento (caso normal: pagar el 100%), `descuento` se quedaba en `0` y se mandaba `cantidades: {"31378": 0}` a SA7 — una cantidad de **cero** para generar la orden, que el servicio rechaza con un 500 genérico (`"No se puede mostrar la página. Error interno en el servidor."`, la página de error default de su servidor, no un JSON con detalle).

La confirmación vino de comparar con `app/api/via/sa7/generar-orden-pago/route.ts:98`, el flujo de creación de infracción que sí funciona: ahí el default es `let descuento = 1` (100%, sin descuento) y solo baja a 0.3/0.5 si aplica.

El mismo patrón (llamar SA7 y confiar en los headers sin chequear `.ok`) también existe en `lib/agente_infracciones/service.ts:69-96` (`procesarCapturaInfractor`), pero ahí está envuelto en un `try/catch` que traga el error silenciosamente y regresa `success: true` sin orden de pago — un bug relacionado, pendiente de revisar (`task_237f3d22`).

**Fix** en `lib/agente_liberaciones/actions.ts`:
1. Default de `descuento` corregido de `0` a `1`, igual que en `generar-orden-pago/route.ts`.
2. Si `!responseSA7.ok`, leer el body (texto/JSON) y regresar `{ ok: false, message }` con el mensaje de SA7, sin tocar la BD (siguiendo el patrón de `obtenerTokenGuest` en `lib/shared/infracciones.ts:31`).
3. Si `orden_pago_id` sigue viniendo nulo aun con `ok`, regresar error igual antes del `INSERT`.

**Bug adicional en el modal (por qué "parecía" funcionar aunque SA7 siguiera fallando)**: `handleFinalizar` en `features/liberaciones/components/RevisionDocumentosSection.tsx` hace dos pasos independientes: (1) `finalizarRevisionAction` — cambia el estatus de la infracción en BD a `PENDIENTE_PAGO`, éxito real e independiente de SA7; (2) `generarOrdenPagoAction` — cuyo resultado **se descartaba sin revisar**. Como `onValidated?.()` se llamaba siempre (sin importar si la orden falló), y el padre (`LiberacionesDashboard.tsx:681`) hace `setRevisionModalId(null)` ahí mismo, el modal se cerraba de inmediato aunque la orden de pago nunca se hubiera generado — dando la impresión de éxito (el registro "desaparece" de la vista porque su estatus sí cambió), cuando en realidad no hay fila en `v2_ordenes_pago_sa7` para ese folio.

**Fix**: capturar el resultado de `generarOrdenPagoAction`; si `!ok`, guardar el mensaje en un estado dedicado (`ordenPagoError`) y **no** llamar a `onValidated?.()` (el modal se queda abierto mostrando un banner rojo con el error en vez del banner verde de éxito).

**Causa raíz definitiva del 500 de SA7 (2026-07-28, segunda vuelta)**: el 500 seguía apareciendo aun con `descuento=1` y con el chequeo de `.ok`. La diferencia real está en cómo se obtiene el `token guest`:
- Los 3 flujos que **sí** funcionan (`app/api/via/sa7/generar-orden-pago/route.ts`, `app/api/via/infracciones/iniciar-proceso/route.ts`, `features/via/saSiete/service.ts`) piden el token a través de la ruta interna `app/api/auth/token-guest/route.ts`. Esa ruta, por un bug de nombres de campo, termina mandándole a SA7 `codigo_invitacion = INV-<año>-<fecha>` (código fijo del día) y `nombre_invitado = INV-<Date.now()>` (**único por request**, tomado del `codigo_invitacion` que mandó el caller).
- Los 2 flujos rotos (`generarOrdenPagoAction` en `lib/agente_liberaciones/actions.ts` y `procesarCapturaInfractor` en `lib/agente_infracciones/service.ts`) usan `obtenerTokenGuest()` (`lib/shared/infracciones.ts`), que llama a SA7 **directo** mandando `codigo_invitacion` y `nombre_invitado` con el **mismo valor repetido** (`INV-<año>-<fecha>`, fijo para todo el día). Con múltiples requests el mismo día, SA7 recibe el mismo "invitado" repetido una y otra vez, lo cual dispara su 500 genérico (`"No se puede mostrar la página. Error interno en el servidor."`).

**Fix** en `lib/shared/infracciones.ts` → `obtenerTokenGuest()`: generar `nombre_invitado` único por llamada (`INV-${Date.now()}`) en vez de reusar el código fijo del día, igual que hace el flujo que sí funciona.

**Contexto**: encontrado auditando el flujo de `InfraccionCiudadanoPage` como Fase 0 de un plan más amplio para exponer esta misma lógica como API para una app Flutter — las fases siguientes reusan `verificarCookieCiudadano` extendido para aceptar también un header `Authorization: Bearer` (ya que Flutter no maneja cookies httpOnly de forma nativa).
