# Etapa 2 — Ajuste de backend: dejar de truncar a top-10

> Repo: `seguridad_publica` (Next.js 16.2.4, React 19, TypeScript). Parte 2 de 5 del plan "Mapa tipo Uber en Asignar Unidades". Ver `00-contexto.md` en esta misma carpeta para trasfondo completo. Esta etapa es independiente de la Etapa 1 (no depende de que exista `AsignacionMapa.tsx`) — es un cambio aislado de backend.

## Objetivo

Que el endpoint de unidades cercanas devuelva **todas** las unidades con ubicación válida (no solo las 10 más cercanas), para que el mapa (etapas siguientes) pueda mostrar "todas las patrullas" + "cercanas destacadas" — hoy el backend nunca envía más de 10, así que el mapa no tendría datos para pintar el resto.

## Archivos

- **Modificar (único archivo a tocar):** `lib/flota/service.ts`

No modificar ningún otro archivo en esta etapa. No tocar `lib/flota/types.ts` ni `app/api/despacho/unidades-cercanas/route.ts` — el contrato del endpoint (forma/campos de cada objeto en la respuesta) no cambia, solo cambia cuántos elementos trae el array.

## Contexto técnico necesario

La función relevante es `listarUnidadesParaDespacho` en `lib/flota/service.ts` (aprox. líneas 115-149 al momento de escribir este plan — verifica el contenido real del archivo, puede haber cambiado). Hoy hace, en orden:

1. Trae todas las unidades con tripulación (`listarUnidadesConTripulacionRaw` + `agruparUnidadesConTripulacion`).
2. Calcula `distanciaKm` con Haversine (`distanciaHaversineKm` de `@/lib/shared/geo`) para cada una, comparando contra `incidenteLat`/`incidenteLng`. Si el incidente o la unidad no tienen coordenadas, `distanciaKm` queda `null`.
3. Resuelve la unidad "prioritaria" (si `prioritarioPatrullaId` viene informado) — esta se antepone al resultado final sin pasar por el filtro/tope de los pasos 4-5.
4. Filtra a solo las unidades con `distanciaKm != null` (descarta las que no tienen ubicación) y ordena ascendente por `distanciaKm`.
5. **Trunca a `TOP_UNIDADES_CERCANAS = 10` con `.slice(0, TOP_UNIDADES_CERCANAS)`.** ← esto es lo que hay que quitar.
6. Si hay unidad prioritaria y no está ya en el resultado, la antepone; devuelve el array final.

## Instrucciones

1. Localiza el `.slice(0, TOP_UNIDADES_CERCANAS)` sobre el array `cercanas` (o el nombre que tenga esa variable en el código real) dentro de `listarUnidadesParaDespacho`.
2. Quita ese `.slice(...)` — el array `cercanas` debe conservar **todas** las unidades con `distanciaKm != null`, ya ordenadas ascendentemente por distancia, sin recortar.
3. Deja la constante `TOP_UNIDADES_CERCANAS` declarada en el archivo aunque ya no se use para truncar aquí — el cliente la va a necesitar como referencia conceptual en la Etapa 4 (o, si tu linter marca la constante como no usada tras este cambio, está bien eliminarla, siempre que documentes en el commit/mensaje que el valor de referencia para "cercana" es 10 y esa lógica se implementará en el cliente en la Etapa 4).
4. No cambies el orden de las operaciones (filtro antes de sort, sort antes de anteponer prioritaria) — solo quita el truncado.
5. No toques la lógica de la unidad prioritaria.
6. No toques el filtro que descarta unidades sin `distanciaKm` (sin lat/lng) — esas se siguen excluyendo del array devuelto.

## Qué NO hacer en esta etapa

- No tocar `lib/flota/types.ts`.
- No tocar `app/api/despacho/unidades-cercanas/route.ts`.
- No tocar ningún componente de UI (`SeleccionarUnidadesModal.tsx`, `DespachoForm.tsx`, `UnidadCards.tsx`).
- No agregar un nuevo parámetro/flag al endpoint para controlar el truncado — el cambio es simplemente "ya no trunca".

## Criterios de aceptación (verificar antes de pasar a Etapa 3)

1. `npx tsc --noEmit` corre sin errores nuevos.
2. Con el servidor de desarrollo corriendo y sesión autenticada, llamar manualmente `GET /api/despacho/unidades-cercanas?lat=<lat>&lng=<lng>` usando coordenadas reales de un incidente existente en la base de datos donde haya más de 10 unidades con ubicación válida — confirmar que la respuesta ya no está topada en 10 elementos.
3. Si en el ambiente de prueba hay 10 o menos unidades con ubicación válida, documentar esa limitación (no es un fallo del cambio, solo no hay forma de observar el efecto con esos datos) y validar al menos que el array sigue viniendo ordenado ascendentemente por `distanciaKm`.
4. Abrir el tablón de despacho actual (sin ningún cambio de Etapa 3 en adelante) y confirmar que `SeleccionarUnidadesModal` sigue funcionando: el badge "Más cercana" debe seguir apareciendo en la misma unidad de siempre (la de menor distancia), y la búsqueda/selección deben seguir funcionando igual. Es **esperado** que ahora la lista pueda mostrar más de 10 unidades si las hay — eso no es un bug de esta etapa, se resuelve visualmente en la Etapa 4.

Cuando estos criterios pasen, detente y espera confirmación antes de continuar con `etapa-3.md`.
