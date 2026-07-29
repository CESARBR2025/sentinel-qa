# Etapa 9 — Unidad prioritaria preseleccionada y deseleccionable (con migración de BD)

> Repo: `seguridad_publica` (Next.js 16.2.4, React 19, TypeScript, Postgres con SQL crudo vía `query()`/`pool` de `lib/db.ts`). Parte 9 del plan "Mapa tipo Uber en Asignar Unidades". Ver `00-contexto.md` para trasfondo general. **Requiere que las etapas 1 a 8 ya estén construidas.**

## Bug/gap de negocio reportado por el usuario

Cuando un incidente viene de un rondín escalado (un oficial en campo levantó el reporte y ya está en/cerca del lugar), la patrulla completa de ese oficial se muestra hoy en un bloque fijo "Personal prioritario" que **no se puede deseleccionar**. Confirmado en código real:

- `UnidadResumenCard` (`components/911/despacho/UnidadCards.tsx`) usa un ternario `esPrioritaria ? <badge> : onQuitar && <botón Quitar>` — cuando `esPrioritaria` es `true` el botón "Quitar" nunca se renderiza, sin importar si el padre pasa `onQuitar`.
- `DespachoForm.tsx` excluye explícitamente a la unidad prioritaria de `unidadesDisponibles` (el array que se pasa al modal): `data.filter(u => u.id !== prioritarioPatrullaId)`. Hoy la unidad prioritaria **ni siquiera aparece como opción dentro del modal** "Unidades cercanas al hecho" para poder re-seleccionarla si se quitara.
- El payload final que se manda a `createDespacho` se arma solo desde `unidadesSeleccionadas` (el estado que llena el modal); `unidadPrioritaria` es un estado React totalmente aparte que nunca se incluye en ese payload — solo se muestra de forma informativa.

**Por qué importa:** una patrulla puede traer 1 o varios oficiales. Cuando el caso es de baja prioridad, no siempre se necesita movilizar a toda la tripulación solo porque uno de ellos fue quien reportó — el despachador debe poder decidir, igual que con cualquier otra unidad, y en su lugar elegir una unidad distinta más adecuada.

## Decisión de negocio sobre el dato ya insertado (importante, no reabrir esta discusión)

El oficial que reportó el rondín ya queda insertado en `incidente_despacho_elementos` (`es_prioritario = true`) desde el momento en que `createRondinEscalado` escala el rondín — **antes** de que el despachador abra el formulario. Ese registro es un hecho histórico (quién levantó el reporte) y **no se borra**. En vez de eso, se agrega una **columna nueva** que representa un concepto distinto: quién queda formalmente contando como responsable de atender el caso. Así "quién reportó" y "quién atiende" quedan separados, ambos auditables en la misma fila.

## Migración de base de datos

**Archivo nuevo:** `lib/db/manual-migrations/0026_incidente_despacho_elementos_atiende_caso.sql` (siguiente número disponible tras `0025_ubicacion_oficiales.sql` — verifica que siga siendo el siguiente número libre antes de crear el archivo, por si se agregó alguna migración más reciente). Sigue el mismo formato de encabezado en comentario que usan las migraciones existentes (ver `0025_ubicacion_oficiales.sql` como referencia de estilo).

```sql
-- Migration: separar "quién levantó el reporte" de "quién atiende el caso"
--
-- es_prioritario (ya existe) es un hecho histórico inmutable: el oficial cuyo
-- rondín escaló a este incidente. atiende_caso es editable: si el despachador
-- deselecciona la unidad de ese oficial en el picker de asignación, se marca
-- en false — sin borrar el registro histórico de que fue quien reportó.

ALTER TABLE incidente_despacho_elementos
  ADD COLUMN IF NOT EXISTS atiende_caso boolean NOT NULL DEFAULT true;
```

El `DEFAULT true` cubre automáticamente tanto las filas ya existentes como cualquier inserción nueva (vía `createRondinEscalado`, `createDespacho`, `enviarRefuerzos`) sin tocar esos INSERTs — solo se necesita un `UPDATE` explícito para el caso de deselección (ver más abajo). Aplica esta migración manualmente contra la BD de desarrollo/staging (no hay runner de migraciones automático en este proyecto, es SQL crudo — mismo patrón que las migraciones anteriores en esa carpeta).

