import React from "react";
import { Preview } from "../Preview";
import { DocsSection, DocsSectionList } from "../DocsSection";
import { AnatomySection } from "../AnatomySection";
import { AppHeaderDemo, AppFooterDemo, AppHeaderAnatomy, AppFooterAnatomy } from "../SectionAnatomies";

const frame: React.CSSProperties = {
  width: "100%",
  border: "1px solid var(--core-color-border-subtle)",
  borderRadius: "var(--core-card-radius)",
  overflow: "visible",
};

export default function AppChrome({ embedded = false }: { embedded?: boolean }) {
  const sections = (
    <DocsSectionList flat={embedded}>
      <DocsSection anchorId="app-header" title="App header">
        <div className="site-panel site-panel--flush site-panel--demo">
          <AnatomySection
            anatomy={<AppHeaderAnatomy />}
            demo={
              <Preview showModeToggle>
                <div style={{ ...frame, minHeight: 320 }}>
                  <AppHeaderDemo />
                </div>
              </Preview>
            }
          />
        </div>
      </DocsSection>

      <DocsSection anchorId="app-footer" title="App footer">
        <div className="site-panel site-panel--flush site-panel--demo">
          <AnatomySection
            anatomy={<AppFooterAnatomy />}
            demo={
              <Preview showModeToggle>
                <div style={frame}>
                  <AppFooterDemo />
                </div>
              </Preview>
            }
          />
        </div>
      </DocsSection>
    </DocsSectionList>
  );

  if (embedded) return sections;

  return (
    <div>
      <h1 className="site-h1">App header &amp; footer</h1>
      <p className="site-lede">The page chrome around every portal screen — brand and account access at the top, legal links at the bottom.</p>
      {sections}
    </div>
  );
}
