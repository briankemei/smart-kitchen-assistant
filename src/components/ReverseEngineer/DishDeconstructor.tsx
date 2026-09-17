import React, { useState } from 'react';
import { 
  Split, 
  Sparkles, 
  Flame, 
  ArrowRight, 
  ShieldCheck, 
  AlertTriangle, 
  Clock, 
  UploadCloud, 
  CheckCircle2,
  ChefHat
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { SocialReverseMeal, PantryItem, DailyLogItem } from '../../types';
import { sampleReverseMeals } from '../../data/socialReverseMeals';

interface DishDeconstructorProps {
  pantryItems: PantryItem[];
  onCookHealthified: (meal: SocialReverseMeal) => void;
}

export const DishDeconstructor: React.FC<DishDeconstructorProps> = ({
  pantryItems,
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
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-purple-400">
              <Split className="w-4 h-4" />
              <span>Social Media & Restaurant Meal Reverse-Engineering</span>
            </div>
            <h2 className="text-2xl font-black text-white mt-1">Recipe Reverse-Engineering for Calories</h2>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Saw a drool-worthy dish on Instagram or TikTok? Upload the photo. The AI identifies hidden restaurant calorie traps (heavy creams, excess oils, bleached starches) and automatically reconstructs a lean, "Healthified" version powered by what's in your fridge.
            </p>
          </div>

          {/* Social Sample Presets */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-400 hidden sm:inline">Try Viral Dishes:</span>
            {sampleReverseMeals.map((item, idx) => (
              <button
                key={item.id}
                onClick={() => handleSelectSample(item)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                  selectedMeal.id === item.id && !uploadedUrl
                    ? 'bg-purple-500/20 border-purple-400 text-purple-300'
                    : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:text-white'
                }`}
              >
                {item.source}: #{idx + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Upload Custom Screenshot */}
        <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between">
          <label className="cursor-pointer flex items-center space-x-2 px-4 py-2 rounded-xl bg-purple-950/40 hover:bg-purple-900/40 text-purple-300 text-xs font-bold border border-purple-500/30 transition">
            <UploadCloud className="w-4 h-4" />
            <span>Upload Instagram / Restaurant Screenshot</span>
            <input type="file" accept="image/*" onChange={handleCustomUpload} className="hidden" />
          </label>
          <span className="text-[11px] text-slate-500 font-mono">
            Supported: Screenshots, Instagram Reels, TikTok food photos
          </span>
        </div>

        {/* Success Toast */}
        {successToast && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center space-x-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successToast}</span>
          </div>
        )}
      </div>

      {/* Side-by-Side Comparison: Before vs Healthified After */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        {/* LEFT: The Calorie Bomb Original */}
        <div className="bg-slate-900/80 border border-rose-500/30 rounded-3xl p-6 backdrop-blur-sm shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-bold border border-rose-500/30 uppercase tracking-wider">
                  Original Restaurant / Viral Post
                </span>
                <span className="text-xs text-slate-400">via {selectedMeal.source}</span>
              </div>
              <span className="text-rose-400 text-xs font-bold flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                Calorie Trap
              </span>
            </div>

            {/* Original Image */}
            <div className="relative h-56 w-full rounded-2xl overflow-hidden mt-4 bg-slate-950">
              <img
                src={uploadedUrl || selectedMeal.originalImage}
                alt={selectedMeal.dishName}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 right-3">
                <h4 className="text-base font-bold text-white leading-tight drop-shadow-md">
                  {selectedMeal.dishName}
                </h4>
              </div>
            </div>

            {/* Original Calorie Badge */}
            <div className="my-4 p-4 rounded-2xl bg-rose-950/30 border border-rose-500/20 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-rose-300 font-semibold uppercase tracking-wider block">
                  Estimated Restaurant Calories
                </span>
                <div className="flex items-baseline space-x-1.5 mt-0.5">
                  <span className="text-3xl font-extrabold text-white font-mono">
                    {selectedMeal.originalCalories}
                  </span>
                  <span className="text-xs text-rose-400 font-bold font-mono">kcal</span>
                </div>
              </div>

              <div className="text-right text-xs font-mono text-slate-300">
                <div>Carbs: <span className="text-white font-bold">{selectedMeal.originalMacros.carbs}g</span></div>
                <div>Fat: <span className="text-rose-400 font-bold">{selectedMeal.originalMacros.fat}g</span></div>
                <div>Protein: <span className="text-slate-400">{selectedMeal.originalMacros.protein}g</span></div>
              </div>
            </div>

            {/* Deconstructed Heavy Culprits */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                Hidden Restaurant Calorie Traps Exposed:
              </span>
              {selectedMeal.heavyCulprits.map((culprit, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs flex items-start justify-between gap-2"
                >
                  <div>
                    <span className="font-semibold text-rose-300">{culprit.ingredient}</span>
                    <p className="text-[11px] text-slate-400 mt-0.5">{culprit.issue}</p>
                  </div>
                  <span className="font-mono font-bold text-rose-400 text-xs shrink-0">
                    {culprit.calorieLoad}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-3 border-t border-slate-800 text-center text-xs text-slate-400">
            High inflammatory seed oils & hidden fats typical of dining out.
          </div>
        </div>

        {/* RIGHT: KitchenSync Healthified Fridge Remix */}
        <div className="bg-slate-900/80 border border-emerald-500/40 rounded-3xl p-6 backdrop-blur-sm shadow-xl flex flex-col justify-between relative overflow-hidden">
          {/* Subtle green ambient glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-3xl rounded-full pointer-events-none" />

          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30 uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-emerald-400" />
                  <span>KitchenSync AI Remix</span>
                </span>
              </div>
              <span className="text-emerald-400 text-xs font-black font-mono">
                🔥 -{selectedMeal.healthifiedVersion.caloriesSavedPercent}% Calorie Reduction!
              </span>
            </div>

            {/* Healthified Image */}
            <div className="relative h-56 w-full rounded-2xl overflow-hidden mt-4 bg-slate-950 border border-emerald-500/20">
              <img
                src={selectedMeal.healthifiedVersion.remixImage}
                alt={selectedMeal.healthifiedVersion.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 right-3">
                <h4 className="text-base font-bold text-white leading-tight drop-shadow-md">
                  {selectedMeal.healthifiedVersion.title}
                </h4>
              </div>
            </div>

            {/* Healthified Calorie Banner */}
            <div className="my-4 p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-emerald-300 font-semibold uppercase tracking-wider block">
                  Healthified Calorie Load
                </span>
                <div className="flex items-baseline space-x-1.5 mt-0.5">
                  <span className="text-3xl font-extrabold text-white font-mono">
                    {selectedMeal.healthifiedVersion.calories}
                  </span>
                  <span className="text-xs text-emerald-400 font-bold font-mono">kcal</span>
                </div>
              </div>

              <div className="text-right text-xs font-mono text-slate-300">
                <div className="text-emerald-400 font-bold">Protein: {selectedMeal.healthifiedVersion.macros.protein}g</div>
                <div>Carbs: <span className="text-white font-bold">{selectedMeal.healthifiedVersion.macros.carbs}g</span></div>
                <div>Fat: <span className="text-white font-bold">{selectedMeal.healthifiedVersion.macros.fat}g</span></div>
              </div>
            </div>

            {/* Ingredient Swaps & Fridge Matching */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                Healthified Ingredient Swaps (From Your Virtual Fridge):
              </span>
              {selectedMeal.healthifiedVersion.swaps.map((swap, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs flex items-center justify-between gap-2"
                >
                  <div className="min-w-0">
                    <div className="flex items-center space-x-1 text-slate-400 text-[11px]">
                      <span className="line-through truncate">{swap.restaurantItem}</span>
                      <span>→</span>
                      <span className="font-bold text-emerald-300 truncate">{swap.fridgeSub}</span>
                    </div>
                  </div>
                  <span className="font-mono font-bold text-emerald-400 text-xs shrink-0">
                    {swap.calorieSavings}
                  </span>
                </div>
              ))}
            </div>

            {/* Matches in Fridge */}
            <div className="mt-4 pt-3 border-t border-slate-800">
              <span className="text-[11px] font-semibold text-slate-400 block mb-1">
                Ingredients Ready in Your Virtual Fridge:
              </span>
              <div className="flex flex-wrap gap-1">
                {selectedMeal.healthifiedVersion.fridgeMatches.map((m, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-200 border border-slate-700/80 font-medium"
                  >
                    ✅ {m}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Action CTA */}
          <div className="mt-6 pt-4 border-t border-slate-800">
            <button
              onClick={handleCook}
              className="w-full flex items-center justify-center space-x-2 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-emerald-500 hover:from-purple-400 hover:to-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider transition shadow-lg shadow-emerald-500/20 active:scale-98"
            >
              <ChefHat className="w-4 h-4" />
              <span>Cook Healthified Version & Deduct Fridge Stock</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

