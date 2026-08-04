# Auditoría de URLs y autorización (plan auditoría-URL)

**Propósito**: cerrar el hueco real de Broken Access Control / IDOR detrás del pedido del cliente de "ocultar las URLs" (seguridad por oscuridad). Se implementó en 3 etapas — ver `plan-auditoria-url/` en la raíz del repo para el plan completo.

## Etapa 0 — Auditoría de cobertura de permisos

`scripts/auditoria-permisos.mjs` (herramienta manual, no corre en build/test). Recorre las 148 `app/**/page.tsx` y las `route.ts` de `app/api/**` buscando llamadas a `tienePermiso(...)` (y wrappers conocidos: `tieneAccesoSeccion`, `verificarAcceso*Api`, `tieneAccesoAnalisis`, `tieneAccesoFormatoN`, `verificarRol*`) y genera `scripts/reportes/auditoria-permisos.csv` con columnas `ruta,tipo,tienePermisoCheck,seccionDetectada,accionDetectada`. Es la base de datos real del mapa ruta→sección — nadie adivina secciones a mano.

## Etapa 1 — Gate grueso de sección en el proxy

- `lib/permisos/mapa-secciones.ts`: `MAPA_SECCIONES: Record<prefijo, seccion[]>` + `seccionesRequeridasPara(pathname)` (match por prefijo más específico). Un prefijo puede mapear a varias secciones (ej. `agente_911`, `monitorista`).
- `app/api/auth/secciones-permitidas/route.ts`: endpoint Node que resuelve las secciones con `puede_ver` del usuario actual vía `obtenerPermisosUsuario` (sin tocar `lib/permisos/core.ts`).
- `proxy.ts`: entre el check de `activo` y el `next()` final, si la ruta requiere sección, llama al endpoint y redirige a `/dashboard` si el usuario no tiene ninguna requerida. Edge-compatible (dos `betterFetch` HTTP, no importa pg). Ver ADR-003.

Regla: no se toca `lib/permisos/core.ts` (`tienePermiso`/`obtenerPermisosUsuario`); el proxy agrega un check grueso, no reemplaza el fino por acción.

## Etapa 2 — Tokens opacos persistentes (IDOR hardening)

- Migración `lib/db/manual-migrations/0030_tokens_recurso.sql`: tabla `tokens_recurso` (token uuid, tipo, recurso_id, `UNIQUE(tipo, recurso_id)`).
- `lib/recursos/token-recurso.ts`: `obtenerOCrearToken(tipo, id)` (mismo recurso → mismo token, se crea perezosamente) y `resolverToken(tipo, token)` (lookup).
- Aplicado en: `/fiscalia/expedientes/[token]`, `/monitorista/detenidos/[token]`, `/monitorista/denuncias/[token]`. El token solo vive en la capa URL/routing; el id interno nunca viaja en la URL. Un token inventado da 404. Los controles de sección de la Etapa 1 aplican igual sobre el recurso ya resuelto.

**Diferencia clave con `consumeViewToken`** (`expediente/vista/[token]`): ese es de un solo uso (vista efímera); el de la Etapa 2 es persistente y por lookup — las URLs de recursos se visitan repetidamente.

## Cierre de pendientes 2026-08-04 (`plan-cierre-idor-pendientes/`)

Dos huecos detectados al revisar la implementación de este plan quedaron cerrados:

- **Etapa 1 — Token en `/monitorista/solicitudes/[id]` (solicitudes generales)**: se aplicó el mismo patrón de token opaco a la rama `general` de la bandeja. `app/monitorista/solicitudes/page.tsx` genera el link con `token = obtenerOCrearToken('solicitud', id)` (nuevo tipo `solicitud` en `tokens_recurso`) y `app/monitorista/solicitudes/[id]/page.tsx` resuelve con `resolverToken('solicitud', id)` antes de consultar — id interno crudo o token inventado da 404. La rama `denuncia` (ya tokenizada) y `lib/recursos/token-recurso.ts` no se tocaron.
- **Etapa 2 — Autorización por sección en `/api/uploads/[...path]`**: el route ya no sirve archivos solo con sesión. Mapa deny-by-default `SECCION_POR_CARPETA` (`busquedas` → `busquedas`, `medidas_proteccion` → `medidas`) verifica `tienePermiso(usuario, seccion, 'ver')` antes de tocar el filesystem (403 si el usuario no tiene la sección o la carpeta no está en el mapa; 401 sin sesión). Si un módulo nuevo escribe en `uploads/`, hay que agregar su entrada al mapa.

Verificación: `npx tsc --noEmit` y `npm run build` limpios. `tokens_recurso` reutiliza la migración `0030` (sin migración nueva).

## Estado

Etapas 0, 1 y 2 construidas y verificadas el 2026-08-04. La Etapa 3 (cosmética: headers de seguridad / route groups) es opcional y quedó sin implementar a la espera de confirmación explícita del cliente.
