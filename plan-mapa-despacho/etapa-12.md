# Etapa 12 — Catálogo completo de prioridades (incluye CRÍTICA) + gradiente de color por urgencia + nuevo ícono de incidente

> Repo: `seguridad_publica` (Next.js 16.2.4, React 19, TypeScript, Postgres). Parte 12 (última) del plan "Mapa tipo Uber en Asignar Unidades". Ver `00-contexto.md` para trasfondo general. **Requiere que las etapas 10 y 11 ya estén construidas** (ya debe existir `lib/incidentes/prioridad-colores.ts` con `colorPorPrioridad`, ya usado en `TablonDespacho.tsx` para el borde+etiqueta de cada tarjeta y en `AsignacionMapa.tsx` para el color del marcador del incidente).

## Bug reportado por el usuario

Al usar la feature completa, apareció un incidente con prioridad **CRÍTICA** mostrado en **gris** — el mismo color que "sin prioridad". Se verificó contra la base de datos real (`SELECT id, clave, nombre, orden, activo FROM cat_prioridades ORDER BY orden`) y el catálogo real tiene **4 niveles activos**, no 3:

| id | clave | nombre | orden |
|---|---|---|---|
| 1 | BAJA | Baja | 1 |
| 2 | MEDIA | Media | 2 |
| 3 | ALTA | Alta | 3 |
| 4 | CRITICA | Crítica | 4 |

`lib/incidentes/prioridad-colores.ts` (creado en la Etapa 10, ajustado en la Etapa 11) hoy solo mapea `BAJA`/`MEDIA`/`ALTA` — `CRITICA` no está en `PRIORIDAD_COLORES`, así que `colorPorPrioridad('CRITICA')` cae en `PRIORIDAD_COLOR_DEFAULT` (gris), el mismo color reservado para "prioridad no resuelta". Eso es lo que vio el usuario y es el bug a corregir.

## Objetivo (dos partes)

1. **Corregir el catálogo de colores** para cubrir los 4 niveles reales, con un **gradiente por urgencia**: rojo = más urgente (CRÍTICA) hasta azul = menos urgente (BAJA) — es decir, ya no son 3 colores sueltos sino una escala ordenada. El gris queda **exclusivamente** reservado para "sin prioridad resuelta" (nunca para un nivel real). Esto ya se refleja automáticamente tanto en las tarjetas del tablón como en el marcador del mapa, porque ambos consumen la misma función `colorPorPrioridad` — no hace falta tocar la lógica de `TablonDespacho.tsx` ni de `AsignacionMapa.tsx` más allá de lo que ya usan.
2. **Cambiar el glifo interior del marcador del incidente** en el mapa: hoy es un signo de exclamación (línea + punto). Reemplazarlo por un ícono que comunique mejor "emergencia/urgencia" — un rayo (lightning bolt), un símbolo ampliamente reconocido para "urgente/alerta", fácil de dibujar como un polígono simple dentro del mismo SVG data-URI que ya se usa (sin librerías de íconos externas, consistente con cómo ya se construyen todos los marcadores de este mapa).

## Archivos a modificar

### 1. `lib/incidentes/prioridad-colores.ts`

Reemplaza el contenido completo por:

```ts
export interface PrioridadColor { principal: string; oscuro: string; fondo: string }

// Gradiente por urgencia: rojo (más urgente) → azul (menos urgente).
// El gris (PRIORIDAD_COLOR_DEFAULT) NUNCA representa un nivel real — solo
// "prioridad no resuelta" (null). No confundirlo con ningún nivel del catálogo.
export const PRIORIDAD_COLORES: Record<string, PrioridadColor> = {
  CRITICA: { principal: '#dc2626', oscuro: '#7f1d1d', fondo: '#fef2f2' }, // rojo — máxima urgencia
  ALTA:    { principal: '#f97316', oscuro: '#9a3412', fondo: '#fff7ed' }, // naranja
  MEDIA:   { principal: '#eab308', oscuro: '#a16207', fondo: '#fefce8' }, // amarillo
  BAJA:    { principal: '#2563eb', oscuro: '#1d4ed8', fondo: '#eff6ff' }, // azul — menor urgencia
}
export const PRIORIDAD_COLOR_DEFAULT: PrioridadColor = { principal: '#94a3b8', oscuro: '#475569', fondo: '#f8fafc' } // gris neutro, sin prioridad resuelta

export function colorPorPrioridad(prioridad: string | null | undefined): PrioridadColor {
  if (!prioridad) return PRIORIDAD_COLOR_DEFAULT
  return PRIORIDAD_COLORES[prioridad.toUpperCase()] ?? PRIORIDAD_COLOR_DEFAULT
}
```

