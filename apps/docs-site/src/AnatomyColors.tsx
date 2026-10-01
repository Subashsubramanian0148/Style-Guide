import React, { useLayoutEffect, useState } from "react";
import { SectionHeading, SpecTableCard, SpecTableHead, SpecRow, toHexColors } from "./AnatomySpec";
import { usePreviewMode } from "./PreviewModeContext";

interface ColorLayer {
  node: string;
  sel?: string;
}

interface ColorRow {
  label: string;
  token: string;
  value: string;
  colorName?: string;
  standard: "pass" | "warn" | "fail";
  ratio?: string;
  note?: string;
}

export type Prop = { key: "color" | "background-color" | "border-top-color"; name: string; shorthands: string[] };

export const PROPS: Prop[] = [
  { key: "color", name: "Text", shorthands: ["color"] },
  { key: "background-color", name: "Background", shorthands: ["background-color", "background"] },
  { key: "border-top-color", name: "Border", shorthands: ["border-top-color", "border-color", "border-top", "border"] },
];

let styleRules: CSSStyleRule[] | null = null;

export function allStyleRules(): CSSStyleRule[] {
  if (styleRules) return styleRules;
  const out: CSSStyleRule[] = [];
  const walk = (rules: CSSRuleList) => {
    for (const r of Array.from(rules)) {
      if (r instanceof CSSStyleRule) out.push(r);
      else if ("cssRules" in r) {
        const cond = r as CSSGroupingRule & { media?: MediaList; conditionText?: string };
        if (cond.media && !window.matchMedia(cond.media.mediaText).matches) continue;
        walk((r as CSSGroupingRule).cssRules);
      }
    }
  };
  for (const sheet of Array.from(document.styleSheets)) {
    try {
      walk(sheet.cssRules);
    } catch {
      /* cross-origin sheet (e.g. icon font) */
    }
  }
  styleRules = out;
  return out;
}

export const probeColor = (host: Element, value: string): string => {
  const probe = document.createElement("span");
  probe.style.color = value;
  probe.style.display = "none";
  const target = host.matches("input, textarea, select, img, br, hr") ? host.parentElement ?? host : host;
  target.appendChild(probe);
  const c = getComputedStyle(probe).color;
  probe.remove();
  return c;
};

/** Finds the design-system variable behind a computed color: walks the
 *  style rules that match the element (inline style first, then later rules
 *  before earlier ones) and keeps the first `var(--…)` whose resolved color
 *  equals what actually rendered. */
export function tokenFor(el: HTMLElement, prop: Prop, computed: string): string {
  const candidates: string[] = [];
  for (const sh of prop.shorthands) {
    const v = el.style.getPropertyValue(sh);
    if (v) candidates.push(v);
  }
  const rules = allStyleRules();
  for (let i = rules.length - 1; i >= 0; i--) {
    const r = rules[i];
    let matches = false;
    try {
      matches = el.matches(r.selectorText);
    } catch {
      matches = false;
    }
    if (!matches) continue;
    for (const sh of prop.shorthands) {
      const v = r.style.getPropertyValue(sh);
      if (v) candidates.push(v);
    }
  }
  for (const v of candidates) {
    const names = v.match(/--[\w-]+/g);
    if (!names) continue;
    if (/color-mix/.test(v)) {
      if (probeColor(el, v) === computed) return `${names[0].slice(2)} (mix)`;
      continue;
    }
    for (const n of names) {
      if (probeColor(el, `var(${n})`) === computed) return n.slice(2);
    }
  }
  if (prop.key === "color" && el.parentElement && getComputedStyle(el.parentElement).color === computed) {
    const inherited = tokenFor(el.parentElement, prop, computed);
    return inherited === "—" ? "inherited" : inherited;
  }
  return "—";
}

/** Palette tokens as named on the Color page (brand-text-primary-default,
 *  neutral-border-light, semantics-success-text, …). */
const CANONICAL = /^((brand|secondary|tertiary)-(text|background|border)-primary-|neutral-(text|border|background)-|neutral-background$|neutral-surface-|semantics-)/;

