# Node Description Batch 78 of 86

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
- "plugins_graphify_loader_script": "LOADER_SCRIPT" | kind=code-symbol | source=.opencode/plugins/graphify.js:L12 | neighbors=[graphify.js]
- "plugins_graphify_root": "ROOT" | kind=code-symbol | source=.opencode/plugins/graphify.js:L9 | neighbors=[graphify.js]
- "plugins_graphify_skill_path": "SKILL_PATH" | kind=code-symbol | source=.opencode/plugins/graphify.js:L13 | neighbors=[graphify.js]
- "postcss_config_config": "config" | kind=code-symbol | source=postcss.config.mjs:L1 | neighbors=[postcss.config.mjs]
- "prevencion_agregarautoridadform_autoridad": "Autoridad" | kind=code-symbol | source=components/prevencion/AgregarAutoridadForm.tsx:L8 | neighbors=[AgregarAutoridadForm.tsx]
- "prevencion_agregarautoridadform_autoridades": "AUTORIDADES" | kind=code-symbol | source=components/prevencion/AgregarAutoridadForm.tsx:L7 | neighbors=[AgregarAutoridadForm.tsx]
- "prevencion_agregarautoridadform_i": "I" | kind=code-symbol | source=components/prevencion/AgregarAutoridadForm.tsx:L20 | neighbors=[AgregarAutoridadForm.tsx]
- "prevencion_agregarautoridadform_l": "L" | kind=code-symbol | source=components/prevencion/AgregarAutoridadForm.tsx:L16 | neighbors=[AgregarAutoridadForm.tsx]
- "prevencion_agregarautoridadform_props": "Props" | kind=code-symbol | source=components/prevencion/AgregarAutoridadForm.tsx:L10 | neighbors=[AgregarAutoridadForm.tsx]
- "prevencion_autoridadbadge_cfg": "CFG" | kind=code-symbol | source=components/prevencion/AutoridadBadge.tsx:L1 | neighbors=[AutoridadBadge.tsx]
- "prevencion_cancelacionmodal_inputfield": "InputField()" | kind=code-symbol | source=components/prevencion/CancelacionModal.tsx:L73 | neighbors=[CancelacionModal.tsx]
- "prevencion_cancelacionmodal_textareafield": "TextareaField()" | kind=code-symbol | source=components/prevencion/CancelacionModal.tsx:L85 | neighbors=[CancelacionModal.tsx]
- "prevencion_contestacionform_formfield": "FormField()" | kind=code-symbol | source=components/prevencion/ContestacionForm.tsx:L93 | neighbors=[ContestacionForm.tsx]
- "prevencion_contestacionform_inputstyle": "inputStyle" | kind=code-symbol | source=components/prevencion/ContestacionForm.tsx:L82 | neighbors=[ContestacionForm.tsx]
- "prevencion_layout_prevencionlayout": "PrevencionLayout()" | kind=code-symbol | source=app/prevencion/layout.tsx:L10 | neighbors=[layout.tsx]
- "prevencion_medidasfiltros_autoridades": "AUTORIDADES" | kind=code-symbol | source=components/prevencion/MedidasFiltros.tsx:L14 | neighbors=[MedidasFiltros.tsx]
- "prevencion_medidasfiltros_estados": "ESTADOS" | kind=code-symbol | source=components/prevencion/MedidasFiltros.tsx:L6 | neighbors=[MedidasFiltros.tsx]
- "prevencion_permisos_guardarpermiso": "guardarPermiso()" | kind=code-symbol | source=lib/prevencion/permisos.ts:L17 | neighbors=[permisos.ts]
- "prevencion_permisos_guardarplantillaseccion": "guardarPlantillaSeccion()" | kind=code-symbol | source=lib/prevencion/permisos.ts:L25 | neighbors=[permisos.ts]
- "prevencion_permisos_obtenerpermisosusuario": "obtenerPermisosUsuario()" | kind=code-symbol | source=lib/prevencion/permisos.ts:L9 | neighbors=[permisos.ts]

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
