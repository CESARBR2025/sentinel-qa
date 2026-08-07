# Etapa 7 — Admin: `admin-transito/*` (auditar) + `admin/roles/agregar` (caso especial)

Depende de Etapa 1. Independiente del resto. Leer `00-contexto.md` (Grupo A y "Grupo especial") primero. Última etapa del plan — al cerrarla, correr el checklist general de `README.md`.

## Parte 1 — Auditoría: `admin-transito/page.tsx` + `admin-transito/oficiales/page.tsx`

Estas dos heredan la cadena flex de `app/admin-transito/layout.tsx` (root `<div style={{minHeight:'100vh', display:'flex', flexDirection:'column', ...}}>{children}</div>`) y cada página usa `<main className="pad-pagina" style={{flex:1, display:'flex', flexDirection:'column'}}>`. Confirmar contra el código real que esto sigue así y que `<DashboardFooter />` queda dentro de ese `<main>`. Si está correcto, no tocar.

## Parte 2 — Cuidado especial: `app/admin/roles/agregar/page.tsx`

Este archivo es distinto a todos los demás del plan: root es un `<main>` (no un `<div>`) con solo `minHeight:"100vh"`, sin cadena flex, y la página completa sigue en el lenguaje visual anterior — `<style dangerouslySetInnerHTML>` con `@import` de Google Fonts (JetBrains Mono + Barlow Condensed), sin `DashboardHeader` (usa un `Link` con ícono `ArrowLeft` como "volver" en vez del patrón de header del sistema), y un div interno con `maxWidth: "1200px"` inline.

**El fix de esta etapa es SOLO el posicionamiento del footer**, nada más:
1. Agregar `display: "flex", flexDirection: "column"` al `<main>` root (junto al `minHeight: "100vh"` que ya tiene).
2. Al div interno que ya existe (el de `maxWidth: "1200px", display:"flex", flexDirection:"column", gap:"32px"`) agregarle `flex: 1` — es el candidato natural a wrapper de contenido, ya envuelve todo antes del footer.
3. No tocar nada más: no quitar el `<style>` de fuentes, no agregar `DashboardHeader`, no quitar el `maxWidth`, no tocar el botón de volver con `ArrowLeft`.

Anotar explícitamente en el reporte de esta etapa que esta página quedó con deuda pendiente fuera de alcance (fuentes muertas, sin header del sistema, `maxWidth` fijo) — no resolverla, solo dejarla anotada para un plan futuro.

## Qué no tocar

- Todo lo enumerado arriba como fuera de alcance en `admin/roles/agregar/page.tsx`.
- Lógica de negocio, permisos (`tienePermiso`), auth/redirect.

## Criterios de aceptación

1. `npx tsc --noEmit` sin errores.
2. Verificación manual de las 3 páginas: footer pegado al fondo con contenido corto en las 3, flujo normal con contenido largo.
3. Reportar explícitamente la deuda pendiente anotada en `admin/roles/agregar/page.tsx`.

## Al cerrar esta etapa (última del plan) — checklist general

Ver `README.md` sección "Checklist general al terminar TODAS las etapas": `npm run build`, `npm run check:responsive`, verificación en 3 breakpoints de una página por grupo, ADR en `boveda/🏗 Arquitectura/Decisiones.md`, y actualizar `DESIGN.md §4`/`§10`.
