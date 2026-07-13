# Node Description Batch 5 of 87

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

- "formato_n_medios_alternativos_page": "page.tsx" | kind=code-symbol | source=app/formato-n-medios-alternativos/page.tsx:L1 | neighbors=[06c55f5 Merge branch 'feature/testing' …, 27dcb21 Merge branch 'feature/testing' …, 41ea169 Merge branch 'testing' into con…, 5618308 guardado e evidencias con ed, 77ddf58 Merge branch 'feature/testing' …, 8355ac0 Merge branch 'feature/testing' …] | lang=en
- "historial_page": "page.tsx" | kind=code-symbol | source=app/monitorista/historial/page.tsx:L1 | neighbors=[27dcb21 Merge branch 'feature/testing' …, 388b997 Apartados para subir fotografia…, 514a705 refactorizacion sql, 5618308 guardado e evidencias con ed, 5d179c0 Apartado de reportes, 5f13b34 Merge branch 'feature/testing' …] | lang=en
- "rol_servicios_catalogos_actions": "catalogos-actions.ts" | kind=code-symbol | source=lib/rol-servicios/catalogos-actions.ts:L1 | neighbors=[11be750 Fase 1 de correccion - completa…, c27a9ee fase prefinal, auth.ts, auth, db.ts, query()] | lang=en
- "rol_servicios_service": "service.ts" | kind=code-symbol | source=lib/rol-servicios/service.ts:L1 | neighbors=[c27a9ee fase prefinal, repository.ts, getAsignacionesByRolId(), getBodyCams(), getEstadoFuerzaByRolId(), getEstadoFuerzaConceptos()] | lang=en
- "agente_infracciones_actions": "actions.ts" | kind=code-symbol | source=lib/agente_infracciones/actions.ts:L1 | neighbors=[capturarInfractorInfraccionesAction(), liberarGarantiaInfraccionesAction(), obtenerDashboardInfracciones(), obtenerDetalleInfraccionInfracciones(), obtenerInfracciones(), service.ts] | lang=en
- "agente_liberaciones_liberacionesdashboard": "LiberacionesDashboard.tsx" | kind=code-symbol | source=components/agente_liberaciones/LiberacionesDashboard.tsx:L1 | neighbors=[AVATAR_COLORS, EstatusLiberaciones, getBadge(), getInitials(), hashColor(), LiberacionesDashboard()] | lang=en
- "analisis_page": "page.tsx" | kind=code-symbol | source=app/analisis/page.tsx:L1 | neighbors=[actionTextStyle, cardContentStyle, cardDescStyle, cardStyle, cardTitleStyle, decoratorLine] | lang=en
- "analisis_permisos": "permisos.ts" | kind=code-symbol | source=lib/analisis/permisos.ts:L1 | neighbors=[Accion, guardarPermiso(), guardarPlantillaSeccion(), obtenerPlantillaRol(), PermisoSeccion, Seccion] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@290d6510777c2423d2c3dd73960c82ce2f471b16": "290d651 feat(despacho): flujo integral 911 → despacho → oficial → D1 → legal" | kind=Commit | source=git | neighbors=[FiltrosIncidentes.tsx, conexion, testing, fcdb169 chore(graphify): actualiza graf…, repository.ts, TablonDespacho.tsx] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@93dd3eacbbe61c248cb181e56601565285e2e91d": "93dd3ea Merge pull request #1 from presidenciaSJR/juzgado" | kind=Commit | source=git | neighbors=[458bbfb registro de reporte de campo - …, 917002a Guardado de policia a cargo, conexion, testing, aaddee5 Merge branch 'feature/testing' …, ecebe38 Guardado de longitud y latitud …] | lang=en
- "incidentes_camara_route": "route.ts" | kind=code-symbol | source=app/api/monitorista/incidentes-camara/route.ts:L1 | neighbors=[27dcb21 Merge branch 'feature/testing' …, 388b997 Apartados para subir fotografia…, 50101e2 Merge pull request #6 from pres…, 5311c24 Editar Registros, 5618308 guardado e evidencias con ed, 5d179c0 Apartado de reportes] | lang=en
- "infraccionid_route": "route.ts" | kind=code-symbol | source=app/api/via/pagos/finalizar-instante/[ordenPagoId]/[infraccionId]/route.ts:L1 | neighbors=[16a63d4 Merge branch 'feature/testing' …, 1dbd480 flujo de liberaciones completado, 91c36bf validando orden de pago, ac48eb1 Merge pull request #17 from pre…, ad3ec5f mejorando esto, ede5a1d eliminado referencias a via_pru…] | lang=en
- "monitorista_ppt_service": "ppt-service.ts" | kind=code-symbol | source=lib/monitorista/ppt-service.ts:L1 | neighbors=[06c55f5 Merge branch 'feature/testing' …, 23a3b9d Cambios en la estructura de los…, 388b997 Apartados para subir fotografia…, 41ea169 Merge branch 'testing' into con…, 5d179c0 Apartado de reportes, 5ed311a Merge pull request #5 from pres…] | lang=en
- "prevencion_mapper": "mapper.ts" | kind=code-symbol | source=lib/prevencion/mapper.ts:L1 | neighbors=[0caf5dd Fixes, 514a705 refactorizacion sql, c27a9ee fase prefinal, rowToAutoridadAdicional(), rowToBusqueda(), rowToContestacion()] | lang=en
- "reportes_incidentes_page": "page.tsx" | kind=code-symbol | source=app/reportes_incidentes/page.tsx:L1 | neighbors=[13f7f39 Reporte-incidentes, 2516723 Modulo de permisos, 2fcba7b vista de reportes de incidentes…, 41ea169 Merge branch 'testing' into con…, 552d291 Merge branch 'testing' into con…, 719b5ab cambio para generacion de repor…] | lang=en
- "reportes_operativos_mapper": "mapper.ts" | kind=code-symbol | source=lib/reportes-operativos/mapper.ts:L1 | neighbors=[ad3ec5f mejorando esto, rowToArma(), rowToCateo(), rowToDetencionInc(), rowToDetencionOfi(), rowToDroga()] | lang=en
- "rol_servicios_actions": "actions.ts" | kind=code-symbol | source=lib/rol-servicios/actions.ts:L1 | neighbors=[11be750 Fase 1 de correccion - completa…, c27a9ee fase prefinal, auth.ts, auth, db.ts, query()] | lang=en
- "rondin_page": "page.tsx" | kind=code-symbol | source=app/oficial/rondin/page.tsx:L1 | neighbors=[03f8b2a implementado rbac, 046f18c Merge pull request #19 from pre…, 290d651 feat(despacho): flujo integral …, ac9ad49 Merge branch 'feature/testing' …, permisos.ts, tieneAccesoSeccion()] | lang=en
- "solicitudid_page": "page.tsx" | kind=code-symbol | source=app/fiscalia/solicitudes/[solicitudId]/page.tsx:L1 | neighbors=[5f13b34 Merge branch 'feature/testing' …, 6109a7a replicando flujo para fiscalia, 92393e7 flujo completado de juzgado, a7218bd Merge pull request #4 from pres…, ce84893 Merge branch 'feature/testing' …, CapturarDetallesForm.tsx] | lang=en
- "agente_infracciones_service": "service.ts" | kind=code-symbol | source=lib/agente_infracciones/service.ts:L1 | neighbors=[actions.ts, mapper.ts, rowToLiberacion(), repository.ts, actualizarDatosInfractor(), insertarOrdenPagoSa7()] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@75e03e918ed8bad195c1e4a6f670808f02c16944": "75e03e9 puliendo flujo de juzgado-liberaciones-vehiculos-" | kind=Commit | source=git | neighbors=[actions.ts, BotonVerDetalle.tsx, CargarOficioSection.tsx, ConfirmacionModal.tsx, JuzgadoDashboard.tsx, JuzgadoTable.tsx] | lang=nl
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@92393e79eeb8bd73e39875946addf69135d1e790": "92393e7 flujo completado de juzgado" | kind=Commit | source=git | neighbors=[actions.ts, CapturarDetallesForm.tsx, DetallesAseguradoView.tsx, mapper.ts, repository.ts, service.ts] | lang=nl
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@d64c8cdfd82b3f9968d3a836091aa8c745a2a108": "d64c8cd flujo de infracciones-liberaciones" | kind=Commit | source=git | neighbors=[51e682b mejorando flujo de liberaciones, actions.ts, CapturarDatosInfractorModal.tsx, InfraccionesDashboard.tsx, InfraccionesTable.tsx, mapper.ts] | lang=nl
- "consolidar_page": "page.tsx" | kind=code-symbol | source=app/envio-de-formatos/consolidar/page.tsx:L1 | neighbors=[a2e0623 Consolidado de formatos N y Sub…, f5fac0b Merge branch 'testing' into con…, Arma, cardStyle, Consolidado, ConsolidarFormatoNPage()] | lang=en
- "envio_de_formatos_page": "page.tsx" | kind=code-symbol | source=app/envio-de-formatos/page.tsx:L1 | neighbors=[06c55f5 Merge branch 'feature/testing' …, 27dcb21 Merge branch 'feature/testing' …, 41ea169 Merge branch 'testing' into con…, 514a705 refactorizacion sql, 5618308 guardado e evidencias con ed, 77ddf58 Merge branch 'feature/testing' …] | lang=en
- "reportes_form_styles": "form-styles.ts" | kind=code-symbol | source=components/reportes/form-styles.ts:L1 | neighbors=[06c55f5 Merge branch 'feature/testing' …, 41ea169 Merge branch 'testing' into con…, 8355ac0 Merge branch 'feature/testing' …, bb10dcd Formatos V1, c95f412 Merge branch 'feature/testing' …, page.tsx] | lang=en
- "reportes_formato_n_armas_aseguradas_service": "formato-n-armas-aseguradas-service.ts" | kind=code-symbol | source=lib/reportes/formato-n-armas-aseguradas-service.ts:L1 | neighbors=[06c55f5 Merge branch 'feature/testing' …, 41ea169 Merge branch 'testing' into con…, 8355ac0 Merge branch 'feature/testing' …, a2e0623 Consolidado de formatos N y Sub…, bb10dcd Formatos V1, c95f412 Merge branch 'feature/testing' …] | lang=en
- "agente_juzgado_page": "page.tsx" | kind=code-symbol | source=app/agente_juzgado/page.tsx:L1 | neighbors=[actions.ts, obtenerDashboardJuzgado(), JuzgadoDashboardPage(), ProfileDropdown.tsx, ProfileDropdown(), ToastExito.tsx] | lang=en
- "auth_helpers_getuserwithrole": "getUserWithRole()" | kind=code-symbol | source=lib/auth/helpers.ts:L25 | neighbors=[actions.ts, layout.tsx, layout.tsx, helpers.ts, rowToUserWithRole(), page.tsx] | lang=en
- "auxiliar_page": "page.tsx" | kind=code-symbol | source=app/auxiliar/page.tsx:L1 | neighbors=[AuxiliarPage(), permisos.ts, tienePermiso(), ProfileDropdownAuxiliar.tsx, ProfileDropdownAuxiliar(), auth.ts] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@12aab6527c481f0a0f3dbcfd73aec6fcb2f63a87": "12aab65 fase 4" | kind=Commit | source=git | neighbors=[mapper.ts, repository.ts, service.ts, types.ts, layout.tsx, mapper.ts] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@46f24f8bbb4f596344886fe268f93459a7242df2": "46f24f8 generica function for infraction detail" | kind=Commit | source=git | neighbors=[actions.ts, actions.ts, LiberacionesDashboard.tsx, LiberacionesTable.tsx, mapper.ts, page.tsx] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@97a156c6bb4fc1be73d35d05c168219b02bdfa84": "97a156c Reportes con D1, sin D1 y sin robo" | kind=Commit | source=git | neighbors=[1acddac Merge branch 'feature/testing' …, conexion, testing, 22b7b54 Merge branch 'feature/reportes'…, DescargaFilters.tsx, DescargaTable.tsx] | lang=es
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@b79a96a842f6bd73adff22de0f9a6a8c547ad549": "b79a96a Conexión entre ambos modulos" | kind=Commit | source=git | neighbors=[conexion, testing, f2d7c18 logica de redirección dinamica, FormularioD1.tsx, page.tsx, page.tsx] | lang=pt
- "fiscalia_page": "page.tsx" | kind=code-symbol | source=app/fiscalia/page.tsx:L1 | neighbors=[090c4dd vista de fiscalia, 2db162a flujo de asegurados, 388b997 Apartados para subir fotografia…, 44ebbc4 Merge branch 'feature/testing' …, 5bbdda8 Merge pull request #8 from pres…, 672bab5 libearciones para juzgado] | lang=en
- "formato_n_armas_aseguradas_page": "page.tsx" | kind=code-symbol | source=app/formato-n-armas-aseguradas/page.tsx:L1 | neighbors=[06c55f5 Merge branch 'feature/testing' …, 27dcb21 Merge branch 'feature/testing' …, 41ea169 Merge branch 'testing' into con…, 5618308 guardado e evidencias con ed, 77ddf58 Merge branch 'feature/testing' …, 8355ac0 Merge branch 'feature/testing' …] | lang=en
- "formato_n_eventos_page": "page.tsx" | kind=code-symbol | source=app/formato-n-eventos/page.tsx:L1 | neighbors=[06c55f5 Merge branch 'feature/testing' …, 27dcb21 Merge branch 'feature/testing' …, 41ea169 Merge branch 'testing' into con…, 5618308 guardado e evidencias con ed, 77ddf58 Merge branch 'feature/testing' …, 8355ac0 Merge branch 'feature/testing' …] | lang=en
- "formato_n_rnd_page": "page.tsx" | kind=code-symbol | source=app/formato-n-rnd/page.tsx:L1 | neighbors=[06c55f5 Merge branch 'feature/testing' …, 27dcb21 Merge branch 'feature/testing' …, 41ea169 Merge branch 'testing' into con…, 5618308 guardado e evidencias con ed, 77ddf58 Merge branch 'feature/testing' …, 8355ac0 Merge branch 'feature/testing' …] | lang=en
- "monitorista_bandejasolicitudes": "BandejaSolicitudes.tsx" | kind=code-symbol | source=components/monitorista/BandejaSolicitudes.tsx:L1 | neighbors=[126b4d1 Monitorista V1, 27dcb21 Merge branch 'feature/testing' …, 44ebbc4 Merge branch 'feature/testing' …, 46b2c89 Merge branch 'testing' into juz…, 5618308 guardado e evidencias con ed, 5d179c0 Apartado de reportes] | lang=en
- "monitorista_types": "types.ts" | kind=code-symbol | source=lib/monitorista/types.ts:L1 | neighbors=[c27a9ee fase prefinal, page.tsx, denuncia-service.ts, detenido-service.ts, incidentes-camara-service.ts, mapper.ts] | lang=en

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
