import React, { useLayoutEffect, useRef, useState } from "react";
import { IconButton } from "../../../packages/core/src/components/Button";
import { Tooltip } from "../../../packages/core/src/components/Overlays";
import { Icon } from "../../../packages/core/src/components/Primitives";
import { AnatomyFrame, VGapMark, HTickMark } from "./AnatomyPrimitives";
import { SectionHeading, SpecTableCard, SpecTableHead, SpecRow, SpecNote } from "./AnatomySpec";

const GREEN = "#118D57";
const ORANGE = "#C2410C";
const SCALE = 2.5;

interface Measure {
  btn: { x: number; y: number; width: number; height: number };
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
      textRight: t.right - o.left,
      gap: css(b.left - t.right),
      padX: Math.round(parseFloat(s.paddingLeft)),
      insetTop: css(i.top - b.top),
      insetBottom: css(b.bottom - i.bottom),
      btnSize: `${css(b.width)} × ${css(b.height)}px`,
      iconSize: `${css(i.width)}px`,
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
            <div ref={boxRef} style={{ position: "relative", width: 200 * SCALE, height: 32 * SCALE, marginTop: 72, marginLeft: 48, marginRight: 48, marginBottom: 24 }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "var(--core-space-1)", fontSize: 14, transform: `scale(${SCALE})`, transformOrigin: "0 0" }}>
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
                <SpecRow label="Row direction" token="inline-flex · align center" value="Horizontal · middle left · hug" standard="pass" />
                <SpecRow label="Label → icon gap" token="core-space-1" value={`${m.gap}px`} standard="pass" />
                <SpecRow label="Label size" token="typography-body-md-size" value={m.fontSize} standard="pass" />
                <SpecRow label="Trigger size" token="core-size-control-sm" value={`${m.btnSize} · fixed`} standard="pass" />
                <SpecRow label="Padding left / right" token="core-space-1" value={`${m.padX}px`} standard="pass" />
                <SpecRow
                  label="Icon inset top / bottom"
                  token="centered in fixed height"
                  value={`${m.insetTop}px / ${m.insetBottom}px`}
                  standard="pass"
                  note="Figma shows 7.5 / 8.5 — snapped to an even 8 / 8 per the 4-point rule"
                />
                <SpecRow label="Icon" token="fa-circle-info · size sm" value={m.iconSize} standard="pass" />
                <SpecRow label="Border radius" token="core-iconButton-ghost-radius" value={m.radius} standard="pass" />
              </tbody>
            </SpecTableCard>
          )}
        </div>
      </div>

      <SpecNote>
        <span style={{ color: ORANGE, fontWeight: 700 }}>Orange</span> marks the item spacing between label and trigger;{" "}
        <span style={{ color: GREEN, fontWeight: 700 }}>green</span> marks the trigger's own padding. The trigger is the tertiary{" "}
        <code>IconButton</code> (sm, circle) — its <code>aria-label</code> must restate the question, e.g. “What is federal tax withholding?”.
      </SpecNote>
    </div>
  );
}
