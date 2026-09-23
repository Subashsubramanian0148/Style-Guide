import React from "react";
import { Icon, Kbd } from "../../../../packages/core/src/components/Primitives";
import { IconButton } from "../../../../packages/core/src/components/Button";
import { DocsSection, DocsSectionList } from "../DocsSection";

const sampleIcons = [
  "fa-solid fa-house", "fa-solid fa-user", "fa-solid fa-gear", "fa-solid fa-magnifying-glass",
  "fa-solid fa-chart-line", "fa-solid fa-file-invoice-dollar", "fa-solid fa-piggy-bank", "fa-solid fa-shield-halved",
  "fa-regular fa-bell", "fa-regular fa-envelope", "fa-regular fa-circle-check", "fa-regular fa-trash-can",
];

export default function Icons() {
  return (
    <div>
      <h1 className="site-h1">Icons</h1>
      <p className="site-lede">
        CORE's specified icon library is <strong style={{ color: "var(--site-text)" }}>Font Awesome 6 Pro</strong>.
        This project doesn't hold a Pro license, so the Free tier is loaded as a class-compatible placeholder —
        every class name below (<code>fa-solid</code>, <code>fa-regular</code>, etc.) is Pro-ready as-is; swapping
        the CDN link for a Pro Kit is the only change needed.
      </p>

      <DocsSectionList>
        <DocsSection anchorId="fontawesome-pro" title="Get Font Awesome 6 Pro">
          <div className="site-panel">
            <p style={{ margin: "0 0 16px", fontSize: 14, color: "var(--site-text-dim)", lineHeight: 1.7 }}>
              Font Awesome Pro is a licensed product — download it directly from Font Awesome using your own account,
              not from this site. Two supported integration paths:
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 16 }}>
              <a className="btn-hero primary" href="https://fontawesome.com/download" target="_blank" rel="noreferrer">
                ⬇ Download Font Awesome (official)
              </a>
              <a className="btn-hero ghost" href="https://fontawesome.com/kits" target="_blank" rel="noreferrer">
                Get a Pro Kit code
              </a>
            </div>
            <table className="spec-table">
              <thead><tr><th>Method</th><th>How</th></tr></thead>
              <tbody>
                <tr>
                  <td>Kit (recommended)</td>
                  <td>Generate a Kit at <code>fontawesome.com/kits</code> (auto-applies your Pro license), then replace
                    the CDN <code>&lt;link&gt;</code> in <code>index.html</code> with:<br />
                    <code>&lt;script src="https://kit.fontawesome.com/YOUR_KIT_CODE.js"&gt;&lt;/script&gt;</code></td>
                </tr>
                <tr>
                  <td>npm package</td>
                  <td>Use your Pro npm auth token per <a href="https://fontawesome.com/docs/web/setup/packages" target="_blank" rel="noreferrer">their setup docs</a>, then
                    <code> import '@fortawesome/fontawesome-pro/css/all.min.css'</code> in <code>main.tsx</code> instead of the CDN link.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </DocsSection>

        <DocsSection anchorId="sizing" title="Sizing">
          <div className="site-panel site-panel--flush">
            <div className="preview-surface" data-theme="core" data-mode="light" style={{ background: "var(--core-color-bg-page)" }}>
              <div style={{ textAlign: "center" }}><Icon name="fa-solid fa-piggy-bank" size="sm" /><div style={{ fontSize: "var(--typography-font-size-xs)", marginTop: 6, color: "var(--core-color-text-tertiary)" }}>sm · 16px</div></div>
              <div style={{ textAlign: "center" }}><Icon name="fa-solid fa-piggy-bank" size="md" /><div style={{ fontSize: "var(--typography-font-size-xs)", marginTop: 6, color: "var(--core-color-text-tertiary)" }}>md · 20px</div></div>
              <div style={{ textAlign: "center" }}><Icon name="fa-solid fa-piggy-bank" size="lg" /><div style={{ fontSize: "var(--typography-font-size-xs)", marginTop: 6, color: "var(--core-color-text-tertiary)" }}>lg · 24px</div></div>
            </div>
          </div>
        </DocsSection>

        <DocsSection anchorId="style-convention" title="Style convention: Solid vs Regular">
          <div className="site-panel site-panel--flush">
            <div className="preview-surface" data-theme="core" data-mode="light" style={{ background: "var(--core-color-bg-page)" }}>
              {sampleIcons.map((cls) => (
                <div key={cls} style={{ textAlign: "center", width: 64 }}>
                  <Icon name={cls} size="lg" />
                </div>
              ))}
            </div>
          </div>
        </DocsSection>

        <DocsSection anchorId="interactive-icons" title="Interactive icons">
          <div className="site-panel site-panel--flush">
            <div className="preview-surface" data-theme="core" data-mode="light" style={{ background: "var(--core-color-bg-page)" }}>
              <IconButton variant="secondary" size="md" aria-label="Notifications"><Icon name="fa-regular fa-bell" size="sm" /></IconButton>
              <span style={{ fontSize: 14, color: "var(--core-color-text-primary)" }}>
                <Icon name="fa-solid fa-circle-check" size="sm" label="Verified" style={{ color: "var(--core-color-status-success-text)", marginRight: 4 }} />
                Identity verified
              </span>
            </div>
          </div>
        </DocsSection>

        <DocsSection anchorId="kbd" title="Kbd (keyboard shortcut hint)">
          <div className="site-panel site-panel--flush">
            <div className="preview-surface" data-theme="core" data-mode="light" style={{ background: "var(--core-color-bg-page)" }}>
              <span style={{ fontSize: 14, color: "var(--core-color-text-primary)" }}>
                Press <Kbd>⌘</Kbd> + <Kbd>K</Kbd> to search
              </span>
            </div>
          </div>
        </DocsSection>
      </DocsSectionList>
    </div>
  );
}
