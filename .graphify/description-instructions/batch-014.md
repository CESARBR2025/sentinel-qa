# Node Description Batch 15 of 79

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

- "oficial_service_verificarroloficial": "verificarRolOficial()" | kind=code-symbol | source=lib/oficial/service.ts:L71 | neighbors=[page.tsx, page.tsx, page.tsx, page.tsx, page.tsx, page.tsx] | lang=en
- "oficiales_types": "types.ts" | kind=code-symbol | source=features/via/oficiales/types.ts:L1 | neighbors=[067c4de arreglando flujo de fiscalia  a…, 16a63d4 Merge branch 'feature/testing' …, 23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, ac48eb1 Merge pull request #17 from pre…, b5233a8 implementando via como modulo d…] | lang=en
- "prevencion_medidasfiltros": "MedidasFiltros.tsx" | kind=code-symbol | source=components/prevencion/MedidasFiltros.tsx:L1 | neighbors=[06c55f5 Merge branch 'feature/testing' …, 0e33bf6 feat: módulo Admin, Prórroga, F…, 1970615 vista de medidas, 41ea169 Merge branch 'testing' into con…, 8355ac0 Merge branch 'feature/testing' …, page.tsx] | lang=en
- "prevencion_permisos_tieneaccesoseccion": "tieneAccesoSeccion()" | kind=code-symbol | source=lib/prevencion/permisos.ts:L45 | neighbors=[page.tsx, page.tsx, page.tsx, page.tsx, page.tsx, actions.ts] | lang=en
- "prevencion_permisos_tienepermiso": "tienePermiso()" | kind=code-symbol | source=lib/prevencion/permisos.ts:L14 | neighbors=[page.tsx, page.tsx, page.tsx, page.tsx, page.tsx, page.tsx] | lang=en
- "prevencion_solicitudc4form": "SolicitudC4Form.tsx" | kind=code-symbol | source=components/prevencion/SolicitudC4Form.tsx:L1 | neighbors=[5558751 feat: módulo Prevención del Del…, 5618308 guardado e evidencias con ed, 8355ac0 Merge branch 'feature/testing' …, 9faf222 Merge branch 'feature/testing' …, ea0242b vista de juridico, page.tsx] | lang=en
- "rol_servicios_actions_requiresession": "requireSession()" | kind=code-symbol | source=lib/rol-servicios/actions.ts:L11 | neighbors=[actions.ts, createAsignacion(), createObservacion(), createRol(), deleteAsignacion(), deleteObservacion()] | lang=en
- "rol_servicios_catalogos_actions_req": "req()" | kind=code-symbol | source=lib/rol-servicios/catalogos-actions.ts:L20 | neighbors=[catalogos-actions.ts, createBodyCam(), createConcepto(), createMedioCanalizacion(), createRadio(), createSector()] | lang=en
- "rol_servicios_catalogos_actions_requireadmin": "requireAdmin()" | kind=code-symbol | source=lib/rol-servicios/catalogos-actions.ts:L10 | neighbors=[catalogos-actions.ts, createBodyCam(), createConcepto(), createMedioCanalizacion(), createRadio(), createSector()] | lang=en
- "sasiete_repository_sa7repository": "SA7Repository" | kind=code-symbol | source=features/via/saSiete/repository.ts:L5 | neighbors=[route.ts, route.ts, route.ts, repository.ts, .actualizarOrdenPago(), .buscarOrdenPorInfraccionId()] | lang=en
- "scripts_exportar_schema": "exportar-schema.ts" | kind=code-symbol | source=scripts/exportar-schema.ts:L1 | neighbors=[e6bffc9 boveda conectada, db.ts, ColumnInfo, getColumns(), getEnums(), getTables()] | lang=en
- "services_analisisservice": "analisisService.ts" | kind=code-symbol | source=services/analisisService.ts:L1 | neighbors=[formAnalisis.tsx, generarPresentacion.tsx, TablonAnalisis.tsx, 06c55f5 Merge branch 'feature/testing' …, 3249f00 Cambios en rellenado de ppt!, 41ea169 Merge branch 'testing' into con…] | lang=en
- "shared_direcciongooglemaps": "DireccionGoogleMaps.tsx" | kind=code-symbol | source=components/shared/DireccionGoogleMaps.tsx:L1 | neighbors=[CapturarDetallesForm.tsx, 5f13b34 Merge branch 'feature/testing' …, 92393e7 flujo completado de juzgado, a7218bd Merge pull request #4 from pres…, ce84893 Merge branch 'feature/testing' …, CapturarDetallesForm.tsx] | lang=en
- "sin_robos_styles": "styles.ts" | kind=code-symbol | source=components/reportes/sin_robos/styles.ts:L1 | neighbors=[156c925 vista de reporte de sin robos, 1acddac Merge branch 'feature/testing' …, 552d291 Merge branch 'testing' into con…, e286619 Merge branch 'feature/testing' …, page.tsx, PaginacionSinRobos.tsx] | lang=en
- "steps_pasoevidencias": "PasoEvidencias.tsx" | kind=code-symbol | source=features/via/infracciones/components/steps/PasoEvidencias.tsx:L1 | neighbors=[23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, b5233a8 implementando via como modulo d…, f7b1aac Merge branch 'feature/testing' …, PasoEvidencias(), Props] | lang=en
- "templates_asignacion_fiscalia": "asignacion-fiscalia.ts" | kind=code-symbol | source=lib/emails/templates/asignacion-fiscalia.ts:L1 | neighbors=[75ca4b2 Merge pull request #9 from pres…, 953d38a implementando vista de fiscalia, server.ts, EnviarCorreoAsignacionFiscaliaParams, templateAsignacionFiscalia(), layout.ts] | lang=en
- "token_route": "route.ts" | kind=code-symbol | source=app/api/via/exp-digital/token/route.ts:L1 | neighbors=[23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, 5618308 guardado e evidencias con ed, f7b1aac Merge branch 'feature/testing' …, auth.ts, auth] | lang=en
- "ui_card_card": "Card()" | kind=code-symbol | source=features/via/infracciones/components/ui/Card.tsx:L1 | neighbors=[page.tsx, PasoCiudadano.tsx, PasoConductor.tsx, PasoDescuentos.tsx, PasoPago.tsx, PasoVehiculo.tsx] | lang=en
- "ui_fieldlabel": "FieldLabel.tsx" | kind=code-symbol | source=features/via/infracciones/components/ui/FieldLabel.tsx:L1 | neighbors=[23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, b5233a8 implementando via como modulo d…, f7b1aac Merge branch 'feature/testing' …, PasoConductor.tsx, PasoVehiculo.tsx] | lang=en
- "ui_toast_toast": "Toast()" | kind=code-symbol | source=components/ui/Toast.tsx:L8 | neighbors=[AccionesDetenido.tsx, BandejaSolicitudes.tsx, BatchEnvioFotos.tsx, BotonSubirDenuncia.tsx, CardEnvioFoto.tsx, EditarCampoDetenido.tsx] | lang=en
- "911_types": "types.ts" | kind=code-symbol | source=lib/911/types.ts:L1 | neighbors=[mapper.ts, repository.ts, service.ts, CatalogoItem, IncidenteDetalle, IncidenteResumen] | lang=en
- "admin_mapper": "mapper.ts" | kind=code-symbol | source=lib/admin/mapper.ts:L1 | neighbors=[rowToRol(), rowToUsuarioLista(), toStr(), types.ts, RolItem, UsuarioLista] | lang=en
- "admin_transito_actions_requireadmintransito": "requireAdminTransito()" | kind=code-symbol | source=lib/admin-transito/actions.ts:L9 | neighbors=[actions.ts, actualizarOficial(), buscarUsuariosReincorporar(), crearOficial(), destituirOficial(), obtenerOficialesLista()] | lang=en
- "admin_transito_modaldestituiroficial": "ModalDestituirOficial.tsx" | kind=code-symbol | source=components/admin-transito/ModalDestituirOficial.tsx:L1 | neighbors=[actions.ts, destituirOficial(), ModalDestituirOficial(), Props, OficialesTable.tsx, 16a63d4 Merge branch 'feature/testing' …] | lang=en
- "admin_transito_types": "types.ts" | kind=code-symbol | source=lib/admin-transito/types.ts:L1 | neighbors=[mapper.ts, repository.ts, Departamento, OficialLista, UserBasico, UserWithRole] | lang=en
- "agente_juzgado_juzgadotable": "JuzgadoTable.tsx" | kind=code-symbol | source=components/agente_juzgado/JuzgadoTable.tsx:L1 | neighbors=[JuzgadoDashboard.tsx, columns, DataRow, JuzgadoTable(), JuzgadoTableProps, 75e03e9 puliendo flujo de juzgado-liber…] | lang=en
- "agente_juzgado_tomarcasomodal": "TomarCasoModal.tsx" | kind=code-symbol | source=components/agente_juzgado/TomarCasoModal.tsx:L1 | neighbors=[TabSolicitudes.tsx, actions.ts, accionTomarCaso(), TomarCasoBoton(), 5f13b34 Merge branch 'feature/testing' …, 821abe0 replicando flujo de fiscalia-> …] | lang=en
- "auxiliar_profiledropdownauxiliar": "ProfileDropdownAuxiliar.tsx" | kind=code-symbol | source=components/auxiliar/ProfileDropdownAuxiliar.tsx:L1 | neighbors=[page.tsx, ProfileDropdownAuxiliar(), Props, auth-client.ts, authClient, 25de428 Corrección para agregar el botó…] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@0fe445e29f2fa675a83a604d9d85cc407d9dfd71": "0fe445e vista de oficial" | kind=Commit | source=git | neighbors=[conexion, testing, 458bbfb registro de reporte de campo - …, page.tsx, actions.ts, page.tsx] | lang=nl
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@19706150d0786c086d77d18ea69cb122db073a38": "1970615 vista de medidas" | kind=Commit | source=git | neighbors=[conexion, testing, 3800cab formulario de nueva medida de p…, page.tsx, layout.tsx, MedidasFiltros.tsx] | lang=nl
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@28da720c3833ea537d1a6973a50bd1f6f59ecf8f": "28da720 Cambio de colores en dashboard y loader (correccion de imagen)" | kind=Commit | source=git | neighbors=[160d1e1 Monitorista V1.1, conexion, testing, 7c1d096 Merge branch 'feature/denuncias…, LoadingProvider.tsx, enable-2fa.tsx] | lang=nl
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@5abc683b075625daff20897a70efe2939d2eddbf": "5abc683 Merge branch 'feature/auxiliar' into feature/testing" | kind=Commit | source=git | neighbors=[25de428 Corrección para agregar el botó…, page.tsx, ProfileDropdownAuxiliar.tsx, conexion, testing, 23a3b9d Cambios en la estructura de los…] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@69a557f3c74b4d884dd90df831a14df224747f8f": "69a557f CAMBIO CORREGIDO" | kind=Commit | source=git | neighbors=[conexion, testing, 166a26b Merge branch 'feature/testing' …, ec57fd2 Form actualizado, page.tsx, route.ts] | lang=pt
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@83f48a2d52ed2283798d3a1362eba8544bfb0b24": "83f48a2 Merge branch 'feature/correcciones' into feature/testing" | kind=Commit | source=git | neighbors=[166a26b Merge branch 'feature/testing' …, 56a8ec4 Impkementacion de pa ay guardad…, conexion, testing, 133bb9d pages de listado de llamadas y …, 97a433b empezando rol juzgado/fiscalia] | lang=pt
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@86e93197ed0a6a560d8b403e68ef1883ab444a4e": "86e9319 Merge branch 'feature/testing' of https://github.com/presidenciaSJR/seg…" | kind=Commit | source=git | neighbors=[5e458d6 navegacion, conexion, testing, 356d3a7 Subir rol agregado, falta darle…, 8affdb6 componente de paginacion y se i…, FormSection.tsx] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@905531c8d619a3e556b9255f7422e8466b2e8b64": "905531c trabajando en panel de fiscalia" | kind=Commit | source=git | neighbors=[090c4dd vista de fiscalia, conexion, testing, c194e54 envio de solicitud de evidencia…, actions.ts, PedirEvidenciasModal.tsx] | lang=nl
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@95b78c1d99e3697b5e2349399de1c7adc38ec744": "95b78c1 cambios de incidentes" | kind=Commit | source=git | neighbors=[4d4a9b7 formulario de notificaciones po…, conexion, testing, 72e8913 cambio de diseño, actions.ts, RegistroIncidenteForm.tsx] | lang=nl
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@a2907e2eb0150bea16791d3d9786037d34db1dca": "a2907e2 Boton agregado para crear roles!" | kind=Commit | source=git | neighbors=[7400135 Merge branch 'feature/testing' …, page.tsx, conexion, testing, f80d33f Merge branch 'feature/testing' …, page.tsx] | lang=pt
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@c194e5488d641dda843f63b0e952d4081a438002": "c194e54 envio de solicitud de evidencias completado" | kind=Commit | source=git | neighbors=[905531c trabajando en panel de fiscalia, conexion, testing, c4523ac tabla de fiscalia, evidencias f…, mapper.ts, PedirEvidenciasModal.tsx] | lang=nl
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@d04a29d5489b7170722d56787613aa84473ef564": "d04a29d correccion de navegacion entre pagians" | kind=Commit | source=git | neighbors=[conexion, testing, 0c31cc2 Merge branch 'testing' into juz…, 126b4d1 Monitorista V1, a291695 Merge branch 'feature/testing' …, da33516 Merge pull request #3 from pres…] | lang=en

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/cesarbr/Documents/dev/sjr/seguridad_publica/.graphify/description-instructions/batch-014.json

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
