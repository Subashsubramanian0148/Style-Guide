import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Button, IconButton } from "../../../packages/core/src/components/Button";
import { Input, InputWithIcon } from "../../../packages/core/src/components/Field";
import { Select, Checkbox, Radio, Textarea } from "../../../packages/core/src/components/FormControls";
import { Badge } from "../../../packages/core/src/components/Misc";
import { Separator } from "../../../packages/core/src/components/Disclosure";
import { LineChartCard } from "../../../packages/core/src/components/Chart";
import { Avatar } from "../../../packages/core/src/components/DataDisplay";
import { Icon, Empty, Slider } from "../../../packages/core/src/components/Primitives";
import { Field } from "../../../packages/core/src/components/Field";
import { Accordion } from "../../../packages/core/src/components/Disclosure";
import { Alert, Switch } from "../../../packages/core/src/components/Misc";
import { Toast, Spinner } from "../../../packages/core/src/components/Overlays";
import { Tabs, Stepper, Pagination, AppSidebar } from "../../../packages/core/src/components/Navigation";
import { Progress, Table } from "../../../packages/core/src/components/DataDisplay";
import { AttachmentList } from "../../../packages/core/src/components/Attachment";
import { Calendar } from "../../../packages/core/src/components/Calendar";
import { InputGroup } from "../../../packages/core/src/components/ToggleInputs";
import { AccountMenu } from "../../../packages/core/src/components/Layout";
import { CardQuickLink } from "./QuickLinkCard";
import { AppHeaderDemo, AppFooterDemo, SkeletonCard } from "./SectionAnatomies";
import { SectionHeading, SpecTableCard, SpecNote } from "./AnatomySpec";

interface Variant {
  name: string;
  token: string;
  node: React.ReactNode;
  /** Element to measure inside `node`; defaults to its first child. */
  sel?: string;
  /** Width stretches with the container; the measured value is at a 320px container. */
  fillWidth?: boolean;
}

interface Responsive {
  mobile: string;
  tablet: string;
  desktop: string;
  motion?: string;
}

interface Sizing {
  variants?: Variant[];
  /** Each state rendered and measured — sizes that change with state show here. */
  states?: Variant[];
  responsive: Responsive;
}

const SAME = "Same as desktop — no breakpoint-specific rules.";
const FIELD: Responsive = {
  mobile: "Height unchanged. Width stretches to its container, so fields go full-width when the form stacks to one column.",
  tablet: "Height unchanged. Width stretches to the grid column it sits in.",
  desktop: "Height fixed by size token; width stretches to its container.",
};
const FIXED: Responsive = { mobile: SAME, tablet: SAME, desktop: "Fixed size at every breakpoint." };
const opts = [{ value: "a", label: "Option" }];
const edit = <Icon name="fa-solid fa-pen" size="sm" />;

const inputVariants = (withIcon: boolean): Variant[] =>
  (["sm", "md", "lg"] as const).map((s) => ({
    name: s,
    token: `core-size-control-${s}`,
    fillWidth: true,
    node: withIcon ? (
      <InputWithIcon size={s} trailingIcon={<Icon name="fa-solid fa-credit-card" size="sm" />} placeholder="Value" aria-label={`Input ${s}`} />
    ) : (
      <Input size={s} placeholder="Value" aria-label={`Input ${s}`} />
    ),
    sel: withIcon ? ".cds-input" : undefined,
  }));

