# Plan de Desarrollo — Prevención del Delito: Atención a Víctimas y Área Jurídica

**Versión:** 3.0 — actualizado 28 de abril de 2026  
**Base documental:** `doc/Exceles-atencionAvictimas/` · `doc/Analisis_Historias_Atencion_Victimas.md`  
**Total de puntos de historia:** 34 pts (5+3+5 | 3+5+2 | 3+5+3)  
**Estado global:** Sprint 0 ✅ · Sprint 1 ✅ · Sprint 2 ✅ · **Sprint 3 ✅ COMPLETADO**

---

## ESTADO DE AVANCE

| Sprint | Épica | Puntos | Estado |
|--------|-------|--------|--------|
| Sprint 0 | Cimientos (BD + layout) | — | ✅ COMPLETADO |
| Sprint 1 | Medidas de Protección | 13 pts | ✅ COMPLETADO |
| Sprint 2 | Protocolo Alba / Búsquedas | 10 pts | ✅ COMPLETADO |
| Sprint 3 | Solicitudes y Flujo Jurídico | 11 pts | ✅ COMPLETADO |

---

## ARQUITECTURA TÉCNICA IMPLEMENTADA

> **LEER ESTO ANTES DE TOCAR CUALQUIER ARCHIVO**

### Stack real del proyecto

- **Next.js 16.2.4** App Router — leer `node_modules/next/dist/docs/` antes de escribir código
- **React 19.2.4** — Server Components por defecto, Client Components con `'use client'`
- **Drizzle ORM 0.45.2** con `node-postgres` (pg)
- **better-auth 1.6.7** — `users.id` es `text`, NO uuid. Todos los FK a users usan `text()`
- **date-fns 4.1.0** — instalado para cálculo de plazos
- **TypeScript 5 strict mode** — correr `npx tsc --noEmit` antes de considerar algo listo

### Patrón de datos (CRÍTICO)

- Columnas `date()` en Drizzle → retornan `string` con formato `'YYYY-MM-DD'`
- Columnas `timestamp()` en Drizzle → retornan `Date` (objeto JavaScript) vía node-postgres
- Para pasar timestamps de Server Component a Client Component → siempre convertir a ISO string:
  ```typescript
  const iso = v instanceof Date ? v.toISOString() : new Date(String(v)).toISOString()
  ```
- Para parsear en componentes: `new Date(isoString)` o `parseISO(isoString)` de date-fns

### Patrón de mutaciones (Server Actions — NO Route Handlers)

Todas las mutaciones usan Server Actions en `lib/prevencion/actions.ts` con directiva `'use server'`.

**Autenticación en Server Actions:**
```typescript
const session = await auth.api.getSession({ headers: await headers() })
if (!session) throw new Error('No autenticado')
```

**Importaciones que SIEMPRE van en actions.ts:**
```typescript
import { auth }           from '@/lib/auth'
import { headers }        from 'next/headers'
import { redirect }       from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { eq }             from 'drizzle-orm'
import { db }             from '@/lib/db/index'
```

**Acciones ya implementadas en `lib/prevencion/actions.ts`:**
- `createMedida(formData)` → inserta medida + redirect a `/prevencion/medidas/{id}`
- `createVisita(medidaId, formData)` → inserta visita + revalida página de detalle
- `createFicha(formData)` → inserta ficha + redirect a `/prevencion/busquedas/{id}`
- `createSeguimiento(formData)` → inserta seguimiento con `fechaHoraEnvio = new Date()`
- `cancelarFicha(formData)` → update status='cancelada' + revalida

**Sprint 3 debe AGREGAR al mismo archivo:**
- `createSolicitud(formData)` → status='en_juridico' automáticamente + redirect
- `createSolicitudC4(formData)` → inserta en `solicitudes_c4_internas`
- `createContestacion(formData)` → inserta contestación + update solicitud status='completado'

### Patrón de páginas

**Server Components** (todos los listados y detalles):
```typescript
// Sin 'use client'. Queries directas a DB.
import { db } from '@/lib/db/index'
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params  // params ES PROMESA en Next.js 16
  // ...
}
```

