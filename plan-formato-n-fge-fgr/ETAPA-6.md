# Etapa 6 — Verificación end-to-end completa

## Objetivo

Confirmar, con datos reales de la base de desarrollo (no solo lectura de
código), que las 5 etapas anteriores dejaron el flujo completo funcionando de
punta a punta — desde capturar un día nuevo hasta descargar su `.docx` — y
que ninguno de los bugs del [diagnóstico](README.md) sigue presente.

## Guion de prueba (ejecutar en orden, sobre una fecha de prueba nueva)

1. **Entrar a `/envio-de-formatos/consolidar` sin tocar nada.**
   - Confirmar que carga el día de hoy automáticamente, sin clic previo.
   - Confirmar que el día de hoy aparece como una sola card, estatus
     PENDIENTE (si no se ha capturado nada aún).
2. **Completar el reporte de un día de prueba con actividad real en la base**
   (reportes de campo / D1 / incidentes de ese día), vía el stepper
   (`/envio-de-formatos/reporte/<fecha>`):
   - Paso Eventos: agregar al menos un evento manual.
   - Paso FGE: usar el precálculo asistido, editar manualmente uno de los
     valores calculados (simula una corrección del operador), llenar los
     campos 100% manuales (audiencias, etc.).
   - Paso FGR: confirmar que sigue mostrando el criterio 100% manual (sin
     intento de cálculo automático), llenar valores de prueba.
   - Paso RND: agregar al menos un registro.
   - Paso MASC: llenar valores de prueba.
   - Paso Víctimas: llenar valores de prueba.
   - Paso Armas: usar el precálculo si hay armas en reportes de campo de esa
     fecha, o confirmar "sin novedad" si no hay.
   - Paso Observaciones: escribir un texto de prueba.
   - Confirmar que tras el último paso el día pasa a LISTO en
     `/envio-de-formatos/consolidar` sin recargar manualmente la página.
3. **Descargar el documento.**
   - Desde la card LISTO, descargar el `.docx`.
   - Abrir el archivo y confirmar que las 8 tablas (A-H) muestran
     exactamente lo capturado en el paso 2 — incluida la corrección manual de
     FGE y los valores 100% manuales de FGR.
4. **Editar un día ya LISTO.**
   - Volver a `/envio-de-formatos/consolidar`, clic en "Editar" sobre el día
     recién completado.
   - Cambiar un valor en cualquier paso, confirmar, volver a descargar el
     Word y confirmar que el cambio se refleja — y que el día sigue en LISTO
     (no se resetea a PENDIENTE por editar un paso ya confirmado).
5. **Confirmar que ya no hay pérdida de datos ni rutas duplicadas.**
   - `/nCoordinacion` ya no existe.
   - Las 7 páginas sueltas (`/formato-n-fge`, etc.) ya no existen.
   - `grep -rn "obtenerConteosDetenidos\|obtenerEventosDia\|obtenerRND\|obtenerArmasDia"`
     en todo el repo no devuelve resultados.
6. **Regresión de navegación.**
   - Desde `/agente_reportes`, confirmar que no hay ningún enlace roto (la
     card "Grupo de Coordinación" ya no aparece; el enlace a Formato N lleva
     directo al flujo nuevo en `/envio-de-formatos/consolidar`).

## Criterios de aceptación

- Los 6 pasos del guion pasan sin discrepancias entre lo capturado y lo que
  muestra el documento final.
- `npx tsc --noEmit` y `npm run build` sin errores en todo el proyecto (no
  solo en los archivos tocados — verificación de cierre de todo el plan).
- Ningún archivo de las Etapas 1-5 quedó a medio aplicar (revisar diff
  completo del plan contra el estado real del repo antes de dar por cerrado).
- `boveda/📦 Datos/Esquema BD.md` refleja la tabla `formato_n_estatus_dia`
  nueva.
