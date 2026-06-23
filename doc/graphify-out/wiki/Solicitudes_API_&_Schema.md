# Solicitudes API & Schema

> 10 nodes · cohesion 0.22

## Key Concepts

- **route.ts** (8 connections) — `app/api/prevencion/solicitudes/[id]/route.ts`
- **solicitudesInformacion** (7 connections) — `lib/db/schema.ts`
- **route.ts** (6 connections) — `app/api/prevencion/solicitudes/[id]/contestacion/route.ts`
- **route.ts** (6 connections) — `app/api/prevencion/solicitudes/route.ts`
- **contestaciones** (5 connections) — `lib/db/schema.ts`
- **GET()** (1 connections) — `app/api/prevencion/solicitudes/[id]/route.ts`
- **PUT()** (1 connections) — `app/api/prevencion/solicitudes/[id]/route.ts`
- **POST()** (1 connections) — `app/api/prevencion/solicitudes/[id]/contestacion/route.ts`
- **GET()** (1 connections) — `app/api/prevencion/solicitudes/route.ts`
- **POST()** (1 connections) — `app/api/prevencion/solicitudes/route.ts`

## Relationships

- [[Búsquedas API Routes]] (6 shared connections)
- [[Esquema Base de Datos]] (5 shared connections)
- [[Detalle Solicitud Jurídica]] (2 shared connections)
- [[Formularios Nuevos Registros]] (2 shared connections)
- [[Solicitudes C4 Internas]] (1 shared connections)
- [[Medidas Protección UI]] (1 shared connections)

## Source Files

- `app/api/prevencion/solicitudes/[id]/contestacion/route.ts`
- `app/api/prevencion/solicitudes/[id]/route.ts`
- `app/api/prevencion/solicitudes/route.ts`
- `lib/db/schema.ts`

## Audit Trail

- EXTRACTED: 37 (100%)
- INFERRED: 0 (0%)
- AMBIGUOUS: 0 (0%)

---

*Part of the graphify knowledge wiki. See [[index]] to navigate.*