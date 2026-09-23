# Manager Feedback — Action Plan

Reference for "the old version": [coreppt-design-system.netlify.app](https://coreppt-design-system.netlify.app/) —
confirmed by browsing it directly that this is the **same LendGuard app's own internal `DesignSystem.jsx` page**
we've already pulled color/logo from (Satish0024/S_PPT, `design-system` branch), just deployed standalone. So
"the old version" and "the LendGuard app's design-system page" are the same artifact — one important new fact
from re-reading it: **LendGuard's brand blue is not one color, it's two** — `#0270A9` in light mode and a
distinctly different lighter cyan `#38BDF8` in dark mode (not a computed tint of the light one). This directly
explains why "color is still the issue" — our LendGuard theme likely only carries the light-mode value.

Status legend: ✅ Done · 🟡 Partial/needs verification · ❌ Not started · ⚠️ Needs your decision (conflicts with a
choice CORE already made deliberately)

| # | Feedback | Status | Notes / Action |
|---|---|---|---|
| 1 | Need a proper banner representing CORE design system | 🟡 | Home page has a hero section with a banner image (`hero-core.jpg`) already — needs a visual review against what "proper" means to your manager (their old site's hero is plain text, no image, so ours may already exceed this — confirm intent). |
| 2 | Remove text "3 theme based" | 🟡 | Likely refers to homepage stat tiles calling out theme/token counts as marketing copy. Our stat tiles currently show counts (components/token tiers/themes/WCAG) similar in spirit to the old site's "3 Brand themes" tile. **Action:** confirm exactly which line to remove, then drop it. |
| 3 | Remove profile option | ✅ | The old site's design-system page has a fake user-avatar/profile dropdown in its header (`user-menu`/`user-chip`) — ours has no such element. Nothing to remove. |
| 4 | Add secondary and tertiary **color** and mention its usage | ⚠️ | CORE deliberately does **not** give Secondary/Tertiary buttons their own hue (documented rationale on the Color page: hierarchy via less fill, not new colors — matches Atlassian/Material practice). This directly conflicts with the request for named secondary/tertiary *colors*. **Needs your decision**: keep CORE's one-hue-hierarchy approach and re-explain it more clearly, or add real secondary/tertiary brand colors (a real scope change, affects theming). |
| 5 | Give split-up of color like primary, secondary, and neutrals | ⚠️ | Same decision as #4 — our Color page already splits Primary / Tag colors / Neutrals / Status, just doesn't have a named "Secondary" hue. |
| 6 | Check typography | 🟡 | Needs a fresh QA pass — no specific issue named. Will re-verify all 14 roles, desktop/mobile pairs, and contrast once we're fixing. |
| 7 | Icons should only have Font Awesome Pro + a download option | ✅ | Already done — Icons foundation page specifies FA6 Pro, loads Free as a class-compatible placeholder, links to the official FA download/Kit pages (no redistributed Pro assets). |
| 8 | Add a Footer component to the application, document it here | ❌ | No `Footer` component exists yet. **Real gap** — needs building (component + docs page + usage guidance). |
| 9 | Shadow property missing, need to add | 🟡 | We do have an Elevation foundation page with a shadow scale — but if this feedback was against the *old* site (which also has `--shadow`/`--shadow-lg`), it may mean something more specific (e.g. shadow missing on a particular component like Card or Dropdown). Needs the specific case identified. |
| 10 | Change danger text in button, improve button styles and variables | 🟡 | Needs a specific side-by-side review of our Destructive button vs. what's wrong — not enough detail yet to act on. Will review contrast/copy on the Destructive variant. |
| 11 | Remove "status of uses" from components | 🟡 | The old site's tables have a `Status: Used` column (a build QA artifact) — if this refers to our docs site, we don't show that column anywhere public-facing (it only lives in our internal `COMPONENT-LIBRARY.md`, not the live site). If it refers to something else, needs clarification. |
| 12 | Label and placeholder need to be proper — check and implement | 🟡 | Needs an audit pass: are labels always visible (never placeholder-only), is placeholder text used correctly (a hint, never a replacement for a label)? We believe this is already correct (Field always renders a real `<label>`) but will re-verify systematically. |
| 13 | Label need proper | 🟡 | Duplicate of #12 — will fold into the same audit. |
| 14 | Add sorting and input (search/filter) in table — currently missing | 🟡 | Sorting **exists** on `DataTable` (client-side, column-header click). Search/filter input inside the table itself does not exist yet — **real gap**, needs a `searchable` prop or a companion filter-bar pattern. |
| 15 | Checkbox uses Tailwind color, update to current version | ❌ | Needs investigation — our `Checkbox` is CSS-only (no Tailwind), so this feedback was likely against the *old* site (which may use Tailwind-named colors like `sky-500`). Will verify our current Checkbox has zero non-token colors (should already be true, but confirming explicitly). |
| 16 | Navigation needs to be added | 🟡 | We have `NavigationMenu` and `AppSidebar` already built and documented. If this means something more specific (e.g. a full working top-nav pattern combining logo + nav + user menu), needs clarification — otherwise likely already satisfied. |
| 17 | Tabs hover and disabled states need to be added | ❌ | Confirmed real gap — our `Tab` button has selected/default/focus styling but no explicit hover treatment beyond default, and no `disabled` tab state at all. |
| 18 | Zebra table needs proper variation | 🟡 | We added a `zebra` boolean to `Table` — "proper variation" may mean it needs to also work correctly with `DataTable` (sortable) and in dark mode; will verify both. |
| 19 | Dialog box needs variants | ❌ | Our `Modal`/`ConfirmDialog` are single-style. Metronic-style variants (size: sm/md/lg/fullscreen; a "scrollable body" variant; a "centered vs. top-aligned" variant) are not built. **Real gap.** |
| 20 | Check and add A11y checklist | 🟡 | We have an Accessibility page with a requirements table, but it's a general overview, not a structured checklist format. |
| 21 | Section-wise proper split of WCAG | 🟡 | Related to #20 — the old site organizes its a11y content as separate sections (WCAG checklist / Keyboard interaction / Screen reader & NVDA / Color contrast / Layout & breakpoints / Interaction states / Content & tone) as **distinct pages/sections**, not one page. Ours is currently one flat page — **real structural gap**. |
| 22 | NVDA check | ❌ | Not done — we have never run an actual NVDA screen-reader pass against the live components; our accessibility claims are structural (correct ARIA/roles) but not verified with a real screen reader. **Real gap**, and the most labor-intensive one — needs a dedicated testing pass, ideally with real NVDA or VoiceOver, not just code review. |
| 23 | Check color and typography | 🟡 | Duplicate of #6 — folding into the same QA pass. |
| 24 | Layout and breakpoints need to be checked for all screens | ❌ | We have not done a systematic responsive QA pass (mobile/tablet/desktop) across every docs page and every component. **Real gap.** |
| 25 | Check UX specification and fix | 🟡 | No UX spec document has been shared with us yet to check against — needs the actual spec doc from you before this can be actioned. |
| 26 | "First create a design system, then apply to application, then fix the application" | ✅ (methodology, ongoing) | This is the sequencing principle we've been following throughout — CORE built independently first, portal/app changes come after. No component has been built by copying the existing app's visual design. |

## The two items you raised again just now, called out separately

### Color — LendGuard blue is still wrong
Re-browsing the reference confirms the dark-mode brand color is a **separate, distinct hex** (`#38BDF8`), not a
tint/shade of the light-mode one (`#0270A9`) the way our current ramp assumes. Our `lendguard.json` theme only
encodes one brand ramp used for both modes. **Action:** add a light-mode ramp (base `#0270A9`, already correct)
and a **separate** dark-mode brand override (base `#38BDF8`), matching the real app's actual light/dark split —
this is a real, previously-missed gap, not a repeat of already-fixed work.

### More states/variants per component, organized like Metronic (one page per component)
Confirmed by re-viewing Metronic's sidebar: **Accordion, Buttons, Alerts, Badges, Breadcrumb, Cards, Modal,
Pagination, Popovers, Tables, Tabs, Toasts, Tooltips** etc. are each their **own top-level nav item / page**, not
grouped 5-at-a-time under a category page the way ours currently are (`Disclosure` bundles Accordion+Collapsible+
Separator+Skeleton onto one page, `Overlays` bundles 7 components onto one page, etc.). This is an information-
architecture gap on top of the variant-depth gaps already tracked in `METRONIC-GAP-CHECKLIST.md` — even where a
component's variant coverage is fine, it's harder to find and reference when 5–7 components share one URL/page.
**Action:** split each component onto its own page/route (a bigger refactor of the docs site's page structure,
not just adding more variant markup).

## Recommended fix order

1. **LendGuard dual-brand color fix** (light `#0270A9` / dark `#38BDF8`) — quick, high-value, corrects a real
   data error.
2. **Split component pages one-per-component** (IA refactor) — do this before adding more variants, so new
   variant work lands on the right page structure from the start rather than needing to be moved twice.
3. **Real gaps with no ambiguity**: Footer component, Dialog variants, Tabs hover/disabled states, table
   search/filter input, zebra-table verification.
4. **Audit passes** (typography, labels/placeholders, checkbox colors, navigation completeness) — verify-and-fix,
   likely smaller diffs once inspected.
5. **Accessibility restructure**: split the one Accessibility page into the sectioned format (WCAG checklist /
   Keyboard / Screen reader & NVDA / Contrast / Layout & breakpoints / Interaction states / Content & tone).
6. **NVDA pass and responsive/breakpoint QA** — the two most time-intensive, do last once everything above is
   stable (no point re-testing screen-reader behavior before the component/page structure settles).
7. **Decisions needed from you** before touching: secondary/tertiary named colors (#4/#5), the exact "banner" and
   "remove 3 theme text" asks (#1/#2), and the UX specification document (#25) once you can share it.

Say which numbered item(s) to start with and I'll begin.
