import React, { useState } from "react";
import { Preview } from "../Preview";
import { DocsSection, DocsSectionList, StateLabel } from "../DocsSection";
import { AnatomySection } from "../AnatomySection";
import { TabsAnatomy, SidebarAnatomy, PaginationAnatomy } from "../SectionAnatomies";
import { Tabs, Pagination, AppSidebar, Stepper, defaultStepStatus, type SidebarItem, type StepState, type StepDef } from "../../../../packages/core/src/components/Navigation";
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

function StepperStatePreview({
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
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--core-space-3, 12px)", minWidth: 0 }}>
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
  color: "var(--theme-neutral-text-primary-default)",
  marginBottom: 2,
};

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
      </DocsSection>

      <DocsSection anchorId="tabs" title="Tabs">
        <AnatomySection
          anatomy={<TabsAnatomy />}
          demo={<>
        <div className="site-panel site-panel--flush site-panel--demo">
          <Preview showModeToggle>
            <div style={{ width: "100%" }}>
              <Tabs
                items={[
                  { id: "overview", label: "Overview", content: <p style={{ fontSize: 14, color: "var(--core-color-text-secondary)" }}>Account overview content.</p> },
                  { id: "transactions", label: "Transactions", content: <p style={{ fontSize: 14, color: "var(--core-color-text-secondary)" }}>Transaction history content.</p> },
                  { id: "documents", label: "Documents", content: <p style={{ fontSize: 14, color: "var(--core-color-text-secondary)" }}>Statements & tax forms content.</p> },
                ]}
              />
            </div>
          </Preview>
        </div>
        <div className="site-panel site-panel--flush site-panel--demo">
          <Preview showModeToggle>
            <Tabs
              orientation="vertical"
              items={[
                { id: "personal", label: "Personal Details", content: <p style={{ fontSize: 14, color: "var(--core-color-text-secondary)", margin: 0 }}>Personal details content.</p> },
                { id: "bank", label: "Bank Details", content: <p style={{ fontSize: 14, color: "var(--core-color-text-secondary)", margin: 0 }}>Bank details content.</p> },
                { id: "employment", label: "Employment Information", content: <p style={{ fontSize: 14, color: "var(--core-color-text-secondary)", margin: 0 }}>Employment info content.</p> },
                { id: "beneficiary", label: "Beneficiary Details", content: <p style={{ fontSize: 14, color: "var(--core-color-text-secondary)", margin: 0 }}>Beneficiary details content.</p> },
              ]}
            />
          </Preview>
        </div>
      </>}
        />
      </DocsSection>

      <style>{`
        .sidebar-state-hover .cds-app-sidebar--rail .cds-app-sidebar-link:nth-child(3):not([aria-current="page"]) {
          color: var(--brand-text-primary-default) !important;
          background: var(--theme-brand-background-primary-subtle) !important;
        }
        .sidebar-state-focus .cds-app-sidebar--rail .cds-app-sidebar-link:nth-child(3):not([aria-current="page"]) {
          outline: var(--core-focusRing-width, 2px) solid var(--theme-primitive-color-primary-400) !important;
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
