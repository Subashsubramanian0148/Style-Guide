import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "./Button";
import { Icon } from "./Primitives";

export function Modal({ open, onClose, title, children, actions }: { open: boolean; onClose: () => void; title: string; children?: React.ReactNode; actions?: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (open) ref.current?.focus();
  }, [open]);
  if (!open) return null;
  return (
    <div className="cds-overlay-scrim" onClick={onClose} style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div
        ref={ref}
        className="cds-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cds-modal-title"
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.key === "Escape" && onClose()}
      >
        <h2 id="cds-modal-title" className="cds-modal-title">{title}</h2>
        <div className="cds-modal-body">{children}</div>
        <div className="cds-modal-actions">{actions}</div>
      </div>
    </div>
  );
}

export function ConfirmDialog({ open, onClose, onConfirm, title, description, danger }: { open: boolean; onClose: () => void; onConfirm: () => void; title: string; description: string; danger?: boolean }) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      actions={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button variant={danger ? "destructive" : "primary"} onClick={onConfirm}>{danger ? "Delete" : "Confirm"}</Button>
        </>
      }
    >
      {description}
    </Modal>
  );
}

export interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children?: React.ReactNode;
  side?: "left" | "right";
  width?: number;
  /** Header action buttons (e.g. Cancel + Save) — renders inline with the title, before the close button. */
  actions?: React.ReactNode;
  /** Optional side panel (e.g. a fee/summary breakdown) rendered alongside the main content, like a Slideover. */
  aside?: React.ReactNode;
}

/**
 * Drawer / Slideover — a right- (or left-) anchored panel. The same component covers both the
 * simple "Drawer" case (title + body) and the richer "Slideover" pattern (title + header actions +
 * close button + an optional side-by-side summary panel) via the `actions`/`aside` props.
 */
const DRAWER_ANIMATION_MS = 280;

/** Portaled overlays render on document.body, outside any app theme root — pin CORE tokens here. */
const CORE_OVERLAY_THEME = { "data-theme": "core", "data-mode": "light" } as const;

