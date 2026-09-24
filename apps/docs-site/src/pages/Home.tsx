import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { flatComponentLinks } from "../navConfig";

const sections = [
  {
    id: "01",
    anchorId: "whats-in-this-site",
    title: "What's in this site",
    content: (
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
        {[
          {
            label: "Foundation",
            desc: "Visual language — brand logo, color tokens, and typography that every product inherits.",
            to: "/foundations/color",
            cta: "Start with Color",
          },
          {
            label: "Components",
            desc: "Ready-made UI for forms, actions, navigation, feedback, and data-heavy participant screens.",
            to: "/components",
            cta: "Browse Components",
          },
        ].map((item) => (
          <div
            key={item.label}
            style={{
              borderRadius: 14,
              border: "1px solid var(--site-border)",
              background: "var(--core-color-surface-default)",
              padding: "24px 28px",
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            <div
              style={{
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                // Was --core-color-brand-600, a raw (non-mode-aware) scale
                // step that stayed the same dark blue in dark mode and read
                // at ~1.7:1 against the dark card — the same mode-aware
                // token used by the CTA link below resolves correctly in
                // both modes.
                color: "var(--theme-brand-text-primary-default)",
              }}
            >
              {item.label}
            </div>
            <p
              style={{
                margin: 0,
                fontSize: "var(--typography-body-md-size)",
                lineHeight: 1.6,
                color: "var(--core-color-text-secondary)",
                flex: 1,
              }}
            >
              {item.desc}
            </p>
            <Link
              to={item.to}
              style={{
                fontSize: "var(--typography-body-md-size)",
                fontWeight: 600,
                color: "var(--theme-brand-text-primary-default)",
                textDecoration: "none",
              }}
            >
              {item.cta} →
            </Link>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: "02",
    anchorId: "foundation",
    title: "Foundation",
    content: (
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
        {[
          { title: "Logo", desc: "CORE mark usage rules and client white-label lockups.", to: "/foundations/logo" },
          { title: "Color", desc: "Semantic tokens, light/dark modes, and Figma variable mapping.", to: "/foundations/color" },
          { title: "Typography", desc: "Type scale, font families, and responsive text styles.", to: "/foundations/typography" },
        ].map((item) => (
          <Link
            key={item.to}
            to={item.to}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
              padding: "var(--core-space-5) var(--core-space-6)",
              borderRadius: 14,
              border: "1px solid var(--site-border)",
              background: "var(--core-color-surface-default)",
              textDecoration: "none",
              color: "inherit",
              transition: "border-color 0.15s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--theme-brand-border-primary-default)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--site-border)";
            }}
          >
            <span
              style={{
                fontSize: 20,
                fontWeight: 500,
                letterSpacing: "-0.02em",
                color: "var(--core-color-text-primary)",
              }}
            >
              {item.title}
            </span>
            <span style={{ fontSize: "var(--typography-body-md-size)", lineHeight: 1.6, color: "var(--core-color-text-secondary)" }}>
              {item.desc}
            </span>
          </Link>
        ))}
      </div>
    ),
  },
  {
    id: "03",
    anchorId: "components",
    title: "Components",
    content: (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
          gap: 8,
        }}
      >
        {flatComponentLinks.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            style={{
              display: "block",
              padding: "var(--core-space-2) var(--core-space-3)",
              borderRadius: 8,
              border: "1px solid var(--site-border)",
              background: "var(--core-color-surface-default)",
              textDecoration: "none",
              fontSize: "var(--typography-body-md-size)",
              fontWeight: 500,
              color: "var(--core-color-text-primary)",
              transition: "border-color 0.15s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--theme-brand-border-primary-default)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--site-border)";
            }}
          >
            {link.label}
          </Link>
        ))}
      </div>
    ),
  },
  {
    id: "04",
    anchorId: "suggested-path",
    title: "Suggested path",
    content: (
      <div
        style={{
          borderRadius: 14,
          border: "1px solid var(--site-border)",
          background: "var(--core-color-surface-hover)",
          padding: "28px 32px",
        }}
      >
        <ol style={{ margin: 0, paddingLeft: 20, display: "flex", flexDirection: "column", gap: "var(--core-space-3)"}}>
          <li style={{ fontSize: "var(--typography-body-md-size)", lineHeight: 1.6, color: "var(--core-color-text-secondary)" }}>
            Review{" "}
            <Link to="/foundations/color" style={{ color: "var(--theme-brand-text-primary-default)", fontWeight: 600, textDecoration: "none" }}>
              Color
            </Link>{" "}
            and{" "}
            <Link to="/foundations/typography" style={{ color: "var(--theme-brand-text-primary-default)", fontWeight: 600, textDecoration: "none" }}>
              Typography
            </Link>{" "}
            to understand tokens and naming.
          </li>
          <li style={{ fontSize: "var(--typography-body-md-size)", lineHeight: 1.6, color: "var(--core-color-text-secondary)" }}>
            Explore{" "}
            <Link to="/components/actions" style={{ color: "var(--theme-brand-text-primary-default)", fontWeight: 600, textDecoration: "none" }}>
              Actions
            </Link>{" "}
            and{" "}
            <Link to="/components/forms" style={{ color: "var(--theme-brand-text-primary-default)", fontWeight: 600, textDecoration: "none" }}>
              Forms
            </Link>{" "}
            for the most common UI patterns.
          </li>
        </ol>
      </div>
    ),
  },
];

export default function Home() {
  useEffect(() => {
    document.documentElement.setAttribute("data-site-mode", "light");
    try {
      localStorage.setItem("core-site-mode", "light");
    } catch {}
  }, []);

  return (
    <div style={{ maxWidth: 1024, margin: "0 auto", padding: "20px" }}>
      <div style={{ textAlign: "center", marginBottom: 60, marginTop: 40 }}>
        <h1
          style={{
            fontSize: 72,
            fontWeight: 700,
            letterSpacing: "-0.06em",
            margin: "0 0 16px 0",
            color: "var(--core-color-text-primary)",
            lineHeight: 1.1,
          }}
        >
          Overview
        </h1>
        <p
          style={{
            maxWidth: 560,
            margin: "0 auto",
            color: "var(--core-color-text-tertiary)",
            fontSize: 18,
            lineHeight: 1.6,
            fontWeight: 400,
          }}
        >
          Documentation for the participant portal design system — a white-label foundation for retirement,
          benefits, and account experiences. Use the sidebar or the sections below to explore.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 100 }}>
        {sections.map((s) => (
          <div key={s.id} id={s.anchorId} className="docs-section" style={{ display: "flex", flexDirection: "column", gap: 40, position: "relative" }}>
            <div
              style={{
                position: "absolute",
                top: 0,
                left: "-12.5%",
                width: "125%",
                height: 1,
                backgroundColor: "var(--site-border)",
              }}
            />
            <div style={{ paddingTop: 32 }}>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: "var(--core-color-text-tertiary)",
                  marginBottom: 12,
                }}
              >
                {s.id}
              </div>
              <h2
                style={{
                  fontSize: 48,
                  fontWeight: 500,
                  letterSpacing: "-0.04em",
                  margin: 0,
                  color: "var(--core-color-text-primary)",
                }}
              >
                {s.title}
              </h2>
            </div>
            <div>{s.content}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
