# Node Description Batch 12 of 89

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

- "commit:repo:github.com/presidenciaSJR/seguridad_publica@28da720c3833ea537d1a6973a50bd1f6f59ecf8f": "28da720 Cambio de colores en dashboard y loader (correccion de imagen)" | kind=Commit | source=git | neighbors=[160d1e1 Monitorista V1.1, feature/monitorista-reportes, feature/testing, fix/detenidos, fix/incidentes-camara, fix/subir-fotografias] | lang=nl
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@356d3a716d77e5bea2179a3cef18969daacd64dc": "356d3a7 Subir rol agregado, falta darle mejor vista" | kind=Commit | source=git | neighbors=[page.tsx, feature/monitorista, feature/monitorista-reportes, feature/testing, fix/detenidos, fix/incidentes-camara] | lang=pt
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@3b10d723286e7aa7720e192c365c543dbbe70705": "3b10d72 Merge branch 'feature/testing' of https://github.com/presidenciaSJR/seg…" | kind=Commit | source=git | neighbors=[feature/monitorista, feature/monitorista-reportes, fix/detenidos, fix/incidentes-camara, fix/subir-fotografias, 283f342 Merge branch 'feature/testing' …] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@4d4a9b714485a6d376fdbde62ed20078b2e4aa8f": "4d4a9b7 formulario de notificaciones por radio" | kind=Commit | source=git | neighbors=[feature/monitorista, feature/monitorista-reportes, fix/detenidos, fix/incidentes-camara, fix/subir-fotografias, 95b78c1 cambios de incidentes] | lang=pt
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@81b982962d7b332ec29c5d3e73301ba0b855d4f0": "81b9829 Cambios para guardado de persinas afectadas" | kind=Commit | source=git | neighbors=[feature/monitorista, feature/monitorista-reportes, feature/testing, fix/detenidos, fix/incidentes-camara, fix/subir-fotografias] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@98e7e6eb5f17a46e7f4c211ed1ddbac02e91c1f6": "98e7e6e vista de reportes de d1" | kind=Commit | source=git | neighbors=[6f8a089 Vista de estadisticos diarios, …, feature/testing, fix/subir-fotografias, 75ca4b2 Merge pull request #9 from pres…, b233bc7 Merge branch 'testing' into con…, D1Filters.tsx] | lang=nl
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@a6b7556e4d852eb3271e60ee87a5cc2814f2c870": "a6b7556 Formulario se puso a prueba, se prellena con datos de denuncia, campo e…" | kind=Commit | source=git | neighbors=[3249f00 Cambios en rellenado de ppt!, page.tsx, TablonAnalisis.tsx, feature/testing, a2e0623 Consolidado de formatos N y Sub…, ac48eb1 Merge pull request #17 from pre…] | lang=es
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@ecebe385dfbc294570d86c996013af6fadd5d874": "ecebe38 Guardado de longitud y latitud en vista de llamada, corrección de guard…" | kind=Commit | source=git | neighbors=[93dd3ea Merge pull request #1 from pres…, feature/monitorista, feature/monitorista-reportes, feature/testing, fix/detenidos, fix/incidentes-camara] | lang=nl
- "corralon_permisos": "permisos.ts" | kind=code-symbol | source=lib/corralon/permisos.ts:L1 | neighbors=[5a1b5d5 empezando corralon, Accion, guardarPermiso(), guardarPlantillaSeccion(), obtenerPermisosUsuario(), obtenerPlantillaRol()] | lang=en
- "corralon_service": "service.ts" | kind=code-symbol | source=lib/corralon/service.ts:L1 | neighbors=[16df128 flujo de corralones listo, 5a1b5d5 empezando corralon, c27a9ee fase prefinal, actions.ts, mapper.ts, rowToSolicitud()] | lang=en
- "incidentes_mapper_tostr": "toStr()" | kind=code-symbol | source=lib/incidentes/mapper.ts:L20 | neighbors=[mapper.ts, rowToAlarmaEscolar(), rowToDespacho(), rowToDespachoElemento(), rowToDespachoUnidad(), rowToExtorsion()] | lang=en
- "infracciones_mapper": "mapper.ts" | kind=code-symbol | source=features/via/infracciones/mapper.ts:L1 | neighbors=[16a63d4 Merge branch 'feature/testing' …, 1dbd480 flujo de liberaciones completado, 23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, ac48eb1 Merge pull request #17 from pre…, b5233a8 implementando via como modulo d…] | lang=en
- "maps_googlemappicker": "GoogleMapPicker.tsx" | kind=code-symbol | source=components/maps/GoogleMapPicker.tsx:L1 | neighbors=[FormularioAseguradoJuzgado.tsx, formAnalisis.tsx, generarPresentacion.tsx, 2ca9f50 Formulario sin backend, 2db162a flujo de asegurados, 8355ac0 Merge branch 'feature/testing' …] | lang=en
- "monitorista_batchenviofotos": "BatchEnvioFotos.tsx" | kind=code-symbol | source=components/monitorista/BatchEnvioFotos.tsx:L1 | neighbors=[27dcb21 Merge branch 'feature/testing' …, 5618308 guardado e evidencias con ed, 5d179c0 Apartado de reportes, 5f13b34 Merge branch 'feature/testing' …, 77ddf58 Merge branch 'feature/testing' …, 8e6c8c6 Apartado de reportes] | lang=en
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
- "scripts_trace_utils": "trace-utils.mjs" | kind=code-symbol | source=scripts/trace-utils.mjs:L1 | neighbors=[11ee4f2 mejorando flujo de 911, 22bf125 Merge pull request #20 from pre…, 3c12c41 cambios en flujo de 911-despacho, trace-client.mjs, trace-components.mjs, trace-server.mjs] | lang=en
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
