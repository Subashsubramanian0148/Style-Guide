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
const D = { vw: 1440, footerH: 48, rail: true, mobileNav: false, contentX: 128, contentW: 1280, cols: 12, gutter: 16, colsLabel: "12 columns, 16px gaps" };
const T = { vw: 768, footerH: 48, rail: true, mobileNav: false, contentX: 120, contentW: 624, cols: 8, gutter: 16, colsLabel: "8 columns, 16px gaps" };
const M = { vw: 384, footerH: 72, rail: false, mobileNav: true, contentX: 16, contentW: 352, cols: 4, gutter: 16, colsLabel: "4 columns, 16px gaps" };

const stack = (x: number, w: number, ys: Array<[number, number]>): Box[] => ys.map(([y, h]) => [x, y, w, h]);

const OVERLAYS: Overlay[] = [
  {
    id: "dashboard", title: "Dashboard", screens: [["Dashboard", "dashboard"]],
    desktop: { ...D, bottom: 904, footerY: 856, activeNav: 0,
      main: { label: "Main area: 848px wide (8 of 12 columns)", region: [128, 80, 848, 728],
        cells: [[128, 80, 848, 256], [128, 352, 416, 368], [560, 352, 416, 368],
          [128, 736, 200, 72], [344, 736, 200, 72], [560, 736, 200, 72], [776, 736, 200, 72]] },
      side: { label: "Side area: 416px wide (4 of 12 columns)", region: [992, 80, 416, 464], rows: [[992, 80, 416, 272], [992, 368, 416, 176]] },
      note: "" },
    tablet: { ...T, bottom: 904, footerY: 856, activeNav: 0,
      main: { label: "Main area: full width, 624px", region: [120, 80, 624, 544],
        cells: [[120, 80, 624, 200], [120, 296, 304, 240], [440, 296, 304, 240],
          [120, 552, 144, 72], [280, 552, 144, 72], [440, 552, 144, 72], [600, 552, 144, 72]] },
      side: { label: "Side area: below the main area", region: [120, 640, 624, 176], rows: [[120, 640, 304, 176], [440, 640, 304, 176]] },
      note: "Up to 976px wide." },
    mobile: { ...M, bottom: 656, footerY: 584, activeNav: -1,
      main: { label: "Main area: full width, 352px", region: [16, 80, 352, 472],
        cells: [[16, 80, 352, 176], [16, 272, 168, 200], [200, 272, 168, 200], [16, 488, 168, 64], [200, 488, 168, 64]] },
      note: "Up to 640px wide. The bottom MobileNav replaces the sidebar rail." },
  },
];

