import React from 'react';
import { 
  Sparkles, 
  Refrigerator, 
  ChefHat, 
  ScanLine, 
  Split, 
  Activity, 
  RotateCcw,
  CreditCard
} from 'lucide-react';
import { BioStateKey, UserProfile, Subscription } from '../../types';

interface NavbarProps {
  activeTab: 'dashboard' | 'pantry' | 'chef' | 'scanner' | 'reverse' | 'plans';
  setActiveTab: (tab: 'dashboard' | 'pantry' | 'chef' | 'scanner' | 'reverse' | 'plans') => void;
  bioState: BioStateKey;
  user: UserProfile;
  subscription: Subscription;
  onResetData: () => void;
  onOpenProfile: () => void;
  urgentCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  user,
  subscription,
  onResetData,
  onOpenProfile,
  urgentCount,
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Bio-Sync & Hub', icon: Activity, badge: null },
    { 
      id: 'pantry', 
      label: 'Virtual Fridge', 
      icon: Refrigerator, 
      badge: urgentCount > 0 ? `${urgentCount} urgent` : null 
    },
    { id: 'chef', label: 'Cuisine Morph', icon: ChefHat, badge: 'AI' },
    { id: 'scanner', label: 'Plate Scanner', icon: ScanLine, badge: 'CV' },
    { id: 'reverse', label: 'Meal Reverse-AI', icon: Split, badge: 'Remix' },
    { 
      id: 'plans', 
      label: 'Subscription', 
      icon: CreditCard, 
      badge: subscription.tier.toUpperCase() 
    },
  ] as const;

  const getTierBadgeStyle = () => {
    switch (subscription.tier) {
      case 'elite':
        return 'bg-gradient-to-r from-biotech-purple to-biotech-blue text-white shadow-md';
      case 'pro':
        return 'bg-gradient-to-r from-kitchen-500 to-kitchen-400 text-surface-950 shadow-md';
      default:
        return 'bg-surface-800 text-content-secondary border border-surface-border';
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-surface-900/95 backdrop-blur-md border-b border-surface-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <button
            type="button"
            className="flex items-center space-x-3 text-left focus-visible:ring-2 focus-visible:ring-kitchen-500 rounded-xl p-1 -ml-1 transition"
            onClick={() => setActiveTab('dashboard')}
            aria-label="KitchenSync AI - Go to Dashboard"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-kitchen-500 to-kitchen-400 flex items-center justify-center shadow-lg shadow-kitchen-500/20">
              <Sparkles className="w-5 h-5 text-surface-950 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg tracking-tight text-content-primary">KitchenSync</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-kitchen-500/20 text-kitchen-400 font-semibold border border-kitchen-500/30">
                  AI 2.0
                </span>
              </div>
              <p className="text-xs text-content-muted hidden sm:block">Zero-Effort Kitchen & Bio-Nutrition Companion</p>
            </div>
          </button>

          {/* Navigation Links */}
          <nav aria-label="Main Navigation" className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-2 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all focus-visible:ring-2 focus-visible:ring-kitchen-500 min-h-[44px] ${
                    isActive
                      ? 'bg-surface-800 text-kitchen-400 border border-surface-borderLight shadow-sm'
                      : 'text-content-secondary hover:text-content-primary hover:bg-surface-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-kitchen-400' : 'text-content-muted'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                        item.badge.includes('urgent')
                          ? 'bg-biotech-rose/20 text-biotech-rose-light border border-biotech-rose/30 animate-pulse'
                          : 'bg-kitchen-500/20 text-kitchen-400 border border-kitchen-500/30 font-mono'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center space-x-2.5">
            {/* Subscription Tier Pill */}
            <button
              type="button"
              onClick={() => setActiveTab('plans')}
              aria-label={`Current subscription: ${subscription.tier} plan. Click to view plans.`}
              className={`hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider shadow-sm transition active:scale-95 focus-visible:ring-2 focus-visible:ring-kitchen-500 min-h-[44px] ${getTierBadgeStyle()}`}
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>{subscription.tier} Plan</span>
            </button>

            {/* User Profile & Database Sync Button */}
            <button
              type="button"
              onClick={onOpenProfile}
              aria-label={`User profile for ${user.name}. Click to edit settings.`}
              className="flex items-center space-x-2 px-3 py-2 rounded-xl bg-surface-800 hover:bg-surface-750 border border-surface-border text-xs text-content-primary transition active:scale-95 shadow-sm focus-visible:ring-2 focus-visible:ring-kitchen-500 min-h-[44px]"
            >
              <span className="text-base">{user.avatar || '👨‍🍳'}</span>
              <span className="font-bold hidden md:inline truncate max-w-[110px]">{user.name}</span>
              <span className="w-2 h-2 rounded-full bg-kitchen-400" title="Database Connected" />
            </button>

            {/* Reset Demo Data Button */}
            <button
              type="button"
              onClick={onResetData}
              aria-label="Reset demo inventory and meal logs"
              title="Reset Demo Inventory & Logs"
              className="min-h-[44px] min-w-[44px] flex items-center justify-center text-content-muted hover:text-content-primary hover:bg-surface-800 rounded-xl transition focus-visible:ring-2 focus-visible:ring-kitchen-500"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <nav aria-label="Mobile Navigation" className="lg:hidden flex items-center justify-around bg-surface-900 border-t border-surface-border px-2 py-1 overflow-x-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveTab(item.id)}
              aria-label={item.label}
              className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] p-1.5 text-xs font-medium rounded-xl whitespace-nowrap focus-visible:ring-2 focus-visible:ring-kitchen-500 ${
                isActive ? 'text-kitchen-400 bg-surface-800/80' : 'text-content-muted'
              }`}
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span className="text-[10px]">{item.label.split(' ')[0]}</span>
            </button>
          );
        })}
      </nav>
    </header>
  );
};
