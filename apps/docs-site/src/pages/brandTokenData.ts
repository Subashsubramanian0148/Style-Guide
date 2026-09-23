/**
 * Brand semantic token reference — shade mappings are fixed per Figma source of truth.
 * Primitives are never duplicated in semantic tokens; hex values resolve from primitives only.
 */

export interface PrimitiveSwatch {
  id: string;
  label: string;
  path: string;
  hex: string;
  cssVar: string;
}

export interface SemanticTokenCell {
  primitiveId: string;
}

export interface SemanticTokenRow {
  /** Short name shown in the Token column, e.g. "primary-default" */
  name: string;
  /** Canonical CSS custom property */
  cssVar: string;
  light: SemanticTokenCell;
  dark: SemanticTokenCell;
}

export interface TokenReferenceSection {
  id: string;
  title: string;
  rows: SemanticTokenRow[];
}

/** Primary / Blue primitive ramp — hex values are immutable */
export const BLUE_PRIMITIVES: Record<string, PrimitiveSwatch> = {
  blue50: { id: "blue50", label: "Blue50", path: "Colors/Blue/Blue50", hex: "#F5F7FA", cssVar: "--color-blue-50" },
  blue100: { id: "blue100", label: "Blue100", path: "Colors/Blue/Blue100", hex: "#E2E9F3", cssVar: "--color-blue-100" },
  blue200: { id: "blue200", label: "Blue200", path: "Colors/Blue/Blue200", hex: "#BACEE9", cssVar: "--color-blue-200" },
  blue300: { id: "blue300", label: "Blue300", path: "Colors/Blue/Blue300", hex: "#86ADDF", cssVar: "--color-blue-300" },
  blue400: { id: "blue400", label: "Blue400", path: "Colors/Blue/Blue400", hex: "#3275CD", cssVar: "--color-blue-400" },
  blue500: { id: "blue500", label: "Blue500", path: "Colors/Blue/Blue500", hex: "#1F4F8D", cssVar: "--color-blue-500" },
  blue600: { id: "blue600", label: "Blue600", path: "Colors/Blue/Blue600", hex: "#1B4479", cssVar: "--color-blue-600" },
  blue700: { id: "blue700", label: "Blue700", path: "Colors/Blue/Blue700", hex: "#17365E", cssVar: "--color-blue-700" },
  blue800: { id: "blue800", label: "Blue800", path: "Colors/Blue/Blue800", hex: "#132A49", cssVar: "--color-blue-800" },
  blue900: { id: "blue900", label: "Blue900", path: "Colors/Blue/Blue900", hex: "#102137", cssVar: "--color-blue-900" },
  blue950: { id: "blue950", label: "Blue950", path: "Colors/Blue/Blue950", hex: "#0C1827", cssVar: "--color-blue-950" },
};

/** Neutral primitives used by brand semantic tokens */
export const NEUTRAL_PRIMITIVES: Record<string, PrimitiveSwatch> = {
  white: { id: "white", label: "White", path: "Colors/Neutral/White", hex: "#FFFFFF", cssVar: "--color-neutral-white" },
  grey50: { id: "grey50", label: "Grey50", path: "Colors/Neutral/Grey50", hex: "#F7F7F9", cssVar: "--color-grey-50" },
  grey100: { id: "grey100", label: "Grey100", path: "Colors/Neutral/Grey100", hex: "#EEEEF2", cssVar: "--color-grey-100" },
  grey200: { id: "grey200", label: "Grey200", path: "Colors/Neutral/Grey200", hex: "#DFDFE6", cssVar: "--color-grey-200" },
  grey300: { id: "grey300", label: "Grey300", path: "Colors/Neutral/Grey300", hex: "#C4C4CF", cssVar: "--color-grey-300" },
  grey400: { id: "grey400", label: "Grey400", path: "Colors/Neutral/Grey400", hex: "#9E9EAD", cssVar: "--color-grey-400" },
  grey500: { id: "grey500", label: "Grey500", path: "Colors/Neutral/Grey500", hex: "#787887", cssVar: "--color-grey-500" },
  grey600: { id: "grey600", label: "Grey600", path: "Colors/Neutral/Grey600", hex: "#5C5C6B", cssVar: "--color-grey-600" },
  grey700: { id: "grey700", label: "Grey700", path: "Colors/Neutral/Grey700", hex: "#454452", cssVar: "--color-grey-700" },
  grey800: { id: "grey800", label: "Grey800", path: "Colors/Neutral/Grey800", hex: "#2E2D38", cssVar: "--color-grey-800" },
  grey900: { id: "grey900", label: "Grey900", path: "Colors/Neutral/Grey900", hex: "#1D1C24", cssVar: "--color-grey-900" },
  grey950: { id: "grey950", label: "Grey950", path: "Colors/Neutral/Grey950", hex: "#111017", cssVar: "--color-grey-950" },
  black: { id: "black", label: "Black", path: "Colors/Neutral/Black", hex: "#000000", cssVar: "--color-neutral-black" },
};

