# Graph Report - .  (2026-07-15)

## Corpus Check
- Large corpus: 733 files · ~516,597 words. Semantic extraction will be expensive (many Claude tokens). Consider running on a subfolder, or use --no-semantic to run AST-only.

## Summary
- 3716 nodes · 13331 edges · 125 communities detected
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output
- Edge kinds: MODIFIES: 4807 · contains: 2807 · imports: 2029 · ON_BRANCH: 1440 · imports_from: 1392 · calls: 417 · PARENT_OF: 341 · re_exports: 52 · method: 29 · references: 9 · inherits: 8


## Input Scope
- Requested: auto
- Resolved: committed (source: default-auto)
- Included files: 733 · Candidates: 884
- Excluded: 0 untracked · 77081 ignored · 1 sensitive · 30 missing committed
- Recommendation: Use --scope all or graphify.yaml inputs.corpus for a knowledge-base folder.

## Graph Freshness
- Built from Git commit: `8ce87da`
- Compare this hash to `git rev-parse HEAD` before trusting freshness-sensitive graph output.
## God Nodes (most connected - your core abstractions)
1. `auth` - 147 edges
2. `query()` - 65 edges
3. `DashboardHeader()` - 47 edges
4. `getUserWithRole()` - 40 edges
5. `tienePermiso()` - 22 edges
6. `tienePermiso()` - 19 edges
7. `verificarRolOficial()` - 18 edges
8. `SubHeader()` - 17 edges
9. `authClient` - 15 edges
10. `obtenerHubRol()` - 15 edges

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
Cohesion: 0.05
Nodes (44): { GET, POST }, TIPO_CFG, 5558751 feat: módulo Prevención del Delito completo + fix flujo autenticación 2FA, 5618308 guardado e evidencias con ed, 77ddf58 Merge branch 'feature/testing' of https://github.com/presidenciaSJR/seguridad_publica into feature/testing, ad3ec5f mejorando esto, f2c66e6 Extender roles y permisos finos a incidentes, prevención, auxiliar, 911, análisis, denuncia D1 y Formato N, ffcea0c fase 1 completada (+36 more)

### Community 1 - "Community 1"
Cohesion: 0.02
Nodes (71): guardarDetallesAseguradosJuzgadoAction(), guardarPuestaDisposicionJuzgadoAction(), obtenerDetalleAseguradoCompletoJuzgadoAction(), obtenerPuestaDisposicionJuzgadoAction(), obtenerDetalleInfraccionLiberaciones(), obtenerDetalleAseguradoCompletoAction(), obtenerDetalleInfraccionViaAction(), obtenerPuestaDisposicionAction() (+63 more)

### Community 2 - "Community 2"
Cohesion: 0.05
Nodes (49): 06c55f5 Merge branch 'feature/testing' into feature/reportes, 41ea169 Merge branch 'testing' into conexion, 8355ac0 Merge branch 'feature/testing' into feature/implementacion-consumir-datos-denuncia, a2e0623 Consolidado de formatos N y SubHeader, ajustes en servicios de reportes, bb10dcd Formatos V1, c95f412 Merge branch 'feature/testing' of https://github.com/presidenciaSJR/seguridad_publica into feature/testing, f5fac0b Merge branch 'testing' into conexion, filtroBtn() (+41 more)

### Community 3 - "Community 3"
Cohesion: 0.06
Nodes (36): tieneAlgunAcceso(), getStats(), verificarRolAgente911(), verificarRolAgenteBitacorista(), verificarRolAgenteDespacho(), obtenerLiberacionesAction(), getUserWithRole(), HUB_POR_ROL (+28 more)

### Community 4 - "Community 4"
Cohesion: 0.04
Nodes (67): accionPedirEvidencias(), guardarDetallesAseguradoAction(), CapturarDetallesForm(), disabledSx, emptyItem(), EvidenciaItem, inputSx, labelSx (+59 more)

### Community 5 - "Community 5"
Cohesion: 0.05
Nodes (44): capturarInfractorAction(), finalizarRevisionAction(), generarOrdenPagoAction(), obtenerDashboardLiberaciones(), obtenerDocumentosLiberacion(), obtenerLiberaciones(), revisarDocumentoAction(), AVATAR_COLORS (+36 more)

### Community 6 - "Community 6"
Cohesion: 0.05
Nodes (75): num(), parseDetenidos(), parseSolicitudesJson(), parseTurno(), rowToDenunciaDetalle(), rowToDependencia(), rowToEvidencia(), rowToEvidenciaArchivo() (+67 more)

### Community 7 - "Community 7"
Cohesion: 0.14
Nodes (71): feature/monitorista, feature/monitorista-reportes, fix/detenidos, fix/incidentes-camara, fix/subir-fotografias, libraries, 0844e6e Corregido, 0e33bf6 feat: módulo Admin, Prórroga, Filtros medidas, Autoridades adicionales y Notificaciones/Alertas (+63 more)

