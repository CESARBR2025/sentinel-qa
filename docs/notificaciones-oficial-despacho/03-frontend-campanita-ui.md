# Etapa 3 — Rediseño de la campanita de notificaciones (con iconos)

> Lee primero [`00-contexto.md`](./00-contexto.md). Esta etapa es
> independiente de las etapas 1 y 2 — se puede probar con las notificaciones
> que ya existen hoy en el sistema (`incidente.creado`, `d1.creada`, etc.),
> no depende de que 01/02 estén implementadas.

**Archivo a modificar:** `components/notificaciones/CampanillaNotificaciones.tsx`

## Objetivo

Rediseñar visualmente el dropdown de notificaciones del header:
1. Icono representativo por notificación, según el módulo del evento
   (`Incidentes`, `Oficial`, `Fiscalía`, etc.), usando `lucide-react`
   (**ya está instalado** en `package.json` — no agregar dependencias).
2. El botón de campana cambia de icono/estado cuando hay no-leídas.
3. Estado vacío con icono.
4. Mantener **intacta** toda la lógica de datos: polling cada 30s, pausa en
   pestaña oculta, portal a `document.body`, marcar leída/todas, sonido de
   alerta, navegación al hacer click. Este es un cambio de JSX/estilos, no de
   lógica.

## Verificación previa: los iconos elegidos existen en la versión instalada

Ya se verificó que estos archivos existen en
`node_modules/lucide-react/dist/esm/icons/`: `siren`, `shield`, `gavel`,
`scale`, `video`, `search`, `key-round`, `ticket`, `truck`, `shield-alert`,
`car`, `clipboard-list`, `file-text`, `megaphone`, `bell`, `bell-ring`,
`bell-off`, `check-check`. Si por algún motivo alguno no existiera en tu
versión instalada, revisa `node_modules/lucide-react/dist/esm/icons/` para
un reemplazo equivalente antes de usarlo (evita que el build falle).

## Código actual completo (para referencia — reemplázalo por el nuevo)

