import React, { useLayoutEffect, useRef, useState } from "react";
import { Alert } from "../../../packages/core/src/components/Misc";
import { AnatomyFrame, SpacingBand, AutoBand, GapCallout, HGapCallout } from "./AnatomyPrimitives";

interface AutoRegion {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface IconGap {
  x: number;
  width: number;
}

interface TitleGap {
  y: number;
  width: number;
  height: number;
}

/**
 * Spacing anatomy for Alert. Padding values (16px on every edge) are fixed
 * to match the approved reference spec rather than measured from the DOM.
 * The "Auto" band marks the leftover flexible space to the right of the text
 * column — the room that grows or shrinks with content length and container
 * width — not the text column itself, so its position is still located from
 * the live component: from the text's actual right edge to the dismiss
 * button (or the right padding, if there's no dismiss button).
 */
export function AlertAnatomy() {
  const boxRef = useRef<HTMLDivElement>(null);
  const [auto, setAuto] = useState<AutoRegion | null>(null);
  const [iconGap, setIconGap] = useState<IconGap | null>(null);
  const [titleGap, setTitleGap] = useState<TitleGap | null>(null);

  useLayoutEffect(() => {
    const box = boxRef.current;
    const icon = box?.querySelector(".cds-alert__icon") as HTMLElement | null;
    const body = icon?.nextElementSibling as HTMLElement | null;
    const dismiss = box?.querySelector(".cds-alert__dismiss") as HTMLElement | null;
    if (!box || !icon || !body) return;

    const boxRect = box.getBoundingClientRect();
    const iconRect = icon.getBoundingClientRect();
    const bodyRect = body.getBoundingClientRect();
    const emptySpaceEnd = dismiss ? dismiss.getBoundingClientRect().left : boxRect.right - 16;

    const titleEl = body.querySelector("strong") as HTMLElement | null;
    // The description is plain text (not a wrapped element), so measure it
    // with a Range rather than relying on nextElementSibling.
    const descriptionNode = titleEl ? Array.from(body.childNodes)[Array.from(body.childNodes).indexOf(titleEl) + 1] : null;
    if (titleEl && descriptionNode && descriptionNode.nodeType === Node.TEXT_NODE) {
      const range = document.createRange();
      range.selectNodeContents(descriptionNode);
      const titleRect = titleEl.getBoundingClientRect();
      const descriptionRect = range.getBoundingClientRect();
      setTitleGap({
        y: Math.round(titleRect.bottom - boxRect.top),
        width: Math.round(bodyRect.width),
        height: Math.round(descriptionRect.top - titleRect.bottom),
      });
    }

    const width = emptySpaceEnd - bodyRect.right;
    setAuto(
      width <= 0
        ? null
        : {
            x: Math.round(bodyRect.right - boxRect.left),
            y: Math.round(bodyRect.top - boxRect.top),
            width: Math.round(width),
            height: Math.round(bodyRect.height),
          }
    );

    setIconGap({
      x: Math.round(iconRect.right - boxRect.left),
      width: Math.round(bodyRect.left - iconRect.right),
    });
  }, []);

  return (
    <AnatomyFrame>
      <div ref={boxRef} style={{ position: "relative", width: 918, marginTop: 46, marginLeft: 50 }}>
        <Alert tone="success" title="Enrollment complete" onDismiss={() => {}}>
          You are contributing 6% starting next pay cycle.
        </Alert>
        <SpacingBand edge="top" size={16} />
        <SpacingBand edge="bottom" size={16} />
        <SpacingBand edge="left" size={16} />
        <SpacingBand edge="right" size={16} />
        {auto && <AutoBand x={auto.x} y={auto.y} width={auto.width} height={auto.height} />}
        {iconGap && <GapCallout x={iconGap.x} width={iconGap.width} value={12} />}
        {titleGap && <HGapCallout y={titleGap.y} width={titleGap.width} height={titleGap.height} value={4} />}
      </div>
    </AnatomyFrame>
  );
}
