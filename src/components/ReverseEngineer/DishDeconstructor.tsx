import React, { useState } from 'react';
import { 
  Split, 
  Sparkles, 
  AlertTriangle, 
  UploadCloud, 
  CheckCircle2,
  ChefHat
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { SocialReverseMeal, PantryItem } from '../../types';
import { sampleReverseMeals } from '../../data/socialReverseMeals';

interface DishDeconstructorProps {
  pantryItems?: PantryItem[];
  onCookHealthified: (meal: SocialReverseMeal) => void;
}

export const DishDeconstructor: React.FC<DishDeconstructorProps> = ({
  pantryItems: _pantryItems,
  onCookHealthified,
}) => {
  const [selectedMeal, setSelectedMeal] = useState<SocialReverseMeal>(sampleReverseMeals[0]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const handleSelectSample = (meal: SocialReverseMeal) => {
    setSelectedMeal(meal);
    setUploadedUrl(null);
    setIsAnalyzing(true);
    setTimeout(() => setIsAnalyzing(false), 900);
  };

  const handleCustomUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setUploadedUrl(reader.result as string);
        setIsAnalyzing(true);
        setTimeout(() => setIsAnalyzing(false), 1200);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCook = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
    onCookHealthified(selectedMeal);
    setSuccessToast(`Healthified recipe added to diary & fridge ingredients deducted!`);
    setTimeout(() => setSuccessToast(null), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-surface-900/80 border border-surface-border rounded-2xl p-6 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-biotech-purple">
              <Split className="w-4 h-4" aria-hidden="true" />
              <span>Social Media & Restaurant Meal Reverse-Engineering</span>
            </div>
            <h2 className="text-2xl font-black text-content-primary mt-1">Recipe Reverse-Engineering for Calories</h2>
            <p className="text-xs text-content-muted mt-1 max-w-2xl">
              Saw a drool-worthy dish on Instagram or TikTok? Upload the photo. The AI identifies hidden restaurant calorie traps (heavy creams, excess oils, bleached starches) and automatically reconstructs a lean, "Healthified" version powered by what's in your fridge.
            </p>
          </div>

          {/* Social Sample Presets */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-content-muted hidden sm:inline font-medium">Try Viral Dishes:</span>
            {sampleReverseMeals.map((item, idx) => (
              <button
                key={item.id}
                onClick={() => handleSelectSample(item)}
                className={`min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-semibold border transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-biotech-purple ${
                  selectedMeal.id === item.id && !uploadedUrl
                    ? 'bg-biotech-purple/20 border-biotech-purple text-purple-300 font-bold'
                    : 'bg-surface-800/80 border-surface-700 text-content-secondary hover:text-content-primary'
                }`}
              >
                {item.source}: #{idx + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Upload Custom Screenshot */}
        <div className="mt-5 pt-4 border-t border-surface-border flex flex-wrap items-center justify-between gap-3">
          <label 
            htmlFor="reverse-dish-upload"
            className="cursor-pointer min-h-[44px] flex items-center space-x-2 px-4 py-2 rounded-xl bg-biotech-purple/15 hover:bg-biotech-purple/25 text-purple-300 text-xs font-bold border border-biotech-purple/30 transition focus-within:ring-2 focus-within:ring-biotech-purple"
          >
            <UploadCloud className="w-4 h-4 text-biotech-purple" aria-hidden="true" />
            <span>Upload Instagram / Restaurant Screenshot</span>
            <input 
              id="reverse-dish-upload"
              type="file" 
              accept="image/*" 
              onChange={handleCustomUpload} 
              className="sr-only" 
              aria-label="Upload Instagram or restaurant screenshot"
            />
          </label>
          <span className="text-[11px] text-content-muted font-mono">
            Supported: Screenshots, Instagram Reels, TikTok food photos
          </span>
        </div>

        {/* Success Toast */}
        {successToast && (
          <div className="mt-4 p-3 rounded-xl bg-kitchen-950/60 border border-kitchen-500/40 text-kitchen-300 text-xs flex items-center space-x-2 animate-in fade-in" role="status" aria-live="polite">
            <CheckCircle2 className="w-4 h-4 text-kitchen-400 shrink-0" aria-hidden="true" />
            <span>{successToast}</span>
          </div>
        )}
      </div>

      {/* Side-by-Side Comparison: Before vs Healthified After */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        {/* LEFT: The Calorie Bomb Original */}
        <div className="bg-surface-900/80 border border-biotech-rose/30 rounded-3xl p-6 backdrop-blur-sm shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-surface-border">
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 rounded-full bg-biotech-rose/20 text-rose-300 text-[10px] font-bold border border-biotech-rose/30 uppercase tracking-wider">
                  Original Restaurant / Viral Post
                </span>
                <span className="text-xs text-content-muted">via {selectedMeal.source}</span>
              </div>
              <span className="text-biotech-rose text-xs font-bold flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" aria-hidden="true" />
                Calorie Trap
              </span>
            </div>

            {/* Original Image */}
            <div className="relative h-56 w-full rounded-2xl overflow-hidden mt-4 bg-surface-950 border border-surface-border">
              <img
                src={uploadedUrl || selectedMeal.originalImage}
                alt={`Original restaurant photo of ${selectedMeal.dishName} from ${selectedMeal.source}`}
                className="w-full h-full object-cover select-none"
              />
              {isAnalyzing && (
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-biotech-purple to-transparent shadow-[0_0_15px_#a855f7] animate-radar pointer-events-none" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-surface-950 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 right-3">
                <h4 className="text-base font-bold text-content-primary leading-tight drop-shadow-md">
                  {selectedMeal.dishName}
                </h4>
              </div>
            </div>

            {/* Original Calorie Badge */}
            <div className="my-4 p-4 rounded-2xl bg-biotech-rose/10 border border-biotech-rose/20 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-rose-300 font-semibold uppercase tracking-wider block">
                  Estimated Restaurant Calories
                </span>
                <div className="flex items-baseline space-x-1.5 mt-0.5">
                  <span className="text-3xl font-extrabold text-content-primary font-mono">
                    {selectedMeal.originalCalories}
                  </span>
                  <span className="text-xs text-biotech-rose font-bold font-mono">kcal</span>
                </div>
              </div>

              <div className="text-right text-xs font-mono text-content-secondary">
                <div>Carbs: <span className="text-content-primary font-bold">{selectedMeal.originalMacros.carbs}g</span></div>
                <div>Fat: <span className="text-biotech-rose font-bold">{selectedMeal.originalMacros.fat}g</span></div>
                <div>Protein: <span className="text-content-muted">{selectedMeal.originalMacros.protein}g</span></div>
              </div>
            </div>

            {/* Deconstructed Heavy Culprits */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-content-muted block">
                Hidden Restaurant Calorie Traps Exposed:
              </span>
              {selectedMeal.heavyCulprits.map((culprit, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl bg-surface-950/60 border border-surface-border text-xs flex items-start justify-between gap-2"
                >
                  <div>
                    <span className="font-semibold text-rose-300">{culprit.ingredient}</span>
                    <p className="text-[11px] text-content-muted mt-0.5">{culprit.issue}</p>
                  </div>
                  <span className="font-mono font-bold text-biotech-rose text-xs shrink-0">
                    {culprit.calorieLoad}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-3 border-t border-surface-border text-center text-xs text-content-muted">
            High inflammatory seed oils & hidden fats typical of dining out.
          </div>
        </div>

        {/* RIGHT: KitchenSync Healthified Fridge Remix */}
        <div className="bg-surface-900/80 border border-kitchen-500/40 rounded-3xl p-6 backdrop-blur-sm shadow-xl flex flex-col justify-between relative overflow-hidden">
          {/* Subtle green ambient glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-kitchen-500/10 blur-3xl rounded-full pointer-events-none" />

          <div>
            <div className="flex items-center justify-between pb-3 border-b border-surface-border">
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 rounded-full bg-kitchen-500/20 text-kitchen-300 text-[10px] font-bold border border-kitchen-500/30 uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-kitchen-400" aria-hidden="true" />
                  <span>KitchenSync AI Remix</span>
                </span>
              </div>
              <span className="text-kitchen-400 text-xs font-black font-mono">
                🔥 -{selectedMeal.healthifiedVersion.caloriesSavedPercent}% Calorie Reduction!
              </span>
            </div>

            {/* Healthified Image */}
            <div className="relative h-56 w-full rounded-2xl overflow-hidden mt-4 bg-surface-950 border border-kitchen-500/30">
              <img
                src={selectedMeal.healthifiedVersion.remixImage}
                alt={`KitchenSync AI healthified remake: ${selectedMeal.healthifiedVersion.title}`}
                className="w-full h-full object-cover select-none"
              />
              {isAnalyzing && (
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-kitchen-400 to-transparent shadow-[0_0_15px_#10b981] animate-radar pointer-events-none" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-surface-950 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 right-3">
                <h4 className="text-base font-bold text-content-primary leading-tight drop-shadow-md">
                  {selectedMeal.healthifiedVersion.title}
                </h4>
              </div>
            </div>

            {/* Healthified Calorie Banner */}
            <div className="my-4 p-4 rounded-2xl bg-kitchen-950/40 border border-kitchen-500/40 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-kitchen-300 font-semibold uppercase tracking-wider block">
                  Healthified Calorie Load
                </span>
                <div className="flex items-baseline space-x-1.5 mt-0.5">
                  <span className="text-3xl font-extrabold text-content-primary font-mono">
                    {selectedMeal.healthifiedVersion.calories}
                  </span>
                  <span className="text-xs text-kitchen-400 font-bold font-mono">kcal</span>
                </div>
              </div>

              <div className="text-right text-xs font-mono text-content-secondary">
                <div className="text-kitchen-400 font-bold">Protein: {selectedMeal.healthifiedVersion.macros.protein}g</div>
                <div>Carbs: <span className="text-content-primary font-bold">{selectedMeal.healthifiedVersion.macros.carbs}g</span></div>
                <div>Fat: <span className="text-content-primary font-bold">{selectedMeal.healthifiedVersion.macros.fat}g</span></div>
              </div>
            </div>

            {/* Ingredient Swaps & Fridge Matching */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-content-muted block">
                Healthified Ingredient Swaps (From Your Virtual Fridge):
              </span>
              {selectedMeal.healthifiedVersion.swaps.map((swap, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl bg-surface-950/60 border border-surface-border text-xs flex items-center justify-between gap-2"
                >
                  <div className="min-w-0">
                    <div className="flex items-center space-x-1 text-content-muted text-[11px]">
                      <span className="line-through truncate">{swap.restaurantItem}</span>
                      <span aria-hidden="true">→</span>
                      <span className="font-bold text-kitchen-300 truncate">{swap.fridgeSub}</span>
                    </div>
                  </div>
                  <span className="font-mono font-bold text-kitchen-400 text-xs shrink-0">
                    {swap.calorieSavings}
                  </span>
                </div>
              ))}
            </div>

            {/* Matches in Fridge */}
            <div className="mt-4 pt-3 border-t border-surface-border">
              <span className="text-[11px] font-semibold text-content-muted block mb-1">
                Ingredients Ready in Your Virtual Fridge:
              </span>
              <div className="flex flex-wrap gap-1">
                {selectedMeal.healthifiedVersion.fridgeMatches.map((m, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] px-2 py-0.5 rounded-md bg-surface-800 text-content-secondary border border-surface-700/80 font-medium"
                  >
                    ✅ {m}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Action CTA */}
          <div className="mt-6 pt-4 border-t border-surface-border">
            <button
              onClick={handleCook}
              className="w-full min-h-[44px] flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-kitchen-500 hover:bg-kitchen-400 text-surface-950 font-black text-xs uppercase tracking-wider transition shadow-lg shadow-kitchen-500/20 active:scale-98 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kitchen-400"
            >
              <ChefHat className="w-4 h-4" aria-hidden="true" />
              <span>Cook Healthified Version & Deduct Fridge Stock</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


