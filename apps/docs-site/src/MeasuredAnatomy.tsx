import React, { useLayoutEffect, useRef, useState } from "react";
import { TrueBand, NodeOutline, SizeTag, type Rect } from "./AnatomyPrimitives";
import { SectionHeading, SpecTableCard, SpecTableHead, SpecRow, SpecNote } from "./AnatomySpec";

export const ANATOMY_GREEN = "#118D57";
export const ANATOMY_ORANGE = "#C2410C";
export const ANATOMY_PURPLE = "#7C3AED";
const BLUE = "#2563EB";
const GUTTER = 120;
const LANE = 24;

/** A selector (relative to the anatomy root, "" = the root itself), or an
 *  edge of an element's box: `inner` = inside the border, `content` = inside
 *  the padding. */
type Target = string | { inner: string; edge: "left" | "right" | "top" | "bottom" } | { content: string; edge: "left" | "right" | "top" | "bottom" };

export type AnatomyMark =
  | { kind: "padding"; sel: string; color?: string; edges?: Array<"top" | "right" | "bottom" | "left"> }
  | { kind: "gap"; a: Target; b: Target; axis: "x" | "y"; color?: string; label?: string; span?: string }
  | { kind: "outline"; sel: string }
  /** Width × height of a fixed-size element (icon, marker, control), badged below it. */
  | { kind: "size"; sel: string; pseudo?: "::after" | "::before"; name?: string; fill?: "w" | "h" | "both" };

export interface AnatomyLayer {
  node: string;
  cls: string;
  direction: string;
  alignment: string;
  /** Figma resizing mode — kept for reference, not displayed. */
  resizing?: string;
  spacing: string;
  /** Element to measure (relative to the anatomy root) for the W × H and radius columns. */
  sel?: string;
  /** Shown when the element is not rendered in the diagram (optional parts, closed popovers). */
  fallback?: string;
}

export interface AnatomySpecRow {
  label: string;
  token: string;
  value: string;
  standard: "pass" | "warn";
  note?: string;
}

/** Reads live computed values for the spec table. Sizes use offset sizes,
 *  which ignore the diagram's scale transform. */
export interface AnatomyQuery {
  el: (sel: string) => HTMLElement;
  px: (sel: string, prop: string) => number;
  css: (sel: string, prop: string, pseudo?: string) => string;
  size: (sel: string) => string;
  type: (sel: string) => string;
  gap: (a: Target, b: Target, axis: "x" | "y") => number;
}

interface Badge {
  x: number;
  y: number;
  lineX: number;
  lineY: number;
  axis: "v" | "h";
  value: string;
  color: string;
}

interface Drawn {
  bands: { r: Rect; color: string }[];
  outlines: Rect[];
  badges: Badge[];
  specs: AnatomySpecRow[];
}

/** Generic measured anatomy: renders the live component scaled to fit, then
 *  draws padding bands, gap bands and outlines from the real DOM so every
 *  badge reads the shipped CSS value. */