export function Drawer({ open, onClose, title, children, side = "right", width = 360, actions, aside }: DrawerProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [canTransition, setCanTransition] = useState(false);

  useEffect(() => {
    if (open) {
      setMounted(true);
      return;
    }

    setVisible(false);
    const timeout = window.setTimeout(() => {
      setMounted(false);
      setCanTransition(false);
    }, DRAWER_ANIMATION_MS);
    return () => window.clearTimeout(timeout);
  }, [open]);

  useLayoutEffect(() => {
    if (!mounted || !open) return;

    setVisible(false);
    setCanTransition(false);
    const frame = requestAnimationFrame(() => {
      panelRef.current?.getBoundingClientRect();
      setCanTransition(true);
      setVisible(true);
    });
    return () => cancelAnimationFrame(frame);
  }, [mounted, open]);

  useEffect(() => {
    if (!mounted) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [mounted, onClose]);

  useEffect(() => {
    if (!mounted) return;

    const scrollY = window.scrollY;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    const root = document.getElementById("root");
    if (!root) return;

    const prev = {
      position: root.style.position,
      top: root.style.top,
      left: root.style.left,
      right: root.style.right,
      width: root.style.width,
      paddingRight: root.style.paddingRight,
    };

    root.style.position = "fixed";
    root.style.top = `-${scrollY}px`;
    root.style.left = "0";
    root.style.right = "0";
    root.style.width = "100%";
    if (scrollbarWidth > 0) root.style.paddingRight = `${scrollbarWidth}px`;
    document.documentElement.style.overflow = "hidden";

    return () => {
      root.style.position = prev.position;
      root.style.top = prev.top;
      root.style.left = prev.left;
      root.style.right = prev.right;
      root.style.width = prev.width;
      root.style.paddingRight = prev.paddingRight;
      document.documentElement.style.overflow = "";
      window.scrollTo(0, scrollY);
    };
  }, [mounted]);

  if (!mounted) return null;

  const fromSideClass = side === "right" ? "cds-drawer--from-right" : "cds-drawer--from-left";
  const visibleClass = visible ? " cds-drawer--visible" : "";
  const animatingClass = canTransition ? " cds-drawer--animating" : "";
  const isClosing = mounted && !open;

  return createPortal(
    <div
      {...CORE_OVERLAY_THEME}
      className={`cds-overlay-scrim cds-overlay-scrim--drawer${isClosing ? " cds-overlay-scrim--drawer-closing" : ""}`}
      onClick={onClose}
      style={{ display: "flex", justifyContent: side === "right" ? "flex-end" : "flex-start", alignItems: "stretch" }}
    >
      <div
        ref={panelRef}
        className={`cds-drawer ${fromSideClass}${visibleClass}${animatingClass}`}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        style={{ width, maxWidth: "90vw" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="cds-drawer-header">
          <h2 className="cds-modal-title" style={{ margin: 0 }}>{title}</h2>
          <div className="cds-drawer-header-actions">
            {actions}
            <button type="button" className="cds-drawer-close" aria-label="Close" onClick={onClose}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M1 1L11 11M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
            </button>
          </div>
        </div>
        <div className={aside ? "cds-drawer-body cds-drawer-body--split" : "cds-drawer-body"}>
          <div className="cds-drawer-main">{children}</div>
          {aside && <div className="cds-drawer-aside">{aside}</div>}
        </div>
      </div>
    </div>,
    document.body,
  );
}

export type TooltipPlacement = "top" | "right" | "bottom" | "left";

export function Tooltip({
  label,
  children,
  placement = "top",
  open,
}: {
  label: string;
  children: React.ReactElement;
  placement?: TooltipPlacement;
  /** Force the bubble visible (docs/anatomy); omit for hover/focus behavior. */
  open?: boolean;
}) {
  const [show, setShow] = useState(false);
  const visible = open ?? show;
  return (
    <span style={{ position: "relative", display: "inline-block" }} onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)} onFocus={() => setShow(true)} onBlur={() => setShow(false)}>
      {children}
      {visible && (
        <span className={`cds-tooltip-wrap cds-tooltip-wrap--${placement}`}>
          <span className="cds-tooltip" role="tooltip">
            {label}
          </span>
        </span>
      )}
    </span>
  );
}

export interface MenuItemDef {
  label: string;
  onSelect?: () => void;
  danger?: boolean;
  separatorAfter?: boolean;
  type?: "item" | "checkbox" | "radio" | "submenu";
  checked?: boolean;
  onCheckedChange?: (v: boolean) => void;
  items?: MenuItemDef[]; // for type "submenu"
}

function MenuItems({ items, onDone }: { items: MenuItemDef[]; onDone: () => void }) {
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  return (
    <>
      {items.map((item) => (
        <React.Fragment key={item.label}>
          {item.type === "submenu" ? (
            <div
              className="cds-menu-submenu-trigger"
              onMouseEnter={() => setOpenSubmenu(item.label)}
              onMouseLeave={() => setOpenSubmenu(null)}
            >
              <button role="menuitem" aria-haspopup="menu" className="cds-menu-item">
                {item.label} <span aria-hidden="true">›</span>
              </button>
              {openSubmenu === item.label && item.items && (
                <div className="cds-menu cds-menu-submenu" role="menu">
                  <MenuItems items={item.items} onDone={onDone} />
                </div>
              )}
            </div>
          ) : item.type === "checkbox" ? (
            <button
              role="menuitemcheckbox"
              aria-checked={item.checked}
              className="cds-menu-item cds-menu-item--check"
              onClick={() => item.onCheckedChange?.(!item.checked)}
            >
              {item.label} <span className="cds-menu-item-check-mark" data-checked={item.checked}>✓</span>
            </button>
          ) : item.type === "radio" ? (
            <button
              role="menuitemradio"
              aria-checked={item.checked}
              className="cds-menu-item cds-menu-item--radio"
              onClick={() => { item.onSelect?.(); onDone(); }}
            >
              {item.label} <span className="cds-menu-item-check-mark" data-checked={item.checked}>●</span>
            </button>
          ) : (
            <button
              role="menuitem"
              className={`cds-menu-item ${item.danger ? "cds-menu-item--danger" : ""}`}
              onClick={() => { item.onSelect?.(); onDone(); }}
            >
              {item.label}
            </button>
          )}
          {item.separatorAfter && <hr className="cds-menu-separator" />}
        </React.Fragment>
      ))}
    </>
  );
}

export function DropdownMenu({ trigger, items }: { trigger: React.ReactElement; items: MenuItemDef[] }) {
  const [open, setOpen] = useState(false);
  return (
    <span style={{ position: "relative", display: "inline-block" }}>
      {React.cloneElement(trigger, { onClick: () => setOpen((o) => !o), "aria-haspopup": "menu", "aria-expanded": open })}
      {open && (
        <div className="cds-menu" role="menu" style={{ position: "absolute", top: "calc(100% + 6px)", right: 0, zIndex: 30 }} onMouseLeave={() => setOpen(false)}>
          <MenuItems items={items} onDone={() => setOpen(false)} />
        </div>
      )}
    </span>
  );
}

export type PopoverPlacement = "top" | "right" | "bottom" | "left";
const popoverPlacementStyle: Record<PopoverPlacement, React.CSSProperties> = {
  bottom: { top: "calc(100% + 8px)", left: 0 },
  top: { bottom: "calc(100% + 8px)", left: 0 },
  right: { left: "calc(100% + 8px)", top: 0 },
  left: { right: "calc(100% + 8px)", top: 0 },
};

/**
 * Previously the trigger only got an onClick — for a non-button trigger
 * (DatePicker's own is a text input) that means no keyboard path opens the
 * popover at all: Enter does nothing on a plain input, Space just types a
 * space (blocked here since it's readOnly, but still consumed, doing
 * nothing useful). Also had no Escape-to-close and no click-outside-to-close,
 * both expected of any popup per the WAI-ARIA Dialog/Popup patterns Radix
 * and shadcn's Popover both implement.
 */
export function Popover({ trigger, children, placement = "bottom" }: { trigger: React.ReactElement; children: React.ReactNode; placement?: PopoverPlacement }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLSpanElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onDocPointerDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onDocKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("mousedown", onDocPointerDown);
    document.addEventListener("keydown", onDocKeyDown);
    return () => {
      document.removeEventListener("mousedown", onDocPointerDown);
      document.removeEventListener("keydown", onDocKeyDown);
    };
  }, [open]);

  const toggle = () => setOpen((o) => !o);

  return (
    <span ref={rootRef} style={{ position: "relative", display: "inline-block" }}>
      {React.cloneElement(trigger, {
        ref: (el: HTMLElement | null) => {
          triggerRef.current = el;
          const childRef = (trigger as any).ref;
          if (typeof childRef === "function") childRef(el);
          else if (childRef) childRef.current = el;
        },
        onClick: toggle,
        onKeyDown: (e: React.KeyboardEvent) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            toggle();
          }
        },
        "aria-haspopup": "dialog",
        "aria-expanded": open,
      })}
      {open && (
        <div className="cds-popover" role="dialog" style={{ position: "absolute", zIndex: 30, ...popoverPlacementStyle[placement] }}>
          {children}
        </div>
      )}
    </span>
  );
}

