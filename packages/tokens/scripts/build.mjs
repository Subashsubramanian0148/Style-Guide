// Resolves primitive -> semantic -> component tokens into CSS custom properties
// per theme (core / meridian / clientb) and per mode (light / dark).
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const themesDir = path.resolve(root, "../themes/src");

const primitives = JSON.parse(readFileSync(path.join(root, "src/primitives.json"), "utf-8"));
const semantic = JSON.parse(readFileSync(path.join(root, "src/semantic.json"), "utf-8"));
const component = JSON.parse(readFileSync(path.join(root, "src/component.json"), "utf-8"));
const typography = JSON.parse(readFileSync(path.join(root, "src/typography.json"), "utf-8"));

function flatten(obj, prefix = "", out = {}) {
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === "object" && !Array.isArray(v)) flatten(v, key, out);
    else out[key] = v;
  }
  return out;
}

const flatPrimitives = flatten(primitives);

// Resolves `{token.path}` references in a value. A value that is *exactly*
// one reference resolves to that token's own value (any type — string,
// number, etc). A value with references *embedded* in a larger string (e.g.
// a gradient's `linear-gradient(135deg, {color.brand.500}, {color.brand.700})`)
// resolves each embedded reference in place — every referenced token must
// itself resolve to a string in that case.
function resolve(value, dict, depth = 0) {
  if (depth > 10) throw new Error(`Reference cycle resolving ${value}`);
  if (typeof value !== "string") return value;
  const fullMatch = value.match(/^\{(.+)\}$/);
  if (fullMatch) {
    const refVal = dict[fullMatch[1]];
    if (refVal === undefined) throw new Error(`Unresolved token reference: {${fullMatch[1]}}`);
    return resolve(refVal, dict, depth + 1);
  }
  if (value.includes("{")) {
    return value.replace(/\{([^{}]+)\}/g, (_, refKey) => {
      const refVal = dict[refKey];
      if (refVal === undefined) throw new Error(`Unresolved token reference: {${refKey}}`);
      const resolved = resolve(refVal, dict, depth + 1);
      if (typeof resolved !== "string") throw new Error(`Cannot embed non-string token {${refKey}} inside a larger value`);
      return resolved;
    });
  }
  return value;
}

function toCssVarName(key) {
  return `--core-${key.replace(/\./g, "-")}`;
}

function buildModeBlock(mode) {
  const semanticMap = semantic[mode];
  const dict = { ...flatPrimitives, ...semanticMap };
  const lines = [];
  for (const [key, raw] of Object.entries(semanticMap)) {
    lines.push(`  ${toCssVarName(key)}: ${resolve(raw, dict)};`);
  }
  for (const [key, raw] of Object.entries(component)) {
    lines.push(`  ${toCssVarName(key)}: ${resolve(raw, dict)};`);
  }
  return lines.join("\n");
}

function buildPrimitiveBlock(overriddenPrimitives) {
  const lines = [];
  for (const [key, value] of Object.entries(overriddenPrimitives)) {
    // Resolved against the primitive scale itself, so a primitive like a
    // gradient that references other primitives (e.g. {color.brand.500})
    // picks up a theme's overridden brand color automatically.
    lines.push(`  ${toCssVarName(key)}: ${resolve(value, overriddenPrimitives)};`);
  }
  // Semantic typography roles (Bootstrap-aligned h1–h6, lead, body, …).
  // Desktop sizes are the canonical CSS vars; mobile is available as
  // --core-typography-{role}-mobile-* for RFS-style media queries.
  for (const [role, spec] of Object.entries(typography)) {
    const family = resolve(spec.family, overriddenPrimitives);
    lines.push(`  ${toCssVarName(`typography.${role}.family`)}: ${family};`);
    for (const bp of ["desktop", "mobile"]) {
      const t = spec[bp];
      lines.push(`  ${toCssVarName(`typography.${role}.${bp}.size`)}: ${t.size};`);
      lines.push(`  ${toCssVarName(`typography.${role}.${bp}.weight`)}: ${t.weight};`);
      lines.push(`  ${toCssVarName(`typography.${role}.${bp}.lineHeight`)}: ${t.lineHeight};`);
      lines.push(`  ${toCssVarName(`typography.${role}.${bp}.letterSpacing`)}: ${t.letterSpacing};`);
    }
    // Convenience aliases — desktop size/weight as the default role tokens
    lines.push(`  ${toCssVarName(`typography.${role}.size`)}: ${spec.desktop.size};`);
    lines.push(`  ${toCssVarName(`typography.${role}.weight`)}: ${spec.desktop.weight};`);
    lines.push(`  ${toCssVarName(`typography.${role}.lineHeight`)}: ${spec.desktop.lineHeight};`);
    lines.push(`  ${toCssVarName(`typography.${role}.letterSpacing`)}: ${spec.desktop.letterSpacing};`);
  }
  return lines.join("\n");
}

