import React from "react";
import { Button } from "../../../../../packages/core/src/components/Button";
import { Select } from "../../../../../packages/core/src/components/FormControls";
import { Icon } from "../../../../../packages/core/src/components/Primitives";
import { PortalShell, T } from "./shared";

/** Retirement readiness — portal src/pages/RetirementGoal.jsx
 *  (two deferral plans, auto increase off). */

const R = 42;
const CIRC = 2 * Math.PI * R;
const SCORE = 76;

function TargetCard({ icon, label, hint, children }: { icon: string; label: string; hint: string; children: React.ReactNode }) {
  return (
    <div data-spec="Target card" className="rg-target">
      <div className="rg-target-head">
        <span className="rg-target-ico" aria-hidden="true"><Icon name={icon} size="sm" /></span>
        <div className="rg-target-copy">
          <T t="text14Bold">{label}</T>
          <T as="small" t="text12Medium">{hint}</T>
        </div>
      </div>
      <div className="rg-target-ctrl">{children}</div>
    </div>
  );
}

function MoneyInput({ value, label }: { value: string; label: string }) {
  return (
    <span className="rg-affix">
      <em data-type="text14Regular">$</em>
      <input inputMode="numeric" defaultValue={value} aria-label={label} data-type="text14Regular" />
    </span>
  );
}

function Source({ title, hint, value }: { title: string; hint: string; value: number }) {
  return (
    <div data-spec="Deferral source" className="rg-source">
      <div className="rg-source-h">
        <span>
          <T as="b" t="text14Bold">{title}</T>
          <T as="small" t="text12Medium">{hint}</T>
        </span>
        <span className="rg-affix pct">
          <input type="number" min={0} max={12} defaultValue={value} aria-label={`${title} rate`} data-type="text14Regular" />
          <em data-type="text14Regular">%</em>
        </span>
      </div>
      <div className="rg-range">
        <span className="rg-range-fill" style={{ width: `${(value / 12) * 100}%` }} />
        <input type="range" min={0} max={12} defaultValue={value} aria-label={`${title} rate`} />
      </div>
    </div>
  );
}

export function RetirementReadinessScreen() {
  return (
    <PortalShell current="dashboard">
      <div data-spec="Page body" className="page-body rg-page">
        <div data-spec="Title bar" className="hi-bar">
          <div>
            <a href="#" className="text-link rg-back" data-type="text14Bold">Back to dashboard</a>
            <T as="h1" t="h1">Retirement readiness</T>
          </div>
        </div>

        <div data-spec="Readiness layout" className="rg-shell">
          <aside data-spec="Live result" className="panel rg-live">
            <div className="rr-visual">
              <div className="rr-chart">
                <div className="rr-donut large">
                  <svg viewBox="0 0 100 100" role="img" aria-label={`${SCORE} percent of retirement spend funded`}>
                    <circle className="rr-track" cx="50" cy="50" r={R} />
                    <circle className="rr-arc" cx="50" cy="50" r={R} stroke="currentColor" strokeDasharray={`${(SCORE / 100) * CIRC} ${CIRC}`} />
                  </svg>
                  <div className="rr-score">
                    <T as="b" t="h1">{SCORE}%</T>
                    <T t="text12Bold">Goal reached</T>
                  </div>
                </div>
              </div>
              <ul data-spec="Legend" className="rr-legend">
                <li data-type="text12Bold">Expected expense<T as="b" t="text16Bold">$55,200</T></li>
                <li className="income" data-type="text12Bold">All income<T as="b" t="text16Bold">$41,900</T></li>
                <li className="short" data-type="text12Bold">Shortfall<T as="b" t="text16Bold">$13,300</T></li>
              </ul>
            </div>
            <dl data-spec="Facts" className="rg-facts">
              {[
                ["Retirement age", "67"],
                ["Years remaining", "35"],
                ["LendGuard Employees Savings and Retirement 401(k) Plan deferral", "8%"],
                ["LendGuard Roth 401(k) Plan deferral", "0%"],
                ["Auto increase", "Off"],
              ].map(([k, v]) => (
                <div key={k}>
                  <T as="dt" t="text12SemiBold">{k}</T>
                  <T as="dd" t="text14Bold">{v}</T>
                </div>
              ))}
            </dl>
            <p data-spec="Disclaimer" className="rg-disc">
              <T className="rr-foot-note" t="text12SemiBold">*Not guaranteed results.</T>
              <button type="button" className="text-link rr-disclaimer-link rg-disc-top" data-type="text14Bold">Disclaimer</button>
            </p>
          </aside>

          <div className="rg-work">
            <section data-spec="Retirement target" className="panel rg-inputs">
              <T as="h2" t="text16Bold">Retirement target</T>
              <div className="rg-targets">
                <TargetCard icon="fa-solid fa-location-dot" label="Retirement location" hint="This information is used to determine the state tax">
                  <Select aria-label="Retirement location" defaultValue="Texas" options={[{ value: "Texas", label: "Texas" }]} />
                </TargetCard>
                <TargetCard icon="fa-solid fa-umbrella" label="Planned retirement age" hint="About 35 years from now">
                  <span className="rg-step">
                    <button type="button" aria-label="Lower age">−</button>
                    <input type="number" min={50} max={80} defaultValue={67} aria-label="Planned retirement age" data-type="text14Regular" />
                    <button type="button" aria-label="Raise age">+</button>
                  </span>
                </TargetCard>
                <TargetCard icon="fa-solid fa-calendar-days" label="Monthly spending" hint="About $55,200 a year · typical here is $4,600">
                  <MoneyInput value="4,600.00" label="Monthly spending" />
                </TargetCard>
                <TargetCard icon="fa-solid fa-money-bill-wave" label="Annual salary" hint="Drives how much each deferral percent saves">
                  <MoneyInput value="96,000.00" label="Annual salary" />
                </TargetCard>
                <TargetCard icon="fa-solid fa-dollar-sign" label="Savings outside your 401(k)" hint="Brokerage, IRAs, and cash you expect to use in retirement">
                  <MoneyInput value="32,000.00" label="Savings outside your 401(k)" />
                </TargetCard>
              </div>
            </section>

            <section data-spec="Deferrals" className="panel rg-inputs">
              <label className="rg-plan-single rg-plan-single--top">
                <T t="text12Bold">Plan</T>
                <Select aria-label="Plan" defaultValue="p" options={[{ value: "p", label: "LendGuard Employees Savings and Retirement 401(k) Plan" }, { value: "r", label: "LendGuard Roth 401(k) Plan" }]} />
              </label>
              <T as="h2" t="text16Bold">Deferrals</T>
              <T as="p" t="text14Medium" className="rg-plan-note">Select a plan to update its deferral rate. Changes will affect your paycheck deductions.</T>
              <div>
                <Source title="Pre-tax deferral" hint="Goes in before taxes and can lower taxable income today." value={6} />
                <Source title="Roth deferral" hint="Goes in after taxes. Qualified withdrawals can come out tax-free." value={2} />
                <label data-spec="Auto increase" className="rg-toggle">
                  <input type="checkbox" />
                  <span data-type="text14SemiBold">
                    <T as="b" t="text14Bold">Auto increase · Off</T>
                    Typical plan setting is +1% each year until 10%.
                  </span>
                </label>
              </div>
            </section>
          </div>
        </div>

        <div data-spec="Action bar" className="rg-nav">
          <Button variant="primary">Update</Button>
          <a href="#" className="text-link" data-type="text14Bold">Cancel</a>
        </div>
      </div>
    </PortalShell>
  );
}
