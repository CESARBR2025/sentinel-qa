# Búsquedas API Routes

> 17 nodes · cohesion 0.16

## Key Concepts

- **db.ts** (17 connections) — `lib/db.ts`
- **db** (12 connections) — `lib/db.ts`
- **route.ts** (7 connections) — `app/api/prevencion/busquedas/[id]/route.ts`
- **seguimientosBusqueda** (7 connections) — `lib/db/schema.ts`
- **route.ts** (6 connections) — `app/api/prevencion/busquedas/route.ts`
- **route.ts** (5 connections) — `app/api/prevencion/busquedas/[id]/cancelar/route.ts`
- **route.ts** (5 connections) — `app/api/prevencion/busquedas/[id]/seguimientos/route.ts`
- **route.ts** (3 connections) — `app/api/health/route.ts`
- **query()** (2 connections) — `lib/db.ts`
- **GET()** (1 connections) — `app/api/prevencion/busquedas/[id]/route.ts`
- **PUT()** (1 connections) — `app/api/prevencion/busquedas/[id]/route.ts`
- **GET()** (1 connections) — `app/api/prevencion/busquedas/route.ts`
- **POST()** (1 connections) — `app/api/prevencion/busquedas/route.ts`
- **POST()** (1 connections) — `app/api/prevencion/busquedas/[id]/cancelar/route.ts`
- **GET()** (1 connections) — `app/api/health/route.ts`
- **createPool()** (1 connections) — `lib/db.ts`
- **POST()** (1 connections) — `app/api/prevencion/busquedas/[id]/seguimientos/route.ts`

## Relationships

- [[Esquema Base de Datos]] (6 shared connections)
- [[Solicitudes API & Schema]] (6 shared connections)
- [[Admin & Alertas API]] (5 shared connections)
- [[Medidas API Routes]] (4 shared connections)
- [[Visitas Domiciliarias]] (2 shared connections)
- [[Solicitudes C4 Internas]] (2 shared connections)
- [[Detalle Búsqueda & Timeline]] (1 shared connections)
- [[Auth Library & Notificaciones]] (1 shared connections)
- [[Formularios Nuevos Registros]] (1 shared connections)

## Source Files

- `app/api/health/route.ts`
- `app/api/prevencion/busquedas/[id]/cancelar/route.ts`
- `app/api/prevencion/busquedas/[id]/route.ts`
- `app/api/prevencion/busquedas/[id]/seguimientos/route.ts`
- `app/api/prevencion/busquedas/route.ts`
- `lib/db.ts`
- `lib/db/schema.ts`

## Audit Trail

- EXTRACTED: 72 (100%)
- INFERRED: 0 (0%)
- AMBIGUOUS: 0 (0%)

---

*Part of the graphify knowledge wiki. See [[index]] to navigate.*