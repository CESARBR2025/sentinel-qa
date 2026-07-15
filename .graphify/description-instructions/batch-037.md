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

- "admin_transito_repository_upsertoficial": "upsertOficial()" | kind=code-symbol | source=lib/admin-transito/repository.ts:L44 | neighbors=[repository.ts, obtenerOficialExistente()]
- "admin_transito_types_userwithrole": "UserWithRole" | kind=code-symbol | source=lib/admin-transito/types.ts:L1 | neighbors=[mapper.ts, types.ts]
- "agente_911_service_verificarrolagente911": "verificarRolAgente911()" | kind=code-symbol | source=lib/agente_911/service.ts:L3 | neighbors=[page.tsx, service.ts]
- "agente_bitacorista_service_verificarrolagentebitacorista": "verificarRolAgenteBitacorista()" | kind=code-symbol | source=lib/agente_bitacorista/service.ts:L3 | neighbors=[page.tsx, service.ts]
- "agente_despacho_service_verificarrolagentedespacho": "verificarRolAgenteDespacho()" | kind=code-symbol | source=lib/agente_despacho/service.ts:L3 | neighbors=[page.tsx, service.ts]
- "agente_infracciones_actions_capturarinfractorinfraccionesaction": "capturarInfractorInfraccionesAction()" | kind=code-symbol | source=lib/agente_infracciones/actions.ts:L61 | neighbors=[actions.ts, CapturarDatosInfractorModal.tsx]
- "agente_infracciones_actions_liberargarantiainfraccionesaction": "liberarGarantiaInfraccionesAction()" | kind=code-symbol | source=lib/agente_infracciones/actions.ts:L79 | neighbors=[actions.ts, ModalEntregarGarantia.tsx]
- "agente_infracciones_actions_obtenerdashboardinfracciones": "obtenerDashboardInfracciones()" | kind=code-symbol | source=lib/agente_infracciones/actions.ts:L10 | neighbors=[actions.ts, page.tsx]
- "agente_infracciones_actions_obtenerinfracciones": "obtenerInfracciones()" | kind=code-symbol | source=lib/agente_infracciones/actions.ts:L26 | neighbors=[actions.ts, page.tsx]
- "agente_infracciones_mapper_nvl": "nvl()" | kind=code-symbol | source=lib/agente_infracciones/mapper.ts:L23 | neighbors=[mapper.ts, inputToDbParams()]
- "agente_infracciones_mapper_rowtoliberacion": "rowToLiberacion()" | kind=code-symbol | source=lib/agente_infracciones/mapper.ts:L8 | neighbors=[mapper.ts, service.ts]
- "agente_infracciones_modalentregargarantia_getgarantiainfo": "getGarantiaInfo()" | kind=code-symbol | source=components/agente_infracciones/ModalEntregarGarantia.tsx:L17 | neighbors=[ModalEntregarGarantia.tsx, ModalEntregarGarantia()]
- "agente_infracciones_modalentregargarantia_modalentregargarantia": "ModalEntregarGarantia()" | kind=code-symbol | source=components/agente_infracciones/ModalEntregarGarantia.tsx:L25 | neighbors=[ModalEntregarGarantia.tsx, getGarantiaInfo()]
- "agente_infracciones_permisos_tienepermiso": "tienePermiso()" | kind=code-symbol | source=lib/agente_infracciones/permisos.ts:L8 | neighbors=[permisos.ts, service.ts]
- "agente_infracciones_profiledropdown_profiledropdown": "ProfileDropdown()" | kind=code-symbol | source=components/agente_infracciones/ProfileDropdown.tsx:L14 | neighbors=[ProfileDropdown.tsx, page.tsx]
- "agente_infracciones_repository_actualizardatosinfractor": "actualizarDatosInfractor()" | kind=code-symbol | source=lib/agente_infracciones/repository.ts:L34 | neighbors=[repository.ts, service.ts]
- "agente_infracciones_repository_actualizardatosinfractoriniciarproceso": "actualizarDatosInfractorIniciarProceso()" | kind=code-symbol | source=lib/agente_infracciones/repository.ts:L199 | neighbors=[repository.ts, route.ts]
- "agente_infracciones_repository_actualizarestatusdependenciamesacontrol": "actualizarEstatusDependenciaMesaControl()" | kind=code-symbol | source=lib/agente_infracciones/repository.ts:L326 | neighbors=[repository.ts, route.ts]
- "agente_infracciones_repository_actualizarestatuspendientepagoinfraccion": "actualizarEstatusPendientePagoInfraccion()" | kind=code-symbol | source=lib/agente_infracciones/repository.ts:L242 | neighbors=[repository.ts, route.ts]
- "agente_infracciones_repository_actualizarestatussolicitudliberacion": "actualizarEstatusSolicitudLiberacion()" | kind=code-symbol | source=lib/agente_infracciones/repository.ts:L319 | neighbors=[repository.ts, route.ts]
- "agente_infracciones_repository_actualizarevidenciasinfraccion": "actualizarEvidenciasInfraccion()" | kind=code-symbol | source=lib/agente_infracciones/repository.ts:L351 | neighbors=[repository.ts, route.ts]
- "agente_infracciones_repository_actualizarurlordensalida": "actualizarUrlOrdenSalida()" | kind=code-symbol | source=lib/agente_infracciones/repository.ts:L192 | neighbors=[repository.ts, route.ts]
- "agente_infracciones_repository_actualizarurlsdocumentosinfraccion": "actualizarUrlsDocumentosInfraccion()" | kind=code-symbol | source=lib/agente_infracciones/repository.ts:L335 | neighbors=[repository.ts, route.ts]
- "agente_infracciones_repository_cerrarinfraccion": "cerrarInfraccion()" | kind=code-symbol | source=lib/agente_infracciones/repository.ts:L185 | neighbors=[repository.ts, route.ts]
- "agente_infracciones_repository_insertardocumentoliberacion": "insertarDocumentoLiberacion()" | kind=code-symbol | source=lib/agente_infracciones/repository.ts:L282 | neighbors=[repository.ts, route.ts]
- "agente_infracciones_repository_insertarordenpagosa7": "insertarOrdenPagoSa7()" | kind=code-symbol | source=lib/agente_infracciones/repository.ts:L94 | neighbors=[repository.ts, service.ts]
- "agente_infracciones_repository_insertarsolicitudliberacion": "insertarSolicitudLiberacion()" | kind=code-symbol | source=lib/agente_infracciones/repository.ts:L295 | neighbors=[repository.ts, route.ts]
- "agente_infracciones_repository_liberargarantia": "liberarGarantia()" | kind=code-symbol | source=lib/agente_infracciones/repository.ts:L82 | neighbors=[repository.ts, service.ts]
- "agente_infracciones_repository_liberarinfraccioninstante": "liberarInfraccionInstante()" | kind=code-symbol | source=lib/agente_infracciones/repository.ts:L262 | neighbors=[repository.ts, route.ts]
- "agente_infracciones_repository_marcargarantiaentregada": "marcarGarantiaEntregada()" | kind=code-symbol | source=lib/agente_infracciones/repository.ts:L271 | neighbors=[repository.ts, route.ts]
- "agente_infracciones_repository_marcarordenpagopagada": "marcarOrdenPagoPagada()" | kind=code-symbol | source=lib/agente_infracciones/repository.ts:L127 | neighbors=[repository.ts, route.ts]
- "agente_infracciones_repository_marcarplacaretenidaentransito": "marcarPlacaRetenidaEnTransito()" | kind=code-symbol | source=lib/agente_infracciones/repository.ts:L249 | neighbors=[repository.ts, route.ts]
- "agente_infracciones_repository_obtenerconceptoid": "obtenerConceptoId()" | kind=code-symbol | source=lib/agente_infracciones/repository.ts:L71 | neighbors=[repository.ts, service.ts]
- "agente_infracciones_repository_obtenerdatosordensalida": "obtenerDatosOrdenSalida()" | kind=code-symbol | source=lib/agente_infracciones/repository.ts:L144 | neighbors=[repository.ts, route.ts]
- "agente_infracciones_repository_obtenerdocumentosliberacion": "obtenerDocumentosLiberacion()" | kind=code-symbol | source=lib/agente_infracciones/repository.ts:L170 | neighbors=[repository.ts, route.ts]
- "agente_infracciones_repository_obtenerliberaciones": "obtenerLiberaciones()" | kind=code-symbol | source=lib/agente_infracciones/repository.ts:L5 | neighbors=[repository.ts, service.ts]
- "agente_infracciones_repository_obtenermotivoretencion": "obtenerMotivoRetencion()" | kind=code-symbol | source=lib/agente_infracciones/repository.ts:L136 | neighbors=[repository.ts, route.ts]
- "agente_infracciones_repository_obtenerrolusuario": "obtenerRolUsuario()" | kind=code-symbol | source=lib/agente_infracciones/repository.ts:L5 | neighbors=[repository.ts, service.ts]
- "agente_infracciones_repository_obtenersolicitudliberacion": "obtenerSolicitudLiberacion()" | kind=code-symbol | source=lib/agente_infracciones/repository.ts:L159 | neighbors=[repository.ts, route.ts]
- "agente_infracciones_service_listarliberaciones": "listarLiberaciones()" | kind=code-symbol | source=lib/agente_infracciones/service.ts:L14 | neighbors=[actions.ts, service.ts]

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