const outDir = path.join(root, "dist");
mkdirSync(outDir, { recursive: true });

const themeFiles = readdirSync(themesDir).filter((f) => f.endsWith(".json"));
const themeList = [];

for (const file of themeFiles) {
  const theme = JSON.parse(readFileSync(path.join(themesDir, file), "utf-8"));
  themeList.push({ id: theme.id, label: theme.label, meta: theme.meta });

  const mergedPrimitives = { ...flatPrimitives, ...(theme.overrides || {}) };
  // rebuild semantic/component resolution using the theme's primitive overrides
  function resolveWithTheme(value, extra, depth = 0) {
    if (depth > 10) throw new Error(`Reference cycle resolving ${value}`);
    if (typeof value !== "string") return value;
    const lookup = (refKey) => (extra[refKey] !== undefined ? extra[refKey] : mergedPrimitives[refKey]);
    const fullMatch = value.match(/^\{(.+)\}$/);
    if (fullMatch) {
      const refVal = lookup(fullMatch[1]);
      if (refVal === undefined) throw new Error(`Unresolved token reference: {${fullMatch[1]}}`);
      return resolveWithTheme(refVal, extra, depth + 1);
    }
    if (value.includes("{")) {
      return value.replace(/\{([^{}]+)\}/g, (_, refKey) => {
        const refVal = lookup(refKey);
        if (refVal === undefined) throw new Error(`Unresolved token reference: {${refKey}}`);
        const resolved = resolveWithTheme(refVal, extra, depth + 1);
        if (typeof resolved !== "string") throw new Error(`Cannot embed non-string token {${refKey}} inside a larger value`);
        return resolved;
      });
    }
    return value;
  }

  const cssParts = [`/* Theme: ${theme.label} — generated file, do not edit by hand */`];

  // base primitive vars (all themes expose the full raw scale too, for advanced use)
  cssParts.push(`[data-theme="${theme.id}"] {\n${buildPrimitiveBlock(mergedPrimitives)}\n}`);

  for (const mode of ["light", "dark"]) {
    const semanticMap = semantic[mode];
    const lines = [];
    for (const [key, raw] of Object.entries(semanticMap)) {
      lines.push(`  ${toCssVarName(key)}: ${resolveWithTheme(raw, semanticMap)};`);
    }
    for (const [key, raw] of Object.entries(component)) {
      lines.push(`  ${toCssVarName(key)}: ${resolveWithTheme(raw, semanticMap)};`);
    }
    const selector = mode === "light"
      ? `[data-theme="${theme.id}"][data-mode="light"]`
      : `[data-theme="${theme.id}"][data-mode="dark"]`;
    cssParts.push(`${selector} {\n${lines.join("\n")}\n}`);
  }

  writeFileSync(path.join(outDir, `${theme.id}.css`), cssParts.join("\n\n") + "\n");
}

writeFileSync(path.join(outDir, "themes.json"), JSON.stringify(themeList, null, 2));
writeFileSync(
  path.join(outDir, "all-themes.css"),
  themeFiles.map((f) => `@import "./${f.replace(".json", ".css")}";`).join("\n") + "\n"
);

// ---------------------------------------------------------------------------
// SCSS variables — a Bootstrap-shaped export for teams that compile with Sass
// (Bootstrap itself, or any Sass build). Everything below is resolved from the
// same primitives/semantic/component JSON as the CSS themes above — nothing
// here is a typed-in literal. Values are the CORE theme's light-mode resolution;
// runtime theming (dark mode, white-label brand swap) stays on the CSS custom
// properties in core.css / <theme>.css, which is the source of truth at
// runtime — this file is for compile-time Sass logic (mixins, math, conditional
// imports) and for bridging into Bootstrap's own $variables.
// ---------------------------------------------------------------------------

