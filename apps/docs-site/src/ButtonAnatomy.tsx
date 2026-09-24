import React, { useLayoutEffect, useRef, useState } from "react";
import { Button } from "../../../packages/core/src/components/Button";
import { AnatomyFrame, VGapMark, HTickMark } from "./AnatomyPrimitives";
import { SectionHeading, SpecTableCard, SpecTableHead, SpecRow, SpecNote } from "./AnatomySpec";

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
 *   font         typography-text14-semibold (14px / 700 / 20px)
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
    <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
      <div>
        <SectionHeading>Structure — shared by all variants &amp; states</SectionHeading>
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
            <SpecTableCard>
              <SpecTableHead />
              <tbody>
                <SpecRow label="Size" token="core-size-control-md" value={`Medium · min-height ${spec.minHeight}`} standard="warn" note="40px < 44px touch-target guideline (fine for desktop)" />
                <SpecRow label="Padding" token="core-space-2 / core-space-3" value={`${spec.paddingY} ${spec.paddingX}`} standard="pass" />
                <SpecRow label="Icon gap" token="core-space-1" value={spec.gap} standard="pass" />
                <SpecRow label="Font family" token="typography-font-family-sans" value={spec.fontFamily} standard="pass" />
                <SpecRow label="Font size" token="typography-text14-semibold-size" value={spec.fontSize} standard="pass" />
                <SpecRow label="Font weight" token="typography-text14-semibold-weight" value={spec.fontWeight} standard="warn" note="700 is Bold; “semibold” usually means 600" />
                <SpecRow label="Line height" token="typography-text14-semibold-line-height" value={spec.lineHeight} standard="pass" />
                <SpecRow label="Text color" token="brand-text-primary-oncolor" value={spec.color} swatch={spec.color} standard="pass" />
                <SpecRow label="Background" token="brand-background-primary-strong" value={spec.background} swatch={spec.background} standard="pass" />
                <SpecRow label="Border" token="brand-border-primary-default" value={`${spec.borderWidth} solid ${spec.borderColor}`} swatch={spec.borderColor} standard="pass" />
                <SpecRow label="Border radius" token="core-radius-sm" value={spec.borderRadius} standard="pass" />
              </tbody>
            </SpecTableCard>
          )}
        </div>
      </div>

      <div>
        <SectionHeading>Color tokens — what changes per variant &amp; state</SectionHeading>
        <SpecNote>
          Only background / text / border change per cell — every structural spec above stays identical. Focused adds a{" "}
          <code>core-focusRing-width</code> (2px) ring via <code>primitive-color-primary-400</code> on all variants (Tertiary uses a{" "}
          <code>border-primary-default</code> outline instead).
        </SpecNote>
        <StateMatrix />
      </div>
    </div>
  );
}

interface CellSpec {
  bg: string;
  text: string;
  border: string;
}

const STATE_MATRIX: { state: string; primary: CellSpec; secondary: CellSpec; tertiary: CellSpec }[] = [
  {
    state: "Default",
    primary: { bg: "background-primary-strong", text: "text-primary-oncolor", border: "border-primary-default" },
    secondary: { bg: "transparent", text: "text-primary-on-surface", border: "border-primary-default" },
    tertiary: { bg: "transparent", text: "text-primary-on-surface", border: "transparent" },
  },
  {
    state: "Hover",
    primary: { bg: "background-primary-hover", text: "(unchanged)", border: "border-primary-hover" },
    secondary: { bg: "primary-strong · 12% wash", text: "text-primary-hover", border: "border-primary-hover" },
    tertiary: { bg: "primary-strong · 8% wash", text: "text-primary-hover", border: "transparent · underline" },
  },
  {
    state: "Active",
    primary: { bg: "background-primary-active", text: "(unchanged)", border: "background-primary-active" },
    secondary: { bg: "primary-strong · 24% wash", text: "text-primary-active", border: "border-primary-hover" },
    tertiary: { bg: "primary-strong · 16% wash", text: "text-primary-active", border: "transparent · underline" },
  },
  {
    state: "Focused",
    primary: { bg: "(unchanged) + 2px ring", text: "(unchanged)", border: "primitive-color-primary-400" },
    secondary: { bg: "(unchanged) + 2px ring", text: "(unchanged)", border: "primitive-color-primary-400" },
    tertiary: { bg: "transparent", text: "text-primary-on-surface", border: "border-primary-default" },
  },
  {
    state: "Disabled",
    primary: { bg: "background-primary-disabled", text: "text-primary-disabled", border: "border-primary-disabled" },
    secondary: { bg: "transparent", text: "semantics-disabled-text", border: "semantics-disabled-border" },
    tertiary: { bg: "transparent", text: "semantics-disabled-text", border: "transparent" },
  },
];

function MatrixCell({ spec }: { spec: CellSpec }) {
  const line = (label: string, val: string) => (
    <div style={{ display: "flex", gap: "var(--core-space-1)", fontSize: 12, lineHeight: 1.5 }}>
      <span style={{ color: "var(--core-color-text-tertiary)", minWidth: 30 }}>{label}</span>
      <span style={{ fontFamily: "var(--typography-font-family-mono, monospace)", color: "var(--core-color-text-secondary)" }}>{val}</span>
    </div>
  );
  return (
    <td style={{ padding: "var(--core-space-2) var(--core-space-4)", borderTop: "1px solid var(--core-color-border-subtle)", verticalAlign: "top" }}>
      {line("bg", spec.bg)}
      {line("text", spec.text)}
      {line("border", spec.border)}
    </td>
  );
}

/** Compact matrix of the color-token deltas across the 3 variants × 5
 *  states — the only things that change from the shared structure above. */
function StateMatrix() {
  return (
    <SpecTableCard>
      <thead>
        <tr style={{ textAlign: "left", color: "var(--core-color-text-tertiary)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em", background: "var(--core-color-surface-subtle, rgba(0,0,0,0.03))" }}>
          <th style={{ padding: "var(--core-space-2) var(--core-space-4)", fontWeight: 700 }}>State</th>
          <th style={{ padding: "var(--core-space-2) var(--core-space-4)", fontWeight: 700 }}>Primary</th>
          <th style={{ padding: "var(--core-space-2) var(--core-space-4)", fontWeight: 700 }}>Secondary</th>
          <th style={{ padding: "var(--core-space-2) var(--core-space-4)", fontWeight: 700 }}>Tertiary</th>
        </tr>
      </thead>
      <tbody>
        {STATE_MATRIX.map((row) => (
          <tr key={row.state} style={{ borderTop: "1px solid var(--core-color-border-subtle)" }}>
            <td style={{ padding: "var(--core-space-2) var(--core-space-4)", fontWeight: 600, color: "var(--core-color-text-primary)", verticalAlign: "top", whiteSpace: "nowrap" }}>{row.state}</td>
            <MatrixCell spec={row.primary} />
            <MatrixCell spec={row.secondary} />
            <MatrixCell spec={row.tertiary} />
          </tr>
        ))}
      </tbody>
    </SpecTableCard>
  );
}
