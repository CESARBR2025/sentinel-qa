# Node Description Batch 77 of 82

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
- "reportes_page_misreportespage": "MisReportesPage()" | kind=code-symbol | source=app/oficial/reportes/page.tsx:L8 | neighbors=[page.tsx]
- "reportes_permisos_accion": "Accion" | kind=code-symbol | source=lib/reportes/permisos.ts:L6 | neighbors=[permisos.ts]
- "reportes_permisos_guardarpermiso": "guardarPermiso()" | kind=code-symbol | source=lib/reportes/permisos.ts:L13 | neighbors=[permisos.ts]
- "reportes_permisos_guardarplantillaseccion": "guardarPlantillaSeccion()" | kind=code-symbol | source=lib/reportes/permisos.ts:L21 | neighbors=[permisos.ts]
- "reportes_permisos_obtenerplantillarol": "obtenerPlantillaRol()" | kind=code-symbol | source=lib/reportes/permisos.ts:L17 | neighbors=[permisos.ts]
- "reportes_permisos_permisoseccion": "PermisoSeccion" | kind=code-symbol | source=lib/reportes/permisos.ts:L7 | neighbors=[permisos.ts]
- "reportes_permisos_roles_permitidos": "ROLES_PERMITIDOS" | kind=code-symbol | source=lib/reportes/permisos.ts:L27 | neighbors=[permisos.ts]
- "reportes_permisos_seccion": "Seccion" | kind=code-symbol | source=lib/reportes/permisos.ts:L5 | neighbors=[permisos.ts]
- "reportes_sin_d1_service_tostr": "toStr()" | kind=code-symbol | source=lib/reportes-sin-d1/service.ts:L4 | neighbors=[service.ts]
- "reportes_sin_novedad_service_tostr": "toStr()" | kind=code-symbol | source=lib/reportes-sin-novedad/service.ts:L4 | neighbors=[service.ts]
- "retencion_placa_route_patch": "PATCH()" | kind=code-symbol | source=app/api/via/infracciones/retencion-placa/route.ts:L6 | neighbors=[route.ts]
- "revision_documental_page_revisiondocumentalpage": "RevisionDocumentalPage()" | kind=code-symbol | source=app/agente_liberaciones/revision-documental/page.tsx:L5 | neighbors=[page.tsx]
- "rh_route_get": "GET()" | kind=code-symbol | source=app/api/rol-servicios/externos/rh/route.ts:L8 | neighbors=[route.ts]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/ugomez/Documents/GitHub/seguridad_publica/.graphify/description-instructions/batch-076.json

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
