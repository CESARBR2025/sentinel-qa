# Sort table + "NUEVO" badge + fix VER FICHA link

## 1. Fix sort — `lib/911/repository.ts:71`

Add secondary sort by `creado_en` para desempatar cuando varios incidentes tienen el mismo `fecha_hora_inicio`:

```diff
-     ORDER BY i.fecha_hora_inicio DESC
+     ORDER BY i.fecha_hora_inicio DESC, i.creado_en DESC
```

## 2. Fix VER FICHA link — `app/agente_911/ciudadano/incidentes/page.tsx:121`

```diff
- <Link href={`/911/ciudadano/incidentes/${item.id}`} style={btnViewStyle}>
+ <Link href={`/agente_911/ciudadano/incidentes/${item.id}`} style={btnViewStyle}>
```

## 3. Badge "NUEVO" — `app/agente_911/ciudadano/incidentes/page.tsx`

Opción A: badge solo en la primera fila de page 1.

```diff
- listado.map((item) => (
-     <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
+ listado.map((item, index) => {
+   const isNewest = page === 1 && index === 0
+   return (
+     <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
```

```diff
  <td style={{ ...tdStyle, fontWeight: 700, fontFamily: 'JetBrains Mono', color: '#0f172a' }}>
      {item.folio}
+     {isNewest && (
+       <span style={{
+         marginLeft: 8, padding: '2px 6px', borderRadius: 2, fontSize: 8,
+         fontWeight: 700, background: '#16a34a', color: '#fff',
+         fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.05em',
+         verticalAlign: 'middle',
+       }}>NUEVO</span>
+     )}
  </td>
```

También cerrar el `.map()` con `)` en lugar de `))` → cambiar el cierre de `))` a `)`.

## Archivos a modificar

- `lib/911/repository.ts` — 1 cambio (sort)
- `app/agente_911/ciudadano/incidentes/page.tsx` — 3 cambios (link + badge + cierre map)
