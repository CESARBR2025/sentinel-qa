# Etapa 6 — PWA instalable: iconos maskable + prompt de instalación

No depende de las etapas de push (2-5) — puede ejecutarse en paralelo si se prefiere, pero se deja al final del orden secuencial por simplicidad de revisión. Sí depende de Etapa 1 solo en el sentido de que ambas etapas tocan `.env`/`manifest.json`; no hay conflicto real de archivos. Leer primero `00-contexto.md`, sección "2. PWA instalable".

## 1. Iconos maskable

Generar variantes maskable desde `public/logo_sentinel.png` (el logo actual tiene fondo transparente o ajustado a los bordes — un icono maskable necesita "padding" de seguridad porque el OS lo recorta en distintas formas: círculo, squircle, etc. — la zona segura es el 80% central).

Si `public/logo_sentinel.png` ya tiene suficiente margen alrededor del isotipo, puede reusarse tal cual como maskable. Si el isotipo llega hasta el borde, generar una versión con padding usando `sharp` (agregar como dependencia de un solo uso, o correr con `npx`):

```bash
npm install -D sharp
```

Script de un solo uso (puede vivir temporalmente en `scripts/generar-iconos-pwa.mjs`, o correrse con `node -e` y no dejarse en el repo — decisión del que ejecuta, documentar cuál se tomó en el reporte de esta etapa):

```js
import sharp from 'sharp'

const TAMANOS = [48, 72, 96, 144, 192, 384, 512]
const ORIGEN = 'public/logo_sentinel.png'

for (const size of TAMANOS) {
  await sharp(ORIGEN)
    .resize(Math.round(size * 0.8), Math.round(size * 0.8), { fit: 'contain', background: { r: 31, g: 53, b: 90, alpha: 1 } })
    .extend({
      top: Math.round(size * 0.1), bottom: Math.round(size * 0.1),
      left: Math.round(size * 0.1), right: Math.round(size * 0.1),
      background: { r: 31, g: 53, b: 90, alpha: 1 }, // #1f355a — theme_color del manifest
    })
    .png()
    .toFile(`public/icons/icon-maskable-${size}.png`)

  await sharp(ORIGEN).resize(size, size).png().toFile(`public/icons/icon-${size}.png`)
}
```

Si el resultado visual no es aceptable (el logo real puede tener proporciones que no se prestan a este recorte automático), **no forzarlo** — avisar al usuario y dejar los iconos `any` existentes sin agregar `maskable` hasta que haya un asset de diseño dedicado. Esto es una mejora de UX de instalación, no un bloqueante del resto del plan.

## 2. Archivo a modificar: `public/manifest.json`

```json
{
  "name": "CENTINELA SSPM San Juan del Río",
  "short_name": "CENTINELA",
  "description": "Sistema de Gestión de Seguridad Pública — SSPM San Juan del Río",
  "start_url": "/",
  "scope": "/",
  "display": "standalone",
  "orientation": "portrait",
  "background_color": "#f8fafc",
  "theme_color": "#1f355a",
  "lang": "es",
  "icons": [
    { "src": "/logo_sentinel.png", "sizes": "192x192", "type": "image/png", "purpose": "any" },
    { "src": "/logo_sentinel.png", "sizes": "512x512", "type": "image/png", "purpose": "any" },
    { "src": "/icons/icon-maskable-192.png", "sizes": "192x192", "type": "image/png", "purpose": "maskable" },
    { "src": "/icons/icon-maskable-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
  ]
}
```

Mantener los 2 iconos `any` existentes tal cual (no romper lo que ya funciona), solo agregar las entradas `maskable` nuevas.

## 3. Componente nuevo: `components/InstalarApp.tsx`

Banner discreto que aparece solo cuando tiene sentido (evento `beforeinstallprompt` disponible, o iOS sin la PWA instalada), se puede descartar, y no vuelve a insistir en la misma sesión de navegador si el usuario ya lo cerró (usar `sessionStorage`, no `localStorage` — que pueda volver a aparecer en la siguiente visita si sigue sin instalar, sin ser permanente).

