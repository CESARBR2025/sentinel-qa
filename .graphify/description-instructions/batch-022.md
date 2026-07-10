# Node Description Batch 23 of 82

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
For an entity node (any other kind — e.g. a person, place, event, object),
describe what the entity is and its role, grounded in its type, its
relations (neighbors) and the provided citations/evidence — e.g.
"Lady Carfax, a wealthy heiress who disappears en route to Lausanne.".
Ground entity descriptions in the citations/evidence when present; do not
speculate beyond the context, so a node with no supporting context may be
left out of the reply.
Write every description in Portuguese (pt). Do not switch languages.
No marketing language.
Respond ONLY with a JSON object mapping each node id (as a string) to its
one-sentence description — no prose, no markdown fences.

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
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@5641e69060dbea6d3d76670e3b0f4a08ae7873f3": "5641e69 Merge branch 'feature/testing' of https://github.com/presidenciaSJR/seg…" | kind=Commit | source=git | neighbors=[4af36d9 Merge pull request #18 from pre…, feature/testing, ac9ad49 Merge branch 'feature/testing' …, c776b58 Integrar Alexandria (bóveda de …]
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@a7a7f2e084cd75996841e4eeb0019d3671cacfde": "a7a7f2e boveda" | kind=Commit | source=git | neighbors=[feature/testing, a21f03f fix bugs reporte denuncia, e6bffc9 boveda conectada, conexion]
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@e211eefd572dbc8a9bedcdde8eb32d55fe19b171": "e211eef upload AGENTS" | kind=Commit | source=git | neighbors=[514a705 refactorizacion sql, feature/testing, ad3ec5f mejorando esto, conexion]
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@fe98642c55b564ea884be82ff0c7bc4bdfa8766b": "fe98642 modificando agents.md" | kind=Commit | source=git | neighbors=[ec3acf7 iniciando reset de testing, feature/testing, 03f8b2a implementado rbac, 4af36d9 Merge pull request #18 from pre…]
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
- "incidentes_actions_addpersonaafectada": "addPersonaAfectada()" | kind=code-symbol | source=lib/incidentes/actions.ts:L157 | neighbors=[actions.ts, req(), requireOperador(), validarEnum()]
- "incidentes_actions_createalarmaescolar": "createAlarmaEscolar()" | kind=code-symbol | source=lib/incidentes/actions.ts:L494 | neighbors=[actions.ts, req(), requireOperador(), createIncidente()]
- "incidentes_actions_createdespacho": "createDespacho()" | kind=code-symbol | source=lib/incidentes/actions.ts:L272 | neighbors=[DespachoForm.tsx, actions.ts, req(), requireOperador()]
- "incidentes_actions_createextorsion": "createExtorsion()" | kind=code-symbol | source=lib/incidentes/actions.ts:L463 | neighbors=[actions.ts, req(), requireOperador(), createIncidente()]
- "incidentes_actions_createrecorridocompleto": "createRecorridoCompleto()" | kind=code-symbol | source=lib/incidentes/actions.ts:L205 | neighbors=[actions.ts, num(), requireOperador(), FormSection.tsx]
- "incidentes_actions_createreportecampo": "createReporteCampo()" | kind=code-symbol | source=lib/incidentes/actions.ts:L339 | neighbors=[actions.ts, num(), req(), requireOperador()]
- "incidentes_actions_insertarincidente": "insertarIncidente()" | kind=code-symbol | source=lib/incidentes/actions.ts:L403 | neighbors=[actions.ts, num(), req(), validarEnum()]
- "incidentes_actions_validarenum": "validarEnum()" | kind=code-symbol | source=lib/incidentes/actions.ts:L36 | neighbors=[actions.ts, addPersonaAfectada(), createIncidente(), insertarIncidente()]
- "incidentes_mapper_rowtoalarmaescolar": "rowToAlarmaEscolar()" | kind=code-symbol | source=lib/incidentes/mapper.ts:L154 | neighbors=[mapper.ts, toNum(), toStr(), repository.ts]
- "incidentes_mapper_rowtoincidentecondespachobase": "rowToIncidenteConDespachoBase()" | kind=code-symbol | source=lib/incidentes/mapper.ts:L54 | neighbors=[mapper.ts, toBool(), toStr(), repository.ts]
- "incidentes_mapper_rowtoincidentependiente": "rowToIncidentePendiente()" | kind=code-symbol | source=lib/incidentes/mapper.ts:L74 | neighbors=[mapper.ts, toNum(), toStr(), repository.ts]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/ugomez/Documents/GitHub/seguridad_publica/.graphify/description-instructions/batch-022.json

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
