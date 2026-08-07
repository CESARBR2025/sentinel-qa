# Troubleshooting

**Propósito**: Errores conocidos y sus soluciones.

---

## Bloque "Despachado:" duplicado en el detalle del tablón (2026-08-07) — CORREGIDO

**Síntoma**: al expandir el "Detalle del incidente" de una card en `/agente_911/despacho`, la fecha de despacho aparecía dos veces ("Despachado: ..." y "Despachado: ..." idénticas).

**Causa raíz**: en `components/911/despacho/TablonDespacho.tsx`, la función `DetalleIncidente` renderizaba dos `<div>` consecutivos e idénticos con `card.fechaHoraDespacho` (quedó un bloque duplicado al añadir el primero).

**Fix (2026-08-07)**: eliminado el segundo bloque durante el rediseño UI de la card; además, en la tab Atendidos la fecha ya se muestra en la meta-línea del header, así que el detalle recibe `omitirDespachado` para no repetirla.

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

## Flota: sincronización externa retirada (obsoleto)

La API externa `proyecto-flota.vercel.app` fue retirada (2026-08-03). El catálogo de `via.v2_patrullas` se mantiene con el CRUD de `/dashboard/catalogos/patrullas`; el importador Excel (botón + acción + CLI) fue retirado el 2026-08-03. La entrada anterior sobre `apiRowToFlotaVehiculo` / `upsertPatrullas` (snake_case → NULL) ya no aplica.

---

## Flota: modal "Unidades cercanas al hecho" sin oficiales

**Síntoma**: las cards de unidad aparecen con "Sin tripulación asignada" (o el modal queda vacío).

**Causa raíz**: al migrar el parque vehicular (migration `0027`), `ofi_oficiales.patrulla_id` se limpió a NULL y el re-import generó **ids uuid nuevos** en `v2_patrullas`; ningún oficial quedó vinculado a una patrulla. Sin `patrulla_id`, el `LEFT JOIN` de `listarUnidadesConTripulacionRaw` no enlaza oficiales (`oficiales: []`) y, sin oficial asignado con `ultima_lat`/`ultima_lng`, las unidades no pasan el filtro de distancia de `listarUnidadesParaDespacho`.

**Fix**: re-asignar `ofi_oficiales.patrulla_id` a los ids vigentes de `via.v2_patrullas` (ej. migration `0029_asignar_oficiales_patrulla.sql` para datos de prueba). Tras reimportar el parque vehicular siempre hay que re-asignar la tripulación.

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

## `app/reportes_incidentes/page.tsx` solo exigía sesión, sin permiso de sección (2026-07-15) — CERRADO

**Síntoma**: cualquier usuario autenticado (de cualquier rol) podía entrar a `/reportes_incidentes`
directamente por URL, aunque no tuviera el permiso `reportes_ciudadano` que sí protege a sus
páginas hermanas (`d1`, `estadisticos`, `sin_robos`, etc., todas hijas de `/reportes`).

**Causa raíz**: la página nunca tuvo el `tienePermiso(...)` que sus hermanas sí tienen — se coló
al crearla por copiarla de una plantilla incompleta, no una regresión de este refactor.

**Fix (2026-07-15)**: agregado `if (!(await tienePermiso(session.user.id, 'reportes_ciudadano', 'ver')))
redirect('/dashboard')` en `app/reportes_incidentes/page.tsx`, igual que sus hermanas. Se encontró
auditando las rutas API sin permiso (`app/api/reportes-incidentes/exportar/route.ts` tenía el
mismo hueco) — al revisar la página que consume esa API se vio que tampoco estaba protegida.

**Cierre definitivo con defensa en profundidad (2026-08-04, plan auditoría-URL)**: además del fix
puntual, el check grueso de sección ahora vive en `proxy.ts` vía el mapa
`lib/permisos/mapa-secciones.ts` + el endpoint `/api/auth/secciones-permitidas`. Cualquier ruta
bajo un prefijo del mapa (incluido `/reportes_incidentes` → `reportes_ciudadano`) se bloquea desde
el proxy con `redirect('/dashboard')` si el rol del usuario no tiene `puede_ver` en la sección,
aunque la página no tenga su propio `tienePermiso`. Esto cierra la clase de bug completa (páginas
que solo dependen de "hay sesión"), no solo el caso puntual.

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

---

## Dashboard de liberaciones pierde casos completos (corregido)

**Síntoma**: Al agente rechazar un documento, o al fallar la generación del PDF/correo post-pago, el caso desaparecía del dashboard.

