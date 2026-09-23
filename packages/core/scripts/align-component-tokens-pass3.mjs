import { readFileSync, writeFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const file = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../src/styles/components.css");
let css = readFileSync(file, "utf-8");

const semanticColors = {
  "core-color-text-primary": "theme-neutral-text-primary-default",
  "core-color-text-secondary": "theme-neutral-text-subtle",
  "core-color-text-tertiary": "theme-neutral-text-subtleleast",
  "core-color-border-default": "theme-neutral-border-primary-default",
  "core-color-border-strong": "theme-neutral-border-strong",
  "core-color-surface-sunken": "theme-colors-neutral-100",
  "core-color-surface-raised": "theme-colors-neutral-0",
  "core-color-action-secondary-bg": "theme-brand-background-primary-subtle",
  "core-color-action-destructive-bg": "theme-semantics-critical-strong-background",
  "core-color-status-danger-bg": "theme-semantics-critical-light-background",
  "core-card-bg": "theme-colors-neutral-0",
  "core-card-border": "theme-neutral-border-primary-default",
  "core-input-border": "theme-neutral-border-primary-default",
  "core-input-bg": "theme-colors-neutral-0",
  "core-input-text": "theme-neutral-text-primary-default",
  "core-input-placeholder": "theme-neutral-text-subtleleast",
  "core-focusRing-color": "theme-primitive-color-primary-400",
};

for (const [from, to] of Object.entries(semanticColors)) {
  css = css.replaceAll(`var(--${from})`, `var(--${to})`);
  css = css.replaceAll(`var(--${from},`, `var(--${to},`);
}

css = css.replaceAll("var(--core-font-size-xs, 12px)", "var(--typography-font-size-xs)");
css = css.replaceAll("var(--core-font-size-sm, 14px)", "var(--typography-body-md-size)");
css = css.replaceAll("var(--core-font-size-md, 16px)", "var(--typography-body-lg-size)");
css = css.replaceAll("var(--core-font-weight-medium)", "var(--typography-font-weight-medium)");
css = css.replaceAll("var(--core-font-weight-semibold)", "var(--typography-font-weight-semibold)");

writeFileSync(file, css);
console.log("Pass 3 complete");