export function Spinner({ label = "Loading" }: { label?: string }) {
  return <span className="cds-spinner" role="status" aria-label={label} />;
}

export type ToastTone = "success" | "danger" | "warning" | "info";

// Same icon per tone as Alert (Misc.tsx's ALERT_ICON) — severity reads from
// the icon glyph, not just the badge color, so it doesn't rely on color
// alone (WCAG 1.4.1), and a success toast and a success alert use the same
// shape for "success" throughout the library.
const TOAST_ICON: Record<ToastTone, string> = {
  success: "fa-solid fa-circle-check",
  warning: "fa-solid fa-triangle-exclamation",
  danger: "fa-solid fa-circle-exclamation",
  info: "fa-solid fa-circle-info",
};

export function Toast({ tone = "info", title, timestamp, onClose, children }: { tone?: ToastTone; title: string; timestamp?: string; onClose?: () => void; children?: React.ReactNode }) {
  return (
    <div className={`cds-toast cds-toast--${tone}`} role={tone === "danger" ? "alert" : "status"}>
      <span className="cds-toast__icon-badge" aria-hidden="true">
        <Icon name={TOAST_ICON[tone]} size="sm" />
      </span>
      <div className="cds-toast-content">
        <div className="cds-toast-header">
          <strong className="cds-toast-title">{title}</strong>
          {timestamp && <span className="cds-toast-timestamp">{timestamp}</span>}
        </div>
        {children && <div className="cds-toast-body">{children}</div>}
      </div>
      {onClose && (
        <button type="button" className="cds-toast-close" aria-label="Dismiss notification" onClick={onClose}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M2 2L10 10M10 2L2 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      )}
    </div>
  );
}
