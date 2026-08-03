# Catálogos — SSPM General

**Propósito**: Segmento del dashboard (`/dashboard` → sección **"SSPM General"**) que agrupa los catálogos base de la corporación: **Oficiales** y **Patrullas** (parque vehicular). CRUD administrado desde tablas, con gate de acceso `esAdmin` (admin/super admin).

---

## Rutas

```
/dashboard                          → sección "SSPM General" (card "Catalogos", solo esAdmin)
/dashboard/catalogos                → 2 cards: OFICIALES y PATRULLAS
/dashboard/catalogos/oficiales      → tabla CRUD de oficiales (+ /nuevo, /[id])
/dashboard/catalogos/patrullas      → tabla CRUD de patrullas (+ /nuevo, /[id], botón importar Excel)
```

## Componentes involucrados

| Archivo | Rol |
|---------|-----|
| `app/dashboard/sspm-general.tsx` | Sección "SSPM General" + card "Catalogos" |
| `app/dashboard/catalogos/layout.tsx` | Gate `esAdmin` + `DashboardHeader` |
| `app/dashboard/catalogos/page.tsx` | Cards OFICIALES / PATRULLAS con conteos |
| `lib/catalogos/actions.ts` | Server actions gateadas a `esAdmin` (oficiales y patrullas) |
| `lib/catalogos/repository.ts` | CRUD de `via.v2_patrullas` + `contarOficialesPorPatrulla` |
| `lib/catalogos/types.ts` / `mapper.ts` | Tipo `PatrullaCatalogo` |
| `lib/catalogos/importar-parque.ts` | Núcleo compartido del importador Excel (lo usa la acción y el CLI) |
| `components/catalogos/*` | `OficialesTable`, `NuevoOficialForm`, modales, `PatrullasTable`, `PatrullaForm`, `ImportarParqueButton` |

Los oficiales reutilizan la lógica de datos de `lib/admin-transito/repository.ts` (listado/upsert/actualizar), con **acciones propias gateadas a `esAdmin`** (las de admin-transito exigen rol `admin_transito`). `/admin-transito/oficiales` se conserva intacto.

## Reglas de negocio

1. La sección y todas las vistas de catálogos requieren `esAdmin` (layout + `requireEsAdmin()` en las acciones).
2. `num_serie` (VIN) es **obligatorio y único** en patrullas (validación al crear/editar).
3. **Eliminar patrulla** se bloquea si tiene oficiales asignados (`contarOficialesPorPatrulla`); primero hay que desasignar.
4. El botón **"Importar desde Excel"** ejecuta el mismo upsert por `num_serie` que el CLI, con resumen en línea (importadas/omitidas/sin placa).
5. Los formularios de patrulla guardan `placa`, `num_serie`, `departamento`, `caracteristicas`, `marca`, `modelo`, `gps`, `radio`, `camaras`.
