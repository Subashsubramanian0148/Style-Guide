import React from "react";
import { componentPageOrder, totalComponentCount } from "../navConfig";
import Actions from "./Actions";
import Forms from "./Forms";
import DataDisplay from "./DataDisplay";
import Charts from "./Charts";
import DisclosurePage from "./Disclosure";
import NavigationPage from "./NavigationPage";
import Feedback from "./Feedback";
import OverlaysPage from "./OverlaysPage";
import AppChrome from "./AppChrome";

const categoryPages: Record<string, React.ComponentType<{ embedded?: boolean }>> = {
  Actions,
  Forms,
  "Data Display": DataDisplay,
  Charts,
  Disclosure: DisclosurePage,
  Navigation: NavigationPage,
  Feedback,
  Overlays: OverlaysPage,
  Layout: AppChrome,
};

export default function Components() {
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
          All Components
        </h1>
        <p
          style={{
            maxWidth: 620,
            margin: "0 auto",
            color: "var(--core-color-text-secondary)",
            fontSize: 18,
            lineHeight: 1.6,
            fontWeight: 400,
          }}
        >
          {totalComponentCount} components on a single page — scroll or use the sidebar to jump to any one.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 80 }}>
        {componentPageOrder.map((title) => {
          const Page = categoryPages[title];
          return Page ? <Page key={title} embedded /> : null;
        })}
      </div>
    </div>
  );
}