**Client Components** (solo cuando hay estado o eventos del browser):
- `VisitaModal.tsx` — modal con form, usa `useTransition`
- `SeguimientoTimeline.tsx` — botones de "Registrar", usa `useTransition`
- `CancelacionModal.tsx` — modal con form, usa `form action={serverAction}`
- `PrintButton.tsx` — `window.print()`

### Diseño visual (reglas estrictas)

- **Fondo:** `#070b16`
- **Texto principal:** `#d8e0f0`
- **Oro (acentos, links):** `#d4a43a`
- **Rojo (alertas, botón primario):** `#c0223a`
- **Verde (éxito):** `#4a9e6a`
- **Bordes:** `#1b2742`
- **Cards:** `background: '#0b1220', border: '1px solid #1b2742'`
- **Font mono:** `JetBrains Mono,monospace`
- **Font títulos:** `Barlow Condensed,sans-serif` (weight 700/800)
- **Font cuerpo:** `Inter,sans-serif`
- **TODO en inline styles** — NO Tailwind classes

### Conexión a BD

```typescript
// lib/db/index.ts
export const db = drizzle(pool, { schema })
// Usar siempre: import { db } from '@/lib/db/index'
```

Credenciales en `.env.local`: `DATABASE_URL=postgres://...@sanjuandelrio.sytes.net:5432/seguridad_publica`

---

## ARCHIVOS EXISTENTES — ESTADO REAL

### `lib/prevencion/`
| Archivo | Estado | Descripción |
|---------|--------|-------------|
| `semaforo.ts` | ✅ | `calcularSemaforoVigencia(fecha) → 'verde'|'amarillo'|'rojo'|'gris'` |
| `timeline.ts` | ✅ | `TIPOS_SEGUIMIENTO[]`, `calcularFechaEsperada()`, `getLabelSeguimiento()` |
| `actions.ts` | ✅ Sprint 1+2+3 | createMedida, createVisita, createFicha, createSeguimiento, cancelarFicha, createSolicitud, createSolicitudC4, createContestacion |

### `components/prevencion/`
| Archivo | Tipo | Estado | Descripción |
|---------|------|--------|-------------|
| `SemaforoVigencia.tsx` | Server | ✅ | Chip verde/amarillo/rojo/gris |
| `AutoridadBadge.tsx` | Server | ✅ | Badge por FISCALIA/UMECA/JUZGADOS/SEC_MUJER |
| `VisitaModal.tsx` | Client | ✅ | Modal de visita domiciliaria con useTransition |
| `SeguimientoTimeline.tsx` | Client | ✅ | Grid 24 hitos, botón Registrar por hito |
| `CancelacionModal.tsx` | Client | ✅ | Modal cancelación con form action |
| `PrintButton.tsx` | Client | ✅ | window.print() |
| `SolicitudC4Form.tsx` | Client | ✅ | Textarea + botón, useTransition, llama createSolicitudC4 |
| `ContestacionForm.tsx` | Client | ✅ | fechaContestacion, archivoPdfUrl, acuse (fecha/hora/quien), llama createContestacion |

### `app/prevencion/`
| Ruta | Estado | HU |
|------|--------|----|
| `layout.tsx` | ✅ | — |
| `medidas/page.tsx` | ✅ | HU-1.3 |
| `medidas/nueva/page.tsx` | ✅ | HU-1.1 |
| `medidas/[id]/page.tsx` | ✅ | HU-1.2 |
| `busquedas/page.tsx` | ✅ | HU-2.1 |
| `busquedas/nueva/page.tsx` | ✅ | HU-2.1 |
| `busquedas/[id]/page.tsx` | ✅ | HU-2.2 + HU-2.3 |
| `busquedas/[id]/imprimir/page.tsx` | ✅ | HU-2.1 |
| `juridico/page.tsx` | ✅ | HU-3.2 — bandeja, role check Jurídico |
| `juridico/solicitudes/nueva/page.tsx` | ✅ | HU-3.1 — form completo, status=en_juridico |
| `juridico/solicitudes/[id]/page.tsx` | ✅ | HU-3.2 + HU-3.3 — detalle, C4, contestación |

---

## SPRINT 3 — FLUJO JURÍDICO (11 pts) — PENDIENTE

### Qué construir

**HU-3.1 (3 pts) — Captura de solicitud y turnado a Jurídico**

