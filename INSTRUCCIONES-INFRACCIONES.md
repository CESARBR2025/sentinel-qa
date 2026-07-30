# Instrucciones — API de Infracciones para app Flutter (ciudadano)

**Para quién es este documento**: el dev (o su Claude) que va a integrar la app
Flutter con el backend de este proyecto (Next.js, `seguridad_publica`) para
replicar exactamente lo que hoy hace `InfraccionCiudadanoPage`
(`app/infracciones/[id]/page.tsx`) en la web: un ciudadano con un link + PIN
consulta su infracción de tránsito, la paga, y si le retuvieron el vehículo,
sube documentos para liberarlo.

Este documento es autocontenido — no depende de que hayas visto la conversación
donde se construyó esto. Si algo no está aquí, no asumas: pregunta o revisa el
código fuente citado en cada sección.

**Qué NO cubre este documento**: el lado del oficial de tránsito (captura de
la infracción, `app/infracciones/captura`) y el lado de staff (revisión de
documentos, liberaciones, corralón — todo bajo sesión de `better-auth`). Eso
es un sistema aparte, con su propio login, y la app Flutter de ciudadano no
lo toca.

---

## 1. Arquitectura en una frase

Un ciudadano recibe un link `https://<dominio>/infracciones/<id>` (UUID) con un
PIN de 6 dígitos. Verifica el PIN una vez → recibe un JWT de 1h → con ese JWT
(como header `Authorization: Bearer <token>`) puede: consultar el detalle,
pagar, y si aplica, subir documentos de liberación. Todos los endpoints abajo
ya están protegidos por este JWT — no necesitas ninguna otra credencial ni
sesión de staff.

## 2. Variables de entorno relevantes

La app Flutter **no necesita ninguna de estas** — son del backend. Se listan
para que sepas qué debe estar configurado del lado del servidor para que el
flujo funcione, y para pedirle al equipo de backend/DevOps la URL base real.

| Variable | Para qué |
|---|---|
| `NEXT_PUBLIC_APP_URL` / la URL real de producción | **Esta es la que necesita Flutter** — el host base contra el que apuntar todas las rutas de este documento (`/api/via/...`). En local es `http://localhost:3000`; pide al equipo la URL de producción/staging real. |
| `BETTER_AUTH_SECRET` | Firma/verifica los JWT de ciudadano (`{ infraccionId }`). Solo lo usa el servidor — Flutter nunca lo ve ni lo necesita. |
| `DATABASE_URL` | Postgres. Solo backend. |
| `EXPEDIENTE_URL`, `EXPEDIENTE_API_KEY`, etc. | Almacenamiento de documentos subidos (liberación). Solo backend. |
| `SMTP_*` | Envío de correos de confirmación de pago/liberación. Solo backend. |

**No hay CORS que configurar** para una app Flutter nativa (no corre en un
navegador, así que las políticas CORS no aplican a peticiones HTTP nativas vía
`http`/`dio`). Si en algún punto usas un `WebView` (p. ej. para el iframe de
pago, ver sección 5.2), eso es aparte y no pasa por estos endpoints JSON.

## 3. Autenticación

### 3.1 Verificar PIN → obtener token

```
POST /api/via/infracciones/verificar-pin
Content-Type: application/json

{ "infraccionId": "<uuid>", "pin": "123456" }
```

**Respuesta éxito** (200):
```json
{ "ok": true, "token": "eyJhbGciOiJIUzI1NiJ9...<jwt>" }
```
Guarda `token` — es lo que mandas como `Authorization: Bearer <token>` en
todas las llamadas siguientes. Expira en **1 hora** (`exp` en el propio JWT).

**Respuesta PIN incorrecto** (200, no es error HTTP):
```json
{ "ok": false, "intentos_restantes": 2 }
```

**Respuesta bloqueado** (tras 3 intentos fallidos, 200):
```json
{ "ok": false, "bloqueado": true, "hasta": "2026-07-28T16:30:00.000Z" }
```
El bloqueo dura 15 minutos desde el 3er intento fallido. No hay forma de
desbloquear antes — solo esperar.

**Parámetros faltantes** → 400. **`infraccionId` no existe** → 404.

Código fuente: `app/api/via/infracciones/verificar-pin/route.ts`.

### 3.2 Usar el token

Cualquier endpoint de este documento marcado "🔒 requiere token" espera:

```
Authorization: Bearer <token>
```

Si el token es inválido, expiró, o no corresponde al `infraccionId` de la
ruta que estás llamando (el JWT lleva `{ infraccionId }` en el payload y se
valida contra el id de la URL), el endpoint responde como si no hubiera token
en absoluto — normalmente **401** (`{ "error": "No autorizado" }`), salvo el
endpoint de consulta (sección 4) que en vez de 401 degrada a la versión
"ligera" (ver abajo). No hay refresh token: si expira, tu app debe volver a
pedir el PIN al usuario (pantalla de PIN de nuevo).

**Importante para tu manejo de sesión en Flutter**: no asumas que el token
vive para siempre. Guarda también cuándo se obtuvo (o decodifica el `exp` del
JWT) y, ante un 401 en cualquier llamada, regresa a la pantalla de PIN en vez
de reintentar silenciosamente.

Implementación de la verificación: `lib/via/auth-ciudadano.ts` →
`verificarAccesoCiudadano(req, infraccionId)`.

