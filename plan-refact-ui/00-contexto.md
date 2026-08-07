# Contexto — Migración UI Oficial + Despacho al lenguaje Apple-style

## El pedido

Tras el piloto en Login + Hub (`plan-apple-pilot/`, ya construido y aprobado por el usuario — "me gustó bastante"), el usuario decidió formalmente adoptar el lenguaje Apple-style como el **único lenguaje visual del sistema, sin excepción** (confirmado vía `AskUserQuestion`, opción "Todo el sistema, sin excepción"). `DESIGN.md` (raíz del repo) ya se reescribió completo con ese lenguaje como especificación — tipografía única de sistema, un acento por vista, materialidad glass vs. plana, radios consistentes, motion con propósito — y su `§10` documenta qué partes del código ya están migradas (Login + Hub) y cuáles no.

Este plan cubre la siguiente migración pedida explícitamente por el usuario: **el módulo Oficial** (la app de campo para oficiales de policía, `app/oficial/` + `components/oficial/`) y **el módulo Despacho/911** (las vistas donde el monitorista/despachador asigna unidades a incidentes, `app/agente_911/`, `app/agente_despacho/`, `components/911/`).

## Alcance verificado en código real

Se investigó con dos agentes de exploración en paralelo, leyendo el contenido completo (no solo grep) de cada archivo de ambos módulos. Resultado: **41 archivos de UI** repartidos en 27 (Oficial) + 14 (Despacho/911).

### Hallazgo transversal

Prácticamente **todo** el código de ambos módulos sigue el lenguaje táctico anterior: Barlow Condensed/JetBrains Mono, `text-transform: uppercase`, colores tácticos hardcodeados (`#1f355a`, `#3e5171`), radios de 2-4px, y casi todo con objetos `style={{}}` inline en vez de clases CSS — cada página top-level repite su propio `<style>@import url(...JetBrains+Mono...Barlow+Condensed...)</style>`. Esto significa que la migración es, en su mayoría, un **restyle de JSX inline puro**: no hay una capa de CSS centralizada que se pueda cambiar en un solo lugar (excepción parcial: `configuracion/page.tsx`, `MapaUbicacion.tsx`, `FormularioRecorrido.tsx` y `UnidadCards.tsx` ya usan algunas clases CSS con `<style>` embebido).

### Componente duplicado detectado: `SegmentControl` vs `SegmentPage`

`components/oficial/SegmentControl.tsx` es una implementación paralela de `components/partials/SegmentPage.tsx` (la REGLA de `DESIGN.md §4`) — mismo propósito (tabs de segmento), pero navega por `URLSearchParams`/`router.push` en vez de soportar `href`/`onChange` como `SegmentPage`. Solo lo usa `app/oficial/despachos/page.tsx`. **Decisión para este plan**: no consolidar en `SegmentPage` (sería un refactor funcional, no solo visual, y se saldría del alcance "solo estilo" de esta migración) — se restylea `SegmentControl` para que se vea igual que la pill de `SegmentPage` (§4), pero conserva su propia lógica de navegación por query params. Consolidar los dos componentes queda anotado como pendiente futuro, no se hace aquí.

### Archivos sin UI visual (fuera de alcance, no llevan etapa)

- `app/oficial/layout.tsx` — solo envuelve en `OficialUbicacionProvider`, sin JSX visual.
- `components/oficial/OficialUbicacionTracker.tsx` — context provider de tracking GPS; el único JSX es un toast de permiso denegado (se incluye en la Etapa 11 junto a otros toasts pequeños, el resto del archivo es lógica pura y no se toca).

### Lógica de negocio que NO se toca en ninguna etapa (transversal a todo el plan)

- **Mapas** (`@react-google-maps/api`): `MapaPinFijo`, `MapaUbicacion`, `NavegacionDespacho`, `AsignacionMapa`, `MapaSeguimientoOficial` — marcadores SVG dinámicos, `fitBounds`, `DirectionsService`, cálculo de rumbo/geofence. Se restylea únicamente el chrome alrededor del mapa (contenedores, botones, estados de carga/error) — nunca las funciones que generan/mueven el mapa.
- **GPS / geolocalización**: `navigator.geolocation.watchPosition`/`getCurrentPosition` en `OficialUbicacionTracker`, `MapaUbicacion`, `NavegacionDespacho`, `RondinPageClient`.
- **Polling**: `ContadorAsignaciones` (30s), `TablonDespacho` (20s), `Bitacora911` (20s), `SeleccionarUnidadesModal` (18s).
- **Stores/estado complejo**: `useOficialFormStore` (Zustand, `FormularioRecorrido`), `useRondinFormStore` (Zustand, `RondinPageClient`).
- **Server actions / fetch**: `asignarPatrulla`, `createDespacho`, `enviarRefuerzos`, `/api/despacho/unidades-cercanas`, `/api/despacho/buscar-oficial`.

Ninguna etapa de este plan debe modificar estas piezas — solo el marcado/estilos que las envuelve. Si una etapa necesita tocar una línea de lógica para que el restyle funcione (ej. una clase condicional), debe ser el mínimo indispensable y quedar explícito en el reporte.

## Rol de quien planea vs. quien construye

Mismo acuerdo que en `plan-apple-pilot/`: Claude (este chat) es el arquitecto — investiga y entrega el plan, no implementa el código de producción. DeepSeek ejecuta las etapas.

## Cómo se especifica el estilo (distinto al piloto)

En `plan-apple-pilot/`, cada etapa traía snippets de código exactos porque el lenguaje Apple-style todavía no existía documentado. Ahora **`DESIGN.md` ya es la especificación completa** (tipografía §3, componentes §4, materialidad/radios §6, do's/don'ts §7). Por eso las etapas de este plan son más ligeras: listan los archivos exactos, qué sección de `DESIGN.md` aplica, qué NO tocar (lógica de negocio), y los criterios de aceptación — no repiten el detalle que ya vive en `DESIGN.md`. **Quien construye debe tener `DESIGN.md` abierto y aplicarlo directamente**, no inventar valores nuevos.

## Orden y agrupación

18 etapas, agrupadas por página/función (no una por archivo — se agrupan archivos que se ven o se tocan juntos). Etapas 1-11 = módulo Oficial, 12-18 = módulo Despacho/911. Dentro de Oficial, la Etapa 1 (`SegmentControl`) va primero porque la Etapa 3 (`despachos/page.tsx`) la usa. El resto son mayormente independientes entre sí pero se ejecutan en orden numérico por convención del proyecto.
