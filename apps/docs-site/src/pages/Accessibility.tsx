import React from "react";

type Level = "A" | "AA";
type Status = "component" | "product" | "content";
interface Criterion { id: string; name: string; level: Level; status: Status; note: string; }

// The full WCAG 2.2 Level A + AA success-criteria list (55 total: 4.1.1 Parsing was
// removed from 2.2, so it's correctly absent here). Status marks who owns satisfying
// it: "component" = CORE's job (built into the component), "product" = the app team's
// job when assembling pages (CORE can't guarantee it alone), "content" = whoever writes
// the actual page content/copy.
const CRITERIA: Criterion[] = [
  { id: "1.1.1", name: "Non-text Content", level: "A", status: "product", note: "CORE's Icon/Avatar/Image slots accept alt text — the app must supply meaningful values. Chart (LineChartCard/BarChartCard) goes further on its own: every chart's SVG is aria-hidden and ships a real visually-hidden <table> with the same data, not just a summary label." },
  { id: "1.2.1", name: "Audio-only and Video-only (Prerecorded)", level: "A", status: "content", note: "No CORE component plays media; applies if the app embeds any." },
  { id: "1.2.2", name: "Captions (Prerecorded)", level: "A", status: "content", note: "Same as above." },
  { id: "1.2.3", name: "Audio Description or Media Alternative (Prerecorded)", level: "A", status: "content", note: "Same as above." },
  { id: "1.2.4", name: "Captions (Live)", level: "AA", status: "content", note: "Same as above." },
  { id: "1.2.5", name: "Audio Description (Prerecorded)", level: "AA", status: "content", note: "Same as above." },
  { id: "1.3.1", name: "Info and Relationships", level: "A", status: "component", note: "Semantic HTML throughout (real <table>, <label>, <fieldset>/radiogroup, headings) — not div soup." },
  { id: "1.3.2", name: "Meaningful Sequence", level: "A", status: "product", note: "CORE components read in logical DOM order; page-level layout order is the app's responsibility." },
  { id: "1.3.3", name: "Sensory Characteristics", level: "A", status: "component", note: "Status/tone never relies on color/shape alone — Badge/Alert/Toast always pair color with text." },
  { id: "1.3.4", name: "Orientation", level: "AA", status: "product", note: "No CORE component locks orientation; the app must not either." },
  { id: "1.3.5", name: "Identify Input Purpose", level: "AA", status: "product", note: "Input supports standard autocomplete attributes — the app must set them (e.g. autoComplete=\"email\")." },
  { id: "1.4.1", name: "Use of Color", level: "A", status: "component", note: "Same as 1.3.3 — verified on Alert, Badge, Toast, form validation states." },
  { id: "1.4.2", name: "Audio Control", level: "A", status: "content", note: "No CORE component autoplays audio." },
  { id: "1.4.3", name: "Contrast (Minimum)", level: "AA", status: "component", note: "Every semantic color pairing is computed live on the Color page (4.5:1 normal text, 3:1 large text) — see Foundations → Color." },
  { id: "1.4.4", name: "Resize Text", level: "AA", status: "component", note: "Typography tokens use rem-equivalent scaling and respect browser zoom/OS text size." },
  { id: "1.4.5", name: "Images of Text", level: "AA", status: "product", note: "CORE never renders text as an image; the app must avoid it too (e.g. banners)." },
  { id: "1.4.10", name: "Reflow", level: "AA", status: "component", note: "Table wraps in horizontal scroll rather than breaking layout at 320px width; grids collapse to 1 column under 700px." },
  { id: "1.4.11", name: "Non-text Contrast", level: "AA", status: "component", note: "Component borders use neutral-500+ and semantic 400–600 steps for ≥3:1 against adjacent surfaces." },
  { id: "1.4.12", name: "Text Spacing", level: "AA", status: "component", note: "No component breaks when a user overrides line-height/letter-spacing/word-spacing via user stylesheet." },
  { id: "1.4.13", name: "Content on Hover or Focus", level: "AA", status: "component", note: "Tooltip/HoverCard/Popover are dismissible (Escape), hoverable, and don't disappear on their own — see Overlays." },
  { id: "2.1.1", name: "Keyboard", level: "A", status: "component", note: "Every interactive component (Button, Select, Combobox, Tabs, Menu, Modal, Slider…) is fully keyboard-operable — verified per component page." },
  { id: "2.1.2", name: "No Keyboard Trap", level: "A", status: "component", note: "Modal/Drawer/ConfirmDialog trap focus intentionally, but Escape and the close control always return it." },
  { id: "2.1.4", name: "Character Key Shortcuts", level: "A", status: "product", note: "CORE defines no single-character shortcuts; if the app adds any, they must be remappable/disableable." },
  { id: "2.2.1", name: "Timing Adjustable", level: "A", status: "product", note: "Toast auto-dismiss (4s default) is the one CORE-owned timing — durationMs is adjustable per call, and a manual close button is always present." },
  { id: "2.2.2", name: "Pause, Stop, Hide", level: "A", status: "component", note: "Skeleton/Spinner/progress animations are decorative only, not required for comprehension." },
  { id: "2.3.1", name: "Three Flashes or Below Threshold", level: "A", status: "component", note: "No CORE animation flashes more than 3 times per second." },
  { id: "2.4.1", name: "Bypass Blocks", level: "A", status: "component", note: "This docs site ships a \"Skip to main content\" link plus a <main id=\"main-content\"> landmark; AppSidebar is labeled for navigation. Consumer apps should mirror the same pattern." },
  { id: "2.4.2", name: "Page Titled", level: "A", status: "product", note: "Per-page <title> is an app/routing concern, not a CORE component." },
  { id: "2.4.3", name: "Focus Order", level: "A", status: "component", note: "Focus order follows visual/DOM order in every component; Modal/Drawer move focus in on open." },
  { id: "2.4.4", name: "Link Purpose (In Context)", level: "A", status: "content", note: "Link/Button text is supplied by the app — CORE can't guarantee wording, only that it renders accessibly." },
  { id: "2.4.5", name: "Multiple Ways", level: "AA", status: "product", note: "Site-level nav + search is an app/IA concern." },
  { id: "2.4.6", name: "Headings and Labels", level: "AA", status: "component", note: "Field always renders a real, descriptive <label> — never placeholder-only." },
  { id: "2.4.7", name: "Focus Visible", level: "AA", status: "component", note: "2px focus ring via :focus-visible on every interactive component, never suppressed." },
  { id: "2.4.11", name: "Focus Not Obscured (Minimum)", level: "AA", status: "component", note: "Sticky topbar/sidebar don't overlap a focused element — verified with the docs site's own sticky header." },
  { id: "2.5.1", name: "Pointer Gestures", level: "A", status: "component", note: "No CORE interaction requires a multi-point or path-based gesture (e.g. Slider works with a single click/drag or arrow keys)." },
  { id: "2.5.2", name: "Pointer Cancellation", level: "A", status: "component", note: "Actions fire on click/mouseup, not mousedown, so a user can drag off to cancel." },
  { id: "2.5.3", name: "Label in Name", level: "A", status: "component", note: "Visible button/link text always matches (or is contained in) its accessible name." },
  { id: "2.5.4", name: "Motion Actuation", level: "A", status: "component", note: "No CORE component requires device motion (shake/tilt) to operate." },
  { id: "2.5.7", name: "Dragging Movements", level: "AA", status: "component", note: "Slider (the one draggable CORE control) also works via arrow keys/click, no drag-only interaction." },
  { id: "2.5.8", name: "Target Size (Minimum)", level: "AA", status: "component", note: "24×24px minimum enforced — IconButton sm is 32px, Checkbox/Radio hit areas extend to their label text." },
  { id: "3.1.1", name: "Language of Page", level: "A", status: "product", note: "<html lang=\"...\"> is set once at the app shell, not per component." },
  { id: "3.1.2", name: "Language of Parts", level: "AA", status: "content", note: "Only relevant if a page mixes languages — a content concern." },
  { id: "3.2.1", name: "On Focus", level: "A", status: "component", note: "No CORE component changes context (navigates, submits) merely on receiving focus." },
  { id: "3.2.2", name: "On Input", level: "A", status: "component", note: "Select/Combobox/Toggle changes value on explicit selection, never mid-typing without confirmation." },
  { id: "3.2.3", name: "Consistent Navigation", level: "AA", status: "product", note: "Cross-page nav consistency is an app/IA concern; NavigationMenu/AppSidebar support it structurally." },
  { id: "3.2.4", name: "Consistent Identification", level: "AA", status: "component", note: "One Button/Badge/Icon per meaning across the whole library — no duplicate components for the same purpose." },
  { id: "3.2.6", name: "Consistent Help", level: "A", status: "product", note: "New in WCAG 2.2 — if the app offers a help/support link, it must appear in the same relative place on every page." },
  { id: "3.3.1", name: "Error Identification", level: "A", status: "component", note: "Field error text uses role=\"alert\" and aria-invalid, always paired with visible text, not color alone." },
  { id: "3.3.2", name: "Labels or Instructions", level: "A", status: "component", note: "Every form control field: hint/required-marker support built into Field." },
  { id: "3.3.3", name: "Error Suggestion", level: "AA", status: "content", note: "CORE renders the error message; writing a correction suggestion is a content/product concern." },
  { id: "3.3.4", name: "Error Prevention (Legal, Financial, Data)", level: "AA", status: "product", note: "ConfirmDialog exists for this exact purpose (e.g. withdrawal requests) — the app must use it before irreversible submits." },
  { id: "3.3.7", name: "Redundant Entry", level: "A", status: "product", note: "New in WCAG 2.2 — don't ask for the same info twice in one flow (e.g. Stepper-based requests); an app-flow concern." },
  { id: "3.3.8", name: "Accessible Authentication (Minimum)", level: "AA", status: "product", note: "New in WCAG 2.2 — InputOTP must not be the only path (no cognitive-function test without an alternative); an app/auth-flow concern." },
  { id: "4.1.2", name: "Name, Role, Value", level: "A", status: "component", note: "Every custom control (Select, Combobox, Switch, Tabs, Accordion, Slider…) uses correct ARIA role/state, verified per component. Fixed this pass: DataTable's column filters used a real native <select> instead of the custom Select — the only component found relying on the browser's own control instead of CORE's." },
  { id: "4.1.3", name: "Status Messages", level: "AA", status: "component", note: "Toast/Alert/inline validation use aria-live regions (role=\"status\"/\"alert\") so updates are announced without moving focus." },
];

