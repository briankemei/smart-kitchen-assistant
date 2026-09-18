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
      <aside 
        aria-label="Fridge freshness status"
        className="bg-kitchen-950/40 border border-kitchen-700/40 rounded-2xl p-4 flex items-center justify-between"
      >
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-kitchen-500/20 text-kitchen-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-kitchen-300">Virtual Fridge Optimized</h4>
            <p className="text-xs text-content-muted">Zero immediate food waste risk detected. All items are fresh!</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onViewFridge}
          aria-label="View current virtual fridge inventory"
          className="text-xs text-kitchen-300 hover:text-kitchen-200 font-medium px-3.5 py-2 rounded-xl bg-kitchen-900/60 border border-kitchen-700/50 transition focus-visible:ring-2 focus-visible:ring-kitchen-500 min-h-[44px] flex items-center"
        >
          View Inventory
        </button>
      </aside>
    );
  }

  return (
    <aside 
      role="region" 
      aria-label="Urgent perishable food waste alert"
      className="bg-gradient-to-r from-biotech-rose/15 via-surface-900 to-biotech-amber/10 border border-biotech-rose/30 rounded-2xl p-4 sm:p-5 relative overflow-hidden shadow-lg"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left icon and message */}
        <div className="flex items-start space-x-3">
          <div className="p-2.5 rounded-xl bg-biotech-rose/20 text-biotech-rose-light border border-biotech-rose/30 shrink-0 mt-0.5 animate-pulse">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-wider text-biotech-rose-light">
                Use-It-or-Lose-It Alert
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-biotech-rose/20 text-biotech-rose-light font-semibold border border-biotech-rose/30">
                {urgentItems.length} items at risk
              </span>
            </div>
            <h3 className="text-base font-bold text-content-primary mt-1">
              Prevent food waste: Perishables need cooking within 24–48 hours!
            </h3>
            <p className="text-xs text-content-secondary mt-1">
              The AI recipe engine can combine your urgent groceries into high-protein morphed meals right now.
            </p>

            {/* Perishable chips */}
            <div className="flex flex-wrap gap-2 mt-3">
              {urgentItems.map((item) => (
                <span
                  key={item.id}
                  className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-xl bg-surface-950 border border-biotech-rose/40 text-content-primary text-xs font-medium"
                >
                  <span>{item.icon}</span>
                  <span className="font-semibold">{item.name}</span>
                  <span className="text-biotech-rose font-mono text-[11px] flex items-center gap-0.5">
                    <Clock className="w-3 h-3 inline" />
                    {item.daysUntilExpiry}d left
                  </span>
                </span>
              ))}
              {warningItems.slice(0, 2).map((item) => (
                <span
                  key={item.id}
                  className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-xl bg-surface-950 border border-biotech-amber/40 text-content-primary text-xs font-medium"
                >
                  <span>{item.icon}</span>
                  <span>{item.name}</span>
                  <span className="text-biotech-amber font-mono text-[11px]">({item.daysUntilExpiry}d left)</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex sm:flex-col gap-2 shrink-0 self-start md:self-center">
          <button
            type="button"
            onClick={onCookRecipe}
            aria-label="Cook anti-waste morphed recipe using expiring ingredients"
            className="flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-biotech-rose hover:bg-biotech-rose-dark text-white font-bold text-xs shadow-lg shadow-biotech-rose/25 transition active:scale-95 focus-visible:ring-2 focus-visible:ring-biotech-rose min-h-[44px]"
          >
            <span>Cook Anti-Waste Recipe</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onViewFridge}
            aria-label="Manage fridge shelf inventory"
            className="text-xs text-content-muted hover:text-content-primary px-3 py-2 rounded-xl border border-surface-borderLight hover:bg-surface-800 transition text-center focus-visible:ring-2 focus-visible:ring-kitchen-500 min-h-[44px] flex items-center justify-center"
          >
            Manage Fridge Shelf
          </button>
        </div>
      </div>
    </aside>
  );
};
