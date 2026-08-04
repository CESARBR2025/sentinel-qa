# Decisiones de Arquitectura

## ADR-001: Referencia en BD por string sentinel

**Contexto**: El formato de respuesta del v2 (`viewUrl` + `uuid`) no es compatible con el v1 (ruta relativa). Se necesita almacenar una referencia que permita regenerar view tokens cuando expiran.

**Decisión**: Guardar `exp2://{folderPath}#{uuid}` en las mismas columnas `text` existentes. El prefijo distingue v2 de legado sin migración SQL. Cero cambios de esquema sobre 9 tablas.

**Consecuencias**: No se puede hacer JOIN por referencia, pero no se necesita (el lookup es por ID de registro, no por referencia de archivo).

## ADR-002: Dual-read (v1 lee, v2 escribe)

**Contexto**: Archivos históricos están en v1. Migrar datos es riesgoso y no aporta beneficio inmediato.

**Decisión**: Todo upload nuevo va al v2. Referencias viejas en BD se siguen leyendo del v1 mientras el servidor esté vivo. Sin migración de datos, reversible.

**Consecuencias**: El proxy debe manejar ambos formatos. Complejidad acotada a un solo archivo. 

## ADR-003: Gate grueso de sección en el proxy vía endpoint HTTP (plan auditoría-URL, 2026-08-04)

**Contexto**: El pedido del cliente de "ocultar/encriptar las URLs" era seguridad por oscuridad; el riesgo real era Broken Access Control / IDOR (solo 42 de 148 `page.tsx` verificaban permiso de sección). Se consideraron dos formas de cerrar el hueco en el gate global (`proxy.ts`, que hoy solo exige sesión activa): (a) migrar el proxy a runtime Node para poder llamar a `obtenerPermisosUsuario` (driver `pg`) directo, o (b) dejar el proxy edge-compatible y resolver permisos en un endpoint Node al que el proxy llama por HTTP.

**Decisión**: (b) — el proxy sigue siendo edge y resuelve todo vía `betterFetch` HTTP, igual que ya hace con `get-session`. Se creó el endpoint Node `/api/auth/secciones-permitidas` (usa `obtenerPermisosUsuario`, incompatible con Edge), el mapa `lib/permisos/mapa-secciones.ts` (prefijo de ruta → secciones, generado con el CSV de `scripts/auditoria-permisos.mjs`) y el check grueso en `proxy.ts` entre el check de `activo` y el `next()` final.

**Consecuencias**: Dos llamadas HTTP en cadena por request de página (get-session + secciones-permitidas) agregan latencia. Si se vuelve medible, la optimización natural es fusionar ambos endpoints — no migrar el proxy a Node, que rompería el patrón edge actual. El check es grueso a propósito (solo `puede_ver` por sección); no reemplaza los `tienePermiso` finos por acción que cada página ya hace. Ver `Proxy y Auth.md`.

## ADR-004: Tokens opacos persistentes para URLs de recursos (plan auditoría-URL, 2026-08-04)

**Contexto**: Las URLs de recursos sensibles exponían el id interno (`/fiscalia/expedientes/${id}`, `/monitorista/detenidos/${id}`, `/monitorista/denuncias/${id}`). Se evaluó reusar `consumeViewToken` (`expediente/vista/[token]`), pero es de un solo uso (vista efímera) — no sirve para URLs que se visitan repetidamente.

**Decisión**: Tabla nueva `tokens_recurso` (token uuid + `tipo` + `recurso_id`, `UNIQUE(tipo, recurso_id)`) y helper `lib/recursos/token-recurso.ts` (`obtenerOCrearToken`/`resolverToken`). El mismo recurso siempre resuelve al mismo token (se genera perezosamente la primera vez, sin backfill). Las PKs internas y FKs no cambian; el token vive solo en la capa URL/routing. Es distinto de `consumeViewToken`: persistente, por lookup, no consumible.

**Consecuencias**: `id+1` deja de funcionar sobre las URLs de recursos; un token inventado da 404 (no revela si el recurso existe). Los controles de sección de la Etapa 1 aplican igual sobre el recurso ya resuelto (dos controles independientes, ambos deben pasar).
