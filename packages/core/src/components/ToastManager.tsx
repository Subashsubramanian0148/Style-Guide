import React, { createContext, useCallback, useContext, useRef, useState } from "react";
import { Toast, ToastTone } from "./Overlays";

interface ToastEntry { id: number; tone: ToastTone; title: string; description?: string; }
interface ToastContextValue {
  push: (toast: { tone?: ToastTone; title: string; description?: string; durationMs?: number }) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

/** Wrap the app (or a page) in <ToastProvider> once, then call useToast().push(...) anywhere inside it. */
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastEntry[]>([]);
  const idRef = useRef(0);

  const dismiss = useCallback((id: number) => setToasts((prev) => prev.filter((t) => t.id !== id)), []);

  const push = useCallback(({ tone = "info", title, description, durationMs = 4000 }: { tone?: ToastTone; title: string; description?: string; durationMs?: number }) => {
    const id = ++idRef.current;
    setToasts((prev) => [...prev, { id, tone, title, description }]);
    setTimeout(() => dismiss(id), durationMs);
  }, [dismiss]);

  return (
    <ToastContext.Provider value={{ push }}>
      {children}
      <div className="cds-toast-viewport" aria-live="polite" aria-atomic="false">
        {toasts.map((t) => (
          <Toast key={t.id} tone={t.tone} title={t.title} timestamp="Just now" onClose={() => dismiss(t.id)}>{t.description}</Toast>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast() must be called inside a <ToastProvider>");
  return ctx;
}
