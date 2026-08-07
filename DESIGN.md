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
- **Movimiento sutil y con propósito**: fade + `translateY` de entrada, hover con elevación (`translateY(-2px)` + sombra), y **feedback de presión** (`:active`, `scale(0.97)`, transición corta ~0.12s) en toda card/botón interactivo — el toque en móvil necesita respuesta inmediata, no solo el hover que ahí casi nunca dispara. Ver §6 "Micro-animaciones de acción". Cada animación debe justificarse (jerarquía, feedback, transición de estado) — nunca "porque se ve bien". Prohibido: parpadeos infinitos, scan-lines, esquinas animadas tipo bracket, shutters, `clip-path` de "escaneo de datos". Ver §6 y §9.
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
- **Regla de regreso (actualizada — patrón nativo)**: el botón de "volver a la vista anterior" **vive únicamente en `DashboardHeader`/`SubHeader`**, como ícono `ChevronLeft` a la izquierda del logo — nunca dentro de `actions` de `PageHeader`. Toda vista destino (llegada por clic en card o redirect) pasa `backHref`/`backLabel` al header, no un `PageHeaderLink variant="secondary"` con flecha. `backLabel` no se muestra como texto (el botón es solo ícono) — se usa como `aria-label`/`title` para accesibilidad. `actions` de `PageHeader` queda solo para acciones reales de la vista (ej. `+ Registrar Oficial`), nunca para "volver". Motivo: sensación de app nativa en la PWA (patrón back-chevron de iOS/Android) y para no duplicar la misma acción en dos lugares del header. **Pendiente**: ~37 vistas todavía tienen el patrón viejo (`PageHeaderLink href=... variant="secondary"` con `←`) — migrarlas quitando ese botón y pasando el mismo `href` como `backHref` al header.
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

`DashboardHeader` tiene un prop `variant?: 'tactico' | 'apple'`, **default `'apple'`** (ya volteado — ver §10). `'tactico'` queda disponible solo para revertir puntualmente si una vista lo necesita; no usarlo en código nuevo. `SubHeader`, `CampanillaNotificaciones`, `SignOutButton` y `CambiarSesionDev` (el selector de sesión dev) ya están en Apple-style directamente, sin variante — se ven así en todo el sistema sin importar si el cuerpo de la página de abajo sigue en el lenguaje táctico.

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
- **Botón de volver**: ícono `ChevronLeft` de `lucide-react`, 40×40px, **a la izquierda del logo** (patrón nativo iOS/Android — back-chevron antes del título, no un link con texto). Solo se renderiza si la página pasó `backHref`; `backLabel` no se muestra como texto, solo alimenta `aria-label`/`title`. Ver "Regla de regreso" en `PageHeader` — es el único lugar del sistema donde debe existir un botón de "volver".
- Los botones de acción del lado derecho usan un tamaño uniforme de **40×40px** — mínimo recomendado de target táctil en PWA.
- `CampanillaNotificaciones` se auto-abastece y siempre se renderiza.
- En `variant="apple"`: fondo `var(--apple-glass-bg)`, `backdrop-filter: blur(20px) saturate(180%)`, sin el kicker "Sistema Táctico" ni el corner decorator — ver `components/partials/Header.tsx`.

### Footer de página — `DashboardFooter` (REGLA)

Componente `components/partials/Footer.tsx` (`DashboardFooter`), usado en las 34 páginas del sistema. **Prohibido reimplementar el patrón inline.** Referencia visual: `.desp-footer` en `app/agente_despacho/page.tsx` (que queda como duplicación inline aprobada, a consolidar en el componente en una limpieza futura).

| Elemento | Estilo |
|---|---|
| Contenedor (`.dash-footer`) | `margin-top: auto; padding-top: 24px; border-top: 1px solid #e2e8f0; font-family: var(--apple-font-display); font-size: 12px; font-weight: 500; color: #94a3b8; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px` |
| Móvil ≤720px | `padding-top: 16px; font-size: 11px` (vía `@media (max-width: 720px)` en el `<style>` embebido del componente) |
| Izquierda | `SSPM · San Juan del Río · Qro` |
| Derecha | `Centinela {APP_VERSION}` (`APP_VERSION` de `@/lib/constants`) |

