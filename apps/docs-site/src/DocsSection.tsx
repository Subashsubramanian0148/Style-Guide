import React from "react";
import { ComponentSectionNumber } from "./ComponentSectionNumber";
import { flatOrderForAnchor } from "./navConfig";

function formatSectionTitle(title: React.ReactNode): React.ReactNode {
  if (typeof title !== "string") return title;
  if (!title) return title;
  return title.charAt(0).toUpperCase() + title.slice(1);
}

/** State matrix label — renders ALL CAPS source as sentence case (e.g. Default). */
export function StateLabel({
  children,
  variant = "default",
}: {
  children: React.ReactNode;
  variant?: "default" | "site";
}) {
  const className = variant === "site" ? "docs-state-label docs-state-label--site" : "docs-state-label";
  return <span className={className}>{children}</span>;
}

export function DocsSectionList({
  children,
  flat = false,
}: {
  children: React.ReactNode;
  /** True on the unified /components page: collapses this wrapper's own box
   *  (display: contents) so its <DocsSection> children become direct flex
   *  items of the page's outer container instead of being trapped inside a
   *  per-category sub-list — required for the `order` each DocsSection sets
   *  on itself to actually interleave sections across category boundaries
   *  into one global A-Z sequence. Standalone category routes render this
   *  false and keep the normal boxed flex/gap layout. */
  flat?: boolean;
}) {
  return <div className={`docs-section-list${flat ? " docs-section-list--flat" : ""}`}>{children}</div>;
}

export function DocsSection({
  anchorId,
  title,
  children,
  titleStyle,
}: {
  anchorId: string;
  title: React.ReactNode;
  children: React.ReactNode;
  titleStyle?: React.CSSProperties;
}) {
  return (
    <section id={anchorId} className="docs-section" style={{ order: flatOrderForAnchor(anchorId) }}>
      <header className="docs-section__header">
        <ComponentSectionNumber anchorId={anchorId} />
        <h2 className="docs-section__title" style={titleStyle}>
          {formatSectionTitle(title)}
        </h2>
      </header>
      <div className="docs-section__content">{children}</div>
    </section>
  );
}