export const SIZING: Record<string, Sizing> = {
  button: {
    variants: (["sm", "md", "lg"] as const).map((s) => ({ name: s, token: `core-size-control-${s} (min-height)`, node: <Button size={s}>Continue</Button> })),
    responsive: { mobile: "Height unchanged; width is sized by the label. Forms may place buttons full-width — that is a layout choice, not a component rule.", tablet: SAME, desktop: "Width is sized by the label; height fixed per size." },
  },
  "icon-button": {
    variants: (["sm", "md", "lg"] as const).map((s) => ({ name: s, token: `core-size-control-${s}`, node: <IconButton size={s} aria-label={`Edit ${s}`}>{edit}</IconButton> })),
    responsive: FIXED,
  },
  badge: {
    variants: (["sm", "md"] as const).map((s) => ({ name: s, token: `badge-size-${s}`, node: <Badge size={s} tone="primary">Active</Badge> })),
    responsive: { ...FIXED, desktop: "Height fixed per size; width is sized by the label." },
  },
  avatar: {
    variants: (["sm", "md", "lg"] as const).map((s) => ({ name: s, token: `avatar-${s}`, node: <Avatar size={s} name="Jordan Lee" /> })),
    responsive: FIXED,
  },
  "checkbox-radio": {
    variants: [
      ...(["sm", "md", "lg"] as const).map((s) => ({ name: `Checkbox ${s}`, token: "checkbox box", node: <Checkbox size={s} label="Option" readOnly />, sel: ".cds-checkbox-box" })),
      ...(["sm", "md", "lg"] as const).map((s) => ({ name: `Radio ${s}`, token: "radio circle", node: <Radio size={s} label="Option" readOnly />, sel: ".cds-radio-box" })),
    ],
    responsive: { ...FIXED, desktop: "Control size fixed per size; the row keeps ≥24px height for touch." },
  },
  input: { variants: inputVariants(false), responsive: FIELD },
  "input-icon": { variants: inputVariants(true), responsive: FIELD },
  "payment-bank-fields": { variants: inputVariants(true), responsive: FIELD },
  select: {
    variants: (["sm", "md", "lg"] as const).map((s) => ({ name: s, token: `core-size-control-${s}`, fillWidth: true, node: <Select size={s} options={opts} aria-label={`Select ${s}`} />, sel: ".cds-select" })),
    responsive: FIELD,
  },
  combobox: { responsive: FIELD },
  "date-picker": { responsive: { ...FIELD, desktop: "Input height fixed; the calendar popover is a fixed 280px wide." } },
  textarea: { responsive: { ...FIELD, desktop: "Width stretches to its container; min-height 88px and the user can resize vertically." } },
  "input-group": { responsive: { ...FIELD, desktop: "Addon is sized by its text; the input takes the remaining width." } },
  slider: { responsive: { ...FIELD, desktop: "Control height fixed at 32px; the track stretches to the full width left after the value label." } },
  switch: { responsive: FIXED },
  attachment: { responsive: { mobile: "Rows stay single-line and stretch to the full width; long file names truncate.", tablet: SAME, desktop: "Rows stretch to their container; icon (32) and remove (24) stay fixed." } },
  calendar: { responsive: { mobile: "Fixed 280px wide — fits a 320px phone with 16px gutters.", tablet: SAME, desktop: "Fixed 280px wide; day cells split the width evenly." } },
  accordion: { responsive: { mobile: "Stretches to the full width; trigger text wraps rather than truncating.", tablet: SAME, desktop: "Stretches to its container; trigger height grows with wrapped text." } },
  alert: { responsive: { mobile: "Stretches to the full width; text wraps under the title.", tablet: SAME, desktop: "Stretches to its container; icon (20) and dismiss (24) stay fixed." } },
  empty: { responsive: { mobile: "Content centered; text wraps within the container.", tablet: SAME, desktop: "Sized by its content, centered in the available space." } },
  spinner: { responsive: { ...FIXED, motion: "prefers-reduced-motion: rotation is disabled." } },
  toast: { responsive: { mobile: "Minimum width 280px; stacks in the fixed bottom-right viewport (20px from the edges).", tablet: SAME, desktop: "Minimum width 280px, grows with its text.", motion: "prefers-reduced-motion: no slide-in animation." } },
  progress: { responsive: { mobile: "Track stretches to the full width.", tablet: SAME, desktop: "Track stretches to its container; height fixed at 8px.", motion: "prefers-reduced-motion: the indeterminate bar stops animating." } },
  skeleton: { responsive: { mobile: "Bones use percentage widths, so they shrink with the card.", tablet: SAME, desktop: "Card fixed at 340px in the demo; bones scale with it.", motion: "prefers-reduced-motion: the shimmer is disabled." } },
  separator: { responsive: { mobile: "1px line stretches to the full width.", tablet: SAME, desktop: "1px line stretches to its container." } },
  "quick-links": { responsive: { mobile: "Cards wrap onto new rows and can go full-width.", tablet: "Cards wrap to fit the row.", desktop: "Cards sit in a row; each is sized by its label with a 40px icon tile." } },
  sidebar: { responsive: { mobile: "Below 576px the shell sidebar becomes a fixed bottom tab bar (icon above label).", tablet: "576–767px: the shell sidebar collapses to a 96px rail with labels visually hidden.", desktop: "Full sidebar; the rail variant shown here keeps 96px at every size." } },
  tabs: { responsive: { mobile: "Tab list stays on one row and overflows a phone with 3+ tabs (not scrollable) — needs a scroll container.", tablet: SAME, desktop: "Horizontal tabs are sized by their labels; vertical tabs stretch to the list width." } },
  pagination: { responsive: { mobile: "Buttons stay 32 × 32, but 10 buttons need 356px and overflow a 375px phone — show fewer page numbers on mobile.", tablet: SAME, desktop: "Fixed 32 × 32 buttons with 4px spacing." } },
  stepper: { responsive: { mobile: "Below 576px the horizontal stepper scrolls sideways; each step keeps ≥96px and connectors ≥24px. Vertical stepper is unchanged.", tablet: SAME, desktop: "Horizontal steps share the width evenly." } },
  modal: { responsive: { mobile: "Width 100% up to 480px, so it spans the phone width inside the overlay padding.", tablet: SAME, desktop: "Max width 480px, centered over the overlay." } },
  slideover: { responsive: { mobile: "Max width 90vw. Below 576px a split body stacks and the aside goes full-width.", tablet: "Max width 90vw.", desktop: "Fixed width (520px here), full height from the right.", motion: "prefers-reduced-motion: no slide animation." } },
  tooltip: { responsive: { ...FIXED, desktop: "Trigger fixed 32 × 32. The bubble stays on one line up to a 240px max width; longer text truncates with an ellipsis. Placement: top, right, bottom or left." } },
  "data-table": { responsive: { mobile: "Below 576px the toolbar stacks and search goes full-width; the table scrolls sideways inside its wrapper.", tablet: "Table scrolls sideways if columns don't fit.", desktop: "Stretches to its container; rows 46px at comfortable density." } },
  table: { responsive: { mobile: "Scrolls sideways inside its wrapper rather than squashing columns.", tablet: SAME, desktop: "Stretches to its container; rows 46px at comfortable density." } },
  "line-chart": { responsive: { mobile: "Plot keeps its 260px height and stretches to the full width (Recharts ResponsiveContainer).", tablet: SAME, desktop: "Plot stretches to its container at a fixed 260px height." } },
  "app-header": { responsive: { mobile: "Below 768px the help and theme buttons leave the bar and appear at the top of the account menu.", tablet: "768px and up: same as desktop.", desktop: "56px bar: logo left, icon buttons and avatar right, 24px side padding." } },
  "app-footer": { responsive: { mobile: "Below 768px copyright and links stack; padding becomes 12 / 16.", tablet: "768px and up: same as desktop.", desktop: "48px min height; copyright left, links right, 8 / 24 padding." } },
};

