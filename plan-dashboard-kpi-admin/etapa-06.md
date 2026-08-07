# Etapa 6 — Card "KPIs Generales" en `/dashboard`

Depende de la Etapa 5 (enlaza a `/dashboard/kpis`).

## Objetivo

Agregar la card "KPIs Generales" al home del dashboard, mismo patrón visual y mismo gate (`esAdmin`) que la card "Catálogos" dentro de `app/dashboard/sspm-general.tsx`.

## Archivo: `app/dashboard/sspm-general.tsx`

Agregar una segunda card al `<div className="..." style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', ... }}>` ya existente (línea 35), junto a la de "Catálogos". Mismo componente `Link`, mismos estilos, solo cambia contenido:

```tsx
<Link
  href="/dashboard/kpis"
  style={{ /* idéntico al Link de "Catálogos", líneas 36-53 */ }}
>
  <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: 2, background: '#1f355a' }} />
  <div>
    <div style={{ fontFamily: 'var(--apple-font-display)', fontWeight: 600, fontSize: 30, color: '#0f172a' }}>
      KPIs Generales
    </div>
    <div style={{ fontFamily: 'var(--apple-font-display)', fontSize: 13, color: '#64748b', marginTop: 6, lineHeight: 1.4 }}>
      Indicadores operativos SSPM e Infracciones
    </div>
  </div>
  <div style={{ fontFamily: 'var(--apple-font-display)', fontSize: 13, fontWeight: 600, color: '#1f355a', marginTop: 16 }}>
    Acceder →
  </div>
</Link>
```

Usar un acento de color distinto al de "Catálogos" (`#c0223a`) para diferenciar visualmente las dos cards — `#1f355a` (azul institucional, ya usado en el resto del dashboard) es buena opción por defecto.

No tocar el gate — `SspmGeneral` ya solo se renderiza cuando `userWithRole?.esAdmin` es verdadero (`app/dashboard/page.tsx:48`), así que ambas cards heredan el mismo gate sin código adicional.

**Nota de nomenclatura**: el encabezado de esta sección en el dashboard ya se llama "SSPM General" (`sspm-general.tsx:22`) — no confundir con el segmento "SSPM" de `/dashboard/kpis`, son conceptos distintos (uno es "catálogos administrativos", el otro es "KPIs por área"). No renombrar ninguno de los dos en esta etapa; si genera confusión real de producto, es una decisión a tomar con el usuario en una etapa aparte, no ad-hoc aquí.

## Criterios de aceptación

1. `npx tsc --noEmit` sin errores.
2. Login como admin → `/dashboard` → sección "SSPM General" ahora muestra 2 cards ("Catálogos" y "KPIs Generales") en grid de 2 columnas.
3. Click en "KPIs Generales" → navega a `/dashboard/kpis`.
4. Login como no-admin → la sección completa sigue sin mostrarse (ninguna de las 2 cards).
5. Responsive: en móvil el grid de 2 columnas colapsa correctamente (verificar que `sspm-general.tsx` no tiene ya una media query pendiente para esto — si no la tiene, no es parte de esta etapa arreglarlo, solo no empeorarlo).

Detenerse aquí y esperar confirmación antes de pasar a Etapa 7.
