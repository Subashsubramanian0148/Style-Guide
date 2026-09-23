import React, { createContext, useContext, useState } from "react";

export type PreviewMode = "light" | "dark";

interface PreviewModeContextValue {
  mode: PreviewMode;
  toggle: () => void;
}

const PreviewModeContext = createContext<PreviewModeContextValue | null>(null);

/**
 * One light/dark switch drives every demo canvas on the site, instead of
 * each Preview owning its own toggle — flipping it lets you compare every
 * component and variant on a page in the same mode at once.
 */
export function PreviewModeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<PreviewMode>("light");
  const toggle = () => setMode((prev) => (prev === "light" ? "dark" : "light"));
  return <PreviewModeContext.Provider value={{ mode, toggle }}>{children}</PreviewModeContext.Provider>;
}

export function usePreviewMode() {
  const ctx = useContext(PreviewModeContext);
  if (!ctx) throw new Error("usePreviewMode must be used within a PreviewModeProvider");
  return ctx;
}
