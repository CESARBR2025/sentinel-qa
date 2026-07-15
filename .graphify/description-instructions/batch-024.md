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
Write every description in English (en). Do not switch languages.
No marketing language.
Respond ONLY with a JSON object mapping each node id (as a string) to its
one-sentence description — no prose, no markdown fences.

- "monitorista_types_incidentecamara": "IncidenteCamara" | kind=code-symbol | source=lib/monitorista/types.ts:L113 | neighbors=[incidentes-camara-service.ts, mapper.ts, repository.ts, service.ts, types.ts]
- "notificaciones_types": "types.ts" | kind=code-symbol | source=lib/notificaciones/types.ts:L1 | neighbors=[863c575 Merge pull request #24 from pre…, ad3ec5f mejorando esto, mapper.ts, repository.ts, Notificacion]
- "oficial_types_ofireportedetalle": "OfiReporteDetalle" | kind=code-symbol | source=lib/oficial/types.ts:L188 | neighbors=[mapper.ts, repository.ts, service.ts, types.ts, OfiReporteCampo]
- "oficiales_repository_oficialesviarepository": "OficialesViaRepository" | kind=code-symbol | source=features/via/oficiales/repository.ts:L4 | neighbors=[repository.ts, .obtenerOficialIdPorUserId(), .obtenerOficialPorId(), .obtenerOficialPorUserId(), service.ts]
- "oficiales_service_oficialesviaservice": "OficialesViaService" | kind=code-symbol | source=features/via/oficiales/service.ts:L3 | neighbors=[service.ts, .obtenerMiPerfil(), .obtenerOficialId(), .obtenerPorId(), route.ts]
- "path_route": "route.ts" | kind=code-symbol | source=app/api/uploads/[...path]/route.ts:L1 | neighbors=[0e33bf6 feat: módulo Admin, Prórroga, F…, auth.ts, auth, GET(), MIME]
- "permisos_core_obtenerpermisosusuario": "obtenerPermisosUsuario()" | kind=code-symbol | source=lib/permisos/core.ts:L36 | neighbors=[page.tsx, core.ts, mapaBase(), tienePermiso(), mapaDefault()]
- "permisos_core_tienepermiso": "tienePermiso()" | kind=code-symbol | source=lib/permisos/core.ts:L59 | neighbors=[actions.ts, layout.tsx, core.ts, obtenerPermisosUsuario(), route.ts]
- "prevencion_autoridadbadge_autoridadbadge": "AutoridadBadge()" | kind=code-symbol | source=components/prevencion/AutoridadBadge.tsx:L8 | neighbors=[page.tsx, page.tsx, page.tsx, AgregarAutoridadForm.tsx, AutoridadBadge.tsx]
- "prevencion_paginate_paginate": "paginate()" | kind=code-symbol | source=lib/prevencion/paginate.ts:L2 | neighbors=[page.tsx, page.tsx, page.tsx, paginate.ts, page.tsx]
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
- "agente_juzgado_types_datosaseguradoinput": "DatosAseguradoInput" | kind=code-symbol | source=lib/agente_juzgado/types.ts:L7 | neighbors=[actions.ts, repository.ts, service.ts, types.ts]
- "agente_juzgado_types_liberacionrow": "LiberacionRow" | kind=code-symbol | source=lib/agente_juzgado/types.ts:L50 | neighbors=[actions.ts, repository.ts, service.ts, types.ts]
- "all_route": "route.ts" | kind=code-symbol | source=app/api/auth/[...all]/route.ts:L1 | neighbors=[{ GET, POST }, auth.ts, auth, 6a042cd feat: sistema de autenticación,…]

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
