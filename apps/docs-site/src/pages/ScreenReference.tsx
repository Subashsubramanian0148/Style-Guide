import React, { useCallback, useLayoutEffect, useRef, useState } from "react";
import { AppShell, AppHeader, AppFooter } from "../../../../packages/core/src/components/Layout";
import { AppSidebar, MobileNav, Stepper, Tabs } from "../../../../packages/core/src/components/Navigation";
import { Button } from "../../../../packages/core/src/components/Button";
import { Card, Badge } from "../../../../packages/core/src/components/Misc";
import { DataTable } from "../../../../packages/core/src/components/DataDisplay";
import { Field, Input, InputWithIcon } from "../../../../packages/core/src/components/Field";
import { Select, Checkbox } from "../../../../packages/core/src/components/FormControls";
import { Icon, CalendarIcon } from "../../../../packages/core/src/components/Primitives";
import { LineChartCard } from "../../../../packages/core/src/components/Chart";
import typography from "../../../../packages/tokens/src/typography.json";
import { CardQuickLink } from "../QuickLinkCard";
import { usePreviewMode } from "../PreviewModeContext";
import { ScreenSpec } from "../ScreenSpec";
import { Preview } from "../Preview";
import { AnatomySection } from "../AnatomySection";
import { BrandLogo, headerAccount, headerUtilities } from "../SectionAnatomies";
import { SectionHeading, SpecTableCard } from "../AnatomySpec";
import { ScreenTypeMap, readTypedText, styleLabel, typeOrder, typeGroup, TYPE_GROUP_COLOR } from "../ScreenTypeMap";
import { usageFor } from "./typographyUsage";
import "./screen-reference.css";

/** Screen reference — the LendGuard participant portal
 *  (participantportal-core.netlify.app, source Satish0024/S_PPT@journey-retirement)
 *  rebuilt with CORE components and tokens. Layout values come from the
 *  portal's own stylesheet, ported in screen-reference.css. `data-type` marks
 *  the intended text style for the typography map. */

const WIDTH = 1440;

const NAV = [
  { key: "dashboard", label: "Dashboard", icon: "fa-solid fa-table-cells-large" },
  { key: "portfolio", label: "Investment portfolio", icon: "fa-solid fa-wallet" },
  { key: "transactions", label: "Transactions", icon: "fa-solid fa-right-left" },
  { key: "profile", label: "My profile", icon: "fa-solid fa-user" },
  { key: "documents", label: "Document Center", icon: "fa-solid fa-file-lines" },
];

/** Text that carries its intended typography style for the docs. */
function T({ as = "span", t, className, children, ...rest }: { as?: keyof JSX.IntrinsicElements; t: string; className?: string; children: React.ReactNode; href?: string } & React.HTMLAttributes<HTMLElement>) {
  const Tag = as as any;
  return <Tag data-type={t} className={className} {...rest}>{children}</Tag>;
}

function PortalShell({ current, footer = true, children }: { current: string; footer?: boolean; children: React.ReactNode }) {
  return (
    <AppShell
      header={<AppHeader brand={<BrandLogo />} utilities={headerUtilities} account={headerAccount} />}
      sidebar={
        <>
          <AppSidebar variant="rail" items={NAV.map((n) => ({ label: n.label, icon: <Icon name={n.icon} size="lg" />, current: n.key === current }))} />
          <div className="sr-nav-brand" aria-hidden="true">
            <img className="sr-light" src="/brand/core/core-logo-light.svg" alt="" />
            <img className="sr-dark" src="/brand/core/core-logo-dark.svg" alt="" />
          </div>
        </>
      }
      footer={footer ? <AppFooter copyright="© 2026 LendGuard." links={<><a href="#">Privacy</a><a href="#">Terms</a></>} /> : undefined}
    >
      {children}
      <div className="sr-mobile-nav">
        <MobileNav
          items={[{ id: "dashboard", label: "Dashboard", icon: "fa-solid fa-table-cells-large" }, { id: "settings", label: "Settings", icon: "fa-solid fa-gear" }]}
          activeId={current === "dashboard" ? "dashboard" : undefined}
          menu={NAV.filter((n) => n.key !== "dashboard").map((n) => ({ id: n.key, label: n.label, icon: n.icon }))}
          activeLinkId={current}
        />
      </div>
    </AppShell>
  );
}

