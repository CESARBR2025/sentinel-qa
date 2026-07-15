# Node Description Batch 75 of 93

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

- "id_page_props": "Props" | kind=code-symbol | source=app/fiscalia/asegurados/puesta-disposicion/[id]/page.tsx:L7 | neighbors=[page.tsx]
- "id_page_puestadisposicionpage": "PuestaDisposicionPage()" | kind=code-symbol | source=app/fiscalia/asegurados/puesta-disposicion/[id]/page.tsx:L11 | neighbors=[page.tsx]
- "id_page_refboxstyle": "refBoxStyle" | kind=code-symbol | source=app/agente_911/whatsapp/incidentes/[id]/page.tsx:L155 | neighbors=[page.tsx]
- "id_page_reportedetallepage": "ReporteDetallePage()" | kind=code-symbol | source=app/oficial/reportes/[id]/page.tsx:L16 | neighbors=[page.tsx]
- "id_page_sec": "SEC" | kind=code-symbol | source=app/oficial/reportes/[id]/page.tsx:L13 | neighbors=[page.tsx]
- "id_page_section": "Section()" | kind=code-symbol | source=app/infracciones/[id]/page.tsx:L379 | neighbors=[page.tsx]
- "id_page_sectiontitle": "sectionTitle" | kind=code-symbol | source=app/monitorista/solicitudes/[id]/page.tsx:L101 | neighbors=[page.tsx]
- "id_page_sectiontitlestyle": "sectionTitleStyle" | kind=code-symbol | source=app/agente_911/whatsapp/incidentes/[id]/page.tsx:L148 | neighbors=[page.tsx]
- "id_page_sel": "SEL" | kind=code-symbol | source=app/auxiliar/checklist/[id]/page.tsx:L11 | neighbors=[page.tsx]
- "id_page_selectstyle": "selectStyle" | kind=code-symbol | source=app/admin-transito/oficiales/[id]/page.tsx:L30 | neighbors=[page.tsx]
- "id_page_tipo_cfg": "TIPO_CFG" | kind=code-symbol | source=app/prevencion/busquedas/[id]/page.tsx:L11 | neighbors=[page.tsx]
- "id_page_titlestyle": "titleStyle" | kind=code-symbol | source=app/agente_911/whatsapp/incidentes/[id]/page.tsx:L159 | neighbors=[page.tsx]
- "id_page_turnos": "TURNOS" | kind=code-symbol | source=app/monitorista/incidentes-camara/[id]/page.tsx:L10 | neighbors=[page.tsx]
- "id_page_val": "VAL" | kind=code-symbol | source=app/oficial/reportes/[id]/page.tsx:L11 | neighbors=[page.tsx]
- "id_page_valuestyle": "valueStyle" | kind=code-symbol | source=app/agente_911/whatsapp/incidentes/[id]/page.tsx:L151 | neighbors=[page.tsx]
- "id_route_get": "GET()" | kind=code-symbol | source=app/api/via/infracciones/registradas/[id]/route.ts:L7 | neighbors=[route.ts]
- "id_route_patch": "PATCH()" | kind=code-symbol | source=app/api/reportes/formato-n-rnd/[id]/route.ts:L21 | neighbors=[route.ts]
- "id_route_put": "PUT()" | kind=code-symbol | source=app/api/prevencion/solicitudes/[id]/route.ts:L25 | neighbors=[route.ts]
- "imprimir_page_printrow": "PrintRow()" | kind=code-symbol | source=app/prevencion/busquedas/[id]/imprimir/page.tsx:L162 | neighbors=[page.tsx]
- "incidentes_actions_bool": "bool()" | kind=code-symbol | source=lib/incidentes/actions.ts:L32 | neighbors=[actions.ts]
- "incidentes_actions_canales": "CANALES" | kind=code-symbol | source=lib/incidentes/actions.ts:L35 | neighbors=[actions.ts]
- "incidentes_actions_estatus": "ESTATUS" | kind=code-symbol | source=lib/incidentes/actions.ts:L33 | neighbors=[actions.ts]
- "incidentes_actions_estatus_incidente": "ESTATUS_INCIDENTE" | kind=code-symbol | source=lib/incidentes/actions.ts:L37 | neighbors=[actions.ts]
- "incidentes_actions_estatusincidente": "EstatusIncidente" | kind=code-symbol | source=lib/incidentes/actions.ts:L38 | neighbors=[actions.ts]
- "incidentes_actions_sexos": "SEXOS" | kind=code-symbol | source=lib/incidentes/actions.ts:L39 | neighbors=[actions.ts]
- "incidentes_actions_str": "str()" | kind=code-symbol | source=lib/incidentes/actions.ts:L25 | neighbors=[actions.ts]
- "incidentes_actions_tipos_reporte": "TIPOS_REPORTE" | kind=code-symbol | source=lib/incidentes/actions.ts:L36 | neighbors=[actions.ts]
- "incidentes_audit_accion": "Accion" | kind=code-symbol | source=lib/incidentes/audit.ts:L4 | neighbors=[audit.ts]
- "incidentes_camara_page_th": "Th()" | kind=code-symbol | source=app/monitorista/incidentes-camara/page.tsx:L125 | neighbors=[page.tsx]
- "incidentes_camara_route_get": "GET()" | kind=code-symbol | source=app/api/monitorista/incidentes-camara/route.ts:L8 | neighbors=[route.ts]
- "incidentes_camara_route_post": "POST()" | kind=code-symbol | source=app/api/monitorista/incidentes-camara/route.ts:L20 | neighbors=[route.ts]
- "incidentes_camaras_page_reportesdeteccioncamarapage": "ReportesDeteccionCamaraPage()" | kind=code-symbol | source=app/incidentes_camaras/page.tsx:L13 | neighbors=[page.tsx]
- "incidentes_historialincidente_badge": "Badge()" | kind=code-symbol | source=components/incidentes/HistorialIncidente.tsx:L138 | neighbors=[HistorialIncidente.tsx]
- "incidentes_historialincidente_dato": "Dato()" | kind=code-symbol | source=components/incidentes/HistorialIncidente.tsx:L129 | neighbors=[HistorialIncidente.tsx]
- "incidentes_historialincidente_fmt": "fmt()" | kind=code-symbol | source=components/incidentes/HistorialIncidente.tsx:L5 | neighbors=[HistorialIncidente.tsx]
- "incidentes_historialincidente_pendiente": "Pendiente()" | kind=code-symbol | source=components/incidentes/HistorialIncidente.tsx:L146 | neighbors=[HistorialIncidente.tsx]
- "incidentes_page_bitacoraincidentespage": "BitacoraIncidentesPage()" | kind=code-symbol | source=app/incidentes/page.tsx:L23 | neighbors=[page.tsx]
- "incidentes_page_btnnuevostyle": "btnNuevoStyle" | kind=code-symbol | source=app/agente_911/whatsapp/incidentes/page.tsx:L167 | neighbors=[page.tsx]
- "incidentes_page_btnviewstyle": "btnViewStyle" | kind=code-symbol | source=app/incidentes/page.tsx:L170 | neighbors=[page.tsx]
- "incidentes_page_cardstyle": "cardStyle" | kind=code-symbol | source=app/agente_911/whatsapp/incidentes/page.tsx:L143 | neighbors=[page.tsx]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/ugomez/Documents/GitHub/seguridad_publica/.graphify/description-instructions/batch-074.json

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
