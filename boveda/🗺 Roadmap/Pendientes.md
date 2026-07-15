# Pendientes y Roadmap

**Propósito**: Próximas features y mejoras.

---

## Pendientes
- [ ] Tests automatizados (no hay ninguno actualmente)
- [ ] Estandarizar respuestas de API routes con apiHandler/apiSuccess
- [ ] Auditoría de mutaciones (registro de quién creó/actualizó qué)
- [ ] Logging estructurado y observabilidad
- [ ] Validación de entrada con Zod en server actions

## Deuda técnica — roles y permisos (auditoría 2026-07-15)

Se corrigió el bug raíz (`PERMISO_TOTAL` invertido en `lib/permisos/core.ts`, sin bypass
para admin) y se migraron los 6 módulos de rol exacto (agente_911, agente_bitacorista,
agente_despacho, agente_infracciones, agente_juzgado, agente_liberaciones) al sistema de
permisos granular. Ver `boveda/🏗 Arquitectura/Decisiones.md`. Queda pendiente:

- [ ] **83 rutas de `app/api` sin ningún chequeo de rol/permiso** (solo exigen sesión vía
  `proxy.ts`, o ni eso). Se arreglaron ya las 3 más críticas (`via/infracciones/liberar-garantia`,
  `via/infracciones/registradas/[id]`, `via/liberaciones/documentos/[infraccionId]`). Prioridad
  sugerida para el resto, por sensibilidad de datos: `app/api/detenidos/*`, `app/api/incidentes/*`,
  `app/api/monitorista/*`, `app/api/prevencion/*`, `app/api/reportes*`, `app/api/via/infracciones/*`
  y `app/api/via/sa7/*` (mueven dinero). Usar el patrón de `verificarRolXXX`/`tienePermiso` ya
  existente en cada módulo — no reinventar.
- [ ] Revisar `app/api/complementos/gruas/route.ts` y `app/api/expediente/proxy/route.ts` — no
  validan sesión y no son parte del flujo público de ciudadano (a diferencia de `via/ciudadano/*`,
  `via/pagos/confirmar-*` y `via/curp`, que sí son intencionalmente públicos).
- [ ] `app/admin-transito/layout.tsx` sigue comparando `rolNombre !== 'admin_transito'` — no se
  tocó en esta pasada por ser un rol de módulo (no el bypass de super-admin), pero debería
  migrarse al mismo patrón de permisos granulares.
- [ ] Roles duplicados en BD: `Auxiliar` (id 32) y `Auxiliar de Novedades` (id 24) mapean al mismo
  módulo en `lib/permisos/registro.ts:73-88` — normalizar en BD requiere decisión de negocio
  (cuál es el nombre correcto) antes de eliminar el duplicado del código.
- [ ] Roles de prueba sueltos en la tabla `roles` de producción (`Prueba22`, `PRUEBA_CHATGPT`,
  `rol_prueba_2_sistema`, `ANALISTA_ROL`, `en_espera`, `ofi_destituido`) — limpiar si ya no se usan.

### Revisión final (code-review, 2026-07-15) — ya corregido en esta pasada
- `lib/fiscalia/service.ts` tenía un **7º módulo no detectado** en el barrido inicial:
  `verificarRolFiscalia` y una segunda `verificarRolJuzgado` (duplicada, usada por
  `lib/fiscalia/actions.ts`) seguían comparando `rolNombre === 'agente_fiscalia'/'agente_juzgado'`
  a mano, sin bypass admin. Migradas a `tienePermiso()`.
- N+1 queries en `verificarRolAgente911`/`verificarRolAgenteDespacho` (2 llamadas secuenciales a
  `tieneAccesoSeccion`, hasta 4 queries) — colapsado a `tieneAlgunAcceso(userId, [secciones])` en
  `lib/911/permisos.ts`, 1 sola query.
- Código muerto (`obtenerRolUsuario` sin callers) eliminado de
  `lib/fiscalia/repository.ts`, `lib/agente_infracciones/repository.ts`,
  `lib/agente_juzgado/repository.ts`, `lib/agente_liberaciones/repository.ts`.
- `mapaDefault`/`mapaCompleto` duplicadas en `lib/permisos/core.ts` colapsadas en `mapaBase(secciones, base)`.

