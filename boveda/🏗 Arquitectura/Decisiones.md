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

## ADR-005: Separar generación de reporte de detenidos de la revisión de fotos (plan reporte-detenidos, 2026-08-04)

**Contexto**: Monitorista gestionaba tanto la revisión/aprobación de fotos de detenidos como la generación del reporte PPT consolidado.

**Decisión**: La generación del reporte se traslada a `/agente_reportes` (rol `Reportante`) como módulo de solo lectura, porque no requiere verificar evidencia — solo consolidar datos ya validados (3 fotos completadas) en un documento periódico. Monitorista conserva la revisión/aprobación, que sí requiere su rol de verificación de evidencia audiovisual.

**Consecuencias**: Nuevo módulo `lib/reporte-detenidos/` (types/repository/ppt-service/permisos) + página top-level `/reporte-detenidos` + API `POST /api/reporte-detenidos/generar-ppt`. Se eliminan el botón, la API y el `ppt-service` de Monitorista; su bandeja de revisión/aprobación se mantiene intacta. El PPT ahora es un solo archivo con 3 secciones (diario/semanal/mensual) sin filtros. El agrupamiento usa `created_at` de `ofi_reportes_campo` como proxy (no existe columna de fecha de evento).

## ADR-006: Saneamiento de arquitectura de BD — reporte de campo / D1 / detenidos (plan saneamiento-bd-d1, 2026-08-05)

**Contexto**: El flujo reporte de campo → D1 → detenidos acumuló deuda de esquema: dos tablas para el mismo concepto (`incidente_reporte_campo` muerta con lectores activos vs `ofi_reportes_campo` viva), dos fuentes de "detenido" (JSONB `ofi_detenidos` vs tabla `ofi_detalles_asegurados`), FK circular IPH↔Fichas, join por folio en vez de FK, `oficial_id` de D1 sin FK y en `text`, FKs duplicadas y `COALESCE` redundante. Diagnóstico y plan verificados por un arquitecto conectándose a la BD real antes de ejecutar.

**Decisiones**:
1. **Fuente única de reporte de campo**: `ofi_reportes_campo` es la única tabla viva; `incidente_reporte_campo` se eliminó (`DROP TABLE`, 0 filas, 9 archivos migrados). Dos tablas con el mismo propósito eran fuente de bugs de sincronización.
2. **Fuente única de detenidos de reporte de campo**: `ofi_detalles_asegurados` (relacional) es la fuente de lectura de `lib/detenidos-compartido.ts`; la columna JSONB `ofi_reportes_campo.ofi_detenidos` sigue existiendo para la captura del formulario pero ya no se lee ahí.
3. **Resolución de `oficial_id` en el D1**: `ofi_reporte_denuncia.oficial_id` referencia `ofi_oficiales(id)`, **no** `users(id)` — verificado contra BD real (el único valor coincide con `ofi_oficiales.id`). Se convirtió la columna a `uuid` y se agregó la FK. Se documenta la diferencia con `capturado_por`, que sí referencia `users(id)` y representa al usuario de sesión que capturó el reporte — no confundir en el futuro.
4. **FK circular IPH↔Fichas de Inteligencia resuelta**: se dejó unidireccional (`ofi_fichas_inteligencia.iph_id → iph_detenidos`); se eliminó el lado inverso (`fk_iph_vinculo_inteligencia`). La columna `ficha_inteligencia_id` se conserva sin FK (sin lectores en el código).
5. **FKs duplicadas eliminadas** en `ofi_reporte_denuncia.incidente_id`: de 3 (`fk_d1_incidente`, `fk_denuncia_incidente`, `ord_incidente_fk`) a 1 (`fk_d1_incidente`).
6. El join del D1 desde IPH en `lib/monitorista/repository.ts` dejó de ser por `folio_denuncia = folio_911` (texto) y ahora usa la FK real `reporte_denuncia_id`.
7. Migraciones manuales idempotentes `0031`–`0036` en `lib/db/manual-migrations/`, y el exportador de esquema (`npm run db:schema`) ahora incluye Índices y Foreign Keys.

**Consecuencias**: Este saneamiento es prerrequisito de `plan-formulario-d1` (carpeta hermana), que corre después sobre este modelo. Los dashboards disponen de los índices que antes faltaban. No se cambiaron contratos de `app/api/**` ni nombres de columnas expuestas.