const st = (name: string, token: string, node: React.ReactNode, sel?: string, fillWidth = true): Variant => ({ name, token, node, sel, fillWidth });
const acc = [{ id: "a", title: "What is vesting?", content: "Vesting is the schedule by which you gain full ownership of employer contributions to your account over a 3-year cliff or graded period." }];
const fieldStates = (control: (p: object) => React.ReactNode, sel = ".cds-field"): Variant[] => [
  st("Default", "field", <Field label="Label">{(p) => control(p)}</Field>, sel),
  st("With hint", "field + hint", <Field label="Label" hint="Helper text shown under the field.">{(p) => control(p)}</Field>, sel),
  st("With error", "field + error", <Field label="Label" error="This field is required.">{(p) => control(p)}</Field>, sel),
  st("Disabled", "field", <div className="force-disabled"><Field label="Label">{(p) => control({ ...p, disabled: true })}</Field></div>, sel),
];
const STATES: Record<string, Variant[]> = {
  accordion: [
    st("Item — closed", "trigger only", <Accordion items={acc} />, ".cds-accordion-item"),
    st("Item — open", "trigger + panel", <Accordion items={acc} defaultOpenIds={["a"]} />, ".cds-accordion-item"),
    st("Trigger — closed", ".cds-accordion-trigger", <Accordion items={acc} />, ".cds-accordion-trigger"),
    st("Trigger — open", ".cds-accordion-trigger", <Accordion items={acc} defaultOpenIds={["a"]} />, ".cds-accordion-trigger"),
    st("Panel — open", ".cds-accordion-panel", <Accordion items={acc} defaultOpenIds={["a"]} />, ".cds-accordion-panel"),
  ],
  alert: [
    st("Title only", "no body", <Alert tone="info" title="Scheduled maintenance" />, ".cds-alert"),
    st("Title + body", "one-line body", <Alert tone="warning" title="Beneficiary missing">Add a beneficiary to finish setup.</Alert>, ".cds-alert"),
    st("Title + body + dismiss", "dismissible", <Alert tone="success" title="Enrollment complete" onDismiss={() => {}}>You are contributing 6% starting next pay cycle.</Alert>, ".cds-alert"),
  ],
  toast: [
    st("Title only", "no body", <Toast tone="success" title="Changes saved" onClose={() => {}} />, ".cds-toast"),
    st("Title + body", "one-line body", <Toast tone="warning" title="Beneficiary missing" onClose={() => {}}>Add a beneficiary to finish setting up your account.</Toast>, ".cds-toast"),
    st("With timestamp", "title + time + body", <Toast tone="info" title="Scheduled maintenance" timestamp="2m ago" onClose={() => {}}>The portal will be unavailable Sunday 2–4am ET.</Toast>, ".cds-toast"),
  ],
  attachment: [
    st("Default", "no badge", <AttachmentList files={[{ id: "1", name: "beneficiary-form.pdf", size: "212 KB" }]} onRemove={() => {}} />, ".cds-attachment"),
    st("Success (badge md)", "status badge", <AttachmentList files={[{ id: "1", name: "beneficiary-form.pdf", size: "212 KB", status: "success", statusText: "Uploaded", badgeSize: "md" }]} onRemove={() => {}} />, ".cds-attachment"),
    st("Error (badge sm)", "status badge", <AttachmentList files={[{ id: "1", name: "voided-check.png", size: "4.2 MB", status: "error", statusText: "Too large", badgeSize: "sm" }]} onRemove={() => {}} />, ".cds-attachment"),
  ],
  button: [
    st("Default", "md", <Button>Continue</Button>, undefined, false),
    st("Loading", "md · spinner replaces label", <Button loading>Continue</Button>, undefined, false),
    st("Disabled", "md", <Button disabled>Continue</Button>, undefined, false),
  ],
  "icon-button": [
    st("Default", "sm", <IconButton size="sm" aria-label="Edit">{edit}</IconButton>, undefined, false),
    st("Disabled", "sm", <IconButton size="sm" aria-label="Edit" disabled>{edit}</IconButton>, undefined, false),
  ],
  "checkbox-radio": [
    st("Checkbox unchecked", "row", <Checkbox label="Option" readOnly />, ".cds-checkbox", false),
    st("Checkbox checked", "row", <Checkbox label="Option" checked readOnly />, ".cds-checkbox", false),
    st("Checkbox indeterminate", "row", <Checkbox label="Option" indeterminate readOnly />, ".cds-checkbox", false),
    st("Radio selected", "row", <Radio label="Option" checked readOnly />, ".cds-radio", false),
    st("Disabled", "row", <Checkbox label="Option" disabled readOnly />, ".cds-checkbox", false),
  ],
  switch: [
    st("Off", "row", <Switch label="Option" checked={false} onChange={() => {}} />, ".cds-switch", false),
    st("On", "row", <Switch label="Option" checked onChange={() => {}} />, ".cds-switch", false),
    st("Disabled", "row", <Switch label="Option" checked={false} disabled onChange={() => {}} />, ".cds-switch", false),
  ],
  input: fieldStates((p) => <Input {...p} placeholder="Jordan Lee" />),
  "input-icon": fieldStates((p) => <InputWithIcon {...p} trailingIcon={<Icon name="fa-solid fa-magnifying-glass" size="sm" />} placeholder="Search" />),
  "payment-bank-fields": fieldStates((p) => <InputWithIcon {...p} trailingIcon={<Icon name="fa-solid fa-credit-card" size="sm" />} placeholder="1234 5678 9012 3456" />),
  select: fieldStates((p) => <Select {...p} options={opts} />),
  textarea: fieldStates((p) => <Textarea {...p} rows={2} placeholder="Type here..." />),
  "input-group": fieldStates((p) => <InputGroup prefix="$"><Input {...p} placeholder="0.00" /></InputGroup>),
  slider: [
    st("Default", "field", <Field label="Contribution rate">{() => <Slider value={12} min={0} max={25} onChange={() => {}} formatValue={(v) => `${v}%`} />}</Field>, ".cds-field"),
  ],
  tabs: [
    st("Tab — selected", "horizontal", <Tabs items={[{ id: "a", label: "Overview", content: null }, { id: "b", label: "Documents", content: null }]} />, ".cds-tab[aria-selected='true']", false),
    st("Tab — unselected", "horizontal", <Tabs items={[{ id: "a", label: "Overview", content: null }, { id: "b", label: "Documents", content: null }]} />, ".cds-tab[aria-selected='false']", false),
    st("Vertical tab — selected", "vertical", <Tabs orientation="vertical" items={[{ id: "a", label: "Personal Details", content: null }, { id: "b", label: "Bank Details", content: null }]} />, ".cds-tab[aria-selected='true']"),
    st("Vertical tab — unselected", "vertical", <Tabs orientation="vertical" items={[{ id: "a", label: "Personal Details", content: null }, { id: "b", label: "Bank Details", content: null }]} />, ".cds-tab[aria-selected='false']"),
  ],
  stepper: (["default", "in-progress", "completed", "warning", "error"] as const).map((state) =>
    st(state.replace("-", " "), "vertical step", <Stepper orientation="vertical" currentIndex={0} steps={[{ label: "Fees", description: "Review fees.", state }]} />, ".cds-step"),
  ),
  progress: [
    st("Determinate", "68%", <Progress value={68} label="Retirement readiness — 68%" />, ".cds-progress"),
    st("Indeterminate", "animated", <Progress indeterminate label="Submitting your request…" />, ".cds-progress"),
  ],
  empty: [
    st("With action", "button shown", <Empty title="No transactions yet" description="Once you make your first contribution, it will show up here." action={<Button size="sm">Learn more</Button>} />, ".cds-empty"),
    st("Without action", "text only", <Empty title="No transactions yet" description="Once you make your first contribution, it will show up here." />, ".cds-empty"),
  ],
  sidebar: [
    st("Item — default", "rail link", <AppSidebar variant="rail" items={[{ label: "Dashboard", icon: <Icon name="fa-solid fa-grip" size="lg" /> }]} />, ".cds-app-sidebar-link", false),
    st("Item — selected", "rail link", <AppSidebar variant="rail" items={[{ label: "Dashboard", icon: <Icon name="fa-solid fa-grip" size="lg" />, current: true }]} />, ".cds-app-sidebar-link", false),
    st("Item — disabled", "rail link", <AppSidebar variant="rail" items={[{ label: "Dashboard", icon: <Icon name="fa-solid fa-grip" size="lg" />, disabled: true }]} />, ".cds-app-sidebar-link", false),
  ],
  "quick-links": [
    st("Default", "card", <CardQuickLink icon="fa-solid fa-chart-line" label="Links" />, ".cds-quicklink", false),
    st("Selected", "card", <CardQuickLink icon="fa-solid fa-chart-line" label="Links" selected />, ".cds-quicklink", false),
    st("Disabled", "card", <CardQuickLink icon="fa-solid fa-chart-line" label="Links" disabled />, ".cds-quicklink", false),
  ],
  pagination: [
    st("Page — current", "button", <Pagination page={3} pageCount={8} onChange={() => {}} />, ".cds-page-btn[aria-current='page']", false),
    st("Page — other", "button", <Pagination page={3} pageCount={8} onChange={() => {}} />, ".cds-page-btn:nth-child(2)", false),
    st("Previous / next", "button", <Pagination page={3} pageCount={8} onChange={() => {}} />, ".cds-page-btn:first-child", false),
  ],
  calendar: [
    st("Active", "calendar", <Calendar selected={new Date(2026, 8, 15)} onSelect={() => {}} onClear={() => {}} />, ".cds-calendar", false),
    st("Disabled", "calendar", <Calendar disabled selected={new Date(2026, 8, 15)} onSelect={() => {}} />, ".cds-calendar", false),
    st("Day — selected", "day cell", <Calendar selected={new Date(2026, 8, 15)} onSelect={() => {}} onClear={() => {}} />, ".cds-calendar-day[aria-pressed='true']", false),
  ],
  "data-table": [
    st("Row — comfortable", "density comfortable", <Table columns={[{ key: "a", header: "Date" }]} rows={[{ id: 1, a: "Mar 14, 2026" }]} />, "tbody tr"),
    st("Row — compact", "density compact", <Table density="compact" columns={[{ key: "a", header: "Date" }]} rows={[{ id: 1, a: "Mar 14, 2026" }]} />, "tbody tr"),
    st("Header row", "thead", <Table columns={[{ key: "a", header: "Date" }]} rows={[{ id: 1, a: "Mar 14, 2026" }]} />, "thead tr"),
  ],
  avatar: [
    st("Photo", "md", <Avatar name="Jordan Lee" src="/avatars/avatar-1.jpg" />, undefined, false),
    st("Initials", "md", <Avatar name="Jordan Lee" />, undefined, false),
  ],
  "app-header": [
    st("Account menu — closed", "trigger", <AccountMenu account={{ name: "Ava Sullivan", email: "ava.sullivan@email.com", items: [] }} />, ".cds-account-trigger", false),
    st("Account menu — open", "dropdown", <div style={{ position: "relative", height: 240 }}><div style={{ position: "absolute", left: 240 }}><AccountMenu staticOpen account={{ name: "Ava Sullivan", email: "ava.sullivan@email.com", items: [{ label: "Change Password", icon: edit }, { label: "Log out", icon: edit, tone: "danger" }] }} /></div></div>, ".cds-account-dropdown", false),
  ],
  spinner: [st("Default", "icon-md", <Spinner />, undefined, false)],
  badge: [
    st("Label only", "md", <Badge tone="primary">Active</Badge>, undefined, false),
    st("With dot", "md · status dot", <Badge tone="success" dot>Approved</Badge>, undefined, false),
    st("Removable", "md · remove button", <Badge tone="primary" onRemove={() => {}}>Filter</Badge>, undefined, false),
  ],
  separator: [
    st("Horizontal", "1px line", <Separator />, ".cds-separator"),
    st("Vertical", "1px line in a 40px row", <div style={{ display: "flex", height: 40 }}><Separator orientation="vertical" /></div>, ".cds-separator", false),
  ],
  modal: [
    st("Title + body + actions", "480px max", <div className="cds-modal" style={{ position: "static" }}><h2 className="cds-modal-title">Update beneficiary</h2><div className="cds-modal-body">This will replace your current primary beneficiary on file.</div><div className="cds-modal-actions"><Button variant="secondary" size="sm">Cancel</Button><Button size="sm">Save</Button></div></div>, ".cds-modal"),
    st("Title + body", "no actions", <div className="cds-modal" style={{ position: "static" }}><h2 className="cds-modal-title">Update beneficiary</h2><div className="cds-modal-body">This will replace your current primary beneficiary on file.</div></div>, ".cds-modal"),
  ],
  slideover: [
    st("Default width", "360px", <div className="cds-drawer cds-drawer--from-right cds-drawer--visible" style={{ position: "static", transform: "none", height: "auto", minHeight: 0 }}><div className="cds-drawer-header"><h2 className="cds-modal-title" style={{ margin: 0 }}>Add Allocation</h2></div><div className="cds-drawer-body">Form fields</div></div>, ".cds-drawer", false),
    st("Wide", "520px", <div className="cds-drawer cds-drawer--from-right cds-drawer--visible" style={{ position: "static", transform: "none", width: 520, height: "auto", minHeight: 0 }}><div className="cds-drawer-header"><h2 className="cds-modal-title" style={{ margin: 0 }}>Add Allocation</h2></div><div className="cds-drawer-body">Form fields</div></div>, ".cds-drawer", false),
    st("Header", "title + actions", <div className="cds-drawer cds-drawer--from-right cds-drawer--visible" style={{ position: "static", transform: "none", width: 520, height: "auto", minHeight: 0 }}><div className="cds-drawer-header"><h2 className="cds-modal-title" style={{ margin: 0 }}>Add Allocation</h2><div className="cds-drawer-header-actions"><Button variant="secondary" size="sm">Cancel</Button><Button size="sm">Save</Button></div></div></div>, ".cds-drawer-header", false),
  ],
  tooltip: [
    st("Trigger", "icon button sm", <IconButton size="sm" shape="circle" variant="tertiary" aria-label="Info"><Icon name="fa-solid fa-circle-info" size="sm" /></IconButton>, undefined, false),
    st("Bubble — short text", "shown on hover / focus", <span style={{ position: "relative", display: "block" }}><span className="cds-tooltip" role="tooltip" style={{ position: "static", display: "inline-block", transform: "none" }}>Vested balance</span></span>, ".cds-tooltip", false),
    st("Bubble — long text", "one line — truncates at 240px max width", <span style={{ position: "relative", display: "block" }}><span className="cds-tooltip" role="tooltip" style={{ position: "static", display: "inline-block", transform: "none" }}>20% is the IRS-mandated minimum for most retirement plan distributions.</span></span>, ".cds-tooltip", false),
  ],
  "line-chart": [
    st("With description", "title + plot + text", <LineChartCard title="Balance" description="Account balance has tracked closely with contributions." data={[{ m: "Mar", v: 1 }, { m: "Apr", v: 2 }]} xKey="m" series={[{ key: "v", label: "Balance" }]} />, ".cds-chart"),
    st("Without description", "title + plot", <LineChartCard title="Balance" data={[{ m: "Mar", v: 1 }, { m: "Apr", v: 2 }]} xKey="m" series={[{ key: "v", label: "Balance" }]} />, ".cds-chart"),
  ],
};
STATES.table = STATES["data-table"];

