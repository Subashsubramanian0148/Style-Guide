import React, { useState } from "react";

function InteractiveLogoPanel({ title, darkImg, lightImg, height }: { title: string, darkImg: string, lightImg: string, height: number }) {
  const [mode, setMode] = useState<"light" | "dark">("light");

  return (
    <div style={{ position: "relative", borderRadius: 14, overflow: "hidden", border: "1px solid rgba(128,128,128,0.15)", background: "var(--core-color-surface-default)" }}>
      {/* Absolute Toggle Switch */}
      <div style={{ position: "absolute", top: 20, right: 24, display: "flex", alignItems: "center", gap: 12, zIndex: 10 }}>
        <span style={{ fontSize: "var(--typography-body-md-size)", fontWeight: 600, color: mode === "light" ? "var(--core-color-text-primary)" : "var(--core-color-text-tertiary)", transition: "color 0.3s" }}>Light</span>
        <button 
          onClick={() => setMode(mode === "light" ? "dark" : "light")}
          style={{
            width: 44,
            height: 24,
            borderRadius: 12,
            background: mode === "light" ? "rgba(128,128,128,0.2)" : "var(--core-color-action-primary-bg)",
            border: "none",
            position: "relative",
            cursor: "pointer",
            transition: "background 0.3s"
          }}
          aria-label="Toggle dark mode"
        >
          <div style={{
            width: 20,
            height: 20,
            borderRadius: 10,
            background: "#fff",
            position: "absolute",
            top: 2,
            left: mode === "light" ? 2 : 22,
            transition: "left 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)",
            boxShadow: "0 2px 4px rgba(0,0,0,0.15)"
          }} />
        </button>
        <span style={{ fontSize: "var(--typography-body-md-size)", fontWeight: 600, color: mode === "dark" ? "var(--core-color-text-primary)" : "var(--core-color-text-tertiary)", transition: "color 0.3s" }}>Dark</span>
      </div>

      <div className="preview-surface" data-theme="core" data-mode={mode} style={{ background: "var(--core-color-surface-default)", minHeight: 240, display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.3s" }}>
        <img src={mode === "light" ? lightImg : darkImg} alt={`${title} variant`} style={{ height }} />
      </div>
    </div>
  );
}

function LogoAnatomy() {
  const [orientation, setOrientation] = useState<"horizontal" | "vertical">("horizontal");

  return (
    <div style={{ position: "relative", padding: "80px 40px 40px", background: "var(--core-color-surface-hover)", borderRadius: 14, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", border: "1px solid rgba(128,128,128,0.15)", minHeight: 380 }}>
      {/* Orientation Toggle Switch */}
      <div style={{ position: "absolute", top: 20, right: 24, display: "flex", alignItems: "center", gap: 8, zIndex: 10 }}>
        <button
          type="button"
          onClick={() => setOrientation("horizontal")}
          style={{
            padding: "6px 14px",
            borderRadius: 8,
            border: "1px solid",
            borderColor: orientation === "horizontal" ? "var(--theme-brand-background-primary-strong)" : "var(--site-border)",
            background: orientation === "horizontal" ? "var(--theme-brand-background-primary-strong)" : "transparent",
            color: orientation === "horizontal" ? "#FFFFFF" : "var(--core-color-text-secondary)",
            fontSize: 12,
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.2s"
          }}
        >
          Horizontal Lockup
        </button>
        <button
          type="button"
          onClick={() => setOrientation("vertical")}
          style={{
            padding: "6px 14px",
            borderRadius: 8,
            border: "1px solid",
            borderColor: orientation === "vertical" ? "var(--theme-brand-background-primary-strong)" : "var(--site-border)",
            background: orientation === "vertical" ? "var(--theme-brand-background-primary-strong)" : "transparent",
            color: orientation === "vertical" ? "#FFFFFF" : "var(--core-color-text-secondary)",
            fontSize: 12,
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.2s"
          }}
        >
          Vertical (Stacked) Lockup
        </button>
      </div>

      {orientation === "horizontal" ? (
        /* Horizontal Anatomy Representation */
        <div style={{ position: "relative", border: "1px solid #0052CC", background: "rgba(0,82,204,0.06)", display: "inline-flex" }}>
          {/* Top padding indicator */}
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "4px", background: "rgba(17, 141, 87, 0.3)", borderBottom: "1px solid rgba(17, 141, 87, 0.8)" }}></div>
          {/* Bottom padding indicator */}
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "4px", background: "rgba(17, 141, 87, 0.3)", borderTop: "1px solid rgba(17, 141, 87, 0.8)" }}></div>
          {/* Left padding indicator */}
          <div style={{ position: "absolute", top: 0, bottom: 0, left: 0, width: "8px", background: "rgba(17, 141, 87, 0.3)", borderRight: "1px solid rgba(17, 141, 87, 0.8)" }}></div>
          {/* Right padding indicator */}
          <div style={{ position: "absolute", top: 0, bottom: 0, right: 0, width: "8px", background: "rgba(17, 141, 87, 0.3)", borderLeft: "1px solid rgba(17, 141, 87, 0.8)" }}></div>

          {/* Labels & Lines */}
          {/* Top label (4) */}
          <div style={{ position: "absolute", top: -2, left: -24, background: "#118D57", color: "white", fontSize: "var(--typography-font-size-xs)", fontWeight: "bold", padding: "1px 5px", borderRadius: 4, lineHeight: 1 }}>4</div>
          <div style={{ position: "absolute", top: 2, left: -9, width: 8, height: 1, background: "#118D57" }}></div>
          <div style={{ position: "absolute", top: 2, left: -2, width: 1, height: 32, background: "#118D57", opacity: 0.5 }}></div>

          {/* Left label (8) */}
          <div style={{ position: "absolute", top: -26, left: 4, background: "#118D57", color: "white", fontSize: "var(--typography-font-size-xs)", fontWeight: "bold", padding: "1px 5px", borderRadius: 4, lineHeight: 1, transform: "translateX(-50%)" }}>8</div>
          <div style={{ position: "absolute", top: -12, left: 4, width: 1, height: 10, background: "#118D57" }}></div>
          <div style={{ position: "absolute", top: -12, left: 0, width: 18, height: 1, background: "#118D57", opacity: 0.5 }}></div>

          {/* Right label (8) */}
          <div style={{ position: "absolute", top: -26, right: 4, background: "#118D57", color: "white", fontSize: "var(--typography-font-size-xs)", fontWeight: "bold", padding: "1px 5px", borderRadius: 4, lineHeight: 1, transform: "translateX(50%)" }}>8</div>
          <div style={{ position: "absolute", top: -12, right: 4, width: 1, height: 10, background: "#118D57" }}></div>
          <div style={{ position: "absolute", top: -12, right: 0, width: 18, height: 1, background: "#118D57", opacity: 0.5 }}></div>
          
          {/* Bottom label (4) */}
          <div style={{ position: "absolute", bottom: -2, left: -24, background: "#118D57", color: "white", fontSize: "var(--typography-font-size-xs)", fontWeight: "bold", padding: "1px 5px", borderRadius: 4, lineHeight: 1 }}>4</div>
          <div style={{ position: "absolute", bottom: 2, left: -9, width: 8, height: 1, background: "#118D57" }}></div>
          <div style={{ position: "absolute", bottom: -30, left: -2, width: 1, height: 32, background: "#118D57", opacity: 0.5 }}></div>

          {/* The actual logo */}
          <div style={{ padding: "4px 8px" }}>
            <img src="/brand/core/core-logo-light.svg" alt="Core Anatomy Horizontal" style={{ height: 64, display: "block", opacity: 0.85 }} />
          </div>
        </div>
      ) : (
        /* Vertical Anatomy Representation */
        <div style={{ position: "relative", border: "1px solid #0052CC", background: "rgba(0,82,204,0.06)", display: "inline-flex" }}>
          {/* Top padding indicator (4px) */}
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "4px", background: "rgba(17, 141, 87, 0.3)", borderBottom: "1px solid rgba(17, 141, 87, 0.8)" }}></div>
          {/* Bottom padding indicator (4px) */}
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "4px", background: "rgba(17, 141, 87, 0.3)", borderTop: "1px solid rgba(17, 141, 87, 0.8)" }}></div>
          {/* Left padding indicator (8px) */}
          <div style={{ position: "absolute", top: 0, bottom: 0, left: 0, width: "8px", background: "rgba(17, 141, 87, 0.3)", borderRight: "1px solid rgba(17, 141, 87, 0.8)" }}></div>
          {/* Right padding indicator (8px) */}
          <div style={{ position: "absolute", top: 0, bottom: 0, right: 0, width: "8px", background: "rgba(17, 141, 87, 0.3)", borderLeft: "1px solid rgba(17, 141, 87, 0.8)" }}></div>

          {/* Labels & Lines */}
          {/* Top label (4) */}
          <div style={{ position: "absolute", top: -2, left: -24, background: "#118D57", color: "white", fontSize: "var(--typography-font-size-xs)", fontWeight: "bold", padding: "1px 5px", borderRadius: 4, lineHeight: 1 }}>4</div>
          <div style={{ position: "absolute", top: 2, left: -9, width: 8, height: 1, background: "#118D57" }}></div>
          <div style={{ position: "absolute", top: 2, left: -2, width: 1, height: 32, background: "#118D57", opacity: 0.5 }}></div>

          {/* Left label (8) */}
          <div style={{ position: "absolute", top: -26, left: 4, background: "#118D57", color: "white", fontSize: "var(--typography-font-size-xs)", fontWeight: "bold", padding: "1px 5px", borderRadius: 4, lineHeight: 1, transform: "translateX(-50%)" }}>8</div>
          <div style={{ position: "absolute", top: -12, left: 4, width: 1, height: 10, background: "#118D57" }}></div>
          <div style={{ position: "absolute", top: -12, left: 0, width: 18, height: 1, background: "#118D57", opacity: 0.5 }}></div>

          {/* Right label (8) */}
          <div style={{ position: "absolute", top: -26, right: 4, background: "#118D57", color: "white", fontSize: "var(--typography-font-size-xs)", fontWeight: "bold", padding: "1px 5px", borderRadius: 4, lineHeight: 1, transform: "translateX(50%)" }}>8</div>
          <div style={{ position: "absolute", top: -12, right: 4, width: 1, height: 10, background: "#118D57" }}></div>
          <div style={{ position: "absolute", top: -12, right: 0, width: 18, height: 1, background: "#118D57", opacity: 0.5 }}></div>

          {/* Bottom label (4) */}
          <div style={{ position: "absolute", bottom: -2, left: -24, background: "#118D57", color: "white", fontSize: "var(--typography-font-size-xs)", fontWeight: "bold", padding: "1px 5px", borderRadius: 4, lineHeight: 1 }}>4</div>
          <div style={{ position: "absolute", bottom: 2, left: -9, width: 8, height: 1, background: "#118D57" }}></div>
          <div style={{ position: "absolute", bottom: -30, left: -2, width: 1, height: 32, background: "#118D57", opacity: 0.5 }}></div>

          {/* Center gap label (8) */}
          <div style={{ position: "absolute", top: 56, right: -24, background: "#118D57", color: "white", fontSize: "var(--typography-font-size-xs)", fontWeight: "bold", padding: "1px 5px", borderRadius: 4, lineHeight: 1 }}>8</div>
          <div style={{ position: "absolute", top: 64, right: -8, width: 8, height: 1, background: "#118D57" }}></div>

          {/* Vertical Stacked Logo Content */}
          <div style={{ padding: "4px 16px", display: "flex", flexDirection: "column", alignItems: "center", minWidth: 110 }}>
            {/* Symbol on Top */}
            <svg width="56" height="56" viewBox="0 0 148 148" fill="none" style={{ display: "block" }}>
              <path d="M25.354 74.9609C26.581 100.212 46.45 120.48 71.249 121.743V139.208C36.997 137.921 9.452 109.858 8.19 74.9609H25.354ZM139.226 74.9609C137.964 109.858 110.419 137.921 76.166 139.208V121.743C100.966 120.48 120.835 100.212 122.063 74.9609H139.226ZM76.166 5.70996C110.418 6.99674 137.963 35.0587 139.226 69.9551H122.06C120.81 44.7066 100.934 24.4791 76.166 23.2168V5.70996ZM71.249 23.2168C46.464 24.4784 26.605 44.7061 25.356 69.9551H8.189C9.433 35.0584 36.977 6.99629 71.249 5.70996V23.2168Z" fill="#BA141A"/>
              <path d="M71.161 74.9609V105.832C55.02 104.609 42.142 91.4368 40.949 74.9609H71.161ZM106.285 74.9609C105.093 91.453 92.216 104.611 76.074 105.832V74.9609H106.285ZM76.074 39.085C92.216 40.3064 105.093 53.4637 106.285 69.9551H76.074V39.085ZM71.161 69.9551H40.949C42.143 53.4799 55.02 40.3076 71.161 39.085V69.9551Z" fill="#292670"/>
              <path d="M76.165 139.208H71.251V147.552H76.165V139.208Z" fill="#BA141A"/>
              <path d="M76.165 -2.63477H71.251V5.7089H76.165V-2.63477Z" fill="#BA141A"/>
              <path d="M139.226 69.9547V74.9609H147.415V69.9547H139.226Z" fill="#BA141A"/>
              <path d="M0 69.9547V74.9609H8.19V69.9547H0Z" fill="#BA141A"/>
            </svg>

            {/* Inter-element 8px gap indicator */}
            <div style={{ width: "100%", height: 8, margin: 0, background: "rgba(17, 141, 87, 0.3)", borderTop: "1px dashed rgba(17, 141, 87, 0.8)", borderBottom: "1px dashed rgba(17, 141, 87, 0.8)", position: "relative" }}></div>

            {/* Wordmark beneath */}
            <span style={{ display: "block", fontSize: 18, fontWeight: 700, letterSpacing: "0.08em", color: "#292670", lineHeight: 1, margin: 0 }}>
              CORE
            </span>
          </div>
        </div>
      )}

      {/* Guide Note Below (commented out as requested) */}
      {/*
      <div style={{ marginTop: 24, textAlign: "center", maxWidth: 640, fontSize: 14, color: "var(--core-color-text-secondary)", lineHeight: 1.5 }}>
        {orientation === "horizontal" ? (
          <span><strong>Horizontal Lockup:</strong> Standard 1-row layout with 4px vertical clearance and 8px horizontal clearance.</span>
        ) : (
          <div>
            <div style={{ fontWeight: 600, color: "var(--core-color-text-primary)", marginBottom: 4 }}>
              Vertical (Stacked) Lockup Spacing: 4px Internal Gap
            </div>
            <p style={{ margin: "0 0 8px 0" }}>
              Based on industry design benchmarks (e.g. <strong>Slack</strong>, <strong>Mastercard</strong>, <strong>Target</strong>, <strong>GitLab</strong>), internal separation between mark and wordmark is kept tight at <strong>4px (0.5X)</strong>. Following the <em>Gestalt Law of Proximity</em>, internal elements must sit closer together than external boundaries (<strong>8px perimeter clearspace</strong>) to read as a single, cohesive entity.
            </p>
          </div>
        )}
      </div>
      */}
    </div>
  );
}

