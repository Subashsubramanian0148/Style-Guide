import React, { useEffect, useRef, useState } from "react";
import { rgbStringToHex } from "./lib/contrast";
import { ContrastBadge } from "./ContrastBadge";

/**
 * Renders a swatch for a CSS custom property (e.g. --core-color-bg-page) and
 * measures its *actual rendered* color to compute contrast — correct for both
 * light and dark mode since the value differs per data-mode ancestor.
 */
export function RoleSwatch({ name, varName }: { name: string; varName: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [hex, setHex] = useState<string | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    const bg = getComputedStyle(ref.current).backgroundColor;
    setHex(rgbStringToHex(bg));
  }, [varName]);

  return (
    <div className="token-swatch">
      <div ref={ref} className="chip" style={{ background: `var(${varName})` }} />
      <div className="meta">
        <div className="name">{name}</div>
        <div className="value">{varName}</div>
        {hex && (
          <div style={{ marginTop: 6 }}>
            <ContrastBadge hex={hex} />
          </div>
        )}
      </div>
    </div>
  );
}