### Revisión final — pendiente, no corregido (bajo impacto, decisión consciente)
- [ ] `verificarRolInfracciones` (usado por `app/api/via/infracciones/liberar-garantia`, un PATCH)
  está fijo en la acción `'ver'` en vez de `'editar'`, igual que su Server Action equivalente en
  `lib/agente_infracciones/actions.ts`. Hoy no hay ningún usuario en BD con `puede_ver=true` y
  `puede_editar=false` para la sección `infracciones`, así que no hay impacto real — pero si se
  configura ese caso a futuro, un usuario de solo-lectura podría liberar garantías. No se corrigió
  aquí para no desalinear el API route del Server Action que protege la misma operación; si se
  arregla, hacerlo en ambos lugares a la vez.
- [ ] Las 3 rutas API nuevas (`via/infracciones/liberar-garantia`, `via/infracciones/registradas/[id]`,
  `via/liberaciones/documentos/[infraccionId]`) devuelven `NextResponse.json` a mano para 401/403 en
  vez de `UnauthorizedError`/`ForbiddenError` de `lib/error-handler.ts` (que exige AGENTS.md). Se
  dejó así por ser consistente con 90/104 rutas API existentes que ya hacen lo mismo — ver el punto
  de la lista general "Estandarizar respuestas de API routes" arriba.

## UI: botón Dashboard, logout y textos hardcodeados (2026-07-15)

Causa raíz: `components/partials/Header.tsx` (`DashboardHeader`) por defecto apuntaba
`backHref="/dashboard"` a ciegas — pero para ~14 roles con hub propio (monitorista, auxiliar,
reportes, fiscalía, nCoordinación, agente_911, agente_despacho, agente_bitacorista,
agente_juzgado, agente_liberaciones, agente_infracciones, admin_transito, oficial, corralón),
`/dashboard` redirige automáticamente de vuelta a ese mismo hub (`app/dashboard/page.tsx`) — el
botón "← Dashboard" era un loop muerto. Además el componente no traía botón de cerrar sesión
propio (dependía de que cada página pasara `children`, y 27 no lo hacían). Y la versión
"CENTINELA v1.2" estaba copy-pasteada como texto literal en 65 archivos (por eso el último push
tuvo que tocar 65 archivos solo para subir el número).

**Corregido:**
- `lib/auth/helpers.ts`: nuevo `obtenerHubRol(rolNombre)` — única fuente de verdad rol→hub,
  reemplaza el if-chain duplicado que vivía en `app/dashboard/page.tsx`.
- `DashboardHeader`: `backHref` ahora es opcional sin default — si no se pasa, no se muestra
  ningún botón "volver" (nunca más un link hardcodeado a ciegas). Trae `<SignOutButton />`
  integrado, arreglando las 27 páginas que no tenían logout de una sola vez.
- 5 hubs raíz (monitorista, auxiliar, reportes, fiscalía, nCoordinación) calculan su `backHref`
  dinámicamente con `obtenerHubRol`: se oculta para el rol dueño del hub, muestra `/dashboard`
  real para Administrador.
- 4 subpáginas de `/analisis/*` apuntan a `/analisis` en vez de a `/dashboard`.
- `lib/constants.ts` nuevo (`APP_VERSION`) — los 65 archivos con "CENTINELA v1.2" hardcodeado
  ahora interpolan `{APP_VERSION}`; el próximo cambio de versión toca un solo archivo.

**Pendiente, no corregido en esta pasada (alcance acotado a pedido del usuario):**
- [ ] ~16 páginas que no son hub-raíz ni tienen backHref dinámico (`d1`, `d1_noiniciada`,
  `modulo_incidentes`, `reportes_incidentes`, `incidentes_camaras`, `denuncia/nuevo`,
  `estadisticos`, `sin_robos`, `incidentes`, `envio-de-formatos`, `oficial/despachos/[id]` ya
  tenía backHref correcto) ahora simplemente no muestran botón "volver" (antes apuntaban a
  `/dashboard`, incorrecto para varios roles). Si se quiere el botón de vuelta, hay que decidir
  cuál es el destino lógico de cada una caso por caso.
- [ ] 8 componentes `ProfileDropdown` casi idénticos (uno por módulo: oficial, fiscalía, juzgado,
  liberaciones, infracciones, auxiliar, nCoordinación, corralón) — navbar/dropdown duplicado 8
  veces. No se fusionaron en esta pasada (decisión del usuario: solo el footer). Cada uno ya
  incluye su propio logout funcional, así que no es un bug — es deuda de mantenimiento.
