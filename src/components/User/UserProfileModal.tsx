import React, { useState } from 'react';
import { 
  X, 
  Database, 
  CheckCircle2, 
  User, 
  Mail, 
  Target, 
  Dumbbell, 
  Watch, 
  Flame, 
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { UserProfile, FitnessGoal, DietaryPreference } from '../../types';

interface UserProfileModalProps {
  isOpen: boolean;
  user: UserProfile;
  onClose: () => void;
  onSave: (updated: UserProfile) => Promise<void>;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  user,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [fitnessGoal, setFitnessGoal] = useState<FitnessGoal>(user.fitnessGoal);
  const [dietaryPreference, setDietaryPreference] = useState<DietaryPreference>(user.dietaryPreference);
  const [dailyCalorieGoal, setDailyCalorieGoal] = useState<number>(user.dailyCalorieGoal);
  const [targetProteinGrams, setTargetProteinGrams] = useState<number>(user.targetProteinGrams);
  const [targetCarbsGrams, setTargetCarbsGrams] = useState<number>(user.targetCarbsGrams);
  const [targetFatGrams, setTargetFatGrams] = useState<number>(user.targetFatGrams);
  const [connectedWearable, setConnectedWearable] = useState(user.connectedWearable);

  const [isSaving, setIsSaving] = useState(false);
  const [saveFeedback, setSaveFeedback] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveFeedback(null);

    const updatedProfile: UserProfile = {
      ...user,
      name: name.trim(),
      email: email.trim(),
      fitnessGoal,
      dietaryPreference,
      dailyCalorieGoal: Number(dailyCalorieGoal),
      targetProteinGrams: Number(targetProteinGrams),
      targetCarbsGrams: Number(targetCarbsGrams),
      targetFatGrams: Number(targetFatGrams),
      connectedWearable,
      updatedAt: new Date().toISOString(),
    };

    try {
      await onSave(updatedProfile);
      setSaveFeedback('Profile successfully written & synchronized to the persistent database!');
      setTimeout(() => {
        setSaveFeedback(null);
      }, 4000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const goalOptions: { value: FitnessGoal; label: string; desc: string }[] = [
    { value: 'muscle_hypertrophy', label: 'Muscle Hypertrophy & Strength', desc: 'Caloric surplus with 1.0g+ protein/lb' },
    { value: 'fat_loss_cutting', label: 'Lean Fat Loss & Definition', desc: 'Moderate caloric deficit with high satiety' },
    { value: 'metabolic_longevity', label: 'Metabolic Longevity & Health', desc: 'Anti-inflammatory and balanced insulin profile' },
    { value: 'athletic_performance', label: 'Athletic Performance & Glycogen', desc: 'High carb replenishment & fast recovery' },
  ];

  const dietOptions: { value: DietaryPreference; label: string }[] = [
    { value: 'high_protein_athletic', label: '🥩 High-Protein Athletic (Default)' },
    { value: 'mediterranean', label: '🇬🇷 Mediterranean Clean Whole Foods' },
    { value: 'keto_low_carb', label: '🥑 Ketogenic / Low Carb High Fat' },
    { value: 'plant_based', label: '🌱 High-Protein Plant-Based' },
    { value: 'gluten_free_clean', label: '🌾 Gluten-Free & Gut-Friendly' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-3xl shadow-2xl p-6 sm:p-8 flex flex-col max-h-[90vh] overflow-hidden">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-2xl shadow-lg shadow-emerald-500/20">
              {user.avatar || '👨‍🍳'}
            </div>
            <div>
              <div className="flex items-center space-x-2 text-xs text-emerald-400 font-bold uppercase tracking-wider">
                <Database className="w-3.5 h-3.5" />
                <span>Persistent User Profile</span>
              </div>
              <h3 className="text-xl font-black text-white mt-0.5">Account & Nutrition Settings</h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Database Sync Status Badge */}
        <div className="mt-4 p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-300 font-medium">Database Persistence:</span>
            <span className="text-emerald-400 font-mono font-semibold">Active (server/db/database.json)</span>
          </div>
          <span className="text-[11px] text-slate-500 font-mono">User ID: {user.id}</span>
        </div>

        {/* Feedback Alert */}
        {saveFeedback && (
          <div className="mt-3 p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center space-x-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{saveFeedback}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-4 flex-1 overflow-y-auto pr-2 space-y-5">
          {/* Personal Information */}
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-emerald-400" />
              <span>Personal Information</span>
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Fitness & Body Goal */}
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2 flex items-center gap-1.5">
              <Dumbbell className="w-3.5 h-3.5 text-sky-400" />
              <span>Fitness & Body Goal</span>
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {goalOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setFitnessGoal(opt.value)}
                  className={`p-3 rounded-xl border text-left transition ${
                    fitnessGoal === opt.value
                      ? 'bg-sky-500/10 border-sky-400 ring-1 ring-sky-500/30'
                      : 'bg-slate-950/50 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="text-xs font-bold text-white">{opt.label}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Dietary Preferences */}
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Dietary Protocol</span>
            </span>

            <select
              value={dietaryPreference}
              onChange={(e) => setDietaryPreference(e.target.value as DietaryPreference)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-emerald-500"
            >
              {dietOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Daily Calorie & Macro Overrides */}
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2 flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-rose-400" />
              <span>Daily Calorie & Macro Targets</span>
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800">
                <label className="text-[10px] text-slate-400 font-semibold block">Calories</label>
                <div className="flex items-center space-x-1 mt-1">
                  <input
                    type="number"
                    min="1200"
                    max="6000"
                    value={dailyCalorieGoal}
                    onChange={(e) => setDailyCalorieGoal(Number(e.target.value))}
                    className="w-full bg-transparent text-sm font-bold text-white font-mono focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-500">kcal</span>
                </div>
              </div>

              <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800">
                <label className="text-[10px] text-sky-400 font-semibold block">Protein</label>
                <div className="flex items-center space-x-1 mt-1">
                  <input
                    type="number"
                    min="50"
                    max="400"
                    value={targetProteinGrams}
                    onChange={(e) => setTargetProteinGrams(Number(e.target.value))}
                    className="w-full bg-transparent text-sm font-bold text-sky-300 font-mono focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-500">g</span>
                </div>
              </div>

              <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800">
                <label className="text-[10px] text-amber-400 font-semibold block">Carbs</label>
                <div className="flex items-center space-x-1 mt-1">
                  <input
                    type="number"
                    min="20"
                    max="600"
                    value={targetCarbsGrams}
                    onChange={(e) => setTargetCarbsGrams(Number(e.target.value))}
                    className="w-full bg-transparent text-sm font-bold text-amber-300 font-mono focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-500">g</span>
                </div>
              </div>

              <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800">
                <label className="text-[10px] text-rose-400 font-semibold block">Fats</label>
                <div className="flex items-center space-x-1 mt-1">
                  <input
                    type="number"
                    min="20"
                    max="250"
                    value={targetFatGrams}
                    onChange={(e) => setTargetFatGrams(Number(e.target.value))}
                    className="w-full bg-transparent text-sm font-bold text-rose-300 font-mono focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-500">g</span>
                </div>
              </div>
            </div>
          </div>

          {/* Connected Wearable */}
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2 flex items-center gap-1.5">
              <Watch className="w-3.5 h-3.5 text-purple-400" />
              <span>Connected Bio-Telemetry Device</span>
            </span>

            <select
              value={connectedWearable}
              onChange={(e) => setConnectedWearable(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-emerald-500"
            >
              <option value="Apple Watch Ultra 2">Apple Watch Ultra 2 (Apple HealthKit)</option>
              <option value="Garmin Epix Pro">Garmin Epix Pro / Fenix 7 (Garmin Connect)</option>
              <option value="Whoop 4.0">Whoop 4.0 (Strap Recovery & Strain API)</option>
              <option value="Oura Ring Gen 4">Oura Ring Gen 4 (Sleep & HRV)</option>
            </select>
          </div>

          {/* Action Footer */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <span className="text-[11px] text-slate-500 font-mono">
              Last saved: {new Date(user.updatedAt).toLocaleDateString()}
            </span>

            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white transition"
              >
                Close
              </button>

              <button
                type="submit"
                disabled={isSaving}
                className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs uppercase tracking-wider transition shadow-lg shadow-emerald-500/25 active:scale-95 disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Saving to Database...</span>
                  </>
                ) : (
                  <>
                    <Database className="w-4 h-4" />
                    <span>Save to Database</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

