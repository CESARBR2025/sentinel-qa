# Plan: cerrar los 2 huecos pendientes del plan-auditoria-url

Carpeta de trabajo para cerrar los dos hallazgos que quedaron fuera de alcance al revisar `plan-auditoria-url/` (ya construido e implementado): la URL de solicitudes generales de monitorista sigue exponiendo el id interno, y `/api/uploads/[...path]` solo exige sesión sin verificar que el usuario tenga permiso sobre el módulo dueño del archivo. Diseñado por Claude (arquitecto), a construir por DeepSeek (worker).

## Contexto de por qué existen estos dos huecos

`plan-auditoria-url/` cerró IDOR hardening (Etapa 2) solo para expediente, detenido y denuncia — `/monitorista/solicitudes/[id]` (solicitudes "generales", no de denuncia) quedó fuera porque no estaba en la lista original. Y `app/api/uploads/[...path]/route.ts` nunca fue tocado por ese plan porque su alcance era URLs de páginas, no este endpoint de archivos — al revisar la implementación se encontró que solo comprueba sesión, sin comprobar que el usuario tenga permiso sobre el módulo (`busquedas`/`medidas_proteccion`) al que pertenece el archivo pedido.

## Orden de trabajo

Las dos etapas son independientes entre sí (archivos distintos, sin dependencia de código cruzada) — pueden construirse en paralelo.

1. [00-contexto.md](00-contexto.md) — leer primero. Código real completo de los archivos que se tocan en ambas etapas, y el patrón ya existente de `lib/recursos/token-recurso.ts` (no lo reinventes, ya está construido y probado contra la BD real).
2. [etapa-1-token-solicitudes-generales.md](etapa-1-token-solicitudes-generales.md) — aplica el mismo patrón de token opaco de `plan-auditoria-url` (Etapa 2) a `/monitorista/solicitudes/[id]`.
3. [etapa-2-autorizacion-uploads.md](etapa-2-autorizacion-uploads.md) — agrega check de sección a `app/api/uploads/[...path]/route.ts`.
4. [test-qa.md](test-qa.md) — verificación end-to-end de ambas etapas.

## Reglas para quien construye (DeepSeek)

- **No inventes un mecanismo de token nuevo.** `lib/recursos/token-recurso.ts` (`obtenerOCrearToken`/`resolverToken`) ya existe, ya está en producción (tabla `tokens_recurso` ya migrada y verificada contra la BD real) y ya se usa para expediente/detenido/denuncia. La Etapa 1 solo agrega un `tipo` nuevo (`'solicitud'`), no toca el helper.
- **No toques `lib/permisos/core.ts` ni los wrappers por módulo** (`lib/monitorista/permisos.ts`, `lib/prevencion/permisos.ts`) — la Etapa 2 solo importa `tienePermiso` de `lib/prevencion/permisos` en el nuevo route, no modifica la lógica de permisos.
- **La Etapa 2 es deny-by-default**: si el primer segmento de la ruta pedida no está en el mapa carpeta→sección, se rechaza con 403, no se sirve el archivo. No agregues un fallback permisivo "si no sé qué es, lo dejo pasar".
- Si algo en el código real no coincide con lo descrito aquí (nombres de archivo, líneas), prioriza el código real y ajusta al mismo patrón — este plan describe el estado del código al 2026-08-04.
- Al terminar cada etapa, corre `npx tsc --noEmit` como mínimo, y los pasos de verificación específicos de esa etapa.

## Fuera de alcance (no implementar salvo pedido explícito)

- Cualquier otro módulo que en el futuro empiece a escribir en `uploads/` fuera de `busquedas`/`medidas_proteccion` — cuando eso pase, agregar su entrada al mapa de la Etapa 2, no generalizar de más ahora sin necesidad real.
- Migrar `app/monitorista/solicitudes/[id]/page.tsx` fuera de su `// @ts-nocheck` actual — no es parte de este plan, no lo quites de paso.
- Cualquier cambio a `denunciaItemsPend`/`denunciaItemsAtend` (ya tienen `denunciaToken` de `plan-auditoria-url`) — solo se toca la rama `mapGral` (solicitudes generales).

## Checklist general al terminar TODAS las etapas

1. `npx tsc --noEmit` y `npm run build` sin errores.
2. `npx graphify update`.
3. Bóveda: agregar una entrada corta en `boveda/🧩 Features/Auditoría URLs y autorización.md` (ya existe, creada por `plan-auditoria-url`) documentando que las Etapas 1-2 de este plan cierran los dos huecos que quedaron pendientes, con fecha real.
4. Prueba manual: generar un link real desde la bandeja de solicitudes generales de monitorista (debe mostrar token, no id), y pedir un archivo por `/api/uploads/...` con un usuario que NO tenga la sección `busquedas`/`medidas` (debe dar 403).

## Estado: plan nuevo, sin etapas construidas aún
