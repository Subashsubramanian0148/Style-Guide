import React from "react";

export interface AnatomyPoint {
  n: number;
  label: string;
  /** Position of the numbered marker, in px, relative to the anatomy stage. */
  x: number;
  y: number;
  /** Direction the connecting line/leader travels from the marker. */
  leaderTo?: { x: number; y: number };
}

export interface AnatomyRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function Anatomy({ children, points = [], rects = [], height = 120 }: { children?: React.ReactNode; points?: AnatomyPoint[]; rects?: AnatomyRect[]; height?: number }) {
  return (
    <div style={{ position: "relative", minHeight: height, background: "var(--core-color-bg-page)", border: "1px solid var(--core-color-border-subtle)", borderRadius: "var(--core-radius-md)", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", margin: "16px 0" }}>
      <div style={{ position: "relative", display: "inline-block" }}>
        {children}
        {rects.map((r, i) => (
          <div key={`rect-${i}`} style={{
            position: "absolute",
            left: r.x,
            top: r.y,
            width: r.width,
            height: r.height,
            background: "rgba(35, 136, 73, 0.2)",
            border: "1px solid #238849",
            pointerEvents: "none",
            zIndex: 5
          }} />
        ))}
        {points.map((p, i) => (
          <React.Fragment key={i}>
            {p.leaderTo && (
              <svg style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", overflow: "visible", pointerEvents: "none", zIndex: 10 }}>
                <line x1={p.x} y1={p.y} x2={p.leaderTo.x} y2={p.leaderTo.y} stroke="var(--core-color-status-success-text)" strokeWidth="1" opacity="0.6" />
              </svg>
            )}
            <div style={{
              position: "absolute",
              left: p.x,
              top: p.y,
              transform: "translate(-50%, -50%)",
              background: "var(--core-color-status-success-text)",
              color: "white",
              fontSize: 12,
              fontWeight: "bold",
              borderRadius: "4px",
              padding: "2px 6px",
              lineHeight: 1,
              zIndex: 20,
              pointerEvents: "none"
            }}>
              {p.n}
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

export function AnatomyLegend({ points = [] }: { points?: AnatomyPoint[] }) {
  if (points.length === 0) return null;
  return (
    <ul style={{ display: "flex", gap: "24px", flexWrap: "wrap", padding: 0, margin: "0 0 32px 0", listStyle: "none" }}>
      {points.map((p, i) => (
        <li key={i} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: 14 }}>
          <span style={{
            background: "var(--core-color-status-success-text)",
            color: "white",
            fontSize: 12,
            fontWeight: "bold",
            borderRadius: "4px",
            padding: "2px 6px",
            lineHeight: 1
          }}>{p.n}</span>
          <span style={{ color: "var(--core-color-text-secondary)" }}>{p.label}</span>
        </li>
      ))}
    </ul>
  );
}
