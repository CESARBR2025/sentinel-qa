# Node Description Batch 43 of 93

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

- "fiscalia_formulariopuestadisposicion_formulariopuestadisposicion": "FormularioPuestaDisposicion()" | kind=code-symbol | source=components/fiscalia/FormularioPuestaDisposicion.tsx:L45 | neighbors=[FormularioPuestaDisposicion.tsx, page.tsx]
- "fiscalia_fotosexpedientesection_fotosexpedientesection": "FotosExpedienteSection()" | kind=code-symbol | source=components/fiscalia/FotosExpedienteSection.tsx:L49 | neighbors=[FotosExpedienteSection.tsx, page.tsx]
- "fiscalia_mapper_num": "num()" | kind=code-symbol | source=lib/fiscalia/mapper.ts:L15 | neighbors=[mapper.ts, rowToSolicitud()]
- "fiscalia_mapper_rowtodetalledetenidoguardado": "rowToDetalleDetenidoGuardado()" | kind=code-symbol | source=lib/fiscalia/mapper.ts:L186 | neighbors=[mapper.ts, repository.ts]
- "fiscalia_mapper_rowtopuestadisposicion": "rowToPuestaDisposicion()" | kind=code-symbol | source=lib/fiscalia/mapper.ts:L201 | neighbors=[mapper.ts, repository.ts]
- "fiscalia_permisos_tienepermiso": "tienePermiso()" | kind=code-symbol | source=lib/fiscalia/permisos.ts:L8 | neighbors=[permisos.ts, service.ts]
- "fiscalia_printbutton_printbutton": "PrintButton()" | kind=code-symbol | source=components/fiscalia/PrintButton.tsx:L5 | neighbors=[PrintButton.tsx, page.tsx]
- "fiscalia_repository_actualizardetallesasegurado": "actualizarDetallesAsegurado()" | kind=code-symbol | source=lib/fiscalia/repository.ts:L199 | neighbors=[repository.ts, service.ts]
- "fiscalia_repository_actualizarestadosolicitud": "actualizarEstadoSolicitud()" | kind=code-symbol | source=lib/fiscalia/repository.ts:L63 | neighbors=[repository.ts, service.ts]
- "fiscalia_repository_actualizarsolicitudconevidencias": "actualizarSolicitudConEvidencias()" | kind=code-symbol | source=lib/fiscalia/repository.ts:L248 | neighbors=[repository.ts, service.ts]
- "fiscalia_repository_guardardetenidosdirecciones": "guardarDetenidosDirecciones()" | kind=code-symbol | source=lib/fiscalia/repository.ts:L412 | neighbors=[repository.ts, service.ts]
- "fiscalia_repository_guardarpuestadisposicion": "guardarPuestaDisposicion()" | kind=code-symbol | source=lib/fiscalia/repository.ts:L648 | neighbors=[repository.ts, service.ts]
- "fiscalia_repository_insertarfotofiscalia": "insertarFotoFiscalia()" | kind=code-symbol | source=lib/fiscalia/repository.ts:L559 | neighbors=[repository.ts, route.ts]
- "fiscalia_repository_listarasegurados": "listarAsegurados()" | kind=code-symbol | source=lib/fiscalia/repository.ts:L338 | neighbors=[repository.ts, service.ts]
- "fiscalia_repository_listaraseguradoscondisposicion": "listarAseguradosConDisposicion()" | kind=code-symbol | source=lib/fiscalia/repository.ts:L521 | neighbors=[repository.ts, service.ts]
- "fiscalia_repository_listarliberaciones": "listarLiberaciones()" | kind=code-symbol | source=lib/fiscalia/repository.ts:L482 | neighbors=[repository.ts, service.ts]
- "fiscalia_repository_obtenerdetalleasegurado": "obtenerDetalleAsegurado()" | kind=code-symbol | source=lib/fiscalia/repository.ts:L76 | neighbors=[repository.ts, service.ts]
- "fiscalia_repository_obtenerdetalleaseguradocompleto": "obtenerDetalleAseguradoCompleto()" | kind=code-symbol | source=lib/fiscalia/repository.ts:L367 | neighbors=[repository.ts, service.ts]
- "fiscalia_repository_obtenerdetalleinfraccionvia": "obtenerDetalleInfraccionVia()" | kind=code-symbol | source=lib/fiscalia/repository.ts:L263 | neighbors=[repository.ts, service.ts]
- "fiscalia_repository_obtenerevidenciasmonitorista": "obtenerEvidenciasMonitorista()" | kind=code-symbol | source=lib/fiscalia/repository.ts:L231 | neighbors=[repository.ts, page.tsx]
- "fiscalia_repository_obtenerexpedientecompleto": "obtenerExpedienteCompleto()" | kind=code-symbol | source=lib/fiscalia/repository.ts:L583 | neighbors=[repository.ts, page.tsx]
- "fiscalia_repository_obtenerfotosdetenidos": "obtenerFotosDetenidos()" | kind=code-symbol | source=lib/fiscalia/repository.ts:L575 | neighbors=[repository.ts, page.tsx]
- "fiscalia_repository_obtenerpuestadisposicionporreporte": "obtenerPuestaDisposicionPorReporte()" | kind=code-symbol | source=lib/fiscalia/repository.ts:L551 | neighbors=[repository.ts, service.ts]
- "fiscalia_repository_obtenerrolusuario": "obtenerRolUsuario()" | kind=code-symbol | source=lib/fiscalia/repository.ts:L13 | neighbors=[repository.ts, service.ts]
- "fiscalia_repository_obtenersolicitudescompletadas": "obtenerSolicitudesCompletadas()" | kind=code-symbol | source=lib/fiscalia/repository.ts:L96 | neighbors=[repository.ts, service.ts]
- "fiscalia_repository_obtenersolicitudesconevidencias": "obtenerSolicitudesConEvidencias()" | kind=code-symbol | source=lib/fiscalia/repository.ts:L50 | neighbors=[repository.ts, service.ts]
- "fiscalia_repository_obtenersolicitudesconmonitorista": "obtenerSolicitudesConMonitorista()" | kind=code-symbol | source=lib/fiscalia/repository.ts:L83 | neighbors=[repository.ts, service.ts]
- "fiscalia_repository_obtenersolicitudesenproceso": "obtenerSolicitudesEnProceso()" | kind=code-symbol | source=lib/fiscalia/repository.ts:L70 | neighbors=[repository.ts, service.ts]
- "fiscalia_repository_obtenersolicitudesfinalizadas": "obtenerSolicitudesFinalizadas()" | kind=code-symbol | source=lib/fiscalia/repository.ts:L38 | neighbors=[repository.ts, service.ts]
- "fiscalia_repository_obtenersolicitudespendientes": "obtenerSolicitudesPendientes()" | kind=code-symbol | source=lib/fiscalia/repository.ts:L12 | neighbors=[repository.ts, service.ts]
- "fiscalia_repository_obtenersolicitudessinevidencias": "obtenerSolicitudesSinEvidencias()" | kind=code-symbol | source=lib/fiscalia/repository.ts:L25 | neighbors=[repository.ts, service.ts]
- "fiscalia_service_guardardetallesasegurado": "guardarDetallesAsegurado()" | kind=code-symbol | source=lib/fiscalia/service.ts:L66 | neighbors=[actions.ts, service.ts]
- "fiscalia_service_listaraseguradoscompletados": "listarAseguradosCompletados()" | kind=code-symbol | source=lib/fiscalia/service.ts:L82 | neighbors=[actions.ts, service.ts]
- "fiscalia_service_listaraseguradospendientes": "listarAseguradosPendientes()" | kind=code-symbol | source=lib/fiscalia/service.ts:L78 | neighbors=[actions.ts, service.ts]
- "fiscalia_service_listarsolicitudescompletadas": "listarSolicitudesCompletadas()" | kind=code-symbol | source=lib/fiscalia/service.ts:L54 | neighbors=[actions.ts, service.ts]
- "fiscalia_service_listarsolicitudesconevidencias": "listarSolicitudesConEvidencias()" | kind=code-symbol | source=lib/fiscalia/service.ts:L49 | neighbors=[actions.ts, service.ts]
- "fiscalia_service_listarsolicitudesconmonitorista": "listarSolicitudesConMonitorista()" | kind=code-symbol | source=lib/fiscalia/service.ts:L49 | neighbors=[actions.ts, service.ts]
- "fiscalia_service_listarsolicitudesenproceso": "listarSolicitudesEnProceso()" | kind=code-symbol | source=lib/fiscalia/service.ts:L40 | neighbors=[actions.ts, service.ts]
- "fiscalia_service_listarsolicitudesfinalizadas": "listarSolicitudesFinalizadas()" | kind=code-symbol | source=lib/fiscalia/service.ts:L44 | neighbors=[actions.ts, service.ts]
- "fiscalia_service_listarsolicitudespendientes": "listarSolicitudesPendientes()" | kind=code-symbol | source=lib/fiscalia/service.ts:L34 | neighbors=[actions.ts, service.ts]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/ugomez/Documents/GitHub/seguridad_publica/.graphify/description-instructions/batch-042.json

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
