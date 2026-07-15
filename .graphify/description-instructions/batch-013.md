# Node Description Batch 14 of 93

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
- "expediente_proxy_route": "route.ts" | kind=code-symbol | source=app/api/monitorista/expediente-proxy/route.ts:L1 | neighbors=[126b4d1 Monitorista V1, 44ebbc4 Merge branch 'feature/testing' …, 46b2c89 Merge branch 'testing' into juz…, 75e03e9 puliendo flujo de juzgado-liber…, 863c575 Merge pull request #24 from pre…, da33516 Merge pull request #3 from pres…] | lang=en
- "fiscalia_tabasegurados": "TabAsegurados.tsx" | kind=code-symbol | source=components/fiscalia/TabAsegurados.tsx:L1 | neighbors=[page.tsx, 2db162a flujo de asegurados, 8355ac0 Merge branch 'feature/testing' …, 863c575 Merge pull request #24 from pre…, 9faf222 Merge branch 'feature/testing' …, c471e9c Merge pull request #15 from pre…] | lang=en
- "fiscalia_tomarcasomodal": "TomarCasoModal.tsx" | kind=code-symbol | source=components/fiscalia/TomarCasoModal.tsx:L1 | neighbors=[090c4dd vista de fiscalia, 1f7c0d7 Merge pull request #23 from pre…, 375d265 flujo de fiscalia, 44ebbc4 Merge branch 'feature/testing' …, 7e39526 Mejoras UI/UX, 863c575 Merge pull request #24 from pre…] | lang=en
- "incidentes_filtrosincidencias": "FiltrosIncidencias.tsx" | kind=code-symbol | source=components/reportes/incidentes/FiltrosIncidencias.tsx:L1 | neighbors=[0068216 Mejora de Dashboard, Login y tr…, 13f7f39 Reporte-incidentes, 2fcba7b vista de reportes de incidentes…, 552d291 Merge branch 'testing' into con…, 719b5ab cambio para generacion de repor…, 863c575 Merge pull request #24 from pre…] | lang=en
- "incidentes_mapper_tostr": "toStr()" | kind=code-symbol | source=lib/incidentes/mapper.ts:L20 | neighbors=[mapper.ts, rowToAlarmaEscolar(), rowToDespacho(), rowToDespachoElemento(), rowToDespachoUnidad(), rowToExtorsion()] | lang=en
- "legalidad_service": "service.ts" | kind=code-symbol | source=features/via/legalidad/service.ts:L1 | neighbors=[23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, 863c575 Merge pull request #24 from pre…, b5233a8 implementando via como modulo d…, f7b1aac Merge branch 'feature/testing' …, actions.ts] | lang=en
- "lib_detenidos_compartido": "detenidos-compartido.ts" | kind=code-symbol | source=lib/detenidos-compartido.ts:L1 | neighbors=[388b997 Apartados para subir fotografia…, 672bab5 libearciones para juzgado, 863c575 Merge pull request #24 from pre…, de5682f Merge pull request #10 from pre…, page.tsx, page.tsx] | lang=en
- "manual_migrations_0007_formato_n_split": "0007_formato_n_split.sql" | kind=code-symbol | source=lib/db/manual-migrations/0007_formato_n_split.sql:L1 | neighbors=[06c55f5 Merge branch 'feature/testing' …, 41ea169 Merge branch 'testing' into con…, 8355ac0 Merge branch 'feature/testing' …, 863c575 Merge pull request #24 from pre…, bb10dcd Formatos V1, c95f412 Merge branch 'feature/testing' …] | lang=en
- "modulo_incidentes_styles": "styles.ts" | kind=code-symbol | source=components/reportes/modulo_incidentes/styles.ts:L1 | neighbors=[0068216 Mejora de Dashboard, Login y tr…, 863c575 Merge pull request #24 from pre…, b170599 Merge branch 'feature/testing' …, bd1a223 Merge branch 'feature/vistas-re…, bf2e7ed Reportes del modulo de incident…, page.tsx] | lang=en
- "monitorista_accionesdetenido": "AccionesDetenido.tsx" | kind=code-symbol | source=components/monitorista/AccionesDetenido.tsx:L1 | neighbors=[0068216 Mejora de Dashboard, Login y tr…, 27dcb21 Merge branch 'feature/testing' …, 5618308 guardado e evidencias con ed, 5d179c0 Apartado de reportes, 5f13b34 Merge branch 'feature/testing' …, 77ddf58 Merge branch 'feature/testing' …] | lang=en
- "monitorista_repository_inserthistorial": "insertHistorial()" | kind=code-symbol | source=lib/monitorista/repository.ts:L91 | neighbors=[route.ts, route.ts, route.ts, route.ts, route.ts, route.ts] | lang=en
- "oficial_despachocontent": "DespachoContent.tsx" | kind=code-symbol | source=components/oficial/DespachoContent.tsx:L1 | neighbors=[0068216 Mejora de Dashboard, Login y tr…, 2233342 Fix/MarcarEnSitio, 863c575 Merge pull request #24 from pre…, page.tsx, HistorialIncidente.tsx, HistorialIncidente()] | lang=en
- "oficial_modalseleccionarunidad": "ModalSeleccionarUnidad.tsx" | kind=code-symbol | source=components/oficial/ModalSeleccionarUnidad.tsx:L1 | neighbors=[0068216 Mejora de Dashboard, Login y tr…, 16a63d4 Merge branch 'feature/testing' …, 863c575 Merge pull request #24 from pre…, ac48eb1 Merge pull request #17 from pre…, c27a9ee fase prefinal, dc063f3 gestion de oficiales correctame…] | lang=en
- "oficial_permisos": "permisos.ts" | kind=code-symbol | source=lib/oficial/permisos.ts:L1 | neighbors=[03f8b2a implementado rbac, 046f18c Merge pull request #19 from pre…, 863c575 Merge pull request #24 from pre…, ac9ad49 Merge branch 'feature/testing' …, Accion, guardarPermiso()] | lang=en
- "oficial_toastexito": "ToastExito.tsx" | kind=code-symbol | source=components/oficial/ToastExito.tsx:L1 | neighbors=[page.tsx, 435348e corrigiendo flujo de rondin, 44ebbc4 Merge branch 'feature/testing' …, 458bbfb registro de reporte de campo - …, 863c575 Merge pull request #24 from pre…, 93dd3ea Merge pull request #1 from pres…] | lang=en
- "oficial_unidadasignadasection": "UnidadAsignadaSection.tsx" | kind=code-symbol | source=components/oficial/UnidadAsignadaSection.tsx:L1 | neighbors=[0068216 Mejora de Dashboard, Login y tr…, 16a63d4 Merge branch 'feature/testing' …, 863c575 Merge pull request #24 from pre…, ac48eb1 Merge pull request #17 from pre…, c27a9ee fase prefinal, dc063f3 gestion de oficiales correctame…] | lang=en
- "oficiales_mapper": "mapper.ts" | kind=code-symbol | source=features/via/oficiales/mapper.ts:L1 | neighbors=[067c4de arreglando flujo de fiscalia  a…, 16a63d4 Merge branch 'feature/testing' …, 23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, 863c575 Merge pull request #24 from pre…, ac48eb1 Merge pull request #17 from pre…] | lang=en
- "prevencion_contestacionform": "ContestacionForm.tsx" | kind=code-symbol | source=components/prevencion/ContestacionForm.tsx:L1 | neighbors=[0068216 Mejora de Dashboard, Login y tr…, 5558751 feat: módulo Prevención del Del…, 5618308 guardado e evidencias con ed, 8355ac0 Merge branch 'feature/testing' …, 863c575 Merge pull request #24 from pre…, 9faf222 Merge branch 'feature/testing' …] | lang=en
- "prevencion_permisos_verificaraccesoprevencionapi": "verificarAccesoPrevencionApi()" | kind=code-symbol | source=lib/prevencion/permisos.ts:L33 | neighbors=[route.ts, route.ts, route.ts, route.ts, route.ts, route.ts] | lang=en
- "reportes_permisos_verificaraccesoformatonapi": "verificarAccesoFormatoNApi()" | kind=code-symbol | source=lib/reportes/permisos.ts:L29 | neighbors=[route.ts, route.ts, route.ts, route.ts, route.ts, route.ts] | lang=en
- "sasiete_service": "service.ts" | kind=code-symbol | source=features/via/saSiete/service.ts:L1 | neighbors=[23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, 863c575 Merge pull request #24 from pre…, b5233a8 implementando via como modulo d…, f7b1aac Merge branch 'feature/testing' …, mapper.ts] | lang=en
- "shared_abrirdocumento": "abrirDocumento.ts" | kind=code-symbol | source=lib/shared/abrirDocumento.ts:L1 | neighbors=[DetallesAseguradoView.tsx, 5f13b34 Merge branch 'feature/testing' …, 75e03e9 puliendo flujo de juzgado-liber…, 863c575 Merge pull request #24 from pre…, 92393e7 flujo completado de juzgado, a7218bd Merge pull request #4 from pres…] | lang=en
- "steps_pasociudadanoconductor": "PasoCiudadanoConductor.tsx" | kind=code-symbol | source=features/via/infracciones/components/steps/PasoCiudadanoConductor.tsx:L1 | neighbors=[23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, 863c575 Merge pull request #24 from pre…, b5233a8 implementando via como modulo d…, f7b1aac Merge branch 'feature/testing' …, FormularioInfraccion.tsx] | lang=en
- "steps_procesomodal": "ProcesoModal.tsx" | kind=code-symbol | source=features/via/infracciones/components/steps/ProcesoModal.tsx:L1 | neighbors=[23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, 863c575 Merge pull request #24 from pre…, b5233a8 implementando via como modulo d…, f7b1aac Merge branch 'feature/testing' …, FormularioInfraccion.tsx] | lang=en
- "types_detalleinfraccion": "detalleInfraccion.ts" | kind=code-symbol | source=features/via/compartido/types/detalleInfraccion.ts:L1 | neighbors=[16a63d4 Merge branch 'feature/testing' …, 863c575 Merge pull request #24 from pre…, 91c36bf validando orden de pago, ac48eb1 Merge pull request #17 from pre…, CapturarDatosTitularSection.tsx, ModalEntregarGarantia.tsx] | lang=en
- "ui_cardtitle": "CardTitle.tsx" | kind=code-symbol | source=features/via/infracciones/components/ui/CardTitle.tsx:L1 | neighbors=[23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, 863c575 Merge pull request #24 from pre…, b5233a8 implementando via como modulo d…, f7b1aac Merge branch 'feature/testing' …, PasoCiudadano.tsx] | lang=en
- "911_mapper": "mapper.ts" | kind=code-symbol | source=lib/911/mapper.ts:L1 | neighbors=[rowToCatalogo(), rowToIncidenteDetalle(), rowToIncidenteResumen(), toNum(), toStr(), types.ts] | lang=en

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/ugomez/Documents/GitHub/seguridad_publica/.graphify/description-instructions/batch-013.json

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
