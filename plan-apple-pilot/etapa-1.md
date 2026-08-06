# Etapa 1 — Tokens del piloto en `DESIGN.md` + `app/globals.css`

No depende de ninguna otra etapa. Leer primero `00-contexto.md`.

## Objetivo

Documentar el lenguaje visual del piloto como una sección **nueva y claramente delimitada** de `DESIGN.md` (sigue siendo la fuente única — no se crea un documento paralelo), y agregar los tokens CSS que esa sección describe a `app/globals.css`. Ninguna vista existente cambia de aspecto en esta etapa — solo se agregan tokens que nadie consume todavía.

## Archivo 1: `DESIGN.md` — agregar sección nueva al final (después de `## 9 · Agent Prompt Guide`)

```markdown
## 10 · Piloto Apple-Style — Login + Hub (alcance limitado)

**Vigencia:** SOLO `app/(auth)/login/` y `app/dashboard/page.tsx` + `app/dashboard/module-cards.tsx` (vía `DashboardHeader variant="apple"`). El resto del sistema (911, Fiscalía, Juzgado, Flota, formularios, tablas, catálogos, admin) sigue el lenguaje "tablón de despacho" de las secciones 1-9 sin cambios. No extender este lenguaje a otra vista sin decisión explícita del usuario.

### Motivación

Piloto para validar un lenguaje visual más calmado/premium ("Apple-style") en las dos superficies de entrada del sistema (login y hub de navegación), antes de decidir si se extiende al resto. Ver `plan-apple-pilot/00-contexto.md` para el contexto completo.

### Tipografía

- Pila de sistema en vez de Barlow Condensed/JetBrains Mono: `var(--apple-font-display)` = `-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', system-ui, sans-serif`.
- Sentence-case, no mayúsculas agresivas. Sin `letter-spacing` extremo (`0.15em`+).
- Pesos 500-700 (nunca 800 all-caps).

### Color

- Un solo acento: `primary` (`#1f355a`), ya existente en §2. No se usan `--red`/`--gold` literales del `login.css` legacy.
- Fondos: `--color-background` (`#F1F5F9`) / `--color-surface` (`#FFFFFF`), sin gradientes decorativos salvo botones primarios.

### Materialidad ("glass")

Tokens nuevos en `app/globals.css` (`@theme inline`), variantes alfa de `primary`/blanco — no colores nuevos:

| Token | Valor | Uso |
|---|---|---|
| `--apple-glass-bg` | `rgba(255,255,255,0.72)` | Fondo de paneles/cards |
| `--apple-glass-border` | `rgba(255,255,255,0.6)` | Borde de paneles/cards |
| `--apple-shadow-glass` | `0 8px 30px rgba(31,53,90,0.10), 0 1px 2px rgba(31,53,90,0.06)` | Sombra base |
| `--apple-shadow-glass-hover` | `0 16px 40px rgba(31,53,90,0.14), 0 2px 6px rgba(31,53,90,0.08)` | Sombra en hover |

Radios: reutilizar `--radius-xl` (16px, cards) y `--radius-lg` (12px, inputs/botones) — ya existentes, no se agregan radios nuevos.

### Motion

`framer-motion` (ya instalado). Entrada: fade + `translateY(8px→0)`, `duration: 0.4, ease: 'easeOut'`. Hover de cards: `translateY(-2px)` + `--apple-shadow-glass-hover`. Sin parpadeos infinitos, scan-lines, ni shutters — eso queda exclusivo del lenguaje táctico (§1-9).

### Iconos

`lucide-react` (ya instalado), stroke-width 1.5-2. No SVG hand-rolled en las superficies piloto.

### Modo oscuro

Fuera de alcance del piloto — solo modo claro.
```

## Archivo 2: `app/globals.css` — agregar tokens dentro del bloque `@theme inline`

Ubicar el bloque `@theme inline { ... }` (empieza en la línea con `--color-background: #F1F5F9;`) y agregar, junto a los `--shadow-*`/`--radius-*` existentes:

```css
  /* Piloto Apple-style — SOLO login y /dashboard (hub). Ver DESIGN.md §10. */
  --apple-font-display: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', system-ui, sans-serif;
  --apple-glass-bg: rgba(255, 255, 255, 0.72);
  --apple-glass-border: rgba(255, 255, 255, 0.6);
  --apple-shadow-glass: 0 8px 30px rgba(31, 53, 90, 0.10), 0 1px 2px rgba(31, 53, 90, 0.06);
  --apple-shadow-glass-hover: 0 16px 40px rgba(31, 53, 90, 0.14), 0 2px 6px rgba(31, 53, 90, 0.08);
```

No modificar ningún otro valor del bloque `@theme` — todos los tokens existentes (`--color-primary`, `--radius-xl`, etc.) se reutilizan tal cual desde las Etapas 3-5, no se redefinen.

## Criterios de aceptación

1. `DESIGN.md` tiene la sección `## 10 · Piloto Apple-Style — Login + Hub` al final, sin alterar ninguna sección anterior.
2. `app/globals.css` tiene los 5 tokens nuevos dentro de `@theme inline`, sin tocar ningún token existente.
3. `npx tsc --noEmit` sin errores (no debería verse afectado, es CSS/markdown puro).
4. `npm run build` sin errores — confirma que el CSS nuevo no rompe la compilación de Tailwind v4.
5. Ninguna vista del sistema cambia de aspecto todavía (los tokens no se consumen hasta las Etapas 3-5).

Detenerse aquí y esperar confirmación antes de pasar a Etapa 2.