const navItems = [
  { label: "Dashboard", icon: <Icon name="fa-solid fa-grip" size="lg" /> },
  { label: "Portfolio", icon: <Icon name="fa-solid fa-wallet" size="lg" /> },
  { label: "Transactions", icon: <Icon name="fa-solid fa-right-left" size="lg" /> },
];
/** What to measure at mobile / tablet / desktop widths for each component. */
const RESPONSIVE_TARGET: Record<string, { node: React.ReactNode; sel?: string }> = {
  "app-header": { node: <AppHeaderDemo />, sel: ".cds-app-header" },
  "app-footer": { node: <AppFooterDemo />, sel: ".cds-app-footer" },
  sidebar: { node: <AppSidebar aria-label="Sidebar" items={navItems} />, sel: ".cds-app-sidebar" },
  stepper: { node: <Stepper currentIndex={1} steps={[{ label: "Personal" }, { label: "Investments" }, { label: "Beneficiaries" }, { label: "Review" }]} />, sel: ".cds-stepper" },
  "data-table": { node: <Table columns={[{ key: "d", header: "Date" }, { key: "t", header: "Type" }, { key: "a", header: "Amount", align: "right" }]} rows={[{ id: 1, d: "Mar 14, 2026", t: "Contribution", a: "$450.00" }, { id: 2, d: "Feb 28, 2026", t: "Employer match", a: "$225.00" }, { id: 3, d: "Feb 14, 2026", t: "Contribution", a: "$450.00" }]} />, sel: ".cds-table" },
  skeleton: { node: <SkeletonCard />, sel: "[data-a=card]" },
  pagination: { node: <Pagination page={3} pageCount={8} onChange={() => {}} />, sel: ".cds-pagination" },
  tabs: { node: <Tabs items={[{ id: "o", label: "Overview", content: null }, { id: "t", label: "Transactions", content: null }, { id: "d", label: "Documents", content: null }]} />, sel: ".cds-tabs" },
  slideover: { node: <div className="cds-drawer cds-drawer--from-right cds-drawer--visible" style={{ position: "static", transform: "none", width: 520, height: "auto", minHeight: 0 }}><div className="cds-drawer-header"><h2 className="cds-modal-title" style={{ margin: 0 }}>Add Allocation</h2></div><div className="cds-drawer-body">Form fields</div></div>, sel: ".cds-drawer" },
};
STATES["date-picker"] = STATES.input;
STATES.combobox = STATES.input;
for (const [k, v] of Object.entries(STATES)) if (SIZING[k]) SIZING[k].states = v;

