import React, { useCallback, useLayoutEffect, useRef, useState } from "react";
import { AppShell, AppHeader } from "../../../../packages/core/src/components/Layout";
import { AppSidebar, Stepper, Tabs } from "../../../../packages/core/src/components/Navigation";
import { Button } from "../../../../packages/core/src/components/Button";
import { Card, Badge } from "../../../../packages/core/src/components/Misc";
import { DataTable } from "../../../../packages/core/src/components/DataDisplay";
import { AppFooter } from "../../../../packages/core/src/components/Layout";
import { CardQuickLink } from "../QuickLinkCard";
import { usePreviewMode } from "../PreviewModeContext";
import { ScreenSpec } from "../ScreenSpec";
import { Field, Input } from "../../../../packages/core/src/components/Field";
import { Select, Checkbox, Radio } from "../../../../packages/core/src/components/FormControls";
import { Icon } from "../../../../packages/core/src/components/Primitives";
import { LineChartCard } from "../../../../packages/core/src/components/Chart";
import typography from "../../../../packages/tokens/src/typography.json";
import { Preview } from "../Preview";
import { AnatomySection } from "../AnatomySection";
import { BrandLogo, headerAccount, headerUtilities } from "../SectionAnatomies";
import { SectionHeading, SpecTableCard } from "../AnatomySpec";
import { ScreenTypeMap, Txt, readTypedText, styleLabel, typeOrder, typeGroup, TYPE_GROUP_COLOR } from "../ScreenTypeMap";
import { usageFor } from "./typographyUsage";

/** Screen reference — four participant-portal screens rebuilt from the
 *  design system to match participantportal-core.netlify.app. Every piece of
 *  text is set with <Txt t="…">, so the docs report the intended style. */

const WIDTH = 1440;

const NAV = [
  { key: "dashboard", label: "Dashboard", icon: "fa-solid fa-grip" },
  { key: "portfolio", label: "Investment portfolio", icon: "fa-solid fa-wallet" },
  { key: "transactions", label: "Transactions", icon: "fa-solid fa-right-left" },
  { key: "profile", label: "My profile", icon: "fa-solid fa-user" },
  { key: "documents", label: "Document Center", icon: "fa-solid fa-file-lines" },
];

function PortalShell({ current, children }: { current: string; children: React.ReactNode }) {
  return (
    <AppShell
      header={<AppHeader brand={<BrandLogo />} utilities={headerUtilities} account={headerAccount} />}
      sidebar={<AppSidebar variant="rail" items={NAV.map((n) => ({ label: n.label, icon: <Icon name={n.icon} size="lg" />, current: n.key === current }))} />}
      footer={<AppFooter copyright="© 2026 LendGuard." links={<><a href="#">Privacy</a><a href="#">Terms</a></>} />}
    >
      {children}
    </AppShell>
  );
}

const MUTED: React.CSSProperties = { color: "var(--core-color-text-secondary)" };
const BLUE = "var(--brand-text-primary-default)";
const GREEN = "var(--core-color-status-success-text)";
const AMBER = "var(--core-color-status-warning-text)";
const RED = "var(--theme-semantics-critical-text)";
const MONO: React.CSSProperties = { fontFamily: "var(--typography-font-family-mono)", fontVariantNumeric: "tabular-nums" };

/* ---------------- Dashboard ---------------- */

interface Txn { id: string; date: string; type: string; plan: string; amount: string }
const TXNS: Txn[] = [
  { id: "1", date: "Feb 28, 2026", type: "My Deferral", plan: "LendGuard Employees Savings and Retirement 401(k) Plan", amount: "$312.00" },
  { id: "2", date: "Feb 28, 2026", type: "Employer Contribution", plan: "LendGuard Employees Savings and Retirement 401(k) Plan", amount: "$208.00" },
  { id: "3", date: "Feb 14, 2026", type: "My Deferral", plan: "LendGuard Employees Savings and Retirement 401(k) Plan", amount: "$312.00" },
  { id: "4", date: "Feb 14, 2026", type: "Employer Contribution", plan: "LendGuard Employees Savings and Retirement 401(k) Plan", amount: "$208.00" },
  { id: "5", date: "Jan 31, 2026", type: "Employer Contribution", plan: "LendGuard Profit Sharing", amount: "$450.00" },
];

