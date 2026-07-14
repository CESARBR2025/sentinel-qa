# Graph Report - .  (2026-07-14)

## Corpus Check
- Large corpus: 788 files · ~565,461 words. Semantic extraction will be expensive (many Claude tokens). Consider running on a subfolder, or use --no-semantic to run AST-only.

## Summary
- 3547 nodes · 11577 edges · 135 communities detected
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output
- Edge kinds: MODIFIES: 3810 · contains: 2685 · imports: 1833 · imports_from: 1223 · ON_BRANCH: 1220 · calls: 394 · PARENT_OF: 315 · re_exports: 52 · method: 29 · references: 9 · inherits: 7


## Input Scope
- Requested: auto
- Resolved: committed (source: default-auto)
- Included files: 788 · Candidates: 844
- Excluded: 0 untracked · 71384 ignored · 1 sensitive · 30 missing committed
- Recommendation: Use --scope all or graphify.yaml inputs.corpus for a knowledge-base folder.

## Graph Freshness
- Built from Git commit: `22bf125`
- Compare this hash to `git rev-parse HEAD` before trusting freshness-sensitive graph output.
## God Nodes (most connected - your core abstractions)
1. `auth` - 135 edges
2. `query()` - 64 edges
3. `DashboardHeader()` - 25 edges
4. `getUserWithRole()` - 25 edges
5. `SubHeader()` - 17 edges
6. `tienePermiso()` - 17 edges
7. `tienePermiso()` - 16 edges
8. `authClient` - 14 edges
9. `AppError` - 14 edges
10. `requireOperador()` - 14 edges

## Surprising Connections (you probably didn't know these)
- `GET()` --calls--> `crearHoja()`  [EXTRACTED]
  app/api/reportes-telefonicos/exportar/route.ts → app/api/camara/exportar/route.ts
- `DetalleCiudadanoCompletoPage()` --calls--> `getStatusBadgeStyle()`  [EXTRACTED]
  app/agente_911/ciudadano/incidentes/[id]/page.tsx → app/agente_911/whatsapp/incidentes/[id]/page.tsx
- `DetalleRondinCompletoPage()` --calls--> `getStatusBadgeStyle()`  [EXTRACTED]
  app/agente_911/rondin/incidentes/[id]/page.tsx → app/agente_911/whatsapp/incidentes/[id]/page.tsx
- `FichaDetailPage()` --calls--> `fmtDT()`  [EXTRACTED]
  app/prevencion/busquedas/[id]/page.tsx → app/prevencion/juridico/solicitudes/[id]/page.tsx
- `POST()` --calls--> `mapearEstatusFinal()`  [EXTRACTED]
  app/api/via/ciudadano/subir-archivo/route.ts → app/api/corralon/subir-archivo/route.ts

## Communities

### Community 0 - "Community 0"
Cohesion: 0.03
Nodes (109): 06c55f5 Merge branch 'feature/testing' into feature/reportes, 1e81ec8 Datos se autorellenan de denuncias y seccion de oficial, 41ea169 Merge branch 'testing' into conexion, 8355ac0 Merge branch 'feature/testing' into feature/implementacion-consumir-datos-denuncia, a2e0623 Consolidado de formatos N y SubHeader, ajustes en servicios de reportes, bb10dcd Formatos V1, c95f412 Merge branch 'feature/testing' of https://github.com/presidenciaSJR/seguridad_publica into feature/testing, f5fac0b Merge branch 'testing' into conexion (+101 more)

### Community 1 - "Community 1"
Cohesion: 0.03
Nodes (85): Accion, obtenerRolNombre(), PermisoSeccion, ROLES_PERMITIDOS, Seccion, SECCIONES, tieneAccesoHub(), tieneAccesoSeccion() (+77 more)

### Community 2 - "Community 2"
Cohesion: 0.05
Nodes (46): { GET, POST }, TIPO_CFG, 5558751 feat: módulo Prevención del Delito completo + fix flujo autenticación 2FA, 5618308 guardado e evidencias con ed, 77ddf58 Merge branch 'feature/testing' of https://github.com/presidenciaSJR/seguridad_publica into feature/testing, f2c66e6 Extender roles y permisos finos a incidentes, prevención, auxiliar, 911, análisis, denuncia D1 y Formato N, ffcea0c fase 1 completada, db (+38 more)

### Community 3 - "Community 3"
Cohesion: 0.05
Nodes (88): 0c31cc2 Merge branch 'testing' into juzgado, 0d9172a mejorando flujo de 911-despacho, 13f7f39 Reporte-incidentes, 22bf125 Merge pull request #20 from presidenciaSJR/conexion, 290d651 feat(despacho): flujo integral 911 → despacho → oficial → D1 → legal, 458bbfb registro de reporte de campo - oficial, 5ef7cf3 Agregar los campos faltantes, 93dd3ea Merge pull request #1 from presidenciaSJR/juzgado (+80 more)

### Community 4 - "Community 4"
Cohesion: 0.02
Nodes (61): guardarDetallesAseguradosJuzgadoAction(), guardarPuestaDisposicionJuzgadoAction(), obtenerDetalleAseguradoCompletoJuzgadoAction(), obtenerPuestaDisposicionJuzgadoAction(), obtenerDetalleInfraccionLiberaciones(), obtenerDetalleAseguradoCompletoAction(), obtenerPuestaDisposicionAction(), FormularioPuestaDisposicion() (+53 more)

