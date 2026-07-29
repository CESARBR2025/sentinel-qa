# Etapa 11 — Etiqueta de prioridad en las tarjetas + marcador del incidente más grande y visible

> Repo: `seguridad_publica` (Next.js 16.2.4, React 19, TypeScript). Parte 11 (última) del plan "Mapa tipo Uber en Asignar Unidades". Ver `00-contexto.md` para trasfondo general. **Requiere que la Etapa 10 ya esté construida y validada** (ya debe existir `lib/incidentes/prioridad-colores.ts` con `colorPorPrioridad`, ya usado en `TablonDespacho.tsx` para el borde izquierdo de cada tarjeta y en `AsignacionMapa.tsx` para el color del marcador del incidente).

## Objetivo

Dos mejoras visuales pedidas por el usuario tras usar la feature completa en `http://localhost:3000/agente_911/despacho`:

1. **Etiqueta de texto de prioridad en cada tarjeta del tablón** ("BAJA"/"MEDIA"/"ALTA"), alineada a los mismos colores ya definidos en `prioridad-colores.ts` (azul/amarillo/rojo). Hoy la prioridad solo se comunica con el color del borde izquierdo de la tarjeta — no hay ninguna etiqueta de texto visible.
2. **Marcador del incidente en el mapa más grande y más visible.** Hoy usa un ícono de 36×36 con trazo blanco de 2px — se pide agrandarlo y reforzar su contraste contra el mapa.

## Confirmado en el código real (ya construido por etapas anteriores)

- `lib/incidentes/prioridad-colores.ts` ya existe:
  ```ts
  export interface PrioridadColor { principal: string; oscuro: string }
  export const PRIORIDAD_COLORES: Record<string, PrioridadColor> = {
    BAJA:  { principal: '#2563eb', oscuro: '#1d4ed8' },
    MEDIA: { principal: '#eab308', oscuro: '#a16207' },
    ALTA:  { principal: '#dc2626', oscuro: '#991b1b' },
  }
  export const PRIORIDAD_COLOR_DEFAULT: PrioridadColor = { principal: '#94a3b8', oscuro: '#475569' }
  export function colorPorPrioridad(prioridad: string | null | undefined): PrioridadColor { ... }
  ```
- `components/911/despacho/TablonDespacho.tsx`, dentro de `CardRow` (~línea 246-263), ya calcula `const pc = colorPorPrioridad(card.prioridad)` y lo usa solo para `borderLeft: 4px solid ${pc.principal}`. La fila de badges (folio + `CanalBadge` + badge "⏱ SLA" condicional) está en ~línea 264-272 — ahí es donde debe ir la nueva etiqueta de prioridad.
- `components/911/despacho/AsignacionMapa.tsx` — el marcador del incidente se construye con `buildIncidenteSvgIcon(color)` (~línea 15-23):
  ```ts
  function buildIncidenteSvgIcon(color: string): { url: string } {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36">
    <circle cx="18" cy="14" r="14" fill="${color}" stroke="#fff" stroke-width="2"/>
    <polygon points="18,36 10,24 26,24" fill="${color}" stroke="#fff" stroke-width="2" stroke-linejoin="round"/>
    <line x1="18" y1="8" x2="18" y2="16" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/>
    <circle cx="18" cy="20" r="1.5" fill="#fff"/>
  </svg>`;
    return { url: `data:image/svg+xml,${encodeURIComponent(svg)}` };
  }
  ```
  Se usa en un `<MarkerF icon={buildIncidenteSvgIcon(colorPorPrioridad(prioridad).principal)} clickable={false} />` (~línea 201-205), sin ningún `anchor`/`scaledSize` explícito — el tamaño lo determina puramente el `width`/`height`/`viewBox` del SVG.

## Archivos a modificar

### 1. `lib/incidentes/prioridad-colores.ts`

Agrega un tercer campo `fondo` (color de fondo claro, para usarse como badge de texto) a la interfaz y a cada entrada, siguiendo el mismo patrón de fondos claros que ya usan otros badges del archivo (ej. `CanalBadge` en `TablonDespacho.tsx`, o el badge "OCUPADA" `#fef2f2`/`#dc2626`):

```ts
export interface PrioridadColor { principal: string; oscuro: string; fondo: string }

export const PRIORIDAD_COLORES: Record<string, PrioridadColor> = {
  BAJA:  { principal: '#2563eb', oscuro: '#1d4ed8', fondo: '#eff6ff' },
  MEDIA: { principal: '#eab308', oscuro: '#a16207', fondo: '#fefce8' },
  ALTA:  { principal: '#dc2626', oscuro: '#991b1b', fondo: '#fef2f2' },
}
export const PRIORIDAD_COLOR_DEFAULT: PrioridadColor = { principal: '#94a3b8', oscuro: '#475569', fondo: '#f8fafc' }
```

`colorPorPrioridad` no cambia de firma, solo el tipo de retorno gana el campo nuevo — no rompe a los consumidores existentes (`TablonDespacho.tsx`, `AsignacionMapa.tsx`) que solo leen `.principal`.

### 2. `components/911/despacho/TablonDespacho.tsx`

