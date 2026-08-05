# Contexto: Precarga inteligente del D1 + fix botón "FINALIZAR REPORTE D1"

## Problema

El flujo real hoy es: oficial cierra un reporte de campo (`ofi_reportes_campo`) → si hay detención/quiere denuncia, se le manda a `/denuncia/nuevo?reporteCampoId=...` → `components/denuncias/FormularioD1.tsx` se precarga parcialmente vía `obtenerDatosParaD1` (`lib/oficial/service.ts:221`) → `obtenerReporteCampoParaD1` (`lib/oficial/repository.ts:570`).

Se detectaron y **confirmaron leyendo el código real** (no solo por inferencia) dos problemas:

### 1. Botón "FINALIZAR REPORTE D1" no funciona — causa raíz confirmada

`FormularioD1.tsx` es un solo `<form>` con los 4 "pasos" superpuestos vía `display: step === N ? ... : 'none'` (todos los inputs quedan **montados en el DOM siempre**, solo se ocultan visualmente). El campo `delito` (línea 376) tiene el atributo `required` y vive dentro del bloque del paso 3 (`display: step === 3 ? 'flex' : 'none'`).

Cuando el oficial llega al paso 4 sin haber tecleado `delito` (esto pasa siempre que no viene de un reporte de campo con `tipoIncidente`, o si lo borró), al pulsar "FINALIZAR REPORTE D1" (`type="submit"` solo en step 4) el navegador ejecuta la validación HTML5 nativa sobre **todo el formulario**, incluido el campo `delito`, que en ese momento está oculto (`display:none`). Un campo `required` inválido que no es "focusable" (por estar oculto) hace que el navegador **bloquee el submit sin disparar `onSubmit` y sin mostrar ningún error visible** — solo un warning en consola tipo `An invalid form control with name='delito' is not focusable`. Desde la UI esto se percibe exactamente como "el botón no hace nada".

Se descartaron como causa: `folioDenuncia` (siempre tiene valor, autogenerado + readOnly), `fechaReporte`/`horaReporte` (siempre tienen default del store `lib/denuncias/storeD1.ts`, nunca vacíos). `delito` es el único `required` que puede llegar vacío al paso 4.

### 2. Precarga incompleta — datos que el reporte de campo YA captura y se pierden

`ofi_reportes_campo` ya tiene columnas `delito`, `modus_operandi`, `ofi_hay_detencion`, `ofi_nombre_reportante`, `ofi_telefono_reportante` (confirmado en `lib/oficial/types.ts` y en la query de precarga de otro módulo, `lib/oficial/repository.ts::obtenerPrellenado`, usada por `/analisis/formulario-ingreso` — un módulo *distinto* al D1 real). También existe la tabla `ofi_detalles_asegurados` (nombre completo del/los detenido(s), llenada automáticamente al crear el reporte de campo).

Ninguno de estos datos llega hoy a `obtenerReporteCampoParaD1` (la query real que usa el D1), así que el oficial los vuelve a teclear a mano, o simplemente no hay campo para capturarlos.

**Bug adicional encontrado en la misma query** (`lib/oficial/repository.ts:570-594`): selecciona `rc.ofi_calle` y `rc.ofi_colonia` **sin alias**, pero el mapper (`rowToReporteCampoParaD1`, `lib/oficial/mapper.ts:145`) lee `row.calle`/`row.colonia` — nombres que la query nunca produce. Resultado: `calle`/`colonia` en `ReporteCampoParaD1` **siempre son `null`**. Hoy pasa desapercibido porque `app/denuncia/nuevo/page.tsx` prioriza `sp.calle`/`sp.colonia` (query params de la URL) sobre `reporteData?.calle`/`reporteData?.colonia`, así que hay un fallback que enmascara el bug — pero si algún día se navega sin esos query params, la ubicación del hecho quedaría vacía en el D1 aunque el reporte de campo sí la tenga.

### 3. Identidad del oficial resuelta por un query param que nunca llega

"Oficial ID", "CRP" (placa) y "Sector" dependen hoy de `searchParams.oficialId` — ningún enlace real del proyecto lo pasa (`app/oficial/despachos/page.tsx:207` solo manda `reporteCampoId`; `app/oficial/reportes/[id]/page.tsx:74,229` mandan `oficial=` con el **nombre**, no `oficialId=`). Resultado: esos tres campos **siempre llegan vacíos**, en cualquier flujo, con o sin reporte de campo vinculado.

