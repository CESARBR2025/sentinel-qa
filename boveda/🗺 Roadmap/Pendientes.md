# Pendientes y Roadmap

**Propósito**: Próximas features y mejoras.

---

## Pendientes
- [ ] Tests automatizados (no hay ninguno actualmente)
- [ ] Estandarizar respuestas de API routes con apiHandler/apiSuccess
- [ ] Auditoría de mutaciones (registro de quién creó/actualizó qué)
- [ ] `components/maps/GoogleMapPicker.tsx` recibe `libraries` como prop opcional sin default —
  distintas páginas lo llaman con arrays de libraries de Google Maps diferentes (`['places']` en
  unas, sin especificar en otras). `useJsApiLoader` exige que TODA la app use exactamente las
  mismas opciones para el mismo `id: 'google-map-script'`; si un usuario navega client-side entre
  dos páginas con configs distintas, truena con "Loader must not be called again with different
  options". Reproducido en desarrollo navegando de una página con mapa a `/analisis/formulario-
  ingreso` en la misma sesión de servidor. Fix real: unificar `libraries` en un solo valor
  constante para toda la app (auditar los ~9 archivos que usan `useJsApiLoader`).
- [ ] Logging estructurado y observabilidad
- [ ] Validación de entrada con Zod en server actions

## Deuda técnica — roles y permisos (auditoría 2026-07-15)

Se corrigió el bug raíz (`PERMISO_TOTAL` invertido en `lib/permisos/core.ts`, sin bypass
para admin) y se migraron los 6 módulos de rol exacto (agente_911, agente_bitacorista,
agente_despacho, agente_infracciones, agente_juzgado, agente_liberaciones) al sistema de
permisos granular. Ver `boveda/🏗 Arquitectura/Decisiones.md`. Queda pendiente:

- [x] **Rutas de `app/api` sin chequeo de rol/permiso — corregido (2026-07-15, segunda pasada)**.
  Se auditaron las 104 rutas de `app/api`; ~20 tenían solo sesión (o ni eso) sin ningún chequeo de
  rol/permiso. Corregidas todas las sensibles, reutilizando siempre el helper ya existente del
  módulo (`tienePermiso`/`verificarRolXXX`/`verificarAccesoXXXApi`) — nunca comparación de string
  de rol: `detenidos/{listar,registrar,detalle/[id]}`, `monitorista/{expediente-proxy,evidencias/
  subir,denuncias/subir,denuncias/[id]/completar-solicitud}`, `registro-detenidos/registrar`,
  `analisis/reportes-campo`, `nCoordinacion/generar`, `agente_juzgado/{iniciarProceso,
  finalizarProceso}`, `camara/exportar`, `reportes-operativos/exportar-excel`, `reportes-
  telefonicos/exportar`, `reportes-incidentes/exportar`, `reportes-sin-d1/exportar`, `reportes-
  sin-novedad/exportar`, `d1/exportar`, `via/infracciones/{retencion-placa,registrar,iniciar-
  proceso}` (las 3 restantes; las otras 3 críticas ya se habían corregido antes), `via/sa7/
  {generar-orden-pago,buscar-orden}` (dinero — gate combinado Oficial ∨ Infracciones ∨
  Liberaciones, ya que `FormularioInfraccion`/`CapturarInfractorSection` los llaman desde varios
  roles), `via/exp-digital/{guardar-evidencias,guardar-docs}`, `rol-servicios/externos/{rh,flota}`
  (gate `esAdmin`, igual que su layout). También se agregó el mismo `tienePermiso('reportes_
  ciudadano','ver')` a `app/reportes_incidentes/page.tsx`, que tenía el mismo hueco a nivel de
  página (solo sesión, sin permiso) — no detectado en el barrido de páginas anterior.
  Verificado: build limpio, admin real (200 en todas), sin sesión (307 vía `proxy.ts`, igual que
  antes).
- [ ] `app/api/complementos/gruas/route.ts` y `app/api/expediente/proxy/route.ts` no validaban
  sesión — corregido, ahora exigen sesión (sin gate de rol específico: son compartidas entre
  varios módulos — `expediente/proxy` lo usan corralón, fiscalía, juzgado y monitorista por igual).
- [ ] `app/api/uploads/[...path]/route.ts` sigue solo con chequeo de sesión (sin rol/permiso) —
  sirve archivos subidos de múltiples módulos por ruta de archivo; un gate por módulo requeriría
  namespacing de carpetas por sección, fuera de alcance de esta pasada.
- [x] `app/admin-transito/layout.tsx` — ya migrado a `tienePermiso(userId, 'admin_transito',
  'ver')` en la pasada de verificación en vivo del 2026-07-15 (ver sección de abajo). La nota
  anterior de "pendiente" en este archivo estaba desactualizada.
- [ ] Roles duplicados en BD: `Auxiliar` (id 32) y `Auxiliar de Novedades` (id 24) mapean al mismo
  módulo en `lib/permisos/registro.ts:73-88` — normalizar en BD requiere decisión de negocio
  (cuál es el nombre correcto) antes de eliminar el duplicado del código.
- [ ] Roles de prueba sueltos en la tabla `roles` de producción (`Prueba22`, `PRUEBA_CHATGPT`,
  `rol_prueba_2_sistema`, `ANALISTA_ROL`, `en_espera`, `ofi_destituido`) — limpiar si ya no se usan.

### Verificación en vivo (login real, 2026-07-15) — encontrado y corregido
- `lib/oficial/service.ts` tenía un **8º módulo no detectado** en ninguno de los barridos
  anteriores (ni el de roles hardcodeados, ni el de headers/logout — `/oficial` usa
  `ProfileDropdown`, no `DashboardHeader`, por eso no apareció en el grep de logout tampoco):
  `verificarRolOficial` comparaba `rol === 'Oficial de Campo'` a mano, sin bypass admin. Se
  detectó probando con el login real de Administrador: `/oficial`, `/oficial/despachos` y
  `/oficial/reportes` redirigían a `/dashboard` incluso para el admin. Migrado a
  `tienePermiso(userId, 'oficial_campo', 'ver')` (la sección ya existía en
  `lib/incidentes/permisos.ts`/`registro.ts`, con plantilla y filas de usuario reales ya en
  `puede_ver=true` — verificado en BD antes de migrar, cero riesgo para los 2 usuarios reales
  con ese rol). `obtenerRolUsuario` de `lib/oficial/repository.ts` quedó sin callers, eliminado.
  **Lección**: los checks de rol hardcodeado pueden usar cualquier nombre de función
  (`verificarRolXXX` no es un patrón universal) — la única forma confiable de encontrarlos todos
  es `grep -rn "=== '.*rol.*'"` contra el valor literal del rol, o probar cada módulo con un
  login real de Administrador.
- `app/api/expediente/subir-foto-detenido/route.ts` — rama `if/else` por rol (`agente_fiscalia`
  → destinos FISCALIA/AMBOS, `agente_juzgado` → JUZGADO_CIVICO/AMBOS, cualquier otro rol → 403).
  El admin caía en el `else` y quedaba bloqueado. Se agregó `esAdmin` como primera rama
  (destinos permitidos = todos). Sigue habiendo lógica de negocio por rol aquí (a propósito: qué
  destino puede subir fotos según dependencia) — no se migró a `tienePermiso` porque no es un
  simple ver/no-ver, es una regla de negocio distinta; solo se le agregó el bypass de admin.
- `lib/monitorista/actions.ts:requireMonitorista()` — `rol !== 'Monitorista'` a mano, bloqueaba
  `subirEvidencia` (Server Action) para el admin aunque ya pudiera ENTRAR a `/monitorista` vía el
  layout. Migrado a `tienePermiso(userId, 'solicitudes', 'ver')`. `getRolUsuario` de
  `lib/monitorista/repository.ts` quedó sin callers, eliminado.
- `app/admin-transito/layout.tsx` — el mismo `rolNombre !== 'admin_transito'` documentado como
  "pendiente" en la ronda anterior: probado en vivo, confirmado que bloqueaba al admin
  (`/admin-transito` → redirect a `/dashboard`). Migrado a
  `tienePermiso(userId, 'admin_transito', 'ver')` (sección y plantilla ya existían en
  `lib/admin-transito/permisos.ts`/`registro.ts`, 1 usuario real ya con `puede_ver=true`).
- **Barrido completo de las 133 páginas de la app** (login real de Administrador) encontró 2 bugs
  SQL preexistentes, sin relación con roles/permisos, que rompían páginas para CUALQUIER usuario:
  - `lib/reportes-operativos/repository.ts` y `service.ts` — `created_at` sin calificar en 7
    queries que hacen `JOIN` con `users` (que también tiene `created_at`) → error de Postgres
    "la referencia a la columna «created_at» es ambigua", tumbaba `/modulo_incidentes` con 500
    para todos. Arreglado calificando como `ofi_reportes_campo.created_at`.
  - Ver el punto de `GoogleMapPicker`/`useJsApiLoader` en la lista general de arriba — no se
    arregló (requiere auditar ~9 archivos), solo documentado.
  - El resto de los "500" detectados en el barrido fueron falsos positivos del método de prueba
    (IDs de prueba no-UUID/no-numéricos contra columnas `uuid`/`integer` reales) — verificado
    repitiendo con un UUID válido pero inexistente: todos devuelven 404 o redirect correcto, no
    hay bug real.

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

### 4º estilo de header encontrado y corregido (2026-07-15, tercera pasada)
El usuario señaló que `/prevencion/medidas` seguía con header distinto — ninguno de los greps
anteriores (`ProfileDropdown`, `chaleco.png`, `SubHeader`) lo detectaba porque **el header vivía
en el `layout.tsx` del módulo, no en cada `page.tsx`**, y no usaba ninguno de los 3 componentes
conocidos — era un `<header>` inline hecho a mano, sin logo ni `<SignOutButton />`. Esto reveló un
bug real, no solo de estilo: **`prevencion/*` (10 páginas) y `admin/*` (2 páginas) no tenían
NINGÚN botón de logout** — mismo bug original de "no hay botón para cerrar sesión" con el que
empezó toda esta auditoría, escondido porque el grep de sesiones anteriores solo miraba
`page.tsx`, nunca `layout.tsx`.
- [x] `app/prevencion/layout.tsx` — migrado a `DashboardHeader` (roleLabel "Prevención del
  Delito", backHref `/dashboard`, `CampanillaNotificaciones` movida a `children`). Las 10 páginas
  del módulo heredan el fix automáticamente.
- [x] `app/admin/layout.tsx` — migrado a `DashboardHeader` (roleLabel "Administración", backHref
  `/dashboard`, nav Usuarios/Roles movido a `children`).
- Verificado: `app/rol_servicios/page.tsx` SÍ tiene `SubHeader` (con logout) — no es un caso nuevo,
  ya estaba en la lista de módulos con `SubHeader` diferida por decisión del usuario.
- Verificado con grep exhaustivo sobre TODOS los `layout.tsx` del proyecto (no solo `page.tsx`):
  no quedan más layouts sin header conocido salvo los de solo-auth-gate sin UI propia (`monitorista`,
  `corralon`, `rol_servicios` — sus páginas individuales ya tienen su propio header).
- Build + tsc limpios, probado con login real de admin: `/prevencion/{medidas,busquedas,juridico}`
  y `/admin/{usuarios,roles}` responden 200.

**Botones de volver — corregido (2026-07-15, segunda pasada):**
Se decidió el destino lógico de cada una de las páginas sin backHref, investigando quién las
enlaza (no asumido, verificado con grep de callers reales):
- `d1`, `d1_noiniciada`, `modulo_incidentes`, `reportes_incidentes`, `estadisticos`, `sin_robos`,
  `incidentes_camaras`, `envio-de-formatos` → todas son sub-módulos de `/reportes` (confirmado en
  `app/reportes/page.tsx`, cada una tiene su tarjeta `OptionSquare` ahí) → `backHref="/reportes"`.
- `incidentes` (bitácora) → sub-módulo de `/agente_bitacorista` (único caller real, confirmado por
  grep) → `backHref="/agente_bitacorista"`.
- `analisis` → hub propio sin módulo padre (menú con tarjetas internas) → `backHref="/dashboard"`.
- `denuncia/nuevo` → ya tenía su propio link de vuelta dinámico en el body (`/oficial` o
  `/dashboard` según si viene de un reporte de recorrido) — no se tocó, no necesitaba `backHref`
  del header.
- 7 páginas adicionales encontradas fuera de la lista original (no usaban `DashboardHeader` ni
  `ProfileDropdown`, sino un header propio con `SignOutButton` suelto, por eso no aparecieron en
  ningún barrido anterior): `agente_juzgado/{liberaciones/[id],solicitudes/[solicitudId]}`,
  `fiscalia/{liberaciones/[id],solicitudes/[solicitudId],expedientes/[solicitudId]}`,
  `agente_liberaciones/revision-documental/[id]`, `agente_infracciones/revision-documental/[id]`
  — migradas a `DashboardHeader` con su backHref correspondiente al hub del módulo.
- 3 páginas más encontradas con `ProfileDropdown` fuera del inventario original:
  `agente_911/ciudadano/{page,incidentes/page}` e `infracciones/captura` — migradas también.

**8 componentes `ProfileDropdown` casi idénticos** (oficial, fiscalía, juzgado, liberaciones,
infracciones, auxiliar, nCoordinación, corralón) — ya no se usan en ninguna `page.tsx` (todas
migradas a `DashboardHeader`); los componentes en sí quedaron sin callers en ese nivel pero no se
borraron en esta pasada (limpieza de código muerto, no bug). **Excepción encontrada tarde**:
`app/admin-transito/layout.tsx` sigue renderizando `ProfileDropdown` (de `components/oficial/`)
inline en su propio header custom — no apareció en el barrido porque es un `layout.tsx`, no un
`page.tsx` (el grep de esta sesión solo cubrió `page.tsx`). Afecta a las 4 páginas del módulo
admin-transito. Mismo caso que el punto de abajo (`SubHeader` restante): encontrado pero fuera del
alcance decidido por el usuario para esta pasada — pendiente de migrar a `DashboardHeader` en la
próxima.

## Migración a header único (`DashboardHeader`, look de `/dashboard`) — plan por módulo (ver ADR-009)

Estándar final decidido: `DashboardHeader` (`components/partials/Header.tsx`), rehecho para verse
idéntico al header real de `/dashboard` (sticky, blur, logo 64px, animación `app-header-reveal`
en `globals.css`). **No** `SubHeader` — ese fue un primer intento, revertido por el usuario.
Migración deliberadamente gradual (no todo de un jalón) para poder revisar cada módulo en el
navegador antes de dar por bueno el cambio visual.

**Migración a `DashboardHeader` completa para todo lo que usaba `ProfileDropdown` o header custom
con `SignOutButton` suelto en un `page.tsx` (2026-07-15, segunda pasada).** Verificado con
`grep -rl "ProfileDropdown" app --include="page.tsx"` y `grep -rl "chaleco.png" app --include=
"page.tsx" | xargs grep -L "DashboardHeader"` → cero resultados salvo `(auth)/login` (correcto,
no debe llevar header — usuario aún no autenticado). Incluye, además de los módulos ya migrados
antes de esta pasada (dashboard, monitorista/detenidos/denuncias, auxiliar, oficial/despachos-
reportes): fiscalía completo (7 archivos), agente_juzgado completo (8 archivos), agente_911,
agente_despacho, agente_bitacorista, corralón, nCoordinación, y los 10 archivos "encontrados
tarde" documentados arriba (7 con header propio + `SignOutButton`, 3 con `ProfileDropdown` fuera
del inventario original).

**Siguen en `SubHeader`, fuera de alcance por decisión del usuario (2026-07-15, confirmado de
nuevo al preguntarle explícitamente si ampliar el scope):**
- [ ] `formato-n-*` (~15 archivos), `monitorista/historial`, `monitorista/detenidos` (raíz),
  `monitorista/incidentes-camara*`, `monitorista/solicitudes` (raíz), `rol_servicios`.
- [ ] `app/admin-transito/layout.tsx` — header propio con `ProfileDropdown` (de
  `components/oficial/`) para sus 4 páginas; encontrado al final de esta pasada (no apareció en el
  grep porque está en un `layout.tsx`, no un `page.tsx`) — mismo trato: documentado, no migrado.

**Sin tocar — pendiente de decidir en próxima sesión:**
- [ ] `monitorista/solicitudes/[id]` — tema oscuro (`#050810`); `DashboardHeader` es claro,
  necesita variante oscura o quedarse con su header propio a propósito.
