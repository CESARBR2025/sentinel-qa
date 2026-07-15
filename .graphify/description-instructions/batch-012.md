# Node Description Batch 13 of 93

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

- "prevencion_medidasfiltros": "MedidasFiltros.tsx" | kind=code-symbol | source=components/prevencion/MedidasFiltros.tsx:L1 | neighbors=[0068216 Mejora de Dashboard, Login y tr…, 06c55f5 Merge branch 'feature/testing' …, 0e33bf6 feat: módulo Admin, Prórroga, F…, 1970615 vista de medidas, 41ea169 Merge branch 'testing' into con…, 7e39526 Mejoras UI/UX] | lang=en
- "prevencion_visitamodal": "VisitaModal.tsx" | kind=code-symbol | source=components/prevencion/VisitaModal.tsx:L1 | neighbors=[0068216 Mejora de Dashboard, Login y tr…, 41ea169 Merge branch 'testing' into con…, 5558751 feat: módulo Prevención del Del…, 8355ac0 Merge branch 'feature/testing' …, 863c575 Merge pull request #24 from pre…, 9faf222 Merge branch 'feature/testing' …] | lang=en
- "reportes_sin_d1_repository": "repository.ts" | kind=code-symbol | source=lib/reportes-sin-d1/repository.ts:L1 | neighbors=[22b7b54 Merge branch 'feature/reportes'…, 552d291 Merge branch 'testing' into con…, 863c575 Merge pull request #24 from pre…, 97a156c Reportes con D1, sin D1 y sin r…, ad3ec5f mejorando esto, e286619 Merge branch 'feature/testing' …] | lang=en
- "reportes_sin_d1_service": "service.ts" | kind=code-symbol | source=lib/reportes-sin-d1/service.ts:L1 | neighbors=[22b7b54 Merge branch 'feature/reportes'…, 552d291 Merge branch 'testing' into con…, 863c575 Merge pull request #24 from pre…, 97a156c Reportes con D1, sin D1 y sin r…, ad3ec5f mejorando esto, e286619 Merge branch 'feature/testing' …] | lang=en
- "reportes_sin_novedad_repository": "repository.ts" | kind=code-symbol | source=lib/reportes-sin-novedad/repository.ts:L1 | neighbors=[22b7b54 Merge branch 'feature/reportes'…, 552d291 Merge branch 'testing' into con…, 863c575 Merge pull request #24 from pre…, 97a156c Reportes con D1, sin D1 y sin r…, ad3ec5f mejorando esto, e286619 Merge branch 'feature/testing' …] | lang=en
- "reportes_sin_novedad_service": "service.ts" | kind=code-symbol | source=lib/reportes-sin-novedad/service.ts:L1 | neighbors=[22b7b54 Merge branch 'feature/reportes'…, 552d291 Merge branch 'testing' into con…, 863c575 Merge pull request #24 from pre…, 97a156c Reportes con D1, sin D1 y sin r…, ad3ec5f mejorando esto, e286619 Merge branch 'feature/testing' …] | lang=en
- "revision_documental_page": "page.tsx" | kind=code-symbol | source=app/agente_liberaciones/revision-documental/page.tsx:L1 | neighbors=[0068216 Mejora de Dashboard, Login y tr…, 0b210fa Merge pull request #12 from pre…, 1acddac Merge branch 'feature/testing' …, 4400923 Merge branch 'feature/testing' …, 46f24f8 generica function for infractio…, 863c575 Merge pull request #24 from pre…] | lang=en
- "rondin_rondinpageclient": "RondinPageClient.tsx" | kind=code-symbol | source=components/oficial/rondin/RondinPageClient.tsx:L1 | neighbors=[0068216 Mejora de Dashboard, Login y tr…, 435348e corrigiendo flujo de rondin, 863c575 Merge pull request #24 from pre…, f0089cf Merge pull request #21 from pre…, page.tsx, types.ts] | lang=en
- "scripts_trace_utils": "trace-utils.mjs" | kind=code-symbol | source=scripts/trace-utils.mjs:L1 | neighbors=[11ee4f2 mejorando flujo de 911, 22bf125 Merge pull request #20 from pre…, 3c12c41 cambios en flujo de 911-despacho, 863c575 Merge pull request #24 from pre…, trace-client.mjs, trace-components.mjs] | lang=en
- "sin_robos_reportesinrobos": "ReporteSinRobos.tsx" | kind=code-symbol | source=components/reportes/sin_robos/ReporteSinRobos.tsx:L1 | neighbors=[0068216 Mejora de Dashboard, Login y tr…, 156c925 vista de reporte de sin robos, 1acddac Merge branch 'feature/testing' …, 22b7b54 Merge branch 'feature/reportes'…, 552d291 Merge branch 'testing' into con…, 863c575 Merge pull request #24 from pre…] | lang=en
- "stores_usetoaststore": "useToastStore.ts" | kind=code-symbol | source=stores/useToastStore.ts:L1 | neighbors=[0b210fa Merge pull request #12 from pre…, 1acddac Merge branch 'feature/testing' …, 4400923 Merge branch 'feature/testing' …, 5d2b064 fix vercel upload files, 863c575 Merge pull request #24 from pre…, e286619 Merge branch 'feature/testing' …] | lang=en
- "ui_card": "Card.tsx" | kind=code-symbol | source=features/via/infracciones/components/ui/Card.tsx:L1 | neighbors=[23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, 863c575 Merge pull request #24 from pre…, b5233a8 implementando via como modulo d…, f7b1aac Merge branch 'feature/testing' …, page.tsx] | lang=en
- "ui_segmentedcontrol": "SegmentedControl.tsx" | kind=code-symbol | source=features/via/infracciones/components/ui/SegmentedControl.tsx:L1 | neighbors=[0068216 Mejora de Dashboard, Login y tr…, 23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, 863c575 Merge pull request #24 from pre…, b5233a8 implementando via como modulo d…, f7b1aac Merge branch 'feature/testing' …] | lang=en
- "admin_transito_permisos": "permisos.ts" | kind=code-symbol | source=lib/admin-transito/permisos.ts:L1 | neighbors=[Accion, guardarPermiso(), guardarPlantillaSeccion(), obtenerPlantillaRol(), PermisoSeccion, Seccion] | lang=en
- "agente_infracciones_modalentregargarantia": "ModalEntregarGarantia.tsx" | kind=code-symbol | source=components/agente_infracciones/ModalEntregarGarantia.tsx:L1 | neighbors=[InfraccionesDashboard.tsx, actions.ts, liberarGarantiaInfraccionesAction(), obtenerDetalleInfraccionInfracciones(), getGarantiaInfo(), ModalEntregarGarantia()] | lang=en
- "agente_infracciones_page": "page.tsx" | kind=code-symbol | source=app/agente_infracciones/page.tsx:L1 | neighbors=[actions.ts, obtenerDashboardInfracciones(), obtenerInfracciones(), InfraccionesTable.tsx, InfraccionesDashboardPage(), ProfileDropdown.tsx] | lang=en
- "agente_juzgado_cargaroficiosection": "CargarOficioSection.tsx" | kind=code-symbol | source=components/agente_juzgado/CargarOficioSection.tsx:L1 | neighbors=[actions.ts, guardarOficioJuzgadoAction(), Campo(), CargarOficioSection(), CargarOficioSectionProps, FileUpload()] | lang=en
- "agente_liberaciones_liberacionestable": "LiberacionesTable.tsx" | kind=code-symbol | source=components/agente_liberaciones/LiberacionesTable.tsx:L1 | neighbors=[LiberacionesDashboard.tsx, columns, DataRow, LiberacionesTable(), LiberacionesTableProps, page.tsx] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@160d1e176f2d55cc6f7154cf8c7d1f2e2a1841da": "160d1e1 Monitorista V1.1" | kind=Commit | source=git | neighbors=[feature/monitorista-reportes, feature/testing, fix/detenidos, fix/incidentes-camara, fix/subir-fotografias, main] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@2e958e175e1cfb67fcf89a7f977cd6243df8d37a": "2e958e1 catalogo de grupo de incidencia" | kind=Commit | source=git | neighbors=[feature/testing, main, 375d265 flujo de fiscalia, repository.ts, service.ts, types.ts] | lang=nl
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@3b10d723286e7aa7720e192c365c543dbbe70705": "3b10d72 Merge branch 'feature/testing' of https://github.com/presidenciaSJR/seg…" | kind=Commit | source=git | neighbors=[feature/monitorista, feature/monitorista-reportes, fix/detenidos, fix/incidentes-camara, fix/subir-fotografias, 283f342 Merge branch 'feature/testing' …] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@4c9fa8a7d1d3d48ad71f2060e0954247edd23136": "4c9fa8a vista de reporte de d1 no iniciada" | kind=Commit | source=git | neighbors=[feature/testing, main, 0c8695c Cambios en filtros, 5ef7cf3 Agregar los campos faltantes, DescargaFilters.tsx, DescargaPagination.tsx] | lang=nl
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@4d4a9b714485a6d376fdbde62ed20078b2e4aa8f": "4d4a9b7 formulario de notificaciones por radio" | kind=Commit | source=git | neighbors=[feature/monitorista, feature/monitorista-reportes, fix/detenidos, fix/incidentes-camara, fix/subir-fotografias, 95b78c1 cambios de incidentes] | lang=pt
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@56b6577764c8633cb7ff4a2b701c2ac335c45204": "56b6577 FORMULARIO SE ENLAZO A LA TABLA DE DENUNCIAS" | kind=Commit | source=git | neighbors=[formAnalisis.tsx, generarPresentacion.tsx, TablonAnalisis.tsx, feature/testing, main, f7b1aac Merge branch 'feature/testing' …] | lang=es
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@5abc683b075625daff20897a70efe2939d2eddbf": "5abc683 Merge branch 'feature/auxiliar' into feature/testing" | kind=Commit | source=git | neighbors=[25de428 Corrección para agregar el botó…, page.tsx, ProfileDropdownAuxiliar.tsx, feature/testing, fix/detenidos, fix/incidentes-camara] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@6f8a0895ef63c7d0e87e580266dfb6599ff94c5e": "6f8a089 Vista de estadisticos diarios, semanales y mensuales" | kind=Commit | source=git | neighbors=[5bbdda8 Merge pull request #8 from pres…, feature/testing, fix/subir-fotografias, main, 953d38a implementando vista de fiscalia, 98e7e6e vista de reportes de d1] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@810844a51b816f3d6139fbeb68243ec3e09d1fea": "810844a Cambios en la estructura de los incidentes de camara" | kind=Commit | source=git | neighbors=[5ed311a Merge pull request #5 from pres…, feature/testing, fix/incidentes-camara, fix/subir-fotografias, main, 50101e2 Merge pull request #6 from pres…] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@81b982962d7b332ec29c5d3e73301ba0b855d4f0": "81b9829 Cambios para guardado de persinas afectadas" | kind=Commit | source=git | neighbors=[feature/monitorista, feature/monitorista-reportes, fix/detenidos, fix/incidentes-camara, fix/subir-fotografias, 305b0bd se quitan campos] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@8affdb6f48b460ac25d4160374a137ba59f767c8": "8affdb6 componente de paginacion y se implementa en page de wa" | kind=Commit | source=git | neighbors=[86e9319 Merge branch 'feature/testing' …, Pagination.tsx, feature/monitorista, feature/monitorista-reportes, feature/testing, fix/detenidos] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@9d803f2b0cdcbfc7adad98132198efb5848f135e": "9d803f2 fix api maps" | kind=Commit | source=git | neighbors=[feature/testing, main, ec3acf7 iniciando reset de testing, page.tsx, page.tsx, FormularioRecorrido.tsx] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@b233bc7cf4d1935110e3958ea3b735d12a90770f": "b233bc7 Merge branch 'testing' into conexion" | kind=Commit | source=git | neighbors=[8095bdb limpiando .env, 98e7e6e vista de reportes de d1, feature/testing, main, 75e03e9 puliendo flujo de juzgado-liber…, D1Filters.tsx] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@de14b628c597751b2adddaebedd581c41690e8e2": "de14b62 Merge branch 'feature/reportes' into feature/testing" | kind=Commit | source=git | neighbors=[0b210fa Merge pull request #12 from pre…, feature/testing, main, 4400923 Merge branch 'feature/testing' …, route.ts, page.tsx] | lang=nl
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@ecebe385dfbc294570d86c996013af6fadd5d874": "ecebe38 Guardado de longitud y latitud en vista de llamada, corrección de guard…" | kind=Commit | source=git | neighbors=[93dd3ea Merge pull request #1 from pres…, feature/monitorista, feature/monitorista-reportes, fix/detenidos, fix/incidentes-camara, fix/subir-fotografias] | lang=nl
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@f6954ecab5cbc29333e7b5fa272233ed46d15b86": "f6954ec Conexion a la bd y la generacion de Excel" | kind=Commit | source=git | neighbors=[5ef7cf3 Agregar los campos faltantes, feature/testing, main, 07543de Conexion de reportes con d1 y l…, de14b62 Merge branch 'feature/reportes'…, route.ts] | lang=es
- "components_buttonverdetalles": "ButtonVerDetalles.tsx" | kind=code-symbol | source=features/compartido/components/ButtonVerDetalles.tsx:L1 | neighbors=[InfraccionesDashboard.tsx, LiberacionesDashboard.tsx, 06c55f5 Merge branch 'feature/testing' …, 0b210fa Merge pull request #12 from pre…, 1acddac Merge branch 'feature/testing' …, 2dde720 Merge pull request #14 from pre…] | lang=en
- "d1_d1reportstable": "D1ReportsTable.tsx" | kind=code-symbol | source=components/reportes/d1/D1ReportsTable.tsx:L1 | neighbors=[0068216 Mejora de Dashboard, Login y tr…, 07543de Conexion de reportes con d1 y l…, 552d291 Merge branch 'testing' into con…, 863c575 Merge pull request #24 from pre…, 98e7e6e vista de reportes de d1, b233bc7 Merge branch 'testing' into con…] | lang=en
- "d1_noiniciada_descargafilters": "DescargaFilters.tsx" | kind=code-symbol | source=components/reportes/d1_noiniciada/DescargaFilters.tsx:L1 | neighbors=[0c8695c Cambios en filtros, 1acddac Merge branch 'feature/testing' …, 22b7b54 Merge branch 'feature/reportes'…, 4c9fa8a vista de reporte de d1 no inici…, 552d291 Merge branch 'testing' into con…, 712c116 Merge branch 'testing' into con…] | lang=en
- "fiscalia_permisos": "permisos.ts" | kind=code-symbol | source=lib/fiscalia/permisos.ts:L1 | neighbors=[03f8b2a implementado rbac, 046f18c Merge pull request #19 from pre…, 863c575 Merge pull request #24 from pre…, ac9ad49 Merge branch 'feature/testing' …, Accion, guardarPermiso()] | lang=en
- "fiscalia_tabasegurados": "TabAsegurados.tsx" | kind=code-symbol | source=components/fiscalia/TabAsegurados.tsx:L1 | neighbors=[page.tsx, 2db162a flujo de asegurados, 8355ac0 Merge branch 'feature/testing' …, 863c575 Merge pull request #24 from pre…, 9faf222 Merge branch 'feature/testing' …, c471e9c Merge pull request #15 from pre…] | lang=en
- "fiscalia_tomarcasomodal": "TomarCasoModal.tsx" | kind=code-symbol | source=components/fiscalia/TomarCasoModal.tsx:L1 | neighbors=[090c4dd vista de fiscalia, 1f7c0d7 Merge pull request #23 from pre…, 375d265 flujo de fiscalia, 44ebbc4 Merge branch 'feature/testing' …, 7e39526 Mejoras UI/UX, 863c575 Merge pull request #24 from pre…] | lang=en

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/ugomez/Documents/GitHub/seguridad_publica/.graphify/description-instructions/batch-012.json

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
