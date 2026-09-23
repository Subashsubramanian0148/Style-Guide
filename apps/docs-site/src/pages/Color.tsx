import React, { useEffect, useRef, useState } from "react";
// @ts-ignore — Vite `?raw` import for palette download bundle.
import semanticPaletteScss from "../../public/Format.expanded.css?raw";
import primitives from "../../../../packages/tokens/src/primitives.json";
import { ContrastBadge } from "../ContrastBadge";
import { rgbStringToHex } from "../lib/contrast";
import {
  ContrastAgainstControl,
  ContrastBasisNote,
  getContrastResult,
  WcagContrastIndicator,
  WcagLegend,
  type ContrastBackground,
} from "../WcagContrastIndicator";
import { ChevronIcon, Collapsible } from "../../../../packages/core/src/components/Primitives";
const color = (primitives as any).color;
const gradient = (primitives as any).gradient;

/* (MODE_SECTIONS removed — replaced by the M3-style accordion in BaselineTokensSection) */

/* ── Baseline Color Tokens ──────────────────────────────────────────────── */

const BASELINE_GROUPS: Array<{
  title: string;
  tokens: Array<{ label: string; key: string }>;
}> = [
    {
      title: "Primary",
      tokens: [
        { label: "Primary", key: "color.action.primary.bg" },
        { label: "Primary Hover", key: "color.action.primary.bgHover" },
        { label: "On Primary", key: "color.action.primary.text" },
        { label: "Primary Tint", key: "color.action.primary.tintBg" },
        { label: "Primary Tint Text", key: "color.action.primary.tintText" },
      ],
    },
    {
      title: "Secondary",
      tokens: [
        { label: "Secondary", key: "color.palette.secondary.solidBg" },
        { label: "On Secondary", key: "color.palette.secondary.solidText" },
        { label: "Secondary Tint", key: "color.palette.secondary.tintBg" },
        { label: "Secondary Text", key: "color.palette.secondary.text" },
      ],
    },
    {
      title: "Tertiary",
      tokens: [
        { label: "Tertiary", key: "color.palette.tertiary.solidBg" },
        { label: "On Tertiary", key: "color.palette.tertiary.solidText" },
        { label: "Tertiary Tint", key: "color.palette.tertiary.tintBg" },
        { label: "Tertiary Text", key: "color.palette.tertiary.text" },
      ],
    },
    {
      title: "Destructive",
      tokens: [
        { label: "Destructive", key: "color.action.destructive.bg" },
        { label: "On Destructive", key: "color.action.destructive.text" },
      ],
    },
    {
      title: "Surfaces",
      tokens: [
        { label: "Page", key: "color.bg.page" },
        { label: "Canvas", key: "color.bg.canvas" },
        { label: "Surface", key: "color.surface.default" },
        { label: "Raised", key: "color.surface.raised" },
        { label: "Sunken", key: "color.surface.sunken" },
        { label: "Overlay", key: "color.surface.overlay" },
      ],
    },
    {
      title: "Text",
      tokens: [
        { label: "Primary", key: "color.text.primary" },
        { label: "Secondary", key: "color.text.secondary" },
        { label: "Tertiary", key: "color.text.tertiary" },
        { label: "Disabled", key: "color.text.disabled" },
        { label: "Inverse", key: "color.text.inverse" },
        { label: "On Brand", key: "color.text.onBrand" },
      ],
    },
    {
      title: "Borders",
      tokens: [
        { label: "Subtle", key: "color.border.subtle" },
        { label: "Default", key: "color.border.default" },
        { label: "Strong", key: "color.border.strong" },
        { label: "Focus", key: "color.border.focus" },
      ],
    },
    {
      title: "Status",
      tokens: [
        { label: "Success Bg", key: "color.status.success.bg" },
        { label: "Success Text", key: "color.status.success.text" },
        { label: "Success Border", key: "color.status.success.border" },
        { label: "Warning Bg", key: "color.status.warning.bg" },
        { label: "Warning Text", key: "color.status.warning.text" },
        { label: "Warning Border", key: "color.status.warning.border" },
        { label: "Danger Bg", key: "color.status.danger.bg" },
        { label: "Danger Text", key: "color.status.danger.text" },
        { label: "Danger Border", key: "color.status.danger.border" },
        { label: "Info Bg", key: "color.status.info.bg" },
        { label: "Info Text", key: "color.status.info.text" },
        { label: "Info Border", key: "color.status.info.border" },
      ],
    },
  ];

function luminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function parseRgb(raw: string): [number, number, number] | null {
  const m = raw.match(/rgba?\(\s*(\d+)[,\s]+(\d+)[,\s]+(\d+)/);
  return m ? [+m[1], +m[2], +m[3]] : null;
}

function BaselineSwatch({ tokenKey, label }: { tokenKey: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [textColor, setTextColor] = useState("#fff");
  const varName = `--core-${tokenKey.replace(/\./g, "-")}`;

  useEffect(() => {
    if (!ref.current) return;
    const bg = getComputedStyle(ref.current).backgroundColor;
    const rgb = parseRgb(bg);
    if (rgb) {
      const lum = luminance(...rgb);
      setTextColor(lum > 0.179 ? "#000" : "#fff");
    }
  }, [tokenKey]);

  return (
    <div
      ref={ref}
      title="Click to copy token"
      onClick={() => navigator.clipboard.writeText(`var(${varName})`)}
      style={{
        background: `var(${varName})`,
        color: textColor,
        padding: "16px 14px 12px",
        borderRadius: 10,
        minHeight: 100,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        border: "1px solid var(--site-border)",
        flex: "1 1 140px",
        minWidth: 0,
        cursor: "pointer",
        transition: "transform 0.1s ease",
      }}
      onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.02)"}
      onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
    >
      <span style={{ fontSize: "var(--typography-font-size-xs)", fontFamily: "var(--site-mono)", opacity: 0.85, wordBreak: "break-all", lineHeight: 1.4 }}>{varName}</span>
      <span style={{ fontSize: "var(--typography-body-md-size)", fontWeight: 600, marginTop: "12px", wordBreak: "break-word", lineHeight: 1.3 }}>{label}</span>
    </div>
  );
}

function BaselineAccordionGroup({ group, mode }: { group: typeof BASELINE_GROUPS[number]; mode: "light" | "dark" }) {
  const [open, setOpen] = useState(group.title === "Primary");
  return (
    <div style={{ borderBottom: "1px solid var(--site-border)" }}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          padding: "14px 20px",
          border: "none",
          background: "transparent",
          cursor: "pointer",
          fontSize: 14,
          fontWeight: 600,
          color: "inherit",
          fontFamily: "inherit",
        }}
      >
        <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 16, opacity: 0.5 }}>📁</span>
          {group.title} colors
        </span>
        <ChevronIcon size={14} style={{ opacity: 0.5, transition: "transform 0.15s", transform: open ? "rotate(180deg)" : undefined }} />
      </button>
      {open && (
        <div data-theme="core" data-mode={mode} style={{ padding: "0 20px 20px", display: "flex", gap: 8, flexWrap: "wrap" }}>
          {group.tokens.map((t) => (
            <BaselineSwatch key={t.key} tokenKey={t.key} label={t.label} />
          ))}
        </div>
      )}
    </div>
  );
}

