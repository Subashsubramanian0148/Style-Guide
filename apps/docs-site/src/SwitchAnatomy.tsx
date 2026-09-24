import React, { useLayoutEffect, useRef, useState } from "react";
import { Switch } from "../../../packages/core/src/components/Misc";
import { StateLabel } from "./DocsSection";
import { TrueBand, NodeOutline, Callout, SizeTag, type Rect } from "./AnatomyPrimitives";
import { SectionHeading, SpecTableCard, SpecTableHead, SpecRow, SpecNote } from "./AnatomySpec";
import { LayerTable, type AnatomyLayer } from "./MeasuredAnatomy";

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
  thumbPx: number;
  thumbLeft: number;
  textType: string;
  stateType: string;
}

const LAYERS: AnatomyLayer[] = [
  { node: "Container", cls: "demo cell", direction: "Vertical", alignment: "Top left", spacing: "Gap 8 · Padding 8 / 12", sel: "[data-switch-cell]" },
  { node: "State label", cls: ".docs-state-label", direction: "—", alignment: "Top left", spacing: "—", sel: ".docs-state-label" },
  { node: "Label (switch)", cls: ".cds-switch", direction: "Horizontal", alignment: "Middle left", spacing: "Gap 12", sel: ".cds-switch" },
  { node: "Track", cls: ".cds-switch-track", direction: "—", alignment: "—", spacing: "—", sel: ".cds-switch-track" },
  { node: "Text", cls: ".cds-switch > span", direction: "Vertical", alignment: "Top left", spacing: "—", sel: ".cds-switch-track + span" },
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
      thumbPx: parseFloat(thumb.width),
      thumbLeft: parseFloat(thumb.left),
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
        <SizeTag r={{ x: T.x + m.thumbLeft * SCALE, y: T.y + (T.h - m.thumbPx * SCALE) / 2, w: m.thumbPx * SCALE, h: m.thumbPx * SCALE }} label={m.thumbSize.replace(/px/g, "")} offset={24} />
        <SizeTag r={T} label={m.trackSize.replace("px", "")} offset={56} />
        <NodeOutline r={C} />
      </>
    );
  })();


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
          <span style={{ color: BLUE, fontWeight: 700 }}>blue</span> outlines = child nodes,{" "}
          <span style={{ color: "#7C3AED", fontWeight: 700 }}>purple</span> = fixed width × height. Shown at{" "}
          {SCALE.toFixed(2).replace(/\.?0+$/, "")}× — every badge reads the real CSS value. Structure is shared by every state; only the track
          color and focus ring change on hover, focus, on and disabled.
        </SpecNote>
      </div>

      <LayerTable layers={LAYERS} root={boxRef} />

      {m && (
        <div>
          <SectionHeading>Specs — measured from the live component</SectionHeading>
          <SpecTableCard>
            <SpecTableHead />
            <tbody>
              <SpecRow label="Container padding" token="core-space-2 / core-space-3" value={`${m.padY}px ${m.padX}px`} standard="pass" />
              <SpecRow label="State label → switch" token="core-space-2" value={`${m.itemGap}px`} standard="pass" />
              <SpecRow label="Track → text" token="core-space-3" value={`${m.labelGap}px`} standard="pass" />
              <SpecRow label="Track (W × H)" token="core-space-8 × core-space-4" value={m.trackSize} standard="pass" />
              <SpecRow label="Toggle thumb (W × H)" token="core-space-3" value={m.thumbSize} standard="pass" />
              <SpecRow label="Text" token="typography-body-md" value={m.textType} standard="pass" />
              <SpecRow label="State label" token="typography-eyebrow" value={m.stateType} standard="pass" />
            </tbody>
          </SpecTableCard>
        </div>
      )}
    </div>
  );
}
