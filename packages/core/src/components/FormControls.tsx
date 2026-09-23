import React, { useId, useEffect, useRef, useState } from "react";
import type { FieldVisualStyle } from "./Field";
import { ChevronIcon } from "./Primitives";

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement> & { variant?: FieldVisualStyle }>(
  ({ className = "", variant = "default", ...rest }, ref) => <textarea ref={ref} className={`cds-textarea cds-field-style--${variant} ${className}`} {...rest} />
);
Textarea.displayName = "Textarea";

export interface SelectOption { value: string; label: string; disabled?: boolean; }
export interface SelectProps {
  options: SelectOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (e: { target: { value: string } }) => void;
  /** Renders as a multi-select listbox (checkboxes, stays open on pick, trigger shows "N selected"). */
  multiple?: boolean;
  values?: string[];
  defaultValues?: string[];
  onValuesChange?: (values: string[]) => void;
  variant?: FieldVisualStyle;
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  style?: React.CSSProperties;
  id?: string;
  name?: string;
  "aria-describedby"?: string;
  "aria-invalid"?: boolean;
  "aria-required"?: boolean;
}

/**
 * A real, fully custom listbox — CORE never uses the native <select>, because the browser
 * owns its popup rendering (can't be styled, can get clipped or drop below the fold
 * unpredictably, differs per OS/browser). This one is a styled button trigger + an
 * absolutely-positioned `role="listbox"` popup that CORE fully controls, with full
 * keyboard support (Up/Down/Home/End/Enter/Escape/typeahead), and an optional
 * `multiple` mode (WAI-ARIA APG multi-select listbox: checkboxes, stays open on
 * pick, Escape/outside-click to close — matches Ant/MUI/Radix multi-select).
 */
