/**
 * Generates CSS custom properties from apps/docs-site/public/typography.json.
 * Source of truth for component typography — do not hand-edit typography-tokens.css.
 */
import { readFileSync, writeFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const source = path.join(root, "public/typography.json");
const out = path.join(root, "src/typography-tokens.css");

const data = JSON.parse(readFileSync(source, "utf-8"));
const lines = [
  "/**",
  " * AUTO-GENERATED from public/typography.json — run: npm run typography:tokens",
  " * Do not edit manually.",
  " */",
  ":root {",
];

function add(name, value) {
  lines.push(`  --typography-${name}: ${value};`);
}

const fontStack = (name) =>
  `"${name}", -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif`;

if (data.fontFamily?.sans) {
  add("font-family-sans", fontStack(data.fontFamily.sans));
}
if (data.fontFamily?.mono) {
  add("font-family-mono", fontStack(data.fontFamily.mono));
}

/* Aliases used by CORE components and typography previews */
lines.push("  --core-font-family-base: var(--typography-font-family-sans);");
lines.push("  --core-font-family-mono: var(--typography-font-family-mono);");

for (const [key, weight] of Object.entries(data.fontWeight ?? {})) {
  add(`font-weight-${key}`, String(weight));
}

for (const [key, spec] of Object.entries(data.fontSize ?? {})) {
  add(`font-size-${key}`, spec.rem);
  add(`font-size-${key}-px`, `${spec.px}px`);
}

for (const [key, spec] of Object.entries(data.headings ?? {})) {
  add(`heading-${key}-size`, spec.fontSize.rem);
  add(`heading-${key}-line-height`, spec.lineHeight.rem);
  add(`heading-${key}-letter-spacing`, spec.letterSpacing.rem);
  add(`heading-${key}-weight`, String(spec.fontWeight));
}

for (const [key, spec] of Object.entries(data.body ?? {})) {
  add(`body-${key}-size`, spec.fontSize.rem);
  add(`body-${key}-line-height`, spec.lineHeight.rem);
  add(`body-${key}-letter-spacing`, spec.letterSpacing.rem);
  add(`body-${key}-weight`, String(spec.fontWeight));
}

for (const role of ["label", "caption", "helper", "eyebrow", "link", "placeholder"]) {
  const spec = data[role];
  if (!spec) continue;
  add(`${role}-size`, spec.fontSize.rem);
  add(`${role}-line-height`, spec.lineHeight.rem);
  add(`${role}-letter-spacing`, spec.letterSpacing.rem);
  add(`${role}-weight`, String(spec.fontWeight));
}

for (const [key, spec] of Object.entries(data.button ?? {})) {
  add(`button-${key}-size`, spec.fontSize.rem);
  add(`button-${key}-line-height`, spec.lineHeight.rem);
  add(`button-${key}-letter-spacing`, spec.letterSpacing.rem);
  add(`button-${key}-weight`, String(spec.fontWeight));
}

/* Legacy aliases used across component CSS */
add("text14-regular-size", data.body?.md?.fontSize?.rem ?? "0.875rem");
add("text14-regular-line-height", data.body?.md?.lineHeight?.rem ?? "1.3125rem");
add("text14-regular-weight", String(data.body?.md?.fontWeight ?? 400));
add("text14-semibold-size", data.button?.md?.fontSize?.rem ?? "0.875rem");
add("text14-semibold-line-height", data.button?.md?.lineHeight?.rem ?? "1.3125rem");
add("text14-semibold-weight", String(data.button?.md?.fontWeight ?? 700));
add("text16-regular-size", data.body?.lg?.fontSize?.rem ?? "1rem");
add("text16-regular-line-height", data.body?.lg?.lineHeight?.rem ?? "1.5rem");
add("text16-regular-weight", String(data.body?.lg?.fontWeight ?? 400));
add("text16-semibold-size", data.button?.lg?.fontSize?.rem ?? "1rem");
add("text16-semibold-line-height", data.button?.lg?.lineHeight?.rem ?? "1.5rem");
add("text16-semibold-weight", String(data.button?.lg?.fontWeight ?? 700));
add("text12-semibold-size", data.fontSize?.xs?.rem ?? "0.75rem");
add("text12-semibold-line-height", data.body?.xs?.lineHeight?.rem ?? "1.125rem");
add("text12-semibold-weight", String(data.fontWeight?.semibold ?? 600));

lines.push("}");

lines.push("");
lines.push("html,");
lines.push("body,");
lines.push("button,");
lines.push("input,");
lines.push("select,");
lines.push("textarea,");
lines.push("optgroup {");
lines.push("  font-family: var(--typography-font-family-sans);");
lines.push("  font-synthesis: weight style;");
lines.push("}");

writeFileSync(out, lines.join("\n") + "\n");
console.log(`Wrote ${out}`);
