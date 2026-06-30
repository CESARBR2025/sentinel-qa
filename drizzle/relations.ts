import { relations } from "drizzle-orm/relations";
import { users, usuarioModulos, modulos, sessions, roles, catDependencias, twoFactors, accounts, solicitudesInformacion, contestaciones, solicitudesC4Internas, medidasProteccion, visitasDomiciliarias, fichasBusqueda, seguimientosBusqueda, medidaAutoridadesAdicionales, notificaciones, permisos, catOrigenesEvento, eventos, catTiposIncidente, catPrioridades, catEstatusEvento, catTurnos, catSectores, rolesServicio, rolAsignaciones, catRadios, catBodyCams, rolEstadoFuerza, catEstadoFuerzaConceptos, rolObservaciones, catTiposObservacion, incidentes, incidenteAlarmaEscolar, incidenteDespacho, incidenteExtorsion, incidentePersonasAfectadas, auditLog, catTiposEmergencia, catMediosCanalizacion, incidenteReporteCampo, incidenteDespachoElementos, incidenteDespachoUnidades, reportesD1, ofiOficiales, ofiReportesCampo } from "./schema";

export const usuarioModulosRelations = relations(usuarioModulos, ({one}) => ({
	user: one(users, {
		fields: [usuarioModulos.userId],
		references: [users.id]
	}),
	modulo: one(modulos, {
		fields: [usuarioModulos.moduloId],
		references: [modulos.id]
	}),
}));

export const usersRelations = relations(users, ({one, many}) => ({
	usuarioModulos: many(usuarioModulos),
	sessions: many(sessions),
	role: one(roles, {
		fields: [users.rolId],
		references: [roles.id]
	}),
	catDependencia: one(catDependencias, {
		fields: [users.dependenciaId],
		references: [catDependencias.id]
	}),
	twoFactors: many(twoFactors),
	accounts: many(accounts),
	contestaciones: many(contestaciones),
	solicitudesC4Internas: many(solicitudesC4Internas),
	visitasDomiciliarias: many(visitasDomiciliarias),
	seguimientosBusquedas: many(seguimientosBusqueda),
	solicitudesInformacions: many(solicitudesInformacion),
	fichasBusquedas: many(fichasBusqueda),
	medidasProteccions: many(medidasProteccion),
	medidaAutoridadesAdicionales: many(medidaAutoridadesAdicionales),
	notificaciones: many(notificaciones),
	eventos: many(eventos),
	rolesServicios_firmadoPor: many(rolesServicio, {
		relationName: "rolesServicio_firmadoPor_users_id"
	}),
	rolesServicios_creadoPor: many(rolesServicio, {
		relationName: "rolesServicio_creadoPor_users_id"
	}),
	incidenteDespachos: many(incidenteDespacho),
	auditLogs: many(auditLog),
	incidentes: many(incidentes),
	incidenteReporteCampos: many(incidenteReporteCampo),
	reportesD1s: many(reportesD1),
	ofiOficiales: many(ofiOficiales),
}));

export const modulosRelations = relations(modulos, ({many}) => ({
	usuarioModulos: many(usuarioModulos),
	permisos: many(permisos),
}));

export const sessionsRelations = relations(sessions, ({one}) => ({
	user: one(users, {
		fields: [sessions.userId],
		references: [users.id]
	}),
}));

export const rolesRelations = relations(roles, ({many}) => ({
	users: many(users),
	permisos: many(permisos),
}));

export const catDependenciasRelations = relations(catDependencias, ({many}) => ({
	users: many(users),
}));

export const twoFactorsRelations = relations(twoFactors, ({one}) => ({
	user: one(users, {
		fields: [twoFactors.userId],
		references: [users.id]
	}),
}));

export const accountsRelations = relations(accounts, ({one}) => ({
	user: one(users, {
		fields: [accounts.userId],
		references: [users.id]
	}),
}));

export const contestacionesRelations = relations(contestaciones, ({one}) => ({
	solicitudesInformacion: one(solicitudesInformacion, {
		fields: [contestaciones.solicitudId],
		references: [solicitudesInformacion.id]
	}),
	user: one(users, {
		fields: [contestaciones.creadoPor],
		references: [users.id]
	}),
}));

