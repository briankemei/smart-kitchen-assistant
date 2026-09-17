import React from 'react';
import { AlertTriangle, Clock, ArrowRight, ShieldCheck } from 'lucide-react';
import { PantryItem } from '../../types';

interface UseItOrLoseItBannerProps {
  pantryItems: PantryItem[];
  onCookRecipe: () => void;
  onViewFridge: () => void;
}

export const UseItOrLoseItBanner: React.FC<UseItOrLoseItBannerProps> = ({
  pantryItems,
  onCookRecipe,
  onViewFridge,
}) => {
  // Urgent items: <= 2 days left
  const urgentItems = pantryItems.filter((i) => i.daysUntilExpiry <= 2 && i.quantity > 0);
  // Warning items: 3 to 4 days left
  const warningItems = pantryItems.filter((i) => i.daysUntilExpiry > 2 && i.daysUntilExpiry <= 4 && i.quantity > 0);

  if (urgentItems.length === 0 && warningItems.length === 0) {
    return (
      <div className="bg-emerald-950/30 border border-emerald-800/40 rounded-2xl p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-emerald-300">Virtual Fridge Optimized</h4>
            <p className="text-xs text-slate-400">Zero immediate food waste risk detected. All items are fresh!</p>
          </div>
        </div>
        <button
          onClick={onViewFridge}
          className="text-xs text-emerald-400 hover:text-emerald-300 font-medium px-3 py-1.5 rounded-lg bg-emerald-900/40 border border-emerald-700/50 transition"
        >
          View Inventory
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-rose-950/40 via-slate-900/80 to-amber-950/30 border border-rose-500/30 rounded-2xl p-4 sm:p-5 relative overflow-hidden shadow-lg">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left icon and message */}
        <div className="flex items-start space-x-3">
          <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30 shrink-0 mt-0.5 animate-pulse">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-400">
                Use-It-or-Lose-It Alert
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-semibold border border-rose-500/30">
                {urgentItems.length} items at risk
              </span>
            </div>
            <h3 className="text-base font-bold text-white mt-1">
              Prevent food waste: Perishables need cooking within 24–48 hours!
            </h3>
            <p className="text-xs text-slate-300 mt-1">
              The AI recipe engine can combine your urgent groceries into high-protein morphed meals right now.
            </p>

            {/* Perishable chips */}
            <div className="flex flex-wrap gap-2 mt-3">
              {urgentItems.map((item) => (
                <span
                  key={item.id}
                  className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-rose-950/70 border border-rose-500/40 text-rose-200 text-xs font-medium"
                >
                  <span>{item.icon}</span>
                  <span className="font-semibold">{item.name}</span>
                  <span className="text-rose-400 font-mono text-[11px] flex items-center gap-0.5">
                    <Clock className="w-3 h-3 inline" />
                    {item.daysUntilExpiry}d left
                  </span>
                </span>
              ))}
              {warningItems.slice(0, 2).map((item) => (
                <span
                  key={item.id}
                  className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-amber-950/50 border border-amber-500/30 text-amber-200 text-xs font-medium"
                >
                  <span>{item.icon}</span>
                  <span>{item.name}</span>
                  <span className="text-amber-400 font-mono text-[11px]">({item.daysUntilExpiry}d left)</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex sm:flex-col gap-2 shrink-0 self-start md:self-center">
          <button
            onClick={onCookRecipe}
            className="flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs shadow-lg shadow-rose-600/30 transition active:scale-95"
          >
            <span>Cook Anti-Waste Recipe</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={onViewFridge}
            className="text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-lg border border-slate-700/60 hover:bg-slate-800 transition text-center"
          >
            Manage Fridge Shelf
          </button>
        </div>
      </div>
    </div>
  );
};

