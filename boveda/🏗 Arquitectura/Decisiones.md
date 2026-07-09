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
