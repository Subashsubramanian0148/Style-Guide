import React, { useLayoutEffect, useMemo, useRef, useState } from "react";
import { SectionHeading, toHexColors } from "./AnatomySpec";
import { tokenFor, PROPS, isTransparent } from "./AnatomyColors";
import { styleLabel } from "./ScreenTypeMap";
import { usePreviewMode } from "./PreviewModeContext";
import { FrameCanvas, screenRect } from "./ScreenFrameCanvas";

/** Figma-style screen specification (the "Specs" layout the design file
 *  uses): an Anatomy exhibit — every element numbered, with its attributes —
 *  and a Layout & spacing inspector — one container at a time, outlined,
 *  with padding, item spacing, direction and alignment. Everything is read
 *  from the rendered DOM, so the numbers are the shipped CSS. */

const DOT = "#C54600";
const BLUE = "#2563EB";
const GREEN = "#118D57";
const ORANGE = "#C2410C";
const GUTTER = 36;

type Kind = "component" | "text" | "frame";
interface Rect { x: number; y: number; w: number; h: number }
interface Item { n: number; kind: Kind; name: string; attrs: Array<[string, string]>; el: HTMLElement; layout: boolean }

/* ---------- naming ---------- */

const COMPONENTS: Array<[string, (el: HTMLElement) => string]> = [
  [".cds-app-header", () => "App header"],
  [".cds-app-shell-sidebar", () => "Sidebar (rail)"],
  [".cds-app-footer", () => "App footer"],
  [".cds-account-trigger", () => "Avatar menu trigger"],
  [".cds-app-header-icon-btn, .cds-icon-btn", (el) => `Icon button — ${el.getAttribute("aria-label") ?? ""}`],
  [".cds-btn", (el) => {
    const v = [...el.classList].find((c) => /^cds-btn--(primary|secondary|tertiary|destructive)$/.test(c))?.slice(9) ?? "primary";
    const s = [...el.classList].find((c) => /^cds-btn--(sm|md|lg)$/.test(c))?.slice(9) ?? "md";
    return `Button — ${v} · ${s} · “${el.textContent?.trim()}”`;
  }],
  [".cds-badge", (el) => `Badge — “${el.textContent?.trim()}”`],
  [".cds-quicklink", (el) => `Quick link — “${el.textContent?.trim()}”`],
  [".cds-card", (el) => (el.classList.contains("cds-card--outlined") ? "Card — outlined" : "Card")],
  [".cds-stepper", () => "Stepper — vertical"],
  ["[role=tablist]", () => "Tabs"],
  [".cds-chart", () => "Line chart"],
  [".cds-table-wrap, table", () => "Table"],
  [".cds-select-wrap", () => "Select"],
  [".cds-input-affix-wrap, input.cds-input", () => "Input"],
  [".cds-checkbox", (el) => `Checkbox — “${el.textContent?.trim()}”`],
  [".cds-radio", (el) => `Radio — “${el.textContent?.trim()}”`],
  [".cds-field", (el) => `Field — “${el.querySelector(".cds-label")?.textContent?.trim() ?? ""}”`],
];

const REACT: Record<string, (el: HTMLElement) => string> = {
  "App header": () => "<AppHeader brand utilities account />",
  "Sidebar (rail)": () => '<AppSidebar variant="rail" items />',
  "App footer": () => "<AppFooter copyright links />",
  Card: () => "<Card>",
  "Card — outlined": () => '<Card variant="outlined">',
  Tabs: () => "<Tabs items />",
  "Stepper — vertical": () => '<Stepper orientation="vertical" steps currentIndex />',
  "Line chart": () => "<LineChartCard data xKey series title />",
  Table: () => "<Table columns rows />",
  Select: () => "<Select options />",
  Input: () => "<Input />",
};

function componentOf(el: HTMLElement): string | null {
  for (const [sel, name] of COMPONENTS) if (el.matches(sel)) return name(el);
  return null;
}

