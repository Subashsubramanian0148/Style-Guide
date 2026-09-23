import { Navigate, useLocation } from "react-router-dom";

/** Preserves hash anchors when redirecting old per-category component routes. */
export default function LegacyComponentRedirect() {
  const location = useLocation();
  return <Navigate to={`/components${location.hash}`} replace />;
}