```tsx
'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { usePolling } from '@/hooks/usePolling'

// Cuántas notificaciones se muestran en el dropdown. El resto vive en /notificaciones.
const MAX_DROPDOWN = 5
const INTERVALO_MS = 30_000
const ANCHO_DROPDOWN = 360

interface Notificacion {
  id: string
  evento: string
  titulo: string
  mensaje: string
  href: string | null
  severidad: 'info' | 'aviso' | 'critico'
  leida: boolean
  creadoEn: string
}

const COLOR_SEVERIDAD: Record<string, string> = {
  info: '#0284c7',
  aviso: '#ea580c',
  critico: '#dc2626',
}

function haceCuanto(fecha: string): string {
  const d = new Date(fecha)
  if (Number.isNaN(d.getTime())) return ''
  const mins = Math.floor((Date.now() - d.getTime()) / 60000)
  if (mins < 1) return 'ahora'
  if (mins < 60) return `hace ${mins} min`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `hace ${hrs} h`
  return `hace ${Math.floor(hrs / 24)} d`
}

function sonarAlerta() {
  try {
    const ctx = new AudioContext()
    const t = ctx.currentTime
    for (let i = 0; i < 4; i++) {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain); gain.connect(ctx.destination)
      osc.type = 'triangle'
      const on = t + i * 0.18
      const off = on + 0.18
      osc.frequency.setValueAtTime(i % 2 === 0 ? 880 : 660, on)
      gain.gain.setValueAtTime(0, on)
      gain.gain.linearRampToValueAtTime(0.14, on + 0.04)
      gain.gain.setValueAtTime(0.14, off - 0.06)
      gain.gain.linearRampToValueAtTime(0, off)
      osc.start(on); osc.stop(off + 0.01)
    }
  } catch {
    // AudioContext bloqueado por el navegador — se omite el sonido.
  }
}

export function CampanillaNotificaciones() {
  const [abierto, setAbierto] = useState(false)
  const [noLeidas, setNoLeidas] = useState(0)
  const [items, setItems] = useState<Notificacion[]>([])
  const [cargando, setCargando] = useState(false)
  // Posición calculada del botón, para pintar el dropdown vía portal.
  const [posicion, setPosicion] = useState<{ top: number; right: number } | null>(null)
  const botonRef = useRef<HTMLButtonElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const previoRef = useRef(0)
  const router = useRouter()

  // Sólo el conteo: una query indexada, sin traer la lista completa. Es lo
  // único que corre en cada intervalo del polling.
  const refrescarContador = useCallback(async () => {
    try {
      const r = await fetch('/api/notificaciones/contador', { cache: 'no-store' })
      if (!r.ok) return
      const { noLeidas: n } = await r.json() as { noLeidas: number }
      setNoLeidas(n)
      if (n > previoRef.current && previoRef.current !== 0) sonarAlerta()
      previoRef.current = n
    } catch {
      // Sin red: se reintenta en el siguiente intervalo.
    }
  }, [])

  const cargarLista = useCallback(async () => {
    setCargando(true)
    try {
      const r = await fetch(`/api/notificaciones?limite=${MAX_DROPDOWN}`, { cache: 'no-store' })
      if (!r.ok) return
      const data = await r.json() as { notificaciones: Notificacion[]; noLeidas: number }
      setItems(data.notificaciones)
      setNoLeidas(data.noLeidas)
      previoRef.current = data.noLeidas
    } finally {
      setCargando(false)
    }
  }, [])

  useEffect(() => { void refrescarContador() }, [refrescarContador])

  // El polling se detiene con la pestaña oculta: no tiene sentido consultar
  // mientras nadie mira, y evita acumular peticiones en pestañas de fondo.
  const [visible, setVisible] = useState(true)
  useEffect(() => {
    const onVis = () => setVisible(document.visibilityState === 'visible')
    onVis()
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [])

  usePolling(() => { void refrescarContador() }, INTERVALO_MS, visible)

  // Cerrar al hacer click fuera. El dropdown vive en un portal (document.body,
  // ver más abajo por qué), así que "fuera" significa fuera del botón Y fuera
  // del propio dropdown — ambos comprobados por ref.
  useEffect(() => {
    if (!abierto) return
    const handler = (e: MouseEvent) => {
      const objetivo = e.target as Node
      if (botonRef.current?.contains(objetivo)) return
      if (dropdownRef.current?.contains(objetivo)) return
      setAbierto(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [abierto])

  async function alternar() {
    const nuevo = !abierto
    if (nuevo && botonRef.current) {
      const r = botonRef.current.getBoundingClientRect()
      setPosicion({ top: r.bottom + 8, right: window.innerWidth - r.right })
    }
    setAbierto(nuevo)
    if (nuevo) await cargarLista()
  }

  async function abrirNotificacion(n: Notificacion) {
    setAbierto(false)
    if (!n.leida) {
      setNoLeidas(c => Math.max(0, c - 1))
      setItems(prev => prev.map(x => x.id === n.id ? { ...x, leida: true } : x))
      void fetch('/api/notificaciones/leer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: n.id }),
      })
    }
    if (n.href) router.push(n.href)
  }

  async function marcarTodas() {
    setNoLeidas(0)
    setItems(prev => prev.map(x => ({ ...x, leida: true })))
    await fetch('/api/notificaciones/leer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ todas: true }),
    })
  }

  return (
    <div style={{ position: 'relative' }}>
      <button
        ref={botonRef}
        type="button"
        onClick={() => void alternar()}
        aria-label={`Notificaciones${noLeidas > 0 ? ` (${noLeidas} sin leer)` : ''}`}
        style={{
          position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center',
          width: 38, height: 38, border: '1px solid #e2e8f0', background: '#fff',
          cursor: 'pointer', color: noLeidas > 0 ? '#1f355a' : '#64748b',
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        {noLeidas > 0 && (
          <span style={{
            position: 'absolute', top: -6, right: -6, minWidth: 18, height: 18, padding: '0 4px',
            borderRadius: 9, background: '#dc2626', color: '#fff',
            fontFamily: 'JetBrains Mono, monospace', fontSize: 10, fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {noLeidas > 99 ? '99+' : noLeidas}
          </span>
        )}
      </button>

      {abierto && posicion && createPortal(
        <div
          ref={dropdownRef}
          style={{
            position: 'fixed', top: posicion.top, right: posicion.right,
            width: ANCHO_DROPDOWN, zIndex: 999999,
            background: '#fff', border: '1px solid #e2e8f0',
            boxShadow: '0 16px 40px -12px rgba(15,23,42,0.35)',
          }}
        >
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '12px 14px', borderBottom: '1px solid #e2e8f0',
          }}>
            <span style={{
              fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: '0.14em',
              textTransform: 'uppercase', color: '#1f355a',
            }}>
              Notificaciones{noLeidas > 0 ? ` · ${noLeidas}` : ''}
            </span>
            {noLeidas > 0 && (
              <button type="button" onClick={() => void marcarTodas()} style={{
                border: 'none', background: 'transparent', cursor: 'pointer',
                fontFamily: 'JetBrains Mono, monospace', fontSize: 9, letterSpacing: '0.1em',
                textTransform: 'uppercase', color: '#64748b',
              }}>
                Marcar todas
              </button>
            )}
          </div>

          <div style={{ maxHeight: 380, overflowY: 'auto' }}>
            {cargando && items.length === 0 && (
              <p style={{ margin: 0, padding: '22px 14px', textAlign: 'center', color: '#94a3b8', fontSize: 12 }}>
                Cargando…
              </p>
            )}
            {!cargando && items.length === 0 && (
              <p style={{ margin: 0, padding: '22px 14px', textAlign: 'center', color: '#94a3b8', fontSize: 12 }}>
                Sin notificaciones
              </p>
            )}
            {items.map(n => (
              <button
                key={n.id}
                type="button"
                onClick={() => void abrirNotificacion(n)}
                style={{
                  display: 'block', width: '100%', textAlign: 'left', cursor: 'pointer',
                  padding: '11px 14px', border: 'none', borderBottom: '1px solid #f1f5f9',
                  background: n.leida ? '#fff' : '#f8fafc',
                  borderLeft: `3px solid ${n.leida ? 'transparent' : COLOR_SEVERIDAD[n.severidad] ?? '#0284c7'}`,
                }}
              >
                <span style={{
                  display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8,
                }}>
                  <span style={{
                    fontFamily: 'Inter, sans-serif', fontSize: 12.5,
                    fontWeight: n.leida ? 500 : 700, color: '#0f172a',
                    minWidth: 0, overflowWrap: 'break-word',
                  }}>
                    {n.titulo}
                  </span>
                  <span style={{
                    flexShrink: 0, fontFamily: 'JetBrains Mono, monospace', fontSize: 9, color: '#94a3b8',
                  }}>
                    {haceCuanto(n.creadoEn)}
                  </span>
                </span>
                <span style={{
                  display: 'block', marginTop: 3, fontFamily: 'Inter, sans-serif',
                  fontSize: 11.5, color: '#64748b', lineHeight: 1.45,
                }}>
                  {n.mensaje}
                </span>
              </button>
            ))}
          </div>

          <Link
            href="/notificaciones"
            onClick={() => setAbierto(false)}
            style={{
              display: 'block', padding: '11px 14px', borderTop: '1px solid #e2e8f0',
              textAlign: 'center', textDecoration: 'none', color: '#1f355a',
              fontFamily: 'JetBrains Mono, monospace', fontSize: 9,
              letterSpacing: '0.14em', textTransform: 'uppercase',
            }}
          >
            Ver todas
          </Link>
        </div>,
        document.body,
      )}
    </div>
  )
}
```

