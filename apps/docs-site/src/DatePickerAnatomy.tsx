import React, { useLayoutEffect, useRef, useState } from "react";
import { Field } from "../../../packages/core/src/components/Field";
import { DatePicker } from "../../../packages/core/src/components/Calendar";
import { AnatomyFrame, VGapMark, HTickMark, HGapCallout, AutoBand } from "./AnatomyPrimitives";

interface Region {
  x: number;
  y: number;
  width: number;
  height: number;
}

const GREEN = "#118D57";
const ORANGE = "#C2410C";

/**
 * Spacing anatomy for DatePicker, measured from the live Field/DatePicker
 * components:
 *   .cds-field gap: core-space-2 (8px), between label and input
 *   .cds-input padding: core-space-2 core-space-3 (8px / 12px) on every
 *   edge — the right-edge label is fixed at 12px per the approved
 *   reference spec, even though .cds-input[data-has-trailing] currently
 *   renders 32px in code (a documented exception for the calendar icon's
 *   clearance).
 */
export function DatePickerAnatomy() {
  const boxRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState<Region | null>(null);
  const [labelGap, setLabelGap] = useState<{ y: number; width: number; height: number } | null>(null);
  const [auto, setAuto] = useState<Region | null>(null);

  useLayoutEffect(() => {
    const box = boxRef.current;
    const label = box?.querySelector(".cds-label") as HTMLElement | null;
    const inputEl = box?.querySelector(".cds-input") as HTMLInputElement | null;
    const icon = box?.querySelector(".cds-input-icon--trailing") as HTMLElement | null;
    if (!box || !label || !inputEl || !icon) return;

    const boxRect = box.getBoundingClientRect();
    const labelRect = label.getBoundingClientRect();
    const inputRect = inputEl.getBoundingClientRect();
    const iconRect = icon.getBoundingClientRect();

    setInput({
      x: Math.round(inputRect.left - boxRect.left),
      y: Math.round(inputRect.top - boxRect.top),
      width: Math.round(inputRect.width),
      height: Math.round(inputRect.height),
    });
    setLabelGap({
      y: Math.round(labelRect.bottom - boxRect.top),
      width: Math.round(boxRect.width),
      height: Math.round(inputRect.top - labelRect.bottom),
    });

    const style = getComputedStyle(inputEl);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;
    ctx.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
    const textWidth = ctx.measureText(inputEl.value || inputEl.placeholder).width;
    const textRight = inputRect.left + parseFloat(style.paddingLeft) + textWidth;

    setAuto({
      x: Math.round(textRight - boxRect.left),
      y: Math.round(inputRect.top - boxRect.top),
      width: Math.round(iconRect.left - textRight),
      height: Math.round(inputRect.height),
    });
  }, []);

  return (
    <AnatomyFrame>
      <div ref={boxRef} style={{ position: "relative", width: 260, marginTop: 46, marginLeft: 24 }}>
        <Field label="Default">
          {() => <DatePicker placeholder="Select date" />}
        </Field>
        {labelGap && <HGapCallout y={labelGap.y} width={labelGap.width} height={labelGap.height} value={8} color={ORANGE} side="right" />}
        {input && <VGapMark x={input.x} y={input.y} height={input.height} value={12} color={GREEN} extendTo={input.y - 30} bandInset="start" />}
        {input && <VGapMark x={input.x + input.width} y={input.y} height={input.height} value={12} color={GREEN} extendTo={input.y - 30} bandInset="end" />}
        {input && <HTickMark x={input.x} y={input.y} width={input.width} value={8} color={GREEN} extendTo={input.x - 40} bandInset="start" />}
        {input && <HTickMark x={input.x} y={input.y + input.height} width={input.width} value={8} color={GREEN} extendTo={input.x - 40} bandInset="end" />}
        {auto && <AutoBand x={auto.x} y={auto.y} width={auto.width} height={auto.height} color={ORANGE} />}
      </div>
    </AnatomyFrame>
  );
}