No cambia la firma de `colorPorPrioridad` ni la forma de `PrioridadColor` (sigue siendo `{principal, oscuro, fondo}`) — es un cambio de **datos**, no de contrato. Por eso `TablonDespacho.tsx` (borde de tarjeta + etiqueta de texto, Etapa 11) y `AsignacionMapa.tsx` (color del marcador del incidente) heredan el gradiente nuevo automáticamente sin que haga falta tocarlos para la parte de color.

### 2. `components/911/despacho/AsignacionMapa.tsx`

Dentro de `buildIncidenteSvgIcon` (~línea 15-24), reemplaza el glifo de exclamación (la `<line>` y el `<circle>` que forman el "!") por un rayo/lightning bolt, manteniendo intacto todo lo demás (el halo, el círculo principal, el pin/cola — nada de eso cambia, solo el glifo interior):

```ts
function buildIncidenteSvgIcon(color: string): { url: string } {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="54" height="54" viewBox="0 0 54 54">
  <circle cx="27" cy="21" r="24" fill="#fff" fill-opacity="0.55"/>
  <circle cx="27" cy="21" r="21" fill="${color}" stroke="#fff" stroke-width="3"/>
  <polygon points="27,54 15,36 39,36" fill="${color}" stroke="#fff" stroke-width="3" stroke-linejoin="round"/>
  <polygon points="28,9 18,21 27,21 26,29 36,17 27,17 28,9" fill="#fff"/>
</svg>`;
  return { url: `data:image/svg+xml,${encodeURIComponent(svg)}` };
}
```

El polígono nuevo es un rayo simple, centrado dentro del círculo principal (mismo centro `cx=27, cy=21` que el círculo de fondo) — visualmente ocupa aproximadamente el mismo espacio que ocupaba el signo de exclamación anterior, así que no hace falta reajustar el tamaño del círculo ni el halo.

## Qué NO hacer en esta etapa

- No cambies la forma general del marcador (halo, círculo, pin/cola) — la Etapa 11 ya lo dejó en el tamaño y proporción correctos, esta etapa solo cambia el glifo interior y la paleta de colores.
- No toques `TablonDespacho.tsx` — ya consume `colorPorPrioridad`/`pc.principal`/`pc.oscuro`/`pc.fondo` (Etapas 10 y 11), así que hereda el gradiente nuevo sin cambios de código ahí.
- No agregues el valor "CRITICA" como un caso especial fuera del objeto `PRIORIDAD_COLORES` (por ejemplo con un `if` aparte) — debe vivir dentro del mismo mapeo, igual que los otros tres niveles, para que toda la lógica de fallback (`?? PRIORIDAD_COLOR_DEFAULT`) siga funcionando igual de simple.
- No cambies los colores de las unidades del mapa (`buildUnidadSvgIcon`) ni sus badges — esta etapa es solo sobre el color/ícono del INCIDENTE.

## Criterios de aceptación

1. `npx tsc --noEmit` sin errores.
2. Confirmar contra la BD real que el catálogo sigue siendo BAJA/MEDIA/ALTA/CRITICA (los 4 activos) — si aparece algún nivel nuevo que no estaba documentado aquí, agregarlo también a `PRIORIDAD_COLORES` siguiendo el mismo criterio de gradiente (más urgente → más rojo, menos urgente → más azul).
3. Un incidente con prioridad CRÍTICA se ve en rojo tanto en el borde/etiqueta de su tarjeta en el tablón como en el marcador del mapa — ya no cae en gris.
4. Los 4 niveles se distinguen visualmente entre sí sin ambigüedad: CRÍTICA (rojo) más intenso/urgente que ALTA (naranja), que a su vez se nota más urgente que MEDIA (amarillo), que a su vez más urgente que BAJA (azul).
5. Un incidente sin prioridad resuelta (`null`) se sigue viendo en gris neutro — visualmente distinto de los 4 colores de prioridad real (en particular, no debe confundirse con CRÍTICA ni con ningún otro nivel).
6. El marcador del incidente en el mapa muestra el nuevo ícono de rayo en vez del signo de exclamación, del mismo tamaño/proporción que el marcador dejado por la Etapa 11 (54×54, con halo), sin desplazar la punta del pin de la coordenada exacta del incidente.
7. No se rompió ninguna validación de etapas anteriores (colores/badges de unidades, unidad ocupada, unidad prioritaria, etiqueta de prioridad en tarjetas).

Con esta etapa completada y validada, el plan del mapa de asignación de unidades queda cerrado. No quedan etapas pendientes.
