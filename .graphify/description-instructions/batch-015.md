# Node Description Batch 16 of 79

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

- "commit:repo:github.com/presidenciaSJR/seguridad_publica@44a01c3e9031adf0c6ddd327f8c7833726e4c464": "44a01c3 fase 3-4-5" | kind=Commit | source=git | neighbors=[conexion, 12aab65 fase 4, route.ts, db.ts, route.ts, route.ts] | lang=pt
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@519716a61975d62ddcb9d3d0a1cfdaa3911e5a13": "519716a Formulario para registro de whatsapp" | kind=Commit | source=git | neighbors=[3a00521 Merge branch 'feature/testing' …, page.tsx, conexion, testing, c694543 cambio dee estatus, FormSection.tsx] | lang=pt
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@5abc683b075625daff20897a70efe2939d2eddbf": "5abc683 Merge branch 'feature/auxiliar' into feature/testing" | kind=Commit | source=git | neighbors=[25de428 Corrección para agregar el botó…, page.tsx, ProfileDropdownAuxiliar.tsx, conexion, testing, 23a3b9d Cambios en la estructura de los…] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@69a557f3c74b4d884dd90df831a14df224747f8f": "69a557f CAMBIO CORREGIDO" | kind=Commit | source=git | neighbors=[conexion, testing, 166a26b Merge branch 'feature/testing' …, ec57fd2 Form actualizado, page.tsx, route.ts] | lang=pt
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@7f3fe1ac2c04221ffa46cca74bc2018ff13df091": "7f3fe1a Formulariop de Rondines listo, falta revisarlo PERO YA ES FUNCIONAL" | kind=Commit | source=git | neighbors=[conexion, testing, Formulario911.tsx, 0844e6e Corregido, actions.ts, FormSection.tsx] | lang=es
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@905531c8d619a3e556b9255f7422e8466b2e8b64": "905531c trabajando en panel de fiscalia" | kind=Commit | source=git | neighbors=[090c4dd vista de fiscalia, conexion, testing, c194e54 envio de solicitud de evidencia…, actions.ts, PedirEvidenciasModal.tsx] | lang=nl
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@a2907e2eb0150bea16791d3d9786037d34db1dca": "a2907e2 Boton agregado para crear roles!" | kind=Commit | source=git | neighbors=[7400135 Merge branch 'feature/testing' …, page.tsx, conexion, testing, f80d33f Merge branch 'feature/testing' …, page.tsx] | lang=pt
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@c194e5488d641dda843f63b0e952d4081a438002": "c194e54 envio de solicitud de evidencias completado" | kind=Commit | source=git | neighbors=[905531c trabajando en panel de fiscalia, conexion, testing, c4523ac tabla de fiscalia, evidencias f…, mapper.ts, PedirEvidenciasModal.tsx] | lang=nl
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@d04a29d5489b7170722d56787613aa84473ef564": "d04a29d correccion de navegacion entre pagians" | kind=Commit | source=git | neighbors=[conexion, testing, 0c31cc2 Merge branch 'testing' into juz…, 126b4d1 Monitorista V1, a291695 Merge branch 'feature/testing' …, da33516 Merge pull request #3 from pres…] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@d2a4a5ebc66e5e7e114d49b2f87f28896f03a895": "d2a4a5e guardado de nuemro exterior, interior, e implementacion de mapa para gu…" | kind=Commit | source=git | neighbors=[7d7ebb1 merge de archivos, conexion, testing, 166a26b Merge branch 'feature/testing' …, 56a8ec4 Impkementacion de pa ay guardad…, schema.ts] | lang=pt
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@ea0242b7aa39a9b85d47f1d1346cb064b98394be": "ea0242b vista de juridico" | kind=Commit | source=git | neighbors=[c471e9c Merge pull request #15 from pre…, conexion, testing, 8355ac0 Merge branch 'feature/testing' …, page.tsx, page.tsx] | lang=nl
- "d1_mapper": "mapper.ts" | kind=code-symbol | source=lib/d1/mapper.ts:L1 | neighbors=[ad3ec5f mejorando esto, rowToReporteD1(), toBool(), toNum(), toStr(), types.ts] | lang=en
- "d1_noiniciada_descargapagination": "DescargaPagination.tsx" | kind=code-symbol | source=components/reportes/d1_noiniciada/DescargaPagination.tsx:L1 | neighbors=[4c9fa8a vista de reporte de d1 no inici…, 712c116 Merge branch 'testing' into con…, e286619 Merge branch 'feature/testing' …, DescargaPagination(), PaginationProps, styles.ts] | lang=en
- "d1_noiniciada_styles": "styles.ts" | kind=code-symbol | source=components/reportes/d1_noiniciada/styles.ts:L1 | neighbors=[4c9fa8a vista de reporte de d1 no inici…, 712c116 Merge branch 'testing' into con…, e286619 Merge branch 'feature/testing' …, DescargaFilters.tsx, DescargaPagination.tsx, DescargaTable.tsx] | lang=en
- "expediente_client_obtenerguesttoken": "obtenerGuestToken()" | kind=code-symbol | source=lib/expediente/client.ts:L7 | neighbors=[client.ts, actions.ts, expediente.ts, ppt-service.ts, route.ts, route.ts] | lang=en
- "fiscalia_types_detalleaseguradocompleto": "DetalleAseguradoCompleto" | kind=code-symbol | source=lib/fiscalia/types.ts:L55 | neighbors=[actions.ts, FormularioAseguradoJuzgado.tsx, actions.ts, FormularioAsegurado.tsx, FormularioPuestaDisposicion.tsx, mapper.ts] | lang=en
- "fiscalia_usetoaststore": "useToastStore.ts" | kind=code-symbol | source=lib/fiscalia/useToastStore.ts:L1 | neighbors=[5bbdda8 Merge pull request #8 from pres…, ff6d3c2 juzgado, CargarOficioSection.tsx, generateId(), Toast, ToastStore] | lang=en
- "incidentes_audit": "audit.ts" | kind=code-symbol | source=lib/incidentes/audit.ts:L1 | neighbors=[11be750 Fase 1 de correccion - completa…, 6feefe2 BackEnd completo para hacer la …, route.ts, actions.ts, Accion, registrarAudit()] | lang=en
- "incidentes_styles": "styles.ts" | kind=code-symbol | source=components/reportes/incidentes/styles.ts:L1 | neighbors=[2fcba7b vista de reportes de incidentes…, 552d291 Merge branch 'testing' into con…, e286619 Merge branch 'feature/testing' …, FiltrosIncidencias.tsx, Paginacion.tsx, styles] | lang=en
- "infracciones_actions": "actions.ts" | kind=code-symbol | source=features/via/infracciones/actions.ts:L1 | neighbors=[23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, b5233a8 implementando via como modulo d…, f7b1aac Merge branch 'feature/testing' …, FormularioInfraccion.tsx, eliminarInfraccionAction()] | lang=en
- "legalidad_types": "types.ts" | kind=code-symbol | source=features/via/legalidad/types.ts:L1 | neighbors=[23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, b5233a8 implementando via como modulo d…, f7b1aac Merge branch 'feature/testing' …, mapper.ts, service.ts] | lang=en
- "lib_error_handler_tryaction": "tryAction()" | kind=code-symbol | source=lib/error-handler.ts:L46 | neighbors=[actions.ts, actions.ts, actions.ts, error-handler.ts, actions.ts, actions.ts] | lang=en
- "lib_error_handler_tryactionraw": "tryActionRaw()" | kind=code-symbol | source=lib/error-handler.ts:L59 | neighbors=[actions.ts, actions.ts, actions.ts, error-handler.ts, actions.ts, actions.ts] | lang=en
- "liberar_garantia_route": "route.ts" | kind=code-symbol | source=app/api/via/infracciones/liberar-garantia/route.ts:L1 | neighbors=[16a63d4 Merge branch 'feature/testing' …, 91c36bf validando orden de pago, ac48eb1 Merge pull request #17 from pre…, ad3ec5f mejorando esto, ede5a1d eliminado referencias a via_pru…, repository.ts] | lang=en
- "manual_migrations_0006_formato_n_public_formato_n_reportes": "public.formato_n_reportes" | kind=code-symbol | source=lib/db/manual-migrations/0006_formato_n.sql:L88 | neighbors=[0006_formato_n.sql, formato_n_armas_aseguradas, formato_n_atencion_victimas, formato_n_eventos, formato_n_fge, formato_n_fgr] | lang=en
- "modulo_incidentes_styles_styles": "styles" | kind=code-symbol | source=components/reportes/modulo_incidentes/styles.ts:L1 | neighbors=[page.tsx, PhonePagination.tsx, PhoneReportsTable.tsx, PhoneStatsCards.tsx, page.tsx, ReportesTabs.tsx] | lang=en
- "oficial_mapapinfijo": "MapaPinFijo.tsx" | kind=code-symbol | source=components/oficial/MapaPinFijo.tsx:L1 | neighbors=[0c31cc2 Merge branch 'testing' into juz…, 44ebbc4 Merge branch 'feature/testing' …, a291695 Merge branch 'feature/testing' …, b79a96a Conexión entre ambos modulos, page.tsx, MapaPinFijo()] | lang=en
- "oficial_toastexito": "ToastExito.tsx" | kind=code-symbol | source=components/oficial/ToastExito.tsx:L1 | neighbors=[page.tsx, 44ebbc4 Merge branch 'feature/testing' …, 458bbfb registro de reporte de campo - …, 93dd3ea Merge pull request #1 from pres…, aaddee5 Merge branch 'feature/testing' …, page.tsx] | lang=en
- "oficiales_service": "service.ts" | kind=code-symbol | source=features/via/oficiales/service.ts:L1 | neighbors=[23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, b5233a8 implementando via como modulo d…, f7b1aac Merge branch 'feature/testing' …, repository.ts, OficialesViaRepository] | lang=en
- "proxy": "proxy.ts" | kind=code-symbol | source=proxy.ts:L1 | neighbors=[6a042cd feat: sistema de autenticación,…, 6cb1055 Mejoras de UI/UIX, auth.ts, Session, config, isPublic()] | lang=en
- "reportes_incidentes_mapper": "mapper.ts" | kind=code-symbol | source=lib/reportes-incidentes/mapper.ts:L1 | neighbors=[ad3ec5f mejorando esto, rowToReporteDiario(), rowToReporteSemanal(), toNum(), types.ts, ReporteDiarioRow] | lang=en
- "reportes_incidentes_types": "types.ts" | kind=code-symbol | source=lib/reportes-incidentes/types.ts:L1 | neighbors=[ad3ec5f mejorando esto, mapper.ts, repository.ts, service.ts, ReporteDiarioRow, ReporteIncidenteCombinado] | lang=en
- "reportes_menuoption": "menuOption.tsx" | kind=code-symbol | source=components/reportes/menuOption.tsx:L1 | neighbors=[b170599 Merge branch 'feature/testing' …, b403f89 Vista para reportes de incident…, bd1a223 Merge branch 'feature/vistas-re…, page.tsx, OptionSquare(), OptionSquareProps] | lang=en
- "rol_servicios_mapper_tobool": "toBool()" | kind=code-symbol | source=lib/rol-servicios/mapper.ts:L18 | neighbors=[mapper.ts, rowToBodyCam(), rowToEstadoFuerzaConcepto(), rowToMedioCanalizacion(), rowToRadio(), rowToSector()] | lang=en
- "services_analistaservice": "analistaService.ts" | kind=code-symbol | source=services/analistaService.ts:L1 | neighbors=[formAnalisis.tsx, 2ca9f50 Formulario sin backend, 5618308 guardado e evidencias con ed, 9550203 Cambios en presentacion, se gen…, 9d67ddf Cambios de formulario analisis, 9faf222 Merge branch 'feature/testing' …] | lang=en
- "steps_pasoconfirmacionpago": "PasoConfirmacionPago.tsx" | kind=code-symbol | source=features/via/infracciones/components/steps/PasoConfirmacionPago.tsx:L1 | neighbors=[23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, b5233a8 implementando via como modulo d…, f7b1aac Merge branch 'feature/testing' …, FormularioInfraccion.tsx, PasoConfirmacion.tsx] | lang=en
- "tabladevinfracciones_detalleinfraccionmodal": "DetalleInfraccionModal.tsx" | kind=code-symbol | source=features/depInfracciones/components/TablaDevInfracciones/DetalleInfraccionModal.tsx:L1 | neighbors=[0b210fa Merge pull request #12 from pre…, 1acddac Merge branch 'feature/testing' …, 4400923 Merge branch 'feature/testing' …, 46f24f8 generica function for infractio…, e286619 Merge branch 'feature/testing' …, DetalleInfraccionModal()] | lang=en
- "ui_cardtitle_cardtitle": "CardTitle()" | kind=code-symbol | source=features/via/infracciones/components/ui/CardTitle.tsx:L1 | neighbors=[PasoCiudadano.tsx, PasoConductor.tsx, PasoDescuentos.tsx, PasoPago.tsx, PasoVehiculo.tsx, SeccionGarantia.tsx] | lang=en
- "ui_customselect": "CustomSelect.tsx" | kind=code-symbol | source=features/via/infracciones/components/ui/CustomSelect.tsx:L1 | neighbors=[23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, b5233a8 implementando via como modulo d…, f7b1aac Merge branch 'feature/testing' …, SeccionMotivo.tsx, CustomSelect()] | lang=en
- "via_online": "online.ts" | kind=code-symbol | source=lib/via/online.ts:L1 | neighbors=[23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, b5233a8 implementando via como modulo d…, f7b1aac Merge branch 'feature/testing' …, FormularioInfraccion.tsx, getSnapshot()] | lang=en

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/cesarbr/Documents/dev/sjr/seguridad_publica/.graphify/description-instructions/batch-015.json

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
