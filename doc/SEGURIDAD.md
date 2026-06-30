# Seguridad y Autenticación

## Sistema de Autenticación

**Librería:** better-auth 1.6.7  
**Config:** `lib/auth.ts`  
**Cliente:** `lib/auth-client.ts`  

### Método de Autenticación

- **Email + Password** con verificación opcional
- **Longitud mínima de contraseña:** 8 caracteres
- **2FA TOTP** opcional (códigos de 6 dígitos, período de 30s)
- **Issuer:** "Seguridad Pública SJR"

### Sesiones

| Parámetro | Valor |
|-----------|-------|
| Duración | 8 horas |
| Refresco | Cada 1 hora |
| Cache de cookie | 5 minutos |

### Flujo de Login

```
Usuario → /login
  → Ingresa email + password
    → ¿2FA habilitado?
      → Sí → /login/2fa (ingresa código TOTP)
      → No → Sesión creada
  → Redirección a /dashboard
```

---

## Control de Acceso

### Capas de Seguridad

```
1. [Middleware/Proxy] → Verifica sesión activa
2. [Server Component] → Verifica autenticación + rol
3. [Server Action] → Verifica autenticación + rol
4. [API Route] → Verifica autenticación
```

### Proxy (`proxy.ts`)

Actúa como middleware para proteger todas las rutas excepto `/login` y `/api/auth`.

Reglas:
- **Rutas públicas:** `/login`, `/api/auth`
- **Sin sesión:** redirige a `/login?from={ruta}`
- **Usuario inactivo:** redirige a `/login?error=cuenta_inactiva`
- **HTTPS en localhost:** el proxy convierte `https://localhost` a `http://localhost` automáticamente

### Verificación por Rol

Cada Server Action y página verifica el rol según el módulo:

- **Admin:** `requireAdmin()` → solo rol `Administrador`
- **Incidentes:** `requireOperador()` → roles `Administrador`, `Operador`, `Oficial de Campo`
- **Prevención:** sesión activa; páginas específicas verifican rol `Jurídico`
- **Oficial de Campo:** autenticación básica; redirección automática por rol

### Permisos

Dos sistemas de permisos coexisten:

1. **`permisos`** — Permisos CRUD por rol y módulo (ver, crear, editar, eliminar)
2. **`usuario_modulos`** — Asignación directa de módulos a usuarios (sobrescribe permisos de rol)

---

## Auditoría

**Tabla:** `audit_log`

Todas las operaciones sobre datos sensibles se registran:

| Acción | Descripción |
|--------|-------------|
| `CREATE` | Creación de registro |
| `UPDATE` | Modificación de registro (con payload del estado anterior) |
| `DELETE` | Eliminación de registro |
| `VIEW` | Visualización de detalle de incidente |

Cada entrada incluye:
- `userId` — Usuario que realizó la acción
- `accion` — Tipo de operación
- `entidad` — Nombre de la tabla
- `entidadId` — ID del registro
- `payload` — JSON con datos relevantes (para UPDATE/DELETE)
- `ip` — Dirección IP (de `x-forwarded-for` o `x-real-ip`)
- `userAgent` — User-Agent del navegador

**Nota:** La auditoría es fire-and-forget — no bloquea la operación principal si falla el insert.

---

## Notificaciones

**Tabla:** `notificaciones`

Sistema de notificaciones internas para alertar sobre:
- **Hitos de búsqueda próximos** (1 hora antes del vencimiento)
- **Hitos de búsqueda vencidos**
- Unique constraint por `(userId, fichaId, hito)` para evitar duplicados

### Generador de Alertas (`lib/notificaciones/checker.ts`)

Se ejecuta en cada `GET /api/notificaciones`. Revisa fichas activas y genera alertas cuando:
- Un hito está a menos de 1 hora de vencer
- Un hito ya venció y no ha sido registrado

---

## Integraciones Externas

### Flota (Vehículos)

- **URL:** `http://proyecto-flota.vercel.app/api/publica`
- **Auth:** API key en header `x-api-key` (`FLOTA_API_SECRET_KEY`)
- **Proxy:** `app/api/rol-servicios/externos/flota/route.ts`

### RH/Nómina (Empleados)

- **URL:** `https://sanjuandelrio.sytes.net:3007`
- **Auth:** Secret key en header `x-secret-key` (`SECRET_NOMINA`)
- **Proxy:** `app/api/rol-servicios/externos/rh/route.ts`

### Google Maps

- **API Key:** `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` (pública en cliente)

---

## Seguridad en API

- Todas las rutas API verifican sesión antes de procesar la solicitud (401 si no autenticado)
- **Whitelist de parámetros** en `/api/incidentes` — validación contra valores permitidos
- **Path traversal** prevenido en `/api/uploads` (se eliminan `..` de los segmentos)
- **Monto Robo** validado como entero positivo
- **Validación de fechas** en Server Actions (fechaFin >= fechaInicio)

---

## Protección de Datos

- Las contraseñas se manejan por better-auth (hash automático, nunca en texto plano)
- Los secretos TOTP se almacenan cifrados en `two_factors`
- Backup codes para 2FA almacenados en `two_factors.backup_codes`
- La IP y User-Agent se registran en auditoría para trazabilidad
- Las sesiones expiran a las 8 horas
