# Node Description Batch 22 of 79

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

- "analisis_permisos_verificaraccesoanalisisapi": "verificarAccesoAnalisisApi()" | kind=code-symbol | source=lib/analisis/permisos.ts:L35 | neighbors=[permisos.ts, tieneAccesoAnalisis(), tienePermiso(), route.ts] | lang=en
- "auxiliar_mapper_rowtochecklist": "rowToChecklist()" | kind=code-symbol | source=lib/auxiliar/mapper.ts:L9 | neighbors=[mapper.ts, toStr(), rowToParReporte(), repository.ts] | lang=en
- "auxiliar_mapper_rowtoparreporte": "rowToParReporte()" | kind=code-symbol | source=lib/auxiliar/mapper.ts:L31 | neighbors=[mapper.ts, rowToChecklist(), toStr(), repository.ts] | lang=en
- "auxiliar_mapper_tostr": "toStr()" | kind=code-symbol | source=lib/auxiliar/mapper.ts:L3 | neighbors=[mapper.ts, rowToChecklist(), rowToCuestionarioRobo(), rowToParReporte()] | lang=en
- "auxiliar_permisos_verificaraccesoauxiliarapi": "verificarAccesoAuxiliarApi()" | kind=code-symbol | source=lib/auxiliar/permisos.ts:L39 | neighbors=[permisos.ts, tieneAccesoAuxiliar(), tienePermiso(), route.ts] | lang=en
- "camara_mapper_rowtoincidentecamara": "rowToIncidenteCamara()" | kind=code-symbol | source=lib/camara/mapper.ts:L21 | neighbors=[mapper.ts, toNum(), toStr(), repository.ts] | lang=en
- "camara_types_incidentecamara": "IncidenteCamara" | kind=code-symbol | source=lib/camara/types.ts:L1 | neighbors=[mapper.ts, repository.ts, types.ts, route.ts] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@0844e6e1c27168ffc88acbe2c2d8b6f4cfb6a8f6": "0844e6e Corregido" | kind=Commit | source=git | neighbors=[conexion, testing, 71912a4 Bitacora incluida, 7f3fe1a Formulariop de Rondines listo, …] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@49dca479f6546c67df478e85e13a41ece8cc067f": "49dca47 cambio" | kind=Commit | source=git | neighbors=[conexion, testing, 82ae6e9 Interfaz de llamada 911 cambios, c694543 cambio dee estatus] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@5e458d61c890c8a4a9e8a990e5b1cc6d10496867": "5e458d6 navegacion" | kind=Commit | source=git | neighbors=[conexion, testing, 86e9319 Merge branch 'feature/testing' …, c96893e Merge branch 'feature/correccio…] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@756e1c69242082798814cb770b0d311a2ea25102": "756e1c6 Update page.tsx" | kind=Commit | source=git | neighbors=[testing, a24949a Merge branch 'feature/testing' …, f5e51e1 card de 911 en vista de dashboa…, a667064 Page de seleccion de registro] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@7d7ebb1c25859658963f23baafe6cb070faf1c6a": "7d7ebb1 merge de archivos" | kind=Commit | source=git | neighbors=[conexion, testing, d2a4a5e guardado de nuemro exterior, in…, ecebe38 Guardado de longitud y latitud …] | lang=nl
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@82ae6e912012633311f0482474650d99d2990894": "82ae6e9 Interfaz de llamada 911 cambios" | kind=Commit | source=git | neighbors=[testing, 6feefe2 BackEnd completo para hacer la …, 49dca47 cambio, conexion] | lang=nl
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@a0ec8d2c2dfbfde9cb6ea5865a8732c2320f11aa": "a0ec8d2 topbar en 911" | kind=Commit | source=git | neighbors=[83f48a2 Merge branch 'feature/correccio…, conexion, testing, c96893e Merge branch 'feature/correccio…] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@a667064799f60e8647a86af738414eab28726079": "a667064 Page de seleccion de registro" | kind=Commit | source=git | neighbors=[ModuleCard.tsx, testing, 756e1c6 Update page.tsx, b68a2b7 Merge branch 'feature/testing' …] | lang=nl
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@a7a7f2e084cd75996841e4eeb0019d3671cacfde": "a7a7f2e boveda" | kind=Commit | source=git | neighbors=[conexion, testing, a21f03f fix bugs reporte denuncia, e6bffc9 boveda conectada] | lang=pt
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@deb4649e9609d3371eda8b082dfbd3121ea108d4": "deb4649 eLIMINE CARPETA" | kind=Commit | source=git | neighbors=[main, 199ce68 Merge branch 'main' of https://…, ea040d6 Carpeta creada, testing] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@e211eefd572dbc8a9bedcdde8eb32d55fe19b171": "e211eef upload AGENTS" | kind=Commit | source=git | neighbors=[514a705 refactorizacion sql, conexion, testing, ad3ec5f mejorando esto] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@ea040d6534df9613a15a08a709ea1fc01bb0800b": "ea040d6 Carpeta creada" | kind=Commit | source=git | neighbors=[d3e6d95 Update SeguimientoTimeline.tsx, main, deb4649 eLIMINE CARPETA, testing] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@ec3acf726484fbb76f804cebaf190c461ef704f2": "ec3acf7 iniciando reset de testing" | kind=Commit | source=git | neighbors=[9d803f2 fix api maps, conexion, testing, fe98642 modificando agents.md] | lang=nl
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@ef9e0ea90799410bf11b63750bd051a2b5cfe619": "ef9e0ea Formulario arreglado" | kind=Commit | source=git | neighbors=[4d4a9b7 formulario de notificaciones po…, conexion, testing, f7573dd Merge branch 'feature/testing' …] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@f5e51e19ca573d2bdd82c5573a174925f0bf88d1": "f5e51e1 card de 911 en vista de dashboard" | kind=Commit | source=git | neighbors=[756e1c6 Update page.tsx, testing, 3b10d72 Merge branch 'feature/testing' …, module-cards.tsx] | lang=nl
- "corralon_types_solicitudrow": "SolicitudRow" | kind=code-symbol | source=lib/corralon/types.ts:L7 | neighbors=[actions.ts, mapper.ts, service.ts, types.ts] | lang=en
- "d1_types": "types.ts" | kind=code-symbol | source=lib/d1/types.ts:L1 | neighbors=[ad3ec5f mejorando esto, mapper.ts, repository.ts, ReporteD1] | lang=en
- "deteccion_camara_reportstat_reportstat": "ReportStat()" | kind=code-symbol | source=components/reportes/deteccion_camara/ReportStat.tsx:L2 | neighbors=[ReportStat.tsx, PhoneStatsCards.tsx, page.tsx, page.tsx] | lang=en
- "fiscalia_repository_generarfolioasegurados": "generarFolioAsegurados()" | kind=code-symbol | source=lib/fiscalia/repository.ts:L486 | neighbors=[actions.ts, actions.ts, repository.ts, service.ts] | lang=en
- "fiscalia_service_obtenerdetalleaseguradocompletoservice": "obtenerDetalleAseguradoCompletoService()" | kind=code-symbol | source=lib/fiscalia/service.ts:L87 | neighbors=[actions.ts, actions.ts, service.ts, parseDetenidos()] | lang=en
- "fiscalia_types_actas_checklist": "ACTAS_CHECKLIST" | kind=code-symbol | source=lib/fiscalia/types.ts:L361 | neighbors=[FormularioAseguradoJuzgado.tsx, FormularioPuestaDisposicion.tsx, types.ts, page.tsx] | lang=en
- "fiscalia_types_datosaseguradoinput": "DatosAseguradoInput" | kind=code-symbol | source=lib/fiscalia/types.ts:L17 | neighbors=[actions.ts, repository.ts, service.ts, types.ts] | lang=en
- "fiscalia_types_viainfracciondetalle": "ViaInfraccionDetalle" | kind=code-symbol | source=lib/fiscalia/types.ts:L281 | neighbors=[actions.ts, FiscaliaDashboard.tsx, mapper.ts, types.ts] | lang=en
- "flota_mapper_rowtopatrulla": "rowToPatrulla()" | kind=code-symbol | source=lib/flota/mapper.ts:L14 | neighbors=[mapper.ts, toBool(), toStr(), repository.ts] | lang=en
- "hooks_useincidentes": "useIncidentes.ts" | kind=code-symbol | source=hooks/useIncidentes.ts:L1 | neighbors=[6feefe2 BackEnd completo para hacer la …, Filtros, IncidenteResumen, useIncidentes()] | lang=en
- "id_page_fmtdt": "fmtDT()" | kind=code-symbol | source=app/prevencion/juridico/solicitudes/[id]/page.tsx:L16 | neighbors=[page.tsx, FichaDetailPage(), toDate(), SolicitudDetailPage()] | lang=en
- "incidentes_actions_addpersonaafectada": "addPersonaAfectada()" | kind=code-symbol | source=lib/incidentes/actions.ts:L162 | neighbors=[actions.ts, req(), requireOperador(), validarEnum()] | lang=en
- "incidentes_actions_createalarmaescolar": "createAlarmaEscolar()" | kind=code-symbol | source=lib/incidentes/actions.ts:L499 | neighbors=[actions.ts, req(), requireOperador(), createIncidente()] | lang=en
- "incidentes_actions_createdespacho": "createDespacho()" | kind=code-symbol | source=lib/incidentes/actions.ts:L277 | neighbors=[DespachoForm.tsx, actions.ts, req(), requireOperador()] | lang=en
- "incidentes_actions_createextorsion": "createExtorsion()" | kind=code-symbol | source=lib/incidentes/actions.ts:L468 | neighbors=[actions.ts, req(), requireOperador(), createIncidente()] | lang=en
- "incidentes_actions_createrecorridocompleto": "createRecorridoCompleto()" | kind=code-symbol | source=lib/incidentes/actions.ts:L210 | neighbors=[actions.ts, num(), requireOperador(), FormSection.tsx] | lang=en
- "incidentes_actions_createreportecampo": "createReporteCampo()" | kind=code-symbol | source=lib/incidentes/actions.ts:L344 | neighbors=[actions.ts, num(), req(), requireOperador()] | lang=en
- "incidentes_actions_insertarincidente": "insertarIncidente()" | kind=code-symbol | source=lib/incidentes/actions.ts:L408 | neighbors=[actions.ts, num(), req(), validarEnum()] | lang=en

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/cesarbr/Documents/dev/sjr/seguridad_publica/.graphify/description-instructions/batch-021.json

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
