import React, { useMemo, useState } from "react";
import {
  BRAND_TOKEN_SECTIONS,
  type PrimitiveSwatch,
  type SemanticTokenRow,
  resolveCell,
} from "./brandTokenData";

function TokenIcon() {
  return (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{ flexShrink: 0, opacity: 0.55 }}>
      <path d="M12 2L2 12l10 10 10-10L12 2z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M12 6l-6 6 6 6 6-6-6-6z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}

function CopyBtn({
  label,
  value,
  onCopied,
}: {
  label: string;
  value: string;
  onCopied: (v: string) => void;
}) {
  return (
    <button
      type="button"
      title={`Copy ${label}`}
      onClick={(e) => {
        e.stopPropagation();
        navigator.clipboard.writeText(value);
        onCopied(value);
      }}
      style={{
        border: "1px solid var(--theme-neutral-border-primary-default)",
        background: "var(--theme-colors-neutral-100)",
        borderRadius: "var(--core-radius-sm)",
        padding: "4px 8px",
        fontSize: "var(--typography-font-size-xs)",
        fontWeight: 600,
        color: "var(--theme-neutral-text-subtle)",
        cursor: "pointer",
      }}
      className="brand-token-copy-btn"
    >
      Copy
    </button>
  );
}

function ColorValuePill({
  primitive,
  mode,
  cssVar,
  onCopied,
}: {
  primitive: PrimitiveSwatch;
  mode: "light" | "dark";
  cssVar: string;
  onCopied: (v: string) => void;
}) {
  const isLightSwatch = ["#FFFFFF", "#F5F7FA", "#E2E9F3", "#BACEE9", "#F7F7F9", "#EEEEF2"].includes(primitive.hex);
  return (
    <div
      className="brand-token-pill"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "var(--core-space-2)",
        padding: "8px 12px",
        borderRadius: 10,
        border: "1px solid #E8E8EC",
        background: "#FAFAFB",
        minWidth: 200,
        transition: "border-color 0.12s ease, box-shadow 0.12s ease",
      }}
    >
      <span
        style={{
          width: 20,
          height: 20,
          borderRadius: 5,
          background: primitive.hex,
          border: isLightSwatch ? "1px solid #DFDFE6" : "1px solid transparent",
          flexShrink: 0,
          boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.04)",
        }}
      />
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--core-space-1)", minWidth: 0 }}>
        <span style={{ fontSize: 12, fontWeight: 500, color: "#1D1C24", lineHeight: 1.3, whiteSpace: "nowrap" }}>
          {primitive.path}
        </span>
        <span style={{ fontSize: 11, fontFamily: "var(--site-mono)", color: "#787887", lineHeight: 1.3 }}>
          {primitive.hex}
        </span>
      </div>
      <div style={{ marginLeft: "auto", display: "flex", gap: 4 }}>
        <CopyBtn label="hex" value={primitive.hex} onCopied={onCopied} />
        <CopyBtn label="token" value={cssVar} onCopied={onCopied} />
      </div>
    </div>
  );
}

