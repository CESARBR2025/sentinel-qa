# Etapa 2 — Corregir el generador de Word para usar los datos guardados (todas las secciones)

## Problema

[app/api/nCoordinacion/generar/route.ts](../app/api/nCoordinacion/generar/route.ts)
arma el `.docx` final combinando datos de dos fuentes distintas para el mismo
día:

- `obtenerDatosCapturados(fecha)` ([lib/n-coordinacion/repository.ts](../lib/n-coordinacion/repository.ts)) —
  correcto, lee lo realmente guardado, pero solo se usa para MASC, Víctimas y
  Observaciones.
- `obtenerEventosDia`, `obtenerRND`, `obtenerArmasDia`, `obtenerConteosDetenidos`
  (mismo archivo) — leen **en vivo** de `incidentes`, `iph_detenidos` y
  `ofi_reportes_campo`, ignorando lo que el operador capturó y guardó vía
  Flujo A en `formato_n_eventos`, `formato_n_fge`, `formato_n_fgr`,
  `formato_n_rnd` y `formato_n_armas_aseguradas`.

Ver diagnóstico completo con líneas exactas en el [README](README.md).

`/envio-de-formatos/consolidar` ya arma esta misma información correctamente,
leyendo con `obtenerFormatoNConsolidado(fecha)`
([lib/reportes/formato-n-consolidado-service.ts](../lib/reportes/formato-n-consolidado-service.ts)).
El fix de esta etapa es hacer que el generador use **esa misma función** —
una sola fuente de verdad para lo que se revisa en pantalla y lo que se
descarga en Word.

## Cambio requerido

En `app/api/nCoordinacion/generar/route.ts`:

1. Reemplazar el bloque de `Promise.all` (líneas 103-110: `obtenerEventosDia`,
   `obtenerRND`, `obtenerArmasDia`, `obtenerDatosCapturados`,
   `obtenerConteosDetenidos` ×2) por:
   ```ts
   const [consolidado, datosObs] = await Promise.all([
     obtenerFormatoNConsolidado(fecha),
     obtenerObservacionesPorFecha(fecha), // ver punto 3 más abajo
   ])
   const { eventos, rnd, armas } = consolidado
   const fge = consolidado.fge.find(f => f.periodo === 'diario') ?? null
   const fgr = consolidado.fgr.find(f => f.periodo === 'diario') ?? null
   const masc = consolidado.medios.find(m => m.periodo === 'diario') ?? null
   const victimas = consolidado.victimas.find(v => v.periodo === 'diario') ?? null
   ```
   `obtenerFormatoNConsolidado` devuelve `fge`/`fgr`/`medios`/`victimas` como
   **arrays por periodo** (diario/semanal/mensual — ver
   `porPeriodos()` en `formato-n-consolidado-service.ts`). Este generador es
   del reporte **diario**, por eso se filtra `periodo === 'diario'`. `eventos`,
   `rnd` y `armas` no tienen periodo, se usan tal cual (arrays completos del día).
2. `obtenerFormatoNConsolidado` **no incluye Observaciones** (no es parte de
   `FormatoNConsolidado`, ver tipo en `formato-n-consolidado-service.ts`).
   Agregar una función pequeña `obtenerObservacionesPorFecha(fecha)` en
   `lib/n-coordinacion/repository.ts` (o donde el equipo decida que viva
   Observaciones tras la Etapa 5) que haga
   `SELECT * FROM formato_n_observaciones WHERE fecha = $1 LIMIT 1` — es
   exactamente lo que ya hacía `obtenerDatosCapturados` para `obs`, solo
   aislado en su propia función para no depender del resto de
   `obtenerDatosCapturados` (que ya no se usa en este archivo tras el punto 1).
3. `tablaFiscalia(domiciliosLabel, datos, conteos)` deja de recibir el tercer
   parámetro `conteos` — usar directamente `datos?.carpetas_iniciadas`,
   `datos?.numero_cateos`, `datos?.vehiculos_asegurados`, `datos?.personas_aseguradas`
   (mismo fallback `toN(...)` que ya usan los otros 5 campos de esa función).
   Actualizar las dos llamadas (sección B FGE, sección C FGR) para dejar de
   pasar `conteosFge`/`conteosFgr`.
4. Actualizar las tablas de Eventos (A), RND (D) y Armas (H) para consumir
   `eventos`, `rnd`, `armas` desde `consolidado` en vez de las funciones
   retiradas — la forma de los datos (`FormatoNEvento`, `FormatoNRnd`,
   `FormatoNArmaAsegurada`, ver `lib/reportes/formato-n-*-service.ts`) tiene
   nombres de campo ligeramente distintos a los que devolvían
   `obtenerEventosDia`/`obtenerRND`/`obtenerArmasDia` (por ejemplo
   `autoridad_que_realizo_detencion` en vez de `autoridad`, `tipo_arma` en vez
   de un objeto `arma` jsonb) — ajustar el mapeo campo por campo, no asumir
   que los nombres coinciden.
5. Eliminar de `lib/n-coordinacion/repository.ts` los imports que ya no use
   este archivo (`obtenerEventosDia`, `obtenerRND`, `obtenerArmasDia`,
   `obtenerConteosDetenidos`, `obtenerDatosCapturados` si ya no se usa aquí) —
   pero **no borrar las funciones del repository todavía** si algo más las
   usa (ver Etapa 4, ahí se limpia código muerto después de confirmar que no
   quedan consumidores).

## Criterios de aceptación

1. Para un día con datos capturados en las 7 secciones vía Flujo A (Eventos,
   FGE con ajuste manual tras "calcular", FGR manual, RND, MASC, Víctimas,
   Armas) más Observaciones, generar el Word y confirmar que **cada una de
   las 8 tablas** del documento (A-H) coincide exactamente con lo que muestra
   `/envio-de-formatos/consolidar` para ese mismo día — no solo FGE/FGR.
2. Para un día sin ninguna captura, generar el Word y confirmar que todas las
   tablas muestran "Sin Novedad" / `00` según corresponda, sin errores.
3. `npx tsc --noEmit` sin errores nuevos.
4. Confirmar con `grep -rn "obtenerEventosDia\|obtenerRND\|obtenerArmasDia\|obtenerConteosDetenidos" app/api/nCoordinacion/generar/route.ts`
   que no queda ninguna referencia.