## 4. Consultar la infracción

```
GET /api/via/infracciones/<infraccionId>
```

**Sin token válido** (pantalla inicial, antes de pedir el PIN):
```json
{
  "autenticado": false,
  "folio": "SSPM/INF/20260728/SPQC2A",
  "nombreInfractor": "CESAR IVAN BARCENAS ROSALES"
}
```
Úsalo para mostrar "Folio: X — ingresa tu PIN" antes de tener el token.
`infraccionId` inexistente → 404 `{ "error": "Infracción no encontrada" }`.

**Con token válido** 🔒:
```json
{
  "autenticado": true,
  "infraccion": { /* ver InfraccionDetalleDTO, sección 4.1 */ }
}
```

### 4.1 Forma completa de `infraccion` (`InfraccionDetalleDTO`)

Fuente de verdad: `features/via/infracciones/types.ts` (interfaz
`InfraccionDetalleDTO`) y `features/via/infracciones/mapper.ts`
(`mapInfraccionDetalle`, que arma este objeto desde la fila SQL). Todos los
campos ya vienen en camelCase excepto un puñado que se dejaron en snake_case
tal cual el mapper los expone (marcados abajo) — replica el nombre EXACTO,
no lo normalices en tu capa de deserialización sin revisar esto.

| Campo | Tipo | Notas |
|---|---|---|
| `id` | string (uuid) | |
| `folio` | string | ej. `SSPM/INF/20260728/SPQC2A` |
| `clasificacion` | string | clasificación legal de la fracción |
| `estatusInfraccion` | string | ver sección 6 (estados) |
| `estatusDependencia` | string | ver sección 6 — **este es el campo que decide qué UI/endpoint mostrar** |
| `estatusPago` | string | estatus de la orden de pago SA7 (`'P'` = pagada) |
| `fechaInfraccion` | string (ISO) | |
| `montoTotal` | number | monto en UMAs sin descuento |
| `montoFinal` | number | monto final ya con descuento aplicado |
| `descuento_aplicado` | string/number | % de descuento (snake_case) |
| `fecha_limite_descuento` | string (ISO) | fecha límite para que el descuento aplique (snake_case) |
| `ciudadanoPresente` | boolean | |
| `esTitular` | boolean\|null | si el infractor es el dueño del vehículo |
| `presentaIne` | boolean\|null | |
| `placa`, `marca`, `modelo`, `color`, `noSerieVehiculo`, `tipoVehiculo` | string | datos del vehículo |
| `tipoGarantia` | string\|null | `'PLACA'`, `'TARJETA'`, `'LICENCIA'`, o `'VEHICULO'` — **`'VEHICULO'` es el único caso que activa el flujo de liberación (sección 7)** |
| `garantiaEntregada` | boolean | |
| `motivoRetencion` | string\|null | `'ACCIDENTE'` \| `'DELITO'` \| `'INFRACCION'` — solo relevante si `tipoGarantia === 'VEHICULO'` |
| `urlOrdenSalida` | string\|null | Referencia opaca de almacenamiento (`exp2://...`), **no la uses directamente** — para descargar el PDF usa el endpoint dedicado de la sección 5.4, no intentes resolver esta referencia tú mismo (ver también 9.5) |
| `latitud`, `longitud` | number\|null | |
| `calle`, `numero`, `colonia`, `municipio`, `estado` | string\|null | dirección de la infracción |
| `articuloId`, `articulo_numero`, `articulo_descripcion` | | fundamento legal (snake_case en los dos últimos) |
| `fraccionId`, `fraccion_numero`, `fraccion_descripcion` | | ídem |
| `nombreInfractor`, `apellidoPaternoInfractor`, `apellidoMaternoInfractor` | string | |
| `dependenciaReceptora` | string | `'FISCALIA'` \| `'POLICIA_VIAL'` — a quién le corresponde la liberación |
| `noOficio`, `urlOficio` | string | oficio de retención (fiscalía o juzgado, ya resuelto por el backend) |
| `noCarpetaInvestigacion` | string | solo si `motivoRetencion === 'DELITO'` |
| `nombreTitular`, `correoTitular`, `curpTitular` | string | datos del titular del vehículo (si distinto del infractor) |
| `orden_pago_local_id`, `orden_pago_id`, `estatus_orden_pago` | string (snake_case) | IDs de la orden de pago SA7 |
| `url_pago` | string (snake_case) | **iframe/URL de pago Getnet** — ábrela en WebView o browser externo, no hay endpoint propio para esto |
| `url_guardado`, `folio_orden`, `fecha_vencimiento` | (snake_case) | metadatos de la orden de pago |
| `total_pesos`, `total_umas` | number (snake_case) | montos ya resueltos para mostrar |
| `created_at` | string (ISO, snake_case) | |
| `concepto_id` | string (snake_case) | |
| `documentosLiberacion` | `Record<string, {url: string, label: string}>` | documentos de liberación ya subidos, llave = `tipoDocumento` (ver sección 7). `url` es la misma referencia opaca `exp2://...` de arriba — mismo aviso, sección 9.5 |
| `dl_tipo_liberacion`, `dl_es_empresa`, `dl_nombre_empresa`, `dl_rfc_empresa` | (snake_case) | datos de la solicitud de liberación ya creada, si existe |

## 5. Pago

