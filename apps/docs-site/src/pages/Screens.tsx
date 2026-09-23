import React, { useState } from "react";
import { DocsSection, DocsSectionList } from "../DocsSection";
import { AppShell, AppHeader, AppFooter, Container, Grid, GridCol } from "../../../../packages/core/src/components/Layout";
import { AppSidebar, Breadcrumb, Stepper } from "../../../../packages/core/src/components/Navigation";
import { Button, IconButton } from "../../../../packages/core/src/components/Button";
import { Card, Badge } from "../../../../packages/core/src/components/Misc";
import { Avatar, DataTable, Progress } from "../../../../packages/core/src/components/DataDisplay";
import { AVATAR_TAYLOR } from "../avatarSamples";
import { Field, Input } from "../../../../packages/core/src/components/Field";
import { Select } from "../../../../packages/core/src/components/FormControls";
import { Icon, DescriptionList } from "../../../../packages/core/src/components/Primitives";
import { Drawer } from "../../../../packages/core/src/components/Overlays";

const NAV_ITEMS = [
  { label: "Dashboard", icon: <Icon name="fa-solid fa-grip" size="lg" />, current: true },
  { label: "Portfolio", icon: <Icon name="fa-solid fa-wallet" size="lg" /> },
  { label: "Transactions", icon: <Icon name="fa-solid fa-right-left" size="lg" /> },
  { label: "Profile", icon: <Icon name="fa-solid fa-user" size="lg" /> },
  { label: "Documents", icon: <Icon name="fa-solid fa-file-lines" size="lg" /> },
];

function ScreenHeader({ userName }: { userName: string }) {
  return (
    <AppHeader
      brand={<img src="/brand/lendguard/logo-lockup-light.svg" alt="Meridian" style={{ height: 24, display: "block" }} />}
      actions={
        <>
          <IconButton variant="tertiary" size="sm" shape="circle" aria-label="Help"><Icon name="fa-solid fa-circle-question" size="sm" /></IconButton>
          <Avatar name={userName} src={AVATAR_TAYLOR.src} size="sm" />
        </>
      }
    />
  );
}

function ScreenFooter() {
  return (
    <AppFooter
      copyright={`© ${new Date().getFullYear()} Meridian. All rights reserved.`}
      links={<><a href="#">Privacy</a><a href="#">Terms</a><a href="#">Support</a></>}
    />
  );
}

interface Txn { id: string; date: string; description: string; type: string; amount: string; status: string; }
const TRANSACTIONS: Txn[] = [
  { id: "1", date: "Feb 28, 2026", description: "Employer Contribution", type: "Contribution", amount: "$208.00", status: "Posted" },
  { id: "2", date: "Feb 14, 2026", description: "My Deferral", type: "Contribution", amount: "$412.50", status: "Posted" },
  { id: "3", date: "Jan 31, 2026", description: "Loan Repayment", type: "Loan", amount: "$150.00", status: "Posted" },
  { id: "4", date: "Jan 15, 2026", description: "Rebalance — Target Date 2050", type: "Transfer", amount: "$0.00", status: "Pending" },
  { id: "5", date: "Dec 31, 2025", description: "Employer Match", type: "Contribution", amount: "$104.00", status: "Posted" },
];

