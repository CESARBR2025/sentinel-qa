# Contexto — Captura estructurada de Armas Aseguradas (Fiscalía) → auto-sync a Formato N

## De dónde viene esto

Durante una sesión de depuración del stepper de Formato N (`/envio-de-formatos/reporte/[fecha]`)
se corrigieron varios bugs de sincronización en el paso 1 (Eventos) y el paso 4 (RND):
información duplicada por sync con clave parcial, store sin reset entre fechas,
mensajes de confirmación cruzados entre pasos. Al revisar el paso 7 (Armas de
Fuego Aseguradas) — el único paso que sigue siendo 100% captura manual — el
usuario preguntó por qué, y de ahí salió este plan.

## Diagnóstico: no hay fuente estructurada, en ningún lado del sistema

Se verificó exhaustivamente contra la BD real (no se asumió nada — ver regla de
oro del proyecto en `AGENTS.md`: "BD real sobre documentación"):

```sql
-- Búsqueda de columnas relacionadas en TODO el esquema public
SELECT table_name, column_name, data_type FROM information_schema.columns
WHERE column_name ILIKE '%arma%' OR column_name ILIKE '%matricul%' OR column_name ILIKE '%calibre%'
```

Resultado — las únicas columnas que existen:

| Tabla | Columna | Qué es |
|---|---|---|
| `ofi_reportes_campo` | `ofi_hay_arma_fuego` (bool), `ofi_armas_fuego` (jsonb) | Reporte de campo del oficial. El jsonb trae `{fecha, datos, cartuchos, observaciones, nombreSeguimiento}` — `datos` es **texto libre**, no separa tipo/marca/matrícula/calibre. Confirmado en `lib/oficial/types.ts:276` (`OfiArmaFuego`) y que **nunca** se estructura al guardarse (`lib/oficial/service.ts:192`: `JSON.parse(str(formData, 'ofi_armas_fuego'))`). |
| `ofi_reportes_campo` | `ofi_hay_arma_blanca`, `ofi_armas_blancas` | Igual, para arma blanca. Fuera de alcance de este plan (solo arma de fuego, que es lo que pide Formato N paso 7). |
| `formato_n_armas_aseguradas` | `tipo_arma`, `matricula`, `calibre` | La tabla del propio Formato N — el destino, no una fuente. |

`evidencias_detenido` (la tabla detrás de la sección "Fotos de Objetos y
Armamento" en `components/fiscalia/FotosExpedienteSection.tsx:139`, insertada
por `insertarFotoFiscalia` en `lib/fiscalia/repository.ts:543`) solo guarda
`reporte_campo_id, tipo_foto, url_archivo, nombre_archivo, subido_por,
detenido_index, tipo_contenido` — es **solo la foto**, ninguna columna de texto
para el arma.

