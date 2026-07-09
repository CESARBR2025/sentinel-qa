# Guía de Creación de la Bóveda de Conocimiento

> Basado en el sistema de bóveda del proyecto **Parrilant POS**.
> Esta guía describe la estructura, propósito de cada sección y el formato exacto de cada nota.

---

## 📁 Estructura de Directorios

```
boveda/
├── Home.md                          ← Índice maestro (punto de entrada)
├── 🏗 Arquitectura/                 ← Decisiones técnicas, estructura, archivos, auth
│   ├── Decisiones.md                ← ADRs (Architecture Decision Records)
│   ├── Estructura.md                ← Árbol de directorios del proyecto
│   ├── Indice de Archivos.md        ← Catálogo completo de todos los archivos
│   └── Middleware y Auth.md         ← Flujo de autenticación y autorización
├── 🧩 Features/                     ← Funcionalidades del sistema
│   ├── Index.md                     ← Catálogo de features con estado
│   └── [Nombre de la Feature].md    ← Una nota por feature
├── 🛠 Stack/                        ← Stack tecnológico y convenciones
│   ├── Comandos.md                  ← Comandos útiles (dev, build, lint, etc.)
│   ├── Componentes Compartidos.md   ← UI, providers, hooks, utilidades
│   ├── Convenciones.md              ← Patrones y reglas de código
│   ├── Estilos.md                   ← Sistema de diseño (colores, tipografía, etc.)
│   ├── Librerias.md                 ← Dependencias y versiones
│   └── Variables de Entorno.md      ← Variables de entorno requeridas
├── 📦 Datos/                        ← Base de datos y esquemas
│   ├── Esquema BD.md                ← Tablas, columnas, relaciones, enums
│   └── RLS Policies.md              ← Políticas de seguridad por tabla
├── 🗺 Roadmap/                      ← Estado del proyecto
│   ├── Changelog.md                 ← Historial de cambios cronológico
│   ├── Pendientes.md                ← Próximas features y bugs conocidos
│   └── Troubleshooting.md           ← Errores conocidos y soluciones
├── 📡 API/                          ← Endpoints y server actions
│   ├── API Routes.md                ← Endpoints RESTful
│   └── Server Actions.md            ← Catálogo de server actions
└── 📚 Referencias/                  ← Glosario y referencias
    └── Glosario.md                  ← Términos del dominio
```

---

## 📝 Formato de Cada Nota

### Regla general
Toda nota comienza con:

```markdown
# Título de la Nota

**Propósito**: Una línea que describe para qué sirve esta nota.

---
```

### 1. Home.md — Índice Maestro

```markdown
# 🏠 Bóveda [Nombre del Proyecto]

**Propósito**: Cerebro del proyecto. Leer siempre al iniciar una nueva sesión.

---

## 🏗 Arquitectura
| Nota | Descripción |
|------|-------------|
| [Estructura](🏗%20Arquitectura/Estructura.md) | Árbol de directorios del proyecto |
| [Decisiones](🏗%20Arquitectura/Decisiones.md) | ADRs y por qué se tomaron |

## 🧩 Features
| Nota | Descripción |
|------|-------------|
| [Nombre Feature](🧩%20Features/Nombre%20Feature.md) | Descripción breve |

...
```

- Contiene una tabla por cada sección de la bóveda
- Cada tabla enlaza a todas las notas de esa sección
- Los enlaces URL-encoded: espacios → `%20`

### 2. 🏗 Arquitectura/ — Decisiones Técnicas

**Decisiones.md** — ADRs:

```markdown
# Decisiones Técnicas (ADRs)

**Propósito**: Registro de decisiones de arquitectura y por qué se tomaron.

---

## ADR-001: Nombre de la Decisión
- **Contexto**: Situación que motivó la decisión
- **Decisión**: Qué se eligió y por qué
- **Consecuencia**: Impacto positivo y negativo
```

**Estructura.md**:

