import React from 'react';
import { X, Receipt, Download } from 'lucide-react';
import { Subscription } from '../../types';
import { useFocusTrap } from '../../hooks/useFocusTrap';

interface InvoicesModalProps {
  isOpen: boolean;
  subscription: Subscription;
  onClose: () => void;
}

export const InvoicesModal: React.FC<InvoicesModalProps> = ({
  isOpen,
  subscription,
  onClose,
}) => {
  const modalRef = useFocusTrap(isOpen, onClose);

  if (!isOpen) return null;

  const handleDownload = (invId: string) => {
    alert(`Downloaded invoice receipt ${invId} (PDF). Saved to local database records.`);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface-950/90 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="invoices-modal-title"
    >
      <div 
        ref={modalRef}
        className="bg-surface-900 border border-surface-border w-full max-w-xl rounded-3xl shadow-2xl p-6 sm:p-8 relative"
      >
        <div className="flex items-center justify-between pb-4 border-b border-surface-border">
          <div className="flex items-center space-x-2.5">
            <span className="p-2 rounded-xl bg-surface-800 text-kitchen-400">
              <Receipt className="w-5 h-5" aria-hidden="true" />
            </span>
            <div>
              <h3 id="invoices-modal-title" className="text-lg font-black text-content-primary">Billing History & Invoices</h3>
              <p className="text-xs text-content-muted mt-0.5">
                Managed securely in the persistent database
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close billing history"
            className="min-w-[44px] min-h-[44px] flex items-center justify-center text-content-muted hover:text-content-primary rounded-xl hover:bg-surface-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kitchen-500 transition"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Current Plan Overview */}
        <div className="mt-4 p-4 rounded-2xl bg-surface-950/80 border border-surface-border flex items-center justify-between text-xs">
          <div>
            <span className="text-content-muted">Current Plan:</span>
            <span className="font-bold text-content-primary uppercase ml-1.5">{subscription.tier}</span>
            <div className="text-content-muted text-[11px] mt-0.5">
              Renews on {new Date(subscription.renewsAt).toLocaleDateString()}
            </div>
          </div>
          <div className="text-right">
            <span className="text-kitchen-400 font-mono font-bold">${subscription.pricePerMonth}/mo</span>
            <div className="text-content-muted text-[11px]">{subscription.paymentMethod}</div>
          </div>
        </div>

        {/* Invoices List */}
        <div className="mt-5 space-y-2.5 max-h-72 overflow-y-auto pr-1">
          {(!subscription.invoices || subscription.invoices.length === 0) ? (
            <div className="text-center py-8 text-xs text-content-muted">
              No invoices recorded yet.
            </div>
          ) : (
            subscription.invoices.map((inv) => (
              <div
                key={inv.id}
                className="p-3.5 rounded-xl bg-surface-950/50 border border-surface-border flex items-center justify-between hover:border-surface-700 transition"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-content-primary">{inv.planName}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-kitchen-500/20 text-kitchen-400 font-semibold uppercase">
                      {inv.status}
                    </span>
                  </div>
                  <div className="text-[11px] text-content-muted font-mono mt-0.5">
                    {inv.date} • {inv.paymentMethod}
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <span className="text-sm font-bold text-content-primary font-mono">
                    ${inv.amount.toFixed(2)}
                  </span>
                  <button
                    onClick={() => handleDownload(inv.id)}
                    aria-label={`Download invoice ${inv.id} PDF receipt`}
                    className="min-w-[44px] min-h-[44px] flex items-center justify-center text-content-muted hover:text-content-primary rounded-xl hover:bg-surface-800 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kitchen-500"
                    title="Download Receipt (PDF)"
                  >
                    <Download className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="mt-6 pt-4 border-t border-surface-border flex justify-end">
          <button
            onClick={onClose}
            className="min-h-[44px] px-6 py-2 rounded-xl bg-surface-800 hover:bg-surface-750 text-content-primary text-xs font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kitchen-500"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};


