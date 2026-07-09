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

- "commit:repo:github.com/presidenciaSJR/seguridad_publica@14fd73a756023438fbf34a9d9a02918f6c8a51fb": "14fd73a Update FormSection.tsx" | kind=Commit | source=git | neighbors=[conexion, testing, d5e0e56 Campo para agregar detenidos de…, FormSection.tsx, d665f95 Camo dinamico y cambio a select…] | lang=pt
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@18f5bac124f7a516e4c794e54c13763523e60419": "18f5bac llamada en card" | kind=Commit | source=git | neighbors=[conexion, testing, 22b7b54 Merge branch 'feature/reportes'…, page.tsx, 719b5ab cambio para generacion de repor…] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@24626eb982afa43f645cacc5f1a4a61b73739a55": "24626eb se agregan opciones de reportes" | kind=Commit | source=git | neighbors=[conexion, testing, 1265204 paginacion por tablas, ReportesTabs.tsx, b170599 Merge branch 'feature/testing' …] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@283f34200d56b11b1f2b38d62deeddc6d77e1f33": "283f342 Merge branch 'feature/testing' of https://github.com/presidenciaSJR/seg…" | kind=Commit | source=git | neighbors=[testing, 3a00521 Merge branch 'feature/testing' …, module-cards.tsx, 3b10d72 Merge branch 'feature/testing' …, 6488a30 Formulario sin backend de 911 l…] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@2be4ca9ae4ff3a5d1b237b09267954a3b2df39fb": "2be4ca9 Cambio en header" | kind=Commit | source=git | neighbors=[conexion, testing, 3a00521 Merge branch 'feature/testing' …, Header.tsx, 3b10d72 Merge branch 'feature/testing' …] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@2e36377810689a31202162fcc8384625f96efb23": "2e36377 Eliminar tutoriales de flujo innecesarios" | kind=Commit | source=git | neighbors=[199ce68 Merge branch 'main' of https://…, conexion, main, testing, aaab50d Merge branch 'main' of https://…] | lang=nl
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@305b0bd60493abe88ef39584578d98eb13825846": "305b0bd se quitan campos" | kind=Commit | source=git | neighbors=[conexion, testing, 917002a Guardado de policia a cargo, FormSection.tsx, 81b9829 Cambios para guardado de persin…] | lang=es
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@3800cab22dfc4c9c5936d59d18ae8d7fc2d84b00": "3800cab formulario de nueva medida de proteccion" | kind=Commit | source=git | neighbors=[1970615 vista de medidas, conexion, testing, adf0c3d vista de busqueda y juridico, page.tsx] | lang=nl
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@3b0e087f1fdd0285db9176c6679877af2b06aced": "3b0e087 NAVEGACION" | kind=Commit | source=git | neighbors=[133bb9d pages de listado de llamadas y …, conexion, testing, c96893e Merge branch 'feature/correccio…, page.tsx] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@4271f370e6dcbe157f84bf08a7a3c865913fbd5a": "4271f37 feat(doc): agregar manual de usuario interactivo para el módulo de prev…" | kind=Commit | source=git | neighbors=[conexion, main, testing, 199ce68 Merge branch 'main' of https://…, d3e6d95 Update SeguimientoTimeline.tsx] | lang=es
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@49dca479f6546c67df478e85e13a41ece8cc067f": "49dca47 cambio" | kind=Commit | source=git | neighbors=[conexion, testing, page.tsx, 82ae6e9 Interfaz de llamada 911 cambios, c694543 cambio dee estatus] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@5795f7490c42b3125b13a99f89b1d5978c13d794": "5795f74 Búsqueda de nombre de policía por nómina" | kind=Commit | source=git | neighbors=[conexion, testing, d665f95 Camo dinamico y cambio a select…, FormSection.tsx, bf354f1 Nombre completo de quien captura] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@5d09f3148a5d50435e0b5ff477e1988edeac2a4f": "5d09f31 integración de componente de paginacion para vista de listado de rondin…" | kind=Commit | source=git | neighbors=[conexion, testing, 7400135 Merge branch 'feature/testing' …, page.tsx, 8affdb6 componente de paginacion y se i…] | lang=nl
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@5e458d61c890c8a4a9e8a990e5b1cc6d10496867": "5e458d6 navegacion" | kind=Commit | source=git | neighbors=[page.tsx, conexion, testing, 86e9319 Merge branch 'feature/testing' …, c96893e Merge branch 'feature/correccio…] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@6488a30d265406604e860f95a0a52143a16960c5": "6488a30 Formulario sin backend de 911 listo" | kind=Commit | source=git | neighbors=[testing, Formulario911.tsx, page.tsx, 283f342 Merge branch 'feature/testing' …, a24949a Merge branch 'feature/testing' …] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@756e1c69242082798814cb770b0d311a2ea25102": "756e1c6 Update page.tsx" | kind=Commit | source=git | neighbors=[page.tsx, testing, a24949a Merge branch 'feature/testing' …, f5e51e1 card de 911 en vista de dashboa…, a667064 Page de seleccion de registro] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@77a125d75f6fc8bf59e520dfcdd575b65d0d1443": "77a125d Merge branch 'feature/monitorista-reportes' of https://github.com/presi…" | kind=Commit | source=git | neighbors=[5d179c0 Apartado de reportes, conexion, testing, 5aa5866 Cambio de colores en interfaz d…, 8e6c8c6 Apartado de reportes] | lang=pt
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@7af0ca79d22e1999f9b6c50baed36ce9a260cb00": "7af0ca7 page de reportes actualizado" | kind=Commit | source=git | neighbors=[1acddac Merge branch 'feature/testing' …, conexion, testing, 2fcba7b vista de reportes de incidentes…, page.tsx] | lang=nl
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@7d7ebb1c25859658963f23baafe6cb070faf1c6a": "7d7ebb1 merge de archivos" | kind=Commit | source=git | neighbors=[conexion, testing, Formulario911.tsx, d2a4a5e guardado de nuemro exterior, in…, ecebe38 Guardado de longitud y latitud …] | lang=nl
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@8a59180baa7bce6e0d325fb3623bb7906d037f94": "8a59180 Form listo" | kind=Commit | source=git | neighbors=[conexion, testing, a291695 Merge branch 'feature/testing' …, FormularioD1.tsx, ec57fd2 Form actualizado] | lang=pt
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@917002a669ae2af14aae5e575de2004f5c85e78d": "917002a Guardado de policia a cargo" | kind=Commit | source=git | neighbors=[305b0bd se quitan campos, conexion, testing, 93dd3ea Merge pull request #1 from pres…, FormSection.tsx] | lang=pt
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@a0ec8d2c2dfbfde9cb6ea5865a8732c2320f11aa": "a0ec8d2 topbar en 911" | kind=Commit | source=git | neighbors=[83f48a2 Merge branch 'feature/correccio…, page.tsx, conexion, testing, c96893e Merge branch 'feature/correccio…] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@a667064799f60e8647a86af738414eab28726079": "a667064 Page de seleccion de registro" | kind=Commit | source=git | neighbors=[ModuleCard.tsx, page.tsx, testing, 756e1c6 Update page.tsx, b68a2b7 Merge branch 'feature/testing' …] | lang=nl
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@aaab50d699cb73f927fb76c1cc49815d8080821b": "aaab50d Merge branch 'main' of https://github.com/presidenciaSJR/seguridad_publ…" | kind=Commit | source=git | neighbors=[2e36377 Eliminar tutoriales de flujo in…, 511fea4 Modulo de despacho, conexion, testing, 44ebbc4 Merge branch 'feature/testing' …] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@ab3d8f668113174e104dae7ac21bde8f402d8626": "ab3d8f6 Formulario con stepper" | kind=Commit | source=git | neighbors=[a291695 Merge branch 'feature/testing' …, conexion, testing, 7c1d096 Merge branch 'feature/denuncias…, FormularioD1.tsx] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@bf354f189b01aeb97fe358f4a4fc9a69ca61e5ba": "bf354f1 Nombre completo de quien captura" | kind=Commit | source=git | neighbors=[511fea4 Modulo de despacho, conexion, testing, 5795f74 Búsqueda de nombre de policía p…, RegistroIncidenteForm.tsx] | lang=nl
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@c69454373882f48c57032868e9293749ba7b70cc": "c694543 cambio dee estatus" | kind=Commit | source=git | neighbors=[519716a Formulario para registro de wha…, conexion, testing, 49dca47 cambio, RegistroIncidenteForm.tsx] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@c6cb0295a60d971e802a3ac065defc926c089c2c": "c6cb029 Formulario editado" | kind=Commit | source=git | neighbors=[166a26b Merge branch 'feature/testing' …, conexion, testing, 86e9319 Merge branch 'feature/testing' …, FormularioD1.tsx] | lang=en
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