Cuál endpoint llamar depende de `estatusInfraccion` + `estatusDependencia` del
detalle (sección 4.1):

| `estatusInfraccion` | `estatusDependencia` | Endpoint 🔒 |
|---|---|---|
| `PENDIENTE_PAGO` | `PENDIENTE_PAGO_INFRACCION` | `GET /api/via/pagos/confirmar-ausente/<infraccionId>` |
| `PENDIENTE_PAGO` | `PENDIENTE_PAGO_INSTANTE` | `GET /api/via/pagos/confirmar-instante/<infraccionId>` |
| `PENDIENTE_PAGO` | `PLACA_RETENIDA_EN_TRANSITO` | `GET /api/via/pagos/confirmar-retenida/<infraccionId>` |
| `PENDIENTE_PAGO` | `PENDIENTE_PAGO_LIBERACION` | `GET /api/via/pagos/confirmar-liberacion/<infraccionId>` |
| cualquier otro caso | — | no mostrar botón de pago |

Si ninguna de esas combinaciones aplica, no hay nada que pagar en este
momento (ya pagado, o esperando otro paso).

### 5.1 Respuesta de los 4 endpoints

```json
// aún no pagado (normal, NO es un error — sigue mostrando el botón "Pagar")
{ "pagado": false, "estatusSA7": "I" }

// pagado
{ "pagado": true }

// error real (ej. sin orden de pago vigente)
{ "pagado": false, "error": "Sin orden vigente para esta infracción" }

// 400 — llamaste al endpoint fuera de secuencia (solo confirmar-liberacion,
// agregado 2026-07-29): el estatus_dependencia real ya no es
// PENDIENTE_PAGO_LIBERACION / LIBERACION_EN_PROCESO / LIBERACION_PENDIENTE_DOCUMENTOS
{ "pagado": false, "error": "La infracción no está en etapa de pago" }
```
`pagado: false` con 200 es el estado normal mientras el ciudadano no ha
pagado — no lo trates como error de red. Solo un `error` explícito en el body
(o un status HTTP ≥ 400) es un fallo real. Sin token → 401.

`confirmar-liberacion` ahora revalida `estatus_dependencia` en el servidor
antes de proceder (no solo en el front): si sigues correctamente la tabla de
arriba (solo la llamas cuando `estatusInfraccion === 'PENDIENTE_PAGO' &&
estatusDependencia === 'PENDIENTE_PAGO_LIBERACION'`) nunca deberías ver este
400, pero si lo ves significa que el detalle que tenías en caché quedó
desactualizado — vuelve a consultar `GET /api/via/infracciones/<id>` antes de
reintentar.

Llama a este endpoint **después de que el ciudadano complete el pago** en la
plataforma externa (polling manual con un botón "Ya pagué, verificar", igual
que hace la web — no hay webhook que la app pueda escuchar).

`confirmar-liberacion` además de verificar el pago genera el PDF de la orden
de salida del vehículo y envía un correo — puede tardar unos segundos más que
los otros tres.

### 5.2 Abrir la plataforma de pago

`infraccion.url_pago` es un link de Getnet. La web lo abre en un `<iframe>`
dentro de un modal; en Flutter ábrelo en un `WebView` embebido o en el
navegador externo del sistema. No hay ninguna API propia para esto — es la
URL tal cual viene en el detalle.

### 5.3 Fuera de alcance para Flutter

`GET /api/via/pagos/forzar-pago/<id>` y
`GET /api/via/pagos/verificar-pago-pruebas/<id>` **no** son parte de este
contrato — son atajos de QA que saltan la verificación real con la pasarela
de pago. No los llames desde la app.

### 5.4 Descargar la orden de salida (agregado 2026-07-29)

Una vez que `estatusDependencia` es `LIBERADA_POR_{ACCIDENTE|DELITO|
INFRACCION}` (sección 6.2), el vehículo ya está liberado y existe una orden
de salida en PDF:

```
GET /api/via/descargar-orden/<infraccionId>
```
🔒 **Respuesta: el PDF binario directamente** (no JSON) —
`Content-Type: application/pdf`, `Content-Disposition: attachment;
filename="orden_salida_<folio>.pdf"`. En Flutter, descarga el body como
bytes y guárdalo/ábrelo con el visor de PDF del sistema.

Este endpoint reemplaza cualquier intento de resolver `urlOrdenSalida` por tu
cuenta: si el PDF ya existe lo sirve directo desde el almacenamiento interno,
y si no existe (p. ej. falló su generación durante `confirmar-liberacion`) lo
genera on-demand en el momento, lo guarda, y de paso reenvía el correo de
confirmación al titular. **No requiere sesión de staff** — usa el mismo JWT
de ciudadano de este documento (`verificarAccesoCiudadano`), a diferencia de
las rutas de `/api/expediente/*` (ver sección 9.5).

Errores: `400` si falta `infraccionId`, `401` si el token no es válido para
esa infracción, `404` si la infracción no existe, `500` si falla la
generación del PDF.

## 6. Máquina de estados (`estatus` / `estatus_dependencia`)

Estos dos campos viven en `via.v2_infracciones`. `estatus` es el estado
general del expediente; `estatus_dependencia` es el sub-estado que de verdad
decide qué mostrar/hacer.

### 6.1 `estatus` (general)

