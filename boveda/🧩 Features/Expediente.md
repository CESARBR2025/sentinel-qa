# Expediente SSPM

Sistema de gestión documental cifrada. Provee almacenamiento, visualización y exploración de archivos seguros.

## Stack

- **v2** (único, `sanjuandelrio.sytes.net:3066`): Archivos cifrados (AES-256-GCM + gzip). Único servicio soportado.
- **v1 descontinuado** (2026-07-28): el servicio legado (`sanjuandelrio.sytes.net:3044`) fue retirado por completo — código, envs (`EXPEDIENTE_DIGITAL_URL`, `NEXT_PUBLIC_WS_EXPEDIENTE`, `NEXT_PUBLIC_GUEST`, `EXPEDIENTE_SISTEMA`, `EXPEDIENTE_CODIGO_INVITACION`) y scripts de migración (`scripts/migrar-legado-a-v2.ts`, `scripts/migrar-evidencias-json.ts`) eliminados. Refs no-`exp2://` ya no se resuelven (proxy/vista devuelven 410). Antes de este cambio no estaba en producción, así que no se migraron archivos legado pendientes.

## Cliente v2

`lib/expediente/v2/client.ts` — Único punto de contacto con el servidor v2.

| Función | Endpoint | Propósito |
|---|---|---|
| `getToken()` | `POST /api/auth/guest-token` | Single-flight guest token + X-API-Key + caché 8h |
| `subir(archivo, subcarpeta)` | `POST /api/upload` | Subir archivo, devuelve `{ folderPath, uuid }` |
| `obtenerViewToken(ref)` | `GET /api/browse` | Obtener view token fresco vía browse |
| `descargar(ref)` | `GET /v?t=<token>` | Pipe de archivo al cliente |
| `estaConfigurado()` | — | Verifica envs presentes |

## Referencia en BD

Formato: `exp2://{folderPath}#{uuid}`

Las columnas `text` existentes almacenan este string. El prefijo `exp2://` distingue refs v2 de valores legados.

## Proxy único

`app/api/expediente/proxy/route.ts` y `app/api/expediente/vista/[token]/route.ts` — Solo aceptan refs `exp2://`; cualquier otro formato devuelve 410 (legado no soportado). **Nunca exponen el Bearer token al frontend.**

## Taxonomía de carpetas

Todo lo relacionado a una infracción (VIA) vive bajo una única carpeta raíz por infracción, vía `carpetaInfraccion(idInfraccion)` en `lib/expediente/v2/carpetas.ts`:

```
{ROOT}/SSPM_INFRACCIONES/{YYYY}/{MM}/{idInfraccion}/
├── documentos/     (INE, INAPAM, tarjeta de circulación)
├── evidencias/     (fotos de la infracción)
├── liberacion/     (docs de la solicitud de liberación ciudadana)
├── orden-salida/   (PDF de orden de salida del vehículo)
├── oficios/        (oficio fiscalía y oficio juzgado, mismo helper)
└── corralon/       (oficio de finalización en corralón)
```

Decisión (2026-07-28): antes cada subflujo (docs, evidencias, liberación, orden-salida, oficios fiscalía/juzgado, corralón) tenía su propia raíz de carpeta dispersa (`via/`, `oficios/`, `corralon/`), aunque la BD confirma que todos son columnas del mismo registro `via.v2_infracciones`. Se unificó para que todos los archivos de una infracción queden en un mismo lugar. La carpeta de liberación ciudadana usaba antes `solicitudId`; ahora usa el `idInfraccion` resuelto (`obtenerInfraccionIdDeSolicitud`) para caer en la misma carpeta raíz.

Otros dominios (no infracciones, sin cambios):

| Dominio | Subcarpeta |
|---|---|
| Evidencias monitorista | `monitorista/{YYYY}/{MM}/{incidenteId}` |
| Fotos detenido | `detenidos/{YYYY}/{MM}/{reporteCampoId}` |
| Prevención | `prevencion/{YYYY}/{MM}/{folio}` |

## Limitaciones

- **DELETE no implementado**: guest token no puede borrar. Ningún módulo actual borra archivos.
- **View tokens expiran**: upload 1h, browse 5 min. El cliente refresca automáticamente vía browse con LRU.
- **ALLOWED_MIME**: servidor acepta PDF + imágenes por defecto.
