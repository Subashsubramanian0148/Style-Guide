import React, { useEffect, useRef, useState } from "react";
import { Icon } from "../../../packages/core/src/components/Primitives";
import { AutoSizing } from "./ComponentSizing";

/** Value badges are absolutely positioned leaves with white text on a solid
 *  fill; when two land on the same spot one hides the other. Nudge the later
 *  badge to the nearest free position so every value stays readable. */
function resolveBadgeOverlaps(root: HTMLElement | null) {
  if (!root) return;
  const badges = [...root.querySelectorAll<HTMLElement>("div, span")].filter((el) => {
    if (el.children.length || el.style.position !== "absolute") return false;
    const text = el.textContent?.trim() ?? "";
    if (!text || text.length > 18) return false;
    const cs = getComputedStyle(el);
    return cs.color === "rgb(255, 255, 255)" && cs.backgroundColor !== "rgba(0, 0, 0, 0)";
  });
  badges.forEach((b) => (b.style.translate = ""));
  const placed: DOMRect[] = [];
  const hits = (r: { left: number; right: number; top: number; bottom: number }) =>
    placed.some((p) => r.left < p.right + 2 && p.left < r.right + 2 && r.top < p.bottom + 2 && p.top < r.bottom + 2);
  for (const b of badges) {
    const r = b.getBoundingClientRect();
    if (!r.width) continue;
    let dx = 0;
    let dy = 0;
    if (hits(r)) {
      const stepY = r.height + 4;
      const stepX = r.width + 4;
      search: for (let k = 1; k <= 6; k++) {
        for (const [x, y] of [[0, -k * stepY], [0, k * stepY], [-k * stepX, 0], [k * stepX, 0]]) {
          const c = { left: r.left + x, right: r.right + x, top: r.top + y, bottom: r.bottom + y };
          if (!hits(c)) {
            dx = x;
            dy = y;
            break search;
          }
        }
      }
      b.style.translate = `${dx}px ${dy}px`;
    }
    placed.push(new DOMRect(r.left + dx, r.top + dy, r.width, r.height));
  }
}

/** Toggles between a component's live demo and its code-built spacing
 *  anatomy — switching one out for the other, not stacking both. */
export function AnatomySection({ demo, anatomy }: { demo: React.ReactNode; anatomy: React.ReactNode }) {
  const [showAnatomy, setShowAnatomy] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showAnatomy) return;
    const run = () => resolveBadgeOverlaps(bodyRef.current);
    // Diagrams measure and draw their badges a frame or two after mount.
    const timers = [300, 900].map((ms) => window.setTimeout(run, ms));
    let resizeTimer = 0;
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(run, 400);
    };
    window.addEventListener("resize", onResize);
    return () => {
      timers.forEach(window.clearTimeout);
      window.clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
    };
  }, [showAnatomy]);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
        <button
          type="button"
          onClick={() => setShowAnatomy((v) => !v)}
          aria-pressed={showAnatomy}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "var(--core-space-1) var(--core-space-3)",
            borderRadius: "var(--core-radius-md)",
            border: "1px solid var(--core-color-border-default)",
            background: showAnatomy ? "var(--core-color-bg-selected)" : "var(--core-color-bg-surface)",
            color: "var(--core-color-text-secondary)",
            fontSize: "var(--typography-body-sm-size)",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          <Icon name="fa-solid fa-ruler-combined" size="sm" />
          {showAnatomy ? "Hide anatomy" : "Show anatomy"}
        </button>
      </div>

      {showAnatomy ? (
        <div ref={bodyRef}>
          {anatomy}
          <AutoSizing />
        </div>
      ) : (
        demo
      )}
    </div>
  );
}
