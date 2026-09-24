import React, { useLayoutEffect, useRef, useState } from "react";
import { TrueBand, NodeOutline, type Rect } from "./AnatomyPrimitives";
import { SectionHeading, SpecTableCard, SpecTableHead, SpecRow, SpecNote } from "./AnatomySpec";

export const ANATOMY_GREEN = "#118D57";
export const ANATOMY_ORANGE = "#C2410C";
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
  | { kind: "outline"; sel: string };

export interface AnatomyLayer {
  node: string;
  cls: string;
  direction: string;
  alignment: string;
  resizing: string;
  spacing: string;
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

    for (const mk of marks) {
      if (mk.kind === "outline") {
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

    setDrawn({ bands, outlines, badges, specs: specs(q) });
    const overflowLeft = Math.max(0, -Math.min(0, ...badges.map((b) => b.x - 20)));
    setPadLeft(Math.ceil(overflowLeft / LANE) * LANE);
    // `marks`/`specs` are static per section; re-measure only on scale change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scale]);

  const th: React.CSSProperties = { padding: "var(--core-space-2) var(--core-space-4)", fontWeight: 700 };
  const td: React.CSSProperties = { padding: "var(--core-space-2) var(--core-space-4)", borderTop: "1px solid var(--core-color-border-subtle)", fontSize: 13, verticalAlign: "top" };
  const minBadgeY = drawn ? Math.min(0, ...drawn.badges.map((b) => b.y - 14)) : 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
      <div>
        <SectionHeading>{heading}</SectionHeading>
        <div ref={wrapRef} style={{ maxWidth: "100%", overflowX: "auto" }}>
          <div style={{ position: "relative", paddingLeft: padLeft, paddingTop: -minBadgeY }}>
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
          <span style={{ color: BLUE, fontWeight: 700 }}>blue</span> outlines = child nodes. Shown at {scale.toFixed(2).replace(/\.?0+$/, "")}× —
          every badge reads the real CSS value.{note ? <> {note}</> : null}
        </SpecNote>
      </div>

      <div>
        <SectionHeading>Layer structure — Figma node → CSS class</SectionHeading>
        <SpecTableCard>
          <thead>
            <tr style={{ textAlign: "left", color: "var(--core-color-text-tertiary)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em", background: "var(--core-color-surface-subtle, rgba(0,0,0,0.03))" }}>
              <th style={th}>Node</th>
              <th style={th}>Class</th>
              <th style={th}>Direction</th>
              <th style={th}>Alignment</th>
              <th style={th}>Resizing (W × H)</th>
              <th style={th}>Spacing</th>
            </tr>
          </thead>
          <tbody>
            {layers.map((l) => (
              <tr key={l.node + l.cls}>
                <td style={{ ...td, fontWeight: 600, color: "var(--core-color-text-primary)", whiteSpace: "nowrap" }}>{l.node}</td>
                <td style={{ ...td, fontFamily: "var(--typography-font-family-mono, monospace)", fontSize: 12, color: "var(--core-color-text-tertiary)", whiteSpace: "nowrap" }}>{l.cls}</td>
                <td style={td}>{l.direction}</td>
                <td style={td}>{l.alignment}</td>
                <td style={td}>{l.resizing}</td>
                <td style={td}>{l.spacing}</td>
              </tr>
            ))}
          </tbody>
        </SpecTableCard>
      </div>

      {drawn && (
        <div>
          <SectionHeading>Specs — measured from the live component</SectionHeading>
          <SpecTableCard>
            <SpecTableHead />
            <tbody>
              {drawn.specs.map((s) => (
                <SpecRow key={s.label} {...s} />
              ))}
            </tbody>
          </SpecTableCard>
        </div>
      )}
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
