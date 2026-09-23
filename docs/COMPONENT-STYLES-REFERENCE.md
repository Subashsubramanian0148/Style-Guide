# CORE Design System — Component Styles Reference

Generated reference for typography, color, spacing, and borders used by `cds-*` components.

**Sources:** `packages/tokens/src/*.json`, `packages/core/src/styles/components.css`

---

## 1. Text size

### Primitive scale (`font.size.*`)

| Token | Size |
|-------|------|
| xs | 12px |
| sm | 14px |
| md | 16px |
| lg | 20px |
| xl | 24px |
| 2xl | 28px |
| 3xl | 32px |
| 4xl | 40px |
| 5xl | 48px |

### Typography roles

Headings **h1–h6** (32px down to 14px on desktop; smaller on mobile). Body scale **text32 / text28 / text24 / text20 / text16 / text14 / text12** in Regular, Medium, SemiBold, Bold. Special: **eyebrow** (12px, weight 800), **numericData** (14px, weight 600).

### Typical component usage

| Component | Text size |
|-----------|-----------|
| Button sm / md / lg | 12px / 14px / 16px (semibold) |
| Input sm–md / lg | 14px / 16px |
| Label | typography label token |
| Hint / error | 12px |
| Tab | body-lg |
| Table / alert | body-md |
| Breadcrumb | body-md |
| Step marker | body-xs |
| OTP digit | 20px, weight 600 |

---

## 2. Typeface

| Role | Font stack |
|------|------------|
| Sans (default UI) | Inclusive Sans, -apple-system, Segoe UI, sans-serif |
| Mono / numeric | Same stack; tabular figures via numericData role |

CSS variable: `--typography-font-family-sans`. Applied on theme root, buttons, inputs, cards, badges, tables, fields.

---

## 3. Color (text / foreground)

Semantic tokens (light mode examples):

- **Neutral text:** primary #1D1C24, secondary/tertiary #5C5C6B, inverse #FFFFFF
- **Brand text:** brand ramp 500/600/700; on-color white
- **Status:** success, warning, critical/danger, info/highlight — each with text, border, light and strong backgrounds
- **Disabled:** `--theme-semantics-disabled-text`

Components map variants (primary, secondary, destructive, semantic tones) to `--brand-*` and `--theme-semantics-*` variables.

---

## 4. Background

| Use | Token |
|-----|--------|
| Page | `--core-color-bg-page` |
| Default surface | `--core-color-surface-default` |
| Raised (header, sidebar) | `--core-color-surface-raised` |
| Sunken / hover | `--core-color-surface-sunken` |
| Overlay (modal, menu, drawer) | `--core-color-surface-overlay` |
| Primary actions | `--brand-background-primary-strong` (+ hover/active/disabled) |
| Semantic soft | `--theme-semantics-*-light-background` |
| Semantic solid | `--theme-semantics-*-strong-background` |
| Disabled fields | `--theme-semantics-disabled-background` |

---

## 5. Width and height

### Layout

| Token | Value |
|-------|-------|
| Header height | 64px |
| Footer min-height | 56px |
| Sidebar width | 220px |
| Sidebar rail | 96px |

### Control heights (`size.control.*`)

| Size | Height |
|------|--------|
| sm | 32px |
| md | 40px |
| lg | 48px |

### Fixed sizes (common)

| Element | Dimensions |
|---------|------------|
| Input md | 100% × min 40px |
| Input sm / lg | min 34px / 46px |
| Textarea | 100% × min 88px |
| Icon button | 32 / 40 / 48px square |
| Checkbox / radio | 18 × 18px |
| Switch track | 32 × 18px (thumb 14px) |
| Step marker | 28 × 28px |
| Avatar sm / md / lg | 24 / 36 / 48px |
| Modal | max-width 480px |
| Drawer | 360px × full viewport height |
| Menu | min-width 200px |
| Toast | width 280px |
| OTP cell | 40 × 44px |
| Quick link icon | 40 × 40px |
| Progress bar | height 8px |

---

## 6. Padding

Space scale (`--core-space-*`): 0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96px.

