import React from "react";
import { PaddingRing, GapMark } from "./AnatomyPrimitives";
import { Dropzone, AttachmentList } from "../../../packages/core/src/components/Attachment";
import { Badge } from "../../../packages/core/src/components/Misc";
import { Icon } from "../../../packages/core/src/components/Primitives";

/**
 * Spacing anatomy for the Attachment component, built from the live
 * Dropzone/AttachmentList/Badge components rather than a static screenshot —
 * values below are read directly from packages/core/src/styles/components.css
 * and packages/tokens/src/primitives.json, so they stay accurate as those
 * tokens change:
 *   .cds-dropzone        padding: core-space-4  (16px)
 *   .cds-attachment      padding: core-space-3  (12px), gap: core-space-3 (12px)
 *   .cds-attachment-meta gap: core-space-1      (4px)
 *   .cds-badge-size--sm  padding: core-space-1 core-space-2 (4px / 8px)
 */
export function AttachmentAnatomy() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 48, padding: "32px 24px" }}>
      <div>
        <p style={{ margin: "0 0 24px", fontSize: 13, fontWeight: 600, color: "var(--core-color-text-secondary)" }}>
          Header — icon-to-label gap
        </p>
        <div style={{ position: "relative", display: "inline-flex" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "var(--typography-body-md-size)", fontWeight: 600, color: "var(--core-color-status-success-text)" }}>
            <Icon name="fa-solid fa-circle-check" size="sm" />
            Success State
          </div>
          <GapMark value={6} style={{ top: -14, left: 20 }} />
        </div>
      </div>

      <div>
        <p style={{ margin: "0 0 24px", fontSize: 13, fontWeight: 600, color: "var(--core-color-text-secondary)" }}>
          Badge — padding (sm)
        </p>
        <PaddingRing top={4} left={8}>
          <Badge tone="success" variant="soft" size="sm">Complete</Badge>
        </PaddingRing>
      </div>

      <div>
        <p style={{ margin: "0 0 24px", fontSize: 13, fontWeight: 600, color: "var(--core-color-text-secondary)" }}>
          Status panel — padding
        </p>
        <PaddingRing top={16}>
          <div style={{ minWidth: 320 }}>
            <Dropzone
              status="success"
              icon={<Icon name="fa-solid fa-circle-check" size="md" color="var(--core-color-status-success-text)" />}
              label={<span>File uploaded successfully, or <strong>browse more</strong></span>}
              hint="All files passed security and format verification."
            />
          </div>
        </PaddingRing>
      </div>

      <div>
        <p style={{ margin: "0 0 24px", fontSize: 13, fontWeight: 600, color: "var(--core-color-text-secondary)" }}>
          File row — padding, internal gap, and meta separator gap
        </p>
        <PaddingRing top={12}>
          <div style={{ minWidth: 360, position: "relative" }}>
            <AttachmentList
              files={[{ id: "a1", name: "beneficiary-form.pdf", size: "212 KB", status: "success", statusText: "Uploaded", badgeSize: "md" }]}
              onRemove={() => {}}
            />
            <GapMark value={12} style={{ top: 8, left: 46 }} />
            <GapMark value={4} style={{ bottom: -6, left: 78 }} />
          </div>
        </PaddingRing>
      </div>
    </div>
  );
}
