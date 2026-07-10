# Node Description Batch 22 of 82

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

- "health_route": "route.ts" | kind=code-symbol | source=app/api/health/route.ts:L1 | neighbors=[6a042cd feat: sistema de autenticación,…, ad3ec5f mejorando esto, repository.ts, ping(), GET()]
- "id_page_infraccionciudadanopage": "InfraccionCiudadanoPage()" | kind=code-symbol | source=app/infracciones/[id]/page.tsx:L64 | neighbors=[page.tsx, formatDate(), getStatusStyle(), sanitize(), timeAgo()]
- "incidentes_actions_num": "num()" | kind=code-symbol | source=lib/incidentes/actions.ts:L27 | neighbors=[actions.ts, createIncidente(), createRecorridoCompleto(), createReporteCampo(), insertarIncidente()]
- "incidentes_mapper_rowtoincidentedetallecompletobase": "rowToIncidenteDetalleCompletoBase()" | kind=code-symbol | source=lib/incidentes/mapper.ts:L198 | neighbors=[mapper.ts, toBool(), toNum(), toStr(), repository.ts]
- "incidentes_mapper_rowtoreportecampo": "rowToReporteCampo()" | kind=code-symbol | source=lib/incidentes/mapper.ts:L113 | neighbors=[mapper.ts, toBool(), toNum(), toStr(), repository.ts]
- "incidentes_mapper_rowtoreportecampodetalle": "rowToReporteCampoDetalle()" | kind=code-symbol | source=lib/incidentes/mapper.ts:L233 | neighbors=[mapper.ts, toBool(), toNum(), toStr(), repository.ts]
- "incidentes_mapper_tobool": "toBool()" | kind=code-symbol | source=lib/incidentes/mapper.ts:L32 | neighbors=[mapper.ts, rowToIncidenteConDespachoBase(), rowToIncidenteDetalleCompletoBase(), rowToReporteCampo(), rowToReporteCampoDetalle()]
- "incidentes_statincidencia": "StatIncidencia.tsx" | kind=code-symbol | source=components/reportes/incidentes/StatIncidencia.tsx:L1 | neighbors=[2fcba7b vista de reportes de incidentes…, 552d291 Merge branch 'testing' into con…, e286619 Merge branch 'feature/testing' …, IncidenteStat(), page.tsx]
- "incidentes_styles_styles": "styles" | kind=code-symbol | source=components/reportes/incidentes/styles.ts:L1 | neighbors=[FiltrosIncidencias.tsx, Paginacion.tsx, styles.ts, TablaIncidentes.tsx, page.tsx]
- "monitorista_mapper_rowtoincidentecamara": "rowToIncidenteCamara()" | kind=code-symbol | source=lib/monitorista/mapper.ts:L175 | neighbors=[mapper.ts, num(), parseTurno(), repository.ts, service.ts]
- "monitorista_subirevidenciamodal_subirevidenciamodal": "SubirEvidenciaModal()" | kind=code-symbol | source=components/monitorista/SubirEvidenciaModal.tsx:L50 | neighbors=[BandejaSolicitudes.tsx, BotonSubirDenuncia.tsx, SubirEvidenciaModal.tsx, btnSubmit(), formatSize()]
- "monitorista_types_incidentecamara": "IncidenteCamara" | kind=code-symbol | source=lib/monitorista/types.ts:L113 | neighbors=[incidentes-camara-service.ts, mapper.ts, repository.ts, service.ts, types.ts]
- "next_config": "next.config.ts" | kind=code-symbol | source=next.config.ts:L1 | neighbors=[6a042cd feat: sistema de autenticación,…, 75ca4b2 Merge pull request #9 from pres…, 90da1ca Initial commit from Create Next…, 953d38a implementando vista de fiscalia, nextConfig]
- "notificaciones_mapper": "mapper.ts" | kind=code-symbol | source=lib/notificaciones/mapper.ts:L1 | neighbors=[ad3ec5f mejorando esto, rowToNotificacion(), types.ts, Notificacion, repository.ts]
- "oficial_types_ofireportedetalle": "OfiReporteDetalle" | kind=code-symbol | source=lib/oficial/types.ts:L159 | neighbors=[mapper.ts, repository.ts, service.ts, types.ts, OfiReporteCampo]
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
- "rh_route": "route.ts" | kind=code-symbol | source=app/api/rol-servicios/externos/rh/route.ts:L1 | neighbors=[6feefe2 BackEnd completo para hacer la …, a58a0f7 Despachos, auth.ts, auth, GET()]
- "rol_servicios_signaturemodal": "SignatureModal.tsx" | kind=code-symbol | source=components/rol_servicios/SignatureModal.tsx:L1 | neighbors=[b68a2b7 Merge branch 'feature/testing' …, f9243ac Interfaz de formulario de rol d…, ServiceFooter.tsx, Props, SignatureModal()]
- "rol_servicios_types_servicerow": "ServiceRow" | kind=code-symbol | source=lib/rol-servicios/types.ts:L3 | neighbors=[mapper.ts, page.tsx, service.ts, ServiceTable.tsx, types.ts]
- "scripts_extract_domain": "extract-domain.mjs" | kind=code-symbol | source=scripts/extract-domain.mjs:L1 | neighbors=[e6bffc9 boveda conectada, __dirname, extractDomain(), KEYWORDS, ROOT]
- "sin_robos_styles_styles": "styles" | kind=code-symbol | source=components/reportes/sin_robos/styles.ts:L1 | neighbors=[page.tsx, PaginacionSinRobos.tsx, ReporteSinRobos.tsx, ReportFilters.tsx, styles.ts]
- "token_guest_route": "route.ts" | kind=code-symbol | source=app/api/auth/token-guest/route.ts:L1 | neighbors=[23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, b5233a8 implementando via como modulo d…, f7b1aac Merge branch 'feature/testing' …, POST()]
- "ui_fieldlabel_fieldlabel": "FieldLabel()" | kind=code-symbol | source=features/via/infracciones/components/ui/FieldLabel.tsx:L1 | neighbors=[PasoConductor.tsx, PasoVehiculo.tsx, SeccionGarantia.tsx, SeccionMotivo.tsx, FieldLabel.tsx]
- "ui_radioinput": "RadioInput.tsx" | kind=code-symbol | source=features/via/infracciones/components/ui/RadioInput.tsx:L1 | neighbors=[23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, b5233a8 implementando via como modulo d…, f7b1aac Merge branch 'feature/testing' …, RadioOption()]
- "2fa_page": "page.tsx" | kind=code-symbol | source=app/(auth)/login/2fa/page.tsx:L1 | neighbors=[TwoFactorPage(), auth-client.ts, authClient, 6a042cd feat: sistema de autenticación,…]
- "911_mapper_rowtoincidentedetalle": "rowToIncidenteDetalle()" | kind=code-symbol | source=lib/911/mapper.ts:L29 | neighbors=[mapper.ts, toNum(), toStr(), repository.ts]
- "911_service_getstats": "getStats()" | kind=code-symbol | source=lib/911/service.ts:L8 | neighbors=[service.ts, page.tsx, page.tsx, page.tsx]
- "911_types_catalogoitem": "CatalogoItem" | kind=code-symbol | source=lib/911/types.ts:L63 | neighbors=[mapper.ts, repository.ts, service.ts, types.ts]
- "911_types_incidentedetalle": "IncidenteDetalle" | kind=code-symbol | source=lib/911/types.ts:L13 | neighbors=[mapper.ts, repository.ts, service.ts, types.ts]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/ugomez/Documents/GitHub/seguridad_publica/.graphify/description-instructions/batch-021.json

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
