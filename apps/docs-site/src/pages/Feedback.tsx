import React from "react";
import { Preview } from "../Preview";
import { DocsSection, DocsSectionList } from "../DocsSection";
import { Alert } from "../../../../packages/core/src/components/Misc";
import { Toast, Spinner } from "../../../../packages/core/src/components/Overlays";
import { Empty } from "../../../../packages/core/src/components/Primitives";
import { Button } from "../../../../packages/core/src/components/Button";
import { AnatomySection } from "../AnatomySection";
import { AlertAnatomy } from "../AlertAnatomy";
import { ToastAnatomy } from "../ToastAnatomy";
import { EmptyAnatomy } from "../SectionAnatomies";
import { SpinnerAnatomy } from "../SectionAnatomies";

export default function Feedback({ embedded = false }: { embedded?: boolean }) {
  const [dismissed, setDismissed] = React.useState<Set<string>>(new Set());
  const [dismissedToasts, setDismissedToasts] = React.useState<Set<string>>(new Set());
  const dismiss = (key: string) => setDismissed((prev) => new Set([...prev, key]));
  const dismissToast = (key: string) => setDismissedToasts((prev) => new Set([...prev, key]));
  const resetAlerts = () => setDismissed(new Set());
  const resetToasts = () => setDismissedToasts(new Set());
  const sections = [
    {
      id: "01",
      anchorId: "alert",
      title: "Alert",
      content: (
        <div className="site-panel site-panel--flush site-panel--demo">
          <AnatomySection
            anatomy={<AlertAnatomy />}
            demo={
              <Preview showModeToggle>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "stretch", gap: 12, width: "100%" }}>
                {!dismissed.has("success") && (
                  <Alert tone="success" title="Enrollment complete" onDismiss={() => dismiss("success")}>
                    You are contributing 6% starting next pay cycle.
                  </Alert>
                )}
                {!dismissed.has("warning") && (
                  <Alert tone="warning" title="Beneficiary missing" onDismiss={() => dismiss("warning")}>
                    Add a beneficiary to finish setting up your account.
                  </Alert>
                )}
                {!dismissed.has("danger") && (
                  <Alert tone="danger" title="Update failed" onDismiss={() => dismiss("danger")}>
                    We couldn't save your contribution change. Try again.
                  </Alert>
                )}
                {!dismissed.has("info") && (
                  <Alert tone="info" title="Scheduled maintenance" onDismiss={() => dismiss("info")}>
                    The portal will be unavailable Sunday 2–4am ET.
                  </Alert>
                )}
                {dismissed.size === 4 && (
                  <div style={{ textAlign: "center", padding: "12px 0" }}>
                    <button
                      type="button"
                      className="cds-btn cds-btn--secondary cds-btn--sm"
                      onClick={resetAlerts}
                    >
                      ↺ Reset alerts
                    </button>
                  </div>
                )}
                </div>
              </Preview>
            }
          />
        </div>
      ),
    },
    {
      id: "04",
      anchorId: "empty",
      title: "Empty State",
      content: (
        <div className="site-panel site-panel--flush site-panel--demo">
          <AnatomySection
            anatomy={<EmptyAnatomy />}
            demo={<>
          <Preview showModeToggle>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 220, width: "100%" }}>
              <Empty
                title="No transactions yet"
                description="Once you make your first contribution, it will show up here."
                action={
                  <Button variant="primary" size="sm">
                    Learn how contributions work
                  </Button>
                }
              />
            </div>
          </Preview>
        </>}
          />
        </div>
      ),
    },
    {
      id: "05",
      anchorId: "spinner",
      title: "Loading Spinner",
      content: (
        <div className="site-panel site-panel--flush site-panel--demo">
          <AnatomySection
            anatomy={<SpinnerAnatomy />}
            demo={<>
          <Preview showModeToggle>
            <Spinner />
            <span style={{ fontSize: 14, color: "var(--core-color-text-secondary)" }}>Saving your changes…</span>
          </Preview>
        </>}
          />
        </div>
      ),
    },
    {
      id: "02",
      anchorId: "toast",
      title: "Toast & Notifications",
      content: (
        <div className="site-panel site-panel--flush site-panel--demo">
          <AnatomySection
            anatomy={<ToastAnatomy />}
            demo={
          <Preview showModeToggle>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--core-space-4, 16px)", width: "100%" }}>
            {!dismissedToasts.has("success") && (
              <Toast tone="success" title="Changes saved" onClose={() => dismissToast("success")}>
                Your contribution rate was updated.
              </Toast>
            )}
            {!dismissedToasts.has("warning") && (
              <Toast tone="warning" title="Beneficiary missing" onClose={() => dismissToast("warning")}>
                Add a beneficiary to finish setting up your account.
              </Toast>
            )}
            {!dismissedToasts.has("info") && (
              <Toast tone="info" title="Scheduled maintenance" onClose={() => dismissToast("info")}>
                The portal will be unavailable Sunday 2–4am ET.
              </Toast>
            )}
            {!dismissedToasts.has("danger") && (
              <Toast tone="danger" title="Couldn't connect" onClose={() => dismissToast("danger")}>
                Check your internet connection and retry.
              </Toast>
            )}
            {dismissedToasts.size === 4 && (
              <div style={{ width: "100%", textAlign: "center", padding: "12px 0" }}>
                <button
                  type="button"
                  className="cds-btn cds-btn--secondary cds-btn--sm"
                  onClick={resetToasts}
                >
                  ↺ Reset toasts
                </button>
              </div>
            )}
            </div>
          </Preview>
            }
          />
        </div>
      ),
    },
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

  if (embedded) return sectionList;

  return (
    <div style={{ maxWidth: 1024, margin: "0 auto", padding: "20px" }}>
      <div style={{ textAlign: "center", marginBottom: 60, marginTop: 40 }}>
        <h1 style={{ fontSize: 72, fontWeight: 700, letterSpacing: "-0.06em", margin: "0 0 16px 0", color: "var(--core-color-text-primary)", lineHeight: 1.1 }}>Feedback</h1>
        <p style={{ maxWidth: 580, margin: "0 auto", color: "var(--core-color-text-tertiary)", fontSize: 18, lineHeight: 1.6, fontWeight: 400 }}>
          Alerts, transient toasts, empty states, and activity spinners for user reassurance and operational statuses.
        </p>
      </div>
      {sectionList}
    </div>
  );
}
