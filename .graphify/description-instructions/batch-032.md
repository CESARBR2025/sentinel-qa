# Node Description Batch 33 of 89

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

- "reportes_formato_n_consolidado_service_obtenerformatonconsolidadorango": "obtenerFormatoNConsolidadoRango()" | kind=code-symbol | source=lib/reportes/formato-n-consolidado-service.ts:L57 | neighbors=[route.ts, formato-n-consolidado-service.ts, enumerarFechas()]
- "reportes_formato_n_eventos_service_listareventos": "listarEventos()" | kind=code-symbol | source=lib/reportes/formato-n-eventos-service.ts:L37 | neighbors=[page.tsx, route.ts, formato-n-eventos-service.ts]
- "reportes_formato_n_eventos_service_obtenerevento": "obtenerEvento()" | kind=code-symbol | source=lib/reportes/formato-n-eventos-service.ts:L42 | neighbors=[route.ts, formato-n-eventos-service.ts, rowTo()]
- "reportes_formato_n_eventos_service_rowto": "rowTo()" | kind=code-symbol | source=lib/reportes/formato-n-eventos-service.ts:L22 | neighbors=[formato-n-eventos-service.ts, obtenerEvento(), formatFecha()]
- "reportes_formato_n_fge_service_listarfge": "listarFge()" | kind=code-symbol | source=lib/reportes/formato-n-fge-service.ts:L55 | neighbors=[page.tsx, route.ts, formato-n-fge-service.ts]
- "reportes_formato_n_fge_service_obtenerfge": "obtenerFge()" | kind=code-symbol | source=lib/reportes/formato-n-fge-service.ts:L67 | neighbors=[route.ts, formato-n-fge-service.ts, rowTo()]
- "reportes_formato_n_fge_service_periodo": "Periodo" | kind=code-symbol | source=lib/reportes/formato-n-fge-service.ts:L5 | neighbors=[page.tsx, route.ts, formato-n-fge-service.ts]
- "reportes_formato_n_fge_service_periodos": "PERIODOS" | kind=code-symbol | source=lib/reportes/formato-n-fge-service.ts:L4 | neighbors=[page.tsx, formato-n-consolidado-service.ts, formato-n-fge-service.ts]
- "reportes_formato_n_fgr_service_listarfgr": "listarFgr()" | kind=code-symbol | source=lib/reportes/formato-n-fgr-service.ts:L54 | neighbors=[page.tsx, route.ts, formato-n-fgr-service.ts]
- "reportes_formato_n_fgr_service_obtenerfgr": "obtenerFgr()" | kind=code-symbol | source=lib/reportes/formato-n-fgr-service.ts:L66 | neighbors=[route.ts, formato-n-fgr-service.ts, rowTo()]
- "reportes_formato_n_fgr_service_periodo": "Periodo" | kind=code-symbol | source=lib/reportes/formato-n-fgr-service.ts:L4 | neighbors=[page.tsx, route.ts, formato-n-fgr-service.ts]
- "reportes_formato_n_medios_alternativos_service_listarmediosalternativos": "listarMediosAlternativos()" | kind=code-symbol | source=lib/reportes/formato-n-medios-alternativos-service.ts:L42 | neighbors=[page.tsx, route.ts, formato-n-medios-alternativos-service.ts]
- "reportes_formato_n_medios_alternativos_service_obtenermediosalternativos": "obtenerMediosAlternativos()" | kind=code-symbol | source=lib/reportes/formato-n-medios-alternativos-service.ts:L54 | neighbors=[route.ts, formato-n-medios-alternativos-service.ts, rowTo()]
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

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/ugomez/Documents/GitHub/seguridad_publica/.graphify/description-instructions/batch-032.json

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