| Pattern | Padding |
|---------|---------|
| Button default | 8px 12px; lg: 12px 16px |
| Input sm/md | 8px 12px; lg: 12px 16px |
| Textarea | 12px |
| Card, modal, alert, toast | 16px |
| App main | 16px |
| Header | 0 16px |
| Sidebar | 16px 12px |
| Accordion trigger/panel | 16px |
| Menu | 8px |
| Badge sm / md | 4px 8px / 4px 12px |
| Tab | 12px |

---

## 7. Gaps

Uses the same space tokens for flex/grid `gap`:

| Use | Gap |
|-----|-----|
| Button, badge | 8px |
| Field stack | 8px |
| Alert, toast, quick link | 12px |
| Switch label | 12px |
| Tabs | 4px |
| Breadcrumb | 8px |
| App header | 16px |
| Separated accordion | 12px |

---

## 8. Border radius

| Token | Value | Usage |
|-------|-------|--------|
| none | 0 | Flush accordion |
| xs | 4px | Checkbox |
| sm / md | 8px | Default: buttons, inputs, cards, modals, menus |
| lg | 12px | Quick links |
| xl | 16px | Toast |
| full | 9999px | Badges (pill) |
| 50% | — | Avatar, radio, switch thumb |

**Convention:** 8px (`--core-radius-sm`) on rectangular component surfaces.

---

## 9. Border color

Default: `--theme-neutral-border-primary-default` (~#787887 light).

| State | Border |
|-------|--------|
| Input hover | `--theme-neutral-border-strong` |
| Focus | `--theme-primitive-color-primary-400` (+ 3px ring) |
| Error | `--theme-semantics-critical-border` |
| Disabled | `--theme-semantics-disabled-border` |
| Primary button | `--brand-border-primary-default` |
| Card | neutral primary; hover strong |
| Progress | `--theme-neutral-border-strong` |

Border width: 1px default; checkbox/radio 1.5px; focus ring 2px.

---

## Component families

Styles use `cds-*` classes in `packages/core/src/styles/components.css`.

### Button (`Button.tsx`)

- **Text:** 12 / 14 / 16px semibold by size
- **Typeface:** Inclusive Sans
- **Color/background/border:** Variants primary, secondary, tertiary, destructive, success, warning, info, neutral, outline-primary
- **Size:** Icon button 32/40/48px; padding 8×12 (md), 12×16 (lg)
- **Gap:** 8px
- **Radius:** 8px (circle ghost uses same token family)

### Forms (`Field`, `FormControls`, `Combobox`)

- **Input/textarea/select:** 14px (16 lg), surface-default bg, 8px radius, 1px neutral border
- **Field:** column, 8px gap; label uses label typography tokens

### Toggle inputs (`ToggleInputs`)

- **Checkbox/radio:** 18×18, radius 4px / 50%, border 1.5px
- **Switch:** track 32×18, radius 9px
- **Toggle group:** 8×12 padding, 8px radius, brand border

### Containers & feedback

- **Card:** 16px padding, 8px radius, surface-default, elevation-1 shadow
- **Badge:** pill radius, soft/outline/solid × primary/success/warning/danger/info/neutral
- **Alert:** 16px padding, 8px radius, semantic fills
- **Toast:** 280px wide, 16px radius, 16px padding
- **Modal:** 480px max, 16px padding, 8px radius, overlay surface
- **Drawer:** 360px wide, full height, overlay surface
- **Menu:** min 200px, 8px padding, 8px radius

### Navigation & layout

- **Header:** 64px, raised surface, 16px horizontal padding
- **Sidebar:** 220px (96px rail), raised surface
- **Tabs:** body-lg, 12px padding, 4px list gap
- **Accordion:** 8px radius, 16px padding, 1px border
- **Stepper:** 28px markers, 8px radius

### Semantic utilities

`cds-sem-success-soft`, `cds-sem-success-solid`, and matching warning, critical, info, disabled — bundle background, text, and border from theme semantics.

---

## Repository map

| Topic | File |
|-------|------|
| Spacing, radius, fonts, control sizes | `packages/tokens/src/primitives.json` |
| Type scale | `packages/tokens/src/typography.json` |
| Semantic colors | `packages/tokens/src/semantic.json` |
| Component token aliases | `packages/tokens/src/component.json` |
| All component CSS | `packages/core/src/styles/components.css` |

---

*CORE Design System — Component Styles Reference*
