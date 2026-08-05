# Etapa 7 — Retirar la generación de PPT de Monitorista

## Contexto (resumen — ver `00-contexto.md`)

Requiere las Etapas 1-6 ya construidas y **verificadas funcionando** en `/agente_reportes` → `/reporte-detenidos` (no ejecutar esta etapa antes de confirmar que el reemplazo funciona — es la etapa que elimina la funcionalidad vieja). La bandeja de Monitorista (`/monitorista/detenidos`, revisar/aprobar fotos, editar campos) **se mantiene intacta** — solo se retira el botón y el endpoint de generar PPT, que ahora es exclusivo de `/reporte-detenidos`.

## Objetivo

Que `/monitorista/detenidos` deje de ofrecer "Generar PPT", y que la card del hub de Monitorista deje de enmarcarse como "reporte" (es gestión de fotos, no generación de reporte).

## Archivos a tocar/eliminar

### 1. Editar `app/monitorista/detenidos/page.tsx`

- Quitar el import `import { BotonGenerarPpt } from '@/components/monitorista/BotonGenerarPpt'` (línea 8).
- Quitar el uso `<BotonGenerarPpt pendientes={pendientes.length} completados={completadas.length} />` dentro de `actions` (línea 46), dejando solo el link "← Panel":

```tsx
actions={<PageHeaderLink href="/monitorista" variant="secondary">← Panel</PageHeaderLink>}
```

- No tocar nada más de este archivo (el listado, badges, stats y link "VER" se mantienen igual — siguen siendo necesarios para que Monitorista revise/apruebe fotos).

### 2. Eliminar archivos ya sin consumidores

- `app/api/monitorista/detenidos/generar-ppt/route.ts` (endpoint viejo, reemplazado por `app/api/reporte-detenidos/generar-ppt/route.ts`).
- `lib/monitorista/ppt-service.ts` (lógica trasladada y adaptada en `lib/reporte-detenidos/ppt-service.ts`).
- `components/monitorista/BotonGenerarPpt.tsx` (reemplazado por `components/reporte-detenidos/BotonGenerarPpt.tsx`).

Antes de eliminar cada uno, confirmar con una búsqueda de referencias que ningún otro archivo los importa (deberían quedar sin consumidores tras el paso 1).

### 3. Editar `app/monitorista/page.tsx` (card de detenidos, líneas 61-75)

Ajustar el copy para reflejar que ya no es "reporte" — sigue siendo gestión/revisión de fotos de detenidos, con las mismas stats (`stats.detPend`/`stats.detComp`, siguen siendo útiles como indicador de carga de trabajo pendiente de Monitorista):

```tsx
{permisos.detenidos.puede_ver && <Link href="/monitorista/detenidos" style={{ textDecoration: 'none' }}>
  <div style={cardStyle}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
      <User size={28} color="#059669" />
      <span style={onlineStyle}>ONLINE</span>
    </div>
    <div style={{ fontFamily: 'Barlow Condensed', fontSize: 26, fontWeight: 700, color: '#0f172a', textTransform: 'uppercase', marginBottom: 8 }}>Fotos de Detenidos</div>
    <div style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: '#64748b', textTransform: 'uppercase', marginBottom: 20 }}>Solicitar y revisar evidencia de Fiscalía/Juzgado</div>
    <div style={{ display: 'flex', gap: 24, paddingTop: 16, borderTop: '1px solid #e2e8f0' }}>
      <div><div style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: '#64748b', textTransform: 'uppercase' }}>Enviados</div><div style={{ fontFamily: 'Barlow Condensed', fontSize: 24, fontWeight: 700, color: '#b45309' }}>{stats.detPend}</div></div>
      <div><div style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: '#64748b', textTransform: 'uppercase' }}>Completados</div><div style={{ fontFamily: 'Barlow Condensed', fontSize: 24, fontWeight: 700, color: '#15803d' }}>{stats.detComp}</div></div>
    </div>
    <div style={{ marginTop: 20, fontFamily: 'JetBrains Mono', fontSize: 10, fontWeight: 600, color: '#1f355a', textTransform: 'uppercase', letterSpacing: '0.15em', display: 'flex', alignItems: 'center', gap: 8 }}>ACCEDER →</div>
  </div>
</Link>}
```

Solo cambian el título ("Reporte de Detenidos" → "Fotos de Detenidos") y el subtítulo — el resto del bloque (ícono, stats, estilos) queda igual.

## Qué NO tocar en esta etapa

- No tocar `app/monitorista/detenidos/[id]/page.tsx` (edición de campos, envío de fotos) — sigue funcionando igual.
- No tocar `lib/monitorista/repository.ts`, `service.ts`, `detenido-service.ts`, `types.ts`, `mapper.ts` — siguen siendo necesarios para la bandeja.
- No tocar `app/monitorista/detenidos/nueva/page.tsx` (fuera de alcance, ver `README.md`).

## Criterios de aceptación

1. `npx tsc --noEmit` y `npm run build` pasan sin errores (confirma que nada más importaba los archivos eliminados).
2. `/monitorista/detenidos` sigue mostrando el listado, badges de estado y link "VER", pero **sin** el botón "Generar PPT".
3. `/monitorista/detenidos/[id]` sigue permitiendo solicitar fotos, aprobar/rechazar y editar delito/falta administrativa/modus operandi — sin cambios.
4. La card en `/monitorista` dice "Fotos de Detenidos" (no "Reporte de Detenidos") y sigue navegando a `/monitorista/detenidos`.
5. `POST /api/monitorista/detenidos/generar-ppt` responde `404` (ruta eliminada) — la única forma de generar el PPT es desde `/reporte-detenidos`.
