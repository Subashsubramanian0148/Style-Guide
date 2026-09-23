const fs = require('fs');
const file = 'apps/docs-site/src/pages/Forms.tsx';
let content = fs.readFileSync(file, 'utf8');

const newSection = `    {
      id: "15",
      title: "Working Example",
      description: "A functional form combining multiple control variants, states, and maximum configuration.",
      content: (
        <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
          <div className="site-panel site-panel--flush">
            <Preview>
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
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>Two-factor authentication</div>
                        <div style={{ fontSize: 13, color: "var(--core-color-text-tertiary)", marginTop: 2 }}>Secure your account.</div>
                      </div>
                      <Switch checked={on} onChange={setOn} />
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
  ];`;

content = content.replace(/\]\s*;\s*return \(/m, ',\n' + newSection + '\n\n  return (');

fs.writeFileSync(file, content);
