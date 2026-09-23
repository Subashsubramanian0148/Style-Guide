import React, { useLayoutEffect, useRef, useState } from "react";
import { Field } from "../../../packages/core/src/components/Field";
import { Combobox } from "../../../packages/core/src/components/Combobox";
import { AnatomyFrame, VGapMark, HTickMark, HGapCallout } from "./AnatomyPrimitives";

interface Region {
  x: number;
  y: number;
  width: number;
  height: number;
}

const GREEN = "#118D57";
const ORANGE = "#C2410C";

const employers = [
  { value: "acme", label: "Acme Corporation" },
  { value: "globex", label: "Globex Industries" },
];

/**
 * Spacing anatomy for Combobox, measured from the live Field/Combobox
 * components:
 *   .cds-field gap: core-space-2 (8px), between label and input
 *   .cds-input padding: core-space-2 core-space-3 (8px / 12px)
 */
export function ComboboxAnatomy() {
  const boxRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState<Region | null>(null);
  const [labelGap, setLabelGap] = useState<{ y: number; width: number; height: number } | null>(null);

  useLayoutEffect(() => {
    const box = boxRef.current;
    const label = box?.querySelector(".cds-label") as HTMLElement | null;
    const inputEl = box?.querySelector(".cds-input") as HTMLElement | null;
    if (!box || !label || !inputEl) return;

    const boxRect = box.getBoundingClientRect();
    const labelRect = label.getBoundingClientRect();
    const inputRect = inputEl.getBoundingClientRect();

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
  }, []);

  return (
    <AnatomyFrame>
      <div ref={boxRef} style={{ position: "relative", width: 260, marginTop: 46, marginLeft: 50 }}>
        <Field label="Default">
          {(p) => <Combobox {...p} options={employers} value="" onChange={() => {}} placeholder="Search employer…" />}
        </Field>
        {labelGap && <HGapCallout y={labelGap.y} width={labelGap.width} height={labelGap.height} value={8} color={ORANGE} side="right" />}
        {input && <VGapMark x={input.x} y={input.y} height={input.height} value={12} color={GREEN} extendTo={input.y - 30} bandInset="start" />}
        {input && <VGapMark x={input.x + input.width} y={input.y} height={input.height} value={12} color={GREEN} extendTo={input.y - 30} bandInset="end" />}
        {input && <HTickMark x={input.x} y={input.y} width={input.width} value={8} color={GREEN} extendTo={input.x - 40} bandInset="start" />}
        {input && <HTickMark x={input.x} y={input.y + input.height} width={input.width} value={8} color={GREEN} extendTo={input.x - 40} bandInset="end" />}
      </div>
    </AnatomyFrame>
  );
}
