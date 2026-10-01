import React from "react";
import { Badge } from "../../../../../packages/core/src/components/Misc";
import { Icon } from "../../../../../packages/core/src/components/Primitives";
import { PortalShell, T } from "./shared";

/** View plan details — portal src/pages/PlanDetails.jsx (Deferrals tab). */

function Rows({ rows }: { rows: Array<[string, string]> }) {
  return (
    <ul className="detail-rows">
      {rows.map(([k, v]) => (
        <li key={k}>
          <T t="text14Regular">{k}</T>
          <T as="b" t="text14Bold">{v}</T>
        </li>
      ))}
    </ul>
  );
}

export function PlanDetailsScreen() {
  return (
    <PortalShell current="dashboard">
      <div data-spec="Page body" className="page-body">
        <div data-spec="Title bar" className="hi-bar">
          <div>
            <a href="#" className="text-link" data-type="text14Bold">‹ Your Plans</a>
            <T as="h1" t="h1">LendGuard Employees Savings and Retirement 401(k) Plan</T>
            <Badge tone="success" size="sm" className="plan-badge">Participating</Badge>
          </div>
        </div>

        <div data-spec="Plan overview" className="plan-overview">
          <div data-spec="Plan facts" className="plan-overview-left">
            <div className="plan-fact" data-type="text12SemiBold">Plan Details<T as="b" t="text14Bold">401(k) · Plan ID 124542</T></div>
            <div className="plan-fact" data-type="text12SemiBold">Company Name<T as="b" t="text14Bold">LendGuard</T></div>
            <div className="plan-fact-row">
              <div className="plan-fact" data-type="text12SemiBold">Enrollment Status<T as="b" t="text14Bold">Auto Enrolled</T></div>
              <div className="plan-fact" data-type="text12SemiBold">SSN<T as="b" t="text14Bold">•••-••-4182</T></div>
            </div>
          </div>
          <div data-spec="Plan balances" className="plan-stats">
            <div className="plan-stat balance"><T as="div" t="text12SemiBold" className="k">Account balance</T><T as="div" t="text16Bold" className="v">$12,840.00</T></div>
            <div className="plan-stat vested"><T as="div" t="text12SemiBold" className="k">Vested balance</T><T as="div" t="text16Bold" className="v">$9,620.00</T></div>
          </div>
        </div>

        <div data-spec="Elections layout" className="pr-shell">
          <nav data-spec="Election tabs" className="pr-nav" role="tablist" aria-label="Plan elections">
            {[["Deferrals", "fa-solid fa-percent", true], ["Investments", "fa-solid fa-chart-line", false]].map(([label, icon, on]) => (
              <button key={label as string} type="button" role="tab" aria-selected={on as boolean} className={on ? "on" : ""} data-type="text14Bold">
                <span className="pr-nav-ico" aria-hidden="true"><Icon name={icon as string} size="sm" /></span>
                {label}
              </button>
            ))}
          </nav>
          <div data-spec="Election details" className="pr-main">
            <section data-spec="Deferral panel" className="panel">
              <div className="panel-h">
                <T as="h2" t="h5" className="panel-title">Deferral &amp; auto increase</T>
                <button type="button" className="text-link" data-type="text14Bold">Edit</button>
              </div>
              <Rows rows={[["Pre-Tax", "6%"], ["Roth", "2%"]]} />
              <T as="h3" t="h5" className="src-label">Auto increase</T>
              <Rows rows={[["Cycle", "Calendar year"], ["Pre-Tax", "+1% until 10%"], ["Roth", "+1% until 10%"]]} />
            </section>
            <div className="plan-optout">
              <button type="button" className="text-link danger" data-type="text14Bold">Opt out of paycheck deferral</button>
            </div>
          </div>
        </div>
      </div>
    </PortalShell>
  );
}
