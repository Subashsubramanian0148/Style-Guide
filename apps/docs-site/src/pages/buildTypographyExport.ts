import typography from "../../../../packages/tokens/src/typography.json";
import { buildFontSizeScaleExport, parsePx, type PxRem } from "./typographyScale";

/** Matches the Typography page — letter spacing is always shown as 0px. */
const SITE_LETTER_SPACING: PxRem = { rem: "0", px: 0 };

function parseLineHeight(lhStr: string, sizePx: number): PxRem {
  if (lhStr.includes("px")) return parsePx(lhStr);
  const multiplier = parseFloat(lhStr);
  const pxVal = Math.round(sizePx * multiplier);
  return { px: pxVal, rem: `${pxVal / 16}rem` };
}

function tokenFromKey(key: string) {
  const raw = (typography as Record<string, { desktop: { size: string; weight: string; lineHeight: string } }>)[key];
  if (!raw) return null;
  const { desktop } = raw;
  const fontSize = parsePx(desktop.size);
  const lineHeight = parseLineHeight(desktop.lineHeight, fontSize.px);
  return {
    fontSize,
    lineHeight,
    letterSpacing: SITE_LETTER_SPACING,
    fontWeight: parseInt(desktop.weight, 10),
  };
}

function tokensFromKeys(keys: string[]) {
  const result: Record<string, ReturnType<typeof tokenFromKey>> = {};
  for (const key of keys) {
    const token = tokenFromKey(key);
    if (token) result[key] = token;
  }
  return result;
}

/** Build download JSON from typography.json using the same values shown on the docs site. */
export function buildTypographyExportJson() {
  return {
    $schema: "Typography tokens -- design-system branch",
    fontFamily: {
      sans: "Inclusive Sans",
    },
    fontWeight: {
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
    },
    fontSize: buildFontSizeScaleExport(),
    letterSpacing: {
      tightest: SITE_LETTER_SPACING,
      tighter: SITE_LETTER_SPACING,
      tight: SITE_LETTER_SPACING,
      normal: SITE_LETTER_SPACING,
      wide: SITE_LETTER_SPACING,
      wider: SITE_LETTER_SPACING,
    },
    headings: tokensFromKeys(["h1", "h2", "h3", "h4", "h5", "h6"]),
    body: {
      lg: tokenFromKey("text16Regular"),
      md: tokenFromKey("text14Regular"),
      sm: tokenFromKey("text14Regular"),
      xs: tokenFromKey("text12Regular"),
    },
    label: tokenFromKey("text14Bold"),
    caption: tokenFromKey("text12Medium"),
    helper: tokenFromKey("text12Regular"),
    eyebrow: tokenFromKey("eyebrow"),
    button: {
      lg: tokenFromKey("text16Bold"),
      md: tokenFromKey("text14Bold"),
      sm: tokenFromKey("text14Bold"),
    },
    link: tokenFromKey("text14Bold"),
    placeholder: tokenFromKey("text14Regular"),
  };
}
