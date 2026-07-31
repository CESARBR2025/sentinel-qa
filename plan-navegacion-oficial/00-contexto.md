# Contexto general — Navegación en vivo estilo DiDi para el oficial

> Leer antes de empezar cualquier etapa. Este archivo no tiene tareas propias — es el trasfondo que explica el "por qué" detrás de las etapas 1-7 y `test-qa.md`.

## Problema

Repo: `seguridad_publica` (Next.js 16, React 19, TypeScript, PostgreSQL con SQL crudo vía `lib/db.ts`). Módulo de oficial de campo.

Hoy, cuando despacho asigna un incidente a un oficial, este ve el detalle en `/oficial/despachos/[id]` (`app/oficial/despachos/[id]/page.tsx` → `components/oficial/DespachoContent.tsx`) con dos botones manuales:

- **"VOY EN CAMINO"** (`MarcarEnCaminoButton.tsx` → `marcarEnCaminoOficial`) — registra `hora_salida` en `incidente_despacho_unidades`.
- **"MARCAR EN SITIO"** (`MarcarEnSitioButton.tsx` → `marcarEnSitioOficial`) — cambia `incidentes.estatus` a `en_sitio` y registra `hora_llegada`.

Ese diseño existe porque, sin AVL/GPS real, no había forma confiable de saber esas horas automáticamente (comentario explícito en `lib/oficial/actions.ts` líneas 42-46). El oficial las reportaba "a mano".

**Objetivo de este plan:** reemplazar esos dos botones por una vista de navegación en vivo estilo DiDi — al iniciar la atención del caso, el oficial ve un mapa con la ruta calculada por Google Directions API desde su posición GPS en tiempo real hasta el incidente, con su posición actualizándose sobre el mapa mientras se desplaza. La llegada se detecta automáticamente por geofence (con un botón manual "LLEGUÉ" como respaldo). Esto no es solo estético: ahora sí existe una señal de posición confiable, así que las mismas acciones de negocio (`marcarEnCaminoOficial`/`marcarEnSitioOficial`) se disparan solas en el momento correcto, en vez de depender de que el oficial se acuerde de tocar un botón.

## Decisión que este plan revierte (documentarlo, no es un descuido)

El plan previo `plan-mapa-despacho/README.md` (ya cerrado, feature de mapa del lado del **despachador**) dejó explícitamente **fuera de alcance**: *"Distance Matrix / Directions API para distancia real por calles — se mantiene Haversine (línea recta), como ya funciona hoy."* Esa decisión seguía vigente para el mapa del despachador (`AsignacionMapa.tsx`) — **no se toca ese componente en este plan**. Lo que cambia es del lado del **oficial**: el dueño del proyecto confirmó (2026-07-31) que la key de Google Maps ya tiene **Directions API habilitada y con facturación activa**, y pidió explícitamente una vista de navegación con ruta calculada. Es una decisión nueva y deliberada, acotada a la vista `/oficial/despachos/[id]` — no reabre el mapa de asignación del despachador.

## Estado actual del código (relevante para todas las etapas)

### Componentes/acciones que se reemplazan

- `components/oficial/MarcarEnCaminoButton.tsx` (57 líneas) y `components/oficial/MarcarEnSitioButton.tsx` (45 líneas) — client components triviales, un solo `useTransition` + `router.refresh()`, sin confirmación. Se eliminan de `DespachoContent.tsx` en la Etapa 4 (no se borran los archivos hasta confirmar que nada más los importa — verificar con `youmindag references MarcarEnCaminoButton` antes de borrar).
- `lib/oficial/actions.ts::marcarEnCaminoOficial` (líneas ~50-77) y `::marcarEnSitioOficial` (líneas ~79-113) — **NO se modifican en su lógica interna**. Solo cambia quién las llama: en vez del click del botón, las llama el nuevo componente de navegación automáticamente. Ambas exigen `estatus === 'en_despacho'` como guarda de idempotencia (no se puede marcar dos veces) — el nuevo disparo automático hereda esa misma guarda gratis, no hay que reimplementarla.

