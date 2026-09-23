const fs = require('fs');

const sizes = [32, 28, 24, 20, 16, 14, 12];
const weights = ['Regular', 'Medium', 'SemiBold', 'Bold'];

const order = [
  "h1", "h2", "h3", "h4", "h5", "h6",
];

const roleName = {
  h1: "H1", h2: "H2", h3: "H3", h4: "H4", h5: "H5", h6: "H6",
};

sizes.forEach(size => {
  weights.forEach(w => {
    const key = `text${size}${w}`;
    order.push(key);
    roleName[key] = `Text ${size}px ${w}`;
  });
});

order.push("eyebrow", "numericData");
roleName["eyebrow"] = "Eyebrow";
roleName["numericData"] = "Numeric Data";

const content = fs.readFileSync('apps/docs-site/src/pages/Typography.tsx', 'utf8');

const newOrderStr = `const order = ${JSON.stringify(order, null, 2)};`;
const newRoleNameStr = `const roleName: Record<string, string> = ${JSON.stringify(roleName, null, 2)};`;

let newContent = content.replace(/const order = \[[\s\S]*?\];/, newOrderStr);
newContent = newContent.replace(/const roleName: Record<string, string> = \{[\s\S]*?\};/, newRoleNameStr);

fs.writeFileSync('apps/docs-site/src/pages/Typography.tsx', newContent);
console.log('Updated Typography.tsx');
