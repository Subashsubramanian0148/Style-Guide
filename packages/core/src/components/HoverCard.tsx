import React, { useRef, useState } from "react";

export function HoverCard({ trigger, title, children }: { trigger: React.ReactElement; title: string; children: React.ReactNode }) {
  const [show, setShow] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const open = () => { if (timer.current) clearTimeout(timer.current); setShow(true); };
  const close = () => { timer.current = setTimeout(() => setShow(false), 100); };
  return (
    <span style={{ position: "relative", display: "inline-block" }} onMouseEnter={open} onMouseLeave={close} onFocus={open} onBlur={close}>
      {trigger}
      {show && (
        <div className="cds-hovercard" role="tooltip" style={{ position: "absolute", top: "calc(100% + 8px)", left: 0, zIndex: 25 }}>
          <div className="cds-hovercard-title">{title}</div>
          {children}
        </div>
      )}
    </span>
  );
}
