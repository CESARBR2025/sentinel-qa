# Contexto — Piloto Apple-style

## El pedido

El usuario descargó una skill de diseño frontend (`taste-SKILL.md`, ~1200 líneas, referencia visual `designmd.co/d/apple`) y preguntó si valía la pena usarla para darle a Centinela un "toque premium estilo Apple", porque hoy "se siente producto gubernamental" y eso "siempre se ve viejo".

## Lectura previa (ya comunicada al usuario, aceptada)

La skill (`taste-SKILL.md`, sección 13 "Out of scope") dice literalmente que **no** es para dashboards, tablas de datos, ni formularios multi-paso — recomienda para esos casos sistemas de diseño de producto reales (Fluent, Carbon, Atlassian, Polaris). Centinela es, en su enorme mayoría, exactamente eso: despacho 911, formularios UDAI/Formato N, tablas de expedientes, vistas de Juzgado/Fiscalía/Flota. Aplicar la skill tal cual (bento grids de marketing, glassmorphism agresivo, GSAP scroll-hijacking, "eyebrows", CTAs de landing) a esas vistas rompería la legibilidad operativa que hoy funciona bien para personal trabajando bajo presión.

Se le presentó esto al usuario junto con el contraste real de `DESIGN.md` (sistema "tablón de despacho": Barlow Condensed 800 mayúscula, JetBrains Mono, acentos semánticos por estado, alta densidad). El usuario confirmó que entiende el riesgo y que quiere seguir adelante de todas formas — pero acotado.

## Decisión de alcance (via `AskUserQuestion`)

Se le presentaron 3 opciones de alcance ("solo superficies premium", "todo el sistema unificado", "piloto en 1-2 pantallas") y 2 de modo oscuro ("dual-mode desde el inicio", "solo modo claro"). El usuario eligió:

- **Piloto en 1-2 pantallas.** Se interpretó como Login + Hub de módulos (`/dashboard`), las dos superficies "premium-facing" más obvias del sistema — es el primer contacto del usuario con la app (login) y el punto de entrada/navegación (hub), ninguna de las dos es una vista operativa densa.
- **Sin modo oscuro.**

## Rol de quien planea vs. quien construye

El usuario es explícito (regla de negocio confirmada en sesiones anteriores): quien planea (Claude, en este chat) es su Senior Developer/Software Architect — analiza, indaga y entrega planes precisos, **no implementa el código de producción**. DeepSeek (u otro worker que el usuario designe) construye a partir de estas etapas. Por eso el entregable de esta tarea es esta carpeta, no un PR ya implementado.

## Estado real del código (verificado, no asumido)

### Login (`app/(auth)/login/page.tsx` + `app/(auth)/login/login.css`)

- Es una hoja de estilos **bespoke**, no usa los tokens de `DESIGN.md`/`app/globals.css`. Define sus propias variables en `.login-scope`: `--red`, `--gold`, `--ok`, `--ink-2`, etc.
- Dato importante: `--red` y `--gold` ya están casi todos redefinidos a `#1f355a` (navy institucional) — el nombre de la variable es legacy pero el color real casi nunca es rojo/dorado literal (excepción: `--gold-hi: #f0be4c` y `--red-hi: #447df9`, usados en focus rings/hover). Esto simplifica el trabajo: gran parte del cambio de color es solo renombrar/limpiar variables, no recolorear todo desde cero.
- Flujo funcional (NO tocar la lógica, solo el envoltorio visual): `phase` = `idle → submitting-1 → otp → submitting-2 → success`, con `failed` = `credentials | otp | server | null`. Usa `authClient.signIn.email` y `authClient.twoFactor.verifyTotp`. Redirige a `fromPath` (query param `from`, default `/dashboard`) 1.2s después de `success`.
- El componente `Terminal` (log de consola falso) existe en el archivo pero está **comentado** en el JSX (`{/* {phase !== 'success' && <Terminal .../>} */}`) — no se renderiza hoy. No hace falta borrarlo activamente, pero si se limpia el archivo es buen momento para quitarlo (era parte de la estética cyber que ya no se usa).
- Elementos puramente decorativos "tácticos" a remover/reemplazar en la Etapa 3: `.login-corner` (esquinas doradas en las 4 puntas), `.login-stage-bg` (grid de fondo), badges con `border: 1px solid var(--gold)` + texto mono espaciado, stepper con `border-top` de 3px.
- Varias strings están en mayúsculas **directamente en el JSX** (no solo por CSS `text-transform`), ej. `'ETAPA 1 · CREDENCIALES'`, `'ETAPA 2 · VERIFICACIÓN 2FA'`, `SSPM-SJR · ACCESO SEGURO`, `CIFRADO TLS 1.3`. Para lograr sentence-case real hace falta tocar tanto CSS (`text-transform`) como estas literales.

### Dashboard shell (`app/dashboard/page.tsx`)

