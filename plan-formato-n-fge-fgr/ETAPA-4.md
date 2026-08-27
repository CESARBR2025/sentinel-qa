# Etapa 4 — Actualizar navegación y limpiar código muerto

## Problema

1. [app/agente_reportes/page.tsx](../app/agente_reportes/page.tsx) (sección
   "Coordinación (Formato N)", líneas 130-150) tiene una card "Grupo de
   Coordinación" que enlaza a `/nCoordinacion` (retirada en la Etapa 3) — hoy
   sería un enlace roto.
2. Varias funciones de [lib/n-coordinacion/repository.ts](../lib/n-coordinacion/repository.ts)
   quedan sin consumidores tras las Etapas 2 y 3: `obtenerConteosDetenidos`,
   `obtenerEventosDia`, `obtenerRND`, `obtenerArmasDia` (y posiblemente
   `upsertFge`/`upsertFgr`/`upsertMasc`/`upsertVictimas` si la Etapa 3 ya las
   dejó huérfanas). Es código muerto que puede confundir a quien lo lea
   después y crea de nuevo el mismo bug si alguien lo vuelve a usar sin saber
   por qué se dejó de usar.

## Cambio requerido

1. En `app/agente_reportes/page.tsx`: quitar la card "Grupo de Coordinación"
   (líneas 133-140) de la sección "Coordinación (Formato N)". Dejar solo
   "Envío de Formatos" (enlace `/envio-de-formatos`), que tras la Etapa 5
   cubre la función completa (consolidado por día + stepper + generar Word).
2. En `lib/n-coordinacion/repository.ts`: eliminar `obtenerConteosDetenidos`,
   `obtenerEventosDia`, `obtenerRND`, `obtenerArmasDia`. Confirmar antes con
   `grep -rn "<nombre función>" --include="*.ts" --include="*.tsx" .` que
   ninguna quedó con consumidores fuera de este archivo (no deberían, tras la
   Etapa 2).
3. Confirmar de nuevo el estado de `upsertFge`/`upsertFgr`/`upsertMasc`/`upsertVictimas`
   (revisados en la Etapa 3): si para este punto la Etapa 5 todavía no está
   ejecutada, pueden seguir sin consumidor — no es un bloqueante de esta
   etapa, solo confirmar que `upsertObservaciones` sigue intacta (la necesita
   la Etapa 5).
4. Buscar imports huérfanos en todo el árbol:
   `grep -rn "from '@/lib/n-coordinacion" --include="*.ts" --include="*.tsx" app lib`
   y confirmar que cada uno sigue siendo válido tras los cambios.

## Criterios de aceptación

1. `/agente_reportes` ya no muestra la card "Grupo de Coordinación"; la card
   "Envío de Formatos" sigue funcionando igual que antes.
2. `grep -rn "obtenerConteosDetenidos\|obtenerEventosDia\|obtenerRND\|obtenerArmasDia" --include="*.ts" --include="*.tsx" .`
   no devuelve resultados (más allá de los tipos `FormatoNRnd`/etc. de Flujo A,
   que tienen nombres distintos y no deben confundirse con estas funciones
   retiradas).
3. `npx tsc --noEmit` sin errores ni warnings de imports no usados en los
   archivos tocados.
4. `npm run build` completo sin errores.
