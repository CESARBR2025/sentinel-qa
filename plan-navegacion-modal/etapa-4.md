# Etapa 4 — Integración final en `DespachoContent.tsx`

> Lee primero [`00-contexto.md`](./00-contexto.md). Depende de las Etapas 1, 2 y 3 — necesita `AsignacionCard`, `NavegacionModal` y la versión refactorizada de `NavegacionDespacho` (con `onAtender`) ya existentes.

**Archivo a modificar:** `components/oficial/DespachoContent.tsx`

## Objetivo

Reemplazar el render directo de `NavegacionDespacho` (que hoy se monta siempre, sin card previa ni modal) por: `AsignacionCard` en la página normal → click abre `NavegacionModal` a pantalla completa → al confirmar "Atender" dentro del modal, se cierra y se pasa a `FormularioRecorrido embedded`, igual que antes.

## Código actual completo del archivo (ver `00-contexto.md` para el detalle)

```tsx
'use client'

import { useState } from 'react'
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
  estatusInicial: string
  incidenteId: string
  asignacion: Asignacion
  catalogos: any
  user: any
}

export function DespachoContent({ estatusInicial, incidenteId, asignacion, catalogos, user }: Props) {
  const [enSitio, setEnSitio] = useState(estatusInicial === 'en_sitio')

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
          latitud: asignacion.latitud ?? undefined,
          longitud: asignacion.longitud ?? undefined,
        }}
      />
    )
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      <NavegacionDespacho
        incidenteId={incidenteId}
        destino={{ lat: asignacion.latitud as number, lng: asignacion.longitud as number }}
        folio={asignacion.folio}
        direccion={[asignacion.calle, asignacion.colonia].filter(Boolean).join(', ') || null}
        prioridad={asignacion.prioridad}
        onLlegada={() => setEnSitio(true)}
      />
    </div>
  )
}
```

## Cambios a aplicar

Reemplaza la parte final del archivo (desde los imports hasta el cierre) por:

```tsx
'use client'

import { useState } from 'react'
import { FormularioRecorrido } from '@/components/oficial/FormularioRecorrido'
import { AsignacionCard } from '@/components/oficial/navegacion/AsignacionCard'
import { NavegacionModal } from '@/components/oficial/navegacion/NavegacionModal'

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
  estatusInicial: string
  incidenteId: string
  asignacion: Asignacion
  catalogos: any
  user: any
}

export function DespachoContent({ estatusInicial, incidenteId, asignacion, catalogos, user }: Props) {
  const [enSitio, setEnSitio] = useState(estatusInicial === 'en_sitio')
  const [modalAbierto, setModalAbierto] = useState(false)

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
          latitud: asignacion.latitud ?? undefined,
          longitud: asignacion.longitud ?? undefined,
        }}
      />
    )
  }

  const direccion = [asignacion.calle, asignacion.colonia].filter(Boolean).join(', ') || null

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      <AsignacionCard
        folio={asignacion.folio}
        direccion={direccion}
        prioridad={asignacion.prioridad}
        onIniciar={() => setModalAbierto(true)}
      />

      {modalAbierto && (
        <NavegacionModal
          incidenteId={incidenteId}
          destino={{ lat: asignacion.latitud as number, lng: asignacion.longitud as number }}
          folio={asignacion.folio}
          direccion={direccion}
          prioridad={asignacion.prioridad}
          onAtender={() => {
            setModalAbierto(false)
            setEnSitio(true)
          }}
        />
      )}
    </div>
  )
}
```

Puntos clave:
- `modalAbierto` es estado local nuevo — controla si `NavegacionModal` está montado. Al abrirse, `NavegacionModal` monta `NavegacionDespacho`, que dispara `marcarEnCaminoOficial` en su propio `useEffect` de montaje (Etapa 3) — `DespachoContent` no necesita llamar nada directamente.
- `onAtender` hace **dos cosas en orden**: cierra el modal (`setModalAbierto(false)`) y avanza el estado del padre a `enSitio` (`setEnSitio(true)`), lo que en el próximo render cae en la rama `if (enSitio)` de arriba y muestra `FormularioRecorrido embedded` — mismo comportamiento final que antes, solo que ahora pasa por la pantalla de confirmación en vez de saltar directo.
- `direccion` se calcula una sola vez arriba y se reusa tanto en `AsignacionCard` como en `NavegacionModal` — evita repetir el `.filter(Boolean).join(', ')`.
- Si `modalAbierto` es `false`, `NavegacionModal` ni se monta — no hay overhead de Google Maps/GPS mientras el oficial solo ve la card.

## Criterios de aceptación

- [ ] `npx tsc --noEmit` y `npm run build` sin errores.
- [ ] Al entrar a `/oficial/despachos/[id]` (incidente en `en_despacho`, con coordenadas), se ve la card `AsignacionCard`, no el mapa directamente.
- [ ] Click en "INICIAR NAVEGACIÓN" abre el modal a pantalla completa.
- [ ] Al confirmar "ATENDER" en la pantalla de llegada dentro del modal, el modal se desmonta y aparece `FormularioRecorrido embedded` con el prefill de siempre (folio, calle, colonia, clasificación, lat/lng).
- [ ] Si el oficial recarga la página estando `estatusInicial === 'en_sitio'` (ya llegó antes), sigue yendo directo al formulario de cierre, sin pasar por la card ni el modal — comportamiento sin cambios.
- [ ] Revisar `youmindag references NavegacionDespacho` (o grep si no está disponible) para confirmar que ningún otro archivo del proyecto importa `NavegacionDespacho` esperando la prop vieja `onLlegada` — si aparece alguno, actualízalo al nuevo nombre `onAtender`.