export const solicitudesInformacionRelations = relations(solicitudesInformacion, ({one, many}) => ({
	contestaciones: many(contestaciones),
	solicitudesC4Internas: many(solicitudesC4Internas),
	user: one(users, {
		fields: [solicitudesInformacion.creadoPor],
		references: [users.id]
	}),
}));

export const solicitudesC4InternasRelations = relations(solicitudesC4Internas, ({one}) => ({
	user: one(users, {
		fields: [solicitudesC4Internas.creadoPor],
		references: [users.id]
	}),
	solicitudesInformacion: one(solicitudesInformacion, {
		fields: [solicitudesC4Internas.solicitudId],
		references: [solicitudesInformacion.id]
	}),
}));

export const visitasDomiciliariasRelations = relations(visitasDomiciliarias, ({one}) => ({
	medidasProteccion: one(medidasProteccion, {
		fields: [visitasDomiciliarias.medidaId],
		references: [medidasProteccion.id]
	}),
	user: one(users, {
		fields: [visitasDomiciliarias.registradoPor],
		references: [users.id]
	}),
}));

export const medidasProteccionRelations = relations(medidasProteccion, ({one, many}) => ({
	visitasDomiciliarias: many(visitasDomiciliarias),
	user: one(users, {
		fields: [medidasProteccion.creadoPor],
		references: [users.id]
	}),
	medidaAutoridadesAdicionales: many(medidaAutoridadesAdicionales),
}));

export const seguimientosBusquedaRelations = relations(seguimientosBusqueda, ({one}) => ({
	fichasBusqueda: one(fichasBusqueda, {
		fields: [seguimientosBusqueda.fichaId],
		references: [fichasBusqueda.id]
	}),
	user: one(users, {
		fields: [seguimientosBusqueda.registradoPor],
		references: [users.id]
	}),
}));

export const fichasBusquedaRelations = relations(fichasBusqueda, ({one, many}) => ({
	seguimientosBusquedas: many(seguimientosBusqueda),
	user: one(users, {
		fields: [fichasBusqueda.creadoPor],
		references: [users.id]
	}),
	notificaciones: many(notificaciones),
}));

export const medidaAutoridadesAdicionalesRelations = relations(medidaAutoridadesAdicionales, ({one}) => ({
	user: one(users, {
		fields: [medidaAutoridadesAdicionales.creadoPor],
		references: [users.id]
	}),
	medidasProteccion: one(medidasProteccion, {
		fields: [medidaAutoridadesAdicionales.medidaId],
		references: [medidasProteccion.id]
	}),
}));

export const notificacionesRelations = relations(notificaciones, ({one}) => ({
	user: one(users, {
		fields: [notificaciones.userId],
		references: [users.id]
	}),
	fichasBusqueda: one(fichasBusqueda, {
		fields: [notificaciones.fichaId],
		references: [fichasBusqueda.id]
	}),
}));

export const permisosRelations = relations(permisos, ({one}) => ({
	role: one(roles, {
		fields: [permisos.rolId],
		references: [roles.id]
	}),
	modulo: one(modulos, {
		fields: [permisos.moduloId],
		references: [modulos.id]
	}),
}));

export const eventosRelations = relations(eventos, ({one}) => ({
	catOrigenesEvento: one(catOrigenesEvento, {
		fields: [eventos.origenId],
		references: [catOrigenesEvento.id]
	}),
	catTiposIncidente: one(catTiposIncidente, {
		fields: [eventos.tipoIncidenteId],
		references: [catTiposIncidente.id]
	}),
	catPrioridade: one(catPrioridades, {
		fields: [eventos.prioridadId],
		references: [catPrioridades.id]
	}),
	catEstatusEvento: one(catEstatusEvento, {
		fields: [eventos.estatusId],
		references: [catEstatusEvento.id]
	}),
	catTurno: one(catTurnos, {
		fields: [eventos.turnoId],
		references: [catTurnos.id]
	}),
	user: one(users, {
		fields: [eventos.creadoPor],
		references: [users.id]
	}),
}));

