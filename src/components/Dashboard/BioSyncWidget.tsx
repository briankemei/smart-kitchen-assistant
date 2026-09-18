import React from 'react';
import { Activity, Watch, Flame, HeartPulse, Moon, Dumbbell, ArrowRight } from 'lucide-react';
import { BioStateKey } from '../../types';
import { bioSyncProfiles } from '../../data/bioSyncProfiles';

interface BioSyncWidgetProps {
  currentBioState: BioStateKey;
  onSelectBioState: (key: BioStateKey) => void;
  onExploreRecipes: () => void;
}

export const BioSyncWidget: React.FC<BioSyncWidgetProps> = ({
  currentBioState,
  onSelectBioState,
  onExploreRecipes,
}) => {
  const current = bioSyncProfiles[currentBioState];

  const stateIcons: Record<BioStateKey, React.ReactNode> = {
    'post-hiit': <Flame className="w-5 h-5 text-biotech-blue" />,
    'sedentary': <Activity className="w-5 h-5 text-biotech-purple" />,
    'recovery': <Moon className="w-5 h-5 text-biotech-amber" />,
    'hypertrophy': <Dumbbell className="w-5 h-5 text-biotech-emerald" />,
  };

  return (
    <section 
      aria-labelledby="biosync-heading"
      className="bg-surface-900/80 border border-surface-border rounded-2xl p-6 backdrop-blur-sm relative overflow-hidden"
    >
      {/* Background ambient glow */}
      <div 
        className="absolute -top-24 -right-24 w-60 h-60 rounded-full blur-3xl opacity-20 pointer-events-none transition-all duration-700"
        style={{ backgroundColor: current.color }}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-surface-border">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-kitchen-400">
            <Watch className="w-4 h-4 text-kitchen-400" />
            <span>Bio-Sync Wearable Engine</span>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-kitchen-400"></span>
            <span className="text-kitchen-400 lowercase">live telemetry</span>
          </div>
          <h2 id="biosync-heading" className="text-xl font-bold text-content-primary mt-1 flex items-center gap-2">
            <span>Biological State:</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-kitchen-400 to-kitchen-300">
              {current.label}
            </span>
          </h2>
          <p className="text-xs text-content-muted mt-0.5">{current.subtitle}</p>
        </div>

        {/* Wearable summary pill */}
        <div className="bg-surface-800 border border-surface-border rounded-xl px-3.5 py-2 text-xs text-content-secondary flex items-center space-x-2">
          <HeartPulse className="w-4 h-4 text-biotech-rose animate-pulse" />
          <span className="font-mono text-content-secondary">{current.wearableSummary}</span>
        </div>
      </div>

      {/* Biometric State Selector Chips */}
      <div className="mt-5">
        <label className="text-xs font-semibold text-content-secondary block mb-2">
          Simulate Wearable Activity Sync:
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {(Object.keys(bioSyncProfiles) as BioStateKey[]).map((key) => {
            const item = bioSyncProfiles[key];
            const isSelected = currentBioState === key;
            return (
              <button
                key={key}
                type="button"
                aria-pressed={isSelected}
                aria-label={`Switch bio-state to ${item.label}: ${item.wearableSummary}`}
                onClick={() => onSelectBioState(key)}
                className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between min-h-[44px] focus-visible:ring-2 focus-visible:ring-kitchen-500 ${
                  isSelected
                    ? 'bg-surface-800 border-surface-borderLight shadow-md ring-1 ring-kitchen-500/50'
                    : 'bg-surface-950/50 border-surface-border hover:bg-surface-800/50 hover:border-surface-borderLight text-content-muted'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="p-1.5 rounded-lg bg-surface-950 border border-surface-border">
                    {stateIcons[key]}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                      item.calorieTargetOffset > 0
                        ? 'bg-biotech-blue/20 text-biotech-blue-light'
                        : item.calorieTargetOffset < 0
                        ? 'bg-biotech-purple/20 text-biotech-purple-light'
                        : 'bg-biotech-amber/20 text-biotech-amber-light'
                    }`}
                  >
                    {item.calorieTargetOffset >= 0 ? `+${item.calorieTargetOffset}` : item.calorieTargetOffset} kcal
                  </span>
                </div>
                <div>
                  <div className={`text-xs font-bold ${isSelected ? 'text-content-primary' : 'text-content-secondary'}`}>
                    {item.label}
                  </div>
                  <div className="text-[10px] text-content-muted truncate mt-0.5">{item.wearableSource}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Recommendations & Dynamic targets */}
      <div className="mt-5 pt-4 border-t border-surface-border grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        <div className="md:col-span-2">
          <span className="text-xs font-bold text-kitchen-400 uppercase tracking-wide">
            AI Bio-Metabolic Directive:
          </span>
          <ul className="mt-1.5 space-y-1">
            {current.bioRecommendations.map((rec, idx) => (
              <li key={idx} className="text-xs text-content-secondary flex items-start space-x-2">
                <span className="text-kitchen-400 font-bold">•</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-surface-950/80 border border-surface-border p-3.5 rounded-xl flex flex-col justify-between">
          <div className="flex justify-between items-center text-xs text-content-muted mb-1">
            <span>Macro Profile Focus:</span>
            <span className="font-mono text-kitchen-400 font-bold">{current.proteinTargetGrams}g Protein</span>
          </div>
          <div className="text-xs text-content-secondary font-medium">
            Carbs: <span className="text-content-primary font-mono">{current.carbTargetGrams}g</span> • Fat: <span className="text-content-primary font-mono">{current.fatTargetGrams}g</span>
          </div>
          <button
            type="button"
            onClick={onExploreRecipes}
            aria-label="Morph fridge recipes to match biological state"
            className="mt-3 flex items-center justify-center space-x-1.5 w-full py-2 px-3 rounded-xl bg-kitchen-500/20 hover:bg-kitchen-500/30 text-kitchen-300 text-xs font-bold border border-kitchen-500/40 transition focus-visible:ring-2 focus-visible:ring-kitchen-500 min-h-[44px]"
          >
            <span>Morph Fridge Recipes to Sync</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </section>
  );
};
