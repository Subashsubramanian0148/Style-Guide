/**
 * Align docs demo inline styles to palette SCSS token names (no hex fallbacks).
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../src");

const replacements = [
  ["--theme-brand-border-primary-default", "--theme-brand-border-primary-default"],
  ["--theme-brand-border-primary-hover", "--theme-brand-border-primary-hover"],
  ["--theme-brand-border-primary-disabled", "--theme-brand-border-primary-disabled"],
  ["--theme-brand-border-active", "--theme-brand-background-primary-active"],
  ["--brand-border-primary-hover", "--brand-border-primary-hover"],
  ["--brand-border-primary-disabled", "--brand-border-primary-disabled"],
  ["--core-font-size-xs, 12px", "--typography-font-size-xs"],
  ["--core-font-size-sm, 14px", "--typography-body-md-size"],
  ["--core-font-size-md, 16px", "--typography-body-lg-size"],
];

function walk(dir, files = []) {
  for (const name of readdirSync(dir)) {
    const p = path.join(dir, name);
    if (statSync(p).isDirectory()) walk(p, files);
    else if (p.endsWith(".tsx") || p.endsWith(".ts")) files.push(p);
  }
  return files;
}

for (const file of walk(root)) {
  let src = readFileSync(file, "utf-8");
  let changed = false;
  for (const [from, to] of replacements) {
    if (src.includes(from)) {
      src = src.split(from).join(to);
      changed = true;
    }
  }
  if (changed) {
    src = src.replace(/var\((--(?:theme|brand)-[^,)]+),\s*#[0-9A-Fa-f]{3,8}\)/g, "var($1)");
    writeFileSync(file, src);
    console.log("Updated", path.relative(root, file));
  }
}
