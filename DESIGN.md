# DESIGN.md — SSPM · CENTINELA

Sistema de Gestión de Seguridad Pública (SSPM) San Juan del Río. **Fuente de verdad visual del proyecto.**

Los agentes de codificación leen este archivo para generar UI consistente. **No hay otra fuente**: los tokens, componentes y reglas de diseño de este proyecto viven aquí. Si el código difiere, este documento manda y el código se corrige.

Formato según especificación [Google Stitch DESIGN.md](https://stitch.withgoogle.com/docs/design-md/specification/).

---

## 1 · Visual Theme & Atmosphere

Sistema institucional de **seguridad pública / despacho 911**: sobrio, de alta densidad informativa, con estética de **"tablón de despacho"** (mono-labels, acentos semánticos por estado, jerarquía tipográfica marcada).

- **Sobrio e institucional**: superficies claras (`#F1F5F9`), bordes finos, nada de gradientes decorativos salvo los botones primarios.
- **Alta densidad**: los labels y metadatos van en **JetBrains Mono** mayúscula con letter-spacing, compactos (9.5–12px). El cuerpo legible en Inter.
- **Acentos semánticos**: el color comunica **estado** (pendiente/éxito/peligro) y **módulo**. Cada dominio tiene su acento propio (ver §2).
- **Officel/911**: las vistas de despacho usan el estilo de tablón: segmentos con borde que se rellenan del color semántico al activarse.
- **Tipografía display**: títulos en **Barlow Condensed 800** mayúscula, amplio letter-spacing — sensación de sistema de comando/estación de control.
- **Movimiento**: sutil y funcional (hover elevación, esquinas animadas en tarjetas hub, transiciones cortas 0.15–0.4s). Nada llamativo ni lúdico.

## 2 · Color Palette & Roles

### Tokens base (fuente: `app/globals.css` `@theme`)

| Token | Hex | Rol |
|---|---|---|
| `background` | `#F1F5F9` | Fondo de página |
| `surface` / `card` | `#FFFFFF` | Tarjetas, secciones, inputs |
| `primary` | `#1f355a` | Acento institucional default, foco, fills, badges activos |
| `primary-dark` | `#132138` | Hover/gradiente profundo de primary |
| `primary-light` | `#64748d` | Primary degradado (íconos, variantes) |
| `border` | `#E2E8F0` | Bordes de componentes |
| `text-primary` | `#0F172A` | Títulos y texto principal |
| `text-secondary` | `#64748B` | Subtítulos, labels, descripciones |
| `text-muted` | `#94A3B8` | Metadatos secundarios, placeholders |
| `success` | `#22C55E` | Estado OK |
| `success-bg` | `#DCFCE7` | Fondo badge éxito |
| `warning` | `#F59E0B` | Estado pendiente/atención |
| `warning-bg` | `#FEF3C7` | Fondo badge warning |
| `danger` | `#EF4444` | Estado error/peligro/detención |
| `danger-bg` | `#FEE2E2` | Fondo badge danger |

### Acentos por módulo (semántica de dominio)

| Módulo | Acento | Uso |
|---|---|---|
| Default / Panel | `#1f355a` | Cualquier vista sin acento propio |
| Catálogos / Patrullas | `#c0223a` | `PageHeader` y acentos de `app/dashboard/catalogos` |
| Fiscalía | `#7c3aed` | Vista `/fiscalia` (cards hub, forms, detalles) |

### Roles de badge

Los badges de estado usan la pareja `bg` + color fuerte: `success-bg`/`success`, `warning-bg`/`warning`, `danger-bg`/`danger`. El **accent semántico** de un tab/segmento activo es el color fuerte; el inactivo queda blanco con texto `#64748b`.

## 3 · Typography Rules

Tres familias. **Títulos display → Barlow Condensed. Labels/meta → JetBrains Mono. Cuerpo → Inter** (en el layout se carga Geist como `--font-sans` con fallback a Inter).

| Rol | Font | Peso | Tamaño | Letter-spacing | Transform | Color |
|---|---|---|---|---|---|---|
| Título de página (`PageHeader h2`) | Barlow Condensed | 800 | 32px | 0.06em | uppercase | `#0f172a` (acento en accentColor) |
| Título de paso (`StepIndicator`) | Barlow Condensed | 800 | 28px | 0.04em | uppercase | `#1f355a` |
| Título de card hub (`card-o h3`) | Barlow Condensed | 800 | 28px | — | uppercase | `#0f172a` |
| Título de sección (`fk-head-title`) | Barlow Condensed | 800 | 32px | 0.05em | uppercase | `#0f172a` |
| Botón primario/secundario | Barlow Condensed | 700 | 13px | 0.15em | uppercase | — |
| Botón submit formulario (`fk-btn-submit`) | Barlow Condensed | 700 | 15px | 0.18em | uppercase | `#fff` |
| Kicker de encabezado (`fk-head-kicker`) | JetBrains Mono | — | 10px | 0.28em | uppercase | `#64748b` |
| Label de formulario (`fk-label`) | JetBrains Mono | — | 9.5px | 0.15em | uppercase | `#64748b` |
| Label admin (`labelStyle`) | JetBrains Mono | — | 10px | 0.15em | uppercase | `#64748b` |
| Título de sección (`fk-section-title`) | JetBrains Mono | 600 | 10px | 0.24em | uppercase | `#1f355a` |
| Subtítulo de página | JetBrains Mono | — | 10px | 0.15em | uppercase | `#64748b` |
| Input (`fk-input`) | JetBrains Mono | — | 12.5px | — | — | `#1e293b` |
| Input admin (`inputStyle`) | Inter | — | 13px | — | — | `#1e293b` |
| Cuerpo / descripciones (`card-o p`) | Inter | 400 | 13px | — | — | `#64748b`, lineHeight 1.5 |
| Botón paginación (`pg-btn`) | JetBrains Mono | 600 | 11.5px | — | — | `#475569` |

## 4 · Component Stylings

### PageHeader — encabezado de página (REGLA)

Componente `components/partials/PageHeader.tsx` (`PageHeader` + `PageHeaderLink`). **Prohibido reimplementar el patrón inline.**

Estructura: título + subtítulo a la izquierda; botones de acción a la derecha; contenedor con `flexWrap: wrap` **siempre** (no pasa por prop).

| Elemento | Estilo |
|---|---|
| Contenedor | `flex; justifyContent: space-between; alignItems: flex-end; marginBottom: 32; flexWrap: wrap; gap: 16` |
| Título `<h2>` | Barlow Condensed 800 32px `0.06em` uppercase `#0f172a`; acento en `accentColor` |
| Subtítulo `<p>` | JetBrains Mono 10px `0.15em` uppercase `#64748b` |
| Botón primario | Barlow Condensed 700 13px `0.15em` uppercase; padding 10px 24px; bg `#0f172a`; color `#fff`; sin borde |
| Botón secundario | Mismo texto; padding 10px 20px; bg `#f1f5f9`; color `#475569`; border 1px `#e2e8f0` |

**Reglas:**
- Navegación del header usa `PageHeaderLink` (variants `primary`/`secondary`).
- **Regla de regreso**: toda vista destino (llegada por clic en card o redirect) lleva en `actions` un botón `variant="secondary"` (`← Panel`) apuntando a la vista anterior. Este botón **reemplaza** el `backHref`/`backLabel` del `DashboardHeader` (nunca ambos). Solo se agrega botón `primary` si hay acción especial (ej. `+ Registrar Oficial`); si no hay, no se agrega.
- Los botones submit/cancelar de formularios NO son `PageHeaderLink` (usan `btnPrimario`/`btnSecundario` de `app/admin/admin-styles.ts`).
- `actions` acepta cualquier nodo. `title` sin espacio final.
- Referencia conforme: `app/dashboard/catalogos/oficiales/page.tsx`.

### SegmentPage — segmentos/tabs de estado (REGLA)

Componente `components/partials/SegmentPage.tsx`. Estilo **tablón de despacho**: cada segmento es botón con borde que en activo se rellena con su `accent` semántico. **Prohibido reimplementar inline.**

| Elemento | Estilo |
|---|---|
| Contenedor | `flex; flexWrap: wrap; gap: 0; marginBottom: 24` |
| Botón | Barlow Condensed 700 14px `0.06em` uppercase; padding 10px 24px; border 1px `#e2e8f0`; borderBottom 2px accent cuando activo |
| Botón activo | `background: accent; color: #fff` |
| Botón inactivo | `background: #fff; color: #64748b` |
| Icono | size 13, opcional, `gap: 8` con el texto |
| Badge conteo | Inter 700 10px; padding 0 7px; radius 8; lineHeight 18px; activo `rgba(255,255,255,.2)`/`#fff`; inactivo `#f1f5f9`/`#64748b` |

Reglas: `onChange(key)` para estado local, `href` por tab para navegación server-safe. `accent` de cada tab es su color semántico (default `#1f355a`). `count` opcional (si se omite no hay badge). `activeKey` marca el activo; el primer tab no es especial (no hay track gris, a diferencia del `SegmentControl` de `/oficial`). Referencias: `TablonDespacho.tsx` (origen), `Bitacora911.tsx`.

### StepIndicator — indicador de pasos (REGLA)

Componente `components/partials/StepIndicator.tsx`. **Prohibido reimplementar inline y prohibido usar steppers** (círculos numerados con conectores, dots con etiquetas, barras segmentadas). Referencia: `FormularioRecorrido.tsx`.

| Elemento | Estilo |
|---|---|
| "Paso N de M" | Barlow Condensed 800 28px `0.04em` uppercase `#1f355a` |
| Nombre del paso | JetBrains Mono 600 11px `0.18em` uppercase `#94a3b8` |
| Contenedor fila | `flex; alignItems: baseline; gap: 12; flexWrap: wrap` |
| Barra de progreso | height 2px, radius 1, track `#e2e8f0`, fill `#1f355a`, width `(paso/total)*100%`, transition width .25s |
| Contenedor | `marginBottom: 32` |

`paso` es 1-based. Sin hooks (SSR-safe).

### Cards hub — `.card-o` (patrón)

Tarjetas de navegación por rol/hub (referencia: `app/oficial/page.tsx`, `app/dashboard/fiscalia`). **Esquinas animadas** cf-top/cf-left al hover, ícono que escala, badge mono con punto, título Barlow 28.

| Elemento | Estilo |
|---|---|
| `.card-o` | bg `#fff`; border 1px `#e2e8f0`; padding 32px; `min-height: 280px`; `max-width: 520px`; `flexDirection: column`; shadow `0 4px 6px -1px rgba(0,0,0,0.05)`; `position: relative; overflow: hidden` |
| `.card-o:hover` | border-color `#1f355a`; `translateY(-5px)`; shadow `0 20px 40px -12px rgba(31,53,90,0.15)` |
| `.co-top` / `.co-left` | esquinas: barra top (height 2, width 32→100%) y barra left (width 2, height 32→100%), color `#1f355a`, transition width/height 0.4s ease |
| `.co-icon` | color `#64748b`; hover color `#1f355a` y `scale(1.1)` |
| Badge mono | JetBrains Mono 9px `0.1em` uppercase `#94a3b8`, con punto 6px radius 50% `#1f355a` |
| Título `h3` | Barlow Condensed 800 28px uppercase `#0f172a`, margin `0 0 8px 0` |
| Descripción `p` | Inter 13px `#64748b` lineHeight 1.5 |

### Formularios — FormKit (`.fk-*`)

Clases en `app/globals.css`. **Fuente única para formularios institucionales.**

| Elemento | Estilo |
|---|---|
| `.fk-form` | `flex; flexDirection: column; gap: 32px` |
| `.fk-section` | bg `#fff`; border 1px `#e2e8f0`; radius 4; shadow `0 1px 2px rgba(15,23,42,0.04)` |
| `.fk-section-head` | `flex; alignItems: center; gap: 12; padding: 14px 22px; borderBottom 1px #eef2f7; background: linear-gradient(180deg,#f8fafc,#f1f5f9)` |
| `.fk-section-bar` | barra 3px × 16px radius 2 `#1f355a` |
| `.fk-section-title` | JetBrains Mono 10px `0.24em` uppercase `#1f355a` 600 |
| `.fk-grid` | `grid; repeat(2, minmax(0,1fr)); gap: 20px 22px; padding: 24px 22px` → 1fr ≤720px |
| `.fk-field` | `flex; flexDirection: column; gap: 7px; minWidth: 0` |
| `.fk-label` | JetBrains Mono 9.5px `0.15em` uppercase `#64748b`; requerido `.req` en `#b45309` |
| `.fk-input` | padding 11px 13px; bg `#f8fafc`; border 1px `#e2e8f0`; radius 3; JetBrains Mono 12.5px `#1e293b`; focus border `#1f355a`, bg `#fff`, shadow `0 0 0 3px rgba(31,53,90,0.12)` |
| `.fk-btn-submit` | Barlow Condensed 700 15px `0.18em` uppercase; padding 14px 26px; `linear-gradient(180deg,#274268,#1f355a)`; border 1px `#1f355a`; radius 3; color `#fff`; shadow `0 3px 10px rgba(31,53,90,0.28)`; hover `filter: brightness(1.1)` |
| `.fk-btn-cancel` | JetBrains Mono 10px `0.14em` uppercase; padding 13px 22px; bg `#fff`; color `#64748b`; border 1px `#e2e8f0`; radius 3 |

### Botones admin (`app/admin/admin-styles.ts`)

- `btnPrimario`: Barlow Condensed 700 13px `0.15em` uppercase; padding 10px 24px; bg `#0f172a`; color `#fff`; sin borde.
- `btnSecundario`: Barlow Condensed 700 13px `0.15em` uppercase; padding 10px 20px; bg `#f1f5f9`; color `#475569`; border 1px `#e2e8f0`.
- `inputStyle`/`selectStyle`: padding 10px 14px; bg `#fff`; border 1px `#e2e8f0`; Inter 13px `#1e293b`.
- `labelStyle`: JetBrains Mono 10px `0.15em` uppercase `#64748b`.

### Tarjetas sección (admin `cardStyle`)

`border: 1px solid #e2e8f0; background: #fff; overflow: hidden; borderRadius: 2`.

### Paginación (`.pg-*`)

`pg-btn`: JetBrains Mono 600 11.5px; min-width 32, height 32; radius 6; bg `#fff`; border `#e2e8f0`; color `#475569`. Activo: `linear-gradient(180deg,#274268,#1f355a)`, border `#1f355a`, color `#fff`, shadow `0 3px 10px rgba(31,53,90,0.3)`, animación `pg-pop` scale 0.78→1. Hover: border `#1f355a`, color `#1f355a`, bg `rgba(31,53,90,0.05)`. Disabled: opacity 0.35.

## 5 · Layout Principles

### Page Assembly Pattern (REGLA)

Toda página se arma por secciones, **sin tamaños fijos**:

1. **Contenedor de página**: `display: flex; flexDirection: column; width: 100%; minHeight: 100vh`
2. **Sección `<header>`**: `width: 100%`, flex column — navegación + título
3. **Sección `<main>`**: `flex: 1; width: 100%`, flex column — contenido
4. **Interior**: subdividir con flex (`flex: 1`, `gap`) para layout dinámico
5. **Prohibido**: `maxWidth`/anchos o altos fijos en contenedores de página; solo paddings internos
6. **Prohibido**: anidar componentes que rendericen su propio layout completo (minHeight 100vh + `<style>`) dentro de otra vista

### Paddings de página (responsive)

| Nivel | `.pad-pagina` | `.pad-dashboard` |
|---|---|---|
| Desktop >1200px | 40px 48px | 40px 64px |
| Tablet 721–1200px | 32px 32px | 32px 48px |
| Móvil ≤720px | 20px 16px | 20px 16px |

### Panel lateral sticky

`.panel-lateral`: `position: sticky; top: 144px; max-height: calc(100vh - 168px); overflow-y: auto`. Tablet `top: 128px`. Móvil: `position: static; max-height: none`.

### Grids de formularios

`.grid-2` / `.grid-3`: `repeat(2|3, minmax(0,1fr)); gap: 16px` → 1fr ≤720px. `.cat-cards-grid`: `repeat(2, minmax(0,1fr)); gap: 20px` → 1fr ≤720px. **Prohibido `gridTemplateColumns` inline** — usar estas clases.

### Tablas

Toda tabla con varias columnas se envuelve en `.tabla-wrap` (`overflow-x: auto`) para scroll horizontal en móvil. Nunca `overflow: hidden` en el contenedor. `minWidth` a la `<table>` para que el scroll sea horizontal, no compresión.

## 6 · Depth & Elevation

Sombras de `globals.css` `@theme`:

| Token | Valor | Uso |
|---|---|---|
| `--shadow-card` | `0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)` | Tarjetas base |
| `--shadow-elevated` | `0 4px 12px rgba(0,0,0,0.07), 0 1px 3px rgba(0,0,0,0.04)` | Elementos elevados |
| `--shadow-modal` | `0 20px 60px rgba(0,0,0,0.15), 0 8px 20px rgba(0,0,0,0.08)` | Modales |
| `--shadow-hover` | `0 6px 20px rgba(31,53,90,0.15), 0 2px 6px rgba(0,0,0,0.05)` | Hover de tarjetas |

Radios: `--radius-sm: 6px`, `md: 8px`, `lg: 12px`, `xl: 16px`, `full: 9999px`. Componentes FormKit usan radios de 3–4px.

## 7 · Do's and Don'ts

**Do:**
- Usar `PageHeader`, `SegmentPage`, `StepIndicator` de `components/partials/` — **nunca** reimplementar el patrón inline.
- Labels y metadatos en JetBrains Mono uppercase con letter-spacing; títulos en Barlow Condensed 800 uppercase.
- Badges de estado con la pareja `bg`+color semántico (success/warning/danger).
- Acento por módulo (fiscalía `#7c3aed`, catálogos `#c0223a`, default `#1f355a`).
- `grid-2`/`grid-3`/`.fk-grid` para formularios; `.tabla-wrap` para tablas; `.pad-pagina`/`.pad-dashboard` para contenedores.
- Estados de incidente vía `labelEstatus()` de `lib/911/estatus-c4.ts` (vocabulario C4: Nuevo / En Ruta / En Sitio / Cerrado / Cerrado · Detención). Ver `boveda/🛠 Stack/Convenciones.md`.

**Don'ts:**
- No steppers (círculos numerados, dots con etiquetas, barras segmentadas) — usar `StepIndicator`.
- No `maxWidth`/altos fijos en contenedores de página.
- No `gridTemplateColumns: '1fr 1fr'` inline — usar `.grid-2`.
- No `overflow: hidden` en contenedores de tablas.
- No anidar layouts completos (minHeight 100vh + `<style>`) dentro de otra vista.
- No modales sin `maxWidth: 90vw/100%` + `maxHeight: 90vh` + `overflow: auto`.
- No inventar colores nuevos fuera de la paleta de §2.
- No hardcodear etiquetas de estado en la UI.

## 8 · Responsive Behavior

Breakpoints: **móvil ≤720px · tablet 721–1200px · desktop >1200px** (alineados con `.fk-grid` y `.dashboard-grid`).

- **Componentes cliente**: `useResponsive()` de `hooks/useResponsive.ts` → `{ esMovil, esTablet, esDesktop }` (SSR-safe). `useMediaQuery(query)` para casos puntuales.
- **Componentes servidor**: sin hooks → usar clases CSS (§5).
- Grids de formularios 2/3 → 1 col en móvil. Tablas → scroll horizontal. Headers hacen wrap. Modales 90vw/90vh con scroll.

## 9 · Agent Prompt Guide

Cuando generes o modifiques UI en este proyecto:

1. **Lee este archivo completo** antes de escribir cualquier estilo.
2. Usa **Barlow Condensed 800** para títulos, **JetBrains Mono** para labels/meta (uppercase, letter-spacing 0.14–0.28em), **Inter** para cuerpo.
3. Extrae colores **solo** de §2. Para una vista del módulo fiscalía usa `#7c3aed`; catálogos/patrullas `#c0223a`; el resto `#1f355a`.
4. Reutiliza `PageHeader`, `SegmentPage`, `StepIndicator` y las clases `.fk-*`, `.grid-*`, `.pad-*`, `.tabla-wrap` — **nunca** recrees esos patrones.
5. Respeta el Page Assembly Pattern: página = contenedor flex column (sin tamaños fijos) + header + main.
6. Hazlo responsive en los 3 niveles (720/1200) y verifica tablas/formularios en móvil.
7. Revisa los Don'ts de §7 antes de dar por terminada la vista.
8. Si el código existente contradice este documento, corrige el código (no el documento).