## Cambios a aplicar

Mantén toda la lógica (hooks, funciones, efectos) **exactamente igual**.
Cambia solo:

### 1. Imports — agrega iconos de lucide-react y el catálogo de eventos

```tsx
import {
  Bell, BellRing, BellOff, CheckCheck,
  Siren, Shield, Gavel, Scale, Video, Search, KeyRound, Ticket, Truck,
  ShieldAlert, Car, ClipboardList, FileText, Megaphone,
  type LucideIcon,
} from 'lucide-react'
import { definicionEvento } from '@/lib/notificaciones/catalogo'
```

`lib/notificaciones/catalogo.ts` es un archivo de datos puro (sin `'use
server'`, sin imports de `lib/db`), así que es seguro importarlo en un client
component.

### 2. Mapa de icono por módulo

Agrega, junto a `COLOR_SEVERIDAD`:

```tsx
const ICONO_MODULO: Record<string, LucideIcon> = {
  'Incidentes': Siren,
  'Oficial': Shield,
  'Fiscalía': Gavel,
  'Juzgado': Scale,
  'Monitorista': Video,
  'Análisis': Search,
  'Liberaciones': KeyRound,
  'Infracciones': Ticket,
  'Corralón': Truck,
  'Prevención': ShieldAlert,
  'Tránsito': Car,
  'Novedades': ClipboardList,
  'Reportes': FileText,
  'Administración': Megaphone,
}

function iconoDeEvento(evento: string): LucideIcon {
  const modulo = definicionEvento(evento)?.modulo
  return (modulo && ICONO_MODULO[modulo]) || Bell
}
```

