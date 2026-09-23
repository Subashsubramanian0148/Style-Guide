/**
 * Aligns components.css color/typography references to palette SCSS + typography.json tokens.
 */
import { readFileSync, writeFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const file = path.resolve(__dirname, "../src/styles/components.css");
let css = readFileSync(file, "utf-8");

const replacements = [
  // Typography: core token build → public typography.json generated vars
  ["var(--core-typography-text14SemiBold-size, 14px)", "var(--typography-text14-semibold-size)"],
  ["var(--core-typography-text14SemiBold-lineHeight, var(--core-font-lineHeight-normal))", "var(--typography-text14-semibold-line-height)"],
  ["var(--core-typography-text14SemiBold-weight, var(--core-button-fontWeight))", "var(--typography-text14-semibold-weight)"],
  ["var(--core-typography-text14SemiBold-size, 14px)", "var(--typography-text14-semibold-size)"],
  ["var(--core-typography-text14SemiBold-lineHeight, var(--core-font-lineHeight-normal))", "var(--typography-text14-semibold-line-height)"],
  ["var(--core-typography-text12SemiBold-size, 12px)", "var(--typography-text12-semibold-size)"],
  ["var(--core-typography-text12SemiBold-lineHeight, var(--core-font-lineHeight-normal))", "var(--typography-text12-semibold-line-height)"],
  ["var(--core-typography-text16SemiBold-size, 16px)", "var(--typography-text16-semibold-size)"],
  ["var(--core-typography-text16SemiBold-lineHeight, var(--core-font-lineHeight-normal))", "var(--typography-text16-semibold-line-height)"],
  ["var(--core-typography-text14Regular-size, 14px)", "var(--typography-text14-regular-size)"],
  ["var(--core-typography-text14Regular-lineHeight, var(--core-font-lineHeight-normal))", "var(--typography-text14-regular-line-height)"],
  ["var(--core-typography-text16Regular-size, 16px)", "var(--typography-text16-regular-size)"],
  ["var(--core-typography-text16Regular-lineHeight, var(--core-font-lineHeight-normal))", "var(--typography-text16-regular-line-height)"],
  ["var(--core-font-size-sm)", "var(--typography-body-md-size)"],
  ["var(--core-font-size-md)", "var(--typography-body-lg-size)"],
  ["var(--core-font-size-xs)", "var(--typography-font-size-xs)"],
  ["var(--core-font-size-lg)", "var(--typography-font-size-lg)"],

  // Bare colors → palette primitives/semantics
  ["color: #FFFFFF;", "color: var(--theme-neutral-text-on-color);"],
  ["background: #731922;", "background: var(--theme-colors-red-800);"],
  ["border-color: #731922;", "border-color: var(--theme-colors-red-800);"],
  ["background: #0E5233;", "background: var(--theme-colors-success-800);"],
  ["background: #784708;", "background: var(--theme-primitive-color-tertiary-800);"],
  ["background: #103E69;", "background: var(--theme-colors-info-800);"],

  // Bare typography px
  [".cds-dropzone-icon {\n  font-size: 20px;", ".cds-dropzone-icon {\n  font-size: var(--typography-font-size-lg);"],
  [".cds-attachment-remove {\n  font-size: 16px;", ".cds-attachment-remove {\n  font-size: var(--typography-body-lg-size);"],
  [".cds-input-icon {\n  font-size: 14px;", ".cds-input-icon {\n  font-size: var(--typography-body-md-size);"],
];

for (const [from, to] of replacements) {
  css = css.split(from).join(to);
}

// Strip hex fallbacks from theme/brand vars (palette is always loaded at runtime)
css = css.replace(/var\((--theme-[^,)]+),\s*#[0-9A-Fa-f]{3,8}\)/g, "var($1)");
css = css.replace(/var\((--brand-[^,)]+),\s*#[0-9A-Fa-f]{3,8}\)/g, "var($1)");

const header = `/* CORE component primitives — colors from Color pallete.scss (--theme-* / --brand-*)
   Typography from public/typography.json (--typography-* via typography-tokens.css) */

`;

if (!css.startsWith("/* CORE component primitives — colors from Color pallete.scss")) {
  css = css.replace(/^\/\* CORE component primitives[^*]*\*\/\s*\n/, header);
}

writeFileSync(file, css);
console.log("Aligned", file);
