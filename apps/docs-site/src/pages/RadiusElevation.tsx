import React from "react";
import primitives from "../../../../packages/tokens/src/primitives.json";
import { DocsSection, DocsSectionList } from "../DocsSection";

export default function RadiusElevation() {
  const radius = (primitives as any).radius as Record<string, string>;
  const elevation = (primitives as any).elevation as Record<string, string>;
  return (
    <div>
      <h1 className="site-h1">Radius &amp; Elevation</h1>
      <p className="site-lede">
        Client themes may shift the permitted radius range (Meridian runs soft/rounded, Northbridge runs sharp),
        but the token names and elevation scale stay fixed.
      </p>

      <DocsSectionList>
        <DocsSection anchorId="radius" title="Radius">
          <div className="site-panel site-grid cols-4">
            {Object.entries(radius).map(([step, val]) => (
              <div key={step} style={{ textAlign: "center" }}>
                <div style={{ height: 70, background: "var(--site-accent-soft)", border: "1px solid var(--site-accent)", borderRadius: val === "9999px" ? "9999px" : val }} />
                <div style={{ marginTop: 8, fontSize: 12, fontFamily: "var(--site-mono)" }}>radius.{step} · {val}</div>
              </div>
            ))}
          </div>
        </DocsSection>

        <DocsSection anchorId="elevation" title="Elevation">
          <div className="site-panel site-grid cols-4" data-theme="core" data-mode="light" style={{ background: "var(--core-color-bg-page)" }}>
            {Object.entries(elevation).filter(([k]) => k !== "0").map(([step, val]) => (
              <div key={step} style={{ textAlign: "center" }}>
                <div style={{ height: 70, background: "var(--core-color-bg-canvas)", borderRadius: "var(--core-radius-md)", boxShadow: val, border: "1px solid var(--core-color-border-subtle)" }} />
                <div style={{ marginTop: 8, fontSize: 12, fontFamily: "var(--site-mono)", color: "var(--core-color-text-secondary)" }}>elevation.{step}</div>
              </div>
            ))}
          </div>
        </DocsSection>

        <DocsSection anchorId="elevation-usage" title="Elevation — exact values &amp; usage">
          <div className="site-panel site-panel--flush">
            <table className="spec-table">
              <thead><tr><th>Token</th><th>Offset Y / Blur / Spread</th><th>Opacity</th><th>CSS value</th><th>Use for</th></tr></thead>
              <tbody>
                <tr>
                  <td><code>elevation.1</code></td>
                  <td>1px / 2px / 0 <br />+ 1px / 1px / 0</td>
                  <td>6% / 4%</td>
                  <td style={{ fontFamily: "var(--site-mono)", fontSize: "var(--typography-font-size-xs)" }}>{elevation["1"]}</td>
                  <td>Resting cards, table rows — the default Card shadow.</td>
                </tr>
                <tr>
                  <td><code>elevation.2</code></td>
                  <td>2px / 6px / 0 <br />+ 1px / 2px / 0</td>
                  <td>8% / 5%</td>
                  <td style={{ fontFamily: "var(--site-mono)", fontSize: "var(--typography-font-size-xs)" }}>{elevation["2"]}</td>
                  <td>Hovered interactive cards, raised buttons on press-release.</td>
                </tr>
                <tr>
                  <td><code>elevation.3</code></td>
                  <td>8px / 16px / 0 <br />+ 2px / 4px / 0</td>
                  <td>10% / 6%</td>
                  <td style={{ fontFamily: "var(--site-mono)", fontSize: "var(--typography-font-size-xs)" }}>{elevation["3"]}</td>
                  <td>Popovers, dropdown menus, select listboxes, tooltips — anything floating above content.</td>
                </tr>
                <tr>
                  <td><code>elevation.4</code></td>
                  <td>16px / 32px / 0 <br />+ 4px / 8px / 0</td>
                  <td>14% / 8%</td>
                  <td style={{ fontFamily: "var(--site-mono)", fontSize: "var(--typography-font-size-xs)" }}>{elevation["4"]}</td>
                  <td>Modal, Drawer/Slideover — the highest layer, above a scrim.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </DocsSection>
      </DocsSectionList>
    </div>
  );
}
