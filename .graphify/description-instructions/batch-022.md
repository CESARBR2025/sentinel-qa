# Node Description Batch 23 of 86

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

- "oficial_selectordestinolegal": "SelectorDestinoLegal.tsx" | kind=code-symbol | source=components/oficial/SelectorDestinoLegal.tsx:L1 | neighbors=[0d9172a mejorando flujo de 911-despacho, FormularioRecorrido.tsx, DESTINOS, Props, SelectorDestinoLegal()]
- "oficial_types_ofireportedetalle": "OfiReporteDetalle" | kind=code-symbol | source=lib/oficial/types.ts:L188 | neighbors=[mapper.ts, repository.ts, service.ts, types.ts, OfiReporteCampo]
- "oficiales_repository_oficialesviarepository": "OficialesViaRepository" | kind=code-symbol | source=features/via/oficiales/repository.ts:L4 | neighbors=[repository.ts, .obtenerOficialIdPorUserId(), .obtenerOficialPorId(), .obtenerOficialPorUserId(), service.ts]
- "oficiales_service_oficialesviaservice": "OficialesViaService" | kind=code-symbol | source=features/via/oficiales/service.ts:L3 | neighbors=[service.ts, .obtenerMiPerfil(), .obtenerOficialId(), .obtenerPorId(), route.ts]
- "path_route": "route.ts" | kind=code-symbol | source=app/api/uploads/[...path]/route.ts:L1 | neighbors=[0e33bf6 feat: módulo Admin, Prórroga, F…, auth.ts, auth, GET(), MIME]
- "permisos_core_tienepermiso": "tienePermiso()" | kind=code-symbol | source=lib/permisos/core.ts:L52 | neighbors=[actions.ts, layout.tsx, core.ts, obtenerPermisosUsuario(), route.ts]
- "prevencion_autoridadbadge_autoridadbadge": "AutoridadBadge()" | kind=code-symbol | source=components/prevencion/AutoridadBadge.tsx:L8 | neighbors=[page.tsx, page.tsx, page.tsx, AgregarAutoridadForm.tsx, AutoridadBadge.tsx]
- "reportes_formato_n_atencion_victimas_service_rowto": "rowTo()" | kind=code-symbol | source=lib/reportes/formato-n-atencion-victimas-service.ts:L31 | neighbors=[formato-n-atencion-victimas-service.ts, obtenerAtencionVictimas(), obtenerAtencionVictimasPorFechaPeriodo(), formatFecha(), parsePeriodo()]
- "reportes_formato_n_fge_service_rowto": "rowTo()" | kind=code-symbol | source=lib/reportes/formato-n-fge-service.ts:L36 | neighbors=[formato-n-fge-service.ts, obtenerFge(), obtenerFgePorFechaPeriodo(), formatFecha(), parsePeriodo()]
- "reportes_formato_n_fgr_service_rowto": "rowTo()" | kind=code-symbol | source=lib/reportes/formato-n-fgr-service.ts:L35 | neighbors=[formato-n-fgr-service.ts, obtenerFgr(), obtenerFgrPorFechaPeriodo(), formatFecha(), parsePeriodo()]
- "reportes_formato_n_medios_alternativos_service_rowto": "rowTo()" | kind=code-symbol | source=lib/reportes/formato-n-medios-alternativos-service.ts:L29 | neighbors=[formato-n-medios-alternativos-service.ts, obtenerMediosAlternativos(), obtenerMediosAlternativosPorFechaPeriod…, formatFecha(), parsePeriodo()]
- "reportes_incidentes_service_combinar": "combinar()" | kind=code-symbol | source=lib/reportes-incidentes/service.ts:L12 | neighbors=[service.ts, toNum(), toStr(), listarReporteDiario(), listarReporteSemanal()]
- "reportes_sin_d1_types": "types.ts" | kind=code-symbol | source=lib/reportes-sin-d1/types.ts:L1 | neighbors=[ad3ec5f mejorando esto, mapper.ts, repository.ts, service.ts, SinD1Row]
- "reportes_sin_novedad_types": "types.ts" | kind=code-symbol | source=lib/reportes-sin-novedad/types.ts:L1 | neighbors=[ad3ec5f mejorando esto, mapper.ts, repository.ts, service.ts, SinNovedadRow]
- "rh_route": "route.ts" | kind=code-symbol | source=app/api/rol-servicios/externos/rh/route.ts:L1 | neighbors=[a58a0f7 Despachos, auth.ts, auth, GET(), 6feefe2 BackEnd completo para hacer la …]
- "rol_servicios_signaturemodal": "SignatureModal.tsx" | kind=code-symbol | source=components/rol_servicios/SignatureModal.tsx:L1 | neighbors=[ServiceFooter.tsx, Props, SignatureModal(), b68a2b7 Merge branch 'feature/testing' …, f9243ac Interfaz de formulario de rol d…]
- "rol_servicios_types_servicerow": "ServiceRow" | kind=code-symbol | source=lib/rol-servicios/types.ts:L3 | neighbors=[mapper.ts, page.tsx, service.ts, ServiceTable.tsx, types.ts]
- "scripts_export_schema_main": "main()" | kind=code-symbol | source=scripts/export-schema.mjs:L76 | neighbors=[export-schema.mjs, getColumns(), getEnums(), getSchemas(), getTables()]
- "scripts_extract_domain": "extract-domain.mjs" | kind=code-symbol | source=scripts/extract-domain.mjs:L1 | neighbors=[e6bffc9 boveda conectada, __dirname, extractDomain(), KEYWORDS, ROOT]
- "sin_robos_styles_styles": "styles" | kind=code-symbol | source=components/reportes/sin_robos/styles.ts:L1 | neighbors=[page.tsx, PaginacionSinRobos.tsx, ReporteSinRobos.tsx, ReportFilters.tsx, styles.ts]
- "token_guest_route": "route.ts" | kind=code-symbol | source=app/api/auth/token-guest/route.ts:L1 | neighbors=[23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, b5233a8 implementando via como modulo d…, f7b1aac Merge branch 'feature/testing' …, POST()]
- "ui_fieldlabel_fieldlabel": "FieldLabel()" | kind=code-symbol | source=features/via/infracciones/components/ui/FieldLabel.tsx:L1 | neighbors=[PasoConductor.tsx, PasoVehiculo.tsx, SeccionGarantia.tsx, SeccionMotivo.tsx, FieldLabel.tsx]
- "ui_radioinput": "RadioInput.tsx" | kind=code-symbol | source=features/via/infracciones/components/ui/RadioInput.tsx:L1 | neighbors=[23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, b5233a8 implementando via como modulo d…, f7b1aac Merge branch 'feature/testing' …, RadioOption()]
- "2fa_page": "page.tsx" | kind=code-symbol | source=app/(auth)/login/2fa/page.tsx:L1 | neighbors=[TwoFactorPage(), auth-client.ts, authClient, 6a042cd feat: sistema de autenticación,…]
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

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/cesarbr/Documents/dev/sjr/seguridad_publica/.graphify/description-instructions/batch-022.json

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