function Note({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", gap: "var(--core-space-2)", alignItems: "center", ...MUTED }}>
      <Icon name="fa-solid fa-circle-info" size="sm" />
      <Txt t="text12Regular" style={MUTED}>{children}</Txt>
    </div>
  );
}

function Callout({ tone, children }: { tone: "success" | "info" | "neutral"; children: React.ReactNode }) {
  const bg = tone === "success" ? "var(--theme-semantics-success-light-background)" : tone === "info" ? "var(--theme-semantics-highlight-light-background)" : "var(--core-color-surface-default)";
  return (
    <div data-spec="Plan message" style={{ padding: "var(--core-space-3) var(--core-space-4)", borderRadius: "var(--core-radius-sm)", background: bg, border: tone === "neutral" ? "1px solid var(--core-color-border-subtle)" : undefined }}>
      {children}
    </div>
  );
}

function PlanCard({ title, type, id, badge, tone, disabled, children }: { title: string; type: string; id: string; badge: string; tone: "success" | "info" | "neutral"; disabled?: boolean; children: React.ReactNode }) {
  return (
    <Card style={disabled ? { background: "var(--core-color-surface-sunken)" } : undefined}>
      <div data-spec="Plan card content" style={{ display: "flex", flexDirection: "column", gap: "var(--core-space-4)", opacity: disabled ? 0.7 : 1 }}>
        <div data-spec="Plan header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "var(--core-space-4)" }}>
          <div data-spec="Plan title group" style={{ display: "flex", flexDirection: "column", gap: "var(--core-space-1)" }}>
            <Txt as="h3" t="h4">{title}</Txt>
            <Txt t="text12SemiBold" style={{ color: disabled ? "var(--core-color-text-secondary)" : BLUE }}>{type}</Txt>
            <Txt t="text12Regular" style={MUTED}>Plan ID {id}</Txt>
          </div>
          <Badge tone={tone === "success" ? "success" : tone === "info" ? "info" : "neutral"} size="sm">{badge}</Badge>
        </div>
        {children}
      </div>
    </Card>
  );
}

