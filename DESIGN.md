# DESIGN.md — SSPM · CENTINELA

Sistema de Gestión de Seguridad Pública (SSPM) San Juan del Río. **Fuente de verdad visual del proyecto.**

Los agentes de codificación leen este archivo para generar UI consistente. **No hay otra fuente**: los tokens, componentes y reglas de diseño de este proyecto viven aquí. Si el código difiere, este documento manda y el código se corrige.

Formato según especificación [Google Stitch DESIGN.md](https://stitch.withgoogle.com/docs/design-md/specification/).

**Decisión de dirección visual (vigente):** el sistema adopta un lenguaje **Apple-style** — calmado, premium, tipografía de sistema, materialidad "glass", motion sutil — como el lenguaje **oficial y único** del proyecto, reemplazando el lenguaje anterior "tablón de despacho / táctico" (Barlow Condensed mayúsculas, JetBrains Mono, esquinas animadas, scan-lines). Aplica a **todo el sistema, sin excepción** — 911/despacho, Fiscalía, Juzgado, Flota, formularios, tablas, catálogos, admin, PWA — no solo a login/hub. Ver §10 para qué parte del código ya está migrada y qué falta.

---

## 1 · Visual Theme & Atmosphere

Sistema Apple-style: **calmado, premium, alta legibilidad**, con tipografía de sistema, jerarquía por peso y tamaño (no por mayúsculas), materialidad "glass" en superficies flotantes, y un acento único por vista/módulo.

- **Calmado y premium**: superficies claras (`#F1F5F9` fondo, `#FFFFFF` tarjetas), bordes finos, sombras suaves tintadas de `primary` (nunca negro puro). Nada de gradientes decorativos salvo un uso muy restrained en botones primarios.
- **Tipografía de sistema**: `-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', system-ui, sans-serif` para todo — títulos, labels, cuerpo. **Sentence-case siempre** (nunca mayúsculas agresivas ni letter-spacing extremo). La jerarquía se construye con peso (500–700) y tamaño, no con `text-transform: uppercase`.
- **Un acento por vista**: cada módulo tiene su color de identidad (ver §2 "Acentos por módulo") — igual que Apple usa un acento distinto por app (Recordatorios rojo, Notas amarillo, Calendario rojo) dentro de un mismo sistema visual. Dentro de una misma vista, **un solo acento**, nunca se mezclan dos.
- **Materialidad ("glass")**: paneles flotantes, tarjetas de navegación y headers usan `backdrop-filter: blur()` + bordes translúcidos + sombra tintada — ver §6. **Excepción deliberada**: tablas densas y formularios multi-sección usan superficies planas (sin blur) por legibilidad y rendimiento — ver §5.
- **Movimiento sutil y con propósito**: fade + `translateY` de entrada, hover con elevación (`translateY(-2px)` + sombra). Cada animación debe justificarse (jerarquía, feedback, transición de estado) — nunca "porque se ve bien". Prohibido: parpadeos infinitos, scan-lines, esquinas animadas tipo bracket, shutters, `clip-path` de "escaneo de datos". Ver §6 y §9.
- **Radios de esquina consistentes**: escala fija por tipo de elemento (pills, cards, botones/inputs) — ver §6, "Shape Consistency Lock".
- **Modo claro únicamente por ahora.** Dark mode no está implementado — no inventarlo sin pedido explícito del usuario.

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
| `success` | `#22C55E` (usar `#16a34a` en texto sobre fondo claro para contraste AA) | Estado OK |
| `success-bg` | `#DCFCE7` | Fondo badge éxito |
| `warning` | `#F59E0B` | Estado pendiente/atención |
| `warning-bg` | `#FEF3C7` | Fondo badge warning |
| `danger` | `#EF4444` | Estado error/peligro/detención |
| `danger-bg` | `#FEE2E2` | Fondo badge danger |

### Tokens "glass" (materialidad, `@theme inline` en `app/globals.css`)

| Token | Valor | Uso |
|---|---|---|
| `--apple-font-display` | `-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', system-ui, sans-serif` | Tipografía única del sistema (ver §3) |
| `--apple-glass-bg` | `rgba(255,255,255,0.72)` | Fondo de paneles/cards flotantes |
| `--apple-glass-border` | `rgba(255,255,255,0.6)` | Borde de paneles/cards flotantes |
| `--apple-shadow-glass` | `0 8px 30px rgba(31,53,90,0.10), 0 1px 2px rgba(31,53,90,0.06)` | Sombra base de superficies glass |
| `--apple-shadow-glass-hover` | `0 16px 40px rgba(31,53,90,0.14), 0 2px 6px rgba(31,53,90,0.08)` | Sombra en hover |

No son colores nuevos — son variantes alfa de `primary`/blanco. **No inventar colores nuevos fuera de esta sección.**

### Acentos por módulo (semántica de dominio — "un acento por vista")

| Módulo | Acento | Uso |
|---|---|---|
| Default / Panel | `#1f355a` | Cualquier vista sin acento propio |
| Catálogos / Patrullas | `#c0223a` | `PageHeader` y acentos de `app/dashboard/catalogos` |
| Fiscalía | `#7c3aed` | Vista `/fiscalia` (cards hub, forms, detalles) |

Regla: dentro de una misma vista se usa **un solo acento** de esta tabla — nunca se mezclan dos módulos en la misma pantalla. El acento tiñe: foco de inputs, botón primario, badges activos, bordes de hover, barra de progreso. Todo lo demás (tipografía, radios, materialidad, motion) es idéntico entre módulos — eso es lo que mantiene la "familia visual" única aunque cada módulo tenga su color.

### Roles de badge

Los badges de estado usan la pareja `bg` + color fuerte: `success-bg`/`success`, `warning-bg`/`warning`, `danger-bg`/`danger`. El **accent semántico** de un tab/segmento activo es el color fuerte; el inactivo queda blanco con texto `#64748b`.

## 3 · Typography Rules

**Una sola familia, `var(--apple-font-display)`, para todo** (títulos, labels, cuerpo, botones). Se acabó la distinción de tres fuentes (Barlow Condensed / JetBrains Mono / Inter) — la jerarquía se construye con peso y tamaño, nunca con mayúsculas ni letter-spacing extremo. `Inter` puede seguir apareciendo como fallback del stack, no como familia separada para "cuerpo".

| Rol | Peso | Tamaño | Transform | Color |
|---|---|---|---|---|
| Título de página (`PageHeader h2`) | 600 | `clamp(22px, 5vw, 32px)` | none (sentence-case) | `#0f172a` (acento en `accentColor` si aplica) |
| Título de paso (`StepIndicator`) | 600 | `clamp(20px, 5vw, 28px)` | none | `#0f172a` o acento del módulo |
| Título de card hub (`.card-o h3`) | 600 | 26–28px | none | `#0f172a` |
| Título de sección (`fk-head-title` / `fk-section-title`) | 600 | 16–18px | none | `#0f172a` |
| Botón primario/secundario | 600 | 14–15px | none | — |
| Kicker / subtítulo de encabezado | 500 | 12–13px | none | `#64748b` |
| Label de formulario (`fk-label`) | 500 | 12px | none | `#64748b`; requerido `.req` en `#b45309` |
| Input (`fk-input`, `inputStyle`) | 400 | 14px | — | `#1e293b` |
| Cuerpo / descripciones | 400 | 13–14px | — | `#64748b`, lineHeight 1.5 |
| Botón paginación (`pg-btn`) | 600 | 12px | — | `#475569` |

**Prohibido**: `text-transform: uppercase` como recurso de jerarquía, `letter-spacing` mayor a `0.02em`, mezclar familias tipográficas dentro de la misma vista. Para enfatizar una palabra dentro de un título, usar peso/color de la misma familia — nunca cambiar de fuente a mitad de frase.

## 4 · Component Stylings

### PageHeader — encabezado de página (REGLA)

Componente `components/partials/PageHeader.tsx` (`PageHeader` + `PageHeaderLink`). **Prohibido reimplementar el patrón inline.**

Estructura: título + subtítulo a la izquierda; botones de acción a la derecha; contenedor con `flexWrap: wrap` **siempre** (no pasa por prop).

| Elemento | Estilo |
|---|---|
| Contenedor | `flex; justifyContent: space-between; alignItems: flex-end; marginBottom: 32; flexWrap: wrap; gap: 16` |
| Título `<h2>` | `var(--apple-font-display)` 600 `clamp(22px, 5vw, 32px)` sentence-case `#0f172a`; acento en `accentColor` |
| Subtítulo `<p>` | `var(--apple-font-display)` 500 13px `#64748b`; `wordBreak: break-word` |
| Botón primario | `var(--apple-font-display)` 600 14px sentence-case; padding 10px 20px; bg `#0f172a` (o acento del módulo); color `#fff`; radius `var(--radius-lg)`; sin borde |
| Botón secundario | Mismo texto; padding 10px 18px; bg `#f1f5f9`; color `#475569`; border 1px `#e2e8f0`; radius `var(--radius-lg)` |

**Reglas (sin cambios de comportamiento):**
- Navegación del header usa `PageHeaderLink` (variants `primary`/`secondary`).
- **Regla de regreso**: toda vista destino (llegada por clic en card o redirect) lleva en `actions` un botón `variant="secondary"` (`← Panel`) apuntando a la vista anterior. Este botón **reemplaza** el `backHref`/`backLabel` del `DashboardHeader` (nunca ambos). Solo se agrega botón `primary` si hay acción especial (ej. `+ Registrar Oficial`); si no hay, no se agrega.
- Los botones submit/cancelar de formularios NO son `PageHeaderLink` (usan `btnPrimario`/`btnSecundario` de `app/admin/admin-styles.ts`).
- `actions` acepta cualquier nodo. `title` sin espacio final.

### SegmentPage — segmentos/tabs de estado (REGLA)

Componente `components/partials/SegmentPage.tsx`. **Prohibido reimplementar inline.**

| Elemento | Estilo |
|---|---|
| Contenedor | `flex; flexWrap: nowrap; overflowX: auto; gap: 6; marginBottom: 24`, clase `.scrollbar-hide` |
| Botón (pill) | `var(--apple-font-display)` 600 14px sentence-case; padding `9px clamp(14px, 4vw, 20px)`; `whiteSpace: nowrap; flexShrink: 0`; radius `var(--radius-full)`; sin borde |
| Botón activo | `background: accent; color: #fff` |
| Botón inactivo | `background: #f1f5f9; color: #64748b` |
| Icono | size 14, opcional, `gap: 8` con el texto |
| Badge conteo | 600 11px; padding 0 7px; radius `var(--radius-full)`; lineHeight 18px; activo `rgba(255,255,255,.22)`/`#fff`; inactivo `#e2e8f0`/`#64748b` |

Reglas de comportamiento (sin cambios): `onChange(key)` para estado local, `href` por tab para navegación server-safe. `accent` de cada tab es su color semántico (default `#1f355a`). `count` opcional. El contenedor **no hace wrap** — tira horizontal con scroll oculto (`.scrollbar-hide`) para que en móvil los tabs se deslicen. La única diferencia con la especificación anterior es visual: pasa de "tab con borde inferior" a "pill" — el patrón de interacción (click, estado activo, scroll horizontal) no cambia.

### StepIndicator — indicador de pasos (REGLA)

Componente `components/partials/StepIndicator.tsx`. **Prohibido reimplementar inline y prohibido usar steppers** (círculos numerados con conectores, dots con etiquetas, barras segmentadas). Referencia: `FormularioRecorrido.tsx`.

| Elemento | Estilo |
|---|---|
| "Paso N de M" | `var(--apple-font-display)` 600 `clamp(20px, 5vw, 28px)` sentence-case `#0f172a` (o acento del módulo) |
| Nombre del paso | `var(--apple-font-display)` 500 13px `#64748b` |
| Contenedor fila | `flex; alignItems: baseline; gap: 12; flexWrap: wrap` |
| Barra de progreso | height 3px, radius `var(--radius-full)`, track `#e2e8f0`, fill accent, width `(paso/total)*100%`, transition width .25s |
| Contenedor | `marginBottom: clamp(20px, 5vw, 32px)` |

`paso` es 1-based. Sin hooks (SSR-safe). El tamaño de fuente y el margen usan `clamp()` (no media queries) porque el componente no tiene hooks.

### Header general — DashboardHeader / SubHeader (REGLA)

Componentes `components/partials/Header.tsx` (`DashboardHeader`, usado en ~100 páginas) y `components/partials/SubHeader.tsx`. **Prohibido reimplementar el chrome superior inline.**

`DashboardHeader` tiene un prop `variant?: 'tactico' | 'apple'`. **El target de diseño es `'apple'` en todas las páginas** — hoy el default sigue siendo `'tactico'` por compatibilidad mientras se migra el resto del sistema (ver §10). No agregar páginas nuevas con `variant="tactico"`.

| Elemento | Móvil ≤720px | Tablet 721–1200px | Desktop >1200px |
|---|---|---|---|
| Altura `DashboardHeader` | 56px | 72px | 104px |
| Altura `SubHeader` | 48px | 56px | 64px |
| Logo | 26px | 44px | 64px |
| Título "Centinela" (variant apple) | `var(--apple-font-display)` 600 20px | 600 32px | 600 44px, sentence-case |
| `CambiarSesionDev` (dev) | oculto | oculto | visible |
| Navegación por `children` | oculta | oculta | visible |
| `SignOutButton` | solo ícono `LogOut` 40×40 | solo ícono `LogOut` 40×40 | texto "Cerrar sesión →" |

**Reglas (sin cambios de comportamiento):**
- Ambos headers son `position: sticky; top: 0` y llevan `paddingTop: env(safe-area-inset-top)` — obligatorio por el `viewportFit: 'cover'` del manifest.
- Los botones de acción del lado derecho usan un tamaño uniforme de **40×40px** — mínimo recomendado de target táctil en PWA.
- `CampanillaNotificaciones` se auto-abastece y siempre se renderiza.
- En `variant="apple"`: fondo `var(--apple-glass-bg)`, `backdrop-filter: blur(20px) saturate(180%)`, sin el kicker "Sistema Táctico" ni el corner decorator — ver `components/partials/Header.tsx`.

### Cards hub — `.card-o` (patrón)

Tarjetas de navegación por rol/hub (referencia: `app/oficial/page.tsx`, `app/dashboard/fiscalia`, `app/dashboard/module-cards.tsx`).

| Elemento | Estilo |
|---|---|
| `.card-o` | bg `var(--apple-glass-bg)`; `backdrop-filter: blur(20px) saturate(180%)`; border 1px `var(--apple-glass-border)`; padding 24-32px; `min-height: 160-280px`; radius `var(--radius-xl)`; shadow `var(--apple-shadow-glass)`; `position: relative; overflow: hidden` |
| `.card-o:hover` | border-color acento (25% alpha); `translateY(-2px)`; shadow `var(--apple-shadow-glass-hover)` |
| Ícono | color `#64748b` (o acento si `active`); hover color acento y `scale(1.1)` |
| Badge de estado | `var(--apple-font-display)` 500 12px, con punto de estado si es semántico real (no decorativo) |
| Título `h3` | `var(--apple-font-display)` 600 26-28px sentence-case `#0f172a` |
| Descripción `p` | `var(--apple-font-display)` 400 13px `#64748b` lineHeight 1.5 |

Ya no hay esquinas animadas tipo bracket (`.co-top`/`.co-left`) — el feedback de hover es elevación + sombra + borde, es suficiente. Referencia de implementación completa: `app/dashboard/module-cards.tsx`.

### Formularios — FormKit (`.fk-*`)

Clases en `app/globals.css`. **Fuente única para formularios institucionales.** Los formularios son superficies **planas** (sin `backdrop-filter`) — priorizan legibilidad sobre materialidad, sobre todo en formularios multi-sección largos.

| Elemento | Estilo |
|---|---|
| `.fk-form` | `flex; flexDirection: column; gap: 32px` |
| `.fk-section` | bg `#fff`; border 1px `#e2e8f0`; radius `var(--radius-lg)`; shadow `var(--shadow-card)` |
| `.fk-section-head` | `flex; alignItems: center; gap: 12; padding: 14px 22px; borderBottom 1px #eef2f7; background: linear-gradient(180deg,#f8fafc,#f1f5f9)` |
| `.fk-section-bar` | barra 3px × 16px radius `var(--radius-full)` color acento |
| `.fk-section-title` | `var(--apple-font-display)` 600 16px sentence-case acento |
| `.fk-grid` | `grid; repeat(2, minmax(0,1fr)); gap: 20px 22px; padding: 24px 22px` → 1fr ≤720px |
| `.fk-field` | `flex; flexDirection: column; gap: 7px; minWidth: 0` |
| `.fk-label` | `var(--apple-font-display)` 500 12px `#64748b`; requerido `.req` en `#b45309` |
| `.fk-input` | padding 11px 13px; bg `#f8fafc`; border 1px `#e2e8f0`; radius `var(--radius-lg)`; `var(--apple-font-display)` 14px `#1e293b`; focus border acento, bg `#fff`, shadow `0 0 0 3px rgba(accent,0.12)` |
| `.fk-btn-submit` | `var(--apple-font-display)` 600 15px sentence-case; padding 14px 26px; bg acento (gradiente sutil 180deg permitido); radius `var(--radius-lg)`; color `#fff`; shadow `0 3px 10px rgba(accent,0.28)` |
| `.fk-btn-cancel` | `var(--apple-font-display)` 500 13px sentence-case; padding 13px 22px; bg `#fff`; color `#64748b`; border 1px `#e2e8f0`; radius `var(--radius-lg)` |

### Botones admin (`app/admin/admin-styles.ts`)

- `btnPrimario`: `var(--apple-font-display)` 600 14px sentence-case; padding 10px 20px; bg `#0f172a`; color `#fff`; radius `var(--radius-lg)`; sin borde.
- `btnSecundario`: mismo, bg `#f1f5f9`; color `#475569`; border 1px `#e2e8f0`; radius `var(--radius-lg)`.
- `inputStyle`/`selectStyle`: padding 10px 14px; bg `#fff`; border 1px `#e2e8f0`; radius `var(--radius-lg)`; `var(--apple-font-display)` 14px `#1e293b`.
- `labelStyle`: `var(--apple-font-display)` 500 12px `#64748b`.

### Tarjetas sección (admin `cardStyle`)

`border: 1px solid #e2e8f0; background: #fff; overflow: hidden; borderRadius: var(--radius-lg)`.

### Tablas — superficie plana (regla de materialidad)

Tablas densas (expedientes, catálogos, listados) **no** usan `backdrop-filter` ni radios grandes en cada fila — el volumen de contenido hace que el "glass" sea ruido visual y costoso en rendimiento. Header de tabla: `var(--apple-font-display)` 600 12px `#64748b`, sentence-case. Filas: `var(--apple-font-display)` 400 13-14px, hover `bg #f8fafc`. El contenedor de la tabla (`.tabla-wrap`) puede llevar radius `var(--radius-lg)` + `border: 1px solid #e2e8f0` + `shadow: var(--shadow-card)` — eso sí es coherente con el resto del sistema sin comprometer legibilidad.

### Paginación (`.pg-*`)

`pg-btn`: `var(--apple-font-display)` 600 12px; min-width 32, height 32; radius `var(--radius-md)`; bg `#fff`; border `#e2e8f0`; color `#475569`. Activo: bg acento, color `#fff`, shadow `0 3px 10px rgba(accent,0.3)`. Hover: border acento, color acento, bg `rgba(accent,0.05)`. Disabled: opacity 0.35.

## 5 · Layout Principles

### Page Assembly Pattern (REGLA — sin cambios, es estructural no estético)

Toda página se arma por secciones, **sin tamaños fijos**:

1. **Contenedor de página**: `display: flex; flexDirection: column; width: 100%; minHeight: 100vh`
2. **Sección `<header>`**: `width: 100%`, flex column — navegación + título
3. **Sección `<main>`**: `flex: 1; width: 100%`, flex column — contenido
4. **Interior**: subdividir con flex (`flex: 1`, `gap`) para layout dinámico
5. **Prohibido**: `maxWidth`/anchos o altos fijos en contenedores de página; solo paddings internos
6. **Prohibido**: anidar componentes que rendericen su propio layout completo (minHeight 100vh + `<style>`) dentro de otra vista
7. **Contenido alineado al header (REGLA)**: tablas, formularios y steppers ocupan el mismo ancho que el `PageHeader` y la sección.

### Paddings de página (responsive — sin cambios)

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

Toda tabla con varias columnas se envuelve en `.tabla-wrap` (`overflow-x: auto`) para scroll horizontal en móvil. Nunca `overflow: hidden` en el contenedor. `minWidth` a la `<table>` para que el scroll sea horizontal, no compresión. Ver §4 "Tablas — superficie plana".

## 6 · Depth & Elevation

### Superficies: glass vs. planas

| Superficie | Tratamiento |
|---|---|
| Headers, cards de navegación hub, paneles laterales flotantes, modales | **Glass**: `background: var(--apple-glass-bg)`, `backdrop-filter: blur(20px) saturate(180%)`, `border: 1px solid var(--apple-glass-border)`, `box-shadow: var(--apple-shadow-glass)` |
| Tablas densas, secciones de formulario multi-paso, listas largas | **Plana**: `background: #fff`, sin blur, `box-shadow: var(--shadow-card)` |

Fallback obligatorio para `prefers-reduced-transparency: reduce` en cualquier superficie glass: reemplazar por fondo sólido `#ffffff` sin `backdrop-filter`.

### Tokens de sombra

| Token | Valor | Uso |
|---|---|---|
| `--shadow-card` | `0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)` | Tarjetas/superficies planas |
| `--shadow-elevated` | `0 4px 12px rgba(0,0,0,0.07), 0 1px 3px rgba(0,0,0,0.04)` | Elementos elevados |
| `--shadow-modal` | `0 20px 60px rgba(0,0,0,0.15), 0 8px 20px rgba(0,0,0,0.08)` | Modales |
| `--apple-shadow-glass` | ver §2 | Superficies glass, estado base |
| `--apple-shadow-glass-hover` | ver §2 | Superficies glass, hover |

Nunca sombra negra pura (`rgba(0,0,0,X)` sin tintar) en superficies glass — siempre tintada de `primary` (`rgba(31,53,90,X)`).

### Shape Consistency Lock — escala de radios (REGLA, una sola por tipo de elemento)

| Radio | Valor | Uso |
|---|---|---|
| `--radius-full` | `9999px` | Pills, badges, tabs de `SegmentPage`, avatares |
| `--radius-xl` | `16px` | Cards, paneles glass, modales |
| `--radius-lg` | `12px` | Botones, inputs, secciones de formulario, tarjetas planas |
| `--radius-md` | `8px` | Chips pequeños, botones de paginación |
| `--radius-sm` | `6px` | Elementos muy pequeños puntuales |

**Prohibido** mezclar radios fuera de esta tabla o usar radios "sharp" (0-4px) — eso era del lenguaje táctico anterior y ya no aplica a ninguna vista nueva.

## 7 · Do's and Don'ts

**Do:**
- Usar `PageHeader`, `SegmentPage`, `StepIndicator` de `components/partials/` — **nunca** reimplementar el patrón inline.
- Tipografía única `var(--apple-font-display)`, sentence-case, jerarquía por peso/tamaño.
- Un acento por vista (ver §2) — nunca mezclar dos módulos en la misma pantalla.
- Radios de la tabla de §6 — nunca "sharp" ni valores fuera de esa escala.
- Superficies glass en headers/cards/paneles flotantes; superficies planas en tablas/formularios densos (§6).
- Badges de estado con la pareja `bg`+color semántico (success/warning/danger).
- `grid-2`/`grid-3`/`.fk-grid` para formularios; `.tabla-wrap` para tablas; `.pad-pagina`/`.pad-dashboard` para contenedores.
- Iconos de `lucide-react`, stroke-width 1.5-2 — nunca SVG dibujado a mano en código nuevo.
- Motion con propósito (jerarquía/feedback/transición de estado), `transform`/`opacity` únicamente, respetar `prefers-reduced-motion`.
- Estados de incidente vía `labelEstatus()` de `lib/911/estatus-c4.ts` (vocabulario C4: Nuevo / En Ruta / En Sitio / Cerrado / Cerrado · Detención).

**Don'ts:**
- No steppers custom (círculos numerados, dots con etiquetas, barras segmentadas) — usar `StepIndicator`.
- No `text-transform: uppercase` como recurso de jerarquía ni `letter-spacing` > `0.02em`.
- No mezclar `Barlow Condensed`/`JetBrains Mono` en código nuevo — son del lenguaje anterior, solo persisten en vistas aún no migradas (§10).
- No esquinas animadas tipo bracket, scan-lines, tactical shutters, `clip-path` de escaneo, parpadeos infinitos.
- No `maxWidth`/altos fijos en contenedores de página.
- No envolver el contenido (tablas/formularios/steppers) en contenedores con `maxWidth` menor que la sección.
- No `gridTemplateColumns: '1fr 1fr'` inline — usar `.grid-2`.
- No `overflow: hidden` en contenedores de tablas.
- No anidar layouts completos (minHeight 100vh + `<style>`) dentro de otra vista.
- No modales sin `maxWidth: 90vw/100%` + `maxHeight: 90vh` + `overflow: auto`.
- No inventar colores nuevos fuera de §2, ni radios fuera de §6.
- No hardcodear etiquetas de estado en la UI.
- No `backdrop-filter` en tablas densas ni listas largas (§6).

## 8 · Responsive Behavior

Breakpoints: **móvil ≤720px · tablet 721–1200px · desktop >1200px** (alineados con `.fk-grid` y `.dashboard-grid`).

- **Componentes cliente**: `useResponsive()` de `hooks/useResponsive.ts` → `{ esMovil, esTablet, esDesktop }` (SSR-safe). `useMediaQuery(query)` para casos puntuales.
- **Componentes servidor**: sin hooks → usar clases CSS (§5).
- Grids de formularios 2/3 → 1 col en móvil. Tablas → scroll horizontal. Headers hacen wrap. Modales 90vw/90vh con scroll.
- **Polish PWA** (`app/globals.css`): `body { overscroll-behavior-y: contain }` evita el rebote/pull-to-refresh del navegador en modo `standalone`; `button, a { -webkit-tap-highlight-color: transparent }` quita el flash gris nativo al tocar; `.scrollbar-hide` oculta la barra de scroll manteniendo el scroll funcional. Todo elemento `position: sticky/fixed` que pueda tocar el borde superior/inferior de la pantalla debe sumar `env(safe-area-inset-*)` a su padding.

## 9 · Agent Prompt Guide

Cuando generes o modifiques UI en este proyecto:

1. **Lee este archivo completo** antes de escribir cualquier estilo.
2. Usa **`var(--apple-font-display)`** para todo (títulos, labels, cuerpo, botones). Sentence-case siempre, jerarquía por peso/tamaño.
3. Extrae colores **solo** de §2. Un solo acento por vista: fiscalía `#7c3aed`, catálogos/patrullas `#c0223a`, el resto `#1f355a`.
4. Reutiliza `PageHeader`, `SegmentPage`, `StepIndicator` y las clases `.fk-*`, `.grid-*`, `.pad-*`, `.tabla-wrap` — **nunca** recrees esos patrones.
5. Radios de §6 (Shape Consistency Lock) y superficies glass vs. planas según §6.
6. Respeta el Page Assembly Pattern: página = contenedor flex column (sin tamaños fijos) + header + main.
7. Hazlo responsive en los 3 niveles (720/1200) y verifica tablas/formularios en móvil.
8. Motion con propósito, `transform`/`opacity` únicamente, `prefers-reduced-motion` respetado.
9. Revisa los Don'ts de §7 antes de dar por terminada la vista.
10. Si el código existente contradice este documento (incluido código en el lenguaje táctico anterior, §10), corrige el código hacia el lenguaje Apple-style — no repliques el patrón viejo en código nuevo.

## 10 · Estado de migración (código real vs. este documento)

Este documento especifica el lenguaje Apple-style como el **objetivo para todo el sistema**. La migración del código real es incremental — no todas las vistas reflejan esto todavía.

**Ya migrado (código real usa este lenguaje):**
- `app/(auth)/login/` (login completo)
- `app/dashboard/page.tsx`, `app/dashboard/module-cards.tsx`, `app/dashboard/sspm-general.tsx`, `app/dashboard/enable-2fa.tsx`
- `components/partials/Header.tsx` — vía `variant="apple"` (opt-in, ver más abajo)

**Pendiente de migrar** (sigue en el lenguaje táctico anterior — Barlow Condensed/JetBrains Mono, radios sharp, sin glass): 911/despacho, Fiscalía, Juzgado, Flota, Formato N, formularios UDAI, tablas de expedientes, catálogos, admin, PWA offline, y el resto de páginas que usan `DashboardHeader` sin `variant` (default sigue en `'tactico'`).

**Decisiones pendientes, explícitamente no resueltas todavía (no asumir, preguntar antes de tocar):**
- `components/PageTransition.tsx` — la transición "compuerta blindada táctica" entre rutas (montada globalmente en `app/layout.tsx`, se activa en cada navegación) es parte central del lenguaje anterior y afecta **toda la app**. No se ha decidido si se reemplaza por algo más calmado, se simplifica, o se retira. Cambiarla es una decisión de alto impacto (toca cada transición de página) — no modificar sin pedirlo explícitamente.
- El default de `variant` en `DashboardHeader` sigue en `'tactico'` — cambiarlo a `'apple'` afecta ~100 páginas de golpe. Migrar módulo por módulo, no voltear el default globalmente sin verificación visual previa.

**Cómo migrar una vista existente**: aplicar §1-9 de este documento (tipografía, color, radios, materialidad, motion) sin cambiar la lógica, los nombres de campos/rutas, ni el comportamiento funcional — mismo criterio que se siguió en Login + Hub (ver `plan-apple-pilot/` en la raíz del repo como referencia de cómo se ejecutó esa migración, etapa por etapa).