**Causa raíz**: El switch de tabs en `LiberacionesDashboard.tsx` usaba `default: return false` con filtros restrictivos que no incluían:
- `MESA_DE_CONTROL_RECHAZADA` en la tab "En espera de documentos"
- `LIBERACION_EN_PROCESO` y `LIBERACION_PENDIENTE_DOCUMENTOS` en la tab "Pendiente pago"

**Fix**: Se introdujo `TAB_ESTATUS` (mapa centralizado `Record<EstatusLiberaciones, string[]>`) que gobierna los 3 sitios donde se filtra por estatus (switch de `registrosFiltrados`, `useMemo` de `estadisticas`, `STATUS_BADGE`). Los nuevos badges:
- `MESA_DE_CONTROL_RECHAZADA` → "Rechazado — reenviando" (rojo)
- `LIBERACION_EN_PROCESO` → "Procesando pago" (ámbar)
- `LIBERACION_PENDIENTE_DOCUMENTOS` → "Requiere atención" (ámbar)

El botón "Revisar documentos" ahora también aparece para `MESA_DE_CONTROL_RECHAZADA`.

---

## Ciudadano no puede completar subida de documentos si se interrumpe (corregido)

**Síntoma**: Si la subida se interrumpía después del documento 1 o 2 de N (red, tamaño de archivo, cierre accidental), el formulario de subida desaparecía para siempre.

**Causa raíz**: `SeccionLiberacion.tsx` originalmente ocultaba el formulario con `!tieneDocs` (si ya existía al menos 1 documento). Al interrumpirse la subida a medias, `tieneDocs` pasaba a `true` y el formulario no se volvía a mostrar, aunque la infracción siguiera en `MESA_DE_CONTROL_PENDIENTE_DOCS`.

**Fix**: El gate del formulario ahora usa `estatusDependencia === 'MESA_DE_CONTROL_PENDIENTE_DOCS'` sin importar si hay documentos parciales. El estatus lo controla el servidor (`finalizarRevisionAction` lo cambia a `MESA_DE_CONTROL_REVISION` solo cuando el agente aprueba todos).

---

## Ciudadano podía pagar antes de que existiera revisión de documentos (corregido)

**Síntoma**: Se creaba una orden de pago SA7 real mientras el estatus seguía en `MESA_DE_CONTROL_PENDIENTE_DOCS`.

**Causa raíz**: `CapturarInfractorSection.tsx` (tab 1) originalmente llamaba `generarOrdenPagoAction` inmediatamente tras guardar datos del infractor, sin esperar a que existieran documentos ni revisión.

**Fix**: 
- `CapturarInfractorSection.tsx` ya no llama `generarOrdenPagoAction` — solo guarda datos y pasa a tab 2.
- `generarOrdenPagoAction` ahora tiene guard server-side que exige `estatus_dependencia === 'PENDIENTE_PAGO_LIBERACION'`.
- `confirmar-liberacion/route.ts` ahora exige `PENDIENTE_PAGO_LIBERACION`, `LIBERACION_EN_PROCESO` o `LIBERACION_PENDIENTE_DOCUMENTOS` antes de consultar SA7.

---

## Dashboard muestra infracciones no vehiculares en tabs de liberación (corregido)

**Síntoma**: Un ciudadano no podía subir documentos desde la vista pública, aunque el dashboard del agente mostraba la infracción en "En espera de documentos".

**Causa raíz**: `obtenerLiberaciones` (`lib/agente_liberaciones/repository.ts`) no filtraba por `tipo_garantia`. Infracciones con `tipo_garantia = 'PLACA'` (o TARJETA/LICENCIA) cuyo `estatus_dependencia` coincidía con los valores de liberación aparecían en el dashboard, pero la vista pública solo renderiza `SeccionLiberacion` cuando `tipo_garantia === 'VEHICULO'` (`app/infracciones/[id]/page.tsx:340`). El ciudadano veía el estatus "pendiente de documentos" sin poder subir nada.

Adicionalmente, `capturarInfractorAction` no validaba `tipo_garantia`, permitiendo que un agente procesara infracciones no vehiculares por el flujo de liberación.

**Fix**:
- `obtenerLiberaciones`: agregado `AND tipo_garantia = 'VEHICULO'` a la query del dashboard.
- `capturarInfractorAction`: agregado SELECT previo que verifica `tipo_garantia` antes de mutar estatus; devuelve error si no es `'VEHICULO'`.

---

## Botón "Descargar orden de salida" no aparece aunque la infracción esté liberada (corregido)

**Síntoma**: Un ciudadano veía "Vehículo liberado" en la página, pero no había botón para descargar la orden de salida.