function DashboardScreen() {
  return (
    <PortalShell current="dashboard">
      <div data-s="page" data-spec="Page grid" style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "var(--core-space-6)", alignItems: "start" }}>
        <div data-s="left" data-spec="Main column" style={{ display: "flex", flexDirection: "column", gap: "var(--core-space-6)" }}>
          <Txt as="h1" t="h1" data-s="h1">Hi Jordan 👋</Txt>
          <Card>
            <div data-spec="Balance summary" style={{ display: "flex", flexDirection: "column", gap: "var(--core-space-4)" }}>
              <div data-spec="Balances row" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "var(--core-space-4)" }}>
                <div data-spec="Balances" style={{ display: "flex", gap: "var(--core-space-8)" }}>
                  <div data-spec="Account balance" style={{ display: "flex", flexDirection: "column", gap: "var(--core-space-1)" }}>
                    <Txt t="text14Regular" style={MUTED}>Account balance</Txt>
                    <Txt t="text28Bold" style={{ ...MONO, color: BLUE }}>$14,590.00</Txt>
                  </div>
                  <div data-spec="Vested balance" style={{ display: "flex", flexDirection: "column", gap: "var(--core-space-1)" }}>
                    <Txt t="text14Regular" style={MUTED}>Vested balance</Txt>
                    <Txt t="text28Bold" style={{ ...MONO, color: GREEN }}>$13,870.00</Txt>
                  </div>
                </div>
                <Button variant="secondary" size="sm">View summary</Button>
              </div>
              <div data-spec="Loan balance" style={{ display: "flex", flexDirection: "column", gap: "var(--core-space-2)", borderTop: "1px solid var(--core-color-border-subtle)", paddingTop: "var(--core-space-4)" }}>
                <div><Txt t="text14Bold">Outstanding loan balance </Txt><Txt t="numericData" style={{ color: AMBER }}>$2,500.00</Txt></div>
                <Note>This loan balance is tracked separately and is not reflected in the account balances shown above.</Note>
              </div>
              <div data-spec="Cash balance benefit" style={{ display: "flex", flexDirection: "column", gap: "var(--core-space-2)", borderTop: "1px solid var(--core-color-border-subtle)", paddingTop: "var(--core-space-4)" }}>
                <div><Txt t="text14Bold">Cash balance benefit </Txt><Txt t="numericData" style={{ color: AMBER }}>$18,400.00</Txt></div>
                <Note>This is a notional value, tracked separately, and is removed from the account balances shown above.</Note>
              </div>
            </div>
          </Card>
          <Txt as="h2" t="h2" data-s="h2">My plans</Txt>
          <div data-spec="Plan grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--core-space-4)" }}>
            <PlanCard title="LendGuard Employees Savings and Retirement 401(k) Plan" type="401(k)" id="124542" badge="Participating" tone="success">
              <Callout tone="success"><Txt t="text14Regular">Congratulations! You have been enrolled in this plan based on plan's auto enrollment provisions. </Txt><Txt as="a" t="text14Bold" href="#">View details</Txt></Callout>
              <div data-s="subcards" data-spec="Balance tiles" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--core-space-4)" }}>
                <div data-spec="Balance tile" style={{ display: "flex", flexDirection: "column", gap: "var(--core-space-1)", padding: "var(--core-space-3)", borderRadius: "var(--core-radius-sm)", background: "var(--core-color-surface-sunken)" }}><Txt t="text12Regular" style={MUTED}>Account balance</Txt><Txt t="numericData" style={{ color: BLUE }}>$12,840.00</Txt></div>
                <div data-spec="Balance tile" style={{ display: "flex", flexDirection: "column", gap: "var(--core-space-1)", padding: "var(--core-space-3)", borderRadius: "var(--core-radius-sm)", background: "var(--core-color-surface-sunken)" }}><Txt t="text12Regular" style={MUTED}>Vested balance</Txt><Txt t="numericData" style={{ color: GREEN }}>$9,620.00</Txt></div>
              </div>
            </PlanCard>
            <PlanCard title="LendGuard Roth 401(k) Plan" type="401(k) — Roth" id="124675" badge="Eligible" tone="info">
              <Callout tone="info"><Txt t="text14Regular">Congratulations! You are eligible to participate in this plan. </Txt><Txt as="a" t="text14Bold" href="#">Enroll here</Txt></Callout>
            </PlanCard>
            <PlanCard title="LendGuard Deferred Comp Plan" type="Nonqualified Deferred Compensation" id="125100" badge="Not Eligible" tone="neutral" disabled>
              <Callout tone="neutral"><Txt t="text14Regular">You are currently not eligible for this plan since you have not met the age/ service requirement. </Txt><Txt as="a" t="text14Bold" href="#">Provide elections in advance</Txt></Callout>
            </PlanCard>
            <PlanCard title="LendGuard Cash Balance Plan" type="Cash Balance" id="125218" badge="Participating" tone="success">
              <Callout tone="info"><Txt t="text14Regular">Cash balance benefit is </Txt><Txt t="numericData">$18,400.00</Txt><Txt t="text14Regular">. This is a notional value, tracked separately, and is removed from the account balances shown above.</Txt></Callout>
            </PlanCard>
          </div>
          <Txt as="h2" t="h2">Quick links</Txt>
          <div data-spec="Quick links" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "var(--core-space-4)" }}>
            {[["fa-solid fa-users", "Add beneficiary"], ["fa-solid fa-file-lines", "My documents"], ["fa-solid fa-chart-line", "My portfolio"], ["fa-solid fa-file-invoice", "Generate statement"]].map(([icon, label]) => (
              <CardQuickLink key={label} icon={icon} label={label} />
            ))}
          </div>
          <Txt as="h2" t="h2">Recent Transactions</Txt>
          <div className="screen-ref-table">
            <DataTable<Txn>
              columns={[
                { key: "date", header: "Date", sortable: true },
                { key: "type", header: "Type", sortable: true },
                { key: "plan", header: "Plan", sortable: true },
                { key: "amount", header: "Amount", sortable: true, align: "right" },
              ]}
              rows={TXNS}
              pageSize={5}
            />
          </div>
        </div>
        <div data-spec="Side column" style={{ display: "flex", flexDirection: "column", gap: "var(--core-space-4)" }}>
          <Card>
            <div data-s="readiness" data-spec="Retirement readiness" style={{ display: "flex", flexDirection: "column", gap: "var(--core-space-4)" }}>
              <div data-spec="Readiness banner" style={{ padding: "var(--core-space-4)", background: "var(--brand-background-primary-strong)", color: "var(--brand-text-primary-oncolor)", borderRadius: "var(--core-radius-sm)", display: "flex", flexDirection: "column", gap: "var(--core-space-1)" }}>
                <Txt t="text12SemiBold">Retirement Readiness</Txt>
                <Txt as="h3" t="h5">See how your inputs affect your savings, income, risk.</Txt>
              </div>
              <Txt as="p" t="text12Regular" style={MUTED}>This estimates how much of your retirement spending is covered by your savings, using your deferrals, age, and location.</Txt>
              <div><Button size="sm">Get started</Button></div>
              <div style={{ borderTop: "1px solid var(--core-color-border-subtle)", paddingTop: "var(--core-space-3)", display: "flex", gap: "var(--core-space-2)", alignItems: "center", ...MUTED }}>
                <Icon name="fa-solid fa-circle-info" size="sm" />
                <Txt t="text12Regular" style={MUTED}>Not guaranteed results. </Txt>
                <Txt as="a" t="text12SemiBold" href="#">Disclaimer</Txt>
              </div>
            </div>
          </Card>
          <Card>
            <div data-spec="Enrich" style={{ display: "flex", flexDirection: "column", gap: "var(--core-space-3)", alignItems: "flex-start" }}>
              <Badge tone="warning" size="sm">Enrich</Badge>
              <Txt as="p" t="text12Regular" style={MUTED}>Learn how saving, spending, investing, and retirement planning can work together to support your financial goals.</Txt>
              <Txt as="a" t="text12SemiBold" href="#">Know More</Txt>
            </div>
          </Card>
        </div>
      </div>
    </PortalShell>
  );
}

