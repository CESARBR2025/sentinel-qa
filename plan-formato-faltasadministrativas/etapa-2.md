# Etapa 2 — Permisos: sección `formatos_udai`

Leer primero `00-contexto.md`. Depende de la Etapa 1 (el módulo `lib/formatos-udai/` ya debe existir).

## Objetivo

Registrar la nueva sección de permisos `formatos_udai` siguiendo exactamente el mismo patrón que `reporte_detenidos` (`lib/reporte-detenidos/permisos.ts`).

## Archivo a crear: `lib/formatos-udai/permisos.ts`

Calcar `lib/reporte-detenidos/permisos.ts` línea por línea, cambiando la sección:

```ts
import * as core from '@/lib/permisos/core'

export const SECCIONES = ['formatos_udai'] as const
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

## Archivos a modificar

### `lib/permisos/registro.ts`

Agregar `formatos_udai` a los roles `Reportante` (línea ~50) y `agente_reportes` (línea ~61), igual que ya está `reporte_detenidos`:

```ts
Reportante: {
  labelModulo: 'Reportes',
  secciones: [...SECCIONES_INCIDENTES, 'reportes_ciudadano', 'reporte_detenidos', 'formatos_udai'] as const,
  seccionLabels: {
    // ...las que ya hay...
    formatos_udai: 'Formatos UDAI',
  },
},
agente_reportes: {
  labelModulo: 'Agente Reportes',
  secciones: [...SECCIONES_INCIDENTES, 'reportes_ciudadano', 'reporte_detenidos', 'formato_n_coordinacion', 'formatos_udai'] as const,
  seccionLabels: {
    // ...las que ya hay...
    formatos_udai: 'Formatos UDAI',
  },
},
```

### `lib/permisos/mapa-secciones.ts`

Agregar, junto a las entradas de `/reporte-detenidos` (línea ~68):

```ts
'/formatos-udai': ['formatos_udai'],
'/api/formatos-udai': ['formatos_udai'],
```

## Verificación

1. `npx tsc --noEmit`.
2. Revisar en `/admin/roles/[id]/plantilla-permisos` (o el flujo equivalente) que la sección "Formatos UDAI" aparece para los roles `Reportante` y `Agente Reportes` — esto lo confirma el usuario en navegador, no hace falta que lo pruebes tú.

## Criterios de aceptación

- `formatos_udai` sigue exactamente el mismo patrón de `reporte_detenidos` en los 3 archivos (módulo de sección, registro, mapa).
- No se tocó ninguna otra sección existente.
- **Detente aquí y espera confirmación del usuario antes de pasar a la Etapa 3.**
