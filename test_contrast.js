function luminance(r, g, b) {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}
function contrast(l1, l2) {
  const light = Math.max(l1, l2);
  const dark = Math.min(l1, l2);
  return (light + 0.05) / (dark + 0.05);
}
const colors = {
  "Danger 500": [216, 67, 74],
  "Tertiary 500": [232, 154, 28],
  "Info 500": [46, 140, 214]
};
for (const [name, rgb] of Object.entries(colors)) {
  const l = luminance(...rgb);
  const cBlack = contrast(l, 0);
  const cWhite = contrast(l, 1);
  console.log(`${name}: L=${l.toFixed(3)}, Black=${cBlack.toFixed(2)}, White=${cWhite.toFixed(2)}`);
}