**Reglas (sin cambios de comportamiento):**
- Componente servidor (sin hooks) → el responsive de `padding-top`/`font-size` va con `<style>` embebido + clase CSS `.dash-footer`, igual que hace `app/agente_despacho/page.tsx` — no `useResponsive()`.
- Lleva `padding-bottom: env(safe-area-inset-bottom)` **dentro del propio componente** — el blindaje de safe-area no depende de que cada página lo tenga en su root.
- `margin-top: auto` solo pega el footer al fondo si la página tiene la cadena flex completa (`DESIGN.md §8`): root `display:flex/flexDirection:column/minHeight:100vh` + wrapper de contenido `flex:1` antes del footer. Sin esa cadena, el footer queda pegado al contenido.
- Sin props/variantes (ej. un sufijo de módulo tipo `· Despacho` que usa el footer inline de `agente_despacho`) — el componente es siempre idéntico.

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

**Reglas de integración (contenedor y ancho) — todas las vistas hub:**
- El contenedor de cards hub es **`.cat-cards-grid`** (`grid; repeat(2, minmax(0,1fr)); gap: 20px` → `1fr` ≤720px). **Prohibido** usar un `flex` con `justifyContent: center` + `flexWrap: wrap` — la cuadrícula estira las cards al ancho de su celda; el flex-centrado las deja "flotando" con huecos laterales y ancho arbitrario.
- La card lleva `width: 100%` y **sin `max-width`** — el `max-width` (ej. `520px`) recorta las cards y deja el resto del ancho vacío. El ancho lo controla la celda del grid, no la card.
- Cards de una misma fila a la misma altura: `height: 100%` en la card.
- **No apilar espaciado redundante** entre el título y las cards: `PageHeader` ya trae `marginBottom: clamp(20px, 5vw, 32px)` (§4). Si el contenedor padre usa `gap` para separar secciones, **no** agregar además `paddingTop` al grid de cards. Ritmo recomendado: contenedor `gap: 24` + el `marginBottom` del header (≈50-56px total en desktop, menos en móvil). Referencia de integración corregida: `app/oficial/page.tsx`.

### Cards individuales — anatomía interna (patrón module-card)

Cards glass de navegación/acción con layout interno fijo: **icono → título → sub → CTA**. Referencias de implementación: `app/dashboard/module-cards.tsx` (client component con estado hover) y `app/dashboard/sspm-general.tsx` (equivalente en **clases CSS** para server components).

| Elemento | Estilo |
|---|---|
| Contenedor (glass) | `var(--apple-glass-bg)` + `backdrop-filter: blur(20px) saturate(180%)`; border 1px `var(--apple-glass-border)`; radius `var(--radius-xl)`; shadow `var(--apple-shadow-glass)`; padding 24px; `min-height: 160px` (normal) / 220px (`large`); `overflow: hidden` |
| Fila de icono | `display: flex; justifyContent: space-between; alignItems: flex-start; marginBottom: 16` (24 si `large`) — es lo que separa el icono del título |
| Icono | `lucide-react`, size 24, `strokeWidth: 1.5`; color `#64748b`; hover → acento + `scale(1.1)` con **`transform-origin: top left`** (sin esto el scale mueve el icono y lo recorta contra el `overflow: hidden` de la card) |
| Contenido | `flex: 1` + `justifyContent: center` (empuja el CTA al fondo); título `var(--apple-font-display)` 600 26px (36 si `large`) `#0f172a`; sub 13px `#64748b` lineHeight 1.4 |
| CTA footer | `marginTop: 16` (24 si `large`); `var(--apple-font-display)` 600 13px `#94a3b8`; hover → acento; flecha `→` con `translateX(4px)` en hover |

**Estados de motion** (mismos que §6 "Micro-animaciones de acción"): reposo→hover `translateY(-2px)` + `var(--apple-shadow-glass-hover)` + borde acento 25% alpha, título/icono/CTA cambian a acento; hover→press `:active` `scale(0.97)` (sustituye el lift) + sombra base con transición `.12s`; base `transition: all .3s ease-out`; `prefers-reduced-motion` anula los transforms.

**Reglas:**
- En **server components** (sin hooks) el hover/press se implementa con **clases CSS** + `<style>` embebido — `sspm-general.tsx` es la referencia. En client components puede usarse estado (`module-cards.tsx`). La salida visual debe ser idéntica.
- El contenedor de la rejilla es **`.cat-cards-grid`** (nunca grid inline) — colapsa a 1 columna ≤720px.
- **Prohibido** el borde de color superior (`border-top` de 2px acento) como diferenciador de card — el acento vive en icono/título/CTA en hover, no en una barra decorativa.
- Un solo acento por vista (§2).

