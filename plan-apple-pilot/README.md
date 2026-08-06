# Plan: Piloto de rediseño "Apple-style" — Login + Hub de módulos

Centinela usa hoy un lenguaje visual "tablón de despacho / táctico-cyber" (Barlow Condensed mayúsculas, JetBrains Mono, esquinas doradas, scan-lines, tactical shutters), definido como fuente única en `DESIGN.md`. El usuario adjuntó una skill de diseño (`taste-SKILL.md`, referencia visual `designmd.co/d/apple`) y pidió explícitamente un lenguaje "premium, estilo Apple" porque Centinela "se siente gubernamental/viejo".

Se le advirtió que esa skill está pensada para landing pages/portfolios (ella misma excluye dashboards, tablas y formularios multi-paso — la mayor parte de Centinela). El usuario aceptó el trade-off y, ante la pregunta explícita de alcance, decidió:

- **Piloto en 1-2 pantallas** (no todo el sistema) — validar el look antes de comprometerse al resto.
- **Sin modo oscuro** — solo modo claro por ahora.

Diseñado por Claude (arquitecto), verificado contra el código real (`app/(auth)/login/page.tsx` + `login.css`, `app/dashboard/page.tsx`, `app/dashboard/module-cards.tsx`, `components/partials/Header.tsx`, `DESIGN.md`, `app/globals.css`). A construir por DeepSeek (worker).

## Cómo llegó a esta forma

Ver `00-contexto.md` para el detalle completo de decisiones de diseño (tipografía, color, materialidad, motion, iconos) y por qué cada una se tomó.

## Orden de trabajo

Las etapas son secuenciales — cada una depende de la anterior (Etapa 1 crea los tokens que las Etapas 3-5 consumen; Etapa 2 crea el `variant` que Etapa 4 usa).

1. [00-contexto.md](00-contexto.md) — leer primero, siempre.
2. [etapa-1.md](etapa-1.md) — `DESIGN.md` + `app/globals.css`: nueva sección "Piloto Apple-Style" y tokens CSS del piloto.
3. [etapa-2.md](etapa-2.md) — `components/partials/Header.tsx`: agregar `variant?: 'tactico' | 'apple'` (default `'tactico'`, sin romper las ~100 páginas existentes).
4. [etapa-3.md](etapa-3.md) — Login (`app/(auth)/login/page.tsx` + `login.css`): nuevo lenguaje visual, mismo comportamiento funcional.
5. [etapa-4.md](etapa-4.md) — Dashboard shell (`app/dashboard/page.tsx`): quita el motion táctico, usa `DashboardHeader variant="apple"`.
6. [etapa-5.md](etapa-5.md) — `ModuleCards` (`app/dashboard/module-cards.tsx`): grid tipo bento, glass cards, iconos `lucide-react`.

## Decisiones ya tomadas (no volver a preguntar)

1. Alcance = solo Login + Hub (`/dashboard` + `ModuleCards`). Ninguna otra vista del sistema se toca.
2. Sin modo oscuro.
3. Un solo acento de color: `primary` (`#1f355a`), ya existente en `DESIGN.md §2`. No se inventan colores nuevos — los tokens "glass" del piloto son variaciones alfa de `primary`/blanco.
4. Sin dependencias nuevas: tipografía con pila de sistema (sin @font-face nuevo), motion con `framer-motion` (ya instalado), iconos con `lucide-react` (ya instalado).
5. `DashboardHeader` es compartido en ~100 páginas — no se reescribe, se le agrega un `variant` opcional que no cambia el comportamiento default.

## Reglas para quien construye (DeepSeek)

- No combinar etapas ni adelantar trabajo de una etapa posterior.
- No tocar ninguna vista fuera de las 5 listadas arriba (ver "Fuera de alcance").
- No agregar dependencias nuevas al `package.json`.
- Al terminar cada etapa, correr `npx tsc --noEmit` y los criterios de aceptación específicos de esa etapa antes de reportarla como lista. **Detenerse y esperar confirmación del usuario antes de seguir con la siguiente.**
- Leer `DESIGN.md` completo (incluida la sección nueva de la Etapa 1) antes de tocar cualquier archivo de UI — es la fuente de verdad visual única del proyecto.
- Si el código real no coincide exactamente con lo descrito en una etapa (líneas movidas, etc.), priorizar el código real, mantener el mismo patrón/objetivo, y avisarlo explícitamente al reportar la etapa — no resolverlo en silencio.
- Preservar toda la lógica funcional existente: estados del login (`idle/submitting-1/otp/submitting-2/success`), validaciones, 2FA/OTP, redirect por rol en `/dashboard`, sección `SspmGeneral` solo-admin, todos los `href` y estados (`active`/`building`) de `ModuleCards`.

## Fuera de alcance (no implementar salvo pedido explícito)

- Cualquier otra vista del sistema: 911/despacho, Fiscalía, Juzgado, Flota, formularios UDAI/Formato N, tablas de expedientes, catálogos, admin, PWA offline, etc.
- Modo oscuro.
- Cambios de lógica de autenticación/2FA, rutas, nombres de campos de formulario (rompe analytics/autofill).
- Fuentes nuevas, librerías de iconos nuevas (Phosphor/Tabler/etc.), Motion/GSAP nuevos.
- Migrar el resto del sistema al lenguaje Apple — es una decisión de una sesión futura, después de validar el piloto con el usuario.

## Checklist general al terminar TODAS las etapas

1. `npx tsc --noEmit` limpio.
2. `npm run build` sin errores.
3. Verificación manual del login: los 3 estados (credenciales → OTP → éxito), mensajes de error de credenciales/OTP/servidor, en los 3 breakpoints de `DESIGN.md` (móvil ≤720px, tablet 721–1200px, desktop >1200px).
4. Verificación manual de `/dashboard`: con usuario admin (ve `SspmGeneral` + hub general) y con usuario de rol con hub propio (debe seguir redirigiendo, sin cambios de lógica), en los 3 breakpoints.
5. Confirmar que ninguna otra vista del sistema cambió visualmente (sanity check rápido en 2-3 páginas que usan `DashboardHeader` con `variant` default).
6. Agregar un ADR breve en `boveda/🏗 Arquitectura/Decisiones.md` ("Piloto de lenguaje visual Apple-style, alcance limitado a Login + Hub").

---

## Prompt para DeepSeek

Ver [PROMPT-DEEPSEEK.md](PROMPT-DEEPSEEK.md) — pégalo tal cual como primer mensaje.
