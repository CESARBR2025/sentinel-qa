# Decisiones Técnicas (ADRs)

**Propósito**: Registro de decisiones de arquitectura y por qué se tomaron.

---

## ADR-001: No Drizzle en código de aplicación
- **Contexto**: El proyecto inició con Drizzle ORM para todas las consultas. La complejidad del ORM y la necesidad de consultas optimizadas llevó a migrar a SQL puro.
- **Decisión**: Toda consulta a BD usa `query()` de `@/lib/db` con SQL parametrizado. `drizzle-orm` solo queda como adapter de `better-auth`.
- **Consecuencia**: Control total sobre queries, menos overhead de ORM, pero más SQL manual.

## ADR-002: camelCase en TypeScript, snake_case en BD
- **Contexto**: Las columnas en PostgreSQL usan snake_case por convención. Los names de TypeScript usan camelCase. Sin una capa de conversión, los nombres se filtrarían al código.
- **Decisión**: Cada módulo tiene un `mapper.ts` que convierte `Record<string, unknown>` (lo que devuelve pg) a interfaces con camelCase.
- **Consecuencia**: Los componentes JSX leen propiedades camelCase, la BD mantiene su convención snake_case. Una capa explícita de mappers evita fugas.

## ADR-003: Arquitectura en capas por dominio
- **Contexto**: Sin una estructura estándar, cada desarrollador organizaba el código distinto. Las consultas se duplicaban y mezclaban responsabilidades.
- **Decisión**: Todo dominio sigue `lib/<modulo>/` con: types.ts → mapper.ts → repository.ts → service.ts (opt) → actions.ts (opt)
- **Consecuencia**: 23 módulos estandarizados. Las páginas importan de repository/service. Las mutaciones van por actions. Cero imports de query en app/.

## ADR-004: Repositorios funcionales en vez de clases
- **Contexto**: Algunos módulos (flota, corralon) usaban clases con métodos static. No había necesidad real de estado interno ni herencia.
- **Decisión**: Todos los repositorios y servicios son funciones exportadas, no clases.
- **Consecuencia**: Código más simple, tree-shakeable, sin `new` ni `this`.

## ADR-005: Manejo de errores centralizado
- **Contexto**: Cada server action manejaba errores distinto. Unos lanzaban `throw new Error()`, otros devolvían strings, otros silenciaban errores.
- **Decisión**: Se creó `lib/error-handler.ts` con AppError, NotFoundError, ValidationError, etc. Server actions usan `tryAction()` (retorna ActionResult) o `tryActionRaw()` (re-lanza).
- **Consecuencia**: Error handling consistente, errores 400/404/403 tipados, logs centralizados.

## ADR-006: Bóveda de conocimiento como única documentación
- **Contexto**: La documentación estaba regada en AGENTS.md, docs/, y varios archivos sueltos. Difícil de mantener y navegar.
- **Decisión**: Toda la documentación del proyecto vive en `boveda/` como vault de Obsidian/Markdown. AGENTS.md solo redirige a Home.md.
- **Consecuencia**: Documentación centralizada, navegable, versionada con el código.

## ADR-007: Notificaciones DOM directas en vez de sonner para toasts post-navegación
- **Contexto**: Sonner es la librería de toasts del proyecto (layout raíz). En el flujo de creación de incidentes, se necesita mostrar un toast de éxito en la página de destino después de una navegación con `router.push()`. El `<Toaster />` de sonner pierde el estado global durante la transición, descartando el toast.
- **Decisión**: Para notificaciones que deben persistir a través de navegaciones cliente (App Router), inyectar un elemento DOM directamente en `<body>` en lugar de usar el API de sonner. El toast se limpia con `setTimeout()`.
- **Consecuencia**: Funciona consistentemente sin depender del estado de React/sonner. Ligeramente más código manual, pero aislado en un solo componente (`ToastOnLoad.tsx`). No reemplaza a sonner para toasts dentro de la misma página (esos siguen funcionando correctamente).

