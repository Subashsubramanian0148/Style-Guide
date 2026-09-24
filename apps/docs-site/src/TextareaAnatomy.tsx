import React, { useLayoutEffect, useRef, useState } from "react";
import { Field } from "../../../packages/core/src/components/Field";
import { Textarea } from "../../../packages/core/src/components/FormControls";
import { TrueBand, NodeOutline, Callout, SizeTag, type Rect } from "./AnatomyPrimitives";
import { SectionHeading, SpecTableCard, SpecTableHead, SpecRow, SpecNote } from "./AnatomySpec";
import { LayerTable, type AnatomyLayer } from "./MeasuredAnatomy";

const GREEN = "#118D57";
const ORANGE = "#C2410C";
const BLUE = "#2563EB";
const MAX_SCALE = 1.5;
const GUTTER = 120;
const FIELD_WIDTH = 280;

interface Measure {
  field: Rect;
  label: Rect;
  area: Rect;
  border: number;
  gap: number;
  pad: number;
  labelType: string;
  inputType: string;
  minHeight: string;
  radius: string;
  borderSpec: string;
  resize: string;
}

const LAYERS: AnatomyLayer[] = [
  { node: "Container (field)", cls: ".cds-field", direction: "Vertical", alignment: "Top left", spacing: "Gap 8", sel: ".cds-field" },
  { node: "Label", cls: ".cds-label", direction: "Vertical", alignment: "Top left", spacing: "—", sel: ".cds-label" },
  { node: "Text area", cls: ".cds-textarea", direction: "Vertical", alignment: "Top left", spacing: "Padding 12", sel: ".cds-textarea" },
];

/** Textarea anatomy: label→field spacing and field padding in one diagram,
 *  every value measured from the live DOM. */
