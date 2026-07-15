# Node Description Batch 69 of 93

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

- "estadisticos_page_reportestelefonicospage": "ReportesTelefonicosPage()" | kind=code-symbol | source=app/estadisticos/page.tsx:L14 | neighbors=[page.tsx]
- "estadisticos_phonepagination_paginationbuttonstyle": "paginationButtonStyle" | kind=code-symbol | source=components/reportes/estadisticos/PhonePagination.tsx:L51 | neighbors=[PhonePagination.tsx]
- "estadisticos_phonepagination_paginationprops": "PaginationProps" | kind=code-symbol | source=components/reportes/estadisticos/PhonePagination.tsx:L4 | neighbors=[PhonePagination.tsx]
- "estadisticos_phonepagination_phonepagination": "PhonePagination()" | kind=code-symbol | source=components/reportes/estadisticos/PhonePagination.tsx:L10 | neighbors=[PhonePagination.tsx]
- "estadisticos_phonereportstable_phonereport": "PhoneReport" | kind=code-symbol | source=components/reportes/estadisticos/PhoneReportsTable.tsx:L6 | neighbors=[PhoneReportsTable.tsx]
- "expediente_proxy_route_get": "GET()" | kind=code-symbol | source=app/api/monitorista/expediente-proxy/route.ts:L8 | neighbors=[route.ts]
- "exportar_excel_route_get": "GET()" | kind=code-symbol | source=app/api/reportes-operativos/exportar-excel/route.ts:L7 | neighbors=[route.ts]
- "exportar_robo_route_get": "GET()" | kind=code-symbol | source=app/api/auxiliar/exportar-robo/route.ts:L8 | neighbors=[route.ts]
- "exportar_route_cols": "COLS" | kind=code-symbol | source=app/api/camara/exportar/route.ts:L8 | neighbors=[route.ts]
- "exportar_route_rowvals": "rowVals()" | kind=code-symbol | source=app/api/camara/exportar/route.ts:L17 | neighbors=[route.ts]
- "exportar_route_widths": "WIDTHS" | kind=code-symbol | source=app/api/camara/exportar/route.ts:L15 | neighbors=[route.ts]
- "finalizarproceso_route_patch": "PATCH()" | kind=code-symbol | source=app/api/agente_juzgado/finalizarProceso/route.ts:L6 | neighbors=[route.ts]
- "fiscalia_abrirdocumento_abrirdocumento": "abrirDocumento()" | kind=code-symbol | source=lib/fiscalia/abrirDocumento.ts:L1 | neighbors=[abrirDocumento.ts]
- "fiscalia_actions_aseguradosdata": "AseguradosData" | kind=code-symbol | source=lib/fiscalia/actions.ts:L159 | neighbors=[actions.ts]
- "fiscalia_actions_guardarpuestadisposicionjuzgadoaction": "guardarPuestaDisposicionJuzgadoAction()" | kind=code-symbol | source=lib/fiscalia/actions.ts:L475 | neighbors=[actions.ts]
- "fiscalia_actions_liberacionesdata": "LiberacionesData" | kind=code-symbol | source=lib/fiscalia/actions.ts:L142 | neighbors=[actions.ts]
- "fiscalia_actions_obteneraseguradosjuzgadoaction": "obtenerAseguradosJuzgadoAction()" | kind=code-symbol | source=lib/fiscalia/actions.ts:L422 | neighbors=[actions.ts]
- "fiscalia_actions_obtenerdashboardjuzgado": "obtenerDashboardJuzgado()" | kind=code-symbol | source=lib/fiscalia/actions.ts:L406 | neighbors=[actions.ts]
- "fiscalia_actions_obtenerdatosaseguradoaction": "obtenerDatosAseguradoAction()" | kind=code-symbol | source=lib/fiscalia/actions.ts:L103 | neighbors=[actions.ts]
- "fiscalia_actions_obtenerdetalleaseguradocompletojuzgadoaction": "obtenerDetalleAseguradoCompletoJuzgadoAction()" | kind=code-symbol | source=lib/fiscalia/actions.ts:L437 | neighbors=[actions.ts]
- "fiscalia_actions_obtenerpuestadisposicionjuzgadoaction": "obtenerPuestaDisposicionJuzgadoAction()" | kind=code-symbol | source=lib/fiscalia/actions.ts:L456 | neighbors=[actions.ts]
- "fiscalia_actions_solicitudesdata": "SolicitudesData" | kind=code-symbol | source=lib/fiscalia/actions.ts:L32 | neighbors=[actions.ts]
- "fiscalia_buttonverdetalles_botonverdetalleprops": "BotonVerDetalleProps" | kind=code-symbol | source=components/fiscalia/ButtonVerDetalles.tsx:L6 | neighbors=[ButtonVerDetalles.tsx]
- "fiscalia_capturardetallesform_disabledsx": "disabledSx" | kind=code-symbol | source=components/fiscalia/CapturarDetallesForm.tsx:L33 | neighbors=[CapturarDetallesForm.tsx]
- "fiscalia_capturardetallesform_evidenciaitem": "EvidenciaItem" | kind=code-symbol | source=components/fiscalia/CapturarDetallesForm.tsx:L45 | neighbors=[CapturarDetallesForm.tsx]
- "fiscalia_capturardetallesform_inputsx": "inputSx" | kind=code-symbol | source=components/fiscalia/CapturarDetallesForm.tsx:L21 | neighbors=[CapturarDetallesForm.tsx]
- "fiscalia_capturardetallesform_labelsx": "labelSx" | kind=code-symbol | source=components/fiscalia/CapturarDetallesForm.tsx:L11 | neighbors=[CapturarDetallesForm.tsx]
- "fiscalia_capturardetallesform_props": "Props" | kind=code-symbol | source=components/fiscalia/CapturarDetallesForm.tsx:L45 | neighbors=[CapturarDetallesForm.tsx]
- "fiscalia_cargaroficiosection_campo": "Campo()" | kind=code-symbol | source=components/fiscalia/CargarOficioSection.tsx:L460 | neighbors=[CargarOficioSection.tsx]
- "fiscalia_cargaroficiosection_cargaroficiosection": "CargarOficioSection()" | kind=code-symbol | source=components/fiscalia/CargarOficioSection.tsx:L24 | neighbors=[CargarOficioSection.tsx]
- "fiscalia_cargaroficiosection_cargaroficiosectionprops": "CargarOficioSectionProps" | kind=code-symbol | source=components/fiscalia/CargarOficioSection.tsx:L10 | neighbors=[CargarOficioSection.tsx]
- "fiscalia_cargaroficiosection_fileupload": "FileUpload()" | kind=code-symbol | source=components/fiscalia/CargarOficioSection.tsx:L475 | neighbors=[CargarOficioSection.tsx]
- "fiscalia_confirmacionmodal_confirmacionmodal": "ConfirmacionModal()" | kind=code-symbol | source=components/fiscalia/ConfirmacionModal.tsx:L38 | neighbors=[ConfirmacionModal.tsx]
- "fiscalia_confirmacionmodal_confirmacionmodalprops": "ConfirmacionModalProps" | kind=code-symbol | source=components/fiscalia/ConfirmacionModal.tsx:L5 | neighbors=[ConfirmacionModal.tsx]
- "fiscalia_confirmacionmodal_variantes": "VARIANTES" | kind=code-symbol | source=components/fiscalia/ConfirmacionModal.tsx:L17 | neighbors=[ConfirmacionModal.tsx]
- "fiscalia_detallesaseguradoview_disabledsx": "disabledSx" | kind=code-symbol | source=components/fiscalia/DetallesAseguradoView.tsx:L19 | neighbors=[DetallesAseguradoView.tsx]
- "fiscalia_detallesaseguradoview_esimagen": "esImagen()" | kind=code-symbol | source=components/fiscalia/DetallesAseguradoView.tsx:L37 | neighbors=[DetallesAseguradoView.tsx]
- "fiscalia_detallesaseguradoview_labelsx": "labelSx" | kind=code-symbol | source=components/fiscalia/DetallesAseguradoView.tsx:L9 | neighbors=[DetallesAseguradoView.tsx]
- "fiscalia_detallesaseguradoview_props": "Props" | kind=code-symbol | source=components/fiscalia/DetallesAseguradoView.tsx:L31 | neighbors=[DetallesAseguradoView.tsx]
- "fiscalia_expedienteview_labelsx": "labelSx" | kind=code-symbol | source=components/fiscalia/ExpedienteView.tsx:L12 | neighbors=[ExpedienteView.tsx]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/ugomez/Documents/GitHub/seguridad_publica/.graphify/description-instructions/batch-068.json

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