```tsx
'use client'

import { useEffect, useState } from 'react'
import { Download, X } from 'lucide-react'

function esIOS(): boolean {
  return /iphone|ipad|ipod/i.test(navigator.userAgent) && !(window as unknown as { MSStream?: unknown }).MSStream
}

function yaInstalada(): boolean {
  return window.matchMedia('(display-mode: standalone)').matches
    || (navigator as unknown as { standalone?: boolean }).standalone === true
}

export default function InstalarApp() {
  const [prompt, setPrompt] = useState<Event | null>(null)
  const [mostrarIOS, setMostrarIOS] = useState(false)
  const [descartado, setDescartado] = useState(false)

  useEffect(() => {
    if (yaInstalada() || sessionStorage.getItem('pwa-instalar-descartado')) return

    if (esIOS()) {
      setMostrarIOS(true)
      return
    }

    const onPrompt = (e: Event) => {
      e.preventDefault()
      setPrompt(e)
    }
    window.addEventListener('beforeinstallprompt', onPrompt)
    return () => window.removeEventListener('beforeinstallprompt', onPrompt)
  }, [])

  function descartar() {
    sessionStorage.setItem('pwa-instalar-descartado', '1')
    setDescartado(true)
  }

  async function instalar() {
    if (!prompt) return
    // beforeinstallprompt no está tipado en lib.dom.d.ts estándar de TS.
    await (prompt as unknown as { prompt: () => Promise<void> }).prompt()
    setPrompt(null)
  }

  if (descartado || (!prompt && !mostrarIOS)) return null

  return (
    <div style={{
      position: 'fixed', bottom: 16, left: 16, right: 16, zIndex: 9999,
      maxWidth: 420, margin: '0 auto',
      background: '#1f355a', color: '#fff', borderRadius: 4,
      padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10,
      boxShadow: '0 12px 30px -8px rgba(15,23,42,0.4)',
    }}>
      <Download size={18} style={{ flexShrink: 0 }} />
      <div style={{ flex: 1, fontFamily: 'Inter, sans-serif', fontSize: 12.5, lineHeight: 1.4 }}>
        {mostrarIOS
          ? <>Instala CENTINELA: toca <strong>Compartir</strong> y luego <strong>&quot;Agregar a inicio&quot;</strong>.</>
          : <>Instala CENTINELA en este dispositivo para acceso rápido y notificaciones.</>}
      </div>
      {!mostrarIOS && (
        <button type="button" onClick={() => void instalar()} style={{
          flexShrink: 0, background: '#fff', color: '#1f355a', border: 'none',
          padding: '6px 10px', borderRadius: 3, cursor: 'pointer',
          fontFamily: 'JetBrains Mono, monospace', fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase',
        }}>
          Instalar
        </button>
      )}
      <button type="button" onClick={descartar} aria-label="Cerrar" style={{
        flexShrink: 0, background: 'transparent', border: 'none', color: '#fff', opacity: 0.7, cursor: 'pointer',
      }}>
        <X size={16} />
      </button>
    </div>
  )
}
```

Nota sobre el mensaje: la referencia a "notificaciones" en el texto solo tiene sentido pleno si Etapas 2-5 ya están hechas — si este equipo ejecuta Etapa 6 sin las de push, ajustar el copy a algo genérico ("acceso rápido sin abrir el navegador") en vez de prometer algo que aún no existe.

## Archivo a modificar: `app/layout.tsx`

Montar `<InstalarApp />` junto al `<SwRegister />` ya existente (mismo nivel, dentro del `<body>`). Revisar el archivo real antes de editar — no asumir la estructura exacta sin verla.

## Criterios de aceptación

1. `npx tsc --noEmit` y `npm run build` sin errores.
2. `manifest.json` sigue siendo JSON válido, con los 2 iconos `any` originales intactos más los `maskable` nuevos (si se generaron; si no, documentar por qué se omitió).
3. Prueba manual del usuario en Chrome Android o Chrome desktop: el banner de instalar aparece, el botón "Instalar" dispara el diálogo nativo del navegador, la app queda instalada y abre en modo `standalone`.
4. Prueba manual del usuario en Safari iOS: aparece el banner con instrucciones manuales (no un botón, porque no existe ese evento en iOS), y confirmar que agregar manualmente a inicio funciona y abre sin barra de navegador.
5. El banner no vuelve a aparecer en la misma pestaña/sesión después de descartarlo con la X.

Detenerse aquí y esperar confirmación antes de pasar a Etapa 7.
