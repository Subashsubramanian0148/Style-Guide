# CORE Design System

The design system for **CORE** — Congruent's cloud-native, AI-powered 401(k) recordkeeping
platform, built for recordkeepers, TPAs, and retirement plan providers who need a modern,
scalable alternative to legacy recordkeeping systems.

This repo is the shared visual/behavioral/accessibility foundation every CORE surface is
built from — the participant portal, the admin portal, and every recordkeeper/TPA's own
white-labeled instance of either. It ships a full component library, a three-tier design
token pipeline (primitive → semantic → component), multi-theme white-labeling, and a
documentation site with live, interactive examples of every component — not screenshots.

> **A note on brand names used in this repo:** wherever you see a client name like
> "Meridian" or "Northbridge" in a theme, screen mockup, or code sample, it's a fictional
> placeholder used only to demonstrate white-labeling. Nothing in this design system is
> built from, or represents, any real recordkeeper's or TPA's actual product.

## What's in the box

| Layer | What it owns | Where |
|---|---|---|
| **Tokens** | Primitive → semantic → component color/space/type/radius/elevation/motion/breakpoint scales | `packages/tokens/src` |
| **Components** | 56 built components (React + TypeScript), behavior + accessibility owned by CORE | `packages/core/src/components` |
| **Themes** | Per-client overrides (brand color, logo, radius scale, type family) — components never fork | `packages/themes/src` |
| **Docs site** | Every component's Anatomy diagram, full pages (Login/Dashboard/Table/Stepper/Slideover/Buttons), foundations, and this README's live counterpart | `apps/docs-site` |

## Structure

```
packages/
  tokens/     Design tokens — JSON source (primitives/semantic/component),
              compiled to CSS custom properties per theme+mode and a
              Bootstrap-shaped SCSS export (packages/tokens/dist/)
  core/       The component library (React + TypeScript), consumed as source
  themes/     Per-client theme definitions (core / meridian / clientb),
              each overriding primitive tokens only — never component code
apps/
  docs-site/  The documentation site (this is what gets deployed) — every
              component, foundation, pattern, and full example screen
```

## Token architecture

Three tiers, each a JSON file in `packages/tokens/src`, compiled by
`packages/tokens/scripts/build.mjs`:

