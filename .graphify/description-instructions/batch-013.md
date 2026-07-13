# Node Description Batch 14 of 87

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

- "steps_procesomodal": "ProcesoModal.tsx" | kind=code-symbol | source=features/via/infracciones/components/steps/ProcesoModal.tsx:L1 | neighbors=[23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, b5233a8 implementando via como modulo d…, f7b1aac Merge branch 'feature/testing' …, FormularioInfraccion.tsx, types.ts] | lang=en
- "stores_useinfraccionstore_useinfraccionstore": "useInfraccionStore" | kind=code-symbol | source=stores/useInfraccionStore.ts:L130 | neighbors=[FormularioInfraccion.tsx, PasoCiudadano.tsx, PasoCiudadanoConductor.tsx, PasoConductor.tsx, PasoConfirmacion.tsx, PasoDescuentos.tsx] | lang=en
- "types_detalleinfraccion": "detalleInfraccion.ts" | kind=code-symbol | source=features/via/compartido/types/detalleInfraccion.ts:L1 | neighbors=[16a63d4 Merge branch 'feature/testing' …, 91c36bf validando orden de pago, ac48eb1 Merge pull request #17 from pre…, CapturarDatosTitularSection.tsx, ModalEntregarGarantia.tsx, DetalleCompleto] | lang=en
- "ui_cardtitle": "CardTitle.tsx" | kind=code-symbol | source=features/via/infracciones/components/ui/CardTitle.tsx:L1 | neighbors=[23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, b5233a8 implementando via como modulo d…, f7b1aac Merge branch 'feature/testing' …, PasoCiudadano.tsx, PasoConductor.tsx] | lang=en
- "ui_segmentedcontrol": "SegmentedControl.tsx" | kind=code-symbol | source=features/via/infracciones/components/ui/SegmentedControl.tsx:L1 | neighbors=[23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, b5233a8 implementando via como modulo d…, f7b1aac Merge branch 'feature/testing' …, SeccionLiberacion.tsx, PasoCiudadano.tsx] | lang=en
- "911_mapper": "mapper.ts" | kind=code-symbol | source=lib/911/mapper.ts:L1 | neighbors=[rowToCatalogo(), rowToIncidenteDetalle(), rowToIncidenteResumen(), toNum(), toStr(), types.ts] | lang=en
- "agente_infracciones_page": "page.tsx" | kind=code-symbol | source=app/agente_infracciones/page.tsx:L1 | neighbors=[actions.ts, obtenerDashboardInfracciones(), obtenerInfracciones(), InfraccionesTable.tsx, InfraccionesDashboardPage(), ProfileDropdown.tsx] | lang=en
- "agente_liberaciones_profiledropdown": "ProfileDropdown.tsx" | kind=code-symbol | source=components/agente_liberaciones/ProfileDropdown.tsx:L1 | neighbors=[page.tsx, ProfileDropdown(), Props, auth-client.ts, authClient, 0b210fa Merge pull request #12 from pre…] | lang=en
- "app_layout": "layout.tsx" | kind=code-symbol | source=app/layout.tsx:L1 | neighbors=[metadata, RootLayout(), LoadingProvider.tsx, 0d9172a mejorando flujo de 911-despacho, 2db162a flujo de asegurados, 5558751 feat: módulo Prevención del Del…] | lang=en
- "auxiliar_mapper": "mapper.ts" | kind=code-symbol | source=lib/auxiliar/mapper.ts:L1 | neighbors=[rowToChecklist(), rowToCuestionarioRobo(), rowToParReporte(), toStr(), types.ts, AuxChecklist] | lang=en
- "branch:repo:github.com/presidenciaSJR/seguridad_publica#main": "main" | kind=Branch | source=git | neighbors=[0e33bf6 feat: módulo Admin, Prórroga, F…, 199ce68 Merge branch 'main' of https://…, 2e36377 Eliminar tutoriales de flujo in…, 4271f37 feat(doc): agregar manual de us…, 5558751 feat: módulo Prevención del Del…, 6a042cd feat: sistema de autenticación,…] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@0844e6e1c27168ffc88acbe2c2d8b6f4cfb6a8f6": "0844e6e Corregido" | kind=Commit | source=git | neighbors=[feature/monitorista, feature/monitorista-reportes, feature/testing, fix/detenidos, fix/incidentes-camara, fix/subir-fotografias] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@133bb9d68dd354e2a1b062f5d4f641bc8757a9ed": "133bb9d pages de listado de llamadas y de radio" | kind=Commit | source=git | neighbors=[conexion, testing, 3b0e087 NAVEGACION, 83f48a2 Merge branch 'feature/correccio…, feature/monitorista, feature/monitorista-reportes] | lang=nl
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@14fd73a756023438fbf34a9d9a02918f6c8a51fb": "14fd73a Update FormSection.tsx" | kind=Commit | source=git | neighbors=[conexion, testing, d5e0e56 Campo para agregar detenidos de…, FormSection.tsx, d665f95 Camo dinamico y cambio a select…, feature/monitorista] | lang=pt
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@1e81ec820432148abb04683b00b2f357e5385177": "1e81ec8 Datos se autorellenan de denuncias y seccion de oficial" | kind=Commit | source=git | neighbors=[formAnalisis.tsx, TablonAnalisis.tsx, conexion, testing, 77ddf58 Merge branch 'feature/testing' …, FormularioD1.tsx] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@2fcba7bd260cba70d92594ca197b78326d4b5de5": "2fcba7b vista de reportes de incidentes diarios y semanales" | kind=Commit | source=git | neighbors=[conexion, testing, 719b5ab cambio para generacion de repor…, FiltrosIncidencias.tsx, Paginacion.tsx, StatIncidencia.tsx] | lang=nl
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@305b0bd60493abe88ef39584578d98eb13825846": "305b0bd se quitan campos" | kind=Commit | source=git | neighbors=[conexion, testing, 917002a Guardado de policia a cargo, FormSection.tsx, 81b9829 Cambios para guardado de persin…, feature/monitorista] | lang=es
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@3b0e087f1fdd0285db9176c6679877af2b06aced": "3b0e087 NAVEGACION" | kind=Commit | source=git | neighbors=[133bb9d pages de listado de llamadas y …, conexion, testing, c96893e Merge branch 'feature/correccio…, feature/monitorista, feature/monitorista-reportes] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@50101e2d3282e026715fc114d37ac180b4685370": "50101e2 Merge pull request #6 from presidenciaSJR/fix/incidentes-camara" | kind=Commit | source=git | neighbors=[conexion, testing, caef6e8 Merge pull request #7 from pres…, page.tsx, route.ts, incidentes-camara-service.ts] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@5795f7490c42b3125b13a99f89b1d5978c13d794": "5795f74 Búsqueda de nombre de policía por nómina" | kind=Commit | source=git | neighbors=[testing, d665f95 Camo dinamico y cambio a select…, FormSection.tsx, bf354f1 Nombre completo de quien captura, conexion, feature/monitorista] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@5aa5866f2596cb59e4321a860046e68b808e7e64": "5aa5866 Cambio de colores en interfaz de login" | kind=Commit | source=git | neighbors=[layout.tsx, conexion, testing, b403f89 Vista para reportes de incident…, ce84893 Merge branch 'feature/testing' …, page.tsx] | lang=nl
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@5d09f3148a5d50435e0b5ff477e1988edeac2a4f": "5d09f31 integración de componente de paginacion para vista de listado de rondin…" | kind=Commit | source=git | neighbors=[conexion, testing, 7400135 Merge branch 'feature/testing' …, 8affdb6 componente de paginacion y se i…, feature/monitorista, feature/monitorista-reportes] | lang=nl
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@7c1d0962288af811c88f7a708534e38caadc6e64": "7c1d096 Merge branch 'feature/denuncias' into feature/testing" | kind=Commit | source=git | neighbors=[28da720 Cambio de colores en dashboard …, conexion, testing, 44ebbc4 Merge branch 'feature/testing' …, FormularioD1.tsx, ab3d8f6 Formulario con stepper] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@7d7ebb1c25859658963f23baafe6cb070faf1c6a": "7d7ebb1 merge de archivos" | kind=Commit | source=git | neighbors=[conexion, testing, d2a4a5e guardado de nuemro exterior, in…, ecebe38 Guardado de longitud y latitud …, feature/monitorista, feature/monitorista-reportes] | lang=nl
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@82ae6e912012633311f0482474650d99d2990894": "82ae6e9 Interfaz de llamada 911 cambios" | kind=Commit | source=git | neighbors=[49dca47 cambio, feature/monitorista, feature/monitorista-reportes, fix/detenidos, fix/incidentes-camara, fix/subir-fotografias] | lang=nl
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@8303881c13f6d239dec188adbd263b90da459fb5": "8303881 Subida de header y footer, falta hacer que jale bien el nombre" | kind=Commit | source=git | neighbors=[feature/monitorista, feature/monitorista-reportes, fix/detenidos, fix/incidentes-camara, fix/subir-fotografias, a24949a Merge branch 'feature/testing' …] | lang=es
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@917002a669ae2af14aae5e575de2004f5c85e78d": "917002a Guardado de policia a cargo" | kind=Commit | source=git | neighbors=[305b0bd se quitan campos, conexion, testing, 93dd3ea Merge pull request #1 from pres…, FormSection.tsx, feature/monitorista] | lang=pt
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@a24949a572f3f3dc670a32150b223ca2978de0e8": "a24949a Merge branch 'feature/testing' of https://github.com/presidenciaSJR/seg…" | kind=Commit | source=git | neighbors=[756e1c6 Update page.tsx, 8303881 Subida de header y footer, falt…, ModuleCard.tsx, feature/monitorista, feature/monitorista-reportes, fix/detenidos] | lang=pt
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@bf2e7ed1cd9bab700be7b07172fa6274b92da9c8": "bf2e7ed Reportes del modulo de incidentes" | kind=Commit | source=git | neighbors=[b403f89 Vista para reportes de incident…, conexion, testing, bd1a223 Merge branch 'feature/vistas-re…, page.tsx, ReportesTabs.tsx] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@bf354f189b01aeb97fe358f4a4fc9a69ca61e5ba": "bf354f1 Nombre completo de quien captura" | kind=Commit | source=git | neighbors=[511fea4 Modulo de despacho, testing, 5795f74 Búsqueda de nombre de policía p…, RegistroIncidenteForm.tsx, conexion, feature/monitorista] | lang=nl
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@bf790a7531dfa12cf7c237625f9af6f0c2787860": "bf790a7 opcion booleana arreglada" | kind=Commit | source=git | neighbors=[formAnalisis.tsx, conexion, testing, 9d67ddf Cambios de formulario analisis, FormularioD1.tsx, useAnalistaForm.ts] | lang=pt
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@c6cb0295a60d971e802a3ac065defc926c089c2c": "c6cb029 Formulario editado" | kind=Commit | source=git | neighbors=[166a26b Merge branch 'feature/testing' …, conexion, testing, 86e9319 Merge branch 'feature/testing' …, FormularioD1.tsx, feature/monitorista] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@c96893ea9cf58204304c1e59970fe5171f9015fe": "c96893e Merge branch 'feature/correcciones' into feature/testing" | kind=Commit | source=git | neighbors=[3b0e087 NAVEGACION, a0ec8d2 topbar en 911, conexion, testing, 5e458d6 navegacion, feature/monitorista] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@d5e0e56940d5ea8017a1aea9faeab83f4d953d1b": "d5e0e56 Campo para agregar detenidos de forma dinámica y eliminación de campos …" | kind=Commit | source=git | neighbors=[14fd73a Update FormSection.tsx, conexion, testing, 81b9829 Cambios para guardado de persin…, FormSection.tsx, feature/monitorista] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@d665f9542d395bec8cea313e2fe1e4a2e92b7986": "d665f95 Camo dinamico y cambio a select en datos positivos" | kind=Commit | source=git | neighbors=[5795f74 Búsqueda de nombre de policía p…, conexion, testing, 14fd73a Update FormSection.tsx, FormSection.tsx, feature/monitorista] | lang=es
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@f2d7c18cad3a6bb45d3736aa48794ad07e0ce924": "f2d7c18 logica de redirección dinamica" | kind=Commit | source=git | neighbors=[b79a96a Conexión entre ambos modulos, conexion, testing, d04a29d correccion de navegacion entre …, actions.ts, feature/monitorista] | lang=nl
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@fa9df15da4bab3feb96af888bfbbe33d5452b967": "fa9df15 Reporte de cámaras" | kind=Commit | source=git | neighbors=[06c55f5 Merge branch 'feature/testing' …, conexion, testing, repository.ts, service.ts, 9faf222 Merge branch 'feature/testing' …] | lang=nl
- "components_modalentregargarantia": "ModalEntregarGarantia.tsx" | kind=code-symbol | source=features/via/infracciones/components/ModalEntregarGarantia.tsx:L1 | neighbors=[16a63d4 Merge branch 'feature/testing' …, 91c36bf validando orden de pago, ac48eb1 Merge pull request #17 from pre…, CapturarDatosTitularSection.tsx, getGarantiaInfo(), ModalEntregarGarantia()] | lang=en
- "corralon_repository": "repository.ts" | kind=code-symbol | source=lib/corralon/repository.ts:L1 | neighbors=[16df128 flujo de corralones listo, 5a1b5d5 empezando corralon, ad3ec5f mejorando esto, finalizarInfraccionCorralon(), obtenerEstatusInfraccion(), obtenerSolicitudesFinalizadas()] | lang=en
- "d1_d1reportstable": "D1ReportsTable.tsx" | kind=code-symbol | source=components/reportes/d1/D1ReportsTable.tsx:L1 | neighbors=[07543de Conexion de reportes con d1 y l…, 552d291 Merge branch 'testing' into con…, 98e7e6e vista de reportes de d1, b233bc7 Merge branch 'testing' into con…, e286619 Merge branch 'feature/testing' …, D1Pagination.tsx] | lang=en

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/cesarbr/Documents/dev/sjr/seguridad_publica/.graphify/description-instructions/batch-013.json

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
