import React, { useLayoutEffect, useRef, useState } from "react";
import { Accordion } from "../../../packages/core/src/components/Disclosure";
import { AnatomyFrame, RegionPadding, AutoBand } from "./AnatomyPrimitives";

interface Region {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Spacing anatomy for Accordion, measured from the live component's DOM.
 * Padding values (16px) are fixed to the approved spec; the trigger's "Auto"
 * region (title-to-chevron gap) is still located dynamically so it tracks
 * wherever the title text actually ends.
 */
export function AccordionAnatomy() {
  const boxRef = useRef<HTMLDivElement>(null);
  const [trigger, setTrigger] = useState<Region | null>(null);
  const [panel, setPanel] = useState<Region | null>(null);
  const [auto, setAuto] = useState<Region | null>(null);

  useLayoutEffect(() => {
    const box = boxRef.current;
    const triggerEl = box?.querySelector(".cds-accordion-trigger") as HTMLElement | null;
    const panelEl = box?.querySelector(".cds-accordion-panel") as HTMLElement | null;
    const chevronEl = triggerEl?.querySelector(".cds-accordion-chevron") as HTMLElement | null;
    if (!box || !triggerEl || !panelEl || !chevronEl) return;

    const boxRect = box.getBoundingClientRect();
    const triggerRect = triggerEl.getBoundingClientRect();
    const panelRect = panelEl.getBoundingClientRect();
    const chevronRect = chevronEl.getBoundingClientRect();

    setTrigger({
      x: Math.round(triggerRect.left - boxRect.left),
      y: Math.round(triggerRect.top - boxRect.top),
      width: Math.round(triggerRect.width),
      height: Math.round(triggerRect.height),
    });
    setPanel({
      x: Math.round(panelRect.left - boxRect.left),
      y: Math.round(panelRect.top - boxRect.top),
      width: Math.round(panelRect.width),
      height: Math.round(panelRect.height),
    });

    // Title is a bare text node inside the trigger button, before the chevron.
    const titleNode = Array.from(triggerEl.childNodes).find((n) => n.nodeType === Node.TEXT_NODE);
    if (titleNode) {
      const range = document.createRange();
      range.selectNodeContents(titleNode);
      const titleRect = range.getBoundingClientRect();
      setAuto({
        x: Math.round(titleRect.right - boxRect.left),
        y: Math.round(titleRect.top - boxRect.top),
        width: Math.round(chevronRect.left - titleRect.right),
        height: Math.round(titleRect.height),
      });
    }
  }, []);

  return (
    <AnatomyFrame>
      <div ref={boxRef} style={{ position: "relative", width: 918 }}>
        <Accordion
          items={[
            {
              id: "vesting",
              title: "What is vesting?",
              content: (
                <p>Vesting is the schedule by which you gain full ownership of employer contributions to your account over a 3-year cliff or graded period.</p>
              ),
            },
          ]}
          defaultOpenIds={["vesting"]}
        />
        {trigger && <RegionPadding x={trigger.x} y={trigger.y} width={trigger.width} height={trigger.height} size={16} />}
        {panel && <RegionPadding x={panel.x} y={panel.y} width={panel.width} height={panel.height} size={16} edges={["top", "left", "bottom"]} />}
        {auto && <AutoBand x={auto.x} y={auto.y} width={auto.width} height={auto.height} />}
      </div>
    </AnatomyFrame>
  );
}