function Note({ children }: { children: React.ReactNode }) {
  return (
    <p className="sr-note">
      <Icon name="fa-solid fa-circle-info" size="sm" />
      <T t="text12Regular">{children}</T>
    </p>
  );
}

/* ---------------- Dashboard ---------------- */

interface Txn { id: string; date: string; type: string; plan: string; amount: string }
const TXNS: Txn[] = [
  { id: "1", date: "Feb 28, 2026", type: "My Deferral", plan: "LendGuard Employees Savings and Retirement 401(k) Plan", amount: "$312.00" },
  { id: "2", date: "Feb 28, 2026", type: "Employer Contribution", plan: "LendGuard Employees Savings and Retirement 401(k) Plan", amount: "$208.00" },
  { id: "3", date: "Feb 14, 2026", type: "My Deferral", plan: "LendGuard Employees Savings and Retirement 401(k) Plan", amount: "$312.00" },
  { id: "4", date: "Feb 14, 2026", type: "Employer Contribution", plan: "LendGuard Employees Savings and Retirement 401(k) Plan", amount: "$208.00" },
  { id: "5", date: "Jan 31, 2026", type: "Employer Contribution", plan: "LendGuard Profit Sharing", amount: "$450.00" },
];

function PlanCard({ title, type, id, badge, tone, ineligible, children }: { title: string; type: string; id: string; badge: string; tone: "success" | "primary" | "neutral"; ineligible?: boolean; children: React.ReactNode }) {
  return (
    <Card className={`sr-plan-card${ineligible ? " sr-ineligible" : ""}`}>
      <div data-spec="Plan card" className="sr-plan-card" style={{ gap: "var(--core-space-4)" }}>
        <div data-spec="Plan header" className="sr-pc-top">
          <div className="sr-pc-identity">
            <T as="h3" t="h3" className="sr-pc-name">{title}</T>
            <T as="div" t="text14SemiBold" className="sr-pc-type">{type}</T>
            <T as="div" t="text12Regular" className="sr-pc-meta">Plan ID {id}</T>
          </div>
          <Badge tone={tone} size="sm">{badge}</Badge>
        </div>
        {children}
      </div>
    </Card>
  );
}

