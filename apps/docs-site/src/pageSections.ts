/** Section anchors for pages whose sidebar only lists the page itself (no per-section links). */
export const pageSections: Record<string, { hash: string; label: string }[]> = {
  "/": [
    { hash: "#whats-in-this-site", label: "What's in this site" },
    { hash: "#foundation", label: "Foundation" },
    { hash: "#components", label: "Components" },
    { hash: "#suggested-path", label: "Suggested path" },
  ],
  "/foundations/logo": [
    { hash: "#core-mark", label: "CORE mark" },
    { hash: "#anatomy-spacing", label: "Anatomy & Spacing" },
    { hash: "#client-logo", label: "Client logo" },
  ],
  "/foundations/typography": [
    { hash: "#typeface", label: "Typeface" },
    { hash: "#type-scale", label: "Type scale" },
    { hash: "#spacing-padding", label: "Spacing & Padding" },
    { hash: "#border-radius", label: "Border Radius" },
    { hash: "#elevation-shadows", label: "Elevation & Shadows" },
    { hash: "#icon-sizing", label: "Icon Sizing" },
  ],
  "/foundations/color": [
    { hash: "#full-color-scales", label: "Full color scales" },
    { hash: "#base-colors", label: "Base colors" },
  ],
};