### 3. Botón de campana — icono dinámico + animación al llegar una nueva

Reemplaza el `<svg>` a mano dentro del `<button ref={botonRef} ...>` por:

```tsx
{noLeidas > 0 ? <BellRing size={18} /> : <Bell size={18} />}
```

Para el "shake" al llegar una notificación nueva, agrega un estado y dispáralo
en el mismo punto donde ya se llama `sonarAlerta()` dentro de
`refrescarContador`:

```tsx
const [sacudir, setSacudir] = useState(false)

const refrescarContador = useCallback(async () => {
  try {
    const r = await fetch('/api/notificaciones/contador', { cache: 'no-store' })
    if (!r.ok) return
    const { noLeidas: n } = await r.json() as { noLeidas: number }
    setNoLeidas(n)
    if (n > previoRef.current && previoRef.current !== 0) {
      sonarAlerta()
      setSacudir(true)
      setTimeout(() => setSacudir(false), 600)
    }
    previoRef.current = n
  } catch {
    // Sin red: se reintenta en el siguiente intervalo.
  }
}, [])
```

Y en el `<button>`, agrega una clase condicional (o `style` con
`animation`) cuando `sacudir` es `true`. La forma más simple sin tocar
archivos CSS globales es un `<style jsx>` local o, si el proyecto no usa
styled-jsx, definir el keyframe una sola vez en un `<style>` inline dentro
del propio componente:

```tsx
<style>{`
  @keyframes campanilla-shake {
    0%, 100% { transform: rotate(0deg); }
    20% { transform: rotate(-14deg); }
    40% { transform: rotate(12deg); }
    60% { transform: rotate(-8deg); }
    80% { transform: rotate(6deg); }
  }
`}</style>
```

(inclúyelo una sola vez, por ejemplo justo antes del `return` del botón, o al
inicio del `return (` del componente) y aplica
`animation: sacudir ? 'campanilla-shake 0.5s ease-in-out' : 'none'` en el
`style` del botón.

### 4. Badge de icono por notificación en la lista

Reemplaza el `<button>` de cada item (el que actualmente solo tiene
`borderLeft` como indicador) para incluir un círculo de icono a la
izquierda. Estructura sugerida:

```tsx
{items.map(n => {
  const Icono = iconoDeEvento(n.evento)
  const color = COLOR_SEVERIDAD[n.severidad] ?? '#0284c7'
  return (
    <button
      key={n.id}
      type="button"
      onClick={() => void abrirNotificacion(n)}
      style={{
        display: 'flex', alignItems: 'flex-start', gap: 10, width: '100%',
        textAlign: 'left', cursor: 'pointer',
        padding: '11px 14px', border: 'none', borderBottom: '1px solid #f1f5f9',
        background: n.leida ? '#fff' : '#f8fafc',
      }}
    >
      <span style={{
        flexShrink: 0, width: 30, height: 30, borderRadius: '50%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: `${color}1a`, color,
      }}>
        <Icono size={15} />
      </span>
      <span style={{ flex: 1, minWidth: 0 }}>
        <span style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8 }}>
          <span style={{
            fontFamily: 'Inter, sans-serif', fontSize: 12.5,
            fontWeight: n.leida ? 500 : 700, color: '#0f172a',
            minWidth: 0, overflowWrap: 'break-word',
          }}>
            {n.titulo}
          </span>
          <span style={{ flexShrink: 0, fontFamily: 'JetBrains Mono, monospace', fontSize: 9, color: '#94a3b8' }}>
            {haceCuanto(n.creadoEn)}
          </span>
        </span>
        <span style={{
          display: 'block', marginTop: 3, fontFamily: 'Inter, sans-serif',
          fontSize: 11.5, color: '#64748b', lineHeight: 1.45,
        }}>
          {n.mensaje}
        </span>
      </span>
      {!n.leida && (
        <span style={{
          flexShrink: 0, width: 7, height: 7, borderRadius: '50%',
          background: color, marginTop: 5,
        }} />
      )}
    </button>
  )
})}
```

(`${color}1a` agrega alpha hex ~10% al color de severidad para el fondo del
círculo — es un truco válido porque los colores de `COLOR_SEVERIDAD` son
hex de 6 dígitos; si se cambia alguno a un formato no-hex habría que ajustar
esto a `rgba()`.)

### 5. Botón "Marcar todas" con icono

Reemplaza el texto plano por icono + texto:

```tsx
{noLeidas > 0 && (
  <button type="button" onClick={() => void marcarTodas()} style={{
    display: 'flex', alignItems: 'center', gap: 4,
    border: 'none', background: 'transparent', cursor: 'pointer',
    fontFamily: 'JetBrains Mono, monospace', fontSize: 9, letterSpacing: '0.1em',
    textTransform: 'uppercase', color: '#64748b',
  }}>
    <CheckCheck size={12} /> Marcar todas
  </button>
)}
```

### 6. Estado vacío con icono

```tsx
{!cargando && items.length === 0 && (
  <div style={{ padding: '28px 14px', textAlign: 'center', color: '#94a3b8' }}>
    <BellOff size={22} style={{ marginBottom: 6, opacity: 0.6 }} />
    <p style={{ margin: 0, fontSize: 12 }}>Sin notificaciones</p>
  </div>
)}
```

## Criterios de aceptación

- [ ] `npx tsc --noEmit` sin errores nuevos.
- [ ] `npm run build` compila sin errores (confirma que todos los iconos
      importados de `lucide-react` existen).
- [ ] El polling, el sonido de alerta, el portal, marcar leída/todas, y la
      navegación al hacer click en una notificación siguen funcionando
      exactamente igual que antes (no se tocó ninguna función de datos).
- [ ] Cada notificación en el dropdown muestra un icono coherente con su
      módulo (ej. una de `despacho.asignado`/`despacho.refuerzos` — módulo
      `Incidentes` — muestra el icono `Siren`).
- [ ] El botón de campana cambia a `BellRing` cuando `noLeidas > 0`.
- [ ] El estado vacío ("Sin notificaciones") ahora muestra un icono.