### Community 8 - "Community 8"
Cohesion: 0.10
Nodes (76): conexion, feature/testing, main, testing, 0c8695c Cambios en filtros, 0caf5dd Fixes, 11e8817 Merge branch 'testing' into juzgado, 11ee4f2 mejorando flujo de 911 (+68 more)

### Community 9 - "Community 9"
Cohesion: 0.06
Nodes (66): 13f7f39 Reporte-incidentes, 2e958e1 catalogo de grupo de incidencia, 5ef7cf3 Agregar los campos faltantes, 712c116 Merge branch 'testing' into conexion, 9d803f2 fix api maps, ef95840 Merge branch 'feature/testing' of https://github.com/presidenciaSJR/seguridad_publica into feature/testing, fcb223f merge de testing, parseJsonField() (+58 more)

### Community 10 - "Community 10"
Cohesion: 0.05
Nodes (59): 067c4de arreglando flujo de fiscalia  a schema via, accionTomarCaso(), AseguradosData, guardarDetallesAseguradoAction(), LiberacionesData, obtenerSolicitudes(), SolicitudesData, rowToAsegurado() (+51 more)

### Community 11 - "Community 11"
Cohesion: 0.04
Nodes (54): obtenerEvidenciasMonitorista(), obtenerDatosAsegurado(), verificarRolJuzgado(), 1f7c0d7 Merge pull request #23 from presidenciaSJR/conexion, 375d265 flujo de fiscalia, 6109a7a replicando flujo para fiscalia, CapturarDetallesForm(), disabledSx (+46 more)

### Community 12 - "Community 12"
Cohesion: 0.04
Nodes (46): btnBackStyle, btnFinishStyle, btnGeoStyle, btnNextStyle, cardStyle, footerActions, grid3, labelStyle (+38 more)

### Community 13 - "Community 13"
Cohesion: 0.07
Nodes (55): 0d9172a mejorando flujo de 911-despacho, rowToAlarmaEscolar(), rowToDespacho(), rowToDespachoElemento(), rowToDespachoUnidad(), rowToExtorsion(), rowToIncidenteBasico(), rowToIncidenteConDespachoBase() (+47 more)

### Community 14 - "Community 14"
Cohesion: 0.05
Nodes (40): 5bbdda8 Merge pull request #8 from presidenciaSJR/juzgado, 75ca4b2 Merge pull request #9 from presidenciaSJR/conexion, 953d38a implementando vista de fiscalia, ff6d3c2 juzgado, MailAttachment, MailOptions, sendMail(), transporter (+32 more)

### Community 15 - "Community 15"
Cohesion: 0.08
Nodes (57): createBodyCam(), createConcepto(), createMedioCanalizacion(), createRadio(), createSector(), createTipoEmergencia(), createTipoObservacion(), req() (+49 more)

### Community 16 - "Community 16"
Cohesion: 0.06
Nodes (51): accionCerrarCaso(), accionTomarCaso(), AseguradosJuzgadoData, LiberacionesData, obtenerSolicitudes(), SolicitudesData, num(), rowToInfraccionDetalle() (+43 more)

### Community 17 - "Community 17"
Cohesion: 0.07
Nodes (36): 126b4d1 Monitorista V1, 46b2c89 Merge branch 'testing' into juzgado, 5d179c0 Apartado de reportes, 8e6c8c6 Apartado de reportes, da33516 Merge pull request #3 from presidenciaSJR/feature/monitorista, limpiarCacheToken(), obtenerGuestToken(), subirArchivoExpediente() (+28 more)

### Community 18 - "Community 18"
Cohesion: 0.05
Nodes (40): 435348e corrigiendo flujo de rondin, f0089cf Merge pull request #21 from presidenciaSJR/conexion, BTN, BTN_SM, DespachoForm(), Elemento, ERR, I (+32 more)

### Community 19 - "Community 19"
Cohesion: 0.05
Nodes (42): Accion, registrarAudit(), obtenerIphDetenido(), obtenerPrellenadoCompleto(), obtenerSolicitudConEvidencias(), obtenerPrellenado(), actualizarArmaAsegurada(), ArmaFuente (+34 more)

### Community 20 - "Community 20"
Cohesion: 0.07
Nodes (34): createUser(), requireAdmin(), updateUser(), requireAuxiliar(), upsertChecklistAction(), 11be750 Fase 1 de correccion - completada - pendiente testing, generarFolioIncidente(), ActionResult (+26 more)

### Community 21 - "Community 21"
Cohesion: 0.06
Nodes (43): liberarGarantiaInfraccionesAction(), obtenerDashboardInfracciones(), obtenerDetalleInfraccionInfracciones(), obtenerInfracciones(), inputToDbParams(), nvl(), rowToLiberacion(), getGarantiaInfo() (+35 more)

