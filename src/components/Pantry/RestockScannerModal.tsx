import React, { useState } from 'react';
import { 
  X, 
  Camera, 
  UploadCloud, 
  Sparkles, 
  CheckCircle2, 
  ScanLine, 
  Layers, 
  Clock, 
  Plus, 
  ShieldCheck 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PantryItem, PantryCategory } from '../../types';
import { sampleRestockHauls, RestockHaulSample, ScannedGroceryItem } from '../../data/sampleRestocks';

interface RestockScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBatchAdd: (items: Omit<PantryItem, 'id' | 'addedDate'>[]) => void;
}

export const RestockScannerModal: React.FC<RestockScannerModalProps> = ({
  isOpen,
  onClose,
  onBatchAdd,
}) => {
  const [selectedHaul, setSelectedHaul] = useState<RestockHaulSample>(sampleRestockHauls[0]);
  const [isScanning, setIsScanning] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>(
    sampleRestockHauls[0].detectedItems.map((i) => i.id)
  );
  const [hoveredItemId, setHoveredItemId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSelectHaul = (haul: RestockHaulSample) => {
    setSelectedHaul(haul);
    setUploadedImage(null);
    setSelectedItemIds(haul.detectedItems.map((i) => i.id));
    setIsScanning(true);
    setTimeout(() => setIsScanning(false), 1200);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setUploadedImage(reader.result as string);
        setIsScanning(true);
        setTimeout(() => setIsScanning(false), 1400);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleItemSelection = (id: string) => {
    setSelectedItemIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleConfirmRestock = () => {
    const itemsToAdd = selectedHaul.detectedItems
      .filter((i) => selectedItemIds.includes(i.id))
      .map((i) => ({
        name: i.name,
        category: i.category,
        quantity: i.quantity,
        unit: i.unit,
        daysUntilExpiry: i.daysUntilExpiry,
        icon: i.icon,
      }));

    if (itemsToAdd.length === 0) return;

    confetti({
      particleCount: 110,
      spread: 75,
      origin: { y: 0.6 },
    });

    onBatchAdd(itemsToAdd);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-4xl rounded-3xl shadow-2xl p-6 flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <ScanLine className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Zero-Effort Restock Vision</span>
              </div>
              <h3 className="text-xl font-black text-white mt-0.5">
                Scan Grocery Haul & Restock Fridge
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Preset Selector */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-400 font-semibold">Demo Grocery Hauls:</span>
            <div className="flex gap-2">
              {sampleRestockHauls.map((haul) => (
                <button
                  key={haul.id}
                  onClick={() => handleSelectHaul(haul)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                    selectedHaul.id === haul.id && !uploadedImage
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                      : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:text-white'
                  }`}
                >
                  {haul.title}
                </button>
              ))}
            </div>
          </div>

          <label className="cursor-pointer flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition">
            <UploadCloud className="w-4 h-4 text-emerald-400" />
            <span>Snap / Upload Counter Photo</span>
            <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>

        {/* Main Content: Photo Viewport on Left, Detected Items on Right */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-5 flex-1 overflow-y-auto pr-1">
          {/* Left: Viewport with bounding box overlays */}
          <div className="md:col-span-6 flex flex-col">
            <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800">
              <img
                src={uploadedImage || selectedHaul.imageUrl}
                alt={selectedHaul.title}
                className="w-full h-full object-cover select-none"
              />

              {/* Scanning Radar Line */}
              {isScanning && (
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_#10b981] animate-radar pointer-events-none" />
              )}

              {/* Bounding Boxes for detected groceries */}
              {!isScanning &&
                selectedHaul.detectedItems.map((item) => {
                  const isSelected = selectedItemIds.includes(item.id);
                  const isHovered = hoveredItemId === item.id;
                  return (
                    <div
                      key={item.id}
                      onMouseEnter={() => setHoveredItemId(item.id)}
                      onMouseLeave={() => setHoveredItemId(null)}
                      onClick={() => toggleItemSelection(item.id)}
                      style={{
                        top: `${item.box.top}%`,
                        left: `${item.box.left}%`,
                        width: `${item.box.width}%`,
                        height: `${item.box.height}%`,
                      }}
                      className={`absolute border-2 rounded-xl transition-all cursor-pointer p-1 flex flex-col justify-between ${
                        isHovered
                          ? 'border-white bg-white/25 shadow-lg scale-102 z-20'
                          : isSelected
                          ? 'border-emerald-400 bg-emerald-500/15 z-10'
                          : 'border-slate-500/40 bg-slate-900/30 opacity-60 z-5'
                      }`}
                    >
                      <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-slate-900/90 text-white font-bold border border-slate-700 self-start truncate max-w-full">
                        {item.icon} {item.name}
                      </span>
                      <span className="text-[9px] font-mono px-1 py-0.5 rounded bg-emerald-950/90 text-emerald-300 font-bold self-end">
                        {Math.round(item.confidence * 100)}%
                      </span>
                    </div>
                  );
                })}

              <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between px-3 py-1.5 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-800 text-[11px] text-slate-300">
                <span>Click boxes or checklist to toggle</span>
                <span className="text-emerald-400 font-semibold font-mono">
                  {selectedHaul.detectedItems.length} items detected
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-400 mt-3 leading-relaxed">
              Unpack your groceries onto the counter or snap your open fridge shelf. Computer vision identifies multiple items, tags storage zones, and calculates expiration dates automatically.
            </p>
          </div>

          {/* Right: Detected Items Checklist & Auto-Expiry Calculations */}
          <div className="md:col-span-6 flex flex-col justify-between bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Detected Groceries ({selectedItemIds.length} selected):</span>
                </span>
                <button
                  onClick={() =>
                    setSelectedItemIds(
                      selectedItemIds.length === selectedHaul.detectedItems.length
                        ? []
                        : selectedHaul.detectedItems.map((i) => i.id)
                    )
                  }
                  className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold"
                >
                  {selectedItemIds.length === selectedHaul.detectedItems.length ? 'Deselect All' : 'Select All'}
                </button>
              </div>

              {/* Checklist */}
              <div className="mt-3 space-y-2 max-h-72 overflow-y-auto pr-1">
                {selectedHaul.detectedItems.map((item) => {
                  const isChecked = selectedItemIds.includes(item.id);
                  return (
                    <div
                      key={item.id}
                      onMouseEnter={() => setHoveredItemId(item.id)}
                      onMouseLeave={() => setHoveredItemId(null)}
                      onClick={() => toggleItemSelection(item.id)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                        isChecked
                          ? 'bg-slate-900 border-emerald-500/50'
                          : 'bg-slate-950/40 border-slate-800/80 opacity-60'
                      }`}
                    >
                      <div className="flex items-center space-x-3 min-w-0">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}} // handled by parent div
                          className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-400 bg-slate-900 border-slate-700"
                        />
                        <span className="text-xl">{item.icon}</span>
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-white truncate">{item.name}</div>
                          <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                            <span className="font-mono text-slate-300 font-semibold">
                              {item.quantity} {item.unit}
                            </span>
                            <span>•</span>
                            <span className="text-emerald-400 capitalize">{item.category}</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                          <Clock className="w-2.5 h-2.5 text-amber-400" />
                          <span>Expires in {item.daysUntilExpiry}d</span>
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white transition"
              >
                Cancel
              </button>

              <button
                disabled={selectedItemIds.length === 0}
                onClick={handleConfirmRestock}
                className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs uppercase tracking-wider transition shadow-lg shadow-emerald-500/25 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Plus className="w-4 h-4" />
                <span>Add {selectedItemIds.length} Items to Virtual Fridge</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

