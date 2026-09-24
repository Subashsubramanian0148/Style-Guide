import React from "react";
import { MeasuredAnatomy, type AnatomySpecRow } from "./MeasuredAnatomy";
import { StateLabel } from "./DocsSection";
import { CardQuickLink } from "./QuickLinkCard";
import { Separator, Skeleton } from "../../../packages/core/src/components/Disclosure";
import { Tabs, AppSidebar, Pagination, Stepper, defaultStepStatus, type StepState } from "../../../packages/core/src/components/Navigation";
import { Progress, Table, AvatarGroup } from "../../../packages/core/src/components/DataDisplay";
import { AVATAR_SAMPLES } from "./avatarSamples";
import { Empty, Slider } from "../../../packages/core/src/components/Primitives";
import { Button } from "../../../packages/core/src/components/Button";
import { Field, Input, InputWithIcon } from "../../../packages/core/src/components/Field";
import { Select } from "../../../packages/core/src/components/FormControls";
import { Spinner } from "../../../packages/core/src/components/Overlays";
import { LineChartCard } from "../../../packages/core/src/components/Chart";
import { Calendar } from "../../../packages/core/src/components/Calendar";
import { AppHeader, AppFooter, AccountMenu, type HeaderAccount, type HeaderUtility } from "../../../packages/core/src/components/Layout";
import { InputGroup } from "../../../packages/core/src/components/ToggleInputs";
import { Icon } from "../../../packages/core/src/components/Primitives";

const pass = (label: string, token: string, value: string, note?: string): AnatomySpecRow => ({ label, token, value, standard: "pass", note });
const warn = (label: string, token: string, value: string, note: string): AnatomySpecRow => ({ label, token, value, standard: "warn", note });

/* ---------- Separator ---------- */

const titleStyle: React.CSSProperties = { fontSize: "var(--typography-body-md-size)", fontWeight: 600, color: "var(--core-color-text-primary)" };
const bodyStyle: React.CSSProperties = { fontSize: "var(--typography-body-md-size)", color: "var(--core-color-text-secondary)", marginTop: "var(--core-space-1)" };

/** Shared by the Separator demo and its anatomy. */
export function SeparatorCard() {
  return (
    <div
      data-a="card"
      style={{
        background: "var(--core-color-surface-raised)",
        border: "1px solid var(--core-color-border-default)",
        borderRadius: 8,
        padding: "var(--core-space-4)",
        display: "flex",
        flexDirection: "column",
        width: "100%",
        maxWidth: 480,
      }}
    >
      <div data-a="s1">
        <div data-a="t1" style={titleStyle}>Plan Overview</div>
        <div data-a="b1" style={bodyStyle}>Primary account balance and portfolio asset allocations across equities and fixed income.</div>
      </div>
      <Separator />
      <div data-a="s2">
        <div data-a="t2" style={titleStyle}>Contribution History</div>
        <div data-a="b2" style={bodyStyle}>Recent bi-weekly payroll deferrals and employer matching contributions.</div>
      </div>
    </div>
  );
}

export function SeparatorAnatomy() {
  return (
    <MeasuredAnatomy
      heading="Structure — card padding, separator spacing & text stack"
      width={400}
      maxScale={1.5}
      marks={[
        { kind: "padding", sel: "[data-a=card]" },
        { kind: "gap", a: "[data-a=s1]", b: ".cds-separator", axis: "y", color: "#118D57" },
        { kind: "gap", a: ".cds-separator", b: "[data-a=s2]", axis: "y", color: "#118D57" },
        { kind: "gap", a: "[data-a=t1]", b: "[data-a=b1]", axis: "y", color: "#118D57" },
        { kind: "gap", a: "[data-a=t2]", b: "[data-a=b2]", axis: "y", color: "#118D57" },
        { kind: "size", sel: ".cds-separator", name: "Separator line", fill: "w" },
        { kind: "outline", sel: "[data-a=s1]" },
        { kind: "outline", sel: "[data-a=s2]" },
      ]}
      layers={[
        { node: "Container (card)", cls: "demo card", direction: "Vertical", alignment: "Top left", spacing: "Padding 16", sel: "[data-a=card]" },
        { node: "Section", cls: "div", direction: "Vertical", alignment: "Top left", spacing: "—", sel: "[data-a=s1]" },
        { node: "Title", cls: "div", direction: "Vertical", alignment: "Top left", spacing: "—", sel: "[data-a=t1]" },
        { node: "Body", cls: "div", direction: "Vertical", alignment: "Top left", spacing: "Top 4", sel: "[data-a=b1]" },
        { node: "Container:margin", cls: ".cds-separator", direction: "Vertical", alignment: "Top left", spacing: "Top 16 · Bottom 16", sel: ".cds-separator" },
      ]}
      specs={(q) => [
        pass("Card padding", "core-space-4", `${q.px("[data-a=card]", "padding-top")}px`),
        pass("Separator margin", "core-space-4", `${q.px(".cds-separator", "margin-top")}px / ${q.px(".cds-separator", "margin-bottom")}px`, "Spacing above and below lives on the separator; the card adds no extra gap"),
        pass("Title → body", "core-space-1", `${q.gap("[data-a=t1]", "[data-a=b1]", "y")}px`),
        pass("Separator", "1px · border-default", `${q.el(".cds-separator").offsetHeight}px · ${q.css(".cds-separator", "background-color")}`),
        pass("Title", "typography-body-md · 600", q.type("[data-a=t1]")),
        pass("Body", "typography-body-md", q.type("[data-a=b1]")),
      ]}
    >
      <SeparatorCard />
    </MeasuredAnatomy>
  );
}

/* ---------- Select ---------- */

const selectOptions = [
  { value: "acme", label: "Acme Corporation" },
  { value: "globex", label: "Globex Industries" },
];

export function SelectAnatomy() {
  return (
    <MeasuredAnatomy
      heading="Structure — label spacing, trigger padding & chevron"
      width={240}
      marks={[
        { kind: "gap", a: ".cds-label", b: ".cds-select-wrap", axis: "y" },
        { kind: "padding", sel: ".cds-select" },
        { kind: "size", sel: ".cds-select", name: "Trigger", fill: "w" },
        { kind: "gap", a: ".cds-select > span", b: ".cds-select-wrap > svg", axis: "x", label: "Auto" },
        { kind: "outline", sel: ".cds-label" },
        { kind: "outline", sel: ".cds-select-wrap > svg" },
      ]}
      layers={[
        { node: "Container (field)", cls: ".cds-field", direction: "Vertical", alignment: "Top left", spacing: "Gap 8", sel: ".cds-field" },
        { node: "Label", cls: ".cds-label", direction: "Vertical", alignment: "Top left", spacing: "—", sel: ".cds-label" },
        { node: "Container", cls: ".cds-select-wrap", direction: "Vertical", alignment: "Top left", spacing: "—", sel: ".cds-select-wrap" },
        { node: "Button", cls: ".cds-select", direction: "Horizontal", alignment: "Middle, spaced equally", spacing: "Padding 8 / 12", sel: ".cds-select" },
        { node: "Frame 4", cls: "text + chevron", direction: "Horizontal", alignment: "Middle, spaced equally", spacing: "Auto", sel: ".cds-select > span" },
      ]}
      specs={(q) => [
        pass("Label → field", "core-space-2", `${q.px(".cds-field", "row-gap")}px`),
        pass("Trigger padding", "core-space-2 / core-space-3", `${q.px(".cds-select", "padding-top")}px ${q.px(".cds-select", "padding-left")}px`),
        pass("Text ↔ chevron", "space-between", "Auto"),
        pass("Height", "core-size-control-md", `${q.el(".cds-select").offsetHeight}px`),
        pass("Label", "typography-label", q.type(".cds-label")),
        pass("Value text", "typography-text14-regular", q.type(".cds-select")),
        pass("Border radius", "core-radius-sm", q.css(".cds-select", "border-top-left-radius")),
      ]}
    >
      <Field label="Default">{(p) => <Select {...p} options={selectOptions} placeholder="Select the funds" />}</Field>
    </MeasuredAnatomy>
  );
}

/* ---------- Quick links ---------- */

/** Shared by the Quick links state demos and the anatomy. */
export const QUICKLINK_CELL_STYLE: React.CSSProperties = { display: "flex", flexDirection: "column", gap: "var(--core-space-2)" };

export function QuickLinksAnatomy() {
  return (
    <MeasuredAnatomy
      heading="Structure — container spacing, card padding & icon gap"
      width={200}
      marks={[
        { kind: "gap", a: ".docs-state-label", b: ".cds-quicklink", axis: "y" },
        { kind: "padding", sel: ".cds-quicklink" },
        { kind: "size", sel: ".cds-quicklink", name: "Card", fill: "w" },
        { kind: "size", sel: ".cds-quicklink-icon", name: "Icon tile" },
        { kind: "gap", a: ".cds-quicklink-icon", b: ".cds-quicklink-label", axis: "x", span: ".cds-quicklink-icon" },
        { kind: "outline", sel: ".cds-quicklink-icon" },
        { kind: "outline", sel: ".cds-quicklink-label" },
      ]}
      layers={[
        { node: "Container", cls: "demo cell", direction: "Vertical", alignment: "Top left", spacing: "Gap 8", sel: ":scope > div" },
        { node: "Button", cls: ".cds-quicklink", direction: "Horizontal", alignment: "Middle left", spacing: "Gap 12 · Padding 16", sel: ".cds-quicklink" },
        { node: "Icon tile", cls: ".cds-quicklink-icon", direction: "Horizontal", alignment: "Middle center", spacing: "—", sel: ".cds-quicklink-icon" },
        { node: "Icon", cls: ".cds-icon", direction: "Vertical", alignment: "Top left", spacing: "—", sel: ".cds-quicklink-icon .cds-icon" },
        { node: "Text", cls: ".cds-quicklink-label", direction: "Vertical", alignment: "Top left", spacing: "—", sel: ".cds-quicklink-label" },
      ]}
      specs={(q) => [
        pass("State label → card", "core-space-2", `${q.gap(".docs-state-label", ".cds-quicklink", "y")}px`),
        pass("Card padding", "core-space-4", `${q.px(".cds-quicklink", "padding-top")}px`),
        pass("Icon → label", "core-space-1", `${q.px(".cds-quicklink", "column-gap")}px`),
        pass("Icon tile", "40px", q.size(".cds-quicklink-icon")),
        pass("Label", "typography-body-md", q.type(".cds-quicklink-label")),
        pass("Border radius", "core-radius", q.css(".cds-quicklink", "border-top-left-radius")),
      ]}
    >
      <div style={QUICKLINK_CELL_STYLE}>
        <StateLabel>DEFAULT</StateLabel>
        <CardQuickLink icon="fa-solid fa-chart-line" label="Links" />
      </div>
    </MeasuredAnatomy>
  );
}