RESPONSIVE_TARGET.table = RESPONSIVE_TARGET["data-table"];

const BREAKPOINTS = [
  { key: "mobile", label: "Mobile < 576px", width: 375 },
  { key: "tablet", label: "Tablet 576–991px", width: 768 },
  { key: "desktop", label: "Desktop ≥ 992px", width: 1280 },
] as const;

/** Renders `node` inside a hidden iframe of the given viewport width (with the
 *  site's stylesheets copied in) and reports the target's rendered size. */
function FrameMeasure({ width, node, sel, stretch, onSize }: { width: number; node: React.ReactNode; sel?: string; stretch: boolean; onSize: (v: string) => void }) {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const [body, setBody] = useState<HTMLElement | null>(null);

  useLayoutEffect(() => {
    const doc = frameRef.current?.contentDocument;
    if (!doc) return;
    doc.open();
    doc.write("<!doctype html><html><head></head><body></body></html>");
    doc.close();
    for (const a of [...document.documentElement.attributes]) doc.documentElement.setAttribute(a.name, a.value);
    doc.documentElement.setAttribute("data-theme", "core");
    doc.documentElement.setAttribute("data-mode", "light");
    document.querySelectorAll('link[rel="stylesheet"], style').forEach((n) => doc.head.appendChild(n.cloneNode(true)));
    doc.body.style.margin = "0";
    doc.body.style.padding = "16px";
    setBody(doc.body);
  }, []);

  useEffect(() => {
    if (!body) return;
    const measure = () => {
      const host = body.firstElementChild as HTMLElement | null;
      const el = (sel ? body.querySelector(sel) : host?.firstElementChild) as HTMLElement | null;
      if (!el) return onSize("—");
      if (getComputedStyle(el).display === "none") return onSize("hidden");
      const r = el.getBoundingClientRect();
      if (el.scrollWidth > el.clientWidth + 1) {
        const scrolls = /auto|scroll/.test(getComputedStyle(el).overflowX);
        return onSize(`${el.scrollWidth} × ${Math.round(r.height)}px — ${scrolls ? "scrolls inside" : "overflows"} ${el.clientWidth}px`);
      }
      onSize(`${Math.round(r.width)} × ${Math.round(r.height)}px`);
    };
    const timers = [250, 800, 1600].map((ms) => window.setTimeout(measure, ms));
    return () => timers.forEach(window.clearTimeout);
  }, [body, sel, onSize]);

  return (
    <>
      <iframe ref={frameRef} aria-hidden="true" tabIndex={-1} title="" style={{ position: "absolute", left: -20000, top: 0, width, height: 900, border: 0, visibility: "hidden", pointerEvents: "none" }} />
      {body && createPortal(<div data-theme="core" data-mode="light" style={{ display: "flex", flexDirection: "column", alignItems: stretch ? "stretch" : "flex-start" }}>{node}</div>, body)}
    </>
  );
}

