import primitives from "../../../../packages/tokens/src/primitives.json";

export type PxRem = { rem: string; px: number };

/** Design-system font size scale — XS through 3XL, capped at 32px. */
export const FONT_SIZE_ORDER = ["xs", "sm", "md", "lg", "xl", "2xl", "3xl"] as const;

export type FontSizeKey = (typeof FONT_SIZE_ORDER)[number];

export const FONT_SIZE_LABELS: Record<FontSizeKey, string> = {
  xs: "XS",
  sm: "S",
  md: "MD",
  lg: "L",
  xl: "XL",
  "2xl": "2XL",
  "3xl": "3XL",
};

export function parsePx(pxStr: string): PxRem {
  const val = parseFloat(String(pxStr).replace("px", ""));
  if (!Number.isFinite(val)) return { px: 0, rem: "0" };
  return { px: val, rem: `${val / 16}rem` };
}

export function remLabel(pxStr: string) {
  const { rem, px } = parsePx(pxStr);
  return `${rem} (${px}px)`;
}

export function getFontSizeEntries() {
  const font = primitives.font as Record<string, string>;
  return FONT_SIZE_ORDER.map((key) => {
    const pxStr = font[`size.${key}`];
    const parsed = parsePx(pxStr);
    return {
      key,
      token: `font.size.${key}`,
      label: FONT_SIZE_LABELS[key],
      pxStr,
      ...parsed,
    };
  });
}

const pxToScaleLabel = new Map(getFontSizeEntries().map((entry) => [entry.px, entry.label]));

export function fontSizeLabelFromPx(pxStr: string): string | null {
  const px = parseFloat(String(pxStr).replace("px", ""));
  if (!Number.isFinite(px)) return null;
  return pxToScaleLabel.get(px) ?? null;
}

export function buildFontSizeScaleExport(): Record<FontSizeKey, PxRem> {
  const result = {} as Record<FontSizeKey, PxRem>;
  for (const entry of getFontSizeEntries()) {
    result[entry.key] = { rem: entry.rem, px: entry.px };
  }
  return result;
}
