# Etapa 3 — Login (`app/(auth)/login/page.tsx` + `login.css`)

Depende de Etapa 1 (tokens `--apple-*`). Leer `00-contexto.md` primero, especialmente la sección "Login" que ya documenta el estado real del archivo.

## Objetivo

Reemplazar el lenguaje visual "cyber/tactical" del login por el lenguaje Apple-style de `DESIGN.md §10`, **sin tocar una sola línea de lógica**: los `useState`/`useEffect`, `handleLogin`, `handleOtpSubmit`, `authClient.signIn.email`, `authClient.twoFactor.verifyTotp`, el redirect a `fromPath`, y el componente `Terminal`/`OtpInput` (funcionalmente) quedan intactos. Este es un cambio de **CSS + algunas literales de texto en mayúsculas**, no de estructura de estado.

## Archivo 1: `app/(auth)/login/login.css`

### 1. Variables de `.login-scope` — limpiar y apuntar al nuevo lenguaje

Reemplazar el bloque de variables (líneas 11-24) por:

```css
.login-scope {
  --ink: #f8fafc;
  --ink-2: #ffffff;
  --ink-3: #111a2e;
  --line: #e2e8f0;
  --line-2: #cbd5e1;
  --text: #0f172a;
  --text-dim: #64748b;
  --text-mute: #4a5878;
  --navy: #1f355a;
  --accent: #1f355a;      /* antes --red / --gold, ambos ya eran #1f355a en la práctica */
  --accent-hi: #274268;   /* hover, antes --red-hi/--gold-hi mezclados */
  --ok: #16a34a;          /* antes --ok: #1f355a (mismo color que accent, sin distinguir éxito) */

  position: relative;
  min-height: 100vh;
  min-height: 100dvh;
  color: var(--text);
  background: var(--ink);
  font-family: var(--apple-font-display);
  -webkit-font-smoothing: antialiased;
}
```

Luego hacer un find-and-replace dentro de `login.css` y `page.tsx`: `var(--red)` → `var(--accent)`, `var(--red-hi)` → `var(--accent-hi)`, `var(--gold)` → `var(--accent)`, `var(--gold-hi)` → `var(--accent-hi)`. `var(--ok)` se mantiene (ahora es verde real, se usaba solo en el estado de éxito, que sí debe leerse como "éxito").

### 2. Quitar decoración táctica

- **Eliminar** la regla `.login-stage-bg` (grid de fondo) o dejarla vacía / `display: none` — es fondo puramente decorativo tipo blueprint.
- **Eliminar** `.login-corner` y sus 4 variantes (`.tl/.tr/.bl/.br`) — esquinas doradas, sin función.
- `.login-kicker::before` (la rayita antes de "Acceso oficial · uso restringido"): puede quedarse, es un separador visual neutro, no un elemento táctico.

### 3. Radios y sombras — usar los tokens del piloto

En los selectores de superficie con `background: var(--ink-2)` + `border` (inputs, `.login-form`, badges), agregar `border-radius: var(--radius-lg)` (inputs) o `var(--radius-xl)` (paneles grandes como `.login-panel-right`, el card de éxito). Ninguno de estos selectores tiene radio hoy (`border-radius` no aparece en el archivo salvo `.cyber-success-icon` con `4px` y `.otp-input-field` sin radio) — es un cambio de "agregar", no de "reemplazar".

### 4. Tipografía — quitar mayúsculas agresivas

Buscar todas las reglas con `text-transform: uppercase` + `font-family: 'JetBrains Mono'` o `'Barlow Condensed'` dentro de este archivo (aprox. 12 selectores: `.login-kicker`, `.login-h1`, `.login-mono-line`, `.login-compact-title`, `.login-compact-sub`, `.login-compact-session`, `.login-topbar`, `.login-badge`, `.login-form-title`, `.login-step`, `.terminal-head` — este último puede ignorarse porque `.terminal-panel` no se renderiza). Cambiar cada una:
- `font-family` → `var(--apple-font-display)`.
- `text-transform: uppercase` → `text-transform: none`.
- `letter-spacing` → reducir a `0` o `0.01em` (nunca más de `0.02em`).
- `font-weight: 800` → `600` o `700` como máximo.

