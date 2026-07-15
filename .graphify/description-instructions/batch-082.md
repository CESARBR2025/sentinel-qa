# Node Description Batch 83 of 93

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

- "plantilla_permisos_page_plantillapermisosrolpage": "PlantillaPermisosRolPage()" | kind=code-symbol | source=app/admin/roles/[id]/plantilla-permisos/page.tsx:L9 | neighbors=[page.tsx]
- "plugins_context_loader_budget_warn_msg": "BUDGET_WARN_MSG()" | kind=code-symbol | source=.opencode/plugins/context-loader.js:L145 | neighbors=[context-loader.js]
- "plugins_context_loader_buildgraphifyquery": "buildGraphifyQuery()" | kind=code-symbol | source=.opencode/plugins/context-loader.js:L237 | neighbors=[context-loader.js]
- "plugins_context_loader_cacheclear": "cacheClear()" | kind=code-symbol | source=.opencode/plugins/context-loader.js:L95 | neighbors=[context-loader.js]
- "plugins_context_loader_checkbudget": "checkBudget()" | kind=code-symbol | source=.opencode/plugins/context-loader.js:L302 | neighbors=[context-loader.js]
- "plugins_context_loader_checkpoint": "checkpoint()" | kind=code-symbol | source=.opencode/plugins/context-loader.js:L257 | neighbors=[context-loader.js]
- "plugins_context_loader_checkpoint_script": "CHECKPOINT_SCRIPT" | kind=code-symbol | source=.opencode/plugins/context-loader.js:L45 | neighbors=[context-loader.js]
- "plugins_context_loader_decision_msg": "DECISION_MSG" | kind=code-symbol | source=.opencode/plugins/context-loader.js:L151 | neighbors=[context-loader.js]
- "plugins_context_loader_dirname": "__dirname" | kind=code-symbol | source=.opencode/plugins/context-loader.js:L20 | neighbors=[context-loader.js]
- "plugins_context_loader_estimatetokens": "estimateTokens()" | kind=code-symbol | source=.opencode/plugins/context-loader.js:L32 | neighbors=[context-loader.js]
- "plugins_context_loader_extractkeywords": "extractKeywords()" | kind=code-symbol | source=.opencode/plugins/context-loader.js:L225 | neighbors=[context-loader.js]
- "plugins_context_loader_getfilestouched": "getFilesTouched()" | kind=code-symbol | source=.opencode/plugins/context-loader.js:L317 | neighbors=[context-loader.js]
- "plugins_context_loader_golden_rules": "GOLDEN_RULES" | kind=code-symbol | source=.opencode/plugins/context-loader.js:L133 | neighbors=[context-loader.js]
- "plugins_context_loader_graph_path": "GRAPH_PATH" | kind=code-symbol | source=.opencode/plugins/context-loader.js:L44 | neighbors=[context-loader.js]
- "plugins_context_loader_graphify_stale_msg": "GRAPHIFY_STALE_MSG" | kind=code-symbol | source=.opencode/plugins/context-loader.js:L155 | neighbors=[context-loader.js]
- "plugins_context_loader_graphifycache": "graphifyCache" | kind=code-symbol | source=.opencode/plugins/context-loader.js:L68 | neighbors=[context-loader.js]
- "plugins_context_loader_isgenerictask": "isGenericTask()" | kind=code-symbol | source=.opencode/plugins/context-loader.js:L248 | neighbors=[context-loader.js]
- "plugins_context_loader_logtoken": "logToken()" | kind=code-symbol | source=.opencode/plugins/context-loader.js:L37 | neighbors=[context-loader.js]
- "plugins_context_loader_pendingdecisions": "pendingDecisions()" | kind=code-symbol | source=.opencode/plugins/context-loader.js:L285 | neighbors=[context-loader.js]
- "plugins_context_loader_root": "ROOT" | kind=code-symbol | source=.opencode/plugins/context-loader.js:L21 | neighbors=[context-loader.js]
- "plugins_context_loader_savepluginstate": "savePluginState()" | kind=code-symbol | source=.opencode/plugins/context-loader.js:L121 | neighbors=[context-loader.js]
- "plugins_context_loader_scope_creep_msg": "SCOPE_CREEP_MSG()" | kind=code-symbol | source=.opencode/plugins/context-loader.js:L148 | neighbors=[context-loader.js]
- "plugins_context_loader_sessionsummary": "sessionSummary()" | kind=code-symbol | source=.opencode/plugins/context-loader.js:L270 | neighbors=[context-loader.js]
- "plugins_context_loader_shouldshowgraphifyresult": "shouldShowGraphifyResult()" | kind=code-symbol | source=.opencode/plugins/context-loader.js:L338 | neighbors=[context-loader.js]
- "plugins_context_loader_state_file": "STATE_FILE" | kind=code-symbol | source=.opencode/plugins/context-loader.js:L103 | neighbors=[context-loader.js]
- "plugins_context_loader_stop_words": "STOP_WORDS" | kind=code-symbol | source=.opencode/plugins/context-loader.js:L166 | neighbors=[context-loader.js]
- "plugins_context_loader_subagent_msg": "SUBAGENT_MSG" | kind=code-symbol | source=.opencode/plugins/context-loader.js:L141 | neighbors=[context-loader.js]
- "plugins_context_loader_token_log": "TOKEN_LOG" | kind=code-symbol | source=.opencode/plugins/context-loader.js:L30 | neighbors=[context-loader.js]
- "plugins_context_loader_verify_msg": "VERIFY_MSG" | kind=code-symbol | source=.opencode/plugins/context-loader.js:L137 | neighbors=[context-loader.js]
- "plugins_context_loader_ymdebug": "ymDebug()" | kind=code-symbol | source=.opencode/plugins/context-loader.js:L60 | neighbors=[context-loader.js]
- "plugins_graphify_context_map_path": "CONTEXT_MAP_PATH" | kind=code-symbol | source=.opencode/plugins/graphify.js:L10 | neighbors=[graphify.js]
- "plugins_graphify_dirname": "__dirname" | kind=code-symbol | source=.opencode/plugins/graphify.js:L8 | neighbors=[graphify.js]
- "plugins_graphify_graph_json": "GRAPH_JSON" | kind=code-symbol | source=.opencode/plugins/graphify.js:L11 | neighbors=[graphify.js]
- "plugins_graphify_graphifyplugin": "GraphifyPlugin()" | kind=code-symbol | source=.opencode/plugins/graphify.js:L15 | neighbors=[graphify.js]
- "plugins_graphify_loader_script": "LOADER_SCRIPT" | kind=code-symbol | source=.opencode/plugins/graphify.js:L12 | neighbors=[graphify.js]
- "plugins_graphify_root": "ROOT" | kind=code-symbol | source=.opencode/plugins/graphify.js:L9 | neighbors=[graphify.js]
- "plugins_graphify_skill_path": "SKILL_PATH" | kind=code-symbol | source=.opencode/plugins/graphify.js:L13 | neighbors=[graphify.js]
- "postcss_config_config": "config" | kind=code-symbol | source=postcss.config.mjs:L1 | neighbors=[postcss.config.mjs]
- "prevencion_agregarautoridadform_autoridad": "Autoridad" | kind=code-symbol | source=components/prevencion/AgregarAutoridadForm.tsx:L8 | neighbors=[AgregarAutoridadForm.tsx]
- "prevencion_agregarautoridadform_autoridades": "AUTORIDADES" | kind=code-symbol | source=components/prevencion/AgregarAutoridadForm.tsx:L7 | neighbors=[AgregarAutoridadForm.tsx]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/ugomez/Documents/GitHub/seguridad_publica/.graphify/description-instructions/batch-082.json

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
