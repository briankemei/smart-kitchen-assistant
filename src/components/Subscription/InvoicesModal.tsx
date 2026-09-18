import React from 'react';
import { X, Receipt, Download, CheckCircle2, ShieldCheck } from 'lucide-react';
import { Subscription } from '../../types';

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
  if (!isOpen) return null;

  const handleDownload = (invId: string) => {
    alert(`Downloaded invoice receipt ${invId} (PDF). Saved to local database records.`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-xl rounded-3xl shadow-2xl p-6 sm:p-8 relative">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <span className="p-2 rounded-xl bg-slate-800 text-emerald-400">
              <Receipt className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-lg font-black text-white">Billing History & Invoices</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Managed securely in the persistent database
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Plan Overview */}
        <div className="mt-4 p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between text-xs">
          <div>
            <span className="text-slate-400">Current Plan:</span>
            <span className="font-bold text-white uppercase ml-1.5">{subscription.tier}</span>
            <div className="text-slate-500 text-[11px] mt-0.5">
              Renews on {new Date(subscription.renewsAt).toLocaleDateString()}
            </div>
          </div>
          <div className="text-right">
            <span className="text-emerald-400 font-mono font-bold">${subscription.pricePerMonth}/mo</span>
            <div className="text-slate-400 text-[11px]">{subscription.paymentMethod}</div>
          </div>
        </div>

        {/* Invoices List */}
        <div className="mt-5 space-y-2.5 max-h-72 overflow-y-auto pr-1">
          {(!subscription.invoices || subscription.invoices.length === 0) ? (
            <div className="text-center py-8 text-xs text-slate-500">
              No invoices recorded yet.
            </div>
          ) : (
            subscription.invoices.map((inv) => (
              <div
                key={inv.id}
                className="p-3.5 rounded-xl bg-slate-950/50 border border-slate-800/80 flex items-center justify-between hover:border-slate-700 transition"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-white">{inv.planName}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-semibold uppercase">
                      {inv.status}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                    {inv.date} • {inv.paymentMethod}
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <span className="text-sm font-bold text-white font-mono">
                    ${inv.amount.toFixed(2)}
                  </span>
                  <button
                    onClick={() => handleDownload(inv.id)}
                    className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
                    title="Download Receipt (PDF)"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

