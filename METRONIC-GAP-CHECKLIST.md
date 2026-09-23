# CORE vs. Metronic — Variant Depth Gap Checklist

Reference: [preview.keenthemes.com/html/metronic/docs](https://preview.keenthemes.com/html/metronic/docs/), pages
crawled directly (Forms/Controls, Checks & Radios, Popovers, Breadcrumb, Toasts, Drawer). This documents exactly
how much variation Metronic shows per component, how clearly they present it, and where CORE currently falls
short — as requested, **analysis only in this pass**, no code changes yet.

## How Metronic presents variants (worth copying the *pattern*, not the visuals)

- **One concept per page section**, each with: a live rendered demo → a one-line rule ("Use `.form-control-solid`
  class with `.form-control` to...") → the exact HTML/class needed. No prose paragraphs between demos.
- **Every state is rendered side-by-side in one row** (default / checked / indeterminate / disabled), not
  described in a table only — you see all of them at once, then a table backs it up.
- **Style axis and size axis are always separate sections** — style variants first (solid/transparent/flush),
  then a distinct "sizes" section, then a distinct "states" section, then a distinct "colors" section. This is
  more legible than combining all axes into one giant demo.
- Our own component pages already mostly follow this pattern (Variants → Sizes → States → Accessibility → Code →
  Tokens) — that structural habit is good and should continue; the gap is **variant count**, not page structure.

## Gaps found, per component

### Form Controls (Input / Select)
| Metronic has | CORE has | Gap |
|---|---|---|
| Default, Solid background, Transparent, Flush (4 background styles) | One fixed style | **Missing background-style variants.** Recommend adding `variant="default" \| "solid" \| "flush"` to `Input`/`Select`/`Textarea` — transparent is arguably redundant with default, skip it. |
| Required-field indicator (symbol in label, or absolute-positioned symbol in input) | Field supports `required` boolean but no visual asterisk shown | **Missing visible required-symbol styling** — add to `Field`. |
| Range input, with disabled state | Not built (Slider is close but styled differently, no native `.form-range` equivalent) | Slider already covers this need; no action. |

### Checkbox / Radio
| Metronic has | CORE has | Gap |
|---|---|---|
| Default (native) style AND a custom "solid" style | One style | Minor — CORE's one style is intentionally simpler; not a real gap given CORE's "fewer, consistent styles" philosophy (see Color page rationale for Secondary/Tertiary). No action recommended. |
| States: default, checked, **indeterminate**, disabled | ✅ all four now present | None |
| **Tone colors**: success / danger / warning checked-state color | Only ever brand-colored when checked | **Real gap** — a checkbox representing a specific status (e.g. "flagged for review") can't currently show a danger-colored checked state. Recommend a `tone` prop on `Checkbox`. |
| **Sizes**: sm / lg (plus arbitrary custom px) | One fixed size | **Real gap** — add `size="sm" \| "md" \| "lg"` to `Checkbox`/`Radio`, matching Button's size pattern. |
| Image-based checkbox cards (selectable option tiles with a photo) | Not built | Out of scope for a retirement portal (no image-selection use case) — skip. |

### Popover
| Metronic has | CORE has | Gap |
|---|---|---|
| 4 placements: top/right/bottom/left | Fixed below-left only | **Real gap** — add a `placement` prop to `Popover`. |
| Inverse (dark) style variant | Not built | Low priority — CORE already has full dark-mode theming at the token level, so a manual "inverse" override is lower value; skip unless requested. |
| HTML-rich content | ✅ already supported (`children: ReactNode`) | None |

### Breadcrumb
| Metronic has | CORE has | Gap |
|---|---|---|
| Default (slash), Line separator, Dot separator, Separatorless | One fixed slash separator | **Real gap** — add a `separator` prop: `"slash" \| "line" \| "dot" \| "none"`. |

### Toast
| Metronic has | CORE has | Gap |
|---|---|---|
| Structured header: icon + title + **timestamp** + explicit **close button**, separate from body | Title + description only, no header row, no dismiss control shown | **Real gap** — Toast's visual structure is thinner than the reference. Recommend adding an optional `timestamp` and a close button (even though ToastManager already auto-dismisses, a manual close affordance is standard and more accessible for users who read slowly). |

### Drawer
| Metronic has | CORE has | Gap |
|---|---|---|
| Configurable width via attribute | Fixed 360px | **Minor gap** — add a `width` prop. |
| Left or right placement | Right only | **Minor gap** — add a `side="left" \| "right"` prop. |

## Priority order to implement (highest value first)

1. **Popover placement** (top/right/bottom/left) — affects an already-shipped component, easy win, real usability issue (a popover near the right edge of the screen currently can't flip left).
2. **Breadcrumb separator styles** — small, self-contained, purely cosmetic-safe change.
3. **Checkbox/Radio size + tone props** — matches the size/tone pattern already established on Button and Badge, so it's consistent to add.
4. **Toast header structure** (timestamp + close button) — meaningful accessibility improvement, not just visual parity.
5. **Input/Select/Textarea background-style variant** (`solid`/`flush`) — larger surface area (touches 3 components), do after the above are settled.
6. **Drawer width/side props** — lowest priority, least-used axis.

## Explicitly not chasing (matches CORE's own "fewer, deliberate styles" philosophy)

- Metronic's default-vs-custom-solid double system for checkboxes — CORE deliberately ships one checkbox style, the same way it deliberately ships one Input style rather than Metronic's three. This was a considered decision (see the Color page's Secondary/Tertiary rationale), not an oversight, and is being kept.
- Image-based selectable checkbox cards — no retirement-portal use case.
- Popover inverse/dark manual variant — redundant with CORE's token-driven dark mode.

## Next step

Waiting on your go-ahead to implement items 1–6 above in priority order — say the word and I'll start with Popover placement.
