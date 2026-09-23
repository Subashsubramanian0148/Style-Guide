import React from "react";
import primitives from "../../../../packages/tokens/src/primitives.json";
import { DocsSection, DocsSectionList } from "../DocsSection";

const bp = (primitives as any).breakpoint;
const container = (primitives as any).container;

interface Row { name: string; status: "done" | "review"; note: string; }
interface Group { title: string; rows: Row[]; }

const GROUPS: Group[] = [
  {
    title: "Actions",
    rows: [
      { name: "Button", status: "done", note: "Inline-flex, no fixed width — fluid by construction." },
      { name: "Icon Button", status: "done", note: "Fixed square, sized off control tokens — never overflows." },
      { name: "Button Group", status: "done", note: "Row of Buttons, wraps or scrolls with its container." },
    ],
  },
  {
    title: "Forms",
    rows: [
      { name: "Input / Textarea", status: "done", note: "width: 100% of container by default." },
      { name: "Select", status: "done", note: "Listbox popup clamps to viewport; trigger is fluid." },
      { name: "Checkbox / Radio", status: "done", note: "Fixed-size control + wrapping label text." },
      { name: "Switch", status: "done", note: "Fixed-size control, fluid label." },
      { name: "Input Group", status: "done", note: "Flex row of fixed-size cells with addon prefix/suffix." },
      { name: "Slider", status: "done", note: "width: 100% of container." },
      { name: "Combobox", status: "done", note: "Same fluid input + clamped popup as Select." },
      { name: "Date Picker / Calendar", status: "review", note: "7-column grid is tight under ~340px — not yet given a small-screen density adjustment." },
      { name: "Attachment", status: "done", note: "Fluid dropzone, native file input hidden underneath." },
    ],
  },
  {
    title: "Data Display",
    rows: [
      { name: "Card / Badge / Avatar / Progress / AspectRatio", status: "done", note: "Fluid by default, no fixed widths." },
      { name: "Item / Description List", status: "done", note: "Flex/grid rows that wrap." },
      { name: "Table", status: "done", note: "cds-table-wrap scrolls horizontally on overflow." },
      { name: "Data Table", status: "done", note: "Table scrolls; toolbar (search + filters) now stacks full-width below sm (fixed this pass)." },
    ],
  },
  {
    title: "Disclosure",
    rows: [
      { name: "Collapsible / Accordion / Separator / Skeleton", status: "done", note: "Fluid width, no breakpoint-sensitive layout." },
    ],
  },
  {
    title: "Navigation",
    rows: [
      { name: "Navigation Menu", status: "review", note: "A long horizontal item row has no overflow handling yet — needs the same scroll treatment Stepper got this pass." },
      { name: "App Sidebar", status: "done", note: "Shell variant collapses to icon-only below md (fixed this pass); rail/panel variants were already compact." },
      { name: "Tabs", status: "review", note: "Horizontal tab strip doesn't scroll or condense with many/long labels — same gap as Navigation Menu." },
      { name: "Stepper", status: "done", note: "Horizontal variant scrolls below sm instead of squeezing labels (fixed this pass)." },
      { name: "Pagination", status: "review", note: "No ellipsis/truncation for a large page count — fine for the typical case, not yet handled for very many pages." },
    ],
  },
  {
    title: "Feedback",
    rows: [
      { name: "Alert / Empty / Spinner", status: "done", note: "Fluid width." },
      { name: "Toast", status: "done", note: "Fixed min-width by design (a toast shouldn't stretch edge-to-edge); viewport-anchored positioning already clamps to screen." },
    ],
  },
  {
    title: "Overlays",
    rows: [
      { name: "Modal / Confirmation Dialog", status: "done", note: "Scrim now has edge padding so the modal never touches the viewport edge (fixed this pass)." },
      { name: "Drawer / Slideover", status: "done", note: "Already width: 90vw max; the aside+main split now stacks below sm instead of squeezing (fixed this pass)." },
      { name: "Dropdown Menu / Popover / Hover Card", status: "done", note: "Absolutely positioned relative to their trigger; naturally follow it." },
      { name: "Tooltip", status: "done", note: "Small, content-sized, no fixed width." },
    ],
  },
  {
    title: "Layout",
    rows: [
      { name: "Grid / GridCol", status: "done", note: "Mobile-first: full width until spanMd takes over at md." },
      { name: "Container", status: "done", note: "Fluid until each breakpoint's max-width clamps it (Bootstrap's own scale)." },
      { name: "AppShell (header/main/footer)", status: "review", note: "Header/footer padding doesn't yet reduce on small screens — usually fine since content inside is minimal, but not breakpoint-tuned." },
    ],
  },
];

