import React, { useEffect, useState } from "react";

/**
 * CORE's own logomark, used only on this documentation site — never inside a
 * themed client application (see the Logo page's usage rules). Two variants
 * ship: light-surface (navy) and dark-surface (lavender) — picked
 * automatically from the site's current light/dark mode.
 */
export function CoreLogo({ size = 22 }: { size?: number }) {
  const [mode, setMode] = useState<"light" | "dark">(
    () => (document.documentElement.getAttribute("data-site-mode") as "light" | "dark") || "dark"
  );

  useEffect(() => {
    const el = document.documentElement;
    const observer = new MutationObserver(() => {
      setMode((el.getAttribute("data-site-mode") as "light" | "dark") || "dark");
    });
    observer.observe(el, { attributes: true, attributeFilter: ["data-site-mode"] });
    return () => observer.disconnect();
  }, []);

  const src = mode === "dark" ? "/brand/core/core-logo-dark.svg" : "/brand/core/core-logo-light.svg";
  // Source SVG's native aspect ratio is 400:148 (wordmark), so height = size, width scales.
  return <img src={src} alt="CORE" height={size} style={{ width: "auto", display: "block" }} />;
}