export const catOrigenesEventoRelations = relations(catOrigenesEvento, ({many}) => ({
	eventos: many(eventos),
}));

export const catTiposIncidenteRelations = relations(catTiposIncidente, ({many}) => ({
	eventos: many(eventos),
	incidentes: many(incidentes),
}));

export const catPrioridadesRelations = relations(catPrioridades, ({many}) => ({
	eventos: many(eventos),
	incidentes: many(incidentes),
}));

export const catEstatusEventoRelations = relations(catEstatusEvento, ({many}) => ({
	eventos: many(eventos),
}));

export const catTurnosRelations = relations(catTurnos, ({many}) => ({
	eventos: many(eventos),
}));

export const rolesServicioRelations = relations(rolesServicio, ({one, many}) => ({
	catSectore: one(catSectores, {
		fields: [rolesServicio.sectorId],
		references: [catSectores.id]
	}),
	user_firmadoPor: one(users, {
		fields: [rolesServicio.firmadoPor],
		references: [users.id],
		relationName: "rolesServicio_firmadoPor_users_id"
	}),
	user_creadoPor: one(users, {
		fields: [rolesServicio.creadoPor],
		references: [users.id],
		relationName: "rolesServicio_creadoPor_users_id"
	}),
	rolAsignaciones: many(rolAsignaciones),
	rolEstadoFuerzas: many(rolEstadoFuerza),
	rolObservaciones: many(rolObservaciones),
}));

export const catSectoresRelations = relations(catSectores, ({many}) => ({
	rolesServicios: many(rolesServicio),
}));

export const rolAsignacionesRelations = relations(rolAsignaciones, ({one}) => ({
	rolesServicio: one(rolesServicio, {
		fields: [rolAsignaciones.rolId],
		references: [rolesServicio.id]
	}),
	catRadio: one(catRadios, {
		fields: [rolAsignaciones.radioId],
		references: [catRadios.id]
	}),
	catBodyCam: one(catBodyCams, {
		fields: [rolAsignaciones.bodyCamId],
		references: [catBodyCams.id]
	}),
}));

export const catRadiosRelations = relations(catRadios, ({many}) => ({
	rolAsignaciones: many(rolAsignaciones),
}));

export const catBodyCamsRelations = relations(catBodyCams, ({many}) => ({
	rolAsignaciones: many(rolAsignaciones),
}));

export const rolEstadoFuerzaRelations = relations(rolEstadoFuerza, ({one}) => ({
	rolesServicio: one(rolesServicio, {
		fields: [rolEstadoFuerza.rolId],
		references: [rolesServicio.id]
	}),
	catEstadoFuerzaConcepto: one(catEstadoFuerzaConceptos, {
		fields: [rolEstadoFuerza.conceptoId],
		references: [catEstadoFuerzaConceptos.id]
	}),
}));

export const catEstadoFuerzaConceptosRelations = relations(catEstadoFuerzaConceptos, ({many}) => ({
	rolEstadoFuerzas: many(rolEstadoFuerza),
}));

export const rolObservacionesRelations = relations(rolObservaciones, ({one}) => ({
	rolesServicio: one(rolesServicio, {
		fields: [rolObservaciones.rolId],
		references: [rolesServicio.id]
	}),
	catTiposObservacion: one(catTiposObservacion, {
		fields: [rolObservaciones.tipoId],
		references: [catTiposObservacion.id]
	}),
}));

export const catTiposObservacionRelations = relations(catTiposObservacion, ({many}) => ({
	rolObservaciones: many(rolObservaciones),
}));

export const incidenteAlarmaEscolarRelations = relations(incidenteAlarmaEscolar, ({one}) => ({
	incidente: one(incidentes, {
		fields: [incidenteAlarmaEscolar.incidenteId],
		references: [incidentes.id]
	}),
}));

