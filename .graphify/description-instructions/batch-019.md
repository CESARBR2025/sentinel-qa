# Node Description Batch 20 of 93

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

- "ptpag_page": "page.tsx" | kind=code-symbol | source=app/(auth)/login/ptpag/page.tsx:L1 | neighbors=[7e39526 Mejoras UI/UX, 863c575 Merge pull request #24 from pre…, paginate.ts, paginate(), Pagination.tsx, Pagination()] | lang=en
- "reportes_incidentes_mapper": "mapper.ts" | kind=code-symbol | source=lib/reportes-incidentes/mapper.ts:L1 | neighbors=[863c575 Merge pull request #24 from pre…, ad3ec5f mejorando esto, rowToReporteDiario(), rowToReporteSemanal(), toNum(), types.ts] | lang=en
- "reportes_incidentes_types": "types.ts" | kind=code-symbol | source=lib/reportes-incidentes/types.ts:L1 | neighbors=[863c575 Merge pull request #24 from pre…, ad3ec5f mejorando esto, mapper.ts, repository.ts, service.ts, ReporteDiarioRow] | lang=en
- "rol_servicios_actions_requiresession": "requireSession()" | kind=code-symbol | source=lib/rol-servicios/actions.ts:L11 | neighbors=[actions.ts, createAsignacion(), createObservacion(), createRol(), deleteAsignacion(), deleteObservacion()] | lang=en
- "rol_servicios_catalogos_actions_req": "req()" | kind=code-symbol | source=lib/rol-servicios/catalogos-actions.ts:L20 | neighbors=[catalogos-actions.ts, createBodyCam(), createConcepto(), createMedioCanalizacion(), createRadio(), createSector()] | lang=en
- "rol_servicios_catalogos_actions_requireadmin": "requireAdmin()" | kind=code-symbol | source=lib/rol-servicios/catalogos-actions.ts:L10 | neighbors=[catalogos-actions.ts, createBodyCam(), createConcepto(), createMedioCanalizacion(), createRadio(), createSector()] | lang=en
- "sasiete_repository_sa7repository": "SA7Repository" | kind=code-symbol | source=features/via/saSiete/repository.ts:L5 | neighbors=[route.ts, route.ts, route.ts, repository.ts, .actualizarOrdenPago(), .buscarOrdenPorInfraccionId()] | lang=en
- "scripts_populate_vault_writebovedasection": "writeBovedaSection()" | kind=code-symbol | source=scripts/populate-vault.mjs:L21 | neighbors=[populate-vault.mjs, populateAPIRoutes(), populateComandos(), populateEnvVars(), populateEstructura(), populateFeatures()] | lang=en
- "services_analistaservice": "analistaService.ts" | kind=code-symbol | source=services/analistaService.ts:L1 | neighbors=[formAnalisis.tsx, 2ca9f50 Formulario sin backend, 5618308 guardado e evidencias con ed, 863c575 Merge pull request #24 from pre…, 9550203 Cambios en presentacion, se gen…, 9d67ddf Cambios de formulario analisis] | lang=en
- "steps_pasoconfirmacionpago": "PasoConfirmacionPago.tsx" | kind=code-symbol | source=features/via/infracciones/components/steps/PasoConfirmacionPago.tsx:L1 | neighbors=[23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, 863c575 Merge pull request #24 from pre…, b5233a8 implementando via como modulo d…, f7b1aac Merge branch 'feature/testing' …, FormularioInfraccion.tsx] | lang=en
- "tabladevinfracciones_detalleinfraccionmodal": "DetalleInfraccionModal.tsx" | kind=code-symbol | source=features/depInfracciones/components/TablaDevInfracciones/DetalleInfraccionModal.tsx:L1 | neighbors=[0b210fa Merge pull request #12 from pre…, 1acddac Merge branch 'feature/testing' …, 4400923 Merge branch 'feature/testing' …, 46f24f8 generica function for infractio…, 863c575 Merge pull request #24 from pre…, e286619 Merge branch 'feature/testing' …] | lang=en
- "templates_layout": "layout.ts" | kind=code-symbol | source=lib/emails/templates/layout.ts:L1 | neighbors=[0068216 Mejora de Dashboard, Login y tr…, 75ca4b2 Merge pull request #9 from pres…, 863c575 Merge pull request #24 from pre…, 953d38a implementando vista de fiscalia, asignacion-fiscalia.ts, emailLayout()] | lang=en
- "ui_card_card": "Card()" | kind=code-symbol | source=features/via/infracciones/components/ui/Card.tsx:L1 | neighbors=[page.tsx, PasoCiudadano.tsx, PasoConductor.tsx, PasoDescuentos.tsx, PasoPago.tsx, PasoVehiculo.tsx] | lang=en
- "ui_customselect": "CustomSelect.tsx" | kind=code-symbol | source=features/via/infracciones/components/ui/CustomSelect.tsx:L1 | neighbors=[23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, 863c575 Merge pull request #24 from pre…, b5233a8 implementando via como modulo d…, f7b1aac Merge branch 'feature/testing' …, SeccionMotivo.tsx] | lang=en
- "via_online": "online.ts" | kind=code-symbol | source=lib/via/online.ts:L1 | neighbors=[23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, 863c575 Merge pull request #24 from pre…, b5233a8 implementando via como modulo d…, f7b1aac Merge branch 'feature/testing' …, FormularioInfraccion.tsx] | lang=en
- "admin_transito_actions_requireadmintransito": "requireAdminTransito()" | kind=code-symbol | source=lib/admin-transito/actions.ts:L9 | neighbors=[actions.ts, actualizarOficial(), buscarUsuariosReincorporar(), crearOficial(), destituirOficial(), obtenerOficialesLista()] | lang=en
- "agente_juzgado_cerrarcasomodal": "CerrarCasoModal.tsx" | kind=code-symbol | source=components/agente_juzgado/CerrarCasoModal.tsx:L1 | neighbors=[actions.ts, accionCerrarCaso(), CerrarCasoBoton(), 5f13b34 Merge branch 'feature/testing' …, 821abe0 replicando flujo de fiscalia-> …, 863c575 Merge pull request #24 from pre…] | lang=en
- "agente_juzgado_subirfotodetenido": "SubirFotoDetenido.tsx" | kind=code-symbol | source=components/agente_juzgado/SubirFotoDetenido.tsx:L1 | neighbors=[compressImage(), SubirFotoDetenido(), 0068216 Mejora de Dashboard, Login y tr…, 388b997 Apartados para subir fotografia…, 672bab5 libearciones para juzgado, 863c575 Merge pull request #24 from pre…] | lang=en
- "agente_juzgado_toastexito": "ToastExito.tsx" | kind=code-symbol | source=components/agente_juzgado/ToastExito.tsx:L1 | neighbors=[page.tsx, ToastExito(), 090c4dd vista de fiscalia, 44ebbc4 Merge branch 'feature/testing' …, 863c575 Merge pull request #24 from pre…, 997ef65 Merge pull request #2 from pres…] | lang=en
- "analisis_permisos_tieneaccesoanalisis": "tieneAccesoAnalisis()" | kind=code-symbol | source=lib/analisis/permisos.ts:L25 | neighbors=[page.tsx, permisos.ts, tienePermiso(), page.tsx, page.tsx, page.tsx] | lang=en
- "auxiliar_permisos_tienepermiso": "tienePermiso()" | kind=code-symbol | source=lib/auxiliar/permisos.ts:L13 | neighbors=[actions.ts, page.tsx, permisos.ts, tieneAccesoAuxiliar(), verificarAccesoAuxiliarApi(), page.tsx] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@1265204bc97feaa6fb75df1806e9897fa23366a9": "1265204 paginacion por tablas" | kind=Commit | source=git | neighbors=[feature/testing, fix/subir-fotografias, main, 5bbdda8 Merge pull request #8 from pres…, ReportTables.tsx, 24626eb se agregan opciones de reportes] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@223334209ef351b0193e1f60df5cb99f49875c1e": "2233342 Fix/MarcarEnSitio" | kind=Commit | source=git | neighbors=[feature/testing, main, 6cdc611 Merge pull request #22 from pre…, page.tsx, actions.ts, DespachoContent.tsx] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@24626eb982afa43f645cacc5f1a4a61b73739a55": "24626eb se agregan opciones de reportes" | kind=Commit | source=git | neighbors=[feature/testing, fix/subir-fotografias, main, 1265204 paginacion por tablas, ReportesTabs.tsx, b170599 Merge branch 'feature/testing' …] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@4af36d9243dd6dd33472459b3792bbc43df81b0d": "4af36d9 Merge pull request #18 from presidenciaSJR/conexion" | kind=Commit | source=git | neighbors=[feature/testing, main, 046f18c Merge pull request #19 from pre…, 5641e69 Merge branch 'feature/testing' …, ec3acf7 iniciando reset de testing, fe98642 modificando agents.md] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@dd2f306f814de4496fceabe50f717a947be4aa75": "dd2f306 Fix Mapa" | kind=Commit | source=git | neighbors=[cd92b01 Update .gitignore, feature/testing, main, 4075365 actualizando ignore, 54a87f1 Fix oficial/despachos, loadGoogleMaps.ts] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@deb4649e9609d3371eda8b082dfbd3121ea108d4": "deb4649 eLIMINE CARPETA" | kind=Commit | source=git | neighbors=[feature/monitorista-reportes, fix/detenidos, fix/incidentes-camara, fix/subir-fotografias, 199ce68 Merge branch 'main' of https://…, ea040d6 Carpeta creada] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@ea040d6534df9613a15a08a709ea1fc01bb0800b": "ea040d6 Carpeta creada" | kind=Commit | source=git | neighbors=[d3e6d95 Update SeguimientoTimeline.tsx, feature/monitorista-reportes, fix/detenidos, fix/incidentes-camara, fix/subir-fotografias, deb4649 eLIMINE CARPETA] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@ec3acf726484fbb76f804cebaf190c461ef704f2": "ec3acf7 iniciando reset de testing" | kind=Commit | source=git | neighbors=[9d803f2 fix api maps, feature/testing, main, 4af36d9 Merge pull request #18 from pre…, c776b58 Integrar Alexandria (bóveda de …, fe98642 modificando agents.md] | lang=nl
- "corralon_profile_dropdown": "profile-dropdown.tsx" | kind=code-symbol | source=app/corralon/profile-dropdown.tsx:L1 | neighbors=[5a1b5d5 empezando corralon, 863c575 Merge pull request #24 from pre…, page.tsx, ProfileDropdown(), Props, auth-client.ts] | lang=en
- "d1_d1pagination": "D1Pagination.tsx" | kind=code-symbol | source=components/reportes/d1/D1Pagination.tsx:L1 | neighbors=[863c575 Merge pull request #24 from pre…, 98e7e6e vista de reportes de d1, b233bc7 Merge branch 'testing' into con…, D1Pagination(), PaginationProps, styles.ts] | lang=en
- "emails_mailer": "mailer.ts" | kind=code-symbol | source=lib/emails/mailer.ts:L1 | neighbors=[75ca4b2 Merge pull request #9 from pres…, 863c575 Merge pull request #24 from pre…, 953d38a implementando vista de fiscalia, MailAttachment, MailOptions, sendMail()] | lang=en
- "estadisticos_phonepagination": "PhonePagination.tsx" | kind=code-symbol | source=components/reportes/estadisticos/PhonePagination.tsx:L1 | neighbors=[0068216 Mejora de Dashboard, Login y tr…, 6f8a089 Vista de estadisticos diarios, …, 863c575 Merge pull request #24 from pre…, paginationButtonStyle, PaginationProps, PhonePagination()] | lang=en
- "expediente_client_obtenerguesttoken": "obtenerGuestToken()" | kind=code-symbol | source=lib/expediente/client.ts:L7 | neighbors=[client.ts, actions.ts, expediente.ts, ppt-service.ts, route.ts, route.ts] | lang=en
- "fiscalia_buttonverdetalles": "ButtonVerDetalles.tsx" | kind=code-symbol | source=components/fiscalia/ButtonVerDetalles.tsx:L1 | neighbors=[5bbdda8 Merge pull request #8 from pres…, 75ca4b2 Merge pull request #9 from pres…, 863c575 Merge pull request #24 from pre…, 953d38a implementando vista de fiscalia, ff6d3c2 juzgado, BotonVerDetalle()] | lang=en
- "fiscalia_expediente": "expediente.ts" | kind=code-symbol | source=lib/fiscalia/expediente.ts:L1 | neighbors=[actions.ts, 75ca4b2 Merge pull request #9 from pres…, 8095bdb limpiando .env, 863c575 Merge pull request #24 from pre…, 953d38a implementando vista de fiscalia, actions.ts] | lang=en
- "fiscalia_subirfotodetenido": "SubirFotoDetenido.tsx" | kind=code-symbol | source=components/fiscalia/SubirFotoDetenido.tsx:L1 | neighbors=[0068216 Mejora de Dashboard, Login y tr…, 388b997 Apartados para subir fotografia…, 672bab5 libearciones para juzgado, 863c575 Merge pull request #24 from pre…, de5682f Merge pull request #10 from pre…, compressImage()] | lang=en
- "fiscalia_toastexito": "ToastExito.tsx" | kind=code-symbol | source=components/fiscalia/ToastExito.tsx:L1 | neighbors=[090c4dd vista de fiscalia, 44ebbc4 Merge branch 'feature/testing' …, 863c575 Merge pull request #24 from pre…, 997ef65 Merge pull request #2 from pres…, a291695 Merge branch 'feature/testing' …, f80d33f Merge branch 'feature/testing' …] | lang=en
- "fiscalia_types_detalleaseguradocompleto": "DetalleAseguradoCompleto" | kind=code-symbol | source=lib/fiscalia/types.ts:L55 | neighbors=[actions.ts, FormularioAseguradoJuzgado.tsx, actions.ts, FormularioAsegurado.tsx, FormularioPuestaDisposicion.tsx, mapper.ts] | lang=en
- "generar_route_get": "GET()" | kind=code-symbol | source=app/api/nCoordinacion/generar/route.ts:L89 | neighbors=[route.ts, dRow(), hRow(), p(), r(), tablaFiscalia()] | lang=en

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/ugomez/Documents/GitHub/seguridad_publica/.graphify/description-instructions/batch-019.json

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
