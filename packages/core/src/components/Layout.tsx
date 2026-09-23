import React from "react";

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

/** The two slots every app header needs: a brand/logo on the left, account/
 *  utility actions on the right. AppShell's `header` prop already supplies
 *  the flex row (space-between) and chrome (background, border, height) —
 *  this just fills the two ends of it consistently. */
export function AppHeader({ brand, actions }: { brand: React.ReactNode; actions?: React.ReactNode }) {
  return (
    <>
      <div className="cds-app-header-brand">{brand}</div>
      {actions && <div className="cds-app-header-actions">{actions}</div>}
    </>
  );
}

/** Copyright/legal text on the left, links on the right — wraps to stack on
 *  narrow screens rather than truncating either side. */
export function AppFooter({ copyright, links }: { copyright: React.ReactNode; links?: React.ReactNode }) {
  return (
    <div className="cds-app-footer-inner">
      <span>{copyright}</span>
      {links && <div className="cds-app-footer-links">{links}</div>}
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
