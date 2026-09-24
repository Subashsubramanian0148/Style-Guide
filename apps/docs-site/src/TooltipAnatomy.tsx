import React, { useLayoutEffect, useRef, useState } from "react";
import { IconButton } from "../../../packages/core/src/components/Button";
import { Tooltip } from "../../../packages/core/src/components/Overlays";
import { Icon } from "../../../packages/core/src/components/Primitives";
import { AnatomyFrame, VGapMark, HTickMark, SizeTag } from "./AnatomyPrimitives";
import { SectionHeading, SpecTableCard, SpecTableHead, SpecRow, SpecNote } from "./AnatomySpec";

const GREEN = "#118D57";
const ORANGE = "#C2410C";
const SCALE = 2.5;

interface Measure {
  btn: { x: number; y: number; width: number; height: number };
  icon: { x: number; y: number; w: number; h: number };
  textRight: number;
  gap: number;
  padX: number;
  insetTop: number;
  insetBottom: number;
  btnSize: string;
  iconSize: string;
  radius: string;
  fontSize: string;
}

/** Tooltip trigger anatomy: label + info icon button, every mark measured
 *  from the live DOM so the diagram tracks the shipped CSS. */
export function TooltipAnatomy() {
  const boxRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [m, setM] = useState<Measure | null>(null);

  useLayoutEffect(() => {
    const box = boxRef.current;
    const text = textRef.current;
    const btnEl = box?.querySelector(".cds-icon-btn") as HTMLElement | null;
    const iconEl = btnEl?.querySelector("i, svg") as HTMLElement | null;
    if (!box || !text || !btnEl || !iconEl) return;

    const o = box.getBoundingClientRect();
    const b = btnEl.getBoundingClientRect();
    const t = text.getBoundingClientRect();
    const i = iconEl.getBoundingClientRect();
    const s = getComputedStyle(btnEl);
    const css = (px: number) => Math.round(px / SCALE);

    setM({
      btn: { x: b.left - o.left, y: b.top - o.top, width: b.width, height: b.height },
      icon: { x: i.left - o.left, y: i.top - o.top, w: i.width, h: i.height },
      textRight: t.right - o.left,
      gap: css(b.left - t.right),
      padX: Math.round(parseFloat(s.paddingLeft)),
      insetTop: css(i.top - b.top),
      insetBottom: css(b.bottom - i.bottom),
      btnSize: `${css(b.width)} × ${css(b.height)}px`,
      iconSize: `${css(i.width)} × ${css(i.height)}px`,
      radius: s.borderTopLeftRadius,
      fontSize: getComputedStyle(text).fontSize,
    });
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
      <div>
        <SectionHeading>Structure — label, gap &amp; trigger padding</SectionHeading>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 48, alignItems: "flex-start" }}>
          <div style={{ maxWidth: "100%", overflowX: "auto" }}>
          <AnatomyFrame>
            <div ref={boxRef} style={{ position: "relative", width: 200 * SCALE, height: 32 * SCALE, marginTop: 72, marginLeft: 48, marginRight: 48, marginBottom: 84 }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "var(--core-space-1)", fontSize: "var(--typography-body-md-size)", lineHeight: "var(--typography-body-md-line-height)", transform: `scale(${SCALE})`, transformOrigin: "0 0" }}>
                <span ref={textRef} style={{ opacity: 0.55 }}>Federal tax withholding</span>
                <Tooltip label="20% is the IRS-mandated minimum for most retirement plan distributions.">
                  <IconButton variant="tertiary" size="sm" shape="circle" aria-label="What is federal tax withholding?">
                    <Icon name="fa-solid fa-circle-info" size="sm" />
                  </IconButton>
                </Tooltip>
              </span>
              {m && (
                <>
                  <VGapMark x={m.textRight + (m.btn.x - m.textRight) / 2} y={m.btn.y} height={m.btn.height} value={m.gap} color={ORANGE} extendTo={m.btn.y - 52} />
                  <VGapMark x={m.btn.x} y={m.btn.y} height={m.btn.height} value={m.padX} color={GREEN} extendTo={m.btn.y - 20} bandInset="start" />
                  <VGapMark x={m.btn.x + m.btn.width} y={m.btn.y} height={m.btn.height} value={m.padX} color={GREEN} extendTo={m.btn.y - 20} bandInset="end" />
                  <HTickMark x={m.btn.x} y={m.btn.y} width={m.btn.width} value={m.insetTop} color={GREEN} extendTo={m.btn.x - 28} bandInset="start" />
                  <SizeTag r={m.icon} label={m.iconSize.replace("px", "")} place="below" offset={30} />
                  <SizeTag r={{ x: m.btn.x, y: m.btn.y, w: m.btn.width, h: m.btn.height }} label={m.btnSize.replace("px", "").replace(" · fixed", "")} place="below" offset={62} />
                  <HTickMark x={m.btn.x} y={m.btn.y + m.btn.height} width={m.btn.width} value={m.insetBottom} color={GREEN} extendTo={m.btn.x - 28} bandInset="end" />
                </>
              )}
            </div>
          </AnatomyFrame>
          </div>

          {m && (
            <SpecTableCard>
              <SpecTableHead />
              <tbody>
                <SpecRow label="Row direction" token="inline-flex · align center" value="Horizontal · middle left" standard="pass" />
                <SpecRow label="Label → icon gap" token="core-space-1" value={`${m.gap}px`} standard="pass" />
                <SpecRow label="Label size" token="typography-body-md-size" value={m.fontSize} standard="pass" />
                <SpecRow label="Trigger button (W × H)" token="core-size-control-sm" value={`${m.btnSize} · fixed`} standard="pass" />
                <SpecRow label="Padding left / right" token="core-space-1" value={`${m.padX}px`} standard="pass" />
                <SpecRow
                  label="Icon inset top / bottom"
                  token="centered in fixed height"
                  value={`${m.insetTop}px / ${m.insetBottom}px`}
                  standard="pass"
                  note="Figma shows 7.5 / 8.5 — snapped to an even 8 / 8 per the 4-point rule"
                />
                <SpecRow label="Icon (W × H)" token="fa-circle-info · size sm" value={m.iconSize} standard="pass" />
                <SpecRow label="Border radius" token="core-iconButton-ghost-radius" value={m.radius} standard="pass" />
              </tbody>
            </SpecTableCard>
          )}
        </div>
      </div>

      <TooltipBubbleAnatomy />

      <SpecNote>
        <span style={{ color: ORANGE, fontWeight: 700 }}>Orange</span> marks the item spacing between label and trigger;{" "}
        <span style={{ color: GREEN, fontWeight: 700 }}>green</span> marks the trigger's own padding;{" "}
        <span style={{ color: "#7C3AED", fontWeight: 700 }}>purple</span> gives the fixed icon and button size. The trigger is the tertiary{" "}
        <code>IconButton</code> (sm, circle) — its <code>aria-label</code> must restate the question, e.g. “What is federal tax withholding?”.
      </SpecNote>
    </div>
  );
}

