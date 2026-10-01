import React, { useState } from "react";
import { Preview } from "../Preview";
import { DocsSection, DocsSectionList, StateLabel } from "../DocsSection";
import { AnatomySection } from "../AnatomySection";
import { MobileNavAnatomy, PhoneFrame, MOBILE_NAV_ITEMS, MOBILE_NAV_LINKS, TabsAnatomy, SidebarAnatomy, PaginationAnatomy, StepperAnatomy, StepperStatePreview } from "../SectionAnatomies";
import { Tabs, MobileNav, Pagination, AppSidebar, Stepper, defaultStepStatus, type SidebarItem, type StepState, type StepDef } from "../../../../packages/core/src/components/Navigation";
import { Icon } from "../../../../packages/core/src/components/Primitives";

type SidebarRailState = "DEFAULT" | "HOVER" | "SELECTED" | "FOCUS" | "DISABLED";

function railSidebarItems(state: SidebarRailState): SidebarItem[] {
  const items: SidebarItem[] = [
    { label: "Dashboard", icon: <Icon name="fa-solid fa-grip" size="lg" /> },
    { label: "Portfolio", icon: <Icon name="fa-solid fa-wallet" size="lg" /> },
    { label: "Transactions", icon: <Icon name="fa-solid fa-right-left" size="lg" /> },
    { label: "Profile", icon: <Icon name="fa-solid fa-user" size="lg" /> },
    { label: "Documents", icon: <Icon name="fa-solid fa-file-lines" size="lg" /> },
  ];

  if (state === "SELECTED") {
    items[0] = { ...items[0], current: true };
  }

  if (state === "DISABLED") {
    items[3] = { ...items[3], disabled: true };
  }

  return items;
}

function StepperStatesDemo() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
        gap: "var(--core-space-4, 16px)",
      }}
    >
      <StepperStatePreview
        eyebrow="DEFAULT"
        state="default"
        title="Fees"
        description="Review fees."
        stepNumber={3}
      />
      <StepperStatePreview
        eyebrow="IN PROGRESS"
        state="in-progress"
        title="Allocation"
        description="Pick sources."
        status="In progress"
        stepNumber={2}
      />
      <StepperStatePreview
        eyebrow="COMPLETED"
        state="completed"
        title="Withdrawal"
        description="Set amount."
      />
      <StepperStatePreview
        eyebrow="WARNING"
        state="warning"
        title="Fees"
        description="Review fees."
        status="Review needed"
        stepNumber={3}
      />
      <StepperStatePreview
        eyebrow="ERROR"
        state="error"
        title="Documents"
        description="Attach forms."
        status="Required"
        stepNumber={4}
      />
    </div>
  );
}

const variantLabelStyle: React.CSSProperties = {
  fontSize: "var(--typography-label-size)",
  lineHeight: "var(--typography-label-line-height)",
  fontWeight: "var(--typography-label-weight)",
  letterSpacing: "var(--typography-label-letter-spacing)",
  color: "var(--neutral-text-default)",
  marginBottom: 2,
};

type TabDemoState = "Default" | "Hover" | "Selected" | "Focus" | "Disabled";
type TabDemoKind = "underline" | "pill" | "vertical";

const TAB_STATES: TabDemoState[] = ["Default", "Hover", "Selected", "Focus", "Disabled"];

const panelText: React.CSSProperties = {
  margin: 0,
  fontSize: "var(--typography-body-md-size)",
  lineHeight: "var(--typography-body-md-line-height)",
  color: "var(--neutral-text-subtle)",
};

/** One static tab frozen in a given state, so every state is visible at once
 *  (hover and focus are forced with a class instead of real pointer/keyboard). */
