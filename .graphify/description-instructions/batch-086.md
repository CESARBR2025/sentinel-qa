# Node Description Batch 87 of 93

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

- "rondin_page_rondinoficialpage": "RondinOficialPage()" | kind=code-symbol | source=app/oficial/rondin/page.tsx:L9 | neighbors=[page.tsx]
- "rondin_rondinpageclient_view": "View" | kind=code-symbol | source=components/oficial/rondin/RondinPageClient.tsx:L9 | neighbors=[RondinPageClient.tsx]
- "rondin_rondintabla_estatus_config": "ESTATUS_CONFIG" | kind=code-symbol | source=components/oficial/rondin/RondinTabla.tsx:L6 | neighbors=[RondinTabla.tsx]
- "rondin_rondintabla_estatusbadge": "estatusBadge()" | kind=code-symbol | source=components/oficial/rondin/RondinTabla.tsx:L14 | neighbors=[RondinTabla.tsx]
- "rondin_rondintabla_formatfecha": "formatFecha()" | kind=code-symbol | source=components/oficial/rondin/RondinTabla.tsx:L30 | neighbors=[RondinTabla.tsx]
- "sasiete_mapper_ordenpagorow": "OrdenPagoRow" | kind=code-symbol | source=features/via/saSiete/mapper.ts:L3 | neighbors=[mapper.ts]
- "sasiete_repository_sa7repository_actualizarordenpago": ".actualizarOrdenPago()" | kind=code-symbol | source=features/via/saSiete/repository.ts:L65 | neighbors=[SA7Repository]
- "sasiete_repository_sa7repository_buscarordenporinfraccionid": ".buscarOrdenPorInfraccionId()" | kind=code-symbol | source=features/via/saSiete/repository.ts:L57 | neighbors=[SA7Repository]
- "sasiete_repository_sa7repository_insertarordenpago": ".insertarOrdenPago()" | kind=code-symbol | source=features/via/saSiete/repository.ts:L14 | neighbors=[SA7Repository]
- "sasiete_repository_sa7repository_obtenerconceptoidporclasificacion": ".obtenerConceptoIdPorClasificacion()" | kind=code-symbol | source=features/via/saSiete/repository.ts:L6 | neighbors=[SA7Repository]
- "sasiete_service_sa7service_buscarordenporinfraccion": ".buscarOrdenPorInfraccion()" | kind=code-symbol | source=features/via/saSiete/service.ts:L87 | neighbors=[SA7Service]
- "sasiete_service_sa7service_generarordenpago": ".generarOrdenPago()" | kind=code-symbol | source=features/via/saSiete/service.ts:L13 | neighbors=[SA7Service]
- "sasiete_service_sa7service_obtenerconceptoid": ".obtenerConceptoId()" | kind=code-symbol | source=features/via/saSiete/service.ts:L9 | neighbors=[SA7Service]
- "sasiete_types_catalogoconceptosa7": "CatalogoConceptoSA7" | kind=code-symbol | source=features/via/saSiete/types.ts:L1 | neighbors=[types.ts]
- "scripts_ab_test_a": "a" | kind=code-symbol | source=scripts/ab-test.mjs:L220 | neighbors=[ab-test.mjs]
- "scripts_ab_test_agents_path": "AGENTS_PATH" | kind=code-symbol | source=scripts/ab-test.mjs:L15 | neighbors=[ab-test.mjs]
- "scripts_ab_test_agentssize": "agentsSize" | kind=code-symbol | source=scripts/ab-test.mjs:L218 | neighbors=[ab-test.mjs]
- "scripts_ab_test_b": "b" | kind=code-symbol | source=scripts/ab-test.mjs:L221 | neighbors=[ab-test.mjs]
- "scripts_ab_test_boveda_dir": "BOVEDA_DIR" | kind=code-symbol | source=scripts/ab-test.mjs:L14 | neighbors=[ab-test.mjs]
- "scripts_ab_test_bovedadocs": "bovedaDocs" | kind=code-symbol | source=scripts/ab-test.mjs:L216 | neighbors=[ab-test.mjs]
- "scripts_ab_test_collectbovedadocs": "collectBovedaDocs()" | kind=code-symbol | source=scripts/ab-test.mjs:L56 | neighbors=[ab-test.mjs]
- "scripts_ab_test_collectsourcefiles": "collectSourceFiles()" | kind=code-symbol | source=scripts/ab-test.mjs:L30 | neighbors=[ab-test.mjs]
- "scripts_ab_test_dirname": "__dirname" | kind=code-symbol | source=scripts/ab-test.mjs:L11 | neighbors=[ab-test.mjs]
- "scripts_ab_test_files": "files" | kind=code-symbol | source=scripts/ab-test.mjs:L215 | neighbors=[ab-test.mjs]
- "scripts_ab_test_formatnumber": "formatNumber()" | kind=code-symbol | source=scripts/ab-test.mjs:L25 | neighbors=[ab-test.mjs]
- "scripts_ab_test_getagentssize": "getAgentsSize()" | kind=code-symbol | source=scripts/ab-test.mjs:L82 | neighbors=[ab-test.mjs]
- "scripts_ab_test_getgraphstats": "getGraphStats()" | kind=code-symbol | source=scripts/ab-test.mjs:L74 | neighbors=[ab-test.mjs]
- "scripts_ab_test_graph_path": "GRAPH_PATH" | kind=code-symbol | source=scripts/ab-test.mjs:L13 | neighbors=[ab-test.mjs]
- "scripts_ab_test_graphstats": "graphStats" | kind=code-symbol | source=scripts/ab-test.mjs:L217 | neighbors=[ab-test.mjs]
- "scripts_ab_test_root": "ROOT" | kind=code-symbol | source=scripts/ab-test.mjs:L12 | neighbors=[ab-test.mjs]
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

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/ugomez/Documents/GitHub/seguridad_publica/.graphify/description-instructions/batch-086.json

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