### Cards hub — variante compacta "app nativa" en móvil (patrón, ≤720px)

Cuando una vista de cards hub debe sentirse como app nativa en móvil (PWA, viewport de referencia iPhone XR 414×896) — no una versión encogida del mismo bloque hero — la card cambia de layout completo bajo `@media (max-width: 720px)`, **sin duplicar markup**: mismo DOM y mismo orden de elementos en los dos breakpoints, todo el cambio va por CSS (`display`/`flex-direction`/tamaños). Evita hidratación duplicada y mantiene un solo árbol para SEO/accesibilidad. Referencia de implementación: `app/agente_despacho/page.tsx` (clases `.card-911*`).

| Elemento | Desktop/tablet (hero, sin cambios — ver `.card-o` arriba) | Móvil ≤720px ("icon-list-row") |
|---|---|---|
| Card | `flex-direction: column`; padding 24-32px; `min-height: 160-280px`; radius `var(--radius-xl)` | `flex-direction: row; align-items: center`; padding `14px 16px`; `min-height: unset`; radius `var(--radius-lg)`; `gap: 14px` |
| Ícono | color `#64748b`, sin fondo propio, en la fila superior | chip `44×44px`, radius `var(--radius-lg)`, `background: rgba(primary, 0.08)` (variante alfa del acento de la vista); SVG a `20px` |
| Chip de categoría (top-right, ej. "Reportes") | visible, `position: absolute` dentro de la card | `display: none` — no cabe en una fila de 44px de alto |
| Título `h3` | 26-28px | 16px, una sola línea (`white-space: nowrap; overflow: hidden; text-overflow: ellipsis`) |
| Descripción larga | visible, 13px, `lineHeight: 1.5` | `display: none` — se reemplaza por la meta-línea |
| Meta-línea | `display: none` | `display: block`, 12px `#64748b`, una línea que condensa los datos clave que en desktop viven en el footer de stats (ej. `"3 pendientes · 1 en campo"`) |
| Footer de stats (2 columnas, `border-top`) | visible | `display: none` — resumido en la meta-línea, nunca se pierde información, solo se condensa |
| Chevron (`ChevronRight` `lucide-react`, 20px) | `display: none` | `display: block`, color `#94a3b8`, a la derecha — affordance de navegación tipo lista iOS/Android |

Regla: nunca ocultar el chevron/meta-línea en desktop quitándolos del DOM (usar `display: none`, no condicionales de render) — así el único código que cambia entre breakpoints es CSS, consistente con "Componentes servidor: sin hooks → usar clases CSS" (§8).

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

### Overlays — modal centrado vs. bottom sheet móvil (patrón)

Dos formas de overlay en el sistema, según qué tan largo/list-like sea el contenido:

| Overlay | Cuándo | Estilo |
|---|---|---|
| **Modal centrado** (referencia: `SeleccionarUnidadesModal`) | Diálogos de formulario/confirmación — igual en mobile y desktop | Backdrop `rgba(15,23,42,0.6)` + `backdrop-filter: blur(4px)`; caja centrada, `border-radius: var(--radius-xl)` en las 4 esquinas, `maxWidth`/`maxHeight: 88-90vh`, `overflow: hidden` con scroll interno |
| **Bottom sheet móvil** (referencia: `CampanillaNotificaciones`, ≤720px) | Listados/paneles cortos anclados a un botón del header (notificaciones, y candidato a futuro: perfil, filtros) — en tablet/desktop el mismo panel sigue siendo dropdown flotante anclado al botón, **no** se convierte en bottom sheet ahí | Backdrop `rgba(15,23,42,0.45)` + `blur(2px)`; hoja `position: fixed` a los 3 bordes inferiores, radios solo arriba (`var(--radius-xl) var(--radius-xl) 0 0`), `maxHeight: ~82vh` con la zona de contenido en `flex:1; overflow-y:auto` (header/footer del sheet quedan fijos), `padding-bottom: env(safe-area-inset-bottom)`, drag-handle decorativo (barra `36×4px` centrada, `background:#cbd5e1`), botón `X` explícito de cierre, entrada `translateY(100%) → 0` respetando `prefers-reduced-motion` |

