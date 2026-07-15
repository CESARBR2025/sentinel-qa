# Node Description Batch 5 of 93

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

- "admin_repository": "repository.ts" | kind=code-symbol | source=lib/admin/repository.ts:L1 | neighbors=[actions.ts, mapper.ts, rowToRol(), rowToUsuarioLista(), actualizarUsuario(), asignarRolUsuario()] | lang=en
- "auxiliar_permisos": "permisos.ts" | kind=code-symbol | source=lib/auxiliar/permisos.ts:L1 | neighbors=[actions.ts, page.tsx, Accion, guardarPermiso(), guardarPlantillaSeccion(), obtenerPermisosUsuario()] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@0c31cc284a0b556a865b9d45217e793fb60a5485": "0c31cc2 Merge branch 'testing' into juzgado" | kind=Commit | source=git | neighbors=[page.tsx, feature/monitorista-reportes, feature/testing, fix/detenidos, fix/incidentes-camara, fix/subir-fotografias] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@672bab5a15c2d12a174d78669bc3766bda96d83c": "672bab5 libearciones para juzgado" | kind=Commit | source=git | neighbors=[page.tsx, SubirFotoDetenido.tsx, feature/testing, main, 46f24f8 generica function for infractio…, ff3622b Merge pull request #11 from pre…] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@de5682fb11072104ed8ddbb320a1aada57193083": "de5682f Merge pull request #10 from presidenciaSJR/fix/subir-fotografias" | kind=Commit | source=git | neighbors=[388b997 Apartados para subir fotografia…, 75ca4b2 Merge pull request #9 from pres…, page.tsx, SubirFotoDetenido.tsx, feature/testing, main] | lang=en
- "fiscalia_fiscaliadashboard": "FiscaliaDashboard.tsx" | kind=code-symbol | source=components/fiscalia/FiscaliaDashboard.tsx:L1 | neighbors=[0068216 Mejora de Dashboard, Login y tr…, 06c55f5 Merge branch 'feature/testing' …, 2dde720 Merge pull request #14 from pre…, 5bbdda8 Merge pull request #8 from pres…, 75ca4b2 Merge pull request #9 from pres…, 863c575 Merge pull request #24 from pre…] | lang=en
- "formato_n_atencion_victimas_page": "page.tsx" | kind=code-symbol | source=app/formato-n-atencion-victimas/page.tsx:L1 | neighbors=[0068216 Mejora de Dashboard, Login y tr…, 06c55f5 Merge branch 'feature/testing' …, 27dcb21 Merge branch 'feature/testing' …, 41ea169 Merge branch 'testing' into con…, 5618308 guardado e evidencias con ed, 77ddf58 Merge branch 'feature/testing' …] | lang=en
- "formato_n_fge_page": "page.tsx" | kind=code-symbol | source=app/formato-n-fge/page.tsx:L1 | neighbors=[0068216 Mejora de Dashboard, Login y tr…, 06c55f5 Merge branch 'feature/testing' …, 27dcb21 Merge branch 'feature/testing' …, 41ea169 Merge branch 'testing' into con…, 5618308 guardado e evidencias con ed, 77ddf58 Merge branch 'feature/testing' …] | lang=en
- "formato_n_fgr_page": "page.tsx" | kind=code-symbol | source=app/formato-n-fgr/page.tsx:L1 | neighbors=[0068216 Mejora de Dashboard, Login y tr…, 06c55f5 Merge branch 'feature/testing' …, 27dcb21 Merge branch 'feature/testing' …, 41ea169 Merge branch 'testing' into con…, 5618308 guardado e evidencias con ed, 77ddf58 Merge branch 'feature/testing' …] | lang=en
- "formato_n_medios_alternativos_page": "page.tsx" | kind=code-symbol | source=app/formato-n-medios-alternativos/page.tsx:L1 | neighbors=[0068216 Mejora de Dashboard, Login y tr…, 06c55f5 Merge branch 'feature/testing' …, 27dcb21 Merge branch 'feature/testing' …, 41ea169 Merge branch 'testing' into con…, 5618308 guardado e evidencias con ed, 77ddf58 Merge branch 'feature/testing' …] | lang=en
- "historial_page": "page.tsx" | kind=code-symbol | source=app/monitorista/historial/page.tsx:L1 | neighbors=[0068216 Mejora de Dashboard, Login y tr…, 27dcb21 Merge branch 'feature/testing' …, 388b997 Apartados para subir fotografia…, 514a705 refactorizacion sql, 5618308 guardado e evidencias con ed, 5d179c0 Apartado de reportes] | lang=en
- "permisos_registro": "registro.ts" | kind=code-symbol | source=lib/permisos/registro.ts:L1 | neighbors=[03f8b2a implementado rbac, 046f18c Merge pull request #19 from pre…, 27dcb21 Merge branch 'feature/testing' …, 5618308 guardado e evidencias con ed, 5a1b5d5 empezando corralon, 77ddf58 Merge branch 'feature/testing' …] | lang=en
- "agente_liberaciones_liberacionesdashboard": "LiberacionesDashboard.tsx" | kind=code-symbol | source=components/agente_liberaciones/LiberacionesDashboard.tsx:L1 | neighbors=[AVATAR_COLORS, EstatusLiberaciones, getBadge(), getInitials(), hashColor(), LiberacionesDashboard()] | lang=en
- "analisis_permisos": "permisos.ts" | kind=code-symbol | source=lib/analisis/permisos.ts:L1 | neighbors=[page.tsx, Accion, guardarPermiso(), guardarPlantillaSeccion(), obtenerPlantillaRol(), PermisoSeccion] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@22b7b54fd301460187e0de0fea19c2647daf780e": "22b7b54 Merge branch 'feature/reportes' into feature/testing" | kind=Commit | source=git | neighbors=[18f5bac llamada en card, feature/testing, main, 2516723 Modulo de permisos, 2dde720 Merge pull request #14 from pre…, 552d291 Merge branch 'testing' into con…] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@388b99707848ef0e0e02349ce0d31614ef0719ae": "388b997 Apartados para subir fotografias de los detenidos" | kind=Commit | source=git | neighbors=[page.tsx, SubirFotoDetenido.tsx, feature/testing, fix/subir-fotografias, main, de5682f Merge pull request #10 from pre…] | lang=es
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@821abe04c3a968d9bb8106fe453d78e2df8be143": "821abe0 replicando flujo de fiscalia-> juzgado" | kind=Commit | source=git | neighbors=[11e8817 Merge branch 'testing' into juz…, actions.ts, actions.ts, CerrarCasoModal.tsx, mapper.ts, page.tsx] | lang=nl
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@aaddee5724bd0502be1074ff7c9f23a79e5ddaa1": "aaddee5 Merge branch 'feature/testing' into feature/denuncias" | kind=Commit | source=git | neighbors=[93dd3ea Merge pull request #1 from pres…, feature/monitorista, feature/monitorista-reportes, fix/detenidos, fix/incidentes-camara, fix/subir-fotografias] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@ff3622b8be4baebcbb5d1a21ffdf1aa6371b964d": "ff3622b Merge pull request #11 from presidenciaSJR/conexion" | kind=Commit | source=git | neighbors=[672bab5 libearciones para juzgado, de5682f Merge pull request #10 from pre…, actions.ts, BotonVerDetalle.tsx, CargarOficioSection.tsx, ConfirmacionModal.tsx] | lang=en
- "reportes_incidentes_page": "page.tsx" | kind=code-symbol | source=app/reportes_incidentes/page.tsx:L1 | neighbors=[0068216 Mejora de Dashboard, Login y tr…, 13f7f39 Reporte-incidentes, 2516723 Modulo de permisos, 2fcba7b vista de reportes de incidentes…, 41ea169 Merge branch 'testing' into con…, 552d291 Merge branch 'testing' into con…] | lang=en
- "rol_servicios_service": "service.ts" | kind=code-symbol | source=lib/rol-servicios/service.ts:L1 | neighbors=[863c575 Merge pull request #24 from pre…, c27a9ee fase prefinal, repository.ts, getAsignacionesByRolId(), getBodyCams(), getEstadoFuerzaByRolId()] | lang=en
- "agente_infracciones_actions": "actions.ts" | kind=code-symbol | source=lib/agente_infracciones/actions.ts:L1 | neighbors=[capturarInfractorInfraccionesAction(), liberarGarantiaInfraccionesAction(), obtenerDashboardInfracciones(), obtenerDetalleInfraccionInfracciones(), obtenerInfracciones(), service.ts] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@1f7c0d720ddf0ff15bf44350dea9385607d1f93c": "1f7c0d7 Merge pull request #23 from presidenciaSJR/conexion" | kind=Commit | source=git | neighbors=[feature/testing, main, 67b1cb7 ReporteWord, repository.ts, service.ts, types.ts] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@290d6510777c2423d2c3dd73960c82ce2f471b16": "290d651 feat(despacho): flujo integral 911 → despacho → oficial → D1 → legal" | kind=Commit | source=git | neighbors=[FiltrosIncidentes.tsx, feature/testing, main, fcdb169 chore(graphify): actualiza graf…, repository.ts, TablonDespacho.tsx] | lang=en
- "consolidar_page": "page.tsx" | kind=code-symbol | source=app/envio-de-formatos/consolidar/page.tsx:L1 | neighbors=[0068216 Mejora de Dashboard, Login y tr…, 863c575 Merge pull request #24 from pre…, a2e0623 Consolidado de formatos N y Sub…, f5fac0b Merge branch 'testing' into con…, Arma, cardStyle] | lang=en
- "d1_repository": "repository.ts" | kind=code-symbol | source=lib/d1/repository.ts:L1 | neighbors=[067c4de arreglando flujo de fiscalia  a…, 07543de Conexion de reportes con d1 y l…, 16a63d4 Merge branch 'feature/testing' …, 1f7c0d7 Merge pull request #23 from pre…, 290d651 feat(despacho): flujo integral …, 2e958e1 catalogo de grupo de incidencia] | lang=en
- "incidentes_camara_route": "route.ts" | kind=code-symbol | source=app/api/monitorista/incidentes-camara/route.ts:L1 | neighbors=[27dcb21 Merge branch 'feature/testing' …, 388b997 Apartados para subir fotografia…, 50101e2 Merge pull request #6 from pres…, 5311c24 Editar Registros, 5618308 guardado e evidencias con ed, 5d179c0 Apartado de reportes] | lang=en
- "monitorista_ppt_service": "ppt-service.ts" | kind=code-symbol | source=lib/monitorista/ppt-service.ts:L1 | neighbors=[06c55f5 Merge branch 'feature/testing' …, 23a3b9d Cambios en la estructura de los…, 388b997 Apartados para subir fotografia…, 41ea169 Merge branch 'testing' into con…, 5d179c0 Apartado de reportes, 5ed311a Merge pull request #5 from pres…] | lang=en
- "prevencion_mapper": "mapper.ts" | kind=code-symbol | source=lib/prevencion/mapper.ts:L1 | neighbors=[0caf5dd Fixes, 514a705 refactorizacion sql, 863c575 Merge pull request #24 from pre…, c27a9ee fase prefinal, rowToAutoridadAdicional(), rowToBusqueda()] | lang=en
- "reportes_form_styles": "form-styles.ts" | kind=code-symbol | source=components/reportes/form-styles.ts:L1 | neighbors=[0068216 Mejora de Dashboard, Login y tr…, 06c55f5 Merge branch 'feature/testing' …, 41ea169 Merge branch 'testing' into con…, 8355ac0 Merge branch 'feature/testing' …, 863c575 Merge pull request #24 from pre…, bb10dcd Formatos V1] | lang=en
- "reportes_operativos_mapper": "mapper.ts" | kind=code-symbol | source=lib/reportes-operativos/mapper.ts:L1 | neighbors=[863c575 Merge pull request #24 from pre…, ad3ec5f mejorando esto, rowToArma(), rowToCateo(), rowToDetencionInc(), rowToDetencionOfi()] | lang=en
- "rol_servicios_actions": "actions.ts" | kind=code-symbol | source=lib/rol-servicios/actions.ts:L1 | neighbors=[11be750 Fase 1 de correccion - completa…, 6feefe2 BackEnd completo para hacer la …, 863c575 Merge pull request #24 from pre…, c27a9ee fase prefinal, auth.ts, auth] | lang=en
- "agente_juzgado_page": "page.tsx" | kind=code-symbol | source=app/agente_juzgado/page.tsx:L1 | neighbors=[actions.ts, obtenerDashboardJuzgado(), JuzgadoDashboardPage(), ProfileDropdown.tsx, ProfileDropdown(), ToastExito.tsx] | lang=en
- "auth_helpers_getuserwithrole": "getUserWithRole()" | kind=code-symbol | source=lib/auth/helpers.ts:L29 | neighbors=[actions.ts, layout.tsx, layout.tsx, helpers.ts, rowToUserWithRole(), page.tsx] | lang=en
- "auxiliar_page": "page.tsx" | kind=code-symbol | source=app/auxiliar/page.tsx:L1 | neighbors=[AuxiliarPage(), permisos.ts, tienePermiso(), ProfileDropdownAuxiliar.tsx, ProfileDropdownAuxiliar(), auth.ts] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@75e03e918ed8bad195c1e4a6f670808f02c16944": "75e03e9 puliendo flujo de juzgado-liberaciones-vehiculos-" | kind=Commit | source=git | neighbors=[actions.ts, BotonVerDetalle.tsx, CargarOficioSection.tsx, ConfirmacionModal.tsx, JuzgadoDashboard.tsx, JuzgadoTable.tsx] | lang=nl
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@92393e79eeb8bd73e39875946addf69135d1e790": "92393e7 flujo completado de juzgado" | kind=Commit | source=git | neighbors=[actions.ts, CapturarDetallesForm.tsx, DetallesAseguradoView.tsx, mapper.ts, repository.ts, service.ts] | lang=nl
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@93dd3eacbbe61c248cb181e56601565285e2e91d": "93dd3ea Merge pull request #1 from presidenciaSJR/juzgado" | kind=Commit | source=git | neighbors=[458bbfb registro de reporte de campo - …, 917002a Guardado de policia a cargo, feature/monitorista, feature/monitorista-reportes, fix/detenidos, fix/incidentes-camara] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@d64c8cdfd82b3f9968d3a836091aa8c745a2a108": "d64c8cd flujo de infracciones-liberaciones" | kind=Commit | source=git | neighbors=[51e682b mejorando flujo de liberaciones, actions.ts, CapturarDatosInfractorModal.tsx, InfraccionesDashboard.tsx, InfraccionesTable.tsx, mapper.ts] | lang=nl
- "envio_de_formatos_page": "page.tsx" | kind=code-symbol | source=app/envio-de-formatos/page.tsx:L1 | neighbors=[06c55f5 Merge branch 'feature/testing' …, 27dcb21 Merge branch 'feature/testing' …, 41ea169 Merge branch 'testing' into con…, 514a705 refactorizacion sql, 5618308 guardado e evidencias con ed, 77ddf58 Merge branch 'feature/testing' …] | lang=en

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/ugomez/Documents/GitHub/seguridad_publica/.graphify/description-instructions/batch-004.json

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
