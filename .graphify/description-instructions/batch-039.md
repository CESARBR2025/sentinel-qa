# Node Description Batch 40 of 93

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

- "agente_juzgado_repository_obtenersolicitudesenrevision": "obtenerSolicitudesEnRevision()" | kind=code-symbol | source=lib/agente_juzgado/repository.ts:L23 | neighbors=[repository.ts, service.ts]
- "agente_juzgado_repository_obtenersolicitudesrecepcionadas": "obtenerSolicitudesRecepcionadas()" | kind=code-symbol | source=lib/agente_juzgado/repository.ts:L11 | neighbors=[repository.ts, service.ts]
- "agente_juzgado_service_cerrarcaso": "cerrarCaso()" | kind=code-symbol | source=lib/agente_juzgado/service.ts:L59 | neighbors=[actions.ts, service.ts]
- "agente_juzgado_service_guardardetallesasegurado": "guardarDetallesAsegurado()" | kind=code-symbol | source=lib/agente_juzgado/service.ts:L67 | neighbors=[actions.ts, service.ts]
- "agente_juzgado_service_listaraseguradosjuzgadosvc": "listarAseguradosJuzgadoSvc()" | kind=code-symbol | source=lib/agente_juzgado/service.ts:L91 | neighbors=[actions.ts, service.ts]
- "agente_juzgado_service_listarsolicitudescompletadas": "listarSolicitudesCompletadas()" | kind=code-symbol | source=lib/agente_juzgado/service.ts:L41 | neighbors=[actions.ts, service.ts]
- "agente_juzgado_service_listarsolicitudesconmonitorista": "listarSolicitudesConMonitorista()" | kind=code-symbol | source=lib/agente_juzgado/service.ts:L36 | neighbors=[actions.ts, service.ts]
- "agente_juzgado_service_listarsolicitudesenrevision": "listarSolicitudesEnRevision()" | kind=code-symbol | source=lib/agente_juzgado/service.ts:L31 | neighbors=[actions.ts, service.ts]
- "agente_juzgado_service_listarsolicitudesrecepcionadas": "listarSolicitudesRecepcionadas()" | kind=code-symbol | source=lib/agente_juzgado/service.ts:L26 | neighbors=[actions.ts, service.ts]
- "agente_juzgado_service_obtenerliberacionesjuzgado": "obtenerLiberacionesJuzgado()" | kind=code-symbol | source=lib/agente_juzgado/service.ts:L75 | neighbors=[actions.ts, service.ts]
- "agente_juzgado_service_pedirevidencias": "pedirEvidencias()" | kind=code-symbol | source=lib/agente_juzgado/service.ts:L55 | neighbors=[actions.ts, service.ts]
- "agente_juzgado_service_tomarcaso": "tomarCaso()" | kind=code-symbol | source=lib/agente_juzgado/service.ts:L51 | neighbors=[actions.ts, service.ts]
- "agente_juzgado_subirfotodetenido_subirfotodetenido": "SubirFotoDetenido()" | kind=code-symbol | source=components/agente_juzgado/SubirFotoDetenido.tsx:L33 | neighbors=[SubirFotoDetenido.tsx, page.tsx]
- "agente_juzgado_tabsolicitudes_tabsolicitudes": "TabSolicitudes()" | kind=code-symbol | source=components/agente_juzgado/TabSolicitudes.tsx:L35 | neighbors=[TabSolicitudes.tsx, page.tsx]
- "agente_juzgado_toastexito_toastexito": "ToastExito()" | kind=code-symbol | source=components/agente_juzgado/ToastExito.tsx:L6 | neighbors=[page.tsx, ToastExito.tsx]
- "agente_juzgado_tomarcasomodal_tomarcasoboton": "TomarCasoBoton()" | kind=code-symbol | source=components/agente_juzgado/TomarCasoModal.tsx:L6 | neighbors=[TabSolicitudes.tsx, TomarCasoModal.tsx]
- "agente_juzgado_types_rolrow": "RolRow" | kind=code-symbol | source=lib/agente_juzgado/types.ts:L46 | neighbors=[types.ts, repository.ts]
- "agente_juzgado_types_userinfo": "UserInfo" | kind=code-symbol | source=lib/agente_juzgado/types.ts:L40 | neighbors=[actions.ts, types.ts]
- "agente_liberaciones_actions_capturarinfractoraction": "capturarInfractorAction()" | kind=code-symbol | source=lib/agente_liberaciones/actions.ts:L38 | neighbors=[actions.ts, CapturarInfractorSection.tsx]
- "agente_liberaciones_actions_finalizarrevisionaction": "finalizarRevisionAction()" | kind=code-symbol | source=lib/agente_liberaciones/actions.ts:L216 | neighbors=[actions.ts, RevisionDocumentosSection.tsx]
- "agente_liberaciones_actions_obtenerdetalleinfraccionliberaciones": "obtenerDetalleInfraccionLiberaciones()" | kind=code-symbol | source=lib/agente_liberaciones/actions.ts:L336 | neighbors=[actions.ts, page.tsx]
- "agente_liberaciones_actions_obtenerdocumentosliberacion": "obtenerDocumentosLiberacion()" | kind=code-symbol | source=lib/agente_liberaciones/actions.ts:L124 | neighbors=[actions.ts, RevisionDocumentosSection.tsx]
- "agente_liberaciones_actions_revisardocumentoaction": "revisarDocumentoAction()" | kind=code-symbol | source=lib/agente_liberaciones/actions.ts:L181 | neighbors=[actions.ts, RevisionDocumentosSection.tsx]
- "agente_liberaciones_mapper_rowtoliberacion": "rowToLiberacion()" | kind=code-symbol | source=lib/agente_liberaciones/mapper.ts:L8 | neighbors=[mapper.ts, service.ts]
- "agente_liberaciones_permisos_tienepermiso": "tienePermiso()" | kind=code-symbol | source=lib/agente_liberaciones/permisos.ts:L8 | neighbors=[permisos.ts, service.ts]
- "agente_liberaciones_repository_obtenerliberaciones": "obtenerLiberaciones()" | kind=code-symbol | source=lib/agente_liberaciones/repository.ts:L3 | neighbors=[repository.ts, service.ts]
- "agente_liberaciones_repository_obtenerrolusuario": "obtenerRolUsuario()" | kind=code-symbol | source=lib/agente_liberaciones/repository.ts:L4 | neighbors=[repository.ts, service.ts]
- "agente_liberaciones_service_listarliberaciones": "listarLiberaciones()" | kind=code-symbol | source=lib/agente_liberaciones/service.ts:L10 | neighbors=[actions.ts, service.ts]
- "agente_liberaciones_types_liberacionesresponse": "LiberacionesResponse" | kind=code-symbol | source=lib/agente_liberaciones/types.ts:L24 | neighbors=[actions.ts, types.ts]
- "agente_liberaciones_types_rolrow": "RolRow" | kind=code-symbol | source=lib/agente_liberaciones/types.ts:L7 | neighbors=[types.ts, repository.ts]
- "agente_liberaciones_types_userinfo": "UserInfo" | kind=code-symbol | source=lib/agente_liberaciones/types.ts:L1 | neighbors=[actions.ts, types.ts]
- "analisis_permisos_secciones": "SECCIONES" | kind=code-symbol | source=lib/analisis/permisos.ts:L4 | neighbors=[permisos.ts, registro.ts]
- "auth_helpers_rowtouserwithrole": "rowToUserWithRole()" | kind=code-symbol | source=lib/auth/helpers.ts:L14 | neighbors=[helpers.ts, getUserWithRole()]
- "auxiliar_actions_requireauxiliar": "requireAuxiliar()" | kind=code-symbol | source=lib/auxiliar/actions.ts:L10 | neighbors=[actions.ts, upsertChecklistAction()]
- "auxiliar_permisos_accion": "Accion" | kind=code-symbol | source=lib/auxiliar/permisos.ts:L6 | neighbors=[actions.ts, permisos.ts]
- "auxiliar_permisos_secciones": "SECCIONES" | kind=code-symbol | source=lib/auxiliar/permisos.ts:L4 | neighbors=[permisos.ts, registro.ts]
- "auxiliar_profiledropdownauxiliar_profiledropdownauxiliar": "ProfileDropdownAuxiliar()" | kind=code-symbol | source=components/auxiliar/ProfileDropdownAuxiliar.tsx:L14 | neighbors=[ProfileDropdownAuxiliar.tsx, page.tsx]
- "auxiliar_repository_obtenercuestionariosrobo": "obtenerCuestionariosRobo()" | kind=code-symbol | source=lib/auxiliar/repository.ts:L47 | neighbors=[repository.ts, service.ts]
- "auxiliar_repository_obtenerparesreporte": "obtenerParesReporte()" | kind=code-symbol | source=lib/auxiliar/repository.ts:L5 | neighbors=[repository.ts, service.ts]
- "auxiliar_repository_upsertchecklist": "upsertChecklist()" | kind=code-symbol | source=lib/auxiliar/repository.ts:L72 | neighbors=[repository.ts, service.ts]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/ugomez/Documents/GitHub/seguridad_publica/.graphify/description-instructions/batch-039.json

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
