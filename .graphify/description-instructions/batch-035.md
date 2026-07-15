# Node Description Batch 36 of 93

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

- "reportes_sin_novedad_service_listarreportessinnovedad": "listarReportesSinNovedad()" | kind=code-symbol | source=lib/reportes-sin-novedad/service.ts:L6 | neighbors=[route.ts, service.ts, page.tsx]
- "reportes_welcomebanner_sentinelhero": "SentinelHero()" | kind=code-symbol | source=components/reportes/welcomeBanner.tsx:L1 | neighbors=[page.tsx, page.tsx, welcomeBanner.tsx]
- "rol_servicios_catalogos_actions_createbodycam": "createBodyCam()" | kind=code-symbol | source=lib/rol-servicios/catalogos-actions.ts:L63 | neighbors=[catalogos-actions.ts, req(), requireAdmin()]
- "rol_servicios_catalogos_actions_createconcepto": "createConcepto()" | kind=code-symbol | source=lib/rol-servicios/catalogos-actions.ts:L76 | neighbors=[catalogos-actions.ts, req(), requireAdmin()]
- "rol_servicios_catalogos_actions_createmediocanalizacion": "createMedioCanalizacion()" | kind=code-symbol | source=lib/rol-servicios/catalogos-actions.ts:L115 | neighbors=[catalogos-actions.ts, req(), requireAdmin()]
- "rol_servicios_catalogos_actions_createradio": "createRadio()" | kind=code-symbol | source=lib/rol-servicios/catalogos-actions.ts:L50 | neighbors=[catalogos-actions.ts, req(), requireAdmin()]
- "rol_servicios_catalogos_actions_createsector": "createSector()" | kind=code-symbol | source=lib/rol-servicios/catalogos-actions.ts:L37 | neighbors=[catalogos-actions.ts, req(), requireAdmin()]
- "rol_servicios_catalogos_actions_createtipoemergencia": "createTipoEmergencia()" | kind=code-symbol | source=lib/rol-servicios/catalogos-actions.ts:L102 | neighbors=[catalogos-actions.ts, req(), requireAdmin()]
- "rol_servicios_catalogos_actions_createtipoobservacion": "createTipoObservacion()" | kind=code-symbol | source=lib/rol-servicios/catalogos-actions.ts:L89 | neighbors=[catalogos-actions.ts, req(), requireAdmin()]
- "rol_servicios_mapper_rowtobodycam": "rowToBodyCam()" | kind=code-symbol | source=lib/rol-servicios/mapper.ts:L114 | neighbors=[mapper.ts, toBool(), repository.ts]
- "rol_servicios_mapper_rowtomediocanalizacion": "rowToMedioCanalizacion()" | kind=code-symbol | source=lib/rol-servicios/mapper.ts:L152 | neighbors=[mapper.ts, toBool(), repository.ts]
- "rol_servicios_mapper_rowtorolobservacion": "rowToRolObservacion()" | kind=code-symbol | source=lib/rol-servicios/mapper.ts:L86 | neighbors=[mapper.ts, toStr(), repository.ts]
- "rol_servicios_mapper_rowtosector": "rowToSector()" | kind=code-symbol | source=lib/rol-servicios/mapper.ts:L95 | neighbors=[mapper.ts, toBool(), repository.ts]
- "rol_servicios_mapper_rowtotipoemergencia": "rowToTipoEmergencia()" | kind=code-symbol | source=lib/rol-servicios/mapper.ts:L143 | neighbors=[mapper.ts, toBool(), repository.ts]
- "rol_servicios_mapper_rowtotipoobservacion": "rowToTipoObservacion()" | kind=code-symbol | source=lib/rol-servicios/mapper.ts:L134 | neighbors=[mapper.ts, toBool(), repository.ts]
- "rol_servicios_mapper_tonum": "toNum()" | kind=code-symbol | source=lib/rol-servicios/mapper.ts:L12 | neighbors=[mapper.ts, rowToRolAsignacion(), rowToRolServicio()]
- "rol_servicios_repository_getrolbyid": "getRolById()" | kind=code-symbol | source=lib/rol-servicios/repository.ts:L13 | neighbors=[actions.ts, repository.ts, service.ts]
- "rol_servicios_repository_getuserrolename": "getUserRoleName()" | kind=code-symbol | source=lib/rol-servicios/repository.ts:L88 | neighbors=[repository.ts, service.ts, catalogos-actions.ts]
- "rol_servicios_rolinputs_rolfield": "RolField()" | kind=code-symbol | source=components/rol_servicios/RolInputs.tsx:L9 | neighbors=[page.tsx, RolInputs.tsx, RegistroIncidenteForm.tsx]
- "sasiete_mapper_maprowtoordenpago": "mapRowToOrdenPago()" | kind=code-symbol | source=features/via/saSiete/mapper.ts:L23 | neighbors=[mapper.ts, repository.ts, service.ts]
- "sasiete_types_ordenpagosa7": "OrdenPagoSA7" | kind=code-symbol | source=features/via/saSiete/types.ts:L9 | neighbors=[mapper.ts, repository.ts, types.ts]
- "scripts_ab_test_charstotokens": "charsToTokens()" | kind=code-symbol | source=scripts/ab-test.mjs:L26 | neighbors=[ab-test.mjs, simulateWithoutYoumindag(), simulateWithYoumindag()]
- "scripts_load_context_buildinstructions": "buildInstructions()" | kind=code-symbol | source=scripts/load-context.mjs:L79 | neighbors=[load-context.mjs, resolvePath(), main()]
- "scripts_session_checkpoint_adddecision": "addDecision()" | kind=code-symbol | source=scripts/session-checkpoint.mjs:L188 | neighbors=[session-checkpoint.mjs, ensureDir(), getSessionId()]
- "scripts_session_checkpoint_budgetreport": "budgetReport()" | kind=code-symbol | source=scripts/session-checkpoint.mjs:L160 | neighbors=[session-checkpoint.mjs, budget(), formatNum()]
- "scripts_session_checkpoint_ensuredir": "ensureDir()" | kind=code-symbol | source=scripts/session-checkpoint.mjs:L22 | neighbors=[session-checkpoint.mjs, addDecision(), append()]
- "scripts_session_checkpoint_last": "last()" | kind=code-symbol | source=scripts/session-checkpoint.mjs:L56 | neighbors=[session-checkpoint.mjs, formatEvent(), parseEvent()]
- "scripts_session_checkpoint_parseevent": "parseEvent()" | kind=code-symbol | source=scripts/session-checkpoint.mjs:L31 | neighbors=[session-checkpoint.mjs, getSessionId(), last()]
- "scripts_session_checkpoint_pendingdecisions": "pendingDecisions()" | kind=code-symbol | source=scripts/session-checkpoint.mjs:L209 | neighbors=[session-checkpoint.mjs, formatEvent(), getSessionId()]
- "scripts_trace_client_findreactimportwithts": "findReactImportWithTS()" | kind=code-symbol | source=scripts/trace-client.mjs:L142 | neighbors=[trace-client.mjs, require, injectClientTrace()]
- "scripts_trace_client_injectclienttrace": "injectClientTrace()" | kind=code-symbol | source=scripts/trace-client.mjs:L66 | neighbors=[trace-client.mjs, buildHelperCode(), findReactImportWithTS()]
- "scripts_trace_server_findmatchingbrace": "findMatchingBrace()" | kind=code-symbol | source=scripts/trace-server.mjs:L147 | neighbors=[trace-server.mjs, findFunctionBodyFallback(), isInsideLiteral()]
- "services_analistaservice_analistaservice": "analistaService" | kind=code-symbol | source=services/analistaService.ts:L2 | neighbors=[formAnalisis.tsx, BitacoraIPH.tsx, analistaService.ts]
- "shared_detalleinfraccionview_timeago": "timeAgo()" | kind=code-symbol | source=components/shared/DetalleInfraccionView.tsx:L126 | neighbors=[DetalleInfraccionView.tsx, SummaryBar(), formatDate()]
- "shared_direcciongooglemaps_direccion": "Direccion" | kind=code-symbol | source=components/shared/DireccionGoogleMaps.tsx:L6 | neighbors=[CapturarDetallesForm.tsx, CapturarDetallesForm.tsx, DireccionGoogleMaps.tsx]
- "shared_direcciongooglemaps_direcciongooglemaps": "DireccionGoogleMaps()" | kind=code-symbol | source=components/shared/DireccionGoogleMaps.tsx:L18 | neighbors=[CapturarDetallesForm.tsx, CapturarDetallesForm.tsx, DireccionGoogleMaps.tsx]
- "shared_infracciones_obtenertokenguest": "obtenerTokenGuest()" | kind=code-symbol | source=lib/shared/infracciones.ts:L5 | neighbors=[service.ts, actions.ts, infracciones.ts]
- "shared_infracciones_viainfracciondetalle": "ViaInfraccionDetalle" | kind=code-symbol | source=lib/shared/infracciones.ts:L128 | neighbors=[types.ts, types.ts, infracciones.ts]
- "steps_procesomodal_procesomodal": "ProcesoModal()" | kind=code-symbol | source=features/via/infracciones/components/steps/ProcesoModal.tsx:L85 | neighbors=[FormularioInfraccion.tsx, ProcesoModal.tsx, getStepIndex()]
- "templates_layout_emaillayout": "emailLayout()" | kind=code-symbol | source=lib/emails/templates/layout.ts:L56 | neighbors=[asignacion-fiscalia.ts, layout.ts, orden-liberacion.ts]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/ugomez/Documents/GitHub/seguridad_publica/.graphify/description-instructions/batch-035.json

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
