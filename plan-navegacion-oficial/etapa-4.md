# Etapa 4 — Disparo automático (voy en camino / llegada) + integración en `DespachoContent.tsx`

> Lee primero [`00-contexto.md`](./00-contexto.md). Depende de [`etapa-3.md`](./etapa-3.md). **Esta es la etapa central del plan** — convierte el mapa de solo-lectura en el reemplazo real de los botones manuales.

**Archivos a modificar:** `components/oficial/navegacion/NavegacionDespacho.tsx`, `components/oficial/DespachoContent.tsx`

## Objetivo

1. Agregar una pantalla inicial "INICIAR NAVEGACIÓN" — el permiso de GPS **no se pide automáticamente al montar**, se pide cuando el oficial confirma que va a atender el caso (mejor UX, consistente con cómo el navegador maneja prompts de permisos). Al iniciar, se dispara `marcarEnCaminoOficial(incidenteId)` (reusada tal cual de `lib/oficial/actions.ts`, sin tocar su código).
2. Detectar la llegada por geofence (80m del destino) y disparar `marcarEnSitioOficial(incidenteId)` automáticamente, con un botón manual "LLEGUÉ" siempre visible como respaldo.
3. Integrar `NavegacionDespacho` en `DespachoContent.tsx`, reemplazando el badge + los dos botones manuales — **pero conservando `MarcarEnCaminoButton`/`MarcarEnSitioButton` como fallback** para el caso (real, ya existe en datos) de un incidente sin `latitud`/`longitud` registradas, donde no hay destino que navegar.

## Cambios en `NavegacionDespacho.tsx`

### 1. Nuevos imports

Agrega, junto a los imports existentes:

```ts
import { useTransition } from 'react'
import { marcarEnCaminoOficial, marcarEnSitioOficial } from '@/lib/oficial/actions'
import { distanciaHaversineKm } from '@/lib/shared/geo'
```

### 2. Nueva constante, junto a las de la Etapa 3

```ts
const LLEGADA_GEOFENCE_KM = 0.08 // 80 metros
```

### 3. Props — agregar `incidenteId` y `onLlegada`

Interfaz actual (de la Etapa 3):

```tsx
interface NavegacionDespachoProps {
  destino: { lat: number; lng: number }
  folio: string
  direccion?: string | null
  prioridad?: string | null
  onPosicionActualizada?: (pos: { lat: number; lng: number }) => void
}
```

Reemplázala por:

```tsx
interface NavegacionDespachoProps {
  incidenteId: string
  destino: { lat: number; lng: number }
  folio: string
  direccion?: string | null
  prioridad?: string | null
  onPosicionActualizada?: (pos: { lat: number; lng: number }) => void
  onLlegada?: () => void
}
```

Y en la firma del componente:

```tsx
export function NavegacionDespacho({ incidenteId, destino, folio, direccion, prioridad, onPosicionActualizada, onLlegada }: NavegacionDespachoProps) {
```

`onPosicionActualizada` no se usa dentro de esta etapa para la lógica de llegada (esta etapa usa el estado interno `posicionActual` directamente, que el componente ya tiene) — se deja como está, es un gancho opcional para quien quiera telemetría externa a futuro, no es necesario consumirlo para que este plan funcione.

### 4. Nuevo estado, junto al de la Etapa 3

```tsx
const [fase, setFase] = useState<'no_iniciado' | 'navegando'>('no_iniciado')
const [pendienteInicio, startTransitionInicio] = useTransition()
const [pendienteLlegada, startTransitionLlegada] = useTransition()
const llegadaDisparadaRef = useRef(false)
```

### 5. Gatear el `watchPosition` de la Etapa 3 detrás de `fase === 'navegando'`

El `useEffect` de `watchPosition` (Etapa 3) empieza así:

```tsx
  useEffect(() => {
    if (!navigator.geolocation) {
      setErrorGps('Este navegador no soporta geolocalización.')
      return
    }
    const watchId = navigator.geolocation.watchPosition(
```

Agrega la guarda de fase como primera línea del efecto, y agrega `fase` a las dependencias:

```tsx
  useEffect(() => {
    if (fase !== 'navegando') return
    if (!navigator.geolocation) {
      setErrorGps('Este navegador no soporta geolocalización.')
      return
    }
    const watchId = navigator.geolocation.watchPosition(
      pos => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude }
        setPosicionActual(coords)
        onPosicionActualizada?.(coords)
      },
      err => setErrorGps(err.code === err.PERMISSION_DENIED ? 'Permiso de ubicación denegado.' : 'No se pudo obtener tu ubicación.'),
      { enableHighAccuracy: true, maximumAge: 5_000, timeout: 15_000 },
    )
    return () => navigator.geolocation.clearWatch(watchId)
  }, [fase, onPosicionActualizada])
```

