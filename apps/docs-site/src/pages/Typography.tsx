import React from "react";
import typography from "../../../../packages/tokens/src/typography.json";
import primitives from "../../../../packages/tokens/src/primitives.json";
import { buildTypographyExportJson } from "./buildTypographyExport";
import { fontSizeLabelFromPx, remLabel } from "./typographyScale";

const order = [
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "text32Regular",
  "text32Medium",
  "text32SemiBold",
  "text32Bold",
  "text28Regular",
  "text28Medium",
  "text28SemiBold",
  "text28Bold",
  "text24Regular",
  "text24Medium",
  "text24SemiBold",
  "text24Bold",
  "text20Regular",
  "text20Medium",
  "text20SemiBold",
  "text20Bold",
  "text16Regular",
  "text16Medium",
  "text16SemiBold",
  "text16Bold",
  "text14Regular",
  "text14Medium",
  "text14SemiBold",
  "text14Bold",
  "text12Regular",
  "text12Medium",
  "text12SemiBold",
  "text12Bold",
  "eyebrow",
  "numericData"
];

const roleName: Record<string, string> = {
  "h1": "H1",
  "h2": "H2",
  "h3": "H3",
  "h4": "H4",
  "h5": "H5",
  "h6": "H6",
  "text32Regular": "Text 32px Regular",
  "text32Medium": "Text 32px Medium",
  "text32SemiBold": "Text 32px SemiBold",
  "text32Bold": "Text 32px Bold",
  "text28Regular": "Text 28px Regular",
  "text28Medium": "Text 28px Medium",
  "text28SemiBold": "Text 28px SemiBold",
  "text28Bold": "Text 28px Bold",
  "text24Regular": "Text 24px Regular",
  "text24Medium": "Text 24px Medium",
  "text24SemiBold": "Text 24px SemiBold",
  "text24Bold": "Text 24px Bold",
  "text20Regular": "Text 20px Regular",
  "text20Medium": "Text 20px Medium",
  "text20SemiBold": "Text 20px SemiBold",
  "text20Bold": "Text 20px Bold",
  "text16Regular": "Text 16px Regular",
  "text16Medium": "Text 16px Medium",
  "text16SemiBold": "Text 16px SemiBold",
  "text16Bold": "Text 16px Bold",
  "text14Regular": "Text 14px Regular",
  "text14Medium": "Text 14px Medium",
  "text14SemiBold": "Text 14px SemiBold",
  "text14Bold": "Text 14px Bold",
  "text12Regular": "Text 12px Regular",
  "text12Medium": "Text 12px Medium",
  "text12SemiBold": "Text 12px SemiBold",
  "text12Bold": "Text 12px Bold",
  "eyebrow": "Eyebrow",
  "numericData": "Numeric Data"
};

