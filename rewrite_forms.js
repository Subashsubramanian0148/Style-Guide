const fs = require('fs');

const code = `import React, { useState } from "react";
import { Preview } from "../Preview";
import { Field, Input, InputWithIcon } from "../../../../packages/core/src/components/Field";
import { Icon } from "../../../../packages/core/src/components/Primitives";
import { Switch } from "../../../../packages/core/src/components/Misc";
import { Textarea, Select, Checkbox, RadioGroup } from "../../../../packages/core/src/components/FormControls";
import { Toggle, ToggleGroup, InputGroup, InputOTP } from "../../../../packages/core/src/components/ToggleInputs";
import { Slider } from "../../../../packages/core/src/components/Primitives";
import { Combobox } from "../../../../packages/core/src/components/Combobox";
import { Calendar, DatePicker } from "../../../../packages/core/src/components/Calendar";
import { Dropzone, AttachmentList, AttachmentFile } from "../../../../packages/core/src/components/Attachment";

const employers = [
  { value: "acme", label: "Acme Corporation" },
  { value: "globex", label: "Globex Industries" },
  { value: "initech", label: "Initech" },
  { value: "umbrella", label: "Umbrella Health" },
];

export default function Forms() {
  const [on, setOn] = useState(true);
  const [plan, setPlan] = useState("roth");
  const [view, setView] = useState<"list" | "grid">("list");
  const [starred, setStarred] = useState(false);
  const [otp, setOtp] = useState("");
  const [contribPct, setContribPct] = useState(6);
  const [employer, setEmployer] = useState("");
  const [dob, setDob] = useState<Date | undefined>(undefined);
  const [files, setFiles] = useState<AttachmentFile[]>([{ id: "1", name: "beneficiary-form.pdf", size: "212 KB" }]);
  const [freq, setFreq] = useState("monthly");
  const [cardNumber, setCardNumber] = useState("");
  const [routing, setRouting] = useState("");
  const [account, setAccount] = useState("");

  const formatCardNumber = (raw: string) => raw.replace(/\\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();

  const sections = [
    {
      id: "01",
      title: "Input",
      description: "Standard text fields in default and filled variants, showing interactive and validation states.",
      content: (
        <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
          <div className="site-panel site-panel--flush">
            <Preview>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 220px)", gap: "32px 20px" }}>
                <Field label="Default" required>{(p) => <Input {...p} placeholder="Jordan Lee" />}</Field>
                <Field label="Hover">{(p) => <Input {...p} placeholder="Jordan Lee" style={{borderColor: "var(--core-input-borderHover)"}} />}</Field>
                <Field label="Active (Focus)">{(p) => <Input {...p} placeholder="Jordan Lee" style={{borderColor: "var(--core-input-borderFocus)", boxShadow: "0 0 0 3px color-mix(in srgb, var(--core-input-borderFocus) 25%, transparent)"}} />}</Field>
                <Field label="With hint" hint="Found on your enrollment letter">{(p) => <Input {...p} placeholder="e.g. 00214" />}</Field>
                <Field label="With error" error="Must be between 1% and 100%">{(p) => <Input {...p} defaultValue="150" />}</Field>
                <Field label="Disabled">{(p) => <Input {...p} disabled placeholder="Locked" />}</Field>
              </div>
            </Preview>
          </div>
          <div className="site-panel site-panel--flush">
            <Preview>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 220px)", gap: "32px 20px" }}>
                <Field label="Default" required>{(p) => <Input {...p} variant="solid" placeholder="Jordan Lee" />}</Field>
                <Field label="Hover">{(p) => <Input {...p} variant="solid" placeholder="Jordan Lee" style={{borderColor: "var(--core-input-borderHover)"}} />}</Field>
                <Field label="Active (Focus)">{(p) => <Input {...p} variant="solid" placeholder="Jordan Lee" style={{background: "var(--core-input-bg)", borderColor: "var(--core-input-borderFocus)", boxShadow: "0 0 0 3px color-mix(in srgb, var(--core-input-borderFocus) 25%, transparent)"}} />}</Field>
              </div>
            </Preview>
          </div>
        </div>
      )
    },
    {
      id: "02",
      title: "Textarea",
      description: "Multi-line text input that grows vertically with content. Minimum height 88px.",
      content: (
        <div className="site-panel site-panel--flush">
          <Preview>
            <div style={{ width: 320 }}>
              <Field label="Note to account manager" hint="Optional — max 500 characters">{(p) => <Textarea {...p} rows={3} placeholder="Add context for this request…" />}</Field>
            </div>
          </Preview>
        </div>
      )
    },
    {
      id: "03",
      title: "Select",
      description: "Native select dropdown for choosing from a list of options.",
      content: (
        <div className="site-panel site-panel--flush">
          <Preview>
            <div style={{ width: 220 }}>
              <Field label="Investment plan">{(p) => (
                <Select
                  {...p}
                  value={plan}
                  onChange={(e) => setPlan(e.target.value)}
                  options={[
                    { value: "roth", label: "Roth 401(k)" },
                    { value: "traditional", label: "Traditional 401(k)" },
                    { value: "brokerage", label: "Self-directed brokerage" },
                  ]}
                />
              )}</Field>
            </div>
          </Preview>
        </div>
      )
    },
    {
      id: "04",
      title: "Checkbox & Radio",
      description: "Controls for boolean states and mutually exclusive choices.",
      content: (
        <div className="site-panel site-panel--flush">
          <Preview>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <Checkbox label="I agree to the plan terms" defaultChecked />
              <Checkbox label="Send me email confirmations" />
              <Checkbox label="Select all (some selected)" indeterminate />
              <Checkbox label="Disabled option" disabled />
            </div>
            <div style={{ marginLeft: 32 }}>
              <RadioGroup
                name="freq"
                value={freq}
                onChange={setFreq}
                options={[
                  { value: "monthly", label: "Monthly" },
                  { value: "quarterly", label: "Quarterly" },
                  { value: "annually", label: "Annually" },
                ]}
              />
            </div>
          </Preview>
        </div>
      )
    },
    {
      id: "05",
      title: "Switch",
      description: "Toggle control for immediate on/off actions.",
      content: (
        <div className="site-panel site-panel--flush">
          <Preview>
            <Switch label="Enable auto-escalation" checked={on} onChange={setOn} />
          </Preview>
        </div>
      )
    },
    {
      id: "06",
      title: "Toggle",
      description: "Stateful buttons that hold a pressed state, individually or in groups.",
      content: (
        <div className="site-panel site-panel--flush">
          <Preview>
            <Toggle pressed={starred} onPressedChange={setStarred}>★ Favorite</Toggle>
            <ToggleGroup value={view} onChange={setView} options={[{ value: "list", label: "List" }, { value: "grid", label: "Grid" }]} />
          </Preview>
        </div>
      )
    },
    {
      id: "07",
      title: "Input group",
      description: "Text inputs composed with fixed prefix or suffix labels.",
      content: (
        <div className="site-panel site-panel--flush">
          <Preview>
            <div style={{ width: 200 }}>
              <Field label="Contribution amount">{(p) => (
                <InputGroup prefix="$"><Input {...p} defaultValue="250" /></InputGroup>
              )}</Field>
            </div>
            <div style={{ width: 160 }}>
              <Field label="Contribution %">{(p) => (
                <InputGroup suffix="%"><Input {...p} defaultValue="6" /></InputGroup>
              )}</Field>
            </div>
          </Preview>
        </div>
      )
    },
    {
      id: "08",
      title: "Input OTP",
      description: "Segmented input for 2FA and verification codes.",
      content: (
        <div className="site-panel site-panel--flush">
          <Preview>
            <InputOTP value={otp} onChange={setOtp} length={6} />
          </Preview>
        </div>
      )
    },
    {
      id: "09",
      title: "Slider",
      description: "Range control for numeric values.",
      content: (
        <div className="site-panel site-panel--flush">
          <Preview>
            <div style={{ width: 260 }}>
              <Field label="Contribution rate">{() => (
                <Slider value={contribPct} min={0} max={25} onChange={setContribPct} formatValue={(v) => \`\${v}%\`} />
              )}</Field>
            </div>
          </Preview>
        </div>
      )
    },
    {
      id: "10",
      title: "Combobox",
      description: "Searchable select component for long lists of options.",
      content: (
        <div className="site-panel site-panel--flush">
          <Preview>
            <div style={{ width: 240 }}>
              <Field label="Employer">{() => (
                <Combobox options={employers} value={employer} onChange={setEmployer} placeholder="Search employer…" />
              )}</Field>
            </div>
          </Preview>
        </div>
      )
    },
    {
      id: "11",
      title: "Date Selection",
      description: "Inline calendar and popover date picker components.",
      content: (
        <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
          <div className="site-panel site-panel--flush">
            <Preview>
              <div style={{ width: 200 }}>
                <Field label="Date of birth">{() => <DatePicker value={dob} onChange={setDob} />}</Field>
              </div>
            </Preview>
          </div>
          <div className="site-panel site-panel--flush">
            <div className="preview-surface" data-theme="core" data-mode="light" style={{ background: "var(--core-color-bg-page)" }}>
              <Calendar selected={dob} onSelect={setDob} maxDate={new Date()} />
            </div>
          </div>
        </div>
      )
    },
    {
      id: "12",
      title: "Input with icon",
      description: "First-class leading or trailing icon slot.",
      content: (
        <div className="site-panel site-panel--flush">
          <Preview>
            <div style={{ width: 200 }}>
              <Field label="Search transactions">{(p) => <InputWithIcon {...p} leadingIcon={<Icon name="fa-solid fa-magnifying-glass" size="sm" />} placeholder="Search…" />}</Field>
            </div>
            <div style={{ width: 160 }}>
              <Field label="Amount">{(p) => <InputWithIcon {...p} leadingIcon={<Icon name="fa-solid fa-dollar-sign" size="sm" />} defaultValue="250" />}</Field>
            </div>
          </Preview>
        </div>
      )
    },
    {
      id: "13",
      title: "Bank fields",
      description: "Masked and formatted inputs for sensitive data (card, routing, etc.).",
      content: (
        <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
          <div className="site-panel site-panel--flush">
            <Preview>
              <div style={{ width: 260 }}>
                <Field label="Card number" hint="Stored securely — only the last 4 digits are ever shown again.">
                  {(p) => (
                    <InputWithIcon
                      {...p}
                      trailingIcon={<Icon name="fa-solid fa-credit-card" size="sm" />}
                      inputMode="numeric"
                      placeholder="1234 5678 9012 3456"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                    />
                  )}
                </Field>
              </div>
              <div style={{ width: 220 }}>
                <Field label="Expiration date">{(p) => <Input {...p} placeholder="MM / YY" inputMode="numeric" />}</Field>
              </div>
              <div style={{ width: 120 }}>
                <Field label="CVC" hint="3 digits, back of card">{(p) => <Input {...p} placeholder="123" inputMode="numeric" maxLength={4} />}</Field>
              </div>
            </Preview>
          </div>
          <div className="site-panel site-panel--flush">
            <Preview>
              <div style={{ width: 200 }}>
                <Field label="Routing number" hint="9 digits, bottom-left of a check">
                  {(p) => <Input {...p} inputMode="numeric" maxLength={9} placeholder="021000021" value={routing} onChange={(e) => setRouting(e.target.value.replace(/\\D/g, "").slice(0, 9))} />}
                </Field>
              </div>
              <div style={{ width: 220 }}>
                <Field label="Account number" hint="Re-enter to confirm on submit">
                  {(p) => <Input {...p} inputMode="numeric" placeholder="000123456789" value={account} onChange={(e) => setAccount(e.target.value.replace(/\\D/g, ""))} />}
                </Field>
              </div>
            </Preview>
          </div>
        </div>
      )
    },
    {
      id: "14",
      title: "Attachment",
      description: "File upload dropzone and attachment list.",
      content: (
        <div className="site-panel site-panel--flush">
          <Preview>
            <div style={{ width: 360 }}>
              <Dropzone onFiles={(fl) => setFiles((prev) => [...prev, { id: String(Date.now()), name: fl[0].name, size: \`\${Math.round(fl[0].size / 1024)} KB\` }])} />
              <AttachmentList files={files} onRemove={(id) => setFiles((prev) => prev.filter((f) => f.id !== id))} />
            </div>
          </Preview>
        </div>
      )
    }
  ];

  return (
    <div style={{ maxWidth: 1024, margin: "0 auto", padding: "20px" }}>
      <div style={{ textAlign: "center", marginBottom: 60, marginTop: 40 }}>
        <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--core-color-brand-600)", marginBottom: 12 }}>Components</div>
        <h1 style={{ fontSize: 72, fontWeight: 800, letterSpacing: "-0.06em", margin: "0 0 16px 0", color: "var(--core-color-text-primary)", lineHeight: 1.1 }}>
          Form Controls
        </h1>
        <p style={{ maxWidth: 560, margin: "0 auto", color: "var(--core-color-text-tertiary)", fontSize: 18, lineHeight: 1.6, fontWeight: 400 }}>
          Essential components for data entry and configuration. Label, hint, and error states are wired together automatically via aria attributes.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 100 }}>
        {sections.map((s) => (
          <div key={s.id} style={{ display: "flex", flexDirection: "column", gap: 40, position: "relative" }}>
            <div style={{ position: "absolute", top: 0, left: "-12.5%", width: "125%", height: 1, backgroundColor: "var(--site-border)" }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", paddingTop: 32 }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: "var(--core-color-text-tertiary)", marginBottom: 12 }}>{s.id}</div>
                <h2 style={{ fontSize: 48, fontWeight: 500, letterSpacing: "-0.04em", margin: 0, textTransform: "lowercase" }}>{s.title}</h2>
              </div>
              <div style={{ maxWidth: 420, display: "flex", flexDirection: "column", gap: 16, alignItems: "flex-end" }}>
                <p style={{ margin: 0, fontSize: 16, lineHeight: 1.6, color: "var(--core-color-text-secondary)", textAlign: "right", fontWeight: 400 }}>{s.description}</p>
              </div>
            </div>
            <div>
              {s.content}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
`;

fs.writeFileSync('apps/docs-site/src/pages/Forms.tsx', code);