1. **`primitives.json`** — raw scales with no meaning attached: `color.brand.50–950`,
   `space.0–24`, `font.size.xs–5xl`, `radius.none–full`, `elevation.0–4`,
   `breakpoint.sm–xxl` (Bootstrap's own breakpoint values), `container.maxWidth.*`,
   `gradient.*`, `layout.*` (header height, sidebar widths).
2. **`semantic.json`** — light/dark role mapping (`color.text.primary`, `color.action.primary.bg`,
   `color.status.success.bg`, …), each referencing a primitive.
3. **`component.json`** — component-specific aliases (`button.radius`, `card.shadow`,
   `stepper.marker.completeBg`, …), each referencing a semantic or primitive token.

The build script resolves all three into CSS custom properties, scoped per theme via
`[data-theme][data-mode]` attribute selectors — flipping a theme or mode never touches
component code. It also emits a Bootstrap-shaped SCSS export
(`packages/tokens/dist/core.tokens.scss`) with a direct bridge into Bootstrap's own
`$primary`/`$spacer`/`$font-size-base` variables, for teams whose build already compiles Sass.

Full reference: the [Tokens (SCSS)](apps/docs-site/src/pages/Tokens.tsx) page in the docs site.

## Components (56 built)

Actions (Button, Icon Button, Link, Button Group) · Forms (Input, Textarea, Select,
Checkbox/Radio, Switch, Toggle/Toggle Group, Input Group, Input OTP, Slider, Combobox, Date
Picker, Calendar, Attachment, Payment & Bank Detail Fields) · Data Display (Card, Badge,
Table, Data Table, Item, Description List, Avatar, Progress, Aspect Ratio) · **Charts**
(Line Chart, Bar Chart — built on [Recharts](https://recharts.org/)) · Disclosure
(Collapsible, Accordion, Separator, Skeleton) · Navigation (Navigation Menu, App Sidebar —
shell/panel/rail variants, Tabs, Breadcrumb, Stepper, Pagination) · Feedback (Alert, Toast,
Toast Manager, Empty, Spinner) · Overlays (Modal, Confirmation Dialog, Drawer/Slideover,
Dropdown Menu, Tooltip, Popover, Hover Card) · **Questionnaire** (single-question-per-step
assessment flow) · Layout (App Header, App Footer, App Shell, Grid/Container).

The full, kept-current build list — status, source file, and what shadcn/Bootstrap/real
cross-checks it was validated against — is [COMPONENT-LIBRARY.md](COMPONENT-LIBRARY.md).

Every component has a full visual **Anatomy diagram** (numbered callouts + leader lines,
self-measured off the component's real rendered size — never hand-coded pixel positions).

## Foundations

Color (primitive scales, semantic roles, a full light/dark comparison table, gradients),
Typography (Inclusive Sans, an even-number type scale), Spacing & Sizing, Radius &
Elevation, Icons, Motion, **Layout & Grid** (App Header/Footer Anatomy, the sidebar's three
responsive states, a 12-column Grid + Container on Bootstrap's own breakpoint scale), and
**Responsive & Mobile** (the same breakpoint reference plus a component-by-component
responsive-safety checklist).

## Accessibility

A full WCAG 2.2 checklist (all 55 success criteria, A/AA) lives on the
[Accessibility](apps/docs-site/src/pages/Accessibility.tsx) page, tracking what's owned by
CORE's components vs. what the consuming product must still supply (e.g. meaningful alt
text). Real defects found and fixed during build, not just documented as intent:

- `DataTable`'s column filters were a native `<select>` — the only component found relying
  on a browser control instead of CORE's own; replaced with the real `Select`.
- Every chart (`LineChartCard`/`BarChartCard`) ships a real, visually-hidden data table
  alongside its `aria-hidden` SVG — a chart is non-text content (WCAG 1.1.1); an
  `aria-label` summary is not an equivalent.
- A systemic bug where real interactive overlays (Modal, Drawer, Toast) rendered completely
  unstyled outside of an explicitly-themed demo box — traced to `--core-*` tokens only
  existing inside a `[data-theme][data-mode]` scope with no unscoped fallback — fixed by
  theming the app shell at its one true root.

## Screens & Patterns

Full assembled product screens — Login, Dashboard, Transactions (table), Withdrawal
request (stepper), Add Allocation (slideover), Account actions (buttons) — built entirely
from the components and tokens above via the same `AppShell`/`Grid` primitives, with
Anatomy pointers on the header/sidebar/grid/footer. See
[Screens](apps/docs-site/src/pages/Screens.tsx) and [Patterns](apps/docs-site/src/pages/Patterns.tsx).

## Requirements

- Node.js ≥ 18.18
- npm (workspaces-based monorepo — no other package manager is set up)

## Local development

```bash
npm install
npm run dev
```

Opens the docs site at `http://localhost:5173`.

## Building

```bash
npm run build
```

Runs, in order: token compilation (`packages/tokens`), the core package build, then the
docs site build. Output lands in `apps/docs-site/dist` — that directory is the deployable
artifact.

## Hosting

The docs site is a static single-page app using `HashRouter`, so it needs **no server-side
rewrite rules** — every route already lives under one real path (`/#/...`). This repo ships
ready-to-use config for three common hosts:

| Host | Config file | Notes |
|---|---|---|
| Netlify | [`netlify.toml`](netlify.toml) | Build command `npm run build`, publish `apps/docs-site/dist` |
| Vercel | [`vercel.json`](vercel.json) | Same build command/output directory |
| GitHub Pages | [`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml) | Builds and deploys on every push to `main` — enable Pages in the repo's Settings → Pages, source "GitHub Actions" |

All three point at the same build command and output directory, so no host-specific code
changes are needed to switch between them.

## Project history

For a chronological record of how this design system was built — every decision, fix, and
course-correction — see [PROJECT-LOG.md](PROJECT-LOG.md). For the live component build
status, see [COMPONENT-LIBRARY.md](COMPONENT-LIBRARY.md).