### Community 5 - "Community 5"
Cohesion: 0.05
Nodes (76): tdStyle, thStyle, num(), parseDetenidos(), parseSolicitudesJson(), parseTurno(), rowToDenunciaDetalle(), rowToDependencia() (+68 more)

### Community 6 - "Community 6"
Cohesion: 0.05
Nodes (58): AseguradosData, LiberacionesData, SolicitudesData, num(), rowToAsegurado(), rowToDetalleDetenidoGuardado(), rowToPuestaDisposicion(), rowToSolicitud() (+50 more)

### Community 7 - "Community 7"
Cohesion: 0.05
Nodes (49): guardarDetallesAseguradoAction(), CapturarDetallesForm(), disabledSx, emptyItem(), EvidenciaItem, inputSx, labelSx, Props (+41 more)

### Community 8 - "Community 8"
Cohesion: 0.08
Nodes (57): createBodyCam(), createConcepto(), createMedioCanalizacion(), createRadio(), createSector(), createTipoEmergencia(), createTipoObservacion(), req() (+49 more)

### Community 9 - "Community 9"
Cohesion: 0.06
Nodes (50): accionCerrarCaso(), accionTomarCaso(), AseguradosJuzgadoData, LiberacionesData, obtenerSolicitudes(), SolicitudesData, num(), rowToInfraccionDetalle() (+42 more)

### Community 10 - "Community 10"
Cohesion: 0.06
Nodes (35): 126b4d1 Monitorista V1, 44ebbc4 Merge branch 'feature/testing' of https://github.com/presidenciaSJR/seguridad_publica into testing, 46b2c89 Merge branch 'testing' into juzgado, da33516 Merge pull request #3 from presidenciaSJR/feature/monitorista, BandejaSolicitudes(), btnDetalle, btnPrimary, btnSuccess (+27 more)

### Community 11 - "Community 11"
Cohesion: 0.06
Nodes (36): insertarDocumentoLiberacion(), 16df128 flujo de corralones listo, 5a1b5d5 empezando corralon, obtenerDashboardCorralon(), obtenerSolicitudes(), TabSolicitudes, rowToSolicitud(), toStr() (+28 more)

### Community 12 - "Community 12"
Cohesion: 0.05
Nodes (47): concatNombre(), disabledSx, displayVal(), FormularioAseguradoJuzgado(), labelSx, Props, metadata, 2db162a flujo de asegurados (+39 more)

### Community 13 - "Community 13"
Cohesion: 0.08
Nodes (53): rowToAlarmaEscolar(), rowToDespacho(), rowToDespachoElemento(), rowToDespachoUnidad(), rowToExtorsion(), rowToIncidenteBasico(), rowToIncidenteConDespachoBase(), rowToIncidenteDetalleCompletoBase() (+45 more)

### Community 14 - "Community 14"
Cohesion: 0.16
Nodes (53): feature/monitorista, feature/monitorista-reportes, fix/detenidos, fix/incidentes-camara, libraries, 0844e6e Corregido, 133bb9d pages de listado de llamadas y de radio, 166a26b Merge branch 'feature/testing' of https://github.com/presidenciaSJR/seguridad_publica into feature/testing (+45 more)

### Community 15 - "Community 15"
Cohesion: 0.12
Nodes (53): conexion, feature/testing, testing, 0c8695c Cambios en filtros, 0caf5dd Fixes, 0fe445e vista de oficial, 11ee4f2 mejorando flujo de 911, 1265204 paginacion por tablas (+45 more)

### Community 16 - "Community 16"
Cohesion: 0.07
Nodes (30): createUser(), requireAdmin(), updateUser(), ActionResult, ApiHandler, ApiResponse, AppError, ConflictError (+22 more)

### Community 17 - "Community 17"
Cohesion: 0.05
Nodes (34): btnBackStyle, btnFinishStyle, btnGeoStyle, btnNextStyle, cardStyle, footerActions, grid3, labelStyle (+26 more)

### Community 18 - "Community 18"
Cohesion: 0.08
Nodes (44): rowToAutoridadAdicional(), rowToBusqueda(), rowToContestacion(), rowToFichaBusquedaDetalle(), rowToMedida(), rowToMedidaDetalle(), rowToSeguimiento(), rowToSolicitud() (+36 more)

### Community 19 - "Community 19"
Cohesion: 0.10
Nodes (24): obtenerAseguradosJuzgadoAction(), obtenerDashboardJuzgado(), obtenerLiberacionesAction(), ProfileDropdown(), Props, ToastExito(), 090c4dd vista de fiscalia, 997ef65 Merge pull request #2 from presidenciaSJR/juzgado (+16 more)

### Community 20 - "Community 20"
Cohesion: 0.05
Nodes (29): btnPrimario, btnSecundario, inputStyle, labelStyle, pageWrap, selectStyle, btnPrimario(), btnSecundario (+21 more)

