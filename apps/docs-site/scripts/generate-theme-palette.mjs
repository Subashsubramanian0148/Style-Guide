/**
 * Builds theme-palette.css from public palette SCSS sources.
 * Primitives: Color pallete.scss
 * Semantics: Format to follow naming.scss (compiled from base color maps)
 * Theme-prefixed aliases (--theme-*) are generated from expanded semantic tokens.
 */
import { readFileSync, writeFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import * as sass from "sass";

const publicDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../public");
const outFile = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../src/theme-palette.css");
const expandedSemanticFile = path.join(publicDir, "Format.expanded.css");

const primitivesFile = path.join(publicDir, "Color pallete.scss");
const semanticFile = path.join(publicDir, "Format to follow naming.scss");

let primitives = readFileSync(primitivesFile, "utf-8");
primitives = primitives.replace(/\n@import\s+"Format(?:\.expanded\.css| to follow naming\.scss)";\s*$/, "\n");

const compiledSemantics = sass.compile(semanticFile, { style: "expanded" }).css.trim();
writeFileSync(expandedSemanticFile, `${compiledSemantics}\n`);
console.log("Wrote", expandedSemanticFile);

const SEMANTIC_PREFIXES = ["brand", "secondary", "tertiary", "neutral", "semantics"];

function extractCustomProperties(css) {
  const props = new Set();
  const re = /^\s*--([a-z0-9-]+):/gm;
  let match;
  while ((match = re.exec(css)) !== null) {
    const name = match[1];
    if (name.startsWith("theme-")) continue;
    if (SEMANTIC_PREFIXES.some((prefix) => name.startsWith(`${prefix}-`))) {
      props.add(name);
    }
  }
  return [...props].sort();
}

function themeAliasName(sourceName) {
  if (sourceName.startsWith("brand-")) {
    return `theme-${sourceName}`;
  }
  if (sourceName.startsWith("secondary-")) {
    return `theme-${sourceName}`;
  }
  if (sourceName.startsWith("tertiary-")) {
    return `theme-${sourceName}`;
  }

  if (sourceName.startsWith("neutral-")) {
    const neutralMap = {
      "neutral-text-default": "theme-neutral-text-primary-default",
      "neutral-text-subtle": "theme-neutral-text-subtle",
      "neutral-text-subtle-light": "theme-neutral-text-subtle-least",
      "neutral-text-on-color": "theme-neutral-text-on-color",
      "neutral-border-subtle": "theme-neutral-border-subtle",
      "neutral-border-light": "theme-neutral-border-light",
      "neutral-border-strong": "theme-neutral-border-strong",
      "neutral-border-inverse": "theme-neutral-border-inverse",
    };
    return neutralMap[sourceName] ?? `theme-${sourceName}`;
  }

  if (sourceName.startsWith("semantics-")) {
    const backgroundLight = sourceName.match(/^semantics-(critical|highlight|success|warning)-background-light$/);
    if (backgroundLight) {
      return `theme-semantics-${backgroundLight[1]}-light-background`;
    }
    const backgroundStrong = sourceName.match(/^semantics-(critical|highlight|success|warning)-background-strong$/);
    if (backgroundStrong) {
      return `theme-semantics-${backgroundStrong[1]}-strong-background`;
    }
    return `theme-${sourceName}`;
  }

  return `theme-${sourceName}`;
}

function buildThemeAliasBlock(sourceNames) {
  const aliases = new Map();

  for (const sourceName of sourceNames) {
    aliases.set(themeAliasName(sourceName), sourceName);
  }

  aliases.set("theme-neutral-border-primary-default", "neutral-border-light");
  aliases.set("theme-neutral-text-subtleleast", "neutral-text-subtle-light");
  aliases.set("theme-neutral-text-oncolor", "neutral-text-on-color");
  aliases.set("theme-semantics-critical-background-light", "semantics-critical-background-light");
  aliases.set("theme-semantics-critical-background-strong", "semantics-critical-background-strong");
  aliases.set("theme-semantics-highlight-background-light", "semantics-highlight-background-light");
  aliases.set("theme-semantics-highlight-background-strong", "semantics-highlight-background-strong");
  aliases.set("theme-semantics-success-background-light", "semantics-success-background-light");
  aliases.set("theme-semantics-success-background-strong", "semantics-success-background-strong");
  aliases.set("theme-semantics-warning-background-light", "semantics-warning-background-light");
  aliases.set("theme-semantics-warning-background-strong", "semantics-warning-background-strong");

  const lines = [...aliases.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([alias, source]) => `  --${alias}: var(--${source});`);

  lines.push('  --brand-text-primaryhover: var(--brand-text-primary-hover);');

  // Each alias is just `var(--source)` indirection, so it picks up whatever
  // mode-specific value --source already resolves to — but only on elements
  // where the alias itself is (re)declared. Previously this block only ever
  // rendered under the light-mode selector, so in dark mode every
  // --theme-neutral-*/--theme-brand-*/etc. alias fell through via
  // inheritance to its light-mode value instead of tracking --source's dark
  // value. Emitting the identical alias list again under the dark selector
  // fixes that without needing separate dark values.
  const lightBlock = [
    ":root,",
    'html[data-site-mode="light"],',
    '[data-mode="light"] {',
    "  /* Theme-prefixed aliases (auto-generated — do not edit by hand) */",
    ...lines,
    "}",
  ].join("\n");

  const darkBlock = [
    'html[data-site-mode="dark"],',
    '[data-mode="dark"] {',
    "  /* Theme-prefixed aliases (auto-generated — do not edit by hand) */",
    ...lines,
    "}",
  ].join("\n");

  return `${lightBlock}\n\n${darkBlock}`;
}

const themeAliases = buildThemeAliasBlock(extractCustomProperties(compiledSemantics));
const css = `${primitives.trim()}\n\n${compiledSemantics}\n\n${themeAliases}\n`;

writeFileSync(outFile, css);
console.log("Wrote", outFile);