Ejemplo concreto (`.login-h1`, hoy la palabra "CENTINELA" gigante):

```css
.login-h1 {
  font-family: var(--apple-font-display);
  font-weight: 600;
  font-size: clamp(48px, 11vh, 120px);
  line-height: 1;
  letter-spacing: -0.02em;
  text-transform: none;
  color: var(--text);
  margin: 0;
  text-align: center;
}
```

### 5. Panel de éxito (`.cyber-success-*`)

- Quitar `.cyber-success-grid` (grid de fondo) y `.cyber-success-line` (línea horizontal decorativa).
- `.cyber-success-icon`: quitar `border-radius: 4px` → `border-radius: var(--radius-full)` (círculo), quitar el glow verde exagerado (`box-shadow` con doble `rgba(74,158,106,...)`) y dejar una sombra suave (`var(--apple-shadow-glass)`).
- Quitar la animación `cyber-reveal-success` (con `clip-path` de escaneo) y usar una simple `fadein` + `scale(0.9→1)` con `ease-out`.

## Archivo 2: `app/(auth)/login/page.tsx`

Solo tocar strings literales en mayúsculas (la lógica y el JSX estructural no cambian):

| Línea aprox. | Antes | Después |
|---|---|---|
| 309 | `Acceso oficial · uso restringido` | (ya es sentence-case en JSX, el `uppercase` viene del CSS que ya se corrigió arriba — no tocar esta línea) |
| 347 | `SSPM-SJR · ACCESO SEGURO` | `SSPM-SJR · Acceso seguro` |
| 350 | `CIFRADO TLS 1.3` | `Cifrado TLS 1.3` |
| 335 | `SSPM · SAN JUAN DEL RÍO · QRO` | `SSPM · San Juan del Río · QRO` |
| 337 | `CIFRADO TLS 1.3` (compact) | `Cifrado TLS 1.3` |
| 363 | `'ETAPA 2 · VERIFICACIÓN 2FA' : 'ETAPA 1 · CREDENCIALES'` | `'Verificación en dos pasos' : 'Paso 1 de 2 · Credenciales'` |
| 419 | `{showPwd?'OCULTAR':'VER'}` | `{showPwd?'Ocultar':'Ver'}` |
| 376 | `[['01','CREDENCIALES',1],['02','DOBLE FACTOR',2],['03','TABLERO C4',3]]` | `[['01','Credenciales',1],['02','Doble factor',2],['03','Tablero',3]]` |
| 444 | `<span>⬢ Acceder al sistema</span>` | `<span>Acceder al sistema</span>` (quitar el glifo `⬢`, es un detalle táctico) |
| 483 | `← Volver a credenciales` | sin cambio (ya está bien) |

No tocar: nombres de variables de estado, handlers, la estructura de `<form>`, `name`/`type`/`autoComplete` de los inputs, ni el flujo de `authClient`.

## Criterios de aceptación

1. `npx tsc --noEmit` sin errores.
2. `npm run build` sin errores.
3. Prueba manual completa del flujo: credenciales inválidas → mensaje de error visible y legible; credenciales válidas → pantalla OTP; OTP inválido → error + refoco del primer input; OTP válido → pantalla de éxito → redirect a `fromPath` (probar con y sin query `?from=`).
4. Visual: sin uppercase agresivo en labels/títulos, sin esquinas doradas ni grid de fondo, radios de esquina consistentes, un solo acento de color (`--accent` / `#1f355a`) en toda la pantalla.
5. Responsive verificado en los 3 breakpoints (móvil ≤720px oculta el panel izquierdo; tablet 721-1200px muestra cabecera compacta; desktop >1200px muestra el split de 2 columnas) — el archivo ya tiene las media queries, no deben romperse.

Detenerse aquí y esperar confirmación antes de pasar a Etapa 4.
