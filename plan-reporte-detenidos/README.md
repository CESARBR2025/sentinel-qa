# Plan: Reporte de Detenidos movido de Monitorista a Agente Reportes

Carpeta de trabajo para trasladar la generación del reporte PPT de detenidos desde el módulo Monitorista hacia el hub `/agente_reportes`, como una card de solo lectura ("listar + generar PPT"), agrupado en 3 hojas (diario/semanal/mensual). Diseñado por Claude (arquitecto), a construir por DeepSeek (worker).

## Orden de trabajo

Las etapas son **secuenciales**. No avanzar a la siguiente sin validar los "Criterios de aceptación" de la anterior. Cada `etapa-N.md` es autocontenida: se puede pegar tal cual como instrucción de trabajo sin necesitar leer las demás (aunque todas parten del mismo contexto en `00-contexto.md`).

1. [00-contexto.md](00-contexto.md) — leer primero, siempre. Contexto del problema, decisiones ya tomadas con el usuario, y la alternativa técnica elegida.
2. [etapa-1.md](etapa-1.md) — Permisos: nueva sección `reporte_detenidos` (wrapper, registro de admin, mapa de rutas del proxy).
3. [etapa-2.md](etapa-2.md) — Módulo de datos de solo lectura: `lib/reporte-detenidos/types.ts` + `repository.ts` (consulta detenidos con las 3 fotos completadas).
4. [etapa-3.md](etapa-3.md) — Generador de PPT agrupado: `lib/reporte-detenidos/ppt-service.ts` (3 hojas: diario/semanal/mensual, en un solo archivo).
5. [etapa-4.md](etapa-4.md) — API: `app/api/reporte-detenidos/generar-ppt/route.ts`.
6. [etapa-5.md](etapa-5.md) — Página `app/reporte-detenidos/page.tsx` + botón `components/reporte-detenidos/BotonGenerarPpt.tsx`.
7. [etapa-6.md](etapa-6.md) — Card nueva en `/agente_reportes` (`app/agente_reportes/page.tsx`).
8. [etapa-7.md](etapa-7.md) — Retirar la generación de PPT de Monitorista (botón, API vieja, `ppt-service.ts` viejo, copy de la card del hub).
9. [etapa-8.md](etapa-8.md) — Bóveda: documentar el módulo nuevo, actualizar `Index.md` y `Decisiones.md`.

## Reglas para quien construye (DeepSeek)

- No combinar etapas ni adelantar trabajo de una etapa posterior "porque ya se está ahí". El propósito de segmentar es poder revisar y detener el trabajo en cualquier punto con una superficie de cambio pequeña y clara.
- No tocar archivos fuera de los listados explícitamente en cada etapa.
- Al terminar cada etapa, correr `npx tsc --noEmit` como mínimo, y los criterios de aceptación específicos de esa etapa, antes de reportar la etapa como lista. **Detenerse y esperar confirmación del usuario antes de pasar a la siguiente etapa.**
- Si algo en el código real no coincide con lo descrito aquí (nombres de archivo, líneas, props), priorizar el código real y ajustar la implementación al mismo patrón — este plan describe el estado del código al momento de diseñarlo (2026-08-04), puede haber cambiado.
- Reutilizar patrones ya existentes en el proyecto (ver referencias de archivo en cada etapa) — no inventar convenciones nuevas de UI, permisos o capas de datos.

## Fuera de alcance (no implementar salvo pedido explícito)

- `app/monitorista/detenidos/nueva/page.tsx` está roto hoy (hace POST a un endpoint `/api/monitorista/detenidos` que no existe). No se toca en este plan.
- Componentes muertos `components/monitorista/TablaDetenidos.tsx` y `AccionesDetenido.tsx` — no se tocan.
- No se cambia quién edita delito/falta administrativa/modus operandi (sigue siendo Monitorista, vía `/monitorista/detenidos/[id]`) ni el flujo de solicitud de fotos a Fiscalía/Juzgado — ambos se mantienen intactos.
- No se corrige el bug conocido de `parseDetenidos()` (solo muestra el primer nombre en reportes con varios detenidos) — se replica el mismo comportamiento actual por consistencia, no se arregla en este plan.
- No se agrega columna `fecha_evento` a `ofi_reportes_campo` — el agrupamiento diario/semanal/mensual usa `created_at` del reporte como proxy (no existe otra fecha en el esquema actual).

## Checklist general al terminar TODAS las etapas

1. `npx tsc --noEmit` y `npm run build` sin errores.
2. `npx graphify update` (regla del proyecto, ver `AGENTS.md` en la raíz del repo).
3. Confirmar en `/admin/roles` que el rol `Reportante` (o el rol que corresponda) tiene la plantilla de permiso `reporte_detenidos` asignada — si no, la card nueva no aparecerá aunque el código esté listo (no hay seed automático en este proyecto, se asigna vía UI de admin).
4. Actualizar bóveda (ver Etapa 8).
5. Prueba manual end-to-end en navegador (la hace el usuario, no el agente): la card nueva aparece en `/agente_reportes`, la tabla en `/reporte-detenidos` solo lista detenidos con las 3 fotos completadas, el botón genera un `.pptx` con 3 secciones (diario/semanal/mensual) descargable, y `/monitorista/detenidos` sigue funcionando para revisar/aprobar fotos pero ya sin el botón de generar PPT.
