/**
 * Regenerates typography-export.ts from packages/tokens/src/typography.json.
 * Run: node apps/docs-site/src/pages/generate-typography-export.cjs
 */
const fs = require("fs");
const path = require("path");

const typographyFile = path.resolve(__dirname, "../../../../packages/tokens/src/typography.json");
const typographyData = JSON.parse(fs.readFileSync(typographyFile, "utf8"));

const SITE_LETTER_SPACING = { rem: "0", px: 0 };

function parsePx(pxStr) {
  const val = parseFloat(String(pxStr).replace("px", ""));
  if (!Number.isFinite(val)) return { px: 0, rem: "0" };
  return { px: val, rem: `${val / 16}rem` };
}

function parseLineHeight(lhStr, sizePx) {
  if (String(lhStr).includes("px")) return parsePx(lhStr);
  const pxVal = Math.round(sizePx * parseFloat(lhStr));
  return { px: pxVal, rem: `${pxVal / 16}rem` };
}

function tokenFromKey(key) {
  const raw = typographyData[key];
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

function tokensFromKeys(keys) {
  const result = {};
  for (const key of keys) {
    const token = tokenFromKey(key);
    if (token) result[key] = token;
  }
  return result;
}

const out = {
  $schema: "Typography tokens -- design-system branch",
  fontFamily: { sans: "Inclusive Sans" },
  fontWeight: { regular: 400, medium: 500, semibold: 600, bold: 700, extrabold: 800 },
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

const outputContent = `import { buildTypographyExportJson } from "./buildTypographyExport";

/** Typography variables for download — generated from typography.json with site display rules. */
export const typographyExportJson = buildTypographyExportJson();
`;

fs.writeFileSync(path.resolve(__dirname, "typography-export.ts"), outputContent, "utf8");
console.log("✓ typography-export.ts updated (runtime build via buildTypographyExport.ts)");
