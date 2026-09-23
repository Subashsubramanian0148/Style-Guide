import React from "react";
import { Button } from "../../../../packages/core/src/components/Button";
import { Card, Badge } from "../../../../packages/core/src/components/Misc";
import { Field, Input } from "../../../../packages/core/src/components/Field";
import { DocsSection, DocsSectionList } from "../DocsSection";

const themes = [
  { id: "core", label: "CORE", logo: null },
  {
    id: "meridian",
    label: "Meridian",
    logo: "/brand/lendguard/logo-lockup-light.svg",
  },
  { id: "clientb", label: "Northbridge", logo: null },
];

export default function Themes() {
  return (
    <div>
      <h1 className="site-h1">Themes</h1>
      <p className="site-lede">
        The same component code renders three brands below purely by switching a <code>data-theme</code> attribute
        at the application shell — no component forks, no duplicated logic.
      </p>

      <DocsSectionList>
        {themes.map((t) => (
          <DocsSection key={t.id} anchorId={t.id} title={t.label}>
            <div className="site-panel site-panel--flush">
              <div className="preview-surface" data-theme={t.id} data-mode="light" style={{ background: "var(--core-color-bg-page)" }}>
                {t.logo && <img src={t.logo} alt={`${t.label} logo`} style={{ height: 28, marginRight: 8 }} />}
                <Button>Primary action</Button>
                <Button variant="secondary">Secondary</Button>
                <Badge tone="success">Active</Badge>
                <Badge tone="info">Pending</Badge>
                <Card style={{ minWidth: 200 }}>
                  <div style={{ fontSize: "var(--typography-font-size-xs)", color: "var(--core-color-text-secondary)" }}>Balance</div>
                  <div style={{ fontSize: 22, fontWeight: 700, color: "var(--core-color-text-primary)" }}>$84,213</div>
                </Card>
                <Field label="Search">{(p) => <Input {...p} placeholder="Type to search" style={{ width: 180 }} />}</Field>
              </div>
            </div>
          </DocsSection>
        ))}

        <DocsSection anchorId="theme-scope" title="What a theme may change">
          <table className="spec-table">
            <thead><tr><th>Customizable</th><th>Owned by CORE</th></tr></thead>
            <tbody>
              <tr><td>Logo, brand colors, accent</td><td>Component anatomy &amp; behavior</td></tr>
              <tr><td>Font family</td><td>Accessibility &amp; interaction states</td></tr>
              <tr><td>Radius range, density</td><td>Spacing system, breakpoints</td></tr>
            </tbody>
          </table>
        </DocsSection>
      </DocsSectionList>
    </div>
  );
}
