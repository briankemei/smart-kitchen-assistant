import React, { useState } from 'react';
import { 
  X, 
  UploadCloud, 
  Sparkles, 
  ScanLine, 
  Clock, 
  Plus, 
  ShieldCheck 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PantryItem } from '../../types';
import { sampleRestockHauls, RestockHaulSample } from '../../data/sampleRestocks';
import { useFocusTrap } from '../../hooks/useFocusTrap';

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
  const modalRef = useFocusTrap(isOpen, onClose);
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
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface-950/90 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="restock-modal-title"
    >
      <div 
        ref={modalRef}
        className="bg-surface-900 border border-surface-border w-full max-w-4xl rounded-3xl shadow-2xl p-6 flex flex-col max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-surface-border">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-kitchen-500/15 text-kitchen-400 border border-kitchen-500/30">
              <ScanLine className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-kitchen-400">
                <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Zero-Effort Restock Vision</span>
              </div>
              <h3 id="restock-modal-title" className="text-xl font-black text-content-primary mt-0.5">
                Scan Grocery Haul & Restock Fridge
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close restock scanner"
            className="min-w-[44px] min-h-[44px] flex items-center justify-center text-content-muted hover:text-content-primary rounded-xl hover:bg-surface-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kitchen-500 transition"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Preset Selector */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 bg-surface-950/60 p-3 rounded-2xl border border-surface-border">
          <div className="flex items-center space-x-2">
            <span className="text-xs text-content-muted font-semibold">Demo Grocery Hauls:</span>
            <div className="flex gap-2">
              {sampleRestockHauls.map((haul) => (
                <button
                  key={haul.id}
                  onClick={() => handleSelectHaul(haul)}
                  className={`min-h-[44px] px-3.5 py-1.5 rounded-xl text-xs font-bold border transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kitchen-500 ${
                    selectedHaul.id === haul.id && !uploadedImage
                      ? 'bg-kitchen-500/20 border-kitchen-400 text-kitchen-300'
                      : 'bg-surface-800/80 border-surface-700 text-content-secondary hover:text-content-primary'
                  }`}
                >
                  {haul.title}
                </button>
              ))}
            </div>
          </div>

          <label 
            htmlFor="restock-file-input"
            className="cursor-pointer min-h-[44px] flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-surface-800 hover:bg-surface-750 text-content-primary text-xs font-semibold border border-surface-700 transition focus-within:ring-2 focus-within:ring-kitchen-500"
          >
            <UploadCloud className="w-4 h-4 text-kitchen-400" aria-hidden="true" />
            <span>Snap / Upload Counter Photo</span>
            <input 
              id="restock-file-input"
              type="file" 
              accept="image/*" 
              onChange={handleFileUpload} 
              className="sr-only" 
              aria-label="Upload counter photo"
            />
          </label>
        </div>

        {/* Main Content: Photo Viewport on Left, Detected Items on Right */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-5 flex-1 overflow-y-auto pr-1">
          {/* Left: Viewport with bounding box overlays */}
          <div className="md:col-span-6 flex flex-col">
            <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-surface-950 border border-surface-border">
              <img
                src={uploadedImage || selectedHaul.imageUrl}
                alt={`Detected groceries counter photo: ${selectedHaul.title}`}
                className="w-full h-full object-cover select-none"
              />

              {/* Scanning Radar Line */}
              {isScanning && (
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-kitchen-400 to-transparent shadow-[0_0_15px_#10b981] animate-radar pointer-events-none" />
              )}

              {/* Bounding Boxes for detected groceries */}
              {!isScanning &&
                selectedHaul.detectedItems.map((item) => {
                  const isSelected = selectedItemIds.includes(item.id);
                  const isHovered = hoveredItemId === item.id;
                  return (
                    <button
                      type="button"
                      key={item.id}
                      onMouseEnter={() => setHoveredItemId(item.id)}
                      onMouseLeave={() => setHoveredItemId(null)}
                      onClick={() => toggleItemSelection(item.id)}
                      aria-label={`${item.name} (${item.quantity} ${item.unit}), click to ${isSelected ? 'deselect' : 'select'}`}
                      style={{
                        top: `${item.box.top}%`,
                        left: `${item.box.left}%`,
                        width: `${item.box.width}%`,
                        height: `${item.box.height}%`,
                      }}
                      className={`absolute border-2 rounded-xl transition-all cursor-pointer p-1 flex flex-col justify-between text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kitchen-400 ${
                        isHovered
                          ? 'border-white bg-white/25 shadow-lg scale-102 z-20'
                          : isSelected
                          ? 'border-kitchen-400 bg-kitchen-500/15 z-10'
                          : 'border-surface-700/60 bg-surface-900/40 opacity-60 z-5'
                      }`}
                    >
                      <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-surface-900/90 text-content-primary font-bold border border-surface-border self-start truncate max-w-full">
                        {item.icon} {item.name}
                      </span>
                      <span className="text-[9px] font-mono px-1 py-0.5 rounded bg-kitchen-950/90 text-kitchen-300 font-bold self-end border border-kitchen-500/30">
                        {Math.round(item.confidence * 100)}%
                      </span>
                    </button>
                  );
                })}

              <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between px-3 py-1.5 rounded-xl bg-surface-900/90 backdrop-blur-md border border-surface-border text-[11px] text-content-secondary">
                <span>Click boxes or checklist to toggle</span>
                <span className="text-kitchen-400 font-semibold font-mono">
                  {selectedHaul.detectedItems.length} items detected
                </span>
              </div>
            </div>

            <p className="text-xs text-content-muted mt-3 leading-relaxed">
              Unpack your groceries onto the counter or snap your open fridge shelf. Computer vision identifies multiple items, tags storage zones, and calculates expiration dates automatically.
            </p>
          </div>

          {/* Right: Detected Items Checklist & Auto-Expiry Calculations */}
          <div className="md:col-span-6 flex flex-col justify-between bg-surface-950/60 p-4 rounded-2xl border border-surface-border">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-surface-border">
                <span className="text-xs font-bold uppercase tracking-wider text-content-secondary flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-kitchen-400" aria-hidden="true" />
                  <span>Detected Groceries ({selectedItemIds.length} selected):</span>
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setSelectedItemIds(
                      selectedItemIds.length === selectedHaul.detectedItems.length
                        ? []
                        : selectedHaul.detectedItems.map((i) => i.id)
                    )
                  }
                  className="min-h-[44px] px-2 py-1 text-xs text-kitchen-400 hover:text-kitchen-300 font-semibold rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kitchen-500"
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
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          toggleItemSelection(item.id);
                        }
                      }}
                      onMouseEnter={() => setHoveredItemId(item.id)}
                      onMouseLeave={() => setHoveredItemId(null)}
                      onClick={() => toggleItemSelection(item.id)}
                      className={`min-h-[44px] p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kitchen-500 ${
                        isChecked
                          ? 'bg-surface-900 border-kitchen-500/50'
                          : 'bg-surface-950/40 border-surface-border opacity-60'
                      }`}
                    >
                      <div className="flex items-center space-x-3 min-w-0">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}} // handled by parent div
                          aria-label={`Select ${item.name}`}
                          className="w-4 h-4 rounded text-kitchen-500 focus:ring-kitchen-400 bg-surface-900 border-surface-700"
                        />
                        <span className="text-xl" aria-hidden="true">{item.icon}</span>
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-content-primary truncate">{item.name}</div>
                          <div className="text-[11px] text-content-muted flex items-center gap-2 mt-0.5">
                            <span className="font-mono text-content-secondary font-semibold">
                              {item.quantity} {item.unit}
                            </span>
                            <span aria-hidden="true">•</span>
                            <span className="text-kitchen-400 capitalize">{item.category}</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-surface-800 text-content-secondary border border-surface-border">
                          <Clock className="w-2.5 h-2.5 text-biotech-amber" aria-hidden="true" />
                          <span>Expires in {item.daysUntilExpiry}d</span>
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-5 pt-4 border-t border-surface-border flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="min-h-[44px] px-4 py-2 text-xs font-semibold text-content-muted hover:text-content-primary transition rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kitchen-500"
              >
                Cancel
              </button>

              <button
                disabled={selectedItemIds.length === 0}
                onClick={handleConfirmRestock}
                className="min-h-[44px] flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-kitchen-500 hover:bg-kitchen-400 text-surface-950 font-black text-xs uppercase tracking-wider transition shadow-lg shadow-kitchen-500/25 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kitchen-400"
              >
                <Plus className="w-4 h-4" aria-hidden="true" />
                <span>Add {selectedItemIds.length} Items to Virtual Fridge</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