### Community 22 - "Community 22"
Cohesion: 0.06
Nodes (33): insertarDocumentoLiberacion(), 16df128 flujo de corralones listo, 5a1b5d5 empezando corralon, obtenerDashboardCorralon(), obtenerSolicitudes(), TabSolicitudes, rowToSolicitud(), toStr() (+25 more)

### Community 23 - "Community 23"
Cohesion: 0.10
Nodes (29): ProfileDropdownAuxiliar(), Props, 0068216 Mejora de Dashboard, Login y transiciones de pantallas, b170599 Merge branch 'feature/testing' of https://github.com/presidenciaSJR/seguridad_publica into feature/testing, b403f89 Vista para reportes de incidentes por camaras y cambio den header, bd1a223 Merge branch 'feature/vistas-reportes' into feature/testing, bf2e7ed Reportes del modulo de incidentes, de14b62 Merge branch 'feature/reportes' into feature/testing (+21 more)

### Community 24 - "Community 24"
Cohesion: 0.11
Nodes (27): 156c925 vista de reporte de sin robos, 22b7b54 Merge branch 'feature/reportes' into feature/testing, 2516723 Modulo de permisos, 4c9fa8a vista de reporte de d1 no iniciada, 552d291 Merge branch 'testing' into conexion, 97a156c Reportes con D1, sin D1 y sin robo, DescargaFilters(), DescargaPagination() (+19 more)

### Community 25 - "Community 25"
Cohesion: 0.05
Nodes (27): Accion, obtenerRolNombre(), PermisoSeccion, ROLES_PERMITIDOS, Seccion, SECCIONES, tieneAccesoHub(), tieneAccesoSeccion() (+19 more)

### Community 26 - "Community 26"
Cohesion: 0.06
Nodes (26): guardarOficioJuzgadoAction(), obtenerDetalleInfraccionViaActionJuzgado(), BotonVerDetalle(), BotonVerDetalleProps, CargarOficioSectionProps, ConfirmacionModalProps, VARIANTES, AVATAR_COLORS (+18 more)

### Community 27 - "Community 27"
Cohesion: 0.08
Nodes (44): rowToAutoridadAdicional(), rowToBusqueda(), rowToContestacion(), rowToFichaBusquedaDetalle(), rowToMedida(), rowToMedidaDetalle(), rowToSeguimiento(), rowToSolicitud() (+36 more)

### Community 28 - "Community 28"
Cohesion: 0.11
Nodes (25): obtenerDashboardJuzgado(), ProfileDropdown(), Props, ToastExito(), 090c4dd vista de fiscalia, 44ebbc4 Merge branch 'feature/testing' of https://github.com/presidenciaSJR/seguridad_publica into testing, 997ef65 Merge pull request #2 from presidenciaSJR/juzgado, a291695 Merge branch 'feature/testing' into feature/denuncias (+17 more)

### Community 29 - "Community 29"
Cohesion: 0.07
Nodes (34): obtenerAseguradosJuzgadoAction(), concatNombre(), disabledSx, displayVal(), FormularioAseguradoJuzgado(), labelSx, Props, metadata (+26 more)

### Community 30 - "Community 30"
Cohesion: 0.08
Nodes (22): SubirFotoDetenido(), 388b997 Apartados para subir fotografias de los detenidos, 672bab5 libearciones para juzgado, de5682f Merge pull request #10 from presidenciaSJR/fix/subir-fotografias, FilaDetenidoRol(), btnDetalle, pagBtn, SubirFotoDetenido() (+14 more)

### Community 31 - "Community 31"
Cohesion: 0.05
Nodes (30): btnPrimario, btnSecundario, inputStyle, labelStyle, pageWrap, selectStyle, btnPrimario(), btnSecundario (+22 more)

### Community 32 - "Community 32"
Cohesion: 0.09
Nodes (27): AccionModal, Departamento, Oficial, Props, Props, c27a9ee fase prefinal, dc063f3 gestion de oficiales correctamente, rowToPatrulla() (+19 more)

### Community 33 - "Community 33"
Cohesion: 0.08
Nodes (24): 16a63d4 Merge branch 'feature/testing' of https://github.com/presidenciaSJR/seguridad_publica into feature/testing, 91c36bf validando orden de pago, ac48eb1 Merge pull request #17 from presidenciaSJR/conexion, FieldName, isNoData(), Props, TitularForm(), containerStyle (+16 more)

### Community 34 - "Community 34"
Cohesion: 0.09
Nodes (33): rowToIncidenteCamara(), rowToTotalesCamara(), toNum(), toNumNullable(), toStr(), obtenerConcentradoDiario(), obtenerIncidentesCamara(), obtenerPorTurno() (+25 more)

