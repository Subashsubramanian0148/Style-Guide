import React, { useState } from "react";
import { DocsSection, DocsSectionList, StateLabel } from "../DocsSection";
import { ComponentStateMatrix, DEFAULT_MATRIX_STATES } from "../ComponentStateMatrix";
import { Preview } from "../Preview";
import { Anatomy, AnatomyLegend } from "../Anatomy";
import { AnatomySection } from "../AnatomySection";
import { AttachmentAnatomy } from "../AttachmentAnatomy";
import { CheckboxRadioAnatomy } from "../CheckboxRadioAnatomy";
import { ComboboxAnatomy } from "../ComboboxAnatomy";
import { DatePickerAnatomy } from "../DatePickerAnatomy";
import { InputIconAnatomy } from "../InputIconAnatomy";
import { Field, Input, InputWithIcon } from "../../../../packages/core/src/components/Field";
import { Icon } from "../../../../packages/core/src/components/Primitives";
import { Switch } from "../../../../packages/core/src/components/Misc";
import { Textarea, Select, Checkbox, Radio, RadioGroup } from "../../../../packages/core/src/components/FormControls";
import { InputGroup, IncrementalSelector } from "../../../../packages/core/src/components/ToggleInputs";
import { Slider } from "../../../../packages/core/src/components/Primitives";
import { Combobox } from "../../../../packages/core/src/components/Combobox";
import { Calendar, DatePicker } from "../../../../packages/core/src/components/Calendar";
import { Dropzone, AttachmentList, AttachmentFile } from "../../../../packages/core/src/components/Attachment";
import { Badge } from "../../../../packages/core/src/components/Misc";
import { Button } from "../../../../packages/core/src/components/Button";

const employers = [
  { value: "acme", label: "Acme Corporation" },
  { value: "globex", label: "Globex Industries" },
  { value: "initech", label: "Initech" },
  { value: "umbrella", label: "Umbrella Health" },
];

const usStates = [
  { value: "ca", label: "California" },
  { value: "ny", label: "New York" },
  { value: "tx", label: "Texas" },
  { value: "fl", label: "Florida" },
  { value: "wa", label: "Washington" },
];

