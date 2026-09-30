import React, { useLayoutEffect, useState } from "react";
import typography from "../../../packages/tokens/src/typography.json";
import { SectionHeading, SpecTableCard, SpecTableHead, SpecRow, toHexColors } from "./AnatomySpec";
import { allStyleRules, tokenFor, isTransparent, hasOwnText, PROPS } from "./AnatomyColors";
import { roleName } from "./pages/Typography";
import { MeasuredAnatomy, type AnatomyMark, type AnatomyLayer, type AnatomySpecRow, type AnatomyQuery } from "./MeasuredAnatomy";

/** Walks every element under `root` and reports which design tokens the
 *  screen actually uses — typography role, color, radius and spacing — each
 *  grouped and counted, with a live sample so "where is H1 used" and "which
 *  spacing values appear on this screen" are answered directly from the
 *  rendered page instead of by hand-authored notes. */

const TYPE_ROLES = Object.entries(typography as Record<string, { desktop: { size: string; weight: string } }>).map(
  ([key, v]) => ({ key, label: roleName[key] ?? key, size: parseFloat(v.desktop.size), weight: v.desktop.weight })
);

interface UsageRow {
  label: string;
  token: string;
  value: string;
  count: number;
  sample?: string;
  swatch?: string;
}

function buildValueMap(root: HTMLElement, prefix: string, keys: string[]): Map<string, string> {
  const cs = getComputedStyle(root);
  const map = new Map<string, string>();
  for (const k of keys) {
    const v = cs.getPropertyValue(`--core-${prefix}-${k}`).trim();
    if (v && !map.has(v)) map.set(v, `core-${prefix}-${k}`);
  }
  return map;
}

const RADIUS_KEYS = ["none", "xs", "sm", "md", "lg", "xl", "full"];
const SPACE_KEYS = ["0", "1", "2", "3", "4", "5", "6", "8", "10", "12", "16", "20", "24"];

function walk(root: HTMLElement): HTMLElement[] {
  const out: HTMLElement[] = [root];
  const tw = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT);
  while (tw.nextNode()) {
    const el = tw.currentNode as HTMLElement;
    const cs = getComputedStyle(el);
    if (cs.display === "none" || cs.visibility === "hidden") continue;
    out.push(el);
  }
  return out;
}

function scanTypography(elements: HTMLElement[]): UsageRow[] {
  const rows = new Map<string, UsageRow>();
  for (const el of elements) {
    if (!hasOwnText(el)) continue;
    const cs = getComputedStyle(el);
    const size = parseFloat(cs.fontSize);
    const weight = cs.fontWeight;
    if (!size) continue;
    const match = TYPE_ROLES.find((r) => Math.round(r.size) === Math.round(size) && r.weight === weight);
    const label = match ? match.label : `Custom ${Math.round(size)}px / ${weight}`;
    const key = label;
    const text = (el.textContent || "").trim().replace(/\s+/g, " ").slice(0, 60);
    const existing = rows.get(key);
    if (existing) {
      existing.count += 1;
    } else {
      rows.set(key, {
        label,
        token: match ? match.key : "—",
        value: `${Math.round(size)}px / ${weight} / ${cs.lineHeight}`,
        count: 1,
        sample: text || undefined,
      });
    }
  }
  return Array.from(rows.values()).sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
}

function scanColors(root: HTMLElement, elements: HTMLElement[]): UsageRow[] {
  const rows = new Map<string, UsageRow>();
  for (const el of elements) {
    const cs = getComputedStyle(el);
    for (const p of PROPS) {
      const value = cs.getPropertyValue(p.key);
      if (p.key === "color" && !hasOwnText(el) && el.tagName !== "I" && el.tagName !== "svg") continue;
      if (p.key !== "color" && isTransparent(value)) continue;
      if (p.key === "border-top-color" && parseFloat(cs.borderTopWidth) === 0) continue;
      const token = tokenFor(el, p, value);
      const key = `${p.name}|${token}|${value}`;
      const existing = rows.get(key);
      if (existing) existing.count += 1;
      else rows.set(key, { label: p.name, token, value, count: 1, swatch: value });
    }
  }
  return Array.from(rows.values()).sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
}

