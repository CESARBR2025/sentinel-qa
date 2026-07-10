# Node Description Batch 4 of 79

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

- "fiscalia_fiscaliadashboard": "FiscaliaDashboard.tsx" | kind=code-symbol | source=components/fiscalia/FiscaliaDashboard.tsx:L1 | neighbors=[06c55f5 Merge branch 'feature/testing' …, 2dde720 Merge pull request #14 from pre…, 5bbdda8 Merge pull request #8 from pres…, 75ca4b2 Merge pull request #9 from pres…, 953d38a implementando vista de fiscalia, d64c8cd flujo de infracciones-liberacio…] | lang=en
- "formato_n_atencion_victimas_page": "page.tsx" | kind=code-symbol | source=app/formato-n-atencion-victimas/page.tsx:L1 | neighbors=[06c55f5 Merge branch 'feature/testing' …, 27dcb21 Merge branch 'feature/testing' …, 41ea169 Merge branch 'testing' into con…, 5618308 guardado e evidencias con ed, 77ddf58 Merge branch 'feature/testing' …, 8355ac0 Merge branch 'feature/testing' …] | lang=en
- "formato_n_fge_page": "page.tsx" | kind=code-symbol | source=app/formato-n-fge/page.tsx:L1 | neighbors=[06c55f5 Merge branch 'feature/testing' …, 27dcb21 Merge branch 'feature/testing' …, 41ea169 Merge branch 'testing' into con…, 5618308 guardado e evidencias con ed, 77ddf58 Merge branch 'feature/testing' …, 8355ac0 Merge branch 'feature/testing' …] | lang=en
- "formato_n_fgr_page": "page.tsx" | kind=code-symbol | source=app/formato-n-fgr/page.tsx:L1 | neighbors=[06c55f5 Merge branch 'feature/testing' …, 27dcb21 Merge branch 'feature/testing' …, 41ea169 Merge branch 'testing' into con…, 5618308 guardado e evidencias con ed, 77ddf58 Merge branch 'feature/testing' …, 8355ac0 Merge branch 'feature/testing' …] | lang=en
- "formato_n_medios_alternativos_page": "page.tsx" | kind=code-symbol | source=app/formato-n-medios-alternativos/page.tsx:L1 | neighbors=[06c55f5 Merge branch 'feature/testing' …, 27dcb21 Merge branch 'feature/testing' …, 41ea169 Merge branch 'testing' into con…, 5618308 guardado e evidencias con ed, 77ddf58 Merge branch 'feature/testing' …, 8355ac0 Merge branch 'feature/testing' …] | lang=en
- "historial_page": "page.tsx" | kind=code-symbol | source=app/monitorista/historial/page.tsx:L1 | neighbors=[27dcb21 Merge branch 'feature/testing' …, 388b997 Apartados para subir fotografia…, 514a705 refactorizacion sql, 5618308 guardado e evidencias con ed, 5d179c0 Apartado de reportes, 5f13b34 Merge branch 'feature/testing' …] | lang=en
- "reportes_d1_route": "route.ts" | kind=code-symbol | source=app/api/reportes-d1/route.ts:L1 | neighbors=[0c31cc2 Merge branch 'testing' into juz…, 27dcb21 Merge branch 'feature/testing' …, 44a01c3 fase 3-4-5, 44ebbc4 Merge branch 'feature/testing' …, 5618308 guardado e evidencias con ed, 5f13b34 Merge branch 'feature/testing' …] | lang=en
- "rol_servicios_catalogos_actions": "catalogos-actions.ts" | kind=code-symbol | source=lib/rol-servicios/catalogos-actions.ts:L1 | neighbors=[11be750 Fase 1 de correccion - completa…, 6feefe2 BackEnd completo para hacer la …, c27a9ee fase prefinal, auth.ts, auth, db.ts] | lang=en
- "rol_servicios_service": "service.ts" | kind=code-symbol | source=lib/rol-servicios/service.ts:L1 | neighbors=[c27a9ee fase prefinal, repository.ts, getAsignacionesByRolId(), getBodyCams(), getEstadoFuerzaByRolId(), getEstadoFuerzaConceptos()] | lang=en
- "agente_infracciones_actions": "actions.ts" | kind=code-symbol | source=lib/agente_infracciones/actions.ts:L1 | neighbors=[capturarInfractorInfraccionesAction(), liberarGarantiaInfraccionesAction(), obtenerDashboardInfracciones(), obtenerDetalleInfraccionInfracciones(), obtenerInfracciones(), service.ts] | lang=en
- "agente_liberaciones_liberacionesdashboard": "LiberacionesDashboard.tsx" | kind=code-symbol | source=components/agente_liberaciones/LiberacionesDashboard.tsx:L1 | neighbors=[AVATAR_COLORS, EstatusLiberaciones, getBadge(), getInitials(), hashColor(), LiberacionesDashboard()] | lang=en
- "analisis_page": "page.tsx" | kind=code-symbol | source=app/analisis/page.tsx:L1 | neighbors=[actionTextStyle, cardContentStyle, cardDescStyle, cardStyle, cardTitleStyle, decoratorLine] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@22b7b54fd301460187e0de0fea19c2647daf780e": "22b7b54 Merge branch 'feature/reportes' into feature/testing" | kind=Commit | source=git | neighbors=[18f5bac llamada en card, conexion, testing, 2516723 Modulo de permisos, 2dde720 Merge pull request #14 from pre…, 552d291 Merge branch 'testing' into con…] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@997ef65431c9b4b9f0c02b0b1479177244a4996d": "997ef65 Merge pull request #2 from presidenciaSJR/juzgado" | kind=Commit | source=git | neighbors=[7400135 Merge branch 'feature/testing' …, actions.ts, page.tsx, ProfileDropdown.tsx, repository.ts, service.ts] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@f80d33f79def9197aaad03aabc73ae30d089ff9f": "f80d33f Merge branch 'feature/testing' of https://github.com/presidenciaSJR/seg…" | kind=Commit | source=git | neighbors=[997ef65 Merge pull request #2 from pres…, a2907e2 Boton agregado para crear roles!, actions.ts, page.tsx, ProfileDropdown.tsx, repository.ts] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@ff3622b8be4baebcbb5d1a21ffdf1aa6371b964d": "ff3622b Merge pull request #11 from presidenciaSJR/conexion" | kind=Commit | source=git | neighbors=[672bab5 libearciones para juzgado, de5682f Merge pull request #10 from pre…, actions.ts, BotonVerDetalle.tsx, CargarOficioSection.tsx, ConfirmacionModal.tsx] | lang=en
- "d1_noiniciada_page": "page.tsx" | kind=code-symbol | source=app/d1_noiniciada/page.tsx:L1 | neighbors=[22b7b54 Merge branch 'feature/reportes'…, 2516723 Modulo de permisos, 41ea169 Merge branch 'testing' into con…, 4c9fa8a vista de reporte de d1 no inici…, 514a705 refactorizacion sql, 552d291 Merge branch 'testing' into con…] | lang=en
- "incidentes_camara_route": "route.ts" | kind=code-symbol | source=app/api/monitorista/incidentes-camara/route.ts:L1 | neighbors=[27dcb21 Merge branch 'feature/testing' …, 388b997 Apartados para subir fotografia…, 50101e2 Merge pull request #6 from pres…, 5311c24 Editar Registros, 5618308 guardado e evidencias con ed, 5d179c0 Apartado de reportes] | lang=en
- "infraccionid_route": "route.ts" | kind=code-symbol | source=app/api/via/pagos/finalizar-instante/[ordenPagoId]/[infraccionId]/route.ts:L1 | neighbors=[16a63d4 Merge branch 'feature/testing' …, 1dbd480 flujo de liberaciones completado, 91c36bf validando orden de pago, ac48eb1 Merge pull request #17 from pre…, ad3ec5f mejorando esto, ede5a1d eliminado referencias a via_pru…] | lang=en
- "monitorista_ppt_service": "ppt-service.ts" | kind=code-symbol | source=lib/monitorista/ppt-service.ts:L1 | neighbors=[06c55f5 Merge branch 'feature/testing' …, 23a3b9d Cambios en la estructura de los…, 388b997 Apartados para subir fotografia…, 41ea169 Merge branch 'testing' into con…, 5d179c0 Apartado de reportes, 5ed311a Merge pull request #5 from pres…] | lang=en
- "reportes_incidentes_page": "page.tsx" | kind=code-symbol | source=app/reportes_incidentes/page.tsx:L1 | neighbors=[13f7f39 Reporte-incidentes, 2516723 Modulo de permisos, 2fcba7b vista de reportes de incidentes…, 41ea169 Merge branch 'testing' into con…, 552d291 Merge branch 'testing' into con…, 719b5ab cambio para generacion de repor…] | lang=en
- "reportes_operativos_mapper": "mapper.ts" | kind=code-symbol | source=lib/reportes-operativos/mapper.ts:L1 | neighbors=[ad3ec5f mejorando esto, rowToArma(), rowToCateo(), rowToDetencionInc(), rowToDetencionOfi(), rowToDroga()] | lang=en
- "rol_servicios_actions": "actions.ts" | kind=code-symbol | source=lib/rol-servicios/actions.ts:L1 | neighbors=[11be750 Fase 1 de correccion - completa…, 6feefe2 BackEnd completo para hacer la …, c27a9ee fase prefinal, auth.ts, auth, db.ts] | lang=en
- "sin_robos_page": "page.tsx" | kind=code-symbol | source=app/sin_robos/page.tsx:L1 | neighbors=[156c925 vista de reporte de sin robos, 1acddac Merge branch 'feature/testing' …, 22b7b54 Merge branch 'feature/reportes'…, 2516723 Modulo de permisos, 41ea169 Merge branch 'testing' into con…, 514a705 refactorizacion sql] | lang=en
- "solicitudid_page": "page.tsx" | kind=code-symbol | source=app/fiscalia/solicitudes/[solicitudId]/page.tsx:L1 | neighbors=[5f13b34 Merge branch 'feature/testing' …, 6109a7a replicando flujo para fiscalia, 92393e7 flujo completado de juzgado, a7218bd Merge pull request #4 from pres…, ce84893 Merge branch 'feature/testing' …, CapturarDetallesForm.tsx] | lang=en
- "agente_infracciones_service": "service.ts" | kind=code-symbol | source=lib/agente_infracciones/service.ts:L1 | neighbors=[actions.ts, mapper.ts, rowToLiberacion(), repository.ts, actualizarDatosInfractor(), insertarOrdenPagoSa7()] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@0e33bf68e8273b1f03c79b3bca0bcb6905c5e739": "0e33bf6 feat: módulo Admin, Prórroga, Filtros medidas, Autoridades adicionales …" | kind=Commit | source=git | neighbors=[actions.ts, layout.tsx, page.tsx, main, 6cb1055 Mejoras de UI/UIX, module-cards.tsx] | lang=es
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@388b99707848ef0e0e02349ce0d31614ef0719ae": "388b997 Apartados para subir fotografias de los detenidos" | kind=Commit | source=git | neighbors=[page.tsx, SubirFotoDetenido.tsx, conexion, testing, de5682f Merge pull request #10 from pre…, FilaDetenidoRol.tsx] | lang=es
- "consolidar_page": "page.tsx" | kind=code-symbol | source=app/envio-de-formatos/consolidar/page.tsx:L1 | neighbors=[a2e0623 Consolidado de formatos N y Sub…, f5fac0b Merge branch 'testing' into con…, Arma, cardStyle, Consolidado, ConsolidarFormatoNPage()] | lang=en
- "d1_page": "page.tsx" | kind=code-symbol | source=app/d1/page.tsx:L1 | neighbors=[07543de Conexion de reportes con d1 y l…, 2516723 Modulo de permisos, 41ea169 Merge branch 'testing' into con…, 514a705 refactorizacion sql, 552d291 Merge branch 'testing' into con…, 8355ac0 Merge branch 'feature/testing' …] | lang=en
- "envio_de_formatos_page": "page.tsx" | kind=code-symbol | source=app/envio-de-formatos/page.tsx:L1 | neighbors=[06c55f5 Merge branch 'feature/testing' …, 27dcb21 Merge branch 'feature/testing' …, 41ea169 Merge branch 'testing' into con…, 514a705 refactorizacion sql, 5618308 guardado e evidencias con ed, 77ddf58 Merge branch 'feature/testing' …] | lang=en
- "juridico_page": "page.tsx" | kind=code-symbol | source=app/prevencion/juridico/page.tsx:L1 | neighbors=[06c55f5 Merge branch 'feature/testing' …, 27dcb21 Merge branch 'feature/testing' …, 41ea169 Merge branch 'testing' into con…, 514a705 refactorizacion sql, 5558751 feat: módulo Prevención del Del…, 5618308 guardado e evidencias con ed] | lang=en
- "permisos_registro": "registro.ts" | kind=code-symbol | source=lib/permisos/registro.ts:L1 | neighbors=[27dcb21 Merge branch 'feature/testing' …, 5618308 guardado e evidencias con ed, 5a1b5d5 empezando corralon, 77ddf58 Merge branch 'feature/testing' …, f2c66e6 Extender roles y permisos finos…, page.tsx] | lang=en
- "prevencion_mapper": "mapper.ts" | kind=code-symbol | source=lib/prevencion/mapper.ts:L1 | neighbors=[514a705 refactorizacion sql, c27a9ee fase prefinal, rowToAutoridadAdicional(), rowToBusqueda(), rowToContestacion(), rowToFichaBusquedaDetalle()] | lang=en
- "reportes_form_styles": "form-styles.ts" | kind=code-symbol | source=components/reportes/form-styles.ts:L1 | neighbors=[06c55f5 Merge branch 'feature/testing' …, 41ea169 Merge branch 'testing' into con…, 8355ac0 Merge branch 'feature/testing' …, bb10dcd Formatos V1, c95f412 Merge branch 'feature/testing' …, page.tsx] | lang=en
- "reportes_formato_n_armas_aseguradas_service": "formato-n-armas-aseguradas-service.ts" | kind=code-symbol | source=lib/reportes/formato-n-armas-aseguradas-service.ts:L1 | neighbors=[06c55f5 Merge branch 'feature/testing' …, 41ea169 Merge branch 'testing' into con…, 8355ac0 Merge branch 'feature/testing' …, a2e0623 Consolidado de formatos N y Sub…, bb10dcd Formatos V1, c95f412 Merge branch 'feature/testing' …] | lang=en
- "agente_juzgado_page": "page.tsx" | kind=code-symbol | source=app/agente_juzgado/page.tsx:L1 | neighbors=[actions.ts, obtenerDashboardJuzgado(), JuzgadoDashboardPage(), ProfileDropdown.tsx, ProfileDropdown(), ToastExito.tsx] | lang=en
- "auth_helpers_getuserwithrole": "getUserWithRole()" | kind=code-symbol | source=lib/auth/helpers.ts:L25 | neighbors=[actions.ts, layout.tsx, layout.tsx, helpers.ts, rowToUserWithRole(), actions.ts] | lang=en
- "auxiliar_permisos": "permisos.ts" | kind=code-symbol | source=lib/auxiliar/permisos.ts:L1 | neighbors=[actions.ts, Accion, guardarPermiso(), guardarPlantillaSeccion(), obtenerPermisosUsuario(), obtenerPlantillaRol()] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@090c4dd6c28d10a74ad8eec7001e6fa9a4b5e8b5": "090c4dd vista de fiscalia" | kind=Commit | source=git | neighbors=[actions.ts, page.tsx, ProfileDropdown.tsx, repository.ts, service.ts, ToastExito.tsx] | lang=nl

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/cesarbr/Documents/dev/sjr/seguridad_publica/.graphify/description-instructions/batch-003.json

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
