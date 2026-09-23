import React, { useState } from "react";
import { DocsSection, DocsSectionList } from "../DocsSection";
import { AppHeader, AppFooter, Grid, GridCol } from "../../../../packages/core/src/components/Layout";
import type { GridGap } from "../../../../packages/core/src/components/Layout";
import { IconButton } from "../../../../packages/core/src/components/Button";
import { Avatar } from "../../../../packages/core/src/components/DataDisplay";
import { AVATAR_TAYLOR } from "../avatarSamples";
import { ChevronIcon, Icon } from "../../../../packages/core/src/components/Primitives";
import primitives from "../../../../packages/tokens/src/primitives.json";

const container = (primitives as any).container;
const layout = (primitives as any).layout;

/* ─── Shared styles for visual grid-demo blocks ─── */
const brandColors = [
  "var(--core-color-brand-200)",
  "var(--core-color-brand-400)",
  "var(--core-color-brand-300)",
  "var(--core-color-brand-500)",
  "var(--core-color-brand-100)",
  "var(--core-color-brand-600)",
];

function demoBlockStyle(colorIndex: number): React.CSSProperties {
  return {
    background: brandColors[colorIndex % brandColors.length],
    color: colorIndex % brandColors.length >= 3 ? "#fff" : "var(--core-color-brand-900)",
    textAlign: "center",
    fontSize: "var(--core-font-size-sm)",
    fontWeight: 500,
    borderRadius: "var(--core-radius-sm)",
    padding: "var(--core-space-3)",
    minHeight: 40,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };
}

const gapTokenMap: Record<string, string> = { "2": "8px", "3": "12px", "4": "16px", "6": "24px", "8": "32px" };

const columnOptions = [2, 3, 4, 6, 12] as const;
const gapOptions: GridGap[] = ["2", "3", "4", "6", "8"];

