import React from 'react';
import { Target, Flame, Trash2, Camera, ChefHat, Sparkles } from 'lucide-react';
import { DailyLogItem, BioSyncState } from '../../types';

interface MacroRingsProps {
  diary: DailyLogItem[];
  bioProfile: BioSyncState;
  onDeleteLog: (id: string) => void;
  onOpenScanner: () => void;
}

export const MacroRings: React.FC<MacroRingsProps> = ({
  diary,
  bioProfile,
  onDeleteLog,
  onOpenScanner,
}) => {
  const BASE_CALORIES = 2100;
  const targetCalories = BASE_CALORIES + bioProfile.calorieTargetOffset;
  const targetProtein = bioProfile.proteinTargetGrams;
  const targetCarbs = bioProfile.carbTargetGrams;
  const targetFat = bioProfile.fatTargetGrams;

  // Calculate totals
  const totalCalories = diary.reduce((acc, item) => acc + item.calories, 0);
  const totalProtein = diary.reduce((acc, item) => acc + item.protein, 0);
  const totalCarbs = diary.reduce((acc, item) => acc + item.carbs, 0);
  const totalFat = diary.reduce((acc, item) => acc + item.fat, 0);

  const caloriesRemaining = Math.max(0, targetCalories - totalCalories);
  const calPercent = Math.min(100, Math.round((totalCalories / targetCalories) * 100));
  const proteinPercent = Math.min(100, Math.round((totalProtein / targetProtein) * 100));
  const carbsPercent = Math.min(100, Math.round((totalCarbs / targetCarbs) * 100));
  const fatPercent = Math.min(100, Math.round((totalFat / targetFat) * 100));

  const getSourceIcon = (source: DailyLogItem['source']) => {
    switch (source) {
      case 'visual_scan':
        return <Camera className="w-3.5 h-3.5 text-sky-400" />;
      case 'cooked_recipe':
        return <ChefHat className="w-3.5 h-3.5 text-emerald-400" />;
      case 'reverse_engineer':
        return <Sparkles className="w-3.5 h-3.5 text-purple-400" />;
      default:
        return <Target className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left: Calorie & Macro Gauges */}
      <div className="lg:col-span-2 bg-slate-900/70 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Daily Bio-Nutrition Intake
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                Synced with {bioProfile.label}
              </span>
            </div>
            <h3 className="text-lg font-bold text-white mt-1">Smart Macro & Calorie Targets</h3>
          </div>

          <button
            onClick={onOpenScanner}
            className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition shadow-md shadow-emerald-500/20"
          >
            <Camera className="w-4 h-4" />
            <span>Scan Meal Plate</span>
          </button>
        </div>

        {/* Calorie Big Display */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 items-center">
          {/* Calorie Circle / Ring */}
          <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-slate-950/60 border border-slate-800 relative">
            <div className="relative w-32 h-32 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  stroke="currentColor"
                  strokeWidth="8"
                  className="text-slate-800"
                  fill="transparent"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeDasharray={264}
                  strokeDashoffset={264 - (264 * calPercent) / 100}
                  strokeLinecap="round"
                  className="text-emerald-500 transition-all duration-1000 ease-out"
                  fill="transparent"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <Flame className="w-5 h-5 text-emerald-400 mb-0.5" />
                <span className="text-2xl font-extrabold text-white font-mono leading-none">
                  {totalCalories}
                </span>
                <span className="text-[10px] text-slate-400 font-medium">kcal eaten</span>
              </div>
            </div>

            <div className="mt-3 text-center">
              <span className="text-xs text-slate-400">Budget: </span>
              <span className="text-xs font-bold text-white font-mono">{targetCalories} kcal</span>
              <div className="text-[11px] text-emerald-400 font-semibold mt-0.5">
                {caloriesRemaining} kcal remaining
              </div>
            </div>
          </div>

          {/* Macro Progress Bars */}
          <div className="sm:col-span-2 space-y-4">
            {/* Protein */}
            <div className="bg-slate-950/40 p-3 rounded-xl border border-slate-800/80">
              <div className="flex justify-between items-center text-xs mb-1.5">
                <span className="font-semibold text-sky-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-sky-400"></span>
                  Protein
                </span>
                <span className="font-mono text-xs text-slate-300">
                  <span className="font-bold text-white">{totalProtein}g</span> / {targetProtein}g ({proteinPercent}%)
                </span>
              </div>
              <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-sky-500 to-cyan-400 rounded-full transition-all duration-700"
                  style={{ width: `${proteinPercent}%` }}
                />
              </div>
            </div>

            {/* Carbs */}
            <div className="bg-slate-950/40 p-3 rounded-xl border border-slate-800/80">
              <div className="flex justify-between items-center text-xs mb-1.5">
                <span className="font-semibold text-amber-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                  Carbohydrates
                </span>
                <span className="font-mono text-xs text-slate-300">
                  <span className="font-bold text-white">{totalCarbs}g</span> / {targetCarbs}g ({carbsPercent}%)
                </span>
              </div>
              <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full transition-all duration-700"
                  style={{ width: `${carbsPercent}%` }}
                />
              </div>
            </div>

            {/* Fats */}
            <div className="bg-slate-950/40 p-3 rounded-xl border border-slate-800/80">
              <div className="flex justify-between items-center text-xs mb-1.5">
                <span className="font-semibold text-rose-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-400"></span>
                  Healthy Fats
                </span>
                <span className="font-mono text-xs text-slate-300">
                  <span className="font-bold text-white">{totalFat}g</span> / {targetFat}g ({fatPercent}%)
                </span>
              </div>
              <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-rose-500 to-pink-400 rounded-full transition-all duration-700"
                  style={{ width: `${fatPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right: Logged Meals Timeline */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <span>Today's Meal Diary</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-mono">
                {diary.length}
              </span>
            </h4>
            <span className="text-[11px] text-slate-400">Zero manual typing</span>
          </div>

          <div className="mt-4 space-y-3 max-h-72 overflow-y-auto pr-1">
            {diary.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-xs">
                No meals logged today yet. Snap a plate or cook a morphed recipe!
              </div>
            ) : (
              diary.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 flex items-center justify-between group transition"
                >
                  <div className="flex items-start space-x-2.5 min-w-0">
                    <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 mt-0.5 shrink-0">
                      {getSourceIcon(item.source)}
                    </div>
                    <div className="min-w-0">
                      <h5 className="text-xs font-bold text-white truncate">{item.name}</h5>
                      <div className="flex items-center space-x-2 text-[11px] text-slate-400 mt-0.5">
                        <span className="font-mono">{item.time}</span>
                        <span>•</span>
                        <span className="text-emerald-400 font-mono font-semibold">
                          {item.calories} kcal
                        </span>
                        <span>•</span>
                        <span>P: {item.protein}g</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => onDeleteLog(item.id)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-500 hover:text-rose-400 transition rounded-lg hover:bg-slate-800"
                    title="Remove entry"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 flex justify-between items-center">
          <span>Plate scans automatically sync to macros</span>
          <span className="text-emerald-400 font-semibold cursor-pointer hover:underline" onClick={onOpenScanner}>
            Scan plate →
          </span>
        </div>
      </div>
    </div>
  );
};