function DashboardScreen() {
  return (
    <PortalShell current="dashboard">
      <div data-spec="Page body" className="sr-page-body">
        <div data-spec="Greeting bar" className="sr-hi-bar"><T as="h1" t="h1" className="sr-h1">Hi Jordan 👋</T></div>
        <div data-spec="Dashboard grid" className="sr-dash-layout">
          <div data-spec="Main column" className="sr-dash-main">
            <Card>
              <div data-spec="Overall balance" className="sr-ob-top">
                <div data-spec="Balances" className="sr-ob-metrics">
                  <div><T as="div" t="text14SemiBold" className="sr-ob-k">Account balance</T><T as="div" t="text32Bold" className="sr-ob-v">$14,590.00</T></div>
                  <div><T as="div" t="text14SemiBold" className="sr-ob-k">Vested balance</T><T as="div" t="text32Bold" className="sr-ob-v sr-vested">$13,870.00</T></div>
                </div>
                <Button variant="secondary">View summary</Button>
              </div>
              <div data-spec="Loan balance" className="sr-ob-loan">
                <div className="sr-ob-loan-row"><T t="text14SemiBold" className="sr-loan-k">Outstanding loan balance</T><T t="text16Bold" className="sr-loan-v">$2,500.00</T></div>
                <Note>This loan balance is tracked separately and is not reflected in the account balances shown above.</Note>
              </div>
              <div data-spec="Cash balance benefit" className="sr-ob-loan">
                <div className="sr-ob-loan-row"><T t="text14SemiBold" className="sr-loan-k">Cash balance benefit</T><T t="text16Bold" className="sr-loan-v">$18,400.00</T></div>
                <Note>This is a notional value, tracked separately, and is removed from the account balances shown above.</Note>
              </div>
            </Card>
            <section>
              <T as="h2" t="h2" className="sr-section-title">My plans</T>
              <div data-spec="Plan grid" className="sr-plans-grid">
                <PlanCard title="LendGuard Employees Savings and Retirement 401(k) Plan" type="401(k)" id="124542" badge="Participating" tone="success">
                  <T as="p" t="text14Regular" className="sr-plan-notice">Congratulations! You have been enrolled in this plan based on plan's auto enrollment provisions. <a className="sr-link" href="#">View details</a></T>
                  <div data-spec="Plan balances" className="sr-plan-stats">
                    <div className="sr-plan-stat"><T as="div" t="text12SemiBold" className="sr-k">Account balance</T><T as="div" t="text16Bold" className="sr-v">$12,840.00</T></div>
                    <div className="sr-plan-stat sr-vested"><T as="div" t="text12SemiBold" className="sr-k">Vested balance</T><T as="div" t="text16Bold" className="sr-v">$9,620.00</T></div>
                  </div>
                </PlanCard>
                <PlanCard title="LendGuard Roth 401(k) Plan" type="401(k) — Roth" id="124675" badge="Eligible" tone="primary">
                  <T as="p" t="text14Regular" className="sr-plan-notice sr-highlight">Congratulations! You are eligible to participate in this plan. <a className="sr-link" href="#">Enroll here</a></T>
                </PlanCard>
                <PlanCard title="LendGuard Deferred Comp Plan" type="Nonqualified Deferred Compensation" id="125100" badge="Not Eligible" tone="neutral" ineligible>
                  <T as="p" t="text14Regular" className="sr-plan-notice sr-neutral">You are currently not eligible for this plan since you have not met the age/service requirement. <a className="sr-link" href="#">Provide elections in advance</a></T>
                </PlanCard>
                <PlanCard title="LendGuard Cash Balance Plan" type="Cash Balance" id="125210" badge="Participating" tone="success">
                  <T as="p" t="text14Regular" className="sr-plan-notice sr-highlight">Cash balance benefit is <b>$18,400.00</b>. This is a notional value, tracked separately, and is removed from the account balances shown above.</T>
                </PlanCard>
              </div>
            </section>
            <section>
              <T as="h2" t="h2" className="sr-section-title">Quick links</T>
              <div data-spec="Quick links" className="sr-quick-grid">
                {[["fa-solid fa-users", "Add beneficiary"], ["fa-solid fa-file-lines", "My documents"], ["fa-solid fa-chart-line", "My portfolio"], ["fa-solid fa-file-invoice-dollar", "Generate statement"]].map(([icon, label]) => (
                  <CardQuickLink key={label} icon={icon} label={label} />
                ))}
              </div>
            </section>
            <section>
              <T as="h2" t="h2" className="sr-section-title">Recent Transactions</T>
              <div className="sr-table">
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
            </section>
          </div>
          <aside data-spec="Side column" className="sr-dash-side">
            <section data-spec="Retirement readiness" className="sr-rgs">
              <header className="sr-rgs-banner">
                <div className="sr-rgs-copy">
                  <T as="h3" t="eyebrow" className="sr-rgs-eyebrow">Retirement Readiness</T>
                  <T as="p" t="h5" className="sr-rgs-headline">See how your inputs affect your savings, income, risk.</T>
                </div>
                <img className="sr-rgs-art" src="/screen-reference/readiness-banner.png" alt="" />
              </header>
              <div data-spec="Readiness body" className="sr-rgs-body">
                <div data-spec="Readiness intro" className="sr-rgs-intro">
                  <T as="p" t="text12Regular">This estimates how much of your retirement spending is covered by your savings, using your deferrals, age, and location.</T>
                  <Button>Get started</Button>
                </div>
                <div data-spec="Readiness footer" className="sr-rgs-foot">
                  <p className="sr-note"><Icon name="fa-solid fa-circle-info" size="sm" /><span><T t="text12Regular">Not guaranteed results. </T><a className="sr-link" href="#">Disclaimer</a></span></p>
                </div>
              </div>
            </section>
            <section data-spec="Enrich" className="sr-learn">
              <div className="sr-learn-body">
                <T t="text12Medium" className="sr-learn-tag">Enrich</T>
                <T as="p" t="text12Regular" className="sr-learn-desc">Learn how saving, spending, investing, and retirement planning can work together to support your financial goals.</T>
                <a className="sr-link" href="#">Know More</a>
              </div>
              <img className="sr-learn-art" src="/screen-reference/enrich-illustration.png" alt="" />
            </section>
          </aside>
        </div>
      </div>
    </PortalShell>
  );
}

/* ---------------- Investment portfolio ---------------- */

