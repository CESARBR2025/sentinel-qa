# Node Description Batch 49 of 87

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

- "reportes_formato_n_armas_aseguradas_service_formatfecha": "formatFecha()" | kind=code-symbol | source=lib/reportes/formato-n-armas-aseguradas-service.ts:L49 | neighbors=[formato-n-armas-aseguradas-service.ts, rowTo()]
- "reportes_formato_n_armas_aseguradas_service_formatonarmaasegurada": "FormatoNArmaAsegurada" | kind=code-symbol | source=lib/reportes/formato-n-armas-aseguradas-service.ts:L37 | neighbors=[formato-n-armas-aseguradas-service.ts, formato-n-consolidado-service.ts]
- "reportes_formato_n_armas_aseguradas_service_obtenerarmasaseguradasporfecha": "obtenerArmasAseguradasPorFecha()" | kind=code-symbol | source=lib/reportes/formato-n-armas-aseguradas-service.ts:L80 | neighbors=[formato-n-armas-aseguradas-service.ts, formato-n-consolidado-service.ts]
- "reportes_formato_n_atencion_victimas_service_actualizaratencionvictimas": "actualizarAtencionVictimas()" | kind=code-symbol | source=lib/reportes/formato-n-atencion-victimas-service.ts:L93 | neighbors=[route.ts, formato-n-atencion-victimas-service.ts]
- "reportes_formato_n_atencion_victimas_service_crearatencionvictimas": "crearAtencionVictimas()" | kind=code-symbol | source=lib/reportes/formato-n-atencion-victimas-service.ts:L84 | neighbors=[route.ts, formato-n-atencion-victimas-service.ts]
- "reportes_formato_n_atencion_victimas_service_formatfecha": "formatFecha()" | kind=code-symbol | source=lib/reportes/formato-n-atencion-victimas-service.ts:L25 | neighbors=[formato-n-atencion-victimas-service.ts, rowTo()]
- "reportes_formato_n_atencion_victimas_service_formatonatencionvictimas": "FormatoNAtencionVictimas" | kind=code-symbol | source=lib/reportes/formato-n-atencion-victimas-service.ts:L7 | neighbors=[formato-n-atencion-victimas-service.ts, formato-n-consolidado-service.ts]
- "reportes_formato_n_atencion_victimas_service_parseperiodo": "parsePeriodo()" | kind=code-symbol | source=lib/reportes/formato-n-atencion-victimas-service.ts:L20 | neighbors=[formato-n-atencion-victimas-service.ts, rowTo()]
- "reportes_formato_n_atencion_victimas_service_periodos": "PERIODOS" | kind=code-symbol | source=lib/reportes/formato-n-atencion-victimas-service.ts:L3 | neighbors=[page.tsx, formato-n-atencion-victimas-service.ts]
- "reportes_formato_n_consolidado_service_enumerarfechas": "enumerarFechas()" | kind=code-symbol | source=lib/reportes/formato-n-consolidado-service.ts:L46 | neighbors=[formato-n-consolidado-service.ts, obtenerFormatoNConsolidadoRango()]
- "reportes_formato_n_consolidado_service_obtenerformatonconsolidado": "obtenerFormatoNConsolidado()" | kind=code-symbol | source=lib/reportes/formato-n-consolidado-service.ts:L32 | neighbors=[formato-n-consolidado-service.ts, porPeriodos()]
- "reportes_formato_n_consolidado_service_porperiodos": "porPeriodos()" | kind=code-symbol | source=lib/reportes/formato-n-consolidado-service.ts:L20 | neighbors=[formato-n-consolidado-service.ts, obtenerFormatoNConsolidado()]
- "reportes_formato_n_eventos_service_actualizarevento": "actualizarEvento()" | kind=code-symbol | source=lib/reportes/formato-n-eventos-service.ts:L106 | neighbors=[route.ts, formato-n-eventos-service.ts]
- "reportes_formato_n_eventos_service_buscarincidentesporrango": "buscarIncidentesPorRango()" | kind=code-symbol | source=lib/reportes/formato-n-eventos-service.ts:L82 | neighbors=[route.ts, formato-n-eventos-service.ts]
- "reportes_formato_n_eventos_service_crearevento": "crearEvento()" | kind=code-symbol | source=lib/reportes/formato-n-eventos-service.ts:L64 | neighbors=[route.ts, formato-n-eventos-service.ts]
- "reportes_formato_n_eventos_service_formatfecha": "formatFecha()" | kind=code-symbol | source=lib/reportes/formato-n-eventos-service.ts:L16 | neighbors=[formato-n-eventos-service.ts, rowTo()]
- "reportes_formato_n_eventos_service_formatonevento": "FormatoNEvento" | kind=code-symbol | source=lib/reportes/formato-n-eventos-service.ts:L3 | neighbors=[formato-n-consolidado-service.ts, formato-n-eventos-service.ts]
- "reportes_formato_n_eventos_service_obtenereventosporfecha": "obtenerEventosPorFecha()" | kind=code-symbol | source=lib/reportes/formato-n-eventos-service.ts:L48 | neighbors=[formato-n-consolidado-service.ts, formato-n-eventos-service.ts]
- "reportes_formato_n_fge_service_actualizarfge": "actualizarFge()" | kind=code-symbol | source=lib/reportes/formato-n-fge-service.ts:L141 | neighbors=[route.ts, formato-n-fge-service.ts]
- "reportes_formato_n_fge_service_calcularconteosporfecha": "calcularConteosPorFecha()" | kind=code-symbol | source=lib/reportes/formato-n-fge-service.ts:L94 | neighbors=[route.ts, formato-n-fge-service.ts]
- "reportes_formato_n_fge_service_crearfge": "crearFge()" | kind=code-symbol | source=lib/reportes/formato-n-fge-service.ts:L127 | neighbors=[route.ts, formato-n-fge-service.ts]
- "reportes_formato_n_fge_service_formatfecha": "formatFecha()" | kind=code-symbol | source=lib/reportes/formato-n-fge-service.ts:L30 | neighbors=[formato-n-fge-service.ts, rowTo()]
- "reportes_formato_n_fge_service_formatonfge": "FormatoNFge" | kind=code-symbol | source=lib/reportes/formato-n-fge-service.ts:L8 | neighbors=[formato-n-consolidado-service.ts, formato-n-fge-service.ts]
- "reportes_formato_n_fge_service_parseperiodo": "parsePeriodo()" | kind=code-symbol | source=lib/reportes/formato-n-fge-service.ts:L25 | neighbors=[formato-n-fge-service.ts, rowTo()]
- "reportes_formato_n_fgr_service_actualizarfgr": "actualizarFgr()" | kind=code-symbol | source=lib/reportes/formato-n-fgr-service.ts:L110 | neighbors=[route.ts, formato-n-fgr-service.ts]
- "reportes_formato_n_fgr_service_crearfgr": "crearFgr()" | kind=code-symbol | source=lib/reportes/formato-n-fgr-service.ts:L96 | neighbors=[route.ts, formato-n-fgr-service.ts]
- "reportes_formato_n_fgr_service_formatfecha": "formatFecha()" | kind=code-symbol | source=lib/reportes/formato-n-fgr-service.ts:L29 | neighbors=[formato-n-fgr-service.ts, rowTo()]
- "reportes_formato_n_fgr_service_formatonfgr": "FormatoNFgr" | kind=code-symbol | source=lib/reportes/formato-n-fgr-service.ts:L7 | neighbors=[formato-n-consolidado-service.ts, formato-n-fgr-service.ts]
- "reportes_formato_n_fgr_service_parseperiodo": "parsePeriodo()" | kind=code-symbol | source=lib/reportes/formato-n-fgr-service.ts:L24 | neighbors=[formato-n-fgr-service.ts, rowTo()]
- "reportes_formato_n_fgr_service_periodos": "PERIODOS" | kind=code-symbol | source=lib/reportes/formato-n-fgr-service.ts:L3 | neighbors=[page.tsx, formato-n-fgr-service.ts]
- "reportes_formato_n_medios_alternativos_service_actualizarmediosalternativos": "actualizarMediosAlternativos()" | kind=code-symbol | source=lib/reportes/formato-n-medios-alternativos-service.ts:L87 | neighbors=[route.ts, formato-n-medios-alternativos-service.ts]
- "reportes_formato_n_medios_alternativos_service_crearmediosalternativos": "crearMediosAlternativos()" | kind=code-symbol | source=lib/reportes/formato-n-medios-alternativos-service.ts:L78 | neighbors=[route.ts, formato-n-medios-alternativos-service.ts]
- "reportes_formato_n_medios_alternativos_service_formatfecha": "formatFecha()" | kind=code-symbol | source=lib/reportes/formato-n-medios-alternativos-service.ts:L23 | neighbors=[formato-n-medios-alternativos-service.ts, rowTo()]
- "reportes_formato_n_medios_alternativos_service_formatonmediosalternativos": "FormatoNMediosAlternativos" | kind=code-symbol | source=lib/reportes/formato-n-medios-alternativos-service.ts:L7 | neighbors=[formato-n-consolidado-service.ts, formato-n-medios-alternativos-service.ts]
- "reportes_formato_n_medios_alternativos_service_parseperiodo": "parsePeriodo()" | kind=code-symbol | source=lib/reportes/formato-n-medios-alternativos-service.ts:L18 | neighbors=[formato-n-medios-alternativos-service.ts, rowTo()]
- "reportes_formato_n_medios_alternativos_service_periodos": "PERIODOS" | kind=code-symbol | source=lib/reportes/formato-n-medios-alternativos-service.ts:L3 | neighbors=[page.tsx, formato-n-medios-alternativos-service.ts]
- "reportes_formato_n_rnd_service_actualizarrnd": "actualizarRnd()" | kind=code-symbol | source=lib/reportes/formato-n-rnd-service.ts:L98 | neighbors=[route.ts, formato-n-rnd-service.ts]
- "reportes_formato_n_rnd_service_buscardetencionesporrango": "buscarDetencionesPorRango()" | kind=code-symbol | source=lib/reportes/formato-n-rnd-service.ts:L76 | neighbors=[route.ts, formato-n-rnd-service.ts]
- "reportes_formato_n_rnd_service_crearrnd": "crearRnd()" | kind=code-symbol | source=lib/reportes/formato-n-rnd-service.ts:L58 | neighbors=[route.ts, formato-n-rnd-service.ts]
- "reportes_formato_n_rnd_service_formatfecha": "formatFecha()" | kind=code-symbol | source=lib/reportes/formato-n-rnd-service.ts:L14 | neighbors=[formato-n-rnd-service.ts, rowTo()]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/cesarbr/Documents/dev/sjr/seguridad_publica/.graphify/description-instructions/batch-048.json

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
