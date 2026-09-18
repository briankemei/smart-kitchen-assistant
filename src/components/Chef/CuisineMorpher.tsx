import React, { useState } from 'react';
import { 
  ChefHat, 
  Sparkles, 
  CheckCircle2, 
  Layers, 
  Play, 
  ArrowRight,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { MorphableRecipe, CuisineStyle, PantryItem } from '../../types';
import { sampleRecipes, cuisineOptions } from '../../data/recipes';
import { CookingModeModal } from './CookingModeModal';

interface CuisineMorpherProps {
  pantryItems: PantryItem[];
  onCookRecipe: (recipe: MorphableRecipe, style: CuisineStyle) => void;
  selectedFilterIngredient?: string | null;
}

export const CuisineMorpher: React.FC<CuisineMorpherProps> = ({
  pantryItems,
  onCookRecipe,
  selectedFilterIngredient,
}) => {
  const [selectedRecipeId, setSelectedRecipeId] = useState<string>(sampleRecipes[0].id);
  const [activeStyle, setActiveStyle] = useState<CuisineStyle>('mediterranean');
  const [isCookModalOpen, setIsCookModalOpen] = useState(false);
  const [deductFeedback, setDeductFeedback] = useState<string[] | null>(null);

  const activeRecipe = sampleRecipes.find((r) => r.id === selectedRecipeId) || sampleRecipes[0];
  const morphedStyle = activeRecipe.styles[activeStyle];

  // Helper to check if ingredient is in virtual fridge
  const checkFridgeStatus = (reqName: string) => {
    const found = pantryItems.find(
      (p) => p.name.toLowerCase().includes(reqName.toLowerCase()) || reqName.toLowerCase().includes(p.name.toLowerCase())
    );
    return found && found.quantity > 0;
  };

  const handleTriggerCook = () => {
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
    });
    onCookRecipe(activeRecipe, activeStyle);
    setDeductFeedback([
      `Cooked: ${morphedStyle.title}`,
      `Auto-deducted required quantities from your Virtual Fridge inventory!`,
      `Logged +${activeRecipe.calories} kcal & +${activeRecipe.macros.protein}g protein to daily diary.`,
    ]);
    setTimeout(() => {
      setDeductFeedback(null);
    }, 6000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-surface-900/80 border border-surface-border rounded-2xl p-6 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-kitchen-400">
              <Sparkles className="w-4 h-4" aria-hidden="true" />
              <span>Generative Flavor Morphing Engine</span>
            </div>
            <h2 className="text-2xl font-black text-content-primary mt-1">Cuisine Morphing & Recipe Preview</h2>
            <p className="text-xs text-content-muted mt-1 max-w-2xl">
              Have the base ingredients for a meal, but want a completely different flavor profile? Switch the Cuisine Style below. KitchenSync AI dynamically morphs your pantry aromatics, spice blends, and cooking methods on the fly.
            </p>
          </div>

          {/* Recipe Selector Pills */}
          <div className="flex items-center space-x-2 bg-surface-950 p-1.5 rounded-xl border border-surface-border shrink-0">
            {sampleRecipes.map((r) => (
              <button
                key={r.id}
                onClick={() => setSelectedRecipeId(r.id)}
                className={`min-h-[44px] px-3.5 py-2 rounded-lg text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kitchen-500 ${
                  selectedRecipeId === r.id
                    ? 'bg-kitchen-500 text-surface-950 shadow-sm font-bold'
                    : 'text-content-muted hover:text-content-primary'
                }`}
              >
                {r.id.includes('chicken') ? '🍗 Lean Protein Medley' : '🍳 Farm Egg Skillet'}
              </button>
            ))}
          </div>
        </div>

        {/* Highlight if user filtered by an urgent fridge item */}
        {selectedFilterIngredient && (
          <div className="mt-4 p-3 rounded-xl bg-biotech-rose/10 border border-biotech-rose/30 text-xs text-rose-300 flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-biotech-rose shrink-0" aria-hidden="true" />
            <span>
              Targeting urgent perishable: <strong>{selectedFilterIngredient}</strong>. This recipe actively prevents it from spoiling!
            </span>
          </div>
        )}
      </div>

      {/* Cuisine Style Switcher (Killer Feature #3) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-xs font-bold uppercase tracking-wider text-content-muted flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-kitchen-400" aria-hidden="true" />
            <span>Select Cuisine Morph (Dynamic Flavor Swap):</span>
          </label>
          <span className="text-[11px] text-kitchen-400 font-mono font-medium">
            {cuisineOptions.find((c) => c.key === activeStyle)?.tagline}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3" role="radiogroup" aria-label="Select Cuisine Morph">
          {cuisineOptions.map((style) => {
            const isSelected = activeStyle === style.key;
            return (
              <button
                key={style.key}
                role="radio"
                aria-checked={isSelected}
                onClick={() => setActiveStyle(style.key)}
                className={`min-h-[44px] p-3.5 rounded-2xl border text-left transition-all relative overflow-hidden group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kitchen-500 ${
                  isSelected
                    ? 'bg-gradient-to-b from-surface-800 to-surface-900 border-kitchen-500 shadow-lg shadow-kitchen-500/10 ring-1 ring-kitchen-500'
                    : 'bg-surface-900/70 border-surface-border hover:border-surface-700 hover:bg-surface-800/60'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl" aria-hidden="true">{style.flag}</span>
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-kitchen-400 animate-pulse" aria-hidden="true"></span>
                  )}
                </div>
                <div className={`text-xs font-extrabold ${isSelected ? 'text-content-primary' : 'text-content-secondary'}`}>
                  {style.name}
                </div>
                <div className="text-[10px] text-content-muted truncate mt-1">
                  {style.signatureAromatics.slice(0, 2).join(', ')}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Deduct Feedback Banner */}
      {deductFeedback && (
        <div className="p-4 rounded-2xl bg-kitchen-950/60 border border-kitchen-500/40 text-kitchen-200 animate-in fade-in slide-in-from-top-2" role="status" aria-live="polite">
          <div className="flex items-center space-x-2 font-bold text-sm text-kitchen-400 mb-1">
            <CheckCircle2 className="w-5 h-5 text-kitchen-400" aria-hidden="true" />
            <span>{deductFeedback[0]}</span>
          </div>
          <p className="text-xs text-content-secondary">{deductFeedback[1]}</p>
          <p className="text-xs text-kitchen-400 font-mono mt-0.5">{deductFeedback[2]}</p>
        </div>
      )}

      {/* Main Morphed Recipe Preview (Killer Feature #4) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Visual Dish Preview & Macros */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-surface-900/80 border border-surface-border rounded-2xl overflow-hidden backdrop-blur-sm shadow-xl">
            {/* AI Generated Realistic Dish Photo */}
            <div className="relative h-64 sm:h-72 w-full overflow-hidden group">
              <img
                src={morphedStyle.image}
                alt={`Plated ${morphedStyle.title} prepared in ${morphedStyle.styleName} style with signature aromatics`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 select-none"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface-950 via-surface-950/30 to-transparent" />
              
              {/* Badge Overlays */}
              <div className="absolute top-3 left-3 flex items-center space-x-2">
                <span className="px-2.5 py-1 rounded-full bg-surface-900/80 backdrop-blur-md text-xs font-bold text-content-primary border border-surface-700 flex items-center gap-1.5">
                  <span aria-hidden="true">{morphedStyle.flag}</span>
                  <span>{morphedStyle.styleName}</span>
                </span>
                <span className="px-2.5 py-1 rounded-full bg-kitchen-500/20 backdrop-blur-md text-[10px] font-bold text-kitchen-400 border border-kitchen-500/30">
                  AI Plating Preview
                </span>
              </div>

              <div className="absolute bottom-3 left-3 right-3">
                <h3 className="text-lg font-black text-white leading-tight drop-shadow-md">
                  {morphedStyle.title}
                </h3>
                <p className="text-xs text-content-secondary mt-0.5 line-clamp-1">{morphedStyle.tagline}</p>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="p-4 grid grid-cols-4 gap-2 text-center border-b border-surface-border bg-surface-950/50">
              <div>
                <span className="text-[10px] text-content-muted block font-medium">Calories</span>
                <span className="text-sm font-bold text-kitchen-400 font-mono">{activeRecipe.calories}</span>
              </div>
              <div>
                <span className="text-[10px] text-content-muted block font-medium">Protein</span>
                <span className="text-sm font-bold text-biotech-blue font-mono">{activeRecipe.macros.protein}g</span>
              </div>
              <div>
                <span className="text-[10px] text-content-muted block font-medium">Carbs</span>
                <span className="text-sm font-bold text-biotech-amber font-mono">{activeRecipe.macros.carbs}g</span>
              </div>
              <div>
                <span className="text-[10px] text-content-muted block font-medium">Fat</span>
                <span className="text-sm font-bold text-biotech-rose font-mono">{activeRecipe.macros.fat}g</span>
              </div>
            </div>

            {/* Flavor Intensity Radar */}
            <div className="p-4 space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-content-muted block">
                Morphed Flavor Profile:
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center justify-between bg-surface-950/60 p-2.5 rounded-xl border border-surface-border">
                  <span className="text-content-secondary">Spiciness</span>
                  <span className="font-mono text-kitchen-400 font-bold" aria-label={`Spiciness level ${morphedStyle.flavorProfile.spicy} of 3`}>
                    {'🌶️'.repeat(morphedStyle.flavorProfile.spicy) || 'Mild'}
                  </span>
                </div>
                <div className="flex items-center justify-between bg-surface-950/60 p-2.5 rounded-xl border border-surface-border">
                  <span className="text-content-secondary">Tang / Citrus</span>
                  <span className="font-mono text-biotech-amber font-bold" aria-label={`Tang level ${morphedStyle.flavorProfile.tangy} of 3`}>
                    {'🍋'.repeat(morphedStyle.flavorProfile.tangy)}
                  </span>
                </div>
                <div className="flex items-center justify-between bg-surface-950/60 p-2.5 rounded-xl border border-surface-border">
                  <span className="text-content-secondary">Savory Umami</span>
                  <span className="font-mono text-biotech-blue font-bold" aria-label={`Savory level ${morphedStyle.flavorProfile.savory} of 3`}>
                    {'★'.repeat(morphedStyle.flavorProfile.savory)}
                  </span>
                </div>
                <div className="flex items-center justify-between bg-surface-950/60 p-2.5 rounded-xl border border-surface-border">
                  <span className="text-content-secondary">Herb Aromatics</span>
                  <span className="font-mono text-biotech-purple font-bold" aria-label={`Aromatics level ${morphedStyle.flavorProfile.aromatic} of 3`}>
                    {'🌿'.repeat(morphedStyle.flavorProfile.aromatic)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="space-y-2.5">
            <button
              onClick={() => setIsCookModalOpen(true)}
              className="w-full min-h-[44px] flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-kitchen-500 hover:bg-kitchen-400 text-surface-950 font-black text-xs uppercase tracking-wider transition shadow-lg shadow-kitchen-500/25 active:scale-98 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kitchen-400"
            >
              <Play className="w-4 h-4 fill-current" aria-hidden="true" />
              <span>Start Guided Cooking Mode (Step Timers)</span>
            </button>

            <button
              onClick={handleTriggerCook}
              className="w-full min-h-[44px] flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl bg-surface-800 hover:bg-surface-750 text-content-primary font-bold text-xs border border-surface-700 transition active:scale-98 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kitchen-500"
            >
              <CheckCircle2 className="w-4 h-4 text-kitchen-400" aria-hidden="true" />
              <span>I Cooked This! (Auto-Deduct Fridge Stock)</span>
            </button>
          </div>
        </div>

        {/* Right: Ingredient Morphs, Pantry Stock Match & Step Guide */}
        <div className="lg:col-span-7 space-y-4">
          {/* Dynamic Flavor Swaps Card */}
          <div className="bg-surface-900/80 border border-surface-border rounded-2xl p-5 backdrop-blur-sm">
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-kitchen-400 mb-3">
              <Sparkles className="w-4 h-4" aria-hidden="true" />
              <span>Cuisine Morphing Swaps & Techniques</span>
            </div>

            <div className="space-y-2.5">
              {morphedStyle.swaps.map((swap, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-surface-950/60 border border-surface-border flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  <div>
                    <div className="flex items-center space-x-2 text-xs">
                      <span className="line-through text-content-muted">{swap.original}</span>
                      <ArrowRight className="w-3 h-3 text-kitchen-400" aria-hidden="true" />
                      <span className="font-bold text-kitchen-300">{swap.replacement}</span>
                    </div>
                    <p className="text-[11px] text-content-muted mt-0.5">{swap.reason}</p>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-kitchen-500/10 text-kitchen-400 border border-kitchen-500/30 self-start sm:self-center">
                    Chef Swap
                  </span>
                </div>
              ))}
            </div>

            {/* Accent Spices */}
            <div className="mt-4 pt-3 border-t border-surface-border flex flex-wrap items-center gap-2">
              <span className="text-xs text-content-muted font-semibold">Accent Spices Needed:</span>
              {morphedStyle.accentSpices.map((spice, idx) => (
                <span
                  key={idx}
                  className="text-xs px-2.5 py-1 rounded-lg bg-surface-800 text-content-secondary border border-surface-700/80 font-medium"
                >
                  🧂 {spice}
                </span>
              ))}
            </div>
          </div>

          {/* Virtual Fridge Stock Verification */}
          <div className="bg-surface-900/80 border border-surface-border rounded-2xl p-5 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-content-muted flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-kitchen-400" aria-hidden="true" />
                <span>Pantry Stock Status (Auto-Deduction Ready):</span>
              </span>
              <span className="text-[10px] text-content-muted font-mono">
                {activeRecipe.prepTimeMinutes + activeRecipe.cookTimeMinutes} mins total
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {activeRecipe.basePantryRequirements.map((req, idx) => {
                const inFridge = checkFridgeStatus(req.name);
                return (
                  <div
                    key={idx}
                    className={`p-2.5 rounded-xl border flex items-center justify-between text-xs ${
                      inFridge
                        ? 'bg-surface-950/70 border-kitchen-500/30 text-content-secondary'
                        : 'bg-biotech-rose/10 border-biotech-rose/30 text-rose-300'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <span aria-hidden="true">{inFridge ? '✅' : '⚠️'}</span>
                      <span className="font-semibold">{req.name}</span>
                    </div>
                    <span className="font-mono text-[11px] text-content-muted">
                      {req.amount} {req.unit}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Cooking Steps Summary */}
          <div className="bg-surface-900/80 border border-surface-border rounded-2xl p-5 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-content-muted flex items-center gap-1.5">
                <ChefHat className="w-4 h-4 text-kitchen-400" aria-hidden="true" />
                <span>Morph Recipe Execution ({morphedStyle.steps.length} Steps):</span>
              </span>
            </div>

            <div className="space-y-2">
              {morphedStyle.steps.map((step, idx) => (
                <div
                  key={idx}
                  className="flex items-start space-x-3 text-xs p-2.5 rounded-xl bg-surface-950/40 border border-surface-border"
                >
                  <span className="w-5 h-5 rounded-full bg-kitchen-500/20 text-kitchen-400 font-mono font-bold flex items-center justify-center shrink-0 text-[10px]">
                    {idx + 1}
                  </span>
                  <p className="text-content-secondary leading-relaxed">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Cooking Mode Modal */}
      <CookingModeModal
        isOpen={isCookModalOpen}
        recipe={activeRecipe}
        selectedStyle={activeStyle}
        onClose={() => setIsCookModalOpen(false)}
        onFinishCook={() => {
          setIsCookModalOpen(false);
          handleTriggerCook();
        }}
      />
    </div>
  );
};

