# Node Description Batch 20 of 79

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

- "commit:repo:github.com/presidenciaSJR/seguridad_publica@3a00521b6d46834af2e8ddc660cff4a5f58bd349": "3a00521 Merge branch 'feature/testing' of https://github.com/presidenciaSJR/seg…" | kind=Commit | source=git | neighbors=[283f342 Merge branch 'feature/testing' …, 2be4ca9 Cambio en header, testing, 519716a Formulario para registro de wha…, conexion] | lang=pt
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@3b0e087f1fdd0285db9176c6679877af2b06aced": "3b0e087 NAVEGACION" | kind=Commit | source=git | neighbors=[133bb9d pages de listado de llamadas y …, conexion, testing, c96893e Merge branch 'feature/correccio…, page.tsx] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@4271f370e6dcbe157f84bf08a7a3c865913fbd5a": "4271f37 feat(doc): agregar manual de usuario interactivo para el módulo de prev…" | kind=Commit | source=git | neighbors=[conexion, main, testing, 199ce68 Merge branch 'main' of https://…, d3e6d95 Update SeguimientoTimeline.tsx] | lang=es
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@56a8ec4f997e4351cd0c4c3e3a4b33fe4427c175": "56a8ec4 Impkementacion de pa ay guardado de numero exterior e interior en bd, r…" | kind=Commit | source=git | neighbors=[conexion, testing, 83f48a2 Merge branch 'feature/correccio…, FormSection.tsx, d2a4a5e guardado de nuemro exterior, in…] | lang=nl
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@5795f7490c42b3125b13a99f89b1d5978c13d794": "5795f74 Búsqueda de nombre de policía por nómina" | kind=Commit | source=git | neighbors=[conexion, testing, d665f95 Camo dinamico y cambio a select…, FormSection.tsx, bf354f1 Nombre completo de quien captura] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@5d09f3148a5d50435e0b5ff477e1988edeac2a4f": "5d09f31 integración de componente de paginacion para vista de listado de rondin…" | kind=Commit | source=git | neighbors=[conexion, testing, 7400135 Merge branch 'feature/testing' …, 8affdb6 componente de paginacion y se i…, page.tsx] | lang=nl
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@77a125d75f6fc8bf59e520dfcdd575b65d0d1443": "77a125d Merge branch 'feature/monitorista-reportes' of https://github.com/presi…" | kind=Commit | source=git | neighbors=[5d179c0 Apartado de reportes, conexion, testing, 5aa5866 Cambio de colores en interfaz d…, 8e6c8c6 Apartado de reportes] | lang=pt
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@7af0ca79d22e1999f9b6c50baed36ce9a260cb00": "7af0ca7 page de reportes actualizado" | kind=Commit | source=git | neighbors=[1acddac Merge branch 'feature/testing' …, conexion, testing, 2fcba7b vista de reportes de incidentes…, page.tsx] | lang=nl
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@8303881c13f6d239dec188adbd263b90da459fb5": "8303881 Subida de header y footer, falta hacer que jale bien el nombre" | kind=Commit | source=git | neighbors=[testing, a24949a Merge branch 'feature/testing' …, Footer.tsx, Header.tsx, b68a2b7 Merge branch 'feature/testing' …] | lang=es
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@8a59180baa7bce6e0d325fb3623bb7906d037f94": "8a59180 Form listo" | kind=Commit | source=git | neighbors=[conexion, testing, a291695 Merge branch 'feature/testing' …, FormularioD1.tsx, ec57fd2 Form actualizado] | lang=pt
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@917002a669ae2af14aae5e575de2004f5c85e78d": "917002a Guardado de policia a cargo" | kind=Commit | source=git | neighbors=[305b0bd se quitan campos, conexion, testing, 93dd3ea Merge pull request #1 from pres…, FormSection.tsx] | lang=pt
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@aaab50d699cb73f927fb76c1cc49815d8080821b": "aaab50d Merge branch 'main' of https://github.com/presidenciaSJR/seguridad_publ…" | kind=Commit | source=git | neighbors=[2e36377 Eliminar tutoriales de flujo in…, 511fea4 Modulo de despacho, conexion, testing, 44ebbc4 Merge branch 'feature/testing' …] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@ab3d8f668113174e104dae7ac21bde8f402d8626": "ab3d8f6 Formulario con stepper" | kind=Commit | source=git | neighbors=[a291695 Merge branch 'feature/testing' …, conexion, testing, 7c1d096 Merge branch 'feature/denuncias…, FormularioD1.tsx] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@bf354f189b01aeb97fe358f4a4fc9a69ca61e5ba": "bf354f1 Nombre completo de quien captura" | kind=Commit | source=git | neighbors=[511fea4 Modulo de despacho, conexion, testing, 5795f74 Búsqueda de nombre de policía p…, RegistroIncidenteForm.tsx] | lang=nl
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@c69454373882f48c57032868e9293749ba7b70cc": "c694543 cambio dee estatus" | kind=Commit | source=git | neighbors=[519716a Formulario para registro de wha…, conexion, testing, 49dca47 cambio, RegistroIncidenteForm.tsx] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@c6cb0295a60d971e802a3ac065defc926c089c2c": "c6cb029 Formulario editado" | kind=Commit | source=git | neighbors=[166a26b Merge branch 'feature/testing' …, conexion, testing, 86e9319 Merge branch 'feature/testing' …, FormularioD1.tsx] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@c96893ea9cf58204304c1e59970fe5171f9015fe": "c96893e Merge branch 'feature/correcciones' into feature/testing" | kind=Commit | source=git | neighbors=[3b0e087 NAVEGACION, a0ec8d2 topbar en 911, conexion, testing, 5e458d6 navegacion] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@d5e0e56940d5ea8017a1aea9faeab83f4d953d1b": "d5e0e56 Campo para agregar detenidos de forma dinámica y eliminación de campos …" | kind=Commit | source=git | neighbors=[14fd73a Update FormSection.tsx, conexion, testing, 81b9829 Cambios para guardado de persin…, FormSection.tsx] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@d665f9542d395bec8cea313e2fe1e4a2e92b7986": "d665f95 Camo dinamico y cambio a select en datos positivos" | kind=Commit | source=git | neighbors=[5795f74 Búsqueda de nombre de policía p…, conexion, testing, 14fd73a Update FormSection.tsx, FormSection.tsx] | lang=es
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@dba1bfbdc2ce4fe738967eccad3d22a8439ba787": "dba1bfb color de boton" | kind=Commit | source=git | neighbors=[156c925 vista de reporte de sin robos, conexion, testing, 1acddac Merge branch 'feature/testing' …, page.tsx] | lang=nl
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@ec57fd24ed14fc4836f80d87af0f99fc2146ea9f": "ec57fd2 Form actualizado" | kind=Commit | source=git | neighbors=[69a557f CAMBIO CORREGIDO, conexion, testing, 8a59180 Form listo, FormularioD1.tsx] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@f2d7c18cad3a6bb45d3736aa48794ad07e0ce924": "f2d7c18 logica de redirección dinamica" | kind=Commit | source=git | neighbors=[b79a96a Conexión entre ambos modulos, conexion, testing, d04a29d correccion de navegacion entre …, actions.ts] | lang=nl
- "components_filadetenidorol": "FilaDetenidoRol.tsx" | kind=code-symbol | source=components/FilaDetenidoRol.tsx:L1 | neighbors=[388b997 Apartados para subir fotografia…, 672bab5 libearciones para juzgado, de5682f Merge pull request #10 from pre…, FilaDetenidoRol(), page.tsx] | lang=en
- "curp_route": "route.ts" | kind=code-symbol | source=app/api/via/curp/route.ts:L1 | neighbors=[23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, b5233a8 implementando via como modulo d…, f7b1aac Merge branch 'feature/testing' …, POST()] | lang=en
- "d1_mapper_rowtoreported1": "rowToReporteD1()" | kind=code-symbol | source=lib/d1/mapper.ts:L21 | neighbors=[mapper.ts, toBool(), toNum(), toStr(), repository.ts] | lang=en
- "d1_noiniciada_styles_styles": "styles" | kind=code-symbol | source=components/reportes/d1_noiniciada/styles.ts:L1 | neighbors=[DescargaFilters.tsx, DescargaPagination.tsx, DescargaTable.tsx, page.tsx, styles.ts] | lang=en
- "d1_styles_styles": "styles" | kind=code-symbol | source=components/reportes/d1/styles.ts:L3 | neighbors=[D1Filters.tsx, D1Pagination.tsx, D1ReportsTable.tsx, page.tsx, styles.ts] | lang=en
- "db_create_admin": "create-admin.ts" | kind=code-symbol | source=lib/db/create-admin.ts:L1 | neighbors=[6a042cd feat: sistema de autenticación,…, ffcea0c fase 1 completada, ADMIN, main(), pool] | lang=en
- "db_index": "index.ts" | kind=code-symbol | source=lib/db/index.ts:L1 | neighbors=[6a042cd feat: sistema de autenticación,…, db, schema.ts, db.ts, auth.ts] | lang=en
- "fiscalia_types_solicitudevidencia": "SolicitudEvidencia" | kind=code-symbol | source=lib/fiscalia/types.ts:L147 | neighbors=[actions.ts, mapper.ts, service.ts, TabSolicitudes.tsx, types.ts] | lang=en
- "flota_route": "route.ts" | kind=code-symbol | source=app/api/rol-servicios/externos/flota/route.ts:L1 | neighbors=[6feefe2 BackEnd completo para hacer la …, a58a0f7 Despachos, GET(), auth.ts, auth] | lang=en
- "health_repository": "repository.ts" | kind=code-symbol | source=lib/health/repository.ts:L1 | neighbors=[ad3ec5f mejorando esto, ping(), db.ts, query(), route.ts] | lang=en
- "health_route": "route.ts" | kind=code-symbol | source=app/api/health/route.ts:L1 | neighbors=[6a042cd feat: sistema de autenticación,…, ad3ec5f mejorando esto, repository.ts, ping(), GET()] | lang=en
- "id_page_infraccionciudadanopage": "InfraccionCiudadanoPage()" | kind=code-symbol | source=app/infracciones/[id]/page.tsx:L64 | neighbors=[page.tsx, formatDate(), getStatusStyle(), sanitize(), timeAgo()] | lang=en
- "incidentes_actions_num": "num()" | kind=code-symbol | source=lib/incidentes/actions.ts:L32 | neighbors=[actions.ts, createIncidente(), createRecorridoCompleto(), createReporteCampo(), insertarIncidente()] | lang=en
- "incidentes_mapper_rowtoincidentedetallecompletobase": "rowToIncidenteDetalleCompletoBase()" | kind=code-symbol | source=lib/incidentes/mapper.ts:L198 | neighbors=[mapper.ts, toBool(), toNum(), toStr(), repository.ts] | lang=en
- "incidentes_mapper_rowtoreportecampo": "rowToReporteCampo()" | kind=code-symbol | source=lib/incidentes/mapper.ts:L113 | neighbors=[mapper.ts, toBool(), toNum(), toStr(), repository.ts] | lang=en
- "incidentes_mapper_rowtoreportecampodetalle": "rowToReporteCampoDetalle()" | kind=code-symbol | source=lib/incidentes/mapper.ts:L233 | neighbors=[mapper.ts, toBool(), toNum(), toStr(), repository.ts] | lang=en
- "incidentes_mapper_tobool": "toBool()" | kind=code-symbol | source=lib/incidentes/mapper.ts:L32 | neighbors=[mapper.ts, rowToIncidenteConDespachoBase(), rowToIncidenteDetalleCompletoBase(), rowToReporteCampo(), rowToReporteCampoDetalle()] | lang=en
- "incidentes_statincidencia": "StatIncidencia.tsx" | kind=code-symbol | source=components/reportes/incidentes/StatIncidencia.tsx:L1 | neighbors=[2fcba7b vista de reportes de incidentes…, 552d291 Merge branch 'testing' into con…, e286619 Merge branch 'feature/testing' …, IncidenteStat(), page.tsx] | lang=en

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/cesarbr/Documents/dev/sjr/seguridad_publica/.graphify/description-instructions/batch-019.json

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
