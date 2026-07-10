# Node Description Batch 39 of 82

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

- "fiscalia_expediente_obtenertokenfiscalia": "obtenerTokenFiscalia()" | kind=code-symbol | source=lib/fiscalia/expediente.ts:L10 | neighbors=[expediente.ts, subirArchivoFiscalia()]
- "fiscalia_formularioasegurado_displayval": "displayVal()" | kind=code-symbol | source=components/fiscalia/FormularioAsegurado.tsx:L59 | neighbors=[FormularioAsegurado.tsx, FormularioAsegurado()]
- "fiscalia_formulariopuestadisposicion_formulariopuestadisposicion": "FormularioPuestaDisposicion()" | kind=code-symbol | source=components/fiscalia/FormularioPuestaDisposicion.tsx:L45 | neighbors=[FormularioPuestaDisposicion.tsx, page.tsx]
- "fiscalia_mapper_num": "num()" | kind=code-symbol | source=lib/fiscalia/mapper.ts:L15 | neighbors=[mapper.ts, rowToSolicitud()]
- "fiscalia_mapper_rowtodetalledetenidoguardado": "rowToDetalleDetenidoGuardado()" | kind=code-symbol | source=lib/fiscalia/mapper.ts:L186 | neighbors=[mapper.ts, repository.ts]
- "fiscalia_mapper_rowtopuestadisposicion": "rowToPuestaDisposicion()" | kind=code-symbol | source=lib/fiscalia/mapper.ts:L201 | neighbors=[mapper.ts, repository.ts]
- "fiscalia_repository_actualizardetallesasegurado": "actualizarDetallesAsegurado()" | kind=code-symbol | source=lib/fiscalia/repository.ts:L214 | neighbors=[repository.ts, service.ts]
- "fiscalia_repository_actualizarestadosolicitud": "actualizarEstadoSolicitud()" | kind=code-symbol | source=lib/fiscalia/repository.ts:L109 | neighbors=[repository.ts, service.ts]
- "fiscalia_repository_actualizarsolicitudconevidencias": "actualizarSolicitudConEvidencias()" | kind=code-symbol | source=lib/fiscalia/repository.ts:L271 | neighbors=[repository.ts, service.ts]
- "fiscalia_repository_guardardetenidosdirecciones": "guardarDetenidosDirecciones()" | kind=code-symbol | source=lib/fiscalia/repository.ts:L435 | neighbors=[repository.ts, service.ts]
- "fiscalia_repository_guardarpuestadisposicion": "guardarPuestaDisposicion()" | kind=code-symbol | source=lib/fiscalia/repository.ts:L582 | neighbors=[repository.ts, service.ts]
- "fiscalia_repository_listarasegurados": "listarAsegurados()" | kind=code-symbol | source=lib/fiscalia/repository.ts:L361 | neighbors=[repository.ts, service.ts]
- "fiscalia_repository_listaraseguradoscondisposicion": "listarAseguradosConDisposicion()" | kind=code-symbol | source=lib/fiscalia/repository.ts:L544 | neighbors=[repository.ts, service.ts]
- "fiscalia_repository_listarliberaciones": "listarLiberaciones()" | kind=code-symbol | source=lib/fiscalia/repository.ts:L505 | neighbors=[repository.ts, service.ts]
- "fiscalia_repository_obtenerdetalleasegurado": "obtenerDetalleAsegurado()" | kind=code-symbol | source=lib/fiscalia/repository.ts:L122 | neighbors=[repository.ts, service.ts]
- "fiscalia_repository_obtenerdetalleaseguradocompleto": "obtenerDetalleAseguradoCompleto()" | kind=code-symbol | source=lib/fiscalia/repository.ts:L390 | neighbors=[repository.ts, service.ts]
- "fiscalia_repository_obtenerdetalleinfraccionvia": "obtenerDetalleInfraccionVia()" | kind=code-symbol | source=lib/fiscalia/repository.ts:L286 | neighbors=[repository.ts, service.ts]
- "fiscalia_repository_obtenerdetenidosguardados": "obtenerDetenidosGuardados()" | kind=code-symbol | source=lib/fiscalia/repository.ts:L424 | neighbors=[repository.ts, service.ts]
- "fiscalia_repository_obtenerevidenciasmonitorista": "obtenerEvidenciasMonitorista()" | kind=code-symbol | source=lib/fiscalia/repository.ts:L254 | neighbors=[repository.ts, page.tsx]
- "fiscalia_repository_obtenerpuestadisposicionporreporte": "obtenerPuestaDisposicionPorReporte()" | kind=code-symbol | source=lib/fiscalia/repository.ts:L574 | neighbors=[repository.ts, service.ts]
- "fiscalia_repository_obtenerrolusuario": "obtenerRolUsuario()" | kind=code-symbol | source=lib/fiscalia/repository.ts:L13 | neighbors=[repository.ts, service.ts]
- "fiscalia_repository_obtenersolicitudescompletadas": "obtenerSolicitudesCompletadas()" | kind=code-symbol | source=lib/fiscalia/repository.ts:L96 | neighbors=[repository.ts, service.ts]
- "fiscalia_repository_obtenersolicitudesconmonitorista": "obtenerSolicitudesConMonitorista()" | kind=code-symbol | source=lib/fiscalia/repository.ts:L83 | neighbors=[repository.ts, service.ts]
- "fiscalia_repository_obtenersolicitudesenproceso": "obtenerSolicitudesEnProceso()" | kind=code-symbol | source=lib/fiscalia/repository.ts:L70 | neighbors=[repository.ts, service.ts]
- "fiscalia_repository_obtenersolicitudespendientes": "obtenerSolicitudesPendientes()" | kind=code-symbol | source=lib/fiscalia/repository.ts:L25 | neighbors=[repository.ts, service.ts]
- "fiscalia_service_guardardetallesasegurado": "guardarDetallesAsegurado()" | kind=code-symbol | source=lib/fiscalia/service.ts:L67 | neighbors=[actions.ts, service.ts]
- "fiscalia_service_listaraseguradoscompletados": "listarAseguradosCompletados()" | kind=code-symbol | source=lib/fiscalia/service.ts:L83 | neighbors=[actions.ts, service.ts]
- "fiscalia_service_listaraseguradospendientes": "listarAseguradosPendientes()" | kind=code-symbol | source=lib/fiscalia/service.ts:L79 | neighbors=[actions.ts, service.ts]
- "fiscalia_service_listarsolicitudescompletadas": "listarSolicitudesCompletadas()" | kind=code-symbol | source=lib/fiscalia/service.ts:L54 | neighbors=[actions.ts, service.ts]
- "fiscalia_service_listarsolicitudesconmonitorista": "listarSolicitudesConMonitorista()" | kind=code-symbol | source=lib/fiscalia/service.ts:L49 | neighbors=[actions.ts, service.ts]
- "fiscalia_service_listarsolicitudesenproceso": "listarSolicitudesEnProceso()" | kind=code-symbol | source=lib/fiscalia/service.ts:L40 | neighbors=[actions.ts, service.ts]
- "fiscalia_service_listarsolicitudespendientes": "listarSolicitudesPendientes()" | kind=code-symbol | source=lib/fiscalia/service.ts:L35 | neighbors=[actions.ts, service.ts]
- "fiscalia_service_obtenerliberaciones": "obtenerLiberaciones()" | kind=code-symbol | source=lib/fiscalia/service.ts:L143 | neighbors=[actions.ts, service.ts]
- "fiscalia_service_parsedetenidos": "parseDetenidos()" | kind=code-symbol | source=lib/fiscalia/service.ts:L71 | neighbors=[service.ts, obtenerDetalleAseguradoCompletoService()]
- "fiscalia_service_pedirevidencias": "pedirEvidencias()" | kind=code-symbol | source=lib/fiscalia/service.ts:L59 | neighbors=[actions.ts, service.ts]
- "fiscalia_service_tomarcaso": "tomarCaso()" | kind=code-symbol | source=lib/fiscalia/service.ts:L45 | neighbors=[actions.ts, service.ts]
- "fiscalia_service_verificarroljuzgado": "verificarRolJuzgado()" | kind=code-symbol | source=lib/fiscalia/service.ts:L30 | neighbors=[actions.ts, service.ts]
- "fiscalia_subirfotodetenido_subirfotodetenido": "SubirFotoDetenido()" | kind=code-symbol | source=components/fiscalia/SubirFotoDetenido.tsx:L33 | neighbors=[SubirFotoDetenido.tsx, page.tsx]
- "fiscalia_tabasegurados_tabasegurados": "TabAsegurados()" | kind=code-symbol | source=components/fiscalia/TabAsegurados.tsx:L45 | neighbors=[page.tsx, TabAsegurados.tsx]
- "fiscalia_tabsolicitudes_tabsolicitudes": "TabSolicitudes()" | kind=code-symbol | source=components/fiscalia/TabSolicitudes.tsx:L25 | neighbors=[TabSolicitudes.tsx, page.tsx]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/ugomez/Documents/GitHub/seguridad_publica/.graphify/description-instructions/batch-038.json

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