/* ---------- Bank fields ---------- */

export function BankFieldsAnatomy() {
  return (
    <MeasuredAnatomy
      heading="Structure — label spacing, input padding & trailing icon"
      width={240}
      marks={[
        { kind: "gap", a: ".cds-label", b: ".cds-input-affix-wrap", axis: "y" },
        { kind: "padding", sel: ".cds-input", edges: ["top", "bottom", "left"] },
        { kind: "size", sel: ".cds-input", name: "Input", fill: "w" },
        { kind: "size", sel: ".cds-input-icon", name: "Card icon" },
        { kind: "gap", a: ".cds-input-icon", b: { inner: ".cds-input", edge: "right" }, axis: "x", color: "#118D57" },
        { kind: "gap", a: { content: ".cds-input", edge: "right" }, b: ".cds-input-icon", axis: "x" },
        { kind: "outline", sel: ".cds-label" },
        { kind: "outline", sel: ".cds-input-icon" },
      ]}
      layers={[
        { node: "Bank Fields", cls: ".cds-field", direction: "Vertical", alignment: "Top left", spacing: "Gap 8", sel: ".cds-field" },
        { node: "Label", cls: ".cds-label", direction: "Vertical", alignment: "Top left", spacing: "—", sel: ".cds-label" },
        { node: "Container", cls: ".cds-input-affix-wrap", direction: "Horizontal", alignment: "Middle left", spacing: "—", sel: ".cds-input-affix-wrap" },
        { node: "Text Input", cls: ".cds-input", direction: "Horizontal", alignment: "Middle left", spacing: "Padding 8 / 12", sel: ".cds-input" },
        { node: "Frame 5", cls: "text + icon", direction: "Horizontal", alignment: "Middle left", spacing: "Gap 8", sel: "union:.cds-input,.cds-input-icon" },
        { node: "Icon", cls: ".cds-input-icon--trailing", direction: "Horizontal", alignment: "Middle center", spacing: "—", sel: ".cds-input-icon" },
      ]}
      specs={(q) => {
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
            : warn("Text → icon", "padding-right: core-space-8", `${textToIcon}px`, "Figma: 8 (Frame 5 item spacing). Shared by every input with an icon — left as-is pending a decision"),
          pass("Icon", "fa-credit-card · sm", q.size(".cds-input-icon")),
          pass("Height", "core-size-control-md", `${q.el(".cds-input").offsetHeight}px`),
          pass("Label", "typography-label", q.type(".cds-label")),
        ];
      }}
    >
      <Field label="Default">
        {(p) => <InputWithIcon {...p} trailingIcon={<Icon name="fa-solid fa-credit-card" size="sm" />} inputMode="numeric" placeholder="1234 5678 9012 3456" />}
      </Field>
    </MeasuredAnatomy>
  );
}

/* ---------- Prefix & suffix ---------- */

export function InputGroupAnatomy() {
  return (
    <MeasuredAnatomy
      heading="Structure — prefix & suffix addons"
      width={240}
      marks={[
        { kind: "gap", a: "[data-a=pre] .cds-label", b: "[data-a=pre] .cds-input-group", axis: "y" },
        { kind: "padding", sel: "[data-a=pre] .cds-input-group-addon" },
        { kind: "padding", sel: "[data-a=pre] .cds-input" },
        { kind: "gap", a: "[data-a=suf] .cds-label", b: "[data-a=suf] .cds-input-group", axis: "y" },
        { kind: "padding", sel: "[data-a=suf] .cds-input" },
        { kind: "padding", sel: "[data-a=suf] .cds-input-group-addon" },
        { kind: "size", sel: "[data-a=suf] .cds-input-group-addon", name: "Addon" },
        { kind: "size", sel: "[data-a=suf] .cds-input-group", name: "Input group", fill: "w" },
        { kind: "outline", sel: "[data-a=pre] .cds-label" },
        { kind: "outline", sel: "[data-a=suf] .cds-label" },
      ]}
      layers={[
        { node: "Prefix / Suffix", cls: ".cds-field", direction: "Vertical", alignment: "Top left", spacing: "Gap 8", sel: "[data-a=pre] .cds-field" },
        { node: "Label", cls: ".cds-label", direction: "Vertical", alignment: "Top left", spacing: "—", sel: "[data-a=pre] .cds-label" },
        { node: "Container", cls: ".cds-input-group", direction: "Horizontal", alignment: "Top left", spacing: "—", sel: "[data-a=pre] .cds-input-group" },
        { node: "Text (addon)", cls: ".cds-input-group-addon", direction: "Horizontal", alignment: "Middle left", spacing: "Padding 8 / 12", sel: "[data-a=pre] .cds-input-group-addon" },
        { node: "Text Input", cls: ".cds-input", direction: "Vertical", alignment: "Middle left", spacing: "Padding 8 / 12", sel: "[data-a=pre] .cds-input" },
      ]}
      specs={(q) => [
        pass("Label → field", "core-space-2", `${q.px("[data-a=pre] .cds-field", "row-gap")}px`),
        pass("Addon padding", "core-space-2 / core-space-3", `${q.px("[data-a=pre] .cds-input-group-addon", "padding-top")}px ${q.px("[data-a=pre] .cds-input-group-addon", "padding-left")}px`),
        pass("Input padding", "core-space-2 / core-space-3", `${q.px("[data-a=pre] .cds-input", "padding-top")}px ${q.px("[data-a=pre] .cds-input", "padding-left")}px`),
        pass("Addon ↔ input", "shared 1px border", `${q.gap("[data-a=pre] .cds-input-group-addon", "[data-a=pre] .cds-input", "x")}px`),
        pass("Addon", "surface-sunken · text-subtle", q.type("[data-a=pre] .cds-input-group-addon")),
        pass("Height", "core-size-control-md", `${q.el("[data-a=pre] .cds-input").offsetHeight}px`),
      ]}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--core-space-8)" }}>
        <div data-a="pre">
          <Field label="Default">{(p) => <InputGroup prefix="$"><Input {...p} placeholder="0.00" /></InputGroup>}</Field>
        </div>
        <div data-a="suf">
          <Field label="Default">{(p) => <InputGroup suffix="%"><Input {...p} placeholder="0" /></InputGroup>}</Field>
        </div>
      </div>
    </MeasuredAnatomy>
  );
}

/* ---------- Tabs ---------- */

const tabP = (text: string) => <p style={{ fontSize: 14, color: "var(--core-color-text-secondary)", margin: 0 }}>{text}</p>;

export function TabsAnatomy() {
  const h = "[data-a=h] .cds-tab";
  const v = "[data-a=v] .cds-tab";
  return (
    <MeasuredAnatomy
      heading="Structure — horizontal & vertical tab lists"
      width={440}
      maxScale={1.5}
      marks={[
        { kind: "gap", a: `${h}:nth-child(1)`, b: `${h}:nth-child(2)`, axis: "x" },
        { kind: "gap", a: `${h}:nth-child(2)`, b: `${h}:nth-child(3)`, axis: "x" },
        { kind: "padding", sel: `${h}:nth-child(1)` },
        { kind: "size", sel: `${h}:nth-child(3)`, name: "Tab (horizontal)" },
        { kind: "gap", a: `${v}:nth-child(1)`, b: `${v}:nth-child(2)`, axis: "y" },
        { kind: "gap", a: `${v}:nth-child(2)`, b: `${v}:nth-child(3)`, axis: "y" },
        { kind: "gap", a: `${v}:nth-child(3)`, b: `${v}:nth-child(4)`, axis: "y" },
        { kind: "padding", sel: `${v}:nth-child(2)` },
        { kind: "size", sel: `${v}:nth-child(4)`, name: "Tab (vertical)", fill: "w" },
        { kind: "outline", sel: "[data-a=h] .cds-tabs" },
        { kind: "outline", sel: "[data-a=v] .cds-tabs" },
      ]}
      layers={[
        { node: "Frame 7 (tab list)", cls: ".cds-tabs", direction: "Horizontal", alignment: "Middle left", spacing: "Gap 8", sel: "[data-a=h] .cds-tabs" },
        { node: "Tab", cls: ".cds-tab", direction: "Vertical", alignment: "Middle center", spacing: "Padding 12", sel: "[data-a=h] .cds-tab" },
        { node: "Tab List (vertical)", cls: ".cds-tabs--vertical", direction: "Vertical", alignment: "Top left", spacing: "Gap 4", sel: "[data-a=v] .cds-tabs" },
        { node: "Tab (vertical)", cls: ".cds-tab--vertical", direction: "Vertical", alignment: "Middle left", spacing: "Padding 8 / 16", sel: "[data-a=v] .cds-tab" },
      ]}
      specs={(q) => {
        const hGap = q.gap(`${h}:nth-child(1)`, `${h}:nth-child(2)`, "x");
        return [
          hGap === 8
            ? pass("Horizontal tab spacing", "core-space-2", `${hGap}px`)
            : warn("Horizontal tab spacing", "gap core-space-1 + margin-right core-space-4", `${hGap}px`, "Figma: 8 (Frame 7 item spacing). Core .cds-tab adds a 16px right margin on top of the 4px gap — left as-is pending a decision"),
          pass("Horizontal tab padding", "core-space-3", `${q.px(`${h}:nth-child(1)`, "padding-top")}px`),
          pass("Vertical tab spacing", "core-space-1", `${q.gap(`${v}:nth-child(1)`, `${v}:nth-child(2)`, "y")}px`),
          pass("Vertical tab padding", "core-space-2 / core-space-4", `${q.px(`${v}:nth-child(1)`, "padding-top")}px ${q.px(`${v}:nth-child(1)`, "padding-left")}px`),
          pass("Tab label", "typography-body-md", q.type(`${h}:nth-child(1)`)),
        ];
      }}
      note="Every tab in a list shares the padding marked on one tab; only color and the active indicator change per state."
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--core-space-10)" }}>
        <div data-a="h">
          <Tabs
            items={[
              { id: "overview", label: "Overview", content: tabP("Account overview content.") },
              { id: "documents", label: "Documents", content: tabP("Statements & tax forms content.") },
              { id: "transactions", label: "Transaction", content: tabP("Transaction history content.") },
            ]}
          />
        </div>
        <div data-a="v">
          <Tabs
            orientation="vertical"
            items={[
              { id: "personal", label: "Personal Details", content: tabP("Personal details content.") },
              { id: "bank", label: "Bank Details", content: tabP("Bank details content.") },
              { id: "employment", label: "Employment Information", content: tabP("Employment info content.") },
              { id: "beneficiary", label: "Beneficiary Details", content: tabP("Beneficiary details content.") },
            ]}
          />
        </div>
      </div>
    </MeasuredAnatomy>
  );
}

