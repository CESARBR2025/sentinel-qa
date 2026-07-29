# Etapa 6 — Regla de negocio: bloquear unidades ya ocupadas en otro incidente activo

> Repo: `seguridad_publica` (Next.js 16.2.4, React 19, TypeScript, Postgres con SQL crudo vía `query()` de `lib/db.ts`). Parte 6 del plan "Mapa tipo Uber en Asignar Unidades". Ver `00-contexto.md` para trasfondo general. **Requiere que las etapas 1 a 5 ya estén construidas** (mapa integrado, split-view, diferenciación visual, polling — todo ya en producción en este repo).

## Objetivo

Hoy es posible despachar la misma patrulla a dos incidentes activos simultáneamente — no hay ninguna validación que lo impida. Esta etapa implementa la regla de negocio: **una unidad que ya está asignada a un despacho activo (incidente en estatus `en_despacho` o `en_sitio`) no debe poder asignarse a un incidente distinto** hasta que ese despacho se cierre. Enviar refuerzos al mismo incidente donde la unidad ya está asignada SÍ debe seguir permitido (no es "ocupada en otro caso", es la misma tarea).

## Hallazgo que origina esta etapa (confirmado por investigación de código)

- `createDespacho` y `enviarRefuerzos` en `lib/incidentes/actions.ts` (líneas ~551-622 y ~626-686) insertan directo en `incidente_despacho_unidades` sin verificar si `unidad_ext_id` ya tiene un despacho abierto en otro incidente.
- `listarUnidadesParaDespacho` en `lib/flota/service.ts` no distingue: una unidad ocupada aparece en el picker/mapa exactamente igual que una libre.
- No hay ninguna columna de estado en `incidente_despacho_unidades` — "ocupada" se deriva por join contra `incidente_despacho` → `incidentes.estatus`.

## Modelo de datos relevante (ya existente — no se crean tablas ni columnas nuevas salvo lo indicado en "Archivos")

```
incidentes
  id uuid, estatus text  -- valores válidos: 'sin_despachar' | 'en_despacho' | 'en_sitio' | 'atendido' | 'cerrado_detencion'

incidente_despacho
  id uuid, incidente_id uuid (NOT NULL), fecha_hora_despacho, despachado_por, creado_en

incidente_despacho_unidades
  id uuid, despacho_id uuid (NOT NULL, FK → incidente_despacho.id),
  unidad_ext_id text  -- = via.v2_patrullas.id (uuid como texto), SIN constraint UNIQUE
  unidad_placa text, creado_en, es_refuerzo boolean, hora_salida, hora_llegada
```

**Definición exacta de "ocupada":** la unidad `unidad_ext_id` está ocupada si existe una fila en `incidente_despacho_unidades` cuyo `despacho_id` pertenece a un `incidente_despacho` cuyo `incidente_despacho.incidente_id` tiene `incidentes.estatus IN ('en_despacho', 'en_sitio')`, **y ese `incidente_id` es distinto al incidente que se está despachando/reforzando ahora mismo**.

SQL de referencia para esta condición (úsalo como base, tanto para el listado como para la validación de backend):
```sql
SELECT DISTINCT idu.unidad_ext_id
FROM incidente_despacho_unidades idu
JOIN incidente_despacho id2 ON id2.id = idu.despacho_id
JOIN incidentes i ON i.id = id2.incidente_id
WHERE i.estatus IN ('en_despacho', 'en_sitio')
  AND i.id != $1  -- incidenteIdActual (o `i.id IS DISTINCT FROM $1` si incidenteIdActual puede ser NULL)
```

## Archivos y cambios exactos

### 1. `lib/flota/types.ts`
Agregar `ocupada: boolean` a `UnidadConTripulacion` (se hereda automáticamente en `UnidadParaDespacho extends UnidadConTripulacion`). No agregar más campos (no hace falta el folio/incidente que la ocupa para el alcance de esta etapa — ver "Fuera de alcance").