**Causa raíz**: El botón de descarga (línea 944 de `SeccionLiberacion.tsx`) estaba gated por `urlOrdenSalida && urlOrdenSalida !== 'NO_DATA'`. Si `confirmar-liberacion` no logró guardar el PDF en Expediente (error de subida, flujo alternativo que liberó sin pasar por `confirmar-liberacion`), `url_orden_salida_liberaciones` quedaba como `null` y el botón no se renderizaba.

**Fix**:
- Creado `GET /api/via/descargar-orden/[infraccionId]` que genera el PDF on-demand si no existe, lo guarda en Expediente y lo sirve como descarga. Reusa toda la infraestructura existente (`subir()`, `parsearRef()`, `generarOrdenSalidaVehiculo`, etc.).
- `SeccionLiberacion.tsx` ahora muestra una sección principal destacada cuando `esLiberada === true`, con botón de descarga apuntando a la nueva ruta — sin depender de `url_orden_salida_liberaciones`.

---

## Agente podía revisar la solicitud de liberación equivocada si el ciudadano reintentaba la subida (corregido)

**Síntoma**: encontrado auditando `INSTRUCCIONES-INFRACCIONES.md` para confirmar que estuviera listo para el dev de Flutter (2026-07-29). No reportado aún por un agente real, pero reproducible: si un ciudadano interrumpe la subida de documentos (después del fix de "Ciudadano no puede completar subida..." de arriba, que permite reintentar) y vuelve a enviar el formulario, `POST /api/via/ciudadano/iniciar-solicitud` crea una **segunda** fila en `via.v2_solicitudes_liberacion` para la misma infracción — no hay ningún control de unicidad ni en la API ni en la tabla (`infraccion_id` no es único).

**Causa raíz**: dos consultas que buscan "la solicitud de esta infracción" usaban `LIMIT 1` **sin `ORDER BY`**, por lo que con dos filas Postgres podía devolver cualquiera de las dos de forma no determinista:
- `lib/agente_infracciones/repository.ts` → `obtenerSolicitudLiberacion` (usada por `GET /api/via/liberaciones/documentos/[infraccionId]`, el endpoint que consulta tanto la web ciudadana como la futura app Flutter para ver estatus de revisión).
- `lib/agente_liberaciones/actions.ts` → consulta inline de `solicitud` dentro de `obtenerDocumentosLiberacion` (usada por `RevisionDocumentosSection.tsx`, la pantalla donde el agente de liberaciones revisa documentos).

En cambio `finalizarRevisionAction` (mismo archivo) sí hacía bien `ORDER BY created_at DESC LIMIT 1`. La inconsistencia entre "qué documentos ve el agente para revisar" (la consulta sin orden, podía traer la solicitud vieja/incompleta) y "qué documentos finaliza" (la consulta con orden, siempre la más reciente) podía hacer que el agente aprobara/rechazara documentos de la solicitud equivocada mientras la solicitud real quedaba sin revisar.

**Fix**: agregado `ORDER BY created_at DESC LIMIT 1` a ambas consultas, igual que ya hacía `finalizarRevisionAction`.

**Pendiente (no corregido, decisión consciente de alcance)**: la causa raíz de fondo —`iniciar-solicitud` sigue sin ser idempotente, cada llamada crea una fila nueva sin revisar si ya existe una— no se corrigió en esta pasada. El fix de arriba hace que las lecturas sean siempre consistentes (ya no hay riesgo de revisar la solicitud equivocada), pero seguirán quedando filas huérfanas en `v2_solicitudes_liberacion` si un ciudadano reintenta la subida. Documentado en `INSTRUCCIONES-INFRACCIONES.md` sección 7.1 como advertencia para que la app Flutter persista `solicitudId` localmente y evite el problema desde el diseño, en vez de depender de que el servidor lo prevenga.

---

## Vista responsive: contenido descuadrado + "cuadro negro" en el header

**Síntoma**: en pantallas angostas (móvil/tablet) la vista "se rompe": el header se descuadra, hay scroll horizontal y aparece un cuadro negro alrededor del header con el botón de "Cerrar sesión".

**Causa raíz**: la app era desktop-only (una sola `@media` en `globals.css`, la de `.fk-grid`; sin `useMediaQuery`). `DashboardHeader` (`components/partials/Header.tsx`) era sticky con `padding: 0 64px`, logo 64px, título 56px, bloque de usuario y `backdropFilter: blur(10px)` y **desbordaba** el viewport en móvil. El blur sobre un sticky con contenido que se desborda es un artefacto conocido de pintado: el navegador (Safari/Chrome móvil) pinta un **rectángulo negro**. Mismo problema aplicaba a `SubHeader` (padding 0 48px) y a los contenedores de página (`padding: 40px 48px/64px`).