### Community 35 - "Community 35"
Cohesion: 0.06
Nodes (23): Field(), FormActions(), FormHeader(), Section(), Select(), Textarea(), AUTORIDADES, btnPrimario() (+15 more)

### Community 36 - "Community 36"
Cohesion: 0.12
Nodes (34): rowToArma(), rowToCateo(), rowToDetencionInc(), rowToDetencionOfi(), rowToDroga(), rowToExtorsion(), rowToHidrocarburo(), rowToOrdenAprehension() (+26 more)

### Community 37 - "Community 37"
Cohesion: 0.06
Nodes (23): 3c12c41 cambios en flujo de 911-despacho, 7a1ae94 911-rondin, cacheGet(), cacheKey(), cacheSet(), CHECKPOINT_SCRIPT, ContextLoaderPlugin(), DECISION_MSG (+15 more)

### Community 38 - "Community 38"
Cohesion: 0.09
Nodes (18): actionTextStyle, cardContentStyle, cardDescStyle, cardStyle, cardTitleStyle, decoratorLine, iconBoxStyle, systemStatusStyle (+10 more)

### Community 39 - "Community 39"
Cohesion: 0.09
Nodes (12): 27dcb21 Merge branch 'feature/testing' into feature/reportes, f7b1aac Merge branch 'feature/testing' of https://github.com/presidenciaSJR/seguridad_publica into feature/testing, ArticulosMapper, QueryRow, ArticulosRepository, ArticuloLey, FraccionLey, mapRowToOficialViaDTO() (+4 more)

### Community 40 - "Community 40"
Cohesion: 0.07
Nodes (12): 863c575 Merge pull request #24 from presidenciaSJR/feature/testing, POST(), subirArchivo(), validarArchivo(), IncidenteDetalle, Filtros, IncidenteResumen, ReporteCampoDetalle (+4 more)

### Community 41 - "Community 41"
Cohesion: 0.10
Nodes (18): Props, Props, Props, ArchivoField, Props, InfraccionCreada, PasoPagoProps, COLORES (+10 more)

### Community 42 - "Community 42"
Cohesion: 0.10
Nodes (25): actualizarDatosInfractorIniciarProceso(), actualizarEstatusDependenciaMesaControl(), actualizarEstatusPendientePagoInfraccion(), actualizarEstatusSolicitudLiberacion(), actualizarEvidenciasInfraccion(), actualizarUrlOrdenSalida(), actualizarUrlsDocumentosInfraccion(), cerrarInfraccion() (+17 more)

### Community 43 - "Community 43"
Cohesion: 0.15
Nodes (28): 09a02d5 Fix Reporte Rondin, 22bf125 Merge pull request #20 from presidenciaSJR/conexion, f4cf76c Actualización Rondin, addPersonaAfectada(), CANALES, cerrarPorDetencion(), createAlarmaEscolar(), createDespacho() (+20 more)

### Community 44 - "Community 44"
Cohesion: 0.07
Nodes (20): AGENTS_PATH, agentsChars, BOVEDA_DIR, charsToTokens(), __dirname, discoveryCost, { docs, chars: bovedaChars }, estimateYoumindagContext() (+12 more)

### Community 45 - "Community 45"
Cohesion: 0.13
Nodes (21): 0c31cc2 Merge branch 'testing' into juzgado, 290d651 feat(despacho): flujo integral 911 → despacho → oficial → D1 → legal, 458bbfb registro de reporte de campo - oficial, 93dd3ea Merge pull request #1 from presidenciaSJR/juzgado, aaddee5 Merge branch 'feature/testing' into feature/denuncias, b79a96a Conexión entre ambos modulos, accounts, sessions (+13 more)

### Community 46 - "Community 46"
Cohesion: 0.11
Nodes (20): cardStyle, rowToRol(), rowToUsuarioLista(), toStr(), actualizarUsuario(), asignarRolUsuario(), crearRol(), eliminarSesion() (+12 more)

### Community 47 - "Community 47"
Cohesion: 0.15
Nodes (12): verificarRolInfracciones(), verificarRolLiberaciones(), 23b7312 Merge pull request #16 from presidenciaSJR/conexion, ede5a1d eliminado referencias a via_prueba, verificarRolOficial(), mapRowToOrdenPago(), OrdenPagoRow, SA7Repository (+4 more)

### Community 48 - "Community 48"
Cohesion: 0.10
Nodes (22): DetalleInfraccionView(), DocumentacionSection(), formatCurrency(), formatDate(), FundamentoLegalSection(), InfraccionDetalle, InfraccionGarantia, InfraccionHeader (+14 more)

### Community 49 - "Community 49"
Cohesion: 0.10
Nodes (19): actualizarOficial(), buscarUsuariosReincorporar(), crearOficial(), destituirOficial(), obtenerOficialesLista(), obtenerOficialPorId(), reactivarOficialConDatos(), requireAdminTransito() (+11 more)

