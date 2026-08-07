# Etapa 1 — `components/partials/Footer.tsx` (`DashboardFooter`)

No depende de otras etapas. Leer `00-contexto.md` primero.

## Objetivo

Reemplazar el estilo táctico actual del componente compartido por el estilo Apple-style ya aprobado por el usuario en `/agente_despacho`. Es un solo archivo, sin cambios de props/API — cero riesgo, y como lo usan 34 páginas, el cambio visual se nota de inmediato en todas ellas aunque el posicionamiento de algunas no se corrija hasta etapas posteriores.

## Fuente de la verdad del estilo

`app/agente_despacho/page.tsx` — bloque `<style>` con la clase `.desp-footer` y el JSX que la usa (busca `desp-footer` en ese archivo). Replicar ese estilo tal cual, adaptado a que `DashboardFooter` es un componente aparte (sin depender del `<style>` de la página que lo importa):

- `margin-top: auto`, `padding-top: 24px` (16px en móvil ≤720px), `border-top: 1px solid #e2e8f0`.
- Tipografía `var(--apple-font-display)`, `font-size: 12px` (11px en móvil), `font-weight: 500`, `color: #94a3b8`. Sentence-case, nada de `text-transform: uppercase` ni `letter-spacing` grande (eso es del lenguaje táctico anterior, se quita).
- `display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px`.
- Contenido: `SSPM · San Juan del Río · Qro` a la izquierda, `Centinela {APP_VERSION}` a la derecha (`APP_VERSION` ya se importa de `@/lib/constants`, no cambia). El punto decorativo `#3e5171` del diseño táctico anterior se quita — no forma parte del diseño de `.desp-footer`.
- Como el componente es servidor (sin hooks), el responsive de `padding-top`/`font-size` en móvil va con un `<style>` embebido + clase CSS (`@media (max-width: 720px)`), igual que hace `app/agente_despacho/page.tsx` — no con `useResponsive()`.
- Agregar `padding-bottom: env(safe-area-inset-bottom)` **dentro del propio componente** (no en las páginas que lo usan) — así el blindaje de safe-area no depende de que cada una de las 34 páginas lo tenga en su root; ver `DESIGN.md §8`.

## Qué no tocar

- Las props/API del componente (sigue sin recibir props).
- Ninguna de las 34 páginas que lo importan — esta etapa es solo el componente.

## Criterios de aceptación

1. `npx tsc --noEmit` sin errores.
2. `npx eslint components/partials/Footer.tsx` sin errores.
3. Verificación manual: abrir cualquier página que ya tenga la cadena flex correcta (ej. `/fiscalia`) y confirmar que el footer se ve igual que en `/agente_despacho` (misma tipografía, mismo `border-top`, sin el punto decorativo azul).

Detenerse aquí y esperar confirmación antes de pasar a Etapa 2.
