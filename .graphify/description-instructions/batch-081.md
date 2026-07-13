# Node Description Batch 82 of 87

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

- "rondin_page_rondinoficialpage": "RondinOficialPage()" | kind=code-symbol | source=app/oficial/rondin/page.tsx:L7 | neighbors=[page.tsx]
- "sasiete_mapper_ordenpagorow": "OrdenPagoRow" | kind=code-symbol | source=features/via/saSiete/mapper.ts:L3 | neighbors=[mapper.ts]
- "sasiete_repository_sa7repository_actualizarordenpago": ".actualizarOrdenPago()" | kind=code-symbol | source=features/via/saSiete/repository.ts:L65 | neighbors=[SA7Repository]
- "sasiete_repository_sa7repository_buscarordenporinfraccionid": ".buscarOrdenPorInfraccionId()" | kind=code-symbol | source=features/via/saSiete/repository.ts:L57 | neighbors=[SA7Repository]
- "sasiete_repository_sa7repository_insertarordenpago": ".insertarOrdenPago()" | kind=code-symbol | source=features/via/saSiete/repository.ts:L14 | neighbors=[SA7Repository]
- "sasiete_repository_sa7repository_obtenerconceptoidporclasificacion": ".obtenerConceptoIdPorClasificacion()" | kind=code-symbol | source=features/via/saSiete/repository.ts:L6 | neighbors=[SA7Repository]
- "sasiete_service_sa7service_buscarordenporinfraccion": ".buscarOrdenPorInfraccion()" | kind=code-symbol | source=features/via/saSiete/service.ts:L87 | neighbors=[SA7Service]
- "sasiete_service_sa7service_generarordenpago": ".generarOrdenPago()" | kind=code-symbol | source=features/via/saSiete/service.ts:L13 | neighbors=[SA7Service]
- "sasiete_service_sa7service_obtenerconceptoid": ".obtenerConceptoId()" | kind=code-symbol | source=features/via/saSiete/service.ts:L9 | neighbors=[SA7Service]
- "sasiete_types_catalogoconceptosa7": "CatalogoConceptoSA7" | kind=code-symbol | source=features/via/saSiete/types.ts:L1 | neighbors=[types.ts]
- "scripts_export_schema_dirname": "__dirname" | kind=code-symbol | source=scripts/export-schema.mjs:L8 | neighbors=[export-schema.mjs]
- "scripts_export_schema_root": "ROOT" | kind=code-symbol | source=scripts/export-schema.mjs:L9 | neighbors=[export-schema.mjs]
- "scripts_export_schema_typetoreadable": "typeToReadable()" | kind=code-symbol | source=scripts/export-schema.mjs:L69 | neighbors=[export-schema.mjs]
- "scripts_exportar_schema_columninfo": "ColumnInfo" | kind=code-symbol | source=scripts/exportar-schema.ts:L6 | neighbors=[exportar-schema.ts]
- "scripts_exportar_schema_schemas": "SCHEMAS" | kind=code-symbol | source=scripts/exportar-schema.ts:L4 | neighbors=[exportar-schema.ts]
- "scripts_exportar_schema_typetoreadable": "typeToReadable()" | kind=code-symbol | source=scripts/exportar-schema.ts:L53 | neighbors=[exportar-schema.ts]
- "scripts_extract_domain_context_map": "CONTEXT_MAP" | kind=code-symbol | source=scripts/extract-domain.mjs:L10 | neighbors=[extract-domain.mjs]
- "scripts_extract_domain_dirname": "__dirname" | kind=code-symbol | source=scripts/extract-domain.mjs:L8 | neighbors=[extract-domain.mjs]
- "scripts_extract_domain_keywords": "KEYWORDS" | kind=code-symbol | source=scripts/extract-domain.mjs:L10 | neighbors=[extract-domain.mjs]
- "scripts_extract_domain_root": "ROOT" | kind=code-symbol | source=scripts/extract-domain.mjs:L9 | neighbors=[extract-domain.mjs]
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