const doneCount = GROUPS.flatMap((g) => g.rows).filter((r) => r.status === "done").length;
const totalCount = GROUPS.flatMap((g) => g.rows).length;

export default function Responsive() {
  return (
    <div>
      <h1 className="site-h1">Responsive &amp; Mobile</h1>
      <p className="site-lede">
        Bootstrap's own breakpoint scale — five widths, mobile-first (each rule applies at that width{" "}
        <em>and up</em>, never a max-width override fighting it back down). Every component below is audited
        against it; {doneCount} of {totalCount} groups are verified fixed today, the rest are tracked openly
        rather than left silently unaddressed.
      </p>

      <DocsSectionList>
        <DocsSection anchorId="breakpoints" title="Breakpoints">
          <div className="site-panel site-panel--flush">
            <table className="spec-table">
              <thead><tr><th>Name</th><th>Min width</th><th>Container max-width</th><th>Typical device</th></tr></thead>
              <tbody>
                <tr><td><code>xs</code></td><td>0</td><td>fluid (100%)</td><td>Phones, portrait</td></tr>
                <tr><td><code>sm</code></td><td>{bp.sm}</td><td>{container["maxWidth.sm"]}</td><td>Phones, landscape</td></tr>
                <tr><td><code>md</code></td><td>{bp.md}</td><td>{container["maxWidth.md"]}</td><td>Tablets</td></tr>
                <tr><td><code>lg</code></td><td>{bp.lg}</td><td>{container["maxWidth.lg"]}</td><td>Small laptops</td></tr>
                <tr><td><code>xl</code></td><td>{bp.xl}</td><td>{container["maxWidth.xl"]}</td><td>Desktops</td></tr>
                <tr><td><code>xxl</code></td><td>{bp.xxl}</td><td>{container["maxWidth.xxl"]}</td><td>Large desktops</td></tr>
              </tbody>
            </table>
          </div>
        </DocsSection>

        <DocsSection anchorId="component-checklist" title="Component checklist">
          {GROUPS.map((g) => (
            <div key={g.title} style={{ marginBottom: 28 }}>
              <div className="site-nav-title" style={{ padding: "0 0 8px" }}>{g.title}</div>
              <div className="site-panel site-panel--flush">
                <table className="spec-table">
                  <thead><tr><th style={{ width: 40 }}></th><th>Component</th><th>Notes</th></tr></thead>
                  <tbody>
                    {g.rows.map((r) => (
                      <tr key={r.name}>
                        <td style={{ textAlign: "center" }}>{r.status === "done" ? "✅" : "🟡"}</td>
                        <td><strong>{r.name}</strong></td>
                        <td style={{ color: "var(--site-text-dim)" }}>{r.note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </DocsSection>

        <DocsSection anchorId="do-dont" title="Do / Don't">
          <ul style={{ color: "var(--site-text-dim)", lineHeight: 1.8, fontSize: 14, margin: 0 }}>
            <li><strong style={{ color: "var(--site-text)" }}>Do</strong> write mobile-first: a component's base style is its narrowest state, and a <code>min-width</code> media query adds complexity at wider sizes — never the other way around.</li>
            <li><strong style={{ color: "var(--site-text)" }}>Do</strong> reuse the exact breakpoint values above in any new media query, with a comment naming which token it corresponds to.</li>
            <li><strong style={{ color: "var(--site-text)" }}>Don't</strong> hide content on mobile just because it doesn't fit — stack, scroll, or collapse to icon-only (as AppSidebar and Stepper do) rather than removing it.</li>
            <li><strong style={{ color: "var(--site-text)" }}>Don't</strong> assume a fixed-width overlay (Modal, Drawer) is safe without checking it at ~360-400px — that's the actual failure mode found and fixed this pass.</li>
          </ul>
        </DocsSection>
      </DocsSectionList>
    </div>
  );
}
