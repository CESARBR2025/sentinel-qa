# Etapa 1 — `AsignacionCard.tsx` (card blanca rediseñada)

> Lee primero [`00-contexto.md`](./00-contexto.md).

**Archivo a crear:** `components/oficial/navegacion/AsignacionCard.tsx` (nuevo)

## Objetivo

Reemplazar la pantalla "antes de navegar" actual (hoy vive dentro de `NavegacionDespacho.tsx`, rama `fase === 'no_iniciado'`, con diseño mínimo) por una card blanca con jerarquía visual clara: número de reporte, ubicación, badge de impacto (prioridad), botón de acción. Esta card se monta **fuera** del mapa/modal — es la pantalla que el oficial ve en `/oficial/despachos/[id]` antes de tocar "Iniciar navegación".

Esta etapa **solo crea el componente aislado** — no lo integra todavía a `DespachoContent.tsx` (eso es la Etapa 4) ni depende de la Etapa 3 (el refactor de `NavegacionDespacho.tsx` puede hacerse en paralelo).

## Código completo del componente

```tsx
'use client'

import { Hash, MapPin } from 'lucide-react'
import { colorPorPrioridad } from '@/lib/incidentes/prioridad-colores'

interface AsignacionCardProps {
  folio: string
  direccion?: string | null
  prioridad?: string | null
  onIniciar: () => void
  pendiente?: boolean
}

export function AsignacionCard({ folio, direccion, prioridad, onIniciar, pendiente }: AsignacionCardProps) {
  const color = colorPorPrioridad(prioridad)

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', gap: 20,
      width: '100%', maxWidth: 480, margin: '32px auto',
      background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 2,
      boxShadow: '0 1px 3px rgba(15,23,42,0.08)',
      padding: 28, boxSizing: 'border-box',
      fontFamily: 'Inter,sans-serif',
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          fontFamily: 'JetBrains Mono,monospace', fontSize: 10, fontWeight: 700,
          letterSpacing: '0.12em', textTransform: 'uppercase', color: '#94a3b8',
        }}>
          <Hash size={12} />
          Reporte No.
        </div>
        <div style={{
          fontFamily: 'Barlow Condensed,sans-serif', fontWeight: 800, fontSize: 28,
          color: '#0f172a', lineHeight: 1.1,
        }}>
          {folio}
        </div>
      </div>

      <div style={{ height: 1, background: '#f1f5f9' }} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          fontFamily: 'JetBrains Mono,monospace', fontSize: 10, fontWeight: 700,
          letterSpacing: '0.12em', textTransform: 'uppercase', color: '#94a3b8',
        }}>
          <MapPin size={12} />
          Ubicación
        </div>
        <div style={{ fontFamily: 'Inter,sans-serif', fontSize: 15, fontWeight: 500, color: '#334155' }}>
          {direccion ?? 'Sin dirección registrada'}
        </div>
      </div>

      <div>
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          fontFamily: 'JetBrains Mono,monospace', fontSize: 11, fontWeight: 700,
          letterSpacing: '0.08em', textTransform: 'uppercase',
          padding: '6px 14px', borderRadius: 2,
          background: color.fondo, color: color.oscuro, border: `1px solid ${color.principal}`,
        }}>
          Impacto: {prioridad ?? 'Sin definir'}
        </span>
      </div>

      <button
        onClick={onIniciar}
        disabled={pendiente}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          width: '100%', padding: '16px 24px', marginTop: 4,
          fontFamily: 'Barlow Condensed,sans-serif', fontWeight: 700, fontSize: 16,
          letterSpacing: '0.06em', textTransform: 'uppercase',
          border: '1px solid #1f355a', borderRadius: 2,
          background: pendiente ? '#c3c8d2' : '#1f355a',
          color: '#ffffff', cursor: pendiente ? 'wait' : 'pointer',
          opacity: pendiente ? 0.7 : 1, transition: 'all .15s',
        }}
      >
        {pendiente ? 'INICIANDO…' : '🚓 INICIAR NAVEGACIÓN'}
      </button>
    </div>
  )
}
```

Notas de diseño:
- `maxWidth: 480` centra la card dentro del contenedor `flex:1` de `DespachoContent.tsx` sin violar el Page Assembly Pattern (el `<main>` de la página sigue sin `maxWidth` fijo — este límite es solo del contenido de la card, no del layout de la página, igual que cualquier formulario con un ancho de lectura razonable).
- El componente **no** dispara ninguna acción de servidor por sí mismo — solo llama `onIniciar()`. La Etapa 4 decide qué hace ese callback (abrir el modal). El disparo real de `marcarEnCaminoOficial` se movió al montaje de `NavegacionDespacho.tsx` (Etapa 3), no vive aquí.
- Prop `pendiente` opcional: si el padre quiere mostrar un estado de carga mientras se abre el modal, puede pasarlo; si no se usa, el botón funciona igual sin estado de carga (`pendiente` default `undefined` → botón activo).

## Criterios de aceptación

- [ ] `npx tsc --noEmit` sin errores nuevos.
- [ ] El componente compila y renderiza aislado (puedes montarlo temporalmente en cualquier página de prueba con props de ejemplo para verificar visualmente: folio `"SSPM/INC/2026/006"`, dirección `"José María Arteaga, Centro"`, prioridad `"MEDIA"`).
- [ ] La card se ve como card blanca con sombra sutil, tipografía jerarquizada (folio grande, labels pequeños en mayúsculas), badge de impacto coloreado según prioridad (`MEDIA` → amarillo, `ALTA` → naranja, `CRITICA` → rojo, `BAJA` → azul, sin prioridad → gris).
- [ ] El botón ocupa todo el ancho de la card y usa la paleta institucional (`#1f355a`).
