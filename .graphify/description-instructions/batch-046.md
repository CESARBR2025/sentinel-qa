# Node Description Batch 47 of 87

Graphify is running in assistant/skill mode (no API key). You are the host
assistant (Claude Code / Codex / Gemini CLI). Read the prompt below and write
your JSON answer to the answer file.

## Prompt

You are documenting nodes in a knowledge graph.
For each entry below, write ONE concise factual plain-language sentence
describing what it is or does. Use only the provided context.
For a code symbol (kind=code-symbol — a function, class, or constant),
describe what the function/symbol does based on its name, source location
and neighbors — e.g. "Resolves the configured ontology profile from graphify.yaml.".
Write every description in English (en). Do not switch languages.
No marketing language.
Respond ONLY with a JSON object mapping each node id (as a string) to its
one-sentence description — no prose, no markdown fences.

- "oficial_service_verreportedetalle": "verReporteDetalle()" | kind=code-symbol | source=lib/oficial/service.ts:L218 | neighbors=[page.tsx, service.ts]
- "oficial_types_ofiarmafuego": "OfiArmaFuego" | kind=code-symbol | source=lib/oficial/types.ts:L216 | neighbors=[store.ts, types.ts]
- "oficial_types_oficateo": "OfiCateo" | kind=code-symbol | source=lib/oficial/types.ts:L32 | neighbors=[mapper.ts, types.ts]
- "oficial_types_ofid1vinculada": "OfiD1Vinculada" | kind=code-symbol | source=lib/oficial/types.ts:L167 | neighbors=[mapper.ts, types.ts]
- "oficial_types_ofidroga": "OfiDroga" | kind=code-symbol | source=lib/oficial/types.ts:L224 | neighbors=[store.ts, types.ts]
- "oficial_types_ofihidrocarburo": "OfiHidrocarburo" | kind=code-symbol | source=lib/oficial/types.ts:L206 | neighbors=[store.ts, types.ts]
- "oficial_types_ofiordenaprehension": "OfiOrdenAprehension" | kind=code-symbol | source=lib/oficial/types.ts:L198 | neighbors=[store.ts, types.ts]
- "oficial_types_ofivehiculo": "OfiVehiculo" | kind=code-symbol | source=lib/oficial/types.ts:L24 | neighbors=[mapper.ts, types.ts]
- "oficial_unidadasignadasection_unidadasignadasection": "UnidadAsignadaSection()" | kind=code-symbol | source=components/oficial/UnidadAsignadaSection.tsx:L13 | neighbors=[page.tsx, UnidadAsignadaSection.tsx]
- "oficiales_mapper_maprowtooficialviadto": "mapRowToOficialViaDTO()" | kind=code-symbol | source=features/via/oficiales/mapper.ts:L20 | neighbors=[mapper.ts, repository.ts]
- "oficiales_types_ofioficialviadto": "OfiOficialViaDTO" | kind=code-symbol | source=features/via/oficiales/types.ts:L1 | neighbors=[mapper.ts, types.ts]
- "ordensalida_generarordensalida_drawwatermark": "drawWatermark()" | kind=code-symbol | source=lib/ordenSalida/generarOrdenSalida.ts:L25 | neighbors=[generarOrdenSalida.ts, generarOrdenSalidaVehiculo()]
- "ordensalida_generarordensalida_formatearfecha": "formatearFecha()" | kind=code-symbol | source=lib/ordenSalida/generarOrdenSalida.ts:L3 | neighbors=[generarOrdenSalida.ts, generarOrdenSalidaVehiculo()]
- "ordensalida_generarordensalida_formatearoficio": "formatearOficio()" | kind=code-symbol | source=lib/ordenSalida/generarOrdenSalida.ts:L10 | neighbors=[generarOrdenSalida.ts, generarOrdenSalidaVehiculo()]
- "ordensalida_generarordensalida_loadimageasbase64": "loadImageAsBase64()" | kind=code-symbol | source=lib/ordenSalida/generarOrdenSalida.ts:L14 | neighbors=[generarOrdenSalida.ts, generarOrdenSalidaVehiculo()]
- "ordensalida_generarordensalida_parrafomixtoconwrap": "parrafoMixtoConWrap()" | kind=code-symbol | source=lib/ordenSalida/generarOrdenSalida.ts:L33 | neighbors=[generarOrdenSalida.ts, generarOrdenSalidaVehiculo()]
- "permisos_core_aplicarplantillarol": "aplicarPlantillaRol()" | kind=code-symbol | source=lib/permisos/core.ts:L133 | neighbors=[core.ts, guardarPermiso()]
- "permisos_core_guardarplantillaseccion": "guardarPlantillaSeccion()" | kind=code-symbol | source=lib/permisos/core.ts:L117 | neighbors=[core.ts, guardarPlantillaSeccionesAction()]
- "permisos_core_permisorow": "PermisoRow" | kind=code-symbol | source=lib/permisos/core.ts:L16 | neighbors=[core.ts, PermisoSeccion]
- "permisos_core_permisoseccion": "PermisoSeccion" | kind=code-symbol | source=lib/permisos/core.ts:L9 | neighbors=[core.ts, PermisoRow]
- "postcss_config": "postcss.config.mjs" | kind=code-symbol | source=postcss.config.mjs:L1 | neighbors=[90da1ca Initial commit from Create Next…, config]
- "prevencion_actions_cancelarfichaapi": "cancelarFichaApi()" | kind=code-symbol | source=lib/prevencion/actions.ts:L375 | neighbors=[route.ts, actions.ts]
- "prevencion_actions_createcontestacionapi": "createContestacionApi()" | kind=code-symbol | source=lib/prevencion/actions.ts:L435 | neighbors=[route.ts, actions.ts]
- "prevencion_actions_createfichaapi": "createFichaApi()" | kind=code-symbol | source=lib/prevencion/actions.ts:L339 | neighbors=[route.ts, actions.ts]
- "prevencion_actions_createmedidaapi": "createMedidaApi()" | kind=code-symbol | source=lib/prevencion/actions.ts:L285 | neighbors=[route.ts, actions.ts]
- "prevencion_actions_createseguimientoapi": "createSeguimientoApi()" | kind=code-symbol | source=lib/prevencion/actions.ts:L384 | neighbors=[actions.ts, route.ts]
- "prevencion_actions_createsolicitudapi": "createSolicitudApi()" | kind=code-symbol | source=lib/prevencion/actions.ts:L392 | neighbors=[actions.ts, route.ts]
- "prevencion_actions_createsolicitudc4api": "createSolicitudC4Api()" | kind=code-symbol | source=lib/prevencion/actions.ts:L426 | neighbors=[route.ts, actions.ts]
- "prevencion_actions_createvisitaapi": "createVisitaApi()" | kind=code-symbol | source=lib/prevencion/actions.ts:L331 | neighbors=[actions.ts, route.ts]
- "prevencion_actions_updatefichaapi": "updateFichaApi()" | kind=code-symbol | source=lib/prevencion/actions.ts:L348 | neighbors=[route.ts, actions.ts]
- "prevencion_actions_updatemedidaapi": "updateMedidaApi()" | kind=code-symbol | source=lib/prevencion/actions.ts:L293 | neighbors=[route.ts, actions.ts]
- "prevencion_actions_updatemedidastatusapi": "updateMedidaStatusApi()" | kind=code-symbol | source=lib/prevencion/actions.ts:L322 | neighbors=[route.ts, actions.ts]
- "prevencion_actions_updatesolicitudapi": "updateSolicitudApi()" | kind=code-symbol | source=lib/prevencion/actions.ts:L401 | neighbors=[route.ts, actions.ts]
- "prevencion_agregarautoridadform_agregarautoridadform": "AgregarAutoridadForm()" | kind=code-symbol | source=components/prevencion/AgregarAutoridadForm.tsx:L26 | neighbors=[page.tsx, AgregarAutoridadForm.tsx]
- "prevencion_cancelacionmodal_cancelacionmodal": "CancelacionModal()" | kind=code-symbol | source=components/prevencion/CancelacionModal.tsx:L6 | neighbors=[page.tsx, CancelacionModal.tsx]
- "prevencion_contestacionform_contestacionform": "ContestacionForm()" | kind=code-symbol | source=components/prevencion/ContestacionForm.tsx:L6 | neighbors=[page.tsx, ContestacionForm.tsx]
- "prevencion_mapper_rowtobusqueda": "rowToBusqueda()" | kind=code-symbol | source=lib/prevencion/mapper.ts:L28 | neighbors=[mapper.ts, toStr()]
- "prevencion_mapper_rowtomedida": "rowToMedida()" | kind=code-symbol | source=lib/prevencion/mapper.ts:L15 | neighbors=[mapper.ts, toStr()]
- "prevencion_medidasfiltros_medidasfiltros": "MedidasFiltros()" | kind=code-symbol | source=components/prevencion/MedidasFiltros.tsx:L22 | neighbors=[page.tsx, MedidasFiltros.tsx]
- "prevencion_permisos_accion": "Accion" | kind=code-symbol | source=lib/prevencion/permisos.ts:L6 | neighbors=[actions.ts, permisos.ts]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/cesarbr/Documents/dev/sjr/seguridad_publica/.graphify/description-instructions/batch-046.json

Keep each description factual and concise (one sentence). No markdown, no prose
outside the JSON object. It is acceptable to omit a node if context is
insufficient — but include every node you can ground confidently.

Example answer format:
```json
{
  "node_id_1": "Resolves the configured ontology profile from graphify.yaml.",
  "node_id_2": "Colonel James Barclay, an antagonist in The Crooked Man."
}
```