**Fix** (2026-08-03):
1. Nuevo hook `hooks/useMediaQuery.ts` (SSR-safe, arranca desktop y se ajusta tras hidratar). Breakpoint de la app: `(max-width: 720px)`.
2. `DashboardHeader` responsive: padding `0 16px`, logo 32, título 24, se ocultan "Sistema Táctico", bloque de usuario y la navegación `children`; botón volver solo con flecha; **`backdropFilter: none` en móvil** (elimina el cuadro negro).
3. `SignOutButton` compacto en móvil ("Salir →") — afecta también a `SubHeader`.
4. `SubHeader` responsive: padding `0 12px`, título 16, oculta módulo/operador en móvil.
5. Clases `.pad-pagina` (40px 48px) y `.pad-dashboard` (40px 64px) en `globals.css`, colapsando a `20px 16px` en `@media (max-width:720px)`; aplicadas a `app/dashboard/page.tsx` y a los `<main>` de `app/admin/layout.tsx`, `app/dashboard/catalogos/layout.tsx`, `app/prevencion/layout.tsx`.

**Nota**: sigue siendo una app pensada para desktop; el modo móvil es funcional pero degradado (nav de /admin oculta en el header, tablas pueden requerir scroll horizontal).

---

## Área negra en el footer (desbordamiento horizontal)

**Síntoma**: en una vista con fondo claro aparece una franja/área negra, típicamente en la zona del footer o en el borde derecho de la pantalla.

**Causa raíz**: `<html>` y `<body>` tienen `background: '#070b16'` (casi negro, `app/layout.tsx`). El contenedor de la página usa `background: #f8fafc` + `min-height: 100vh`, pero **no cubre el contenido que se desborda horizontalmente**: los elementos que sobrepasan el ancho del viewport dejan ver el fondo negro del `body` a la derecha. En la zona del footer (texto corto centrado) la franja es más evidente. El `<footer>` en sí no tiene el problema.

**Caso concreto corregido (2026-08-03)**: `/oficial/despachos/[id]` con incidente `en_sitio` renderizaba `FormularioRecorrido`, cuyos grids `repeat(3,1fr)` y filas flex fijas desbordaban en ≤720px. Ver `Changelog.md` (entrada "Despacho oficial / reporte de recorrido"). Al corregir el desbordamiento el área negra desaparece.

**Cómo detectarlo**: en modo responsive (≤720px), buscar `document.documentElement.scrollWidth > clientWidth` o un elemento que sobresalga del viewport; el fondo negro del `body` es la señal visual de overflow.

**Prevención**: (1) usar `.grid-2`/`.grid-3` y `flexWrap: 'wrap'` (regla Responsive); (2) como red de seguridad, `overflowX: 'clip'` en el `<main>` de la página (no rompe el `position: sticky` del header, a diferencia de `overflow: hidden`). No usar `overflow: hidden` en contenedores con tablas.

---

## Botón de submit "no hace nada" — `required` nativo dentro de `display:none` bloquea el submit en silencio

**Síntoma**: el usuario pulsa el botón de envío (submit) de un formulario stepper y "no pasa nada": no se dispara `onSubmit`, no hay mensaje de error visible. Solo hay un warning en consola tipo `An invalid form control with name='X' is not focusable`.

**Causa raíz**: formularios stepper implementados como **un solo `<form>`** con los pasos superpuestos vía `display: step === N ? ... : 'none'` (todos los inputs quedan montados en el DOM siempre, solo se ocultan visualmente). Si un campo con `required` nativo vive en un paso distinto al activo y queda inválido, al hacer submit el navegador ejecuta la validación HTML5 nativa sobre todo el formulario; el campo oculto (`display:none`) no es "focusable" para mostrar el mensaje de validación nativo, así que el navegador **bloquea el submit sin disparar `onSubmit` y sin mostrar error**. Desde la UI se percibe exactamente como "el botón no hace nada".

**Encontrado en**: `components/denuncias/FormularioD1.tsx` — el campo `delito` tenía `required` nativo y vivía en el bloque del paso 3 (`display: none` cuando el step activo es 4), bloqueando el botón "FINALIZAR REPORTE D1" del paso 4 siempre que `delito` quedara vacío.

**Fix (2026-08-04)**:
1. No usar `required` nativo en campos que puedan quedar ocultos entre pasos. Si se quiere conservar la señal visual de obligatorio, separar la responsabilidad: en `SentinelField` se agregó la prop `requiredVisual` (solo dibuja el asterisco rojo) distinta de `required` (el atributo HTML nativo).
2. Validar manualmente antes de avanzar de paso: al pulsar SIGUIENTE/FINALIZAR en el paso donde vive el campo obligatorio, leer su valor (el campo es no controlado, se lee vía `e.currentTarget.form` + `FormData` o `form.elements.namedItem(...)`) y, si está vacío, no avanzar y mostrar un mensaje de error visible en el paso donde el campo sí es visible.

