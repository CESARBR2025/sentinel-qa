# Etapa 2 — `app/oficial/page.tsx` (hub, 4 cards)

No depende de ninguna otra etapa. Leer `00-contexto.md` primero.

## Objetivo

Migrar el hub principal de Oficial (4 tarjetas de navegación) al lenguaje Apple-style, siguiendo el mismo patrón ya construido en `app/dashboard/module-cards.tsx` (referencia directa de cómo se hizo esta migración en el piloto).

## Archivo: `app/oficial/page.tsx`

- Quitar el `<style>` embebido con el `@import` de Google Fonts (JetBrains Mono/Barlow Condensed) — ya no se usa ninguna de las dos familias.
- Las 4 `.card-o` inline pasan a superficie **glass** (`DESIGN.md §4` "Cards hub — `.card-o`"): `background: var(--apple-glass-bg)`, `backdrop-filter: blur(20px) saturate(180%)`, `border: 1px solid var(--apple-glass-border)`, radio `var(--radius-xl)`, sombra `var(--apple-shadow-glass)` (hover `var(--apple-shadow-glass-hover)` + `translateY(-2px)`).
- Textos de las cards a sentence-case, `var(--apple-font-display)` 600, sin `letterSpacing`/`textTransform: uppercase`.
- Footer con puntos parpadeantes tácticos: quitar la animación de parpadeo infinito (`DESIGN.md §1` prohíbe parpadeos sin propósito) — puede quedar como punto estático si aporta jerarquía, o quitarse.
- `PageHeader`/`DashboardHeader` ya son componentes compartidos — no reimplementar, solo verificar que reciban los props correctos (sin `variant` propio en `PageHeader`, y `DashboardHeader` puede pasar a `variant="apple"` igual que se hizo en `app/dashboard/page.tsx`).

No tocar: los `href` de cada card, ninguna lógica (el archivo no tiene lógica de negocio propia, solo Links).

## Criterios de aceptación

1. `npx tsc --noEmit` sin errores.
2. `npm run build` sin errores.
3. Verificación manual: las 4 cards navegan a los mismos destinos que antes.
4. Responsive en los 3 breakpoints.

Detenerse aquí y esperar confirmación antes de pasar a Etapa 3.
