# Node Description Batch 83 of 87

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

- "scripts_session_checkpoint_dirname": "__dirname" | kind=code-symbol | source=scripts/session-checkpoint.mjs:L15 | neighbors=[session-checkpoint.mjs]
- "scripts_session_checkpoint_root": "ROOT" | kind=code-symbol | source=scripts/session-checkpoint.mjs:L16 | neighbors=[session-checkpoint.mjs]
- "scripts_session_checkpoint_session_dir": "SESSION_DIR" | kind=code-symbol | source=scripts/session-checkpoint.mjs:L17 | neighbors=[session-checkpoint.mjs]
- "scripts_session_checkpoint_session_file": "SESSION_FILE" | kind=code-symbol | source=scripts/session-checkpoint.mjs:L18 | neighbors=[session-checkpoint.mjs]
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
- "scripts_trace_server_dirty": "dirty" | kind=code-symbol | source=scripts/trace-server.mjs:L238 | neighbors=[trace-server.mjs]
- "scripts_trace_server_extensions": "EXTENSIONS" | kind=code-symbol | source=scripts/trace-server.mjs:L22 | neighbors=[trace-server.mjs]
- "scripts_trace_server_filemap": "fileMap" | kind=code-symbol | source=scripts/trace-server.mjs:L227 | neighbors=[trace-server.mjs]
- "scripts_trace_server_filestomodify": "filesToModify" | kind=code-symbol | source=scripts/trace-server.mjs:L237 | neighbors=[trace-server.mjs]
- "scripts_trace_server_fnnames": "fnNames" | kind=code-symbol | source=scripts/trace-server.mjs:L216 | neighbors=[trace-server.mjs]
- "scripts_trace_server_forceflag": "forceFlag" | kind=code-symbol | source=scripts/trace-server.mjs:L217 | neighbors=[trace-server.mjs]
- "scripts_trace_server_root": "ROOT" | kind=code-symbol | source=scripts/trace-server.mjs:L18 | neighbors=[trace-server.mjs]
- "scripts_trace_server_search_dirs": "SEARCH_DIRS" | kind=code-symbol | source=scripts/trace-server.mjs:L21 | neighbors=[trace-server.mjs]
- "seguimientos_route_post": "POST()" | kind=code-symbol | source=app/api/prevencion/busquedas/[id]/seguimientos/route.ts:L7 | neighbors=[route.ts]
- "setup_2fa_page_setup2fapage": "Setup2FAPage()" | kind=code-symbol | source=app/(auth)/login/setup-2fa/page.tsx:L7 | neighbors=[page.tsx]
- "shared_detalleinfraccionview_fieldwithicon": "FieldWithIcon()" | kind=code-symbol | source=components/shared/DetalleInfraccionView.tsx:L464 | neighbors=[DetalleInfraccionView.tsx]
- "shared_detalleinfraccionview_getstatusstyle": "getStatusStyle()" | kind=code-symbol | source=components/shared/DetalleInfraccionView.tsx:L96 | neighbors=[DetalleInfraccionView.tsx]
- "shared_detalleinfraccionview_infracciondetalle": "InfraccionDetalle" | kind=code-symbol | source=components/shared/DetalleInfraccionView.tsx:L77 | neighbors=[DetalleInfraccionView.tsx]
- "shared_detalleinfraccionview_infracciongarantia": "InfraccionGarantia" | kind=code-symbol | source=components/shared/DetalleInfraccionView.tsx:L63 | neighbors=[DetalleInfraccionView.tsx]
- "shared_detalleinfraccionview_infraccionheader": "InfraccionHeader" | kind=code-symbol | source=components/shared/DetalleInfraccionView.tsx:L15 | neighbors=[DetalleInfraccionView.tsx]
- "shared_detalleinfraccionview_infraccioninfractor": "InfraccionInfractor" | kind=code-symbol | source=components/shared/DetalleInfraccionView.tsx:L41 | neighbors=[DetalleInfraccionView.tsx]
- "shared_detalleinfraccionview_infraccionlegal": "InfraccionLegal" | kind=code-symbol | source=components/shared/DetalleInfraccionView.tsx:L31 | neighbors=[DetalleInfraccionView.tsx]
- "shared_detalleinfraccionview_infraccionoficial": "InfraccionOficial" | kind=code-symbol | source=components/shared/DetalleInfraccionView.tsx:L47 | neighbors=[DetalleInfraccionView.tsx]
- "shared_detalleinfraccionview_infraccionubicacion": "InfraccionUbicacion" | kind=code-symbol | source=components/shared/DetalleInfraccionView.tsx:L67 | neighbors=[DetalleInfraccionView.tsx]
- "shared_detalleinfraccionview_infraccionvehiculo": "InfraccionVehiculo" | kind=code-symbol | source=components/shared/DetalleInfraccionView.tsx:L54 | neighbors=[DetalleInfraccionView.tsx]
- "shared_detalleinfraccionview_props": "Props" | kind=code-symbol | source=components/shared/DetalleInfraccionView.tsx:L142 | neighbors=[DetalleInfraccionView.tsx]
- "shared_detalleinfraccionview_section": "Section()" | kind=code-symbol | source=components/shared/DetalleInfraccionView.tsx:L440 | neighbors=[DetalleInfraccionView.tsx]
- "shared_detalleinfraccionview_status_styles": "STATUS_STYLES" | kind=code-symbol | source=components/shared/DetalleInfraccionView.tsx:L89 | neighbors=[DetalleInfraccionView.tsx]
- "shared_detalleinfraccionview_streetviewmap": "StreetViewMap()" | kind=code-symbol | source=components/shared/DetalleInfraccionView.tsx:L400 | neighbors=[DetalleInfraccionView.tsx]
- "shared_detalleinfraccionview_timelinenode": "TimelineNode()" | kind=code-symbol | source=components/shared/DetalleInfraccionView.tsx:L731 | neighbors=[DetalleInfraccionView.tsx]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/cesarbr/Documents/dev/sjr/seguridad_publica/.graphify/description-instructions/batch-082.json

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