Regla: el bottom sheet **nunca duplica markup** respecto a la versión desktop — un mismo bloque de JSX (header + contenido + acciones), el `style` inline se ramifica por `esMovil`/clase CSS según si el componente es cliente o servidor (§8). No crear un componente `BottomSheet` genérico hasta que un tercer caso lo justifique — hasta entonces, replicar la implementación de `CampanillaNotificaciones.tsx`.

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

### Micro-animaciones de acción — hover + press (patrón)

Todo elemento interactivo (card clicable, ítem de lista, botón) lleva **dos** estados de motion, no solo uno — hover es para mouse, `:active` es lo que de verdad se siente en móvil/PWA (touch no dispara hover, o lo dispara de forma inconsistente). Referencia de implementación: `app/agente_despacho/page.tsx` (clases `.card-911*`).

| Estado | Disparador | Efecto | Timing |
|---|---|---|---|
| Reposo → hover | `:hover` (mouse) | `translateY(-2px)` + `box-shadow: var(--apple-shadow-glass-hover)` + borde con acento al 25% alpha; ícono `scale(1.1)` y color a acento | `transition: all .3s ease-out` (declarado en el elemento base — rige también la vuelta a reposo) |
| Hover/reposo → press | `:active` (mouse **y** touch) | `transform: scale(0.97)` (sustituye el `translateY` de hover mientras se sostiene el toque — no se combinan) + `box-shadow` vuelve a la sombra base (glass sin hover) | `transition: transform/box-shadow .12s ease-out` — declarado **en la regla `:active`**, más corto que el de reposo/hover a propósito: la respuesta al toque debe sentirse inmediata; la vuelta a reposo hereda la `.3s` del elemento base |
| Affordance de navegación (chevron, ≤720px) | `:hover`/`:active` | `translateX(3px)` | `.2s ease` |

**Reglas:**
- `:active` va **después** de `:hover` en el CSS (mismo orden que en la tabla) — con igual especificidad, la regla declarada después gana, así el press sustituye limpiamente el lift del hover en vez de sumarse.
- Nunca usar el highlight azul/gris nativo del navegador como único feedback de toque (`-webkit-tap-highlight-color: transparent` ya está seteado globalmente en `app/globals.css`) — el `:active` de esta tabla es lo que lo reemplaza.
- Solo `transform`/`opacity`/`box-shadow`/`border-color` — nunca animar `width`/`height`/`top`/`left` (cuestan reflow, no compositing).
- **`prefers-reduced-motion: reduce`**: se anula el `transform` de hover/press y del chevron, dejando solo el cambio de `box-shadow`/`border-color` como feedback (sigue habiendo respuesta visual, solo sin movimiento):
  ```css
  @media (prefers-reduced-motion: reduce) {
    .elemento, .elemento:hover, .elemento:active { transform: none; transition: box-shadow .15s ease, border-color .15s ease; }
  }
  ```
- No agregar hover/press a elementos que no navegan/ejecutan una acción (ej. una card puramente informativa) — el motion es una promesa de interactividad, agregarlo a algo estático es un affordance falso.

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
- `:active` (press) además de `:hover` en toda card/botón interactivo — ver §6 "Micro-animaciones de acción". El hover casi no dispara en touch; sin `:active` la PWA se siente "muerta" al tocar.
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

### Densidad nativa en móvil (PWA, ≤720px) — REGLA

La PWA se instala y se usa como app nativa: el móvil **no es "el mismo layout, más angosto"** — es una vista más densa que debe caber en el viewport sin scroll salvo que el contenido real lo exija. **Viewport de referencia para verificar toda vista hub/dashboard: iPhone XR, 414×896.** Reglas concretas (referencia de ejecución completa: `app/agente_despacho/page.tsx`, ver también §4 "Cards hub — variante compacta"):

| Elemento | Desktop/tablet | Móvil ≤720px |
|---|---|---|
| Gap entre secciones de página (`display:flex; flex-direction:column; gap`) | ~40-48px | ~20px |
| Filas de stats/KPI (ver `StatBloque`) | `flex: 1 1 180px` (wrap libre), valor ~36px, label ~12px | `flex: 1 1 0` sin wrap (columnas iguales en una sola fila, como los "stat rows" de Salud/App Store), valor ~20-22px, label ~10px |
| Cards hub | hero vertical (§4 `.card-o`) | fila "icon-list-row" (§4) |

