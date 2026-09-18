import React from 'react';
import { Plus, Minus, Trash2, Clock, ChefHat } from 'lucide-react';
import { PantryItem } from '../../types';

interface PantryItemCardProps {
  item: PantryItem;
  onUpdateQuantity: (id: string, newQty: number) => void;
  onDelete: (id: string) => void;
  onFindRecipeForItem: (itemName: string) => void;
}

export const PantryItemCard: React.FC<PantryItemCardProps> = ({
  item,
  onUpdateQuantity,
  onDelete,
  onFindRecipeForItem,
}) => {
  const isUrgent = item.daysUntilExpiry <= 2;
  const isWarning = item.daysUntilExpiry > 2 && item.daysUntilExpiry <= 4;

  const getExpiryBadge = () => {
    if (isUrgent) {
      return (
        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-biotech-rose/20 text-biotech-rose-light border border-biotech-rose/40 animate-pulse">
          <Clock className="w-2.5 h-2.5" />
          <span>{item.daysUntilExpiry === 1 ? 'Expires Tomorrow!' : `Expires in ${item.daysUntilExpiry}d`}</span>
        </span>
      );
    }
    if (isWarning) {
      return (
        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-biotech-amber/20 text-biotech-amber-light border border-biotech-amber/30">
          <Clock className="w-2.5 h-2.5" />
          <span>{item.daysUntilExpiry} days left</span>
        </span>
      );
    }
    return (
      <span className="text-[10px] text-content-muted font-mono">
        {item.daysUntilExpiry > 60 ? `${Math.round(item.daysUntilExpiry / 30)} mo` : `${item.daysUntilExpiry} days`}
      </span>
    );
  };

  return (
    <article
      className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
        isUrgent
          ? 'bg-biotech-rose/10 border-biotech-rose/30 hover:border-biotech-rose/50'
          : isWarning
          ? 'bg-surface-900 border-biotech-amber/20 hover:border-biotech-amber/40'
          : 'bg-surface-900/80 border-surface-border hover:border-surface-borderLight'
      }`}
    >
      <div>
        {/* Header with icon, name, and delete */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center space-x-2.5 min-w-0">
            <span className="text-2xl p-2 rounded-xl bg-surface-950 border border-surface-border shrink-0">
              {item.icon || '🥫'}
            </span>
            <div className="min-w-0">
              <h4 className="text-sm font-bold text-content-primary leading-tight truncate">{item.name}</h4>
              <div className="mt-1">{getExpiryBadge()}</div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onDelete(item.id)}
            aria-label={`Delete ${item.name} from inventory`}
            className="min-h-[44px] min-w-[44px] -mr-2 -mt-2 flex items-center justify-center text-content-muted hover:text-biotech-rose transition rounded-xl hover:bg-surface-800 focus-visible:ring-2 focus-visible:ring-kitchen-500"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Quantity Controls & Recipe CTA */}
      <div className="mt-4 pt-3 border-t border-surface-border flex items-center justify-between">
        {/* Accessible Counter with 44px touch targets */}
        <div className="flex items-center space-x-1 bg-surface-950 rounded-xl p-1 border border-surface-border">
          <button
            type="button"
            onClick={() => onUpdateQuantity(item.id, Math.max(0, item.quantity - (item.unit === 'g' || item.unit === 'ml' ? 50 : 1)))}
            aria-label={`Decrease quantity of ${item.name}`}
            className="min-h-[44px] min-w-[44px] rounded-lg flex items-center justify-center text-content-muted hover:text-content-primary hover:bg-surface-800 transition focus-visible:ring-2 focus-visible:ring-kitchen-500"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>

          <span className="font-mono text-xs font-bold text-content-primary px-2 text-center min-w-[60px]">
            {item.quantity} <span className="text-[10px] text-content-muted font-normal block">{item.unit}</span>
          </span>

          <button
            type="button"
            onClick={() => onUpdateQuantity(item.id, item.quantity + (item.unit === 'g' || item.unit === 'ml' ? 50 : 1))}
            aria-label={`Increase quantity of ${item.name}`}
            className="min-h-[44px] min-w-[44px] rounded-lg flex items-center justify-center text-content-muted hover:text-content-primary hover:bg-surface-800 transition focus-visible:ring-2 focus-visible:ring-kitchen-500"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Cook Action CTA */}
        <button
          type="button"
          onClick={() => onFindRecipeForItem(item.name)}
          aria-label={`Cook recipes using ${item.name}`}
          className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold transition min-h-[44px] focus-visible:ring-2 focus-visible:ring-kitchen-500 ${
            isUrgent
              ? 'bg-biotech-rose/20 text-biotech-rose-light hover:bg-biotech-rose/30 border border-biotech-rose/30'
              : 'bg-surface-800 text-content-secondary hover:text-content-primary hover:bg-surface-750 border border-surface-border'
          }`}
        >
          <ChefHat className="w-3.5 h-3.5 text-kitchen-400" />
          <span>Cook</span>
        </button>
      </div>
    </article>
  );
};