function BaselineTokensSection() {
  const [mode, setMode] = useState<"light" | "dark">("light");
  return (
    <div className="site-panel" style={{ padding: 0, overflow: "hidden" }}>
      <div style={{ padding: "20px 20px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <select
          value={mode}
          onChange={(e) => setMode(e.target.value as "light" | "dark")}
          style={{
            padding: "6px 12px",
            borderRadius: 20,
            border: "1px solid var(--site-border)",
            background: "var(--site-bg-elevated)",
            fontSize: "var(--typography-font-size-xs)",
            fontWeight: 600,
            color: "inherit",
            fontFamily: "inherit",
            cursor: "pointer",
          }}
        >
          <option value="light">Default, Light</option>
          <option value="dark">Default, Dark</option>
        </select>
      </div>
      {BASELINE_GROUPS.map((group) => (
        <BaselineAccordionGroup key={group.title} group={group} mode={mode} />
      ))}
    </div>
  );
}

/* ── end Baseline Color Tokens ─────────────────────────────────────────── */

/* (ModeSwatchCell removed — replaced by BaselineSwatch in the M3 accordion) */

function GradientSwatch({ name, css, token }: { name: string; css: string; token: string }) {
  return (
    <div className="token-swatch" onClick={() => navigator.clipboard.writeText(`var(${token})`)} style={{ cursor: "pointer" }} title="Click to copy token">
      <div className="chip" style={{ background: css }} />
      <div className="meta">
        <div className="name">{name}</div>
        <div className="value"><code>{token}</code></div>
      </div>
    </div>
  );
}

function Swatch({ name, hex, token, note, border }: { name: string; hex: string; token: string; note?: string; border?: boolean }) {
  return (
    <div className="token-swatch" onClick={() => navigator.clipboard.writeText(`var(${token})`)} style={{ cursor: "pointer" }} title="Click to copy token">
      <div className="chip" style={{ background: hex, border: border ? "1px solid var(--site-border)" : undefined }} />
      <div className="meta">
        <div className="name">{name}</div>
        <div className="value" style={{ fontFamily: "var(--site-mono)", fontSize: "var(--typography-font-size-xs)", marginBottom: 4 }}>{token}</div>
        <div style={{ marginTop: 6, display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
          <ContrastBadge hex={hex} />
        </div>
        {note && <div className="value" style={{ marginTop: 4 }}>{note}</div>}
      </div>
    </div>
  );
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  let cleaned = hex.replace("#", "").trim();
  if (cleaned.length === 3) {
    cleaned = cleaned.split("").map((c) => c + c).join("");
  }
  const num = parseInt(cleaned, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

function hexToCmyk(hex: string): { c: number; m: number; y: number; k: number } {
  const { r, g, b } = hexToRgb(hex);
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;
  const k = 1 - Math.max(rNorm, gNorm, bNorm);
  if (k >= 0.999) return { c: 0, m: 0, y: 0, k: 100 };
  const c = Math.round(((1 - rNorm - k) / (1 - k)) * 100);
  const m = Math.round(((1 - gNorm - k) / (1 - k)) * 100);
  const y = Math.round(((1 - bNorm - k) / (1 - k)) * 100);
  return { c, m, y, k: Math.round(k * 100) };
}

function getContrastColor(hex: string): string {
  const { r, g, b } = hexToRgb(hex);
  const lum = luminance(r, g, b);
  // WCAG threshold where black and white give equal contrast ratio is ~0.179
  return lum > 0.179 ? "#000000" : "#FFFFFF";
}

function FullColorScalesSection() {
  const [contrastBackground, setContrastBackground] = useState<ContrastBackground>("white");

  return (
    <div style={{ background: "var(--core-color-surface-default)", borderRadius: 14, padding: "32px", border: "1px solid var(--site-border)" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 12,
          marginBottom: 20,
          paddingBottom: 16,
          borderBottom: "1px solid var(--site-border)",
        }}
      >
        <ContrastAgainstControl value={contrastBackground} onChange={setContrastBackground} />
        <ContrastBasisNote contrastBackground={contrastBackground} />
        <WcagLegend />
      </div>
      <div style={{ display: "flex", paddingBottom: 16, borderBottom: "1px solid var(--site-border)", fontSize: "var(--typography-font-size-xs)", fontWeight: 600, color: "var(--core-color-text-secondary)" }}>
        <div style={{ width: "25%", minWidth: 150 }}>Name</div>
        <div style={{ width: "75%" }}>Swatches</div>
      </div>
      <RampRow name="brand (primary)" prefix="brand" scale={color.brand} contrastBackground={contrastBackground} />
      <RampRow name="secondary" prefix="secondary" scale={color.secondary} contrastBackground={contrastBackground} />
      <RampRow name="tertiary" prefix="tertiary" scale={color.tertiary} contrastBackground={contrastBackground} />
      <RampRow name="neutral" prefix="neutral" scale={color.neutral} contrastBackground={contrastBackground} />
      <RampRow name="success" prefix="success" scale={color.success} contrastBackground={contrastBackground} />
      <RampRow name="warning" prefix="warning" scale={color.warning} contrastBackground={contrastBackground} />
      <RampRow name="danger" prefix="danger" scale={color.danger} contrastBackground={contrastBackground} />
      <RampRow name="info" prefix="info" scale={color.info} contrastBackground={contrastBackground} isLast />
    </div>
  );
}

function RampRow({
  name,
  prefix,
  scale,
  contrastBackground,
  isLast,
}: {
  name: string;
  prefix: string;
  scale: Record<string, string>;
  contrastBackground: ContrastBackground;
  isLast?: boolean;
}) {
  const entries = Object.entries(scale);

  const copyToken = (step: string) => {
    navigator.clipboard.writeText(`var(--core-color-${prefix}-${step})`);
  };

  return (
    <div style={{ display: "flex", padding: "28px 0", borderBottom: isLast ? "none" : "1px solid var(--site-border)", gap: 20 }}>
      <div
        style={{
          width: "22%",
          minWidth: 120,
          fontSize: "var(--typography-font-size-xs)",
          fontWeight: 700,
          textTransform: "uppercase",
          color: "var(--core-color-text-primary)",
          paddingTop: 8,
          letterSpacing: "0.04em",
          lineHeight: 1.4,
        }}
      >
        {name}
      </div>
      <div style={{ flex: 1, minWidth: 0, overflowX: "auto" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${entries.length}, minmax(58px, 1fr))`,
            gap: 0,
            minWidth: entries.length * 58,
          }}
        >
          <div
            style={{
              gridColumn: `1 / -1`,
              display: "flex",
              height: 56,
              borderRadius: "var(--core-radius-sm)",
              overflow: "hidden",
              border: "1px solid var(--site-border)",
            }}
          >
            {entries.map(([step, hex]) => (
              <button
                key={`${step}-chip`}
                type="button"
                aria-label={`${name} ${step} ${hex}`}
                title={`Click to copy ${hex}`}
                onClick={() => navigator.clipboard.writeText(hex)}
                style={{
                  flex: 1,
                  minWidth: 0,
                  border: "none",
                  padding: 0,
                  background: hex,
                  cursor: "pointer",
                  transition: "opacity 0.2s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.92"; }}
                onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
              />
            ))}
          </div>
          {entries.map(([step, hex]) => (
            <div
              key={step}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "stretch",
                minWidth: 0,
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 4,
                  padding: "8px 2px 0",
                  textAlign: "center",
                }}
              >
                <button
                  type="button"
                  onClick={() => navigator.clipboard.writeText(hex)}
                  title={`Click to copy ${hex}`}
                  style={{
                    border: "none",
                    background: "transparent",
                    padding: 0,
                    fontSize: 10,
                    fontFamily: "var(--site-mono)",
                    fontWeight: 600,
                    color: "var(--core-color-text-secondary)",
                    cursor: "pointer",
                    lineHeight: 1.2,
                    wordBreak: "break-all",
                  }}
                >
                  {hex.toUpperCase()}
                </button>
                <WcagContrastIndicator hex={hex} contrastBackground={contrastBackground} layout="stack" passFailBelow />
                <button
                  type="button"
                  onClick={() => copyToken(step)}
                  title={`Click to copy var(--core-color-${prefix}-${step})`}
                  style={{
                    border: "none",
                    background: "transparent",
                    padding: "2px 0 0",
                    fontSize: 11,
                    fontWeight: 700,
                    color: "var(--core-color-text-primary)",
                    cursor: "pointer",
                    lineHeight: 1.2,
                  }}
                >
                  {step}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Figma Aligned Base Color Variables & Redesigned Section ─────────────── */

export interface FigmaTokenItem {
  id: string;
  name: string; // e.g. "primary-default"
  displayName: string; // e.g. "Primary Default"
  group: string; // e.g. "Brand / Text"
  subgroup: string; // e.g. "Text", "Background", "Borders", "Critical", etc.
  path: string; // e.g. "Brand / Text / primary-default"
  cssVar: string; // e.g. "--theme-brand-text-primary-default"
  aliasCssVar?: string; // e.g. "--brand-text-primary-default"
  coreRef: string; // e.g. "--core-color-action-primary-bg"
  category: "primary" | "secondary" | "tertiary" | "neutral" | "disabled" | "critical" | "warning" | "success" | "info" | "brand" | "semantics";
  type: "text" | "background" | "border";
  lightHex: string;
  darkHex: string;
  paletteNameLight: string; // e.g. "Brand 500"
  paletteNameDark: string;  // e.g. "Brand 300"
}

/** Canonical token label from Format to follow naming.scss (no `--` prefix). */
function canonicalTokenName(token: FigmaTokenItem): string {
  const raw = token.aliasCssVar || token.cssVar;
  return raw.replace(/^--(?:theme-)?/, "");
}

function canonicalTokenVar(token: FigmaTokenItem): string {
  return `--${canonicalTokenName(token)}`;
}

const FIGMA_BASE_TOKENS: FigmaTokenItem[] = [
  // ── 1. PRIMARY COLORS (BRAND) ──
  // Primary / Text
  {
    id: "primary-text-oncolor",
    name: "primary-oncolor",
    displayName: "Primary On Color",
    group: "Primary / Text",
    subgroup: "Text",
    path: "Primary / Text / primary-oncolor",
    cssVar: "--theme-brand-text-primary-oncolor",
    aliasCssVar: "--brand-text-primary-oncolor",
    coreRef: "--core-color-action-primary-text",
    category: "primary",
    type: "text",
    lightHex: "#FFFFFF",
    darkHex: "#F5F7FA",
    paletteNameLight: "Neutral 0",
    paletteNameDark: "Brand 50",
  },
  {
    id: "primary-text-disabled",
    name: "primary-disabled",
    displayName: "Primary Disabled",
    group: "Primary / Text",
    subgroup: "Text",
    path: "Primary / Text / primary-disabled",
    cssVar: "--theme-brand-text-primary-disabled",
    aliasCssVar: "--brand-text-primary-disabled",
    coreRef: "--core-color-brand-300",
    category: "primary",
    type: "text",
    lightHex: "#86ADDF",
    darkHex: "#86ADDF",
    paletteNameLight: "Brand 300",
    paletteNameDark: "Brand 300",
  },
  {
    id: "primary-text-default",
    name: "primary-default",
    displayName: "Primary Default",
    group: "Primary / Text",
    subgroup: "Text",
    path: "Primary / Text / primary-default",
    cssVar: "--theme-brand-text-primary-default",
    aliasCssVar: "--brand-text-primary-default",
    coreRef: "--core-color-action-primary-bg",
    category: "primary",
    type: "text",
    lightHex: "#1F4F8D",
    darkHex: "#1F4F8D",
    paletteNameLight: "Brand 500",
    paletteNameDark: "Brand 500",
  },
  {
    id: "primary-text-hover",
    name: "primaryhover",
    displayName: "Primary Hover",
    group: "Primary / Text",
    subgroup: "Text",
    path: "Primary / Text / primaryhover",
    cssVar: "--theme-brand-text-primary-hover",
    aliasCssVar: "--brand-text-primary-hover",
    coreRef: "--core-color-action-primary-bgHover",
    category: "primary",
    type: "text",
    lightHex: "#1B4479",
    darkHex: "#3275CD",
    paletteNameLight: "Brand 600",
    paletteNameDark: "Brand 400",
  },
  {
    id: "primary-text-active",
    name: "primary-active",
    displayName: "Primary Active",
    group: "Primary / Text",
    subgroup: "Text",
    path: "Primary / Text / primary-active",
    cssVar: "--theme-brand-text-primary-active",
    aliasCssVar: "--brand-text-primary-active",
    coreRef: "--core-color-action-primary-bgActive",
    category: "primary",
    type: "text",
    lightHex: "#17365E",
    darkHex: "#BACEE9",
    paletteNameLight: "Brand 700",
    paletteNameDark: "Brand 200",
  },

  // Primary / Background
  {
    id: "primary-bg-light",
    name: "primary-light",
    displayName: "Primary Light",
    group: "Primary / Background",
    subgroup: "Background",
    path: "Primary / Background / primary-light",
    cssVar: "--theme-brand-background-primary-light",
    aliasCssVar: "--brand-background-primary-light",
    coreRef: "--core-color-action-primary-tintBg",
    category: "primary",
    type: "background",
    lightHex: "#F5F7FA",
    darkHex: "#102137",
    paletteNameLight: "Brand 50",
    paletteNameDark: "Brand 900",
  },
  {
    id: "primary-bg-subtle",
    name: "primary-subtle",
    displayName: "Primary Subtle",
    group: "Primary / Background",
    subgroup: "Background",
    path: "Primary / Background / primary-subtle",
    cssVar: "--theme-brand-background-primary-subtle",
    aliasCssVar: "--brand-background-primary-subtle",
    coreRef: "--core-color-brand-100",
    category: "primary",
    type: "background",
    lightHex: "#E2E9F3",
    darkHex: "#132A49",
    paletteNameLight: "Brand 100",
    paletteNameDark: "Brand 800",
  },
  {
    id: "primary-bg-disabled-light",
    name: "disabled-light",
    displayName: "Disabled Light",
    group: "Primary / Background",
    subgroup: "Background",
    path: "Primary / Background / disabled-light",
    cssVar: "--theme-brand-background-primary-disabled-light",
    aliasCssVar: "--brand-background-primary-disabled-light",
    coreRef: "--core-color-neutral-100",
    category: "primary",
    type: "background",
    lightHex: "#EEEEF2",
    darkHex: "#EEEEF2",
    paletteNameLight: "Neutral 100",
    paletteNameDark: "Neutral 100",
  },
  {
    id: "primary-bg-disabled-strong",
    name: "disabled-strong",
    displayName: "Disabled Strong",
    group: "Primary / Background",
    subgroup: "Background",
    path: "Primary / Background / disabled-strong",
    cssVar: "--theme-brand-background-primary-disabled",
    aliasCssVar: "--brand-background-primary-disabled",
    coreRef: "--core-color-brand-200",
    category: "primary",
    type: "background",
    lightHex: "#BACEE9",
    darkHex: "#BACEE9",
    paletteNameLight: "Brand 200",
    paletteNameDark: "Brand 200",
  },
  {
    id: "primary-bg-strong",
    name: "strong",
    displayName: "Strong Background",
    group: "Primary / Background",
    subgroup: "Background",
    path: "Primary / Background / strong",
    cssVar: "--theme-brand-background-primary-strong",
    aliasCssVar: "--brand-background-primary-strong",
    coreRef: "--core-color-action-primary-bg",
    category: "primary",
    type: "background",
    lightHex: "#1F4F8D",
    darkHex: "#1F4F8D",
    paletteNameLight: "Brand 500",
    paletteNameDark: "Brand 500",
  },
  {
    id: "primary-bg-hover",
    name: "hover",
    displayName: "Hover",
    group: "Primary / Background",
    subgroup: "Background",
    path: "Primary / Background / hover",
    cssVar: "--theme-brand-background-primary-hover",
    aliasCssVar: "--brand-background-primary-hover",
    coreRef: "--core-color-action-primary-bgHover",
    category: "primary",
    type: "background",
    lightHex: "#1B4479",
    darkHex: "#1B4479",
    paletteNameLight: "Brand 600",
    paletteNameDark: "Brand 400",
  },
  {
    id: "primary-bg-active",
    name: "active",
    displayName: "Active",
    group: "Primary / Background",
    subgroup: "Background",
    path: "Primary / Background / active",
    cssVar: "--theme-brand-background-primary-active",
    aliasCssVar: "--brand-background-primary-active",
    coreRef: "--core-color-action-primary-bgActive",
    category: "primary",
    type: "background",
    lightHex: "#17365E",
    darkHex: "#1F4F8D",
    paletteNameLight: "Brand 700",
    paletteNameDark: "Brand 300",
  },

  // Primary / Borders
  {
    id: "primary-border-disabled",
    name: "primary-disabled",
    displayName: "Primary Disabled",
    group: "Primary / Borders",
    subgroup: "Borders",
    path: "Primary / Borders / primary-disabled",
    cssVar: "--theme-brand-border-primary-disabled",
    aliasCssVar: "--brand-border-primary-disabled",
    coreRef: "--core-color-brand-200",
    category: "primary",
    type: "border",
    lightHex: "#BACEE9",
    darkHex: "#BACEE9",
    paletteNameLight: "Brand 200",
    paletteNameDark: "Brand 200",
  },
  {
    id: "primary-border-default",
    name: "primary-default",
    displayName: "Primary Default",
    group: "Primary / Borders",
    subgroup: "Borders",
    path: "Primary / Borders / primary-default",
    cssVar: "--theme-brand-border-primary-default",
    aliasCssVar: "--brand-border-primary-default",
    coreRef: "--core-color-brand-500",
    category: "primary",
    type: "border",
    lightHex: "#1F4F8D",
    darkHex: "#1F4F8D",
    paletteNameLight: "Brand 500",
    paletteNameDark: "Brand 500",
  },
  {
    id: "primary-border-primary-hover",
    name: "hover",
    displayName: "Hover",
    group: "Primary / Borders",
    subgroup: "Borders",
    path: "Primary / Borders / hover",
    cssVar: "--theme-brand-border-primary-hover",
    aliasCssVar: "--brand-border-primary-hover",
    coreRef: "--core-color-brand-600",
    category: "primary",
    type: "border",
    lightHex: "#1B4479",
    darkHex: "#86ADDF",
    paletteNameLight: "Brand 600",
    paletteNameDark: "Brand 300",
  },

  // ── 2. SECONDARY COLORS (SAME STRUCTURE AS PRIMARY) ──
  // Secondary / Text
  {
    id: "secondary-text-oncolor",
    name: "secondary-oncolor",
    displayName: "Secondary On Color",
    group: "Secondary / Text",
    subgroup: "Text",
    path: "Secondary / Text / secondary-oncolor",
    cssVar: "--theme-secondary-text-primary-oncolor",
    coreRef: "--core-color-neutral-0",
    category: "secondary",
    type: "text",
    lightHex: "#FFFFFF",
    darkHex: "#FFFFFF",
    paletteNameLight: "Neutral 0",
    paletteNameDark: "Neutral 0",
  },
  {
    id: "secondary-text-disabled",
    name: "secondary-disabled",
    displayName: "Secondary Disabled",
    group: "Secondary / Text",
    subgroup: "Text",
    path: "Secondary / Text / secondary-disabled",
    cssVar: "--theme-secondary-text-primary-disabled",
    coreRef: "--core-color-secondary-300",
    category: "secondary",
    type: "text",
    lightHex: "#71CAF4",
    darkHex: "#71CAF4",
    paletteNameLight: "Secondary 300",
    paletteNameDark: "Secondary 300",
  },
  {
    id: "secondary-text-default",
    name: "secondary-default",
    displayName: "Secondary Default",
    group: "Secondary / Text",
    subgroup: "Text",
    path: "Secondary / Text / secondary-default",
    cssVar: "--theme-secondary-text-primary-default",
    coreRef: "--core-color-secondary-500",
    category: "secondary",
    type: "text",
    lightHex: "#39BCF9",
    darkHex: "#39BCF9",
    paletteNameLight: "Secondary 500",
    paletteNameDark: "Secondary 500",
  },
  {
    id: "secondary-text-hover",
    name: "secondaryhover",
    displayName: "Secondary Hover",
    group: "Secondary / Text",
    subgroup: "Text",
    path: "Secondary / Text / secondaryhover",
    cssVar: "--theme-secondary-text-primary-hover",
    coreRef: "--core-color-secondary-600",
    category: "secondary",
    type: "text",
    lightHex: "#07A8F2",
    darkHex: "#56C3F5",
    paletteNameLight: "Secondary 600",
    paletteNameDark: "Secondary 400",
  },
  {
    id: "secondary-text-active",
    name: "secondary-active",
    displayName: "Secondary Active",
    group: "Secondary / Text",
    subgroup: "Text",
    path: "Secondary / Text / secondary-active",
    cssVar: "--theme-secondary-text-primary-active",
    coreRef: "--core-color-secondary-700",
    category: "secondary",
    type: "text",
    lightHex: "#0B81B7",
    darkHex: "#AFDEF4",
    paletteNameLight: "Secondary 700",
    paletteNameDark: "Secondary 200",
  },

  // Secondary / Background
  {
    id: "secondary-bg-light",
    name: "secondary-light",
    displayName: "Secondary Light",
    group: "Secondary / Background",
    subgroup: "Background",
    path: "Secondary / Background / secondary-light",
    cssVar: "--theme-secondary-background-primary-light",
    coreRef: "--core-color-secondary-50",
    category: "secondary",
    type: "background",
    lightHex: "#F4F9FB",
    darkHex: "#0A3F57",
    paletteNameLight: "Secondary 50",
    paletteNameDark: "Secondary 900",
  },
  {
    id: "secondary-bg-subtle",
    name: "secondary-subtle",
    displayName: "Secondary Subtle",
    group: "Secondary / Background",
    subgroup: "Background",
    path: "Secondary / Background / secondary-subtle",
    cssVar: "--theme-secondary-background-primary-subtle",
    coreRef: "--core-color-secondary-100",
    category: "secondary",
    type: "background",
    lightHex: "#DEEFF7",
    darkHex: "#0B5E84",
    paletteNameLight: "Secondary 100",
    paletteNameDark: "Secondary 800",
  },
  {
    id: "secondary-bg-disabled-light",
    name: "disabled-light",
    displayName: "Disabled Light",
    group: "Secondary / Background",
    subgroup: "Background",
    path: "Secondary / Background / disabled-light",
    cssVar: "--theme-secondary-background-primary-disabled-light",
    coreRef: "--core-color-neutral-100",
    category: "secondary",
    type: "background",
    lightHex: "#EEEEF2",
    darkHex: "#EEEEF2",
    paletteNameLight: "Neutral 100",
    paletteNameDark: "Neutral 100",
  },
  {
    id: "secondary-bg-disabled-strong",
    name: "disabled-strong",
    displayName: "Disabled Strong",
    group: "Secondary / Background",
    subgroup: "Background",
    path: "Secondary / Background / disabled-strong",
    cssVar: "--theme-secondary-background-primary-disabled",
    coreRef: "--core-color-secondary-200",
    category: "secondary",
    type: "background",
    lightHex: "#AFDEF4",
    darkHex: "#AFDEF4",
    paletteNameLight: "Secondary 200",
    paletteNameDark: "Secondary 200",
  },
  {
    id: "secondary-bg-strong",
    name: "strong",
    displayName: "Strong Background",
    group: "Secondary / Background",
    subgroup: "Background",
    path: "Secondary / Background / strong",
    cssVar: "--theme-secondary-background-primary-strong",
    coreRef: "--core-color-secondary-500",
    category: "secondary",
    type: "background",
    lightHex: "#39BCF9",
    darkHex: "#39BCF9",
    paletteNameLight: "Secondary 500",
    paletteNameDark: "Secondary 500",
  },
  {
    id: "secondary-bg-hover",
    name: "hover",
    displayName: "Hover",
    group: "Secondary / Background",
    subgroup: "Background",
    path: "Secondary / Background / hover",
    cssVar: "--theme-secondary-background-primary-hover",
    coreRef: "--core-color-secondary-600",
    category: "secondary",
    type: "background",
    lightHex: "#07A8F2",
    darkHex: "#56C3F5",
    paletteNameLight: "Secondary 600",
    paletteNameDark: "Secondary 400",
  },
  {
    id: "secondary-bg-active",
    name: "active",
    displayName: "Active",
    group: "Secondary / Background",
    subgroup: "Background",
    path: "Secondary / Background / active",
    cssVar: "--theme-secondary-background-primary-active",
    coreRef: "--core-color-secondary-700",
    category: "secondary",
    type: "background",
    lightHex: "#0B81B7",
    darkHex: "#71CAF4",
    paletteNameLight: "Secondary 700",
    paletteNameDark: "Secondary 300",
  },

  // Secondary / Borders
  {
    id: "secondary-border-disabled",
    name: "secondary-disabled",
    displayName: "Secondary Disabled",
    group: "Secondary / Borders",
    subgroup: "Borders",
    path: "Secondary / Borders / secondary-disabled",
    cssVar: "--theme-secondary-border-primary-disabled",
    coreRef: "--core-color-secondary-200",
    category: "secondary",
    type: "border",
    lightHex: "#AFDEF4",
    darkHex: "#AFDEF4",
    paletteNameLight: "Secondary 200",
    paletteNameDark: "Secondary 200",
  },
  {
    id: "secondary-border-default",
    name: "secondary-default",
    displayName: "Secondary Default",
    group: "Secondary / Borders",
    subgroup: "Borders",
    path: "Secondary / Borders / secondary-default",
    cssVar: "--theme-secondary-border-primary-default",
    coreRef: "--core-color-secondary-500",
    category: "secondary",
    type: "border",
    lightHex: "#39BCF9",
    darkHex: "#39BCF9",
    paletteNameLight: "Secondary 500",
    paletteNameDark: "Secondary 500",
  },
  {
    id: "secondary-border-primary-hover",
    name: "hover",
    displayName: "Hover",
    group: "Secondary / Borders",
    subgroup: "Borders",
    path: "Secondary / Borders / hover",
    cssVar: "--theme-secondary-border-primary-hover",
    coreRef: "--core-color-secondary-600",
    category: "secondary",
    type: "border",
    lightHex: "#07A8F2",
    darkHex: "#71CAF4",
    paletteNameLight: "Secondary 600",
    paletteNameDark: "Secondary 300",
  },

  // ── 3. TERTIARY COLORS (SAME STRUCTURE AS PRIMARY) ──
  // Tertiary / Text
  {
    id: "tertiary-text-oncolor",
    name: "tertiary-oncolor",
    displayName: "Tertiary On Color",
    group: "Tertiary / Text",
    subgroup: "Text",
    path: "Tertiary / Text / tertiary-oncolor",
    cssVar: "--theme-tertiary-text-primary-oncolor",
    coreRef: "--core-color-neutral-0",
    category: "tertiary",
    type: "text",
    lightHex: "#FFFFFF",
    darkHex: "#FFFFFF",
    paletteNameLight: "Neutral 0",
    paletteNameDark: "Neutral 0",
  },
  {
    id: "tertiary-text-disabled",
    name: "tertiary-disabled",
    displayName: "Tertiary Disabled",
    group: "Tertiary / Text",
    subgroup: "Text",
    path: "Tertiary / Text / tertiary-disabled",
    cssVar: "--theme-tertiary-text-primary-disabled",
    coreRef: "--core-color-tertiary-300",
    category: "tertiary",
    type: "text",
    lightHex: "#FBCB6B",
    darkHex: "#FBCB6B",
    paletteNameLight: "Tertiary 300",
    paletteNameDark: "Tertiary 300",
  },
  {
    id: "tertiary-text-default",
    name: "tertiary-default",
    displayName: "Tertiary Default",
    group: "Tertiary / Text",
    subgroup: "Text",
    path: "Tertiary / Text / tertiary-default",
    cssVar: "--theme-tertiary-text-primary-default",
    coreRef: "--core-color-tertiary-500",
    category: "tertiary",
    type: "text",
    lightHex: "#E89A1C",
    darkHex: "#E89A1C",
    paletteNameLight: "Tertiary 500",
    paletteNameDark: "Tertiary 500",
  },
  {
    id: "tertiary-text-hover",
    name: "tertiaryhover",
    displayName: "Tertiary Hover",
    group: "Tertiary / Text",
    subgroup: "Text",
    path: "Tertiary / Text / tertiaryhover",
    cssVar: "--theme-tertiary-text-primary-hover",
    coreRef: "--core-color-tertiary-600",
    category: "tertiary",
    type: "text",
    lightHex: "#C27A10",
    darkHex: "#F2B244",
    paletteNameLight: "Tertiary 600",
    paletteNameDark: "Tertiary 400",
  },
  {
    id: "tertiary-text-active",
    name: "tertiary-active",
    displayName: "Tertiary Active",
    group: "Tertiary / Text",
    subgroup: "Text",
    path: "Tertiary / Text / tertiary-active",
    cssVar: "--theme-tertiary-text-primary-active",
    coreRef: "--core-color-tertiary-700",
    category: "tertiary",
    type: "text",
    lightHex: "#95590A",
    darkHex: "#FCDB94",
    paletteNameLight: "Tertiary 700",
    paletteNameDark: "Tertiary 200",
  },

  // Tertiary / Background
  {
    id: "tertiary-bg-light",
    name: "tertiary-light",
    displayName: "Tertiary Light",
    group: "Tertiary / Background",
    subgroup: "Background",
    path: "Tertiary / Background / tertiary-light",
    cssVar: "--theme-tertiary-background-primary-light",
    coreRef: "--core-color-tertiary-50",
    category: "tertiary",
    type: "background",
    lightHex: "#FFF8EA",
    darkHex: "#5C3505",
    paletteNameLight: "Tertiary 50",
    paletteNameDark: "Tertiary 900",
  },
  {
    id: "tertiary-bg-subtle",
    name: "tertiary-subtle",
    displayName: "Tertiary Subtle",
    group: "Tertiary / Background",
    subgroup: "Background",
    path: "Tertiary / Background / tertiary-subtle",
    cssVar: "--theme-tertiary-background-primary-subtle",
    coreRef: "--core-color-tertiary-100",
    category: "tertiary",
    type: "background",
    lightHex: "#FEEBBE",
    darkHex: "#784708",
    paletteNameLight: "Tertiary 100",
    paletteNameDark: "Tertiary 800",
  },
  {
    id: "tertiary-bg-disabled-light",
    name: "disabled-light",
    displayName: "Disabled Light",
    group: "Tertiary / Background",
    subgroup: "Background",
    path: "Tertiary / Background / disabled-light",
    cssVar: "--theme-tertiary-background-primary-disabled-light",
    coreRef: "--core-color-neutral-100",
    category: "tertiary",
    type: "background",
    lightHex: "#EEEEF2",
    darkHex: "#EEEEF2",
    paletteNameLight: "Neutral 100",
    paletteNameDark: "Neutral 100",
  },
  {
    id: "tertiary-bg-disabled-strong",
    name: "disabled-strong",
    displayName: "Disabled Strong",
    group: "Tertiary / Background",
    subgroup: "Background",
    path: "Tertiary / Background / disabled-strong",
    cssVar: "--theme-tertiary-background-primary-disabled",
    coreRef: "--core-color-tertiary-200",
    category: "tertiary",
    type: "background",
    lightHex: "#FCDB94",
    darkHex: "#FCDB94",
    paletteNameLight: "Tertiary 200",
    paletteNameDark: "Tertiary 200",
  },
  {
    id: "tertiary-bg-strong",
    name: "strong",
    displayName: "Strong Background",
    group: "Tertiary / Background",
    subgroup: "Background",
    path: "Tertiary / Background / strong",
    cssVar: "--theme-tertiary-background-primary-strong",
    coreRef: "--core-color-tertiary-500",
    category: "tertiary",
    type: "background",
    lightHex: "#E89A1C",
    darkHex: "#E89A1C",
    paletteNameLight: "Tertiary 500",
    paletteNameDark: "Tertiary 500",
  },
  {
    id: "tertiary-bg-hover",
    name: "hover",
    displayName: "Hover",
    group: "Tertiary / Background",
    subgroup: "Background",
    path: "Tertiary / Background / hover",
    cssVar: "--theme-tertiary-background-primary-hover",
    coreRef: "--core-color-tertiary-600",
    category: "tertiary",
    type: "background",
    lightHex: "#C27A10",
    darkHex: "#F2B244",
    paletteNameLight: "Tertiary 600",
    paletteNameDark: "Tertiary 400",
  },
  {
    id: "tertiary-bg-active",
    name: "active",
    displayName: "Active",
    group: "Tertiary / Background",
    subgroup: "Background",
    path: "Tertiary / Background / active",
    cssVar: "--theme-tertiary-background-primary-active",
    coreRef: "--core-color-tertiary-700",
    category: "tertiary",
    type: "background",
    lightHex: "#95590A",
    darkHex: "#FBCB6B",
    paletteNameLight: "Tertiary 700",
    paletteNameDark: "Tertiary 300",
  },

  // Tertiary / Borders
  {
    id: "tertiary-border-disabled",
    name: "tertiary-disabled",
    displayName: "Tertiary Disabled",
    group: "Tertiary / Borders",
    subgroup: "Borders",
    path: "Tertiary / Borders / tertiary-disabled",
    cssVar: "--theme-tertiary-border-primary-disabled",
    coreRef: "--core-color-tertiary-200",
    category: "tertiary",
    type: "border",
    lightHex: "#FCDB94",
    darkHex: "#FCDB94",
    paletteNameLight: "Tertiary 200",
    paletteNameDark: "Tertiary 200",
  },
  {
    id: "tertiary-border-default",
    name: "tertiary-default",
    displayName: "Tertiary Default",
    group: "Tertiary / Borders",
    subgroup: "Borders",
    path: "Tertiary / Borders / tertiary-default",
    cssVar: "--theme-tertiary-border-primary-default",
    coreRef: "--core-color-tertiary-500",
    category: "tertiary",
    type: "border",
    lightHex: "#E89A1C",
    darkHex: "#E89A1C",
    paletteNameLight: "Tertiary 500",
    paletteNameDark: "Tertiary 500",
  },
  {
    id: "tertiary-border-primary-hover",
    name: "hover",
    displayName: "Hover",
    group: "Tertiary / Borders",
    subgroup: "Borders",
    path: "Tertiary / Borders / hover",
    cssVar: "--theme-tertiary-border-primary-hover",
    coreRef: "--core-color-tertiary-600",
    category: "tertiary",
    type: "border",
    lightHex: "#C27A10",
    darkHex: "#FBCB6B",
    paletteNameLight: "Tertiary 600",
    paletteNameDark: "Tertiary 300",
  },

  // ── 4. NEUTRAL COLORS ──
  // Neutral / Text
  {
    id: "neutral-text-on-color",
    name: "text-on-color",
    displayName: "Text On Color",
    group: "Neutral / Text",
    subgroup: "Text",
    path: "Neutral / Text / text-on-color",
    cssVar: "--theme-neutral-text-on-color",
    aliasCssVar: "--neutral-text-on-color",
    coreRef: "--core-color-text-inverse",
    category: "neutral",
    type: "text",
    lightHex: "#FFFFFF",
    darkHex: "#FFFFFF",
    paletteNameLight: "Neutral 0",
    paletteNameDark: "Neutral 0",
  },
  {
    id: "neutral-text-subtleleast",
    name: "subtleleast",
    displayName: "Subtle Least",
    group: "Neutral / Text",
    subgroup: "Text",
    path: "Neutral / Text / subtleleast",
    cssVar: "--theme-neutral-text-subtleleast",
    aliasCssVar: "--neutral-text-subtle-light",
    coreRef: "--core-color-text-tertiary",
    category: "neutral",
    type: "text",
    lightHex: "#787887",
    darkHex: "#9E9EAD",
    paletteNameLight: "Neutral 500",
    paletteNameDark: "Neutral 400",
  },
  {
    id: "neutral-text-subtle",
    name: "subtle",
    displayName: "Subtle",
    group: "Neutral / Text",
    subgroup: "Text",
    path: "Neutral / Text / subtle",
    cssVar: "--theme-neutral-text-subtle",
    aliasCssVar: "--neutral-text-subtle",
    coreRef: "--core-color-text-secondary",
    category: "neutral",
    type: "text",
    lightHex: "#5C5C6B",
    darkHex: "#C4C4CF",
    paletteNameLight: "Neutral 600",
    paletteNameDark: "Neutral 300",
  },
  {
    id: "neutral-text-text",
    name: "text",
    displayName: "Primary Text",
    group: "Neutral / Text",
    subgroup: "Text",
    path: "Neutral / Text / text",
    cssVar: "--theme-neutral-text-primary-default",
    aliasCssVar: "--neutral-text-default",
    coreRef: "--core-color-text-primary",
    category: "neutral",
    type: "text",
    lightHex: "#1D1C24",
    darkHex: "#F7F7F9",
    paletteNameLight: "Neutral 900",
    paletteNameDark: "Neutral 50",
  },

  // Neutral / Border
  {
    id: "neutral-border-inverse",
    name: "inverse",
    displayName: "Inverse",
    group: "Neutral / Border",
    subgroup: "Border",
    path: "Neutral / Border / inverse",
    cssVar: "--theme-neutral-border-inverse",
    aliasCssVar: "--neutral-border-inverse",
    coreRef: "--core-color-neutral-0",
    category: "neutral",
    type: "border",
    lightHex: "#FFFFFF",
    darkHex: "#1D1C24",
    paletteNameLight: "Neutral 0",
    paletteNameDark: "Neutral 900",
  },
  {
    id: "neutral-border-subtle",
    name: "border-subtle",
    displayName: "Border Subtle",
    group: "Neutral / Border",
    subgroup: "Border",
    path: "Neutral / Border / border-subtle",
    cssVar: "--theme-neutral-border-subtle",
    aliasCssVar: "--neutral-border-subtle",
    coreRef: "--core-color-border-subtle",
    category: "neutral",
    type: "border",
    lightHex: "#EEEEF2",
    darkHex: "#2E2D38",
    paletteNameLight: "Neutral 100",
    paletteNameDark: "Neutral 800",
  },
  {
    id: "neutral-border-light",
    name: "border-light",
    displayName: "Border Light",
    group: "Neutral / Border",
    subgroup: "Border",
    path: "Neutral / Border / border-light",
    cssVar: "--theme-neutral-border-primary-default",
    aliasCssVar: "--neutral-border-light",
    coreRef: "--core-color-border-default",
    category: "neutral",
    type: "border",
    lightHex: "#DFDFE6",
    darkHex: "#454452",
    paletteNameLight: "Neutral 200",
    paletteNameDark: "Neutral 700",
  },
  {
    id: "neutral-border-strong",
    name: "border-strong",
    displayName: "Border Strong",
    group: "Neutral / Border",
    subgroup: "Border",
    path: "Neutral / Border / border-strong",
    cssVar: "--theme-neutral-border-strong",
    aliasCssVar: "--neutral-border-strong",
    coreRef: "--core-color-border-strong",
    category: "neutral",
    type: "border",
    lightHex: "#5C5C6B",
    darkHex: "#5C5C6B",
    paletteNameLight: "Neutral 600",
    paletteNameDark: "Neutral 600",
  },

  // ── 5. DISABLED COLORS ──
  {
    id: "disabled-background",
    name: "background",
    displayName: "Background",
    group: "Disabled",
    subgroup: "Disabled",
    path: "Disabled / background",
    cssVar: "--theme-semantics-disabled-background",
    aliasCssVar: "--semantics-disabled-background",
    coreRef: "--core-color-control-disabled-bg",
    category: "disabled",
    type: "background",
    lightHex: "#F7F7F9",
    darkHex: "#F7F7F9",
    paletteNameLight: "Light Grey 50",
    paletteNameDark: "Light Grey 50",
  },
  {
    id: "disabled-border",
    name: "border",
    displayName: "Border",
    group: "Disabled",
    subgroup: "Disabled",
    path: "Disabled / border",
    cssVar: "--theme-semantics-disabled-border",
    aliasCssVar: "--semantics-disabled-border",
    coreRef: "--core-color-control-disabled-border",
    category: "disabled",
    type: "border",
    lightHex: "#454452",
    darkHex: "#454452",
    paletteNameLight: "Light Grey 700",
    paletteNameDark: "Light Grey 700",
  },
  {
    id: "disabled-text",
    name: "text",
    displayName: "Text",
    group: "Disabled",
    subgroup: "Disabled",
    path: "Disabled / text",
    cssVar: "--theme-semantics-disabled-text",
    aliasCssVar: "--semantics-disabled-text",
    coreRef: "--core-color-control-disabled-text",
    category: "disabled",
    type: "text",
    lightHex: "#5C5C6B",
    darkHex: "#5C5C6B",
    paletteNameLight: "Neutral 600",
    paletteNameDark: "Neutral 600",
  },

  // ── 6. CRITICAL COLORS ──
  {
    id: "critical-light-background",
    name: "light-background",
    displayName: "Light Background",
    group: "Critical",
    subgroup: "Critical",
    path: "Critical / light-background",
    cssVar: "--theme-semantics-critical-light-background",
    aliasCssVar: "--semantics-critical-background-light",
    coreRef: "--core-color-status-danger-bg",
    category: "critical",
    type: "background",
    lightHex: "#FDEFEF",
    darkHex: "#3B0B11",
    paletteNameLight: "Danger 50",
    paletteNameDark: "Danger 900",
  },
  {
    id: "critical-border",
    name: "border",
    displayName: "Border",
    group: "Critical",
    subgroup: "Critical",
    path: "Critical / border",
    cssVar: "--theme-semantics-critical-border",
    aliasCssVar: "--semantics-critical-border",
    coreRef: "--core-color-status-danger-border",
    category: "critical",
    type: "border",
    lightHex: "#F4B1B1",
    darkHex: "#8F212A",
    paletteNameLight: "Danger 300",
    paletteNameDark: "Danger 700",
  },
  {
    id: "critical-strong-background",
    name: "strong-background",
    displayName: "Strong Background",
    group: "Critical",
    subgroup: "Critical",
    path: "Critical / strong-background",
    cssVar: "--theme-semantics-critical-strong-background",
    aliasCssVar: "--semantics-critical-background-strong",
    coreRef: "--core-color-danger-600",
    category: "critical",
    type: "background",
    lightHex: "#B72E38",
    darkHex: "#B72E38",
    paletteNameLight: "Danger 600",
    paletteNameDark: "Danger 600",
  },
  {
    id: "critical-text",
    name: "text",
    displayName: "Text",
    group: "Critical",
    subgroup: "Critical",
    path: "Critical / text",
    cssVar: "--theme-semantics-critical-text",
    aliasCssVar: "--semantics-critical-text",
    coreRef: "--core-color-status-danger-text",
    category: "critical",
    type: "text",
    lightHex: "#8F212A",
    darkHex: "#EF8E8E",
    paletteNameLight: "Danger 700",
    paletteNameDark: "Danger 300",
  },

  // ── 6. WARNING COLORS ──
  {
    id: "warning-light-background",
    name: "light-background",
    displayName: "Light Background",
    group: "Warning",
    subgroup: "Warning",
    path: "Warning / light-background",
    cssVar: "--theme-semantics-warning-light-background",
    aliasCssVar: "--semantics-warning-background-light",
    coreRef: "--core-color-status-warning-bg",
    category: "warning",
    type: "background",
    lightHex: "#FFF8EA",
    darkHex: "#382002",
    paletteNameLight: "Warning 50",
    paletteNameDark: "Warning 900",
  },
  {
    id: "warning-border",
    name: "border",
    displayName: "Border",
    group: "Warning",
    subgroup: "Warning",
    path: "Warning / border",
    cssVar: "--theme-semantics-warning-border",
    aliasCssVar: "--semantics-warning-border",
    coreRef: "--core-color-status-warning-border",
    category: "warning",
    type: "border",
    lightHex: "#FCDB94",
    darkHex: "#95590A",
    paletteNameLight: "Warning 300",
    paletteNameDark: "Warning 700",
  },
  {
    id: "warning-strong-background",
    name: "strong-background",
    displayName: "Strong Background",
    group: "Warning",
    subgroup: "Warning",
    path: "Warning / strong-background",
    cssVar: "--theme-semantics-warning-strong-background",
    aliasCssVar: "--semantics-warning-background-strong",
    coreRef: "--core-color-warning-600",
    category: "warning",
    type: "background",
    lightHex: "#C27A10",
    darkHex: "#C27A10",
    paletteNameLight: "Warning 600",
    paletteNameDark: "Warning 600",
  },
  {
    id: "warning-text",
    name: "text",
    displayName: "Text",
    group: "Warning",
    subgroup: "Warning",
    path: "Warning / text",
    cssVar: "--theme-semantics-warning-text",
    aliasCssVar: "--semantics-warning-text",
    coreRef: "--core-color-status-warning-text",
    category: "warning",
    type: "text",
    lightHex: "#95590A",
    darkHex: "#FBCB6B",
    paletteNameLight: "Warning 700",
    paletteNameDark: "Warning 300",
  },

  // ── 7. SUCCESS COLORS ──
  {
    id: "success-light-background",
    name: "light-background",
    displayName: "Light Background",
    group: "Success",
    subgroup: "Success",
    path: "Success / light-background",
    cssVar: "--theme-semantics-success-light-background",
    aliasCssVar: "--semantics-success-background-light",
    coreRef: "--core-color-status-success-bg",
    category: "success",
    type: "background",
    lightHex: "#EDFAF2",
    darkHex: "#052014",
    paletteNameLight: "Success 50",
    paletteNameDark: "Success 900",
  },
  {
    id: "success-border",
    name: "border",
    displayName: "Border",
    group: "Success",
    subgroup: "Success",
    path: "Success / border",
    cssVar: "--theme-semantics-success-border",
    aliasCssVar: "--semantics-success-border",
    coreRef: "--core-color-status-success-border",
    category: "success",
    type: "border",
    lightHex: "#A8E7C6",
    darkHex: "#116840",
    paletteNameLight: "Success 300",
    paletteNameDark: "Success 700",
  },
  {
    id: "success-strong-background",
    name: "strong-background",
    displayName: "Strong Background",
    group: "Success",
    subgroup: "Success",
    path: "Success / strong-background",
    cssVar: "--theme-semantics-success-strong-background",
    aliasCssVar: "--semantics-success-background-strong",
    coreRef: "--core-color-success-600",
    category: "success",
    type: "background",
    lightHex: "#178451",
    darkHex: "#178451",
    paletteNameLight: "Success 600",
    paletteNameDark: "Success 600",
  },
  {
    id: "success-text",
    name: "text",
    displayName: "Text",
    group: "Success",
    subgroup: "Success",
    path: "Success / text",
    cssVar: "--theme-semantics-success-text",
    aliasCssVar: "--semantics-success-text",
    coreRef: "--core-color-status-success-text",
    category: "success",
    type: "text",
    lightHex: "#116840",
    darkHex: "#7EDCAC",
    paletteNameLight: "Success 700",
    paletteNameDark: "Success 300",
  },

  // ── 8. INFO COLORS ──
  {
    id: "info-light-background",
    name: "light-background",
    displayName: "Light Background",
    group: "Info",
    subgroup: "Info",
    path: "Info / light-background",
    cssVar: "--theme-semantics-highlight-light-background",
    aliasCssVar: "--semantics-highlight-background-light",
    coreRef: "--core-color-status-info-bg",
    category: "info",
    type: "background",
    lightHex: "#EBF6FD",
    darkHex: "#061C30",
    paletteNameLight: "Info 50",
    paletteNameDark: "Info 900",
  },
  {
    id: "info-border",
    name: "border",
    displayName: "Border",
    group: "Info",
    subgroup: "Info",
    path: "Info / border",
    cssVar: "--theme-semantics-highlight-border",
    aliasCssVar: "--semantics-highlight-border",
    coreRef: "--core-color-status-info-border",
    category: "info",
    type: "border",
    lightHex: "#A9D8F6",
    darkHex: "#155187",
    paletteNameLight: "Info 300",
    paletteNameDark: "Info 700",
  },
  {
    id: "info-strong-background",
    name: "strong-background",
    displayName: "Strong Background",
    group: "Info",
    subgroup: "Info",
    path: "Info / strong-background",
    cssVar: "--theme-semantics-highlight-strong-background",
    aliasCssVar: "--semantics-highlight-background-strong",
    coreRef: "--core-color-info-600",
    category: "info",
    type: "background",
    lightHex: "#1D6DB0",
    darkHex: "#1D6DB0",
    paletteNameLight: "Info 600",
    paletteNameDark: "Info 600",
  },
  {
    id: "info-text",
    name: "text",
    displayName: "Text",
    group: "Info",
    subgroup: "Info",
    path: "Info / text",
    cssVar: "--theme-semantics-highlight-text",
    aliasCssVar: "--semantics-highlight-text",
    coreRef: "--core-color-status-info-text",
    category: "info",
    type: "text",
    lightHex: "#155187",
    darkHex: "#84C7F1",
    paletteNameLight: "Info 700",
    paletteNameDark: "Info 300",
  },
];

/* Vertical Pillar Segment — canonical token name + resolved hex + WCAG */
function BaseColorPillarSegment({
  token,
  mode,
  contrastBackground,
  isCopied,
  onCopy,
}: {
  token: FigmaTokenItem;
  mode: "light" | "dark";
  contrastBackground: ContrastBackground;
  isCopied: boolean;
  onCopy: (text: string, id: string) => void;
}) {
  const currentHex = mode === "light" ? token.lightHex : token.darkHex;
  const tokenVar = canonicalTokenVar(token);
  const tokenLabel = canonicalTokenName(token);
  const rgb = hexToRgb(currentHex);
  const lum = luminance(rgb.r, rgb.g, rgb.b);
  const { level: contrastLevel } = getContrastResult(currentHex, contrastBackground);
  const failsPageContrast = contrastLevel === "fail";
  // Failing tokens (e.g. light fills on white) need dark on-card labels for ADA.
  // Passing tokens keep luminance-based white/dark text on the swatch.
  const isLight = failsPageContrast
    ? contrastBackground === "white"
    : lum > 0.42;
  const textColor = isLight ? "#1A1A22" : "#FFFFFF";

  const metaColor = isLight ? "rgba(26, 26, 34, 0.72)" : "rgba(255, 255, 255, 0.82)";
  const dividerColor = isLight ? "rgba(26, 26, 34, 0.14)" : "rgba(255, 255, 255, 0.22)";

  return (
    <div
      onClick={() => onCopy(tokenVar, token.id)}
      title={`Click to copy ${tokenVar}`}
      style={{
        background: currentHex,
        color: textColor,
        padding: "14px 14px 12px",
        minHeight: 108,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        gap: 0,
        borderRadius: 12,
        border: `1px solid ${dividerColor}`,
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
        cursor: "pointer",
        position: "relative",
        userSelect: "none",
        transition: "filter 0.15s ease, box-shadow 0.15s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.filter = "brightness(1.04)";
        e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.filter = "none";
        e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.06)";
      }}
    >
      {/* Token name */}
      <div
        style={{
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "-0.01em",
          lineHeight: 1.4,
          color: textColor,
          fontFamily: "var(--site-mono)",
          wordBreak: "break-word",
          marginBottom: 6,
        }}
      >
        {tokenLabel}
      </div>

      {/* Hex value */}
      <div
        style={{
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: "0.02em",
          color: metaColor,
          fontFamily: "var(--site-mono)",
          marginBottom: 10,
        }}
      >
        {currentHex.toUpperCase()}
      </div>

      {/* WCAG contrast — separated from identity block */}
      <div
        style={{
          marginTop: "auto",
          paddingTop: 8,
          borderTop: `1px solid ${dividerColor}`,
        }}
      >
        <WcagContrastIndicator
          hex={currentHex}
          contrastBackground={contrastBackground}
          showUsageHint
          tokenType={token.type}
          onSwatch
          isLightSwatch={isLight}
          layout="stack"
        />
      </div>

      {/* Copied Toast Overlay */}
      {isCopied && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: isLight ? "rgba(255,255,255,0.96)" : "rgba(18,18,24,0.96)",
            color: isLight ? "#111" : "#FFF",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            fontWeight: 700,
            fontSize: 12,
            zIndex: 10,
          }}
        >
          <span style={{ fontSize: 16 }}>✓</span>
          <span>Copied!</span>
        </div>
      )}
    </div>
  );
}

/* Horizontal 2-column grid of full-color swatch cards */
function BaseColorHorizontalCards({
  tokens,
  mode,
  contrastBackground,
  copiedKey,
  onCopy,
}: {
  tokens: FigmaTokenItem[];
  mode: "light" | "dark";
  contrastBackground: ContrastBackground;
  copiedKey: string | null;
  onCopy: (cssVar: string, id: string) => void;
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
        gap: 12,
        width: "100%",
        alignItems: "stretch",
      }}
    >
      {tokens.map((token) => (
        <BaseColorPillarSegment
          key={token.id}
          token={token}
          mode={mode}
          contrastBackground={contrastBackground}
          isCopied={copiedKey === token.id}
          onCopy={onCopy}
        />
      ))}
    </div>
  );
}

interface EditorialColorGroup {
  id: string;
  eyebrow: string;
  title: string;
  category: "primary" | "secondary" | "tertiary" | "neutral" | "disabled" | "critical" | "warning" | "success" | "info";
  pillars: Array<{
    subgroup: string;
    tokens: FigmaTokenItem[];
  }>;
}

function BaseColorsRedesignedSection() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [activeMode, setActiveMode] = useState<"light" | "dark">("light");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [copiedVarName, setCopiedVarName] = useState<string | null>(null);

  const copyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setCopiedVarName(text);
    setTimeout(() => {
      setCopiedKey((curr) => (curr === id ? null : curr));
      setCopiedVarName((curr) => (curr === text ? null : curr));
    }, 2200);
  };

  // 1. Primary Pillars (Text, Background, Borders)
  const primaryPillars = ["Text", "Background", "Borders"].map((subgroup) => ({
    subgroup,
    tokens: FIGMA_BASE_TOKENS.filter((t) => t.category === "primary" && t.subgroup === subgroup),
  }));

  // 2. Secondary Pillars (Text, Background, Borders)
  const secondaryPillars = ["Text", "Background", "Borders"].map((subgroup) => ({
    subgroup,
    tokens: FIGMA_BASE_TOKENS.filter((t) => t.category === "secondary" && t.subgroup === subgroup),
  }));

  // 3. Tertiary Pillars (Text, Background, Borders)
  const tertiaryPillars = ["Text", "Background", "Borders"].map((subgroup) => ({
    subgroup,
    tokens: FIGMA_BASE_TOKENS.filter((t) => t.category === "tertiary" && t.subgroup === subgroup),
  }));

  // 4. Neutral Pillars (Text, Border)
  const neutralPillars = ["Text", "Border"].map((subgroup) => ({
    subgroup,
    tokens: FIGMA_BASE_TOKENS.filter((t) => t.category === "neutral" && t.subgroup === subgroup),
  }));

  const semanticFamilyPillars = (category: FigmaTokenItem["category"]) => [
    {
      subgroup: "Default",
      tokens: FIGMA_BASE_TOKENS.filter((t) => t.category === category),
    },
  ];

  // 5–9. Semantic family pillars (Default only)
  const disabledPillars = semanticFamilyPillars("disabled");
  const criticalPillars = semanticFamilyPillars("critical");
  const warningPillars = semanticFamilyPillars("warning");
  const successPillars = semanticFamilyPillars("success");
  const infoPillars = semanticFamilyPillars("info");

  const editorialGroups: EditorialColorGroup[] = [
    {
      id: "primary",
      eyebrow: "Colors",
      title: "Brand",
      category: "primary",
      pillars: primaryPillars,
    },
    {
      id: "secondary",
      eyebrow: "Colors",
      title: "Secondary Colors",
      category: "secondary",
      pillars: secondaryPillars,
    },
    {
      id: "tertiary",
      eyebrow: "Colors",
      title: "Tertiary Colors",
      category: "tertiary",
      pillars: tertiaryPillars,
    },
    {
      id: "neutral",
      eyebrow: "Colors",
      title: "Neutral Colors",
      category: "neutral",
      pillars: neutralPillars,
    },
    {
      id: "disabled",
      eyebrow: "Colors",
      title: "Disabled Colors",
      category: "disabled",
      pillars: disabledPillars,
    },
    {
      id: "critical",
      eyebrow: "Colors",
      title: "Critical Colors",
      category: "critical",
      pillars: criticalPillars,
    },
    {
      id: "warning",
      eyebrow: "Colors",
      title: "Warning Colors",
      category: "warning",
      pillars: warningPillars,
    },
    {
      id: "success",
      eyebrow: "Colors",
      title: "Success Colors",
      category: "success",
      pillars: successPillars,
    },
    {
      id: "info",
      eyebrow: "Colors",
      title: "Info Colors",
      category: "info",
      pillars: infoPillars,
    },
  ];

  // Filter groups
  const filteredGroups = editorialGroups
    .filter((g) => {
      if (activeCategory === "all") return true;
      return activeCategory === g.category;
    });

  const contrastBackground: ContrastBackground = activeMode === "light" ? "white" : "black";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      <WcagLegend style={{ padding: "0 4px" }} />
      {/* Control header: Filters, Search, and Light/Dark Mode Switcher */}
      <div
        style={{
          background: "var(--site-bg-elevated)",
          borderRadius: 16,
          border: "1px solid var(--site-border)",
          padding: "16px 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        {/* Category Filter */}
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          <span style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--site-text-faint)", marginRight: 4 }}>
            Filter:
          </span>
          {[
            { id: "all", label: "All Groups" },
            { id: "primary", label: "Brand" },
            { id: "secondary", label: "Secondary" },
            { id: "tertiary", label: "Tertiary" },
            { id: "neutral", label: "Neutral" },
            { id: "disabled", label: "Disabled" },
            { id: "critical", label: "Critical" },
            { id: "warning", label: "Warning" },
            { id: "success", label: "Success" },
            { id: "info", label: "Info" },
          ].map((cat) => {
            const active = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                style={{
                  padding: "6px 14px",
                  borderRadius: 20,
                  fontSize: "var(--typography-font-size-xs)",
                  fontWeight: active ? 600 : 500,
                  border: active ? "1px solid var(--site-accent, #0270A9)" : "1px solid var(--site-border)",
                  background: active ? "var(--site-accent-soft, rgba(2,112,169,0.12))" : "transparent",
                  color: active ? "var(--site-accent, #0270A9)" : "var(--site-text-dim)",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Light / Dark Mode Toggle */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--site-bg)", padding: "4px 10px", borderRadius: 24, border: "1px solid var(--site-border)" }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: activeMode === "light" ? "var(--site-text)" : "var(--theme-neutral-text-subtle)" }}>Light</span>
            <button
              type="button"
              onClick={() => setActiveMode(activeMode === "light" ? "dark" : "light")}
              style={{
                width: 40,
                height: 22,
                borderRadius: 11,
                background: activeMode === "light" ? "var(--theme-neutral-border-strong)" : "var(--theme-brand-background-primary-strong)",
                border: "none",
                position: "relative",
                cursor: "pointer",
                padding: 0,
                transition: "background 0.25s",
              }}
              aria-label="Toggle preview mode"
            >
              <div
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: 9,
                  background: "var(--theme-colors-neutral-0)",
                  position: "absolute",
                  top: 2,
                  left: activeMode === "light" ? 2 : 20,
                  transition: "left 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
                }}
              />
            </button>
            <span style={{ fontSize: 12, fontWeight: 600, color: activeMode === "dark" ? "var(--site-text)" : "var(--theme-neutral-text-subtle)" }}>Dark</span>
          </div>
          <span style={{ fontSize: "var(--typography-font-size-xs)", color: "var(--site-text-faint)" }}>
            Contrast vs {contrastBackground}
          </span>
        </div>
      </div>

      {/* Editorial Group Cards matching the inspiration screenshot */}
      <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
        {filteredGroups.map((group) => (
          <div
            key={group.id}
            style={{
              background: "var(--site-bg-elevated, #FFFFFF)",
              borderRadius: 24,
              padding: "40px 40px 36px",
              border: "1px solid var(--site-border)",
              boxShadow: "0 4px 24px rgba(0,0,0,0.03)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              flexWrap: "wrap",
              gap: 40,
            }}
          >
            {/* Left column: Eyebrow + Title + Narrative + Action pill button */}
            <div style={{ flex: "0 0 270px", minWidth: 220, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                {/* Eyebrow */}
                <div
                  style={{
                    fontSize: "var(--typography-font-size-xs)",
                    fontWeight: 600,
                    color: "var(--site-text-dim)",
                    marginBottom: 8,
                    letterSpacing: "-0.01em",
                  }}
                >
                  {group.eyebrow}
                </div>

                {/* Section Title */}
                <h3
                  style={{
                    fontSize: 28,
                    fontWeight: 700,
                    letterSpacing: "-0.025em",
                    lineHeight: 1.15,
                    color: "var(--site-text, #111)",
                    margin: "0 0 18px 0",
                  }}
                >
                  {group.title}
                </h3>

              </div>

              {/* Mode indicator footer */}
              <div style={{ marginTop: 28 }}>
                <span
                  style={{
                    fontSize: "var(--typography-font-size-xs)",
                    fontFamily: "var(--site-mono)",
                    fontWeight: 600,
                    padding: "4px 10px",
                    borderRadius: 8,
                    background: "rgba(128,128,128,0.08)",
                    color: "var(--site-text-dim)",
                  }}
                >
                  {group.pillars.reduce((acc, p) => acc + p.tokens.length, 0)} tokens · {activeMode.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Right column: horizontal 2-column swatch cards */}
            <div
              style={{
                flex: "1 1 500px",
                minWidth: 320,
                display: "flex",
                alignItems: "flex-start",
              }}
            >
              <BaseColorHorizontalCards
                tokens={group.pillars.flatMap((pillar) => pillar.tokens)}
                mode={activeMode}
                contrastBackground={contrastBackground}
                copiedKey={copiedKey}
                onCopy={copyText}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Floating Copied Notification */}
      {copiedVarName && (
        <div
          style={{
            position: "fixed",
            bottom: 24,
            right: 24,
            background: "#1E1E24",
            color: "#FFFFFF",
            padding: "12px 20px",
            borderRadius: 12,
            boxShadow: "0 8px 30px rgba(0,0,0,0.25)",
            fontSize: "var(--typography-font-size-xs)",
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: 10,
            zIndex: 9999,
          }}
        >
          <span style={{ color: "#34D399", fontSize: 16 }}>✓</span>
          <span>Copied to clipboard:</span>
          <span style={{ fontFamily: "var(--site-mono)", color: "#93C5FD" }}>{copiedVarName}</span>
        </div>
      )}
    </div>
  );
}

/* ── end Figma Aligned Base Color Variables ─────────────────────────────── */

const BRAND_PALETTE_OVERVIEW = [
  {
    id: "primary",
    label: "Primary",
    hex: color?.brand?.["500"] as string,
  },
  {
    id: "secondary",
    label: "Secondary",
    hex: color?.secondary?.["500"] as string,
  },
  {
    id: "tertiary",
    label: "Tertiary",
    hex: color?.tertiary?.["500"] as string,
  },
] as const;

function BrandPaletteOverviewCard({
  label,
  hex,
  onCopy,
  copied,
}: {
  label: string;
  hex: string;
  onCopy: (text: string) => void;
  copied: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      type="button"
      onClick={() => onCopy(hex)}
      title={`Click to copy ${hex}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        flex: "1 1 0",
        minWidth: 140,
        maxWidth: 200,
        padding: 0,
        border: "1px solid var(--site-border)",
        borderRadius: 14,
        overflow: "hidden",
        background: "var(--site-bg-elevated, #fff)",
        cursor: "pointer",
        textAlign: "left",
        boxShadow: hovered
          ? "0 6px 20px rgba(0,0,0,0.08)"
          : "0 1px 6px rgba(0,0,0,0.04)",
        transform: hovered ? "translateY(-2px)" : "none",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
      }}
    >
      <div
        style={{
          position: "relative",
          height: 72,
          background: hex,
          width: "100%",
        }}
        aria-hidden="true"
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(180deg, transparent 55%, rgba(0,0,0,0.06) 100%)",
            pointerEvents: "none",
          }}
        />
        {copied && (
          <div
            style={{
              position: "absolute",
              top: 8,
              right: 8,
              padding: "4px 8px",
              borderRadius: 999,
              background: "rgba(255,255,255,0.94)",
              color: "var(--core-color-status-success-text, #178451)",
              fontSize: "var(--typography-font-size-xs)",
              fontWeight: 700,
              boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
            }}
          >
            Copied
          </div>
        )}
      </div>

      <div
        style={{
          padding: "12px 14px 14px",
          display: "flex",
          flexDirection: "column",
          gap: 4,
        }}
      >
        <div
          style={{
            fontSize: "var(--typography-body-md-size)",
            fontWeight: 700,
            color: "var(--site-text)",
            letterSpacing: "-0.02em",
            lineHeight: 1.2,
          }}
        >
          {label}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 8,
          }}
        >
          <span
            style={{
              fontSize: "var(--typography-font-size-xs)",
              fontFamily: "var(--site-mono)",
              fontWeight: 600,
              color: "var(--site-text-dim)",
              letterSpacing: "0.03em",
            }}
          >
            {hex.toUpperCase()}
          </span>
          <span
            style={{
              fontSize: "var(--typography-font-size-xs)",
              fontWeight: 600,
              color: copied
                ? "var(--theme-semantics-success-text)"
                : hovered
                  ? "var(--theme-primitive-color-primary-600)"
                  : "var(--theme-neutral-text-subtle)",
              transition: "color 0.15s ease",
              whiteSpace: "nowrap",
            }}
          >
            {copied ? "Copied!" : "Copy"}
          </span>
        </div>
      </div>
    </button>
  );
}

function BrandPaletteOverview() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string, hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedId(id);
    setTimeout(() => setCopiedId((curr) => (curr === id ? null : curr)), 2000);
  };

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 16,
        justifyContent: "center",
        maxWidth: 680,
        width: "100%",
        margin: "40px auto 56px",
        padding: "0 4px",
      }}
    >
      {BRAND_PALETTE_OVERVIEW.map((item) => (
        <BrandPaletteOverviewCard
          key={item.id}
          label={item.label}
          hex={item.hex}
          copied={copiedId === item.id}
          onCopy={() => handleCopy(item.id, item.hex)}
        />
      ))}
    </div>
  );
}

