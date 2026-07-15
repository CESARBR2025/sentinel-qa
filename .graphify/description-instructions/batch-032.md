# Node Description Batch 33 of 93

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

- "notificaciones_types_notificacion": "Notificacion" | kind=code-symbol | source=lib/notificaciones/types.ts:L1 | neighbors=[mapper.ts, repository.ts, types.ts]
- "oficial_mapper_rowtod1": "rowToD1()" | kind=code-symbol | source=lib/oficial/mapper.ts:L113 | neighbors=[mapper.ts, toStr(), rowToReporteDetalle()]
- "oficial_mapper_rowtodespachoasignado": "rowToDespachoAsignado()" | kind=code-symbol | source=lib/oficial/mapper.ts:L93 | neighbors=[mapper.ts, toStr(), repository.ts]
- "oficial_mapper_rowtoreportecampoparad1": "rowToReporteCampoParaD1()" | kind=code-symbol | source=lib/oficial/mapper.ts:L137 | neighbors=[mapper.ts, toStr(), repository.ts]
- "oficial_mapper_rowtoreporteresumen": "rowToReporteResumen()" | kind=code-symbol | source=lib/oficial/mapper.ts:L75 | neighbors=[mapper.ts, toStr(), repository.ts]
- "oficial_mapper_rowtorondinoficialresumen": "rowToRondinOficialResumen()" | kind=code-symbol | source=lib/oficial/mapper.ts:L156 | neighbors=[mapper.ts, toStr(), repository.ts]
- "oficial_marcarensitiobutton_marcarensitiobutton": "MarcarEnSitioButton()" | kind=code-symbol | source=components/oficial/MarcarEnSitioButton.tsx:L13 | neighbors=[DespachoContent.tsx, MarcarEnSitioButton.tsx, page.tsx]
- "oficial_repository_obtenerreportecamposimple": "obtenerReporteCampoSimple()" | kind=code-symbol | source=lib/oficial/repository.ts:L402 | neighbors=[page.tsx, repository.ts, route.ts]
- "oficial_service_generarfoliounico": "generarFolioUnico()" | kind=code-symbol | source=lib/oficial/service.ts:L59 | neighbors=[service.ts, crearReporte(), generarFolio()]
- "oficial_service_listardespachosasignados": "listarDespachosAsignados()" | kind=code-symbol | source=lib/oficial/service.ts:L215 | neighbors=[page.tsx, page.tsx, service.ts]
- "oficial_service_obtenermiperfil": "obtenerMiPerfil()" | kind=code-symbol | source=lib/oficial/service.ts:L84 | neighbors=[page.tsx, service.ts, page.tsx]
- "oficial_store_useoficialformstore": "useOficialFormStore" | kind=code-symbol | source=lib/oficial/store.ts:L137 | neighbors=[FormularioD1.tsx, FormularioRecorrido.tsx, store.ts]
- "oficial_types_crearreportecampoinput": "CrearReporteCampoInput" | kind=code-symbol | source=lib/oficial/types.ts:L79 | neighbors=[repository.ts, service.ts, types.ts]
- "oficial_types_ofireportecampo": "OfiReporteCampo" | kind=code-symbol | source=lib/oficial/types.ts:L40 | neighbors=[mapper.ts, types.ts, OfiReporteDetalle]
- "permisos_core_guardarpermiso": "guardarPermiso()" | kind=code-symbol | source=lib/permisos/core.ts:L84 | neighbors=[core.ts, aplicarPlantillaRol(), guardarPermisosSeccionesAction()]
- "permisos_core_mapadefault": "mapaDefault()" | kind=code-symbol | source=lib/permisos/core.ts:L26 | neighbors=[core.ts, obtenerPermisosUsuario(), obtenerPlantillaRol()]
- "permisos_core_obtenerplantillarol": "obtenerPlantillaRol()" | kind=code-symbol | source=lib/permisos/core.ts:L98 | neighbors=[core.ts, mapaDefault(), page.tsx]
- "permisos_core_requireadmin": "requireAdmin()" | kind=code-symbol | source=lib/permisos/core.ts:L155 | neighbors=[core.ts, guardarPermisosSeccionesAction(), guardarPlantillaSeccionesAction()]
- "plugins_context_loader_cachekey": "cacheKey()" | kind=code-symbol | source=.opencode/plugins/context-loader.js:L70 | neighbors=[context-loader.js, cacheGet(), cacheSet()]
- "plugins_context_loader_isgraphifyavailable": "isGraphifyAvailable()" | kind=code-symbol | source=.opencode/plugins/context-loader.js:L99 | neighbors=[context-loader.js, graphifyQuery(), graphifySummary()]
- "prevencion_actions_addautoridadmedida": "addAutoridadMedida()" | kind=code-symbol | source=lib/prevencion/actions.ts:L72 | neighbors=[actions.ts, requireAcceso(), AgregarAutoridadForm.tsx]
- "prevencion_actions_cancelarficha": "cancelarFicha()" | kind=code-symbol | source=lib/prevencion/actions.ts:L188 | neighbors=[actions.ts, requireAcceso(), CancelacionModal.tsx]
- "prevencion_actions_createcontestacion": "createContestacion()" | kind=code-symbol | source=lib/prevencion/actions.ts:L256 | neighbors=[actions.ts, requireAcceso(), ContestacionForm.tsx]
- "prevencion_actions_createficha": "createFicha()" | kind=code-symbol | source=lib/prevencion/actions.ts:L130 | neighbors=[page.tsx, actions.ts, requireAcceso()]
- "prevencion_actions_createmedida": "createMedida()" | kind=code-symbol | source=lib/prevencion/actions.ts:L21 | neighbors=[page.tsx, actions.ts, requireAcceso()]
- "prevencion_actions_createprorroga": "createProrroga()" | kind=code-symbol | source=lib/prevencion/actions.ts:L89 | neighbors=[actions.ts, requireAcceso(), ProrrogaModal.tsx]
- "prevencion_actions_createseguimiento": "createSeguimiento()" | kind=code-symbol | source=lib/prevencion/actions.ts:L162 | neighbors=[actions.ts, requireAcceso(), SeguimientoTimeline.tsx]
- "prevencion_actions_createsolicitud": "createSolicitud()" | kind=code-symbol | source=lib/prevencion/actions.ts:L209 | neighbors=[page.tsx, actions.ts, requireAcceso()]
- "prevencion_actions_createsolicitudc4": "createSolicitudC4()" | kind=code-symbol | source=lib/prevencion/actions.ts:L238 | neighbors=[actions.ts, requireAcceso(), SolicitudC4Form.tsx]
- "prevencion_actions_createvisita": "createVisita()" | kind=code-symbol | source=lib/prevencion/actions.ts:L53 | neighbors=[actions.ts, requireAcceso(), VisitaModal.tsx]
- "prevencion_mapper_rowtoautoridadadicional": "rowToAutoridadAdicional()" | kind=code-symbol | source=lib/prevencion/mapper.ts:L154 | neighbors=[mapper.ts, toStr(), repository.ts]
- "prevencion_mapper_rowtocontestacion": "rowToContestacion()" | kind=code-symbol | source=lib/prevencion/mapper.ts:L127 | neighbors=[mapper.ts, toStr(), repository.ts]
- "prevencion_mapper_rowtofichabusquedadetalle": "rowToFichaBusquedaDetalle()" | kind=code-symbol | source=lib/prevencion/mapper.ts:L84 | neighbors=[mapper.ts, toStr(), repository.ts]
- "prevencion_mapper_rowtoseguimiento": "rowToSeguimiento()" | kind=code-symbol | source=lib/prevencion/mapper.ts:L104 | neighbors=[mapper.ts, toStr(), repository.ts]
- "prevencion_mapper_rowtosolicitud": "rowToSolicitud()" | kind=code-symbol | source=lib/prevencion/mapper.ts:L40 | neighbors=[mapper.ts, toStr(), repository.ts]
- "prevencion_mapper_rowtosolicitudc4": "rowToSolicitudC4()" | kind=code-symbol | source=lib/prevencion/mapper.ts:L116 | neighbors=[mapper.ts, toStr(), repository.ts]
- "prevencion_mapper_tobool": "toBool()" | kind=code-symbol | source=lib/prevencion/mapper.ts:L9 | neighbors=[mapper.ts, rowToMedidaDetalle(), rowToVisita()]
- "prevencion_permisos_seccion": "Seccion" | kind=code-symbol | source=lib/prevencion/permisos.ts:L5 | neighbors=[registro.ts, actions.ts, permisos.ts]
- "prevencion_printbutton": "PrintButton.tsx" | kind=code-symbol | source=components/prevencion/PrintButton.tsx:L1 | neighbors=[5558751 feat: módulo Prevención del Del…, page.tsx, PrintButton()]
- "prevencion_repository_obtenerfichabusqueda": "obtenerFichaBusqueda()" | kind=code-symbol | source=lib/prevencion/repository.ts:L101 | neighbors=[page.tsx, page.tsx, repository.ts]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/ugomez/Documents/GitHub/seguridad_publica/.graphify/description-instructions/batch-032.json

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