const lightDict = { ...flatPrimitives, ...semantic.light };
function res(value) { return resolve(value, lightDict); }
function px(value) { return typeof value === "string" && value.endsWith("px") ? parseFloat(value) : null; }
function toRem(value) {
  const n = px(value);
  return n === null ? value : `${n / 16}rem`;
}
function scssName(key) { return `$core-${key.replace(/\./g, "-")}`; }

function section(title) {
  return `\n// ---------------------------------------------------------------------------\n// ${title}\n// ---------------------------------------------------------------------------`;
}

// Curated, human-named aliases — same shape as a typical enterprise token set
// (brand / neutral / semantics / elevation), each pointing at a real resolved
// semantic or primitive token rather than a hand-picked value.
const brandAliases = {
  // Brand / Text
  "brand-text-primary-default": "color.brand.500",
  "brand-text-primary-disabled": "color.brand.300",
  "brand-text-primary-active": "color.brand.600",
  "brand-text-primary-hover": "color.brand.600",
  "brand-text-primaryhover": "color.brand.600",
  "brand-text-primary-oncolor": "color.neutral.0",

  // Brand / background
  "brand-background-primary-default": "color.action.primary.bg",
  "brand-background-primary-strong": "color.action.primary.bg",
  "brand-background-primary-light": "color.brand.100",
  "brand-background-primary-subtle": "color.neutral.0",
  "brand-background-primary-disabled-light": "color.brand.100",
  "brand-background-primary-disabled": "color.brand.200",
  "brand-background-primary-active": "color.brand.700",
  "brand-background-primary-hover": "color.brand.600",

  // Brand / Borders (canonical)
  "brand-border-primary-default": "color.brand.500",
  "brand-border-primary-disabled": "color.brand.300",
  "brand-border-primary-hover": "color.brand.600",

  // Legacy plural aliases → canonical border tokens
  "brand-border-primary-default": "brand.border.primary-default",
  "brand-border-primary-disabled": "brand.border.primary-disabled",
  "brand-border-primary-hover": "brand.border.primary-hover",
  "brand-background-primary-strong": "brand.background.primary-strong",
  "brand-background-primary-hover": "brand.background.primary-hover",
  "brand-background-primary-active": "brand.background.primary-active",
  "brand-background-primary-disabled": "brand.background.primary-disabled",
  "brand-background-primary-disabled-light": "brand.background.primary-disabled-light",
};

const neutralAliases = {
  // Neutral / Text (Figma variable hierarchy)
  "neutral-text": "color.text.primary",
  "neutral-text-text": "color.text.primary",
  "neutral-text-subtle": "color.text.secondary",
  "neutral-text-subtleleast": "color.text.tertiary",
  "neutral-text-subtle-least": "color.text.tertiary",
  "neutral-text-text-on-color": "color.text.inverse",
  "neutral-text-on-color": "color.text.inverse",
  "neutral-text-oncolor": "color.text.inverse",
  "neutral-text-default": "color.text.primary",

  // Neutral / border (Figma variable hierarchy)
  "neutral-border-subtle": "color.border.subtle",
  "neutral-border-border-subtle": "color.border.subtle",
  "neutral-border-light": "color.border.default",
  "neutral-border-border-light": "color.border.default",
  "neutral-border-strong": "color.border.strong",
  "neutral-border-border-strong": "color.border.strong",
  "neutral-border-inverse": "color.neutral.0",

  // Surface layers
  "neutral-surface-layer-01": "color.neutral.0",
  "neutral-surface-layer-02": "color.neutral.50",
  "neutral-surface-layer-03": "color.neutral.100",
  "neutral-surface-layer-04": "color.neutral.200",
  "neutral-surface-high-contrast": "color.neutral.800",
};

