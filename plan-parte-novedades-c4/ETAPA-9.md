# Etapa 9 — Integración, permisos y bóveda

Requiere todas las anteriores. Cierra el plan.

## 9.1 Permisos

`lib/reportes/permisos.ts` declara hoy:

```ts
export const SECCIONES = ['formato_n_coordinacion', 'reportes_ciudadano'] as const
```

Se agrega `'parte_novedades_c4'` y los helpers equivalentes a los de Formato N:

```ts
export async function tieneAccesoNovedades(usuarioId: string): Promise<boolean>
export async function verificarAccesoNovedadesApi(
  usuarioId: string, accion: Accion
): Promise<NextResponse | null>
```

Todas las rutas de `/api/novedades/*` verifican sesión + permiso antes de tocar
BD, igual que las de Formato N (`auth.api.getSession` → `verificarAcceso...` →
lógica).

Asignar el permiso a los roles que hoy tienen `formato_n_coordinacion` — el
mismo personal del C-4 llena ambos partes. Confirmar la lista con
Administración antes de sembrar.

## 9.2 Hub `/envio-de-formatos`

Hoy `app/envio-de-formatos/page.tsx` es solo un redirect:

```ts
redirect('/envio-de-formatos/consolidar')
```

Con dos formatos deja de tener sentido. Se convierte en el selector real:

| Formato | Ruta | Estado |
|---|---|---|
| Formato N a Coordinación | `/envio-de-formatos/consolidar` | ya existe |
| Parte de Novedades C-4 | `/envio-de-formatos/novedades` | nuevo |

Cada tarjeta muestra el semáforo del día en curso (`n/8` y `n/11` secciones).
Si el usuario solo tiene permiso de uno, se redirige directo a ese —
preservando el comportamiento actual para quien solo usa Formato N.

## 9.3 Vista consolidada de Novedades

`app/envio-de-formatos/novedades/page.tsx`, clon de
`app/envio-de-formatos/consolidar/page.tsx` con:

- rango de fechas (Desde / Hasta)
- una tarjeta por día con badge Listo / Pendiente y `n/11 secciones completas`
- botones **Descargar Word** (`/api/novedades/generar?fecha=...`) y **Editar**
  cuando está listo; **Completar reporte** cuando no

El cálculo `esListo` cambia de `=== 8` a `=== 11`. Al copiar el archivo, revisar
que no quede el literal `8` hardcodeado — en el original está en la línea
`const esListo = (e) => confirmadas(e) === 8` y también en el texto
`` `Reporte del día · ${n}/8 secciones completas` ``.

## 9.4 Navegación

Agregar la entrada en el menú lateral con su permiso. Verificar contra
`app/agente_reportes/page.tsx`, que es el panel desde donde se llega hoy a
Formato N (`backHref="/agente_reportes"`).

## 9.5 Bóveda

Checklist T2 de `AGENTS.md`:

1. **Feature nueva** → `boveda/🧩 Features/Parte de Novedades C4.md`, usando
   `Feature Example.md` como plantilla, y alta en `boveda/🧩 Features/Index.md`.
2. **Cambio en BD** → `npm run db:schema` y actualizar
   `boveda/📦 Datos/Esquema BD.md`: `novedades_estatus_dia`,
   `novedades_seccion`, `novedades_filas`, `cat_clasificacion_delitos`,
   `ofi_oficiales.sector_id`, y las bajas de la Etapa 10.
3. **Feature tocada** → actualizar `boveda/🧩 Features/` del módulo de cámaras /
   Monitorista por el cambio de semántica de `incidentes_camara.fecha`.
4. **Decisiones técnicas** → ADRs en `boveda/🏗 Arquitectura/Decisiones.md`:
   - por qué `cat_sectores` gana sobre `via.sectores`
   - por qué 3 tablas genéricas en vez de una por sección
   - por qué ventana única 06→06 pese al literal 05:00 del documento original
   - por qué se agrega la columna CENTRO al formato oficial
   - por qué `turno` se queda como enum en TS y no como catálogo con FK, pese a
     la regla general de catálogos sincronizados
   - qué significa `incidentes_camara.fecha` a partir de ahora
   - snapshot al confirmar vs. recálculo en vivo
   - criterio de la auditoría de deuda en BD (Etapa 10)
5. **API** → actualizar `boveda/📡 API/API Routes.md` con las rutas de
   `/api/novedades/*`.
6. Registrar el cierre: `node scripts/session-checkpoint.mjs --decision "..."`.

## 9.6 Verificación final

1. `npx tsc --noEmit`
2. `npm run build`
3. `npm run lint`
4. `npx graphify update`
5. `npm run check:responsive`
6. Prueba de extremo a extremo: día completo → 11 pasos → `.docx` → comparar
   contra `FORMATO NOVEDADES.docx`.
7. Prueba de permisos: usuario sin `parte_novedades_c4` recibe 403 en las rutas
   de API y no ve la tarjeta en el hub.

## Nota sobre `as any` / `as unknown`

Si en el camino se reemplaza algún `as any` por `as Record<string, unknown>`
(probable, por el manejo de `jsonb`), correr `npx tsc --noEmit` inmediatamente
después: el cambio `any` → `unknown` rompe asignaciones y condiciones que antes
compilaban aunque eslint pase. Está documentado en `AGENTS.md`.