function TypeScaleRow({ roleKey, roleNameStr, typoObj, isLast }: { roleKey: string, roleNameStr: string, typoObj: any, isLast?: boolean }) {
  const d = typoObj.desktop;
  const scaleLabel = fontSizeLabelFromPx(d.size);

  return (
    <div style={{ padding: "32px 40px", marginBottom: "16px", background: "var(--theme-brand-background-primary-light)", borderRadius: "8px", display: "flex", flexWrap: "wrap", gap: 64 }}>
      {/* Left Column: Details Grid */}
      <div style={{ flex: "0 0 auto", minWidth: 260 }}>
        <div style={{ fontSize: 12, fontWeight: 500, color: "var(--core-color-text-primary)", marginBottom: 24, letterSpacing: "0.02em" }}>
          {roleNameStr}
          {scaleLabel && (
            <span style={{ marginLeft: 8, fontWeight: 700, color: "var(--core-color-brand-600)", letterSpacing: "0.04em" }}>
              · {scaleLabel}
            </span>
          )}
        </div>
        
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", rowGap: "16px", columnGap: "32px" }}>
          <div>
            <div style={{ fontSize: "var(--typography-font-size-xs)", color: "var(--core-color-text-secondary)", marginBottom: 4 }}>Size</div>
            <div style={{ fontSize: "var(--typography-body-md-size)", fontWeight: 500, color: "var(--core-color-text-primary)" }}>{remLabel(d.size)}</div>
          </div>
          <div>
            <div style={{ fontSize: "var(--typography-font-size-xs)", color: "var(--core-color-text-secondary)", marginBottom: 4 }}>Letter Spacing</div>
            <div style={{ fontSize: "var(--typography-body-md-size)", fontWeight: 500, color: "var(--core-color-text-primary)" }}>0px</div>
          </div>
          
          <div>
            <div style={{ fontSize: "var(--typography-font-size-xs)", color: "var(--core-color-text-secondary)", marginBottom: 4 }}>Weight</div>
            <div style={{ fontSize: "var(--typography-body-md-size)", fontWeight: 500, color: "var(--core-color-text-primary)" }}>
              {d.weight === "400" ? "Regular" : d.weight === "500" ? "Medium" : d.weight === "600" ? "Semi-Bold" : d.weight === "700" ? "Bold" : d.weight}
            </div>
          </div>
          <div>
            <div style={{ fontSize: "var(--typography-font-size-xs)", color: "var(--core-color-text-secondary)", marginBottom: 4 }}>Paragraph Spacing</div>
            <div style={{ fontSize: "var(--typography-body-md-size)", fontWeight: 500, color: "var(--core-color-text-primary)" }}>0px</div>
          </div>

          <div>
            <div style={{ fontSize: "var(--typography-font-size-xs)", color: "var(--core-color-text-secondary)", marginBottom: 4 }}>Line Height</div>
            <div style={{ fontSize: "var(--typography-body-md-size)", fontWeight: 500, color: "var(--core-color-text-primary)" }}>{d.lineHeight}</div>
          </div>
          <div>
            <div style={{ fontSize: "var(--typography-font-size-xs)", color: "var(--core-color-text-secondary)", marginBottom: 4 }}>Case</div>
            <div style={{ fontSize: "var(--typography-body-md-size)", fontWeight: 500, color: "var(--core-color-text-primary)" }}>Original</div>
          </div>
        </div>
      </div>

      {/* Right Column: Preview */}
      <div style={{ flex: "1 1 400px", display: "flex", alignItems: "center" }}>
        <div style={{
          fontSize: d.size,
          fontWeight: d.weight,
          lineHeight: d.lineHeight,
          letterSpacing: "0px",
          fontFamily: "var(--typography-font-family-sans)",
          color: "var(--core-color-text-primary)",
          width: "100%",
          wordWrap: "break-word"
        }}>
          {roleNameStr} - {roleKey === "numericData" ? "1,234,567.89" : "The quick brown fox jumps over the lazy dog."}
        </div>
      </div>
    </div>
  );
}

const elevationDescriptions: Record<string, string> = {
  "1": "Subtle raise — resting cards, table rows, segmented controls",
  "2": "Medium raise — dropdowns, popovers, modals, sticky headers",
};

const elevationKeys = ["1", "2"] as const;

function ElevationCard({ elevationKey, shadowVal }: { elevationKey: string; shadowVal: string }) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(shadowVal);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div
      style={{
        background: "var(--core-color-surface-default)",
        border: elevationKey === "0" ? "1px solid var(--site-border)" : "1px solid var(--site-border)",
        boxShadow: shadowVal,
        borderRadius: 12,
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        gap: 14,
        minHeight: 220,
        justifyContent: "space-between",
      }}
    >
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <span style={{ fontSize: 16, fontWeight: 700, color: "var(--core-color-text-primary)" }}>Elevation {elevationKey}</span>
          <code style={{ fontSize: "var(--typography-font-size-xs)", background: "var(--core-color-surface-hover)", padding: "2px 8px", borderRadius: 4, color: "var(--core-color-text-secondary)" }}>
            --core-elevation-{elevationKey}
          </code>
        </div>
        <p style={{ margin: 0, fontSize: "var(--typography-body-md-size)", color: "var(--core-color-text-secondary)", lineHeight: 1.5 }}>
          {elevationDescriptions[elevationKey] || "Surface elevation"}
        </p>
      </div>

      <div style={{ borderTop: "1px solid var(--site-border)", paddingTop: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
          <span style={{ fontSize: "var(--typography-font-size-xs)", fontWeight: 700, letterSpacing: "0.06em", color: "var(--core-color-text-tertiary)", textTransform: "uppercase" }}>
            Exact Box-Shadow Value
          </span>
          <button
            onClick={handleCopy}
            title="Copy exact value for CSS"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
              border: "1px solid var(--site-border)",
              background: copied ? "rgba(34, 163, 105, 0.15)" : "var(--core-color-surface-hover)",
              color: copied ? "var(--theme-semantics-success-text)" : "var(--theme-primitive-color-primary-600)",
              fontSize: "var(--typography-font-size-xs)",
              fontWeight: 600,
              padding: "3px 8px",
              borderRadius: 5,
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            {copied ? (
              <>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Copied!
              </>
            ) : (
              <>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
                Copy
              </>
            )}
          </button>
        </div>
        <code
          style={{
            fontSize: "var(--typography-font-size-xs)",
            fontFamily: "var(--site-mono)",
            color: "var(--theme-primitive-color-primary-600)",
            background: "var(--core-color-surface-hover)",
            padding: "8px 10px",
            borderRadius: "var(--core-radius-sm)",
            display: "block",
            wordBreak: "break-word",
            lineHeight: 1.4,
            cursor: "pointer",
            border: "1px solid var(--site-border)",
          }}
          onClick={handleCopy}
          title="Click to copy exact value"
        >
          {shadowVal}
        </code>
      </div>
    </div>
  );
}

