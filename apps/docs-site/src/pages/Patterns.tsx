import React from "react";
import { Preview } from "../Preview";
import { Field, Input } from "../../../../packages/core/src/components/Field";
import { Button } from "../../../../packages/core/src/components/Button";
import { Card, Badge } from "../../../../packages/core/src/components/Misc";

export default function Patterns() {
  return (
    <div>
      <h1 className="site-h1">Patterns</h1>
      <p className="site-lede">Reusable compositions across products — never business logic, just proven structure.</p>

      <h2 className="site-section-title">Form layout</h2>
      <div className="site-panel site-panel--flush">
        <Preview>
          <Card style={{ minWidth: 420 }}>
            <div style={{ fontWeight: 700, marginBottom: 16 }}>Update contribution</div>
            <div style={{ display: "grid", gap: 16, marginBottom: 20 }}>
              <Field label="Contribution rate" hint="1–100% of eligible pay">{(p) => <Input {...p} defaultValue="6" />}</Field>
            </div>
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <Button variant="secondary">Cancel</Button>
              <Button variant="primary">Save</Button>
            </div>
          </Card>
        </Preview>
      </div>

      <h2 className="site-section-title">Empty state</h2>
      <div className="site-panel site-panel--flush">
        <Preview>
          <Card style={{ minWidth: 420, textAlign: "center" }}>
            <div style={{ fontWeight: 700, marginBottom: 6 }}>No transactions yet</div>
            <div style={{ fontSize: "var(--typography-body-md-size)", color: "var(--core-color-text-secondary)", marginBottom: 16 }}>
              Once you make your first contribution, it will show up here.
            </div>
            <Button variant="secondary" size="sm">Learn how contributions work</Button>
          </Card>
        </Preview>
      </div>

      <h2 className="site-section-title">Filters + result summary</h2>
      <div className="site-panel site-panel--flush">
        <Preview>
          <div style={{ display: "flex", gap: 10, alignItems: "center", width: "100%" }}>
            <Input placeholder="Search transactions" style={{ maxWidth: 220 }} />
            <Badge tone="neutral">Date: Last 90 days</Badge>
            <Badge tone="neutral">Type: All</Badge>
            <span style={{ marginLeft: "auto", fontSize: "var(--typography-font-size-xs)", color: "var(--core-color-text-secondary)" }}>24 results</span>
          </div>
        </Preview>
      </div>
    </div>
  );
}
