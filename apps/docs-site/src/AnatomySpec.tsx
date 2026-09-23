import React from "react";

/** Uppercase section label for a spec sheet. */
export function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: "var(--typography-label-size)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--core-color-text-secondary)", marginBottom: 16 }}>
      {children}
    </div>
  );
}

/** Rounded, bordered card wrapper so a spec table reads as one unit
 *  instead of loose rows on the page background. */
export function SpecTableCard({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ border: "1px solid var(--core-color-border-subtle)", borderRadius: 12, overflow: "hidden", background: "var(--core-color-surface-default)" }}>
      <table style={{ borderCollapse: "collapse", fontSize: "var(--typography-body-sm-size)", width: "100%" }}>
        {children}
      </table>
    </div>
  );
}

/** Header row for a Property / Token / Value / Standards spec table. */
export function SpecTableHead() {
  return (
    <thead>
      <tr style={{ textAlign: "left", color: "var(--core-color-text-tertiary)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em", background: "var(--core-color-surface-subtle, rgba(0,0,0,0.03))" }}>
        <th style={{ padding: "10px 16px", fontWeight: 700 }}>Property</th>
        <th style={{ padding: "10px 16px", fontWeight: 700 }}>Token</th>
        <th style={{ padding: "10px 16px", fontWeight: 700 }}>Value</th>
        <th style={{ padding: "10px 16px", fontWeight: 700 }}>Standards</th>
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
    <tr style={{ borderTop: "1px solid var(--core-color-border-subtle)" }}>
      <td style={{ padding: "10px 16px", fontWeight: 600, color: "var(--core-color-text-primary)", whiteSpace: "nowrap", verticalAlign: "top" }}>{label}</td>
      <td style={{ padding: "10px 16px", fontFamily: "var(--typography-font-family-mono, monospace)", fontSize: 12, color: "var(--core-color-text-tertiary)", whiteSpace: "nowrap", verticalAlign: "top" }}>{token}</td>
      <td style={{ padding: "10px 16px", color: "var(--core-color-text-secondary)", whiteSpace: "nowrap", verticalAlign: "top" }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
          {swatch && <span style={{ width: 14, height: 14, borderRadius: 3, background: swatch, border: "1px solid var(--core-color-border-subtle)", display: "inline-block", flexShrink: 0 }} />}
          {value}
        </span>
      </td>
      <td style={{ padding: "10px 16px", maxWidth: 260, verticalAlign: "top" }}>
        {standard === "pass" ? (
          <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 20, height: 20, borderRadius: "50%", background: "var(--core-color-status-success-bg, rgba(34,197,94,0.12))", color: "var(--core-color-status-success-text)", fontWeight: 700, fontSize: 12 }} title="Meets design/industry standard">✓</span>
        ) : (
          <span style={{ display: "flex", alignItems: "flex-start", gap: 6, color: "var(--core-color-status-warning-text)" }}>
            <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 20, height: 20, borderRadius: "50%", background: "var(--core-color-status-warning-bg, rgba(217,119,6,0.12))", fontWeight: 700, fontSize: 12, flexShrink: 0 }} title="Caution">⚠</span>
            {note && <span style={{ fontSize: 12, lineHeight: 1.5, color: "var(--core-color-text-tertiary)", whiteSpace: "normal", paddingTop: 2 }}>{note}</span>}
          </span>
        )}
      </td>
    </tr>
  );
}

/** Callout box for a spec sheet's footnote — replaces a loose paragraph so
 *  the caveat reads as a distinct, scannable note rather than body text. */
export function SpecNote({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: "flex",
        gap: 10,
        alignItems: "flex-start",
        margin: "0 0 16px",
        padding: "12px 14px",
        borderRadius: 8,
        border: "1px solid var(--core-color-border-subtle)",
        borderLeft: "3px solid var(--primitive-color-primary-400, #2563EB)",
        background: "var(--core-color-surface-subtle, rgba(37,99,235,0.05))",
      }}
    >
      <span style={{ fontSize: 13, fontWeight: 700, color: "var(--primitive-color-primary-400, #2563EB)", lineHeight: "18px" }} aria-hidden>
        ⓘ
      </span>
      <p style={{ margin: 0, fontSize: "var(--typography-body-sm-size)", lineHeight: 1.55, color: "var(--core-color-text-secondary)" }}>{children}</p>
    </div>
  );
}
