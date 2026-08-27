Eres el implementador de un plan ya diseñado por el arquitecto del proyecto.
No rediseñes la arquitectura ni cuestiones las decisiones tomadas — están
documentadas y verificadas contra el código y la base de datos real. Tu
trabajo es ejecutar las etapas en orden, una por una, verificando los
criterios de aceptación de cada una antes de pasar a la siguiente.

## Contexto del proyecto

Next.js (SSPM — Sistema de Seguridad Pública Municipal, San Juan del Río).
Sigue la arquitectura por capas documentada en `AGENTS.md` de la raíz del
repo: `types.ts` / `mapper.ts` / `repository.ts` / `service.ts` / `actions.ts`
por módulo en `lib/<módulo>/`. Antes de tocar cualquier archivo, léelo
completo — no asumas su contenido a partir de este plan, los números de línea
citados pueden haber cambiado si algo más tocó esos archivos entre que se
escribió este plan y que tú lo ejecutas.

## Qué leer, en orden

1. [README.md](README.md) — diagnóstico completo (bugs confirmados contra
   código y base de datos real) y la decisión de arquitectura ya tomada,
   incluida la parte de UX agregada tras feedback del usuario (Etapa 5).
2. [ETAPA-1.md](ETAPA-1.md) — bug crítico de pérdida de datos. Ejecútala primero,
   es la de mayor impacto y la más aislada.
3. [ETAPA-2.md](ETAPA-2.md) — corrige el generador del `.docx` para las 8
   secciones (no solo FGE/FGR).
4. [ETAPA-3.md](ETAPA-3.md) — retira la ruta duplicada `/nCoordinacion`
   (conservando `upsertObservaciones`, la necesita la Etapa 5).
5. [ETAPA-4.md](ETAPA-4.md) — navegación y limpieza de código muerto.
6. [ETAPA-5.md](ETAPA-5.md) — rediseño de UX: consolidado por día
   (LISTO/PENDIENTE, carga automática de hoy) + stepper único que reemplaza
   las 7 páginas sueltas. Es la etapa más grande del plan — incluye una
   migración de base de datos nueva (`formato_n_estatus_dia`).
7. [ETAPA-6.md](ETAPA-6.md) — verificación end-to-end de todo el plan junto,
   probando el flujo completo del stepper.

## Reglas de ejecución

- **Una etapa a la vez.** No mezcles cambios de dos etapas en el mismo commit
  ni los apliques en paralelo — cada `ETAPA-N.md` es atómica y su criterio de
  aceptación asume que las anteriores ya están verificadas.
- **No inventes alcance.** Si algo no está explícito en una etapa (por
  ejemplo, generar el Word para un rango completo de fechas en vez de un solo
  día), no lo implementes — está marcado como "fuera de alcance" a propósito.
  Si crees que hace falta, anótalo al final de tu reporte de esa etapa en vez
  de construirlo.
- **Verifica contra la base de datos real, no solo contra el código.** Varias
  de las conclusiones de este plan (por ejemplo, que `ofi_autoridad_recibe`
  nunca vale `'FGR'`) se confirmaron consultando la base directamente. Si vas
  a tocar lógica de cálculo, corre la consulta antes y después para confirmar
  que el número no cambió sin querer.
- **Después de cada etapa**, corre los criterios de aceptación de esa etapa
  tal cual están escritos (son pasos manuales de verificación + comandos —
  ejecútalos, no los des por hecho) y `npx tsc --noEmit` sobre los archivos
  tocados como mínimo.
- **Si un criterio de aceptación falla**, no avances a la siguiente etapa —
  corrige primero.
- **Detente al terminar cada etapa y espera confirmación** antes de pasar a la
  siguiente — no encadenes varias etapas seguidas sin pausar. Reporta lo hecho
  y lo verificado de esa etapa, y espera.
- Sigue el resto de reglas de `AGENTS.md` del repo (verificación proporcional
  al tamaño del cambio, no tocar la bóveda salvo que amerite, etc.) — estas
  etapas son cambios T2 (tocan varios archivos y una ruta pública), así que al
  cerrar el plan completo corre el checklist T2 completo: `npx tsc --noEmit`,
  `npm run build`, y si el equipo pide documentar el bug en
  `boveda/🗺 Roadmap/Troubleshooting.md`, hazlo citando este plan.

## Al terminar

Reporta, etapa por etapa: qué se cambió (archivos y resumen), qué criterio de
aceptación se verificó y cómo, y cualquier desviación del plan original con
su justificación. Si alguna etapa reveló que un supuesto del diagnóstico
(README.md) era incorrecto, dilo explícitamente — no lo ajustes en silencio.