| Valor | Significado |
|---|---|
| `REGISTRADA` | Infracción capturada, aún en trámite (sin pago definido, o vehículo retenido) |
| `PENDIENTE_PAGO` | Esperando pago |
| `PAGADA` | Pago confirmado, pero queda un trámite pendiente (ej. devolución de garantía física) |
| `CERRADA` | Proceso resuelto por el lado del ciudadano/liberación |
| `FINALIZADA` | Completamente cerrado (incluye cierre físico en corralón) |

### 6.2 `estatus_dependencia` relevante para el ciudadano

**Garantía simple (placa/tarjeta/licencia) — sin liberación de vehículo:**

| Valor | Qué significa | Acción del ciudadano |
|---|---|---|
| `PENDIENTE_DATOS_INFRACTOR` | Ciudadano estuvo ausente al momento de la infracción | Ninguna vía app aún — falta que capture sus datos (fuera de este flujo) |
| `PENDIENTE_PAGO_INSTANTE` | Ciudadano presente, sin garantía retenida | Pagar (`confirmar-instante`) |
| `PENDIENTE_PAGO_INFRACCION` | Ciudadano ausente, ya con datos capturados | Pagar (`confirmar-ausente`) |
| `PLACA_RETENIDA_EN_TRANSITO` | Le retuvieron la placa | Pagar (`confirmar-retenida`) |
| `PENDIENTE_DEVOLUCION_GARANTIA` | Ya pagó, falta que le devuelvan la garantía física (trámite presencial, no en la app) | Ninguna — informativo |
| `LIBERADO_INFRACCIONES_INSTANTE` | Cerrado | Ninguna |

**Vehículo retenido (`tipoGarantia === 'VEHICULO'`) — flujo completo:**

```
RETENIDO_POR_ACCIDENTE_PENDIENTE_OFICIO ─┐
RETENIDO_POR_DELITO_PENDIENTE_OFICIO    ─┼─→ (fiscalía/juzgado emite oficio, fuera de la app)
VEHICULO_EN_CORRALON                    ─┘
              │
              ▼
   MESA_DE_CONTROL_PENDIENTE_DOCS   ← el ciudadano ve el formulario de subir documentos (sección 7)
              │  (ciudadano llama iniciar-solicitud → subir-archivo × N → completar-solicitud)
              ▼
   MESA_DE_CONTROL_REVISION         ← "recibimos tus documentos", esperando que STAFF revise (no automático, no hay ETA)
              │
        ┌─────┴─────┐
        ▼           ▼
MESA_DE_CONTROL_    PENDIENTE_PAGO_LIBERACION  ← staff aceptó todo, ya se generó
RECHAZADA               │                          la orden de pago SA7
(≥1 doc rechazado,       │
vuelve a mostrar          ▼
form. de subida)     ciudadano paga (confirmar-liberacion)
                          │
                          ▼
                LIBERADA_POR_{ACCIDENTE|DELITO|INFRACCION}
                          │  (estatus infracción = CERRADA; PDF de orden de salida disponible en urlOrdenSalida)
                          ▼
                (corralón sube oficio de pago, fuera de la app)
                          ▼
                FINALIZADA_{ACCIDENTE|DELITO|INFRACCION}
```

**⚠️ Advertencia sobre 2 valores que NUNCA ocurren en la práctica**
(confirmado revisando todo el repo — no hay ningún lugar que los escriba en
la base de datos):
- `ESPERA_REVISION` — el backend real usa `MESA_DE_CONTROL_REVISION` para
  este caso. *(Corrección 2026-07-29: hasta el 2026-07-28 el componente web
  `SeccionLiberacion.tsx` todavía comparaba contra este literal muerto —
  ya se corrigió ahí también, el componente web ahora usa
  `MESA_DE_CONTROL_REVISION` igual que el backend. No queda ninguna
  referencia a `ESPERA_REVISION` en el código, ni de lectura ni de
  escritura.)*
- `EN_REVISION_MW` — aparece en dashboards de staff (Juzgado/Fiscalía), igual
  sin ningún escritor real.

**No repliques ninguna lógica que compare contra `'ESPERA_REVISION'`** — en tu app
Flutter, para saber "ya subí documentos, esperando revisión de staff", usa:
`documentosLiberacion` tiene entradas **Y** `estatusDependencia` distinto de
`MESA_DE_CONTROL_RECHAZADA` (eso cubre tanto `MESA_DE_CONTROL_REVISION` como
cualquier estado posterior mientras no haya rechazo).

`LIBERACION_EN_PROCESO` y `LIBERACION_PENDIENTE_DOCUMENTOS` son estados
transitorios internos de `confirmar-liberacion` (lock de idempotencia /
rollback si falla la generación del PDF) — pueden aparecer momentáneamente en
el detalle durante ese endpoint, no requieren manejo especial en la UI más
allá de tratarlos como "procesando, reintenta en unos segundos".

## 7. Documentos de liberación (solo si `tipoGarantia === 'VEHICULO'`)

Este es el hueco más importante a replicar bien: **la API no valida qué
documentos corresponden a cada caso — esa lógica vive solo en el componente
React (`features/via/infracciones/components/SeccionLiberacion.tsx`) y debes
reconstruirla igual en Flutter.**

### 7.1 Flujo (3 llamadas, en este orden)

