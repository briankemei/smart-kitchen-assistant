import React, { useState } from 'react';
import { X, Plus, Sparkles } from 'lucide-react';
import { PantryCategory, PantryItem } from '../../types';
import { useFocusTrap } from '../../hooks/useFocusTrap';

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (item: Omit<PantryItem, 'id' | 'addedDate'>) => void;
}

export const AddItemModal: React.FC<AddItemModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<PantryCategory>('produce');
  const [quantity, setQuantity] = useState<number>(1);
  const [unit, setUnit] = useState('items');
  const [daysUntilExpiry, setDaysUntilExpiry] = useState<number>(5);
  const [icon, setIcon] = useState('🥗');

  const modalRef = useFocusTrap<HTMLDivElement>({
    isOpen,
    onClose,
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAdd({
      name: name.trim(),
      category,
      quantity: Number(quantity),
      unit: unit.trim() || 'items',
      daysUntilExpiry: Number(daysUntilExpiry),
      icon: icon || '🥫',
    });

    setName('');
    setQuantity(1);
    setDaysUntilExpiry(5);
    onClose();
  };

  const quickPresets = [
    { name: 'Avocados (Hass)', cat: 'produce', qty: 2, unit: 'count', days: 3, icon: '🥑' },
    { name: 'Lean Ground Turkey 93/7', cat: 'dairy-protein', qty: 450, unit: 'g', days: 2, icon: '🥩' },
    { name: 'Sourdough Bread', cat: 'pantry', qty: 1, unit: 'loaf', days: 4, icon: '🍞' },
    { name: 'Almond Milk (Unsweetened)', cat: 'dairy-protein', qty: 946, unit: 'ml', days: 7, icon: '🥛' },
    { name: 'Organic Blueberries', cat: 'produce', qty: 170, unit: 'g', days: 4, icon: '🫐' },
  ] as const;

  const applyPreset = (preset: typeof quickPresets[number]) => {
    setName(preset.name);
    setCategory(preset.cat as PantryCategory);
    setQuantity(preset.qty);
    setUnit(preset.unit);
    setDaysUntilExpiry(preset.days);
    setIcon(preset.icon);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface-950/85 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-item-modal-title"
        tabIndex={-1}
        className="bg-surface-900 border border-surface-border w-full max-w-lg rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden focus-visible:outline-none"
      >
        {/* Sticky Header */}
        <div className="flex items-center justify-between p-6 border-b border-surface-border bg-surface-900 shrink-0">
          <div>
            <div className="flex items-center space-x-2 text-kitchen-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Smart Grocery Add</span>
            </div>
            <h3 id="add-item-modal-title" className="text-xl font-black text-content-primary">
              Add Item to Virtual Fridge
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close add item dialog"
            className="min-h-[44px] min-w-[44px] -mr-2 -mt-2 flex items-center justify-center text-content-muted hover:text-content-primary hover:bg-surface-800 rounded-xl transition focus-visible:ring-2 focus-visible:ring-kitchen-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-surface-700">
          {/* Quick Presets */}
          <div>
            <span className="text-xs font-semibold text-content-secondary block mb-2">
              Quick Auto-Fill Presets:
            </span>
            <div className="flex flex-wrap gap-2">
              {quickPresets.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => applyPreset(p)}
                  aria-label={`Apply preset for ${p.name}`}
                  className="text-xs px-3 py-2 rounded-xl bg-surface-800 hover:bg-surface-750 text-content-primary border border-surface-border transition flex items-center gap-1.5 min-h-[44px] focus-visible:ring-2 focus-visible:ring-kitchen-500"
                >
                  <span>{p.icon}</span>
                  <span>{p.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Form fields */}
          <form id="add-pantry-form" onSubmit={handleSubmit} className="space-y-4 pt-2">
            <div>
              <label htmlFor="pantry-item-name" className="block text-xs font-semibold text-content-secondary mb-1">
                Item Name
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={icon}
                  onChange={(e) => setIcon(e.target.value)}
                  placeholder="Emoji"
                  aria-label="Item emoji icon"
                  className="w-16 px-3 py-2.5 rounded-xl bg-surface-950 border border-surface-border text-center text-lg focus-visible:ring-2 focus-visible:ring-kitchen-500 text-content-primary min-h-[44px]"
                />
                <input
                  id="pantry-item-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Grass-Fed Ribeye Steak"
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-surface-950 border border-surface-border text-content-primary text-sm focus-visible:ring-2 focus-visible:ring-kitchen-500 min-h-[44px]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="pantry-item-category" className="block text-xs font-semibold text-content-secondary mb-1">
                  Storage Zone
                </label>
                <select
                  id="pantry-item-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as PantryCategory)}
                  className="w-full px-3 py-2.5 rounded-xl bg-surface-950 border border-surface-border text-content-primary text-sm focus-visible:ring-2 focus-visible:ring-kitchen-500 min-h-[44px]"
                >
                  <option value="produce">Fresh Produce (Crisper)</option>
                  <option value="dairy-protein">Dairy & Proteins (Fridge)</option>
                  <option value="pantry">Dry Pantry & Grains</option>
                  <option value="frozen">Deep Freezer</option>
                  <option value="spices">Spices & Sauces</option>
                </select>
              </div>

              <div>
                <label htmlFor="pantry-item-expiry" className="block text-xs font-semibold text-content-secondary mb-1">
                  Days Until Expiry
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    id="pantry-item-expiry"
                    type="number"
                    min="1"
                    max="365"
                    required
                    value={daysUntilExpiry}
                    onChange={(e) => setDaysUntilExpiry(Number(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-xl bg-surface-950 border border-surface-border text-content-primary text-sm focus-visible:ring-2 focus-visible:ring-kitchen-500 font-mono min-h-[44px]"
                  />
                  <span className="text-xs text-content-muted">days</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="pantry-item-qty" className="block text-xs font-semibold text-content-secondary mb-1">
                  Quantity
                </label>
                <input
                  id="pantry-item-qty"
                  type="number"
                  min="0.1"
                  step="any"
                  required
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full px-3 py-2.5 rounded-xl bg-surface-950 border border-surface-border text-content-primary text-sm focus-visible:ring-2 focus-visible:ring-kitchen-500 font-mono min-h-[44px]"
                />
              </div>

              <div>
                <label htmlFor="pantry-item-unit" className="block text-xs font-semibold text-content-secondary mb-1">
                  Unit
                </label>
                <input
                  id="pantry-item-unit"
                  type="text"
                  required
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  placeholder="e.g. g, eggs, ml, cans"
                  className="w-full px-3 py-2.5 rounded-xl bg-surface-950 border border-surface-border text-content-primary text-sm focus-visible:ring-2 focus-visible:ring-kitchen-500 min-h-[44px]"
                />
              </div>
            </div>
          </form>
        </div>

        {/* Sticky Footer */}
        <div className="p-5 border-t border-surface-border bg-surface-900 flex items-center justify-end space-x-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-content-muted hover:text-content-primary text-xs font-semibold transition min-h-[44px] focus-visible:ring-2 focus-visible:ring-kitchen-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="add-pantry-form"
            className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-kitchen-500 hover:bg-kitchen-400 text-surface-950 font-bold text-xs transition shadow-lg shadow-kitchen-500/20 active:scale-95 min-h-[44px] focus-visible:ring-2 focus-visible:ring-kitchen-500"
          >
            <Plus className="w-4 h-4" />
            <span>Add to Fridge</span>
          </button>
        </div>
      </div>
    </div>
  );
};