/** The value a custom property is declared with where `el` sits: the last
 *  matching rule on the element or its nearest ancestor. */
function declaredValue(el: Element, name: string): string | null {
  const rules = allStyleRules();
  for (let cur: Element | null = el; cur; cur = cur.parentElement) {
    for (let i = rules.length - 1; i >= 0; i--) {
      const v = rules[i].style.getPropertyValue(name);
      if (!v) continue;
      try {
        if (cur.matches(rules[i].selectorText)) return v.trim();
      } catch {
        /* unsupported selector */
      }
    }
  }
  return null;
}

/** Follows aliases (`--theme-*`) and component-local variables (`--cds-*`)
 *  to the design-system token they point at, so the anatomy names the same
 *  token the Color page shows — e.g. theme-neutral-text-subtle →
 *  neutral-text-subtle, cds-tab-indicator → brand-background-primary-strong. */
export function canonicalToken(el: Element, token: string): string {
  const suffix = token.endsWith(" (mix)") ? " (mix)" : "";
  let name = token.replace(/ \(mix\)$/, "");
  for (let hop = 0; hop < 8; hop++) {
    if (CANONICAL.test(name) || /^core-/.test(name)) break;
    const v = declaredValue(el, `--${name}`);
    const m = v?.match(/^var\(--([\w-]+)\)$/);
    if (!m) break;
    name = m[1];
  }
  return name + suffix;
}

/** Runs `fn` with CSS transitions off. After a light/dark flip colors fade
 *  (and freeze while the tab is hidden); reading mid-fade would report the
 *  previous mode's colors, so measure the settled values. */
function withoutTransitions<T>(fn: () => T): T {
  const style = document.createElement("style");
  style.textContent = "*,*::before,*::after{transition:none!important}";
  document.head.appendChild(style);
  try {
    void document.body.offsetHeight;
    return fn();
  } finally {
    style.remove();
  }
}

/* ---------- Palette names ---------- */

const FAMILY_LABEL: Record<string, string> = { primary: "Brand", red: "Danger" };
const FAMILY_ORDER = ["neutral", "primary", "secondary", "success", "red", "info", "warning", "tertiary"];
/** Words in a token name that point at a palette family. */
const FAMILY_HINTS: Array<[string, string]> = [
  ["neutral", "neutral"],
  ["brand", "primary"],
  ["primary", "primary"],
  ["secondary", "secondary"],
  ["tertiary", "tertiary"],
  ["success", "success"],
  ["danger", "red"],
  ["critical", "red"],
  ["warning", "warning"],
  ["info", "info"],
  ["highlight", "info"],
];

interface PaletteEntry {
  family: string;
  step: string;
}
let paletteByHex: Map<string, PaletteEntry[]> | null = null;

/** Hex → palette names, read from the primitive ramps the theme stylesheet
 *  declares (`--theme-colors-*` and `--theme-primitive-color-*`), so the
 *  names can never drift from the design system. */
