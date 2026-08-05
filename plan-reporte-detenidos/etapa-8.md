# Etapa 8 — Bóveda: documentar el módulo nuevo

## Contexto (resumen — ver `00-contexto.md`)

Última etapa del plan. Requiere las Etapas 1-7 ya construidas y verificadas end-to-end. Es el paso de documentación exigido por el checklist T2 de `AGENTS.md` para feature nueva/refactor real.

## Objetivo

Que la bóveda del proyecto (`boveda*/`) refleje el módulo nuevo y la decisión de mover el reporte de Monitorista a Agente Reportes.

## Archivos a tocar (dentro de la carpeta `boveda-*` o `boveda` real en la raíz del repo — confirmar el nombre exacto antes de editar)

### 1. `boveda/🧩 Features/Reporte de Detenidos.md` (archivo nuevo)

Usar `Feature Example.md` como plantilla. Debe cubrir:
- Qué hace: tabla de detenidos con las 3 fotos completadas + botón para generar PPT con 3 secciones (diario/semanal/mensual).
- Quién lo usa: rol `Reportante`, hub `/agente_reportes`, permiso `reporte_detenidos`.
- De dónde saca los datos: `ofi_reportes_campo` + `solicitud_fotos` (filtro: 3 fotos en `completado`) + `evidencias_detenido` (fotos).
- Relación con Monitorista: los datos se completan en `/monitorista/detenidos` (bandeja de revisión/aprobación, que sigue existiendo); este módulo solo lee y reporta.
- Archivos clave: `lib/reporte-detenidos/*`, `app/reporte-detenidos/page.tsx`, `app/api/reporte-detenidos/generar-ppt/route.ts`.

### 2. `boveda/🧩 Features/Index.md`

Agregar la entrada del nuevo módulo "Reporte de Detenidos" en la lista de módulos documentados.

### 3. `boveda/🧩 Features/Monitorista.md` (si existe con contenido, no placeholder)

Actualizar la sección de "Detenidos" para reflejar que la generación de PPT ya no vive ahí — solo queda la solicitud/revisión/aprobación de fotos y edición de campos.

### 4. `boveda/🏗 Arquitectura/Decisiones.md`

Agregar un ADR breve:

> **ADR: Separar generación de reporte de detenidos de la revisión de fotos**
> Contexto: Monitorista gestionaba tanto la revisión/aprobación de fotos de detenidos como la generación del reporte PPT consolidado. Decisión: la generación del reporte se traslada a `/agente_reportes` (rol Reportante) como módulo de solo lectura, porque no requiere verificar evidencia — solo consolidar datos ya validados (3 fotos completadas) en un documento periódico. Monitorista conserva la revisión/aprobación, que sí requiere su rol de verificación de evidencia audiovisual.

## Qué NO tocar en esta etapa

- No modificar código de ningún módulo — esta etapa es solo documentación.

## Criterios de aceptación

1. Los 4 archivos/entradas anteriores existen y describen el estado real post-refactor (no placeholder "Pendiente de documentar").
2. `npx graphify update` corrido al final para sincronizar el grafo con la bóveda (regla de `AGENTS.md`).
