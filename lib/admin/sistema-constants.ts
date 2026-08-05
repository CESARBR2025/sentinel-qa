// Constantes del reset total del sistema. En archivo aparte porque un módulo
// 'use server' (sistema-actions.ts) solo puede exportar funciones async — no
// puede exportar estas constantes directamente, y el cliente (ResetSistemaForm)
// también las necesita para mostrar la frase exacta a teclear.

// Frase exacta que el admin debe teclear para habilitar el botón — mismo
// criterio que GitHub al borrar un repo. Única fuente de verdad: la UI la
// importa para mostrarla, el server la usa para validar.
export const FRASE_CONFIRMACION_RESET = 'REINICIAR SISTEMA'

// Registros operativos que se vacían. Se conserva todo lo demás: usuarios,
// auth (accounts/sessions/two_factors/verifications), roles/permisos,
// ofi_oficiales (perfil de oficial, no es "reporte"), y los catálogos cat_*.
// Decidido explícitamente 2026-07-31 — no agregar/quitar tablas de esta
// lista sin revisar de nuevo qué se considera "usuario" vs "registro".
export const TABLAS_RESET_SISTEMA = [
  // Incidentes y despacho
  'incidentes', 'incidente_despacho', 'incidente_despacho_elementos', 'incidente_despacho_unidades',
  'incidente_extorsion', 'incidente_alarma_escolar', 'incidente_personas_afectadas',
  'incidentes_camara',
  // Reporte de campo / D1 / oficial
  'ofi_reportes_campo', 'ofi_reporte_denuncia', 'ofi_detalles_asegurados',
  'ofi_fichas_inteligencia', 'ofi_puesta_disposicion', 'solicitud_fotos',
  // Notificaciones (generadas, no config)
  'notificaciones', 'notificaciones_eventos', 'notificaciones_lecturas',
  // Monitorista
  'monitorista_historial', 'moni_evidencias_denuncia', 'evidencias', 'evidencias_detenido',
  // Formato N
  'formato_n_armas_aseguradas', 'formato_n_atencion_victimas', 'formato_n_eventos',
  'formato_n_fge', 'formato_n_fgr', 'formato_n_medios_alternativos', 'formato_n_observaciones', 'formato_n_rnd',
  // Prevención / búsquedas
  'fichas_busqueda', 'fichas_inteligencia_detenidos', 'iph_detenidos',
  'medidas_proteccion', 'medida_autoridades_adicionales', 'seguimientos_busqueda', 'visitas_domiciliarias',
  // Rol de servicios
  'rol_asignaciones', 'rol_estado_fuerza', 'rol_observaciones', 'roles_servicio',
  // Solicitudes / novedades / auxiliar
  'solicitudes_c4_internas', 'solicitudes_detenido', 'solicitudes_evidencia', 'solicitudes_informacion',
  'novedades_captura', 'auxiliar_checklist', 'contestaciones',
  // Auditoría — se vacía también; el propio reset queda como primer registro nuevo (ver sistema-actions.ts)
  'audit_log',
] as const
