import React, { useState } from 'react';
import { 
  X, 
  CreditCard, 
  Lock, 
  ShieldCheck, 
  RefreshCw 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PlanDefinition, BillingCycle, SubscriptionTier } from '../../types';
import { useFocusTrap } from '../../hooks/useFocusTrap';

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
  const modalRef = useFocusTrap(isOpen, onClose);
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
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface-950/90 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="checkout-modal-title"
    >
      <div 
        ref={modalRef}
        className="bg-surface-900 border border-surface-border w-full max-w-lg rounded-3xl shadow-2xl p-6 sm:p-8 relative overflow-hidden"
      >
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-surface-border">
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-kitchen-500/20 text-kitchen-400">
              <Lock className="w-5 h-5" aria-hidden="true" />
            </span>
            <div>
              <div className="text-[11px] font-bold text-kitchen-400 uppercase tracking-wider">
                Stripe 256-Bit Encrypted
              </div>
              <h3 id="checkout-modal-title" className="text-lg font-black text-content-primary">Upgrade to {plan.name}</h3>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close checkout modal"
            className="min-w-[44px] min-h-[44px] flex items-center justify-center text-content-muted hover:text-content-primary rounded-xl hover:bg-surface-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kitchen-500 transition"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Plan Summary Card */}
        <div className="mt-4 p-4 rounded-2xl bg-surface-950/80 border border-surface-border flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-bold text-content-primary">{plan.name}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-kitchen-500/20 text-kitchen-400 font-bold uppercase">
                {billingCycle}
              </span>
            </div>
            <p className="text-xs text-content-muted mt-0.5">{plan.tagline}</p>
          </div>

          <div className="text-right">
            <div className="text-lg font-black text-content-primary font-mono">
              ${finalTotal.toFixed(2)}
            </div>
            <span className="text-[10px] text-content-muted">
              {billingCycle === 'annual' ? `/year ($${rawMonthlyPrice}/mo)` : '/month'}
            </span>
          </div>
        </div>

        {/* Payment Type Selector */}
        <div className="mt-4 grid grid-cols-3 gap-2" role="group" aria-label="Payment method selection">
          <button
            type="button"
            onClick={() => setPaymentMethodType('card')}
            aria-pressed={paymentMethodType === 'card'}
            className={`min-h-[44px] py-2 px-3 rounded-xl text-xs font-bold border transition flex items-center justify-center space-x-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kitchen-500 ${
              paymentMethodType === 'card'
                ? 'bg-surface-800 border-kitchen-500 text-content-primary shadow-sm'
                : 'bg-surface-950/40 border-surface-border text-content-muted hover:text-content-primary'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5 text-kitchen-400" aria-hidden="true" />
            <span>Card</span>
          </button>

          <button
            type="button"
            onClick={() => setPaymentMethodType('apple_pay')}
            aria-pressed={paymentMethodType === 'apple_pay'}
            className={`min-h-[44px] py-2 px-3 rounded-xl text-xs font-bold border transition flex items-center justify-center space-x-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kitchen-500 ${
              paymentMethodType === 'apple_pay'
                ? 'bg-surface-800 border-kitchen-500 text-content-primary shadow-sm'
                : 'bg-surface-950/40 border-surface-border text-content-muted hover:text-content-primary'
            }`}
          >
            <span> Pay</span>
          </button>

          <button
            type="button"
            onClick={() => setPaymentMethodType('google_pay')}
            aria-pressed={paymentMethodType === 'google_pay'}
            className={`min-h-[44px] py-2 px-3 rounded-xl text-xs font-bold border transition flex items-center justify-center space-x-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kitchen-500 ${
              paymentMethodType === 'google_pay'
                ? 'bg-surface-800 border-kitchen-500 text-content-primary shadow-sm'
                : 'bg-surface-950/40 border-surface-border text-content-muted hover:text-content-primary'
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
                <label htmlFor="checkout-card-number" className="block text-xs font-semibold text-content-secondary mb-1">
                  Card Number
                </label>
                <div className="relative">
                  <CreditCard className="w-4 h-4 text-content-muted absolute left-3 top-1/2 -translate-y-1/2" aria-hidden="true" />
                  <input
                    id="checkout-card-number"
                    type="text"
                    required
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 min-h-[44px] rounded-xl bg-surface-950 border border-surface-border text-content-primary text-xs focus:outline-none focus:border-kitchen-500 font-mono focus:ring-1 focus:ring-kitchen-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="checkout-card-expiry" className="block text-xs font-semibold text-content-secondary mb-1">
                    Expiration
                  </label>
                  <input
                    id="checkout-card-expiry"
                    type="text"
                    required
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    className="w-full px-3 py-2.5 min-h-[44px] rounded-xl bg-surface-950 border border-surface-border text-content-primary text-xs focus:outline-none focus:border-kitchen-500 font-mono focus:ring-1 focus:ring-kitchen-500"
                  />
                </div>

                <div>
                  <label htmlFor="checkout-card-cvc" className="block text-xs font-semibold text-content-secondary mb-1">
                    CVC / Security Code
                  </label>
                  <input
                    id="checkout-card-cvc"
                    type="text"
                    required
                    value={cardCvc}
                    onChange={(e) => setCardCvc(e.target.value)}
                    className="w-full px-3 py-2.5 min-h-[44px] rounded-xl bg-surface-950 border border-surface-border text-content-primary text-xs focus:outline-none focus:border-kitchen-500 font-mono focus:ring-1 focus:ring-kitchen-500"
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
                aria-label="Promotional coupon code"
                className="flex-1 px-3 py-2 min-h-[44px] rounded-xl bg-surface-950 border border-surface-border text-content-primary text-xs focus:outline-none focus:border-kitchen-500 font-mono uppercase focus:ring-1 focus:ring-kitchen-500"
              />
              <button
                type="button"
                onClick={handleApplyPromo}
                className="min-h-[44px] px-4 py-2 rounded-xl bg-surface-800 hover:bg-surface-750 text-content-primary text-xs font-semibold border border-surface-700 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kitchen-500"
              >
                Apply
              </button>
            </div>
            {discountApplied && (
              <span className="text-[11px] text-kitchen-400 font-semibold block mt-1" role="status">
                ✓ 20% Founder discount applied to subscription!
              </span>
            )}
          </div>

          {/* Action CTA */}
          <div className="pt-4 border-t border-surface-border">
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full min-h-[44px] flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-kitchen-500 hover:bg-kitchen-400 text-surface-950 font-black text-xs uppercase tracking-wider transition shadow-lg shadow-kitchen-500/25 active:scale-98 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kitchen-400"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" aria-hidden="true" />
                  <span>Processing Secure Checkout...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" aria-hidden="true" />
                  <span>Pay ${finalTotal.toFixed(2)} & Activate {plan.name}</span>
                </>
              )}
            </button>
            <p className="text-[10px] text-center text-content-muted mt-2 flex items-center justify-center gap-1">
              <ShieldCheck className="w-3 h-3 text-kitchen-400" aria-hidden="true" />
              <span>Cancel anytime in 1-click • Instant receipt saved to database</span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};


