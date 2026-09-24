import React from "react";

const DEFAULT_COLOR = "#118D57";
const PADDING_COLOR = "#2563EB";
const GAP_COLOR = "#DB2777";
const CALLOUT_COLOR = "#C2410C";

function fill(color: string) {
  return `${color}33`;
}

// A thin band (e.g. the 8-12px gap between two rows) reads as barely more
// than a line at the default translucency, so gap callouts use a stronger
// fill to stay visible at that height.
function fillStrong(color: string) {
  return `${color}4D`;
}

/** Wraps a measured anatomy diagram. */
export function AnatomyFrame({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ position: "relative", display: "inline-flex" }}>
      {children}
    </div>
  );
}

/** A solid-color band + numbered badge along one edge of an `AnatomyFrame`,
 *  sized to a padding/margin value measured from the live DOM. */
export function SpacingBand({ edge, size, color = PADDING_COLOR }: { edge: "top" | "bottom" | "left" | "right"; size: number; color?: string }) {
  if (size <= 0) return null;
  const band: React.CSSProperties = { position: "absolute", background: fill(color), pointerEvents: "none", zIndex: 1 };
  const badge: React.CSSProperties = { position: "absolute", background: color, color: "white", fontSize: 11, fontWeight: 700, lineHeight: 1, padding: "var(--core-space-1) var(--core-space-1)", borderRadius: 4, zIndex: 2, pointerEvents: "none" };

  switch (edge) {
    case "top":
      return (
        <>
          <div style={{ ...band, top: 0, left: 0, right: 0, height: size }} />
          <div style={{ ...badge, top: -9, left: "50%", transform: "translateX(-50%)" }}>{size}</div>
        </>
      );
    case "bottom":
      return (
        <>
          <div style={{ ...band, bottom: 0, left: 0, right: 0, height: size }} />
          <div style={{ ...badge, bottom: -9, left: "50%", transform: "translateX(-50%)" }}>{size}</div>
        </>
      );
    case "left":
      return (
        <>
          <div style={{ ...band, top: 0, bottom: 0, left: 0, width: size }} />
          <div style={{ ...badge, left: -9, top: "50%", transform: "translateY(-50%)" }}>{size}</div>
        </>
      );
    case "right":
      return (
        <>
          <div style={{ ...band, top: 0, bottom: 0, right: 0, width: size }} />
          <div style={{ ...badge, right: -9, top: "50%", transform: "translateY(-50%)" }}>{size}</div>
        </>
      );
  }
}

/** Like `SpacingBand`, but for a padding region that doesn't span the whole
 *  `AnatomyFrame` — e.g. a single row within a larger component (an
 *  Accordion's trigger and panel each have their own 16px padding, at
 *  different vertical offsets within the same frame). */
export function RegionPadding({
  x,
  y,
  width,
  height,
  size,
  color = PADDING_COLOR,
  edges = ["top", "right", "bottom", "left"],
}: {
  x: number;
  y: number;
  width: number;
  height: number;
  size: number;
  color?: string;
  edges?: Array<"top" | "right" | "bottom" | "left">;
}) {
  const band: React.CSSProperties = { position: "absolute", background: fill(color), pointerEvents: "none", zIndex: 1 };
  const badge: React.CSSProperties = { position: "absolute", background: color, color: "white", fontSize: 11, fontWeight: 700, lineHeight: 1, padding: "var(--core-space-1) var(--core-space-1)", borderRadius: 4, zIndex: 2, pointerEvents: "none" };

  return (
    <>
      {edges.includes("top") && (
        <>
          <div style={{ ...band, left: x, top: y, width, height: size }} />
          <div style={{ ...badge, left: x + width / 2, top: y - 9, transform: "translateX(-50%)" }}>{size}</div>
        </>
      )}
      {edges.includes("bottom") && (
        <>
          <div style={{ ...band, left: x, top: y + height - size, width, height: size }} />
          <div style={{ ...badge, left: x + width / 2, top: y + height - 9, transform: "translateX(-50%)" }}>{size}</div>
        </>
      )}
      {edges.includes("left") && (
        <>
          <div style={{ ...band, left: x, top: y, width: size, height }} />
          <div style={{ ...badge, left: x - 9, top: y + height / 2, transform: "translateY(-50%)" }}>{size}</div>
        </>
      )}
      {edges.includes("right") && (
        <>
          <div style={{ ...band, left: x + width - size, top: y, width: size, height }} />
          <div style={{ ...badge, left: x + width - 9, top: y + height / 2, transform: "translateY(-50%)" }}>{size}</div>
        </>
      )}
    </>
  );
}

