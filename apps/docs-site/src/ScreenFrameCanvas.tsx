import React, { useEffect, useRef, useState } from "react";

/** Position of an element in this window's coordinates — also for elements
 *  inside a same-origin iframe (the mobile screens), where the iframe's own
 *  offset and scale are applied. */
export function screenRect(el: Element): { left: number; top: number; width: number; height: number } {
  const r = el.getBoundingClientRect();
  const frame = el.ownerDocument.defaultView?.frameElement as HTMLIFrameElement | null;
  if (!frame || el.ownerDocument === document) return { left: r.left, top: r.top, width: r.width, height: r.height };
  const fr = frame.getBoundingClientRect();
  const s = frame.offsetWidth ? fr.width / frame.offsetWidth : 1;
  return { left: fr.left + r.left * s, top: fr.top + r.top * s, width: r.width * s, height: r.height * s };
}

/** Renders a screen route in an iframe `width` wide, grown to its full
 *  content height, so the screen's real breakpoints apply. Reports the
 *  frame's root element (marked data-spec-root) once it has rendered. */
export function FrameCanvas({ src, width, onRoot }: { src: string; width: number; onRoot: (root: HTMLElement | null) => void }) {
  const ref = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState(844);

  useEffect(() => {
    const iframe = ref.current;
    if (!iframe) return;
    let ro: ResizeObserver | null = null;
    let timer = 0;
    const attach = () => {
      const doc = iframe.contentDocument;
      const root = doc?.getElementById("root");
      const screen = doc?.querySelector(".sr-frame");
      if (!root || !screen) {
        timer = window.setTimeout(attach, 100);
        return;
      }
      root.setAttribute("data-spec-root", "1");
      const fit = () => setHeight(Math.ceil((screen as HTMLElement).offsetHeight));
      fit();
      ro = new ResizeObserver(() => {
        fit();
        onRoot(root);
      });
      ro.observe(screen);
      // Fonts and charts settle a moment after first paint.
      window.setTimeout(() => {
        fit();
        onRoot(root);
      }, 600);
    };
    onRoot(null);
    iframe.addEventListener("load", attach);
    return () => {
      iframe.removeEventListener("load", attach);
      window.clearTimeout(timer);
      ro?.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src]);

  return <iframe ref={ref} src={src} title="Mobile screen" width={width} height={height} scrolling="no" style={{ display: "block", border: 0, pointerEvents: "none", background: "transparent" }} />;
}
