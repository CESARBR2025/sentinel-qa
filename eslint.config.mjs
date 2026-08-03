import { defineConfig, globalIgnores } from "eslint/config";
import { readFileSync } from "node:fs";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

// ─────────────────────────────────────────────────────────────────────────────
// REGLA Responsive (bóveda → Convenciones → "Responsive (REGLA)").
//
// `responsive/no-inline-multicol-grid`: prohíbe gridTemplateColumns inline
// multi-columna (se debe usar .grid-2/.grid-3 o una clase responsive).
// El allowlist scripts/responsive/exceptions.json (patrón gridMulticol) contiene
// la deuda actual: archivos fuera del allowlist → ERROR (bloquea código nuevo);
// archivos en el allowlist → se omiten (la deuda se ve en `npm run check:responsive`).
// ─────────────────────────────────────────────────────────────────────────────

let gridAllowlist = [];
try {
  const raw = JSON.parse(
    readFileSync(new URL("./scripts/responsive/exceptions.json", import.meta.url), "utf8"),
  );
  gridAllowlist = Array.isArray(raw) ? raw : (raw.gridMulticol ?? []);
} catch {
  gridAllowlist = [];
}
const gridAllowlistSet = new Set(gridAllowlist);

// ¿El valor de gridTemplateColumns tiene más de una columna?
// '1fr', 'minmax(0, 1fr)', 'none' → permitido. '1fr 1fr', 'repeat(2, 1fr)' → violación.
function esMulticolumna(valor) {
  if (!valor || typeof valor !== "string") return false;
  if (valor.includes("repeat(")) {
    const m = valor.match(/repeat\(\s*(\d+)/);
    if (m && Number(m[1]) > 1) return true;
    if (/repeat\(\s*(auto-fill|auto-fit)/.test(valor)) return true;
    return false;
  }
  const sinFn = valor
    .replace(/minmax\([^)]*\)/g, "x")
    .replace(/calc\([^)]*\)/g, "x")
    .replace(/var\([^)]*\)/g, "x")
    .replace(/fit-content\([^)]*\)/g, "x");
  return sinFn.trim().split(/\s+/).filter(Boolean).length > 1;
}

const responsivePlugin = {
  rules: {
    "no-inline-multicol-grid": {
      meta: {
        type: "problem",
        docs: {
          description:
            "Prohíbe gridTemplateColumns inline multi-columna; usa .grid-2/.grid-3 o una clase responsive",
        },
        messages: {
          useGridClass:
            "Grid inline multi-columna: usa la clase `.grid-2`/`.grid-3` (o una clase responsive) en vez de `gridTemplateColumns` inline. Ver bóveda → Convenciones → Responsive (REGLA).",
        },
        schema: [],
      },
      create(context) {
        const file = context.filename ?? context.getFilename();
        const rel = file.startsWith(process.cwd())
          ? file.slice(process.cwd().length + 1)
          : file;
        // Deuda ya permitida: no reportar aquí (la revisa la auditoría).
        if (gridAllowlistSet.has(rel)) return {};

        return {
          JSXAttribute(node) {
            if (node.name.type !== "JSXIdentifier" || node.name.name !== "style") return;
            const expr = node.value;
            if (!expr || expr.type !== "JSXExpressionContainer") return;
            const obj = expr.expression;
            if (!obj || obj.type !== "ObjectExpression") return;

            for (const prop of obj.properties) {
              if (prop.type !== "Property" || prop.computed) continue;
              const key = prop.key;
              if (key.type !== "Identifier" && key.type !== "Literal") continue;
              const name = key.type === "Identifier" ? key.name : key.value;
              if (name !== "gridTemplateColumns") continue;
              const val = prop.value;
              if (!val || val.type !== "Literal" || typeof val.value !== "string") continue;
              if (!esMulticolumna(val.value)) continue;
              context.report({ node: prop, messageId: "useGridClass" });
            }
          },
        };
      },
    },
  },
};

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    plugins: { responsive: responsivePlugin },
    rules: { "responsive/no-inline-multicol-grid": "error" },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Mockups de diseño, no son vistas de la app.
    "login-desing/**",
  ]),
]);

export default eslintConfig;
