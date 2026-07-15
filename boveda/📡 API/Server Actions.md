# Server Actions

**Propósito**: Catálogo de server actions del sistema.

---

| Módulo | Archivo | Funciones principales |
|--------|---------|----------------------|
| admin | `lib/admin/actions.ts` | createUser, updateUser |
| admin-transito | `lib/admin-transito/actions.ts` | crearOficial, obtenerOficialesLista, destituirOficial, reactivarOficialConDatos, obtenerOficialPorId, actualizarOficial, buscarUsuariosReincorporar |
| agente_infracciones | `lib/agente_infracciones/actions.ts` | obtenerDashboardInfracciones, obtenerInfracciones, obtenerDetalleInfraccionInfracciones, capturarInfractorInfraccionesAction, liberarGarantiaInfraccionesAction |
| agente_juzgado | `lib/agente_juzgado/actions.ts` | obtenerDashboardJuzgado, obtenerSolicitudes, accionTomarCaso, accionPedirEvidencias, accionCerrarCaso, obtenerDatosAseguradoAction, guardarDetallesAseguradoAction, obtenerLiberacionesAction, obtenerDetalleInfraccionViaActionJuzgado, guardarOficioJuzgadoAction, obtenerAseguradosJuzgadoAction, obtenerDetalleAseguradoCompletoJuzgadoAction, obtenerPuestaDisposicionJuzgadoAction, guardarDetallesAseguradosJuzgadoAction, guardarPuestaDisposicionJuzgadoAction |
| agente_liberaciones | `lib/agente_liberaciones/actions.ts` | obtenerDashboardLiberaciones, obtenerLiberaciones, capturarInfractorAction, obtenerDocumentosLiberacion, revisarDocumentoAction, finalizarRevisionAction, obtenerDetalleInfraccionLiberaciones, generarOrdenPagoAction |
| auxiliar | `lib/auxiliar/actions.ts` | upsertChecklistAction |
| corralon | `lib/corralon/actions.ts` | obtenerDashboardCorralon, obtenerSolicitudes |
| fiscalia | `lib/fiscalia/actions.ts` | obtenerDashboardFiscalia, obtenerSolicitudes, accionTomarCaso, accionPedirEvidencias, obtenerDatosAseguradoAction, guardarDetallesAseguradoAction, obtenerLiberacionesAction, obtenerAseguradosAction, obtenerDetalleAseguradoCompletoAction, guardarDetallesAseguradosAction, obtenerPuestaDisposicionAction, guardarPuestaDisposicionAction, obtenerDetalleInfraccionViaAction, guardarOficioAction, obtenerDashboardJuzgado, obtenerAseguradosJuzgadoAction, obtenerDetalleAseguradoCompletoJuzgadoAction, obtenerPuestaDisposicionJuzgadoAction, guardarPuestaDisposicionJuzgadoAction |
| incidentes | `lib/incidentes/actions.ts` | createIncidente, addPersonaAfectada, deletePersonaAfectada, createRecorridoCompleto, createDespacho, createReporteCampo, createExtorsion, createAlarmaEscolar |
| monitorista | `lib/monitorista/actions.ts` | solicitarEvidencia, subirEvidencia, completarSolicitud, cancelarSolicitud |
| notificaciones | `lib/notificaciones/actions.ts` | marcarLeida, marcarTodasLeidas, generarAlertasDebug |
| oficial | `lib/oficial/actions.ts` | crearReporteCampoOficial, asignarPatrulla |
| prevencion | `lib/prevencion/actions.ts` | createMedida, createVisita, addAutoridadMedida, createProrroga, createFicha, createSeguimiento, cancelarFicha, createSolicitud, createSolicitudC4, createContestacion, createMedidaApi, updateMedidaApi, updateMedidaStatusApi, createVisitaApi, createFichaApi, updateFichaApi, cancelarFichaApi, createSeguimientoApi, createSolicitudApi, updateSolicitudApi, createSolicitudC4Api, createContestacionApi |
| rol-servicios | `lib/rol-servicios/actions.ts` | createRol, updateEncabezadoRol, createAsignacion, deleteAsignacion, upsertEstadoFuerza, createObservacion, deleteObservacion, guardarFirmas |