function TokenRow({
  row,
  previewMode,
  onCopied,
}: {
  row: SemanticTokenRow;
  previewMode: "light" | "dark" | "both";
  onCopied: (v: string) => void;
}) {
  const light = resolveCell(row.light);
  const dark = resolveCell(row.dark);

  return (
    <tr
      className="brand-token-row"
      style={{
        height: 60,
        borderBottom: "1px solid #EEEEF2",
        transition: "background 0.12s ease",
      }}
    >
      <td style={{ padding: "var(--core-space-2) var(--core-space-4)", verticalAlign: "middle", width: "32%" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--core-space-2)"}}>
          <TokenIcon />
          <div>
            <div style={{ fontSize: 14, fontWeight: 500, color: "#1D1C24", lineHeight: 1.35 }}>{row.name}</div>
            <code
              style={{
                fontSize: 11,
                fontFamily: "var(--site-mono)",
                color: "#787887",
                cursor: "pointer",
              }}
              onClick={() => {
                navigator.clipboard.writeText(row.cssVar);
                onCopied(row.cssVar);
              }}
              title="Click to copy CSS variable"
            >
              {row.cssVar}
            </code>
          </div>
        </div>
      </td>
      <td
        style={{
          padding: "var(--core-space-2) var(--core-space-4)",
          verticalAlign: "middle",
          width: "34%",
          opacity: previewMode === "dark" ? 0.45 : 1,
          transition: "opacity 0.2s ease",
        }}
      >
        <ColorValuePill primitive={light} mode="light" cssVar={row.cssVar} onCopied={onCopied} />
      </td>
      <td
        style={{
          padding: "var(--core-space-2) var(--core-space-4)",
          verticalAlign: "middle",
          width: "34%",
          opacity: previewMode === "light" ? 0.45 : 1,
          transition: "opacity 0.2s ease",
        }}
      >
        <ColorValuePill primitive={dark} mode="dark" cssVar={row.cssVar} onCopied={onCopied} />
      </td>
    </tr>
  );
}

export function BrandTokenReference() {
  const [query, setQuery] = useState("");
  const [previewMode, setPreviewMode] = useState<"light" | "dark" | "both">("both");
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopied = (value: string) => {
    setCopied(value);
    window.setTimeout(() => setCopied((c) => (c === value ? null : c)), 2000);
  };

  const filteredSections = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return BRAND_TOKEN_SECTIONS;
    return BRAND_TOKEN_SECTIONS.map((section) => ({
      ...section,
      rows: section.rows.filter(
        (row) =>
          row.name.toLowerCase().includes(q) ||
          row.cssVar.toLowerCase().includes(q) ||
          resolveCell(row.light).label.toLowerCase().includes(q) ||
          resolveCell(row.dark).label.toLowerCase().includes(q)
      ),
    })).filter((s) => s.rows.length > 0);
  }, [query]);

  const highlightMode = previewMode === "both" ? "both" : previewMode;

  return (
    <div className="brand-token-reference" style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      <style>{`
        .brand-token-reference .brand-token-row:hover { background: #F7F7F9; }
        .brand-token-reference .brand-token-pill:hover { border-color: #C4C4CF; box-shadow: 0 1px 4px rgba(0,0,0,0.06); }
        .brand-token-reference .brand-token-copy-btn:hover,
        .brand-token-reference .brand-token-copy-btn:focus-visible {
          color: var(--theme-primitive-color-primary-600);
          border-color: var(--brand-border-primary-default);
          background: var(--brand-background-primary-light);
          outline: none;
        }
        .brand-token-reference thead th { position: sticky; top: 0; z-index: 2; background: #FFFFFF; }
        @media (max-width: 900px) {
          .brand-token-reference table { display: block; overflow-x: auto; }
        }
      `}</style>

      {/* Toolbar */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 16,
          alignItems: "center",
          justifyContent: "space-between",
          padding: "var(--core-space-3) var(--core-space-4)",
          background: "#FFFFFF",
          border: "1px solid #EEEEF2",
          borderRadius: 12,
        }}
      >
        <input
          type="search"
          placeholder="Search tokens, variables, or primitives…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{
            flex: "1 1 220px",
            minWidth: 200,
            padding: "var(--core-space-2) var(--core-space-3)",
            borderRadius: 8,
            border: "1px solid #DFDFE6",
            fontSize: 14,
            outline: "none",
          }}
        />
        <div style={{ display: "flex", gap: "var(--core-space-1)", alignItems: "center" }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: "#787887", marginRight: 4 }}>Highlight:</span>
          {(["both", "light", "dark"] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setPreviewMode(mode)}
              style={{
                padding: "var(--core-space-1) var(--core-space-3)",
                borderRadius: 8,
                border: previewMode === mode ? "1px solid #1F4F8D" : "1px solid #DFDFE6",
                background: previewMode === mode ? "#E2E9F3" : "#FFFFFF",
                color: previewMode === mode ? "#1F4F8D" : "#5C5C6B",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                textTransform: "capitalize",
              }}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Sections */}
      {filteredSections.map((section) => (
        <section key={section.id} style={{ background: "#FFFFFF", border: "1px solid #EEEEF2", borderRadius: 12, overflow: "hidden" }}>
          <div style={{ padding: "16px 20px 12px", borderBottom: "1px solid #EEEEF2" }}>
            <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#1D1C24", letterSpacing: "-0.01em" }}>
              {section.title}
            </h3>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 720 }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #EEEEF2", height: 44 }}>
                  <th
                    style={{
                      textAlign: "left",
                      padding: "var(--core-space-2) var(--core-space-4)",
                      fontSize: 12,
                      fontWeight: 600,
                      color: "#787887",
                      width: "32%",
                    }}
                  >
                    Token
                  </th>
                  <th
                    style={{
                      textAlign: "left",
                      padding: "var(--core-space-2) var(--core-space-4)",
                      fontSize: 12,
                      fontWeight: 600,
                      color: "#787887",
                      width: "34%",
                    }}
                  >
                    Light
                  </th>
                  <th
                    style={{
                      textAlign: "left",
                      padding: "var(--core-space-2) var(--core-space-4)",
                      fontSize: 12,
                      fontWeight: 600,
                      color: "#787887",
                      width: "34%",
                    }}
                  >
                    Dark
                  </th>
                </tr>
              </thead>
              <tbody>
                {section.rows.map((row) => (
                  <TokenRow key={row.cssVar} row={row} previewMode={highlightMode} onCopied={handleCopied} />
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ))}

      {filteredSections.length === 0 && (
        <div style={{ padding: 40, textAlign: "center", color: "#787887", fontSize: 14 }}>No tokens match your search.</div>
      )}

      {copied && (
        <div
          style={{
            position: "fixed",
            bottom: 24,
            right: 24,
            background: "#1D1C24",
            color: "#FFFFFF",
            padding: "var(--core-space-3) var(--core-space-4)",
            borderRadius: 10,
            fontSize: 12,
            fontWeight: 600,
            boxShadow: "0 8px 24px rgba(0,0,0,0.18)",
            zIndex: 9999,
            fontFamily: "var(--site-mono)",
          }}
        >
          ✓ Copied {copied}
        </div>
      )}
    </div>
  );
}
