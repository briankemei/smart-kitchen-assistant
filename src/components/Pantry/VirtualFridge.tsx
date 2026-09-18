import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Refrigerator, 
  Clock, 
  AlertCircle,
  Camera,
  ScanLine
} from 'lucide-react';
import { PantryCategory, PantryItem } from '../../types';
import { PantryItemCard } from './PantryItemCard';
import { AddItemModal } from './AddItemModal';
import { RestockScannerModal } from './RestockScannerModal';

interface VirtualFridgeProps {
  pantryItems: PantryItem[];
  onUpdateQuantity: (id: string, newQty: number) => void;
  onDeleteItem: (id: string) => void;
  onAddItem: (item: Omit<PantryItem, 'id' | 'addedDate'>) => void;
  onBatchAdd: (items: Omit<PantryItem, 'id' | 'addedDate'>[]) => void;
  onFindRecipeForItem: (itemName: string) => void;
}

export const VirtualFridge: React.FC<VirtualFridgeProps> = ({
  pantryItems,
  onUpdateQuantity,
  onDeleteItem,
  onAddItem,
  onBatchAdd,
  onFindRecipeForItem,
}) => {
  const [activeCategory, setActiveCategory] = useState<PantryCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isRestockScannerOpen, setIsRestockScannerOpen] = useState(false);
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
      <section 
        aria-labelledby="fridge-heading"
        className="bg-surface-900/80 border border-surface-border rounded-2xl p-6 backdrop-blur-sm"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-kitchen-400">
              <Refrigerator className="w-4 h-4" />
              <span>Persistent Smart Pantry</span>
              <span className="text-surface-700">•</span>
              <span className="text-content-muted lowercase">Auto-decrementing inventory</span>
            </div>
            <h2 id="fridge-heading" className="text-2xl font-black text-content-primary mt-1">
              Virtual Fridge & Kitchen Stock
            </h2>
            <p className="text-xs text-content-secondary mt-1 max-w-xl leading-relaxed">
              Track fresh perishables with automatic shelf-life estimations. Scan grocery hauls when unpacking to auto-restock in one tap, or let AI auto-deduct ingredients when cooking!
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Scan Grocery Restock Button */}
            <button
              type="button"
              onClick={() => setIsRestockScannerOpen(true)}
              aria-label="Scan grocery haul with computer vision"
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-kitchen-500 to-kitchen-400 hover:from-kitchen-400 hover:to-kitchen-300 text-surface-950 font-black text-xs uppercase tracking-wider transition shadow-lg shadow-kitchen-500/25 active:scale-95 focus-visible:ring-2 focus-visible:ring-kitchen-500 min-h-[44px]"
            >
              <ScanLine className="w-4 h-4 stroke-[2.5]" />
              <span>Scan Grocery Restock</span>
            </button>

            {/* Quick Add Single Item */}
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              aria-label="Manually add grocery item"
              className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-surface-800 hover:bg-surface-750 text-content-primary font-bold text-xs border border-surface-border transition active:scale-95 focus-visible:ring-2 focus-visible:ring-kitchen-500 min-h-[44px]"
            >
              <Plus className="w-4 h-4 text-kitchen-400" />
              <span>Manual Add</span>
            </button>
          </div>
        </div>

        {/* Quick Fridge Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-surface-border">
          <div className="bg-surface-950/80 p-3 rounded-xl border border-surface-border">
            <span className="text-[11px] text-content-muted font-medium">Total Inventory</span>
            <div className="text-lg font-bold text-content-primary font-mono mt-0.5">
              {pantryItems.length} <span className="text-xs text-content-muted font-normal">items</span>
            </div>
          </div>

          <div className="bg-surface-950/80 p-3 rounded-xl border border-surface-border">
            <span className="text-[11px] text-biotech-rose font-medium flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Urgent (<span className="font-mono">≤2d</span>)
            </span>
            <div className="text-lg font-bold text-biotech-rose-light font-mono mt-0.5">
              {urgentCount} <span className="text-xs text-biotech-rose font-normal">at risk</span>
            </div>
          </div>

          <div className="bg-surface-950/80 p-3 rounded-xl border border-surface-border">
            <span className="text-[11px] text-content-muted font-medium">CV Haul Scanner</span>
            <div className="text-lg font-bold text-kitchen-400 font-mono mt-0.5 flex items-center gap-1">
              <span>Ready</span>
              <Camera className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="bg-surface-950/80 p-3 rounded-xl border border-surface-border">
            <span className="text-[11px] text-content-muted font-medium">Zero-Waste Score</span>
            <div className="text-lg font-bold text-biotech-blue font-mono mt-0.5">
              94% <span className="text-xs text-content-muted font-normal">utilized</span>
            </div>
          </div>
        </div>
      </section>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-content-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search groceries in virtual fridge"
            placeholder="Search groceries (e.g. chicken, eggs)..."
            className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-surface-900 border border-surface-border text-content-primary text-xs focus-visible:ring-2 focus-visible:ring-kitchen-500 placeholder:text-content-muted min-h-[44px]"
          />
        </div>

        {/* Sort & Quick toggle */}
        <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
          <button
            type="button"
            onClick={() => setSortUrgentFirst(!sortUrgentFirst)}
            aria-label={sortUrgentFirst ? "Sorting by urgent expiration first" : "Sorting alphabetically"}
            className={`flex items-center space-x-1.5 px-3.5 py-2.5 rounded-xl border text-xs font-semibold transition min-h-[44px] focus-visible:ring-2 focus-visible:ring-kitchen-500 ${
              sortUrgentFirst
                ? 'bg-biotech-rose/15 border-biotech-rose/30 text-biotech-rose-light'
                : 'bg-surface-900 border-surface-border text-content-secondary hover:text-content-primary'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>{sortUrgentFirst ? 'Urgent Items First' : 'Alphabetical'}</span>
          </button>
        </div>
      </div>

      {/* Category Pills */}
      <div role="tablist" aria-label="Grocery categories" className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => {
          const isSelected = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              role="tab"
              aria-selected={isSelected}
              onClick={() => setActiveCategory(cat.id as PantryCategory | 'all')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center space-x-1.5 min-h-[44px] focus-visible:ring-2 focus-visible:ring-kitchen-500 ${
                isSelected
                  ? 'bg-kitchen-500 text-surface-950 font-bold shadow-md shadow-kitchen-500/20'
                  : 'bg-surface-900/90 border border-surface-border text-content-secondary hover:text-content-primary hover:bg-surface-800'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Pantry Grid or Empty State */}
      {sortedItems.length === 0 ? (
        <div 
          role="status"
          className="text-center py-16 bg-surface-900/50 border border-dashed border-surface-border rounded-3xl p-8 flex flex-col items-center"
        >
          <div className="w-14 h-14 rounded-2xl bg-surface-800 flex items-center justify-center text-content-muted mb-3 border border-surface-border">
            <AlertCircle className="w-7 h-7 text-kitchen-400" />
          </div>
          <h4 className="text-base font-bold text-content-primary">No Pantry Items Found</h4>
          <p className="text-xs text-content-muted mt-1.5 max-w-md mx-auto leading-relaxed">
            Your Virtual Fridge is currently empty or no groceries match your filter. Scan your grocery haul on the counter to auto-populate multiple items at once!
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 mt-5">
            <button
              type="button"
              onClick={() => setIsRestockScannerOpen(true)}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-kitchen-500 hover:bg-kitchen-400 text-surface-950 font-black text-xs uppercase tracking-wider shadow-md transition min-h-[44px] focus-visible:ring-2 focus-visible:ring-kitchen-500"
            >
              <ScanLine className="w-4 h-4" />
              <span>Scan Grocery Haul</span>
            </button>

            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-surface-800 hover:bg-surface-750 text-content-primary font-bold text-xs border border-surface-border transition min-h-[44px] focus-visible:ring-2 focus-visible:ring-kitchen-500"
            >
              <Plus className="w-4 h-4 text-kitchen-400" />
              <span>Manual Add Item</span>
            </button>
          </div>
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

      {/* Add Modal (Single) */}
      <AddItemModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={onAddItem}
      />

      {/* Multi-Item Grocery Restock Scanner Modal */}
      <RestockScannerModal
        isOpen={isRestockScannerOpen}
        onClose={() => setIsRestockScannerOpen(false)}
        onBatchAdd={onBatchAdd}
      />
    </div>
  );
};
