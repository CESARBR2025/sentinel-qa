# Plan: Formato Reportes de Incidencias (UDAI)

Carpeta de trabajo para construir la nueva vista `/formatos-udai` → card **"Formato Reportes de Incidencias"** → `/formatos-udai/reportes-incidencias`: tabla de solo lectura (2 segmentos: Incidencia / Puestas a Disposición) + exportación a `.xlsx` que replica **exactamente** el archivo oficial `FORMATO INCIDENCIA.xlsx` (2 hojas, 38 y 52 columnas), alimentada con datos que **ya existen** en la tabla `iph_detenidos`. Diseñado por Claude (arquitecto) tras analizar el `.xlsx` oficial y verificar el modelo de datos **contra la BD real de producción por conexión directa** (`pg` + `DATABASE_URL`, no solo documentación). A construir por DeepSeek (worker).

Es la continuación directa de `plan-formato-faltasadministrativas/` (ya implementado, ver `lib/formatos-udai/`, `app/formatos-udai/`, `app/api/formatos-udai/`, `components/formatos-udai/`) — este plan **reutiliza ese mismo módulo**, no crea uno nuevo.

## Hallazgo que cambia el alcance

Igual que con Faltas Administrativas: no hay que capturar nada nuevo, `iph_detenidos` ya tiene columnas dedicadas para casi todo este formato (fue diseñada pensando en ambos Excel). La diferencia real con el plan anterior es que aquí se descubrió que **8 columnas existen en el esquema y en el `INSERT` de `registrarIphDetenido()`, pero ningún formulario las llena nunca** (`folio_911`, `dia_evento`, `hora_inicio_evento`, `hora_final_evento`, `hora_promedio`, `modus_operandi`, `telefono_afectado`, `ap_nuc` — 0/10 registros con dato). Se documentan como "columnas fantasma", distintas de un GAP real de esquema. Ver el detalle completo, con la tabla de columna-por-columna de ambas hojas, en `00-contexto.md`.

## Orden de trabajo

Las etapas son **secuenciales**. No avanzar a la siguiente sin validar los "Criterios de aceptación" de la anterior. Cada `etapa-N.md` es autocontenida (aunque todas parten del mismo contexto en `00-contexto.md`).

1. [00-contexto.md](00-contexto.md) — leer primero, siempre. Mapa completo de las 38 + 52 columnas contra la BD real, decisiones de diseño que requieren confirmación, y qué queda fuera de alcance.
2. [etapa-1.md](etapa-1.md) — Capa de datos: agregar `ReporteIncidenciaRow`/`PuestaDisposicionRow` a `lib/formatos-udai/types.ts` y 4 funciones nuevas a `lib/formatos-udai/repository.ts` (sin tocar lo existente de Faltas Administrativas).
3. [etapa-2.md](etapa-2.md) — Navegación: agregar la card "Formato Reportes de Incidencias" al hub `/formatos-udai` ya existente.
4. [etapa-3.md](etapa-3.md) — Vista de tabla `/formatos-udai/reportes-incidencias` con `SegmentPage` (2 tabs vía `?tab=`) y 2 modales de detalle.
5. [etapa-4.md](etapa-4.md) — Exportación `.xlsx` con **2 hojas** en una sola descarga (`GET /api/formatos-udai/reportes-incidencias/exportar`), idénticas al oficial.
6. [etapa-5.md](etapa-5.md) — Bóveda (ampliar `🧩 Features/Formatos UDAI.md`, no crear archivo nuevo) + verificación final (typecheck, build, graphify).

## Decisiones pendientes de confirmación (ver `00-contexto.md` para el detalle)

Si el usuario no responde antes de construir, DeepSeek sigue los defaults documentados en `00-contexto.md` y avanza sin bloquearse:

1. `NUC / CU` → `da.curp` (default) — ¿correcto, o hay otra fuente?
2. `LATITUD2`/`LONGITUD3` → `latitud_hecho`/`longitud_hecho` (default, hoy siempre `NULL`) — ¿correcto?
3. 1 archivo con 2 hojas en la exportación (default) vs. 2 exportaciones separadas — ¿confirmado?
4. `MASC`/`UMECAS` — sin fuente en BD, quedan vacíos. Si el usuario sabe qué representan, decirlo (podría abrir una fuente real a futuro).

## Reglas para quien construye (DeepSeek)

- No combinar etapas ni adelantar trabajo de una etapa posterior "porque ya se está ahí".
- No tocar archivos fuera de los listados explícitamente en cada etapa — en particular, **no modificar** nada de lo ya construido para Faltas Administrativas (`FaltaAdministrativaRow`, `rowToFaltaAdministrativa`, `SELECT_BASE`, `listarFaltasAdministrativas*`, `app/formatos-udai/faltas-administrativas/*`, `app/api/formatos-udai/faltas-administrativas/*`) salvo el único cambio opcional señalado en la Etapa 3 (generalizar `BotonExportarExcel` con props).
- Al terminar cada etapa, correr `npx tsc --noEmit` como mínimo, y los criterios de aceptación específicos de esa etapa, antes de reportar la etapa como lista. **Detenerse y esperar confirmación del usuario antes de pasar a la siguiente etapa.**
- Si algo en el código real no coincide con lo descrito aquí (nombres de archivo, líneas, props, tipo real de una columna), priorizar el código real y ajustar la implementación al mismo patrón — este plan describe el estado del código al momento de diseñarlo (2026-08-05).
- Reutilizar patrones ya existentes en el proyecto (`SegmentPage`, `PageHeader`, `OptionSquare`, el patrón de `DetalleFaltaAdministrativaModal.tsx`, el JOIN de `SELECT_BASE` en `lib/formatos-udai/repository.ts`) — no inventar convenciones nuevas de UI, permisos o capas de datos.
- Antes de tocar cualquier UI, leer `DESIGN.md` completo (regla del proyecto).
- Los encabezados del Excel exportado se copian carácter por carácter del archivo oficial (acentos, `/`, `_`, espacios) — no "corregirlos".

## Fuera de alcance (no implementar salvo pedido explícito)

- Tocar `formAnalisis.tsx` / `useAnalistaForm.ts` para capturar las 8 columnas "fantasma" — ver nota en `etapa-5.md` sobre dejarlo anotado en `Pendientes.md`, no implementarlo aquí.
- Agregar columnas nuevas a `iph_detenidos` para `OTRO DELITO`, `MASC`, `UMECAS`, `FECHA DE INGRESO`/`FECHA DE SALIDA` — cambio de esquema fuera de alcance.
- Construir captura nueva para `ofi_puesta_disposicion` (hoy 1 sola fila en producción) — módulo hermano, no se toca.
- Registrar una sección de permisos nueva — se reusa `formatos_udai` tal cual.
- Tocar `/formatos-udai/faltas-administrativas`, `/reporte-detenidos` o `/analisis/iph`.

## Checklist general al terminar TODAS las etapas

Ver la sección final de `00-contexto.md` y los criterios de aceptación de `etapa-5.md`.

---

## Prompt para DeepSeek

Ver [PROMPT-DEEPSEEK.md](PROMPT-DEEPSEEK.md) — pégalo tal cual como primer mensaje.