**Revisar si otros formularios stepper del proyecto** (`FormularioRecorrido.tsx`, etc.) tienen el mismo patrón de `required` nativo en pasos ocultos.

---

## `fetch` a una API regresa HTML en vez de JSON — el proxy bloquea la ruta por sección

**Síntoma**: el formulario hace `fetch('/api/...')` y `res.json()` lanza `SyntaxError: Unexpected token '<', "<!DOCTYPE "... is not valid JSON`. La petición del formulario "no guarda" pero el handler nunca se ejecuta (no hay error server-side en la API).

**Causa raíz**: `proxy.ts` hace un check grueso de sección (`seccionesRequeridasPara` + `/api/auth/secciones-permitidas`). Si la ruta API está mapeada en `lib/permisos/mapa-secciones.ts` a una sección que el rol del usuario NO tiene, redirige a `/dashboard` (un 307). El `fetch` del navegador sigue el redirect, recibe la página HTML de `/dashboard`, y `res.json()` truena al intentar parsear HTML.

**Caso real (2026-08-04)**: el rol "Oficial de Campo" tiene `oficial_campo` pero NO `reportes_ciudadano`. La página `/denuncia/nuevo` está mapeada a `oficial_campo` (el oficial sí entra), pero `POST /api/reportes-d1` estaba mapeado solo a `reportes_ciudadano` → el proxy redirigía a `/dashboard` y el botón "FINALIZAR REPORTE D1" "no guardaba" con el error de JSON de arriba (enmascarado tras el fix del `required` de la etapa 1). **Fix**: `'/api/reportes-d1': ['reportes_ciudadano', 'oficial_campo']`.

**Regla**: al agregar un endpoint API que consume un formulario, revisar que las secciones mapeadas en `mapa-secciones.ts` incluyan el rol que usa ese formulario — no solo el módulo de consulta/reportes. Un redirect del proxy se percibe como "el botón no hace nada / no guarda" sin error claro.

---

## Error TS2322 "Type 'unknown' is not assignable to type 'ReactNode'" — pero la línea que señala TS no es la causa real

**Síntoma**: `npm run build` falla en la fase "Running TypeScript" con `Type 'unknown' is not assignable to type 'ReactNode'` apuntando a un `{variable && (...)}` que, leído directamente, es un `boolean && JSX.Element` perfectamente válido (`ReactNode` sí incluye `boolean`, verificado en `node_modules/@types/react/index.d.ts`).

**Causa raíz**: en algún punto **más abajo, dentro del mismo bloque de `return` JSX**, hay otra condición del tipo `{expr && (...)}` donde `expr` es realmente `unknown` (típicamente `(objeto as Record<string, unknown>).campo` sin envolver, cuando `objeto` viene tipado como `Record<string, unknown>` — patrón común en vistas que leen `raw: Record<string, unknown>` de una query SQL cruda). TypeScript reporta el error de tipo en la posición del **primer** `{cond && (...)}` del bloque de children en vez de en la línea real del `unknown` — no confiar en la línea exacta que da `tsc`/`next build` cuando el código de esa línea se ve correcto a simple vista.

**Caso real (2026-08-05)**: `components/fiscalia/ExpedienteView.tsx`. `tsc` señalaba la línea 157 (`{tieneDatosCapturados && (...)}`, `tieneDatosCapturados` es un `!!(...)` genuino, boolean confirmado). La causa real estaba en la línea 237, ~80 líneas más abajo en el mismo `return`: `{(r as Record<string, unknown>).pd_id && (...)}` — sin envolver en `Boolean(...)`. El mismo archivo ya tenía el patrón correcto 26 líneas después (línea 263): `{Boolean((r as Record<string, unknown>).pd_id) && (...)}` — la pista para encontrar el fix fue comparar los dos usos del mismo campo `pd_id`.

**Cómo diagnosticar** (en vez de adivinar por la línea reportada):
1. `grep -n "as Record<string, unknown>).*&&\|unknown.*&&" archivo.tsx` — buscar condiciones `&&` sobre valores casteados a `unknown`/`Record<string, unknown>` sin `Boolean(...)`/`!!` envolviendo.
2. Si hay dudas sobre si una variable específica es el problema, aislarla temporalmente con `const _debug: boolean = variable` justo después de su definición y volver a correr `tsc --noEmit` — si no hay error ahí, la variable no es la causa, hay que seguir buscando en el resto del bloque `return`. Revertir el debug antes de cerrar.

