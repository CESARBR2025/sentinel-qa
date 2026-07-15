# Node Description Batch 12 of 93

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

- "n_coordinacion_actions": "actions.ts" | kind=code-symbol | source=lib/n-coordinacion/actions.ts:L1 | neighbors=[67b1cb7 ReporteWord, 7e39526 Mejoras UI/UX, 863c575 Merge pull request #24 from pre…, auth.ts, auth, guardarDatosCoordinacion()] | lang=en
- "notificaciones_repository": "repository.ts" | kind=code-symbol | source=lib/notificaciones/repository.ts:L1 | neighbors=[863c575 Merge pull request #24 from pre…, ad3ec5f mejorando esto, actions.ts, db.ts, query(), mapper.ts] | lang=en
- "pendiente_analisis_page": "page.tsx" | kind=code-symbol | source=app/analisis/pendiente-analisis/page.tsx:L1 | neighbors=[0068216 Mejora de Dashboard, Login y tr…, 863c575 Merge pull request #24 from pre…, a6b7556 Formulario se puso a prueba, se…, fcb223f merge de testing, permisos.ts, tieneAccesoAnalisis()] | lang=en
- "pendientes_despacho_route": "route.ts" | kind=code-symbol | source=app/api/incidentes/pendientes-despacho/route.ts:L1 | neighbors=[27dcb21 Merge branch 'feature/testing' …, 5618308 guardado e evidencias con ed, 77ddf58 Merge branch 'feature/testing' …, 863c575 Merge pull request #24 from pre…, a58a0f7 Despachos, ad3ec5f mejorando esto] | lang=en
- "prevencion_types": "types.ts" | kind=code-symbol | source=lib/prevencion/types.ts:L1 | neighbors=[514a705 refactorizacion sql, 863c575 Merge pull request #24 from pre…, c27a9ee fase prefinal, mapper.ts, repository.ts, AutoridadAdicional] | lang=en
- "scripts_load_context": "load-context.mjs" | kind=code-symbol | source=scripts/load-context.mjs:L1 | neighbors=[11ee4f2 mejorando flujo de 911, 22bf125 Merge pull request #20 from pre…, 863c575 Merge pull request #24 from pre…, e6bffc9 boveda conectada, buildInstructions(), buildKeywords()] | lang=en
- "seguimientos_route": "route.ts" | kind=code-symbol | source=app/api/prevencion/busquedas/[id]/seguimientos/route.ts:L1 | neighbors=[27dcb21 Merge branch 'feature/testing' …, 5558751 feat: módulo Prevención del Del…, 5618308 guardado e evidencias con ed, 77ddf58 Merge branch 'feature/testing' …, 863c575 Merge pull request #24 from pre…, ad3ec5f mejorando esto] | lang=en
- "shared_pedirevidenciasmodal": "PedirEvidenciasModal.tsx" | kind=code-symbol | source=components/shared/PedirEvidenciasModal.tsx:L1 | neighbors=[TabSolicitudes.tsx, 5f13b34 Merge branch 'feature/testing' …, 863c575 Merge pull request #24 from pre…, 9ec6056 flujo de juzgado-monitorista co…, a7218bd Merge pull request #4 from pres…, ce84893 Merge branch 'feature/testing' …] | lang=en
- "steps_pasopago": "PasoPago.tsx" | kind=code-symbol | source=features/via/infracciones/components/steps/PasoPago.tsx:L1 | neighbors=[23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, 863c575 Merge pull request #24 from pre…, b5233a8 implementando via como modulo d…, f7b1aac Merge branch 'feature/testing' …, FormularioInfraccion.tsx] | lang=en
- "ui_toastauto": "ToastAuto.tsx" | kind=code-symbol | source=components/ui/ToastAuto.tsx:L1 | neighbors=[27dcb21 Merge branch 'feature/testing' …, 5618308 guardado e evidencias con ed, 77ddf58 Merge branch 'feature/testing' …, 863c575 Merge pull request #24 from pre…, f2c66e6 Extender roles y permisos finos…, page.tsx] | lang=en
- "admin_layout": "layout.tsx" | kind=code-symbol | source=app/admin/layout.tsx:L1 | neighbors=[AdminLayout(), helpers.ts, getUserWithRole(), auth.ts, auth, 0068216 Mejora de Dashboard, Login y tr…] | lang=en
- "admin_transito_layout": "layout.tsx" | kind=code-symbol | source=app/admin-transito/layout.tsx:L1 | neighbors=[AdminTransitoLayout(), helpers.ts, getUserWithRole(), auth.ts, auth, ProfileDropdown.tsx] | lang=en
- "admin_transito_mapper": "mapper.ts" | kind=code-symbol | source=lib/admin-transito/mapper.ts:L1 | neighbors=[rowToDepartamento(), rowToOficialLista(), rowToUserBasico(), rowToUserWithRole(), toStr(), types.ts] | lang=en
- "agente_911_page": "page.tsx" | kind=code-symbol | source=app/agente_911/page.tsx:L1 | neighbors=[service.ts, getStats(), Agente911DashboardPage(), service.ts, verificarRolAgente911(), auth.ts] | lang=en
- "agente_bitacorista_page": "page.tsx" | kind=code-symbol | source=app/agente_bitacorista/page.tsx:L1 | neighbors=[service.ts, getStats(), AgenteBitacoristaDashboardPage(), service.ts, verificarRolAgenteBitacorista(), auth.ts] | lang=en
- "agente_infracciones_mapper": "mapper.ts" | kind=code-symbol | source=lib/agente_infracciones/mapper.ts:L1 | neighbors=[inputToDbParams(), nvl(), rowToLiberacion(), str(), types.ts, CapturaInfractorInput] | lang=en
- "agente_infracciones_permisos": "permisos.ts" | kind=code-symbol | source=lib/agente_infracciones/permisos.ts:L1 | neighbors=[Accion, guardarPermiso(), guardarPlantillaSeccion(), obtenerPlantillaRol(), PermisoSeccion, Seccion] | lang=en
- "agente_juzgado_permisos": "permisos.ts" | kind=code-symbol | source=lib/agente_juzgado/permisos.ts:L1 | neighbors=[Accion, guardarPermiso(), guardarPlantillaSeccion(), obtenerPlantillaRol(), PermisoSeccion, Seccion] | lang=en
- "agente_liberaciones_mapper": "mapper.ts" | kind=code-symbol | source=lib/agente_liberaciones/mapper.ts:L1 | neighbors=[rowToLiberacion(), str(), types.ts, LiberacionRow, service.ts, 06c55f5 Merge branch 'feature/testing' …] | lang=en
- "agente_liberaciones_page": "page.tsx" | kind=code-symbol | source=app/agente_liberaciones/page.tsx:L1 | neighbors=[actions.ts, obtenerDashboardLiberaciones(), obtenerLiberaciones(), LiberacionesTable.tsx, LiberacionesDashboardPage(), ProfileDropdown.tsx] | lang=en
- "agente_liberaciones_permisos": "permisos.ts" | kind=code-symbol | source=lib/agente_liberaciones/permisos.ts:L1 | neighbors=[Accion, guardarPermiso(), guardarPlantillaSeccion(), obtenerPlantillaRol(), PermisoSeccion, Seccion] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@0fe445e29f2fa675a83a604d9d85cc407d9dfd71": "0fe445e vista de oficial" | kind=Commit | source=git | neighbors=[feature/monitorista, feature/monitorista-reportes, fix/detenidos, fix/incidentes-camara, fix/subir-fotografias, 458bbfb registro de reporte de campo - …] | lang=nl
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@28da720c3833ea537d1a6973a50bd1f6f59ecf8f": "28da720 Cambio de colores en dashboard y loader (correccion de imagen)" | kind=Commit | source=git | neighbors=[160d1e1 Monitorista V1.1, feature/monitorista-reportes, feature/testing, fix/detenidos, fix/incidentes-camara, fix/subir-fotografias] | lang=nl
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@356d3a716d77e5bea2179a3cef18969daacd64dc": "356d3a7 Subir rol agregado, falta darle mejor vista" | kind=Commit | source=git | neighbors=[page.tsx, feature/monitorista, feature/monitorista-reportes, feature/testing, fix/detenidos, fix/incidentes-camara] | lang=pt
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@69a557f3c74b4d884dd90df831a14df224747f8f": "69a557f CAMBIO CORREGIDO" | kind=Commit | source=git | neighbors=[feature/monitorista, feature/monitorista-reportes, fix/detenidos, fix/incidentes-camara, fix/subir-fotografias, 166a26b Merge branch 'feature/testing' …] | lang=pt
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@7f3fe1ac2c04221ffa46cca74bc2018ff13df091": "7f3fe1a Formulariop de Rondines listo, falta revisarlo PERO YA ES FUNCIONAL" | kind=Commit | source=git | neighbors=[feature/monitorista, feature/monitorista-reportes, fix/detenidos, fix/incidentes-camara, fix/subir-fotografias, 0844e6e Corregido] | lang=es
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@95b78c1d99e3697b5e2349399de1c7adc38ec744": "95b78c1 cambios de incidentes" | kind=Commit | source=git | neighbors=[4d4a9b7 formulario de notificaciones po…, feature/monitorista, feature/monitorista-reportes, fix/detenidos, fix/incidentes-camara, fix/subir-fotografias] | lang=nl
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@98e7e6eb5f17a46e7f4c211ed1ddbac02e91c1f6": "98e7e6e vista de reportes de d1" | kind=Commit | source=git | neighbors=[6f8a089 Vista de estadisticos diarios, …, feature/testing, fix/subir-fotografias, main, 75ca4b2 Merge pull request #9 from pres…, b233bc7 Merge branch 'testing' into con…] | lang=nl
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@a6b7556e4d852eb3271e60ee87a5cc2814f2c870": "a6b7556 Formulario se puso a prueba, se prellena con datos de denuncia, campo e…" | kind=Commit | source=git | neighbors=[3249f00 Cambios en rellenado de ppt!, page.tsx, TablonAnalisis.tsx, feature/testing, main, a2e0623 Consolidado de formatos N y Sub…] | lang=es
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@d2a4a5ebc66e5e7e114d49b2f87f28896f03a895": "d2a4a5e guardado de nuemro exterior, interior, e implementacion de mapa para gu…" | kind=Commit | source=git | neighbors=[7d7ebb1 merge de archivos, feature/monitorista, feature/monitorista-reportes, fix/detenidos, fix/incidentes-camara, fix/subir-fotografias] | lang=pt
- "corralon_permisos": "permisos.ts" | kind=code-symbol | source=lib/corralon/permisos.ts:L1 | neighbors=[5a1b5d5 empezando corralon, 863c575 Merge pull request #24 from pre…, Accion, guardarPermiso(), guardarPlantillaSeccion(), obtenerPermisosUsuario()] | lang=en
- "corralon_service": "service.ts" | kind=code-symbol | source=lib/corralon/service.ts:L1 | neighbors=[16df128 flujo de corralones listo, 5a1b5d5 empezando corralon, 863c575 Merge pull request #24 from pre…, c27a9ee fase prefinal, actions.ts, mapper.ts] | lang=en
- "d1_noiniciada_descargatable": "DescargaTable.tsx" | kind=code-symbol | source=components/reportes/d1_noiniciada/DescargaTable.tsx:L1 | neighbors=[0068216 Mejora de Dashboard, Login y tr…, 22b7b54 Merge branch 'feature/reportes'…, 4c9fa8a vista de reporte de d1 no inici…, 552d291 Merge branch 'testing' into con…, 712c116 Merge branch 'testing' into con…, 863c575 Merge pull request #24 from pre…] | lang=en
- "dashboard_enable_2fa": "enable-2fa.tsx" | kind=code-symbol | source=app/dashboard/enable-2fa.tsx:L1 | neighbors=[0068216 Mejora de Dashboard, Login y tr…, 11e8817 Merge branch 'testing' into juz…, 28da720 Cambio de colores en dashboard …, 44ebbc4 Merge branch 'feature/testing' …, 6a042cd feat: sistema de autenticación,…, 863c575 Merge pull request #24 from pre…] | lang=en
- "incidentes_actions_requireoperador": "requireOperador()" | kind=code-symbol | source=lib/incidentes/actions.ts:L16 | neighbors=[actions.ts, addPersonaAfectada(), cerrarPorDetencion(), createAlarmaEscolar(), createDespacho(), createExtorsion()] | lang=en
- "infracciones_mapper": "mapper.ts" | kind=code-symbol | source=features/via/infracciones/mapper.ts:L1 | neighbors=[16a63d4 Merge branch 'feature/testing' …, 1dbd480 flujo de liberaciones completado, 23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, 863c575 Merge pull request #24 from pre…, ac48eb1 Merge pull request #17 from pre…] | lang=en
- "lib_error_handler_apperror": "AppError" | kind=code-symbol | source=lib/error-handler.ts:L1 | neighbors=[actions.ts, actions.ts, actions.ts, error-handler.ts, .constructor(), ConflictError] | lang=en
- "maps_googlemappicker": "GoogleMapPicker.tsx" | kind=code-symbol | source=components/maps/GoogleMapPicker.tsx:L1 | neighbors=[FormularioAseguradoJuzgado.tsx, formAnalisis.tsx, generarPresentacion.tsx, 2ca9f50 Formulario sin backend, 2db162a flujo de asegurados, 8355ac0 Merge branch 'feature/testing' …] | lang=en
- "monitorista_batchenviofotos": "BatchEnvioFotos.tsx" | kind=code-symbol | source=components/monitorista/BatchEnvioFotos.tsx:L1 | neighbors=[27dcb21 Merge branch 'feature/testing' …, 5618308 guardado e evidencias con ed, 5d179c0 Apartado de reportes, 5f13b34 Merge branch 'feature/testing' …, 77ddf58 Merge branch 'feature/testing' …, 863c575 Merge pull request #24 from pre…] | lang=en
- "partials_footer": "Footer.tsx" | kind=code-symbol | source=components/partials/Footer.tsx:L1 | neighbors=[page.tsx, page.tsx, page.tsx, 0068216 Mejora de Dashboard, Login y tr…, 3b10d72 Merge branch 'feature/testing' …, 8303881 Subida de header y footer, falt…] | lang=en

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/ugomez/Documents/GitHub/seguridad_publica/.graphify/description-instructions/batch-011.json

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
