# Contexto — Notificar al oficial de campo cuando se le asigna un despacho

Esta carpeta contiene un plan dividido en etapas, pensado para que un agente de
IA (por ejemplo DeepSeek) las ejecute **una por una, sin necesidad de leer
ninguna otra conversación previa**. Cada archivo de etapa es autocontenido:
trae el código actual relevante, el cambio exacto a aplicar y un checklist de
aceptación.

Orden de ejecución:

1. [`01-backend-despacho-asignado.md`](./01-backend-despacho-asignado.md)
2. [`02-backend-despacho-refuerzos.md`](./02-backend-despacho-refuerzos.md)
3. [`03-frontend-campanita-ui.md`](./03-frontend-campanita-ui.md) (independiente de 01/02, puede ir en paralelo)
4. [`04-verificacion.md`](./04-verificacion.md) (al final, depende de las tres anteriores)

## El proyecto, en resumen

- Next.js (app router) + PostgreSQL con **SQL crudo** vía `query()`/`pool` de
  `lib/db.ts` (no hay ORM salvo Drizzle, que solo se usa para el adapter de
  autenticación de `better-auth`).
- Autenticación: `better-auth` (`lib/auth.ts`). Sesión vía
  `auth.api.getSession({ headers: await headers() })`.
- Los módulos de dominio siguen (cuando aplica) el patrón de capas:
  ```
  lib/<modulo>/
  ├── types.ts      — interfaces TypeScript
  ├── mapper.ts      — funciones rowToX() que convierten fila cruda → objeto tipado
  ├── repository.ts — queries SQL puras, devuelve objetos tipados
  ├── service.ts     — lógica de negocio (opcional)
  └── actions.ts     — server actions ('use server')
  ```

## El sistema de "despacho" (asignar un incidente a oficiales)

- El flujo vive en `lib/incidentes/actions.ts`. La función clave es
  `createDespacho(formData)`: recibe un `incidenteId`, una lista de
  `unidades` (patrullas) y una lista de `elementos` (oficiales, identificados
  por número de nómina), y dentro de una transacción (`BEGIN`/`COMMIT`)
  inserta filas en tres tablas:
  - `incidente_despacho` — cabecera del despacho (1 por incidente).
  - `incidente_despacho_unidades` — patrullas asignadas.
  - `incidente_despacho_elementos` — oficiales asignados. Cada fila intenta
    resolver automáticamente `oficial_id` haciendo un `SELECT id FROM
    ofi_oficiales WHERE no_nomina = $nomina AND ofi_estatus = 'activo'`. Si
    la nómina no tiene cuenta en el sistema, `oficial_id` queda `NULL`.
  - Al final actualiza `incidentes.estatus = 'en_despacho'`.
- `enviarRefuerzos(formData)` es el mismo patrón pero para agregar
  unidades/elementos **adicionales** a un despacho ya activo (sin volver a
  crear la cabecera), marcando `es_refuerzo = true`.
- Un "oficial con cuenta en el sistema" es una fila de `ofi_oficiales` con
  `user_id` no nulo apuntando a `users.id` (la tabla de `better-auth`). Si
  `oficial_id` quedó `NULL` (personal externo sin cuenta), esa persona nunca
  puede recibir una notificación de la app — no tiene a quién mandársela.
- La vista del oficial para atender su propio despacho ya existe:
  `app/oficial/despachos/[id]/page.tsx`, donde `[id]` es el **id del
  incidente** (no el id del despacho ni el de la fila `incidente_despacho_elementos`).

## El sistema de notificaciones (ya existe, V1 completo)

Vive en `lib/notificaciones/`:

- **`catalogo.ts`** — catálogo estático de eventos (`EVENTOS`). Cada evento
  tiene `label`, `modulo`, `severidad` (`'info' | 'aviso' | 'critico'`),
  `rolesPorDefecto: string[]` (nombres de rol que reciben la notificación por
  defecto si nadie la reconfiguró) y opcionalmente `href: (entidadId) =>
  string` (a dónde redirige el click).