export const incidentesRelations = relations(incidentes, ({one, many}) => ({
	incidenteAlarmaEscolars: many(incidenteAlarmaEscolar),
	incidenteDespachos: many(incidenteDespacho),
	incidenteExtorsions: many(incidenteExtorsion),
	incidentePersonasAfectadas: many(incidentePersonasAfectadas),
	catTiposEmergencia: one(catTiposEmergencia, {
		fields: [incidentes.tipoEmergenciaId],
		references: [catTiposEmergencia.id]
	}),
	catTiposIncidente: one(catTiposIncidente, {
		fields: [incidentes.tipoIncidenteId],
		references: [catTiposIncidente.id]
	}),
	catPrioridade: one(catPrioridades, {
		fields: [incidentes.prioridadId],
		references: [catPrioridades.id]
	}),
	catMediosCanalizacion: one(catMediosCanalizacion, {
		fields: [incidentes.medioCanalizacionId],
		references: [catMediosCanalizacion.id]
	}),
	user: one(users, {
		fields: [incidentes.capturadoPor],
		references: [users.id]
	}),
	incidenteReporteCampos: many(incidenteReporteCampo),
}));

export const incidenteDespachoRelations = relations(incidenteDespacho, ({one, many}) => ({
	incidente: one(incidentes, {
		fields: [incidenteDespacho.incidenteId],
		references: [incidentes.id]
	}),
	user: one(users, {
		fields: [incidenteDespacho.despachadoPor],
		references: [users.id]
	}),
	incidenteDespachoElementos: many(incidenteDespachoElementos),
	incidenteDespachoUnidades: many(incidenteDespachoUnidades),
}));

export const incidenteExtorsionRelations = relations(incidenteExtorsion, ({one}) => ({
	incidente: one(incidentes, {
		fields: [incidenteExtorsion.incidenteId],
		references: [incidentes.id]
	}),
}));

export const incidentePersonasAfectadasRelations = relations(incidentePersonasAfectadas, ({one}) => ({
	incidente: one(incidentes, {
		fields: [incidentePersonasAfectadas.incidenteId],
		references: [incidentes.id]
	}),
}));

export const auditLogRelations = relations(auditLog, ({one}) => ({
	user: one(users, {
		fields: [auditLog.userId],
		references: [users.id]
	}),
}));

export const catTiposEmergenciaRelations = relations(catTiposEmergencia, ({many}) => ({
	incidentes: many(incidentes),
}));

export const catMediosCanalizacionRelations = relations(catMediosCanalizacion, ({many}) => ({
	incidentes: many(incidentes),
}));

export const incidenteReporteCampoRelations = relations(incidenteReporteCampo, ({one}) => ({
	incidente: one(incidentes, {
		fields: [incidenteReporteCampo.incidenteId],
		references: [incidentes.id]
	}),
	user: one(users, {
		fields: [incidenteReporteCampo.capturadoPor],
		references: [users.id]
	}),
}));

export const incidenteDespachoElementosRelations = relations(incidenteDespachoElementos, ({one}) => ({
	incidenteDespacho: one(incidenteDespacho, {
		fields: [incidenteDespachoElementos.despachoId],
		references: [incidenteDespacho.id]
	}),
}));

export const incidenteDespachoUnidadesRelations = relations(incidenteDespachoUnidades, ({one}) => ({
	incidenteDespacho: one(incidenteDespacho, {
		fields: [incidenteDespachoUnidades.despachoId],
		references: [incidenteDespacho.id]
	}),
}));

export const reportesD1Relations = relations(reportesD1, ({one}) => ({
	user: one(users, {
		fields: [reportesD1.capturadoPor],
		references: [users.id]
	}),
}));

export const ofiOficialesRelations = relations(ofiOficiales, ({one, many}) => ({
	user: one(users, {
		fields: [ofiOficiales.userId],
		references: [users.id]
	}),
	ofiReportesCampos: many(ofiReportesCampo),
}));

export const ofiReportesCampoRelations = relations(ofiReportesCampo, ({one}) => ({
	ofiOficiale: one(ofiOficiales, {
		fields: [ofiReportesCampo.ofiOficialId],
		references: [ofiOficiales.id]
	}),
}));