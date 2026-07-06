# Roles y permisos — Monitorista

Sistema de permisos general, tabla `permisos` — pensado para cubrir **todas las secciones del sistema a futuro** (lo configurará alguien más para el resto). Esta implementación **solo configura/aplica la sección de monitorista** (`app/monitorista/**` y `app/api/monitorista/**`); no toca ningún otro módulo del proyecto.

Nota: ya existía una tabla `permisos` vieja (`rol_id`+`modulo_id`, 0 filas, nunca usada en runtime) — se borró y se reemplazó por esta (ver `lib/db/manual-migrations/0009_rename_permisos.sql`). La columna `seccion` es texto libre (sin `CHECK` en la DB, ver `0010_permisos_seccion_libre.sql`) para que otros módulos puedan agregar sus propias secciones sin nueva migración — cada módulo valida sus propios valores válidos en su propio código (monitorista lo hace en `SECCIONES` de `lib/monitorista/permisos.ts`).

## Cómo funciona

1. **Gate base** (sin cambios): `app/monitorista/layout.tsx` sigue exigiendo rol `Monitorista` o `Administrador` para entrar a cualquier ruta de monitorista. Esto no se tocó.
2. **Permisos finos** (nuevo): encima de ese gate, la tabla `permisos` controla, por usuario y por sección, si puede **ver**, **crear** o **editar**.

**Default seguro**: si un usuario no tiene filas en `permisos`, tiene acceso completo a todo — nadie pierde acceso hasta que un Administrador restrinja explícitamente.

**Plantillas por rol** (nuevo): para no configurar cada usuario nuevo a mano, un rol puede tener una plantilla en `permisos_plantillas` (mismos 3 flags, pero por `rol_id` en vez de `usuario_id`). Al asignarle un rol a un usuario (alta o cambio de rol en `/admin/usuarios`), si ese rol tiene plantilla, sus valores se copian automáticamente a `permisos` para ese usuario — solo se dispara cuando el rol realmente cambia, no en cada guardado, así no pisa ajustes manuales que ya tenía. Sin plantilla para ese rol = no pasa nada (se queda con el default de acceso total).

## Secciones controladas

Las 4 que siguen viviendo bajo `app/monitorista/`:

| Sección (valor en DB) | Página | Qué cubre |
|---|---|---|
| `solicitudes` | `/monitorista/solicitudes` | Bandeja de solicitudes de evidencia (D1 + generales) |
| `detenidos` | `/monitorista/detenidos` | Reporte de detenidos, fotos, generar PPT |
| `incidentes_camara` | `/monitorista/incidentes-camara` | Registro de novedades por turno |
| `historial` | `/monitorista/historial` | Bitácora de acciones |

`envio-de-formatos`/`formato-n-*` **no** es parte de este sistema — ya no pertenece a monitorista (se movió a `/reportes` en una corrección anterior). Rutas de `denuncias/*`, `evidencias/subir` y `expediente-proxy` tampoco mapean 1:1 a una de las 4 secciones — quedan fuera de este control (siguen solo con chequeo de sesión, como antes).

## Tabla `permisos`

| Columna | Tipo | Descripción |
|---|---|---|
| `id` | `UUID` | PK |
| `usuario_id` | `TEXT` | FK → `users.id` |
| `seccion` | `VARCHAR(30)` | Texto libre, sin CHECK — monitorista usa las 4 de arriba, otros módulos podrán agregar las suyas |
| `puede_ver` | `BOOLEAN` | Ver la sección |
| `puede_crear` | `BOOLEAN` | Crear registros nuevos |
| `puede_editar` | `BOOLEAN` | Editar registros existentes |
| `creado_en` | `TIMESTAMPTZ` | — |

`UNIQUE (usuario_id, seccion)` — una fila por usuario+sección, se actualiza con `ON CONFLICT` al guardar.

## Tabla `permisos_plantillas`

Igual que `permisos` pero con `rol_id` (FK → `roles.id`) en vez de `usuario_id`. `UNIQUE (rol_id, seccion)`.

## Helper — `lib/monitorista/permisos.ts`

- `obtenerPermisosUsuario(usuarioId)` → mapa de las 4 secciones con sus 3 flags, default `true` si no hay fila.
- `tienePermiso(usuarioId, seccion, accion)` → boolean (`accion` = `'ver' | 'crear' | 'editar'`).
- `guardarPermiso(usuarioId, seccion, permiso)` → upsert.
- `guardarPermisosMonitoristaAction(formData)` → server action (`'use server'`), protegida a `Administrador`, usada por el form en `/admin/usuarios/[id]`.
- `obtenerPlantillaRol(rolId)` / `guardarPlantillaSeccion(rolId, seccion, permiso)` → equivalentes para `permisos_plantillas`.
- `aplicarPlantillaRol(usuarioId, rolId)` → copia la plantilla del rol a `permisos` del usuario. Llamado desde `lib/admin/actions.ts` (`createUser`/`updateUser`) cuando se asigna o cambia el rol.
- `guardarPlantillaMonitoristaAction(formData)` → server action del form en `/admin/roles/[id]/plantilla-permisos`.

## Dónde se aplica

- **Páginas** (`solicitudes/page.tsx`, `detenidos/page.tsx`, `incidentes-camara/page.tsx`, `historial/page.tsx`, más `detenidos/[id]`, `solicitudes/[id]`): `redirect('/monitorista')` si `puede_ver` es falso.
- **API routes** bajo cada sección: `GET` exige `ver`, `POST` exige `crear`, `PATCH` exige `editar` — 403 si falta. Aplica a las 14 rutas de solicitudes/detenidos/incidentes-camara/historial.
- **Hub** (`/monitorista`): los tiles de las 4 secciones solo aparecen si el usuario tiene `puede_ver` en esa sección.

## Administración

- **Por usuario**: `/admin/usuarios/[id]` — al editar un usuario cuyo rol es `Monitorista`, aparece una sección "Permisos de Monitorista" con checkboxes (ver/crear/editar × 4 secciones), justo debajo del formulario de datos del usuario. También hay un link directo "Permisos" por fila en `/admin/usuarios` para los usuarios con ese rol.
- **Por rol (plantilla)**: `/admin/roles/[id]/plantilla-permisos` — link "Plantilla →" en la fila del rol Monitorista en `/admin/roles`. Define los defaults que se copian a cualquier usuario al que se le asigne ese rol.

## Fuera de alcance (a propósito)

- No se tocó `proxy.ts` (confirmado: es el archivo correcto para Next 16, reemplaza a `middleware.ts` — sigue resolviendo solo sesión + usuario activo, project-wide).
- No se tocaron los chequeos de rol existentes en el resto de la app (`app/dashboard`, `app/admin`, `app/auxiliar`, etc.) — cada módulo sigue con su propia validación tal cual estaba.
- No se tocó la tabla/catálogo `modulos` del schema general (distinta de `permisos`) — sigue muerta, sin uso.
- La sección de administración vive en `/admin/usuarios/[id]` y solo se muestra/gestiona para usuarios con rol Monitorista. Cuando otros módulos empiecen a usar `permisos` para sus propias secciones, van a necesitar su propia UI (probablemente en el mismo `/admin/usuarios/[id]`, condicionada a su rol) — no se construyó aquí para no adelantarse a ese trabajo.
