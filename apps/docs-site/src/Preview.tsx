import React from "react";
import { usePreviewMode } from "./PreviewModeContext";

export function Preview({
  children,
  dark = false,
  showModeToggle = false,
}: {
  children: React.ReactNode;
  dark?: boolean;
  /** When true, this canvas follows the site-wide Light/Dark switch (in the
   *  sidebar) instead of always rendering in the `dark` prop's fixed mode. */
  showModeToggle?: boolean;
}) {
  const { mode: globalMode } = usePreviewMode();
  const resolvedMode = showModeToggle ? globalMode : dark ? "dark" : "light";

  return (
    <div>
      <div
        data-theme="core"
        data-mode={resolvedMode}
        className="preview-surface"
        style={{
          background: "var(--core-color-bg-page)",
          color: "var(--core-color-text-primary)",
          fontFamily: "var(--typography-font-family-sans)",
        }}
      >
        {children}
      </div>
    </div>
  );
}

export function CodeBlock({ children }: { children: string }) {
  return <pre className="code-block">{children}</pre>;
}