## Archivos de código a modificar

### 1. `lib/incidentes/actions.ts`

Dentro de `createDespacho` (arranca ~línea 551), justo después de resolver `despachoId` (~línea 604) y **antes** de insertar `unidades`/`elementos`, agregar dentro de la misma transacción (después de `await cliente.query('BEGIN')`, antes del `for (const u of unidades)`):

```ts
// Si el incidente viene de un rondín, ya existe un elemento con es_prioritario=true
// (insertado por createRondinEscalado antes de que el despachador abriera el
// formulario). Ajustar su atiende_caso según si su unidad sigue entre las
// seleccionadas ahora — el despachador pudo haberla deseleccionado en el modal.
const prioritario = await cliente.query<{ id: string; patrulla_id: string | null }>(
  `SELECT ide.id, o.patrulla_id
   FROM incidente_despacho_elementos ide
   LEFT JOIN ofi_oficiales o ON o.no_nomina = ide.elemento_nomina AND o.ofi_estatus = 'activo'
   WHERE ide.despacho_id = $1 AND ide.es_prioritario = true
   LIMIT 1`,
  [despachoId],
)
if (prioritario.rows[0]) {
  const sigueSeleccionada = prioritario.rows[0].patrulla_id != null &&
    unidades.some(u => u.extId === prioritario.rows[0].patrulla_id)
  await cliente.query(
    `UPDATE incidente_despacho_elementos SET atiende_caso = $2 WHERE id = $1`,
    [prioritario.rows[0].id, sigueSeleccionada],
  )
}
```

Nota: esto se deriva **desde la BD** (no confiar en un flag que mande el cliente) — mismo principio de defensa en profundidad que ya usa la Etapa 6 para "unidad ocupada". No hace falta agregar ningún campo nuevo al `FormData` que ya arma `DespachoForm.tsx`.

**No apliques esta misma lógica en `enviarRefuerzos`** — ese flujo ocurre después de que el despacho inicial ya quedó confirmado (con `atiende_caso` ya resuelto por `createDespacho`), así que queda fuera de alcance de esta etapa.

### 2. `components/911/despacho/DespachoForm.tsx`

- En el `useEffect` de carga inicial (~línea 35-51): deja de excluir la unidad prioritaria de `unidadesDisponibles` (quita el `.filter(u => u.id !== prioritarioPatrullaId)` — ahora se incluyen todas las unidades). Además, si se resuelve `unidadPrioritaria`, **siembra la selección inicial** con ella: `setUnidadesSeleccionadas([prioritaria])` justo después de `setUnidadPrioritaria(prioritaria)`, dentro del mismo `.then()`.
- En el JSX de la sección "Personal prioritario" (~línea 137-173): quita la rama que renderizaba `<UnidadResumenCard unidad={unidadPrioritaria} esPrioritaria />` como bloque fijo — esa unidad ahora se muestra a través del `unidadesSeleccionadas.map(...)` que ya existe más abajo (que sí permite quitar). Mantén sin cambios la rama `else` (el badge informativo simple de nombre+nómina) para el caso en que `unidadPrioritaria` sea `null` (el oficial no tiene una patrulla resoluble hoy).
- En el `.map` de `unidadesSeleccionadas` (~línea 162-165), pasa `esPrioritaria={u.id === prioritarioPatrullaId}` a cada `<UnidadResumenCard>`, para que la unidad prioritaria conserve su badge "PRIORITARIO" dentro de esa lista, ahora sí con botón "Quitar" funcional (ver punto 3).
- En `handleSubmit` (~línea 62-68): corrige la validación `if (unidadesSeleccionadas.length === 0) { setErrorForm('Selecciona al menos una unidad'); return }` para que sea `if (unidadesSeleccionadas.length === 0 && !tienePrioritario) { ...; return }` — consistente con la validación de abajo (`totalOficiales === 0 && !tienePrioritario`), que ya contempla que un incidente con prioritario puede despacharse válidamente sin seleccionar ninguna unidad adicional (el oficial que reportó, ya presente en el lugar, puede bastar para un caso menor).

### 3. `components/911/despacho/UnidadCards.tsx`

