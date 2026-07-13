# Node Description Batch 51 of 87

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

- "rol_servicios_catalogos_actions_toggletipoobservacion": "toggleTipoObservacion()" | kind=code-symbol | source=lib/rol-servicios/catalogos-actions.ts:L98 | neighbors=[catalogos-actions.ts, toggleCatalogo()]
- "rol_servicios_mapper_rowtorolestadofuerza": "rowToRolEstadoFuerza()" | kind=code-symbol | source=lib/rol-servicios/mapper.ts:L77 | neighbors=[mapper.ts, repository.ts]
- "rol_servicios_repository_getasignacionesbyrolid": "getAsignacionesByRolId()" | kind=code-symbol | source=lib/rol-servicios/repository.ts:L21 | neighbors=[repository.ts, service.ts]
- "rol_servicios_repository_getbodycams": "getBodyCams()" | kind=code-symbol | source=lib/rol-servicios/repository.ts:L55 | neighbors=[repository.ts, service.ts]
- "rol_servicios_repository_getestadofuerzabyrolid": "getEstadoFuerzaByRolId()" | kind=code-symbol | source=lib/rol-servicios/repository.ts:L29 | neighbors=[repository.ts, service.ts]
- "rol_servicios_repository_getestadofuerzaconceptos": "getEstadoFuerzaConceptos()" | kind=code-symbol | source=lib/rol-servicios/repository.ts:L60 | neighbors=[repository.ts, service.ts]
- "rol_servicios_repository_getmedioscanalizacion": "getMediosCanalizacion()" | kind=code-symbol | source=lib/rol-servicios/repository.ts:L81 | neighbors=[repository.ts, service.ts]
- "rol_servicios_repository_getobservacionesbyrolid": "getObservacionesByRolId()" | kind=code-symbol | source=lib/rol-servicios/repository.ts:L37 | neighbors=[repository.ts, service.ts]
- "rol_servicios_repository_getradios": "getRadios()" | kind=code-symbol | source=lib/rol-servicios/repository.ts:L50 | neighbors=[repository.ts, service.ts]
- "rol_servicios_repository_getsectores": "getSectores()" | kind=code-symbol | source=lib/rol-servicios/repository.ts:L45 | neighbors=[repository.ts, service.ts]
- "rol_servicios_repository_gettiposemergencia": "getTiposEmergencia()" | kind=code-symbol | source=lib/rol-servicios/repository.ts:L74 | neighbors=[repository.ts, service.ts]
- "rol_servicios_repository_gettiposobservacion": "getTiposObservacion()" | kind=code-symbol | source=lib/rol-servicios/repository.ts:L67 | neighbors=[repository.ts, service.ts]
- "rol_servicios_servicefooter_servicefooter": "ServiceFooter()" | kind=code-symbol | source=components/rol_servicios/ServiceFooter.tsx:L6 | neighbors=[page.tsx, ServiceFooter.tsx]
- "rol_servicios_servicetable_servicetable": "ServiceTable()" | kind=code-symbol | source=components/rol_servicios/ServiceTable.tsx:L12 | neighbors=[page.tsx, ServiceTable.tsx]
- "rol_servicios_signaturemodal_signaturemodal": "SignatureModal()" | kind=code-symbol | source=components/rol_servicios/SignatureModal.tsx:L13 | neighbors=[ServiceFooter.tsx, SignatureModal.tsx]
- "rol_servicios_types_turno": "Turno" | kind=code-symbol | source=lib/rol-servicios/types.ts:L1 | neighbors=[service.ts, types.ts]
- "sasiete_client_generarordenpago": "generarOrdenPago()" | kind=code-symbol | source=features/via/saSiete/client.ts:L1 | neighbors=[FormularioInfraccion.tsx, client.ts]
- "sasiete_types_generarordenpagodto": "GenerarOrdenPagoDTO" | kind=code-symbol | source=features/via/saSiete/types.ts:L29 | neighbors=[service.ts, types.ts]
- "sasiete_types_resultadosa7": "ResultadoSA7" | kind=code-symbol | source=features/via/saSiete/types.ts:L40 | neighbors=[service.ts, types.ts]
- "scripts_export_schema_getcolumns": "getColumns()" | kind=code-symbol | source=scripts/export-schema.mjs:L39 | neighbors=[export-schema.mjs, main()]
- "scripts_export_schema_getenums": "getEnums()" | kind=code-symbol | source=scripts/export-schema.mjs:L51 | neighbors=[export-schema.mjs, main()]
- "scripts_export_schema_getschemas": "getSchemas()" | kind=code-symbol | source=scripts/export-schema.mjs:L20 | neighbors=[export-schema.mjs, main()]
- "scripts_export_schema_gettables": "getTables()" | kind=code-symbol | source=scripts/export-schema.mjs:L29 | neighbors=[export-schema.mjs, main()]
- "scripts_exportar_schema_getcolumns": "getColumns()" | kind=code-symbol | source=scripts/exportar-schema.ts:L23 | neighbors=[exportar-schema.ts, main()]
- "scripts_exportar_schema_getenums": "getEnums()" | kind=code-symbol | source=scripts/exportar-schema.ts:L35 | neighbors=[exportar-schema.ts, main()]
- "scripts_exportar_schema_gettables": "getTables()" | kind=code-symbol | source=scripts/exportar-schema.ts:L13 | neighbors=[exportar-schema.ts, main()]
- "scripts_extract_domain_extractdomain": "extractDomain()" | kind=code-symbol | source=scripts/extract-domain.mjs:L38 | neighbors=[extract-domain.mjs, loadKeywords()]
- "scripts_extract_domain_loadkeywords": "loadKeywords()" | kind=code-symbol | source=scripts/extract-domain.mjs:L14 | neighbors=[extract-domain.mjs, extractDomain()]
- "scripts_load_context_buildkeywords": "buildKeywords()" | kind=code-symbol | source=scripts/load-context.mjs:L14 | neighbors=[load-context.mjs, main()]
- "scripts_load_context_extractdomain": "extractDomain()" | kind=code-symbol | source=scripts/load-context.mjs:L31 | neighbors=[load-context.mjs, main()]
- "scripts_load_context_querygraph": "queryGraph()" | kind=code-symbol | source=scripts/load-context.mjs:L64 | neighbors=[load-context.mjs, main()]
- "scripts_load_context_resolvepath": "resolvePath()" | kind=code-symbol | source=scripts/load-context.mjs:L44 | neighbors=[load-context.mjs, buildInstructions()]
- "scripts_session_checkpoint_append": "append()" | kind=code-symbol | source=scripts/session-checkpoint.mjs:L39 | neighbors=[session-checkpoint.mjs, ensureDir()]
- "scripts_session_checkpoint_budget": "budget()" | kind=code-symbol | source=scripts/session-checkpoint.mjs:L130 | neighbors=[session-checkpoint.mjs, budgetReport()]
- "scripts_session_checkpoint_formatnum": "formatNum()" | kind=code-symbol | source=scripts/session-checkpoint.mjs:L182 | neighbors=[session-checkpoint.mjs, budgetReport()]
- "scripts_session_checkpoint_summary": "summary()" | kind=code-symbol | source=scripts/session-checkpoint.mjs:L74 | neighbors=[session-checkpoint.mjs, formatEvent()]
- "scripts_trace_server_escaperegex": "escapeRegex()" | kind=code-symbol | source=scripts/trace-server.mjs:L205 | neighbors=[trace-server.mjs, findFunctionBodyFallback()]
- "scripts_trace_server_injectservertrace": "injectServerTrace()" | kind=code-symbol | source=scripts/trace-server.mjs:L52 | neighbors=[trace-server.mjs, findFunctionBody()]
- "scripts_trace_server_isinsideliteral": "isInsideLiteral()" | kind=code-symbol | source=scripts/trace-server.mjs:L160 | neighbors=[trace-server.mjs, findMatchingBrace()]
- "scripts_trace_server_require": "require" | kind=code-symbol | source=scripts/trace-server.mjs:L15 | neighbors=[trace-server.mjs, findFunctionBody()]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/cesarbr/Documents/dev/sjr/seguridad_publica/.graphify/description-instructions/batch-050.json

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
