import React from "react";
import { Link } from "react-router-dom";
import { DocsSection, DocsSectionList } from "../DocsSection";
import "./grid.css";

/** Grid — the layout grids the Screen reference screens use, read from the
 *  portal's own CSS (Satish0024/S_PPT, journey-retirement) and measured on
 *  the live portal at 1440 × 1000 and 390 × 844. */

type Col = { label: string; px: number };
type GridDef = {
  id: string;
  name: string;
  cls: string;
  screens: Array<[string, string]>;
  columns: string;
  gap: string;
  desktop: Col[];
  gapPx: number;
  below: string;
  note?: string;
};

const unit = (n: number) => `calc(var(--core-space-1) * ${n})`;

const GRIDS: GridDef[] = [
  {
    id: "dashboard-layout", name: "Dashboard layout", cls: ".dash-layout",
    screens: [["Dashboard", "dashboard"]],
    columns: "7fr 3fr", gap: "--core-space-5 · 20px", gapPx: 20,
    desktop: [{ label: "Main · 7fr", px: 882 }, { label: "Side · 3fr", px: 378 }],
    below: "≤ 980px: one column. The side column (Retirement readiness, Enrich) moves below the main column.",
  },
  {
    id: "plan-cards", name: "Plan cards", cls: ".plans-grid",
    screens: [["Dashboard", "dashboard"]],
    columns: "repeat(2, minmax(0, 1fr))", gap: "--core-space-4 · 16px", gapPx: 16,
    desktop: [{ label: "1fr", px: 433 }, { label: "1fr", px: 433 }],
    below: "≤ 980px: one column.",
  },
  {
    id: "quick-links", name: "Quick links", cls: ".quick-grid",
    screens: [["Dashboard", "dashboard"]],
    columns: "repeat(4, minmax(0, 1fr))", gap: "--core-space-3 · 12px", gapPx: 12,
    desktop: [1, 2, 3, 4].map(() => ({ label: "1fr", px: 211.5 })),
    below: "≤ 980px: one column.",
  },
  {
    id: "readiness-layout", name: "Retirement readiness layout", cls: ".rg-shell",
    screens: [["Retirement readiness", "retirement-readiness"]],
    columns: "minmax(0, 7fr) minmax(0, 3fr)", gap: "--core-space-6 · 24px", gapPx: 24,
    desktop: [{ label: "Inputs · 7fr", px: 879 }, { label: "Live result · 3fr", px: 377 }],
    below: "≤ 980px: one column. The order becomes inputs first, then the live result card, which stops being sticky.",
  },
  {
    id: "readiness-inputs", name: "Readiness input panels", cls: ".rg-work",
    screens: [["Retirement readiness", "retirement-readiness"]],
    columns: "minmax(0, 1fr) minmax(0, 1fr)", gap: "--core-space-4 · 16px", gapPx: 16,
    desktop: [{ label: "Retirement target", px: 432 }, { label: "Deferrals", px: 432 }],
    below: "≤ 980px: one column.",
  },
  {
    id: "side-nav-layout", name: "Side nav + panel", cls: ".pr-shell",
    screens: [["Plan details", "plan-details"], ["Beneficiaries", "beneficiaries"], ["Add beneficiary", "bene-basic"]],
    columns: `${unit(60)} minmax(0, 1fr)`, gap: "--core-space-5 · 20px", gapPx: 20,
    desktop: [{ label: "Nav / steps · 240px", px: 240 }, { label: "Panel · 1fr", px: 1020 }],
    below: "≤ 980px: one column. The section nav (or steps card) sits above the panel.",
  },
  {
    id: "account-summary-layout", name: "Plan list + balances", cls: ".as-shell",
    screens: [["Account summary", "account-summary"]],
    columns: `minmax(${unit(65)}, ${unit(75)}) minmax(0, 1fr)`, gap: "--core-space-5 · 20px", gapPx: 20,
    desktop: [{ label: "Plans · 260–300px", px: 300 }, { label: "Balance panel · 1fr", px: 960 }],
    below: "≤ 980px: one column.",
  },
  {
    id: "portfolio-overview", name: "Portfolio overview", cls: ".overview-row",
    screens: [["Investment portfolio", "portfolio"]],
    columns: `minmax(${unit(60)}, ${unit(70)}) minmax(0, 1fr)`, gap: "--core-space-4 · 16px", gapPx: 16,
    desktop: [{ label: "Summary · 240–280px", px: 280 }, { label: "Chart · 1fr", px: 984 }],
    below: "≤ 980px: one column. The summary card sits above the chart.",
  },
  {
    id: "chart-legend", name: "Chart legend", cls: ".legend-row",
    screens: [["Investment portfolio", "portfolio"]],
    columns: "repeat(3, minmax(0, 1fr))", gap: "--core-space-1 / --core-space-3 · 4px / 12px", gapPx: 12,
    desktop: [1, 2, 3].map(() => ({ label: "1fr", px: 309 })),
    below: "≤ 980px: two columns · ≤ 640px: one column.",
  },
  {
    id: "enrollment-choices", name: "Enrollment choices", cls: ".choice-list",
    screens: [["Enrollment flow", "enrollment"]],
    columns: `repeat(auto-fit, minmax(${unit(60)}, 1fr))`, gap: "--core-space-3 · 12px", gapPx: 12,
    desktop: [{ label: "≥ 240px · 1fr", px: 486 }, { label: "≥ 240px · 1fr", px: 486 }],
    below: "Auto-fit: as many columns of at least 240px as fit, so one column on a phone.",
  },
  {
    id: "enrollment-layout", name: "Enrollment steps + detail", cls: ".steps + .detail-body",
    screens: [["Enrollment flow", "enrollment"]],
    columns: `${unit(70)} 1fr (flex row)`, gap: "none · the panels share a border", gapPx: 0,
    desktop: [{ label: "Steps · 280px", px: 280 }, { label: "Detail · 1fr", px: 1064 }],
    below: "≤ 640px: the steps become a horizontal row above the detail (gap --core-space-1, padding 12 / 16); the detail padding drops to 16 / 16 / 32.",
    note: "The detail padding is --core-space-8 / --core-space-10 / --core-space-12 (32 / 40 / 48) on desktop.",
  },
  {
    id: "document-row", name: "Document row", cls: ".doc-row",
    screens: [["Documents", "documents"]],
    columns: "minmax(0, 1fr) auto auto", gap: "--core-space-3 · 12px", gapPx: 12,
    desktop: [{ label: "Name · 1fr", px: 784 }, { label: "Plan · auto", px: 342 }, { label: "Action · auto", px: 95 }],
    below: "≤ 980px: one column; the row gap tightens to --core-space-2 (8px).",
  },
  {
    id: "form-field", name: "Form field", cls: ".pr-field",
    screens: [["Add beneficiary", "bene-basic"]],
    columns: `${unit(33)} minmax(0, ${unit(90)})`, gap: "--core-space-2 / --core-space-4 · 8px / 16px", gapPx: 16,
    desktop: [{ label: "Label · 132px", px: 132 }, { label: "Input · ≤ 360px", px: 360 }],
    below: "≤ 640px: one column, label above the input, gap --core-space-1 (4px).",
    note: "The field row stops at 132 + 16 + 360 = 508px and doesn't stretch across the whole panel.",
  },
];

