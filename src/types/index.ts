export type PantryCategory = 'produce' | 'dairy-protein' | 'pantry' | 'frozen' | 'spices';

export interface PantryItem {
  id: string;
  name: string;
  category: PantryCategory;
  quantity: number;
  unit: string;
  daysUntilExpiry: number; // <= 2 is urgent, <= 4 is warning
  addedDate: string;
  icon?: string;
}

export type CuisineStyle = 'mediterranean' | 'texmex' | 'asian' | 'tuscan' | 'tikka';

export interface CuisineMorphDetails {
  title: string;
  styleName: string;
  tagline: string;
  flag: string;
  accentSpices: string[];
  swaps: { original: string; replacement: string; reason: string }[];
  steps: string[];
  image: string;
  chefTip: string;
  flavorProfile: { spicy: number; tangy: number; savory: number; aromatic: number };
}

export interface MorphableRecipe {
  id: string;
  baseTitle: string;
  description: string;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  difficulty: 'Easy' | 'Medium' | 'Advanced';
  calories: number;
  macros: { protein: number; carbs: number; fat: number; fiber: number };
  basePantryRequirements: { name: string; amount: number; unit: string }[];
  styles: Record<CuisineStyle, CuisineMorphDetails>;
  bioTagMatch?: string[];
}

export interface DetectedPlateItem {
  id: string;
  name: string;
  box: { top: number; left: number; width: number; height: number }; // in %
  color: string;
  estimatedWeightGrams: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  confidence: number;
}

export interface PlateScanSample {
  id: string;
  dishName: string;
  tag: string;
  imageUrl: string;
  plateDiameterCm: number;
  totalEstimatedWeightGrams: number;
  detectedItems: DetectedPlateItem[];
  totalMacros: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
}

export type BioStateKey = 'post-hiit' | 'sedentary' | 'recovery' | 'hypertrophy';

export interface BioSyncState {
  key: BioStateKey;
  label: string;
  subtitle: string;
  wearableSource: string;
  wearableSummary: string;
  calorieTargetOffset: number; // e.g. +450 kcal
  proteinTargetGrams: number;
  carbTargetGrams: number;
  fatTargetGrams: number;
  bioRecommendations: string[];
  recommendedTag: string;
  color: string;
}

export interface SocialReverseMeal {
  id: string;
  dishName: string;
  source: 'Instagram' | 'TikTok' | 'Fine Dining Menu';
  originalImage: string;
  originalCalories: number;
  originalMacros: { protein: number; carbs: number; fat: number };
  heavyCulprits: { ingredient: string; calorieLoad: string; issue: string }[];
  healthifiedVersion: {
    title: string;
    remixImage: string;
    calories: number;
    macros: { protein: number; carbs: number; fat: number };
    caloriesSavedPercent: number;
    fridgeMatches: string[];
    swaps: { restaurantItem: string; fridgeSub: string; calorieSavings: string }[];
    prepTime: string;
    instructions: string[];
  };
}

export interface DailyLogItem {
  id: string;
  time: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  source: 'visual_scan' | 'cooked_recipe' | 'reverse_engineer' | 'manual';
}

