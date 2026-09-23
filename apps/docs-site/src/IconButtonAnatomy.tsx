import React, { useLayoutEffect, useRef, useState } from "react";
import { IconButton } from "../../../packages/core/src/components/Button";
import { AnatomyFrame, VGapMark } from "./AnatomyPrimitives";

interface Region {
  x: number;
  y: number;
  width: number;
  height: number;
}

const GREEN = "#118D57";

const EditIcon = ({ size }: { size: "sm" | "md" | "lg" }) => {
  const px = size === "sm" ? 16 : size === "lg" ? 24 : 20;
  return (
    <svg width={px} height={px} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
  );
};

function SingleIconButtonAnatomy({ size, value }: { size: "sm" | "md"; value: number }) {
  const boxRef = useRef<HTMLDivElement>(null);
  const [btn, setBtn] = useState<Region | null>(null);

  useLayoutEffect(() => {
    const box = boxRef.current;
    const btnEl = box?.querySelector(".cds-icon-btn") as HTMLElement | null;
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
    <div ref={boxRef} style={{ position: "relative", marginTop: 40, marginLeft: 40 }}>
      <IconButton variant="secondary" size={size} aria-label="Edit">
        <EditIcon size={size} />
      </IconButton>
      {btn && <VGapMark x={btn.x} y={btn.y} height={btn.height} value={value} color={GREEN} extendTo={btn.y - 30} bandInset="start" />}
      {btn && <VGapMark x={btn.x + btn.width} y={btn.y} height={btn.height} value={value} color={GREEN} extendTo={btn.y - 30} bandInset="end" />}
    </div>
  );
}

/**
 * Spacing anatomy for Icon Button, measured from the live component:
 *   .cds-icon-btn--sm padding: core-space-1 (4px)
 *   .cds-icon-btn--md / --lg padding: core-space-2 (8px)
 */
export function IconButtonAnatomy() {
  return (
    <AnatomyFrame>
      <div style={{ display: "flex", gap: 64 }}>
        <SingleIconButtonAnatomy size="sm" value={4} />
        <SingleIconButtonAnatomy size="md" value={8} />
      </div>
    </AnatomyFrame>
  );
}
