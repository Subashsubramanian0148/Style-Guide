import React from "react";
import { AppShell, AppHeader, AppFooter } from "../../../../../packages/core/src/components/Layout";
import { AppSidebar, MobileNav } from "../../../../../packages/core/src/components/Navigation";
import { Icon } from "../../../../../packages/core/src/components/Primitives";
import { BrandLogo, headerAccount, headerUtilities } from "../../SectionAnatomies";

/** Shared pieces of the Screen reference screens: the LendGuard app shell
 *  (CORE AppShell + AppHeader + rail AppSidebar + MobileNav + AppFooter) and
 *  the text wrapper that records each element's intended text style. */

export const NAV = [
  { key: "dashboard", label: "Dashboard", icon: "fa-solid fa-table-cells-large" },
  { key: "portfolio", label: "Investment portfolio", icon: "fa-solid fa-wallet" },
  { key: "transactions", label: "Transactions", icon: "fa-solid fa-right-left" },
  { key: "profile", label: "My profile", icon: "fa-solid fa-user" },
  { key: "documents", label: "Document Center", icon: "fa-solid fa-file-lines" },
];

/** Text that carries its intended typography style for the docs. */
export function T({ as = "span", t, className, children, ...rest }: { as?: keyof JSX.IntrinsicElements; t: string; className?: string; children: React.ReactNode; href?: string } & React.HTMLAttributes<HTMLElement>) {
  const Tag = as as any;
  return <Tag data-type={t} className={className} {...rest}>{children}</Tag>;
}

export function PortalShell({ current, footer = true, children }: { current: string; footer?: boolean; children: React.ReactNode }) {
  return (
    <AppShell
      header={<AppHeader brand={<BrandLogo />} utilities={headerUtilities} account={headerAccount} />}
      sidebar={
        <>
          <AppSidebar variant="rail" items={NAV.map((n) => ({ label: n.label, icon: <Icon name={n.icon} size="lg" />, current: n.key === current }))} />
          <div className="sr-nav-brand" aria-hidden="true">
            <img className="sr-light" src="/brand/core/core-logo-light.svg" alt="" />
            <img className="sr-dark" src="/brand/core/core-logo-dark.svg" alt="" />
          </div>
        </>
      }
      footer={footer ? <AppFooter copyright="© 2026 LendGuard." links={<><a href="#">Privacy</a><a href="#">Terms</a></>} /> : undefined}
    >
      {children}
      <div className="sr-mobile-nav">
        <MobileNav
          items={[{ id: "dashboard", label: "Dashboard", icon: "fa-solid fa-table-cells-large" }, { id: "settings", label: "Settings", icon: "fa-solid fa-gear" }]}
          activeId={current === "dashboard" ? "dashboard" : undefined}
          menu={NAV.filter((n) => n.key !== "dashboard").map((n) => ({ id: n.key, label: n.label, icon: n.icon }))}
          activeLinkId={current}
        />
      </div>
    </AppShell>
  );
}

export function Note({ children }: { children: React.ReactNode }) {
  return (
    <p className="sr-note">
      <Icon name="fa-solid fa-circle-info" size="sm" />
      <T t="text12Regular">{children}</T>
    </p>
  );
}

