# Node Description Batch 38 of 93

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

- "agente_infracciones_mapper_rowtoliberacion": "rowToLiberacion()" | kind=code-symbol | source=lib/agente_infracciones/mapper.ts:L8 | neighbors=[mapper.ts, service.ts]
- "agente_infracciones_modalentregargarantia_getgarantiainfo": "getGarantiaInfo()" | kind=code-symbol | source=components/agente_infracciones/ModalEntregarGarantia.tsx:L17 | neighbors=[ModalEntregarGarantia.tsx, ModalEntregarGarantia()]
- "agente_infracciones_modalentregargarantia_modalentregargarantia": "ModalEntregarGarantia()" | kind=code-symbol | source=components/agente_infracciones/ModalEntregarGarantia.tsx:L25 | neighbors=[ModalEntregarGarantia.tsx, getGarantiaInfo()]
- "agente_infracciones_permisos_tienepermiso": "tienePermiso()" | kind=code-symbol | source=lib/agente_infracciones/permisos.ts:L8 | neighbors=[permisos.ts, service.ts]
- "agente_infracciones_profiledropdown_profiledropdown": "ProfileDropdown()" | kind=code-symbol | source=components/agente_infracciones/ProfileDropdown.tsx:L14 | neighbors=[page.tsx, ProfileDropdown.tsx]
- "agente_infracciones_repository_actualizardatosinfractor": "actualizarDatosInfractor()" | kind=code-symbol | source=lib/agente_infracciones/repository.ts:L46 | neighbors=[repository.ts, service.ts]
- "agente_infracciones_repository_actualizardatosinfractoriniciarproceso": "actualizarDatosInfractorIniciarProceso()" | kind=code-symbol | source=lib/agente_infracciones/repository.ts:L211 | neighbors=[repository.ts, route.ts]
- "agente_infracciones_repository_actualizarestatusdependenciamesacontrol": "actualizarEstatusDependenciaMesaControl()" | kind=code-symbol | source=lib/agente_infracciones/repository.ts:L338 | neighbors=[repository.ts, route.ts]
- "agente_infracciones_repository_actualizarestatuspendientepagoinfraccion": "actualizarEstatusPendientePagoInfraccion()" | kind=code-symbol | source=lib/agente_infracciones/repository.ts:L254 | neighbors=[repository.ts, route.ts]
- "agente_infracciones_repository_actualizarestatussolicitudliberacion": "actualizarEstatusSolicitudLiberacion()" | kind=code-symbol | source=lib/agente_infracciones/repository.ts:L331 | neighbors=[repository.ts, route.ts]
- "agente_infracciones_repository_actualizarevidenciasinfraccion": "actualizarEvidenciasInfraccion()" | kind=code-symbol | source=lib/agente_infracciones/repository.ts:L363 | neighbors=[repository.ts, route.ts]
- "agente_infracciones_repository_actualizarurlordensalida": "actualizarUrlOrdenSalida()" | kind=code-symbol | source=lib/agente_infracciones/repository.ts:L204 | neighbors=[repository.ts, route.ts]
- "agente_infracciones_repository_actualizarurlsdocumentosinfraccion": "actualizarUrlsDocumentosInfraccion()" | kind=code-symbol | source=lib/agente_infracciones/repository.ts:L347 | neighbors=[repository.ts, route.ts]
- "agente_infracciones_repository_cerrarinfraccion": "cerrarInfraccion()" | kind=code-symbol | source=lib/agente_infracciones/repository.ts:L197 | neighbors=[repository.ts, route.ts]
- "agente_infracciones_repository_insertardocumentoliberacion": "insertarDocumentoLiberacion()" | kind=code-symbol | source=lib/agente_infracciones/repository.ts:L294 | neighbors=[repository.ts, route.ts]
- "agente_infracciones_repository_insertarordenpagosa7": "insertarOrdenPagoSa7()" | kind=code-symbol | source=lib/agente_infracciones/repository.ts:L106 | neighbors=[repository.ts, service.ts]
- "agente_infracciones_repository_insertarsolicitudliberacion": "insertarSolicitudLiberacion()" | kind=code-symbol | source=lib/agente_infracciones/repository.ts:L307 | neighbors=[repository.ts, route.ts]
- "agente_infracciones_repository_liberargarantia": "liberarGarantia()" | kind=code-symbol | source=lib/agente_infracciones/repository.ts:L94 | neighbors=[repository.ts, service.ts]
- "agente_infracciones_repository_liberarinfraccioninstante": "liberarInfraccionInstante()" | kind=code-symbol | source=lib/agente_infracciones/repository.ts:L274 | neighbors=[repository.ts, route.ts]
- "agente_infracciones_repository_marcargarantiaentregada": "marcarGarantiaEntregada()" | kind=code-symbol | source=lib/agente_infracciones/repository.ts:L283 | neighbors=[repository.ts, route.ts]
- "agente_infracciones_repository_marcarordenpagopagada": "marcarOrdenPagoPagada()" | kind=code-symbol | source=lib/agente_infracciones/repository.ts:L139 | neighbors=[repository.ts, route.ts]
- "agente_infracciones_repository_marcarplacaretenidaentransito": "marcarPlacaRetenidaEnTransito()" | kind=code-symbol | source=lib/agente_infracciones/repository.ts:L261 | neighbors=[repository.ts, route.ts]
- "agente_infracciones_repository_obtenerconceptoid": "obtenerConceptoId()" | kind=code-symbol | source=lib/agente_infracciones/repository.ts:L83 | neighbors=[repository.ts, service.ts]
- "agente_infracciones_repository_obtenerdatosordensalida": "obtenerDatosOrdenSalida()" | kind=code-symbol | source=lib/agente_infracciones/repository.ts:L156 | neighbors=[repository.ts, route.ts]
- "agente_infracciones_repository_obtenerdocumentosliberacion": "obtenerDocumentosLiberacion()" | kind=code-symbol | source=lib/agente_infracciones/repository.ts:L182 | neighbors=[repository.ts, route.ts]
- "agente_infracciones_repository_obtenerliberaciones": "obtenerLiberaciones()" | kind=code-symbol | source=lib/agente_infracciones/repository.ts:L17 | neighbors=[repository.ts, service.ts]
- "agente_infracciones_repository_obtenermotivoretencion": "obtenerMotivoRetencion()" | kind=code-symbol | source=lib/agente_infracciones/repository.ts:L148 | neighbors=[repository.ts, route.ts]
- "agente_infracciones_repository_obtenerrolusuario": "obtenerRolUsuario()" | kind=code-symbol | source=lib/agente_infracciones/repository.ts:L5 | neighbors=[repository.ts, service.ts]
- "agente_infracciones_repository_obtenersolicitudliberacion": "obtenerSolicitudLiberacion()" | kind=code-symbol | source=lib/agente_infracciones/repository.ts:L171 | neighbors=[repository.ts, route.ts]
- "agente_infracciones_service_listarliberaciones": "listarLiberaciones()" | kind=code-symbol | source=lib/agente_infracciones/service.ts:L14 | neighbors=[actions.ts, service.ts]
- "agente_infracciones_service_procesarcapturainfractor": "procesarCapturaInfractor()" | kind=code-symbol | source=lib/agente_infracciones/service.ts:L19 | neighbors=[actions.ts, service.ts]
- "agente_infracciones_service_procesarliberargarantia": "procesarLiberarGarantia()" | kind=code-symbol | source=lib/agente_infracciones/service.ts:L122 | neighbors=[actions.ts, service.ts]
- "agente_infracciones_storecapturainfractor_usecapturainfractorstore": "useCapturaInfractorStore" | kind=code-symbol | source=lib/agente_infracciones/storeCapturaInfractor.ts:L53 | neighbors=[CapturarDatosInfractorModal.tsx, storeCapturaInfractor.ts]
- "agente_infracciones_types_liberacionesresponse": "LiberacionesResponse" | kind=code-symbol | source=lib/agente_infracciones/types.ts:L24 | neighbors=[actions.ts, types.ts]
- "agente_infracciones_types_rolrow": "RolRow" | kind=code-symbol | source=lib/agente_infracciones/types.ts:L7 | neighbors=[repository.ts, types.ts]
- "agente_infracciones_types_userinfo": "UserInfo" | kind=code-symbol | source=lib/agente_infracciones/types.ts:L1 | neighbors=[actions.ts, types.ts]
- "agente_juzgado_actions_accioncerrarcaso": "accionCerrarCaso()" | kind=code-symbol | source=lib/agente_juzgado/actions.ts:L139 | neighbors=[actions.ts, CerrarCasoModal.tsx]
- "agente_juzgado_actions_accionpedirevidencias": "accionPedirEvidencias()" | kind=code-symbol | source=lib/agente_juzgado/actions.ts:L107 | neighbors=[actions.ts, TabSolicitudes.tsx]
- "agente_juzgado_actions_acciontomarcaso": "accionTomarCaso()" | kind=code-symbol | source=lib/agente_juzgado/actions.ts:L81 | neighbors=[actions.ts, TomarCasoModal.tsx]
- "agente_juzgado_actions_guardardetallesaseguradoaction": "guardarDetallesAseguradoAction()" | kind=code-symbol | source=lib/agente_juzgado/actions.ts:L187 | neighbors=[actions.ts, CapturarDetallesForm.tsx]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/ugomez/Documents/GitHub/seguridad_publica/.graphify/description-instructions/batch-037.json

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
