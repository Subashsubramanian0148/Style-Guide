import React, { useState } from "react";
import { DocsSection, DocsSectionList } from "../DocsSection";

const durations = [
  { name: "instant", ms: 80, use: "Micro feedback — checkbox tick, ripple" },
  { name: "fast", ms: 120, use: "Hover/focus state changes" },
  { name: "base", ms: 180, use: "Dropdowns, popovers, tooltips" },
  { name: "slow", ms: 280, use: "Modals, drawers, page transitions" },
];

export default function Motion() {
  const [play, setPlay] = useState(0);
  return (
    <div>
      <h1 className="site-h1">Motion</h1>
      <p className="site-lede">
        Motion is restrained and functional — it clarifies state changes, never decorates. All durations respect
        <code> prefers-reduced-motion</code>.
      </p>

      <DocsSectionList>
        <DocsSection anchorId="durations" title="Durations">
          <div className="site-panel">
            <button className="btn-hero ghost" style={{ marginBottom: 20, cursor: "pointer" }} onClick={() => setPlay((p) => p + 1)}>
              ▶ Replay
            </button>
            {durations.map((d) => (
              <div key={d.name} style={{ display: "flex", alignItems: "center", gap: 16, padding: "10px 0", borderBottom: "1px solid var(--site-border)" }}>
                <div style={{ width: 90, fontFamily: "var(--site-mono)", fontSize: 12 }}>{d.name} · {d.ms}ms</div>
                <div style={{ width: 200, height: 8, background: "var(--site-bg-hover)", borderRadius: 4, position: "relative", overflow: "hidden" }}>
                  <div
                    key={play}
                    style={{
                      position: "absolute", inset: 0, background: "var(--site-accent)",
                      animation: `motionDemo ${d.ms}ms cubic-bezier(0.2,0,0,1)`,
                    }}
                  />
                </div>
                <div style={{ fontSize: "var(--typography-font-size-xs)", color: "var(--site-text-dim)" }}>{d.use}</div>
              </div>
            ))}
          </div>
          <style>{`@keyframes motionDemo { from { transform: translateX(-100%);} to { transform: translateX(0);} }`}</style>
        </DocsSection>

        <DocsSection anchorId="reduced-motion" title="Reduced motion">
          <div className="site-panel">
            <code>@media (prefers-reduced-motion: reduce)</code> — all transition/animation durations collapse to 0–1ms
            and transform-based motion is disabled system-wide, per component implementation, not as an opt-in.
          </div>
        </DocsSection>
      </DocsSectionList>
    </div>
  );
}