El D1 (`ofi_reporte_denuncia`, ~60 columnas revisadas completas) no tiene
ninguna columna de arma, pero sí `num_carpeta_investigacion` — dato real,
estructurado, y hoy sin usar en Formato N (el paso 7 pide "Carpeta de
Investigación" como campo manual).

**Evidencia adicional de que el problema ya se intentó resolver y no se pudo:**
existe una función muerta, `obtenerArmasParaFormatoN` en
`lib/reportes/formato-n-armas-aseguradas-service.ts:13`, que intenta sacar
armas del jsonb del oficial concatenando `datos` + `cartuchos` en un solo
string. **Nunca se invoca desde ningún lado** (confirmado con grep en todo el
repo) — quedó como código muerto, probablemente porque el resultado no era
suficientemente preciso para un reporte oficial a Coordinación.

## Decisión de negocio (confirmada con el usuario en esta sesión)

1. **La captura estructurada vive en Fiscalía, no en el reporte de campo del
   oficial.** Cuando el reporte llega a Fiscalía, el agente ya sube fotos del
   arma asegurada (`FotosExpedienteSection.tsx`) — es el punto donde alguien
   revisa el arma con calma y puede anotar tipo/marca/matrícula/calibre con
   precisión, no en campo bajo presión al momento de la detención.
2. **Un reporte de campo puede tener varias armas aseguradas.** La
   infraestructura nueva debe soportar N filas por `reporte_campo_id`, igual
   que ya soporta el jsonb actual del oficial (que es un array).

## Patrón a replicar — ya existe casi 1:1 en el código

`lib/fiscalia` ya tiene un módulo con exactamente esta forma: una lista
repetible por `reporte_campo_id`, capturada por el agente de Fiscalía, con
alta y baja simples. Es `AntecedenteExterno` ("Antecedentes Externos" —
delitos/faltas previas del detenido en otras jurisdicciones):

| Capa | Archivo | Qué hace |
|---|---|---|
| Tipos | `lib/fiscalia/types.ts:149` `AntecedenteExterno`, `:160` `AntecedenteExternoInput` | Forma de una fila y de su input |
| Mapper | `lib/fiscalia/mapper.ts` `rowToAntecedenteExterno` | `Record<string,unknown>` de BD → tipo |
| Repository | `lib/fiscalia/repository.ts:668-695` `listarAntecedentesExternos`, `insertarAntecedenteExterno`, `eliminarAntecedenteExterno` | SQL directo contra `antecedentes_externos_detenido` (FK `reporte_campo_id`) |
| Service | `lib/fiscalia/service.ts:157-171` | Wrapper delgado, sin lógica extra |
| Actions | `lib/fiscalia/actions.ts:542-602` `listarAntecedentesExternosAction`, `agregarAntecedenteExternoAction`, `eliminarAntecedenteExternoAction` | `'use server'`, valida sesión + `verificarRolFiscalia`, `revalidatePath` |
| UI | `components/fiscalia/AntecedentesExternos.tsx` | Lista + botón "Agregar" + form inline + eliminar. Recibe `reporteCampoId` y `readOnly` |
| Montaje | `components/fiscalia/FormularioAsegurado.tsx:940` | `<AntecedentesExternos reporteCampoId={reporteCampoId} readOnly={readOnly} />`, dentro de la página `app/fiscalia/asegurados/[id]/page.tsx` |

Este plan clona ese patrón completo para "Armas Aseguradas" — mismas capas,
mismos archivos (extendidos, no duplicados como módulo nuevo), mismo punto de
montaje.

## Patrón de sync a Formato N — también ya existe, construido esta misma sesión

Para que el paso 7 deje de ser 100% manual, se sincroniza igual que Eventos
(paso 1) y RND (paso 4), que ya pasaron por el mismo problema de raíz
(duplicados por sync con clave de campos en vez de por id de origen) y ya
tienen la solución correcta y probada:

- `lib/reportes/formato-n-eventos-service.ts`: función `upsertEventoDesdeIncidente`
  — `INSERT ... ON CONFLICT (origen_incidente_id) WHERE origen_incidente_id IS NOT NULL
  DO UPDATE SET ...`. Columna `origen_incidente_id` (uuid nullable) + índice
  único parcial, migración `lib/db/manual-migrations/0047_formato_n_origen_sync.sql`.
- `eliminarDuplicadosEventosDelDia` (mismo archivo): limpieza autocurativa que
  corre en cada sync, **en dos pasos, en este orden exacto**:
  1. Primero borra huérfanos-por-origen (fila vieja sin `origen_incidente_id`
     cuando ya existe una fila enlazada con los mismos campos clave).
  2. Después borra duplicados exactos por campos (fallback para casos sin
     enlace de origen).

  **El orden importa y ya causó un bug real en esta sesión**: si el paso 2
  corre antes que el paso 1, y los campos visibles coinciden entre la fila
  huérfana y la enlazada, el desempate por `creado_en` más antiguo del paso 2
  se queda con la huérfana y borra la fila recién enlazada — al revés de lo
  que se quiere. Ver `boveda/🗺 Roadmap/Troubleshooting.md`, entrada
  "Formato N (stepper) — paso 1 (Eventos) y paso 4 (RND) seguían duplicando
  filas después del fix de `origen_incidente_id`/`origen_reporte_campo_id`".
  **Replicar el mismo orden para armas.**
- `lib/reportes/formato-n-store.ts` (`cargar`): dispara la sincronización de
  eventos y RND en paralelo (`Promise.all`) al abrir el reporte del día, antes
  de pedir el consolidado.
- `app/envio-de-formatos/reporte/[fecha]/page.tsx` (`PasoEventos`, `PasoRnd`):
  muestran una tabla de solo lectura con lo ya sincronizado — ningún botón de
  "agregar" manual en esos pasos.

Para Armas, el paso 7 **no** se vuelve puramente de solo lectura como Eventos/RND
— se mantiene el form manual existente debajo de la tabla auto-sincronizada,
porque Fiscalía puede no haber procesado todavía el caso cuando se arma el
reporte del día (a diferencia de Eventos/RND, que salen de fuentes que existen
desde el momento del incidente).

## Fuera de alcance

- Arma blanca (`ofi_hay_arma_blanca`/`ofi_armas_blancas`) — Formato N paso 7 solo
  pide armas de fuego.
- Tocar `FotosExpedienteSection.tsx` o el flujo `/fiscalia/solicitudes/[solicitudId]`
  — la captura estructurada vive en `/fiscalia/asegurados/[id]`, la foto se
  queda donde está.
- Vincular la foto de `evidencias_detenido` con la fila estructurada de arma
  (podría hacerse después, no es necesario para que Formato N tenga datos
  precisos).
- Cambiar la lógica de negocio de FGE/FGR/Eventos/RND — ya están corregidas en
  esta misma sesión, no se tocan aquí.