const semanticsAliases = {
  // Semantics / Critical (Figma variable hierarchy)
  "semantics-critical-border": "color.status.danger.border",
  "semantics-critical-text": "color.status.danger.text",
  "semantics-critical-light-background": "color.status.danger.bg",
  "semantics-critical-strong-background": "color.danger.500",
  "semantics-critical-background-light": "color.status.danger.bg",
  "semantics-critical-background-strong": "color.danger.500",

  // Semantics / Warning
  "semantics-warning-border": "color.status.warning.border",
  "semantics-warning-text": "color.status.warning.text",
  "semantics-warning-light-background": "color.status.warning.bg",
  "semantics-warning-strong-background": "color.warning.500",
  "semantics-warning-background-light": "color.status.warning.bg",
  "semantics-warning-background-strong": "color.warning.500",

  // Semantics / Success
  "semantics-success-border": "color.status.success.border",
  "semantics-success-text": "color.status.success.text",
  "semantics-success-light-background": "color.status.success.bg",
  "semantics-success-strong-background": "color.success.500",
  "semantics-success-background-light": "color.status.success.bg",
  "semantics-success-background-strong": "color.success.500",

  // Semantics / Highlight
  "semantics-highlight-border": "color.status.info.border",
  "semantics-highlight-text": "color.status.info.text",
  "semantics-highlight-light-background": "color.status.info.bg",
  "semantics-highlight-strong-background": "color.info.500",
  "semantics-highlight-background-light": "color.status.info.bg",
  "semantics-highlight-background-strong": "color.info.500",

  // Neutral control disabled (inputs, tables, pagination)
  "semantics-disabled-background": "color.control.disabled.bg",
  "semantics-disabled-border": "color.control.disabled.border",
  "semantics-disabled-text": "color.control.disabled.text",

  // Per-family disabled (preserve semantic identity)
  "semantics-success-disabled-background": "semantics.success.disabled-background",
  "semantics-success-disabled-text": "semantics.success.disabled-text",
  "semantics-success-disabled-border": "semantics.success.disabled-border",
  "semantics-success-disabled-strong-background": "semantics.success.disabled-strong-background",
  "semantics-success-disabled-strong-text": "semantics.success.disabled-strong-text",
  "semantics-warning-disabled-background": "semantics.warning.disabled-background",
  "semantics-warning-disabled-text": "semantics.warning.disabled-text",
  "semantics-warning-disabled-border": "semantics.warning.disabled-border",
  "semantics-warning-disabled-strong-background": "semantics.warning.disabled-strong-background",
  "semantics-warning-disabled-strong-text": "semantics.warning.disabled-strong-text",
  "semantics-critical-disabled-background": "semantics.critical.disabled-background",
  "semantics-critical-disabled-text": "semantics.critical.disabled-text",
  "semantics-critical-disabled-border": "semantics.critical.disabled-border",
  "semantics-critical-disabled-strong-background": "semantics.critical.disabled-strong-background",
  "semantics-critical-disabled-strong-text": "semantics.critical.disabled-strong-text",
  "semantics-highlight-disabled-background": "semantics.highlight.disabled-background",
  "semantics-highlight-disabled-text": "semantics.highlight.disabled-text",
  "semantics-highlight-disabled-border": "semantics.highlight.disabled-border",
  "semantics-highlight-disabled-strong-background": "semantics.highlight.disabled-strong-background",
  "semantics-highlight-disabled-strong-text": "semantics.highlight.disabled-strong-text",
};

const secondaryAliases = {
  "secondary-text-primary-disabled": "secondary.text.primary-disabled",
  "secondary-background-primary-disabled-light": "secondary.background.primary-disabled-light",
  "secondary-background-primary-disabled": "secondary.background.primary-disabled",
  "secondary-border-primary-disabled": "secondary.border.primary-disabled",
};

const tertiaryAliases = {
  "tertiary-text-primary-disabled": "tertiary.text.primary-disabled",
  "tertiary-background-primary-disabled-light": "tertiary.background.primary-disabled-light",
  "tertiary-background-primary-disabled": "tertiary.background.primary-disabled",
  "tertiary-border-primary-disabled": "tertiary.border.primary-disabled",
};

const elevationAliases = {
  "elevation-01": "elevation.1",
  "elevation-02": "elevation.2",
  "elevation-03": "elevation.3",
  "elevation-04": "elevation.4",
};

function buildAliasBlock(aliases) {
  return Object.entries(aliases)
    .map(([name, refKey]) => `$core-${name}: ${res(`{${refKey}}`)}; // ${refKey}`)
    .join("\n");
}

// Font size scale, in rem — generated from the real `font.size.*` primitives
// (not a hand-typed modular scale), same px→rem math Bootstrap itself uses.
const fontSizeLines = Object.entries(primitives.font)
  .filter(([k]) => k.startsWith("size."))
  .map(([k, v]) => `$core-font-size-${k.replace("size.", "")}: ${toRem(v)}; // ${v}`)
  .join("\n");

// Spacing scale, in rem — generated from the real `space.*` primitives.
const spacingLines = Object.entries(primitives.space)
  .map(([k, v]) => `$core-spacing-${k}: ${toRem(v)}; // ${v}`)
  .join("\n");
const spacerBase = toRem(primitives.space["4"]); // 16px — the base "1 spacer" unit