/* ---------------- Investment portfolio ---------------- */

const PERF = ["Aug", "Oct", "Dec", "Feb", "Apr", "Jun", "Aug"].map((m, i) => ({ month: m, total: +(i * 2).toFixed(1), equity: +(i * 1.7).toFixed(1), commodities: +(i * 0.8).toFixed(1) }));

function PortfolioScreen() {
  const [range, setRange] = useState("1Y");
  return (
    <PortalShell current="portfolio">
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--core-space-6)" }}>
        <div data-s="title" data-spec="Title row" style={{ display: "flex", alignItems: "flex-end", gap: "var(--core-space-4)" }}>
          <Txt as="h1" t="h1" data-s="h1">Investment portfolio</Txt>
          <div style={{ width: 260 }}>
            <Field label="Plan">{(p) => <Select {...p} options={[{ value: "p", label: "LendGuard Employees Savings and Retirement" }]} />}</Field>
          </div>
        </div>
        <Tabs items={[{ id: "mine", label: "My portfolio" }, { id: "plan", label: "Plan investments" }]} />
        <div data-s="page" data-spec="Page grid" style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: "var(--core-space-6)" }}>
          <Card>
            <div data-s="stats" data-spec="Stats list" style={{ display: "flex", flexDirection: "column", gap: "var(--core-space-3)" }}>
              {[["Current balance", "$100,416.00", "var(--core-color-text-primary)"], ["Invested balance", "$90,500.00", "var(--core-color-text-primary)"], ["Gain / loss", "+$9,916.00", GREEN], ["YTD return", "8.00%", GREEN]].map(([k, v, c]) => (
                <Card key={k} variant="outlined">
                  <Txt as="div" t="text12Regular" style={MUTED}>{k}</Txt>
                  <Txt as="div" t="text20Bold" style={{ ...MONO, color: c }}>{v}</Txt>
                </Card>
              ))}
            </div>
          </Card>
          <Card>
            <div data-s="chart" data-spec="Chart panel" style={{ display: "flex", flexDirection: "column", gap: "var(--core-space-4)" }}>
              <Txt as="h2" t="h4">Asset class performance</Txt>
              <div data-s="ranges" data-spec="Range selector" style={{ display: "flex", gap: "var(--core-space-1)", padding: "var(--core-space-1)", borderRadius: "var(--core-radius-sm)", background: "var(--core-color-surface-sunken)" }}>
                {["1M", "3M", "6M", "YTD", "1Y", "3Y", "5Y", "10Y"].map((r) => (
                  <Button key={r} size="sm" variant={r === range ? "primary" : "tertiary"} onClick={() => setRange(r)}>{r}</Button>
                ))}
              </div>
              <LineChartCard title="Rate of return (%)" data={PERF} xKey="month" height={220} series={[{ key: "total", label: "Total portfolio" }, { key: "equity", label: "U.S. Equity" }, { key: "commodities", label: "Commodities" }]} />
              <div data-s="legend" data-spec="Legend" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "var(--core-space-3)", borderTop: "1px solid var(--core-color-border-subtle)", paddingTop: "var(--core-space-4)" }}>
                {["Total portfolio", "U.S. Equity", "Sector Equity", "Allocation", "International Equity", "Alternative", "Commodities", "Taxable Bond", "Money Market"].map((l, i) => (
                  <Checkbox key={l} label={l} defaultChecked={[0, 1, 6, 8].includes(i)} size="sm" />
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </PortalShell>
  );
}

/* ---------------- Documents ---------------- */

function DocumentsScreen() {
  return (
    <PortalShell current="documents">
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--core-space-6)" }}>
        <div data-s="title" data-spec="Title row" style={{ display: "flex", flexDirection: "column", gap: "var(--core-space-2)" }}>
          <Txt as="h1" t="h1" data-s="h1">Documents</Txt>
          <Txt as="p" t="text14Regular" style={MUTED}>Access, download, and generate important plan documents and disclosures</Txt>
        </div>
        <Card>
          <div data-s="filters" data-spec="Filter grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "var(--core-space-4)", alignItems: "end" }}>
            <Field label="Search">{(p) => <Input {...p} placeholder="Document name" />}</Field>
            <Field label="Plan Name/ID">{(p) => <Select {...p} options={[{ value: "all", label: "All" }]} />}</Field>
            <Field label="Document Type">{(p) => <Select {...p} options={[{ value: "all", label: "All" }]} />}</Field>
            <Field label="Documented from">{(p) => <Input {...p} defaultValue="Mar 29, 2026" />}</Field>
            <Field label="Documented to">{(p) => <Input {...p} defaultValue="Sep 29, 2026" />}</Field>
            <div data-s="actions" data-spec="Filter actions" style={{ display: "flex", gap: "var(--core-space-4)", alignItems: "center" }}>
              <Button variant="tertiary" size="sm">Reset</Button>
              <Button size="sm">Search</Button>
            </div>
          </div>
          <div data-s="results" data-spec="Results bar" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--core-color-border-subtle)", marginTop: "var(--core-space-6)", paddingTop: "var(--core-space-4)" }}>
            <Txt as="h2" t="h6">00 - Records found</Txt>
            <Button variant="secondary" size="sm">Generate new statement</Button>
          </div>
          <Txt as="p" t="text14Regular" style={{ ...MUTED, textAlign: "center", marginTop: "var(--core-space-6)" }}>No documents match these filters.</Txt>
        </Card>
      </div>
    </PortalShell>
  );
}

