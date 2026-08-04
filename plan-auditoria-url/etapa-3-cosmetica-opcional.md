# Etapa 3 (opcional) — Respuesta cosmética al pedido literal del cliente

> Lee primero [`00-contexto.md`](./00-contexto.md). Esta etapa es **opcional** y solo tiene sentido si, después de explicarle al cliente que las Etapas 1-2 son el fix real, insiste en que la URL "se vea distinta". No implementar sin que se confirme explícitamente que se quiere — no es una medida de seguridad, es superficial.

**Archivo a modificar:** `next.config.ts`

**Cambio estructural opcional:** mover carpetas de `app/` a un route group `(staff)` — ej. `app/(staff)/fiscalia`, `app/(staff)/monitorista` — que no aparece en la URL visible pero agrupa las rutas internamente. Esto NO oculta el segmento de cada módulo (`/fiscalia`, `/monitorista` siguen apareciendo tal cual), solo evita un prefijo compartido adicional si se quisiera agregar uno — en la práctica, con la estructura actual de carpetas por rol, un route group no cambia lo que el cliente ve en la barra de direcciones. **Antes de tocar carpetas, confirmar con el cliente qué parte exacta de la URL le molesta** — si es el nombre del módulo (`/fiscalia`), un route group no lo resuelve; si es la profundidad de anidamiento, tampoco. Es probable que esta parte del pedido no tenga una solución de código real y haya que gestionarla como conversación de expectativas, no como tarea de ingeniería.

## Headers de seguridad en `next.config.ts`

Esto sí es una mejora real de defensa en profundidad (reduce fuga de rutas internas vía el header `Referer` hacia sitios de terceros, y mitiga clickjacking/sniffing), aunque no resuelve el pedido literal de "ocultar rutas":

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'Referrer-Policy', value: 'strict-origin' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
        ],
      },
    ]
  },
};

export default nextConfig;
```

Nota: no se agrega una política CSP completa en esta etapa porque requiere inventariar todos los orígenes de scripts/estilos/imágenes que ya usa el proyecto (fuentes, mapas, etc.) para no romper nada en producción — eso es trabajo de una etapa propia si se prioriza, no algo para improvisar dentro de este plan de auditoría de URLs.

## Comunicación al cliente (no es código, es parte del entregable)

Al presentar esta etapa, dejar explícito por escrito:
- Las Etapas 1-2 son las que efectivamente evitan que un usuario acceda a datos que no le corresponden.
- Esta etapa no agrega ninguna protección — solo cambia cómo se ve la URL en algunos casos y agrega headers estándar recomendados por buenas prácticas web.
- "Ocultar o encriptar" la URL completa (por ejemplo con base64 del path, o un proxy que reescriba todo) no es viable sin romper funcionalidad básica de Next.js (navegación, caché, SEO, deep-linking, botón atrás del navegador) y no cierra ningún hueco que las Etapas 1-2 no cierren ya.

## Criterios de aceptación

- [ ] `curl -I` contra cualquier página autenticada muestra los 3 headers nuevos.
- [ ] Ninguna funcionalidad existente se rompe por los headers (en particular, si el proyecto embebe algo en un iframe en algún flujo, `X-Frame-Options: DENY` lo rompería — confirmar que no es el caso antes de aplicar; si sí lo es, usar `SAMEORIGIN` en vez de `DENY`).
- [ ] Documento de comunicación al cliente (puede ser un párrafo en el PR o un mensaje aparte) deja explícito que esta etapa es cosmética/complementaria, no la solución al riesgo reportado.