/* ---------- Skeleton ---------- */

/** Shared by the Skeleton demo and its anatomy. */
export function SkeletonCard() {
  return (
    <div
      data-a="card"
      style={{
        background: "var(--core-color-surface-raised)",
        border: "1px solid var(--core-color-border-default)",
        borderRadius: 8,
        padding: "var(--core-space-6)",
        width: 340,
        display: "flex",
        flexDirection: "column",
        gap: "var(--core-space-4)",
        boxShadow: "var(--core-elevation-1)",
      }}
    >
      <div data-a="head" style={{ display: "flex", alignItems: "center", gap: "var(--core-space-3)" }}>
        <div data-a="avatar"><Skeleton width={44} height={44} radius="50%" /></div>
        <div data-a="meta" style={{ display: "flex", flexDirection: "column", gap: "var(--core-space-1)", flex: 1 }}>
          <div data-a="m1"><Skeleton height={14} width="70%" /></div>
          <div data-a="m2"><Skeleton height={12} width="45%" /></div>
        </div>
      </div>
      <div data-a="lines" style={{ display: "flex", flexDirection: "column", gap: "var(--core-space-2)" }}>
        <div data-a="l1"><Skeleton height={14} width="95%" /></div>
        <div data-a="l2"><Skeleton height={14} width="85%" /></div>
        <div data-a="l3"><Skeleton height={14} width="60%" /></div>
      </div>
      <div data-a="cta"><Skeleton height={36} width="100%" radius="var(--core-radius-sm)" /></div>
    </div>
  );
}

export function SkeletonAnatomy() {
  return (
    <MeasuredAnatomy
      heading="Structure — card padding & placeholder stack"
      width={340}
      maxScale={1.5}
      marks={[
        { kind: "padding", sel: "[data-a=card]" },
        { kind: "gap", a: "[data-a=head]", b: "[data-a=lines]", axis: "y" },
        { kind: "gap", a: "[data-a=lines]", b: "[data-a=cta]", axis: "y" },
        { kind: "gap", a: "[data-a=avatar]", b: "[data-a=meta]", axis: "x", span: "[data-a=head]" },
        { kind: "gap", a: "[data-a=m1]", b: "[data-a=m2]", axis: "y", span: "[data-a=meta]" },
        { kind: "gap", a: "[data-a=l1]", b: "[data-a=l2]", axis: "y", span: "[data-a=lines]" },
        { kind: "gap", a: "[data-a=l2]", b: "[data-a=l3]", axis: "y", span: "[data-a=lines]" },
        { kind: "size", sel: "[data-a=avatar] .cds-skeleton", name: "Avatar bone" },
        { kind: "size", sel: "[data-a=cta] .cds-skeleton", name: "CTA bone", fill: "w" },
        { kind: "size", sel: "[data-a=card]", name: "Card" },
        { kind: "outline", sel: "[data-a=head]" },
        { kind: "outline", sel: "[data-a=lines]" },
      ]}
      layers={[
        { node: "Skeleton (card)", cls: "demo card", direction: "Vertical", alignment: "Top left", spacing: "Gap 16 · Padding 24", sel: "[data-a=card]" },
        { node: "Container (header)", cls: "div", direction: "Horizontal", alignment: "Middle left", spacing: "Gap 12", sel: "[data-a=head]" },
        { node: "Container (meta lines)", cls: "div", direction: "Vertical", alignment: "Top left", spacing: "Gap 4", sel: "[data-a=meta]" },
        { node: "Container (body lines)", cls: "div", direction: "Vertical", alignment: "Top left", spacing: "Gap 8", sel: "[data-a=lines]" },
        { node: "Bone", cls: ".cds-skeleton", direction: "—", alignment: "—", spacing: "—", sel: "[data-a=l1] .cds-skeleton" },
      ]}
      specs={(q) => [
        pass("Card padding", "core-space-6", `${q.px("[data-a=card]", "padding-top")}px`),
        pass("Section spacing", "core-space-4", `${q.px("[data-a=card]", "row-gap")}px`),
        pass("Avatar → meta", "core-space-3", `${q.px("[data-a=head]", "column-gap")}px`),
        pass("Meta line spacing", "core-space-1", `${q.px("[data-a=meta]", "row-gap")}px`),
        pass("Body line spacing", "core-space-2", `${q.px("[data-a=lines]", "row-gap")}px`),
        pass("Avatar", "44px · radius 50%", q.size("[data-a=avatar] .cds-skeleton")),
        pass("CTA bone", "36px · core-radius-sm", `${q.el("[data-a=cta] .cds-skeleton").offsetHeight}px`),
      ]}
    >
      <SkeletonCard />
    </MeasuredAnatomy>
  );
}

/* ---------- Sidebar ---------- */

const railItems = [
  { label: "Dashboard", icon: <Icon name="fa-solid fa-grip" size="lg" /> },
  { label: "Portfolio", icon: <Icon name="fa-solid fa-wallet" size="lg" /> },
  { label: "Transactions", icon: <Icon name="fa-solid fa-right-left" size="lg" /> },
  { label: "Profile", icon: <Icon name="fa-solid fa-user" size="lg" /> },
  { label: "Documents", icon: <Icon name="fa-solid fa-file-lines" size="lg" /> },
];

export function SidebarAnatomy() {
  const link = ".cds-app-sidebar-link";
  return (
    <MeasuredAnatomy
      heading="Structure — rail padding, item spacing & button padding"
      width={96}
      maxScale={2}
      marks={[
        { kind: "padding", sel: ".cds-app-sidebar", edges: ["top", "bottom"] },
        { kind: "gap", a: `${link}:nth-child(1)`, b: `${link}:nth-child(2)`, axis: "y" },
        { kind: "gap", a: `${link}:nth-child(2)`, b: `${link}:nth-child(3)`, axis: "y" },
        { kind: "gap", a: `${link}:nth-child(3)`, b: `${link}:nth-child(4)`, axis: "y" },
        { kind: "gap", a: `${link}:nth-child(4)`, b: `${link}:nth-child(5)`, axis: "y" },
        { kind: "padding", sel: `${link}:nth-child(1)` },
        { kind: "size", sel: `${link}:nth-child(5)`, name: "Nav item" },
        { kind: "size", sel: `${link}:nth-child(1) .cds-sidenav-icon-plain`, name: "Icon" },
        { kind: "gap", a: `${link}:nth-child(1) .cds-sidenav-icon-plain`, b: `${link}:nth-child(1) .cds-sidenav-label`, axis: "y", span: `${link}:nth-child(1) .cds-sidenav-label` },
        { kind: "outline", sel: `${link}:nth-child(1) .cds-sidenav-icon-plain` },
        { kind: "outline", sel: `${link}:nth-child(1) .cds-sidenav-label` },
      ]}
      layers={[
        { node: "Navigation - Sidebar", cls: ".cds-app-sidebar--rail", direction: "Vertical", alignment: "Top left", spacing: "Gap 8 · Padding top/bottom 16", sel: ".cds-app-sidebar" },
        { node: "Button", cls: ".cds-app-sidebar-link", direction: "Vertical", alignment: "Top center", spacing: "Gap 4 · Padding 12 / 8", sel: ".cds-app-sidebar-link" },
        { node: "Text (icon)", cls: ".cds-sidenav-icon-plain", direction: "Horizontal", alignment: "Middle center", spacing: "—", sel: ".cds-sidenav-icon-plain" },
        { node: "Italic Text (label)", cls: ".cds-sidenav-label", direction: "Vertical", alignment: "Top center", spacing: "—", sel: ".cds-sidenav-label" },
      ]}
      specs={(q) => [
        pass("Rail padding", "core-space-4", `${q.px(".cds-app-sidebar", "padding-top")}px / ${q.px(".cds-app-sidebar", "padding-bottom")}px`),
        pass("Item spacing", "core-space-2", `${q.px(".cds-app-sidebar", "row-gap")}px`),
        pass("Item padding", "core-space-3 / core-space-2", `${q.px(link, "padding-top")}px ${q.px(link, "padding-left")}px`),
        pass("Icon → label", "core-space-1", `${q.px(link, "row-gap")}px`),
        pass("Icon", "size lg", q.size(`${link} .cds-sidenav-icon-plain`)),
        pass("Label", "typography-font-size-xs", q.type(`${link} .cds-sidenav-label`)),
        pass("Rail width", "96px", `${q.el(".cds-app-sidebar").offsetWidth}px`),
      ]}
    >
      <AppSidebar variant="rail" aria-label="Sidebar anatomy" items={railItems} />
    </MeasuredAnatomy>
  );
}

/* ---------- Progress ---------- */