// Raw resolved semantic + component tokens, one $variable per CSS custom
// property already emitted above — the exhaustive, unopinionated export.
const rawSemanticLines = Object.entries(semantic.light)
  .map(([key, raw]) => `${scssName(key)}: ${res(raw)};`)
  .join("\n");
const rawComponentLines = Object.entries(component)
  .map(([key, raw]) => `${scssName(key)}: ${res(raw)};`)
  .join("\n");

const scssParts = [
  `// CORE Design System — SCSS token variables`,
  `// Auto-generated from packages/tokens/src/*.json — do not edit by hand.`,
  `// Resolved from the "core" theme, light mode. For dark mode / white-label`,
  `// theming at runtime, use the CSS custom properties in core.css instead —`,
  `// these $variables are for Sass build-time logic and for bridging CORE's`,
  `// tokens into Bootstrap's own variables (see the bridge section at the`,
  `// bottom of this file).`,
  section("Brand"),
  buildAliasBlock(brandAliases),
  section("Secondary palette"),
  buildAliasBlock(secondaryAliases),
  section("Tertiary palette"),
  buildAliasBlock(tertiaryAliases),
  section("Neutral"),
  buildAliasBlock(neutralAliases),
  section("Semantics"),
  buildAliasBlock(semanticsAliases),
  section("Elevation"),
  buildAliasBlock(elevationAliases),
  section("Font size"),
  fontSizeLines,
  section("Typography roles (Bootstrap-aligned)"),
  Object.entries(typography).flatMap(([role, spec]) => [
    `$core-typography-${role}-size: ${toRem(spec.desktop.size)}; // ${spec.desktop.size} — ${spec.bootstrap || role}`,
    `$core-typography-${role}-weight: ${spec.desktop.weight};`,
    `$core-typography-${role}-line-height: ${spec.desktop.lineHeight};`,
  ]).join("\n"),
  section("Spacing"),
  `$core-spacer: ${spacerBase}; // base unit — matches Bootstrap's $spacer\n${spacingLines}`,
  section("Radius"),
  Object.entries(primitives.radius).map(([k, v]) => `$core-radius-${k}: ${v};`).join("\n"),
  section("All resolved semantic tokens (light mode)"),
  rawSemanticLines,
  section("All resolved component tokens"),
  rawComponentLines,
  section("Bootstrap variable bridge — @import this file before Bootstrap's own\n// scss/_variables.scss so these take effect"),
  [
    `$primary: $core-brand-background-primary-strong;`,
    `$secondary: ${res("{color.secondary.600}")};`,
    `$success: $core-semantics-success-background-strong;`,
    `$warning: $core-semantics-warning-background-strong;`,
    `$danger: $core-semantics-critical-background-strong;`,
    `$info: $core-semantics-highlight-background-strong;`,
    `$light: $core-neutral-surface-layer-02;`,
    `$dark: $core-neutral-surface-high-contrast;`,
    `$body-bg: ${res("{color.bg.page}")};`,
    `$body-color: $core-neutral-text-default;`,
    `$border-color: $core-neutral-border-light;`,
    `$border-radius: $core-radius-sm;`,
    `$border-radius-lg: $core-radius-lg;`,
    `$font-family-base: ${res("{font.family.base}")};`,
    `$font-size-base: $core-font-size-md;`,
    `$font-size-sm: $core-font-size-sm;`,
    `$font-size-lg: $core-font-size-lg;`,
    `$h1-font-size: $core-typography-h1-size;`,
    `$h2-font-size: $core-typography-h2-size;`,
    `$h3-font-size: $core-typography-h3-size;`,
    `$h4-font-size: $core-typography-h4-size;`,
    `$h5-font-size: $core-typography-h5-size;`,
    `$h6-font-size: $core-typography-h6-size;`,
    `$lead-font-size: $core-typography-lead-size;`,
    `$headings-font-weight: 700;`,
    `$headings-line-height: 1.2;`,
    `$spacer: $core-spacer;`,
    `$box-shadow: $core-elevation-01;`,
    `$box-shadow-lg: $core-elevation-03;`,
  ].join("\n"),
];

writeFileSync(path.join(outDir, "core.tokens.scss"), scssParts.join("\n\n") + "\n");
console.log(`✓ Built packages/tokens/dist/core.tokens.scss`);

console.log(`✓ Built ${themeFiles.length} theme CSS files into packages/tokens/dist/`);
