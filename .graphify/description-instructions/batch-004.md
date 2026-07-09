# Node Description Batch 5 of 79

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

- "agente_juzgado_page": "page.tsx" | kind=code-symbol | source=app/agente_juzgado/page.tsx:L1 | neighbors=[actions.ts, obtenerDashboardJuzgado(), JuzgadoDashboardPage(), ProfileDropdown.tsx, ProfileDropdown(), ToastExito.tsx] | lang=en
- "auth_helpers_getuserwithrole": "getUserWithRole()" | kind=code-symbol | source=lib/auth/helpers.ts:L25 | neighbors=[actions.ts, layout.tsx, layout.tsx, helpers.ts, rowToUserWithRole(), actions.ts] | lang=en
- "auxiliar_permisos": "permisos.ts" | kind=code-symbol | source=lib/auxiliar/permisos.ts:L1 | neighbors=[actions.ts, Accion, guardarPermiso(), guardarPlantillaSeccion(), obtenerPermisosUsuario(), obtenerPlantillaRol()] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@090c4dd6c28d10a74ad8eec7001e6fa9a4b5e8b5": "090c4dd vista de fiscalia" | kind=Commit | source=git | neighbors=[actions.ts, page.tsx, ProfileDropdown.tsx, repository.ts, service.ts, ToastExito.tsx] | lang=nl
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@46b2c891040e758bb11656ea5bc2b0a5e9cde851": "46b2c89 Merge branch 'testing' into juzgado" | kind=Commit | source=git | neighbors=[0c31cc2 Merge branch 'testing' into juz…, 160d1e1 Monitorista V1.1, conexion, testing, 11e8817 Merge branch 'testing' into juz…, route.ts] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@75e03e918ed8bad195c1e4a6f670808f02c16944": "75e03e9 puliendo flujo de juzgado-liberaciones-vehiculos-" | kind=Commit | source=git | neighbors=[actions.ts, BotonVerDetalle.tsx, CargarOficioSection.tsx, ConfirmacionModal.tsx, JuzgadoDashboard.tsx, JuzgadoTable.tsx] | lang=nl
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@d64c8cdfd82b3f9968d3a836091aa8c745a2a108": "d64c8cd flujo de infracciones-liberaciones" | kind=Commit | source=git | neighbors=[51e682b mejorando flujo de liberaciones, actions.ts, CapturarDatosInfractorModal.tsx, InfraccionesDashboard.tsx, InfraccionesTable.tsx, mapper.ts] | lang=nl
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@da335165100725cf72f3294443f794992cc90e5f": "da33516 Merge pull request #3 from presidenciaSJR/feature/monitorista" | kind=Commit | source=git | neighbors=[126b4d1 Monitorista V1, d04a29d correccion de navegacion entre …, conexion, testing, 160d1e1 Monitorista V1.1, route.ts] | lang=en
- "fiscalia_page": "page.tsx" | kind=code-symbol | source=app/fiscalia/page.tsx:L1 | neighbors=[090c4dd vista de fiscalia, 2db162a flujo de asegurados, 388b997 Apartados para subir fotografia…, 44ebbc4 Merge branch 'feature/testing' …, 5bbdda8 Merge pull request #8 from pres…, 672bab5 libearciones para juzgado] | lang=en
- "formato_n_armas_aseguradas_page": "page.tsx" | kind=code-symbol | source=app/formato-n-armas-aseguradas/page.tsx:L1 | neighbors=[06c55f5 Merge branch 'feature/testing' …, 27dcb21 Merge branch 'feature/testing' …, 41ea169 Merge branch 'testing' into con…, 5618308 guardado e evidencias con ed, 77ddf58 Merge branch 'feature/testing' …, 8355ac0 Merge branch 'feature/testing' …] | lang=en
- "formato_n_eventos_page": "page.tsx" | kind=code-symbol | source=app/formato-n-eventos/page.tsx:L1 | neighbors=[06c55f5 Merge branch 'feature/testing' …, 27dcb21 Merge branch 'feature/testing' …, 41ea169 Merge branch 'testing' into con…, 5618308 guardado e evidencias con ed, 77ddf58 Merge branch 'feature/testing' …, 8355ac0 Merge branch 'feature/testing' …] | lang=en
- "formato_n_rnd_page": "page.tsx" | kind=code-symbol | source=app/formato-n-rnd/page.tsx:L1 | neighbors=[06c55f5 Merge branch 'feature/testing' …, 27dcb21 Merge branch 'feature/testing' …, 41ea169 Merge branch 'testing' into con…, 5618308 guardado e evidencias con ed, 77ddf58 Merge branch 'feature/testing' …, 8355ac0 Merge branch 'feature/testing' …] | lang=en
- "monitorista_bandejasolicitudes": "BandejaSolicitudes.tsx" | kind=code-symbol | source=components/monitorista/BandejaSolicitudes.tsx:L1 | neighbors=[126b4d1 Monitorista V1, 27dcb21 Merge branch 'feature/testing' …, 44ebbc4 Merge branch 'feature/testing' …, 46b2c89 Merge branch 'testing' into juz…, 5618308 guardado e evidencias con ed, 5d179c0 Apartado de reportes] | lang=en
- "monitorista_types": "types.ts" | kind=code-symbol | source=lib/monitorista/types.ts:L1 | neighbors=[c27a9ee fase prefinal, page.tsx, denuncia-service.ts, detenido-service.ts, incidentes-camara-service.ts, mapper.ts] | lang=en
- "reportes_formato_n_eventos_service": "formato-n-eventos-service.ts" | kind=code-symbol | source=lib/reportes/formato-n-eventos-service.ts:L1 | neighbors=[06c55f5 Merge branch 'feature/testing' …, 41ea169 Merge branch 'testing' into con…, 8355ac0 Merge branch 'feature/testing' …, a2e0623 Consolidado de formatos N y Sub…, bb10dcd Formatos V1, c95f412 Merge branch 'feature/testing' …] | lang=en
- "reportes_formato_n_rnd_service": "formato-n-rnd-service.ts" | kind=code-symbol | source=lib/reportes/formato-n-rnd-service.ts:L1 | neighbors=[06c55f5 Merge branch 'feature/testing' …, 41ea169 Merge branch 'testing' into con…, 8355ac0 Merge branch 'feature/testing' …, a2e0623 Consolidado de formatos N y Sub…, bb10dcd Formatos V1, c95f412 Merge branch 'feature/testing' …] | lang=en
- "911_service": "service.ts" | kind=code-symbol | source=lib/911/service.ts:L1 | neighbors=[page.tsx, repository.ts, listarIncidentes(), obtenerCatalogos(), obtenerIncidente(), obtenerIncidenteConExtras()] | lang=en
- "agente_juzgado_mapper": "mapper.ts" | kind=code-symbol | source=lib/agente_juzgado/mapper.ts:L1 | neighbors=[bool(), num(), rowToInfraccionDetalle(), rowToSolicitud(), str(), types.ts] | lang=en
- "analisis_permisos": "permisos.ts" | kind=code-symbol | source=lib/analisis/permisos.ts:L1 | neighbors=[Accion, guardarPermiso(), guardarPlantillaSeccion(), obtenerPlantillaRol(), PermisoSeccion, ROLES_PERMITIDOS] | lang=en
- "busquedas_page": "page.tsx" | kind=code-symbol | source=app/prevencion/busquedas/page.tsx:L1 | neighbors=[BusquedasPage(), TIPO_CFG, auth.ts, auth, permisos.ts, tieneAccesoSeccion()] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@0c31cc284a0b556a865b9d45217e793fb60a5485": "0c31cc2 Merge branch 'testing' into juzgado" | kind=Commit | source=git | neighbors=[page.tsx, conexion, testing, 46b2c89 Merge branch 'testing' into juz…, FormularioD1.tsx, page.tsx] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@126b4d1cd0263f9642cdcd9b368513963ad3af33": "126b4d1 Monitorista V1" | kind=Commit | source=git | neighbors=[conexion, testing, da33516 Merge pull request #3 from pres…, route.ts, route.ts, module-cards.tsx] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@46f24f8bbb4f596344886fe268f93459a7242df2": "46f24f8 generica function for infraction detail" | kind=Commit | source=git | neighbors=[actions.ts, actions.ts, LiberacionesDashboard.tsx, LiberacionesTable.tsx, mapper.ts, page.tsx] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@97a156c6bb4fc1be73d35d05c168219b02bdfa84": "97a156c Reportes con D1, sin D1 y sin robo" | kind=Commit | source=git | neighbors=[1acddac Merge branch 'feature/testing' …, conexion, testing, 22b7b54 Merge branch 'feature/reportes'…, DescargaFilters.tsx, DescargaTable.tsx] | lang=es
- "db_schema": "schema.ts" | kind=code-symbol | source=lib/db/schema.ts:L1 | neighbors=[0e33bf6 feat: módulo Admin, Prórroga, F…, 126b4d1 Monitorista V1, 166a26b Merge branch 'feature/testing' …, 44ebbc4 Merge branch 'feature/testing' …, 458bbfb registro de reporte de campo - …, 46b2c89 Merge branch 'testing' into juz…] | lang=en
- "generar_ppt_route": "route.ts" | kind=code-symbol | source=app/api/monitorista/detenidos/generar-ppt/route.ts:L1 | neighbors=[23a3b9d Cambios en la estructura de los…, 27dcb21 Merge branch 'feature/testing' …, 388b997 Apartados para subir fotografia…, 5618308 guardado e evidencias con ed, 5d179c0 Apartado de reportes, 5ed311a Merge pull request #5 from pres…] | lang=en
- "monitorista_denuncia_service": "denuncia-service.ts" | kind=code-symbol | source=lib/monitorista/denuncia-service.ts:L1 | neighbors=[126b4d1 Monitorista V1, 160d1e1 Monitorista V1.1, 44ebbc4 Merge branch 'feature/testing' …, 46b2c89 Merge branch 'testing' into juz…, 5f13b34 Merge branch 'feature/testing' …, 9ec6056 flujo de juzgado-monitorista co…] | lang=en
- "monitorista_detenido_service": "detenido-service.ts" | kind=code-symbol | source=lib/monitorista/detenido-service.ts:L1 | neighbors=[067c4de arreglando flujo de fiscalia  a…, 11be750 Fase 1 de correccion - completa…, 16a63d4 Merge branch 'feature/testing' …, 23a3b9d Cambios en la estructura de los…, 5d179c0 Apartado de reportes, 5ed311a Merge pull request #5 from pres…] | lang=en
- "notificaciones_actions": "actions.ts" | kind=code-symbol | source=lib/notificaciones/actions.ts:L1 | neighbors=[0e33bf6 feat: módulo Admin, Prórroga, F…, 11be750 Fase 1 de correccion - completa…, ad3ec5f mejorando esto, c27a9ee fase prefinal, auth.ts, auth] | lang=en
- "partials_subheader": "SubHeader.tsx" | kind=code-symbol | source=components/partials/SubHeader.tsx:L1 | neighbors=[a2e0623 Consolidado de formatos N y Sub…, f5fac0b Merge branch 'testing' into con…, page.tsx, page.tsx, page.tsx, page.tsx] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@12aab6527c481f0a0f3dbcfd73aec6fcb2f63a87": "12aab65 fase 4" | kind=Commit | source=git | neighbors=[mapper.ts, repository.ts, service.ts, types.ts, layout.tsx, mapper.ts] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@2db162a35e85541990e7bebb64d390272cdcdd51": "2db162a flujo de asegurados" | kind=Commit | source=git | neighbors=[actions.ts, FormularioAseguradoJuzgado.tsx, page.tsx, repository.ts, service.ts, layout.tsx] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@821abe04c3a968d9bb8106fe453d78e2df8be143": "821abe0 replicando flujo de fiscalia-> juzgado" | kind=Commit | source=git | neighbors=[11e8817 Merge branch 'testing' into juz…, actions.ts, actions.ts, CerrarCasoModal.tsx, mapper.ts, page.tsx] | lang=nl
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@91c36bfc0feedd37a66fb0c7e072f7f1c4cf67a0": "91c36bf validando orden de pago" | kind=Commit | source=git | neighbors=[2c128e5 test expediente vercel, conexion, testing, dc063f3 gestion de oficiales correctame…, route.ts, CapturarDatosTitularSection.tsx] | lang=nl
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@aaddee5724bd0502be1074ff7c9f23a79e5ddaa1": "aaddee5 Merge branch 'feature/testing' into feature/denuncias" | kind=Commit | source=git | neighbors=[93dd3ea Merge pull request #1 from pres…, conexion, testing, Formulario911.tsx, 69a557f CAMBIO CORREGIDO, page.tsx] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@c471e9c8cb121c2df42cf794f92379e038368fb1": "c471e9c Merge pull request #15 from presidenciaSJR/conexion" | kind=Commit | source=git | neighbors=[2db162a flujo de asegurados, c1ed4c3 cambios en busquedas, actions.ts, FormularioAseguradoJuzgado.tsx, page.tsx, repository.ts] | lang=en
- "completar_route": "route.ts" | kind=code-symbol | source=app/api/monitorista/solicitudes/[id]/completar/route.ts:L1 | neighbors=[126b4d1 Monitorista V1, 27dcb21 Merge branch 'feature/testing' …, 44ebbc4 Merge branch 'feature/testing' …, 46b2c89 Merge branch 'testing' into juz…, 5618308 guardado e evidencias con ed, 5d179c0 Apartado de reportes] | lang=en
- "completar_solicitud_route": "route.ts" | kind=code-symbol | source=app/api/via/ciudadano/completar-solicitud/route.ts:L1 | neighbors=[126b4d1 Monitorista V1, 16a63d4 Merge branch 'feature/testing' …, 1dbd480 flujo de liberaciones completado, 44ebbc4 Merge branch 'feature/testing' …, 46b2c89 Merge branch 'testing' into juz…, 5d179c0 Apartado de reportes] | lang=en
- "login_page": "page.tsx" | kind=code-symbol | source=app/(auth)/login/page.tsx:L1 | neighbors=[1acddac Merge branch 'feature/testing' …, 552d291 Merge branch 'testing' into con…, 5558751 feat: módulo Prevención del Del…, 5aa5866 Cambio de colores en interfaz d…, 5f13b34 Merge branch 'feature/testing' …, 6a042cd feat: sistema de autenticación,…] | lang=en
- "monitorista_incidentes_camara_service": "incidentes-camara-service.ts" | kind=code-symbol | source=lib/monitorista/incidentes-camara-service.ts:L1 | neighbors=[50101e2 Merge pull request #6 from pres…, 5311c24 Editar Registros, 5d179c0 Apartado de reportes, 5f13b34 Merge branch 'feature/testing' …, 810844a Cambios en la estructura de los…, 8e6c8c6 Apartado de reportes] | lang=en

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/cesarbr/Documents/dev/sjr/seguridad_publica/.graphify/description-instructions/batch-004.json

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
