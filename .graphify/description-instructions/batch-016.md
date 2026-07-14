# Node Description Batch 17 of 87

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

- "sin_robos_reportfilters": "ReportFilters.tsx" | kind=code-symbol | source=components/reportes/sin_robos/ReportFilters.tsx:L1 | neighbors=[156c925 vista de reporte de sin robos, 1acddac Merge branch 'feature/testing' …, 22b7b54 Merge branch 'feature/reportes'…, 552d291 Merge branch 'testing' into con…, 97a156c Reportes con D1, sin D1 y sin r…, e286619 Merge branch 'feature/testing' …] | lang=en
- "steps_pasoconfirmacion": "PasoConfirmacion.tsx" | kind=code-symbol | source=features/via/infracciones/components/steps/PasoConfirmacion.tsx:L1 | neighbors=[23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, b5233a8 implementando via como modulo d…, f7b1aac Merge branch 'feature/testing' …, PasoConfirmacion(), PasoConfirmacionProps] | lang=en
- "steps_pasoubicacionevidencias": "PasoUbicacionEvidencias.tsx" | kind=code-symbol | source=features/via/infracciones/components/steps/PasoUbicacionEvidencias.tsx:L1 | neighbors=[23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, b5233a8 implementando via como modulo d…, f7b1aac Merge branch 'feature/testing' …, FormularioInfraccion.tsx, PasoEvidencias.tsx] | lang=en
- "templates_orden_liberacion": "orden-liberacion.ts" | kind=code-symbol | source=lib/emails/templates/orden-liberacion.ts:L1 | neighbors=[16a63d4 Merge branch 'feature/testing' …, 1dbd480 flujo de liberaciones completado, ac48eb1 Merge pull request #17 from pre…, server.ts, layout.ts, emailLayout()] | lang=en
- "ui_toast_toast": "Toast()" | kind=code-symbol | source=components/ui/Toast.tsx:L8 | neighbors=[AccionesDetenido.tsx, BandejaSolicitudes.tsx, BatchEnvioFotos.tsx, BotonSubirDenuncia.tsx, CardEnvioFoto.tsx, EditarCampoDetenido.tsx] | lang=en
- "911_permisos_tieneaccesoseccion": "tieneAccesoSeccion()" | kind=code-symbol | source=lib/911/permisos.ts:L32 | neighbors=[permisos.ts, tienePermiso(), page.tsx, page.tsx, page.tsx, page.tsx] | lang=en
- "agente_infracciones_profiledropdown": "ProfileDropdown.tsx" | kind=code-symbol | source=components/agente_infracciones/ProfileDropdown.tsx:L1 | neighbors=[page.tsx, ProfileDropdown(), Props, auth-client.ts, authClient, 06c55f5 Merge branch 'feature/testing' …] | lang=en
- "auxiliar_types": "types.ts" | kind=code-symbol | source=lib/auxiliar/types.ts:L1 | neighbors=[mapper.ts, repository.ts, service.ts, AuxChecklist, AuxCuestionarioRobo, AuxParReporte] | lang=en
- "buscar_orden_route": "route.ts" | kind=code-symbol | source=app/api/via/sa7/buscar-orden/route.ts:L1 | neighbors=[GET(), auth.ts, auth, repository.ts, SA7Repository, 23b7312 Merge pull request #16 from pre…] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@19706150d0786c086d77d18ea69cb122db073a38": "1970615 vista de medidas" | kind=Commit | source=git | neighbors=[conexion, testing, 3800cab formulario de nueva medida de p…, page.tsx, layout.tsx, MedidasFiltros.tsx] | lang=nl
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@2e36377810689a31202162fcc8384625f96efb23": "2e36377 Eliminar tutoriales de flujo innecesarios" | kind=Commit | source=git | neighbors=[199ce68 Merge branch 'main' of https://…, main, aaab50d Merge branch 'main' of https://…, feature/monitorista-reportes, fix/detenidos, fix/incidentes-camara] | lang=nl
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@4271f370e6dcbe157f84bf08a7a3c865913fbd5a": "4271f37 feat(doc): agregar manual de usuario interactivo para el módulo de prev…" | kind=Commit | source=git | neighbors=[main, 199ce68 Merge branch 'main' of https://…, d3e6d95 Update SeguimientoTimeline.tsx, feature/monitorista-reportes, fix/detenidos, fix/incidentes-camara] | lang=es
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@756e1c69242082798814cb770b0d311a2ea25102": "756e1c6 Update page.tsx" | kind=Commit | source=git | neighbors=[feature/monitorista, feature/monitorista-reportes, fix/detenidos, fix/incidentes-camara, fix/subir-fotografias, a24949a Merge branch 'feature/testing' …] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@a667064799f60e8647a86af738414eab28726079": "a667064 Page de seleccion de registro" | kind=Commit | source=git | neighbors=[ModuleCard.tsx, feature/monitorista, feature/monitorista-reportes, fix/detenidos, fix/incidentes-camara, fix/subir-fotografias] | lang=nl
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@ac5d42ff982d27e79c59e871882f5ea2f6e6dfd6": "ac5d42f cerrando flujo de 911-despacho-" | kind=Commit | source=git | neighbors=[Pagination.tsx, repository.ts, service.ts, conexion, page.tsx, 11ee4f2 mejorando flujo de 911] | lang=nl
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@cd4b9bb2c3db63fa3e047fac808109a397e2832a": "cd4b9bb Carpeta creada" | kind=Commit | source=git | neighbors=[feature/monitorista, feature/monitorista-reportes, fix/detenidos, fix/incidentes-camara, fix/subir-fotografias, b68a2b7 Merge branch 'feature/testing' …] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@e6bffc94cb627a96f24106c5c71c5914defb40fa": "e6bffc9 boveda conectada" | kind=Commit | source=git | neighbors=[c27a9ee fase prefinal, conexion, testing, a7a7f2e boveda, graphify.js, exportar-schema.ts] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@ea0242b7aa39a9b85d47f1d1346cb064b98394be": "ea0242b vista de juridico" | kind=Commit | source=git | neighbors=[c471e9c Merge pull request #15 from pre…, conexion, testing, 8355ac0 Merge branch 'feature/testing' …, page.tsx, page.tsx] | lang=nl
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@f5e51e19ca573d2bdd82c5573a174925f0bf88d1": "f5e51e1 card de 911 en vista de dashboard" | kind=Commit | source=git | neighbors=[756e1c6 Update page.tsx, feature/monitorista, feature/monitorista-reportes, fix/detenidos, fix/incidentes-camara, fix/subir-fotografias] | lang=nl
- "components_loadingprovider": "LoadingProvider.tsx" | kind=code-symbol | source=components/LoadingProvider.tsx:L1 | neighbors=[layout.tsx, 11e8817 Merge branch 'testing' into juz…, 28da720 Cambio de colores en dashboard …, 44ebbc4 Merge branch 'feature/testing' …, 5558751 feat: módulo Prevención del Del…, ce84893 Merge branch 'feature/testing' …] | lang=en
- "corralon_types": "types.ts" | kind=code-symbol | source=lib/corralon/types.ts:L1 | neighbors=[16df128 flujo de corralones listo, 5a1b5d5 empezando corralon, actions.ts, mapper.ts, service.ts, SolicitudRow] | lang=en
- "d1_d1filters": "D1Filters.tsx" | kind=code-symbol | source=components/reportes/d1/D1Filters.tsx:L1 | neighbors=[07543de Conexion de reportes con d1 y l…, 552d291 Merge branch 'testing' into con…, 98e7e6e vista de reportes de d1, b233bc7 Merge branch 'testing' into con…, e286619 Merge branch 'feature/testing' …, D1Filters()] | lang=en
- "deteccion_camara_styles": "styles.ts" | kind=code-symbol | source=components/reportes/deteccion_camara/styles.ts:L1 | neighbors=[b170599 Merge branch 'feature/testing' …, b403f89 Vista para reportes de incident…, bd1a223 Merge branch 'feature/vistas-re…, ReportFilters.tsx, ReportTables.tsx, styles] | lang=en
- "estadisticos_phonereportstable": "PhoneReportsTable.tsx" | kind=code-symbol | source=components/reportes/estadisticos/PhoneReportsTable.tsx:L1 | neighbors=[07543de Conexion de reportes con d1 y l…, 552d291 Merge branch 'testing' into con…, 6f8a089 Vista de estadisticos diarios, …, e286619 Merge branch 'feature/testing' …, page.tsx, PhoneReport] | lang=en
- "fiscalia_tomarcasomodal": "TomarCasoModal.tsx" | kind=code-symbol | source=components/fiscalia/TomarCasoModal.tsx:L1 | neighbors=[090c4dd vista de fiscalia, 44ebbc4 Merge branch 'feature/testing' …, 997ef65 Merge pull request #2 from pres…, a291695 Merge branch 'feature/testing' …, f80d33f Merge branch 'feature/testing' …, TabSolicitudes.tsx] | lang=en
- "fiscalia_types_aseguradorow": "AseguradoRow" | kind=code-symbol | source=lib/fiscalia/types.ts:L28 | neighbors=[actions.ts, repository.ts, service.ts, actions.ts, mapper.ts, repository.ts] | lang=en
- "flota_mapper": "mapper.ts" | kind=code-symbol | source=lib/flota/mapper.ts:L1 | neighbors=[c27a9ee fase prefinal, rowToPatrulla(), rowToPatrullaAsignacion(), toBool(), toStr(), types.ts] | lang=en
- "flota_types_patrullaasignacion": "PatrullaAsignacion" | kind=code-symbol | source=lib/flota/types.ts:L21 | neighbors=[ModalReactivarOficial.tsx, NuevoOficialForm.tsx, OficialesTable.tsx, PatrullaSelector.tsx, mapper.ts, service.ts] | lang=en
- "hooks_useanalistaform": "useAnalistaForm.ts" | kind=code-symbol | source=hooks/useAnalistaForm.ts:L1 | neighbors=[formAnalisis.tsx, 2ca9f50 Formulario sin backend, 5618308 guardado e evidencias con ed, 56b6577 FORMULARIO SE ENLAZO A LA TABLA…, 5830570 Seccion de analista, uya con bd…, 9faf222 Merge branch 'feature/testing' …] | lang=en
- "incidentes_actions_createincidente": "createIncidente()" | kind=code-symbol | source=lib/incidentes/actions.ts:L45 | neighbors=[actions.ts, createAlarmaEscolar(), createExtorsion(), num(), req(), requireOperador()] | lang=en
- "incidentes_historialincidente": "HistorialIncidente.tsx" | kind=code-symbol | source=components/incidentes/HistorialIncidente.tsx:L1 | neighbors=[290d651 feat(despacho): flujo integral …, page.tsx, Badge(), Dato(), fmt(), HistorialIncidente()] | lang=en
- "incidentes_permisos_verificaraccesoincidentesapi": "verificarAccesoIncidentesApi()" | kind=code-symbol | source=lib/incidentes/permisos.ts:L30 | neighbors=[route.ts, route.ts, route.ts, route.ts, permisos.ts, tienePermiso()] | lang=en
- "iniciar_solicitud_route": "route.ts" | kind=code-symbol | source=app/api/via/ciudadano/iniciar-solicitud/route.ts:L1 | neighbors=[16a63d4 Merge branch 'feature/testing' …, 1dbd480 flujo de liberaciones completado, 91c36bf validando orden de pago, ac48eb1 Merge pull request #17 from pre…, ad3ec5f mejorando esto, ede5a1d eliminado referencias a via_pru…] | lang=en
- "legalidad_repository": "repository.ts" | kind=code-symbol | source=features/via/legalidad/repository.ts:L1 | neighbors=[23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, b5233a8 implementando via como modulo d…, ede5a1d eliminado referencias a via_pru…, f7b1aac Merge branch 'feature/testing' …, ArticulosRepository] | lang=en
- "login_desing_app": "app.jsx" | kind=code-symbol | source=login-desing/app.jsx:L1 | neighbors=[6a042cd feat: sistema de autenticación,…, App(), applyGlobalTweaks(), AppWithEffects(), NextStepsCard(), PaletteCard()] | lang=en
- "modulo_incidentes_reportfilters": "ReportFilters.tsx" | kind=code-symbol | source=components/reportes/modulo_incidentes/ReportFilters.tsx:L1 | neighbors=[4400923 Merge branch 'feature/testing' …, 552d291 Merge branch 'testing' into con…, de14b62 Merge branch 'feature/reportes'…, e286619 Merge branch 'feature/testing' …, f6954ec Conexion a la bd y la generacio…, page.tsx] | lang=en
- "oficiales_types": "types.ts" | kind=code-symbol | source=features/via/oficiales/types.ts:L1 | neighbors=[067c4de arreglando flujo de fiscalia  a…, 16a63d4 Merge branch 'feature/testing' …, 23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, ac48eb1 Merge pull request #17 from pre…, b5233a8 implementando via como modulo d…] | lang=en
- "prevencion_medidasfiltros": "MedidasFiltros.tsx" | kind=code-symbol | source=components/prevencion/MedidasFiltros.tsx:L1 | neighbors=[06c55f5 Merge branch 'feature/testing' …, 0e33bf6 feat: módulo Admin, Prórroga, F…, 1970615 vista de medidas, 41ea169 Merge branch 'testing' into con…, 8355ac0 Merge branch 'feature/testing' …, page.tsx] | lang=en
- "prevencion_solicitudc4form": "SolicitudC4Form.tsx" | kind=code-symbol | source=components/prevencion/SolicitudC4Form.tsx:L1 | neighbors=[5558751 feat: módulo Prevención del Del…, 5618308 guardado e evidencias con ed, 8355ac0 Merge branch 'feature/testing' …, 9faf222 Merge branch 'feature/testing' …, ea0242b vista de juridico, page.tsx] | lang=en
- "rol_servicios_actions_requiresession": "requireSession()" | kind=code-symbol | source=lib/rol-servicios/actions.ts:L11 | neighbors=[actions.ts, createAsignacion(), createObservacion(), createRol(), deleteAsignacion(), deleteObservacion()] | lang=en

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/cesarbr/Documents/dev/sjr/seguridad_publica/.graphify/description-instructions/batch-016.json

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