function palette(): Map<string, PaletteEntry[]> {
  if (paletteByHex) return paletteByHex;
  const map = new Map<string, PaletteEntry[]>();
  for (const r of allStyleRules()) {
    if (!/:root/.test(r.selectorText)) continue;
    for (const prop of Array.from(r.style)) {
      const m = prop.match(/^--theme-(?:colors|primitive-color)-([a-z]+)-(\d+)$/);
      if (!m) continue;
      const hex = r.style.getPropertyValue(prop).trim().toUpperCase();
      if (!/^#[0-9A-F]{6}$/.test(hex)) continue;
      const list = map.get(hex) ?? [];
      if (!list.some((e) => e.family === m[1] && e.step === m[2])) list.push({ family: m[1], step: m[2] });
      map.set(hex, list);
    }
  }
  paletteByHex = map;
  return map;
}

/** "Neutral 0" for #FFFFFF, "Brand 500" for #1F4F8D, … — or undefined when
 *  the color isn't a palette step (translucent mixes, for instance). */
function paletteName(value: string, token: string): string | undefined {
  const hex = toHexColors(value).toUpperCase();
  const matches = palette().get(hex);
  if (!matches?.length) return undefined;
  const t = token.toLowerCase();
  const hinted = FAMILY_HINTS.find(([word, fam]) => t.includes(word) && matches.some((e) => e.family === fam));
  const pick = hinted
    ? matches.find((e) => e.family === hinted[1])!
    : [...matches].sort((a, b) => FAMILY_ORDER.indexOf(a.family) - FAMILY_ORDER.indexOf(b.family))[0];
  const fam = FAMILY_LABEL[pick.family] ?? pick.family[0].toUpperCase() + pick.family.slice(1);
  return `${fam} ${pick.step}`;
}

/* ---------- Contrast ---------- */

type RGBA = [number, number, number, number];

function parseColor(c: string): RGBA | null {
  let m = c.match(/^rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:[,\s/]+([\d.]+%?))?\s*\)$/);
  if (m) return [+m[1], +m[2], +m[3], m[4] === undefined ? 1 : m[4].endsWith("%") ? parseFloat(m[4]) / 100 : +m[4]];
  m = c.match(/^color\(srgb\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*([\d.]+%?))?\s*\)$/);
  if (m) return [+m[1] * 255, +m[2] * 255, +m[3] * 255, m[4] === undefined ? 1 : m[4].endsWith("%") ? parseFloat(m[4]) / 100 : +m[4]];
  return null;
}

const over = (top: RGBA, bottom: [number, number, number]): [number, number, number] => [
  top[0] * top[3] + bottom[0] * (1 - top[3]),
  top[1] * top[3] + bottom[1] * (1 - top[3]),
  top[2] * top[3] + bottom[2] * (1 - top[3]),
];

/** The color actually behind an element: its own and its ancestors'
 *  backgrounds composited until one is opaque. */
function effectiveBg(el: Element | null): [number, number, number] {
  const layers: RGBA[] = [];
  let cur = el;
  let base: [number, number, number] = [255, 255, 255];
  while (cur) {
    const c = parseColor(getComputedStyle(cur).backgroundColor);
    if (c && c[3] > 0) {
      layers.push(c);
      if (c[3] >= 1) break;
    }
    cur = cur.parentElement;
    if (!cur) {
      const b = parseColor(getComputedStyle(document.body).backgroundColor);
      if (b && b[3] > 0) base = [b[0], b[1], b[2]];
    }
  }
  return layers.reduceRight<[number, number, number]>((acc, l) => over(l, acc), base);
}

const luminance = ([r, g, b]: [number, number, number]) => {
  const f = (v: number) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};

const contrast = (a: [number, number, number], b: [number, number, number]) => {
  const x = luminance(a);
  const y = luminance(b);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
};

/** Form controls whose outline is what identifies them on the page, so the
 *  border needs 3:1 (WCAG 1.4.11). Cards, tables and dividers are decorative. */
const CONTROL_OUTLINE =
  "input, textarea, select, .cds-checkbox-box, .cds-radio-box, .cds-otp-digit, .cds-incremental-selector, .cds-select-option-checkbox, .cds-input-group-addon, .cds-tab[aria-selected='true']";
const DISABLED = ":disabled, [aria-disabled='true'], [data-disabled], [class*='disabled']";

const fmt = (n: number) => `${(Math.floor(n * 100) / 100).toFixed(2)}:1`;

interface Verdict {
  standard: "pass" | "warn" | "fail";
  ratio?: string;
  note?: string;
}

/** Pass/fail for one color row, computed from what rendered in the current
 *  light/dark mode. */
