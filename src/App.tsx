import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Navbar } from './components/Layout/Navbar';
import { BioSyncWidget } from './components/Dashboard/BioSyncWidget';
import { MacroRings } from './components/Dashboard/MacroRings';
import { UseItOrLoseItBanner } from './components/Dashboard/UseItOrLoseItBanner';
import { VirtualFridge } from './components/Pantry/VirtualFridge';
import { CuisineMorpher } from './components/Chef/CuisineMorpher';
import { VisualCalorieScanner } from './components/Scanner/VisualCalorieScanner';
import { DishDeconstructor } from './components/ReverseEngineer/DishDeconstructor';
import { SubscriptionPlans } from './components/Subscription/SubscriptionPlans';
import { ToastProvider } from './context/ToastContext';
import { useToast } from './hooks/useToast';


// Lazy-load modal for performance and production bundle hygiene
const UserProfileModal = lazy(() =>
  import('./components/User/UserProfileModal').then((m) => ({ default: m.UserProfileModal }))
);

import { 
  PantryItem, 
  DailyLogItem, 
  BioStateKey, 
  MorphableRecipe, 
  CuisineStyle, 
  SocialReverseMeal,
  UserProfile,
  Subscription,
  SubscriptionTier,
  BillingCycle
} from './types';
import { bioSyncProfiles } from './data/bioSyncProfiles';
import { 
  getStoredPantry, 
  savePantry, 
  resetPantry, 
  deductPantryIngredients, 
  getStoredDiary, 
  saveDiary, 
  getStoredBioState, 
  saveBioState 
} from './utils/storage';
import { 
  fetchUserProfile, 
  saveUserProfileToDb, 
  upgradeSubscriptionInDb, 
  cancelSubscriptionInDb 
} from './utils/api';

