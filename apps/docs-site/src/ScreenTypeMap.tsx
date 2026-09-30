import React, { useLayoutEffect, useRef, useState } from "react";
import typography from "../../../packages/tokens/src/typography.json";
import { roleName } from "./pages/Typography";
import { tokensFor, usageFor } from "./pages/typographyUsage";
import { SectionHeading, SpecTableCard, SpecNote } from "./AnatomySpec";
import { hasOwnText } from "./AnatomyColors";

/** Typography map for a whole screen: tags every piece of text with the
 *  style it uses, says where each style appears, what it is for, and the
 *  HTML + CSS a developer should write — so "where do I use H1?" is
 *  answered on the screen itself. */

type Desktop = { size: string; weight: string; lineHeight: string };
const TYPO = typography as Record<string, { desktop: Desktop; usage?: string }>;

const HEADINGS = ["h1", "h2", "h3", "h4", "h5", "h6"];

/** Semantic token prefix for styles that have one (typography-tokens.css). */
const SEMANTIC_PREFIX: Record<string, string> = {
  h1: "heading-h1", h2: "heading-h2", h3: "heading-h3", h4: "heading-h4", h5: "heading-h5", h6: "heading-h6",
  text16Regular: "body-lg", text14Regular: "body-md", text12Regular: "body-xs", text12Medium: "caption",
  text14Bold: "label", eyebrow: "eyebrow", text12SemiBold: "text12-semibold", text14SemiBold: "text14-semibold", text16SemiBold: "text16-semibold",
};

const FRIENDLY: Record<string, string> = {
  text16Regular: "Body lg", text14Regular: "Body md", text12Regular: "Body xs", text12Medium: "Caption",
  text14Bold: "Label", eyebrow: "Eyebrow", numericData: "Numeric data",
};

export function styleLabel(key: string): string {
  if (HEADINGS.includes(key)) return key.toUpperCase();
  return FRIENDLY[key] ?? roleName[key] ?? key;
}

const SIZE_VAR: Record<string, string> = { "12px": "xs", "14px": "sm", "16px": "md", "20px": "lg", "24px": "xl", "28px": "2xl", "32px": "3xl" };

/** Inline style for a typography.json key, built from tokens only. */
export function typeStyle(key: string): React.CSSProperties {
  const d = TYPO[key]?.desktop;
  const p = SEMANTIC_PREFIX[key];
  if (key === "numericData") {
    return { fontFamily: "var(--typography-font-family-mono)", fontSize: "var(--typography-font-size-sm)", fontWeight: 600, lineHeight: 1.5, fontVariantNumeric: "tabular-nums", margin: 0 };
  }
  if (p) {
    return {
      fontSize: `var(--typography-${p}-size)`,
      lineHeight: `var(--typography-${p}-line-height, ${d?.lineHeight ?? 1.5})`,
      fontWeight: `var(--typography-${p}-weight, ${d?.weight ?? 400})` as unknown as number,
      letterSpacing: `var(--typography-${p}-letter-spacing, 0)`,
      textTransform: key === "eyebrow" ? "uppercase" : undefined,
      margin: 0,
    };
  }
  return { fontSize: `var(--typography-font-size-${SIZE_VAR[d?.size ?? "14px"] ?? "sm"})`, fontWeight: Number(d?.weight ?? 400), lineHeight: d?.lineHeight ?? 1.5, margin: 0 };
}

/** Text in a reference screen: renders with the style's tokens and marks the
 *  element with `data-type` so the map reports the intended style. */
export function Txt({ as = "span", t, style, children, ...rest }: { as?: keyof JSX.IntrinsicElements; t: string; style?: React.CSSProperties; children: React.ReactNode; href?: string } & React.HTMLAttributes<HTMLElement>) {
  const Tag = as as any;
  return (
    <Tag data-type={t} style={{ ...typeStyle(t), ...style }} {...rest}>
      {children}
    </Tag>
  );
}