export default function LogoPage() {
  const sections = [
    {
      id: "01",
      anchorId: "core-mark",
      title: "CORE mark",
      content: (
        <InteractiveLogoPanel 
          title="CORE mark" 
          lightImg="/brand/core/core-logo-light.svg" 
          darkImg="/brand/core/core-logo-dark.svg" 
          height={64} 
        />
      )
    },
    {
      id: "02",
      anchorId: "anatomy-spacing",
      title: "Anatomy & Spacing",
      content: <LogoAnatomy />
    },
    {
      id: "03",
      anchorId: "client-logo",
      title: "Client logo",
      content: (
        <InteractiveLogoPanel 
          title="Meridian client logo" 
          lightImg="/brand/lendguard/logo-lockup-light.svg" 
          darkImg="/brand/lendguard/logo-lockup-dark.svg" 
          height={36} 
        />
      )
    }
  ];

  return (
    <div style={{ maxWidth: 1024, margin: "0 auto", padding: "20px" }}>
      <div style={{ textAlign: "center", marginBottom: 60, marginTop: 40 }}>
        <h1 style={{ fontSize: 72, fontWeight: 700, letterSpacing: "-0.06em", margin: "0 0 16px 0", color: "var(--core-color-text-primary)", lineHeight: 1.1 }}>
          Logo
        </h1>
        <p style={{ maxWidth: 560, margin: "0 auto", color: "var(--core-color-text-tertiary)", fontSize: 18, lineHeight: 1.6, fontWeight: 400 }}>
          CORE's own mark identifies the design system itself — never the product. A client theme supplies its own logo for use inside the actual application chrome.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 100 }}>
        {sections.map((s) => (
          <div key={s.id} id={s.anchorId} className="docs-section" style={{ display: "flex", flexDirection: "column", gap: 40, position: "relative" }}>
            <div style={{ position: "absolute", top: 0, left: "-12.5%", width: "125%", height: 1, backgroundColor: "var(--site-border)" }} />
            <div style={{ paddingTop: 32 }}>
              <div className="docs-section__number">{s.id}</div>
              <h2 style={{ fontSize: 48, fontWeight: 500, letterSpacing: "-0.04em", margin: 0 }}>{s.title}</h2>
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
