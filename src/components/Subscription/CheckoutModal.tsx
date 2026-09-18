import React, { useState } from 'react';
import { 
  X, 
  CreditCard, 
  Lock, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight,
  RefreshCw 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PlanDefinition, BillingCycle, SubscriptionTier } from '../../types';

interface CheckoutModalProps {
  isOpen: boolean;
  plan: PlanDefinition;
  billingCycle: BillingCycle;
  onClose: () => void;
  onSuccess: (tier: SubscriptionTier, billingCycle: BillingCycle, paymentMethod: string, price: number) => Promise<void>;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  plan,
  billingCycle,
  onClose,
  onSuccess,
}) => {
  const [paymentMethodType, setPaymentMethodType] = useState<'card' | 'apple_pay' | 'google_pay'>('card');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('888');
  const [promoCode, setPromoCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const rawMonthlyPrice = billingCycle === 'annual' ? plan.annualPricePerMonth : plan.monthlyPrice;
  const multiplier = billingCycle === 'annual' ? 12 : 1;
  const baseTotal = rawMonthlyPrice * multiplier;
  const finalTotal = discountApplied ? baseTotal * 0.8 : baseTotal;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'BIOHACK20' || promoCode.trim().toUpperCase() === 'KITCHEN20') {
      setDiscountApplied(true);
    } else {
      alert('Try promo code: BIOHACK20 for 20% off!');
    }
  };

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate payment gateway delay (e.g. Stripe checkout)
    await new Promise((resolve) => setTimeout(resolve, 1400));

    const paymentLabel = paymentMethodType === 'card' 
      ? `•••• ${cardNumber.slice(-4)} (Visa)` 
      : paymentMethodType === 'apple_pay' 
      ? 'Apple Pay' 
      : 'Google Pay';

    await onSuccess(plan.tier, billingCycle, paymentLabel, rawMonthlyPrice);

    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
    });

    setIsProcessing(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-3xl shadow-2xl p-6 sm:p-8 relative overflow-hidden">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
              <Lock className="w-5 h-5" />
            </span>
            <div>
              <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
                Stripe 256-Bit Encrypted
              </div>
              <h3 className="text-lg font-black text-white">Upgrade to {plan.name}</h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Plan Summary Card */}
        <div className="mt-4 p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-bold text-white">{plan.name}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold uppercase">
                {billingCycle}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{plan.tagline}</p>
          </div>

          <div className="text-right">
            <div className="text-lg font-black text-white font-mono">
              ${finalTotal.toFixed(2)}
            </div>
            <span className="text-[10px] text-slate-400">
              {billingCycle === 'annual' ? '/year ($' + rawMonthlyPrice + '/mo)' : '/month'}
            </span>
          </div>
        </div>

        {/* Payment Type Selector */}
        <div className="mt-4 grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => setPaymentMethodType('card')}
            className={`py-2 px-3 rounded-xl text-xs font-bold border transition flex items-center justify-center space-x-1.5 ${
              paymentMethodType === 'card'
                ? 'bg-slate-800 border-emerald-500 text-white shadow-sm'
                : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
            <span>Card</span>
          </button>

          <button
            type="button"
            onClick={() => setPaymentMethodType('apple_pay')}
            className={`py-2 px-3 rounded-xl text-xs font-bold border transition flex items-center justify-center space-x-1.5 ${
              paymentMethodType === 'apple_pay'
                ? 'bg-slate-800 border-emerald-500 text-white shadow-sm'
                : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <span> Pay</span>
          </button>

          <button
            type="button"
            onClick={() => setPaymentMethodType('google_pay')}
            className={`py-2 px-3 rounded-xl text-xs font-bold border transition flex items-center justify-center space-x-1.5 ${
              paymentMethodType === 'google_pay'
                ? 'bg-slate-800 border-emerald-500 text-white shadow-sm'
                : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <span>G Pay</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handlePay} className="mt-4 space-y-4">
          {paymentMethodType === 'card' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Card Number
                </label>
                <div className="relative">
                  <CreditCard className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Expiration
                  </label>
                  <input
                    type="text"
                    required
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    CVC / Security Code
                  </label>
                  <input
                    type="text"
                    required
                    value={cardCvc}
                    onChange={(e) => setCardCvc(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Promo Code Bar */}
          <div className="pt-2">
            <div className="flex space-x-2">
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder="Promo code (try BIOHACK20)"
                className="flex-1 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500 font-mono uppercase"
              />
              <button
                type="button"
                onClick={handleApplyPromo}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
              >
                Apply
              </button>
            </div>
            {discountApplied && (
              <span className="text-[11px] text-emerald-400 font-semibold block mt-1">
                ✓ 20% Founder discount applied to subscription!
              </span>
            )}
          </div>

          {/* Action CTA */}
          <div className="pt-4 border-t border-slate-800">
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full flex items-center justify-center space-x-2 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs uppercase tracking-wider transition shadow-lg shadow-emerald-500/25 active:scale-98 disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Processing Secure Checkout...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Pay ${finalTotal.toFixed(2)} & Activate {plan.name}</span>
                </>
              )}
            </button>
            <p className="text-[10px] text-center text-slate-500 mt-2 flex items-center justify-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>Cancel anytime in 1-click • Instant receipt saved to database</span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

