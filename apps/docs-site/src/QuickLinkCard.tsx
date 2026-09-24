import React from "react";
import { Icon } from "../../../packages/core/src/components/Primitives";

export function CardQuickLink({ icon, label, selected, disabled }: { icon: string; label: string; selected?: boolean; disabled?: boolean }) {
  return (
    <button
      type="button"
      className="cds-quicklink"
      data-selected={selected || undefined}
      disabled={disabled}
      aria-pressed={selected || undefined}
    >
      <span className="cds-quicklink-icon" aria-hidden="true">
        <Icon name={icon} size="md" />
      </span>
      <span className="cds-quicklink-label">{label}</span>
    </button>
  );
}
