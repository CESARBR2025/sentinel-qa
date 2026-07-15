# Node Description Batch 89 of 93

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

- "scripts_session_checkpoint_clear": "clear()" | kind=code-symbol | source=scripts/session-checkpoint.mjs:L126 | neighbors=[session-checkpoint.mjs]
- "scripts_session_checkpoint_cleardecisions": "clearDecisions()" | kind=code-symbol | source=scripts/session-checkpoint.mjs:L238 | neighbors=[session-checkpoint.mjs]
- "scripts_session_checkpoint_decisions_file": "DECISIONS_FILE" | kind=code-symbol | source=scripts/session-checkpoint.mjs:L19 | neighbors=[session-checkpoint.mjs]
- "scripts_session_checkpoint_dirname": "__dirname" | kind=code-symbol | source=scripts/session-checkpoint.mjs:L15 | neighbors=[session-checkpoint.mjs]
- "scripts_session_checkpoint_root": "ROOT" | kind=code-symbol | source=scripts/session-checkpoint.mjs:L16 | neighbors=[session-checkpoint.mjs]
- "scripts_session_checkpoint_session_dir": "SESSION_DIR" | kind=code-symbol | source=scripts/session-checkpoint.mjs:L17 | neighbors=[session-checkpoint.mjs]
- "scripts_session_checkpoint_session_file": "SESSION_FILE" | kind=code-symbol | source=scripts/session-checkpoint.mjs:L18 | neighbors=[session-checkpoint.mjs]
- "scripts_trace_client_components": "components" | kind=code-symbol | source=scripts/trace-client.mjs:L192 | neighbors=[trace-client.mjs]
- "scripts_trace_client_dirname": "__dirname" | kind=code-symbol | source=scripts/trace-client.mjs:L16 | neighbors=[trace-client.mjs]
- "scripts_trace_client_dirty": "dirty" | kind=code-symbol | source=scripts/trace-client.mjs:L214 | neighbors=[trace-client.mjs]
- "scripts_trace_client_extensions": "EXTENSIONS" | kind=code-symbol | source=scripts/trace-client.mjs:L21 | neighbors=[trace-client.mjs]
- "scripts_trace_client_filemap": "fileMap" | kind=code-symbol | source=scripts/trace-client.mjs:L203 | neighbors=[trace-client.mjs]
- "scripts_trace_client_filestomodify": "filesToModify" | kind=code-symbol | source=scripts/trace-client.mjs:L213 | neighbors=[trace-client.mjs]
- "scripts_trace_client_forceflag": "forceFlag" | kind=code-symbol | source=scripts/trace-client.mjs:L193 | neighbors=[trace-client.mjs]
- "scripts_trace_client_root": "ROOT" | kind=code-symbol | source=scripts/trace-client.mjs:L17 | neighbors=[trace-client.mjs]
- "scripts_trace_client_search_dirs": "SEARCH_DIRS" | kind=code-symbol | source=scripts/trace-client.mjs:L20 | neighbors=[trace-client.mjs]
- "scripts_trace_components_components": "components" | kind=code-symbol | source=scripts/trace-components.mjs:L129 | neighbors=[trace-components.mjs]
- "scripts_trace_components_dirname": "__dirname" | kind=code-symbol | source=scripts/trace-components.mjs:L14 | neighbors=[trace-components.mjs]
- "scripts_trace_components_dirty": "dirty" | kind=code-symbol | source=scripts/trace-components.mjs:L151 | neighbors=[trace-components.mjs]
- "scripts_trace_components_extensions": "EXTENSIONS" | kind=code-symbol | source=scripts/trace-components.mjs:L19 | neighbors=[trace-components.mjs]
- "scripts_trace_components_filemap": "fileMap" | kind=code-symbol | source=scripts/trace-components.mjs:L140 | neighbors=[trace-components.mjs]
- "scripts_trace_components_filestomodify": "filesToModify" | kind=code-symbol | source=scripts/trace-components.mjs:L150 | neighbors=[trace-components.mjs]
- "scripts_trace_components_forceflag": "forceFlag" | kind=code-symbol | source=scripts/trace-components.mjs:L130 | neighbors=[trace-components.mjs]
- "scripts_trace_components_injecttrace": "injectTrace()" | kind=code-symbol | source=scripts/trace-components.mjs:L21 | neighbors=[trace-components.mjs]
- "scripts_trace_components_root": "ROOT" | kind=code-symbol | source=scripts/trace-components.mjs:L15 | neighbors=[trace-components.mjs]
- "scripts_trace_components_search_dirs": "SEARCH_DIRS" | kind=code-symbol | source=scripts/trace-components.mjs:L18 | neighbors=[trace-components.mjs]
- "scripts_trace_server_dirname": "__dirname" | kind=code-symbol | source=scripts/trace-server.mjs:L17 | neighbors=[trace-server.mjs]
- "scripts_trace_server_dirty": "dirty" | kind=code-symbol | source=scripts/trace-server.mjs:L241 | neighbors=[trace-server.mjs]
- "scripts_trace_server_extensions": "EXTENSIONS" | kind=code-symbol | source=scripts/trace-server.mjs:L22 | neighbors=[trace-server.mjs]
- "scripts_trace_server_filemap": "fileMap" | kind=code-symbol | source=scripts/trace-server.mjs:L227 | neighbors=[trace-server.mjs]
- "scripts_trace_server_filestomodify": "filesToModify" | kind=code-symbol | source=scripts/trace-server.mjs:L240 | neighbors=[trace-server.mjs]
- "scripts_trace_server_fnnames": "fnNames" | kind=code-symbol | source=scripts/trace-server.mjs:L216 | neighbors=[trace-server.mjs]
- "scripts_trace_server_forceflag": "forceFlag" | kind=code-symbol | source=scripts/trace-server.mjs:L217 | neighbors=[trace-server.mjs]
- "scripts_trace_server_root": "ROOT" | kind=code-symbol | source=scripts/trace-server.mjs:L18 | neighbors=[trace-server.mjs]
- "scripts_trace_server_search_dirs": "SEARCH_DIRS" | kind=code-symbol | source=scripts/trace-server.mjs:L21 | neighbors=[trace-server.mjs]
- "scripts_ym_dev_child": "child" | kind=code-symbol | source=scripts/ym-dev.mjs:L47 | neighbors=[ym-dev.mjs]
- "scripts_ym_dev_log": "LOG" | kind=code-symbol | source=scripts/ym-dev.mjs:L11 | neighbors=[ym-dev.mjs]
- "scripts_ym_dev_needsshell": "needsShell" | kind=code-symbol | source=scripts/ym-dev.mjs:L29 | neighbors=[ym-dev.mjs]
- "scripts_ym_dev_opts": "opts" | kind=code-symbol | source=scripts/ym-dev.mjs:L31 | neighbors=[ym-dev.mjs]
- "scripts_ym_dev_orig": "ORIG" | kind=code-symbol | source=scripts/ym-dev.mjs:L12 | neighbors=[ym-dev.mjs]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/ugomez/Documents/GitHub/seguridad_publica/.graphify/description-instructions/batch-088.json

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
