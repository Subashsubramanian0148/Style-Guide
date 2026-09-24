import React, { useState } from "react";
import { Preview } from "../Preview";
import { DocsSection, DocsSectionList, StateLabel } from "../DocsSection";
import { Button, IconButton } from "../../../../packages/core/src/components/Button";
import { Modal, Drawer, Tooltip } from "../../../../packages/core/src/components/Overlays";
import { Field, Input } from "../../../../packages/core/src/components/Field";
import { Select } from "../../../../packages/core/src/components/FormControls";
import { Icon } from "../../../../packages/core/src/components/Primitives";
import { AnatomySection } from "../AnatomySection";
import { TooltipAnatomyFull } from "../LegacyAnatomyTables";
import { DialogAnatomy } from "../SectionAnatomies";
import { SlideoverAnatomy } from "../SectionAnatomies";

export default function OverlaysPage({ embedded = false }: { embedded?: boolean }) {
  const [modal, setModal] = useState(false);
  const [slideover, setSlideover] = useState(false);

  const sections = (
    <DocsSectionList flat={embedded}>
      <DocsSection anchorId="modal" title="Modal">
        <div className="site-panel site-panel--flush site-panel--demo">
          <AnatomySection
            anatomy={<DialogAnatomy />}
            demo={
          <Preview showModeToggle>
            <Button onClick={() => setModal(true)}>Open modal</Button>
          </Preview>
            }
          />
        </div>
        <Modal open={modal} onClose={() => setModal(false)} title="Update beneficiary" actions={<><Button variant="secondary" onClick={() => setModal(false)}>Cancel</Button><Button onClick={() => setModal(false)}>Save</Button></>}>
          This will replace your current primary beneficiary on file.
        </Modal>
      </DocsSection>

      <DocsSection anchorId="slideover" title="Slideover (form panel)">
        <div className="site-panel site-panel--flush site-panel--demo">
          <AnatomySection
            anatomy={<SlideoverAnatomy />}
            demo={
          <Preview showModeToggle>
            <Button onClick={() => setSlideover(true)}>Open "Add Allocation"</Button>
          </Preview>
            }
          />
        </div>
        <Drawer
          open={slideover}
          onClose={() => setSlideover(false)}
          title="Add Allocation"
          width={520}
          actions={<>
            <Button variant="secondary" size="sm" onClick={() => setSlideover(false)}>Cancel</Button>
            <Button size="sm" onClick={() => setSlideover(false)}>Save</Button>
          </>}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Field label="Recipient name">{(p) => <Input {...p} placeholder="e.g. Taylor Hale" />}</Field>
            <Field label="Distribution mode">{(p) => <Select {...p} options={[{ value: "", label: "Select" }, { value: "lump", label: "Lump sum" }, { value: "installments", label: "Installments" }]} />}</Field>
            <Field label="Withdrawal amount">{(p) => <Input {...p} placeholder="$0.00" />}</Field>
          </div>
        </Drawer>
      </DocsSection>

      <DocsSection anchorId="tooltip" title="Tooltip">
        <AnatomySection anatomy={<TooltipAnatomyFull />} demo={
        <div className="site-panel site-panel--flush site-panel--demo">
          <Preview showModeToggle>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "var(--core-space-12)", width: "100%", padding: "var(--core-space-12) var(--core-space-4)" }}>
              {(["top", "right", "bottom", "left"] as const).map((placement) => (
                <div key={placement} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--core-space-2)" }}>
                  <StateLabel>{placement[0].toUpperCase() + placement.slice(1)}</StateLabel>
                  <div style={{ padding: "var(--core-space-10) var(--core-space-16)" }}>
                    <Tooltip label="Vested balance" placement={placement} open>
                      <IconButton variant="tertiary" size="sm" shape="circle" aria-label={`Tooltip ${placement}`}>
                        <Icon name="fa-solid fa-circle-info" size="sm" />
                      </IconButton>
                    </Tooltip>
                  </div>
                </div>
              ))}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--core-space-2)", gridColumn: "1 / -1" }}>
                <StateLabel>Long text — truncates at max width (240px)</StateLabel>
                <div style={{ padding: "var(--core-space-10) 0 0" }}>
                  <Tooltip label="20% is the IRS-mandated minimum for most retirement plan distributions." open>
                    <IconButton variant="tertiary" size="sm" shape="circle" aria-label="What is federal tax withholding?">
                      <Icon name="fa-solid fa-circle-info" size="sm" />
                    </IconButton>
                  </Tooltip>
                </div>
              </div>
            </div>
          </Preview>
        </div>
        } />
      </DocsSection>
    </DocsSectionList>
  );

  if (embedded) return sections;

  return (
    <div>
      <h1 className="site-h1">Modal, Drawer, Tooltip &amp; Confirmation</h1>
      <p className="site-lede">Overlays interrupt the current flow — used sparingly, always dismissible via Escape or an explicit action.</p>
      {sections}
    </div>
  );
}
