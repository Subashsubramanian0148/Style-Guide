/** Token names and usage guidance for each Type scale card. Token names
 *  follow the style guide's --typography-* scheme (see typography-tokens.css). */

export interface StyleTokens {
  /** CSS declarations a developer copies, one per line. */
  css: string[];
  /** Semantic role(s) this style also covers, when a dedicated token exists. */
  alias?: string;
}

export interface StyleUsage {
  use: string;
  example: string;
  avoid: string;
}

const SIZE_TOKEN: Record<string, string> = { "12px": "xs", "14px": "sm", "16px": "md", "20px": "lg", "24px": "xl", "28px": "2xl", "32px": "3xl" };
const WEIGHT_TOKEN: Record<string, string> = { "400": "regular", "500": "medium", "600": "semibold", "700": "bold", "800": "extrabold" };

const semantic = (prefix: string, alias?: string): StyleTokens => ({
  alias,
  css: [
    `font-size: var(--typography-${prefix}-size);`,
    `line-height: var(--typography-${prefix}-line-height);`,
    `font-weight: var(--typography-${prefix}-weight);`,
    `letter-spacing: var(--typography-${prefix}-letter-spacing);`,
  ],
});

/** Styles with a dedicated semantic token (from typography.json). */
const SEMANTIC: Record<string, StyleTokens> = {
  h1: semantic("heading-h1"),
  h2: semantic("heading-h2"),
  h3: semantic("heading-h3"),
  h4: semantic("heading-h4"),
  h5: semantic("heading-h5"),
  h6: semantic("heading-h6"),
  eyebrow: { ...semantic("eyebrow"), css: [...semantic("eyebrow").css, "text-transform: uppercase;"] },
  text16Regular: semantic("body-lg", "Body lg"),
  text14Regular: semantic("body-md", "Body md · Body sm · Placeholder"),
  text12Regular: semantic("body-xs", "Body xs · Helper"),
  text12Medium: semantic("caption", "Caption"),
  text14Bold: semantic("label", "Label · Link · Button md / sm"),
  text16Bold: semantic("button-lg", "Button lg"),
};

export function tokensFor(key: string, desktop: { size: string; weight: string; lineHeight: string }): StyleTokens {
  if (SEMANTIC[key]) return SEMANTIC[key];
  if (key === "numericData") {
    return {
      css: [
        "font-family: var(--typography-font-family-mono);",
        "font-size: var(--typography-font-size-sm);",
        "font-weight: var(--typography-font-weight-semibold);",
        `line-height: ${desktop.lineHeight};`,
        "font-variant-numeric: tabular-nums;",
      ],
    };
  }
  const size = SIZE_TOKEN[desktop.size];
  const weight = WEIGHT_TOKEN[desktop.weight];
  return {
    css: [
      size ? `font-size: var(--typography-font-size-${size});` : `font-size: ${desktop.size};`,
      weight ? `font-weight: var(--typography-font-weight-${weight});` : `font-weight: ${desktop.weight};`,
      `line-height: ${desktop.lineHeight};`,
    ],
  };
}

const HEADINGS: Record<string, StyleUsage> = {
  h1: { use: "The single page title — one per screen.", example: "“Hi Ava” on the dashboard; page titles like “Transactions”.", avoid: "More than one H1 on a page, or H1 inside cards and modals." },
  h2: { use: "Main sections of a page.", example: "“My plans”, “Quick links”, “Recent Transactions”.", avoid: "Skipping from H1 straight to H3; using H2 for card titles." },
  h3: { use: "Titles of cards, modals and slideovers.", example: "Plan card title; “Update beneficiary” dialog; “Add Allocation” panel.", avoid: "Page or section titles." },
  h4: { use: "Sub-sections inside a card or panel.", example: "“Financial Wellness” block; a group inside a settings card.", avoid: "Standalone page structure — use H2 / H3." },
  h5: { use: "Small group titles in dense layouts.", example: "Table group headers; form section titles.", avoid: "Anything that needs to stand out on its own." },
  h6: { use: "The smallest heading — minor group labels.", example: "Sidebar group titles; list group headers.", avoid: "Body text or field labels (use Label)." },
};

export function usageFor(key: string, desktop: { size: string; weight: string }): StyleUsage {
  if (HEADINGS[key]) return HEADINGS[key];
  if (key === "eyebrow") return { use: "Short kicker above a heading, set in uppercase.", example: "“RETIREMENT READINESS”, “LEARNING”, plan-type tags.", avoid: "Sentences, or on its own without a heading below." };
  if (key === "numericData") return { use: "Balances, currency and account numbers that must line up.", example: "“$100,416.00”, table amounts, plan IDs.", avoid: "Regular prose — tabular figures look spaced in sentences." };
  const n = parseInt(desktop.size, 10);
  const w = desktop.weight;
  const role =
    key === "text16Regular" ? { use: "Long-form body text and intros.", example: "Descriptions, empty-state text, onboarding copy." }
    : key === "text14Regular" ? { use: "Default text for the interface.", example: "Table cells, card body, input values and placeholders." }
    : key === "text12Regular" ? { use: "Fine print and helper text.", example: "Hint text under a field, legal notes." }
    : key === "text12Medium" ? { use: "Captions and metadata.", example: "“Plan ID 124542”, timestamps, file sizes." }
    : key === "text14Bold" ? { use: "Field labels, links and button text.", example: "“Email”, “View details”, primary button labels." }
    : key === "text16Bold" ? { use: "Large button text.", example: "Large (lg) buttons." }
    : n >= 24 ? { use: `Display text at ${n}px when a heading level would be semantically wrong.`, example: "Hero numbers, marketing banners." }
    : n === 20 ? { use: "Emphasised text in cards and summaries.", example: "Card sub-titles, summary figures." }
    : n === 16 ? { use: "Readable body or emphasis at 16px.", example: "Intro paragraphs, key facts." }
    : n === 14 ? { use: "Interface text with extra emphasis.", example: "Table headers, tab labels, chips." }
    : { use: "Small supporting text.", example: "Badges, status text, meta rows." };
  const weightNote = w === "600" || w === "700" ? "Paragraph-length text — heavy weights tire the eye." : "Headings — use the H1–H6 styles for structure.";
  return { ...role, avoid: n >= 24 && !HEADINGS[key] ? "Replacing real headings — screen readers need H1–H6." : weightNote };
}
