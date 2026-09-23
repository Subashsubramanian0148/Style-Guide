# CORE Component Library — Build List

Base references:
- [shadcn/ui components](https://ui.shadcn.com/docs/components) (64 items) — the target component surface.
- [Bootstrap 5](https://getbootstrap.com/docs/5.3/components/) — the layout/responsive foundation (grid, containers,
  breakpoints, flex utilities). Per the CORE scope doc §5, Bootstrap supplies **layout only**; CORE owns visual
  design, behavior, states, and accessibility even where a Bootstrap component of the same name exists. A "Yes" in
  the Bootstrap column means Bootstrap ships a same-purpose component CORE deliberately does **not** reuse
  as-is — it's rebuilt as a CORE component consuming CORE tokens. A "—" means Bootstrap has no equivalent
  (shadcn-only pattern) or the item is a pure Bootstrap layout primitive with no CORE component needed.

This is the master checklist for CORE's component coverage. Update the **Status** column as work lands — don't
let this drift from `packages/core/src/components/`.

## Anatomy rollout tracker

Every component has a full visual numbered-callout Anatomy diagram (self-measuring via
[AutoAnatomy.tsx](apps/docs-site/src/AutoAnatomy.tsx), which reads each component's real rendered bounding box
and places leader lines/chips off its edges — no hand-coded pixel coordinates per component). Button was built
first as the hand-coordinate template ([Anatomy.tsx](apps/docs-site/src/Anatomy.tsx)); every component after it
uses AutoAnatomy.

**✅ Has a full visual Anatomy diagram (all components):**
- **Actions:** Button, Icon Button, Link, Button Group
- **Forms:** Input, Textarea, Select, Checkbox, Switch, Toggle, Toggle Group, Input Group, Input OTP, Slider,
  Combobox, Date Picker, Calendar, Attachment/Dropzone, Payment & Bank Detail Fields (card number, expiration/CVC,
  routing/account number)
- **Data Display:** Card, Badge, Table, Data Table, Item, Description List, Avatar, Progress, Aspect Ratio
- **Disclosure:** Collapsible, Accordion, Separator, Skeleton
- **Navigation:** Navigation Menu, Sidebar, Tabs, Breadcrumb, Stepper, Pagination
- **Feedback:** Alert, Toast, Empty, Spinner
- **Layout:** App Header, App Footer, Grid/Container (App Shell is the composition of these plus a Sidebar —
  see [`/foundations/layout-grid`](apps/docs-site/src/pages/LayoutGrid.tsx))
- **Overlays:** Modal, ConfirmDialog, Drawer/Slideover, Dropdown Menu, Tooltip, Popover, Hover Card

Note: overlay components that only render while open (Modal, ConfirmDialog, Drawer, Dropdown Menu, Tooltip,
Popover, Hover Card) use a static always-visible mock built from the same tokens/markup as the real component,
since AutoAnatomy needs a persistently-mounted element to measure — the live triggerable component still sits
below each diagram for interaction.

Next batch, in priority order (most-used first): Modal/Drawer, Tabs, Alert/Toast, Dropdown Menu, Tooltip/Popover,
Stepper, Pagination, Accordion.

## Cross-check against the LendGuard app's own design-system branch

Per instruction, [Satish0024/S_PPT (design-system branch)](https://github.com/Satish0024/S_PPT/tree/design-system) —
the real LendGuard participant portal's own design-system page — was used **only** as a source for LendGuard's
actual brand color and logo files (nothing else was referenced, copied, or touched):

- **Color**: LendGuard's real primary is `#0270A9` (a blue), sourced from `src/config/brand.js` /
  `src/styles/index.css` in that repo. The [LendGuard theme](packages/themes/src/lendguard.json) was corrected to
  this real value — it was previously an invented green, which was wrong.
- **Logo**: `logo-lockup-light.svg` / `logo-lockup-dark.svg` copied byte-for-byte from that repo's `/public` into
  [`apps/docs-site/public/brand/lendguard/`](apps/docs-site/public/brand/lendguard/) and now renders on the
  [Themes page](apps/docs-site/src/pages/Themes.tsx). `core-logo.svg` in that repo was **not** used — it appears
  to be a different, possibly third-party mark unrelated to LendGuard's own identity, and out of scope for "color
  and logo only."

Its `DesignSystem.jsx` page was also read to **audit CORE's component coverage** against a second real-world
reference (in addition to shadcn/Bootstrap above) — no code, CSS, or layout from it was adopted. Findings:

| Their component | Covered by CORE? |
|---|---|
| Buttons (primary/secondary/ghost/danger, sm/md/lg, **icon buttons**) | Was missing **Icon Button** entirely — now added (`IconButton` in `Button.tsx`) |
| Forms & inputs (input/select, sm/md/lg, error, helper) | ✅ covered |
| Checkbox / radio / switch | ✅ covered (now with indeterminate + RadioGroup) |
| Badges & alerts | ✅ covered |
| Navigation (nav links) | ✅ covered |
| **Tabs & step navigator** | Tabs covered; the **Stepper** (step navigator) was missing — now added (`Stepper` in `Navigation.tsx`) |
| Tables (zebra striping) | Table existed but had no zebra option — now added (`zebra` prop) |
| Dialogs & modals | ✅ covered |
| Chart legend ("+N more" overflow) | Chart itself now built (`Chart.tsx`, see #15 above); the "+N more" legend-overflow truncation specifically is not yet implemented |
| Accessibility toolbar (vision profile, read-aloud, voice nav, text scaling) | Not built — this is an app-level feature (Web Speech API integration), not a reusable design-system component; flagged as a notable pattern but out of scope for CORE itself |
| Link (used inline in their forms/content) | Was missing as an explicit component — now added (`Link` in `Button.tsx`), distinct from Tertiary button |

**Net result: 3 real gaps found and fixed** (Icon Button, Stepper, Table zebra option) — all three were also
implied by the original scope doc (§10 lists "Button, Icon Button, Link" under Actions) or Metronic's catalog
(Stepper), so this cross-check caught something the shadcn/Bootstrap pass alone had missed.

Status legend: ✅ Built · ⚠️ Partial (thin variants) · ❌ Not started · ⛔ Out of scope

| # | shadcn component | Bootstrap equiv. | CORE name | Status | CORE file | Variants / states built |
|---|---|---|---|---|---|---|
| 1 | Accordion | Accordion | Accordion | ✅ | `Disclosure.tsx` | single/multi-open, default-open, keyboard |
| 2 | Alert | Alerts | Alert | ✅ | `Misc.tsx` | success/warning/danger/info tones |
| 3 | Alert Dialog | Modal | ConfirmDialog | ✅ | `Overlays.tsx` | standard + danger variant |
| 4 | Aspect Ratio | Ratio | — | ❌ | — | low priority, add on demand |
| 5 | Attachment | — | Dropzone / AttachmentList | ✅ | `Attachment.tsx` | drag-drop, browse, file list, remove |
| 6 | Avatar | — | Avatar | ✅ | `DataDisplay.tsx` | sm/md/lg, image + initials fallback, status dot, `AvatarGroup` stack |
| 7 | Badge | Badge | Badge | ✅ | `Misc.tsx` | 5 tones × soft/outline/solid × sm/md |
| 8 | Breadcrumb | Breadcrumb | Breadcrumb | ✅ | `Navigation.tsx` | current-page marking |
| 9 | Bubble | — | — | ⛔ | — | chat UI, not applicable to retirement portal |
| 10 | Button | Buttons | Button | ✅ | `Button.tsx` | primary/secondary/tertiary/destructive × sm/md/lg × default/hover/focus/pressed/disabled/loading |
| 11 | Button Group | Button group | ButtonGroup | ✅ | `Primitives.tsx` | segmented merge of any Button variant |
| 12 | Calendar | Datepicker (via plugin, not core BS) | Calendar | ✅ | `Calendar.tsx` | month grid, prev/next, min/max disable |
| 13 | Card | Card | Card | ✅ | `Misc.tsx` | default/outlined/interactive variants |
| 14 | Carousel | Carousel | — | ⛔ | — | marketing pattern, excluded by scope doc |
| 15 | Chart | — | LineChartCard / BarChartCard | ✅ | `Chart.tsx` | Built on [Recharts](https://recharts.org/) (MIT); CORE owns tokens for every color/font/stroke and provides a visually-hidden data-table alternative for WCAG 1.1.1 |
| 16 | Checkbox | Forms (checks) | Checkbox | ✅ | `FormControls.tsx` | checked/unchecked/disabled/indeterminate |
| 17 | Collapsible | Collapse | Collapsible | ✅ | `Primitives.tsx` | generic single-panel disclosure primitive |
| 18 | Combobox | — | Combobox | ✅ | `Combobox.tsx` | search/filter, keyboard-navigable option list |
| 19 | Command | — | — | ⛔ | — | cmd-K palette, low value in a portal |
| 20 | Context Menu | — | — | ⛔ | — | right-click menu, low value in a portal |
| 21 | Data Table | Table | DataTable | ✅ | `DataDisplay.tsx` | sortable columns, client pagination |
| 22 | Date Picker | — | DatePicker | ✅ | `Calendar.tsx` | Popover + Calendar composition |
| 23 | Dialog | Modal | Modal | ✅ | `Overlays.tsx` | title/body/actions, focus trap, Escape-to-close |
| 24 | Direction | — | — | ⛔ | — | RTL utility, revisit if a client requires RTL |
| 25 | Drawer | Offcanvas | Drawer | ✅ | `Overlays.tsx` | right-side panel overlay |
| 26 | Dropdown Menu | Dropdowns | DropdownMenu | ⚠️ | `Overlays.tsx` | trigger + item list + danger item + separators — **missing:** submenus, checkbox/radio items |
| 27 | Empty | — | Empty | ✅ | `Primitives.tsx` | icon + title + description + action |
| 28 | Field | Forms (form-group) | Field | ✅ | `Field.tsx` | label/hint/error wiring via aria-describedby |
| 29 | Hover Card | — | HoverCard | ✅ | `HoverCard.tsx` | hover/focus-triggered rich preview |
| 30 | Input | Forms (form-control) | Input | ⚠️ | `Field.tsx` | default/hover/focus/error/disabled — **missing:** leading/trailing icon slot as first-class prop |
| 31 | Input Group | Input group | InputGroup | ✅ | `ToggleInputs.tsx` | prefix/suffix addons |
| 32 | Input OTP | — | InputOTP | ✅ | `ToggleInputs.tsx` | auto-advance digit boxes |
| 33 | Item | List group | Item | ✅ | `Primitives.tsx` | generic list row (title/description/action) |
| 34 | Kbd | — | — | ❌ | — | trivial to add, low priority |
| 35 | Label | Forms (form-label) | — | ✅ | (inside `Field.tsx`) | not exposed standalone — always used via Field |
| 36 | Marker | — | — | ⛔ | — | niche annotation component |
| 37 | Menubar | Navbar | — | ⛔ | — | desktop-app pattern, not portal-relevant |
| 38 | Message | — | — | ⛔ | — | chat UI |
| 39 | Message Scroller | — | — | ⛔ | — | chat UI |
| 40 | Native Select | Forms (form-select) | Select | ✅ | `FormControls.tsx` | native `<select>`, full OS a11y |
| 41 | Navigation Menu | Navbar / Nav | NavigationMenu | ✅ | `Navigation.tsx` | top nav bar, current-page state |
| 42 | Pagination | Pagination | Pagination | ✅ | `Navigation.tsx` | prev/next, page numbers, current |
| 43 | Popover | Popovers | Popover | ✅ | `Overlays.tsx` | click-triggered floating panel |
| 44 | Progress | Progress | Progress | ✅ | `DataDisplay.tsx` | determinate + indeterminate (animated) |
| 45 | Questionnaire *(New)* | — | Questionnaire | ✅ | `Questionnaire.tsx` | Single-question-per-step flow (e.g. risk tolerance), composed from Progress + RadioGroup + Button |
| 46 | Radio Group | Forms (radios) | RadioGroup | ✅ | `FormControls.tsx` | `role="radiogroup"`, managed value/onChange |
| 47 | Resizable | — | — | ⛔ | — | pane-resize, not needed in a portal |
| 48 | Scroll Area | — | — | ⛔ | — | native scroll is sufficient |
| 49 | Select | Forms (form-select) | Select | ✅ | `FormControls.tsx` | see Native Select |
| 50 | Separator | — (`<hr>` / `vr`) | Separator | ✅ | `Disclosure.tsx` | horizontal/vertical |
| 51 | Sheet | Offcanvas | Drawer | ✅ | `Overlays.tsx` | same component as Drawer |
| 52 | Sidebar | Offcanvas / Nav | AppSidebar | ✅ | `Navigation.tsx` | vertical app-shell nav |
| 53 | Skeleton | Placeholders | Skeleton | ✅ | `Disclosure.tsx` | shimmer placeholder, reduced-motion aware |
| 54 | Slider | Forms (range) | Slider | ✅ | `Primitives.tsx` | range input, formatted value readout |
| 55 | Spinner | Spinners | Spinner | ✅ | `Overlays.tsx` | reduced-motion aware |
| 56 | Switch | Forms (switch) | Switch | ✅ | `Misc.tsx` | on/off, focus ring |
| 57 | Table | Tables | Table | ✅ | `DataDisplay.tsx` | basic semantic table (see also Data Table) |
| 58 | Tabs | Nav / Tabs | Tabs | ✅ | `Navigation.tsx` | ARIA tablist/tab/tabpanel |
| 59 | Textarea | Forms (textarea) | Textarea | ✅ | `FormControls.tsx` | resize, error state |
| 60 | Toast | Toasts | Toast | ⚠️ | `Overlays.tsx` | tone-based toast card — **missing:** a toast manager/stacking + auto-dismiss timer |
| 61 | Toggle | — (button `.active`) | Toggle | ✅ | `ToggleInputs.tsx` | pressed state |
| 62 | Toggle Group | Button group (checkbox/radio) | ToggleGroup | ✅ | `ToggleInputs.tsx` | single-select segmented toggle |
| 63 | Tooltip | Tooltips | Tooltip | ✅ | `Overlays.tsx` | hover + focus triggered |
| 64 | Typography | Typography utilities | — | ✅ | (Foundations page, not a component) | Display/H1–H6/Lead/Body/Label/Caption/Numeric, Bootstrap-aligned rem scale |

## Additional components beyond the shadcn baseline

Not in shadcn's 64-item list, but required by CORE's own scope doc (§10) and/or surfaced by the Metronic and
LendGuard cross-checks above:

| CORE name | Status | CORE file | Source that flagged it |
|---|---|---|---|
| Icon Button | ✅ | `Button.tsx` | CORE scope doc §10 ("Button, Icon Button, Link"); LendGuard app |
| Link | ✅ | `Button.tsx` | CORE scope doc §10; LendGuard app |
| Stepper | ✅ | `Navigation.tsx` | Metronic catalog ("Stepper — Exclusive"); LendGuard app ("step navigator") |
| App Header | ✅ | `Layout.tsx` | Missing entirely — flagged directly against the real LendGuard participant portal's own header (brand + help/theme/avatar) |
| App Footer | ✅ | `Layout.tsx` | Missing entirely — flagged directly against the real LendGuard participant portal's own footer (copyright + legal links) |
| App Shell | ✅ | `Layout.tsx` | The header/sidebar/main/footer composition the participant portal actually uses on every screen — was implicit/hand-assembled per page until this pass |
| Grid / Container | ✅ | `Layout.tsx` | See note below — CORE now owns a token-driven grid instead of deferring to raw Bootstrap classes |

Note on Grid/Container: the "Bootstrap components CORE deliberately does not adopt as-is" section below
originally deferred Grid/Containers/Breakpoints straight to Bootstrap's own classes with no CORE component. That
no longer matches reality — `Grid`/`GridCol`/`Container` in `Layout.tsx` are real CORE components now, because a
raw Bootstrap `.row`/`.col` doesn't carry CORE's own `space.*` gap tokens or the white-label theme's breakpoint
overrides. Bootstrap's breakpoint *values* (`packages/tokens/src/primitives.json`'s `breakpoint.*`/`container.*`)
are still the reference scale — just resolved through CORE's own token pipeline rather than Bootstrap's SCSS.

## Bootstrap components CORE deliberately does not adopt as-is

Per scope §5/§18 ("do not simply restyle Bootstrap components," "no duplicate Bootstrap components without CORE
value"), these Bootstrap 5 components are **not** planned as separate CORE components because they're either
superseded by a shadcn-pattern equivalent above, or are pure layout/utility with no visual-system decision to own:

- **Flex/Spacing utilities** — used directly from Bootstrap-equivalent CSS, no CORE component needed.
  (Grid/Container are *no longer* in this list — see the note above the "Additional components" table: they're
  now real, token-driven CORE components in `Layout.tsx`.)
- **Navbar** — superseded by CORE's `NavigationMenu` + `AppSidebar`.
- **Offcanvas** — superseded by CORE's `Drawer`.
- **List group** — superseded by CORE's `Item`.
- **Placeholders** — superseded by CORE's `Skeleton`.
- **Ratio** — not yet needed; add as a thin utility class if a media-embed use case appears.

---

## Website coverage

Every ✅/⚠️ component in the table above now has a live, working demo on the docs site (not just an export in
`packages/core`) — verified by cross-referencing every export in `packages/core/src/components/*.tsx` against
every import in `apps/docs-site/src/pages/*.tsx`. `Collapsible` and inline `Calendar` were the last two gaps
(previously only reachable indirectly via Accordion/DatePicker) — both now have their own explicit sections on
the Disclosure and Forms pages respectively. App Header/App Footer/App Shell/Grid have their own dedicated demo
page, [`/foundations/layout-grid`](apps/docs-site/src/pages/LayoutGrid.tsx) — they'd previously only existed
as one-off inline markup inside `Screens.tsx`'s full-page mockups, with no standalone Anatomy section of their
own the way every other component gets.

## Summary

- **✅ Fully built:** 49 from the shadcn baseline (Chart and Questionnaire now built) + 7 additional (Icon Button, Link, Stepper, App Header, App Footer, App Shell, Grid/Container) = 56
- **⚠️ Built but thin:** 3 (Dropdown Menu, Input, Toast)
- **❌ Not started, in scope:** 2 (Aspect Ratio, Kbd)
- **⛔ Out of scope:** 10 (chat components, Carousel, Command, Context Menu, Menubar, Resizable, Scroll Area, Direction, Marker)

## Hardening pass — status

1. ✅ **Badge** — outline + solid styles added (was soft-only), sm/md sizes added
2. ✅ **Card** — `default` / `outlined` / `interactive` variants added (was one flat style)
3. ✅ **Avatar** — status dot (online/away/offline) + `AvatarGroup` stack-with-overflow added
4. ✅ **Checkbox** — `indeterminate` prop added (real DOM property, not just a class)
5. ✅ **Progress** — `indeterminate` animated state added (reduced-motion aware)
6. ✅ **Radio Group** — formal `RadioGroup` wrapper added (`role="radiogroup"`, single value/onChange)
7. ❌ **Input** — still needs a first-class leading/trailing icon slot prop
8. ❌ **Dropdown Menu** — still needs submenus, checkbox items, radio items
9. ❌ **Toast** — still needs a `ToastProvider`/manager with stacking + auto-dismiss timer

## Remaining scope decisions

- **Aspect Ratio, Kbd** — trivial, will add opportunistically.
- **Everything marked ⛔** — flagged as out of scope per the project's own scope doc (§18: no chat UI, no marketing/carousel, no desktop-app menu patterns). Confirm if any should be reconsidered.