function scanRadius(root: HTMLElement, elements: HTMLElement[]): UsageRow[] {
  const map = buildValueMap(root, "radius", RADIUS_KEYS);
  const rows = new Map<string, UsageRow>();
  for (const el of elements) {
    const cs = getComputedStyle(el);
    const v = cs.borderTopLeftRadius;
    if (!v || parseFloat(v) === 0) continue;
    const token = map.get(v) ?? "custom (not a token)";
    const key = `${v}|${token}`;
    const existing = rows.get(key);
    if (existing) existing.count += 1;
    else rows.set(key, { label: "Corner radius", token, value: v, count: 1 });
  }
  return Array.from(rows.values()).sort((a, b) => b.count - a.count || parseFloat(a.value) - parseFloat(b.value));
}

function scanSpacing(root: HTMLElement, elements: HTMLElement[]): UsageRow[] {
  const map = buildValueMap(root, "space", SPACE_KEYS);
  const rows = new Map<string, UsageRow>();
  const add = (label: string, v: string) => {
    if (!v || parseFloat(v) === 0) return;
    const token = map.get(v) ?? "custom (not a token)";
    const key = `${label}|${v}`;
    const existing = rows.get(key);
    if (existing) existing.count += 1;
    else rows.set(key, { label, token, value: v, count: 1 });
  };
  for (const el of elements) {
    const cs = getComputedStyle(el);
    if (cs.display === "flex" || cs.display === "grid" || cs.display === "inline-flex") {
      add("Gap", cs.rowGap !== "normal" ? cs.rowGap : "");
      if (cs.columnGap !== cs.rowGap) add("Gap", cs.columnGap !== "normal" ? cs.columnGap : "");
    }
    const pads = new Set([cs.paddingTop, cs.paddingRight, cs.paddingBottom, cs.paddingLeft]);
    for (const p of pads) add("Padding", p);
  }
  return Array.from(rows.values()).sort((a, b) => b.count - a.count || parseFloat(a.value) - parseFloat(b.value));
}

function UsageTable({ title, rows, showSample = false }: { title: string; rows: UsageRow[]; showSample?: boolean }) {
  if (!rows.length) return null;
  return (
    <div style={{ marginTop: "var(--core-space-6)" }}>
      <SectionHeading>{title}</SectionHeading>
      <SpecTableCard>
        <thead>
          <tr style={{ textAlign: "left", color: "var(--core-color-text-tertiary)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em", background: "var(--core-color-surface-subtle, rgba(0,0,0,0.03))" }}>
            <th style={{ padding: "var(--core-space-2) var(--core-space-4)", fontWeight: 700, width: "26%" }}>Role / property</th>
            <th style={{ padding: "var(--core-space-2) var(--core-space-4)", fontWeight: 700, width: "22%" }}>Token</th>
            <th style={{ padding: "var(--core-space-2) var(--core-space-4)", fontWeight: 700, width: "22%" }}>Value</th>
            <th style={{ padding: "var(--core-space-2) var(--core-space-4)", fontWeight: 700, width: showSample ? "10%" : "20%" }}>Count</th>
            {showSample && <th style={{ padding: "var(--core-space-2) var(--core-space-4)", fontWeight: 700, width: "20%" }}>Where seen</th>}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} style={{ borderTop: "1px solid var(--core-color-border-subtle)" }}>
              <td style={{ padding: "var(--core-space-2) var(--core-space-4)", fontWeight: 600, color: "var(--core-color-text-primary)", whiteSpace: "nowrap", verticalAlign: "top" }}>{r.label}</td>
              <td style={{ padding: "var(--core-space-2) var(--core-space-4)", fontFamily: "var(--typography-font-family-mono, monospace)", fontSize: 12, color: "var(--core-color-text-tertiary)", whiteSpace: "nowrap", verticalAlign: "top" }}>{r.token}</td>
              <td style={{ padding: "var(--core-space-2) var(--core-space-4)", color: "var(--core-color-text-secondary)", whiteSpace: "nowrap", verticalAlign: "top" }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                  {r.swatch && <span style={{ width: 14, height: 14, borderRadius: 3, background: r.swatch, border: "1px solid var(--core-color-border-subtle)", display: "inline-block", flexShrink: 0 }} />}
                  {r.swatch ? toHexColors(r.value) : r.value}
                </span>
              </td>
              <td style={{ padding: "var(--core-space-2) var(--core-space-4)", verticalAlign: "top" }}>{r.count}</td>
              {showSample && <td style={{ padding: "var(--core-space-2) var(--core-space-4)", fontSize: 12, color: "var(--core-color-text-tertiary)", verticalAlign: "top", maxWidth: 220, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.sample ?? "—"}</td>}
            </tr>
          ))}
        </tbody>
      </SpecTableCard>
    </div>
  );
}