function reactFor(name: string, el: HTMLElement): string | null {
  if (name.startsWith("Button")) {
    const [, v, s] = name.match(/— (\w+) · (\w+)/) ?? [];
    return `<Button variant="${v}" size="${s}">`;
  }
  if (name.startsWith("Badge")) {
    const tone = [...el.classList].find((c) => /^cds-badge--(success|warning|danger|info|neutral|primary)$/.test(c))?.slice(11);
    return `<Badge tone="${tone ?? "neutral"}">`;
  }
  if (name.startsWith("Icon button")) return "<IconButton aria-label />";
  if (name.startsWith("Quick link")) return "<CardQuickLink icon label />";
  if (name.startsWith("Checkbox")) return "<Checkbox label />";
  if (name.startsWith("Radio")) return "<Radio label />";
  if (name.startsWith("Field")) return "<Field label>{(p) => …}</Field>";
  const key = Object.keys(REACT).find((k) => name === k);
  return key ? REACT[key](el) : null;
}

/* ---------- attributes ---------- */

const px = (v: string) => `${Math.round(parseFloat(v))}`;
const WEIGHTS: Record<string, string> = { "400": "Regular", "500": "Medium", "600": "SemiBold", "700": "Bold", "800": "ExtraBold" };

function colorAttr(el: HTMLElement, i: 0 | 1 | 2, value: string): string {
  const token = tokenFor(el, PROPS[i], value);
  const hex = toHexColors(value);
  return token && token !== "—" && token !== "inherited" ? `${hex} · ${token}` : hex;
}

function boxAttrs(el: HTMLElement): Array<[string, string]> {
  const cs = getComputedStyle(el);
  const out: Array<[string, string]> = [["Width", `${el.offsetWidth}`], ["Height", `${el.offsetHeight}`]];
  if (!isTransparent(cs.backgroundColor)) out.push(["Background color", colorAttr(el, 1, cs.backgroundColor)]);
  const r = parseFloat(cs.borderTopLeftRadius);
  if (r) out.push(["Corner radius", r > 999 ? "Full" : px(cs.borderTopLeftRadius)]);
  if (parseFloat(cs.borderTopWidth)) out.push(["Border", `${px(cs.borderTopWidth)} · ${colorAttr(el, 2, cs.borderTopColor)}`]);
  return out;
}

