import React, { useLayoutEffect, useRef, useState } from "react";
import { Button } from "../../../packages/core/src/components/Button";
import { AnatomyFrame, VGapMark, HTickMark } from "./AnatomyPrimitives";

interface Region {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface Spec {
  fontFamily: string;
  fontSize: string;
  fontWeight: string;
  lineHeight: string;
  color: string;
  background: string;
  borderWidth: string;
  borderColor: string;
  borderRadius: string;
  minHeight: string;
  paddingY: string;
  paddingX: string;
  gap: string;
}

const GREEN = "#118D57";

/** One row of the spec table. `token` is the design-system variable the
 *  property resolves through; `value` is what it computes to in the live
 *  component; `swatch` renders a color chip when the value is a color. */
function SpecRow({ label, token, value, swatch }: { label: string; token: string; value: string; swatch?: string }) {
  return (
    <tr>
      <td style={{ padding: "6px 16px 6px 0", fontWeight: 600, color: "var(--core-color-text-primary)", whiteSpace: "nowrap" }}>{label}</td>
      <td style={{ padding: "6px 16px 6px 0", fontFamily: "var(--typography-font-family-mono, monospace)", fontSize: 12, color: "var(--core-color-text-tertiary)", whiteSpace: "nowrap" }}>{token}</td>
      <td style={{ padding: "6px 0", color: "var(--core-color-text-secondary)", whiteSpace: "nowrap" }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
          {swatch && <span style={{ width: 14, height: 14, borderRadius: 3, background: swatch, border: "1px solid var(--core-color-border-subtle)", display: "inline-block" }} />}
          {value}
        </span>
      </td>
    </tr>
  );
}

/**
 * Detailed anatomy for the Button component (primary, medium). Padding is
 * marked on the live button (12px horizontal / 8px vertical), and every
 * other spec — type, color, border, radius — is read from the live
 * component's computed style so the table can never drift from what
 * actually renders. Token references map each value back to the design
 * system:
 *   padding      core-space-2 core-space-3 (8px / 12px)
 *   min-height   core-size-control-md (40px)
 *   gap          core-space-2 (8px)
 *   font         typography-text14-semibold (14px / 700 / 21px)
 *   background   brand-background-primary-strong
 *   color        brand-text-primary-oncolor
 *   border       1px solid brand-border-primary-default
 *   radius       core-radius-sm (8px)
 */
export function ButtonAnatomy() {
  const boxRef = useRef<HTMLDivElement>(null);
  const [btn, setBtn] = useState<Region | null>(null);
  const [spec, setSpec] = useState<Spec | null>(null);

  useLayoutEffect(() => {
    const box = boxRef.current;
    const btnEl = box?.querySelector(".cds-btn") as HTMLElement | null;
    if (!box || !btnEl) return;

    const boxRect = box.getBoundingClientRect();
    const btnRect = btnEl.getBoundingClientRect();
    setBtn({
      x: Math.round(btnRect.left - boxRect.left),
      y: Math.round(btnRect.top - boxRect.top),
      width: Math.round(btnRect.width),
      height: Math.round(btnRect.height),
    });

    const s = getComputedStyle(btnEl);
    setSpec({
      fontFamily: s.fontFamily.split(",")[0].replace(/["']/g, ""),
      fontSize: s.fontSize,
      fontWeight: s.fontWeight,
      lineHeight: s.lineHeight,
      color: s.color,
      background: s.backgroundColor,
      borderWidth: s.borderTopWidth,
      borderColor: s.borderTopColor,
      borderRadius: s.borderTopLeftRadius,
      minHeight: s.minHeight,
      paddingY: s.paddingTop,
      paddingX: s.paddingLeft,
      gap: s.columnGap === "normal" ? "0px" : s.columnGap,
    });
  }, []);

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 48, alignItems: "flex-start" }}>
      <AnatomyFrame>
        <div ref={boxRef} style={{ position: "relative", marginTop: 40, marginLeft: 60, marginRight: 60, marginBottom: 12 }}>
          <Button variant="primary" size="md">Medium</Button>
          {btn && <VGapMark x={btn.x} y={btn.y} height={btn.height} value={12} color={GREEN} extendTo={btn.y - 30} bandInset="start" />}
          {btn && <VGapMark x={btn.x + btn.width} y={btn.y} height={btn.height} value={12} color={GREEN} extendTo={btn.y - 30} bandInset="end" />}
          {btn && <HTickMark x={btn.x} y={btn.y} width={btn.width} value={8} color={GREEN} extendTo={btn.x - 40} bandInset="start" />}
          {btn && <HTickMark x={btn.x} y={btn.y + btn.height} width={btn.width} value={8} color={GREEN} extendTo={btn.x - 40} bandInset="end" />}
        </div>
      </AnatomyFrame>

      {spec && (
        <table style={{ borderCollapse: "collapse", fontSize: "var(--typography-body-sm-size)" }}>
          <tbody>
            <SpecRow label="Size" token="core-size-control-md" value={`Medium · min-height ${spec.minHeight}`} />
            <SpecRow label="Padding" token="core-space-2 / core-space-3" value={`${spec.paddingY} ${spec.paddingX}`} />
            <SpecRow label="Icon gap" token="core-space-2" value={spec.gap} />
            <SpecRow label="Font family" token="typography-font-family-sans" value={spec.fontFamily} />
            <SpecRow label="Font size" token="typography-text14-semibold-size" value={spec.fontSize} />
            <SpecRow label="Font weight" token="typography-text14-semibold-weight" value={spec.fontWeight} />
            <SpecRow label="Line height" token="typography-text14-semibold-line-height" value={spec.lineHeight} />
            <SpecRow label="Text color" token="brand-text-primary-oncolor" value={spec.color} swatch={spec.color} />
            <SpecRow label="Background" token="brand-background-primary-strong" value={spec.background} swatch={spec.background} />
            <SpecRow label="Border" token="brand-border-primary-default" value={`${spec.borderWidth} solid ${spec.borderColor}`} swatch={spec.borderColor} />
            <SpecRow label="Border radius" token="core-radius-sm" value={spec.borderRadius} />
          </tbody>
        </table>
      )}
    </div>
  );
}