### Community 21 - "Community 21"
Cohesion: 0.10
Nodes (29): liberarGarantiaInfraccionesAction(), obtenerDashboardInfracciones(), obtenerDetalleInfraccionInfracciones(), obtenerInfracciones(), columns, DataRow, InfraccionesTableProps, inputToDbParams() (+21 more)

### Community 22 - "Community 22"
Cohesion: 0.10
Nodes (34): 11be750 Fase 1 de correccion - completada - pendiente testing, addPersonaAfectada(), CANALES, cerrarPorDetencion(), createAlarmaEscolar(), createDespacho(), createExtorsion(), createIncidente() (+26 more)

### Community 23 - "Community 23"
Cohesion: 0.09
Nodes (19): SubirFotoDetenido(), 388b997 Apartados para subir fotografias de los detenidos, 672bab5 libearciones para juzgado, de5682f Merge pull request #10 from presidenciaSJR/fix/subir-fotografias, FilaDetenidoRol(), btnDetalle, pagBtn, SubirFotoDetenido() (+11 more)

### Community 24 - "Community 24"
Cohesion: 0.07
Nodes (21): guardarOficioJuzgadoAction(), obtenerDetalleInfraccionViaActionJuzgado(), BotonVerDetalle(), BotonVerDetalleProps, CargarOficioSectionProps, ConfirmacionModalProps, VARIANTES, AVATAR_COLORS (+13 more)

### Community 25 - "Community 25"
Cohesion: 0.09
Nodes (27): capturarInfractorAction(), finalizarRevisionAction(), generarOrdenPagoAction(), obtenerDocumentosLiberacion(), revisarDocumentoAction(), LiberacionesResponse, UserInfo, 0b210fa Merge pull request #12 from presidenciaSJR/conexion (+19 more)

### Community 26 - "Community 26"
Cohesion: 0.06
Nodes (22): AUTORIDADES, btnPrimario(), btnSecundario, NuevaDetenidoPage(), TIPOS, addAutoridadMedida(), createContestacion(), createFicha() (+14 more)

### Community 27 - "Community 27"
Cohesion: 0.07
Nodes (21): cacheGet(), cacheKey(), cacheSet(), CHECKPOINT_SCRIPT, ContextLoaderPlugin(), DECISION_MSG, __dirname, GOLDEN_RULES (+13 more)

### Community 28 - "Community 28"
Cohesion: 0.11
Nodes (24): Props, c27a9ee fase prefinal, dc063f3 gestion de oficiales correctamente, rowToPatrulla(), toBool(), toStr(), estaStale(), listarActivas() (+16 more)

### Community 29 - "Community 29"
Cohesion: 0.08
Nodes (28): actualizarDatosInfractor(), actualizarDatosInfractorIniciarProceso(), actualizarEstatusDependenciaMesaControl(), actualizarEstatusPendientePagoInfraccion(), actualizarEstatusSolicitudLiberacion(), actualizarEvidenciasInfraccion(), actualizarUrlOrdenSalida(), actualizarUrlsDocumentosInfraccion() (+20 more)

### Community 30 - "Community 30"
Cohesion: 0.11
Nodes (24): 2fcba7b vista de reportes de incidentes diarios y semanales, 719b5ab cambio para generacion de reportes semanal y diario, FiltrosIncidencias(), PaginationProps, IncidenteStat(), styles, Props, RowData (+16 more)

### Community 31 - "Community 31"
Cohesion: 0.14
Nodes (19): 156c925 vista de reporte de sin robos, 22b7b54 Merge branch 'feature/reportes' into feature/testing, 552d291 Merge branch 'testing' into conexion, 97a156c Reportes con D1, sin D1 y sin robo, rowToSinD1(), toStr(), obtenerSinD1(), SinD1Row (+11 more)

### Community 32 - "Community 32"
Cohesion: 0.10
Nodes (18): Props, Props, Props, ArchivoField, Props, InfraccionCreada, PasoPagoProps, COLORES (+10 more)

### Community 33 - "Community 33"
Cohesion: 0.11
Nodes (21): 5d179c0 Apartado de reportes, 8e6c8c6 Apartado de reportes, limpiarCacheToken(), obtenerGuestToken(), subirArchivoExpediente(), cancelarSolicitud(), completarSolicitud(), requireMonitorista() (+13 more)

### Community 34 - "Community 34"
Cohesion: 0.10
Nodes (18): actionTextStyle, cardContentStyle, cardDescStyle, cardStyle, cardTitleStyle, decoratorLine, iconBoxStyle, systemStatusStyle (+10 more)

### Community 35 - "Community 35"
Cohesion: 0.07
Nodes (25): BTN, BTN_SM, DespachoForm(), Elemento, ERR, I, LBL, TAG (+17 more)

### Community 36 - "Community 36"
Cohesion: 0.07
Nodes (20): AGENTS_PATH, agentsChars, BOVEDA_DIR, charsToTokens(), __dirname, discoveryCost, { docs, chars: bovedaChars }, estimateYoumindagContext() (+12 more)

### Community 37 - "Community 37"
Cohesion: 0.12
Nodes (20): cardStyle, rowToRol(), rowToUsuarioLista(), toStr(), actualizarUsuario(), asignarRolUsuario(), crearRol(), eliminarSesion() (+12 more)