```markdown
# Estructura del Proyecto

**Propósito**: Mapa del árbol de directorios.

---

```
src/
├── app/          # Rutas y páginas
├── components/   # Componentes React
└── lib/          # Utilidades
```

| Ruta | Propósito |
|------|-----------|
| `src/app/` | Páginas y layouts |
```

**Indice de Archivos.md**:

```markdown
# Índice de Archivos

**Propósito**: Catálogo completo de cada archivo del proyecto.

---

### `src/app/`
| Archivo | Ln | Propósito |
|---------|-----|-----------|
| `src/app/page.tsx` | X | Página principal |
```

**Middleware y Auth.md**:

```markdown
# Middleware y Flujo de Autenticación

**Propósito**: Cómo se protegen las rutas.

---

Puede incluir:
- Diagramas Mermaid del flujo de auth
- Tablas de cookies del sistema
- Tablas de roles y permisos
- Tabla de rutas protegidas
```

### 3. 🧩 Features/ — Funcionalidades

**Index.md**:

```markdown
# Features — Índice

**Propósito**: Catálogo de todas las funcionalidades del sistema.

---

## Ronda 1 — [Nombre del Grupo]
| # | Feature | Estado |
|---|---------|--------|
| 1 | [`Nombre`](Nombre.md) | ✅ Documentada |
```

Estados: ✅ Documentada, 📝 Pendiente, 🔧 En progreso

**Cada Feature** debe seguir EXACTAMENTE 5 secciones:

```markdown
# Nombre de la Feature

**Propósito**: Una línea que describe qué hace.

---

## Flujo

[Diagrama Mermaid flowchart TD o pasos numerados]

## Componentes involucrados

| Archivo | Rol |
|---------|-----|
| `ruta/al/archivo.ts` | Qué hace en esta feature |

## BD

| Tabla | Columnas clave | Uso |
|-------|---------------|-----|
| `nombre_tabla` | `col1`, `col2` | Para qué se usa |

## Reglas de negocio

1. Primera regla
2. Segunda regla
```

### 4. 🛠 Stack/ — Tecnología

**Comandos.md**:

```markdown
# Comandos

**Propósito**: Referencia rápida de comandos útiles.

---

| Comando | Propósito |
|---------|-----------|
| `npm run dev` | Inicia servidor de desarrollo |
```

**Componentes Compartidos.md**: Catálogo de UI/Hooks/Providers reusables. Secciones: UI Base, Providers (con árbol de anidación), Hooks, Layout, Utilidades.

**Convenciones.md**: Reglas numeradas por categoría (Arquitectura, Server Actions, Naming, BD, Estilos, etc.).

**Estilos.md**: Sistema de diseño completo: colores, tipografía, spacing, bordes, componentes específicos, animaciones, responsive.

**Librerias.md**:

```markdown
# Librerías y Stack

**Propósito**: Dependencias del proyecto.

---

| Librería | Versión | Propósito |
|----------|---------|-----------|
| next | ^14 | Framework |
```

**Variables de Entorno.md**:

```markdown
# Variables de Entorno

**Propósito**: Documentación de variables de entorno.

---

| Variable | Obligatoria | Propósito | Dónde se usa |
|----------|-------------|-----------|--------------|
```

### 5. 📦 Datos/ — Base de Datos

**Esquema BD.md**:

```markdown
# Esquema de Base de Datos

**Propósito**: Mapa legible de tablas, relaciones, enums y funciones.

---

## Enums
| Enum | Valores |
|------|---------|

## Tablas
### `nombre_tabla`
PK: `id`

| Columna | Tipo | Nulo | Default |
|---------|------|------|--------|

## Funciones SQL
| Función | Propósito |

## Relaciones Clave
```
diagrama de texto de FK
```
```

**RLS Policies.md**:

```markdown
# RLS Policies

**Propósito**: Políticas de seguridad por tabla.

---

### `nombre_tabla`
| Política | Operación | Roles |
|----------|-----------|-------|
```

### 6. 🗺 Roadmap/ — Estado del Proyecto

**Changelog.md**:

```markdown
# Changelog

**Propósito**: Historial cronológico de cambios.

---

## YYYY — Mes

### — Título del cambio
- Descripción del cambio
- Archivos modificados
```