function TabStateCell({ kind, state }: { kind: TabDemoKind; state: TabDemoState }) {
  const vertical = kind === "vertical";
  const pill = kind === "pill";
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "var(--core-space-2)" }}>
      <StateLabel>{state.toUpperCase()}</StateLabel>
      <div
        role="tablist"
        aria-orientation={vertical ? "vertical" : "horizontal"}
        className={`cds-tabs ${vertical ? "cds-tabs--vertical" : ""} ${pill ? "cds-tabs--pill" : ""} ${state === "Hover" ? "tab-force-hover" : ""} ${state === "Focus" ? "tab-force-focus" : ""}`}
        style={vertical ? { minWidth: 0 } : undefined}
      >
        <button
          type="button"
          role="tab"
          tabIndex={-1}
          aria-selected={state === "Selected"}
          disabled={state === "Disabled"}
          className={`cds-tab ${vertical ? "cds-tab--vertical" : ""} ${pill ? "cds-tab--pill" : ""}`}
        >
          <span className="cds-tab-label">Overview</span>
        </button>
      </div>
    </div>
  );
}

function TabStatesRow({ kind, title }: { kind: TabDemoKind; title: string }) {
  return (
    <div>
      <div style={{ ...variantLabelStyle, marginBottom: "var(--core-space-3)" }}>{title}</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, minmax(0, 1fr))", gap: "var(--core-space-4)", alignItems: "start" }}>
        {TAB_STATES.map((st) => <TabStateCell key={st} kind={kind} state={st} />)}
      </div>
    </div>
  );
}

/** Mobile stepper — a compact segmented progress bar for the whole flow
 *  plus a focused card for just the current step, at realistic phone
 *  width. Shown once per state so every state's marker/border/status
 *  treatment is visible, matching the desktop states demo above it. */
function MobileStepperStatesDemo() {
  const flowSteps = [
    { label: "Withdrawal", description: "Set amount." },
    { label: "Allocation", description: "Pick sources." },
    { label: "Fees", description: "Review fees." },
    { label: "Documents", description: "Attach forms." },
    { label: "Review", description: "Confirm and submit." },
  ] as const;

  const cases: Array<{
    eyebrow: string;
    state: StepState;
    status?: string;
    currentIndex: number;
  }> = [
    { eyebrow: "STEP 1", state: "default", currentIndex: 0 },
    { eyebrow: "STEP 2", state: "in-progress", status: "In progress", currentIndex: 1 },
    { eyebrow: "STEP 3", state: "warning", status: "Review needed", currentIndex: 2 },
    { eyebrow: "STEP 4", state: "error", status: "Required", currentIndex: 3 },
    { eyebrow: "STEP 5", state: "in-progress", status: "In progress", currentIndex: 4 },
  ];

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--core-space-5, 20px)" }}>
      {cases.map((c) => {
        const steps: StepDef[] = flowSteps.map((step, i) => {
          if (i === c.currentIndex) {
            return { label: step.label, description: step.description, status: c.status, state: c.state };
          }
          return { label: step.label, description: step.description, state: i < c.currentIndex ? "completed" : "default" };
        });
        return (
          <div key={c.eyebrow} style={{ display: "flex", flexDirection: "column", gap: "var(--core-space-3, 12px)", width: 280 }}>
            <StateLabel>{c.eyebrow}</StateLabel>
            <Stepper orientation="mobile" currentIndex={c.currentIndex} steps={steps} />
          </div>
        );
      })}
    </div>
  );
}

type MobileNavState = "Default" | "Hover" | "Active" | "Focus" | "Disabled";
const MOBILE_NAV_STATES: MobileNavState[] = ["Default", "Hover", "Active", "Focus", "Disabled"];
const MOBILE_LINK_STATES: MobileNavState[] = ["Default", "Hover", "Active", "Focus", "Disabled"];

/** Every variant in its own phone frame, then each bar item and menu link
 *  frozen in every state (hover / focus forced with a class). */
