import React, { useEffect, useId, useRef, useState } from "react";

/**
 * Page shell + grid primitives — the structural layer every product screen is
 * assembled from (header / sidebar / main / footer, and a token-driven 12-column
 * grid for laying out content inside `main`). No pixel values live here: spacing
 * comes from the `space` scale, columns are a structural count, not a size.
 */

export function AppShell({
  header,
  sidebar,
  footer,
  children,
}: {
  header?: React.ReactNode;
  sidebar?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="cds-app-shell">
      {header && <header className="cds-app-header">{header}</header>}
      <div className="cds-app-body">
        {sidebar && <aside className="cds-app-shell-sidebar">{sidebar}</aside>}
        <main className="cds-app-main">{children}</main>
      </div>
      {footer && <footer className="cds-app-footer">{footer}</footer>}
    </div>
  );
}

export interface HeaderUtility {
  label: string;
  icon: React.ReactNode;
  onClick?: () => void;
}

export interface AccountMenuItem {
  label: string;
  icon: React.ReactNode;
  tone?: "default" | "danger";
  onSelect?: () => void;
}

export interface HeaderAccount {
  name: string;
  email: string;
  avatarSrc?: string;
  items: AccountMenuItem[];
}

/** Avatar trigger + account dropdown. `utilities` repeat inside the menu on
 *  narrow screens, where the header hides its icon buttons. */
export function AccountMenu({ account, utilities = [], defaultOpen = false }: { account: HeaderAccount; utilities?: HeaderUtility[]; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  const rootRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const initials = account.name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("");

  return (
    <div className="cds-account-menu" ref={rootRef}>
      <button
        type="button"
        className="cds-account-trigger"
        aria-label={`Account menu for ${account.name}`}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((v) => !v)}
      >
        {account.avatarSrc ? <img src={account.avatarSrc} alt="" /> : <span className="cds-account-initials">{initials}</span>}
      </button>
      {open && (
        <div className="cds-account-dropdown" id={menuId} role="menu" aria-label="Account">
          {utilities.length > 0 && (
            <div className="cds-account-utils">
              {utilities.map((u) => (
                <button key={u.label} type="button" role="menuitem" className="cds-account-util" onClick={u.onClick}>
                  {u.icon}
                  {u.label}
                </button>
              ))}
            </div>
          )}
          <div className="cds-account-identity">
            <span className="cds-account-identity-label">Username</span>
            <span className="cds-account-identity-value">{account.email}</span>
          </div>
          {account.items.map((item) => (
            <button
              key={item.label}
              type="button"
              role="menuitem"
              className={`cds-account-option${item.tone === "danger" ? " cds-account-option--danger" : ""}`}
              onClick={() => {
                item.onSelect?.();
                setOpen(false);
              }}
            >
              <span className="cds-account-option-icon" aria-hidden="true">{item.icon}</span>
              <span className="cds-account-option-label">{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/** Brand on the left; round utility icon buttons and the account menu on the
 *  right. AppShell's `header` prop supplies the row chrome (background,
 *  border, height); standalone use wraps this in `.cds-app-header`. */
export function AppHeader({
  brand,
  actions,
  utilities,
  account,
}: {
  brand: React.ReactNode;
  actions?: React.ReactNode;
  utilities?: HeaderUtility[];
  account?: HeaderAccount;
}) {
  const hasRight = actions || utilities?.length || account;
  return (
    <>
      <div className="cds-app-header-brand">{brand}</div>
      {hasRight && (
        <div className="cds-app-header-actions">
          {utilities?.map((u) => (
            <button key={u.label} type="button" className="cds-app-header-icon-btn" aria-label={u.label} onClick={u.onClick}>
              {u.icon}
            </button>
          ))}
          {actions}
          {account && <AccountMenu account={account} utilities={utilities} />}
        </div>
      )}
    </>
  );
}

/** Copyright/legal text on the left, links on the right — wraps to stack on
 *  narrow screens rather than truncating either side. */
export function AppFooter({ copyright, links }: { copyright: React.ReactNode; links?: React.ReactNode }) {
  return (
    <div className="cds-app-footer-inner">
      <p className="cds-app-footer-copy">{copyright}</p>
      {links && (
        <nav className="cds-app-footer-links" aria-label="Legal">
          {links}
        </nav>
      )}
    </div>
  );
}

export function Container({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`cds-container ${className}`}>{children}</div>;
}

export type GridGap = "2" | "3" | "4" | "6" | "8";

export function Grid({
  columns = 12,
  gap = "6",
  children,
  className = "",
  style,
}: {
  columns?: number;
  gap?: GridGap;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`cds-grid cds-grid--gap-${gap} ${className}`}
      style={{ gridTemplateColumns: `repeat(${columns}, 1fr)`, ...style }}
    >
      {children}
    </div>
  );
}

export function GridCol({
  span = 12,
  spanMd,
  children,
  className = "",
}: {
  /** Columns spanned at the base (mobile-first) breakpoint. */
  span?: number;
  /** Columns spanned at the `md` breakpoint and above — falls back to `span`. */
  spanMd?: number;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`cds-grid-col ${className}`}
      style={{ gridColumn: `span ${span}`, ["--cds-grid-col-span-md" as any]: spanMd ?? span }}
    >
      {children}
    </div>
  );
}