**Paso 1 — crear la solicitud** 🔒
```
POST /api/via/ciudadano/iniciar-solicitud
Content-Type: application/json

{
  "infraccionId": "<uuid>",
  "tipoLiberacion": "<motivoRetencion del detalle: ACCIDENTE|DELITO|INFRACCION>",
  "esEmpresa": true|false,

  // si esEmpresa === true, estos 4 son obligatorios (el 4to opcional):
  "nombreEmpresa": "...",
  "rfcEmpresa": "...",
  "nombreRespFiscal": "...",
  "appaternoRespFiscal": "...",
  "apmaternoRespFiscal": "...",   // opcional

  // si esEmpresa === false Y el infractor NO es el titular del vehículo
  // (usa infraccion.esTitular === false para decidir esto), estos son obligatorios
  // (correo opcional):
  "nombreTitular": "...",
  "appaternoTitular": "...",
  "apmaternoTitular": "...",      // opcional
  "curpTitular": "...",
  "correoTitular": "..."          // opcional
}
```
Respuesta: `{ "solicitudId": "<uuid>" }`. Guárdalo — lo necesitas en el paso 2.

**⚠️ Importante — persiste `solicitudId` en el dispositivo, no lo pidas dos
veces (agregado 2026-07-29):** este endpoint **crea una solicitud nueva en
cada llamada**, sin revisar si ya existe una para esa `infraccionId` (no hay
ningún control de unicidad, ni en la API ni en la base de datos). Si tu app
llama `iniciar-solicitud` de nuevo después de una interrupción (el usuario
cerró la app a medio subir documentos, se cayó la red, etc.) sin recordar el
`solicitudId` que ya tenía, vas a crear una **segunda** solicitud para la
misma infracción. Las lecturas (`GET /api/via/liberaciones/documentos/<id>`,
sección 7.3, y la pantalla de revisión del agente) ya están corregidas para
siempre tomar la solicitud más reciente (`ORDER BY created_at DESC LIMIT 1`,
corregido 2026-07-29) — así que ya no hay riesgo de que el agente revise la
solicitud vieja/incompleta por error — pero la creación en sí sigue sin ser
idempotente: cada llamada de más deja una fila huérfana en
`v2_solicitudes_liberacion`. Evítalo desde el diseño de la app en vez de
depender de que el servidor lo tolere.

**Diseña tu app así para evitar el problema por completo:**
1. Al recibir `solicitudId` del paso 1, guárdalo localmente (asociado a esa
   `infraccionId`) antes de subir el primer archivo.
2. Si el usuario reabre la app y la infracción sigue en
   `MESA_DE_CONTROL_PENDIENTE_DOCS` (sección 6.2), **no vuelvas a llamar
   `iniciar-solicitud`** — reusa el `solicitudId` guardado y continúa
   directo en el paso 2 con los documentos que falten.
3. Solo llama `iniciar-solicitud` si de verdad no tienes ningún
   `solicitudId` guardado para esa infracción (primer intento real).

Esto es más seguro que lo que hace hoy la propia web ciudadana (que, al
interrumpirse la subida, simplemente vuelve a llamar `iniciar-solicitud` y
genera una solicitud nueva) — no repliques ese comportamiento en Flutter.

**Paso 2 — subir cada documento** (una llamada `multipart/form-data` POR
documento) 🔒
```
POST /api/via/ciudadano/subir-archivo
Content-Type: multipart/form-data

solicitudId: <uuid del paso 1>
tipoDocumento: <ver catálogo 7.2, ej. "factura">
file: <imagen o PDF>
```
Solo acepta `image/*` o `application/pdf` — cualquier otro `Content-Type` de
archivo regresa 400. Respuesta: `{ "success": true, "data": { "ruta": "..." } }`.

Repite este POST una vez por cada documento requerido (ver 7.2) antes de
continuar al paso 3.

**Paso 3 — completar la solicitud** 🔒
```
POST /api/via/ciudadano/completar-solicitud
Content-Type: application/json

{ "infraccionId": "<uuid>" }
```
Esto marca la solicitud como enviada y pasa `estatusDependencia` a
`MESA_DE_CONTROL_REVISION` — a partir de aquí, solo queda esperar a que staff
revise (no hay ETA ni webhook; el ciudadano debe volver a consultar más tarde).

### 7.2 Catálogo de documentos — replica esta tabla EXACTA

La decisión de qué pedir depende de: (a) si el trámite es a nombre de una
**empresa** o de un **titular** persona física, y (b) si es titular, el
`motivoRetencion` de la infracción, y (c) si el infractor **no** es el titular
del vehículo (`infraccion.esTitular === false`).

**Si el ciudadano elige "Empresa"** (`esEmpresa: true`) → siempre estos 4,
sin importar el motivo:

| `tipoDocumento` | Label | Descripción |
|---|---|---|
| `factura` | Factura | Acredita la propiedad del vehículo a nombre de la empresa |
| `ine_representante_legal` | INE del representante legal | Identificación oficial vigente |
| `poder_notarial` | Poder notarial o acta constitutiva | Facultad del representante para actuar por la empresa |
| `constancia_situacion_fiscal` | Constancia de situación fiscal | RFC actualizado |

**Si el ciudadano elige "Titular"** (`esEmpresa: false`) → la lista base
depende de `motivoRetencion` (mapeo: `INFRACCION`→`infraccion`, `VEHICULO`→
`infraccion` también, `DELITO`→`delito`, `ACCIDENTE`→`accidente`):