function MobileNavDemo() {
  const [active, setActive] = useState("dashboard");
  const [link, setLink] = useState("portfolio");
  const badged = MOBILE_NAV_ITEMS.map((it) => (it.id === "settings" ? { ...it, badge: 3 } : it));
  const variants: Array<{ title: string; node: React.ReactNode }> = [
    { title: "Bar with menu (closed)", node: <MobileNav items={MOBILE_NAV_ITEMS} activeId={active} onSelect={setActive} menu={MOBILE_NAV_LINKS} activeLinkId={link} onLinkSelect={setLink} /> },
    { title: "Menu open", node: <MobileNav items={MOBILE_NAV_ITEMS} activeId="dashboard" menu={MOBILE_NAV_LINKS} menuOpen activeLinkId="portfolio" /> },
    { title: "With badge", node: <MobileNav items={badged} activeId="dashboard" menu={MOBILE_NAV_LINKS} /> },
  ];
  const stateClass = (st: MobileNavState) => (st === "Hover" ? "mnav-force-hover" : st === "Focus" ? "mnav-force-focus" : "");
  return (
    <>
      <div className="site-panel site-panel--flush site-panel--demo">
        <Preview showModeToggle>
          <div style={{ width: "100%", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "var(--core-space-6)" }}>
            {variants.map((v) => (
              <div key={v.title} style={{ display: "flex", flexDirection: "column", gap: "var(--core-space-3)" }}>
                <div style={variantLabelStyle}>{v.title}</div>
                <PhoneFrame height={400}>{v.node}</PhoneFrame>
              </div>
            ))}
          </div>
        </Preview>
      </div>
      <div className="site-panel site-panel--flush site-panel--demo">
        <Preview showModeToggle>
          <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "var(--core-space-8)" }}>
            <div style={{ ...variantLabelStyle, fontSize: "var(--typography-body-lg-size)", lineHeight: "var(--typography-body-lg-line-height)" }}>Interactive states</div>
            <div>
              <div style={{ ...variantLabelStyle, marginBottom: "var(--core-space-3)" }}>Bar item</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(5, minmax(0, 1fr))", gap: "var(--core-space-4)" }}>
                {MOBILE_NAV_STATES.map((st) => (
                  <div key={st} className={stateClass(st)} style={{ display: "flex", flexDirection: "column", gap: "var(--core-space-2)" }}>
                    <StateLabel>{st.toUpperCase()}</StateLabel>
                    <div className="cds-mobile-nav__bar" style={{ gridAutoColumns: "1fr" }}>
                      <button type="button" tabIndex={-1} className="cds-mobile-nav__item" data-active={st === "Active" || undefined} disabled={st === "Disabled"}>
                        <span className="cds-mobile-nav__icon"><Icon name="fa-solid fa-table-cells-large" size="md" /></span>
                        <span className="cds-mobile-nav__label">Dashboard</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div style={{ ...variantLabelStyle, marginBottom: "var(--core-space-3)" }}>Menu link</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "var(--core-space-4)" }}>
                {MOBILE_LINK_STATES.map((st) => (
                  <div key={st} className={stateClass(st)} style={{ display: "flex", flexDirection: "column", gap: "var(--core-space-2)" }}>
                    <StateLabel>{st.toUpperCase()}</StateLabel>
                    <div className="cds-mobile-nav__sheet" style={{ borderRadius: "var(--core-radius-sm)", boxShadow: "inset 0 0 0 var(--core-border-width-default) var(--neutral-border-light)" }}>
                      <button type="button" tabIndex={-1} className="cds-mobile-nav__link" aria-current={st === "Active" ? "page" : undefined} disabled={st === "Disabled"}>
                        <Icon name="fa-solid fa-wallet" size="md" />
                        <span>Investment portfolio</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Preview>
      </div>
      <style>{`
        .mnav-force-hover .cds-mobile-nav__item:not(:disabled) { color: var(--neutral-text-default); background: var(--neutral-surface-layer-03); }
        .mnav-force-hover .cds-mobile-nav__link:not(:disabled) { background: var(--neutral-surface-layer-03); }
        .mnav-force-focus .cds-mobile-nav__item,
        .mnav-force-focus .cds-mobile-nav__link { outline: var(--core-focusRing-width) solid var(--cds-focus-color); outline-offset: calc(var(--core-focusRing-width) * -1); }
      `}</style>
    </>
  );
}

function SidebarRailStatesDemo() {
  const states = [
    { label: "DEFAULT", className: "sidebar-state-default" },
    { label: "HOVER", className: "sidebar-state-hover" },
    { label: "SELECTED", className: "sidebar-state-selected" },
    { label: "FOCUS", className: "sidebar-state-focus" },
    { label: "DISABLED", className: "sidebar-state-disabled" },
  ] as const;

  return (
    <div className="site-panel site-panel--flush site-panel--demo">
      <Preview showModeToggle>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
            gap: "var(--core-space-4, 16px)",
          }}
        >
          {states.map(({ label, className }) => (
            <div
              key={label}
              className={className}
              style={{ display: "flex", flexDirection: "column", gap: "var(--core-space-3, 12px)", minWidth: 96 }}
            >
              <StateLabel>{label}</StateLabel>
              <AppSidebar
                variant="rail"
                aria-label={`Sidebar ${label}`}
                items={railSidebarItems(label)}
              />
            </div>
          ))}
        </div>
      </Preview>
    </div>
  );
}

