import React, { useLayoutEffect, useRef, useState } from "react";
import { Dropzone, AttachmentList } from "../../../packages/core/src/components/Attachment";
import { Badge } from "../../../packages/core/src/components/Misc";
import { Icon } from "../../../packages/core/src/components/Primitives";
import { AnatomyFrame, SpacingBand, RegionPadding, AutoBand, GapCallout, HGapCallout, VGapMark } from "./AnatomyPrimitives";

interface Region {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface RowGap {
  y: number;
  width: number;
  height: number;
}

const CALLOUT_ORANGE = "#C2410C";

/**
 * Spacing anatomy for the Attachment "Success" state, measured from the live
 * Dropzone/AttachmentList/Badge components. Padding/gap values (16, 12, 8,
 * 6, 4) are fixed to the approved reference spec; positions are still
 * located dynamically so the diagram tracks the live layout.
 */
export function AttachmentAnatomy() {
  const boxRef = useRef<HTMLDivElement>(null);
  const [headerAuto, setHeaderAuto] = useState<Region | null>(null);
  const [headerIconGap, setHeaderIconGap] = useState<{ x: number; width: number } | null>(null);
  const [badgeRegion, setBadgeRegion] = useState<Region | null>(null);
  const [dropzoneRegion, setDropzoneRegion] = useState<Region | null>(null);
  const [dropzoneTextGap, setDropzoneTextGap] = useState<RowGap | null>(null);
  const [headerToDropzoneGap, setHeaderToDropzoneGap] = useState<RowGap | null>(null);
  const [dropzoneToListGap, setDropzoneToListGap] = useState<RowGap | null>(null);
  const [rowGap, setRowGap] = useState<RowGap | null>(null);
  const [firstRowRegion, setFirstRowRegion] = useState<Region | null>(null);
  const [rowInternalGaps, setRowInternalGaps] = useState<{ x: number; y: number; height: number }[] | null>(null);

  useLayoutEffect(() => {
    const box = boxRef.current;
    const headerIcon = box?.querySelector(".cds-attachment-anatomy-header .cds-icon") as HTMLElement | null;
    const headerText = headerIcon?.nextSibling as ChildNode | null;
    const headerRow = box?.querySelector(".cds-attachment-anatomy-header") as HTMLElement | null;
    const badge = box?.querySelector(".cds-attachment-anatomy-header .cds-badge") as HTMLElement | null;
    const dropzone = box?.querySelector(".cds-dropzone") as HTMLElement | null;
    const dropzoneTitle = dropzone?.querySelector(".cds-dropzone-title") as HTMLElement | null;
    const dropzoneHint = dropzone?.querySelector(".cds-dropzone-hint") as HTMLElement | null;
    const list = box?.querySelector(".cds-attachment-list") as HTMLElement | null;
    const rows = list ? (Array.from(list.querySelectorAll(".cds-attachment")) as HTMLElement[]) : [];
    if (!box || !headerIcon || !headerText || !headerRow || !badge || !dropzone || !dropzoneTitle || !dropzoneHint || !list || rows.length < 2) return;

    const boxRect = box.getBoundingClientRect();
    const headerIconRect = headerIcon.getBoundingClientRect();
    const headerRowRect = headerRow.getBoundingClientRect();
    const badgeRect = badge.getBoundingClientRect();
    const dropzoneRect = dropzone.getBoundingClientRect();
    const dropzoneTitleRect = dropzoneTitle.getBoundingClientRect();
    const dropzoneHintRect = dropzoneHint.getBoundingClientRect();
    const row1Rect = rows[0].getBoundingClientRect();
    const row2Rect = rows[1].getBoundingClientRect();

    const headerTextRange = document.createRange();
    headerTextRange.selectNodeContents(headerText);
    const headerTextRect = headerTextRange.getBoundingClientRect();

    setHeaderIconGap({
      x: Math.round(headerIconRect.right - boxRect.left),
      width: Math.round(headerTextRect.left - headerIconRect.right),
    });
    setHeaderAuto({
      x: Math.round(headerTextRect.right - boxRect.left),
      y: Math.round(headerTextRect.top - boxRect.top),
      width: Math.round(badgeRect.left - headerTextRect.right),
      height: Math.round(headerTextRect.height),
    });
    setBadgeRegion({
      x: Math.round(badgeRect.left - boxRect.left),
      y: Math.round(badgeRect.top - boxRect.top),
      width: Math.round(badgeRect.width),
      height: Math.round(badgeRect.height),
    });
    setDropzoneRegion({
      x: Math.round(dropzoneRect.left - boxRect.left),
      y: Math.round(dropzoneRect.top - boxRect.top),
      width: Math.round(dropzoneRect.width),
      height: Math.round(dropzoneRect.height),
    });
    setDropzoneTextGap({
      y: Math.round(dropzoneTitleRect.bottom - boxRect.top),
      width: Math.round(dropzoneRect.width),
      height: Math.round(dropzoneHintRect.top - dropzoneTitleRect.bottom),
    });
    setHeaderToDropzoneGap({
      y: Math.round(headerRowRect.bottom - boxRect.top),
      width: Math.round(boxRect.width),
      height: Math.round(dropzoneRect.top - headerRowRect.bottom),
    });
    setDropzoneToListGap({
      y: Math.round(dropzoneRect.bottom - boxRect.top),
      width: Math.round(boxRect.width),
      height: Math.round(list.getBoundingClientRect().top - dropzoneRect.bottom),
    });
    setRowGap({
      y: Math.round(row1Rect.bottom - boxRect.top),
      width: Math.round(boxRect.width),
      height: Math.round(row2Rect.top - row1Rect.bottom),
    });
    setFirstRowRegion({
      x: Math.round(row1Rect.left - boxRect.left),
      y: Math.round(row1Rect.top - boxRect.top),
      width: Math.round(row1Rect.width),
      height: Math.round(row1Rect.height),
    });

    const rowIcon = rows[0].querySelector(".cds-attachment-icon") as HTMLElement | null;
    const rowBody = rows[0].querySelector(".cds-attachment-body") as HTMLElement | null;
    const rowBadge = rows[0].querySelector(".cds-attachment-badge") as HTMLElement | null;
    const rowRemove = rows[0].querySelector(".cds-attachment-remove") as HTMLElement | null;
    if (rowIcon && rowBody && rowBadge) {
      const rowIconRect = rowIcon.getBoundingClientRect();
      const rowBodyRect = rowBody.getBoundingClientRect();
      const rowBadgeRect = rowBadge.getBoundingClientRect();
      const gapY = Math.round(row1Rect.top - boxRect.top);
      const gapHeight = Math.round(row1Rect.height);
      const gaps = [
        { x: Math.round(rowIconRect.right - boxRect.left) + Math.round((rowBodyRect.left - rowIconRect.right) / 2), y: gapY, height: gapHeight },
        { x: Math.round(rowBodyRect.right - boxRect.left) + Math.round((rowBadgeRect.left - rowBodyRect.right) / 2), y: gapY, height: gapHeight },
      ];
      if (rowRemove) {
        const rowRemoveRect = rowRemove.getBoundingClientRect();
        gaps.push({ x: Math.round(rowBadgeRect.right - boxRect.left) + Math.round((rowRemoveRect.left - rowBadgeRect.right) / 2), y: gapY, height: gapHeight });
      }
      setRowInternalGaps(gaps);
    }
  }, []);

  return (
    <AnatomyFrame>
      <div ref={boxRef} style={{ position: "relative", width: 918, display: "flex", flexDirection: "column", gap: 12, marginTop: 46, marginLeft: 50 }}>
        <div
          className="cds-attachment-anatomy-header"
          style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}
        >
          <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "var(--typography-body-md-size)", fontWeight: 600, color: "var(--core-color-status-success-text)" }}>
            <Icon name="fa-solid fa-circle-check" size="sm" />
            Success State
          </span>
          <Badge tone="success" variant="soft" size="sm">Complete</Badge>
        </div>

        <Dropzone
          status="success"
          icon={<Icon name="fa-solid fa-circle-check" size="md" color="var(--core-color-status-success-text)" />}
          label={<span>File uploaded successfully, or <strong>browse more</strong></span>}
          hint="All files passed security and format verification."
        />

        <AttachmentList
          files={[
            { id: "a1", name: "beneficiary-form.pdf", size: "212 KB", status: "success", statusText: "Uploaded", badgeSize: "md" },
            { id: "a2", name: "voided-check.png", size: "480 KB", status: "success", statusText: "Verified", badgeSize: "sm" },
          ]}
          onRemove={() => {}}
        />

        {headerIconGap && <GapCallout x={headerIconGap.x} width={headerIconGap.width} value={8} />}
        {headerAuto && <AutoBand x={headerAuto.x} y={headerAuto.y} width={headerAuto.width} height={headerAuto.height} />}
        {badgeRegion && <RegionPadding x={badgeRegion.x} y={badgeRegion.y} width={badgeRegion.width} height={badgeRegion.height} size={4} edges={["top", "bottom"]} />}
        {badgeRegion && <RegionPadding x={badgeRegion.x} y={badgeRegion.y} width={badgeRegion.width} height={badgeRegion.height} size={8} edges={["left", "right"]} />}

        {headerToDropzoneGap && <HGapCallout y={headerToDropzoneGap.y} width={headerToDropzoneGap.width} height={headerToDropzoneGap.height} value={12} color={CALLOUT_ORANGE} side="left" />}

        {dropzoneRegion && <RegionPadding x={dropzoneRegion.x} y={dropzoneRegion.y} width={dropzoneRegion.width} height={dropzoneRegion.height} size={16} />}
        {dropzoneTextGap && <HGapCallout y={dropzoneTextGap.y} width={dropzoneTextGap.width} height={dropzoneTextGap.height} value={4} side="left" />}

        {dropzoneToListGap && <HGapCallout y={dropzoneToListGap.y} width={dropzoneToListGap.width} height={dropzoneToListGap.height} value={12} color={CALLOUT_ORANGE} side="left" />}

        {firstRowRegion && <RegionPadding x={firstRowRegion.x} y={firstRowRegion.y} width={firstRowRegion.width} height={firstRowRegion.height} size={12} />}
        {rowInternalGaps?.map((g, i) => <VGapMark key={i} x={g.x} y={g.y} height={g.height} value={12} />)}
        {rowGap && <HGapCallout y={rowGap.y} width={rowGap.width} height={rowGap.height} value={8} color={CALLOUT_ORANGE} side="left" />}
      </div>
    </AnatomyFrame>
  );
}
