import { PantryItem, DailyLogItem, BioStateKey } from '../types';
import { initialPantryItems } from '../data/initialPantry';

const PANTRY_KEY = 'kitchensync_pantry_items_v1';
const DIARY_KEY = 'kitchensync_diary_items_v1';
const BIO_KEY = 'kitchensync_bio_state_v1';

export function getStoredPantry(): PantryItem[] {
  try {
    const raw = localStorage.getItem(PANTRY_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Failed to load pantry from storage', err);
  }
  return initialPantryItems;
}

export function savePantry(items: PantryItem[]): void {
  try {
    localStorage.setItem(PANTRY_KEY, JSON.stringify(items));
  } catch (err) {
    console.error('Failed to save pantry to storage', err);
  }
}

export function resetPantry(): PantryItem[] {
  localStorage.removeItem(PANTRY_KEY);
  return initialPantryItems;
}

export function deductPantryIngredients(
  currentPantry: PantryItem[],
  requirements: { name: string; amount: number; unit: string }[]
): { updatedPantry: PantryItem[]; deductedSummary: string[] } {
  const updated = [...currentPantry];
  const deductedSummary: string[] = [];

  for (const req of requirements) {
    // Find matching item by partial name match
    const index = updated.findIndex(
      (p) => p.name.toLowerCase().includes(req.name.toLowerCase()) || req.name.toLowerCase().includes(p.name.toLowerCase())
    );

    if (index !== -1) {
      const item = updated[index];
      const prevQty = item.quantity;
      const newQty = Math.max(0, Math.round((prevQty - req.amount) * 10) / 10);
      updated[index] = { ...item, quantity: newQty };
      deductedSummary.push(`${item.name}: ${prevQty} ${item.unit} → ${newQty} ${item.unit} (-${req.amount})`);
    } else {
      deductedSummary.push(`${req.name}: used (not tracked in fridge)`);
    }
  }

  savePantry(updated);
  return { updatedPantry: updated, deductedSummary };
}

export function getStoredDiary(): DailyLogItem[] {
  try {
    const raw = localStorage.getItem(DIARY_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Failed to load diary', err);
  }
  return [
    {
      id: 'log-breakfast',
      time: '08:15 AM',
      name: 'Cold-Brew Collagen Latte + Almonds',
      calories: 220,
      protein: 20,
      carbs: 6,
      fat: 14,
      source: 'manual',
    },
  ];
}

export function saveDiary(items: DailyLogItem[]): void {
  try {
    localStorage.setItem(DIARY_KEY, JSON.stringify(items));
  } catch (err) {
    console.error('Failed to save diary', err);
  }
}

export function getStoredBioState(): BioStateKey {
  try {
    const raw = localStorage.getItem(BIO_KEY);
    if (raw && (raw === 'post-hiit' || raw === 'sedentary' || raw === 'recovery' || raw === 'hypertrophy')) {
      return raw as BioStateKey;
    }
  } catch {
    // fallback
  }
  return 'post-hiit';
}

export function saveBioState(state: BioStateKey): void {
  localStorage.setItem(BIO_KEY, state);
}

