import React from "react";

/** Uppercase section label for a spec sheet. */
export function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="docs-section-heading" style={{ fontSize: "var(--typography-label-size)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--neutral-text-subtle)", marginBottom: 16 }}>
      {children}
    </div>
  );
}

/** Rounded, bordered card wrapper so a spec table reads as one unit
 *  instead of loose rows on the page background. */
export function SpecTableCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="docs-spec-card" style={{ border: "1px solid var(--neutral-border-light)", borderRadius: 12, overflowX: "auto", overflowY: "hidden", background: "var(--neutral-surface-layer-01)" }}>
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
      <tr style={{ textAlign: "left", color: "var(--neutral-text-subtle)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em", background: "var(--neutral-surface-layer-03, rgba(0,0,0,0.03))" }}>
        <th style={{ padding: "var(--core-space-2) var(--core-space-4)", fontWeight: 700, width: "32%" }}>Property</th>
        <th style={{ padding: "var(--core-space-2) var(--core-space-4)", fontWeight: 700, width: "28%" }}>Token</th>
        <th style={{ padding: "var(--core-space-2) var(--core-space-4)", fontWeight: 700, width: "28%" }}>Value</th>
        <th style={{ padding: "var(--core-space-2) var(--core-space-4)", fontWeight: 700, width: "12%" }}>Standards</th>
      </tr>
    </thead>
  );
}

/** One row of a spec table. `token` is the design-system variable the
 *  property resolves through; `value` is what it computes to; `swatch`
 *  renders a color chip when the value is a color; `standard` marks whether
 *  the value meets the design/industry standard ("pass") or warrants a
 *  caution ("warn", with a short `note`). */
/** Computed styles come back as rgb()/rgba(); tokens are authored as hex,
 *  so show the same #RRGGBB (or #RRGGBBAA when translucent) the design
 *  system defines. */
export function toHexColors(value: string): string {
  value = value.replace(/color\(srgb\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*([\d.]+%?))?\s*\)/g, (_m, r, g, b, a) =>
    `rgba(${Math.round(+r * 255)}, ${Math.round(+g * 255)}, ${Math.round(+b * 255)}${a !== undefined ? `, ${a}` : ""})`,
  );
  return value.replace(/rgba?\(\s*(\d+)[,\s]+(\d+)[,\s]+(\d+)(?:[,\s/]+([\d.]+%?))?\s*\)/g, (_m, r, g, b, a) => {
    const hex = (n: number) => Math.round(n).toString(16).padStart(2, "0");
    let out = `#${hex(+r)}${hex(+g)}${hex(+b)}`;
    if (a !== undefined) {
      const alpha = a.endsWith("%") ? parseFloat(a) / 100 : parseFloat(a);
      if (alpha === 0) return "transparent";
      if (alpha < 1) out += hex(alpha * 255);
    }
    return out.toUpperCase();
  });
}

