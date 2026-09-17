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
    'post-hiit': <Flame className="w-5 h-5 text-sky-400" />,
    'sedentary': <Activity className="w-5 h-5 text-purple-400" />,
    'recovery': <Moon className="w-5 h-5 text-amber-400" />,
    'hypertrophy': <Dumbbell className="w-5 h-5 text-emerald-400" />,
  };

  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm relative overflow-hidden">
      {/* Background ambient glow */}
      <div 
        className="absolute -top-24 -right-24 w-60 h-60 rounded-full blur-3xl opacity-20 pointer-events-none transition-all duration-700"
        style={{ backgroundColor: current.color }}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
            <Watch className="w-4 h-4 text-emerald-400" />
            <span>Bio-Sync Wearable Engine</span>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span className="text-emerald-400 lowercase">live telemetry</span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1 flex items-center gap-2">
            <span>Biological State:</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
              {current.label}
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">{current.subtitle}</p>
        </div>

        {/* Wearable summary pill */}
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl px-3.5 py-2 text-xs text-slate-200 flex items-center space-x-2">
          <HeartPulse className="w-4 h-4 text-rose-400 animate-pulse" />
          <span className="font-mono text-slate-300">{current.wearableSummary}</span>
        </div>
      </div>

      {/* Biometric State Selector Chips */}
      <div className="mt-5">
        <label className="text-xs font-medium text-slate-400 block mb-2">
          Simulate Wearable Activity Sync:
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {(Object.keys(bioSyncProfiles) as BioStateKey[]).map((key) => {
            const item = bioSyncProfiles[key];
            const isSelected = currentBioState === key;
            return (
              <button
                key={key}
                onClick={() => onSelectBioState(key)}
                className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-slate-800/90 border-slate-600 shadow-md ring-1 ring-emerald-500/50'
                    : 'bg-slate-900/40 border-slate-800/80 hover:bg-slate-800/40 hover:border-slate-700 text-slate-400'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="p-1.5 rounded-lg bg-slate-950/60 border border-slate-800">
                    {stateIcons[key]}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                      item.calorieTargetOffset > 0
                        ? 'bg-sky-500/20 text-sky-300'
                        : item.calorieTargetOffset < 0
                        ? 'bg-purple-500/20 text-purple-300'
                        : 'bg-amber-500/20 text-amber-300'
                    }`}
                  >
                    {item.calorieTargetOffset >= 0 ? `+${item.calorieTargetOffset}` : item.calorieTargetOffset} kcal
                  </span>
                </div>
                <div>
                  <div className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                    {item.label}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate mt-0.5">{item.wearableSource}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Recommendations & Dynamic targets */}
      <div className="mt-5 pt-4 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        <div className="md:col-span-2">
          <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wide">
            AI Bio-Metabolic Directive:
          </span>
          <ul className="mt-1.5 space-y-1">
            {current.bioRecommendations.map((rec, idx) => (
              <li key={idx} className="text-xs text-slate-300 flex items-start space-x-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-slate-950/70 border border-slate-800 p-3.5 rounded-xl flex flex-col justify-between">
          <div className="flex justify-between items-center text-xs text-slate-400 mb-1">
            <span>Macro Profile Focus:</span>
            <span className="font-mono text-emerald-400 font-semibold">{current.proteinTargetGrams}g Protein</span>
          </div>
          <div className="text-xs text-slate-300 font-medium">
            Carbs: <span className="text-white font-mono">{current.carbTargetGrams}g</span> • Fat: <span className="text-white font-mono">{current.fatTargetGrams}g</span>
          </div>
          <button
            onClick={onExploreRecipes}
            className="mt-3 flex items-center justify-center space-x-1.5 w-full py-1.5 px-3 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-semibold border border-emerald-500/40 transition"
          >
            <span>Morph Fridge Recipes to Sync</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

