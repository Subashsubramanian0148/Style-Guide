import { readFileSync, writeFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const file = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../src/styles/components.css");
let css = readFileSync(file, "utf-8");

const colorMap = {
  "core-color-neutral-200": "theme-colors-neutral-200",
  "core-color-neutral-400": "theme-colors-neutral-400",
  "core-color-neutral-800": "theme-colors-neutral-800",
  "core-color-success-100": "theme-colors-success-100",
  "core-color-success-600": "theme-colors-success-600",
  "core-color-success-700": "theme-colors-success-700",
  "core-color-warning-100": "theme-primitive-color-tertiary-100",
  "core-color-warning-600": "theme-primitive-color-tertiary-600",
  "core-color-warning-700": "theme-primitive-color-tertiary-700",
  "core-color-danger-100": "theme-colors-red-100",
  "core-color-danger-600": "theme-colors-red-600",
  "core-color-danger-700": "theme-colors-red-700",
  "core-color-info-100": "theme-colors-info-100",
  "core-color-info-600": "theme-colors-info-600",
  "core-color-info-700": "theme-colors-info-700",
  "core-button-primary-bg": "brand-background-primary-strong",
  "core-button-primary-text": "brand-text-primary-oncolor",
  "core-button-primary-bgHover": "brand-background-primary-hover",
  "core-button-primary-bgActive": "brand-background-primary-active",
  "core-color-action-primary-disabled-bg": "brand-background-primary-disabled",
  "core-color-action-primary-disabled-border": "brand-border-primary-disabled",
  "core-button-destructive-bg": "theme-semantics-critical-strong-background",
  "core-button-destructive-bgHover": "theme-semantics-critical-text",
  "core-color-action-destructive-disabled-bg": "theme-semantics-critical-border",
  "core-color-action-destructive-disabled-text": "theme-colors-red-800",
  "core-color-action-destructive-disabled-border": "theme-semantics-critical-border",
  "core-color-control-disabled-text": "theme-neutral-text-subtleleast",
  "core-color-control-disabled-border": "theme-neutral-border-primary-default",
  "core-color-action-tertiary-text": "brand-text-primary-default",
  "core-color-action-tertiary-textHover": "brand-text-primary-hover",
};

for (const [from, to] of Object.entries(colorMap)) {
  css = css.replaceAll(`var(--${from},`, `var(--${to},`);
  css = css.replaceAll(`var(--${from})`, `var(--${to})`);
}

css = css.replace(
  "font-family: var(--core-font-family-base);",
  "font-family: var(--typography-font-family-sans);"
);

css = css.replaceAll(
  "var(--core-typography-text14Regular-lineHeight, 1.5)",
  "var(--typography-text14-regular-line-height)"
);
css = css.replaceAll(
  "var(--core-typography-text16Regular-lineHeight, 1.5)",
  "var(--typography-text16-regular-line-height)"
);

// Flatten nested var(brand, var(core, #hex)) → var(brand)
css = css.replace(/var\((--(?:theme|brand)-[^,)]+),\s*var\(--[^)]+\)\)/g, "var($1)");

// Remove remaining hex fallbacks on theme/brand vars
css = css.replace(/var\((--(?:theme|brand)-[^,)]+),\s*#[0-9A-Fa-f]{3,8}\)/g, "var($1)");
css = css.replace(/var\((--(?:theme|brand)-[^,)]+),\s*var\(--[^,)]+,\s*#[0-9A-Fa-f]{3,8}\)\)/g, "var($1)");

writeFileSync(file, css);
console.log("Pass 2 complete");
