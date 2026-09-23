import React from "react";
import primitives from "../../../../packages/tokens/src/primitives.json";
import { DocsSection, DocsSectionList } from "../DocsSection";

export default function Spacing() {
  const space = (primitives as any).space as Record<string, string>;
  const controls = [
    { label: "Small", h: "32px", pad: "0 12px", font: "14px" },
    { label: "Medium", h: "40px", pad: "0 16px", font: "16px" },
    { label: "Large", h: "48px", pad: "0 20px", font: "18px" },
  ];
  return (
    <div>
      <h1 className="site-h1">Spacing &amp; Sizing</h1>
      <p className="site-lede">
        A single 4px-based scale drives all layout spacing. No arbitrary values are permitted inside components.
      </p>

      <DocsSectionList>
        <DocsSection anchorId="spacing-scale" title="Spacing scale — where to use each value">
          <div className="site-panel site-panel--flush">
            <table className="spec-table">
              <thead><tr><th>Token</th><th>Value</th><th></th><th>Use for</th></tr></thead>
              <tbody>
                {[
                  { step: "1", use: "Icon-to-text gap inside a small control (e.g. inside a Badge)" },
                  { step: "2", use: "Gap between a label and its input; tight inline group gaps (e.g. Button icon+text)" },
                  { step: "3", use: "Padding inside small controls (sm Button, sm Input)" },
                  { step: "4", use: "Padding inside default controls (md Button/Input); gap between stacked form fields" },
                  { step: "5", use: "Gap between related but distinct elements (e.g. Card internal sections)" },
                  { step: "6", use: "Padding inside a Card; gap between unrelated inline items in a toolbar" },
                  { step: "8", use: "Padding inside a Modal/Drawer; gap between major sections on a docs page" },
                  { step: "10", use: "Gap between a page's title block and its first content section" },
                  { step: "12", use: "Vertical gap between top-level page sections" },
                  { step: "16", use: "Page-level top/bottom padding" },
                  { step: "20", use: "Large hero/empty-state vertical padding" },
                  { step: "24", use: "Rarely used — maximum breathing room, full-bleed hero sections only" },
                ].map(({ step, use }) => (
                  <tr key={step}>
                    <td><code>space.{step}</code></td>
                    <td style={{ fontFamily: "var(--site-mono)", fontSize: 12 }}>{space[step]}</td>
                    <td style={{ width: 120 }}><div style={{ height: 10, width: space[step], background: "var(--site-accent)", borderRadius: 3 }} /></td>
                    <td style={{ color: "var(--site-text-dim)", fontSize: "var(--typography-body-md-size)" }}>{use}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DocsSection>

        <DocsSection anchorId="control-sizes" title="Control sizes">
          <div className="site-panel" style={{ display: "flex", gap: 24 }}>
            {controls.map((c) => (
              <div key={c.label} style={{ textAlign: "center" }}>
                <div style={{ height: c.h, width: 120, background: "var(--core-color-action-primary-bg, #6952E2)", borderRadius: "var(--core-radius-sm)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "var(--typography-body-md-size)", fontWeight: 600 }}>
                  {c.label}
                </div>
                <div style={{ marginTop: 8, fontSize: 12, color: "var(--site-text-faint)", fontFamily: "var(--site-mono)" }}>height {c.h} · padding {c.pad} · text {c.font}</div>
              </div>
            ))}
          </div>
        </DocsSection>
      </DocsSectionList>
    </div>
  );
}