export function TextareaAnatomy() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const [m, setM] = useState<Measure | null>(null);
  const [SCALE, setScale] = useState(1);

  useLayoutEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const fit = () => setScale(Math.min(MAX_SCALE, Math.max(0.5, (wrap.clientWidth - GUTTER) / FIELD_WIDTH)));
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(wrap);
    return () => ro.disconnect();
  }, []);

  useLayoutEffect(() => {
    const box = boxRef.current;
    const field = box?.querySelector(".cds-field") as HTMLElement | null;
    const label = field?.querySelector(".cds-label") as HTMLElement | null;
    const area = field?.querySelector(".cds-textarea") as HTMLElement | null;
    if (!box || !field || !label || !area) return;
    const o = box.getBoundingClientRect();
    const rect = (e: Element): Rect => {
      const r = e.getBoundingClientRect();
      return { x: r.left - o.left, y: r.top - o.top, w: r.width, h: r.height };
    };
    const px = (v: string) => Math.round(parseFloat(v));
    const type = (s: CSSStyleDeclaration) => `${s.fontSize} / ${s.fontWeight} / ${s.lineHeight}`;
    const as = getComputedStyle(area);

    setM({
      field: rect(field),
      label: rect(label),
      area: rect(area),
      border: px(as.borderTopWidth) * SCALE,
      gap: px(getComputedStyle(field).rowGap),
      pad: px(as.paddingTop),
      labelType: type(getComputedStyle(label)),
      inputType: type(as),
      minHeight: as.minHeight,
      radius: as.borderTopLeftRadius,
      borderSpec: `${as.borderTopWidth} solid ${as.borderTopColor}`,
      resize: as.resize,
    });
  }, [SCALE]);

  const d = m && (() => {
    const { label: L, area: A, border: b } = m;
    const p = m.pad * SCALE;
    const inner = { x: A.x + b, y: A.y + b, w: A.w - 2 * b, h: A.h - 2 * b };
    const leftCol = A.x - 28;
    const topRow = L.y - 20;
    return (
      <>
        {/* Label → textarea item spacing 8 */}
        <TrueBand r={{ x: L.x, y: L.y + L.h, w: L.w, h: A.y - (L.y + L.h) }} color={ORANGE} />
        <Callout x={leftCol - 28} y={(L.y + L.h + A.y) / 2} from={L.x} axis="h" value={m.gap} color={ORANGE} />

        {/* Textarea padding 12 */}
        <TrueBand r={{ x: inner.x, y: inner.y, w: inner.w, h: p }} color={GREEN} />
        <TrueBand r={{ x: inner.x, y: inner.y + inner.h - p, w: inner.w, h: p }} color={GREEN} />
        <TrueBand r={{ x: inner.x, y: inner.y + p, w: p, h: inner.h - 2 * p }} color={GREEN} />
        <TrueBand r={{ x: inner.x + inner.w - p, y: inner.y + p, w: p, h: inner.h - 2 * p }} color={GREEN} />
        <Callout x={inner.x + p / 2} y={topRow} from={inner.y + p} axis="v" value={m.pad} color={GREEN} />
        <Callout x={inner.x + inner.w - p / 2} y={topRow} from={inner.y + p} axis="v" value={m.pad} color={GREEN} />
        <Callout x={leftCol} y={inner.y + p / 2} from={inner.x} axis="h" value={m.pad} color={GREEN} />
        <Callout x={leftCol} y={inner.y + inner.h - p / 2} from={inner.x} axis="h" value={m.pad} color={GREEN} />

        <NodeOutline r={L} />
        <SizeTag r={A} label={`${Math.round(A.w / SCALE)} × ${Math.round(A.h / SCALE)}`} offset={24} />
      </>
    );
  })();


  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
      <div>
        <SectionHeading>Structure — label spacing &amp; field padding</SectionHeading>
        <div ref={wrapRef} style={{ maxWidth: "100%", overflowX: "auto" }}>
          <div ref={boxRef} style={{ position: "relative", width: FIELD_WIDTH * SCALE + GUTTER, height: 117 * SCALE + GUTTER }}>
            <div style={{ position: "absolute", left: 64, top: 64, width: FIELD_WIDTH, transform: `scale(${SCALE})`, transformOrigin: "0 0" }}>
              <Field label="Default">{(p) => <Textarea {...p} rows={2} placeholder="Type here..." />}</Field>
            </div>
            {d}
          </div>
        </div>
        <SpecNote>
          <span style={{ color: ORANGE, fontWeight: 700 }}>Orange</span> = item spacing between label and field,{" "}
          <span style={{ color: GREEN, fontWeight: 700 }}>green</span> = field padding,{" "}
          <span style={{ color: BLUE, fontWeight: 700 }}>blue</span> outlines = child nodes, <span style={{ color: "#7C3AED", fontWeight: 700 }}>purple</span> = fixed width × height. Shown at{" "}
          {SCALE.toFixed(2).replace(/\.?0+$/, "")}× — every badge reads the real CSS value. Structure is shared by every state; only border and
          background tokens change on hover, focus, filled and disabled.
        </SpecNote>
      </div>

      <LayerTable layers={LAYERS} root={boxRef} />

      {m && (
        <div>
          <SectionHeading>Specs — measured from the live component</SectionHeading>
          <SpecTableCard>
            <SpecTableHead />
            <tbody>
              <SpecRow label="Label → field" token="core-space-2" value={`${m.gap}px`} standard="pass" />
              <SpecRow label="Field padding" token="core-space-3" value={`${m.pad}px`} standard="pass" />
              <SpecRow label="Label" token="typography-label" value={m.labelType} standard="pass" />
              <SpecRow label="Input text" token="typography-text14-regular-size" value={m.inputType} standard="pass" />
              <SpecRow label="Text area (W × H)" token="width stretches to container · min-height 88" value={`${Math.round(m.area.w / SCALE)} × ${Math.round(m.area.h / SCALE)}px`} standard="pass" />
              <SpecRow label="Resize" token="resize: vertical" value={m.resize} standard="pass" />
              <SpecRow label="Border" token="theme-neutral-border-primary-default" value={m.borderSpec} standard="pass" />
              <SpecRow label="Border radius" token="core-radius-sm" value={m.radius} standard="pass" />
            </tbody>
          </SpecTableCard>
        </div>
      )}
    </div>
  );
}
