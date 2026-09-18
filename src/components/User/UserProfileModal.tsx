import React, { useState } from 'react';
import { 
  X, 
  Database, 
  CheckCircle2, 
  User, 
  Mail, 
  Dumbbell, 
  Watch, 
  Flame, 
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { UserProfile, FitnessGoal, DietaryPreference } from '../../types';
import { useFocusTrap } from '../../hooks/useFocusTrap';

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
  const modalRef = useFocusTrap(isOpen, onClose);
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
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface-950/90 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="profile-modal-title"
    >
      <div 
        ref={modalRef}
        className="bg-surface-900 border border-surface-border w-full max-w-2xl rounded-3xl shadow-2xl p-6 sm:p-8 flex flex-col max-h-[90vh] overflow-hidden"
      >
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-surface-border">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-kitchen-500 text-surface-950 flex items-center justify-center text-2xl shadow-lg shadow-kitchen-500/20" aria-hidden="true">
              {user.avatar || '👨‍🍳'}
            </div>
            <div>
              <div className="flex items-center space-x-2 text-xs text-kitchen-400 font-bold uppercase tracking-wider">
                <Database className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Persistent User Profile</span>
              </div>
              <h3 id="profile-modal-title" className="text-xl font-black text-content-primary mt-0.5">Account & Nutrition Settings</h3>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close user profile"
            className="min-w-[44px] min-h-[44px] flex items-center justify-center text-content-muted hover:text-content-primary rounded-xl hover:bg-surface-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kitchen-500 transition"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Database Sync Status Badge */}
        <div className="mt-4 p-3 rounded-xl bg-surface-950/80 border border-surface-border flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-kitchen-400 animate-pulse" aria-hidden="true" />
            <span className="text-content-secondary font-medium">Database Persistence:</span>
            <span className="text-kitchen-400 font-mono font-semibold">Active (server/db/database.json)</span>
          </div>
          <span className="text-[11px] text-content-muted font-mono">User ID: {user.id}</span>
        </div>

        {/* Feedback Alert */}
        {saveFeedback && (
          <div className="mt-3 p-3 rounded-xl bg-kitchen-950/60 border border-kitchen-500/40 text-kitchen-300 text-xs flex items-center space-x-2 animate-in fade-in" role="status" aria-live="polite">
            <CheckCircle2 className="w-4 h-4 text-kitchen-400 shrink-0" aria-hidden="true" />
            <span>{saveFeedback}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-4 flex-1 overflow-y-auto pr-2 space-y-5">
          {/* Personal Information */}
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-content-muted block mb-2 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-kitchen-400" aria-hidden="true" />
              <span>Personal Information</span>
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="profile-full-name" className="block text-xs font-semibold text-content-secondary mb-1">Full Name</label>
                <input
                  id="profile-full-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 min-h-[44px] rounded-xl bg-surface-950 border border-surface-border text-content-primary text-sm focus:outline-none focus:border-kitchen-500 focus:ring-1 focus:ring-kitchen-500"
                />
              </div>

              <div>
                <label htmlFor="profile-email-address" className="block text-xs font-semibold text-content-secondary mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-content-muted absolute left-3 top-1/2 -translate-y-1/2" aria-hidden="true" />
                  <input
                    id="profile-email-address"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 min-h-[44px] rounded-xl bg-surface-950 border border-surface-border text-content-primary text-sm focus:outline-none focus:border-kitchen-500 font-mono focus:ring-1 focus:ring-kitchen-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Fitness & Body Goal */}
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-content-muted block mb-2 flex items-center gap-1.5">
              <Dumbbell className="w-3.5 h-3.5 text-biotech-blue" aria-hidden="true" />
              <span>Fitness & Body Goal</span>
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2" role="radiogroup" aria-label="Fitness & Body Goal">
              {goalOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  role="radio"
                  aria-checked={fitnessGoal === opt.value}
                  onClick={() => setFitnessGoal(opt.value)}
                  className={`min-h-[44px] p-3 rounded-xl border text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-biotech-blue ${
                    fitnessGoal === opt.value
                      ? 'bg-biotech-blue/15 border-biotech-blue ring-1 ring-biotech-blue/30'
                      : 'bg-surface-950/50 border-surface-border hover:border-surface-700'
                  }`}
                >
                  <div className="text-xs font-bold text-content-primary">{opt.label}</div>
                  <div className="text-[11px] text-content-muted mt-0.5">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Dietary Preferences */}
          <div>
            <label htmlFor="profile-diet-select" className="text-xs font-bold uppercase tracking-wider text-content-muted block mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-biotech-amber" aria-hidden="true" />
              <span>Dietary Protocol</span>
            </label>

            <select
              id="profile-diet-select"
              value={dietaryPreference}
              onChange={(e) => setDietaryPreference(e.target.value as DietaryPreference)}
              className="w-full px-3.5 py-2.5 min-h-[44px] rounded-xl bg-surface-950 border border-surface-border text-content-primary text-sm focus:outline-none focus:border-kitchen-500 focus:ring-1 focus:ring-kitchen-500"
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
            <span className="text-xs font-bold uppercase tracking-wider text-content-muted block mb-2 flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-biotech-rose" aria-hidden="true" />
              <span>Daily Calorie & Macro Targets</span>
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="bg-surface-950/70 p-2.5 rounded-xl border border-surface-border">
                <label htmlFor="profile-calorie-target" className="text-[10px] text-content-muted font-semibold block">Calories</label>
                <div className="flex items-center space-x-1 mt-1">
                  <input
                    id="profile-calorie-target"
                    type="number"
                    min="1200"
                    max="6000"
                    value={dailyCalorieGoal}
                    onChange={(e) => setDailyCalorieGoal(Number(e.target.value))}
                    className="w-full bg-transparent text-sm font-bold text-content-primary font-mono focus:outline-none min-h-[32px]"
                  />
                  <span className="text-[10px] text-content-muted">kcal</span>
                </div>
              </div>

              <div className="bg-surface-950/70 p-2.5 rounded-xl border border-surface-border">
                <label htmlFor="profile-protein-target" className="text-[10px] text-biotech-blue font-semibold block">Protein</label>
                <div className="flex items-center space-x-1 mt-1">
                  <input
                    id="profile-protein-target"
                    type="number"
                    min="50"
                    max="400"
                    value={targetProteinGrams}
                    onChange={(e) => setTargetProteinGrams(Number(e.target.value))}
                    className="w-full bg-transparent text-sm font-bold text-sky-300 font-mono focus:outline-none min-h-[32px]"
                  />
                  <span className="text-[10px] text-content-muted">g</span>
                </div>
              </div>

              <div className="bg-surface-950/70 p-2.5 rounded-xl border border-surface-border">
                <label htmlFor="profile-carbs-target" className="text-[10px] text-biotech-amber font-semibold block">Carbs</label>
                <div className="flex items-center space-x-1 mt-1">
                  <input
                    id="profile-carbs-target"
                    type="number"
                    min="20"
                    max="600"
                    value={targetCarbsGrams}
                    onChange={(e) => setTargetCarbsGrams(Number(e.target.value))}
                    className="w-full bg-transparent text-sm font-bold text-amber-300 font-mono focus:outline-none min-h-[32px]"
                  />
                  <span className="text-[10px] text-content-muted">g</span>
                </div>
              </div>

              <div className="bg-surface-950/70 p-2.5 rounded-xl border border-surface-border">
                <label htmlFor="profile-fat-target" className="text-[10px] text-biotech-rose font-semibold block">Fats</label>
                <div className="flex items-center space-x-1 mt-1">
                  <input
                    id="profile-fat-target"
                    type="number"
                    min="20"
                    max="250"
                    value={targetFatGrams}
                    onChange={(e) => setTargetFatGrams(Number(e.target.value))}
                    className="w-full bg-transparent text-sm font-bold text-rose-300 font-mono focus:outline-none min-h-[32px]"
                  />
                  <span className="text-[10px] text-content-muted">g</span>
                </div>
              </div>
            </div>
          </div>

          {/* Connected Wearable */}
          <div>
            <label htmlFor="profile-wearable-select" className="text-xs font-bold uppercase tracking-wider text-content-muted block mb-2 flex items-center gap-1.5">
              <Watch className="w-3.5 h-3.5 text-biotech-purple" aria-hidden="true" />
              <span>Connected Bio-Telemetry Device</span>
            </label>

            <select
              id="profile-wearable-select"
              value={connectedWearable}
              onChange={(e) => setConnectedWearable(e.target.value)}
              className="w-full px-3.5 py-2.5 min-h-[44px] rounded-xl bg-surface-950 border border-surface-border text-content-primary text-sm focus:outline-none focus:border-kitchen-500 focus:ring-1 focus:ring-kitchen-500"
            >
              <option value="Apple Watch Ultra 2">Apple Watch Ultra 2 (Apple HealthKit)</option>
              <option value="Garmin Epix Pro">Garmin Epix Pro / Fenix 7 (Garmin Connect)</option>
              <option value="Whoop 4.0">Whoop 4.0 (Strap Recovery & Strain API)</option>
              <option value="Oura Ring Gen 4">Oura Ring Gen 4 (Sleep & HRV)</option>
            </select>
          </div>

          {/* Action Footer */}
          <div className="pt-4 border-t border-surface-border flex items-center justify-between">
            <span className="text-[11px] text-content-muted font-mono">
              Last saved: {new Date(user.updatedAt).toLocaleDateString()}
            </span>

            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="min-h-[44px] px-4 py-2 text-xs font-semibold text-content-muted hover:text-content-primary transition rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kitchen-500"
              >
                Close
              </button>

              <button
                type="submit"
                disabled={isSaving}
                className="min-h-[44px] flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-kitchen-500 hover:bg-kitchen-400 text-surface-950 font-black text-xs uppercase tracking-wider transition shadow-lg shadow-kitchen-500/25 active:scale-95 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kitchen-400"
              >
                {isSaving ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" aria-hidden="true" />
                    <span>Saving to Database...</span>
                  </>
                ) : (
                  <>
                    <Database className="w-4 h-4" aria-hidden="true" />
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