function verdictFor(el: HTMLElement, prop: Prop, shown: string): Verdict {
  const color = parseColor(shown);
  if (!color || color[3] === 0) return { standard: "pass" };
  const exempt = !!el.closest(DISABLED);

  if (prop.key === "color") {
    const bg = effectiveBg(el);
    const fg = over(color, bg);
    const r = contrast(fg, bg);
    const cs = getComputedStyle(el);
    const size = parseFloat(cs.fontSize);
    const icon = el.tagName === "I" || el.tagName === "svg" || el.classList.contains("cds-icon");
    const large = size >= 24 || (size >= 18.66 && +cs.fontWeight >= 700);
    const need = icon || large ? 3 : 4.5;
    if (exempt) return { standard: "pass", ratio: fmt(r), note: "disabled — exempt" };
    if (r >= need) return { standard: "pass", ratio: fmt(r) };
    return { standard: "fail", ratio: fmt(r), note: `needs ${need}:1 (${icon ? "1.4.11" : "1.4.3"})` };
  }

  if (prop.key === "border-top-color" && el.matches(CONTROL_OUTLINE)) {
    const bg = effectiveBg(el.parentElement);
    const r = contrast(over(color, bg), bg);
    if (exempt) return { standard: "pass", ratio: fmt(r), note: "disabled — exempt" };
    if (r >= 3) return { standard: "pass", ratio: fmt(r) };
    return { standard: "fail", ratio: fmt(r), note: "needs 3:1 (1.4.11)" };
  }

  return { standard: "pass" };
}

export const isTransparent = (c: string) => c === "transparent" || /rgba\([^)]*,\s*0\)$/.test(c);

export function hasOwnText(el: Element): boolean {
  return Array.from(el.childNodes).some((n) => n.nodeType === 3 && n.textContent!.trim()) || el.matches("input:not([type=range]):not([type=checkbox]):not([type=radio]), textarea, select");
}

function resolve(root: HTMLElement, sel?: string): HTMLElement | null {
  if (sel === undefined || sel.startsWith("union:")) return null;
  if (sel.startsWith("text:")) return root.querySelector(sel.slice(5));
  return sel === "" ? root : root.querySelector(sel);
}

/** Color table generated from an anatomy's layers: every layer reports the
 *  text, background and border colors it renders, with the token each one
 *  resolves through — so every component documents its colors, not only the
 *  hand-written ones. */
export function ColorTable({ layers, root }: { layers: ColorLayer[]; root?: React.RefObject<HTMLElement> }) {
  const [rows, setRows] = useState<ColorRow[]>([]);
  // The whole site, anatomy included, follows the global light/dark switch;
  // re-measuring on it keeps every value and verdict true to the mode shown.
  const { mode } = usePreviewMode();

  useLayoutEffect(() => {
    const measure = () => withoutTransitions(() => {
      const r = root?.current;
      if (!r) return;
      const seen = new Set<string>();
      const out: ColorRow[] = [];
      for (const l of layers) {
        const el = resolve(r, l.sel);
        if (!el || getComputedStyle(el).display === "none") continue;
        const cs = getComputedStyle(el);
        for (const p of PROPS) {
          const value = cs.getPropertyValue(p.key);
          if (p.key === "color" && !hasOwnText(el) && !(l.sel ?? "").startsWith("text:") && el.tagName !== "I" && el.tagName !== "svg") continue;
          if (p.key !== "color" && isTransparent(value)) continue;
          let shown = value;
          let lookup = p;
          if (p.key === "border-top-color" && parseFloat(cs.borderTopWidth) === 0) {
            // Inside strokes are drawn with an inset box-shadow (no layout size).
            const inset = cs.boxShadow.includes("inset") ? cs.boxShadow.match(/rgba?\([^)]*\)/)?.[0] : undefined;
            if (!inset || isTransparent(inset)) continue;
            shown = inset;
            lookup = { ...p, shorthands: ["--cds-stroke-color", "box-shadow"] };
          }
          const key = `${l.node}|${p.key}`;
          if (seen.has(key)) continue;
          seen.add(key);
          const token = canonicalToken(el, tokenFor(el, lookup, shown));
          out.push({
            label: `${l.node} — ${p.name}`,
            token,
            value: shown,
            colorName: paletteName(shown, token),
            ...verdictFor(el, p, shown),
          });
        }
      }
      setRows(out);
    });
    measure();
    const t = window.setTimeout(measure, 400);
    return () => window.clearTimeout(t);
  }, [layers, root, mode]);

  if (!rows.length) return null;
  return (
    <div>
      <SectionHeading>Colors — resolved from the live component ({mode} mode)</SectionHeading>
      <SpecTableCard>
        <SpecTableHead />
        <tbody>
          {rows.map((c) => (
            <SpecRow key={c.label} label={c.label} token={c.token} value={c.value} swatch={c.value} colorName={c.colorName} standard={c.standard} ratio={c.ratio} note={c.note} />
          ))}
        </tbody>
      </SpecTableCard>
    </div>
  );
}

