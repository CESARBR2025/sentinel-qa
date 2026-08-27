# Etapa 6 — Documentación + verificación end-to-end

## Objetivo

Dejar la bóveda al día y confirmar el flujo completo funcionando de punta a
punta antes de cerrar el plan.

## Archivos a tocar

- `boveda/🧩 Features/Formato N.md`
- `boveda/🧩 Features/Fiscalia.md`
- `boveda/🗺 Roadmap/Changelog.md`

## 1. `boveda/🧩 Features/Formato N.md`

Regla 8 dice hoy: *"Medios (paso 5), Víctimas (paso 6), Armas (paso 7) y
Observaciones (paso 8) conservan su captura manual — no tienen fuente
automática en el sistema."* — sacar Armas de esa lista y agregar una regla
nueva (siguiendo el estilo de la regla 4/5 de Eventos/RND) describiendo:
fuente = `fiscalia_armas_aseguradas` (capturada por el agente de Fiscalía
junto a la foto del arma en `/fiscalia/asegurados/[id]`), sync por
`origen_fiscalia_arma_id` con el mismo patrón `UPSERT`, y que el form manual
del paso 7 se conserva como respaldo para casos no procesados aún por
Fiscalía. Actualizar también la tabla de "BD" y "Componentes involucrados"
del mismo documento con `fiscalia_armas_aseguradas` y los archivos nuevos/
tocados de `lib/fiscalia`.

## 2. `boveda/🧩 Features/Fiscalia.md`

Agregar a la tabla de "BD" (línea ~37-47): fila para `fiscalia_armas_aseguradas`.
Agregar a "Componentes involucrados" (línea ~24-35): `ArmasAseguradas.tsx` y
las funciones nuevas de `repository.ts`/`service.ts`/`actions.ts`.

De paso — gap preexistente detectado en esta sesión, no causado por este
plan: la tabla `antecedentes_externos_detenido` y el componente
`AntecedentesExternos.tsx` tampoco están documentados ahí. Agregarlos
también ya que se está tocando el mismo documento (evita dejarlo
desactualizado en dos features seguidas).

## 3. `boveda/🗺 Roadmap/Changelog.md`

Entrada nueva describiendo la feature completa (fecha de hoy).

## Verificación end-to-end completa

1. `npx tsc --noEmit` — todo el proyecto, no solo archivos tocados.
2. `npm run build` — build completo sin errores.
3. `eslint` sobre todos los archivos tocados en las 5 etapas anteriores.
4. Prueba manual real, de punta a punta:
   a. Elegir un `reporte_campo_id` real con `ofi_hay_arma_fuego = true` (o
      crear uno de prueba) cuyo incidente tenga fecha conocida.
   b. Entrar a `/fiscalia/asegurados/[id]` correspondiente, agregar 2 armas
      con datos distintos (una con carpeta de investigación, otra sin).
   c. Abrir `/envio-de-formatos/reporte/<fecha del incidente>`, ir al paso 7,
      confirmar que las 2 armas aparecen con sus datos correctos.
   d. Recargar la página del stepper (fuerza un segundo sync) — confirmar
      que siguen siendo exactamente 2 filas, no 4.
   e. Editar una de las armas en Fiscalía (cambiar el tipo), recargar el
      stepper, confirmar que se actualizó la fila (no se duplicó).
   f. Confirmar la sección y avanzar — confirmar que `formato_n_estatus_dia.armas_confirmado`
      queda en `true` para esa fecha.
5. `npx graphify update` al cerrar, para que el grafo quede al día con todos
   los archivos nuevos/tocados.

## Checklist final de cierre del plan

- [ ] Las 6 etapas ejecutadas en orden, cada una con sus criterios de
      aceptación verificados antes de pasar a la siguiente.
- [ ] Ningún script temporal (`scripts/tmp-*.ts`) quedó en el repo.
- [ ] `git status` limpio salvo los archivos realmente tocados por el plan
      (ningún archivo de otra feature modificado por accidente).
- [ ] Bóveda actualizada (los 3 archivos de esta etapa).
- [ ] Reportar al usuario el resultado etapa por etapa, tal como se fue
      construyendo.
