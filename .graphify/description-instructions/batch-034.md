# Node Description Batch 35 of 79

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

- "agente_juzgado_repository_obtenerdetalleasegurado": "obtenerDetalleAsegurado()" | kind=code-symbol | source=lib/agente_juzgado/repository.ts:L177 | neighbors=[repository.ts, service.ts]
- "agente_juzgado_repository_obtenerdetalleinfraccionviajuzgado": "obtenerDetalleInfraccionViaJuzgado()" | kind=code-symbol | source=lib/agente_juzgado/repository.ts:L316 | neighbors=[repository.ts, service.ts]
- "agente_juzgado_repository_obtenerevidenciasmonitorista": "obtenerEvidenciasMonitorista()" | kind=code-symbol | source=lib/agente_juzgado/repository.ts:L160 | neighbors=[repository.ts, page.tsx]
- "agente_juzgado_repository_obtenerrolusuario": "obtenerRolUsuario()" | kind=code-symbol | source=lib/agente_juzgado/repository.ts:L12 | neighbors=[repository.ts, service.ts]
- "agente_juzgado_repository_obtenersolicitudescerradas": "obtenerSolicitudesCerradas()" | kind=code-symbol | source=lib/agente_juzgado/repository.ts:L72 | neighbors=[repository.ts, service.ts]
- "agente_juzgado_repository_obtenersolicitudescompletadas": "obtenerSolicitudesCompletadas()" | kind=code-symbol | source=lib/agente_juzgado/repository.ts:L60 | neighbors=[repository.ts, service.ts]
- "agente_juzgado_repository_obtenersolicitudesconmonitorista": "obtenerSolicitudesConMonitorista()" | kind=code-symbol | source=lib/agente_juzgado/repository.ts:L48 | neighbors=[repository.ts, service.ts]
- "agente_juzgado_repository_obtenersolicitudesenrevision": "obtenerSolicitudesEnRevision()" | kind=code-symbol | source=lib/agente_juzgado/repository.ts:L36 | neighbors=[repository.ts, service.ts]
- "agente_juzgado_repository_obtenersolicitudesrecepcionadas": "obtenerSolicitudesRecepcionadas()" | kind=code-symbol | source=lib/agente_juzgado/repository.ts:L24 | neighbors=[repository.ts, service.ts]
- "agente_juzgado_service_cerrarcaso": "cerrarCaso()" | kind=code-symbol | source=lib/agente_juzgado/service.ts:L60 | neighbors=[actions.ts, service.ts]
- "agente_juzgado_service_guardardetallesasegurado": "guardarDetallesAsegurado()" | kind=code-symbol | source=lib/agente_juzgado/service.ts:L68 | neighbors=[actions.ts, service.ts]
- "agente_juzgado_service_listaraseguradosjuzgadosvc": "listarAseguradosJuzgadoSvc()" | kind=code-symbol | source=lib/agente_juzgado/service.ts:L92 | neighbors=[actions.ts, service.ts]
- "agente_juzgado_service_listarsolicitudescompletadas": "listarSolicitudesCompletadas()" | kind=code-symbol | source=lib/agente_juzgado/service.ts:L42 | neighbors=[actions.ts, service.ts]
- "agente_juzgado_service_listarsolicitudesconmonitorista": "listarSolicitudesConMonitorista()" | kind=code-symbol | source=lib/agente_juzgado/service.ts:L37 | neighbors=[actions.ts, service.ts]
- "agente_juzgado_service_listarsolicitudesenrevision": "listarSolicitudesEnRevision()" | kind=code-symbol | source=lib/agente_juzgado/service.ts:L32 | neighbors=[actions.ts, service.ts]
- "agente_juzgado_service_listarsolicitudesrecepcionadas": "listarSolicitudesRecepcionadas()" | kind=code-symbol | source=lib/agente_juzgado/service.ts:L27 | neighbors=[actions.ts, service.ts]
- "agente_juzgado_service_obtenerliberacionesjuzgado": "obtenerLiberacionesJuzgado()" | kind=code-symbol | source=lib/agente_juzgado/service.ts:L76 | neighbors=[actions.ts, service.ts]
- "agente_juzgado_service_pedirevidencias": "pedirEvidencias()" | kind=code-symbol | source=lib/agente_juzgado/service.ts:L56 | neighbors=[actions.ts, service.ts]
- "agente_juzgado_service_tomarcaso": "tomarCaso()" | kind=code-symbol | source=lib/agente_juzgado/service.ts:L52 | neighbors=[actions.ts, service.ts]
- "agente_juzgado_subirfotodetenido_subirfotodetenido": "SubirFotoDetenido()" | kind=code-symbol | source=components/agente_juzgado/SubirFotoDetenido.tsx:L33 | neighbors=[SubirFotoDetenido.tsx, page.tsx]
- "agente_juzgado_tabsolicitudes_tabsolicitudes": "TabSolicitudes()" | kind=code-symbol | source=components/agente_juzgado/TabSolicitudes.tsx:L35 | neighbors=[TabSolicitudes.tsx, page.tsx]
- "agente_juzgado_toastexito_toastexito": "ToastExito()" | kind=code-symbol | source=components/agente_juzgado/ToastExito.tsx:L6 | neighbors=[page.tsx, ToastExito.tsx]
- "agente_juzgado_tomarcasomodal_tomarcasoboton": "TomarCasoBoton()" | kind=code-symbol | source=components/agente_juzgado/TomarCasoModal.tsx:L6 | neighbors=[TabSolicitudes.tsx, TomarCasoModal.tsx]
- "agente_juzgado_types_rolrow": "RolRow" | kind=code-symbol | source=lib/agente_juzgado/types.ts:L46 | neighbors=[repository.ts, types.ts]
- "agente_juzgado_types_userinfo": "UserInfo" | kind=code-symbol | source=lib/agente_juzgado/types.ts:L40 | neighbors=[actions.ts, types.ts]
- "agente_liberaciones_actions_capturarinfractoraction": "capturarInfractorAction()" | kind=code-symbol | source=lib/agente_liberaciones/actions.ts:L38 | neighbors=[actions.ts, CapturarInfractorSection.tsx]
- "agente_liberaciones_actions_finalizarrevisionaction": "finalizarRevisionAction()" | kind=code-symbol | source=lib/agente_liberaciones/actions.ts:L216 | neighbors=[actions.ts, RevisionDocumentosSection.tsx]
- "agente_liberaciones_actions_obtenerdetalleinfraccionliberaciones": "obtenerDetalleInfraccionLiberaciones()" | kind=code-symbol | source=lib/agente_liberaciones/actions.ts:L336 | neighbors=[actions.ts, page.tsx]
- "agente_liberaciones_actions_obtenerdocumentosliberacion": "obtenerDocumentosLiberacion()" | kind=code-symbol | source=lib/agente_liberaciones/actions.ts:L124 | neighbors=[actions.ts, RevisionDocumentosSection.tsx]
- "agente_liberaciones_actions_revisardocumentoaction": "revisarDocumentoAction()" | kind=code-symbol | source=lib/agente_liberaciones/actions.ts:L181 | neighbors=[actions.ts, RevisionDocumentosSection.tsx]
- "agente_liberaciones_mapper_rowtoliberacion": "rowToLiberacion()" | kind=code-symbol | source=lib/agente_liberaciones/mapper.ts:L8 | neighbors=[mapper.ts, service.ts]
- "agente_liberaciones_repository_obtenerliberaciones": "obtenerLiberaciones()" | kind=code-symbol | source=lib/agente_liberaciones/repository.ts:L16 | neighbors=[repository.ts, service.ts]
- "agente_liberaciones_repository_obtenerrolusuario": "obtenerRolUsuario()" | kind=code-symbol | source=lib/agente_liberaciones/repository.ts:L4 | neighbors=[repository.ts, service.ts]
- "agente_liberaciones_service_listarliberaciones": "listarLiberaciones()" | kind=code-symbol | source=lib/agente_liberaciones/service.ts:L10 | neighbors=[actions.ts, service.ts]
- "agente_liberaciones_service_verificarrolliberaciones": "verificarRolLiberaciones()" | kind=code-symbol | source=lib/agente_liberaciones/service.ts:L5 | neighbors=[actions.ts, service.ts]
- "agente_liberaciones_types_liberacionesresponse": "LiberacionesResponse" | kind=code-symbol | source=lib/agente_liberaciones/types.ts:L24 | neighbors=[actions.ts, types.ts]
- "agente_liberaciones_types_rolrow": "RolRow" | kind=code-symbol | source=lib/agente_liberaciones/types.ts:L7 | neighbors=[repository.ts, types.ts]
- "agente_liberaciones_types_userinfo": "UserInfo" | kind=code-symbol | source=lib/agente_liberaciones/types.ts:L1 | neighbors=[actions.ts, types.ts]
- "analisis_permisos_secciones": "SECCIONES" | kind=code-symbol | source=lib/analisis/permisos.ts:L5 | neighbors=[permisos.ts, registro.ts]
- "auth_helpers_rowtouserwithrole": "rowToUserWithRole()" | kind=code-symbol | source=lib/auth/helpers.ts:L13 | neighbors=[helpers.ts, getUserWithRole()]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/cesarbr/Documents/dev/sjr/seguridad_publica/.graphify/description-instructions/batch-034.json

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