Formulario en `/prevencion/juridico/solicitudes/nueva`. Campos (de `solicitudes_informacion`):
- `enlace` (text)
- `oficio` (text, required)
- `fechaActivacion` (datetime-local, required)
- `autoridad` (select: FISCALIA|UMECA|JUZGADOS|SEC_MUJER, required)
- `fiscalSolicita` (text)
- `delito` (text)
- `carpetaInvestigacion` (text)
- `solicitudTexto` (textarea)
- `fechaAceptacion` (datetime-local)

Al guardar: `status = 'en_juridico'` automáticamente (NO hay paso previo de 'nuevo').

**HU-3.2 (5 pts) — Bandeja Jurídica + solicitud a C4**

Página `/prevencion/juridico/page.tsx`:
- Reemplazar placeholder actual
- Mostrar TODAS las `solicitudes_informacion` con `status = 'en_juridico'`
- Columnas: oficio, autoridad, delito, carpeta, fechaActivacion, botón Ver →
- **Control de acceso por rol:** verificar que el usuario tenga `rol.nombre === 'Jurídico'`
  - Obtener rol desde: `session.user` → join con `users.rolId` → `roles.nombre`
  - Si no es Jurídico: redirigir a `/prevencion/medidas`

Página detalle `/prevencion/juridico/solicitudes/[id]/page.tsx`:
- Datos del oficio en cards (igual que medidas)
- Historial de solicitudes a C4 (lista de `solicitudes_c4_internas`)
- Botón "Solicitar info a C4" que abre `SolicitudC4Form`
- Sección de contestación (si `status !== 'completado'`: mostrar `ContestacionForm`; si `completado`: solo lectura)

**Componente `SolicitudC4Form.tsx` (Client Component):**
- Un textarea "Descripción de evidencias a C4"
- Botón "Registrar petición"
- Llama `createSolicitudC4(solicitudId, formData)`

**HU-3.3 (3 pts) — Contestación y acuse de entrega**

**Componente `ContestacionForm.tsx` (Client Component):**
- `fechaContestacion` (date)
- `archivoPdfUrl` (text — URL o ruta local del PDF, NO upload real)
- `fechaEntrega` (date)
- `horaEntrega` (time)
- `nombreQuienRecibio` (text)
- Al guardar: `createContestacion(solicitudId, formData)` → update solicitud `status='completado'`

### Server Actions que faltan (agregar a `lib/prevencion/actions.ts`)

```typescript
export async function createSolicitud(formData: FormData) {
  // status = 'en_juridico' fijo al crear
  // redirect a /prevencion/juridico/solicitudes/{id}
}

export async function createSolicitudC4(formData: FormData) {
  // formData contiene: solicitudId, descripcionEvidencias
  // revalidatePath /prevencion/juridico/solicitudes/{solicitudId}
}

export async function createContestacion(formData: FormData) {
  // formData contiene: solicitudId + todos los campos de contestaciones
  // update solicitudesInformacion: status = 'completado', actualizadoEn = now()
  // insert en contestaciones
  // revalidatePath /prevencion/juridico/solicitudes/{solicitudId}
  // revalidatePath /prevencion/juridico
}
```

### Verificación de rol — patrón a usar en juridico/page.tsx

```typescript
// En el Server Component:
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { db } from '@/lib/db/index'
import { users, roles } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { redirect } from 'next/navigation'

const session = await auth.api.getSession({ headers: await headers() })
if (!session) redirect('/login')

// El layout ya validó sesión, pero aquí necesitamos el ROL
const [userWithRole] = await db
  .select({ rolNombre: roles.nombre })
  .from(users)
  .leftJoin(roles, eq(users.rolId, roles.id))
  .where(eq(users.id, session.user.id))
  .limit(1)

if (userWithRole?.rolNombre !== 'Jurídico') redirect('/prevencion/medidas')
```

### Nota sobre update de solicitudes (actualizadoEn)

En `createContestacion`, además de insertar la contestación, hacer:
```typescript
await db.update(solicitudesInformacion)
  .set({ status: 'completado', actualizadoEn: new Date() })
  .where(eq(solicitudesInformacion.id, solicitudId))
```

---

## ESTRUCTURA DE ARCHIVOS COMPLETA (REAL)

