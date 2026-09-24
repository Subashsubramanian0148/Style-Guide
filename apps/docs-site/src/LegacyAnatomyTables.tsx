import React from "react";
import { AnatomyTables, type AnatomySpecRow, type AnatomyQuery } from "./MeasuredAnatomy";
import { AccordionAnatomy } from "./AccordionAnatomy";
import { AlertAnatomy } from "./AlertAnatomy";
import { AttachmentAnatomy } from "./AttachmentAnatomy";
import { BadgeAnatomy } from "./BadgeAnatomy";
import { ButtonAnatomy } from "./ButtonAnatomy";
import { CheckboxRadioAnatomy } from "./CheckboxRadioAnatomy";
import { ComboboxAnatomy } from "./ComboboxAnatomy";
import { DatePickerAnatomy } from "./DatePickerAnatomy";
import { IconButtonAnatomy } from "./IconButtonAnatomy";
import { InputIconAnatomy } from "./InputIconAnatomy";
import { TooltipAnatomy } from "./TooltipAnatomy";

const pass = (label: string, token: string, value: string, note?: string): AnatomySpecRow => ({ label, token, value, standard: "pass", note });
const warn = (label: string, token: string, value: string, note: string): AnatomySpecRow => ({ label, token, value, standard: "warn", note });

/** Shared by Input (with icon) and Date Picker: both use the affix-wrap input. */
function trailingIconSpecs(q: AnatomyQuery): AnatomySpecRow[] {
  const textToIcon = q.gap({ content: ".cds-input", edge: "right" }, ".cds-input-icon", "x");
  const iconToEdge = q.gap(".cds-input-icon", { inner: ".cds-input", edge: "right" }, "x");
  return [
    pass("Label → field", "core-space-2", `${q.px(".cds-field", "row-gap")}px`),
    pass("Input padding", "core-space-2 / core-space-3", `${q.px(".cds-input", "padding-top")}px ${q.px(".cds-input", "padding-left")}px`),
    iconToEdge === 12
      ? pass("Icon → edge", "core-space-3", `${iconToEdge}px`)
      : warn("Icon → edge", "right: 12px (from outer edge)", `${iconToEdge}px`, "Figma: 12. The icon is offset from the outer edge, so the 1px border eats into it"),
    textToIcon === 8
      ? pass("Text → icon", "core-space-2", `${textToIcon}px`)
      : warn("Text → icon", "padding-right: core-space-8", `${textToIcon}px`, "Figma: 8. Shared by every input with an icon — left as-is pending a decision"),
    pass("Icon", "size sm", q.size(".cds-input-icon")),
    pass("Height", "core-size-control-md", `${q.el(".cds-input").offsetHeight}px`),
  ];
}

export function AccordionAnatomyFull() {
  return (
    <AnatomyTables
      layers={[
        { node: "Accordion", cls: ".cds-accordion", direction: "Vertical", alignment: "Top left", resizing: "Fill × Hug", spacing: "—" },
        { node: "Item", cls: ".cds-accordion-item", direction: "Vertical", alignment: "Top left", resizing: "Fill × Hug", spacing: "1px divider" },
        { node: "Trigger (button)", cls: ".cds-accordion-trigger", direction: "Horizontal", alignment: "Middle, space between", resizing: "Fill × Hug", spacing: "Gap 12 · Padding 16" },
        { node: "Panel", cls: ".cds-accordion-panel", direction: "Vertical", alignment: "Top left", resizing: "Fill × Hug", spacing: "Padding 16" },
      ]}
      specs={(q) => [
        pass("Trigger padding", "core-space-4", `${q.px(".cds-accordion-trigger", "padding-top")}px`),
        pass("Title → chevron", "core-space-3", `${q.px(".cds-accordion-trigger", "column-gap")}px`),
        pass("Panel padding", "core-space-4", `${q.px(".cds-accordion-panel", "padding-top")}px`),
        pass("Trigger text", "typography-body-md · semibold", q.type(".cds-accordion-trigger")),
        pass("Panel text", "typography-body-md", q.type(".cds-accordion-panel")),
      ]}
    >
      <AccordionAnatomy />
    </AnatomyTables>
  );
}