### Community 38 - "Community 38"
Cohesion: 0.12
Nodes (16): 067c4de arreglando flujo de fiscalia  a schema via, 1dbd480 flujo de liberaciones completado, mapCrearInfraccionToDB(), mapInfraccionDetalle(), InfraccionesRepository, generarFolioInfraccion(), InfraccionesService, randomBase36Char() (+8 more)

### Community 39 - "Community 39"
Cohesion: 0.18
Nodes (24): rowToArma(), rowToCateo(), rowToDetencionInc(), rowToDetencionOfi(), rowToDroga(), rowToExtorsion(), rowToHidrocarburo(), rowToOrdenAprehension() (+16 more)

### Community 40 - "Community 40"
Cohesion: 0.10
Nodes (22): DetalleInfraccionView(), DocumentacionSection(), formatCurrency(), formatDate(), FundamentoLegalSection(), InfraccionDetalle, InfraccionGarantia, InfraccionHeader (+14 more)

### Community 41 - "Community 41"
Cohesion: 0.09
Nodes (11): ad3ec5f mejorando esto, ping(), actualizarSolicitudFotoEstado(), completarSolicitudFoto(), enviarFoto(), getRolUsuario(), insertarEvidenciaDetenido(), insertHistorial() (+3 more)

### Community 42 - "Community 42"
Cohesion: 0.10
Nodes (19): cleanColoniaName(), containerStyle, DEFAULT_CENTER, extractAddress(), extractNeighborhoodFromComponents(), getMunicipioEstado(), LIBRARIES, MapaDireccionRegistro() (+11 more)

### Community 43 - "Community 43"
Cohesion: 0.10
Nodes (7): ProfileDropdownAuxiliar(), Props, 6a042cd feat: sistema de autenticación, dashboard y esquema de base de datos, Enable2FA(), s, Step, authClient

### Community 44 - "Community 44"
Cohesion: 0.12
Nodes (11): rowToDepartamento(), rowToOficialLista(), rowToUserBasico(), toStr(), listarDepartamentosActivos(), obtenerOficialExistente(), upsertOficial(), Departamento (+3 more)

### Community 45 - "Community 45"
Cohesion: 0.08
Nodes (15): AVATAR_COLORS, EstatusInfracciones, Props, SORTABLE_KEYS, STATUS_BADGE, STATUS_TABS, AVATAR_COLORS, EstatusLiberaciones (+7 more)

### Community 46 - "Community 46"
Cohesion: 0.13
Nodes (15): obtenerDashboardLiberaciones(), obtenerLiberaciones(), columns, DataRow, LiberacionesTableProps, ProfileDropdown(), Props, 1acddac Merge branch 'feature/testing' into feature/reportes (+7 more)

### Community 47 - "Community 47"
Cohesion: 0.08
Nodes (22): 11e8817 Merge branch 'testing' into juzgado, 8a59180 Form listo, ec1b658 implementando layaredArchitecture para rol de oficial, ec57fd2 Form actualizado, btnBackStyle, btnNextStyle, btnSubmitStyle, center (+14 more)

### Community 48 - "Community 48"
Cohesion: 0.18
Nodes (23): fix/subir-fotografias, main, 0e33bf6 feat: módulo Admin, Prórroga, Filtros medidas, Autoridades adicionales y Notificaciones/Alertas, 199ce68 Merge branch 'main' of https://github.com/presidenciaSJR/seguridad_publica, 23a3b9d Cambios en la estructura de los reportes de los detenidos, 25de428 Corrección para agregar el botón de cerrar sesion, 2e36377 Eliminar tutoriales de flujo innecesarios, 4271f37 feat(doc): agregar manual de usuario interactivo para el módulo de prevención del delito (+15 more)

### Community 49 - "Community 49"
Cohesion: 0.09
Nodes (17): ac5d42f cerrando flujo de 911-despacho-, eacfdaf mostrando toast de guardado, btnNuevoStyle, btnViewStyle, cardStyle, decoratorStyle, footerStyle, headerInnerStyle (+9 more)

### Community 50 - "Community 50"
Cohesion: 0.14
Nodes (9): 23b7312 Merge pull request #16 from presidenciaSJR/conexion, mapRowToOrdenPago(), OrdenPagoRow, SA7Repository, SA7Service, CatalogoConceptoSA7, GenerarOrdenPagoDTO, OrdenPagoSA7 (+1 more)

### Community 51 - "Community 51"
Cohesion: 0.11
Nodes (16): 91c36bf validando orden de pago, FieldName, isNoData(), Props, TitularForm(), getGarantiaInfo(), ModalEntregarGarantia(), Props (+8 more)

### Community 52 - "Community 52"
Cohesion: 0.11
Nodes (8): rowToLiberacion(), obtenerLiberaciones(), obtenerRolUsuario(), listarLiberaciones(), verificarRolLiberaciones(), LiberacionRow, RolRow, 51e682b mejorando flujo de liberaciones

### Community 53 - "Community 53"
Cohesion: 0.09
Nodes (17): a, AGENTS_PATH, agentsSize, b, BOVEDA_DIR, bovedaDocs, charsToTokens(), __dirname (+9 more)

