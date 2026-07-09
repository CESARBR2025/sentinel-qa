# Node Description Batch 64 of 79

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

- "formato_n_medios_alternativos_route_post": "POST()" | kind=code-symbol | source=app/api/reportes/formato-n-medios-alternativos/route.ts:L20 | neighbors=[route.ts]
- "formato_n_rnd_page_formatonrndpage": "FormatoNRndPage()" | kind=code-symbol | source=app/formato-n-rnd/page.tsx:L12 | neighbors=[page.tsx]
- "formato_n_rnd_page_td": "Td()" | kind=code-symbol | source=app/formato-n-rnd/page.tsx:L76 | neighbors=[page.tsx]
- "formato_n_rnd_page_th": "Th()" | kind=code-symbol | source=app/formato-n-rnd/page.tsx:L72 | neighbors=[page.tsx]
- "formato_n_rnd_route_get": "GET()" | kind=code-symbol | source=app/api/reportes/formato-n-rnd/route.ts:L7 | neighbors=[route.ts]
- "formato_n_rnd_route_post": "POST()" | kind=code-symbol | source=app/api/reportes/formato-n-rnd/route.ts:L17 | neighbors=[route.ts]
- "formulario_ingreso_page_despachopage": "DespachoPage()" | kind=code-symbol | source=app/analisis/formulario-ingreso/page.tsx:L9 | neighbors=[page.tsx]
- "fotos_page_fotosdetenidopage": "FotosDetenidoPage()" | kind=code-symbol | source=app/oficial/reportes/[id]/fotos/page.tsx:L10 | neighbors=[page.tsx]
- "fuente_route_get": "GET()" | kind=code-symbol | source=app/api/reportes/formato-n-rnd/fuente/route.ts:L7 | neighbors=[route.ts]
- "generar_orden_pago_route_post": "POST()" | kind=code-symbol | source=app/api/via/sa7/generar-orden-pago/route.ts:L9 | neighbors=[route.ts]
- "generar_ppt_page_registrointeligenciapage": "RegistroInteligenciaPage()" | kind=code-symbol | source=app/analisis/generar-ppt/page.tsx:L9 | neighbors=[page.tsx]
- "generar_ppt_route_post": "POST()" | kind=code-symbol | source=app/api/monitorista/detenidos/generar-ppt/route.ts:L8 | neighbors=[route.ts]
- "gruas_route_get": "GET()" | kind=code-symbol | source=app/api/complementos/gruas/route.ts:L4 | neighbors=[route.ts]
- "guardar_evidencias_route_post": "POST()" | kind=code-symbol | source=app/api/via/exp-digital/guardar-evidencias/route.ts:L7 | neighbors=[route.ts]
- "health_route_get": "GET()" | kind=code-symbol | source=app/api/health/route.ts:L4 | neighbors=[route.ts]
- "helpers_abrirdocumento_abrirdocumento": "abrirDocumento()" | kind=code-symbol | source=features/via/expediente/helpers/abrirDocumento.ts:L1 | neighbors=[abrirDocumento.ts]
- "historial_page_historialpage": "HistorialPage()" | kind=code-symbol | source=app/monitorista/historial/page.tsx:L11 | neighbors=[page.tsx]
- "historial_page_tdstyle": "tdStyle" | kind=code-symbol | source=app/monitorista/historial/page.tsx:L79 | neighbors=[page.tsx]
- "historial_page_thstyle": "thStyle" | kind=code-symbol | source=app/monitorista/historial/page.tsx:L78 | neighbors=[page.tsx]
- "historial_route_get": "GET()" | kind=code-symbol | source=app/api/monitorista/historial/route.ts:L7 | neighbors=[route.ts]
- "hooks_usedespacho_despachodetalle": "DespachoDetalle" | kind=code-symbol | source=hooks/useDespacho.ts:L23 | neighbors=[useDespacho.ts]
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
- "id_page_btn": "BTN" | kind=code-symbol | source=app/auxiliar/checklist/[id]/page.tsx:L15 | neighbors=[page.tsx]
- "id_page_btnbackstyle": "btnBackStyle" | kind=code-symbol | source=app/911/whatsapp/incidentes/[id]/page.tsx:L152 | neighbors=[page.tsx]
- "id_page_btnsecundario": "btnSecundario" | kind=code-symbol | source=app/monitorista/incidentes-camara/[id]/page.tsx:L158 | neighbors=[page.tsx]
- "id_page_campo": "Campo()" | kind=code-symbol | source=app/monitorista/detenidos/[id]/page.tsx:L117 | neighbors=[page.tsx]
- "id_page_campos": "CAMPOS" | kind=code-symbol | source=app/monitorista/incidentes-camara/[id]/page.tsx:L16 | neighbors=[page.tsx]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/cesarbr/Documents/dev/sjr/seguridad_publica/.graphify/description-instructions/batch-063.json

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
