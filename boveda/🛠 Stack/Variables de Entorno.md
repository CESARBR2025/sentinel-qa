# Variables de Entorno

**Propósito**: Variables de entorno requeridas para el funcionamiento del proyecto.

---

## Base de datos

| Variable | Propósito |
|----------|-----------|
| `DATABASE_URL` | Conexión a PostgreSQL |
| `PGHOST` | Host de la base de datos |
| `DB_PORT` | Puerto de la base de datos |
| `PGUSER` | Usuario de base de datos |
| `PGPASSWORD` | Contraseña de base de datos |
| `PGDATABASE` | Nombre de la base de datos |

## Autenticación (better-auth)

| Variable | Propósito |
|----------|-----------|
| `BETTER_AUTH_SECRET` | Secreto para firma de sesiones JWT |
| `BETTER_AUTH_URL` | URL base de la aplicación |
| `NEXT_PUBLIC_APP_URL` | URL pública de la app |

## APIs externas

| Variable | Propósito |
|----------|-----------|
| `FLOTA_API_SECRET_KEY` | API key para sincronización de flota |
| `NOMINA_API_URL` | URL de API de nómina |
| `SECRET_NOMINA` | Secreto para API de nómina |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | API key de Google Maps |

## Expediente Digital

| Variable | Propósito |
|----------|-----------|
| `NEXT_PUBLIC_WS_EXPEDIENTE` | WebService de expediente digital |
| `NEXT_PUBLIC_GUEST` | URL para guest token de expediente |
| `EXPEDIENTE_DIGITAL_URL` | URL del sistema de expediente digital |
| `EXPEDIENTE_SISTEMA` | Identificador del sistema (SSPM) |
| `EXPEDIENTE_CODIGO_INVITACION` | Código de invitación para expediente |

## SMTP

| Variable | Propósito |
|----------|-----------|
| `SMTP_HOST` | Servidor SMTP |
| `SMTP_PORT` | Puerto SMTP |
| `SMTP_SECURE` | Usar TLS (true/false) |
| `SMTP_USER` | Usuario de correo |
| `SMTP_PASS` | Contraseña de correo |

## CUS

| Variable | Propósito |
|----------|-----------|
| `X_API_KEY` | API key para sistema CUS |

## Validación de estado

| Variable | Propósito |
|----------|-----------|
| `KEY_USER_VALIDATE_STATUS` | Clave para validación de usuario |
| `KEY_PD_VALIDATE_STATUS` | Clave para validación predial |

## Flota

| Variable | Propósito |
|----------|-----------|
| `NEXT_PUBLIC_FLOTA_API_KEY` | API key pública para flota |

## Entorno

| Variable | Propósito |
|----------|-----------|
| `NODE_ENV` | Entorno de ejecución (production/development) |
