import React, { useLayoutEffect, useRef, useState } from "react";
import { Badge } from "../../../packages/core/src/components/Misc";
import { AnatomyFrame, VGapMark, HTickMark } from "./AnatomyPrimitives";

const GREEN = "#118D57";

interface Region {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Spacing anatomy for Badge (md size), measured from the live component.
 * .cds-badge-size--md padding: core-space-1 core-space-3 (4px / 12px).
 */
export function BadgeAnatomy() {
  const boxRef = useRef<HTMLDivElement>(null);
  const [badge, setBadge] = useState<Region | null>(null);

  useLayoutEffect(() => {
    const box = boxRef.current;
    const badgeEl = box?.querySelector(".cds-badge") as HTMLElement | null;
    if (!box || !badgeEl) return;

    const boxRect = box.getBoundingClientRect();
    const badgeRect = badgeEl.getBoundingClientRect();
    setBadge({
      x: Math.round(badgeRect.left - boxRect.left),
      y: Math.round(badgeRect.top - boxRect.top),
      width: Math.round(badgeRect.width),
      height: Math.round(badgeRect.height),
    });
  }, []);

  return (
    <AnatomyFrame>
      <div ref={boxRef} style={{ position: "relative", marginTop: 40, marginLeft: 60 }}>
        <Badge tone="primary" variant="soft" size="md">primary</Badge>
        {badge && <VGapMark x={badge.x} y={badge.y} height={badge.height} value={12} color={GREEN} extendTo={badge.y - 30} />}
        {badge && <VGapMark x={badge.x + badge.width} y={badge.y} height={badge.height} value={12} color={GREEN} extendTo={badge.y - 30} />}
        {badge && <HTickMark x={badge.x} y={badge.y} width={badge.width} value={4} color={GREEN} extendTo={badge.x - 40} />}
        {badge && <HTickMark x={badge.x} y={badge.y + badge.height} width={badge.width} value={4} color={GREEN} extendTo={badge.x - 40} />}
      </div>
    </AnatomyFrame>
  );
}