### Community 50 - "Community 50"
Cohesion: 0.13
Nodes (15): b5233a8 implementando via como modulo de oficial, mapCrearInfraccionToDB(), mapInfraccionDetalle(), InfraccionesRepository, generarFolioInfraccion(), InfraccionesService, randomBase36Char(), rellenarBase36() (+7 more)

### Community 51 - "Community 51"
Cohesion: 0.10
Nodes (19): cleanColoniaName(), containerStyle, DEFAULT_CENTER, extractAddress(), extractNeighborhoodFromComponents(), getMunicipioEstado(), LIBRARIES, MapaDireccionRegistro() (+11 more)

### Community 52 - "Community 52"
Cohesion: 0.12
Nodes (11): rowToDepartamento(), rowToOficialLista(), rowToUserBasico(), toStr(), listarDepartamentosActivos(), obtenerOficialExistente(), upsertOficial(), Departamento (+3 more)

### Community 53 - "Community 53"
Cohesion: 0.13
Nodes (15): generarAlertasBusquedas(), HITOS_ALERTAR, rowToNotificacion(), eliminarAlertasBusqueda(), listarNotificacionesNoLeidas(), marcarNotificacionLeida(), marcarTodasNotificacionesLeidas(), Notificacion (+7 more)

### Community 54 - "Community 54"
Cohesion: 0.12
Nodes (7): 6a042cd feat: sistema de autenticación, dashboard y esquema de base de datos, ProfileDropdown(), Props, Enable2FA(), s, Step, authClient

### Community 55 - "Community 55"
Cohesion: 0.11
Nodes (15): COLOR_MAP, addAutoridadMedida(), AgregarAutoridadForm(), Autoridad, AUTORIDADES, I, L, Props (+7 more)

### Community 56 - "Community 56"
Cohesion: 0.09
Nodes (15): btnNuevoStyle, btnViewStyle, cardStyle, decoratorStyle, footerStyle, headerInnerStyle, ROLES_PERMITIDOS, SearchParams (+7 more)

### Community 57 - "Community 57"
Cohesion: 0.09
Nodes (17): a, AGENTS_PATH, agentsSize, b, BOVEDA_DIR, bovedaDocs, charsToTokens(), __dirname (+9 more)

### Community 58 - "Community 58"
Cohesion: 0.14
Nodes (17): Accion, aplicarPlantillaRol(), guardarPermiso(), guardarPermisosSeccionesAction(), guardarPlantillaSeccion(), guardarPlantillaSeccionesAction(), mapaBase(), mapaDefault() (+9 more)

### Community 59 - "Community 59"
Cohesion: 0.10
Nodes (16): Arma, cardStyle, Consolidado, Evento, Fge, Fgr, linkBtn, Medios (+8 more)

### Community 60 - "Community 60"
Cohesion: 0.15
Nodes (18): addDecision(), append(), args, budget(), budgetReport(), DECISIONS_FILE, __dirname, ensureDir() (+10 more)

### Community 61 - "Community 61"
Cohesion: 0.14
Nodes (11): AddressData, eliminarInfraccionAction(), ProcesoEstado, ViewArticulosLista, generarOrdenPago(), config, getStepIndex(), ProcesoModal() (+3 more)

### Community 62 - "Community 62"
Cohesion: 0.18
Nodes (18): Alignment, allBorders, dRow(), GET(), hRow(), NO_BORDER, noBorders, p() (+10 more)

### Community 63 - "Community 63"
Cohesion: 0.13
Nodes (13): Props, RolField(), ServiceFooter(), deviceBox, inputStyle, labelMono, Props, selectStyle (+5 more)

### Community 64 - "Community 64"
Cohesion: 0.14
Nodes (16): components, __dirname, dirty, EXTENSIONS, fileMap, filesToModify, forceFlag, ROOT (+8 more)

### Community 65 - "Community 65"
Cohesion: 0.24
Nodes (14): rowToChecklist(), rowToCuestionarioRobo(), rowToParReporte(), toStr(), obtenerCuestionariosRobo(), obtenerParesReporte(), upsertChecklist(), guardarChecklist() (+6 more)

### Community 66 - "Community 66"
Cohesion: 0.14
Nodes (14): BandejaSolicitudes(), btnDetalle, btnPrimary, btnSuccess, origenBadge, SolicitudRow, tabStyle(), btnCancel (+6 more)

### Community 67 - "Community 67"
Cohesion: 0.18
Nodes (14): contarPorEstatus(), listarIncidentes(), listarIncidentesRecientes(), obtenerCatalogos(), obtenerIncidente(), obtenerIncidenteConExtras(), obtenerStats(), obtenerTiposIncidente() (+6 more)

### Community 68 - "Community 68"
Cohesion: 0.12
Nodes (10): AVATAR_COLORS, EstatusInfracciones, Props, SORTABLE_KEYS, STATUS_BADGE, STATUS_TABS, columns, DataRow (+2 more)