- Server Component. Resuelve sesión, hace `redirect('/login')` si no hay sesión, y `redirect(hub)` si el usuario tiene un hub de rol propio (`obtenerHubRol`) — el hub general de `/dashboard` **solo lo ven administradores** (`esAdmin`) o roles sin hub propio. **No tocar esta lógica.**
- Tiene un bloque `<style>` inline grande con: `tactical shutters` (dos paneles que se abren tipo persiana al cargar), `.grid-bg` con `gridFlash` (parpadeo de grid de fondo), `.cyber-reveal` + `.delay-N` (entrada de contenido con `clip-path` tipo "escaneo de datos"). Todo esto se reemplaza por transiciones `framer-motion` sutiles (fade + translateY, sin parpadeos ni clip-paths).
- Usa `<DashboardHeader user={user} />` sin variant — la Etapa 4 le agrega `variant="apple"`.
- Panel lateral: "Seguridad de la Cuenta" (`Enable2FA`) y "Estado del Sistema" (métricas hardcodeadas: núcleo DB, latencia, última sync) — ambos ya usan `background:#fff, backdropFilter: blur(10px), border:1px solid #e2e8f0`, es decir ya tienen una base "glass" muy tímida que la Etapa 4 profundiza (blur más fuerte, radios grandes, sombra tintada) en vez de reconstruir desde cero.

### ModuleCards (`app/dashboard/module-cards.tsx`)

- Client Component, 6 módulos hardcodeados en `MODULES` (`prevencion`, `monitorista`, `incidentes`, `reportes`, `catalogos`, `admin`), cada uno con `label`, `sub`, `icon` (SVG hand-rolled inline), `href` opcional, `size` (`'large'|'normal'`), `status` (`'active'|'building'|'alert'`), `stats` opcional.
- Ya tiene una estructura tipo "bento" real: los 2 módulos `size: 'large'` ocupan la fila completa (`gridColumn: '1 / -1'`), el resto en grid de 2 columnas — la Etapa 5 no necesita rediseñar la composición del grid, solo su piel visual.
- Los 5 iconos (`ShieldIcon`, `AlertIcon`, `ChartIcon`, `BookIcon`, `SettingsIcon`, `CameraIcon`) son SVG dibujados a mano inline — la skill de diseño desaconseja esto y pide usar una librería de iconos. El proyecto ya depende de `lucide-react`, así que la Etapa 5 los reemplaza por sus equivalentes de Lucide (`Shield`, `AlertTriangle`, `BarChart3`, `BookOpen`, `Settings`, `Camera`) en vez de agregar una dependencia nueva.
- Estado `building` tiene overlays "futurismo táctico": grid blueprint pulsante (`.mc-grid`), línea de escaneo (`.mc-scan`), badge con `.mc-ping`/`.mc-blink`. Se reemplaza por un badge calmado sin animación infinita (o una animación muy sutil, sin parpadeo).

### `components/partials/Header.tsx` (`DashboardHeader`)

- Usado en ~100 páginas del sistema (comentario en el propio archivo: "Toda página del sistema debe usar este componente en vez de reimplementar su propio header"). `DESIGN.md §4` lo declara REGLA — prohibido reimplementar el chrome superior inline.
- No se puede restylear globalmente sin afectar todo el sistema tabular/operativo (fuera de alcance). La Etapa 2 le agrega un prop `variant?: 'tactico' | 'apple'` con default `'tactico'` — cero cambio visual en las ~99 páginas que no pasan el prop.

### Tokens disponibles en `app/globals.css` (`@theme inline`, ya existentes, reutilizables sin inventar nada nuevo)

```
--color-primary: #1f355a
--color-primary-dark: #132138
--color-primary-light: #64748d
--color-surface: #FFFFFF
--color-background: #F1F5F9
--color-border: #E2E8F0
--color-text-primary: #0F172A
--color-text-secondary: #64748B
--shadow-card / --shadow-elevated / --shadow-modal / --shadow-hover
--radius-sm(6) / --radius-md(8) / --radius-lg(12) / --radius-xl(16) / --radius-full
```

La Etapa 1 solo agrega variantes "glass" (alfa de `primary`/blanco) y una pila de fuente de sistema — no colores nuevos.

## Decisiones de diseño del piloto (aplican a Etapas 3-5)

1. **Tipografía**: pila de sistema `-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', system-ui, sans-serif` para títulos y cuerpo de las superficies piloto, en vez de Barlow Condensed 800 mayúscula / JetBrains Mono uppercase. Sentence-case en vez de mayúsculas agresivas. Sin fuentes nuevas cargadas (nada de `@font-face`/Google Fonts adicional).
2. **Color**: un solo acento (`primary` / `#1f355a`), fondos neutros suaves, sombras tintadas (nunca negro puro), sin glow neón ni multi-color táctico (rojo/dorado literal fuera).
3. **Materialidad**: `backdrop-filter: blur` en paneles y cards ("glass"), radios grandes y consistentes (`--radius-xl`/`--radius-lg`), sombras suaves tintadas de `primary`.
4. **Motion**: `framer-motion`, sutil y con propósito — fade + translateY de entrada, hover con elevación (`translateY(-2px)` + sombra), nada de parpadeos infinitos, scan-lines, ni shutters. Respeta `prefers-reduced-motion` (framer-motion ya honra `useReducedMotion()` si se usa explícitamente).
5. **Iconos**: `lucide-react` (ya instalado) en vez de SVG hand-rolled.
6. **`DashboardHeader`**: variant opcional, no reescritura.

## Qué NO cambia (preservar tal cual)

- Toda la lógica de autenticación, 2FA/OTP, redirect por rol.
- Nombres de campos de formulario, rutas, `href` de módulos.
- El resto del sistema (911, formularios, tablas, otros módulos) — cero cambios visuales fuera de las 5 etapas.
- Los 3 breakpoints responsive del proyecto (móvil ≤720px, tablet 721–1200px, desktop >1200px) y el patrón `useResponsive()`/clamp() ya usado.