/** A measured gap: tick marks at both ends and a labelled pill above. */
function Dim({ x1, x2, y, label, vw }: { x1: number; x2: number; y: number; label: string; vw: number }) {
  const fs = vw >= 1440 ? 20 : vw >= 768 ? 14 : 10;
  const w = label.length * fs * 0.62 + fs;
  const mid = (x1 + x2) / 2;
  const px = Math.min(Math.max(mid - w / 2, 2), vw - w - 2);
  return (
    <g className="go-dim">
      <line x1={x1} x2={x2} y1={y} y2={y} />
      <line x1={x1} x2={x1} y1={y - 5} y2={y + 5} />
      <line x1={x2} x2={x2} y1={y - 5} y2={y + 5} />
      <rect x={px} y={y + 8} width={w} height={fs + 8} rx={4} />
      <text x={px + w / 2} y={y + 12 + fs / 2} style={{ fontSize: fs }}>{label}</text>
    </g>
  );
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
      <text className={sm} x={f.vw / 2} y={HEADER_H / 2}>Header · 56px</text>

      {f.rail && (
        <>
          <rect className="go-chrome" x={0} y={HEADER_H} width={RAIL_W} height={f.bottom - HEADER_H} />
          <text className="go-text" x={RAIL_W / 2} y={480} transform={`rotate(-90 ${RAIL_W / 2} 480)`}>Sidebar rail · 96px</text>
        </>
      )}

      <rect className="go-chrome" x={left} y={f.footerY} width={f.vw - left} height={f.footerH} />
      {f.mobileNav ? (
        <>
          <text className={sm} x={f.vw - 16} y={f.footerY + f.footerH / 2} style={{ textAnchor: "end" }}>Footer · {f.footerH}px</text>
        </>
      ) : (
        <text className={sm} x={(left + f.vw) / 2} y={f.footerY + f.footerH / 2}>Footer · {f.footerH}px</text>
      )}

      {f.mobileNav && (
        <>
          <rect className="go-chrome" x={0} y={f.bottom} width={f.vw} height={MOBILE_NAV_H} />
          <text className={sm} x={f.vw / 2} y={f.bottom + MOBILE_NAV_H / 2}>MobileNav · {MOBILE_NAV_H}px</text>
        </>
      )}
      {/* Size markers in the free band above the footer: page margins and one gutter */}
      {(() => {
        const y = f.footerY - (f.vw >= 1440 ? 40 : f.vw >= 768 ? 34 : 26);
        const g = f.contentX + (f.cols / 2) * col + (f.cols / 2 - 1) * f.gutter;
        return (
          <>
            <Dim x1={left} x2={f.contentX} y={y} label={`Margin ${f.contentX - left}`} vw={f.vw} />
            <Dim x1={f.contentX + f.contentW} x2={f.vw} y={y} label={`Margin ${f.vw - f.contentX - f.contentW}`} vw={f.vw} />
            <Dim x1={g} x2={g + f.gutter} y={y} label={`Gutter ${f.gutter}`} vw={f.vw} />
          </>
        );
      })()}
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
          <li><i className="go-key go-key--main" />{f.main.label}</li>
          {f.side && <li><i className="go-key go-key--side" />{f.side.label}</li>}
        </ul>
        {f.note && <p className="grid-overlay__note">{f.note}</p>}
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

/** Legend and sizes per breakpoint: [legend key, element, desktop, tablet, mobile]. */
const SPEC_ROWS: Array<[string, string, string, string, string]> = [
  ["chrome", "Header", "56px", "56px", "56px"],
  ["chrome", "Sidebar rail", "96px", "96px", "—"],
  ["chrome", "MobileNav", "—", "—", "80px"],
  ["chrome", "Footer", "48px", "48px", "72px"],
  ["margin", "Page margin", "32px", "24px", "16px"],
  ["col", "Columns", "12", "8", "4"],
  ["col", "Gutter", "16px", "16px", "16px"],
  ["line", "Rhythm", "8px", "8px", "8px"],
  ["main", "Main area", "8 columns", "Full width", "Full width"],
  ["side", "Side column", "4 columns", "Below main", "Hidden"],
];

export default function Grid() {
  return (
    <div>
      <DocsSectionList>
        <DocsSection anchorId="layout-grid" title="Layout grid">
          <p className="grid-intro">
            12 columns on desktop, 8 on tablet, 4 on mobile. Margins and gutters follow the 8px scale; columns flex to fill the space.
          </p>
          <div className="grid-table-card grid-spec">
            <table className="grid-table">
              <thead><tr><th>Element</th><th>Desktop · 1440</th><th>Tablet · 768</th><th>Mobile · 384</th></tr></thead>
              <tbody>
                {SPEC_ROWS.map(([key, label, d, t, m]) => (
                  <tr key={label}>
                    <td><span className="grid-spec__name"><i className={`go-key go-key--${key}`} />{label}</span></td>
                    <td>{d}</td><td>{t}</td><td>{m}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="grid-list">
            {OVERLAYS.map((o) => <LayoutOverlay key={o.id} o={o} />)}
          </div>
        </DocsSection>

      </DocsSectionList>
    </div>
  );
}
