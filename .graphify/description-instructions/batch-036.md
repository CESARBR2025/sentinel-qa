# Node Description Batch 37 of 87

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

- "agente_juzgado_actions_obtenerliberacionesaction": "obtenerLiberacionesAction()" | kind=code-symbol | source=lib/agente_juzgado/actions.ts:L254 | neighbors=[actions.ts, page.tsx]
- "agente_juzgado_actions_obtenerpuestadisposicionjuzgadoaction": "obtenerPuestaDisposicionJuzgadoAction()" | kind=code-symbol | source=lib/agente_juzgado/actions.ts:L404 | neighbors=[actions.ts, page.tsx]
- "agente_juzgado_actions_obtenersolicitudes": "obtenerSolicitudes()" | kind=code-symbol | source=lib/agente_juzgado/actions.ts:L63 | neighbors=[actions.ts, page.tsx]
- "agente_juzgado_botonverdetalle_botonverdetalle": "BotonVerDetalle()" | kind=code-symbol | source=components/agente_juzgado/BotonVerDetalle.tsx:L10 | neighbors=[BotonVerDetalle.tsx, JuzgadoDashboard.tsx]
- "agente_juzgado_capturardetallesform_emptyitem": "emptyItem()" | kind=code-symbol | source=components/agente_juzgado/CapturarDetallesForm.tsx:L53 | neighbors=[CapturarDetallesForm.tsx, CapturarDetallesForm()]
- "agente_juzgado_detallesaseguradoview_detallesaseguradoview": "DetallesAseguradoView()" | kind=code-symbol | source=components/agente_juzgado/DetallesAseguradoView.tsx:L40 | neighbors=[DetallesAseguradoView.tsx, page.tsx]
- "agente_juzgado_formularioaseguradojuzgado_concatnombre": "concatNombre()" | kind=code-symbol | source=components/agente_juzgado/FormularioAseguradoJuzgado.tsx:L55 | neighbors=[FormularioAseguradoJuzgado.tsx, FormularioAseguradoJuzgado()]
- "agente_juzgado_formularioaseguradojuzgado_displayval": "displayVal()" | kind=code-symbol | source=components/agente_juzgado/FormularioAseguradoJuzgado.tsx:L51 | neighbors=[FormularioAseguradoJuzgado.tsx, FormularioAseguradoJuzgado()]
- "agente_juzgado_juzgadotable_juzgadotable": "JuzgadoTable()" | kind=code-symbol | source=components/agente_juzgado/JuzgadoTable.tsx:L31 | neighbors=[JuzgadoTable.tsx, page.tsx]
- "agente_juzgado_mapper_num": "num()" | kind=code-symbol | source=lib/agente_juzgado/mapper.ts:L15 | neighbors=[mapper.ts, rowToSolicitud()]
- "agente_juzgado_mapper_rowtoinfracciondetalle": "rowToInfraccionDetalle()" | kind=code-symbol | source=lib/agente_juzgado/mapper.ts:L87 | neighbors=[mapper.ts, service.ts]
- "agente_juzgado_repository_actualizardetallesasegurado": "actualizarDetallesAsegurado()" | kind=code-symbol | source=lib/agente_juzgado/repository.ts:L120 | neighbors=[repository.ts, service.ts]
- "agente_juzgado_repository_actualizarestadosolicitud": "actualizarEstadoSolicitud()" | kind=code-symbol | source=lib/agente_juzgado/repository.ts:L83 | neighbors=[repository.ts, service.ts]
- "agente_juzgado_repository_actualizarsolicitudconevidencias": "actualizarSolicitudConEvidencias()" | kind=code-symbol | source=lib/agente_juzgado/repository.ts:L105 | neighbors=[repository.ts, service.ts]
- "agente_juzgado_repository_finalizarprocesojuzgado": "finalizarProcesoJuzgado()" | kind=code-symbol | source=lib/agente_juzgado/repository.ts:L399 | neighbors=[repository.ts, service.ts]
- "agente_juzgado_repository_iniciarprocesojuzgado": "iniciarProcesoJuzgado()" | kind=code-symbol | source=lib/agente_juzgado/repository.ts:L390 | neighbors=[repository.ts, service.ts]
- "agente_juzgado_repository_listaraseguradosjuzgado": "listarAseguradosJuzgado()" | kind=code-symbol | source=lib/agente_juzgado/repository.ts:L462 | neighbors=[repository.ts, service.ts]
- "agente_juzgado_repository_listarliberacionesjuzgado": "listarLiberacionesJuzgado()" | kind=code-symbol | source=lib/agente_juzgado/repository.ts:L277 | neighbors=[repository.ts, service.ts]
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

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/cesarbr/Documents/dev/sjr/seguridad_publica/.graphify/description-instructions/batch-036.json

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