/** A thin vertical tick + badge at its top, marking an internal flex gap
 *  within a row (e.g. the icon-to-text, text-to-badge, and badge-to-remove
 *  gaps inside an Attachment row) — unlike `GapCallout`, the badge sits at
 *  the mark's own top rather than floating above the whole frame. */
export function VGapMark({
  x,
  y,
  height,
  value,
  color = PADDING_COLOR,
  extendTo,
  bandInset = "center",
}: {
  x: number;
  y: number;
  height: number;
  value: number;
  color?: string;
  /** When neighboring marks would otherwise collide (e.g. several gap
   *  badges landing at the same row-top height), pass a y above `y` here —
   *  the line stretches up to meet it and the badge floats there instead,
   *  clear of the clutter. */
  extendTo?: number;
  /** Where the fill band sits relative to `x`: "center" straddles it (for a
   *  gap between two elements), "start"/"end" keep the whole band on one
   *  side (for a hard edge, like a badge's own left/right padding, where a
   *  centered band would spill outside the box). */
  bandInset?: "start" | "end" | "center";
}) {
  const top = extendTo !== undefined ? Math.min(extendTo, y) : y;
  const bandWidth = 8;
  const bandLeft = bandInset === "start" ? x : bandInset === "end" ? x - bandWidth : x - bandWidth / 2;
  return (
    <>
      <div style={{ position: "absolute", left: bandLeft, top: y, width: bandWidth, height, background: fillStrong(color), zIndex: 1, pointerEvents: "none" }} />
      <div style={{ position: "absolute", left: x, top, width: 1, height: y + height - top, background: color, zIndex: 2, pointerEvents: "none" }} />
      <div style={{ position: "absolute", left: x, top: top - 9, transform: "translateX(-50%)", background: color, color: "white", fontSize: 11, fontWeight: 700, lineHeight: 1, padding: "var(--core-space-1) var(--core-space-1)", borderRadius: 4, zIndex: 3, pointerEvents: "none" }}>
        {value}
      </div>
    </>
  );
}

/** The horizontal counterpart to `VGapMark` — a thin horizontal tick +
 *  fill band with its badge floating to the left, for marking a padding
 *  edge that reads top-to-bottom (e.g. a badge's top/bottom padding). */
export function HTickMark({
  x,
  y,
  width,
  value,
  color = PADDING_COLOR,
  extendTo,
  bandInset = "center",
}: {
  x: number;
  y: number;
  width: number;
  value: number;
  color?: string;
  /** Pass an x to the left of `x` to float the badge clear of nearby
   *  clutter, the same way `VGapMark`'s `extendTo` does vertically. */
  extendTo?: number;
  /** Where the fill band sits relative to `y`: "center" straddles it (for a
   *  gap between two elements), "start"/"end" keep the whole band on one
   *  side (for a hard edge, like a badge's own top/bottom padding, where a
   *  centered band would spill outside the box). */
  bandInset?: "start" | "end" | "center";
}) {
  const left = extendTo !== undefined ? Math.min(extendTo, x) : x;
  const bandHeight = 8;
  const bandTop = bandInset === "start" ? y : bandInset === "end" ? y - bandHeight : y - bandHeight / 2;
  return (
    <>
      <div style={{ position: "absolute", left, top: bandTop, width: x + width - left, height: bandHeight, background: fillStrong(color), zIndex: 1, pointerEvents: "none" }} />
      <div style={{ position: "absolute", left, top: y, width: x + width - left, height: 1, background: color, zIndex: 2, pointerEvents: "none" }} />
      <div style={{ position: "absolute", left: left - 9, top: y, transform: "translateY(-50%)", background: color, color: "white", fontSize: 11, fontWeight: 700, lineHeight: 1, padding: "var(--core-space-1) var(--core-space-1)", borderRadius: 4, zIndex: 3, pointerEvents: "none" }}>
        {value}
      </div>
    </>
  );
}

/** A solid-color band + numbered badge marking the gap between two elements,
 *  positioned at pixel coordinates measured from the live DOM. */
