import React, { useRef, useState } from "react";
import primitives from "../../../../packages/tokens/src/primitives.json";

const color = (primitives as any).color;

function hexToRgbValues(hex: string): [number, number, number] {
  let h = hex.replace("#", "").trim();
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  const num = parseInt(h, 16);
  if (isNaN(num)) return [2, 112, 169];
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

function hslToHex(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const col = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * col).toString(16).padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`.toUpperCase();
}

export function generateBrandPalette(baseHex: string): Record<string, string> {
  const [r, g, b] = hexToRgbValues(baseHex);
  const [h, s, baseL] = rgbToHsl(r, g, b);

  const steps: Array<{ step: string; l: number; sMult: number }> = [
    { step: "50",  l: 97, sMult: 0.45 },
    { step: "100", l: 92, sMult: 0.65 },
    { step: "200", l: 82, sMult: 0.80 },
    { step: "300", l: 70, sMult: 0.90 },
    { step: "400", l: 57, sMult: 1.00 },
    { step: "500", l: 46, sMult: 1.00 },
    { step: "600", l: 37, sMult: 1.00 },
    { step: "700", l: 29, sMult: 0.95 },
    { step: "800", l: 22, sMult: 0.90 },
    { step: "900", l: 16, sMult: 0.85 },
    { step: "950", l: 10, sMult: 0.80 },
  ];

  const ramp: Record<string, string> = {};
  for (const item of steps) {
    const sat = Math.max(15, Math.min(100, Math.round(s * item.sMult)));
    ramp[item.step] = hslToHex(h, sat, item.l);
  }

  let closestStep = "600";
  let minDiff = 999;
  for (const item of steps) {
    const diff = Math.abs(item.l - baseL);
    if (diff < minDiff) {
      minDiff = diff;
      closestStep = item.step;
    }
  }
  ramp[closestStep] = baseHex.toUpperCase();

  return ramp;
}

function injectDynamicBrandCss(scale: Record<string, string>) {
  let styleEl = document.getElementById("core-dynamic-brand-override") as HTMLStyleElement | null;
  if (!styleEl) {
    styleEl = document.createElement("style");
    styleEl.id = "core-dynamic-brand-override";
    document.head.appendChild(styleEl);
  }

  styleEl.textContent = `
    :root, [data-theme], [data-theme="core"] {
      --core-color-brand-50: ${scale["50"]} !important;
      --core-color-brand-100: ${scale["100"]} !important;
      --core-color-brand-200: ${scale["200"]} !important;
      --core-color-brand-300: ${scale["300"]} !important;
      --core-color-brand-400: ${scale["400"]} !important;
      --core-color-brand-500: ${scale["500"]} !important;
      --core-color-brand-600: ${scale["600"]} !important;
      --core-color-brand-700: ${scale["700"]} !important;
      --core-color-brand-800: ${scale["800"]} !important;
      --core-color-brand-900: ${scale["900"]} !important;
      --core-color-brand-950: ${scale["950"]} !important;

      --theme-colors-primary-50: ${scale["50"]} !important;
      --theme-colors-primary-100: ${scale["100"]} !important;
      --theme-colors-primary-200: ${scale["200"]} !important;
      --theme-colors-primary-300: ${scale["300"]} !important;
      --theme-colors-primary-400: ${scale["400"]} !important;
      --theme-colors-primary-500: ${scale["500"]} !important;
      --theme-colors-primary-600: ${scale["600"]} !important;
      --theme-colors-primary-700: ${scale["700"]} !important;
      --theme-colors-primary-800: ${scale["800"]} !important;
      --theme-colors-primary-900: ${scale["900"]} !important;
      --theme-colors-primary-950: ${scale["950"]} !important;

      --core-color-action-primary-bg: ${scale["600"]} !important;
      --core-color-action-primary-bgHover: ${scale["700"]} !important;
      --core-color-action-primary-bgActive: ${scale["800"]} !important;
      --core-color-action-primary-tintBg: ${scale["50"]} !important;
      --core-color-action-primary-tintText: ${scale["700"]} !important;
      --core-color-action-primary-tintBorder: ${scale["200"]} !important;
      --core-color-border-focus: ${scale["500"]} !important;

      --core-gradient-brand-subtle: linear-gradient(135deg, ${scale["500"]} 0%, ${scale["700"]} 100%) !important;
      --core-gradient-brand-vivid: linear-gradient(135deg, ${scale["400"]} 0%, ${scale["600"]} 55%, ${scale["900"]} 100%) !important;
    }

    [data-mode="dark"], [data-site-mode="dark"] {
      --core-color-action-primary-bg: ${scale["400"]} !important;
      --core-color-action-primary-bgHover: ${scale["300"]} !important;
      --core-color-action-primary-bgActive: ${scale["200"]} !important;
      --core-color-action-primary-tintBg: ${scale["950"]} !important;
      --core-color-action-primary-tintText: ${scale["300"]} !important;
      --core-color-action-primary-tintBorder: ${scale["800"]} !important;
    }
  `;
}

function removeDynamicBrandCss() {
  const styleEl = document.getElementById("core-dynamic-brand-override");
  if (styleEl) styleEl.remove();
}

function extractFromCanvas(url: string, resolve: (hex: string) => void) {
  const img = new Image();
  img.crossOrigin = "Anonymous";
  img.onload = () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      resolve("#1F4F8D");
      return;
    }
    const size = 64;
    canvas.width = size;
    canvas.height = size;
    ctx.drawImage(img, 0, 0, size, size);

    try {
      const imgData = ctx.getImageData(0, 0, size, size).data;
      const bins: Record<string, { count: number; r: number; g: number; b: number; sat: number }> = {};

      for (let i = 0; i < imgData.length; i += 4) {
        const a = imgData[i + 3];
        if (a < 80) continue;
        const r = imgData[i];
        const g = imgData[i + 1];
        const b = imgData[i + 2];

        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        const diff = max - min;

        if (max > 245 && min > 245) continue;
        if (max < 20) continue;
        if (diff < 15) continue;

        const qr = Math.round(r / 16) * 16;
        const qg = Math.round(g / 16) * 16;
        const qb = Math.round(b / 16) * 16;
        const key = `${qr},${qg},${qb}`;

        if (!bins[key]) {
          bins[key] = { count: 0, r, g, b, sat: diff / (max || 1) };
        }
        bins[key].count += 1;
      }

      const list = Object.values(bins);
      if (list.length === 0) {
        resolve("#1F4F8D");
        return;
      }

      list.sort((a, b) => {
        const scoreA = a.count * (1 + a.sat * 2.5);
        const scoreB = b.count * (1 + b.sat * 2.5);
        return scoreB - scoreA;
      });

      const best = list[0];
      const hex = `#${best.r.toString(16).padStart(2, "0")}${best.g.toString(16).padStart(2, "0")}${best.b.toString(16).padStart(2, "0")}`.toUpperCase();
      resolve(hex);
    } catch {
      resolve("#1F4F8D");
    }
  };
  img.onerror = () => resolve("#1F4F8D");
  img.src = url;
}

