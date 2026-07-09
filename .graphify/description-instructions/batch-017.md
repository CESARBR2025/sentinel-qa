# Node Description Batch 18 of 79

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

- "prevencion_semaforovigencia": "SemaforoVigencia.tsx" | kind=code-symbol | source=components/prevencion/SemaforoVigencia.tsx:L1 | neighbors=[5558751 feat: módulo Prevención del Del…, page.tsx, page.tsx, semaforo.ts, SemaforoColor, CFG] | lang=en
- "prevencion_timeline": "timeline.ts" | kind=code-symbol | source=lib/prevencion/timeline.ts:L1 | neighbors=[5558751 feat: módulo Prevención del Del…, checker.ts, SeguimientoTimeline.tsx, calcularFechaEsperada(), getLabelSeguimiento(), TIPOS_SEGUIMIENTO] | lang=en
- "templates_layout": "layout.ts" | kind=code-symbol | source=lib/emails/templates/layout.ts:L1 | neighbors=[75ca4b2 Merge pull request #9 from pres…, 953d38a implementando vista de fiscalia, asignacion-fiscalia.ts, emailLayout(), emailStyles, inlineStyles()] | lang=en
- "ui_toastauto_toastauto": "ToastAuto()" | kind=code-symbol | source=components/ui/ToastAuto.tsx:L7 | neighbors=[page.tsx, page.tsx, page.tsx, page.tsx, page.tsx, ToastAuto.tsx] | lang=en
- "utils_generateppt": "generatePPT.ts" | kind=code-symbol | source=lib/utils/generatePPT.ts:L1 | neighbors=[generarPresentacion.tsx, 5618308 guardado e evidencias con ed, 5830570 Seccion de analista, uya con bd…, 9550203 Cambios en presentacion, se gen…, 9d67ddf Cambios de formulario analisis, 9faf222 Merge branch 'feature/testing' …] | lang=en
- "via_expediente_getexpedientetoken": "getExpedienteToken()" | kind=code-symbol | source=lib/via/expediente.ts:L25 | neighbors=[route.ts, route.ts, route.ts, route.ts, route.ts, expediente.ts] | lang=en
- "911_modulecard": "ModuleCard.tsx" | kind=code-symbol | source=components/911/ModuleCard.tsx:L1 | neighbors=[ModuleCard(), ModuleCardProps, Stat, page.tsx, a24949a Merge branch 'feature/testing' …, a667064 Page de seleccion de registro] | lang=en
- "admin_admin_styles_btnprimario": "btnPrimario" | kind=code-symbol | source=app/admin/admin-styles.ts:L16 | neighbors=[admin-styles.ts, page.tsx, page.tsx, page.tsx, page.tsx, page.tsx] | lang=en
- "agente_juzgado_actions_obtenerdashboardjuzgado": "obtenerDashboardJuzgado()" | kind=code-symbol | source=lib/agente_juzgado/actions.ts:L36 | neighbors=[actions.ts, page.tsx, page.tsx, page.tsx, page.tsx, page.tsx] | lang=en
- "agente_juzgado_confirmacionmodal": "ConfirmacionModal.tsx" | kind=code-symbol | source=components/agente_juzgado/ConfirmacionModal.tsx:L1 | neighbors=[ConfirmacionModal(), ConfirmacionModalProps, VARIANTES, JuzgadoDashboard.tsx, 75e03e9 puliendo flujo de juzgado-liber…, ff3622b Merge pull request #11 from pre…] | lang=en
- "agente_juzgado_subirfotodetenido": "SubirFotoDetenido.tsx" | kind=code-symbol | source=components/agente_juzgado/SubirFotoDetenido.tsx:L1 | neighbors=[compressImage(), SubirFotoDetenido(), 388b997 Apartados para subir fotografia…, 672bab5 libearciones para juzgado, de5682f Merge pull request #10 from pre…, page.tsx] | lang=en
- "agente_juzgado_types_detalleasegurado": "DetalleAsegurado" | kind=code-symbol | source=lib/agente_juzgado/types.ts:L18 | neighbors=[actions.ts, CapturarDetallesForm.tsx, DetallesAseguradoView.tsx, repository.ts, service.ts, types.ts] | lang=en
- "analisis_permisos_tieneaccesoanalisis": "tieneAccesoAnalisis()" | kind=code-symbol | source=lib/analisis/permisos.ts:L28 | neighbors=[permisos.ts, verificarAccesoAnalisisApi(), page.tsx, page.tsx, page.tsx, page.tsx] | lang=en
- "analisis_permisos_tienepermiso": "tienePermiso()" | kind=code-symbol | source=lib/analisis/permisos.ts:L10 | neighbors=[permisos.ts, verificarAccesoAnalisisApi(), page.tsx, page.tsx, page.tsx, page.tsx] | lang=en
- "auth_layout": "layout.tsx" | kind=code-symbol | source=app/(auth)/layout.tsx:L1 | neighbors=[AuthLayout(), metadata, 5aa5866 Cambio de colores en interfaz d…, 5f13b34 Merge branch 'feature/testing' …, 6a042cd feat: sistema de autenticación,…, ce84893 Merge branch 'feature/testing' …] | lang=en
- "auxiliar_permisos_tienepermiso": "tienePermiso()" | kind=code-symbol | source=lib/auxiliar/permisos.ts:L14 | neighbors=[actions.ts, permisos.ts, verificarAccesoAuxiliarApi(), page.tsx, page.tsx, page.tsx] | lang=en
- "camara_types": "types.ts" | kind=code-symbol | source=lib/camara/types.ts:L1 | neighbors=[mapper.ts, repository.ts, IncidenteCamara, TotalesCamara, ad3ec5f mejorando esto, route.ts] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@199ce68e039fafc9454c08a4d7e17170f45c7df0": "199ce68 Merge branch 'main' of https://github.com/presidenciaSJR/seguridad_publ…" | kind=Commit | source=git | neighbors=[conexion, main, testing, 2e36377 Eliminar tutoriales de flujo in…, 4271f37 feat(doc): agregar manual de us…, deb4649 eLIMINE CARPETA] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@25de42811d8e92a9e713f5e451bfd1dc0c50f773": "25de428 Corrección para agregar el botón de cerrar sesion" | kind=Commit | source=git | neighbors=[page.tsx, ProfileDropdownAuxiliar.tsx, conexion, testing, 5abc683 Merge branch 'feature/auxiliar'…, ce84893 Merge branch 'feature/testing' …] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@56a8ec4f997e4351cd0c4c3e3a4b33fe4427c175": "56a8ec4 Impkementacion de pa ay guardado de numero exterior e interior en bd, r…" | kind=Commit | source=git | neighbors=[conexion, testing, Formulario911.tsx, 83f48a2 Merge branch 'feature/correccio…, FormSection.tsx, d2a4a5e guardado de nuemro exterior, in…] | lang=nl
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@71912a4116ceaa28e3ae16e06b19d97a3c6665fb": "71912a4 Bitacora incluida" | kind=Commit | source=git | neighbors=[0844e6e Corregido, conexion, testing, a58a0f7 Despachos, page.tsx, page.tsx] | lang=pt
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@72e8913da9454e21586cb1aaa79d01804d47ed8c": "72e8913 cambio de diseño" | kind=Commit | source=git | neighbors=[conexion, testing, f7573dd Merge branch 'feature/testing' …, page.tsx, page.tsx, 95b78c1 cambios de incidentes] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@7c1d0962288af811c88f7a708534e38caadc6e64": "7c1d096 Merge branch 'feature/denuncias' into feature/testing" | kind=Commit | source=git | neighbors=[28da720 Cambio de colores en dashboard …, conexion, testing, 44ebbc4 Merge branch 'feature/testing' …, FormularioD1.tsx, ab3d8f6 Formulario con stepper] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@8095bdb5f3467c591748704c81330d9502a66535": "8095bdb limpiando .env" | kind=Commit | source=git | neighbors=[conexion, testing, 75ca4b2 Merge pull request #9 from pres…, b233bc7 Merge branch 'testing' into con…, expediente.ts, 953d38a implementando vista de fiscalia] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@82ae6e912012633311f0482474650d99d2990894": "82ae6e9 Interfaz de llamada 911 cambios" | kind=Commit | source=git | neighbors=[49dca47 cambio, conexion, testing, Formulario911.tsx, page.tsx, 6feefe2 BackEnd completo para hacer la …] | lang=nl
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@8303881c13f6d239dec188adbd263b90da459fb5": "8303881 Subida de header y footer, falta hacer que jale bien el nombre" | kind=Commit | source=git | neighbors=[testing, page.tsx, a24949a Merge branch 'feature/testing' …, Footer.tsx, Header.tsx, b68a2b7 Merge branch 'feature/testing' …] | lang=es
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@8affdb6f48b460ac25d4160374a137ba59f767c8": "8affdb6 componente de paginacion y se implementa en page de wa" | kind=Commit | source=git | neighbors=[86e9319 Merge branch 'feature/testing' …, Pagination.tsx, conexion, testing, 5d09f31 integración de componente de pa…, page.tsx] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@97a433bae40f188013d240b41e6d64515f395fa2": "97a433b empezando rol juzgado/fiscalia" | kind=Commit | source=git | neighbors=[83f48a2 Merge branch 'feature/correccio…, conexion, testing, 090c4dd vista de fiscalia, page.tsx, FormularioRecorrido.tsx] | lang=pt
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@c96893ea9cf58204304c1e59970fe5171f9015fe": "c96893e Merge branch 'feature/correcciones' into feature/testing" | kind=Commit | source=git | neighbors=[3b0e087 NAVEGACION, a0ec8d2 topbar en 911, page.tsx, conexion, testing, 5e458d6 navegacion] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@d3e6d958008563ec30d4b225434ce61660e6686f": "d3e6d95 Update SeguimientoTimeline.tsx" | kind=Commit | source=git | neighbors=[6cb1055 Mejoras de UI/UIX, main, 4271f37 feat(doc): agregar manual de us…, cd4b9bb Carpeta creada, ea040d6 Carpeta creada, SeguimientoTimeline.tsx] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@ef9e0ea90799410bf11b63750bd051a2b5cfe619": "ef9e0ea Formulario arreglado" | kind=Commit | source=git | neighbors=[4d4a9b7 formulario de notificaciones po…, conexion, testing, Formulario911.tsx, page.tsx, f7573dd Merge branch 'feature/testing' …] | lang=en
- "complementos_repository": "repository.ts" | kind=code-symbol | source=lib/complementos/repository.ts:L1 | neighbors=[ad3ec5f mejorando esto, GruaRow, listarGruasActivas(), db.ts, query(), route.ts] | lang=en
- "components_pagoinfraccion": "PagoInfraccion.tsx" | kind=code-symbol | source=features/via/infracciones/components/PagoInfraccion.tsx:L1 | neighbors=[16a63d4 Merge branch 'feature/testing' …, 91c36bf validando orden de pago, ac48eb1 Merge pull request #17 from pre…, PagoInfraccion(), Props, page.tsx] | lang=en
- "corralon_layout": "layout.tsx" | kind=code-symbol | source=app/corralon/layout.tsx:L1 | neighbors=[5a1b5d5 empezando corralon, CorralonLayout(), auth.ts, auth, core.ts, tienePermiso()] | lang=en
- "corralon_mapper": "mapper.ts" | kind=code-symbol | source=lib/corralon/mapper.ts:L1 | neighbors=[c27a9ee fase prefinal, rowToSolicitud(), toStr(), types.ts, SolicitudRow, service.ts] | lang=en
- "dashboard_sign_out_button": "sign-out-button.tsx" | kind=code-symbol | source=app/dashboard/sign-out-button.tsx:L1 | neighbors=[6a042cd feat: sistema de autenticación,…, page.tsx, SignOutButton(), auth-client.ts, authClient, SubHeader.tsx] | lang=en
- "deteccion_camara_styles_styles": "styles" | kind=code-symbol | source=components/reportes/deteccion_camara/styles.ts:L1 | neighbors=[ReportFilters.tsx, ReportTables.tsx, styles.ts, ReportFilters.tsx, page.tsx, ReportFilters.tsx] | lang=en
- "estadisticos_phonepagination": "PhonePagination.tsx" | kind=code-symbol | source=components/reportes/estadisticos/PhonePagination.tsx:L1 | neighbors=[6f8a089 Vista de estadisticos diarios, …, paginationButtonStyle, PaginationProps, PhonePagination(), styles.ts, styles] | lang=en
- "expediente_client_subirarchivoexpediente": "subirArchivoExpediente()" | kind=code-symbol | source=lib/expediente/client.ts:L28 | neighbors=[client.ts, actions.ts, expediente.ts, route.ts, route.ts, route.ts] | lang=en
- "fiscalia_abrirdocumento": "abrirDocumento.ts" | kind=code-symbol | source=lib/fiscalia/abrirDocumento.ts:L1 | neighbors=[16a63d4 Merge branch 'feature/testing' …, 2c128e5 test expediente vercel, 5bbdda8 Merge pull request #8 from pres…, ac48eb1 Merge pull request #17 from pre…, ff6d3c2 juzgado, abrirDocumento()] | lang=en

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/cesarbr/Documents/dev/sjr/seguridad_publica/.graphify/description-instructions/batch-017.json

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