**Fix**: envolver la condición en `Boolean(...)`:
```diff
- {(r as Record<string, unknown>).pd_id && (
+ {Boolean((r as Record<string, unknown>).pd_id) && (
```

**Prevención**: al leer un campo de un objeto tipado `Record<string, unknown>` (común en vistas que consumen `raw` de `ExpedienteExp` u objetos similares de queries SQL crudas) para usarlo como condición de renderizado JSX, envolver siempre en `Boolean(...)` — nunca dejar el valor `unknown` crudo antes del `&&`.

---

## Pre-commit falla: `react-hooks/refs` — "Cannot update ref during render" (hooks/usePolling.ts)

**Qué es el bloqueo del commit (memorizar — no volver a investigar de cero)**:

El hook de pre-commit es `husky` → `.husky/pre-commit`, que corre **dos comandos en secuencia**:
1. `npx lint-staged` — según `package.json`, `lint-staged` corre `eslint --fix` sobre los archivos staged que matcheen `*.{js,mjs,ts,tsx,jsx}`. **ESTO es lo que más falla.**
2. `npm run check:responsive` — auditoría de la REGLA Responsive (grids inline multicolumna), no toca ESLint.

Cuando un commit falla, el mensaje `husky - pre-commit script failed (code 1)` viene de uno de estos dos. El culpable típico es `lint-staged` → `eslint`.

**De dónde sale la regla `react-hooks/refs`**: NO está en `eslint.config.mjs` (ese archivo solo define la regla custom `responsive/no-inline-multicol-grid` y junta configs de next). La regla entra **transitivamente** vía `eslint-config-next` (`eslint.config.mjs` importa `nextVitals` + `nextTs` de `eslint-config-next/*`), que carga el plugin `react-hooks` con las reglas nuevas (v5/6). Por eso un archivo que "antes pasaba" puede fallar tras actualizar `eslint-config-next` sin tocar la config del proyecto.

**Síntoma**:
```
hooks/usePolling.ts
  6:3  error  Error: Cannot update ref during render
  const fnRef = useRef(fn)
> fnRef.current = fn
      ^^^^^^^^^^^^^ Cannot update ref during render   react-hooks/refs
```

**Causa raíz**: el patrón "ref que siempre apunta a la última función" (`const ref = useRef(fn); ref.current = fn` en el cuerpo del componente) asigna `.current` **durante el render**. La regla `react-hooks/refs` lo prohíbe: los refs no deben leerse/escribirse durante el render. Nota: `useRef(fn)` como inicializador sí está bien; lo prohibido es la **asignación** `ref.current = X` en el cuerpo.

**Fix idiomático en React 19** (este repo usa `react@19.2.4`, que exporta `useEffectEvent` en runtime y en `@types/react`): reemplazar el ref-para-latest por `useEffectEvent`, que siempre invoca la última versión de `fn` sin re-ejecutar el efecto cuando `fn` cambia de identidad por render:

```ts
'use client'
import { useEffect, useEffectEvent, useRef } from 'react'

export function usePolling(fn: () => void, intervalMs: number, activo = true) {
  const onTick = useEffectEvent(fn)   // siempre llama la última fn
  const yaActivadoAntesRef = useRef(false)  // se escribe SOLO dentro del useEffect, ok

  useEffect(() => {
    if (!activo) return
    if (yaActivadoAntesRef.current) onTick()  // refetch inmediato al recuperar visibilidad
    yaActivadoAntesRef.current = true
    const id = setInterval(() => onTick(), intervalMs)
    return () => clearInterval(id)
  }, [intervalMs, activo])
}
```

**Trampa de `lint-staged` que más tiempo roba**: `lint-staged` corre sobre el contenido **staged en git**, NO sobre el working tree. Si editas/arreglas el archivo pero no vuelves a `git add`, el hook sigue viendo la versión vieja y falla igual. **Siempre `git add` de nuevo tras el fix** y re-correr `npx lint-staged` a mano para verificar antes de intentar el commit.

**Cómo diagnosticar rápido un pre-commit roto**:
1. `git diff --cached --name-only` — ver qué está staged (lint-staged solo ve esto).
2. Correr el paso que falla directo, sin pasar por git: `npx lint-staged` (o `npm run check:responsive` si el mensaje apunta a la REGLA Responsive).
3. `npx eslint <archivo-señalado>` — reproducción más chica; el error apunta al archivo y línea exactos.
4. Si el error es de una regla react-hooks/refs sobre `ref.current = ...` en el cuerpo del componente → aplicar `useEffectEvent` (o mover la asignación a un `useEffect` si `useEffectEvent` no aplica). Verificar luego `npx tsc --noEmit` y `npm run build` (el cambio de mecanismo interno de un hook compartido como `usePolling` debe compilar con todos sus consumidores).

