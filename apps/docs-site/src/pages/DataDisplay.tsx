import React, { useState } from "react";
import { CardQuickLink } from "../QuickLinkCard";
import { QuickLinksAnatomy, QUICKLINK_CELL_STYLE } from "../SectionAnatomies";
import { ProgressAnatomy } from "../SectionAnatomies";
import { TableAnatomy } from "../SectionAnatomies";
import { Preview, CodeBlock } from "../Preview";
import { DocsSection, DocsSectionList, StateLabel } from "../DocsSection";
import { Anatomy, AnatomyLegend } from "../Anatomy";
import { Card, Badge, BadgeTone, BadgeSize } from "../../../../packages/core/src/components/Misc";
import { Table, DataTable, TableScrollWrap, Avatar, AvatarGroup, Progress } from "../../../../packages/core/src/components/DataDisplay";
import { AVATAR_JORDAN, AVATAR_SAM, AVATAR_SAMPLES } from "../avatarSamples";
import { Icon } from "../../../../packages/core/src/components/Primitives";
import { AnatomySection } from "../AnatomySection";
import { BadgeAnatomy } from "../BadgeAnatomy";
const rows = [
  { id: 1, date: "Sep 01, 2026", type: "Contribution", amount: "$412.50", status: "success" as const },
  { id: 2, date: "Aug 15, 2026", type: "Dividend", amount: "$18.20", status: "success" as const },
  { id: 3, date: "Aug 01, 2026", type: "Contribution", amount: "$412.50", status: "warning" as const },
  { id: 4, date: "Jul 15, 2026", type: "Fee", amount: "-$4.00", status: "danger" as const },
];

