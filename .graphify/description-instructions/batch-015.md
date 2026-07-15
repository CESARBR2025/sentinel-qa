# Node Description Batch 16 of 93

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

- "via_pagos": "pagos.ts" | kind=code-symbol | source=lib/via/pagos.ts:L1 | neighbors=[16a63d4 Merge branch 'feature/testing' …, 863c575 Merge pull request #24 from pre…, 91c36bf validando orden de pago, ac48eb1 Merge pull request #17 from pre…, ede5a1d eliminado referencias a via_pru…, route.ts] | lang=en
- "911_permisos_tieneaccesoseccion": "tieneAccesoSeccion()" | kind=code-symbol | source=lib/911/permisos.ts:L32 | neighbors=[permisos.ts, tienePermiso(), service.ts, service.ts, page.tsx, page.tsx] | lang=en
- "agente_infracciones_infraccionestable": "InfraccionesTable.tsx" | kind=code-symbol | source=components/agente_infracciones/InfraccionesTable.tsx:L1 | neighbors=[InfraccionesDashboard.tsx, columns, DataRow, InfraccionesTable(), InfraccionesTableProps, page.tsx] | lang=en
- "agente_infracciones_storecapturainfractor": "storeCapturaInfractor.ts" | kind=code-symbol | source=lib/agente_infracciones/storeCapturaInfractor.ts:L1 | neighbors=[CapturarDatosInfractorModal.tsx, CapturaInfractorActions, CapturaInfractorState, CapturaInfractorStore, initialState, useCapturaInfractorStore] | lang=en
- "camara_mapper": "mapper.ts" | kind=code-symbol | source=lib/camara/mapper.ts:L1 | neighbors=[rowToIncidenteCamara(), rowToTotalesCamara(), toNum(), toNumNullable(), toStr(), types.ts] | lang=en
- "camara_service": "service.ts" | kind=code-symbol | source=lib/camara/service.ts:L1 | neighbors=[repository.ts, obtenerIncidentesCamara(), obtenerTotalesCamara(), listarIncidentesCamara(), toStr(), 5618308 guardado e evidencias con ed] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@0844e6e1c27168ffc88acbe2c2d8b6f4cfb6a8f6": "0844e6e Corregido" | kind=Commit | source=git | neighbors=[feature/monitorista, feature/monitorista-reportes, fix/detenidos, fix/incidentes-camara, fix/subir-fotografias, 71912a4 Bitacora incluida] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@133bb9d68dd354e2a1b062f5d4f641bc8757a9ed": "133bb9d pages de listado de llamadas y de radio" | kind=Commit | source=git | neighbors=[feature/monitorista, feature/monitorista-reportes, feature/testing, fix/detenidos, fix/incidentes-camara, fix/subir-fotografias] | lang=nl
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@14fd73a756023438fbf34a9d9a02918f6c8a51fb": "14fd73a Update FormSection.tsx" | kind=Commit | source=git | neighbors=[feature/monitorista, feature/monitorista-reportes, fix/detenidos, fix/incidentes-camara, fix/subir-fotografias, d5e0e56 Campo para agregar detenidos de…] | lang=pt
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@156c925834f49f42390ead1b4c5b351bca392f35": "156c925 vista de reporte de sin robos" | kind=Commit | source=git | neighbors=[feature/testing, main, dba1bfb color de boton, page.tsx, PaginacionSinRobos.tsx, ReporteSinRobos.tsx] | lang=nl
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@25de42811d8e92a9e713f5e451bfd1dc0c50f773": "25de428 Corrección para agregar el botón de cerrar sesion" | kind=Commit | source=git | neighbors=[page.tsx, ProfileDropdownAuxiliar.tsx, feature/testing, fix/detenidos, fix/incidentes-camara, fix/subir-fotografias] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@2c128e5934bc8823af4c4288617bed8102fc687a": "2c128e5 test expediente vercel" | kind=Commit | source=git | neighbors=[feature/testing, main, 91c36bf validando orden de pago, abrirDocumento.ts, route.ts, route.ts] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@305b0bd60493abe88ef39584578d98eb13825846": "305b0bd se quitan campos" | kind=Commit | source=git | neighbors=[feature/monitorista, feature/monitorista-reportes, fix/detenidos, fix/incidentes-camara, fix/subir-fotografias, 917002a Guardado de policia a cargo] | lang=es
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@44a01c3e9031adf0c6ddd327f8c7833726e4c464": "44a01c3 fase 3-4-5" | kind=Commit | source=git | neighbors=[feature/testing, main, 12aab65 fase 4, route.ts, db.ts, route.ts] | lang=pt
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@51e682b4a77a674222e29c98761bac25baff6f72": "51e682b mejorando flujo de liberaciones" | kind=Commit | source=git | neighbors=[actions.ts, LiberacionesDashboard.tsx, mapper.ts, repository.ts, types.ts, feature/testing] | lang=nl
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@5795f7490c42b3125b13a99f89b1d5978c13d794": "5795f74 Búsqueda de nombre de policía por nómina" | kind=Commit | source=git | neighbors=[feature/monitorista, feature/monitorista-reportes, fix/detenidos, fix/incidentes-camara, fix/subir-fotografias, d665f95 Camo dinamico y cambio a select…] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@5d2b0640b03fd989c24c94e0bbbfe570c3ea2488": "5d2b064 fix vercel upload files" | kind=Commit | source=git | neighbors=[46f24f8 generica function for infractio…, actions.ts, LiberacionesDashboard.tsx, feature/testing, main, da48f68 implementando flujo de aceptaci…] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@5e458d61c890c8a4a9e8a990e5b1cc6d10496867": "5e458d6 navegacion" | kind=Commit | source=git | neighbors=[feature/monitorista, feature/monitorista-reportes, feature/testing, fix/detenidos, fix/incidentes-camara, fix/subir-fotografias] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@77a125d75f6fc8bf59e520dfcdd575b65d0d1443": "77a125d Merge branch 'feature/monitorista-reportes' of https://github.com/presi…" | kind=Commit | source=git | neighbors=[5d179c0 Apartado de reportes, feature/monitorista-reportes, feature/testing, fix/detenidos, fix/incidentes-camara, fix/subir-fotografias] | lang=pt
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@7d7ebb1c25859658963f23baafe6cb070faf1c6a": "7d7ebb1 merge de archivos" | kind=Commit | source=git | neighbors=[feature/monitorista, feature/monitorista-reportes, fix/detenidos, fix/incidentes-camara, fix/subir-fotografias, d2a4a5e guardado de nuemro exterior, in…] | lang=nl
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@82ae6e912012633311f0482474650d99d2990894": "82ae6e9 Interfaz de llamada 911 cambios" | kind=Commit | source=git | neighbors=[49dca47 cambio, feature/monitorista, feature/monitorista-reportes, fix/detenidos, fix/incidentes-camara, fix/subir-fotografias] | lang=nl
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@8303881c13f6d239dec188adbd263b90da459fb5": "8303881 Subida de header y footer, falta hacer que jale bien el nombre" | kind=Commit | source=git | neighbors=[feature/monitorista, feature/monitorista-reportes, fix/detenidos, fix/incidentes-camara, fix/subir-fotografias, a24949a Merge branch 'feature/testing' …] | lang=es
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@8a59180baa7bce6e0d325fb3623bb7906d037f94": "8a59180 Form listo" | kind=Commit | source=git | neighbors=[feature/monitorista-reportes, feature/testing, fix/detenidos, fix/incidentes-camara, fix/subir-fotografias, main] | lang=pt
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@917002a669ae2af14aae5e575de2004f5c85e78d": "917002a Guardado de policia a cargo" | kind=Commit | source=git | neighbors=[305b0bd se quitan campos, feature/monitorista, feature/monitorista-reportes, fix/detenidos, fix/incidentes-camara, fix/subir-fotografias] | lang=pt
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@9d67ddf4fb2eee14861eba2af608eb222dca0e86": "9d67ddf Cambios de formulario analisis" | kind=Commit | source=git | neighbors=[feature/testing, main, 9550203 Cambios en presentacion, se gen…, BitacoraIPH.tsx, page.tsx, route.ts] | lang=nl
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@a21f03f66a00e3f050235aae575a0e6aa6375832": "a21f03f fix bugs reporte denuncia" | kind=Commit | source=git | neighbors=[feature/testing, main, 9d803f2 fix api maps, MapaDireccionRegistro.tsx, MapSectionCiudadano.tsx, repository.ts] | lang=pt
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@a24949a572f3f3dc670a32150b223ca2978de0e8": "a24949a Merge branch 'feature/testing' of https://github.com/presidenciaSJR/seg…" | kind=Commit | source=git | neighbors=[756e1c6 Update page.tsx, 8303881 Subida de header y footer, falt…, ModuleCard.tsx, feature/monitorista, feature/monitorista-reportes, fix/detenidos] | lang=pt
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@aaab50d699cb73f927fb76c1cc49815d8080821b": "aaab50d Merge branch 'main' of https://github.com/presidenciaSJR/seguridad_publ…" | kind=Commit | source=git | neighbors=[2e36377 Eliminar tutoriales de flujo in…, 511fea4 Modulo de despacho, feature/monitorista-reportes, feature/testing, fix/detenidos, fix/incidentes-camara] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@ab3d8f668113174e104dae7ac21bde8f402d8626": "ab3d8f6 Formulario con stepper" | kind=Commit | source=git | neighbors=[a291695 Merge branch 'feature/testing' …, feature/monitorista-reportes, feature/testing, fix/detenidos, fix/incidentes-camara, fix/subir-fotografias] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@ac5d42ff982d27e79c59e871882f5ea2f6e6dfd6": "ac5d42f cerrando flujo de 911-despacho-" | kind=Commit | source=git | neighbors=[Pagination.tsx, repository.ts, service.ts, feature/testing, main, page.tsx] | lang=nl
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@bf354f189b01aeb97fe358f4a4fc9a69ca61e5ba": "bf354f1 Nombre completo de quien captura" | kind=Commit | source=git | neighbors=[511fea4 Modulo de despacho, feature/monitorista, feature/monitorista-reportes, fix/detenidos, fix/incidentes-camara, fix/subir-fotografias] | lang=nl
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@d5e0e56940d5ea8017a1aea9faeab83f4d953d1b": "d5e0e56 Campo para agregar detenidos de forma dinámica y eliminación de campos …" | kind=Commit | source=git | neighbors=[14fd73a Update FormSection.tsx, feature/monitorista, feature/monitorista-reportes, fix/detenidos, fix/incidentes-camara, fix/subir-fotografias] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@d665f9542d395bec8cea313e2fe1e4a2e92b7986": "d665f95 Camo dinamico y cambio a select en datos positivos" | kind=Commit | source=git | neighbors=[5795f74 Búsqueda de nombre de policía p…, feature/monitorista, feature/monitorista-reportes, fix/detenidos, fix/incidentes-camara, fix/subir-fotografias] | lang=es
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@ec57fd24ed14fc4836f80d87af0f99fc2146ea9f": "ec57fd2 Form actualizado" | kind=Commit | source=git | neighbors=[69a557f CAMBIO CORREGIDO, feature/monitorista-reportes, feature/testing, fix/detenidos, fix/incidentes-camara, fix/subir-fotografias] | lang=en
- "components_loadingprovider": "LoadingProvider.tsx" | kind=code-symbol | source=components/LoadingProvider.tsx:L1 | neighbors=[0068216 Mejora de Dashboard, Login y tr…, 11e8817 Merge branch 'testing' into juz…, 28da720 Cambio de colores en dashboard …, 44ebbc4 Merge branch 'feature/testing' …, 5558751 feat: módulo Prevención del Del…, 863c575 Merge pull request #24 from pre…] | lang=en
- "d1_d1filters": "D1Filters.tsx" | kind=code-symbol | source=components/reportes/d1/D1Filters.tsx:L1 | neighbors=[0068216 Mejora de Dashboard, Login y tr…, 07543de Conexion de reportes con d1 y l…, 552d291 Merge branch 'testing' into con…, 863c575 Merge pull request #24 from pre…, 98e7e6e vista de reportes de d1, b233bc7 Merge branch 'testing' into con…] | lang=en
- "despachos_page": "page.tsx" | kind=code-symbol | source=app/oficial/despachos/page.tsx:L1 | neighbors=[0068216 Mejora de Dashboard, Login y tr…, 0d9172a mejorando flujo de 911-despacho, 22bf125 Merge pull request #20 from pre…, 290d651 feat(despacho): flujo integral …, 863c575 Merge pull request #24 from pre…, MisDespachosPage()] | lang=en
- "deteccion_camara_styles": "styles.ts" | kind=code-symbol | source=components/reportes/deteccion_camara/styles.ts:L1 | neighbors=[0068216 Mejora de Dashboard, Login y tr…, 863c575 Merge pull request #24 from pre…, b170599 Merge branch 'feature/testing' …, b403f89 Vista para reportes de incident…, bd1a223 Merge branch 'feature/vistas-re…, ReportFilters.tsx] | lang=en
- "estadisticos_phonereportstable": "PhoneReportsTable.tsx" | kind=code-symbol | source=components/reportes/estadisticos/PhoneReportsTable.tsx:L1 | neighbors=[0068216 Mejora de Dashboard, Login y tr…, 07543de Conexion de reportes con d1 y l…, 552d291 Merge branch 'testing' into con…, 6f8a089 Vista de estadisticos diarios, …, 863c575 Merge pull request #24 from pre…, e286619 Merge branch 'feature/testing' …] | lang=en
- "estadisticos_phonestatscards": "PhoneStatsCards.tsx" | kind=code-symbol | source=components/reportes/estadisticos/PhoneStatsCards.tsx:L1 | neighbors=[07543de Conexion de reportes con d1 y l…, 552d291 Merge branch 'testing' into con…, 6f8a089 Vista de estadisticos diarios, …, 863c575 Merge pull request #24 from pre…, e286619 Merge branch 'feature/testing' …, page.tsx] | lang=en

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/ugomez/Documents/GitHub/seguridad_publica/.graphify/description-instructions/batch-015.json

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