### Community 69 - "Community 69"
Cohesion: 0.24
Nodes (9): 2fcba7b vista de reportes de incidentes diarios y semanales, 719b5ab cambio para generacion de reportes semanal y diario, FiltrosIncidencias(), PaginationProps, IncidenteStat(), styles, Props, RowData (+1 more)

### Community 70 - "Community 70"
Cohesion: 0.21
Nodes (12): rowToReporteD1(), toBool(), toNum(), toStr(), insertarReporteDenuncia(), obtenerGruposAdscripcion(), obtenerReportesD1(), verificarFolioDenunciaUnico() (+4 more)

### Community 71 - "Community 71"
Cohesion: 0.18
Nodes (13): actualizarFge(), ConteosCalculados, crearFge(), formatFecha(), FormatoNFge, FormatoNFgeInput, listarFge(), obtenerFge() (+5 more)

### Community 72 - "Community 72"
Cohesion: 0.16
Nodes (16): __dirname, dirty, escapeRegex(), EXTENSIONS, fileMap, filesToModify, findFunctionBody(), findFunctionBodyFallback() (+8 more)

### Community 73 - "Community 73"
Cohesion: 0.16
Nodes (10): 67b1cb7 ReporteWord, 7e39526 Mejoras UI/UX, CARD, G3, INP, LBL, NUM, SEC (+2 more)

### Community 74 - "Community 74"
Cohesion: 0.19
Nodes (12): actualizarFgr(), crearFgr(), formatFecha(), FormatoNFgr, FormatoNFgrInput, listarFgr(), obtenerFgr(), obtenerFgrPorFechaPeriodo() (+4 more)

### Community 75 - "Community 75"
Cohesion: 0.19
Nodes (12): actualizarMediosAlternativos(), crearMediosAlternativos(), formatFecha(), FormatoNMediosAlternativos, FormatoNMediosAlternativosInput, listarMediosAlternativos(), obtenerMediosAlternativos(), obtenerMediosAlternativosPorFechaPeriodo() (+4 more)

### Community 76 - "Community 76"
Cohesion: 0.14
Nodes (8): capturarInfractorInfraccionesAction(), FieldName, Props, CapturaInfractorActions, CapturaInfractorState, CapturaInfractorStore, initialState, useCapturaInfractorStore

### Community 77 - "Community 77"
Cohesion: 0.37
Nodes (8): 07543de Conexion de reportes con d1 y los diarios, mensuales y semanales, 98e7e6e vista de reportes de d1, b233bc7 Merge branch 'testing' into conexion, D1Filters(), D1Pagination(), PaginationProps, D1ReportsTable(), styles

### Community 78 - "Community 78"
Cohesion: 0.15
Nodes (11): DocConfig, DOCS_ACCIDENTE, DOCS_DELITO, DOCS_EMPRESA, DOCS_INFRACCION, getEstatusConfig(), MOTIVO_TO_SUBTIPO, Props (+3 more)

### Community 79 - "Community 79"
Cohesion: 0.18
Nodes (13): buildHelperCode(), components, __dirname, dirty, EXTENSIONS, fileMap, filesToModify, findReactImportWithTS() (+5 more)

### Community 80 - "Community 80"
Cohesion: 0.24
Nodes (9): 14fd73a Update FormSection.tsx, 305b0bd se quitan campos, 5795f74 Búsqueda de nombre de policía por nómina, 81b9829 Cambios para guardado de persinas afectadas, 917002a Guardado de policia a cargo, d5e0e56 Campo para agregar detenidos de forma dinámica y eliminación de campos extras, d665f95 Camo dinamico y cambio a select en datos positivos, EmpleadoResult (+1 more)

### Community 81 - "Community 81"
Cohesion: 0.15
Nodes (3): bdd5f33 Cambios de re-diseño en login page, LogLine, LogType

### Community 82 - "Community 82"
Cohesion: 0.18
Nodes (9): obtenerArticulosAction(), obtenerFraccionesAction(), ArticulosService, Articulo, Fraccion, SeccionMotivoProps, CustomSelect(), CustomSelectProps (+1 more)

### Community 83 - "Community 83"
Cohesion: 0.26
Nodes (11): CWD, __dirname, populateAPIRoutes(), populateComandos(), populateEnvVars(), populateEstructura(), populateFeatures(), populateLibrerias() (+3 more)

### Community 84 - "Community 84"
Cohesion: 0.17
Nodes (11): btnBuscarStyle, btnLimpiarStyle, CANALES, CatalogoItem, ESTATUS, fieldStyle, FiltrosIncidentes(), inputStyle (+3 more)

### Community 85 - "Community 85"
Cohesion: 0.21
Nodes (7): Accion, PermisoSeccion, ROLES_PERMITIDOS, Seccion, tieneAccesoAuxiliar(), tienePermiso(), verificarAccesoAuxiliarApi()

