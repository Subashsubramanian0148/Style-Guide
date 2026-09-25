export type NavLink = { to: string; label: string };
export type NavSection = { title: string; links: NavLink[] };

function componentLink(anchor: string, label: string): NavLink {
  return { to: `/components#${anchor}`, label };
}

export const componentSections: NavSection[] = [
  {
    title: "Actions",
    links: [
      componentLink("button", "Buttons"),
      componentLink("icon-button", "Icon Button"),
    ],
  },
  {
    title: "Charts",
    links: [
      componentLink("line-chart", "Line Chart"),
    ],
  },
  {
    title: "Data Display",
    links: [
      componentLink("avatar", "Avatar"),
      componentLink("badge", "Badge"),
      componentLink("data-table", "Data Table"),
      componentLink("progress", "Progress"),
      componentLink("quick-links", "Quick links"),
      componentLink("table", "Table"),
    ],
  },
  {
    title: "Disclosure",
    links: [
      componentLink("accordion", "Accordion"),
      componentLink("separator", "Separator"),
      componentLink("skeleton", "Skeleton"),
    ],
  },
  {
    title: "Feedback",
    links: [
      componentLink("alert", "Alert"),
      componentLink("empty", "Empty"),
      componentLink("spinner", "Spinner"),
      componentLink("toast", "Toast"),
    ],
  },
  {
    title: "Forms",
    links: [
      componentLink("attachment", "Attachment"),
      componentLink("calendar", "Calendar"),
      componentLink("checkbox-radio", "Checkbox / Radio"),
      componentLink("date-picker", "Date Picker"),
      componentLink("input", "Input"),
      componentLink("input-icon", "Input (with icon)"),
      componentLink("input-group", "Input Group"),
      componentLink("payment-bank-fields", "Payment & Bank Fields"),
      componentLink("select", "Select"),
      componentLink("slider", "Slider"),
      componentLink("switch", "Switch"),
      componentLink("textarea", "Textarea"),
    ],
  },
  {
    title: "Layout",
    links: [
      componentLink("app-footer", "App footer"),
      componentLink("app-header", "App header"),
    ],
  },
  {
    title: "Navigation",
    links: [
      componentLink("pagination", "Pagination"),
      componentLink("sidebar", "Sidebar"),
      componentLink("stepper", "Stepper"),
      componentLink("tabs", "Tabs"),
    ],
  },
  {
    title: "Overlays",
    links: [
      componentLink("modal", "Modal"),
      componentLink("slideover", "Slideover"),
      componentLink("tooltip", "Tooltip"),
    ],
  },
];

export const componentLinks = componentSections.flatMap((section) => section.links);

export const totalComponentCount = componentLinks.length;

/** All components as one flat A-Z list, ignoring category — used to make the
 *  unified /components page and the sidebar read as a single alphabetical
 *  list instead of "alphabetical within each category, categories in their
 *  own order" (which looks unsorted once you stop thinking in categories). */
export const flatComponentLinks = [...componentLinks].sort((a, b) =>
  a.label.localeCompare(b.label, undefined, { sensitivity: "base" })
);

const flatAnchorOrder = new Map<string, number>();
flatComponentLinks.forEach((link, index) => {
  const anchor = link.to.split("#")[1];
  if (anchor && !flatAnchorOrder.has(anchor)) {
    flatAnchorOrder.set(anchor, index);
  }
});

/** CSS `order` for a component anchor in the flat A-Z arrangement. Safe to
 *  apply unconditionally — `order` is a no-op outside a flex/grid parent. */
export function flatOrderForAnchor(anchorId: string): number {
  return flatAnchorOrder.get(anchorId) ?? 999;
}

/** Anchors that live inside another component's section (Calendar inside
 *  Date Selection, Table inside Table & Data Table). They stay in the sidebar
 *  but don't take a section number, so the numbered sections run without gaps. */
const NESTED_ANCHORS = new Set(["calendar", "table"]);

const componentAnchorSectionIds = new Map<string, string>();
let sectionNumber = 0;
flatComponentLinks.forEach((link) => {
  const anchor = link.to.split("#")[1];
  if (anchor && !NESTED_ANCHORS.has(anchor) && !componentAnchorSectionIds.has(anchor)) {
    sectionNumber += 1;
    componentAnchorSectionIds.set(anchor, String(sectionNumber).padStart(2, "0"));
  }
});

/** Global section number (01–52) for a component anchor on the unified /components page. */
export function sectionIdForAnchor(anchorId: string): string | null {
  return componentAnchorSectionIds.get(anchorId) ?? null;
}

/** Render order for the unified /components page (category title → page module). */
export const componentPageOrder = componentSections.map((section) => section.title);