export default function Screens() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [stepIndex, setStepIndex] = useState(1);

  return (
    <div>
      <h1 className="site-h1">Screens</h1>

      <DocsSectionList>
      {/* ============================= LOGIN ============================= */}
      <DocsSection anchorId="login" title="Login">
      <div className="site-panel" data-theme="core" data-mode="light" style={{ background: "var(--core-color-bg-page)", overflowX: "auto" }}>
          <Grid columns={2} gap="4" style={{ width: 720, minHeight: 380, borderRadius: "var(--core-card-radius)", overflow: "hidden", border: "1px solid var(--core-color-border-subtle)" }}>
            <div style={{ background: "var(--core-color-brand-600, var(--core-card-bg))", color: "white", display: "flex", flexDirection: "column", justifyContent: "center", padding: "var(--core-space-8)", gridColumn: "span 1" }}>
              <div style={{ fontWeight: 700, fontSize: "var(--core-font-size-xl)", marginBottom: "var(--core-space-3)" }}>Meridian</div>
              <h2 style={{ fontSize: "var(--core-font-size-lg)", margin: 0 }}>Your retirement, on track.</h2>
              <p style={{ opacity: 0.85, fontSize: "var(--core-font-size-sm)" }}>Sign in to review your plans, contributions, and investment performance.</p>
            </div>
            <div style={{ background: "var(--core-card-bg)", display: "flex", flexDirection: "column", justifyContent: "center", padding: "var(--core-space-8)", gridColumn: "span 1" }}>
              <h2 style={{ marginTop: 0, fontSize: "var(--core-font-size-lg)" }}>Sign in</h2>
              <p style={{ fontSize: "var(--core-font-size-sm)", color: "var(--core-color-text-secondary)", marginBottom: "var(--core-space-4)" }}>Use your participant email to continue.</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--core-space-4)" }}>
                <Field label="Email">{(p) => <Input {...p} type="email" placeholder="you@email.com" />}</Field>
                <Field label="Password">{(p) => <Input {...p} type="password" placeholder="Enter password" />}</Field>
                <Button style={{ width: "100%" }}>Sign in</Button>
              </div>
            </div>
          </Grid>
      </div>

      {/* ============================= DASHBOARD ============================= */}
      </DocsSection>
      <DocsSection anchorId="dashboard" title="Dashboard">
      <div className="site-panel" data-theme="core" data-mode="light" style={{ background: "var(--core-color-bg-page)", overflowX: "auto" }}>
        <div style={{ width: 860 }}>
            <AppShell
              header={<ScreenHeader userName="Taylor Hale" />}
              sidebar={<AppSidebar items={NAV_ITEMS} variant="rail" />}
              footer={<ScreenFooter />}
            >
              <div style={{ fontSize: "var(--core-font-size-lg)", fontWeight: 700, marginBottom: "var(--core-space-6)" }}>Hi Taylor 👋</div>
              <Grid columns={12} gap="6">
                <GridCol span={12} spanMd={8}>
                  <Card style={{ marginBottom: "var(--core-space-6)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "var(--core-space-6)" }}>
                      <div>
                        <div style={{ fontSize: "var(--core-font-size-xs)", color: "var(--core-color-text-secondary)", marginBottom: "var(--core-space-2)", textTransform: "uppercase", letterSpacing: "0.04em" }}>Account balance</div>
                        <div style={{ fontSize: "var(--core-font-size-xl)", fontWeight: 700 }}>$100,416.00</div>
                      </div>
                      <div>
                        <div style={{ fontSize: "var(--core-font-size-xs)", color: "var(--core-color-text-secondary)", marginBottom: "var(--core-space-2)", textTransform: "uppercase", letterSpacing: "0.04em" }}>Vested balance</div>
                        <div style={{ fontSize: "var(--core-font-size-xl)", fontWeight: 700 }}>$92,400.00</div>
                      </div>
                      <Button variant="secondary" size="sm">View summary</Button>
                    </div>
                    <div style={{ marginTop: "var(--core-space-4)", fontSize: "var(--core-font-size-sm)", color: "var(--core-color-text-secondary)" }}>
                      Outstanding loan balance <strong style={{ color: "var(--core-color-text-primary)" }}>$0,500.00</strong>
                    </div>
                  </Card>
                  <div style={{ fontWeight: 700, fontSize: "var(--core-font-size-md)", marginBottom: "var(--core-space-4)" }}>My plans</div>
                  <Card style={{ marginBottom: "var(--core-space-6)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--core-space-4)" }}>
                      <div>
                        <div style={{ fontWeight: 600 }}>Meridian 401(k) Plan <Badge tone="info" size="sm">Participating</Badge></div>
                        <div style={{ fontSize: "var(--core-font-size-xs)", color: "var(--core-color-text-secondary)", marginTop: "var(--core-space-1)" }}>401(K) · ID 134342</div>
                      </div>
                      <Badge tone="info" size="sm">Participating</Badge>
                    </div>
                    <div style={{ background: "var(--core-color-bg-success-subtle, #e8f5e9)", borderRadius: "var(--core-radius-sm)", padding: "var(--core-space-3) var(--core-space-4)", marginBottom: "var(--core-space-4)", fontSize: "var(--core-font-size-sm)" }}>
                      Congratulations! You are enrolled in this plan. <a href="#" style={{ fontWeight: 600 }}>View details</a>
                    </div>
                    <Grid columns={2} gap="4">
                      <GridCol span={1}>
                        <Card variant="outlined">
                          <div style={{ fontSize: "var(--core-font-size-xs)", color: "var(--core-color-text-secondary)", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: "var(--core-space-1)" }}>Account Balance</div>
                          <div style={{ fontWeight: 600, marginBottom: "var(--core-space-2)" }}>Account balance</div>
                          <div style={{ fontSize: "var(--core-font-size-lg)", fontWeight: 700, color: "var(--core-color-brand-600, #3b47d6)" }}>$92,480.00</div>
                        </Card>
                      </GridCol>
                      <GridCol span={1}>
                        <Card variant="outlined">
                          <div style={{ fontSize: "var(--core-font-size-xs)", color: "var(--core-color-text-secondary)", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: "var(--core-space-1)" }}>Vested Balance</div>
                          <div style={{ fontSize: "var(--core-font-size-lg)", fontWeight: 700 }}>$29,300.00</div>
                        </Card>
                      </GridCol>
                    </Grid>
                  </Card>
                  <div style={{ fontWeight: 700, fontSize: "var(--core-font-size-md)", marginBottom: "var(--core-space-4)" }}>Quick links</div>
                  <Grid columns={3} gap="4" style={{ marginBottom: "var(--core-space-6)" }}>
                    <GridCol span={1}><Card variant="outlined"><div style={{ display: "flex", alignItems: "center", gap: "var(--core-space-3)" }}><Icon name="fa-solid fa-user-plus" size="sm" /><span style={{ fontSize: "var(--core-font-size-sm)" }}>Add beneficiary</span></div></Card></GridCol>
                    <GridCol span={1}><Card variant="outlined"><div style={{ display: "flex", alignItems: "center", gap: "var(--core-space-3)" }}><Icon name="fa-solid fa-file-lines" size="sm" /><span style={{ fontSize: "var(--core-font-size-sm)" }}>My documents</span></div></Card></GridCol>
                    <GridCol span={1}><Card variant="outlined"><div style={{ display: "flex", alignItems: "center", gap: "var(--core-space-3)" }}><Icon name="fa-solid fa-chart-line" size="sm" /><span style={{ fontSize: "var(--core-font-size-sm)" }}>My portfolio</span></div></Card></GridCol>
                  </Grid>
                </GridCol>
                <GridCol span={12} spanMd={4}>
                  <Card style={{ marginBottom: "var(--core-space-4)", background: "var(--core-color-brand-600, #2d3a8c)", color: "white", borderColor: "transparent" }}>
                    <div style={{ fontSize: "var(--core-font-size-xs)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "var(--core-space-2)", opacity: 0.85 }}>Retirement Readiness</div>
                    <div style={{ fontWeight: 600, marginBottom: "var(--core-space-3)" }}>See how your inputs affect your savings, income, risk.</div>
                  </Card>
                  <Card style={{ marginBottom: "var(--core-space-4)" }}>
                    <div style={{ fontWeight: 600, marginBottom: "var(--core-space-2)" }}>Retirement Readiness</div>
                    <Progress value={72} label="72% on track" />
                  </Card>
                  <Card style={{ marginBottom: "var(--core-space-4)" }}>
                    <div style={{ fontSize: "var(--core-font-size-xs)", textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--core-color-text-secondary)", marginBottom: "var(--core-space-2)" }}>Learning</div>
                    <div style={{ fontWeight: 600, marginBottom: "var(--core-space-2)" }}>Financial Wellness</div>
                    <div style={{ fontSize: "var(--core-font-size-sm)", color: "var(--core-color-text-secondary)" }}>Learn about planning, saving lessons.</div>
                  </Card>
                </GridCol>
              </Grid>
            </AppShell>
          </div>
      </div>

      {/* ============================= TABLE SCREEN ============================= */}
      </DocsSection>
      <DocsSection anchorId="table-screen" title="Transactions (table screen)">
      <div className="site-panel" data-theme="core" data-mode="light" style={{ background: "var(--core-color-bg-page)", overflowX: "auto" }}>
        <div style={{ width: 860 }}>
            <AppShell header={<ScreenHeader userName="Taylor Hale" />} sidebar={<AppSidebar items={[{ ...NAV_ITEMS[0], current: false }, NAV_ITEMS[1], { ...NAV_ITEMS[2], current: true }, NAV_ITEMS[3], NAV_ITEMS[4]]} variant="rail" />} footer={<ScreenFooter />}>
              <Breadcrumb items={[{ label: "Home", href: "#" }, { label: "Transactions" }]} />
              <div style={{ height: "var(--core-space-4)" }} />
              <Card>
                <DataTable<Txn>
                  columns={[
                    { key: "date", header: "Date", sortable: true },
                    { key: "description", header: "Description" },
                    { key: "type", header: "Type" },
                    { key: "amount", header: "Amount", sortable: true },
                    { key: "status", header: "Status", render: (r) => <Badge tone={r.status === "Posted" ? "success" : "warning"} size="sm">{r.status}</Badge> },
                  ]}
                  rows={TRANSACTIONS}
                  searchable
                  pageSize={5}
                />
              </Card>
            </AppShell>
          </div>
      </div>

      {/* ============================= STEPPER SCREEN ============================= */}
      </DocsSection>
      <DocsSection anchorId="stepper-screen" title="Withdrawal request (stepper screen)">
      <div className="site-panel" data-theme="core" data-mode="light" style={{ background: "var(--core-color-bg-page)", overflowX: "auto" }}>
        <div style={{ width: 860 }}>
            <AppShell header={<ScreenHeader userName="Taylor Hale" />} sidebar={<AppSidebar items={NAV_ITEMS} variant="rail" />} footer={<ScreenFooter />}>
              <Card>
                <Stepper
                  currentIndex={stepIndex}
                  steps={[
                    { label: "Withdrawal Details", status: "In progress" },
                    { label: "Allocation", status: "In progress" },
                    { label: "Review & Submit", status: "In progress" },
                  ]}
                />
                <div style={{ margin: "var(--core-space-6) 0" }}>
                  {stepIndex === 0 && (
                    <Grid columns={2} gap="4">
                      <GridCol span={1}><Field label="Withdrawal type">{(p) => <Select {...p} options={[{ value: "hardship", label: "Hardship" }, { value: "inservice", label: "In-service" }]} />}</Field></GridCol>
                      <GridCol span={1}><Field label="Amount">{(p) => <Input {...p} placeholder="$0.00" />}</Field></GridCol>
                    </Grid>
                  )}
                  {stepIndex === 1 && (
                    <DescriptionList orientation="inline" items={[
                      { term: "Requested amount", value: "$5,000.00" },
                      { term: "Federal tax withholding", value: "20%" },
                      { term: "Net amount", value: "$4,000.00" },
                    ]} />
                  )}
                  {stepIndex === 2 && <p style={{ fontSize: "var(--core-font-size-sm)", color: "var(--core-color-text-secondary)" }}>Review your request above, then submit.</p>}
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end", gap: "var(--core-space-2)" }}>
                  <Button variant="secondary" size="sm" onClick={() => setStepIndex((i) => Math.max(0, i - 1))} disabled={stepIndex === 0}>Back</Button>
                  <Button size="sm" onClick={() => setStepIndex((i) => Math.min(2, i + 1))} disabled={stepIndex === 2}>Continue</Button>
                </div>
              </Card>
            </AppShell>
          </div>
      </div>

      {/* ============================= SLIDEOVER SCREEN ============================= */}
      </DocsSection>
      <DocsSection anchorId="slideover-screen" title="Add allocation (slideover open)">
      <div className="site-panel" data-theme="core" data-mode="light" style={{ background: "var(--core-color-bg-page)", overflowX: "auto" }}>
        <div style={{ width: 860, position: "relative" }}>
            <AppShell header={<ScreenHeader userName="Taylor Hale" />} sidebar={<AppSidebar items={NAV_ITEMS} variant="rail" />} footer={<ScreenFooter />}>
              <div style={{ fontSize: "var(--core-font-size-lg)", fontWeight: 700, marginBottom: "var(--core-space-4)" }}>Hi Taylor 👋</div>
              <Button onClick={() => setDrawerOpen(true)}>Open "Add Allocation"</Button>
            </AppShell>
            <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.35)", pointerEvents: "none" }} />
            <div style={{ position: "absolute", top: 0, right: 0, bottom: 0, width: 320, background: "var(--core-card-bg)", boxShadow: "var(--core-elevation-4)", padding: "var(--core-space-6)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "var(--core-space-4)" }}>
                <div style={{ fontWeight: 600, fontSize: "var(--core-font-size-lg)" }}>Add Allocation</div>
                <IconButton variant="tertiary" size="sm" shape="circle" aria-label="Close"><Icon name="fa-solid fa-xmark" size="sm" /></IconButton>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--core-space-4)" }}>
                <Field label="Withdrawal amount">{(p) => <Input {...p} placeholder="$0.00" />}</Field>
                <DescriptionList items={[{ term: "Gross amount", value: "$0.00" }, { term: "Federal tax", value: "20%" }]} />
                <div style={{ display: "flex", gap: "var(--core-space-2)", justifyContent: "flex-end" }}>
                  <Button variant="secondary" size="sm">Cancel</Button>
                  <Button size="sm">Save</Button>
                </div>
              </div>
            </div>
          </div>
      </div>
      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} title="Add Allocation" width={360}
        actions={<><Button variant="secondary" size="sm" onClick={() => setDrawerOpen(false)}>Cancel</Button><Button size="sm" onClick={() => setDrawerOpen(false)}>Save</Button></>}
        aside={<DescriptionList items={[{ term: "Gross amount", value: "$0.00" }, { term: "Federal tax", value: "20%" }]} />}
      >
        <Field label="Withdrawal amount">{(p) => <Input {...p} placeholder="$0.00" />}</Field>
      </Drawer>

      {/* ============================= BUTTON SCREEN ============================= */}
      </DocsSection>
      <DocsSection anchorId="buttons-screen" title="Account actions (buttons screen)">
      <div className="site-panel" data-theme="core" data-mode="light" style={{ background: "var(--core-color-bg-page)", overflowX: "auto" }}>
        <div style={{ width: 860 }}>
            <AppShell header={<ScreenHeader userName="Taylor Hale" />} sidebar={<AppSidebar items={NAV_ITEMS} variant="rail" />} footer={<ScreenFooter />}>
              <Card>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--core-space-6)" }}>
                  <div style={{ fontWeight: 700, fontSize: "var(--core-font-size-lg)" }}>My Profile</div>
                  <Button>Update contribution</Button>
                </div>
                <div style={{ display: "flex", gap: "var(--core-space-2)", flexWrap: "wrap" }}>
                  <Button variant="secondary">Download statement</Button>
                  <Button variant="tertiary">View plan documents</Button>
                  <Button variant="secondary" size="sm">Edit beneficiary</Button>
                  <Button variant="destructive" style={{ marginLeft: "auto" }}>Close account</Button>
                </div>
              </Card>
            </AppShell>
          </div>
      </div>

      </DocsSection>
      <DocsSection anchorId="grid-amp-spacing-reference" title="Grid &amp; spacing reference">
      <table className="spec-table">
        <thead><tr><th>Token</th><th>Value</th><th>Used for</th></tr></thead>
        <tbody>
          <tr><td><code>space.6</code></td><td>24px</td><td>Grid column gap, main content padding</td></tr>
          <tr><td><code>space.4</code></td><td>16px</td><td>Field stack gap, header/footer vertical padding</td></tr>
          <tr><td><code>space.3</code></td><td>12px</td><td>Header vertical padding</td></tr>
          <tr><td><code>elevation.4</code></td><td>—</td><td>Slideover/Modal shadow, floats above the dimmed page</td></tr>
          <tr><td><code>color.border.subtle</code></td><td>—</td><td>Header/sidebar/footer dividers</td></tr>
          <tr><td>Grid columns</td><td>12</td><td>Base column count every screen's content area divides into</td></tr>
        </tbody>
      </table>
      </DocsSection>
      </DocsSectionList>
    </div>
  );
}
