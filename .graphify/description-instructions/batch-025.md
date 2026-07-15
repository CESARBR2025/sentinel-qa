# Node Description Batch 26 of 93

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
Write every description in English (en). Do not switch languages.
No marketing language.
Respond ONLY with a JSON object mapping each node id (as a string) to its
one-sentence description — no prose, no markdown fences.

- "auxiliar_mapper_rowtochecklist": "rowToChecklist()" | kind=code-symbol | source=lib/auxiliar/mapper.ts:L9 | neighbors=[mapper.ts, toStr(), rowToParReporte(), repository.ts]
- "auxiliar_mapper_rowtoparreporte": "rowToParReporte()" | kind=code-symbol | source=lib/auxiliar/mapper.ts:L31 | neighbors=[mapper.ts, rowToChecklist(), toStr(), repository.ts]
- "auxiliar_mapper_tostr": "toStr()" | kind=code-symbol | source=lib/auxiliar/mapper.ts:L3 | neighbors=[mapper.ts, rowToChecklist(), rowToCuestionarioRobo(), rowToParReporte()]
- "auxiliar_permisos_verificaraccesoauxiliarapi": "verificarAccesoAuxiliarApi()" | kind=code-symbol | source=lib/auxiliar/permisos.ts:L33 | neighbors=[permisos.ts, tienePermiso(), route.ts, tieneAccesoAuxiliar()]
- "camara_mapper_rowtoincidentecamara": "rowToIncidenteCamara()" | kind=code-symbol | source=lib/camara/mapper.ts:L21 | neighbors=[mapper.ts, toNum(), toStr(), repository.ts]
- "camara_types_incidentecamara": "IncidenteCamara" | kind=code-symbol | source=lib/camara/types.ts:L1 | neighbors=[mapper.ts, repository.ts, types.ts, route.ts]
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@4075365b4c93a02b3ec2ad9101daf881a539b770": "4075365 actualizando ignore" | kind=Commit | source=git | neighbors=[feature/testing, main, 6cdc611 Merge pull request #22 from pre…, dd2f306 Fix Mapa]
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@bdd5f33d99c9b1c20be0000b0327d4b47b13130a": "bdd5f33 Cambios de re-diseño en login page" | kind=Commit | source=git | neighbors=[7e39526 Mejoras UI/UX, feature/testing, 6adb8ad Correciones de versión y nombre, page.tsx]
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@cd92b0106fd8e31dd28a5941eb13b945c4b02f48": "cd92b01 Update .gitignore" | kind=Commit | source=git | neighbors=[feature/testing, main, dd2f306 Fix Mapa, f0089cf Merge pull request #21 from pre…]
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@de6da3e68d15f705aa9ce7a50a1ab081a74acccd": "de6da3e mejorando despacho" | kind=Commit | source=git | neighbors=[6c646af fix loader bug en login, feature/testing, main, 3c12c41 cambios en flujo de 911-despacho]
- "components_smoothscroll": "SmoothScroll.tsx" | kind=code-symbol | source=components/SmoothScroll.tsx:L1 | neighbors=[layout.tsx, 0068216 Mejora de Dashboard, Login y tr…, 863c575 Merge pull request #24 from pre…, SmoothScroll()]
- "corralon_module_card": "module-card.tsx" | kind=code-symbol | source=app/corralon/module-card.tsx:L1 | neighbors=[5a1b5d5 empezando corralon, 863c575 Merge pull request #24 from pre…, ModuleCard(), page.tsx]
- "corralon_types_solicitudrow": "SolicitudRow" | kind=code-symbol | source=lib/corralon/types.ts:L7 | neighbors=[actions.ts, mapper.ts, service.ts, types.ts]
- "dashboard_sign_out_button_signoutbutton": "SignOutButton()" | kind=code-symbol | source=app/dashboard/sign-out-button.tsx:L6 | neighbors=[sign-out-button.tsx, Header.tsx, SubHeader.tsx, page.tsx]
- "deteccion_camara_reportstat_reportstat": "ReportStat()" | kind=code-symbol | source=components/reportes/deteccion_camara/ReportStat.tsx:L2 | neighbors=[ReportStat.tsx, PhoneStatsCards.tsx, page.tsx, page.tsx]
- "fiscalia_repository_generarfolioasegurados": "generarFolioAsegurados()" | kind=code-symbol | source=lib/fiscalia/repository.ts:L463 | neighbors=[actions.ts, actions.ts, repository.ts, service.ts]
- "fiscalia_service_obtenerdetalleaseguradocompletoservice": "obtenerDetalleAseguradoCompletoService()" | kind=code-symbol | source=lib/fiscalia/service.ts:L86 | neighbors=[actions.ts, actions.ts, service.ts, parseDetenidos()]
- "fiscalia_service_verificarrolfiscalia": "verificarRolFiscalia()" | kind=code-symbol | source=lib/fiscalia/service.ts:L26 | neighbors=[actions.ts, service.ts, page.tsx, route.ts]
- "fiscalia_types_actas_checklist": "ACTAS_CHECKLIST" | kind=code-symbol | source=lib/fiscalia/types.ts:L448 | neighbors=[FormularioAseguradoJuzgado.tsx, FormularioPuestaDisposicion.tsx, types.ts, page.tsx]
- "fiscalia_types_datosaseguradoinput": "DatosAseguradoInput" | kind=code-symbol | source=lib/fiscalia/types.ts:L17 | neighbors=[actions.ts, repository.ts, service.ts, types.ts]
- "fiscalia_types_viainfracciondetalle": "ViaInfraccionDetalle" | kind=code-symbol | source=lib/fiscalia/types.ts:L368 | neighbors=[actions.ts, FiscaliaDashboard.tsx, mapper.ts, types.ts]
- "flota_mapper_rowtopatrulla": "rowToPatrulla()" | kind=code-symbol | source=lib/flota/mapper.ts:L14 | neighbors=[mapper.ts, toBool(), toStr(), repository.ts]
- "generar_route_drow": "dRow()" | kind=code-symbol | source=app/api/nCoordinacion/generar/route.ts:L53 | neighbors=[route.ts, tr(), GET(), tablaFiscalia()]
- "generar_route_hrow": "hRow()" | kind=code-symbol | source=app/api/nCoordinacion/generar/route.ts:L47 | neighbors=[route.ts, GET(), tr(), tablaFiscalia()]
- "generar_route_tr": "tr()" | kind=code-symbol | source=app/api/nCoordinacion/generar/route.ts:L45 | neighbors=[route.ts, dRow(), GET(), hRow()]
- "hooks_useincidente": "useIncidente.ts" | kind=code-symbol | source=hooks/useIncidente.ts:L1 | neighbors=[6feefe2 BackEnd completo para hacer la …, 863c575 Merge pull request #24 from pre…, IncidenteDetalle, useIncidente()]
- "hooks_usepolling": "usePolling.ts" | kind=code-symbol | source=hooks/usePolling.ts:L1 | neighbors=[511fea4 Modulo de despacho, 863c575 Merge pull request #24 from pre…, TablonDespacho.tsx, usePolling()]
- "hooks_usereportecampo": "useReporteCampo.ts" | kind=code-symbol | source=hooks/useReporteCampo.ts:L1 | neighbors=[863c575 Merge pull request #24 from pre…, a58a0f7 Despachos, ReporteCampoDetalle, useReporteCampo()]
- "id_page_fmtdt": "fmtDT()" | kind=code-symbol | source=app/prevencion/juridico/solicitudes/[id]/page.tsx:L16 | neighbors=[page.tsx, FichaDetailPage(), toDate(), SolicitudDetailPage()]
- "id_page_getstatusbadgestyle": "getStatusBadgeStyle()" | kind=code-symbol | source=app/agente_911/whatsapp/incidentes/[id]/page.tsx:L162 | neighbors=[page.tsx, DetalleCiudadanoCompletoPage(), DetalleRondinCompletoPage(), DetalleWhatsAppPage()]
- "incidentes_actions_addpersonaafectada": "addPersonaAfectada()" | kind=code-symbol | source=lib/incidentes/actions.ts:L265 | neighbors=[actions.ts, req(), requireOperador(), validarEnum()]
- "incidentes_actions_createdespacho": "createDespacho()" | kind=code-symbol | source=lib/incidentes/actions.ts:L504 | neighbors=[DespachoForm.tsx, actions.ts, req(), requireOperador()]
- "incidentes_actions_createrecorridocompleto": "createRecorridoCompleto()" | kind=code-symbol | source=lib/incidentes/actions.ts:L437 | neighbors=[actions.ts, num(), requireOperador(), FormSection.tsx]
- "incidentes_actions_createreportecampo": "createReporteCampo()" | kind=code-symbol | source=lib/incidentes/actions.ts:L687 | neighbors=[actions.ts, num(), req(), requireOperador()]
- "incidentes_actions_enviarrefuerzos": "enviarRefuerzos()" | kind=code-symbol | source=lib/incidentes/actions.ts:L579 | neighbors=[DespachoForm.tsx, actions.ts, req(), requireOperador()]
- "incidentes_actions_insertarincidente": "insertarIncidente()" | kind=code-symbol | source=lib/incidentes/actions.ts:L751 | neighbors=[actions.ts, num(), req(), validarEnum()]
- "incidentes_mapper_rowtoalarmaescolar": "rowToAlarmaEscolar()" | kind=code-symbol | source=lib/incidentes/mapper.ts:L160 | neighbors=[mapper.ts, toNum(), toStr(), repository.ts]
- "incidentes_mapper_rowtoincidentecondespachobase": "rowToIncidenteConDespachoBase()" | kind=code-symbol | source=lib/incidentes/mapper.ts:L54 | neighbors=[mapper.ts, toBool(), toStr(), repository.ts]
- "incidentes_mapper_rowtoincidentependiente": "rowToIncidentePendiente()" | kind=code-symbol | source=lib/incidentes/mapper.ts:L77 | neighbors=[mapper.ts, toNum(), toStr(), repository.ts]
- "incidentes_mapper_rowtopersonaafectada": "rowToPersonaAfectada()" | kind=code-symbol | source=lib/incidentes/mapper.ts:L98 | neighbors=[mapper.ts, toNum(), toStr(), repository.ts]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/ugomez/Documents/GitHub/seguridad_publica/.graphify/description-instructions/batch-025.json

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