export function AlertAnatomyFull() {
  return (
    <AnatomyTables
      layers={[
        { node: "Alert", cls: ".cds-alert", direction: "Horizontal", alignment: "Top left", resizing: "Fill × Hug", spacing: "Gap 12 · Padding 16 (right 32)" },
        { node: "Icon", cls: ".cds-alert__icon", direction: "Horizontal", alignment: "Middle center", resizing: "Fixed 20", spacing: "—" },
        { node: "Content", cls: "div (title + body)", direction: "Vertical", alignment: "Top left", resizing: "Fill × Hug", spacing: "—" },
        { node: "Title", cls: "strong", direction: "Vertical", alignment: "Top left", resizing: "Fill × Hug", spacing: "Bottom 4" },
        { node: "Dismiss", cls: ".cds-alert__dismiss", direction: "Horizontal", alignment: "Middle center", resizing: "Fixed 24 × 24", spacing: "Padding 0 / 4" },
      ]}
      specs={(q) => [
        pass("Padding", "core-space-4", `${q.px(".cds-alert", "padding-top")}px`),
        pass("Padding right", "core-space-8", `${q.px(".cds-alert", "padding-right")}px`, "Reserves room for the absolutely positioned dismiss button"),
        pass("Icon → content", "core-space-3", `${q.px(".cds-alert", "column-gap")}px`),
        pass("Title → body", "core-space-1", `${q.px(".cds-alert strong", "margin-bottom")}px`),
        pass("Icon", "size md", q.size(".cds-alert__icon")),
        pass("Dismiss", "24 × 24 (WCAG 2.5.8)", q.size(".cds-alert__dismiss")),
      ]}
    >
      <AlertAnatomy />
    </AnatomyTables>
  );
}

export function AttachmentAnatomyFull() {
  return (
    <AnatomyTables
      layers={[
        { node: "Attachment list", cls: ".cds-attachment-list", direction: "Vertical", alignment: "Top left", resizing: "Fill × Hug", spacing: "Gap 8" },
        { node: "File row", cls: ".cds-attachment", direction: "Horizontal", alignment: "Middle left", resizing: "Fill × Hug", spacing: "Gap 12 · Padding 12" },
        { node: "File icon", cls: ".cds-attachment-icon", direction: "Horizontal", alignment: "Middle center", resizing: "Fixed 32 × 32", spacing: "—" },
        { node: "Body", cls: ".cds-attachment-body", direction: "Vertical", alignment: "Top left", resizing: "Fill × Hug", spacing: "—" },
        { node: "Meta", cls: ".cds-attachment-meta", direction: "Horizontal", alignment: "Middle left", resizing: "Fill × Hug", spacing: "Gap 4" },
        { node: "Status badge", cls: ".cds-attachment-badge", direction: "Horizontal", alignment: "Middle center", resizing: "Hug × Hug", spacing: "Padding 4 / 12 (md) · 4 / 8 (sm)" },
        { node: "Remove", cls: ".cds-attachment-remove", direction: "Horizontal", alignment: "Middle center", resizing: "Fixed 24 × 24", spacing: "—" },
      ]}
      specs={(q) => [
        pass("Row spacing", "core-space-2", `${q.px(".cds-attachment-list", "row-gap")}px`),
        pass("Row padding", "core-space-3", `${q.px(".cds-attachment", "padding-top")}px`),
        pass("Row item spacing", "core-space-3", `${q.px(".cds-attachment", "column-gap")}px`),
        pass("Meta spacing", "core-space-1", `${q.px(".cds-attachment-meta", "column-gap")}px`),
        pass("File icon", "32px", q.size(".cds-attachment-icon")),
        pass("Remove", "24 × 24 (WCAG 2.5.8)", q.size(".cds-attachment-remove")),
        pass("File name", "typography-body-md · medium", q.type(".cds-attachment-name")),
      ]}
    >
      <AttachmentAnatomy />
    </AnatomyTables>
  );
}

