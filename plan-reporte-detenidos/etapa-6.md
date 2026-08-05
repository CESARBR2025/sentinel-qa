# Etapa 6 — Card nueva en `/agente_reportes`

## Contexto (resumen — ver `00-contexto.md`)

Requiere la Etapa 5 ya construida (`/reporte-detenidos` funcional). Esta etapa la conecta al hub: agrega el permiso `reporte_detenidos` al gate del hub y una card nueva que enlaza a `/reporte-detenidos`.

## Objetivo

Que la card "Reporte de Detenidos" aparezca en `/agente_reportes` para los usuarios con permiso `reporte_detenidos`, siguiendo el mismo patrón de las 9 cards existentes (`OptionSquare` dentro de una sección de `secciones`).

## Archivo a tocar: `app/agente_reportes/page.tsx`

### 1. Agregar `'reporte_detenidos'` al array de permisos consultados (línea 36)

```tsx
const permisos = await obtenerPermisosUsuario(session.user.id, ['reportes_ciudadano', 'incidentes_camaras', 'modulo_incidentes', 'formato_n_coordinacion', 'reporte_detenidos'] as const)
```

(El gate duro del hub sigue siendo `reportes_ciudadano` en la línea siguiente — no cambiar eso, `reporte_detenidos` solo controla si SU card se muestra, vía `puede('reporte_detenidos')`.)

### 2. Importar el ícono a usar (ej. `User`, ya usado con este mismo significado en `app/monitorista/page.tsx:64`) junto a los demás imports de `lucide-react` (línea 4-7).

### 3. Agregar la card nueva

Se agrega dentro de la sección "Estadísticas" (líneas 117-129), junto a "Reportes Telefónicos" — es la sección más afín semánticamente (reportes periódicos diario/semanal/mensual):

```tsx
{
  titulo: 'Estadísticas',
  cards: [
    {
      titulo: 'Reportes Telefónicos',
      subtitulo: 'Generación automática de concentrados diarios, semanales y mensuales para mando.',
      icono: <BarChart3 size={28} />,
      enlace: '/estadisticos',
      seccion: 'reportes_ciudadano',
      estadisticas: [{ label: 'Corte', value: 'Semanal' }, { label: 'Eficiencia', value: '92%' }],
    },
    {
      titulo: 'Reporte de Detenidos',
      subtitulo: 'Presentación con fotografías, evento, delitos, falta administrativa y modus operandi — diario, semanal y mensual.',
      icono: <User size={28} />,
      enlace: '/reporte-detenidos',
      seccion: 'reporte_detenidos',
      estadisticas: [],
    },
  ],
},
```

No agregar estadísticas en vivo (`estadisticas: []`) salvo que se quiera hacer un query adicional — no es parte del alcance pedido (la card solo necesita navegar, el detalle está en la página).

## Qué NO tocar en esta etapa

- No tocar `app/monitorista/page.tsx` todavía (Etapa 7).
- No mover la card a otra sección distinta de "Estadísticas" salvo que el usuario lo pida explícitamente al revisar el resultado visual.

## Criterios de aceptación

1. `npx tsc --noEmit` pasa sin errores nuevos.
2. Con el permiso `reporte_detenidos` asignado, la card "Reporte de Detenidos" aparece en `/agente_reportes`, dentro de la sección "Estadísticas", y al hacer clic navega a `/reporte-detenidos`.
3. Sin el permiso, la card no aparece (el resto de las 9 cards existentes siguen funcionando igual, sin regresión).