### Community 54 - "Community 54"
Cohesion: 0.17
Nodes (16): 75ca4b2 Merge pull request #9 from presidenciaSJR/conexion, 953d38a implementando vista de fiscalia, MailAttachment, MailOptions, sendMail(), transporter, enviarCorreoAsignacionFiscalia(), enviarCorreoOrdenLiberacion() (+8 more)

### Community 55 - "Community 55"
Cohesion: 0.14
Nodes (14): generarAlertasBusquedas(), HITOS_ALERTAR, rowToNotificacion(), eliminarAlertasBusqueda(), listarNotificacionesNoLeidas(), marcarNotificacionLeida(), marcarTodasNotificacionesLeidas(), Notificacion (+6 more)

### Community 56 - "Community 56"
Cohesion: 0.14
Nodes (14): actualizarOficial(), buscarUsuariosReincorporar(), crearOficial(), destituirOficial(), obtenerOficialesLista(), obtenerOficialPorId(), reactivarOficialConDatos(), requireAdminTransito() (+6 more)

### Community 57 - "Community 57"
Cohesion: 0.14
Nodes (9): 16a63d4 Merge branch 'feature/testing' of https://github.com/presidenciaSJR/seguridad_publica into feature/testing, ac48eb1 Merge pull request #17 from presidenciaSJR/conexion, GruaRow, listarGruasActivas(), containerStyle, Props, Props, ProfileDropdown() (+1 more)

### Community 58 - "Community 58"
Cohesion: 0.12
Nodes (11): AddressData, eliminarInfraccionAction(), ProcesoEstado, ViewArticulosLista, generarOrdenPago(), config, getStepIndex(), ProcesoModal() (+3 more)

### Community 59 - "Community 59"
Cohesion: 0.16
Nodes (15): b68a2b7 Merge branch 'feature/testing' of https://github.com/presidenciaSJR/seguridad_publica into feature/testing, f9243ac Interfaz de formulario de rol de servicios adaptado a diseño con cambio de colores, Props, RolField(), ServiceFooter(), deviceBox, inputStyle, labelMono (+7 more)

### Community 60 - "Community 60"
Cohesion: 0.10
Nodes (16): Arma, cardStyle, Consolidado, Evento, Fge, Fgr, linkBtn, Medios (+8 more)

### Community 61 - "Community 61"
Cohesion: 0.15
Nodes (18): addDecision(), append(), args, budget(), budgetReport(), DECISIONS_FILE, __dirname, ensureDir() (+10 more)

### Community 62 - "Community 62"
Cohesion: 0.13
Nodes (6): b5233a8 implementando via como modulo de oficial, mapRowToOficialViaDTO(), OfiOficialRow, OficialesViaRepository, OficialesViaService, OfiOficialViaDTO

### Community 63 - "Community 63"
Cohesion: 0.19
Nodes (8): 2c128e5 test expediente vercel, ede5a1d eliminado referencias a via_prueba, f7b1aac Merge branch 'feature/testing' of https://github.com/presidenciaSJR/seguridad_publica into feature/testing, POST(), subirArchivo(), validarArchivo(), getExpedienteHost(), getExpedienteToken()

### Community 64 - "Community 64"
Cohesion: 0.14
Nodes (16): components, __dirname, dirty, EXTENSIONS, fileMap, filesToModify, forceFlag, ROOT (+8 more)

### Community 65 - "Community 65"
Cohesion: 0.16
Nodes (13): 07543de Conexion de reportes con d1 y los diarios, mensuales y semanales, de14b62 Merge branch 'feature/reportes' into feature/testing, f6954ec Conexion a la bd y la generacion de Excel, obtenerArmas(), obtenerCateos(), obtenerDetenidos(), obtenerDrogas(), obtenerExtorsiones() (+5 more)

### Community 66 - "Community 66"
Cohesion: 0.18
Nodes (14): contarPorEstatus(), listarIncidentes(), listarIncidentesRecientes(), obtenerCatalogos(), obtenerIncidente(), obtenerIncidenteConExtras(), obtenerStats(), obtenerTiposIncidente() (+6 more)

### Community 67 - "Community 67"
Cohesion: 0.26
Nodes (13): rowToChecklist(), rowToCuestionarioRobo(), rowToParReporte(), toStr(), obtenerCuestionariosRobo(), obtenerParesReporte(), upsertChecklist(), guardarChecklist() (+5 more)

### Community 68 - "Community 68"
Cohesion: 0.16
Nodes (16): __dirname, dirty, escapeRegex(), EXTENSIONS, fileMap, filesToModify, findFunctionBody(), findFunctionBodyFallback() (+8 more)

### Community 69 - "Community 69"
Cohesion: 0.14
Nodes (13): accionPedirEvidencias(), Props, Tab, tabs, TabSolicitudes(), TomarCasoBoton(), accionPedirEvidencias(), emptyItem() (+5 more)

### Community 70 - "Community 70"
Cohesion: 0.14
Nodes (8): capturarInfractorInfraccionesAction(), FieldName, Props, CapturaInfractorActions, CapturaInfractorState, CapturaInfractorStore, initialState, useCapturaInfractorStore

### Community 71 - "Community 71"
Cohesion: 0.25
Nodes (10): rowToIncidenteCamara(), rowToTotalesCamara(), toNum(), toNumNullable(), toStr(), obtenerIncidentesCamara(), obtenerTotalesCamara(), listarIncidentesCamara() (+2 more)