export function MeasuredAnatomy({
  heading,
  width,
  maxScale = 2,
  children,
  marks,
  layers,
  specs,
  note,
}: {
  heading: string;
  width: number;
  maxScale?: number;
  children: React.ReactNode;
  marks: AnatomyMark[];
  layers: AnatomyLayer[];
  specs: (q: AnatomyQuery) => AnatomySpecRow[];
  note?: React.ReactNode;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [rootH, setRootH] = useState(0);
  const [drawn, setDrawn] = useState<Drawn | null>(null);
  const [padLeft, setPadLeft] = useState(0);
  const [padBottom, setPadBottom] = useState(0);

  useLayoutEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const fit = () => setScale(Math.min(maxScale, Math.max(0.5, (wrap.clientWidth - GUTTER - padLeft) / width)));
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(wrap);
    return () => ro.disconnect();
  }, [width, maxScale, padLeft]);

  useLayoutEffect(() => {
    const box = boxRef.current;
    const root = rootRef.current;
    if (!box || !root) return;
    setRootH(root.offsetHeight);
    const o = box.getBoundingClientRect();
    const el = (sel: string) => (sel ? (root.querySelector(sel) as HTMLElement) : root);
    const rectOf = (e: Element): Rect => {
      const r = e.getBoundingClientRect();
      return { x: r.left - o.left, y: r.top - o.top, w: r.width, h: r.height };
    };
    const insetRect = (e: HTMLElement, kind: "inner" | "content"): Rect => {
      const s = getComputedStyle(e);
      const r = rectOf(e);
      const n = (p: string) => parseFloat(s.getPropertyValue(p)) * scale;
      const t = n("border-top-width") + (kind === "content" ? n("padding-top") : 0);
      const b = n("border-bottom-width") + (kind === "content" ? n("padding-bottom") : 0);
      const l = n("border-left-width") + (kind === "content" ? n("padding-left") : 0);
      const rr = n("border-right-width") + (kind === "content" ? n("padding-right") : 0);
      return { x: r.x + l, y: r.y + t, w: r.w - l - rr, h: r.h - t - b };
    };
    const resolve = (t: Target): Rect => {
      if (typeof t === "string") return rectOf(el(t));
      const kind = "inner" in t ? "inner" : "content";
      const base = insetRect(el("inner" in t ? t.inner : t.content), kind);
      switch (t.edge) {
        case "left": return { x: base.x, y: base.y, w: 0, h: base.h };
        case "right": return { x: base.x + base.w, y: base.y, w: 0, h: base.h };
        case "top": return { x: base.x, y: base.y, w: base.w, h: 0 };
        case "bottom": return { x: base.x, y: base.y + base.h, w: base.w, h: 0 };
      }
    };
    const gapPx = (a: Rect, b: Rect, axis: "x" | "y") => (axis === "x" ? b.x - (a.x + a.w) : b.y - (a.y + a.h));

    const R = rectOf(root);
    const bands: Drawn["bands"] = [];
    const outlines: Rect[] = [];
    const badges: Badge[] = [];
    const pushBadge = (b: Badge) => {
      const w = 12 + b.value.length * 7;
      const h = 20;
      const hit = (p: Badge) => Math.abs(p.x - b.x) < (w + 12 + p.value.length * 7) / 2 + 2 && Math.abs(p.y - b.y) < h + 2;
      let guard = 0;
      while (badges.some(hit) && guard++ < 12) {
        if (b.axis === "v") b.y -= LANE;
        else b.x -= LANE;
      }
      badges.push(b);
    };

    const sizeBadges: Badge[] = [];
    const sizeRows: AnatomySpecRow[] = [];
    for (const mk of marks) {
      if (mk.kind === "size") {
        const e = el(mk.sel);
        let r = rectOf(e);
        let wv = Math.round(r.w / scale), hv = Math.round(r.h / scale);
        if (mk.pseudo) {
          const ps = getComputedStyle(e, mk.pseudo);
          wv = Math.round(parseFloat(ps.width));
          hv = Math.round(parseFloat(ps.height));
        }
        const label = sizeLabel(wv, hv, mk.fill);
        if (mk.name) sizeRows.push({ label: `${mk.name} (W × H)`, token: sizeToken(mk.fill), value: `${label}px`, standard: "pass" });
        const b: Badge = { x: r.x + r.w / 2, y: r.y + r.h + 22, lineX: r.x + r.w / 2, lineY: r.y + r.h, axis: "v", value: label, color: ANATOMY_PURPLE };
        let guard = 0;
        while ([...badges, ...sizeBadges].some((p) => Math.abs(p.x - b.x) < (p.value.length + b.value.length) * 3.5 + 14 && Math.abs(p.y - b.y) < 22) && guard++ < 8) b.y += LANE;
        sizeBadges.push(b);
        outlines.push(r);
      } else if (mk.kind === "outline") {
        outlines.push(rectOf(el(mk.sel)));
      } else if (mk.kind === "padding") {
        const e = el(mk.sel);
        const s = getComputedStyle(e);
        const inner = insetRect(e, "inner");
        const color = mk.color ?? ANATOMY_GREEN;
        const edges = mk.edges ?? ["top", "right", "bottom", "left"];
        const v = (side: string) => Math.round(parseFloat(s.getPropertyValue(`padding-${side}`)));
        const pt = v("top") * scale, pb = v("bottom") * scale, pl = v("left") * scale, pr = v("right") * scale;
        const topRow = inner.y - 28;
        const leftCol = Math.min(R.x, inner.x) - 28;
        if (edges.includes("top") && pt) {
          bands.push({ r: { x: inner.x, y: inner.y, w: inner.w, h: pt }, color });
          pushBadge({ x: leftCol, y: inner.y + pt / 2, lineX: inner.x, lineY: inner.y + pt / 2, axis: "h", value: String(v("top")), color });
        }
        if (edges.includes("bottom") && pb) {
          bands.push({ r: { x: inner.x, y: inner.y + inner.h - pb, w: inner.w, h: pb }, color });
          pushBadge({ x: leftCol, y: inner.y + inner.h - pb / 2, lineX: inner.x, lineY: inner.y + inner.h - pb / 2, axis: "h", value: String(v("bottom")), color });
        }
        if (edges.includes("left") && pl) {
          bands.push({ r: { x: inner.x, y: inner.y + pt, w: pl, h: inner.h - pt - pb }, color });
          pushBadge({ x: inner.x + pl / 2, y: topRow, lineX: inner.x + pl / 2, lineY: inner.y + pt, axis: "v", value: String(v("left")), color });
        }
        if (edges.includes("right") && pr) {
          bands.push({ r: { x: inner.x + inner.w - pr, y: inner.y + pt, w: pr, h: inner.h - pt - pb }, color });
          pushBadge({ x: inner.x + inner.w - pr / 2, y: topRow, lineX: inner.x + inner.w - pr / 2, lineY: inner.y + pt, axis: "v", value: String(v("right")), color });
        }
      } else {
        const a = resolve(mk.a);
        const b = resolve(mk.b);
        const color = mk.color ?? ANATOMY_ORANGE;
        const span = mk.span !== undefined ? rectOf(el(mk.span)) : null;
        const value = mk.label ?? String(Math.round(gapPx(a, b, mk.axis) / scale));
        if (mk.axis === "y") {
          const x = span ? span.x : Math.min(a.x, b.x);
          const w = span ? span.w : Math.max(a.x + a.w, b.x + b.w) - x;
          const y = a.y + a.h;
          const h = b.y - y;
          bands.push({ r: { x, y, w, h }, color });
          pushBadge({ x: Math.min(R.x, x) - 28, y: y + h / 2, lineX: x, lineY: y + h / 2, axis: "h", value, color });
        } else {
          const x = a.x + a.w;
          const w = b.x - x;
          const y = span ? span.y : Math.min(a.y, b.y);
          const h = span ? span.h : Math.max(a.y + a.h, b.y + b.h) - y;
          bands.push({ r: { x, y, w, h }, color });
          pushBadge({ x: x + w / 2, y: y - 28, lineX: x + w / 2, lineY: y, axis: "v", value, color });
        }
      }
    }

    const q: AnatomyQuery = {
      el,
      px: (sel, prop) => Math.round(parseFloat(getComputedStyle(el(sel)).getPropertyValue(prop))),
      css: (sel, prop, pseudo) => getComputedStyle(el(sel), pseudo).getPropertyValue(prop),
      size: (sel) => `${el(sel).offsetWidth} × ${el(sel).offsetHeight}px`,
      type: (sel) => {
        const s = getComputedStyle(el(sel));
        return `${s.fontSize} / ${s.fontWeight} / ${s.lineHeight}`;
      },
      gap: (a, b, axis) => Math.round(gapPx(resolve(a), resolve(b), axis) / scale),
    };

    badges.push(...sizeBadges);
    setDrawn({ bands, outlines, badges, specs: [...specs(q), ...sizeRows] });
    const boxH = root.offsetHeight * scale + GUTTER;
    setPadBottom(Math.max(0, Math.ceil(Math.max(0, ...badges.map((b) => b.y + 16)) - boxH)));
    const overflowLeft = Math.max(0, -Math.min(0, ...badges.map((b) => b.x - 20)));
    setPadLeft(Math.ceil(overflowLeft / LANE) * LANE);
    // `marks`/`specs` are static per section; re-measure only on scale change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scale]);

  const minBadgeY = drawn ? Math.min(0, ...drawn.badges.map((b) => b.y - 14)) : 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
      <div>
        <SectionHeading>{heading}</SectionHeading>
        <div ref={wrapRef} style={{ maxWidth: "100%", overflowX: "auto" }}>
          <div style={{ position: "relative", paddingLeft: padLeft, paddingTop: -minBadgeY, paddingBottom: padBottom }}>
            <div ref={boxRef} style={{ position: "relative", width: width * scale + GUTTER, height: rootH * scale + GUTTER }}>
              <div style={{ position: "absolute", left: 64, top: 56, width, transform: `scale(${scale})`, transformOrigin: "0 0" }}>
                <div ref={rootRef}>{children}</div>
              </div>
              {drawn && (
                <>
                  {drawn.bands.map((b, i) => (
                    <TrueBand key={`b${i}`} r={b.r} color={b.color} />
                  ))}
                  {drawn.outlines.map((r, i) => (
                    <NodeOutline key={`o${i}`} r={r} color={BLUE} />
                  ))}
                  {drawn.badges.map((b, i) => (
                    <BadgeMark key={`g${i}`} b={b} />
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
        <SpecNote>
          <span style={{ color: ANATOMY_GREEN, fontWeight: 700 }}>Green</span> = padding,{" "}
          <span style={{ color: ANATOMY_ORANGE, fontWeight: 700 }}>orange</span> = item spacing,{" "}
          <span style={{ color: BLUE, fontWeight: 700 }}>blue</span> outlines = child nodes,{" "}
          <span style={{ color: ANATOMY_PURPLE, fontWeight: 700 }}>purple</span> = fixed width × height. Shown at {scale.toFixed(2).replace(/\.?0+$/, "")}× —
          every badge reads the real CSS value.{note ? <> {note}</> : null}
        </SpecNote>
      </div>

      <LayerTable layers={layers} root={rootRef} />
      {drawn && <SpecsTable specs={drawn.specs} />}
    </div>
  );
}

function BadgeMark({ b }: { b: Badge }) {
  const line: React.CSSProperties =
    b.axis === "v"
      ? { left: b.x, top: Math.min(b.y, b.lineY), width: 1, height: Math.abs(b.lineY - b.y) }
      : { left: Math.min(b.x, b.lineX), top: b.y, width: Math.abs(b.lineX - b.x), height: 1 };
  return (
    <>
      <div style={{ position: "absolute", ...line, background: b.color, zIndex: 3, pointerEvents: "none" }} />
      <div
        style={{
          position: "absolute",
          left: b.x,
          top: b.y,
          transform: "translate(-50%, -50%)",
          background: b.color,
          color: "white",
          fontSize: 11,
          fontWeight: 700,
          lineHeight: 1,
          padding: "var(--core-space-1) var(--core-space-1)",
          borderRadius: 4,
          zIndex: 4,
          pointerEvents: "none",
          whiteSpace: "nowrap",
        }}
      >
        {b.value}
      </div>
    </>
  );
}

const th: React.CSSProperties = { padding: "var(--core-space-2) var(--core-space-4)", fontWeight: 700 };
const td: React.CSSProperties = { padding: "var(--core-space-2) var(--core-space-4)", borderTop: "1px solid var(--core-color-border-subtle)", fontSize: 13, verticalAlign: "top" };

/** Rendered size of an element in CSS px — offset sizes ignore the diagram's
 *  scale transform; SVG elements fall back to their computed size. */
function measureEl(e: Element): { w: number; h: number } {
  if (e instanceof HTMLElement) return { w: e.offsetWidth, h: e.offsetHeight };
  const cs = getComputedStyle(e);
  return { w: parseFloat(cs.width) || 0, h: parseFloat(cs.height) || 0 };
}

export function radiusLabel(e: Element): string {
  const cs = getComputedStyle(e);
  const corners = [cs.borderTopLeftRadius, cs.borderTopRightRadius, cs.borderBottomRightRadius, cs.borderBottomLeftRadius];
  const fmt = (v: string) => {
    if (v.includes("%")) return v;
    const n = parseFloat(v);
    if (n >= 999) return "full";
    return `${Math.round(n)}px`;
  };
  const f = corners.map(fmt);
  if (f.every((v) => v === f[0])) return f[0] === "50%" ? "50% (circle)" : f[0];
  return f.map((v) => v.replace(/px$/, "")).join(" ") + "px";
}

/** Measured values read as code; explanatory phrases wrap as normal text. */
function valueCell(v?: string): React.CSSProperties {
  const isValue = !v || /^(\d|—|…|full)/.test(v) && v.length <= 16;
  return isValue ? { ...td, fontFamily: "var(--typography-font-family-mono, monospace)", whiteSpace: "nowrap" } : { ...td, color: "var(--core-color-text-secondary)" };
}

export function LayerTable({ layers, root }: { layers: AnatomyLayer[]; root?: React.RefObject<HTMLElement> }) {
  const [vals, setVals] = useState<{ size: string; radius: string }[]>([]);

  useLayoutEffect(() => {
    const measure = () => {
      const r = root?.current;
      if (!r) return;
      const rr = r.getBoundingClientRect();
      const scale = r.offsetWidth ? rr.width / r.offsetWidth : 1;
      const px = (w: number, h: number) => `${Math.round(w)} × ${Math.round(h)}px`;
      setVals(
        layers.map((l) => {
          const none = { size: l.fallback ?? "—", radius: l.fallback ? "see component" : "—" };
          if (l.sel === undefined) return none;
          if (l.sel.startsWith("union:")) {
            const els = l.sel.slice(6).split(",").map((q) => r.querySelector(q.trim())).filter(Boolean) as Element[];
            if (!els.length) return none;
            const rs = els.map((e) => e.getBoundingClientRect());
            const L = Math.min(...rs.map((x) => x.left)), T = Math.min(...rs.map((x) => x.top));
            const R = Math.max(...rs.map((x) => x.right)), B = Math.max(...rs.map((x) => x.bottom));
            return { size: px((R - L) / scale, (B - T) / scale), radius: "0px (layout frame)" };
          }
          if (l.sel.startsWith("text:")) {
            const host = r.querySelector(l.sel.slice(5));
            const node = host && [...host.childNodes].find((n) => n.nodeType === 3 && n.textContent!.trim());
            if (!node) return none;
            const range = document.createRange();
            range.selectNodeContents(node);
            const tr = range.getBoundingClientRect();
            return { size: px(tr.width / scale, tr.height / scale), radius: "— (text)" };
          }
          const e = l.sel === "" ? r : r.querySelector(l.sel);
          if (!e) return none;
          if (getComputedStyle(e).display === "none") return { size: "hidden at this width", radius: radiusLabel(e) };
          const { w, h } = measureEl(e);
          return { size: px(w, h), radius: radiusLabel(e) };
        }),
      );
    };
    measure();
    // Charts and images settle a frame or two after mount.
    const t = window.setTimeout(measure, 400);
    return () => window.clearTimeout(t);
  }, [layers, root]);

  return (
    <div>
      <SectionHeading>Layer structure — Figma node → CSS class</SectionHeading>
      <SpecTableCard>
        <thead>
          <tr style={{ textAlign: "left", color: "var(--core-color-text-tertiary)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em", background: "var(--core-color-surface-subtle, rgba(0,0,0,0.03))" }}>
            <th style={th}>Node</th>
            <th style={th}>Class</th>
            <th style={th}>Direction</th>
            <th style={th}>Alignment</th>
            <th style={th}>Size (W × H)</th>
            <th style={th}>Radius</th>
            <th style={th}>Spacing</th>
          </tr>
        </thead>
        <tbody>
          {layers.map((l, i) => (
            <tr key={l.node + l.cls}>
              <td style={{ ...td, fontWeight: 600, color: "var(--core-color-text-primary)", whiteSpace: "nowrap" }}>{l.node}</td>
              <td className="docs-cls" style={{ ...td, fontFamily: "var(--typography-font-family-mono, monospace)", fontSize: 12, color: "var(--core-color-text-tertiary)" }}>
                {l.cls.split(/(\s+)/).map((part, j) => (/\s/.test(part) ? part : <span key={j} style={{ whiteSpace: "nowrap" }}>{part}</span>))}
              </td>
              <td style={td}>{l.direction}</td>
              <td style={td}>{l.alignment}</td>
              <td style={valueCell(vals[i]?.size)}>{vals[i]?.size ?? "…"}</td>
              <td style={valueCell(vals[i]?.radius)}>{vals[i]?.radius ?? "…"}</td>
              <td style={td}>{l.spacing}</td>
            </tr>
          ))}
        </tbody>
      </SpecTableCard>
    </div>
  );
}

export function SpecsTable({ specs }: { specs: AnatomySpecRow[] }) {
  return (
    <div>
      <SectionHeading>Specs — measured from the live component</SectionHeading>
      <SpecTableCard>
        <SpecTableHead />
        <tbody>
          {specs.map((s) => (
            <SpecRow key={s.label} {...s} />
          ))}
        </tbody>
      </SpecTableCard>
    </div>
  );
}

/** Adds the layer table (and, when `specs` is given, a measured spec table)
 *  under an existing hand-built anatomy. Specs query the live component the
 *  anatomy renders; selectors resolve inside `children`. */
export interface SizeSpec {
  sel: string;
  name: string;
  fill?: "w" | "h" | "both";
  /** Push the badge further down when it would collide with the diagram's own marks. */
  offset?: number;
}

export function AnatomyTables({
  children,
  layers,
  specs,
  sizes,
}: {
  children: React.ReactNode;
  layers?: AnatomyLayer[];
  specs?: (q: AnatomyQuery) => AnatomySpecRow[];
  sizes?: SizeSpec[];
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [rows, setRows] = useState<AnatomySpecRow[] | null>(null);
  const [tags, setTags] = useState<{ r: Rect; label: string; offset: number }[]>([]);

  useLayoutEffect(() => {
    const root = ref.current;
    if (!root || (!specs && !sizes)) return;
    const el = (sel: string) => (sel ? (root.querySelector(sel) as HTMLElement) : root);
    const edgeRect = (t: Target): DOMRect => {
      if (typeof t === "string") return el(t).getBoundingClientRect();
      const e = el("inner" in t ? t.inner : t.content);
      const s = getComputedStyle(e);
      const r = e.getBoundingClientRect();
      const n = (p: string) => parseFloat(s.getPropertyValue(p));
      const c = "content" in t;
      const L = r.left + n("border-left-width") + (c ? n("padding-left") : 0);
      const R = r.right - n("border-right-width") - (c ? n("padding-right") : 0);
      const T = r.top + n("border-top-width") + (c ? n("padding-top") : 0);
      const B = r.bottom - n("border-bottom-width") - (c ? n("padding-bottom") : 0);
      const x = t.edge === "right" ? R : L;
      const y = t.edge === "bottom" ? B : T;
      return t.edge === "left" || t.edge === "right" ? new DOMRect(x, T, 0, B - T) : new DOMRect(L, y, R - L, 0);
    };
    const q: AnatomyQuery = {
      el,
      px: (sel, prop) => Math.round(parseFloat(getComputedStyle(el(sel)).getPropertyValue(prop))),
      css: (sel, prop, pseudo) => getComputedStyle(el(sel), pseudo).getPropertyValue(prop),
      size: (sel) => `${el(sel).offsetWidth} × ${el(sel).offsetHeight}px`,
      type: (sel) => {
        const s = getComputedStyle(el(sel));
        return `${s.fontSize} / ${s.fontWeight} / ${s.lineHeight}`;
      },
      gap: (a, b, axis) => {
        const ra = edgeRect(a);
        const rb = edgeRect(b);
        return Math.round(axis === "x" ? rb.left - ra.right : rb.top - ra.bottom);
      },
    };
    const o = root.getBoundingClientRect();
    const measured = (sizes ?? [])
      .map((sz) => ({ sz, e: root.querySelector(sz.sel) as HTMLElement | null }))
      .filter((x): x is { sz: SizeSpec; e: HTMLElement } => !!x.e)
      .map(({ sz, e }) => {
        const r = e.getBoundingClientRect();
        return { sz, r: { x: r.left - o.left, y: r.top - o.top, w: r.width, h: r.height }, label: sizeLabel(Math.round(r.width), Math.round(r.height), sz.fill) };
      });
    setTags(measured.map((m) => ({ r: m.r, label: m.label, offset: m.sz.offset ?? 24 })));
    const sizeRows = measured.map((m) => ({ label: `${m.sz.name} (W × H)`, token: sizeToken(m.sz.fill), value: `${m.label}px`, standard: "pass" as const }));
    const base = specs ? specs(q) : [];
    setRows(base.length || sizeRows.length ? [...base, ...sizeRows] : null);
    // `specs` is static per section.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
      <div ref={ref} style={{ position: "relative", padding: `0 var(--core-space-10) ${tags.length ? 40 : 0}px` }}>
        {children}
        {tags.map((t, i) => (
          <SizeTag key={i} r={t.r} label={t.label} offset={t.offset} />
        ))}
      </div>
      {layers && <LayerTable layers={layers} root={ref} />}
      {rows && <SpecsTable specs={rows} />}
    </div>
  );
}

/** Always the measured pixel size, e.g. "48 × 32". Whether a dimension
 *  stretches with its container is stated in the spec row token instead. */
export function sizeLabel(w: number, h: number, _fill?: "w" | "h" | "both") {
  return `${w} × ${h}`;
}

export function sizeToken(fill?: "w" | "h" | "both") {
  if (fill === "w") return "width stretches to container · height fixed";
  if (fill === "h") return "width fixed · height stretches to container";
  if (fill === "both") return "stretches to container (size shown as rendered)";
  return "fixed";
}