### Community 86 - "Community 86"
Cohesion: 0.24
Nodes (11): buildInstructions(), buildKeywords(), CONTEXT_MAP, __dirname, extractDomain(), GRAPH_JSON, KEYWORDS, main() (+3 more)

### Community 87 - "Community 87"
Cohesion: 0.18
Nodes (3): Module, ModuleCards(), MODULES

### Community 88 - "Community 88"
Cohesion: 0.18
Nodes (2): DC, DCCtx

### Community 89 - "Community 89"
Cohesion: 0.29
Nodes (8): guardarDatosCoordinacion(), num(), obtenerArmasDia(), upsertFge(), upsertFgr(), upsertMasc(), upsertObservaciones(), upsertVictimas()

### Community 90 - "Community 90"
Cohesion: 0.18
Nodes (1): WF

### Community 91 - "Community 91"
Cohesion: 0.33
Nodes (8): rowToCatalogo(), rowToIncidenteDetalle(), rowToIncidenteResumen(), toNum(), toStr(), CatalogoItem, IncidenteDetalle, IncidenteResumen

### Community 92 - "Community 92"
Cohesion: 0.22
Nodes (8): HistorialIncidente(), marcarEnSitioOficial(), Asignacion, DespachoContent(), Props, FormularioRecorrido(), MarcarEnSitioButton(), Props

### Community 93 - "Community 93"
Cohesion: 0.20
Nodes (1): TWEAKS

### Community 94 - "Community 94"
Cohesion: 0.36
Nodes (9): formato_n_armas_aseguradas, formato_n_atencion_victimas, formato_n_eventos, formato_n_fge, formato_n_fgr, formato_n_medios_alternativos, formato_n_reportes, formato_n_rnd (+1 more)

### Community 95 - "Community 95"
Cohesion: 0.24
Nodes (6): BusquedasFiltros(), ESTADOS, TIPOS, AUTORIDADES, JuridicoFiltros(), SearchBox()

### Community 96 - "Community 96"
Cohesion: 0.20
Nodes (7): btnSubmitStyle, fieldContainerStyle, grid2Style, iconStyle, inputStyle, labelStyle, sectionTitleStyle

### Community 97 - "Community 97"
Cohesion: 0.20
Nodes (7): child, LOG, needsShell, opts, ORIG, PID_FILE, ROOT

### Community 98 - "Community 98"
Cohesion: 0.24
Nodes (6): PasoInfraccionProps, MAPA_GARANTIAS, SeccionGarantia(), SeccionGarantiaProps, SeccionMotivo(), SelectWrapper()

### Community 99 - "Community 99"
Cohesion: 0.22
Nodes (8): arrowBtnStyle, containerStyle, infoStyle, labelStyle, pageNumberStyle, Pagination(), PaginationProps, valueStyle

### Community 100 - "Community 100"
Cohesion: 0.22
Nodes (5): Accion, PermisoSeccion, Seccion, SECCIONES, tienePermiso()

### Community 101 - "Community 101"
Cohesion: 0.22
Nodes (5): Accion, PermisoSeccion, Seccion, SECCIONES, tienePermiso()

### Community 102 - "Community 102"
Cohesion: 0.22
Nodes (5): Accion, PermisoSeccion, Seccion, SECCIONES, tienePermiso()

### Community 103 - "Community 103"
Cohesion: 0.22
Nodes (1): TWEAKS

### Community 104 - "Community 104"
Cohesion: 0.33
Nodes (7): __dirname, getColumns(), getEnums(), getSchemas(), getTables(), main(), ROOT

### Community 105 - "Community 105"
Cohesion: 0.25
Nodes (6): insertarFotoFiscalia(), verificarRolFiscalia(), completarSolicitudFoto(), obtenerFolioReporteCampo(), subirFotoDetenido(), obtenerReporteCampoSimple()

### Community 106 - "Community 106"
Cohesion: 0.25
Nodes (6): CONTEXT_MAP_PATH, __dirname, GRAPH_JSON, LOADER_SCRIPT, ROOT, SKILL_PATH

### Community 107 - "Community 107"
Cohesion: 0.25
Nodes (3): Alertas, ICONS, NAV

### Community 108 - "Community 108"
Cohesion: 0.36
Nodes (6): ColumnInfo, getColumns(), getEnums(), getTables(), main(), SCHEMAS

### Community 109 - "Community 109"
Cohesion: 0.38
Nodes (6): getMapsWindow(), GoogleMapsNamespace, GoogleMapsWindow, loadGoogleMaps(), waitForGoogle(), Window

### Community 110 - "Community 110"
Cohesion: 0.33
Nodes (5): btnDetalle, DetenidoRow, FotoInfo, TablaDetenidos(), tabStyle()