export default function NavigationPage({ embedded = false }: { embedded?: boolean }) {
  const [page, setPage] = useState(3);

  const sections = (
    <DocsSectionList flat={embedded}>
      <DocsSection anchorId="mobile-nav" title="Mobile navigation">
        <AnatomySection anatomy={<MobileNavAnatomy />} demo={<MobileNavDemo />} />
      </DocsSection>

      <DocsSection anchorId="pagination" title="Pagination">
        <AnatomySection
          anatomy={<PaginationAnatomy />}
          demo={<>
        <div className="site-panel site-panel--flush site-panel--demo">
          <Preview showModeToggle>
            <Pagination page={page} pageCount={8} onChange={setPage} />
          </Preview>
        </div>
      </>}
        />
      </DocsSection>

      <DocsSection anchorId="sidebar" title="Sidebar">
        <AnatomySection anatomy={<SidebarAnatomy />} demo={<SidebarRailStatesDemo />} />
      </DocsSection>

      <DocsSection anchorId="stepper" title="Stepper">
        <AnatomySection
          anatomy={<StepperAnatomy />}
          demo={<>
        <div className="site-panel site-panel--flush site-panel--demo">
          <Preview showModeToggle>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--core-space-8, 32px)", width: "100%" }}>
              <div>
                <div style={{ ...variantLabelStyle, marginBottom: 12 }}>States</div>
                <StepperStatesDemo />
              </div>

              <div>
                <div style={{ ...variantLabelStyle, marginBottom: 12 }}>Horizontal Stepper</div>
                <Stepper
                  currentIndex={1}
                  steps={[
                    { label: "Personal" },
                    { label: "Investments" },
                    { label: "Beneficiaries" },
                    { label: "Review" },
                  ]}
                />
              </div>

              <div>
                <div style={{ ...variantLabelStyle, marginBottom: 12 }}>Vertical Stepper</div>
                <Stepper
                  orientation="vertical"
                  currentIndex={1}
                  steps={[
                    { label: "Withdrawal", description: "Set type and amount." },
                    { label: "Allocation", description: "Pick sources.", status: "In progress" },
                    { label: "Fees", description: "Review fees." },
                    { label: "Documents", description: "Attach forms." },
                    { label: "Summary", description: "Review and submit." },
                  ]}
                />
              </div>

              <div>
                <div style={{ ...variantLabelStyle, marginBottom: 12 }}>Mobile Stepper</div>
                <MobileStepperStatesDemo />
              </div>
            </div>
          </Preview>
        </div>
      </>}
        />
      </DocsSection>

      <DocsSection anchorId="tabs" title="Tabs">
        <AnatomySection
          anatomy={<TabsAnatomy />}
          demo={<>
        <div className="site-panel site-panel--flush site-panel--demo">
          <Preview showModeToggle>
            <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "var(--core-space-10)" }}>
              <div>
                <div style={{ ...variantLabelStyle, marginBottom: "var(--core-space-3)" }}>Underline (default)</div>
                <Tabs
                  items={[
                    { id: "overview", label: "Overview", content: <p style={panelText}>Account overview content.</p> },
                    { id: "transactions", label: "Transactions", content: <p style={panelText}>Transaction history content.</p> },
                    { id: "documents", label: "Documents", content: <p style={panelText}>Statements & tax forms content.</p> },
                    { id: "archived", label: "Archived", disabled: true },
                  ]}
                />
              </div>

              <div>
                <div style={{ ...variantLabelStyle, marginBottom: "var(--core-space-3)" }}>Underline with icon &amp; count</div>
                <Tabs
                  items={[
                    { id: "overview", label: "Overview", icon: "fa-solid fa-chart-line", content: <p style={panelText}>Account overview content.</p> },
                    { id: "transactions", label: "Transactions", icon: "fa-solid fa-right-left", count: 12, content: <p style={panelText}>Transaction history content.</p> },
                    { id: "documents", label: "Documents", icon: "fa-solid fa-file-lines", count: 3, content: <p style={panelText}>Statements & tax forms content.</p> },
                  ]}
                />
              </div>

              <div>
                <div style={{ ...variantLabelStyle, marginBottom: "var(--core-space-3)" }}>Pill (segmented)</div>
                <Tabs
                  variant="pill"
                  items={[
                    { id: "monthly", label: "Monthly", content: <p style={panelText}>Monthly contributions.</p> },
                    { id: "quarterly", label: "Quarterly", content: <p style={panelText}>Quarterly contributions.</p> },
                    { id: "yearly", label: "Yearly", content: <p style={panelText}>Yearly contributions.</p> },
                    { id: "custom", label: "Custom", disabled: true },
                  ]}
                />
              </div>

              <div>
                <div style={{ ...variantLabelStyle, marginBottom: "var(--core-space-3)" }}>Vertical</div>
                <Tabs
                  orientation="vertical"
                  items={[
                    { id: "personal", label: "Personal Details", content: <p style={panelText}>Personal details content.</p> },
                    { id: "bank", label: "Bank Details", content: <p style={panelText}>Bank details content.</p> },
                    { id: "employment", label: "Employment Information", content: <p style={panelText}>Employment info content.</p> },
                    { id: "beneficiary", label: "Beneficiary Details", disabled: true },
                  ]}
                />
              </div>
            </div>
          </Preview>
        </div>
        <div className="site-panel site-panel--flush site-panel--demo">
          <Preview showModeToggle>
            <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "var(--core-space-8)" }}>
              <div style={{ ...variantLabelStyle, fontSize: "var(--typography-body-lg-size)", lineHeight: "var(--typography-body-lg-line-height)" }}>Interactive states</div>
              <TabStatesRow kind="underline" title="Underline" />
              <TabStatesRow kind="pill" title="Pill" />
              <TabStatesRow kind="vertical" title="Vertical" />
            </div>
          </Preview>
        </div>
      </>}
        />
        <style>{`
          .tab-force-hover .cds-tab:not(:disabled) {
            color: var(--neutral-text-default);
            --cds-tab-indicator: var(--neutral-border-strong);
          }
          .tab-force-hover .cds-tab--vertical:not(:disabled) { background: var(--neutral-surface-layer-03); }
          .tab-force-hover .cds-tab--pill:not(:disabled) { background: color-mix(in srgb, var(--neutral-surface-layer-01) 60%, transparent); }
          .tab-force-focus .cds-tab {
            outline: var(--core-focusRing-width) solid var(--cds-focus-color);
            outline-offset: var(--core-focusRing-offset);
          }
        `}</style>
      </DocsSection>

      <style>{`
        .sidebar-state-hover .cds-app-sidebar--rail .cds-app-sidebar-link:nth-child(3):not([aria-current="page"]) {
          color: var(--brand-text-primary-default) !important;
          background: var(--brand-background-primary-subtle) !important;
        }
        .sidebar-state-focus .cds-app-sidebar--rail .cds-app-sidebar-link:nth-child(3):not([aria-current="page"]) {
          outline: var(--core-focusRing-width, 2px) solid var(--cds-focus-color) !important;
          outline-offset: -2px;
        }
      `}</style>
    </DocsSectionList>
  );

  if (embedded) return sections;

  return (
    <div>
      <h1 className="site-h1">Tabs &amp; Pagination</h1>
      <p className="site-lede">Wayfinding components — where you are, how you got here, how to move through a list.</p>
      {sections}
    </div>
  );
}
