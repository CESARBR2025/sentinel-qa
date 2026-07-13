# Node Description Batch 24 of 84

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

- "fiscalia_types_viainfracciondetalle": "ViaInfraccionDetalle" | kind=code-symbol | source=lib/fiscalia/types.ts:L281 | neighbors=[actions.ts, FiscaliaDashboard.tsx, mapper.ts, types.ts]
- "flota_mapper_rowtopatrulla": "rowToPatrulla()" | kind=code-symbol | source=lib/flota/mapper.ts:L14 | neighbors=[mapper.ts, toBool(), toStr(), repository.ts]
- "hooks_useincidentes": "useIncidentes.ts" | kind=code-symbol | source=hooks/useIncidentes.ts:L1 | neighbors=[Filtros, IncidenteResumen, useIncidentes(), 6feefe2 BackEnd completo para hacer la …]
- "id_page_fmtdt": "fmtDT()" | kind=code-symbol | source=app/prevencion/juridico/solicitudes/[id]/page.tsx:L16 | neighbors=[page.tsx, FichaDetailPage(), toDate(), SolicitudDetailPage()]
- "id_page_getstatusbadgestyle": "getStatusBadgeStyle()" | kind=code-symbol | source=app/agente_911/whatsapp/incidentes/[id]/page.tsx:L162 | neighbors=[page.tsx, DetalleCiudadanoCompletoPage(), DetalleRondinCompletoPage(), DetalleWhatsAppPage()]
- "incidentes_actions_addpersonaafectada": "addPersonaAfectada()" | kind=code-symbol | source=lib/incidentes/actions.ts:L261 | neighbors=[actions.ts, req(), requireOperador(), validarEnum()]
- "incidentes_actions_createdespacho": "createDespacho()" | kind=code-symbol | source=lib/incidentes/actions.ts:L432 | neighbors=[DespachoForm.tsx, actions.ts, req(), requireOperador()]
- "incidentes_actions_createrecorridocompleto": "createRecorridoCompleto()" | kind=code-symbol | source=lib/incidentes/actions.ts:L365 | neighbors=[actions.ts, num(), requireOperador(), FormSection.tsx]
- "incidentes_actions_createreportecampo": "createReporteCampo()" | kind=code-symbol | source=lib/incidentes/actions.ts:L546 | neighbors=[actions.ts, num(), req(), requireOperador()]
- "incidentes_actions_createrondinescalado": "createRondinEscalado()" | kind=code-symbol | source=lib/incidentes/actions.ts:L316 | neighbors=[actions.ts, req(), requireOperador(), FormRondinEscalado.tsx]
- "incidentes_actions_insertarincidente": "insertarIncidente()" | kind=code-symbol | source=lib/incidentes/actions.ts:L610 | neighbors=[actions.ts, num(), req(), validarEnum()]
- "incidentes_mapper_rowtoalarmaescolar": "rowToAlarmaEscolar()" | kind=code-symbol | source=lib/incidentes/mapper.ts:L156 | neighbors=[mapper.ts, toNum(), toStr(), repository.ts]
- "incidentes_mapper_rowtoincidentecondespachobase": "rowToIncidenteConDespachoBase()" | kind=code-symbol | source=lib/incidentes/mapper.ts:L54 | neighbors=[mapper.ts, toBool(), toStr(), repository.ts]
- "incidentes_mapper_rowtoincidentependiente": "rowToIncidentePendiente()" | kind=code-symbol | source=lib/incidentes/mapper.ts:L76 | neighbors=[mapper.ts, toNum(), toStr(), repository.ts]
- "incidentes_mapper_rowtopersonaafectada": "rowToPersonaAfectada()" | kind=code-symbol | source=lib/incidentes/mapper.ts:L94 | neighbors=[mapper.ts, toNum(), toStr(), repository.ts]
- "incidentes_repository_obtenerdespachodeincidente": "obtenerDespachoDeIncidente()" | kind=code-symbol | source=lib/incidentes/repository.ts:L124 | neighbors=[route.ts, repository.ts, toStr(), service.ts]
- "incidentes_repository_obtenerincidentebasico": "obtenerIncidenteBasico()" | kind=code-symbol | source=lib/incidentes/repository.ts:L116 | neighbors=[route.ts, page.tsx, repository.ts, route.ts]
- "incidentes_types_incidentelistitem": "IncidenteListItem" | kind=code-symbol | source=lib/incidentes/types.ts:L11 | neighbors=[mapper.ts, repository.ts, service.ts, types.ts]
- "legalidad_repository_articulosrepository": "ArticulosRepository" | kind=code-symbol | source=features/via/legalidad/repository.ts:L3 | neighbors=[repository.ts, .obtenerArticulos(), .obtenerFraccionesPorArticulo(), service.ts]
- "manual_migrations_0009_rename_permisos": "0009_rename_permisos.sql" | kind=code-symbol | source=lib/db/manual-migrations/0009_rename_permisos.sql:L1 | neighbors=[27dcb21 Merge branch 'feature/testing' …, 5618308 guardado e evidencias con ed, 77ddf58 Merge branch 'feature/testing' …, f2c66e6 Extender roles y permisos finos…]
- "manual_migrations_0010_permisos_seccion_libre": "0010_permisos_seccion_libre.sql" | kind=code-symbol | source=lib/db/manual-migrations/0010_permisos_seccion_libre.sql:L1 | neighbors=[27dcb21 Merge branch 'feature/testing' …, 5618308 guardado e evidencias con ed, 77ddf58 Merge branch 'feature/testing' …, f2c66e6 Extender roles y permisos finos…]
- "manual_migrations_0012_permisos_eliminar": "0012_permisos_eliminar.sql" | kind=code-symbol | source=lib/db/manual-migrations/0012_permisos_eliminar.sql:L1 | neighbors=[27dcb21 Merge branch 'feature/testing' …, 5618308 guardado e evidencias con ed, 77ddf58 Merge branch 'feature/testing' …, f2c66e6 Extender roles y permisos finos…]
- "monitorista_actions_requiremonitorista": "requireMonitorista()" | kind=code-symbol | source=lib/monitorista/actions.ts:L11 | neighbors=[actions.ts, cancelarSolicitud(), completarSolicitud(), subirEvidencia()]
- "monitorista_mapper_parsesolicitudesjson": "parseSolicitudesJson()" | kind=code-symbol | source=lib/monitorista/mapper.ts:L31 | neighbors=[mapper.ts, rowToDenunciaDetalle(), repository.ts, service.ts]
- "monitorista_ppt_service_generarppt": "generarPpt()" | kind=code-symbol | source=lib/monitorista/ppt-service.ts:L75 | neighbors=[route.ts, ppt-service.ts, getAspectRatio(), parseDetenidos()]
- "monitorista_service_getdestinos": "getDestinos()" | kind=code-symbol | source=lib/monitorista/service.ts:L85 | neighbors=[route.ts, page.tsx, detenido-service.ts, service.ts]
- "monitorista_types_denunciadetalle": "DenunciaDetalle" | kind=code-symbol | source=lib/monitorista/types.ts:L55 | neighbors=[denuncia-service.ts, mapper.ts, service.ts, types.ts]
- "monitorista_types_dependencia": "Dependencia" | kind=code-symbol | source=lib/monitorista/types.ts:L80 | neighbors=[detenido-service.ts, mapper.ts, service.ts, types.ts]
- "monitorista_types_evidenciaarchivo": "EvidenciaArchivo" | kind=code-symbol | source=lib/monitorista/types.ts:L73 | neighbors=[denuncia-service.ts, mapper.ts, service.ts, types.ts]
- "monitorista_types_historialentry": "HistorialEntry" | kind=code-symbol | source=lib/monitorista/types.ts:L31 | neighbors=[page.tsx, mapper.ts, repository.ts, types.ts]
- "monitorista_types_reportedetenido": "ReporteDetenido" | kind=code-symbol | source=lib/monitorista/types.ts:L93 | neighbors=[detenido-service.ts, mapper.ts, service.ts, types.ts]
- "monitorista_types_solicitudevidencia": "SolicitudEvidencia" | kind=code-symbol | source=lib/monitorista/types.ts:L10 | neighbors=[mapper.ts, repository.ts, types.ts, page.tsx]
- "monitorista_types_solicitudfoto": "SolicitudFoto" | kind=code-symbol | source=lib/monitorista/types.ts:L86 | neighbors=[detenido-service.ts, mapper.ts, service.ts, types.ts]
- "monitorista_types_turno": "Turno" | kind=code-symbol | source=lib/monitorista/types.ts:L111 | neighbors=[incidentes-camara-service.ts, mapper.ts, service.ts, types.ts]
- "notificaciones_checker_generaralertasbusquedas": "generarAlertasBusquedas()" | kind=code-symbol | source=lib/notificaciones/checker.ts:L7 | neighbors=[actions.ts, checker.ts, route.ts, layout.tsx]
- "notificaciones_types": "types.ts" | kind=code-symbol | source=lib/notificaciones/types.ts:L1 | neighbors=[ad3ec5f mejorando esto, mapper.ts, repository.ts, Notificacion]
- "oficial_mapper_rowtoreportecampo": "rowToReporteCampo()" | kind=code-symbol | source=lib/oficial/mapper.ts:L9 | neighbors=[mapper.ts, parseJsonField(), toStr(), rowToReporteDetalle()]
- "oficial_mapper_rowtoreportedetalle": "rowToReporteDetalle()" | kind=code-symbol | source=lib/oficial/mapper.ts:L137 | neighbors=[mapper.ts, rowToD1(), rowToReporteCampo(), repository.ts]
- "oficial_service_crearreporte": "crearReporte()" | kind=code-symbol | source=lib/oficial/service.ts:L97 | neighbors=[actions.ts, service.ts, generarFolioUnico(), num()]
- "oficial_service_obtenercatalogos": "obtenerCatalogos()" | kind=code-symbol | source=lib/oficial/service.ts:L83 | neighbors=[page.tsx, page.tsx, service.ts, page.tsx]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/cesarbr/Documents/dev/sjr/seguridad_publica/.graphify/description-instructions/batch-023.json

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
