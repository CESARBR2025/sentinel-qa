# Node Description Batch 24 of 89

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

- "911_mapper_rowtoincidentedetalle": "rowToIncidenteDetalle()" | kind=code-symbol | source=lib/911/mapper.ts:L29 | neighbors=[mapper.ts, toNum(), toStr(), repository.ts]
- "911_service_getcatalogos": "getCatalogos()" | kind=code-symbol | source=lib/911/service.ts:L4 | neighbors=[service.ts, page.tsx, page.tsx, page.tsx]
- "911_service_getstats": "getStats()" | kind=code-symbol | source=lib/911/service.ts:L8 | neighbors=[service.ts, page.tsx, page.tsx, page.tsx]
- "911_types_catalogoitem": "CatalogoItem" | kind=code-symbol | source=lib/911/types.ts:L63 | neighbors=[mapper.ts, repository.ts, service.ts, types.ts]
- "911_types_incidentedetalle": "IncidenteDetalle" | kind=code-symbol | source=lib/911/types.ts:L13 | neighbors=[mapper.ts, repository.ts, service.ts, types.ts]
- "admin_transito_mapper_tostr": "toStr()" | kind=code-symbol | source=lib/admin-transito/mapper.ts:L3 | neighbors=[mapper.ts, rowToDepartamento(), rowToOficialLista(), rowToUserBasico()]
- "admin_transito_page": "page.tsx" | kind=code-symbol | source=app/admin-transito/page.tsx:L1 | neighbors=[AdminTransitoDashboardPage(), 16a63d4 Merge branch 'feature/testing' …, ac48eb1 Merge pull request #17 from pre…, dc063f3 gestion de oficiales correctame…]
- "admin_transito_repository_listardepartamentosactivos": "listarDepartamentosActivos()" | kind=code-symbol | source=lib/admin-transito/repository.ts:L5 | neighbors=[repository.ts, page.tsx, page.tsx, page.tsx]
- "agente_juzgado_types_datosaseguradoinput": "DatosAseguradoInput" | kind=code-symbol | source=lib/agente_juzgado/types.ts:L7 | neighbors=[actions.ts, repository.ts, service.ts, types.ts]
- "agente_juzgado_types_liberacionrow": "LiberacionRow" | kind=code-symbol | source=lib/agente_juzgado/types.ts:L50 | neighbors=[actions.ts, repository.ts, service.ts, types.ts]
- "all_route": "route.ts" | kind=code-symbol | source=app/api/auth/[...all]/route.ts:L1 | neighbors=[{ GET, POST }, auth.ts, auth, 6a042cd feat: sistema de autenticación,…]
- "analisis_permisos_verificaraccesoanalisisapi": "verificarAccesoAnalisisApi()" | kind=code-symbol | source=lib/analisis/permisos.ts:L29 | neighbors=[permisos.ts, tienePermiso(), route.ts, tieneAccesoAnalisis()]
- "auxiliar_mapper_rowtochecklist": "rowToChecklist()" | kind=code-symbol | source=lib/auxiliar/mapper.ts:L9 | neighbors=[mapper.ts, toStr(), rowToParReporte(), repository.ts]
- "auxiliar_mapper_rowtoparreporte": "rowToParReporte()" | kind=code-symbol | source=lib/auxiliar/mapper.ts:L31 | neighbors=[mapper.ts, rowToChecklist(), toStr(), repository.ts]
- "auxiliar_mapper_tostr": "toStr()" | kind=code-symbol | source=lib/auxiliar/mapper.ts:L3 | neighbors=[mapper.ts, rowToChecklist(), rowToCuestionarioRobo(), rowToParReporte()]
- "auxiliar_permisos_verificaraccesoauxiliarapi": "verificarAccesoAuxiliarApi()" | kind=code-symbol | source=lib/auxiliar/permisos.ts:L33 | neighbors=[permisos.ts, tienePermiso(), route.ts, tieneAccesoAuxiliar()]
- "camara_mapper_rowtoincidentecamara": "rowToIncidenteCamara()" | kind=code-symbol | source=lib/camara/mapper.ts:L21 | neighbors=[mapper.ts, toNum(), toStr(), repository.ts]
- "camara_types_incidentecamara": "IncidenteCamara" | kind=code-symbol | source=lib/camara/types.ts:L1 | neighbors=[mapper.ts, repository.ts, types.ts, route.ts]
- "corralon_types_solicitudrow": "SolicitudRow" | kind=code-symbol | source=lib/corralon/types.ts:L7 | neighbors=[actions.ts, mapper.ts, service.ts, types.ts]
- "d1_types": "types.ts" | kind=code-symbol | source=lib/d1/types.ts:L1 | neighbors=[ad3ec5f mejorando esto, mapper.ts, repository.ts, ReporteD1]
- "deteccion_camara_reportstat_reportstat": "ReportStat()" | kind=code-symbol | source=components/reportes/deteccion_camara/ReportStat.tsx:L2 | neighbors=[ReportStat.tsx, PhoneStatsCards.tsx, page.tsx, page.tsx]
- "fiscalia_repository_generarfolioasegurados": "generarFolioAsegurados()" | kind=code-symbol | source=lib/fiscalia/repository.ts:L486 | neighbors=[actions.ts, actions.ts, repository.ts, service.ts]
- "fiscalia_service_obtenerdetalleaseguradocompletoservice": "obtenerDetalleAseguradoCompletoService()" | kind=code-symbol | source=lib/fiscalia/service.ts:L87 | neighbors=[actions.ts, actions.ts, service.ts, parseDetenidos()]
- "fiscalia_types_actas_checklist": "ACTAS_CHECKLIST" | kind=code-symbol | source=lib/fiscalia/types.ts:L361 | neighbors=[FormularioAseguradoJuzgado.tsx, FormularioPuestaDisposicion.tsx, types.ts, page.tsx]
- "fiscalia_types_datosaseguradoinput": "DatosAseguradoInput" | kind=code-symbol | source=lib/fiscalia/types.ts:L17 | neighbors=[actions.ts, repository.ts, service.ts, types.ts]
- "fiscalia_types_viainfracciondetalle": "ViaInfraccionDetalle" | kind=code-symbol | source=lib/fiscalia/types.ts:L281 | neighbors=[actions.ts, FiscaliaDashboard.tsx, mapper.ts, types.ts]
- "flota_mapper_rowtopatrulla": "rowToPatrulla()" | kind=code-symbol | source=lib/flota/mapper.ts:L14 | neighbors=[mapper.ts, toBool(), toStr(), repository.ts]
- "hooks_useincidentes": "useIncidentes.ts" | kind=code-symbol | source=hooks/useIncidentes.ts:L1 | neighbors=[6feefe2 BackEnd completo para hacer la …, Filtros, IncidenteResumen, useIncidentes()]
- "id_page_fmtdt": "fmtDT()" | kind=code-symbol | source=app/prevencion/juridico/solicitudes/[id]/page.tsx:L16 | neighbors=[page.tsx, FichaDetailPage(), toDate(), SolicitudDetailPage()]
- "id_page_getstatusbadgestyle": "getStatusBadgeStyle()" | kind=code-symbol | source=app/agente_911/whatsapp/incidentes/[id]/page.tsx:L162 | neighbors=[page.tsx, DetalleCiudadanoCompletoPage(), DetalleRondinCompletoPage(), DetalleWhatsAppPage()]
- "incidentes_actions_addpersonaafectada": "addPersonaAfectada()" | kind=code-symbol | source=lib/incidentes/actions.ts:L261 | neighbors=[actions.ts, req(), requireOperador(), validarEnum()]
- "incidentes_actions_createdespacho": "createDespacho()" | kind=code-symbol | source=lib/incidentes/actions.ts:L466 | neighbors=[DespachoForm.tsx, actions.ts, req(), requireOperador()]
- "incidentes_actions_createrecorridocompleto": "createRecorridoCompleto()" | kind=code-symbol | source=lib/incidentes/actions.ts:L399 | neighbors=[actions.ts, num(), requireOperador(), FormSection.tsx]
- "incidentes_actions_createreportecampo": "createReporteCampo()" | kind=code-symbol | source=lib/incidentes/actions.ts:L644 | neighbors=[actions.ts, num(), req(), requireOperador()]
- "incidentes_actions_createrondinescalado": "createRondinEscalado()" | kind=code-symbol | source=lib/incidentes/actions.ts:L316 | neighbors=[actions.ts, req(), requireOperador(), FormRondinEscalado.tsx]
- "incidentes_actions_enviarrefuerzos": "enviarRefuerzos()" | kind=code-symbol | source=lib/incidentes/actions.ts:L536 | neighbors=[DespachoForm.tsx, actions.ts, req(), requireOperador()]
- "incidentes_actions_insertarincidente": "insertarIncidente()" | kind=code-symbol | source=lib/incidentes/actions.ts:L708 | neighbors=[actions.ts, num(), req(), validarEnum()]
- "incidentes_mapper_rowtoalarmaescolar": "rowToAlarmaEscolar()" | kind=code-symbol | source=lib/incidentes/mapper.ts:L156 | neighbors=[mapper.ts, toNum(), toStr(), repository.ts]
- "incidentes_mapper_rowtoincidentecondespachobase": "rowToIncidenteConDespachoBase()" | kind=code-symbol | source=lib/incidentes/mapper.ts:L54 | neighbors=[mapper.ts, toBool(), toStr(), repository.ts]
- "incidentes_mapper_rowtoincidentependiente": "rowToIncidentePendiente()" | kind=code-symbol | source=lib/incidentes/mapper.ts:L76 | neighbors=[mapper.ts, toNum(), toStr(), repository.ts]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/ugomez/Documents/GitHub/seguridad_publica/.graphify/description-instructions/batch-023.json

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
