# Node Description Batch 37 of 89

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

- "agente_infracciones_repository_obtenermotivoretencion": "obtenerMotivoRetencion()" | kind=code-symbol | source=lib/agente_infracciones/repository.ts:L148 | neighbors=[repository.ts, route.ts]
- "agente_infracciones_repository_obtenerrolusuario": "obtenerRolUsuario()" | kind=code-symbol | source=lib/agente_infracciones/repository.ts:L5 | neighbors=[repository.ts, service.ts]
- "agente_infracciones_repository_obtenersolicitudliberacion": "obtenerSolicitudLiberacion()" | kind=code-symbol | source=lib/agente_infracciones/repository.ts:L171 | neighbors=[repository.ts, route.ts]
- "agente_infracciones_service_listarliberaciones": "listarLiberaciones()" | kind=code-symbol | source=lib/agente_infracciones/service.ts:L14 | neighbors=[actions.ts, service.ts]
- "agente_infracciones_service_procesarcapturainfractor": "procesarCapturaInfractor()" | kind=code-symbol | source=lib/agente_infracciones/service.ts:L19 | neighbors=[actions.ts, service.ts]
- "agente_infracciones_service_procesarliberargarantia": "procesarLiberarGarantia()" | kind=code-symbol | source=lib/agente_infracciones/service.ts:L122 | neighbors=[actions.ts, service.ts]
- "agente_infracciones_service_verificarrolinfracciones": "verificarRolInfracciones()" | kind=code-symbol | source=lib/agente_infracciones/service.ts:L9 | neighbors=[actions.ts, service.ts]
- "agente_infracciones_storecapturainfractor_usecapturainfractorstore": "useCapturaInfractorStore" | kind=code-symbol | source=lib/agente_infracciones/storeCapturaInfractor.ts:L53 | neighbors=[CapturarDatosInfractorModal.tsx, storeCapturaInfractor.ts]
- "agente_infracciones_types_liberacionesresponse": "LiberacionesResponse" | kind=code-symbol | source=lib/agente_infracciones/types.ts:L24 | neighbors=[actions.ts, types.ts]
- "agente_infracciones_types_rolrow": "RolRow" | kind=code-symbol | source=lib/agente_infracciones/types.ts:L7 | neighbors=[repository.ts, types.ts]
- "agente_infracciones_types_userinfo": "UserInfo" | kind=code-symbol | source=lib/agente_infracciones/types.ts:L1 | neighbors=[actions.ts, types.ts]
- "agente_juzgado_actions_accioncerrarcaso": "accionCerrarCaso()" | kind=code-symbol | source=lib/agente_juzgado/actions.ts:L139 | neighbors=[actions.ts, CerrarCasoModal.tsx]
- "agente_juzgado_actions_accionpedirevidencias": "accionPedirEvidencias()" | kind=code-symbol | source=lib/agente_juzgado/actions.ts:L107 | neighbors=[actions.ts, TabSolicitudes.tsx]
- "agente_juzgado_actions_acciontomarcaso": "accionTomarCaso()" | kind=code-symbol | source=lib/agente_juzgado/actions.ts:L81 | neighbors=[actions.ts, TomarCasoModal.tsx]
- "agente_juzgado_actions_guardardetallesaseguradoaction": "guardarDetallesAseguradoAction()" | kind=code-symbol | source=lib/agente_juzgado/actions.ts:L187 | neighbors=[actions.ts, CapturarDetallesForm.tsx]
- "agente_juzgado_actions_guardardetallesaseguradosjuzgadoaction": "guardarDetallesAseguradosJuzgadoAction()" | kind=code-symbol | source=lib/agente_juzgado/actions.ts:L423 | neighbors=[actions.ts, page.tsx]
- "agente_juzgado_actions_guardaroficiojuzgadoaction": "guardarOficioJuzgadoAction()" | kind=code-symbol | source=lib/agente_juzgado/actions.ts:L293 | neighbors=[actions.ts, CargarOficioSection.tsx]
- "agente_juzgado_actions_guardarpuestadisposicionjuzgadoaction": "guardarPuestaDisposicionJuzgadoAction()" | kind=code-symbol | source=lib/agente_juzgado/actions.ts:L449 | neighbors=[actions.ts, page.tsx]
- "agente_juzgado_actions_obteneraseguradosjuzgadoaction": "obtenerAseguradosJuzgadoAction()" | kind=code-symbol | source=lib/agente_juzgado/actions.ts:L370 | neighbors=[actions.ts, page.tsx]
- "agente_juzgado_actions_obtenerdetalleaseguradocompletojuzgadoaction": "obtenerDetalleAseguradoCompletoJuzgadoAction()" | kind=code-symbol | source=lib/agente_juzgado/actions.ts:L385 | neighbors=[actions.ts, page.tsx]
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

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/ugomez/Documents/GitHub/seguridad_publica/.graphify/description-instructions/batch-036.json

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
