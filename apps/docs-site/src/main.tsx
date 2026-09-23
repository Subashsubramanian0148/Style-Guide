import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import App from "./App";
import "./theme-palette.css";
import "./typography-tokens.css";
import "./site.css";
import "@tokens/core.css";
import "@tokens/meridian.css";
import "@tokens/clientb.css";
import "../../../packages/core/src/styles/components.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>
);