## ADR-008: Acceso admin y de módulo se define 100% en BD, nunca por nombre de rol en código
- **Contexto**: Auditoría de roles/permisos (2026-07-15) encontró tres mecanismos de control de acceso que no se comunicaban entre sí: permisos granulares por sección (`lib/permisos/core.ts`), checks de rol exacto hardcodeados (`rolNombre === 'agente_911'`, etc.) en 6 módulos operativos, y checks ad-hoc `rolNombre !== 'Administrador'` en la zona admin. Bug raíz: `PERMISO_TOTAL` (default cuando no hay fila en `permisos`) estaba definido con todo en `false`, contradiciendo su propio comentario ("sin fila = acceso completo"). Ningún mecanismo tenía bypass para Administrador — un admin sin filas manuales en `permisos` quedaba bloqueado en monitorista, corralon, auxiliar, analisis, prevención, y no podía entrar en absoluto a los 6 módulos de rol exacto (911, bitacorista, despacho, infracciones, juzgado, liberaciones).
- **Decisión**: (1) Nueva columna `roles.es_admin` (migración `0013_roles_es_admin.sql`) marca en BD qué rol tiene acceso total — nunca se compara `rolNombre === 'Administrador'` en código; `getUserWithRole()` es el único lugar que la resuelve, expuesta como `UserWithRole.esAdmin`. (2) `PERMISO_TOTAL` se separó en `PERMISO_COMPLETO` (todo `true`) y `PERMISO_NINGUNO` (todo `false`) — **el default cuando no hay fila sigue siendo `PERMISO_NINGUNO` (deny-by-default) para todo usuario no-admin**; se descartó la idea inicial de "sin fila = acceso completo" tras confirmar en BD que cada rol solo tiene fila de `permisos` para las secciones de su propio módulo (ej. Auxiliar solo tiene `auxiliar_checklist`/`auxiliar_cuestionario_robo`) — con default permisivo, cualquier rol sin fila para una sección ajena habría ganado acceso cruzado a módulos de otros roles (ej. Auxiliar entrando a `/monitorista`). Solo `esAdmin` obtiene `PERMISO_COMPLETO` sin consultar `permisos`. (3) Los 6 módulos de rol exacto se migraron a `tienePermiso(...)` contra las secciones que ya existían en `lib/permisos/registro.ts` (`911_ciudadano`/`911_whatsapp` para agente_911, `911_rondin`/`911_despacho` para agente_despacho, `incidentes` para agente_bitacorista, `infracciones`/`juzgado`/`liberaciones` para sus respectivos módulos) — la plumbing ya existía (plantillas con `puede_ver=true`), solo no estaba conectada al gate real.
- **Consecuencia**: Ningún archivo de código compara nombres de rol para decidir acceso — todo pasa por `roles.es_admin` o por `permisos`/`permisos_plantillas` + secciones. Editable desde `/admin/roles` sin tocar código. Pendiente (ver `Pendientes.md`): migrar `admin_transito` al mismo patrón, y proteger las ~83 rutas de API restantes sin chequeo de rol/permiso.

## ADR-009: `DashboardHeader` (look de `/dashboard`) es el header único de todo el sistema
- **Contexto**: Auditoría de UI (2026-07-15) encontró **4 estilos de header conviviendo**: (1) `DashboardHeader` (barra con logo, sin botón "volver" salvo que la página lo pase), (2) `SubHeader` (barra compacta con back+moduleLabel+title+accent+usuario+logout, usado en formato-n-*, monitorista, rol_servicios), (3) un template ad-hoc "logo+barra de color+link volver+footer a juego" repetido en páginas de detalle de juzgado/fiscalía/liberaciones/infracciones, y (4) **8 componentes `ProfileDropdown` casi idénticos** (uno por módulo) usados en páginas hub. Además, el botón "← Dashboard" apuntaba a `/dashboard` a ciegas en varias páginas, causando un loop muerto para roles con hub propio (ver más abajo).
- **Primer intento (revertido)**: se propuso `SubHeader` como estándar y se migraron 9 páginas a él. El usuario corrigió: **el header real de `/dashboard`** (sticky, blur, logo grande 64px, animación de entrada, "Sistema Táctico" + "CENTINELA") **es el diseño de referencia para todo el sistema**, no `SubHeader`. Ese header vivía hardcodeado dentro de `app/dashboard/page.tsx`, no era un componente.
- **Decisión final**: se rehizo `components/partials/Header.tsx` (`DashboardHeader`) para que sea **visualmente idéntico** al header de `/dashboard` (mismo sticky/blur/logo/animación — la animación (`app-header-reveal`) se movió a `app/globals.css` para que cualquier página pueda usarla sin duplicar `<style>` tags), con `backHref`/`backLabel` opcionales integrados como único elemento variable entre páginas. `app/dashboard/page.tsx` ahora consume `<DashboardHeader user={user} />` en vez de duplicar el header inline — elimina la última copia. El título/contexto específico de cada página (ej. "Reporte de Detenido: Juan Pérez") **ya no vive en el header** — vuelve al cuerpo de la página, debajo, como bloque de título propio (patrón que ya usaban la mayoría de las páginas antes de esta sesión).
- **Consecuencia**: `DashboardHeader` es el ÚNICO componente de header válido para nueva UI. Las 9 páginas migradas primero a `SubHeader` se revirtieron a `DashboardHeader`. `SubHeader`, el template ad-hoc de detalle, y los 8 `ProfileDropdown` quedan como deuda técnica a migrar módulo por módulo (gradual, no de un jalón — alto riesgo de romper un módulo que no se pueda probar en el navegador en la misma sesión) — ver `Pendientes.md` para el estado exacto.