const PAGE_PADDING: Array<[string, string, string]> = [
  ["> 980px", "--core-space-6 · --core-space-8 · --core-space-12", "24 · 32 · 48"],
  ["≤ 980px", "--core-space-5 · --core-space-4 · --core-space-10", "20 · 16 · 40"],
  ["≤ 640px", "--core-space-4 · --core-space-4 · --core-space-8", "16 · 16 · 32"],
];

const BREAKPOINTS: Array<[string, string]> = [
  ["1150px", "The enrollment two-column detail grid (1fr + 360px) goes to one column. The three enrollment steps shown here already use the single-column body."],
  ["980px", "Every two-column layout grid becomes one column; page padding drops to 20 / 16 / 40; the legend goes to two columns."],
  ["760px", "Documents filters stack full width."],
  ["640px", "Phone layout: the sidebar rail becomes the bottom MobileNav; page padding 16 / 16 / 32; form labels stack above inputs; the legend goes to one column."],
  ["420px", "The Dashboard balance header stacks and View summary goes full width."],
];


/* ---------- Layout grid overlay (12 columns + 8px rhythm + modules) ---------- */
type Box = [number, number, number, number]; // x, y, w, h at 1440 × 1000
type Overlay = {
  id: string; title: string; screens: Array<[string, string]>; top: number; bottom: number; footerY: number; activeNav: number;
  side: { region: Box; rows: Box[]; label: string };
  main: { region: Box; cells: Box[]; label: string };
  note: string;
};