const defaultUser: UserProfile = {
  id: 'usr-1',
  name: 'Brian Kemei',
  email: 'brian@kitchensync.ai',
  avatar: '👨‍🍳',
  fitnessGoal: 'muscle_hypertrophy',
  dietaryPreference: 'high_protein_athletic',
  dailyCalorieGoal: 2450,
  targetProteinGrams: 180,
  targetCarbsGrams: 220,
  targetFatGrams: 65,
  connectedWearable: 'Apple Watch Ultra 2',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const defaultSubscription: Subscription = {
  id: 'sub-1',
  userId: 'usr-1',
  tier: 'pro',
  status: 'active',
  billingCycle: 'monthly',
  pricePerMonth: 14.99,
  renewsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  paymentMethod: '•••• 4242 (Visa)',
  invoices: [
    {
      id: 'inv-init',
      date: new Date().toISOString().split('T')[0],
      amount: 14.99,
      planName: 'KitchenSync Pro (Monthly)',
      status: 'paid',
      paymentMethod: '•••• 4242 (Visa)',
    },
  ],
};

const AppContent: React.FC = () => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'pantry' | 'chef' | 'scanner' | 'reverse' | 'plans'>('dashboard');
  const [pantryItems, setPantryItems] = useState<PantryItem[]>(getStoredPantry);
  const [diary, setDiary] = useState<DailyLogItem[]>(getStoredDiary);
  const [bioState, setBioState] = useState<BioStateKey>(getStoredBioState);
  const [targetIngredientForRecipe, setTargetIngredientForRecipe] = useState<string | null>(null);

  // User & Subscription state synced with Database
  const [user, setUser] = useState<UserProfile>(defaultUser);
  const [subscription, setSubscription] = useState<Subscription>(defaultSubscription);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Fetch initial profile & subscription from database API on mount
  useEffect(() => {
    fetchUserProfile().then((res) => {
      if (res) {
        setUser(res.user);
        setSubscription(res.subscription);
      }
    });
  }, []);

  // Sync state changes to storage
  useEffect(() => {
    savePantry(pantryItems);
  }, [pantryItems]);

  useEffect(() => {
    saveDiary(diary);
  }, [diary]);

  useEffect(() => {
    saveBioState(bioState);
  }, [bioState]);

  // Urgent items count (< 2 days)
  const urgentCount = pantryItems.filter((i) => i.daysUntilExpiry <= 2 && i.quantity > 0).length;

  // Handler: Add item to pantry
  const handleAddItem = (item: Omit<PantryItem, 'id' | 'addedDate'>) => {
    const newItem: PantryItem = {
      ...item,
      id: `p-${Date.now()}`,
      addedDate: new Date().toISOString().split('T')[0],
    };
    setPantryItems((prev) => [newItem, ...prev]);
    showToast(`Added ${item.name} to Virtual Fridge!`, 'success');
  };

  // Handler: Batch add items from grocery haul scan
  const handleBatchAddPantryItems = (items: Omit<PantryItem, 'id' | 'addedDate'>[]) => {
    const today = new Date().toISOString().split('T')[0];
    const newItems: PantryItem[] = items.map((item, idx) => ({
      ...item,
      id: `p-${Date.now()}-${idx}`,
      addedDate: today,
    }));
    setPantryItems((prev) => [...newItems, ...prev]);
    showToast(`Restocked fridge: added ${items.length} detected groceries!`, 'success');
  };

  // Handler: Update item quantity
  const handleUpdateQuantity = (id: string, newQty: number) => {
    setPantryItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: newQty } : item))
    );
  };

  // Handler: Delete item
  const handleDeleteItem = (id: string) => {
    setPantryItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Handler: Cook recipe & auto-deduct fridge
  const handleCookRecipe = (recipe: MorphableRecipe, style: CuisineStyle) => {
    const { updatedPantry } = deductPantryIngredients(pantryItems, recipe.basePantryRequirements);
    setPantryItems(updatedPantry);

    const newLogItem: DailyLogItem = {
      id: `log-${Date.now()}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      name: recipe.styles[style].title,
      calories: recipe.calories,
      protein: recipe.macros.protein,
      carbs: recipe.macros.carbs,
      fat: recipe.macros.fat,
      source: 'cooked_recipe',
    };
    setDiary((prev) => [newLogItem, ...prev]);
    showToast(`Cooked ${recipe.styles[style].title}! Fridge inventory deducted.`, 'success');
  };

  // Handler: Log Scanned Meal from CV Scanner
  const handleLogScannedMeal = (meal: Omit<DailyLogItem, 'id' | 'time'>) => {
    const newLogItem: DailyLogItem = {
      ...meal,
      id: `log-${Date.now()}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setDiary((prev) => [newLogItem, ...prev]);
    showToast(`Logged ${meal.name} (+${meal.calories} kcal) to daily diary!`, 'success');
  };

  // Handler: Cook Healthified Reverse-Engineered Meal
  const handleCookHealthified = (meal: SocialReverseMeal) => {
    const dummyReqs = [
      { name: 'Fresh Chicken Breast', amount: 150, unit: 'g' },
      { name: 'Organic Baby Spinach', amount: 50, unit: 'g' },
      { name: 'Non-Fat Greek Yogurt', amount: 60, unit: 'g' },
    ];
    const { updatedPantry } = deductPantryIngredients(pantryItems, dummyReqs);
    setPantryItems(updatedPantry);

    const newLogItem: DailyLogItem = {
      id: `log-${Date.now()}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      name: meal.healthifiedVersion.title,
      calories: meal.healthifiedVersion.calories,
      protein: meal.healthifiedVersion.macros.protein,
      carbs: meal.healthifiedVersion.macros.carbs,
      fat: meal.healthifiedVersion.macros.fat,
      source: 'reverse_engineer',
    };
    setDiary((prev) => [newLogItem, ...prev]);
    showToast(`Cooked ${meal.healthifiedVersion.title}! Healthified macros logged.`, 'success');
  };

  // Handler: Delete Diary Item
  const handleDeleteDiaryItem = (id: string) => {
    setDiary((prev) => prev.filter((d) => d.id !== id));
  };

  // Handler: Reset Demo Data
  const handleResetData = () => {
    if (window.confirm('Reset all demo fridge groceries and diary entries back to initial state?')) {
      const fresh = resetPantry();
      setPantryItems([...fresh]);
      setDiary([
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
      ]);
      setBioState('post-hiit');
      showToast('Reset pantry inventory and diary to initial state.', 'info');
    }
  };

  // Handler: Filter recipe for a specific perishable ingredient
  const handleFindRecipeForItem = (itemName: string) => {
    setTargetIngredientForRecipe(itemName);
    setActiveTab('chef');
  };

  // Handler: Save User Profile to Database
  const handleSaveProfile = async (updated: UserProfile) => {
    try {
      const saved = await saveUserProfileToDb(updated);
      setUser(saved);
      showToast('Profile updated and synchronized to database.', 'success');
    } catch (err: any) {
      setUser(updated);
      showToast(`Saved locally: ${err.message || 'Offline fallback active'}`, 'warning');
    }
  };

  // Handler: Upgrade Subscription in Database
  const handleUpgradeSubscription = async (
    tier: SubscriptionTier,
    billingCycle: BillingCycle,
    paymentMethod: string,
    price: number
  ) => {
    try {
      const updatedSub = await upgradeSubscriptionInDb({
        tier,
        billingCycle,
        paymentMethod,
        pricePerMonth: price,
      });
      setSubscription(updatedSub);
      showToast(`Successfully upgraded to ${tier.toUpperCase()} (${billingCycle})!`, 'success');
    } catch (err: any) {
      // Offline fallback
      setSubscription((prev) => ({
        ...prev,
        tier,
        billingCycle,
        pricePerMonth: price,
        paymentMethod,
      }));
      showToast(`Subscription saved locally: ${err.message || 'Offline fallback active'}`, 'warning');
    }
  };

  // Handler: Cancel Subscription
  const handleCancelSubscription = async () => {
    try {
      const updatedSub = await cancelSubscriptionInDb();
      setSubscription(updatedSub);
      showToast('Subscription cancelled. Downgraded to Free plan.', 'info');
    } catch {
      setSubscription((prev) => ({
        ...prev,
        tier: 'free',
        status: 'canceled',
        pricePerMonth: 0,
      }));
      showToast('Subscription cancelled locally.', 'info');
    }
  };

  return (
    <div className="min-h-screen bg-surface-950 text-content-primary flex flex-col selection:bg-kitchen-500 selection:text-surface-950">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        bioState={bioState}
        user={user}
        subscription={subscription}
        onResetData={handleResetData}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        urgentCount={urgentCount}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Tab 1: Dashboard & Bio-Sync Hub */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Perishable Warning Banner */}
            <UseItOrLoseItBanner
              pantryItems={pantryItems}
              onCookRecipe={() => setActiveTab('chef')}
              onViewFridge={() => setActiveTab('pantry')}
            />

            {/* Bio-Sync Wearable Engine */}
            <BioSyncWidget
              currentBioState={bioState}
              onSelectBioState={setBioState}
              onExploreRecipes={() => setActiveTab('chef')}
            />

            {/* Macro & Calorie Intake Gauges */}
            <MacroRings
              diary={diary}
              bioProfile={bioSyncProfiles[bioState]}
              onDeleteLog={handleDeleteDiaryItem}
              onOpenScanner={() => setActiveTab('scanner')}
            />
          </div>
        )}

        {/* Tab 2: Virtual Fridge & Smart Pantry */}
        {activeTab === 'pantry' && (
          <div className="animate-in fade-in duration-300">
            <VirtualFridge
              pantryItems={pantryItems}
              onUpdateQuantity={handleUpdateQuantity}
              onDeleteItem={handleDeleteItem}
              onAddItem={handleAddItem}
              onBatchAdd={handleBatchAddPantryItems}
              onFindRecipeForItem={handleFindRecipeForItem}
            />
          </div>
        )}

        {/* Tab 3: Cuisine Morphing & Smart Chef */}
        {activeTab === 'chef' && (
          <div className="animate-in fade-in duration-300">
            <CuisineMorpher
              pantryItems={pantryItems}
              onCookRecipe={handleCookRecipe}
              selectedFilterIngredient={targetIngredientForRecipe}
            />
          </div>
        )}

        {/* Tab 4: Visual Calorie Estimation Plate Scanner */}
        {activeTab === 'scanner' && (
          <div className="animate-in fade-in duration-300">
            <VisualCalorieScanner onLogMeal={handleLogScannedMeal} />
          </div>
        )}

        {/* Tab 5: Recipe Reverse-Engineering for Calories */}
        {activeTab === 'reverse' && (
          <div className="animate-in fade-in duration-300">
            <DishDeconstructor
              pantryItems={pantryItems}
              onCookHealthified={handleCookHealthified}
            />
          </div>
        )}

        {/* Tab 6: Subscription & Pricing Plans */}
        {activeTab === 'plans' && (
          <div className="animate-in fade-in duration-300">
            <SubscriptionPlans
              subscription={subscription}
              onUpgrade={handleUpgradeSubscription}
              onCancel={handleCancelSubscription}
            />
          </div>
        )}
      </main>

      {/* User Profile & Database Settings Modal (Lazy Loaded) */}
      {isProfileModalOpen && (
        <Suspense fallback={null}>
          <UserProfileModal
            isOpen={isProfileModalOpen}
            user={user}
            onClose={() => setIsProfileModalOpen(false)}
            onSave={handleSaveProfile}
          />
        </Suspense>
      )}

      {/* Footer */}
      <footer className="border-t border-surface-border bg-surface-950 py-6 text-center text-xs text-content-muted">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>KitchenSync AI — Zero-Effort Kitchen & Biological Fuel Management</span>
          <span className="text-content-muted">
            Built for The Busy Health-Conscious Professional • Persistent Database & Stripe-Ready Subscriptions
          </span>
        </div>
      </footer>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
};

export default App;

