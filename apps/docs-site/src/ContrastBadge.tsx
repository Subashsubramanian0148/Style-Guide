import React from "react";
import { contrastAgainst } from "./lib/contrast";

const levelColor: Record<string, string> = {
  aaa: "#2ECC81",
  aa: "#4ADE9C",
  "aa-large": "#E89A1C",
  fail: "#F58E93",
};
const levelLabel: Record<string, string> = {
  aaa: "AAA",
  aa: "AA",
  "aa-large": "AA (large text only)",
  fail: "Fail — text only",
};

/** Shows whether white or black text passes WCAG on this background hex. */
export function ContrastBadge({ hex }: { hex: string }) {
  const { onWhite, onBlack } = contrastAgainst(hex);
  const best = onWhite.ratio >= onBlack.ratio ? { ...onWhite, on: "white" } : { ...onBlack, on: "black" };
  return (
    <span
      style={{
        fontSize: "var(--typography-font-size-xs)",
        fontWeight: 700,
        padding: "2px 6px",
        borderRadius: 4,
        color: "#0B0C10",
        background: levelColor[best.level],
        whiteSpace: "nowrap",
      }}
      title={`${best.ratio.toFixed(2)}:1 with ${best.on} text`}
    >
      {best.ratio.toFixed(1)}:1 · {levelLabel[best.level]}
    </span>
  );
}
