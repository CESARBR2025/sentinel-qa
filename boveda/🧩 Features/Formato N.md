# Formato N — Envío de Formatos a Coordinación

**Propósito**: Captura de 7 reportes independientes de coordinación, cada uno con su propio CRUD, tabla y fechas.

---

## Flujo

```mermaid
flowchart TD
    A[Dashboard /reportes] --> B[Tile "Envío de Formatos"]
    B --> C[Hub /envio-de-formatos con 7 tiles]
    C --> D1[Eventos Informados]
    C --> D2[FGE]
    C --> D3[FGR]
    C --> D4[RND]
    C --> D5[Medios Alternativos]
    C --> D6[Atención Víctimas]
    C --> D7[Armas Aseguradas]
    D1 --> E[Lista / Nuevo / Editar]
    D2 --> E
    D3 --> E
    D4 --> E
    D5 --> E
    D6 --> E
    D7 --> E
    E --> F[Guardar en DB]
    F --> G[Listado actualizado]
```

## Componentes involucrados

| Archivo | Rol |
|---------|-----|
| `lib/reportes/types.ts` | Interfaces para los 7 reportes |
| `lib/reportes/mapper.ts` | Mappers snake_case → camelCase |
| `lib/reportes/repository.ts` | CRUD genérico para los 7 reportes |
| `lib/reportes/permisos.ts` | Permisos de acceso a reportes |
| `lib/reportes/formato-n-eventos-service.ts` | Lógica de eventos informados |
| `lib/reportes/formato-n-fge-service.ts` | Lógica de FGE |
| `lib/reportes/formato-n-fgr-service.ts` | Lógica de FGR |
| `lib/reportes/formato-n-rnd-service.ts` | Lógica de RND |
| `lib/reportes/formato-n-medios-alternativos-service.ts` | Lógica de medios alternativos |
| `lib/reportes/formato-n-atencion-victimas-service.ts` | Lógica de atención a víctimas |
| `lib/reportes/formato-n-armas-aseguradas-service.ts` | Lógica de armas aseguradas |
| `lib/reportes/formato-n-consolidado-service.ts` | Consolidado de todos los reportes |

## BD

| Tabla | Columnas clave | Uso |
|-------|---------------|-----|
| `formato_n_eventos` | `id`, `fecha`, `hora`, `region`, `evento`, `ubicacion`, `descripcion`, `atenciones`, `capturado_por` | Bitácora de eventos |
| `formato_n_fge` | `id`, `fecha`, `periodo`, `carpetas_iniciadas`, `cateos`, `vehiculos_asegurados`, `personas_aseguradas`, `aprehensiones` | Eventos FGE (agregado) |
| `formato_n_fgr` | `id`, `fecha`, `periodo`, `carpetas_iniciadas`, `cateos`, `vehiculos_asegurados`, `personas_aseguradas`, `aprehensiones` | Eventos FGR (agregado) |
| `formato_n_rnd` | `id`, `fecha`, `hora_detencion`, `delito`, `autoridad_que_realizo_detencion`, `folio` | Registro Nacional de Detenciones |
| `formato_n_medios_alternativos` | `id`, `fecha`, `periodo`, `asuntos_canalizados_por_fiscalia`, `acuerdos`, `monto_reparacion_danos` | Medios alternativos (agregado) |
| `formato_n_atencion_victimas` | `id`, `fecha`, `periodo`, `numero_atenciones`, `atenciones_medicas`, `atenciones_psicologicas`, `asesorias_juridicas` | Atención a víctimas (agregado) |
| `formato_n_armas_aseguradas` | `id`, `fecha`, `carpeta_investigacion`, `tipo_arma`, `matricula`, `calibre` | Armas de fuego aseguradas |

## Reglas de negocio

1. Los 7 reportes son independientes: cada uno tiene su tabla, su CRUD y su ruta
2. Reportes tipo "agregado" (FGE, FGR, medios alternativos, atención víctimas) tienen `UNIQUE (fecha, periodo)` — 409 si se duplica
3. Reportes tipo "bitácora" (eventos, RND, armas) no tienen restricción unique por fecha
4. Las rutas siguen el patrón `/formato-n-<slug>`: `page.tsx` (lista), `nuevo/page.tsx`, `[id]/page.tsx`
5. API routes: GET lista, POST crear, GET/:id detalle, PATCH/:id actualizar
6. Filtro por periodo opcional en los 4 reportes agregados
7. No hay dependencia entre reportes — no hay un reporte "padre" compartido
8. El "envío" actualmente es solo guardar en DB (sin export PDF ni correo aún)
