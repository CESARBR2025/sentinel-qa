# Node Description Batch 45 of 79

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
- "prevencion_mapper_rowtobusqueda": "rowToBusqueda()" | kind=code-symbol | source=lib/prevencion/mapper.ts:L27 | neighbors=[mapper.ts, toStr()]
- "prevencion_mapper_rowtomedida": "rowToMedida()" | kind=code-symbol | source=lib/prevencion/mapper.ts:L14 | neighbors=[mapper.ts, toStr()]
- "prevencion_medidasfiltros_medidasfiltros": "MedidasFiltros()" | kind=code-symbol | source=components/prevencion/MedidasFiltros.tsx:L22 | neighbors=[page.tsx, MedidasFiltros.tsx]
- "prevencion_permisos_accion": "Accion" | kind=code-symbol | source=lib/prevencion/permisos.ts:L7 | neighbors=[actions.ts, permisos.ts]
- "prevencion_permisos_obtenerrolnombre": "obtenerRolNombre()" | kind=code-symbol | source=lib/prevencion/permisos.ts:L38 | neighbors=[permisos.ts, tieneAccesoSeccion()]
- "prevencion_printbutton_printbutton": "PrintButton()" | kind=code-symbol | source=components/prevencion/PrintButton.tsx:L3 | neighbors=[page.tsx, PrintButton.tsx]
- "prevencion_prorrogamodal_prorrogamodal": "ProrrogaModal()" | kind=code-symbol | source=components/prevencion/ProrrogaModal.tsx:L6 | neighbors=[page.tsx, ProrrogaModal.tsx]
- "prevencion_prorrogaviewermodal_prorrogaviewermodal": "ProrrogaViewerModal()" | kind=code-symbol | source=components/prevencion/ProrrogaViewerModal.tsx:L9 | neighbors=[page.tsx, ProrrogaViewerModal.tsx]
- "prevencion_repository_getfichasactivas": "getFichasActivas()" | kind=code-symbol | source=lib/prevencion/repository.ts:L152 | neighbors=[route.ts, repository.ts]
- "prevencion_repository_getfichasbusqueda": "getFichasBusqueda()" | kind=code-symbol | source=lib/prevencion/repository.ts:L30 | neighbors=[page.tsx, repository.ts]
- "prevencion_repository_getfichasbusquedafiltradas": "getFichasBusquedaFiltradas()" | kind=code-symbol | source=lib/prevencion/repository.ts:L167 | neighbors=[route.ts, repository.ts]
- "prevencion_repository_getmedidas": "getMedidas()" | kind=code-symbol | source=lib/prevencion/repository.ts:L5 | neighbors=[page.tsx, repository.ts]
- "prevencion_repository_getmedidasfiltradas": "getMedidasFiltradas()" | kind=code-symbol | source=lib/prevencion/repository.ts:L114 | neighbors=[route.ts, repository.ts]
- "prevencion_repository_getmedidasstats": "getMedidasStats()" | kind=code-symbol | source=lib/prevencion/repository.ts:L23 | neighbors=[page.tsx, repository.ts]
- "prevencion_repository_getseguimientotipos": "getSeguimientoTipos()" | kind=code-symbol | source=lib/prevencion/repository.ts:L159 | neighbors=[route.ts, repository.ts]
- "prevencion_repository_getvisitamedidaids": "getVisitaMedidaIds()" | kind=code-symbol | source=lib/prevencion/repository.ts:L18 | neighbors=[page.tsx, repository.ts]
- "prevencion_repository_listarautoridadesadicionales": "listarAutoridadesAdicionales()" | kind=code-symbol | source=lib/prevencion/repository.ts:L83 | neighbors=[page.tsx, repository.ts]
- "prevencion_repository_listarseguimientos": "listarSeguimientos()" | kind=code-symbol | source=lib/prevencion/repository.ts:L99 | neighbors=[page.tsx, repository.ts]
- "prevencion_repository_listarsolicitudesc4": "listarSolicitudesC4()" | kind=code-symbol | source=lib/prevencion/repository.ts:L51 | neighbors=[page.tsx, repository.ts]
- "prevencion_repository_listarsolicitudesfiltradas": "listarSolicitudesFiltradas()" | kind=code-symbol | source=lib/prevencion/repository.ts:L197 | neighbors=[repository.ts, route.ts]
- "prevencion_repository_listarsolicitudesjuridico": "listarSolicitudesJuridico()" | kind=code-symbol | source=lib/prevencion/repository.ts:L35 | neighbors=[page.tsx, repository.ts]
- "prevencion_repository_listarvisitas": "listarVisitas()" | kind=code-symbol | source=lib/prevencion/repository.ts:L75 | neighbors=[page.tsx, repository.ts]
- "prevencion_repository_listarvisitasconalias": "listarVisitasConAlias()" | kind=code-symbol | source=lib/prevencion/repository.ts:L144 | neighbors=[repository.ts, route.ts]
- "prevencion_repository_obtenercontestacion": "obtenerContestacion()" | kind=code-symbol | source=lib/prevencion/repository.ts:L59 | neighbors=[page.tsx, repository.ts]
- "prevencion_repository_obtenerfichadetalle": "obtenerFichaDetalle()" | kind=code-symbol | source=lib/prevencion/repository.ts:L183 | neighbors=[route.ts, repository.ts]
- "prevencion_repository_obtenermedidadetalle": "obtenerMedidaDetalle()" | kind=code-symbol | source=lib/prevencion/repository.ts:L67 | neighbors=[page.tsx, repository.ts]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/cesarbr/Documents/dev/sjr/seguridad_publica/.graphify/description-instructions/batch-044.json

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
