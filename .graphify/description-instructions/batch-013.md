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

- "generar_orden_pago_route": "route.ts" | kind=code-symbol | source=app/api/via/sa7/generar-orden-pago/route.ts:L1 | neighbors=[16a63d4 Merge branch 'feature/testing' …, 23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, 863c575 Merge pull request #24 from pre…, 91c36bf validando orden de pago, ac48eb1 Merge pull request #17 from pre…] | lang=en
- "incidentes_filtrosincidencias": "FiltrosIncidencias.tsx" | kind=code-symbol | source=components/reportes/incidentes/FiltrosIncidencias.tsx:L1 | neighbors=[0068216 Mejora de Dashboard, Login y tr…, 13f7f39 Reporte-incidentes, 2fcba7b vista de reportes de incidentes…, 552d291 Merge branch 'testing' into con…, 719b5ab cambio para generacion de repor…, 863c575 Merge pull request #24 from pre…] | lang=en
- "incidentes_mapper_tostr": "toStr()" | kind=code-symbol | source=lib/incidentes/mapper.ts:L20 | neighbors=[mapper.ts, rowToAlarmaEscolar(), rowToDespacho(), rowToDespachoElemento(), rowToDespachoUnidad(), rowToExtorsion()] | lang=en
- "legalidad_service": "service.ts" | kind=code-symbol | source=features/via/legalidad/service.ts:L1 | neighbors=[23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, 863c575 Merge pull request #24 from pre…, b5233a8 implementando via como modulo d…, f7b1aac Merge branch 'feature/testing' …, actions.ts] | lang=en
- "lib_detenidos_compartido": "detenidos-compartido.ts" | kind=code-symbol | source=lib/detenidos-compartido.ts:L1 | neighbors=[388b997 Apartados para subir fotografia…, 672bab5 libearciones para juzgado, 863c575 Merge pull request #24 from pre…, de5682f Merge pull request #10 from pre…, page.tsx, page.tsx] | lang=en
- "liberar_garantia_route": "route.ts" | kind=code-symbol | source=app/api/via/infracciones/liberar-garantia/route.ts:L1 | neighbors=[16a63d4 Merge branch 'feature/testing' …, 863c575 Merge pull request #24 from pre…, 91c36bf validando orden de pago, ac48eb1 Merge pull request #17 from pre…, ad3ec5f mejorando esto, ede5a1d eliminado referencias a via_pru…] | lang=en
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
- "proxy_route": "route.ts" | kind=code-symbol | source=app/api/expediente/proxy/route.ts:L1 | neighbors=[16a63d4 Merge branch 'feature/testing' …, 1dbd480 flujo de liberaciones completado, 5d179c0 Apartado de reportes, 5f13b34 Merge branch 'feature/testing' …, 75e03e9 puliendo flujo de juzgado-liber…, 863c575 Merge pull request #24 from pre…] | lang=en
- "reportes_permisos_tieneaccesoformaton": "tieneAccesoFormatoN()" | kind=code-symbol | source=lib/reportes/permisos.ts:L25 | neighbors=[page.tsx, page.tsx, page.tsx, route.ts, page.tsx, page.tsx] | lang=en
- "reportes_permisos_verificaraccesoformatonapi": "verificarAccesoFormatoNApi()" | kind=code-symbol | source=lib/reportes/permisos.ts:L29 | neighbors=[route.ts, route.ts, route.ts, route.ts, route.ts, route.ts] | lang=en
- "sasiete_service": "service.ts" | kind=code-symbol | source=features/via/saSiete/service.ts:L1 | neighbors=[23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, 863c575 Merge pull request #24 from pre…, b5233a8 implementando via como modulo d…, f7b1aac Merge branch 'feature/testing' …, mapper.ts] | lang=en
- "shared_abrirdocumento": "abrirDocumento.ts" | kind=code-symbol | source=lib/shared/abrirDocumento.ts:L1 | neighbors=[DetallesAseguradoView.tsx, 5f13b34 Merge branch 'feature/testing' …, 75e03e9 puliendo flujo de juzgado-liber…, 863c575 Merge pull request #24 from pre…, 92393e7 flujo completado de juzgado, a7218bd Merge pull request #4 from pres…] | lang=en
- "steps_pasociudadanoconductor": "PasoCiudadanoConductor.tsx" | kind=code-symbol | source=features/via/infracciones/components/steps/PasoCiudadanoConductor.tsx:L1 | neighbors=[23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, 863c575 Merge pull request #24 from pre…, b5233a8 implementando via como modulo d…, f7b1aac Merge branch 'feature/testing' …, FormularioInfraccion.tsx] | lang=en
- "steps_procesomodal": "ProcesoModal.tsx" | kind=code-symbol | source=features/via/infracciones/components/steps/ProcesoModal.tsx:L1 | neighbors=[23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, 863c575 Merge pull request #24 from pre…, b5233a8 implementando via como modulo d…, f7b1aac Merge branch 'feature/testing' …, FormularioInfraccion.tsx] | lang=en
- "types_detalleinfraccion": "detalleInfraccion.ts" | kind=code-symbol | source=features/via/compartido/types/detalleInfraccion.ts:L1 | neighbors=[16a63d4 Merge branch 'feature/testing' …, 863c575 Merge pull request #24 from pre…, 91c36bf validando orden de pago, ac48eb1 Merge pull request #17 from pre…, CapturarDatosTitularSection.tsx, ModalEntregarGarantia.tsx] | lang=en
- "ui_cardtitle": "CardTitle.tsx" | kind=code-symbol | source=features/via/infracciones/components/ui/CardTitle.tsx:L1 | neighbors=[23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, 863c575 Merge pull request #24 from pre…, b5233a8 implementando via como modulo d…, f7b1aac Merge branch 'feature/testing' …, PasoCiudadano.tsx] | lang=en
- "911_mapper": "mapper.ts" | kind=code-symbol | source=lib/911/mapper.ts:L1 | neighbors=[rowToCatalogo(), rowToIncidenteDetalle(), rowToIncidenteResumen(), toNum(), toStr(), types.ts] | lang=en
- "admin_transito_patrullaselector": "PatrullaSelector.tsx" | kind=code-symbol | source=components/admin-transito/PatrullaSelector.tsx:L1 | neighbors=[NuevoOficialForm.tsx, PatrullaSelector(), Props, types.ts, PatrullaAsignacion, 0068216 Mejora de Dashboard, Login y tr…] | lang=en
- "agente_liberaciones_profiledropdown": "ProfileDropdown.tsx" | kind=code-symbol | source=components/agente_liberaciones/ProfileDropdown.tsx:L1 | neighbors=[page.tsx, ProfileDropdown(), Props, auth-client.ts, authClient, 0b210fa Merge pull request #12 from pre…] | lang=en
- "auxiliar_mapper": "mapper.ts" | kind=code-symbol | source=lib/auxiliar/mapper.ts:L1 | neighbors=[rowToChecklist(), rowToCuestionarioRobo(), rowToParReporte(), toStr(), types.ts, AuxChecklist] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@1e81ec820432148abb04683b00b2f357e5385177": "1e81ec8 Datos se autorellenan de denuncias y seccion de oficial" | kind=Commit | source=git | neighbors=[formAnalisis.tsx, TablonAnalisis.tsx, feature/testing, main, 77ddf58 Merge branch 'feature/testing' …, FormularioD1.tsx] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@2fcba7bd260cba70d92594ca197b78326d4b5de5": "2fcba7b vista de reportes de incidentes diarios y semanales" | kind=Commit | source=git | neighbors=[feature/testing, main, 719b5ab cambio para generacion de repor…, FiltrosIncidencias.tsx, Paginacion.tsx, StatIncidencia.tsx] | lang=nl
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@3a00521b6d46834af2e8ddc660cff4a5f58bd349": "3a00521 Merge branch 'feature/testing' of https://github.com/presidenciaSJR/seg…" | kind=Commit | source=git | neighbors=[283f342 Merge branch 'feature/testing' …, 2be4ca9 Cambio en header, feature/monitorista, feature/monitorista-reportes, fix/detenidos, fix/incidentes-camara] | lang=pt
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@3b0e087f1fdd0285db9176c6679877af2b06aced": "3b0e087 NAVEGACION" | kind=Commit | source=git | neighbors=[133bb9d pages de listado de llamadas y …, feature/monitorista, feature/monitorista-reportes, feature/testing, fix/detenidos, fix/incidentes-camara] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@50101e2d3282e026715fc114d37ac180b4685370": "50101e2 Merge pull request #6 from presidenciaSJR/fix/incidentes-camara" | kind=Commit | source=git | neighbors=[feature/testing, fix/subir-fotografias, main, caef6e8 Merge pull request #7 from pres…, page.tsx, route.ts] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@519716a61975d62ddcb9d3d0a1cfdaa3911e5a13": "519716a Formulario para registro de whatsapp" | kind=Commit | source=git | neighbors=[3a00521 Merge branch 'feature/testing' …, feature/monitorista, feature/monitorista-reportes, fix/detenidos, fix/incidentes-camara, fix/subir-fotografias] | lang=pt
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@56a8ec4f997e4351cd0c4c3e3a4b33fe4427c175": "56a8ec4 Impkementacion de pa ay guardado de numero exterior e interior en bd, r…" | kind=Commit | source=git | neighbors=[feature/monitorista, feature/monitorista-reportes, fix/detenidos, fix/incidentes-camara, fix/subir-fotografias, 83f48a2 Merge branch 'feature/correccio…] | lang=nl
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@5aa5866f2596cb59e4321a860046e68b808e7e64": "5aa5866 Cambio de colores en interfaz de login" | kind=Commit | source=git | neighbors=[layout.tsx, feature/testing, fix/detenidos, fix/incidentes-camara, fix/subir-fotografias, main] | lang=nl
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@5d09f3148a5d50435e0b5ff477e1988edeac2a4f": "5d09f31 integración de componente de paginacion para vista de listado de rondin…" | kind=Commit | source=git | neighbors=[feature/monitorista, feature/monitorista-reportes, feature/testing, fix/detenidos, fix/incidentes-camara, fix/subir-fotografias] | lang=nl

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
