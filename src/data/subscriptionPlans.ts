import { PlanDefinition } from '../types';

export const subscriptionPlans: PlanDefinition[] = [
  {
    tier: 'free',
    name: 'Starter Kitchen',
    tagline: 'Basic digital pantry and entry-level food tracking',
    monthlyPrice: 0,
    annualPricePerMonth: 0,
    features: [
      'Virtual Fridge inventory tracking (up to 20 items)',
      '5 Computer Vision plate scans per month',
      'Standard single-ingredient recipe suggestions',
      'Basic macronutrient daily totals',
      'Manual grocery entry',
    ],
    limits: {
      scansPerMonth: 5,
      restockHaulScans: false,
      cuisineMorphing: false,
      bioSyncWearable: false,
      mealReverseAI: false,
      aiChefConcierge: false,
    },
  },
  {
    tier: 'pro',
    name: 'KitchenSync Pro',
    tagline: 'Intelligent automation for home chefs & fitness enthusiasts',
    monthlyPrice: 14.99,
    annualPricePerMonth: 9.99, // $119/yr (~33% discount)
    badge: 'Most Popular',
    popular: true,
    features: [
      'Unlimited "Zero-Entry" Visual Calorie plate scans',
      'Full Generative Cuisine Morphing (5 international styles)',
      '"Use-It-or-Lose-It" perishable food waste alerts',
      'AI Grocery Restock Haul scanner (multi-item CV)',
      'Automatic inventory deduction when recipes are cooked',
      'Interactive cooking mode with step countdown timers',
      'Priority customer support',
    ],
    limits: {
      scansPerMonth: 'unlimited',
      restockHaulScans: true,
      cuisineMorphing: true,
      bioSyncWearable: false,
      mealReverseAI: false,
      aiChefConcierge: false,
    },
  },
  {
    tier: 'elite',
    name: 'Executive Bio-Sync Elite',
    tagline: 'Complete biological fuel management & wearable synchronization',
    monthlyPrice: 29.99,
    annualPricePerMonth: 19.99, // $239/yr (~33% discount)
    badge: 'Ultimate Performance',
    features: [
      'Everything included in Pro Chef tier',
      'Real-time Wearable Bio-Sync (Apple Watch, Garmin, Whoop, Oura)',
      'Dynamic macro flexing (Post-HIIT, Sedentary, Recovery, Bulking)',
      'Social Media & Instagram Meal Reverse-Engineering for Calories',
      'Healthified Fridge Remix AI recipe reconstruction',
      '24/7 AI Nutrition Concierge & metabolic meal plan scheduling',
      'Dedicated biometric health reports & weekly trend exports',
    ],
    limits: {
      scansPerMonth: 'unlimited',
      restockHaulScans: true,
      cuisineMorphing: true,
      bioSyncWearable: true,
      mealReverseAI: true,
      aiChefConcierge: true,
    },
  },
];

export const subscriptionFAQs = [
  {
    question: 'Can I cancel or change my subscription at any time?',
    answer: 'Yes, you can upgrade, downgrade, or cancel your plan anytime with one click in your account settings. You will retain access until the end of your billing cycle.',
  },
  {
    question: 'How does the 33% annual discount work?',
    answer: 'When you choose annual billing, you are billed once every 12 months at the discounted rate ($119/year for Pro or $239/year for Elite), saving you over $60–$120 annually compared to monthly payments.',
  },
  {
    question: 'How does the database save my personal information and macros?',
    answer: 'All your personal profile data, dietary preferences, connected wearables, active subscription, and pantry inventory are persistently synchronized to our secure database, ensuring your settings remain intact across all sessions and devices.',
  },
];