/* ---------------- Enrollment flow ---------------- */

function EnrollmentScreen() {
  return (
    <PortalShell current="dashboard">
      <div data-s="page" data-spec="Page grid" style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: "var(--core-space-6)" }}>
        <div data-s="rail" data-spec="Step rail" style={{ display: "flex", flexDirection: "column", gap: "var(--core-space-4)" }}>
          <Txt as="a" t="text14Bold" href="#">‹ Back</Txt>
          <Txt as="h1" t="h1" data-s="h1">Plan enrollment</Txt>
          <Stepper
            orientation="vertical"
            currentIndex={0}
            steps={[
              { label: "Deferral rate", description: "Specify payroll deferral rates and set up auto increase." },
              { label: "Investment election", description: "Choose the investments and its allocation percentages." },
              { label: "Summary", description: "Review the elections before confirming." },
            ]}
          />
        </div>
        <div data-s="form" data-spec="Enrollment form" style={{ display: "flex", flexDirection: "column", gap: "var(--core-space-6)" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--core-space-1)" }}>
            <Txt t="eyebrow" style={MUTED}>Plan details</Txt>
            <Txt as="h2" t="h2">401(k) Company Plan High Returns</Txt>
            <div><Txt t="text14Regular" style={MUTED}>Plan ID </Txt><Txt t="numericData">124542</Txt></div>
          </div>
          <Txt as="h3" t="h4">Set my deferral rate</Txt>
          <Card>
            <div data-s="deferral" data-spec="Deferral by source" style={{ display: "flex", flexDirection: "column", gap: "var(--core-space-4)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "var(--core-space-3)" }}>
                  <Txt t="text14Bold">Deferral by source</Txt>
                  <Button variant="secondary" size="sm">Use plan deferral rate</Button>
                </div>
                <div style={{ display: "flex", gap: "var(--core-space-1)" }}>
                  <Button size="sm">%</Button>
                  <Button size="sm" variant="secondary">$</Button>
                </div>
              </div>
              {[["Pre-Tax", "Pre-tax employee deferrals lower current year taxes. The deferrals and earnings on the deferrals are taxable when withdrawn and not taxable when it is rolled over."], ["Roth", "Roth employee deferrals are taxable in the year contributed, but not when withdrawn. Earnings will not be taxable if certain age and holding period requirements are met."]].map(([k, d]) => (
                <div key={k} style={{ display: "grid", gridTemplateColumns: "1fr 96px", gap: "var(--core-space-4)", alignItems: "center", borderTop: "1px solid var(--core-color-border-subtle)", paddingTop: "var(--core-space-4)" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "var(--core-space-1)" }}>
                    <Txt as="h4" t="h6">{k}</Txt>
                    <Txt t="text12Regular" style={MUTED}>{d}</Txt>
                  </div>
                  <Input defaultValue="0" aria-label={`${k} %`} />
                </div>
              ))}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--core-color-border-subtle)", paddingTop: "var(--core-space-4)" }}>
                <Txt as="a" t="text14Bold" href="#">Reset</Txt>
                <div><Txt t="text14Bold">Total deferral </Txt><Txt t="numericData" style={{ color: BLUE }}>0%</Txt></div>
              </div>
            </div>
          </Card>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--core-space-3)" }}>
            <Txt as="h3" t="h4">Auto increase</Txt>
            <Txt as="p" t="text14Regular" style={MUTED}>Automatically increase the deferral rate over time to grow the retirement savings.</Txt>
            <div data-s="auto" data-spec="Auto increase options" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--core-space-4)" }}>
              <Card variant="outlined"><Radio name="auto" label="Use auto increase" /></Card>
              <Card variant="outlined"><Radio name="auto" label="Don't use auto increase" /></Card>
            </div>
          </div>
        </div>
      </div>
    </PortalShell>
  );
}