interface BubbleMeasure {
  rect: { x: number; y: number; w: number; h: number };
  width: number;
  maxWidth: string;
  padding: string;
  radius: string;
  fontSize: string;
  offset: string;
  truncated: boolean;
}

/** Bubble anatomy: a long label rendered at the real max width so the
 *  ellipsis cut-off and the 240px cap are measured, not illustrated. */
function TooltipBubbleAnatomy() {
  const boxRef = useRef<HTMLDivElement>(null);
  const [m, setM] = useState<BubbleMeasure | null>(null);

  useLayoutEffect(() => {
    const box = boxRef.current;
    const el = box?.querySelector(".cds-tooltip") as HTMLElement | null;
    if (!box || !el) return;
    const o = box.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    const s = getComputedStyle(el);
    setM({
      rect: { x: r.left - o.left, y: r.top - o.top, w: r.width, h: r.height },
      width: Math.round(r.width),
      maxWidth: s.maxWidth,
      padding: `${parseFloat(s.paddingTop)}px ${parseFloat(s.paddingLeft)}px`,
      radius: s.borderTopLeftRadius,
      fontSize: s.fontSize,
      offset: getComputedStyle(box).getPropertyValue("--core-tooltip-offset").trim(),
      truncated: el.scrollWidth > el.clientWidth,
    });
  }, []);

  return (
    <div>
      <SectionHeading>Bubble — max width, truncation &amp; placement</SectionHeading>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 48, alignItems: "flex-start" }}>
        <AnatomyFrame>
          <div ref={boxRef} style={{ position: "relative", marginTop: 24, marginLeft: 24, marginRight: 24, marginBottom: 56 }}>
            <span className="cds-tooltip" role="tooltip" style={{ position: "static", display: "block" }}>
              20% is the IRS-mandated minimum for most retirement plan distributions.
            </span>
            {m && <SizeTag r={m.rect} label={`max ${m.width}`} place="below" offset={28} />}
          </div>
        </AnatomyFrame>

        {m && (
          <SpecTableCard>
            <SpecTableHead />
            <tbody>
              <SpecRow label="Max width" token="core-tooltip-maxWidth" value={m.maxWidth} standard="pass" />
              <SpecRow label="Overflow" token="nowrap · ellipsis" value={m.truncated ? "Truncated with …" : "Fits"} standard="pass" note="Keep tooltip copy short; anything past 240px is cut" />
              <SpecRow label="Padding" token="core-space-1 / core-space-2" value={m.padding} standard="pass" />
              <SpecRow label="Font size" token="typography-font-size-xs" value={m.fontSize} standard="pass" />
              <SpecRow label="Border radius" token="core-radius-sm" value={m.radius} standard="pass" />
              <SpecRow label="Offset from trigger" token="core-tooltip-offset" value={m.offset || "8px"} standard="pass" />
              <SpecRow label="Placement" token="placement prop" value="top (default) · right · bottom · left" standard="pass" />
            </tbody>
          </SpecTableCard>
        )}
      </div>
    </div>
  );
}
