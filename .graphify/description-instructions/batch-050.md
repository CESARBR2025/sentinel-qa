# Node Description Batch 51 of 93

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

- "prevencion_actions_updatefichaapi": "updateFichaApi()" | kind=code-symbol | source=lib/prevencion/actions.ts:L348 | neighbors=[route.ts, actions.ts]
- "prevencion_actions_updatemedidaapi": "updateMedidaApi()" | kind=code-symbol | source=lib/prevencion/actions.ts:L293 | neighbors=[route.ts, actions.ts]
- "prevencion_actions_updatemedidastatusapi": "updateMedidaStatusApi()" | kind=code-symbol | source=lib/prevencion/actions.ts:L322 | neighbors=[route.ts, actions.ts]
- "prevencion_actions_updatesolicitudapi": "updateSolicitudApi()" | kind=code-symbol | source=lib/prevencion/actions.ts:L401 | neighbors=[route.ts, actions.ts]
- "prevencion_agregarautoridadform_agregarautoridadform": "AgregarAutoridadForm()" | kind=code-symbol | source=components/prevencion/AgregarAutoridadForm.tsx:L26 | neighbors=[page.tsx, AgregarAutoridadForm.tsx]
- "prevencion_busquedasfiltros_busquedasfiltros": "BusquedasFiltros()" | kind=code-symbol | source=components/prevencion/BusquedasFiltros.tsx:L20 | neighbors=[page.tsx, BusquedasFiltros.tsx]
- "prevencion_cancelacionmodal_cancelacionmodal": "CancelacionModal()" | kind=code-symbol | source=components/prevencion/CancelacionModal.tsx:L6 | neighbors=[page.tsx, CancelacionModal.tsx]
- "prevencion_contestacionform_contestacionform": "ContestacionForm()" | kind=code-symbol | source=components/prevencion/ContestacionForm.tsx:L6 | neighbors=[page.tsx, ContestacionForm.tsx]
- "prevencion_juridicofiltros_juridicofiltros": "JuridicoFiltros()" | kind=code-symbol | source=components/prevencion/JuridicoFiltros.tsx:L15 | neighbors=[page.tsx, JuridicoFiltros.tsx]
- "prevencion_mapper_rowtobusqueda": "rowToBusqueda()" | kind=code-symbol | source=lib/prevencion/mapper.ts:L28 | neighbors=[mapper.ts, toStr()]
- "prevencion_mapper_rowtomedida": "rowToMedida()" | kind=code-symbol | source=lib/prevencion/mapper.ts:L15 | neighbors=[mapper.ts, toStr()]
- "prevencion_medidasfiltros_medidasfiltros": "MedidasFiltros()" | kind=code-symbol | source=components/prevencion/MedidasFiltros.tsx:L23 | neighbors=[page.tsx, MedidasFiltros.tsx]
- "prevencion_permisos_accion": "Accion" | kind=code-symbol | source=lib/prevencion/permisos.ts:L6 | neighbors=[actions.ts, permisos.ts]
- "prevencion_permisos_obtenerpermisosusuario": "obtenerPermisosUsuario()" | kind=code-symbol | source=lib/prevencion/permisos.ts:L9 | neighbors=[layout.tsx, permisos.ts]
- "prevencion_permisos_obtenerrolnombre": "obtenerRolNombre()" | kind=code-symbol | source=lib/prevencion/permisos.ts:L38 | neighbors=[permisos.ts, tieneAccesoSeccion()]
- "prevencion_printbutton_printbutton": "PrintButton()" | kind=code-symbol | source=components/prevencion/PrintButton.tsx:L3 | neighbors=[page.tsx, PrintButton.tsx]
- "prevencion_prorrogamodal_prorrogamodal": "ProrrogaModal()" | kind=code-symbol | source=components/prevencion/ProrrogaModal.tsx:L6 | neighbors=[page.tsx, ProrrogaModal.tsx]
- "prevencion_prorrogaviewermodal_prorrogaviewermodal": "ProrrogaViewerModal()" | kind=code-symbol | source=components/prevencion/ProrrogaViewerModal.tsx:L9 | neighbors=[page.tsx, ProrrogaViewerModal.tsx]
- "prevencion_repository_getfichasactivas": "getFichasActivas()" | kind=code-symbol | source=lib/prevencion/repository.ts:L162 | neighbors=[route.ts, repository.ts]
- "prevencion_repository_getfichasbusqueda": "getFichasBusqueda()" | kind=code-symbol | source=lib/prevencion/repository.ts:L40 | neighbors=[page.tsx, repository.ts]
- "prevencion_repository_getfichasbusquedafiltradas": "getFichasBusquedaFiltradas()" | kind=code-symbol | source=lib/prevencion/repository.ts:L177 | neighbors=[route.ts, repository.ts]
- "prevencion_repository_getmedidas": "getMedidas()" | kind=code-symbol | source=lib/prevencion/repository.ts:L5 | neighbors=[page.tsx, repository.ts]
- "prevencion_repository_getmedidasfiltradas": "getMedidasFiltradas()" | kind=code-symbol | source=lib/prevencion/repository.ts:L124 | neighbors=[route.ts, repository.ts]
- "prevencion_repository_getmedidasstats": "getMedidasStats()" | kind=code-symbol | source=lib/prevencion/repository.ts:L28 | neighbors=[page.tsx, repository.ts]
- "prevencion_repository_getseguimientotipos": "getSeguimientoTipos()" | kind=code-symbol | source=lib/prevencion/repository.ts:L169 | neighbors=[route.ts, repository.ts]
- "prevencion_repository_getvisitamedidaids": "getVisitaMedidaIds()" | kind=code-symbol | source=lib/prevencion/repository.ts:L23 | neighbors=[page.tsx, repository.ts]
- "prevencion_repository_listarautoridadesadicionales": "listarAutoridadesAdicionales()" | kind=code-symbol | source=lib/prevencion/repository.ts:L93 | neighbors=[page.tsx, repository.ts]
- "prevencion_repository_listarseguimientos": "listarSeguimientos()" | kind=code-symbol | source=lib/prevencion/repository.ts:L109 | neighbors=[page.tsx, repository.ts]
- "prevencion_repository_listarsolicitudesc4": "listarSolicitudesC4()" | kind=code-symbol | source=lib/prevencion/repository.ts:L61 | neighbors=[page.tsx, repository.ts]
- "prevencion_repository_listarsolicitudesfiltradas": "listarSolicitudesFiltradas()" | kind=code-symbol | source=lib/prevencion/repository.ts:L207 | neighbors=[repository.ts, route.ts]
- "prevencion_repository_listarsolicitudesjuridico": "listarSolicitudesJuridico()" | kind=code-symbol | source=lib/prevencion/repository.ts:L45 | neighbors=[page.tsx, repository.ts]
- "prevencion_repository_listarvisitas": "listarVisitas()" | kind=code-symbol | source=lib/prevencion/repository.ts:L85 | neighbors=[page.tsx, repository.ts]
- "prevencion_repository_listarvisitasconalias": "listarVisitasConAlias()" | kind=code-symbol | source=lib/prevencion/repository.ts:L154 | neighbors=[repository.ts, route.ts]
- "prevencion_repository_obtenercontestacion": "obtenerContestacion()" | kind=code-symbol | source=lib/prevencion/repository.ts:L69 | neighbors=[page.tsx, repository.ts]
- "prevencion_repository_obtenerfichadetalle": "obtenerFichaDetalle()" | kind=code-symbol | source=lib/prevencion/repository.ts:L193 | neighbors=[route.ts, repository.ts]
- "prevencion_repository_obtenermedidadetalle": "obtenerMedidaDetalle()" | kind=code-symbol | source=lib/prevencion/repository.ts:L77 | neighbors=[page.tsx, repository.ts]
- "prevencion_repository_obtenermedidadetallecompleto": "obtenerMedidaDetalleCompleto()" | kind=code-symbol | source=lib/prevencion/repository.ts:L140 | neighbors=[route.ts, repository.ts]
- "prevencion_repository_obtenersolicitud": "obtenerSolicitud()" | kind=code-symbol | source=lib/prevencion/repository.ts:L53 | neighbors=[page.tsx, repository.ts]
- "prevencion_repository_obtenersolicituddetalle": "obtenerSolicitudDetalle()" | kind=code-symbol | source=lib/prevencion/repository.ts:L223 | neighbors=[route.ts, repository.ts]
- "prevencion_seguimientotimeline_seguimientotimeline": "SeguimientoTimeline()" | kind=code-symbol | source=components/prevencion/SeguimientoTimeline.tsx:L15 | neighbors=[page.tsx, SeguimientoTimeline.tsx]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/ugomez/Documents/GitHub/seguridad_publica/.graphify/description-instructions/batch-050.json

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