**Prevención**: no escribir `ref.current = X` en el cuerpo de componentes/hooks — si el objetivo es "tener la última versión de algo dentro de un effect/interval", usar `useEffectEvent` (React 19+). Las asignaciones a refs van solo dentro de effects, event handlers o callbacks.

---

## Tabla de KPI Incidencias vacía al abrir la vista (falta carga inicial)

**Síntoma**: `/agente_despacho/kpi-incidencias` abre con la tabla mostrando "Sin incidencias en el rango seleccionado" y sin tarjetas KPI, aunque la BD tenga incidentes en las últimas 24 h. Los datos solo aparecen tras presionar "Actualizar" o un preset.

**Causa raíz**: `KpiIncidenciasView` (`components/911/kpi/KpiIncidenciasView.tsx`) inicializaba `incidentes=[]` y `kpi=null`, y `recargar` solo se disparaba desde `FiltrosRangoKpi` (botón Actualizar / presets). **No existía ninguna consulta al montar**, así que el rango default (últimas 24 h) nunca se consultaba automáticamente.

**Fix**: agregar la carga inicial en el montaje:
```ts
// El rango default (últimas 24 h) debe consultarse apenas se abre la vista.
useEffect(() => { recargar(filtrosIniciales()) }, [recargar])
```

**Verificación**: la query del rango default devuelve datos (`SELECT count(*) FROM incidentes WHERE fecha_hora_inicio >= now() - interval '24 hours'`). Si esto da 0, el problema no es este — revisar el filtro de estatus/canal o el rango de fechas.

---

## REGLA Responsive: `overflow:'hidden'` en archivos con tabla (auditor `check:responsive`)

**Síntoma**: `npm run check:responsive` marca como NUEVA un archivo en la categoría `overflow:'hidden' en archivo con tabla` (gate de pre-commit, exit 1).

**Causa raíz**: el detector `scripts/audit-responsive.mjs` (`overflowHidden`) marca cualquier archivo que contenga `(<table|>tabla|Tabla)` **y** el literal `overflow: 'hidden'`. Ojo: importar `TablaIncidencias` (palabra "Tabla") o un `overflow: 'hidden'` en texto/barra ya dispara la regla, no solo contenedores.

**Fix**:
1. En contenedores de card/panel que recortan un radio → usar **`overflow: 'clip'`** (recorta sin crear scroll container y no rompe el scroll horizontal interno de `.tabla-wrap`). Soporte: Chrome 90+, Safari 16+, Firefox 81+.
2. En celdas con `text-overflow: ellipsis` → `overflow: 'clip'` funciona igual (spec: text-overflow aplica con hidden/clip/scroll).
3. En `TablaIncidencias`, al quitar `overflow:'hidden'` de la `<section>` con radio, dar `borderRadius` superior al header y `'0 0 var(--radius-lg) var(--radius-lg)'` al footer de paginación para conservar el recorte visual.
4. Verificar con `npm run check:responsive` → debe dar `0 NUEVA(S)`.

**No** agregar el archivo a `scripts/responsive/exceptions.json` (amplía deuda) salvo que sea estrictamente necesario.

---

## Alerta crítica de notificaciones sigue apareciendo con el incidente ya resuelto

**Síntoma**: el toast de "Alerta crítica" (`AlertaCriticaToast`, evento `despacho.asignado`) sigue mostrándose para un incidente que ya está en "Atendidos"/cerrado.

**Causa raíz**: el estado de lectura de una notificación (`notificaciones_lecturas`) vive completamente desacoplado del estatus de la entidad a la que se refiere (`incidentes.estatus`). Cerrar/resolver un incidente (`atendido`, `cerrado_detencion`) no marcaba como leídas las notificaciones ligadas a él (`entidad_tipo='incidente'`), así que `criticaMasRecienteSinLeer` (`lib/notificaciones/repository.ts`) la seguía devolviendo indefinidamente. Se agrava con el hecho de que `CampanillaNotificaciones` se remonta en cada navegación (ver nota abajo), lo que reactiva la alerta cada vez que cambias de página.

**Fix**: `lib/notificaciones/repository.ts` expone `marcarLeidasPorEntidad(entidadTipo, entidadId)` — inserta la lectura para todos los destinatarios (`user_id` directo o cada miembro del `rol_id`) de las notificaciones ligadas a esa entidad. Se llama en los dos puntos donde un incidente pasa a estado cerrado:
- `lib/oficial/repository.ts` (`crearReporteCampo`, tras el `COMMIT` de la transacción que cierra el reporte de campo).
- `lib/incidentes/actions.ts` (`cerrarPorDetencion`).

