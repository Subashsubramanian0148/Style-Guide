import React, { useLayoutEffect, useRef, useState } from "react";
import { Checkbox, Radio } from "../../../packages/core/src/components/FormControls";
import { AnatomyFrame, GapCallout, HTickMark, SizeTag } from "./AnatomyPrimitives";
import { SectionHeading, SpecTableCard, SpecTableHead, SpecRow, SpecNote } from "./AnatomySpec";

interface Spec {
  boxSize: string;
  borderWidth: string;
  borderColor: string;
  checkboxRadius: string;
  radioRadius: string;
  fill: string;
  fontFamily: string;
  fontSize: string;
  fontWeight: string;
  lineHeight: string;
  labelColor: string;
  gap: string;
  padding: string;
  radioSize: string;
}

interface Row {
  x: number;
  y: number;
  width: number;
  height: number;
  pad: number;
  box: { x: number; y: number; w: number; h: number };
}

/**
 * Detailed anatomy for the Checkbox and Radio controls. They share every
 * spec except the box's border-radius (Checkbox core-radius-xs / Radio 50%)
 * and the checked indicator (Checkbox check glyph / Radio 7px dot), so the
 * structure is documented once with those two differences called out.
 * Values are read from the live components' computed style; the 8px
 * control-to-label gap is also marked visually on each.
 */
