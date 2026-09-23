import React from "react";
import { Preview } from "../Preview";
import { DocsSection, DocsSectionList } from "../DocsSection";
import { LineChartCard } from "../../../../packages/core/src/components/Chart";

const contributionGrowth = [
  { month: "Mar", balance: 78400, contributions: 82000 },
  { month: "Apr", balance: 81200, contributions: 84500 },
  { month: "May", balance: 83950, contributions: 87000 },
  { month: "Jun", balance: 87100, contributions: 89500 },
  { month: "Jul", balance: 89800, contributions: 92000 },
  { month: "Aug", balance: 92400, contributions: 94500 },
];

export default function Charts({ embedded = false }: { embedded?: boolean }) {
  const sections = (
    <DocsSectionList flat={embedded}>
      <DocsSection anchorId="line-chart" title="Line chart">
        <div className="site-panel site-panel--flush site-panel--demo">
          <Preview showModeToggle>
            <div style={{ width: "100%", padding: 20 }}>
              <LineChartCard
                title="Balance vs. contributions, last 6 months"
                description="Account balance has tracked closely with total contributions, with a small gain from investment growth."
                data={contributionGrowth}
                xKey="month"
                series={[
                  { key: "balance", label: "Account balance" },
                  { key: "contributions", label: "Total contributions" },
                ]}
              />
            </div>
          </Preview>
        </div>
      </DocsSection>
    </DocsSectionList>
  );

  if (embedded) return sections;

  return (
    <div>
      <h1 className="site-h1">Charts &amp; Graphs</h1>
      <p className="site-lede">
        Built on <a href="https://recharts.org/" target="_blank" rel="noreferrer" style={{ color: "var(--site-accent)" }}>Recharts</a>{" "}
        (recharts.org) — an SVG-based, composable React charting library, MIT-licensed. CORE doesn't build charting
        from scratch; it wraps Recharts' primitives and owns two things: the visual layer (every color, font, and
        stroke below is a CORE token, never a Recharts default) and accessibility (see the note below).
      </p>
      {sections}
    </div>
  );
}
