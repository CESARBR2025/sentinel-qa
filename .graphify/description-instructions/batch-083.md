# Node Description Batch 84 of 87

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

- "shared_detalleinfraccionview_timelinenode": "TimelineNode()" | kind=code-symbol | source=components/shared/DetalleInfraccionView.tsx:L731 | neighbors=[DetalleInfraccionView.tsx]
- "shared_direcciongooglemaps_props": "Props" | kind=code-symbol | source=components/shared/DireccionGoogleMaps.tsx:L13 | neighbors=[DireccionGoogleMaps.tsx]
- "shared_infracciones_bool": "bool()" | kind=code-symbol | source=lib/shared/infracciones.ts:L48 | neighbors=[infracciones.ts]
- "shared_infracciones_num": "num()" | kind=code-symbol | source=lib/shared/infracciones.ts:L55 | neighbors=[infracciones.ts]
- "shared_infracciones_str": "str()" | kind=code-symbol | source=lib/shared/infracciones.ts:L43 | neighbors=[infracciones.ts]
- "shared_infracciones_viainfracciongarantia": "ViaInfraccionGarantia" | kind=code-symbol | source=lib/shared/infracciones.ts:L114 | neighbors=[infracciones.ts]
- "shared_infracciones_viainfraccionheader": "ViaInfraccionHeader" | kind=code-symbol | source=lib/shared/infracciones.ts:L63 | neighbors=[infracciones.ts]
- "shared_infracciones_viainfraccioninfractor": "ViaInfraccionInfractor" | kind=code-symbol | source=lib/shared/infracciones.ts:L90 | neighbors=[infracciones.ts]
- "shared_infracciones_viainfraccionlegal": "ViaInfraccionLegal" | kind=code-symbol | source=lib/shared/infracciones.ts:L80 | neighbors=[infracciones.ts]
- "shared_infracciones_viainfraccionoficial": "ViaInfraccionOficial" | kind=code-symbol | source=lib/shared/infracciones.ts:L98 | neighbors=[infracciones.ts]
- "shared_infracciones_viainfraccionubicacion": "ViaInfraccionUbicacion" | kind=code-symbol | source=lib/shared/infracciones.ts:L118 | neighbors=[infracciones.ts]
- "shared_infracciones_viainfraccionvehiculo": "ViaInfraccionVehiculo" | kind=code-symbol | source=lib/shared/infracciones.ts:L105 | neighbors=[infracciones.ts]
- "shared_pedirevidenciasmodal_evidenciaitem": "EvidenciaItem" | kind=code-symbol | source=components/shared/PedirEvidenciasModal.tsx:L18 | neighbors=[PedirEvidenciasModal.tsx]
- "shared_pedirevidenciasmodal_existingevidencia": "ExistingEvidencia" | kind=code-symbol | source=components/shared/PedirEvidenciasModal.tsx:L7 | neighbors=[PedirEvidenciasModal.tsx]
- "shared_pedirevidenciasmodal_inputsx": "inputSx" | kind=code-symbol | source=components/shared/PedirEvidenciasModal.tsx:L30 | neighbors=[PedirEvidenciasModal.tsx]
- "shared_pedirevidenciasmodal_readonlysx": "readOnlySx" | kind=code-symbol | source=components/shared/PedirEvidenciasModal.tsx:L41 | neighbors=[PedirEvidenciasModal.tsx]
- "sin_robos_page_reporteslimpiospage": "ReportesLimpiosPage()" | kind=code-symbol | source=app/sin_robos/page.tsx:L13 | neighbors=[page.tsx]
- "sin_robos_paginacionsinrobos_paginationbuttonstyle": "paginationButtonStyle" | kind=code-symbol | source=components/reportes/sin_robos/PaginacionSinRobos.tsx:L89 | neighbors=[PaginacionSinRobos.tsx]
- "sin_robos_paginacionsinrobos_paginationprops": "PaginationProps" | kind=code-symbol | source=components/reportes/sin_robos/PaginacionSinRobos.tsx:L5 | neighbors=[PaginacionSinRobos.tsx]
- "solicitudes_page_solicitudespage": "SolicitudesPage()" | kind=code-symbol | source=app/monitorista/solicitudes/page.tsx:L13 | neighbors=[page.tsx]
- "solicitudes_page_statcard": "StatCard()" | kind=code-symbol | source=app/monitorista/solicitudes/page.tsx:L86 | neighbors=[page.tsx]
- "solicitudes_route_get": "GET()" | kind=code-symbol | source=app/api/prevencion/solicitudes/route.ts:L8 | neighbors=[route.ts]
- "solicitudes_route_post": "POST()" | kind=code-symbol | source=app/api/prevencion/solicitudes/route.ts:L22 | neighbors=[route.ts]
- "solicitudes_solicitudes_client_estatusbg": "estatusBg()" | kind=code-symbol | source=app/corralon/solicitudes/solicitudes-client.tsx:L344 | neighbors=[solicitudes-client.tsx]
- "solicitudes_solicitudes_client_estatuscolor": "estatusColor()" | kind=code-symbol | source=app/corralon/solicitudes/solicitudes-client.tsx:L351 | neighbors=[solicitudes-client.tsx]
- "solicitudes_solicitudes_client_estatuslabels": "estatusLabels" | kind=code-symbol | source=app/corralon/solicitudes/solicitudes-client.tsx:L8 | neighbors=[solicitudes-client.tsx]
- "solicitudes_solicitudes_client_formatdate": "formatDate()" | kind=code-symbol | source=app/corralon/solicitudes/solicitudes-client.tsx:L18 | neighbors=[solicitudes-client.tsx]
- "solicitudes_solicitudes_client_tdstyle": "tdStyle" | kind=code-symbol | source=app/corralon/solicitudes/solicitudes-client.tsx:L369 | neighbors=[solicitudes-client.tsx]
- "solicitudes_solicitudes_client_thstyle": "thStyle" | kind=code-symbol | source=app/corralon/solicitudes/solicitudes-client.tsx:L358 | neighbors=[solicitudes-client.tsx]
- "solicitudes_subir_oficio_modal_props": "Props" | kind=code-symbol | source=app/corralon/solicitudes/subir-oficio-modal.tsx:L6 | neighbors=[subir-oficio-modal.tsx]
- "solicitudes_ver_documento_modal_props": "Props" | kind=code-symbol | source=app/corralon/solicitudes/ver-documento-modal.tsx:L5 | neighbors=[ver-documento-modal.tsx]
- "solicitudid_page_aseguradosfiscaliapage": "AseguradosFiscaliaPage()" | kind=code-symbol | source=app/fiscalia/solicitudes/[solicitudId]/page.tsx:L11 | neighbors=[page.tsx]
- "solicitudid_page_aseguradospage": "AseguradosPage()" | kind=code-symbol | source=app/agente_juzgado/solicitudes/[solicitudId]/page.tsx:L11 | neighbors=[page.tsx]
- "steps_pasociudadano_pasociudadano": "PasoCiudadano()" | kind=code-symbol | source=features/via/infracciones/components/steps/PasoCiudadano.tsx:L16 | neighbors=[PasoCiudadano.tsx]
- "steps_pasociudadano_props": "Props" | kind=code-symbol | source=features/via/infracciones/components/steps/PasoCiudadano.tsx:L11 | neighbors=[PasoCiudadano.tsx]
- "steps_pasociudadanoconductor_pasociudadanoconductor": "PasoCiudadanoConductor()" | kind=code-symbol | source=features/via/infracciones/components/steps/PasoCiudadanoConductor.tsx:L14 | neighbors=[PasoCiudadanoConductor.tsx]
- "steps_pasociudadanoconductor_props": "Props" | kind=code-symbol | source=features/via/infracciones/components/steps/PasoCiudadanoConductor.tsx:L6 | neighbors=[PasoCiudadanoConductor.tsx]
- "steps_pasoconductor_pasoconductor": "PasoConductor()" | kind=code-symbol | source=features/via/infracciones/components/steps/PasoConductor.tsx:L21 | neighbors=[PasoConductor.tsx]
- "steps_pasoconductor_props": "Props" | kind=code-symbol | source=features/via/infracciones/components/steps/PasoConductor.tsx:L13 | neighbors=[PasoConductor.tsx]
- "steps_pasoconfirmacion_pasoconfirmacion": "PasoConfirmacion()" | kind=code-symbol | source=features/via/infracciones/components/steps/PasoConfirmacion.tsx:L27 | neighbors=[PasoConfirmacion.tsx]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/cesarbr/Documents/dev/sjr/seguridad_publica/.graphify/description-instructions/batch-083.json

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
