# Node Description Batch 28 of 89

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
For an entity node (any other kind — e.g. a person, place, event, object),
describe what the entity is and its role, grounded in its type, its
relations (neighbors) and the provided citations/evidence — e.g.
"Lady Carfax, a wealthy heiress who disappears en route to Lausanne.".
Ground entity descriptions in the citations/evidence when present; do not
speculate beyond the context, so a node with no supporting context may be
left out of the reply.
Write every description in English (en). Do not switch languages.
No marketing language.
Respond ONLY with a JSON object mapping each node id (as a string) to its
one-sentence description — no prose, no markdown fences.

- "admin_types_usuariolista": "UsuarioLista" | kind=code-symbol | source=lib/admin/types.ts:L1 | neighbors=[mapper.ts, repository.ts, types.ts]
- "agente_infracciones_actions_obtenerdetalleinfraccioninfracciones": "obtenerDetalleInfraccionInfracciones()" | kind=code-symbol | source=lib/agente_infracciones/actions.ts:L37 | neighbors=[actions.ts, ModalEntregarGarantia.tsx, page.tsx]
- "agente_infracciones_mapper_inputtodbparams": "inputToDbParams()" | kind=code-symbol | source=lib/agente_infracciones/mapper.ts:L28 | neighbors=[mapper.ts, nvl(), repository.ts]
- "agente_infracciones_types_capturainfractorresult": "CapturaInfractorResult" | kind=code-symbol | source=lib/agente_infracciones/types.ts:L48 | neighbors=[actions.ts, service.ts, types.ts]
- "agente_infracciones_types_liberacionrow": "LiberacionRow" | kind=code-symbol | source=lib/agente_infracciones/types.ts:L11 | neighbors=[mapper.ts, service.ts, types.ts]
- "agente_juzgado_actions_obtenerdetalleinfraccionviaactionjuzgado": "obtenerDetalleInfraccionViaActionJuzgado()" | kind=code-symbol | source=lib/agente_juzgado/actions.ts:L269 | neighbors=[actions.ts, JuzgadoDashboard.tsx, page.tsx]
- "agente_juzgado_capturardetallesform_capturardetallesform": "CapturarDetallesForm()" | kind=code-symbol | source=components/agente_juzgado/CapturarDetallesForm.tsx:L62 | neighbors=[CapturarDetallesForm.tsx, emptyItem(), page.tsx]
- "agente_juzgado_formularioaseguradojuzgado_formularioaseguradojuzgado": "FormularioAseguradoJuzgado()" | kind=code-symbol | source=components/agente_juzgado/FormularioAseguradoJuzgado.tsx:L59 | neighbors=[FormularioAseguradoJuzgado.tsx, concatNombre(), displayVal()]
- "agente_juzgado_mapper_rowtosolicitud": "rowToSolicitud()" | kind=code-symbol | source=lib/agente_juzgado/mapper.ts:L21 | neighbors=[mapper.ts, num(), service.ts]
- "agente_juzgado_service_finalizarprocesojuzgadosvc": "finalizarProcesoJuzgadoSvc()" | kind=code-symbol | source=lib/agente_juzgado/service.ts:L88 | neighbors=[actions.ts, service.ts, route.ts]
- "agente_juzgado_service_iniciarprocesojuzgadosvc": "iniciarProcesoJuzgadoSvc()" | kind=code-symbol | source=lib/agente_juzgado/service.ts:L84 | neighbors=[actions.ts, service.ts, route.ts]
- "agente_juzgado_service_obtenerdatosasegurado": "obtenerDatosAsegurado()" | kind=code-symbol | source=lib/agente_juzgado/service.ts:L64 | neighbors=[actions.ts, service.ts, page.tsx]
- "agente_juzgado_service_verificarroljuzgado": "verificarRolJuzgado()" | kind=code-symbol | source=lib/agente_juzgado/service.ts:L22 | neighbors=[actions.ts, service.ts, page.tsx]
- "agente_juzgado_types_evidenciamonitorista": "EvidenciaMonitorista" | kind=code-symbol | source=lib/agente_juzgado/types.ts:L1 | neighbors=[DetallesAseguradoView.tsx, repository.ts, types.ts]
- "agente_liberaciones_actions_generarordenpagoaction": "generarOrdenPagoAction()" | kind=code-symbol | source=lib/agente_liberaciones/actions.ts:L362 | neighbors=[actions.ts, CapturarInfractorSection.tsx, RevisionDocumentosSection.tsx]
- "agente_liberaciones_actions_obtenerdashboardliberaciones": "obtenerDashboardLiberaciones()" | kind=code-symbol | source=lib/agente_liberaciones/actions.ts:L11 | neighbors=[actions.ts, page.tsx, page.tsx]
- "agente_liberaciones_actions_obtenerliberaciones": "obtenerLiberaciones()" | kind=code-symbol | source=lib/agente_liberaciones/actions.ts:L27 | neighbors=[actions.ts, page.tsx, page.tsx]
- "agente_liberaciones_profiledropdown_profiledropdown": "ProfileDropdown()" | kind=code-symbol | source=components/agente_liberaciones/ProfileDropdown.tsx:L14 | neighbors=[page.tsx, ProfileDropdown.tsx, page.tsx]
- "agente_liberaciones_types_liberacionrow": "LiberacionRow" | kind=code-symbol | source=lib/agente_liberaciones/types.ts:L11 | neighbors=[mapper.ts, service.ts, types.ts]
- "app_page": "page.tsx" | kind=code-symbol | source=app/page.tsx:L1 | neighbors=[RootPage(), 6a042cd feat: sistema de autenticación,…, 90da1ca Initial commit from Create Next…]
- "auxiliar_actions_upsertchecklistaction": "upsertChecklistAction()" | kind=code-symbol | source=lib/auxiliar/actions.ts:L20 | neighbors=[actions.ts, requireAuxiliar(), page.tsx]
- "auxiliar_mapper_rowtocuestionariorobo": "rowToCuestionarioRobo()" | kind=code-symbol | source=lib/auxiliar/mapper.ts:L66 | neighbors=[mapper.ts, toStr(), repository.ts]
- "auxiliar_permisos_tieneaccesoauxiliar": "tieneAccesoAuxiliar()" | kind=code-symbol | source=lib/auxiliar/permisos.ts:L29 | neighbors=[permisos.ts, tienePermiso(), verificarAccesoAuxiliarApi()]
- "auxiliar_service_listarcuestionariosrobo": "listarCuestionariosRobo()" | kind=code-symbol | source=lib/auxiliar/service.ts:L9 | neighbors=[service.ts, page.tsx, route.ts]
- "auxiliar_service_listarparesreporte": "listarParesReporte()" | kind=code-symbol | source=lib/auxiliar/service.ts:L5 | neighbors=[service.ts, page.tsx, page.tsx]
- "auxiliar_types_auxchecklist": "AuxChecklist" | kind=code-symbol | source=lib/auxiliar/types.ts:L1 | neighbors=[mapper.ts, repository.ts, types.ts]
- "auxiliar_types_auxcuestionariorobo": "AuxCuestionarioRobo" | kind=code-symbol | source=lib/auxiliar/types.ts:L36 | neighbors=[mapper.ts, repository.ts, types.ts]
- "auxiliar_types_auxparreporte": "AuxParReporte" | kind=code-symbol | source=lib/auxiliar/types.ts:L21 | neighbors=[mapper.ts, repository.ts, types.ts]
- "auxiliar_types_upsertchecklistinput": "UpsertChecklistInput" | kind=code-symbol | source=lib/auxiliar/types.ts:L51 | neighbors=[repository.ts, service.ts, types.ts]
- "camara_mapper_rowtototalescamara": "rowToTotalesCamara()" | kind=code-symbol | source=lib/camara/mapper.ts:L42 | neighbors=[mapper.ts, toNumNullable(), repository.ts]
- "camara_repository_obtenertotalescamara": "obtenerTotalesCamara()" | kind=code-symbol | source=lib/camara/repository.ts:L34 | neighbors=[repository.ts, service.ts, route.ts]
- "camara_types_totalescamara": "TotalesCamara" | kind=code-symbol | source=lib/camara/types.ts:L20 | neighbors=[mapper.ts, repository.ts, types.ts]
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@de6da3e68d15f705aa9ce7a50a1ab081a74acccd": "de6da3e mejorando despacho" | kind=Commit | source=git | neighbors=[6c646af fix loader bug en login, feature/testing, 3c12c41 cambios en flujo de 911-despacho]
- "components_buttonverdetalles_botonverdetalle": "BotonVerDetalle()" | kind=code-symbol | source=features/compartido/components/ButtonVerDetalles.tsx:L11 | neighbors=[InfraccionesDashboard.tsx, LiberacionesDashboard.tsx, ButtonVerDetalles.tsx]
- "components_mapadireccionregistro_cleancolonianame": "cleanColoniaName()" | kind=code-symbol | source=features/via/oficiales/components/MapaDireccionRegistro.tsx:L37 | neighbors=[MapaDireccionRegistro.tsx, normalizeUpper(), extractNeighborhoodFromComponents()]
- "components_mapadireccionregistro_extractneighborhoodfromcomponents": "extractNeighborhoodFromComponents()" | kind=code-symbol | source=features/via/oficiales/components/MapaDireccionRegistro.tsx:L60 | neighbors=[MapaDireccionRegistro.tsx, extractAddress(), cleanColoniaName()]
- "components_mapadireccionregistro_normalizeupper": "normalizeUpper()" | kind=code-symbol | source=features/via/oficiales/components/MapaDireccionRegistro.tsx:L30 | neighbors=[MapaDireccionRegistro.tsx, cleanColoniaName(), getMunicipioEstado()]
- "corralon_actions_obtenerdashboardcorralon": "obtenerDashboardCorralon()" | kind=code-symbol | source=lib/corralon/actions.ts:L10 | neighbors=[actions.ts, page.tsx, page.tsx]
- "corralon_actions_obtenersolicitudes": "obtenerSolicitudes()" | kind=code-symbol | source=lib/corralon/actions.ts:L31 | neighbors=[actions.ts, page.tsx, page.tsx]
- "corralon_mapper_rowtosolicitud": "rowToSolicitud()" | kind=code-symbol | source=lib/corralon/mapper.ts:L8 | neighbors=[mapper.ts, toStr(), service.ts]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/ugomez/Documents/GitHub/seguridad_publica/.graphify/description-instructions/batch-027.json

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