/** Text that comes from a design-system component rather than the screen. */
const COMPONENTS: Array<[string, string]> = [
  [".cds-btn, .cds-icon-btn", "Button"],
  [".cds-badge", "Badge"],
  [".cds-app-sidebar", "Sidebar"],
  [".cds-account-menu, .cds-app-header", "App header"],
  ["[role=tablist]", "Tabs"],
  [".cds-stepper", "Stepper"],
  [".cds-checkbox, .cds-radio", "Checkbox / Radio"],
  [".cds-chart", "Line chart"],
  [".cds-label, .cds-hint", "Field"],
  [".cds-select, .cds-input, input, select", "Input / Select"],
];

const GROUP_COLOR = { heading: "#7C3AED", body: "#2563EB", label: "#118D57", numeric: "#C2410C", other: "#5C5C6B" };
function groupOf(key: string): keyof typeof GROUP_COLOR {
  if (HEADINGS.includes(key)) return "heading";
  if (key === "numericData" || /^text(20|24|28|32)Bold$/.test(key)) return "numeric";
  if (["text14Bold", "text12Medium", "eyebrow", "text12SemiBold", "text12Bold"].includes(key)) return "label";
  if (/Regular$/.test(key)) return "body";
  return "other";
}

interface Hit {
  key: string;
  text: string;
  source: string | null;
  tag: string;
  rect: { x: number; y: number; w: number; h: number };
}

function matchBySize(el: HTMLElement): string {
  const cs = getComputedStyle(el);
  const px = `${Math.round(parseFloat(cs.fontSize))}px`;
  const w = cs.fontWeight;
  const tag = el.tagName.toLowerCase();
  if (/^h[1-6]$/.test(tag) && TYPO[tag]?.desktop.size === px && TYPO[tag].desktop.weight === w) return tag;
  const k = Object.keys(TYPO).find((k) => !HEADINGS.includes(k) && k !== "eyebrow" && k !== "numericData" && TYPO[k].desktop.size === px && TYPO[k].desktop.weight === w);
  return k ?? `custom:${px}/${w}`;
}

function collect(root: HTMLElement, box: HTMLElement, scale: number): Hit[] {
  const o = box.getBoundingClientRect();
  const hits: Hit[] = [];
  const tw = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT);
  while (tw.nextNode()) {
    const el = tw.currentNode as HTMLElement;
    if (!hasOwnText(el) || el.closest(".cds-visually-hidden, svg")) continue;
    const cs = getComputedStyle(el);
    if (cs.display === "none" || cs.visibility === "hidden" || !el.getClientRects().length) continue;
    const typed = el.closest<HTMLElement>("[data-type]");
    const inside = typed && root.contains(typed) ? typed : null;
    const comp = COMPONENTS.find(([sel]) => el.closest(sel));
    const key = inside ? inside.dataset.type! : matchBySize(el);
    const r = el.getBoundingClientRect();
    const text = (el.textContent || (el as HTMLInputElement).placeholder || "").trim().replace(/\s+/g, " ");
    if (!text) continue;
    hits.push({ key, text, source: inside ? null : comp ? comp[1] : null, tag: (inside ?? el).tagName.toLowerCase(), rect: { x: (r.left - o.left) / 1, y: (r.top - o.top) / 1, w: r.width, h: r.height } });
  }
  void scale;
  return hits;
}

type Check = { ok: boolean | "info"; text: string };
function checks(hits: Hit[]): Check[] {
  const out: Check[] = [];
  const h1 = hits.filter((h) => h.tag === "h1");
  out.push(h1.length === 1 ? { ok: true, text: `One H1 on the screen — “${h1[0].text}”.` } : { ok: false, text: `${h1.length} H1 elements — a screen needs exactly one page title.` });
  const levels = hits.filter((h) => /^h[1-6]$/.test(h.tag)).map((h) => Number(h.tag[1]));
  let max = 0;
  let skip = "";
  for (const l of levels) {
    if (max && l > max + 1) skip = skip || `H${max} → H${l}`;
    max = Math.max(max, l);
  }
  out.push(skip ? { ok: false, text: `Heading level skipped (${skip}) — go one level at a time.` } : { ok: true, text: "Heading levels run in order, none skipped." });
  const mismatch = hits.filter((h) => /^h[1-6]$/.test(h.tag) && HEADINGS.includes(h.key) && h.key !== h.tag);
  out.push(
    mismatch.length
      ? { ok: "info", text: `Tag follows the page outline, style follows the visual size: ${mismatch.map((m) => `<${m.tag}> “${m.text.slice(0, 28)}” uses ${styleLabel(m.key)}`).join(" · ")}.` }
      : { ok: true, text: "Every heading tag uses its matching heading style." }
  );
  return out;
}