### Community 72 - "Community 72"
Cohesion: 0.16
Nodes (11): obtenerConcentradoDiario(), obtenerPorTurno(), obtenerReportesD1(), listarReportesD1(), COLS, crearHoja(), GET(), getRango() (+3 more)

### Community 73 - "Community 73"
Cohesion: 0.22
Nodes (6): 27dcb21 Merge branch 'feature/testing' into feature/reportes, ArticulosMapper, QueryRow, ArticulosRepository, ArticuloLey, FraccionLey

### Community 74 - "Community 74"
Cohesion: 0.17
Nodes (8): 5bbdda8 Merge pull request #8 from presidenciaSJR/juzgado, ff6d3c2 juzgado, BotonVerDetalleProps, ConfirmacionModalProps, VARIANTES, columns, DataRow, FiscaliaTableProps

### Community 75 - "Community 75"
Cohesion: 0.21
Nodes (11): actualizarFgr(), crearFgr(), formatFecha(), FormatoNFgrInput, listarFgr(), obtenerFgr(), obtenerFgrPorFechaPeriodo(), parsePeriodo() (+3 more)

### Community 76 - "Community 76"
Cohesion: 0.21
Nodes (11): actualizarMediosAlternativos(), crearMediosAlternativos(), formatFecha(), FormatoNMediosAlternativosInput, listarMediosAlternativos(), obtenerMediosAlternativos(), obtenerMediosAlternativosPorFechaPeriodo(), parsePeriodo() (+3 more)

### Community 77 - "Community 77"
Cohesion: 0.14
Nodes (9): Departamento, inputStyle, labelStyle, Props, selectStyle, AccionModal, Departamento, Oficial (+1 more)

### Community 78 - "Community 78"
Cohesion: 0.22
Nodes (10): 14fd73a Update FormSection.tsx, 305b0bd se quitan campos, 5795f74 Búsqueda de nombre de policía por nómina, 81b9829 Cambios para guardado de persinas afectadas, 917002a Guardado de policia a cargo, bf354f1 Nombre completo de quien captura, d5e0e56 Campo para agregar detenidos de forma dinámica y eliminación de campos extras, d665f95 Camo dinamico y cambio a select en datos positivos (+2 more)

### Community 79 - "Community 79"
Cohesion: 0.20
Nodes (10): 9550203 Cambios en presentacion, se genera, 9d67ddf Cambios de formulario analisis, btnPPTStyle, btnStyle, containerStyle, headerRowStyle, tdStyle, thStyle (+2 more)

### Community 80 - "Community 80"
Cohesion: 0.15
Nodes (11): DocConfig, DOCS_ACCIDENTE, DOCS_DELITO, DOCS_EMPRESA, DOCS_INFRACCION, getEstatusConfig(), MOTIVO_TO_SUBTIPO, Props (+3 more)

### Community 81 - "Community 81"
Cohesion: 0.21
Nodes (8): paginationButtonStyle, PaginationProps, PhoneReport, PhoneReportsTable(), ReportesTabs(), OperationalTable(), OperationalTableProps, styles

### Community 82 - "Community 82"
Cohesion: 0.14
Nodes (9): obtenerDetalleInfraccionViaAction(), BotonVerDetalle(), AVATAR_COLORS, EstatusFiscalia, Props, SORTABLE_KEYS, STATUS_BADGE, STATUS_TABS (+1 more)

### Community 83 - "Community 83"
Cohesion: 0.18
Nodes (13): buildHelperCode(), components, __dirname, dirty, EXTENSIONS, fileMap, filesToModify, findReactImportWithTS() (+5 more)

### Community 84 - "Community 84"
Cohesion: 0.18
Nodes (9): obtenerArticulosAction(), obtenerFraccionesAction(), ArticulosService, Articulo, Fraccion, SeccionMotivoProps, CustomSelect(), CustomSelectProps (+1 more)

### Community 85 - "Community 85"
Cohesion: 0.26
Nodes (11): CWD, __dirname, populateAPIRoutes(), populateComandos(), populateEnvVars(), populateEstructura(), populateFeatures(), populateLibrerias() (+3 more)

### Community 86 - "Community 86"
Cohesion: 0.17
Nodes (11): btnBuscarStyle, btnLimpiarStyle, CANALES, CatalogoItem, ESTATUS, fieldStyle, FiltrosIncidentes(), inputStyle (+3 more)

### Community 87 - "Community 87"
Cohesion: 0.17
Nodes (9): 3c12c41 cambios en flujo de 911-despacho, 7a1ae94 911-rondin, child, LOG, needsShell, opts, ORIG, PID_FILE (+1 more)

### Community 88 - "Community 88"
Cohesion: 0.18
Nodes (6): guardarOficioAction(), CargarOficioSectionProps, Toast, ToastStore, ToastType, useToastStore

### Community 89 - "Community 89"
Cohesion: 0.17
Nodes (2): LogLine, LogType

### Community 90 - "Community 90"
Cohesion: 0.24
Nodes (11): buildInstructions(), buildKeywords(), CONTEXT_MAP, __dirname, extractDomain(), GRAPH_JSON, KEYWORDS, main() (+3 more)