- **`emisor.ts`** — función `emitir(evento, datos)`. Inserta una fila por
  destinatario en `notificaciones_eventos`. Reglas **importantes**:
  - Se debe llamar **después del `COMMIT`** de cualquier transacción de
    negocio, nunca dentro — si la transacción hace rollback, una notificación
    emitida dentro quedaría "fantasma".
  - **Nunca lanza** — internamente hace try/catch y solo loguea errores; una
    notificación fallida no debe tumbar la operación de negocio.
  - Si se pasa `datos.usuarios` (array de `user_id`), esos usuarios reciben la
    notificación directamente, **sin importar** los `rolesPorDefecto` del
    catálogo. Si además se pasa `datos.roles: []` explícito, se anula el
    fallback por rol — así se evita notificar a todo el rol además de a los
    usuarios puntuales.
  - `datos.href` explícito tiene prioridad; si no se pasa, se usa
    `catalogo[evento].href(entidadId)`.
  - `datos.dedup` es opcional — sirve para que reintentos de una misma acción
    no dupliquen la notificación (usa un índice único parcial en BD sobre
    `clave_dedup`).
- El catálogo (`lib/notificaciones/catalogo.ts`) **ya tiene definidas** las
  claves que este trabajo necesita — no hay que crearlas, solo emitirlas
  desde el punto correcto del código:
  ```ts
  'despacho.asignado': {
    label: 'Despacho asignado', modulo: 'Incidentes', severidad: 'critico',
    rolesPorDefecto: ['Oficial de Campo'],
    href: id => `/oficial/despachos/${id}`,
  },
  'despacho.refuerzos': {
    label: 'Refuerzos solicitados', modulo: 'Incidentes', severidad: 'critico',
    rolesPorDefecto: ['Oficial de Campo'],
    href: id => `/oficial/despachos/${id}`,
  },
  ```
- **Ojo con una trampa existente**: la clave `'despacho.asignado'` YA se usa
  hoy en `lib/incidentes/actions.ts` (dentro de `createIncidente` y
  `createIncidenteCliente`) para notificar al **despachador humano** (el
  operador del rol `agente_911`/`agente_despacho` al que se le asigna un caso
  para trabajar) — no al oficial de campo. Esas llamadas pasan `usuarios:
  [despachadorId], roles: [], href: '/agente_911/despacho'` explícitos, así
  que ya ignoran el default del catálogo. **No tocar esas llamadas** — este
  trabajo agrega llamadas *nuevas* a la misma clave de evento, en un punto
  distinto del código (`createDespacho`/`enviarRefuerzos`), para una
  audiencia distinta (oficiales de campo, no despachadores). Es el mismo
  patrón de "override explícito de audiencia" que ya usa el código.
- Componente de UI: `components/notificaciones/CampanillaNotificaciones.tsx`
  (la "campanita"), montado dentro de `components/partials/Header.tsx`
  (`DashboardHeader()`) y `components/partials/SubHeader.tsx` — aparece
  automáticamente en todas las páginas del sistema, incluida
  `/oficial/despachos/[id]`, sin tocar nada ahí. Usa polling cada 30s contra
  `/api/notificaciones/contador` (solo el conteo) y carga la lista completa
  (`/api/notificaciones?limite=5`) al abrir el dropdown.

## Objetivo de negocio de esta serie de cambios

1. Cuando despacho asigna oficiales a un incidente (`createDespacho`) o pide
   refuerzos (`enviarRefuerzos`), los oficiales con cuenta en el sistema deben
   recibir una notificación en su campanita, con un mensaje que incluya folio
   + tipo de incidente, que al hacer click los lleve a
   `/oficial/despachos/{incidenteId}`.
2. La UI de la campanita debe rediseñarse con iconos (usando `lucide-react`,
   ya instalado en el proyecto) — no es solo un ajuste cosmético menor, debe
   ser un cambio visualmente perceptible.