| `motivoRetencion` | Documentos base (`tipoDocumento`) |
|---|---|
| `INFRACCION` (o `VEHICULO`) | `factura`, `ine_titular`, `comprobante_domicilio`, `tarjeta_circulacion` |
| `DELITO` | `factura`, `ine_titular` |
| `ACCIDENTE` | `factura`, `ine_titular` |

**Además**, si `infraccion.esTitular === false` (el infractor NO es el dueño
del vehículo), agrega **siempre** un documento extra a la lista de titular
(sin importar el motivo):

| `tipoDocumento` | Label | Descripción |
|---|---|---|
| `carta_poder` | Carta poder | Autorización del propietario para que el infractor haga el trámite |

Y en ese mismo caso (`esTitular === false`), el paso 1
(`iniciar-solicitud`) requiere además los campos `nombreTitular`,
`appaternoTitular`, `curpTitular` (obligatorios) — son los datos del dueño
real del vehículo, no del infractor.

Fuente exacta de esta tabla (si algo no cuadra, este archivo manda):
`features/via/infracciones/components/SeccionLiberacion.tsx`, constantes
`DOCS_EMPRESA`, `DOCS_INFRACCION`, `DOCS_DELITO`, `DOCS_ACCIDENTE`,
`CARTA_PODER`, `MOTIVO_TO_SUBTIPO`.

### 7.3 Consultar estatus de revisión / reenviar documentos rechazados

```
GET /api/via/liberaciones/documentos/<infraccionId>
```
🔒 Respuesta:
```json
{
  "solicitud": { "id": "...", "tipo_liberacion": "...", "es_empresa": false, "estatus": "..." },
  "documentos": [
    {
      "id": "...",
      "tipo_documento": "factura",
      "url_documento": "...",
      "estatus_revision": "ACEPTADO" | "RECHAZADO" | "ENVIADO",
      "observaciones": "..." ,  // solo presente si fue rechazado, es el motivo
      "created_at": "..."
    }
  ]
}
```
Si aún no hay solicitud para esa infracción: `{ "solicitud": null, "documentos": [] }`.

`estatus_revision` viene en 3 valores posibles: `ENVIADO` (subido, staff aún
no lo revisa — a pesar del nombre, **no** es lo mismo que "pendiente" en la
UI; trátalo como "en revisión"), `ACEPTADO`, `RECHAZADO`. Si es `RECHAZADO`,
muestra `observaciones` (el motivo) y permite volver a subir **ese mismo**
`tipoDocumento` repitiendo el paso 2 (`subir-archivo`) y luego el paso 3
(`completar-solicitud`) de nuevo. Para saber **qué** volver a subir necesitas
solo `tipo_documento` — no necesitas (ni puedes, ver 9.5) abrir `url_documento`
para mostrarle al ciudadano una vista previa de lo que subió.

**No existe un motivo de rechazo agregado a nivel de toda la solicitud** —
solo por documento individual. Si `estatusDependencia === MESA_DE_CONTROL_RECHAZADA`,
itera `documentos` y muestra el `observaciones` de cada uno que esté
`RECHAZADO`.

## 8. Convenciones de error / HTTP

| Código | Cuándo |
|---|---|
| 200 con `{ error: "..." }` en el body | Falla de negocio esperada (ej. "sin orden vigente para pagar") — no es un fallo de red, muéstralo como mensaje al usuario |
| 400 | Faltan parámetros requeridos en el body |
| 401 | Token ausente, inválido, expirado, o no corresponde a este `infraccionId` — regresa a pantalla de PIN |
| 404 | `infraccionId` (o recurso relacionado) no existe |
| 500 | Error interno del servidor — reintenta o muestra error genérico |

No hay un formato de error único y consistente en todos los endpoints (algunos
regresan `{error}`, los de pago regresan `{pagado:false, error}`) — revisa el
ejemplo específico de cada endpoint en las secciones 5 y 7, no asumas un
esquema global.

## 9. Pendientes conocidos / advertencias antes de integrar

1. **El flujo completo de liberación de vehículo (paso 1→2→3, sección 7)
   nunca se probó de punta a punta contra una infracción real** — solo se
   verificó que los guards de autenticación rechazan/aceptan correctamente.
   Prueba este camino con una infracción real `tipoGarantia = 'VEHICULO'`
   antes de dar por cerrada la integración.
2. La tabla de documentos (sección 7.2) está transcrita a mano desde el
   componente React — si el equipo web cambia `SeccionLiberacion.tsx`, esta
   tabla puede quedar desactualizada. Antes de confiar en ella para una
   release, compárala contra el archivo fuente citado.
3. El token dura 1h sin refresh — diseña la sesión de la app asumiendo que
   puede expirar a media tarea (ej. mientras el ciudadano llena el formulario
   de liberación) y maneja el 401 en cualquier paso, no solo al abrir la app.
4. `estatus_revision = 'ENVIADO'` (recién subido) es fácil de confundir con
   "pendiente" — hay una inconsistencia conocida en el propio backend de
   staff sobre este punto (ver `Troubleshooting.md` de la bóveda si necesitas
   el detalle); para el lado ciudadano no cambia nada, pero no asumas que el
   string literal es `'PENDIENTE'`.