export function BadgeAnatomyFull() {
  return (
    <AnatomyTables
      layers={[
        { node: "Badge", cls: ".cds-badge", direction: "Horizontal", alignment: "Middle center", resizing: "Hug × Hug", spacing: "Gap 8 · Padding 4 / 12 (md)" },
        { node: "Icon (optional)", cls: ".cds-icon", direction: "—", alignment: "Middle center", resizing: "Fixed", spacing: "—" },
        { node: "Label", cls: "text", direction: "—", alignment: "Middle left", resizing: "Hug × Hug", spacing: "—" },
      ]}
      specs={(q) => [
        pass("Padding", "core-space-1 / core-space-3", `${q.px(".cds-badge", "padding-top")}px ${q.px(".cds-badge", "padding-left")}px`),
        pass("Icon → label", "core-space-2", `${q.px(".cds-badge", "column-gap")}px`),
        pass("Label", "typography-body-md · medium", q.type(".cds-badge")),
        pass("Radius", "core-radius-full", q.css(".cds-badge", "border-top-left-radius")),
      ]}
    >
      <BadgeAnatomy />
    </AnatomyTables>
  );
}

export function ButtonAnatomyFull() {
  return (
    <AnatomyTables
      layers={[
        { node: "Button", cls: ".cds-btn", direction: "Horizontal", alignment: "Middle center", resizing: "Hug × Fixed", spacing: "Gap 8 · Padding 8 / 12" },
        { node: "Leading icon (optional)", cls: ".cds-icon", direction: "—", alignment: "Middle center", resizing: "Fixed 16", spacing: "—" },
        { node: "Label", cls: ".cds-btn__text", direction: "—", alignment: "Middle center", resizing: "Hug × Hug", spacing: "—" },
        { node: "Trailing icon (optional)", cls: ".cds-icon", direction: "—", alignment: "Middle center", resizing: "Fixed 16", spacing: "—" },
      ]}
    >
      <ButtonAnatomy />
    </AnatomyTables>
  );
}

export function CheckboxRadioAnatomyFull() {
  return (
    <AnatomyTables
      layers={[
        { node: "Checkbox", cls: ".cds-checkbox", direction: "Horizontal", alignment: "Middle left", resizing: "Hug × Hug", spacing: "Gap 8 · Padding 4 / 0" },
        { node: "Box", cls: ".cds-checkbox-box", direction: "Horizontal", alignment: "Middle center", resizing: "Fixed 20 × 20", spacing: "—" },
        { node: "Radio", cls: ".cds-radio", direction: "Horizontal", alignment: "Middle left", resizing: "Hug × Hug", spacing: "Gap 8 · Padding 4 / 0" },
        { node: "Circle", cls: ".cds-radio-box", direction: "Horizontal", alignment: "Middle center", resizing: "Fixed 20 × 20", spacing: "—" },
        { node: "Label", cls: "text", direction: "—", alignment: "Middle left", resizing: "Hug × Hug", spacing: "—" },
      ]}
    >
      <CheckboxRadioAnatomy />
    </AnatomyTables>
  );
}

export function ComboboxAnatomyFull() {
  return (
    <AnatomyTables
      layers={[
        { node: "Combobox (field)", cls: ".cds-field", direction: "Vertical", alignment: "Top left", resizing: "Fixed × Hug", spacing: "Gap 8" },
        { node: "Label", cls: ".cds-label", direction: "Vertical", alignment: "Top left", resizing: "Fill × Hug", spacing: "—" },
        { node: "Container", cls: ".cds-combobox", direction: "Horizontal", alignment: "Middle left", resizing: "Fill × Hug", spacing: "—" },
        { node: "Text Input", cls: ".cds-input", direction: "Horizontal", alignment: "Middle left", resizing: "Fill × Fixed", spacing: "Padding 8 / 12" },
        { node: "Options list", cls: ".cds-combobox-list", direction: "Vertical", alignment: "Top left", resizing: "Fill × Hug", spacing: "Opens below the input" },
      ]}
      specs={(q) => [
        pass("Label → input", "core-space-2", `${q.px(".cds-field", "row-gap")}px`),
        pass("Input padding", "core-space-2 / core-space-3", `${q.px(".cds-combobox .cds-input", "padding-top")}px ${q.px(".cds-combobox .cds-input", "padding-left")}px`),
        pass("Height", "core-size-control-md", `${q.el(".cds-combobox .cds-input").offsetHeight}px`),
        pass("Label", "typography-label", q.type(".cds-label")),
      ]}
    >
      <ComboboxAnatomy />
    </AnatomyTables>
  );
}

