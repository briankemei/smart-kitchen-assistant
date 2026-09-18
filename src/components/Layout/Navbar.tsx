import React from 'react';
import { 
  Sparkles, 
  Refrigerator, 
  ChefHat, 
  ScanLine, 
  Split, 
  Activity, 
  RotateCcw,
  CreditCard,
  User,
  Database
} from 'lucide-react';
import { BioStateKey, UserProfile, Subscription } from '../../types';
import { bioSyncProfiles } from '../../data/bioSyncProfiles';

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
  bioState,
  user,
  subscription,
  onResetData,
  onOpenProfile,
  urgentCount,
}) => {
  const currentBio = bioSyncProfiles[bioState];

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
        return 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-purple-500/20';
      case 'pro':
        return 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 shadow-emerald-500/20';
      default:
        return 'bg-slate-800 text-slate-300 border border-slate-700';
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Sparkles className="w-5 h-5 text-slate-950 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg tracking-tight text-white">KitchenSync</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-semibold border border-emerald-500/30">
                  AI 2.0
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">Zero-Effort Kitchen & Bio-Nutrition Companion</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-slate-800 text-emerald-400 border border-slate-700 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                        item.badge.includes('urgent')
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30 animate-pulse'
                          : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Actions: Subscription Tier Pill & User Profile Button */}
          <div className="flex items-center space-x-2.5">
            {/* Subscription Tier Pill */}
            <button
              onClick={() => setActiveTab('plans')}
              className={`hidden sm:flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider shadow-sm transition active:scale-95 ${getTierBadgeStyle()}`}
              title="View Subscription & Pricing Plans"
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>{subscription.tier} Plan</span>
            </button>

            {/* User Profile & Database Sync Button */}
            <button
              onClick={onOpenProfile}
              className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 text-xs text-white transition active:scale-95 shadow-sm"
              title="Manage Account & Database Settings"
            >
              <span className="text-base">{user.avatar || '👨‍🍳'}</span>
              <span className="font-bold hidden md:inline truncate max-w-[110px]">{user.name}</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400" title="Database Connected" />
            </button>

            {/* Reset Demo Data Button */}
            <button
              onClick={onResetData}
              title="Reset Demo Inventory & Logs"
              className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Bar */}
      <div className="lg:hidden flex items-center justify-around bg-slate-900 border-t border-slate-800 px-2 py-2 overflow-x-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center p-1.5 text-xs font-medium rounded-lg whitespace-nowrap ${
                isActive ? 'text-emerald-400' : 'text-slate-400'
              }`}
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span className="text-[10px]">{item.label.split(' ')[0]}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
