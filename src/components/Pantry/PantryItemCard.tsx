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
        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse">
          <Clock className="w-2.5 h-2.5" />
          <span>{item.daysUntilExpiry === 1 ? 'Expires Tomorrow!' : `Expires in ${item.daysUntilExpiry}d`}</span>
        </span>
      );
    }
    if (isWarning) {
      return (
        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
          <Clock className="w-2.5 h-2.5" />
          <span>{item.daysUntilExpiry} days left</span>
        </span>
      );
    }
    return (
      <span className="text-[10px] text-slate-400 font-mono">
        {item.daysUntilExpiry > 60 ? `${Math.round(item.daysUntilExpiry / 30)} mo` : `${item.daysUntilExpiry} days`}
      </span>
    );
  };

  return (
    <div
      className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
        isUrgent
          ? 'bg-rose-950/20 border-rose-500/30 hover:border-rose-500/50'
          : isWarning
          ? 'bg-slate-900/90 border-amber-500/20 hover:border-amber-500/40'
          : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
      }`}
    >
      <div>
        {/* Header with icon and status */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center space-x-2.5">
            <span className="text-2xl p-1.5 rounded-lg bg-slate-950/80 border border-slate-800 shrink-0">
              {item.icon || '🥫'}
            </span>
            <div className="min-w-0">
              <h4 className="text-sm font-bold text-white leading-tight truncate">{item.name}</h4>
              <div className="mt-1">{getExpiryBadge()}</div>
            </div>
          </div>

          <button
            onClick={() => onDelete(item.id)}
            className="text-slate-500 hover:text-rose-400 p-1 rounded-lg hover:bg-slate-800/80 transition"
            title="Delete item"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Quantity Controls & Recipe CTA */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
        {/* Counter */}
        <div className="flex items-center space-x-2 bg-slate-950/80 rounded-lg p-1 border border-slate-800">
          <button
            onClick={() => onUpdateQuantity(item.id, Math.max(0, item.quantity - (item.unit === 'g' || item.unit === 'ml' ? 50 : 1)))}
            className="w-6 h-6 rounded flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <Minus className="w-3 h-3" />
          </button>
          <span className="font-mono text-xs font-bold text-white px-1">
            {item.quantity} <span className="text-[10px] text-slate-400 font-normal">{item.unit}</span>
          </span>
          <button
            onClick={() => onUpdateQuantity(item.id, item.quantity + (item.unit === 'g' || item.unit === 'ml' ? 50 : 1))}
            className="w-6 h-6 rounded flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>

        {/* Quick action button */}
        <button
          onClick={() => onFindRecipeForItem(item.name)}
          className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-medium transition ${
            isUrgent
              ? 'bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 border border-rose-500/30'
              : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
          }`}
          title="Find AI recipes using this ingredient"
        >
          <ChefHat className="w-3 h-3" />
          <span>Cook</span>
        </button>
      </div>
    </div>
  );
};