export function ProgressAnatomy() {
  const label = "[data-a=p] > div > div:first-child";
  return (
    <MeasuredAnatomy
      heading="Structure — label & bar"
      width={320}
      maxScale={1.5}
      marks={[
        { kind: "gap", a: label, b: ".cds-progress", axis: "y" },
        { kind: "outline", sel: label },
        { kind: "size", sel: ".cds-progress", name: "Track", fill: "w" },
      ]}
      layers={[
        { node: "Progress bar", cls: "wrapper", direction: "Vertical", alignment: "Top left", spacing: "Gap 4", sel: "[data-a=p] > div" },
        { node: "Container (label)", cls: "div", direction: "Vertical", alignment: "Top left", spacing: "Bottom 4", sel: "[data-a=p] > div > div:first-child" },
        { node: "Progress Bar:margin", cls: ".cds-progress", direction: "Vertical", alignment: "Top left", spacing: "—", sel: ".cds-progress" },
        { node: "Progress Bar (value)", cls: ".cds-progress-bar", direction: "Vertical", alignment: "Top left", spacing: "—", sel: ".cds-progress-bar" },
      ]}
      specs={(q) => [
        pass("Label → bar", "core-space-1", `${q.gap(label, ".cds-progress", "y")}px`),
        pass("Track height", "core-space-2", `${q.el(".cds-progress").offsetHeight}px`),
        pass("Progress value", "value 68%", `${Math.round((q.el(".cds-progress-bar").offsetWidth / q.el(".cds-progress").clientWidth) * 100)}%`),
        pass("Label", "typography-body-sm", q.type(label)),
        pass("Radius", "core-radius-full", q.css(".cds-progress", "border-top-left-radius")),
      ]}
    >
      <div data-a="p">
        <Progress value={68} label="Retirement readiness — 68%" />
      </div>
    </MeasuredAnatomy>
  );
}

/* ---------- Input ---------- */

export function InputAnatomy() {
  return (
    <MeasuredAnatomy
      heading="Structure — label spacing & input padding"
      width={240}
      marks={[
        { kind: "gap", a: ".cds-label", b: ".cds-input", axis: "y" },
        { kind: "padding", sel: ".cds-input" },
        { kind: "outline", sel: ".cds-label" },
        { kind: "size", sel: ".cds-input", name: "Input", fill: "w" },
      ]}
      layers={[
        { node: "Input (field)", cls: ".cds-field", direction: "Vertical", alignment: "Top left", spacing: "Gap 8", sel: ".cds-field" },
        { node: "Label", cls: ".cds-label", direction: "Vertical", alignment: "Top left", spacing: "—", sel: ".cds-label" },
        { node: "Text Input", cls: ".cds-input", direction: "Vertical", alignment: "Middle left", spacing: "Padding 8 / 12", sel: ".cds-input" },
      ]}
      specs={(q) => [
        pass("Label → input", "core-space-2", `${q.px(".cds-field", "row-gap")}px`),
        pass("Input padding", "core-space-2 / core-space-3", `${q.px(".cds-input", "padding-top")}px ${q.px(".cds-input", "padding-left")}px`),
        pass("Height", "core-size-control-md", `${q.el(".cds-input").offsetHeight}px`),
        pass("Label", "typography-label", q.type(".cds-label")),
        pass("Input text", "typography-text14-regular", q.type(".cds-input")),
        pass("Border radius", "core-radius-sm", q.css(".cds-input", "border-top-left-radius")),
      ]}
      note="Structure is shared by every state; only border, background and text color change for hover, focus, filled, error and disabled."
    >
      <Field label="Default" required>{(p) => <Input {...p} placeholder="Jordan Lee" />}</Field>
    </MeasuredAnatomy>
  );
}

/* ---------- Empty state ---------- */

export function EmptyAnatomy() {
  return (
    <MeasuredAnatomy
      heading="Structure — padding, content stack & action"
      width={360}
      maxScale={1.5}
      marks={[
        { kind: "padding", sel: ".cds-empty" },
        { kind: "gap", a: ".cds-empty-icon", b: ".cds-empty-title", axis: "y", span: ".cds-empty-desc" },
        { kind: "gap", a: ".cds-empty-title", b: ".cds-empty-desc", axis: "y", span: ".cds-empty-desc" },
        { kind: "gap", a: ".cds-empty-desc", b: ".cds-empty-action", axis: "y", span: ".cds-empty-desc" },
        { kind: "padding", sel: ".cds-empty-action .cds-btn" },
        { kind: "size", sel: ".cds-empty-action .cds-btn", name: "Button" },
        { kind: "size", sel: ".cds-empty-icon" },
        { kind: "outline", sel: ".cds-empty-title" },
        { kind: "outline", sel: ".cds-empty-desc" },
      ]}
      layers={[
        { node: "Empty State", cls: ".cds-empty", direction: "Vertical", alignment: "Middle center", spacing: "Gap 16 · Padding 16", sel: ".cds-empty" },
        { node: "Frame 9", cls: "icon + title + desc", direction: "Vertical", alignment: "Top center", spacing: "Gap 8", sel: "union:.cds-empty-icon,.cds-empty-title,.cds-empty-desc" },
        { node: "Container (icon)", cls: ".cds-empty-icon", direction: "Horizontal", alignment: "Middle center", spacing: "—", sel: ".cds-empty-icon" },
        { node: "Button", cls: ".cds-btn--sm", direction: "Horizontal", alignment: "Middle center", spacing: "Gap 8 · Padding 8 / 12", sel: ".cds-empty-action .cds-btn" },
      ]}
      specs={(q) => {
        const iconTitle = q.gap(".cds-empty-icon", ".cds-empty-title", "y");
        const descAction = q.gap(".cds-empty-desc", ".cds-empty-action", "y");
        return [
          pass("Container padding", "core-space-4", `${q.px(".cds-empty", "padding-top")}px`),
          iconTitle === 8
            ? pass("Icon → title", "core-space-2", `${iconTitle}px`)
            : warn("Icon → title", "gap core-space-2 + margin core-space-3", `${iconTitle}px`, "Figma: 8 (Frame 9 item spacing). Core .cds-empty-icon adds a 12px bottom margin — left as-is pending a decision"),
          pass("Title → description", "core-space-2", `${q.gap(".cds-empty-title", ".cds-empty-desc", "y")}px`),
          descAction === 16
            ? pass("Description → action", "core-space-4", `${descAction}px`)
            : warn("Description → action", "gap core-space-2 + margin core-space-3", `${descAction}px`, "Figma: 16 (Empty State item spacing). Core .cds-empty-action adds a 12px top margin — left as-is pending a decision"),
          pass("Button padding", "core-space-2 / core-space-3", `${q.px(".cds-empty-action .cds-btn", "padding-top")}px ${q.px(".cds-empty-action .cds-btn", "padding-left")}px`),
          pass("Icon container (W × H)", "44 × 44", q.size(".cds-empty-icon")),
          pass("Title", "typography-heading", q.type(".cds-empty-title")),
          pass("Description", "typography-body-sm", q.type(".cds-empty-desc")),
        ];
      }}
    >
      <Empty
        title="No transactions yet"
        description="Once you make your first contribution, it will show up here."
        action={<Button variant="primary" size="sm">Learn how contributions work</Button>}
      />
    </MeasuredAnatomy>
  );
}

/* ---------- Slider ---------- */

export function SliderAnatomy() {
  const input = ".cds-slider > input";
  return (
    <MeasuredAnatomy
      heading="Structure — label, control & value"
      width={240}
      marks={[
        { kind: "gap", a: ".cds-label", b: ".cds-slider", axis: "y" },
        { kind: "gap", a: input, b: ".cds-slider-value", axis: "x", span: ".cds-slider" },
        { kind: "outline", sel: ".cds-label" },
        { kind: "size", sel: input, name: "Control", fill: "w" },
        { kind: "size", sel: ".cds-slider-value", name: "Value" },
      ]}
      layers={[
        { node: "Slider (field)", cls: ".cds-field", direction: "Vertical", alignment: "Top left", spacing: "Gap 8", sel: ".cds-field" },
        { node: "Label", cls: ".cds-label", direction: "Vertical", alignment: "Top left", spacing: "—", sel: ".cds-label" },
        { node: "Container", cls: ".cds-slider", direction: "Horizontal", alignment: "Middle left", spacing: "Gap 12", sel: ".cds-slider" },
        { node: "Input (track + thumb)", cls: ".cds-slider > input[type=range]", direction: "Vertical", alignment: "Middle center", spacing: "—", sel: ".cds-slider > input" },
        { node: "Container (value)", cls: ".cds-slider-value", direction: "Vertical", alignment: "Top right", spacing: "—", sel: ".cds-slider-value" },
      ]}
      specs={(q) => [
        pass("Label → control", "core-space-2", `${q.px(".cds-field", "row-gap")}px`),
        pass("Control → value", "core-space-3", `${q.px(".cds-slider", "column-gap")}px`),
        pass(
          "Control height",
          "core-size-control-sm",
          `${q.el(input).offsetHeight}px`,
          "Figma: track frame padding 14 / 14 and value padding 12.05 — both off the 4-point grid; code uses a fixed 32px control with the track centered instead",
        ),
        pass("Value", "typography-body-md · bold", q.type(".cds-slider-value")),
        pass("Label", "typography-label", q.type(".cds-label")),
      ]}
    >
      <Field label="Contribution rate">{() => <Slider value={12} min={0} max={25} onChange={() => {}} formatValue={(v) => `${v}%`} />}</Field>
    </MeasuredAnatomy>
  );
}

/* ---------- Dialog (modal) ---------- */

