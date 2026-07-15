# Node Description Batch 55 of 93

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
- "scripts_populate_vault_populateapiroutes": "populateAPIRoutes()" | kind=code-symbol | source=scripts/populate-vault.mjs:L164 | neighbors=[populate-vault.mjs, writeBovedaSection()]
- "scripts_populate_vault_populatecomandos": "populateComandos()" | kind=code-symbol | source=scripts/populate-vault.mjs:L40 | neighbors=[populate-vault.mjs, writeBovedaSection()]
- "scripts_populate_vault_populateenvvars": "populateEnvVars()" | kind=code-symbol | source=scripts/populate-vault.mjs:L87 | neighbors=[populate-vault.mjs, writeBovedaSection()]
- "scripts_populate_vault_populateestructura": "populateEstructura()" | kind=code-symbol | source=scripts/populate-vault.mjs:L126 | neighbors=[populate-vault.mjs, writeBovedaSection()]
- "scripts_populate_vault_populatefeatures": "populateFeatures()" | kind=code-symbol | source=scripts/populate-vault.mjs:L216 | neighbors=[populate-vault.mjs, writeBovedaSection()]
- "scripts_populate_vault_populatelibrerias": "populateLibrerias()" | kind=code-symbol | source=scripts/populate-vault.mjs:L56 | neighbors=[populate-vault.mjs, writeBovedaSection()]
- "scripts_populate_vault_populatemiddleware": "populateMiddleware()" | kind=code-symbol | source=scripts/populate-vault.mjs:L293 | neighbors=[populate-vault.mjs, writeBovedaSection()]
- "scripts_populate_vault_populateserveractions": "populateServerActions()" | kind=code-symbol | source=scripts/populate-vault.mjs:L244 | neighbors=[populate-vault.mjs, writeBovedaSection()]
- "scripts_session_checkpoint_append": "append()" | kind=code-symbol | source=scripts/session-checkpoint.mjs:L39 | neighbors=[session-checkpoint.mjs, ensureDir()]
- "scripts_session_checkpoint_budget": "budget()" | kind=code-symbol | source=scripts/session-checkpoint.mjs:L130 | neighbors=[session-checkpoint.mjs, budgetReport()]
- "scripts_session_checkpoint_formatnum": "formatNum()" | kind=code-symbol | source=scripts/session-checkpoint.mjs:L182 | neighbors=[session-checkpoint.mjs, budgetReport()]
- "scripts_session_checkpoint_summary": "summary()" | kind=code-symbol | source=scripts/session-checkpoint.mjs:L74 | neighbors=[session-checkpoint.mjs, formatEvent()]
- "scripts_trace_client_buildhelpercode": "buildHelperCode()" | kind=code-symbol | source=scripts/trace-client.mjs:L30 | neighbors=[trace-client.mjs, injectClientTrace()]
- "scripts_trace_client_require": "require" | kind=code-symbol | source=scripts/trace-client.mjs:L15 | neighbors=[trace-client.mjs, findReactImportWithTS()]
- "scripts_trace_server_escaperegex": "escapeRegex()" | kind=code-symbol | source=scripts/trace-server.mjs:L205 | neighbors=[trace-server.mjs, findFunctionBodyFallback()]
- "scripts_trace_server_injectservertrace": "injectServerTrace()" | kind=code-symbol | source=scripts/trace-server.mjs:L52 | neighbors=[trace-server.mjs, findFunctionBody()]
- "scripts_trace_server_isinsideliteral": "isInsideLiteral()" | kind=code-symbol | source=scripts/trace-server.mjs:L160 | neighbors=[trace-server.mjs, findMatchingBrace()]
- "scripts_trace_server_require": "require" | kind=code-symbol | source=scripts/trace-server.mjs:L15 | neighbors=[trace-server.mjs, findFunctionBody()]
- "scripts_trace_utils_escaperegex": "escapeRegex()" | kind=code-symbol | source=scripts/trace-utils.mjs:L97 | neighbors=[trace-utils.mjs, findFunctionInContent()]
- "scripts_trace_utils_searchrecursive": "searchRecursive()" | kind=code-symbol | source=scripts/trace-utils.mjs:L14 | neighbors=[trace-utils.mjs, findSourceFile()]
- "scripts_trace_utils_walkrecursive": "walkRecursive()" | kind=code-symbol | source=scripts/trace-utils.mjs:L101 | neighbors=[trace-utils.mjs, findFunctionInContent()]
- "services_registrodetenidoservice_registrodetenidoservice": "registroDetenidoService" | kind=code-symbol | source=services/registroDetenidoService.ts:L4 | neighbors=[generarPresentacion.tsx, registroDetenidoService.ts]
- "shared_detalleinfraccionview_detalleinfraccionview": "DetalleInfraccionView()" | kind=code-symbol | source=components/shared/DetalleInfraccionView.tsx:L147 | neighbors=[page.tsx, DetalleInfraccionView.tsx]
- "shared_detalleinfraccionview_documentacionsection": "DocumentacionSection()" | kind=code-symbol | source=components/shared/DetalleInfraccionView.tsx:L661 | neighbors=[DetalleInfraccionView.tsx, formatDate()]
- "shared_detalleinfraccionview_formatcurrency": "formatCurrency()" | kind=code-symbol | source=components/shared/DetalleInfraccionView.tsx:L110 | neighbors=[DetalleInfraccionView.tsx, SummaryBar()]
- "shared_detalleinfraccionview_fundamentolegalsection": "FundamentoLegalSection()" | kind=code-symbol | source=components/shared/DetalleInfraccionView.tsx:L580 | neighbors=[DetalleInfraccionView.tsx, sanitize()]
- "shared_detalleinfraccionview_infractorvehiculosection": "InfractorVehiculoSection()" | kind=code-symbol | source=components/shared/DetalleInfraccionView.tsx:L521 | neighbors=[DetalleInfraccionView.tsx, sanitize()]
- "shared_detalleinfraccionview_mapgarantia": "mapGarantia()" | kind=code-symbol | source=components/shared/DetalleInfraccionView.tsx:L121 | neighbors=[DetalleInfraccionView.tsx, sanitize()]
- "shared_detalleinfraccionview_mapsection": "MapSection()" | kind=code-symbol | source=components/shared/DetalleInfraccionView.tsx:L207 | neighbors=[DetalleInfraccionView.tsx, sanitize()]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/ugomez/Documents/GitHub/seguridad_publica/.graphify/description-instructions/batch-054.json

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
