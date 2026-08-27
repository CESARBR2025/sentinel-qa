# Plan: corregir captura y generación de Formato N (FGE/FGR y flujo completo)

## Contexto

Este plan nace de una tarea distinta (automatizar el "Parte de Novedades" del C4,
formato 06:00→06:00). Al analizar de dónde saldría el dato "Puesta a disposición
FGR/FGE" para ese nuevo reporte, se descubrió que el sistema **ya tiene** un
módulo de captura diaria equivalente — Formato N a Coordinación — pero con bugs
de arquitectura que hacen que sus números no sean confiables. Antes de construir
nada nuevo sobre Formato N (o de reusar sus datos en otro reporte), hay que
dejarlo bien generado.

Este plan es exclusivamente sobre **Formato N** (su generación de documento y,
tras feedback del usuario durante la sesión, también su UX de captura
completa). El plan del Parte de Novedades del C4 se retoma después, en otra
carpeta.

## Diagnóstico (verificado contra código y base de datos real)

El sistema tiene **dos implementaciones paralelas** que escriben y leen las
mismas tablas (`formato_n_fge`, `formato_n_fgr`), con lógica de cálculo distinta
entre ellas:

### Flujo A — captura individual (`/formato-n-fge`, `/formato-n-fgr`)
- [app/formato-n-fge/nuevo/page.tsx](../app/formato-n-fge/nuevo/page.tsx): formulario con
  botón "CALCULAR DE REPORTES" que llama a
  `calcularConteosPorFecha` ([lib/reportes/formato-n-fge-service.ts:94](../lib/reportes/formato-n-fge-service.ts))
  para prellenar carpetas/cateos/vehículos/domicilios/personas/aprehensiones,
  editable antes de guardar. Bien diseñado: computa, el usuario revisa, guarda snapshot.
- [app/formato-n-fgr/nuevo/page.tsx](../app/formato-n-fgr/nuevo/page.tsx): **100% manual**,
  con banner explícito ya correcto: *"el sistema no distingue casos canalizados a
  Fiscalía Federal (solo existe catálogo de Fiscalía del Estado)"*. Este diseño
  ya es correcto y no debe tocarse en su lógica de negocio.
- Ambos guardan vía `crearFge`/`crearFgr` en sus respectivos `service.ts`.
- `/envio-de-formatos` (hub) enlaza a estas páginas individuales y a
  `/envio-de-formatos/consolidar` (vista de revisión por rango de fechas, con
  badges CAPTURADO/SIN CAPTURAR y links directos a capturar lo faltante).

### Flujo B — página consolidada (`/nCoordinacion`)
- [app/nCoordinacion/page.tsx](../app/nCoordinacion/page.tsx): un solo formulario con
  las 7 secciones (Eventos, FGE, FGR, RND, MASC, Víctimas, Observaciones).
- Los campos "automáticos" de FGE **y de FGR** se muestran `disabled`, sin
  atributo `name`, alimentados por `obtenerConteosDetenidos()`
  ([lib/n-coordinacion/repository.ts:19](../lib/n-coordinacion/repository.ts)) — una
  **segunda implementación de cálculo, distinta a `calcularConteosPorFecha`**,
  que filtra por `ofi_autoridad_recibe = 'FISCALIA' | 'FGR'`.
- El botón "GUARDAR DATOS" llama a `guardarDatosCoordinacion`
  ([lib/n-coordinacion/actions.ts](../lib/n-coordinacion/actions.ts)), que lee
  `formData.get('fge_carpetas')`, `'fge_cateos'`, `'fge_vehiculos'`,
  `'fge_personas'` (y los 4 equivalentes de FGR) — **campos que no existen en el
  formulario** (los inputs correspondientes no tienen `name`). Por lo tanto
  siempre valen `0`.

### Bugs confirmados