/** Renders four usage tables (Typography, Color, Radius, Spacing) scanned
 *  live from everything rendered inside `root` — the token inventory for
 *  one whole screen, not one component. */
export function ScreenTokenUsage({ root, include = ["type", "color", "radius", "space"] }: { root: React.RefObject<HTMLElement>; include?: Array<"type" | "color" | "radius" | "space"> }) {
  const [tables, setTables] = useState<{ type: UsageRow[]; color: UsageRow[]; radius: UsageRow[]; space: UsageRow[] } | null>(null);

  useLayoutEffect(() => {
    const measure = () => {
      const r = root.current;
      if (!r) return;
      const elements = walk(r);
      setTables({
        type: scanTypography(elements),
        color: scanColors(r, elements),
        radius: scanRadius(r, elements),
        space: scanSpacing(r, elements),
      });
    };
    measure();
    const t = window.setTimeout(measure, 400);
    return () => window.clearTimeout(t);
  }, [root]);

  if (!tables) return null;
  return (
    <div>
      {include.includes("type") && <UsageTable title="Typography — every text role used on this screen" rows={tables.type} showSample />}
      {include.includes("color") && <UsageTable title="Color — every text / background / border used on this screen" rows={tables.color} />}
      {include.includes("radius") && <UsageTable title="Radius — corner radius used on this screen" rows={tables.radius} />}
      {include.includes("space") && <UsageTable title="Spacing — padding & gap used on this screen" rows={tables.space} />}
    </div>
  );
}

const pass = (label: string, token: string, value: string, note?: string): AnatomySpecRow => ({ label, token, value, standard: "pass", note });

/** Marks shared by every screen: the app shell regions (header, sidebar,
 *  main, footer) and the page gutter around the content. */
const SHELL_MARKS: AnatomyMark[] = [
  { kind: "padding", sel: ".cds-app-header", edges: ["left", "right"] },
  { kind: "padding", sel: ".cds-app-main" },
  { kind: "size", sel: ".cds-app-header", name: "Header", fill: "w" },
  { kind: "size", sel: ".cds-app-shell-sidebar", name: "Sidebar rail", fill: "h" },
  { kind: "outline", sel: ".cds-app-main" },
];

const SHELL_LAYERS: AnatomyLayer[] = [
  { node: "Header (topbar)", cls: ".cds-app-header", direction: "Horizontal", alignment: "Middle, space between", spacing: "Padding 0 / 24 · 1px bottom border", sel: ".cds-app-header" },
  { node: "Sidebar (rail)", cls: ".cds-app-shell-sidebar", direction: "Vertical", alignment: "Top center", spacing: "Items stacked, 1px right border", sel: ".cds-app-shell-sidebar" },
  { node: "Main content", cls: ".cds-app-main", direction: "Vertical", alignment: "Top left", spacing: "Padding 16", sel: ".cds-app-main" },
];

/** Screen-level anatomy: the same measured diagram every component has —
 *  green padding, orange spacing, purple size, blue outlines — drawn over a
 *  whole assembled screen. Shell regions are always marked; `marks`,
 *  `layers` and `specs` add what is specific to this screen. */
export function ScreenStructureAnatomy({
  width = 1040,
  marks = [],
  layers = [],
  specs,
  note,
  children,
}: {
  width?: number;
  marks?: AnatomyMark[];
  layers?: AnatomyLayer[];
  specs?: (q: AnatomyQuery) => AnatomySpecRow[];
  note?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <MeasuredAnatomy
      heading="Structure — header, sidebar, content & sections"
      width={width}
      maxScale={1}
      marks={[...SHELL_MARKS, ...marks]}
      layers={[...SHELL_LAYERS, ...layers]}
      specs={(q) => [
        pass("Header height", "core-layout-header-height", `${q.el(".cds-app-header").offsetHeight}px`),
        pass("Header side padding", "core-space-6", `${q.px(".cds-app-header", "padding-left")}px`),
        pass("Sidebar rail width", "core-layout-sidebar-rail", `${q.el(".cds-app-shell-sidebar").offsetWidth}px`),
        pass("Content padding", "core-space-4", `${q.px(".cds-app-main", "padding-top")}px`),
        ...(specs ? specs(q) : []),
      ]}
      note={note}
    >
      {children}
    </MeasuredAnatomy>
  );
}
