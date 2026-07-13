# Node Description Batch 65 of 86

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

- "fiscalia_actions_guardarpuestadisposicionjuzgadoaction": "guardarPuestaDisposicionJuzgadoAction()" | kind=code-symbol | source=lib/fiscalia/actions.ts:L495 | neighbors=[actions.ts]
- "fiscalia_actions_liberacionesdata": "LiberacionesData" | kind=code-symbol | source=lib/fiscalia/actions.ts:L162 | neighbors=[actions.ts]
- "fiscalia_actions_obteneraseguradosjuzgadoaction": "obtenerAseguradosJuzgadoAction()" | kind=code-symbol | source=lib/fiscalia/actions.ts:L442 | neighbors=[actions.ts]
- "fiscalia_actions_obtenerdashboardjuzgado": "obtenerDashboardJuzgado()" | kind=code-symbol | source=lib/fiscalia/actions.ts:L426 | neighbors=[actions.ts]
- "fiscalia_actions_obtenerdatosaseguradoaction": "obtenerDatosAseguradoAction()" | kind=code-symbol | source=lib/fiscalia/actions.ts:L103 | neighbors=[actions.ts]
- "fiscalia_actions_obtenerdetalleaseguradocompletojuzgadoaction": "obtenerDetalleAseguradoCompletoJuzgadoAction()" | kind=code-symbol | source=lib/fiscalia/actions.ts:L457 | neighbors=[actions.ts]
- "fiscalia_actions_obtenerpuestadisposicionjuzgadoaction": "obtenerPuestaDisposicionJuzgadoAction()" | kind=code-symbol | source=lib/fiscalia/actions.ts:L476 | neighbors=[actions.ts]
- "fiscalia_actions_solicitudesdata": "SolicitudesData" | kind=code-symbol | source=lib/fiscalia/actions.ts:L32 | neighbors=[actions.ts]
- "fiscalia_buttonverdetalles_botonverdetalleprops": "BotonVerDetalleProps" | kind=code-symbol | source=components/fiscalia/ButtonVerDetalles.tsx:L6 | neighbors=[ButtonVerDetalles.tsx]
- "fiscalia_capturardetallesform_disabledsx": "disabledSx" | kind=code-symbol | source=components/fiscalia/CapturarDetallesForm.tsx:L33 | neighbors=[CapturarDetallesForm.tsx]
- "fiscalia_capturardetallesform_evidenciaitem": "EvidenciaItem" | kind=code-symbol | source=components/fiscalia/CapturarDetallesForm.tsx:L45 | neighbors=[CapturarDetallesForm.tsx]
- "fiscalia_capturardetallesform_inputsx": "inputSx" | kind=code-symbol | source=components/fiscalia/CapturarDetallesForm.tsx:L21 | neighbors=[CapturarDetallesForm.tsx]
- "fiscalia_capturardetallesform_labelsx": "labelSx" | kind=code-symbol | source=components/fiscalia/CapturarDetallesForm.tsx:L11 | neighbors=[CapturarDetallesForm.tsx]
- "fiscalia_capturardetallesform_props": "Props" | kind=code-symbol | source=components/fiscalia/CapturarDetallesForm.tsx:L57 | neighbors=[CapturarDetallesForm.tsx]
- "fiscalia_cargaroficiosection_campo": "Campo()" | kind=code-symbol | source=components/fiscalia/CargarOficioSection.tsx:L460 | neighbors=[CargarOficioSection.tsx]
- "fiscalia_cargaroficiosection_cargaroficiosection": "CargarOficioSection()" | kind=code-symbol | source=components/fiscalia/CargarOficioSection.tsx:L24 | neighbors=[CargarOficioSection.tsx]
- "fiscalia_cargaroficiosection_cargaroficiosectionprops": "CargarOficioSectionProps" | kind=code-symbol | source=components/fiscalia/CargarOficioSection.tsx:L10 | neighbors=[CargarOficioSection.tsx]
- "fiscalia_cargaroficiosection_fileupload": "FileUpload()" | kind=code-symbol | source=components/fiscalia/CargarOficioSection.tsx:L475 | neighbors=[CargarOficioSection.tsx]
- "fiscalia_confirmacionmodal_confirmacionmodal": "ConfirmacionModal()" | kind=code-symbol | source=components/fiscalia/ConfirmacionModal.tsx:L38 | neighbors=[ConfirmacionModal.tsx]
- "fiscalia_confirmacionmodal_confirmacionmodalprops": "ConfirmacionModalProps" | kind=code-symbol | source=components/fiscalia/ConfirmacionModal.tsx:L5 | neighbors=[ConfirmacionModal.tsx]
- "fiscalia_confirmacionmodal_variantes": "VARIANTES" | kind=code-symbol | source=components/fiscalia/ConfirmacionModal.tsx:L17 | neighbors=[ConfirmacionModal.tsx]
- "fiscalia_detallesaseguradoview_disabledsx": "disabledSx" | kind=code-symbol | source=components/fiscalia/DetallesAseguradoView.tsx:L18 | neighbors=[DetallesAseguradoView.tsx]
- "fiscalia_detallesaseguradoview_esimagen": "esImagen()" | kind=code-symbol | source=components/fiscalia/DetallesAseguradoView.tsx:L36 | neighbors=[DetallesAseguradoView.tsx]
- "fiscalia_detallesaseguradoview_labelsx": "labelSx" | kind=code-symbol | source=components/fiscalia/DetallesAseguradoView.tsx:L8 | neighbors=[DetallesAseguradoView.tsx]
- "fiscalia_detallesaseguradoview_props": "Props" | kind=code-symbol | source=components/fiscalia/DetallesAseguradoView.tsx:L30 | neighbors=[DetallesAseguradoView.tsx]
- "fiscalia_fiscaliadashboard_avatar_colors": "AVATAR_COLORS" | kind=code-symbol | source=components/fiscalia/FiscaliaDashboard.tsx:L13 | neighbors=[FiscaliaDashboard.tsx]
- "fiscalia_fiscaliadashboard_estatusfiscalia": "EstatusFiscalia" | kind=code-symbol | source=components/fiscalia/FiscaliaDashboard.tsx:L43 | neighbors=[FiscaliaDashboard.tsx]
- "fiscalia_fiscaliadashboard_fiscaliadashboard": "FiscaliaDashboard()" | kind=code-symbol | source=components/fiscalia/FiscaliaDashboard.tsx:L70 | neighbors=[FiscaliaDashboard.tsx]
- "fiscalia_fiscaliadashboard_getbadge": "getBadge()" | kind=code-symbol | source=components/fiscalia/FiscaliaDashboard.tsx:L64 | neighbors=[FiscaliaDashboard.tsx]
- "fiscalia_fiscaliadashboard_getinitials": "getInitials()" | kind=code-symbol | source=components/fiscalia/FiscaliaDashboard.tsx:L24 | neighbors=[FiscaliaDashboard.tsx]
- "fiscalia_fiscaliadashboard_hashcolor": "hashColor()" | kind=code-symbol | source=components/fiscalia/FiscaliaDashboard.tsx:L31 | neighbors=[FiscaliaDashboard.tsx]
- "fiscalia_fiscaliadashboard_props": "Props" | kind=code-symbol | source=components/fiscalia/FiscaliaDashboard.tsx:L37 | neighbors=[FiscaliaDashboard.tsx]
- "fiscalia_fiscaliadashboard_sortable_keys": "SORTABLE_KEYS" | kind=code-symbol | source=components/fiscalia/FiscaliaDashboard.tsx:L68 | neighbors=[FiscaliaDashboard.tsx]
- "fiscalia_fiscaliadashboard_status_badge": "STATUS_BADGE" | kind=code-symbol | source=components/fiscalia/FiscaliaDashboard.tsx:L52 | neighbors=[FiscaliaDashboard.tsx]
- "fiscalia_fiscaliadashboard_status_tabs": "STATUS_TABS" | kind=code-symbol | source=components/fiscalia/FiscaliaDashboard.tsx:L47 | neighbors=[FiscaliaDashboard.tsx]
- "fiscalia_fiscaliatable_columns": "columns" | kind=code-symbol | source=components/fiscalia/FiscaliaTable.tsx:L23 | neighbors=[FiscaliaTable.tsx]
- "fiscalia_fiscaliatable_datarow": "DataRow" | kind=code-symbol | source=components/fiscalia/FiscaliaTable.tsx:L5 | neighbors=[FiscaliaTable.tsx]
- "fiscalia_fiscaliatable_fiscaliatable": "FiscaliaTable()" | kind=code-symbol | source=components/fiscalia/FiscaliaTable.tsx:L31 | neighbors=[FiscaliaTable.tsx]
- "fiscalia_fiscaliatable_fiscaliatableprops": "FiscaliaTableProps" | kind=code-symbol | source=components/fiscalia/FiscaliaTable.tsx:L16 | neighbors=[FiscaliaTable.tsx]
- "fiscalia_formularioasegurado_disabledsx": "disabledSx" | kind=code-symbol | source=components/fiscalia/FormularioAsegurado.tsx:L30 | neighbors=[FormularioAsegurado.tsx]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/cesarbr/Documents/dev/sjr/seguridad_publica/.graphify/description-instructions/batch-064.json

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