5. **Estatus mixto (actualizado 2026-07-29): la orden de salida ya se puede
   descargar, los documentos individuales subidos todavía NO.**
   - ✅ **`urlOrdenSalida` — resuelto.** Ya no intentes interpretar esta
     referencia opaca (`exp2://{folderPath}#{uuid}`, generada con
     `lib/expediente/v2/ref.ts`) — usa el endpoint dedicado de la sección 5.4
     (`GET /api/via/descargar-orden/<infraccionId>`), que sí acepta el JWT de
     ciudadano y devuelve el PDF directamente.
   - 🚧 **`documentosLiberacion[...].url` y `url_documento` (sección 7.3) —
     sigue bloqueado.** Estas SÍ siguen siendo referencias opacas sin forma de
     resolverlas desde el JWT de ciudadano. Para resolverlas a un archivo real
     hoy existen solo tres rutas: `POST /api/expediente/token`,
     `GET /api/expediente/vista/[token]` y `GET /api/expediente/proxy`
     (`app/api/expediente/*`) — **las tres exigen una sesión de staff
     `better-auth`** (`auth.api.getSession`), no aceptan el JWT de ciudadano.
     Esto **no es un problema nuevo de tu integración**: el propio botón "ver
     documento" de la web ciudadana (`SeccionLiberacion.tsx` →
     `lib/shared/abrirDocumento.ts`) llama exactamente a esas mismas rutas y
     hoy le regresaría 401 a cualquier ciudadano real que lo intente —
     confirmado revisando el código, no es una suposición.
     **No intentes resolver esto del lado de Flutter** (ni construyendo la
     URL a mano, ni intentando reusar el JWT de ciudadano contra esas rutas —
     no va a funcionar). Es un hueco de backend: alguien tiene que extender
     esas tres rutas para aceptar también `verificarAccesoCiudadano` (el
     mismo patrón dual cookie/Bearer que ya usan `documentos/[infraccionId]`,
     `subir-archivo`, y el nuevo `descargar-orden` de la sección 5.4 — así
     que el patrón ya está probado y funcionando, solo falta aplicarlo aquí
     también). Repórtalo al equipo web antes de comprometerte a una fecha de
     entrega que incluya "ver los documentos que ya subí".

## 10. Cómo conseguir datos de prueba

Necesitas un `infraccionId` (UUID) + su `pin_acceso` real en base de datos:

```sql
SELECT id, folio, pin_acceso, estatus, estatus_dependencia, tipo_garantia, motivo_retencion
FROM via.v2_infracciones
WHERE folio = '<folio que te compartan>'
   OR tipo_garantia = 'VEHICULO'   -- para probar el flujo de liberación completo
LIMIT 5;
```

Pide acceso de lectura a esa base (credenciales en `.env` del proyecto,
variable `DATABASE_URL`) a quien administre el ambiente de pruebas — no está
en este documento por ser un secreto real, no un dato de referencia.

## 11. Consulta por CURP (app móvil)

Este es el endpoint que la **app móvil** consume para mostrar el listado
de infracciones de un ciudadano. La CURP viaja en el header, no en la URL;
el `pin_acceso` se devuelve cifrado (AES-256-GCM) con `X_INFRACCIONES_KEY`
como llave de cifrado.

```
GET /api/via/infracciones/por-curp
x-infracciones-key: <api-key>
x-curp: BARC021102HQTRSSA9
```

| Header | Obligatorio | Notas |
|---|---|---|
| `x-infracciones-key` | Sí | API Key configurada en `X_INFRACCIONES_KEY` del backend |
| `x-curp` | Sí | CURP del infractor, 18 caracteres alfanuméricos |

Rate-limited por IP (30 req/min).

**Respuesta:**
```json
{
  "infracciones": [
    {
      "id": "uuid",
      "folio": "SSPM/INF/20260728/SPQC2A",
      "estatusInfraccion": "PENDIENTE_PAGO",
      "estatusDependencia": "PLACA_RETENIDA_EN_TRANSITO",
      "fechaInfraccion": "2026-07-28T16:00:00.000Z",
      "montoFinal": 50.0,
      "totalPesos": 868.0,
      "pin_acceso": "<base64url-encrypted>"
    }
  ]
}
```

| Campo | Tipo | Notas |
|---|---|---|
| `id` | string (uuid) | ID de la infracción |
| `folio` | string | Folio completo para mostrar en la tabla |
| `estatusInfraccion` | string | Ver sección 6.1 |
| `estatusDependencia` | string\|null | Ver sección 6.2 |
| `fechaInfraccion` | string (ISO) | |
| `montoFinal` | number | Monto final en UMAs |
| `totalPesos` | number\|null | Monto en pesos MXN (de la orden de pago SA7) |
| `pin_acceso` | string (base64url) | **Cifrado con AES-256-GCM** usando `X_INFRACCIONES_KEY` como llave. La app no debe descifrarlo — se pasa directamente al endpoint de auto-acceso. |

CURP inválida → 400. Sin infracciones → 200 con array vacío.

### 11.1 Redirección automática (app → web)

Cuando el ciudadano da clic en una fila de la tabla para pagar, la app debe
abrir el navegador con esta URL:

```
GET /api/via/infracciones/auto-acceso?infraccionId=<uuid>&p=<pin_acceso_cifrado>
```

