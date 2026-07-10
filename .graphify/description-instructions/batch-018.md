# Node Description Batch 19 of 79

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

- "helpers_abrirdocumento": "abrirDocumento.ts" | kind=code-symbol | source=features/via/expediente/helpers/abrirDocumento.ts:L1 | neighbors=[16a63d4 Merge branch 'feature/testing' …, 91c36bf validando orden de pago, ac48eb1 Merge pull request #17 from pre…, af993fb Fix/Monitorista, f5fac0b Merge branch 'testing' into con…, abrirDocumento()] | lang=en
- "hooks_useempleado": "useEmpleado.ts" | kind=code-symbol | source=hooks/useEmpleado.ts:L1 | neighbors=[6feefe2 BackEnd completo para hacer la …, a58a0f7 Despachos, DespachoForm.tsx, EmpleadoResult, useEmpleado(), FormSection.tsx] | lang=en
- "hooks_useflota": "useFlota.ts" | kind=code-symbol | source=hooks/useFlota.ts:L1 | neighbors=[6feefe2 BackEnd completo para hacer la …, a58a0f7 Despachos, DespachoForm.tsx, FiltrosFlota, useFlota(), VehiculoOption] | lang=en
- "hooks_useregistrodetenido": "useRegistroDetenido.ts" | kind=code-symbol | source=hooks/useRegistroDetenido.ts:L1 | neighbors=[generarPresentacion.tsx, 06c55f5 Merge branch 'feature/testing' …, 41ea169 Merge branch 'testing' into con…, 5830570 Seccion de analista, uya con bd…, a353e63 Ya se enlazan datos pero no com…, useRegistroDetenido()] | lang=en
- "incidentes_folio": "folio.ts" | kind=code-symbol | source=lib/incidentes/folio.ts:L1 | neighbors=[11be750 Fase 1 de correccion - completa…, 6feefe2 BackEnd completo para hacer la …, actions.ts, generarFolioIncidente(), db.ts, query()] | lang=en
- "incidentes_permisos_tienepermiso": "tienePermiso()" | kind=code-symbol | source=lib/incidentes/permisos.ts:L14 | neighbors=[actions.ts, page.tsx, page.tsx, permisos.ts, verificarAccesoIncidentesApi(), page.tsx] | lang=en
- "infracciones_service_infraccionesservice": "InfraccionesService" | kind=code-symbol | source=features/via/infracciones/service.ts:L32 | neighbors=[page.tsx, route.ts, service.ts, .obtenerPorId(), .registrarNuevaInfraccionSV(), route.ts] | lang=en
- "manual_migrations_0008_monitorista_permisos": "0008_monitorista_permisos.sql" | kind=code-symbol | source=lib/db/manual-migrations/0008_monitorista_permisos.sql:L1 | neighbors=[27dcb21 Merge branch 'feature/testing' …, 5618308 guardado e evidencias con ed, 77ddf58 Merge branch 'feature/testing' …, f2c66e6 Extender roles y permisos finos…, monitorista_permisos, users] | lang=en
- "manual_migrations_0011_permisos_plantillas": "0011_permisos_plantillas.sql" | kind=code-symbol | source=lib/db/manual-migrations/0011_permisos_plantillas.sql:L1 | neighbors=[27dcb21 Merge branch 'feature/testing' …, 5618308 guardado e evidencias con ed, 77ddf58 Merge branch 'feature/testing' …, f2c66e6 Extender roles y permisos finos…, permisos_plantillas, roles] | lang=en
- "prevencion_semaforo": "semaforo.ts" | kind=code-symbol | source=lib/prevencion/semaforo.ts:L1 | neighbors=[5558751 feat: módulo Prevención del Del…, page.tsx, page.tsx, calcularSemaforoVigencia(), SemaforoColor, SemaforoVigencia.tsx] | lang=en
- "reportes_sin_d1_mapper": "mapper.ts" | kind=code-symbol | source=lib/reportes-sin-d1/mapper.ts:L1 | neighbors=[ad3ec5f mejorando esto, rowToSinD1(), toStr(), types.ts, SinD1Row, repository.ts] | lang=en
- "reportes_sin_novedad_mapper": "mapper.ts" | kind=code-symbol | source=lib/reportes-sin-novedad/mapper.ts:L1 | neighbors=[ad3ec5f mejorando esto, rowToSinNovedad(), toStr(), types.ts, SinNovedadRow, repository.ts] | lang=en
- "reportes_welcomebanner": "welcomeBanner.tsx" | kind=code-symbol | source=components/reportes/welcomeBanner.tsx:L1 | neighbors=[b170599 Merge branch 'feature/testing' …, b403f89 Vista para reportes de incident…, bd1a223 Merge branch 'feature/vistas-re…, page.tsx, page.tsx, SentinelHero()] | lang=en
- "rol_servicios_mapper_tostr": "toStr()" | kind=code-symbol | source=lib/rol-servicios/mapper.ts:L7 | neighbors=[mapper.ts, rowToEstadoFuerzaConcepto(), rowToRadio(), rowToRolAsignacion(), rowToRolObservacion(), rowToRolServicio()] | lang=en
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
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@0c8695c15b5c89d0871fbbc3841f5fc2a7f80bcf": "0c8695c Cambios en filtros" | kind=Commit | source=git | neighbors=[conexion, testing, ef95840 Merge branch 'feature/testing' …, DescargaFilters.tsx, 4c9fa8a vista de reporte de d1 no inici…] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@1265204bc97feaa6fb75df1806e9897fa23366a9": "1265204 paginacion por tablas" | kind=Commit | source=git | neighbors=[conexion, testing, 5bbdda8 Merge pull request #8 from pres…, ReportTables.tsx, 24626eb se agregan opciones de reportes] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@133bb9d68dd354e2a1b062f5d4f641bc8757a9ed": "133bb9d pages de listado de llamadas y de radio" | kind=Commit | source=git | neighbors=[conexion, testing, 3b0e087 NAVEGACION, 83f48a2 Merge branch 'feature/correccio…, page.tsx] | lang=nl
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@14fd73a756023438fbf34a9d9a02918f6c8a51fb": "14fd73a Update FormSection.tsx" | kind=Commit | source=git | neighbors=[conexion, testing, d5e0e56 Campo para agregar detenidos de…, FormSection.tsx, d665f95 Camo dinamico y cambio a select…] | lang=pt
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@18f5bac124f7a516e4c794e54c13763523e60419": "18f5bac llamada en card" | kind=Commit | source=git | neighbors=[conexion, testing, 22b7b54 Merge branch 'feature/reportes'…, page.tsx, 719b5ab cambio para generacion de repor…] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@24626eb982afa43f645cacc5f1a4a61b73739a55": "24626eb se agregan opciones de reportes" | kind=Commit | source=git | neighbors=[conexion, testing, 1265204 paginacion por tablas, ReportesTabs.tsx, b170599 Merge branch 'feature/testing' …] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@283f34200d56b11b1f2b38d62deeddc6d77e1f33": "283f342 Merge branch 'feature/testing' of https://github.com/presidenciaSJR/seg…" | kind=Commit | source=git | neighbors=[testing, 3a00521 Merge branch 'feature/testing' …, module-cards.tsx, 3b10d72 Merge branch 'feature/testing' …, 6488a30 Formulario sin backend de 911 l…] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@2be4ca9ae4ff3a5d1b237b09267954a3b2df39fb": "2be4ca9 Cambio en header" | kind=Commit | source=git | neighbors=[testing, 3a00521 Merge branch 'feature/testing' …, Header.tsx, 3b10d72 Merge branch 'feature/testing' …, conexion] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@2e36377810689a31202162fcc8384625f96efb23": "2e36377 Eliminar tutoriales de flujo innecesarios" | kind=Commit | source=git | neighbors=[199ce68 Merge branch 'main' of https://…, conexion, main, testing, aaab50d Merge branch 'main' of https://…] | lang=nl
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@305b0bd60493abe88ef39584578d98eb13825846": "305b0bd se quitan campos" | kind=Commit | source=git | neighbors=[conexion, testing, 917002a Guardado de policia a cargo, FormSection.tsx, 81b9829 Cambios para guardado de persin…] | lang=es
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@3800cab22dfc4c9c5936d59d18ae8d7fc2d84b00": "3800cab formulario de nueva medida de proteccion" | kind=Commit | source=git | neighbors=[1970615 vista de medidas, conexion, testing, adf0c3d vista de busqueda y juridico, page.tsx] | lang=nl

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/cesarbr/Documents/dev/sjr/seguridad_publica/.graphify/description-instructions/batch-018.json

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
