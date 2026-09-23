# CORE vs. Participant Portal — Page-by-Page Gap Check

Reference: [participantportal-core.netlify.app](https://participantportal-core.netlify.app/) (the real LendGuard
app, logged in via its own "Prototype demo" switcher). Pages reviewed: Login, Dashboard, Portfolio, Transactions,
Profile.

## Real, generic gaps found (belong in CORE)

| Gap | Where seen | Recommendation |
|---|---|---|
| **Description list** (label-above-value key/value pairs, e.g. Name / Gender / Marital Status / DOB / SSN) | Profile → Personal Details | Add a generic `DescriptionList` component — currently we have no primitive for this, every page would hand-roll it. |
| **Vertical tabs** (side-stacked tab list: Personal / Bank / Employment / Classification / Beneficiary) | Profile page nav | Our `Tabs` is horizontal-only. Add an `orientation="vertical"` prop rather than a new component. |
| **Profile header pattern** (avatar + name + status badge + meta line + Edit button, all in one row) | Profile page header | This is a composition of existing primitives (Avatar + Badge + Button), not a new component — belongs in **Patterns**, not Components. |

## Confirmed already covered (no gap)

- Plan/account list rows (LendGuard 401(k), Profit Sharing, etc. with status badges "Participating"/"Eligible"/"Not Eligible") → `Item` + `Badge`.
- Transactions Requests/History → `Tabs` + `Table` + `Badge` (status) + `Item` (plan selector list).
- Wide, many-column investment table with a horizontal time-range selector (1M/3M/.../10Y) → `Table` (horizontal scroll already built in) + `ToggleGroup` (already supports any number of options).
- Recent transactions list → `Item`.

## Explicitly NOT gaps — out of scope per CORE's own rules

The scope doc (§18) says CORE must not build "retirement-specific components" or "product-specific dashboards."
These widgets are real and well-built in the portal, but belong in the **product**, not the design system:

- `RiskMeter` / `RiskMeterV2` (investor-risk gauge)
- `ReadinessScoreCard` / `ReadinessVisuals` / `ReadinessSceneV2` (retirement-readiness illustration)
- `RetirementGoalSimulator` (goal projection tool)
- `RiskCairnIllustration`, `RiskJourneyScene` (decorative illustrations)
- `ChartLegend` overflow pattern (depends on a charting library CORE doesn't have yet — tracked separately in the Metronic checklist as intentionally deferred)
- `AccessibilityMenu` (Web Speech API voice nav / read-aloud — an app feature, not a design-system primitive)

## Net result

**One real component gap** (`DescriptionList`) and **one prop-level gap** (`Tabs` vertical orientation) — smaller
than the Metronic pass, because this portal is built from generic UI patterns CORE already covers well. Everything
else that looked portal-specific turned out to be either already-covered primitives composed together, or
correctly out-of-scope per the project's own rules.

## Suggested next step

Implement `DescriptionList` and `Tabs` vertical orientation (small, both quick) — say go-ahead and I'll do both.
