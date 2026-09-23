const fs = require('fs');

const file = 'apps/docs-site/src/pages/Forms.tsx';
let content = fs.readFileSync(file, 'utf8');

// Inject the <style> block right after <div style={{ maxWidth: 1024... }}>
content = content.replace(
  '<div style={{ maxWidth: 1024, margin: "0 auto", padding: "20px" }}>',
  `<div style={{ maxWidth: 1024, margin: "0 auto", padding: "20px" }}>
      <style>{\`
        .force-hover .cds-textarea, .force-hover .cds-select { border-color: var(--core-input-borderHover) !important; }
        .force-hover .cds-switch-track { opacity: 0.8; }
        
        .force-focus .cds-textarea, .force-focus .cds-select { 
          border-color: var(--core-input-borderFocus) !important; 
          box-shadow: 0 0 0 3px color-mix(in srgb, var(--core-input-borderFocus) 25%, transparent) !important; 
        }
        .force-focus .cds-switch-track { 
          outline: var(--core-focusRing-width) solid var(--core-focusRing-color) !important; 
          outline-offset: 2px !important; 
        }

        .force-active .cds-textarea, .force-active .cds-select { 
          border-color: var(--core-input-borderFocus) !important; 
          box-shadow: 0 0 0 3px color-mix(in srgb, var(--core-input-borderFocus) 25%, transparent) !important; 
          background: var(--core-color-surface-sunken) !important;
        }
        .force-active .cds-switch-track { 
          /* For switch, active is represented by checked=true, we just let it be normal checked */
        }
      \`}</style>`
);

// Replace Textarea section
const newTextarea = `    {
      id: "02",
      title: "Textarea",
      description: "Multi-line text input that grows vertically with content. Minimum height 88px.",
      content: (
        <div className="site-panel site-panel--flush">
          <Preview>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 20 }}>
              <div className="force-default">
                <Field label="Default">{(p) => <Textarea {...p} rows={2} placeholder="Type here..." />}</Field>
              </div>
              <div className="force-hover">
                <Field label="Hover">{(p) => <Textarea {...p} rows={2} placeholder="Type here..." />}</Field>
              </div>
              <div className="force-focus">
                <Field label="Focus">{(p) => <Textarea {...p} rows={2} placeholder="Type here..." />}</Field>
              </div>
              <div className="force-active">
                <Field label="Active">{(p) => <Textarea {...p} rows={2} placeholder="Type here..." />}</Field>
              </div>
              <div className="force-disabled">
                <Field label="Disabled">{(p) => <Textarea {...p} disabled rows={2} placeholder="Type here..." />}</Field>
              </div>
            </div>
          </Preview>
        </div>
      )
    },`;

content = content.replace(/\{\s*id:\s*"02"[\s\S]*?(?=\{\s*id:\s*"03")/m, newTextarea + '\n');

// Replace Select section
const newSelect = `    {
      id: "03",
      title: "Select",
      description: "Native select dropdown for choosing from a list of options.",
      content: (
        <div className="site-panel site-panel--flush">
          <Preview>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 20 }}>
              <div className="force-default">
                <Field label="Default">{(p) => <Select {...p} options={employers} />}</Field>
              </div>
              <div className="force-hover">
                <Field label="Hover">{(p) => <Select {...p} options={employers} />}</Field>
              </div>
              <div className="force-focus">
                <Field label="Focus">{(p) => <Select {...p} options={employers} />}</Field>
              </div>
              <div className="force-active">
                <Field label="Active">{(p) => <Select {...p} options={employers} />}</Field>
              </div>
              <div className="force-disabled">
                <Field label="Disabled">{(p) => <Select {...p} disabled options={employers} />}</Field>
              </div>
            </div>
          </Preview>
        </div>
      )
    },`;

content = content.replace(/\{\s*id:\s*"03"[\s\S]*?(?=\{\s*id:\s*"04")/m, newSelect + '\n');

// Replace Switch section
// Note: Switch is id "05"
const newSwitch = `    {
      id: "05",
      title: "Switch",
      description: "Toggle control for immediate on/off actions.",
      content: (
        <div className="site-panel site-panel--flush">
          <Preview>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 20 }}>
              <div className="force-default">
                <Switch label="Default" checked={false} onChange={() => {}} />
              </div>
              <div className="force-hover">
                <Switch label="Hover" checked={false} onChange={() => {}} />
              </div>
              <div className="force-focus">
                <Switch label="Focus" checked={false} onChange={() => {}} />
              </div>
              <div className="force-active">
                <Switch label="Active (On)" checked={true} onChange={() => {}} />
              </div>
              <div className="force-disabled">
                <Switch label="Disabled" disabled checked={false} onChange={() => {}} />
              </div>
            </div>
          </Preview>
        </div>
      )
    },`;

content = content.replace(/\{\s*id:\s*"05"[\s\S]*?(?=\{\s*id:\s*"06")/m, newSwitch + '\n');

fs.writeFileSync(file, content);
