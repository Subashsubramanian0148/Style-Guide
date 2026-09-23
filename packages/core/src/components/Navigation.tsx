import React, { useId, useRef, useState } from "react";

export interface TabItem { id: string; label: string; content?: React.ReactNode; }

/**
 * WAI-ARIA APG tabs pattern (https://www.w3.org/WAI/ARIA/apg/patterns/tabs/):
 * roving tabindex (only the active tab is a Tab stop), Arrow keys move
 * between tabs (Left/Right for horizontal, Up/Down for vertical, matching
 * the writing-mode each orientation is used in), Home/End jump to the
 * first/last tab, and each tab/panel pair is linked via aria-controls /
 * aria-labelledby. Previously none of this existed — every tab button was
 * its own Tab stop with no Arrow-key handling at all (a real keyboard user
 * had to Tab through each one individually), and the shared tabpanel had no
 * aria-labelledby, so a screen reader couldn't say which tab a panel's
 * content belonged to.
 */
export function Tabs({ items, defaultId, orientation = "horizontal" }: { items: TabItem[]; defaultId?: string; orientation?: "horizontal" | "vertical" }) {
  const [active, setActive] = useState(defaultId ?? items[0]?.id);
  const vertical = orientation === "vertical";
  const baseId = useId();
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const activeIndex = Math.max(0, items.findIndex((t) => t.id === active));

  const focusTab = (index: number) => {
    const next = items[index];
    if (!next) return;
    setActive(next.id);
    tabRefs.current[index]?.focus();
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    const nextKey = vertical ? "ArrowDown" : "ArrowRight";
    const prevKey = vertical ? "ArrowUp" : "ArrowLeft";
    if (e.key === nextKey) { e.preventDefault(); focusTab((activeIndex + 1) % items.length); }
    else if (e.key === prevKey) { e.preventDefault(); focusTab((activeIndex - 1 + items.length) % items.length); }
    else if (e.key === "Home") { e.preventDefault(); focusTab(0); }
    else if (e.key === "End") { e.preventDefault(); focusTab(items.length - 1); }
  };

  return (
    <div className={vertical ? "cds-tabs-layout--vertical" : undefined}>
      <div className={`cds-tabs ${vertical ? "cds-tabs--vertical" : ""}`} role="tablist" aria-orientation={orientation}>
        {items.map((t, i) => (
          <button
            key={t.id}
            ref={(el) => { tabRefs.current[i] = el; }}
            id={`${baseId}-tab-${t.id}`}
            role="tab"
            aria-selected={active === t.id}
            aria-controls={`${baseId}-panel-${t.id}`}
            tabIndex={active === t.id ? 0 : -1}
            className={`cds-tab ${vertical ? "cds-tab--vertical" : ""}`}
            onClick={() => setActive(t.id)}
            onKeyDown={onKeyDown}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div
        role="tabpanel"
        id={`${baseId}-panel-${active}`}
        aria-labelledby={`${baseId}-tab-${active}`}
        tabIndex={0}
        style={vertical ? { flex: 1, minWidth: 0 } : { paddingTop: 16 }}
      >
        {items.find((t) => t.id === active)?.content}
      </div>
    </div>
  );
}

export type BreadcrumbSeparator = "slash" | "line" | "dot" | "none";
const separatorGlyph: Record<BreadcrumbSeparator, string> = { slash: "/", line: "|", dot: "•", none: "" };

export function Breadcrumb({ items, separator = "slash" }: { items: Array<{ label: string; href?: string }>; separator?: BreadcrumbSeparator }) {
  return (
    <nav aria-label="Breadcrumb" className={`cds-breadcrumb cds-breadcrumb--${separator}`}>
      {items.map((item, i) => (
        <React.Fragment key={item.label}>
          {i > 0 && separator !== "none" && <span className="cds-breadcrumb-sep" aria-hidden="true">{separatorGlyph[separator]}</span>}
          {item.href && i < items.length - 1 ? (
            <a href={item.href}>{item.label}</a>
          ) : (
            <span className="current" aria-current="page">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}

export interface NavMenuItem { label: string; href?: string; current?: boolean; onClick?: () => void; }
export function NavigationMenu({ items }: { items: NavMenuItem[] }) {
  return (
    <nav className="cds-navmenu" aria-label="Main">
      {items.map((item) =>
        item.href ? (
          <a key={item.label} href={item.href} className="cds-navmenu-link" aria-current={item.current ? "page" : undefined}>{item.label}</a>
        ) : (
          <button key={item.label} className="cds-navmenu-link" aria-current={item.current ? "page" : undefined} onClick={item.onClick}>{item.label}</button>
        )
      )}
    </nav>
  );
}

export interface SidebarItem { label: string; icon?: React.ReactNode; current?: boolean; disabled?: boolean; onClick?: () => void; }
export type SidebarVariant = "shell" | "panel" | "rail";
/**
 * A vertical nav list, in three variants:
 * - `"shell"` (default) — icon-in-a-badge + label side by side, a tinted pill
 *   marking the active row. The full app-shell sidebar: fixed width, its own
 *   background and right border.
 * - `"panel"` — the same row layout, no shell chrome, for embedding in a Card
 *   as a settings-style sub-nav (e.g. a Profile page's Personal/Bank/
 *   Employment list).
 * - `"rail"` — a compact icon-over-label rail: centered stacked items, a left
 *   accent bar + tinted band on the active item, no icon badge. Goes
 *   light/dark with the rest of the app, same as the other two variants.
 */
export function AppSidebar({ items, variant = "shell", "aria-label": ariaLabel = "Sidebar" }: { items: SidebarItem[]; variant?: SidebarVariant; "aria-label"?: string }) {
  const stacked = variant === "rail";
  return (
    <nav className={`cds-app-sidebar cds-app-sidebar--${variant}`} aria-label={ariaLabel}>
      {items.map((item) => (
        <button
          key={item.label}
          type="button"
          className="cds-app-sidebar-link"
          aria-current={item.current ? "page" : undefined}
          aria-disabled={item.disabled}
          disabled={item.disabled}
          onClick={item.onClick}
        >
          {item.icon && (
            stacked
              ? <span className="cds-sidenav-icon-plain" aria-hidden="true">{item.icon}</span>
              : <span className="cds-sidenav-icon" aria-hidden="true">{item.icon}</span>
          )}
          <span className="cds-sidenav-label">{item.label}</span>
        </button>
      ))}
    </nav>
  );
}

export type StepState = "default" | "in-progress" | "completed" | "warning" | "error";

export interface StepDef {
  label: string;
  description?: string;
  /** Override the visual state for this step (docs / edge cases). */
  state?: StepState;
  /** Status line shown under every step, in every state — override the
   *  default per-state wording ("Not started", "In progress", "Completed",
   *  "Needs review", "Action required") with something specific to this step. */
  status?: string;
}

function resolveStepState(step: StepDef, index: number, currentIndex: number): StepState {
  if (step.state) return step.state;
  if (index < currentIndex) return "completed";
  if (index === currentIndex) return "in-progress";
  return "default";
}

function stepMarkerContent(state: StepState, index: number) {
  if (state === "completed") return "✓";
  if (state === "warning") return "!";
  if (state === "error") return "!";
  return index + 1;
}

/** Every step always shows a plain-language status — not just the ones
 *  with something to flag — so a step being "done" or "not started yet"
 *  reads as clearly as one that needs attention, instead of the absence
 *  of a message being the only signal for those two states. */
export function defaultStepStatus(state: StepState): string {
  switch (state) {
    case "completed":
      return "Completed";
    case "in-progress":
      return "In progress";
    case "warning":
      return "Needs review";
    case "error":
      return "Action required";
    case "default":
    default:
      return "Not started";
  }
}

export function Stepper({ steps, currentIndex, orientation = "horizontal" }: { steps: StepDef[]; currentIndex: number; orientation?: "horizontal" | "vertical" | "mobile" }) {
  const vertical = orientation === "vertical";

  if (orientation === "mobile") {
    const resolvedStates = steps.map((step, i) => resolveStepState(step, i, currentIndex));
    const current = steps[currentIndex];
    const currentState = resolvedStates[currentIndex] ?? "default";

    return (
      <div className="cds-stepper cds-stepper--mobile" aria-label="Progress">
        <div className="cds-stepper-mobile-track" role="list">
          {resolvedStates.map((state, i) => (
            <div
              key={`${steps[i].label}-${i}`}
              role="listitem"
              className="cds-stepper-mobile-step"
              aria-current={i === currentIndex ? "step" : undefined}
              aria-label={`Step ${i + 1}, ${steps[i].label}: ${state.replace("-", " ")}`}
            >
              <span className={`cds-stepper-mobile-segment cds-stepper-mobile-segment--${state}`} aria-hidden="true" />
              <span className="cds-stepper-mobile-step-label" aria-hidden="true">
                {i + 1}
              </span>
            </div>
          ))}
        </div>
        {current && (
          <div className="cds-stepper-mobile-count">
            Step {currentIndex + 1} of {steps.length}
          </div>
        )}
        {current && (
          <div className={`cds-step cds-step--mobile cds-step--${currentState}`} aria-current="step">
            <span className="cds-step-marker" aria-hidden="true">
              {stepMarkerContent(currentState, currentIndex)}
            </span>
            <span className="cds-step-label">
              <span className="cds-step-title">{current.label}</span>
              {current.description && <span className="cds-step-desc">{current.description}</span>}
              <span className="cds-step-status">
                {currentState === "in-progress" ? (
                  <span className="cds-step-status-spinner" aria-hidden="true" />
                ) : (
                  <span className="cds-step-status-dot" aria-hidden="true" />
                )}
                {current.status ?? defaultStepStatus(currentState)}
              </span>
            </span>
          </div>
        )}
      </div>
    );
  }

  return (
    <ol className={`cds-stepper ${vertical ? "cds-stepper--vertical" : ""}`} aria-label="Progress" aria-orientation={orientation}>
      {steps.map((step, i) => {
        const state = resolveStepState(step, i, currentIndex);
        return (
          <li
            key={step.label}
            className={`cds-step cds-step--${state} ${vertical ? "cds-step--vertical" : ""}`}
            aria-current={state === "in-progress" ? "step" : undefined}
          >
            <span className="cds-step-marker" aria-hidden="true">
              {stepMarkerContent(state, i)}
            </span>
            <span className="cds-step-label">
              <span className="cds-step-title">{step.label}</span>
              {step.description && <span className="cds-step-desc">{step.description}</span>}
              <span className="cds-step-status">
                {state === "in-progress" ? (
                  <span className="cds-step-status-spinner" aria-hidden="true" />
                ) : (
                  <span className="cds-step-status-dot" aria-hidden="true" />
                )}
                {step.status ?? defaultStepStatus(state)}
              </span>
            </span>
            {i < steps.length - 1 && <span className="cds-step-connector" aria-hidden="true" />}
          </li>
        );
      })}
    </ol>
  );
}

export function Pagination({ page, pageCount, onChange }: { page: number; pageCount: number; onChange: (p: number) => void }) {
  const pages = Array.from({ length: pageCount }, (_, i) => i + 1);
  return (
    <nav aria-label="Pagination" className="cds-pagination">
      <button className="cds-page-btn" onClick={() => onChange(page - 1)} disabled={page <= 1} aria-label="Previous page">‹</button>
      {pages.map((p) => (
        <button
          key={p}
          className="cds-page-btn"
          aria-current={p === page ? "page" : undefined}
          onClick={() => onChange(p)}
        >
          {p}
        </button>
      ))}
      <button className="cds-page-btn" onClick={() => onChange(page + 1)} disabled={page >= pageCount} aria-label="Next page">›</button>
    </nav>
  );
}
