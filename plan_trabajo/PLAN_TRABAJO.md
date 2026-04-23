# Plan de Trabajo — Sistema C4 SSPM San Juan del Río

**Última actualización:** 22 de abril de 2026  
**Repositorio:** `seguridad_publica`  
**Stack:** Next.js 16 (App Router) · TypeScript · PostgreSQL 17 · Drizzle ORM · better-auth · Tailwind CSS 4

---

## Índice

1. [Contexto del sistema](#1-contexto-del-sistema)
2. [Arquitectura técnica](#2-arquitectura-técnica)
3. [Estructura del proyecto](#3-estructura-del-proyecto)
4. [Base de datos — Schema](#4-base-de-datos--schema)
5. [Lo que está hecho](#5-lo-que-está-hecho)
6. [Lo que falta por hacer](#6-lo-que-falta-por-hacer)
7. [Bloqueadores activos](#7-bloqueadores-activos)
8. [Módulos del sistema](#8-módulos-del-sistema)
9. [Fuentes externas](#9-fuentes-externas)
10. [Principios de IA](#10-principios-de-ia)
11. [Comandos útiles](#11-comandos-útiles)

---

## 1. Contexto del sistema

Sistema de gestión para la **Secretaría de Seguridad Pública Municipal (SSPM) de San Juan del Río, Qro.**

Cubre dos áreas principales:

| Área | Descripción |
|------|-------------|
| **C4 Operativo** | Centro de Control, Comando, Comunicación y Cómputo. Gestión del ciclo completo de incidentes: 911 → despacho → campo → bitácora → novedades → análisis → cierre |
| **Prevención del Delito** | Gestión de casos de protección y Alertas Ámbar mediante 9 formatos (FM-01 a FM-09) |

El sistema reemplaza flujos en papel y hojas de cálculo.

---

## 2. Arquitectura técnica

```
Browser (React 19)
    │
    ├── App Router (Next.js 16)
    │       ├── Server Components  → consultas directas a BD
    │       ├── Server Actions     → mutaciones seguras
    │       └── Route Handlers     → API REST / better-auth
    │
    ├── better-auth               → sesiones, 2FA TOTP
    ├── Drizzle ORM               → queries tipadas sobre pg
    └── PostgreSQL 17 (remoto)    → sanjuandelrio.sytes.net:5432
```

**Dependencias de producción:**

| Paquete | Versión | Propósito |
|---------|---------|-----------|
| `next` | 16.2.4 | Framework |
| `react` / `react-dom` | 19.2.4 | UI |
| `better-auth` | ^1.6.7 | Autenticación + 2FA |
| `drizzle-orm` | ^0.45.2 | ORM |
| `pg` | ^8.20.0 | Driver PostgreSQL |
| `qrcode` | ^1.5.4 | Generación QR para 2FA |
| `tailwindcss` | ^4 | Estilos |

**Dependencias de desarrollo:**

| Paquete | Propósito |
|---------|-----------|
| `drizzle-kit` | Migraciones y Drizzle Studio |
| `tsx` | Ejecutar scripts TypeScript directo |
| `dotenv` | Cargar `.env.local` en scripts |

---

## 3. Estructura del proyecto

```
seguridad_publica/
│
├── app/
│   ├── (auth)/                   # Grupo sin layout de sistema
│   │   ├── layout.tsx            # Fondo oscuro + logo centrado
│   │   └── login/
│   │       ├── page.tsx          # Formulario email + password
│   │       ├── 2fa/
│   │       │   └── page.tsx      # Input código TOTP (6 dígitos)
│   │       └── setup-2fa/
│   │           └── page.tsx      # Pantalla QR + verificación inicial
│   │
│   └── api/
│       ├── auth/[...all]/
│       │   └── route.ts          # Handler HTTP de better-auth
│       └── health/
│           └── route.ts          # Ping a BD → { ok, db_time }
│
├── lib/
│   ├── auth.ts                   # Configuración better-auth (TOTP, sesiones)
│   ├── auth-client.ts            # Cliente React (signIn, signOut, useSession)
│   ├── db.ts                     # Pool pg con singleton para hot-reload
│   └── db/
│       ├── schema.ts             # Tablas Drizzle (8 tablas)
│       ├── index.ts              # Instancia drizzle + re-export schema
│       └── seed.ts               # Datos iniciales: roles + módulos sidebar
│
├── middleware.ts                 # Protección de rutas + bloqueo usuarios inactivos
├── drizzle.config.ts             # Config drizzle-kit
├── plan_trabajo/
│   └── PLAN_TRABAJO.md          # Este archivo
└── doc/                          # Documentación externa (diagrama, cronograma)
    ├── diagrama_c4_v3.html
    ├── C4_SSPM_Cronograma_v3.xlsx
    └── Sistema_C4_SSPM_Documentacion_v3.docx
```

---

## 4. Base de datos — Schema

**Base de datos:** `seguridad_publica` en PostgreSQL 17  
**Host:** `sanjuandelrio.sytes.net:5432`

### Tablas de autenticación (gestionadas por better-auth)

| Tabla | Descripción |
|-------|-------------|
| `users` | Usuarios del sistema. Incluye campos extra: `apellido`, `rol_id`, `activo`, `two_factor_enabled` |
| `sessions` | Sesiones activas en BD (más seguro que JWT) — expiran en 8 horas |
| `accounts` | Credenciales por proveedor (email/password en este caso) |
| `verifications` | Tokens temporales para verificaciones |
| `two_factors` | Secret TOTP y backup codes por usuario |

### Tablas de negocio

| Tabla | Descripción |
|-------|-------------|
| `roles` | Roles del sistema: Administrador, Consultor, Operador |
| `modulos` | Ítems del sidebar con jerarquía padre/hijo (15 módulos seeded) |
| `usuario_modulos` | Permisos por usuario: qué módulos del sidebar puede ver cada quien |

### Diagrama de relaciones simplificado

```
roles ──────────────── users ─────────────── sessions
  (1:N por rol_id)      │                    (1:N)
                        │
                        ├── accounts (1:N)
                        ├── two_factors (1:1)
                        └── usuario_modulos (N:M con modulos)

modulos ─────────────── modulos (self-ref padre_id)
    └─────────────────── usuario_modulos
```

### Módulos del sidebar (seeded)

```
dashboard              → /dashboard
incidentes             → (grupo)
  ├── incidentes.nuevo     → /incidentes/nuevo
  ├── incidentes.listado   → /incidentes
  └── incidentes.mapa      → /incidentes/mapa
reportes               → (grupo)
  ├── reportes.diario      → /reportes/diario
  └── reportes.estadistico → /reportes/estadistico
catalogos              → (grupo)
  ├── catalogos.tipos      → /catalogos/tipos
  └── catalogos.colonias   → /catalogos/colonias
admin                  → (grupo)
  ├── admin.usuarios       → /admin/usuarios
  ├── admin.permisos       → /admin/permisos
  └── admin.roles          → /admin/roles
```

---

## 5. Lo que está hecho

### ✅ Infraestructura base

- [x] Proyecto Next.js 16 + TypeScript + Tailwind CSS 4 inicializado
- [x] Conexión a PostgreSQL remoto con `pg` (Pool + singleton para hot-reload)
- [x] Drizzle ORM configurado con `drizzle.config.ts`
- [x] Scripts de BD en `package.json`: `db:push`, `db:generate`, `db:migrate`, `db:studio`, `db:seed`
- [x] Route Handler de health check: `GET /api/health`

### ✅ Base de datos

- [x] Schema completo de 8 tablas en `lib/db/schema.ts`
- [x] Tablas creadas en PostgreSQL vía `drizzle-kit push`
- [x] Seed inicial ejecutado: 3 roles + 15 módulos del sidebar

### ✅ Autenticación y seguridad

- [x] **better-auth** configurado con:
  - Email + password (mínimo 8 caracteres)
  - Sesiones en BD (8 horas, refresco cada hora)
  - Plugin 2FA TOTP (Google Authenticator, Authy)
  - Campos extra en usuario: `apellido`, `rol_id`, `activo`
- [x] Route Handler `app/api/auth/[...all]/route.ts` para todos los endpoints de better-auth
- [x] Cliente React `lib/auth-client.ts` con plugin `twoFactorClient`
- [x] **Middleware** de protección de rutas:
  - Bloquea rutas no públicas sin sesión → redirige a `/login`
  - Bloquea usuarios con `activo = false` → redirige a `/login?error=cuenta_inactiva`

### ✅ UI de autenticación

- [x] Layout de auth oscuro con logo institucional (`app/(auth)/layout.tsx`)
- [x] Página de login (`/login`) — email + password, manejo de errores
- [x] Página de 2FA (`/login/2fa`) — input TOTP 6 dígitos con foco automático
- [x] Página de setup 2FA (`/login/setup-2fa`) — flujo en 2 pasos: QR → verificar
  - Genera QR dinámicamente con la librería `qrcode` (sin servicios externos)
  - Muestra URI manual para quienes no puedan escanear

---

## 6. Lo que falta por hacer

### 🔲 Autenticación — completar flujo

- [ ] **Script CLI para crear el primer usuario administrador** — necesario para arrancar el sistema sin pasar por login
- [ ] **Trigger de setup-2FA** — detectar cuándo un usuario tiene 2FA activado pero no configurado y redirigirlo al QR en su primer login
- [ ] **Pantalla de logout** con confirmación

### 🔲 Layout principal del sistema

- [ ] Layout con sidebar dinámico (lee `usuario_modulos` del usuario en sesión)
- [ ] Sidebar con soporte de grupos plegables (padre/hijo)
- [ ] Barra superior con nombre de usuario, rol y botón de cerrar sesión
- [ ] Tema institucional completo (colores SSPM)
- [ ] Responsive para tablet (uso en campo)

### 🔲 Módulo de Administración de Usuarios

- [ ] Listado de usuarios con paginación
- [ ] Formulario crear usuario (nombre, apellido, email, password, rol)
- [ ] Formulario editar usuario
- [ ] Activar / desactivar usuario (soft delete)
- [ ] **Pantalla de permisos por usuario** — UI con toggles del sidebar por módulo
- [ ] Activar/desactivar 2FA por usuario desde el panel de admin
- [ ] Historial de sesiones por usuario

### 🔲 Módulo de Roles

- [ ] Listado de roles
- [ ] Crear / editar roles
- [ ] Asignar rol por defecto a nuevos usuarios

### 🔲 C4 Operativo — 7 fases (requiere formatos)

- [ ] Schema BD: `incidentes`, `folios`, `bitacora_eventos`, `unidades`
- [ ] **Fase 1** — Formulario recepción llamada 911 ← *necesita campos del formato*
- [ ] **Fase 2** — Despacho digital de unidades ← *necesita campos*
- [ ] **Fase 3** — App de campo responsive (tablet/laptop) ← *necesita campos*
- [ ] **Fase 4** — Trigger bitácora automático (PostgreSQL)
- [ ] **Fase 5** — Módulo Novedades + borrador IA (Gemini/Ollama)
- [ ] **Fase 6** — Dashboard tiempo real con WebSocket
- [ ] **Fase 7** — Generación de PDF fichas institucionales
- [ ] **Fase 7** — Envío automático a Fiscalía por email (< 24 h)

### 🔲 Prevención del Delito (requiere formatos FM-01 a FM-09)

- [ ] Schema BD: `casos_proteccion`, `alertas_amber`, `visitas_seguimiento`
- [ ] FM-01 — Oficio entrante
- [ ] FM-02 — Apertura de caso
- [ ] FM-03 — Visita de seguimiento (repetible N veces)
- [ ] FM-04 — Cierre de caso
- [ ] FM-05 / FM-06 — Registro Alerta Ámbar
- [ ] FM-07 — Reporte 12 horas + recordatorio automático
- [ ] FM-08 — Reporte 24 horas + recordatorio automático
- [ ] FM-09 — Reporte 72 horas + recordatorio automático
- [ ] Subida a Sistema Conectar + acuse de recibo

### 🔲 Área de Análisis

- [ ] Dashboard consolidado (los 3 grupos del C4)
- [ ] Mapas PostGIS + Leaflet — incidencia geográfica
- [ ] Fichas PDF de asegurados
- [ ] Job nocturno: zonas calientes + alertas por umbral
- [ ] **Whisper STT** — oficial dicta reporte por micrófono, revisa y guarda

### 🔲 Infraestructura de producción

- [ ] Variables de entorno documentadas (`.env.example`)
- [ ] CI básico: lint + typecheck en cada push (GitHub Actions)
- [ ] Configuración de dominio y HTTPS
- [ ] Backups automáticos de BD

---

## 7. Bloqueadores activos

| Bloqueador | Impacto | Acción requerida |
|------------|---------|-----------------|
| **Formatos FM-01 a FM-09 sin campos definidos** | Bloquea toda la Fase 3 (Prevención del Delito) | Solicitar los formatos físicos/Excel actuales al área |
| **Formatos C4 Operativo sin campos** | Bloquea las Fases 1, 2 y 3 del C4 | Sesión de levantamiento con operativos C4 |
| **Roles y permisos sin validar** | No se puede configurar quién ve qué | Validar con jefatura: ¿qué puede ver un Consultor vs Operador? |

---

## 8. Módulos del sistema

| Módulo | Área | Prioridad | Estado |
|--------|------|-----------|--------|
| Autenticación + 2FA | Transversal | Alta | ✅ Hecho |
| Gestión de usuarios y permisos | Admin | Alta | 🔲 Pendiente |
| Layout + Sidebar dinámico | Transversal | Alta | 🔲 Pendiente |
| C4 — Recepción 911 | C4 Operativo | Alta | ⚠️ Bloqueado |
| C4 — Despacho de unidades | C4 Operativo | Alta | ⚠️ Bloqueado |
| C4 — Reporte de campo | C4 Operativo | Alta | ⚠️ Bloqueado |
| C4 — Bitácora automática | C4 Operativo | Media | 🔲 Pendiente |
| C4 — Novedades + IA | C4 Operativo | Media | 🔲 Pendiente |
| C4 — Dashboard tiempo real | C4 Operativo | Media | 🔲 Pendiente |
| C4 — Generación PDF | C4 Operativo | Media | 🔲 Pendiente |
| Prevención — FM-01 a FM-04 | Prevención | Alta | ⚠️ Bloqueado |
| Prevención — FM-05 a FM-09 (Ámbar) | Prevención | Alta | ⚠️ Bloqueado |
| Análisis — Dashboard consolidado | Análisis | Baja | 🔲 Pendiente |
| Análisis — Mapas PostGIS | Análisis | Baja | 🔲 Pendiente |
| Análisis — Whisper STT | Análisis | Baja | 🔲 Pendiente |

---

## 9. Fuentes externas

| Sistema | Rol en el flujo |
|---------|----------------|
| CAD Federal | Origen del folio de incidente |
| Sistema 911 | Llamadas entrantes |
| Hikvision GPS | Alarmas y posición de unidades |
| Radio / Campo | Operación sin cambio (app responsive) |
| Sistema Conectar | Alertas Ámbar (estatal) |
| Fiscalía / Sec. de la Mujer | Emiten oficios de Medidas de Protección |

---

## 10. Principios de IA

Ningún proceso crítico se ejecuta sin confirmación humana.

| Componente | Rol | Quién aprueba |
|------------|-----|---------------|
| Whisper STT | Transcribe audio del oficial en campo | El oficial revisa y guarda |
| Gemini / Ollama | Redacta borrador en Novedades | El operador edita y aprueba |
| Job nocturno | Detecta patrones y zonas calientes | El analista interpreta las alertas |

---

## 11. Comandos útiles

```bash
# Desarrollo
npm run dev                  # Levanta el servidor en localhost:3000

# Base de datos
npm run db:push              # Sincroniza el schema de Drizzle a la BD
npm run db:generate          # Genera archivos de migración SQL
npm run db:migrate           # Ejecuta las migraciones pendientes
npm run db:studio            # Abre Drizzle Studio (UI visual de la BD)
npm run db:seed              # Inserta roles y módulos base

# Calidad
npx tsc --noEmit             # Verifica tipos TypeScript sin compilar
npm run lint                 # ESLint

# Verificar conexión a BD
curl http://localhost:3000/api/health
```

### Variables de entorno requeridas (`.env.local`)

```bash
DATABASE_URL=postgresql://usuario:password@host:5432/seguridad_publica
PGHOST=host
DB_PORT=5432
PGUSER=usuario
PGPASSWORD=password
PGDATABASE=seguridad_publica
NEXT_PUBLIC_APP_URL=http://localhost:3000   # En producción: https://dominio.com
BETTER_AUTH_SECRET=<string-aleatorio-32-chars>   # ⚠️ Pendiente de agregar
```

> **Nota:** `BETTER_AUTH_SECRET` aún no está en `.env.local`. Es obligatorio para que better-auth firme las sesiones. Generar con: `openssl rand -base64 32`
