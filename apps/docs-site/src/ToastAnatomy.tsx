import React, { useLayoutEffect, useRef, useState } from "react";
import { Toast } from "../../../packages/core/src/components/Overlays";
import { TrueBand, NodeOutline, Callout, type Rect } from "./AnatomyPrimitives";
import { SectionHeading, SpecTableCard, SpecTableHead, SpecRow, SpecNote } from "./AnatomySpec";

const GREEN = "#118D57";
const ORANGE = "#C2410C";
const BLUE = "#2563EB";
const MAX_SCALE = 1.5;
const GUTTER = 120;
const TOAST_WIDTH = 446;

interface Measure {
  toast: Rect;
  icon: Rect;
  content: Rect;
  title: Rect;
  body: Rect;
  close: Rect;
  border: number;
  pad: number;
  gap: number;
  bodyTop: number;
  closePad: number;
  radius: string;
  closeSize: string;
  iconSize: string;
  title14: string;
  body14: string;
}

const LAYERS: { node: string; cls: string; direction: string; alignment: string; resizing: string; spacing: string }[] = [
  { node: "Status (toast)", cls: ".cds-toast", direction: "Horizontal", alignment: "Middle left", resizing: "Hug × Hug", spacing: "Gap 12 · Padding 16" },
  { node: "Icon badge", cls: ".cds-toast__icon-badge", direction: "Horizontal", alignment: "Middle center", resizing: "Fixed 28 × 28", spacing: "—" },
  { node: "Content", cls: ".cds-toast-content", direction: "Vertical", alignment: "Top left", resizing: "Fill × Hug", spacing: "—" },
  { node: "Title", cls: ".cds-toast-title", direction: "Vertical", alignment: "Top left", resizing: "Fill × Hug", spacing: "—" },
  { node: "Body", cls: ".cds-toast-body", direction: "Vertical", alignment: "Top left", resizing: "Fill × Hug", spacing: "Top 4" },
  { node: "Dismiss button", cls: ".cds-toast-close", direction: "Horizontal", alignment: "Middle center", resizing: "Hug × Hug", spacing: "Padding 4" },
];

/** Toast anatomy: container padding, item spacing, title→body spacing and
 *  dismiss padding in one diagram, every value measured from the live DOM. */