### 6. Handlers de inicio y llegada

Agrega, después de `calcularRuta` (definida en la Etapa 3):

```tsx
  const handleIniciar = () => {
    startTransitionInicio(async () => {
      await marcarEnCaminoOficial(incidenteId)
      setFase('navegando')
    })
  }

  const dispararLlegada = () => {
    if (llegadaDisparadaRef.current) return
    llegadaDisparadaRef.current = true
    startTransitionLlegada(async () => {
      await marcarEnSitioOficial(incidenteId)
      onLlegada?.()
    })
  }
```

### 7. Efecto de detección de llegada (geofence), junto al efecto de recálculo por desviación de la Etapa 3

```tsx
  useEffect(() => {
    if (fase !== 'navegando' || !posicionActual || llegadaDisparadaRef.current) return
    const distanciaKm = distanciaHaversineKm(posicionActual.lat, posicionActual.lng, destino.lat, destino.lng)
    if (distanciaKm < LLEGADA_GEOFENCE_KM) {
      dispararLlegada()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fase, posicionActual])
```

### 8. Pantalla de gate "INICIAR NAVEGACIÓN"

Justo después del `if (loadError) { ... }` (sin tocarlo) y **antes** del `if (!isLoaded || !posicionActual) { ... }` de la Etapa 3, agrega:

```tsx
  if (fase === 'no_iniciado') {
    const color = colorPorPrioridad(prioridad).principal
    return (
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        gap: 16, width: '100%', height: '100%', minHeight: 420, padding: 24, boxSizing: 'border-box',
        fontFamily: 'Inter,sans-serif', textAlign: 'center',
      }}>
        <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 12, color: '#64748b' }}>{folio}</div>
        <div style={{ fontFamily: 'Barlow Condensed,sans-serif', fontSize: 20, fontWeight: 700, color: '#1c3051' }}>
          {direccion ?? 'Destino del incidente'}
        </div>
        <span style={{
          fontFamily: 'JetBrains Mono,monospace', fontSize: 10, fontWeight: 700,
          padding: '4px 12px', borderRadius: 2, border: `1px solid ${color}`, color,
        }}>
          {prioridad ?? 'SIN PRIORIDAD'}
        </span>
        <button
          onClick={handleIniciar}
          disabled={pendienteInicio}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '14px 32px', fontFamily: 'Barlow Condensed, sans-serif',
            fontWeight: 700, fontSize: 16, letterSpacing: '0.06em',
            textTransform: 'uppercase', cursor: pendienteInicio ? 'wait' : 'pointer',
            border: '1px solid #1f355a', borderRadius: 2,
            background: pendienteInicio ? '#c3c8d2' : '#1f355a',
            color: '#fff', transition: 'all .15s',
            opacity: pendienteInicio ? 0.7 : 1,
          }}
        >
          {pendienteInicio ? 'INICIANDO…' : '🚓 INICIAR NAVEGACIÓN'}
        </button>
      </div>
    )
  }
```

### 9. Botón manual "LLEGUÉ" — agregar al header existente

Dentro del bloque de header (el `<div style={{ display: 'flex', ... background: '#1c3051', ... }}>` de la Etapa 2), en el lado derecho, junto al bloque de ETA/distancia, agrega el botón manual:

```tsx
        <button
          onClick={dispararLlegada}
          disabled={pendienteLlegada}
          style={{
            padding: '8px 16px', fontFamily: 'Barlow Condensed, sans-serif',
            fontWeight: 700, fontSize: 13, letterSpacing: '0.05em', textTransform: 'uppercase',
            cursor: pendienteLlegada ? 'wait' : 'pointer',
            border: '1px solid #14b8a6', borderRadius: 2,
            background: pendienteLlegada ? '#ccfbf1' : '#14b8a6',
            color: '#fff', opacity: pendienteLlegada ? 0.7 : 1,
          }}
        >
          {pendienteLlegada ? '...' : '✓ LLEGUÉ'}
        </button>
```

(Ajusta el layout del header a `flex-wrap` o similar si el ETA + este botón no caben en una fila en pantallas angostas — usa buen criterio de responsive, el proyecto no tiene un breakpoint fijo documentado para esto.)