export const Select = React.forwardRef<HTMLButtonElement, SelectProps>(
  ({ options, value, defaultValue, onChange, multiple = false, values, defaultValues, onValuesChange, variant = "default", size = "md", disabled, placeholder = "Select…", className = "", style, id, name, ...aria }, ref) => {
    const [open, setOpen] = useState(false);
    const [internalValue, setInternalValue] = useState(defaultValue ?? "");
    const [internalValues, setInternalValues] = useState<string[]>(defaultValues ?? []);
    const [activeIndex, setActiveIndex] = useState(0);
    const triggerRef = useRef<HTMLButtonElement | null>(null);
    const listRef = useRef<HTMLUListElement>(null);
    const wrapRef = useRef<HTMLDivElement>(null);
    const listboxId = useId();

    const current = value !== undefined ? value : internalValue;
    const currentValues = values !== undefined ? values : internalValues;
    const selectedOption = options.find((o) => o.value === current);
    const isSelected = (o: SelectOption) => (multiple ? currentValues.includes(o.value) : o.value === current);

    useEffect(() => {
      function onDocClick(e: MouseEvent) {
        if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
      }
      document.addEventListener("mousedown", onDocClick);
      return () => document.removeEventListener("mousedown", onDocClick);
    }, []);

    useEffect(() => {
      if (open) {
        const idx = options.findIndex((o) => isSelected(o));
        setActiveIndex(idx >= 0 ? idx : 0);
      }
    }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

    const commit = (opt: SelectOption) => {
      if (opt.disabled) return;
      if (multiple) {
        const next = currentValues.includes(opt.value)
          ? currentValues.filter((v) => v !== opt.value)
          : [...currentValues, opt.value];
        if (values === undefined) setInternalValues(next);
        onValuesChange?.(next);
        return;
      }
      if (value === undefined) setInternalValue(opt.value);
      onChange?.({ target: { value: opt.value } });
      setOpen(false);
      triggerRef.current?.focus();
    };

    const typeaheadRef = useRef({ query: "", timer: 0 as unknown as ReturnType<typeof setTimeout> });

    const onKeyDown = (e: React.KeyboardEvent) => {
      if (!open && (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "Enter" || e.key === " ")) {
        e.preventDefault();
        setOpen(true);
        return;
      }
      if (!open) return;
      if (e.key === "ArrowDown") { e.preventDefault(); setActiveIndex((i) => Math.min(options.length - 1, i + 1)); }
      else if (e.key === "ArrowUp") { e.preventDefault(); setActiveIndex((i) => Math.max(0, i - 1)); }
      else if (e.key === "Home") { e.preventDefault(); setActiveIndex(0); }
      else if (e.key === "End") { e.preventDefault(); setActiveIndex(options.length - 1); }
      else if (e.key === "Enter" || e.key === " ") { e.preventDefault(); const opt = options[activeIndex]; if (opt) commit(opt); }
      else if (e.key === "Escape") { e.preventDefault(); setOpen(false); triggerRef.current?.focus(); }
      else if (e.key.length === 1 && !e.altKey && !e.ctrlKey && !e.metaKey) {
        // Typeahead (WAI-ARIA APG listbox pattern): typing jumps to the next
        // option starting with the typed character(s), wrapping after the
        // currently active option — matches the native <select> and every
        // reference custom listbox (Radix Select, Ant, MUI).
        e.preventDefault();
        const state = typeaheadRef.current;
        clearTimeout(state.timer);
        state.query += e.key.toLowerCase();
        state.timer = setTimeout(() => { state.query = ""; }, 500);
        const startAt = state.query.length > 1 ? activeIndex : activeIndex + 1;
        let matchIndex = -1;
        for (let step = 0; step < options.length; step++) {
          const i = (startAt + step) % options.length;
          if (!options[i].disabled && options[i].label.toLowerCase().startsWith(state.query)) {
            matchIndex = i;
            break;
          }
        }
        if (matchIndex !== -1) setActiveIndex(matchIndex);
      }
    };

    const triggerLabel = multiple
      ? (currentValues.length > 0 ? `${currentValues.length} selected` : placeholder)
      : (selectedOption ? selectedOption.label : placeholder);
    const triggerIsPlaceholder = multiple ? currentValues.length === 0 : !selectedOption;

    return (
      <div className="cds-select-wrap" style={style} ref={wrapRef}>
        <button
          ref={(node) => {
            triggerRef.current = node;
            if (typeof ref === "function") ref(node);
            else if (ref) (ref as any).current = node;
          }}
          id={id}
          type="button"
          className={`cds-select cds-field-style--${variant} cds-select--${size} ${className}`}
          role="combobox"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={listboxId}
          aria-activedescendant={open ? `${listboxId}-${activeIndex}` : undefined}
          aria-disabled={disabled}
          disabled={disabled}
          onClick={() => !disabled && setOpen((o) => !o)}
          onKeyDown={onKeyDown}
          {...aria}
        >
          <span className={triggerIsPlaceholder ? "cds-select-placeholder" : ""}>{triggerLabel}</span>
        </button>
        <ChevronIcon className="cds-select-caret" size={14} />
        {open && (
          <ul className="cds-select-listbox" role="listbox" id={listboxId} ref={listRef} aria-multiselectable={multiple || undefined}>
            {options.map((o, i) => {
              const selected = isSelected(o);
              return (
                <li
                  key={o.value}
                  id={`${listboxId}-${i}`}
                  role="option"
                  aria-selected={selected}
                  aria-disabled={o.disabled}
                  className={`cds-select-option ${i === activeIndex ? "cds-select-option--active" : ""} ${o.disabled ? "cds-select-option--disabled" : ""}`}
                  onMouseEnter={() => setActiveIndex(i)}
                  onMouseDown={(e) => { e.preventDefault(); commit(o); }}
                >
                  {multiple ? (
                    <span className={`cds-select-option-checkbox ${selected ? "cds-select-option-checkbox--checked" : ""}`} aria-hidden="true">
                      {selected && (
                        <svg width="10" height="8" viewBox="0 0 11 9" fill="none"><path d="M1 4.5L4 7.5L10 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      )}
                    </span>
                  ) : (
                    selected && <span className="cds-select-check" aria-hidden="true">✓</span>
                  )}
                  {o.label}
                </li>
              );
            })}
          </ul>
        )}
        {name && !multiple && <input type="hidden" name={name} value={current} />}
        {name && multiple && currentValues.map((v) => <input key={v} type="hidden" name={name} value={v} />)}
      </div>
    );
  }
);
Select.displayName = "Select";

export type CheckboxTone = "brand" | "success" | "danger" | "warning";
export type CheckboxSize = "sm" | "md" | "lg";

export function Checkbox({ label, indeterminate, tone = "brand", size = "md", ...rest }: { label: string; indeterminate?: boolean; tone?: CheckboxTone; size?: CheckboxSize } & Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">) {
  const id = useId();
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (ref.current) ref.current.indeterminate = !!indeterminate;
  }, [indeterminate]);
  return (
    <label className="cds-checkbox" htmlFor={id}>
      <input ref={ref} id={id} type="checkbox" aria-checked={indeterminate ? "mixed" : undefined} {...rest} />
      <span className={`cds-checkbox-box cds-checkbox-box--${tone} cds-checkbox-box--${size} ${indeterminate ? "cds-checkbox-box--indeterminate" : ""}`} aria-hidden="true">
        {indeterminate ? (
          <svg width="10" height="2" viewBox="0 0 10 2" fill="none"><rect width="10" height="2" rx="1" fill="white" /></svg>
        ) : (
          <svg width="11" height="9" viewBox="0 0 11 9" fill="none"><path d="M1 4.5L4 7.5L10 1.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        )}
      </span>
      {label}
    </label>
  );
}

export function Radio({ label, size = "md", ...rest }: { label: string; size?: CheckboxSize } & Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">) {
  const id = useId();
  return (
    <label className="cds-radio" htmlFor={id}>
      <input id={id} type="radio" {...rest} />
      <span className={`cds-radio-box cds-radio-box--${size}`} aria-hidden="true"><span className="dot" /></span>
      {label}
    </label>
  );
}

export interface RadioGroupOption { value: string; label: string; disabled?: boolean; }
export function RadioGroup({
  name,
  value,
  onChange,
  options,
  orientation = "vertical",
  label,
  "aria-label": ariaLabel,
}: {
  name: string;
  value: string;
  onChange: (v: string) => void;
  options: RadioGroupOption[];
  orientation?: "vertical" | "horizontal";
  /** Visible group label (rendered above the options). Provide this or
   *  `aria-label` — every reference RadioGroup (Radix, Chakra, shadcn)
   *  requires the group to have an accessible name of its own, separate
   *  from each option's own label. Previously this pointed
   *  `aria-labelledby` at an id no element ever had, a silently broken
   *  reference — the group had no accessible name at all. */
  label?: string;
  "aria-label"?: string;
}) {
  const groupId = useId();
  return (
    <div>
      {label && (
        <div id={groupId} style={{ fontSize: "var(--typography-label-size)", fontWeight: "var(--typography-label-weight)", color: "var(--theme-neutral-text-subtle)", marginBottom: 8 }}>
          {label}
        </div>
      )}
      <div
        role="radiogroup"
        aria-labelledby={label ? groupId : undefined}
        aria-label={!label ? ariaLabel : undefined}
        style={{ display: "flex", flexDirection: orientation === "vertical" ? "column" : "row", gap: orientation === "vertical" ? 12 : 20 }}
      >
        {options.map((o) => (
          <Radio
            key={o.value}
            name={name}
            label={o.label}
            value={o.value}
            checked={value === o.value}
            disabled={o.disabled}
            onChange={() => onChange(o.value)}
          />
        ))}
      </div>
    </div>
  );
}