### Community 111 - "Community 111"
Cohesion: 0.33
Nodes (6): CONTEXT_MAP, __dirname, extractDomain(), KEYWORDS, loadKeywords(), ROOT

### Community 112 - "Community 112"
Cohesion: 0.29
Nodes (3): PasoConfirmacionProps, SeccionEstructurada, Props

### Community 113 - "Community 113"
Cohesion: 0.40
Nodes (5): Session, config, isPublic(), proxy(), PUBLIC_PATHS

### Community 114 - "Community 114"
Cohesion: 0.33
Nodes (4): actualizarSolicitudFotoEstado(), getRolUsuario(), insertarEvidenciaDetenido(), obtenerObtenerSolicitudFoto()

### Community 115 - "Community 115"
Cohesion: 0.40
Nodes (4): calcularSemaforoVigencia(), SemaforoColor, CFG, SemaforoVigencia()

### Community 116 - "Community 116"
Cohesion: 0.40
Nodes (3): tdStyle, thStyle, listarHistorial()

### Community 117 - "Community 117"
Cohesion: 0.40
Nodes (4): createProrroga(), I, L, ProrrogaModal()

### Community 118 - "Community 118"
Cohesion: 0.50
Nodes (2): ModuleCardProps, Stat

### Community 119 - "Community 119"
Cohesion: 0.50
Nodes (1): MAIN_ROUTES

### Community 120 - "Community 120"
Cohesion: 0.50
Nodes (2): ADMIN, pool

### Community 121 - "Community 121"
Cohesion: 0.50
Nodes (1): SA7Service

### Community 122 - "Community 122"
Cohesion: 0.67
Nodes (1): Stage

### Community 124 - "Community 124"
Cohesion: 1.00
Nodes (1): eslintConfig

### Community 125 - "Community 125"
Cohesion: 1.00
Nodes (1): config

## Knowledge Gaps
- **829 isolated node(s):** `__dirname`, `ROOT`, `TOKEN_LOG`, `GRAPH_PATH`, `CHECKPOINT_SCRIPT` (+824 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Community 88`** (2 nodes): `DC`, `DCCtx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 90`** (1 nodes): `WF`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 93`** (1 nodes): `TWEAKS`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 103`** (1 nodes): `TWEAKS`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 118`** (2 nodes): `ModuleCardProps`, `Stat`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 119`** (1 nodes): `MAIN_ROUTES`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 120`** (2 nodes): `ADMIN`, `pool`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 121`** (1 nodes): `SA7Service`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 122`** (1 nodes): `Stage`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 124`** (1 nodes): `eslintConfig`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 125`** (1 nodes): `config`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `auth` connect `Community 0` to `Community 20`, `Community 3`, `Community 49`, `Community 21`, `Community 16`, `Community 28`, `Community 5`, `Community 38`, `Community 47`, `Community 2`, `Community 7`, `Community 17`, `Community 32`, `Community 22`, `Community 58`, `Community 24`, `Community 77`, `Community 30`, `Community 39`, `Community 34`, `Community 26`, `Community 10`, `Community 19`, `Community 71`, `Community 74`, `Community 75`, `Community 62`, `Community 25`, `Community 40`, `Community 116`, `Community 1`, `Community 43`, `Community 23`, `Community 56`, `Community 42`, `Community 33`, `Community 55`, `Community 89`, `Community 73`, `Community 53`, `Community 35`, `Community 31`, `Community 45`, `Community 50`, `Community 4`, `Community 69`, `Community 15`, `Community 46`, `Community 18`, `Community 11`, `Community 114`, `Community 105`?**
  _High betweenness centrality (0.013) - this node is a cross-community bridge._
- **Why does `query()` connect `Community 25` to `Community 67`, `Community 46`, `Community 49`, `Community 52`, `Community 42`, `Community 16`, `Community 5`, `Community 3`, `Community 65`, `Community 34`, `Community 22`, `Community 70`, `Community 10`, `Community 32`, `Community 43`, `Community 19`, `Community 20`, `Community 13`, `Community 50`, `Community 39`, `Community 30`, `Community 2`, `Community 6`, `Community 89`, `Community 53`, `Community 9`, `Community 58`, `Community 0`, `Community 27`, `Community 4`, `Community 71`, `Community 74`, `Community 75`, `Community 36`, `Community 24`, `Community 15`, `Community 47`, `Community 21`, `Community 33`, `Community 38`, `Community 85`?**
  _High betweenness centrality (0.008) - this node is a cross-community bridge._
- **What connects `__dirname`, `ROOT`, `TOKEN_LOG` to the rest of the system?**
  _829 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.0515406162464986 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.022653721682847898 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.05454545454545454 - nodes in this community are weakly interconnected._
- **Should `Community 3` be split into smaller, more focused modules?**
  _Cohesion score 0.06400208986415883 - nodes in this community are weakly interconnected._