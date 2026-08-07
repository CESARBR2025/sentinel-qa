# Contexto — `DashboardFooter` a Apple-style + fix del pin-to-bottom

## El pedido

En `/agente_despacho` se diseñó un footer Apple-style inline (`.desp-footer`, `app/agente_despacho/page.tsx`): tipografía `var(--apple-font-display)`, sentence-case, `border-top: 1px solid #e2e8f0`, `color: #94a3b8`, pegado al fondo del viewport vía `margin-top: auto`. El usuario aprobó ese estilo ("ya se ve bien") y pidió replicarlo en el componente compartido `components/partials/Footer.tsx` (`DashboardFooter`) para que se vea igual en las **34 páginas** que lo usan.

Antes de tocar código se investigó el bug real detrás de por qué el footer no siempre queda pegado abajo (ya diagnosticado por el usuario/DeepSeek en otra vista): `margin-top: auto` en `DashboardFooter` no hace nada si la página que lo usa no tiene la cadena flex completa —

```
root de la página: display:'flex', flexDirection:'column', minHeight:'100vh'
  └─ wrapper de contenido (el que envuelve todo antes del footer): flex: 1
       └─ ...contenido...
       └─ <DashboardFooter />   ← margin-top:auto solo funciona si el padre de arriba tiene flex:1
```

Mismo patrón ya documentado en `DESIGN.md §8` ("Footer de página pegado al fondo") — no se repite el valor aquí, se cita directo.

## Estado real del componente

`components/partials/Footer.tsx` sigue en el lenguaje táctico anterior (nunca se tocó en `plan-apple-pilot/` ni en `plan-refact-ui/`): `JetBrains Mono`, mayúsculas, `letterSpacing: 0.18em`, punto decorativo `#3e5171`. El estilo objetivo es exactamente el de `.desp-footer` en `app/agente_despacho/page.tsx` — ver Etapa 1.

## Auditoría de las 34 páginas (grep dirigido sobre el código real, no solo lectura completa archivo por archivo)

Se buscó en cada archivo: presencia de `100vh` en el root, `flexDirection: 'column'` (o `"column"`), `flex: 1`, y el wrapper hack `marginTop: 40` alrededor de `<DashboardFooter />`. Clasificación resultante:

### Grupo A — "auditar" (28 páginas, grep sugiere que ya tienen la cadena flex completa)

No se puede dar por bueno solo con el conteo de grep — el `flex:1` podría estar en un elemento que no es el padre directo del footer. Cada etapa que toca este grupo debe **abrir el archivo real y confirmar** antes de marcarlo como "sin cambios".

- Fiscalía (11): `fiscalia/page.tsx`, `fiscalia/asegurados/page.tsx`, `fiscalia/asegurados/[id]/page.tsx`, `fiscalia/asegurados/puesta-disposicion/[id]/page.tsx`, `fiscalia/detenidos/page.tsx`, `fiscalia/detenidos/[id]/page.tsx`, `fiscalia/expedientes/[solicitudId]/page.tsx`, `fiscalia/liberaciones/page.tsx`, `fiscalia/liberaciones/[id]/page.tsx`, `fiscalia/solicitudes/page.tsx`, `fiscalia/solicitudes/[solicitudId]/page.tsx`.
- Monitorista (3): `monitorista/page.tsx`, `monitorista/detenidos/page.tsx`, `monitorista/solicitudes/page.tsx`.
- Formatos UDAI (3): `formatos-udai/page.tsx`, `formatos-udai/faltas-administrativas/page.tsx`, `formatos-udai/reportes-incidencias/page.tsx`.
- `agente_911/ciudadano/*` (3): `agente_911/ciudadano/page.tsx`, `agente_911/ciudadano/incidentes/page.tsx`, `agente_911/ciudadano/revisar/page.tsx`.
- Sueltas (5): `agente_reportes/page.tsx`, `envio-de-formatos/page.tsx`, `reporte-detenidos/page.tsx`, `analisis/page.tsx`, `analisis/formulario-ingreso/page.tsx`.
- Admin-Tránsito (2, caso especial — ver Grupo especial más abajo): `admin-transito/page.tsx`, `admin-transito/oficiales/page.tsx`.

