import React, { useRef, useState } from "react";
import type { InputSize } from "./Field";

export type ToggleSize = "sm" | "md" | "lg";

export interface ToggleProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onClick"> {
  pressed: boolean;
  onPressedChange: (v: boolean) => void;
  children: React.ReactNode;
  size?: ToggleSize;
}

export function Toggle({
  pressed,
  onPressedChange,
  children,
  disabled,
  size = "md",
  className = "",
  ...rest
}: ToggleProps) {
  return (
    <button
      type="button"
      className={`cds-toggle cds-toggle--${size} ${className}`.trim()}
      aria-pressed={pressed}
      disabled={disabled}
      onClick={() => !disabled && onPressedChange(!pressed)}
      {...rest}
    >
      {children}
    </button>
  );
}

export interface ToggleGroupOption<T extends string> {
  value: T;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface ToggleGroupProps<T extends string> {
  value: T;
  onChange: (v: T) => void;
  options: Array<ToggleGroupOption<T>>;
  disabled?: boolean;
  size?: ToggleSize;
  className?: string;
}

export function ToggleGroup<T extends string>({
  value,
  onChange,
  options,
  disabled,
  size = "md",
  className = "",
}: ToggleGroupProps<T>) {
  return (
    <div
      className={`cds-toggle-group cds-toggle-group--${size} ${disabled ? "cds-toggle-group--disabled" : ""} ${className}`.trim()}
      role="group"
    >
      {options.map((o) => {
        const selected = value === o.value;
        return (
          <button
            key={o.value}
            type="button"
            className={`cds-toggle-group__item cds-toggle-group__item--${size}`}
            aria-pressed={selected}
            disabled={disabled || o.disabled}
            onClick={() => !(disabled || o.disabled) && onChange(o.value)}
          >
            {o.icon ? (
              <span className={`cds-toggle-group__icon ${selected ? "cds-toggle-group__icon--selected" : ""}`} aria-hidden="true">
                {o.icon}
              </span>
            ) : null}
            <span className="cds-toggle-group__label">{o.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export interface IncrementalSelectorProps {
  value?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  id?: string;
  className?: string;
  size?: InputSize;
  "aria-label"?: string;
}

function clampValue(value: number, min?: number, max?: number) {
  let next = value;
  if (min !== undefined) next = Math.max(min, next);
  if (max !== undefined) next = Math.min(max, next);
  return next;
}

/**
 * Stepper-style numeric control with minus / value / plus segments.
 *
 * The value cell is a real, focusable `<input>` carrying `role="spinbutton"`
 * (WAI-ARIA APG spinbutton pattern: https://www.w3.org/WAI/ARIA/apg/patterns/spinbutton/).
 * Previously it was a plain, non-focusable `<div role="spinbutton">` — an
 * invalid combination (spinbutton must be a focusable widget) that also left
 * no way to reach a specific value except clicking +/- one step at a time,
 * unlike every reference numeric stepper (Chakra NumberInput, MUI Base
 * NumberInput, Ant InputNumber), which all let you type the value directly.
 */
export function IncrementalSelector({
  value: controlledValue,
  defaultValue = 0,
  onChange,
  min,
  max,
  step = 1,
  disabled = false,
  id,
  className = "",
  size = "md",
  "aria-label": ariaLabel = "Quantity",
}: IncrementalSelectorProps) {
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const [draft, setDraft] = useState<string | null>(null);
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : uncontrolledValue;

  const setValue = (next: number) => {
    const clamped = clampValue(next, min, max);
    if (!isControlled) setUncontrolledValue(clamped);
    onChange?.(clamped);
  };

  const decreaseDisabled = disabled || (min !== undefined && value <= min);
  const increaseDisabled = disabled || (max !== undefined && value >= max);

  const onValueKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp") { e.preventDefault(); setValue(value + step); }
    else if (e.key === "ArrowDown") { e.preventDefault(); setValue(value - step); }
    else if (e.key === "Home" && min !== undefined) { e.preventDefault(); setValue(min); }
    else if (e.key === "End" && max !== undefined) { e.preventDefault(); setValue(max); }
    else if (e.key === "Enter") { e.preventDefault(); (e.target as HTMLInputElement).blur(); }
  };

  const commitDraft = () => {
    if (draft === null) return;
    const parsed = Number(draft);
    setValue(Number.isFinite(parsed) && draft.trim() !== "" ? parsed : value);
    setDraft(null);
  };

  return (
    <div
      className={`cds-incremental-selector cds-incremental-selector--${size} ${disabled ? "cds-incremental-selector--disabled" : ""} ${className}`.trim()}
      role="group"
      aria-label={ariaLabel}
      aria-disabled={disabled || undefined}
    >
      <button
        type="button"
        className="cds-incremental-selector__btn cds-incremental-selector__btn--decrease"
        aria-label={`Decrease ${ariaLabel.toLowerCase()}`}
        disabled={decreaseDisabled}
        onClick={() => setValue(value - step)}
      >
        <span aria-hidden="true">−</span>
      </button>
      <input
        id={id}
        type="text"
        inputMode="numeric"
        className="cds-incremental-selector__value"
        aria-valuenow={value}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-label={ariaLabel}
        role="spinbutton"
        disabled={disabled}
        value={draft ?? String(value)}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={onValueKeyDown}
        onBlur={commitDraft}
      />
      <button
        type="button"
        className="cds-incremental-selector__btn cds-incremental-selector__btn--increase"
        aria-label={`Increase ${ariaLabel.toLowerCase()}`}
        disabled={increaseDisabled}
        onClick={() => setValue(value + step)}
      >
        <span aria-hidden="true">+</span>
      </button>
    </div>
  );
}

export function InputGroup({ prefix, suffix, children }: { prefix?: string; suffix?: string; children: React.ReactElement }) {
  return (
    <div className="cds-input-group">
      {prefix && <span className="cds-input-group-addon">{prefix}</span>}
      {children}
      {suffix && <span className="cds-input-group-addon">{suffix}</span>}
    </div>
  );
}

export interface InputOTPProps {
  length?: number;
  value?: string;
  onChange?: (v: string) => void;
  error?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  id?: string;
  className?: string;
  style?: React.CSSProperties;
  "aria-invalid"?: boolean | "true" | "false";
  "aria-describedby"?: string;
  "aria-label"?: string;
  "aria-required"?: boolean;
}

export function InputOTP({
  length = 6,
  value = "",
  onChange,
  error,
  disabled = false,
  readOnly = false,
  id,
  className = "",
  style,
  ...rest
}: InputOTPProps) {
  const refs = useRef<Array<HTMLInputElement | null>>([]);
  const digits = (value || "").split("").concat(Array(length).fill("")).slice(0, length);
  const isError = Boolean(error || rest["aria-invalid"] === true || rest["aria-invalid"] === "true");

  const setDigit = (i: number, d: string) => {
    if (disabled || readOnly) return;
    const next = digits.slice();
    next[i] = d.replace(/[^0-9]/g, "").slice(-1);
    onChange?.(next.join(""));
    if (next[i] && i < length - 1) refs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled || readOnly) return;
    if (e.key === "Backspace") {
      if (!digits[i] && i > 0) {
        refs.current[i - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && i > 0) {
      e.preventDefault();
      refs.current[i - 1]?.focus();
    } else if (e.key === "ArrowRight" && i < length - 1) {
      e.preventDefault();
      refs.current[i + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    if (disabled || readOnly) return;
    e.preventDefault();
    const pasted = e.clipboardData.getData("text/plain").replace(/[^0-9]/g, "").slice(0, length);
    if (pasted && onChange) {
      onChange(pasted);
      const focusIndex = Math.min(pasted.length, length - 1);
      refs.current[focusIndex]?.focus();
    }
  };

  return (
    <div
      className={`cds-otp ${isError ? "cds-otp--error" : ""} ${disabled ? "cds-otp--disabled" : ""} ${className}`.trim()}
      role="group"
      aria-label={rest["aria-label"] || "Verification code"}
      onPaste={handlePaste}
      style={style}
    >
      {digits.map((d, i) => (
        <input
          key={i}
          id={i === 0 ? id : undefined}
          ref={(el) => { refs.current[i] = el; }}
          className={`cds-otp-digit ${isError ? "cds-otp-digit--error" : ""}`.trim()}
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          value={d}
          disabled={disabled}
          readOnly={readOnly}
          aria-label={`Digit ${i + 1} of ${length}`}
          aria-invalid={isError ? "true" : undefined}
          aria-describedby={rest["aria-describedby"]}
          aria-required={rest["aria-required"]}
          onChange={(e) => setDigit(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
        />
      ))}
    </div>
  );
}
