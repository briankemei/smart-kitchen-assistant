import React, { createContext, useState, useCallback, ReactNode } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
}

interface ToastContextValue {
  showToast: (
    titleOrToast: string | Omit<ToastMessage, 'id'>,
    type?: ToastType,
    message?: string
  ) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (titleOrToast: string | Omit<ToastMessage, 'id'>, type?: ToastType, message?: string) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      let toastItem: ToastMessage;
      if (typeof titleOrToast === 'string') {
        toastItem = { id, title: titleOrToast, type: type || 'info', message };
      } else {
        toastItem = { id, ...titleOrToast };
      }
      setToasts((prev) => [...prev, toastItem]);

      setTimeout(() => {
        removeToast(id);
      }, 4500);
    },
    [removeToast]
  );

  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      {children}

      {/* Floating Accessible Toast Notifications (WCAG AA ARIA live region) */}
      <aside
        aria-live="polite"
        aria-label="Notifications"
        className="fixed bottom-5 right-5 z-50 flex flex-col space-y-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0"
      >
        {toasts.map((toast) => {
          const isSuccess = toast.type === 'success';
          const isError = toast.type === 'error';
          const isWarning = toast.type === 'warning';

          return (
            <div
              key={toast.id}
              role="status"
              className={`pointer-events-auto p-4 rounded-xl border shadow-xl backdrop-blur-md transition-all animate-in slide-in-from-bottom-5 duration-300 flex items-start space-x-3 ${
                isSuccess
                  ? 'bg-surface-900/95 border-kitchen-500/40 text-content-primary shadow-kitchen-500/10'
                  : isError
                  ? 'bg-surface-900/95 border-biotech-rose/40 text-content-primary shadow-biotech-rose/10'
                  : isWarning
                  ? 'bg-surface-900/95 border-biotech-amber/40 text-content-primary shadow-biotech-amber/10'
                  : 'bg-surface-900/95 border-surface-border text-content-primary'
              }`}
            >
              <div className="shrink-0 mt-0.5">
                {isSuccess ? (
                  <CheckCircle2 className="w-5 h-5 text-kitchen-400" aria-hidden="true" />
                ) : isError ? (
                  <AlertCircle className="w-5 h-5 text-biotech-rose" aria-hidden="true" />
                ) : isWarning ? (
                  <AlertCircle className="w-5 h-5 text-biotech-amber" aria-hidden="true" />
                ) : (
                  <Info className="w-5 h-5 text-biotech-blue" aria-hidden="true" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-content-primary">{toast.title}</div>
                {toast.message && (
                  <div className="text-[11px] text-content-secondary mt-0.5 leading-relaxed">
                    {toast.message}
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                aria-label="Close notification"
                className="min-h-[44px] min-w-[44px] -m-2 flex items-center justify-center text-content-muted hover:text-content-primary transition focus-visible:ring-2 focus-visible:ring-kitchen-500 rounded-lg"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          );
        })}
      </aside>
    </ToastContext.Provider>
  );
};

export { ToastContext };
export type { ToastContextValue };