### Community 91 - "Community 91"
Cohesion: 0.38
Nodes (7): 4c9fa8a vista de reporte de d1 no iniciada, 712c116 Merge branch 'testing' into conexion, DescargaFilters(), DescargaPagination(), PaginationProps, DescargaTable(), styles

### Community 92 - "Community 92"
Cohesion: 0.40
Nodes (7): 98e7e6e vista de reportes de d1, b233bc7 Merge branch 'testing' into conexion, D1Filters(), D1Pagination(), PaginationProps, D1ReportsTable(), styles

### Community 93 - "Community 93"
Cohesion: 0.31
Nodes (8): af993fb Fix/Monitorista, rowToReporteD1(), toBool(), toNum(), toStr(), insertarReporteDenuncia(), verificarFolioDenunciaUnico(), ReporteD1

### Community 94 - "Community 94"
Cohesion: 0.18
Nodes (3): Module, ModuleCards(), MODULES

### Community 95 - "Community 95"
Cohesion: 0.18
Nodes (2): DC, DCCtx

### Community 96 - "Community 96"
Cohesion: 0.18
Nodes (1): WF

### Community 97 - "Community 97"
Cohesion: 0.33
Nodes (8): rowToCatalogo(), rowToIncidenteDetalle(), rowToIncidenteResumen(), toNum(), toStr(), CatalogoItem, IncidenteDetalle, IncidenteResumen

### Community 98 - "Community 98"
Cohesion: 0.20
Nodes (1): TWEAKS

### Community 99 - "Community 99"
Cohesion: 0.36
Nodes (9): formato_n_armas_aseguradas, formato_n_atencion_victimas, formato_n_eventos, formato_n_fge, formato_n_fgr, formato_n_medios_alternativos, formato_n_reportes, formato_n_rnd (+1 more)

### Community 100 - "Community 100"
Cohesion: 0.20
Nodes (7): btnSubmitStyle, fieldContainerStyle, grid2Style, iconStyle, inputStyle, labelStyle, sectionTitleStyle

### Community 101 - "Community 101"
Cohesion: 0.24
Nodes (6): PasoInfraccionProps, MAPA_GARANTIAS, SeccionGarantia(), SeccionGarantiaProps, SeccionMotivo(), SelectWrapper()

### Community 102 - "Community 102"
Cohesion: 0.22
Nodes (8): arrowBtnStyle, containerStyle, infoStyle, labelStyle, pageNumberStyle, Pagination(), PaginationProps, valueStyle

### Community 103 - "Community 103"
Cohesion: 0.22
Nodes (4): Accion, PermisoSeccion, Seccion, SECCIONES

### Community 104 - "Community 104"
Cohesion: 0.22
Nodes (4): Accion, PermisoSeccion, Seccion, SECCIONES

### Community 105 - "Community 105"
Cohesion: 0.22
Nodes (4): Accion, PermisoSeccion, Seccion, SECCIONES

### Community 106 - "Community 106"
Cohesion: 0.22
Nodes (4): Accion, PermisoSeccion, Seccion, SECCIONES

### Community 107 - "Community 107"
Cohesion: 0.22
Nodes (1): TWEAKS

### Community 108 - "Community 108"
Cohesion: 0.22
Nodes (4): Accion, PermisoSeccion, Seccion, SECCIONES

### Community 109 - "Community 109"
Cohesion: 0.33
Nodes (7): __dirname, getColumns(), getEnums(), getSchemas(), getTables(), main(), ROOT

### Community 110 - "Community 110"
Cohesion: 0.25
Nodes (6): CONTEXT_MAP_PATH, __dirname, GRAPH_JSON, LOADER_SCRIPT, ROOT, SKILL_PATH

### Community 111 - "Community 111"
Cohesion: 0.36
Nodes (6): ColumnInfo, getColumns(), getEnums(), getTables(), main(), SCHEMAS

### Community 112 - "Community 112"
Cohesion: 0.29
Nodes (2): HistorialIncidente(), HistorialIncidente

### Community 113 - "Community 113"
Cohesion: 0.33
Nodes (5): btnDetalle, DetenidoRow, FotoInfo, TablaDetenidos(), tabStyle()

### Community 114 - "Community 114"
Cohesion: 0.52
Nodes (6): drawWatermark(), formatearFecha(), formatearOficio(), generarOrdenSalidaVehiculo(), loadImageAsBase64(), parrafoMixtoConWrap()

### Community 115 - "Community 115"
Cohesion: 0.33
Nodes (6): CONTEXT_MAP, __dirname, extractDomain(), KEYWORDS, loadKeywords(), ROOT

### Community 116 - "Community 116"
Cohesion: 0.29
Nodes (3): PasoConfirmacionProps, SeccionEstructurada, Props

### Community 117 - "Community 117"
Cohesion: 0.33
Nodes (2): a58a0f7 Despachos, ReporteCampoDetalle

### Community 118 - "Community 118"
Cohesion: 0.40
Nodes (5): Session, config, isPublic(), proxy(), PUBLIC_PATHS

### Community 119 - "Community 119"
Cohesion: 0.40
Nodes (4): calcularSemaforoVigencia(), SemaforoColor, CFG, SemaforoVigencia()