export function GapBand({ x, y, width, height, color = GAP_COLOR }: { x: number; y: number; width: number; height: number; color?: string }) {
  if (width <= 0) return null;
  return (
    <>
      <div style={{ position: "absolute", left: x, top: y, width, height, background: fill(color), pointerEvents: "none", zIndex: 1 }} />
      <div style={{ position: "absolute", left: x + width / 2, top: y + height, transform: "translate(-50%, -50%)", background: color, color: "white", fontSize: 11, fontWeight: 700, lineHeight: 1, padding: "var(--core-space-1) var(--core-space-1)", borderRadius: 4, zIndex: 2, pointerEvents: "none" }}>
        {width}
      </div>
    </>
  );
}

/** A solid-color band labeled "Auto" over a flex/grid region that sizes itself
 *  to its content rather than a fixed spacing token (e.g. the text column
 *  of an Alert, which grows or shrinks with the available width). */
export function AutoBand({ x, y, width, height, color = GAP_COLOR }: { x: number; y: number; width: number; height: number; color?: string }) {
  if (width <= 0) return null;
  return (
    <>
      <div style={{ position: "absolute", left: x, top: y, width, height, background: fill(color), pointerEvents: "none", zIndex: 1 }} />
      <div style={{ position: "absolute", left: x + width / 2, top: y + height / 2, transform: "translate(-50%, -50%)", background: color, color: "white", fontSize: 11, fontWeight: 700, lineHeight: 1, padding: "var(--core-space-1) var(--core-space-2)", borderRadius: 4, zIndex: 2, pointerEvents: "none" }}>
        Auto
      </div>
    </>
  );
}

/** A full-height gap indicator with its badge floating above the frame,
 *  connected by a leader line — for a gap called out separately from the
 *  main padding spec (e.g. the icon-to-text gap in Alert). */
export function GapCallout({ x, width, value, color = CALLOUT_COLOR }: { x: number; width: number; value: number; color?: string }) {
  if (width <= 0) return null;
  return (
    <>
      <div style={{ position: "absolute", left: x, top: 0, bottom: 0, width, background: fill(color), pointerEvents: "none", zIndex: 1 }} />
      <div style={{ position: "absolute", left: x + width / 2, top: -34, width: 1, height: 34, background: color, pointerEvents: "none", zIndex: 2 }} />
      <div style={{ position: "absolute", left: x + width / 2, top: -46, transform: "translateX(-50%)", background: color, color: "white", fontSize: 11, fontWeight: 700, lineHeight: 1, padding: "var(--core-space-1) var(--core-space-1)", borderRadius: 4, zIndex: 3, pointerEvents: "none" }}>
        {value}
      </div>
    </>
  );
}

/** A horizontal gap indicator with its badge floating to the left of the
 *  frame, connected by a leader line — for a vertical gap called out
 *  separately from the main padding spec (e.g. the title-to-body gap in
 *  Alert). */
export function HGapCallout({
  y,
  width,
  height,
  value,
  color = DEFAULT_COLOR,
  side = "right",
}: {
  y: number;
  width: number;
  height: number;
  value: number;
  color?: string;
  side?: "left" | "right";
}) {
  if (height <= 0) return null;
  const badge: React.CSSProperties = { position: "absolute", top: y + height / 2, transform: "translateY(-50%)", background: color, color: "white", fontSize: 11, fontWeight: 700, lineHeight: 1, padding: "var(--core-space-1) var(--core-space-1)", borderRadius: 4, zIndex: 3, pointerEvents: "none" };
  const line: React.CSSProperties = { position: "absolute", top: y + height / 2, width: 34, height: 1, background: color, pointerEvents: "none", zIndex: 2 };

  return (
    <>
      <div style={{ position: "absolute", left: 0, top: y, width, height, background: fillStrong(color), pointerEvents: "none", zIndex: 1 }} />

      {side === "right" ? (
        <>
          <div style={{ ...line, left: width }} />
          <div style={{ ...badge, left: width + 34 }}>{value}</div>
        </>
      ) : (
        <>
          <div style={{ ...line, left: -34 }} />
          <div style={{ ...badge, left: -46 }}>{value}</div>
        </>
      )}
    </>
  );
}

/** Renders translucent inset bands around `children` sized to the given
 *  padding, with a numbered badge on each edge — the same redline convention
 *  used by LogoAnatomy, generalized so any component's anatomy can reuse it. */