export default function Forms({ embedded = false }: { embedded?: boolean }) {
  const [on, setOn] = useState(true);
  const [plan, setPlan] = useState("roth");
  const [contribPct, setContribPct] = useState(12);
  const [employer, setEmployer] = useState("");
  const [dob, setDob] = useState<Date | undefined>(undefined);
  const [files, setFiles] = useState<AttachmentFile[]>([{ id: "1", name: "beneficiary-form.pdf", size: "212 KB" }]);
  const [cardNumber, setCardNumber] = useState("");
  const [cardNumberTouched, setCardNumberTouched] = useState(false);
  const [expiration, setExpiration] = useState("");
  const [expirationTouched, setExpirationTouched] = useState(false);
  const [cvc, setCvc] = useState("");
  const [cvcTouched, setCvcTouched] = useState(false);
  const [routing, setRouting] = useState("");
  const [account, setAccount] = useState("");
  const [selectedStates, setSelectedStates] = useState<string[]>(["tx"]);

  const formatCardNumber = (raw: string) => raw.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
  const cardNumberDigits = cardNumber.replace(/\D/g, "");
  const cardNumberError = cardNumberTouched && cardNumberDigits.length > 0 && cardNumberDigits.length !== 16
    ? "Card number must be 16 digits."
    : undefined;

  const formatExpiration = (raw: string) => {
    const digits = raw.replace(/\D/g, "").slice(0, 4);
    return digits.length > 2 ? `${digits.slice(0, 2)} / ${digits.slice(2)}` : digits;
  };
  const expirationError = (() => {
    if (!expirationTouched) return undefined;
    const digits = expiration.replace(/\D/g, "");
    if (digits.length === 0) return undefined;
    if (digits.length < 4) return "Enter a valid expiration date (MM/YY).";
    const month = Number(digits.slice(0, 2));
    const year = 2000 + Number(digits.slice(2, 4));
    if (month < 1 || month > 12) return "Enter a valid month (01–12).";
    const now = new Date();
    const expiresAt = new Date(year, month, 0);
    if (expiresAt < new Date(now.getFullYear(), now.getMonth(), 1)) return "This card has expired.";
    return undefined;
  })();

  const cvcError = cvcTouched && cvc.length > 0 && (cvc.length < 3 || cvc.length > 4)
    ? "CVC must be 3–4 digits."
    : undefined;

  const sections = [
    {
      id: "14",
      anchorId: "attachment",
      title: "Attachment",
      content: (
        <div className="site-panel site-panel--flush site-panel--demo">
          <AnatomySection
            anatomy={<AttachmentAnatomy />}
            demo={
          <Preview showModeToggle>
            <p style={{ margin: "0 0 16px", fontSize: "var(--typography-body-sm-size)", color: "var(--theme-neutral-text-subtle)" }}>
              File rows use the shared <strong style={{ color: "var(--theme-neutral-text-primary-default)" }}>Badge</strong> component — first file in each state uses <code>size=&quot;md&quot;</code>, second uses <code>size=&quot;sm&quot;</code>.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))", gap: 32, width: "100%" }}>
              {/* Default State */}
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: "var(--typography-body-md-size)", fontWeight: 600, color: "var(--core-color-text-secondary)" }}>
                    Default (Interactive)
                  </span>
                  <span style={{ fontSize: "var(--typography-font-size-xs)", fontWeight: 500, color: "var(--core-color-text-tertiary)" }}>Ready to upload</span>
                </div>
                <Dropzone
                  onFiles={(fl) =>
                    setFiles((prev) => [
                      ...prev,
                      { id: String(Date.now()), name: fl[0].name, size: `${Math.round(fl[0].size / 1024)} KB` }
                    ])
                  }
                />
                <AttachmentList files={files} onRemove={(id) => setFiles((prev) => prev.filter((f) => f.id !== id))} />
              </div>

              {/* Success State */}
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: "var(--typography-body-md-size)", fontWeight: 600, color: "var(--core-color-status-success-text)", display: "flex", alignItems: "center", gap: 6 }}>
                    <Icon name="fa-solid fa-circle-check" size="sm" /> Success State
                  </span>
                  <Badge tone="success" variant="soft" size="sm">Complete</Badge>
                </div>
                <Dropzone
                  status="success"
                  icon={<Icon name="fa-solid fa-circle-check" size="md" color="var(--core-color-status-success-text)" />}
                  label={<span>File uploaded successfully, or <strong style={{ color: "var(--core-color-status-success-text)" }}>browse more</strong></span>}
                  hint="All files passed security and format verification."
                />
                <AttachmentList
                  files={[
                    { id: "s1", name: "beneficiary-form.pdf", size: "212 KB", status: "success", statusText: "Uploaded", badgeSize: "md" },
                    { id: "s2", name: "voided-check.png", size: "480 KB", status: "success", statusText: "Verified", badgeSize: "sm" }
                  ]}
                  onRemove={() => {}}
                />
              </div>

              {/* Error State */}
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: "var(--typography-body-md-size)", fontWeight: 600, color: "var(--core-color-status-danger-text)", display: "flex", alignItems: "center", gap: 6 }}>
                    <Icon name="fa-solid fa-circle-exclamation" size="sm" /> Error State
                  </span>
                  <Badge tone="danger" variant="soft" size="sm">Failed</Badge>
                </div>
                <Dropzone
                  status="error"
                  icon={<Icon name="fa-solid fa-circle-exclamation" size="md" color="var(--core-color-status-danger-text)" />}
                  label={<span>Upload failed, or <strong style={{ color: "var(--core-color-status-danger-text)" }}>choose another file</strong></span>}
                  hint="File exceeds 10MB limit. Please select a smaller file."
                />
                <AttachmentList
                  files={[
                    { id: "e1", name: "annual-financial-audit-2024.zip", size: "14.2 MB", status: "error", statusText: "Exceeds 10MB limit", badgeSize: "md" },
                    { id: "e2", name: "unsupported-installer.pkg", size: "3.5 MB", status: "error", statusText: "Unsupported format", badgeSize: "sm" }
                  ]}
                  onRemove={() => {}}
                />
              </div>

              {/* Warning State */}
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: "var(--typography-body-md-size)", fontWeight: 600, color: "var(--core-color-status-warning-text)", display: "flex", alignItems: "center", gap: 6 }}>
                    <Icon name="fa-solid fa-triangle-exclamation" size="sm" /> Warning State
                  </span>
                  <Badge tone="warning" variant="soft" size="sm">Warning</Badge>
                </div>
                <Dropzone
                  status="warning"
                  icon={<Icon name="fa-solid fa-triangle-exclamation" size="md" color="var(--core-color-status-warning-text)" />}
                  label={<span>Storage capacity warning, or <strong style={{ color: "var(--core-color-status-warning-text)" }}>browse</strong></span>}
                  hint="Only 1 upload remaining before reaching capacity limit (3 files max)."
                />
                <AttachmentList
                  files={[
                    { id: "w1", name: "macro-enabled-roster.xlsm", size: "4.8 MB", status: "warning", statusText: "Virus scan pending", badgeSize: "md" },
                    { id: "w2", name: "high-res-contract.tiff", size: "8.9 MB", status: "warning", statusText: "Auto-converted", badgeSize: "sm" }
                  ]}
                  onRemove={() => {}}
                />
              </div>

              {/* Disable State */}
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: "var(--typography-body-md-size)", fontWeight: 600, color: "var(--core-color-text-tertiary)", display: "flex", alignItems: "center", gap: 6 }}>
                    <Icon name="fa-solid fa-lock" size="sm" /> Disable State
                  </span>
                  <Badge tone="neutral" variant="soft" size="sm" disabled>Disabled</Badge>
                </div>
                <Dropzone
                  disabled={true}
                  icon={<Icon name="fa-solid fa-lock" size="md" color="var(--theme-neutral-text-subtleleast)" />}
                  label={<span>File uploads are disabled</span>}
                  hint="Attachments are locked and read-only for submitted requests."
                />
                <AttachmentList
                  disabled={true}
                  files={[
                    { id: "d1", name: "beneficiary-form.pdf", size: "212 KB", status: "disabled", statusText: "Locked", badgeSize: "md" }
                  ]}
                />
              </div>
            </div>
          </Preview>
            }
          />
        </div>
      )
    },
    {
      id: "04",
      anchorId: "checkbox-radio",
      title: "Checkbox & Radio",
      content: (
        <div className="site-panel site-panel--flush site-panel--demo">
          <AnatomySection
            anatomy={<CheckboxRadioAnatomy />}
            demo={
          <Preview showModeToggle>
            <div style={{ display: "flex", flexDirection: "column", gap: 32, width: "100%" }}>
              <div>
                <div style={{ fontSize: "var(--typography-label-size)", lineHeight: "var(--typography-label-line-height)", fontWeight: "var(--typography-label-weight)", letterSpacing: "var(--typography-label-letter-spacing)", color: "var(--theme-neutral-text-subtle)", marginBottom: 16 }}>Checkbox</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(5, minmax(120px, 1fr))", gap: 32, padding: "8px 0" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 20, alignItems: "flex-start", padding: "8px 12px" }}>
                    <StateLabel>DEFAULT</StateLabel>
                    <Checkbox label="Option" readOnly />
                  </div>
                  <div className="force-hover" style={{ display: "flex", flexDirection: "column", gap: 20, alignItems: "flex-start", padding: "8px 12px" }}>
                    <StateLabel>HOVER</StateLabel>
                    <Checkbox label="Option" readOnly />
                  </div>
                  <div className="force-focus" style={{ display: "flex", flexDirection: "column", gap: 20, alignItems: "flex-start", padding: "8px 12px" }}>
                    <StateLabel>FOCUS</StateLabel>
                    <Checkbox label="Option" readOnly />
                  </div>
                  <div className="force-active" style={{ display: "flex", flexDirection: "column", gap: 20, alignItems: "flex-start", padding: "8px 12px" }}>
                    <StateLabel>CLICKED</StateLabel>
                    <Checkbox label="Option" defaultChecked readOnly />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 20, alignItems: "flex-start", padding: "8px 12px" }}>
                    <StateLabel>DISABLED</StateLabel>
                    <Checkbox label="Option" disabled />
                  </div>
                </div>
              </div>

              <div>
                <div style={{ fontSize: "var(--typography-label-size)", lineHeight: "var(--typography-label-line-height)", fontWeight: "var(--typography-label-weight)", letterSpacing: "var(--typography-label-letter-spacing)", color: "var(--theme-neutral-text-subtle)", marginBottom: 16 }}>Radio</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(5, minmax(120px, 1fr))", gap: 32, padding: "8px 0" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 20, alignItems: "flex-start", padding: "8px 12px" }}>
                    <StateLabel>DEFAULT</StateLabel>
                    <Radio name="radio-default" label="Option" value="opt" checked={false} readOnly onChange={() => {}} />
                  </div>
                  <div className="force-hover" style={{ display: "flex", flexDirection: "column", gap: 20, alignItems: "flex-start", padding: "8px 12px" }}>
                    <StateLabel>HOVER</StateLabel>
                    <Radio name="radio-hover" label="Option" value="opt" checked={false} readOnly onChange={() => {}} />
                  </div>
                  <div className="force-focus" style={{ display: "flex", flexDirection: "column", gap: 20, alignItems: "flex-start", padding: "8px 12px" }}>
                    <StateLabel>FOCUS</StateLabel>
                    <Radio name="radio-focus" label="Option" value="opt" checked={false} readOnly onChange={() => {}} />
                  </div>
                  <div className="force-active" style={{ display: "flex", flexDirection: "column", gap: 20, alignItems: "flex-start", padding: "8px 12px" }}>
                    <StateLabel>CLICKED</StateLabel>
                    <Radio name="radio-active" label="Option" value="opt" checked readOnly onChange={() => {}} />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 20, alignItems: "flex-start", padding: "8px 12px" }}>
                    <StateLabel>DISABLED</StateLabel>
                    <Radio name="radio-disabled" label="Option" value="opt" checked={false} disabled readOnly onChange={() => {}} />
                  </div>
                </div>
              </div>
            </div>
          </Preview>
            }
          />
        </div>
      )
    },
    {
      id: "10",
      anchorId: "combobox",
      title: "Combobox",
      content: (
        <div className="site-panel site-panel--flush site-panel--demo">
          <AnatomySection
            anatomy={<ComboboxAnatomy />}
            demo={
          <Preview showModeToggle>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 16, width: "100%" }}>
              <div className="force-default">
                <Field label="Default">
                  {(p) => <Combobox {...p} options={employers} value="" onChange={() => { }} placeholder="Search employer…" />}
                </Field>
              </div>
              <div className="force-hover">
                <Field label="Hover">
                  {(p) => <Combobox {...p} options={employers} value="" onChange={() => { }} placeholder="Search employer…" />}
                </Field>
              </div>
              <div className="force-focus">
                <Field label="Focus">
                  {(p) => <Combobox {...p} options={employers} value="" onChange={() => { }} placeholder="Search employer…" />}
                </Field>
              </div>
              <div className="force-filled">
                <Field label="Filled">
                  {(p) => <Combobox {...p} options={employers} value="acme" onChange={() => { }} placeholder="Search employer…" />}
                </Field>
              </div>
              <div className="force-disabled">
                <Field label="Disabled">
                  {(p) => <Combobox {...p} disabled options={employers} value="" onChange={() => { }} placeholder="Locked" />}
                </Field>
              </div>
            </div>
          </Preview>
            }
          />
        </div>
      )
    },
    {
      id: "11",
      anchorId: "date-picker",
      title: "Date Selection",
      content: (
        <AnatomySection
          anatomy={<DatePickerAnatomy />}
          demo={
        <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
          <div className="site-panel site-panel--flush site-panel--demo">
            <Preview showModeToggle>
              <div style={{ display: "flex", flexDirection: "column", gap: 24, width: "100%" }}>
                <div>
                  <div style={{ fontSize: "var(--typography-label-size)", lineHeight: "var(--typography-label-line-height)", fontWeight: "var(--typography-label-weight)", letterSpacing: "var(--typography-label-letter-spacing)", color: "var(--theme-neutral-text-subtle)", marginBottom: 12 }}>DatePicker Popover</div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 16 }}>
                    <div className="force-default">
                      <Field label="Default">
                        {() => <DatePicker placeholder="Select date" />}
                      </Field>
                    </div>
                    <div className="force-hover">
                      <Field label="Hover">
                        {() => <DatePicker placeholder="Select date" />}
                      </Field>
                    </div>
                    <div className="force-focus">
                      <Field label="Focus">
                        {() => <DatePicker placeholder="Select date" />}
                      </Field>
                    </div>
                    <div className="force-filled">
                      <Field label="Filled">
                        {() => <DatePicker value={new Date(2024, 8, 15)} />}
                      </Field>
                    </div>
                    <div className="force-disabled">
                      <Field label="Disabled">
                        {() => <DatePicker disabled placeholder="Locked" />}
                      </Field>
                    </div>
                  </div>
                </div>
              </div>
            </Preview>
          </div>

          <div className="site-panel site-panel--flush site-panel--demo">
            <Preview showModeToggle>
              <div style={{ display: "flex", gap: 40, flexWrap: "wrap" }}>
                <div>
                  <div style={{ fontSize: "var(--typography-label-size)", lineHeight: "var(--typography-label-line-height)", fontWeight: "var(--typography-label-weight)", letterSpacing: "var(--typography-label-letter-spacing)", color: "var(--theme-neutral-text-subtle)", marginBottom: 12 }}>Calendar (Active)</div>
                  <Calendar selected={dob} onSelect={setDob} onClear={() => setDob(undefined)} maxDate={new Date()} />
                </div>
                <div>
                  <div style={{ fontSize: "var(--typography-label-size)", lineHeight: "var(--typography-label-line-height)", fontWeight: "var(--typography-label-weight)", letterSpacing: "var(--typography-label-letter-spacing)", color: "var(--theme-neutral-text-subtle)", marginBottom: 12 }}>Calendar (Disabled)</div>
                  <Calendar disabled selected={dob} onSelect={() => { }} />
                </div>
              </div>
            </Preview>
          </div>

          <div className="site-panel site-panel--flush site-panel--demo">
            <div style={{ fontSize: "var(--typography-label-size)", lineHeight: "var(--typography-label-line-height)", fontWeight: "var(--typography-label-weight)", letterSpacing: "var(--typography-label-letter-spacing)", color: "var(--theme-neutral-text-subtle)", marginBottom: 4 }}>
              Calendar actions (Tertiary CTA)
            </div>
            <ComponentStateMatrix
              columns={[
                { id: "clear", label: "Clear" },
                { id: "today", label: "Today" },
              ]}
              states={DEFAULT_MATRIX_STATES}
              sizes={[{ id: "sm", label: "Small (calendar)" }]}
              defaultSize="sm"
              columnMinWidth={140}
              renderCell={({ columnId, stateKey, size }) => {
                const wrapperClass =
                  stateKey === "hover"
                    ? "force-hover"
                    : stateKey === "active"
                    ? "force-active"
                    : stateKey === "focused"
                    ? "force-focus"
                    : undefined;
                return (
                  <div className={wrapperClass} style={{ display: "inline-flex" }}>
                    <Button
                      type="button"
                      variant="tertiary"
                      size={size as "sm"}
                      disabled={stateKey === "disabled" || (columnId === "clear" && stateKey === "disabled")}
                    >
                      {columnId === "clear" ? "Clear" : "Today"}
                    </Button>
                  </div>
                );
              }}
            />
          </div>
        </div>
          }
        />
      )
    },
    {
      id: "01",
      anchorId: "input",
      title: "Input",
      content: (
        <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
          <div className="site-panel site-panel--flush site-panel--demo">
            <Preview showModeToggle>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 16 }}>
                <div className="force-default">
                  <Field label="Default" required>{(p) => <Input {...p} placeholder="Jordan Lee" />}</Field>
                </div>
                <div className="force-hover">
                  <Field label="Hover">{(p) => <Input {...p} placeholder="Jordan Lee" />}</Field>
                </div>
                <div className="force-focus">
                  <Field label="Focus">{(p) => <Input {...p} placeholder="Jordan Lee" />}</Field>
                </div>
                <div className="force-filled">
                  <Field label="Filled">{(p) => <Input {...p} defaultValue="Jordan Lee" />}</Field>
                </div>
                <div className="force-error">
                  <Field label="With error" error="Must be between 1% and 100%">{(p) => <Input {...p} defaultValue="150" />}</Field>
                </div>
                <div className="force-disabled">
                  <Field label="Disabled">{(p) => <Input {...p} disabled placeholder="Locked" />}</Field>
                </div>
              </div>
            </Preview>
          </div>
        </div>
      )
    },
    {
      id: "12",
      anchorId: "input-icon",
      title: "Input with icon",
      content: (
        <AnatomySection
          anatomy={<InputIconAnatomy />}
          demo={
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div className="site-panel site-panel--flush site-panel--demo">
            <Preview showModeToggle>
              <div style={{ display: "flex", flexDirection: "column", gap: 24, width: "100%" }}>
                {/* Leading icon */}
                <div>
                  <div style={{ fontSize: "var(--typography-label-size)", lineHeight: "var(--typography-label-line-height)", fontWeight: "var(--typography-label-weight)", letterSpacing: "var(--typography-label-letter-spacing)", color: "var(--theme-neutral-text-subtle)", marginBottom: 12 }}>Leading Icon (Search)</div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 16 }}>
                    <div className="force-default">
                      <Field label="Default">
                        {(p) => <InputWithIcon {...p} leadingIcon={<Icon name="fa-solid fa-magnifying-glass" size="sm" />} placeholder="Search transactions…" />}
                      </Field>
                    </div>
                    <div className="force-hover">
                      <Field label="Hover">
                        {(p) => <InputWithIcon {...p} leadingIcon={<Icon name="fa-solid fa-magnifying-glass" size="sm" />} placeholder="Search transactions…" />}
                      </Field>
                    </div>
                    <div className="force-focus">
                      <Field label="Focus">
                        {(p) => <InputWithIcon {...p} leadingIcon={<Icon name="fa-solid fa-magnifying-glass" size="sm" />} placeholder="Search transactions…" />}
                      </Field>
                    </div>
                    <div className="force-filled">
                      <Field label="Filled">
                        {(p) => <InputWithIcon {...p} leadingIcon={<Icon name="fa-solid fa-magnifying-glass" size="sm" />} defaultValue="Payroll run Q3" />}
                      </Field>
                    </div>
                    <div className="force-disabled">
                      <Field label="Disabled">
                        {(p) => <InputWithIcon {...p} disabled leadingIcon={<Icon name="fa-solid fa-magnifying-glass" size="sm" />} placeholder="Locked" />}
                      </Field>
                    </div>
                  </div>
                </div>

                {/* Trailing icon */}
                <div style={{ borderTop: "1px solid var(--theme-neutral-border-primary-default)", paddingTop: 20 }}>
                  <div style={{ fontSize: "var(--typography-label-size)", lineHeight: "var(--typography-label-line-height)", fontWeight: "var(--typography-label-weight)", letterSpacing: "var(--typography-label-letter-spacing)", color: "var(--theme-neutral-text-subtle)", marginBottom: 12 }}>Trailing Icon (Currency)</div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 16 }}>
                    <div className="force-default">
                      <Field label="Default">
                        {(p) => <InputWithIcon {...p} trailingIcon={<Icon name="fa-solid fa-dollar-sign" size="sm" />} placeholder="0.00" />}
                      </Field>
                    </div>
                    <div className="force-hover">
                      <Field label="Hover">
                        {(p) => <InputWithIcon {...p} trailingIcon={<Icon name="fa-solid fa-dollar-sign" size="sm" />} placeholder="0.00" />}
                      </Field>
                    </div>
                    <div className="force-focus">
                      <Field label="Focus">
                        {(p) => <InputWithIcon {...p} trailingIcon={<Icon name="fa-solid fa-dollar-sign" size="sm" />} placeholder="0.00" />}
                      </Field>
                    </div>
                    <div className="force-filled">
                      <Field label="Filled">
                        {(p) => <InputWithIcon {...p} trailingIcon={<Icon name="fa-solid fa-dollar-sign" size="sm" />} defaultValue="1,250.00" />}
                      </Field>
                    </div>
                    <div className="force-disabled">
                      <Field label="Disabled">
                        {(p) => <InputWithIcon {...p} disabled trailingIcon={<Icon name="fa-solid fa-dollar-sign" size="sm" />} placeholder="0.00" />}
                      </Field>
                    </div>
                  </div>
                </div>

                {/* Incremental selector */}
                <div style={{ borderTop: "1px solid var(--theme-neutral-border-primary-default)", paddingTop: 20 }}>
                  <div style={{ fontSize: "var(--typography-label-size)", lineHeight: "var(--typography-label-line-height)", fontWeight: "var(--typography-label-weight)", letterSpacing: "var(--typography-label-letter-spacing)", color: "var(--theme-neutral-text-subtle)", marginBottom: 12 }}>Incremental Selector</div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
                    <div className="force-default">
                      <Field label="Default">
                        {() => <IncrementalSelector defaultValue={1} min={0} max={10} aria-label="Allocation percent" />}
                      </Field>
                    </div>
                    <div className="force-hover">
                      <Field label="Hover">
                        {() => <IncrementalSelector defaultValue={1} min={0} max={10} aria-label="Allocation percent" />}
                      </Field>
                    </div>
                    <div className="force-focus">
                      <Field label="Focus">
                        {() => <IncrementalSelector defaultValue={1} min={0} max={10} aria-label="Allocation percent" />}
                      </Field>
                    </div>
                    <div className="force-disabled">
                      <Field label="Disabled">
                        {() => <IncrementalSelector disabled defaultValue={3} min={0} max={10} aria-label="Allocation percent" />}
                      </Field>
                    </div>
                  </div>
                </div>
              </div>
            </Preview>
          </div>
        </div>
          }
        />
      )
    },
    {
      id: "07",
      anchorId: "input-group",
      title: "Input group",
      content: (
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div className="site-panel site-panel--flush site-panel--demo">
            <Preview showModeToggle>
              <div style={{ display: "flex", flexDirection: "column", gap: 24, width: "100%" }}>
                {/* Prefix variant row */}
                <div>
                  <div style={{ fontSize: "var(--typography-label-size)", lineHeight: "var(--typography-label-line-height)", fontWeight: "var(--typography-label-weight)", letterSpacing: "var(--typography-label-letter-spacing)", color: "var(--theme-neutral-text-subtle)", marginBottom: 12 }}>Prefix Addon ($)</div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 16 }}>
                    <div className="force-default">
                      <Field label="Default">
                        {(p) => <InputGroup prefix="$"><Input {...p} placeholder="0.00" /></InputGroup>}
                      </Field>
                    </div>
                    <div className="force-hover">
                      <Field label="Hover">
                        {(p) => <InputGroup prefix="$"><Input {...p} placeholder="0.00" /></InputGroup>}
                      </Field>
                    </div>
                    <div className="force-focus">
                      <Field label="Focus">
                        {(p) => <InputGroup prefix="$"><Input {...p} placeholder="0.00" /></InputGroup>}
                      </Field>
                    </div>
                    <div className="force-filled">
                      <Field label="Filled">
                        {(p) => <InputGroup prefix="$"><Input {...p} defaultValue="250.00" /></InputGroup>}
                      </Field>
                    </div>
                    <div className="force-disabled">
                      <Field label="Disabled">
                        {(p) => <InputGroup prefix="$"><Input {...p} disabled placeholder="0.00" /></InputGroup>}
                      </Field>
                    </div>
                  </div>
                </div>

                {/* Suffix variant row */}
                <div style={{ borderTop: "1px solid var(--theme-neutral-border-primary-default)", paddingTop: 20 }}>
                  <div style={{ fontSize: "var(--typography-label-size)", lineHeight: "var(--typography-label-line-height)", fontWeight: "var(--typography-label-weight)", letterSpacing: "var(--typography-label-letter-spacing)", color: "var(--theme-neutral-text-subtle)", marginBottom: 12 }}>Suffix Addon (%)</div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 16 }}>
                    <div className="force-default">
                      <Field label="Default">
                        {(p) => <InputGroup suffix="%"><Input {...p} placeholder="0" /></InputGroup>}
                      </Field>
                    </div>
                    <div className="force-hover">
                      <Field label="Hover">
                        {(p) => <InputGroup suffix="%"><Input {...p} placeholder="0" /></InputGroup>}
                      </Field>
                    </div>
                    <div className="force-focus">
                      <Field label="Focus">
                        {(p) => <InputGroup suffix="%"><Input {...p} placeholder="0" /></InputGroup>}
                      </Field>
                    </div>
                    <div className="force-filled">
                      <Field label="Filled">
                        {(p) => <InputGroup suffix="%"><Input {...p} defaultValue="6" /></InputGroup>}
                      </Field>
                    </div>
                    <div className="force-disabled">
                      <Field label="Disabled">
                        {(p) => <InputGroup suffix="%"><Input {...p} disabled placeholder="0" /></InputGroup>}
                      </Field>
                    </div>
                  </div>
                </div>
              </div>
            </Preview>
          </div>
        </div>
      )
    },
    {
      id: "13",
      anchorId: "payment-bank-fields",
      title: "Bank fields",
      content: (
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div className="site-panel site-panel--flush site-panel--demo">
            <Preview showModeToggle>
              <div style={{ display: "flex", flexDirection: "column", gap: 24, width: "100%" }}>
                {/* Card Number */}
                <div>
                  <div style={{ fontSize: "var(--typography-label-size)", lineHeight: "var(--typography-label-line-height)", fontWeight: "var(--typography-label-weight)", letterSpacing: "var(--typography-label-letter-spacing)", color: "var(--theme-neutral-text-subtle)", marginBottom: 12 }}>Card Number</div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 16 }}>
                    <div className="force-default">
                      <Field label="Default">
                        {(p) => (
                          <InputWithIcon
                            {...p}
                            trailingIcon={<Icon name="fa-solid fa-credit-card" size="sm" />}
                            inputMode="numeric"
                            placeholder="1234 5678 9012 3456"
                          />
                        )}
                      </Field>
                    </div>
                    <div className="force-hover">
                      <Field label="Hover">
                        {(p) => (
                          <InputWithIcon
                            {...p}
                            trailingIcon={<Icon name="fa-solid fa-credit-card" size="sm" />}
                            inputMode="numeric"
                            placeholder="1234 5678 9012 3456"
                          />
                        )}
                      </Field>
                    </div>
                    <div className="force-focus">
                      <Field label="Focus">
                        {(p) => (
                          <InputWithIcon
                            {...p}
                            trailingIcon={<Icon name="fa-solid fa-credit-card" size="sm" />}
                            inputMode="numeric"
                            placeholder="1234 5678 9012 3456"
                          />
                        )}
                      </Field>
                    </div>
                    <div className="force-filled">
                      <Field label="Filled">
                        {(p) => (
                          <InputWithIcon
                            {...p}
                            trailingIcon={<Icon name="fa-solid fa-credit-card" size="sm" />}
                            inputMode="numeric"
                            defaultValue="4532 8920 1234 5678"
                          />
                        )}
                      </Field>
                    </div>
                    <div className="force-disabled">
                      <Field label="Disabled">
                        {(p) => (
                          <InputWithIcon
                            {...p}
                            disabled
                            trailingIcon={<Icon name="fa-solid fa-credit-card" size="sm" />}
                            inputMode="numeric"
                            defaultValue="•••• •••• •••• 5678"
                          />
                        )}
                      </Field>
                    </div>
                  </div>
                </div>

                {/* Routing & Account Number */}
                <div style={{ borderTop: "1px solid var(--theme-neutral-border-primary-default)", paddingTop: 20 }}>
                  <div style={{ fontSize: "var(--typography-label-size)", lineHeight: "var(--typography-label-line-height)", fontWeight: "var(--typography-label-weight)", letterSpacing: "var(--typography-label-letter-spacing)", color: "var(--theme-neutral-text-subtle)", marginBottom: 12 }}>Routing Number (9 Digits)</div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 16 }}>
                    <div className="force-default">
                      <Field label="Default">
                        {(p) => <Input {...p} inputMode="numeric" maxLength={9} placeholder="021000021" />}
                      </Field>
                    </div>
                    <div className="force-hover">
                      <Field label="Hover">
                        {(p) => <Input {...p} inputMode="numeric" maxLength={9} placeholder="021000021" />}
                      </Field>
                    </div>
                    <div className="force-focus">
                      <Field label="Focus">
                        {(p) => <Input {...p} inputMode="numeric" maxLength={9} placeholder="021000021" />}
                      </Field>
                    </div>
                    <div className="force-filled">
                      <Field label="Filled">
                        {(p) => <Input {...p} inputMode="numeric" maxLength={9} defaultValue="021000021" />}
                      </Field>
                    </div>
                    <div className="force-disabled">
                      <Field label="Disabled">
                        {(p) => <Input {...p} disabled inputMode="numeric" maxLength={9} defaultValue="021000021" />}
                      </Field>
                    </div>
                  </div>
                </div>

                {/* Expiration & CVC */}
                <div style={{ borderTop: "1px solid var(--theme-neutral-border-primary-default)", paddingTop: 20 }}>
                  <div style={{ fontSize: "var(--typography-label-size)", lineHeight: "var(--typography-label-line-height)", fontWeight: "var(--typography-label-weight)", letterSpacing: "var(--typography-label-letter-spacing)", color: "var(--theme-neutral-text-subtle)", marginBottom: 12 }}>Interactive Card Verification Entry</div>
                  <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 16 }}>
                    <Field label="Card number" hint={cardNumberError ? undefined : "Stored securely — last 4 digits only."} error={cardNumberError}>
                      {(p) => (
                        <InputWithIcon
                          {...p}
                          trailingIcon={<Icon name="fa-solid fa-credit-card" size="sm" />}
                          inputMode="numeric"
                          placeholder="1234 5678 9012 3456"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                          onBlur={() => setCardNumberTouched(true)}
                        />
                      )}
                    </Field>
                    <Field label="Expiration date" error={expirationError}>
                      {(p) => (
                        <Input
                          {...p}
                          placeholder="MM / YY"
                          inputMode="numeric"
                          value={expiration}
                          onChange={(e) => setExpiration(formatExpiration(e.target.value))}
                          onBlur={() => setExpirationTouched(true)}
                        />
                      )}
                    </Field>
                    <Field label="CVC" hint={cvcError ? undefined : "3 digits"} error={cvcError}>
                      {(p) => (
                        <Input
                          {...p}
                          placeholder="123"
                          inputMode="numeric"
                          maxLength={4}
                          value={cvc}
                          onChange={(e) => setCvc(e.target.value.replace(/\D/g, "").slice(0, 4))}
                          onBlur={() => setCvcTouched(true)}
                        />
                      )}
                    </Field>
                  </div>
                </div>
              </div>
            </Preview>
          </div>
        </div>
      )
    },
    {
      id: "03",
      anchorId: "select",
      title: "Select",
      content: (
        <div className="site-panel site-panel--flush site-panel--demo">
          <Preview showModeToggle>
            <div style={{ display: "flex", flexDirection: "column", gap: 24, width: "100%" }}>
              <div>
                <div style={{ fontSize: "var(--typography-label-size)", lineHeight: "var(--typography-label-line-height)", fontWeight: "var(--typography-label-weight)", letterSpacing: "var(--typography-label-letter-spacing)", color: "var(--theme-neutral-text-subtle)", marginBottom: 12 }}>Single Select</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 16 }}>
                  <div className="force-default">
                    <Field label="Default">{(p) => <Select {...p} options={employers} />}</Field>
                  </div>
                  <div className="force-hover">
                    <Field label="Hover">{(p) => <Select {...p} options={employers} />}</Field>
                  </div>
                  <div className="force-focus">
                    <Field label="Focus">{(p) => <Select {...p} options={employers} />}</Field>
                  </div>
                  <div className="force-filled">
                    <Field label="Filled">{(p) => <Select {...p} value="acme" options={employers} />}</Field>
                  </div>
                  <div className="force-disabled">
                    <Field label="Disabled">{(p) => <Select {...p} disabled options={employers} />}</Field>
                  </div>
                </div>
              </div>

              <div style={{ borderTop: "1px solid var(--theme-neutral-border-primary-default)", paddingTop: 20 }}>
                <div style={{ fontSize: "var(--typography-label-size)", lineHeight: "var(--typography-label-line-height)", fontWeight: "var(--typography-label-weight)", letterSpacing: "var(--typography-label-letter-spacing)", color: "var(--theme-neutral-text-subtle)", marginBottom: 12 }}>Multi Select</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 16 }}>
                  <div className="force-default">
                    <Field label="Default">{(p) => <Select {...p} multiple options={usStates} />}</Field>
                  </div>
                  <div className="force-hover">
                    <Field label="Hover">{(p) => <Select {...p} multiple options={usStates} />}</Field>
                  </div>
                  <div className="force-focus">
                    <Field label="Focus">{(p) => <Select {...p} multiple options={usStates} />}</Field>
                  </div>
                  <div>
                    <Field label="Selected (interactive)">
                      {(p) => (
                        <Select {...p} multiple options={usStates} values={selectedStates} onValuesChange={setSelectedStates} />
                      )}
                    </Field>
                  </div>
                  <div className="force-disabled">
                    <Field label="Disabled">{(p) => <Select {...p} multiple disabled values={["tx"]} options={usStates} />}</Field>
                  </div>
                </div>
              </div>
            </div>
          </Preview>
        </div>
      )
    },
    {
      id: "09",
      anchorId: "slider",
      title: "Slider",
      content: (
        <div className="site-panel site-panel--flush site-panel--demo">
          <Preview showModeToggle>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(180px, 1fr))", gap: 24, width: "100%", padding: "8px 0" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 20, alignItems: "stretch", padding: "8px 12px" }}>
                <StateLabel>DEFAULT</StateLabel>
                <Field label="Contribution rate">{() => (
                  <Slider value={contribPct} min={0} max={25} onChange={setContribPct} formatValue={(v) => `${v}%`} />
                )}</Field>
              </div>
              <div className="force-hover" style={{ display: "flex", flexDirection: "column", gap: 20, alignItems: "stretch", padding: "8px 12px" }}>
                <StateLabel>HOVER</StateLabel>
                <Field label="Contribution rate">{() => (
                  <Slider value={12} min={0} max={25} onChange={() => {}} formatValue={(v) => `${v}%`} />
                )}</Field>
              </div>
              <div className="force-active" style={{ display: "flex", flexDirection: "column", gap: 20, alignItems: "stretch", padding: "8px 12px" }}>
                <StateLabel>ACTIVE</StateLabel>
                <Field label="Contribution rate">{() => (
                  <Slider value={18} min={0} max={25} onChange={() => {}} formatValue={(v) => `${v}%`} />
                )}</Field>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 20, alignItems: "stretch", padding: "8px 12px" }}>
                <StateLabel>DISABLED</StateLabel>
                <Field label="Contribution rate">{() => (
                  <Slider disabled value={12} min={0} max={25} onChange={() => {}} formatValue={(v) => `${v}%`} />
                )}</Field>
              </div>
            </div>
          </Preview>
        </div>
      )
    },
    {
      id: "05",
      anchorId: "switch",
      title: "Switch",
      content: (
        <div className="site-panel site-panel--flush site-panel--demo">
          <Preview showModeToggle>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, minmax(140px, 1fr))", gap: 32, width: "100%", padding: "16px 8px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 20, alignItems: "flex-start", padding: "8px 12px" }}>
                <StateLabel>DEFAULT</StateLabel>
                <Switch label="Option" checked={false} onChange={() => { }} />
              </div>
              <div className="force-hover" style={{ display: "flex", flexDirection: "column", gap: 20, alignItems: "flex-start", padding: "8px 12px" }}>
                <StateLabel>HOVER</StateLabel>
                <Switch label="Option" checked={false} onChange={() => { }} />
              </div>
              <div className="force-focus" style={{ display: "flex", flexDirection: "column", gap: 20, alignItems: "flex-start", padding: "8px 12px" }}>
                <StateLabel>FOCUS</StateLabel>
                <Switch label="Option" checked={false} onChange={() => { }} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 20, alignItems: "flex-start", padding: "8px 12px" }}>
                <StateLabel>ACTIVE (ON)</StateLabel>
                <Switch label="Option" checked={true} onChange={() => { }} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 20, alignItems: "flex-start", padding: "8px 12px" }}>
                <StateLabel>DISABLED</StateLabel>
                <Switch label="Option" disabled checked={false} onChange={() => { }} />
              </div>
            </div>
          </Preview>
        </div>
      )
    },
    {
      id: "02",
      anchorId: "textarea",
      title: "Textarea",
      content: (
        <div className="site-panel site-panel--flush site-panel--demo">
          <Preview showModeToggle>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 16 }}>
              <div className="force-default">
                <Field label="Default">{(p) => <Textarea {...p} rows={2} placeholder="Type here..." />}</Field>
              </div>
              <div className="force-hover">
                <Field label="Hover">{(p) => <Textarea {...p} rows={2} placeholder="Type here..." />}</Field>
              </div>
              <div className="force-focus">
                <Field label="Focus">{(p) => <Textarea {...p} rows={2} placeholder="Type here..." />}</Field>
              </div>
              <div className="force-filled">
                <Field label="Filled">{(p) => <Textarea {...p} rows={2} defaultValue="Entered text" />}</Field>
              </div>
              <div className="force-disabled">
                <Field label="Disabled">{(p) => <Textarea {...p} disabled rows={2} placeholder="Type here..." />}</Field>
              </div>
            </div>
          </Preview>
        </div>
      )
    },
    {
      id: "15",
      anchorId: "working-example",
      title: "Working Example",
      content: (
        <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
          <div className="site-panel site-panel--flush site-panel--demo">
            <Preview showModeToggle>
              <div style={{ display: "flex", flexDirection: "column", gap: 32, maxWidth: 420 }}>
                {/* Kitchen Sink Input */}
                <Field label="Kitchen Sink Input" hint="Prefix, suffix, icons, hint, and error all at once." error="Username is already taken">
                  {(p) => (
                    <InputGroup prefix="@">
                      <InputWithIcon
                        {...p}
                        leadingIcon={<Icon name="fa-solid fa-user" size="sm" />}
                        trailingIcon={<Icon name="fa-solid fa-circle-exclamation" size="sm" color="var(--core-color-status-danger-text)" />}
                        defaultValue="jordanlee"
                      />
                    </InputGroup>
                  )}
                </Field>

                {/* Working Form */}
                <div style={{ padding: 24, border: "1px solid var(--site-border)", borderRadius: 12, background: "var(--core-color-surface-default)" }}>
                  <h3 style={{ margin: "0 0 24px 0", fontSize: 18, fontWeight: 600 }}>Profile Settings</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                    <Field label="Display name">
                      {(p) => <Input {...p} defaultValue="Jordan Lee" variant="solid" />}
                    </Field>

                    <Field label="Department">
                      {(p) => <Select {...p} options={employers} value="acme" />}
                    </Field>

                    <Field label="Bio" hint="Briefly describe your role.">
                      {(p) => <Textarea {...p} rows={3} defaultValue="Lead designer focused on..." />}
                    </Field>

                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0", borderTop: "1px solid var(--site-border)", borderBottom: "1px solid var(--site-border)" }}>
                      <div id="two-factor-label">
                        <div style={{ fontWeight: 600, fontSize: 14 }}>Two-factor authentication</div>
                        <div style={{ fontSize: "var(--typography-font-size-xs)", color: "var(--core-color-text-tertiary)", marginTop: 2 }}>Secure your account.</div>
                      </div>
                      <Switch checked={on} onChange={setOn} aria-labelledby="two-factor-label" />
                    </div>

                    <Checkbox label="Subscribe to product updates" defaultChecked />

                    <div style={{ marginTop: 8, display: "flex", gap: 12 }}>
                      <button className="cds-btn cds-btn--primary">Save Changes</button>
                      <button className="cds-btn cds-btn--secondary">Cancel</button>
                    </div>
                  </div>
                </div>
              </div>
            </Preview>
          </div>
        </div>
      )
    }
  ];

  const sectionList = (
    <DocsSectionList flat={embedded}>
      {sections.map((s) => (
        <DocsSection key={s.anchorId} anchorId={s.anchorId} title={s.title}>
          {s.content}
        </DocsSection>
      ))}
    </DocsSectionList>
  );

  const formStyles = (
    <style>{`
        .force-hover .cds-input,
        .force-hover .cds-textarea,
        .force-hover .cds-select,
        .force-hover .cds-combobox .cds-input,
        .force-hover .cds-input-affix-wrap .cds-input,
        .force-hover .cds-input-group .cds-input {
          border-color: var(--theme-neutral-border-strong) !important;
          background: color-mix(in srgb, black 8%, var(--core-color-surface-default)) !important;
        }
        .force-hover .cds-input-group-addon,
        .force-hover .cds-incremental-selector__btn,
        .force-hover .cds-incremental-selector__value {
          border-color: var(--theme-neutral-border-strong) !important;
        }
        .force-hover .cds-incremental-selector__btn {
          background: var(--core-color-surface-raised) !important;
          color: var(--theme-neutral-text-primary-default) !important;
        }
        .force-hover .cds-incremental-selector__value {
          background: var(--core-color-surface-default) !important;
        }
        .force-hover .cds-switch input:not(:checked):not(:disabled) + .cds-switch-track {
          background: var(--theme-colors-neutral-600) !important;
        }
        .force-hover .cds-switch input:checked:not(:disabled) + .cds-switch-track {
          background: color-mix(in srgb, var(--brand-background-primary-strong) 88%, white) !important;
        }
        .force-hover .cds-checkbox input:not(:checked):not(:disabled) + .cds-checkbox-box,
        .force-hover .cds-radio input:not(:checked):not(:disabled) + .cds-radio-box {
          border-color: var(--theme-primitive-color-primary-400) !important;
          background: var(--theme-brand-background-primary-subtle) !important;
        }
        .force-hover .cds-checkbox input:checked:not(:disabled) + .cds-checkbox-box,
        .force-hover .cds-radio input:checked:not(:disabled) + .cds-radio-box {
          background: var(--brand-background-primary-hover) !important;
          border-color: var(--brand-background-primary-hover) !important;
        }

        .force-hover .cds-input,
        .force-hover .cds-combobox .cds-input,
        .force-hover .cds-date-picker .cds-input,
        .force-hover .cds-date-picker .cds-input-affix-wrap .cds-input,
        .force-hover .cds-input-affix-wrap .cds-input {
          border-color: var(--theme-neutral-border-strong) !important;
          background: color-mix(in srgb, black 8%, var(--core-color-surface-default)) !important;
        }
        .force-focus .cds-input,
        .force-focus .cds-textarea,
        .force-focus .cds-select,
        .force-focus .cds-combobox .cds-input,
        .force-focus .cds-date-picker .cds-input,
        .force-focus .cds-date-picker .cds-input-affix-wrap .cds-input,
        .force-focus .cds-input-affix-wrap .cds-input {
          border-color: var(--theme-primitive-color-primary-400) !important;
          box-shadow: 0 0 0 3px color-mix(in srgb, var(--theme-primitive-color-primary-400) 25%, transparent) !important;
        }
        .force-focus .cds-input-affix-wrap .cds-input-icon {
          color: var(--theme-neutral-text-subtle) !important;
        }
        .force-focus .cds-input-group {
          border-radius: var(--core-input-radius) !important;
          box-shadow: 0 0 0 3px color-mix(in srgb, var(--theme-primitive-color-primary-400) 25%, transparent) !important;
        }
        .force-focus .cds-input-group .cds-input,
        .force-focus .cds-input-group-addon {
          border-color: var(--theme-primitive-color-primary-400) !important;
        }
        .force-focus .cds-input-group .cds-input {
          box-shadow: none !important;
        }
        .force-hover .cds-incremental-selector:not(:has(.cds-incremental-selector__btn:disabled)) {
          border-color: var(--theme-neutral-border-strong) !important;
        }
        .force-hover .cds-incremental-selector__btn:not(:disabled) {
          background: color-mix(in srgb, currentColor 16%, transparent) !important;
          color: var(--theme-neutral-text-primary-default) !important;
        }
        .force-focus .cds-incremental-selector {
          border-color: var(--theme-primitive-color-primary-400) !important;
          box-shadow: 0 0 0 3px color-mix(in srgb, var(--theme-primitive-color-primary-400) 25%, transparent) !important;
        }
        .force-hover .cds-btn--tertiary:not(:disabled) .cds-btn__text {
          color: var(--theme-brand-text-primary-hover) !important;
        }
        .force-hover .cds-btn--tertiary:not(:disabled) {
          background: color-mix(in srgb, var(--theme-brand-background-primary-strong) 8%, transparent) !important;
        }
        .force-active .cds-btn--tertiary:not(:disabled) .cds-btn__text {
          color: var(--theme-brand-text-primary-active) !important;
        }
        .force-active .cds-btn--tertiary:not(:disabled) {
          background: color-mix(in srgb, var(--theme-brand-background-primary-strong) 16%, transparent) !important;
          transform: translateY(1px);
        }
        .force-focus .cds-btn--tertiary:not(:disabled) {
          outline: var(--core-focusRing-width) solid var(--theme-primitive-color-primary-400) !important;
          outline-offset: 2px;
        }
        .force-focus .cds-checkbox input:not(:checked):not(:disabled) + .cds-checkbox-box,
        .force-focus .cds-radio input:not(:checked):not(:disabled) + .cds-radio-box {
          border-color: var(--theme-primitive-color-primary-400) !important;
          background: var(--core-color-surface-default) !important;
          outline: var(--core-focusRing-width) solid var(--theme-primitive-color-primary-400) !important;
          outline-offset: 2px !important;
        }
        .force-focus .cds-switch-track {
          outline: none !important;
          box-shadow:
            0 0 0 2px var(--core-color-surface-default),
            0 0 0 calc(2px + var(--core-focusRing-width)) var(--theme-primitive-color-primary-400) !important;
        }
        .force-active .cds-textarea, .force-active .cds-select {
          border-color: var(--theme-primitive-color-primary-400) !important;
          box-shadow: 0 0 0 3px color-mix(in srgb, var(--theme-primitive-color-primary-400) 25%, transparent) !important;
          background: var(--theme-brand-background-primary-subtle) !important;
        }
        .force-active .cds-checkbox input:checked:not(:disabled) + .cds-checkbox-box,
        .force-active .cds-radio input:checked:not(:disabled) + .cds-radio-box {
          background: var(--brand-background-primary-strong) !important;
          border-color: var(--brand-background-primary-strong) !important;
        }
        .force-error .cds-input[aria-invalid="true"] {
          border-color: var(--theme-semantics-critical-border) !important;
        }

        /* Input/Textarea/Select/Input-group are plain neutral surfaces — their
           real :disabled CSS (components.css) already applies the canonical
           --theme-semantics-disabled-* neutral tokens. No docs override
           needed; letting the real state show is what keeps "disabled" from
           looking different in every component page. */
        .force-disabled .cds-input-icon, .cds-input-affix-wrap:has(.cds-input:disabled) .cds-input-icon {
          color: var(--theme-semantics-disabled-text) !important;
        }
        .force-disabled .cds-slider,
        .cds-slider--disabled {
          --cds-slider-track-fill: var(--theme-colors-neutral-300) !important;
          --cds-slider-track-bg: var(--theme-semantics-disabled-background) !important;
          --cds-slider-thumb-bg: var(--theme-colors-neutral-300) !important;
          --cds-slider-thumb-ring: var(--theme-colors-neutral-300) !important;
          cursor: not-allowed !important;
        }
        .force-disabled .cds-slider input[type="range"],
        .cds-slider input[type="range"]:disabled {
          cursor: not-allowed !important;
        }
        .force-disabled .cds-slider input[type="range"]::-webkit-slider-thumb,
        .force-disabled .cds-slider input[type="range"]::-moz-range-thumb,
        .cds-slider input[type="range"]:disabled::-webkit-slider-thumb,
        .cds-slider input[type="range"]:disabled::-moz-range-thumb {
          cursor: not-allowed !important;
        }
        .force-disabled .cds-slider-value,
        .cds-slider--disabled .cds-slider-value {
          color: var(--theme-neutral-text-subtleleast) !important;
        }
        .force-hover .cds-slider {
          --cds-slider-thumb-ring: var(--brand-background-primary-hover) !important;
          --cds-slider-thumb-bg: var(--brand-background-primary-hover) !important;
        }
        /*
         * Uses -strong, not -active: --brand-background-primary-active
         * measured only 1.94:1 against the dark-mode page (#1B4479 vs
         * #111017) — nearly invisible, the same recurring "-active/-hover
         * darken further and disappear on a dark canvas" bug already fixed
         * this session for Checkbox, Switch, and Select. -strong stays
         * compliant in both modes (4.11:1 dark).
         */
        .force-active .cds-slider {
          --cds-slider-track-fill: var(--brand-background-primary-strong) !important;
          --cds-slider-thumb-bg: var(--brand-background-primary-strong) !important;
          --cds-slider-thumb-ring: var(--brand-background-primary-strong) !important;
          --cds-slider-thumb-size: 18px !important;
        }
      `}</style>
  );

  if (embedded) {
    return (
      <>
        {formStyles}
        {sectionList}
      </>
    );
  }

  return (
    <div style={{ maxWidth: 1024, margin: "0 auto", padding: "20px" }}>
      {formStyles}
      <div style={{ textAlign: "center", marginBottom: 60, marginTop: 40 }}>
        <h1 style={{ fontSize: 72, fontWeight: 700, letterSpacing: "-0.06em", margin: "0 0 16px 0", color: "var(--core-color-text-primary)", lineHeight: 1.1 }}>
          Form Controls
        </h1>
        <p style={{ maxWidth: 560, margin: "0 auto", color: "var(--core-color-text-tertiary)", fontSize: 18, lineHeight: 1.6, fontWeight: 400 }}>
          Essential components for data entry and configuration. Label, hint, and error states are wired together automatically via aria attributes.
        </p>
      </div>
      {sectionList}
    </div>
  );
}