### Grupo B — "hack a remover" (5 páginas)

Confirmado en código real (no solo grep): tienen `<div style={{ marginTop: 40 }}><DashboardFooter /></div>` — el footer NO está pegado al fondo, solo tiene un margen fijo arriba, siempre queda inmediatamente después del contenido.

- `app/agente_911/despacho/page.tsx` — root: `minHeight:'100vh'` sin `display:flex`/`flexDirection:column`.
- `app/agente_despacho/kpi-incidencias/page.tsx` — mismo caso.
- `app/notificaciones/page.tsx` — mismo caso.
- `app/analisis/iph/page.tsx` — root sin flex; el `<main className="pad-dashboard">` interno sí tiene `display:flex, flexDirection:column` pero le falta `flex:1`.
- `app/analisis/pendiente-analisis/page.tsx` — mismo caso que `iph`.

Fix: agregar la cadena flex real (root `display:flex,flexDirection:column` + el wrapper de contenido correcto con `flex:1`) y reemplazar `<div style={{marginTop:40}}><DashboardFooter/></div>` por `<DashboardFooter />` directo, como último hijo de ese wrapper.

### Grupo C — "roto, sin ningún fix" (1 página)

- `app/analisis/generar-ppt/page.tsx` — root `minHeight:'100vh'` sin `display:flex` ni `flexDirection:column`, sin `flex:1` en ningún wrapper, sin workaround. El footer hoy simplemente aparece pegado al final del contenido (nunca al fondo del viewport). Mismo fix que el Grupo B, sin wrapper que remover.

### Grupo especial — `app/admin/roles/agregar/page.tsx`

Root es un `<main>` (no un `<div>`) con solo `minHeight:'100vh'`, sin cadena flex. Además la página es huérfana del lenguaje visual anterior: `<style dangerouslySetInnerHTML>` con `@import` de Google Fonts (JetBrains Mono + Barlow Condensed), **sin `DashboardHeader`** (usa un link con ícono `ArrowLeft` como "volver", no el patrón de header), y un contenedor con `maxWidth: '1200px'` inline que viola `DESIGN.md §5` ("prohibido `maxWidth` en contenedores de página").

**Fuera de alcance de este plan arreglar todo eso.** La etapa correspondiente (7) solo toca lo mínimo indispensable para que el footer quede pegado abajo: agregar `display:flex, flexDirection:column` al `<main>` root y `flex:1` al div de contenido que ya existe. El resto de la deuda (fuentes muertas, sin header, `maxWidth` fijo) se anota en el reporte de la etapa como pendiente, no se toca.

## Rol de quien planea vs. quien construye

Mismo acuerdo que `plan-apple-pilot/` y `plan-refact-ui/`: Claude (arquitecto) investiga y entrega el plan, no implementa el código de producción. DeepSeek ejecuta las etapas.

## Cómo se especifica el estilo

El estilo objetivo ya existe en código real — `.desp-footer` en `app/agente_despacho/page.tsx` (líneas del bloque `<style>` con clase `.desp-footer` + el JSX del footer) — y el patrón de la cadena flex ya está documentado en `DESIGN.md §8` ("Footer de página pegado al fondo"). Las etapas no repiten esos valores, apuntan directo a esas dos fuentes.

## Orden y agrupación

7 etapas. La Etapa 1 (el componente en sí) va primero porque su sola actualización ya mejora visualmente las 34 páginas aunque el posicionamiento de algunas siga roto hasta etapas posteriores. Etapas 2-4 son auditoría del Grupo A (agrupado por módulo, igual que otros planes de este repo). Etapa 5 = Grupo B completo (mismo fix mecánico en 5 archivos). Etapa 6 = el único caso del Grupo C, aislado por ser distinto (sin workaround previo). Etapa 7 = Admin, cierra con el caso especial documentado arriba.