export default function Color() {
  const sections = [
    {
      id: "01",
      anchorId: "full-color-scales",
      title: "Full color scales",
      content: <FullColorScalesSection />,
    },
    {
      id: "02",
      anchorId: "base-colors",
      title: "Base colors",
      content: (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <BaseColorsRedesignedSection />
        </div>
      )
    }
  ];

  function generateSiteScssPalette(): string {
    const brand = color?.brand || {};
    const secondary = color?.secondary || {};
    const tertiary = color?.tertiary || {};
    const neutral = color?.neutral || {};
    const success = color?.success || {};
    const danger = color?.danger || {};
    const info = color?.info || {};
    const warning = color?.warning || {};

    const sortScale = (obj: any) =>
      Object.entries(obj).sort(([a], [b]) => parseInt(a, 10) - parseInt(b, 10));

    const brandLines = sortScale(brand).map(([k, v]) => `  --theme-primitive-color-primary-${k}: ${v};`).join("\n");
    const secLines = sortScale(secondary).map(([k, v]) => `  --theme-primitive-color-secondary-${k}: ${v};`).join("\n");
    const tertLines = sortScale(tertiary).map(([k, v]) => `  --theme-primitive-color-tertiary-${k}: ${v};`).join("\n");
    const succLines = sortScale(success).map(([k, v]) => `  --theme-colors-success-${k}: ${v};`).join("\n");
    const neutralScaleLines = sortScale(neutral)
      .filter(([k]) => k !== "0")
      .map(([k, v]) => `  --theme-colors-neutral-${k}: ${v};`);
    const neutralLines = [
      `  --theme-colors-neutral-white: #FFFFFF;`,
      `  --theme-colors-neutral-grey-black: #000000;`,
      `  --theme-colors-neutral-0: #FFFFFF;`,
      ...neutralScaleLines,
    ].join("\n");
    const redLines = sortScale(danger).map(([k, v]) => `  --theme-colors-red-${k}: ${v};`).join("\n");
    const infoLines = sortScale(info).map(([k, v]) => `  --theme-colors-info-${k}: ${v};`).join("\n");
    const warnLines = sortScale(warning).map(([k, v]) => `  --theme-colors-warning-${k}: ${v};`).join("\n");

    return `/**
 * CORE DESIGN SYSTEM — THEME COLOR & FIGMA BASE VARIABLES
 */

:root {
  /* ---------------------------------------------------------------------------------- */
  /* Primitive Scale Colors */
  /* ---------------------------------------------------------------------------------- */

  /* Primary (Brand) colors ----------------------------------------------------------*/
${brandLines}

  /* Secondary colors ----------------------------------------------------------------*/
${secLines}

  /* Tertiary colors -----------------------------------------------------------------*/
${tertLines}

  /* Success -------------------------------------------------------------------------*/
${succLines}

  /* Neutral (Grey) colors -----------------------------------------------------------*/
${neutralLines}

  /* Red (Danger) --------------------------------------------------------------------*/
${redLines}

  /* Info ----------------------------------------------------------------------------*/
${infoLines}

  /* Warning -------------------------------------------------------------------------*/
${warnLines}
}

${semanticPaletteScss.trim()}
`;
  }

  const handleDownloadPalette = (e: React.MouseEvent) => {
    e.preventDefault();
    const scssText = generateSiteScssPalette();
    const dataUri = `data:text/x-scss;charset=utf-8,${encodeURIComponent(scssText)}`;
    const link = document.createElement("a");
    link.href = dataUri;
    link.download = "Core-Color-Palette.scss";
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
          Colors
        </h1>
        <p style={{ maxWidth: 560, margin: "0 auto", color: "var(--core-color-text-tertiary)", fontSize: 18, lineHeight: 1.6, fontWeight: 400 }}>
          The complete color system — base colors that define what each hue is for, semantic tokens that resolve in light and dark mode, and the full primitive scales they're built from.
        </p>
        <div style={{ marginTop: 32, display: "flex", justifyContent: "center" }}>
          <button
            type="button"
            onClick={handleDownloadPalette}
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
            <span style={{ fontSize: 18 }}>⬇</span> Download SCSS Palette
          </button>
        </div>
      </div>

      <BrandPaletteOverview />

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
