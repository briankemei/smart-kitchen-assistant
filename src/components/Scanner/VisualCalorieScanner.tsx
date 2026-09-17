import React, { useState } from 'react';
import { 
  ScanLine, 
  Camera, 
  CheckCircle2, 
  Sparkles, 
  Layers, 
  Maximize2, 
  UploadCloud, 
  Info,
  Scale
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PlateScanSample, DailyLogItem } from '../../types';
import { samplePlateScans } from '../../data/sampleScans';

interface VisualCalorieScannerProps {
  onLogMeal: (meal: Omit<DailyLogItem, 'id' | 'time'>) => void;
}

export const VisualCalorieScanner: React.FC<VisualCalorieScannerProps> = ({ onLogMeal }) => {
  const [selectedScan, setSelectedScan] = useState<PlateScanSample>(samplePlateScans[0]);
  const [isScanning, setIsScanning] = useState(false);
  const [activeItemHighlight, setActiveItemHighlight] = useState<string | null>(null);
  const [logSuccessMessage, setLogSuccessMessage] = useState<string | null>(null);
  const [uploadedImagePreview, setUploadedImagePreview] = useState<string | null>(null);

  const handleScanSimulation = (scan: PlateScanSample) => {
    setSelectedScan(scan);
    setUploadedImagePreview(null);
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
    }, 1200);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setUploadedImagePreview(reader.result as string);
        setIsScanning(true);
        setTimeout(() => {
          setIsScanning(false);
        }, 1500);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogToDiary = () => {
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.7 },
    });

    onLogMeal({
      name: selectedScan.dishName,
      calories: selectedScan.totalMacros.calories,
      protein: selectedScan.totalMacros.protein,
      carbs: selectedScan.totalMacros.carbs,
      fat: selectedScan.totalMacros.fat,
      source: 'visual_scan',
    });

    setLogSuccessMessage(`Logged ${selectedScan.dishName} (+${selectedScan.totalMacros.calories} kcal) to your daily diary!`);
    setTimeout(() => setLogSuccessMessage(null), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-sky-400">
              <ScanLine className="w-4 h-4" />
              <span>Zero-Entry Visual Calorie Estimation</span>
            </div>
            <h2 className="text-2xl font-black text-white mt-1">Computer Vision Plate Volume Scanner</h2>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Forget typing chicken weights or searching database entries. Snap your plate after cooking—the AI automatically measures plate diameter, calculates volumetric density, segments food boundaries, and logs macros without manual input.
            </p>
          </div>

          {/* Sample Selectors */}
          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-400 hidden sm:inline">Try Demo Meals:</span>
            <div className="flex gap-1.5">
              {samplePlateScans.map((scan, idx) => (
                <button
                  key={scan.id}
                  onClick={() => handleScanSimulation(scan)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                    selectedScan.id === scan.id && !uploadedImagePreview
                      ? 'bg-sky-500/20 border-sky-400 text-sky-300'
                      : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:text-white'
                  }`}
                >
                  Meal #{idx + 1}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Success Alert */}
        {logSuccessMessage && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center space-x-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{logSuccessMessage}</span>
          </div>
        )}
      </div>

      {/* Main Scanner Viewport & Detection Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Camera Viewport */}
        <div className="lg:col-span-7 space-y-3">
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-4 relative overflow-hidden backdrop-blur-md shadow-2xl">
            {/* Viewport Frame */}
            <div className="relative aspect-square sm:aspect-[4/3] w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center">
              {/* The Meal Image */}
              <img
                src={uploadedImagePreview || selectedScan.imageUrl}
                alt={selectedScan.dishName}
                className="w-full h-full object-cover select-none"
              />

              {/* Plate Calibration Reference Ring */}
              <div className="absolute inset-4 sm:inset-8 border border-dashed border-sky-400/40 rounded-full pointer-events-none flex items-center justify-center">
                <div className="absolute top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded bg-slate-900/80 backdrop-blur-sm border border-sky-400/30 text-[10px] font-mono text-sky-300">
                  Plate Reference: {selectedScan.plateDiameterCm} cm
                </div>
              </div>

              {/* Scanning Radar Line */}
              {isScanning && (
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-sky-400 to-transparent shadow-[0_0_15px_#38bdf8] animate-radar pointer-events-none" />
              )}

              {/* Bounding Box Overlays */}
              {!isScanning &&
                selectedScan.detectedItems.map((item) => {
                  const isHovered = activeItemHighlight === item.id;
                  return (
                    <div
                      key={item.id}
                      onMouseEnter={() => setActiveItemHighlight(item.id)}
                      onMouseLeave={() => setActiveItemHighlight(null)}
                      style={{
                        top: `${item.box.top}%`,
                        left: `${item.box.left}%`,
                        width: `${item.box.width}%`,
                        height: `${item.box.height}%`,
                      }}
                      className={`absolute border-2 rounded-xl transition-all cursor-pointer flex flex-col justify-between p-1.5 ${
                        isHovered
                          ? 'border-white bg-white/20 shadow-lg scale-102 z-20'
                          : 'border-sky-400/70 bg-sky-500/10 hover:border-sky-300 z-10'
                      }`}
                    >
                      <div className="self-start">
                        <span className="px-1.5 py-0.5 rounded-md bg-slate-900/90 text-[10px] font-bold text-white border border-slate-700 shadow-sm">
                          {item.name} (~{item.estimatedWeightGrams}g)
                        </span>
                      </div>

                      <div className="self-end">
                        <span className="px-1.5 py-0.5 rounded-md bg-sky-950/90 text-[10px] font-mono text-sky-300 font-bold border border-sky-500/40">
                          {item.calories} kcal
                        </span>
                      </div>
                    </div>
                  );
                })}

              {/* Viewport HUD Elements */}
              <div className="absolute top-3 right-3 flex items-center space-x-1.5">
                <span className="px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-[10px] font-mono text-slate-300 border border-slate-700 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  CV Engine Active
                </span>
              </div>
            </div>

            {/* Camera / Upload Controls */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <label className="cursor-pointer flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition">
                <UploadCloud className="w-4 h-4 text-sky-400" />
                <span>Upload Food Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              <button
                onClick={() => handleScanSimulation(selectedScan)}
                className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold transition shadow-md shadow-sky-500/20 active:scale-95"
              >
                <Camera className="w-4 h-4" />
                <span>Re-Analyze Plate Calibration</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right: Volumetric & Nutrition Summary */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 backdrop-blur-sm shadow-xl flex flex-col justify-between">
            <div>
              {/* Header */}
              <div className="pb-4 border-b border-slate-800">
                <div className="flex items-center space-x-2 text-xs text-sky-400 font-bold uppercase tracking-wider">
                  <Scale className="w-4 h-4" />
                  <span>Volumetric Estimation Matrix</span>
                </div>
                <h3 className="text-xl font-black text-white mt-1">{selectedScan.dishName}</h3>
                <p className="text-xs text-slate-400 mt-0.5">{selectedScan.tag}</p>
              </div>

              {/* Total Calorie Banner */}
              <div className="my-5 p-4 rounded-2xl bg-gradient-to-r from-sky-950/40 via-slate-900 to-slate-950 border border-sky-500/30 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 font-medium block">Total Estimated Calories</span>
                  <div className="flex items-baseline space-x-2 mt-0.5">
                    <span className="text-3xl font-extrabold text-white font-mono">
                      {selectedScan.totalMacros.calories}
                    </span>
                    <span className="text-sm text-sky-400 font-bold font-mono">kcal</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block">Total Plated Mass</span>
                  <span className="text-base font-bold text-slate-200 font-mono">
                    ~{selectedScan.totalEstimatedWeightGrams} grams
                  </span>
                  <span className="text-[10px] text-emerald-400 block font-semibold mt-0.5">97% CV Confidence</span>
                </div>
              </div>

              {/* Macro breakdown chips */}
              <div className="grid grid-cols-4 gap-2 text-center mb-5">
                <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Protein</span>
                  <span className="text-xs font-bold text-sky-400 font-mono">
                    {selectedScan.totalMacros.protein}g
                  </span>
                </div>
                <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Carbs</span>
                  <span className="text-xs font-bold text-amber-400 font-mono">
                    {selectedScan.totalMacros.carbs}g
                  </span>
                </div>
                <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Fat</span>
                  <span className="text-xs font-bold text-rose-400 font-mono">
                    {selectedScan.totalMacros.fat}g
                  </span>
                </div>
                <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Fiber</span>
                  <span className="text-xs font-bold text-emerald-400 font-mono">
                    {selectedScan.totalMacros.fiber}g
                  </span>
                </div>
              </div>

              {/* Segmented Items Breakdown */}
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Detected Food Segments:
                </span>
                {selectedScan.detectedItems.map((item) => (
                  <div
                    key={item.id}
                    onMouseEnter={() => setActiveItemHighlight(item.id)}
                    onMouseLeave={() => setActiveItemHighlight(null)}
                    className={`p-3 rounded-xl border transition flex items-center justify-between text-xs cursor-pointer ${
                      activeItemHighlight === item.id
                        ? 'bg-slate-800 border-sky-400'
                        : 'bg-slate-950/40 border-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-white flex items-center space-x-1.5">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                        <span>{item.name}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        Est. Weight: <span className="font-mono text-slate-300 font-semibold">{item.estimatedWeightGrams}g</span> • Confidence {Math.round(item.confidence * 100)}%
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="font-mono font-bold text-sky-400 text-sm">{item.calories} kcal</span>
                      <div className="text-[10px] text-slate-400">P:{item.protein}g C:{item.carbs}g F:{item.fat}g</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Zero-Effort Log CTA */}
            <div className="mt-6 pt-4 border-t border-slate-800">
              <button
                onClick={handleLogToDiary}
                className="w-full flex items-center justify-center space-x-2 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-400 hover:to-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider transition shadow-lg shadow-sky-500/25 active:scale-98"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Zero-Entry: Log Plate to Daily Diary</span>
              </button>
              <p className="text-[10px] text-center text-slate-500 mt-2">
                No typing numbers • Calibration done automatically via plate diameter
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

