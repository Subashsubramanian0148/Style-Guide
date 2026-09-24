import React, { useState } from "react";
import { Icon } from "../../../packages/core/src/components/Primitives";

/** Toggles between a component's live demo and its code-built spacing
 *  anatomy — switching one out for the other, not stacking both. */
export function AnatomySection({ demo, anatomy }: { demo: React.ReactNode; anatomy: React.ReactNode }) {
  const [showAnatomy, setShowAnatomy] = useState(false);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
        <button
          type="button"
          onClick={() => setShowAnatomy((v) => !v)}
          aria-pressed={showAnatomy}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "var(--core-space-1) var(--core-space-3)",
            borderRadius: "var(--core-radius-md)",
            border: "1px solid var(--core-color-border-default)",
            background: showAnatomy ? "var(--core-color-bg-selected)" : "var(--core-color-bg-surface)",
            color: "var(--core-color-text-secondary)",
            fontSize: "var(--typography-body-sm-size)",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          <Icon name="fa-solid fa-ruler-combined" size="sm" />
          {showAnatomy ? "Hide anatomy" : "Show anatomy"}
        </button>
      </div>

      {showAnatomy ? anatomy : demo}
    </div>
  );
}