export function DatePickerAnatomyFull() {
  return (
    <AnatomyTables
      layers={[
        { node: "Date picker (field)", cls: ".cds-field", direction: "Vertical", alignment: "Top left", resizing: "Fixed × Hug", spacing: "Gap 8" },
        { node: "Label", cls: ".cds-label", direction: "Vertical", alignment: "Top left", resizing: "Fill × Hug", spacing: "—" },
        { node: "Container", cls: ".cds-date-picker > .cds-input-affix-wrap", direction: "Horizontal", alignment: "Middle left", resizing: "Fill × Hug", spacing: "—" },
        { node: "Text Input", cls: ".cds-input", direction: "Horizontal", alignment: "Middle left", resizing: "Fill × Fixed", spacing: "Padding 8 / 12" },
        { node: "Calendar icon", cls: ".cds-input-icon--trailing", direction: "Horizontal", alignment: "Middle center", resizing: "Fixed 16", spacing: "—" },
        { node: "Calendar popover", cls: ".cds-calendar", direction: "Vertical", alignment: "Top left", resizing: "Fixed 280 × Hug", spacing: "See Calendar" },
      ]}
      specs={trailingIconSpecs}
    >
      <DatePickerAnatomy />
    </AnatomyTables>
  );
}

export function IconButtonAnatomyFull() {
  return (
    <AnatomyTables
      layers={[
        { node: "Icon button", cls: ".cds-icon-btn", direction: "Horizontal", alignment: "Middle center", resizing: "Fixed (sm 32 · md 40)", spacing: "Padding 8 / 4 (sm) · 8 (md, lg)" },
        { node: "Icon", cls: "svg / .cds-icon", direction: "—", alignment: "Middle center", resizing: "Fixed 16", spacing: "—" },
      ]}
      specs={(q) => [
        pass("Padding (sm)", "core-space-2 / core-space-1", `${q.px(".cds-icon-btn", "padding-top")}px ${q.px(".cds-icon-btn", "padding-left")}px`),
        pass("Size (sm)", "core-size-control-sm", q.size(".cds-icon-btn")),
        pass("Icon", "16px", `${q.css(".cds-icon-btn svg", "width")} × ${q.css(".cds-icon-btn svg", "height")}`),
        pass("Radius", "core-radius-sm", q.css(".cds-icon-btn", "border-top-left-radius")),
      ]}
    >
      <IconButtonAnatomy />
    </AnatomyTables>
  );
}

export function InputIconAnatomyFull() {
  return (
    <AnatomyTables
      layers={[
        { node: "Input (field)", cls: ".cds-field", direction: "Vertical", alignment: "Top left", resizing: "Fixed × Hug", spacing: "Gap 8" },
        { node: "Label", cls: ".cds-label", direction: "Vertical", alignment: "Top left", resizing: "Fill × Hug", spacing: "—" },
        { node: "Container", cls: ".cds-input-affix-wrap", direction: "Horizontal", alignment: "Middle left", resizing: "Fill × Hug", spacing: "—" },
        { node: "Text Input", cls: ".cds-input", direction: "Horizontal", alignment: "Middle left", resizing: "Fill × Fixed", spacing: "Padding 8 / 12 (icon side 32)" },
        { node: "Icon", cls: ".cds-input-icon", direction: "Horizontal", alignment: "Middle center", resizing: "Fixed 16", spacing: "—" },
      ]}
      specs={trailingIconSpecs}
    >
      <InputIconAnatomy />
    </AnatomyTables>
  );
}

export function TooltipAnatomyFull() {
  return (
    <AnatomyTables
      layers={[
        { node: "Text (row)", cls: "inline-flex row", direction: "Horizontal", alignment: "Middle left", resizing: "Hug × Hug", spacing: "Gap 4" },
        { node: "Label", cls: "span", direction: "—", alignment: "Middle left", resizing: "Hug × Hug", spacing: "—" },
        { node: "Button (trigger)", cls: ".cds-icon-btn--sm.cds-icon-btn--circle", direction: "Horizontal", alignment: "Middle center", resizing: "Fixed 32 × 32", spacing: "Padding 4" },
        { node: "Tooltip bubble", cls: ".cds-tooltip", direction: "Vertical", alignment: "Top left", resizing: "Hug × Hug (max width)", spacing: "Shown on hover / focus" },
      ]}
    >
      <TooltipAnatomy />
    </AnatomyTables>
  );
}
