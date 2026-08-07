# Etapa 3 — Auditoría + fix: Monitorista + Formatos UDAI + `agente_911/ciudadano` (9 archivos)

Depende de Etapa 1. No depende de la Etapa 2 (son módulos independientes), pero sigue el mismo procedimiento de auditoría — leer `00-contexto.md` (Grupo A) y el procedimiento descrito en `etapa-02.md` antes de empezar.

## Archivos

- `app/monitorista/page.tsx`
- `app/monitorista/detenidos/page.tsx`
- `app/monitorista/solicitudes/page.tsx`
- `app/formatos-udai/page.tsx`
- `app/formatos-udai/faltas-administrativas/page.tsx`
- `app/formatos-udai/reportes-incidencias/page.tsx`
- `app/agente_911/ciudadano/page.tsx`
- `app/agente_911/ciudadano/incidentes/page.tsx`
- `app/agente_911/ciudadano/revisar/page.tsx`

Mismo procedimiento que Etapa 2: confirmar root (`display:flex,flexDirection:column,minHeight:100vh`) + `flex:1` en el wrapper de contenido antes del `<DashboardFooter />`; fix mínimo si falta, no tocar si ya está correcto.

## Qué no tocar

- Lógica de negocio, fetch, auth/redirect de cada página.

## Criterios de aceptación

1. `npx tsc --noEmit` sin errores.
2. Verificación manual de al menos 2 de los 9 (uno por módulo distinto, ej. `monitorista/page.tsx` y `agente_911/ciudadano/page.tsx`).
3. Reportar cuáles de los 9 ya estaban correctos y cuáles necesitaron fix.

Detenerse aquí y esperar confirmación antes de pasar a Etapa 4.
