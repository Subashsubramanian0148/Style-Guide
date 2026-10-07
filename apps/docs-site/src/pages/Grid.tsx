import React from "react";
import { Link } from "react-router-dom";
import { DocsSection, DocsSectionList } from "../DocsSection";
import { Tabs } from "../../../../packages/core/src/components/Navigation";
import "./grid.css";

/** Grid — the layout grids the Screen reference screens use, read from the
 *  portal's own CSS (Satish0024/S_PPT, journey-retirement) and measured on
 *  the live portal at 1440 × 1000 and 390 × 844. */

/* ---------- Layout grid overlay (columns + 8px rhythm + chrome + modules) ---------- */
type Box = [number, number, number, number]; // x, y, w, h measured on the live portal
type Frame = {
  vw: number; bottom: number; footerY: number; footerH: number;
  rail: boolean; mobileNav: boolean; activeNav: number;
  contentX: number; contentW: number; cols: number; gutter: number; colsLabel: string;
  main: { label: string; region: Box; cells: Box[] };
  side?: { label: string; region: Box; rows: Box[] };
  note: string;
};
type Overlay = { id: string; title: string; screens: Array<[string, string]>; desktop: Frame; tablet: Frame; mobile: Frame };

/** App chrome measured on the live portal. */
const HEADER_H = 56, RAIL_W = 96, MOBILE_NAV_H = 80;
const RAIL_ITEMS: Array<[number, number]> = [[72, 64], [144, 80], [232, 64], [304, 64], [376, 80]];
const D = { vw: 1440, footerH: 48, rail: true, mobileNav: false, contentX: 128, contentW: 1280, cols: 12, gutter: 16, colsLabel: "12 columns · 92px (fluid) · 16px gutter" };
const T = { vw: 768, footerH: 48, rail: true, mobileNav: false, contentX: 120, contentW: 624, cols: 8, gutter: 16, colsLabel: "8 columns · 64px · 16px gutter" };
const M = { vw: 384, footerH: 72, rail: false, mobileNav: true, contentX: 16, contentW: 352, cols: 4, gutter: 16, colsLabel: "4 columns · 76px (fluid) · 16px gutter" };

const stack = (x: number, w: number, ys: Array<[number, number]>): Box[] => ys.map(([y, h]) => [x, y, w, h]);