const th: React.CSSProperties = { padding: "var(--core-space-2) var(--core-space-4)", fontWeight: 700 };
const td: React.CSSProperties = { padding: "var(--core-space-2) var(--core-space-4)", borderTop: "1px solid var(--core-color-border-subtle)", fontSize: 13, verticalAlign: "top" };
const head: React.CSSProperties = { textAlign: "left", color: "var(--core-color-text-tertiary)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em", background: "var(--core-color-surface-subtle, rgba(0,0,0,0.03))" };

function MeasuredRows({ title, rows, first }: { title: string; rows: Variant[]; first: string }) {
  const measureRef = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState<string[]>([]);

  useLayoutEffect(() => {
    const measure = () => {
      const root = measureRef.current;
      if (!root) return;
      setDims(
        [...root.children].map((cell, i) => {
          const v = rows[i];
          const el = (v.sel ? cell.querySelector(v.sel) : cell.firstElementChild) as HTMLElement | null;
          if (!el) return "—";
          const r = el.getBoundingClientRect();
          return `${Math.round(r.width)} × ${Math.round(r.height)}px`;
        }),
      );
    };
    measure();
    const t = window.setTimeout(measure, 300);
    return () => window.clearTimeout(t);
  }, [rows]);

  return (
    <div>
      <SectionHeading>{title}</SectionHeading>
      <div ref={measureRef} aria-hidden="true" style={{ position: "absolute", left: -10000, top: 0, visibility: "hidden", pointerEvents: "none" }}>
        {rows.map((v) => (
          <div key={v.name} style={{ width: v.fillWidth ? 320 : "max-content", display: "flex", flexDirection: "column", alignItems: v.fillWidth ? "stretch" : "flex-start" }}>
            {v.node}
          </div>
        ))}
      </div>
      <SpecTableCard>
        <thead>
          <tr style={head}>
            <th style={th}>{first}</th>
            <th style={th}>W × H</th>
            <th style={th}>Token / detail</th>
            <th style={th}>Width</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((v, i) => (
            <tr key={v.name}>
              <td style={{ ...td, fontWeight: 600, color: "var(--core-color-text-primary)", whiteSpace: "nowrap", textTransform: "capitalize" }}>{v.name}</td>
              <td style={{ ...td, fontFamily: "var(--typography-font-family-mono, monospace)", whiteSpace: "nowrap" }}>{dims[i] ?? "…"}</td>
              <td style={{ ...td, fontFamily: "var(--typography-font-family-mono, monospace)", fontSize: 12, color: "var(--core-color-text-tertiary)" }}>{v.token}</td>
              <td style={td}>{v.fillWidth ? "Stretches to container (value at 320px)" : "Fixed / sized by content"}</td>
            </tr>
          ))}
        </tbody>
      </SpecTableCard>
    </div>
  );
}

