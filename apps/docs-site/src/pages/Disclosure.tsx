import React, { useState } from "react";
import { Preview } from "../Preview";
import { DocsSection, DocsSectionList } from "../DocsSection";
import {
  Accordion,
  Separator,
  Skeleton,
} from "../../../../packages/core/src/components/Disclosure";
import { AnatomySection } from "../AnatomySection";
import { AccordionAnatomyFull } from "../LegacyAnatomyTables";
import { SeparatorAnatomy, SeparatorCard } from "../SectionAnatomies";
import { SkeletonAnatomy, SkeletonCard } from "../SectionAnatomies";

function AccordionVariantsDemo() {
  const [variant, setVariant] = useState<"bordered" | "separated" | "flush">("bordered");

  const faqItems = [
    {
      id: "vesting",
      title: "What is vesting?",
      content: "Vesting is the schedule by which you gain full ownership of employer contributions to your account over a 3-year cliff or graded period.",
    },
    {
      id: "loans",
      title: "Can I take a loan against my balance?",
      content: "Yes, subject to your plan rules — typically up to 50% of your vested balance, up to a statutory maximum of $50,000.",
    },
    {
      id: "rollover",
      title: "How do I roll over a previous 401(k)?",
      content: "Initiate a direct rollover under Accounts → Add Account → Rollover to maintain tax-deferred compounding without withholding.",
    },
    {
      id: "locked",
      title: "Plan-specific executive deferrals (not eligible)",
      content: "",
      disabled: true,
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Variant Switcher Toolbar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          background: "var(--site-bg-elevated)",
          border: "1px solid var(--site-border)",
          borderRadius: 12,
          padding: "var(--core-space-3) var(--core-space-4)",
          boxShadow: "var(--core-elevation-1)",
        }}
      >
        <span
          style={{
            fontSize: "var(--typography-font-size-xs)",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            color: "var(--site-text-dim)",
          }}
        >
          Style:
        </span>
        <div
          style={{
            display: "inline-flex",
            background: "var(--site-bg)",
            borderRadius: 8,
            padding: "var(--core-space-1)",
            border: "1px solid var(--site-border)",
          }}
        >
          {(["bordered", "separated", "flush"] as const).map((v) => {
            const labels = { bordered: "Bordered (Default)", separated: "Separated (Card)", flush: "Flush (Minimal)" };
            return (
              <button
                key={v}
                type="button"
                onClick={() => setVariant(v)}
                style={{
                  border: "none",
                  background: variant === v ? "var(--theme-brand-background-primary-strong)" : "transparent",
                  color: variant === v ? "var(--brand-text-primary-oncolor)" : "var(--site-text)",
                  borderRadius: "var(--core-radius-sm)",
                  padding: "var(--core-space-1) var(--core-space-3)",
                  fontSize: "var(--typography-font-size-xs)",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 120ms ease",
                }}
              >
                {labels[v]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Preview Surface */}
      <div className="site-panel site-panel--flush site-panel--demo">
        <Preview showModeToggle>
          <div style={{ maxWidth: 640, margin: "0 auto", width: "100%" }}>
            <Accordion
              variant={variant}
              defaultOpenIds={["vesting"]}
              items={faqItems}
            />
          </div>
        </Preview>
      </div>
    </div>
  );
}

export default function DisclosurePage({ embedded = false }: { embedded?: boolean }) {
  const sections = [
    {
      id: "01",
      anchorId: "accordion",
      title: "Accordion",
      content: (
        <AnatomySection demo={<AccordionVariantsDemo />} anatomy={<AccordionAnatomyFull />} />
      ),
    },
    {
      id: "02",
      anchorId: "separator",
      title: "Separator",
      content: (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div className="site-panel site-panel--flush site-panel--demo">
          <AnatomySection
            anatomy={<SeparatorAnatomy />}
            demo={<>
            <Preview showModeToggle>
              <SeparatorCard />
            </Preview>
          </>}
          />
        </div>
        </div>
      ),
    },
    {
      id: "03",
      anchorId: "skeleton",
      title: "Skeleton",
      content: (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div className="site-panel site-panel--flush site-panel--demo">
          <AnatomySection
            anatomy={<SkeletonAnatomy />}
            demo={<>
            <Preview showModeToggle>
              <SkeletonCard />
            </Preview>
          </>}
          />
        </div>
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

  if (embedded) return sectionList;

  return (
    <div style={{ maxWidth: 1024, margin: "0 auto", padding: "20px" }}>
      <div style={{ textAlign: "center", marginBottom: 60, marginTop: 40 }}>
        <h1 style={{ fontSize: 72, fontWeight: 700, letterSpacing: "-0.06em", margin: "0 0 16px 0", color: "var(--core-color-text-primary)", lineHeight: 1.1 }}>Disclosure</h1>
        <p style={{ maxWidth: 580, margin: "0 auto", color: "var(--core-color-text-tertiary)", fontSize: "var(--core-font-size-lg, 20px)", lineHeight: 1.6, fontWeight: 400 }}>
          Progressive disclosure with accordions, separators, and loading skeleton placeholders.
        </p>
      </div>
      {sectionList}
    </div>
  );
}