export function SpecRow({
  label,
  token,
  value,
  swatch,
  standard,
  note,
  colorName,
  ratio,
}: {
  label: string;
  token: string;
  value: string;
  swatch?: string;
  standard: "pass" | "warn" | "fail";
  note?: string;
  /** Design-system color name for a color value, e.g. "Neutral 0". */
  colorName?: string;
  /** Measured contrast, e.g. "4.52:1", shown beside the pass mark. */
  ratio?: string;
}) {
  return (
    <tr style={{ borderTop: "1px solid var(--neutral-border-light)" }}>
      <td style={{ padding: "var(--core-space-2) var(--core-space-4)", fontWeight: 600, color: "var(--neutral-text-default)", whiteSpace: "nowrap", verticalAlign: "top" }}>{label}</td>
      <td style={{ padding: "var(--core-space-2) var(--core-space-4)", fontFamily: "var(--typography-font-family-mono, monospace)", fontSize: 12, color: "var(--neutral-text-subtle)", whiteSpace: "nowrap", verticalAlign: "top" }}>{token}</td>
      <td style={{ padding: "var(--core-space-2) var(--core-space-4)", color: "var(--neutral-text-subtle)", whiteSpace: "nowrap", verticalAlign: "top" }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
          {swatch && <span style={{ width: 14, height: 14, borderRadius: 3, background: swatch, border: "1px solid var(--neutral-border-light)", display: "inline-block", flexShrink: 0 }} />}
          {colorName ? (
            <>
              <span style={{ fontWeight: 600, color: "var(--neutral-text-default)" }}>{colorName}</span>
              <span style={{ fontFamily: "var(--typography-font-family-mono, monospace)", fontSize: 12 }}>{toHexColors(value)}</span>
            </>
          ) : (
            toHexColors(value)
          )}
        </span>
      </td>
      <td style={{ padding: "var(--core-space-2) var(--core-space-4)", maxWidth: 260, verticalAlign: "top" }}>
        {standard === "pass" ? (
          <span style={{ display: "inline-flex", alignItems: "center", gap: "var(--core-space-2)" }}>
            <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 20, height: 20, borderRadius: "50%", background: "var(--semantics-success-background-light, rgba(34,197,94,0.12))", color: "var(--semantics-success-text)", fontWeight: 700, fontSize: 12 }} title="Meets design/industry standard">✓</span>
            {ratio && <span style={{ fontSize: 12, color: "var(--neutral-text-subtle)", whiteSpace: "nowrap" }}>{ratio}</span>}
            {note && <span style={{ fontSize: 12, lineHeight: "16px", color: "var(--neutral-text-subtle)", whiteSpace: "normal" }}>{note}</span>}
          </span>
        ) : standard === "fail" ? (
          <span style={{ display: "flex", alignItems: "flex-start", gap: "var(--core-space-2)" }}>
            <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 20, height: 20, borderRadius: "50%", background: "var(--semantics-critical-background-light)", color: "var(--semantics-critical-text)", fontWeight: 700, fontSize: 12, flexShrink: 0 }} title="Fails the standard">✕</span>
            <span style={{ fontSize: 12, lineHeight: "16px", paddingTop: "var(--core-space-0)", color: "var(--semantics-critical-text)", whiteSpace: "normal" }}>
              {ratio}{note ? ` — ${note}` : ""}
            </span>
          </span>
        ) : (
          <span style={{ display: "flex", alignItems: "flex-start", gap: "var(--core-space-1)", color: "var(--semantics-warning-text)" }}>
            <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 20, height: 20, borderRadius: "50%", background: "var(--semantics-warning-background-light, rgba(217,119,6,0.12))", fontWeight: 700, fontSize: 12, flexShrink: 0 }} title="Caution">⚠</span>
            {note && <span style={{ fontSize: 12, lineHeight: 1.5, color: "var(--neutral-text-subtle)", whiteSpace: "normal", paddingTop: "var(--core-space-1)"}}>{note}</span>}
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
      className="docs-spec-note"
      style={{
        display: "flex",
        gap: "var(--core-space-2)",
        alignItems: "flex-start",
        margin: "0 0 16px",
        padding: "var(--core-space-3) var(--core-space-3)",
        borderRadius: 8,
        border: "1px solid var(--neutral-border-light)",
        borderLeft: "3px solid var(--primitive-color-primary-400, #2563EB)",
        background: "var(--neutral-surface-layer-03, rgba(37,99,235,0.05))",
      }}
    >
      <span style={{ fontSize: 13, fontWeight: 700, color: "var(--primitive-color-primary-400, #2563EB)", lineHeight: "18px" }} aria-hidden>
        ⓘ
      </span>
      <p style={{ margin: 0, fontSize: "var(--typography-body-sm-size)", lineHeight: 1.55, color: "var(--neutral-text-subtle)" }}>{children}</p>
    </div>
  );
}