function GridPlayground() {
  const [cols, setCols] = useState<number>(3);
  const [gap, setGap] = useState<GridGap>("4");

  const spanPerCol = 12 / cols;

  return (
    <div className="site-panel" data-theme="core" data-mode="light" style={{ background: "var(--core-color-bg-page)" }}>
      <div style={{ display: "flex", gap: "var(--core-space-6)", flexWrap: "wrap", marginBottom: "var(--core-space-4)" }}>
        <label style={{ display: "flex", alignItems: "center", gap: "var(--core-space-2)", fontSize: "var(--core-font-size-sm)", fontWeight: 500 }}>
          Columns
          <select
            value={cols}
            onChange={(e) => setCols(Number(e.target.value))}
            style={{
              padding: "var(--core-space-1) var(--core-space-3)",
              borderRadius: "var(--core-radius-sm)",
              border: "1px solid var(--core-color-border-subtle)",
              fontSize: "var(--core-font-size-sm)",
              background: "var(--core-color-bg-surface)",
            }}
          >
            {columnOptions.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </label>
        <label style={{ display: "flex", alignItems: "center", gap: "var(--core-space-2)", fontSize: "var(--core-font-size-sm)", fontWeight: 500 }}>
          Gap
          <select
            value={gap}
            onChange={(e) => setGap(e.target.value as GridGap)}
            style={{
              padding: "var(--core-space-1) var(--core-space-3)",
              borderRadius: "var(--core-radius-sm)",
              border: "1px solid var(--core-color-border-subtle)",
              fontSize: "var(--core-font-size-sm)",
              background: "var(--core-color-bg-surface)",
            }}
          >
            {gapOptions.map((g) => (
              <option key={g} value={g}>gap="{g}" ({gapTokenMap[g]})</option>
            ))}
          </select>
        </label>
      </div>

      <Grid columns={12} gap={gap}>
        {Array.from({ length: cols }, (_, i) => (
          <GridCol key={i} span={spanPerCol}>
            <div style={demoBlockStyle(i)}>col-{spanPerCol}</div>
          </GridCol>
        ))}
      </Grid>
    </div>
  );
}

export default function LayoutGrid() {
  return (
    <div>
      <h1 className="site-h1">Layout &amp; Grid</h1>
      <p className="site-lede">
        The structural layer every screen is assembled from — <code>AppShell</code> (header/sidebar/main/footer),
        a 12-column <code>Grid</code>, and <code>Container</code>. Bootstrap-referenced end to end: the same
        breakpoint and container-width scale as{" "}
        <a href="#/foundations/responsive" style={{ color: "var(--site-accent)" }}>Responsive &amp; Mobile</a>.
      </p>

      <DocsSectionList>
      <DocsSection anchorId="header" title="App header">
      <div className="site-panel site-panel--flush">
        <div className="preview-surface" data-theme="core" data-mode="light" style={{ background: "var(--core-color-bg-page)", padding: 24 }}>
          <div style={{ width: "100%", maxWidth: 640, border: "1px solid var(--core-color-border-subtle)", borderRadius: "var(--core-card-radius)", overflow: "hidden" }}>
            <div className="cds-app-header">
              <AppHeader
                brand="Meridian"
                actions={<>
                  <IconButton variant="tertiary" size="sm" shape="circle" aria-label="Help"><Icon name="fa-solid fa-circle-question" size="sm" /></IconButton>
                  <Avatar name={AVATAR_TAYLOR.name} src={AVATAR_TAYLOR.src} size="sm" />
                </>}
              />
            </div>
          </div>
        </div>
      </div>

      </DocsSection>
      <DocsSection anchorId="footer" title="App footer">
      <div className="site-panel site-panel--flush">
        <div className="preview-surface" data-theme="core" data-mode="light" style={{ background: "var(--core-color-bg-page)", padding: 24 }}>
          <div style={{ width: "100%", maxWidth: 640, border: "1px solid var(--core-color-border-subtle)", borderRadius: "var(--core-card-radius)", overflow: "hidden" }}>
            <div className="cds-app-footer">
              <AppFooter copyright="© 2026 Meridian." links={<><a href="#">Privacy</a><a href="#">Terms</a></>} />
            </div>
          </div>
        </div>
      </div>

      </DocsSection>
      <DocsSection anchorId="grid" title="Grid &amp; Container">
      <div className="site-panel site-panel--flush">
        <table className="spec-table">
          <thead><tr><th>Breakpoint</th><th>Container max-width</th></tr></thead>
          <tbody>
            <tr><td>xs (fluid)</td><td>100%</td></tr>
            <tr><td>sm</td><td>{container["maxWidth.sm"]}</td></tr>
            <tr><td>md</td><td>{container["maxWidth.md"]}</td></tr>
            <tr><td>lg</td><td>{container["maxWidth.lg"]}</td></tr>
            <tr><td>xl</td><td>{container["maxWidth.xl"]}</td></tr>
            <tr><td>xxl</td><td>{container["maxWidth.xxl"]}</td></tr>
          </tbody>
        </table>
      </div>

      {/* ── Basic grid ──────────────────────────────────────────── */}
      </DocsSection>
      <DocsSection anchorId="basic-grid" title="Basic grid">
      <div className="site-panel" data-theme="core" data-mode="light" style={{ background: "var(--core-color-bg-page)" }}>
        {/* Row 1 — full width */}
        <Grid columns={12} gap="4">
          <GridCol span={12}><div style={demoBlockStyle(0)}>col-12</div></GridCol>
        </Grid>
        <div style={{ height: "var(--core-space-3)" }} />
        {/* Row 2 — halves */}
        <Grid columns={12} gap="4">
          <GridCol span={6}><div style={demoBlockStyle(0)}>col-6</div></GridCol>
          <GridCol span={6}><div style={demoBlockStyle(1)}>col-6</div></GridCol>
        </Grid>
        <div style={{ height: "var(--core-space-3)" }} />
        {/* Row 3 — thirds */}
        <Grid columns={12} gap="4">
          <GridCol span={4}><div style={demoBlockStyle(0)}>col-4</div></GridCol>
          <GridCol span={4}><div style={demoBlockStyle(1)}>col-4</div></GridCol>
          <GridCol span={4}><div style={demoBlockStyle(2)}>col-4</div></GridCol>
        </Grid>
        <div style={{ height: "var(--core-space-3)" }} />
        {/* Row 4 — quarters */}
        <Grid columns={12} gap="4">
          <GridCol span={3}><div style={demoBlockStyle(0)}>col-3</div></GridCol>
          <GridCol span={3}><div style={demoBlockStyle(1)}>col-3</div></GridCol>
          <GridCol span={3}><div style={demoBlockStyle(2)}>col-3</div></GridCol>
          <GridCol span={3}><div style={demoBlockStyle(3)}>col-3</div></GridCol>
        </Grid>
        <div style={{ height: "var(--core-space-3)" }} />
        {/* Row 5 — 2/3 + 1/3 */}
        <Grid columns={12} gap="4">
          <GridCol span={8}><div style={demoBlockStyle(0)}>col-8</div></GridCol>
          <GridCol span={4}><div style={demoBlockStyle(1)}>col-4</div></GridCol>
        </Grid>
        <div style={{ height: "var(--core-space-3)" }} />
        {/* Row 6 — equal thirds */}
        <Grid columns={12} gap="4">
          <GridCol span={4}><div style={demoBlockStyle(0)}>col-4</div></GridCol>
          <GridCol span={4}><div style={demoBlockStyle(1)}>col-4</div></GridCol>
          <GridCol span={4}><div style={demoBlockStyle(2)}>col-4</div></GridCol>
        </Grid>
      </div>

      {/* ── 2. Grid gutter ────────────────────────────────────────── */}
      </DocsSection>
      <DocsSection anchorId="grid-gutter" title="Grid gutter">
      <div className="site-panel" data-theme="core" data-mode="light" style={{ background: "var(--core-color-bg-page)", display: "flex", flexDirection: "column", gap: "var(--core-space-6)" }}>
        {(["2", "4", "6", "8"] as GridGap[]).map((g) => (
          <div key={g}>
            <p style={{ margin: 0, marginBottom: "var(--core-space-2)", fontSize: "var(--core-font-size-sm)", fontWeight: 600 }}>
              gap="{g}" <span style={{ fontWeight: 400, opacity: 0.7 }}>({gapTokenMap[g]})</span>
            </p>
            <Grid columns={12} gap={g}>
              <GridCol span={4}><div style={demoBlockStyle(0)}>col-4</div></GridCol>
              <GridCol span={4}><div style={demoBlockStyle(1)}>col-4</div></GridCol>
              <GridCol span={4}><div style={demoBlockStyle(2)}>col-4</div></GridCol>
            </Grid>
          </div>
        ))}
      </div>

      {/* ── 3. Column offset ──────────────────────────────────────── */}
      </DocsSection>
      <DocsSection anchorId="column-offset" title="Column offset">
      <div className="site-panel" data-theme="core" data-mode="light" style={{ background: "var(--core-color-bg-page)", display: "flex", flexDirection: "column", gap: "var(--core-space-4)" }}>
        {/* span 6, offset 6 */}
        <div>
          <p style={{ margin: 0, marginBottom: "var(--core-space-2)", fontSize: "var(--core-font-size-sm)", fontWeight: 600 }}>
            span 6, offset 6
          </p>
          <Grid columns={12} gap="4">
            <GridCol span={6}><div /></GridCol>
            <GridCol span={6}><div style={demoBlockStyle(1)}>col-6</div></GridCol>
          </Grid>
        </div>
        {/* span 4, offset 4 */}
        <div>
          <p style={{ margin: 0, marginBottom: "var(--core-space-2)", fontSize: "var(--core-font-size-sm)", fontWeight: 600 }}>
            span 4, offset 4
          </p>
          <Grid columns={12} gap="4">
            <GridCol span={4}><div /></GridCol>
            <GridCol span={4}><div style={demoBlockStyle(3)}>col-4</div></GridCol>
            <GridCol span={4}><div /></GridCol>
          </Grid>
        </div>
        {/* span 3, offset 3, span 3, offset 3 */}
        <div>
          <p style={{ margin: 0, marginBottom: "var(--core-space-2)", fontSize: "var(--core-font-size-sm)", fontWeight: 600 }}>
            span 3 offset 3 + span 3 offset 3
          </p>
          <Grid columns={12} gap="4">
            <GridCol span={3}><div /></GridCol>
            <GridCol span={3}><div style={demoBlockStyle(0)}>col-3</div></GridCol>
            <GridCol span={3}><div /></GridCol>
            <GridCol span={3}><div style={demoBlockStyle(2)}>col-3</div></GridCol>
          </Grid>
        </div>
      </div>

      {/* ── 4. Responsive behavior ────────────────────────────────── */}
      </DocsSection>
      <DocsSection anchorId="responsive-behavior" title="Responsive behavior">
      <div className="site-panel" data-theme="core" data-mode="light" style={{ background: "var(--core-color-bg-page)", display: "flex", flexDirection: "column", gap: "var(--core-space-4)" }}>
        <div>
          <p style={{ margin: 0, marginBottom: "var(--core-space-2)", fontSize: "var(--core-font-size-sm)", fontWeight: 600 }}>
            span=12 spanMd=6 — full-width → halves
          </p>
          <Grid columns={12} gap="4">
            <GridCol span={12} spanMd={6}><div style={demoBlockStyle(0)}>col-12 / md:col-6</div></GridCol>
            <GridCol span={12} spanMd={6}><div style={demoBlockStyle(1)}>col-12 / md:col-6</div></GridCol>
          </Grid>
        </div>
        <div>
          <p style={{ margin: 0, marginBottom: "var(--core-space-2)", fontSize: "var(--core-font-size-sm)", fontWeight: 600 }}>
            span=12 spanMd=4 — full-width → thirds
          </p>
          <Grid columns={12} gap="4">
            <GridCol span={12} spanMd={4}><div style={demoBlockStyle(0)}>col-12 / md:col-4</div></GridCol>
            <GridCol span={12} spanMd={4}><div style={demoBlockStyle(1)}>col-12 / md:col-4</div></GridCol>
            <GridCol span={12} spanMd={4}><div style={demoBlockStyle(2)}>col-12 / md:col-4</div></GridCol>
          </Grid>
        </div>
        <div>
          <p style={{ margin: 0, marginBottom: "var(--core-space-2)", fontSize: "var(--core-font-size-sm)", fontWeight: 600 }}>
            Mixed — sidebar/main flip at md
          </p>
          <Grid columns={12} gap="4">
            <GridCol span={12} spanMd={8}><div style={demoBlockStyle(0)}>col-12 / md:col-8</div></GridCol>
            <GridCol span={12} spanMd={4}><div style={demoBlockStyle(3)}>col-12 / md:col-4</div></GridCol>
          </Grid>
        </div>
      </div>

      {/* ── 5. Interactive playground ─────────────────────────────── */}
      </DocsSection>
      <DocsSection anchorId="interactive-playground" title="Interactive playground">
      <GridPlayground />

      {/* ═══════════════════════════════════════════════════════════════
           COMMON PAGE LAYOUTS — real-world patterns from the product
           ═══════════════════════════════════════════════════════════════ */}
      </DocsSection>
      <DocsSection anchorId="layout-login" title="Login / Onboarding — 50 · 50">
      <div className="site-panel" data-theme="core" data-mode="light" style={{ background: "var(--core-color-bg-page)", padding: 0, overflow: "hidden", borderRadius: "var(--core-radius-md)" }}>
        <Grid columns={12} gap="2" style={{ gap: 0 }}>
          <GridCol span={12} spanMd={6}>
            <div style={{
              background: "linear-gradient(135deg, var(--core-color-brand-700), var(--core-color-brand-900))",
              color: "#fff",
              padding: "var(--core-space-8)",
              minHeight: 220,
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              gap: "var(--core-space-2)",
            }}>
              <div style={{ fontSize: "var(--core-font-size-xs)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", opacity: 0.7 }}>span 6 · Brand hero</div>
              <div style={{ fontSize: "var(--core-font-size-lg)", fontWeight: 700 }}>Your Path To A Confident Retirement.</div>
              <div style={{ fontSize: "var(--core-font-size-sm)", opacity: 0.8 }}>Access your 401(k), deferrals, and retirement tools in one secure portal.</div>
            </div>
          </GridCol>
          <GridCol span={12} spanMd={6}>
            <div style={{
              background: "var(--core-color-surface-raised)",
              padding: "var(--core-space-8)",
              minHeight: 220,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: "var(--core-space-4)",
            }}>
              <div style={{ fontSize: "var(--core-font-size-xs)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--core-color-text-tertiary)" }}>span 6 · Sign-in form</div>
              <div style={{ fontSize: "var(--core-font-size-lg)", fontWeight: 700, color: "var(--core-color-text-primary)" }}>Sign in</div>
              <div style={{ height: 36, borderRadius: "var(--core-radius-sm)", border: "1px solid var(--core-color-border-default)", background: "var(--core-color-surface-default)", padding: "0 var(--core-space-3)", display: "flex", alignItems: "center", color: "var(--core-color-text-tertiary)", fontSize: "var(--core-font-size-sm)" }}>you@email.com</div>
              <div style={{ height: 36, borderRadius: "var(--core-radius-sm)", border: "1px solid var(--core-color-border-default)", background: "var(--core-color-surface-default)", padding: "0 var(--core-space-3)", display: "flex", alignItems: "center", color: "var(--core-color-text-tertiary)", fontSize: "var(--core-font-size-sm)" }}>Enter password</div>
              <div style={{ height: 36, borderRadius: "var(--core-radius-sm)", background: "var(--core-color-action-primary-bg)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 600, fontSize: "var(--core-font-size-sm)" }}>Sign in</div>
            </div>
          </GridCol>
        </Grid>
      </div>
      <div className="site-panel site-panel--flush" style={{ marginTop: 8 }}>
        <table className="spec-table">
          <thead><tr><th>Column</th><th>Span</th><th>Content</th></tr></thead>
          <tbody>
            <tr><td>Left</td><td>span 6 (50%)</td><td>Brand hero — gradient background, logo, tagline, marketing copy</td></tr>
            <tr><td>Right</td><td>span 6 (50%)</td><td>Auth form — email, password, submit button, links</td></tr>
          </tbody>
        </table>
      </div>

      {/* ── Pattern 2: Dashboard — 8/4 main + sidebar ─── */}
      </DocsSection>
      <DocsSection anchorId="layout-dashboard-summary" title="Dashboard summary — 8 · 4">
      <div className="site-panel" data-theme="core" data-mode="light" style={{ background: "var(--core-color-bg-page)" }}>
        <Grid columns={12} gap="4">
          <GridCol span={12} spanMd={8}>
            <div style={{
              background: "var(--core-color-surface-raised)",
              borderRadius: "var(--core-radius-md)",
              padding: "var(--core-space-6)",
              minHeight: 140,
              border: "1px solid var(--core-color-border-subtle)",
            }}>
              <div style={{ fontSize: "var(--core-font-size-xs)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--core-color-text-tertiary)", marginBottom: "var(--core-space-3)" }}>span 8 · Summary card</div>
              <div style={{ display: "flex", gap: "var(--core-space-8)", flexWrap: "wrap" }}>
                <div>
                  <div style={{ fontSize: "var(--core-font-size-xs)", color: "var(--core-color-text-secondary)" }}>Account balance</div>
                  <div style={{ fontSize: "var(--core-font-size-xl)", fontWeight: 700, color: "var(--core-color-text-primary)" }}>$14,590.00</div>
                </div>
                <div>
                  <div style={{ fontSize: "var(--core-font-size-xs)", color: "var(--core-color-text-secondary)" }}>Vested balance</div>
                  <div style={{ fontSize: "var(--core-font-size-xl)", fontWeight: 700, color: "var(--core-color-text-primary)" }}>$13,870.00</div>
                </div>
              </div>
            </div>
          </GridCol>
          <GridCol span={12} spanMd={4}>
            <div style={{
              background: "var(--core-promoCard-bg, linear-gradient(135deg, var(--core-color-brand-600), var(--core-color-brand-800)))",
              borderRadius: "var(--core-radius-md)",
              padding: "var(--core-space-6)",
              minHeight: 140,
              color: "#fff",
            }}>
              <div style={{ fontSize: "var(--core-font-size-xs)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", opacity: 0.8 }}>span 4 · Promo card</div>
              <div style={{ fontSize: "var(--core-font-size-md)", fontWeight: 700, margin: "var(--core-space-2) 0" }}>Retirement Readiness</div>
              <div style={{ fontSize: "var(--core-font-size-sm)", opacity: 0.85 }}>See how your inputs affect your savings.</div>
            </div>
          </GridCol>
        </Grid>
      </div>
      <div className="site-panel site-panel--flush" style={{ marginTop: 8 }}>
        <table className="spec-table">
          <thead><tr><th>Column</th><th>Span</th><th>Content</th></tr></thead>
          <tbody>
            <tr><td>Main</td><td>span 8 (67%)</td><td>Account balance, vested balance, key metrics, "View summary" action</td></tr>
            <tr><td>Aside</td><td>span 4 (33%)</td><td>Promotional card — gradient background, CTA (e.g. Retirement Readiness)</td></tr>
          </tbody>
        </table>
      </div>

      {/* ── Pattern 3: Dashboard plans — 4/4/4 ─── */}
      </DocsSection>
      <DocsSection anchorId="layout-dashboard-plans" title="Dashboard plans — 4 · 4 · 4">
      <div className="site-panel" data-theme="core" data-mode="light" style={{ background: "var(--core-color-bg-page)" }}>
        <Grid columns={12} gap="4">
          {["401(k) Plan", "Roth 401(k) Plan", "Financial Wellness"].map((name, i) => (
            <GridCol key={name} span={12} spanMd={4}>
              <div style={{
                background: i === 2 ? "var(--core-promoCard-bg, linear-gradient(135deg, var(--core-color-brand-600), var(--core-color-brand-800)))" : "var(--core-color-surface-raised)",
                borderRadius: "var(--core-radius-md)",
                padding: "var(--core-space-5)",
                minHeight: 100,
                border: i === 2 ? "none" : "1px solid var(--core-color-border-subtle)",
                color: i === 2 ? "#fff" : "var(--core-color-text-primary)",
              }}>
                <div style={{ fontSize: "var(--core-font-size-xs)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", opacity: 0.6, marginBottom: "var(--core-space-2)" }}>span 4</div>
                <div style={{ fontSize: "var(--core-font-size-md)", fontWeight: 700 }}>{name}</div>
                <div style={{ fontSize: "var(--core-font-size-sm)", opacity: 0.7, marginTop: "var(--core-space-1)" }}>{i === 2 ? "Learning module" : "Plan card"}</div>
              </div>
            </GridCol>
          ))}
        </Grid>
      </div>

      {/* ── Pattern 4: Dashboard — 6/6 halves ─── */}
      </DocsSection>
      <DocsSection anchorId="layout-dashboard-halves" title="Dashboard cards — 6 · 6">
      <div className="site-panel" data-theme="core" data-mode="light" style={{ background: "var(--core-color-bg-page)" }}>
        <Grid columns={12} gap="4">
          {["Deferred Comp Plan", "Cash Balance Plan"].map((name) => (
            <GridCol key={name} span={12} spanMd={6}>
              <div style={{
                background: "var(--core-color-surface-raised)",
                borderRadius: "var(--core-radius-md)",
                padding: "var(--core-space-5)",
                minHeight: 80,
                border: "1px solid var(--core-color-border-subtle)",
              }}>
                <div style={{ fontSize: "var(--core-font-size-xs)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--core-color-text-tertiary)", marginBottom: "var(--core-space-2)" }}>span 6</div>
                <div style={{ fontSize: "var(--core-font-size-md)", fontWeight: 700, color: "var(--core-color-text-primary)" }}>{name}</div>
                <div style={{ fontSize: "var(--core-font-size-sm)", color: "var(--core-color-text-secondary)", marginTop: "var(--core-space-1)" }}>Plan details, balance, status</div>
              </div>
            </GridCol>
          ))}
        </Grid>
      </div>

      {/* ── Pattern 5: Multi-step form — 3/9 ─── */}
      </DocsSection>
      <DocsSection anchorId="layout-form-stepper" title="Multi-step form — 3 · 9">
      <div className="site-panel" data-theme="core" data-mode="light" style={{ background: "var(--core-color-bg-page)" }}>
        <Grid columns={12} gap="4">
          <GridCol span={12} spanMd={3}>
            <div style={{
              background: "var(--core-color-surface-raised)",
              borderRadius: "var(--core-radius-md)",
              padding: "var(--core-space-5)",
              minHeight: 200,
              border: "1px solid var(--core-color-border-subtle)",
              display: "flex",
              flexDirection: "column",
              gap: "var(--core-space-3)",
            }}>
              <div style={{ fontSize: "var(--core-font-size-xs)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--core-color-text-tertiary)" }}>span 3 · Stepper</div>
              {["Loan Details", "Payment & Fee", "Upload Docs", "Summary"].map((step, i) => (
                <div key={step} style={{ display: "flex", alignItems: "center", gap: "var(--core-space-2)" }}>
                  <div style={{
                    width: 22, height: 22, borderRadius: "50%",
                    background: i === 0 ? "var(--core-color-action-primary-bg)" : "var(--core-color-surface-sunken)",
                    color: i === 0 ? "#fff" : "var(--core-color-text-secondary)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "var(--typography-font-size-xs)", fontWeight: 700,
                  }}>{i + 1}</div>
                  <span style={{ fontSize: "var(--core-font-size-sm)", fontWeight: i === 0 ? 600 : 400, color: i === 0 ? "var(--core-color-action-primary-bg)" : "var(--core-color-text-secondary)" }}>{step}</span>
                </div>
              ))}
            </div>
          </GridCol>
          <GridCol span={12} spanMd={9}>
            <div style={{
              background: "var(--core-color-surface-raised)",
              borderRadius: "var(--core-radius-md)",
              padding: "var(--core-space-6)",
              minHeight: 200,
              border: "1px solid var(--core-color-border-subtle)",
            }}>
              <div style={{ fontSize: "var(--core-font-size-xs)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--core-color-text-tertiary)", marginBottom: "var(--core-space-4)" }}>span 9 · Form content</div>
              <div style={{ fontSize: "var(--core-font-size-md)", fontWeight: 700, color: "var(--core-color-text-primary)", marginBottom: "var(--core-space-4)" }}>Loan Details</div>
              <Grid columns={12} gap="4">
                <GridCol span={12} spanMd={6}>
                  <div style={{ fontSize: "var(--core-font-size-sm)", fontWeight: 600, color: "var(--core-color-text-primary)", marginBottom: "var(--core-space-1)" }}>Select Loan type *</div>
                  <div style={{ height: 36, borderRadius: "var(--core-radius-sm)", border: "1px solid var(--core-color-border-default)", background: "var(--core-color-surface-default)", padding: "0 var(--core-space-3)", display: "flex", alignItems: "center", color: "var(--core-color-text-tertiary)", fontSize: "var(--core-font-size-sm)" }}>Select</div>
                </GridCol>
                <GridCol span={12} spanMd={6}>
                  <div style={{ fontSize: "var(--core-font-size-sm)", fontWeight: 600, color: "var(--core-color-text-primary)", marginBottom: "var(--core-space-1)" }}>Reason for loan</div>
                  <div style={{ height: 36, borderRadius: "var(--core-radius-sm)", border: "1px solid var(--core-color-border-default)", background: "var(--core-color-surface-default)", padding: "0 var(--core-space-3)", display: "flex", alignItems: "center", color: "var(--core-color-text-tertiary)", fontSize: "var(--core-font-size-sm)" }}>e.g. Educational purpose</div>
                </GridCol>
              </Grid>
            </div>
          </GridCol>
        </Grid>
      </div>
      <div className="site-panel site-panel--flush" style={{ marginTop: 8 }}>
        <table className="spec-table">
          <thead><tr><th>Column</th><th>Span</th><th>Content</th></tr></thead>
          <tbody>
            <tr><td>Left</td><td>span 3 (25%)</td><td>Step navigation — numbered steps, current step highlighted, progress state</td></tr>
            <tr><td>Right</td><td>span 9 (75%)</td><td>Form body — fields, validation, nested 6/6 grid for side-by-side inputs</td></tr>
          </tbody>
        </table>
      </div>

      {/* ── Pattern 6: Form fields — nested 6/6 ─── */}
      </DocsSection>
      <DocsSection anchorId="layout-form-fields" title="Form fields — 6 · 6 (nested)">
      <div className="site-panel" data-theme="core" data-mode="light" style={{ background: "var(--core-color-bg-page)" }}>
        <div style={{ background: "var(--core-color-surface-raised)", borderRadius: "var(--core-radius-md)", padding: "var(--core-space-6)", border: "1px solid var(--core-color-border-subtle)" }}>
          <Grid columns={12} gap="4">
            <GridCol span={12} spanMd={6}>
              <div style={{ fontSize: "var(--core-font-size-sm)", fontWeight: 600, color: "var(--core-color-text-primary)", marginBottom: "var(--core-space-1)" }}>Loan repayment method *</div>
              <div style={{ fontSize: "var(--core-font-size-xs)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--core-color-text-tertiary)", marginBottom: "var(--core-space-2)" }}>span 6</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--core-space-2)" }}>
                {["Payroll deduction", "Direct payment", "Both"].map((opt, i) => (
                  <label key={opt} style={{ display: "flex", alignItems: "center", gap: "var(--core-space-2)", fontSize: "var(--core-font-size-sm)", color: "var(--core-color-text-primary)" }}>
                    <div style={{ width: 16, height: 16, borderRadius: "50%", border: i === 0 ? "5px solid var(--core-color-action-primary-bg)" : "2px solid var(--core-color-border-default)", background: "var(--core-color-surface-default)" }} />
                    {opt}
                  </label>
                ))}
              </div>
            </GridCol>
            <GridCol span={12} spanMd={6}>
              <div style={{ fontSize: "var(--core-font-size-sm)", fontWeight: 600, color: "var(--core-color-text-primary)", marginBottom: "var(--core-space-1)" }}>Loan repayment frequency *</div>
              <div style={{ fontSize: "var(--core-font-size-xs)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--core-color-text-tertiary)", marginBottom: "var(--core-space-2)" }}>span 6</div>
              <div style={{ height: 36, borderRadius: "var(--core-radius-sm)", border: "1px solid var(--core-color-border-default)", background: "var(--core-color-surface-default)", padding: "0 var(--core-space-3)", display: "flex", alignItems: "center", justifyContent: "space-between", color: "var(--core-color-text-primary)", fontSize: "var(--core-font-size-sm)" }}>
                Monthly <ChevronIcon size={12} style={{ color: "var(--core-color-text-tertiary)" }} />
              </div>
            </GridCol>
          </Grid>
        </div>
      </div>

      {/* ── Summary table ─── */}
      </DocsSection>
      <DocsSection anchorId="layout-summary" title="Layout cheat sheet">
      <div className="site-panel site-panel--flush">
        <table className="spec-table">
          <thead><tr><th>Pattern</th><th>Grid split</th><th>When to use</th></tr></thead>
          <tbody>
            <tr><td><strong>Login / Onboarding</strong></td><td>6 · 6</td><td>Full-bleed auth pages — brand panel + form, no shell</td></tr>
            <tr><td><strong>Dashboard summary</strong></td><td>8 · 4</td><td>Primary content area + promotional/contextual sidebar card</td></tr>
            <tr><td><strong>Dashboard cards</strong></td><td>4 · 4 · 4</td><td>Equal-weight tiles — plans, modules, feature cards</td></tr>
            <tr><td><strong>Dashboard halves</strong></td><td>6 · 6</td><td>Two equally weighted content blocks — plan cards, comparisons</td></tr>
            <tr><td><strong>Multi-step form</strong></td><td>3 · 9</td><td>Stepper/nav sidebar + form body — wizards, enrollment, loan requests</td></tr>
            <tr><td><strong>Form fields</strong></td><td>6 · 6 (nested)</td><td>Side-by-side inputs inside a form — related field pairs</td></tr>
          </tbody>
        </table>
      </div>

      </DocsSection>
      <DocsSection anchorId="code" title="Code">
      <div className="site-panel site-panel--flush">
        <pre style={{ margin: 0, padding: 20, fontSize: "var(--typography-font-size-xs)", overflowX: "auto" }}>{`<AppShell
  header={<AppHeader brand="Meridian" actions={<Avatar name={AVATAR_TAYLOR.name} src={AVATAR_TAYLOR.src} size="sm" />} />}
  sidebar={<AppSidebar items={navItems} />}
  footer={<AppFooter copyright="© 2026 Meridian." links={<a href="/privacy">Privacy</a>} />}
>
  <Grid columns={12} gap="6">
    <GridCol span={12} spanMd={8}>...</GridCol>
    <GridCol span={12} spanMd={4}>...</GridCol>
  </Grid>
</AppShell>`}</pre>
      </div>
      </DocsSection>
      </DocsSectionList>
    </div>
  );
}
