# Node Description Batch 54 of 93

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

- "rol_servicios_actions_createobservacion": "createObservacion()" | kind=code-symbol | source=lib/rol-servicios/actions.ts:L155 | neighbors=[actions.ts, requireSession()]
- "rol_servicios_actions_createrol": "createRol()" | kind=code-symbol | source=lib/rol-servicios/actions.ts:L33 | neighbors=[actions.ts, requireSession()]
- "rol_servicios_actions_deleteasignacion": "deleteAsignacion()" | kind=code-symbol | source=lib/rol-servicios/actions.ts:L121 | neighbors=[actions.ts, requireSession()]
- "rol_servicios_actions_deleteobservacion": "deleteObservacion()" | kind=code-symbol | source=lib/rol-servicios/actions.ts:L175 | neighbors=[actions.ts, requireSession()]
- "rol_servicios_actions_guardarfirmas": "guardarFirmas()" | kind=code-symbol | source=lib/rol-servicios/actions.ts:L188 | neighbors=[actions.ts, requireSession()]
- "rol_servicios_actions_updateencabezadorol": "updateEncabezadoRol()" | kind=code-symbol | source=lib/rol-servicios/actions.ts:L61 | neighbors=[actions.ts, requireSession()]
- "rol_servicios_actions_upsertestadofuerza": "upsertEstadoFuerza()" | kind=code-symbol | source=lib/rol-servicios/actions.ts:L134 | neighbors=[actions.ts, requireSession()]
- "rol_servicios_catalogos_actions_togglebodycam": "toggleBodyCam()" | kind=code-symbol | source=lib/rol-servicios/catalogos-actions.ts:L72 | neighbors=[catalogos-actions.ts, toggleCatalogo()]
- "rol_servicios_catalogos_actions_toggleconcepto": "toggleConcepto()" | kind=code-symbol | source=lib/rol-servicios/catalogos-actions.ts:L85 | neighbors=[catalogos-actions.ts, toggleCatalogo()]
- "rol_servicios_catalogos_actions_togglemediocanalizacion": "toggleMedioCanalizacion()" | kind=code-symbol | source=lib/rol-servicios/catalogos-actions.ts:L124 | neighbors=[catalogos-actions.ts, toggleCatalogo()]
- "rol_servicios_catalogos_actions_toggleradio": "toggleRadio()" | kind=code-symbol | source=lib/rol-servicios/catalogos-actions.ts:L59 | neighbors=[catalogos-actions.ts, toggleCatalogo()]
- "rol_servicios_catalogos_actions_togglesector": "toggleSector()" | kind=code-symbol | source=lib/rol-servicios/catalogos-actions.ts:L46 | neighbors=[catalogos-actions.ts, toggleCatalogo()]
- "rol_servicios_catalogos_actions_toggletipoemergencia": "toggleTipoEmergencia()" | kind=code-symbol | source=lib/rol-servicios/catalogos-actions.ts:L111 | neighbors=[catalogos-actions.ts, toggleCatalogo()]
- "rol_servicios_catalogos_actions_toggletipoobservacion": "toggleTipoObservacion()" | kind=code-symbol | source=lib/rol-servicios/catalogos-actions.ts:L98 | neighbors=[catalogos-actions.ts, toggleCatalogo()]
- "rol_servicios_mapper_rowtorolestadofuerza": "rowToRolEstadoFuerza()" | kind=code-symbol | source=lib/rol-servicios/mapper.ts:L77 | neighbors=[mapper.ts, repository.ts]
- "rol_servicios_repository_getasignacionesbyrolid": "getAsignacionesByRolId()" | kind=code-symbol | source=lib/rol-servicios/repository.ts:L21 | neighbors=[repository.ts, service.ts]
- "rol_servicios_repository_getbodycams": "getBodyCams()" | kind=code-symbol | source=lib/rol-servicios/repository.ts:L55 | neighbors=[repository.ts, service.ts]
- "rol_servicios_repository_getestadofuerzabyrolid": "getEstadoFuerzaByRolId()" | kind=code-symbol | source=lib/rol-servicios/repository.ts:L29 | neighbors=[repository.ts, service.ts]
- "rol_servicios_repository_getestadofuerzaconceptos": "getEstadoFuerzaConceptos()" | kind=code-symbol | source=lib/rol-servicios/repository.ts:L60 | neighbors=[repository.ts, service.ts]
- "rol_servicios_repository_getmedioscanalizacion": "getMediosCanalizacion()" | kind=code-symbol | source=lib/rol-servicios/repository.ts:L81 | neighbors=[repository.ts, service.ts]
- "rol_servicios_repository_getobservacionesbyrolid": "getObservacionesByRolId()" | kind=code-symbol | source=lib/rol-servicios/repository.ts:L37 | neighbors=[repository.ts, service.ts]
- "rol_servicios_repository_getradios": "getRadios()" | kind=code-symbol | source=lib/rol-servicios/repository.ts:L50 | neighbors=[repository.ts, service.ts]
- "rol_servicios_repository_getsectores": "getSectores()" | kind=code-symbol | source=lib/rol-servicios/repository.ts:L45 | neighbors=[repository.ts, service.ts]
- "rol_servicios_repository_gettiposemergencia": "getTiposEmergencia()" | kind=code-symbol | source=lib/rol-servicios/repository.ts:L74 | neighbors=[repository.ts, service.ts]
- "rol_servicios_repository_gettiposobservacion": "getTiposObservacion()" | kind=code-symbol | source=lib/rol-servicios/repository.ts:L67 | neighbors=[repository.ts, service.ts]
- "rol_servicios_servicefooter_servicefooter": "ServiceFooter()" | kind=code-symbol | source=components/rol_servicios/ServiceFooter.tsx:L6 | neighbors=[page.tsx, ServiceFooter.tsx]
- "rol_servicios_servicetable_servicetable": "ServiceTable()" | kind=code-symbol | source=components/rol_servicios/ServiceTable.tsx:L12 | neighbors=[page.tsx, ServiceTable.tsx]
- "rol_servicios_signaturemodal_signaturemodal": "SignatureModal()" | kind=code-symbol | source=components/rol_servicios/SignatureModal.tsx:L13 | neighbors=[ServiceFooter.tsx, SignatureModal.tsx]
- "rol_servicios_types_turno": "Turno" | kind=code-symbol | source=lib/rol-servicios/types.ts:L1 | neighbors=[service.ts, types.ts]
- "rondin_rondinpageclient_rondinpageclient": "RondinPageClient()" | kind=code-symbol | source=components/oficial/rondin/RondinPageClient.tsx:L11 | neighbors=[page.tsx, RondinPageClient.tsx]
- "rondin_rondintabla_rondintabla": "RondinTabla()" | kind=code-symbol | source=components/oficial/rondin/RondinTabla.tsx:L40 | neighbors=[RondinPageClient.tsx, RondinTabla.tsx]
- "sasiete_client_generarordenpago": "generarOrdenPago()" | kind=code-symbol | source=features/via/saSiete/client.ts:L1 | neighbors=[FormularioInfraccion.tsx, client.ts]
- "sasiete_types_generarordenpagodto": "GenerarOrdenPagoDTO" | kind=code-symbol | source=features/via/saSiete/types.ts:L29 | neighbors=[service.ts, types.ts]
- "sasiete_types_resultadosa7": "ResultadoSA7" | kind=code-symbol | source=features/via/saSiete/types.ts:L40 | neighbors=[service.ts, types.ts]
- "scripts_ab_test_simulatewithoutyoumindag": "simulateWithoutYoumindag()" | kind=code-symbol | source=scripts/ab-test.mjs:L89 | neighbors=[ab-test.mjs, charsToTokens()]
- "scripts_ab_test_simulatewithyoumindag": "simulateWithYoumindag()" | kind=code-symbol | source=scripts/ab-test.mjs:L157 | neighbors=[ab-test.mjs, charsToTokens()]
- "scripts_benchmark_charstotokens": "charsToTokens()" | kind=code-symbol | source=scripts/benchmark.mjs:L114 | neighbors=[benchmark.mjs, estimateYoumindagContext()]
- "scripts_benchmark_estimateyoumindagcontext": "estimateYoumindagContext()" | kind=code-symbol | source=scripts/benchmark.mjs:L147 | neighbors=[benchmark.mjs, charsToTokens()]
- "scripts_export_schema_getcolumns": "getColumns()" | kind=code-symbol | source=scripts/export-schema.mjs:L39 | neighbors=[export-schema.mjs, main()]
- "scripts_export_schema_getenums": "getEnums()" | kind=code-symbol | source=scripts/export-schema.mjs:L51 | neighbors=[export-schema.mjs, main()]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/ugomez/Documents/GitHub/seguridad_publica/.graphify/description-instructions/batch-053.json

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