export function ToastAnatomy() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const [m, setM] = useState<Measure | null>(null);
  const [SCALE, setScale] = useState(1);

  useLayoutEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const fit = () => setScale(Math.min(MAX_SCALE, Math.max(0.5, (wrap.clientWidth - GUTTER) / TOAST_WIDTH)));
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(wrap);
    return () => ro.disconnect();
  }, []);

  useLayoutEffect(() => {
    const box = boxRef.current;
    const t = box?.querySelector(".cds-toast") as HTMLElement | null;
    if (!box || !t) return;
    const q = (s: string) => t.querySelector(s) as HTMLElement;
    const o = box.getBoundingClientRect();
    const rect = (e: Element): Rect => {
      const r = e.getBoundingClientRect();
      return { x: r.left - o.left, y: r.top - o.top, w: r.width, h: r.height };
    };
    const ts = getComputedStyle(t);
    const close = q(".cds-toast-close");
    const icon = q(".cds-toast__icon-badge");
    const title = q(".cds-toast-title");
    const body = q(".cds-toast-body");
    const px = (v: string) => Math.round(parseFloat(v));
    const cssSize = (e: Element) => {
      const r = e.getBoundingClientRect();
      return `${Math.round(r.width / SCALE)} × ${Math.round(r.height / SCALE)}px`;
    };
    const type = (e: Element) => {
      const s = getComputedStyle(e);
      return `${s.fontSize} / ${s.fontWeight} / ${s.lineHeight}`;
    };

    setM({
      toast: rect(t),
      icon: rect(icon),
      content: rect(q(".cds-toast-content")),
      title: rect(title),
      body: rect(body),
      close: rect(close),
      border: px(ts.borderTopWidth) * SCALE,
      pad: px(ts.paddingTop),
      gap: px(ts.columnGap),
      bodyTop: px(getComputedStyle(body).marginTop),
      closePad: px(getComputedStyle(close).paddingTop),
      radius: ts.borderTopLeftRadius,
      closeSize: cssSize(close),
      iconSize: cssSize(icon),
      title14: type(title),
      body14: type(body),
    });
  }, [SCALE]);

  const d = m && (() => {
    const { toast: T, icon: I, content: C, title: H, body: B, close: X, border: b } = m;
    const p = m.pad * SCALE;
    const cp = m.closePad * SCALE;
    const inner = { x: T.x + b, y: T.y + b, w: T.w - 2 * b, h: T.h - 2 * b };
    const topRow = T.y - 28;
    const leftCol = T.x - 28;
    const below = T.y + T.h + 28;
    const right = T.x + T.w + 28;
    return (
      <>
        {/* Container padding 16 */}
        <TrueBand r={{ x: inner.x, y: inner.y, w: inner.w, h: p }} color={GREEN} />
        <TrueBand r={{ x: inner.x, y: inner.y + inner.h - p, w: inner.w, h: p }} color={GREEN} />
        <TrueBand r={{ x: inner.x, y: inner.y + p, w: p, h: inner.h - 2 * p }} color={GREEN} />
        <TrueBand r={{ x: inner.x + inner.w - p, y: inner.y + p, w: p, h: inner.h - 2 * p }} color={GREEN} />
        <Callout x={inner.x + p / 2} y={topRow} from={inner.y + p} axis="v" value={m.pad} color={GREEN} />
        <Callout x={inner.x + inner.w - p / 2} y={topRow} from={inner.y + p} axis="v" value={m.pad} color={GREEN} />
        <Callout x={leftCol} y={inner.y + p / 2} from={inner.x} axis="h" value={m.pad} color={GREEN} />
        <Callout x={leftCol} y={inner.y + inner.h - p / 2} from={inner.x} axis="h" value={m.pad} color={GREEN} />

        {/* Item spacing 12 */}
        <TrueBand r={{ x: I.x + I.w, y: inner.y + p, w: C.x - (I.x + I.w), h: inner.h - 2 * p }} color={ORANGE} />
        <TrueBand r={{ x: C.x + C.w, y: inner.y + p, w: X.x - (C.x + C.w), h: inner.h - 2 * p }} color={ORANGE} />
        <Callout x={(I.x + I.w + C.x) / 2} y={topRow} from={inner.y + p} axis="v" value={m.gap} color={ORANGE} />
        <Callout x={(C.x + C.w + X.x) / 2} y={topRow} from={inner.y + p} axis="v" value={m.gap} color={ORANGE} />

        {/* Title → body 4 */}
        <TrueBand r={{ x: B.x, y: H.y + H.h, w: B.w, h: B.y - (H.y + H.h) }} color={GREEN} />
        <Callout x={leftCol} y={(H.y + H.h + B.y) / 2} from={B.x} axis="h" value={m.bodyTop} color={GREEN} />

        {/* Dismiss padding 4 */}
        <TrueBand r={{ x: X.x, y: X.y, w: X.w, h: cp }} color={GREEN} />
        <TrueBand r={{ x: X.x, y: X.y + X.h - cp, w: X.w, h: cp }} color={GREEN} />
        <TrueBand r={{ x: X.x, y: X.y + cp, w: cp, h: X.h - 2 * cp }} color={GREEN} />
        <TrueBand r={{ x: X.x + X.w - cp, y: X.y + cp, w: cp, h: X.h - 2 * cp }} color={GREEN} />
        <Callout x={X.x + cp / 2 - 8} y={below} from={X.y + X.h} axis="v" value={m.closePad} color={GREEN} />
        <Callout x={X.x + X.w - cp / 2 + 8} y={below} from={X.y + X.h} axis="v" value={m.closePad} color={GREEN} />
        <Callout x={right} y={X.y + cp / 2} from={X.x + X.w} axis="h" value={m.closePad} color={GREEN} />
        <Callout x={right} y={X.y + X.h - cp / 2} from={X.x + X.w} axis="h" value={m.closePad} color={GREEN} />

        {/* Node outlines */}
        <NodeOutline r={I} />
        <NodeOutline r={H} />
        <NodeOutline r={B} />
        <NodeOutline r={X} />
      </>
    );
  })();

  const th: React.CSSProperties = { padding: "var(--core-space-2) var(--core-space-4)", fontWeight: 700 };
  const td: React.CSSProperties = { padding: "var(--core-space-2) var(--core-space-4)", borderTop: "1px solid var(--core-color-border-subtle)", fontSize: 13, verticalAlign: "top" };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
      <div>
        <SectionHeading>Structure — padding, item spacing &amp; dismiss button</SectionHeading>
        <div ref={wrapRef} style={{ maxWidth: "100%", overflowX: "auto" }}>
          <div ref={boxRef} style={{ position: "relative", width: TOAST_WIDTH * SCALE + GUTTER, height: 80 * SCALE + GUTTER }}>
            <div style={{ position: "absolute", left: 56, top: 56, width: TOAST_WIDTH, transform: `scale(${SCALE})`, transformOrigin: "0 0" }}>
              <Toast tone="warning" title="Beneficiary missing" onClose={() => {}}>
                Add a beneficiary to finish setting up your account.
              </Toast>
            </div>
            {d}
          </div>
        </div>
        <SpecNote>
          <span style={{ color: GREEN, fontWeight: 700 }}>Green</span> = padding / inner spacing,{" "}
          <span style={{ color: ORANGE, fontWeight: 700 }}>orange</span> = item spacing between children,{" "}
          <span style={{ color: BLUE, fontWeight: 700 }}>blue</span> outlines = child nodes. Shown at {SCALE.toFixed(2).replace(/\.?0+$/, "")}× — every badge reads the real CSS value.
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
            {LAYERS.map((l) => (
              <tr key={l.cls}>
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

      {m && (
        <div>
          <SectionHeading>Specs — measured from the live component</SectionHeading>
          <SpecTableCard>
            <SpecTableHead />
            <tbody>
              <SpecRow label="Container padding" token="core-space-4" value={`${m.pad}px`} standard="pass" />
              <SpecRow label="Item spacing" token="core-space-3" value={`${m.gap}px`} standard="pass" />
              <SpecRow label="Alignment" token="align-items: center" value="Middle left" standard="pass" />
              <SpecRow label="Icon badge" token="28px · radius 50%" value={m.iconSize} standard="pass" />
              <SpecRow label="Title" token="typography-body-md · bold" value={m.title14} standard="pass" />
              <SpecRow
                label="Title → body"
                token="core-space-1"
                value={`${m.bodyTop}px`}
                standard="pass"
                note="Figma: Container padding-top 4 — implemented as margin-top on .cds-toast-body"
              />
              <SpecRow label="Body" token="typography-body-md" value={m.body14} standard="pass" />
              <SpecRow label="Dismiss padding" token="core-space-1" value={`${m.closePad}px`} standard="pass" />
              <SpecRow label="Dismiss size" token="12px icon + padding" value={m.closeSize} standard="warn" note="Below the 24 × 24px minimum target (WCAG 2.5.8)" />
              <SpecRow label="Border radius" token="core-radius-sm" value={m.radius} standard="pass" />
            </tbody>
          </SpecTableCard>
        </div>
      )}
    </div>
  );
}
