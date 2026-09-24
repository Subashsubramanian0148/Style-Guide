import React, { useLayoutEffect, useRef, useState } from "react";
import { Switch } from "../../../packages/core/src/components/Misc";
import { StateLabel } from "./DocsSection";
import { TrueBand, NodeOutline, Callout, type Rect } from "./AnatomyPrimitives";
import { SectionHeading, SpecTableCard, SpecTableHead, SpecRow, SpecNote } from "./AnatomySpec";

const GREEN = "#118D57";
const ORANGE = "#C2410C";
const BLUE = "#2563EB";
const MAX_SCALE = 2;
const GUTTER = 120;
const CELL_WIDTH = 180;

/** Shared with the Switch demo cells so the anatomy measures the same layout. */
export const SWITCH_CELL_STYLE: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "var(--core-space-2)",
  alignItems: "flex-start",
  padding: "var(--core-space-2) var(--core-space-3)",
};

interface Measure {
  cell: Rect;
  state: Rect;
  control: Rect;
  track: Rect;
  text: Rect;
  padY: number;
  padX: number;
  itemGap: number;
  labelGap: number;
  trackSize: string;
  thumbSize: string;
  textType: string;
  stateType: string;
}

const LAYERS: { node: string; cls: string; direction: string; alignment: string; resizing: string; spacing: string }[] = [
  { node: "Container", cls: "demo cell", direction: "Vertical", alignment: "Top left", resizing: "Fixed × Fixed", spacing: "Gap 8 · Padding 8 / 12" },
  { node: "State label", cls: ".docs-state-label", direction: "—", alignment: "Top left", resizing: "Hug × Hug", spacing: "—" },
  { node: "Label (switch)", cls: ".cds-switch", direction: "Horizontal", alignment: "Middle left", resizing: "Hug × Hug", spacing: "Gap 12" },
  { node: "Track", cls: ".cds-switch-track", direction: "—", alignment: "—", resizing: "Fixed 32 × 16", spacing: "—" },
  { node: "Text", cls: ".cds-switch > span", direction: "Vertical", alignment: "Top left", resizing: "Hug × Hug", spacing: "—" },
];

/** Switch anatomy: container padding, item spacing and track→text spacing in
 *  one diagram, every value measured from the live DOM. */
