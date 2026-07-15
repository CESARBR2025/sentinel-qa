# Node Description Batch 18 of 93

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

- "commit:repo:github.com/presidenciaSJR/seguridad_publica@199ce68e039fafc9454c08a4d7e17170f45c7df0": "199ce68 Merge branch 'main' of https://github.com/presidenciaSJR/seguridad_publ…" | kind=Commit | source=git | neighbors=[feature/monitorista-reportes, fix/detenidos, fix/incidentes-camara, fix/subir-fotografias, 2e36377 Eliminar tutoriales de flujo in…, 4271f37 feat(doc): agregar manual de us…]
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@283f34200d56b11b1f2b38d62deeddc6d77e1f33": "283f342 Merge branch 'feature/testing' of https://github.com/presidenciaSJR/seg…" | kind=Commit | source=git | neighbors=[feature/monitorista, feature/monitorista-reportes, fix/detenidos, fix/incidentes-camara, fix/subir-fotografias, 3a00521 Merge branch 'feature/testing' …]
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@2be4ca9ae4ff3a5d1b237b09267954a3b2df39fb": "2be4ca9 Cambio en header" | kind=Commit | source=git | neighbors=[feature/monitorista, feature/monitorista-reportes, fix/detenidos, fix/incidentes-camara, fix/subir-fotografias, 3a00521 Merge branch 'feature/testing' …]
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@2e36377810689a31202162fcc8384625f96efb23": "2e36377 Eliminar tutoriales de flujo innecesarios" | kind=Commit | source=git | neighbors=[199ce68 Merge branch 'main' of https://…, feature/monitorista-reportes, fix/detenidos, fix/incidentes-camara, fix/subir-fotografias, 863c575 Merge pull request #24 from pre…]
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@3c12c416b0186391bd45cf0c526368c9292bc981": "3c12c41 cambios en flujo de 911-despacho" | kind=Commit | source=git | neighbors=[feature/testing, main, 7a1ae94 911-rondin, context-loader.js, populate-vault.mjs, trace-client.mjs]
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@49dca479f6546c67df478e85e13a41ece8cc067f": "49dca47 cambio" | kind=Commit | source=git | neighbors=[feature/monitorista, feature/monitorista-reportes, fix/detenidos, fix/incidentes-camara, fix/subir-fotografias, 82ae6e9 Interfaz de llamada 911 cambios]
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@6488a30d265406604e860f95a0a52143a16960c5": "6488a30 Formulario sin backend de 911 listo" | kind=Commit | source=git | neighbors=[feature/monitorista, feature/monitorista-reportes, fix/detenidos, fix/incidentes-camara, fix/subir-fotografias, 283f342 Merge branch 'feature/testing' …]
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@67b1cb74c5ac29bd173a968e016c5c517f19f07d": "67b1cb7 ReporteWord" | kind=Commit | source=git | neighbors=[1f7c0d7 Merge pull request #23 from pre…, feature/testing, main, 7e39526 Mejoras UI/UX, page.tsx, route.ts]
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@a0ec8d2c2dfbfde9cb6ea5865a8732c2320f11aa": "a0ec8d2 topbar en 911" | kind=Commit | source=git | neighbors=[83f48a2 Merge branch 'feature/correccio…, feature/monitorista, feature/monitorista-reportes, fix/detenidos, fix/incidentes-camara, fix/subir-fotografias]
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@c69454373882f48c57032868e9293749ba7b70cc": "c694543 cambio dee estatus" | kind=Commit | source=git | neighbors=[519716a Formulario para registro de wha…, feature/monitorista, feature/monitorista-reportes, fix/detenidos, fix/incidentes-camara, fix/subir-fotografias]
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@e6bffc94cb627a96f24106c5c71c5914defb40fa": "e6bffc9 boveda conectada" | kind=Commit | source=git | neighbors=[c27a9ee fase prefinal, feature/testing, main, a7a7f2e boveda, graphify.js, exportar-schema.ts]
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@ea0242b7aa39a9b85d47f1d1346cb064b98394be": "ea0242b vista de juridico" | kind=Commit | source=git | neighbors=[c471e9c Merge pull request #15 from pre…, feature/testing, main, 8355ac0 Merge branch 'feature/testing' …, page.tsx, page.tsx]
- "corralon_types": "types.ts" | kind=code-symbol | source=lib/corralon/types.ts:L1 | neighbors=[16df128 flujo de corralones listo, 5a1b5d5 empezando corralon, 863c575 Merge pull request #24 from pre…, actions.ts, mapper.ts, service.ts]
- "d1_noiniciada_styles": "styles.ts" | kind=code-symbol | source=components/reportes/d1_noiniciada/styles.ts:L1 | neighbors=[0068216 Mejora de Dashboard, Login y tr…, 4c9fa8a vista de reporte de d1 no inici…, 712c116 Merge branch 'testing' into con…, 863c575 Merge pull request #24 from pre…, e286619 Merge branch 'feature/testing' …, DescargaFilters.tsx]
- "d1_types": "types.ts" | kind=code-symbol | source=lib/d1/types.ts:L1 | neighbors=[1f7c0d7 Merge pull request #23 from pre…, 2e958e1 catalogo de grupo de incidencia, 7e39526 Mejoras UI/UX, 863c575 Merge pull request #24 from pre…, ad3ec5f mejorando esto, mapper.ts]
- "flota_mapper": "mapper.ts" | kind=code-symbol | source=lib/flota/mapper.ts:L1 | neighbors=[863c575 Merge pull request #24 from pre…, c27a9ee fase prefinal, rowToPatrulla(), rowToPatrullaAsignacion(), toBool(), toStr()]
- "forms_formkit": "FormKit.tsx" | kind=code-symbol | source=components/forms/FormKit.tsx:L1 | neighbors=[7e39526 Mejoras UI/UX, 863c575 Merge pull request #24 from pre…, Field(), FormActions(), FormHeader(), Label()]
- "hooks_useanalistaform": "useAnalistaForm.ts" | kind=code-symbol | source=hooks/useAnalistaForm.ts:L1 | neighbors=[formAnalisis.tsx, 2ca9f50 Formulario sin backend, 5618308 guardado e evidencias con ed, 56b6577 FORMULARIO SE ENLAZO A LA TABLA…, 5830570 Seccion de analista, uya con bd…, 863c575 Merge pull request #24 from pre…]
- "hooks_usedespacho": "useDespacho.ts" | kind=code-symbol | source=hooks/useDespacho.ts:L1 | neighbors=[435348e corrigiendo flujo de rondin, 863c575 Merge pull request #24 from pre…, a58a0f7 Despachos, f0089cf Merge pull request #21 from pre…, TablonDespacho.tsx, DespachoDetalle]
- "iniciar_solicitud_route": "route.ts" | kind=code-symbol | source=app/api/via/ciudadano/iniciar-solicitud/route.ts:L1 | neighbors=[16a63d4 Merge branch 'feature/testing' …, 1dbd480 flujo de liberaciones completado, 863c575 Merge pull request #24 from pre…, 91c36bf validando orden de pago, ac48eb1 Merge pull request #17 from pre…, ad3ec5f mejorando esto]
- "legalidad_repository": "repository.ts" | kind=code-symbol | source=features/via/legalidad/repository.ts:L1 | neighbors=[23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, 863c575 Merge pull request #24 from pre…, b5233a8 implementando via como modulo d…, ede5a1d eliminado referencias a via_pru…, f7b1aac Merge branch 'feature/testing' …]
- "lib_error_handler_forbiddenerror": "ForbiddenError" | kind=code-symbol | source=lib/error-handler.ts:L30 | neighbors=[actions.ts, actions.ts, actions.ts, error-handler.ts, AppError, .constructor()]
- "lib_error_handler_unauthorizederror": "UnauthorizedError" | kind=code-symbol | source=lib/error-handler.ts:L24 | neighbors=[actions.ts, actions.ts, actions.ts, error-handler.ts, AppError, .constructor()]
- "oficial_marcarensitiobutton": "MarcarEnSitioButton.tsx" | kind=code-symbol | source=components/oficial/MarcarEnSitioButton.tsx:L1 | neighbors=[0d9172a mejorando flujo de 911-despacho, 2233342 Fix/MarcarEnSitio, 22bf125 Merge pull request #20 from pre…, 863c575 Merge pull request #24 from pre…, DespachoContent.tsx, actions.ts]
- "oficial_profiledropdown_profiledropdown": "ProfileDropdown()" | kind=code-symbol | source=components/oficial/ProfileDropdown.tsx:L16 | neighbors=[layout.tsx, page.tsx, page.tsx, page.tsx, page.tsx, page.tsx]
- "oficiales_types": "types.ts" | kind=code-symbol | source=features/via/oficiales/types.ts:L1 | neighbors=[067c4de arreglando flujo de fiscalia  a…, 16a63d4 Merge branch 'feature/testing' …, 23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, 863c575 Merge pull request #24 from pre…, ac48eb1 Merge pull request #17 from pre…]
- "partials_footer_dashboardfooter": "DashboardFooter()" | kind=code-symbol | source=components/partials/Footer.tsx:L1 | neighbors=[page.tsx, page.tsx, page.tsx, page.tsx, page.tsx, page.tsx]
- "prevencion_permisos_tieneaccesoseccion": "tieneAccesoSeccion()" | kind=code-symbol | source=lib/prevencion/permisos.ts:L29 | neighbors=[page.tsx, page.tsx, page.tsx, page.tsx, page.tsx, actions.ts]
- "prevencion_permisos_tienepermiso": "tienePermiso()" | kind=code-symbol | source=lib/prevencion/permisos.ts:L13 | neighbors=[page.tsx, page.tsx, page.tsx, page.tsx, page.tsx, page.tsx]
- "reportes_menuoption": "menuOption.tsx" | kind=code-symbol | source=components/reportes/menuOption.tsx:L1 | neighbors=[0068216 Mejora de Dashboard, Login y tr…, 863c575 Merge pull request #24 from pre…, b170599 Merge branch 'feature/testing' …, b403f89 Vista para reportes de incident…, bd1a223 Merge branch 'feature/vistas-re…, page.tsx]
- "rol_servicios_catalogos_actions_togglecatalogo": "toggleCatalogo()" | kind=code-symbol | source=lib/rol-servicios/catalogos-actions.ts:L27 | neighbors=[catalogos-actions.ts, toggleBodyCam(), req(), requireAdmin(), toggleConcepto(), toggleMedioCanalizacion()]
- "scripts_exportar_schema": "exportar-schema.ts" | kind=code-symbol | source=scripts/exportar-schema.ts:L1 | neighbors=[863c575 Merge pull request #24 from pre…, e6bffc9 boveda conectada, db.ts, ColumnInfo, getColumns(), getEnums()]
- "scripts_extract_domain": "extract-domain.mjs" | kind=code-symbol | source=scripts/extract-domain.mjs:L1 | neighbors=[11ee4f2 mejorando flujo de 911, 22bf125 Merge pull request #20 from pre…, 863c575 Merge pull request #24 from pre…, e6bffc9 boveda conectada, CONTEXT_MAP, __dirname]
- "services_analisisservice": "analisisService.ts" | kind=code-symbol | source=services/analisisService.ts:L1 | neighbors=[formAnalisis.tsx, generarPresentacion.tsx, TablonAnalisis.tsx, 06c55f5 Merge branch 'feature/testing' …, 3249f00 Cambios en rellenado de ppt!, 41ea169 Merge branch 'testing' into con…]
- "shared_direcciongooglemaps": "DireccionGoogleMaps.tsx" | kind=code-symbol | source=components/shared/DireccionGoogleMaps.tsx:L1 | neighbors=[CapturarDetallesForm.tsx, 5f13b34 Merge branch 'feature/testing' …, 863c575 Merge pull request #24 from pre…, 92393e7 flujo completado de juzgado, a7218bd Merge pull request #4 from pres…, ce84893 Merge branch 'feature/testing' …]
- "steps_pasoevidencias": "PasoEvidencias.tsx" | kind=code-symbol | source=features/via/infracciones/components/steps/PasoEvidencias.tsx:L1 | neighbors=[23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, 863c575 Merge pull request #24 from pre…, b5233a8 implementando via como modulo d…, f7b1aac Merge branch 'feature/testing' …, PasoEvidencias()]
- "token_route": "route.ts" | kind=code-symbol | source=app/api/via/exp-digital/token/route.ts:L1 | neighbors=[23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, 5618308 guardado e evidencias con ed, 863c575 Merge pull request #24 from pre…, f7b1aac Merge branch 'feature/testing' …, auth.ts]
- "ui_fieldlabel": "FieldLabel.tsx" | kind=code-symbol | source=features/via/infracciones/components/ui/FieldLabel.tsx:L1 | neighbors=[23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, 863c575 Merge pull request #24 from pre…, b5233a8 implementando via como modulo d…, f7b1aac Merge branch 'feature/testing' …, PasoConductor.tsx]
- "ui_toast_toast": "Toast()" | kind=code-symbol | source=components/ui/Toast.tsx:L8 | neighbors=[AccionesDetenido.tsx, BandejaSolicitudes.tsx, BatchEnvioFotos.tsx, BotonSubirDenuncia.tsx, CardEnvioFoto.tsx, EditarCampoDetenido.tsx]
- "911_types": "types.ts" | kind=code-symbol | source=lib/911/types.ts:L1 | neighbors=[mapper.ts, repository.ts, service.ts, CatalogoItem, IncidenteDetalle, IncidenteResumen]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/ugomez/Documents/GitHub/seguridad_publica/.graphify/description-instructions/batch-017.json

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
