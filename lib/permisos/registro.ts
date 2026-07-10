import { SECCIONES as SECCIONES_MONITORISTA } from '@/lib/monitorista/permisos'
import { SECCIONES as SECCIONES_INCIDENTES } from '@/lib/incidentes/permisos'
import { SECCIONES as SECCIONES_AUXILIAR } from '@/lib/auxiliar/permisos'
import { SECCIONES as SECCIONES_911 } from '@/lib/911/permisos'
import { SECCIONES as SECCIONES_ANALISIS } from '@/lib/analisis/permisos'
import { SECCIONES as SECCIONES_REPORTES } from '@/lib/reportes/permisos'
import { SECCIONES as SECCIONES_CORRALON } from '@/lib/corralon/permisos'
import type { Seccion as SeccionPrevencion } from '@/lib/prevencion/permisos'

export interface ModuloPermisos {
  labelModulo: string
  secciones: readonly string[]
  seccionLabels: Record<string, string>
}

// Qué módulo de permisos se muestra en /admin/usuarios/[id] y /admin/roles/[id]/plantilla-permisos
// según el rol del usuario. Un rol puede no tener ninguno (no se muestra nada).
export const MODULOS_POR_ROL: Record<string, ModuloPermisos> = {
  Monitorista: {
    labelModulo: 'Monitorista',
    secciones: SECCIONES_MONITORISTA,
    seccionLabels: {
      solicitudes: 'Solicitudes',
      detenidos: 'Detenidos',
      incidentes_camara: 'Incidentes Cámara',
      historial: 'Historial',
    },
  },
  Operador: {
    labelModulo: 'Incidentes',
    secciones: SECCIONES_INCIDENTES,
    seccionLabels: {
      incidentes: 'Incidentes (bitácora y despacho)',
      incidentes_camaras: 'Incidentes por Cámara (reporte)',
      modulo_incidentes: 'Módulo de Resumen de Incidentes',
    },
  },
  'Oficial de Campo': {
    labelModulo: 'Incidentes y Oficial',
    secciones: SECCIONES_INCIDENTES,
    seccionLabels: {
      incidentes: 'Incidentes (bitácora y despacho)',
      incidentes_camaras: 'Incidentes por Cámara (reporte)',
      modulo_incidentes: 'Módulo de Resumen de Incidentes',
      oficial_campo: 'Panel Oficial de Campo',
    },
  },
  Reportante: {
    labelModulo: 'Reportes',
    secciones: [...SECCIONES_INCIDENTES, 'reportes_ciudadano'] as const,
    seccionLabels: {
      incidentes: 'Incidentes (bitácora y despacho)',
      incidentes_camaras: 'Incidentes por Cámara (reporte)',
      modulo_incidentes: 'Módulo de Resumen de Incidentes',
      reportes_ciudadano: 'Reportes y Estadísticas',
    },
  },
  'Operador Víctimas': {
    labelModulo: 'Prevención (Búsquedas y Medidas)',
    secciones: ['busquedas', 'medidas'] satisfies readonly SeccionPrevencion[],
    seccionLabels: {
      busquedas: 'Búsquedas / Protocolo Alba',
      medidas: 'Medidas de Protección',
    },
  },
  Jurídico: {
    labelModulo: 'Prevención (Jurídico)',
    secciones: ['solicitudes'] satisfies readonly SeccionPrevencion[],
    seccionLabels: {
      solicitudes: 'Solicitudes de Información',
    },
  },
  Auxiliar: {
    labelModulo: 'Auxiliar de Novedades',
    secciones: SECCIONES_AUXILIAR,
    seccionLabels: {
      auxiliar_checklist: 'Checklist de Novedades',
      auxiliar_cuestionario_robo: 'Cuestionario Único de Robo',
    },
  },
  'Auxiliar de Novedades': {
    labelModulo: 'Auxiliar de Novedades',
    secciones: SECCIONES_AUXILIAR,
    seccionLabels: {
      auxiliar_checklist: 'Checklist de Novedades',
      auxiliar_cuestionario_robo: 'Cuestionario Único de Robo',
    },
  },
  agente_911: {
    labelModulo: '911 (Captura Ciudadano/WhatsApp)',
    secciones: ['911_ciudadano', '911_whatsapp'] satisfies readonly (typeof SECCIONES_911)[number][],
    seccionLabels: {
      '911_ciudadano': 'Línea Ciudadana',
      '911_whatsapp': 'WhatsApp',
    },
  },
  agente_despacho: {
    labelModulo: '911 (Despacho y Rondín)',
    secciones: ['911_rondin', '911_despacho'] satisfies readonly (typeof SECCIONES_911)[number][],
    seccionLabels: {
      '911_rondin': 'Rondín / Recorrido',
      '911_despacho': 'Despacho de Unidades',
    },
  },
  agente_bitacorista: {
    labelModulo: 'Incidentes',
    secciones: SECCIONES_INCIDENTES,
    seccionLabels: {
      incidentes: 'Incidentes (bitácora y despacho)',
      incidentes_camaras: 'Incidentes por Cámara (reporte)',
      modulo_incidentes: 'Módulo de Resumen de Incidentes',
    },
  },
  Investigador: {
    labelModulo: 'Análisis',
    secciones: SECCIONES_ANALISIS,
    seccionLabels: {
      analisis: 'Análisis, Fichas y Georreferenciación',
    },
  },
  Analisis: {
    labelModulo: 'Formato N a Coordinación',
    secciones: SECCIONES_REPORTES,
    seccionLabels: {
      formato_n_coordinacion: 'Envío de Formatos N (7 reportes)',
    },
  },
  corralon_mw: {
    labelModulo: 'Corralón',
    secciones: SECCIONES_CORRALON,
    seccionLabels: {
      corralon_solicitudes: 'Solicitudes de Liberación/Cierre',
    },
  },
  corralon_mejia: {
    labelModulo: 'Corralón',
    secciones: SECCIONES_CORRALON,
    seccionLabels: {
      corralon_solicitudes: 'Solicitudes de Liberación/Cierre',
    },
  },
  agente_fiscalia: {
    labelModulo: 'Fiscalía',
    secciones: ['fiscalia'],
    seccionLabels: {
      fiscalia: 'Módulo Fiscalía',
    },
  },
  agente_juzgado: {
    labelModulo: 'Juzgado',
    secciones: ['juzgado'],
    seccionLabels: {
      juzgado: 'Módulo Juzgado',
    },
  },
  agente_liberaciones: {
    labelModulo: 'Liberaciones',
    secciones: ['liberaciones'],
    seccionLabels: {
      liberaciones: 'Módulo Liberaciones',
    },
  },
  agente_infracciones: {
    labelModulo: 'Infracciones',
    secciones: ['infracciones'],
    seccionLabels: {
      infracciones: 'Módulo Infracciones',
    },
  },
  admin_transito: {
    labelModulo: 'Administración de Tránsito',
    secciones: ['admin_transito'],
    seccionLabels: {
      admin_transito: 'Admin Tránsito',
    },
  },
}