function CopyCss({ text }: { text: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      onClick={() => navigator.clipboard?.writeText(text).then(() => { setDone(true); window.setTimeout(() => setDone(false), 1500); })}
      style={{ padding: "var(--core-space-1) var(--core-space-2)", borderRadius: "var(--core-radius-sm)", border: "1px solid var(--core-color-border-default)", background: "var(--core-color-surface-default)", color: "var(--core-color-text-secondary)", fontSize: 12, fontWeight: 600, cursor: "pointer" }}
    >
      {done ? "Copied" : "Copy CSS"}
    </button>
  );
}

const ORDER = (k: string) => {
  const h = HEADINGS.indexOf(k);
  if (h >= 0) return h;
  const d = TYPO[k]?.desktop;
  return 10 + (40 - (d ? parseInt(d.size, 10) : 0)) + (d ? (900 - Number(d.weight)) / 1000 : 0);
};

export function ScreenTypeMap({ width, children }: { width: number; children: React.ReactNode }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.5);
  const [height, setHeight] = useState(0);
  const [hits, setHits] = useState<Hit[]>([]);
  const [focus, setFocus] = useState<string | null>("headings");

  useLayoutEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const fit = () => setScale(Math.min(1, wrap.clientWidth / width));
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(wrap);
    return () => ro.disconnect();
  }, [width]);

  useLayoutEffect(() => {
    const measure = () => {
      if (!rootRef.current || !boxRef.current) return;
      setHeight(rootRef.current.offsetHeight);
      setHits(collect(rootRef.current, boxRef.current, scale));
    };
    measure();
    const t = window.setTimeout(measure, 500);
    return () => window.clearTimeout(t);
  }, [scale]);

  const keys = [...new Set(hits.map((h) => h.key))].sort((a, b) => ORDER(a) - ORDER(b));
  const inFocus = (h: Hit) => !focus || (focus === "headings" ? HEADINGS.includes(h.key) : h.key === focus);
  const shown = hits.filter(inFocus);
  const shortLabel = (h: Hit) => {
    if (h.source) return h.source;
    if (h.key.startsWith("custom:")) return "Custom";
    const d = TYPO[h.key]?.desktop;
    if (!HEADINGS.includes(h.key) && !FRIENDLY[h.key] && d) return `${parseInt(d.size, 10)} ${roleName[h.key]?.split(" ").pop() ?? d.weight}`;
    return styleLabel(h.key);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--core-space-6)" }}>
      <div>
        <SectionHeading>Typography map — which text style is used where</SectionHeading>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--core-space-2)", marginBottom: "var(--core-space-4)" }}>
          {["headings", null, ...keys].map((k) => {
            const active = focus === k;
            const count = k === "headings" ? hits.filter((h) => HEADINGS.includes(h.key)).length : k ? hits.filter((h) => h.key === k).length : hits.length;
            const color = k === "headings" ? GROUP_COLOR.heading : k ? GROUP_COLOR[groupOf(k)] : "var(--core-color-text-primary)";
            return (
              <button
                key={k ?? "all"}
                type="button"
                onClick={() => setFocus(k)}
                aria-pressed={active}
                style={{
                  display: "inline-flex", alignItems: "center", gap: "var(--core-space-1)",
                  padding: "var(--core-space-1) var(--core-space-3)", borderRadius: 999, cursor: "pointer",
                  border: `1px solid ${active ? color : "var(--core-color-border-default)"}`,
                  background: active ? color : "var(--core-color-surface-default)",
                  color: active ? "#FFFFFF" : "var(--core-color-text-primary)", fontSize: 12, fontWeight: 600,
                }}
              >
                {k === "headings" ? "Headings (H1–H6)" : k ? styleLabel(k.startsWith("custom:") ? "Custom" : k) : "All text"} <span style={{ opacity: 0.7 }}>{count}</span>
              </button>
            );
          })}
        </div>
        <div ref={wrapRef} style={{ width: "100%", overflow: "hidden" }}>
          <div ref={boxRef} style={{ position: "relative", width: width * scale, height: height * scale }}>
            <div style={{ position: "absolute", left: 0, top: 0, width, transform: `scale(${scale})`, transformOrigin: "0 0" }}>
              <div ref={rootRef}>{children}</div>
            </div>
            {shown.map((h, i) => {
              const color = h.source ? GROUP_COLOR.other : GROUP_COLOR[groupOf(h.key)];
              return (
                <React.Fragment key={i}>
                  <div style={{ position: "absolute", left: h.rect.x, top: h.rect.y, width: h.rect.w, height: h.rect.h, outline: `1.5px solid ${color}`, background: focus ? `${color}26` : "transparent", pointerEvents: "none", zIndex: 2 }} />
                  <div
                    title={`${styleLabel(h.key)} — “${h.text}”`}
                    style={{ position: "absolute", left: h.rect.x, top: h.rect.y - 14, background: color, color: "#FFFFFF", fontSize: 9, fontWeight: 700, lineHeight: "12px", padding: "1px 4px", borderRadius: 3, whiteSpace: "nowrap", zIndex: 3, pointerEvents: "none" }}
                  >
                    {shortLabel(h)}
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        </div>
        <SpecNote>
          <span style={{ color: GROUP_COLOR.heading, fontWeight: 700 }}>Purple</span> = headings,{" "}
          <span style={{ color: GROUP_COLOR.body, fontWeight: 700 }}>blue</span> = body text,{" "}
          <span style={{ color: GROUP_COLOR.label, fontWeight: 700 }}>green</span> = labels & captions,{" "}
          <span style={{ color: GROUP_COLOR.numeric, fontWeight: 700 }}>orange</span> = numbers & amounts,{" "}
          <span style={{ color: GROUP_COLOR.other, fontWeight: 700 }}>grey</span> = text set by a component (don't restyle it). Pick a style above to see every place it is used.
        </SpecNote>
      </div>

      <div>
        <SectionHeading>Checks</SectionHeading>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--core-space-2)" }}>
          {checks(hits).map((c) => (
            <div key={c.text} style={{ display: "flex", gap: "var(--core-space-2)", fontSize: "var(--typography-body-md-size)", color: "var(--core-color-text-primary)" }}>
              <span style={{ color: c.ok === "info" ? "var(--brand-text-primary-default)" : c.ok ? "var(--core-color-status-success-text)" : "var(--core-color-status-warning-text)", fontWeight: 700, flexShrink: 0 }}>{c.ok === "info" ? "ℹ" : c.ok ? "✓" : "⚠"}</span>
              {c.text}
            </div>
          ))}
        </div>
      </div>

      <div>
        <SectionHeading>Text styles on this screen — what to use and how</SectionHeading>
        <SpecTableCard>
          <thead>
            <tr style={{ textAlign: "left", color: "var(--core-color-text-tertiary)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em", background: "var(--core-color-surface-subtle, #00000008)" }}>
              {["Style", "Use it for", "Used on this screen", "Code"].map((h) => (
                <th key={h} style={{ padding: "var(--core-space-2) var(--core-space-4)", fontWeight: 700 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {keys.map((k) => {
              const rows = hits.filter((h) => h.key === k);
              const custom = k.startsWith("custom:");
              const d = TYPO[k]?.desktop;
              const own = rows.filter((r) => !r.source);
              const fromComponents = [...new Set(rows.filter((r) => r.source).map((r) => r.source!))];
              const css = !custom && d ? tokensFor(k, d).css.join("\n") : "";
              const usage = !custom && d ? usageFor(k, d) : null;
              const tag = HEADINGS.includes(k) ? k : k === "text14Bold" ? "label" : "p / span";
              return (
                <tr key={k} style={{ borderTop: "1px solid var(--core-color-border-subtle)", verticalAlign: "top" }}>
                  <td style={{ padding: "var(--core-space-3) var(--core-space-4)", whiteSpace: "nowrap" }}>
                    <div style={{ display: "inline-block", padding: "1px 6px", borderRadius: 4, background: GROUP_COLOR[groupOf(k)], color: "#FFFFFF", fontSize: 11, fontWeight: 700 }}>{custom ? "Custom" : styleLabel(k)}</div>
                    <div style={{ fontSize: 12, color: "var(--core-color-text-tertiary)", marginTop: "var(--core-space-1)" }}>{custom ? k.slice(7) : `${d?.size} / ${d?.weight} / ${d?.lineHeight}`}</div>
                  </td>
                  <td style={{ padding: "var(--core-space-3) var(--core-space-4)", fontSize: 13, color: "var(--core-color-text-primary)", minWidth: 180 }}>
                    {usage ? (
                      <>
                        <div>{usage.use}</div>
                        <div style={{ color: "var(--core-color-text-tertiary)", marginTop: "var(--core-space-1)" }}>Avoid: {usage.avoid}</div>
                      </>
                    ) : "Not a design-system style — replace it with the closest token style."}
                  </td>
                  <td style={{ padding: "var(--core-space-3) var(--core-space-4)", fontSize: 13, color: "var(--core-color-text-secondary)", minWidth: 180 }}>
                    {own.slice(0, 4).map((r, i) => <div key={i}>“{r.text.length > 48 ? `${r.text.slice(0, 48)}…` : r.text}”</div>)}
                    {own.length > 4 && <div>+{own.length - 4} more</div>}
                    {fromComponents.length > 0 && <div style={{ color: "var(--core-color-text-tertiary)", marginTop: own.length ? "var(--core-space-1)" : 0 }}>From {fromComponents.map((c) => `<${c}>`).join(", ")} — set by the component</div>}
                  </td>
                  <td style={{ padding: "var(--core-space-3) var(--core-space-4)", minWidth: 200 }}>
                    {own.length === 0 && fromComponents.length ? (
                      <span style={{ fontSize: 12, color: "var(--core-color-text-tertiary)" }}>Use the component — don't restyle its text.</span>
                    ) : css ? (
                      <div style={{ display: "flex", flexDirection: "column", gap: "var(--core-space-2)", alignItems: "flex-start" }}>
                        <code style={{ fontSize: 12 }}>{`<${tag.split(" ")[0]}>`}</code>
                        <pre style={{ margin: 0, fontSize: 11, lineHeight: 1.6, whiteSpace: "pre-wrap", color: "var(--core-color-text-secondary)", fontFamily: "var(--typography-font-family-mono, monospace)" }}>{css}</pre>
                        <CopyCss text={css} />
                      </div>
                    ) : "—"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </SpecTableCard>
      </div>
    </div>
  );
}

/** Styles the screens set explicitly (`data-type`), per screen — feeds the
 *  cross-screen guide table. */
export function readTypedText(root: HTMLElement): Record<string, string[]> {
  const out: Record<string, string[]> = {};
  root.querySelectorAll<HTMLElement>("[data-type]").forEach((el) => {
    const k = el.dataset.type!;
    const text = (el.textContent || "").trim().replace(/\s+/g, " ");
    if (!text) return;
    (out[k] ??= []).push(text);
  });
  return out;
}

export { HEADINGS as TYPE_HEADINGS, ORDER as typeOrder, groupOf as typeGroup, GROUP_COLOR as TYPE_GROUP_COLOR };
