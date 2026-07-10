# Node Description Batch 47 of 79

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
- "reportes_formato_n_rnd_service_formatonrnd": "FormatoNRnd" | kind=code-symbol | source=lib/reportes/formato-n-rnd-service.ts:L3 | neighbors=[formato-n-consolidado-service.ts, formato-n-rnd-service.ts]
- "reportes_formato_n_rnd_service_obtenerrndporfecha": "obtenerRndPorFecha()" | kind=code-symbol | source=lib/reportes/formato-n-rnd-service.ts:L44 | neighbors=[formato-n-consolidado-service.ts, formato-n-rnd-service.ts]
- "reportes_incidentes_repository_obtenerreportediario": "obtenerReporteDiario()" | kind=code-symbol | source=lib/reportes-incidentes/repository.ts:L5 | neighbors=[repository.ts, service.ts]
- "reportes_incidentes_repository_obtenerreportesemanal": "obtenerReporteSemanal()" | kind=code-symbol | source=lib/reportes-incidentes/repository.ts:L34 | neighbors=[repository.ts, service.ts]
- "reportes_incidentes_service_tonum": "toNum()" | kind=code-symbol | source=lib/reportes-incidentes/service.ts:L4 | neighbors=[service.ts, combinar()]
- "reportes_incidentes_service_tostr": "toStr()" | kind=code-symbol | source=lib/reportes-incidentes/service.ts:L5 | neighbors=[service.ts, combinar()]
- "reportes_incidentes_types_reporteincidentecombinado": "ReporteIncidenteCombinado" | kind=code-symbol | source=lib/reportes-incidentes/types.ts:L25 | neighbors=[service.ts, types.ts]
- "reportes_operativos_mapper_rowtoreportecampogeneral": "rowToReporteCampoGeneral()" | kind=code-symbol | source=lib/reportes-operativos/mapper.ts:L105 | neighbors=[mapper.ts, toStr()]
- "reportes_operativos_mapper_rowtoreportecampoincidentegeneral": "rowToReporteCampoIncidenteGeneral()" | kind=code-symbol | source=lib/reportes-operativos/mapper.ts:L130 | neighbors=[mapper.ts, toStr()]
- "reportes_operativos_repository_obtenerdrogas": "obtenerDrogas()" | kind=code-symbol | source=lib/reportes-operativos/repository.ts:L196 | neighbors=[repository.ts, service.ts]
- "reportes_operativos_repository_obtenerextorsiones": "obtenerExtorsiones()" | kind=code-symbol | source=lib/reportes-operativos/repository.ts:L225 | neighbors=[repository.ts, service.ts]
- "reportes_operativos_repository_obtenerhidrocarburos": "obtenerHidrocarburos()" | kind=code-symbol | source=lib/reportes-operativos/repository.ts:L138 | neighbors=[repository.ts, service.ts]
- "reportes_operativos_repository_obtenerordenesaprehension": "obtenerOrdenesAprehension()" | kind=code-symbol | source=lib/reportes-operativos/repository.ts:L109 | neighbors=[repository.ts, service.ts]
- "reportes_operativos_types_detencionresult": "DetencionResult" | kind=code-symbol | source=lib/reportes-operativos/types.ts:L32 | neighbors=[repository.ts, types.ts]
- "reportes_operativos_types_reportecampogeneralrow": "ReporteCampoGeneralRow" | kind=code-symbol | source=lib/reportes-operativos/types.ts:L72 | neighbors=[mapper.ts, types.ts]
- "reportes_operativos_types_reportecampoincidentegeneralrow": "ReporteCampoIncidenteGeneralRow" | kind=code-symbol | source=lib/reportes-operativos/types.ts:L95 | neighbors=[mapper.ts, types.ts]
- "reportes_permisos_secciones": "SECCIONES" | kind=code-symbol | source=lib/reportes/permisos.ts:L5 | neighbors=[registro.ts, permisos.ts]
- "reportes_repository_getenvioformatoscount": "getEnvioFormatosCount()" | kind=code-symbol | source=lib/reportes/repository.ts:L30 | neighbors=[page.tsx, repository.ts]
- "reportes_repository_getformatonstats": "getFormatoNStats()" | kind=code-symbol | source=lib/reportes/repository.ts:L4 | neighbors=[page.tsx, repository.ts]
- "reportes_repository_getincidentescount": "getIncidentesCount()" | kind=code-symbol | source=lib/reportes/repository.ts:L25 | neighbors=[page.tsx, repository.ts]
- "reportes_sin_d1_mapper_tostr": "toStr()" | kind=code-symbol | source=lib/reportes-sin-d1/mapper.ts:L3 | neighbors=[mapper.ts, rowToSinD1()]
- "reportes_sin_d1_repository_obtenersind1": "obtenerSinD1()" | kind=code-symbol | source=lib/reportes-sin-d1/repository.ts:L5 | neighbors=[repository.ts, service.ts]
- "reportes_sin_novedad_mapper_tostr": "toStr()" | kind=code-symbol | source=lib/reportes-sin-novedad/mapper.ts:L3 | neighbors=[mapper.ts, rowToSinNovedad()]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/cesarbr/Documents/dev/sjr/seguridad_publica/.graphify/description-instructions/batch-046.json

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
