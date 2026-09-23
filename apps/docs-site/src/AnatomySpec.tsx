import React from "react";

/** Uppercase section label for a spec sheet. */
export function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: "var(--typography-label-size)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--core-color-text-secondary)", marginBottom: 16 }}>
      {children}
    </div>
  );
}

/** Header row for a Property / Token / Value / Standards spec table. */
export function SpecTableHead() {
  return (
    <thead>
      <tr style={{ textAlign: "left", color: "var(--core-color-text-tertiary)", fontSize: 12, textTransform: "uppercase", letterSpacing: "0.04em" }}>
        <th style={{ padding: "0 16px 8px 0", fontWeight: 700 }}>Property</th>
        <th style={{ padding: "0 16px 8px 0", fontWeight: 700 }}>Token</th>
        <th style={{ padding: "0 16px 8px 0", fontWeight: 700 }}>Value</th>
        <th style={{ padding: "0 0 8px 0", fontWeight: 700 }}>Standards</th>
      </tr>
    </thead>
  );
}

/** One row of a spec table. `token` is the design-system variable the
 *  property resolves through; `value` is what it computes to; `swatch`
 *  renders a color chip when the value is a color; `standard` marks whether
 *  the value meets the design/industry standard ("pass") or warrants a
 *  caution ("warn", with a short `note`). */
export function SpecRow({ label, token, value, swatch, standard, note }: { label: string; token: string; value: string; swatch?: string; standard: "pass" | "warn"; note?: string }) {
  return (
    <tr>
      <td style={{ padding: "6px 16px 6px 0", fontWeight: 600, color: "var(--core-color-text-primary)", whiteSpace: "nowrap" }}>{label}</td>
      <td style={{ padding: "6px 16px 6px 0", fontFamily: "var(--typography-font-family-mono, monospace)", fontSize: 12, color: "var(--core-color-text-tertiary)", whiteSpace: "nowrap" }}>{token}</td>
      <td style={{ padding: "6px 16px 6px 0", color: "var(--core-color-text-secondary)", whiteSpace: "nowrap" }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
          {swatch && <span style={{ width: 14, height: 14, borderRadius: 3, background: swatch, border: "1px solid var(--core-color-border-subtle)", display: "inline-block" }} />}
          {value}
        </span>
      </td>
      <td style={{ padding: "6px 0", whiteSpace: "nowrap" }}>
        {standard === "pass" ? (
          <span style={{ color: "var(--core-color-status-success-text)", fontWeight: 700 }} title="Meets design/industry standard">✓</span>
        ) : (
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--core-color-status-warning-text)" }}>
            <span style={{ fontWeight: 700 }} title="Caution">⚠</span>
            {note && <span style={{ fontSize: 12, color: "var(--core-color-text-tertiary)", whiteSpace: "normal" }}>{note}</span>}
          </span>
        )}
      </td>
    </tr>
  );
}
