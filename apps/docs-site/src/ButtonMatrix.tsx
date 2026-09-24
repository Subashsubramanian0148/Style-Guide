import React, { useState } from "react";
import { Button, ButtonVariant } from "../../../packages/core/src/components/Button";
import { usePreviewMode } from "./PreviewModeContext";

export type MatrixSize = "sm" | "md" | "lg";
export type VariantCategory = "all" | "brand" | "semantics" | "neutral";

interface StateStyle {
  bg: string;
  text: string;
  border?: string;
  extraStyles?: React.CSSProperties;
}

interface VariantConfig {
  id: ButtonVariant;
  name: string;
  category: "brand" | "semantics" | "neutral";
  stateTokens: Record<"default" | "hover" | "active" | "focused" | "disabled", StateStyle>;
}

/* Every value below is a mode-aware semantic token, so light/dark is resolved
   by CSS. Earlier this map held raw primitives plus hex fallbacks and the
   component patched dark mode in JS — which is why Tertiary's text stayed
   primary-500 (2.3:1) on the dark canvas. */
const FOCUS_RING: React.CSSProperties = {
  outline: "var(--core-focusRing-width) solid var(--theme-primitive-color-primary-400)",
  outlineOffset: "var(--core-focusRing-offset)",
};

const VARIANTS: VariantConfig[] = [
  {
    id: "primary",
    name: "Primary CTA",
    category: "brand",
    stateTokens: {
      default: {
        bg: "var(--brand-background-primary-strong)",
        text: "var(--brand-text-primary-oncolor)",
        border: "var(--brand-border-primary-default)",
      },
      hover: {
        bg: "var(--brand-background-primary-hover)",
        text: "var(--brand-text-primary-oncolor)",
        border: "var(--brand-border-primary-hover)",
      },
      active: {
        bg: "var(--brand-background-primary-active)",
        text: "var(--brand-text-primary-oncolor)",
        border: "var(--brand-background-primary-active)",
        extraStyles: { transform: "translateY(1px)" },
      },
      focused: {
        bg: "var(--brand-background-primary-strong)",
        text: "var(--brand-text-primary-oncolor)",
        border: "var(--brand-border-primary-default)",
        extraStyles: FOCUS_RING,
      },
      disabled: {
        bg: "var(--brand-background-primary-disabled)",
        text: "var(--brand-text-primary-disabled)",
        border: "var(--brand-border-primary-disabled)",
      },
    },
  },
  {
    id: "secondary",
    name: "Secondary CTA",
    category: "brand",
    stateTokens: {
      // text-primary-on-surface: brand-colored in light, white in dark — a
      // brand hue at any step read under 4.5:1 (WCAG 1.4.3) against the
      // near-black dark canvas since there's no fill behind it to boost
      // contrast against.
      default: {
        bg: "transparent",
        text: "var(--brand-text-primary-on-surface)",
        border: "var(--brand-border-primary-default)",
      },
      // Outline convention (shadcn `outline` / Chakra `outline`): hover/active
      // stay a translucent wash of the brand color, never Primary's opaque
      // fill — color-mix against `transparent` composites over the canvas
      // directly, so one pair of percentages reads correctly in both light
      // and dark. Active is a deeper wash than hover so the two states are
      // never visually equal to each other or to Primary.
      hover: {
        bg: "color-mix(in srgb, var(--brand-background-primary-strong) 12%, transparent)",
        text: "var(--brand-text-primary-hover)",
        border: "var(--brand-border-primary-hover)",
      },
      active: {
        bg: "color-mix(in srgb, var(--brand-background-primary-strong) 24%, transparent)",
        text: "var(--brand-text-primary-active)",
        // Not background-primary-active — that step is tuned to contrast
        // against an opaque canvas, but this border sits against the
        // translucent active wash instead; in dark mode the two converge
        // toward the same hue (1.48:1, failing WCAG 1.4.11's 3:1). -hover
        // is a lighter step chosen to clear 3:1 against the wash.
        border: "var(--brand-border-primary-hover)",
        extraStyles: { transform: "translateY(1px)" },
      },
      focused: {
        bg: "transparent",
        text: "var(--brand-text-primary-on-surface)",
        border: "var(--brand-border-primary-default)",
        extraStyles: FOCUS_RING,
      },
      // Outline/ghost styles have no fill to mute, so a same-hue disabled step
      // reads as identical to default — neutral is the only legible signal.
      disabled: {
        bg: "transparent",
        text: "var(--theme-semantics-disabled-text)",
        border: "var(--theme-semantics-disabled-border)",
      },
    },
  },
  {
    id: "tertiary",
    name: "Tertiary CTA",
    category: "brand",
    stateTokens: {
      default: { bg: "transparent", text: "var(--brand-text-primary-on-surface)" },
      // Ghost/text convention (shadcn `ghost`+`link` / Chakra `ghost` / MUI
      // `text`): never a border, never an opaque fill — only a faint wash
      // that deepens on press, lighter than Secondary's so the two variants
      // stay visually distinct at every state, plus the underline that
      // marks this as a "text" action rather than a boxed one.
      hover: {
        bg: "color-mix(in srgb, var(--brand-background-primary-strong) 8%, transparent)",
        text: "var(--brand-text-primary-hover)",
      },
      active: {
        bg: "color-mix(in srgb, var(--brand-background-primary-strong) 16%, transparent)",
        text: "var(--brand-text-primary-active)",
        extraStyles: { transform: "translateY(1px)" },
      },
      focused: {
        bg: "transparent",
        text: "var(--brand-text-primary-on-surface)",
        extraStyles: FOCUS_RING,
      },
      disabled: { bg: "transparent", text: "var(--theme-semantics-disabled-text)" },
    },
  },
];

