import React, { useState } from "react";

export function Slider({
  value,
  min = 0,
  max = 100,
  step = 1,
  disabled,
  onChange,
  formatValue,
}: {
  value: number;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  onChange: (v: number) => void;
  formatValue?: (v: number) => string;
}) {
  const fill = max === min ? 0 : ((value - min) / (max - min)) * 100;

  return (
    <div className={`cds-slider ${disabled ? "cds-slider--disabled" : ""}`.trim()}>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        onChange={(e) => !disabled && onChange(Number(e.target.value))}
        style={{ flex: 1, "--cds-slider-fill": `${fill}%` } as React.CSSProperties}
        aria-valuetext={formatValue ? formatValue(value) : String(value)}
      />
      <span className="cds-slider-value">{formatValue ? formatValue(value) : value}</span>
    </div>
  );
}

export function ButtonGroup({ children }: { children: React.ReactNode }) {
  return <div className="cds-btn-group" role="group">{children}</div>;
}

export function Empty({ title, description, action, icon }: { title: string; description?: string; action?: React.ReactNode; icon?: React.ReactNode }) {
  return (
    <div className="cds-empty">
      <div className="cds-empty-icon" aria-hidden="true">{icon ?? "—"}</div>
      <div className="cds-empty-title">{title}</div>
      {description && <div className="cds-empty-desc">{description}</div>}
      {action && <div className="cds-empty-action">{action}</div>}
    </div>
  );
}

export function Item({ title, description, action }: { title: string; description?: string; action?: React.ReactNode }) {
  return (
    <div className="cds-item">
      <div className="cds-item-content">
        <div className="cds-item-title">{title}</div>
        {description && <div className="cds-item-desc">{description}</div>}
      </div>
      {action && <div className="cds-item-action">{action}</div>}
    </div>
  );
}

export type CollapsibleVariant = "card" | "bordered" | "button" | "ghost";

export interface CollapsibleProps {
  title?: React.ReactNode;
  variant?: CollapsibleVariant;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: (open: boolean, toggle: () => void) => React.ReactNode;
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export function Collapsible({
  title,
  variant = "card",
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  trigger,
  children,
  className = "",
  id,
}: CollapsibleProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : uncontrolledOpen;

  const toggle = () => {
    const next = !isOpen;
    if (!isControlled) {
      setUncontrolledOpen(next);
    }
    onOpenChange?.(next);
  };

  const panelId = id ? `${id}-panel` : undefined;
  const triggerId = id ? `${id}-trigger` : undefined;

  return (
    <div className={`cds-collapsible cds-collapsible--${variant} ${isOpen ? "cds-collapsible--open" : ""} ${className}`}>
      {trigger ? (
        trigger(isOpen, toggle)
      ) : (
        <button
          type="button"
          className="cds-collapsible-trigger"
          onClick={toggle}
          aria-expanded={isOpen}
          aria-controls={panelId}
          id={triggerId}
        >
          <span className="cds-collapsible-title">{title}</span>
          <ChevronIcon className="cds-collapsible-chevron" />
        </button>
      )}
      {isOpen && (
        <div className="cds-collapsible-content" id={panelId} role="region" aria-labelledby={triggerId}>
          {children}
        </div>
      )}
    </div>
  );
}

export type ChevronDirection = "down" | "up" | "left" | "right";

const CHEVRON_ROTATIONS: Record<ChevronDirection, string | undefined> = {
  down: undefined,
  up: "rotate(180deg)",
  left: "rotate(90deg)",
  right: "rotate(-90deg)",
};

/** Standard stroke chevron used on selects, accordions, sort controls, and menus. */
export function ChevronIcon({
  direction = "down",
  size = 14,
  className = "",
  style,
  ...rest
}: {
  direction?: ChevronDirection;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
} & React.SVGAttributes<SVGSVGElement>) {
  const rotation = CHEVRON_ROTATIONS[direction];
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
      style={{ ...(rotation ? { transform: rotation } : {}), ...style }}
      {...rest}
    >
      <path
        d="M3 5L7 9L11 5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export type SortDirection = "ascending" | "descending" | "none";

/**
 * A dedicated table-sort glyph — two stacked triangles (up + down), with
 * whichever direction is active rendered solid and the other dimmed —
 * rather than a single ChevronIcon that just rotates. A rotating chevron
 * only shows "this column is sorted, in one of two directions"; it can't
 * show "sortable but not yet sorted" as a visually distinct third state
 * the way a two-triangle glyph can (both dim = sortable, one solid = the
 * active direction). Matches the sort affordance used by AG Grid, Ant
 * Design Table, and MUI DataGrid.
 */
export function SortIcon({
  direction = "none",
  size = 12,
  className = "",
}: {
  direction?: SortDirection;
  size?: number;
  className?: string;
}) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 10 12"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M5 0L9 4.5H1L5 0Z"
        fill="currentColor"
        opacity={direction === "ascending" ? 1 : 0.35}
      />
      <path
        d="M5 12L1 7.5H9L5 12Z"
        fill="currentColor"
        opacity={direction === "descending" ? 1 : 0.35}
      />
    </svg>
  );
}

/** Standard stroke calendar icon used on date picker inputs. */
export function CalendarIcon({
  size = 16,
  className = "",
  ...rest
}: {
  size?: number;
  className?: string;
} & React.SVGAttributes<SVGSVGElement>) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      {...rest}
    >
      <rect x="2" y="3.5" width="12" height="10.5" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M2 7h12" stroke="currentColor" strokeWidth="1.4" />
      <path d="M5.5 2v3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M10.5 2v3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

export type IconSize = "sm" | "md" | "lg";
/**
 * Wraps a Font Awesome class name (e.g. "fa-solid fa-user") with CORE's icon
 * sizing tokens and, optionally, interactive hover/focus affordance for a
 * bare clickable icon (prefer IconButton when it needs a click handler).
 */
export function Icon({ name, size = "md", label, interactive = false, className = "", ...rest }: { name: string; size?: IconSize; label?: string; interactive?: boolean; className?: string } & React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={`cds-icon cds-icon--${size} ${interactive ? "cds-icon--interactive" : ""} ${className}`}
      role={label ? "img" : "presentation"}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      tabIndex={interactive ? 0 : undefined}
      {...rest}
    >
      <i className={name} aria-hidden="true" />
    </span>
  );
}

export function Kbd({ children }: { children: React.ReactNode }) {
  return <kbd className="cds-kbd">{children}</kbd>;
}

export function AspectRatio({ ratio = 16 / 9, children }: { ratio?: number; children: React.ReactNode }) {
  return (
    <div className="cds-aspect-ratio" style={{ paddingBottom: `${100 / ratio}%` }}>
      {children}
    </div>
  );
}

export interface DescriptionItem { term: string; value: React.ReactNode; }
/**
 * Label/value pairs — profile details, plan summaries, review screens.
 * Semantic <dl>/<dt>/<dd>, so a screen reader announces each pair as a unit.
 */
export function DescriptionList({ items, orientation = "stacked", columns = 1 }: { items: DescriptionItem[]; orientation?: "stacked" | "inline"; columns?: 1 | 2 | 3 }) {
  return (
    <dl className={`cds-description-list cds-description-list--${orientation}`} style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
      {items.map((item, i) => (
        <div className="cds-description-item" key={i}>
          <dt className="cds-description-term">{item.term}</dt>
          <dd className="cds-description-value">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
