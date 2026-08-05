# Etapa 2 — Navegación: card en el hub `/formatos-udai`

Depende de Etapa 1 (solo para que la ruta destino exista después de la Etapa 3; esta etapa por sí sola no necesita datos, solo agrega el link).

## Archivo a modificar

`app/formatos-udai/page.tsx` — agregar una segunda `OptionSquare` dentro del `<div className="cat-cards-grid">` ya existente (línea ~33). No tocar la card de "Formato Faltas Administrativas" que ya está ahí.

```tsx
<div className="cat-cards-grid">
  <OptionSquare
    titulo="Formato Faltas Administrativas"
    subtitulo="Bitácora de detenidos por falta administrativa, en el formato oficial UDAI, exportable a Excel."
    icono={<FileSpreadsheet size={28} />}
    enlace="/formatos-udai/faltas-administrativas"
    estadisticas={[]}
  />
  <OptionSquare
    titulo="Formato Reportes de Incidencias"
    subtitulo="Bitácora de incidentes y puestas a disposición, en el formato oficial UDAI, exportable a Excel."
    icono={<FileSpreadsheet size={28} />}
    enlace="/formatos-udai/reportes-incidencias"
    estadisticas={[]}
  />
</div>
```

No se necesita importar nada nuevo (`FileSpreadsheet` y `OptionSquare` ya están importados en el archivo).

## Criterios de aceptación

1. `npx tsc --noEmit` sin errores.
2. La card nueva aparece junto a la existente en `/formatos-udai` (verificación visual la hace el usuario).

Detenerse aquí y esperar confirmación antes de pasar a Etapa 3.
