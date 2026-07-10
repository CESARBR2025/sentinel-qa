# Node Description Batch 17 of 82

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
Write every description in Dutch (nl). Do not switch languages.
No marketing language.
Respond ONLY with a JSON object mapping each node id (as a string) to its
one-sentence description — no prose, no markdown fences.

- "commit:repo:github.com/presidenciaSJR/seguridad_publica@cd4b9bb2c3db63fa3e047fac808109a397e2832a": "cd4b9bb Carpeta creada" | kind=Commit | source=git | neighbors=[feature/monitorista, feature/monitorista-reportes, fix/detenidos, fix/incidentes-camara, fix/subir-fotografias, b68a2b7 Merge branch 'feature/testing' …]
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@ea0242b7aa39a9b85d47f1d1346cb064b98394be": "ea0242b vista de juridico" | kind=Commit | source=git | neighbors=[c471e9c Merge pull request #15 from pre…, feature/testing, 8355ac0 Merge branch 'feature/testing' …, page.tsx, page.tsx, ContestacionForm.tsx]
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@f5e51e19ca573d2bdd82c5573a174925f0bf88d1": "f5e51e1 card de 911 en vista de dashboard" | kind=Commit | source=git | neighbors=[756e1c6 Update page.tsx, feature/monitorista, feature/monitorista-reportes, fix/detenidos, fix/incidentes-camara, fix/subir-fotografias]
- "components_loadingprovider": "LoadingProvider.tsx" | kind=code-symbol | source=components/LoadingProvider.tsx:L1 | neighbors=[layout.tsx, 11e8817 Merge branch 'testing' into juz…, 28da720 Cambio de colores en dashboard …, 44ebbc4 Merge branch 'feature/testing' …, 5558751 feat: módulo Prevención del Del…, ce84893 Merge branch 'feature/testing' …]
- "corralon_types": "types.ts" | kind=code-symbol | source=lib/corralon/types.ts:L1 | neighbors=[16df128 flujo de corralones listo, 5a1b5d5 empezando corralon, actions.ts, mapper.ts, service.ts, SolicitudRow]
- "d1_d1filters": "D1Filters.tsx" | kind=code-symbol | source=components/reportes/d1/D1Filters.tsx:L1 | neighbors=[07543de Conexion de reportes con d1 y l…, 552d291 Merge branch 'testing' into con…, 98e7e6e vista de reportes de d1, b233bc7 Merge branch 'testing' into con…, e286619 Merge branch 'feature/testing' …, D1Filters()]
- "deteccion_camara_styles": "styles.ts" | kind=code-symbol | source=components/reportes/deteccion_camara/styles.ts:L1 | neighbors=[b170599 Merge branch 'feature/testing' …, b403f89 Vista para reportes de incident…, bd1a223 Merge branch 'feature/vistas-re…, ReportFilters.tsx, ReportTables.tsx, styles]
- "estadisticos_phonereportstable": "PhoneReportsTable.tsx" | kind=code-symbol | source=components/reportes/estadisticos/PhoneReportsTable.tsx:L1 | neighbors=[07543de Conexion de reportes con d1 y l…, 552d291 Merge branch 'testing' into con…, 6f8a089 Vista de estadisticos diarios, …, e286619 Merge branch 'feature/testing' …, page.tsx, PhoneReport]
- "fiscalia_tomarcasomodal": "TomarCasoModal.tsx" | kind=code-symbol | source=components/fiscalia/TomarCasoModal.tsx:L1 | neighbors=[090c4dd vista de fiscalia, 44ebbc4 Merge branch 'feature/testing' …, 997ef65 Merge pull request #2 from pres…, a291695 Merge branch 'feature/testing' …, f80d33f Merge branch 'feature/testing' …, TabSolicitudes.tsx]
- "fiscalia_types_aseguradorow": "AseguradoRow" | kind=code-symbol | source=lib/fiscalia/types.ts:L28 | neighbors=[actions.ts, repository.ts, service.ts, actions.ts, mapper.ts, repository.ts]
- "flota_mapper": "mapper.ts" | kind=code-symbol | source=lib/flota/mapper.ts:L1 | neighbors=[c27a9ee fase prefinal, rowToPatrulla(), rowToPatrullaAsignacion(), toBool(), toStr(), types.ts]
- "flota_types_patrullaasignacion": "PatrullaAsignacion" | kind=code-symbol | source=lib/flota/types.ts:L21 | neighbors=[ModalReactivarOficial.tsx, NuevoOficialForm.tsx, OficialesTable.tsx, PatrullaSelector.tsx, mapper.ts, service.ts]
- "hooks_useanalistaform": "useAnalistaForm.ts" | kind=code-symbol | source=hooks/useAnalistaForm.ts:L1 | neighbors=[formAnalisis.tsx, 2ca9f50 Formulario sin backend, 5618308 guardado e evidencias con ed, 56b6577 FORMULARIO SE ENLAZO A LA TABLA…, 5830570 Seccion de analista, uya con bd…, 9faf222 Merge branch 'feature/testing' …]
- "incidentes_actions_createincidente": "createIncidente()" | kind=code-symbol | source=lib/incidentes/actions.ts:L44 | neighbors=[Formulario911.tsx, actions.ts, createAlarmaEscolar(), createExtorsion(), num(), req()]
- "incidentes_actions_req": "req()" | kind=code-symbol | source=lib/incidentes/actions.ts:L26 | neighbors=[actions.ts, addPersonaAfectada(), createAlarmaEscolar(), createDespacho(), createExtorsion(), createIncidente()]
- "incidentes_actions_requireoperador": "requireOperador()" | kind=code-symbol | source=lib/incidentes/actions.ts:L16 | neighbors=[actions.ts, addPersonaAfectada(), createAlarmaEscolar(), createDespacho(), createExtorsion(), createIncidente()]
- "incidentes_permisos_verificaraccesoincidentesapi": "verificarAccesoIncidentesApi()" | kind=code-symbol | source=lib/incidentes/permisos.ts:L30 | neighbors=[route.ts, route.ts, route.ts, route.ts, permisos.ts, tienePermiso()]
- "iniciar_solicitud_route": "route.ts" | kind=code-symbol | source=app/api/via/ciudadano/iniciar-solicitud/route.ts:L1 | neighbors=[16a63d4 Merge branch 'feature/testing' …, 1dbd480 flujo de liberaciones completado, 91c36bf validando orden de pago, ac48eb1 Merge pull request #17 from pre…, ad3ec5f mejorando esto, ede5a1d eliminado referencias a via_pru…]
- "legalidad_repository": "repository.ts" | kind=code-symbol | source=features/via/legalidad/repository.ts:L1 | neighbors=[23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, b5233a8 implementando via como modulo d…, ede5a1d eliminado referencias a via_pru…, f7b1aac Merge branch 'feature/testing' …, ArticulosRepository]
- "login_desing_app": "app.jsx" | kind=code-symbol | source=login-desing/app.jsx:L1 | neighbors=[6a042cd feat: sistema de autenticación,…, App(), applyGlobalTweaks(), AppWithEffects(), NextStepsCard(), PaletteCard()]
- "modulo_incidentes_reportfilters": "ReportFilters.tsx" | kind=code-symbol | source=components/reportes/modulo_incidentes/ReportFilters.tsx:L1 | neighbors=[4400923 Merge branch 'feature/testing' …, 552d291 Merge branch 'testing' into con…, de14b62 Merge branch 'feature/reportes'…, e286619 Merge branch 'feature/testing' …, f6954ec Conexion a la bd y la generacio…, page.tsx]
- "oficial_service_verificarroloficial": "verificarRolOficial()" | kind=code-symbol | source=lib/oficial/service.ts:L71 | neighbors=[page.tsx, page.tsx, page.tsx, page.tsx, page.tsx, page.tsx]
- "oficiales_types": "types.ts" | kind=code-symbol | source=features/via/oficiales/types.ts:L1 | neighbors=[067c4de arreglando flujo de fiscalia  a…, 16a63d4 Merge branch 'feature/testing' …, 23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, ac48eb1 Merge pull request #17 from pre…, b5233a8 implementando via como modulo d…]
- "prevencion_medidasfiltros": "MedidasFiltros.tsx" | kind=code-symbol | source=components/prevencion/MedidasFiltros.tsx:L1 | neighbors=[06c55f5 Merge branch 'feature/testing' …, 0e33bf6 feat: módulo Admin, Prórroga, F…, 1970615 vista de medidas, 41ea169 Merge branch 'testing' into con…, 8355ac0 Merge branch 'feature/testing' …, page.tsx]
- "prevencion_solicitudc4form": "SolicitudC4Form.tsx" | kind=code-symbol | source=components/prevencion/SolicitudC4Form.tsx:L1 | neighbors=[5558751 feat: módulo Prevención del Del…, 5618308 guardado e evidencias con ed, 8355ac0 Merge branch 'feature/testing' …, 9faf222 Merge branch 'feature/testing' …, ea0242b vista de juridico, page.tsx]
- "rol_servicios_actions_requiresession": "requireSession()" | kind=code-symbol | source=lib/rol-servicios/actions.ts:L11 | neighbors=[actions.ts, createAsignacion(), createObservacion(), createRol(), deleteAsignacion(), deleteObservacion()]
- "rol_servicios_catalogos_actions_req": "req()" | kind=code-symbol | source=lib/rol-servicios/catalogos-actions.ts:L20 | neighbors=[catalogos-actions.ts, createBodyCam(), createConcepto(), createMedioCanalizacion(), createRadio(), createSector()]
- "rol_servicios_catalogos_actions_requireadmin": "requireAdmin()" | kind=code-symbol | source=lib/rol-servicios/catalogos-actions.ts:L10 | neighbors=[catalogos-actions.ts, createBodyCam(), createConcepto(), createMedioCanalizacion(), createRadio(), createSector()]
- "sasiete_repository_sa7repository": "SA7Repository" | kind=code-symbol | source=features/via/saSiete/repository.ts:L5 | neighbors=[route.ts, route.ts, route.ts, repository.ts, .actualizarOrdenPago(), .buscarOrdenPorInfraccionId()]
- "scripts_exportar_schema": "exportar-schema.ts" | kind=code-symbol | source=scripts/exportar-schema.ts:L1 | neighbors=[e6bffc9 boveda conectada, db.ts, ColumnInfo, getColumns(), getEnums(), getTables()]
- "services_analisisservice": "analisisService.ts" | kind=code-symbol | source=services/analisisService.ts:L1 | neighbors=[formAnalisis.tsx, generarPresentacion.tsx, TablonAnalisis.tsx, 06c55f5 Merge branch 'feature/testing' …, 3249f00 Cambios en rellenado de ppt!, 41ea169 Merge branch 'testing' into con…]
- "shared_direcciongooglemaps": "DireccionGoogleMaps.tsx" | kind=code-symbol | source=components/shared/DireccionGoogleMaps.tsx:L1 | neighbors=[CapturarDetallesForm.tsx, 5f13b34 Merge branch 'feature/testing' …, 92393e7 flujo completado de juzgado, a7218bd Merge pull request #4 from pres…, ce84893 Merge branch 'feature/testing' …, CapturarDetallesForm.tsx]
- "sin_robos_styles": "styles.ts" | kind=code-symbol | source=components/reportes/sin_robos/styles.ts:L1 | neighbors=[156c925 vista de reporte de sin robos, 1acddac Merge branch 'feature/testing' …, 552d291 Merge branch 'testing' into con…, e286619 Merge branch 'feature/testing' …, page.tsx, PaginacionSinRobos.tsx]
- "steps_pasoevidencias": "PasoEvidencias.tsx" | kind=code-symbol | source=features/via/infracciones/components/steps/PasoEvidencias.tsx:L1 | neighbors=[23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, b5233a8 implementando via como modulo d…, f7b1aac Merge branch 'feature/testing' …, PasoEvidencias(), Props]
- "templates_asignacion_fiscalia": "asignacion-fiscalia.ts" | kind=code-symbol | source=lib/emails/templates/asignacion-fiscalia.ts:L1 | neighbors=[75ca4b2 Merge pull request #9 from pres…, 953d38a implementando vista de fiscalia, server.ts, EnviarCorreoAsignacionFiscaliaParams, templateAsignacionFiscalia(), layout.ts]
- "token_route": "route.ts" | kind=code-symbol | source=app/api/via/exp-digital/token/route.ts:L1 | neighbors=[23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, 5618308 guardado e evidencias con ed, f7b1aac Merge branch 'feature/testing' …, auth.ts, auth]
- "ui_card_card": "Card()" | kind=code-symbol | source=features/via/infracciones/components/ui/Card.tsx:L1 | neighbors=[page.tsx, PasoCiudadano.tsx, PasoConductor.tsx, PasoDescuentos.tsx, PasoPago.tsx, PasoVehiculo.tsx]
- "ui_fieldlabel": "FieldLabel.tsx" | kind=code-symbol | source=features/via/infracciones/components/ui/FieldLabel.tsx:L1 | neighbors=[23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, b5233a8 implementando via como modulo d…, f7b1aac Merge branch 'feature/testing' …, PasoConductor.tsx, PasoVehiculo.tsx]
- "ui_toast_toast": "Toast()" | kind=code-symbol | source=components/ui/Toast.tsx:L8 | neighbors=[AccionesDetenido.tsx, BandejaSolicitudes.tsx, BatchEnvioFotos.tsx, BotonSubirDenuncia.tsx, CardEnvioFoto.tsx, EditarCampoDetenido.tsx]
- "911_types": "types.ts" | kind=code-symbol | source=lib/911/types.ts:L1 | neighbors=[mapper.ts, repository.ts, service.ts, CatalogoItem, IncidenteDetalle, IncidenteResumen]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/ugomez/Documents/GitHub/seguridad_publica/.graphify/description-instructions/batch-016.json

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
