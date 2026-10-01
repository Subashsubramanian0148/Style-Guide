import React from "react";
import { Button } from "../../../../../packages/core/src/components/Button";
import { Select } from "../../../../../packages/core/src/components/FormControls";
import { Icon } from "../../../../../packages/core/src/components/Primitives";
import { PortalShell, T } from "./shared";

/** Profile → Beneficiary Details and the three Add beneficiary steps
 *  (portal src/pages/Profile.jsx, src/components/profile/AddBeneficiary.jsx). */

const PROFILE_NAV: Array<[string, string]> = [
  ["Personal Details", "fa-solid fa-heart"],
  ["Bank Details", "fa-solid fa-landmark"],
  ["Employment Information", "fa-solid fa-briefcase"],
  ["Employee Classification", "fa-solid fa-tags"],
  ["Beneficiary Details", "fa-solid fa-users"],
];

const BENES: Array<[string, string, string, string]> = [
  ["Primary", "Taylor Hale", "Spouse", "70%"],
  ["Primary", "Riley Hale", "Child", "30%"],
  ["Contingent", "Morgan Hale", "Parent", "100%"],
];

export function BeneficiaryListScreen() {
  return (
    <PortalShell current="profile">
      <div data-spec="Page body" className="page-body pr-page">
        <div data-spec="Title bar" className="hi-bar">
          <div>
            <T as="h1" t="h1">Profile details</T>
            <T as="p" t="text14Medium" className="pr-intro">Manage personal, employment, bank and beneficiary details</T>
          </div>
        </div>
        <div data-spec="Profile layout" className="pr-shell">
          <nav data-spec="Section nav" className="pr-nav" aria-label="Profile sections">
            {PROFILE_NAV.map(([label, icon]) => {
              const on = label === "Beneficiary Details";
              return (
                <button key={label} type="button" className={on ? "on" : ""}>
                  <span className="pr-nav-ico" aria-hidden="true"><Icon name={icon} size="sm" /></span>
                  <T className="pr-nav-label" t={on ? "text14SemiBold" : "text14Bold"}>{label}</T>
                </button>
              );
            })}
          </nav>
          <div className="pr-main">
            <section data-spec="Beneficiary panel" className="panel pr-panel">
              <div data-spec="Section header" className="pr-sec-h">
                <T as="h3" t="h5">Beneficiary Details</T>
                <div className="pr-sec-actions"><Button variant="secondary" className="pr-edit">Add Beneficiary</Button></div>
              </div>
              <div data-spec="Beneficiary table" className="table-wrap pr-table t-stack-wrap">
                <table className="t-stack">
                  <thead>
                    <tr>
                      {["Type", "Name", "Relationship", "Share", "Actions"].map((h) => (
                        <th key={h} scope="col" className={h === "Share" ? "num" : undefined} data-type="text14SemiBold">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {BENES.map(([type, name, rel, share]) => (
                      <tr key={name}>
                        <td data-label="Type"><T className={`pr-pill${type === "Primary" ? " on" : ""}`} t="text12Medium">{type}</T></td>
                        <td data-label="Name"><button type="button" className="text-link" data-type="text14Bold">{name}</button></td>
                        <td data-label="Relationship" data-type="text14Regular">{rel}</td>
                        <td className="num" data-label="Share" data-type="text14Regular">{share}</td>
                        <td><button type="button" className="pr-row-edit" data-type="text12Bold">Set %</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </div>
      </div>
    </PortalShell>
  );
}

const STEPS = [
  { title: "Basic details", hint: "Specify the basic details of the beneficiary." },
  { title: "Contact details", hint: "Update the correct contact details to reach beneficiary." },
  { title: "Bank details", hint: "Specify the active bank details of the beneficiary." },
];

function Label({ text, required }: { text: string; required?: boolean }) {
  return <T t="text14SemiBold">{text}{required ? <i>*</i> : null}</T>;
}

function TextField({ label, placeholder, required }: { label: string; placeholder: string; required?: boolean }) {
  return (
    <label data-spec="Field" className="pr-field">
      <Label text={label} required={required} />
      <div><input type="text" placeholder={placeholder} data-type="text14Regular" /></div>
    </label>
  );
}

function SelectField({ label, value, required }: { label: string; value: string; required?: boolean }) {
  return (
    <label data-spec="Field" className="pr-field">
      <Label text={label} required={required} />
      <Select aria-label={label} defaultValue="v" options={[{ value: "v", label: value }]} />
    </label>
  );
}

function AddBeneficiaryLayout({ step, children }: { step: number; children: React.ReactNode }) {
  return (
    <PortalShell current="profile">
      <div data-spec="Page body" className="page-body pr-page">
        <div data-spec="Title bar" className="hi-bar">
          <div>
            <button type="button" className="text-link pr-back" data-type="text14Bold">Back</button>
            <T as="h1" t="h1">Add beneficiary</T>
          </div>
        </div>
        <div data-spec="Form layout" className="pr-shell">
          <h2 className="sr-only">Beneficiary form sections</h2>
          <ol data-spec="Steps" className="pr-steps" aria-label="Beneficiary steps">
            {STEPS.map((s, i) => {
              const done = i < step;
              const on = i === step;
              return (
                <li key={s.title} className={done ? "done" : on ? "on" : ""}>
                  <button type="button" disabled={i > step}>
                    <b data-type="text12Bold">{done ? <Icon name="fa-solid fa-check" size="sm" /> : i + 1}</b>
                    <div>
                      <T as="strong" t="text14Bold">{s.title}</T>
                      <T as="p" t="text12Medium">{s.hint}</T>
                      {done ? <T as="em" t="text12Bold" className="ok">Completed</T> : on ? <T as="em" t="text12Bold">In progress</T> : null}
                    </div>
                  </button>
                </li>
              );
            })}
          </ol>
          <div className="pr-main">
            <section data-spec="Step panel" className="panel pr-panel">
              <T as="h3" t="h5">{STEPS[step].title}</T>
              <div data-spec="Form" className="pr-form">{children}</div>
              <div data-spec="Action bar" className="pr-savebar">
                <Button variant="primary">{step === 2 ? "Save" : "Next"}</Button>
                {step > 0 && <Button variant="secondary">Previous</Button>}
                <Button variant="secondary">Cancel</Button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </PortalShell>
  );
}

export function AddBeneficiaryBasicScreen() {
  return (
    <AddBeneficiaryLayout step={0}>
      <div data-spec="Field" className="pr-field">
        <Label text="Beneficiary type" />
        <div className="pr-radios">
          {["Primary", "Contingent"].map((opt) => (
            <label key={opt} className={opt === "Primary" ? "on" : ""} data-type="text14Bold">
              <input type="radio" name="sr-bene-type" defaultChecked={opt === "Primary"} />
              {opt}
            </label>
          ))}
        </div>
      </div>
      <TextField label="Beneficiary Name" placeholder="Enter beneficiary name" required />
      <SelectField label="Relationship" value="Non-Spouse" required />
      <label data-spec="Field" className="pr-field">
        <Label text="Social Security Number" required />
        <div>
          <div className="pr-input-ico">
            <input type="password" placeholder="Enter social security number" data-type="text14Regular" />
            <button type="button" className="pr-eye" aria-label="Show SSN"><Icon name="fa-solid fa-eye" size="sm" /></button>
          </div>
        </div>
      </label>
      <TextField label="Date Of Birth" placeholder="MM-DD-YYYY" required />
    </AddBeneficiaryLayout>
  );
}

export function AddBeneficiaryContactScreen() {
  return (
    <AddBeneficiaryLayout step={1}>
      <TextField label="Email ID" placeholder="Enter email ID" required />
      <div data-spec="Field" className="pr-field">
        <Label text="Phone Number" required />
        <div className="pr-phone">
          <input defaultValue="+1" aria-label="Phone Number country code" data-type="text14Regular" />
          <input placeholder="Enter phone number" aria-label="Phone Number number" data-type="text14Regular" />
        </div>
      </div>
      <TextField label="Address Line 1" placeholder="Enter address line 1" />
      <TextField label="Address Line 2" placeholder="Enter address line 2" />
      <TextField label="City" placeholder="Enter city" />
      <TextField label="Zip Code" placeholder="Enter zip code" />
      <SelectField label="Country" value="Select an option" />
      <TextField label="State" placeholder="Select an option" />
    </AddBeneficiaryLayout>
  );
}

export function AddBeneficiaryBankScreen() {
  return (
    <AddBeneficiaryLayout step={2}>
      <TextField label="Bank Account Number" placeholder="Enter account number" required />
      <TextField label="Account Holder Name" placeholder="Enter account holder name" required />
      <TextField label="Bank Name" placeholder="Enter bank name" required />
      <TextField label="ABA Routing Number" placeholder="Enter ABA routing number" required />
      <SelectField label="Type Of Account" value="Saving" required />
    </AddBeneficiaryLayout>
  );
}
