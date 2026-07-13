# Node Description Batch 74 of 86

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

- "manual_migrations_0006_formato_n_formato_n_reportes": "formato_n_reportes" | kind=code-symbol | source=lib/db/manual-migrations/0006_formato_n.sql:L1 | neighbors=[0006_formato_n.sql]
- "manual_migrations_0007_formato_n_split_formato_n_armas_aseguradas": "formato_n_armas_aseguradas" | kind=code-symbol | source=lib/db/manual-migrations/0007_formato_n_split.sql:L113 | neighbors=[0007_formato_n_split.sql]
- "manual_migrations_0007_formato_n_split_formato_n_atencion_victimas": "formato_n_atencion_victimas" | kind=code-symbol | source=lib/db/manual-migrations/0007_formato_n_split.sql:L98 | neighbors=[0007_formato_n_split.sql]
- "manual_migrations_0007_formato_n_split_formato_n_eventos": "formato_n_eventos" | kind=code-symbol | source=lib/db/manual-migrations/0007_formato_n_split.sql:L23 | neighbors=[0007_formato_n_split.sql]
- "manual_migrations_0007_formato_n_split_formato_n_fge": "formato_n_fge" | kind=code-symbol | source=lib/db/manual-migrations/0007_formato_n_split.sql:L36 | neighbors=[0007_formato_n_split.sql]
- "manual_migrations_0007_formato_n_split_formato_n_fgr": "formato_n_fgr" | kind=code-symbol | source=lib/db/manual-migrations/0007_formato_n_split.sql:L55 | neighbors=[0007_formato_n_split.sql]
- "manual_migrations_0007_formato_n_split_formato_n_medios_alternativos": "formato_n_medios_alternativos" | kind=code-symbol | source=lib/db/manual-migrations/0007_formato_n_split.sql:L85 | neighbors=[0007_formato_n_split.sql]
- "manual_migrations_0007_formato_n_split_formato_n_rnd": "formato_n_rnd" | kind=code-symbol | source=lib/db/manual-migrations/0007_formato_n_split.sql:L74 | neighbors=[0007_formato_n_split.sql]
- "maps_googlemappicker_center": "center" | kind=code-symbol | source=components/maps/GoogleMapPicker.tsx:L8 | neighbors=[GoogleMapPicker.tsx]
- "maps_googlemappicker_containerstyle": "containerStyle" | kind=code-symbol | source=components/maps/GoogleMapPicker.tsx:L7 | neighbors=[GoogleMapPicker.tsx]
- "maps_googlemappicker_googlemappicker": "GoogleMapPicker()" | kind=code-symbol | source=components/maps/GoogleMapPicker.tsx:L18 | neighbors=[GoogleMapPicker.tsx]
- "maps_googlemappicker_props": "Props" | kind=code-symbol | source=components/maps/GoogleMapPicker.tsx:L10 | neighbors=[GoogleMapPicker.tsx]
- "medidas_page_color_map": "COLOR_MAP" | kind=code-symbol | source=app/prevencion/medidas/page.tsx:L13 | neighbors=[page.tsx]
- "medidas_page_medidaspage": "MedidasPage()" | kind=code-symbol | source=app/prevencion/medidas/page.tsx:L20 | neighbors=[page.tsx]
- "medidas_route_get": "GET()" | kind=code-symbol | source=app/api/prevencion/medidas/route.ts:L8 | neighbors=[route.ts]
- "medidas_route_post": "POST()" | kind=code-symbol | source=app/api/prevencion/medidas/route.ts:L22 | neighbors=[route.ts]
- "modulo_incidentes_page_reportesoperativospage": "ReportesOperativosPage()" | kind=code-symbol | source=app/modulo_incidentes/page.tsx:L13 | neighbors=[page.tsx]
- "modulo_incidentes_reporttables_operationaltableprops": "OperationalTableProps" | kind=code-symbol | source=components/reportes/modulo_incidentes/ReportTables.tsx:L6 | neighbors=[ReportTables.tsx]
- "monitorista_accionesdetenido_accionesdetenido": "AccionesDetenido()" | kind=code-symbol | source=components/monitorista/AccionesDetenido.tsx:L9 | neighbors=[AccionesDetenido.tsx]
- "monitorista_actions_solicitarevidencia": "solicitarEvidencia()" | kind=code-symbol | source=lib/monitorista/actions.ts:L19 | neighbors=[actions.ts]
- "monitorista_bandejasolicitudes_btndetalle": "btnDetalle" | kind=code-symbol | source=components/monitorista/BandejaSolicitudes.tsx:L154 | neighbors=[BandejaSolicitudes.tsx]
- "monitorista_bandejasolicitudes_btnprimary": "btnPrimary" | kind=code-symbol | source=components/monitorista/BandejaSolicitudes.tsx:L142 | neighbors=[BandejaSolicitudes.tsx]
- "monitorista_bandejasolicitudes_btnsuccess": "btnSuccess" | kind=code-symbol | source=components/monitorista/BandejaSolicitudes.tsx:L148 | neighbors=[BandejaSolicitudes.tsx]
- "monitorista_bandejasolicitudes_origenbadge": "origenBadge" | kind=code-symbol | source=components/monitorista/BandejaSolicitudes.tsx:L160 | neighbors=[BandejaSolicitudes.tsx]
- "monitorista_bandejasolicitudes_solicitudrow": "SolicitudRow" | kind=code-symbol | source=components/monitorista/BandejaSolicitudes.tsx:L11 | neighbors=[BandejaSolicitudes.tsx]
- "monitorista_bandejasolicitudes_statusbadge": "statusBadge()" | kind=code-symbol | source=components/monitorista/BandejaSolicitudes.tsx:L166 | neighbors=[BandejaSolicitudes.tsx]
- "monitorista_botongenerarppt_inputstyle": "inputStyle" | kind=code-symbol | source=components/monitorista/BotonGenerarPpt.tsx:L135 | neighbors=[BotonGenerarPpt.tsx]
- "monitorista_botongenerarppt_label": "Label()" | kind=code-symbol | source=components/monitorista/BotonGenerarPpt.tsx:L131 | neighbors=[BotonGenerarPpt.tsx]
- "monitorista_buscadorevento_opciones": "OPCIONES" | kind=code-symbol | source=components/monitorista/BuscadorEvento.tsx:L6 | neighbors=[BuscadorEvento.tsx]
- "monitorista_cardenviofoto_etiquetas": "ETIQUETAS" | kind=code-symbol | source=components/monitorista/CardEnvioFoto.tsx:L10 | neighbors=[CardEnvioFoto.tsx]
- "monitorista_filaincidentecamara_td": "Td()" | kind=code-symbol | source=components/monitorista/FilaIncidenteCamara.tsx:L61 | neighbors=[FilaIncidenteCamara.tsx]
- "monitorista_galeriaevidencias_cardstyle": "cardStyle" | kind=code-symbol | source=components/monitorista/GaleriaEvidencias.tsx:L98 | neighbors=[GaleriaEvidencias.tsx]
- "monitorista_galeriaevidencias_evidenciarow": "EvidenciaRow" | kind=code-symbol | source=components/monitorista/GaleriaEvidencias.tsx:L6 | neighbors=[GaleriaEvidencias.tsx]
- "monitorista_galeriaevidencias_itemstyle": "itemStyle" | kind=code-symbol | source=components/monitorista/GaleriaEvidencias.tsx:L107 | neighbors=[GaleriaEvidencias.tsx]
- "monitorista_galeriaevidencias_sectiontitle": "sectionTitle" | kind=code-symbol | source=components/monitorista/GaleriaEvidencias.tsx:L102 | neighbors=[GaleriaEvidencias.tsx]
- "monitorista_layout_monitoristalayout": "MonitoristaLayout()" | kind=code-symbol | source=app/monitorista/layout.tsx:L6 | neighbors=[layout.tsx]
- "monitorista_mapper_bool": "bool()" | kind=code-symbol | source=lib/monitorista/mapper.ts:L19 | neighbors=[mapper.ts]
- "monitorista_mapper_str": "str()" | kind=code-symbol | source=lib/monitorista/mapper.ts:L8 | neighbors=[mapper.ts]
- "monitorista_page_cardstyle": "cardStyle" | kind=code-symbol | source=app/monitorista/page.tsx:L110 | neighbors=[page.tsx]
- "monitorista_page_monitoristahubpage": "MonitoristaHubPage()" | kind=code-symbol | source=app/monitorista/page.tsx:L12 | neighbors=[page.tsx]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/cesarbr/Documents/dev/sjr/seguridad_publica/.graphify/description-instructions/batch-073.json

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