### Community 120 - "Community 120"
Cohesion: 0.50
Nodes (5): formatDate(), getStatusStyle(), InfraccionCiudadanoPage(), sanitize(), timeAgo()

### Community 121 - "Community 121"
Cohesion: 0.40
Nodes (2): cancelarFicha(), CancelacionModal()

### Community 122 - "Community 122"
Cohesion: 0.40
Nodes (4): createProrroga(), I, L, ProrrogaModal()

### Community 123 - "Community 123"
Cohesion: 0.50
Nodes (2): ModuleCardProps, Stat

### Community 124 - "Community 124"
Cohesion: 0.50
Nodes (1): MAIN_ROUTES

### Community 125 - "Community 125"
Cohesion: 0.50
Nodes (2): ADMIN, pool

### Community 126 - "Community 126"
Cohesion: 0.50
Nodes (2): Filtros, IncidenteResumen

### Community 127 - "Community 127"
Cohesion: 0.50
Nodes (3): MapaPinFijo(), PIN_ICONS, Props

### Community 128 - "Community 128"
Cohesion: 1.00
Nodes (2): obtenerTokenFiscalia(), subirArchivoFiscalia()

### Community 129 - "Community 129"
Cohesion: 0.67
Nodes (1): IncidenteDetalle

### Community 130 - "Community 130"
Cohesion: 0.67
Nodes (2): ProrrogaViewerModal(), ProrrogaViewerModalProps

### Community 131 - "Community 131"
Cohesion: 0.67
Nodes (1): InputProps

### Community 132 - "Community 132"
Cohesion: 0.67
Nodes (1): SectionProps

### Community 133 - "Community 133"
Cohesion: 1.00
Nodes (1): eslintConfig

### Community 134 - "Community 134"
Cohesion: 1.00
Nodes (1): config

## Knowledge Gaps
- **794 isolated node(s):** `__dirname`, `ROOT`, `TOKEN_LOG`, `GRAPH_PATH`, `CHECKPOINT_SCRIPT` (+789 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Community 89`** (2 nodes): `LogLine`, `LogType`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 95`** (2 nodes): `DC`, `DCCtx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 96`** (1 nodes): `WF`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 98`** (1 nodes): `TWEAKS`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 107`** (1 nodes): `TWEAKS`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 112`** (2 nodes): `HistorialIncidente()`, `HistorialIncidente`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 117`** (2 nodes): `a58a0f7 Despachos`, `ReporteCampoDetalle`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 121`** (2 nodes): `cancelarFicha()`, `CancelacionModal()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 123`** (2 nodes): `ModuleCardProps`, `Stat`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 124`** (1 nodes): `MAIN_ROUTES`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 125`** (2 nodes): `ADMIN`, `pool`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 126`** (2 nodes): `Filtros`, `IncidenteResumen`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 128`** (2 nodes): `obtenerTokenFiscalia()`, `subirArchivoFiscalia()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 129`** (1 nodes): `IncidenteDetalle`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 130`** (2 nodes): `ProrrogaViewerModal()`, `ProrrogaViewerModalProps`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 131`** (1 nodes): `InputProps`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 132`** (1 nodes): `SectionProps`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 133`** (1 nodes): `eslintConfig`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 134`** (1 nodes): `config`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `auth` connect `Community 2` to `Community 16`, `Community 56`, `Community 57`, `Community 1`, `Community 21`, `Community 9`, `Community 25`, `Community 34`, `Community 50`, `Community 0`, `Community 58`, `Community 10`, `Community 28`, `Community 11`, `Community 3`, `Community 23`, `Community 41`, `Community 65`, `Community 72`, `Community 24`, `Community 6`, `Community 117`, `Community 75`, `Community 76`, `Community 63`, `Community 5`, `Community 4`, `Community 22`, `Community 49`, `Community 33`, `Community 55`, `Community 26`, `Community 20`, `Community 38`, `Community 30`, `Community 8`, `Community 31`, `Community 19`, `Community 7`?**
  _High betweenness centrality (0.033) - this node is a cross-community bridge._
- **Why does `query()` connect `Community 1` to `Community 66`, `Community 37`, `Community 56`, `Community 44`, `Community 29`, `Community 9`, `Community 25`, `Community 52`, `Community 67`, `Community 71`, `Community 57`, `Community 11`, `Community 93`, `Community 6`, `Community 28`, `Community 41`, `Community 22`, `Community 13`, `Community 38`, `Community 73`, `Community 23`, `Community 33`, `Community 5`, `Community 55`, `Community 3`, `Community 62`, `Community 2`, `Community 18`, `Community 0`, `Community 75`, `Community 76`, `Community 30`, `Community 39`, `Community 31`, `Community 16`, `Community 8`, `Community 50`, `Community 34`?**
  _High betweenness centrality (0.026) - this node is a cross-community bridge._
- **Why does `SA7Repository` connect `Community 50` to `Community 63`?**
  _High betweenness centrality (0.002) - this node is a cross-community bridge._
- **What connects `__dirname`, `ROOT`, `TOKEN_LOG` to the rest of the system?**
  _794 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.02787088764742396 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.0282077743378053 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.04552165354330709 - nodes in this community are weakly interconnected._