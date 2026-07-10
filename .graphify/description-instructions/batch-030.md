# Node Description Batch 31 of 82

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

- "reportes_d1_route_generarfoliodenunciaunico": "generarFolioDenunciaUnico()" | kind=code-symbol | source=app/api/reportes-d1/route.ts:L22 | neighbors=[route.ts, generarFolioDenuncia(), POST()]
- "reportes_form_styles_btnprimario": "btnPrimario()" | kind=code-symbol | source=components/reportes/form-styles.ts:L7 | neighbors=[page.tsx, page.tsx, form-styles.ts]
- "reportes_form_styles_btnsecundario": "btnSecundario" | kind=code-symbol | source=components/reportes/form-styles.ts:L5 | neighbors=[page.tsx, page.tsx, form-styles.ts]
- "reportes_form_styles_inputstyle": "inputStyle" | kind=code-symbol | source=components/reportes/form-styles.ts:L3 | neighbors=[page.tsx, page.tsx, form-styles.ts]
- "reportes_form_styles_label": "Label()" | kind=code-symbol | source=components/reportes/form-styles.ts:L13 | neighbors=[page.tsx, page.tsx, form-styles.ts]
- "reportes_form_styles_sectionbody": "sectionBody" | kind=code-symbol | source=components/reportes/form-styles.ts:L22 | neighbors=[page.tsx, page.tsx, form-styles.ts]
- "reportes_form_styles_sectioncard": "sectionCard" | kind=code-symbol | source=components/reportes/form-styles.ts:L19 | neighbors=[page.tsx, page.tsx, form-styles.ts]
- "reportes_form_styles_sectionheader": "sectionHeader" | kind=code-symbol | source=components/reportes/form-styles.ts:L20 | neighbors=[page.tsx, page.tsx, form-styles.ts]
- "reportes_form_styles_sectiontitlestyle": "sectionTitleStyle" | kind=code-symbol | source=components/reportes/form-styles.ts:L21 | neighbors=[page.tsx, page.tsx, form-styles.ts]
- "reportes_formato_n_armas_aseguradas_service_listararmasaseguradas": "listarArmasAseguradas()" | kind=code-symbol | source=lib/reportes/formato-n-armas-aseguradas-service.ts:L69 | neighbors=[page.tsx, route.ts, formato-n-armas-aseguradas-service.ts]
- "reportes_formato_n_armas_aseguradas_service_obtenerarmaasegurada": "obtenerArmaAsegurada()" | kind=code-symbol | source=lib/reportes/formato-n-armas-aseguradas-service.ts:L74 | neighbors=[route.ts, formato-n-armas-aseguradas-service.ts, rowTo()]
- "reportes_formato_n_armas_aseguradas_service_rowto": "rowTo()" | kind=code-symbol | source=lib/reportes/formato-n-armas-aseguradas-service.ts:L55 | neighbors=[formato-n-armas-aseguradas-service.ts, obtenerArmaAsegurada(), formatFecha()]
- "reportes_formato_n_atencion_victimas_service_listaratencionvictimas": "listarAtencionVictimas()" | kind=code-symbol | source=lib/reportes/formato-n-atencion-victimas-service.ts:L46 | neighbors=[page.tsx, route.ts, formato-n-atencion-victimas-service.ts]
- "reportes_formato_n_atencion_victimas_service_obteneratencionvictimas": "obtenerAtencionVictimas()" | kind=code-symbol | source=lib/reportes/formato-n-atencion-victimas-service.ts:L58 | neighbors=[route.ts, formato-n-atencion-victimas-service.ts, rowTo()]
- "reportes_formato_n_atencion_victimas_service_periodo": "Periodo" | kind=code-symbol | source=lib/reportes/formato-n-atencion-victimas-service.ts:L4 | neighbors=[page.tsx, route.ts, formato-n-atencion-victimas-service.ts]
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

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/ugomez/Documents/GitHub/seguridad_publica/.graphify/description-instructions/batch-030.json

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
