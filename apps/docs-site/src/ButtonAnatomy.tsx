import React, { useLayoutEffect, useRef, useState } from "react";
import { Button } from "../../../packages/core/src/components/Button";
import { AnatomyFrame, VGapMark, HTickMark } from "./AnatomyPrimitives";

interface Region {
  x: number;
  y: number;
  width: number;
  height: number;
}

const GREEN = "#118D57";

/**
 * Spacing anatomy for Button (medium size), measured from the live
 * component. .cds-btn padding: core-space-2 core-space-3 (8px / 12px).
 */
export function ButtonAnatomy() {
  const boxRef = useRef<HTMLDivElement>(null);
  const [btn, setBtn] = useState<Region | null>(null);

  useLayoutEffect(() => {
    const box = boxRef.current;
    const btnEl = box?.querySelector(".cds-btn") as HTMLElement | null;
    if (!box || !btnEl) return;

    const boxRect = box.getBoundingClientRect();
    const btnRect = btnEl.getBoundingClientRect();
    setBtn({
      x: Math.round(btnRect.left - boxRect.left),
      y: Math.round(btnRect.top - boxRect.top),
      width: Math.round(btnRect.width),
      height: Math.round(btnRect.height),
    });
  }, []);

  return (
    <AnatomyFrame>
      <div ref={boxRef} style={{ position: "relative", marginTop: 40, marginLeft: 60 }}>
        <Button variant="secondary" size="md">Medium</Button>
        {btn && <VGapMark x={btn.x} y={btn.y} height={btn.height} value={12} color={GREEN} extendTo={btn.y - 30} bandInset="start" />}
        {btn && <VGapMark x={btn.x + btn.width} y={btn.y} height={btn.height} value={12} color={GREEN} extendTo={btn.y - 30} bandInset="end" />}
        {btn && <HTickMark x={btn.x} y={btn.y} width={btn.width} value={8} color={GREEN} extendTo={btn.x - 40} bandInset="start" />}
        {btn && <HTickMark x={btn.x} y={btn.y + btn.height} width={btn.width} value={8} color={GREEN} extendTo={btn.x - 40} bandInset="end" />}
      </div>
    </AnatomyFrame>
  );
}
