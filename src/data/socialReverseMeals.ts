import { SocialReverseMeal } from '../types';

export const sampleReverseMeals: SocialReverseMeal[] = [
  {
    id: 'reverse-alfredo',
    dishName: 'Viral Restaurant Creamy Tuscan Garlic Fettuccine',
    source: 'Instagram',
    originalImage: 'https://images.unsplash.com/photo-1621996346565-e3d5d628169b?auto=format&fit=crop&w=1000&q=80',
    originalCalories: 1420,
    originalMacros: { protein: 32, carbs: 115, fat: 88 },
    heavyCulprits: [
      { ingredient: 'Heavy Whipping Cream (1 cup)', calorieLoad: '820 kcal', issue: 'Saturated fat bomb with zero dietary fiber' },
      { ingredient: 'Unsalted Butter (4 tbsp)', calorieLoad: '410 kcal', issue: 'High caloric density used strictly for emulsification' },
      { ingredient: 'Refined White Semolina Pasta', calorieLoad: '380 kcal', issue: 'Causes rapid glucose spike followed by energy crash' },
    ],
    healthifiedVersion: {
      title: 'KitchenSync High-Protein Garlic & Blistered Tomato Fettuccine',
      remixImage: 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&w=1000&q=80',
      calories: 510,
      macros: { protein: 52, carbs: 48, fat: 12 },
      caloriesSavedPercent: 64,
      fridgeMatches: ['Fresh Chicken Breast', 'Organic Baby Spinach', 'Cherry Tomatoes', 'Non-Fat Greek Yogurt', 'Raw Garlic Bulbs'],
      swaps: [
        { restaurantItem: 'Heavy Cream + 4 tbsp Butter', fridgeSub: 'Blended Non-Fat Greek Yogurt + Splash of Pasta Water', calorieSavings: '-760 kcal' },
        { restaurantItem: 'White Flour Fettuccine (Excess Portion)', fridgeSub: 'Balanced Al Dente Pasta + Wilted Baby Spinach volume boost', calorieSavings: '-150 kcal' },
        { restaurantItem: 'Skin-On Pan Frying with Butter', fridgeSub: 'Seared Lean Chicken Breast in 1 tsp EVOO', calorieSavings: '-210 kcal' },
      ],
      prepTime: '15 mins',
      instructions: [
        'Sear diced chicken breast in 1 tsp olive oil with garlic until golden.',
        'Whisk 3 tbsp Greek yogurt with warm pasta water, black pepper, and garlic until velvety.',
        'Toss boiled pasta, blistered cherry tomatoes, and baby spinach into the warm pan.',
        'Remove pan from direct heat, fold in the Greek yogurt cream sauce, and top with seared chicken.',
      ],
    },
  },
  {
    id: 'reverse-smashburger',
    dishName: 'Double Bacon Cheddar Smash Burger & Truffle Fries',
    source: 'TikTok',
    originalImage: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1000&q=80',
    originalCalories: 1580,
    originalMacros: { protein: 44, carbs: 128, fat: 96 },
    heavyCulprits: [
      { ingredient: '70/30 Ground Chuck (2 patties)', calorieLoad: '620 kcal', issue: 'High saturated animal fats rendered on griddle' },
      { ingredient: 'Deep-Fried Fries in Canola Oil', calorieLoad: '520 kcal', issue: 'Reheated oxidized seed oils and dense starch' },
      { ingredient: 'Sugary Mayo Special Sauce', calorieLoad: '280 kcal', issue: 'High fructose syrup and soybean oil emulsion' },
    ],
    healthifiedVersion: {
      title: 'KitchenSync Clean Smash Patty Bowl with Sweet Potato Wedges',
      remixImage: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1000&q=80',
      calories: 560,
      macros: { protein: 48, carbs: 54, fat: 16 },
      caloriesSavedPercent: 65,
      fridgeMatches: ['Fresh Chicken Breast / Lean Patty', 'Bell Peppers (Tri-Color)', 'Red & Yellow Onions', 'Non-Fat Greek Yogurt'],
      swaps: [
        { restaurantItem: 'Deep Fried Fries in Refined Oil', fridgeSub: 'Air-Fried Paprika Sweet Potato Wedges', calorieSavings: '-340 kcal' },
        { restaurantItem: 'Mayonnaise Special Sauce', fridgeSub: 'Greek Yogurt + Smoked Paprika & Pickle Relish', calorieSavings: '-210 kcal' },
        { restaurantItem: 'Buttered Brioche Buns', fridgeSub: 'Crisp Lettuce Wrap or Toasted Whole Grain', calorieSavings: '-190 kcal' },
      ],
      prepTime: '20 mins',
      instructions: [
        'Air-fry hand-cut sweet potato wedges with 1 tsp olive oil and smoked paprika at 400°F for 18 mins.',
        'Press lean patties thinly onto a screaming hot cast-iron skillet for 2 minutes to create a deep caramelized crust.',
        'Whisk Greek yogurt with Dijon mustard, smoked paprika, and a drop of honey for the clean smash sauce.',
        'Serve with caramelized onions, crisp bell peppers, and fresh greens.',
      ],
    },
  },
  {
    id: 'reverse-burrito',
    dishName: 'Giant Stuffed Carnitas Queso Burrito',
    source: 'Fine Dining Menu',
    originalImage: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=1000&q=80',
    originalCalories: 1380,
    originalMacros: { protein: 38, carbs: 145, fat: 72 },
    heavyCulprits: [
      { ingredient: '14-inch White Flour Tortilla', calorieLoad: '340 kcal', issue: 'Ultra-processed bleached flour high in sodium' },
      { ingredient: 'Lard-Cooked Carnitas Pork Shoulder', calorieLoad: '480 kcal', issue: 'Slow-cooked in rendered animal lard' },
      { ingredient: 'Melted Queso & Full-Fat Sour Cream', calorieLoad: '380 kcal', issue: 'Dense processed dairy with sodium overload' },
    ],
    healthifiedVersion: {
      title: 'KitchenSync Sizzling Fajita Protein Bowl with Lime Crema',
      remixImage: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=1000&q=80',
      calories: 495,
      macros: { protein: 50, carbs: 42, fat: 14 },
      caloriesSavedPercent: 64,
      fridgeMatches: ['Fresh Chicken Breast', 'Black Beans', 'Bell Peppers (Tri-Color)', 'Non-Fat Greek Yogurt', 'Fresh Lemons & Limes'],
      swaps: [
        { restaurantItem: 'Lard Refried Beans & Heavy Pork', fridgeSub: 'Clean Black Beans + Cumin-Seared Chicken Breast', calorieSavings: '-390 kcal' },
        { restaurantItem: '14-inch Flour Tortilla Wrap', fridgeSub: 'High-Volume Bell Pepper & Baby Greens Base', calorieSavings: '-320 kcal' },
        { restaurantItem: 'Processed Queso Sauce', fridgeSub: 'Lime Greek Yogurt Crema with Jalapeño', calorieSavings: '-175 kcal' },
      ],
      prepTime: '12 mins',
      instructions: [
        'Flash-sear chicken strips with cumin, chili powder, and sliced tri-color peppers in olive oil.',
        'Warm drained black beans with crushed garlic and lime juice.',
        'Layer a bed of crisp greens with the warm beans, chicken, and charred peppers.',
        'Dollop with Greek yogurt lime crema and a sprinkle of fresh cilantro.',
      ],
    },
  },
];