/** App chrome measured on the live portal at 1440 × 1000. */
const HEADER_H = 56, RAIL_W = 96, FOOTER_H = 48;
const RAIL_ITEMS: Array<[number, number]> = [[72, 68], [148, 84], [240, 68], [316, 68], [392, 84]];
const CONTENT_X = 128, CONTENT_W = 1280, COLS = 12, GUTTER = 20;
const COL_W = (CONTENT_W - GUTTER * (COLS - 1)) / COLS;

const OVERLAYS: Overlay[] = [
  {
    id: "dashboard", title: "Dashboard", screens: [["Dashboard", "dashboard"]], top: 0, bottom: 1686, footerY: 1638, activeNav: 0,
    main: {
      label: "Main · 7fr · 882px", region: [128, 148, 882, 1442],
      cells: [[128, 148, 882, 257], [128, 473, 433, 372], [577, 473, 433, 372], [128, 861, 433, 250], [577, 861, 433, 250],
        [128, 1179, 212, 72], [352, 1179, 212, 72], [575, 1179, 212, 72], [799, 1179, 212, 72], [128, 1319, 882, 271]],
    },
    side: { label: "Side · 3fr · 378px", region: [1030, 148, 378, 483], rows: [[1030, 148, 378, 291], [1030, 455, 378, 176]] },
    note: "7fr · 3fr with a 20px gap. Plan cards sit on a 2-column grid (16px gap), quick links on a 4-column grid (12px gap).",
  },
  {
    id: "readiness", title: "Retirement readiness", screens: [["Retirement readiness", "retirement-readiness"]], top: 0, bottom: 1048, footerY: 1000, activeNav: 0,
    main: {
      label: "Inputs · 7fr · 879px", region: [128, 180, 879, 596],
      cells: [[145, 233, 398, 79], [145, 320, 398, 66], [145, 394, 398, 111], [145, 513, 398, 111], [145, 632, 398, 127],
        [593, 197, 320, 64], [593, 373, 398, 90], [593, 479, 398, 90], [593, 585, 398, 78]],
    },
    side: { label: "Live result · 3fr · 377px", region: [1031, 180, 377, 582], rows: [[1052, 205, 335, 277], [1052, 498, 335, 181], [1052, 695, 335, 46]] },
    note: "7fr · 3fr with a 24px gap. The inputs split into two equal panels (16px gap); target cards stack with an 8px gap.",
  },
  {
    id: "side-nav", title: "Side nav + panel", screens: [["Beneficiaries", "beneficiaries"], ["Plan details", "plan-details"], ["Add beneficiary", "bene-basic"]], top: 0, bottom: 1048, footerY: 1000, activeNav: 3,
    side: { label: "Nav · 240px", region: [128, 176, 240, 338], rows: [[141, 189, 214, 56], [141, 249, 214, 56], [141, 309, 214, 64], [141, 377, 214, 64], [141, 445, 214, 56]] },
    main: { label: "Panel · 1fr (max 760px)", region: [388, 176, 760, 315], cells: [[409, 197, 718, 40], [409, 253, 718, 46], [409, 299, 718, 57], [409, 356, 718, 57], [409, 413, 718, 57]] },
    note: "240px · 1fr with a 20px gap. Nav items stack with a 4px gap inside 12px padding; the panel stops at 760px.",
  },
];

/** How many 12-column grid columns (20px gutters) a width covers. */
function spanOf(w: number) {
  return Math.round(((w + GUTTER) / (COL_W + GUTTER)) * 10) / 10;
}

