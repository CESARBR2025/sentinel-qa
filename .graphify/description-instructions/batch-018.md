# Node Description Batch 19 of 93

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

- "services_analisisservice": "analisisService.ts" | kind=code-symbol | source=services/analisisService.ts:L1 | neighbors=[formAnalisis.tsx, generarPresentacion.tsx, TablonAnalisis.tsx, 06c55f5 Merge branch 'feature/testing' …, 3249f00 Cambios en rellenado de ppt!, 41ea169 Merge branch 'testing' into con…] | lang=en
- "shared_direcciongooglemaps": "DireccionGoogleMaps.tsx" | kind=code-symbol | source=components/shared/DireccionGoogleMaps.tsx:L1 | neighbors=[CapturarDetallesForm.tsx, 5f13b34 Merge branch 'feature/testing' …, 863c575 Merge pull request #24 from pre…, 92393e7 flujo completado de juzgado, a7218bd Merge pull request #4 from pres…, ce84893 Merge branch 'feature/testing' …] | lang=en
- "steps_pasoevidencias": "PasoEvidencias.tsx" | kind=code-symbol | source=features/via/infracciones/components/steps/PasoEvidencias.tsx:L1 | neighbors=[23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, 863c575 Merge pull request #24 from pre…, b5233a8 implementando via como modulo d…, f7b1aac Merge branch 'feature/testing' …, PasoEvidencias()] | lang=en
- "token_route": "route.ts" | kind=code-symbol | source=app/api/via/exp-digital/token/route.ts:L1 | neighbors=[23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, 5618308 guardado e evidencias con ed, 863c575 Merge pull request #24 from pre…, f7b1aac Merge branch 'feature/testing' …, auth.ts] | lang=en
- "ui_fieldlabel": "FieldLabel.tsx" | kind=code-symbol | source=features/via/infracciones/components/ui/FieldLabel.tsx:L1 | neighbors=[23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, 863c575 Merge pull request #24 from pre…, b5233a8 implementando via como modulo d…, f7b1aac Merge branch 'feature/testing' …, PasoConductor.tsx] | lang=en
- "ui_toast_toast": "Toast()" | kind=code-symbol | source=components/ui/Toast.tsx:L8 | neighbors=[AccionesDetenido.tsx, BandejaSolicitudes.tsx, BatchEnvioFotos.tsx, BotonSubirDenuncia.tsx, CardEnvioFoto.tsx, EditarCampoDetenido.tsx] | lang=en
- "911_types": "types.ts" | kind=code-symbol | source=lib/911/types.ts:L1 | neighbors=[mapper.ts, repository.ts, service.ts, CatalogoItem, IncidenteDetalle, IncidenteResumen] | lang=en
- "admin_mapper": "mapper.ts" | kind=code-symbol | source=lib/admin/mapper.ts:L1 | neighbors=[rowToRol(), rowToUsuarioLista(), toStr(), types.ts, RolItem, UsuarioLista] | lang=en
- "admin_transito_modaldestituiroficial": "ModalDestituirOficial.tsx" | kind=code-symbol | source=components/admin-transito/ModalDestituirOficial.tsx:L1 | neighbors=[actions.ts, destituirOficial(), ModalDestituirOficial(), Props, OficialesTable.tsx, 16a63d4 Merge branch 'feature/testing' …] | lang=en
- "admin_transito_types": "types.ts" | kind=code-symbol | source=lib/admin-transito/types.ts:L1 | neighbors=[mapper.ts, repository.ts, Departamento, OficialLista, UserBasico, UserWithRole] | lang=en
- "agente_juzgado_juzgadotable": "JuzgadoTable.tsx" | kind=code-symbol | source=components/agente_juzgado/JuzgadoTable.tsx:L1 | neighbors=[JuzgadoDashboard.tsx, columns, DataRow, JuzgadoTable(), JuzgadoTableProps, 75e03e9 puliendo flujo de juzgado-liber…] | lang=en
- "agente_juzgado_tomarcasomodal": "TomarCasoModal.tsx" | kind=code-symbol | source=components/agente_juzgado/TomarCasoModal.tsx:L1 | neighbors=[TabSolicitudes.tsx, actions.ts, accionTomarCaso(), TomarCasoBoton(), 5f13b34 Merge branch 'feature/testing' …, 821abe0 replicando flujo de fiscalia-> …] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@3249f00a89bf30e764b252bba8f76757f1664431": "3249f00 Cambios en rellenado de ppt!" | kind=Commit | source=git | neighbors=[feature/testing, main, a6b7556 Formulario se puso a prueba, se…, route.ts, route.ts, analisisService.ts] | lang=nl
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@4271f370e6dcbe157f84bf08a7a3c865913fbd5a": "4271f37 feat(doc): agregar manual de usuario interactivo para el módulo de prev…" | kind=Commit | source=git | neighbors=[feature/monitorista-reportes, fix/detenidos, fix/incidentes-camara, fix/subir-fotografias, 199ce68 Merge branch 'main' of https://…, d3e6d95 Update SeguimientoTimeline.tsx] | lang=es
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@719b5ab1f902dba3e45bcca96bba340e0fe239fd": "719b5ab cambio para generacion de reportes semanal y diario" | kind=Commit | source=git | neighbors=[2fcba7b vista de reportes de incidentes…, feature/testing, main, 18f5bac llamada en card, FiltrosIncidencias.tsx, TablaIncidentes.tsx] | lang=es
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@756e1c69242082798814cb770b0d311a2ea25102": "756e1c6 Update page.tsx" | kind=Commit | source=git | neighbors=[feature/monitorista, feature/monitorista-reportes, fix/detenidos, fix/incidentes-camara, fix/subir-fotografias, a24949a Merge branch 'feature/testing' …] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@8095bdb5f3467c591748704c81330d9502a66535": "8095bdb limpiando .env" | kind=Commit | source=git | neighbors=[feature/testing, fix/subir-fotografias, main, 75ca4b2 Merge pull request #9 from pres…, b233bc7 Merge branch 'testing' into con…, expediente.ts] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@a667064799f60e8647a86af738414eab28726079": "a667064 Page de seleccion de registro" | kind=Commit | source=git | neighbors=[ModuleCard.tsx, feature/monitorista, feature/monitorista-reportes, fix/detenidos, fix/incidentes-camara, fix/subir-fotografias] | lang=nl
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@adf0c3d126c5fd3d93b18615951fdf522e3b70ff": "adf0c3d vista de busqueda y juridico" | kind=Commit | source=git | neighbors=[3800cab formulario de nueva medida de p…, feature/testing, main, page.tsx, baae82f diseño de medidas de proteccion, bb10dcd Formatos V1] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@baae82f65f206f5ecab6b05963b359866b11ffee": "baae82f diseño de medidas de proteccion" | kind=Commit | source=git | neighbors=[adf0c3d vista de busqueda y juridico, feature/testing, main, c95f412 Merge branch 'feature/testing' …, page.tsx, AgregarAutoridadForm.tsx] | lang=nl
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@c1ed4c3ec30f62f4a96e9c4c0eaa5a200909aa3f": "c1ed4c3 cambios en busquedas" | kind=Commit | source=git | neighbors=[feature/testing, main, 41ea169 Merge branch 'testing' into con…, c471e9c Merge pull request #15 from pre…, page.tsx, page.tsx] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@cd4b9bb2c3db63fa3e047fac808109a397e2832a": "cd4b9bb Carpeta creada" | kind=Commit | source=git | neighbors=[feature/monitorista, feature/monitorista-reportes, fix/detenidos, fix/incidentes-camara, fix/subir-fotografias, b68a2b7 Merge branch 'feature/testing' …] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@eacfdaf17cb7ed00add221d47a22bdb792e4b5da": "eacfdaf mostrando toast de guardado" | kind=Commit | source=git | neighbors=[0d9172a mejorando flujo de 911-despacho, layout.tsx, feature/testing, main, Formulario911.tsx, ac5d42f cerrando flujo de 911-despacho-] | lang=nl
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@f4cf76c53a7cc8d073988078f25cb8ba923bd75e": "f4cf76c Actualización Rondin" | kind=Commit | source=git | neighbors=[22bf125 Merge pull request #20 from pre…, feature/testing, main, 09a02d5 Fix Reporte Rondin, DespachoForm.tsx, TablonDespacho.tsx] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@f5e51e19ca573d2bdd82c5573a174925f0bf88d1": "f5e51e1 card de 911 en vista de dashboard" | kind=Commit | source=git | neighbors=[756e1c6 Update page.tsx, feature/monitorista, feature/monitorista-reportes, fix/detenidos, fix/incidentes-camara, fix/subir-fotografias] | lang=nl
- "components_mapsectionciudadano": "MapSectionCiudadano.tsx" | kind=code-symbol | source=features/via/infracciones/components/MapSectionCiudadano.tsx:L1 | neighbors=[16a63d4 Merge branch 'feature/testing' …, 863c575 Merge pull request #24 from pre…, 91c36bf validando orden de pago, a21f03f fix bugs reporte denuncia, ac48eb1 Merge pull request #17 from pre…, containerStyle] | lang=en
- "d1_mapper": "mapper.ts" | kind=code-symbol | source=lib/d1/mapper.ts:L1 | neighbors=[863c575 Merge pull request #24 from pre…, ad3ec5f mejorando esto, rowToReporteD1(), toBool(), toNum(), toStr()] | lang=en
- "d1_noiniciada_descargapagination": "DescargaPagination.tsx" | kind=code-symbol | source=components/reportes/d1_noiniciada/DescargaPagination.tsx:L1 | neighbors=[4c9fa8a vista de reporte de d1 no inici…, 712c116 Merge branch 'testing' into con…, 863c575 Merge pull request #24 from pre…, e286619 Merge branch 'feature/testing' …, DescargaPagination(), PaginationProps] | lang=en
- "d1_styles": "styles.ts" | kind=code-symbol | source=components/reportes/d1/styles.ts:L1 | neighbors=[0068216 Mejora de Dashboard, Login y tr…, 863c575 Merge pull request #24 from pre…, 98e7e6e vista de reportes de d1, b233bc7 Merge branch 'testing' into con…, D1Filters.tsx, D1Pagination.tsx] | lang=en
- "deteccion_camara_reportstat": "ReportStat.tsx" | kind=code-symbol | source=components/reportes/deteccion_camara/ReportStat.tsx:L1 | neighbors=[0068216 Mejora de Dashboard, Login y tr…, 863c575 Merge pull request #24 from pre…, b170599 Merge branch 'feature/testing' …, b403f89 Vista para reportes de incident…, bd1a223 Merge branch 'feature/vistas-re…, ReportStat()] | lang=en
- "estadisticos_reportfilters": "ReportFilters.tsx" | kind=code-symbol | source=components/reportes/estadisticos/ReportFilters.tsx:L1 | neighbors=[0068216 Mejora de Dashboard, Login y tr…, 07543de Conexion de reportes con d1 y l…, 552d291 Merge branch 'testing' into con…, 863c575 Merge pull request #24 from pre…, e286619 Merge branch 'feature/testing' …, page.tsx] | lang=en
- "fiscalia_fotosexpedientesection": "FotosExpedienteSection.tsx" | kind=code-symbol | source=components/fiscalia/FotosExpedienteSection.tsx:L1 | neighbors=[1f7c0d7 Merge pull request #23 from pre…, 375d265 flujo de fiscalia, 7e39526 Mejoras UI/UX, 863c575 Merge pull request #24 from pre…, compressImage(), FotoRow] | lang=en
- "fiscalia_types_aseguradorow": "AseguradoRow" | kind=code-symbol | source=lib/fiscalia/types.ts:L28 | neighbors=[actions.ts, repository.ts, service.ts, actions.ts, mapper.ts, repository.ts] | lang=en
- "fiscalia_usetoaststore": "useToastStore.ts" | kind=code-symbol | source=lib/fiscalia/useToastStore.ts:L1 | neighbors=[5bbdda8 Merge pull request #8 from pres…, 863c575 Merge pull request #24 from pre…, ff6d3c2 juzgado, CargarOficioSection.tsx, generateId(), Toast] | lang=en
- "flota_types_patrullaasignacion": "PatrullaAsignacion" | kind=code-symbol | source=lib/flota/types.ts:L21 | neighbors=[ModalReactivarOficial.tsx, NuevoOficialForm.tsx, OficialesTable.tsx, PatrullaSelector.tsx, mapper.ts, service.ts] | lang=en
- "incidentes_actions_createincidente": "createIncidente()" | kind=code-symbol | source=lib/incidentes/actions.ts:L49 | neighbors=[actions.ts, createAlarmaEscolar(), createExtorsion(), num(), req(), requireOperador()] | lang=en
- "incidentes_audit": "audit.ts" | kind=code-symbol | source=lib/incidentes/audit.ts:L1 | neighbors=[11be750 Fase 1 de correccion - completa…, 6feefe2 BackEnd completo para hacer la …, 863c575 Merge pull request #24 from pre…, route.ts, actions.ts, Accion] | lang=en
- "incidentes_paginacion": "Paginacion.tsx" | kind=code-symbol | source=components/reportes/incidentes/Paginacion.tsx:L1 | neighbors=[0068216 Mejora de Dashboard, Login y tr…, 2fcba7b vista de reportes de incidentes…, 552d291 Merge branch 'testing' into con…, 863c575 Merge pull request #24 from pre…, e286619 Merge branch 'feature/testing' …, Pagination()] | lang=en
- "incidentes_permisos_verificaraccesoincidentesapi": "verificarAccesoIncidentesApi()" | kind=code-symbol | source=lib/incidentes/permisos.ts:L30 | neighbors=[route.ts, route.ts, route.ts, route.ts, permisos.ts, tienePermiso()] | lang=en
- "incidentes_styles": "styles.ts" | kind=code-symbol | source=components/reportes/incidentes/styles.ts:L1 | neighbors=[2fcba7b vista de reportes de incidentes…, 552d291 Merge branch 'testing' into con…, 863c575 Merge pull request #24 from pre…, e286619 Merge branch 'feature/testing' …, FiltrosIncidencias.tsx, Paginacion.tsx] | lang=en

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/ugomez/Documents/GitHub/seguridad_publica/.graphify/description-instructions/batch-018.json

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