Usa el parámetro `p` (no `pin`) — el PIN viene cifrado desde el endpoint de
consulta. El servidor lo descifra con `X_INFRACCIONES_KEY`, lo valida contra BD,
y si es correcto emite la cookie y redirige a la página ciudadana.

Si falla (PIN inválido, bloqueo, error de descifrado): redirige a
`/infracciones/<id>?pin_error=1` → el PinBarrier se muestra y el ciudadano
puede teclear el PIN manualmente.

**Flujo completo en la app móvil:**
1. El ciudadano ingresa su CURP
2. App llama `GET /api/via/infracciones/por-curp` con headers `x-curp` + `x-infracciones-key`
3. App renderiza tabla con folio, estatus, fecha, monto
4. Ciudadano da clic en "Pagar" → app abre navegador con
   `/api/via/infracciones/auto-acceso?infraccionId=<id>&p=<pin_cifrado>`
5. Navegador valida, pone cookie, redirige a la página ciudadana
6. El ciudadano completa pago/liberación en el navegador (web existente)

**No hay que replicar la lógica de pago ni de liberación en la app** — la web
existente (`app/infracciones/[id]/page.tsx`) ya se encarga de todo.

### 11.2 Detalles de cifrado (solo referencia, no necesario para la app)

El `pin_acceso` se cifra con AES-256-GCM:
- **Key derivation**: SHA-256 del valor de `X_INFRACCIONES_KEY`
- **Nonce**: 12 bytes aleatorios por cada cifrado
- **Output**: Base64 URL-safe = `nonce(12) + ciphertext + tag(16)`
- Implementación backend: `lib/via/crypto-ciudadano.ts`

---
Endpoints verificados con `curl` contra datos reales de una infracción de
prueba (`SSPM/INF/20260728/SPQC2A`). Ver también
`boveda/🧩 Features/Infracciones.md` para el contexto del módulo completo
(incluye también el lado del oficial de tránsito, fuera de alcance para
Flutter) y `boveda/🏗 Arquitectura/Proxy y Auth.md` para entender por qué el
gate de sesión de staff (`proxy.ts`) no bloquea estas rutas.*

*Corrección 2026-07-28 (misma fecha, sesión posterior): el servicio de
almacenamiento se reestructuró — todos los archivos de una infracción ahora
viven bajo una sola carpeta por infracción en el backend (sin impacto en los
contratos de API de este documento) y el servicio v1 legado fue retirado por
completo. De paso se auditaron los campos `urlOrdenSalida`/
`documentosLiberacion`/`url_documento` contra el código real de las rutas de
`/api/expediente/*` y se encontró el bloqueante de la sección 9.5 (ver ahí) —
no existía antes de esta revisión en el documento.*

*Revisión 2026-07-29: verificado el documento completo contra el código
actual tras dos commits posteriores a la fecha de generación original
(2026-07-28): `a26870c fix updaload files liberaciones agent` (fix del flujo
de liberación: tabs del dashboard, subida interrumpida, pago prematuro) y
`8444314 fix: orden de salida` (nuevo endpoint de descarga + filtro por
`tipo_garantia`). Cambios en este documento:
1. Agregada la fila del nuevo error 400 de `confirmar-liberacion` en la
   sección 5.1 (guard server-side de `estatus_dependencia` agregado en
   `a26870c`).
2. Corregida la sección 6.2 — `SeccionLiberacion.tsx` ya no compara contra el
   literal muerto `ESPERA_REVISION`, se actualizó a `MESA_DE_CONTROL_REVISION`
   (fix en `a26870c`).
3. Agregada la advertencia de la sección 7.1 sobre persistir `solicitudId`
   para evitar solicitudes duplicadas — se encontró y corrigió de paso un bug
   real (no solo de documentación): dos consultas de solicitud (`GET
   /api/via/liberaciones/documentos/<id>` y la pantalla de revisión del
   agente) usaban `LIMIT 1` sin `ORDER BY`, pudiendo devolver una solicitud
   vieja/incompleta cuando existían dos para la misma infracción; corregidas
   en esta misma revisión con `ORDER BY created_at DESC LIMIT 1`.
4. **Agregada la sección 5.4** (`GET /api/via/descargar-orden/<infraccionId>`,
   nuevo en `8444314`) y **actualizada la sección 9.5**: el bloqueante de
   "ver/descargar documentos" ya no aplica a `urlOrdenSalida` (ahora
   descargable con el JWT de ciudadano vía el nuevo endpoint) — sigue
   aplicando sin cambios a los documentos individuales subidos
   (`documentosLiberacion[...].url` / `url_documento`, sección 7.3).
5. Confirmado sin cambios: secciones 1-4 (salvo la nota de `urlOrdenSalida`
   del punto 4.1), 7.2, 9.1-9.4, 10.

*Revisión 2026-07-30 (v2): refactor de seguridad de la sección 11. La CURP
ahora viaja en el header `x-curp` (no en la URL); el `pin_acceso` se cifra
con AES-256-GCM usando `X_INFRACCIONES_KEY` como llave; y el endpoint
`auto-acceso` acepta `?p=` (PIN cifrado) en lugar de `?pin=` (texto plano).
Creado `lib/via/crypto-ciudadano.ts` con `encryptPin`/`decryptPin`.
Ruta antigua `por-curp/[curp]` eliminada; reemplazada por `por-curp/`
sin parámetro de URL.*
