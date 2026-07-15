# Node Description Batch 25 of 93

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

- "prevencion_pagination_pagination": "Pagination()" | kind=code-symbol | source=components/prevencion/Pagination.tsx:L10 | neighbors=[page.tsx, page.tsx, page.tsx, Pagination.tsx, page.tsx]
- "prevencion_searchbox_searchbox": "SearchBox()" | kind=code-symbol | source=components/prevencion/SearchBox.tsx:L14 | neighbors=[BusquedasFiltros.tsx, JuridicoFiltros.tsx, MedidasFiltros.tsx, SearchBox.tsx, page.tsx]
- "radio_input": "Input.tsx" | kind=code-symbol | source=components/911/radio/Input.tsx:L1 | neighbors=[0068216 Mejora de Dashboard, Login y tr…, 4d4a9b7 formulario de notificaciones po…, 863c575 Merge pull request #24 from pre…, InputProps, SentinelInput()]
- "reportes_formato_n_atencion_victimas_service_rowto": "rowTo()" | kind=code-symbol | source=lib/reportes/formato-n-atencion-victimas-service.ts:L31 | neighbors=[formato-n-atencion-victimas-service.ts, obtenerAtencionVictimas(), obtenerAtencionVictimasPorFechaPeriodo(), formatFecha(), parsePeriodo()]
- "reportes_formato_n_fge_service_rowto": "rowTo()" | kind=code-symbol | source=lib/reportes/formato-n-fge-service.ts:L36 | neighbors=[formato-n-fge-service.ts, obtenerFge(), obtenerFgePorFechaPeriodo(), formatFecha(), parsePeriodo()]
- "reportes_formato_n_fgr_service_rowto": "rowTo()" | kind=code-symbol | source=lib/reportes/formato-n-fgr-service.ts:L35 | neighbors=[formato-n-fgr-service.ts, obtenerFgr(), obtenerFgrPorFechaPeriodo(), formatFecha(), parsePeriodo()]
- "reportes_formato_n_medios_alternativos_service_rowto": "rowTo()" | kind=code-symbol | source=lib/reportes/formato-n-medios-alternativos-service.ts:L29 | neighbors=[formato-n-medios-alternativos-service.ts, obtenerMediosAlternativos(), obtenerMediosAlternativosPorFechaPeriod…, formatFecha(), parsePeriodo()]
- "reportes_incidentes_service_combinar": "combinar()" | kind=code-symbol | source=lib/reportes-incidentes/service.ts:L12 | neighbors=[service.ts, toNum(), toStr(), listarReporteDiario(), listarReporteSemanal()]
- "reportes_mapper": "mapper.ts" | kind=code-symbol | source=lib/reportes/mapper.ts:L1 | neighbors=[863c575 Merge pull request #24 from pre…, ad3ec5f mejorando esto, toBool(), toNum(), toStr()]
- "rol_servicios_types_servicerow": "ServiceRow" | kind=code-symbol | source=lib/rol-servicios/types.ts:L3 | neighbors=[mapper.ts, page.tsx, service.ts, ServiceTable.tsx, types.ts]
- "scripts_export_schema_main": "main()" | kind=code-symbol | source=scripts/export-schema.mjs:L76 | neighbors=[export-schema.mjs, getColumns(), getEnums(), getSchemas(), getTables()]
- "scripts_load_context_main": "main()" | kind=code-symbol | source=scripts/load-context.mjs:L117 | neighbors=[load-context.mjs, buildInstructions(), buildKeywords(), extractDomain(), queryGraph()]
- "scripts_trace_utils_findsourcefile": "findSourceFile()" | kind=code-symbol | source=scripts/trace-utils.mjs:L33 | neighbors=[trace-client.mjs, trace-components.mjs, trace-server.mjs, trace-utils.mjs, searchRecursive()]
- "sin_robos_styles_styles": "styles" | kind=code-symbol | source=components/reportes/sin_robos/styles.ts:L1 | neighbors=[page.tsx, PaginacionSinRobos.tsx, ReporteSinRobos.tsx, ReportFilters.tsx, styles.ts]
- "solicitudes_subir_oficio_modal": "subir-oficio-modal.tsx" | kind=code-symbol | source=app/corralon/solicitudes/subir-oficio-modal.tsx:L1 | neighbors=[16df128 flujo de corralones listo, 863c575 Merge pull request #24 from pre…, solicitudes-client.tsx, Props, SubirOficioModal()]
- "solicitudes_ver_documento_modal": "ver-documento-modal.tsx" | kind=code-symbol | source=app/corralon/solicitudes/ver-documento-modal.tsx:L1 | neighbors=[16df128 flujo de corralones listo, 863c575 Merge pull request #24 from pre…, getExtension(), Props, VerDocumentoModal()]
- "ui_fieldlabel_fieldlabel": "FieldLabel()" | kind=code-symbol | source=features/via/infracciones/components/ui/FieldLabel.tsx:L1 | neighbors=[PasoConductor.tsx, PasoVehiculo.tsx, SeccionGarantia.tsx, SeccionMotivo.tsx, FieldLabel.tsx]
- "utils_generateiphppt": "generateIPHPPT.ts" | kind=code-symbol | source=lib/utils/generateIPHPPT.ts:L1 | neighbors=[5618308 guardado e evidencias con ed, 863c575 Merge pull request #24 from pre…, 9550203 Cambios en presentacion, se gen…, 9faf222 Merge branch 'feature/testing' …, generateIPHPPT()]
- "whatsapp_formsection": "FormSection.tsx" | kind=code-symbol | source=components/911/whatsapp/FormSection.tsx:L1 | neighbors=[0068216 Mejora de Dashboard, Login y tr…, 519716a Formulario para registro de wha…, 863c575 Merge pull request #24 from pre…, FormSection(), SectionProps]
- "2fa_page": "page.tsx" | kind=code-symbol | source=app/(auth)/login/2fa/page.tsx:L1 | neighbors=[TwoFactorPage(), auth-client.ts, authClient, 6a042cd feat: sistema de autenticación,…]
- "911_mapper_rowtoincidentedetalle": "rowToIncidenteDetalle()" | kind=code-symbol | source=lib/911/mapper.ts:L29 | neighbors=[mapper.ts, toNum(), toStr(), repository.ts]
- "911_service_getcatalogos": "getCatalogos()" | kind=code-symbol | source=lib/911/service.ts:L4 | neighbors=[service.ts, page.tsx, page.tsx, page.tsx]
- "911_service_getstats": "getStats()" | kind=code-symbol | source=lib/911/service.ts:L8 | neighbors=[service.ts, page.tsx, page.tsx, page.tsx]
- "911_types_catalogoitem": "CatalogoItem" | kind=code-symbol | source=lib/911/types.ts:L63 | neighbors=[mapper.ts, repository.ts, service.ts, types.ts]
- "911_types_incidentedetalle": "IncidenteDetalle" | kind=code-symbol | source=lib/911/types.ts:L13 | neighbors=[mapper.ts, repository.ts, service.ts, types.ts]
- "admin_transito_mapper_tostr": "toStr()" | kind=code-symbol | source=lib/admin-transito/mapper.ts:L3 | neighbors=[mapper.ts, rowToDepartamento(), rowToOficialLista(), rowToUserBasico()]
- "admin_transito_repository_listardepartamentosactivos": "listarDepartamentosActivos()" | kind=code-symbol | source=lib/admin-transito/repository.ts:L5 | neighbors=[repository.ts, page.tsx, page.tsx, page.tsx]
- "agente_infracciones_service_verificarrolinfracciones": "verificarRolInfracciones()" | kind=code-symbol | source=lib/agente_infracciones/service.ts:L10 | neighbors=[actions.ts, service.ts, route.ts, route.ts]
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
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@4075365b4c93a02b3ec2ad9101daf881a539b770": "4075365 actualizando ignore" | kind=Commit | source=git | neighbors=[feature/testing, main, 6cdc611 Merge pull request #22 from pre…, dd2f306 Fix Mapa]
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@cd92b0106fd8e31dd28a5941eb13b945c4b02f48": "cd92b01 Update .gitignore" | kind=Commit | source=git | neighbors=[feature/testing, main, dd2f306 Fix Mapa, f0089cf Merge pull request #21 from pre…]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/ugomez/Documents/GitHub/seguridad_publica/.graphify/description-instructions/batch-024.json

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