1. **Pérdida de datos activa.** Cada vez que alguien guarda desde `/nCoordinacion`,
   `upsertFge`/`upsertFgr` sobreescriben `carpetas_iniciadas`, `numero_cateos`,
   `vehiculos_asegurados` y `personas_aseguradas` con `0` en la base — sin
   importar lo que se haya capturado antes desde `/formato-n-fge`. Verificado
   leyendo `guardarDatosCoordinacion` línea por línea contra el JSX del form.
2. **Dos lógicas de cálculo distintas para el mismo dato.** `calcularConteosPorFecha`
   (Flujo A, usa `ofi_reporte_denuncia.fecha_reporte` + `lib/reportes-operativos`)
   vs. `obtenerConteosDetenidos` (Flujo B, usa `ofi_reportes_campo.ofi_autoridad_recibe`
   + flags `ofi_apoyo_cateos_fge/fgr`). Pueden dar números distintos para la
   misma fecha.
3. **FGR estructuralmente en cero en Flujo B.** `ofi_autoridad_recibe` nunca vale
   `'FGR'` en el sistema (confirmado contra la base real: solo existen `NULL` y
   `'FISCALIA'` — SSPM nunca entrega un detenido directo a FGR). El cálculo
   automático de FGR en `obtenerConteosDetenidos` da `0` siempre para 3 de sus 4
   campos, contradiciendo el criterio ya correcto de Flujo A (FGR = manual).
4. **El generador del Word usa la fuente equivocada — y no solo para FGE/FGR.**
   [app/api/nCoordinacion/generar/route.ts](../app/api/nCoordinacion/generar/route.ts)
   arma el `.docx` final llamando a `obtenerConteosDetenidos(fecha, 'FISCALIA'|'FGR')`
   en vivo (líneas 108-109), **ignorando** lo que el usuario capturó y guardó en
   `formato_n_fge`/`formato_n_fgr`. El documento final nunca refleja una
   captura manual corregida, y para FGR nunca refleja nada real.

   Al revisar el resto de secciones se confirmó **el mismo patrón repetido en
   Eventos, RND y Armas**: el generador usa `obtenerEventosDia`, `obtenerRND` y
   `obtenerArmasDia` ([lib/n-coordinacion/repository.ts](../lib/n-coordinacion/repository.ts)),
   que leen en vivo de `incidentes`, `iph_detenidos` y `ofi_reportes_campo`
   respectivamente — **tablas distintas** a las que usa Flujo A para capturar y
   guardar (`formato_n_eventos`, `formato_n_rnd`, `formato_n_armas_aseguradas`,
   confirmado leyendo `lib/reportes/formato-n-eventos-service.ts`,
   `formato-n-rnd-service.ts` y `formato-n-armas-aseguradas-service.ts`). Es
   decir: de las 7 secciones capturables, **solo MASC, Víctimas y Observaciones**
   usan en el generador el mismo dato que se capturó y guardó
   (vía `obtenerDatosCapturados`) — las otras 4 (Eventos, FGE, FGR, RND) y
   Armas recalculan en vivo con una fuente distinta. El generador y la pantalla
   de revisión (`/envio-de-formatos/consolidar`, que sí usa
   `obtenerFormatoNConsolidado` — la fuente correcta) hoy pueden mostrar
   números diferentes para el mismo día.

## Decisión de arquitectura (alcance definido con el usuario)

- **Fuente de verdad única:** las tablas `formato_n_fge` / `formato_n_fgr`,
  alimentadas **solo** por Flujo A (`/formato-n-fge`, `/formato-n-fgr`), que ya
  tiene el diseño correcto (cálculo asistido + edición para FGE, 100% manual
  para FGR).
- **FGE:** los 6 campos calculables (`carpetas_iniciadas`, `numero_cateos`,
  `vehiculos_asegurados`, `domicilios_cateados`, `personas_aseguradas`,
  `aprehensiones`) se calculan con `calcularConteosPorFecha`, se guardan como
  snapshot editable. `audiencias_iniciales`, `abreviados`, `audiencias_intermedias`
  siguen 100% manuales (no existen en ningún lado del sistema — etapas de
  juzgado que este sistema no registra).
