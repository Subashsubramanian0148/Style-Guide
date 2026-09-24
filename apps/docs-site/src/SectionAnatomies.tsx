import React from "react";
import { MeasuredAnatomy, type AnatomySpecRow } from "./MeasuredAnatomy";
import { StateLabel } from "./DocsSection";
import { CardQuickLink } from "./QuickLinkCard";
import { Separator, Skeleton } from "../../../packages/core/src/components/Disclosure";
import { Tabs, AppSidebar } from "../../../packages/core/src/components/Navigation";
import { Progress } from "../../../packages/core/src/components/DataDisplay";
import { Empty } from "../../../packages/core/src/components/Primitives";
import { Button } from "../../../packages/core/src/components/Button";
import { Field, Input, InputWithIcon } from "../../../packages/core/src/components/Field";
import { Select } from "../../../packages/core/src/components/FormControls";
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
        { kind: "outline", sel: "[data-a=s1]" },
        { kind: "outline", sel: "[data-a=s2]" },
      ]}
      layers={[
        { node: "Container (card)", cls: "demo card", direction: "Vertical", alignment: "Top left", resizing: "Fixed × Hug", spacing: "Padding 16" },
        { node: "Section", cls: "div", direction: "Vertical", alignment: "Top left", resizing: "Fill × Hug", spacing: "—" },
        { node: "Title", cls: "div", direction: "Vertical", alignment: "Top left", resizing: "Fill × Hug", spacing: "—" },
        { node: "Body", cls: "div", direction: "Vertical", alignment: "Top left", resizing: "Fill × Hug", spacing: "Top 4" },
        { node: "Container:margin", cls: ".cds-separator", direction: "Vertical", alignment: "Top left", resizing: "Fill × 1px", spacing: "Top 16 · Bottom 16" },
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
        { kind: "gap", a: ".cds-select > span", b: ".cds-select-wrap > svg", axis: "x", label: "Auto" },
        { kind: "outline", sel: ".cds-label" },
        { kind: "outline", sel: ".cds-select-wrap > svg" },
      ]}
      layers={[
        { node: "Container (field)", cls: ".cds-field", direction: "Vertical", alignment: "Top left", resizing: "Fixed × Fixed", spacing: "Gap 8" },
        { node: "Label", cls: ".cds-label", direction: "Vertical", alignment: "Top left", resizing: "Fill × Hug", spacing: "—" },
        { node: "Container", cls: ".cds-select-wrap", direction: "Vertical", alignment: "Top left", resizing: "Fixed × Hug", spacing: "—" },
        { node: "Button", cls: ".cds-select", direction: "Horizontal", alignment: "Middle, spaced equally", resizing: "Fill × Fixed", spacing: "Padding 8 / 12" },
        { node: "Frame 4", cls: "text + chevron", direction: "Horizontal", alignment: "Middle, spaced equally", resizing: "Fill × Hug", spacing: "Auto" },
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
        { kind: "gap", a: ".cds-quicklink-icon", b: ".cds-quicklink-label", axis: "x", span: ".cds-quicklink-icon" },
        { kind: "outline", sel: ".cds-quicklink-icon" },
        { kind: "outline", sel: ".cds-quicklink-label" },
      ]}
      layers={[
        { node: "Container", cls: "demo cell", direction: "Vertical", alignment: "Top left", resizing: "Fixed × Hug", spacing: "Gap 8" },
        { node: "Button", cls: ".cds-quicklink", direction: "Horizontal", alignment: "Middle left", resizing: "Fill × Hug", spacing: "Gap 12 · Padding 16" },
        { node: "Icon tile", cls: ".cds-quicklink-icon", direction: "Horizontal", alignment: "Middle center", resizing: "Fixed 40 × 40", spacing: "—" },
        { node: "Icon", cls: ".cds-icon", direction: "Vertical", alignment: "Top left", resizing: "Fixed", spacing: "—" },
        { node: "Text", cls: ".cds-quicklink-label", direction: "Vertical", alignment: "Top left", resizing: "Hug × Hug", spacing: "—" },
      ]}
      specs={(q) => [
        pass("State label → card", "core-space-2", `${q.gap(".docs-state-label", ".cds-quicklink", "y")}px`),
        pass("Card padding", "core-space-4", `${q.px(".cds-quicklink", "padding-top")}px`),
        pass("Icon → label", "core-space-3", `${q.px(".cds-quicklink", "column-gap")}px`),
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
        { kind: "gap", a: ".cds-input-icon", b: { inner: ".cds-input", edge: "right" }, axis: "x", color: "#118D57" },
        { kind: "gap", a: { content: ".cds-input", edge: "right" }, b: ".cds-input-icon", axis: "x" },
        { kind: "outline", sel: ".cds-label" },
        { kind: "outline", sel: ".cds-input-icon" },
      ]}
      layers={[
        { node: "Bank Fields", cls: ".cds-field", direction: "Vertical", alignment: "Top left", resizing: "Fixed × Fixed", spacing: "Gap 8" },
        { node: "Label", cls: ".cds-label", direction: "Vertical", alignment: "Top left", resizing: "Fill × Hug", spacing: "—" },
        { node: "Container", cls: ".cds-input-affix-wrap", direction: "Horizontal", alignment: "Middle left", resizing: "Fill × Hug", spacing: "—" },
        { node: "Text Input", cls: ".cds-input", direction: "Horizontal", alignment: "Middle left", resizing: "Fixed × Fixed", spacing: "Padding 8 / 12" },
        { node: "Frame 5", cls: "text + icon", direction: "Horizontal", alignment: "Middle left", resizing: "Fill × Hug", spacing: "Gap 8" },
        { node: "Icon", cls: ".cds-input-icon--trailing", direction: "Horizontal", alignment: "Middle center", resizing: "Fixed 16", spacing: "—" },
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
        { kind: "outline", sel: "[data-a=pre] .cds-label" },
        { kind: "outline", sel: "[data-a=suf] .cds-label" },
      ]}
      layers={[
        { node: "Prefix / Suffix", cls: ".cds-field", direction: "Vertical", alignment: "Top left", resizing: "Fixed × Fixed", spacing: "Gap 8" },
        { node: "Label", cls: ".cds-label", direction: "Vertical", alignment: "Top left", resizing: "Fill × Hug", spacing: "—" },
        { node: "Container", cls: ".cds-input-group", direction: "Horizontal", alignment: "Top left", resizing: "Fill × Hug", spacing: "—" },
        { node: "Text (addon)", cls: ".cds-input-group-addon", direction: "Horizontal", alignment: "Middle left", resizing: "Hug × Fill", spacing: "Padding 8 / 12" },
        { node: "Text Input", cls: ".cds-input", direction: "Vertical", alignment: "Middle left", resizing: "Fixed × Fixed", spacing: "Padding 8 / 12" },
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
        { kind: "gap", a: `${v}:nth-child(1)`, b: `${v}:nth-child(2)`, axis: "y" },
        { kind: "gap", a: `${v}:nth-child(2)`, b: `${v}:nth-child(3)`, axis: "y" },
        { kind: "gap", a: `${v}:nth-child(3)`, b: `${v}:nth-child(4)`, axis: "y" },
        { kind: "padding", sel: `${v}:nth-child(2)` },
        { kind: "outline", sel: "[data-a=h] .cds-tabs" },
        { kind: "outline", sel: "[data-a=v] .cds-tabs" },
      ]}
      layers={[
        { node: "Frame 7 (tab list)", cls: ".cds-tabs", direction: "Horizontal", alignment: "Middle left", resizing: "Hug × Hug", spacing: "Gap 8" },
        { node: "Tab", cls: ".cds-tab", direction: "Vertical", alignment: "Middle center", resizing: "Hug × Fixed", spacing: "Padding 12" },
        { node: "Tab List (vertical)", cls: ".cds-tabs--vertical", direction: "Vertical", alignment: "Top left", resizing: "Hug × Hug", spacing: "Gap 4" },
        { node: "Tab (vertical)", cls: ".cds-tab--vertical", direction: "Vertical", alignment: "Middle left", resizing: "Fill × Hug", spacing: "Padding 8 / 16" },
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
        { kind: "outline", sel: "[data-a=head]" },
        { kind: "outline", sel: "[data-a=lines]" },
      ]}
      layers={[
        { node: "Skeleton (card)", cls: "demo card", direction: "Vertical", alignment: "Top left", resizing: "Fixed × Hug", spacing: "Gap 16 · Padding 24" },
        { node: "Container (header)", cls: "div", direction: "Horizontal", alignment: "Middle left", resizing: "Fill × Hug", spacing: "Gap 12" },
        { node: "Container (meta lines)", cls: "div", direction: "Vertical", alignment: "Top left", resizing: "Fill × Hug", spacing: "Gap 4" },
        { node: "Container (body lines)", cls: "div", direction: "Vertical", alignment: "Top left", resizing: "Fill × Hug", spacing: "Gap 8" },
        { node: "Bone", cls: ".cds-skeleton", direction: "—", alignment: "—", resizing: "Fixed height", spacing: "—" },
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
        { kind: "gap", a: `${link}:nth-child(1) .cds-sidenav-icon-plain`, b: `${link}:nth-child(1) .cds-sidenav-label`, axis: "y", span: `${link}:nth-child(1) .cds-sidenav-label` },
        { kind: "outline", sel: `${link}:nth-child(1) .cds-sidenav-icon-plain` },
        { kind: "outline", sel: `${link}:nth-child(1) .cds-sidenav-label` },
      ]}
      layers={[
        { node: "Navigation - Sidebar", cls: ".cds-app-sidebar--rail", direction: "Vertical", alignment: "Top left", resizing: "Fixed × Hug", spacing: "Gap 8 · Padding top/bottom 16" },
        { node: "Button", cls: ".cds-app-sidebar-link", direction: "Vertical", alignment: "Top center", resizing: "Fixed × Hug", spacing: "Gap 4 · Padding 12 / 8" },
        { node: "Text (icon)", cls: ".cds-sidenav-icon-plain", direction: "Horizontal", alignment: "Middle center", resizing: "Fixed 24 × 24", spacing: "—" },
        { node: "Italic Text (label)", cls: ".cds-sidenav-label", direction: "Vertical", alignment: "Top center", resizing: "Hug × Hug", spacing: "—" },
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
        { kind: "outline", sel: ".cds-progress" },
      ]}
      layers={[
        { node: "Progress bar", cls: "wrapper", direction: "Vertical", alignment: "Top left", resizing: "Fixed × Hug", spacing: "Gap 4" },
        { node: "Container (label)", cls: "div", direction: "Vertical", alignment: "Top left", resizing: "Fill × Hug", spacing: "Bottom 4" },
        { node: "Progress Bar:margin", cls: ".cds-progress", direction: "Vertical", alignment: "Top left", resizing: "Fill × Hug", spacing: "—" },
        { node: "Progress Bar (fill)", cls: ".cds-progress-bar", direction: "Vertical", alignment: "Top left", resizing: "% × Fixed", spacing: "—" },
      ]}
      specs={(q) => [
        pass("Label → bar", "core-space-1", `${q.gap(label, ".cds-progress", "y")}px`),
        pass("Track height", "core-space-2", `${q.el(".cds-progress").offsetHeight}px`),
        pass("Fill", "value 68%", `${Math.round((q.el(".cds-progress-bar").offsetWidth / q.el(".cds-progress").clientWidth) * 100)}%`),
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
      ]}
      layers={[
        { node: "Input (field)", cls: ".cds-field", direction: "Vertical", alignment: "Top left", resizing: "Fixed × Hug", spacing: "Gap 8" },
        { node: "Label", cls: ".cds-label", direction: "Vertical", alignment: "Top left", resizing: "Fill × Hug", spacing: "—" },
        { node: "Text Input", cls: ".cds-input", direction: "Vertical", alignment: "Middle left", resizing: "Fixed × Fixed", spacing: "Padding 8 / 12" },
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
        { kind: "outline", sel: ".cds-empty-icon" },
        { kind: "outline", sel: ".cds-empty-title" },
        { kind: "outline", sel: ".cds-empty-desc" },
      ]}
      layers={[
        { node: "Empty State", cls: ".cds-empty", direction: "Vertical", alignment: "Middle center", resizing: "Hug × Hug", spacing: "Gap 16 · Padding 16" },
        { node: "Frame 9", cls: "icon + title + desc", direction: "Vertical", alignment: "Top center", resizing: "Hug × Hug", spacing: "Gap 8" },
        { node: "Container (icon)", cls: ".cds-empty-icon", direction: "Horizontal", alignment: "Middle center", resizing: "Fixed 44 × 44", spacing: "—" },
        { node: "Button", cls: ".cds-btn--sm", direction: "Horizontal", alignment: "Middle center", resizing: "Hug × Fixed", spacing: "Gap 8 · Padding 8 / 12" },
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
          pass("Icon", "44px", q.size(".cds-empty-icon")),
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
