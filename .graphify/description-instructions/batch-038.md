# Node Description Batch 39 of 87

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

- "components_modalentregargarantia_modalentregargarantia": "ModalEntregarGarantia()" | kind=code-symbol | source=features/via/infracciones/components/ModalEntregarGarantia.tsx:L22 | neighbors=[ModalEntregarGarantia.tsx, getGarantiaInfo()]
- "components_seccionliberacion_getestatusconfig": "getEstatusConfig()" | kind=code-symbol | source=features/via/infracciones/components/SeccionLiberacion.tsx:L87 | neighbors=[SeccionLiberacion.tsx, SeccionLiberacion()]
- "components_seccionliberacion_seccionliberacion": "SeccionLiberacion()" | kind=code-symbol | source=features/via/infracciones/components/SeccionLiberacion.tsx:L136 | neighbors=[SeccionLiberacion.tsx, getEstatusConfig()]
- "corralon_mapper_tostr": "toStr()" | kind=code-symbol | source=lib/corralon/mapper.ts:L3 | neighbors=[mapper.ts, rowToSolicitud()]
- "corralon_module_card_modulecard": "ModuleCard()" | kind=code-symbol | source=app/corralon/module-card.tsx:L6 | neighbors=[module-card.tsx, page.tsx]
- "corralon_permisos_secciones": "SECCIONES" | kind=code-symbol | source=lib/corralon/permisos.ts:L3 | neighbors=[permisos.ts, registro.ts]
- "corralon_repository_finalizarinfraccioncorralon": "finalizarInfraccionCorralon()" | kind=code-symbol | source=lib/corralon/repository.ts:L35 | neighbors=[repository.ts, route.ts]
- "corralon_repository_obtenerestatusinfraccion": "obtenerEstatusInfraccion()" | kind=code-symbol | source=lib/corralon/repository.ts:L27 | neighbors=[repository.ts, route.ts]
- "corralon_repository_obtenersolicitudesfinalizadas": "obtenerSolicitudesFinalizadas()" | kind=code-symbol | source=lib/corralon/repository.ts:L47 | neighbors=[repository.ts, service.ts]
- "corralon_repository_obtenersolicitudespendientes": "obtenerSolicitudesPendientes()" | kind=code-symbol | source=lib/corralon/repository.ts:L3 | neighbors=[repository.ts, service.ts]
- "corralon_service_listarsolicitudesfinalizadas": "listarSolicitudesFinalizadas()" | kind=code-symbol | source=lib/corralon/service.ts:L10 | neighbors=[actions.ts, service.ts]
- "corralon_service_listarsolicitudespendientes": "listarSolicitudesPendientes()" | kind=code-symbol | source=lib/corralon/service.ts:L5 | neighbors=[actions.ts, service.ts]
- "corralon_types_tabsolicitudes": "TabSolicitudes" | kind=code-symbol | source=lib/corralon/types.ts:L24 | neighbors=[types.ts, solicitudes-client.tsx]
- "corralon_types_userinfo": "UserInfo" | kind=code-symbol | source=lib/corralon/types.ts:L1 | neighbors=[actions.ts, types.ts]
- "d1_d1filters_d1filters": "D1Filters()" | kind=code-symbol | source=components/reportes/d1/D1Filters.tsx:L7 | neighbors=[D1Filters.tsx, page.tsx]
- "d1_d1pagination_d1pagination": "D1Pagination()" | kind=code-symbol | source=components/reportes/d1/D1Pagination.tsx:L14 | neighbors=[D1Pagination.tsx, D1ReportsTable.tsx]
- "d1_d1reportstable_d1reportstable": "D1ReportsTable()" | kind=code-symbol | source=components/reportes/d1/D1ReportsTable.tsx:L7 | neighbors=[D1ReportsTable.tsx, page.tsx]
- "d1_mapper_tobool": "toBool()" | kind=code-symbol | source=lib/d1/mapper.ts:L15 | neighbors=[mapper.ts, rowToReporteD1()]
- "d1_mapper_tonum": "toNum()" | kind=code-symbol | source=lib/d1/mapper.ts:L9 | neighbors=[mapper.ts, rowToReporteD1()]
- "d1_mapper_tostr": "toStr()" | kind=code-symbol | source=lib/d1/mapper.ts:L3 | neighbors=[mapper.ts, rowToReporteD1()]
- "d1_noiniciada_descargafilters_descargafilters": "DescargaFilters()" | kind=code-symbol | source=components/reportes/d1_noiniciada/DescargaFilters.tsx:L7 | neighbors=[DescargaFilters.tsx, page.tsx]
- "d1_noiniciada_descargapagination_descargapagination": "DescargaPagination()" | kind=code-symbol | source=components/reportes/d1_noiniciada/DescargaPagination.tsx:L13 | neighbors=[DescargaPagination.tsx, DescargaTable.tsx]
- "d1_noiniciada_descargatable_descargatable": "DescargaTable()" | kind=code-symbol | source=components/reportes/d1_noiniciada/DescargaTable.tsx:L7 | neighbors=[DescargaTable.tsx, page.tsx]
- "d1_repository_insertarreportedenuncia": "insertarReporteDenuncia()" | kind=code-symbol | source=lib/d1/repository.ts:L13 | neighbors=[repository.ts, route.ts]
- "d1_repository_obtenerreportesd1": "obtenerReportesD1()" | kind=code-symbol | source=lib/d1/repository.ts:L93 | neighbors=[repository.ts, service.ts]
- "d1_repository_verificarfoliodenunciaunico": "verificarFolioDenunciaUnico()" | kind=code-symbol | source=lib/d1/repository.ts:L5 | neighbors=[repository.ts, route.ts]
- "dashboard_enable_2fa_enable2fa": "Enable2FA()" | kind=code-symbol | source=app/dashboard/enable-2fa.tsx:L7 | neighbors=[enable-2fa.tsx, page.tsx]
- "dashboard_module_cards_modulecards": "ModuleCards()" | kind=code-symbol | source=app/dashboard/module-cards.tsx:L260 | neighbors=[module-cards.tsx, page.tsx]
- "db_index_db": "db" | kind=code-symbol | source=lib/db/index.ts:L5 | neighbors=[index.ts, auth.ts]
- "denuncias_stored1_used1formstore": "useD1FormStore" | kind=code-symbol | source=lib/denuncias/storeD1.ts:L52 | neighbors=[FormularioD1.tsx, storeD1.ts]
- "despacho_despachoform_despachoform": "DespachoForm()" | kind=code-symbol | source=components/911/despacho/DespachoForm.tsx:L19 | neighbors=[DespachoForm.tsx, TablonDespacho.tsx]
- "despacho_tablondespacho_tablondespacho": "TablonDespacho()" | kind=code-symbol | source=components/911/despacho/TablonDespacho.tsx:L29 | neighbors=[page.tsx, TablonDespacho.tsx]
- "deteccion_camara_reportfilters_reportfilters": "ReportFilters()" | kind=code-symbol | source=components/reportes/deteccion_camara/ReportFilters.tsx:L7 | neighbors=[ReportFilters.tsx, page.tsx]
- "deteccion_camara_reporttables_reporttable": "ReportTable()" | kind=code-symbol | source=components/reportes/deteccion_camara/ReportTables.tsx:L4 | neighbors=[ReportTables.tsx, page.tsx]
- "emails_mailer_sendmail": "sendMail()" | kind=code-symbol | source=lib/emails/mailer.ts:L28 | neighbors=[mailer.ts, server.ts]
- "emails_server_enviarcorreoasignacionfiscalia": "enviarCorreoAsignacionFiscalia()" | kind=code-symbol | source=lib/emails/server.ts:L12 | neighbors=[server.ts, actions.ts]
- "emails_server_enviarcorreoordenliberacion": "enviarCorreoOrdenLiberacion()" | kind=code-symbol | source=lib/emails/server.ts:L39 | neighbors=[server.ts, route.ts]
- "eslint_config": "eslint.config.mjs" | kind=code-symbol | source=eslint.config.mjs:L1 | neighbors=[90da1ca Initial commit from Create Next…, eslintConfig]
- "estadisticos_phonereportstable_phonereportstable": "PhoneReportsTable()" | kind=code-symbol | source=components/reportes/estadisticos/PhoneReportsTable.tsx:L13 | neighbors=[page.tsx, PhoneReportsTable.tsx]
- "estadisticos_phonestatscards_phonestatscards": "PhoneStatsCards()" | kind=code-symbol | source=components/reportes/estadisticos/PhoneStatsCards.tsx:L5 | neighbors=[page.tsx, PhoneStatsCards.tsx]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/cesarbr/Documents/dev/sjr/seguridad_publica/.graphify/description-instructions/batch-038.json

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
