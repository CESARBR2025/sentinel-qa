# Etapa 2 — `variant` opcional en `DashboardHeader`

Depende de Etapa 1 (usa los tokens `--apple-*`). Leer `00-contexto.md` primero.

## Objetivo

Agregar un prop `variant?: 'tactico' | 'apple'` a `components/partials/Header.tsx` (`DashboardHeader`), con **default `'tactico'`** — ninguna de las ~100 páginas que ya usan este componente debe cambiar de aspecto. Solo `/dashboard` (Etapa 4) pasará `variant="apple"`.

**No crear un componente nuevo ni duplicar el archivo.** `DESIGN.md §4` prohíbe reimplementar el chrome superior inline — esta etapa extiende el componente existente, no lo reemplaza.

## Archivo a modificar: `components/partials/Header.tsx`

1. Agregar el prop a la interfaz:

```tsx
interface DashboardHeaderProps {
  user?: {
    name: string;
    apellido?: string;
    email: string;
  };
  children?: React.ReactNode;
  backHref?: string;
  backLabel?: string;
  roleLabel?: string;
  // Piloto Apple-style (DESIGN.md §10) — default 'tactico' no cambia nada.
  variant?: 'tactico' | 'apple';
}
```

2. Recibir el prop con default:

```tsx
export function DashboardHeader({
  user,
  children,
  backHref,
  backLabel = 'Dashboard',
  roleLabel = 'Operador Identificado',
  variant = 'tactico',
}: DashboardHeaderProps) {
```

3. Condicionar los estilos que cambian entre variantes. Mantener toda la lógica (`useResponsive`, `authClient.useSession`, `CambiarSesionDev`, `CampanillaNotificaciones`, `SignOutButton`, `children`) exactamente igual — solo cambian valores de estilo inline:

```tsx
const isApple = variant === 'apple';
```

- Contenedor raíz: si `isApple`, usar `background: isApple ? 'rgba(255,255,255,0.72)' : (esMovil ? '#f8fafc' : 'rgba(248,250,252,0.85)')`, `backdropFilter: isApple ? 'blur(20px) saturate(180%)' : (esMovil ? 'none' : 'blur(10px)')`, `borderBottom: isApple ? '1px solid var(--apple-glass-border)' : '1px solid #e2e8f0'`.
- Corner Decorator (`<div>` con `background: '#1f355a'`, barra de 64×2px): **no renderizar** cuando `isApple` (es un detalle táctico puro).
- Kicker "Sistema Táctico" (el `<div>` con el cuadrito `#3e5171` + texto mono `0.3em`): **no renderizar** cuando `isApple`.
- `<h1>CENTINELA</h1>`: si `isApple`, `fontFamily: 'var(--apple-font-display)'`, `fontWeight: 600`, `letterSpacing: 'normal'`, texto `'Centinela'` (sentence-case) en vez de `'CENTINELA'`; si no, mantener exactamente como está hoy (Barlow Condensed 800, mayúsculas, `0.06em`).
- Botón "volver" (`backHref`): si `isApple`, quitar `letterSpacing: '0.25em'`/`textTransform: 'uppercase'` y usar `fontFamily: 'var(--apple-font-display)'`, `color: '#475569'`; mantener el resto de la lógica (`ArrowLeft` de lucide, `esMovil` oculta el label) igual.

No tocar `CambiarSesionDev`, `CampanillaNotificaciones`, `SignOutButton` ni `children` — son subcomponentes propios, no parte del rediseño de esta etapa.

## Criterios de aceptación

1. `npx tsc --noEmit` sin errores.
2. Grep de `<DashboardHeader` en el repo (`grep -rn "<DashboardHeader" app/ components/`) confirma que ninguna de las llamadas existentes pasa `variant` todavía — todas siguen usando el default `'tactico'` y por lo tanto se ven pixel-idénticas a antes.
3. Verificación manual: abrir 2-3 páginas que usen `DashboardHeader` sin `variant` (ej. cualquier vista bajo `app/dashboard/catalogos/`) y confirmar que no cambiaron.
4. Este cambio por sí solo no es visible en ningún lado todavía (nadie pasa `variant="apple"` hasta Etapa 4) — es esperado.

Detenerse aquí y esperar confirmación antes de pasar a Etapa 3.