## Cambios en `DespachoContent.tsx`

Reemplaza el archivo completo por:

```tsx
'use client'

import { useState } from 'react'
import { HistorialIncidente } from '@/components/incidentes/HistorialIncidente'
import { MarcarEnCaminoButton } from '@/components/oficial/MarcarEnCaminoButton'
import { MarcarEnSitioButton } from '@/components/oficial/MarcarEnSitioButton'
import { FormularioRecorrido } from '@/components/oficial/FormularioRecorrido'
import { NavegacionDespacho } from '@/components/oficial/navegacion/NavegacionDespacho'

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
  latitud?: number | null
  longitud?: number | null
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

  const tieneCoordenadas = asignacion.latitud != null && asignacion.longitud != null

  return (
    <div style={{ marginBottom: 24, marginTop: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <HistorialIncidente historial={historial} />

      {tieneCoordenadas ? (
        <div style={{ flex: 1, minHeight: 480, border: '1px solid #e2e8f0', borderRadius: 2, overflow: 'hidden' }}>
          <NavegacionDespacho
            incidenteId={incidenteId}
            destino={{ lat: asignacion.latitud as number, lng: asignacion.longitud as number }}
            folio={asignacion.folio}
            direccion={[asignacion.calle, asignacion.colonia].filter(Boolean).join(', ') || null}
            prioridad={asignacion.prioridad}
            onLlegada={() => setEnSitio(true)}
          />
        </div>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{
            fontFamily: 'JetBrains Mono,monospace', fontSize: 11, fontWeight: 700,
            padding: '4px 12px', borderRadius: 2,
            background: '#eff1f3', color: '#1c3051', border: '1px solid #c3c8d2',
          }}>
            SIN COORDENADAS — REGISTRO MANUAL
          </span>
          <MarcarEnCaminoButton incidenteId={incidenteId} estatusActual={estatusInicial} yaSalio={yaSalio} onMarcado={() => setYaSalio(true)} />
          <MarcarEnSitioButton incidenteId={incidenteId} estatusActual={estatusInicial} onMarcado={() => setEnSitio(true)} />
        </div>
      )}
    </div>
  )
}
```

**Por qué se conservan `MarcarEnCaminoButton`/`MarcarEnSitioButton`**: no todo incidente tiene `latitud`/`longitud` capturadas (dato real, no hipotético — algunos canales/formularios antiguos no las exigen). Sin destino no hay nada que navegar, así que ese caso conserva el flujo manual anterior intacto como respaldo. **No borres esos dos archivos de componente** — siguen en uso.

## Criterios de aceptación

- [ ] `npx tsc --noEmit` y `npm run build` sin errores.
- [ ] Con un incidente que sí tiene `latitud`/`longitud`: al entrar a `/oficial/despachos/[id]` se ve la pantalla "INICIAR NAVEGACIÓN" (sin pedir permiso de GPS todavía).
- [ ] Al hacer click en "INICIAR NAVEGACIÓN": se pide el permiso de GPS, y en BD se refleja `hora_salida` poblada en `incidente_despacho_unidades` para ese despacho (mismo efecto que antes tenía "VOY EN CAMINO").
- [ ] Tras iniciar, aparece el mapa con la ruta y el botón "✓ LLEGUÉ" siempre visible.
- [ ] Simulando posición dentro de 80m del destino (DevTools geolocation override), la llegada se dispara sola: `incidentes.estatus` pasa a `en_sitio`, `hora_llegada` se puebla, y la vista cambia automáticamente al `FormularioRecorrido` embebido (sin recargar la página a mano).
- [ ] Presionando "✓ LLEGUÉ" manualmente (sin estar en el geofence) también dispara la misma transición — confirma que ambos caminos llaman a la misma acción y no se disparan dos veces si ambos ocurren casi simultáneos (protegido por `llegadaDisparadaRef`).
- [ ] Con un incidente **sin** `latitud`/`longitud`: se sigue viendo el flujo anterior (badge + 2 botones manuales), sin ningún cambio de comportamiento respecto a antes de este plan.
- [ ] Si el oficial cierra la pestaña/pierde conexión a medio camino, al volver a entrar a `/oficial/despachos/[id]` con el incidente todavía en `en_despacho`, vuelve a ver la pantalla "INICIAR NAVEGACIÓN" (no se guarda el estado `fase` en servidor, es puramente de sesión de navegador — comportamiento esperado, `marcarEnCaminoOficial` es idempotente por el `COALESCE`).