Si se agrega un nuevo flujo que cierre un incidente (nuevo `UPDATE incidentes SET estatus = 'atendido'|'cerrado_detencion'`), debe llamar también a `marcarLeidasPorEntidad('incidente', incidenteId)`.

**Nota relacionada — CORREGIDA (2026-08-07)**: `DashboardHeader` (y por tanto `CampanillaNotificaciones`) se importa directo en ~76 `page.tsx` en vez de vivir en un layout raíz persistente — cada navegación desmontaba/remontaba el componente, reiniciando el `setInterval` de polling (30s) y reseteando `criticaVistaRef`/`previoRef`. En vez de mover `DashboardHeader` a un layout compartido (cambio grande, riesgoso para ~76 páginas con props por página), se extrajo el estado a `components/notificaciones/NotificacionesProvider.tsx` — un Context Provider montado **una sola vez** en `app/layout.tsx` (el layout raíz sobrevive a la navegación cliente del App Router). `CampanillaNotificaciones` quedó como componente de UI puro (`useNotificaciones()`), sin dueño del `setInterval`/refs — el polling, el conteo previo y el id de la última crítica vista ahora persisten sin importar cuántas veces se remonte el botón de la campanita. El provider gatea el polling con `authClient.useSession()` (no corre en `/login` u otras páginas públicas). `AlertaCriticaToast` también se renderiza una sola vez desde el provider, no desde cada instancia de `CampanillaNotificaciones` (antes `Header.tsx` y `SubHeader.tsx` podían montarla por separado).

---

## Botón "Más detalles del reporte" en el tablón de despacho no lleva a ningún lado (rol despachador)

**Síntoma**: en `/agente_911/despacho`, tab "Atendidos" (o cualquier tab), el botón "Más detalles del reporte →" de una tarjeta de canal ciudadano/teléfono no muestra la ficha — visualmente "no pasa nada" (en realidad sí navega, pero termina rebotado a `/dashboard`, que para el rol despachador redirige de vuelta a su propio hub, dando la sensación de que el botón no hizo nada).

**Causa raíz**: `TablonDespacho.tsx` arma el link según el canal del incidente — `/agente_911/ciudadano/incidentes/[id]` (teléfono, default), `/agente_911/whatsapp/incidentes/[id]` o `/agente_911/rondin/incidentes/[id]`. Las tres páginas de detalle tienen guardas de permiso **inconsistentes**:
- whatsapp y rondin: `tienePermiso(user, '911_whatsapp'|'911_rondin', 'ver') || tienePermiso(user, 'incidentes', 'ver')` — con fallback a la sección genérica `incidentes` (bitácora general), agregado a propósito para que cualquiera con acceso a la bitácora vea el detalle histórico aunque esos canales ya no se asignen a ningún rol operativo.
- ciudadano: solo `tieneAccesoSeccion(user, '911_ciudadano')` — **sin** ese fallback.

Verificado contra la BD real (`SELECT ... FROM permisos WHERE usuario_id = ...`): el usuario de prueba del rol `agente_despacho` tiene `puede_ver=true` en `911_despacho` **e `incidentes`**, pero NO en `911_ciudadano`. El mismo hueco existía duplicado en el gate grueso del proxy (`lib/permisos/mapa-secciones.ts`): `'/agente_911/rondin': ['911_rondin', 'incidentes']` y `'/agente_911/whatsapp': ['911_whatsapp', 'incidentes']` sí tenían el fallback; `'/agente_911/ciudadano': ['911_ciudadano']` no — así que la petición se bloqueaba en el proxy antes de que la página siquiera corriera su propio check.

**Fix**:
1. `app/agente_911/ciudadano/incidentes/[id]/page.tsx`: reemplazado `tieneAccesoSeccion(session.user.id, '911_ciudadano')` por `tienePermiso(session.user.id, '911_ciudadano', 'ver') || tienePermiso(session.user.id, 'incidentes', 'ver')`, igual que sus hermanas whatsapp/rondin.
2. `lib/permisos/mapa-secciones.ts`: `'/agente_911/ciudadano': ['911_ciudadano', 'incidentes']` (antes solo `['911_ciudadano']`).

**Prevención**: las tres páginas de detalle de incidente por canal (`ciudadano`/`whatsapp`/`rondin`) deben mantener la misma guarda de permiso (sección propia del canal `||` `incidentes` genérico), tanto en la página como en `mapa-secciones.ts`. Si se agrega un cuarto canal, replicar el mismo patrón en ambos lugares.
