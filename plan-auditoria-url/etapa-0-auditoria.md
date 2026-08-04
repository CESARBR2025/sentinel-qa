# Etapa 0 — Script de auditoría de cobertura de permisos

> Lee primero [`00-contexto.md`](./00-contexto.md). Esta etapa no depende de ninguna otra y debe ir primera: produce el CSV que usan las Etapas 1 y 2 para no adivinar a mano el mapa ruta→sección.

**Archivo a crear:** `scripts/auditoria-permisos.mjs` (nuevo, sigue la convención de `scripts/audit-responsive.mjs` ya existente en el proyecto — mismo patrón de script `.mjs` standalone, sin dependencias nuevas)

## Objetivo

Recorrer `app/**/page.tsx` y `app/api/**/route.ts` y detectar, por archivo, si hay una llamada a `tienePermiso(...)` (de `lib/permisos/core.ts`) antes del primer `return`/JSX, y si la puede extraer, qué string literal de `seccion` usa. Generar un CSV en `scripts/reportes/auditoria-permisos.csv` (crear la carpeta `scripts/reportes/` si no existe) con columnas: `ruta,tipo,tienePermisoCheck,seccionDetectada,accionDetectada`.

Este script NO se ejecuta en build ni en un test runner (el proyecto no tiene jest/vitest instalado) — es una herramienta manual de auditoría, invocada con `node scripts/auditoria-permisos.mjs`.

## Código completo del script

```js
#!/usr/bin/env node
// Auditoría de cobertura de permisos: recorre app/**/page.tsx y app/api/**/route.ts
// buscando llamadas a tienePermiso(...) para detectar rutas que solo dependen
// del gate de sesión del proxy, sin check de sección/acción.
import { readdirSync, statSync, readFileSync, mkdirSync, writeFileSync } from 'node:fs'
import { join, relative } from 'node:path'

const ROOT = process.cwd()
const APP_DIR = join(ROOT, 'app')
const OUT_DIR = join(ROOT, 'scripts', 'reportes')
const OUT_FILE = join(OUT_DIR, 'auditoria-permisos.csv')

function walk(dir, matchName, acc = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    const st = statSync(full)
    if (st.isDirectory()) {
      if (entry === 'node_modules' || entry.startsWith('.')) continue
      walk(full, matchName, acc)
    } else if (entry === matchName) {
      acc.push(full)
    }
  }
  return acc
}

function detectarPermiso(contenido) {
  // Busca tienePermiso(<algo>, 'seccion', 'accion') o tienePermiso(<algo>, "seccion", "accion")
  const regex = /tienePermiso\s*\([^,]+,\s*['"]([a-zA-Z0-9_]+)['"]\s*,\s*['"]([a-zA-Z]+)['"]/g
  const matches = [...contenido.matchAll(regex)]
  if (matches.length === 0) return { tiene: false, secciones: [], acciones: [] }
  return {
    tiene: true,
    secciones: [...new Set(matches.map(m => m[1]))],
    acciones: [...new Set(matches.map(m => m[2]))],
  }
}

function main() {
  const pages = walk(APP_DIR, 'page.tsx')
  const routes = walk(APP_DIR, 'route.ts')

  const filas = [['ruta', 'tipo', 'tienePermisoCheck', 'seccionDetectada', 'accionDetectada']]

  for (const [archivos, tipo] of [[pages, 'page'], [routes, 'route']]) {
    for (const archivo of archivos) {
      const contenido = readFileSync(archivo, 'utf8')
      const { tiene, secciones, acciones } = detectarPermiso(contenido)
      const rutaRelativa = relative(APP_DIR, archivo).replace(/\\/g, '/')
      filas.push([
        rutaRelativa,
        tipo,
        tiene ? 'si' : 'NO',
        secciones.join('|'),
        acciones.join('|'),
      ])
    }
  }

  mkdirSync(OUT_DIR, { recursive: true })
  const csv = filas.map(f => f.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n')
  writeFileSync(OUT_FILE, csv, 'utf8')

  const sinCheck = filas.slice(1).filter(f => f[2] === 'NO')
  console.log(`Total archivos auditados: ${filas.length - 1}`)
  console.log(`Sin check de permiso: ${sinCheck.length}`)
  console.log(`CSV escrito en: ${relative(ROOT, OUT_FILE)}`)
  if (sinCheck.length > 0) {
    console.log('\nRutas sin tienePermiso:')
    for (const f of sinCheck) console.log(`  - ${f[0]} (${f[1]})`)
  }
}

main()
```

## Notas de diseño

- La regex de detección es intencionalmente simple (busca la firma literal de `tienePermiso`) — no es un parser AST. Puede haber falsos negativos si alguna página verifica permiso con un wrapper propio distinto (ej. `verificarRolLiberaciones`, mencionado en la exploración inicial) — si el CSV resultante muestra "NO" en una página que en realidad sí tiene un check propio con otro nombre de función, agrégalo como una segunda regex (`verificarRolLiberaciones\(`, etc.) en `detectarPermiso`, no lo ignores.
- El script debe reproducir como caso de control el incidente ya documentado: `reportes_incidentes/page.tsx` y `api/reportes-incidentes/exportar/route.ts` deben aparecer como `NO` en la primera corrida (antes de aplicar la Etapa 1). Si no aparecen así, revisa la regex antes de continuar — es la validación de que el script funciona.

## Criterios de aceptación

- [ ] `node scripts/auditoria-permisos.mjs` corre sin errores y genera `scripts/reportes/auditoria-permisos.csv`.
- [ ] El CSV incluye las 148 `page.tsx` + las `route.ts` de `app/api/**`.
- [ ] `app/reportes_incidentes/page.tsx` y `app/api/reportes-incidentes/exportar/route.ts` aparecen marcados `NO` en la corrida inicial (confirma que el script detecta el caso real ya conocido).
- [ ] La lista de valores distintos en la columna `seccionDetectada` (sin duplicados) queda disponible para armar el mapa de la Etapa 1 — no se adivina a mano.