function LayoutOverlay({ o }: { o: Overlay }) {
  const h = o.bottom - o.top;
  const lines = [];
  for (let y = o.top; y <= o.bottom; y += 8) lines.push(y);
  return (
    <figure className="grid-overlay">
      <svg viewBox={`0 ${o.top} 1440 ${h}`} role="img" aria-label={`${o.title} layout on the 12-column grid`}>
        <rect className="go-page" x={RAIL_W} y={HEADER_H} width={1440 - RAIL_W} height={o.footerY - HEADER_H} />
        {Array.from({ length: COLS }, (_, i) => (
          <rect key={i} className="go-col" x={CONTENT_X + i * (COL_W + GUTTER)} y={HEADER_H} width={COL_W} height={o.footerY - HEADER_H} />
        ))}
        {lines.filter((y) => y > HEADER_H && y < o.footerY).map((y) => <line key={y} className="go-line" x1={RAIL_W} x2={1440} y1={y} y2={y} />)}
        <rect className="go-margin" x={RAIL_W} y={HEADER_H} width={CONTENT_X - RAIL_W} height={o.footerY - HEADER_H} />
        <rect className="go-margin" x={CONTENT_X + CONTENT_W} y={HEADER_H} width={1440 - CONTENT_X - CONTENT_W} height={o.footerY - HEADER_H} />
        <rect className="go-main" x={o.main.region[0]} y={o.main.region[1]} width={o.main.region[2]} height={o.main.region[3]} />
        {o.main.cells.map(([x, y, w, ch], i) => <rect key={i} className="go-cell" x={x} y={y} width={w} height={ch} />)}
        <rect className="go-side" x={o.side.region[0]} y={o.side.region[1]} width={o.side.region[2]} height={o.side.region[3]} />
        {o.side.rows.map(([x, y, w, rh], i) => <rect key={i} className="go-row" x={x} y={y} width={w} height={rh} />)}

        {/* Header */}
        <rect className="go-chrome" x={0} y={0} width={1440} height={HEADER_H} />
        <rect className="go-chrome-item" x={24} y={12} width={178} height={32} />
        <rect className="go-chrome-item" x={1294} y={10} width={122} height={36} />
        <text className="go-text" x={720} y={HEADER_H / 2}>Header · 56px · full width</text>
        {/* Sidebar rail */}
        <rect className="go-chrome" x={0} y={HEADER_H} width={RAIL_W} height={o.bottom - HEADER_H} />
        {RAIL_ITEMS.map(([y, rh], i) => (
          <rect key={y} className={i === o.activeNav ? "go-chrome-item go-chrome-item--on" : "go-chrome-item"} x={0} y={y} width={RAIL_W - 1} height={rh} />
        ))}
        <rect className="go-chrome-item" x={6} y={946} width={83} height={38} />
        <text className="go-text go-text--v" x={RAIL_W / 2} y={(492 + 946) / 2} transform={`rotate(-90 ${RAIL_W / 2} ${(492 + 946) / 2})`}>Sidebar rail · 96px</text>
        {/* Footer */}
        <rect className="go-chrome" x={RAIL_W} y={o.footerY} width={1440 - RAIL_W} height={FOOTER_H} />
        <rect className="go-chrome-item" x={120} y={o.footerY + 16} width={111} height={16} />
        <rect className="go-chrome-item" x={1325} y={o.footerY + 12} width={91} height={24} />
        <text className="go-text" x={(RAIL_W + 1440) / 2} y={o.footerY + FOOTER_H / 2}>Footer · 48px · padding 8 / 24</text>
        {/* Page padding markers */}
        <text className="go-text go-text--pad" x={(RAIL_W + CONTENT_X) / 2} y={HEADER_H + 12}>32</text>
        <text className="go-text go-text--pad" x={(CONTENT_X + CONTENT_W + 1440) / 2} y={HEADER_H + 12}>32</text>
      </svg>
      <figcaption className="grid-overlay__cap">
        <div className="grid-overlay__head">
          <h3 className="grid-card__title">{o.title}</h3>
          <span className="grid-overlay__used">Used in <ScreenLinks screens={o.screens} /></span>
        </div>
        <ul className="grid-overlay__keys">
          <li><i className="go-key go-key--main" />{o.main.label} · spans ≈ {spanOf(o.main.region[2])} columns</li>
          <li><i className="go-key go-key--side" />{o.side.label} · spans ≈ {spanOf(o.side.region[2])} columns</li>
        </ul>
        <p className="grid-overlay__note">{o.note}</p>
      </figcaption>
    </figure>
  );
}

function GridDiagram({ g }: { g: GridDef }) {
  return (
    <div className="grid-demo" style={{ gap: g.gapPx ? `var(--core-space-${g.gapPx / 4})` : 0 }}>
      {g.desktop.map((c, i) => (
        <div key={i} className="grid-demo__col" style={{ flexGrow: c.px, flexBasis: 0 }}>
          <span className="grid-demo__label">{c.label}</span>
          <span className="grid-demo__px">{Math.round(c.px)}px</span>
        </div>
      ))}
    </div>
  );
}

function ScreenLinks({ screens }: { screens: Array<[string, string]> }) {
  return (
    <>
      {screens.map(([label, id], i) => (
        <React.Fragment key={id + label}>
          {i > 0 && ", "}
          <Link to={`/screens#screen-ref-${id}`}>{label}</Link>
        </React.Fragment>
      ))}
    </>
  );
}

