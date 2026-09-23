import React, { useRef, useState } from "react";
import { ChevronIcon } from "./Primitives";
export { Collapsible, type CollapsibleProps, type CollapsibleVariant } from "./Primitives";

export type AccordionVariant = "bordered" | "separated" | "flush";
export interface AccordionItem {
  id: string;
  title: string;
  content: React.ReactNode;
  disabled?: boolean;
}

export function Accordion({
  items,
  allowMultiple = false,
  defaultOpenIds = [],
  variant = "bordered",
}: {
  items: AccordionItem[];
  allowMultiple?: boolean;
  defaultOpenIds?: string[];
  variant?: AccordionVariant;
}) {
  const [open, setOpen] = useState<Set<string>>(new Set(defaultOpenIds));
  const triggerRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const toggle = (id: string, disabled?: boolean) => {
    if (disabled) return;
    setOpen((prev) => {
      const next = allowMultiple ? new Set(prev) : new Set<string>();
      if (prev.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };
  // WAI-ARIA Accordion pattern (https://www.w3.org/WAI/ARIA/apg/patterns/accordion/):
  // Down/Up move focus to the next/previous header, Home/End jump to the
  // first/last. Disabled headers are skipped, matching how Tab already
  // behaves (disabled buttons aren't part of the tab order).
  const focusTrigger = (index: number) => {
    const count = items.length;
    const wrapped = ((index % count) + count) % count;
    for (let i = 0; i < count; i++) {
      const candidate = (wrapped + i) % count;
      const el = triggerRefs.current[candidate];
      if (el && !items[candidate].disabled) {
        el.focus();
        return;
      }
    }
  };
  const onTriggerKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        focusTrigger(index + 1);
        break;
      case "ArrowUp":
        e.preventDefault();
        focusTrigger(index - 1);
        break;
      case "Home":
        e.preventDefault();
        focusTrigger(0);
        break;
      case "End":
        e.preventDefault();
        focusTrigger(items.length - 1);
        break;
    }
  };
  return (
    <div className={`cds-accordion cds-accordion--${variant}`}>
      {items.map((item, index) => {
        const isOpen = open.has(item.id) && !item.disabled;
        return (
          <div className={`cds-accordion-item ${isOpen ? "cds-accordion-item--open" : ""}`} key={item.id}>
            <h3 style={{ margin: 0 }}>
              <button
                ref={(el) => { triggerRefs.current[index] = el; }}
                className="cds-accordion-trigger"
                aria-expanded={isOpen}
                aria-controls={`panel-${item.id}`}
                aria-disabled={item.disabled}
                disabled={item.disabled}
                id={`trigger-${item.id}`}
                onClick={() => toggle(item.id, item.disabled)}
                onKeyDown={(e) => onTriggerKeyDown(e, index)}
              >
                {item.title}
                <ChevronIcon className="cds-accordion-chevron" />
              </button>
            </h3>
            {isOpen && (
              <div className="cds-accordion-panel" id={`panel-${item.id}`} role="region" aria-labelledby={`trigger-${item.id}`}>
                {item.content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export function Separator({ orientation = "horizontal" }: { orientation?: "horizontal" | "vertical" }) {
  return <div role="separator" aria-orientation={orientation} className={orientation === "vertical" ? "cds-separator cds-separator--v" : "cds-separator cds-separator--h"} />;
}

export function Skeleton({ width = "100%", height = 16, radius }: { width?: number | string; height?: number | string; radius?: string }) {
  return <div className="cds-skeleton" style={{ width, height, borderRadius: radius }} aria-hidden="true" />;
}
