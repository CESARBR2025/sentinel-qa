# Etapa 3 — Retirar el Flujo B (`/nCoordinacion`)

## Problema

`/nCoordinacion` ([app/nCoordinacion/page.tsx](../app/nCoordinacion/page.tsx)) duplica
la función de `/envio-de-formatos` (Flujo A), con una lógica de cálculo
distinta (ya corregida de raíz en la Etapa 2, pero la página sigue mostrando
campos "automáticos" con `obtenerConteosDetenidos`, que para FGR siempre da
`0` — confuso para quien la use, aunque ya no pueda borrar datos gracias a la
Etapa 1). Mantener dos rutas que hacen lo mismo con distinta UI es la causa
raíz de que este tipo de bugs vuelva a aparecer.

**Nota de alcance:** esta etapa solo retira la ruta duplicada. **No** decide
dónde queda el botón "Generar Word" ni cómo se ve la captura de aquí en
adelante — eso lo define la Etapa 5, que rediseña por completo
`/envio-de-formatos/consolidar` y reemplaza las 7 páginas sueltas por un
stepper. Ejecutar esta etapa deja el sistema sin botón visible de "Generar
Word" durante un momento (la API `/api/nCoordinacion/generar` sigue viva y
corregida desde la Etapa 2, solo falta un link hacia ella) — eso se resuelve
en la Etapa 5, no aquí. Si se prefiere no tener ese hueco, ejecutar la Etapa 5
inmediatamente después de esta sin pausa intermedia.

## Cambio requerido

1. Eliminar:
   - `app/nCoordinacion/page.tsx`
   - `lib/n-coordinacion/actions.ts` (`guardarDatosCoordinacion`)
2. En [lib/n-coordinacion/repository.ts](../lib/n-coordinacion/repository.ts):
   - **Conservar `upsertObservaciones`** aunque su único llamador
     (`guardarDatosCoordinacion`) se elimine — Observaciones (sección G del
     documento) no tiene página propia en Flujo A todavía; el stepper de la
     Etapa 5 la necesita. Dejar la función exportada aunque quede
     momentáneamente sin consumidor (documentar con un comentario corto: `//
     usada por el stepper de captura, ver plan-formato-n-fge-fgr/ETAPA-5.md`).
   - `upsertFge`, `upsertFgr`, `upsertMasc`, `upsertVictimas`: confirmar con
     `grep -rn "upsertFge\|upsertFgr\|upsertMasc\|upsertVictimas" --include="*.ts" --include="*.tsx" .`
     si algo más las usa. Si quedan sin consumidores tras borrar `actions.ts`,
     eliminarlas (la Etapa 5 las reemplaza por las funciones equivalentes de
     Flujo A, que ya existen y son las correctas — `crearFge`/`actualizarFge`
     en `lib/reportes/formato-n-fge-service.ts`, etc.).
   - `obtenerConteosDetenidos`, `obtenerEventosDia`, `obtenerRND`,
     `obtenerArmasDia`: ya deberían estar sin consumidores tras la Etapa 2 —
     **no borrarlas aquí**, eso es la Etapa 4 (mantener esta etapa enfocada
     solo en retirar la ruta, no mezclar con limpieza de código muerto).
3. Si algún otro archivo importa algo de `lib/n-coordinacion/*`, resolverlo
   antes de borrar (buscar con
   `grep -rln "n-coordinacion" --include="*.ts" --include="*.tsx" .`).

## Criterios de aceptación

1. La ruta `/nCoordinacion` ya no existe (404 o eliminada del build).
2. `upsertObservaciones` sigue existiendo en `lib/n-coordinacion/repository.ts`
   (o donde se haya decidido moverla), lista para que la Etapa 5 la use.
3. `grep -rn "nCoordinacion" --include="*.ts" --include="*.tsx" app lib` no
   devuelve más resultados que `app/api/nCoordinacion/generar` (esa ruta API
   se conserva, es el generador correcto de la Etapa 2).
4. `app/agente_reportes/page.tsx` puede seguir enlazando a `/nCoordinacion`
   en este punto (se corrige en la Etapa 4) — confirmar solo que no rompe el
   build (Next.js no valida hrefs en tiempo de compilación, así que esto no
   debería fallar, pero sí generar un link roto en producción hasta la Etapa 4).
5. `npx tsc --noEmit` y `npm run build` sin errores.