export function DialogAnatomy() {
  return (
    <MeasuredAnatomy
      heading="Structure — dialog padding, text stack & actions"
      width={480}
      maxScale={1.5}
      marks={[
        { kind: "padding", sel: ".cds-modal" },
        { kind: "gap", a: ".cds-modal-title", b: ".cds-modal-body", axis: "y" },
        { kind: "gap", a: ".cds-modal-body", b: ".cds-modal-actions", axis: "y" },
        { kind: "gap", a: ".cds-modal-actions .cds-btn:nth-child(1)", b: ".cds-modal-actions .cds-btn:nth-child(2)", axis: "x" },
        { kind: "padding", sel: ".cds-modal-actions .cds-btn:nth-child(1)" },
        { kind: "padding", sel: ".cds-modal-actions .cds-btn:nth-child(2)" },
        { kind: "size", sel: ".cds-modal-actions .cds-btn:nth-child(2)", name: "Button (Save)" },
        { kind: "size", sel: ".cds-modal", name: "Dialog" },
        { kind: "outline", sel: ".cds-modal-title" },
        { kind: "outline", sel: ".cds-modal-body" },
      ]}
      layers={[
        { node: "Dialog", cls: ".cds-modal", direction: "Vertical", alignment: "Top left", spacing: "Gap 16 · Padding 16", sel: ".cds-modal" },
        { node: "Frame 10 (text)", cls: "title + body", direction: "Vertical", alignment: "Top left", spacing: "Gap 4", sel: "union:.cds-modal-title,.cds-modal-body" },
        { node: "Heading 2", cls: ".cds-modal-title", direction: "Vertical", alignment: "Top left", spacing: "—", sel: ".cds-modal-title" },
        { node: "Container (body)", cls: ".cds-modal-body", direction: "Vertical", alignment: "Top left", spacing: "—", sel: ".cds-modal-body" },
        { node: "Container (actions)", cls: ".cds-modal-actions", direction: "Horizontal", alignment: "Top right", spacing: "Gap 8", sel: ".cds-modal-actions" },
        { node: "Button", cls: ".cds-btn--sm", direction: "Horizontal", alignment: "Middle center", spacing: "Gap 8 · Padding 8 / 12", sel: ".cds-modal-actions .cds-btn" },
      ]}
      specs={(q) => {
        const titleBody = q.gap(".cds-modal-title", ".cds-modal-body", "y");
        return [
          pass("Dialog padding", "core-space-4", `${q.px(".cds-modal", "padding-top")}px`),
          titleBody === 4
            ? pass("Title → body", "core-space-1", `${titleBody}px`)
            : warn("Title → body", "margin-bottom core-space-2", `${titleBody}px`, "Figma: 4 (Frame 10 item spacing). Core .cds-modal-title has an 8px bottom margin — left as-is pending a decision"),
          pass("Body → actions", "core-space-4", `${q.gap(".cds-modal-body", ".cds-modal-actions", "y")}px`),
          pass("Button spacing", "core-space-2", `${q.px(".cds-modal-actions", "column-gap")}px`),
          pass("Button padding", "core-space-2 / core-space-3", `${q.px(".cds-modal-actions .cds-btn", "padding-top")}px ${q.px(".cds-modal-actions .cds-btn", "padding-left")}px`),
          pass("Title", "typography-heading", q.type(".cds-modal-title")),
          pass("Body", "typography-body-md", q.type(".cds-modal-body")),
          pass("Width", "480px", `${q.el(".cds-modal").offsetWidth}px`),
        ];
      }}
      note="Shown without the scrim; the live dialog is centered over a full-screen overlay and closes on Escape."
    >
      <div className="cds-modal" role="presentation" style={{ position: "static", margin: 0, maxWidth: "none" }}>
        <h2 className="cds-modal-title">Update beneficiary</h2>
        <div className="cds-modal-body">This will replace your current primary beneficiary on file.</div>
        <div className="cds-modal-actions">
          <Button variant="secondary" size="sm">Cancel</Button>
          <Button size="sm">Save</Button>
        </div>
      </div>
    </MeasuredAnatomy>
  );
}

/* ---------- Table ---------- */

const tableRows = [
  { id: 1, date: "Mar 14, 2026", type: "Contribution", amount: "$450.00" },
  { id: 2, date: "Feb 28, 2026", type: "Employer match", amount: "$225.00" },
  { id: 3, date: "Feb 14, 2026", type: "Contribution", amount: "$450.00" },
];

export function TableAnatomy() {
  return (
    <MeasuredAnatomy
      heading="Structure — header & body cell padding"
      width={480}
      maxScale={1.5}
      marks={[
        { kind: "padding", sel: "thead th:nth-child(1)" },
        { kind: "padding", sel: "tbody tr:nth-child(1) td:nth-child(3)" },
        { kind: "size", sel: "tbody tr:nth-child(3)", name: "Row", fill: "w" },
        { kind: "outline", sel: "thead tr" },
      ]}
      layers={[
        { node: "Table", cls: ".cds-table-wrap > .cds-table", direction: "Vertical", alignment: "Top left", spacing: "—", sel: ".cds-table" },
        { node: "Header row", cls: "thead tr", direction: "Horizontal", alignment: "Middle left", spacing: "—", sel: "thead tr" },
        { node: "Header cell", cls: "th", direction: "Horizontal", alignment: "Middle left", spacing: "Padding 12 / 16", sel: "thead th" },
        { node: "Body row", cls: "tbody tr", direction: "Horizontal", alignment: "Middle left", spacing: "—", sel: "tbody tr" },
        { node: "Body cell", cls: "td", direction: "Horizontal", alignment: "Middle left (numbers right)", spacing: "Padding 12 / 16", sel: "tbody td" },
      ]}
      specs={(q) => [
        pass("Header cell padding", "core-space-3 / core-space-4", `${q.px("thead th", "padding-top")}px ${q.px("thead th", "padding-left")}px`),
        pass("Body cell padding", "core-space-3 / core-space-4", `${q.px("tbody td", "padding-top")}px ${q.px("tbody td", "padding-left")}px`),
        pass("Row height", "comfortable density", `${q.el("tbody tr").offsetHeight}px`),
        pass("Header text", "typography-body-md · semibold", q.type("thead th")),
        pass("Body text", "typography-body-md", q.type("tbody td")),
      ]}
      note="Every cell in a row shares the padding marked here; zebra striping and hover only change the row background."
    >
      <Table
        columns={[
          { key: "date", header: "Date" },
          { key: "type", header: "Type" },
          { key: "amount", header: "Amount", align: "right" },
        ]}
        rows={tableRows}
      />
    </MeasuredAnatomy>
  );
}

/* ---------- Pagination ---------- */

export function PaginationAnatomy() {
  const btn = (n: number) => `.cds-page-btn:nth-child(${n})`;
  const gaps = Array.from({ length: 9 }, (_, i) => ({ kind: "gap" as const, a: btn(i + 1), b: btn(i + 2), axis: "x" as const }));
  return (
    <MeasuredAnatomy
      heading="Structure — item spacing & button padding"
      width={360}
      maxScale={1.5}
      marks={[
        ...gaps,
        { kind: "padding", sel: btn(1), edges: ["left", "right"] },
        { kind: "padding", sel: btn(4), edges: ["left", "right"] },
        { kind: "padding", sel: btn(10), edges: ["left", "right"] },
        { kind: "size", sel: btn(6), name: "Page button" },
        { kind: "outline", sel: ".cds-pagination" },
      ]}
      layers={[
        { node: "Navigation - Pagination", cls: ".cds-pagination", direction: "Horizontal", alignment: "Middle left", spacing: "Gap 4", sel: ".cds-pagination" },
        { node: "Button - Previous / Next page", cls: ".cds-page-btn (‹ ›)", direction: "Vertical", alignment: "Middle center", spacing: "Padding left/right 8", sel: ".cds-page-btn:first-child" },
        { node: "Button (page)", cls: ".cds-page-btn", direction: "Vertical", alignment: "Middle center", spacing: "Padding 8", sel: ".cds-page-btn:nth-child(2)" },
      ]}
      specs={(q) => [
        pass("Item spacing", "core-space-1", `${q.px(".cds-pagination", "column-gap")}px`),
        pass("Button padding left/right", "core-space-2", `${q.px(".cds-page-btn", "padding-left")}px`),
        pass(
          "Button size",
          "core-size-control-sm",
          `${q.el(btn(2)).offsetWidth} × ${q.el(btn(2)).offsetHeight}px`,
          "Figma: padding 8 on all sides. Code fixes the height at 32px and centers the label, which gives the same result without vertical padding",
        ),
        pass("Label", "typography-body-md · medium", q.type(btn(2))),
        pass("Border radius", "core-radius-sm", q.css(".cds-page-btn", "border-top-left-radius")),
      ]}
      note="Every page button shares the padding marked here; only the current page changes background and text color."
    >
      <Pagination page={3} pageCount={8} onChange={() => {}} />
    </MeasuredAnatomy>
  );
}

/* ---------- Slideover (drawer) ---------- */

