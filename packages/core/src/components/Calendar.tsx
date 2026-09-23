import React, { useRef, useState } from "react";
import { Button } from "./Button";
import { InputWithIcon } from "./Field";
import { CalendarIcon } from "./Primitives";
import { Popover } from "./Overlays";

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];

function daysInMonth(year: number, month: number) { return new Date(year, month + 1, 0).getDate(); }
function startWeekday(year: number, month: number) { return new Date(year, month, 1).getDay(); }
function sameDay(a: Date, b: Date) { return a.toDateString() === b.toDateString(); }

export interface CalendarProps {
  selected?: Date;
  onSelect: (d: Date) => void;
  /** Shows a "Clear" footer action that resets the selection — omit to hide it. */
  onClear?: () => void;
  minDate?: Date;
  maxDate?: Date;
  disabled?: boolean;
}

export function Calendar({ selected, onSelect, onClear, minDate, maxDate, disabled }: CalendarProps) {
  const [cursor, setCursor] = useState(selected ?? new Date());
  // Roving tabindex (WAI-ARIA APG grid pattern: https://www.w3.org/WAI/ARIA/apg/patterns/grid/)
  // — exactly one day is a Tab stop at a time; Arrow/Home/End/PageUp/PageDown
  // move it. Previously every one of the ~42 day cells was its own Tab stop
  // with no Arrow-key handling at all — the only way to reach, say, the 3rd
  // week was 17+ consecutive Tab presses, and date-by-date navigation
  // (trivial with a mouse) had no keyboard equivalent whatsoever.
  const [focused, setFocused] = useState(selected ?? new Date());
  const shouldFocusRef = useRef(false);
  const gridRef = useRef<HTMLDivElement>(null);

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const total = daysInMonth(year, month);
  const startDay = startWeekday(year, month);
  const cells: Array<{ date: Date; outside?: boolean }> = [];
  for (let i = 0; i < startDay; i++) cells.push({ date: new Date(year, month, i - startDay + 1), outside: true });
  for (let d = 1; d <= total; d++) cells.push({ date: new Date(year, month, d) });
  while (cells.length % 7 !== 0) cells.push({ date: new Date(year, month, total + (cells.length % 7)), outside: true });

  const monthLabel = cursor.toLocaleDateString(undefined, { month: "long", year: "numeric" });

  const goToToday = () => {
    const today = new Date();
    setCursor(new Date(today.getFullYear(), today.getMonth(), 1));
    setFocused(today);
    shouldFocusRef.current = true;
    onSelect(today);
  };

  React.useEffect(() => {
    if (!shouldFocusRef.current) return;
    shouldFocusRef.current = false;
    const el = gridRef.current?.querySelector<HTMLButtonElement>(`[data-date="${focused.toDateString()}"]`);
    el?.focus();
  }, [cursor, focused]);

  const moveFocus = (next: Date) => {
    setFocused(next);
    shouldFocusRef.current = true;
    if (next.getMonth() !== month || next.getFullYear() !== year) {
      setCursor(new Date(next.getFullYear(), next.getMonth(), 1));
    }
  };

  const onDayKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, date: Date) => {
    const day = 24 * 60 * 60 * 1000;
    switch (e.key) {
      case "ArrowLeft":
        e.preventDefault();
        moveFocus(new Date(date.getTime() - day));
        break;
      case "ArrowRight":
        e.preventDefault();
        moveFocus(new Date(date.getTime() + day));
        break;
      case "ArrowUp":
        e.preventDefault();
        moveFocus(new Date(date.getTime() - 7 * day));
        break;
      case "ArrowDown":
        e.preventDefault();
        moveFocus(new Date(date.getTime() + 7 * day));
        break;
      case "Home":
        e.preventDefault();
        moveFocus(new Date(date.getTime() - date.getDay() * day));
        break;
      case "End":
        e.preventDefault();
        moveFocus(new Date(date.getTime() + (6 - date.getDay()) * day));
        break;
      case "PageUp":
        e.preventDefault();
        moveFocus(new Date(date.getFullYear(), date.getMonth() + (e.shiftKey ? -12 : -1), date.getDate()));
        break;
      case "PageDown":
        e.preventDefault();
        moveFocus(new Date(date.getFullYear(), date.getMonth() + (e.shiftKey ? 12 : 1), date.getDate()));
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        onSelect(date);
        break;
    }
  };

  return (
    <div className={`cds-calendar ${disabled ? "cds-calendar--disabled" : ""}`} role="group" aria-label="Calendar">
      <div className="cds-calendar-header">
        <button type="button" className="cds-calendar-nav" disabled={disabled} onClick={() => setCursor(new Date(year, month - 1, 1))} aria-label="Previous month">‹</button>
        {/* aria-live: Prev/Next (and PageUp/PageDown on a day cell) change
            the visible month with nothing else on screen announcing it —
            without this a screen reader user gets no feedback that
            anything happened. */}
        <span className="cds-calendar-title" aria-live="polite">{monthLabel}</span>
        <button type="button" className="cds-calendar-nav" disabled={disabled} onClick={() => setCursor(new Date(year, month + 1, 1))} aria-label="Next month">›</button>
      </div>
      <div className="cds-calendar-grid" ref={gridRef}>
        {WEEKDAYS.map((w, i) => <div className="cds-calendar-weekday" key={i}>{w}</div>)}
        {cells.map(({ date, outside }, i) => {
          const isDateDisabled = disabled || (minDate && date < minDate) || (maxDate && date > maxDate);
          const isSelected = selected && sameDay(date, selected);
          const isFocusTarget = sameDay(date, focused);
          return (
            <button
              key={i}
              type="button"
              data-date={date.toDateString()}
              className={`cds-calendar-day ${outside ? "cds-calendar-day--outside" : ""}`}
              aria-pressed={isSelected || undefined}
              tabIndex={isFocusTarget ? 0 : -1}
              disabled={!!isDateDisabled}
              onClick={() => { setFocused(date); onSelect(date); }}
              onKeyDown={(e) => onDayKeyDown(e, date)}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>
      <div className="cds-calendar-footer">
        <Button type="button" variant="tertiary" size="sm" disabled={disabled || !onClear} onClick={onClear}>
          Clear
        </Button>
        <Button type="button" variant="tertiary" size="sm" disabled={disabled} onClick={goToToday}>
          Today
        </Button>
      </div>
    </div>
  );
}

export interface DatePickerProps {
  value?: Date;
  onChange?: (d: Date | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  id?: string;
}

export function DatePicker({ value, onChange, placeholder = "Select date", disabled, id }: DatePickerProps) {
  const trigger = (
    <InputWithIcon
      id={id}
      readOnly
      disabled={disabled}
      value={value ? value.toLocaleDateString("en-GB") : ""}
      placeholder={placeholder}
      trailingIcon={<CalendarIcon size={16} />}
      style={{ cursor: disabled ? "not-allowed" : "pointer" }}
    />
  );
  if (disabled) {
    return <div className="cds-date-picker">{trigger}</div>;
  }
  return (
    <div className="cds-date-picker">
      <Popover trigger={trigger}>
        <Calendar
          selected={value}
          onSelect={(d) => onChange?.(d)}
          onClear={onChange ? () => onChange(undefined) : undefined}
        />
      </Popover>
    </div>
  );
}