function textAttrs(el: HTMLElement): Array<[string, string]> {
  const cs = getComputedStyle(el);
  const t = el.dataset.type;
  const out: Array<[string, string]> = [];
  if (t) out.push(["Text style", styleLabel(t)]);
  out.push(["Text color", colorAttr(el, 0, cs.color)]);
  out.push(["Font family", cs.fontFamily.split(",")[0].replace(/["']/g, "")]);
  out.push(["Font weight", WEIGHTS[cs.fontWeight] ?? cs.fontWeight]);
  out.push(["Font size", px(cs.fontSize)]);
  out.push(["Line height", cs.lineHeight === "normal" ? "Auto" : px(cs.lineHeight)]);
  return out;
}

const isLayout = (el: HTMLElement) => /flex|grid/.test(getComputedStyle(el).display);
const visible = (el: HTMLElement) => el.getClientRects().length > 0 && getComputedStyle(el).visibility !== "hidden";

function collectItems(root: HTMLElement, screenName: string): Item[] {
  const items: Item[] = [];
  let n = 0;
  const first = root.firstElementChild as HTMLElement | null;
  if (first) items.push({ n: ++n, kind: "frame", name: screenName, attrs: boxAttrs(first), el: first, layout: false });
  const tw = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT);
  while (tw.nextNode()) {
    const el = tw.currentNode as HTMLElement;
    if (!visible(el) || el.closest(".cds-visually-hidden, svg")) continue;
    const comp = componentOf(el);
    const insideComp = el.parentElement?.closest(".cds-btn, .cds-badge, .cds-quicklink, .cds-field, .cds-checkbox, .cds-radio, .cds-stepper, [role=tablist], .cds-chart, table, .cds-app-header, .cds-app-sidebar, .cds-select-wrap");
    if (comp) {
      if (insideComp && !el.matches(".cds-app-header-icon-btn, .cds-account-trigger")) continue;
      const react = reactFor(comp, el);
      items.push({ n: ++n, kind: "component", name: comp, attrs: [...(react ? [["React", react] as [string, string]] : []), ...boxAttrs(el)], el, layout: isLayout(el) });
    } else if (el.dataset.spec) {
      items.push({ n: ++n, kind: "frame", name: el.dataset.spec, attrs: boxAttrs(el), el, layout: isLayout(el) });
    } else if (el.dataset.type && !insideComp) {
      const text = (el.textContent || "").trim().replace(/\s+/g, " ");
      items.push({ n: ++n, kind: "text", name: text.length > 48 ? `${text.slice(0, 48)}…` : text, attrs: textAttrs(el), el, layout: false });
    } else if (el.matches(".cds-app-main")) {
      items.push({ n: ++n, kind: "frame", name: "Main content", attrs: boxAttrs(el), el, layout: isLayout(el) || true });
    }
  }
  return items;
}

/* ---------- layout properties ---------- */

const H = { "flex-start": "left", start: "left", normal: "left", left: "left", center: "center", "flex-end": "right", end: "right", right: "right", "space-between": "space between", "space-around": "space around", "space-evenly": "space evenly", stretch: "left" } as Record<string, string>;
const V = { "flex-start": "Top", start: "Top", normal: "Top", stretch: "Top", center: "Middle", "flex-end": "Bottom", end: "Bottom", baseline: "Baseline" } as Record<string, string>;

function spaceToken(v: number): string {
  const map: Record<number, string> = { 4: "1", 8: "2", 12: "3", 16: "4", 20: "5", 24: "6", 32: "8", 40: "10", 48: "12", 64: "16" };
  return map[v] ? ` · core-space-${map[v]}` : v ? " · not a token" : "";
}

function layoutProps(el: HTMLElement): Array<[string, string]> {
  const cs = getComputedStyle(el);
  const grid = cs.display.includes("grid");
  const row = !grid && cs.flexDirection.startsWith("row");
  const out: Array<[string, string]> = [];
  if (grid) {
    const cols = cs.gridTemplateColumns.split(" ").filter(Boolean);
    out.push(["Direction", `Grid · ${cols.length} column${cols.length > 1 ? "s" : ""} (${cols.map(px).join(" / ")})`]);
    out.push(["Alignment", `${V[cs.alignItems] ?? "Top"} left`]);
  } else {
    out.push(["Direction", row ? "Horizontal" : "Vertical"]);
    const main = H[cs.justifyContent] ?? cs.justifyContent;
    const cross = cs.alignItems;
    const align = row
      ? (main.startsWith("space") ? `${V[cross] ?? "Top"}, ${main}` : `${V[cross] ?? "Top"} ${main}`)
      : (main.startsWith("space") ? `${H[cross] ?? "left"}, ${main}`.replace(/^./, (c) => c.toUpperCase()) : `${({ left: "Top", center: "Middle", right: "Bottom" } as Record<string, string>)[main] ?? "Top"} ${H[cross] ?? "left"}`);
    out.push(["Alignment", align]);
  }
  const parent = el.parentElement;
  const pw = parent ? parent.clientWidth - parseFloat(getComputedStyle(parent).paddingLeft) - parseFloat(getComputedStyle(parent).paddingRight) : 0;
  out.push(["Width", `${el.offsetWidth}${Math.abs(el.offsetWidth - pw) <= 1 ? " (fills container)" : el.style.width ? " (fixed)" : " (fits content)"}`]);
  out.push(["Height", `${el.offsetHeight}${el.style.height ? " (fixed)" : " (fits content)"}`]);
  const rg = parseFloat(cs.rowGap) || 0;
  const cg = parseFloat(cs.columnGap) || 0;
  if (grid && rg !== cg) {
    out.push(["Column gap", `${Math.round(cg)}${spaceToken(Math.round(cg))}`]);
    out.push(["Row gap", `${Math.round(rg)}${spaceToken(Math.round(rg))}`]);
  } else {
    const g = Math.round(row ? cg : rg || cg);
    const auto = /space-(between|around|evenly)/.test(cs.justifyContent);
    out.push(["Item spacing", auto ? `Auto (${cs.justifyContent.replace("-", " ")}${g ? `, min ${g}` : ""})` : `${g}${spaceToken(g)}`]);
  }
  const p = ["Top", "Right", "Bottom", "Left"].map((s) => Math.round(parseFloat(cs.getPropertyValue(`padding-${s.toLowerCase()}`))));
  if (p.every((v) => v === p[0])) out.push(["Padding", `${p[0]}${spaceToken(p[0])}`]);
  else ["Top", "Right", "Bottom", "Left"].forEach((s, i) => p[i] && out.push([`Padding ${s.toLowerCase()}`, `${p[i]}${spaceToken(p[i])}`]));
  return out;
}

/* ---------- shared artwork frame ---------- */

function useArtwork(width: number, reserve: number) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.5);
  useLayoutEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const fit = () => setScale(Math.max(0.3, Math.min(1, (wrap.clientWidth - reserve) / width)));
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(wrap);
    return () => ro.disconnect();
  }, [width, reserve]);
  return { wrapRef, scale };
}

