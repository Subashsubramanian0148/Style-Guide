import React from "react";
import { Link } from "react-router-dom";
import { DocsSection, DocsSectionList } from "../DocsSection";
import { Tabs } from "../../../../packages/core/src/components/Navigation";
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
    columns: "repeat(12, minmax(0, 1fr)) · main span 8 · side span 4", gap: "--core-space-5 · 20px", gapPx: 20,
    desktop: [{ label: "Main · 8 columns", px: 847 }, { label: "Side · 4 columns", px: 413 }],
    below: "≤ 980px: one column. The side column (Retirement readiness, Enrich) moves below the main column.",
  },
  {
    id: "plan-cards", name: "Plan cards", cls: ".plans-grid",
    screens: [["Dashboard", "dashboard"]],
    columns: "repeat(2, minmax(0, 1fr)) · 4 columns each", gap: "--core-space-5 · 20px (column) · --core-space-4 · 16px (row)", gapPx: 20,
    desktop: [{ label: "4 columns", px: 413 }, { label: "4 columns", px: 413 }],
    below: "≤ 980px: one column.",
  },
  {
    id: "quick-links", name: "Quick links", cls: ".quick-grid",
    screens: [["Dashboard", "dashboard"]],
    columns: "repeat(4, minmax(0, 1fr)) · 2 columns each", gap: "--core-space-5 · 20px (column) · --core-space-3 · 12px (row)", gapPx: 20,
    desktop: [1, 2, 3, 4].map(() => ({ label: "2 columns", px: 197 })),
    below: "≤ 980px: one column.",
  },
  {
    id: "readiness-layout", name: "Retirement readiness layout", cls: ".rg-shell",
    screens: [["Retirement readiness", "retirement-readiness"]],
    columns: "repeat(12, minmax(0, 1fr)) · inputs span 8 · live result span 4", gap: "--core-space-5 · 20px (column) · --core-space-6 · 24px (row)", gapPx: 20,
    desktop: [{ label: "Inputs · 8 columns", px: 847 }, { label: "Live result · 4 columns", px: 413 }],
    below: "≤ 980px: one column. The order becomes inputs first, then the live result card, which stops being sticky.",
  },
  {
    id: "readiness-inputs", name: "Readiness input panels", cls: ".rg-work",
    screens: [["Retirement readiness", "retirement-readiness"]],
    columns: "minmax(0, 1fr) minmax(0, 1fr) · 4 columns each", gap: "--core-space-5 · 20px (column) · --core-space-4 · 16px (row)", gapPx: 20,
    desktop: [{ label: "Retirement target · 4 columns", px: 413 }, { label: "Deferrals · 4 columns", px: 413 }],
    below: "≤ 980px: one column.",
  },
  {
    id: "side-nav-layout", name: "Side nav + panel", cls: ".pr-shell",
    screens: [["Plan details", "plan-details"], ["Beneficiaries", "beneficiaries"], ["Add beneficiary", "bene-basic"]],
    columns: "repeat(12, minmax(0, 1fr)) · nav span 3 · panel span 9", gap: "--core-space-5 · 20px", gapPx: 20,
    desktop: [{ label: "Nav / steps · 3 columns", px: 305 }, { label: "Panel · 9 columns", px: 955 }],
    below: "≤ 980px: one column. The section nav (or steps card) sits above the panel.",
  },
  {
    id: "account-summary-layout", name: "Plan list + balances", cls: ".as-shell",
    screens: [["Account summary", "account-summary"]],
    columns: "repeat(12, minmax(0, 1fr)) · plans span 3 · balances span 9", gap: "--core-space-5 · 20px", gapPx: 20,
    desktop: [{ label: "Plans · 3 columns", px: 305 }, { label: "Balance panel · 9 columns", px: 955 }],
    below: "≤ 980px: one column.",
  },
  {
    id: "portfolio-overview", name: "Portfolio overview", cls: ".overview-row",
    screens: [["Investment portfolio", "portfolio"]],
    columns: "repeat(12, minmax(0, 1fr)) · summary span 3 · chart span 9", gap: "--core-space-5 · 20px (column) · --core-space-4 · 16px (row)", gapPx: 20,
    desktop: [{ label: "Summary · 3 columns", px: 305 }, { label: "Chart · 9 columns", px: 955 }],
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


/* ---------- Layout grid overlay (columns + 8px rhythm + chrome + modules) ---------- */
type Box = [number, number, number, number]; // x, y, w, h measured on the live portal
type Frame = {
  vw: number; bottom: number; footerY: number; footerH: number;
  rail: boolean; mobileNav: boolean; activeNav: number;
  contentX: number; contentW: number; cols: number; gutter: number; colsLabel: string;
  main: { label: string; region: Box; cells: Box[] };
  side: { label: string; region: Box; rows: Box[] };
  note: string;
};
type Overlay = { id: string; title: string; screens: Array<[string, string]>; desktop: Frame; tablet: Frame; mobile: Frame };

/** App chrome measured on the live portal. */
const HEADER_H = 56, RAIL_W = 96, MOBILE_NAV_H = 77;
const RAIL_ITEMS: Array<[number, number]> = [[72, 68], [148, 84], [240, 68], [316, 68], [392, 84]];
const D = { vw: 1440, footerH: 48, rail: true, mobileNav: false, contentX: 128, contentW: 1280, cols: 12, gutter: 20, colsLabel: "12 columns · 88px · 20px gutter" };
const T = { vw: 768, footerH: 48, rail: true, mobileNav: false, contentX: 112, contentW: 640, cols: 12, gutter: 20, colsLabel: "12 columns · 35px · 20px gutter" };
const M = { vw: 390, footerH: 69, rail: false, mobileNav: true, contentX: 16, contentW: 358, cols: 4, gutter: 16, colsLabel: "4 columns · 78px · 16px gutter" };

const stack = (x: number, w: number, ys: Array<[number, number]>): Box[] => ys.map(([y, h]) => [x, y, w, h]);

const OVERLAYS: Overlay[] = [
  {
    id: "dashboard", title: "Dashboard", screens: [["Dashboard", "dashboard"]],
    desktop: { ...D, bottom: 1686, footerY: 1638, activeNav: 0,
      main: { label: "Main · 8 columns · 847px", region: [128, 148, 847, 1442],
        cells: [[128, 148, 847, 257], [128, 473, 413, 372], [561, 473, 413, 372], [128, 861, 413, 250], [561, 861, 413, 250],
          [128, 1179, 197, 72], [345, 1179, 197, 72], [561, 1179, 197, 72], [778, 1179, 197, 72], [128, 1319, 847, 271]] },
      side: { label: "Side · 4 columns · 413px", region: [995, 148, 413, 467], rows: [[995, 148, 413, 275], [995, 439, 413, 176]] },
      note: "Main spans 8 columns and the side column 4, with 20px gutters. Inside the main area, the plan cards span 4 columns each and the quick links 2 columns each." },
    tablet: { ...T, bottom: 2717, footerY: 2669, activeNav: 0,
      main: { label: "Main · full width · 640px", region: [112, 144, 640, 1998],
        cells: stack(112, 640, [[144, 257], [469, 320], [805, 178], [999, 198], [1213, 198], [1479, 72], [1563, 72], [1647, 72], [1731, 72], [1871, 271]]) },
      side: { label: "Side · moves below · 640px", region: [112, 2162, 640, 467], rows: stack(112, 640, [[2162, 275], [2453, 176]]) },
      note: "≤ 980px: one column. Page padding 20 · 16 · 40, so the content is 640px beside the 96px rail. Plan cards and quick links stack; the side column moves below." },
    mobile: { ...M, bottom: 3346, footerY: 3277, activeNav: -1,
      main: { label: "Main · full width · 358px", region: [16, 140, 358, 2522],
        cells: stack(16, 358, [[140, 437], [645, 436], [1097, 230], [1343, 302], [1661, 270], [1999, 72], [2083, 72], [2167, 72], [2251, 72], [2391, 271]]) },
      side: { label: "Side · moves below · 358px", region: [16, 2682, 358, 483], rows: stack(16, 358, [[2682, 291], [2989, 176]]) },
      note: "≤ 640px: no rail; the bottom MobileNav (77px) takes over. Page padding 16 · 16 · 32, content 358px, every module spans all 4 columns." },
  },
  {
    id: "readiness", title: "Retirement readiness", screens: [["Retirement readiness", "retirement-readiness"]],
    desktop: { ...D, bottom: 1048, footerY: 1000, activeNav: 0,
      main: { label: "Inputs · 8 columns · 847px", region: [128, 180, 847, 673],
        cells: [[145, 233, 379, 111], [145, 352, 379, 111], [145, 471, 379, 111], [145, 590, 379, 111], [145, 709, 379, 127],
          [578, 197, 320, 64], [578, 373, 379, 90], [578, 479, 379, 90], [578, 585, 379, 98]] },
      side: { label: "Live result · 4 columns · 413px", region: [995, 180, 413, 582], rows: [[1016, 205, 371, 277], [1016, 498, 371, 181], [1016, 695, 371, 46]] },
      note: "Inputs span 8 columns (two panels of 4) and the live result 4, with 20px gutters. Target cards stack with an 8px gap inside each panel's padding." },
    tablet: { ...T, bottom: 2095, footerY: 2047, activeNav: 0,
      main: { label: "Inputs · full width · 640px", region: [112, 176, 640, 1133],
        cells: [...stack(129, 606, [[229, 111], [348, 111], [467, 111], [586, 111], [705, 111]]), [129, 866, 320, 64], ...stack(129, 606, [[1018, 74], [1108, 74], [1198, 78]])] },
      side: { label: "Live result · below · 640px", region: [112, 1333, 640, 562], rows: stack(133, 598, [[1358, 277], [1651, 161], [1828, 46]]) },
      note: "≤ 980px: one column. The two input panels stack, then the live result card follows (24px gap) and stops being sticky." },
    mobile: { ...M, bottom: 2344, footerY: 2275, activeNav: -1,
      main: { label: "Inputs · full width · 358px", region: [16, 172, 358, 1273],
        cells: [...stack(33, 324, [[225, 127], [360, 111], [479, 127], [614, 127], [749, 127]]), [33, 926, 320, 64], ...stack(33, 324, [[1102, 90], [1208, 90], [1314, 98]])] },
      side: { label: "Live result · below · 358px", region: [16, 1469, 358, 582], rows: stack(37, 316, [[1494, 277], [1787, 181], [1984, 46]]) },
      note: "≤ 640px: same order as tablet inside 16px page padding; target cards stack their control below the copy." },
  },
  {
    id: "side-nav", title: "Side nav + panel", screens: [["Beneficiaries", "beneficiaries"], ["Plan details", "plan-details"], ["Add beneficiary", "bene-basic"]],
    desktop: { ...D, bottom: 1048, footerY: 1000, activeNav: 3,
      side: { label: "Nav · 3 columns · 305px", region: [128, 176, 305, 322], rows: stack(141, 279, [[189, 56], [249, 56], [309, 56], [369, 56], [429, 56]]) },
      main: { label: "Panel · 9 columns · 955px", region: [453, 176, 955, 315], cells: stack(474, 913, [[197, 40], [254, 45], [299, 57], [356, 57], [413, 57]]) },
      note: "Nav spans 3 columns and the panel 9, with a 20px gutter. Nav items stack with a 4px gap inside 12px padding." },
    tablet: { ...T, bottom: 1072, footerY: 1024, activeNav: 3,
      side: { label: "Nav · above · wraps", region: [112, 172, 640, 142], rows: [[125, 185, 190, 56], [319, 185, 165, 56], [488, 185, 251, 56], [125, 245, 323, 56], [452, 245, 287, 56]] },
      main: { label: "Panel · full width · 640px", region: [112, 334, 640, 315], cells: stack(133, 598, [[355, 40], [411, 46], [457, 57], [514, 57], [571, 57]]) },
      note: "≤ 980px: one column. The section nav sits above the panel (20px gap) and its items wrap into rows." },
    mobile: { ...M, bottom: 1030, footerY: 961, activeNav: -1,
      side: { label: "Nav · above · stacked", region: [16, 192, 358, 322], rows: stack(29, 332, [[205, 56], [265, 56], [325, 56], [385, 56], [445, 56]]) },
      main: { label: "Panel · full width · 358px", region: [16, 534, 358, 315], cells: stack(37, 316, [[555, 40], [611, 46], [657, 57], [714, 57], [771, 57]]) },
      note: "≤ 640px: the nav items stack full width above the panel; the table scrolls sideways inside it." },
  },
];

/** How many grid columns a width covers. */
function spanOf(f: Frame, w: number) {
  const col = (f.contentW - f.gutter * (f.cols - 1)) / f.cols;
  return Math.min(f.cols, Math.round(((w + f.gutter) / (col + f.gutter)) * 10) / 10);
}

function FrameSvg({ f, title }: { f: Frame; title: string }) {
  const col = (f.contentW - f.gutter * (f.cols - 1)) / f.cols;
  const left = f.rail ? RAIL_W : 0;
  const pageBottom = f.footerY;
  const lines: number[] = [];
  for (let y = HEADER_H + 8; y < pageBottom; y += 8) lines.push(y);
  const navBottom = f.mobileNav ? f.bottom + MOBILE_NAV_H : f.bottom;
  const sm = f.vw < 500 ? "go-text go-text--sm" : "go-text";
  return (
    <svg viewBox={`0 0 ${f.vw} ${navBottom}`} role="img" aria-label={`${title} layout at ${f.vw}px`} style={{ maxWidth: f.vw === 1440 ? "100%" : f.vw === 768 ? "calc(var(--core-space-1) * 160)" : "calc(var(--core-space-1) * 98)" }}>
      <rect className="go-page" x={left} y={HEADER_H} width={f.vw - left} height={pageBottom - HEADER_H} />
      {Array.from({ length: f.cols }, (_, i) => (
        <rect key={i} className="go-col" x={f.contentX + i * (col + f.gutter)} y={HEADER_H} width={col} height={pageBottom - HEADER_H} />
      ))}
      {lines.map((y) => <line key={y} className="go-line" x1={left} x2={f.vw} y1={y} y2={y} />)}
      <rect className="go-margin" x={left} y={HEADER_H} width={f.contentX - left} height={pageBottom - HEADER_H} />
      <rect className="go-margin" x={f.contentX + f.contentW} y={HEADER_H} width={f.vw - f.contentX - f.contentW} height={pageBottom - HEADER_H} />
      <rect className="go-main" x={f.main.region[0]} y={f.main.region[1]} width={f.main.region[2]} height={f.main.region[3]} />
      {f.main.cells.map(([x, y, w, h], i) => <rect key={i} className="go-cell" x={x} y={y} width={w} height={h} />)}
      <rect className="go-side" x={f.side.region[0]} y={f.side.region[1]} width={f.side.region[2]} height={f.side.region[3]} />
      {f.side.rows.map(([x, y, w, h], i) => <rect key={i} className="go-row" x={x} y={y} width={w} height={h} />)}

      <rect className="go-chrome" x={0} y={0} width={f.vw} height={HEADER_H} />
      <rect className="go-chrome-item" x={24} y={12} width={f.vw < 500 ? 130 : 178} height={32} />
      <rect className="go-chrome-item" x={f.vw - 146} y={10} width={122} height={36} />
      <text className={sm} x={f.vw / 2} y={HEADER_H / 2}>Header · 56px</text>

      {f.rail && (
        <>
          <rect className="go-chrome" x={0} y={HEADER_H} width={RAIL_W} height={f.bottom - HEADER_H} />
          {RAIL_ITEMS.map(([y, h], i) => <rect key={y} className={i === f.activeNav ? "go-chrome-item go-chrome-item--on" : "go-chrome-item"} x={0} y={y} width={RAIL_W - 1} height={h} />)}
          <text className="go-text" x={RAIL_W / 2} y={720} transform={`rotate(-90 ${RAIL_W / 2} 720)`}>Sidebar rail · 96px</text>
        </>
      )}

      <rect className="go-chrome" x={left} y={f.footerY} width={f.vw - left} height={f.footerH} />
      <text className={sm} x={(left + f.vw) / 2} y={f.footerY + f.footerH / 2}>Footer · {f.footerH}px</text>

      {f.mobileNav && (
        <>
          <rect className="go-chrome" x={0} y={f.bottom} width={f.vw} height={MOBILE_NAV_H} />
          {[0, 1, 2].map((i) => <rect key={i} className={i === 1 ? "go-chrome-item go-chrome-item--on" : "go-chrome-item"} x={i * (f.vw / 3) + 24} y={f.bottom + 10} width={f.vw / 3 - 48} height={MOBILE_NAV_H - 20} />)}
          <text className={sm} x={f.vw / 2} y={f.bottom + MOBILE_NAV_H / 2}>MobileNav · 77px</text>
        </>
      )}
      <text className="go-text go-text--pad" x={(left + f.contentX) / 2} y={HEADER_H + 12}>{f.contentX - left}</text>
      <text className="go-text go-text--pad" x={(f.contentX + f.contentW + f.vw) / 2} y={HEADER_H + 12}>{f.vw - f.contentX - f.contentW}</text>
    </svg>
  );
}

function FramePanel({ f, title }: { f: Frame; title: string }) {
  return (
    <div className="grid-overlay__frame">
      <div className="grid-overlay__canvas"><FrameSvg f={f} title={title} /></div>
      <div className="grid-overlay__cap">
        <ul className="grid-overlay__keys">
          <li><i className="go-key go-key--col" />{f.colsLabel}</li>
          <li><i className="go-key go-key--main" />{f.main.label} · spans ≈ {spanOf(f, f.main.region[2])} of {f.cols}</li>
          <li><i className="go-key go-key--side" />{f.side.label} · spans ≈ {spanOf(f, f.side.region[2])} of {f.cols}</li>
        </ul>
        <p className="grid-overlay__note">{f.note}</p>
      </div>
    </div>
  );
}

function LayoutOverlay({ o }: { o: Overlay }) {
  return (
    <figure className="grid-overlay">
      <div className="grid-overlay__head">
        <h3 className="grid-card__title">{o.title}</h3>
        <span className="grid-overlay__used">Used in <ScreenLinks screens={o.screens} /></span>
      </div>
      <Tabs
        variant="pill"
        defaultId="desktop"
        items={[
          { id: "desktop", label: "Desktop · 1440", content: <FramePanel f={o.desktop} title={o.title} /> },
          { id: "tablet", label: "Tablet · 768", content: <FramePanel f={o.tablet} title={o.title} /> },
          { id: "mobile", label: "Mobile · 390", content: <FramePanel f={o.mobile} title={o.title} /> },
        ]}
      />
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
            Each screen drawn with its app chrome (header, sidebar rail or MobileNav, footer) on CORE's column grid at three widths. Desktop (1440) and tablet (768) use the 12-column <code>Grid</code> with 20px gutters (<code>--core-space-5</code>, the portal's layout gap) across the 1280px and 640px content areas; mobile (390) shows 4 reference columns with 16px gutters across 358px. The thin lines mark the 8px rhythm (<code>--core-space-2</code>).
            Green is the side column, broken into its stacked rows; purple is the main area, broken into its cards. Every box is measured from the
            live portal and drawn to scale.
          </p>
          <ul className="grid-overlay__legend">
            <li><i className="go-key go-key--chrome" />Header 56px · sidebar rail 96px · footer 48px</li>
            <li><i className="go-key go-key--margin" />Page margin 32px</li>
            <li><i className="go-key go-key--col" />Columns · 12 on desktop and tablet, 4 on mobile</li>
            <li><i className="go-key go-key--line" />8px rhythm</li>
            <li><i className="go-key go-key--side" />Side column · rows</li>
            <li><i className="go-key go-key--main" />Main area · cards</li>
          </ul>
          <div className="grid-list">
            {OVERLAYS.map((o) => <LayoutOverlay key={o.id} o={o} />)}
          </div>
          <p className="grid-intro grid-intro--after">
            On desktop every Screen reference layout snaps to whole columns of CORE's 12-column <code>Grid</code>: 8 + 4 for the
            Dashboard and Retirement readiness, and 3 + 9 for side-nav, Account summary and Portfolio layouts. Nested card grids use the
            same 20px gutter, so cards land on column edges too. Panel padding (16–20px) insets the content inside a module, which is
            expected. On tablet and mobile every layout is one full-width column.
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