const PERF = ["Aug", "Oct", "Dec", "Feb", "Apr", "Jun", "Aug"].map((m, i) => ({ month: m, total: +(i * 2).toFixed(1), equity: +(i * 2.5).toFixed(1), commodities: +(i * 0.8).toFixed(1), money: +(i * 1.7).toFixed(1) }));
const LEGEND: Array<[string, boolean, "" | "sr-dash" | "sr-dot"]> = [
  ["Total portfolio", true, ""], ["U.S. Equity", true, ""], ["Sector Equity", false, ""],
  ["Allocation", false, ""], ["International Equity", false, ""], ["Alternative", false, "sr-dash"],
  ["Commodities", true, "sr-dot"], ["Taxable Bond", false, "sr-dash"], ["Municipal Bond", false, "sr-dash"],
  ["Money Market", true, ""], ["Miscellaneous", false, "sr-dash"], ["Nontraditional Equity", false, ""],
];
const HOLDINGS = [
  ["Vanguard Institutional Index Fund Admiral Shares", "U.S. Equity", "922908728", "14.82%", "$25,000.00", "$28,705.00", "+3,705.00", "74.32"],
  ["Fidelity 500 Index Fund Institutional Class", "U.S. Equity", "315911750", "14.95%", "$18,000.00", "$20,691.00", "+2,691.00", "52.18"],
  ["Vanguard Total Bond Market Index Fund Admiral Shares", "Taxable Bond", "921937835", "5.18%", "$15,000.00", "$15,777.00", "+777.00", "186.42"],
  ["Fidelity U.S. Bond Index Fund Institutional Premium", "Taxable Bond", "315911727", "5.27%", "$12,500.00", "$13,159.00", "+659.00", "124.63"],
  ["Vanguard Target Retirement 2050 Trust Select", "Allocation", "92202E805", "10.42%", "$20,000.00", "$22,084.00", "+2,084.00", "168.57"],
];
const HOLDING_COLS = ["Investment name", "Asset class", "CUSIP", "Fund return YTD", "Invested balance", "Current balance", "Gain/loss", "Unit balance"];

function Sort({ label }: { label: string }) {
  return <span className="sr-sort">{label}<Icon name="fa-solid fa-sort" size="sm" /></span>;
}