### 2. `lib/flota/repository.ts`
Agregar una función nueva:
```ts
export async function listarIdsUnidadesOcupadas(incidenteIdActual: string | null): Promise<Set<string>> {
  const result = await query<{ unidad_ext_id: string }>(
    `SELECT DISTINCT idu.unidad_ext_id
     FROM incidente_despacho_unidades idu
     JOIN incidente_despacho id2 ON id2.id = idu.despacho_id
     JOIN incidentes i ON i.id = id2.incidente_id
     WHERE i.estatus IN ('en_despacho', 'en_sitio')
       AND ($1::uuid IS NULL OR i.id != $1::uuid)`,
    [incidenteIdActual],
  )
  return new Set(result.rows.map(r => r.unidad_ext_id))
}
```
No modifiques `listarUnidadesConTripulacionRaw` — mantén esta como una consulta separada (una unidad puede tener múltiples despachos activos históricos raros; `DISTINCT` + `Set` es suficiente y más simple que forzar un JOIN dentro de la query principal).

### 3. `lib/flota/service.ts`
- `listarUnidadesParaDespacho` recibe un nuevo parámetro `incidenteIdActual: string | null` (agrégalo al final de la firma, después de `prioritarioPatrullaId`, para no romper el orden de los existentes salvo que prefieras nombrar todos explícitos — usa el mismo estilo posicional que ya tiene la función).
- Llama a `listarIdsUnidadesOcupadas(incidenteIdActual)` en paralelo con el resto (puede ir con `Promise.all` junto a `listarUnidadesConTripulacionRaw()` si quieres optimizar, o secuencial si prefieres simplicidad — no es una ruta de alta frecuencia).
- Al construir `conDistancia`, agrega `ocupada: idsOcupadas.has(u.id)` a cada unidad.
- **No excluyas las unidades ocupadas del array retornado** — el listado sigue devolviendo todas (para que el mapa/lista las muestre visualmente distintas), la exclusión dura vive en el paso 6 de abajo.
- La unidad prioritaria (`prioritarioPatrullaId`) nunca debería estar ocupada en la práctica (es la unidad del oficial que ya está en el sitio del rondín actual), pero no hace falta lógica especial — simplemente hereda el campo `ocupada` como cualquier otra.

### 4. `app/api/despacho/unidades-cercanas/route.ts`
Aceptar un nuevo query param `incidenteId` (string | null) y pasarlo como último argumento a `listarUnidadesParaDespacho`.

### 5. `components/911/despacho/DespachoForm.tsx`
En los dos lugares donde se construye la URL de `/api/despacho/unidades-cercanas` (el `useEffect` inicial de `DespachoForm` — nota: `SeleccionarUnidadesModal.tsx` también arma su propia URL de polling en su `useEffect` de la Etapa 5, ambos deben incluir `incidenteId`):
- En `DespachoForm.tsx`: agregar `params.set('incidenteId', incidenteId)` (la prop `incidenteId` ya existe en el componente).
- En `SeleccionarUnidadesModal.tsx`: el modal no recibe `incidenteId` como prop hoy — agrégalo a su interfaz de props (`incidenteId?: string | null`), pásalo desde `DespachoForm.tsx` al instanciar `<SeleccionarUnidadesModal .../>`, e inclúyelo en el `URLSearchParams` de su `useEffect` de polling.

### 6. `lib/incidentes/actions.ts` — la validación real (defense in depth, no confiar solo en la UI)
En `createDespacho`, después de parsear `unidades` (línea ~570, antes del `BEGIN`), agregar una verificación dentro de la misma conexión/transacción:
```ts
if (unidades.length > 0) {
  const ocupadas = await cliente.query<{ unidad_ext_id: string; folio: string }>(
    `SELECT DISTINCT idu.unidad_ext_id, i.folio
     FROM incidente_despacho_unidades idu
     JOIN incidente_despacho id2 ON id2.id = idu.despacho_id
     JOIN incidentes i ON i.id = id2.incidente_id
     WHERE i.estatus IN ('en_despacho', 'en_sitio')
       AND i.id != $1
       AND idu.unidad_ext_id = ANY($2::text[])`,
    [incidenteId, unidades.map(u => u.extId)],
  )
  if (ocupadas.rows.length > 0) {
    const detalle = ocupadas.rows.map(r => `${r.unidad_ext_id} (folio ${r.folio})`).join(', ')
    throw new ValidationError(`No se puede despachar: unidad(es) ya asignada(s) a otro incidente activo: ${detalle}`)
  }
}
```
Colócalo dentro del `try` antes del `BEGIN` (si falla, ni siquiera abre transacción) — o justo después del `BEGIN` si prefieres que el `ROLLBACK` del catch existente lo cubra; cualquiera de las dos formas es válida siempre que la unidad ocupada nunca llegue a insertarse.

