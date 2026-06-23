import { relations } from "drizzle-orm/relations";
import { users, usuarioModulos, modulos, sessions, roles, catDependencias, twoFactors, accounts, solicitudesInformacion, contestaciones, solicitudesC4Internas, medidasProteccion, visitasDomiciliarias, fichasBusqueda, seguimientosBusqueda, medidaAutoridadesAdicionales, notificaciones, permisos, catOrigenesEvento, eventos, catTiposIncidente, catPrioridades, catEstatusEvento, catTurnos } from "./schema";

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
}));

export const catPrioridadesRelations = relations(catPrioridades, ({many}) => ({
	eventos: many(eventos),
}));

export const catEstatusEventoRelations = relations(catEstatusEvento, ({many}) => ({
	eventos: many(eventos),
}));

export const catTurnosRelations = relations(catTurnos, ({many}) => ({
	eventos: many(eventos),
}));