export const ALL_PRIMITIVES: Record<string, PrimitiveSwatch> = {
  ...BLUE_PRIMITIVES,
  ...NEUTRAL_PRIMITIVES,
};

export function resolvePrimitive(id: string): PrimitiveSwatch {
  const p = ALL_PRIMITIVES[id];
  if (!p) throw new Error(`Unknown primitive: ${id}`);
  return p;
}

export function resolveCell(cell: SemanticTokenCell): PrimitiveSwatch {
  return resolvePrimitive(cell.primitiveId);
}

/** Brand semantic sections — Light/Dark shade mappings per Figma reference */
export const BRAND_TOKEN_SECTIONS: TokenReferenceSection[] = [
  {
    id: "brand-text",
    title: "Brand / Text",
    rows: [
      {
        name: "primary-default",
        cssVar: "--brand-text-primary-default",
        light: { primitiveId: "blue500" },
        dark: { primitiveId: "blue500" },
      },
      {
        name: "primary-disabled",
        cssVar: "--brand-text-primary-disabled",
        light: { primitiveId: "blue300" },
        dark: { primitiveId: "blue300" },
      },
      {
        name: "primary-active",
        cssVar: "--brand-text-primary-active",
        light: { primitiveId: "blue700" },
        dark: { primitiveId: "blue200" },
      },
      {
        name: "primary-hover",
        cssVar: "--brand-text-primary-hover",
        light: { primitiveId: "blue600" },
        dark: { primitiveId: "blue400" },
      },
      {
        name: "primary-oncolor",
        cssVar: "--brand-text-primary-oncolor",
        light: { primitiveId: "white" },
        dark: { primitiveId: "blue50" },
      },
    ],
  },
  {
    id: "brand-background",
    title: "Brand / Background",
    rows: [
      {
        name: "strong",
        cssVar: "--brand-background-primary-strong",
        light: { primitiveId: "blue500" },
        dark: { primitiveId: "blue500" },
      },
      {
        name: "primary-light",
        cssVar: "--brand-background-primary-light",
        light: { primitiveId: "blue50" },
        dark: { primitiveId: "blue900" },
      },
      {
        name: "primary-subtle",
        cssVar: "--brand-background-primary-subtle",
        light: { primitiveId: "blue100" },
        dark: { primitiveId: "blue800" },
      },
      {
        name: "disabled-light",
        cssVar: "--brand-background-primary-disabled-light",
        light: { primitiveId: "grey100" },
        dark: { primitiveId: "grey100" },
      },
      {
        name: "disabled-strong",
        cssVar: "--brand-background-primary-disabled",
        light: { primitiveId: "blue200" },
        dark: { primitiveId: "blue200" },
      },
      {
        name: "active",
        cssVar: "--brand-background-primary-active",
        light: { primitiveId: "blue700" },
        dark: { primitiveId: "blue500" },
      },
      {
        name: "hover",
        cssVar: "--brand-background-primary-hover",
        light: { primitiveId: "blue600" },
        dark: { primitiveId: "blue600" },
      },
    ],
  },
  {
    id: "brand-border",
    title: "Brand / Borders",
    rows: [
      {
        name: "primary-default",
        cssVar: "--brand-border-primary-default",
        light: { primitiveId: "blue500" },
        dark: { primitiveId: "blue500" },
      },
      {
        name: "primary-disabled",
        cssVar: "--brand-border-primary-disabled",
        light: { primitiveId: "blue200" },
        dark: { primitiveId: "blue200" },
      },
      {
        name: "hover",
        cssVar: "--brand-border-primary-hover",
        light: { primitiveId: "blue600" },
        dark: { primitiveId: "blue300" },
      },
    ],
  },
];

export const ALL_BRAND_ROWS = BRAND_TOKEN_SECTIONS.flatMap((s) => s.rows);

export function flattenBrandSearchIndex() {
  return BRAND_TOKEN_SECTIONS.flatMap((section) =>
    section.rows.map((row) => ({
      section: section.title,
      ...row,
      lightPrimitive: resolveCell(row.light),
      darkPrimitive: resolveCell(row.dark),
    }))
  );
}