Aplica el mismo patrón (mismo query, cambiando solo el mensaje) en `enviarRefuerzos`, usando el `incidenteId` de esa función y las `unidades` que recibe ahí.

`ValidationError` ya está importado en este archivo (se usa varias veces) — no hace falta agregar el import.

### 7. `components/911/despacho/UnidadCards.tsx` (`UnidadCard`)
- Agregar un badge "OCUPADA" (mismo estilo de los badges existentes tipo "Más cercana", pero en rojo/ámbar para comunicar bloqueo — ej. fondo `#fef2f2`, texto `#dc2626`).
- Cuando `unidad.ocupada` es `true`: la card no debe ser clickeable (quita o ignora el `onClick`/`onToggle`, agrega `cursor: 'not-allowed'`, reduce opacidad general de la card ~0.6) — igual patrón visual que ya usa el proyecto para estados deshabilitados.
- Revisa la firma de props de `UnidadCard` — probablemente haga falta leer `unidad.ocupada` directo del objeto `unidad` ya recibido (el tipo `UnidadParaDespacho` ya lo trae desde el paso 1), sin agregar una prop nueva.

### 8. `components/911/despacho/SeleccionarUnidadesModal.tsx`
En `toggle(u)`, si `u.ocupada` es `true`, no hacer nada (return temprano) — así aunque algo dispare el toggle programáticamente (ej. un click residual en el mapa), no se selecciona una unidad ocupada. Esto es una capa extra de UX, la validación real ya está en el backend (paso 6).

### 9. `components/911/despacho/AsignacionMapa.tsx`
- En `buildUnidadSvgIcon`, si `u.ocupada` es `true`, el marcador debe verse claramente distinto sin importar cercanía: usa un color fijo (ej. rojo apagado `#b91c1c` o gris con un ícono de "bloqueado"/tachado), con prioridad sobre los estados de `esMasCercana`/`esCercana` de la Etapa 4 (una unidad ocupada nunca se pinta verde/azul aunque sea la más cercana).
- El `onClick` del `MarkerF` de una unidad ocupada no debe llamar `onToggleUnidad` (o el padre ya lo ignora vía el paso 8 — de cualquier forma, no debe cambiar visualmente como "seleccionada" al hacer click).

## Qué NO hacer en esta etapa

- No agregar una columna de estado a `incidente_despacho_unidades` — la ocupación se deriva, no se almacena.
- No tocar `OficialUbicacionTracker.tsx`, `TablonDespacho.tsx`, ni el heartbeat de 30s.
- No implementar un mecanismo de "liberar" manualmente una unidad ocupada — la liberación ocurre naturalmente cuando el incidente que la ocupa cambia de estatus (flujo ya existente en el módulo de incidentes, no se toca aquí).
- No mostrar en esta etapa el folio del incidente que ocupa a la unidad en la UI (solo en el mensaje de error del backend, para debugging/soporte) — si se quiere ese detalle visible en el picker/mapa, es una mejora futura fuera de este plan.

## Criterios de aceptación

1. `npx tsc --noEmit` sin errores.
2. Con una unidad de prueba ocupada en otro incidente activo (ver `test-qa.md` para cómo sembrar esto), el picker (lista) y el mapa la muestran con el estilo/badge de "OCUPADA" y no se puede seleccionar desde ninguno de los dos.
3. Intentar despachar esa unidad ocupada directamente contra `createDespacho` (bypaseando la UI, ej. invocando la acción con un FormData armado a mano que incluya su `extId`) es rechazado con un `ValidationError` claro, y no se inserta ninguna fila nueva en `incidente_despacho_unidades` para esa unidad — confirmar con una consulta a la tabla antes y después del intento.
4. Enviar refuerzos al incidente donde la unidad ya está asignada (su propio incidente) NO la bloquea a sí misma — sigue permitiendo agregarla si hiciera falta, o al menos no la marca como `ocupada` en ese contexto.
5. Despachar una unidad libre (caso de control) sigue funcionando exactamente igual que antes de esta etapa.
6. Cambiar el `estatus` del incidente que ocupaba a la unidad a `atendido` o `cerrado_detencion` hace que esa unidad vuelva a aparecer libre y seleccionable en un siguiente fetch/polling.

Cuando estos criterios pasen, detente y espera confirmación antes de continuar con `test-qa.md`.