```ts
// lib/oficial/actions.ts — NO TOCAR, solo reusar tal cual
export async function marcarEnCaminoOficial(incidenteId: string) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')
  await tryActionRaw(async () => {
    const { query } = await import('@/lib/db')
    const inc = await query<{ estatus: string }>(
      `SELECT estatus FROM incidentes WHERE id = $1 LIMIT 1`, [incidenteId],
    )
    if (!inc.rows[0]) throw new NotFoundError('Incidente no encontrado')
    if (inc.rows[0].estatus !== 'en_despacho')
      throw new ValidationError('El incidente debe estar en_despacho para marcar en camino')
    await query(
      `UPDATE incidente_despacho_unidades du
       SET hora_salida = COALESCE(du.hora_salida, NOW())
       FROM incidente_despacho d
       WHERE du.despacho_id = d.id AND d.incidente_id = $1`,
      [incidenteId],
    )
  })
  revalidatePath('/oficial/despachos')
  revalidatePath(`/oficial/despachos/${incidenteId}`)
  revalidatePath('/incidentes')
}

export async function marcarEnSitioOficial(incidenteId: string) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')
  await tryActionRaw(async () => {
    const { query } = await import('@/lib/db')
    const inc = await query<{ estatus: string }>(
      `SELECT estatus FROM incidentes WHERE id = $1 LIMIT 1`, [incidenteId],
    )
    if (!inc.rows[0]) throw new NotFoundError('Incidente no encontrado')
    if (inc.rows[0].estatus !== 'en_despacho')
      throw new ValidationError('El incidente debe estar en_despacho para marcar en sitio')
    await query(
      `UPDATE incidentes SET estatus = 'en_sitio', actualizado_en = NOW() WHERE id = $1`,
      [incidenteId],
    )
    await query(
      `UPDATE incidente_despacho_unidades du
       SET hora_salida = COALESCE(du.hora_salida, d.fecha_hora_despacho),
           hora_llegada = COALESCE(du.hora_llegada, NOW())
       FROM incidente_despacho d
       WHERE du.despacho_id = d.id AND d.incidente_id = $1`,
      [incidenteId],
    )
  })
  revalidatePath('/oficial/despachos')
  revalidatePath(`/oficial/despachos/${incidenteId}`)
  revalidatePath('/incidentes')
}
```

**Por qué no tocarlas es importante**: `hora_salida`/`hora_llegada` alimentan el "form-003 SEGOB-CNI" — se leen en modo lectura por `TablonDespacho.tsx` (líneas ~333-348, el despachador ve "Salió HH:MM · Llegó HH:MM" por unidad) y se exponen crudas en `app/api/incidentes/[id]/despacho/route.ts`. No hay exportador PDF/CSV que las consuma hoy, pero el nombre "form-003" indica que mapean a un formato estándar — no dejar de poblarlas.

### `DespachoContent.tsx` (orquestador de estado, se modifica en Etapa 4)

```tsx
// components/oficial/DespachoContent.tsx — estado actual completo
'use client'
import { useState } from 'react'
import { HistorialIncidente } from '@/components/incidentes/HistorialIncidente'
import { MarcarEnCaminoButton } from '@/components/oficial/MarcarEnCaminoButton'
import { MarcarEnSitioButton } from '@/components/oficial/MarcarEnSitioButton'
import { FormularioRecorrido } from '@/components/oficial/FormularioRecorrido'

interface Asignacion {
  folio: string
  descripcion?: string | null
  calle?: string | null
  colonia?: string | null
  tipoIncidente?: string | null
  prioridad?: string | null
  tipoEmergenciaId?: number | null
  tipoIncidenteId?: number | null
  prioridadId?: number | null
}

interface Props {
  historial: any
  estatusInicial: string
  incidenteId: string
  asignacion: Asignacion
  catalogos: any
  user: any
}

export function DespachoContent({ historial, estatusInicial, incidenteId, asignacion, catalogos, user }: Props) {
  const [enSitio, setEnSitio] = useState(estatusInicial === 'en_sitio')
  const unidadesDespacho: { horaSalida?: string | null }[] = historial?.despacho?.unidades ?? []
  const [yaSalio, setYaSalio] = useState(unidadesDespacho.some(u => u.horaSalida))

  if (enSitio) {
    return (
      <FormularioRecorrido
        embedded
        user={user}
        catalogos={catalogos}
        incidenteId={incidenteId}
        prefill={{
          folioCad: asignacion.folio,
          descripcion: asignacion.descripcion ?? undefined,
          calle: asignacion.calle ?? undefined,
          colonia: asignacion.colonia ?? undefined,
          tipoEmergenciaId: asignacion.tipoEmergenciaId ?? undefined,
          tipoIncidenteId: asignacion.tipoIncidenteId ?? undefined,
          prioridadId: asignacion.prioridadId ?? undefined,
        }}
      />
    )
  }

  return (
    <div style={{ marginBottom: 24, marginTop: 24 }}>
      <HistorialIncidente historial={historial} />
      <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 16 }}>
        <span style={{ /* badge de estatus */ }}>
          {estatusInicial === 'en_despacho' ? 'UNIDADES ASIGNADAS' : estatusInicial.toUpperCase()}
        </span>
        <MarcarEnCaminoButton incidenteId={incidenteId} estatusActual={estatusInicial} yaSalio={yaSalio} onMarcado={() => setYaSalio(true)} />
        <MarcarEnSitioButton incidenteId={incidenteId} estatusActual={estatusInicial} onMarcado={() => setEnSitio(true)} />
      </div>
    </div>
  )
}
```

### Pipeline de datos hacia esta página (Etapa 1 lo extiende)

`app/oficial/despachos/[id]/page.tsx` arma `asignacion` buscando en `listarDespachosAsignados(session.user.id)` (→ `lib/oficial/service.ts` → `lib/oficial/repository.ts::obtenerDespachosAsignados`). **Esa query NO trae `latitud`/`longitud` del incidente hoy**, aunque la columna existe en `incidentes` y se usa en otros módulos (Juzgado, Fiscalía, KPIs). Sin este dato no hay destino que pasarle a Directions API — es el primer bloqueante a resolver.