export function SlideoverAnatomy() {
  const act = (n: number) => `.cds-drawer-header-actions > :nth-child(${n})`;
  return (
    <MeasuredAnatomy
      heading="Structure — header, actions & form body"
      width={520}
      maxScale={1.25}
      marks={[
        { kind: "padding", sel: ".cds-drawer-header" },
        { kind: "gap", a: ".cds-modal-title", b: ".cds-drawer-header-actions", axis: "x", label: "Auto", span: ".cds-drawer-header-actions" },
        { kind: "gap", a: act(1), b: act(2), axis: "x" },
        { kind: "gap", a: act(2), b: act(3), axis: "x" },
        { kind: "padding", sel: act(2) },
        { kind: "padding", sel: ".cds-drawer-body" },
        { kind: "gap", a: "[data-a=f1]", b: "[data-a=f2]", axis: "y" },
        { kind: "gap", a: "[data-a=f2]", b: "[data-a=f3]", axis: "y" },
        { kind: "size", sel: ".cds-drawer-close", name: "Close button" },
        { kind: "size", sel: "[data-a=f3] .cds-input", name: "Field input", fill: "w" },
        { kind: "outline", sel: ".cds-modal-title" },
        { kind: "outline", sel: ".cds-drawer-header-actions" },
      ]}
      layers={[
        { node: "Slideover", cls: ".cds-drawer", direction: "Vertical", alignment: "Top left", spacing: "—", sel: ".cds-drawer" },
        { node: "Header", cls: ".cds-drawer-header", direction: "Horizontal", alignment: "Middle, space between", spacing: "Gap 16 · Padding 16", sel: ".cds-drawer-header" },
        { node: "Heading", cls: ".cds-modal-title", direction: "Vertical", alignment: "Top left", spacing: "—", sel: ".cds-modal-title" },
        { node: "Actions", cls: ".cds-drawer-header-actions", direction: "Horizontal", alignment: "Middle right", spacing: "Gap 8", sel: ".cds-drawer-header-actions" },
        { node: "Button", cls: ".cds-btn--sm", direction: "Horizontal", alignment: "Middle center", spacing: "Padding 8 / 12", sel: ".cds-drawer-header-actions .cds-btn" },
        { node: "Body", cls: ".cds-drawer-body", direction: "Vertical", alignment: "Top left", spacing: "Padding 16", sel: ".cds-drawer-body" },
        { node: "Form fields", cls: ".cds-field stack", direction: "Vertical", alignment: "Top left", spacing: "Gap 16", sel: ".cds-drawer-main > div" },
      ]}
      specs={(q) => [
        pass("Header padding", "core-space-4", `${q.px(".cds-drawer-header", "padding-top")}px`),
        pass("Title ↔ actions", "space-between (min core-space-4)", `Auto · min ${q.px(".cds-drawer-header", "column-gap")}px`),
        pass("Action spacing", "core-space-2", `${q.px(".cds-drawer-header-actions", "column-gap")}px`),
        pass("Button padding", "core-space-2 / core-space-3", `${q.px(act(1), "padding-top")}px ${q.px(act(1), "padding-left")}px`),
        pass("Close button", "28 × 28 · padding 0 / 4", `${q.size(".cds-drawer-close")} · ${q.px(".cds-drawer-close", "padding-top")}px ${q.px(".cds-drawer-close", "padding-left")}px`),
        pass("Body padding", "core-space-4", `${q.px(".cds-drawer-body", "padding-top")}px`),
        pass("Field spacing", "core-space-4", `${q.gap("[data-a=f1]", "[data-a=f2]", "y")}px`),
        pass("Field max width", "core-input-maxWidth", `${q.css("[data-a=f1] .cds-field", "max-width")} (field ${q.el("[data-a=f1] .cds-field").offsetWidth}px)`),
        pass("Header divider", "1px · border-default", `${q.px(".cds-drawer-header", "border-bottom-width")}px`),
      ]}
      note="Shown without the scrim and slide-in animation; the live panel is full-height, slides in from the right and closes on Escape."
    >
      <div className="cds-drawer cds-drawer--from-right cds-drawer--visible" role="presentation" style={{ position: "static", transform: "none", width: 520, height: "auto", minHeight: 0, maxWidth: "none", boxShadow: "none", border: "1px solid var(--core-color-border-default)" }}>
        <div className="cds-drawer-header">
          <h2 className="cds-modal-title" style={{ margin: 0 }}>Add Allocation</h2>
          <div className="cds-drawer-header-actions">
            <Button variant="secondary" size="sm">Cancel</Button>
            <Button size="sm">Save</Button>
            <button type="button" className="cds-drawer-close" aria-label="Close" tabIndex={-1}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M1 1L11 11M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
            </button>
          </div>
        </div>
        <div className="cds-drawer-body">
          <div className="cds-drawer-main">
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--core-space-4)" }}>
              <div data-a="f1"><Field label="Recipient name">{(p) => <Input {...p} placeholder="e.g. Taylor Hale" />}</Field></div>
              <div data-a="f2"><Field label="Distribution mode">{(p) => <Select {...p} options={[{ value: "lump", label: "Lump sum" }]} placeholder="Select" />}</Field></div>
              <div data-a="f3"><Field label="Withdrawal amount">{(p) => <Input {...p} placeholder="$0.00" />}</Field></div>
            </div>
          </div>
        </div>
      </div>
    </MeasuredAnatomy>
  );
}

/* ---------- Loading spinner ---------- */

export function SpinnerAnatomy() {
  return (
    <MeasuredAnatomy
      heading="Structure — container padding & spinner spacing"
      width={420}
      maxScale={1.5}
      marks={[
        { kind: "padding", sel: "[data-a=box]" },
        { kind: "gap", a: ".cds-spinner", b: "[data-a=text]", axis: "x", span: "[data-a=text]" },
        { kind: "size", sel: ".cds-spinner", name: "Spinner" },
        { kind: "outline", sel: "[data-a=text]" },
      ]}
      layers={[
        { node: "Container (section)", cls: ".docs-section__content", direction: "Vertical", alignment: "Top left", spacing: "Gap 20", sel: "" },
        { node: "Container (panel)", cls: ".site-panel", direction: "Vertical", alignment: "Top left", spacing: "—", sel: "[data-a=box]" },
        { node: "Container (row)", cls: ".preview-surface", direction: "Horizontal", alignment: "Middle left", spacing: "Gap 16 · Padding 32", sel: "[data-a=box]" },
        { node: "Spinner", cls: ".cds-spinner", direction: "—", alignment: "—", spacing: "—", sel: ".cds-spinner" },
        { node: "Text", cls: "span", direction: "Vertical", alignment: "Top left", spacing: "—", sel: "[data-a=text]" },
      ]}
      specs={(q) => [
        pass("Container padding", "core-space-8", `${q.px("[data-a=box]", "padding-top")}px`),
        pass("Spinner → text", "core-space-4", `${q.px("[data-a=box]", "column-gap")}px`),
        pass("Spinner", "core-size-icon-md · 2px ring", q.size(".cds-spinner")),
        pass("Text", "typography-body-md", q.type("[data-a=text]")),
      ]}
      note="The spinner itself has no padding; spacing comes from the container around it. Section-level spacing (20) sits between the panel and neighbouring content."
    >
      <div
        data-a="box"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "var(--core-space-4)",
          padding: "var(--core-space-8)",
          border: "1px solid var(--core-color-border-default)",
          borderRadius: 12,
          background: "var(--core-color-surface-default)",
        }}
      >
        <Spinner />
        <span data-a="text" style={{ fontSize: 14, color: "var(--core-color-text-secondary)" }}>Saving your changes…</span>
      </div>
    </MeasuredAnatomy>
  );
}

/* ---------- Stepper ---------- */

/** Single-step state preview, shared by the Stepper state demo and its anatomy. */
export function StepperStatePreview({
  state,
  eyebrow,
  title,
  description,
  status,
  stepNumber = 2,
}: {
  state: StepState;
  eyebrow: string;
  title: string;
  description: string;
  status?: string;
  stepNumber?: number;
}) {
  const marker = state === "completed" ? "✓" : state === "warning" || state === "error" ? "!" : stepNumber;
  return (
    <div data-a="cell" style={{ display: "flex", flexDirection: "column", gap: "var(--core-space-2)", minWidth: 0 }}>
      <StateLabel>{eyebrow}</StateLabel>
      <ol className="cds-stepper cds-stepper--vertical" aria-label={`Stepper ${eyebrow}`} style={{ width: "auto", minWidth: 0 }}>
        <li className={`cds-step cds-step--${state} cds-step--vertical`} style={{ paddingBottom: 0 }}>
          <span className="cds-step-marker" aria-hidden="true">{marker}</span>
          <span className="cds-step-label">
            <span className="cds-step-title">{title}</span>
            <span className="cds-step-desc">{description}</span>
            <span className="cds-step-status">
              {state === "in-progress" ? (
                <span className="cds-step-status-spinner" role="status" aria-hidden="true" />
              ) : (
                <span className="cds-step-status-dot" aria-hidden="true" />
              )}
              {status ?? defaultStepStatus(state)}
            </span>
          </span>
        </li>
      </ol>
    </div>
  );
}

export function StepperAnatomy() {
  const a = "[data-a=state]";
  const b = "[data-a=vert] .cds-step:nth-child(1)";
  return (
    <MeasuredAnatomy
      heading="Structure — step item, text stack & status (state cell and vertical stepper)"
      width={420}
      maxScale={1.5}
      marks={[
        { kind: "gap", a: `${a} .docs-state-label`, b: `${a} .cds-stepper`, axis: "y" },
        { kind: "gap", a: `${a} .cds-step-marker`, b: `${a} .cds-step-label`, axis: "x", span: `${a} .cds-step-label` },
        { kind: "gap", a: `${a} .cds-step-desc`, b: `${a} .cds-step-status`, axis: "y", color: "#118D57" },
        { kind: "gap", a: `${b} .cds-step-marker`, b: `${b} .cds-step-label`, axis: "x", span: `${b} .cds-step-label` },
        { kind: "gap", a: `${b} .cds-step-desc`, b: `${b} .cds-step-status`, axis: "y", color: "#118D57" },
        { kind: "size", sel: `${a} .cds-step-marker` },
        { kind: "outline", sel: `${a} .cds-step-label` },
        { kind: "size", sel: `${b} .cds-step-marker` },
        { kind: "outline", sel: `${b} .cds-step-label` },
      ]}
      layers={[
        { node: "Stepper (state cell)", cls: "demo cell", direction: "Vertical", alignment: "Top left", spacing: "Gap 8", sel: "[data-a=state] [data-a=cell]" },
        { node: "Ordered List → Item", cls: ".cds-step", direction: "Horizontal", alignment: "Top left", spacing: "Gap 12", sel: "[data-a=state] .cds-step" },
        { node: "Background+Border (marker)", cls: ".cds-step-marker", direction: "Horizontal", alignment: "Middle center", spacing: "—", sel: "[data-a=state] .cds-step-marker" },
        { node: "Margin (text stack)", cls: ".cds-step-label", direction: "Vertical", alignment: "Top left", spacing: "—", sel: "[data-a=state] .cds-step-label" },
        { node: "Container (title / desc)", cls: ".cds-step-title / .cds-step-desc", direction: "Vertical", alignment: "Top left", spacing: "—", sel: "[data-a=state] .cds-step-title" },
        { node: "Margin (status)", cls: ".cds-step-status", direction: "Horizontal", alignment: "Middle left", spacing: "Top 4 · Gap 4", sel: "[data-a=state] .cds-step-status" },
      ]}
      specs={(q) => [
        pass("State label → step", "core-space-2", `${q.gap(`${a} .docs-state-label`, `${a} .cds-stepper`, "y")}px`),
        pass("Marker → text", "core-space-3", `${q.gap(`${a} .cds-step-marker`, `${a} .cds-step-label`, "x")}px`),
        pass("Description → status", "core-space-1", `${q.px(`${a} .cds-step-status`, "margin-top")}px`),
        pass("Dot → status text", "core-space-1", `${q.px(`${a} .cds-step-status`, "column-gap")}px`),
        pass("Number marker (W × H)", "28 × 28 · radius full", q.size(`${a} .cds-step-marker`)),
        pass("Title", "typography-body-md · medium", q.type(`${a} .cds-step-title`)),
        pass("Description", "typography-body-sm", q.type(`${a} .cds-step-desc`)),
        pass("Status", "typography-font-size-xs", q.type(`${a} .cds-step-status`)),
      ]}
      note="The vertical stepper reuses the same step item; only the marker fill and status color change per state (default, in progress, completed, warning, error)."
    >
      <div style={{ display: "flex", gap: "var(--core-space-10)", alignItems: "flex-start" }}>
        <div data-a="state">
          <StepperStatePreview state="default" eyebrow="DEFAULT" title="Fees" description="Review fees." stepNumber={3} />
        </div>
        <div data-a="vert">
          <Stepper
            orientation="vertical"
            currentIndex={1}
            steps={[
              { label: "Withdrawal", description: "Set type and amount." },
              { label: "Allocation", description: "Pick sources.", status: "In progress" },
            ]}
          />
        </div>
      </div>
    </MeasuredAnatomy>
  );
}