export function SwitchAnatomy() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const [m, setM] = useState<Measure | null>(null);
  const [SCALE, setScale] = useState(1);

  useLayoutEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const fit = () => setScale(Math.min(MAX_SCALE, Math.max(0.5, (wrap.clientWidth - GUTTER) / CELL_WIDTH)));
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(wrap);
    return () => ro.disconnect();
  }, []);

  useLayoutEffect(() => {
    const box = boxRef.current;
    const cell = box?.querySelector("[data-switch-cell]") as HTMLElement | null;
    const state = cell?.firstElementChild as HTMLElement | null;
    const control = cell?.querySelector(".cds-switch") as HTMLElement | null;
    const track = control?.querySelector(".cds-switch-track") as HTMLElement | null;
    const text = track?.nextElementSibling as HTMLElement | null;
    if (!box || !cell || !state || !control || !track || !text) return;
    const o = box.getBoundingClientRect();
    const rect = (e: Element): Rect => {
      const r = e.getBoundingClientRect();
      return { x: r.left - o.left, y: r.top - o.top, w: r.width, h: r.height };
    };
    const px = (v: string) => Math.round(parseFloat(v));
    const type = (e: Element) => {
      const s = getComputedStyle(e);
      return `${s.fontSize} / ${s.fontWeight} / ${s.lineHeight}`;
    };
    const cs = getComputedStyle(cell);
    const tr = track.getBoundingClientRect();
    const thumb = getComputedStyle(track, "::after");

    setM({
      cell: rect(cell),
      state: rect(state),
      control: rect(control),
      track: rect(track),
      text: rect(text),
      padY: px(cs.paddingTop),
      padX: px(cs.paddingLeft),
      itemGap: px(cs.rowGap),
      labelGap: px(getComputedStyle(control).columnGap),
      trackSize: `${Math.round(tr.width / SCALE)} × ${Math.round(tr.height / SCALE)}px`,
      thumbSize: `${thumb.width} × ${thumb.height}`,
      textType: type(text),
      stateType: type(state),
    });
  }, [SCALE]);

  const d = m && (() => {
    const { cell: C, state: S, control: K, track: T, text: X } = m;
    const py = m.padY * SCALE;
    const pxs = m.padX * SCALE;
    const topRow = C.y - 28;
    const leftCol = C.x - 28;
    return (
      <>
        {/* Container padding 8 / 12 */}
        <TrueBand r={{ x: C.x, y: C.y, w: C.w, h: py }} color={GREEN} />
        <TrueBand r={{ x: C.x, y: C.y + C.h - py, w: C.w, h: py }} color={GREEN} />
        <TrueBand r={{ x: C.x, y: C.y + py, w: pxs, h: C.h - 2 * py }} color={GREEN} />
        <TrueBand r={{ x: C.x + C.w - pxs, y: C.y + py, w: pxs, h: C.h - 2 * py }} color={GREEN} />
        <Callout x={C.x + pxs / 2} y={topRow} from={C.y + py} axis="v" value={m.padX} color={GREEN} />
        <Callout x={C.x + C.w - pxs / 2} y={topRow} from={C.y + py} axis="v" value={m.padX} color={GREEN} />
        <Callout x={leftCol} y={C.y + py / 2} from={C.x} axis="h" value={m.padY} color={GREEN} />
        <Callout x={leftCol} y={C.y + C.h - py / 2} from={C.x} axis="h" value={m.padY} color={GREEN} />

        {/* Container item spacing 8 */}
        <TrueBand r={{ x: C.x + pxs, y: S.y + S.h, w: C.w - 2 * pxs, h: K.y - (S.y + S.h) }} color={ORANGE} />
        <Callout x={leftCol} y={(S.y + S.h + K.y) / 2} from={C.x} axis="h" value={m.itemGap} color={ORANGE} />

        {/* Track → text spacing 12 */}
        <TrueBand r={{ x: T.x + T.w, y: K.y, w: X.x - (T.x + T.w), h: K.h }} color={ORANGE} />
        <Callout x={(T.x + T.w + X.x) / 2} y={K.y + K.h + 24} from={K.y + K.h} axis="v" value={m.labelGap} color={ORANGE} />

        <NodeOutline r={S} />
        <NodeOutline r={K} />
        <NodeOutline r={X} />
        <NodeOutline r={C} />
      </>
    );
  })();

  const th: React.CSSProperties = { padding: "var(--core-space-2) var(--core-space-4)", fontWeight: 700 };
  const td: React.CSSProperties = { padding: "var(--core-space-2) var(--core-space-4)", borderTop: "1px solid var(--core-color-border-subtle)", fontSize: 13, verticalAlign: "top" };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
      <div>
        <SectionHeading>Structure — container padding &amp; item spacing</SectionHeading>
        <div ref={wrapRef} style={{ maxWidth: "100%", overflowX: "auto" }}>
          <div ref={boxRef} style={{ position: "relative", width: CELL_WIDTH * SCALE + GUTTER, height: 63 * SCALE + GUTTER }}>
            <div style={{ position: "absolute", left: 64, top: 56, width: CELL_WIDTH, transform: `scale(${SCALE})`, transformOrigin: "0 0" }}>
              <div data-switch-cell style={SWITCH_CELL_STYLE}>
                <StateLabel>DEFAULT</StateLabel>
                <Switch label="Option" checked={false} onChange={() => {}} />
              </div>
            </div>
            {d}
          </div>
        </div>
        <SpecNote>
          <span style={{ color: GREEN, fontWeight: 700 }}>Green</span> = container padding,{" "}
          <span style={{ color: ORANGE, fontWeight: 700 }}>orange</span> = item spacing,{" "}
          <span style={{ color: BLUE, fontWeight: 700 }}>blue</span> outlines = child nodes. Shown at{" "}
          {SCALE.toFixed(2).replace(/\.?0+$/, "")}× — every badge reads the real CSS value. Structure is shared by every state; only the track
          color and focus ring change on hover, focus, on and disabled.
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
              <tr key={l.node}>
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
              <SpecRow label="Container padding" token="core-space-2 / core-space-3" value={`${m.padY}px ${m.padX}px`} standard="pass" />
              <SpecRow label="State label → switch" token="core-space-2" value={`${m.itemGap}px`} standard="pass" />
              <SpecRow label="Track → text" token="core-space-3" value={`${m.labelGap}px`} standard="pass" />
              <SpecRow label="Track" token="core-space-8 × core-space-4" value={m.trackSize} standard="pass" />
              <SpecRow label="Thumb" token="core-space-3" value={m.thumbSize} standard="pass" />
              <SpecRow label="Text" token="typography-body-md" value={m.textType} standard="pass" />
              <SpecRow label="State label" token="typography-eyebrow" value={m.stateType} standard="pass" />
            </tbody>
          </SpecTableCard>
        </div>
      )}
    </div>
  );
}