const OVERLAYS: Overlay[] = [
  {
    id: "dashboard", title: "Dashboard", screens: [["Dashboard", "dashboard"]],
    desktop: { ...D, bottom: 904, footerY: 856, activeNav: 0,
      main: { label: "Main · 8 columns · 848px", region: [128, 80, 848, 728],
        cells: [[128, 80, 848, 256], [128, 352, 416, 368], [560, 352, 416, 368],
          [128, 736, 200, 72], [344, 736, 200, 72], [560, 736, 200, 72], [776, 736, 200, 72]] },
      side: { label: "Side · 4 columns · 416px", region: [992, 80, 416, 464], rows: [[992, 80, 416, 272], [992, 368, 416, 176]] },
      note: "32px page margins and 16px gutters; columns flex to fill the 1280px content area. Main spans 8 columns and the side column 4. The two plan cards span 4 columns each (416px) and the quick links 2 columns each (200px)." },
    tablet: { ...T, bottom: 904, footerY: 856, activeNav: 0,
      main: { label: "Main · full width · 624px", region: [120, 80, 624, 544],
        cells: [[120, 80, 624, 200], [120, 296, 304, 240], [440, 296, 304, 240],
          [120, 552, 144, 72], [280, 552, 144, 72], [440, 552, 144, 72], [600, 552, 144, 72]] },
      side: { label: "Side · moves below · 624px", region: [120, 640, 624, 176], rows: [[120, 640, 304, 176], [440, 640, 304, 176]] },
      note: "≤ 976px: 8 columns beside the 96px rail, with 24px page margins and 16px gutters. Plan cards span 4 columns each (304px), quick links 2 each (144px), and the side cards move below the main area." },
    mobile: { ...M, bottom: 656, footerY: 584, activeNav: -1,
      main: { label: "Main · full width · 352px", region: [16, 80, 352, 472],
        cells: [[16, 80, 352, 176], [16, 272, 168, 200], [200, 272, 168, 200], [16, 488, 168, 64], [200, 488, 168, 64]] },
      note: "≤ 640px: no rail; the bottom MobileNav (80px) takes over. 16px page margins and 16px gutters; plan cards and quick links span 2 of the 4 columns each (168px), and the side column is left out. The footer (72px) sits at the end of the page above the MobileNav: 16px padding, copyright and links stacked with an 8px gap (16 + 16 + 8 + 16 + 16)." },
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
    <svg viewBox={`0 0 ${f.vw} ${navBottom}`} role="img" aria-label={`${title} layout at ${f.vw}px`} style={{ maxWidth: f.vw === 1440 ? "calc(var(--core-space-1) * 180)" : f.vw === 768 ? "calc(var(--core-space-1) * 104)" : "calc(var(--core-space-1) * 64)" }}>
      <rect className="go-page" x={left} y={HEADER_H} width={f.vw - left} height={pageBottom - HEADER_H} />
      {Array.from({ length: f.cols }, (_, i) => (
        <rect key={i} className="go-col" x={f.contentX + i * (col + f.gutter)} y={HEADER_H} width={col} height={pageBottom - HEADER_H} />
      ))}
      {lines.map((y) => <line key={y} className="go-line" x1={left} x2={f.vw} y1={y} y2={y} />)}
      <rect className="go-margin" x={left} y={HEADER_H} width={f.contentX - left} height={pageBottom - HEADER_H} />
      <rect className="go-margin" x={f.contentX + f.contentW} y={HEADER_H} width={f.vw - f.contentX - f.contentW} height={pageBottom - HEADER_H} />
      <rect className="go-main" x={f.main.region[0]} y={f.main.region[1]} width={f.main.region[2]} height={f.main.region[3]} />
      {f.main.cells.map(([x, y, w, h], i) => <rect key={i} className="go-cell" x={x} y={y} width={w} height={h} />)}
      {f.side && <rect className="go-side" x={f.side.region[0]} y={f.side.region[1]} width={f.side.region[2]} height={f.side.region[3]} />}
      {f.side?.rows.map(([x, y, w, h], i) => <rect key={i} className="go-row" x={x} y={y} width={w} height={h} />)}

      <rect className="go-chrome" x={0} y={0} width={f.vw} height={HEADER_H} />
      <rect className="go-chrome-item" x={24} y={16} width={f.vw < 500 ? 128 : 176} height={24} />
      <rect className="go-chrome-item" x={f.vw - 144} y={16} width={120} height={24} />
      <text className={sm} x={f.vw / 2} y={HEADER_H / 2}>Header · 56px</text>

      {f.rail && (
        <>
          <rect className="go-chrome" x={0} y={HEADER_H} width={RAIL_W} height={f.bottom - HEADER_H} />
          {RAIL_ITEMS.map(([y, h], i) => <rect key={y} className={i === f.activeNav ? "go-chrome-item go-chrome-item--on" : "go-chrome-item"} x={0} y={y} width={RAIL_W - 1} height={h} />)}
          <text className="go-text" x={RAIL_W / 2} y={480} transform={`rotate(-90 ${RAIL_W / 2} 480)`}>Sidebar rail · 96px</text>
        </>
      )}

      <rect className="go-chrome" x={left} y={f.footerY} width={f.vw - left} height={f.footerH} />
      {f.mobileNav ? (
        <>
          {/* Phone footer: copyright and links stack, 16px padding, 8px gap */}
          <rect className="go-chrome-item" x={16} y={f.footerY + 16} width={208} height={16} />
          <rect className="go-chrome-item" x={16} y={f.footerY + 40} width={144} height={16} />
          <text className={sm} x={f.vw - 16} y={f.footerY + f.footerH / 2} style={{ textAnchor: "end" }}>Footer · {f.footerH}px</text>
        </>
      ) : (
        <text className={sm} x={(left + f.vw) / 2} y={f.footerY + f.footerH / 2}>Footer · {f.footerH}px</text>
      )}

      {f.mobileNav && (
        <>
          <rect className="go-chrome" x={0} y={f.bottom} width={f.vw} height={MOBILE_NAV_H} />
          {[0, 1, 2].map((i) => <rect key={i} className={i === 1 ? "go-chrome-item go-chrome-item--on" : "go-chrome-item"} x={i * (f.vw / 3) + 24} y={f.bottom + 8} width={f.vw / 3 - 48} height={MOBILE_NAV_H - 16} />)}
          <text className={sm} x={f.vw / 2} y={f.bottom + MOBILE_NAV_H / 2}>MobileNav · {MOBILE_NAV_H}px</text>
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
          {f.side && <li><i className="go-key go-key--side" />{f.side.label} · spans ≈ {spanOf(f, f.side.region[2])} of {f.cols}</li>}
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
          { id: "mobile", label: "Mobile · 384", content: <FramePanel f={o.mobile} title={o.title} /> },
        ]}
      />
    </figure>
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
            Each screen drawn with its app chrome (header, sidebar rail or MobileNav, footer) on CORE's column grid at three widths. Following the common responsive-grid convention (as in Material Design): 12 columns on desktop, 8 on tablet and 4 on mobile, with margins and gutters on the 8px scale and columns that flex to fill the space. Desktop (1440) uses 32px margins (<code>--core-space-8</code>), tablet (768) 24px (<code>--core-space-6</code>) and mobile (384) 16px (<code>--core-space-4</code>); gutters are 16px everywhere. The thin lines mark the 8px rhythm (<code>--core-space-2</code>).
            Green is the side column, broken into its stacked rows; purple is the main area, broken into its cards. Every box is drawn to scale on the 8px grid.
          </p>
          <ul className="grid-overlay__legend">
            <li><i className="go-key go-key--chrome" />Header 56px · sidebar rail 96px · footer 48px (72px on mobile) · MobileNav 80px</li>
            <li><i className="go-key go-key--margin" />Page margin 32px desktop · 24px tablet · 16px mobile</li>
            <li><i className="go-key go-key--col" />Columns · 12 desktop · 8 tablet · 4 mobile</li>
            <li><i className="go-key go-key--line" />8px rhythm</li>
            <li><i className="go-key go-key--side" />Side column · rows</li>
            <li><i className="go-key go-key--main" />Main area · cards</li>
          </ul>
          <div className="grid-list">
            {OVERLAYS.map((o) => <LayoutOverlay key={o.id} o={o} />)}
          </div>
          <p className="grid-intro grid-intro--after">
            On desktop every Screen reference layout snaps to whole columns of CORE's 12-column <code>Grid</code>: 8 + 4 for the
            Dashboard, and 3 + 9 for Account summary and Portfolio layouts. Nested card grids use the
            same 16px gutter, so cards land on column edges too. Panel padding (16–24px) insets the content inside a module, which is
            expected. On tablet (8 columns) the side column moves below the main area; the mobile (4 columns) reference shows the main area only.
          </p>
        </DocsSection>

      </DocsSectionList>
    </div>
  );
}