/* ---------------- Section ---------------- */

function DarkCanvas({ children }: { children: React.ReactNode }) {
  const { mode } = usePreviewMode();
  return (
    <div data-theme="core" data-mode={mode} style={{ width: WIDTH, background: "var(--core-color-bg-page)", color: "var(--core-color-text-primary)", fontFamily: "var(--typography-font-family-sans)" }}>
      {children}
    </div>
  );
}

function ScreenBlock({ id, title, screen, onScan }: { id: string; title: string; screen: React.ReactNode; onScan: (id: string, typed: Record<string, string[]>) => void }) {
  const demoRef = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    if (demoRef.current) onScan(id, readTypedText(demoRef.current));
  });
  return (
    <div id={`screen-ref-${id}`} style={{ display: "flex", flexDirection: "column", gap: "var(--core-space-4)" }}>
      <h3 style={{ margin: 0, fontSize: "var(--typography-heading-h4-size)" }}>{title}</h3>
      <div className="site-panel site-panel--flush site-panel--demo">
        <AnatomySection
          demo={
            <Preview showModeToggle>
              <div ref={demoRef} style={{ overflowX: "auto" }}><DarkCanvas>{screen}</DarkCanvas></div>
            </Preview>
          }
          anatomy={
            <div style={{ display: "flex", flexDirection: "column", gap: 48 }}>
              <ScreenSpec width={WIDTH} name={`LendGuard — ${title}`} render={() => <DarkCanvas>{screen}</DarkCanvas>} />
              <ScreenTypeMap width={WIDTH}><DarkCanvas>{screen}</DarkCanvas></ScreenTypeMap>
            </div>
          }
        />
      </div>
    </div>
  );
}

