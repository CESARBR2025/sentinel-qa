# Etapa 5 — `ModuleCards` (`app/dashboard/module-cards.tsx`)

Depende de Etapa 1 (tokens `--apple-*`). Leer `00-contexto.md` primero.

## Objetivo

Aplicar la piel visual "glass" a las tarjetas del hub y reemplazar los SVG hand-rolled por `lucide-react`. **No tocar** el array `MODULES` (labels, `sub`, `href`, `size`, `status`, `stats` de cada módulo se mantienen exactamente iguales) ni la composición del grid (los 2 módulos `size: 'large'` siguen ocupando la fila completa) — la skill de diseño ya valida esta composición como un bento real (N items → N cells, jerarquía por tamaño), no hace falta rediseñar el layout, solo su piel.

## Cambios en `app/dashboard/module-cards.tsx`

### 1. Reemplazar iconos hand-rolled por `lucide-react`

```tsx
import { Shield, AlertTriangle, BarChart3, BookOpen, Settings, Camera } from 'lucide-react'
```

Quitar las 6 funciones `ShieldIcon/AlertIcon/ChartIcon/BookIcon/SettingsIcon/CameraIcon` (líneas 16-21) y sus usos en `MODULES` (`icon: <ShieldIcon />` → `icon: <Shield size={24} strokeWidth={1.5} />`, y análogo para el resto: `AlertIcon→AlertTriangle`, `ChartIcon→BarChart3`, `BookIcon→BookOpen`, `SettingsIcon→Settings`, `CameraIcon→Camera`). Mismo `size={24}` que tenían los SVG originales (`width="24" height="24"`), `strokeWidth={1.5}` (los originales usaban `strokeWidth="1.5"`).

### 2. `sharedStyle` de la card — glass en vez de flat

Reemplazar el objeto `sharedStyle` (líneas 273-288):

```tsx
const sharedStyle: React.CSSProperties = {
  background: isBuilding
    ? 'rgba(241, 245, 249, 0.6)'
    : (hover ? 'rgba(255,255,255,0.85)' : 'var(--apple-glass-bg)'),
  backdropFilter: 'blur(20px) saturate(180%)',
  border: `1px solid ${hover ? 'rgba(31, 53, 90, 0.25)' : 'var(--apple-glass-border)'}`,
  padding: '24px',
  position: 'relative',
  cursor: href ? 'pointer' : 'default',
  transition: 'all 0.3s ease-out',
  boxShadow: hover ? 'var(--apple-shadow-glass-hover)' : 'var(--apple-shadow-glass)',
  transform: hover && href ? 'translateY(-2px)' : 'translateY(0)',
  textDecoration: 'none',
  gridColumn: isLarge ? '1 / -1' : 'auto',
  minHeight: isLarge ? '220px' : '160px',
  overflow: 'hidden',
  borderRadius: 'var(--radius-xl)',
}
```

Quitar las 2 "Decorative top bar" (`<div>` con barras de 2px que crecen al hover, líneas 109-127) y el `glowStyle` con `radial-gradient` — son detalle táctico. El feedback de hover ya lo da `translateY` + sombra + borde, no hace falta el glow radial adicional.

### 3. Tipografía del contenido

- Título `label` (línea ~177-187): `fontFamily: 'Barlow Condensed,sans-serif'`, `textTransform: 'uppercase'` → `fontFamily: 'var(--apple-font-display)'`, `fontWeight: 600`, `textTransform: 'none'`. Mantener `fontSize: isLarge ? 36 : 26` (la jerarquía de tamaño por `isLarge` no cambia).
- `sub` (línea ~219-229): quitar `fontFamily: 'JetBrains Mono,monospace'`, `letterSpacing: '0.08em'`, `textTransform: 'uppercase'` → `var(--apple-font-display)`, sentence-case (el texto ya está en sentence-case en `MODULES`, ej. `'Atención a víctimas · Jurídico'`).
- Contadores (`stat.value`/`stat.label`, líneas ~198-211): mismo criterio — quitar mono/uppercase del label, dejar el `value` grande como está (es un número, no necesita cambiar de familia tipográfica, pero sí puede pasar a `var(--apple-font-display)` para consistencia).
- Badge "ACCEDER" / "EN CONSTRUCCIÓN" (líneas ~251-268): `'ACCEDER'` → `'Acceder'`, `'EN CONSTRUCCIÓN'` → `'En construcción'`, quitar mono/uppercase/letterSpacing.

### 4. Estado `building` — quitar overlays tácticos

Eliminar el bloque `{isBuilding && (<>...</>)}` con `.mc-grid` (blueprint pulsante) y `.mc-scan` (línea de escaneo), líneas 90-107. Eliminar también el badge `EN DESARROLLO` con `.mc-ping`/`.mc-blink` (líneas 155-170) y reemplazarlo por uno estático y calmado:

```tsx
{isBuilding && (
  <div style={{
    display: 'flex', alignItems: 'center', gap: 6,
    fontFamily: 'var(--apple-font-display)', fontSize: 12, fontWeight: 500,
    color: '#64748b', border: '1px solid var(--apple-glass-border)',
    borderRadius: 'var(--radius-full)', padding: '4px 12px',
    background: 'rgba(255,255,255,0.5)',
  }}>
    En desarrollo
  </div>
)}
```

Barra de progreso indeterminada (`.mc-progress`, líneas 244-249): puede quedarse tal cual (es información real de estado, no decoración táctica) pero cambiar su color de `linear-gradient(90deg, transparent, #3e5171 40%, #1f355a 60%, transparent)` a algo más suave: `linear-gradient(90deg, transparent, rgba(31,53,90,0.4) 40%, rgba(31,53,90,0.6) 60%, transparent)`.

Badge "ONLINE" (líneas 140-153): mantener el punto verde + texto, pero quitar `fontFamily: 'JetBrains Mono, monospace'` + `letterSpacing: '0.1em'` → `var(--apple-font-display)`, texto `'En línea'` en vez de `'ONLINE'`.

### 5. `<style>` inline del componente (líneas 335-351)

Quitar los `@keyframes mc-scan/mc-gridpulse/mc-progress` (ya no se usan tras el punto 4) y `.mc-scan/.mc-grid` (ya no se usan). Mantener `@keyframes mc-progress` si se conserva la barra de progreso del punto 4 (solo cambia el color, no la animación), y `mc-blink` puede quedarse si se usa en algún punto restante — si no queda ningún uso, eliminarlo también.

## Criterios de aceptación

1. `npx tsc --noEmit` sin errores (verificar en particular que los imports de `lucide-react` resuelven — ya es dependencia del proyecto).
2. `npm run build` sin errores.
3. Verificación manual: los 6 módulos (`prevencion`, `monitorista`, `incidentes`, `reportes`, `catalogos`, `admin`) se ven con la misma composición de grid (2 grandes arriba, resto en 2 columnas), mismos `href` funcionando (click navega correctamente), estado `building` visible sin animaciones parpadeantes, hover con elevación suave.
4. Ningún módulo perdió su `stats`, `status`, ni cambió de `size`.
5. Responsive: grid de `ModuleCards` (definido en `app/dashboard/page.tsx`, no en este archivo) no se tocó, sigue funcionando en los 3 breakpoints.

Al terminar esta etapa, correr el checklist general de `README.md` (build completo + verificación manual de las 2 pantallas completas + sanity check de otras páginas + ADR en la bóveda).
