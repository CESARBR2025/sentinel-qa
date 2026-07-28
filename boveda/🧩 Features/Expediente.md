# Expediente SSPM

Sistema de gestión documental cifrada. Provee almacenamiento, visualización y exploración de archivos seguros.

## Stack

- **v1** (lectura legado): `sanjuandelrio.sytes.net:3044` — API anterior, texto plano
- **v2** (escritura nueva): `sanjuandelrio.sytes.net:3066` — Archivos cifrados (AES-256-GCM + gzip)

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

`app/api/expediente/proxy/route.ts` — Acepta `?ref=` o `?url=`, auto-detecta si es v2 o legado. **Nunca expone el Bearer token al frontend.**

## Taxonomía de carpetas

| Dominio | Subcarpeta |
|---|---|
| Evidencias monitorista | `monitorista/{YYYY}/{MM}/{incidenteId}` |
| Fotos detenido | `detenidos/{YYYY}/{MM}/{reporteCampoId}` |
| Fotos fiscalía | `fiscalia/{YYYY}/{MM}/{reporteCampoId}` |
| Oficios fiscalía/juzgado | `oficios/{YYYY}/{MM}/{idInfraccion}` |
| Docs infracción (INE/INAPAM/tarjeta) | `via/{YYYY}/{MM}/{idInfraccion}/documentos` |
| Evidencias infracción | `via/{YYYY}/{MM}/{idInfraccion}/evidencias` |
| Liberación ciudadana | `via/{YYYY}/{MM}/{solicitudId}/liberacion` |
| Corralón | `corralon/{YYYY}/{MM}/{infraccionId}` |
| Orden de salida | `via/{YYYY}/{MM}/{infraccionId}/orden-salida` |

## Limitaciones

- **DELETE no implementado**: guest token no puede borrar. Ningún módulo actual borra archivos.
- **View tokens expiran**: upload 1h, browse 5 min. El cliente refresca automáticamente vía browse con LRU.
- **ALLOWED_MIME**: servidor acepta PDF + imágenes por defecto.