function rectIn(box: HTMLElement, el: HTMLElement): Rect {
  const o = box.getBoundingClientRect();
  const r = screenRect(el);
  return { x: r.left - o.left, y: r.top - o.top, w: r.width, h: r.height };
}

function KindIcon({ kind }: { kind: Kind }) {
  const glyph = kind === "component" ? "◇" : kind === "text" ? "T" : "#";
  return <span aria-hidden="true" style={{ width: 16, flexShrink: 0, textAlign: "center", color: "var(--core-color-text-tertiary)", fontFamily: kind === "text" ? "serif" : undefined }}>{glyph}</span>;
}

function DotMark({ n, x, y, active }: { n: number; x: number; y: number; active?: boolean }) {
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: "translate(-50%, -50%)", minWidth: active ? 22 : 18, height: active ? 22 : 18, padding: "0 3px", borderRadius: 999, background: DOT, color: "#FFFFFF", fontSize: active ? 11 : 9, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 4, boxShadow: active ? `0 0 0 3px ${DOT}40` : undefined, pointerEvents: "none" }}>
      {/* Wrapped in a span so the page's badge-overlap nudger leaves dots where they are placed. */}
      <span>{n}</span>
    </div>
  );
}

function AttrList({ attrs }: { attrs: Array<[string, string]> }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--core-space-1)", paddingLeft: 26 }}>
      {attrs.map(([k, v]) => (
        <div key={k} style={{ fontSize: 12, lineHeight: "18px", color: "var(--core-color-text-secondary)" }}>
          {k}: <span style={{ color: "var(--core-color-text-primary)", fontFamily: k === "React" ? "var(--typography-font-family-mono, monospace)" : undefined }}>{v}</span>
        </div>
      ))}
    </div>
  );
}

/* ---------- Anatomy ---------- */

interface Placed { item: Item; r: Rect; dot: { x: number; y: number }; end: { x: number; y: number } }

function placeDots(items: Item[], box: HTMLElement, aw: number, ah: number): Placed[] {
  const sides: Record<"l" | "r" | "t" | "b", Placed[]> = { l: [], r: [], t: [], b: [] };
  for (const item of items.slice(1)) {
    const r = rectIn(box, item.el);
    if (!r.w || !r.h) continue;
    const cx = r.x + r.w / 2 - GUTTER;
    const cy = r.y + r.h / 2 - GUTTER;
    const d = { l: cx, r: aw - cx, t: cy, b: ah - cy };
    const side = (Object.keys(d) as Array<keyof typeof d>).reduce((a, b) => (d[a] <= d[b] ? a : b));
    sides[side].push({ item, r, dot: { x: 0, y: 0 }, end: { x: 0, y: 0 } });
  }
  // Keep every dot inside its gutter: move overflow to the least-used side,
  // then space dots evenly when a side is still crowded.
  const len = { l: ah, r: ah, t: aw, b: aw };
  const cap = (k: keyof typeof sides) => Math.floor(len[k] / 20);
  (Object.keys(sides) as Array<keyof typeof sides>).forEach((k) => {
    while (sides[k].length > cap(k)) {
      const target = (Object.keys(sides) as Array<keyof typeof sides>).filter((o) => o !== k).sort((a, b) => sides[a].length / cap(a) - sides[b].length / cap(b))[0];
      if (sides[target].length >= cap(target)) break;
      sides[target].push(sides[k].pop()!);
    }
  });
  const spread = (list: Placed[], key: "x" | "y", start: number, end: number, center: (p: Placed) => number) => {
    list.sort((a, b) => center(a) - center(b));
    const step = Math.min(20, (end - start) / Math.max(1, list.length));
    let prev = start - step;
    list.forEach((p) => { p.dot[key] = Math.max(center(p), prev + step); prev = p.dot[key]; });
    let next = end + step;
    for (let i = list.length - 1; i >= 0; i--) { list[i].dot[key] = Math.min(list[i].dot[key], next - step); next = list[i].dot[key]; }
  };
  spread(sides.l, "y", GUTTER, GUTTER + ah, (p) => p.r.y + p.r.h / 2);
  spread(sides.r, "y", GUTTER, GUTTER + ah, (p) => p.r.y + p.r.h / 2);
  spread(sides.t, "x", GUTTER, GUTTER + aw, (p) => p.r.x + p.r.w / 2);
  spread(sides.b, "x", GUTTER, GUTTER + aw, (p) => p.r.x + p.r.w / 2);
  const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
  sides.l.forEach((p) => { p.dot.x = GUTTER / 2; p.end = { x: p.r.x, y: clamp(p.dot.y, p.r.y, p.r.y + p.r.h) }; });
  sides.r.forEach((p) => { p.dot.x = GUTTER * 1.5 + aw; p.end = { x: p.r.x + p.r.w, y: clamp(p.dot.y, p.r.y, p.r.y + p.r.h) }; });
  sides.t.forEach((p) => { p.dot.y = GUTTER / 2; p.end = { x: clamp(p.dot.x, p.r.x, p.r.x + p.r.w), y: p.r.y }; });
  sides.b.forEach((p) => { p.dot.y = GUTTER * 1.5 + ah; p.end = { x: clamp(p.dot.x, p.r.x, p.r.x + p.r.w), y: p.r.y + p.r.h }; });
  return [...sides.l, ...sides.r, ...sides.t, ...sides.b];
}

