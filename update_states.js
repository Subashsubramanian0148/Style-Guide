const fs = require('fs');
const file = 'apps/docs-site/src/pages/Forms.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Add "Filled" to Textarea
const newTextarea = `    {
      id: "02",
      title: "Textarea",
      description: "Multi-line text input that grows vertically with content. Minimum height 88px.",
      content: (
        <div className="site-panel site-panel--flush">
          <Preview>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 16 }}>
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
    },`;
content = content.replace(/\{\s*id:\s*"02"[\s\S]*?(?=\{\s*id:\s*"03")/m, newTextarea + '\n');

// 2. Add "Filled" to Select and fix disabled greish look
const newSelect = `    {
      id: "03",
      title: "Select",
      description: "Native select dropdown for choosing from a list of options.",
      content: (
        <div className="site-panel site-panel--flush">
          <Preview>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 16 }}>
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
              <div className="force-filled">
                <Field label="Filled">{(p) => <Select {...p} value="acme" options={employers} />}</Field>
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

// Update style block to make disabled state grayish
content = content.replace(
  '.force-active .cds-switch-track {',
  `.force-active .cds-switch-track {`
);

// We need to inject styles for disabled to be "greish" for select (and maybe others)
content = content.replace(
  '</style>',
  `  .force-disabled .cds-select, .cds-select:disabled, .cds-select[aria-disabled="true"] { 
          background: #F5F7FA !important; 
          color: #A0AAB8 !important; 
          border-color: #E2E8F0 !important; 
          opacity: 1 !important; 
        }
        .force-disabled .cds-textarea, .cds-textarea:disabled { 
          background: #F5F7FA !important; 
          color: #A0AAB8 !important; 
          border-color: #E2E8F0 !important; 
          opacity: 1 !important; 
        }
        .force-disabled .cds-input, .cds-input:disabled { 
          background: #F5F7FA !important; 
          color: #A0AAB8 !important; 
          border-color: #E2E8F0 !important; 
          opacity: 1 !important; 
        }
      </style>`
);

fs.writeFileSync(file, content);
