# Node Description Batch 67 of 79

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
Write every description in English (en). Do not switch languages.
No marketing language.
Respond ONLY with a JSON object mapping each node id (as a string) to its
one-sentence description — no prose, no markdown fences.

- "incidentes_permisos_permisoseccion": "PermisoSeccion" | kind=code-symbol | source=lib/incidentes/permisos.ts:L8 | neighbors=[permisos.ts]
- "incidentes_permisos_roles_permitidos": "ROLES_PERMITIDOS" | kind=code-symbol | source=lib/incidentes/permisos.ts:L30 | neighbors=[permisos.ts]
- "incidentes_permisos_seccion": "Seccion" | kind=code-symbol | source=lib/incidentes/permisos.ts:L6 | neighbors=[permisos.ts]
- "incidentes_repository_obtenerunidadeselementos": "obtenerUnidadesElementos()" | kind=code-symbol | source=lib/incidentes/repository.ts:L52 | neighbors=[repository.ts]
- "incidentes_route_get": "GET()" | kind=code-symbol | source=app/api/incidentes/route.ts:L7 | neighbors=[route.ts]
- "incidentes_tablaincidentes_props": "Props" | kind=code-symbol | source=components/reportes/incidentes/TablaIncidentes.tsx:L18 | neighbors=[TablaIncidentes.tsx]
- "incidentes_tablaincidentes_rowdata": "RowData" | kind=code-symbol | source=components/reportes/incidentes/TablaIncidentes.tsx:L3 | neighbors=[TablaIncidentes.tsx]
- "infracciones_constants_datosiniciales": "datosIniciales" | kind=code-symbol | source=features/via/infracciones/constants.ts:L3 | neighbors=[constants.ts]
- "infracciones_repository_infraccionesrepository_eliminarinfraccion": ".eliminarInfraccion()" | kind=code-symbol | source=features/via/infracciones/repository.ts:L115 | neighbors=[InfraccionesRepository]
- "infracciones_repository_infraccionesrepository_obtenerdatosinfraccionciudadanorp": ".obtenerDatosInfraccionCiudadanoRP()" | kind=code-symbol | source=features/via/infracciones/repository.ts:L119 | neighbors=[InfraccionesRepository]
- "infracciones_repository_infraccionesrepository_obtenersiguientesecuencia": ".obtenerSiguienteSecuencia()" | kind=code-symbol | source=features/via/infracciones/repository.ts:L5 | neighbors=[InfraccionesRepository]
- "infracciones_repository_infraccionesrepository_registarnuevainfraccionrp": ".registarNuevaInfraccionRP()" | kind=code-symbol | source=features/via/infracciones/repository.ts:L12 | neighbors=[InfraccionesRepository]
- "infracciones_service_infraccionesservice_obtenerporid": ".obtenerPorId()" | kind=code-symbol | source=features/via/infracciones/service.ts:L61 | neighbors=[InfraccionesService]
- "infracciones_types_articulosinterfaceprops": "ArticulosInterfaceProps" | kind=code-symbol | source=features/via/infracciones/types.ts:L192 | neighbors=[types.ts]
- "infracciones_types_viewbuscaridarticulo": "ViewBuscarIDArticulo" | kind=code-symbol | source=features/via/infracciones/types.ts:L187 | neighbors=[types.ts]
- "infracciones_types_viewfraccionlista": "ViewFraccionLista" | kind=code-symbol | source=features/via/infracciones/types.ts:L169 | neighbors=[types.ts]
- "infraccionid_route_get": "GET()" | kind=code-symbol | source=app/api/via/pagos/finalizar-instante/[ordenPagoId]/[infraccionId]/route.ts:L5 | neighbors=[route.ts]
- "iniciar_proceso_route_patch": "PATCH()" | kind=code-symbol | source=app/api/via/infracciones/iniciar-proceso/route.ts:L13 | neighbors=[route.ts]
- "iniciar_solicitud_route_post": "POST()" | kind=code-symbol | source=app/api/via/ciudadano/iniciar-solicitud/route.ts:L5 | neighbors=[route.ts]
- "iniciarproceso_route_patch": "PATCH()" | kind=code-symbol | source=app/api/agente_juzgado/iniciarProceso/route.ts:L6 | neighbors=[route.ts]
- "iph_bitacoraiph_bitacoraiph": "BitacoraIPH()" | kind=code-symbol | source=components/analisis/iph/BitacoraIPH.tsx:L8 | neighbors=[BitacoraIPH.tsx]
- "iph_bitacoraiph_btnpptstyle": "btnPPTStyle" | kind=code-symbol | source=components/analisis/iph/BitacoraIPH.tsx:L99 | neighbors=[BitacoraIPH.tsx]
- "iph_bitacoraiph_btnstyle": "btnStyle" | kind=code-symbol | source=components/analisis/iph/BitacoraIPH.tsx:L92 | neighbors=[BitacoraIPH.tsx]
- "iph_bitacoraiph_containerstyle": "containerStyle" | kind=code-symbol | source=components/analisis/iph/BitacoraIPH.tsx:L85 | neighbors=[BitacoraIPH.tsx]
- "iph_bitacoraiph_headerrowstyle": "headerRowStyle" | kind=code-symbol | source=components/analisis/iph/BitacoraIPH.tsx:L86 | neighbors=[BitacoraIPH.tsx]
- "iph_bitacoraiph_tdstyle": "tdStyle" | kind=code-symbol | source=components/analisis/iph/BitacoraIPH.tsx:L88 | neighbors=[BitacoraIPH.tsx]
- "iph_bitacoraiph_thstyle": "thStyle" | kind=code-symbol | source=components/analisis/iph/BitacoraIPH.tsx:L87 | neighbors=[BitacoraIPH.tsx]
- "iph_bitacoraiph_trstyle": "trStyle" | kind=code-symbol | source=components/analisis/iph/BitacoraIPH.tsx:L89 | neighbors=[BitacoraIPH.tsx]
- "iph_page_iphpage": "IPHPage()" | kind=code-symbol | source=app/analisis/iph/page.tsx:L10 | neighbors=[page.tsx]
- "juridico_page_juridicopage": "JuridicoPage()" | kind=code-symbol | source=app/prevencion/juridico/page.tsx:L11 | neighbors=[page.tsx]
- "legalidad_mapper_articulosmapper_todomain": ".toDomain()" | kind=code-symbol | source=features/via/legalidad/mapper.ts:L17 | neighbors=[ArticulosMapper]
- "legalidad_mapper_queryrow": "QueryRow" | kind=code-symbol | source=features/via/legalidad/mapper.ts:L3 | neighbors=[mapper.ts]
- "legalidad_repository_articulosrepository_obtenerarticulos": ".obtenerArticulos()" | kind=code-symbol | source=features/via/legalidad/repository.ts:L4 | neighbors=[ArticulosRepository]
- "legalidad_repository_articulosrepository_obtenerfraccionesporarticulo": ".obtenerFraccionesPorArticulo()" | kind=code-symbol | source=features/via/legalidad/repository.ts:L27 | neighbors=[ArticulosRepository]
- "legalidad_service_articulosservice_obtenerfraccionesporarticulo": ".obtenerFraccionesPorArticulo()" | kind=code-symbol | source=features/via/legalidad/service.ts:L16 | neighbors=[ArticulosService]
- "lib_auth_authuser": "AuthUser" | kind=code-symbol | source=lib/auth.ts:L63 | neighbors=[auth.ts]
- "lib_db_createpool": "createPool()" | kind=code-symbol | source=lib/db.ts:L7 | neighbors=[db.ts]
- "lib_detenidos_compartido_detenidofotodetalle": "DetenidoFotoDetalle" | kind=code-symbol | source=lib/detenidos-compartido.ts:L17 | neighbors=[detenidos-compartido.ts]
- "lib_detenidos_compartido_detenidofotopendiente": "DetenidoFotoPendiente" | kind=code-symbol | source=lib/detenidos-compartido.ts:L3 | neighbors=[detenidos-compartido.ts]
- "lib_error_handler_actionresult": "ActionResult" | kind=code-symbol | source=lib/error-handler.ts:L42 | neighbors=[error-handler.ts]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/cesarbr/Documents/dev/sjr/seguridad_publica/.graphify/description-instructions/batch-066.json

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