**Pendientes.md**:

```markdown
# Pendientes y Roadmap

**Propósito**: Próximas features y bugs.

---

## Prioridad Alta
- [ ] Tarea pendiente
```

**Troubleshooting.md**:

```markdown
# Troubleshooting

**Propósito**: Errores conocidos y soluciones.

---

## Síntoma del error
- **Síntoma**: Qué ocurre
- **Causa raíz**: Por qué ocurre
- **Fix**: Cómo se solucionó
- **Archivo**: Archivo modificado
```

### 7. 📡 API/ — Endpoints

**API Routes.md**:

```markdown
# API Routes

**Propósito**: Endpoints RESTful.

---

| Endpoint | Método | Propósito | Request | Response |
|----------|--------|-----------|---------|----------|
```

**Server Actions.md**:

```markdown
# Server Actions

**Propósito**: Catálogo de server actions.

---

| Función | Archivo | Permiso | Descripción |
|---------|---------|---------|-------------|
```

### 8. 📚 Referencias/ — Glosario

```markdown
# Glosario

**Propósito**: Términos del dominio.

---

### [Categoría]
| Término | Significado |
|---------|-------------|
```

---

## 🔄 Flujo de Trabajo

### Lectura obligatoria al iniciar sesión
1. Leer `boveda/Home.md` para contexto completo
2. Antes de modificar código, leer nota relevante en Features o Arquitectura
3. Antes de cambiar BD, leer `boveda/📦 Datos/`

### Escritura automática al completar cambios
- **Nueva feature** → crear `boveda/🧩 Features/[nombre].md` + actualizar `Features/Index.md`
- **Bug fix** → agregar entrada en `boveda/🗺 Roadmap/Changelog.md`
- **Cambio en BD** → actualizar `boveda/📦 Datos/Esquema BD.md` y `RLS Policies.md`
- **Decisión técnica** → agregar ADR en `boveda/🏗 Arquitectura/Decisiones.md`
- **Cambio en dependencias** → actualizar `boveda/🛠 Stack/Librerias.md`

### Regla de cierre
Cuando el usuario diga **"listo"** después de cambios:
1. Ejecutar typecheck (`npx tsc --noEmit`)
2. Actualizar bóveda según escritura automática
3. Si hubo cambios en BD → ejecutar `exportarSchema()`
4. Confirmar al usuario

---

## 🎨 Convenciones de Nombres

| Tipo | Formato | Ejemplo |
|------|---------|---------|
| Features | PascalCase | `Login y Seleccion de Sucursal.md` |
| Stack | PascalCase | `Variables de Entorno.md` |
| Datos | PascalCase | `Esquema BD.md` |
| Roadmap | PascalCase | `Changelog.md` |
| API | PascalCase | `Server Actions.md` |
| Arquitectura | PascalCase | `Decisiones.md` |
| Referencias | PascalCase | `Glosario.md` |
| Home | Nombre único | `Home.md` |

### Emojis de secciones
| Sección | Emoji | Código |
|---------|-------|--------|
| Arquitectura | 🏗 | `:🏗:` |
| Features | 🧩 | `:🧩:` |
| Stack | 🛠 | `:🛠:` |
| Datos | 📦 | `:📦:` |
| Roadmap | 🗺 | `:🗺:` |
| API | 📡 | `:📡:` |
| Referencias | 📚 | `:📚:` |

Los emojis van en el nombre del directorio y en los headings de Home.md.

---

## ⚙️ Obsidian (Opcional)

La bóveda se puede abrir como vault de Obsidian. Configuración mínima:

```json
// .obsidian/core-plugins.json
{
  "file-explorer": true,
  "global-search": true,
  "switcher": true,
  "graph": true,
  "backlink": true,
  "page-preview": true,
  "note-composer": true,
  "command-palette": true,
  "markdown-importer": false,
  "word-count": true,
  "open-with-default-app": true,
  "file-recovery": true
}
```

La integración con Obsidian no es obligatoria — la bóveda funciona como Markdown plano.
