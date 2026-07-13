# Node Description Batch 18 of 84

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

- "templates_asignacion_fiscalia": "asignacion-fiscalia.ts" | kind=code-symbol | source=lib/emails/templates/asignacion-fiscalia.ts:L1 | neighbors=[75ca4b2 Merge pull request #9 from pres…, 953d38a implementando vista de fiscalia, server.ts, EnviarCorreoAsignacionFiscaliaParams, templateAsignacionFiscalia(), layout.ts] | lang=en
- "token_route": "route.ts" | kind=code-symbol | source=app/api/via/exp-digital/token/route.ts:L1 | neighbors=[23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, 5618308 guardado e evidencias con ed, f7b1aac Merge branch 'feature/testing' …, auth.ts, auth] | lang=en
- "ui_card_card": "Card()" | kind=code-symbol | source=features/via/infracciones/components/ui/Card.tsx:L1 | neighbors=[page.tsx, PasoCiudadano.tsx, PasoConductor.tsx, PasoDescuentos.tsx, PasoPago.tsx, PasoVehiculo.tsx] | lang=en
- "ui_fieldlabel": "FieldLabel.tsx" | kind=code-symbol | source=features/via/infracciones/components/ui/FieldLabel.tsx:L1 | neighbors=[23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, b5233a8 implementando via como modulo d…, f7b1aac Merge branch 'feature/testing' …, PasoConductor.tsx, PasoVehiculo.tsx] | lang=en
- "911_types": "types.ts" | kind=code-symbol | source=lib/911/types.ts:L1 | neighbors=[mapper.ts, repository.ts, service.ts, CatalogoItem, IncidenteDetalle, IncidenteResumen] | lang=en
- "admin_mapper": "mapper.ts" | kind=code-symbol | source=lib/admin/mapper.ts:L1 | neighbors=[rowToRol(), rowToUsuarioLista(), toStr(), types.ts, RolItem, UsuarioLista] | lang=en
- "admin_transito_actions_requireadmintransito": "requireAdminTransito()" | kind=code-symbol | source=lib/admin-transito/actions.ts:L9 | neighbors=[actions.ts, actualizarOficial(), buscarUsuariosReincorporar(), crearOficial(), destituirOficial(), obtenerOficialesLista()] | lang=en
- "admin_transito_modaldestituiroficial": "ModalDestituirOficial.tsx" | kind=code-symbol | source=components/admin-transito/ModalDestituirOficial.tsx:L1 | neighbors=[actions.ts, destituirOficial(), ModalDestituirOficial(), Props, OficialesTable.tsx, 16a63d4 Merge branch 'feature/testing' …] | lang=en
- "admin_transito_types": "types.ts" | kind=code-symbol | source=lib/admin-transito/types.ts:L1 | neighbors=[mapper.ts, repository.ts, Departamento, OficialLista, UserBasico, UserWithRole] | lang=en
- "agente_juzgado_juzgadotable": "JuzgadoTable.tsx" | kind=code-symbol | source=components/agente_juzgado/JuzgadoTable.tsx:L1 | neighbors=[JuzgadoDashboard.tsx, columns, DataRow, JuzgadoTable(), JuzgadoTableProps, 75e03e9 puliendo flujo de juzgado-liber…] | lang=en
- "agente_juzgado_tomarcasomodal": "TomarCasoModal.tsx" | kind=code-symbol | source=components/agente_juzgado/TomarCasoModal.tsx:L1 | neighbors=[TabSolicitudes.tsx, actions.ts, accionTomarCaso(), TomarCasoBoton(), 5f13b34 Merge branch 'feature/testing' …, 821abe0 replicando flujo de fiscalia-> …] | lang=en
- "auxiliar_permisos_tienepermiso": "tienePermiso()" | kind=code-symbol | source=lib/auxiliar/permisos.ts:L13 | neighbors=[actions.ts, page.tsx, permisos.ts, tieneAccesoAuxiliar(), verificarAccesoAuxiliarApi(), page.tsx] | lang=en
- "auxiliar_profiledropdownauxiliar": "ProfileDropdownAuxiliar.tsx" | kind=code-symbol | source=components/auxiliar/ProfileDropdownAuxiliar.tsx:L1 | neighbors=[page.tsx, ProfileDropdownAuxiliar(), Props, auth-client.ts, authClient, 25de428 Corrección para agregar el botó…] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@3249f00a89bf30e764b252bba8f76757f1664431": "3249f00 Cambios en rellenado de ppt!" | kind=Commit | source=git | neighbors=[conexion, testing, a6b7556 Formulario se puso a prueba, se…, route.ts, route.ts, analisisService.ts] | lang=nl
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@719b5ab1f902dba3e45bcca96bba340e0fe239fd": "719b5ab cambio para generacion de reportes semanal y diario" | kind=Commit | source=git | neighbors=[2fcba7b vista de reportes de incidentes…, conexion, testing, 18f5bac llamada en card, FiltrosIncidencias.tsx, TablaIncidentes.tsx] | lang=es
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@8095bdb5f3467c591748704c81330d9502a66535": "8095bdb limpiando .env" | kind=Commit | source=git | neighbors=[conexion, testing, 75ca4b2 Merge pull request #9 from pres…, b233bc7 Merge branch 'testing' into con…, expediente.ts, 953d38a implementando vista de fiscalia] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@adf0c3d126c5fd3d93b18615951fdf522e3b70ff": "adf0c3d vista de busqueda y juridico" | kind=Commit | source=git | neighbors=[3800cab formulario de nueva medida de p…, conexion, testing, page.tsx, baae82f diseño de medidas de proteccion, bb10dcd Formatos V1] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@baae82f65f206f5ecab6b05963b359866b11ffee": "baae82f diseño de medidas de proteccion" | kind=Commit | source=git | neighbors=[adf0c3d vista de busqueda y juridico, conexion, testing, c95f412 Merge branch 'feature/testing' …, page.tsx, AgregarAutoridadForm.tsx] | lang=nl
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@c1ed4c3ec30f62f4a96e9c4c0eaa5a200909aa3f": "c1ed4c3 cambios en busquedas" | kind=Commit | source=git | neighbors=[conexion, testing, 41ea169 Merge branch 'testing' into con…, c471e9c Merge pull request #15 from pre…, page.tsx, page.tsx] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@deb4649e9609d3371eda8b082dfbd3121ea108d4": "deb4649 eLIMINE CARPETA" | kind=Commit | source=git | neighbors=[main, 199ce68 Merge branch 'main' of https://…, ea040d6 Carpeta creada, feature/monitorista-reportes, fix/detenidos, fix/incidentes-camara] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@ea040d6534df9613a15a08a709ea1fc01bb0800b": "ea040d6 Carpeta creada" | kind=Commit | source=git | neighbors=[d3e6d95 Update SeguimientoTimeline.tsx, main, deb4649 eLIMINE CARPETA, feature/monitorista-reportes, fix/detenidos, fix/incidentes-camara] | lang=en
- "components_mapsectionciudadano": "MapSectionCiudadano.tsx" | kind=code-symbol | source=features/via/infracciones/components/MapSectionCiudadano.tsx:L1 | neighbors=[16a63d4 Merge branch 'feature/testing' …, 91c36bf validando orden de pago, a21f03f fix bugs reporte denuncia, ac48eb1 Merge pull request #17 from pre…, containerStyle, MapSectionCiudadano()] | lang=en
- "d1_mapper": "mapper.ts" | kind=code-symbol | source=lib/d1/mapper.ts:L1 | neighbors=[ad3ec5f mejorando esto, rowToReporteD1(), toBool(), toNum(), toStr(), types.ts] | lang=en
- "d1_noiniciada_descargapagination": "DescargaPagination.tsx" | kind=code-symbol | source=components/reportes/d1_noiniciada/DescargaPagination.tsx:L1 | neighbors=[4c9fa8a vista de reporte de d1 no inici…, 712c116 Merge branch 'testing' into con…, e286619 Merge branch 'feature/testing' …, DescargaPagination(), PaginationProps, styles.ts] | lang=en
- "d1_noiniciada_styles": "styles.ts" | kind=code-symbol | source=components/reportes/d1_noiniciada/styles.ts:L1 | neighbors=[4c9fa8a vista de reporte de d1 no inici…, 712c116 Merge branch 'testing' into con…, e286619 Merge branch 'feature/testing' …, DescargaFilters.tsx, DescargaPagination.tsx, DescargaTable.tsx] | lang=en
- "expediente_client_obtenerguesttoken": "obtenerGuestToken()" | kind=code-symbol | source=lib/expediente/client.ts:L7 | neighbors=[client.ts, actions.ts, expediente.ts, ppt-service.ts, route.ts, route.ts] | lang=en
- "fiscalia_types_detalleaseguradocompleto": "DetalleAseguradoCompleto" | kind=code-symbol | source=lib/fiscalia/types.ts:L55 | neighbors=[actions.ts, FormularioAseguradoJuzgado.tsx, actions.ts, FormularioAsegurado.tsx, FormularioPuestaDisposicion.tsx, mapper.ts] | lang=en
- "fiscalia_usetoaststore": "useToastStore.ts" | kind=code-symbol | source=lib/fiscalia/useToastStore.ts:L1 | neighbors=[5bbdda8 Merge pull request #8 from pres…, ff6d3c2 juzgado, CargarOficioSection.tsx, generateId(), Toast, ToastStore] | lang=en
- "incidentes_actions_createincidentecliente": "createIncidenteCliente()" | kind=code-symbol | source=lib/incidentes/actions.ts:L161 | neighbors=[Formulario911.tsx, actions.ts, createAlarmaEscolar(), createExtorsion(), num(), req()] | lang=en
- "incidentes_audit": "audit.ts" | kind=code-symbol | source=lib/incidentes/audit.ts:L1 | neighbors=[11be750 Fase 1 de correccion - completa…, route.ts, actions.ts, Accion, registrarAudit(), db.ts] | lang=en
- "incidentes_styles": "styles.ts" | kind=code-symbol | source=components/reportes/incidentes/styles.ts:L1 | neighbors=[2fcba7b vista de reportes de incidentes…, 552d291 Merge branch 'testing' into con…, e286619 Merge branch 'feature/testing' …, FiltrosIncidencias.tsx, Paginacion.tsx, styles] | lang=en
- "infracciones_actions": "actions.ts" | kind=code-symbol | source=features/via/infracciones/actions.ts:L1 | neighbors=[23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, b5233a8 implementando via como modulo d…, f7b1aac Merge branch 'feature/testing' …, FormularioInfraccion.tsx, eliminarInfraccionAction()] | lang=en
- "legalidad_types": "types.ts" | kind=code-symbol | source=features/via/legalidad/types.ts:L1 | neighbors=[23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, b5233a8 implementando via como modulo d…, f7b1aac Merge branch 'feature/testing' …, mapper.ts, service.ts] | lang=en
- "lib_error_handler_tryaction": "tryAction()" | kind=code-symbol | source=lib/error-handler.ts:L46 | neighbors=[actions.ts, actions.ts, actions.ts, error-handler.ts, actions.ts, actions.ts] | lang=en
- "lib_error_handler_tryactionraw": "tryActionRaw()" | kind=code-symbol | source=lib/error-handler.ts:L59 | neighbors=[actions.ts, actions.ts, actions.ts, error-handler.ts, actions.ts, actions.ts] | lang=en
- "liberar_garantia_route": "route.ts" | kind=code-symbol | source=app/api/via/infracciones/liberar-garantia/route.ts:L1 | neighbors=[16a63d4 Merge branch 'feature/testing' …, 91c36bf validando orden de pago, ac48eb1 Merge pull request #17 from pre…, ad3ec5f mejorando esto, ede5a1d eliminado referencias a via_pru…, repository.ts] | lang=en
- "manual_migrations_0006_formato_n_public_formato_n_reportes": "public.formato_n_reportes" | kind=code-symbol | source=lib/db/manual-migrations/0006_formato_n.sql:L88 | neighbors=[0006_formato_n.sql, formato_n_armas_aseguradas, formato_n_atencion_victimas, formato_n_eventos, formato_n_fge, formato_n_fgr] | lang=en
- "modulo_incidentes_styles_styles": "styles" | kind=code-symbol | source=components/reportes/modulo_incidentes/styles.ts:L1 | neighbors=[page.tsx, PhonePagination.tsx, PhoneReportsTable.tsx, PhoneStatsCards.tsx, page.tsx, ReportesTabs.tsx] | lang=en
- "oficial_mapapinfijo": "MapaPinFijo.tsx" | kind=code-symbol | source=components/oficial/MapaPinFijo.tsx:L1 | neighbors=[0c31cc2 Merge branch 'testing' into juz…, 44ebbc4 Merge branch 'feature/testing' …, a291695 Merge branch 'feature/testing' …, b79a96a Conexión entre ambos modulos, page.tsx, MapaPinFijo()] | lang=en
- "oficial_profiledropdown_profiledropdown": "ProfileDropdown()" | kind=code-symbol | source=components/oficial/ProfileDropdown.tsx:L16 | neighbors=[layout.tsx, page.tsx, page.tsx, page.tsx, page.tsx, page.tsx] | lang=en

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/cesarbr/Documents/dev/sjr/seguridad_publica/.graphify/description-instructions/batch-017.json

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
