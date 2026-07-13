# Node Description Batch 69 of 84

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

- "id_page_label": "Label()" | kind=code-symbol | source=app/monitorista/incidentes-camara/[id]/page.tsx:L153 | neighbors=[page.tsx]
- "id_page_labelstyle": "labelStyle" | kind=code-symbol | source=app/agente_911/whatsapp/incidentes/[id]/page.tsx:L150 | neighbors=[page.tsx]
- "id_page_labelsx": "labelSx" | kind=code-symbol | source=app/fiscalia/asegurados/[id]/page.tsx:L12 | neighbors=[page.tsx]
- "id_page_labeltopstyle": "labelTopStyle" | kind=code-symbol | source=app/agente_911/whatsapp/incidentes/[id]/page.tsx:L158 | neighbors=[page.tsx]
- "id_page_lbl": "LBL" | kind=code-symbol | source=app/oficial/reportes/[id]/page.tsx:L9 | neighbors=[page.tsx]
- "id_page_marcastyle": "marcaStyle" | kind=code-symbol | source=app/monitorista/detenidos/[id]/page.tsx:L129 | neighbors=[page.tsx]
- "id_page_medidadetailpage": "MedidaDetailPage()" | kind=code-symbol | source=app/prevencion/medidas/[id]/page.tsx:L15 | neighbors=[page.tsx]
- "id_page_montorow": "MontoRow()" | kind=code-symbol | source=app/infracciones/[id]/page.tsx:L409 | neighbors=[page.tsx]
- "id_page_narrativaboxstyle": "narrativaBoxStyle" | kind=code-symbol | source=app/agente_911/whatsapp/incidentes/[id]/page.tsx:L154 | neighbors=[page.tsx]
- "id_page_periodos": "PERIODOS" | kind=code-symbol | source=app/formato-n-medios-alternativos/[id]/page.tsx:L11 | neighbors=[page.tsx]
- "id_page_props": "Props" | kind=code-symbol | source=app/fiscalia/asegurados/puesta-disposicion/[id]/page.tsx:L6 | neighbors=[page.tsx]
- "id_page_puestadisposicionpage": "PuestaDisposicionPage()" | kind=code-symbol | source=app/fiscalia/asegurados/puesta-disposicion/[id]/page.tsx:L10 | neighbors=[page.tsx]
- "id_page_refboxstyle": "refBoxStyle" | kind=code-symbol | source=app/agente_911/whatsapp/incidentes/[id]/page.tsx:L155 | neighbors=[page.tsx]
- "id_page_reportedetallepage": "ReporteDetallePage()" | kind=code-symbol | source=app/oficial/reportes/[id]/page.tsx:L15 | neighbors=[page.tsx]
- "id_page_sec": "SEC" | kind=code-symbol | source=app/oficial/reportes/[id]/page.tsx:L12 | neighbors=[page.tsx]
- "id_page_section": "Section()" | kind=code-symbol | source=app/infracciones/[id]/page.tsx:L379 | neighbors=[page.tsx]
- "id_page_sectiontitle": "sectionTitle" | kind=code-symbol | source=app/monitorista/solicitudes/[id]/page.tsx:L101 | neighbors=[page.tsx]
- "id_page_sectiontitlestyle": "sectionTitleStyle" | kind=code-symbol | source=app/agente_911/whatsapp/incidentes/[id]/page.tsx:L148 | neighbors=[page.tsx]
- "id_page_sel": "SEL" | kind=code-symbol | source=app/auxiliar/checklist/[id]/page.tsx:L12 | neighbors=[page.tsx]
- "id_page_selectstyle": "selectStyle" | kind=code-symbol | source=app/admin-transito/oficiales/[id]/page.tsx:L30 | neighbors=[page.tsx]
- "id_page_tipo_cfg": "TIPO_CFG" | kind=code-symbol | source=app/prevencion/busquedas/[id]/page.tsx:L11 | neighbors=[page.tsx]
- "id_page_titlestyle": "titleStyle" | kind=code-symbol | source=app/agente_911/whatsapp/incidentes/[id]/page.tsx:L159 | neighbors=[page.tsx]
- "id_page_turnos": "TURNOS" | kind=code-symbol | source=app/monitorista/incidentes-camara/[id]/page.tsx:L10 | neighbors=[page.tsx]
- "id_page_val": "VAL" | kind=code-symbol | source=app/oficial/reportes/[id]/page.tsx:L10 | neighbors=[page.tsx]
- "id_page_valuestyle": "valueStyle" | kind=code-symbol | source=app/agente_911/whatsapp/incidentes/[id]/page.tsx:L151 | neighbors=[page.tsx]
- "id_route_get": "GET()" | kind=code-symbol | source=app/api/via/infracciones/registradas/[id]/route.ts:L4 | neighbors=[route.ts]
- "id_route_patch": "PATCH()" | kind=code-symbol | source=app/api/reportes/formato-n-rnd/[id]/route.ts:L21 | neighbors=[route.ts]
- "id_route_put": "PUT()" | kind=code-symbol | source=app/api/prevencion/solicitudes/[id]/route.ts:L25 | neighbors=[route.ts]
- "imprimir_page_printrow": "PrintRow()" | kind=code-symbol | source=app/prevencion/busquedas/[id]/imprimir/page.tsx:L161 | neighbors=[page.tsx]
- "incidentes_actions_bool": "bool()" | kind=code-symbol | source=lib/incidentes/actions.ts:L28 | neighbors=[actions.ts]
- "incidentes_actions_canales": "CANALES" | kind=code-symbol | source=lib/incidentes/actions.ts:L31 | neighbors=[actions.ts]
- "incidentes_actions_estatus": "ESTATUS" | kind=code-symbol | source=lib/incidentes/actions.ts:L33 | neighbors=[actions.ts]
- "incidentes_actions_estatus_incidente": "ESTATUS_INCIDENTE" | kind=code-symbol | source=lib/incidentes/actions.ts:L33 | neighbors=[actions.ts]
- "incidentes_actions_estatusincidente": "EstatusIncidente" | kind=code-symbol | source=lib/incidentes/actions.ts:L34 | neighbors=[actions.ts]
- "incidentes_actions_sexos": "SEXOS" | kind=code-symbol | source=lib/incidentes/actions.ts:L35 | neighbors=[actions.ts]
- "incidentes_actions_str": "str()" | kind=code-symbol | source=lib/incidentes/actions.ts:L25 | neighbors=[actions.ts]
- "incidentes_actions_tipos_reporte": "TIPOS_REPORTE" | kind=code-symbol | source=lib/incidentes/actions.ts:L32 | neighbors=[actions.ts]
- "incidentes_audit_accion": "Accion" | kind=code-symbol | source=lib/incidentes/audit.ts:L4 | neighbors=[audit.ts]
- "incidentes_camara_page_th": "Th()" | kind=code-symbol | source=app/monitorista/incidentes-camara/page.tsx:L125 | neighbors=[page.tsx]
- "incidentes_camara_route_get": "GET()" | kind=code-symbol | source=app/api/monitorista/incidentes-camara/route.ts:L8 | neighbors=[route.ts]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/cesarbr/Documents/dev/sjr/seguridad_publica/.graphify/description-instructions/batch-068.json

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
