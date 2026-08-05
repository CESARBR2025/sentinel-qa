# Etapa 1 — Permisos: nueva sección `reporte_detenidos`

## Contexto (resumen — ver `00-contexto.md` para el detalle completo)

Se está moviendo la generación del reporte PPT de detenidos de Monitorista a `/agente_reportes` (rol `Reportante`). Esta etapa solo prepara el sistema de permisos: crea la sección `reporte_detenidos`, la registra para que aparezca en el editor de permisos de admin, y la agrega al mapa de rutas del proxy. **No se crea ninguna página ni lógica de negocio todavía.**

## Objetivo

Dejar lista la infraestructura de permisos para que, en etapas posteriores, la página `/reporte-detenidos` y su API puedan gatear el acceso con `tienePermiso(usuarioId, 'reporte_detenidos', 'ver')`, y para que un admin pueda asignar ese permiso al rol `Reportante` desde `/admin/roles/[id]/plantilla-permisos`.

## Archivos a tocar

### 1. Crear `lib/reporte-detenidos/permisos.ts` (archivo nuevo)

Wrapper tipado sobre `lib/permisos/core.ts`, mismo patrón que `lib/reportes/permisos.ts` (una sola sección):

```ts
import * as core from '@/lib/permisos/core'

export const SECCIONES = ['reporte_detenidos'] as const
export type Seccion = typeof SECCIONES[number]
export type Accion = core.Accion
export type PermisoSeccion = core.PermisoSeccion

export async function tienePermiso(usuarioId: string, seccion: Seccion, accion: Accion): Promise<boolean> {
  return core.tienePermiso(usuarioId, seccion, accion)
}

export async function obtenerPermisosUsuario(usuarioId: string): Promise<Record<Seccion, PermisoSeccion>> {
  return core.obtenerPermisosUsuario(usuarioId, SECCIONES)
}

export async function obtenerPlantillaRol(rolId: number): Promise<Record<Seccion, PermisoSeccion>> {
  return core.obtenerPlantillaRol(rolId, SECCIONES)
}

export async function guardarPlantillaSeccion(rolId: number, seccion: Seccion, permiso: PermisoSeccion): Promise<void> {
  return core.guardarPlantillaSeccion(rolId, seccion, permiso)
}
```

### 2. Editar `lib/permisos/registro.ts`

En el bloque `Reportante` (líneas 48-57), agregar la sección nueva al arreglo y su label:

```ts
Reportante: {
  labelModulo: 'Reportes',
  secciones: [...SECCIONES_INCIDENTES, 'reportes_ciudadano', 'reporte_detenidos'] as const,
  seccionLabels: {
    incidentes: 'Incidentes (bitácora y despacho)',
    incidentes_camaras: 'Incidentes por Cámara (reporte)',
    modulo_incidentes: 'Módulo de Resumen de Incidentes',
    reportes_ciudadano: 'Reportes y Estadísticas',
    reporte_detenidos: 'Reporte de Detenidos',
  },
},
```

No hace falta importar `SECCIONES` desde `lib/reporte-detenidos/permisos.ts` aquí — el patrón existente ya inline-a strings literales como `'reportes_ciudadano'` en este mismo bloque, se sigue esa convención.

### 3. Editar `lib/permisos/mapa-secciones.ts`

En la sección "── Reportes / formato N / módulos de incidentes ──" (cerca de la línea 40-67), agregar:

```ts
'/reporte-detenidos': ['reporte_detenidos'],
'/api/reporte-detenidos': ['reporte_detenidos'],
```

Agregarlas junto a las demás entradas de `reportes_ciudadano`/`formato_n_coordinacion` de ese bloque, no en otra sección del archivo.

## Qué NO tocar en esta etapa

- No crear `app/reporte-detenidos/*` ni `app/api/reporte-detenidos/*` todavía (etapas 4 y 5).
- No tocar `app/agente_reportes/page.tsx` todavía (etapa 6).
- No tocar nada de `lib/monitorista/*` (etapa 7).

## Criterios de aceptación

1. `npx tsc --noEmit` pasa sin errores nuevos.
2. `lib/reporte-detenidos/permisos.ts` existe y exporta `SECCIONES`, `tienePermiso`, `obtenerPermisosUsuario`, `obtenerPlantillaRol`, `guardarPlantillaSeccion`.
3. Al entrar como admin a `/admin/roles/[id]/plantilla-permisos` para el rol `Reportante`, aparece la fila "Reporte de Detenidos" en el editor de permisos (verificación manual del usuario en navegador).
4. `seccionesRequeridasPara('/reporte-detenidos')` y `seccionesRequeridasPara('/api/reporte-detenidos/generar-ppt')` devuelven `['reporte_detenidos']` (se puede verificar con un test rápido o revisando el archivo).
