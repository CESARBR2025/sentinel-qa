# Node Description Batch 82 of 86

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

- "scripts_extract_domain_root": "ROOT" | kind=code-symbol | source=scripts/extract-domain.mjs:L8 | neighbors=[extract-domain.mjs]
- "scripts_load_context_context_map": "CONTEXT_MAP" | kind=code-symbol | source=scripts/load-context.mjs:L11 | neighbors=[load-context.mjs]
- "scripts_load_context_dirname": "__dirname" | kind=code-symbol | source=scripts/load-context.mjs:L9 | neighbors=[load-context.mjs]
- "scripts_load_context_graph_json": "GRAPH_JSON" | kind=code-symbol | source=scripts/load-context.mjs:L12 | neighbors=[load-context.mjs]
- "scripts_load_context_keywords": "KEYWORDS" | kind=code-symbol | source=scripts/load-context.mjs:L14 | neighbors=[load-context.mjs]
- "scripts_load_context_root": "ROOT" | kind=code-symbol | source=scripts/load-context.mjs:L10 | neighbors=[load-context.mjs]
- "scripts_populate_vault_cwd": "CWD" | kind=code-symbol | source=scripts/populate-vault.mjs:L12 | neighbors=[populate-vault.mjs]
- "scripts_populate_vault_dirname": "__dirname" | kind=code-symbol | source=scripts/populate-vault.mjs:L11 | neighbors=[populate-vault.mjs]
- "scripts_populate_vault_main": "main()" | kind=code-symbol | source=scripts/populate-vault.mjs:L316 | neighbors=[populate-vault.mjs]
- "scripts_populate_vault_populateapiroutes": "populateAPIRoutes()" | kind=code-symbol | source=scripts/populate-vault.mjs:L142 | neighbors=[populate-vault.mjs]
- "scripts_populate_vault_populatecomandos": "populateComandos()" | kind=code-symbol | source=scripts/populate-vault.mjs:L18 | neighbors=[populate-vault.mjs]
- "scripts_populate_vault_populateenvvars": "populateEnvVars()" | kind=code-symbol | source=scripts/populate-vault.mjs:L65 | neighbors=[populate-vault.mjs]
- "scripts_populate_vault_populateestructura": "populateEstructura()" | kind=code-symbol | source=scripts/populate-vault.mjs:L104 | neighbors=[populate-vault.mjs]
- "scripts_populate_vault_populatefeatures": "populateFeatures()" | kind=code-symbol | source=scripts/populate-vault.mjs:L194 | neighbors=[populate-vault.mjs]
- "scripts_populate_vault_populatelibrerias": "populateLibrerias()" | kind=code-symbol | source=scripts/populate-vault.mjs:L34 | neighbors=[populate-vault.mjs]
- "scripts_populate_vault_populatemiddleware": "populateMiddleware()" | kind=code-symbol | source=scripts/populate-vault.mjs:L271 | neighbors=[populate-vault.mjs]
- "scripts_populate_vault_populateserveractions": "populateServerActions()" | kind=code-symbol | source=scripts/populate-vault.mjs:L222 | neighbors=[populate-vault.mjs]
- "scripts_session_checkpoint_args": "args" | kind=code-symbol | source=scripts/session-checkpoint.mjs:L244 | neighbors=[session-checkpoint.mjs]
- "scripts_session_checkpoint_clear": "clear()" | kind=code-symbol | source=scripts/session-checkpoint.mjs:L126 | neighbors=[session-checkpoint.mjs]
- "scripts_session_checkpoint_cleardecisions": "clearDecisions()" | kind=code-symbol | source=scripts/session-checkpoint.mjs:L238 | neighbors=[session-checkpoint.mjs]
- "scripts_session_checkpoint_decisions_file": "DECISIONS_FILE" | kind=code-symbol | source=scripts/session-checkpoint.mjs:L19 | neighbors=[session-checkpoint.mjs]
- "scripts_session_checkpoint_dirname": "__dirname" | kind=code-symbol | source=scripts/session-checkpoint.mjs:L15 | neighbors=[session-checkpoint.mjs]
- "scripts_session_checkpoint_root": "ROOT" | kind=code-symbol | source=scripts/session-checkpoint.mjs:L16 | neighbors=[session-checkpoint.mjs]
- "scripts_session_checkpoint_session_dir": "SESSION_DIR" | kind=code-symbol | source=scripts/session-checkpoint.mjs:L17 | neighbors=[session-checkpoint.mjs]
- "scripts_session_checkpoint_session_file": "SESSION_FILE" | kind=code-symbol | source=scripts/session-checkpoint.mjs:L18 | neighbors=[session-checkpoint.mjs]
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

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/cesarbr/Documents/dev/sjr/seguridad_publica/.graphify/description-instructions/batch-081.json

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
