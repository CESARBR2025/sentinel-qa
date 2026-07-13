# Node Description Batch 55 of 86

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

- "agente_infracciones_infraccionestable_datarow": "DataRow" | kind=code-symbol | source=components/agente_infracciones/InfraccionesTable.tsx:L5 | neighbors=[InfraccionesTable.tsx]
- "agente_infracciones_infraccionestable_infraccionestable": "InfraccionesTable()" | kind=code-symbol | source=components/agente_infracciones/InfraccionesTable.tsx:L31 | neighbors=[InfraccionesTable.tsx]
- "agente_infracciones_infraccionestable_infraccionestableprops": "InfraccionesTableProps" | kind=code-symbol | source=components/agente_infracciones/InfraccionesTable.tsx:L16 | neighbors=[InfraccionesTable.tsx]
- "agente_infracciones_mapper_str": "str()" | kind=code-symbol | source=lib/agente_infracciones/mapper.ts:L3 | neighbors=[mapper.ts]
- "agente_infracciones_modalentregargarantia_props": "Props" | kind=code-symbol | source=components/agente_infracciones/ModalEntregarGarantia.tsx:L11 | neighbors=[ModalEntregarGarantia.tsx]
- "agente_infracciones_page_infraccionesdashboardpage": "InfraccionesDashboardPage()" | kind=code-symbol | source=app/agente_infracciones/page.tsx:L5 | neighbors=[page.tsx]
- "agente_infracciones_permisos_accion": "Accion" | kind=code-symbol | source=lib/agente_infracciones/permisos.ts:L5 | neighbors=[permisos.ts]
- "agente_infracciones_permisos_guardarpermiso": "guardarPermiso()" | kind=code-symbol | source=lib/agente_infracciones/permisos.ts:L12 | neighbors=[permisos.ts]
- "agente_infracciones_permisos_guardarplantillaseccion": "guardarPlantillaSeccion()" | kind=code-symbol | source=lib/agente_infracciones/permisos.ts:L20 | neighbors=[permisos.ts]
- "agente_infracciones_permisos_obtenerplantillarol": "obtenerPlantillaRol()" | kind=code-symbol | source=lib/agente_infracciones/permisos.ts:L16 | neighbors=[permisos.ts]
- "agente_infracciones_permisos_permisoseccion": "PermisoSeccion" | kind=code-symbol | source=lib/agente_infracciones/permisos.ts:L6 | neighbors=[permisos.ts]
- "agente_infracciones_permisos_seccion": "Seccion" | kind=code-symbol | source=lib/agente_infracciones/permisos.ts:L4 | neighbors=[permisos.ts]
- "agente_infracciones_permisos_secciones": "SECCIONES" | kind=code-symbol | source=lib/agente_infracciones/permisos.ts:L3 | neighbors=[permisos.ts]
- "agente_infracciones_permisos_tienepermiso": "tienePermiso()" | kind=code-symbol | source=lib/agente_infracciones/permisos.ts:L8 | neighbors=[permisos.ts]
- "agente_infracciones_profiledropdown_props": "Props" | kind=code-symbol | source=components/agente_infracciones/ProfileDropdown.tsx:L8 | neighbors=[ProfileDropdown.tsx]
- "agente_infracciones_repository_infraccionupdaterow": "InfraccionUpdateRow" | kind=code-symbol | source=lib/agente_infracciones/repository.ts:L39 | neighbors=[repository.ts]
- "agente_infracciones_service_sa7_url": "SA7_URL" | kind=code-symbol | source=lib/agente_infracciones/service.ts:L6 | neighbors=[service.ts]
- "agente_infracciones_storecapturainfractor_capturainfractoractions": "CapturaInfractorActions" | kind=code-symbol | source=lib/agente_infracciones/storeCapturaInfractor.ts:L20 | neighbors=[storeCapturaInfractor.ts]
- "agente_infracciones_storecapturainfractor_capturainfractorstate": "CapturaInfractorState" | kind=code-symbol | source=lib/agente_infracciones/storeCapturaInfractor.ts:L5 | neighbors=[storeCapturaInfractor.ts]
- "agente_infracciones_storecapturainfractor_capturainfractorstore": "CapturaInfractorStore" | kind=code-symbol | source=lib/agente_infracciones/storeCapturaInfractor.ts:L36 | neighbors=[storeCapturaInfractor.ts]
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

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/cesarbr/Documents/dev/sjr/seguridad_publica/.graphify/description-instructions/batch-054.json

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