// ---------- Table variants: shared formatters + datasets ----------
const fmtCurrency = (n: number) => `$${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const fmtSignedCurrency = (n: number) => `${n >= 0 ? "+" : "-"}${fmtCurrency(Math.abs(n))}`;
const fmtPercent = (n: number) => `${n.toFixed(2)}%`;

const standardTableRows = [
  { id: 1, date: "Feb 28, 2026", type: "My Deferral", plan: "LendGuard Employees Savings and Retirement 401(k) Plan", amount: 312.0 },
  { id: 2, date: "Feb 28, 2026", type: "Employer Contribution", plan: "LendGuard Employees Savings and Retirement 401(k) Plan", amount: 208.0 },
  { id: 3, date: "Feb 14, 2026", type: "My Deferral", plan: "LendGuard Employees Savings and Retirement 401(k) Plan", amount: 312.0 },
  { id: 4, date: "Feb 14, 2026", type: "Employer Contribution", plan: "LendGuard Employees Savings and Retirement 401(k) Plan", amount: 208.0 },
  { id: 5, date: "Jan 31, 2026", type: "Employer Contribution", plan: "LendGuard Profit Sharing", amount: 450.0 },
];

const investmentRows = [
  { id: 1, name: "Vanguard Institutional Index Fund Admiral Shares", assetClass: "U.S. Equity", cusip: "922908728", fundReturn: 14.82, invested: 25000, current: 28705, gain: 3705, units: 74.32 },
  { id: 2, name: "Fidelity 500 Index Fund Institutional Class", assetClass: "U.S. Equity", cusip: "315911750", fundReturn: 14.95, invested: 18000, current: 20691, gain: 2691, units: 52.18 },
  { id: 3, name: "Vanguard Total Bond Market Index Fund Admiral Shares", assetClass: "U.S. Bond", cusip: "921937835", fundReturn: 5.18, invested: 15000, current: 15777, gain: 777, units: 186.42 },
  { id: 4, name: "Fidelity U.S. Bond Index Fund Institutional Premium", assetClass: "U.S. Bond", cusip: "315911727", fundReturn: 5.27, invested: 12500, current: 13159, gain: 659, units: 124.63 },
  { id: 5, name: "Vanguard Target Retirement 2050 Trust Select", assetClass: "Target-Date", cusip: "92202E805", fundReturn: 10.42, invested: 20000, current: 20084, gain: 2084, units: 168.57 },
];

const benchmarkRows = [
  {
    fund: { id: 1, name: "Vanguard Institutional Index Fund Admiral Shares", category: "Large Cap Blend", returnYtd: 8.62, y1: 14.82, y5: 13.91, y10: 11.87, sinceInception: 10.74, expensePct: 0.04, expensePer1000: 0.4, fees: "0.00%" },
    benchmark: { id: "b1", name: "Benchmark – S&P 500 Index", returnYtd: 9.1, y1: 15.1, y5: 14.18, y10: 12.4, sinceInception: 11.2, expensePct: null, expensePer1000: null, fees: "N/A" },
  },
  {
    fund: { id: 2, name: "Fidelity 500 Index Fund Institutional Class", category: "Large Cap Blend", returnYtd: 8.71, y1: 14.95, y5: 14.02, y10: 11.96, sinceInception: 10.86, expensePct: 0.02, expensePer1000: 0.2, fees: "0.00%" },
    benchmark: { id: "b2", name: "Benchmark – S&P 500 Index", returnYtd: 9.1, y1: 15.1, y5: 14.18, y10: 12.4, sinceInception: 11.2, expensePct: null, expensePer1000: null, fees: "N/A" },
  },
  {
    fund: { id: 3, name: "Vanguard Total Bond Market Index Fund Admiral Shares", category: "Intermediate Bond", returnYtd: 3.12, y1: 5.18, y5: 0.86, y10: 2.14, sinceInception: 4.02, expensePct: 0.05, expensePer1000: 0.5, fees: "0.00%" },
    benchmark: { id: "b3", name: "Benchmark – Bloomberg U.S. Aggregate Bond", returnYtd: 3.4, y1: 5.32, y5: 1.04, y10: 2.28, sinceInception: 4.2, expensePct: null, expensePer1000: null, fees: "N/A" },
  },
  {
    fund: { id: 4, name: "Fidelity U.S. Bond Index Fund Institutional Premium", category: "Intermediate Bond", returnYtd: 3.21, y1: 5.27, y5: 0.94, y10: 2.21, sinceInception: 4.15, expensePct: 0.03, expensePer1000: 0.3, fees: "0.00%" },
    benchmark: { id: "b4", name: "Benchmark – Bloomberg U.S. Aggregate Bond", returnYtd: 3.4, y1: 5.32, y5: 1.04, y10: 2.28, sinceInception: 4.2, expensePct: null, expensePer1000: null, fees: "N/A" },
  },
  {
    fund: { id: 5, name: "Vanguard Target Retirement 2050 Trust Select", category: "Target-Date", returnYtd: 6.15, y1: 10.42, y5: 8.92, y10: null, sinceInception: 7.86, expensePct: 0.08, expensePer1000: 0.8, fees: "0.00%" },
    benchmark: { id: "b5", name: "Benchmark – Target Retirement Composite", returnYtd: 6.4, y1: 10.71, y5: 9.21, y10: 8.5, sinceInception: 8.1, expensePct: null, expensePer1000: null, fees: "N/A" },
  },
];

const loanRows = [
  { id: 1, type: "Loan", plan: "LendGuard Employees Savings and Retirement 401(k) Plan", date: "Jan 10, 2026", status: "success" as const, amount: 2500.0 },
];

/**
 * Bordered horizontal "quick action" card — icon badge + bold label, laid
 * out in a row of standalone cards (not the Sidebar panel's vertical flat
 * list; that's a different shape for a different context — a settings
 * sub-nav vs. a dashboard's row of shortcuts).
 */
const sectionLabelStyle: React.CSSProperties = {
  fontSize: "var(--typography-label-size)",
  lineHeight: "var(--typography-label-line-height)",
  fontWeight: "var(--typography-label-weight)",
  letterSpacing: "var(--typography-label-letter-spacing)",
  color: "var(--theme-neutral-text-subtle)",
  marginBottom: "var(--core-space-3, 12px)",
};

const badgeMatrixHeaderStyle: React.CSSProperties = {
  fontSize: "var(--typography-eyebrow-size)",
  lineHeight: "var(--typography-eyebrow-line-height)",
  fontWeight: "var(--typography-eyebrow-weight)",
  letterSpacing: "var(--typography-eyebrow-letter-spacing)",
  color: "var(--theme-neutral-text-subtle)",
  textTransform: "uppercase",
};

function BadgeMatrixDemo() {
  const [size, setSize] = useState<BadgeSize>("md");
  const tones: BadgeTone[] = ["primary", "neutral", "success", "warning", "danger", "info"];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--core-space-4, 16px)" }}>
      <div
        style={{
          display: "inline-flex",
          // Blockified to a real `flex` box when it's itself a flex item in
          // a column layout (per spec, inline-level `display` values are
          // blockified for flex items) — without `alignSelf: flex-start` it
          // stretched to the full width of its column parent instead of
          // hugging its two buttons' content width.
          alignSelf: "flex-start",
          gap: "var(--core-space-1, 4px)",
          padding: "var(--core-space-1)",
          borderRadius: "var(--core-radius-sm)",
          border: "1px solid var(--theme-neutral-border-primary-default)",
          // Was --theme-colors-neutral-50, a raw (non-mode-aware) primitive
          // that stayed light even in dark mode.
          background: "var(--core-color-surface-sunken)",
        }}
      >
        {(["md", "sm"] as const).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setSize(s)}
            style={{
              border: "none",
              background: size === s ? "var(--theme-brand-background-primary-strong)" : "transparent",
              color: size === s ? "var(--theme-brand-text-primary-oncolor)" : "var(--theme-neutral-text-primary-default)",
              borderRadius: "var(--core-radius-sm)",
              padding: "var(--core-space-1) var(--core-space-3)",
              fontFamily: "var(--typography-font-family-sans)",
              fontSize: "var(--typography-body-xs-size)",
              lineHeight: "var(--typography-body-xs-line-height)",
              fontWeight: "var(--typography-font-weight-semibold)",
              cursor: "pointer",
              transition: "background-color 120ms ease, color 120ms ease",
            }}
          >
            {s === "md" ? "Medium" : "Small"}
          </button>
        ))}
      </div>

      <div className="site-panel site-panel--flush site-panel--demo">
        <Preview showModeToggle>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--core-space-6, 24px)" }}>
            {tones.map((t) => (
              <div key={t} style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "var(--core-space-2, 8px)" }}>
                <span style={badgeMatrixHeaderStyle}>{t}</span>
                <Badge tone={t} size={size} variant="soft">{t}</Badge>
              </div>
            ))}
          </div>
        </Preview>
      </div>
    </div>
  );
}

const sampleAvatars = [...AVATAR_SAMPLES];

function AvatarSizeDemo() {
  return (
    <div className="site-panel site-panel--flush site-panel--demo">
      <Preview showModeToggle>
        <div style={{ overflowX: "auto", width: "100%" }}>
          <table className="cds-table" data-density="comfortable">
            <thead>
              <tr>
                <th scope="col" style={{ width: 140, fontSize: "var(--typography-font-size-xs)", textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--core-color-text-secondary)" }}>Component</th>
                <th scope="col" style={{ fontSize: "var(--typography-font-size-xs)", textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--core-color-text-secondary)" }}>Small (sm) — 24px</th>
                <th scope="col" style={{ fontSize: "var(--typography-font-size-xs)", textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--core-color-text-secondary)" }}>Medium (md) — 32px</th>
                <th scope="col" style={{ fontSize: "var(--typography-font-size-xs)", textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--core-color-text-secondary)" }}>Large (lg) — 48px</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ fontSize: "var(--typography-body-md-size)", fontWeight: 600, color: "var(--core-color-text-primary)" }}>Single Avatar</td>
                <td>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                    <Avatar name={AVATAR_JORDAN.name} src={AVATAR_JORDAN.src} size="sm" />
                    <Avatar name={AVATAR_SAM.name} src={AVATAR_SAM.src} size="sm" />
                  </div>
                </td>
                <td>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                    <Avatar name={AVATAR_JORDAN.name} src={AVATAR_JORDAN.src} size="md" />
                    <Avatar name={AVATAR_SAM.name} src={AVATAR_SAM.src} size="md" />
                  </div>
                </td>
                <td>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                    <Avatar name={AVATAR_JORDAN.name} src={AVATAR_JORDAN.src} size="lg" />
                    <Avatar name={AVATAR_SAM.name} src={AVATAR_SAM.src} size="lg" />
                  </div>
                </td>
              </tr>
              <tr>
                <td style={{ fontSize: "var(--typography-body-md-size)", fontWeight: 600, color: "var(--core-color-text-primary)" }}>Avatar Group</td>
                <td>
                  <AvatarGroup avatars={sampleAvatars} size="sm" max={3} />
                </td>
                <td>
                  <AvatarGroup avatars={sampleAvatars} size="md" max={3} />
                </td>
                <td>
                  <AvatarGroup avatars={sampleAvatars} size="lg" max={3} />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Preview>
    </div>
  );
}

export default function DataDisplay({ embedded = false }: { embedded?: boolean }) {
  const sections = [
    {
      id: "04",
      anchorId: "avatar",
      title: "Avatar & Groups",
      content: (
        <AvatarSizeDemo />
      ),
    },
    {
      id: "02",
      anchorId: "badge",
      title: "Badge",
      content: <AnatomySection demo={<BadgeMatrixDemo />} anatomy={<BadgeAnatomy />} />,
    },
    {
      id: "03",
      anchorId: "data-table",
      title: "Table & Data Table",
      content: (
        <div id="table" style={{ display: "flex", flexDirection: "column", gap: "var(--core-space-8, 32px)" }}>
          {/* ---------- Table variants ----------
              Grouped under a single grey demo canvas (one Preview, one
              site-panel) the same way Forms.tsx pairs Checkbox + Radio —
              each variant gets its own title label instead of its own
              panel, so all four stay visually comparable side by side. */}
          <div>
            <div style={{ ...sectionLabelStyle, marginBottom: 2 }}>Table variants</div>
            <div style={{ fontSize: "var(--typography-body-sm-size, 13px)", color: "var(--theme-neutral-text-subtle)", marginBottom: "var(--core-space-3, 12px)" }}>
              Four table patterns for the most common data shapes — transaction history, investment options, benchmark comparisons, and actionable items.
            </div>
            <div className="site-panel site-panel--flush site-panel--demo">
          <AnatomySection
            anatomy={<TableAnatomy />}
            demo={<>
              <Preview showModeToggle>
                <div style={{ display: "flex", flexDirection: "column", gap: 32, width: "100%" }}>
                  <div>
                    <div style={{ fontSize: "var(--typography-label-size)", lineHeight: "var(--typography-label-line-height)", fontWeight: "var(--typography-label-weight)", letterSpacing: "var(--typography-label-letter-spacing)", color: "var(--theme-neutral-text-subtle)", marginBottom: 12 }}>
                      Standard Data Table
                    </div>
                    <DataTable
                      columns={[
                        { key: "date", header: "Date", sortable: true },
                        { key: "type", header: "Type", sortable: true },
                        { key: "plan", header: "Plan", sortable: true },
                        { key: "amount", header: "Amount", align: "right", render: (r) => fmtCurrency(r.amount) },
                      ]}
                      rows={standardTableRows}
                      pageSize={10}
                    />
                  </div>

                  <div>
                    <div style={{ fontSize: "var(--typography-label-size)", lineHeight: "var(--typography-label-line-height)", fontWeight: "var(--typography-label-weight)", letterSpacing: "var(--typography-label-letter-spacing)", color: "var(--theme-neutral-text-subtle)", marginBottom: 12 }}>
                      Investment Table
                    </div>
                    <div style={{ width: "100%", minWidth: 0 }}>
                      <DataTable
                        columns={[
                          {
                            key: "name",
                            header: "Investment name",
                            sortable: true,
                            render: (r) => <button type="button" className="cds-table-link cds-table-truncate" title={r.name}>{r.name}</button>,
                          },
                          { key: "assetClass", header: "Asset class", sortable: true },
                          {
                            key: "fundReturn",
                            header: "Fund return YTD",
                            sortable: true,
                            align: "right",
                            render: (r) => <span className="cds-table-positive">{fmtPercent(r.fundReturn)}</span>,
                          },
                          { key: "current", header: "Current balance", sortable: true, align: "right", render: (r) => fmtCurrency(r.current) },
                          {
                            key: "gain",
                            header: "Gain/Loss",
                            sortable: true,
                            align: "right",
                            render: (r) => <span className={r.gain >= 0 ? "cds-table-positive" : "cds-table-negative"}>{fmtSignedCurrency(r.gain)}</span>,
                          },
                        ]}
                        rows={investmentRows}
                        pageSize={10}
                      />
                    </div>
                  </div>

                  {/* Benchmark / Comparison: hand-built with raw table markup —
                      grouped (colSpan) headers and a fund-row + benchmark-row
                      pairing aren't things Table/DataTable support (see
                      components.css comment above .cds-table-row--benchmark
                      for why this wasn't added to the shared component).
                      Reuses the same .cds-table classes so it stays visually
                      identical. */}
                  <div>
                    <div style={{ fontSize: "var(--typography-label-size)", lineHeight: "var(--typography-label-line-height)", fontWeight: "var(--typography-label-weight)", letterSpacing: "var(--typography-label-letter-spacing)", color: "var(--theme-neutral-text-subtle)", marginBottom: 12 }}>
                      Benchmark / Comparison Table
                    </div>
                    <TableScrollWrap className="cds-table-wrap">
                      <table className="cds-table cds-table--divided" data-zebra="false">
                        <thead>
                          <tr>
                            <th rowSpan={2} scope="col">Fund name / category</th>
                            <th rowSpan={2} scope="col" style={{ textAlign: "right" }}>Return YTD</th>
                            <th colSpan={3} scope="colgroup">Average annual total return</th>
                            <th rowSpan={2} scope="col" style={{ textAlign: "right" }}>Annual expense (per $1,000)</th>
                          </tr>
                          <tr>
                            <th scope="col" style={{ textAlign: "right" }}>1 yr.</th>
                            <th scope="col" style={{ textAlign: "right" }}>5 yr.</th>
                            <th scope="col" style={{ textAlign: "right" }}>10 yr.</th>
                          </tr>
                        </thead>
                        <tbody>
                          {benchmarkRows.map(({ fund, benchmark }) => (
                            <React.Fragment key={fund.id}>
                              <tr>
                                <td>
                                  <button type="button" className="cds-table-link cds-table-truncate" title={fund.name}>{fund.name}</button>
                                  <span className="cds-table-secondary cds-table-truncate">{fund.category}</span>
                                </td>
                                <td style={{ textAlign: "right" }}>{fmtPercent(fund.returnYtd)}</td>
                                <td style={{ textAlign: "right" }}>{fmtPercent(fund.y1)}</td>
                                <td style={{ textAlign: "right" }}>{fmtPercent(fund.y5)}</td>
                                <td style={{ textAlign: "right" }}>{fund.y10 != null ? fmtPercent(fund.y10) : <span className="cds-table-empty-value">—</span>}</td>
                                <td style={{ textAlign: "right" }}>{fmtCurrency(fund.expensePer1000!)}</td>
                              </tr>
                              <tr className="cds-table-row--benchmark">
                                <td><span className="cds-table-truncate" title={benchmark.name}>{benchmark.name}</span></td>
                                <td style={{ textAlign: "right" }}>{fmtPercent(benchmark.returnYtd)}</td>
                                <td style={{ textAlign: "right" }}>{fmtPercent(benchmark.y1)}</td>
                                <td style={{ textAlign: "right" }}>{fmtPercent(benchmark.y5)}</td>
                                <td style={{ textAlign: "right" }}>{fmtPercent(benchmark.y10!)}</td>
                                <td style={{ textAlign: "right" }}>—</td>
                              </tr>
                            </React.Fragment>
                          ))}
                        </tbody>
                      </table>
                    </TableScrollWrap>
                  </div>

                  <div>
                    <div style={{ fontSize: "var(--typography-label-size)", lineHeight: "var(--typography-label-line-height)", fontWeight: "var(--typography-label-weight)", letterSpacing: "var(--typography-label-letter-spacing)", color: "var(--theme-neutral-text-subtle)", marginBottom: 12 }}>
                      Action / Loan Table
                    </div>
                    <Table
                      columns={[
                        { key: "type", header: "Type" },
                        { key: "plan", header: "Plan" },
                        { key: "date", header: "Date" },
                        { key: "status", header: "Status", render: (r) => <Badge tone={r.status}>Approved</Badge> },
                        { key: "amount", header: "Amount", align: "right", render: (r) => fmtCurrency(r.amount) },
                        { key: "action", header: "", align: "right", render: () => <button type="button" className="cds-table-link">Calculate</button> },
                      ]}
                      rows={loanRows}
                      zebra={false}
                    />
                  </div>
                </div>
              </Preview>
            </>}
          />
        </div>
          </div>

          {/* ---------- Column Content Types legend ---------- */}
          <div>
            <div style={{ ...sectionLabelStyle, marginBottom: 2 }}>Column Content Types</div>
            <div style={{ fontSize: "var(--typography-body-sm-size, 13px)", color: "var(--theme-neutral-text-subtle)", marginBottom: "var(--core-space-3, 12px)" }}>
              Common column content patterns used in tables.
            </div>
            <div className="site-panel site-panel--flush site-panel--demo">
              <Preview showModeToggle>
                <TableScrollWrap className="cds-table-wrap">
                  <table className="cds-table">
                    <thead>
                      <tr>
                        <th scope="col">Text</th>
                        <th scope="col">Linked text</th>
                        <th scope="col">Secondary text</th>
                        <th scope="col">Percentage</th>
                        <th scope="col">Currency</th>
                        <th scope="col" style={{ textAlign: "right" }}>Numeric (right-aligned)</th>
                        <th scope="col" style={{ textAlign: "right" }}>Positive value</th>
                        <th scope="col">Status</th>
                        <th scope="col">Action link</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>My Deferral</td>
                        <td><button type="button" className="cds-table-link">Vanguard Fund</button></td>
                        <td>
                          Investment name
                          <span className="cds-table-secondary">Large Cap Blend</span>
                        </td>
                        <td className="cds-table-positive">14.82%</td>
                        <td>$25,000.00</td>
                        <td style={{ textAlign: "right" }}>74.32</td>
                        <td style={{ textAlign: "right" }} className="cds-table-positive">+2,691.00</td>
                        <td><Badge tone="success">Approved</Badge></td>
                        <td><button type="button" className="cds-table-link">Calculate</button></td>
                      </tr>
                    </tbody>
                  </table>
                </TableScrollWrap>
              </Preview>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "05",
      anchorId: "progress",
      title: "Progress",
      content: (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div className="site-panel site-panel--flush site-panel--demo">
          <AnatomySection
            anatomy={<ProgressAnatomy />}
            demo={<>
            <Preview showModeToggle>
              <div style={{ width: 320, display: "flex", flexDirection: "column", gap: 20 }}>
                <Progress value={68} label="Retirement readiness — 68%" />
                <Progress indeterminate label="Submitting your request…" />
              </div>
            </Preview>

          </>}
          />
        </div>
        </div>
      ),
    },
    {
      id: "01",
      anchorId: "quick-links",
      title: "Quick links",
      content: (
        <div className="site-panel site-panel--flush site-panel--demo">
          <AnatomySection
            anatomy={<QuickLinksAnatomy />}
            demo={<>
          <Preview showModeToggle>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--core-space-8, 32px)", width: "100%", padding: "var(--core-space-2, 8px) 0" }}>
              <div>
                <div style={sectionLabelStyle}>Variants</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--core-space-3, 12px)" }}>
                  <CardQuickLink icon="fa-solid fa-user-group" label="Add beneficiary" />
                  <CardQuickLink icon="fa-solid fa-file-lines" label="My documents" />
                  <CardQuickLink icon="fa-solid fa-chart-line" label="My portfolio" />
                  <CardQuickLink icon="fa-solid fa-file-invoice-dollar" label="Generate statement" />
                </div>
              </div>

              <div style={{ borderTop: "1px solid var(--theme-neutral-border-primary-default)", paddingTop: "var(--core-space-6, 24px)" }}>
                <div style={sectionLabelStyle}>Interactive states</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(5, minmax(160px, 1fr))", gap: "var(--core-space-4, 16px)" }}>
                  <div style={QUICKLINK_CELL_STYLE}>
                    <StateLabel>DEFAULT</StateLabel>
                    <CardQuickLink icon="fa-solid fa-chart-line" label="Links" />
                  </div>
                  <div className="force-hover" style={QUICKLINK_CELL_STYLE}>
                    <StateLabel>HOVER</StateLabel>
                    <CardQuickLink icon="fa-solid fa-chart-line" label="Links" />
                  </div>
                  <div style={QUICKLINK_CELL_STYLE}>
                    <StateLabel>SELECTED</StateLabel>
                    <CardQuickLink icon="fa-solid fa-chart-line" label="Links" selected />
                  </div>
                  <div className="force-focus" style={QUICKLINK_CELL_STYLE}>
                    <StateLabel>FOCUS</StateLabel>
                    <CardQuickLink icon="fa-solid fa-chart-line" label="Links" />
                  </div>
                  <div style={QUICKLINK_CELL_STYLE}>
                    <StateLabel>DISABLED</StateLabel>
                    <CardQuickLink icon="fa-solid fa-chart-line" label="Links" disabled />
                  </div>
                </div>
              </div>
            </div>
          </Preview>
        </>}
          />
        </div>
      ),
    },
  ];

  const sectionList = (
    <DocsSectionList flat={embedded}>
      {sections.map((s) => (
        <DocsSection key={s.anchorId} anchorId={s.anchorId} title={s.title}>
          {s.content}
        </DocsSection>
      ))}
    </DocsSectionList>
  );

  const cardStateStyles = (
    <style>{`
      .force-hover .cds-quicklink:not(:disabled) {
        border-color: var(--theme-neutral-border-strong) !important;
        box-shadow: var(--core-elevation-1) !important;
      }
      .force-focus .cds-quicklink:not(:disabled) {
        outline: none !important;
        border-color: var(--theme-primitive-color-primary-400) !important;
        box-shadow: 0 0 0 3px color-mix(in srgb, var(--theme-primitive-color-primary-400) 25%, transparent) !important;
      }
    `}</style>
  );

  if (embedded) {
    return (
      <>
        {cardStateStyles}
        {sectionList}
      </>
    );
  }

  return (
    <div style={{ maxWidth: 1024, margin: "0 auto", padding: "20px" }}>
      {cardStateStyles}
      <div style={{ textAlign: "center", marginBottom: 60, marginTop: 40 }}>
        <h1 style={{ fontSize: 72, fontWeight: 700, letterSpacing: "-0.06em", margin: "0 0 16px 0", color: "var(--core-color-text-primary)", lineHeight: 1.1 }}>Data Display</h1>
        <p style={{ maxWidth: 580, margin: "0 auto", color: "var(--core-color-text-tertiary)", fontSize: "var(--core-font-size-lg, 20px)", lineHeight: 1.6, fontWeight: 400 }}>
          Quick links, Badges, Tables, Avatars, and Progress meters designed for metrics and data summaries.
        </p>
      </div>
      {sectionList}
    </div>
  );
}
