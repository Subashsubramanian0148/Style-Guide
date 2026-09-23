import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./Layout";
import Home from "./pages/Home";
import Color from "./pages/Color";
import ColorExtraction from "./pages/ColorExtraction";
import Common from "./pages/Common";
import Typography from "./pages/Typography";
import LayoutGrid from "./pages/LayoutGrid";
import LogoPage from "./pages/Logo";
import Components from "./pages/Components";
import LegacyComponentRedirect from "./LegacyComponentRedirect";
import Patterns from "./pages/Patterns";
import Screens from "./pages/Screens";
import Tokens from "./pages/Tokens";
import Themes from "./pages/Themes";
import Accessibility from "./pages/Accessibility";
export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/foundations/color" element={<Color />} />
        <Route path="/foundations/color-extraction" element={<Navigate to="/color-extraction" replace />} />
        <Route path="/foundations/typography" element={<Typography />} />
        <Route path="/foundations/common" element={<Common />} />
        <Route path="/foundations/spacing" element={<Navigate to="/foundations/typography" replace />} />
        <Route path="/foundations/radius-elevation" element={<Navigate to="/foundations/typography" replace />} />
        <Route path="/foundations/responsive" element={<Navigate to="/foundations/typography" replace />} />
        <Route path="/foundations/motion" element={<Navigate to="/foundations/typography" replace />} />
        <Route path="/foundations/icons" element={<Navigate to="/foundations/typography" replace />} />
        <Route path="/foundations/layout-grid" element={<LayoutGrid />} />
        <Route path="/foundations/logo" element={<LogoPage />} />
        <Route path="/components" element={<Components />} />
        <Route path="/components/actions" element={<LegacyComponentRedirect />} />
        <Route path="/components/forms" element={<LegacyComponentRedirect />} />
        <Route path="/components/data-display" element={<LegacyComponentRedirect />} />
        <Route path="/components/disclosure" element={<LegacyComponentRedirect />} />
        <Route path="/components/navigation" element={<LegacyComponentRedirect />} />
        <Route path="/components/feedback" element={<LegacyComponentRedirect />} />
        <Route path="/components/overlays" element={<LegacyComponentRedirect />} />
        <Route path="/components/charts" element={<LegacyComponentRedirect />} />
        <Route path="/components/questionnaire" element={<LegacyComponentRedirect />} />
        <Route path="/patterns" element={<Patterns />} />
        <Route path="/screens" element={<Screens />} />
        <Route path="/tokens" element={<Tokens />} />
        <Route path="/themes" element={<Themes />} />
        <Route path="/accessibility" element={<Accessibility />} />
        <Route path="/color-extraction" element={<ColorExtraction />} />
        <Route path="/anatomy" element={<Navigate to="/components" replace />} />
      </Route>
    </Routes>
  );
}