export function ButtonMatrix() {
  const [size, setSize] = useState<MatrixSize>("md");
  const { mode: canvasBg } = usePreviewMode();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const sizeLabels: Record<MatrixSize, string> = {
    sm: "Small",
    md: "Medium",
    lg: "Large",
  };
  const buttonText = sizeLabels[size];

  const handleCopy = (variantId: string, state: string) => {
    const stateProp = state === "disabled" ? " disabled" : "";
    const sizeProp = size === "md" ? "" : ` size="${size}"`;
    const code = `<Button variant="${variantId}"${sizeProp}${stateProp}>${buttonText}</Button>`;
    navigator.clipboard.writeText(code);
    setCopiedCode(`${variantId} (${state}) copied!`);
    setTimeout(() => setCopiedCode(null), 1800);
  };

  const sizeStyles = {
    sm: {
      padding: "var(--core-space-2) var(--core-space-3)",
      minHeight: "var(--core-size-control-sm)",
      fontSize: "var(--typography-text12-semibold-size)",
      lineHeight: "var(--typography-text12-semibold-line-height)",
      radius: "var(--core-radius-sm)",
    },
    md: {
      padding: "var(--core-space-2) var(--core-space-3)",
      minHeight: "var(--core-size-control-md)",
      fontSize: "var(--typography-text14-semibold-size)",
      lineHeight: "var(--typography-text14-semibold-line-height)",
      radius: "var(--core-radius-sm)",
    },
    lg: {
      padding: "var(--core-space-3) var(--core-space-4)",
      minHeight: "var(--core-size-control-lg)",
      fontSize: "var(--typography-text16-semibold-size)",
      lineHeight: "var(--typography-text16-semibold-line-height)",
      radius: "var(--core-radius-sm)",
    },
  }[size];

  const statesList: Array<{ key: "default" | "hover" | "active" | "focused" | "disabled"; label: string }> = [
    { key: "default", label: "Default" },
    { key: "hover", label: "Hover" },
    { key: "active", label: "Active" },
    { key: "focused", label: "Focused" },
    { key: "disabled", label: "Disabled" },
  ];

  const getButtonStyles = (
    variant: VariantConfig,
    stateKey: "default" | "hover" | "active" | "focused" | "disabled"
  ): React.CSSProperties => {
    const tok = variant.stateTokens[stateKey];
    const isTertiaryLinkState = variant.id === "tertiary" && (stateKey === "hover" || stateKey === "active");

    return {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      minWidth: size === "sm" ? 110 : size === "md" ? 130 : 150,
      boxSizing: "border-box",
      padding: sizeStyles.padding,
      minHeight: sizeStyles.minHeight,
      fontSize: sizeStyles.fontSize,
      lineHeight: sizeStyles.lineHeight,
      fontWeight: 600,
      borderRadius: sizeStyles.radius,
      fontFamily: "var(--typography-font-family-sans)",
      cursor: stateKey === "disabled" ? "not-allowed" : "pointer",
      border: `1px solid ${tok.border ?? "transparent"}`,
      background: tok.bg,
      color: tok.text,
      transition: "all 140ms ease",
      userSelect: "none",
      textDecoration: isTertiaryLinkState ? "underline" : "none",
      textUnderlineOffset: isTertiaryLinkState ? "4px" : undefined,
      textDecorationThickness: isTertiaryLinkState ? "2px" : undefined,
      textDecorationColor: isTertiaryLinkState ? "currentColor" : undefined,
      whiteSpace: "nowrap",
      ...tok.extraStyles,
    };
  };

  return (
    <div style={{ marginTop: 12, marginBottom: 32 }}>
      {/* Interactive Control Toolbar — size only; light/dark now comes from
          the single site-wide toggle in the sidebar (PreviewModeContext). */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: "var(--core-space-3)",
          background: "var(--site-bg-elevated)",
          border: "1px solid var(--site-border)",
          borderRadius: 14,
          padding: "var(--core-space-3) var(--core-space-5)",
          marginBottom: 18,
          boxShadow: "var(--core-elevation-2)",
        }}
      >
        <span style={{ fontSize: "var(--typography-font-size-xs)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--theme-neutral-text-subtle)" }}>
          Size:
        </span>
        <div style={{ display: "inline-flex", background: "var(--site-bg)", borderRadius: "var(--core-radius-sm)", padding: "var(--core-space-1)", border: "1px solid var(--site-border)" }}>
          {(["sm", "md", "lg"] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSize(s)}
              style={{
                border: "none",
                background: size === s ? "var(--theme-brand-background-primary-strong)" : "transparent",
                color: size === s ? "var(--brand-text-primary-oncolor)" : "var(--site-text)",
                borderRadius: "var(--core-radius-sm)",
                padding: "4px 12px",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 120ms ease",
              }}
            >
              {sizeLabels[s]}
            </button>
          ))}
        </div>
      </div>

      {/* Copy Feedback Toast */}
      {copiedCode && (
        <div
          style={{
            position: "fixed",
            bottom: 24,
            right: 24,
            background: "var(--theme-semantics-success-strong-background)",
            color: "var(--theme-neutral-text-on-color)",
            padding: "var(--core-space-2) var(--core-space-5)",
            borderRadius: "var(--core-radius-sm)",
            fontSize: 12,
            fontWeight: 600,
            boxShadow: "var(--core-elevation-4)",
            zIndex: 9999,
          }}
        >
          ✓ {copiedCode}
        </div>
      )}

      {/* Main Complete Variant & State Matrix Canvas */}
      <div
        data-theme="core"
        data-mode={canvasBg}
        style={{
          background: "var(--core-color-bg-page)",
          color: "var(--core-color-text-primary)",
          borderRadius: 16,
          padding: "36px 32px",
          boxShadow: "var(--core-elevation-3)",
          border: "1px solid var(--site-border)",
          overflowX: "auto",
          transition: "background 150ms ease",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${VARIANTS.length}, minmax(190px, 1fr))`,
            columnGap: 36,
            rowGap: 0,
          }}
        >
          {VARIANTS.map((variant) => (
            <div key={variant.id} style={{ display: "flex", flexDirection: "column" }}>
              {/* Column Header */}
              <div
                style={{
                  borderBottom: "1px solid var(--site-border)",
                  paddingBottom: "var(--core-space-3)",
                  marginBottom: 24,
                }}
              >
                <div
                  style={{
                    fontSize: 17,
                    fontWeight: 700,
                    letterSpacing: "-0.01em",
                    textTransform: "capitalize",
                    color: "inherit",
                  }}
                >
                  {variant.name}
                </div>
              </div>

              {/* Rows for each state */}
              {statesList.map((st) => {
                const tokenInfo = variant.stateTokens[st.key];
                return (
                  <div key={st.key} style={{ marginBottom: 26 }}>
                    {/* State Label */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: 8,
                      }}
                    >
                      <span
                        style={{
                          color: "var(--site-text-dim)",
                          fontSize: "var(--typography-font-size-xs)",
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: "0.06em",
                        }}
                      >
                        {st.label}
                      </span>
                    </div>

                    {/* Exact Rendered Button for this State */}
                    <div style={{ marginBottom: 6 }}>
                      {st.key === "disabled" ? (
                        <div
                          role="button"
                          tabIndex={0}
                          onClick={() => handleCopy(variant.id, st.key)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") handleCopy(variant.id, st.key);
                          }}
                          title={`Click to copy JSX for ${variant.name} (${st.label})`}
                          style={{ display: "inline-block", cursor: "pointer" }}
                        >
                          <Button
                            variant={variant.id}
                            size={size}
                            disabled
                            style={{ minWidth: size === "sm" ? 110 : size === "md" ? 130 : 150, pointerEvents: "none" }}
                          >
                            {buttonText}
                          </Button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          style={getButtonStyles(variant, st.key)}
                          onClick={() => handleCopy(variant.id, st.key)}
                          title={`Click to copy JSX for ${variant.name} (${st.label})`}
                        >
                          {buttonText}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
