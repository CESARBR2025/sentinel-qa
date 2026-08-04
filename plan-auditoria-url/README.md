# Plan: cerrar el hueco real de autorización detrás del pedido "ocultar las URLs"

Carpeta de trabajo para responder al pedido del cliente de "que la URL no muestre las rutas entre carpetas al navegar". Analizado el código real, ese pedido literal es seguridad por oscuridad y Next.js App Router no la soporta de forma nativa sin rewrites que no cierran ningún hueco. El riesgo genuino detrás del pedido es **Broken Access Control / IDOR** (OWASP A01): el control de acceso por rol es inconsistente entre páginas (solo 42 de 148 `page.tsx` verifican permiso de sección) y las URLs de recursos usan IDs numéricos secuenciales adivinables. Ya hubo un caso real explotable, documentado en `boveda/🗺 Roadmap/Troubleshooting.md` (2026-07-15): `app/reportes_incidentes/page.tsx` solo exigía sesión, sin permiso de sección. Diseñado por Claude (arquitecto), a construir por DeepSeek (worker).

## Orden de trabajo

Las etapas son **secuenciales** — a diferencia de otros planes de esta carpeta, aquí sí hay dependencia real: la Etapa 1 necesita el CSV que produce la Etapa 0, y la Etapa 2 es independiente en archivos pero conviene hacerla después de cerrar el hueco de acceso (si no, se estaría endureciendo IDs de recursos a los que cualquiera podría entrar igual). La Etapa 3 es opcional y va al final.

1. [00-contexto.md](00-contexto.md) — leer primero, siempre. Código real completo de `proxy.ts`, `lib/permisos/core.ts`, `lib/auth.ts` y el precedente de token opaco en `app/api/expediente/vista/[token]/route.ts`.
2. [etapa-0-auditoria.md](etapa-0-auditoria.md) — script `scripts/auditoria-permisos.mjs`: recorre las 148 `page.tsx` y las `route.ts` de `app/api/**` y genera un CSV de qué rutas tienen check de permiso y cuál. Es la base de datos real para la Etapa 1 — nadie debe adivinar a mano el mapa ruta→sección.
3. [etapa-1-cierre-autorizacion.md](etapa-1-cierre-autorizacion.md) — mapa `RUTA_PREFIX -> seccion`, endpoint `/api/auth/secciones-permitidas` (Node runtime), y modificación de `proxy.ts` para bloquear por sección sin tocar 106 páginas una por una.
4. [etapa-2-idor-hardening.md](etapa-2-idor-hardening.md) — reemplaza IDs numéricos secuenciales por tokens opacos persistentes en URLs de expedientes, detenidos y denuncias.
5. [etapa-3-cosmetica-opcional.md](etapa-3-cosmetica-opcional.md) — **opcional**: route groups + headers de seguridad, para responder al pedido literal del cliente sin venderlo como solución real.
6. [test-qa.md](test-qa.md) — verificación end-to-end de todas las etapas + actualización de bóveda.

## Reglas para quien construye (DeepSeek)

- **No implementes la Etapa 1 adivinando el mapa de secciones.** El mapa `RUTA_PREFIX -> seccion` de la Etapa 1 se completa con el CSV real que produce el script de la Etapa 0 — los nombres de "seccion" en `permisos`/`permisos_plantillas` no siempre coinciden con el nombre de la carpeta (ej. `app/agente_911` tiene varias secciones anidadas, no una sola). Corre el script primero, después llena el mapa con lo que reporte.
- **No toques `lib/permisos/core.ts::tienePermiso`/`obtenerPermisosUsuario`** — la lógica fina de permisos por acción (ver/crear/editar/eliminar) se queda exactamente igual, página por página. La Etapa 1 solo agrega un check *grueso* de sección en `proxy.ts`, no reemplaza el fino.
- **No migres `proxy.ts` a runtime Node ni le hagas importar `lib/db.ts`/`pg` directamente** — rompería el patrón edge-compatible actual. El proxy sigue resolviendo todo vía `betterFetch` HTTP, igual que ya hace hoy con `get-session` (ver `00-contexto.md`). Toda consulta a Postgres para permisos vive en el nuevo endpoint Node `/api/auth/secciones-permitidas`, no en el proxy.
- **La Etapa 2 no cambia PKs internas ni hace migración de esquema destructiva** — agrega columna/tabla de mapeo token↔id, sin tocar las FKs existentes.
- **El token de la Etapa 2 NO es el mismo mecanismo que `consumeViewToken`** de `expediente/vista/[token]` — ese es de un solo uso (vista efímera de documento). Las URLs de recursos (expediente, detenido, denuncia) se visitan repetidamente y hay que poder volver a ellas — el token debe ser persistente, no consumible.
- Si algo en el código real no coincide con lo descrito aquí (nombres de archivo, líneas, valores de `seccion`), prioriza el código real y ajusta la implementación al mismo patrón — este plan describe el estado del código al 2026-08-04.
- Al terminar cada etapa, corre `npx tsc --noEmit` como mínimo, y los pasos de verificación específicos listados en esa etapa.

## Fuera de alcance (no implementar salvo pedido explícito)

- Cambiar el mecanismo de sesión/2FA de better-auth — no se toca.
- Migrar las 106 páginas restantes a `tienePermiso` explícito una por una — la Etapa 1 cubre el gate grueso de sección desde el proxy; el fino se agrega solo donde ya existía o donde el CSV de la Etapa 0 muestre una acción de escritura (crear/editar/eliminar) sin cobertura.
- Cualquier forma de "encriptar" la URL completa (base64, cifrado simétrico del path) — no aporta seguridad real y complica debugging/SEO/caching sin necesidad; por eso no está entre las etapas.
- Rotar o invalidar tokens ya emitidos de `expediente/vista/[token]` — ese mecanismo queda como está.

## Checklist general al terminar TODAS las etapas

1. `npx tsc --noEmit` y `npm run build` sin errores.
2. Reejecutar `scripts/auditoria-permisos.mjs` → 0 rutas de sección sin cobertura en el proxy, y 0 acciones de escritura sin `tienePermiso`.
3. `npx graphify update`.
4. Bóveda actualizada: `boveda/🏗 Arquitectura/Proxy y Auth.md` (nuevo gate de sección en el proxy) + entrada en `boveda/🗺 Roadmap/Troubleshooting.md` cerrando el incidente de 2026-07-15 con la fecha de la fix real + `boveda/🏗 Arquitectura/Decisiones.md` con el ADR de por qué el check de sección vive en el proxy vía endpoint HTTP y no migrando a runtime Node.
5. Prueba manual end-to-end — ver [test-qa.md](test-qa.md) para el detalle completo, incluye: usuario de rol X contra URL de sección Y (debe redirigir), URL de recurso con id adivinado `id+1` (debe dar 404/403), y regresión específica sobre `reportes_incidentes`.

## Estado: plan nuevo, sin etapas construidas aún

Ninguna etapa está marcada como construida todavía — este plan se generó el 2026-08-04, listo para que DeepSeek empiece por la Etapa 0.
