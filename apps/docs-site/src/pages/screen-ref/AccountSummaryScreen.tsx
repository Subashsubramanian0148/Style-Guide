import React from "react";
import { Badge } from "../../../../../packages/core/src/components/Misc";
import { Icon, SortIcon, ChevronIcon } from "../../../../../packages/core/src/components/Primitives";
import { PortalShell, T } from "./shared";

/** Account summary — portal src/pages/AccountSummary.jsx (Sources tab). */

const SOURCES: Array<[string, number]> = [
  ["Pre-Tax", 4200], ["Roth", 1600], ["Match", 2200], ["After-Tax", 800], ["Profit Sharing", 900], ["Rollover", 1100],
  ["QNEC", 400], ["Safe Harbor", 550], ["Employer Discretionary", 450], ["Catch-Up", 380], ["Rollover Roth", 260],
];
const TOTAL = SOURCES.reduce((n, [, v]) => n + v, 0);
const money = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD" });
const pct = (n: number) => `${n.toFixed(2)}%`;

const PLANS = [
  { name: "LendGuard Employees Savings and Retirement 401(k) Plan", id: "124542", type: "401(k)", balance: 12840, vested: 9620, on: true },
  { name: "LendGuard Profit Sharing and Employee Ownership Plan", id: "124890", type: "Profit Sharing", balance: 4250, vested: 4250, on: false },
];

/** Doughnut (portal: Chart.js, cutout 68%, starts at 12 o'clock). */
export function Donut({ values, size = 260, cutout = 0.68 }: { values: number[]; size?: number; cutout?: number }) {
  const total = values.reduce((a, b) => a + b, 0) || 1;
  const outer = size / 2;
  const width = outer * (1 - cutout);
  const r = outer - width / 2;
  const c = 2 * Math.PI * r;
  let offset = 0;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true" style={{ display: "block" }}>
      <g transform={`rotate(-90 ${outer} ${outer})`}>
        {values.map((v, i) => {
          const len = (v / total) * c;
          const el = <circle key={i} cx={outer} cy={outer} r={r} fill="none" stroke={`var(--chart-${(i % 11) + 1})`} strokeWidth={width} strokeDasharray={`${len} ${c - len}`} strokeDashoffset={-offset} />;
          offset += len;
          return el;
        })}
      </g>
    </svg>
  );
}

function SortTh({ label, num }: { label: string; num?: boolean }) {
  return (
    <th scope="col" className={num ? "num" : undefined}>
      <button type="button" className="th-sort" data-type="text14SemiBold">
        {label}
        <SortIcon className="sort-icon" />
      </button>
    </th>
  );
}

export function AccountSummaryScreen() {
  return (
    <PortalShell current="dashboard">
      <div data-spec="Page body" className="page-body as-page">
        <div data-spec="Title bar" className="hi-bar">
          <div>
            <a href="#" className="text-link pr-back" data-type="text14Bold">
              <Icon name="fa-solid fa-arrow-left" size="sm" />
              Dashboard
            </a>
            <T as="h1" t="h1">Account summary</T>
            <T as="p" t="text14Medium" className="pr-intro">View balances by sources or by investments</T>
          </div>
        </div>
        <div data-spec="Summary layout" className="as-shell">
          <nav data-spec="Plan list" className="as-plans" aria-label="Plans">
            {PLANS.map((p) => (
              <button key={p.id} type="button" className={p.on ? "on" : ""} data-spec="Plan button">
                <div className="as-plan-top">
                  <T as="strong" t="text14Bold">{p.name}</T>
                  <Badge tone="success" size="sm">Participating</Badge>
                </div>
                <T as="div" t="text12SemiBold" className="as-plan-meta">Plan ID {p.id} · Type {p.type}</T>
                <div data-spec="Plan balances" className="as-plan-stats">
                  <div><T t="text12Bold">Account balance</T><T as="b" t="text14Bold">{money(p.balance)}</T></div>
                  <div><T t="text12Bold">Vested balance</T><T as="b" t="text14Bold" className="vested">{money(p.vested)}</T></div>
                </div>
              </button>
            ))}
          </nav>
          <section data-spec="Balance panel" className="panel as-main">
            <div data-spec="View tabs" className="as-tabs" role="tablist" aria-label="Balance view">
              {[["Sources", "fa-solid fa-database", true], ["Investments", "fa-solid fa-chart-pie", false]].map(([label, icon, on]) => (
                <button key={label as string} type="button" role="tab" aria-selected={on as boolean} className={on ? "on" : ""} data-type={on ? "text16SemiBold" : "text16Medium"}>
                  <span className="pr-nav-ico" aria-hidden="true"><Icon name={icon as string} size="sm" /></span>
                  {label}
                </button>
              ))}
            </div>
            <div data-spec="Chart" className="as-viz">
              <div className="as-donut">
                <Donut values={SOURCES.map(([, v]) => v)} />
                <div className="as-donut-center">
                  <T as="small" t="text12Bold">Account balance</T>
                  <T as="b" t="text20Bold">{money(TOTAL)}</T>
                  <T as="em" t="text12Bold">100.00%</T>
                </div>
              </div>
            </div>
            <div data-spec="Sources table" className="as-table-wrap">
              <table className="as-table-accordion">
                <thead>
                  <tr>
                    <SortTh label="Source" />
                    <SortTh label="Balance" num />
                    <SortTh label="Percent" num />
                    <th scope="col" className="as-chev-col"><span className="sr-only">Details</span></th>
                  </tr>
                </thead>
                <tbody>
                  {SOURCES.map(([name, v], i) => (
                    <tr key={name} className={`as-row-expandable${i % 2 ? " as-row-alt" : ""}`}>
                      <td>
                        <span className="as-row-name-cell" data-type="text14Regular">
                          <span className="as-swatch" style={{ background: `var(--chart-${i + 1})` }} aria-hidden="true" />
                          {name}
                        </span>
                      </td>
                      <td className="num" data-type="text14Regular">{money(v)}</td>
                      <td className="num" data-type="text14Regular">{pct((v / TOTAL) * 100)}</td>
                      <td className="as-chev-cell">
                        <button type="button" className="as-row-toggle" aria-expanded="false" aria-label={`Show holdings for ${name}`}>
                          <ChevronIcon size={15} className="as-row-chevron" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td data-type="text14Bold">Total</td>
                    <td className="num" data-type="text14Bold">{money(TOTAL)}</td>
                    <td className="num" data-type="text14Bold">100.00%</td>
                    <td />
                  </tr>
                </tfoot>
              </table>
            </div>
          </section>
        </div>
      </div>
    </PortalShell>
  );
}
