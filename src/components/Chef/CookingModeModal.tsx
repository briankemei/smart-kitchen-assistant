import React, { useState, useEffect } from 'react';
import { X, Play, Pause, RotateCcw, CheckCircle2, ChefHat, Timer } from 'lucide-react';
import confetti from 'canvas-confetti';
import { MorphableRecipe, CuisineStyle } from '../../types';

interface CookingModeModalProps {
  isOpen: boolean;
  recipe: MorphableRecipe;
  selectedStyle: CuisineStyle;
  onClose: () => void;
  onFinishCook: () => void;
}

export const CookingModeModal: React.FC<CookingModeModalProps> = ({
  isOpen,
  recipe,
  selectedStyle,
  onClose,
  onFinishCook,
}) => {
  const styleData = recipe.styles[selectedStyle];
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // Timer State (default to 3 minutes for quick demo or step timing)
  const [timeLeft, setTimeLeft] = useState(180);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      // Play ding sound or vibrate if available
      try {
        if ('vibrate' in navigator) navigator.vibrate([200, 100, 200]);
      } catch {}
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, timeLeft]);

  if (!isOpen) return null;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCompleteAll = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
    onFinishCook();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-3xl shadow-2xl p-6 sm:p-8 flex flex-col max-h-[90vh] overflow-hidden">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <span className="text-3xl">{styleData.flag}</span>
            <div>
              <div className="flex items-center space-x-2 text-xs text-emerald-400 font-bold uppercase tracking-wider">
                <ChefHat className="w-4 h-4" />
                <span>Active Guided Cook Mode</span>
              </div>
              <h3 className="text-lg font-bold text-white mt-0.5">{styleData.title}</h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Timer Bar */}
        <div className="mt-4 p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-emerald-400">
              <Timer className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Skillet Step Timer
              </span>
              <span className="font-mono text-2xl font-bold text-white tracking-wider">
                {formatTime(timeLeft)}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm ${
                isTimerRunning
                  ? 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
              }`}
            >
              {isTimerRunning ? (
                <>
                  <Pause className="w-4 h-4" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  <span>Start</span>
                </>
              )}
            </button>

            <button
              onClick={() => {
                setIsTimerRunning(false);
                setTimeLeft(180);
              }}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition"
              title="Reset timer to 3:00"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Progress Tracker */}
        <div className="mt-5 flex items-center justify-between text-xs text-slate-400">
          <span>Step {currentStepIndex + 1} of {styleData.steps.length}</span>
          <span>{Math.round(((currentStepIndex + 1) / styleData.steps.length) * 100)}% Complete</span>
        </div>
        <div className="w-full h-1.5 bg-slate-800 rounded-full mt-2 overflow-hidden">
          <div
            className="h-full bg-emerald-500 rounded-full transition-all duration-300"
            style={{ width: `${((currentStepIndex + 1) / styleData.steps.length) * 100}%` }}
          />
        </div>

        {/* Current Step Big Card */}
        <div className="mt-6 flex-1 overflow-y-auto pr-2">
          <div className="p-6 rounded-2xl bg-slate-950/70 border border-slate-800/90 shadow-inner">
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider block mb-2">
              Action Item #{currentStepIndex + 1}
            </span>
            <p className="text-base sm:text-lg text-slate-100 font-medium leading-relaxed">
              {styleData.steps[currentStepIndex]}
            </p>
          </div>

          {/* Chef Tip Callout */}
          <div className="mt-4 p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/20 text-xs text-emerald-300 flex items-start space-x-2.5">
            <span className="text-base">💡</span>
            <div>
              <span className="font-bold block text-white">Chef's Morphing Tip:</span>
              <p className="text-slate-300 mt-0.5">{styleData.chefTip}</p>
            </div>
          </div>
        </div>

        {/* Navigation Step Buttons */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
          <button
            disabled={currentStepIndex === 0}
            onClick={() => setCurrentStepIndex((prev) => Math.max(0, prev - 1))}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition"
          >
            Previous Step
          </button>

          {currentStepIndex < styleData.steps.length - 1 ? (
            <button
              onClick={() => setCurrentStepIndex((prev) => prev + 1)}
              className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition shadow-md shadow-emerald-500/20"
            >
              Next Step →
            </button>
          ) : (
            <button
              onClick={handleCompleteAll}
              className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs transition shadow-xl shadow-emerald-500/30 active:scale-95"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Finish Cooking & Auto-Deduct Fridge!</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

