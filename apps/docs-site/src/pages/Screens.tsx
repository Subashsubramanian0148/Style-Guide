import React from "react";
import { DocsSection, DocsSectionList } from "../DocsSection";
import { ScreenReferenceSection } from "./ScreenReference";

export default function Screens() {
  return (
    <div>
      <DocsSectionList>
        <DocsSection anchorId="screen-reference" title="Screen reference">
          <p style={{ fontSize: "var(--core-font-size-sm)", color: "var(--neutral-text-subtle)", marginTop: 0, marginBottom: "var(--core-space-6)" }}>
            Four participant-portal screens rebuilt from the design system to match the live portal. Switch any screen to
            its anatomy to see header, sidebar, content and section spacing measured from the real DOM, followed by every
            typography role, color, radius and spacing token the screen uses.
          </p>
          <ScreenReferenceSection />
        </DocsSection>
      </DocsSectionList>
    </div>
  );
}
