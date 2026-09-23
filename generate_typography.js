const fs = require('fs');

const sizes = [32, 28, 24, 20, 16, 14, 12];
const weights = [
  { name: 'Regular', value: '400' },
  { name: 'Medium', value: '500' },
  { name: 'SemiBold', value: '600' },
  { name: 'Bold', value: '700' }
];

const typography = {};

// 1. Semantic Headings
typography.h1 = {
  family: "{font.family.base}",
  desktop: { size: "32px", weight: "700", lineHeight: "1.25", letterSpacing: "-0.4px" },
  mobile:  { size: "28px", weight: "700", lineHeight: "1.3", letterSpacing: "-0.3px" },
  usage: "Page title"
};
typography.h2 = {
  family: "{font.family.base}",
  desktop: { size: "28px", weight: "700", lineHeight: "1.3", letterSpacing: "-0.35px" },
  mobile:  { size: "24px", weight: "700", lineHeight: "1.33", letterSpacing: "-0.3px" },
  usage: "Section heading"
};
typography.h3 = {
  family: "{font.family.base}",
  desktop: { size: "24px", weight: "700", lineHeight: "1.33", letterSpacing: "-0.3px" },
  mobile:  { size: "20px", weight: "700", lineHeight: "1.4", letterSpacing: "-0.2px" },
  usage: "Card heading"
};
typography.h4 = {
  family: "{font.family.base}",
  desktop: { size: "20px", weight: "700", lineHeight: "1.4", letterSpacing: "-0.2px" },
  mobile:  { size: "18px", weight: "700", lineHeight: "1.4", letterSpacing: "0" },
  usage: "Widget title"
};
typography.h5 = {
  family: "{font.family.base}",
  desktop: { size: "16px", weight: "700", lineHeight: "1.5", letterSpacing: "0" },
  mobile:  { size: "16px", weight: "700", lineHeight: "1.5", letterSpacing: "0" },
  usage: "List title"
};
typography.h6 = {
  family: "{font.family.base}",
  desktop: { size: "14px", weight: "700", lineHeight: "1.5", letterSpacing: "0" },
  mobile:  { size: "14px", weight: "700", lineHeight: "1.5", letterSpacing: "0" },
  usage: "Group label"
};

// 2. Full Matrix
const getLineHeight = (size) => {
  if (size === 32) return "1.25";
  if (size === 28) return "1.3";
  if (size === 24) return "1.33";
  if (size === 20) return "1.4";
  return "1.5";
};

const getLetterSpacing = (size) => {
  if (size === 32) return "-0.4px";
  if (size === 28) return "-0.35px";
  if (size === 24) return "-0.3px";
  if (size === 20) return "-0.2px";
  return "0px";
};

sizes.forEach(size => {
  weights.forEach(w => {
    const key = `text${size}${w.name}`;
    typography[key] = {
      family: "{font.family.base}",
      desktop: { 
        size: `${size}px`, 
        weight: w.value, 
        lineHeight: getLineHeight(size), 
        letterSpacing: getLetterSpacing(size) 
      },
      mobile: { 
        size: `${size === 32 ? 28 : size === 28 ? 24 : size === 24 ? 20 : size === 20 ? 18 : size}px`, 
        weight: w.value, 
        lineHeight: getLineHeight(size === 32 ? 28 : size === 28 ? 24 : size === 24 ? 20 : size === 20 ? 18 : size), 
        letterSpacing: getLetterSpacing(size === 32 ? 28 : size === 28 ? 24 : size === 24 ? 20 : size === 20 ? 18 : size) 
      },
      usage: `${size}px text (${w.name})`
    };
  });
});

// 3. Specialized Elements
typography.eyebrow = {
  family: "{font.family.base}",
  desktop: { size: "12px", weight: "800", lineHeight: "1.5", letterSpacing: "0.8px" },
  mobile:  { size: "12px", weight: "800", lineHeight: "1.5", letterSpacing: "0.8px" },
  usage: "Plan type, extra bold label"
};

typography.numericData = {
  family: "{font.family.mono}",
  desktop: { size: "14px", weight: "600", lineHeight: "1.5", letterSpacing: "0" },
  mobile:  { size: "14px", weight: "600", lineHeight: "1.5", letterSpacing: "0" },
  usage: "Balances, currency, account numbers — tabular figures for alignment."
};

fs.writeFileSync('packages/tokens/src/typography.json', JSON.stringify(typography, null, 2));