**Reglas de implementación:**
- El ajuste de gaps/paddings/tamaños entre breakpoints va **siempre por clase CSS con media query**, nunca por prop/valor inline (`style={{gap: 48}}`) — si el componente es servidor (sin hooks, caso más común en páginas hub), es la única opción; si es cliente, usar `useResponsive()` igual sirve pero la clase CSS es más barata (sin JS, sin flash en hidratación).
- **Footer de página pegado al fondo** (patrón permitido, no es excepción a "sin tamaños fijos" de §5): contenedor raíz de la página `display:flex; flex-direction:column; min-height:100vh`; el wrapper de contenido (`main`/`.pad-dashboard`) usa `flex:1`; el footer usa `margin-top:auto`. Así el footer queda al fondo del viewport cuando el contenido es corto, y sigue el flujo normal (la página scrollea, footer al final del contenido) cuando el contenido es más alto que la pantalla.
- El contenedor raíz de la página debe sumar `paddingBottom: env(safe-area-inset-bottom)` para que el contenido/footer no quede pegado al home indicator en modo `standalone`.
- Nunca lograr la densidad recortando información funcional (`overflow: hidden`, quitar links/datos) — condensar en una meta-línea o reducir tipografía/padding, no eliminar contenido (ver tabla de cards en §4).

### Tablet — dispositivo principal de Oficiales (REGLA)

**Oficiales usa tablet (no teléfono) como dispositivo principal.** Viewport de referencia para verificar: **iPad Air, 820×1180 (vertical)**. Esto se evaluó explícitamente para `/agente_despacho` (ver ADR-013 en `Decisiones.md`) — la conclusión no es "copiar la densidad de móvil a tablet", es al revés:

- **Las cards hub se quedan en tratamiento hero** (idéntico a desktop, §4 `.card-o`) — a 820px de ancho con `.cat-cards-grid` a 2 columnas sobra espacio de sobra para el layout completo (ícono + título + descripción + stats), y comprimir a la fila "icon-list-row" de móvil le quitaría al oficial justo la info a simple vista que sí rinde en una pantalla con más espacio. **No crear un tercer nivel de densidad entre móvil y desktop** salvo que un caso concreto lo justifique.
- Lo que **sí** cubre tablet automáticamente, porque nunca estuvo condicionado a `≤720px`: el feedback `:active`/press de §6 (crítico acá — tablet es táctil, sin mouse, así que el `:hover` casi nunca dispara), `paddingBottom: env(safe-area-inset-bottom)`, y cualquier fix de tipografía/color a nivel de componente compartido (`PageHeader`, `CampanillaNotificaciones`, etc.).
- Antes de dar por buena una vista en tablet, verificar con los números reales del viewport de referencia (ancho de `.pad-dashboard` en ese breakpoint, columnas de `.cat-cards-grid`, `clamp()` de tipografía) en vez de asumir por analogía con desktop o con móvil — a veces coincide, a veces no.

## 9 · Agent Prompt Guide

Cuando generes o modifiques UI en este proyecto:

1. **Lee este archivo completo** antes de escribir cualquier estilo.
2. Usa **`var(--apple-font-display)`** para todo (títulos, labels, cuerpo, botones). Sentence-case siempre, jerarquía por peso/tamaño.
3. Extrae colores **solo** de §2. Un solo acento por vista: fiscalía `#7c3aed`, catálogos/patrullas `#c0223a`, el resto `#1f355a`.
4. Reutiliza `PageHeader`, `SegmentPage`, `StepIndicator` y las clases `.fk-*`, `.grid-*`, `.pad-*`, `.tabla-wrap` — **nunca** recrees esos patrones.
5. Radios de §6 (Shape Consistency Lock) y superficies glass vs. planas según §6.
6. Respeta el Page Assembly Pattern: página = contenedor flex column (sin tamaños fijos) + header + main.
7. Hazlo responsive en los 3 niveles (720/1200) y verifica tablas/formularios en móvil. Para vistas hub/dashboard/PWA, además verifica densidad nativa en el viewport de referencia **iPhone XR 414×896** (§8 "Densidad nativa en móvil") — no es solo "que quepa", es que se sienta compacta como app nativa, no una versión encogida del layout desktop.
8. Motion con propósito, `transform`/`opacity` únicamente, `prefers-reduced-motion` respetado.
9. Revisa los Don'ts de §7 antes de dar por terminada la vista.
10. Si el código existente contradice este documento (incluido código en el lenguaje táctico anterior, §10), corrige el código hacia el lenguaje Apple-style — no repliques el patrón viejo en código nuevo.