function PortfolioScreen() {
  const [range, setRange] = useState("1Y");
  return (
    <PortalShell current="portfolio">
      <div data-spec="Page header" className="sr-page-head">
        <div data-spec="Title row" className="sr-page-head-row">
          <T as="h1" t="h1" className="sr-h1">Investment portfolio</T>
          <div style={{ width: 320 }}><Select aria-label="Select plan" defaultValue="p" options={[{ value: "p", label: "LendGuard Employees Savings and Retirement 401(k) Plan" }]} /></div>
        </div>
      </div>
      <div data-spec="Tabs bar" className="sr-tabs-bar"><Tabs items={[{ id: "mine", label: "My portfolio" }, { id: "plan", label: "Plan investments" }]} /></div>
      <div data-spec="Page body" className="sr-page-body">
        <div data-spec="Tab panel" className="sr-panel-stack">
          <div data-spec="Overview row" className="sr-overview-row">
            <Card>
              <div data-spec="Portfolio summary" className="sr-overall-body">
                <div className="sr-stat-block sr-hero"><T as="div" t="text12SemiBold" className="sr-stat-k">Current balance</T><T as="div" t="text24Bold" className="sr-stat-v">$100,416.00</T></div>
                {[["Invested balance", "$90,500.00", ""], ["Gain / loss", "+$9,916.00", "sr-pos"], ["YTD return", "8.00%", "sr-pos"]].map(([k, v, c]) => (
                  <div key={k} className="sr-stat-block"><T as="div" t="text12SemiBold" className="sr-stat-k">{k}</T><T as="div" t="text20Bold" className={`sr-stat-v ${c}`}>{v}</T></div>
                ))}
              </div>
            </Card>
            <Card>
              <div data-spec="Chart panel" className="sr-chart-panel">
                <T as="h2" t="h5" className="sr-chart-title">Asset class performance</T>
                <div data-spec="Period selector" className="sr-period" aria-label="Chart period">
                  {["1M", "3M", "6M", "YTD", "1Y", "3Y", "5Y", "10Y"].map((p) => (
                    <button key={p} type="button" aria-pressed={p === range} onClick={() => setRange(p)} data-type="text12Bold">{p}</button>
                  ))}
                </div>
                <div className="sr-chart-wrap">
                  <LineChartCard title="Asset class performance" data={PERF} xKey="month" height={260} series={[{ key: "total", label: "Total portfolio", color: "var(--neutral-text-default)" }, { key: "equity", label: "U.S. Equity", color: "var(--neutral-text-subtle)" }, { key: "money", label: "Money Market", color: "var(--brand-text-primary-default)" }, { key: "commodities", label: "Commodities", color: "var(--theme-semantics-critical-text)" }]} />
                </div>
                <div data-spec="Legend" className="sr-legend">
                  {LEGEND.map(([label, on]) => <Checkbox key={label} label={label} defaultChecked={on} size="sm" />)}
                </div>
              </div>
            </Card>
          </div>
          <section data-spec="Investments">
            <T as="h2" t="h4" className="sr-section-h">Investments</T>
            <div data-spec="Table tools" className="sr-table-tools">
              <div className="sr-table-search"><Field label="Search">{(p) => <Input {...p} placeholder="Search investment name or CUSIP" />}</Field></div>
              <Button variant="secondary">Export</Button>
            </div>
            <div className="sr-table-wrap">
              <table>
                <colgroup>{[297, 129, 105, 163, 170, 161, 117, 137].map((w, i) => <col key={i} style={{ width: w }} />)}</colgroup>
                <thead><tr>{HOLDING_COLS.map((c, i) => <th key={c} className={i >= 3 ? "sr-num" : undefined}><Sort label={c} /></th>)}</tr></thead>
                <tbody>
                  {HOLDINGS.map((h) => (
                    <tr key={h[2]}>
                      <td className="sr-fund"><button type="button" className="sr-link">{h[0]}</button></td>
                      <td>{h[1]}</td>
                      <td>{h[2]}</td>
                      <td className="sr-num sr-strong">{h[3]}</td>
                      <td className="sr-num">{h[4]}</td>
                      <td className="sr-num">{h[5]}</td>
                      <td className="sr-num sr-strong">{h[6]}</td>
                      <td className="sr-num">{h[7]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </PortalShell>
  );
}

/* ---------------- Documents ---------------- */

function DateField({ label, value, width }: { label: string; value: string; width: number }) {
  return (
    <div className="sr-doc-field" style={{ width }}>
      <Field label={label}>{(p) => <InputWithIcon {...p} readOnly value={value} trailingIcon={<CalendarIcon size={16} />} />}</Field>
    </div>
  );
}

function DocumentsScreen() {
  return (
    <PortalShell current="documents">
      <div data-spec="Page body" className="sr-page-body">
        <div data-spec="Title bar" className="sr-hi-bar">
          <div>
            <T as="h1" t="h1" className="sr-h1">Documents</T>
            <T as="p" t="text14Medium" className="sr-intro">Access, download, and generate important plan documents and disclosures</T>
          </div>
        </div>
        <Card>
          <div data-spec="Filters" className="sr-doc-filters">
            <div className="sr-doc-field" style={{ width: 167 }}><Field label="Search">{(p) => <Input {...p} placeholder="Document name" />}</Field></div>
            <div className="sr-doc-field" style={{ width: 170 }}><Field label="Plan Name/ID">{(p) => <Select {...p} defaultValue="all" options={[{ value: "all", label: "All" }]} />}</Field></div>
            <div className="sr-doc-field" style={{ width: 170 }}><Field label="Document Type">{(p) => <Select {...p} defaultValue="all" options={[{ value: "all", label: "All" }]} />}</Field></div>
            <DateField label="Documented from" value="Mar 30, 2026" width={150} />
            <DateField label="Documented to" value="Sep 30, 2026" width={150} />
            <div className="sr-doc-field">
              <span className="sr-hidden-label" aria-hidden="true">&nbsp;</span>
              <div data-spec="Filter actions" className="sr-doc-actions">
                <button type="button" className="sr-link">Reset</button>
                <Button disabled>Search</Button>
              </div>
            </div>
          </div>
          <div data-spec="Results header" className="sr-doc-results">
            <T t="text14Bold" className="sr-doc-count">01 - Record found</T>
            <Button variant="secondary">Generate new statement</Button>
          </div>
          <article data-spec="Document row" className="sr-doc-row">
            <div>
              <T as="h2" t="text14Bold" className="sr-doc-name">Enrollment Notice_08-12-2026</T>
              <T as="p" t="text12Regular" className="sr-doc-meta">Enrollment Notice · Aug 12, 2026</T>
            </div>
            <T t="text12SemiBold" className="sr-doc-plan">LendGuard Employees Savings and Retirement 401(k) Plan</T>
            <button type="button" className="sr-doc-dl">Download</button>
          </article>
        </Card>
      </div>
    </PortalShell>
  );
}

/* ---------------- Enrollment flow ---------------- */

function SourceRow({ name, help }: { name: string; help: string }) {
  return (
    <div data-spec="Deferral source" className="sr-source">
      <div className="sr-srow">
        <span className="sr-smeta">
          <T t="text14Bold" className="sr-sname">{name}</T>
          <T t="text12Medium" className="sr-shelp">{help}</T>
        </span>
        <span className="sr-sval"><input defaultValue="0" aria-label={`${name} %`} /><span className="sr-pct">%</span></span>
      </div>
    </div>
  );
}

function EnrollmentScreen() {
  return (
    <div className="sr-enroll-shell">
      <PortalShell current="dashboard" footer={false}>
        <div data-spec="Enrollment layout" className="sr-enroll">
          <aside data-spec="Steps panel" className="sr-steps">
            <a className="sr-link" href="#">‹ Back</a>
            <T as="h1" t="h2" className="sr-steps-title">Plan enrollment</T>
            <div className="sr-divider" />
            <Stepper
              orientation="vertical"
              currentIndex={0}
              steps={[
                { label: "Deferral rate", description: "Specify payroll deferral rates and set up auto increase." },
                { label: "Investment election", description: "Choose the investments and its allocation percentages" },
                { label: "Summary", description: "Review the elections before confirming." },
              ]}
            />
          </aside>
          <div data-spec="Enrollment main" className="sr-enroll-main">
            <div data-spec="Detail header" className="sr-detail-head">
              <T as="div" t="text12SemiBold" className="sr-eyebrow">Plan details</T>
              <T as="h2" t="h2" className="sr-detail-h2">401(k) Company Plan High Returns</T>
              <T as="div" t="text16Regular" className="sr-plan-meta">Plan ID <b>124542</b></T>
            </div>
            <div data-spec="Detail body" className="sr-detail-body">
              <div className="sr-narrow">
                <div data-spec="Section top" className="sr-section-top">
                  <T as="h3" t="h6" className="sr-enroll-h3">Set my deferral rate</T>
                  <button type="button" className="sr-link">Opt out</button>
                </div>
                <Card className="sr-enroll-form">
                  <div data-spec="Form header" className="sr-form-head">
                    <div className="sr-form-head-left">
                      <T t="text14Bold">Deferral by source</T>
                      <button type="button" className="sr-plan-chip">Use plan deferral rate</button>
                    </div>
                    <div className="sr-unit-toggle" role="group" aria-label="Amount format">
                      <button type="button" aria-pressed="true">%</button>
                      <button type="button" aria-pressed="false">$</button>
                    </div>
                  </div>
                  <SourceRow name="Pre-Tax" help="Pre-tax employee deferrals lower current year taxes. The deferrals and earnings on the deferrals are taxable when withdrawn and not taxable when it is rolled over." />
                  <SourceRow name="Roth" help="Roth employee deferrals are taxable in the year contributed, but not when withdrawn. Earnings will not be taxable if certain age and holding period requirements are met." />
                  <div data-spec="Total bar" className="sr-totalbar">
                    <button type="button" className="sr-link">Reset</button>
                    <span className="sr-tval-wrap"><T t="text14Bold">Total deferral</T><T t="text16Bold" className="sr-tval">0%</T></span>
                  </div>
                </Card>
              </div>
              <div data-spec="Auto increase" className="sr-ai-block">
                <T as="h3" t="h6" className="sr-enroll-h3">Auto increase</T>
                <T as="p" t="text14Regular" className="sr-section-sub">Automatically increase the deferral rate over time to grow the retirement savings.</T>
                <div data-spec="Choices" className="sr-choice-list" role="radiogroup" aria-label="Auto increase">
                  {[["Use auto increase", "Set the annual auto deferral rate increase."], ["Don't use auto increase", "Keep the same deferral rate in effect each year"]].map(([b, s]) => (
                    <button key={b} type="button" role="radio" aria-checked="false" className="sr-choice">
                      <span className="sr-choice-dot" aria-hidden="true" />
                      <span><T as="b" t="text14Bold">{b}</T><T as="small" t="text14Medium">{s}</T></span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="sr-narrow">
                <div data-spec="Actions" className="sr-enroll-nav">
                  <Button>Continue</Button>
                  <Button variant="tertiary">Cancel</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PortalShell>
    </div>
  );
}

/* ---------------- Mobile frame ---------------- */

export const SCREEN_COMPONENTS: Record<string, () => JSX.Element> = {
  dashboard: DashboardScreen,
  portfolio: PortfolioScreen,
  documents: DocumentsScreen,
  enrollment: EnrollmentScreen,
};

/** Standalone render of one screen, loaded in a phone-sized iframe so the
 *  portal's responsive rules (and CORE's own breakpoints) apply for real. */
export function ScreenFrame({ id, mode }: { id: string; mode: "light" | "dark" }) {
  const Screen = SCREEN_COMPONENTS[id];
  useLayoutEffect(() => {
    document.body.style.margin = "0";
    document.body.style.background = "var(--core-color-bg-page)";
  }, []);
  if (!Screen) return null;
  return (
    <div className="sr-portal sr-frame" data-theme="core" data-mode={mode} style={{ minHeight: "100vh", background: "var(--core-color-bg-page)" }}>
      <Screen />
    </div>
  );
}

/** Phone preview: 390 × 844 viewport with the page scrolling inside it. */
function MobilePreview({ id, notes }: { id: string; notes: string[] }) {
  const { mode } = usePreviewMode();
  return (
    <div className="sr-mobile-ref">
      <div className="sr-phone">
        <iframe title={`${id} — mobile`} src={`/#/screen-frame/${id}?mode=${mode}`} width={390} height={844} />
      </div>
      <div className="sr-mobile-notes">
        <SectionHeading>What changes below 640 px</SectionHeading>
        <ul>{notes.map((n) => <li key={n}>{n}</li>)}</ul>
      </div>
    </div>
  );
}

const MOBILE_NOTES: Record<string, string[]> = {
  common: [
    "Sidebar rail is replaced by the CORE MobileNav bottom bar (Menu · Dashboard · Settings); the other destinations move into the Menu sheet.",
    "Page padding drops from 24 / 32 / 48 to 16 / 16 / 32 (core-space-4 / 8); content stacks in one column.",
    "Footer stacks copyright above the links, padding 12 / 16, no rail offset.",
  ],
  dashboard: [
    "Greeting H1 steps down to font-size-xl (24px).",
    "Dashboard grid, plan grid and quick links become one column; the side column (Retirement readiness, Enrich) moves below the transactions.",
    "Below 420 px the balance header stacks and View summary stretches to full width.",
  ],
  portfolio: [
    "Page header padding 16; H1 steps down to H4 (20px) and the plan select wraps below it.",
    "Tabs bar padding 0 / 16 and scrolls horizontally.",
    "Summary card and chart stack; chart height 220px; legend becomes one column.",
    "Holdings table keeps its columns and scrolls sideways inside its frame.",
  ],
  documents: [
    "Filters stack full width (below 760 px); Reset + Search sit on their own row.",
    "Results header stacks and Generate new statement goes full width.",
    "Each document row stacks: name, type · date, plan, then Download.",
  ],
  enrollment: [
    "The step panel becomes a row of numbered markers across the top (below 980 px); Back, the title and step text are hidden.",
    "Detail header padding 16; plan name steps down to H4.",
    "Deferral form header wraps; percentage inputs are 56px wide at body-lg size.",
  ],
};

/* ---------------- Section ---------------- */

function DarkCanvas({ children }: { children: React.ReactNode }) {
  const { mode } = usePreviewMode();
  return (
    <div className="sr-portal" data-theme="core" data-mode={mode} style={{ width: WIDTH, background: "var(--core-color-bg-page)" }}>
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
      <h4 style={{ margin: "var(--core-space-4) 0 0", fontSize: "var(--typography-heading-h5-size)" }}>{title} — mobile (390 px)</h4>
      <MobilePreview id={id} notes={[...MOBILE_NOTES[id], ...MOBILE_NOTES.common]} />
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
