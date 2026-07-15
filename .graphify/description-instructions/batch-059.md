# Node Description Batch 60 of 93

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

- "agente_infracciones_storecapturainfractor_initialstate": "initialState" | kind=code-symbol | source=lib/agente_infracciones/storeCapturaInfractor.ts:L38 | neighbors=[storeCapturaInfractor.ts]
- "agente_juzgado_actions_aseguradosjuzgadodata": "AseguradosJuzgadoData" | kind=code-symbol | source=lib/agente_juzgado/actions.ts:L365 | neighbors=[actions.ts]
- "agente_juzgado_actions_liberacionesdata": "LiberacionesData" | kind=code-symbol | source=lib/agente_juzgado/actions.ts:L249 | neighbors=[actions.ts]
- "agente_juzgado_actions_obtenerdatosaseguradoaction": "obtenerDatosAseguradoAction()" | kind=code-symbol | source=lib/agente_juzgado/actions.ts:L165 | neighbors=[actions.ts]
- "agente_juzgado_actions_solicitudesdata": "SolicitudesData" | kind=code-symbol | source=lib/agente_juzgado/actions.ts:L56 | neighbors=[actions.ts]
- "agente_juzgado_botonverdetalle_botonverdetalleprops": "BotonVerDetalleProps" | kind=code-symbol | source=components/agente_juzgado/BotonVerDetalle.tsx:L6 | neighbors=[BotonVerDetalle.tsx]
- "agente_juzgado_capturardetallesform_disabledsx": "disabledSx" | kind=code-symbol | source=components/agente_juzgado/CapturarDetallesForm.tsx:L33 | neighbors=[CapturarDetallesForm.tsx]
- "agente_juzgado_capturardetallesform_evidenciaitem": "EvidenciaItem" | kind=code-symbol | source=components/agente_juzgado/CapturarDetallesForm.tsx:L45 | neighbors=[CapturarDetallesForm.tsx]
- "agente_juzgado_capturardetallesform_inputsx": "inputSx" | kind=code-symbol | source=components/agente_juzgado/CapturarDetallesForm.tsx:L21 | neighbors=[CapturarDetallesForm.tsx]
- "agente_juzgado_capturardetallesform_labelsx": "labelSx" | kind=code-symbol | source=components/agente_juzgado/CapturarDetallesForm.tsx:L11 | neighbors=[CapturarDetallesForm.tsx]
- "agente_juzgado_capturardetallesform_props": "Props" | kind=code-symbol | source=components/agente_juzgado/CapturarDetallesForm.tsx:L57 | neighbors=[CapturarDetallesForm.tsx]
- "agente_juzgado_cargaroficiosection_campo": "Campo()" | kind=code-symbol | source=components/agente_juzgado/CargarOficioSection.tsx:L455 | neighbors=[CargarOficioSection.tsx]
- "agente_juzgado_cargaroficiosection_cargaroficiosection": "CargarOficioSection()" | kind=code-symbol | source=components/agente_juzgado/CargarOficioSection.tsx:L23 | neighbors=[CargarOficioSection.tsx]
- "agente_juzgado_cargaroficiosection_cargaroficiosectionprops": "CargarOficioSectionProps" | kind=code-symbol | source=components/agente_juzgado/CargarOficioSection.tsx:L9 | neighbors=[CargarOficioSection.tsx]
- "agente_juzgado_cargaroficiosection_fileupload": "FileUpload()" | kind=code-symbol | source=components/agente_juzgado/CargarOficioSection.tsx:L470 | neighbors=[CargarOficioSection.tsx]
- "agente_juzgado_cerrarcasomodal_cerrarcasoboton": "CerrarCasoBoton()" | kind=code-symbol | source=components/agente_juzgado/CerrarCasoModal.tsx:L6 | neighbors=[CerrarCasoModal.tsx]
- "agente_juzgado_confirmacionmodal_confirmacionmodal": "ConfirmacionModal()" | kind=code-symbol | source=components/agente_juzgado/ConfirmacionModal.tsx:L38 | neighbors=[ConfirmacionModal.tsx]
- "agente_juzgado_confirmacionmodal_confirmacionmodalprops": "ConfirmacionModalProps" | kind=code-symbol | source=components/agente_juzgado/ConfirmacionModal.tsx:L5 | neighbors=[ConfirmacionModal.tsx]
- "agente_juzgado_confirmacionmodal_variantes": "VARIANTES" | kind=code-symbol | source=components/agente_juzgado/ConfirmacionModal.tsx:L17 | neighbors=[ConfirmacionModal.tsx]
- "agente_juzgado_detallesaseguradoview_disabledsx": "disabledSx" | kind=code-symbol | source=components/agente_juzgado/DetallesAseguradoView.tsx:L18 | neighbors=[DetallesAseguradoView.tsx]
- "agente_juzgado_detallesaseguradoview_esimagen": "esImagen()" | kind=code-symbol | source=components/agente_juzgado/DetallesAseguradoView.tsx:L36 | neighbors=[DetallesAseguradoView.tsx]
- "agente_juzgado_detallesaseguradoview_labelsx": "labelSx" | kind=code-symbol | source=components/agente_juzgado/DetallesAseguradoView.tsx:L8 | neighbors=[DetallesAseguradoView.tsx]
- "agente_juzgado_detallesaseguradoview_props": "Props" | kind=code-symbol | source=components/agente_juzgado/DetallesAseguradoView.tsx:L30 | neighbors=[DetallesAseguradoView.tsx]
- "agente_juzgado_formularioaseguradojuzgado_disabledsx": "disabledSx" | kind=code-symbol | source=components/agente_juzgado/FormularioAseguradoJuzgado.tsx:L39 | neighbors=[FormularioAseguradoJuzgado.tsx]
- "agente_juzgado_formularioaseguradojuzgado_labelsx": "labelSx" | kind=code-symbol | source=components/agente_juzgado/FormularioAseguradoJuzgado.tsx:L29 | neighbors=[FormularioAseguradoJuzgado.tsx]
- "agente_juzgado_formularioaseguradojuzgado_props": "Props" | kind=code-symbol | source=components/agente_juzgado/FormularioAseguradoJuzgado.tsx:L13 | neighbors=[FormularioAseguradoJuzgado.tsx]
- "agente_juzgado_juzgadodashboard_avatar_colors": "AVATAR_COLORS" | kind=code-symbol | source=components/agente_juzgado/JuzgadoDashboard.tsx:L13 | neighbors=[JuzgadoDashboard.tsx]
- "agente_juzgado_juzgadodashboard_estatusjuzgado": "EstatusJuzgado" | kind=code-symbol | source=components/agente_juzgado/JuzgadoDashboard.tsx:L43 | neighbors=[JuzgadoDashboard.tsx]
- "agente_juzgado_juzgadodashboard_getbadge": "getBadge()" | kind=code-symbol | source=components/agente_juzgado/JuzgadoDashboard.tsx:L65 | neighbors=[JuzgadoDashboard.tsx]
- "agente_juzgado_juzgadodashboard_getinitials": "getInitials()" | kind=code-symbol | source=components/agente_juzgado/JuzgadoDashboard.tsx:L24 | neighbors=[JuzgadoDashboard.tsx]
- "agente_juzgado_juzgadodashboard_hashcolor": "hashColor()" | kind=code-symbol | source=components/agente_juzgado/JuzgadoDashboard.tsx:L31 | neighbors=[JuzgadoDashboard.tsx]
- "agente_juzgado_juzgadodashboard_juzgadodashboard": "JuzgadoDashboard()" | kind=code-symbol | source=components/agente_juzgado/JuzgadoDashboard.tsx:L71 | neighbors=[JuzgadoDashboard.tsx]
- "agente_juzgado_juzgadodashboard_props": "Props" | kind=code-symbol | source=components/agente_juzgado/JuzgadoDashboard.tsx:L37 | neighbors=[JuzgadoDashboard.tsx]
- "agente_juzgado_juzgadodashboard_sortable_keys": "SORTABLE_KEYS" | kind=code-symbol | source=components/agente_juzgado/JuzgadoDashboard.tsx:L69 | neighbors=[JuzgadoDashboard.tsx]
- "agente_juzgado_juzgadodashboard_status_badge": "STATUS_BADGE" | kind=code-symbol | source=components/agente_juzgado/JuzgadoDashboard.tsx:L52 | neighbors=[JuzgadoDashboard.tsx]
- "agente_juzgado_juzgadodashboard_status_tabs": "STATUS_TABS" | kind=code-symbol | source=components/agente_juzgado/JuzgadoDashboard.tsx:L47 | neighbors=[JuzgadoDashboard.tsx]
- "agente_juzgado_juzgadotable_columns": "columns" | kind=code-symbol | source=components/agente_juzgado/JuzgadoTable.tsx:L23 | neighbors=[JuzgadoTable.tsx]
- "agente_juzgado_juzgadotable_datarow": "DataRow" | kind=code-symbol | source=components/agente_juzgado/JuzgadoTable.tsx:L5 | neighbors=[JuzgadoTable.tsx]
- "agente_juzgado_juzgadotable_juzgadotableprops": "JuzgadoTableProps" | kind=code-symbol | source=components/agente_juzgado/JuzgadoTable.tsx:L16 | neighbors=[JuzgadoTable.tsx]
- "agente_juzgado_mapper_bool": "bool()" | kind=code-symbol | source=lib/agente_juzgado/mapper.ts:L8 | neighbors=[mapper.ts]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/ugomez/Documents/GitHub/seguridad_publica/.graphify/description-instructions/batch-059.json

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
