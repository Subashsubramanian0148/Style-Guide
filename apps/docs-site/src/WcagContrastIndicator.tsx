import React from "react";
import { contrastRatio, wcagLevel, type WcagLevel } from "./lib/contrast";

export type ContrastBackground = "white" | "black";

const BG_HEX: Record<ContrastBackground, string> = {
  white: "#FFFFFF",
  black: "#000000",
};

const STATUS: Record<
  WcagLevel,
  { label: string; icon: "check" | "warn" | "fail"; colorVar: string }
> = {
  aaa: { label: "AAA", icon: "check", colorVar: "var(--core-color-status-success-text, #1F7A4D)" },
  aa: { label: "AA", icon: "check", colorVar: "var(--core-color-status-success-text, #1F7A4D)" },
  "aa-large": { label: "AA Large", icon: "warn", colorVar: "var(--core-color-status-warning-text, #9A6700)" },
  fail: { label: "Fail", icon: "fail", colorVar: "var(--core-color-status-danger-text, #B42318)" },
};

function StatusIcon({ kind, color }: { kind: "check" | "warn" | "fail"; color: string }) {
  if (kind === "check") {
    return (
      <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true" style={{ flexShrink: 0 }}>
        <path
          d="M2.5 6.2 4.8 8.5 9.5 3.8"
          fill="none"
          stroke={color}
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  if (kind === "warn") {
    return (
      <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true" style={{ flexShrink: 0 }}>
        <circle cx="6" cy="6" r="4.5" fill="none" stroke={color} strokeWidth="1.4" />
        <path d="M6 4.2v2.2M6 8.1h.01" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true" style={{ flexShrink: 0 }}>
      <path
        d="M3.5 3.5 8.5 8.5M8.5 3.5 3.5 8.5"
        fill="none"
        stroke={color}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function contrastUsageHint(
  level: WcagLevel,
  options: { contrastBackground: ContrastBackground; tokenType?: "text" | "background" | "border" }
): string {
  const surface = options.contrastBackground === "white" ? "white" : "black";
  const { tokenType } = options;

  if (tokenType === "border") {
    return level === "fail"
      ? "Below 3:1 non-text minimum"
      : level === "aa-large"
        ? "Meets 3:1 UI boundary"
        : "Strong UI boundary";
  }
  if (tokenType === "background") {
    if (level === "fail" || level === "aa-large") return "Background / surface";
    return "Background";
  }
  if (level === "fail") return "Not suitable for text";
  if (level === "aa-large") return `Large text on ${surface}`;
  if (level === "aa" || level === "aaa") return `Text on ${surface}`;
  return "Background";
}

export function getContrastResult(hex: string, contrastBackground: ContrastBackground) {
  const ratio = contrastRatio(hex, BG_HEX[contrastBackground]);
  const level = wcagLevel(ratio);
  return { ratio, level, status: STATUS[level] };
}

export function WcagLegend({ style }: { style?: React.CSSProperties }) {
  const items = [
    { label: "AA ≥ 4.5:1", level: "aa" as const },
    { label: "AAA ≥ 7:1", level: "aaa" as const },
    { label: "AA Large ≥ 3:1", level: "aa-large" as const },
    { label: "Fail < 3:1", level: "fail" as const },
  ];

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        gap: "6px 10px",
        fontSize: "var(--typography-font-size-xs)",
        color: "var(--core-color-text-secondary)",
        ...style,
      }}
      aria-label="WCAG contrast legend"
    >
      {items.map((item, index) => (
        <React.Fragment key={item.label}>
          {index > 0 && (
            <span aria-hidden="true" style={{ color: "var(--site-text-faint)" }}>
              ·
            </span>
          )}
          <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
            <StatusIcon kind={STATUS[item.level].icon} color={STATUS[item.level].colorVar} />
            {item.label}
          </span>
        </React.Fragment>
      ))}
    </div>
  );
}

export function ContrastBasisNote({ contrastBackground }: { contrastBackground: ContrastBackground }) {
  const surface = contrastBackground === "white" ? "white" : "black";

  return (
    <p
      style={{
        margin: 0,
        fontSize: "var(--typography-font-size-xs)",
        lineHeight: 1.4,
        color: "var(--core-color-text-secondary)",
      }}
    >
      Each shade as text on {surface} · WCAG 2.x ratio
    </p>
  );
}

export function ContrastAgainstControl({
  value,
  onChange,
}: {
  value: ContrastBackground;
  onChange: (value: ContrastBackground) => void;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
      <span
        style={{
          fontSize: "var(--typography-font-size-xs)",
          fontWeight: 600,
          color: "var(--core-color-text-secondary)",
        }}
      >
        Text on
      </span>
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 4,
          padding: 3,
          borderRadius: "var(--core-radius-sm)",
          border: "1px solid var(--site-border)",
          background: "var(--site-bg)",
        }}
      >
        {(["white", "black"] as const).map((option) => {
          const active = value === option;
          return (
            <button
              key={option}
              type="button"
              onClick={() => onChange(option)}
              aria-pressed={active}
              style={{
                padding: "5px 12px",
                borderRadius: 4,
                border: "none",
                fontSize: "var(--typography-font-size-xs)",
                fontWeight: active ? 600 : 500,
                background: active ? "var(--core-color-surface-default)" : "transparent",
                color: active ? "var(--core-color-text-primary)" : "var(--core-color-text-secondary)",
                cursor: "pointer",
                boxShadow: active ? "0 1px 2px rgba(0,0,0,0.06)" : "none",
              }}
            >
              {option === "white" ? "White" : "Black"}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function WcagContrastIndicator({
  hex,
  contrastBackground = "white",
  showUsageHint = false,
  tokenType,
  onSwatch = false,
  isLightSwatch,
  layout = "inline",
  passFailBelow = false,
}: {
  hex: string;
  contrastBackground?: ContrastBackground;
  showUsageHint?: boolean;
  tokenType?: "text" | "background" | "border";
  onSwatch?: boolean;
  isLightSwatch?: boolean;
  layout?: "inline" | "stack";
  /** Full color scales: ratio on top, Pass/Fail label below */
  passFailBelow?: boolean;
}) {
  const { ratio, level, status } = getContrastResult(hex, contrastBackground);
  const usageHint = showUsageHint
    ? contrastUsageHint(level, { contrastBackground, tokenType })
    : null;

  const onSwatchAdaptive = onSwatch && isLightSwatch !== undefined;

  const pillBackground = onSwatchAdaptive
    ? isLightSwatch
      ? "rgba(255,255,255,0.88)"
      : "rgba(18,18,24,0.72)"
    : "transparent";

  /** Foreground on a colored swatch — black on light fills, white on dark fills. */
  const swatchTextColor = onSwatchAdaptive
    ? isLightSwatch
      ? "#1A1A22"
      : "#FFFFFF"
    : "var(--core-color-text-primary)";

  const textColor = swatchTextColor;

  const ratioIconColor = onSwatchAdaptive
    ? isLightSwatch
      ? status.colorVar
      : swatchTextColor
    : status.colorVar;
  const ratioNumberColor = onSwatchAdaptive ? swatchTextColor : "var(--core-color-text-primary)";
  const labelColor = onSwatchAdaptive
    ? isLightSwatch
      ? status.colorVar
      : swatchTextColor
    : status.colorVar;

  const ratioLine = (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 3 }}>
      <StatusIcon kind={status.icon} color={ratioIconColor} />
      <span
        style={{
          fontFamily: "var(--site-mono)",
          fontWeight: 700,
          color: ratioNumberColor,
        }}
      >
        {ratio.toFixed(1)}:1
      </span>
    </span>
  );

  const labelLine = (
    <span style={{ color: labelColor, fontWeight: 600 }}>{status.label}</span>
  );

  const passFailLabel = level === "fail" ? "Fail" : "Pass";
  const passFailColor =
    level === "fail"
      ? "var(--core-color-status-danger-text, #B42318)"
      : "var(--core-color-status-success-text, #1F7A4D)";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: onSwatch ? "flex-start" : "center",
        gap: layout === "stack" ? 2 : 2,
        width: layout === "stack" ? "100%" : undefined,
      }}
      title={`${ratio.toFixed(2)}:1 · WCAG ${status.label}`}
    >
      {layout === "stack" ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: onSwatch ? "flex-start" : "center",
            gap: onSwatch ? 4 : 2,
            width: "100%",
            fontSize: 10,
            lineHeight: 1.3,
            color: textColor,
          }}
        >
          {passFailBelow ? (
            <>
              {ratioLine}
              <span style={{ color: passFailColor, fontWeight: 700, fontSize: 10 }}>
                {passFailLabel}
              </span>
            </>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              {ratioLine}
              {labelLine}
            </div>
          )}
        </div>
      ) : (
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            padding: onSwatch ? "2px 6px" : 0,
            borderRadius: 4,
            background: pillBackground,
            fontSize: "var(--typography-font-size-xs)",
            fontWeight: 600,
            color: textColor,
            lineHeight: 1.3,
            whiteSpace: "nowrap",
          }}
        >
          {ratioLine}
          <span aria-hidden="true" style={{ color: "var(--core-color-text-tertiary)" }}>
            ·
          </span>
          {labelLine}
        </span>
      )}
      {usageHint && (
        <span
          style={{
            fontSize: 10,
            fontWeight: 500,
            marginTop: onSwatch ? 2 : 0,
            color: onSwatch
              ? isLightSwatch
                ? "rgba(26,26,34,0.62)"
                : "rgba(255,255,255,0.68)"
              : "var(--core-color-text-tertiary)",
            lineHeight: 1.35,
          }}
        >
          {usageHint}
        </span>
      )}
    </div>
  );
}
