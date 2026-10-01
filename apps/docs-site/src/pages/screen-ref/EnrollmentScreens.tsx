import React from "react";
import { Stepper } from "../../../../../packages/core/src/components/Navigation";
import { Button } from "../../../../../packages/core/src/components/Button";
import { PortalShell, T } from "./shared";

/** Enrollment flow — portal src/components/layout/EnrollmentLayout.jsx plus
 *  the step pages Enrollment.jsx (1), Investments.jsx (2) and
 *  EnrollmentSummary.jsx (3). The step panel and plan header are shared. */

const STEPS = [
  { label: "Deferral rate", description: "Specify payroll deferral rates and set up auto increase." },
  { label: "Investment election", description: "Choose the investments and its allocation percentages" },
  { label: "Summary", description: "Review the elections before confirming." },
];

export function EnrollmentLayout({ step, children }: { step: number; children: React.ReactNode }) {
  return (
    <div className="sr-enroll-shell">
      <PortalShell current="dashboard" footer={false}>
        <div data-spec="Enrollment layout" className="sr-enroll">
          <aside data-spec="Steps panel" className="sr-steps">
            <a className="sr-link" href="#">‹ Back</a>
            <T as="h1" t="h2" className="sr-steps-title">Plan enrollment</T>
            <div className="sr-divider" />
            <Stepper orientation="vertical" currentIndex={step} steps={STEPS} />
          </aside>
          <div data-spec="Enrollment main" className="sr-enroll-main">
            <div data-spec="Detail header" className="sr-detail-head">
              <T as="div" t="text12SemiBold" className="sr-eyebrow">Plan details</T>
              <T as="h2" t="h2" className="sr-detail-h2">401(k) Company Plan High Returns</T>
              <T as="div" t="text16Regular" className="sr-plan-meta">Plan ID <b>124542</b></T>
            </div>
            {children}
          </div>
        </div>
      </PortalShell>
    </div>
  );
}

function Choice({ title, body }: { title: string; body: string }) {
  return (
    <button type="button" role="radio" aria-checked="false" className="choice">
      <span className="choice-dot" aria-hidden="true" />
      <span>
        <T as="b" t="text14Bold">{title}</T>
        <T as="small" t="text14Medium">{body}</T>
      </span>
    </button>
  );
}

function Nav({ primary }: { primary: string }) {
  return (
    <div data-spec="Actions" className="enroll-nav">
      <Button>{primary}</Button>
      <Button variant="tertiary">Cancel</Button>
    </div>
  );
}

export function EnrollmentInvestmentsScreen() {
  return (
    <EnrollmentLayout step={1}>
      <div data-spec="Detail body" className="detail-body enroll-simple">
        <div data-spec="Section top" className="section-top">
          <div>
            <T as="h3" t="h6" className="section-title">Investment election</T>
            <T as="p" t="text14Regular" className="section-sub">Choose how the deferrals are invested. The allocations must total to 100%.</T>
          </div>
          <button type="button" className="text-link optout-link" data-type="text14Bold">View plan investments</button>
        </div>
        <div data-spec="Election choices" className="choice-list" role="radiogroup" aria-label="Investment election">
          <Choice title="Use plan-selected investments" body="Investments will be made in the plan's default selection unless preferred investments are selected." />
          <Choice title="Select my own investments" body="Select preferred investments and set the allocation." />
          <Choice title="Match my investments to my risk style" body="Answer a few questions and we'll set your allocation to match your risk tolerance." />
        </div>
        <Nav primary="Continue" />
      </div>
    </EnrollmentLayout>
  );
}

function ReviewRows({ rows }: { rows: Array<[string, string]> }) {
  return (
    <ul className="review-rows">
      {rows.map(([k, v]) => (
        <li key={k}><T t="text14Regular">{k}</T><T as="b" t="text14Bold">{v}</T></li>
      ))}
    </ul>
  );
}

export function EnrollmentSummaryScreen() {
  return (
    <EnrollmentLayout step={2}>
      <div data-spec="Detail body" className="detail-body enroll-simple">
        <div data-spec="Summary" className="summary-page">
          <T as="h3" t="h6" className="section-title">Review and confirm</T>
          <T as="p" t="text14Regular" className="section-sub">You're almost done. Review your selections and confirm to enroll.</T>
          <article data-spec="Deferral review" className="review-card">
            <div className="review-h">
              <div className="review-title">
                <T as="h4" t="h6">Deferral rate</T>
                <T as="small" t="text14SemiBold">From each paycheck</T>
              </div>
              <button type="button" className="text-btn" data-type="text14Bold">Edit</button>
            </div>
            <ReviewRows rows={[["Pre-Tax", "0%"], ["Roth", "0%"]]} />
            <div className="review-sources review-divider">
              <div>
                <T as="h5" t="h6">Auto increase</T>
                <T as="p" t="text14Regular">The elected deferral rate will remain the same each year.</T>
              </div>
            </div>
          </article>
          <article data-spec="Investment review" className="review-card">
            <div className="review-h">
              <div className="review-title">
                <T as="h4" t="h6">Investment election</T>
                <T as="small" t="text14SemiBold">Own election</T>
              </div>
              <button type="button" className="text-btn" data-type="text14Bold">Edit</button>
            </div>
            <T as="p" t="text14Regular">No funds selected yet.</T>
          </article>
          <T as="p" t="text14SemiBold" className="summary-note">You can update the enrollment selections any time.</T>
          <Nav primary="Confirm enrollment" />
        </div>
      </div>
    </EnrollmentLayout>
  );
}
