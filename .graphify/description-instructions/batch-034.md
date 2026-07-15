# Node Description Batch 35 of 93

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

- "reportes_formato_n_medios_alternativos_service_periodo": "Periodo" | kind=code-symbol | source=lib/reportes/formato-n-medios-alternativos-service.ts:L4 | neighbors=[page.tsx, route.ts, formato-n-medios-alternativos-service.ts]
- "reportes_formato_n_rnd_service_listarrnd": "listarRnd()" | kind=code-symbol | source=lib/reportes/formato-n-rnd-service.ts:L33 | neighbors=[page.tsx, route.ts, formato-n-rnd-service.ts]
- "reportes_formato_n_rnd_service_obtenerrnd": "obtenerRnd()" | kind=code-symbol | source=lib/reportes/formato-n-rnd-service.ts:L38 | neighbors=[route.ts, formato-n-rnd-service.ts, rowTo()]
- "reportes_formato_n_rnd_service_rowto": "rowTo()" | kind=code-symbol | source=lib/reportes/formato-n-rnd-service.ts:L20 | neighbors=[formato-n-rnd-service.ts, obtenerRnd(), formatFecha()]
- "reportes_incidentes_mapper_rowtoreportediario": "rowToReporteDiario()" | kind=code-symbol | source=lib/reportes-incidentes/mapper.ts:L11 | neighbors=[mapper.ts, toNum(), repository.ts]
- "reportes_incidentes_mapper_rowtoreportesemanal": "rowToReporteSemanal()" | kind=code-symbol | source=lib/reportes-incidentes/mapper.ts:L20 | neighbors=[mapper.ts, toNum(), repository.ts]
- "reportes_incidentes_mapper_tonum": "toNum()" | kind=code-symbol | source=lib/reportes-incidentes/mapper.ts:L3 | neighbors=[mapper.ts, rowToReporteDiario(), rowToReporteSemanal()]
- "reportes_incidentes_types_reportediariorow": "ReporteDiarioRow" | kind=code-symbol | source=lib/reportes-incidentes/types.ts:L1 | neighbors=[mapper.ts, repository.ts, types.ts]
- "reportes_incidentes_types_reportesemanalrow": "ReporteSemanalRow" | kind=code-symbol | source=lib/reportes-incidentes/types.ts:L8 | neighbors=[mapper.ts, repository.ts, types.ts]
- "reportes_menuoption_optionsquare": "OptionSquare()" | kind=code-symbol | source=components/reportes/menuOption.tsx:L19 | neighbors=[page.tsx, menuOption.tsx, page.tsx]
- "reportes_operativos_mapper_rowtoarma": "rowToArma()" | kind=code-symbol | source=lib/reportes-operativos/mapper.ts:L78 | neighbors=[mapper.ts, toStr(), repository.ts]
- "reportes_operativos_mapper_rowtocateo": "rowToCateo()" | kind=code-symbol | source=lib/reportes-operativos/mapper.ts:L30 | neighbors=[mapper.ts, toStr(), repository.ts]
- "reportes_operativos_mapper_rowtodetencioninc": "rowToDetencionInc()" | kind=code-symbol | source=lib/reportes-operativos/mapper.ts:L50 | neighbors=[mapper.ts, toStr(), repository.ts]
- "reportes_operativos_mapper_rowtodetencionofi": "rowToDetencionOfi()" | kind=code-symbol | source=lib/reportes-operativos/mapper.ts:L40 | neighbors=[mapper.ts, toStr(), repository.ts]
- "reportes_operativos_mapper_rowtodroga": "rowToDroga()" | kind=code-symbol | source=lib/reportes-operativos/mapper.ts:L87 | neighbors=[mapper.ts, toStr(), repository.ts]
- "reportes_operativos_mapper_rowtoextorsion": "rowToExtorsion()" | kind=code-symbol | source=lib/reportes-operativos/mapper.ts:L96 | neighbors=[mapper.ts, toStr(), repository.ts]
- "reportes_operativos_mapper_rowtohidrocarburo": "rowToHidrocarburo()" | kind=code-symbol | source=lib/reportes-operativos/mapper.ts:L69 | neighbors=[mapper.ts, toStr(), repository.ts]
- "reportes_operativos_mapper_rowtoordenaprehension": "rowToOrdenAprehension()" | kind=code-symbol | source=lib/reportes-operativos/mapper.ts:L60 | neighbors=[mapper.ts, toStr(), repository.ts]
- "reportes_operativos_mapper_rowtovehiculo": "rowToVehiculo()" | kind=code-symbol | source=lib/reportes-operativos/mapper.ts:L21 | neighbors=[mapper.ts, toStr(), repository.ts]
- "reportes_operativos_repository_obtenerarmas": "obtenerArmas()" | kind=code-symbol | source=lib/reportes-operativos/repository.ts:L167 | neighbors=[formato-n-armas-aseguradas-service.ts, repository.ts, service.ts]
- "reportes_operativos_repository_obtenercateos": "obtenerCateos()" | kind=code-symbol | source=lib/reportes-operativos/repository.ts:L44 | neighbors=[formato-n-fge-service.ts, repository.ts, service.ts]
- "reportes_operativos_repository_obtenerdetenidos": "obtenerDetenidos()" | kind=code-symbol | source=lib/reportes-operativos/repository.ts:L75 | neighbors=[formato-n-fge-service.ts, repository.ts, service.ts]
- "reportes_operativos_repository_obtenervehiculos": "obtenerVehiculos()" | kind=code-symbol | source=lib/reportes-operativos/repository.ts:L13 | neighbors=[formato-n-fge-service.ts, repository.ts, service.ts]
- "reportes_operativos_service_obtenerdatosexcel": "obtenerDatosExcel()" | kind=code-symbol | source=lib/reportes-operativos/service.ts:L154 | neighbors=[route.ts, service.ts, obtenerDatosOperativos()]
- "reportes_operativos_service_obtenerdatosoperativos": "obtenerDatosOperativos()" | kind=code-symbol | source=lib/reportes-operativos/service.ts:L24 | neighbors=[page.tsx, service.ts, obtenerDatosExcel()]
- "reportes_operativos_service_obtenerdatostelefonicos": "obtenerDatosTelefonicos()" | kind=code-symbol | source=lib/reportes-operativos/service.ts:L280 | neighbors=[page.tsx, route.ts, service.ts]
- "reportes_operativos_types_detencionincrow": "DetencionIncRow" | kind=code-symbol | source=lib/reportes-operativos/types.ts:L24 | neighbors=[mapper.ts, service.ts, types.ts]
- "reportes_operativos_types_detencionofirow": "DetencionOfiRow" | kind=code-symbol | source=lib/reportes-operativos/types.ts:L16 | neighbors=[mapper.ts, service.ts, types.ts]
- "reportes_sin_d1_mapper_rowtosind1": "rowToSinD1()" | kind=code-symbol | source=lib/reportes-sin-d1/mapper.ts:L11 | neighbors=[mapper.ts, toStr(), repository.ts]
- "reportes_sin_d1_service_listarsind1": "listarSinD1()" | kind=code-symbol | source=lib/reportes-sin-d1/service.ts:L6 | neighbors=[page.tsx, route.ts, service.ts]
- "reportes_sin_novedad_mapper_rowtosinnovedad": "rowToSinNovedad()" | kind=code-symbol | source=lib/reportes-sin-novedad/mapper.ts:L11 | neighbors=[mapper.ts, toStr(), repository.ts]
- "reportes_sin_novedad_service_listarreportessinnovedad": "listarReportesSinNovedad()" | kind=code-symbol | source=lib/reportes-sin-novedad/service.ts:L6 | neighbors=[route.ts, service.ts, page.tsx]
- "reportes_welcomebanner_sentinelhero": "SentinelHero()" | kind=code-symbol | source=components/reportes/welcomeBanner.tsx:L1 | neighbors=[page.tsx, page.tsx, welcomeBanner.tsx]
- "rol_servicios_catalogos_actions_createbodycam": "createBodyCam()" | kind=code-symbol | source=lib/rol-servicios/catalogos-actions.ts:L63 | neighbors=[catalogos-actions.ts, req(), requireAdmin()]
- "rol_servicios_catalogos_actions_createconcepto": "createConcepto()" | kind=code-symbol | source=lib/rol-servicios/catalogos-actions.ts:L76 | neighbors=[catalogos-actions.ts, req(), requireAdmin()]
- "rol_servicios_catalogos_actions_createmediocanalizacion": "createMedioCanalizacion()" | kind=code-symbol | source=lib/rol-servicios/catalogos-actions.ts:L115 | neighbors=[catalogos-actions.ts, req(), requireAdmin()]
- "rol_servicios_catalogos_actions_createradio": "createRadio()" | kind=code-symbol | source=lib/rol-servicios/catalogos-actions.ts:L50 | neighbors=[catalogos-actions.ts, req(), requireAdmin()]
- "rol_servicios_catalogos_actions_createsector": "createSector()" | kind=code-symbol | source=lib/rol-servicios/catalogos-actions.ts:L37 | neighbors=[catalogos-actions.ts, req(), requireAdmin()]
- "rol_servicios_catalogos_actions_createtipoemergencia": "createTipoEmergencia()" | kind=code-symbol | source=lib/rol-servicios/catalogos-actions.ts:L102 | neighbors=[catalogos-actions.ts, req(), requireAdmin()]
- "rol_servicios_catalogos_actions_createtipoobservacion": "createTipoObservacion()" | kind=code-symbol | source=lib/rol-servicios/catalogos-actions.ts:L89 | neighbors=[catalogos-actions.ts, req(), requireAdmin()]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/ugomez/Documents/GitHub/seguridad_publica/.graphify/description-instructions/batch-034.json

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