const STATUS_LABEL: Record<Status, string> = {
  component: "CORE component — built in",
  product: "App/product responsibility",
  content: "Content responsibility",
};
const STATUS_COLOR: Record<Status, string> = {
  component: "#4ADE9C",
  product: "#E8B563",
  content: "#8F93AA",
};

const PRINCIPLES: Array<{ name: string; range: string }> = [
  { name: "1 · Perceivable", range: "1." },
  { name: "2 · Operable", range: "2." },
  { name: "3 · Understandable", range: "3." },
  { name: "4 · Robust", range: "4." },
];

export default function Accessibility() {
  const counts = { component: 0, product: 0, content: 0 };
  CRITERIA.forEach((c) => counts[c.status]++);

  return (
    <div>
      <h1 className="site-h1">Accessibility</h1>
      <p className="site-lede">
        Target: <strong style={{ color: "var(--site-text)" }}>WCAG 2.2, Level A + AA</strong> — the full 55-criterion
        checklist below (2.2 dropped the old 4.1.1 Parsing criterion, hence 55 not 56). Each item is marked who
        owns satisfying it: a CORE component builds it in structurally, or it's an app/content decision CORE
        can't make on your behalf (e.g. writing alt text, choosing page titles).
      </p>

      <div className="stat-cards" style={{ padding: "0 0 24px" }}>
        <div className="stat-card"><div className="num">55</div><div className="lbl">WCAG 2.2 A+AA criteria</div></div>
        <div className="stat-card"><div className="num">{counts.component}</div><div className="lbl">Built into CORE components</div></div>
        <div className="stat-card"><div className="num">{counts.product}</div><div className="lbl">App/product responsibility</div></div>
        <div className="stat-card"><div className="num">{counts.content}</div><div className="lbl">Content responsibility</div></div>
      </div>

      <h2 className="site-section-title" id="docs-site-audit">This docs site — ADA audit (live)</h2>
      <div className="site-panel" style={{ marginBottom: 32 }}>
        <table className="spec-table" style={{ width: "100%" }}>
          <thead>
            <tr><th>Check</th><th>Status</th><th>Notes</th></tr>
          </thead>
          <tbody>
            <tr><td>Document language (<code>lang=&quot;en&quot;</code>)</td><td>Pass</td><td>Set in <code>index.html</code>.</td></tr>
            <tr><td>Skip to main content</td><td>Pass</td><td>Keyboard-focusable link targets <code>#main-content</code>.</td></tr>
            <tr><td>Main landmark</td><td>Pass</td><td>Page content is wrapped in <code>&lt;main id=&quot;main-content&quot;&gt;</code>.</td></tr>
            <tr><td>Navigation landmark</td><td>Pass</td><td>Sidebar uses <code>aria-label=&quot;Site navigation&quot;</code>.</td></tr>
            <tr><td>Global dark/light toggle</td><td>Pass</td><td>Sidebar switch drives demo canvases and site chrome.</td></tr>
            <tr><td>Semantic color contrast</td><td>Pass (tokens)</td><td>Computed on Foundations → Color; re-check after palette changes.</td></tr>
            <tr><td>Keyboard-only walkthrough</td><td>Partial</td><td>CORE components are keyboard-ready; full page-by-page QA not signed off.</td></tr>
            <tr><td>NVDA / VoiceOver pass</td><td>Open</td><td>Not yet run end-to-end on this site — see section below.</td></tr>
            <tr><td>Responsive QA (all breakpoints)</td><td>Open</td><td>See Layout &amp; breakpoints section below.</td></tr>
          </tbody>
        </table>
      </div>

      {PRINCIPLES.map((p) => (
        <div key={p.name} id={`wcag-${p.range.replace(".", "").replace(" · ", "-")}`}>
          <h2 className="site-section-title">{p.name}</h2>
          <div className="site-panel site-panel--flush">
            <table className="spec-table" style={{ width: "100%" }}>
              <thead>
                <tr><th>SC</th><th>Name</th><th>Level</th><th>Owner</th><th>Note</th></tr>
              </thead>
              <tbody>
                {CRITERIA.filter((c) => c.id.startsWith(p.range)).map((c) => (
                  <tr key={c.id}>
                    <td><code>{c.id}</code></td>
                    <td>{c.name}</td>
                    <td>{c.level}</td>
                    <td>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: "var(--core-space-1)", fontSize: 12 }}>
                        <span style={{ width: 8, height: 8, borderRadius: "50%", background: STATUS_COLOR[c.status], display: "inline-block" }} />
                        {STATUS_LABEL[c.status]}
                      </span>
                    </td>
                    <td style={{ color: "var(--site-text-dim)", fontSize: "var(--typography-body-md-size)" }}>{c.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}

      <h2 className="site-section-title">Keyboard interaction (per component family)</h2>
      <table className="spec-table">
        <thead><tr><th>Component</th><th>Keys</th></tr></thead>
        <tbody>
          <tr><td>Button / IconButton</td><td><code>Tab</code> to focus, <code>Enter</code>/<code>Space</code> to activate</td></tr>
          <tr><td>Select / Combobox</td><td><code>↑/↓</code> navigate, <code>Home/End</code> jump, <code>Enter/Space</code> select, <code>Esc</code> close</td></tr>
          <tr><td>Tabs</td><td><code>←/→</code> (or <code>↑/↓</code> vertical) move between tabs, activates on arrival</td></tr>
          <tr><td>Modal / Drawer</td><td><code>Esc</code> closes, focus trapped inside while open, returns to trigger on close</td></tr>
          <tr><td>Accordion</td><td><code>Enter/Space</code> toggles the focused trigger</td></tr>
          <tr><td>Slider</td><td><code>←/→</code> step, <code>Home/End</code> jump to min/max</td></tr>
          <tr><td>Dropdown Menu</td><td><code>↑/↓</code> navigate items, <code>Enter</code> select, <code>Esc</code> close</td></tr>
        </tbody>
      </table>

      <h2 className="site-section-title">Screen reader &amp; NVDA</h2>
      <div className="site-panel">
        <p style={{ margin: "0 0 12px", fontSize: 14, color: "var(--site-text-dim)", lineHeight: 1.7 }}>
          Current state: component ARIA/roles are correct by construction (verified via code review and the
          Accessibility notes on each component page), but <strong style={{ color: "var(--site-text)" }}>no
          real NVDA/VoiceOver pass has been run against the live site yet</strong> — that's tracked as an open
          item, not claimed as done. A real screen-reader pass should specifically verify:
        </p>
        <ul style={{ margin: 0, paddingLeft: "var(--core-space-4)", color: "var(--site-text-dim)", lineHeight: 1.8, fontSize: 14 }}>
          <li>Form errors are announced immediately on submit, not just visually shown.</li>
          <li>Modal/Drawer opening is announced and focus lands on the right element.</li>
          <li>Toast notifications are announced without stealing focus from the current task.</li>
          <li>Custom Select/Combobox announce the selected value and available options correctly (this is the
            highest-risk item — custom listboxes are the most common place screen-reader behavior silently breaks).</li>
        </ul>
      </div>

      <h2 className="site-section-title">Layout &amp; breakpoints</h2>
      <div className="site-panel">
        <p style={{ margin: 0, fontSize: 14, color: "var(--site-text-dim)", lineHeight: 1.7 }}>
          Bootstrap breakpoints are the foundation (per scope §14): <code>sm</code> 576px, <code>md</code> 768px,
          <code>lg</code> 992px, <code>xl</code> 1200px. Grids in this site collapse to 1 column under 700px;
          Table/DataTable scroll horizontally rather than reflow. <strong style={{ color: "var(--site-text)" }}>
          A systematic pass checking every component at all four breakpoints has not been completed yet</strong> —
          tracked as an open item alongside the NVDA pass.
        </p>
      </div>
    </div>
  );
}
