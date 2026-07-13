# Node Description Batch 30 of 84

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

- "monitorista_repository_actualizarestadosolicitud": "actualizarEstadoSolicitud()" | kind=code-symbol | source=lib/monitorista/repository.ts:L117 | neighbors=[route.ts, actions.ts, repository.ts]
- "monitorista_repository_crearsolicitudevidencia": "crearSolicitudEvidencia()" | kind=code-symbol | source=lib/monitorista/repository.ts:L155 | neighbors=[actions.ts, repository.ts, route.ts]
- "monitorista_repository_getrolusuario": "getRolUsuario()" | kind=code-symbol | source=lib/monitorista/repository.ts:L601 | neighbors=[actions.ts, repository.ts, route.ts]
- "monitorista_repository_insertarevidencia": "insertarEvidencia()" | kind=code-symbol | source=lib/monitorista/repository.ts:L223 | neighbors=[actions.ts, repository.ts, route.ts]
- "monitorista_repository_obtenersolicitudfolioincidente": "obtenerSolicitudFolioIncidente()" | kind=code-symbol | source=lib/monitorista/repository.ts:L178 | neighbors=[actions.ts, repository.ts, route.ts]
- "monitorista_service_actualizarregistro": "actualizarRegistro()" | kind=code-symbol | source=lib/monitorista/service.ts:L179 | neighbors=[incidentes-camara-service.ts, service.ts, camelToSnake()]
- "monitorista_service_listarreportescondetenidos": "listarReportesConDetenidos()" | kind=code-symbol | source=lib/monitorista/service.ts:L90 | neighbors=[detenido-service.ts, service.ts, parseDetenidos()]
- "monitorista_service_obtenerreporteporid": "obtenerReportePorId()" | kind=code-symbol | source=lib/monitorista/service.ts:L117 | neighbors=[page.tsx, detenido-service.ts, service.ts]
- "monitorista_service_subirevidenciadenuncia": "subirEvidenciaDenuncia()" | kind=code-symbol | source=lib/monitorista/service.ts:L51 | neighbors=[denuncia-service.ts, service.ts, solicitudIdToUuid()]
- "monitorista_subirfotodetenido_subirfotodetenido": "SubirFotoDetenido()" | kind=code-symbol | source=components/monitorista/SubirFotoDetenido.tsx:L31 | neighbors=[page.tsx, CardEnvioFoto.tsx, SubirFotoDetenido.tsx]
- "monitorista_types_evidencia": "Evidencia" | kind=code-symbol | source=lib/monitorista/types.ts:L22 | neighbors=[mapper.ts, repository.ts, types.ts]
- "monitorista_types_evidenciadetenido": "EvidenciaDetenido" | kind=code-symbol | source=lib/monitorista/types.ts:L140 | neighbors=[mapper.ts, repository.ts, types.ts]
- "monitorista_types_iphdetenido": "IphDetenido" | kind=code-symbol | source=lib/monitorista/types.ts:L131 | neighbors=[mapper.ts, repository.ts, types.ts]
- "monitorista_types_prellenadocompleto": "PrellenadoCompleto" | kind=code-symbol | source=lib/monitorista/types.ts:L149 | neighbors=[mapper.ts, repository.ts, types.ts]
- "notificaciones_repository_listarnotificacionesnoleidas": "listarNotificacionesNoLeidas()" | kind=code-symbol | source=lib/notificaciones/repository.ts:L5 | neighbors=[repository.ts, route.ts, layout.tsx]
- "notificaciones_types_notificacion": "Notificacion" | kind=code-symbol | source=lib/notificaciones/types.ts:L1 | neighbors=[mapper.ts, repository.ts, types.ts]
- "oficial_formulariorecorrido_formulariorecorrido": "FormularioRecorrido()" | kind=code-symbol | source=components/oficial/FormularioRecorrido.tsx:L64 | neighbors=[page.tsx, page.tsx, FormularioRecorrido.tsx]
- "oficial_mapper_rowtod1": "rowToD1()" | kind=code-symbol | source=lib/oficial/mapper.ts:L113 | neighbors=[mapper.ts, toStr(), rowToReporteDetalle()]
- "oficial_mapper_rowtodespachoasignado": "rowToDespachoAsignado()" | kind=code-symbol | source=lib/oficial/mapper.ts:L93 | neighbors=[mapper.ts, toStr(), repository.ts]
- "oficial_mapper_rowtoreporteresumen": "rowToReporteResumen()" | kind=code-symbol | source=lib/oficial/mapper.ts:L75 | neighbors=[mapper.ts, toStr(), repository.ts]
- "oficial_service_generarfoliounico": "generarFolioUnico()" | kind=code-symbol | source=lib/oficial/service.ts:L54 | neighbors=[service.ts, crearReporte(), generarFolio()]
- "oficial_service_listardespachosasignados": "listarDespachosAsignados()" | kind=code-symbol | source=lib/oficial/service.ts:L210 | neighbors=[page.tsx, page.tsx, service.ts]
- "oficial_service_obtenermiperfil": "obtenerMiPerfil()" | kind=code-symbol | source=lib/oficial/service.ts:L79 | neighbors=[page.tsx, service.ts, page.tsx]
- "oficial_store_useoficialformstore": "useOficialFormStore" | kind=code-symbol | source=lib/oficial/store.ts:L137 | neighbors=[FormularioD1.tsx, FormularioRecorrido.tsx, store.ts]
- "oficial_types_catalogoitem": "CatalogoItem" | kind=code-symbol | source=lib/oficial/types.ts:L193 | neighbors=[repository.ts, service.ts, types.ts]
- "oficial_types_crearreportecampoinput": "CrearReporteCampoInput" | kind=code-symbol | source=lib/oficial/types.ts:L79 | neighbors=[repository.ts, service.ts, types.ts]
- "oficial_types_ofireportecampo": "OfiReporteCampo" | kind=code-symbol | source=lib/oficial/types.ts:L40 | neighbors=[mapper.ts, types.ts, OfiReporteDetalle]
- "permisos_core_guardarpermiso": "guardarPermiso()" | kind=code-symbol | source=lib/permisos/core.ts:L78 | neighbors=[core.ts, aplicarPlantillaRol(), guardarPermisosSeccionesAction()]
- "permisos_core_mapadefault": "mapaDefault()" | kind=code-symbol | source=lib/permisos/core.ts:L24 | neighbors=[core.ts, obtenerPermisosUsuario(), obtenerPlantillaRol()]
- "permisos_core_obtenerplantillarol": "obtenerPlantillaRol()" | kind=code-symbol | source=lib/permisos/core.ts:L92 | neighbors=[core.ts, mapaDefault(), page.tsx]
- "permisos_core_requireadmin": "requireAdmin()" | kind=code-symbol | source=lib/permisos/core.ts:L149 | neighbors=[core.ts, guardarPermisosSeccionesAction(), guardarPlantillaSeccionesAction()]
- "prevencion_actions_addautoridadmedida": "addAutoridadMedida()" | kind=code-symbol | source=lib/prevencion/actions.ts:L72 | neighbors=[actions.ts, requireAcceso(), AgregarAutoridadForm.tsx]
- "prevencion_actions_cancelarficha": "cancelarFicha()" | kind=code-symbol | source=lib/prevencion/actions.ts:L188 | neighbors=[actions.ts, requireAcceso(), CancelacionModal.tsx]
- "prevencion_actions_createcontestacion": "createContestacion()" | kind=code-symbol | source=lib/prevencion/actions.ts:L256 | neighbors=[actions.ts, requireAcceso(), ContestacionForm.tsx]
- "prevencion_actions_createficha": "createFicha()" | kind=code-symbol | source=lib/prevencion/actions.ts:L130 | neighbors=[page.tsx, actions.ts, requireAcceso()]
- "prevencion_actions_createmedida": "createMedida()" | kind=code-symbol | source=lib/prevencion/actions.ts:L21 | neighbors=[page.tsx, actions.ts, requireAcceso()]
- "prevencion_actions_createprorroga": "createProrroga()" | kind=code-symbol | source=lib/prevencion/actions.ts:L89 | neighbors=[actions.ts, requireAcceso(), ProrrogaModal.tsx]
- "prevencion_actions_createseguimiento": "createSeguimiento()" | kind=code-symbol | source=lib/prevencion/actions.ts:L162 | neighbors=[actions.ts, requireAcceso(), SeguimientoTimeline.tsx]
- "prevencion_actions_createsolicitud": "createSolicitud()" | kind=code-symbol | source=lib/prevencion/actions.ts:L209 | neighbors=[page.tsx, actions.ts, requireAcceso()]
- "prevencion_actions_createsolicitudc4": "createSolicitudC4()" | kind=code-symbol | source=lib/prevencion/actions.ts:L238 | neighbors=[actions.ts, requireAcceso(), SolicitudC4Form.tsx]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/cesarbr/Documents/dev/sjr/seguridad_publica/.graphify/description-instructions/batch-029.json

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
