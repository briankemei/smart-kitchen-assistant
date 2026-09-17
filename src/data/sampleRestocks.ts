import { PantryCategory } from '../types';

export interface ScannedGroceryItem {
  id: string;
  name: string;
  category: PantryCategory;
  quantity: number;
  unit: string;
  daysUntilExpiry: number;
  confidence: number;
  icon: string;
  box: { top: number; left: number; width: number; height: number }; // % on haul image
}

export interface RestockHaulSample {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  detectedItems: ScannedGroceryItem[];
}

export const sampleRestockHauls: RestockHaulSample[] = [
  {
    id: 'haul-high-protein',
    title: 'High-Protein & Fresh Greens Haul',
    description: 'Post-gym grocery run: lean meats, eggs, greek yogurt, and fresh produce.',
    imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1000&q=80',
    detectedItems: [
      {
        id: 'sc-1',
        name: 'Grass-Fed Ribeye Steaks',
        category: 'dairy-protein',
        quantity: 450,
        unit: 'g',
        daysUntilExpiry: 3,
        confidence: 0.96,
        icon: '🥩',
        box: { top: 22, left: 18, width: 28, height: 26 },
      },
      {
        id: 'sc-2',
        name: 'Pasture-Raised Eggs (Dozen)',
        category: 'dairy-protein',
        quantity: 12,
        unit: 'eggs',
        daysUntilExpiry: 21,
        confidence: 0.98,
        icon: '🥚',
        box: { top: 24, left: 52, width: 30, height: 25 },
      },
      {
        id: 'sc-3',
        name: 'Organic Hass Avocados',
        category: 'produce',
        quantity: 4,
        unit: 'count',
        daysUntilExpiry: 5,
        confidence: 0.94,
        icon: '🥑',
        box: { top: 56, left: 16, width: 24, height: 28 },
      },
      {
        id: 'sc-4',
        name: 'Non-Fat Plain Greek Yogurt',
        category: 'dairy-protein',
        quantity: 900,
        unit: 'g',
        daysUntilExpiry: 12,
        confidence: 0.95,
        icon: '🥣',
        box: { top: 52, left: 45, width: 22, height: 32 },
      },
      {
        id: 'sc-5',
        name: 'Organic Blueberries Box',
        category: 'produce',
        quantity: 250,
        unit: 'g',
        daysUntilExpiry: 6,
        confidence: 0.92,
        icon: '🫐',
        box: { top: 58, left: 70, width: 22, height: 26 },
      },
    ],
  },
  {
    id: 'haul-farmers-market',
    title: 'Weekend Farmers Market Produce',
    description: 'Fresh crisp vegetables and organic aromatics from the local market.',
    imageUrl: 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&w=1000&q=80',
    detectedItems: [
      {
        id: 'sc-6',
        name: 'Baby Arugula & Spinach',
        category: 'produce',
        quantity: 250,
        unit: 'g',
        daysUntilExpiry: 4,
        confidence: 0.97,
        icon: '🥬',
        box: { top: 25, left: 20, width: 30, height: 30 },
      },
      {
        id: 'sc-7',
        name: 'Heirloom Vine Tomatoes',
        category: 'produce',
        quantity: 4,
        unit: 'tomatoes',
        daysUntilExpiry: 5,
        confidence: 0.95,
        icon: '🍅',
        box: { top: 28, left: 55, width: 28, height: 28 },
      },
      {
        id: 'sc-8',
        name: 'Fresh English Cucumbers',
        category: 'produce',
        quantity: 2,
        unit: 'cucumbers',
        daysUntilExpiry: 7,
        confidence: 0.93,
        icon: '🥒',
        box: { top: 60, left: 30, width: 40, height: 24 },
      },
    ],
  },
];