export default function Typography() {
  const iconSizes = [
    { key: "icon.sm", val: (primitives.size as any)["icon.sm"] || "16px", label: "Small" },
    { key: "icon.md", val: (primitives.size as any)["icon.md"] || "20px", label: "Medium" },
    { key: "icon.lg", val: (primitives.size as any)["icon.lg"] || "24px", label: "Large" },
  ];

  const sections = [
    {
      id: "01",
      anchorId: "typeface",
      title: "Typeface",
      content: (
        <div style={{ background: "var(--core-color-surface-default)", borderRadius: 14, padding: "48px 40px", border: "1px solid var(--site-border)", color: "var(--core-color-text-primary)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 40, flexWrap: "wrap", gap: 32 }}>
            <div style={{ flex: "1 1 300px" }}>
              <div style={{ fontSize: 64, fontWeight: 700, lineHeight: 1.1, letterSpacing: "0", fontFamily: "var(--typography-font-family-sans)" }}>
                INCLUSIVE<br />SANS
              </div>
            </div>
            <div style={{ flex: "1 1 250px", maxWidth: 300 }}>
              <div style={{ fontSize: "var(--typography-font-size-xs)", fontWeight: 700, letterSpacing: "0.06em", marginBottom: 12, color: "var(--core-color-text-secondary)" }}>ABOUT</div>
              <div style={{ fontSize: "var(--typography-body-md-size)", lineHeight: 1.6, color: "var(--core-color-text-primary)" }}>
                A contemporary sans-serif typeface designed for high legibility, featuring clear letterform distinction (I/l/1 and O/0) ensuring clarity across dense data tables and interfaces.
              </div>
            </div>
          </div>

          <div style={{ borderTop: "1px solid var(--site-border)", paddingTop: 40, display: "flex", flexWrap: "wrap", gap: 32 }}>
            <div style={{ flex: "1 1 300px", fontSize: 200, fontWeight: 400, lineHeight: 0.8, letterSpacing: "0", fontFamily: "var(--typography-font-family-sans)" }}>
              Aa
            </div>
            <div style={{ flex: "1 1 200px" }}>
              <div style={{ fontSize: "var(--typography-font-size-xs)", fontWeight: 700, letterSpacing: "0.06em", marginBottom: 24, color: "var(--core-color-text-secondary)" }}>WEIGHTS</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12, fontSize: 18, fontFamily: "var(--typography-font-family-sans)", color: "var(--core-color-text-primary)" }}>
                <div style={{ fontWeight: 300 }}>Light (300)</div>
                <div style={{ fontWeight: 400 }}>Regular (400)</div>
                <div style={{ fontWeight: 500 }}>Medium (500)</div>
                <div style={{ fontWeight: 600 }}>Semibold (600)</div>
                <div style={{ fontWeight: 700 }}>Bold (700)</div>
              </div>
            </div>
            <div style={{ flex: "1 1 250px" }}>
              <div style={{ fontSize: "var(--typography-font-size-xs)", fontWeight: 700, letterSpacing: "0.06em", marginBottom: 24, color: "var(--core-color-text-secondary)" }}>OVERVIEW</div>
              <div style={{ fontSize: 18, fontFamily: "var(--typography-font-family-sans)", lineHeight: 1.6, wordBreak: "break-all", color: "var(--core-color-text-primary)" }}>
                Aa Bb Cc Dd Ee Ff Gg Hh Ii Jj Kk Ll Mm Nn Oo Pp Qq Rr Ss Tt Uu Vv Ww Xx Yy Zz
                <br /><br />
                0123456789
                <br />
                !@#$%^&*()_+{"{}"}?
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "02",
      anchorId: "type-scale",
      title: "Type scale",
      content: (
        <div data-theme="core" data-mode="light" style={{ background: "var(--core-color-surface-default)", borderRadius: 14, padding: "8px 40px", border: "1px solid var(--site-border)" }}>
          {order.map((key, index) => (
            <TypeScaleRow
              key={key}
              roleKey={key}
              roleNameStr={roleName[key]}
              typoObj={(typography as any)[key]}
              isLast={index === order.length - 1}
            />
          ))}
        </div>
      )
    },
    {
      id: "03",
      anchorId: "spacing-padding",
      title: "Spacing & Padding",
      content: (
        <div style={{ display: "flex", flexDirection: "column", background: "var(--core-color-surface-default)", borderRadius: 14, padding: "24px 32px", border: "1px solid var(--site-border)" }}>
          {Object.entries(primitives.space).sort((a, b) => parseInt(a[1], 10) - parseInt(b[1], 10)).map(([key, val], i, arr) => {
            const numVal = parseInt(val, 10);
            return (
              <div key={key} style={{ display: "flex", alignItems: "center", padding: "14px 0", borderBottom: i === arr.length - 1 ? "none" : "1px solid var(--site-border)", gap: 24 }}>
                <div style={{ width: 120, fontSize: "var(--typography-body-md-size)", fontWeight: 700, color: "var(--core-color-text-primary)" }}>space.{key}</div>
                <div style={{ width: 80, fontSize: "var(--typography-font-size-xs)", fontFamily: "var(--site-mono)", color: "var(--core-color-text-secondary)" }}>{val}</div>
                <div style={{ flex: 1, display: "flex", alignItems: "center" }}>
                  <div style={{ width: Math.max(numVal, 2), height: 20, background: "var(--core-color-brand-500)", borderRadius: 4, minWidth: numVal > 0 ? numVal : 2, opacity: numVal === 0 ? 0.3 : 1 }} />
                </div>
              </div>
            );
          })}
        </div>
      )
    },
    {
      id: "04",
      anchorId: "border-radius",
      title: "Border Radius",
      content: (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 24, background: "var(--core-color-surface-default)", borderRadius: 14, padding: "32px", border: "1px solid var(--site-border)" }}>
          {Object.entries(primitives.radius).map(([key, val]) => (
            <div key={key} style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "center", width: 110 }}>
              <div style={{
                width: 80,
                height: 80,
                border: "2px solid var(--core-color-brand-400)",
                borderRadius: val,
                background: "var(--core-color-brand-50)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "var(--typography-font-size-xs)",
                fontWeight: 700,
                color: "var(--core-color-brand-700)"
              }}>
                {key}
              </div>
              <div style={{ fontSize: 12, fontFamily: "var(--site-mono)", color: "var(--core-color-text-secondary)" }}>{val}</div>
            </div>
          ))}
        </div>
      )
    },
    {
      id: "05",
      anchorId: "elevation-shadows",
      title: "Elevation & Shadows",
      content: (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
          {elevationKeys.map((key) => (
            <ElevationCard key={key} elevationKey={key} shadowVal={(primitives.elevation as Record<string, string>)[key]} />
          ))}
        </div>
      )
    },
    {
      id: "06",
      anchorId: "icon-sizing",
      title: "Icon Sizing",
      content: (
        <div style={{ display: "flex", gap: 32, flexWrap: "wrap", background: "var(--core-color-surface-default)", borderRadius: 14, padding: "32px", border: "1px solid var(--site-border)" }}>
          {iconSizes.map((item) => (
            <div key={item.key} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, width: 140 }}>
              <div style={{
                width: 72,
                height: 72,
                borderRadius: 12,
                background: "var(--core-color-surface-hover)",
                border: "1px solid var(--site-border)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}>
                <svg
                  width={item.val}
                  height={item.val}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--core-color-brand-600)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "var(--typography-body-md-size)", fontWeight: 700, color: "var(--core-color-text-primary)" }}>{item.label}</div>
                <div style={{ fontSize: 12, fontFamily: "var(--site-mono)", color: "var(--core-color-text-secondary)" }}>{item.val}</div>
                <code style={{ fontSize: "var(--typography-font-size-xs)", color: "var(--core-color-text-tertiary)" }}>{item.key}</code>
              </div>
            </div>
          ))}
        </div>
      )
    },
    /*
    {
      id: "08",
      title: "Motion & Timing",
      content: (
        <div style={{ display: "flex", flexDirection: "column", gap: 24, background: "var(--core-color-surface-default)", borderRadius: 14, padding: "28px 32px", border: "1px solid var(--site-border)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
            {Object.entries((primitives as any).motion || {}).filter(([k]) => k.startsWith("duration.")).map(([key, val]) => (
              <div key={key} style={{ padding: "16px", borderRadius: 10, background: "var(--core-color-surface-hover)", border: "1px solid var(--site-border)" }}>
                <div style={{ fontSize: "var(--typography-font-size-xs)", fontWeight: 700, letterSpacing: "0.06em", color: "var(--core-color-text-tertiary)", textTransform: "uppercase", marginBottom: 6 }}>
                  {key.replace("duration.", "")}
                </div>
                <div style={{ fontSize: 20, fontWeight: 700, color: "var(--core-color-text-primary)", fontFamily: "var(--site-mono)" }}>
                  {val as string}
                </div>
                <code style={{ fontSize: "var(--typography-font-size-xs)", color: "var(--core-color-brand-600)", marginTop: 6, display: "block" }}>
                  motion.{key}
                </code>
              </div>
            ))}
          </div>

          <div style={{ borderTop: "1px solid var(--site-border)", paddingTop: 20 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "var(--core-color-text-primary)", marginBottom: 12 }}>
              Easing Curves
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {Object.entries((primitives as any).motion || {}).filter(([k]) => k.startsWith("easing.")).map(([key, val]) => (
                <div key={key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", borderRadius: 8, background: "var(--core-color-surface-hover)", fontSize: "var(--typography-font-size-xs)" }}>
                  <span style={{ fontWeight: 600, color: "var(--core-color-text-primary)" }}>{key.replace("easing.", "")}</span>
                  <code style={{ fontFamily: "var(--site-mono)", fontSize: 12, color: "var(--core-color-text-secondary)" }}>{val as string}</code>
                </div>
              ))}
            </div>
          </div>
        </div>
      )
    }
    */
  ];

  const handleDownloadTypography = (e: React.MouseEvent) => {
    e.preventDefault();
    const jsonText = JSON.stringify(buildTypographyExportJson(), null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(jsonText)}`;
    const link = document.createElement("a");
    link.href = dataUri;
    link.download = "typography.json";
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      document.body.removeChild(link);
    }, 500);
  };

  return (
    <div style={{ maxWidth: 1024, margin: "0 auto", padding: "20px" }}>
      <div style={{ textAlign: "center", marginBottom: 60, marginTop: 40 }}>
        <h1 style={{ fontSize: 72, fontWeight: 700, letterSpacing: "-0.06em", margin: "0 0 16px 0", color: "var(--core-color-text-primary)", lineHeight: 1.1 }}>
          Typography
        </h1>
        <p style={{ maxWidth: 560, margin: "0 auto", color: "var(--core-color-text-tertiary)", fontSize: 18, lineHeight: 1.6, fontWeight: 400 }}>
          Typography scale, spacing, border radius, elevation, and icon tokens powering the CORE design system.
        </p>
        <div style={{ marginTop: 32, display: "flex", justifyContent: "center" }}>
          <button
            type="button"
            onClick={handleDownloadTypography}
            style={{ 
              display: "inline-flex", 
              alignItems: "center", 
              gap: 10, 
              padding: "14px 28px", 
              background: "var(--core-color-action-primary-bg)", 
              color: "var(--core-color-action-primary-text)", 
              fontWeight: 600, 
              borderRadius: 30, 
              border: "none",
              cursor: "pointer",
              fontSize: "var(--typography-body-md-size)",
              transition: "transform 0.2s, opacity 0.2s",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
            }}
            onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.9"; e.currentTarget.style.transform = "translateY(-1px)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "none"; }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Download Variables (.json)
          </button>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 80 }}>
        {sections.map((s) => (
          <div key={s.id} id={s.anchorId} className="docs-section" style={{ display: "flex", flexDirection: "column", gap: 32, position: "relative" }}>
            <div style={{ position: "absolute", top: 0, left: "-12.5%", width: "125%", height: 1, backgroundColor: "var(--site-border)" }} />
            <div style={{ paddingTop: 32 }}>
              <div className="docs-section__number">{s.id}</div>
              <h2 style={{ fontSize: 40, fontWeight: 600, letterSpacing: "-0.03em", margin: 0 }}>{s.title}</h2>
            </div>
            <div>
              {s.content}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