const splitShadows = (v: string): string[] => {
  const out: string[] = [];
  let depth = 0;
  let cur = "";
  for (const ch of v) {
    if (ch === "(") depth++;
    if (ch === ")") depth--;
    if (ch === "," && depth === 0) {
      out.push(cur.trim());
      cur = "";
    } else cur += ch;
  }
  if (cur.trim()) out.push(cur.trim());
  return out;
};

const ELEVATIONS = ["1", "2", "3", "4"];

/** Resolves each elevation token to its computed shadow string, so a
 *  rendered drop shadow can be matched back to the level it came from. */
function elevationMap(host: HTMLElement): Record<string, string> {
  const probe = document.createElement("span");
  probe.style.display = "none";
  host.appendChild(probe);
  const map: Record<string, string> = {};
  for (const n of ELEVATIONS) {
    probe.style.boxShadow = `var(--core-elevation-${n})`;
    map[getComputedStyle(probe).boxShadow] = `core-elevation-${n}`;
  }
  probe.style.boxShadow = "var(--cds-focus-glow)";
  const glow = getComputedStyle(probe).boxShadow;
  if (glow && glow !== "none") map[glow] = "cds-focus-glow";
  probe.remove();
  return map;
}

interface ShadowRow {
  label: string;
  token: string;
  value: string;
}

/** Shadow table generated from an anatomy's layers: reports the drop shadow
 *  (elevation level) each layer renders, ignoring 1px inset strokes, which
 *  the color table already covers as borders. The root layer always gets a
 *  row, so flat components state "none" explicitly. */
export function ShadowTable({ layers, root }: { layers: ColorLayer[]; root?: React.RefObject<HTMLElement> }) {
  const [rows, setRows] = useState<ShadowRow[]>([]);

  useLayoutEffect(() => {
    const measure = () => {
      const r = root?.current;
      if (!r) return;
      const map = elevationMap(r);
      const out: ShadowRow[] = [];
      const seen = new Set<string>();
      layers.forEach((l, i) => {
        const el = resolve(r, l.sel);
        if (!el || getComputedStyle(el).display === "none" || seen.has(l.node)) return;
        const drop = splitShadows(getComputedStyle(el).boxShadow).filter((s) => s !== "none" && !s.includes("inset"));
        if (!drop.length) {
          if (i === 0) {
            seen.add(l.node);
            out.push({ label: `${l.node} — Shadow`, token: "none (flat)", value: "none" });
          }
          return;
        }
        const joined = drop.join(", ");
        seen.add(l.node);
        out.push({ label: `${l.node} — Shadow`, token: map[joined] ?? "custom (not a token)", value: joined });
      });
      setRows(out);
    };
    measure();
    const t = window.setTimeout(measure, 400);
    return () => window.clearTimeout(t);
  }, [layers, root]);

  if (!rows.length) return null;
  return (
    <div>
      <SectionHeading>Shadow — elevation level from the live component</SectionHeading>
      <SpecTableCard>
        <SpecTableHead />
        <tbody>
          {rows.map((s) => (
            <SpecRow key={s.label} label={s.label} token={s.token} value={s.value} standard={s.token.startsWith("custom") ? "warn" : "pass"} />
          ))}
        </tbody>
      </SpecTableCard>
    </div>
  );
}
