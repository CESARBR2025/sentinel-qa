# Node Description Batch 56 of 93

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

- "shared_detalleinfraccionview_oficialsection": "OficialSection()" | kind=code-symbol | source=components/shared/DetalleInfraccionView.tsx:L617 | neighbors=[DetalleInfraccionView.tsx, sanitize()]
- "shared_infracciones_concatname": "concatName()" | kind=code-symbol | source=lib/shared/infracciones.ts:L152 | neighbors=[infracciones.ts, rowToInfraccionDetalle()]
- "shared_infracciones_parseevidencias": "parseEvidencias()" | kind=code-symbol | source=lib/shared/infracciones.ts:L138 | neighbors=[infracciones.ts, rowToInfraccionDetalle()]
- "shared_pedirevidenciasmodal_emptyitem": "emptyItem()" | kind=code-symbol | source=components/shared/PedirEvidenciasModal.tsx:L26 | neighbors=[PedirEvidenciasModal.tsx, SharedPedirEvidenciasBoton()]
- "sin_robos_paginacionsinrobos_paginacionsinrobos": "PaginacionSinRobos()" | kind=code-symbol | source=components/reportes/sin_robos/PaginacionSinRobos.tsx:L12 | neighbors=[PaginacionSinRobos.tsx, ReporteSinRobos.tsx]
- "sin_robos_reportesinrobos_tablareporteslimpios": "TablaReportesLimpios()" | kind=code-symbol | source=components/reportes/sin_robos/ReporteSinRobos.tsx:L7 | neighbors=[page.tsx, ReporteSinRobos.tsx]
- "sin_robos_reportfilters_reportfilters": "ReportFilters()" | kind=code-symbol | source=components/reportes/sin_robos/ReportFilters.tsx:L7 | neighbors=[page.tsx, ReportFilters.tsx]
- "solicitudes_solicitudes_client_solicitudesclient": "SolicitudesClient()" | kind=code-symbol | source=app/corralon/solicitudes/solicitudes-client.tsx:L27 | neighbors=[page.tsx, solicitudes-client.tsx]
- "solicitudes_subir_oficio_modal_subiroficiomodal": "SubirOficioModal()" | kind=code-symbol | source=app/corralon/solicitudes/subir-oficio-modal.tsx:L12 | neighbors=[solicitudes-client.tsx, subir-oficio-modal.tsx]
- "solicitudes_ver_documento_modal_getextension": "getExtension()" | kind=code-symbol | source=app/corralon/solicitudes/ver-documento-modal.tsx:L11 | neighbors=[ver-documento-modal.tsx, VerDocumentoModal()]
- "solicitudes_ver_documento_modal_verdocumentomodal": "VerDocumentoModal()" | kind=code-symbol | source=app/corralon/solicitudes/ver-documento-modal.tsx:L17 | neighbors=[ver-documento-modal.tsx, getExtension()]
- "steps_pasoevidencias_pasoevidencias": "PasoEvidencias()" | kind=code-symbol | source=features/via/infracciones/components/steps/PasoEvidencias.tsx:L12 | neighbors=[PasoEvidencias.tsx, PasoUbicacionEvidencias.tsx]
- "steps_procesomodal_getstepindex": "getStepIndex()" | kind=code-symbol | source=features/via/infracciones/components/steps/ProcesoModal.tsx:L76 | neighbors=[ProcesoModal.tsx, ProcesoModal()]
- "steps_secciongarantia_secciongarantia": "SeccionGarantia()" | kind=code-symbol | source=features/via/infracciones/components/steps/SeccionGarantia.tsx:L24 | neighbors=[PasoInfraccion.tsx, SeccionGarantia.tsx]
- "steps_seccionmotivo_seccionmotivo": "SeccionMotivo()" | kind=code-symbol | source=features/via/infracciones/components/steps/SeccionMotivo.tsx:L33 | neighbors=[PasoInfraccion.tsx, SeccionMotivo.tsx]
- "stores_useinfraccionstore_datosinfraccion": "DatosInfraccion" | kind=code-symbol | source=stores/useInfraccionStore.ts:L3 | neighbors=[constants.ts, useInfraccionStore.ts]
- "stores_userondinformstore_userondinformstore": "useRondinFormStore" | kind=code-symbol | source=stores/useRondinFormStore.ts:L17 | neighbors=[FormRondinEscalado.tsx, useRondinFormStore.ts]
- "subir_archivo_route_mapearestatusfinal": "mapearEstatusFinal()" | kind=code-symbol | source=app/api/corralon/subir-archivo/route.ts:L8 | neighbors=[route.ts, POST()]
- "subir_archivo_route_post": "POST()" | kind=code-symbol | source=app/api/via/ciudadano/subir-archivo/route.ts:L6 | neighbors=[route.ts, mapearEstatusFinal()]
- "subir_route_detectarmime": "detectarMime()" | kind=code-symbol | source=app/api/monitorista/denuncias/subir/route.ts:L6 | neighbors=[route.ts, POST()]
- "subir_route_post": "POST()" | kind=code-symbol | source=app/api/monitorista/evidencias/subir/route.ts:L7 | neighbors=[route.ts, detectarMime()]
- "templates_asignacion_fiscalia_enviarcorreoasignacionfiscaliaparams": "EnviarCorreoAsignacionFiscaliaParams" | kind=code-symbol | source=lib/emails/templates/asignacion-fiscalia.ts:L3 | neighbors=[server.ts, asignacion-fiscalia.ts]
- "templates_asignacion_fiscalia_templateasignacionfiscalia": "templateAsignacionFiscalia()" | kind=code-symbol | source=lib/emails/templates/asignacion-fiscalia.ts:L11 | neighbors=[server.ts, asignacion-fiscalia.ts]
- "templates_orden_liberacion_enviarcorreoordenliberacionparams": "EnviarCorreoOrdenLiberacionParams" | kind=code-symbol | source=lib/emails/templates/orden-liberacion.ts:L3 | neighbors=[server.ts, orden-liberacion.ts]
- "templates_orden_liberacion_templateordenliberacion": "templateOrdenLiberacion()" | kind=code-symbol | source=lib/emails/templates/orden-liberacion.ts:L11 | neighbors=[server.ts, orden-liberacion.ts]
- "ui_customselect_customselect": "CustomSelect()" | kind=code-symbol | source=features/via/infracciones/components/ui/CustomSelect.tsx:L20 | neighbors=[SeccionMotivo.tsx, CustomSelect.tsx]
- "ui_selectwrapper_selectwrapper": "SelectWrapper()" | kind=code-symbol | source=features/via/infracciones/components/ui/SelectWrapper.tsx:L3 | neighbors=[SeccionGarantia.tsx, SelectWrapper.tsx]
- "ui_toast_toasttipo": "ToastTipo" | kind=code-symbol | source=components/ui/Toast.tsx:L6 | neighbors=[Toast.tsx, ToastAuto.tsx]
- "utils_generateppt_generatedetenidoppt": "generateDetenidoPPT()" | kind=code-symbol | source=lib/utils/generatePPT.ts:L4 | neighbors=[generarPresentacion.tsx, generatePPT.ts]
- "via_online_useonlinestatus": "useOnlineStatus()" | kind=code-symbol | source=lib/via/online.ts:L16 | neighbors=[FormularioInfraccion.tsx, online.ts]
- "via_pagos_confirmarpago": "confirmarPago()" | kind=code-symbol | source=lib/via/pagos.ts:L6 | neighbors=[route.ts, pagos.ts]
- "wireframes_wf_a": "wf-a.jsx" | kind=code-symbol | source=login-desing/wireframes/wf-a.jsx:L1 | neighbors=[6a042cd feat: sistema de autenticación,…, WireframeA()]
- "wireframes_wf_b": "wf-b.jsx" | kind=code-symbol | source=login-desing/wireframes/wf-b.jsx:L1 | neighbors=[6a042cd feat: sistema de autenticación,…, WireframeB()]
- "wireframes_wf_d": "wf-d.jsx" | kind=code-symbol | source=login-desing/wireframes/wf-d.jsx:L1 | neighbors=[6a042cd feat: sistema de autenticación,…, WireframeD()]
- "wireframes_wf_e": "wf-e.jsx" | kind=code-symbol | source=login-desing/wireframes/wf-e.jsx:L1 | neighbors=[6a042cd feat: sistema de autenticación,…, WireframeE()]
- "2fa_page_twofactorpage": "TwoFactorPage()" | kind=code-symbol | source=app/(auth)/login/2fa/page.tsx:L6 | neighbors=[page.tsx]
- "911_filtrosincidentes_btnbuscarstyle": "btnBuscarStyle" | kind=code-symbol | source=components/911/FiltrosIncidentes.tsx:L128 | neighbors=[FiltrosIncidentes.tsx]
- "911_filtrosincidentes_btnlimpiarstyle": "btnLimpiarStyle" | kind=code-symbol | source=components/911/FiltrosIncidentes.tsx:L129 | neighbors=[FiltrosIncidentes.tsx]
- "911_filtrosincidentes_canales": "CANALES" | kind=code-symbol | source=components/911/FiltrosIncidentes.tsx:L15 | neighbors=[FiltrosIncidentes.tsx]
- "911_filtrosincidentes_catalogoitem": "CatalogoItem" | kind=code-symbol | source=components/911/FiltrosIncidentes.tsx:L8 | neighbors=[FiltrosIncidentes.tsx]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/ugomez/Documents/GitHub/seguridad_publica/.graphify/description-instructions/batch-055.json

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
