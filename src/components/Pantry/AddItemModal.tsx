import React, { useState } from 'react';
import { X, Plus, Sparkles } from 'lucide-react';
import { PantryCategory, PantryItem } from '../../types';

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

    // Reset form
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-2xl shadow-2xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
          <Sparkles className="w-4 h-4" />
          <span>Smart Grocery Add</span>
        </div>
        <h3 className="text-xl font-bold text-white">Add Item to Virtual Fridge</h3>
        <p className="text-xs text-slate-400 mt-1">
          Add fresh groceries. The AI will monitor expiration and automatically suggest recipes to prevent waste.
        </p>

        {/* Quick Presets */}
        <div className="mt-4">
          <span className="text-[11px] font-semibold text-slate-400 block mb-1.5">
            Quick Auto-Fill Presets:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {quickPresets.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => applyPreset(p)}
                className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700/80 transition flex items-center gap-1"
              >
                <span>{p.icon}</span>
                <span>{p.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Item Name</label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                placeholder="Emoji"
                className="w-16 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-center text-lg focus:outline-none focus:border-emerald-500 text-white"
              />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Grass-Fed Ribeye Steak"
                className="flex-1 px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Storage Zone</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as PantryCategory)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-emerald-500"
              >
                <option value="produce">Fresh Produce (Crisper)</option>
                <option value="dairy-protein">Dairy & Proteins (Fridge)</option>
                <option value="pantry">Dry Pantry & Grains</option>
                <option value="frozen">Deep Freezer</option>
                <option value="spices">Spices & Sauces</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Days Until Expiry
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  min="1"
                  max="365"
                  required
                  value={daysUntilExpiry}
                  onChange={(e) => setDaysUntilExpiry(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-emerald-500 font-mono"
                />
                <span className="text-xs text-slate-400">days</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Quantity</label>
              <input
                type="number"
                min="0.1"
                step="any"
                required
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Unit</label>
              <input
                type="text"
                required
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="e.g. g, eggs, ml, cans"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-400 hover:text-white text-sm transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center space-x-2 px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition shadow-lg shadow-emerald-500/20"
            >
              <Plus className="w-4 h-4" />
              <span>Add to Fridge</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