## 10 · Estado de migración (código real vs. este documento)

Este documento especifica el lenguaje Apple-style como el **objetivo para todo el sistema**. La migración del código real es incremental — no todas las vistas reflejan esto todavía.

**Ya migrado (código real usa este lenguaje):**
- `app/(auth)/login/` (login completo)
- `app/dashboard/page.tsx`, `app/dashboard/module-cards.tsx`, `app/dashboard/sspm-general.tsx`, `app/dashboard/enable-2fa.tsx`
- **El header completo, en todo el sistema**: `components/partials/Header.tsx` (`DashboardHeader`, default ya volteado a `variant="apple"`) + `components/partials/SubHeader.tsx` + `components/notificaciones/CampanillaNotificaciones.tsx` + `app/dashboard/sign-out-button.tsx` + `components/dev/CambiarSesionDev.tsx`. Toda página del sistema ya muestra el header Apple-style, aunque su cuerpo siga en el lenguaje táctico hasta migrarse — discontinuidad visual esperada y temporal.
- **Módulo Oficial completo** (`plan-refact-ui`, etapas 1-11): `app/oficial/page.tsx`, `app/oficial/despachos/page.tsx`, `app/oficial/despachos/[id]/page.tsx`, `app/oficial/reportes/[id]/page.tsx`, `app/oficial/reportes/[id]/fotos/page.tsx`, `app/oficial/rondin/page.tsx`, `app/oficial/configuracion/page.tsx` (+ `EditarTelefono.tsx`), y los componentes `components/oficial/` (`SegmentControl`, `DespachoContent`, `AsignacionCard`, `NavegacionModal`, `NavegacionDespacho`, `FormularioRecorrido`, `SelectorDestinoLegal`, `MapaUbicacion`, `MapaPinFijo`, `ModalSeleccionarUnidad`, `RondinPageClient`, `RondinTabla`, `MiUbicacionSection`, `UnidadAsignadaSection`, `ContadorAsignaciones`, `ProfileDropdown`, `ToastExito`, `OficialUbicacionTracker` toast).
- **Módulo Despacho/911 completo** (`plan-refact-ui`, etapas 12-18): `app/agente_911/page.tsx`, `app/agente_despacho/page.tsx`, `app/agente_911/despacho/page.tsx`, `app/agente_despacho/kpi-incidencias/page.tsx` (wrapper), y los componentes `components/911/` (`TablonDespacho`, `DespachoForm`, `UnidadCards`, `AsignacionMapa`, `MapaSeguimientoOficial`, `SeleccionarUnidadesModal`, `Bitacora911`, `FiltrosIncidentes`, `Pagination`, `ModuleCard`).
- **Módulo Monitorista — hub y páginas activas** (2026-08-07): `app/monitorista/page.tsx` (hub, `.card-o`), `app/monitorista/solicitudes/page.tsx`, `app/monitorista/incidentes-camara/page.tsx`, `app/monitorista/historial/page.tsx`, y los componentes `components/monitorista/BandejaSolicitudes.tsx` (tabs `SegmentPage`, badges/botones pill) y `FilaIncidenteCamara.tsx`. **Pendiente**: sub-páginas `solicitudes/[id]`, `denuncias/[id]`, `incidentes-camara/nuevo`, `incidentes-camara/[id]` y los componentes `SubirEvidenciaModal`, `GaleriaEvidencias`, `BotonSubirDenuncia` siguen en el lenguaje táctico. **Nota (2026-08-07)**: el flujo de "Fotos de Detenidos" quedó **descartado y eliminado** por completo (card del hub, `/monitorista/detenidos*`, componentes y APIs del flujo, la página `/oficial/reportes/[id]/fotos` + su redirect, `/fiscalia/detenidos*`, `/agente_juzgado/detenidos*`, `/api/expediente/subir-foto-detenido` y la sección de permiso `detenidos`).
- **`components/partials/SegmentPage.tsx`** (2026-08-07): migrado a pill Apple-style según §4 (antes seguía en Barlow Condensed/uppercase con borde inferior). API sin cambios (`tabs`/`activeKey`/`onChange`/`href`/`accent`/`count`) — se corrigió hacia el documento. Afecta también a `components/fiscalia/TabSolicitudes.tsx` y `app/formatos-udai/reportes-incidencias/page.tsx`.
- `components/partials/PageHeader.tsx` (fix ADR-010): título/subtítulo/botones ya en Apple-style; antes seguía en el lenguaje táctico pese a que §4 ya lo documentaba así — se corrigió para las ~100 vistas que lo usan.
- **`app/error.tsx` + `app/global-error.tsx`** (2026-08-07): páginas de error migradas a Apple-style — card glass radius `--radius-xl`, título sentence-case "Error de sistema", ícono `ShieldAlert` de lucide-react en chip danger, kicker "SSPM · San Juan del Río · Centinela", botones `btnPrimario`/`btnSecundario` con hover+press. `global-error.tsx` mantiene tokens inline (autocontenido — puede renderizarse sin globals.css).
- **`components/partials/Footer.tsx` (`DashboardFooter`)** (`plan-footer-sistema`, ADR-014): el footer compartido de las 34 páginas ya es Apple-style (replica `.desp-footer` de `agente_despacho`). Las páginas que lo usan heredan el footer Apple-style aunque su cuerpo siga en el lenguaje táctico — discontinuidad visual esperada y temporal. Las que tenían la cadena flex rota (`agente_911/despacho`, `agente_despacho/kpi-incidencias`, `notificaciones`, `analisis/iph`, `analisis/pendiente-analisis`, `analisis/generar-ppt`, `analisis/page.tsx`, `analisis/formulario-ingreso`, `admin/roles/agregar`) se corrigieron para que el `margin-top:auto` del footer pegue al fondo (ver `DESIGN.md §8`).
- **`app/agente_despacho/page.tsx` es además la referencia de ejecución del patrón "densidad nativa en móvil"** (§4 "Cards hub — variante compacta", §8 "Densidad nativa en móvil") — usar como ejemplo al aplicar ese patrón a otras vistas hub.
- **KPI Incidencias completo** (2026-08-07): `KpiIncidenciasView`, `FiltrosRangoKpi`, `TablaIncidencias`, `ModalDetalleIncidencia`, `MapaPuntosIncidencias`, `MapaCalorIncidencias` y `formato` migrados a Apple-style (tipografía única, sentence-case, radios §6, superficies planas `--shadow-card`, badges de estatus con pareja `BG_ESTATUS`/`COLOR_ESTATUS`, botones con hover+press y `prefers-reduced-motion`). El wrapper de la página aplica la regla de regreso (`backHref="/agente_despacho"` en `DashboardHeader`). Además se corrigió la carga inicial: la vista consulta el rango default (últimas 24 h) al montar — antes la tabla abría vacía (ver `Troubleshooting.md`). **Rediseño UI/UX del mismo día** (dashboard operativo, referencia de "vista de análisis densa"): toolbar de filtros compacta con disclosure colapsable, franja de KPIs con count-up, grid mapa + panel lateral de **colonias con más reportes** (barras horizontales con contador, "áreas calientes"), tabla con ordenamiento/búsqueda/paginación/export CSV y header sticky, skeletons + empty state. Componentes nuevos: `KpiResumen.tsx`, `ColoniasCalientes.tsx`, `EstadosVista.tsx` (ver `KPI Incidencias.md`).

**Pendiente de migrar** (el *cuerpo* de estas vistas sigue en el lenguaje táctico anterior — Barlow Condensed/JetBrains Mono, radios sharp, sin glass; el header de todas ellas ya es Apple-style): Fiscalía, Juzgado, Flota, Formato N, formularios UDAI, tablas de expedientes, catálogos, admin, PWA offline.

**Decisión pendiente, explícitamente no resuelta todavía (no asumir, preguntar antes de tocar):**
- `components/PageTransition.tsx` — la transición "compuerta blindada táctica" entre rutas (montada globalmente en `app/layout.tsx`, se activa en cada navegación) es parte central del lenguaje anterior y afecta **toda la app**. No se ha decidido si se reemplaza por algo más calmado, se simplifica, o se retira. Cambiarla es una decisión de alto impacto (toca cada transición de página) — no modificar sin pedirlo explícitamente.

**Cómo migrar una vista existente**: aplicar §1-9 de este documento (tipografía, color, radios, materialidad, motion) sin cambiar la lógica, los nombres de campos/rutas, ni el comportamiento funcional — mismo criterio que se siguió en Login + Hub (ver `plan-apple-pilot/` en la raíz del repo como referencia de cómo se ejecutó esa migración, etapa por etapa).
