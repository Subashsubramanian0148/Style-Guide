import React, { useId } from "react";
import { Icon } from "./Primitives";

export type CardVariant = "default" | "outlined" | "interactive";
export interface CardProps {
  className?: string;
  style?: React.CSSProperties;
  variant?: CardVariant;
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}
export function Card({ className = "", style, variant = "default", disabled, onClick, children }: CardProps) {
  const interactive = variant === "interactive" || !!onClick;
  const Tag = interactive ? "button" : "div";
  return (
    <Tag
      className={`cds-card cds-card--${variant} ${disabled ? "cds-card--disabled" : ""} ${className}`.trim()}
      style={style}
      onClick={disabled ? undefined : onClick}
      disabled={interactive ? disabled : undefined}
      aria-disabled={!interactive && disabled ? true : undefined}
      type={interactive ? "button" : undefined}
    >
      {children}
    </Tag>
  );
}

export type BadgeTone = "primary" | "neutral" | "success" | "warning" | "danger" | "info";
export type BadgeStyle = "soft" | "outline" | "solid";
export type BadgeSize = "sm" | "md";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
  variant?: BadgeStyle;
  size?: BadgeSize;
  interactive?: boolean;
  disabled?: boolean;
  dot?: boolean;
  onRemove?: () => void;
  children: React.ReactNode;
}

export function Badge({
  tone = "neutral",
  variant = "soft",
  size = "md",
  interactive = false,
  disabled = false,
  dot = false,
  onRemove,
  className = "",
  children,
  onClick,
  ...rest
}: BadgeProps) {
  // Clickable as a whole (onClick, not just the nested remove button) needs
  // to be a real <button> — a <span onClick> has no tabIndex/role/keyboard
  // handling and is unreachable without a mouse (fails WCAG 2.1.1),
  // mirroring the same fix already applied to Card's interactive variant.
  // Excludes the onRemove case: a <button> can't legally contain another
  // <button> (invalid nested interactive content), so a removable badge
  // stays a <span> — its remove button is independently keyboard-reachable.
  const isWholeBadgeClickable = (interactive || Boolean(onClick)) && !onRemove;
  const isInteractive = isWholeBadgeClickable || Boolean(onRemove);
  const Tag = isWholeBadgeClickable ? "button" : "span";
  const classes = [
    "cds-badge",
    `cds-badge--${tone}`,
    `cds-badge-style--${variant}`,
    `cds-badge-size--${size}`,
    isInteractive ? "cds-badge--interactive" : "",
    disabled ? "cds-badge--disabled" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Tag
      className={classes}
      type={isWholeBadgeClickable ? "button" : undefined}
      disabled={isWholeBadgeClickable ? disabled : undefined}
      aria-disabled={!isWholeBadgeClickable && disabled ? "true" : undefined}
      onClick={disabled ? undefined : onClick}
      {...rest}
    >
      {dot && <span className="cds-badge-dot" aria-hidden="true" />}
      {children}
      {onRemove && !disabled && (
        <button
          type="button"
          className="cds-badge-remove"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          aria-label="Remove"
        >
          ×
        </button>
      )}
    </Tag>
  );
}

export type AlertTone = "success" | "warning" | "danger" | "info";

// A tone-specific icon — not just background/border color — so the alert's
// category doesn't rely on color alone (WCAG 1.4.1 Use of Color), matching
// every reference implementation (Chakra's required AlertIcon, shadcn's
// lucide icon, Material's default severity icon).
const ALERT_ICON: Record<AlertTone, string> = {
  success: "fa-solid fa-circle-check",
  warning: "fa-solid fa-triangle-exclamation",
  danger: "fa-solid fa-circle-exclamation",
  info: "fa-solid fa-circle-info",
};

export function Alert({ tone = "info", title, children, onDismiss }: { tone?: AlertTone; title: string; children?: React.ReactNode; onDismiss?: () => void }) {
  return (
    <div className={`cds-alert cds-alert--${tone}`} role={tone === "danger" ? "alert" : "status"} style={{ position: "relative", paddingRight: onDismiss ? "var(--core-space-8)" : undefined }}>
      <Icon name={ALERT_ICON[tone]} size="md" className="cds-alert__icon" />
      <div>
        <strong style={{ display: "block", marginBottom: children ? "var(--core-space-1)" : 0 }}>{title}</strong>
        {children}
      </div>
      {onDismiss && (
        <button type="button" className="cds-alert__dismiss" onClick={onDismiss} aria-label="Dismiss">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M1 1l12 12M13 1L1 13" />
          </svg>
        </button>
      )}
    </div>
  );
}

export interface SwitchProps {
  label?: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (v: boolean) => void;
  id?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
}

/**
 * When `label` is omitted (e.g. the switch sits beside its own heading
 * elsewhere in the layout, as in a settings row), pass `aria-label` or
 * `aria-labelledby` — without one of the three, the control has no
 * accessible name at all and a screen reader announces only "switch, off".
 */
export function Switch({ label, checked, disabled, onChange, id, ...aria }: SwitchProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  return (
    <label className={`cds-switch ${disabled ? "cds-switch--disabled" : ""}`} htmlFor={inputId}>
      <input id={inputId} type="checkbox" role="switch" checked={checked} disabled={disabled} onChange={(e) => onChange(e.target.checked)} {...aria} />
      <span className="cds-switch-track" aria-hidden="true" />
      {label && <span>{label}</span>}
    </label>
  );
}