- `UnidadResumenCard`: cambia el ternario `esPrioritaria ? <badge> : onQuitar && <botón>` por ambos renderizados de forma independiente (badge si `esPrioritaria`, botón "Quitar" si `onQuitar` está presente) — ya no son mutuamente excluyentes.
- `UnidadCard` (la card dentro del modal/lista de selección): agrega prop nueva `esPrioritaria?: boolean`. Si es `true`, muestra un badge "PRIORITARIO" adicional (distinto visualmente de "Más cercana" verde y "OCUPADA" rojo — usa un color propio, ej. índigo/morado, para no confundirlos), persistente sin importar el estado de selección. No debe bloquear el click normal de selección (a diferencia de `ocupada`, que sí bloquea).

### 4. `components/911/despacho/SeleccionarUnidadesModal.tsx`

En los dos bloques donde se renderiza `<UnidadCard ...>` (vista split con mapa y vista solo-lista), pasa `esPrioritaria={u.id === prioritarioPatrullaId}` (la prop `prioritarioPatrullaId` ya la recibe este componente hoy, solo se usaba para el polling — ahora también se usa para esto). Pasa también `prioritarioPatrullaId` como prop nueva a `<AsignacionMapa ... />` (siguiente punto).

### 5. `components/911/despacho/AsignacionMapa.tsx`

Agrega prop nueva `prioritarioPatrullaId?: string | null`. Dentro de `buildUnidadSvgIcon`, si `u.id === prioritarioPatrullaId`, agrega un pequeño overlay persistente en el ícono (ej. una estrella/bandera pequeña en una esquina del marcador, igual de persistente que el checkmark de "seleccionada" que ya existe ahí) — visible sin importar el color base (cercana/lejana/ocupada) ni el estado de selección.

## Qué NO hacer en esta etapa

- No tocar `enviarRefuerzos` — fuera de alcance, según lo explicado arriba.
- No modificar `createRondinEscalado` — sigue insertando el elemento prioritario exactamente igual (el `DEFAULT true` de la columna nueva ya cubre ese INSERT sin tocarlo).
- No borrar ni modificar destructivamente ningún registro existente — el fix es puramente aditivo (columna nueva con default) más un `UPDATE` no destructivo.
- No tocar la Etapa 6 (unidad ocupada) — ambas validaciones (ocupada / prioritaria) conviven: una unidad `ocupada` sigue sin poder seleccionarse aunque también sea `esPrioritaria` (caso raro, pero `ocupada` gana la prioridad de bloqueo si llegara a coincidir).
- No implementar la Etapa 10 (color de prioridad del incidente) en esta etapa — son cambios independientes en los mismos archivos, pero deben verificarse por separado.

## Criterios de aceptación

1. `npx tsc --noEmit` sin errores.
2. Aplicar la migración `0026_...sql` contra la BD de desarrollo y confirmar con `\d incidente_despacho_elementos` (o consulta a `information_schema.columns`) que la columna `atiende_caso` existe, es `boolean NOT NULL DEFAULT true`.
3. Con un incidente de prueba originado por rondín (con `prioritarioPatrullaId` resuelto a una patrulla con 2+ oficiales), al abrir "Unidades cercanas al hecho": esa unidad aparece **preseleccionada** en la lista y en el mapa, con badge "PRIORITARIO" visible.
4. Deseleccionar esa unidad (desde la card en la lista, desde el mapa, o con el botón "Quitar" en el resumen) la quita de la selección sin errores; el badge "PRIORITARIO" sigue visible en su card/marcador aunque ya no esté seleccionada.
5. Al despachar con la unidad prioritaria deseleccionada y ninguna otra elegida (caso límite: solo el oficial que reportó atiende), el despacho se confirma sin error de validación — y una consulta a `incidente_despacho_elementos` confirma que la fila `es_prioritario=true` de ese oficial ahora tiene `atiende_caso=false`, sin haberse borrado.
6. Al despachar dejando la unidad prioritaria seleccionada (comportamiento por defecto), el resto de su tripulación queda insertada en `incidente_despacho_elementos`/`incidente_despacho_unidades` como cualquier unidad normal, y la fila `es_prioritario=true` del oficial que reportó conserva `atiende_caso=true`.
7. Seleccionar/deseleccionar una unidad `ocupada` (Etapa 6) sigue bloqueado igual que antes, sin verse afectado por este cambio.

Cuando estos criterios pasen, detente y espera confirmación antes de continuar con `etapa-10.md`.
