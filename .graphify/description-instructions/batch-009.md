# Node Description Batch 10 of 93

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

- "visitas_route": "route.ts" | kind=code-symbol | source=app/api/prevencion/medidas/[id]/visitas/route.ts:L1 | neighbors=[27dcb21 Merge branch 'feature/testing' …, 5558751 feat: módulo Prevención del Del…, 5618308 guardado e evidencias con ed, 77ddf58 Merge branch 'feature/testing' …, 863c575 Merge pull request #24 from pre…, ad3ec5f mejorando esto] | lang=en
- "911_pagination": "Pagination.tsx" | kind=code-symbol | source=components/911/Pagination.tsx:L1 | neighbors=[arrowBtnStyle, containerStyle, infoStyle, labelStyle, pageNumberStyle, Pagination()] | lang=en
- "admin_admin_styles": "admin-styles.ts" | kind=code-symbol | source=app/admin/admin-styles.ts:L1 | neighbors=[btnPrimario, btnSecundario, cardStyle, inputStyle, labelStyle, pageWrap] | lang=en
- "agente_infracciones_capturardatosinfractormodal": "CapturarDatosInfractorModal.tsx" | kind=code-symbol | source=components/agente_infracciones/CapturarDatosInfractorModal.tsx:L1 | neighbors=[actions.ts, capturarInfractorInfraccionesAction(), CapturarDatosInfractorModal(), DatosForm(), Field(), FieldName] | lang=en
- "auxiliar_service": "service.ts" | kind=code-symbol | source=lib/auxiliar/service.ts:L1 | neighbors=[actions.ts, repository.ts, obtenerCuestionariosRobo(), obtenerParesReporte(), upsertChecklist(), guardarChecklist()] | lang=en
- "calcular_route": "route.ts" | kind=code-symbol | source=app/api/reportes/formato-n-fge/calcular/route.ts:L1 | neighbors=[GET(), auth.ts, auth, formato-n-fge-service.ts, calcularConteosPorFecha(), permisos.ts] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@a2145fb21f4b9adae89074913aa8d4b7ec22d0d0": "a2145fb Merge branch 'testing' into juzgado" | kind=Commit | source=git | neighbors=[7400135 Merge branch 'feature/testing' …, Pagination.tsx, page.tsx, feature/monitorista-reportes, feature/testing, fix/detenidos] | lang=pt
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@c4523aca7e1438c596b579690aa1366a0ae9ec33": "c4523ac tabla de fiscalia, evidencias funcional" | kind=Commit | source=git | neighbors=[c194e54 envio de solicitud de evidencia…, feature/monitorista, feature/monitorista-reportes, feature/testing, fix/detenidos, fix/incidentes-camara] | lang=nl
- "components_capturardatostitularsection": "CapturarDatosTitularSection.tsx" | kind=code-symbol | source=features/via/infracciones/components/CapturarDatosTitularSection.tsx:L1 | neighbors=[067c4de arreglando flujo de fiscalia  a…, 16a63d4 Merge branch 'feature/testing' …, 863c575 Merge pull request #24 from pre…, 91c36bf validando orden de pago, ac48eb1 Merge pull request #17 from pre…, CapturarDatosTitularSection()] | lang=en
- "fiscalia_cargaroficiosection": "CargarOficioSection.tsx" | kind=code-symbol | source=components/fiscalia/CargarOficioSection.tsx:L1 | neighbors=[067c4de arreglando flujo de fiscalia  a…, 16a63d4 Merge branch 'feature/testing' …, 5bbdda8 Merge pull request #8 from pres…, 75ca4b2 Merge pull request #9 from pres…, 863c575 Merge pull request #24 from pre…, 953d38a implementando vista de fiscalia] | lang=en
- "flota_types": "types.ts" | kind=code-symbol | source=lib/flota/types.ts:L1 | neighbors=[ModalReactivarOficial.tsx, NuevoOficialForm.tsx, OficialesTable.tsx, PatrullaSelector.tsx, 16a63d4 Merge branch 'feature/testing' …, 863c575 Merge pull request #24 from pre…] | lang=en
- "incidentes_route": "route.ts" | kind=code-symbol | source=app/api/incidentes/route.ts:L1 | neighbors=[0d9172a mejorando flujo de 911-despacho, 22bf125 Merge pull request #20 from pre…, 27dcb21 Merge branch 'feature/testing' …, 5618308 guardado e evidencias con ed, 6feefe2 BackEnd completo para hacer la …, 77ddf58 Merge branch 'feature/testing' …] | lang=en
- "notificaciones_checker": "checker.ts" | kind=code-symbol | source=lib/notificaciones/checker.ts:L1 | neighbors=[0e33bf6 feat: módulo Admin, Prórroga, F…, 11be750 Fase 1 de correccion - completa…, 5f13b34 Merge branch 'feature/testing' …, 821abe0 replicando flujo de fiscalia-> …, 863c575 Merge pull request #24 from pre…, a7218bd Merge pull request #4 from pres…] | lang=en
- "oficiales_page": "page.tsx" | kind=code-symbol | source=app/admin-transito/oficiales/page.tsx:L1 | neighbors=[0068216 Mejora de Dashboard, Login y tr…, 16a63d4 Merge branch 'feature/testing' …, 514a705 refactorizacion sql, 863c575 Merge pull request #24 from pre…, ac48eb1 Merge pull request #17 from pre…, c27a9ee fase prefinal] | lang=en
- "partials_subheader_subheader": "SubHeader()" | kind=code-symbol | source=components/partials/SubHeader.tsx:L18 | neighbors=[page.tsx, page.tsx, page.tsx, page.tsx, page.tsx, page.tsx] | lang=en
- "reportes_operativos_types": "types.ts" | kind=code-symbol | source=lib/reportes-operativos/types.ts:L1 | neighbors=[863c575 Merge pull request #24 from pre…, ad3ec5f mejorando esto, mapper.ts, repository.ts, service.ts, ArmaRow] | lang=en
- "reportes_permisos_tienepermiso": "tienePermiso()" | kind=code-symbol | source=lib/reportes/permisos.ts:L9 | neighbors=[page.tsx, page.tsx, page.tsx, page.tsx, page.tsx, page.tsx] | lang=en
- "sasiete_repository": "repository.ts" | kind=code-symbol | source=features/via/saSiete/repository.ts:L1 | neighbors=[route.ts, 23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, 863c575 Merge pull request #24 from pre…, b5233a8 implementando via como modulo d…, ede5a1d eliminado referencias a via_pru…] | lang=en
- "scripts_trace_components": "trace-components.mjs" | kind=code-symbol | source=scripts/trace-components.mjs:L1 | neighbors=[11ee4f2 mejorando flujo de 911, 22bf125 Merge pull request #20 from pre…, 863c575 Merge pull request #24 from pre…, components, __dirname, dirty] | lang=en
- "911_filtrosincidentes": "FiltrosIncidentes.tsx" | kind=code-symbol | source=components/911/FiltrosIncidentes.tsx:L1 | neighbors=[btnBuscarStyle, btnLimpiarStyle, CANALES, CatalogoItem, ESTATUS, fieldStyle] | lang=en
- "admin_transito_nuevooficialform": "NuevoOficialForm.tsx" | kind=code-symbol | source=components/admin-transito/NuevoOficialForm.tsx:L1 | neighbors=[actions.ts, crearOficial(), Departamento, inputStyle, labelStyle, NuevoOficialForm()] | lang=en
- "agente_despacho_page": "page.tsx" | kind=code-symbol | source=app/agente_despacho/page.tsx:L1 | neighbors=[service.ts, getStats(), AgenteDespachoDashboardPage(), service.ts, verificarRolAgenteDespacho(), auth.ts] | lang=en
- "agente_juzgado_detallesaseguradoview": "DetallesAseguradoView.tsx" | kind=code-symbol | source=components/agente_juzgado/DetallesAseguradoView.tsx:L1 | neighbors=[DetallesAseguradoView(), disabledSx, esImagen(), labelSx, Props, types.ts] | lang=en
- "agente_juzgado_profiledropdown": "ProfileDropdown.tsx" | kind=code-symbol | source=components/agente_juzgado/ProfileDropdown.tsx:L1 | neighbors=[page.tsx, ProfileDropdown(), Props, auth-client.ts, authClient, page.tsx] | lang=en
- "app_layout": "layout.tsx" | kind=code-symbol | source=app/layout.tsx:L1 | neighbors=[metadata, RootLayout(), PageTransition.tsx, SmoothScroll.tsx, 0068216 Mejora de Dashboard, Login y tr…, 0d9172a mejorando flujo de 911-despacho] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@11e88171582a012ea2cb786bb80b8ec3072123c6": "11e8817 Merge branch 'testing' into juzgado" | kind=Commit | source=git | neighbors=[feature/monitorista-reportes, feature/testing, fix/detenidos, fix/incidentes-camara, fix/subir-fotografias, main] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@166a26b4031cf3f06e37d03445612176f0458ede": "166a26b Merge branch 'feature/testing' of https://github.com/presidenciaSJR/seg…" | kind=Commit | source=git | neighbors=[feature/monitorista, feature/monitorista-reportes, fix/detenidos, fix/incidentes-camara, fix/subir-fotografias, 83f48a2 Merge branch 'feature/correccio…] | lang=pt
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@74001357545900cbdfcb97dd271e360daac38e3d": "7400135 Merge branch 'feature/testing' of https://github.com/presidenciaSJR/seg…" | kind=Commit | source=git | neighbors=[356d3a7 Subir rol agregado, falta darle…, 5d09f31 integración de componente de pa…, Pagination.tsx, feature/monitorista, feature/monitorista-reportes, feature/testing] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@86e93197ed0a6a560d8b403e68ef1883ab444a4e": "86e9319 Merge branch 'feature/testing' of https://github.com/presidenciaSJR/seg…" | kind=Commit | source=git | neighbors=[5e458d6 navegacion, feature/monitorista, feature/monitorista-reportes, feature/testing, fix/detenidos, fix/incidentes-camara] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@b403f89a497d4ec089c09c8fcdb3f51ae3c3157b": "b403f89 Vista para reportes de incidentes por camaras y cambio den header" | kind=Commit | source=git | neighbors=[5aa5866 Cambio de colores en interfaz d…, feature/testing, fix/subir-fotografias, main, bf2e7ed Reportes del modulo de incident…, ReportFilters.tsx] | lang=es
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@da48f68a11b31923ca37285ae8882363e6bb81dd": "da48f68 implementando flujo de aceptacion de documentos" | kind=Commit | source=git | neighbors=[5d2b064 fix vercel upload files, mapper.ts, types.ts, actions.ts, LiberacionesDashboard.tsx, feature/testing] | lang=nl
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@ef95840b5ad7ebf42d66485abca37a97c02d16d9": "ef95840 Merge branch 'feature/testing' of https://github.com/presidenciaSJR/seg…" | kind=Commit | source=git | neighbors=[0c8695c Cambios en filtros, 5ef7cf3 Agregar los campos faltantes, feature/testing, main, 4400923 Merge branch 'feature/testing' …, actions.ts] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@f7573dd0e86dd7c4c5da20b2ea194db4d3ce5d73": "f7573dd Merge branch 'feature/testing' of https://github.com/presidenciaSJR/seg…" | kind=Commit | source=git | neighbors=[72e8913 cambio de diseño, ef9e0ea Formulario arreglado, feature/monitorista, feature/monitorista-reportes, fix/detenidos, fix/incidentes-camara] | lang=en
- "components_capturarinfractorsection": "CapturarInfractorSection.tsx" | kind=code-symbol | source=features/liberaciones/components/CapturarInfractorSection.tsx:L1 | neighbors=[LiberacionesDashboard.tsx, 0b210fa Merge pull request #12 from pre…, 1acddac Merge branch 'feature/testing' …, 4400923 Merge branch 'feature/testing' …, 46f24f8 generica function for infractio…, 5d2b064 fix vercel upload files] | lang=en
- "denuncias_stored1": "storeD1.ts" | kind=code-symbol | source=lib/denuncias/storeD1.ts:L1 | neighbors=[5f13b34 Merge branch 'feature/testing' …, 863c575 Merge pull request #24 from pre…, 92393e7 flujo completado de juzgado, a7218bd Merge pull request #4 from pres…, ce84893 Merge branch 'feature/testing' …, FormularioD1.tsx] | lang=en
- "exportar_robo_route": "route.ts" | kind=code-symbol | source=app/api/auxiliar/exportar-robo/route.ts:L1 | neighbors=[23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, 5618308 guardado e evidencias con ed, 5f13b34 Merge branch 'feature/testing' …, 77ddf58 Merge branch 'feature/testing' …, 863c575 Merge pull request #24 from pre…] | lang=en
- "finalizarproceso_route": "route.ts" | kind=code-symbol | source=app/api/agente_juzgado/finalizarProceso/route.ts:L1 | neighbors=[067c4de arreglando flujo de fiscalia  a…, 16a63d4 Merge branch 'feature/testing' …, 27dcb21 Merge branch 'feature/testing' …, 5618308 guardado e evidencias con ed, 75e03e9 puliendo flujo de juzgado-liber…, 77ddf58 Merge branch 'feature/testing' …] | lang=en
- "fotos_page": "page.tsx" | kind=code-symbol | source=app/oficial/reportes/[id]/fotos/page.tsx:L1 | neighbors=[0068216 Mejora de Dashboard, Login y tr…, 388b997 Apartados para subir fotografia…, 514a705 refactorizacion sql, 672bab5 libearciones para juzgado, 863c575 Merge pull request #24 from pre…, 9d803f2 fix api maps] | lang=en
- "iniciarproceso_route": "route.ts" | kind=code-symbol | source=app/api/agente_juzgado/iniciarProceso/route.ts:L1 | neighbors=[067c4de arreglando flujo de fiscalia  a…, 16a63d4 Merge branch 'feature/testing' …, 27dcb21 Merge branch 'feature/testing' …, 5618308 guardado e evidencias con ed, 75e03e9 puliendo flujo de juzgado-liber…, 77ddf58 Merge branch 'feature/testing' …] | lang=en
- "lib_auth_client": "auth-client.ts" | kind=code-symbol | source=lib/auth-client.ts:L1 | neighbors=[page.tsx, ProfileDropdown.tsx, ProfileDropdown.tsx, ProfileDropdown.tsx, ProfileDropdownAuxiliar.tsx, 6a042cd feat: sistema de autenticación,…] | lang=en

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/ugomez/Documents/GitHub/seguridad_publica/.graphify/description-instructions/batch-009.json

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