export default function Grid() {
  return (
    <div>
      <DocsSectionList>
        <DocsSection anchorId="layout-grid" title="Layout grid">
          <p className="grid-intro">
            Each screen drawn with its app chrome (header, sidebar rail, footer) and laid on CORE's 12-column grid (<code>Grid</code>, <code>columns=12</code>) across the 1280px content area at 1440px,
            with 20px gutters (<code>--core-space-5</code>, the portal's layout gap). The thin lines mark the 8px rhythm (<code>--core-space-2</code>).
            Green is the side column, broken into its stacked rows; purple is the main area, broken into its cards. Every box is measured from the
            live portal and drawn to scale.
          </p>
          <ul className="grid-overlay__legend">
            <li><i className="go-key go-key--chrome" />Header 56px · sidebar rail 96px · footer 48px</li>
            <li><i className="go-key go-key--margin" />Page margin 32px</li>
            <li><i className="go-key go-key--col" />12 columns · 88px · 20px gutter</li>
            <li><i className="go-key go-key--line" />8px rhythm</li>
            <li><i className="go-key go-key--side" />Side column · rows</li>
            <li><i className="go-key go-key--main" />Main area · cards</li>
          </ul>
          <div className="grid-list">
            {OVERLAYS.map((o) => <LayoutOverlay key={o.id} o={o} />)}
          </div>
          <p className="grid-intro grid-intro--after">
            The portal sizes its layouts with <code>fr</code> units and fixed widths rather than column spans, so a module can
            land part-way across a column (for example, the 240px nav covers about 2.4 columns). The overlay shows where each one
            actually lands; use <code>Grid</code> / <code>GridCol</code> spans when you need modules to snap to columns.
          </p>
        </DocsSection>

        <DocsSection anchorId="page-grid" title="Page grid">
          <p className="grid-intro">
            Every Screen reference screen sits in the same shell: a 56px header, a 96px sidebar rail and a page body
            whose padding steps down at two breakpoints. Sections inside the page body stack with a
            <code> --core-space-5</code> (20px) gap. All values below are measured on the live portal at 1440 × 1000 and 390 × 844.
          </p>
          <div className="grid-shell" aria-hidden="true">
            <div className="grid-shell__header">Header · 56px · --core-layout-header-height</div>
            <div className="grid-shell__body">
              <div className="grid-shell__rail">Rail<br />96px</div>
              <div className="grid-shell__page">
                <span className="grid-shell__pad">padding 24 · 32 · 48</span>
                <div className="grid-shell__content">Content · 1280px at 1440 wide (1440 − 96 rail − 2 × 32)</div>
                <div className="grid-shell__content grid-shell__content--short">Section gap 20px</div>
              </div>
            </div>
          </div>
          <div className="grid-table-card">
            <table className="grid-table">
              <thead><tr><th>Viewport</th><th>Page padding (top · sides · bottom)</th><th>Pixels</th></tr></thead>
              <tbody>
                {PAGE_PADDING.map(([v, t, px]) => (
                  <tr key={v}><td>{v}</td><td><code>{t}</code></td><td>{px}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </DocsSection>

        <DocsSection anchorId="breakpoints" title="Breakpoints">
          <div className="grid-table-card">
            <table className="grid-table">
              <thead><tr><th>Max width</th><th>What changes</th></tr></thead>
              <tbody>
                {BREAKPOINTS.map(([bp, what]) => (
                  <tr key={bp}><td><code>{bp}</code></td><td>{what}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </DocsSection>

        <DocsSection anchorId="screen-grids" title="Grids used in screens">
          <p className="grid-intro">
            Each grid shows its column template and gap exactly as the portal CSS defines them, built from CORE tokens, with the
            column widths measured at 1440px. The diagram is drawn to scale.
          </p>
          <div className="grid-list">
            {GRIDS.map((g) => (
              <article key={g.id} id={`grid-${g.id}`} className="grid-card">
                <header className="grid-card__head">
                  <h3 className="grid-card__title">{g.name}</h3>
                  <code className="grid-card__cls">{g.cls}</code>
                </header>
                <GridDiagram g={g} />
                <dl className="grid-card__facts">
                  <div><dt>Columns</dt><dd><code>{g.columns}</code></dd></div>
                  <div><dt>Gap</dt><dd><code>{g.gap}</code></dd></div>
                  <div><dt>Smaller screens</dt><dd>{g.below}</dd></div>
                  <div><dt>Used in</dt><dd><ScreenLinks screens={g.screens} /></dd></div>
                  {g.note && <div><dt>Note</dt><dd>{g.note}</dd></div>}
                </dl>
              </article>
            ))}
          </div>
        </DocsSection>
      </DocsSectionList>
    </div>
  );
}
