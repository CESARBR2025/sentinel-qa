# Node Description Batch 12 of 82

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

- "monitorista_repository_inserthistorial": "insertHistorial()" | kind=code-symbol | source=lib/monitorista/repository.ts:L91 | neighbors=[route.ts, route.ts, route.ts, route.ts, route.ts, route.ts] | lang=en
- "monitorista_subirfotodetenido": "SubirFotoDetenido.tsx" | kind=code-symbol | source=components/monitorista/SubirFotoDetenido.tsx:L1 | neighbors=[27dcb21 Merge branch 'feature/testing' …, 388b997 Apartados para subir fotografia…, 5618308 guardado e evidencias con ed, 672bab5 libearciones para juzgado, 77ddf58 Merge branch 'feature/testing' …, de5682f Merge pull request #10 from pre…] | lang=en
- "pendiente_analisis_page": "page.tsx" | kind=code-symbol | source=app/analisis/pendiente-analisis/page.tsx:L1 | neighbors=[a6b7556 Formulario se puso a prueba, se…, fcb223f merge de testing, permisos.ts, tieneAccesoAnalisis(), tienePermiso(), TablonAnalisis.tsx] | lang=en
- "prevencion_permisos_verificaraccesoprevencionapi": "verificarAccesoPrevencionApi()" | kind=code-symbol | source=lib/prevencion/permisos.ts:L33 | neighbors=[route.ts, route.ts, route.ts, route.ts, route.ts, route.ts] | lang=en
- "prevencion_prevencionnav": "PrevencionNav.tsx" | kind=code-symbol | source=app/prevencion/PrevencionNav.tsx:L1 | neighbors=[06c55f5 Merge branch 'feature/testing' …, 1970615 vista de medidas, 41ea169 Merge branch 'testing' into con…, 5558751 feat: módulo Prevención del Del…, 8355ac0 Merge branch 'feature/testing' …, layout.tsx] | lang=en
- "reportes_permisos_verificaraccesoformatonapi": "verificarAccesoFormatoNApi()" | kind=code-symbol | source=lib/reportes/permisos.ts:L29 | neighbors=[route.ts, route.ts, route.ts, route.ts, route.ts, route.ts] | lang=en
- "reportes_sin_d1_repository": "repository.ts" | kind=code-symbol | source=lib/reportes-sin-d1/repository.ts:L1 | neighbors=[22b7b54 Merge branch 'feature/reportes'…, 552d291 Merge branch 'testing' into con…, 97a156c Reportes con D1, sin D1 y sin r…, ad3ec5f mejorando esto, e286619 Merge branch 'feature/testing' …, db.ts] | lang=en
- "reportes_sin_d1_service": "service.ts" | kind=code-symbol | source=lib/reportes-sin-d1/service.ts:L1 | neighbors=[22b7b54 Merge branch 'feature/reportes'…, 552d291 Merge branch 'testing' into con…, 97a156c Reportes con D1, sin D1 y sin r…, ad3ec5f mejorando esto, e286619 Merge branch 'feature/testing' …, page.tsx] | lang=en
- "reportes_sin_novedad_repository": "repository.ts" | kind=code-symbol | source=lib/reportes-sin-novedad/repository.ts:L1 | neighbors=[22b7b54 Merge branch 'feature/reportes'…, 552d291 Merge branch 'testing' into con…, 97a156c Reportes con D1, sin D1 y sin r…, ad3ec5f mejorando esto, e286619 Merge branch 'feature/testing' …, db.ts] | lang=en
- "reportes_sin_novedad_service": "service.ts" | kind=code-symbol | source=lib/reportes-sin-novedad/service.ts:L1 | neighbors=[22b7b54 Merge branch 'feature/reportes'…, 552d291 Merge branch 'testing' into con…, 97a156c Reportes con D1, sin D1 y sin r…, ad3ec5f mejorando esto, e286619 Merge branch 'feature/testing' …, route.ts] | lang=en
- "stores_usetoaststore": "useToastStore.ts" | kind=code-symbol | source=stores/useToastStore.ts:L1 | neighbors=[0b210fa Merge pull request #12 from pre…, 1acddac Merge branch 'feature/testing' …, 4400923 Merge branch 'feature/testing' …, 5d2b064 fix vercel upload files, e286619 Merge branch 'feature/testing' …, CapturarDatosTitularSection.tsx] | lang=en
- "ui_card": "Card.tsx" | kind=code-symbol | source=features/via/infracciones/components/ui/Card.tsx:L1 | neighbors=[23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, b5233a8 implementando via como modulo d…, f7b1aac Merge branch 'feature/testing' …, page.tsx, PasoCiudadano.tsx] | lang=en
- "admin_layout": "layout.tsx" | kind=code-symbol | source=app/admin/layout.tsx:L1 | neighbors=[AdminLayout(), helpers.ts, getUserWithRole(), auth.ts, auth, 0e33bf6 feat: módulo Admin, Prórroga, F…] | lang=en
- "admin_transito_layout": "layout.tsx" | kind=code-symbol | source=app/admin-transito/layout.tsx:L1 | neighbors=[AdminTransitoLayout(), helpers.ts, getUserWithRole(), auth.ts, auth, ProfileDropdown.tsx] | lang=en
- "admin_transito_permisos": "permisos.ts" | kind=code-symbol | source=lib/admin-transito/permisos.ts:L1 | neighbors=[Accion, guardarPermiso(), guardarPlantillaSeccion(), obtenerPlantillaRol(), PermisoSeccion, Seccion] | lang=en
- "agente_911_page": "page.tsx" | kind=code-symbol | source=app/agente_911/page.tsx:L1 | neighbors=[service.ts, getStats(), Agente911DashboardPage(), service.ts, verificarRolAgente911(), auth.ts] | lang=en
- "agente_bitacorista_page": "page.tsx" | kind=code-symbol | source=app/agente_bitacorista/page.tsx:L1 | neighbors=[service.ts, getStats(), AgenteBitacoristaDashboardPage(), service.ts, verificarRolAgenteBitacorista(), auth.ts] | lang=en
- "agente_despacho_page": "page.tsx" | kind=code-symbol | source=app/agente_despacho/page.tsx:L1 | neighbors=[service.ts, getStats(), AgenteDespachoDashboardPage(), service.ts, verificarRolAgenteDespacho(), auth.ts] | lang=en
- "agente_infracciones_modalentregargarantia": "ModalEntregarGarantia.tsx" | kind=code-symbol | source=components/agente_infracciones/ModalEntregarGarantia.tsx:L1 | neighbors=[InfraccionesDashboard.tsx, actions.ts, liberarGarantiaInfraccionesAction(), obtenerDetalleInfraccionInfracciones(), getGarantiaInfo(), ModalEntregarGarantia()] | lang=en
- "agente_infracciones_permisos": "permisos.ts" | kind=code-symbol | source=lib/agente_infracciones/permisos.ts:L1 | neighbors=[Accion, guardarPermiso(), guardarPlantillaSeccion(), obtenerPlantillaRol(), PermisoSeccion, Seccion] | lang=en
- "agente_juzgado_cargaroficiosection": "CargarOficioSection.tsx" | kind=code-symbol | source=components/agente_juzgado/CargarOficioSection.tsx:L1 | neighbors=[actions.ts, guardarOficioJuzgadoAction(), Campo(), CargarOficioSection(), CargarOficioSectionProps, FileUpload()] | lang=en
- "agente_juzgado_permisos": "permisos.ts" | kind=code-symbol | source=lib/agente_juzgado/permisos.ts:L1 | neighbors=[Accion, guardarPermiso(), guardarPlantillaSeccion(), obtenerPlantillaRol(), PermisoSeccion, Seccion] | lang=en
- "agente_liberaciones_liberacionestable": "LiberacionesTable.tsx" | kind=code-symbol | source=components/agente_liberaciones/LiberacionesTable.tsx:L1 | neighbors=[LiberacionesDashboard.tsx, columns, DataRow, LiberacionesTable(), LiberacionesTableProps, page.tsx] | lang=en
- "agente_liberaciones_page": "page.tsx" | kind=code-symbol | source=app/agente_liberaciones/page.tsx:L1 | neighbors=[actions.ts, obtenerDashboardLiberaciones(), obtenerLiberaciones(), LiberacionesTable.tsx, LiberacionesDashboardPage(), ProfileDropdown.tsx] | lang=en
- "agente_liberaciones_permisos": "permisos.ts" | kind=code-symbol | source=lib/agente_liberaciones/permisos.ts:L1 | neighbors=[Accion, guardarPermiso(), guardarPlantillaSeccion(), obtenerPlantillaRol(), PermisoSeccion, Seccion] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@160d1e176f2d55cc6f7154cf8c7d1f2e2a1841da": "160d1e1 Monitorista V1.1" | kind=Commit | source=git | neighbors=[feature/monitorista-reportes, feature/testing, fix/detenidos, fix/incidentes-camara, fix/subir-fotografias, 28da720 Cambio de colores en dashboard …] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@3a00521b6d46834af2e8ddc660cff4a5f58bd349": "3a00521 Merge branch 'feature/testing' of https://github.com/presidenciaSJR/seg…" | kind=Commit | source=git | neighbors=[283f342 Merge branch 'feature/testing' …, 2be4ca9 Cambio en header, feature/monitorista, feature/monitorista-reportes, fix/detenidos, fix/incidentes-camara] | lang=pt
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@4c9fa8a7d1d3d48ad71f2060e0954247edd23136": "4c9fa8a vista de reporte de d1 no iniciada" | kind=Commit | source=git | neighbors=[feature/testing, 0c8695c Cambios en filtros, 5ef7cf3 Agregar los campos faltantes, DescargaFilters.tsx, DescargaPagination.tsx, DescargaTable.tsx] | lang=nl
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@519716a61975d62ddcb9d3d0a1cfdaa3911e5a13": "519716a Formulario para registro de whatsapp" | kind=Commit | source=git | neighbors=[3a00521 Merge branch 'feature/testing' …, feature/monitorista, feature/monitorista-reportes, fix/detenidos, fix/incidentes-camara, fix/subir-fotografias] | lang=pt
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@56a8ec4f997e4351cd0c4c3e3a4b33fe4427c175": "56a8ec4 Impkementacion de pa ay guardado de numero exterior e interior en bd, r…" | kind=Commit | source=git | neighbors=[feature/monitorista, feature/monitorista-reportes, feature/testing, fix/detenidos, fix/incidentes-camara, fix/subir-fotografias] | lang=nl
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@56b6577764c8633cb7ff4a2b701c2ac335c45204": "56b6577 FORMULARIO SE ENLAZO A LA TABLA DE DENUNCIAS" | kind=Commit | source=git | neighbors=[formAnalisis.tsx, generarPresentacion.tsx, TablonAnalisis.tsx, feature/testing, f7b1aac Merge branch 'feature/testing' …, useAnalistaForm.ts] | lang=es
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@5abc683b075625daff20897a70efe2939d2eddbf": "5abc683 Merge branch 'feature/auxiliar' into feature/testing" | kind=Commit | source=git | neighbors=[25de428 Corrección para agregar el botó…, page.tsx, ProfileDropdownAuxiliar.tsx, feature/testing, fix/detenidos, fix/incidentes-camara] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@6cb1055d8e59375ddb1c1197a01d6216e7852ba8": "6cb1055 Mejoras de UI/UIX" | kind=Commit | source=git | neighbors=[0e33bf6 feat: módulo Admin, Prórroga, F…, feature/monitorista, feature/monitorista-reportes, fix/detenidos, fix/incidentes-camara, fix/subir-fotografias] | lang=nl
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@6f8a0895ef63c7d0e87e580266dfb6599ff94c5e": "6f8a089 Vista de estadisticos diarios, semanales y mensuales" | kind=Commit | source=git | neighbors=[5bbdda8 Merge pull request #8 from pres…, feature/testing, fix/subir-fotografias, 953d38a implementando vista de fiscalia, 98e7e6e vista de reportes de d1, page.tsx] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@71912a4116ceaa28e3ae16e06b19d97a3c6665fb": "71912a4 Bitacora incluida" | kind=Commit | source=git | neighbors=[0844e6e Corregido, feature/monitorista, feature/monitorista-reportes, feature/testing, fix/detenidos, fix/incidentes-camara] | lang=pt
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@72e8913da9454e21586cb1aaa79d01804d47ed8c": "72e8913 cambio de diseño" | kind=Commit | source=git | neighbors=[feature/monitorista, feature/monitorista-reportes, feature/testing, fix/detenidos, fix/incidentes-camara, fix/subir-fotografias] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@810844a51b816f3d6139fbeb68243ec3e09d1fea": "810844a Cambios en la estructura de los incidentes de camara" | kind=Commit | source=git | neighbors=[5ed311a Merge pull request #5 from pres…, feature/testing, fix/incidentes-camara, fix/subir-fotografias, 50101e2 Merge pull request #6 from pres…, 5311c24 Editar Registros] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@8affdb6f48b460ac25d4160374a137ba59f767c8": "8affdb6 componente de paginacion y se implementa en page de wa" | kind=Commit | source=git | neighbors=[86e9319 Merge branch 'feature/testing' …, Pagination.tsx, feature/monitorista, feature/monitorista-reportes, feature/testing, fix/detenidos] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@90da1ca35ab391d63a1adc4af5558ddd8250e0d2": "90da1ca Initial commit from Create Next App" | kind=Commit | source=git | neighbors=[layout.tsx, page.tsx, feature/monitorista, feature/monitorista-reportes, fix/detenidos, fix/incidentes-camara] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@97a433bae40f188013d240b41e6d64515f395fa2": "97a433b empezando rol juzgado/fiscalia" | kind=Commit | source=git | neighbors=[83f48a2 Merge branch 'feature/correccio…, feature/monitorista, feature/monitorista-reportes, feature/testing, fix/detenidos, fix/incidentes-camara] | lang=pt

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
