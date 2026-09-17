import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Refrigerator, 
  Clock, 
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { PantryCategory, PantryItem } from '../../types';
import { PantryItemCard } from './PantryItemCard';
import { AddItemModal } from './AddItemModal';

interface VirtualFridgeProps {
  pantryItems: PantryItem[];
  onUpdateQuantity: (id: string, newQty: number) => void;
  onDeleteItem: (id: string) => void;
  onAddItem: (item: Omit<PantryItem, 'id' | 'addedDate'>) => void;
  onFindRecipeForItem: (itemName: string) => void;
}

export const VirtualFridge: React.FC<VirtualFridgeProps> = ({
  pantryItems,
  onUpdateQuantity,
  onDeleteItem,
  onAddItem,
  onFindRecipeForItem,
}) => {
  const [activeCategory, setActiveCategory] = useState<PantryCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [sortUrgentFirst, setSortUrgentFirst] = useState(true);

  // Filter items
  const filteredItems = pantryItems.filter((item) => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Sort items
  const sortedItems = [...filteredItems].sort((a, b) => {
    if (sortUrgentFirst) {
      return a.daysUntilExpiry - b.daysUntilExpiry;
    }
    return a.name.localeCompare(b.name);
  });

  const urgentCount = pantryItems.filter((i) => i.daysUntilExpiry <= 2 && i.quantity > 0).length;

  const categories = [
    { id: 'all', label: 'All Items', icon: '🧺' },
    { id: 'produce', label: 'Produce & Greens', icon: '🥬' },
    { id: 'dairy-protein', label: 'Proteins & Dairy', icon: '🍗' },
    { id: 'pantry', label: 'Grains & Pantry', icon: '🍚' },
    { id: 'frozen', label: 'Freezer', icon: '❄️' },
    { id: 'spices', label: 'Spices & Oils', icon: '🧂' },
  ] as const;

  return (
    <div className="space-y-6">
      {/* Top Header & Stat Banner */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
              <Refrigerator className="w-4 h-4" />
              <span>Persistent Smart Pantry</span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-400 lowercase">Auto-decrementing inventory</span>
            </div>
            <h2 className="text-2xl font-black text-white mt-1">Virtual Fridge & Kitchen Stock</h2>
            <p className="text-xs text-slate-400 mt-1 max-w-xl">
              Track fresh perishables with automatic shelf-life estimations. Every time you cook an AI-suggested recipe, used ingredients are automatically deducted from your fridge stock.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition shadow-lg shadow-emerald-500/20 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Add Groceries</span>
            </button>
          </div>
        </div>

        {/* Quick Fridge Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-800">
          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
            <span className="text-[11px] text-slate-400 font-medium">Total Inventory</span>
            <div className="text-lg font-bold text-white font-mono mt-0.5">
              {pantryItems.length} <span className="text-xs text-slate-400 font-normal">items</span>
            </div>
          </div>

          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
            <span className="text-[11px] text-rose-400 font-medium flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Urgent (<span className="font-mono">≤2d</span>)
            </span>
            <div className="text-lg font-bold text-rose-300 font-mono mt-0.5">
              {urgentCount} <span className="text-xs text-rose-400 font-normal">at risk</span>
            </div>
          </div>

          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
            <span className="text-[11px] text-slate-400 font-medium">Auto-Deduction</span>
            <div className="text-lg font-bold text-emerald-400 font-mono mt-0.5 flex items-center gap-1">
              <span>Active</span>
              <Sparkles className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
            <span className="text-[11px] text-slate-400 font-medium">Zero-Waste Score</span>
            <div className="text-lg font-bold text-sky-400 font-mono mt-0.5">
              94% <span className="text-xs text-slate-400 font-normal">utilized</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search groceries (e.g., chicken, eggs)..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500 placeholder:text-slate-500"
          />
        </div>

        {/* Sort & Quick toggle */}
        <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
          <button
            onClick={() => setSortUrgentFirst(!sortUrgentFirst)}
            className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl border text-xs font-semibold transition ${
              sortUrgentFirst
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                : 'bg-slate-900 border-slate-800 text-slate-400'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>{sortUrgentFirst ? 'Urgent Items First' : 'Alphabetical'}</span>
          </button>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id as PantryCategory | 'all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition flex items-center space-x-1.5 ${
              activeCategory === cat.id
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                : 'bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <span>{cat.icon}</span>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Pantry Grid */}
      {sortedItems.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/40 border border-dashed border-slate-800 rounded-2xl p-6">
          <AlertCircle className="w-8 h-8 text-slate-500 mx-auto mb-2" />
          <h4 className="text-sm font-bold text-white">No pantry items found</h4>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Try adjusting your search filter, or add groceries to your virtual fridge to unlock AI recipe generation.
          </p>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="mt-4 px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs"
          >
            Add New Groceries
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {sortedItems.map((item) => (
            <PantryItemCard
              key={item.id}
              item={item}
              onUpdateQuantity={onUpdateQuantity}
              onDelete={onDeleteItem}
              onFindRecipeForItem={onFindRecipeForItem}
            />
          ))}
        </div>
      )}

      {/* Add Modal */}
      <AddItemModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={onAddItem}
      />
    </div>
  );
};