export function PaddingRing({
  top,
  right = top,
  bottom = top,
  left = right,
  color = DEFAULT_COLOR,
  children,
}: {
  top: number;
  right?: number;
  bottom?: number;
  left?: number;
  color?: string;
  children: React.ReactNode;
}) {
  const bandStyle = (thickness: number): React.CSSProperties => ({
    position: "absolute",
    background: `${color}33`,
    pointerEvents: "none",
    zIndex: 1,
  });
  const badgeStyle: React.CSSProperties = {
    position: "absolute",
    background: color,
    color: "white",
    fontSize: 11,
    fontWeight: 700,
    lineHeight: 1,
    padding: "var(--core-space-1) var(--core-space-1)",
    borderRadius: 4,
    zIndex: 2,
    pointerEvents: "none",
  };

  return (
    <div style={{ position: "relative", display: "inline-flex", outline: `1px solid ${color}` }}>
      <div style={{ ...bandStyle(top), top: 0, left: 0, right: 0, height: top, borderBottom: `1px solid ${color}` }} />
      <div style={{ ...bandStyle(bottom), bottom: 0, left: 0, right: 0, height: bottom, borderTop: `1px solid ${color}` }} />
      <div style={{ ...bandStyle(left), top: 0, bottom: 0, left: 0, width: left, borderRight: `1px solid ${color}` }} />
      <div style={{ ...bandStyle(right), top: 0, bottom: 0, right: 0, width: right, borderLeft: `1px solid ${color}` }} />

      <div style={{ ...badgeStyle, top: -10, left: "50%", transform: "translateX(-50%)" }}>{top}</div>
      <div style={{ ...badgeStyle, bottom: -10, left: "50%", transform: "translateX(-50%)" }}>{bottom}</div>
      <div style={{ ...badgeStyle, left: -10, top: "50%", transform: "translateY(-50%)" }}>{left}</div>
      <div style={{ ...badgeStyle, right: -10, top: "50%", transform: "translateY(-50%)" }}>{right}</div>

      {children}
    </div>
  );
}

/** A single numbered badge for labeling a gap between two elements — caller
 *  positions it (absolute, relative to a `position: relative` ancestor). */
export function GapMark({ value, style, color = DEFAULT_COLOR }: { value: number; style: React.CSSProperties; color?: string }) {
  return (
    <div
      style={{
        position: "absolute",
        background: color,
        color: "white",
        fontSize: 11,
        fontWeight: 700,
        lineHeight: 1,
        padding: "var(--core-space-1) var(--core-space-1)",
        borderRadius: 4,
        zIndex: 3,
        pointerEvents: "none",
        ...style,
      }}
    >
      {value}
    </div>
  );
}

export type Rect = { x: number; y: number; w: number; h: number };

/** A translucent fill at the region's true (scaled) size — unlike the fixed
 *  8px bands above, the band width here equals the value it marks. */
export function TrueBand({ r, color }: { r: Rect; color: string }) {
  if (r.w <= 0 || r.h <= 0) return null;
  return <div style={{ position: "absolute", left: r.x, top: r.y, width: r.w, height: r.h, background: `${color}40`, pointerEvents: "none", zIndex: 1 }} />;
}

export function NodeOutline({ r, color = PADDING_COLOR }: { r: Rect; color?: string }) {
  return <div style={{ position: "absolute", left: r.x, top: r.y, width: r.w, height: r.h, outline: `1px solid ${color}`, pointerEvents: "none", zIndex: 2 }} />;
}

/** Value badge with a leader line: `axis="v"` draws a vertical line from y=`from`
 *  to the badge; `axis="h"` draws a horizontal line from x=`from`. */
export function Callout({ x, y, from, axis, value, color }: { x: number; y: number; from: number; axis: "v" | "h"; value: number; color: string }) {
  const line: React.CSSProperties =
    axis === "v"
      ? { left: x, top: Math.min(y, from), width: 1, height: Math.abs(from - y) }
      : { left: Math.min(x, from), top: y, width: Math.abs(from - x), height: 1 };
  return (
    <>
      <div style={{ position: "absolute", ...line, background: color, zIndex: 3, pointerEvents: "none" }} />
      <div
        style={{
          position: "absolute",
          left: x,
          top: y,
          transform: "translate(-50%, -50%)",
          background: color,
          color: "white",
          fontSize: 11,
          fontWeight: 700,
          lineHeight: 1,
          padding: "var(--core-space-1) var(--core-space-1)",
          borderRadius: 4,
          zIndex: 4,
          pointerEvents: "none",
        }}
      >
        {value}
      </div>
    </>
  );
}