export function CheckboxRadioAnatomy() {
  const boxRef = useRef<HTMLDivElement>(null);
  const [checkboxGap, setCheckboxGap] = useState<{ x: number; width: number } | null>(null);
  const [radioGap, setRadioGap] = useState<{ x: number; width: number } | null>(null);
  const [spec, setSpec] = useState<Spec | null>(null);
  const [rows, setRows] = useState<Row[]>([]);

  useLayoutEffect(() => {
    const box = boxRef.current;
    const checkboxLabel = box?.querySelector(".cds-checkbox") as HTMLElement | null;
    const checkboxControl = box?.querySelector(".cds-checkbox-box") as HTMLElement | null;
    const radioControl = box?.querySelector(".cds-radio-box") as HTMLElement | null;
    if (!box || !checkboxLabel || !checkboxControl || !radioControl) return;

    const boxRect = box.getBoundingClientRect();
    const checkboxControlRect = checkboxControl.getBoundingClientRect();
    const radioControlRect = radioControl.getBoundingClientRect();

    const measureGap = (control: HTMLElement, controlRect: DOMRect, set: (v: { x: number; width: number }) => void) => {
      const labelNode = control.nextSibling;
      if (!labelNode) return;
      const range = document.createRange();
      range.selectNodeContents(labelNode);
      const labelRect = range.getBoundingClientRect();
      set({
        x: Math.round(controlRect.right - boxRect.left),
        width: Math.round(labelRect.left - controlRect.right),
      });
    };
    measureGap(checkboxControl, checkboxControlRect, setCheckboxGap);
    measureGap(radioControl, radioControlRect, setRadioGap);

    setRows(
      [...box.querySelectorAll<HTMLElement>(".cds-checkbox, .cds-radio")].map((el) => {
        const r = el.getBoundingClientRect();
        const parent = (el.parentElement as HTMLElement).getBoundingClientRect();
        const b = (el.querySelector(".cds-checkbox-box, .cds-radio-box") as HTMLElement).getBoundingClientRect();
        return {
          x: Math.round(r.left - parent.left),
          y: Math.round(r.top - parent.top),
          width: Math.round(r.width),
          height: Math.round(r.height),
          pad: Math.round(parseFloat(getComputedStyle(el).paddingTop)),
          box: { x: b.left - parent.left, y: b.top - parent.top, w: b.width, h: b.height },
        };
      }),
    );

    const cs = getComputedStyle(checkboxControl);
    const rs = getComputedStyle(radioControl);
    const ls = getComputedStyle(checkboxLabel);
    setSpec({
      boxSize: `${cs.width.replace("px", "")} × ${cs.height.replace("px", "")}px`,
      borderWidth: cs.borderTopWidth,
      borderColor: cs.borderTopColor,
      checkboxRadius: cs.borderTopLeftRadius,
      radioRadius: rs.borderTopLeftRadius,
      fill: cs.backgroundColor,
      fontFamily: ls.fontFamily.split(",")[0].replace(/["']/g, ""),
      fontSize: ls.fontSize,
      fontWeight: ls.fontWeight,
      lineHeight: ls.lineHeight,
      labelColor: ls.color,
      gap: ls.columnGap === "normal" ? ls.gap : ls.columnGap,
      padding: `${ls.paddingTop} ${ls.paddingLeft}`,
      radioSize: `${rs.width.replace("px", "")} × ${rs.height.replace("px", "")}px`,
    });
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
      <div>
        <SectionHeading>Structure — shared by Checkbox &amp; Radio</SectionHeading>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 48, alignItems: "flex-start" }}>
          <AnatomyFrame>
            <div ref={boxRef} style={{ position: "relative", display: "flex", flexDirection: "column", gap: 96, marginTop: 46, marginLeft: 48, marginBottom: 40 }}>
              <div style={{ position: "relative", display: "inline-flex" }}>
                <Checkbox label="Option" readOnly />
                {checkboxGap && <GapCallout x={checkboxGap.x} width={checkboxGap.width} value={checkboxGap.width} />}
                {rows[0] && <HTickMark x={rows[0].x} y={rows[0].y} width={rows[0].width} value={rows[0].pad} extendTo={rows[0].x - 32} bandInset="start" />}
                {rows[0] && <SizeTag r={rows[0].box} label={`${Math.round(rows[0].box.w)} × ${Math.round(rows[0].box.h)}`} offset={26} />}
                {rows[0] && <HTickMark x={rows[0].x} y={rows[0].y + rows[0].height} width={rows[0].width} value={rows[0].pad} extendTo={rows[0].x - 32} bandInset="end" />}
              </div>
              <div style={{ position: "relative", display: "inline-flex" }}>
                <Radio label="Option" readOnly />
                {radioGap && <GapCallout x={radioGap.x} width={radioGap.width} value={radioGap.width} />}
                {rows[1] && <HTickMark x={rows[1].x} y={rows[1].y} width={rows[1].width} value={rows[1].pad} extendTo={rows[1].x - 32} bandInset="start" />}
                {rows[1] && <SizeTag r={rows[1].box} label={`${Math.round(rows[1].box.w)} × ${Math.round(rows[1].box.h)}`} offset={26} />}
                {rows[1] && <HTickMark x={rows[1].x} y={rows[1].y + rows[1].height} width={rows[1].width} value={rows[1].pad} extendTo={rows[1].x - 32} bandInset="end" />}
              </div>
            </div>
          </AnatomyFrame>

          {spec && (
            <SpecTableCard>
              <SpecTableHead />
              <tbody>
                <SpecRow label="Checkbox box (W × H)" token="core-size-icon-md" value={spec.boxSize} standard="pass" />
                <SpecRow label="Radio circle (W × H)" token="core-size-icon-md" value={spec.radioSize} standard="pass" />
                <SpecRow label="Border" token="theme-neutral-border-primary-default" value={`${spec.borderWidth} solid ${spec.borderColor}`} swatch={spec.borderColor} standard="pass" />
                <SpecRow label="Radius — Checkbox" token="core-radius-xs" value={spec.checkboxRadius} standard="pass" />
                <SpecRow label="Radius — Radio" token="(circle)" value={spec.radioRadius} standard="pass" />
                <SpecRow label="Fill (unchecked)" token="core-color-surface-default" value={spec.fill} swatch={spec.fill} standard="pass" />
                <SpecRow label="Fill (checked)" token="brand-background-primary-strong" value="rgb(31, 79, 141)" swatch="rgb(31, 79, 141)" standard="pass" />
                <SpecRow label="Indicator" token="Checkbox: check glyph · Radio: 7px dot" value="neutral-0 (white)" standard="pass" />
                <SpecRow label="Label gap" token="core-space-2" value={spec.gap} standard="pass" />
                <SpecRow label="Row padding" token="core-space-1 / core-space-0" value={spec.padding} standard="pass" note="Keeps the clickable row at least 24px tall (WCAG 2.5.8)" />
                <SpecRow label="Label font" token="typography-body-md" value={`${spec.fontSize} / ${spec.fontWeight} / ${spec.lineHeight}`} standard="pass" />
                <SpecRow label="Label family" token="typography-font-family-sans" value={spec.fontFamily} standard="pass" />
                <SpecRow label="Label color" token="theme-neutral-text-primary-default" value={spec.labelColor} swatch={spec.labelColor} standard="pass" />
              </tbody>
            </SpecTableCard>
          )}
        </div>
      </div>

      <div>
        <SectionHeading>Color tokens — what changes per state</SectionHeading>
        <SpecNote>
          Checkbox and Radio share these state changes. Focused adds a{" "}
          <code>core-focusRing-width</code> (2px) ring via <code>primitive-color-primary-400</code>.
        </SpecNote>
        <StateMatrix />
      </div>
    </div>
  );
}

interface CellSpec {
  fill: string;
  border: string;
}

const STATE_MATRIX: { state: string; unchecked: CellSpec; checked: CellSpec }[] = [
  {
    state: "Default",
    unchecked: { fill: "core-color-surface-default", border: "neutral-border-primary-default" },
    checked: { fill: "background-primary-strong", border: "background-primary-strong" },
  },
  {
    state: "Hover",
    unchecked: { fill: "background-primary-subtle", border: "primitive-color-primary-400" },
    checked: { fill: "background-primary-hover", border: "background-primary-hover" },
  },
  {
    state: "Active",
    unchecked: { fill: "background-primary-subtle", border: "background-primary-strong" },
    checked: { fill: "background-primary-strong", border: "background-primary-strong" },
  },
  {
    state: "Focused",
    unchecked: { fill: "surface-default + 2px ring", border: "primitive-color-primary-400" },
    checked: { fill: "background-primary-strong + 2px ring", border: "primitive-color-primary-400" },
  },
  {
    state: "Disabled",
    unchecked: { fill: "semantics-disabled-background", border: "neutral-border-primary-default" },
    checked: { fill: "neutral-500", border: "neutral-500" },
  },
];

function MatrixCell({ spec }: { spec: CellSpec }) {
  const line = (label: string, val: string) => (
    <div style={{ display: "flex", gap: "var(--core-space-1)", fontSize: 12, lineHeight: 1.5 }}>
      <span style={{ color: "var(--core-color-text-tertiary)", minWidth: 40 }}>{label}</span>
      <span style={{ fontFamily: "var(--typography-font-family-mono, monospace)", color: "var(--core-color-text-secondary)" }}>{val}</span>
    </div>
  );
  return (
    <td style={{ padding: "var(--core-space-2) var(--core-space-4)", borderTop: "1px solid var(--core-color-border-subtle)", verticalAlign: "top" }}>
      {line("fill", spec.fill)}
      {line("border", spec.border)}
    </td>
  );
}

/** Compact matrix of the fill/border token deltas across the 5 states, for
 *  both the unchecked and checked box. */
function StateMatrix() {
  return (
    <SpecTableCard>
      <thead>
        <tr style={{ textAlign: "left", color: "var(--core-color-text-tertiary)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em", background: "var(--core-color-surface-subtle, rgba(0,0,0,0.03))" }}>
          <th style={{ padding: "var(--core-space-2) var(--core-space-4)", fontWeight: 700 }}>State</th>
          <th style={{ padding: "var(--core-space-2) var(--core-space-4)", fontWeight: 700 }}>Unchecked</th>
          <th style={{ padding: "var(--core-space-2) var(--core-space-4)", fontWeight: 700 }}>Checked</th>
        </tr>
      </thead>
      <tbody>
        {STATE_MATRIX.map((row) => (
          <tr key={row.state} style={{ borderTop: "1px solid var(--core-color-border-subtle)" }}>
            <td style={{ padding: "var(--core-space-2) var(--core-space-4)", fontWeight: 600, color: "var(--core-color-text-primary)", verticalAlign: "top", whiteSpace: "nowrap" }}>{row.state}</td>
            <MatrixCell spec={row.unchecked} />
            <MatrixCell spec={row.checked} />
          </tr>
        ))}
      </tbody>
    </SpecTableCard>
  );
}
