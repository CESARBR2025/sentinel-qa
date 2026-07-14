# Node Description Batch 78 of 87

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

- "oficiales_service_oficialesviaservice_obtenermiperfil": ".obtenerMiPerfil()" | kind=code-symbol | source=features/via/oficiales/service.ts:L12 | neighbors=[OficialesViaService]
- "oficiales_service_oficialesviaservice_obteneroficialid": ".obtenerOficialId()" | kind=code-symbol | source=features/via/oficiales/service.ts:L4 | neighbors=[OficialesViaService]
- "oficiales_service_oficialesviaservice_obtenerporid": ".obtenerPorId()" | kind=code-symbol | source=features/via/oficiales/service.ts:L20 | neighbors=[OficialesViaService]
- "partials_header_dashboardheaderprops": "DashboardHeaderProps" | kind=code-symbol | source=components/partials/Header.tsx:L6 | neighbors=[Header.tsx]
- "partials_subheader_subheaderprops": "SubHeaderProps" | kind=code-symbol | source=components/partials/SubHeader.tsx:L8 | neighbors=[SubHeader.tsx]
- "path_route_get": "GET()" | kind=code-symbol | source=app/api/uploads/[...path]/route.ts:L16 | neighbors=[route.ts]
- "path_route_mime": "MIME" | kind=code-symbol | source=app/api/uploads/[...path]/route.ts:L7 | neighbors=[route.ts]
- "pendiente_analisis_page_analisispage": "AnalisisPage()" | kind=code-symbol | source=app/analisis/pendiente-analisis/page.tsx:L9 | neighbors=[page.tsx]
- "pendientes_despacho_route_get": "GET()" | kind=code-symbol | source=app/api/incidentes/pendientes-despacho/route.ts:L7 | neighbors=[route.ts]
- "permisos_core_accion": "Accion" | kind=code-symbol | source=lib/permisos/core.ts:L7 | neighbors=[core.ts]
- "permisos_core_listarpermisosporusuario": "listarPermisosPorUsuario()" | kind=code-symbol | source=lib/permisos/core.ts:L62 | neighbors=[core.ts]
- "permisos_core_permiso_total": "PERMISO_TOTAL" | kind=code-symbol | source=lib/permisos/core.ts:L22 | neighbors=[core.ts]
- "permisos_core_tieneplantillarol": "tienePlantillaRol()" | kind=code-symbol | source=lib/permisos/core.ts:L112 | neighbors=[core.ts]
- "permisos_registro_modulopermisos": "ModuloPermisos" | kind=code-symbol | source=lib/permisos/registro.ts:L10 | neighbors=[registro.ts]
- "plantilla_permisos_page_plantillapermisosrolpage": "PlantillaPermisosRolPage()" | kind=code-symbol | source=app/admin/roles/[id]/plantilla-permisos/page.tsx:L9 | neighbors=[page.tsx]
- "plugins_context_loader_budget_warn_msg": "BUDGET_WARN_MSG()" | kind=code-symbol | source=.opencode/plugins/context-loader.js:L44 | neighbors=[context-loader.js]
- "plugins_context_loader_checkbudget": "checkBudget()" | kind=code-symbol | source=.opencode/plugins/context-loader.js:L156 | neighbors=[context-loader.js]
- "plugins_context_loader_checkpoint": "checkpoint()" | kind=code-symbol | source=.opencode/plugins/context-loader.js:L111 | neighbors=[context-loader.js]
- "plugins_context_loader_checkpoint_script": "CHECKPOINT_SCRIPT" | kind=code-symbol | source=.opencode/plugins/context-loader.js:L23 | neighbors=[context-loader.js]
- "plugins_context_loader_contextloaderplugin": "ContextLoaderPlugin()" | kind=code-symbol | source=.opencode/plugins/context-loader.js:L198 | neighbors=[context-loader.js]
- "plugins_context_loader_decision_msg": "DECISION_MSG" | kind=code-symbol | source=.opencode/plugins/context-loader.js:L50 | neighbors=[context-loader.js]
- "plugins_context_loader_dirname": "__dirname" | kind=code-symbol | source=.opencode/plugins/context-loader.js:L20 | neighbors=[context-loader.js]
- "plugins_context_loader_getfilestouched": "getFilesTouched()" | kind=code-symbol | source=.opencode/plugins/context-loader.js:L171 | neighbors=[context-loader.js]
- "plugins_context_loader_golden_rules": "GOLDEN_RULES" | kind=code-symbol | source=.opencode/plugins/context-loader.js:L32 | neighbors=[context-loader.js]
- "plugins_context_loader_graph_path": "GRAPH_PATH" | kind=code-symbol | source=.opencode/plugins/context-loader.js:L22 | neighbors=[context-loader.js]
- "plugins_context_loader_graphify_stale_msg": "GRAPHIFY_STALE_MSG" | kind=code-symbol | source=.opencode/plugins/context-loader.js:L54 | neighbors=[context-loader.js]
- "plugins_context_loader_graphifyquery": "graphifyQuery()" | kind=code-symbol | source=.opencode/plugins/context-loader.js:L65 | neighbors=[context-loader.js]
- "plugins_context_loader_graphifysummary": "graphifySummary()" | kind=code-symbol | source=.opencode/plugins/context-loader.js:L84 | neighbors=[context-loader.js]
- "plugins_context_loader_isgenerictask": "isGenericTask()" | kind=code-symbol | source=.opencode/plugins/context-loader.js:L102 | neighbors=[context-loader.js]
- "plugins_context_loader_pendingdecisions": "pendingDecisions()" | kind=code-symbol | source=.opencode/plugins/context-loader.js:L139 | neighbors=[context-loader.js]
- "plugins_context_loader_root": "ROOT" | kind=code-symbol | source=.opencode/plugins/context-loader.js:L21 | neighbors=[context-loader.js]
- "plugins_context_loader_scope_creep_msg": "SCOPE_CREEP_MSG()" | kind=code-symbol | source=.opencode/plugins/context-loader.js:L47 | neighbors=[context-loader.js]
- "plugins_context_loader_sessionsummary": "sessionSummary()" | kind=code-symbol | source=.opencode/plugins/context-loader.js:L124 | neighbors=[context-loader.js]
- "plugins_context_loader_shouldshowgraphifyresult": "shouldShowGraphifyResult()" | kind=code-symbol | source=.opencode/plugins/context-loader.js:L192 | neighbors=[context-loader.js]
- "plugins_context_loader_subagent_msg": "SUBAGENT_MSG" | kind=code-symbol | source=.opencode/plugins/context-loader.js:L40 | neighbors=[context-loader.js]
- "plugins_context_loader_verify_msg": "VERIFY_MSG" | kind=code-symbol | source=.opencode/plugins/context-loader.js:L36 | neighbors=[context-loader.js]
- "plugins_graphify_context_map_path": "CONTEXT_MAP_PATH" | kind=code-symbol | source=.opencode/plugins/graphify.js:L10 | neighbors=[graphify.js]
- "plugins_graphify_dirname": "__dirname" | kind=code-symbol | source=.opencode/plugins/graphify.js:L8 | neighbors=[graphify.js]
- "plugins_graphify_graph_json": "GRAPH_JSON" | kind=code-symbol | source=.opencode/plugins/graphify.js:L11 | neighbors=[graphify.js]
- "plugins_graphify_graphifyplugin": "GraphifyPlugin()" | kind=code-symbol | source=.opencode/plugins/graphify.js:L15 | neighbors=[graphify.js]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/cesarbr/Documents/dev/sjr/seguridad_publica/.graphify/description-instructions/batch-077.json

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
