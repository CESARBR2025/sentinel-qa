# Node Description Batch 88 of 93

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

- "scripts_ab_test_savingspct": "savingsPct" | kind=code-symbol | source=scripts/ab-test.mjs:L224 | neighbors=[ab-test.mjs]
- "scripts_ab_test_showdetail": "showDetail" | kind=code-symbol | source=scripts/ab-test.mjs:L272 | neighbors=[ab-test.mjs]
- "scripts_ab_test_youmindaginstalled": "youmindagInstalled" | kind=code-symbol | source=scripts/ab-test.mjs:L226 | neighbors=[ab-test.mjs]
- "scripts_benchmark_agents_path": "AGENTS_PATH" | kind=code-symbol | source=scripts/benchmark.mjs:L17 | neighbors=[benchmark.mjs]
- "scripts_benchmark_agentschars": "agentsChars" | kind=code-symbol | source=scripts/benchmark.mjs:L178 | neighbors=[benchmark.mjs]
- "scripts_benchmark_boveda_dir": "BOVEDA_DIR" | kind=code-symbol | source=scripts/benchmark.mjs:L16 | neighbors=[benchmark.mjs]
- "scripts_benchmark_countbovedadocs": "countBovedaDocs()" | kind=code-symbol | source=scripts/benchmark.mjs:L59 | neighbors=[benchmark.mjs]
- "scripts_benchmark_countprojectfiles": "countProjectFiles()" | kind=code-symbol | source=scripts/benchmark.mjs:L31 | neighbors=[benchmark.mjs]
- "scripts_benchmark_dirname": "__dirname" | kind=code-symbol | source=scripts/benchmark.mjs:L13 | neighbors=[benchmark.mjs]
- "scripts_benchmark_discoverycost": "discoveryCost" | kind=code-symbol | source=scripts/benchmark.mjs:L180 | neighbors=[benchmark.mjs]
- "scripts_benchmark_docs_chars_bovedachars": "{ docs, chars: bovedaChars }" | kind=code-symbol | source=scripts/benchmark.mjs:L176 | neighbors=[benchmark.mjs]
- "scripts_benchmark_estimatediscoverycost": "estimateDiscoveryCost()" | kind=code-symbol | source=scripts/benchmark.mjs:L124 | neighbors=[benchmark.mjs]
- "scripts_benchmark_estimatesavings": "estimateSavings()" | kind=code-symbol | source=scripts/benchmark.mjs:L162 | neighbors=[benchmark.mjs]
- "scripts_benchmark_estimatesavingspercent": "estimateSavingsPercent()" | kind=code-symbol | source=scripts/benchmark.mjs:L166 | neighbors=[benchmark.mjs]
- "scripts_benchmark_files_lines": "{ files, lines }" | kind=code-symbol | source=scripts/benchmark.mjs:L175 | neighbors=[benchmark.mjs]
- "scripts_benchmark_formatnumber": "formatNumber()" | kind=code-symbol | source=scripts/benchmark.mjs:L107 | neighbors=[benchmark.mjs]
- "scripts_benchmark_getagentssize": "getAgentsSize()" | kind=code-symbol | source=scripts/benchmark.mjs:L89 | neighbors=[benchmark.mjs]
- "scripts_benchmark_getgraphifystats": "getGraphifyStats()" | kind=code-symbol | source=scripts/benchmark.mjs:L78 | neighbors=[benchmark.mjs]
- "scripts_benchmark_getprojectname": "getProjectName()" | kind=code-symbol | source=scripts/benchmark.mjs:L99 | neighbors=[benchmark.mjs]
- "scripts_benchmark_getyoumindagversion": "getYoumindagVersion()" | kind=code-symbol | source=scripts/benchmark.mjs:L94 | neighbors=[benchmark.mjs]
- "scripts_benchmark_graph_path": "GRAPH_PATH" | kind=code-symbol | source=scripts/benchmark.mjs:L15 | neighbors=[benchmark.mjs]
- "scripts_benchmark_nodes_edges": "{ nodes, edges }" | kind=code-symbol | source=scripts/benchmark.mjs:L177 | neighbors=[benchmark.mjs]
- "scripts_benchmark_payback": "payback" | kind=code-symbol | source=scripts/benchmark.mjs:L285 | neighbors=[benchmark.mjs]
- "scripts_benchmark_projectname": "projectName" | kind=code-symbol | source=scripts/benchmark.mjs:L173 | neighbors=[benchmark.mjs]
- "scripts_benchmark_root": "ROOT" | kind=code-symbol | source=scripts/benchmark.mjs:L14 | neighbors=[benchmark.mjs]
- "scripts_benchmark_savings": "savings" | kind=code-symbol | source=scripts/benchmark.mjs:L182 | neighbors=[benchmark.mjs]
- "scripts_benchmark_savingspercent": "savingsPercent" | kind=code-symbol | source=scripts/benchmark.mjs:L183 | neighbors=[benchmark.mjs]
- "scripts_benchmark_showjson": "showJson" | kind=code-symbol | source=scripts/benchmark.mjs:L27 | neighbors=[benchmark.mjs]
- "scripts_benchmark_version": "version" | kind=code-symbol | source=scripts/benchmark.mjs:L174 | neighbors=[benchmark.mjs]
- "scripts_benchmark_ym_json": "YM_JSON" | kind=code-symbol | source=scripts/benchmark.mjs:L18 | neighbors=[benchmark.mjs]
- "scripts_benchmark_youmindagcost": "youmindagCost" | kind=code-symbol | source=scripts/benchmark.mjs:L181 | neighbors=[benchmark.mjs]
- "scripts_export_schema_dirname": "__dirname" | kind=code-symbol | source=scripts/export-schema.mjs:L8 | neighbors=[export-schema.mjs]
- "scripts_export_schema_root": "ROOT" | kind=code-symbol | source=scripts/export-schema.mjs:L9 | neighbors=[export-schema.mjs]
- "scripts_export_schema_typetoreadable": "typeToReadable()" | kind=code-symbol | source=scripts/export-schema.mjs:L69 | neighbors=[export-schema.mjs]
- "scripts_exportar_schema_columninfo": "ColumnInfo" | kind=code-symbol | source=scripts/exportar-schema.ts:L6 | neighbors=[exportar-schema.ts]
- "scripts_exportar_schema_schemas": "SCHEMAS" | kind=code-symbol | source=scripts/exportar-schema.ts:L4 | neighbors=[exportar-schema.ts]
- "scripts_exportar_schema_typetoreadable": "typeToReadable()" | kind=code-symbol | source=scripts/exportar-schema.ts:L53 | neighbors=[exportar-schema.ts]
- "scripts_extract_domain_context_map": "CONTEXT_MAP" | kind=code-symbol | source=scripts/extract-domain.mjs:L10 | neighbors=[extract-domain.mjs]
- "scripts_extract_domain_dirname": "__dirname" | kind=code-symbol | source=scripts/extract-domain.mjs:L8 | neighbors=[extract-domain.mjs]
- "scripts_extract_domain_keywords": "KEYWORDS" | kind=code-symbol | source=scripts/extract-domain.mjs:L10 | neighbors=[extract-domain.mjs]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/ugomez/Documents/GitHub/seguridad_publica/.graphify/description-instructions/batch-087.json

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