```
lib/prevencion/
  semaforo.ts          ✅  calcularSemaforoVigencia()
  timeline.ts          ✅  TIPOS_SEGUIMIENTO, calcularFechaEsperada(), getLabelSeguimiento()
  actions.ts           ✅(S1+S2) + ❌(S3 pendiente)

components/prevencion/
  SemaforoVigencia.tsx ✅ Server
  AutoridadBadge.tsx   ✅ Server
  VisitaModal.tsx      ✅ Client
  SeguimientoTimeline.tsx ✅ Client
  CancelacionModal.tsx ✅ Client
  PrintButton.tsx      ✅ Client
  SolicitudC4Form.tsx  ✅ Client
  ContestacionForm.tsx ✅ Client

app/prevencion/
  layout.tsx                               ✅
  medidas/
    page.tsx                               ✅ Libro Digital
    nueva/page.tsx                         ✅
    [id]/page.tsx                          ✅
  busquedas/
    page.tsx                               ✅
    nueva/page.tsx                         ✅
    [id]/page.tsx                          ✅
    [id]/imprimir/page.tsx                 ✅
  juridico/
    page.tsx                               ✅ Bandeja Jurídica (rol=Jurídico)
    solicitudes/
      nueva/page.tsx                       ✅ HU-3.1
      [id]/page.tsx                        ✅ HU-3.2 + HU-3.3

lib/db/schema.ts       ✅ 7 tablas nuevas + relaciones + tipos exportados
lib/db/seed.ts         ✅ roles Jurídico + Operador Víctimas + módulos prevencion
```

---

## REGLAS DE NEGOCIO IMPLEMENTADAS

### Semáforo de vigencia
- `null` → gris "Sin fecha"
- `dias < 0` → rojo "Vencida"
- `dias <= 7` → amarillo "Por vencer"
- `dias > 7` → verde "Vigente"

### Timeline de búsquedas
- 24 hitos totales: CONTESTACION_INICIAL, 24H, 48H, 72H, MENSUAL_1…MENSUAL_20
- Fechas calculadas desde `fechaActivacion` con `addHours` y `addMonths` de date-fns
- Un hito está "vencido" si `isPast(fechaEsperada) && !registrado && tipo !== 'CONTESTACION_INICIAL'`
- Al registrar: `fechaHoraEnvio = new Date()` (timestamp del servidor)

### Cancelación de búsqueda
- Solo visible si `ficha.status === 'activa'`
- Requiere: fechaCancelacion (datetime-local), fiscalCancela (text), motivoCancelacion (optional)
- Update: `status='cancelada'`, `fechaCancelacion`, `fiscalCancela`, `motivoCancelacion`

### Flujo jurídico (pendiente implementar)
- Solicitudes se crean directo como `en_juridico` (no hay estado 'nuevo')
- Solo rol 'Jurídico' ve la bandeja (`/prevencion/juridico`)
- Una solicitud tiene N solicitudes a C4, pero UNA sola contestación (unique constraint en BD)
- Al contestar: status → 'completado', campos en solo lectura en el UI
- `archivoPdfUrl` es un campo de texto (ruta o URL del PDF) — NO implementar file upload real

---

## CRITERIOS DE ACEPTACIÓN — SPRINT 3 COMPLETADO

### HU-3.1 ✅
- [x] Formulario captura todos los campos de ADJ 1
- [x] Al guardar, status = `en_juridico` automáticamente
- [x] La solicitud aparece en la bandeja del Área Jurídica

### HU-3.2 ✅
- [x] Solo usuarios con rol "Jurídico" ven la bandeja (otros redirigen a /prevencion/medidas)
- [x] Se puede crear solicitud a C4 vinculada al oficio con descripción de evidencias
- [x] Cada solicitud a C4 registra fecha (creadoEn) y usuario (creadoPor)
- [x] Se puede tener más de una solicitud a C4 por oficio

### HU-3.3 ✅
- [x] Se captura la URL/ruta del PDF de contestación
- [x] El acuse captura fecha, hora y nombre de quien recibió
- [x] Al guardar contestación: status → `completado`
- [x] Una vez `completado`, los campos del formulario quedan solo lectura

---

*Plan actualizado 28 de abril 2026. **TODOS LOS SPRINTS COMPLETADOS.** El sistema de Prevención del Delito está funcional en su totalidad: 34 pts de historia entregados.*
