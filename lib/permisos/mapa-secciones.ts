// Mapa de prefijo de ruta -> sección requerida para el check GRUESO del proxy.
// Generado a partir de scripts/reportes/auditoria-permisos.csv (Etapa 0) y del
// estado real de la tabla `permisos`/`permisos_plantillas` — los nombres de
// sección deben coincidir exactamente con los valores reales, no son libres.
//
// Reglas:
// - Un prefijo de ruta puede mapear a MÁS DE UNA sección válida (array) si esa
//   rama de carpetas cubre más de un módulo de permiso (ej. app/agente_911 y
//   app/monitorista tienen sub-rutas de distintas secciones).
// - Rutas que no calzan con ningún prefijo de este mapa NO se bloquean por
//   sección en el proxy (siguen dependiendo solo del check de sesión + lo que
//   ya tengan implementado en la propia página).
// - Los módulos protegidos por esAdmin (app/admin, app/dashboard/catalogos) NO
//   van en el mapa: su gate es el rol es_admin (perfil completo vía
//   obtenerPermisosUsuario), no una sección de `permisos`.
export const MAPA_SECCIONES: Record<string, string[]> = {
  // ── 911 ────────────────────────────────────────────────────────────────
  '/agente_911/ciudadano': ['911_ciudadano'],
  '/agente_911/despacho': ['911_despacho'],
  '/agente_911/rondin': ['911_rondin', 'incidentes'],
  '/agente_911/whatsapp': ['911_whatsapp', 'incidentes'],
  '/agente_911': ['911_ciudadano', '911_whatsapp'],
  '/agente_despacho': ['911_rondin', '911_despacho'],
  '/api/incidentes': ['incidentes'],
  '/api/despacho': ['incidentes'],

  // ── Tránsito / Vía pública ──────────────────────────────────────────────
  '/admin-transito': ['admin_transito'],
  '/agente_infracciones': ['infracciones'],
  '/agente_liberaciones': ['liberaciones'],

  // ── Juzgado / Fiscalía / Expediente ─────────────────────────────────────
  '/agente_juzgado': ['juzgado'],
  '/fiscalia': ['fiscalia'],
  '/api/agente_juzgado': ['juzgado'],
  '/api/fiscalia': ['fiscalia'],

  // ── Reportes / formato N / módulos de incidentes ────────────────────────
  '/agente_bitacorista': ['incidentes'],
  '/agente_reportes': ['reportes_ciudadano'],
  '/incidentes': ['incidentes'],
  '/incidentes_camaras': ['incidentes_camaras'],
  '/modulo_incidentes': ['modulo_incidentes'],
  '/d1': ['reportes_ciudadano'],
  '/d1_noiniciada': ['reportes_ciudadano'],
  '/estadisticos': ['reportes_ciudadano'],
  '/sin_robos': ['reportes_ciudadano'],
  '/reportes_incidentes': ['reportes_ciudadano'],
  '/envio-de-formatos': ['formato_n_coordinacion'],
  '/formato-n-armas-aseguradas': ['formato_n_coordinacion'],
  '/formato-n-atencion-victimas': ['formato_n_coordinacion'],
  '/formato-n-eventos': ['formato_n_coordinacion'],
  '/formato-n-fge': ['formato_n_coordinacion'],
  '/formato-n-fgr': ['formato_n_coordinacion'],
  '/formato-n-medios-alternativos': ['formato_n_coordinacion'],
  '/formato-n-rnd': ['formato_n_coordinacion'],
  '/nCoordinacion': ['formato_n_coordinacion'],
  '/api/d1': ['reportes_ciudadano'],
  '/api/reportes-incidentes': ['reportes_ciudadano'],
  '/api/reportes-d1': ['reportes_ciudadano'],
  '/api/reportes-sin-d1': ['reportes_ciudadano'],
  '/api/reportes-sin-novedad': ['reportes_ciudadano'],
  '/api/reportes-telefonicos': ['reportes_ciudadano'],
  '/api/reportes-operativos': ['modulo_incidentes'],
  '/api/camara': ['incidentes_camaras'],
  '/api/reportes': ['formato_n_coordinacion'],
  '/api/nCoordinacion': ['formato_n_coordinacion'],

  // ── Monitorista / cámaras ───────────────────────────────────────────────
  '/monitorista/detenidos': ['detenidos'],
  '/monitorista/historial': ['historial'],
  '/monitorista/incidentes-camara': ['incidentes_camara'],
  '/monitorista/solicitudes': ['solicitudes'],
  '/monitorista/denuncias': ['solicitudes'],
  '/monitorista': ['solicitudes', 'detenidos', 'incidentes_camara', 'historial'],
  '/api/detenidos': ['detenidos'],
  '/api/registro-detenidos': ['detenidos'],
  '/api/monitorista': ['solicitudes', 'detenidos', 'incidentes_camara', 'historial'],

  // ── Auxiliar / Corralón ─────────────────────────────────────────────────
  '/auxiliar/checklist': ['auxiliar_checklist'],
  '/auxiliar/cuestionario-robo': ['auxiliar_cuestionario_robo'],
  '/auxiliar': ['auxiliar_checklist', 'auxiliar_cuestionario_robo'],
  '/corralon': ['corralon_solicitudes'],
  '/api/auxiliar': ['auxiliar_checklist', 'auxiliar_cuestionario_robo'],
  '/api/corralon': ['corralon_solicitudes'],

  // ── Prevención del delito ───────────────────────────────────────────────
  '/prevencion/busquedas': ['busquedas'],
  '/prevencion/medidas': ['medidas'],
  '/prevencion/juridico': ['solicitudes'],
  '/prevencion': ['busquedas', 'medidas', 'solicitudes'],
  '/api/prevencion': ['busquedas', 'medidas', 'solicitudes'],

  // ── Analisis ────────────────────────────────────────────────────────────
  '/analisis': ['analisis'],
  '/api/analisis': ['analisis'],

  // ── Oficial de campo / denuncias ────────────────────────────────────────
  '/oficial': ['oficial_campo'],
  '/denuncia': ['oficial_campo'],
  '/api/oficial': ['oficial_campo'],
}

export function seccionesRequeridasPara(pathname: string): string[] | null {
  // match por el prefijo MÁS ESPECÍFICO (más largo) que matchee, no el primero del objeto
  const prefijos = Object.keys(MAPA_SECCIONES).sort((a, b) => b.length - a.length)
  const prefijo = prefijos.find(p => pathname === p || pathname.startsWith(p + '/'))
  return prefijo ? MAPA_SECCIONES[prefijo] : null
}
