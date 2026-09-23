import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { CoreLogo } from "./CoreLogo";
import { flatComponentLinks, totalComponentCount, type NavLink } from "./navConfig";
import { pageSections } from "./pageSections";
import { useScrollSpy } from "./useScrollSpy";
import { PreviewModeProvider, usePreviewMode } from "./PreviewModeContext";
import { Switch } from "../../../packages/core/src/components/Misc";

const nav = [
  { group: "Get Started", links: [{ to: "/", label: "Overview" }] },
  {
    group: "Foundation",
    links: [
      { to: "/foundations/logo", label: "Logo" },
      { to: "/foundations/color", label: "Color" },
      { to: "/foundations/typography", label: "Typography" },
    ],
  },
  {
    group: "Component",
    links: [
      { to: "/components", label: `All Components (${totalComponentCount})` },
      ...flatComponentLinks,
    ],
  },
];

function getGroupLinks(group: { links: NavLink[] }) {
  return group.links;
}

// Scrolls to the element matching the hash in the URL.
// In a HashRouter the location.hash gives us the anchor (e.g. "#accordion").
// We wait a tick so the page has time to render before scrolling.
function useAnchorScroll() {
  const location = useLocation();
  React.useEffect(() => {
    // location.hash is the anchor part e.g. "#accordion"
    const anchor = location.hash ? location.hash.slice(1) : undefined;
    const t = setTimeout(() => {
      if (anchor) {
        const el = document.getElementById(anchor);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }, 80);
    return () => clearTimeout(t);
  }, [location.pathname, location.hash]);
}

/** The site chrome (sidebar, background, nav) now follows the same global
 *  Light/Dark switch as every demo canvas, instead of only the individual
 *  components going dark while the surrounding page stayed light. */
function useSiteMode() {
  const { mode, toggle } = usePreviewMode();
  useEffect(() => {
    document.documentElement.setAttribute("data-site-mode", mode);
    try { localStorage.setItem("core-site-mode", mode); } catch { }
  }, [mode]);

  return { mode, toggle };
}

function splitNavTo(to: string) {
  const hashIndex = to.indexOf("#");
  return hashIndex === -1
    ? { path: to, hash: "" }
    : { path: to.slice(0, hashIndex), hash: to.slice(hashIndex) };
}

/** Hash-anchored sidebar links for the current page (component pages). */
function getNavHashesForPath(pathname: string) {
  const seen = new Set<string>();
  const result: { hash: string; label: string }[] = [];
  for (const group of nav) {
    for (const link of getGroupLinks(group)) {
      const { path, hash } = splitNavTo(link.to);
      if (path === pathname && hash && !seen.has(hash)) {
        seen.add(hash);
        result.push({ hash, label: link.label });
      }
    }
  }
  return result;
}

// A link is only "active" when both its pathname AND its hash (when it has
// one) match the current location. Plain react-router `NavLink` only ever
// compares pathname — every `#anchor` link sharing a page (e.g. all of
// Overlays' Modal/Drawer/Popover/… links, which all point at
// /components/overlays with a different hash each) would light up together,
// since none of them differ by pathname. That was a real, reproduced bug.
// scrollHash comes from useScrollSpy so hash links update while scrolling.
function isNavLinkActive(to: string, pathname: string, hash: string, scrollHash: string) {
  const { path: toPath, hash: toHash } = splitNavTo(to);
  if (pathname !== toPath) return false;

  if (toHash) {
    const effectiveHash = scrollHash || hash;
    return effectiveHash === toHash;
  }

  // Page link without hash (e.g. Typography, All Components).
  const hasInNavSubLinks = getNavHashesForPath(pathname).length > 0;
  if (hasInNavSubLinks) {
    return !scrollHash && !hash;
  }
  return true;
}

/** Flat, ordered list of unique pages derived from the sidebar `nav` array.
 *  Hash-anchored links (e.g. /components/forms#input) collapse into a single
 *  entry per pathname, labelled by the group name when a page hosts multiple
 *  sections, or by the link label when it's a standalone page. */
const pages: { path: string; label: string }[] = (() => {
  const seen = new Set<string>();
  const list: { path: string; label: string }[] = [];
  for (const group of nav) {
    const links = getGroupLinks(group);
    for (const link of links) {
      const hashIdx = link.to.indexOf("#");
      const pathname = hashIdx === -1 ? link.to : link.to.slice(0, hashIdx);
      if (seen.has(pathname)) continue;
      seen.add(pathname);
      const linksForPath = links.filter((l) => {
        const hi = l.to.indexOf("#");
        return (hi === -1 ? l.to : l.to.slice(0, hi)) === pathname;
      });
      list.push({
        path: pathname,
        label: linksForPath.length > 1 ? group.group : link.label,
      });
    }
  }
  return list;
})();

function PageNavigation() {
  const location = useLocation();
  const currentIdx = pages.findIndex((p) => p.path === location.pathname);
  const prev = currentIdx > 0 ? pages[currentIdx - 1] : null;
  const next = currentIdx >= 0 && currentIdx < pages.length - 1 ? pages[currentIdx + 1] : null;

  if (!prev && !next) return null;

  return (
    <nav className="page-nav" aria-label="Page navigation">
      {prev ? (
        <Link to={prev.path} className="page-nav-link page-nav-prev">
          <span className="page-nav-dir">← Previous</span>
          <span className="page-nav-label">{prev.label}</span>
        </Link>
      ) : <span />}
      {next ? (
        <Link to={next.path} className="page-nav-link page-nav-next">
          <span className="page-nav-dir">Next →</span>
          <span className="page-nav-label">{next.label}</span>
        </Link>
      ) : <span />}
    </nav>
  );
}

/** Fixed to the right edge of the viewport, vertically centered, so it's
 *  reachable from anywhere on the page instead of scrolling back to the
 *  sidebar — one switch drives every demo canvas's light/dark mode. */
function GlobalPreviewModeToggle() {
  const { mode, toggle } = usePreviewMode();
  return (
    <div
      style={{
        position: "fixed",
        top: "50%",
        right: 20,
        transform: "translateY(-50%)",
        zIndex: 1000,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 10,
        background: "var(--site-bg-elevated)",
        border: "1px solid var(--site-border)",
        borderRadius: "var(--core-radius-lg, 16px)",
        padding: "16px 10px",
        boxShadow: "var(--core-elevation-3)",
      }}
    >
      <span style={{ fontSize: "var(--typography-font-size-xs)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: mode === "light" ? "var(--site-text)" : "var(--site-text-dim)" }}>
        Light
      </span>
      <Switch
        checked={mode === "dark"}
        onChange={toggle}
        aria-label="Toggle every demo canvas between light and dark mode"
      />
      <span style={{ fontSize: "var(--typography-font-size-xs)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: mode === "dark" ? "var(--site-text)" : "var(--site-text-dim)" }}>
        Dark
      </span>
    </div>
  );
}

function LayoutInner() {
  useAnchorScroll();
  const { mode, toggle } = useSiteMode();
  const location = useLocation();
  const sidebarRef = useRef<HTMLElement>(null);

  const spyHashes = useMemo(() => {
    const fromPage = pageSections[location.pathname] ?? [];
    const fromNav = getNavHashesForPath(location.pathname);
    const seen = new Set<string>();
    return [...fromPage, ...fromNav]
      .map((s) => s.hash)
      .filter((hash) => {
        if (seen.has(hash)) return false;
        seen.add(hash);
        return true;
      });
  }, [location.pathname]);

  const scrollHash = useScrollSpy(location.pathname, spyHashes, location.hash);
  const onPageNav = pageSections[location.pathname] ?? [];

  // Keep the active sidebar link in view as the section changes — both on a
  // click (location.hash) and while scrolling the content (scrollHash).
  // `block: "nearest"` only nudges the sidebar's own scroll position enough
  // to reveal the active item; it never collapses or hides any other link.
  useEffect(() => {
    const sidebar = sidebarRef.current;
    if (!sidebar) return;
    const timer = window.setTimeout(() => {
      const active = sidebar.querySelector(".site-nav-link.active");
      active?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }, 120);
    return () => window.clearTimeout(timer);
  }, [location.pathname, location.hash, scrollHash]);

  return (
    // data-theme/data-mode here is what makes every CORE component actually
    // themed by default — --core-* custom properties only exist inside a
    // [data-theme][data-mode] scope, nothing falls back to a bare :root.
    // Individual demo boxes set their own data-theme/data-mode explicitly
    // (to force a specific mode for a side-by-side comparison, say), but any
    // *real* interactive component rendered outside one of those boxes — the
    // live Modal/Drawer/Toast a page's own "Open modal" button toggles, for
    // instance, not the static AutoAnatomy mockup above it — had no themed
    // ancestor at all and rendered with zero styling, plain browser defaults.
    // This is unrelated to the site's own light/dark chrome toggle
    // ([data-site-mode] on <html>, driven by useSiteMode() below) — that's a
    // separate --site-* variable system for the docs UI itself.
    <div className="site-shell" data-theme="core" data-mode={mode}>
      <a href="#main-content" className="site-skip-link">
        Skip to main content
      </a>
      <GlobalPreviewModeToggle />
      <aside className="site-sidebar" ref={sidebarRef} aria-label="Site navigation">
        <div className="site-logo" style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 6, padding: "8px 12px 20px" }}>
          <CoreLogo size={22} />
          <span style={{ fontSize: "var(--typography-font-size-xs)", fontWeight: 700, color: "var(--site-text-dim)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
            Participant Portal
          </span>
        </div>
        {nav.map((g) => (
          <div className="site-nav-group" key={g.group}>
            <div className="site-nav-title">{g.group}</div>
            {g.links.map((l, i) => (
              <Link
                key={l.to}
                to={l.to}
                className={
                  "site-nav-link" +
                  (i > 0 && g.group === "Component" ? " site-nav-link--sub" : "") +
                  (isNavLinkActive(l.to, location.pathname, location.hash, scrollHash) ? " active" : "")
                }
              >
                {l.label}
              </Link>
            ))}
          </div>
        ))}
        {onPageNav.length > 0 && (
          <div className="site-nav-group">
            <div className="site-nav-title">On this page</div>
            {onPageNav.map((s) => (
              <Link
                key={s.hash}
                to={{ pathname: location.pathname, hash: s.hash.replace(/^#/, "") }}
                className={
                  "site-nav-link site-nav-link--sub" +
                  ((scrollHash || location.hash) === s.hash ? " active" : "")
                }
              >
                {s.label}
              </Link>
            ))}
          </div>
        )}
      </aside>
      <main
        id="main-content"
        className="site-main"
        tabIndex={-1}
        style={location.pathname === "/" || location.pathname === "/components" ? { backgroundColor: "var(--site-bg-elevated)" } : undefined}
      >
        <div className="site-content" style={location.pathname === "/" || location.pathname === "/components" ? { maxWidth: "100%", padding: 0, backgroundColor: "var(--site-bg-elevated)" } : undefined}>
          <Outlet />
        </div>
        <footer className="site-footer" style={location.pathname === "/" || location.pathname === "/components" ? { backgroundColor: "var(--site-bg-elevated)", borderColor: "var(--site-border)" } : undefined}>
          <div className="site-footer-inner">
            <div className="site-footer-left">
              <CoreLogo size={16} />
              <span>© {new Date().getFullYear()} CORE Design System</span>
            </div>
            <div className="site-footer-right">
              <span>v0.1.0</span>
              <span className="site-footer-sep">·</span>
              <span>White-label foundation</span>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}

export default function Layout() {
  return (
    <PreviewModeProvider>
      <LayoutInner />
    </PreviewModeProvider>
  );
}
