# Etapa 4 — Auditoría + fix: páginas sueltas (5 archivos)

Depende de Etapa 1. Independiente de Etapas 2-3. Leer `00-contexto.md` (Grupo A) y el procedimiento de `etapa-02.md` antes de empezar.

## Archivos

- `app/agente_reportes/page.tsx`
- `app/envio-de-formatos/page.tsx`
- `app/reporte-detenidos/page.tsx`
- `app/analisis/page.tsx`
- `app/analisis/formulario-ingreso/page.tsx`

Mismo procedimiento de auditoría que Etapa 2: confirmar root + `flex:1` en el wrapper de contenido antes del `<DashboardFooter />`; fix mínimo si falta.

**Nota**: estas 5 páginas no comparten módulo entre sí, pero sí comparten el mismo estado en la auditoría de `00-contexto.md` (grep sugiere cadena flex completa) — por eso van en la misma etapa. `app/analisis/iph/page.tsx` y `app/analisis/pendiente-analisis/page.tsx` son del mismo módulo `analisis/` pero **no van aquí** — están en el Grupo B (Etapa 5), tienen el wrapper hack `marginTop:40` y necesitan fix real, no solo auditoría.

## Qué no tocar

- Lógica de negocio, fetch, auth/redirect de cada página.
- `app/analisis/iph/page.tsx`, `app/analisis/pendiente-analisis/page.tsx`, `app/analisis/generar-ppt/page.tsx` — van en etapas posteriores.

## Criterios de aceptación

1. `npx tsc --noEmit` sin errores.
2. Verificación manual de al menos 2 de las 5.
3. Reportar cuáles ya estaban correctas y cuáles necesitaron fix.

Detenerse aquí y esperar confirmación antes de pasar a Etapa 5.
