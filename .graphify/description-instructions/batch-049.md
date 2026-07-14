# Node Description Batch 50 of 87

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
- "reportes_permisos_secciones": "SECCIONES" | kind=code-symbol | source=lib/reportes/permisos.ts:L4 | neighbors=[registro.ts, permisos.ts]
- "reportes_repository_getenvioformatoscount": "getEnvioFormatosCount()" | kind=code-symbol | source=lib/reportes/repository.ts:L30 | neighbors=[page.tsx, repository.ts]
- "reportes_repository_getformatonstats": "getFormatoNStats()" | kind=code-symbol | source=lib/reportes/repository.ts:L4 | neighbors=[page.tsx, repository.ts]
- "reportes_repository_getincidentescount": "getIncidentesCount()" | kind=code-symbol | source=lib/reportes/repository.ts:L25 | neighbors=[page.tsx, repository.ts]
- "reportes_sin_d1_mapper_tostr": "toStr()" | kind=code-symbol | source=lib/reportes-sin-d1/mapper.ts:L3 | neighbors=[mapper.ts, rowToSinD1()]
- "reportes_sin_d1_repository_obtenersind1": "obtenerSinD1()" | kind=code-symbol | source=lib/reportes-sin-d1/repository.ts:L5 | neighbors=[repository.ts, service.ts]
- "reportes_sin_novedad_mapper_tostr": "toStr()" | kind=code-symbol | source=lib/reportes-sin-novedad/mapper.ts:L3 | neighbors=[mapper.ts, rowToSinNovedad()]
- "reportes_sin_novedad_repository_obtenerreportessinnovedad": "obtenerReportesSinNovedad()" | kind=code-symbol | source=lib/reportes-sin-novedad/repository.ts:L5 | neighbors=[repository.ts, service.ts]
- "reportes_types_formatonstats": "FormatoNStats" | kind=code-symbol | source=lib/reportes/types.ts:L1 | neighbors=[repository.ts, types.ts]
- "rol_servicios_actions_createasignacion": "createAsignacion()" | kind=code-symbol | source=lib/rol-servicios/actions.ts:L89 | neighbors=[actions.ts, requireSession()]
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

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/cesarbr/Documents/dev/sjr/seguridad_publica/.graphify/description-instructions/batch-049.json

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
