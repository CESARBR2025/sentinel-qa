# Node Description Batch 73 of 93

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

- "generar_route_thin": "THIN" | kind=code-symbol | source=app/api/nCoordinacion/generar/route.ts:L17 | neighbors=[route.ts]
- "gruas_route_get": "GET()" | kind=code-symbol | source=app/api/complementos/gruas/route.ts:L4 | neighbors=[route.ts]
- "guardar_evidencias_route_post": "POST()" | kind=code-symbol | source=app/api/via/exp-digital/guardar-evidencias/route.ts:L7 | neighbors=[route.ts]
- "health_route_get": "GET()" | kind=code-symbol | source=app/api/health/route.ts:L4 | neighbors=[route.ts]
- "helpers_abrirdocumento_abrirdocumento": "abrirDocumento()" | kind=code-symbol | source=features/via/expediente/helpers/abrirDocumento.ts:L1 | neighbors=[abrirDocumento.ts]
- "historial_page_historialpage": "HistorialPage()" | kind=code-symbol | source=app/monitorista/historial/page.tsx:L11 | neighbors=[page.tsx]
- "historial_page_tdstyle": "tdStyle" | kind=code-symbol | source=app/monitorista/historial/page.tsx:L79 | neighbors=[page.tsx]
- "historial_page_thstyle": "thStyle" | kind=code-symbol | source=app/monitorista/historial/page.tsx:L78 | neighbors=[page.tsx]
- "historial_route_get": "GET()" | kind=code-symbol | source=app/api/monitorista/historial/route.ts:L7 | neighbors=[route.ts]
- "hooks_usedespacho_despachodetalle": "DespachoDetalle" | kind=code-symbol | source=hooks/useDespacho.ts:L26 | neighbors=[useDespacho.ts]
- "hooks_usedespacho_empleadoresult": "EmpleadoResult" | kind=code-symbol | source=hooks/useDespacho.ts:L9 | neighbors=[useDespacho.ts]
- "hooks_usedespacho_incidentependiente": "IncidentePendiente" | kind=code-symbol | source=hooks/useDespacho.ts:L14 | neighbors=[useDespacho.ts]
- "hooks_usedespacho_vehiculooption": "VehiculoOption" | kind=code-symbol | source=hooks/useDespacho.ts:L4 | neighbors=[useDespacho.ts]
- "hooks_useempleado_empleadoresult": "EmpleadoResult" | kind=code-symbol | source=hooks/useEmpleado.ts:L4 | neighbors=[useEmpleado.ts]
- "hooks_useflota_filtrosflota": "FiltrosFlota" | kind=code-symbol | source=hooks/useFlota.ts:L9 | neighbors=[useFlota.ts]
- "hooks_useflota_vehiculooption": "VehiculoOption" | kind=code-symbol | source=hooks/useFlota.ts:L4 | neighbors=[useFlota.ts]
- "hooks_useincidente_incidentedetalle": "IncidenteDetalle" | kind=code-symbol | source=hooks/useIncidente.ts:L4 | neighbors=[useIncidente.ts]
- "hooks_useincidente_useincidente": "useIncidente()" | kind=code-symbol | source=hooks/useIncidente.ts:L23 | neighbors=[useIncidente.ts]
- "hooks_useincidentes_filtros": "Filtros" | kind=code-symbol | source=hooks/useIncidentes.ts:L10 | neighbors=[useIncidentes.ts]
- "hooks_useincidentes_incidenteresumen": "IncidenteResumen" | kind=code-symbol | source=hooks/useIncidentes.ts:L4 | neighbors=[useIncidentes.ts]
- "hooks_useincidentes_useincidentes": "useIncidentes()" | kind=code-symbol | source=hooks/useIncidentes.ts:L14 | neighbors=[useIncidentes.ts]
- "hooks_usereportecampo_reportecampodetalle": "ReporteCampoDetalle" | kind=code-symbol | source=hooks/useReporteCampo.ts:L4 | neighbors=[useReporteCampo.ts]
- "hooks_usereportecampo_usereportecampo": "useReporteCampo()" | kind=code-symbol | source=hooks/useReporteCampo.ts:L35 | neighbors=[useReporteCampo.ts]
- "id_page_aseguradodetallepage": "AseguradoDetallePage()" | kind=code-symbol | source=app/fiscalia/asegurados/[id]/page.tsx:L31 | neighbors=[page.tsx]
- "id_page_atenderdespachopage": "AtenderDespachoPage()" | kind=code-symbol | source=app/oficial/despachos/[id]/page.tsx:L10 | neighbors=[page.tsx]
- "id_page_btn": "BTN" | kind=code-symbol | source=app/auxiliar/checklist/[id]/page.tsx:L14 | neighbors=[page.tsx]
- "id_page_btnbackstyle": "btnBackStyle" | kind=code-symbol | source=app/agente_911/whatsapp/incidentes/[id]/page.tsx:L156 | neighbors=[page.tsx]
- "id_page_btnsecundario": "btnSecundario" | kind=code-symbol | source=app/monitorista/incidentes-camara/[id]/page.tsx:L158 | neighbors=[page.tsx]
- "id_page_campo": "Campo()" | kind=code-symbol | source=app/monitorista/detenidos/[id]/page.tsx:L117 | neighbors=[page.tsx]
- "id_page_campos": "CAMPOS" | kind=code-symbol | source=app/monitorista/incidentes-camara/[id]/page.tsx:L16 | neighbors=[page.tsx]
- "id_page_card": "Card()" | kind=code-symbol | source=app/prevencion/medidas/[id]/page.tsx:L209 | neighbors=[page.tsx]
- "id_page_cardstyle": "cardStyle" | kind=code-symbol | source=app/monitorista/solicitudes/[id]/page.tsx:L97 | neighbors=[page.tsx]
- "id_page_checklistformpage": "ChecklistFormPage()" | kind=code-symbol | source=app/auxiliar/checklist/[id]/page.tsx:L28 | neighbors=[page.tsx]
- "id_page_checkrow": "CheckRow()" | kind=code-symbol | source=app/auxiliar/checklist/[id]/page.tsx:L16 | neighbors=[page.tsx]
- "id_page_decoratorstyle": "decoratorStyle" | kind=code-symbol | source=app/agente_911/whatsapp/incidentes/[id]/page.tsx:L149 | neighbors=[page.tsx]
- "id_page_detalleinfraccionjuzgadopage": "DetalleInfraccionJuzgadoPage()" | kind=code-symbol | source=app/agente_juzgado/liberaciones/[id]/page.tsx:L6 | neighbors=[page.tsx]
- "id_page_detalleinfraccionpage": "DetalleInfraccionPage()" | kind=code-symbol | source=app/fiscalia/liberaciones/[id]/page.tsx:L6 | neighbors=[page.tsx]
- "id_page_detenidodetailpage": "DetenidoDetailPage()" | kind=code-symbol | source=app/monitorista/detenidos/[id]/page.tsx:L17 | neighbors=[page.tsx]
- "id_page_detenidofiscaliadetailpage": "DetenidoFiscaliaDetailPage()" | kind=code-symbol | source=app/fiscalia/detenidos/[id]/page.tsx:L11 | neighbors=[page.tsx]
- "id_page_detenidojuzgadodetailpage": "DetenidoJuzgadoDetailPage()" | kind=code-symbol | source=app/agente_juzgado/detenidos/[id]/page.tsx:L11 | neighbors=[page.tsx]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/ugomez/Documents/GitHub/seguridad_publica/.graphify/description-instructions/batch-072.json

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