/* ---------- Avatar group ---------- */

export function AvatarGroupAnatomy() {
  const item = (n: number) => `.cds-avatar-group-item:nth-child(${n})`;
  return (
    <MeasuredAnatomy
      heading="Structure — overlapping avatar stack"
      width={140}
      maxScale={3}
      marks={[
        { kind: "gap", a: item(1), b: item(2), axis: "x" },
        { kind: "gap", a: item(2), b: item(3), axis: "x" },
        { kind: "gap", a: item(3), b: item(4), axis: "x" },
        { kind: "size", sel: item(1), name: "Avatar (with ring)" },
        { kind: "outline", sel: item(2) },
        { kind: "outline", sel: item(3) },
        { kind: "outline", sel: item(4) },
      ]}
      layers={[
        { node: "Avatar (group)", cls: ".cds-avatar-group", direction: "Horizontal", alignment: "Middle left", spacing: "Item spacing -8", sel: ".cds-avatar-group" },
        { node: "Ring (background + border)", cls: ".cds-avatar-group-item", direction: "Horizontal", alignment: "Top left", spacing: "2px surface ring", sel: ".cds-avatar-group-item" },
        { node: "Img - person", cls: ".cds-avatar-wrap / .cds-avatar", direction: "Horizontal", alignment: "Middle center", spacing: "—", sel: ".cds-avatar-group-item > *" },
        { node: "Img - +N more", cls: ".cds-avatar (overflow)", direction: "Horizontal", alignment: "Middle center", spacing: "—", sel: ".cds-avatar-group-item:last-child > *" },
      ]}
      specs={(q) => [
        pass("Overlap", "-core-space-2", `${q.gap(item(1), item(2), "x")}px`, "Negative item spacing — each avatar tucks 8px under the previous one"),
        pass("Item (with ring)", "avatar-sm + 2px ring", q.size(item(1))),
        pass("Avatar", "avatar-sm", q.size(`${item(1)} > *`)),
        pass("Overflow label", "+N · typography-font-size-xs", q.type(`${item(4)} > *`)),
      ]}
      note="Larger sizes (md / lg) keep the same structure; only the avatar diameter and overlap scale."
    >
      <AvatarGroup avatars={[...AVATAR_SAMPLES]} size="sm" max={3} />
    </MeasuredAnatomy>
  );
}

/* ---------- Line chart ---------- */

const chartData = [
  { month: "Mar", balance: 78400, contributions: 82000 },
  { month: "Apr", balance: 81200, contributions: 84500 },
  { month: "May", balance: 83950, contributions: 87000 },
  { month: "Jun", balance: 87100, contributions: 89500 },
  { month: "Jul", balance: 89800, contributions: 92000 },
  { month: "Aug", balance: 92400, contributions: 94500 },
];

export function LineChartAnatomy() {
  return (
    <MeasuredAnatomy
      heading="Structure — title, plot & description"
      width={480}
      maxScale={1.25}
      marks={[
        { kind: "padding", sel: "[data-a=card]" },
        { kind: "gap", a: ".cds-chart-title", b: ".cds-chart > div", axis: "y" },
        { kind: "gap", a: ".cds-chart > div", b: ".cds-chart-desc", axis: "y" },
        { kind: "outline", sel: ".cds-chart-title" },
        { kind: "size", sel: ".cds-chart > div", name: "Plot", fill: "w" },
        { kind: "outline", sel: ".cds-chart-desc" },
      ]}
      layers={[
        { node: "Chart card", cls: "demo wrapper", direction: "Vertical", alignment: "Top left", spacing: "Padding 20", sel: "[data-a=card]" },
        { node: "Chart", cls: "figure.cds-chart", direction: "Vertical", alignment: "Top left", spacing: "—", sel: ".cds-chart" },
        { node: "Title", cls: "figcaption.cds-chart-title", direction: "Vertical", alignment: "Top left", spacing: "Bottom 12", sel: ".cds-chart-title" },
        { node: "Plot", cls: "Recharts ResponsiveContainer", direction: "—", alignment: "—", spacing: "Margin 8 / 16 / 0 / 0", sel: ".cds-chart > div" },
        { node: "Legend", cls: ".recharts-legend-wrapper", direction: "Horizontal", alignment: "Middle center", spacing: "—", sel: ".recharts-legend-wrapper" },
        { node: "Description", cls: "p.cds-chart-desc", direction: "Vertical", alignment: "Top left", spacing: "Top 8", sel: ".cds-chart-desc" },
        { node: "Data table (a11y)", cls: "table.cds-visually-hidden", direction: "—", alignment: "—", spacing: "—", sel: "table.cds-visually-hidden" },
      ]}
      specs={(q) => [
        pass("Card padding", "core-space-5", `${q.px("[data-a=card]", "padding-top")}px`, "Demo wrapper — the chart itself has no padding"),
        pass("Title → plot", "core-space-3", `${q.px(".cds-chart-title", "margin-bottom")}px`),
        pass("Plot → description", "core-space-2", `${q.px(".cds-chart-desc", "margin-top")}px`),
        pass("Plot height", "260px", `${q.el(".cds-chart > div").offsetHeight}px`),
        pass("Title", "typography-body-md · semibold", q.type(".cds-chart-title")),
        pass("Description", "typography-font-size-xs", q.type(".cds-chart-desc")),
      ]}
      note="Line and bar charts share this frame; only the plot changes. A visually hidden data table carries the same numbers for screen readers."
    >
      <div data-a="card" style={{ padding: "var(--core-space-5)" }}>
        <LineChartCard
          title="Balance vs. contributions, last 6 months"
          description="Account balance has tracked closely with total contributions."
          data={chartData}
          xKey="month"
          series={[
            { key: "balance", label: "Account balance" },
            { key: "contributions", label: "Total contributions" },
          ]}
        />
      </div>
    </MeasuredAnatomy>
  );
}

/* ---------- Calendar ---------- */

export function CalendarAnatomy() {
  return (
    <MeasuredAnatomy
      heading="Structure — header, day grid & footer"
      width={280}
      maxScale={1.75}
      marks={[
        { kind: "padding", sel: ".cds-calendar-header" },
        { kind: "gap", a: ".cds-calendar-weekday:nth-child(1)", b: ".cds-calendar-weekday:nth-child(2)", axis: "x" },
        { kind: "padding", sel: ".cds-calendar-weekday:nth-child(1)", edges: ["top", "bottom"] },
        { kind: "gap", a: ".cds-calendar-weekday:nth-child(1)", b: ".cds-calendar-grid > :nth-child(8)", axis: "y" },
        { kind: "gap", a: ".cds-calendar-grid", b: ".cds-calendar-footer", axis: "y" },
        { kind: "padding", sel: ".cds-calendar-footer" },
        { kind: "size", sel: ".cds-calendar-footer .cds-btn:nth-child(2)", name: "Footer button" },
        { kind: "size", sel: ".cds-calendar-nav", name: "Nav button" },
        { kind: "outline", sel: ".cds-calendar-grid" },
      ]}
      layers={[
        { node: "Calendar", cls: ".cds-calendar", direction: "Vertical", alignment: "Top left", spacing: "—", sel: ".cds-calendar" },
        { node: "Header", cls: ".cds-calendar-header", direction: "Horizontal", alignment: "Middle, space between", spacing: "Padding 12 / 4", sel: ".cds-calendar-header" },
        { node: "Nav button", cls: ".cds-calendar-nav", direction: "Horizontal", alignment: "Middle center", spacing: "Padding 0 / 4", sel: ".cds-calendar-nav" },
        { node: "Month title", cls: ".cds-calendar-title", direction: "—", alignment: "Middle center", spacing: "—", sel: ".cds-calendar-title" },
        { node: "Day grid", cls: ".cds-calendar-grid", direction: "Grid 7 columns", alignment: "Top left", spacing: "Gap 4", sel: ".cds-calendar-grid" },
        { node: "Weekday", cls: ".cds-calendar-weekday", direction: "—", alignment: "Middle center", spacing: "Padding 4 / 0", sel: ".cds-calendar-weekday" },
        { node: "Day", cls: ".cds-calendar-day", direction: "—", alignment: "Middle center", spacing: "Padding 0 / 4", sel: ".cds-calendar-day" },
        { node: "Footer", cls: ".cds-calendar-footer", direction: "Horizontal", alignment: "Middle, space between", spacing: "Top 12 · Padding 12 / 4", sel: ".cds-calendar-footer" },
      ]}
      specs={(q) => [
        pass("Header padding", "core-space-3 / core-space-1", `${q.px(".cds-calendar-header", "padding-top")}px ${q.px(".cds-calendar-header", "padding-left")}px`),
        pass("Grid gap", "core-space-1", `${q.px(".cds-calendar-grid", "row-gap")}px`),
        pass("Weekday padding", "core-space-1 / core-space-0", `${q.px(".cds-calendar-weekday", "padding-top")}px ${q.px(".cds-calendar-weekday", "padding-left")}px`),
        pass("Day cell", "32px high · padding 0 / 4", `${q.el(".cds-calendar-day").offsetHeight}px · ${q.px(".cds-calendar-day", "padding-top")}px ${q.px(".cds-calendar-day", "padding-left")}px`),
        pass("Grid → footer", "core-space-3", `${q.px(".cds-calendar-footer", "margin-top")}px`),
        pass("Footer padding", "core-space-3 / core-space-1", `${q.px(".cds-calendar-footer", "padding-top")}px ${q.px(".cds-calendar-footer", "padding-left")}px`),
        pass("Nav button", "28 × 28", q.size(".cds-calendar-nav")),
        pass("Width", "280px", `${q.el(".cds-calendar").offsetWidth}px`),
      ]}
      note="Selected, today and disabled days change only color and weight; the grid stays the same."
    >
      <Calendar selected={new Date(2026, 8, 15)} onSelect={() => {}} onClear={() => {}} />
    </MeasuredAnatomy>
  );
}