### Mapas en el proyecto — 3 patrones de carga coexisten, usar el dominante

1. **`@react-google-maps/api`'s `useJsApiLoader`** (8 archivos) — patrón de referencia: `components/911/despacho/AsignacionMapa.tsx`. Config compartida en `lib/maps/googleMapsConfig.ts`:
   ```ts
   export const GOOGLE_MAPS_LOADER_ID = 'google-map-script'
   export const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? ''
   export const GOOGLE_MAPS_LIBRARIES: Libraries = ['places', 'visualization']
   ```
   El archivo advierte en su propio comentario: **todo el proyecto debe compartir el mismo `id` + el mismo array de `libraries`** (por referencia, no uno nuevo por archivo) — si dos componentes montan con el mismo `id` pero distinto `libraries`, el segundo revienta con "Loader must not be called again with different options". **Este es el patrón a usar en este plan.**
2. **`lib/maps/loadGoogleMaps.ts`** — loader imperativo de bajo nivel (usado por `MapaPinFijo.tsx`). **No usarlo aquí.**
3. **Script manual ad-hoc** en `components/oficial/MapaUbicacion.tsx` (usado dentro de `FormularioRecorrido.tsx`). **No usarlo aquí**, pero es importante saber que existe: cuando el oficial llega a `en_sitio` y `DespachoContent` renderiza `FormularioRecorrido embedded`, esa pantalla carga Google Maps por su cuenta vía este script manual — coexiste sin conflicto con `useJsApiLoader` porque ambos terminan usando el mismo `window.google.maps` global una vez cargado, pero **no lo toques ni lo unifiques en este plan** — fuera de alcance.

`AsignacionMapa.tsx::buildUnidadSvgIcon` (líneas 125-167 de ese archivo) es la referencia de estilo para el ícono de patrulla — un SVG data-uri con un pin+bandera, colores por estado. El componente nuevo de este plan puede adaptar ese mismo patrón visual para el marcador "yo" (el oficial navegando).

### `lib/shared/geo.ts` — helper de distancia a reusar

```ts
const RADIO_TIERRA_KM = 6371
export function distanciaHaversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180
  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2
  return RADIO_TIERRA_KM * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}
```
Ya se usa para ordenar unidades por cercanía (`lib/flota/service.ts`). Este plan lo reusa para: (a) detectar desviación de ruta, (b) detectar llegada (geofence).

### `OficialUbicacionTracker.tsx` — NO TOCAR

Ya existe un heartbeat de `watchPosition` de **baja precisión** (`enableHighAccuracy: false`, cada 30s), montado globalmente en `app/oficial/layout.tsx`, que alimenta `ofi_oficiales.ultima_lat/ultima_lng` (usado por el mapa de asignación del despachador). Este plan **no lo modifica ni lo reemplaza** — el componente nuevo de navegación usa su **propio** `watchPosition` de alta precisión, activo solo mientras esa vista está montada. Los dos `watchPosition` (heartbeat global + navegación local) coexisten sin conflicto — son llamadas independientes a la Geolocation API del navegador.

### Notificaciones — eventos ya definidos, nunca emitidos

`lib/notificaciones/catalogo.ts` (líneas 49-58) ya define:
```ts
'despacho.en_camino': { label: 'Unidad en camino', modulo: 'Incidentes', severidad: 'info', rolesPorDefecto: ['agente_despacho'], href: () => `/agente_911/despacho` },
'despacho.en_sitio':  { label: 'Unidad en sitio',  modulo: 'Incidentes', severidad: 'info', rolesPorDefecto: ['agente_despacho'], href: () => `/agente_911/despacho` },
```
Ningún `emitir('despacho.en_camino', ...)` ni `emitir('despacho.en_sitio', ...)` existe en el código — es configuración huérfana. Este plan los activa (Etapa 6), aprovechando que ahora el disparo es automático y confiable.

## Convenciones del proyecto a respetar

- TypeScript estricto, componentes cliente marcados `'use client'`.
- Estilos inline con objetos `React.CSSProperties` — seguir la paleta ya usada en `DespachoContent.tsx`/`MarcarEnCaminoButton.tsx` (azul institucional `#1f355a`/`#1c3051`, verde/teal éxito `#0d9488`/`#14b8a6`, grises `#94a3b8`/`#e2e8f0`, `Inter` para texto, `Barlow Condensed` para botones/números, `JetBrains Mono` para badges técnicos).
- Server actions: `'use server'`, `tryActionRaw` + clases de `@/lib/error-handler` (`NotFoundError`, `ValidationError`) — igual que `marcarEnCaminoOficial`/`marcarEnSitioOficial`.
- Mutaciones nunca dentro de Server Components — todo por `'use server'` actions ya existentes o nuevas siguiendo el mismo patrón.
- `emitir()` siempre **después** del `COMMIT`/`UPDATE`, nunca dentro de una transacción explícita (regla de `lib/notificaciones/emisor.ts`).
- Al final de cada etapa, correr `npx tsc --noEmit` como mínimo.
