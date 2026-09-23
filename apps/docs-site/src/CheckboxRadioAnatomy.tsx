import React, { useLayoutEffect, useRef, useState } from "react";
import { Checkbox, Radio } from "../../../packages/core/src/components/FormControls";
import { AnatomyFrame, GapCallout } from "./AnatomyPrimitives";

/**
 * Spacing anatomy for Checkbox/Radio, measured from the live components.
 * .cds-checkbox / .cds-radio gap: core-space-2 (8px), between the
 * control box and its label.
 */
export function CheckboxRadioAnatomy() {
  const boxRef = useRef<HTMLDivElement>(null);
  const [checkboxGap, setCheckboxGap] = useState<{ x: number; width: number } | null>(null);
  const [radioGap, setRadioGap] = useState<{ x: number; width: number } | null>(null);

  useLayoutEffect(() => {
    const box = boxRef.current;
    const checkboxControl = box?.querySelector(".cds-checkbox-box") as HTMLElement | null;
    const radioControl = box?.querySelector(".cds-radio-box") as HTMLElement | null;
    if (!box || !checkboxControl || !radioControl) return;

    const boxRect = box.getBoundingClientRect();
    const checkboxControlRect = checkboxControl.getBoundingClientRect();
    const radioControlRect = radioControl.getBoundingClientRect();

    const checkboxLabelNode = checkboxControl.nextSibling;
    const radioLabelNode = radioControl.nextSibling;

    if (checkboxLabelNode) {
      const range = document.createRange();
      range.selectNodeContents(checkboxLabelNode);
      const labelRect = range.getBoundingClientRect();
      setCheckboxGap({
        x: Math.round(checkboxControlRect.right - boxRect.left),
        width: Math.round(labelRect.left - checkboxControlRect.right),
      });
    }
    if (radioLabelNode) {
      const range = document.createRange();
      range.selectNodeContents(radioLabelNode);
      const labelRect = range.getBoundingClientRect();
      setRadioGap({
        x: Math.round(radioControlRect.right - boxRect.left),
        width: Math.round(labelRect.left - radioControlRect.right),
      });
    }
  }, []);

  return (
    <AnatomyFrame>
      <div ref={boxRef} style={{ position: "relative", display: "flex", flexDirection: "column", gap: 48, marginTop: 46 }}>
        <div style={{ position: "relative", display: "inline-flex" }}>
          <Checkbox label="Option" readOnly />
          {checkboxGap && <GapCallout x={checkboxGap.x} width={checkboxGap.width} value={8} />}
        </div>
        <div style={{ position: "relative", display: "inline-flex" }}>
          <Radio label="Option" readOnly />
          {radioGap && <GapCallout x={radioGap.x} width={radioGap.width} value={8} />}
        </div>
      </div>
    </AnatomyFrame>
  );
}