function extractDominantColor(file: File): Promise<string> {
  return new Promise((resolve) => {
    if (file.type === "image/svg+xml" || file.name.toLowerCase().endsWith(".svg")) {
      const reader = new FileReader();
      reader.onload = () => {
        const text = reader.result as string;
        const hexMatches = text.match(/#(?:[0-9a-fA-F]{6}|[0-9a-fA-F]{3})\b/g);
        if (hexMatches) {
          const valid = hexMatches.filter((h) => {
            const [r, g, b] = hexToRgbValues(h);
            const max = Math.max(r, g, b), min = Math.min(r, g, b);
            return (max - min) >= 20 && max <= 245 && min >= 15;
          });
          if (valid.length > 0) {
            const counts: Record<string, number> = {};
            for (const c of valid) {
              const u = c.toUpperCase();
              counts[u] = (counts[u] || 0) + 1;
            }
            const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
            resolve(sorted[0][0]);
            return;
          }
        }
        extractFromCanvas(URL.createObjectURL(file), resolve);
      };
      reader.onerror = () => extractFromCanvas(URL.createObjectURL(file), resolve);
      reader.readAsText(file);
    } else {
      extractFromCanvas(URL.createObjectURL(file), resolve);
    }
  });
}

const PRESET_LOGOS = [
  { name: "CORE Blue (Default)", hex: "#1F4F8D", logo: "/brand/core/core-logo-light.svg" },
  { name: "Meridian Cyan", hex: "#1B7EB2", logo: "/brand/lendguard/logo-lockup-light.svg" },
  { name: "Emerald Mint", hex: "#10B981", logo: null },
  { name: "Royal Violet", hex: "#7C3AED", logo: null },
  { name: "Crimson Rose", hex: "#E11D48", logo: null },
  { name: "Solar Amber", hex: "#D97706", logo: null },
];

export default function ColorExtractionPage() {
  const [brandScale, setBrandScale] = useState<Record<string, string>>(color.brand);
  const [activeHex, setActiveHex] = useState<string>(color.brand["500"]);
  const [logoSrc, setLogoSrc] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleApplyHex = (newHex: string, customLogoSrc?: string | null) => {
    setActiveHex(newHex);
    if (customLogoSrc !== undefined) {
      setLogoSrc(customLogoSrc);
    }
    const newScale = generateBrandPalette(newHex);
    setBrandScale(newScale);
    injectDynamicBrandCss(newScale);
  };

  const handleReset = () => {
    setActiveHex(color.brand["500"]);
    setBrandScale(color.brand);
    setLogoSrc(null);
    removeDynamicBrandCss();
  };

  const processFile = async (file: File) => {
    if (!file) return;
    setIsProcessing(true);
    try {
      const url = URL.createObjectURL(file);
      const extracted = await extractDominantColor(file);
      handleApplyHex(extracted, url);
    } finally {
      setIsProcessing(false);
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const copyThemeJson = () => {
    const overrides: Record<string, string> = {};
    for (const [step, hex] of Object.entries(brandScale)) {
      overrides[`color.brand.${step}`] = hex;
    }
    navigator.clipboard.writeText(JSON.stringify(overrides, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  return (
    <div style={{ maxWidth: 1024, margin: "0 auto", padding: "20px" }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 60, marginTop: 40 }}>
        <h1 style={{ fontSize: 72, fontWeight: 700, letterSpacing: "-0.06em", margin: "0 0 16px 0", color: "var(--core-color-text-primary)", lineHeight: 1.1 }}>
          Color extraction
        </h1>
        <p style={{ maxWidth: 580, margin: "0 auto", color: "var(--core-color-text-tertiary)", fontSize: 18, lineHeight: 1.6, fontWeight: 400 }}>
          Upload any PNG or SVG logo to extract its dominant primary brand color and dynamically generate the full 50–950 tonal scale. All neutral, success, warning, danger, and info scales remain constant.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 36 }}>
        {/* Upload Zone & Presets */}
        <div
          style={{
            background: "var(--core-color-surface-default)",
            borderRadius: 14,
            padding: "36px",
            border: isDragging ? "2px dashed var(--core-color-action-primary-bg)" : "1px solid var(--site-border)",
            transition: "border-color 0.2s, background 0.2s",
            boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
          }}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={onDrop}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 28 }}>
            {/* Left: Upload Input & Drag area */}
            <div style={{ flex: "1 1 360px" }}>
              <input
                ref={fileInputRef}
                type="file"
                accept=".png,.svg,.jpg,.jpeg,.webp,image/*"
                style={{ display: "none" }}
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    processFile(e.target.files[0]);
                  }
                }}
              />
              <div
                onClick={() => fileInputRef.current?.click()}
                style={{
                  border: "2px dashed var(--site-border)",
                  borderRadius: 12,
                  padding: "32px 20px",
                  textAlign: "center",
                  cursor: "pointer",
                  background: isDragging ? "rgba(2, 112, 169, 0.05)" : "var(--core-color-bg-page)",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = "var(--core-color-action-primary-bg)"}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = "var(--site-border)"}
              >
                <div style={{ fontSize: 36, marginBottom: 8 }}>🖼️</div>
                <div style={{ fontWeight: 600, fontSize: 16, color: "var(--core-color-text-primary)", marginBottom: 4 }}>
                  {isProcessing ? "Extracting primary color from logo..." : "Upload logo (PNG or SVG)"}
                </div>
                <div style={{ fontSize: "var(--typography-body-md-size)", color: "var(--core-color-text-tertiary)" }}>
                  Drag & drop your logo here, or <span style={{ color: "var(--core-color-brand-600)", textDecoration: "underline" }}>browse files</span>
                </div>
              </div>

              {/* One-click Presets */}
              <div style={{ marginTop: 24 }}>
                <div style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--core-color-text-tertiary)", marginBottom: 10 }}>
                  Or test with a preset brand:
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {PRESET_LOGOS.map((p) => {
                    const isActive = activeHex.toLowerCase() === p.hex.toLowerCase();
                    return (
                      <button
                        key={p.name}
                        onClick={() => handleApplyHex(p.hex, p.logo)}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 8,
                          padding: "var(--core-space-2) var(--core-space-3)",
                          borderRadius: 20,
                          border: isActive ? `2px solid ${p.hex}` : "1px solid var(--site-border)",
                          background: isActive ? "rgba(128,128,128,0.1)" : "var(--core-color-surface-default)",
                          cursor: "pointer",
                          fontSize: 12,
                          fontWeight: 600,
                          color: "var(--core-color-text-primary)",
                          transition: "transform 0.15s",
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.02)"}
                        onMouseLeave={(e) => e.currentTarget.style.transform = "none"}
                      >
                        <span style={{ width: 12, height: 12, borderRadius: "50%", background: p.hex }} />
                        {p.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right: Extracted Primary Color & Preview Box */}
            <div style={{ flex: "1 1 300px", background: "var(--core-color-bg-page)", borderRadius: 12, padding: "24px", border: "1px solid var(--site-border)" }}>
              <div style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--core-color-text-tertiary)", marginBottom: 14 }}>
                Extracted Primary Color
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 18 }}>
                <div style={{ position: "relative" }}>
                  <div
                    style={{
                      width: 58,
                      height: 58,
                      borderRadius: 12,
                      background: activeHex,
                      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                      border: "2px solid #ffffff",
                    }}
                  />
                  <input
                    type="color"
                    value={activeHex}
                    onChange={(e) => handleApplyHex(e.target.value, logoSrc)}
                    title="Click to fine-tune exact hex color"
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      opacity: 0,
                      cursor: "pointer",
                    }}
                  />
                </div>
                <div>
                  <div style={{ fontSize: 20, fontWeight: 700, fontFamily: "var(--site-mono)", color: "var(--core-color-text-primary)" }}>
                    {activeHex}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--core-color-text-tertiary)", marginTop: 2 }}>
                    Click swatch to fine-tune hex
                  </div>
                </div>
              </div>

              {/* Uploaded Logo Display Thumbnail */}
              {logoSrc && (
                <div style={{ padding: "var(--core-space-2) var(--core-space-3)", background: "var(--core-color-surface-default)", borderRadius: 8, border: "1px solid var(--site-border)", marginBottom: 16, display: "flex", alignItems: "center", gap: 12 }}>
                  <img src={logoSrc} alt="Active brand logo" style={{ maxHeight: 28, maxWidth: 100, objectFit: "contain" }} />
                  <span style={{ fontSize: 12, fontWeight: 600, color: "var(--core-color-text-secondary)" }}>
                    Active brand logo
                  </span>
                </div>
              )}

              {/* Actions */}
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 12 }}>
                <button
                  onClick={handleReset}
                  style={{
                    padding: "var(--core-space-2) var(--core-space-3)",
                    borderRadius: "var(--core-radius-sm)",
                    border: "1px solid var(--site-border)",
                    background: "var(--core-color-surface-default)",
                    color: "var(--core-color-text-secondary)",
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Reset to CORE
                </button>
                <button
                  onClick={copyThemeJson}
                  style={{
                    padding: "var(--core-space-2) var(--core-space-3)",
                    borderRadius: "var(--core-radius-sm)",
                    border: "none",
                    background: "var(--core-color-action-primary-bg)",
                    color: "var(--core-color-action-primary-text)",
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  {copiedJson ? "✓ Copied JSON" : "Copy Theme JSON"}
                </button>
              </div>
            </div>
          </div>

          {/* Dynamic Primary Scale Display (50 - 950) */}
          <div style={{ marginTop: 36, borderTop: "1px solid var(--site-border)", paddingTop: "var(--core-space-6)"}}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <div style={{ fontSize: "var(--typography-body-lg-size)", fontWeight: 700, color: "var(--core-color-text-primary)" }}>
                Generated Primary Scale (50 – 950)
              </div>
              <span style={{ fontSize: 12, color: "var(--core-color-text-tertiary)" }}>
                Click any step to copy token variable
              </span>
            </div>

            <div style={{ display: "flex", width: "100%", height: 54, borderRadius: 8, overflow: "hidden", border: "1px solid var(--site-border)" }}>
              {Object.entries(brandScale).map(([step, hex]) => (
                <div
                  key={step}
                  style={{ flex: 1, background: hex, cursor: "pointer", transition: "opacity 0.15s" }}
                  title={`--core-color-brand-${step}: ${hex}`}
                  onClick={() => navigator.clipboard.writeText(`var(--core-color-brand-${step})`)}
                  onMouseEnter={(e) => e.currentTarget.style.opacity = "0.85"}
                  onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
                />
              ))}
            </div>

            <div style={{ display: "flex", width: "100%", marginTop: 8 }}>
              {Object.entries(brandScale).map(([step, hex]) => (
                <div key={step} style={{ flex: 1, textAlign: "center" }}>
                  <div style={{ fontSize: "var(--typography-font-size-xs)", fontWeight: 600, color: "var(--core-color-text-secondary)" }}>{step}</div>
                  <div style={{ fontSize: "var(--typography-font-size-xs)", fontFamily: "var(--site-mono)", color: "var(--core-color-text-tertiary)", marginTop: 2 }}>
                    {hex}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Live Component Resilience & Constant Scales Indicator */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 24 }}>
          {/* Card 1: Live Interactive Components */}
          <div style={{ background: "var(--core-color-surface-default)", borderRadius: 14, padding: "28px", border: "1px solid var(--site-border)" }}>
            <div style={{ fontSize: "var(--typography-body-lg-size)", fontWeight: 700, color: "var(--core-color-text-primary)", marginBottom: 18 }}>
              Live Components (Primary Brand Action)
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "flex", gap: "var(--core-space-2)", alignItems: "center", flexWrap: "wrap" }}>
                <button
                  style={{
                    padding: "var(--core-space-2) var(--core-space-4)",
                    borderRadius: "var(--core-radius-sm)",
                    border: "none",
                    background: "var(--core-color-action-primary-bg)",
                    color: "var(--core-color-action-primary-text)",
                    fontWeight: 600,
                    fontSize: "var(--typography-body-md-size)",
                    cursor: "pointer",
                  }}
                >
                  Primary Action
                </button>
                <button
                  style={{
                    padding: "var(--core-space-2) var(--core-space-4)",
                    borderRadius: "var(--core-radius-sm)",
                    border: "none",
                    background: "var(--core-color-action-primary-tintBg)",
                    color: "var(--core-color-action-primary-tintText)",
                    fontWeight: 600,
                    fontSize: "var(--typography-body-md-size)",
                    cursor: "pointer",
                  }}
                >
                  Primary Tint Button
                </button>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "var(--core-space-2)"}}>
                <input
                  type="text"
                  defaultValue="Focused brand input"
                  style={{
                    flex: 1,
                    padding: "8px 12px",
                    borderRadius: "var(--core-radius-sm)",
                    border: "2px solid var(--core-color-border-focus)",
                    outline: "none",
                    fontSize: "var(--typography-body-md-size)",
                    background: "var(--core-color-surface-default)",
                    color: "var(--core-color-text-primary)",
                  }}
                />
              </div>

              <div style={{ padding: "12px 16px", borderRadius: 8, background: "var(--core-color-action-primary-tintBg)", border: "1px solid var(--core-color-action-primary-tintBorder)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "var(--typography-body-md-size)", fontWeight: 600, color: "var(--core-color-action-primary-tintText)" }}>
                  Active Theme Accent
                </span>
                <span style={{ fontSize: "var(--typography-font-size-xs)", fontWeight: 700, padding: "var(--core-space-1) var(--core-space-2)", borderRadius: 12, background: "var(--core-color-action-primary-bg)", color: "var(--core-color-action-primary-text)" }}>
                  Brand
                </span>
              </div>
            </div>
          </div>

          {/* Card 2: Constant Tokens Proof (Neutral, Success, Warning, Danger, Info) */}
          <div style={{ background: "var(--core-color-surface-default)", borderRadius: 14, padding: "28px", border: "1px solid var(--site-border)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
              <div style={{ fontSize: "var(--typography-body-lg-size)", fontWeight: 700, color: "var(--core-color-text-primary)" }}>
                Constant Tokens (Untouched)
              </div>
              <span style={{ fontSize: "var(--typography-font-size-xs)", fontWeight: 700, color: "var(--core-color-status-success-text)", background: "var(--core-color-status-success-bg)", padding: "var(--core-space-1) var(--core-space-2)", borderRadius: 12 }}>
                ✓ Constant
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { name: "Neutral", token: "--core-color-neutral-600", hex: color.neutral["600"], desc: "Surfaces, borders & typography" },
                { name: "Success", token: "--core-color-status-success-bgStrong", hex: color.success["600"], desc: "Confirmation, active indicators" },
                { name: "Warning", token: "--core-color-status-warning-text", hex: color.warning["600"], desc: "Attention, warnings" },
                { name: "Danger", token: "--core-color-action-destructive-bg", hex: color.danger["600"], desc: "Destructive actions, error states" },
                { name: "Info", token: "--core-color-status-info-bgStrong", hex: color.info["600"], desc: "System guidance, notifications" },
              ].map((item) => (
                <div key={item.name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "var(--core-space-1) 0", borderBottom: "1px solid var(--site-border)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "var(--core-space-2)"}}>
                    <div style={{ width: 18, height: 18, borderRadius: 4, background: item.hex }} />
                    <span style={{ fontSize: "var(--typography-body-md-size)", fontWeight: 600, color: "var(--core-color-text-primary)" }}>{item.name}</span>
                  </div>
                  <span style={{ fontSize: 12, color: "var(--core-color-text-tertiary)" }}>{item.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
