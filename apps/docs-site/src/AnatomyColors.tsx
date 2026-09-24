import React, { useLayoutEffect, useState } from "react";
import { SectionHeading, SpecTableCard, SpecTableHead, SpecRow } from "./AnatomySpec";

interface ColorLayer {
  node: string;
  sel?: string;
}

interface ColorRow {
  label: string;
  token: string;
  value: string;
}

type Prop = { key: "color" | "background-color" | "border-top-color"; name: string; shorthands: string[] };

const PROPS: Prop[] = [
  { key: "color", name: "Text", shorthands: ["color"] },
  { key: "background-color", name: "Background", shorthands: ["background-color", "background"] },
  { key: "border-top-color", name: "Border", shorthands: ["border-top-color", "border-color", "border-top", "border"] },
];

let styleRules: CSSStyleRule[] | null = null;

function allStyleRules(): CSSStyleRule[] {
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

const probeColor = (host: Element, value: string): string => {
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
function tokenFor(el: HTMLElement, prop: Prop, computed: string): string {
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

const isTransparent = (c: string) => c === "transparent" || /rgba\([^)]*,\s*0\)$/.test(c);

function hasOwnText(el: Element): boolean {
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

  useLayoutEffect(() => {
    const measure = () => {
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
          if (p.key === "border-top-color" && parseFloat(cs.borderTopWidth) === 0) continue;
          const key = `${l.node}|${p.key}`;
          if (seen.has(key)) continue;
          seen.add(key);
          out.push({ label: `${l.node} — ${p.name}`, token: tokenFor(el, p, value), value });
        }
      }
      setRows(out);
    };
    measure();
    const t = window.setTimeout(measure, 400);
    return () => window.clearTimeout(t);
  }, [layers, root]);

  if (!rows.length) return null;
  return (
    <div>
      <SectionHeading>Colors — resolved from the live component</SectionHeading>
      <SpecTableCard>
        <SpecTableHead />
        <tbody>
          {rows.map((c) => (
            <SpecRow key={c.label} label={c.label} token={c.token} value={c.value} swatch={c.value} standard="pass" />
          ))}
        </tbody>
      </SpecTableCard>
    </div>
  );
}
