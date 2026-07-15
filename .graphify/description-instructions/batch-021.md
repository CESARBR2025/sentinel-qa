# Node Description Batch 22 of 93

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
Write every description in Portuguese (pt). Do not switch languages.
No marketing language.
Respond ONLY with a JSON object mapping each node id (as a string) to its
one-sentence description — no prose, no markdown fences.

- "fiscalia_abrirdocumento": "abrirDocumento.ts" | kind=code-symbol | source=lib/fiscalia/abrirDocumento.ts:L1 | neighbors=[16a63d4 Merge branch 'feature/testing' …, 2c128e5 test expediente vercel, 5bbdda8 Merge pull request #8 from pres…, 863c575 Merge pull request #24 from pre…, ac48eb1 Merge pull request #17 from pre…, ff6d3c2 juzgado]
- "fiscalia_confirmacionmodal": "ConfirmacionModal.tsx" | kind=code-symbol | source=components/fiscalia/ConfirmacionModal.tsx:L1 | neighbors=[5bbdda8 Merge pull request #8 from pres…, 863c575 Merge pull request #24 from pre…, ff6d3c2 juzgado, ConfirmacionModal(), ConfirmacionModalProps, VARIANTES]
- "fiscalia_types_puestadisposicionrow": "PuestaDisposicionRow" | kind=code-symbol | source=lib/fiscalia/types.ts:L94 | neighbors=[actions.ts, actions.ts, FormularioPuestaDisposicion.tsx, mapper.ts, repository.ts, service.ts]
- "helpers_abrirdocumento": "abrirDocumento.ts" | kind=code-symbol | source=features/via/expediente/helpers/abrirDocumento.ts:L1 | neighbors=[16a63d4 Merge branch 'feature/testing' …, 863c575 Merge pull request #24 from pre…, 91c36bf validando orden de pago, ac48eb1 Merge pull request #17 from pre…, af993fb Fix/Monitorista, f5fac0b Merge branch 'testing' into con…]
- "hooks_useempleado": "useEmpleado.ts" | kind=code-symbol | source=hooks/useEmpleado.ts:L1 | neighbors=[6feefe2 BackEnd completo para hacer la …, 863c575 Merge pull request #24 from pre…, a58a0f7 Despachos, DespachoForm.tsx, EmpleadoResult, useEmpleado()]
- "hooks_useflota": "useFlota.ts" | kind=code-symbol | source=hooks/useFlota.ts:L1 | neighbors=[6feefe2 BackEnd completo para hacer la …, 863c575 Merge pull request #24 from pre…, a58a0f7 Despachos, DespachoForm.tsx, FiltrosFlota, useFlota()]
- "hooks_useregistrodetenido": "useRegistroDetenido.ts" | kind=code-symbol | source=hooks/useRegistroDetenido.ts:L1 | neighbors=[generarPresentacion.tsx, 06c55f5 Merge branch 'feature/testing' …, 41ea169 Merge branch 'testing' into con…, 5830570 Seccion de analista, uya con bd…, 863c575 Merge pull request #24 from pre…, a353e63 Ya se enlazan datos pero no com…]
- "incidentes_actions_num": "num()" | kind=code-symbol | source=lib/incidentes/actions.ts:L31 | neighbors=[actions.ts, createIncidente(), createIncidenteCliente(), createRecorridoCompleto(), createReporteCampo(), createRondinEscalado()]
- "incidentes_mapper_tonum": "toNum()" | kind=code-symbol | source=lib/incidentes/mapper.ts:L26 | neighbors=[mapper.ts, rowToAlarmaEscolar(), rowToIncidenteDetalleCompletoBase(), rowToIncidentePendiente(), rowToPersonaAfectada(), rowToReporteCampo()]
- "incidentes_permisos_tienepermiso": "tienePermiso()" | kind=code-symbol | source=lib/incidentes/permisos.ts:L13 | neighbors=[service.ts, actions.ts, page.tsx, page.tsx, permisos.ts, verificarAccesoIncidentesApi()]
- "incidentes_statincidencia": "StatIncidencia.tsx" | kind=code-symbol | source=components/reportes/incidentes/StatIncidencia.tsx:L1 | neighbors=[0068216 Mejora de Dashboard, Login y tr…, 2fcba7b vista de reportes de incidentes…, 552d291 Merge branch 'testing' into con…, 863c575 Merge pull request #24 from pre…, e286619 Merge branch 'feature/testing' …, IncidenteStat()]
- "infracciones_repository_infraccionesrepository": "InfraccionesRepository" | kind=code-symbol | source=features/via/infracciones/repository.ts:L4 | neighbors=[actions.ts, repository.ts, .eliminarInfraccion(), .obtenerDatosInfraccionCiudadanoRP(), .obtenerSiguienteSecuencia(), .registarNuevaInfraccionRP()]
- "manual_migrations_0008_monitorista_permisos": "0008_monitorista_permisos.sql" | kind=code-symbol | source=lib/db/manual-migrations/0008_monitorista_permisos.sql:L1 | neighbors=[27dcb21 Merge branch 'feature/testing' …, 5618308 guardado e evidencias con ed, 77ddf58 Merge branch 'feature/testing' …, 863c575 Merge pull request #24 from pre…, f2c66e6 Extender roles y permisos finos…, monitorista_permisos]
- "manual_migrations_0011_permisos_plantillas": "0011_permisos_plantillas.sql" | kind=code-symbol | source=lib/db/manual-migrations/0011_permisos_plantillas.sql:L1 | neighbors=[27dcb21 Merge branch 'feature/testing' …, 5618308 guardado e evidencias con ed, 77ddf58 Merge branch 'feature/testing' …, 863c575 Merge pull request #24 from pre…, f2c66e6 Extender roles y permisos finos…, permisos_plantillas]
- "oficial_mapper_tostr": "toStr()" | kind=code-symbol | source=lib/oficial/mapper.ts:L69 | neighbors=[mapper.ts, rowToD1(), rowToDespachoAsignado(), rowToReporteCampo(), rowToReporteCampoParaD1(), rowToReporteResumen()]
- "ordensalida_generarordensalida_generarordensalidavehiculo": "generarOrdenSalidaVehiculo()" | kind=code-symbol | source=lib/ordenSalida/generarOrdenSalida.ts:L61 | neighbors=[route.ts, generarOrdenSalida.ts, drawWatermark(), formatearFecha(), formatearOficio(), loadImageAsBase64()]
- "prevencion_autoridadbadge": "AutoridadBadge.tsx" | kind=code-symbol | source=components/prevencion/AutoridadBadge.tsx:L1 | neighbors=[5558751 feat: módulo Prevención del Del…, page.tsx, page.tsx, page.tsx, AgregarAutoridadForm.tsx, AutoridadBadge()]
- "prevencion_cancelacionmodal": "CancelacionModal.tsx" | kind=code-symbol | source=components/prevencion/CancelacionModal.tsx:L1 | neighbors=[5558751 feat: módulo Prevención del Del…, page.tsx, actions.ts, cancelarFicha(), CancelacionModal(), InputField()]
- "prevencion_juridicofiltros": "JuridicoFiltros.tsx" | kind=code-symbol | source=components/prevencion/JuridicoFiltros.tsx:L1 | neighbors=[7e39526 Mejoras UI/UX, 863c575 Merge pull request #24 from pre…, page.tsx, AUTORIDADES, JuridicoFiltros(), SearchBox.tsx]
- "prevencion_paginate": "paginate.ts" | kind=code-symbol | source=lib/prevencion/paginate.ts:L1 | neighbors=[page.tsx, 7e39526 Mejoras UI/UX, 863c575 Merge pull request #24 from pre…, page.tsx, page.tsx, paginate()]
- "prevencion_pagination": "Pagination.tsx" | kind=code-symbol | source=components/prevencion/Pagination.tsx:L1 | neighbors=[page.tsx, 7e39526 Mejoras UI/UX, 863c575 Merge pull request #24 from pre…, page.tsx, page.tsx, Pagination()]
- "prevencion_prorrogamodal": "ProrrogaModal.tsx" | kind=code-symbol | source=components/prevencion/ProrrogaModal.tsx:L1 | neighbors=[0e33bf6 feat: módulo Admin, Prórroga, F…, page.tsx, actions.ts, createProrroga(), I, L]
- "prevencion_semaforovigencia": "SemaforoVigencia.tsx" | kind=code-symbol | source=components/prevencion/SemaforoVigencia.tsx:L1 | neighbors=[5558751 feat: módulo Prevención del Del…, page.tsx, page.tsx, semaforo.ts, SemaforoColor, CFG]
- "prevencion_timeline": "timeline.ts" | kind=code-symbol | source=lib/prevencion/timeline.ts:L1 | neighbors=[5558751 feat: módulo Prevención del Del…, checker.ts, SeguimientoTimeline.tsx, calcularFechaEsperada(), getLabelSeguimiento(), TIPOS_SEGUIMIENTO]
- "reportes_sin_d1_mapper": "mapper.ts" | kind=code-symbol | source=lib/reportes-sin-d1/mapper.ts:L1 | neighbors=[863c575 Merge pull request #24 from pre…, ad3ec5f mejorando esto, rowToSinD1(), toStr(), types.ts, SinD1Row]
- "reportes_sin_novedad_mapper": "mapper.ts" | kind=code-symbol | source=lib/reportes-sin-novedad/mapper.ts:L1 | neighbors=[863c575 Merge pull request #24 from pre…, ad3ec5f mejorando esto, rowToSinNovedad(), toStr(), types.ts, SinNovedadRow]
- "sasiete_client": "client.ts" | kind=code-symbol | source=features/via/saSiete/client.ts:L1 | neighbors=[23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, 863c575 Merge pull request #24 from pre…, b5233a8 implementando via como modulo d…, f7b1aac Merge branch 'feature/testing' …, FormularioInfraccion.tsx]
- "services_registrodetenidoservice": "registroDetenidoService.ts" | kind=code-symbol | source=services/registroDetenidoService.ts:L1 | neighbors=[generarPresentacion.tsx, 5618308 guardado e evidencias con ed, 5830570 Seccion de analista, uya con bd…, 863c575 Merge pull request #24 from pre…, 9550203 Cambios en presentacion, se gen…, 9faf222 Merge branch 'feature/testing' …]
- "ui_selectwrapper": "SelectWrapper.tsx" | kind=code-symbol | source=features/via/infracciones/components/ui/SelectWrapper.tsx:L1 | neighbors=[23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, 863c575 Merge pull request #24 from pre…, b5233a8 implementando via como modulo d…, f7b1aac Merge branch 'feature/testing' …, SeccionGarantia.tsx]
- "ui_toastauto_toastauto": "ToastAuto()" | kind=code-symbol | source=components/ui/ToastAuto.tsx:L7 | neighbors=[page.tsx, page.tsx, page.tsx, page.tsx, page.tsx, ToastAuto.tsx]
- "via_expediente_getexpedientetoken": "getExpedienteToken()" | kind=code-symbol | source=lib/via/expediente.ts:L25 | neighbors=[route.ts, route.ts, route.ts, route.ts, route.ts, expediente.ts]
- "via_sa7": "sa7.ts" | kind=code-symbol | source=lib/via/sa7.ts:L1 | neighbors=[16a63d4 Merge branch 'feature/testing' …, 863c575 Merge pull request #24 from pre…, 91c36bf validando orden de pago, ac48eb1 Merge pull request #17 from pre…, route.ts, pagos.ts]
- "911_permisos_obtenerrolnombre": "obtenerRolNombre()" | kind=code-symbol | source=lib/911/permisos.ts:L25 | neighbors=[permisos.ts, page.tsx, page.tsx, page.tsx, tieneAccesoHub(), tieneAccesoSeccion()]
- "admin_admin_styles_btnprimario": "btnPrimario" | kind=code-symbol | source=app/admin/admin-styles.ts:L16 | neighbors=[admin-styles.ts, page.tsx, page.tsx, page.tsx, page.tsx, page.tsx]
- "admin_transito_page": "page.tsx" | kind=code-symbol | source=app/admin-transito/page.tsx:L1 | neighbors=[AdminTransitoDashboardPage(), 0068216 Mejora de Dashboard, Login y tr…, 16a63d4 Merge branch 'feature/testing' …, 863c575 Merge pull request #24 from pre…, ac48eb1 Merge pull request #17 from pre…, dc063f3 gestion de oficiales correctame…]
- "admin_types": "types.ts" | kind=code-symbol | source=lib/admin/types.ts:L1 | neighbors=[mapper.ts, repository.ts, RolItem, UsuarioLista, 12aab65 fase 4, 863c575 Merge pull request #24 from pre…]
- "agente_juzgado_actions_obtenerdashboardjuzgado": "obtenerDashboardJuzgado()" | kind=code-symbol | source=lib/agente_juzgado/actions.ts:L36 | neighbors=[actions.ts, page.tsx, page.tsx, page.tsx, page.tsx, page.tsx]
- "agente_juzgado_botonverdetalle": "BotonVerDetalle.tsx" | kind=code-symbol | source=components/agente_juzgado/BotonVerDetalle.tsx:L1 | neighbors=[BotonVerDetalle(), BotonVerDetalleProps, JuzgadoDashboard.tsx, 75e03e9 puliendo flujo de juzgado-liber…, 863c575 Merge pull request #24 from pre…, ff3622b Merge pull request #11 from pre…]
- "agente_juzgado_types_detalleasegurado": "DetalleAsegurado" | kind=code-symbol | source=lib/agente_juzgado/types.ts:L18 | neighbors=[actions.ts, CapturarDetallesForm.tsx, DetallesAseguradoView.tsx, repository.ts, service.ts, types.ts]
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@09a02d502a750446d4922959aaa026119b734fe0": "09a02d5 Fix Reporte Rondin" | kind=Commit | source=git | neighbors=[feature/testing, main, 435348e corrigiendo flujo de rondin, f0089cf Merge pull request #21 from pre…, actions.ts, f4cf76c Actualización Rondin]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/ugomez/Documents/GitHub/seguridad_publica/.graphify/description-instructions/batch-021.json

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
