/**
 * Builds src/componentColors.generated.json from packages/core components.css:
 * for every docs component (keyed by its section anchor id) the list of colour
 * declarations — variant, state, part, CSS property and design-system token.
 * Hex values are resolved live in the browser, so they follow light/dark mode.
 */
import { readFileSync, writeFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const here = path.dirname(fileURLToPath(import.meta.url));
const cssFile = path.resolve(here, "../../../packages/core/src/styles/components.css");
const outFile = path.resolve(here, "../src/componentColors.generated.json");

/** Docs section anchor → CSS block prefixes (after `.cds-`). */
const COMPONENTS = {
  accordion: ["accordion"],
  alert: ["alert"],
  "app-footer": ["app-footer"],
  "app-header": ["app-header", "account"],
  attachment: ["attachment", "dropzone"],
  avatar: ["avatar"],
  badge: ["badge"],
  button: ["btn"],
  calendar: ["calendar"],
  "checkbox-radio": ["checkbox", "radio"],
  "data-table": ["data-table", "table", "th-sortable", "sort-icon"],
  "date-picker": ["date-picker", "calendar"],
  empty: ["empty"],
  "icon-button": ["icon-btn"],
  input: ["input", "field", "label", "hint", "error-text", "required-mark"],
  "input-icon": ["input-icon", "input-affix-wrap"],
  "input-group": ["input-group"],
  "line-chart": ["chart"],
  "mobile-nav": ["mobile-nav"],
  modal: ["modal", "overlay-scrim"],
  pagination: ["pagination", "page-btn"],
  "payment-bank-fields": ["otp", "incremental-selector"],
  progress: ["progress"],
  "quick-links": ["quicklink"],
  select: ["select", "combobox"],
  separator: ["separator"],
  sidebar: ["sidenav", "app-sidebar", "app-shell"],
  skeleton: ["skeleton"],
  slideover: ["drawer"],
  slider: ["slider"],
  spinner: ["spinner"],
  stepper: ["stepper", "step"],
  switch: ["switch"],
  table: ["data-table", "table", "th-sortable", "sort-icon"],
  tabs: ["tabs", "tab"],
  textarea: ["textarea"],
  toast: ["toast"],
  tooltip: ["tooltip"],
};

const prefixes = Object.entries(COMPONENTS)
  .flatMap(([id, ps]) => ps.map((p) => [p, id]))
  .sort((a, b) => b[0].length - a[0].length);

function componentsOf(cls) {
  const hits = [];
  for (const [p] of prefixes) {
    if (cls === p || cls.startsWith(p.endsWith("-") ? p : p + "-") || cls.startsWith(p + "_")) {
      for (const [id, ps] of Object.entries(COMPONENTS)) if (ps.includes(p)) hits.push([id, p]);
      break;
    }
  }
  return hits;
}

const COLOR_PROP = /^(color|background(-color)?|border(-(top|right|bottom|left))?(-color)?|outline(-color)?|fill|stroke|box-shadow|caret-color|accent-color|text-decoration-color|--cds-[\w-]*(color|bg|border|stroke|text|glow|track|thumb|fill|ring|divider|indicator|active|disabled)[\w-]*)$/;
const NON_COLOR_TOKEN = /radius|width|size|space|font|duration|ease|elevation|offset|line-height|weight|focusRing|shadow-|maxWidth/;
const LOCAL_ALIAS = { "--cds-focus-color": "--brand-border-primary-focus" };

function stateOf(raw) {
  const sel = raw.replace(/:not\((?:[^()]|\([^()]*\))*\)/g, "");
  const s = [];
  if (/:hover/.test(sel)) s.push("Hover");
  if (/:active|data-pressed|--pressed/.test(sel)) s.push("Active");
  if (/:focus/.test(sel)) s.push("Focus");
  if (/aria-checked="mixed"|indeterminate/.test(sel)) s.push("Indeterminate");
  else if (/:checked|aria-checked="true"|aria-selected="true"|aria-current|data-state="(on|checked|active|open)"|--selected|--active\b|is-active|aria-pressed="true"|aria-expanded="true"/.test(sel)) s.push("Selected");
  if (/aria-invalid|--error|--invalid/.test(sel)) s.push("Error");
  if (/:disabled|aria-disabled|--disabled|data-disabled/.test(sel)) s.push("Disabled");
  if (/placeholder/.test(sel)) s.push("Placeholder");
  return [...new Set(s)].join(" + ") || "Default";
}

const css = readFileSync(cssFile, "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
const out = Object.fromEntries(Object.keys(COMPONENTS).map((k) => [k, []]));
const seen = new Set();

for (const [, selAll, body] of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
  for (let sel of selAll.split(",")) {
    sel = sel.trim();
    if (!sel || /forced-colors/.test(sel)) continue;
    const classes = [...sel.matchAll(/\.cds-([a-z0-9-]+(?:__[a-z0-9-]+)?)/g)].map((m) => m[1]);
    if (!classes.length) continue;
    const target = classes[classes.length - 1];
    let hits = componentsOf(target.split("__")[0]);
    if (!hits.length) hits = componentsOf(classes[0].split("__")[0]);
    if (!hits.length) continue;
    const mode = /data-mode="?dark/.test(sel) ? "dark" : "both";
    const state = stateOf(sel);
    for (const [id, p] of hits) {
      const base = target.split("__")[0].replace(/--.*/, "");
      const esc = p.replace(/[-]/g, "\\-");
      const mods = [...sel.matchAll(new RegExp(`\\.cds-${esc}[a-z0-9-]*--([a-z0-9-]+)`, "g"))]
        .map((m) => m[1])
        .filter((m) => !/^(disabled|pressed|selected|active|error|invalid)$/.test(m));
      const variant = [...new Set(mods)].join(" / ") || "Base";
      const part = (target.includes("__") ? target.split("__")[1].replace(/--.*/, "") : base !== p ? base.slice(p.length).replace(/^-+/, "") : "") || "container";
      for (const [, propRaw, val] of body.matchAll(/([\w-]+)\s*:\s*([^;]+)/g)) {
        const prop = propRaw.trim();
        if (!COLOR_PROP.test(prop)) continue;
        for (const [, tokRaw] of val.matchAll(/var\((--[\w-]+)/g)) {
          if (NON_COLOR_TOKEN.test(tokRaw)) continue;
          const token = LOCAL_ALIAS[tokRaw] ?? tokRaw;
          if (token.startsWith("--cds-") || token.startsWith("--typography-")) continue;
          const key = [id, variant, part, state, prop, token, mode].join("|");
          if (seen.has(key)) continue;
          seen.add(key);
          out[id].push({ variant, state, part, property: prop, token: token.slice(2), mode, mix: /color-mix/.test(val) });
        }
      }
    }
  }
}

const ORDER = ["Default", "Hover", "Active", "Focus", "Selected", "Indeterminate", "Error", "Disabled", "Placeholder"];
for (const rows of Object.values(out)) {
  rows.sort((a, b) =>
    (a.variant === "Base" ? "" : a.variant).localeCompare(b.variant === "Base" ? "" : b.variant) ||
    ORDER.indexOf(a.state.split(" + ")[0]) - ORDER.indexOf(b.state.split(" + ")[0]) ||
    a.state.localeCompare(b.state) || a.part.localeCompare(b.part) || a.property.localeCompare(b.property));
}

writeFileSync(outFile, JSON.stringify(out, null, 1) + "\n");
console.log(`Wrote ${outFile} (${Object.values(out).reduce((n, r) => n + r.length, 0)} colour rows)`);
