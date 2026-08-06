# Etapa 4 — Dashboard shell (`app/dashboard/page.tsx`)

Depende de Etapas 1 y 2 (tokens `--apple-*` y `DashboardHeader variant="apple"`). Leer `00-contexto.md` primero.

## Objetivo

Quitar el motion "táctico" (tactical shutters, grid flash, cyber-reveal con `clip-path`) del hub y reemplazarlo por transiciones `framer-motion` sutiles, aplicar `DashboardHeader variant="apple"`, y suavizar los paneles laterales a estética "glass". **No tocar la lógica de servidor**: `auth.api.getSession`, `redirect('/login')`, `getUserWithRole`, `obtenerHubRol` + `redirect(hub)`, el gate `userWithRole?.esAdmin` para `SspmGeneral`, ni los datos que se le pasan a `Enable2FA`/`ModuleCards`.

## Cambios en `app/dashboard/page.tsx`

### 1. Quitar el bloque `<style>` inline táctico

Eliminar por completo el `<style>{...}</style>` (líneas 27-94: `@keyframes openTop/openBottom`, `.shutter/.top-shutter/.bottom-shutter/.shutter-acc`, `@keyframes dataReveal`, `.cyber-reveal/.delay-N`, `@keyframes gridFlash`, `.grid-bg`). También eliminar los elementos que los usan:

```tsx
{/* ELIMINAR estas 3 líneas */}
<div className="shutter top-shutter"><div className="shutter-acc"></div></div>
<div className="shutter bottom-shutter"><div className="shutter-acc"></div></div>
<div className="grid-bg"></div>
```

Mantener el bloque `<style>{`.dashboard-grid {...} @media (max-width: 1200px) {...}`}</style>` (grid responsive del layout) — ese no es decoración táctica, es layout funcional.

### 2. Entrada del contenido con `framer-motion` en vez de `.cyber-reveal`

El archivo es un Server Component (`async function DashboardPage`) — `framer-motion` (`motion.div`) requiere `'use client'`. Crear un componente cliente pequeño y aislado (patrón "leaf component" de la skill de diseño, sección 3.A) en `app/dashboard/fade-in.tsx`:

```tsx
'use client'
import { motion } from 'framer-motion'

export function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}
```

Envolver con `<FadeIn delay={0.1}>...</FadeIn>` los bloques que hoy tienen `className="cyber-reveal delay-2"` (ModuleCards) y `className="cyber-reveal delay-3 panel-lateral"` (panel lateral) y `className="cyared-reveal delay-4"` (footer) — mismo `delay` incremental (0, 0.1, 0.15, 0.2) que hoy dan `.delay-2/.delay-3/.delay-4`. Quitar las clases `cyared-reveal`/`delay-N` del JSX una vez envuelto en `<FadeIn>`.

### 3. `DashboardHeader` con variant Apple

```tsx
<DashboardHeader user={user} variant="apple" />
```

### 4. Panel lateral — profundizar el "glass" ya existente

Los 2 paneles (`Seguridad de la Cuenta`, `Estado del Sistema`) ya tienen `background:#fff, backdropFilter: blur(10px), border:1px solid #e2e8f0`. Cambiar a:

```tsx
{
  background: 'var(--apple-glass-bg)',
  backdropFilter: 'blur(20px) saturate(180%)',
  border: '1px solid var(--apple-glass-border)',
  borderRadius: 'var(--radius-xl)',
  boxShadow: 'var(--apple-shadow-glass)',
  padding: 32,
  position: 'relative',
}
```

Quitar los "Decorators" de esquina (`<div>` con `borderTop`/`borderLeft` en `rgba(62, 81, 113, 0.3)`) — son detalle táctico. Los títulos `<h3>` (`Seguridad de la Cuenta`, `Estado del Sistema`) pierden `fontFamily: 'JetBrains Mono, monospace'` + `letterSpacing: '0.2em'` + `textTransform: 'uppercase'` → usar `fontFamily: 'var(--apple-font-display)', fontWeight: 600, fontSize: 15` en sentence-case (ya lo están en el JSX).

### 5. Título "Módulos Operativos" y footer

`<h2>` con `Barlow Condensed`, `0.08em`, `uppercase` → `var(--apple-font-display)`, `fontWeight: 600`, `textTransform: 'none'`, texto `Módulos operativos` (sentence-case, ya está así en el JSX salvo el CSS que lo pone en mayúsculas). El barrote decorativo de 4×16px antes del título puede quedarse (es un acento neutro, no táctico).

Footer (`SSPM · SAN JUAN DEL RÍO · QRO` + `CENTINELA {APP_VERSION}`): quitar `fontFamily: 'JetBrains Mono,monospace'`, `letterSpacing: '0.18em'`, `textTransform: 'uppercase'` → `var(--apple-font-display)`, sentence-case (`SSPM · San Juan del Río · QRO`).

## Criterios de aceptación

1. `npx tsc --noEmit` sin errores.
2. `npm run build` sin errores.
3. Verificación manual: usuario admin ve `SspmGeneral` + hub general con animación de entrada suave (sin shutters ni parpadeo de grid); usuario con hub propio sigue siendo redirigido antes de renderizar nada (sin cambios de lógica).
4. `DashboardHeader` en `/dashboard` se ve con el lenguaje Apple (sin "Sistema Táctico", sin corner decorator, título sentence-case); cualquier otra página que use `DashboardHeader` sin `variant` sigue exactamente igual que antes (verificar 2-3 páginas).
5. Responsive: el `.dashboard-grid` (2 columnas → 1 columna en <1200px) sigue funcionando, no se tocó esa regla.

Detenerse aquí y esperar confirmación antes de pasar a Etapa 5.