/* ---------- App header & footer ---------- */

const headerAccount: HeaderAccount = {
  name: "Ava Sullivan",
  email: "ava.sullivan@email.com",
  avatarSrc: AVATAR_SAMPLES[2].src,
  items: [
    { label: "Change Password", icon: <Icon name="fa-solid fa-key" size="sm" /> },
    { label: "Log out", icon: <Icon name="fa-solid fa-right-from-bracket" size="sm" />, tone: "danger" },
  ],
};

const headerUtilities: HeaderUtility[] = [
  { label: "Get help", icon: <Icon name="fa-solid fa-circle-question" size="md" /> },
  { label: "Switch to dark theme", icon: <Icon name="fa-solid fa-moon" size="md" /> },
];

function BrandLogo() {
  return (
    <span className="docs-brand-logo">
      <img className="docs-brand-logo--light" src="/brand/lendguard/logo-lockup-light.svg" alt="LendGuard" width={190} height={34} />
      <img className="docs-brand-logo--dark" src="/brand/lendguard/logo-lockup-dark.svg" alt="LendGuard" width={190} height={34} />
    </span>
  );
}

/** Shared by the App header demo and its anatomy. */
export function AppHeaderDemo() {
  return (
    <div className="cds-app-header">
      <AppHeader brand={<BrandLogo />} utilities={headerUtilities} account={headerAccount} />
    </div>
  );
}

/** Shared by the App footer demo and its anatomy. */
export function AppFooterDemo() {
  return (
    <footer className="cds-app-footer">
      <AppFooter copyright="© 2026 LendGuard." links={<><a href="mailto:support@lendguard.com">Privacy</a><a href="mailto:support@lendguard.com">Terms</a></>} />
    </footer>
  );
}

export function AppHeaderAnatomy() {
  const icon = (n: number) => `.cds-app-header-actions > :nth-child(${n})`;
  return (
    <MeasuredAnatomy
      heading="Structure — header bar, utilities & account menu"
      width={640}
      maxScale={1.1}
      marks={[
        { kind: "padding", sel: ".cds-app-header", edges: ["left", "right"] },
        { kind: "gap", a: ".cds-app-header-brand", b: ".cds-app-header-actions", axis: "x", label: "Auto", span: ".cds-app-header-actions" },
        { kind: "gap", a: icon(1), b: icon(2), axis: "x" },
        { kind: "gap", a: icon(2), b: icon(3), axis: "x" },
        { kind: "padding", sel: "[data-a=menu] .cds-account-dropdown" },
        { kind: "gap", a: "[data-a=menu] .cds-account-identity-label", b: "[data-a=menu] .cds-account-identity-value", axis: "y" },
        { kind: "gap", a: "[data-a=menu] .cds-account-option-icon", b: "[data-a=menu] .cds-account-option-label", axis: "x", span: "[data-a=menu] .cds-account-option-icon" },
        { kind: "size", sel: ".docs-brand-logo--light" },
        { kind: "outline", sel: icon(1) },
        { kind: "size", sel: icon(2), name: "Icon button" },
        { kind: "size", sel: ".cds-account-trigger", name: "Avatar trigger" },
        { kind: "outline", sel: "[data-a=menu] .cds-account-identity" },
        { kind: "outline", sel: "[data-a=menu] .cds-account-option" },
      ]}
      layers={[
        { node: "Header (topbar)", cls: ".cds-app-header", direction: "Horizontal", alignment: "Middle, space between", spacing: "Padding 0 / 24 · 1px bottom border", sel: ".cds-app-header" },
        { node: "Brand (logo lockup)", cls: ".cds-app-header-brand > img", direction: "Horizontal", alignment: "Middle left", spacing: "—", sel: ".docs-brand-logo--light" },
        { node: "Top right", cls: ".cds-app-header-actions", direction: "Horizontal", alignment: "Middle right", spacing: "Gap 8", sel: ".cds-app-header-actions" },
        { node: "Icon button (help / theme)", cls: ".cds-app-header-icon-btn", direction: "—", alignment: "Middle center", spacing: "Hidden below 768px", sel: ".cds-app-header-icon-btn" },
        { node: "User chip", cls: ".cds-account-trigger", direction: "Horizontal", alignment: "Middle center", spacing: "—", sel: ".cds-app-header .cds-account-trigger" },
        { node: "Account dropdown", cls: ".cds-account-dropdown", direction: "Vertical", alignment: "Top left", spacing: "Padding 8 · 8 below trigger", sel: "[data-a=menu] .cds-account-dropdown" },
        { node: "Utilities (mobile)", cls: ".cds-account-utils", direction: "Horizontal", alignment: "Middle left", spacing: "Gap 8 · Padding 8 · shown below 768px", sel: "[data-a=menu] .cds-account-utils" },
        { node: "Identity", cls: ".cds-account-identity", direction: "Vertical", alignment: "Top left", spacing: "Gap 4 · Padding 8", sel: "[data-a=menu] .cds-account-identity" },
        { node: "Option", cls: ".cds-account-option", direction: "Horizontal", alignment: "Middle left", spacing: "Gap 8 · Padding 8", sel: "[data-a=menu] .cds-account-option" },
        { node: "Option icon", cls: ".cds-account-option-icon", direction: "—", alignment: "Middle center", spacing: "—", sel: "[data-a=menu] .cds-account-option-icon" },
      ]}
      specs={(q) => [
        pass("Header height", "core-layout-header-height", `${q.el(".cds-app-header").offsetHeight}px`),
        pass("Header padding", "core-space-6", `${q.px(".cds-app-header", "padding-left")}px`),
        pass("Logo (W × H)", "190 × 34 lockup", q.size(".docs-brand-logo--light")),
        pass("Right cluster spacing", "core-space-2", `${q.px(".cds-app-header-actions", "column-gap")}px`, "Portal uses 10px — snapped to 8 per the 4-point rule"),
        pass("Icon button", "36 × 36 · radius full", q.size(icon(1))),
        pass("Avatar", "32px · 1px ring", q.size(".cds-account-trigger")),
        pass("Dropdown width / padding", "260 · core-space-2", `${q.el("[data-a=menu] .cds-account-dropdown").offsetWidth}px · ${q.px("[data-a=menu] .cds-account-dropdown", "padding-top")}px`),
        pass("Identity padding / gap", "core-space-2 / core-space-1", `${q.px("[data-a=menu] .cds-account-identity", "padding-top")}px / ${q.px("[data-a=menu] .cds-account-identity", "row-gap")}px`, "Portal uses 10 / 2 — snapped to 8 / 4"),
        pass("Option padding / gap", "core-space-2", `${q.px("[data-a=menu] .cds-account-option", "padding-top")}px / ${q.px("[data-a=menu] .cds-account-option", "column-gap")}px`, "Portal uses 10 / 10 — snapped to 8 / 8"),
        pass("Option label", "typography-body-md · bold", q.type("[data-a=menu] .cds-account-option-label")),
        pass("Bottom border", "1px · border-default", `${q.px(".cds-app-header", "border-bottom-width")}px`),
      ]}
      note="Below 768px the help and theme buttons leave the bar and appear as a utilities row at the top of the account menu. The menu closes on Escape or an outside click."
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--core-space-6)" }}>
        <AppHeaderDemo />
        <div data-a="menu" style={{ position: "relative", height: 232 }}>
          <div style={{ position: "absolute", left: 226, top: -8 }}>
            <AccountMenu account={headerAccount} utilities={headerUtilities} defaultOpen />
          </div>
        </div>
      </div>
    </MeasuredAnatomy>
  );
}

export function AppFooterAnatomy() {
  return (
    <MeasuredAnatomy
      heading="Structure — footer bar & legal links"
      width={640}
      maxScale={1.1}
      marks={[
        { kind: "padding", sel: ".cds-app-footer" },
        { kind: "gap", a: ".cds-app-footer-copy", b: ".cds-app-footer-links", axis: "x", label: "Auto", span: ".cds-app-footer-links" },
        { kind: "gap", a: ".cds-app-footer-links > :nth-child(1)", b: ".cds-app-footer-links > :nth-child(2)", axis: "x" },
        { kind: "outline", sel: ".cds-app-footer-copy" },
        { kind: "outline", sel: ".cds-app-footer-links" },
        { kind: "size", sel: ".cds-app-footer", name: "Footer", fill: "w" },
      ]}
      layers={[
        { node: "Footer", cls: "footer.cds-app-footer", direction: "Horizontal", alignment: "Middle, space between", spacing: "Padding 8 / 24 · 1px top border", sel: ".cds-app-footer" },
        { node: "Inner row", cls: ".cds-app-footer-inner", direction: "Horizontal (stacks below 768px)", alignment: "Middle, space between", spacing: "Gap 4 / 16", sel: ".cds-app-footer-inner" },
        { node: "Copyright", cls: "p.cds-app-footer-copy", direction: "—", alignment: "Middle left", spacing: "—", sel: ".cds-app-footer-copy" },
        { node: "Legal links", cls: "nav.cds-app-footer-links", direction: "Horizontal", alignment: "Middle right", spacing: "Gap 16", sel: ".cds-app-footer-links" },
      ]}
      specs={(q) => [
        pass("Min height", "core-layout-footer-minHeight", `${q.el(".cds-app-footer").offsetHeight}px`),
        pass("Padding", "core-space-2 / core-space-6", `${q.px(".cds-app-footer", "padding-top")}px ${q.px(".cds-app-footer", "padding-left")}px`),
        pass("Row gap", "core-space-1 / core-space-4", `${q.px(".cds-app-footer-inner", "row-gap")}px / ${q.px(".cds-app-footer-inner", "column-gap")}px`),
        pass("Link spacing", "core-space-4", `${q.px(".cds-app-footer-links", "column-gap")}px`),
        pass("Text", "typography-font-size-xs · text-subtle", q.type(".cds-app-footer-copy")),
        pass("Top border", "1px · border-default", `${q.px(".cds-app-footer", "border-top-width")}px`),
      ]}
      note="Below 768px the row stacks (copyright above links) and padding becomes 12 / 16."
    >
      <AppFooterDemo />
    </MeasuredAnatomy>
  );
}

