# Node Description Batch 22 of 87

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
LANGUAGE: each entry has a `lang=` marker giving the language of its source.
Write that entry's description in EXACTLY that language. Do not translate to
a single common language — match each node's source language individually.
No marketing language.
Respond ONLY with a JSON object mapping each node id (as a string) to its
one-sentence description — no prose, no markdown fences.

- "shared_abrirdocumento_abrirdocumento": "abrirDocumento()" | kind=code-symbol | source=lib/shared/abrirDocumento.ts:L1 | neighbors=[DetallesAseguradoView.tsx, RevisionDocumentosSection.tsx, SeccionLiberacion.tsx, DetallesAseguradoView.tsx, abrirDocumento.ts, DetalleInfraccionView.tsx] | lang=en
- "shared_detalleinfraccionview_sanitize": "sanitize()" | kind=code-symbol | source=components/shared/DetalleInfraccionView.tsx:L116 | neighbors=[DetalleInfraccionView.tsx, FundamentoLegalSection(), InfractorVehiculoSection(), mapGarantia(), MapSection(), OficialSection()] | lang=en
- "shared_infracciones_obtenerdetalleinfraccionvia": "obtenerDetalleInfraccionVia()" | kind=code-symbol | source=lib/shared/infracciones.ts:L237 | neighbors=[actions.ts, actions.ts, actions.ts, actions.ts, infracciones.ts, rowToInfraccionDetalle()] | lang=en
- "ui_segmentedcontrol_segmentedcontrol": "SegmentedControl()" | kind=code-symbol | source=features/via/infracciones/components/ui/SegmentedControl.tsx:L19 | neighbors=[SeccionLiberacion.tsx, PasoCiudadano.tsx, PasoConductor.tsx, PasoDescuentos.tsx, PasoPago.tsx, SegmentedControl.tsx] | lang=en
- "ui_selectwrapper": "SelectWrapper.tsx" | kind=code-symbol | source=features/via/infracciones/components/ui/SelectWrapper.tsx:L1 | neighbors=[23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, b5233a8 implementando via como modulo d…, f7b1aac Merge branch 'feature/testing' …, SeccionGarantia.tsx, SelectWrapper()] | lang=en
- "via_sa7": "sa7.ts" | kind=code-symbol | source=lib/via/sa7.ts:L1 | neighbors=[16a63d4 Merge branch 'feature/testing' …, 91c36bf validando orden de pago, ac48eb1 Merge pull request #17 from pre…, route.ts, pagos.ts, consultarEstatusSA7()] | lang=en
- "911_modulecard": "ModuleCard.tsx" | kind=code-symbol | source=components/911/ModuleCard.tsx:L1 | neighbors=[ModuleCard(), ModuleCardProps, Stat, a24949a Merge branch 'feature/testing' …, a667064 Page de seleccion de registro] | lang=en
- "admin_admin_styles_cardstyle": "cardStyle" | kind=code-symbol | source=app/admin/admin-styles.ts:L28 | neighbors=[admin-styles.ts, page.tsx, page.tsx, page.tsx, page.tsx] | lang=en
- "admin_types": "types.ts" | kind=code-symbol | source=lib/admin/types.ts:L1 | neighbors=[mapper.ts, repository.ts, RolItem, UsuarioLista, 12aab65 fase 4] | lang=en
- "agente_infracciones_types_capturainfractorinput": "CapturaInfractorInput" | kind=code-symbol | source=lib/agente_infracciones/types.ts:L33 | neighbors=[actions.ts, mapper.ts, repository.ts, service.ts, types.ts] | lang=en
- "agente_juzgado_botonverdetalle": "BotonVerDetalle.tsx" | kind=code-symbol | source=components/agente_juzgado/BotonVerDetalle.tsx:L1 | neighbors=[BotonVerDetalle(), BotonVerDetalleProps, JuzgadoDashboard.tsx, 75e03e9 puliendo flujo de juzgado-liber…, ff3622b Merge pull request #11 from pre…] | lang=en
- "agente_juzgado_types_solicitudevidencia": "SolicitudEvidencia" | kind=code-symbol | source=lib/agente_juzgado/types.ts:L135 | neighbors=[actions.ts, mapper.ts, service.ts, TabSolicitudes.tsx, types.ts] | lang=en
- "agente_juzgado_types_viainfracciondetalle": "ViaInfraccionDetalle" | kind=code-symbol | source=lib/agente_juzgado/types.ts:L125 | neighbors=[actions.ts, JuzgadoDashboard.tsx, mapper.ts, service.ts, types.ts] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@54d7324d5800f2fc2db384689934b3f092a82bb5": "54d7324 chore: dejar de versionar config MCP local de Alexandria" | kind=Commit | source=git | neighbors=[conexion, testing, 0caf5dd Fixes, fcdb169 chore(graphify): actualiza graf…, feature/testing] | lang=nl
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@6594f4a7d3f2e0fa3674302b4ae412dfd576f203": "6594f4a Flujos por Rol" | kind=Commit | source=git | neighbors=[conexion, testing, 290d651 feat(despacho): flujo integral …, ac9ad49 Merge branch 'feature/testing' …, feature/testing] | lang=pt
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@a7a7f2e084cd75996841e4eeb0019d3671cacfde": "a7a7f2e boveda" | kind=Commit | source=git | neighbors=[conexion, testing, a21f03f fix bugs reporte denuncia, e6bffc9 boveda conectada, feature/testing] | lang=pt
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@c776b5881c43c8a0acbc67cb9696f9b9a77735b3": "c776b58 Integrar Alexandria (bóveda de conocimiento local vía MCP)" | kind=Commit | source=git | neighbors=[conexion, testing, 5641e69 Merge branch 'feature/testing' …, ec3acf7 iniciando reset de testing, feature/testing] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@e211eefd572dbc8a9bedcdde8eb32d55fe19b171": "e211eef upload AGENTS" | kind=Commit | source=git | neighbors=[514a705 refactorizacion sql, conexion, testing, ad3ec5f mejorando esto, feature/testing] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@fcdb169e76940c47bc1f42e7975ee8fc19a49bed": "fcdb169 chore(graphify): actualiza grafo tras flujo integral de despacho" | kind=Commit | source=git | neighbors=[290d651 feat(despacho): flujo integral …, conexion, testing, 54d7324 chore: dejar de versionar confi…, feature/testing] | lang=nl
- "components_filadetenidorol": "FilaDetenidoRol.tsx" | kind=code-symbol | source=components/FilaDetenidoRol.tsx:L1 | neighbors=[388b997 Apartados para subir fotografia…, 672bab5 libearciones para juzgado, de5682f Merge pull request #10 from pre…, FilaDetenidoRol(), page.tsx] | lang=en
- "curp_route": "route.ts" | kind=code-symbol | source=app/api/via/curp/route.ts:L1 | neighbors=[23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, b5233a8 implementando via como modulo d…, f7b1aac Merge branch 'feature/testing' …, POST()] | lang=en
- "d1_mapper_rowtoreported1": "rowToReporteD1()" | kind=code-symbol | source=lib/d1/mapper.ts:L21 | neighbors=[mapper.ts, toBool(), toNum(), toStr(), repository.ts] | lang=en
- "d1_noiniciada_styles_styles": "styles" | kind=code-symbol | source=components/reportes/d1_noiniciada/styles.ts:L1 | neighbors=[DescargaFilters.tsx, DescargaPagination.tsx, DescargaTable.tsx, page.tsx, styles.ts] | lang=en
- "d1_styles_styles": "styles" | kind=code-symbol | source=components/reportes/d1/styles.ts:L3 | neighbors=[D1Filters.tsx, D1Pagination.tsx, D1ReportsTable.tsx, page.tsx, styles.ts] | lang=en
- "db_create_admin": "create-admin.ts" | kind=code-symbol | source=lib/db/create-admin.ts:L1 | neighbors=[6a042cd feat: sistema de autenticación,…, ffcea0c fase 1 completada, ADMIN, main(), pool] | lang=en
- "db_index": "index.ts" | kind=code-symbol | source=lib/db/index.ts:L1 | neighbors=[6a042cd feat: sistema de autenticación,…, db, schema.ts, db.ts, auth.ts] | lang=en
- "fiscalia_types_solicitudevidencia": "SolicitudEvidencia" | kind=code-symbol | source=lib/fiscalia/types.ts:L147 | neighbors=[actions.ts, mapper.ts, service.ts, TabSolicitudes.tsx, types.ts] | lang=en
- "flota_route": "route.ts" | kind=code-symbol | source=app/api/rol-servicios/externos/flota/route.ts:L1 | neighbors=[a58a0f7 Despachos, GET(), auth.ts, auth, 6feefe2 BackEnd completo para hacer la …] | lang=en
- "health_repository": "repository.ts" | kind=code-symbol | source=lib/health/repository.ts:L1 | neighbors=[ad3ec5f mejorando esto, ping(), db.ts, query(), route.ts] | lang=en
- "health_route": "route.ts" | kind=code-symbol | source=app/api/health/route.ts:L1 | neighbors=[6a042cd feat: sistema de autenticación,…, ad3ec5f mejorando esto, repository.ts, ping(), GET()] | lang=en
- "id_page_infraccionciudadanopage": "InfraccionCiudadanoPage()" | kind=code-symbol | source=app/infracciones/[id]/page.tsx:L64 | neighbors=[page.tsx, formatDate(), getStatusStyle(), sanitize(), timeAgo()] | lang=en
- "incidentes_actions_createalarmaescolar": "createAlarmaEscolar()" | kind=code-symbol | source=lib/incidentes/actions.ts:L702 | neighbors=[actions.ts, req(), requireOperador(), createIncidente(), createIncidenteCliente()] | lang=en
- "incidentes_actions_createextorsion": "createExtorsion()" | kind=code-symbol | source=lib/incidentes/actions.ts:L670 | neighbors=[actions.ts, req(), requireOperador(), createIncidente(), createIncidenteCliente()] | lang=en
- "incidentes_actions_validarenum": "validarEnum()" | kind=code-symbol | source=lib/incidentes/actions.ts:L37 | neighbors=[actions.ts, addPersonaAfectada(), createIncidente(), createIncidenteCliente(), insertarIncidente()] | lang=en
- "incidentes_mapper_rowtoincidentedetallecompletobase": "rowToIncidenteDetalleCompletoBase()" | kind=code-symbol | source=lib/incidentes/mapper.ts:L201 | neighbors=[mapper.ts, toBool(), toNum(), toStr(), repository.ts] | lang=en
- "incidentes_mapper_rowtoreportecampo": "rowToReporteCampo()" | kind=code-symbol | source=lib/incidentes/mapper.ts:L115 | neighbors=[mapper.ts, toBool(), toNum(), toStr(), repository.ts] | lang=en
- "incidentes_mapper_rowtoreportecampodetalle": "rowToReporteCampoDetalle()" | kind=code-symbol | source=lib/incidentes/mapper.ts:L237 | neighbors=[mapper.ts, toBool(), toNum(), toStr(), repository.ts] | lang=en
- "incidentes_mapper_tobool": "toBool()" | kind=code-symbol | source=lib/incidentes/mapper.ts:L32 | neighbors=[mapper.ts, rowToIncidenteConDespachoBase(), rowToIncidenteDetalleCompletoBase(), rowToReporteCampo(), rowToReporteCampoDetalle()] | lang=en
- "incidentes_statincidencia": "StatIncidencia.tsx" | kind=code-symbol | source=components/reportes/incidentes/StatIncidencia.tsx:L1 | neighbors=[2fcba7b vista de reportes de incidentes…, 552d291 Merge branch 'testing' into con…, e286619 Merge branch 'feature/testing' …, IncidenteStat(), page.tsx] | lang=en
- "incidentes_styles_styles": "styles" | kind=code-symbol | source=components/reportes/incidentes/styles.ts:L1 | neighbors=[FiltrosIncidencias.tsx, Paginacion.tsx, styles.ts, TablaIncidentes.tsx, page.tsx] | lang=en

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/cesarbr/Documents/dev/sjr/seguridad_publica/.graphify/description-instructions/batch-021.json

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