- **FGR:** 100% manual, siempre. No se intenta automatizar nada — el caso de
  que FGE canalice algo a FGR no está mapeado en el sistema y **queda fuera de
  alcance** por ahora.
- **Flujo B (`/nCoordinacion` como formulario de captura) se retira.** Su
  función la cubre mejor `/envio-de-formatos`. El generador del Word se
  corrige para leer siempre los datos guardados (Etapa 2). El destino final
  del botón "Generar Word" lo define la Etapa 5 (rediseño de UX), no la
  Etapa 3.
- **UX de captura rediseñada (agregado tras feedback del usuario, ver Etapa 5).**
  Navegar por 7 páginas sueltas para llenar un solo reporte diario es
  confuso. Se reemplaza por: `/envio-de-formatos/consolidar` cargando el día
  de hoy por defecto y mostrando **una card por día** con estatus LISTO/PENDIENTE
  (no 7 badges por sección); al entrar a un día PENDIENTE se abre **un solo
  stepper** con un paso por sección, cada paso precalculado donde el sistema
  puede calcularlo; al terminar, descarga directa del `.docx` completo. Las 7
  páginas sueltas actuales (`/formato-n-fge`, `/formato-n-fgr`,
  `/formato-n-eventos`, `/formato-n-rnd`, `/formato-n-medios-alternativos`,
  `/formato-n-atencion-victimas`, `/formato-n-armas-aseguradas`) se retiran —
  el stepper reutiliza su lógica de cálculo, no la duplica.
- **Observaciones (sección G del documento) no tiene página propia hoy** —
  solo se captura desde `/nCoordinacion` (Flujo B, que se retira en la
  Etapa 3). El stepper de la Etapa 5 le da un hogar definitivo como su último
  paso; hasta que eso exista, la Etapa 3 debe conservar la función
  `upsertObservaciones` aunque retire la página que la usaba, para no perder
  esa capacidad de captura entre etapas.

## Etapas

| # | Etapa | Archivo |
|---|-------|---------|
| 1 | Detener la pérdida de datos activa (bug crítico) | [ETAPA-1.md](ETAPA-1.md) |
| 2 | Corregir el generador de Word para usar los datos guardados (todas las secciones) | [ETAPA-2.md](ETAPA-2.md) |
| 3 | Retirar el Flujo B (`/nCoordinacion`) | [ETAPA-3.md](ETAPA-3.md) |
| 4 | Actualizar navegación y limpiar código muerto | [ETAPA-4.md](ETAPA-4.md) |
| 5 | Rediseñar la captura: consolidado por día (LISTO/PENDIENTE) + stepper único | [ETAPA-5.md](ETAPA-5.md) |
| 6 | Verificación end-to-end completa | [ETAPA-6.md](ETAPA-6.md) |

Ejecutar en orden — cada etapa depende de que la anterior esté verificada.
El prompt completo para que DeepSeek ejecute las 6 etapas está en
[PROMPT-DEEPSEEK.md](PROMPT-DEEPSEEK.md).

## Fuera de alcance (explícito)

- El Parte de Novedades del C4 (documento original que motivó esta revisión) —
  se retoma en otra carpeta una vez cerrado este plan.
- Automatizar FGR — confirmado que no hay flujo real en el sistema para eso.
- Cambiar la **lógica de negocio** de cálculo de Flujo A (`calcularConteosPorFecha`,
  criterio FGE automático / FGR manual, etc.) — ya está correcta, no se toca.
  Lo que sí cambia es *dónde* vive esa lógica en la UI (Etapa 5: se mueve de
  7 páginas sueltas a pasos de un stepper), no *qué* calcula.
- Generar el `.docx` para un rango de varios días en un solo archivo — el
  generador sigue siendo por día (ver Etapa 2).
