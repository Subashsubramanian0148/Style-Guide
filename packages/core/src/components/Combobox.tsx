import React, { useEffect, useId, useMemo, useRef, useState } from "react";

export interface ComboboxOption { value: string; label: string; }
export interface ComboboxProps {
  options: ComboboxOption[];
  value?: string;
  onChange?: (v: string) => void;
  placeholder?: string;
  disabled?: boolean;
  id?: string;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * ARIA 1.2 combobox pattern (https://www.w3.org/WAI/ARIA/apg/patterns/combobox/):
 * the input owns aria-expanded/aria-controls/aria-activedescendant, and the
 * popup is a real role="listbox". Previously this had none of that plus no
 * onKeyDown at all — Arrow keys, Enter, Escape and Home/End all did
 * nothing, so once opened the list could only be used with a mouse (fails
 * WCAG 2.1.1 Keyboard). Mirrors the same keyboard handling already proven
 * on the Select component.
 */
export function Combobox({
  options,
  value = "",
  onChange,
  placeholder,
  disabled,
  id,
  className = "",
  style,
}: ComboboxProps) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listboxId = useId();

  const selected = options.find((o) => o.value === value || o.label === value);
  const filtered = useMemo(
    () => options.filter((o) => o.label.toLowerCase().includes(query.toLowerCase())),
    [options, query]
  );

  useEffect(() => {
    if (open) setActiveIndex(0);
  }, [open, query]);

  const commit = (opt: ComboboxOption) => {
    onChange?.(opt.value);
    setOpen(false);
    setQuery("");
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      e.preventDefault();
      setOpen(true);
      setQuery("");
      return;
    }
    if (!open) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(filtered.length - 1, i + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(0, i - 1));
    } else if (e.key === "Home") {
      e.preventDefault();
      setActiveIndex(0);
    } else if (e.key === "End") {
      e.preventDefault();
      setActiveIndex(filtered.length - 1);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const opt = filtered[activeIndex];
      if (opt) commit(opt);
    } else if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
      setQuery("");
    }
  };

  return (
    <div className={`cds-combobox ${className}`}>
      <input
        ref={inputRef}
        id={id}
        className="cds-input"
        role="combobox"
        aria-expanded={open}
        aria-autocomplete="list"
        aria-controls={listboxId}
        aria-activedescendant={open && filtered[activeIndex] ? `${listboxId}-${activeIndex}` : undefined}
        disabled={disabled}
        placeholder={placeholder}
        style={style}
        value={open ? query : (selected?.label ?? value ?? "")}
        onFocus={() => {
          if (!disabled) {
            setOpen(true);
            setQuery("");
          }
        }}
        onChange={(e) => {
          if (!disabled) setQuery(e.target.value);
        }}
        onKeyDown={onKeyDown}
        onBlur={() => setTimeout(() => setOpen(false), 120)}
      />
      {open && !disabled && (
        <div className="cds-combobox-list" id={listboxId} role="listbox">
          {filtered.length === 0 && <div className="cds-combobox-empty">No matches</div>}
          {filtered.map((o, i) => (
            <div
              key={o.value}
              id={`${listboxId}-${i}`}
              role="option"
              aria-selected={o.value === value}
              className={`cds-combobox-option ${i === activeIndex ? "cds-combobox-option--active" : ""}`}
              onMouseEnter={() => setActiveIndex(i)}
              onMouseDown={(e) => {
                e.preventDefault();
                commit(o);
              }}
            >
              {o.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
