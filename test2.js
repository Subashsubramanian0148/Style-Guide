function hexToRgb(hex) {
  let cleaned = hex.replace("#", "").trim();
  if (cleaned.length === 3) {
    cleaned = cleaned.split("").map((c) => c + c).join("");
  }
  const num = parseInt(cleaned, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}
function luminance(r, g, b) {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}
function getContrastColor(hex) {
  const { r, g, b } = hexToRgb(hex);
  const lum = luminance(r, g, b);
  return lum > 0.179 ? "#000000" : "#FFFFFF";
}
console.log("Danger 500", getContrastColor("#D8434A"));
console.log("Info 500", getContrastColor("#2E8CD6"));
console.log("Warning 500", getContrastColor("#E89A1C"));
console.log("Tertiary 500", getContrastColor("#E89A1C"));
