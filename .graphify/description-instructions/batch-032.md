# Node Description Batch 33 of 84

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

- "reportes_operativos_types_detencionofirow": "DetencionOfiRow" | kind=code-symbol | source=lib/reportes-operativos/types.ts:L16 | neighbors=[mapper.ts, service.ts, types.ts]
- "reportes_sin_d1_mapper_rowtosind1": "rowToSinD1()" | kind=code-symbol | source=lib/reportes-sin-d1/mapper.ts:L11 | neighbors=[mapper.ts, toStr(), repository.ts]
- "reportes_sin_d1_service_listarsind1": "listarSinD1()" | kind=code-symbol | source=lib/reportes-sin-d1/service.ts:L6 | neighbors=[page.tsx, route.ts, service.ts]
- "reportes_sin_novedad_mapper_rowtosinnovedad": "rowToSinNovedad()" | kind=code-symbol | source=lib/reportes-sin-novedad/mapper.ts:L11 | neighbors=[mapper.ts, toStr(), repository.ts]
- "reportes_sin_novedad_service_listarreportessinnovedad": "listarReportesSinNovedad()" | kind=code-symbol | source=lib/reportes-sin-novedad/service.ts:L6 | neighbors=[route.ts, service.ts, page.tsx]
- "reportes_types": "types.ts" | kind=code-symbol | source=lib/reportes/types.ts:L1 | neighbors=[ad3ec5f mejorando esto, repository.ts, FormatoNStats]
- "reportes_welcomebanner_sentinelhero": "SentinelHero()" | kind=code-symbol | source=components/reportes/welcomeBanner.tsx:L1 | neighbors=[page.tsx, page.tsx, welcomeBanner.tsx]
- "rol_servicios_catalogos_actions_createbodycam": "createBodyCam()" | kind=code-symbol | source=lib/rol-servicios/catalogos-actions.ts:L63 | neighbors=[catalogos-actions.ts, req(), requireAdmin()]
- "rol_servicios_catalogos_actions_createconcepto": "createConcepto()" | kind=code-symbol | source=lib/rol-servicios/catalogos-actions.ts:L76 | neighbors=[catalogos-actions.ts, req(), requireAdmin()]
- "rol_servicios_catalogos_actions_createmediocanalizacion": "createMedioCanalizacion()" | kind=code-symbol | source=lib/rol-servicios/catalogos-actions.ts:L115 | neighbors=[catalogos-actions.ts, req(), requireAdmin()]
- "rol_servicios_catalogos_actions_createradio": "createRadio()" | kind=code-symbol | source=lib/rol-servicios/catalogos-actions.ts:L50 | neighbors=[catalogos-actions.ts, req(), requireAdmin()]
- "rol_servicios_catalogos_actions_createsector": "createSector()" | kind=code-symbol | source=lib/rol-servicios/catalogos-actions.ts:L37 | neighbors=[catalogos-actions.ts, req(), requireAdmin()]
- "rol_servicios_catalogos_actions_createtipoemergencia": "createTipoEmergencia()" | kind=code-symbol | source=lib/rol-servicios/catalogos-actions.ts:L102 | neighbors=[catalogos-actions.ts, req(), requireAdmin()]
- "rol_servicios_catalogos_actions_createtipoobservacion": "createTipoObservacion()" | kind=code-symbol | source=lib/rol-servicios/catalogos-actions.ts:L89 | neighbors=[catalogos-actions.ts, req(), requireAdmin()]
- "rol_servicios_mapper_rowtobodycam": "rowToBodyCam()" | kind=code-symbol | source=lib/rol-servicios/mapper.ts:L114 | neighbors=[mapper.ts, toBool(), repository.ts]
- "rol_servicios_mapper_rowtomediocanalizacion": "rowToMedioCanalizacion()" | kind=code-symbol | source=lib/rol-servicios/mapper.ts:L152 | neighbors=[mapper.ts, toBool(), repository.ts]
- "rol_servicios_mapper_rowtorolobservacion": "rowToRolObservacion()" | kind=code-symbol | source=lib/rol-servicios/mapper.ts:L86 | neighbors=[mapper.ts, toStr(), repository.ts]
- "rol_servicios_mapper_rowtosector": "rowToSector()" | kind=code-symbol | source=lib/rol-servicios/mapper.ts:L95 | neighbors=[mapper.ts, toBool(), repository.ts]
- "rol_servicios_mapper_rowtotipoemergencia": "rowToTipoEmergencia()" | kind=code-symbol | source=lib/rol-servicios/mapper.ts:L143 | neighbors=[mapper.ts, toBool(), repository.ts]
- "rol_servicios_mapper_rowtotipoobservacion": "rowToTipoObservacion()" | kind=code-symbol | source=lib/rol-servicios/mapper.ts:L134 | neighbors=[mapper.ts, toBool(), repository.ts]
- "rol_servicios_mapper_tonum": "toNum()" | kind=code-symbol | source=lib/rol-servicios/mapper.ts:L12 | neighbors=[mapper.ts, rowToRolAsignacion(), rowToRolServicio()]
- "rol_servicios_repository_getrolbyid": "getRolById()" | kind=code-symbol | source=lib/rol-servicios/repository.ts:L13 | neighbors=[actions.ts, repository.ts, service.ts]
- "rol_servicios_repository_getuserrolename": "getUserRoleName()" | kind=code-symbol | source=lib/rol-servicios/repository.ts:L88 | neighbors=[catalogos-actions.ts, repository.ts, service.ts]
- "rol_servicios_rolinputs_rolfield": "RolField()" | kind=code-symbol | source=components/rol_servicios/RolInputs.tsx:L9 | neighbors=[page.tsx, RolInputs.tsx, RegistroIncidenteForm.tsx]
- "sasiete_mapper_maprowtoordenpago": "mapRowToOrdenPago()" | kind=code-symbol | source=features/via/saSiete/mapper.ts:L23 | neighbors=[mapper.ts, repository.ts, service.ts]
- "sasiete_types_ordenpagosa7": "OrdenPagoSA7" | kind=code-symbol | source=features/via/saSiete/types.ts:L9 | neighbors=[mapper.ts, repository.ts, types.ts]
- "scripts_load_context_buildinstructions": "buildInstructions()" | kind=code-symbol | source=scripts/load-context.mjs:L78 | neighbors=[load-context.mjs, resolvePath(), main()]
- "services_analistaservice_analistaservice": "analistaService" | kind=code-symbol | source=services/analistaService.ts:L2 | neighbors=[formAnalisis.tsx, BitacoraIPH.tsx, analistaService.ts]
- "shared_detalleinfraccionview_timeago": "timeAgo()" | kind=code-symbol | source=components/shared/DetalleInfraccionView.tsx:L126 | neighbors=[DetalleInfraccionView.tsx, SummaryBar(), formatDate()]
- "shared_direcciongooglemaps_direccion": "Direccion" | kind=code-symbol | source=components/shared/DireccionGoogleMaps.tsx:L6 | neighbors=[CapturarDetallesForm.tsx, CapturarDetallesForm.tsx, DireccionGoogleMaps.tsx]
- "shared_direcciongooglemaps_direcciongooglemaps": "DireccionGoogleMaps()" | kind=code-symbol | source=components/shared/DireccionGoogleMaps.tsx:L18 | neighbors=[CapturarDetallesForm.tsx, CapturarDetallesForm.tsx, DireccionGoogleMaps.tsx]
- "shared_infracciones_obtenertokenguest": "obtenerTokenGuest()" | kind=code-symbol | source=lib/shared/infracciones.ts:L5 | neighbors=[service.ts, actions.ts, infracciones.ts]
- "shared_infracciones_viainfracciondetalle": "ViaInfraccionDetalle" | kind=code-symbol | source=lib/shared/infracciones.ts:L128 | neighbors=[types.ts, types.ts, infracciones.ts]
- "steps_procesomodal_procesomodal": "ProcesoModal()" | kind=code-symbol | source=features/via/infracciones/components/steps/ProcesoModal.tsx:L85 | neighbors=[FormularioInfraccion.tsx, ProcesoModal.tsx, getStepIndex()]
- "templates_layout_emaillayout": "emailLayout()" | kind=code-symbol | source=lib/emails/templates/layout.ts:L56 | neighbors=[asignacion-fiscalia.ts, layout.ts, orden-liberacion.ts]
- "templates_layout_emailstyles": "emailStyles" | kind=code-symbol | source=lib/emails/templates/layout.ts:L1 | neighbors=[asignacion-fiscalia.ts, layout.ts, orden-liberacion.ts]
- "templates_layout_inlinestyles": "inlineStyles()" | kind=code-symbol | source=lib/emails/templates/layout.ts:L50 | neighbors=[asignacion-fiscalia.ts, layout.ts, orden-liberacion.ts]
- "types_detalleinfraccion_detallecompleto": "DetalleCompleto" | kind=code-symbol | source=features/via/compartido/types/detalleInfraccion.ts:L61 | neighbors=[CapturarDatosTitularSection.tsx, ModalEntregarGarantia.tsx, detalleInfraccion.ts]
- "via_sa7_consultarestatussa7": "consultarEstatusSA7()" | kind=code-symbol | source=lib/via/sa7.ts:L3 | neighbors=[route.ts, pagos.ts, sa7.ts]
- "whatsapp_formsection": "FormSection.tsx" | kind=code-symbol | source=components/911/whatsapp/FormSection.tsx:L1 | neighbors=[FormSection(), SectionProps, 519716a Formulario para registro de wha…]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/cesarbr/Documents/dev/sjr/seguridad_publica/.graphify/description-instructions/batch-032.json

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
