# Node Description Batch 33 of 79

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

- "admin_repository_crearrol": "crearRol()" | kind=code-symbol | source=lib/admin/repository.ts:L60 | neighbors=[repository.ts, route.ts]
- "admin_repository_eliminarsesion": "eliminarSesion()" | kind=code-symbol | source=lib/admin/repository.ts:L92 | neighbors=[actions.ts, repository.ts]
- "admin_repository_existerolpornombre": "existeRolPorNombre()" | kind=code-symbol | source=lib/admin/repository.ts:L52 | neighbors=[repository.ts, route.ts]
- "admin_repository_listarroles": "listarRoles()" | kind=code-symbol | source=lib/admin/repository.ts:L37 | neighbors=[repository.ts, page.tsx]
- "admin_repository_listarusuarios": "listarUsuarios()" | kind=code-symbol | source=lib/admin/repository.ts:L5 | neighbors=[repository.ts, page.tsx]
- "admin_repository_obtenerrol": "obtenerRol()" | kind=code-symbol | source=lib/admin/repository.ts:L44 | neighbors=[repository.ts, page.tsx]
- "admin_repository_obtenerrolusuario": "obtenerRolUsuario()" | kind=code-symbol | source=lib/admin/repository.ts:L70 | neighbors=[actions.ts, repository.ts]
- "admin_repository_obtenerusuario": "obtenerUsuario()" | kind=code-symbol | source=lib/admin/repository.ts:L16 | neighbors=[repository.ts, page.tsx]
- "admin_transito_actions_buscarusuariosreincorporar": "buscarUsuariosReincorporar()" | kind=code-symbol | source=lib/admin-transito/actions.ts:L295 | neighbors=[actions.ts, requireAdminTransito()]
- "admin_transito_repository_obteneroficialexistente": "obtenerOficialExistente()" | kind=code-symbol | source=lib/admin-transito/repository.ts:L36 | neighbors=[repository.ts, upsertOficial()]
- "admin_transito_repository_upsertoficial": "upsertOficial()" | kind=code-symbol | source=lib/admin-transito/repository.ts:L44 | neighbors=[repository.ts, obtenerOficialExistente()]
- "admin_transito_types_userwithrole": "UserWithRole" | kind=code-symbol | source=lib/admin-transito/types.ts:L1 | neighbors=[mapper.ts, types.ts]
- "agente_infracciones_actions_capturarinfractorinfraccionesaction": "capturarInfractorInfraccionesAction()" | kind=code-symbol | source=lib/agente_infracciones/actions.ts:L61 | neighbors=[actions.ts, CapturarDatosInfractorModal.tsx]
- "agente_infracciones_actions_liberargarantiainfraccionesaction": "liberarGarantiaInfraccionesAction()" | kind=code-symbol | source=lib/agente_infracciones/actions.ts:L79 | neighbors=[actions.ts, ModalEntregarGarantia.tsx]
- "agente_infracciones_actions_obtenerdashboardinfracciones": "obtenerDashboardInfracciones()" | kind=code-symbol | source=lib/agente_infracciones/actions.ts:L10 | neighbors=[actions.ts, page.tsx]
- "agente_infracciones_actions_obtenerinfracciones": "obtenerInfracciones()" | kind=code-symbol | source=lib/agente_infracciones/actions.ts:L26 | neighbors=[actions.ts, page.tsx]
- "agente_infracciones_mapper_nvl": "nvl()" | kind=code-symbol | source=lib/agente_infracciones/mapper.ts:L23 | neighbors=[mapper.ts, inputToDbParams()]
- "agente_infracciones_mapper_rowtoliberacion": "rowToLiberacion()" | kind=code-symbol | source=lib/agente_infracciones/mapper.ts:L8 | neighbors=[mapper.ts, service.ts]
- "agente_infracciones_modalentregargarantia_getgarantiainfo": "getGarantiaInfo()" | kind=code-symbol | source=components/agente_infracciones/ModalEntregarGarantia.tsx:L17 | neighbors=[ModalEntregarGarantia.tsx, ModalEntregarGarantia()]
- "agente_infracciones_modalentregargarantia_modalentregargarantia": "ModalEntregarGarantia()" | kind=code-symbol | source=components/agente_infracciones/ModalEntregarGarantia.tsx:L25 | neighbors=[ModalEntregarGarantia.tsx, getGarantiaInfo()]
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

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/cesarbr/Documents/dev/sjr/seguridad_publica/.graphify/description-instructions/batch-032.json

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
