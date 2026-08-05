# Contexto completo

## Problema que resuelve

La card "Reporte de Detenidos" en `/monitorista` (`app/monitorista/page.tsx:61-75`) enlaza hoy a `/monitorista/detenidos`, una bandeja completa de **revisión y aprobación** de fotos de detenidos (solicitar a Fiscalía/Juzgado, aprobar/rechazar, editar delito/falta administrativa/modus operandi) que además tiene un botón "Generar PPT".

El usuario (dueño del producto, actúa como Senior Architect en este proyecto) determinó que **generar el reporte no debe ser tarea de Monitorista** — ese personal solo revisa cámaras, no debería tener que "verificar fotos de infractores". La funcionalidad de reporte debe vivir en el hub `/agente_reportes` (rol `Reportante`), como una card de solo lectura: **tabla de detenidos + botón "Generar PPT"**, sin ningún paso de aprobación/verificación.

## Decisiones ya tomadas con el usuario (no reabrir estas preguntas)

1. **Dueño de la funcionalidad**: hub `/agente_reportes`, rol `Reportante`. No Fiscalía, no Juzgado, no Análisis.
2. **Alcance del nuevo módulo**: nada de verificación de fotos. Solo tabla de reportes + botón de generar PPT.
3. **Filtro de qué aparece en la tabla**: únicamente detenidos cuyas **3 fotos (frontal/derecho/izquierdo) ya están cargadas y en estado `completado`** por Fiscalía/Juzgado. Registros incompletos no aparecen aquí — siguen viéndose solo en la bandeja de Monitorista mientras se completan.
4. **Estructura del PPT**: **un solo archivo `.pptx`** con 3 hojas/secciones generadas siempre juntas — diario (hoy), semanal (semana actual) y mensual (mes actual) — no un selector de periodo.
5. **Delitos/falta administrativa/modus operandi**: siguen siendo editados donde ya se editan hoy (Monitorista, pantalla de detalle `/monitorista/detenidos/[id]`, componente `EditarCampoDetenido`). El nuevo módulo solo **lee** esos valores, no los solicita ni los edita.
6. **La bandeja de Monitorista se mantiene** (`/monitorista/detenidos/*`, solicitar fotos, aprobar/rechazar, editar campos) — es el flujo que hace que los datos lleguen a estado "completo". Solo se le retira la generación del PPT, que pasa a ser exclusiva del nuevo módulo.

## Alternativa técnica elegida y por qué

- **Se traslada y adapta la lógica de `lib/monitorista/ppt-service.ts` (pptxgenjs)**, no se reescribe desde cero — es el único generador PPT de detenidos multi-registro en todo el proyecto (confirmado por exploración exhaustiva: ningún otro módulo tiene este patrón). El layout de cada slide de detenido (tabla de datos + hasta 3 fotos con aspect ratio calculado) se reutiliza tal cual.
- **Se crea un módulo nuevo `lib/reporte-detenidos/`** (capas `types.ts` / `repository.ts` / `ppt-service.ts`) en vez de extender `lib/monitorista/` — mantiene el patrón de capas por dominio ya usado en el proyecto (`lib/<modulo>/types.ts|repository.ts|service.ts|actions.ts`, ver `AGENTS.md`) y evita acoplar un módulo de solo lectura al módulo de gestión de Monitorista.
- **Se sigue el patrón de permisos por módulo** (`lib/<modulo>/permisos.ts` como wrapper tipado sobre `lib/permisos/core.ts`, igual que `lib/monitorista/permisos.ts` o `lib/reportes/permisos.ts`) en vez de hardcodear checks sueltos.
- **La página nueva es un módulo top-level** (`app/reporte-detenidos/page.tsx`), NO una subruta de `/agente_reportes` — así funciona cada card del hub hoy (`/d1`, `/nCoordinacion`, `/estadisticos`, etc., ninguna vive dentro de `app/agente_reportes/`). Incluye `<PageHeaderLink href="/agente_reportes" variant="secondary">← Panel de Reportes</PageHeaderLink>` como primer botón de acción, igual que todas las demás.
- **No existe columna de "fecha del evento"** en `ofi_reportes_campo` — solo `created_at`. Se usa como proxy para los 3 rangos (diario/semanal/mensual), igual que ya lo hace el query actual de Monitorista (`ORDER BY rc.created_at`).

## Archivos de referencia (código real, leído completo antes de diseñar este plan)

- `lib/monitorista/ppt-service.ts` — generador PPT actual (pptxgenjs), se adapta.
- `app/api/monitorista/detenidos/generar-ppt/route.ts` — API vieja, patrón de respuesta binaria a replicar.
- `components/monitorista/BotonGenerarPpt.tsx` — botón viejo con filtros (el nuevo es más simple, sin filtros).
- `lib/monitorista/permisos.ts` — wrapper de permisos por módulo, patrón a replicar.
- `lib/reportes/permisos.ts` — wrapper más simple (una sola sección), patrón más cercano al que necesita `reporte_detenidos`.
- `lib/permisos/registro.ts` (líneas 48-57, bloque `Reportante`) — dónde se registra la sección nueva para que aparezca en `/admin/roles/[id]/plantilla-permisos`.
- `lib/permisos/mapa-secciones.ts` (líneas 38-67 y 70-78) — gate grueso del proxy por prefijo de ruta.
- `app/agente_reportes/page.tsx` — hub destino, patrón de secciones/cards con `OptionSquare`.
- `app/d1/page.tsx` — ejemplo de página top-level enlazada desde el hub, con permiso + `PageHeaderLink` de regreso.
- `app/monitorista/detenidos/page.tsx` y `app/monitorista/page.tsx` — módulo del que se retira la generación de PPT.

## Modelo de datos (confirmado contra el esquema real)

- `ofi_reportes_campo`: `folio_reporte_campo` (folio, autogenerado), `ofi_detenidos` (jsonb, nombre), `ofi_tipo_incidente` (evento), `delito`, `falta_administrativa`, `modus_operandi`, `marco_legal`, `created_at`.
- `ofi_reporte_denuncia`: `delito`, `marco_legal` — fallback cuando el reporte de campo no los tiene (JOIN existente, se mantiene).
- `solicitud_fotos`: `reporte_campo_id`, `tipo_foto` (frontal/derecho/izquierdo), `estado` (`pendiente`/`enviado`/`rechazado`/`completado`). Un detenido "listo para reporte" es aquel con exactamente 3 filas en `completado`.
- `evidencias_detenido`: `reporte_campo_id`, `tipo_foto`, `url_archivo` — de aquí se descargan las fotos para el PPT (vía `lib/expediente/v2/client.ts`).