function Anatomy({ width, name, children, frame, onPick }: { width: number; name: string; children?: React.ReactNode; frame?: string; onPick: (el: HTMLElement) => void }) {
  const [frameRoot, setFrameRoot] = useState<HTMLElement | null>(null);
  const [frameTick, setFrameTick] = useState(0);
  const { wrapRef, scale } = useArtwork(width, 2 * GUTTER);
  const { mode } = usePreviewMode();
  const boxRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [placed, setPlaced] = useState<Placed[]>([]);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [hover, setHover] = useState<number | null>(null);

  useLayoutEffect(() => {
    const measure = () => {
      const root = frame ? frameRoot : rootRef.current;
      const box = boxRef.current;
      if (!root || !box) return;
      const aw = width * scale;
      const ah = root.offsetHeight * scale;
      setSize({ w: aw, h: ah });
      const list = collectItems(root, name);
      setItems(list);
      setPlaced(placeDots(list, box, aw, ah));
    };
    measure();
    const t = window.setTimeout(measure, 600);
    return () => window.clearTimeout(t);
  }, [scale, width, name, mode, frameRoot, frameTick]);

  const hovered = placed.find((p) => p.item.n === hover);

  return (
    <div>
      <SectionHeading>Anatomy</SectionHeading>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--core-space-6)", alignItems: "flex-start" }}>
        <div ref={wrapRef} style={{ flex: "1 1 520px", minWidth: 0 }}>
          <div ref={boxRef} style={{ position: "relative", width: size.w + 2 * GUTTER, height: size.h + 2 * GUTTER, background: "var(--core-color-surface-sunken, #EEEEF2)", borderRadius: 8 }}>
            <div style={{ position: "absolute", left: GUTTER, top: GUTTER, width, transform: `scale(${scale})`, transformOrigin: "0 0", pointerEvents: "none" }}>
              {frame ? <FrameCanvas src={frame} width={width} onRoot={(r) => { setFrameRoot(r); setFrameTick((t) => t + 1); }} /> : <div ref={rootRef} data-spec-root="1">{children}</div>}
            </div>
            <svg width={size.w + 2 * GUTTER} height={size.h + 2 * GUTTER} style={{ position: "absolute", inset: 0, zIndex: 3, pointerEvents: "none" }}>
              {placed.map((p) => (
                <g key={p.item.n} opacity={hover === null || hover === p.item.n ? 1 : 0.25}>
                  <line x1={p.dot.x} y1={p.dot.y} x2={p.end.x} y2={p.end.y} stroke={DOT} strokeWidth={hover === p.item.n ? 1.5 : 0.75} />
                  <circle cx={p.end.x} cy={p.end.y} r={1.5} fill={DOT} />
                </g>
              ))}
            </svg>
            {hovered && <div style={{ position: "absolute", left: hovered.r.x, top: hovered.r.y, width: hovered.r.w, height: hovered.r.h, outline: `2px solid ${BLUE}`, background: `${BLUE}1A`, zIndex: 2, pointerEvents: "none" }} />}
            {placed.map((p) => <DotMark key={p.item.n} n={p.item.n} x={p.dot.x} y={p.dot.y} active={hover === p.item.n} />)}
          </div>
        </div>
        <div style={{ flex: "0 1 340px", minWidth: 260, maxHeight: Math.max(480, size.h + 2 * GUTTER), overflowY: "auto", display: "flex", flexDirection: "column", gap: "var(--core-space-4)", paddingRight: "var(--core-space-2)" }}>
          {items.map((it) => (
            <div
              key={it.n}
              onMouseEnter={() => setHover(it.n)}
              onMouseLeave={() => setHover(null)}
              onClick={() => it.layout && onPick(it.el)}
              style={{ display: "flex", flexDirection: "column", gap: "var(--core-space-1)", padding: "var(--core-space-2)", borderRadius: 8, background: hover === it.n ? "var(--core-color-surface-sunken, #EEEEF2)" : "transparent", cursor: it.layout ? "pointer" : "default" }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ minWidth: 20, height: 20, borderRadius: 999, background: DOT, color: "#FFFFFF", fontSize: 11, fontWeight: 700, display: "inline-flex", alignItems: "center", justifyContent: "center", padding: "0 4px", flexShrink: 0 }}>{it.n}</span>
                <KindIcon kind={it.kind} />
                <strong style={{ fontSize: 14, color: "var(--core-color-text-primary)" }}>{it.name}</strong>
              </div>
              <AttrList attrs={it.attrs} />
              {it.layout && <span style={{ paddingLeft: 26, fontSize: 11, color: BLUE }}>View layout & spacing →</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------- Layout & spacing ---------- */

function Band({ r, color, label }: { r: Rect; color: string; label: string }) {
  if (r.w <= 0 || r.h <= 0) return null;
  return (
    <>
      <div style={{ position: "absolute", left: r.x, top: r.y, width: r.w, height: r.h, background: `${color}59`, zIndex: 3, pointerEvents: "none" }} />
      <div style={{ position: "absolute", left: r.x + r.w / 2, top: r.y + r.h / 2, transform: "translate(-50%, -50%)", background: color, color: "#FFFFFF", fontSize: 10, fontWeight: 700, lineHeight: "14px", padding: "0 4px", borderRadius: 3, zIndex: 5, pointerEvents: "none" }}><span>{label}</span></div>
    </>
  );
}

function Layout({ width, name, children, frame, pick }: { width: number; name: string; children?: React.ReactNode; frame?: string; pick: { el: HTMLElement | null; tick: number } }) {
  const [frameRoot, setFrameRoot] = useState<HTMLElement | null>(null);
  const [frameTick, setFrameTick] = useState(0);
  const { wrapRef, scale } = useArtwork(width, 0);
  const { mode } = usePreviewMode();
  const boxRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const [nodes, setNodes] = useState<Item[]>([]);
  const [index, setIndex] = useState(0);
  const [h, setH] = useState(0);
  const [, force] = useState(0);

  useLayoutEffect(() => {
    const measure = () => {
      const root = frame ? frameRoot : rootRef.current;
      if (!root) return;
      setH(root.offsetHeight * scale);
      setNodes(collectItems(root, name).filter((i) => i.layout));
      force((x) => x + 1);
    };
    measure();
    const t = window.setTimeout(measure, 600);
    return () => window.clearTimeout(t);
  }, [scale, width, name, mode, frameRoot, frameTick]);

  // Jump here when a node is picked in the Anatomy list (matched by position in the tree).
  useLayoutEffect(() => {
    if (!pick.el || !nodes.length) return;
    const path = (el: HTMLElement, stop: HTMLElement | null): number[] => {
      const out: number[] = [];
      let cur: HTMLElement | null = el;
      while (cur && cur.parentElement && cur !== stop) { out.unshift([...cur.parentElement.children].indexOf(cur)); cur = cur.parentElement; if (cur.dataset.specRoot) break; }
      return out;
    };
    const want = path(pick.el, null).join(".");
    const i = nodes.findIndex((n) => path(n.el, null).join(".") === want);
    if (i >= 0) {
      setIndex(i);
      boxRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [pick.tick, nodes]);

  const node = nodes[Math.min(index, nodes.length - 1)];
  const drawn = useMemo(() => {
    const box = boxRef.current;
    if (!node || !box) return null;
    const el = node.el;
    const cs = getComputedStyle(el);
    const r = rectIn(box, el);
    const s = scale;
    const bl = parseFloat(cs.borderLeftWidth) * s, bt = parseFloat(cs.borderTopWidth) * s;
    const pad = { t: parseFloat(cs.paddingTop), r: parseFloat(cs.paddingRight), b: parseFloat(cs.paddingBottom), l: parseFloat(cs.paddingLeft) };
    const inner = { x: r.x + bl, y: r.y + bt, w: r.w - 2 * bl, h: r.h - 2 * bt };
    const bands: Array<{ r: Rect; color: string; label: string }> = [];
    if (pad.t) bands.push({ r: { x: inner.x, y: inner.y, w: inner.w, h: pad.t * s }, color: GREEN, label: `${Math.round(pad.t)}` });
    if (pad.b) bands.push({ r: { x: inner.x, y: inner.y + inner.h - pad.b * s, w: inner.w, h: pad.b * s }, color: GREEN, label: `${Math.round(pad.b)}` });
    if (pad.l) bands.push({ r: { x: inner.x, y: inner.y + pad.t * s, w: pad.l * s, h: inner.h - (pad.t + pad.b) * s }, color: GREEN, label: `${Math.round(pad.l)}` });
    if (pad.r) bands.push({ r: { x: inner.x + inner.w - pad.r * s, y: inner.y + pad.t * s, w: pad.r * s, h: inner.h - (pad.t + pad.b) * s }, color: GREEN, label: `${Math.round(pad.r)}` });
    const kids = ([...el.children] as HTMLElement[]).filter((k) => visible(k) && getComputedStyle(k).position !== "absolute").map((k) => rectIn(box, k));
    const row = cs.display.includes("grid") ? null : cs.flexDirection.startsWith("row");
    for (let i = 0; i < kids.length - 1; i++) {
      const a = kids[i], b = kids[i + 1];
      if ((row === true || row === null) && Math.abs(a.y - b.y) < 2 && b.x > a.x + a.w + 0.5) {
        bands.push({ r: { x: a.x + a.w, y: Math.min(a.y, b.y), w: b.x - (a.x + a.w), h: Math.max(a.h, b.h) }, color: ORANGE, label: /space-(between|around|evenly)/.test(cs.justifyContent) ? "Auto" : `${Math.round((b.x - (a.x + a.w)) / s)}` });
      } else if ((row === false || row === null) && b.y > a.y + a.h + 0.5) {
        const x = Math.min(a.x, b.x);
        bands.push({ r: { x, y: a.y + a.h, w: Math.max(a.x + a.w, b.x + b.w) - x, h: b.y - (a.y + a.h) }, color: ORANGE, label: `${Math.round((b.y - (a.y + a.h)) / s)}` });
      }
    }
    return { r, kids, bands };
  }, [node, scale, h]);

  const onArtworkClick = (e: React.MouseEvent) => {
    const box = boxRef.current;
    if (!box) return;
    const o = box.getBoundingClientRect();
    const x = e.clientX - o.left, y = e.clientY - o.top;
    let best = -1, area = Infinity;
    nodes.forEach((n, i) => {
      const r = rectIn(box, n.el);
      if (x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h && r.w * r.h < area) { best = i; area = r.w * r.h; }
    });
    if (best >= 0) setIndex(best);
  };

  return (
    <div>
      <SectionHeading>Layout and spacing</SectionHeading>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--core-space-6)", alignItems: "flex-start" }}>
        <div ref={wrapRef} style={{ flex: "1 1 520px", minWidth: 0 }}>
          <div ref={boxRef} onClick={onArtworkClick} style={{ position: "relative", width: width * scale, height: h, overflow: "hidden", borderRadius: 8, cursor: "crosshair" }}>
            <div style={{ position: "absolute", left: 0, top: 0, width, transform: `scale(${scale})`, transformOrigin: "0 0", pointerEvents: "none" }}>
              {frame ? <FrameCanvas src={frame} width={width} onRoot={(r) => { setFrameRoot(r); setFrameTick((t) => t + 1); }} /> : <div ref={rootRef} data-spec-root="1">{children}</div>}
            </div>
            {drawn && (
              <>
                <div style={{ position: "absolute", left: drawn.r.x, top: drawn.r.y, width: drawn.r.w, height: drawn.r.h, boxShadow: `0 0 0 4000px ${mode === "dark" ? "rgba(17, 16, 23, 0.72)" : "rgba(247, 247, 249, 0.72)"}`, outline: `2px solid ${BLUE}`, zIndex: 2, pointerEvents: "none" }} />
                {drawn.kids.map((k, i) => <div key={i} style={{ position: "absolute", left: k.x, top: k.y, width: k.w, height: k.h, background: `${BLUE}14`, outline: `1px dashed ${BLUE}80`, zIndex: 2, pointerEvents: "none" }} />)}
                {drawn.bands.map((b, i) => <Band key={i} {...b} />)}
              </>
            )}
          </div>
          <p style={{ margin: "var(--core-space-2) 0 0", fontSize: 12, color: "var(--core-color-text-tertiary)" }}>Click any area of the screen to inspect the container under the pointer.</p>
        </div>
        {node && (
          <div style={{ flex: "0 1 340px", minWidth: 260, display: "flex", flexDirection: "column", gap: "var(--core-space-4)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "var(--core-space-2)" }}>
              <button type="button" onClick={() => setIndex((i) => Math.max(0, i - 1))} disabled={index === 0} style={navBtn}>‹</button>
              <select value={index} onChange={(e) => setIndex(Number(e.target.value))} style={{ flex: 1, minWidth: 0, padding: "var(--core-space-1) var(--core-space-2)", borderRadius: 6, border: "1px solid var(--core-color-border-default)", background: "var(--core-color-surface-default)", color: "var(--core-color-text-primary)", fontSize: 13 }}>
                {nodes.map((n, i) => <option key={i} value={i}>{`${i + 1}. ${n.name}`}</option>)}
              </select>
              <button type="button" onClick={() => setIndex((i) => Math.min(nodes.length - 1, i + 1))} disabled={index >= nodes.length - 1} style={navBtn}>›</button>
            </div>
            <div style={{ fontSize: 12, color: "var(--core-color-text-tertiary)" }}>Node {Math.min(index, nodes.length - 1) + 1} of {nodes.length}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <KindIcon kind={node.kind} />
              <strong style={{ fontSize: 16, color: "var(--core-color-text-primary)" }}>{node.name}</strong>
            </div>
            <div style={{ marginLeft: -26 }}><AttrList attrs={layoutProps(node.el)} /></div>
            <div style={{ fontSize: 12, color: "var(--core-color-text-secondary)", display: "flex", flexDirection: "column", gap: 4 }}>
              <span><span style={{ color: BLUE, fontWeight: 700 }}>Blue</span> outline = selected node · dashed = its children</span>
              <span><span style={{ color: GREEN, fontWeight: 700 }}>Green</span> = padding · <span style={{ color: ORANGE, fontWeight: 700 }}>orange</span> = item spacing</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const navBtn: React.CSSProperties = { width: 32, height: 32, borderRadius: 6, border: "1px solid var(--core-color-border-default)", background: "var(--core-color-surface-default)", color: "var(--core-color-text-primary)", cursor: "pointer", fontSize: 16 };

/** Anatomy + Layout and spacing for one screen, like the Figma spec sheet. */
export function ScreenSpec({ width, name, render, frame }: { width: number; name: string; render?: () => React.ReactNode; frame?: string }) {
  const [pick, setPick] = useState<{ el: HTMLElement | null; tick: number }>({ el: null, tick: 0 });
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 48 }}>
      <Anatomy width={width} name={name} frame={frame} onPick={(el) => setPick((p) => ({ el, tick: p.tick + 1 }))}>{render?.()}</Anatomy>
      <Layout width={width} name={name} frame={frame} pick={pick}>{render?.()}</Layout>
    </div>
  );
}
