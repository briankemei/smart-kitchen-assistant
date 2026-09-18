import React, { useState, useEffect } from 'react';
import { X, Play, Pause, RotateCcw, CheckCircle2, ChefHat, Timer } from 'lucide-react';
import confetti from 'canvas-confetti';
import { MorphableRecipe, CuisineStyle } from '../../types';
import { useFocusTrap } from '../../hooks/useFocusTrap';

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
  const modalRef = useFocusTrap(isOpen, onClose);
  const styleData = recipe.styles[selectedStyle];
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // Timer State (default to 3 minutes for quick demo or step timing)
  const [timeLeft, setTimeLeft] = useState(180);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            try {
              if ('vibrate' in navigator) navigator.vibrate([200, 100, 200]);
            } catch {
              // ignore vibration error
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
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
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface-950/90 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cooking-mode-title"
    >
      <div 
        ref={modalRef}
        className="bg-surface-900 border border-surface-border w-full max-w-2xl rounded-3xl shadow-2xl p-6 sm:p-8 flex flex-col max-h-[90vh] overflow-hidden"
      >
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-surface-border">
          <div className="flex items-center space-x-3">
            <span className="text-3xl" aria-hidden="true">{styleData.flag}</span>
            <div>
              <div className="flex items-center space-x-2 text-xs text-kitchen-400 font-bold uppercase tracking-wider">
                <ChefHat className="w-4 h-4" aria-hidden="true" />
                <span>Active Guided Cook Mode</span>
              </div>
              <h3 id="cooking-mode-title" className="text-lg font-bold text-content-primary mt-0.5">{styleData.title}</h3>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close cooking mode"
            className="min-w-[44px] min-h-[44px] flex items-center justify-center text-content-muted hover:text-content-primary rounded-xl hover:bg-surface-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kitchen-500 transition"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Timer Bar */}
        <div className="mt-4 p-4 rounded-2xl bg-surface-950/80 border border-surface-border flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-surface-900 border border-surface-border text-kitchen-400">
              <Timer className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <span className="text-[11px] font-semibold text-content-muted uppercase tracking-wider block">
                Skillet Step Timer
              </span>
              <span className="font-mono text-2xl font-bold text-content-primary tracking-wider" aria-label={`Time remaining: ${formatTime(timeLeft)}`}>
                {formatTime(timeLeft)}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              aria-label={isTimerRunning ? 'Pause step timer' : 'Start step timer'}
              className={`min-h-[44px] min-w-[44px] flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kitchen-400 ${
                isTimerRunning
                  ? 'bg-biotech-amber hover:bg-amber-400 text-surface-950'
                  : 'bg-kitchen-500 hover:bg-kitchen-400 text-surface-950'
              }`}
            >
              {isTimerRunning ? (
                <>
                  <Pause className="w-4 h-4" aria-hidden="true" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" aria-hidden="true" />
                  <span>Start</span>
                </>
              )}
            </button>

            <button
              onClick={() => {
                setIsTimerRunning(false);
                setTimeLeft(180);
              }}
              className="min-w-[44px] min-h-[44px] flex items-center justify-center text-content-muted hover:text-content-primary hover:bg-surface-800 rounded-xl transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kitchen-500"
              aria-label="Reset timer to 3:00"
              title="Reset timer to 3:00"
            >
              <RotateCcw className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Progress Tracker */}
        <div className="mt-5 flex items-center justify-between text-xs text-content-muted">
          <span>Step {currentStepIndex + 1} of {styleData.steps.length}</span>
          <span className="font-mono">{Math.round(((currentStepIndex + 1) / styleData.steps.length) * 100)}% Complete</span>
        </div>
        <div className="w-full h-1.5 bg-surface-800 rounded-full mt-2 overflow-hidden" role="progressbar" aria-valuenow={Math.round(((currentStepIndex + 1) / styleData.steps.length) * 100)} aria-valuemin={0} aria-valuemax={100}>
          <div
            className="h-full bg-kitchen-500 rounded-full transition-all duration-300"
            style={{ width: `${((currentStepIndex + 1) / styleData.steps.length) * 100}%` }}
          />
        </div>

        {/* Current Step Big Card */}
        <div className="mt-6 flex-1 overflow-y-auto pr-2">
          <div className="p-6 rounded-2xl bg-surface-950/70 border border-surface-border shadow-inner">
            <span className="text-xs font-mono font-bold text-kitchen-400 uppercase tracking-wider block mb-2">
              Action Item #{currentStepIndex + 1}
            </span>
            <p className="text-base sm:text-lg text-content-primary font-medium leading-relaxed">
              {styleData.steps[currentStepIndex]}
            </p>
          </div>

          {/* Chef Tip Callout */}
          <div className="mt-4 p-4 rounded-xl bg-kitchen-950/30 border border-kitchen-500/20 text-xs text-kitchen-300 flex items-start space-x-2.5">
            <span className="text-base" aria-hidden="true">💡</span>
            <div>
              <span className="font-bold block text-content-primary">Chef's Morphing Tip:</span>
              <p className="text-content-secondary mt-0.5">{styleData.chefTip}</p>
            </div>
          </div>
        </div>

        {/* Navigation Step Buttons */}
        <div className="mt-6 pt-4 border-t border-surface-border flex items-center justify-between">
          <button
            disabled={currentStepIndex === 0}
            onClick={() => setCurrentStepIndex((prev) => Math.max(0, prev - 1))}
            className="min-h-[44px] px-4 py-2 rounded-xl text-xs font-semibold text-content-muted hover:text-content-primary disabled:opacity-30 disabled:cursor-not-allowed transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kitchen-500"
          >
            Previous Step
          </button>

          {currentStepIndex < styleData.steps.length - 1 ? (
            <button
              onClick={() => setCurrentStepIndex((prev) => prev + 1)}
              className="min-h-[44px] px-6 py-2.5 rounded-xl bg-kitchen-500 hover:bg-kitchen-400 text-surface-950 font-bold text-xs transition shadow-md shadow-kitchen-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kitchen-400"
            >
              Next Step →
            </button>
          ) : (
            <button
              onClick={handleCompleteAll}
              className="min-h-[44px] flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-kitchen-500 hover:bg-kitchen-400 text-surface-950 font-black text-xs transition shadow-xl shadow-kitchen-500/30 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kitchen-400"
            >
              <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
              <span>Finish Cooking & Auto-Deduct Fridge!</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};


