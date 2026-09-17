import React from 'react';
import { 
  Sparkles, 
  Refrigerator, 
  ChefHat, 
  ScanLine, 
  Split, 
  Activity, 
  RotateCcw 
} from 'lucide-react';
import { BioStateKey } from '../../types';
import { bioSyncProfiles } from '../../data/bioSyncProfiles';

interface NavbarProps {
  activeTab: 'dashboard' | 'pantry' | 'chef' | 'scanner' | 'reverse';
  setActiveTab: (tab: 'dashboard' | 'pantry' | 'chef' | 'scanner' | 'reverse') => void;
  bioState: BioStateKey;
  onResetData: () => void;
  urgentCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  bioState,
  onResetData,
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
  ] as const;

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
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
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
                          : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Status Actions */}
          <div className="flex items-center space-x-3">
            {/* Bio-Sync Live Tag */}
            <div 
              onClick={() => setActiveTab('dashboard')}
              className="hidden lg:flex items-center space-x-2 px-2.5 py-1 rounded-full bg-slate-800/80 border border-slate-700/80 cursor-pointer hover:border-slate-600 transition"
              title="Current Wearable Bio-Sync Mode"
            >
              <span className="w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: currentBio.color }} />
              <span className="text-xs text-slate-300 font-medium">{currentBio.label}</span>
              <span className="text-[10px] text-slate-400">({currentBio.calorieTargetOffset >= 0 ? `+${currentBio.calorieTargetOffset}` : currentBio.calorieTargetOffset} kcal)</span>
            </div>

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
      <div className="md:hidden flex items-center justify-around bg-slate-900 border-t border-slate-800 px-2 py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center p-1.5 text-xs font-medium rounded-lg ${
                isActive ? 'text-emerald-400' : 'text-slate-400'
              }`}
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span>{item.label.split(' ')[0]}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};

