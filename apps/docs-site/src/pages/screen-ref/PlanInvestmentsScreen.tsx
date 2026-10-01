import React, { Fragment } from "react";
import { Tabs } from "../../../../../packages/core/src/components/Navigation";
import { Button } from "../../../../../packages/core/src/components/Button";
import { Field, Input } from "../../../../../packages/core/src/components/Field";
import { Select } from "../../../../../packages/core/src/components/FormControls";
import { SortIcon } from "../../../../../packages/core/src/components/Primitives";
import { PortalShell, T } from "./shared";

/** Investment portfolio — Plan investments tab (portal src/pages/Portfolio.jsx). */

const FUNDS = [
  { name: "Vanguard Institutional Index Fund Admiral Shares", cat: "Large Cap Blend", v: ["8.62%", "14.82%", "13.91%", "11.87%", "10.74%", "0.04%", "$0.40", "0.00%"], bench: "Benchmark - S&P 500 Index", b: ["9.10%", "15.10%", "14.18%", "12.40%", "11.20%"] },
  { name: "Fidelity 500 Index Fund Institutional Class", cat: "Large Cap Blend", v: ["8.71%", "14.95%", "14.02%", "11.96%", "10.86%", "0.02%", "$0.20", "0.00%"], bench: "Benchmark - S&P 500 Index", b: ["9.10%", "15.10%", "14.18%", "12.40%", "11.20%"] },
  { name: "Vanguard Total Bond Market Index Fund Admiral Shares", cat: "Intermediate Bond", v: ["3.12%", "5.18%", "0.86%", "2.14%", "4.02%", "0.05%", "$0.50", "0.00%"], bench: "Benchmark - Bloomberg U.S. Aggregate Bond", b: ["3.40%", "5.32%", "1.04%", "2.28%", "4.20%"] },
  { name: "Fidelity U.S. Bond Index Fund Institutional Premium", cat: "Intermediate Bond", v: ["3.21%", "5.27%", "0.94%", "2.21%", "4.15%", "0.03%", "$0.30", "0.00%"], bench: "Benchmark - Bloomberg U.S. Aggregate Bond", b: ["3.40%", "5.32%", "1.04%", "2.28%", "4.20%"] },
  { name: "Vanguard Target Retirement 2050 Trust Select", cat: "Target-Date", v: ["6.15%", "10.42%", "8.92%", "—", "7.86%", "0.08%", "$0.80", "0.00%"], bench: "Benchmark - Target Retirement Composite", b: ["6.40%", "10.71%", "9.21%", "8.50%", "8.10%"] },
];

export function PlanInvestmentsScreen() {
  return (
    <PortalShell current="portfolio">
      <div data-spec="Page header" className="sr-page-head">
        <div data-spec="Title row" className="sr-page-head-row">
          <T as="h1" t="h1" className="sr-h1">Investment portfolio</T>
          <div style={{ width: "calc(var(--core-space-1) * 80)" }}><Select aria-label="Select plan" defaultValue="p" options={[{ value: "p", label: "LendGuard Employees Savings and Retirement 401(k) Plan" }]} /></div>
        </div>
      </div>
      <div data-spec="Tabs bar" className="sr-tabs-bar"><Tabs defaultId="plan" items={[{ id: "mine", label: "My portfolio" }, { id: "plan", label: "Plan investments" }]} /></div>
      <div data-spec="Page body" className="page-body">
        <div className="tab-panel on" role="tabpanel">
          <section data-spec="Plan investments" className="section">
            <T as="h2" t="h4">Plan investments</T>
            <T as="p" t="text14Regular" className="sub">Browse and compare the funds available within the retirement plan.</T>
            <div data-spec="Table tools" className="table-tools">
              <div className="doc-field table-search">
                <Field label="Search">{(p) => <Input {...p} placeholder="Search investment name or category" />}</Field>
              </div>
              <Button variant="secondary" className="table-export">Export</Button>
            </div>
            <div data-spec="Plan investments table" className="table-wrap t-stack-wrap">
              <table className="plan-table t-stack">
                <thead>
                  <tr>
                    <th scope="col" className="fund-col" rowSpan={2} data-type="text14SemiBold">Fund name / category</th>
                    <th scope="col" rowSpan={2} className="sortable">
                      <button type="button" data-type="text14SemiBold">Return YTD<SortIcon className="sort-icon" /></button>
                    </th>
                    <th scope="col" className="group-h" colSpan={4} data-type="text14SemiBold">Average annual total return</th>
                    <th scope="col" className="group-h" colSpan={2} data-type="text14SemiBold">Total expense ratio</th>
                    <th scope="col" rowSpan={2} data-type="text14SemiBold">Shareholder-<br />type fees</th>
                  </tr>
                  <tr>
                    {["1 yr.", "5 yr.", "10 yr.", "Since inception", "As a %", "Per $1,000"].map((h) => (
                      <th key={h} scope="col" className="sub-h" data-type="text12SemiBold">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {FUNDS.map((f) => (
                    <Fragment key={f.name}>
                      <tr className="fund-row">
                        <td className="fund-cell">
                          <button type="button" className="text-link fund-link fund-title" data-type="text14SemiBold">{f.name}</button>
                          <div className="fund-meta"><T t="text12Regular" className="fund-cat">{f.cat}</T></div>
                        </td>
                        {f.v.map((v, i) => <td key={i} data-type="text14Regular">{v}</td>)}
                      </tr>
                      <tr className="bench-row group-end">
                        <td className="fund-cell"><T as="div" t="text14Medium" className="fund-title">{f.bench}</T></td>
                        {[...f.b, "—", "—", "N/A"].map((v, i) => <td key={i} data-type="text14Regular">{v}</td>)}
                      </tr>
                    </Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </PortalShell>
  );
}
