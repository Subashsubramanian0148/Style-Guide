import React from "react";
import { Preview } from "../Preview";
import { Anatomy, AnatomyLegend } from "../Anatomy";
import { Button, IconButton } from "../../../../packages/core/src/components/Button";
import { ButtonMatrix } from "../ButtonMatrix";
import { ComponentStateMatrix, DEFAULT_MATRIX_STATES } from "../ComponentStateMatrix";
import { DocsSection, DocsSectionList, StateLabel } from "../DocsSection";
import { AnatomySection } from "../AnatomySection";
import { ButtonAnatomy } from "../ButtonAnatomy";

const EditIcon = ({ size }: { size: "sm" | "md" | "lg" }) => {
  const px = size === "sm" ? 16 : size === "lg" ? 24 : 20;
  return (
    <svg width={px} height={px} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
  );
};

export default function Actions({ embedded = false }: { embedded?: boolean }) {
  const sections = [
    {
      anchorId: "button",
      title: "Buttons",
      content: <AnatomySection demo={<ButtonMatrix />} anatomy={<ButtonAnatomy />} />,
    },
    {
      anchorId: "icon-button",
      title: "Icon Button",
      content: (
        <div className="site-panel site-panel--flush site-panel--demo">
          <ComponentStateMatrix
            columns={[
              { id: "secondary", label: "Secondary" },
              { id: "tertiary", label: "Tertiary" },
            ]}
            states={DEFAULT_MATRIX_STATES}
            sizes={[
              { id: "sm", label: "Small" },
              { id: "md", label: "Medium" },
              { id: "lg", label: "Large" },
            ]}
            defaultSize="md"
            columnMinWidth={140}
            orientation="rows"
            renderCell={({ columnId, stateKey, size }) => {
              const variant = columnId as "secondary" | "tertiary";
              const wrapperClass = stateKey === "hover" ? "force-hover" : stateKey === "active" ? "force-active" : stateKey === "focused" ? "force-focus" : undefined;
              return (
                <div className={wrapperClass} style={{ display: "inline-flex" }}>
                  <IconButton
                    variant={variant}
                    size={size as "sm" | "md" | "lg"}
                    disabled={stateKey === "disabled"}
                    aria-label={`Edit (${stateKey})`}
                  >
                    <EditIcon size={size as "sm" | "md" | "lg"} />
                  </IconButton>
                </div>
              );
            }}
          />
          <style>{`
            /* Mirrors the real .cds-icon-btn--secondary/--tertiary hover/active CSS
               (components.css) so this "forced state" demo never drifts from what
               actually renders on real hover/active. */
            .force-hover .cds-icon-btn--secondary { background: color-mix(in srgb, var(--theme-brand-background-primary-strong) 12%, transparent); color: var(--theme-brand-text-primary-hover); border-color: var(--theme-brand-border-primary-hover); }
            .force-hover .cds-icon-btn--tertiary { background: color-mix(in srgb, var(--theme-brand-background-primary-strong) 8%, transparent); color: var(--theme-brand-text-primary-hover); }
            .force-active .cds-icon-btn--secondary { background: color-mix(in srgb, var(--theme-brand-background-primary-strong) 24%, transparent); color: var(--theme-brand-text-primary-active); border-color: var(--theme-brand-border-primary-hover); transform: translateY(1px); }
            .force-active .cds-icon-btn--tertiary { background: color-mix(in srgb, var(--theme-brand-background-primary-strong) 16%, transparent); color: var(--theme-brand-text-primary-active); transform: translateY(1px); }
            .force-focus .cds-icon-btn { outline: var(--core-focusRing-width) solid var(--theme-primitive-color-primary-400); outline-offset: 2px; }
          `}</style>
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
      {/* Centered Hero Header — matching Logo and Typography sections */}
      <div style={{ textAlign: "center", marginBottom: 60, marginTop: 40 }}>
        <h1
          style={{
            fontSize: 72,
            fontWeight: 700,
            letterSpacing: "-0.06em",
            margin: "0 0 16px 0",
            color: "var(--core-color-text-primary)",
            lineHeight: 1.1,
          }}
        >
          Button
        </h1>
        <p
          style={{
            maxWidth: 580,
            margin: "0 auto",
            color: "var(--core-color-text-tertiary)",
            fontSize: 18,
            lineHeight: 1.6,
            fontWeight: 400,
          }}
        >
          Primary, Secondary, Tertiary, Outlines, and Semantic hierarchy. Direct Color Palette SCSS tokens across all interactive states.
        </p>
      </div>

      {sectionList}
    </div>
  );
}
