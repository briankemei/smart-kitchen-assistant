import { BioSyncState } from '../types';

export const bioSyncProfiles: Record<string, BioSyncState> = {
  'post-hiit': {
    key: 'post-hiit',
    label: 'Post-Workout HIIT',
    subtitle: 'High Glycogen Depletion Detected',
    wearableSource: 'Apple Watch Series 10 / Garmin Epix',
    wearableSummary: '🔥 640 active kcal burned • 48 min Zone 4/5 • Peak HR 168 bpm',
    calorieTargetOffset: 450,
    proteinTargetGrams: 180,
    carbTargetGrams: 230,
    fatTargetGrams: 55,
    color: '#0ea5e9', // biotech blue
    bioRecommendations: [
      'Prioritize fast-to-moderate digesting complex carbohydrates within 90 minutes.',
      'Target 35g–45g protein for optimal muscle protein synthesis (MPS).',
      'Replenish electrolytes (potassium from spinach, sodium from tamari/feta).',
    ],
    recommendedTag: 'post-hiit',
  },
  'sedentary': {
    key: 'sedentary',
    label: 'Sedentary Focus Day',
    subtitle: 'Low NEAT Activity / Desk Bound',
    wearableSource: 'Apple Health / Oura Ring Gen 4',
    wearableSummary: '🛋️ 2,850 steps logged • Resting HR 56 bpm • Low energy expenditure',
    calorieTargetOffset: -250,
    proteinTargetGrams: 150,
    carbTargetGrams: 110,
    fatTargetGrams: 65,
    color: '#8b5cf6', // biotech purple
    bioRecommendations: [
      'Minimize insulin spikes by substituting refined grains with leafy greens & cruciferous veg.',
      'Maintain high protein to protect lean mass and stimulate glucagon satiety.',
      'Incorporate healthy monounsaturated fats (EVOO, avocado) for cognitive focus.',
    ],
    recommendedTag: 'sedentary',
  },
  'recovery': {
    key: 'recovery',
    label: 'Low Sleep & Stress Recovery',
    subtitle: 'Depressed HRV (32 ms) • 4h 52m Sleep',
    wearableSource: 'Whoop 4.0 / Oura Ring',
    wearableSummary: '⚠️ Sleep Performance 58% • Recovery Index in Yellow • Elevated Cortisol',
    calorieTargetOffset: 0,
    proteinTargetGrams: 160,
    carbTargetGrams: 160,
    fatTargetGrams: 60,
    color: '#f59e0b', // amber
    bioRecommendations: [
      'Flood diet with anti-inflammatory polyphenols (dark berries, spinach, extra-virgin olive oil).',
      'Ensure high magnesium and tryptophan from whole eggs and seeds to support parasympathetic rebound.',
      'Avoid heavy refined sugar crashes that further exacerbate adrenal strain.',
    ],
    recommendedTag: 'recovery',
  },
  'hypertrophy': {
    key: 'hypertrophy',
    label: 'Hypertrophy Bulking Day',
    subtitle: 'Heavy Resistance Training Logged',
    wearableSource: 'Apple Health / Strong App Sync',
    wearableSummary: '🏋️ 82 min Heavy Resistance (Leg Day) • Volume 18,400 kg',
    calorieTargetOffset: 550,
    proteinTargetGrams: 200,
    carbTargetGrams: 280,
    fatTargetGrams: 70,
    color: '#10b981', // emerald
    bioRecommendations: [
      'Leucine-dense protein source required (chicken breast, whole eggs, salmon).',
      'Ample starch reserves (brown jasmine rice, sweet potatoes) for muscle glycogen supercompensation.',
      'Sustained surplus ensures maximal anabolic signaling over the 36-hour recovery window.',
    ],
    recommendedTag: 'hypertrophy',
  },
};

