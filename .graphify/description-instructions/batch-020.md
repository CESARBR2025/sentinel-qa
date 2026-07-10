# Node Description Batch 21 of 82

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

- "hooks_useregistrodetenido": "useRegistroDetenido.ts" | kind=code-symbol | source=hooks/useRegistroDetenido.ts:L1 | neighbors=[generarPresentacion.tsx, 06c55f5 Merge branch 'feature/testing' …, 41ea169 Merge branch 'testing' into con…, 5830570 Seccion de analista, uya con bd…, a353e63 Ya se enlazan datos pero no com…, useRegistroDetenido()] | lang=en
- "incidentes_folio": "folio.ts" | kind=code-symbol | source=lib/incidentes/folio.ts:L1 | neighbors=[11be750 Fase 1 de correccion - completa…, 6feefe2 BackEnd completo para hacer la …, actions.ts, generarFolioIncidente(), db.ts, query()] | lang=en
- "incidentes_permisos_tienepermiso": "tienePermiso()" | kind=code-symbol | source=lib/incidentes/permisos.ts:L13 | neighbors=[actions.ts, page.tsx, page.tsx, permisos.ts, verificarAccesoIncidentesApi(), page.tsx] | lang=en
- "infracciones_service_infraccionesservice": "InfraccionesService" | kind=code-symbol | source=features/via/infracciones/service.ts:L32 | neighbors=[page.tsx, route.ts, service.ts, .obtenerPorId(), .registrarNuevaInfraccionSV(), route.ts] | lang=en
- "manual_migrations_0008_monitorista_permisos": "0008_monitorista_permisos.sql" | kind=code-symbol | source=lib/db/manual-migrations/0008_monitorista_permisos.sql:L1 | neighbors=[27dcb21 Merge branch 'feature/testing' …, 5618308 guardado e evidencias con ed, 77ddf58 Merge branch 'feature/testing' …, f2c66e6 Extender roles y permisos finos…, monitorista_permisos, users] | lang=en
- "manual_migrations_0011_permisos_plantillas": "0011_permisos_plantillas.sql" | kind=code-symbol | source=lib/db/manual-migrations/0011_permisos_plantillas.sql:L1 | neighbors=[27dcb21 Merge branch 'feature/testing' …, 5618308 guardado e evidencias con ed, 77ddf58 Merge branch 'feature/testing' …, f2c66e6 Extender roles y permisos finos…, permisos_plantillas, roles] | lang=en
- "prevencion_semaforo": "semaforo.ts" | kind=code-symbol | source=lib/prevencion/semaforo.ts:L1 | neighbors=[5558751 feat: módulo Prevención del Del…, page.tsx, page.tsx, calcularSemaforoVigencia(), SemaforoColor, SemaforoVigencia.tsx] | lang=en
- "reportes_sin_d1_mapper": "mapper.ts" | kind=code-symbol | source=lib/reportes-sin-d1/mapper.ts:L1 | neighbors=[ad3ec5f mejorando esto, rowToSinD1(), toStr(), types.ts, SinD1Row, repository.ts] | lang=en
- "reportes_sin_novedad_mapper": "mapper.ts" | kind=code-symbol | source=lib/reportes-sin-novedad/mapper.ts:L1 | neighbors=[ad3ec5f mejorando esto, rowToSinNovedad(), toStr(), types.ts, SinNovedadRow, repository.ts] | lang=en
- "reportes_welcomebanner": "welcomeBanner.tsx" | kind=code-symbol | source=components/reportes/welcomeBanner.tsx:L1 | neighbors=[b170599 Merge branch 'feature/testing' …, b403f89 Vista para reportes de incident…, bd1a223 Merge branch 'feature/vistas-re…, page.tsx, page.tsx, SentinelHero()] | lang=en
- "rol_servicios_mapper_tostr": "toStr()" | kind=code-symbol | source=lib/rol-servicios/mapper.ts:L7 | neighbors=[mapper.ts, rowToEstadoFuerzaConcepto(), rowToRadio(), rowToRolAsignacion(), rowToRolObservacion(), rowToRolServicio()] | lang=en
- "rol_servicios_rolinputs": "RolInputs.tsx" | kind=code-symbol | source=components/rol_servicios/RolInputs.tsx:L1 | neighbors=[b68a2b7 Merge branch 'feature/testing' …, f9243ac Interfaz de formulario de rol d…, page.tsx, Props, RolField(), RegistroIncidenteForm.tsx] | lang=en
- "rol_servicios_servicefooter": "ServiceFooter.tsx" | kind=code-symbol | source=components/rol_servicios/ServiceFooter.tsx:L1 | neighbors=[b68a2b7 Merge branch 'feature/testing' …, f9243ac Interfaz de formulario de rol d…, page.tsx, ServiceFooter(), SignatureModal.tsx, SignatureModal()] | lang=en
- "sasiete_client": "client.ts" | kind=code-symbol | source=features/via/saSiete/client.ts:L1 | neighbors=[23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, b5233a8 implementando via como modulo d…, f7b1aac Merge branch 'feature/testing' …, FormularioInfraccion.tsx, generarOrdenPago()] | lang=en
- "services_registrodetenidoservice": "registroDetenidoService.ts" | kind=code-symbol | source=services/registroDetenidoService.ts:L1 | neighbors=[generarPresentacion.tsx, 5618308 guardado e evidencias con ed, 5830570 Seccion de analista, uya con bd…, 9550203 Cambios en presentacion, se gen…, 9faf222 Merge branch 'feature/testing' …, registroDetenidoService] | lang=en
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
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@4af36d9243dd6dd33472459b3792bbc43df81b0d": "4af36d9 Merge pull request #18 from presidenciaSJR/conexion" | kind=Commit | source=git | neighbors=[feature/testing, 046f18c Merge pull request #19 from pre…, 5641e69 Merge branch 'feature/testing' …, ec3acf7 iniciando reset de testing, fe98642 modificando agents.md] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@ec3acf726484fbb76f804cebaf190c461ef704f2": "ec3acf7 iniciando reset de testing" | kind=Commit | source=git | neighbors=[9d803f2 fix api maps, feature/testing, 4af36d9 Merge pull request #18 from pre…, c776b58 Integrar Alexandria (bóveda de …, fe98642 modificando agents.md] | lang=nl
- "components_filadetenidorol": "FilaDetenidoRol.tsx" | kind=code-symbol | source=components/FilaDetenidoRol.tsx:L1 | neighbors=[388b997 Apartados para subir fotografia…, 672bab5 libearciones para juzgado, de5682f Merge pull request #10 from pre…, FilaDetenidoRol(), page.tsx] | lang=en
- "curp_route": "route.ts" | kind=code-symbol | source=app/api/via/curp/route.ts:L1 | neighbors=[23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, b5233a8 implementando via como modulo d…, f7b1aac Merge branch 'feature/testing' …, POST()] | lang=en
- "d1_mapper_rowtoreported1": "rowToReporteD1()" | kind=code-symbol | source=lib/d1/mapper.ts:L21 | neighbors=[mapper.ts, toBool(), toNum(), toStr(), repository.ts] | lang=en
- "d1_noiniciada_styles_styles": "styles" | kind=code-symbol | source=components/reportes/d1_noiniciada/styles.ts:L1 | neighbors=[DescargaFilters.tsx, DescargaPagination.tsx, DescargaTable.tsx, page.tsx, styles.ts] | lang=en
- "d1_styles_styles": "styles" | kind=code-symbol | source=components/reportes/d1/styles.ts:L3 | neighbors=[D1Filters.tsx, D1Pagination.tsx, D1ReportsTable.tsx, page.tsx, styles.ts] | lang=en
- "db_create_admin": "create-admin.ts" | kind=code-symbol | source=lib/db/create-admin.ts:L1 | neighbors=[6a042cd feat: sistema de autenticación,…, ffcea0c fase 1 completada, ADMIN, main(), pool] | lang=en
- "db_index": "index.ts" | kind=code-symbol | source=lib/db/index.ts:L1 | neighbors=[6a042cd feat: sistema de autenticación,…, db, schema.ts, db.ts, auth.ts] | lang=en
- "fiscalia_types_solicitudevidencia": "SolicitudEvidencia" | kind=code-symbol | source=lib/fiscalia/types.ts:L147 | neighbors=[actions.ts, mapper.ts, service.ts, TabSolicitudes.tsx, types.ts] | lang=en
- "flota_route": "route.ts" | kind=code-symbol | source=app/api/rol-servicios/externos/flota/route.ts:L1 | neighbors=[6feefe2 BackEnd completo para hacer la …, a58a0f7 Despachos, GET(), auth.ts, auth] | lang=en
- "health_repository": "repository.ts" | kind=code-symbol | source=lib/health/repository.ts:L1 | neighbors=[ad3ec5f mejorando esto, ping(), db.ts, query(), route.ts] | lang=en

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/ugomez/Documents/GitHub/seguridad_publica/.graphify/description-instructions/batch-020.json

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