En `CardRow`, dentro de la fila de badges (~línea 264-272, la que ya contiene `<CanalBadge .../>` y el badge condicional "⏱ SLA"), agrega una etiqueta de texto con la prioridad, justo después de `<CanalBadge .../>`:

```jsx
<span style={{
  fontFamily: 'Inter', fontSize: 9, fontWeight: 700, padding: '1px 6px',
  background: pc.fondo, color: pc.oscuro, border: `1px solid ${pc.principal}`,
  borderRadius: 2, textTransform: 'uppercase', letterSpacing: '0.04em',
}}>
  {card.prioridad?.toUpperCase() ?? 'SIN PRIORIDAD'}
</span>
```

`pc` ya está calculado al inicio de `CardRow` (`const pc = colorPorPrioridad(card.prioridad)`) — reutilízalo, no vuelvas a llamar `colorPorPrioridad` dos veces. No cambies el uso existente de `pc.principal` en el `borderLeft` de la tarjeta.

### 3. `components/911/despacho/AsignacionMapa.tsx`

Agranda y refuerza el contraste de `buildIncidenteSvgIcon`, manteniendo la misma forma de pin con signo de exclamación (solo escalado ~1.5x y con trazo más grueso), y agrega un halo blanco de fondo para que destaque mejor contra el mapa:

```ts
function buildIncidenteSvgIcon(color: string): { url: string } {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="54" height="54" viewBox="0 0 54 54">
  <circle cx="27" cy="21" r="24" fill="#fff" fill-opacity="0.55"/>
  <circle cx="27" cy="21" r="21" fill="${color}" stroke="#fff" stroke-width="3"/>
  <polygon points="27,54 15,36 39,36" fill="${color}" stroke="#fff" stroke-width="3" stroke-linejoin="round"/>
  <line x1="27" y1="12" x2="27" y2="24" stroke="#fff" stroke-width="3.5" stroke-linecap="round"/>
  <circle cx="27" cy="30" r="2.2" fill="#fff"/>
</svg>`;
  return { url: `data:image/svg+xml,${encodeURIComponent(svg)}` };
}
```

Notas de la escala aplicada (para que quien construya entienda el porqué de cada número, no solo los copie): todo el diseño original (círculo r=14, polígono, línea, punto) se escaló proporcionalmente ×1.5 desde el `viewBox 0 0 36 36` original a `0 0 54 54`, y el `stroke-width` pasó de 2 a 3 (más grueso, mejor contraste). Se agregó un círculo de halo semi-transparente (`fill-opacity="0.55"`) tras el círculo principal, ligeramente más grande (r=24 vs r=21), para que el marcador se distinga incluso sobre fondos de mapa claros o saturados de otros marcadores cercanos. No cambies la posición relativa de la punta del pin (debe seguir tocando exactamente la coordenada del incidente) — por eso el escalado es proporcional en todos los puntos, no solo en el tamaño del círculo.

No es necesario agregar `anchor`/`scaledSize` explícito al `MarkerF` — el mismo mecanismo de anclaje implícito que ya usa el proyecto (basado en el tamaño natural del SVG) sigue funcionando igual, solo que ahora sobre una imagen más grande.

## Qué NO hacer en esta etapa

- No cambies los tamaños/colores de los marcadores de las UNIDADES (`buildUnidadSvgIcon`) — esta etapa es solo sobre el marcador del INCIDENTE y la etiqueta de prioridad en las tarjetas del tablón.
- No agregues animaciones (pulso, parpadeo) al marcador — el pedido es "más grande, más visible", no animado; mantén el cambio simple y estático.
- No dupliques el cálculo de `colorPorPrioridad` en `TablonDespacho.tsx` — reutiliza la variable `pc` que ya existe en `CardRow`.
- No cambies el `borderLeft` de la tarjeta ni el badge "⏱ SLA" — solo se agrega una etiqueta nueva, no se quita ni modifica nada existente en esa fila.

## Criterios de aceptación

1. `npx tsc --noEmit` sin errores.
2. En `/agente_911/despacho`, cada tarjeta de incidente muestra una etiqueta de texto con su prioridad ("BAJA"/"MEDIA"/"ALTA"/"SIN PRIORIDAD"), con el mismo color que ya tiene el borde izquierdo de esa misma tarjeta (azul/amarillo/rojo/gris).
3. La etiqueta nueva no rompe el layout de la fila de badges existente (folio, canal/rondín, SLA si aplica) — debe verse alineada junto a los demás badges, sin desbordarse ni encimarse.
4. Al abrir "Unidades cercanas al hecho" de cualquier incidente con coordenadas, el marcador del lugar del hecho se ve notablemente más grande que antes y con mejor contraste (halo blanco detrás), sin perder su forma de pin ni su color según prioridad.
5. La punta del pin sigue señalando exactamente la coordenada del incidente (no se desplaza ni queda descentrado por el cambio de tamaño).
6. No se rompió ninguna validación de etapas anteriores: colores/badges de las unidades (Etapas 4, 6, 9) sin cambios, color del marcador según prioridad (Etapa 10) sigue funcionando igual, solo más grande.

Con esta etapa completada y validada, el plan del mapa de asignación de unidades queda cerrado. No quedan etapas pendientes.