Además, "Policía a Cargo/Toma la Denuncia/Firma D1/Ingresa CU" se prellenan con el oficial que **registró el reporte de campo** (`reporteData?.oficialNomina`, vía JOIN), no con el oficial de la **sesión activa** que está llenando el D1. El usuario pidió explícitamente que esos datos salgan del oficial de sesión — coincide con la convención ya usada en el resto del proyecto para el cierre de reporte de campo ("el oficial se resuelve por sesión, nunca a mano"). Ya existe `obtenerMiPerfil(userId)` (`lib/oficial/service.ts:88`) para esto, no hace falta código nuevo de acceso a datos.

### 4. IPH / Folio CU sin verificación de unicidad

`iph` y `folioCu` se generan hoy en el cliente con `Math.random()` (`FormularioD1.tsx:84-91`), sin validar contra la BD. `folioDenuncia`, en cambio, sí tiene el patrón correcto: `generarFolioDenunciaUnico()` en `app/api/reportes-d1/route.ts:24` reintenta hasta 10 veces contra `verificarFolioDenunciaUnico()` (`lib/d1/repository.ts:5`, `SELECT COUNT(*) FROM ofi_reporte_denuncia WHERE folio_denuncia = $1`).

## Decisiones ya tomadas con el usuario

1. **Precarga**: no solo conectar campos existentes — también agregar nuevos campos de solo lectura en el D1 para mostrar reportante y detenido(s) que ya capturó el reporte de campo.
2. **IPH/Folio CU**: aplicar el mismo patrón de generación + verificación única en servidor que ya tiene `folioDenuncia`.
3. **No se toca** `expediente_ci` — no hay evidencia clara de que mapee 1:1 a `folioCu` u otro campo del D1; se deja fuera para no adivinar un mapeo semánticamente incorrecto.

## Archivos ya identificados (mapa completo)

| Archivo | Rol en este plan |
|---|---|
| `components/denuncias/FormularioD1.tsx` | Formulario D1 real (NO confundir con `lib/monitorista/denuncia-service.ts` ni `app/monitorista/denuncias/[id]/page.tsx`, que son otro módulo — gestión de evidencias/solicitudes de denuncia por monitorista, sin relación con el alta del D1) |
| `lib/denuncias/storeD1.ts` | Store Zustand del stepper (step, coords, fecha/hora reporte) |
| `app/denuncia/nuevo/page.tsx` | Arma el objeto `prefill` desde `searchParams` + `obtenerDatosParaD1` |
| `lib/oficial/service.ts:221` | `obtenerDatosParaD1` → wrapper de `obtenerReporteCampoParaD1` |
| `lib/oficial/repository.ts:570` | `obtenerReporteCampoParaD1` — la query real de precarga (a ampliar) |
| `lib/oficial/types.ts:212` | `ReporteCampoParaD1` — tipo a ampliar |
| `lib/oficial/mapper.ts:145` | `rowToReporteCampoParaD1` — mapper a corregir/ampliar |
| `app/api/reportes-d1/route.ts` | POST que inserta el D1; genera `folioDenuncia` único (patrón a replicar en IPH/CU) |
| `lib/d1/repository.ts` | `verificarFolioDenunciaUnico`, `insertarReporteDenuncia` |
| `lib/d1/types.ts` | `ReporteD1` (tipo de salida, no el body de creación) |
| `lib/oficial/service.ts:88` | `obtenerMiPerfil(userId)` — ya existe, resuelve el oficial por sesión (usar para identidad del oficial en el D1) |
| `boveda/🧩 Features/Reporte Campo.md` | Doc del módulo, ya documenta el flujo D1 (sección "Campos 'quién' del D1") — actualizar al cerrar |

## Fuera de alcance (no implementar salvo pedido explícito)

- `lib/monitorista/denuncia-service.ts`, `app/monitorista/denuncias/[id]/page.tsx`, `app/api/monitorista/denuncias/**` — módulo distinto (evidencias/solicitudes), no tocar.
- `expediente_ci` como posible fuente de IPH/CU — no hay evidencia suficiente, no se mapea.
- Rediseño visual del formulario — este plan es funcional (precarga + fix de bug), no estético.
- Refactor del patrón "un solo form con 4 pasos vía display:none" a pasos desmontados — el fix del botón se resuelve quitando el `required` roto y agregando validación manual visible, sin rehacer la arquitectura del stepper.
