# Node Description Batch 80 of 87

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

- "proxy_public_paths": "PUBLIC_PATHS" | kind=code-symbol | source=proxy.ts:L6 | neighbors=[proxy.ts]
- "proxy_route_get": "GET()" | kind=code-symbol | source=app/api/expediente/proxy/route.ts:L6 | neighbors=[route.ts]
- "radio_formrondinescalado_campo": "Campo()" | kind=code-symbol | source=components/911/radio/FormRondinEscalado.tsx:L145 | neighbors=[FormRondinEscalado.tsx]
- "radio_formrondinescalado_catalogoitem": "CatalogoItem" | kind=code-symbol | source=components/911/radio/FormRondinEscalado.tsx:L9 | neighbors=[FormRondinEscalado.tsx]
- "radio_formrondinescalado_inputstyle": "inputStyle" | kind=code-symbol | source=components/911/radio/FormRondinEscalado.tsx:L156 | neighbors=[FormRondinEscalado.tsx]
- "radio_formrondinescalado_props": "Props" | kind=code-symbol | source=components/911/radio/FormRondinEscalado.tsx:L11 | neighbors=[FormRondinEscalado.tsx]
- "radio_formrondinescalado_seccion": "Seccion()" | kind=code-symbol | source=components/911/radio/FormRondinEscalado.tsx:L132 | neighbors=[FormRondinEscalado.tsx]
- "radio_formsection_reporterecorridozen": "ReporteRecorridoZen()" | kind=code-symbol | source=components/911/radio/FormSection.tsx:L49 | neighbors=[FormSection.tsx]
- "radio_formsection_sentinelfield": "SentinelField()" | kind=code-symbol | source=components/911/radio/FormSection.tsx:L16 | neighbors=[FormSection.tsx]
- "radio_input_inputprops": "InputProps" | kind=code-symbol | source=components/911/radio/Input.tsx:L5 | neighbors=[Input.tsx]
- "radio_input_sentinelinput": "SentinelInput()" | kind=code-symbol | source=components/911/radio/Input.tsx:L11 | neighbors=[Input.tsx]
- "registrar_route_post": "POST()" | kind=code-symbol | source=app/api/via/infracciones/registrar/route.ts:L8 | neighbors=[route.ts]
- "reporte_route_get": "GET()" | kind=code-symbol | source=app/api/incidentes/[id]/reporte/route.ts:L7 | neighbors=[route.ts]
- "reportes_campo_route_get": "GET()" | kind=code-symbol | source=app/api/analisis/reportes-campo/route.ts:L6 | neighbors=[route.ts]
- "reportes_form_styles_btntinydanger": "btnTinyDanger" | kind=code-symbol | source=components/reportes/form-styles.ts:L11 | neighbors=[form-styles.ts]
- "reportes_formato_n_armas_aseguradas_service_armafuente": "ArmaFuente" | kind=code-symbol | source=lib/reportes/formato-n-armas-aseguradas-service.ts:L4 | neighbors=[formato-n-armas-aseguradas-service.ts]
- "reportes_formato_n_armas_aseguradas_service_formatonarmaaseguradainput": "FormatoNArmaAseguradaInput" | kind=code-symbol | source=lib/reportes/formato-n-armas-aseguradas-service.ts:L85 | neighbors=[formato-n-armas-aseguradas-service.ts]
- "reportes_formato_n_armas_aseguradas_service_obtenerarmasparaformaton": "obtenerArmasParaFormatoN()" | kind=code-symbol | source=lib/reportes/formato-n-armas-aseguradas-service.ts:L13 | neighbors=[formato-n-armas-aseguradas-service.ts]
- "reportes_formato_n_atencion_victimas_service_formatonatencionvictimasinput": "FormatoNAtencionVictimasInput" | kind=code-symbol | source=lib/reportes/formato-n-atencion-victimas-service.ts:L73 | neighbors=[formato-n-atencion-victimas-service.ts]
- "reportes_formato_n_consolidado_service_formatonconsolidado": "FormatoNConsolidado" | kind=code-symbol | source=lib/reportes/formato-n-consolidado-service.ts:L9 | neighbors=[formato-n-consolidado-service.ts]
- "reportes_formato_n_eventos_service_formatoneventoinput": "FormatoNEventoInput" | kind=code-symbol | source=lib/reportes/formato-n-eventos-service.ts:L53 | neighbors=[formato-n-eventos-service.ts]
- "reportes_formato_n_eventos_service_fuenteincidente": "FuenteIncidente" | kind=code-symbol | source=lib/reportes/formato-n-eventos-service.ts:L73 | neighbors=[formato-n-eventos-service.ts]
- "reportes_formato_n_fge_service_conteoscalculados": "ConteosCalculados" | kind=code-symbol | source=lib/reportes/formato-n-fge-service.ts:L82 | neighbors=[formato-n-fge-service.ts]
- "reportes_formato_n_fge_service_formatonfgeinput": "FormatoNFgeInput" | kind=code-symbol | source=lib/reportes/formato-n-fge-service.ts:L112 | neighbors=[formato-n-fge-service.ts]
- "reportes_formato_n_fgr_service_formatonfgrinput": "FormatoNFgrInput" | kind=code-symbol | source=lib/reportes/formato-n-fgr-service.ts:L81 | neighbors=[formato-n-fgr-service.ts]
- "reportes_formato_n_medios_alternativos_service_formatonmediosalternativosinput": "FormatoNMediosAlternativosInput" | kind=code-symbol | source=lib/reportes/formato-n-medios-alternativos-service.ts:L69 | neighbors=[formato-n-medios-alternativos-service.ts]
- "reportes_formato_n_rnd_service_formatonrndinput": "FormatoNRndInput" | kind=code-symbol | source=lib/reportes/formato-n-rnd-service.ts:L49 | neighbors=[formato-n-rnd-service.ts]
- "reportes_formato_n_rnd_service_fuentedetencion": "FuenteDetencion" | kind=code-symbol | source=lib/reportes/formato-n-rnd-service.ts:L67 | neighbors=[formato-n-rnd-service.ts]
- "reportes_incidentes_page_reportesincidentespage": "ReportesIncidentesPage()" | kind=code-symbol | source=app/reportes_incidentes/page.tsx:L11 | neighbors=[page.tsx]
- "reportes_incidentes_service_combo_keys": "COMBO_KEYS" | kind=code-symbol | source=lib/reportes-incidentes/service.ts:L10 | neighbors=[service.ts]
- "reportes_incidentes_types_reporteincidenterow": "ReporteIncidenteRow" | kind=code-symbol | source=lib/reportes-incidentes/types.ts:L23 | neighbors=[types.ts]
- "reportes_mapper_tobool": "toBool()" | kind=code-symbol | source=lib/reportes/mapper.ts:L13 | neighbors=[mapper.ts]
- "reportes_mapper_tonum": "toNum()" | kind=code-symbol | source=lib/reportes/mapper.ts:L7 | neighbors=[mapper.ts]
- "reportes_mapper_tostr": "toStr()" | kind=code-symbol | source=lib/reportes/mapper.ts:L1 | neighbors=[mapper.ts]
- "reportes_menuoption_optionsquareprops": "OptionSquareProps" | kind=code-symbol | source=components/reportes/menuOption.tsx:L11 | neighbors=[menuOption.tsx]
- "reportes_menuoption_stat": "Stat" | kind=code-symbol | source=components/reportes/menuOption.tsx:L6 | neighbors=[menuOption.tsx]
- "reportes_operativos_mapper_tonum": "toNum()" | kind=code-symbol | source=lib/reportes-operativos/mapper.ts:L13 | neighbors=[mapper.ts]
- "reportes_operativos_service_parsejsonb": "parseJsonb()" | kind=code-symbol | source=lib/reportes-operativos/service.ts:L13 | neighbors=[service.ts]
- "reportes_operativos_service_tostr": "toStr()" | kind=code-symbol | source=lib/reportes-operativos/service.ts:L22 | neighbors=[service.ts]
- "reportes_page_gestionpage": "GestionPage()" | kind=code-symbol | source=app/reportes/page.tsx:L15 | neighbors=[page.tsx]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/cesarbr/Documents/dev/sjr/seguridad_publica/.graphify/description-instructions/batch-079.json

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
