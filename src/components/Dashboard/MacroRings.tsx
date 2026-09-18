import React from 'react';
import { Target, Flame, Trash2, Camera, ChefHat, Sparkles, PlusCircle } from 'lucide-react';
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
        return <Camera className="w-3.5 h-3.5 text-biotech-blue" />;
      case 'cooked_recipe':
        return <ChefHat className="w-3.5 h-3.5 text-kitchen-400" />;
      case 'reverse_engineer':
        return <Sparkles className="w-3.5 h-3.5 text-biotech-purple" />;
      default:
        return <Target className="w-3.5 h-3.5 text-content-muted" />;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left: Calorie & Macro Gauges */}
      <section 
        aria-labelledby="macro-heading"
        className="lg:col-span-2 bg-surface-900/80 border border-surface-border rounded-2xl p-6 backdrop-blur-sm"
      >
        <div className="flex items-center justify-between pb-4 border-b border-surface-border">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-wider text-content-muted">
                Daily Bio-Nutrition Intake
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-surface-800 text-content-secondary font-mono">
                Synced with {bioProfile.label}
              </span>
            </div>
            <h3 id="macro-heading" className="text-lg font-bold text-content-primary mt-1">
              Smart Macro & Calorie Targets
            </h3>
          </div>

          <button
            type="button"
            onClick={onOpenScanner}
            aria-label="Scan meal plate with computer vision camera"
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-kitchen-500 hover:bg-kitchen-400 text-surface-950 font-bold text-xs transition shadow-md shadow-kitchen-500/20 min-h-[44px] focus-visible:ring-2 focus-visible:ring-kitchen-500"
          >
            <Camera className="w-4 h-4" />
            <span>Scan Meal Plate</span>
          </button>
        </div>

        {/* Calorie Big Display */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 items-center">
          {/* Calorie Circle / Ring */}
          <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-surface-950 border border-surface-border relative">
            <div className="relative w-32 h-32 flex items-center justify-center">
              <svg 
                role="img" 
                aria-label={`Calorie ring: ${totalCalories} of ${targetCalories} kcal consumed (${calPercent}%)`}
                className="w-full h-full transform -rotate-90" 
                viewBox="0 0 100 100"
              >
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  stroke="currentColor"
                  strokeWidth="8"
                  className="text-surface-800"
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
                  className="text-kitchen-500 transition-all duration-1000 ease-out"
                  fill="transparent"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <Flame className="w-5 h-5 text-kitchen-400 mb-0.5" />
                <span className="text-2xl font-extrabold text-content-primary font-mono leading-none">
                  {totalCalories}
                </span>
                <span className="text-[10px] text-content-muted font-medium">kcal eaten</span>
              </div>
            </div>

            <div className="mt-3 text-center">
              <span className="text-xs text-content-muted">Budget: </span>
              <span className="text-xs font-bold text-content-primary font-mono">{targetCalories} kcal</span>
              <div className="text-[11px] text-kitchen-400 font-semibold mt-0.5">
                {caloriesRemaining} kcal remaining
              </div>
            </div>
          </div>

          {/* Macro Progress Bars */}
          <div className="sm:col-span-2 space-y-4">
            {/* Protein */}
            <div className="bg-surface-950/60 p-3 rounded-xl border border-surface-border">
              <div className="flex justify-between items-center text-xs mb-1.5">
                <span className="font-semibold text-biotech-blue flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-biotech-blue"></span>
                  Protein
                </span>
                <span className="font-mono text-xs text-content-secondary">
                  <span className="font-bold text-content-primary">{totalProtein}g</span> / {targetProtein}g ({proteinPercent}%)
                </span>
              </div>
              <div className="w-full h-2.5 bg-surface-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-biotech-blue to-biotech-blue-light rounded-full transition-all duration-700"
                  style={{ width: `${proteinPercent}%` }}
                />
              </div>
            </div>

            {/* Carbs */}
            <div className="bg-surface-950/60 p-3 rounded-xl border border-surface-border">
              <div className="flex justify-between items-center text-xs mb-1.5">
                <span className="font-semibold text-biotech-amber flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-biotech-amber"></span>
                  Carbohydrates
                </span>
                <span className="font-mono text-xs text-content-secondary">
                  <span className="font-bold text-content-primary">{totalCarbs}g</span> / {targetCarbs}g ({carbsPercent}%)
                </span>
              </div>
              <div className="w-full h-2.5 bg-surface-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-biotech-amber to-biotech-amber-light rounded-full transition-all duration-700"
                  style={{ width: `${carbsPercent}%` }}
                />
              </div>
            </div>

            {/* Fats */}
            <div className="bg-surface-950/60 p-3 rounded-xl border border-surface-border">
              <div className="flex justify-between items-center text-xs mb-1.5">
                <span className="font-semibold text-biotech-rose flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-biotech-rose"></span>
                  Healthy Fats
                </span>
                <span className="font-mono text-xs text-content-secondary">
                  <span className="font-bold text-content-primary">{totalFat}g</span> / {targetFat}g ({fatPercent}%)
                </span>
              </div>
              <div className="w-full h-2.5 bg-surface-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-biotech-rose to-biotech-rose-light rounded-full transition-all duration-700"
                  style={{ width: `${fatPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Right: Logged Meals Timeline */}
      <section 
        aria-labelledby="diary-heading"
        className="bg-surface-900/80 border border-surface-border rounded-2xl p-6 backdrop-blur-sm flex flex-col justify-between"
      >
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-surface-border">
            <h4 id="diary-heading" className="text-sm font-bold text-content-primary flex items-center gap-2">
              <span>Today's Meal Diary</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-surface-800 text-content-secondary font-mono">
                {diary.length}
              </span>
            </h4>
            <span className="text-[11px] text-content-muted">Zero manual typing</span>
          </div>

          <div className="mt-4 space-y-2.5 max-h-72 overflow-y-auto pr-1">
            {diary.length === 0 ? (
              /* Rich Empty State (WCAG AA & UI/UX standard) */
              <div className="text-center py-10 px-4 rounded-xl bg-surface-950/50 border border-dashed border-surface-border flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-kitchen-500/10 text-kitchen-400 flex items-center justify-center mb-3">
                  <PlusCircle className="w-5 h-5" />
                </div>
                <h5 className="text-xs font-bold text-content-primary">No Meals Logged Today</h5>
                <p className="text-[11px] text-content-muted mt-1 max-w-[200px] leading-relaxed">
                  Take a photo of your plate or cook a morphed recipe to auto-log your nutrition.
                </p>
                <button
                  type="button"
                  onClick={onOpenScanner}
                  className="mt-3.5 px-3 py-2 rounded-xl bg-kitchen-500 hover:bg-kitchen-400 text-surface-950 font-bold text-xs transition shadow-sm min-h-[44px] flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-kitchen-500"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Scan First Meal</span>
                </button>
              </div>
            ) : (
              diary.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-xl bg-surface-950/70 border border-surface-border hover:border-surface-borderLight flex items-center justify-between group transition"
                >
                  <div className="flex items-start space-x-2.5 min-w-0">
                    <div className="p-2 rounded-lg bg-surface-900 border border-surface-border mt-0.5 shrink-0">
                      {getSourceIcon(item.source)}
                    </div>
                    <div className="min-w-0">
                      <h5 className="text-xs font-bold text-content-primary truncate">{item.name}</h5>
                      <div className="flex items-center space-x-2 text-[11px] text-content-muted mt-0.5">
                        <span className="font-mono">{item.time}</span>
                        <span>•</span>
                        <span className="text-kitchen-400 font-mono font-semibold">
                          {item.calories} kcal
                        </span>
                        <span>•</span>
                        <span>P: {item.protein}g</span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onDeleteLog(item.id)}
                    aria-label={`Remove ${item.name} from meal diary`}
                    className="min-h-[44px] min-w-[44px] flex items-center justify-center text-content-muted hover:text-biotech-rose transition rounded-xl hover:bg-surface-850 focus-visible:ring-2 focus-visible:ring-kitchen-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-surface-border text-[11px] text-content-muted flex justify-between items-center">
          <span>Plate scans automatically sync to macros</span>
          <button
            type="button"
            onClick={onOpenScanner}
            className="text-kitchen-400 hover:text-kitchen-300 font-semibold focus-visible:ring-2 focus-visible:ring-kitchen-500 rounded p-1"
          >
            Scan plate →
          </button>
        </div>
      </section>
    </div>
  );
};