const SCREENS = [
  { id: "dashboard", title: "Dashboard" },
  { id: "portfolio", title: "Investment portfolio" },
  { id: "documents", title: "Documents" },
  { id: "enrollment", title: "Enrollment flow" },
];

const TYPO = typography as Record<string, { desktop: { size: string; weight: string; lineHeight: string } }>;

/** One row per text style: when to use it and where each screen uses it. */
function TypeGuide({ usage }: { usage: Record<string, Record<string, string[]>> }) {
  const keys = [...new Set(Object.values(usage).flatMap((u) => Object.keys(u)))].sort((a, b) => typeOrder(a) - typeOrder(b));
  if (!keys.length) return null;
  return (
    <div>
      <SectionHeading>Text styles — when to use each, and where the screens use it</SectionHeading>
      <SpecTableCard>
        <thead>
          <tr style={{ textAlign: "left", color: "var(--core-color-text-tertiary)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em", background: "var(--core-color-surface-subtle, #00000008)" }}>
            <th style={{ padding: "var(--core-space-2) var(--core-space-4)" }}>Style</th>
            <th style={{ padding: "var(--core-space-2) var(--core-space-4)" }}>Use it for</th>
            {SCREENS.map((s) => (
              <th key={s.id} style={{ padding: "var(--core-space-2) var(--core-space-4)" }}>
                <a href="#/screens" onClick={(e) => { e.preventDefault(); document.getElementById(`screen-ref-${s.id}`)?.scrollIntoView({ behavior: "smooth" }); }}>{s.title}</a>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {keys.map((k) => {
            const d = TYPO[k]?.desktop;
            return (
              <tr key={k} style={{ borderTop: "1px solid var(--core-color-border-subtle)", verticalAlign: "top" }}>
                <td style={{ padding: "var(--core-space-3) var(--core-space-4)", whiteSpace: "nowrap" }}>
                  <span style={{ display: "inline-block", padding: "1px 6px", borderRadius: 4, background: TYPE_GROUP_COLOR[typeGroup(k)], color: "#FFFFFF", fontSize: 11, fontWeight: 700 }}>{styleLabel(k)}</span>
                  <div style={{ fontSize: 12, color: "var(--core-color-text-tertiary)", marginTop: "var(--core-space-1)" }}>{d ? `${d.size} / ${d.weight}` : ""}</div>
                </td>
                <td style={{ padding: "var(--core-space-3) var(--core-space-4)", fontSize: 13, color: "var(--core-color-text-primary)", minWidth: 200 }}>{d ? usageFor(k, d).use : ""}</td>
                {SCREENS.map((s) => {
                  const texts = usage[s.id]?.[k] ?? [];
                  return (
                    <td key={s.id} style={{ padding: "var(--core-space-3) var(--core-space-4)", fontSize: 12, color: texts.length ? "var(--core-color-text-secondary)" : "var(--core-color-text-tertiary)", minWidth: 140 }}>
                      {texts.length ? texts.slice(0, 3).map((t, i) => <div key={i}>“{t.length > 36 ? `${t.slice(0, 36)}…` : t}”</div>) : "—"}
                      {texts.length > 3 && <div>+{texts.length - 3} more</div>}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </SpecTableCard>
    </div>
  );
}

export function ScreenReferenceSection() {
  const [usage, setUsage] = useState<Record<string, Record<string, string[]>>>({});
  const onScan = useCallback((id: string, typed: Record<string, string[]>) => {
    setUsage((u) => (JSON.stringify(u[id]) === JSON.stringify(typed) ? u : { ...u, [id]: typed }));
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--core-space-12)" }}>
      <TypeGuide usage={usage} />
      <ScreenBlock
        id="dashboard"
        title="Dashboard"
        onScan={onScan}
        screen={<DashboardScreen />}
      />
      <ScreenBlock
        id="portfolio"
        title="Investment portfolio"
        onScan={onScan}
        screen={<PortfolioScreen />}
      />
      <ScreenBlock
        id="documents"
        title="Documents"
        onScan={onScan}
        screen={<DocumentsScreen />}
      />
      <ScreenBlock
        id="enrollment"
        title="Enrollment flow"
        onScan={onScan}
        screen={<EnrollmentScreen />}
      />
    </div>
  );
}