function SizingTables({ sizing, compKey }: { sizing: Sizing; compKey: string }) {
  const target = RESPONSIVE_TARGET[compKey] ? { ...RESPONSIVE_TARGET[compKey], stretch: true } : (() => {
    const first = sizing.states?.[0] ?? sizing.variants?.find((v) => v.name === "md") ?? sizing.variants?.[0];
    return first ? { node: first.node, sel: first.sel, stretch: !!first.fillWidth } : null;
  })();
  const [bpSize, setBpSize] = useState<Record<string, string>>({});
  const setters = useRef(Object.fromEntries(BREAKPOINTS.map((b) => [b.key, (v: string) => setBpSize((m) => (m[b.key] === v ? m : { ...m, [b.key]: v }))]))).current;

  const r = sizing.responsive;
  return (
    <>
      {sizing.variants ? (
        <MeasuredRows title="Sizes" rows={sizing.variants} first="Size" />
      ) : (
        <div>
          <SectionHeading>Sizes</SectionHeading>
          <SpecNote>Single size — the width × height values in the diagram, layer table and spec table above apply everywhere.</SpecNote>
        </div>
      )}
      {sizing.states ? (
        <MeasuredRows title="States — size per state" rows={sizing.states} first="State" />
      ) : (
        <div>
          <SectionHeading>States — size per state</SectionHeading>
          <SpecNote>Size does not change between states for this component; only color, border and focus ring change.</SpecNote>
        </div>
      )}

      <div>
        <SectionHeading>Responsive behaviour</SectionHeading>
        <SpecTableCard>
          <thead>
            <tr style={head}>
              <th style={th}>Breakpoint</th>
              <th style={th}>W × H</th>
              <th style={th}>Behaviour</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ ...td, fontWeight: 600, whiteSpace: "nowrap" }}>Mobile &lt; 576px</td>
              <td style={{ ...td, fontFamily: "var(--typography-font-family-mono, monospace)", whiteSpace: "nowrap" }}>{target ? bpSize.mobile ?? "…" : "—"}</td>
              <td style={td}>{r.mobile}</td>
            </tr>
            <tr>
              <td style={{ ...td, fontWeight: 600, whiteSpace: "nowrap" }}>Tablet 576–991px</td>
              <td style={{ ...td, fontFamily: "var(--typography-font-family-mono, monospace)", whiteSpace: "nowrap" }}>{target ? bpSize.tablet ?? "…" : "—"}</td>
              <td style={td}>{r.tablet}</td>
            </tr>
            <tr>
              <td style={{ ...td, fontWeight: 600, whiteSpace: "nowrap" }}>Desktop ≥ 992px</td>
              <td style={{ ...td, fontFamily: "var(--typography-font-family-mono, monospace)", whiteSpace: "nowrap" }}>{target ? bpSize.desktop ?? "…" : "—"}</td>
              <td style={td}>{r.desktop}</td>
            </tr>
            {r.motion && (
              <tr>
                <td style={{ ...td, fontWeight: 600, whiteSpace: "nowrap" }}>Reduced motion</td>
                <td style={td}>—</td>
                <td style={td}>{r.motion}</td>
              </tr>
            )}
          </tbody>
        </SpecTableCard>
        <SpecNote>W × H measured in real 375 / 768 / 1280px viewports with a 16px page gutter, so breakpoint rules apply.</SpecNote>
        {target && BREAKPOINTS.map((b) => <FrameMeasure key={b.key} width={b.width} node={target.node} sel={target.sel} stretch={target.stretch} onSize={setters[b.key]} />)}
      </div>
    </>
  );
}

/** Finds the component this anatomy belongs to (nearest ancestor id with a
 *  sizing entry) and renders its sizes + responsive tables. */
export function AutoSizing() {
  const ref = useRef<HTMLDivElement>(null);
  const [key, setKey] = useState<string | null>(null);

  useLayoutEffect(() => {
    let el: HTMLElement | null = ref.current;
    while (el) {
      if (el.id && SIZING[el.id]) {
        setKey(el.id);
        return;
      }
      el = el.parentElement;
    }
  }, []);

  return (
    <div ref={ref} style={{ display: "flex", flexDirection: "column", gap: 40, marginTop: key ? 40 : 0, position: "relative" }}>
      {key && <SizingTables sizing={SIZING[key]} compKey={key} />}
    </div>
  );
}
