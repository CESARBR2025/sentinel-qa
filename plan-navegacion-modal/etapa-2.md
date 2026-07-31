# Etapa 2 — `NavegacionModal.tsx` (modal full-screen)

> Lee primero [`00-contexto.md`](./00-contexto.md). Independiente de la Etapa 1 y de la Etapa 3 en términos de archivo (se puede construir en paralelo), pero conceptualmente envuelve al componente que la Etapa 3 modifica.

**Archivo a crear:** `components/oficial/navegacion/NavegacionModal.tsx` (nuevo)

## Objetivo

Contenedor de modal a **pantalla completa** (no una ventana flotante — el mapa de navegación necesita todo el viewport) que envuelve a `NavegacionDespacho.tsx`. Sigue el mismo patrón de `createPortal` a `document.body` ya establecido en `SeleccionarUnidadesModal.tsx` (ver `00-contexto.md`), para evitar problemas de z-index con contenedores padre.

## Código completo del componente

```tsx
'use client'

import { createPortal } from 'react-dom'
import { useEffect, useState } from 'react'
import { NavegacionDespacho } from './NavegacionDespacho'

interface NavegacionModalProps {
  incidenteId: string
  destino: { lat: number; lng: number }
  folio: string
  direccion?: string | null
  prioridad?: string | null
  onAtender: () => void
}

export function NavegacionModal({ incidenteId, destino, folio, direccion, prioridad, onAtender }: NavegacionModalProps) {
  const [montado, setMontado] = useState(false)

  // Evita SSR mismatch — createPortal necesita document.body, solo existe en cliente.
  useEffect(() => {
    setMontado(true)
    // Bloquea el scroll del fondo mientras el modal de navegación está abierto.
    const overflowPrevio = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = overflowPrevio
    }
  }, [])

  if (!montado) return null

  return createPortal(
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: '#f8fafc', display: 'flex', flexDirection: 'column',
    }}>
      <NavegacionDespacho
        incidenteId={incidenteId}
        destino={destino}
        folio={folio}
        direccion={direccion}
        prioridad={prioridad}
        onAtender={onAtender}
      />
    </div>,
    document.body,
  )
}
```

Notas de diseño:
- `position: fixed, inset: 0, zIndex: 1000` — mismo `zIndex` que ya usa `SeleccionarUnidadesModal.tsx`, consistente con el resto del proyecto (no hay ningún otro overlay que compita en ese rango).
- Sin fondo semitransparente ni `backdropFilter` — a diferencia de un modal de diálogo, este es una vista de pantalla completa (como abrir la app de Maps), no una ventana superpuesta sobre contenido visible detrás.
- El bloqueo de `document.body.style.overflow` evita que la página de fondo (con la card `AsignacionCard`) haga scroll detrás del modal en dispositivos donde el modal no cubre perfectamente el 100% del alto por barras del navegador — buena práctica estándar para modales full-screen, restaurado al desmontar.
- **No** recibe la prop `onLlegada` de `NavegacionDespacho.tsx` — la Etapa 3 la renombra a `onAtender` (se dispara solo cuando el oficial confirma en la pantalla de llegada, no en el momento del geofence). Este componente pasa `onAtender` directo.
- No tiene botón de cerrar/cancelar — el único camino para desmontar el modal es completar el flujo (llegar → confirmar "Atender"), como se describió en el pedido original. No agregues una `X` de cierre salvo que se pida explícitamente.

## Criterios de aceptación

- [ ] `npx tsc --noEmit` sin errores nuevos (nota: esta etapa importa `NavegacionDespacho` esperando que ya reciba `onAtender` en vez de `onLlegada` — si la Etapa 3 aún no se ejecutó, este archivo puede marcar error de tipos temporalmente; es esperado, se resuelve al completar la Etapa 3. Si ambas etapas se ejecutan en el mismo PR/sesión, no hay problema).
- [ ] El modal, una vez integrado (Etapa 4), cubre el 100% del viewport sin dejar ver contenido detrás.
- [ ] El scroll del `body` queda bloqueado mientras el modal está montado y se restaura al desmontarlo.
- [ ] No hay ningún control visible de cierre/cancelar en el modal.
