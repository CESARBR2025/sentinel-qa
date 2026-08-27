# Etapa 1 — Detener la pérdida de datos activa (bug crítico)

## Problema

[lib/n-coordinacion/actions.ts](../lib/n-coordinacion/actions.ts) (`guardarDatosCoordinacion`)
llama a `upsertFge`/`upsertFgr` ([lib/n-coordinacion/repository.ts](../lib/n-coordinacion/repository.ts))
pasando `num(formData, 'fge_carpetas')`, `'fge_cateos'`, `'fge_vehiculos'`, `'fge_personas'`
(y los 4 equivalentes `fgr_*`). Esos campos **no existen** en el formulario de
[app/nCoordinacion/page.tsx](../app/nCoordinacion/page.tsx) — los inputs "automáticos"
correspondientes son `disabled` y no tienen atributo `name`. `formData.get(...)`
siempre devuelve `null` → `num()` siempre devuelve `0`.

`upsertFge`/`upsertFgr` hacen `INSERT ... ON CONFLICT (fecha) DO UPDATE SET`
incluyendo esas 4 columnas siempre. Resultado: **cada vez que alguien guarda
desde `/nCoordinacion`, `carpetas_iniciadas`, `numero_cateos`, `vehiculos_asegurados`
y `personas_aseguradas` se sobreescriben a `0`** en `formato_n_fge` y `formato_n_fgr`,
sin importar lo que se haya capturado antes desde `/formato-n-fge` o `/formato-n-fgr`.

Esta etapa es un parche quirúrgico para detener la pérdida de datos **ya**,
independiente de si el Flujo B se retira más adelante (Etapa 3) — mientras ese
trabajo no esté cerrado, la página sigue en producción y sigue pudiendo borrar
datos reales cada vez que alguien la usa.

## Cambio requerido

En `upsertFge` y `upsertFgr` ([lib/n-coordinacion/repository.ts](../lib/n-coordinacion/repository.ts)):
quitar `carpetas_iniciadas`, `numero_cateos`, `vehiculos_asegurados` y
`personas_aseguradas` de la cláusula `DO UPDATE SET` (que no se sobreescriban
nunca desde este flujo). En el `INSERT` (primera vez que se crea la fila para
esa fecha), estas 4 columnas pueden seguir insertándose con el valor recibido
(`data.carpetas ?? 0`, etc.) porque en un `INSERT` nuevo no hay nada que
preservar — pero como esos valores siempre llegan en `0` desde este formulario,
el resultado práctico es: fila nueva nace en `0` (correcto, es lo que hay hasta
que alguien capture con el flujo real), fila existente **nunca se pisa**.

No tocar `actualizarFge`/`actualizarFge` de
[lib/reportes/formato-n-fge-service.ts](../lib/reportes/formato-n-fge-service.ts) ni
`crearFge`/`crearFgr` — esos son del Flujo A y no tienen el bug (ahí si se
capturan y envían los 4 campos).

## Criterios de aceptación

1. **Reproducir el bug antes del fix** (para confirmar diagnóstico): en la base
   de desarrollo, insertar manualmente una fila de prueba en `formato_n_fge`
   con `carpetas_iniciadas = 5`. Cargar `/nCoordinacion?fecha=<esa fecha>`,
   sin tocar nada, dar clic en "GUARDAR DATOS". Confirmar que
   `carpetas_iniciadas` quedó en `0` — así se confirma el bug antes de tocar código.
2. Aplicar el cambio en `upsertFge`/`upsertFgr`.
3. Repetir el mismo paso 1: capturar `carpetas_iniciadas = 5` (vía UPDATE directo
   o vía `/formato-n-fge/nuevo` con "CALCULAR DE REPORTES"), luego guardar desde
   `/nCoordinacion` sin tocar los campos automáticos. Confirmar que
   `carpetas_iniciadas` **sigue siendo 5** después de guardar.
4. Confirmar que los campos manuales (`domicilios_cateados`, `aprehensiones`,
   `audiencias_iniciales`, `abreviados`, `audiencias_intermedias`) **sí** se
   siguen actualizando correctamente desde `/nCoordinacion` (no romper lo que
   sí funciona).
5. `npx tsc --noEmit` sin errores nuevos en los archivos tocados.
