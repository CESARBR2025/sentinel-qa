# SENTINEL — Sistema de Gestión de Seguridad Pública

**SSPM San Juan del Río, Querétaro**

Sistema integral para la gestión operativa de la Secretaría de Seguridad Pública Municipal de San Juan del Río. Cubre desde la recepción de emergencias (911), prevención del delito, atención a víctimas, área jurídica, rol de servicios (asignación de unidades), hasta incidentes y despacho.

---

## Stack Tecnológico

| Componente | Versión | Propósito |
|------------|---------|-----------|
| **Next.js** | 16.2.4 | Framework frontend + backend (App Router) |
| **React** | 19.2.4 | UI |
| **TypeScript** | 5.9 | Tipado estricto |
| **PostgreSQL** | — | Base de datos |
| **Drizzle ORM** | 0.45.2 | ORM y migraciones |
| **better-auth** | 1.6.7 | Autenticación (email/password + 2FA TOTP) |
| **Tailwind CSS** | 4 | Estilos (PostCSS) |
| **date-fns** | 4.1.0 | Cálculo de fechas y plazos |
| **framer-motion** | 12.40.0 | Animaciones |
| **lucide-react** | 1.21.0 | Iconos |
| **zustand** | 5.0.14 | Estado cliente |
| **react-signature-canvas** | 1.1.0-alpha.2 | Firmas digitales en Rol de Servicios |

---

## Arquitectura General

```
┌─────────────────────────────────────────────────────────────┐
│                     Next.js 16 App Router                    │
│                                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────────┐  │
│  │   911    │  │Prevención│  │Rol Serv. │  │  Admin     │  │
│  │ (ciuda-  │  │(medidas, │  │(asigna-  │  │ (usuarios, │  │
│  │  no/des- │  │búsquedas,│  │ ciones,  │  │  roles,    │  │
│  │  pacho/  │  │jurídico) │  │Edo.Fuer- │  │  catálogos)│  │
│  │  rondín) │  │          │  │ za/firmas)│  │            │  │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └─────┬──────┘  │
│       │              │              │               │        │
│  ┌────▼──────────────▼──────────────▼───────────────▼───┐   │
│  │              Server Actions + API Routes               │   │
│  │   'use server' · Route Handlers (app/api/)            │   │
│  └──────────────────────┬────────────────────────────────┘   │
│                         │                                    │
│  ┌──────────────────────▼────────────────────────────────┐   │
│  │              better-auth · Drizzle ORM                │   │
│  │   Sesiones · 2FA · Roles · Permisos · Auditoría      │   │
│  └──────────────────────┬────────────────────────────────┘   │
└─────────────────────────┼────────────────────────────────────┘
                          │
              ┌───────────▼───────────┐
              │     PostgreSQL DB     │
              │   sanjuandelrio.sytes │
              │   .net:5432           │
              └───────────────────────┘
```

### Capas

1. **Páginas (Server Components)** — Queries directas a DB, renderizado en servidor
2. **Componentes Cliente** — Solo interactividad (modales, formularios, timeline)
3. **Server Actions** — Mutaciones con `'use server'` en `lib/*/actions.ts`
4. **API Routes** — Endpoints REST en `app/api/*`
5. **Autenticación** — better-auth con sesiones en DB, 2FA opcional
6. **Base de Datos** — PostgreSQL con Drizzle ORM

---

## Estructura del Proyecto

```
seguridad_publica/
├── app/
│   ├── (auth)/           # Login, 2FA
│   ├── 911/              # Módulo 911 (ciudadano, despacho, rondín, whatsapp)
│   ├── admin/            # Admin (usuarios, roles)
│   ├── api/              # Route Handlers REST
│   ├── dashboard/        # Dashboard principal con módulos
│   ├── denuncia/         # Denuncias D1 (nuevo)
│   ├── incidentes/       # Listado de incidentes
│   ├── monitorista/      # Módulo Monitorista (nuevo)
│   ├── oficio/           # (pendiente)
│   ├── oficial/          # Vista para Oficial de Campo
│   ├── prevencion/       # Prevención del Delito (medidas, búsquedas, jurídico)
│   └── rol_servicios/    # Rol de Servicios (asignación de unidades)
├── components/           # Componentes reutilizables
│   ├── denuncias/        # FormularioD1 (nuevo)
│   └── monitorista/      # Bandeja, modal, galería (nuevo)
├── hooks/                # Custom hooks (incidentes, empleados, flota, etc.)
├── lib/
│   ├── db/               # Schema, seed, index, create-admin
│   ├── auth.ts           # Configuración de better-auth
│   ├── auth-client.ts    # Cliente de autenticación
│   ├── db.ts             # Pool de PostgreSQL
│   ├── admin/actions.ts  # Server Actions de administración
│   ├── incidentes/       # Actions, folio, auditoría
│   ├── monitorista/      # Actions, expediente digital (nuevo)
│   ├── notificaciones/   # Actions y generador de alertas
│   ├── oficial/          # Actions, service, repository, mapper, types
│   ├── prevencion/       # Actions, semáforo, timeline
│   └── rol-servicios/    # Actions y catálogos-actions
├── doc/                  # Documentación del proyecto
├── docs/                 # Documentación adicional
├── plan_trabajo/         # Planes de trabajo
├── login-desing/         # Diseños y wireframes de login
├── drizzle/              # Migraciones generadas
└── public/               # Assets estáticos
```

---

## Roles del Sistema

| Rol | Descripción |
|-----|-------------|
| **Administrador** | Acceso total al sistema |
| **Operador** | Captura y gestión de incidentes (911/despacho) |
| **Operador 911** | Captura inicial de eventos desde líneas telefónicas |
| **Despachador** | Asignación de unidades a incidentes |
| **Supervisor** | Supervisión y autorización de eventos |
| **Oficial de Campo** | Reportes de campo en app móvil |
| **Bitacorista** | Registro de movimientos operativos |
| **Monitorista** | Solicitudes de evidencias, subida de fotos/videos |
| **Operador Víctimas** | Captura y seguimiento de medidas y búsquedas |
| **Jurídico** | Bandeja legal, solicitudes a C4 y contestaciones |
| **Operador de Novedades** | Consolidación y generación de reportes |
| **Auxiliar de Novedades** | Clasificación de delitos y hechos |
| **Investigador** | Análisis, fichas y georreferenciación |
| **Monitoreo de Cámaras** | Registro de actividad de cámaras |
| **Consultor** | Acceso de solo lectura/consulta |

---

## Módulos del Dashboard

| Módulo | Estado | Ruta |
|--------|--------|------|
| Prevención del Delito | ✅ Activo | `/prevencion/medidas` |
| Gestión 911 | ✅ Activo | `/911` |
| Monitorista | ✅ Activo | `/monitorista` |
| Denuncias D1 | ✅ Activo | `/denuncia/nuevo` |
| Incidentes | 🚧 En construcción | — |
| Reportes | 🚧 En construcción | — |
| Catálogos | 🚧 En construcción | — |
| Administración | ✅ Activo | `/admin/usuarios` |

---

## Convenios de Código

- **Server Components** por defecto; `'use client'` solo cuando se necesita interactividad
- **`params` es Promise** en Next.js 16 — usar `const { id } = await params`
- **Timestamps de DB** convertir a ISO string antes de pasar a Client Components
- **Server Actions** en `lib/*/actions.ts` con `'use server'`
- **CSS**: Tailwind 4 + inline styles en módulo de Prevención
- **Paleta oscura institucional**: fondo `#070b16`, texto `#d8e0f0`, oro `#d4a43a`
